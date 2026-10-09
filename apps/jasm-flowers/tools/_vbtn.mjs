// Does the play disc actually go away once the clip runs, and does it stop eating clicks
// meant for the native controls? Pass a base URL to probe live, or nothing for dist/.
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
let base = process.argv[2], srv;
if (!base) {
  srv = http.createServer((q, r) => {
    let p = decodeURIComponent(q.url.split('?')[0]);
    let f = path.join('dist', p);
    if (p.endsWith('/')) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) { r.writeHead(404); return r.end('x'); }
    r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' });
    r.end(fs.readFileSync(f));
  });
  await new Promise(r => srv.listen(0, r));
  base = `http://127.0.0.1:${srv.address().port}`;
}

const b = await chromium.launch();
let bad = 0;
for (const [n, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
  const c = await b.newContext({ viewport: { width: w, height: h } });
  const p = await c.newPage();
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  const fig = p.locator('.trip figure.v');
  await fig.scrollIntoViewIfNeeded();
  const btn = fig.locator('.vplay');
  const read = () => btn.evaluate(e => ({ hidden: e.hidden, display: getComputedStyle(e).display, boxes: e.getClientRects().length }));
  const before = await read();
  await btn.click({ force: true });
  await p.waitForTimeout(1200);
  const after = await read();
  const vid = await fig.locator('video').evaluate(v => ({ paused: v.paused, t: +v.currentTime.toFixed(2), controls: v.controls }));
  // Whatever sits under the pointer in the middle of the frame must be the video now,
  // not a hidden-but-still-painted button swallowing the controls.
  const box = await fig.boundingBox();
  const top = await p.evaluate(([x, y]) => {
    const e = document.elementFromPoint(x, y);
    return e ? (e.tagName.toLowerCase() + (e.className ? '.' + String(e.className).split(' ')[0] : '')) : 'none';
  }, [box.x + box.width / 2, box.y + box.height / 2]);

  const ok = before.boxes > 0 && after.boxes === 0 && after.display === 'none' && !vid.paused && vid.controls && top === 'video';
  if (!ok) bad++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${n}  before ${JSON.stringify(before)}  after ${JSON.stringify(after)}  video ${JSON.stringify(vid)}  under cursor: ${top}`);
  await c.close();
}
await b.close();
if (srv) srv.close();
console.log(bad ? `${bad} failed` : 'all good');
process.exit(bad ? 1 : 0);
