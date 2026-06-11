/**
 * One-off media production for Nails by Jenny.
 * Sources in raw-media/, outputs in public/. Run: pnpm exec tsx scripts/produce-media.ts
 */
import sharp from 'sharp';
import { stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const FB = (n: string) => path.join(ROOT, 'raw-media/facebook', n);
const GM = (n: string) => path.join(ROOT, 'raw-media/gmaps', n);
const OUT = (n: string) => path.join(ROOT, 'public', n);

type Region = { left: number; top: number; width: number; height: number };
type Job = { src: string; out: string; width?: number; quality: number; crop?: Region };

const jobs: Job[] = [
  // hero
  { src: FB('fb-027.jpg'), out: 'hero.webp', width: 1920, quality: 78 },
  // gallery ~1200w
  { src: FB('fb-031.jpg'), out: 'werk-roze-stippen.webp', width: 1200, quality: 80 },
  { src: FB('fb-026.jpg'), out: 'werk-diepgroen.webp', width: 1200, quality: 80 },
  { src: FB('fb-028.jpg'), out: 'werk-rood-witte-stip.webp', width: 1200, quality: 80 },
  { src: FB('fb-030.jpg'), out: 'werk-koraal.webp', width: 1200, quality: 80 },
  { src: FB('fb-032.jpg'), out: 'werk-nude-amandel.webp', width: 1200, quality: 80 },
  { src: FB('fb-036.jpg'), out: 'werk-blauwe-glitter.webp', width: 1200, quality: 80 },
  { src: FB('fb-005.jpg'), out: 'werk-parelmoer-wit.webp', quality: 80 }, // 1013w, no upscale
  { src: FB('fb-012.jpg'), out: 'werk-framboos.webp', quality: 80 }, // 1080w
  { src: FB('fb-029.jpg'), out: 'werk-zachtroze-ombre.webp', width: 1200, quality: 80 },
  // marquee ~800w (crops remove Voor/Na/Resultaat badges, bottom-right)
  { src: FB('fb-002.jpg'), out: 'marquee-klassiek-rood.webp', width: 752, quality: 76 },
  { src: GM('gmaps-003.jpg'), out: 'marquee-naturel-amandel.webp', width: 800, quality: 76 },
  { src: FB('fb-018.jpg'), out: 'marquee-nude-glans.webp', width: 800, quality: 76 },
  { src: FB('fb-035.jpg'), out: 'marquee-biab-naturel.webp', width: 800, quality: 76 },
  { src: FB('fb-004.jpg'), out: 'marquee-grijslila.webp', width: 800, quality: 76, crop: { left: 0, top: 0, width: 1080, height: 905 } },
  { src: FB('fb-006.jpg'), out: 'marquee-parelroze.webp', width: 800, quality: 76, crop: { left: 0, top: 0, width: 1080, height: 905 } },
  { src: FB('fb-008.jpg'), out: 'marquee-lila.webp', width: 800, quality: 76, crop: { left: 0, top: 0, width: 1080, height: 905 } },
  { src: FB('fb-016.jpg'), out: 'marquee-perzik-mat.webp', width: 800, quality: 76, crop: { left: 0, top: 0, width: 1080, height: 635 } },
  { src: FB('fb-021.jpg'), out: 'marquee-citroen-nailart.webp', width: 800, quality: 76, crop: { left: 0, top: 0, width: 1080, height: 655 } },
  { src: FB('fb-023.jpg'), out: 'marquee-nude-rond.webp', width: 800, quality: 76, crop: { left: 0, top: 0, width: 1080, height: 900 } },
  // about
  { src: FB('fb-015.jpg'), out: 'studio-eigen-nagels.webp', quality: 80 }, // 1080 square
  // feature sections (fb-014 doubles as og source; fb-021 promoted from marquee)
  { src: FB('fb-014.jpg'), out: 'biab-roze-amandel.webp', width: 1080, quality: 80 },
  { src: FB('fb-021.jpg'), out: 'nailart-citroen.webp', quality: 80, crop: { left: 0, top: 0, width: 1080, height: 655 } },
];

async function run() {
  for (const j of jobs) {
    let p = sharp(j.src).rotate();
    if (j.crop) p = p.extract(j.crop);
    if (j.width) p = p.resize({ width: j.width, withoutEnlargement: true });
    await p.webp({ quality: j.quality, effort: 6, smartSubsample: true }).toFile(OUT(j.out));
    const kb = ((await stat(OUT(j.out))).size / 1024).toFixed(0);
    console.log(`${j.out}  ${kb} KB`);
  }

  // og-preview.jpg 1200x630 from fb-014 (center crop)
  await sharp(FB('fb-014.jpg'))
    .rotate()
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(OUT('og-preview.jpg'));
  console.log(`og-preview.jpg  ${(((await stat(OUT('og-preview.jpg'))).size) / 1024).toFixed(0)} KB`);

  // logo set from fb-001 (opaque coral background already in source)
  await sharp(FB('fb-001.jpg')).resize(512, 512).webp({ quality: 90, effort: 6 }).toFile(OUT('logo.webp'));
  await sharp(FB('fb-001.jpg')).resize(32, 32).png({ compressionLevel: 9 }).toFile(OUT('favicon-32.png'));
  await sharp(FB('fb-001.jpg')).resize(180, 180).png({ compressionLevel: 9 }).toFile(OUT('apple-touch-icon.png'));
  console.log('logo.webp / favicon-32.png / apple-touch-icon.png done');
}

run().catch(e => { console.error(e); process.exit(1); });
