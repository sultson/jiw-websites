// Het logo voor de bevestigingsmail, als platte png.
//
// Een mailprogramma tekent geen svg en geen webp - Outlook op Windows, Gmail
// in de app en Apple Mail laten er allemaal iets anders of niets van zien.
// Dus wordt het logo hier een keer naar png gerekend en meegenomen in de bouw.
//
// Bron is sinds 31-10-2026 het nieuwe merk van de klant, de uitvoering ZONDER
// de cameralens (raw/merk-2026/). Die lens is op de lichte logobalk van de mail
// (#F4F6F8) een zwart blok van een derde van de breedte; het woordmerk alleen
// staat daar schoon op. Daarvoor stond hier logo.svg, het oude marine-en-rode
// woordmerk.
//
// De achtergrond wordt platgelegd op die balkkleur in plaats van doorzichtig
// gelaten, want een mailprogramma in donkere weergave zet een doorzichtige png
// op zwart en dan verdwijnt het zilver van MEDIA en de regel eronder.
//
// Met een palet van 256 kleuren in plaats van de volle png: 133 kB wordt 38 kB.
// Het goudverloop heeft daar genoeg aan op deze maat, en een mailbox met een
// limiet merkt het verschil wel.
//
// 480 breed voor een weergave op 240 (confirmation.ts, logoWidth), zodat hij
// scherp blijft op een retina-scherm.
import { mkdirSync } from 'fs';
import sharp from 'sharp';

const BRON = 'raw/merk-2026/frame-media-logo-no-lens.png';
const BREED = 480;
const ACHTERGROND = '#F4F6F8';
const UIT = 'inhoud/assets/mail/framemedia-email-2026-10.png';

mkdirSync('inhoud/assets/mail', { recursive: true });

// trim() haalt de doorzichtige rand van het bronbestand weg (ruim 100
// beeldpunten aan elke kant), anders staat het logo in de mail op een
// ingebouwde marge te zweven.
const png = await sharp(BRON)
  .trim({ threshold: 1 })
  .resize({ width: BREED })
  .flatten({ background: ACHTERGROND })
  .png({ palette: true, quality: 92, dither: 1, compressionLevel: 9 })
  .toBuffer();

await sharp(png).toFile(UIT);

const m = await sharp(UIT).metadata();
console.log(`${UIT}: ${m.width}x${m.height}, ${(png.length / 1024).toFixed(1)} kB`);
