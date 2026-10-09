// Measures the two things the 5 Oct feedback asked for and the one thing they can break:
//   1. the spec table header stays on screen while the table scrolls past (shipping)
//   2. the availability key stays on screen while the chart scrolls past (catalogue)
//   3. neither wrapper blows the mobile layout viewport out, which is what the
//      contain:paint they replaced was there to prevent
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const DIST = path.join(ROOT, 'dist');
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
  '.mp4': 'video/mp4' };
const server = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]);
  let f = path.join(DIST, p);
  if (p.endsWith('/')) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { r.writeHead(404); return r.end('x'); }
  r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' });
  r.end(fs.readFileSync(f));
});
await new Promise(res => server.listen(0, res));
const base = process.argv[2] || `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
let fail = 0;
const ok = (c, m) => { console.log(`${c ? 'ok  ' : 'FAIL'} ${m}`); if (!c) fail++; };

for (const [w, h, label] of [[1440, 900, 'desktop'], [390, 844, 'phone 390'], [360, 740, 'phone 360']]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });

  // ---- spec table header
  await page.goto(base + '/shipping/', { waitUntil: 'networkidle' });
  const tbl = await page.evaluate(() => {
    const t = document.querySelector('.tbl');
    const r = t.getBoundingClientRect();
    return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
  });
  // Below 760px the wrapper is its own scrollport, so the thing to scroll is the box and
  // not the page; above it the table is part of the document flow. Scroll whichever one
  // actually moves, then ask the same question of both: is the header still on screen.
  await page.evaluate(y => {
    const w = document.querySelector('.tbl-wrap');
    if (w.scrollHeight > w.clientHeight + 4) {
      w.scrollIntoView({ block: 'start' });
      window.scrollBy(0, -90);
      w.scrollTop = w.scrollHeight * 0.66;
    } else window.scrollTo(0, y);
  }, tbl.top + (tbl.bottom - tbl.top) * 0.66);
  await page.waitForTimeout(150);
  const th = await page.evaluate(() => {
    const el = document.querySelector('.tbl thead th');
    const w = document.querySelector('.tbl-wrap');
    const r = el.getBoundingClientRect(), wr = w.getBoundingClientRect();
    const hdr = document.querySelector('.hdr').getBoundingClientRect();
    const inner = w.scrollHeight > w.clientHeight + 4;
    // scrolled past at least a few rows, otherwise the test proves nothing
    const moved = inner ? w.scrollTop : window.scrollY;
    return { top: r.top, bottom: r.bottom, floor: inner ? wr.top : hdr.bottom,
      vh: innerHeight, moved, text: el.textContent.trim() };
  });
  ok(th.moved > 100 && th.top >= th.floor - 2 && th.bottom <= th.vh,
    `${label}: spec header "${th.text}" stays pinned after ${th.moved.toFixed(0)}px of scroll (top ${th.top.toFixed(0)}, floor ${th.floor.toFixed(0)})`);

  // ---- availability key + month row
  await page.goto(base + '/catalogue/', { waitUntil: 'networkidle' });
  const av = await page.evaluate(() => {
    const t = document.querySelector('.avail');
    const r = t.getBoundingClientRect();
    return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
  });
  await page.evaluate(y => {
    const w = document.querySelector('.avail-scroll');
    if (w.scrollHeight > w.clientHeight + 4) {
      w.scrollIntoView({ block: 'start' });
      window.scrollBy(0, -140);
      w.scrollTop = w.scrollHeight * 0.7;
    } else window.scrollTo(0, y);
  }, av.top + (av.bottom - av.top) * 0.7);
  await page.waitForTimeout(150);
  const key = await page.evaluate(() => {
    const w = document.querySelector('.avail-scroll');
    const k = document.querySelector('.a-key').getBoundingClientRect();
    const m = document.querySelector('.avail thead th:last-child').getBoundingClientRect();
    const hdr = document.querySelector('.hdr').getBoundingClientRect();
    const wr = w.getBoundingClientRect();
    const inner = w.scrollHeight > w.clientHeight + 4;
    return { kTop: k.top, kBottom: k.bottom, mTop: m.top, mBottom: m.bottom,
      hdrBottom: hdr.bottom, mFloor: inner ? wr.top : k.bottom,
      moved: inner ? w.scrollTop : window.scrollY, vh: innerHeight,
      room: inner ? w.scrollHeight - w.clientHeight : document.documentElement.scrollHeight };
  });
  ok(key.kTop >= key.hdrBottom - 2 && key.kBottom <= key.vh,
    `${label}: availability key pinned on screen (top ${key.kTop.toFixed(0)}, bottom ${key.kBottom.toFixed(0)}, vh ${key.vh})`);
  // At some widths the chart nearly fits its box, so there is less than 100px to scroll
  // past. Demand whatever room there actually is rather than a fixed number.
  const want = Math.min(100, key.room - 1);
  ok(key.moved >= want && key.mTop >= key.mFloor - 2 && key.mBottom <= key.vh,
    `${label}: month row still pinned after ${key.moved.toFixed(0)}px of scroll, of ${key.room.toFixed(0)}px available (top ${key.mTop.toFixed(0)}, floor ${key.mFloor.toFixed(0)})`);

  // ---- the key must not wrap out of its fixed band
  const keyFits = await page.evaluate(() => {
    const k = document.querySelector('.a-key');
    return { h: k.getBoundingClientRect().height, scroll: k.scrollWidth, client: k.clientWidth };
  });
  ok(keyFits.h <= 48, `${label}: key stays one band high (${keyFits.h.toFixed(0)}px)`);

  // ---- layout viewport not blown out by either wide table
  for (const p of ['/catalogue/', '/shipping/', '/', '/about/', '/contact/']) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(over <= 1, `${label}: ${p} no horizontal overflow (${over}px)`);
  }
  await page.close();
}

// ---- the video is there, has the still as its poster, and does not preload
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base + '/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.querySelector('.trip').scrollIntoView({ block: 'center' }));
await page.waitForTimeout(600);
const v = await page.evaluate(() => {
  const el = document.querySelector('.trip video');
  if (!el) return null;
  const src = el.querySelector('source');
  const fig = el.closest('figure');
  const cap = fig.querySelector('figcaption').getBoundingClientRect();
  const box = fig.getBoundingClientRect();
  return { poster: el.poster, preload: el.preload, controls: el.controls, src: src && src.src,
    label: el.getAttribute('aria-label'),
    capAtBottom: Math.abs(cap.bottom - box.bottom) < 2,
    capClickThrough: getComputedStyle(fig.querySelector('figcaption')).pointerEvents === 'none',
    capInsideArch: cap.top >= box.top + parseFloat(getComputedStyle(fig).borderTopLeftRadius) - 2,
    controlsOff: el.controls === false,
    btnShown: !fig.querySelector('.vplay').hidden,
    fills: Math.abs(el.getBoundingClientRect().width - box.width) < 2
        && Math.abs(el.getBoundingClientRect().height - box.height) < 2 };
});
ok(!!v, 'home: the packhouse figure is a video');
ok(v && /packhouse-\d+\.jpg$/.test(v.poster), `home: poster is the packhouse still (${v && v.poster.split('/').pop()})`);
ok(v && v.preload === 'none', 'home: video does not preload');
ok(v && v.controlsOff && v.btnShown, 'home: native controls swapped for the play disc');
ok(v && v.fills, 'home: video fills the arch exactly');
ok(v && v.capInsideArch, 'home: caption clears the arch curve rather than being sliced by it');
ok(v && /\/v\/packhouse-[0-9a-f]{8}\.mp4$/.test(v.src), `home: video src is hashed (${v && v.src.split('/').pop()})`);
ok(v && v.capAtBottom, 'home: caption sits at the bottom like its neighbours');
ok(v && v.capClickThrough, 'home: caption does not swallow the click to play');
const res = await page.evaluate(async () => {
  const r = await fetch(document.querySelector('.trip video source').src, { method: 'HEAD' });
  return r.status;
});
ok(res === 200, `home: the video file is actually served (${res})`);
await page.close();

await browser.close();
server.close();
console.log(fail ? `\n${fail} FAILED` : '\nall good');
process.exit(fail ? 1 : 0);
