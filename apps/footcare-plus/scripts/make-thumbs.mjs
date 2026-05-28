import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = path.resolve(process.cwd(), 'scraped-media');
const DST = path.resolve(SRC, 'thumbs');
await mkdir(DST, { recursive: true });

const files = (await readdir(SRC)).filter(f => /\.(jpe?g)$/i.test(f));
for (const f of files) {
  const out = path.join(DST, f);
  try {
    await sharp(path.join(SRC, f))
      .rotate()
      .resize({ width: 500, height: 500, fit: 'inside' })
      .jpeg({ quality: 75 })
      .toFile(out);
  } catch (e) {
    console.error(f, e.message);
  }
}
console.log(`thumbs written for ${files.length} files`);
