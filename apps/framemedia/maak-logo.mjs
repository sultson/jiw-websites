// Zet het echte Frame Media-logo (raw/framemedia-logo.svg) om naar twee
// bruikbare varianten in inhoud/assets/, plus het tabicoontje.
//   node maak-logo.mjs
//
// Het bronbestand stuurt zijn kleuren via een <style>-blok met classes aan.
// Dat is onhandig in een <img> en ronduit gevaarlijk als je het inline zet:
// .cls-1 botst dan met elk ander ingesloten svg-bestand op de pagina. Dus
// zetten we de vulling per pad als attribuut neer en gooien we het blok weg.
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const bron = readFileSync('raw/framemedia-logo.svg', 'utf8');

// --- 1. het <style>-blok uitlezen ------------------------------------------
const stijlBlok = bron.match(/<style>([\s\S]*?)<\/style>/)[1];
const vulling = {};        // cls-1 -> #2e3e50
const regelVorm = new Set(); // welke classes fill-rule:evenodd hebben

for (const regel of stijlBlok.split('}')) {
  if (!regel.includes('{')) continue;
  const [kiezers, inhoud] = regel.split('{');
  const klassen = kiezers.split(',').map(s => s.trim().replace(/^\./, '')).filter(Boolean);
  const kleur = inhoud.match(/fill:\s*(#[0-9a-f]{3,6})/i);
  const evenodd = /fill-rule:\s*evenodd/i.test(inhoud);
  for (const k of klassen) {
    if (kleur) vulling[k] = kleur[1].toLowerCase();
    if (evenodd) regelVorm.add(k);
  }
}

// --- 2. de twee paletten ---------------------------------------------------
// Origineel: het beeldmerk is een bol met vier tinten die van donker (boven)
// naar licht (onder) loopt, plus FRAME in rood en de rest in donkerblauw.
//
// Op een donkere achtergrond kan dat niet: drie van de vier tinten vallen weg.
// Dus draaien we de helderheid om maar houden we de onderlinge afstand vast -
// de bovenste boog blijft de dominante vorm, nu als wit in plaats van als
// donkerste. Het rood gaat mee omhoog, want #bf2027 haalt op bijna-zwart maar
// 3,2:1 en dat is te weinig.
//
// De twee buitenbogen liggen in het origineel vlak bij elkaar (#2e3e50 en
// #324a5e), dus die moeten in de lichte versie ook vlak bij elkaar blijven -
// wit boven en lichtblauw onder liet de bol scheef hangen.
const LICHT = {
  'cls-1': '#ffffff',   // bovenste buitenboog
  'cls-2': '#f4f8fc',   // onderste buitenboog - vrijwel gelijk, net als in het origineel
  'cls-3': '#8fa3b5',   // onderste lensvorm (in het origineel de donkerste, #7e8e8c)
  'cls-4': '#7b90a3',   // bovenste lensvorm (in het origineel de lichtste, #95a4a3)
  'cls-6': '#ff4d57',   // FRAME MEDIA - opgehelderd rood, 5,8:1 op #0d1117
  'cls-7': '#d8e2ec',   // de regel "Producent in TV content"
};

// Welke class bij welk onderdeel van het logo hoort. Nodig om er een variant
// van te kunnen bouwen die klein nog leest.
const ONDERDEEL = {
  'cls-1': 'ring', 'cls-4': 'ring',   // bovenste buitenboog + bovenste lensvorm
  'cls-2': 'ring', 'cls-3': 'ring',   // onderste buitenboog + onderste lensvorm
  'cls-6': 'woordmerk',  // FRAME MEDIA
  'cls-7': 'regel',      // Producent in TV content
};

function schrijf(pad, palet) {
  let svg = bron
    .replace(/<defs>[\s\S]*?<\/defs>/, '')
    .replace(/\sid="[^"]*"/g, '')
    .replace(/\sdata-name="[^"]*"/g, '');

  svg = svg.replace(/class="(cls-\d+)"/g, (_, klas) => {
    const kleur = (palet && palet[klas]) || vulling[klas];
    const stukken = [];
    if (kleur) stukken.push(`fill="${kleur}"`);
    if (regelVorm.has(klas)) stukken.push('fill-rule="evenodd"');
    return stukken.join(' ');
  });

  // cls-5 was alleen isolation:isolate, die heeft geen vulling en valt er
  // hierboven vanzelf uit. Losse lege class-attributen opruimen.
  svg = svg.replace(/\sclass="[^"]*"/g, '').replace(/\s{2,}/g, ' ').replace(/ >/g, '>');
  writeFileSync(pad, svg.trim() + '\n');
  return svg.length;
}

mkdirSync('inhoud/assets', { recursive: true });
const a = schrijf('inhoud/assets/logo.svg', null);          // origineel, voor lichte vlakken
const b = schrijf('inhoud/assets/logo-licht.svg', LICHT);   // voor donkere vlakken

// --- 3. tabicoontje --------------------------------------------------------
// Een logo van 311 bij 193 met een tagline erin is op 16 beeldpunten een vlek.
// Dus een eigen vierkantje: het rode opnamestipje in een donkere tegel met een
// witte F. Zelfde taal als de site, leesbaar op elke maat.
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="13" fill="#11161d"/>
  <rect x="5.5" y="5.5" width="53" height="53" rx="9.5" fill="none" stroke="#2e3e50" stroke-width="2"/>
  <path d="M20 17h22v7H27.5v7.5H40v7H27.5V47H20z" fill="#ffffff"/>
  <circle cx="46" cy="44" r="5.5" fill="#ff4d57"/>
</svg>
`;
writeFileSync('inhoud/assets/favicon.svg', favicon);

// --- 4. de kleine variant: alleen het woordmerk ----------------------------
// Hun logo is een insigne van 311 bij 193: FRAME MEDIA loopt dwars door een
// ring heen, met de regel eronder er ook nog binnenin. Op menuhoogte (44,
// op de telefoon 32) wordt de naam daarin 7 beeldpunten hoog. Onleesbaar.
//
// Een eerdere poging zette het merkteken links en de naam ernaast. Dat was
// fout, en het meten hieronder laat zien waarom: de twee bogen zijn maar
// kappen van een veel grotere cirkel (169 breed, de bogen samen 92 hoog met
// 100 ertussen). De naam is niet iets dat toevallig voor de ring langs loopt -
// de ring bestaat alleen doordat de naam er doorheen gaat. Haal je hem eruit,
// dan houd je twee losse maantjes over. Ze weer tegen elkaar schuiven maakt
// het erger: dan raken de lensvormen elkaar en wordt het een strik.
//
// Dus: klein = alleen het woordmerk met de regel eronder, in hun eigen letters
// en hun eigen onderlinge maatvoering. Het insigne blijft heel en staat waar
// het wel past - groot, in de voettekst en op de foutpagina.
//
// Om te weten waar elk onderdeel staat meten we de echte vorm op met getBBox()
// in een browser; padcoordinaten uitrekenen met een regex gaat bij bogen mis.
import { chromium } from 'playwright';

function paden(klassen) {
  return [...bron.matchAll(/<path[^>]*class="(cls-\d+)"[^>]*\/>/g)]
    .filter(m => klassen.includes(m[1]))
    .map(m => m[0]);
}

const GROEPEN = ['ring', 'woordmerk', 'regel'];
const perGroep = Object.fromEntries(GROEPEN.map(g => [
  g, paden(Object.keys(ONDERDEEL).filter(k => ONDERDEEL[k] === g)),
]));

const meetSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 311.3979 192.6992">
${GROEPEN.map(g => `<g id="${g}">${perGroep[g].join('')}</g>`).join('\n')}
</svg>`;

const browser = await chromium.launch();
const pagina = await browser.newPage();
await pagina.setContent(`<body style="margin:0">${meetSvg}</body>`);
const kaders = await pagina.evaluate(ids => Object.fromEntries(ids.map(id => {
  const k = document.getElementById(id).getBBox();
  return [id, { x: k.x, y: k.y, w: k.width, h: k.height }];
})), GROEPEN);
await browser.close();

const w = kaders.woordmerk, r = kaders.regel;
// De afstand tussen naam en regel houden we precies zoals in het origineel.
const REGEL_GAT = r.y - (w.y + w.h);
const hoogte = w.h + REGEL_GAT + r.h;
const regelX = (w.w - r.w) / 2;   // gecentreerd onder de naam, net als bij hen

const zet = (kader, x, y) =>
  `translate(${(x - kader.x).toFixed(3)} ${(y - kader.y).toFixed(3)})`;

function schrijfWoord(pad, palet) {
  const kleur = klas => (palet && palet[klas]) || vulling[klas];
  const groep = (naam, transform) => `  <g transform="${transform}">
${perGroep[naam].map(p => '    ' + p
    .replace(/class="(cls-\d+)"/, (_, k) => `fill="${kleur(k)}"${regelVorm.has(k) ? ' fill-rule="evenodd"' : ''}`)
  ).join('\n')}
  </g>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w.w.toFixed(2)} ${hoogte.toFixed(2)}">
${groep('woordmerk', zet(w, 0, 0))}
${groep('regel', zet(r, regelX, w.h + REGEL_GAT))}
</svg>
`;
  writeFileSync(pad, svg);
  return svg.length;
}

const c = schrijfWoord('inhoud/assets/logo-woord.svg', null);
const d = schrijfWoord('inhoud/assets/logo-woord-licht.svg', LICHT);

console.log(`logo.svg ${a} B, logo-licht.svg ${b} B (311x193)`);
console.log(`logo-woord.svg ${c} B, logo-woord-licht.svg ${d} B (${w.w.toFixed(0)}x${hoogte.toFixed(0)})`);
console.log(`favicon.svg ${favicon.length} B`);
