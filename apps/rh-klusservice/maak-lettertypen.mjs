/* Schrijft dist/lettertype/*.woff2 uit bron/lettertype/*.ttf.

   Waarom: de drie lettertypen stonden als TTF in dist, samen 774 KB, en ze zitten
   in het kritieke pad — de browser vindt ze pas nadat stijl.css binnen is. Op een
   trage verbinding was dat 175-180 ms voordat er een letter op het scherm kon staan.

   Twee ingrepen in een stap:
   1. WOFF2 in plaats van TTF. Zelfde letter, brotli eromheen.
   2. Alleen de tekens die een Nederlandse site nodig heeft. De volledige Inter
      draagt Grieks, Cyrillisch en Vietnamees mee; daar staat geen letter van op
      deze site. Wat we houden: latin-1 (dus é ë ï ó ü), de IJ-ligatuur, en het
      leesteken-blok U+2000-206F voor het kastje-streepje en het rechte aanhaalteken.

   Bewust GEEN unicode-range in de @font-face: zonder die regel haalt de browser
   het lettertype altijd op en valt hij per teken terug op een systeemletter als een
   glyph ontbreekt. Met een range die net te krap staat, verdwijnt het hele
   lettertype voor zo'n stuk tekst en springt de opmaak. Eén duim-emoji in een
   beoordeling (U+1F44D) komt zo gewoon van het systeem.

   Vereist fonttools + brotli in python: python -m pip install fonttools brotli.
   Draait niet opnieuw als de woff2 jonger is dan de ttf. */

import { readdirSync, mkdirSync, statSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const hier = dirname(fileURLToPath(import.meta.url));
const VAN = join(hier, 'bron/lettertype');
const NAAR = join(hier, 'dist/lettertype');

// latin-1, de IJ/ij-ligatuur en het leestekenblok. Dat laatste zit erbij voor het
// kastje-streepje (U+2014) en het rechte aanhaalteken (U+2019); die staan beide in
// de beoordelingen.
const TEKENS = [
  'U+0000-00FF',
  'U+0131',
  'U+0132-0133',
  'U+0152-0153',
  'U+02BB-02BC',
  'U+02C6',
  'U+02DA',
  'U+02DC',
  'U+2000-206F',
  'U+20AC',
  'U+2122',
  'U+2212',
  'U+FEFF',
  'U+FFFD',
].join(',');

// kern en liga wil je houden, anders valt de spatiëring van Inter uit elkaar.
const KENMERKEN = 'kern,liga,clig,rlig,ccmp,locl,mark,mkmk';

mkdirSync(NAAR, { recursive: true });

let gedaan = 0;
let overgeslagen = 0;

for (const bestand of readdirSync(VAN).filter((f) => f.endsWith('.ttf'))) {
  const van = join(VAN, bestand);
  const naar = join(NAAR, basename(bestand, '.ttf') + '.woff2');

  if (existsSync(naar) && statSync(naar).mtimeMs >= statSync(van).mtimeMs) {
    overgeslagen++;
    continue;
  }

  execFileSync('python', [
    '-m', 'fontTools.subset', van,
    `--unicodes=${TEKENS}`,
    `--layout-features=${KENMERKEN}`,
    '--flavor=woff2',
    '--desubroutinize',
    `--output-file=${naar}`,
  ], { stdio: ['ignore', 'ignore', 'inherit'] });

  const voor = (statSync(van).size / 1024).toFixed(0);
  const na = (statSync(naar).size / 1024).toFixed(0);
  console.log(`  ${bestand}: ${voor} KB ttf -> ${na} KB woff2`);
  gedaan++;
}

console.log(`lettertypen: ${gedaan} omgezet, ${overgeslagen} al bij`);
