import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, 'shots');
fs.mkdirSync(OUT, { recursive: true });
const EXT = process.argv[2];

const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
let server, base = EXT;
if (!EXT) {
  server = http.createServer((q, r) => {
    let p = decodeURIComponent(q.url.split('?')[0]);
    let f = path.join(DIST, p);
    if (p.endsWith('/')) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) { r.writeHead(404); return r.end('x'); }
    r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' });
    r.end(fs.readFileSync(f));
  });
  await new Promise(r => server.listen(0, r));
  base = `http://127.0.0.1:${server.address().port}`;
}

const b = await chromium.launch();
const shots = [
  ['home', '/', 1440, 900, false],
  ['home-m', '/', 390, 844, false],
  ['home-full', '/', 1440, 900, true],
  ['catalogue', '/catalogue/', 1440, 900, true],
  ['catalogue-m', '/catalogue/', 390, 844, false],
  ['shipping', '/shipping/', 1440, 900, true],
  ['about', '/about/', 1440, 900, true],
  ['contact', '/contact/', 1440, 900, true],
];
for (const [name, url, w, h, full] of shots) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const pg = await ctx.newPage();
  await pg.goto(base + url, { waitUntil: 'networkidle' });
  await pg.evaluate(async () => {
    const step = innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      scrollTo(0, y); await new Promise(r => setTimeout(r, 60));
    }
    scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 400));
  });
  await pg.waitForTimeout(500);
  await pg.screenshot({ path: path.join(OUT, name + '.png'), fullPage: full });
  await ctx.close();
  console.log('shot', name);
}
await b.close();
if (server) server.close();
