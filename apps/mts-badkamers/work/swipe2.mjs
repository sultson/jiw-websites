import { chromium, devices } from 'playwright';

const BASE = process.env.BASE || 'https://m-techno-service-concept.jouwidealewebsite.nl';
const PATHS = (process.env.PATHS || '/,/werk/terrazzo-met-vrijstaand-bad/').split(',');
const browser = await chromium.launch();

for (const p of PATHS) {
  const ctx = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await page.goto(BASE + p, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(1500);
  console.log(`\n===== ${p}`);
  const rails = await page.$$('.rail');
  for (let i = 0; i < rails.length; i++) {
    const r = rails[i];
    const label = await r.evaluate((el) => el.getAttribute('aria-label') || el.className);
    await r.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const box = await r.boundingBox();
    if (!box) { console.log(`  ${i} ${label}: geen box`); continue; }
    const y = Math.round(box.y + Math.min(box.height / 2, 200));
    // niet vanaf de uiterste rand beginnen: daar staan nu de pijlknoppen
    const x1 = Math.round(box.x + box.width - 12);
    const x2 = Math.round(box.x + box.width * 0.15);
    const before = await r.evaluate((el) => el.scrollLeft);
    const pageYbefore = await page.evaluate(() => scrollY);
    const touch = (x) => [{ x, y, radiusX: 12, radiusY: 12, force: 1, id: 1 }];
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: touch(x1) });
    for (let x = x1; x > x2; x -= 25) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: touch(x) });
      await page.waitForTimeout(16);
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(900);
    const after = await r.evaluate((el) => el.scrollLeft);
    const pageYafter = await page.evaluate(() => scrollY);
    console.log(`  ${i} [${label}] swipe: ${before} -> ${after} ${after > before ? 'OK' : 'GEEN BEWEGING'}  (pagina y ${pageYbefore} -> ${pageYafter})`);
  }
  await ctx.close();
}
await browser.close();
