// Schiet elke voor/na-tab met de scheidingslijn in het midden, zodat je in één
// beeld ziet of links echt "voor" is en rechts "na".
import { chromium, devices } from 'playwright';
import sharp from 'sharp';
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1200, height: 900 } });
const pg = await ctx.newPage();
await pg.goto(BASE + '/', { waitUntil: 'networkidle' });
await pg.locator('#ba').scrollIntoViewIfNeeded();
await pg.waitForTimeout(2800);
const tabs = await pg.$$('.ba-tab');
const shots = [];
for (let i = 0; i < tabs.length; i++) {
  await tabs[i].click();
  await pg.waitForTimeout(500);
  await pg.$eval('#baRange', (r) => { r.value = '50'; r.dispatchEvent(new Event('input', { bubbles: true })); });
  await pg.waitForTimeout(400);
  const name = await tabs[i].textContent();
  shots.push({ name: name.trim(), buf: await pg.locator('#ba .ba-stage').screenshot() });
}
await b.close();
const W = 320, LAB = 24;
const metas = await Promise.all(shots.map(s => sharp(s.buf).metadata()));
const H = Math.round(W * metas[0].height / metas[0].width);
const tiles = [];
for (const [k, s] of shots.entries()) {
  tiles.push({ input: await sharp(s.buf).resize(W, H, { fit: 'fill' }).toBuffer(), left: (k % 3) * W, top: Math.floor(k / 3) * (H + LAB) + LAB });
  tiles.push({ input: Buffer.from(`<svg width="${W}" height="${LAB}"><rect width="100%" height="100%" fill="#111"/><text x="6" y="18" font-size="15" fill="#0f0" font-family="monospace">${s.name} (links=voor)</text></svg>`), left: (k % 3) * W, top: Math.floor(k / 3) * (H + LAB) });
}
await sharp({ create: { width: W * 3, height: (H + LAB) * Math.ceil(shots.length / 3), channels: 3, background: '#111' } })
  .composite(tiles).jpeg({ quality: 86 }).toFile('work/ba-shot.jpg');
console.log('work/ba-shot.jpg', shots.map(s => s.name).join(', '));
