/* Snijdt de vlakke witte achtergrond uit een gegenereerde illustratie weg.
   Flood fill vanaf de rand, zodat wit BINNEN de tekening (ogen, papier,
   raamkozijn) gewoon wit blijft. Rand daarna zacht met een 3x3 blur. */
import sharp from 'sharp';
import fs from 'fs';

const TOL = 14;

async function knip(bron, doel, breedte) {
  const {data, info} = await sharp(bron).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  const {width: w, height: h, channels} = info;
  if (channels !== 4) throw new Error('verwacht 4 kanalen, kreeg ' + channels);

  const bg = new Uint8Array(w * h);
  const stack = [];
  const isWit = (i) => data[i * 4] >= 255 - TOL && data[i * 4 + 1] >= 255 - TOL && data[i * 4 + 2] >= 255 - TOL;
  const duw = (i) => { if (!bg[i] && isWit(i)) {bg[i] = 1; stack.push(i);} };
  for (let x = 0; x < w; x++) { duw(x); duw((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { duw(y * w); duw(y * w + w - 1); }
  while (stack.length) {
    const i = stack.pop(), x = i % w, y = (i / w) | 0;
    if (x > 0) duw(i - 1);
    if (x < w - 1) duw(i + 1);
    if (y > 0) duw(i - w);
    if (y < h - 1) duw(i + w);
  }

  // zachte rand: 3x3 gemiddelde over het masker
  const alpha = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let som = 0, n = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const yy = y + dy, xx = x + dx;
      if (yy < 0 || yy >= h || xx < 0 || xx >= w) continue;
      som += bg[yy * w + xx] ? 0 : 255; n++;
    }
    alpha[y * w + x] = Math.round(som / n);
  }
  for (let i = 0; i < w * h; i++) data[i * 4 + 3] = alpha[i];

  // bijsnijden op wat overblijft
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (alpha[y * w + x] > 8) {
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  const m = 4;
  x0 = Math.max(0, x0 - m); y0 = Math.max(0, y0 - m);
  x1 = Math.min(w - 1, x1 + m); y1 = Math.min(h - 1, y1 + m);

  await sharp(Buffer.from(data), {raw: {width: w, height: h, channels: 4}})
    .extract({left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1})
    .resize({width: breedte, withoutEnlargement: true})
    .webp({quality: 90, alphaQuality: 95})
    .toFile(doel);

  const meta = await sharp(doel).metadata();
  const weg = (bg.reduce((a, b) => a + b, 0) / (w * h) * 100).toFixed(1);
  console.log(`${doel}  ${meta.width}x${meta.height}  ${(fs.statSync(doel).size / 1024).toFixed(0)} kB  (${weg}% weg)`);
}

for (const arg of process.argv.slice(2)) {
  const [bron, doel, breedte] = arg.split(':');
  await knip(bron, doel, Number(breedte));
}
