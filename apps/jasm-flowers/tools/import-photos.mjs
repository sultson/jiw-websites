/**
 * Imports the client's own photos (Sep 2026) into assets/img, replacing the AI renders
 * for every slot where we now have a real picture of the real crop.
 *
 * The AI versions are moved to assets/img/_ai/ first, so a swap can be undone by copying
 * back. Keys not listed here stay AI - we have no honest photo for them.
 *
 * Grading is deliberately photographic, not generative: exposure, contrast, saturation and
 * a light unsharp mask, so the frame still shows exactly what the camera saw. Nothing is
 * repainted or invented - these pictures are the site's evidence, so they have to stay true.
 *
 * Run: node tools/import-photos.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const SRC = 'C:/Users/nieuw/dev/experiments/jasm-client-photos/p';
const OUT = path.join(ROOT, 'assets', 'img');
const BAK = path.join(OUT, '_ai');

/** key -> {from, crop?, note} ; crop = fraction of the frame to trim {top,bottom,left,right} */
const MAP = {
  // ---- core products ----
  solidago:                   { from: 'p05', note: 'field close-up, full bloom' },
  'eucalyptus-baby-blue':     { from: 'p08', note: 'small round leaf, red soil' },
  'eucalyptus-silver-dollar': { from: 'p07', note: 'coin leaf against sky' },

  // ---- roses, down in the additional / network list ----
  roses:                { from: 'p13', crop: { bottom: .06 }, note: 'premium single heads' },
  'spray-roses':        { from: 'p16', note: 'wrapped spray roses, wholesale floor' },
  'garden-roses':       { from: 'p19', note: 'open cupped garden roses in a crate' },
  'spray-garden-roses': { from: 'p17', note: 'wrapped spray garden roses' },

  // ---- process / editorial ----
  // The key names are historical. What matters is what the frame actually shows, and the
  // alt text on every use was rewritten to match - in particular "greenhouse" now carries an
  // open-field picture, because open field is what the partner farms turn out to be.
  harvest:    { from: 'p03', note: 'tall field in full bloom' },
  greenhouse: { from: 'p01', note: 'field rows with the red soil path' },
  'field-rows': { from: 'p10', note: 'bud-stage close-up, tall' },
  qc:         { from: 'p06', note: 'one full-length stem held up against spec' },
  'bunch-real': { from: 'p02', crop: { bottom: .085 }, note: 'graded bunch in a vase; camera date stamp cropped off' },

  // p04 (sleeved bunches with grading labels) is real and on-message but too soft and too
  // busy to carry a frame at any size we use - left out rather than shipped as green mush.
};

fs.mkdirSync(BAK, { recursive: true });

for (const [key, m] of Object.entries(MAP)) {
  const dst = path.join(OUT, `${key}.png`);
  if (fs.existsSync(dst) && !fs.existsSync(path.join(BAK, `${key}.png`))) {
    fs.renameSync(dst, path.join(BAK, `${key}.png`));
  }

  const src = path.join(SRC, `${m.from}.jpg`);
  let img = sharp(src);
  const meta = await img.metadata();

  if (m.crop) {
    const c = m.crop;
    const left = Math.round((c.left || 0) * meta.width);
    const top = Math.round((c.top || 0) * meta.height);
    img = img.extract({
      left, top,
      width: meta.width - left - Math.round((c.right || 0) * meta.width),
      height: meta.height - top - Math.round((c.bottom || 0) * meta.height),
    });
  }

  await img
    .modulate({ saturation: 1.07, brightness: 1.02 })  // phone jpegs come out flat and a touch dark
    .linear(1.05, -7)                                  // gentle S: lifts the mids, keeps the whites
    .sharpen({ sigma: 0.7 })                           // recovers detail the WhatsApp pass smeared
    .png({ compressionLevel: 9 })
    .toFile(dst);

  const out = await sharp(dst).metadata();
  console.log(`${key.padEnd(24)} <- ${m.from}  ${out.width}x${out.height}  (${m.note})`);
}

console.log(`\nAI originals kept in ${path.relative(ROOT, BAK)}`);
