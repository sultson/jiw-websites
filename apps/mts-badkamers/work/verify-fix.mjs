// Controleert de twee reparaties op WebKit (iPhone) en Chromium:
//   1. de hero toont één foto, geen sleepbare wipe
//   2. het Voor & na-blok heeft een zichtbare foto (was 0x0 in WebKit)
// Plus: sleeptest op de wipe die er nog wel is, en overflow/console-check.
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
await new Promise((r) => srv.listen(8899, r));
const BASE = 'http://127.0.0.1:8899';

let fails = 0;
const ok = (c, m) => { console.log(`${c ? '  ok  ' : ' FOUT '} ${m}`); if (!c) fails++; };

for (const [eng, name] of [[webkit, 'webkit'], [chromium, 'chromium']]) {
  const b = await eng.launch();
  for (const [lbl, opts] of [
    ['mobiel ', { ...devices['iPhone 13'] }],
    ['desktop', { viewport: { width: 1440, height: 900 } }],
  ]) {
    const ctx = await b.newContext(opts);
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    page.on('pageerror', (e) => errs.push(String(e)));
    page.on('response', (r) => r.status() >= 400 && errs.push(`${r.status()} ${r.url()}`));
    await page.goto(BASE + '/', { waitUntil: 'load' });
    console.log(`\n== ${name} / ${lbl.trim()} ==`);

    // 1. hero
    const hero = await page.evaluate(() => {
      const s = document.querySelector('.hero-shot');
      const img = s?.querySelector('img');
      const r = s?.getBoundingClientRect();
      return {
        h: r ? Math.round(r.height) : 0,
        w: r ? Math.round(r.width) : 0,
        loaded: !!img?.complete && img.naturalWidth > 0,
        top: r ? Math.round(r.top) : null,
        wipeWeg: !document.getElementById('heroBa') && !document.querySelector('.hero .ba-div'),
      };
    });
    ok(hero.w > 100 && hero.h > 100, `hero-foto ${hero.w}x${hero.h}`);
    ok(hero.loaded, 'hero-foto geladen');
    ok(hero.wipeWeg, 'geen slider meer in de hero');

    // 2. voor & na
    await page.evaluate(() => document.querySelector('#voorna').scrollIntoView());
    await page.waitForTimeout(1400);
    const ba = await page.evaluate(() => {
      const st = document.querySelector('#ba .ba-stage');
      const r = st.getBoundingClientRect();
      const im = (id) => { const e = document.getElementById(id); const b = e.getBoundingClientRect(); return { w: Math.round(b.w || b.width), h: Math.round(b.height), on: e.complete && e.naturalWidth > 0 }; };
      return { w: Math.round(r.width), h: Math.round(r.height), voor: im('baVoor'), na: im('baNa'), wipe: getComputedStyle(st).getPropertyValue('--wipe') };
    });
    ok(ba.w > 100 && ba.h > 100, `voor/na-stage ${ba.w}x${ba.h}`);
    ok(ba.voor.h > 100 && ba.voor.on, `voor-foto ${ba.voor.w}x${ba.voor.h} geladen=${ba.voor.on}`);
    ok(ba.na.h > 100 && ba.na.on, `na-foto ${ba.na.w}x${ba.na.h} geladen=${ba.na.on}`);

    // 3. slepen op het voor/na-blok komt uit op de plek waar je loslaat
    const stageLoc = page.locator('#ba .ba-stage');
    await stageLoc.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    const box = await stageLoc.boundingBox();
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.5, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(120);
    const w = await page.evaluate(() => ({
      wipe: parseFloat(getComputedStyle(document.querySelector('#ba .ba-stage')).getPropertyValue('--wipe')),
      range: +document.getElementById('baRange').value,
    }));
    ok(Math.abs(w.wipe - 20) < 3, `sleep naar 20% -> lijn op ${w.wipe.toFixed(1)}%`);
    ok(Math.abs(w.range - 20) < 3, `schuifknop volgt mee (${w.range})`);

    // 3b. de intro-veeg mag een handmatige sleep niet alsnog wegtrekken
    await page.waitForTimeout(2800);
    const after = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('#ba .ba-stage')).getPropertyValue('--wipe')));
    ok(Math.abs(after - w.wipe) < 1, `blijft na 2,8s staan op ${after.toFixed(1)}%`);

    // 4. tabs wisselen het paar
    await page.click('.ba-tab:nth-child(3)');
    await page.waitForTimeout(500);
    const swapped = await page.evaluate(() => document.getElementById('baVoor').getAttribute('src'));
    ok(!!swapped, `tab wisselt naar ${swapped.split('/').pop()}`);

    // 5. hele pagina: overflow + hoogte
    const m = await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
      scrollTo(0, 0);
      return { over: document.documentElement.scrollWidth > innerWidth + 1, h: document.documentElement.scrollHeight, vh: innerHeight };
    });
    ok(!m.over, `geen horizontale overloop (hoogte ${(m.h / m.vh).toFixed(1)} schermen)`);
    ok(errs.length === 0, `geen fouten${errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''}`);
    await ctx.close();
  }
  await b.close();
}
srv.close();
console.log(fails ? `\n${fails} FOUT(EN)` : '\nalles goed');
process.exit(fails ? 1 : 0);
