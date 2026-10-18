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

/* De huisstijl. Dennengroen is het vlak, lindegroen het blad erop — dezelfde
   twee kleuren waarmee het logo zelf op een donkere ondergrond staat. */
const DENNEN = '#173F2B';
const SALIE = '#4F784B';
const LINDE = '#B1C2A2';
const WIT = '#FFFFFF';

/* ------------------------------------------------------------------ */
/*  Het blad uit het logo halen                                        */
/* ------------------------------------------------------------------ */

/**
 * Het logo bestaat uit twee groepen met dezelfde transform: de letters en het
 * blad. Alleen de bladgroep is te herkennen aan zijn vulkleur, en die is geen
 * toeval — lindegroen staat in de huisstijl omschreven als precies de kleur
 * van het blad in deze versie van het logo.
 */
const logo = await readFile(LOGO, 'utf8');

/* ------------------------------------------------------------------ */
/*  De gekleurde versie                                                */
/* ------------------------------------------------------------------ */

/**
 * De huisstijl leverde twee logo's: de witte versie als SVG, en de gekleurde
 * voor lichte vlakken alleen als PNG. Die tweede maken we hier zelf, door in
 * de vector de twee vullingen om te zetten — wit wordt dennengroen, lindegroen
 * wordt saliegroen. Precies wat er op hun PNG staat, maar dan als vector.
 *
 * Waarom niet gewoon die PNG gebruiken: dan staan er twee bestanden van
 * hetzelfde merk naast elkaar die alleen van vorm gelijk zijn zolang niemand
 * er iets aan doet. Nu is er één bron, en loopt de gekleurde versie per
 * definitie mee met de witte.
 */
const logoKleur = logo
  .replace(new RegExp(`fill="${WIT}"`, 'gi'), `fill="${DENNEN}"`)
  .replace(new RegExp(`fill="${LINDE}"`, 'gi'), `fill="${SALIE}"`);

if (logoKleur === logo) {
  throw new Error(
    `icons: niets omgekleurd in ${path.basename(LOGO)}. ` +
    'Staan de vullingen er nog als fill="#FFFFFF" en fill="#B1C2A2"?',
  );
}

await writeFile(
  path.join(IMG, 'logo-bloei-kleur.svg'),
  logoKleur.replace(
    '<title>',
    '<desc>Afgeleid van logo-bloei-wit.svg door scripts/icons.mjs — niet met de hand bewerken.</desc><title>',
  ),
  'utf8',
);
console.log('icons: logo-bloei-kleur.svg');

const groepen = logo.split('<g transform="translate(50 32)"');
const bladgroep = groepen.slice(1).find((g) => g.toUpperCase().includes(`FILL="${LINDE}"`));
if (!bladgroep) {
  throw new Error(
    `icons: geen bladgroep (fill="${LINDE}") in ${path.basename(LOGO)}. ` +
    'Is er een nieuw logo aangeleverd met andere kleuren erin?',
  );
}

/* Tot de volgende groep, of tot het eind. Het blad is de tweede van twee, dus
   in de praktijk het eind, maar niet aannemen dat dat zo blijft. */
const bladInhoud = bladgroep.split('<g transform="translate(50 32)"')[0];

/* De binnenste transform hoort erbij: de paden staan in het assenstelsel van
   potrace (honderdsten, y omgekeerd) en zonder die regel staat het blad
   duizenden eenheden buiten beeld. */
const binnen = bladInhoud.match(/<g[^>]*transform="translate\(0\.0+,343\.0+\)[^"]*"[^>]*>/);
if (!binnen) throw new Error('icons: de binnenste transform van de bladgroep is niet gevonden.');

const alle = bladInhoud.match(/<path\b[^>]*\/>/g);
if (!alle?.length) throw new Error('icons: geen paden in de bladgroep.');

/** Eén of meer paden op zichzelf, in het assenstelsel van het logo (680x410). */
const bladSvg = (paden, fill) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="680" height="410" viewBox="0 0 680 410">` +
  `<g transform="translate(50 32)" fill="${fill}">${binnen[0]}${paden.join('')}</g></g></svg>`;

/* ------------------------------------------------------------------ */
/*  Meten waar de vormen precies staan                                 */
/* ------------------------------------------------------------------ */

/**
 * Eén keer op hoge resolutie renderen en de doorzichtige randen eraf laten
 * halen. Wat sharp dan wegknipt is de echte begrenzing van de vorm, en de
 * offsets die het teruggeeft rekenen we terug naar de eenheden van het logo.
 */
const SCHAAL = 4;
const meet = async (paden) => {
  const {info} = await sharp(Buffer.from(bladSvg(paden, LINDE)), {density: 72 * SCHAAL})
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
 * De bladgroep bevat drie vormen: de twee blaadjes van de scheut die boven de
 * letters uitsteekt, en het losse blad dat dwars door de O van BLOEI valt.
 * Dat derde blad hoort bij de letters en niet bij de scheut — zet je ze samen
 * in een vierkant pictogram, dan zweeft er onder de scheut een vlek zonder
 * verband, en op 16 pixels is dat gewoon vuil.
 *
 * Welke dat is wordt gemeten en niet geteld: de twee blaadjes van de scheut
 * staan vlak bij elkaar in de steel, en het losse blad staat er ruim onder.
 * Clusteren op nabijheid en de grootste nemen geeft de scheut, ook als er ooit
 * een logo komt waarin de vormen in een andere volgorde staan of er eentje
 * bij komt.
 *
 * Gemeten in dit logo: de twee blaadjes van de scheut raken elkaar net niet
 * (3,5 eenheden ertussen, want hun rechthoeken lopen tot de steel en niet
 * eroverheen), en het losse blad ligt er 41 vandaan. De speling hieronder is
 * 2% van de breedte van het logo, dus ruwweg 14 — royaal boven de 3,5 en
 * ruim onder de 41.
 */
const SPELING = 680 * 0.02;
const vakken = await Promise.all(alle.map((p) => meet([p])));
const raakt = (a, b) =>
  a.x - SPELING < b.x + b.w && b.x - SPELING < a.x + a.w &&
  a.y - SPELING < b.y + b.h && b.y - SPELING < a.y + a.h;

/** Samenvoegen wat elkaar raakt, net zo lang tot er niets meer samen kan. */
const clusters = alle.map((p, i) => ({paden: [p], vakken: [vakken[i]]}));
for (let i = 0; i < clusters.length; i++) {
  for (let j = i + 1; j < clusters.length; j++) {
    if (clusters[i].vakken.some((a) => clusters[j].vakken.some((b) => raakt(a, b)))) {
      clusters[i].paden.push(...clusters[j].paden);
      clusters[i].vakken.push(...clusters[j].vakken);
      clusters.splice(j, 1);
      j = i; /* opnieuw langs de rest: dit cluster is net groter geworden */
    }
  }
}

const oppervlak = (c) => c.vakken.reduce((t, v) => t + v.w * v.h, 0);
const scheut = clusters.sort((a, b) => oppervlak(b) - oppervlak(a))[0];
const paden = scheut.paden;

console.log(
  `icons: ${alle.length} vormen in de bladgroep, ${clusters.length} los van elkaar; ` +
  `de scheut is er ${paden.length}`,
);

const vak = await meet(paden);

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

/** Het blad strak uitgesneden, op maat, eventueel op een vlak. */
const teken = (formaat, fill, achtergrond) => {
  /* Op 62% van het vlak, zodat er rondom lucht staat en het blad op een
     afgerond vierkant niet tegen de hoeken aanloopt. */
  const binnenmaat = achtergrond ? Math.round(formaat * 0.62) : formaat;
  const marge = (formaat - binnenmaat) / 2;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${formaat}" height="${formaat}" viewBox="0 0 ${formaat} ${formaat}">` +
    (achtergrond ? `<rect width="${formaat}" height="${formaat}" fill="${achtergrond}"/>` : '') +
    `<svg x="${marge}" y="${marge}" width="${binnenmaat}" height="${binnenmaat}" viewBox="${viewBox}">` +
    `<g transform="translate(50 32)" fill="${fill}">${binnen[0]}${paden.join('')}</g></g></svg></svg>`,
  );
};

/* ------------------------------------------------------------------ */
/*  Wegschrijven                                                       */
/* ------------------------------------------------------------------ */

await mkdir(IMG, {recursive: true});

/**
 * De favicon zelf. Op een vlak en niet vrijstaand: een browser zet het tabblad
 * in zijn eigen kleur, en lindegroen blad op een lichtgrijs tabblad is bijna
 * niets. Dennengroen eronder maakt er een teken van dat op elk tabblad staat.
 */
await writeFile(
  path.join(APP, 'public/favicon.svg'),
  '<!-- Het blad uit het logo, op dennengroen. Niet met de hand getekend maar\n' +
  '     uitgeknipt uit public/img/logo-bloei-wit.svg door scripts/icons.mjs;\n' +
  '     draai dat script opnieuw als het logo verandert. -->\n' +
  `${teken(100, LINDE, DENNEN).toString('utf8')}\n`,
  'utf8',
);
console.log('icons: favicon.svg');

const BESTANDEN = [
  ['apple-touch-icon.png', 180],
  ['icon-96.png', 96],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
];

for (const [naam, formaat] of BESTANDEN) {
  const uit = path.join(IMG, naam);
  await sharp(teken(formaat, LINDE, DENNEN), {density: 300}).png({compressionLevel: 9}).toFile(uit);
  console.log(`icons: ${naam} (${formaat}x${formaat})`);
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
  description: 'Bloemen, planten, tuin en wonen aan het Hogepad in Ouddorp.',
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
