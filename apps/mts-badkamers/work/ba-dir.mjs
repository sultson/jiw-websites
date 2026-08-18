// Bewijst per pixel welke kant op de wipe loopt -- geen "ik denk dat het goed staat".
//   knop op 0   moet exact de VOOR-foto zijn (na volledig weggeknipt)
//   knop op 100 moet exact de NA-foto zijn   (na volledig zichtbaar)
// Referentie: dezelfde stage met de clip-path handmatig uitgezet (pure na) of
// helemaal dichtgeknepen (pure voor). Vergelijken met een gemiddelde pixelafwijking;
// bij een omgekeerde wipe schiet die van ~0 naar tientallen.
import { chromium, webkit, devices } from 'playwright';
import sharp from 'sharp';
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
await new Promise((r) => srv.listen(8897, r));
const BASE = 'http://127.0.0.1:8897';

let fails = 0;
const ok = (c, m) => { console.log(`${c ? '  ok  ' : ' FOUT '} ${m}`); if (!c) fails++; };

// png-buffer -> platte rgb-pixels
const px = async (buf) => {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, ch: info.channels };
};
// gemiddelde afwijking per kanaal over een horizontale band (from..to in delen van de breedte)
const bandDiff = (A, B, from = 0, to = 1) => {
  if (A.w !== B.w || A.h !== B.h) return 999;
  const x0 = Math.round(A.w * from) + (from > 0 ? 4 : 0);
  const x1 = Math.round(A.w * to) - (to < 1 ? 4 : 0);
  let s = 0, n = 0;
  for (let y = 0; y < A.h; y += 2) {
    for (let x = x0; x < x1; x += 2) {
      const i = (y * A.w + x) * A.ch;
      s += Math.abs(A.data[i] - B.data[i]) + Math.abs(A.data[i + 1] - B.data[i + 1]) + Math.abs(A.data[i + 2] - B.data[i + 2]);
      n += 3;
    }
  }
  return n ? s / n : 999;
};

for (const [eng, name] of [[chromium, 'chromium'], [webkit, 'webkit']]) {
  const b = await eng.launch();
  for (const [lbl, opts] of [['desktop', { viewport: { width: 1440, height: 900 } }], ['mobiel', { ...devices['iPhone 13'] }]]) {
    const ctx = await b.newContext(opts);
    const pg = await ctx.newPage();
    await pg.goto(BASE + '/', { waitUntil: 'load' });
    await pg.locator('#ba').scrollIntoViewIfNeeded();
    await pg.waitForTimeout(3200); // intro-veeg uit laten lopen
    const stage = pg.locator('#ba .ba-stage');
    // de lijn zelf weghalen, die staat bij 0/100 op de rand en vervuilt de diff
    await pg.addStyleTag({ content: '.ba-div{display:none!important}' });

    const setRange = async (v) => {
      await pg.$eval('#baRange', (r, v) => { r.value = String(v); r.dispatchEvent(new Event('input', { bubbles: true })); }, v);
      await pg.waitForTimeout(120);
    };
    const refs = async (mode) => {
      await pg.$eval('#baNa', (n, m) => { n.style.clipPath = m === 'na' ? 'none' : 'inset(0 100% 0 0)'; }, mode);
      await pg.waitForTimeout(120);
      const shot = await stage.screenshot();
      await pg.$eval('#baNa', (n) => { n.style.clipPath = ''; });
      return shot;
    };

    const pureNa = await px(await refs('na'));
    const pureVoor = await px(await refs('voor'));

    await setRange(0);
    const at0 = await px(await stage.screenshot());
    await setRange(100);
    const at100 = await px(await stage.screenshot());

    const d0v = bandDiff(at0, pureVoor), d0n = bandDiff(at0, pureNa);
    const d1n = bandDiff(at100, pureNa), d1v = bandDiff(at100, pureVoor);
    ok(d0v < 2 && d0v < d0n, `${name}/${lbl}: knop op 0 = de VOOR-foto (afwijking voor ${d0v.toFixed(1)} vs na ${d0n.toFixed(1)})`);
    ok(d1n < 2 && d1n < d1v, `${name}/${lbl}: knop op 100 = de NA-foto (afwijking na ${d1n.toFixed(1)} vs voor ${d1v.toFixed(1)})`);

    // en de helften bij de lijn in het midden: links na, rechts voor
    await setRange(50);
    const mid = await px(await stage.screenshot());
    const lNa = bandDiff(mid, pureNa, 0, 0.5), lVoor = bandDiff(mid, pureVoor, 0, 0.5);
    const rVoor = bandDiff(mid, pureVoor, 0.5, 1), rNa = bandDiff(mid, pureNa, 0.5, 1);
    ok(lNa < lVoor, `${name}/${lbl}: linkerhelft is NA (${lNa.toFixed(1)} vs voor ${lVoor.toFixed(1)})`);
    ok(rVoor < rNa, `${name}/${lbl}: rechterhelft is VOOR (${rVoor.toFixed(1)} vs na ${rNa.toFixed(1)})`);

    // Labels horen op de as (de schuifbalk): Voor aan het linker uiteinde, Na aan
    // het rechter -- en nergens meer op de helften, want die wisselen van eigenaar.
    const lbls = await pg.evaluate(() => {
      const b = Array.from(document.querySelectorAll('#ba .ba-slide-lbl b')).map((e) => e.textContent.replace(/[^A-Za-z]/g, ''));
      const stage = document.querySelector('#ba .ba-stage');
      const onHalves = stage.querySelectorAll('.ba-badge').length;
      return { first: b[0], last: b[b.length - 1], onHalves };
    });
    ok(lbls.first === 'Voor' && lbls.last === 'Na', `${name}/${lbl}: schuifbalk loopt Voor (links) -> Na (rechts), niet ${lbls.first}->${lbls.last}`);
    ok(lbls.onHalves === 0, `${name}/${lbl}: geen VOOR/NA-label op de helften (${lbls.onHalves})`);

    await ctx.close();
  }
  await b.close();
}
srv.close();
console.log(fails ? `\n${fails} FOUT(EN)` : '\nrichting van de wipe klopt');
process.exit(fails ? 1 : 0);
