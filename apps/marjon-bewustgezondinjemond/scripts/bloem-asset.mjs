/* Maakt van het aangeleverde logobestand (lijntekening op wit) een PNG met
   transparante achtergrond. De inkt is een vlakke kleur, dus de dekking van
   elke pixel volgt uit hoever hij van wit naar die inktkleur ligt. Zo blijft de
   antialiasing van de originele tekening netjes staan.

   node scripts/bloem-asset.mjs <bron.jpg> */

import sharp from 'sharp';
import {writeFileSync} from 'node:fs';

const bron = process.argv[2];
if (!bron) {
  console.error('gebruik: node scripts/bloem-asset.mjs <bron>');
  process.exit(1);
}

const UIT = 'public/img/bloem.png';
const MAAT = 640; // uitvoer, ruim boven elk formaat waarop hij scherp getoond wordt
const RAND = 1 / 18; // zelfde verhouding als de oude tekening: inkt is 90% van het vlak
const RUIS = 0.02; // alles daaronder is jpeg-ruis in de achtergrond

const {data, info} = await sharp(bron).raw().toBuffer({resolveWithObject: true});
const {width: w, height: h, channels: k} = info;

/* inktkleur = de meest voorkomende donkere pixel */
const telling = new Map();
for (let i = 0; i < data.length; i += k) {
  const l = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
  if (l < 110) {
    const sleutel = `${data[i]},${data[i + 1]},${data[i + 2]}`;
    telling.set(sleutel, (telling.get(sleutel) || 0) + 1);
  }
}
const inkt = [...telling].sort((a, b) => b[1] - a[1])[0][0].split(',').map(Number);
console.log('inktkleur', '#' + inkt.map((v) => v.toString(16).padStart(2, '0')).join(''));

/* dekking per pixel + bijsnijden op de tekening zelf */
const alpha = new Float32Array(w * h);
let x0 = w,
  y0 = h,
  x1 = -1,
  y1 = -1;
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = (y * w + x) * k;
    let a = 0;
    for (let ch = 0; ch < 3; ch++) {
      const noemer = 255 - inkt[ch];
      if (noemer > 8) a = Math.max(a, (255 - data[i + ch]) / noemer);
    }
    a = a < RUIS ? 0 : Math.min(1, a);
    alpha[y * w + x] = a;
    if (a > 0.25) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
}
const bw = x1 - x0 + 1;
const bh = y1 - y0 + 1;
console.log('tekening', `${bw}x${bh}`, 'op', `${w}x${h}`);

/* vierkant vlak om de tekening, met dezelfde marge als voorheen */
const zijde = Math.max(bw, bh);
const vlak = Math.round(zijde / (1 - 2 * RAND));
const ox = x0 - Math.round((vlak - bw) / 2);
const oy = y0 - Math.round((vlak - bh) / 2);

const uit = Buffer.alloc(vlak * vlak * 4);
for (let y = 0; y < vlak; y++) {
  for (let x = 0; x < vlak; x++) {
    const sx = ox + x;
    const sy = oy + y;
    const a = sx >= 0 && sy >= 0 && sx < w && sy < h ? alpha[sy * w + sx] : 0;
    const o = (y * vlak + x) * 4;
    uit[o] = inkt[0];
    uit[o + 1] = inkt[1];
    uit[o + 2] = inkt[2];
    uit[o + 3] = Math.round(a * 255);
  }
}

const png = await sharp(uit, {raw: {width: vlak, height: vlak, channels: 4}})
  .resize(MAAT, MAAT, {kernel: 'lanczos3'})
  .png({compressionLevel: 9, effort: 10, palette: true, colours: 64})
  .toBuffer();
writeFileSync(UIT, png);
console.log(UIT, `${MAAT}x${MAAT}`, `${(png.length / 1024).toFixed(1)} kB`);
