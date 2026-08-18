import { chromium, devices } from 'playwright';

const BASE = process.env.BASE || 'https://m-techno-service-concept.jouwidealewebsite.nl';
const PATHS = (process.env.PATHS || '/,/werk/terrazzo-met-vrijstaand-bad/').split(',');
const browser = await chromium.launch();

for (const p of PATHS) {
  const ctx = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await ctx.newPage();
  await page.goto(BASE + p, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(1500);
  console.log(`\n===== ${p}`);
  const rails = await page.$$('.rail');
  console.log(`rails: ${rails.length}`);
  for (let i = 0; i < rails.length; i++) {
    const r = rails[i];
    const info = await r.evaluate((el) => ({
      label: el.getAttribute('aria-label') || el.className,
      client: el.clientWidth, scroll: el.scrollWidth,
      touch: getComputedStyle(el).touchAction,
    }));
    await r.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const box = await r.boundingBox();
    if (!box) { console.log(`  ${i} ${info.label}: geen box`); continue; }
    const before = await r.evaluate((el) => el.scrollLeft);
    // echte touch-swipe
    const y = Math.min(box.y + box.height / 2, 600);
    await page.evaluate(({ x1, y1, x2 }) => {
      const el = document.elementFromPoint(x1, y1);
      const mk = (type, x) => new TouchEvent(type, {
        bubbles: true, cancelable: true,
        touches: type === 'touchend' ? [] : [new Touch({ identifier: 1, target: el, clientX: x, clientY: y1 })],
        changedTouches: [new Touch({ identifier: 1, target: el, clientX: x, clientY: y1 })],
      });
      el.dispatchEvent(mk('touchstart', x1));
      for (let x = x1; x > x2; x -= 20) el.dispatchEvent(mk('touchmove', x));
      el.dispatchEvent(mk('touchend', x2));
    }, { x1: box.x + box.width - 40, y1: y, x2: box.x + 40 });
    await page.waitForTimeout(700);
    const after = await r.evaluate((el) => el.scrollLeft);
    console.log(`  ${i} [${info.label}] client=${info.client} scroll=${info.scroll} touchAction=${info.touch} swipe: ${before} -> ${after} ${after > before ? 'OK' : 'GEEN BEWEGING'}`);
  }
  const arrows = await page.evaluate(() => [...document.querySelectorAll('.rail-b')].map((b) => getComputedStyle(b).display));
  console.log('  pijlknoppen display op mobiel:', JSON.stringify(arrows.slice(0, 6)));
  await ctx.close();
}
await browser.close();
