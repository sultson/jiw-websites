/* Tekent de tandmeridianenkaart opnieuw: in Marjons eigen kleuren en in het
   Nederlands, in plaats van de felroze/gele Engelse kaart die zij meestuurde.

   De indeling is die van haar eigen kaart (Voll): vier kwadranten van acht
   elementen, per groep een orgaanpaar, het weefsel dat erbij hoort en de
   klachten die op dat gebied kunnen wijzen.

   gebruik: node scripts/meridianen.mjs   -> public/img/tandmeridianen.svg  */

import {writeFileSync} from 'node:fs';

/* ---------- palet ---------- */

const ROOM = '#f6f4ef';
const INKT = '#2b4249';
const OLIJF = '#7c8460';

/* Per orgaangroep een eigen kleur uit haar huisstijl. De ring met de orgaannaam
   krijgt de diepe variant, want daar staat tekst op: room op petrol of olijf
   haalt de 4,5:1 die leesbare tekst nodig heeft niet, op de diepe versie wel.
   Mosterd is zo licht dat daar juist de inktkleur op moet. */
const GROEPEN = {
  nier: {kleur: '#497b89', ring: '#33606d', ringTekst: ROOM},
  lever: {kleur: '#7c8460', ring: '#5f6749', ringTekst: ROOM},
  long: {kleur: '#d9b441', ring: '#d9b441', ringTekst: INKT},
  maag: {kleur: '#c4691c', ring: '#a9550f', ringTekst: ROOM},
  hart: {kleur: '#2b4249', ring: '#2b4249', ringTekst: ROOM},
};

/* ---------- inhoud ---------- */

const WEEFSEL = {
  nier: 'geslachtsorganen, skelet, voeten, voorhoofdsholte, oor',
  lever: 'oog, heup, knie, spieren, pezen',
  longBoven: 'bronchiën, schouder, elleboog, neus, bijholten, oogfundus, bindweefsel',
  longOnder: 'bindweefsel, elleboog, schouder, bronchiën',
  maagBoven: 'mond, kaakholte, kaakgewricht, strottenhoofd, borstklier, bindweefsel',
  maagOnder: 'lymfe, bindweefsel, borstklier, strottenhoofd, kaakholte, kaakgewricht, mond',
  hartBoven:
    'twaalfvingerige darm, middenoor, schouder, elleboog, hersenen, ruggenmerg, bloed en bloedvaten',
  hartOnder: 'bloed, ruggenmerg, hersenen, oor, elleboog, schouder, zenuwen',
};

const KLACHT = {
  nier: 'onvruchtbaarheid, impotentie',
  lever: 'concentratie',
  migraine: 'migraine',
  reuma: 'reuma',
  hartBoven: 'migraine, epilepsie',
  longOnder: 'lage rugpijn, reuma',
  hartOnder: 'energiehuishouding, hoofdpijn, migraine, epilepsie, duizeligheid',
};

/* De volgorde vanaf de middenlijn naar buiten. In de bovenkaak zitten de
   longtanden voor de maagtanden, in de onderkaak precies andersom: dat staat
   ook zo op haar eigen kaart. */
const BOVEN = [
  {groep: 'nier', tanden: 2, orgaan: 'Nier | blaas', weefsel: WEEFSEL.nier, klacht: KLACHT.nier},
  {groep: 'lever', tanden: 1, orgaan: 'Lever | galblaas', weefsel: WEEFSEL.lever, klacht: KLACHT.lever},
  {groep: 'long', tanden: 2, orgaan: 'Long | dikke darm', weefsel: WEEFSEL.longBoven, klacht: KLACHT.migraine},
  {groep: 'maag', tanden: 2, orgaan: 'Maag | @', weefsel: WEEFSEL.maagBoven, klacht: KLACHT.reuma},
  {groep: 'hart', tanden: 1, orgaan: 'Hart | dunne darm', weefsel: WEEFSEL.hartBoven, klacht: KLACHT.hartBoven},
];

const ONDER = [
  {groep: 'nier', tanden: 2, orgaan: 'Nier | blaas', weefsel: WEEFSEL.nier, klacht: KLACHT.nier},
  {groep: 'lever', tanden: 1, orgaan: 'Lever | galblaas', weefsel: WEEFSEL.lever, klacht: KLACHT.lever},
  {groep: 'maag', tanden: 2, orgaan: 'Maag | @', weefsel: WEEFSEL.maagOnder, klacht: KLACHT.reuma},
  {groep: 'long', tanden: 2, orgaan: 'Long | dikke darm', weefsel: WEEFSEL.longOnder, klacht: KLACHT.longOnder},
  {groep: 'hart', tanden: 1, orgaan: 'Hart | dunne darm', weefsel: WEEFSEL.hartOnder, klacht: KLACHT.hartOnder},
];

/* Kwadranten zoals de tandarts ze nummert, gezien vanaf de bezoeker:
   1 = rechtsboven bij hemzelf (dus links op de kaart), 2 = linksboven, enzovoort.
   hoek 0 is 12 uur, met de klok mee. Elk kwadrant beslaat 90 graden. */
const KWADRANTEN = [
  {nr: 1, basis: 360, richting: -1, rij: BOVEN, milt: false},
  {nr: 2, basis: 0, richting: 1, rij: BOVEN, milt: true},
  {nr: 3, basis: 180, richting: -1, rij: ONDER, milt: true},
  {nr: 4, basis: 180, richting: 1, rij: ONDER, milt: false},
];

/* ---------- maten ---------- */

const B = 1600;
const H = 1680;
const CX = 800;
const CY = 800;

const R_TAND = 262;
const R_KLACHT = [312, 432];
const R_WEEFSEL = [440, 612];
const R_ORGAAN = [620, 706];
const R_RAND = 716;

const PER_TAND = 90 / 8;

/* ---------- gereedschap ---------- */

const rad = (g) => ((g - 90) * Math.PI) / 180; // 0 graden = 12 uur
const px = (r, g) => [CX + r * Math.cos(rad(g)), CY + r * Math.sin(rad(g))];
const rond = (n) => Math.round(n * 100) / 100;

function meng(hex, doel, deel) {
  const h = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const [r1, g1, b1] = h(hex);
  const [r2, g2, b2] = h(doel);
  const m = (a, b) => Math.round(a * deel + b * (1 - deel));
  return '#' + [m(r1, r2), m(g1, g2), m(b1, b2)].map((v) => v.toString(16).padStart(2, '0')).join('');
}

/* een vlak tussen twee stralen en twee hoeken */
function wig(r1, r2, a1, a2) {
  const [x1, y1] = px(r2, a1);
  const [x2, y2] = px(r2, a2);
  const [x3, y3] = px(r1, a2);
  const [x4, y4] = px(r1, a1);
  const groot = a2 - a1 > 180 ? 1 : 0;
  return [
    `M${rond(x1)} ${rond(y1)}`,
    `A${r2} ${r2} 0 ${groot} 1 ${rond(x2)} ${rond(y2)}`,
    `L${rond(x3)} ${rond(y3)}`,
    `A${r1} ${r1} 0 ${groot} 0 ${rond(x4)} ${rond(y4)}`,
    'Z',
  ].join(' ');
}

const breedte = (tekst, fs) => tekst.length * fs * 0.55;

function breek(tekst, maxBreedte, fs) {
  const woorden = tekst.split(' ');
  const regels = [];
  let huidig = '';
  for (const w of woorden) {
    const kandidaat = huidig ? huidig + ' ' + w : w;
    if (huidig && breedte(kandidaat, fs) > maxBreedte) {
      regels.push(huidig);
      huidig = w;
    } else {
      huidig = kandidaat;
    }
  }
  if (huidig) regels.push(huidig);
  return regels;
}

/* Past een horizontaal tekstblok binnen de wig? De wig is niet bol, dus ik
   controleer niet alleen de hoeken maar punten langs de hele omtrek. */
function pastInWig(cx, cy, halveB, halveH, r1, r2, a1, a2) {
  const punten = [];
  const stap = 8;
  for (let i = 0; i <= stap; i++) {
    const t = -halveB + (2 * halveB * i) / stap;
    punten.push([cx + t, cy - halveH], [cx + t, cy + halveH]);
  }
  for (let i = 1; i < stap; i++) {
    const t = -halveH + (2 * halveH * i) / stap;
    punten.push([cx - halveB, cy + t], [cx + halveB, cy + t]);
  }
  return punten.every(([x, y]) => {
    const dx = x - CX;
    const dy = y - CY;
    const r = Math.hypot(dx, dy);
    if (r < r1 || r > r2) return false;
    let g = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    while (g < a1 - 0.001) g += 360;
    while (g > a1 + 360) g -= 360;
    return g <= a2;
  });
}

/* Zoekt de grootste letter die nog past, en de regelbreedte die daarbij hoort. */
function tekstblok(tekst, r1, r2, a1, a2, opties = {}) {
  const {maxFs = 13, minFs = 9, regelHoogte = 1.28} = opties;
  const aMid = (a1 + a2) / 2;
  const rMid = (r1 + r2) / 2;
  const [x, y] = px(rMid, aMid);
  for (let fs = maxFs; fs >= minFs; fs -= 0.5) {
    for (let w = 360; w >= 70; w -= 8) {
      const regels = breek(tekst, w, fs);
      const echteBreedte = Math.max(...regels.map((rg) => breedte(rg, fs)));
      const hoogte = regels.length * fs * regelHoogte;
      if (pastInWig(x, y, echteBreedte / 2 + 4, hoogte / 2 + 3, r1, r2, a1, a2)) {
        return {x, y, regels, fs, lh: fs * regelHoogte};
      }
    }
  }
  return null;
}

function tekstSvg({x, y, regels, fs, lh}, kleur, gewicht = 400) {
  const start = y - ((regels.length - 1) * lh) / 2;
  const inhoud = regels
    .map(
      (r, i) =>
        `<tspan x="${rond(x)}" y="${rond(start + i * lh)}">${r.replace(/&/g, '&amp;')}</tspan>`,
    )
    .join('');
  return `<text text-anchor="middle" dominant-baseline="middle" font-size="${fs}" font-weight="${gewicht}" fill="${kleur}">${inhoud}</text>`;
}

/* ---------- tekenen ---------- */

const uit = [];

uit.push(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${B} ${H}" width="${B}" height="${H}" font-family="'Quicksand', 'Trebuchet MS', system-ui, sans-serif" role="img" aria-label="Kaart van het gebit met per tand het bijbehorende orgaan, weefsel en de klachten die daarbij horen">`,
);
uit.push(`<rect width="${B}" height="${H}" fill="${ROOM}"/>`);

/* buitenrand */
uit.push(`<circle cx="${CX}" cy="${CY}" r="${R_RAND}" fill="none" stroke="#c9d3ce" stroke-width="3"/>`);

const kleine = [];

for (const kw of KWADRANTEN) {
  let offset = 0;
  for (const groep of kw.rij) {
    const g = GROEPEN[groep.groep];
    const h1 = kw.basis + kw.richting * offset * PER_TAND;
    const h2 = kw.basis + kw.richting * (offset + groep.tanden) * PER_TAND;
    const a1 = Math.min(h1, h2);
    const a2 = Math.max(h1, h2);

    /* de drie ringen */
    uit.push(
      `<path d="${wig(...R_ORGAAN, a1, a2)}" fill="${g.ring}" stroke="${ROOM}" stroke-width="2"/>`,
    );
    uit.push(
      `<path d="${wig(...R_WEEFSEL, a1, a2)}" fill="${meng(g.kleur, ROOM, 0.2)}" stroke="${ROOM}" stroke-width="2"/>`,
    );
    uit.push(
      `<path d="${wig(...R_KLACHT, a1, a2)}" fill="${meng(g.kleur, ROOM, 0.36)}" stroke="${ROOM}" stroke-width="2"/>`,
    );

    /* Orgaannaam: langs de boog, nooit op zijn kop. In een sector van een enkele
       tand is de boog te kort voor de hele naam op een regel; twee sectoren van
       dezelfde soort liggen dan bij de horizontale as tegen elkaar aan en lezen
       ook nog eens tegen elkaar in. Daarom breekt de naam daar bij de punt. */
    const naam = groep.orgaan.replace('@', kw.milt ? 'milt' : 'alvleesklier');
    const aMid = (a1 + a2) / 2;
    /* Normaal draait de tekst mee met de boog en klapt hij om zodra hij op zijn
       kop zou komen te staan. Precies op de horizontale as (90 en 270 graden)
       ligt die omslag echter tussen twee sectoren in, en dan lezen twee gelijke
       namen vlak naast elkaar tegen elkaar in. Vlak na die as klapt hij daarom
       niet om, zodat het paar dezelfde kant op leest. */
    const bijDeAs = (aMid > 90 && aMid < 115) || (aMid > 245 && aMid < 270);
    const draai = !bijDeAs && aMid > 90 && aMid < 270 ? aMid + 180 : aMid;
    const [ox, oy] = px((R_ORGAAN[0] + R_ORGAAN[1]) / 2, aMid);
    const boog = 2 * R_ORGAAN[0] * Math.sin((((a2 - a1) / 2) * Math.PI) / 180);
    const heel = naam.replace('|', '·');
    const orgaanRegels =
      heel.length * 17 * 0.58 > boog * 0.85 ? naam.split('|').map((s) => s.trim()) : [heel];
    const orgaanTekst = orgaanRegels
      .map(
        (r, i) =>
          `<tspan x="0" y="${rond((i - (orgaanRegels.length - 1) / 2) * 21)}">${r}</tspan>`,
      )
      .join('');
    uit.push(
      `<g transform="translate(${rond(ox)} ${rond(oy)}) rotate(${rond(draai)})">` +
        `<text text-anchor="middle" dominant-baseline="middle" font-size="17" font-weight="600" letter-spacing="0.04em" fill="${g.ringTekst}">${orgaanTekst}</text>` +
        `</g>`,
    );

    /* weefsel en klachten: horizontaal, zoals op haar eigen kaart */
    const weefsel = tekstblok(groep.weefsel, ...R_WEEFSEL, a1, a2, {maxFs: 13.5, minFs: 9});
    if (!weefsel) throw new Error('weefseltekst past niet: ' + groep.weefsel);
    uit.push(tekstSvg(weefsel, INKT));

    const klacht = tekstblok(groep.klacht, ...R_KLACHT, a1, a2, {maxFs: 13, minFs: 9});
    if (!klacht) throw new Error('klachttekst past niet: ' + groep.klacht);
    uit.push(tekstSvg(klacht, INKT, 600));

    /* de tanden zelf */
    for (let t = 0; t < groep.tanden; t++) {
      const nr = offset + t + 1;
      const hoek = kw.basis + kw.richting * (offset + t + 0.5) * PER_TAND;
      const [tx, ty] = px(R_TAND, hoek);
      kleine.push(
        `<g transform="translate(${rond(tx)} ${rond(ty)}) rotate(${rond(hoek)})">` +
          `<rect x="-17" y="-19" width="34" height="38" rx="11" fill="#ffffff" stroke="${g.kleur}" stroke-width="2.5"/>` +
          `</g>` +
          `<text x="${rond(tx)}" y="${rond(ty)}" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="${INKT}">${kw.nr}${nr}</text>`,
      );
    }

    offset += groep.tanden;
  }
}

uit.push(kleine.join(''));

/* ---------- hart van de kaart ---------- */

/* de bloem des levens, haar eigen merkteken, als rustige achtergrond */
const bloem = [];
const RB = 50;
const midden = [[0, 0]];
for (let i = 0; i < 6; i++) {
  const a = (i * 60 * Math.PI) / 180;
  midden.push([RB * Math.cos(a), RB * Math.sin(a)]);
  midden.push([2 * RB * Math.cos(a), 2 * RB * Math.sin(a)]);
  const b = ((i * 60 + 30) * Math.PI) / 180;
  midden.push([RB * Math.sqrt(3) * Math.cos(b), RB * Math.sqrt(3) * Math.sin(b)]);
}
for (const [x, y] of midden) {
  bloem.push(
    `<circle cx="${rond(CX + x)}" cy="${rond(CY + y)}" r="${RB}" fill="none" stroke="#497b89" stroke-width="1.6"/>`,
  );
}
bloem.push(
  `<circle cx="${CX}" cy="${CY}" r="${3 * RB}" fill="none" stroke="#497b89" stroke-width="2.4"/>`,
);
uit.push(`<g opacity="0.16">${bloem.join('')}</g>`);

uit.push(
  `<text x="${CX}" y="${CY - 212}" text-anchor="middle" font-size="15" font-weight="700" letter-spacing="0.22em" fill="${OLIJF}">BOVENKAAK</text>`,
);
uit.push(
  `<text x="${CX}" y="${CY + 220}" text-anchor="middle" font-size="15" font-weight="700" letter-spacing="0.22em" fill="${OLIJF}">ONDERKAAK</text>`,
);

uit.push(
  `<text x="${CX}" y="${CY - 16}" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif" font-size="42" letter-spacing="0.05em" fill="${INKT}">Gebit &amp; meridianen</text>`,
);
uit.push(
  `<text x="${CX}" y="${CY + 26}" text-anchor="middle" font-size="15" fill="${INKT}" opacity="0.75">Elke tand en kies staat in verbinding met</text>`,
);
uit.push(
  `<text x="${CX}" y="${CY + 48}" text-anchor="middle" font-size="15" fill="${INKT}" opacity="0.75">een orgaan, een weefsel en een meridiaan.</text>`,
);

/* legenda voor de ringen, zodat de kaart ook los te lezen is */
const legenda = [
  ['binnenste ring', 'klachten die op dit gebied kunnen wijzen'],
  ['middelste ring', 'organen en weefsels die meelopen'],
  ['buitenste ring', 'het orgaanpaar en zijn meridiaan'],
];
uit.push(
  `<text x="${CX}" y="${H - 42}" text-anchor="middle" font-size="15" fill="${INKT}" opacity="0.7">` +
    legenda.map(([a, b]) => `${a}: ${b}`).join('   ·   ') +
    `</text>`,
);
uit.push(
  `<text x="${CX}" y="${H - 14}" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif" font-size="19" letter-spacing="0.12em" fill="${OLIJF}">&#8220;Bewust Gezond in je Mond&#8221;</text>`,
);

uit.push('</svg>');

writeFileSync(new URL('../public/img/tandmeridianen.svg', import.meta.url), uit.join('\n'));
console.log('geschreven: public/img/tandmeridianen.svg');
