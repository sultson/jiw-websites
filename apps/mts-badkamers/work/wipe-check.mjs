// Controleert of de wipe echt beweegt: intro-veeg, slepen en de schuifknop.
import { chromium, devices } from 'playwright';
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const b = await chromium.launch();
let bad = 0;
for (const [lbl, opts] of [['desk', { viewport: { width: 1440, height: 900 } }], ['mob ', { ...devices['iPhone 13'] }]]) {
  const ctx = await b.newContext(opts);
  const pg = await ctx.newPage();
  await pg.goto(BASE + '/', { waitUntil: 'networkidle' });

  const wipeOf = (sel) => pg.evaluate((s) => getComputedStyle(document.querySelector(s)).getPropertyValue('--wipe').trim(), sel);

  // 1. intro-veeg. Stond op #heroBa, maar de hero heeft geen wipe meer -- die test
  //    gooide sindsdien een TypeError en liet de rest van het bestand niet lopen.
  //    De intro-veeg zit nu alleen nog op de voor/na-sectie zelf.
  await pg.locator('#ba').scrollIntoViewIfNeeded();
  const a = await wipeOf('#ba .ba-stage');
  await pg.waitForTimeout(1100);
  const c = await wipeOf('#ba .ba-stage');
  await pg.waitForTimeout(1700);
  const d = await wipeOf('#ba .ba-stage');
  const moved = a !== c && c !== d;
  console.log(lbl, 'intro-veeg', a, '->', c, '->', d, moved ? 'OK' : 'STIL');
  if (!moved) bad++;

  // 2. slepen op de voor/na in de sectie
  await pg.waitForTimeout(900);
  const stage = pg.locator('#ba .ba-stage');
  const box = await stage.boundingBox();
  const before = await pg.evaluate(() => getComputedStyle(document.querySelector('#ba .ba-stage')).getPropertyValue('--wipe').trim());
  await pg.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await pg.mouse.down();
  await pg.mouse.move(box.x + box.width * 0.15, box.y + box.height * 0.5, { steps: 8 });
  await pg.mouse.up();
  const after = await pg.evaluate(() => getComputedStyle(document.querySelector('#ba .ba-stage')).getPropertyValue('--wipe').trim());
  const dragOk = parseFloat(after) < 25 && before !== after;
  console.log(lbl, 'slepen', before, '->', after, dragOk ? 'OK' : 'FOUT');
  if (!dragOk) bad++;

  // 3. schuifknop stuurt hetzelfde beeld. --wipe is de stand van de lijn vanaf
  //    links en is gelijk aan de knopstand: 90 op de knop = lijn op 90%.
  await pg.$eval('#baRange', (r) => { r.value = '90'; r.dispatchEvent(new Event('input', { bubbles: true })); });
  const viaRange = await pg.evaluate(() => getComputedStyle(document.querySelector('#ba .ba-stage')).getPropertyValue('--wipe').trim());
  const rangeOk = Math.abs(parseFloat(viaRange) - 90) < 1.5;
  console.log(lbl, 'schuifknop 90 ->', viaRange, rangeOk ? 'OK' : 'FOUT');
  if (!rangeOk) bad++;

  // 4. tab wisselen laadt een ander paar
  const src0 = await pg.getAttribute('#baNa', 'src');
  await pg.click('.ba-tab[data-ba="3"]');
  await pg.waitForTimeout(600);
  const src1 = await pg.getAttribute('#baNa', 'src');
  console.log(lbl, 'tab wissel', src0 === src1 ? 'FOUT (zelfde foto)' : 'OK');
  if (src0 === src1) bad++;

  await ctx.close();
}
await b.close();
console.log(bad ? `${bad} probleem(en)` : 'wipe helemaal in orde');
process.exit(bad ? 1 : 0);
