/* Schrijft dist/logo/rh-klusservice-email.png: het logo voor de bevestigingsmail
   die de aanvrager terugkrijgt (worker/bevestigingsmail.ts).

   Waarom een apart bestand en geen hergebruik van de SVG uit de voet:

   1. Outlook op Windows toont geen SVG. Een mail die zijn logo als SVG meestuurt
      heeft bij een deel van de ontvangers een leeg vak bovenaan.
   2. Het logo is wit. Op een doorzichtige achtergrond is het in een mailprogramma
      dus onzichtbaar zodra dat programma zelf een lichte achtergrond zet, en de
      donkere modus van Gmail en Outlook doet precies dat met de omliggende cel.
      Daarom zit het zwart hier in het bestand gebakken: dat kan geen mailclient
      omdraaien.
   3. Twee keer de weergavebreedte (480 voor een weergave van 240), zodat hij op
      een retinascherm niet uitloopt.

   Dit plaatje staat bewust in geen enkele pagina. maak-plaatjes.mjs leest de HTML
   om te bepalen waar hij AVIF en WebP naast zet; omdat dit bestand daar niet in
   staat blijft het een PNG, en dat is het enige formaat waar elke mailclient mee
   overweg kan. */

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const eis = createRequire(import.meta.url);
const sharp = eis('sharp');

const hier = dirname(fileURLToPath(import.meta.url));
const BRON = join(hier, 'dist/logo/rh-klusservice-breed.svg');
const NAAR = join(hier, 'dist/logo/rh-klusservice-email.png');

/* 400 breed letterwerk met lucht eromheen, samen 480. De lucht is er niet als
   opmaak maar omdat de mail dit als een zwart plaatje op bijna-wit zet: zonder
   marge raken de letters de rand van het vlak. */
const LETTERS = 400;
const MARGE_X = 40;
const MARGE_Y = 28;

if (!existsSync(BRON)) {
  throw new Error(`Logo niet gevonden: ${BRON}. Zonder dat zou de bevestigingsmail een leeg vak bovenaan krijgen.`);
}

if (existsSync(NAAR) && statSync(NAAR).mtimeMs >= statSync(BRON).mtimeMs) {
  console.log('mailmerk: al bij');
} else {
  const letters = await sharp(readFileSync(BRON), { density: 300 })
    .resize({ width: LETTERS })
    .png()
    .toBuffer();
  const { height } = await sharp(letters).metadata();

  mkdirSync(dirname(NAAR), { recursive: true });
  await sharp({
    create: {
      width: LETTERS + MARGE_X * 2,
      height: height + MARGE_Y * 2,
      channels: 3,
      background: '#000000',
    },
  })
    .composite([{ input: letters, left: MARGE_X, top: MARGE_Y }])
    .png({ compressionLevel: 9, palette: true })
    .toFile(NAAR);

  console.log(`mailmerk: ${LETTERS + MARGE_X * 2}x${height + MARGE_Y * 2}, ${(statSync(NAAR).size / 1024).toFixed(1)} KB`);
}
