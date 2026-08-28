// iPhone-check op alle pagina's in WebKit (de motor van Safari). Zoekt naar
// blokken die in Chromium wel en in WebKit niet getekend worden: 0-hoogte dozen,
// foto's die niet laden, rails die niet scrollen, horizontale overloop.
import { webkit, devices } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.mp4': 'video/mp4', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json' };
const srv = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join('site', p);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('nope'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => srv.listen(8902, r));

// site/werk bevat sinds de projecthub ook een index.html; alleen de mappen zijn
// projectpagina's.
const pages = [
  '/',
  '/werk/',
  ...['badkamerrenovatie', 'toiletrenovatie', 'tegelwerk', 'loodgieter-en-cv'].map((d) => `/${d}/`),
  ...fs
    .readdirSync('site/werk')
    .filter((d) => fs.statSync(`site/werk/${d}`).isDirectory())
    .map((d) => `/werk/${d}/`),
  '/404.html',
];
const b = await webkit.launch();
let bad = 0;
for (const [lbl, opts] of [['mobiel', { ...devices['iPhone 13'] }], ['desktop', { viewport: { width: 1440, height: 900 } }]]) {
  const ctx = await b.newContext(opts);
  const pg = await ctx.newPage();
  for (const p of pages) {
    const errs = [];
    pg.removeAllListeners();
    pg.on('pageerror', (e) => errs.push(String(e).slice(0, 90)));
    pg.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 90)));
    pg.on('response', (r) => r.status() >= 400 && errs.push(`${r.status()} ${r.url().split('/').pop()}`));
    await pg.goto('http://127.0.0.1:8902' + p, { waitUntil: 'load' });
    await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 35)); } scrollTo(0, 0); });
    await pg.waitForTimeout(600);
    const r = await pg.evaluate(() => {
      const zero = [];
      // dozen die beeld horen te tonen maar geen hoogte hebben
      document.querySelectorAll('.ba-stage, .hero-shot, .ph, .card-img, .over-img, .p-hero-art, .rail').forEach((el) => {
        const b = el.getBoundingClientRect();
        if (b.width < 8 || b.height < 8) zero.push(`${el.className.split(' ')[0]} ${Math.round(b.width)}x${Math.round(b.height)}`);
      });
      // alleen echt kapot: binnengehaald maar zonder pixels. Nog-niet-geladen
      // lazy foto's onder de vouw zijn geen fout.
      const imgs = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => (i.currentSrc || i.src).split('/').pop());
      // Een rail met één item hoort niet te scrollen; die verbergt zijn eigen
      // pijlen en teller ook. Alleen meerdere items die niet uitsteken is fout.
      const rails = [...document.querySelectorAll('[data-rail]')].map((w) => {
        const t = w.querySelector('.rail');
        if (!t) return 'geen .rail';
        if (t.scrollWidth > t.clientWidth + 4) return 'ok';
        // past in beeld: dan horen de pijlen, teller en balk ook weg te zijn
        const foot = w.querySelector('.rail-foot');
        return !foot || getComputedStyle(foot).display === 'none' ? 'ok' : `pijlen zonder scroll (${t.scrollWidth}/${t.clientWidth})`;
      });
      return { zero, imgs, rails: rails.filter((x) => x !== 'ok'), over: document.documentElement.scrollWidth > innerWidth + 1, h: Math.round(document.documentElement.scrollHeight / innerHeight * 10) / 10 };
    });
    const probs = [
      r.zero.length ? `0-groot: ${r.zero.join(', ')}` : '',
      r.imgs.length ? `foto's niet geladen: ${r.imgs.slice(0, 4).join(', ')}` : '',
      r.rails.length ? `rails: ${r.rails.join(', ')}` : '',
      r.over ? 'horizontale overloop' : '',
      errs.length ? `fouten: ${[...new Set(errs)].slice(0, 3).join(' | ')}` : '',
    ].filter(Boolean);
    if (probs.length) { bad++; console.log(`FOUT ${lbl} ${p}\n     ${probs.join('\n     ')}`); }
    else console.log(`ok   ${lbl} ${p} (${r.h} schermen)`);
  }
  await ctx.close();
}
await b.close();
srv.close();
console.log(bad ? `\n${bad} pagina(s) met problemen` : '\nalle pagina\'s schoon in WebKit');
process.exit(bad ? 1 : 0);
