import sharp from 'sharp';
import { mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// public/images is fully derived: every file the site serves is generated here
// from the masters in assets/images. Re-runs always start from those masters,
// so quality never compounds across runs. Never hand-edit public/images.
const SRC = fileURLToPath(new URL('../assets/images/', import.meta.url));
const OUT = fileURLToPath(new URL('../public/images/', import.meta.url));

// Tour cards render at aspect-ratio 4/3 with object-fit: cover, so crop to 4:3
// here rather than shipping pixels the card throws away.
const TOUR_IMAGES = ['amsterdam', 'villages', 'grand-holland', 'nijmegen'];
const TOUR_WIDTHS = [400, 600, 800, 1064];

const jobs = [
  // Hero is a full-bleed cover behind a dark scrim. Because it is 2.11:1 inside
  // a much taller box, it needs more intrinsic width than the viewport — see the
  // sizes attribute on the <img> in index.astro.
  { src: 'hero.webp', out: 'hero-1200.webp', width: 1200, height: 568, quality: 73 },
  { src: 'hero.webp', out: 'hero-1600.webp', width: 1600, height: 758, quality: 73 },

  ...TOUR_IMAGES.flatMap((name) =>
    TOUR_WIDTHS.map((width) => ({
      src: `${name}.webp`,
      out: `${name}-${width}.webp`,
      width,
      height: Math.round((width * 3) / 4),
      quality: 74,
    })),
  ),

  // Tour photo pop-out: a 134px thumbnail and the lightbox panel behind it.
  { src: 'nijmegen-tour-group.webp', out: 'nijmegen-tour-group-320.webp', width: 320, height: 200, quality: 76 },
  { src: 'nijmegen-tour-group.webp', out: 'nijmegen-tour-group-1000.webp', width: 1000, height: 625, quality: 74 },

  // Decorative CSS background, sitting under a ~90% opaque cream wash.
  { src: 'keukenhof-pattern.webp', out: 'keukenhof-pattern.webp', width: 1400, height: 933, quality: 58 },
];

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

let total = 0;
for (const job of jobs) {
  const { size } = await sharp(SRC + job.src)
    .resize(job.width, job.height, { fit: 'cover', position: 'centre', withoutEnlargement: true })
    .webp({ quality: job.quality, effort: 6, smartSubsample: true })
    .toFile(OUT + job.out);
  total += size;
  console.log(`${job.out.padEnd(34)} ${job.width}px  ${(size / 1024).toFixed(1)} KiB`);
}
console.log(`\n${jobs.length} files, ${(total / 1024).toFixed(1)} KiB total`);
