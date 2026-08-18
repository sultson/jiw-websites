// Schiet het hele Voor & na-blok (foto + bediening) op desktop en mobiel, met de
// lijn in het midden, zodat je de nieuwe schuifbalk-labels kunt beoordelen.
import { chromium, devices } from 'playwright';
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
await new Promise((r) => srv.listen(8896, r));

const b = await chromium.launch();
for (const [lbl, opts] of [['desk', { viewport: { width: 1280, height: 900 } }], ['mob', { ...devices['iPhone 13'] }]]) {
  const ctx = await b.newContext(opts);
  const pg = await ctx.newPage();
  await pg.goto('http://127.0.0.1:8896/', { waitUntil: 'load' });
  await pg.locator('#ba').scrollIntoViewIfNeeded();
  await pg.waitForTimeout(3200);
  await pg.$eval('#baRange', (r) => { r.value = '50'; r.dispatchEvent(new Event('input', { bubbles: true })); });
  await pg.waitForTimeout(300);
  await pg.locator('#voorna').screenshot({ path: `work/look-${lbl}.png` });
  await ctx.close();
}
await b.close();
srv.close();
console.log('work/look-desk.png work/look-mob.png');
