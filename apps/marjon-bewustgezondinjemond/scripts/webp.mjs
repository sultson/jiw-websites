import sharp from 'sharp';
import {readdir, stat} from 'node:fs/promises';
const dir = 'public/img';
const files = (await readdir(dir)).filter(f => /\.jpe?g$/i.test(f));
let voor = 0, na = 0;
for (const f of files) {
  const src = `${dir}/${f}`;
  const out = src.replace(/\.jpe?g$/i, '.webp');
  await sharp(src).webp({quality: 78, effort: 6}).toFile(out);
  voor += (await stat(src)).size;
  na += (await stat(out)).size;
  console.log(f, '->', out.split('/').pop());
}
console.log(`totaal ${(voor/1024).toFixed(0)}kB -> ${(na/1024).toFixed(0)}kB`);
