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
const TOUR_IMAGES = [
  'amsterdam',
  'villages',
  'den-haag',
  'rotterdam',
  'delft',
  'nijmegen',
  'grand-holland',
];
const TOUR_WIDTHS = [400, 600, 800, 1064];

// Blog photos are Marion's own portrait-format phone pictures (720x960). Cards
// render them at 4:5, which is close enough to the source that the crop only
// shaves the edges instead of cutting people in half.
const BLOG_IMAGES = [
  'blog-herring',
  'blog-keukenhof',
  'blog-cheese',
  'blog-amsterdam',
  'blog-urban-farm',
  'blog-oostende',
  'blog-dutch-food',
  'blog-rijsttafel',
  'blog-broekerveiling',
  'blog-haarlem',
  'blog-grand-holland',
];
const BLOG_WIDTHS = [360, 540, 720];
// Link previews want a wide crop. The masters are portrait phone photos, so
// this stays at the master width rather than upscaling to the 1200px ideal.
const OG_WIDTH = 720;

// Poster frame for the About video, pulled from the Vimeo thumbnail so no
// third-party request is made before the visitor presses play.
const VIDEO_POSTER_WIDTHS = [640, 960, 1280];

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

  ...BLOG_IMAGES.flatMap((name) =>
    BLOG_WIDTHS.map((width) => ({
      src: `blog/${name}.webp`,
      out: `${name}-${width}.webp`,
      width,
      height: Math.round((width * 5) / 4),
      quality: 74,
    })),
  ),

  ...BLOG_IMAGES.map((name) => ({
    src: `blog/${name}.webp`,
    out: `${name}-og.webp`,
    width: OG_WIDTH,
    height: Math.round(OG_WIDTH / 1.91),
    quality: 76,
  })),

  ...VIDEO_POSTER_WIDTHS.map((width) => ({
    src: 'about-marion-video.webp',
    out: `about-marion-video-${width}.webp`,
    width,
    height: Math.round((width * 9) / 16),
    quality: 74,
  })),

  // Real tour photo in the Nijmegen feature, 16:10 inside a half-width column.
  { src: 'nijmegen-tour-group.webp', out: 'nijmegen-tour-group-640.webp', width: 640, height: 400, quality: 76 },
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
