import { chromium } from 'playwright';
const BASE = 'http://127.0.0.1:8788';
const b = await chromium.launch();
for (const [tag, vp] of [['desk', { width: 1440, height: 940 }], ['mob', { width: 390, height: 844 }]]) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: tag === 'mob', hasTouch: tag === 'mob' });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `work/fin-${tag}-hero.png` });
  for (const [name, sel] of [['rev', '#reviews'], ['map', '#werkgebied'], ['over', '#over']]) {
    const el = await page.$(sel);
    if (!el) { console.log(tag, name, 'MISSING'); continue; }
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(name === 'map' ? 6000 : 900);
    await el.screenshot({ path: `work/fin-${tag}-${name}.png` });
  }
  await ctx.close();
}
await b.close();
console.log('ok');
