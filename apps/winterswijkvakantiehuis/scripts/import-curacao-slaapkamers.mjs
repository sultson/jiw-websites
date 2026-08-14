/* Bedroom and bathroom photos of Aemilius on Curacao, second batch. Supplied by the
   client over WhatsApp on 07-08-2026, so the source is the CRM upload folder rather
   than a URL. Same treatment as every other set: max 1600px on the long edge,
   mozjpeg q78, metadata stripped.

   This batch is what named the two large stays: the 3-bedroom villa is "Fenya" and the
   1-bedroom apartment is "Yeva". */
import sharp from 'sharp';
import path from 'node:path';

const SRC = 'C:/Users/nieuw/dev/jiw-crm/uploads';
const OUT = path.resolve('public/img');

const files = [
  // villa Fenya, master bedroom: colourful runner and towels on the bed, red timber roof
  ['jzgtga9h7n8botbj3rkesx5b.jpg', 'curacao-fenya-master.jpg'],
  // villa Fenya, second bedroom: double bed, pastel check, red timber roof
  ['kkrqh3t6azehapsbuzvw8o5j.jpg', 'curacao-fenya-kamer-2.jpg'],
  // villa Fenya, third bedroom: two single beds under the red timber roof
  ['sxlp4n7k7z17fp7otr4tcfqy.jpg', 'curacao-fenya-kamer-3.jpg'],
  // apartment Yeva, bedroom with the extra sofa bed along the wall
  ['rfadyyxpvrqkyp8oj45s80mg.jpg', 'curacao-yeva-slaapkamer.jpg'],
  // what makes Yeva special per the client: the window looking out over the green hills
  ['ictq73zxrwplaxlq0poygins.jpg', 'curacao-yeva-uitzicht.jpg'],
  // Yeva laid out for a family: travel cot and high chair next to the beds
  ['vdct2xkqm2v9hkrbtwh5b84y.jpg', 'curacao-yeva-gezin.jpg'],
  // Yeva bathroom: walk-in shower with a fold-down seat and grab rail
  ['zv1z19rw19qvit04ainvvnmj.jpg', 'curacao-yeva-badkamer.jpg'],
  // wk79v0r29g67q4ufk77617fa.jpg (the care bed) was in this batch too, but it is the
  // same shot already imported as curacao-zorgbed.jpg — not imported twice. Its caption
  // did add news: a high-low bed can be placed in ANY bedroom on request (see careText).
];

for (const [src, dest] of files) {
  const info = await sharp(path.join(SRC, src))
    .rotate()
    .resize({width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true})
    .jpeg({quality: 78, mozjpeg: true})
    .toFile(path.join(OUT, dest));
  console.log(`${dest}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
}
