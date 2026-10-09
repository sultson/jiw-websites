// Measures how bright each page head actually renders, and the contrast the
// headline and lead keep against the pixels directly behind them.
// Usage: node tools/_bright.mjs [baseUrl]
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const DIST = path.join(ROOT, 'dist');
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

const lum = (r, g, b) => {
  const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

// Mean and worst-case luminance of a crop of a screenshot buffer. The worst
// case is what decides whether a letter disappears: the mean can sit at a
// comfortable ratio while one bright patch of the photograph -- a white rose,
// a floodlight -- swallows the glyph sitting on top of it. Worst case is read
// as a 16px box mean rather than a single pixel, which is roughly the area of
// one stroke of type and ignores lone speckles.
async function patch(buf, box) {
  const W = Math.max(1, Math.round(box.w)), H = Math.max(1, Math.round(box.h));
  const { data, info } = await sharp(buf)
    .extract({ left: Math.round(box.x), top: Math.round(box.y), width: W, height: H })
    .raw().toBuffer({ resolveWithObject: true });
  const px = [];
  for (let i = 0; i < data.length; i += info.channels) px.push(lum(data[i], data[i + 1], data[i + 2]));
  const mean = px.reduce((a, b) => a + b, 0) / px.length;
  let worst = 0;
  const S = 16;
  for (let y = 0; y + 1 < info.height; y += 4) {
    for (let x = 0; x + 1 < info.width; x += 4) {
      let s = 0, n = 0;
      for (let dy = 0; dy < S && y + dy < info.height; dy++)
        for (let dx = 0; dx < S && x + dx < info.width; dx++) { s += px[(y + dy) * info.width + (x + dx)]; n++; }
      if (s / n > worst) worst = s / n;
    }
  }
  return { mean, worst };
}

const PAGES = [['catalogue', '/catalogue/'], ['shipping', '/shipping/'], ['about', '/about/'], ['contact', '/contact/'], ['availability', '/availability/']];
// Widths either side of the 760px breakpoint: the gradient stops are
// percentages, so they land on different pixels as the copy column reflows.
const VIEWS = [['1920', 1920, 1000], ['1440', 1440, 900], ['1280', 1280, 800], ['1024', 1024, 768],
  ['820', 820, 1180], ['760', 760, 900], ['414', 414, 896], ['390', 390, 844], ['360', 360, 740]];

const b = await chromium.launch();
for (const [vname, w, h] of VIEWS) {
  const page = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  console.log(`\n== ${vname} ${w}x${h}`);
  for (const [name, url] of PAGES) {
    await page.goto(base + url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    const geo = await page.evaluate(() => {
      const sec = document.querySelector('.phead');
      if (!sec) return null;
      const g = el => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; };
      return { sec: g(sec), h1: g(sec.querySelector('h1')), lead: g(sec.querySelector('.lead')) };
    });
    if (!geo) { console.log(`  ${name}: no .phead`); continue; }
    const shot = await page.screenshot();
    const sec = { x: 0, y: Math.max(0, geo.sec.y), w, h: Math.min(h, geo.sec.y + geo.sec.h) - Math.max(0, geo.sec.y) };
    const band = await patch(shot, sec);

    // Hide the glyphs and shoot again, so the backdrop is sampled at the exact
    // rect the text occupies rather than guessed at from a strip beside it.
    await page.addStyleTag({ content: '.phead h1,.phead .lead{color:transparent!important;text-shadow:none!important}' });
    await page.waitForTimeout(80);
    const bare = await page.screenshot();
    const out = [];
    for (const k of ['h1', 'lead']) {
      const t = geo[k]; if (!t || t.y + t.h > h) continue;
      const p = await patch(bare, { x: t.x, y: t.y, w: Math.min(t.w, w - t.x), h: t.h });
      out.push(`${k} ${ratio(p.mean, 1).toFixed(1)}:1 (worst ${ratio(p.worst, 1).toFixed(1)}:1)`);
    }
    console.log(`  ${name.padEnd(11)} band ${band.mean.toFixed(3)}   ${out.join('   ')}`);
  }
  await page.close();
}
await b.close();
server?.close();
