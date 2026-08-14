/* Import + compress the De Kattenberg photo sets into public/img.
   Source: dekattenberg.nl (Booking Experts CDN) — the owners of those homes have
   Winterswijk Vakantiehuis manage them, confirmed by Armando 31-07. These replace
   the funda screenshots that were standing in for the Kattenberg homes.
   Curated per house (sharp professional shots only, no collages, no duplicate
   angles). Same treatment as the owner photo sets: max 1600px long edge,
   mozjpeg q78, stripped metadata. [0] is the card/hero image. */
import sharp from 'sharp';
import path from 'node:path';

const SRC = path.resolve('.import/kb');
const OUT = path.resolve('public/img');

const sets = {
  // Geschakelde 6-persoons boswoning
  kattenberg6: ['09', '11', '15', '14', '05', '28', '25', '20', '19', '22', '16', '29', '35'],
  // Geschakelde 8-persoons — the wheelchair-accessible one.
  // 20.jpg is the accessible bathroom (fold-down shower chair, grab bars, roll-in
  // shower, wheel-under basin) and 18.jpg the ground-floor bedroom: both are the
  // proof for the accessibility claim, so they sit high in the gallery.
  kattenberg8: ['14', '10', '13', '12', '16', '09', '31', '18', '20', '21', '23', '25', '29', '30'],
  // Vrijstaand Fins chalet, incl. the separate bijgebouw (46/47/50).
  chalet: ['15', '52', '53', '16', '17', '18', '25', '29', '31', '36', '39', '42', '45', '46', '47', '50'],
};

const dirFor = {kattenberg6: 'kat6', kattenberg8: 'kat8', chalet: 'chalet'};

for (const [prefix, files] of Object.entries(sets)) {
  for (const [i, f] of files.entries()) {
    const dest = path.join(OUT, `${prefix}-${i + 1}.jpg`);
    const info = await sharp(path.join(SRC, dirFor[prefix], `${f}.jpg`))
      .rotate()
      .resize({width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true})
      .jpeg({quality: 78, mozjpeg: true})
      .toFile(dest);
    console.log(`${prefix}-${i + 1}.jpg  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
  }
}
