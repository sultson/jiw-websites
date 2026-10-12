/**
 * Squeezes the generated photo set down to web weight. The model returns large,
 * lightly compressed JPEGs; on a page this size that is several megabytes of
 * detail nobody can see. Run after gen-images.mjs.
 */
import {readdir, rename, stat, writeFile} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const DIR = path.resolve(process.cwd(), 'public/img');
/* Wider than any slot the photo is shown in, so it still looks sharp on a
   retina screen without carrying pixels the layout throws away. */
const MAX_BREEDTE = 1200;

const files = (await readdir(DIR)).filter((f) => /\.jpe?g$/i.test(f) && f !== 'logo-origineel.jpg');

let voor = 0;
let na = 0;

for (const f of files) {
  const p = path.join(DIR, f);
  voor += (await stat(p)).size;

  const buf = await sharp(p)
    .resize({width: MAX_BREEDTE, withoutEnlargement: true})
    .jpeg({quality: 74, mozjpeg: true, progressive: true})
    .toBuffer();

  /* Via een tijdelijk bestand: op Windows houdt sharp de bron nog even open,
     dus rechtstreeks over hetzelfde pad schrijven faalt. */
  const tmp = `${p}.tmp`;
  await writeFile(tmp, buf);
  await rename(tmp, p);
  na += buf.length;
  console.log(`${f.padEnd(28)} ${(buf.length / 1024).toFixed(0)} kB`);
}

const kb = (b) => (b / 1024 / 1024).toFixed(2);
console.log(`\n${kb(voor)} MB -> ${kb(na)} MB (${Math.round((1 - na / voor) * 100)}% kleiner)`);
