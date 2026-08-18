/**
 * Brengt public/img terug tot webgewicht en maakt de deelplaatjes.
 *
 * Twee dingen, want ze horen bij elkaar: wat de pagina toont en wat er in een
 * appje of een bericht verschijnt als iemand de site deelt.
 *
 * 1. Elke JPEG wordt een WebP van maximaal 1200 px breed. De helft van de map
 *    was nog JPEG, en dat is bij dezelfde beeldkwaliteit ongeveer een derde
 *    zwaarder. Op een telefoon in de winkelstraat is dat het verschil tussen
 *    een foto die er staat en een foto die nog komt.
 *
 * 2. De og-*.jpg's: één per pagina, 1200 bij 630. Ze blijven met opzet JPEG.
 *    WhatsApp is in Nederland de plek waar een bloemenwinkel gedeeld wordt, en
 *    daar is een WebP-voorbeeldplaatje nog steeds een gok. De maat is de maat
 *    die Facebook, LinkedIn en WhatsApp verwachten: staat er een foto van
 *    4 bij 3, dan snijden ze er zelf een reep uit en gaat de bloem eraf.
 *
 * Draait opnieuw zonder schade: wat al WebP is wordt overgeslagen, en de
 * og-plaatjes worden elke keer opnieuw uit de bron gemaakt.
 *
 *   node scripts/optimize-images.mjs
 */
import {readdir, rename, stat, unlink, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMG = path.join(APP, 'public/img');

/* Breder dan elke plek waar een foto op deze site getoond wordt, dus ook op een
   scherm met dubbele pixels nog scherp, zonder pixels mee te dragen die de
   opmaak toch weggooit. */
const MAX_BREEDTE = 1200;

/* ------------------------------------------------------------------ */
/*  1. JPEG naar WebP                                                  */
/* ------------------------------------------------------------------ */

const bestanden = await readdir(IMG);
const jpegs = bestanden.filter((f) => /\.jpe?g$/i.test(f) && !f.startsWith('og-'));

let voor = 0;
let na = 0;

for (const f of jpegs) {
  const bron = path.join(IMG, f);
  voor += (await stat(bron)).size;

  const buf = await sharp(bron)
    .rotate()
    .resize({width: MAX_BREEDTE, withoutEnlargement: true})
    .webp({quality: 76, effort: 6, smartSubsample: true})
    .toBuffer();

  const uit = path.join(IMG, f.replace(/\.jpe?g$/i, '.webp'));
  /* Via een tijdelijk bestand: sharp kan de bron nog even openhouden, dus
     rechtstreeks over hetzelfde pad schrijven is vragen om moeilijkheden. */
  const tmp = `${uit}.tmp`;
  await writeFile(tmp, buf);
  await rename(tmp, uit);
  await unlink(bron);

  na += buf.length;
  console.log(`img: ${f.padEnd(30)} -> ${path.basename(uit).padEnd(30)} ${(buf.length / 1024).toFixed(0)} kB`);
}

if (jpegs.length) {
  const mb = (b) => (b / 1024 / 1024).toFixed(2);
  console.log(`\nimg: ${mb(voor)} MB -> ${mb(na)} MB (${Math.round((1 - na / voor) * 100)}% lichter)\n`);
} else {
  console.log('img: geen JPEG meer over, niets te converteren.\n');
}

/* ------------------------------------------------------------------ */
/*  2. Deelplaatjes                                                    */
/* ------------------------------------------------------------------ */

/* Per pagina de foto die er het beste voor staat. De bron mag inmiddels WebP
   zijn; wat eruit komt is altijd JPEG. */
const DELEN = [
  ['og-home.jpg', 'winkelpui.webp'],
  ['og-boeketten.jpg', 'plukboeket.webp'],
  ['og-abonnement.jpg', 'pioenen-emmer.webp'],
  ['og-rouwbloemen.jpg', 'rouw-liggend-wit.webp'],
  ['og-trouwbloemen.jpg', 'bruidsboeket.webp'],
];

for (const [naam, bronNaam] of DELEN) {
  const bron = path.join(IMG, bronNaam);
  const uit = path.join(IMG, naam);

  await sharp(bron)
    /* position: attention laat sharp zelf het drukste stuk van de foto kiezen.
       Bij een boeket is dat het boeket, en niet de lucht erboven. */
    .resize({width: 1200, height: 630, fit: 'cover', position: sharp.strategy.attention})
    .jpeg({quality: 82, mozjpeg: true, progressive: true})
    .toFile(uit);

  const {size} = await stat(uit);
  console.log(`og:  ${naam.padEnd(24)} 1200x630  ${(size / 1024).toFixed(0)} kB  (uit ${bronNaam})`);
}
