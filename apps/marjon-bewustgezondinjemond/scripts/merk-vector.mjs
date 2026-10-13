/**
 * Tekent het merk opnieuw als vector en schrijft merk/ vol: SVG, PNG en PDF.
 *
 * Waarom dit bestaat. Het enige logobestand dat we ooit kregen is een
 * lijntekening op wit, ingescand of geexporteerd op 1308x1316. Daar maakt
 * scripts/bloem-asset.mjs public/img/bloem.png van: 640x640, achtergrond eruit.
 * Dat is prima voor een scherm en onbruikbaar voor alles daarbuiten. Groter dan
 * 640 wordt hij zacht, een drukker kan er niets mee en een andere kleur betekent
 * een nieuw plaatje.
 *
 * De figuur is de Flower of Life: pure meetkunde, dus hij valt exact na te
 * rekenen in plaats van na te tekenen. Uit public/img/bloem.png gemeten
 * (scripts/merk-meet.mjs):
 *
 *   Zeshoekig rooster, afstand tussen de middelpunten = de straal, 92,8 px.
 *   De 19 cirkels met hun middelpunt binnen 2x de straal staan er heel op; de
 *   cirkels daarbuiten alleen voor zover ze binnen die 19 vallen (zie
 *   zichtbareBogen). Omringende cirkel: straal 280,1 = 3x de straal,
 *   concentrisch (afwijking 0,5 px). Lijndikte 5,2 px, binnen en buiten gelijk.
 *   Inktkleur #306d78, dat is --color-bloem (#316d78) met jpeg-ruis.
 *
 * De 3:1 verhouding tussen de buitencirkel en de kleine cirkels is precies de
 * klassieke constructie: de zes buitenste bloembladen raken de ring, en links en
 * rechts blijft er lucht. In het aangeleverde bestand is die ring 1,3% ovaal
 * (278,3 x 281,9) en staat hij 0,5 px uit het midden. Dat is scanruis, geen
 * ontwerp, en hier dus rechtgezet. Na het rechtzetten ligt 96,5% van de oude
 * inkt op de nieuwe; wat overblijft is die ovale ring en de ongelijke lijndikte
 * van de scan (4,3 tot 7,0 px). scripts/merk-meet.mjs rekent dat na.
 *
 * Maatvoering hieronder is dezelfde uitsnede als public/img/bloem.png, maal
 * 1000/640. Daardoor komt alles rond uit (straal 145, ring 435) en is een PNG
 * uit deze map inwisselbaar met het bestaande bestand zonder dat het merk op de
 * site van formaat verandert.
 *
 * Het woordmerk staat in echte paden, niet als <text>. Een logo dat een
 * lettertype nodig heeft is geen logo maar een stuk tekst dat er bij iemand
 * anders anders uitziet. Bron: raw/fonts/CormorantGaramond-Light.ttf, hetzelfde
 * gewicht en dezelfde letterafstand als .merknaam in src/index.css.
 *
 * Draaien als het merk verandert, verder nooit. De uitvoer staat in git.
 *
 *   node scripts/merk-vector.mjs
 */
import {mkdirSync, writeFileSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const UIT = path.join(APP, 'merk');

const eigen = createRequire(path.join(APP, 'package.json'));
const sharp = eigen('sharp');

/* opentype.js staat niet in de dependencies van deze app: het is gereedschap
   voor een bestand dat eens per jaar draait. Hij wordt geleend, net als
   playwright in scripts/mail-logo.mjs. */
const opentype = createRequire('C:/Users/nieuw/package.json')('opentype.js');

/* ---------------------------------------------------------------- kleuren */

const BLOEM = '#316d78'; // --color-bloem
const INKT = '#2b4249'; // --color-inkt
const ROOM = '#f6f4ef'; // --color-room

/* ------------------------------------------------------------- meetkunde */

const VAK = 1000; // zelfde uitsnede als public/img/bloem.png, maal 1000/640
const MID = VAK / 2;
const STRAAL = 145; // 92,8 px in het aangeleverde bestand
const RING = STRAAL * 3; // 435 - de zes buitenste bloembladen raken de ring
const LIJN = 8.125; // 5,2 px in het aangeleverde bestand

/**
 * De middelpunten: zeshoekig rooster, afstand = straal, vijf ringen diep
 * (1+6+12+18+24 = 61 punten, alles binnen 4x de straal).
 *
 * De stand is die van het aangeleverde bestand: een middelpunt recht boven en
 * recht onder het hart, geen middelpunt pal links of rechts. Een zeshoekig
 * rooster heeft twee standen die 30 graden schelen; de andere keert dat precies
 * om en dat is zichtbaar een ander merk.
 */
function middelpunten(r) {
  const dx = (r * Math.sqrt(3)) / 2;
  const uit = [];
  for (let j = -5; j <= 5; j++) {
    for (let i = -5; i <= 5; i++) {
      const x = j * dx;
      const y = i * r + (j * r) / 2;
      if (Math.hypot(x, y) <= 4 * r + 1e-9) uit.push([x, y]);
    }
  }
  /* Vast op volgorde, zodat twee keer draaien hetzelfde bestand geeft. */
  uit.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  return uit;
}

const PUNTEN = middelpunten(STRAAL);
if (PUNTEN.length !== 61) throw new Error(`61 middelpunten verwacht, ${PUNTEN.length} gekregen`);

const n = (v) => Number(v.toFixed(4)).toString();

/**
 * De kern: de 19 cirkels met hun middelpunt binnen 2x de straal. Die staan er
 * helemaal op. Alles daarbuiten staat er alleen voor zover het binnen de kern
 * valt - zie hieronder.
 */
const KERN = PUNTEN.filter(([x, y]) => Math.hypot(x, y) <= 2 * STRAAL + 1e-9);
if (KERN.length !== 19) throw new Error(`19 hele cirkels verwacht, ${KERN.length} gekregen`);

/**
 * Waar de buitenste cirkels ophouden.
 *
 * Dit was het lastige stuk. De voor de hand liggende aanname is dat de
 * buitenste bogen door de ring worden afgesneden, maar dat klopt niet: in het
 * aangeleverde bestand blijft het patroon bijna overal ruim binnen de ring, en
 * er loopt nergens een boog dood in het wit. Elke boog eindigt op een andere
 * boog.
 *
 * De regel die dat wel verklaart: een boog telt mee zolang hij binnen een van
 * de 19 kerncirkels valt. De buitenrand van het patroon is dus de schulprand
 * van die 19 schijven samen - vandaar dat hij de ring alleen raakt op de zes
 * plekken waar een kerncirkel tot 3x de straal reikt, en er links en rechts
 * lucht overblijft.
 *
 * Een punt op cirkel C ligt binnen kerncirkel K als cos(hoek - richting naar K)
 * groter is dan afstand(C,K) / (2 * straal). Dat is per K een boog van
 * richting-alfa tot richting+alfa; die bogen bij elkaar vegen geeft het stuk
 * dat getekend wordt.
 */
function zichtbareBogen([cx, cy]) {
  const stukken = [];
  for (const [kx, ky] of KERN) {
    const d = Math.hypot(cx - kx, cy - ky);
    if (d < 1e-9 || d >= 2 * STRAAL) continue;
    const richting = Math.atan2(ky - cy, kx - cx);
    const alfa = Math.acos(d / (2 * STRAAL));
    stukken.push([richting - alfa, richting + alfa]);
  }
  if (!stukken.length) return [];

  /* Alles naar [0, 2pi) halen, stukken die over 0 heen lopen in tweeen knippen,
     en dan samenvoegen wat elkaar raakt. */
  const TAU = 2 * Math.PI;
  const plat = [];
  for (let [a, b] of stukken) {
    a = ((a % TAU) + TAU) % TAU;
    b = ((b % TAU) + TAU) % TAU;
    if (b < a) plat.push([a, TAU], [0, b]);
    else plat.push([a, b]);
  }
  plat.sort((p, q) => p[0] - q[0]);
  const samen = [plat[0]];
  for (const [a, b] of plat.slice(1)) {
    const laatst = samen[samen.length - 1];
    if (a <= laatst[1] + 1e-9) laatst[1] = Math.max(laatst[1], b);
    else samen.push([a, b]);
  }
  /* Loopt het eerste stuk door op het laatste, dan is het er een. */
  if (samen.length > 1 && samen[0][0] < 1e-9 && samen[samen.length - 1][1] > TAU - 1e-9) {
    const eerste = samen.shift();
    samen[samen.length - 1][1] += eerste[1];
  }
  return samen;
}

/** Eén roostercirkel: heel als hij in de kern zit, anders alleen de losse bogen. */
function roosterVorm([cx, cy]) {
  if (Math.hypot(cx, cy) <= 2 * STRAAL + 1e-9)
    return `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(STRAAL)}"/>`;

  const op = (hoek) => [cx + STRAAL * Math.cos(hoek), cy + STRAAL * Math.sin(hoek)];
  return zichtbareBogen([cx, cy])
    .map(([a, b]) => {
      const [x1, y1] = op(a);
      const [x2, y2] = op(b);
      const groot = b - a > Math.PI ? 1 : 0;
      return `<path d="M ${n(x1)} ${n(y1)} A ${n(STRAAL)} ${n(STRAAL)} 0 ${groot} 1 ${n(x2)} ${n(y2)}"/>`;
    })
    .join('');
}

/** De bloem als <g>, op (0,0) gecentreerd. */
function bloemGroep(kleur, dx = 0, dy = 0, schaal = 1) {
  const vormen = PUNTEN.map(roosterVorm).filter(Boolean).join('\n      ');
  const verplaats =
    dx || dy || schaal !== 1
      ? ` transform="translate(${n(dx)} ${n(dy)})${schaal !== 1 ? ` scale(${n(schaal)})` : ''}"`
      : '';
  return `<g${verplaats} fill="none" stroke="${kleur}" stroke-width="${n(LIJN)}" stroke-linecap="butt">
      ${vormen}
      <circle cx="0" cy="0" r="${n(RING)}"/>
    </g>`;
}

function bloemSvg(kleur) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VAK} ${VAK}" width="${VAK}" height="${VAK}" role="img" aria-label="Bewust Gezond in je Mond">
  <title>Bewust Gezond in je Mond</title>
  <g transform="translate(${MID} ${MID})">
    ${bloemGroep(kleur)}
  </g>
</svg>
`;
}

/* ------------------------------------------------------------- woordmerk */

const NAAM = 'Bewust Gezond in je Mond';
const FONT = opentype.loadSync(path.join(APP, 'raw/fonts/CormorantGaramond-Light.ttf'));

/**
 * De naam als één pad. letter-spacing van .merknaam is 0.06em; CSS zet die
 * ruimte na elke letter, ook de laatste - die laatste laat ik weg, anders zit er
 * lucht aan de rechterkant van een logo die niemand ziet maar iedereen meeneemt
 * bij het uitlijnen.
 */
function woordmerk(grootte) {
  const spatie = grootte * 0.06;
  const glyphs = FONT.stringToGlyphs(NAAM);
  const paden = [];
  let x = 0;
  glyphs.forEach((g, i) => {
    const p = g.getPath(x, 0, grootte);
    const d = p.toPathData(4);
    if (d) paden.push(d);
    x += (g.advanceWidth / FONT.unitsPerEm) * grootte;
    if (i < glyphs.length - 1) x += spatie;
  });
  return {d: paden.join(' '), breedte: x};
}

/* ------------------------------------------------------------- liggend logo */

/* Verhoudingen uit de balk bovenaan de site (src/App.tsx): bloem 44 px naast
   tekst van 18 px met 12 px ertussen, verticaal gecentreerd. Hier maal 10. */
const MERK_VAK = 440; // het hele vierkant van bloem.svg, inclusief zijn eigen lucht
const KORPS = 180;
const KIER = 120;

function liggendSvg(bloemKleur, tekstKleur) {
  const {d, breedte} = woordmerk(KORPS);

  /* Hoogte van de tekst zelf, niet van de regel: een logo lijnt uit op wat je
     ziet. Cormorant heeft diepe staarten (de j) en hoge kapitalen (de B). */
  const vak = FONT.getPath(NAAM, 0, 0, KORPS).getBoundingBox();
  const tekstHoog = vak.y2 - vak.y1;

  const hoogte = Math.max(MERK_VAK, tekstHoog);
  const schaal = MERK_VAK / VAK;
  const bloemX = MERK_VAK / 2;
  const tekstX = MERK_VAK + KIER;
  /* Grondlijn zo dat het midden van de letters op het midden van de bloem ligt. */
  const grondlijn = hoogte / 2 - (vak.y1 + vak.y2) / 2;
  const totaal = tekstX + breedte;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n(totaal)} ${n(hoogte)}" width="${n(totaal)}" height="${n(hoogte)}" role="img" aria-label="${NAAM}">
  <title>${NAAM}</title>
  ${bloemGroep(bloemKleur, bloemX, hoogte / 2, schaal)}
  <path transform="translate(${n(tekstX)} ${n(grondlijn)})" fill="${tekstKleur}" d="${d}"/>
</svg>
`;
}

/* ------------------------------------------------------------------ uitvoer */

mkdirSync(path.join(UIT, 'png'), {recursive: true});

const bestanden = {
  'bloem.svg': bloemSvg(BLOEM),
  'bloem-eenkleur.svg': bloemSvg('currentColor'),
  'logo-liggend.svg': liggendSvg(BLOEM, INKT),
  'logo-liggend-eenkleur.svg': liggendSvg('currentColor', 'currentColor'),
};
for (const [naam, inhoud] of Object.entries(bestanden)) {
  writeFileSync(path.join(UIT, naam), inhoud);
  console.log(`svg  ${naam}  ${(inhoud.length / 1024).toFixed(1)} kB`);
}

/* PNG met doorzichtige achtergrond, plus een op haar roomkleur voor wie geen
   transparantie aankan (oudere Outlook tekent die als een zwart vlak). */
async function png(svg, naam, breedte, achtergrond) {
  let s = sharp(Buffer.from(svg), {density: 600}).resize({width: breedte});
  if (achtergrond) s = s.flatten({background: achtergrond});
  const buf = await s.png({compressionLevel: 9}).toBuffer();
  writeFileSync(path.join(UIT, 'png', naam), buf);
  const m = await sharp(buf).metadata();
  console.log(`png  ${naam}  ${m.width}x${m.height}  ${(buf.length / 1024).toFixed(1)} kB`);
}

for (const b of [512, 1024, 2048]) await png(bestanden['bloem.svg'], `bloem-${b}.png`, b);
for (const b of [1024, 2048]) await png(bestanden['logo-liggend.svg'], `logo-liggend-${b}.png`, b);
await png(bestanden['logo-liggend.svg'], 'logo-liggend-1024-room.png', 1024, ROOM);

/* PDF voor de drukker. Chromium zet de paden als vector in het bestand, dus
   schaalbaar tot een gevelbord. Playwright geleend uit claudius, net als in
   scripts/mail-logo.mjs. */
const {chromium} = createRequire('C:/Users/nieuw/dev/claudius/package.json')('playwright');
const browser = await chromium.launch();
for (const [naam, svg] of [
  ['bloem.pdf', bestanden['bloem.svg']],
  ['logo-liggend.pdf', bestanden['logo-liggend.svg']],
]) {
  const m = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const [w, h] = [Number(m[1]), Number(m[2])];
  const MM = 120; // breedte op papier
  const pagina = await browser.newPage();
  await pagina.setContent(
    `<style>html,body{margin:0;padding:0}svg{display:block;width:${MM}mm;height:${((MM * h) / w).toFixed(3)}mm}</style>${svg}`,
  );
  await pagina.pdf({
    path: path.join(UIT, naam),
    width: `${MM}mm`,
    height: `${((MM * h) / w).toFixed(3)}mm`,
    printBackground: true,
    margin: {top: 0, right: 0, bottom: 0, left: 0},
  });
  await pagina.close();
  console.log(`pdf  ${naam}  ${MM}mm breed`);
}
await browser.close();

console.log(`\nklaar: ${path.relative(APP, UIT)}/`);
