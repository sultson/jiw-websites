// Landen op een anker (nav -> /#voorna, of een gedeelde link) mag geen onzichtbare
// koppen achterlaten: alles boven het scherm is nooit "in beeld gekomen" en bleef
// daarom op opacity 0 staan. Test elk anker in de nav, chromium en webkit.
import { chromium, webkit, devices } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.xml': 'application/xml', '.mp4': 'video/mp4', '.txt': 'text/plain' };
const srv = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join('site', p);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('nope'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => srv.listen(8895, r));
const BASE = 'http://127.0.0.1:8895';

let fails = 0;
const ok = (c, m) => { console.log(`${c ? '  ok  ' : ' FOUT '} ${m}`); if (!c) fails++; };

for (const [eng, name] of [[chromium, 'chromium'], [webkit, 'webkit']]) {
  const b = await eng.launch();
  for (const [lbl, opts] of [['desktop', { viewport: { width: 1440, height: 900 } }], ['mobiel', { ...devices['iPhone 13'] }]]) {
    const ctx = await b.newContext(opts);
    const pg = await ctx.newPage();
    await pg.goto(BASE + '/', { waitUntil: 'load' });
    // De nav linkt met /#anker (werkt ook vanaf een projectpagina), dus niet op
    // href^="#" filteren -- dan matchte er niks en meldde de test vals groen.
    const anchors = await pg.$$eval('.nav a[href*="#"], .foot a[href*="#"]', (as) =>
      [...new Set(as.map((a) => '#' + a.getAttribute('href').split('#')[1]).filter((h) => h.length > 1 && h !== '#main'))],
    );
    ok(anchors.length > 2, `${name}/${lbl}: ${anchors.length} ankers gevonden (${anchors.join(' ')})`);
    for (const a of anchors) {
      await pg.goto(BASE + '/' + a, { waitUntil: 'load' });
      await pg.waitForTimeout(700);
      // alles boven de onderkant van het scherm moet zichtbaar zijn
      // Alleen klagen over blokken die echt ruim in beeld staan. Een element dat
      // net met een randje onder de fold begint hoort nog onzichtbaar te zijn --
      // dat is de reveal-animatie, geen bug. Drempel: meer dan de helft, of meer
      // dan 200px, van het blok staat in het scherm.
      const hidden = await pg.$$eval('.reveal', (els) =>
        els
          .map((el) => {
            const r = el.getBoundingClientRect();
            const vis = Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0));
            return { el, vis, frac: r.height ? vis / r.height : 0, top: Math.round(r.top), op: +getComputedStyle(el).opacity };
          })
          .filter((x) => x.op < 0.9 && (x.frac > 0.5 || x.vis > 200))
          .map((x) => `${x.el.className.replace(/\s+/g, '.')}@${x.top}(${Math.round(x.frac * 100)}%)`),
      );
      ok(hidden.length === 0, `${name}/${lbl}: /${a} - ${hidden.length ? 'onzichtbaar: ' + hidden.join(' | ') : 'alles in beeld is zichtbaar'}`);
    }
    await ctx.close();
  }
  await b.close();
}
srv.close();
console.log(fails ? `\n${fails} FOUT(EN)` : '\nankers laten niks onzichtbaar achter');
process.exit(fails ? 1 : 0);
