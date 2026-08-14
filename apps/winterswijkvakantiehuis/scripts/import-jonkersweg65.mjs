/* Import + compress the owner's photos of Jonkersweg 65 into public/img.
   Same treatment as the other owner photo sets: max 1600px on the long edge,
   mozjpeg q78, stripped metadata. Ordered so [0] is the card/hero image. */
import sharp from 'sharp';
import path from 'node:path';

const UP = 'C:/Users/nieuw/dev/jiw-crm/uploads';
const OUT = path.resolve('public/img');

const files = [
  'j0mahuvc83tevqza606fxgbf.jpg', // exterior, red gable + terrace
  'cnncavjg59hsgzxldzggx0cn.jpg', // living room with gas fireplace
  'msrwgje36cc2umcbj9odxao7.jpg', // gas fireplace + mirror
  'npm50cyd07qpzljecj43cwnr.jpg', // kitchen
  'rrr0im78n9b6i4h8kua0gdv4.jpg', // bedroom, twin boxsprings
  'lsrrven81i1hk6g95qc2zb4i.jpg', // covered veranda with lounge set
  'ztsgmtvubtliieklr3bzx0pt.jpg', // garden terrace
];

for (const [i, f] of files.entries()) {
  const dest = path.join(OUT, `jonkersweg65-${i + 1}.jpg`);
  const info = await sharp(path.join(UP, f))
    .rotate()
    .resize({width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true})
    .jpeg({quality: 78, mozjpeg: true})
    .toFile(dest);
  console.log(`jonkersweg65-${i + 1}.jpg  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
}
