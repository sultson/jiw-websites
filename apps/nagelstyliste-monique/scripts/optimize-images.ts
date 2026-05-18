import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const PUBLIC = new URL('../public/', import.meta.url).pathname;

async function run() {
  const dirs = ['', 'gallery'];
  for (const dir of dirs) {
    const base = join(PUBLIC, dir);
    let files: string[] = [];
    try {
      files = await readdir(base);
    } catch {
      continue;
    }
    for (const file of files) {
      if (!/\.(png|jpe?g)$/i.test(file)) continue;
      const input = join(base, file);
      const output = input.replace(/\.(png|jpe?g)$/i, '.webp');
      await sharp(input).webp({ quality: 82 }).toFile(output);
      console.log('optimized', join(dir, file));
    }
  }
}

run();
