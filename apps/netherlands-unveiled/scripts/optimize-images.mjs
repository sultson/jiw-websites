import sharp from 'sharp';
import { readdir, rm } from 'node:fs/promises';
import { join, parse } from 'node:path';

const imageDir = new URL('../public/images/', import.meta.url);
const files = await readdir(imageDir);

for (const file of files) {
  if (!file.endsWith('.png')) continue;
  const input = join(imageDir.pathname, file);
  const output = join(imageDir.pathname, `${parse(file).name}.webp`);
  await sharp(input)
    .resize({ width: file === 'hero.png' ? 2200 : 1200, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(output);
  await rm(input);
}
