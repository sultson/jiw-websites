/**
 * Re-encodes the generated photography in public/images and emits a 640px
 * variant for phones. Mobile weight is the whole point of these pages, so the
 * originals are never shipped as they come out of the generator.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const dir = new URL('../public/images/', import.meta.url);
const WIDE = 1264;
const NARROW = 640;

const files = (await readdir(dir)).filter((f) => /\.jpg$/i.test(f) && !/-\d+\.jpg$/i.test(f));

for (const file of files) {
  const full = new URL(file, dir);
  const input = await readFile(full);
  const base = path.basename(file, '.jpg');

  const wide = await sharp(input)
    .resize({ width: WIDE, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true, progressive: true })
    .toBuffer();
  await writeFile(full, wide);

  const narrow = await sharp(input)
    .resize({ width: NARROW, withoutEnlargement: true })
    .jpeg({ quality: 76, mozjpeg: true, progressive: true })
    .toBuffer();
  await writeFile(new URL(`${base}-${NARROW}.jpg`, dir), narrow);

  console.log(`${file}: ${(input.length / 1024) | 0}kB -> ${(wide.length / 1024) | 0}kB (+${(narrow.length / 1024) | 0}kB @${NARROW}w)`);
}
