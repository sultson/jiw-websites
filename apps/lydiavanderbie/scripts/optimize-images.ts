import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const PUBLIC = path.resolve(process.cwd(), 'public');
const IMG = path.join(PUBLIC, 'img');

const IMG_MAX_EDGE = 1400;
const IMG_QUALITY = 72;

function human(size: number): string {
  if (size > 1024 * 1024) return (size / 1024 / 1024).toFixed(2) + ' MB';
  return (size / 1024).toFixed(0) + ' KB';
}

async function optimizeWebpDir() {
  let entries: string[] = [];
  try {
    entries = await readdir(IMG);
  } catch {
    return;
  }
  const targets = entries.filter((f) => /\.webp$/i.test(f)).sort();
  console.log(`\nimg/ (${targets.length} webp):`);
  for (const file of targets) {
    const full = path.join(IMG, file);
    const before = (await stat(full)).size;
    const meta = await sharp(full).metadata();
    const longest = Math.max(meta.width ?? 0, meta.height ?? 0);
    let pipeline = sharp(full).rotate();
    if (longest > IMG_MAX_EDGE) {
      pipeline =
        (meta.width ?? 0) >= (meta.height ?? 0)
          ? pipeline.resize({ width: IMG_MAX_EDGE })
          : pipeline.resize({ height: IMG_MAX_EDGE });
    }
    const buf = await pipeline.webp({ quality: IMG_QUALITY, effort: 6, smartSubsample: true }).toBuffer();
    await sharp(buf).toFile(full);
    const after = (await stat(full)).size;
    console.log(`  ${file.padEnd(34)} ${human(before)} -> ${human(after)}`);
  }
}

async function optimizePortrait() {
  const file = path.join(PUBLIC, 'lydia-portrait.png');
  try {
    const before = (await stat(file)).size;
    const buf = await sharp(file).rotate().resize({ width: 900 }).png({ compressionLevel: 9, quality: 82 }).toBuffer();
    await sharp(buf).toFile(file);
    const after = (await stat(file)).size;
    console.log(`\nlydia-portrait.png  ${human(before)} -> ${human(after)}`);
  } catch (err) {
    console.error('portrait skip:', (err as Error).message);
  }
}

async function optimizeBadge() {
  const file = path.join(PUBLIC, 'crkbo-badge.png');
  try {
    const before = (await stat(file)).size;
    const buf = await sharp(file).resize({ width: 300 }).png({ compressionLevel: 9, palette: true }).toBuffer();
    await sharp(buf).toFile(file);
    const after = (await stat(file)).size;
    console.log(`crkbo-badge.png     ${human(before)} -> ${human(after)}`);
  } catch (err) {
    console.error('badge skip:', (err as Error).message);
  }
}

async function makeFaviconAndOg() {
  // Branded favicon: terracotta rounded square with a cream serif monogram.
  const svg = (size: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="16" fill="#B15F3C"/>
    <text x="50%" y="50%" dy="0.34em" text-anchor="middle"
      font-family="Georgia, 'Times New Roman', serif" font-size="38" fill="#FFFDF9">L</text>
  </svg>`;
  await sharp(Buffer.from(svg(64))).png().toFile(path.join(PUBLIC, 'favicon-64.png'));
  await sharp(Buffer.from(svg(180))).resize(180, 180).png().toFile(path.join(PUBLIC, 'apple-touch-icon.png'));
  console.log('\nfavicon-64.png + apple-touch-icon.png written');

  // OG image: hero crop to 1200x630.
  const hero = path.join(IMG, 'hero-main.webp');
  try {
    await sharp(hero).resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' }).jpeg({ quality: 82 }).toFile(path.join(PUBLIC, 'og-preview.jpg'));
    console.log('og-preview.jpg written (1200x630)');
  } catch (err) {
    console.error('og skip:', (err as Error).message);
  }
}

async function main() {
  await optimizeWebpDir();
  await optimizePortrait();
  await optimizeBadge();
  await makeFaviconAndOg();
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
