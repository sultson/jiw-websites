/* The new Aemilius logo, supplied by the client over WhatsApp on 05-08-2026 — replaces
   the old square "AEMILIUS APARTMENTS" mark.

   The file the client sent is a screenshot: the logo sits on its own cream ground
   (248,240,227) but with bluish-white letterbox bars (239,244,247) down both sides at
   x<16 and x>704.

   We briefly cut the mark out to a transparent PNG so it could sit straight on the green
   header. That was worse (05-08-2026 feedback) and the image above shows why: the
   subtitle line and the hairline rule are near-neutral dark, so on the green they had to
   be recoloured to cream and went thin and washed out. Keeping the logo on its own cream
   ground preserves the artwork exactly as the designer made it.

   So: crop off the letterbox bars, trim the surplus cream margin so the mark actually
   fills its plaque, then give it back an even cream padding. The header card behind it
   uses the same cream (#f8f0e3), so there is no visible edge.

   Run: node scripts/import-curacao-logo.mjs */
import sharp from 'sharp';
import path from 'node:path';

const SRC = 'C:/Users/nieuw/dev/jiw-crm/uploads/hywtt4k8cucsezxfwdj1x5mz.jpg';
const OUT = path.resolve('public/img/curacao-logo.png');

const CROP = {left: 16, top: 0, width: 689, height: 290};
const BG = {r: 248, g: 240, b: 227};   // the logo's own cream ground
const PAD = 26;                        // breathing room around the mark, in output px

/* sharp's own trim() leaves most of the empty cream in place — the screenshot has a faint
   vignette, so its corner-seeded flood fill stops early. Find the ink box by hand instead:
   a pixel counts as artwork when it sits more than INK_MIN off the cream ground. */
const INK_MIN = 22;
const {data, info} = await sharp(SRC).rotate().extract(CROP)
  .raw().toBuffer({resolveWithObject: true});

let x0 = info.width, y0 = info.height, x1 = 0, y1 = 0;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * info.channels;
    const dist = Math.max(Math.abs(data[i] - BG.r), Math.abs(data[i + 1] - BG.g), Math.abs(data[i + 2] - BG.b));
    if (dist <= INK_MIN) continue;
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
}

const trimmed = await sharp(SRC).rotate().extract(CROP)
  .extract({left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1})
  .toBuffer();

const res = await sharp(trimmed)
  .resize({width: 800 - PAD * 2})       // 2x the 400px max display width, minus padding
  .extend({top: PAD, bottom: PAD, left: PAD, right: PAD, background: BG})
  .flatten({background: BG})
  .png({compressionLevel: 9})
  .toFile(OUT);

console.log(`curacao-logo.png  ${res.width}x${res.height}  ${Math.round(res.size / 1024)}kB`);
