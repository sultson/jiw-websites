import { chromium, devices } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const OUT = 'work/shots';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

// mobiel: de rail met de projecten, plus de nieuwe compacte secties
const m = await browser.newContext({ ...devices['iPhone 13'] });
const mp = await m.newPage();
await mp.goto(BASE + '/', { waitUntil: 'load' });
await mp.waitForTimeout(1200);
for (const [name, sel] of [
  ['m-projecten', '#projecten'],
  ['m-reviews', '#reviews'],
  ['m-diensten', '#diensten'],
  ['m-faq', '#faq'],
  ['m-contact', '#contact'],
]) {
  const el = await mp.$(sel);
  await el.scrollIntoViewIfNeeded();
  await mp.waitForTimeout(500);
  await el.screenshot({ path: `${OUT}/${name}.png` });
}
// rail met pijl: eerst wat opzij scrollen zodat beide pijlen te zien zijn
await mp.evaluate(() => { const r = document.querySelector('.rail'); r.scrollLeft = 500; });
await mp.waitForTimeout(600);
await (await mp.$('#projecten')).screenshot({ path: `${OUT}/m-rail-mid.png` });
// projectpagina
await mp.goto(BASE + '/werk/terrazzo-met-vrijstaand-bad/', { waitUntil: 'load' });
await mp.waitForTimeout(1200);
const st = await mp.$$('.story');
await st[0].scrollIntoViewIfNeeded();
await mp.waitForTimeout(500);
await st[0].screenshot({ path: `${OUT}/m-story.png` });
await m.close();

// desktop: hele homepage in delen
const d = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const dp = await d.newPage();
await dp.goto(BASE + '/', { waitUntil: 'load' });
await dp.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 45)); } scrollTo(0, 0); });
await dp.waitForTimeout(900);
for (const [name, sel] of [['d-projecten', '#projecten'], ['d-reviews', '#reviews'], ['d-diensten', '#diensten'], ['d-faq', '#faq'], ['d-contact', '#contact']]) {
  const el = await dp.$(sel);
  await el.scrollIntoViewIfNeeded();
  await dp.waitForTimeout(400);
  await el.screenshot({ path: `${OUT}/${name}.png` });
}
await d.close();
await browser.close();
console.log('klaar');
