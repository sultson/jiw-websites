/**
 * De social-accounts staan op twee plekken en die moeten gelijk blijven.
 *
 * src/data.ts is de bron: per stichting een lijstje `socials`. De voet en de
 * drie stichtingspagina's lezen dat rechtstreeks, dus daar kan niets uit elkaar
 * lopen. Maar index.html is een statisch bestand met een schema.org-blok erin
 * en dat kan geen TypeScript importeren — het `sameAs`-lijstje daar is
 * handwerk. Precies het soort plek waar een adres blijft hangen: de pagina ziet
 * er goed uit terwijl Google nog het oude account krijgt.
 *
 * Deze controle legt de twee naast elkaar en laat de build zakken zodra ze niet
 * meer hetzelfde zeggen. Draaien met: node scripts/check-socials.mjs
 */
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const hier = path.dirname(fileURLToPath(import.meta.url));
const wortel = path.join(hier, '..');

/** Elk `{soort: '..', url: '..'}` uit data.ts, in de volgorde van het bestand. */
function uitData() {
  const bron = fs.readFileSync(path.join(wortel, 'src/data.ts'), 'utf8');
  const re = /\{soort:\s*'(facebook|instagram|linkedin)',\s*url:\s*'([^']+)'\}/g;
  return [...bron.matchAll(re)].map(([, soort, url]) => ({soort, url}));
}

/** Het sameAs-lijstje uit het schema.org-blok in index.html. */
function uitIndex() {
  const bron = fs.readFileSync(path.join(wortel, 'index.html'), 'utf8');
  const blok = bron.match(/"sameAs":\s*\[([^\]]*)\]/);
  if (!blok) {
    console.error('check-socials: geen "sameAs" in index.html gevonden.');
    process.exit(1);
  }
  return [...blok[1].matchAll(/"([^"]+)"/g)].map(([, url]) => url);
}

const data = uitData();
const index = uitIndex();
let fout = 0;

if (!data.length) {
  console.error('check-socials: geen socials in src/data.ts gevonden — is het patroon veranderd?');
  process.exit(1);
}

/* Een account op de site maar niet in sameAs: Google krijgt het niet te zien. */
for (const {soort, url} of data) {
  if (!index.includes(url)) {
    console.error(`check-socials: ${soort} staat in data.ts maar niet in sameAs: ${url}`);
    fout++;
  }
}

/* En andersom: een adres in sameAs dat nergens meer op de site staat is een
   account dat we aan Google doorgeven zonder dat het nog van ons is. */
const adressen = new Set(data.map((s) => s.url));
for (const url of index) {
  if (!adressen.has(url)) {
    console.error(`check-socials: sameAs noemt een adres dat niet in data.ts staat: ${url}`);
    fout++;
  }
}

/* Twee keer hetzelfde platform bij één stichting levert twee knoppen op die er
   identiek uitzien — het label in Paginas.tsx is de soort, niet de naam van de
   pagina. Dan moet eerst beslist worden welke pagina de echte is. */
const bron = fs.readFileSync(path.join(wortel, 'src/data.ts'), 'utf8');
for (const [, blok] of bron.matchAll(/socials:\s*\[([^\]]*)\]/g)) {
  const soorten = [...blok.matchAll(/soort:\s*'(\w+)'/g)].map(([, s]) => s);
  const dubbel = soorten.filter((s, i) => soorten.indexOf(s) !== i);
  if (dubbel.length) {
    console.error(`check-socials: één stichting heeft twee keer ${[...new Set(dubbel)].join(', ')}`);
    fout++;
  }
}

if (fout) {
  console.error(`\ncheck-socials: ${fout} probleem(en). De build stopt hier.`);
  process.exit(1);
}

console.log(`check-socials: ${data.length} accounts in data.ts, ${index.length} in sameAs, gelijk.`);
