/**
 * Bakt elke pagina als kant-en-klare HTML.
 *
 * Zonder deze stap staat er in dist/ zeven keer `<div id="root"></div>` met een
 * script eronder. Een browser vult dat in, maar een crawler die geen JavaScript
 * uitvoert leest een lege pagina, en dat geldt net zo goed voor de taalmodellen
 * die tegenwoordig de helft van de vragen over een winkel beantwoorden. Na deze
 * stap staat de hele pagina in de HTML zelf; React neemt hem in de browser
 * alleen nog over (zie src/mount.tsx).
 *
 * De koppen (title, description, canonical, og:, schema.org) staan al in de
 * bronbestanden per pagina en worden hier dus niet aangeraakt. Dat is het
 * voordeel van echte losse pagina's boven één shell met een router: er valt
 * niets te herschrijven.
 *
 *   node scripts/prerender.mjs
 */
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {PAGINAS} from '../site.config.mjs';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(APP, 'dist');

const {render} = await import(path.join(APP, 'dist-ssr/entry-server.js'));

const LEEG = '<div id="root"></div>';

/* Elke /img/... waar de gebakken pagina's naar wijzen. Een hernoemde of
   opnieuw gecomprimeerde foto laat de build zo struikelen in plaats van als
   kapot plaatje de deur uit te gaan. */
const gebruikteBeelden = new Set();

function verzamelBeelden(html) {
  for (const [, url] of html.matchAll(/(?:src|srcset|href)="([^"]+)"/g)) {
    for (const kandidaat of url.split(',')) {
      const bestand = kandidaat.trim().split(' ')[0];
      if (bestand.startsWith('/img/')) gebruikteBeelden.add(bestand);
    }
  }
}

for (const pagina of PAGINAS) {
  const bestand = path.join(DIST, pagina.bestand);
  if (!existsSync(bestand)) {
    throw new Error(`prerender: ${pagina.bestand} staat niet in dist. Staat hij in de input van vite.config.ts?`);
  }

  const sjabloon = readFileSync(bestand, 'utf8');
  /* Letterlijk zoeken, dus als een plugin die div ooit anders opschrijft valt
     de build om in plaats van stilletjes zeven lege pagina's op te leveren. */
  if (!sjabloon.includes(LEEG)) {
    throw new Error(`prerender: ${pagina.bestand} bevat geen ${LEEG}`);
  }

  const html = sjabloon.replace(LEEG, `<div id="root">${render(pagina.pad)}</div>`);
  verzamelBeelden(html);

  mkdirSync(path.dirname(bestand), {recursive: true});
  writeFileSync(bestand, html);

  const kb = (html.length / 1024).toFixed(0);
  console.log(`prerender: ${pagina.pad.padEnd(16)} -> dist/${pagina.bestand} (${kb} kB)`);
}

/* ------------------------------------------------------------------ */
/*  Staan alle beelden er ook echt?                                    */
/* ------------------------------------------------------------------ */

const ontbreekt = [...gebruikteBeelden].filter((f) => !existsSync(path.join(DIST, f)));
if (ontbreekt.length) {
  throw new Error(`prerender: ${ontbreekt.length} beeld(en) ontbreken in dist:\n  ${ontbreekt.join('\n  ')}`);
}

console.log(`\nprerender: ${PAGINAS.length} pagina's gebakken, ${gebruikteBeelden.size} beeldverwijzingen gecontroleerd.`);
