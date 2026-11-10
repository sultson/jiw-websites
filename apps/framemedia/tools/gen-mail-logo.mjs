// Het logo voor de bevestigingsmail, als platte png.
//
// Een mailprogramma tekent geen svg - Outlook, Gmail in de app en Apple Mail
// laten er allemaal iets anders of niets van zien. Dus wordt logo.svg hier een
// keer naar png gerekend en meegenomen in de bouw.
//
// logo.svg is de donkere uitvoering (marine, staal en #bf2027); dat is de juiste,
// want de logobalk in de mail staat op #F4F6F8 en niet op het donker van de site.
// De achtergrond wordt platgelegd op diezelfde kleur in plaats van doorzichtig
// gelaten, want een mailprogramma in donkere weergave zet een doorzichtige png op
// zwart en dan verdwijnt het marine.
//
// 480 breed voor een weergave op 240 (confirmation.ts, logoWidth), zodat hij
// scherp blijft op een retina-scherm.
import { mkdirSync } from 'fs';
import sharp from 'sharp';

const BREED = 480;
const ACHTERGROND = '#F4F6F8';
const UIT = 'inhoud/assets/mail/framemedia-email.png';

mkdirSync('inhoud/assets/mail', { recursive: true });

const png = await sharp('inhoud/assets/logo.svg', { density: 600 })
  .resize({ width: BREED })
  .flatten({ background: ACHTERGROND })
  .png({ compressionLevel: 9 })
  .toBuffer();

await sharp(png).toFile(UIT);

const m = await sharp(UIT).metadata();
console.log(`${UIT}: ${m.width}x${m.height}, ${(png.length / 1024).toFixed(1)} kB`);

// De plaat voor de mailhandtekening (/handtekening/, zie handtekening.mjs).
// Een andere plaat dan die van de bevestigingsmail, en met opzet: Mail op de
// Mac toont een handtekeningplaat op zijn eigen maat en gooit width/height uit
// de opmaak weg. Dus precies LOGO_BREED x LOGO_SCHAAL pixels, met de dpi in de
// pHYs-blok zodat Mail hem op LOGO_BREED punten zet. Wit plat, niet doorzichtig:
// in donkere weergave zet een mailprogramma doorzichtig op zwart.
const { LOGO_BREED, LOGO_SCHAAL, LOGO_BESTAND } = await import('../handtekening.mjs');
const HT_UIT = `inhoud/${LOGO_BESTAND}`;
const ht = await sharp('inhoud/assets/logo.svg', { density: 600 })
  .resize({ width: LOGO_BREED * LOGO_SCHAAL })
  .flatten({ background: '#ffffff' })
  .withMetadata({ density: 72 * LOGO_SCHAAL })
  .png({ compressionLevel: 9 })
  .toFile(HT_UIT);
console.log(`${HT_UIT}: ${ht.width}x${ht.height} op ${72 * LOGO_SCHAAL} dpi, ${(ht.size / 1024).toFixed(1)} kB`);
