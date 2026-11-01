/**
 * Bakt elke pagina als kant-en-klare HTML.
 *
 * Zonder deze stap staat er in dist/ een lege `<div id="root"></div>` met een script
 * eronder. Een browser vult dat in, maar een crawler die geen JavaScript uitvoert leest
 * een lege pagina, en dat geldt net zo goed voor de taalmodellen die tegenwoordig een
 * deel van de vragen over een behandeling beantwoorden. Op een site die gevonden moet
 * worden op "voetreflexologie neuropathie" is dat precies het punt van de hele site.
 *
 *   node scripts/prerender.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PAGINAS } from '../site.config.mjs';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(APP, 'dist');

/* pathToFileURL en niet het kale pad: op Windows begint een absoluut pad met een
   stationsletter, en `import('C:\...')` leest die dubbele punt als een protocol. */
const { render } = await import(pathToFileURL(path.join(APP, 'dist-ssr/entry-server.js')).href);

const LEEG = '<div id="root"></div>';

/* Elke /img/... waar de gebakken pagina's naar wijzen. Een hernoemd bestand laat de
   build zo struikelen in plaats van als kapot plaatje de deur uit te gaan. */
const gebruikteBestanden = new Set();

function verzamel(html) {
  for (const [, url] of html.matchAll(/(?:src|srcset|href)="([^"]+)"/g)) {
    for (const kandidaat of url.split(',')) {
      const bestand = kandidaat.trim().split(' ')[0];
      if (bestand.startsWith('/img/') || bestand.endsWith('.png')) gebruikteBestanden.add(bestand);
    }
  }
}

for (const pagina of PAGINAS) {
  const bestand = path.join(DIST, pagina.bestand);
  if (!existsSync(bestand)) {
    throw new Error(`prerender: ${pagina.bestand} staat niet in dist. Staat hij in PAGINAS?`);
  }

  const sjabloon = readFileSync(bestand, 'utf8');
  /* Letterlijk zoeken, dus als een plugin die div ooit anders opschrijft valt de build
     om in plaats van stilletjes lege pagina's op te leveren. */
  if (!sjabloon.includes(LEEG)) {
    throw new Error(`prerender: ${pagina.bestand} bevat geen ${LEEG}`);
  }

  const html = sjabloon.replace(LEEG, `<div id="root">${render(pagina.pad)}</div>`);
  verzamel(html);
  writeFileSync(bestand, html);

  console.log(`prerender: ${pagina.pad.padEnd(12)} -> dist/${pagina.bestand} (${(html.length / 1024).toFixed(0)} kB)`);
}

// Een `?v=...` erachter is cache-busting en hoort niet bij de bestandsnaam.
const ontbreekt = [...gebruikteBestanden].filter((f) => !existsSync(path.join(DIST, f.split('?')[0])));
if (ontbreekt.length) {
  throw new Error(`prerender: ${ontbreekt.length} bestand(en) ontbreken in dist:\n  ${ontbreekt.join('\n  ')}`);
}

console.log(
  `\nprerender: ${PAGINAS.length} pagina's gebakken, ${gebruikteBestanden.size} verwijzingen gecontroleerd.`,
);
