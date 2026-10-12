/* Meet de privacyverklaring na in een echte browser.
 *
 *   node scripts/kijk-verklaring.mjs           tegen de gebouwde dist op localhost
 *   node scripts/kijk-verklaring.mjs --live    tegen marjon.jouwidealewebsite.nl
 *
 * Wat hier gemeten wordt is niet de opmaak maar de inhoud, want dit is een
 * juridisch document op haar naam. De belangrijkste controles zijn de
 * ontkenningen: geen Vecozo, geen Peilstations, geen nieuwsbrief, geen clean
 * desk policy, geen vijftien jaar. Dat zijn stuk voor stuk dingen uit het
 * NVM-model die Marjon met nee beantwoord heeft. Sluipt er ooit iets van terug
 * in, bijvoorbeeld doordat iemand het model er nog eens naast legt, dan valt
 * deze meting om.
 *
 * Draait op de Chromium van playwright, geleend uit ../../claudius/node_modules.
 */

import {pathToFileURL} from 'node:url';

const LIVE = process.argv.includes('--live');
const BASIS = LIVE ? 'https://marjon.jouwidealewebsite.nl' : 'http://localhost:4317';

const pw = await import(
  pathToFileURL('C:/Users/nieuw/dev/claudius/node_modules/playwright/index.js').href
);
const {chromium} = pw.default ?? pw;

/* Cloudflare plakt op elke site op deze zone zijn eigen bezoekersteller erbij.
   Die zit niet in onze code en is met curl niet te zien. De privacypagina
   noemt hem, dus hij is hier geen fout maar wel het enige wat naar buiten mag. */
const MAG_NAAR_BUITEN = ['static.cloudflareinsights.com'];

/* Woorden uit het NVM-model die zij met nee beantwoordde. Deze mogen nergens
   in de verklaring opduiken. 'factoringmaatschappij' staat er wel, maar alleen
   in de zin waarin zij zegt dat zij er niet mee werkt. */
const VERBODEN = ['vecozo', 'peilstations', 'clean desk', 'werkoverleg', '15 jaar', 'vijftien jaar'];

/* Marjon vroeg op 28 sep 2026 de hele site in u. Dat is niet iets van een pagina
   maar van elke pagina, dus het wordt hier gemeten in plaats van onthouden.
   Uitzondering: haar praktijknaam is "Bewust gezond in je mond" en die blijft
   zoals hij is; dezelfde naam staat gestapeld in het hart van de ikigai. Die
   halen we er dus eerst uit, en wat er dan nog aan je, jij, jou of jouw
   overblijft is een fout. */
const PAGINAS = [
  '/',
  '/privacy',
  '/privacyverklaring',
  '/aanpak/voeding',
  '/aanpak/ontspanning',
  '/aanpak/zingeving',
  '/aanpak/natuurlijke-remedies',
  '/aanpak/mondhygiene',
];

const MERKNAAM = /bewust\s*gezond\s*in\s*je\s*mond|gezond\s*in\s*je\s*mond/gi;
const JE_VORM = /\b(je|jij|jou|jouw|jezelf|jullie)\b/gi;

function jeVormen(tekst) {
  return [...tekst.replace(MERKNAAM, ' ').matchAll(JE_VORM)].map((m) => m[0]);
}

let n = 0;
let fout = 0;
const eis = (ok, wat) => {
  n++;
  if (!ok) {
    fout++;
    console.log('  FOUT: ' + wat);
  }
};

const browser = await chromium.launch();

for (const breedte of [1440, 390]) {
  const p = await browser.newPage({viewport: {width: breedte, height: 900}});
  const extern = [];
  p.on('request', (r) => {
    const host = new URL(r.url()).host;
    if (host !== new URL(BASIS).host && !MAG_NAAR_BUITEN.some((h) => host.includes(h))) extern.push(r.url());
  });

  for (const pad of PAGINAS) {
    const res = await p.goto(BASIS + pad, {waitUntil: 'networkidle'});
    eis(res.status() === 200, `${pad} geeft ${res.status()}`);
    const over = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    eis(over <= 0, `${pad} schuift ${over}px zijwaarts op ${breedte}`);
    const voet = await p.$$eval('footer a', (e) => e.map((x) => x.getAttribute('href')));
    eis(voet.includes('/privacyverklaring'), `voetlink naar de verklaring ontbreekt op ${pad}`);

    /* de aanspreekvorm, op wat je ziet en op wat Google leest */
    const zicht = await p.evaluate(() => document.body.innerText);
    const gevonden = jeVormen(zicht);
    eis(gevonden.length === 0, `${pad} spreekt met ${[...new Set(gevonden)].join(', ')} in plaats van u`);
    const meta = await p.evaluate(() =>
      [...document.querySelectorAll('meta[name=description], meta[property="og:description"], title')]
        .map((e) => e.content ?? e.textContent)
        .join(' | '),
    );
    eis(jeVormen(meta).length === 0, `${pad}: je-vorm in de titel of de omschrijving: ${meta}`);
  }

  await p.goto(BASIS + '/privacyverklaring', {waitUntil: 'networkidle'});
  eis(/Privacyverklaring/.test(await p.title()), 'titel klopt niet: ' + (await p.title()));
  const can = await p.$eval('link[rel=canonical]', (e) => e.href);
  eis(can.endsWith('/privacyverklaring'), 'canonical: ' + can);

  /* De twee documenten moeten er niet alleen als knop staan maar ook echt zijn.
     Een downloadknop die 404 geeft is erger dan geen downloadknop. */
  for (const eind of [
    'privacyverklaring-bewust-gezond-in-je-mond.pdf',
    'intakeformulier-vinkjes-bewust-gezond-in-je-mond.pdf',
  ]) {
    const href = await p.$eval(`a[href$="${eind}"]`, (e) => e.getAttribute('href')).catch(() => null);
    eis(Boolean(href), 'downloadknop ontbreekt voor ' + eind);
    if (href) {
      const r = await p.request.get(BASIS + href);
      const groot = (await r.body()).length;
      eis(r.status() === 200 && groot > 100_000, `${eind}: status ${r.status()}, ${groot} bytes`);
    }
  }

  const koppen = await p.$$eval('article h2', (e) => e.map((x) => x.textContent.trim()));
  eis(koppen.filter((k) => /^\d\./.test(k)).length === 7, 'aantal hoofdstukken: ' + koppen.length);

  const tekst = await p.$eval('article', (e) => e.innerText.toLowerCase());
  for (const woord of VERBODEN) eis(!tekst.includes(woord), `staat er wel in maar hoort er niet in: ${woord}`);
  eis(tekst.includes('twintig jaar'), 'de bewaartermijn van twintig jaar ontbreekt');
  eis(tekst.includes('37154226'), 'het KvK-nummer ontbreekt');
  eis(tekst.includes('tandarts'), 'de alinea over de tandarts ontbreekt');
  /* Zij huurt bij Mondzorg Schagen. Dat moet er staan EN er moet bij staan dat
     die praktijk niet bij het dossier kan. Alleen het adres noemen leest voor
     een patient als een gedeelde praktijk, en dan klopt de belangrijkste zin
     van deze verklaring niet meer. */
  eis(tekst.includes('mondzorg schagen'), 'de behandellocatie ontbreekt');
  eis(tekst.includes('huur'), 'dat zij de ruimte huurt ontbreekt');
  eis(
    /(kan|kunnen)[a-z ]{0,12}niet bij (uw dossier|hun dossiers)/.test(tekst) &&
      /mondzorg schagen kan daar niet bij/.test(tekst),
    'nergens staat dat Mondzorg Schagen niet bij het dossier kan',
  );
  eis(tekst.includes('whatsapp'), 'de alinea over WhatsApp ontbreekt');
  /* drie vinkjes, niet twee: het derde is van haar en niet van het model */
  eis((tekst.match(/ik geef toestemming|ik heb de privacyverklaring/g) || []).length === 3, 'niet drie vinkjes');

  eis(extern.length === 0, 'verzoek naar buiten: ' + extern.join(', '));
  await p.close();
}

await browser.close();
console.log(`\n${n} controles, ${fout} fout${LIVE ? ' (op het live adres)' : ''}`);
process.exit(fout ? 1 : 0);
