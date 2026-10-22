// Right-sized variants for the images that load on the home page's first screen, so the
// hero (the LCP image) is not sharing a mobile connection with oversized badges and
// posters. Originals stay; this only writes the smaller siblings next to them.
import sharp from 'sharp';

const jobs = [
  ['public/images/hero.webp', 'public/images/hero-900.webp', 900, 68],
  ['public/images/hero.webp', 'public/images/hero-1200.webp', 1200, 70],
  ['public/images/partners/international-life-saving-federation-europe.webp', 'public/images/partners/ils-europe-160.webp', 160, 80],
  ['public/images/brandfilm-poster.webp', 'public/images/brandfilm-poster-1280.webp', 1280, 72],
  ['public/images/network/ils-europe.webp', 'public/images/network/ils-europe-240.webp', 240, 80],
];
for (const [from, to, width, quality] of jobs) {
  const info = await sharp(from).resize({ width, withoutEnlargement: true }).webp({ quality, effort: 6 }).toFile(to);
  console.log(`${to}: ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} kB`);
}
