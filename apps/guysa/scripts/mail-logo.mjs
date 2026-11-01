/**
 * Tekent het logo voor de bevestigingsmail: public/logo-email.png.
 *
 * Twee dingen maken dit een apart bestand en geen verwijzing naar
 * /img/logo.png.
 *
 * Ten eerste het formaat. Outlook op Windows toont geen webp, dus het moet png
 * blijven, en het staat daarom ook buiten public/img: dat is de map die
 * scripts/beeld.mjs omzet, en een logo dat daar ooit webp wordt is in Outlook
 * een leeg vak.
 *
 * Ten tweede de achtergrond. Het merk is goud op doorzichtig. Op de site staat
 * het op de donkere balk bovenaan en dat werkt; in een mail valt het op het
 * lichte vlak van de koptekst weg, en een mailprogramma dat doorzichtigheid
 * niet goed afhandelt maakt er een grijs blok van. Daarom staat het hier op
 * zijn eigen donkere tegel, net als op de site.
 *
 * Geleverd op het dubbele van de weergave (240 px), zodat het op een
 * retinascherm scherp blijft.
 *
 *   node scripts/mail-logo.mjs
 */
import {stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* Weergave 240, dus 480 pixels. Zie EMAIL_LOGO_WIDTH in
   worker/confirmation-email.ts; die twee horen bij elkaar. */
const TEGEL = 480;
/* Ruimte rondom, zodat de gouden ring niet tegen de rand van de tegel staat. */
const RAND = 40;

const merk = await sharp(path.join(APP, 'public/img/logo.png'))
  .resize({width: TEGEL - RAND * 2, height: TEGEL - RAND * 2, fit: 'contain', background: {r: 0, g: 0, b: 0, alpha: 0}})
  .toBuffer();

const uit = path.join(APP, 'public/logo-email.png');

await sharp({
  create: {
    width: TEGEL,
    height: TEGEL,
    channels: 4,
    /* Hetzelfde bijna-zwart als --color-ink in src/index.css. Verandert die
       kleur, dan hoort deze mee. */
    background: {r: 0x11, g: 0x10, b: 0x10, alpha: 1},
  },
})
  .composite([{input: merk, gravity: 'centre'}])
  /* Geen doorzichtigheid meer nodig, en zonder alfakanaal is het bestand
     kleiner en kan geen enkel mailprogramma er een grijs vlak van maken. */
  .flatten({background: {r: 0x11, g: 0x10, b: 0x10}})
  .png({compressionLevel: 9})
  .toFile(uit);

const {size} = await stat(uit);
console.log(`mail-logo: public/logo-email.png (${TEGEL}x${TEGEL}, ${(size / 1024).toFixed(0)} kB)`);
