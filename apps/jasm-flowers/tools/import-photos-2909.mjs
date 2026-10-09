/**
 * Second batch of client photos (29 Sep 2026 update pack). Seven pictures, each named by
 * the client for the slot it belongs in, so the mapping below is theirs, not a guess.
 *
 * Two of these close real gaps flagged in September: limonium was still an AI render even
 * though it is a core programme product, and the roses / spray roses split the client now
 * asks for needs two genuinely different pictures to be honest.
 *
 * Crops are the only structural edit. Several frames are phone snaps with a shoe, an apron
 * or half a wall in shot; the crop takes the frame down to the flowers and nothing else.
 * Grading is photographic (exposure, contrast, saturation, unsharp) exactly as in
 * import-photos.mjs - no image-to-image, because these pictures are the site's evidence.
 *
 * Previous versions move to assets/img/_prev-2909/ so any swap can be undone.
 *
 * Run: node tools/import-photos-2909.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const SRC = 'C:/Users/nieuw/dev/experiments/jasm-2909/jasm-update-pack-2909';
const OUT = path.join(ROOT, 'assets', 'img');
const BAK = path.join(OUT, '_prev-2909');

/** key -> {from, crop?, note} ; crop = fraction of the frame to trim */
const MAP = {
  // The rose family. The client asked for Roses and Spray Roses to be separated, and sent
  // one mixed-varieties picture for each - so each entry now has its own real photo.
  roses: {
    from: 'replace-roses-with-this',
    crop: { bottom: .05 },
    note: 'mixed rose varieties, single head - red, yellow, orange, pink, cerise',
  },
  'spray-roses': {
    from: 'have-this-picture-as-spray-roses-vary',
    crop: { top: .05, bottom: .34 },
    note: 'mixed spray rose varieties; grey backdrop below the bunch cropped away',
  },
  'garden-roses': {
    from: 'replace-garden-roses-with-this-one',
    crop: { top: .12, bottom: .32 },
    note: 'open cupped garden roses; apron and shoe cropped out of frame',
  },
  'spray-garden-roses': {
    from: 'replace-spray-garden-roses-with-this-one',
    crop: { top: .06, bottom: .30 },
    note: 'spray garden roses, pink and cream; workbench clutter cropped away',
  },

  // Core programme product that was still running on an AI render until today.
  limonium: {
    from: 'replace-limonium-with-this-one',
    crop: { top: .19, bottom: .28 },
    note: 'real limonium at last - lavender, deep purple and the yellow line',
  },

  hydrangeas: {
    from: 'replace-hydrangears-picture-w-this-one',
    crop: { top: .10, bottom: .19 },
    note: 'mophead heads in white, pink, blue, lilac and green; shoe cropped out',
  },
  delphiniums: {
    from: 'replace-delphinium-with-this-picture',
    crop: { top: .04, left: .03, bottom: .02 },
    note: 'white, blue, purple and pink spires; carton corner cropped out',
  },
};

fs.mkdirSync(BAK, { recursive: true });

for (const [key, m] of Object.entries(MAP)) {
  const dst = path.join(OUT, `${key}.png`);
  if (fs.existsSync(dst) && !fs.existsSync(path.join(BAK, `${key}.png`))) {
    fs.renameSync(dst, path.join(BAK, `${key}.png`));
  }

  const src = path.join(SRC, `${m.from}.jpeg`);
  if (!fs.existsSync(src)) throw new Error(`missing source: ${src}`);
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
    .modulate({ saturation: 1.06, brightness: 1.03 })
    .linear(1.05, -7)
    .sharpen({ sigma: 0.7 })
    .png({ compressionLevel: 9 })
    .toFile(dst);

  const out = await sharp(dst).metadata();
  console.log(`${key.padEnd(20)} <- ${m.from.padEnd(42)} ${out.width}x${out.height}  (${m.note})`);
}

console.log(`\nprevious versions kept in ${path.relative(ROOT, BAK)}`);
