/* One extra owner photo of Jonkersweg 55 that arrived after the first batch:
   wide shot of the living room + dining area (same blue sofas, same magnolia
   outside as jonkersweg-2). Same treatment as the rest: 1600px, mozjpeg q78. */
import sharp from 'sharp';
import path from 'node:path';

const src = 'C:/Users/nieuw/dev/jiw-crm/uploads/s8rp1y4nx0it8yrhurnh1zjf.jpg';
const dest = path.resolve('public/img/jonkersweg-12.jpg');

const info = await sharp(src)
  .rotate()
  .resize({width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true})
  .jpeg({quality: 78, mozjpeg: true})
  .toFile(dest);
console.log(`jonkersweg-12.jpg  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
