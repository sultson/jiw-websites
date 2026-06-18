/**
 * Generates every public/ image from raw-media/ sources.
 * Run: pnpm exec tsx scripts/optimize-images.ts
 */
import sharp from 'sharp';
import { stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const RAW = path.join(ROOT, 'raw-media');
const FRAMES = path.join(RAW, 'video-frames');
const PUBLIC = path.join(ROOT, 'public');

const BLUSH = { r: 239, g: 227, b: 227 };

async function report(file: string) {
  const full = path.join(PUBLIC, file);
  const size = (await stat(full)).size;
  const meta = await sharp(full).metadata();
  console.log(
    `  ${file.padEnd(30)} ${String(meta.width).padStart(4)}x${String(meta.height).padEnd(4)} ${(size / 1024).toFixed(0).padStart(4)} KB`,
  );
}

/** Cover-crop a source to w×h centred (or with gravity) → webp. */
async function cover(
  src: string,
  out: string,
  w: number,
  h: number,
  opts: { gravity?: string; quality?: number } = {},
) {
  await sharp(src)
    .resize(w, h, { fit: 'cover', position: opts.gravity ?? 'centre' })
    .webp({ quality: opts.quality ?? 82 })
    .toFile(path.join(PUBLIC, out));
  await report(out);
}

/** Extract a pixel window then resize → webp. */
async function extract(
  src: string,
  out: string,
  region: { left: number; top: number; width: number; height: number },
  resize: { w: number; h: number },
  quality = 84,
) {
  await sharp(src)
    .extract(region)
    .resize(resize.w, resize.h, { fit: 'cover' })
    .webp({ quality })
    .toFile(path.join(PUBLIC, out));
  await report(out);
}

async function main() {
  const r = (f: string) => path.join(RAW, f);

  // ---- Hero: soft natural ombre full hand (lightly retouched via google:4@2) ----
  const heroSrc = r('img_hero-enhanced2.png');
  await cover(heroSrc, 'hero-nails.webp', 1100, 1375, { quality: 86 });
  // mobile crop (a touch tighter, 4:5)
  await cover(heroSrc, 'hero-nails-mobile.webp', 900, 1125, { quality: 84 });

  // ---- About: Miriam portrait (IG profile photo, 4:5 keeps face + signature red nails) ----
  await cover(r('img_miriam-profile.jpg'), 'about-miriam.webp', 880, 1100, { gravity: 'centre', quality: 88 });

  // ---- Work marquee (real photos) ----
  await cover(r('img_nails-learn-2022.jpg'), 'work-french.webp', 1000, 1000, { quality: 84 });
  await cover(r('img_natural-treatment-b.jpg'), 'work-natural-ring.webp', 1000, 1000, { quality: 84 });
  await cover(r('img_natural-treatment-a.jpg'), 'work-natural-macro.webp', 1000, 1000, { quality: 84 });
  await cover(r('img_nails-first-2022.jpg'), 'work-mauve-glitter.webp', 1000, 1000, { gravity: 'attention', quality: 84 });
  // lilac shimmer: crop below the text overlay
  await extract(
    r('img_nails-strak-2025.jpg'),
    'work-lilac.webp',
    { left: 30, top: 490, width: 820, height: 820 },
    { w: 1000, h: 1000 },
    84,
  );

  // ---- favicon / app icons: blush rounded tile with serif "A" monogram ----
  const mono = (size: number) => Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
       <defs>
         <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
           <stop offset="0" stop-color="#8a4a55"/>
           <stop offset="1" stop-color="#6e3a45"/>
         </linearGradient>
       </defs>
       <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#g)"/>
       <text x="50%" y="52%" dominant-baseline="central" text-anchor="middle"
         font-family="Georgia, 'Times New Roman', serif" font-size="${size * 0.62}"
         font-style="italic" fill="#f3e4e4">A</text>
     </svg>`,
  );
  await sharp(mono(512)).png().toFile(path.join(PUBLIC, 'favicon.png'));
  await report('favicon.png');
  await sharp(mono(180)).png().toFile(path.join(PUBLIC, 'apple-touch-icon.png'));
  await report('apple-touch-icon.png');

  // ---- OG image (1200x630): hero nails left, blush panel + wordmark right ----
  const ogW = 1200, ogH = 630;
  const nailPanel = await sharp(r('img_hero-enhanced2.png'))
    .resize(560, ogH, { fit: 'cover', position: 'centre' })
    .toBuffer();
  const ogText = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${ogW}" height="${ogH}">
       <rect width="${ogW}" height="${ogH}" fill="#efe3e3"/>
       <text x="620" y="270" font-family="Georgia, serif" font-size="62" fill="#3a2a2c">Art of Nails</text>
       <text x="620" y="345" font-family="Georgia, serif" font-size="62" fill="#3a2a2c">&amp; Beauty</text>
       <text x="622" y="410" font-family="Georgia, serif" font-size="30" font-style="italic" fill="#8a4a55">Nagelstudio in Breda</text>
       <text x="622" y="470" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#6b5b5c">Jouw nagels, mijn passie — Miriam Jenis</text>
     </svg>`,
  );
  await sharp(ogText)
    .composite([{ input: nailPanel, left: 0, top: 0 }])
    .jpeg({ quality: 86 })
    .toFile(path.join(PUBLIC, 'og-preview.jpg'));
  await report('og-preview.jpg');

  console.log('\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
