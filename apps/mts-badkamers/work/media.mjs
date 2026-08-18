// Mediapijplijn: watermerk wegsnijden + responsive derivaten (webp + jpg-fallback).
// Invoer:  assets/media/*.jpg  en  site/poster/*.jpg  (posters uit de video's)
// Uitvoer: site/m/<base>-{480,900,1600}.webp  +  site/m/<base>-{900,1600}.jpg
//          _media.json met de definitieve afmetingen per bestand
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

// Foto's met een ingebrande "REDMI NOTE 6 PRO / MI DUAL CAMERA" watermerk linksonder.
// Gedetecteerd met work/wm-detect.mjs + visuele controle (work/wm-sheet.jpg).
const WATERMARKED = new Set([21, 22, 23, 24, 27, 30, 34, 50, 52, 54, 55, 58, 62, 64, 65, 152]);
const KEEP = 0.845; // hoeveel van de hoogte we overhouden bij zo'n crop

const OUT = 'site/m';
fs.mkdirSync(OUT, { recursive: true });

const inputs = [];
for (const f of fs.readdirSync('assets/media')) {
  if (f.toLowerCase().endsWith('.jpg')) inputs.push({ src: path.join('assets/media', f), file: f });
}
for (const f of fs.readdirSync('site/poster')) {
  // hero-build.jpg is de poster van de opbouwvideo in de hero en wordt
  // rechtstreeks als /poster/hero-build.jpg geladen, niet via /m/. Hij hoort
  // dus niet in de derivaten en niet in _media.json.
  if (f === 'hero-build.jpg') continue;
  if (f.toLowerCase().endsWith('.jpg')) inputs.push({ src: path.join('site/poster', f), file: f, poster: true });
}

const WIDTHS = [480, 900, 1600];
const dims = [];
let n = 0;
let overgeslagen = 0;
// Alleen opnieuw uitrekenen wat er niet al ligt. Deze stap kost minuten over
// 284 bestanden en draait nu ook vanuit `pnpm build` op een schone checkout;
// zonder deze controle zou elke bouw die minuten opnieuw betalen.
const VERS = process.argv.includes('--force');

for (const { src, file, poster } of inputs) {
  const base = file.replace(/\.jpg$/i, '');
  const idx = parseInt(file.slice(0, 3), 10);
  const meta = await sharp(src).metadata();
  let pipe = () => sharp(src, { failOn: 'none' }).rotate();
  let w = meta.width;
  let h = meta.height;

  if (!poster && WATERMARKED.has(idx)) {
    const nh = Math.round(h * KEEP);
    const crop = { left: 0, top: 0, width: w, height: nh };
    pipe = () => sharp(src, { failOn: 'none' }).rotate().extract(crop);
    h = nh;
  }

  // Wat er al ligt en jonger is dan de bron hoeft niet opnieuw.
  const verwacht = [
    ...WIDTHS.filter((width) => width <= w * 1.05).map((width) => `${base}-${width}.webp`),
    `${base}-900.jpg`,
    `${base}-1600.jpg`,
  ].map((f) => path.join(OUT, f));
  const bronTijd = fs.statSync(src).mtimeMs;
  const klaar =
    !VERS &&
    verwacht.every((f) => fs.existsSync(f) && fs.statSync(f).mtimeMs >= bronTijd);
  if (klaar) {
    dims.push({ f: file, base, w, h, poster: !!poster, cropped: !poster && WATERMARKED.has(idx) });
    overgeslagen++;
    continue;
  }

  for (const width of WIDTHS) {
    if (width > w * 1.05) continue; // niet opblazen
    await pipe().resize({ width, withoutEnlargement: true }).webp({ quality: 74, effort: 5 })
      .toFile(path.join(OUT, `${base}-${width}.webp`));
  }
  // jpg-fallbacks: alleen de maten die we in <img src> gebruiken
  await pipe().resize({ width: Math.min(900, w), withoutEnlargement: true }).jpeg({ quality: 76, mozjpeg: true })
    .toFile(path.join(OUT, `${base}-900.jpg`));
  await pipe().resize({ width: Math.min(1600, w), withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(OUT, `${base}-1600.jpg`));

  dims.push({ f: file, base, w, h, poster: !!poster, cropped: !poster && WATERMARKED.has(idx) });
  if (++n % 40 === 0) console.log(`  ${n}/${inputs.length}`);
}

dims.sort((a, b) => a.f.localeCompare(b.f));
fs.writeFileSync('_media.json', JSON.stringify(dims, null, 1));
console.log(
  `klaar: ${dims.length} bestanden, ${dims.filter((d) => d.cropped).length} watermerken weggesneden` +
    (overgeslagen ? `, ${overgeslagen} stonden er al (--force om alles opnieuw te doen)` : ''),
);
