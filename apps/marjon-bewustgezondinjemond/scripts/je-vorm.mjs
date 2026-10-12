/* Eenmalige omzetting terug: de hele site van u naar je.
 *
 * Marjon vroeg op 28 sep 2026 om u; op 10 okt 2026 liet zij via Armando weten
 * dat het weer je mag worden. Dit draait de omzetting van `u-vorm.mjs` precies
 * terug: elk paar daar is [je-zin, u-zin], hier zoeken we de u-zin en zetten de
 * je-zin terug. De zinnen staan dus maar op een plek beschreven.
 *
 * Twee uitzonderingen:
 * - de AANSPREEKVORM-toelichting in verklaring-tekst.js. Terugdraaien zou de
 *   oude tekst terugzetten die niets over deze ronde zegt; die schrijf ik met
 *   de hand.
 * - zinnen waar na 28 sep nog iets anders in veranderd is, bijvoorbeeld de
 *   aanhalingstekens om de praktijknaam van 9 okt. Die vindt het script niet
 *   meer letterlijk; het meldt dat en past dan NIETS aan.
 *
 * Gebruik: node scripts/je-vorm.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HIER = path.dirname(fileURLToPath(import.meta.url));
const R = (p) => path.join(HIER, '..', p);

/* De paren uit u-vorm.mjs overnemen zonder dat script te laten draaien: het
   stuk `const WERK = [ ... ];` eruit knippen en als los stukje JS inlezen. */
const bron = fs.readFileSync(path.join(HIER, 'u-vorm.mjs'), 'utf8');
const begin = bron.indexOf('const WERK = [');
const eind = bron.indexOf('\n];', begin) + 3;
if (begin < 0 || eind < 3) throw new Error('WERK staat niet meer in u-vorm.mjs');
const brokje = bron.slice(begin, eind) + '\nexport default WERK;';
const WERK = (await import('data:text/javascript;charset=utf-8,' + encodeURIComponent(brokje))).default;

/* Zinnen die na 28 sep nog een keer veranderd zijn, dus niet meer letterlijk in
   u-vorm.mjs staan. Hier staat de huidige u-zin met de je-zin die eroverheen
   gaat. [bestand, u-zin, je-zin, hoeveel keer] */
const EXTRA = [
  [
    'src/App.tsx',
    // 9 okt 2026: aanhalingstekens om de praktijknaam
    'Uw reis naar &ldquo;Bewust Gezond in je Mond&rdquo;',
    'Jouw reis naar &ldquo;Bewust Gezond in je Mond&rdquo;',
    1,
  ],
  [
    'src/privacy.tsx',
    // de staart van deze zin is na 28 sep nog herschreven; die volgorde houden
    'Precies een ding: dat u de melding onderaan hebt weggeklikt. Dat staat in de opslag van uw eigen browser, het bevat geen nummer waaraan u te herkennen bent, en het wordt nooit naar ons of naar iemand anders verstuurd. Als u uw browsergegevens wist, dan is het weg en verschijnt de melding opnieuw.',
    'Precies een ding: dat je de melding onderaan hebt weggeklikt. Dat staat in de opslag van je eigen browser, het bevat geen nummer waaraan jij te herkennen bent, en het wordt nooit naar ons of naar iemand anders verstuurd. Als je je browsergegevens wist, dan is het weg en verschijnt de melding opnieuw.',
    1,
  ],
];

let totaal = 0;
let overgeslagen = 0;
const problemen = [];
const uit = new Map();

const regels = (s, crlf) => (crlf ? s.replace(/\r?\n/g, '\r\n') : s.replace(/\r\n/g, '\n'));

for (const [bestand, paren] of WERK) {
  const pad = R(bestand);
  let t = fs.readFileSync(pad, 'utf8');
  const crlf = t.includes('\r\n');
  for (let [je, u, hoeveel] of paren) {
    if (je === u) continue; // stond er in u-vorm.mjs al als niet-wijziging
    if (u.includes('AANSPREEKVORM')) {
      overgeslagen++;
      continue;
    }
    // de versie uit EXTRA doet deze zin
    if (u.includes('Uw reis naar Bewust Gezond in je Mond') || u.includes('Precies een ding: dat u de melding')) continue;
    const van = regels(u, crlf);
    const naar = regels(je, crlf);
    const n = t.split(van).length - 1;
    if (n !== hoeveel) {
      problemen.push(`${bestand}: ${n}x gevonden, ${hoeveel}x verwacht -> ${van.slice(0, 80)}`);
      continue;
    }
    t = t.split(van).join(naar);
    totaal += n;
  }
  uit.set(pad, t);
}

for (const [bestand, u, je, hoeveel] of EXTRA) {
  const pad = R(bestand);
  let t = uit.get(pad) ?? fs.readFileSync(pad, 'utf8');
  const crlf = t.includes('\r\n');
  const van = regels(u, crlf);
  const n = t.split(van).length - 1;
  if (n !== hoeveel) {
    problemen.push(`${bestand} (extra): ${n}x gevonden, ${hoeveel}x verwacht -> ${van.slice(0, 80)}`);
    continue;
  }
  uit.set(pad, t.split(van).join(regels(je, crlf)));
  totaal += n;
}

if (problemen.length) {
  console.log(`NIETS AANGEPAST. ${problemen.length} regel(s) kloppen niet:\n` + problemen.join('\n'));
  process.exit(1);
}

for (const [pad, t] of uit) fs.writeFileSync(pad, t);
console.log(`${totaal} zinnen terug naar je in ${uit.size} bestanden (${overgeslagen} met de hand).`);
