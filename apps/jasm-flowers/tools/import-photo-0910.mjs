/**
 * Fourth batch of client photos (9 Oct 2026). One picture:
 *
 *   gypsophila-tinted  <- a bunch of tinted gypsophila held up in the field
 *
 * It goes under the Gypsophila entry in the catalogue, where the card already says
 * "Dyed to order" in the swatches and nothing on the site showed what that means.
 *
 * Crop: the frame has a pair of shoes in the bottom third. The hand stays - it gives
 * the bunch its scale and it is the same evidence the eucalyptus stem shot carries.
 *
 * No image-to-image on this one, same reasoning as the rose bench in the 5 Oct batch
 * but for a different reason: the subject is a few hundred individually tinted florets
 * and the colour mix IS what the picture is evidence of. A model asked to "recover fine
 * detail" on that will redistribute the blues, pinks and yellows, and then the thing we
 * are publishing as proof of what they can tint is a guess. lanczos + sharpen recovers
 * nothing that was not already in the frame, which is the point.
 *
 * Run: node tools/import-photo-0910.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const OUT = path.join(ROOT, 'assets', 'img');
const KEEP = path.join(OUT, '_src-0910');

const KEY = 'gypsophila-tinted';
const SRC = path.join(KEEP, `${KEY}.jpg`);

// 4:5 out of an 810x1080 frame: shoes gone, bunch still edge to edge.
const CROP = { left: 43, top: 0, width: 724, height: 905 };

if (!fs.existsSync(SRC)) throw new Error(`missing source: ${SRC}`);

const meta = await sharp(SRC).metadata();
const cropped = await sharp(SRC).extract(CROP).png().toBuffer();

const s = 2000 / Math.max(CROP.width, CROP.height);
const big = await sharp(cropped)
  .resize({ width: Math.round(CROP.width * s), kernel: 'lanczos3' })
  .png().toBuffer();

const dst = path.join(OUT, `${KEY}.png`);
await sharp(big)
  .modulate({ saturation: 1.03, brightness: 1.04 })
  .linear(1.04, -5)
  .sharpen({ sigma: 0.9 })
  .png({ compressionLevel: 9 })
  .toFile(dst);

const out = await sharp(dst).metadata();
const st = await sharp(dst).stats();
const blown = st.channels.slice(0, 3).map(c => c.max).join('/');
console.log(`${KEY}  ${meta.width}x${meta.height} -> ${out.width}x${out.height}  ` +
  `mean ${st.channels.slice(0, 3).map(c => Math.round(c.mean)).join(',')}  max ${blown}`);
