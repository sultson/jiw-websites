/**
 * Bakt elke pagina als kant-en-klare HTML.
 *
 * Zonder deze stap staat er in dist/ precies één bestand met daarin
 * `<div id="root"></div>` en een script eronder. Een browser vult dat in, maar
 * een crawler die geen JavaScript uitvoert leest een lege pagina, en dat geldt
 * net zo goed voor de taalmodellen die tegenwoordig de helft van de vragen over
 * iemand beantwoorden. Dat was op het conceptadres de situatie: de hele site
 * bestond voor een bot uit nul woorden.
 *
 * Na deze stap staat elk adres als eigen bestand in dist/, met de hele pagina
 * als HTML erin en met zijn eigen title, description, canonical en
 * schema.org-blok (scripts/kop.mjs). React neemt hem in de browser alleen nog
 * over (src/mount.tsx).
 *
 *   node scripts/prerender.mjs
 */
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {PAGINAS} from '../site.config.mjs';
import {zetKop} from './kop.mjs';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(APP, 'dist');

/* pathToFileURL en niet het pad zelf: op Windows leest node een absoluut pad
   als "C:" gevolgd door een pad, en dan is C: een onbekend protocol. */
const {render, SPEC_META, ALIAS_PADEN} = await import(
  pathToFileURL(path.join(APP, 'dist-ssr/entry-server.js')).href
);

const LEEG = '<div id="root"></div>';

/** De lijst pagina's, aangevuld met de titels die uit de pijlers komen. */
const TE_BAKKEN = [
  ...PAGINAS.map((pagina) => {
    if (!pagina.spec) return pagina;
    const meta = SPEC_META[pagina.pad];
    if (!meta) {
      throw new Error(
        `prerender: ${pagina.pad} verwijst naar pijler "${pagina.spec}", maar die staat niet in src/specialisaties.tsx`,
      );
    }
    return {...pagina, ...meta, kruimel: meta.titel.split(' | ')[0]};
  }),
  /* De eerdere adressen van de pijlers. Die komen uit de lijst zelf en niet uit
     site.config.mjs, want ze staan in src/specialisaties.tsx naast de pijler
     waar ze bij horen. */
  ...ALIAS_PADEN,
];

/* Elke /img/... en /fonts/... waar de gebakken pagina's naar wijzen. Een
   hernoemd of opnieuw gecomprimeerd bestand laat de build zo struikelen in
   plaats van als kapot plaatje de deur uit te gaan. */
const gebruikt = new Set();

function verzamel(html) {
  for (const [, url] of html.matchAll(/(?:src|srcset|href)="([^"]+)"/g)) {
    for (const kandidaat of url.split(',')) {
      const bestand = kandidaat.trim().split(' ')[0];
      if (bestand.startsWith('/img/') || bestand.startsWith('/fonts/')) gebruikt.add(bestand);
    }
  }
}

/* ------------------------------------------------------------------ */

const sjabloon = readFileSync(path.join(DIST, 'index.html'), 'utf8');

/* Letterlijk zoeken, dus als een plugin die div ooit anders opschrijft valt de
   build om in plaats van stilletjes een stapel lege pagina's op te leveren. */
if (!sjabloon.includes(LEEG)) {
  throw new Error(`prerender: dist/index.html bevat geen ${LEEG}`);
}

for (const pagina of TE_BAKKEN) {
  const body = render(pagina.pad);
  /* Een pagina die niets opleverde is kapot, ook al ziet het bestand er in dist
     net zo uit als een goede. */
  if (body.length < 500) {
    throw new Error(`prerender: ${pagina.pad} leverde maar ${body.length} tekens HTML op`);
  }

  const html = zetKop(sjabloon, pagina).replace(LEEG, `<div id="root">${body}</div>`);
  verzamel(html);

  const bestand = path.join(DIST, pagina.bestand);
  mkdirSync(path.dirname(bestand), {recursive: true});
  writeFileSync(bestand, html);

  const kb = (html.length / 1024).toFixed(0);
  console.log(`prerender: ${pagina.pad.padEnd(34)} -> dist/${pagina.bestand} (${kb} kB)`);
}

/* ------------------------------------------------------------------ */
/*  Staat alles er ook echt?                                           */
/* ------------------------------------------------------------------ */

/* De ?v=... eraf voor het zoeken. Dat achtervoegsel is de cache-breker uit de
   huisafspraak (zie CLAUDE.md): hetzelfde bestand, een nieuw adres, zodat de
   browser en de rand van Cloudflare een vervangen plaatje meteen opnieuw halen.
   Op schijf heet het bestand nog gewoon hero-glimlach.webp. */
const ontbreekt = [...gebruikt].filter((f) => !existsSync(path.join(DIST, f.split('?')[0])));
if (ontbreekt.length) {
  throw new Error(`prerender: ${ontbreekt.length} bestand(en) ontbreken in dist:\n  ${ontbreekt.join('\n  ')}`);
}

/* Het logo voor de bevestigingsmail. Dat staat buiten public/img, want een
   mailclient als Outlook op Windows toont geen WebP en public/img is de map
   die scripts/webp.mjs langsloopt. Ontbreekt het, dan staat er in de mail aan
   de bezoeker een leeg vak waar haar naam hoort. */
if (!existsSync(path.join(DIST, 'logo-email.png'))) {
  throw new Error(
    'prerender: dist/logo-email.png ontbreekt. Draai `pnpm mail-logo` (scripts/mail-logo.mjs).',
  );
}

console.log(
  `\nprerender: ${TE_BAKKEN.length} pagina's gebakken, ${gebruikt.size} verwijzingen naar beeld en lettertype gecontroleerd.`,
);
