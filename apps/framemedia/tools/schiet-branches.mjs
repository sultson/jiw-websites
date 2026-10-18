// Alleen het branchesblok, in een paar breedtes, om de omslag van staand naar
// liggend te bekijken. node tools/schiet-branches.mjs [url]
import { chromium } from 'playwright';

const basis = process.argv[2] || 'http://localhost:4174';
const browser = await chromium.launch();
for (const breedte of [1440, 1100, 940, 900, 390]) {
  const ctx = await browser.newContext({ viewport: { width: breedte, height: 1000 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(basis + '/puurgenieten/', { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
  });
  await page.waitForTimeout(700);
  const blok = page.locator('.branches');
  await blok.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await blok.screenshot({ path: `shots/branches-${breedte}.png` });
  await ctx.close();
}
await browser.close();
console.log('klaar');
