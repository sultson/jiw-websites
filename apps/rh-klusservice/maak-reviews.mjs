/* Schrijft alle beoordelingen met tekst in de schuifrij op dist/index.html.
   Draaien:  node maak-reviews.mjs
   Het blok tussen de twee markers is gegenereerd, bewerk dat niet met de hand.

   Robbin wil al zijn Werkspot-beoordelingen op de site (07-10-2026, via Armando).
   Dat zijn er 49, waarvan 41 met tekst. De acht zonder tekst krijgen geen kaart:
   die hebben niets te laten zien en tellen alleen mee in het gemiddelde.

   Twee dingen die uit de bron komen en niet uit ons hoofd:
   - de score staat op een schaal van tien. 10 is vijf sterren, 8 is vier. Eén
     beoordeling (Soumitra, oktober 2024) staat op 8 en krijgt dus vier sterren.
     Het gemiddelde over alle 49 is 4,98; Werkspot toont dat zelf als 5,0.
   - 15 van de 41 kwamen zonder naam uit de scrape. Die kaart zet de plaats op
     de naamregel ("Klant uit Eindhoven"), en als ook die ontbreekt "Klant via
     Werkspot". Verzinnen we daar een naam bij, dan staat er een klant op de
     site die niet bestaat. */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const hier = dirname(fileURLToPath(import.meta.url));
const PAGINA = join(hier, 'dist/index.html');

const alles = JSON.parse(readFileSync(join(hier, 'werkspot-reviews.json'), 'utf8'));

/* De eerste tien stonden al met de hand op de site, uit een oudere scrape die
   de naam nog wel meekreeg. Die twee namen staan niet in werkspot-reviews.json
   en zouden anders verdwijnen. */
const NAMEN = { 929355: 'Marc', 895918: { naam: 'Marianne', plaats: 'Maarheeze' } };

const MAANDEN = ['januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

const vlucht = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const maandJaar = (iso) => {
  const d = new Date(iso);
  return `${MAANDEN[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

function wie(b) {
  const extra = NAMEN[b.id];
  const naam = (typeof extra === 'string' ? extra : extra?.naam) || (b.naam || '').trim();
  const plaats = (typeof extra === 'object' ? extra.plaats : '') || (b.plaats || '').trim();
  if (naam) return { regel: plaats ? `${naam}, ${plaats}` : naam, letter: naam[0].toUpperCase() };
  if (plaats) return { regel: `Klant uit ${plaats}`, letter: plaats[0].toUpperCase() };
  return { regel: 'Klant via Werkspot', letter: '&rdquo;' };
}

const VINK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6.2 11.6 2.9 8.3 4 7.2l2.2 2.2 5.8-5.8 1.1 1.1z"/></svg>';

function kaart(b) {
  const vol = Math.round(b.score / 2);
  const sterren = '&#9733;'.repeat(vol) + '&#9734;'.repeat(5 - vol);
  const tekst = vlucht(b.tekst.trim()).replace(/\r?\n+/g, '<br>');
  const { regel, letter } = wie(b);
  return `      <article class="review">
        <div class="review__top">
          <span class="sterren" aria-hidden="true">${sterren}</span>
          <span class="review__datum">${maandJaar(b.datum)}</span>
        </div>
        <p>&ldquo;${tekst}&rdquo;</p>
        <footer>
          <span class="review__cirkel" aria-hidden="true">${letter}</span>
          <span class="review__wie"><b>${vlucht(regel)}</b><small>${VINK} Geverifieerde klus via Werkspot</small></span>
        </footer>
      </article>`;
}

/* Google (10-11-2026, via Armando): hij heeft daar 1 beoordeling, 5 sterren, van
   "Wowwow" (Local Guide, 14-10-2026). Bewust geen eigen blok of eigen cijfer: "5,0
   uit 1 review" leest zwakker dan niets. Google-kaarten staan vooraan in dezelfde
   rij, met Google als bron eronder.
   Bron is google-reviews.json, bijgehouden door ~/dev/review-wacht. Is een review
   niet in het Nederlands geschreven, dan staat de vertaling van Google erin met
   status "wacht": die komt pas op de site als iemand hem op "ok" zet (zie de
   README van review-wacht). Anders citeren we een vertaling ongezien als klanttekst. */
const TALEN = { en: 'het Engels', de: 'het Duits', fr: 'het Frans', es: 'het Spaans', pl: 'het Pools', tr: 'het Turks', ar: 'het Arabisch' };
const GOOGLE_KAARTEN = JSON.parse(readFileSync(join(hier, 'google-reviews.json'), 'utf8'))
  .filter((g) => g.status === 'ok' && (g.tekst || '').trim())
  .sort((a, b) => new Date(b.datum) - new Date(a.datum));

function googleKaart(g) {
  const tekst = vlucht(g.tekst.trim()).replace(/\r?\n+/g, '<br>');
  const vol = Math.round(g.score || 5);
  const bron = g.taal && g.taal !== 'nl'
    ? `Review op Google, vertaald uit ${TALEN[g.taal] || 'een andere taal'}`
    : 'Review op Google';
  return `      <article class="review">
        <div class="review__top">
          <span class="sterren" aria-hidden="true">${'&#9733;'.repeat(vol) + '&#9734;'.repeat(5 - vol)}</span>
          <span class="review__datum">${maandJaar(g.datum)}</span>
        </div>
        <p>&ldquo;${tekst}&rdquo;</p>
        <footer>
          <span class="review__cirkel" aria-hidden="true">${g.naam[0].toUpperCase()}</span>
          <span class="review__wie"><b>${vlucht(g.naam)}</b><small>${VINK} ${bron}</small></span>
        </footer>
      </article>`;
}

const metTekst = alles
  .filter((b) => (b.tekst || '').trim())
  .sort((a, b) => new Date(b.datum) - new Date(a.datum));

const BEGIN = '      <!-- beoordelingen:begin (node maak-reviews.mjs) -->';
const EINDE = '      <!-- beoordelingen:einde -->';
const blok = [BEGIN, ...GOOGLE_KAARTEN.map(googleKaart), ...metTekst.map(kaart), EINDE].join('\n');

let html = readFileSync(PAGINA, 'utf8');
const open = html.indexOf('<div class="ws__lijst"');
if (open === -1) throw new Error('ws__lijst niet gevonden in dist/index.html');
const start = html.indexOf('>', open) + 1;
const stop = html.indexOf('\n    </div>', start);
if (stop === -1) throw new Error('einde van ws__lijst niet gevonden');

html = html.slice(0, start) + '\n' + blok + html.slice(stop);
writeFileSync(PAGINA, html);

/* Het aantal in de twee handwerkpagina's: de regel onder de herofoto, de intro
   van het reviewblok en reviewCount in het schema. Komt uit reviews-stand.json. */
const { werkspot } = JSON.parse(readFileSync(join(hier, 'reviews-stand.json'), 'utf8'));
for (const pad of ['dist/index.html', 'dist/projecten/index.html']) {
  const vol = join(hier, pad);
  const oud = readFileSync(vol, 'utf8');
  const nieuw = oud
    .replace(/(&middot; )\d+( beoordelingen)/g, `$1${werkspot.aantal}$2`)
    .replace(/(gemiddeld uit )\d+( beoordelingen)/g, `$1${werkspot.aantal}$2`)
    .replace(/("reviewCount":")\d+(")/g, `$1${werkspot.aantal}$2`);
  if (nieuw !== oud) writeFileSync(vol, nieuw);
}

const naamloos = metTekst.filter((b) => !(b.naam || '').trim() && !NAMEN[b.id]).length;
console.log(`${metTekst.length} beoordelingen geschreven (${alles.length - metTekst.length} zonder tekst overgeslagen, ${naamloos} zonder naam)`);
