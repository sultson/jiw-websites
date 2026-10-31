// Het nieuwe merk van FRAME MEDIA (aangeleverd 31-10-2026) naar bruikbare
// maten voor de site, de mail en om door te sturen.
//   node tools/maak-merk.mjs
//
// De klant leverde twee uitvoeringen aan, allebei als png met een doorzichtige
// achtergrond:
//   - no-lens   het woordmerk alleen, goud met zilveren MEDIA eronder
//   - full-lens hetzelfde woordmerk met de cameralens er rechts achter
//
// De lens is een fotorealistisch stuk beeld van ruim een derde van de breedte.
// Dat werkt groot en wordt klein een donkere vlek, dus:
//   - de menubalk krijgt de uitvoering zonder lens  (verzoek van de klant)
//   - de voettekst en de foutpagina krijgen de volle uitvoering
//
// Beide bronbestanden hebben een royale doorzichtige rand (de no-lens ruim 100
// beeldpunten aan elke kant). Die moet eraf, anders staat het logo in de balk
// op een ingebouwde marge te zweven en klopt geen enkele uithoogte. trim()
// zoekt de echte rand van het beeld op; de gloed eromheen telt daarin mee,
// want die hoort bij het ontwerp.
//
// Alles wordt op ruim twee en een half keer de weergavehoogte gerekend - een
// logo is het eerste wat je op een retina-scherm ziet verwateren - en als webp
// weggeschreven. Dat is hier ook de huisregel (zie het logo van Puur Genieten
// in blokken.mjs). Hoger dan dit kost alleen maar: een goudverloop comprimeert
// slecht, drie keer de hoogte was voor de menubalk 39 kB tegen 26 nu, en dat
// op elke pagina.
import { mkdirSync } from 'fs';
import sharp from 'sharp';

const BRON_ZONDER = 'raw/merk-2026/frame-media-logo-no-lens.png';
const BRON_VOL = 'raw/merk-2026/frame-media-logo-full-lens.png';

const UIT = 'inhoud/assets/merk';
const UIT_DOWNLOAD = 'inhoud/assets/download';

mkdirSync(UIT, { recursive: true });
mkdirSync(UIT_DOWNLOAD, { recursive: true });

/** Bron bijsnijden tot waar het beeld echt begint. */
const gesneden = bron => sharp(bron).trim({ threshold: 1 });

/**
 * Een maat wegschrijven en teruggeven wat het geworden is, zodat de breedte en
 * hoogte in bouw.mjs uit het bestand zelf komen en niet uit een gok. Een
 * verkeerde width/height op een <img> laat de pagina tijdens het laden
 * verspringen, en dat telt mee in de Core Web Vitals.
 */
async function schrijf(bron, pad, hoogte, opties = {}) {
  const buf = await gesneden(bron)
    .resize({ height: hoogte, fit: 'inside', withoutEnlargement: true })
    .toBuffer();
  const uit = sharp(buf);
  if (opties.achtergrond) uit.flatten({ background: opties.achtergrond });
  const data = pad.endsWith('.png')
    ? await uit.png({ compressionLevel: 9, ...(opties.png || {}) }).toBuffer()
    : await uit.webp({ quality: opties.kwaliteit ?? 85, effort: 6 }).toBuffer();
  await sharp(data).toFile(pad);
  const m = await sharp(pad).metadata();
  console.log(`${pad.padEnd(44)} ${String(m.width).padStart(5)}x${String(m.height).padEnd(5)} ${(data.length / 1024).toFixed(1).padStart(7)} kB`);
  return { breedte: m.width, hoogte: m.height };
}

// --- 1. de menubalk --------------------------------------------------------
// Staat op 48 beeldpunten hoog (36 op een telefoon), dus 120 is twee en een
// half keer op een laptop en ruim drie keer op een telefoon.
const balk = await schrijf(BRON_ZONDER, `${UIT}/fm-woord.webp`, 120);

// --- 2. de voettekst en de foutpagina --------------------------------------
// Staat op 104 beeldpunten hoog, dus 260 is twee en een half keer.
const groot = await schrijf(BRON_VOL, `${UIT}/fm-vol.webp`, 260);

// De bevestigingsmail heeft zijn eigen png en die wordt bij elke bouw opnieuw
// gerekend - zie tools/gen-mail-logo.mjs, dat in `pnpm build` zit.

// --- 3. om door te sturen --------------------------------------------------
// Social, een presentatie, een beursbanner. Doorzichtig en groot. Deze maat is
// hun eigen bestand op ware grootte, alleen bijgesneden.
const dlZonder = await schrijf(BRON_ZONDER, `${UIT_DOWNLOAD}/frame-media-logo.png`, 1200);
const dlVol = await schrijf(BRON_VOL, `${UIT_DOWNLOAD}/frame-media-logo-lens.png`, 1200);

console.log('');
console.log('Zet deze maten in bouw.mjs (merk / merkGroot):');
console.log(`  menubalk   width="${balk.breedte}" height="${balk.hoogte}"`);
console.log(`  voettekst  width="${groot.breedte}" height="${groot.hoogte}"`);
console.log(`  download   ${dlZonder.breedte}x${dlZonder.hoogte} / ${dlVol.breedte}x${dlVol.hoogte}`);
