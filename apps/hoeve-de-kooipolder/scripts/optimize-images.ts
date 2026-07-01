/**
 * Generates every public/ asset listed in the SPEC media manifest from the
 * raw sources (logo.png, edge-to-edge-bg.png, raw-media/*.jpg).
 *
 * Run: pnpm exec tsx scripts/optimize-images.ts   (from the app root)
 */
import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const RAW = path.join(ROOT, 'raw-media');
const PUBLIC = path.join(ROOT, 'public');

const CREAM = '#FAF8F5';

// Farmhouse center in edge-to-edge-bg.png (2298x2300), measured visually:
// the house sits at ~52% from the left, ~47% from the top.
const HOUSE_X = 0.52;
const HOUSE_Y = 0.467;

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

async function report(file: string) {
  const full = path.join(PUBLIC, file);
  const size = (await stat(full)).size;
  const meta = await sharp(full).metadata();
  console.log(
    `  ${file.padEnd(30)} ${String(meta.width).padStart(4)}x${String(meta.height).padEnd(4)} ${(size / 1024).toFixed(0).padStart(4)} KB`,
  );
}

/** Crop a window of aspect `arW:arH` from the source, centered on (cx, cy) fractions. */
async function cropOn(
  src: string,
  cx: number,
  cy: number,
  arW: number,
  arH: number,
  windowScale = 1,
) {
  const meta = await sharp(src).metadata();
  const W = meta.width!;
  const H = meta.height!;
  let cw = W * windowScale;
  let ch = (cw * arH) / arW;
  if (ch > H) {
    ch = H;
    cw = (ch * arW) / arH;
  }
  cw = Math.round(cw);
  ch = Math.round(ch);
  const left = Math.round(clamp(cx * W - cw / 2, 0, W - cw));
  const top = Math.round(clamp(cy * H - ch / 2, 0, H - ch));
  return sharp(src).extract({ left, top, width: cw, height: ch });
}

async function main() {
  await mkdir(PUBLIC, { recursive: true });
  console.log('Generating public/ assets\n');

  // ---- Logo set -----------------------------------------------------------
  const logoSrc = path.join(ROOT, 'logo.png');
  const trimmed = await sharp(logoSrc).trim().toBuffer();

  await sharp(trimmed)
    .resize({ width: 480, height: 480, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 90, effort: 6 })
    .toFile(path.join(PUBLIC, 'logo.webp'));
  await report('logo.webp');

  await sharp(trimmed)
    .resize({ width: 64, height: 64, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(path.join(PUBLIC, 'favicon.png'));
  await report('favicon.png');

  // Apple touch icon: cream background behind the lilac circle, slight padding.
  const appleLogo = await sharp(trimmed)
    .resize({ width: 160, height: 160, fit: 'inside' })
    .toBuffer();
  await sharp({
    create: { width: 180, height: 180, channels: 4, background: CREAM },
  })
    .composite([{ input: appleLogo, gravity: 'center' }])
    .flatten({ background: CREAM })
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(path.join(PUBLIC, 'apple-touch-icon.png'));
  await report('apple-touch-icon.png');

  // ---- Hero + OG from the drone photo ------------------------------------
  const heroSrc = path.join(ROOT, 'edge-to-edge-bg.png');

  // Desktop hero: full frame, ~2000w.
  await sharp(heroSrc)
    .resize({ width: 2000 })
    .webp({ quality: 75, effort: 6, smartSubsample: true })
    .toFile(path.join(PUBLIC, 'hero-bg.webp'));
  await report('hero-bg.webp');

  // Mobile hero: 3:4 portrait crop centered on the farmhouse, 1080w.
  const mobile = await cropOn(heroSrc, HOUSE_X, HOUSE_Y, 3, 4, 0.66);
  await mobile
    .resize({ width: 1080, height: 1440 })
    .webp({ quality: 78, effort: 6, smartSubsample: true })
    .toFile(path.join(PUBLIC, 'hero-bg-mobile.webp'));
  await report('hero-bg-mobile.webp');

  // OG preview: 1200x630 crop centered on the farmhouse.
  const og = await cropOn(heroSrc, HOUSE_X, HOUSE_Y, 1200, 630, 1);
  await og
    .resize({ width: 1200, height: 630 })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(PUBLIC, 'og-preview.jpg'));
  await report('og-preview.jpg');

  // ---- Section images ------------------------------------------------------
  const sections: Array<{ out: string; src: string; width: number; quality: number }> = [
    { out: 'about-hoeve.webp', src: 'hoeve-front-2026.jpg', width: 1000, quality: 66 },
    // gmaps-foto-1.jpg is 1080px wide; never upscale, so this caps at 1080.
    { out: 'visit-luchtfoto.webp', src: 'gmaps-foto-1.jpg', width: 1200, quality: 80 },
    { out: 'products-green-rabbit.webp', src: 'green-rabbit-producten.jpg', width: 1000, quality: 80 },
    { out: 'products-yodeyma.webp', src: 'yodeyma-parfum-1.jpg', width: 1000, quality: 80 },
  ];

  // ---- Gallery (8 picks, near-duplicates excluded) -------------------------
  // Excluded: gelnagels-jun25-1 (byte-identical to gellak-nov24),
  // pedicure-nov23-3 (near-duplicate of -2), gelnagels-jun25-2 (low-res stock),
  // graphics, prijslijst, logo dupes, yodeyma-kerst.
  const gallery: Array<{ out: string; src: string }> = [
    { out: 'gallery-gellak-rood.webp', src: 'gellak-mrt25-1.jpg' },
    { out: 'gallery-pedicure-resultaat.webp', src: 'pedicure-nov23-2.jpg' },
    { out: 'gallery-gellak-bordeaux.webp', src: 'gellak-nov24.jpg' },
    { out: 'gallery-gellak-blauw.webp', src: 'gellak-okt24-1.jpg' },
    { out: 'gallery-gellak-rood-2.webp', src: 'gellak-mrt25-2.jpg' },
    { out: 'gallery-pedicure-voor.webp', src: 'pedicure-nov23-1.jpg' },
    { out: 'gallery-gellak-blauw-2.webp', src: 'gellak-okt24-2.jpg' },
    // 450x600 source, kept at native size (no upscaling).
    { out: 'gallery-gellak-rood-3.webp', src: 'gelnagels-jun25-3.jpg' },
  ];

  for (const { out, src, width, quality } of sections) {
    await sharp(path.join(RAW, src))
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 6, smartSubsample: true })
      .toFile(path.join(PUBLIC, out));
    await report(out);
  }

  for (const { out, src } of gallery) {
    await sharp(path.join(RAW, src))
      .rotate()
      .resize({ width: 900, withoutEnlargement: true })
      .webp({ quality: 78, effort: 6, smartSubsample: true })
      .toFile(path.join(PUBLIC, out));
    await report(out);
  }

  console.log('\nDone.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
