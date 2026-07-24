// Downscale + recompress public/images JPEGs to web-appropriate sizes, in place.
// Run: node scripts/optimize-images.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dir = path.join(root, 'public/images');

// Per-file max widths; everything else defaults to 1600.
const widths = {
  'about-Johanna.jpg': 1200,
  'og.jpg': 1200,
  'logo.png': 750,
};

async function run() {
  for (const f of await readdir(dir)) {
    if (!f.endsWith('.jpg')) continue;
    const file = path.join(dir, f);
    const input = await sharp(file).toBuffer();
    const meta = await sharp(input).metadata();
    const out = await sharp(input)
      .resize({ width: widths[f] ?? 1600, withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true })
      .toBuffer();
    if (out.length < input.length) {
      await sharp(out).toFile(file);
      console.log(`${f}  ${(input.length / 1024).toFixed(0)}KB -> ${(out.length / 1024).toFixed(0)}KB (${meta.width}px)`);
    } else {
      console.log(`${f}  kept (already optimal)`);
    }
  }
}

run();
