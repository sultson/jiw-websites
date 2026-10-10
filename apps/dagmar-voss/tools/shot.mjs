/* Schermafdrukken van dist/ om naar te kijken. Schrijft naar shots/.
   Run: pnpm --filter @jiw/dagmar-voss shots */
import { chromium } from "playwright";
import { serveDist, shotPad } from "./serve.mjs";

const { url, stop } = await serveDist();

const browser = await chromium.launch();
const shots = [
  ["desktop", 1440, 1000, "/"],
  ["mobiel", 390, 844, "/"],
  ["contact", 1440, 1000, "/contact/"],
];
for (const [name, width, height, path] of shots) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  await page.goto(url + path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: await shotPad(`${name}.png`) });
  await page.screenshot({ path: await shotPad(`${name}-full.png`), fullPage: true });
  await page.close();
}
await browser.close();
await stop();
console.log("shots ok");
