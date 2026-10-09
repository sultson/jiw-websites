// Turns the two client logo JPGs into transparent PNGs for the site.
//
// Both files are flat artwork photographed onto a uniform background (cream on one,
// bottle green on the other), so the background can be keyed out rather than masked
// by hand: alpha is the distance of each pixel from the sampled background colour,
// and the colour is un-mixed afterwards so the antialiased edges of the script
// lettering stay clean instead of carrying a halo of the old background.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'C:/Users/nieuw/dev/jiw-crm/uploads';
const OUT = path.resolve('assets/img');

const JOBS = [
  // key,            source jpg,                       how far from bg counts as fully opaque
  ['logo-light', `${SRC}/ratug7491yn6wut0qrvpp6xr.jpg`, 62],  // dark mark on cream -> for light UI
  ['logo-dark', `${SRC}/bcrkdf0umd7hvs4jhb0zhd8y.jpg`, 62],   // light mark on green -> for dark UI
];

for (const [key, src, span] of JOBS) {
  const img = sharp(src);
  const { width, height } = await img.metadata();
  const raw = await img.ensureAlpha().raw().toBuffer();

  // Background colour = median of a border ring, so a stray dark pixel in one corner
  // cannot decide the key for the whole image.
  const ring = [[], [], []];
  const px = (x, y) => (y * width + x) * 4;
  for (let x = 0; x < width; x += 2) {
    for (const y of [1, 2, height - 2, height - 3]) {
      const i = px(x, y);
      ring[0].push(raw[i]); ring[1].push(raw[i + 1]); ring[2].push(raw[i + 2]);
    }
  }
  const med = c => { const s = c.slice().sort((a, b) => a - b); return s[s.length >> 1]; };
  const bg = ring.map(med);

  const out = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const o = i * 4;
    const r = raw[o], g = raw[o + 1], b = raw[o + 2];
    const d = Math.sqrt((r - bg[0]) ** 2 + (g - bg[1]) ** 2 + (b - bg[2]) ** 2);
    let a = Math.min(1, d / span);
    // Un-mix: the observed pixel is alpha*ink + (1-alpha)*bg, so recover the ink.
    if (a > 0.004) {
      out[o] = Math.max(0, Math.min(255, Math.round(bg[0] + (r - bg[0]) / a)));
      out[o + 1] = Math.max(0, Math.min(255, Math.round(bg[1] + (g - bg[1]) / a)));
      out[o + 2] = Math.max(0, Math.min(255, Math.round(bg[2] + (b - bg[2]) / a)));
    }
    // Kill the JPEG noise floor: without it the whole background reads as 2% opaque
    // and shows up as a grey rectangle on any surface that is not the original.
    out[o + 3] = a < 0.06 ? 0 : Math.round(Math.min(1, (a - 0.06) / 0.94) * 255);
  }

  const dest = path.join(OUT, `${key}.png`);
  await sharp(out, { raw: { width, height, channels: 4 } })
    .png()
    .trim({ threshold: 1 })          // crop to the artwork, so layout can size on the mark itself
    .toFile(dest);
  const m = await sharp(dest).metadata();
  console.log(`${key}.png  bg=rgb(${bg})  ${m.width}x${m.height}`);
}
