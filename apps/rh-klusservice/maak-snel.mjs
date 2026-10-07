/* Zet elke <img> in dist om naar een <picture> met AVIF en WebP erin, en schrijft
   het preload-blok in de <head>. Draait als laatste over alle twaalf pagina's,
   dus ook over de vier die de generatoren schrijven.

   Twee dingen die dit oplost, beide uit de meting van Alfred (07-10-2026):

   1. "Improve image delivery" — de browser koos uit een jpg en niets anders, en
      kreeg altijd het volle formaat. Nu staat er per foto een reeks breedtes in
      twee moderne formaten, met de jpg als terugval in de <img>.

   2. "Network dependency tree: maximum critical path latency 180 ms" — de drie
      lettertypen zaten achter stijl.css. De browser zag ze pas nadat de CSS
      binnen was en ontleed, dus het wachten stapelde. Met een preload in de head
      lopen ze naast de CSS.

   IN PLAATS VAN: de pagina's bewerken en dat zo laten. Dit script is idempotent:
   het pelt eerst elke <picture data-pic> en elk <!--snel-->-blok weer weg en bouwt
   daarna opnieuw. dist/index.html en dist/projecten/index.html zijn handwerk en
   blijven dat — je bewerkt de <img> binnenin, de build maakt er weer een picture van.

   De <picture> staat op display:contents (zie stijl.css). Zonder dat zou het
   element zelf het rasteritem worden en zakt de foto los van de hoogte van zijn
   vak: het mozaiek bij "Bekijk ons werk" en de galerij op projecten vallen dan uit
   elkaar. Let op: display:contents verbergt het element voor de opmaak, niet voor
   de selectors — een regel als `.inzicht__beeld img:first-child` moet dus wel
   meeveranderen, en dat is in stijl.css gedaan. */

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const hier = dirname(fileURLToPath(import.meta.url));
const DIST = join(hier, 'dist');

const manifest = JSON.parse(readFileSync(join(hier, 'plaatjes.json'), 'utf8'));

/* ---------- hoe breed staat een foto werkelijk in beeld ----------
   `sizes` moet kloppen met de opmaak, anders kiest de browser ernaast. Deze
   waarden komen uit de rasters in stijl.css: inhoud is maximaal 1180 breed met
   24px rand, dus 1132 om te verdelen. Aan de ruime kant gerekend — te krap
   opgeven geeft een vage foto, te ruim kost alleen een paar kilobyte. */
const MATEN = [
  ['dia', '(min-width:1180px) 510px, (min-width:861px) 44vw, 100vw'],
  ['lok__beeld', '(min-width:1180px) 520px, (min-width:981px) 45vw, 100vw'],
  ['over__beeld', '(min-width:1180px) 500px, (min-width:861px) 43vw, 100vw'],
  ['inzicht__beeld', '(min-width:861px) 280px, 46vw'],
  ['galerij', '(min-width:1180px) 370px, (min-width:861px) 32vw, calc(100vw - 48px)'],
];
const MAAT_LOGO = '110px';
const MAAT_REST = '(min-width:861px) 370px, 100vw';

/* Welk vak de foto in staat, bepaald uit de tekst ervoor: het laatste vak dat
   geopend is, is het vak waar deze foto in zit. Dat kan omdat deze vijf namen
   nergens anders op de pagina voorkomen. */
function maat(html, offset, src) {
  if (src.startsWith('/logo/')) return MAAT_LOGO;
  let beste = MAAT_REST;
  let laatste = -1;
  const voor = html.slice(0, offset);
  for (const [naam, sizes] of MATEN) {
    const i = voor.lastIndexOf(`class="${naam}`);
    const j = voor.lastIndexOf(`${naam}"`);
    const k = Math.max(i, j);
    if (k > laatste) { laatste = k; beste = sizes; }
  }
  return beste;
}

/* ---------- een <img> naar een <picture> ---------- */

function attribuut(tag, naam) {
  const m = tag.match(new RegExp(`\\s${naam}="([^"]*)"`));
  return m ? m[1] : null;
}

function zetAttribuut(tag, naam, waarde) {
  const schoon = tag.replace(new RegExp(`\\s${naam}="[^"]*"`), '');
  return schoon.replace(/\s*\/?>$/, ` ${naam}="${waarde}">`);
}

function srcset(varianten, ext) {
  const lijst = varianten.filter((v) => v.ext === ext);
  return lijst.map((v) => `${v.pad} ${v.breed}w`).join(', ');
}

/* De telefoonsnede van de herofoto. Die staat vóór de gewone regels in de
   <picture>, want de browser pakt de eerste die past. Zie maak-plaatjes.mjs voor
   waarom die snede er is: de bron is staand, het vak op een telefoon is liggend. */
const MAAT_MOB = '100vw';

function mobielTot(info) {
  return info.mobiel && info.mobiel.length && info.mobielTot
    ? `(max-width:${info.mobielTot}px)`
    : null;
}

function mobielBronnen(info) {
  const grens = mobielTot(info);
  if (!grens) return '';
  return ['avif', 'webp']
    .map((ext) => `<source media="${grens}" type="image/${ext}"`
      + ` srcset="${srcset(info.mobiel, ext)}" sizes="${MAAT_MOB}">`)
    .join('');
}

function bouwPicture(tag, html, offset) {
  const src = attribuut(tag, 'src');
  const info = src && manifest[src];
  if (!info) return null;

  const sizes = maat(html, offset, src);

  let img = tag;
  // Schermvullend hoort de grote versie te openen. Zonder dit leest site.js
  // currentSrc, en dat is sinds de srcset een variant als -klein-314.avif; daar
  // valt geen groot bestand meer uit te rekenen.
  if (info.groot && attribuut(tag, 'data-groot') === null && !src.startsWith('/logo/')) {
    img = zetAttribuut(img, 'data-groot', info.groot);
  }
  // De foto die als eerste in beeld staat moet synchroon getekend worden; de rest
  // mag de hoofdlijn niet ophouden.
  if (attribuut(tag, 'fetchpriority') !== 'high' && attribuut(tag, 'decoding') === null) {
    img = zetAttribuut(img, 'decoding', 'async');
  }

  return '<picture data-pic>'
    + mobielBronnen(info)
    + `<source type="image/avif" srcset="${srcset(info.varianten, 'avif')}" sizes="${sizes}">`
    + `<source type="image/webp" srcset="${srcset(info.varianten, 'webp')}" sizes="${sizes}">`
    + img
    + '</picture>';
}

/* ---------- het preload-blok ---------- */

if (!existsSync(join(DIST, 'lettertype'))) throw new Error('dist/lettertype ontbreekt — draai maak-lettertypen.mjs eerst');
const LETTERTYPEN = readdirSync(join(DIST, 'lettertype')).filter((f) => f.endsWith('.woff2')).sort();

function preloadBlok(html) {
  const regels = LETTERTYPEN.map(
    (f) => `<link rel="preload" href="/lettertype/${f}" as="font" type="font/woff2" crossorigin>`,
  );

  /* De foto die de pagina's laadtijd bepaalt (de LCP) staat met fetchpriority=high
     in het HTML. Die mag de browser al ophalen voordat hij bij de <picture>
     aankomt. type=image/avif erbij, anders haalt een browser zonder AVIF een
     bestand binnen dat hij niet kan tekenen. */
  const m = html.match(/<img[^>]*fetchpriority="high"[^>]*>/);
  if (m) {
    const src = attribuut(m[0], 'src');
    const info = src && manifest[src];
    if (info) {
      const sizes = maat(html, html.indexOf(m[0]), src);
      const grens = mobielTot(info);
      const preload = (srcs, maten, media) =>
        '<link rel="preload" as="image" type="image/avif"'
        + ` imagesrcset="${srcs}" imagesizes="${maten}"`
        + (media ? ` media="${media}"` : '')
        + ' fetchpriority="high">';

      /* Heeft deze foto een telefoonsnede, dan moet het preload mee met die
         grens. Zonder media-regel haalt een telefoon eerst de staande versie
         binnen omdat die in het preload staat, en daarna de gesneden omdat die
         in de <picture> staat: twee keer de LCP ophalen en de tweede keer telt. */
      if (grens) {
        regels.push(preload(srcset(info.mobiel, 'avif'), MAAT_MOB, grens));
        regels.push(preload(srcset(info.varianten, 'avif'), sizes, `(min-width:${info.mobielTot + 1}px)`));
      } else {
        regels.push(preload(srcset(info.varianten, 'avif'), sizes, null));
      }
    }
  }

  return `<!--snel-->\n${regels.join('\n')}\n<!--/snel-->\n`;
}

/* ---------- over alle pagina's ---------- */

function paginas(map = DIST) {
  const uit = [];
  for (const naam of readdirSync(map, { withFileTypes: true })) {
    const pad = join(map, naam.name);
    if (naam.isDirectory()) uit.push(...paginas(pad));
    else if (naam.name.endsWith('.html')) uit.push(pad);
  }
  return uit;
}

let gedaan = 0;
let plaatjes = 0;

for (const pad of paginas()) {
  let html = readFileSync(pad, 'utf8');

  // eerst terug naar kale <img>'s en een head zonder ons blok
  html = html.replace(/<picture data-pic>.*?(<img[^>]*>).*?<\/picture>/gs, '$1');
  html = html.replace(/<!--snel-->.*?<!--\/snel-->\n?/gs, '');

  // De eerste drie foto's in de galerij staan bij het openen van projecten al in
  // beeld (columns:3, en erboven staat alleen een kop met de filters). Die mogen
  // niet lazy zijn: een LCP die pas na het scrollen begint te laden kost de pagina
  // punten en de bezoeker een leeg vak. De rest wel.
  if (html.includes('class="galerij"')) {
    let n = 0;
    html = html.replace(/<img[^>]*\/foto\/[^>]*>/g, (tag) => {
      n++;
      let uit = tag.replace(/\s(?:loading|fetchpriority)="[^"]*"/g, '');
      if (n > 3) return zetAttribuut(uit, 'loading', 'lazy');
      if (n === 1) uit = zetAttribuut(uit, 'fetchpriority', 'high');
      return uit;
    });
  }

  html = html.replace(/<img[^>]*>/g, (tag, offset) => {
    const uit = bouwPicture(tag, html, offset);
    if (uit) plaatjes++;
    return uit || tag;
  });

  html = html.replace(/<link rel="stylesheet"/, preloadBlok(html) + '<link rel="stylesheet"');

  writeFileSync(pad, html, 'utf8');
  gedaan++;
}

console.log(`snel: ${gedaan} pagina's, ${plaatjes} foto's in een picture, ${LETTERTYPEN.length} lettertypen voorgeladen`);
