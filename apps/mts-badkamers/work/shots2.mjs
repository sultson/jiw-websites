// Schone viewport-opnames (geen element-screenshots: die bakken de sticky nav mee).
import { chromium, devices } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const OUT = 'work/shots2';
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

async function run(label, opts, url, anchors) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  await page.goto(BASE + url, { waitUntil: 'load' });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 45)); } scrollTo(0, 0); });
  await page.waitForTimeout(900);
  for (const a of anchors) {
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      scrollTo(0, el.getBoundingClientRect().top + scrollY - 70);
    }, a);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/${label}-${a.replace(/\W/g, '')}.png` });
  }
  await ctx.close();
}

await run('m', { ...devices['iPhone 13'] }, '/', ['#projecten', '#reviews', '#diensten', '#faq', '#contact']);
await run('d', { viewport: { width: 1440, height: 900 } }, '/', ['#projecten', '#reviews', '#diensten', '#faq']);
await run('mp', { ...devices['iPhone 13'] }, '/werk/terrazzo-met-vrijstaand-bad/', ['.story']);
await browser.close();
console.log('klaar');
