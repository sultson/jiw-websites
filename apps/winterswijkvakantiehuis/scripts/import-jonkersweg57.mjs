/* Import + compress the owner's photos of Jonkersweg 57 ("Villa Winterswijk 57")
   into public/img. Sent 30-07 with "Deze foto's zijn de juiste wat huisnr 57 betreft",
   replacing the four professional shots that were wrongly assigned to 57 earlier.
   Same treatment as the other owner photo sets: max 1600px on the long edge,
   mozjpeg q78, stripped metadata. Ordered so [0] is the card/hero image. */
import sharp from 'sharp';
import path from 'node:path';

const UP = 'C:/Users/nieuw/dev/jiw-crm/uploads';
const OUT = path.resolve('public/img');

const files = [
  'ts2bf4z5hkp38yy1n57c9cd0.jpg', // exterior, red gable + magnolia in bloom
  'rbv8cs51bjob7l51upugmuse.jpg', // living room, black leather sofas
  'ijiommna7nnb7ztm4yg1l21h.jpg', // sitting corner + welcome binder "Villa Winterswijk 57"
  'b4r4opqj0fo9werkzdt5ncc0.jpg', // dining area, table for six
  'g25y3ovzn8cj11n0c7zjcfq7.jpg', // bedroom, twin boxsprings
  'zobpwploj0jwy0izcjyakaie.jpg', // bathroom, bath + separate shower cabin
];

for (const [i, f] of files.entries()) {
  const dest = path.join(OUT, `jonkersweg57-${i + 1}.jpg`);
  const info = await sharp(path.join(UP, f))
    .rotate()
    .resize({width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true})
    .jpeg({quality: 78, mozjpeg: true})
    .toFile(dest);
  console.log(`jonkersweg57-${i + 1}.jpg  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
}
