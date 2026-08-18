// Loopt alle pagina's langs: console-/netwerkfouten, horizontale overloop,
// en of elke rail werkelijk zijwaarts te scrollen is.
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.mp4': 'video/mp4',
  '.xml': 'application/xml', '.txt': 'text/plain',
};
const srv = http.createServer((q, s) => {
  let p = decodeURIComponent(q.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join('site', p);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); return s.end(''); }
  s.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(s);
});
await new Promise((r) => srv.listen(8907, r));

const pages = ['/', '/404.html', ...fs.readdirSync('site/werk').map((d) => `/werk/${d}/`)];
const b = await chromium.launch();
const problems = [];

for (const [tag, vp] of [
  ['desktop', { viewport: { width: 1440, height: 900 } }],
  ['mobiel', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }],
]) {
  const pg = await b.newPage(vp);
  pg.on('pageerror', (e) => problems.push(`${tag} JS: ${e.message}`));
  pg.on('console', (m) => m.type() === 'error' && problems.push(`${tag} console: ${m.text()}`));
  pg.on('response', (r) => r.status() >= 400 && problems.push(`${tag} ${r.status()} ${r.url()}`));

  for (const url of pages) {
    await pg.goto(`http://localhost:8907${url}`, { waitUntil: 'networkidle' });
    await pg.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('in')));
    await pg.waitForTimeout(120);
    const res = await pg.evaluate(() => {
      const overflow = document.documentElement.scrollWidth - window.innerWidth;
      const rails = Array.from(document.querySelectorAll('.rail')).map((r) => ({
        n: r.children.length,
        scrollable: r.scrollWidth - r.clientWidth,
        staticked: r.closest('[data-rail]').classList.contains('rail-static'),
        count: r.closest('[data-rail]').querySelector('.rail-count')?.textContent,
      }));
      return { overflow, rails, dock: !!document.getElementById('dock') };
    });
    if (res.overflow > 1) problems.push(`${tag} ${url}: horizontale overloop ${res.overflow}px`);
    if (!res.dock) problems.push(`${tag} ${url}: geen dock`);
    res.rails.forEach((r, i) => {
      if (r.scrollable > 4 && r.staticked) problems.push(`${tag} ${url} rail ${i}: scrollbaar maar als statisch gemarkeerd`);
      if (r.scrollable > 4 && r.count !== `1 / ${r.n}`) problems.push(`${tag} ${url} rail ${i}: teller "${r.count}" i.p.v. "1 / ${r.n}"`);
    });
  }
  await pg.close();
}

await b.close();
srv.close();
console.log(problems.length ? `PROBLEMEN (${problems.length}):\n` + problems.join('\n') : `Alles goed: ${pages.length} pagina's x 2 formaten.`);
