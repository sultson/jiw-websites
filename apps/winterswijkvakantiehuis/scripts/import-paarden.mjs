/* Horse photos for the "Vakantie met uw paard" page. Source: the owners' own park site
   denmollenhof.nl/nl/paarden — that site's footer carries the same phone number as our
   owner, so it is their material. Same treatment as the other photo sets: max 1600px on
   the long edge, mozjpeg q78, metadata stripped. */
import sharp from 'sharp';
import path from 'node:path';

const OUT = path.resolve('public/img');

const files = [
  // carriage + pair of horses passing one of the park houses
  ['https://www.denmollenhof.nl/img/_1464_1707994803.jpg', 'paarden-koets.jpg'],
  // the KNHS "PaardenWelkom" plaque the park was awarded
  ['https://www.denmollenhof.nl/img/_9888_1709801486.jpeg', 'paarden-knhs.jpg'],
];

for (const [url, dest] of files) {
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  const info = await sharp(buf)
    .rotate()
    .resize({width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true})
    .jpeg({quality: 78, mozjpeg: true})
    .toFile(path.join(OUT, dest));
  console.log(`${dest}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
}
