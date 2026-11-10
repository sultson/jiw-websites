// Twee platen die de site zelf niet toont maar die wel naar buiten gaan, allebei
// uit het grote logobestand in bron/ (het rondje van Puur Genieten, 2048 px).
//
//   1. inhoud/assets/mail/puurgenieten-email.png - het logo in de bevestigingsmail.
//      Een mailprogramma tekent geen svg en geen webp betrouwbaar, dus png. 240
//      breed voor een weergave op 120 (worker/confirmation.ts, logoWidth). Plat
//      gelegd op de kleur van de logobalk in de mail en niet doorzichtig: in
//      donkere weergave zet een mailprogramma doorzichtig op zwart.
//
//   2. inhoud/assets/og/puurgenieten-og.png - de deelplaat (og:image) die WhatsApp,
//      LinkedIn en Facebook laten zien als iemand de link deelt. 1200x630, de maat
//      waar die drie op rekenen; een vierkant logo als og:image wordt door
//      Facebook bijgesneden tot een balk door het midden van het rondje.
//
// Draait in `pnpm build`, dus de platen lopen niet achter op het logo.
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';
import { COLORS } from '../worker/confirmation.ts';

const BRON = 'bron/puur-genieten-logo-2048.png';

mkdirSync('inhoud/assets/mail', { recursive: true });
mkdirSync('inhoud/assets/og', { recursive: true });

const MAIL = 'inhoud/assets/mail/puurgenieten-email.png';
const m = await sharp(BRON)
  .resize({ width: 240 })
  .flatten({ background: COLORS.surfaceAlt })
  .png({ compressionLevel: 9 })
  .toFile(MAIL);
console.log(`${MAIL}: ${m.width}x${m.height}, ${(m.size / 1024).toFixed(1)} kB`);

// De deelplaat: de sfeerachtergrond van de hero van de site (zelfde plaat, dus
// dezelfde indruk als wie doorklikt), donker gemaakt zodat het rondje vrij staat,
// en het logo in het midden op 480 hoog.
const OG = 'inhoud/assets/og/puurgenieten-og.png';
const B = 1200, H = 630, LOGO = 480;
const achter = await sharp('inhoud/assets/gen/sfeer-hero-1600.webp')
  .resize(B, H, { fit: 'cover' })
  .modulate({ brightness: 0.75 })
  .toBuffer();
const logo = await sharp(BRON).resize({ height: LOGO }).png().toBuffer();
const o = await sharp(achter)
  .composite([{ input: logo, gravity: 'center' }])
  .flatten({ background: '#0d1117' })
  .png({ compressionLevel: 9 })
  .toFile(OG);
console.log(`${OG}: ${o.width}x${o.height}, ${(o.size / 1024).toFixed(1)} kB`);
