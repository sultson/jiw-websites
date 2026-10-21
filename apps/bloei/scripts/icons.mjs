/**
 * Maakt het merkteken: favicon.svg plus de pictogrammen die een SVG-favicon
 * niet dekt.
 *
 * Safari op iOS zet een startknop niet neer met een SVG maar met een PNG, en
 * doorschijnend wordt daar zwart. Google's favicon-crawler wil er bovendien een
 * van minstens 48 pixels bij hebben, anders staat er in de zoekresultaten een
 * grijze wereldbol naast de winkel in plaats van hun eigen teken.
 *
 * Wat hier stond tot 18-10-2026 was het roze madeliefje van Fleurig!. Dat is
 * bij de hele omkleuring over het hoofd gezien omdat het nergens in de pagina
 * zelf voorkomt: een favicon zie je alleen in het tabblad, in de bladwijzers en
 * in het zoekresultaat. Het stond er dus nog, als enige roze op een site
 * waar verder geen roze meer te vinden was.
 *
 * Nu het blad uit het logo. En niet nagetekend: dit script knipt de bladgroep
 * letterlijk uit public/img/logo-bloei-wit.svg, dus het teken in het tabblad is
 * hetzelfde pad als het teken in de balk bovenaan. Een nagezet blad loopt bij
 * de volgende logo-aanlevering uit de pas, dit niet.
 *
 * De uitsnede wordt gemeten en niet geschat: de bladgroep gaat één keer door
 * sharp heen met trim(), en de randen die dat weghaalt zijn de echte
 * begrenzing van de vorm. Een viewBox met de hand erbij verzinnen geeft een
 * blad dat net niet in het midden staat.
 *
 *   node scripts/icons.mjs
 */
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMG = path.join(APP, 'public/img');
const LOGO = path.join(IMG, 'logo-bloei-wit.svg');

/* De huisstijl. Dennengroen is het vlak, het blad erop in zijn eigen twee
   tinten — dezelfde kleuren waarmee het logo zelf op een donkere ondergrond
   staat. */
const DENNEN = '#173F2B';
const SALIE = '#4F784B';
const LICHT = '#A9C58D';
const WIT = '#FFFFFF';

/* ------------------------------------------------------------------ */
/*  Het blad uit het logo halen                                        */
/* ------------------------------------------------------------------ */

/**
 * Sinds 20-10-2026 is dit de tweekleurige versie uit de huisstijlmap
 * (01-Logos/Extras-tweekleurig). Daarvoor stond hier de eenkleurige: wit
 * woordmerk, blad in één tint lindegroen (#B1C2A2). In de tweekleurige is dat
 * blad gesplitst in een donkere helft (saliegroen) en een lichte (#A9C58D),
 * waardoor het blad diepte krijgt in plaats van een silhouet te zijn.
 *
 * Voor dit script betekent dat: niet één bladgroep maar twee, plus één los pad
 * dat buiten beide groepen staat en zijn eigen vulling draagt. Alles wat niet
 * wit is, is blad.
 */
const logo = await readFile(LOGO, 'utf8');

/* ------------------------------------------------------------------ */
/*  De gekleurde versie                                                */
/* ------------------------------------------------------------------ */

/**
 * De huisstijl levert per logo een hele waaier bestanden; wij houden er één als
 * bron aan — de witte op doorzichtig — en maken de gekleurde voor lichte
 * vlakken daaruit. Wit wordt dennengroen en de donkere bladhelft ook; de
 * lichte helft blijft staan. Dat is precies hun eigen
 * `bloei-primair-kleur-transparant.svg`, op de groepsindeling na: zij voegen de
 * twee dennengroene groepen samen tot één, wij laten ze staan. Byte voor byte
 * nagelopen op 20-10-2026, verder geen verschil.
 *
 * Waarom niet gewoon hun bestand gebruiken: dan staan er twee bestanden van
 * hetzelfde merk naast elkaar die alleen van vorm gelijk zijn zolang niemand
 * er iets aan doet. Nu is er één bron, en loopt de gekleurde versie per
 * definitie mee met de witte.
 */
const vervang = (tekst, van, naar) => {
  const uit = tekst.replace(new RegExp(`fill="${van}"`, 'gi'), `fill="${naar}"`);
  if (uit === tekst) {
    throw new Error(
      `icons: geen fill="${van}" in ${path.basename(LOGO)}. ` +
      'Is er een nieuw logo aangeleverd met andere kleuren erin?',
    );
  }
  return uit;
};

const logoKleur = vervang(vervang(logo, WIT, DENNEN), SALIE, DENNEN);

await writeFile(
  path.join(IMG, 'logo-bloei-kleur.svg'),
  logoKleur.replace(
    '<title>',
    '<desc>Afgeleid van logo-bloei-wit.svg door scripts/icons.mjs — niet met de hand bewerken.</desc><title>',
  ),
  'utf8',
);
console.log('icons: logo-bloei-kleur.svg');

/**
 * Elke vorm wordt een stukje SVG dat op zichzelf staat: inclusief zijn eigen
 * vulling en, waar nodig, de binnenste transform. Die binnenste hoort erbij
 * omdat de paden in de groepen in het assenstelsel van potrace staan
 * (honderdsten, y omgekeerd); zonder die regel staat het blad duizenden
 * eenheden buiten beeld. Het losse pad buiten de groepen staat juist wél in de
 * eenheden van het logo en gaat ongewijzigd mee.
 *
 * Door elke vorm als compleet stukje te bewaren in plaats van als kaal pad kan
 * de rest van dit script er vrij mee schuiven zonder bij te houden uit welke
 * groep iets kwam — en houdt het blad zijn twee tinten.
 */
const GROEP = /<g transform="translate\(50 32\)" fill="(#[0-9A-Fa-f]{6})">([\s\S]*?)<\/g>\s*<\/g>/g;

const vormen = [];
let rest = logo;

for (const m of logo.matchAll(GROEP)) {
  rest = rest.replace(m[0], '');
  if (m[1].toUpperCase() === WIT) continue; /* de letters */

  const binnen = m[2].match(/<g[^>]*transform="translate\(0\.0+,343\.0+\)[^"]*"[^>]*>/);
  if (!binnen) throw new Error(`icons: de binnenste transform van de groep ${m[1]} is niet gevonden.`);

  for (const pad of m[2].match(/<path\b[^>]*\/>/g) ?? []) {
    vormen.push(`<g transform="translate(50 32)" fill="${m[1]}">${binnen[0]}${pad}</g></g>`);
  }
}

/* Wat er buiten de groepen staat. In de tweekleurige versie is dat één pad met
   zijn eigen vulling; in de eenkleurige stond hier niets. */
for (const pad of rest.match(/<path\b[^>]*\/>/g) ?? []) {
  if (!/fill="#FFFFFF"/i.test(pad)) vormen.push(pad);
}

if (!vormen.length) {
  throw new Error(
    `icons: geen bladvormen in ${path.basename(LOGO)} — alles is wit. ` +
    'Is er een nieuw logo aangeleverd met andere kleuren erin?',
  );
}

/** Eén of meer vormen op zichzelf, in het assenstelsel van het logo (680x410). */
const bladSvg = (stukken) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="680" height="410" viewBox="0 0 680 410">` +
  `${stukken.join('')}</svg>`;

/* ------------------------------------------------------------------ */
/*  Meten waar de vormen precies staan                                 */
/* ------------------------------------------------------------------ */

/**
 * Eén keer op hoge resolutie renderen en de doorzichtige randen eraf laten
 * halen. Wat sharp dan wegknipt is de echte begrenzing van de vorm, en de
 * offsets die het teruggeeft rekenen we terug naar de eenheden van het logo.
 */
const SCHAAL = 4;
const meet = async (stukken) => {
  const {info} = await sharp(Buffer.from(bladSvg(stukken)), {density: 72 * SCHAAL})
    .trim({threshold: 1})
    .toBuffer({resolveWithObject: true});
  return {
    x: -info.trimOffsetLeft / SCHAAL,
    y: -info.trimOffsetTop / SCHAAL,
    w: info.width / SCHAAL,
    h: info.height / SCHAAL,
  };
};

/* ------------------------------------------------------------------ */
/*  Alleen de scheut, niet het losse blad                              */
/* ------------------------------------------------------------------ */

/**
 * Het blad bestaat uit meer vormen dan er blaadjes zijn: de scheut die boven de
 * letters uitsteekt, en het losse blad dat dwars door de O van BLOEI valt. Dat
 * losse blad hoort bij de letters en niet bij de scheut — zet je ze samen in
 * een vierkant pictogram, dan zweeft er onder de scheut een vlek zonder
 * verband, en op 16 pixels is dat gewoon vuil.
 *
 * Welke dat is wordt gemeten en niet geteld: de vormen van de scheut staan vlak
 * bij elkaar in de steel, en het losse blad staat er ruim onder. Clusteren op
 * nabijheid en de grootste nemen geeft de scheut, ook als er ooit een logo komt
 * waarin de vormen in een andere volgorde staan of er eentje bij komt. Dat
 * laatste gebeurde ook: de tweekleurige versie heeft acht vormen waar de
 * eenkleurige er drie had, want elk blaadje is gesplitst in een donkere en een
 * lichte helft. Omdat die twee helften elkaar per definitie raken, vallen ze
 * vanzelf in hetzelfde cluster.
 *
 * Gemeten in het eenkleurige logo: de blaadjes van de scheut raakten elkaar net
 * niet (3,5 eenheden ertussen, want hun rechthoeken lopen tot de steel en niet
 * eroverheen), en het losse blad lag er 41 vandaan. De speling hieronder is 2%
 * van de breedte van het logo, dus ruwweg 14 — royaal boven de 3,5 en ruim
 * onder de 41.
 */
const SPELING = 680 * 0.02;
const vakken = await Promise.all(vormen.map((v) => meet([v])));
const raakt = (a, b) =>
  a.x - SPELING < b.x + b.w && b.x - SPELING < a.x + a.w &&
  a.y - SPELING < b.y + b.h && b.y - SPELING < a.y + a.h;

/** Samenvoegen wat elkaar raakt, net zo lang tot er niets meer samen kan. */
const clusters = vormen.map((v, i) => ({stukken: [v], vakken: [vakken[i]]}));
for (let i = 0; i < clusters.length; i++) {
  for (let j = i + 1; j < clusters.length; j++) {
    if (clusters[i].vakken.some((a) => clusters[j].vakken.some((b) => raakt(a, b)))) {
      clusters[i].stukken.push(...clusters[j].stukken);
      clusters[i].vakken.push(...clusters[j].vakken);
      clusters.splice(j, 1);
      j = i; /* opnieuw langs de rest: dit cluster is net groter geworden */
    }
  }
}

const oppervlak = (c) => c.vakken.reduce((t, v) => t + v.w * v.h, 0);
const scheut = clusters.sort((a, b) => oppervlak(b) - oppervlak(a))[0];
const stukken = scheut.stukken;

console.log(
  `icons: ${vormen.length} vormen in het blad, ${clusters.length} los van elkaar; ` +
  `de scheut is er ${stukken.length}`,
);

const vak = await meet(stukken);

/* Vierkant eromheen, zodat het blad in een vierkant pictogram niet uitgerekt
   wordt. Het blad is hoger dan breed; de langste zijde bepaalt. */
const zij = Math.max(vak.w, vak.h);
const viewBox = [
  +(vak.x - (zij - vak.w) / 2).toFixed(2),
  +(vak.y - (zij - vak.h) / 2).toFixed(2),
  +zij.toFixed(2),
  +zij.toFixed(2),
].join(' ');

console.log(`icons: blad gemeten op ${vak.w.toFixed(1)}x${vak.h.toFixed(1)} in het logo`);

/**
 * Het blad strak uitgesneden, op maat, eventueel op een vlak.
 *
 * `plat` gooit de donkere bladhelft op de lichte tint, zodat er één silhouet
 * overblijft in plaats van twee tinten. Dat is voor het tabblad: saliegroen
 * haalt op dennengroen 2,3:1, en op 16 pixels valt die helft daardoor gewoon
 * weg — je houdt een halve scheut over die eruitziet als een vlekje. Nagekeken
 * op 16, 24, 32 en 48 pixels naast elkaar: tot ongeveer 48 wint het silhouet,
 * daarboven wint de tweekleurige omdat je het blad dan echt ziet liggen.
 */
const teken = (formaat, achtergrond, plat = false) => {
  /* Op 62% van het vlak, zodat er rondom lucht staat en het blad op een
     afgerond vierkant niet tegen de hoeken aanloopt. */
  const binnenmaat = achtergrond ? Math.round(formaat * 0.62) : formaat;
  const marge = (formaat - binnenmaat) / 2;
  const blad = plat
    ? stukken.map((s) => s.replace(new RegExp(`fill="${SALIE}"`, 'gi'), `fill="${LICHT}"`))
    : stukken;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${formaat}" height="${formaat}" viewBox="0 0 ${formaat} ${formaat}">` +
    (achtergrond ? `<rect width="${formaat}" height="${formaat}" fill="${achtergrond}"/>` : '') +
    `<svg x="${marge}" y="${marge}" width="${binnenmaat}" height="${binnenmaat}" viewBox="${viewBox}">` +
    `${blad.join('')}</svg></svg>`,
  );
};

/* ------------------------------------------------------------------ */
/*  Wegschrijven                                                       */
/* ------------------------------------------------------------------ */

await mkdir(IMG, {recursive: true});

/**
 * De favicon zelf. Op een vlak en niet vrijstaand: een browser zet het tabblad
 * in zijn eigen kleur, en een groen blad op een lichtgrijs tabblad is bijna
 * niets. Dennengroen eronder maakt er een teken van dat op elk tabblad staat.
 *
 * Dit is het ene bestand dat een browser op 16 tot 32 pixels zet, dus als
 * silhouet in één tint — zie `plat` hierboven.
 */
await writeFile(
  path.join(APP, 'public/favicon.svg'),
  '<!-- Het blad uit het logo, op dennengroen. Niet met de hand getekend maar\n' +
  '     uitgeknipt uit public/img/logo-bloei-wit.svg door scripts/icons.mjs;\n' +
  '     draai dat script opnieuw als het logo verandert. -->\n' +
  `${teken(100, DENNEN, true).toString('utf8')}\n`,
  'utf8',
);
console.log('icons: favicon.svg');

/**
 * Het formaat van het bestand is niet het formaat waarop het te zien is. De 96
 * is er voor Google's favicon-crawler en staat in een zoekresultaat op ruwweg
 * 16 pixels; die gaat dus net als het tabblad plat. De andere drie komen op een
 * beginscherm terecht en zijn daar groot genoeg voor de twee tinten.
 */
const BESTANDEN = [
  ['apple-touch-icon.png', 180, false],
  ['icon-96.png', 96, true],
  ['icon-192.png', 192, false],
  ['icon-512.png', 512, false],
];

for (const [naam, formaat, plat] of BESTANDEN) {
  const uit = path.join(IMG, naam);
  await sharp(teken(formaat, DENNEN, plat), {density: 300}).png({compressionLevel: 9}).toFile(uit);
  console.log(`icons: ${naam} (${formaat}x${formaat})${plat ? ' plat' : ''}`);
}

/* ------------------------------------------------------------------ */
/*  Het logo voor de bevestigingsmail                                  */
/* ------------------------------------------------------------------ */

/**
 * Een mailprogramma toont geen SVG, dus daar moet een PNG heen.
 *
 * De gekleurde versie, want in de sjabloon staat het logo op `surfaceAlt` en
 * dat is een licht vlak. En op dat vlak ingebakken in plaats van doorzichtig:
 * een doorzichtige PNG wordt in de donkere stand van Outlook en Apple Mail op
 * zwart gezet, en dennengroene letters op zwart zijn weg.
 *
 * Op 2x, want een mailprogramma schaalt naar 240 en een scherm met dubbele
 * puntdichtheid laat daar anders de rafels van zien.
 */
const MAIL_BREED = 480;
const MAIL_VLAK = '#f6f9f3'; /* surfaceAlt in worker/confirmation-email.ts */
const mailHoog = Math.round((MAIL_BREED * 410) / 680);

await sharp(Buffer.from(logoKleur), {density: 300})
  .resize(MAIL_BREED, mailHoog, {fit: 'contain', background: MAIL_VLAK})
  .flatten({background: MAIL_VLAK})
  .png({compressionLevel: 9})
  .toFile(path.join(APP, 'public/logo-email.png'));
console.log(`icons: logo-email.png (${MAIL_BREED}x${mailHoog})`);

/* Het manifest hoort bij de twee Android-formaten hierboven. Zonder manifest
   krijgt een bezoeker die de site op zijn beginscherm zet een schermafdruk met
   een grijs randje in plaats van het merkteken. */
const manifest = {
  name: 'Bloei!',
  short_name: 'Bloei!',
  description: 'Bloemen, planten, tuin en wonen aan het Hoge Pad in Ouddorp.',
  lang: 'nl-NL',
  start_url: '/',
  display: 'browser',
  /* De achtergrond van de site zelf, niet de room van Fleurig!. */
  background_color: '#f2f6ef',
  theme_color: DENNEN,
  icons: [
    {src: '/img/icon-192.png', sizes: '192x192', type: 'image/png'},
    {src: '/img/icon-512.png', sizes: '512x512', type: 'image/png'},
    {src: '/img/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable'},
  ],
};

await writeFile(path.join(APP, 'public/site.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log('icons: site.webmanifest');
