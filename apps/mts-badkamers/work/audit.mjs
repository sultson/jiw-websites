// Visuele audit: sectie-voor-sectie screenshots, desktop + mobiel.
import { chromium, devices } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain' };
const srv = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join('site', p);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('nope'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => srv.listen(8901, r));
const OUT = 'work/audit';
fs.mkdirSync(OUT, { recursive: true });

const b = await chromium.launch();
for (const [lbl, opts] of [['d', { viewport: { width: 1440, height: 900 } }], ['m', { ...devices['iPhone 13'] }]]) {
  const ctx = await b.newContext(opts);
  const pg = await ctx.newPage();
  await pg.goto('http://localhost:8901/', { waitUntil: 'networkidle' });
  await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } scrollTo(0, 0); });
  await pg.waitForTimeout(900);
  // stukje voor stukje: elke section
  const secs = await pg.$$eval('body > main > section, header.hero, .hero', (els) => els.map((e, i) => e.id || e.className.split(' ')[0] || 'sec' + i));
  console.log(lbl, 'secties:', secs.join(', '));
  let i = 0;
  for (const sel of await pg.$$('body > main > section, .hero')) {
    const id = await sel.evaluate((e) => e.id || e.className.split(' ')[0]);
    await sel.scrollIntoViewIfNeeded().catch(() => {});
    await pg.waitForTimeout(350);
    await sel.screenshot({ path: `${OUT}/${lbl}-${String(i).padStart(2, '0')}-${id}.png` }).catch((e) => console.log('skip', id, e.message.slice(0, 60)));
    i++;
  }
  // projectpagina
  await pg.goto('http://localhost:8901/werk/terrazzo-met-vrijstaand-bad/', { waitUntil: 'networkidle' });
  await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } scrollTo(0, 0); });
  await pg.waitForTimeout(800);
  await pg.screenshot({ path: `${OUT}/${lbl}-proj-full.png`, fullPage: true });
  await ctx.close();
}
await b.close(); srv.close();
console.log('klaar');
