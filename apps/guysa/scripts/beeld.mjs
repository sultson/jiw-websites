/**
 * Zet de foto's uit raw/ om naar webp in public/img, en tekent het deelplaatje.
 *
 * De bronbestanden zijn jpeg van ruim duizend pixels breed. Dat is meer dan de
 * site ooit toont en in een formaat dat ongeveer de helft te zwaar is: dezelfde
 * foto als webp is bij gelijke kwaliteit grofweg 45% kleiner. Op een pagina met
 * dertien beelden scheelt dat bijna een megabyte, en dat is precies het soort
 * gewicht waar een telefoon op een trage verbinding over struikelt.
 *
 * raw/ blijft staan als herkomst: die bestanden zijn gegenereerd en nergens
 * anders te halen. public/img is het resultaat en wordt hier overschreven.
 *
 *   node scripts/beeld.mjs
 */
import {mkdir, readdir, readFile, stat, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW = path.join(APP, 'raw');
const UIT = path.join(APP, 'public/img');

/* Breder dan elke plek waar de foto getoond wordt, zodat hij op een
   retinascherm scherp blijft zonder pixels mee te dragen die de opmaak
   weggooit. De hero is het breedste vlak en haalt op een grote telefoon nooit
   meer dan 1400 CSS-pixels. */
const MAX_BREEDTE = 1400;

/* Het logo blijft png: het heeft een doorzichtige achtergrond en staat op een
   donker vlak, en het is te klein om er iets aan te winnen. */
const OVERSLAAN = new Set(['logo-origineel.jpg']);

await mkdir(UIT, {recursive: true});

let voor = 0;
let na = 0;

const bronnen = (await readdir(RAW)).filter((f) => /\.jpe?g$/i.test(f) && !OVERSLAAN.has(f));

for (const bestand of bronnen) {
  const van = path.join(RAW, bestand);
  voor += (await stat(van)).size;

  const naam = bestand.replace(/\.jpe?g$/i, '.webp');
  const buf = await sharp(van)
    .resize({width: MAX_BREEDTE, withoutEnlargement: true})
    /* 80 is bij webp ruwweg de kwaliteit van jpeg 90, en het verschil met 90 is
       op een foto van een leeggemaakte kamer met het blote oog niet te zien. */
    .webp({quality: 80, effort: 6})
    .toBuffer();

  await writeFile(path.join(UIT, naam), buf);
  na += buf.length;
  console.log(`beeld: ${naam.padEnd(30)} ${(buf.length / 1024).toFixed(0)} kB`);
}

/* ------------------------------------------------------------------ */
/*  Deelplaatje                                                        */
/* ------------------------------------------------------------------ */

/**
 * 1200x630, want dat is het formaat dat WhatsApp, LinkedIn en Facebook
 * uitsnijden zonder er zelf iets aan te doen. De hero eronder, donker
 * teruggebracht zodat het logo erop leesbaar blijft, en het logo in het midden.
 *
 * Zonder dit plaatje pakt elk van die drie zelf maar iets van de pagina, en
 * meestal is dat de eerste de beste foto zonder naam erbij.
 */
const OG_BREED = 1200;
const OG_HOOG = 630;

const achtergrond = await sharp(path.join(RAW, 'hero.jpg'))
  .resize({width: OG_BREED, height: OG_HOOG, fit: 'cover', position: 'centre'})
  .toBuffer();

/* Een donkere laag over de foto. Het logo is goud op doorzichtig; op een lichte
   plek in de foto valt het weg. */
const sluier = await sharp({
  create: {
    width: OG_BREED,
    height: OG_HOOG,
    channels: 4,
    background: {r: 0x11, g: 0x10, b: 0x10, alpha: 0.72},
  },
}).png().toBuffer();

const merk = await sharp(path.join(UIT, '..', 'img', 'logo.png'))
  .resize({width: 420})
  .png()
  .toBuffer();

const og = await sharp(achtergrond)
  .composite([
    {input: sluier, blend: 'over'},
    {input: merk, gravity: 'centre'},
  ])
  .webp({quality: 86, effort: 6})
  .toBuffer();

await writeFile(path.join(UIT, 'og-home.webp'), og);
console.log(`beeld: ${'og-home.webp'.padEnd(30)} ${(og.length / 1024).toFixed(0)} kB (${OG_BREED}x${OG_HOOG})`);

/* ------------------------------------------------------------------ */

const mb = (b) => (b / 1024 / 1024).toFixed(2);
console.log(
  `\nbeeld: ${bronnen.length} foto's, ${mb(voor)} MB -> ${mb(na)} MB ` +
  `(${Math.round((1 - na / voor) * 100)}% kleiner).`,
);

/* De verwijzingen in de bron moeten meelopen: staat er nog een .jpg in een
   component, dan is dat na deze stap een kapot plaatje. scripts/prerender.mjs
   vangt dat ook af, maar pas na een hele build. */
const broncode = await Promise.all(
  (await readdir(path.join(APP, 'src'), {recursive: true}))
    .filter((f) => /\.tsx?$/.test(f))
    .map((f) => readFile(path.join(APP, 'src', f), 'utf8')),
);
const achterblijvers = broncode.join('\n').match(/\/img\/[\w-]+\.jpe?g/g);
if (achterblijvers) {
  throw new Error(`beeld: de bron wijst nog naar jpeg: ${[...new Set(achterblijvers)].join(', ')}`);
}
