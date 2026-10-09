// Lifts shadows and midtones on a source image while pinning the white point.
//
//   node tools/brighten.mjs <key> [gamma]
//
// Why a tone curve and not sharp's modulate/linear: both of those are a gain,
// so brightening a night shot enough to read also pushes the lit fuselage and
// the floodlights to flat white (measured 4.9% blown pixels at the brightness
// the client asked for). out = 255*(in/255)^(1/g) leaves 0 and 255 where they
// are and only opens up what sits between them -- 0.25% blown at g=1.6.
//
// The untouched file is kept in assets/img/_orig/ so the curve is always
// applied to the original and never compounded.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const IMG = path.join(ROOT, 'assets', 'img');
const ORIG = path.join(IMG, '_orig');

const key = process.argv[2];
const g = Number(process.argv[3] || 1.6);
if (!key) { console.error('usage: node tools/brighten.mjs <key> [gamma]'); process.exit(1); }

const live = path.join(IMG, `${key}.png`);
const kept = path.join(ORIG, `${key}.png`);
if (!fs.existsSync(kept)) fs.copyFileSync(live, kept);

const { data, info } = await sharp(kept).raw().toBuffer({ resolveWithObject: true });
const lut = new Uint8Array(256);
for (let i = 0; i < 256; i++) lut[i] = Math.round(255 * Math.pow(i / 255, 1 / g));

let before = 0, after = 0, blown = 0, n = 0;
for (let i = 0; i < data.length; i += info.channels) {
  before += (data[i] + data[i + 1] + data[i + 2]) / 3;
  data[i] = lut[data[i]]; data[i + 1] = lut[data[i + 1]]; data[i + 2] = lut[data[i + 2]];
  after += (data[i] + data[i + 1] + data[i + 2]) / 3;
  if (data[i] >= 252 && data[i + 1] >= 252 && data[i + 2] >= 252) blown++;
  n++;
}
await sharp(data, { raw: info }).png().toFile(live);
console.log(`${key}: gamma ${g}  mean ${(before / n).toFixed(1)} -> ${(after / n).toFixed(1)}  blown ${(100 * blown / n).toFixed(2)}%`);
