/**
 * Bakt elke pagina als kant-en-klare HTML.
 *
 * Zonder deze stap staat er in dist/index.html alleen `<div id="root"></div>`
 * met een script eronder. Een browser vult dat in, maar een crawler die geen
 * JavaScript uitvoert leest een lege pagina, en dat geldt net zo goed voor de
 * taalmodellen die tegenwoordig een deel van de vragen over een bedrijf
 * beantwoorden. Na deze stap staat de hele pagina in de HTML zelf; React neemt
 * hem in de browser alleen nog over (zie src/main.tsx).
 *
 * index.html is het sjabloon. De homepage gaat terug naar dist/index.html, elke
 * andere pagina uit src/paginas.ts naar dist/<pad>.html; Cloudflare serveert
 * die op `/<pad>` (html_handling: drop-trailing-slash). Per pagina worden
 * title, description, canonical en og: vervangen, en krijgt hij een
 * kruimelpad (en bij een dienst een Service) in schema.org erbij.
 *
 *   node scripts/prerender.mjs
 */
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(APP, 'dist');
const BESTAND = path.join(DIST, 'index.html');

const {render, PAGINAS} = await import(pathToFileURL(path.join(APP, 'dist-ssr/entry-server.js')).href);

const SITE = 'https://installatieveilig.nl';
const LEEG = '<div id="root"></div>';

const sjabloon = readFileSync(BESTAND, 'utf8');
/* Letterlijk zoeken, dus als een plugin die div ooit anders opschrijft valt de
   build om in plaats van stilletjes een lege pagina op te leveren. */
if (!sjabloon.includes(LEEG)) {
  throw new Error(`prerender: dist/index.html bevat geen ${LEEG}`);
}

const attr = (t) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Vervangt precies één treffer, of valt om. */
function vervang(html, patroon, nieuw, pad) {
  const treffers = html.match(new RegExp(patroon.source, 'g')) ?? [];
  if (treffers.length !== 1) {
    throw new Error(`prerender ${pad}: ${patroon} trof ${treffers.length} keer in plaats van één keer`);
  }
  return html.replace(patroon, nieuw);
}

function schema(pagina) {
  const url = SITE + pagina.pad;
  const kruimels = [{naam: 'Home', url: `${SITE}/`}];
  if (pagina.soort === 'dienst') kruimels.push({naam: pagina.kop, url});
  if (pagina.soort === 'plaats') kruimels.push({naam: `Elektricien in ${pagina.plaats.naam}`, url});
  const blokken = [{
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: kruimels.map((k, i) => ({'@type': 'ListItem', position: i + 1, name: k.naam, item: k.url})),
  }];
  if (pagina.soort === 'dienst') {
    blokken.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: pagina.kop,
      serviceType: pagina.dienst === 'groepenkast' ? 'Groepenkast vervangen' : 'Laadpaal installeren',
      url,
      provider: {'@id': `${SITE}/#bedrijf`},
      areaServed: {'@type': 'City', name: 'Breda'},
    });
  }
  return blokken
    .map((b) => `<script type="application/ld+json">${JSON.stringify(b).replace(/</g, '\\u003c')}</script>`)
    .join('\n    ');
}

let html = '';
const gebakken = [];
for (const pagina of PAGINAS) {
  const {pad} = pagina;
  const url = SITE + pad;
  let doc = sjabloon.replace(LEEG, `<div id="root">${render(pad)}</div>`);
  doc = vervang(doc, /<title>[^<]*<\/title>/, `<title>${attr(pagina.title)}</title>`, pad);
  doc = vervang(doc, /<meta name="description" content="[^"]*"/, `<meta name="description" content="${attr(pagina.description)}"`, pad);
  doc = vervang(doc, /<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`, pad);
  doc = vervang(doc, /<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`, pad);
  doc = vervang(doc, /<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${attr(pagina.title)}"`, pad);
  doc = vervang(doc, /<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${attr(pagina.description)}"`, pad);
  if (pagina.soort !== 'home') {
    doc = vervang(doc, /\s*<meta name="keywords" content="[^"]*" \/>/, '', pad);
    doc = vervang(doc, /<\/head>/, `  ${schema(pagina)}\n  </head>`, pad);
  }
  const bestand = pad === '/' ? BESTAND : path.join(DIST, `${pad.slice(1)}.html`);
  writeFileSync(bestand, doc);
  gebakken.push(pad);
  html += doc;
}

/* De sitemap is met de hand bijgehouden (zie de opmerking erin over lastmod),
   maar moet precies deze pagina's noemen: niet meer, niet minder. */
const sitemap = readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
const inSitemap = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc.replace(SITE, '').replace(/^$/, '/'));
const verwacht = PAGINAS.map((p) => p.pad);
const mist = verwacht.filter((p) => !inSitemap.includes(p));
const teveel = inSitemap.filter((p) => !verwacht.includes(p));
if (mist.length || teveel.length) {
  throw new Error(`prerender: public/sitemap.xml loopt uit de pas. Mist: ${mist.join(', ') || '-'}. Te veel: ${teveel.join(', ') || '-'}`);
}

/* Elke /img/... waar de gebakken pagina naar wijst. Een hernoemde of opnieuw
   gecomprimeerde foto laat de build zo struikelen in plaats van als kapot
   plaatje de deur uit te gaan. */
const beelden = new Set();
for (const [, url] of html.matchAll(/(?:src|srcset|href|content)="([^"]+)"/g)) {
  for (const kandidaat of url.split(',')) {
    const bestand = kandidaat.trim().split(' ')[0];
    if (bestand.startsWith('/img/')) beelden.add(bestand);
  }
}

const ontbreekt = [...beelden].filter((f) => !existsSync(path.join(DIST, f)));
if (ontbreekt.length) {
  throw new Error(`prerender: ${ontbreekt.length} beeld(en) ontbreken in dist:\n  ${ontbreekt.join('\n  ')}`);
}

console.log(
  `prerender: ${gebakken.length} pagina's gebakken (${gebakken.join(', ')}), ` +
    `${beelden.size} beeldverwijzingen gecontroleerd.`,
);
