// Losse uitsnedes om een onderdeel van dichtbij te bekijken.
//   node crop.mjs
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
await page.goto('http://localhost:4174/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.screenshot({ path: 'shots/crop-top.png', clip: { x: 0, y: 0, width: 1360, height: 900 } });
await page.locator('.zenders').screenshot({ path: 'shots/crop-zenders.png' });
await page.locator('.klantenband').screenshot({ path: 'shots/crop-marquee.png' });
await browser.close();
console.log('ok');
