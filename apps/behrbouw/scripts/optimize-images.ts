// Convert source PNGs (default: images-src/) to webp in public/images/.
// Usage: pnpm --filter @jiw/behrbouw optimize-images [source-dir]
import { readdirSync, mkdirSync } from 'node:fs';
import { join, dirname, parse } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = process.argv[2] ?? join(root, 'images-src');
const outDir = join(root, 'public', 'images');
mkdirSync(outDir, { recursive: true });

for (const file of readdirSync(srcDir)) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue;
  const out = join(outDir, `${parse(file).name}.webp`);
  await sharp(join(srcDir, file)).resize({ width: 1264, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
  console.log(`${file} -> ${out}`);
}
