// Schiet de hero op desktop en mobiel, aan het begin van de video en aan het eind,
// en meet of de hele hero op een iPhone 13 boven de vouw past.
import { chromium, webkit } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

// Eigen servertje: python -m http.server is enkeldradig en blijft hangen op de
// videostream, waardoor `waitUntil: load` nooit afkomt.
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json' };
const srv = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join('site', p);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('nope'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise(r => srv.listen(8903, r));

const BASE = process.env.BASE || 'http://127.0.0.1:8903';

const VIEWS = [
  { tag: 'desk', engine: chromium, vp: { width: 1440, height: 900 } },
  { tag: 'mob', engine: webkit, vp: { width: 390, height: 664 }, mobile: true },
];

for (const v of VIEWS) {
  const browser = await v.engine.launch();
  const ctx = await browser.newContext({
    viewport: v.vp,
    deviceScaleFactor: 2,
    isMobile: !!v.mobile,
    hasTouch: !!v.mobile,
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `work/gen/hero-${v.tag}-start.png` });
  await page.waitForTimeout(6000);
  await page.screenshot({ path: `work/gen/hero-${v.tag}-end.png` });

  const info = await page.evaluate(() => {
    const vid = document.querySelector('.hero-vid');
    const hero = document.querySelector('.hero');
    const r = hero.getBoundingClientRect();
    return {
      heroH: Math.round(r.height),
      vidPresent: !!vid,
      vidLive: vid ? vid.classList.contains('is-live') : null,
      vidTime: vid ? Number(vid.currentTime.toFixed(2)) : null,
      vidPaused: vid ? vid.paused : null,
      vidBox: vid ? [Math.round(vid.getBoundingClientRect().width), Math.round(vid.getBoundingClientRect().height)] : null,
      chip: getComputedStyle(document.querySelector('.trust-chip')).display,
      strip: [...document.querySelectorAll('.strip-in span')].filter(s => getComputedStyle(s).display !== 'none').length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  console.log(v.tag, JSON.stringify(info), errs.length ? 'ERRORS ' + errs.join('|') : 'no js errors');
  await browser.close();
}

srv.close();
