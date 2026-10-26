/* Import + compress the owner's photos of Jonkersweg 63 into public/img.
   Sent 26-10 over WhatsApp with "Deze woning willen we ook op WinterswijkVakantiehuis.
   Jonkersweg 63 bij het meer. Geen gashaard. Geen huisdieren". Nine phone photos,
   no front-of-house shot among them, so the living room leads.
   Same treatment as the other owner photo sets: max 1600px on the long edge,
   mozjpeg q78, stripped metadata. Ordered so [0] is the card/hero image.

     node scripts/import-jonkersweg63.mjs <folder with the unzipped WhatsApp images> */
import sharp from 'sharp';
import path from 'node:path';

const UP = process.argv[2];
if (!UP) throw new Error('usage: node scripts/import-jonkersweg63.mjs <photo folder>');
const OUT = path.resolve('public/img');

const files = [
  'WhatsApp Image 2026-10-24 at 16.32.15 (1).jpeg', // living room, cognac corner sofa + garden doors
  'WhatsApp Image 2026-10-24 at 16.32.15 (2).jpeg', // living room, armchairs + TV wall
  'WhatsApp Image 2026-10-24 at 16.32.15 (3).jpeg', // garden doors onto the terrace
  'WhatsApp Image 2026-10-24 at 16.32.15 (4).jpeg', // terrace with dining set, lawn, woods behind
  'WhatsApp Image 2026-10-24 at 16.32.15 (5).jpeg', // garden, veranda/shed among the birches
  'WhatsApp Image 2026-10-24 at 16.32.15.jpeg',     // bedroom, boxspring
  'WhatsApp Image 2026-10-24 at 16.32.14.jpeg',     // kitchen, sage-green units
  'WhatsApp Image 2026-10-24 at 16.32.14 (2).jpeg', // Nespresso corner
  'WhatsApp Image 2026-10-24 at 16.32.14 (1).jpeg', // welcome pack
];

for (const [i, f] of files.entries()) {
  const dest = path.join(OUT, `jonkersweg63-${i + 1}.jpg`);
  const info = await sharp(path.join(UP, f))
    .rotate()
    .resize({width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true})
    .jpeg({quality: 78, mozjpeg: true})
    .toFile(dest);
  console.log(`jonkersweg63-${i + 1}.jpg  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
}
