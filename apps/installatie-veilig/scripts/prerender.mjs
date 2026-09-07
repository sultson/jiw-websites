/**
 * Bakt de pagina als kant-en-klare HTML.
 *
 * Zonder deze stap staat er in dist/index.html alleen `<div id="root"></div>`
 * met een script eronder. Een browser vult dat in, maar een crawler die geen
 * JavaScript uitvoert leest een lege pagina, en dat geldt net zo goed voor de
 * taalmodellen die tegenwoordig een deel van de vragen over een bedrijf
 * beantwoorden. Na deze stap staat de hele pagina in de HTML zelf; React neemt
 * hem in de browser alleen nog over (zie src/main.tsx).
 *
 * De koppen (title, description, canonical, og:, schema.org) staan al in
 * index.html en worden hier niet aangeraakt.
 *
 *   node scripts/prerender.mjs
 */
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(APP, 'dist');
const BESTAND = path.join(DIST, 'index.html');

const {render} = await import(path.join(APP, 'dist-ssr/entry-server.js'));

const LEEG = '<div id="root"></div>';

const sjabloon = readFileSync(BESTAND, 'utf8');
/* Letterlijk zoeken, dus als een plugin die div ooit anders opschrijft valt de
   build om in plaats van stilletjes een lege pagina op te leveren. */
if (!sjabloon.includes(LEEG)) {
  throw new Error(`prerender: dist/index.html bevat geen ${LEEG}`);
}

const html = sjabloon.replace(LEEG, `<div id="root">${render()}</div>`);
writeFileSync(BESTAND, html);

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
  `prerender: dist/index.html gebakken (${(html.length / 1024).toFixed(0)} kB), ` +
    `${beelden.size} beeldverwijzingen gecontroleerd.`,
);
