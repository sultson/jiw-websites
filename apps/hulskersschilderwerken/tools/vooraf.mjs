// De poort op de bouw: staat elke pagina echt helemaal in de html, en klopt alles wat
// een zoekmachine en een bezoeker als eerste tegenkomen?
//
// Deze site is statische html uit build.mjs, dus "voorgerenderd" is hier geen stap maar
// een eigenschap. Precies daarom hoort er een poort op: een eigenschap waar niemand op
// toetst, is een eigenschap tot de eerste keer dat iemand er een <script> in hangt. En
// de vorige keer dat deze site verhuisde (van jouwconcept.app hierheen) was het de
// bedoeling dat hij meteen goed geindexeerd werd - dat is het moment waarop een
// ontbrekende canonical of een sitemap die naar een omleiding wijst het meeste kost.
//
//   node tools/vooraf.mjs         na de productiebouw (`pnpm build`)
//   node tools/vooraf.mjs --dev   na een dichte bouw (`pnpm build:dev`)
//
// Wat er gecontroleerd wordt:
//
//    1. per pagina een <title> en een meta description, en ze zijn niet leeg
//    2. precies een <h1>, met tekst erin
//    3. de canonical van een indexeerbare pagina wijst naar die pagina zelf; de 404
//       heeft er geen (een foutpagina die naar zichzelf wijst vraagt om opname)
//    4. een woordvloer: de tekst staat in de html en niet in een script
//    5. noindex staat op de 404 en, in een dichte bouw, op alles
//    6. lang="nl" op <html>
//    7. elk <form> heeft een action, en die action bestaat echt in worker/index.ts
//    8. geen interne link naar een adres dat niet bestaat
//    9. geen .html in een interne link (dat is een 301 per klik)
//   10. elke <img src> en <link href> ligt ook echt in dist/
//   11. de sitemap dekt precies de indexeerbare pagina's, en niets anders
//   12. robots.txt past bij de bouw (open met sitemap, of dicht)
//   13. de JSON-LD parseert
//   14. geen html-commentaar in de pagina (bouwnotities, zie 25-10-2026)
//   15. het oude conceptadres staat nergens meer in de html
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { BEDRIJF, FORM_PAD, INDEXEERBAAR_PADEN } from '../inhoud.mjs';

const DEV = process.argv.includes('--dev');
const ADRES = `https://${BEDRIJF.domein}`;
const OUD_CONCEPT = 'hulskers-renovlies-concept.jouwconcept.app';

// De tekstvloer per pagina. Lager dan dit en er staat iets niet in de html. De 404 is
// bewust kort en heeft zijn eigen, veel lagere vloer.
const WOORDVLOER = 400;
const WOORDVLOER_404 = 15;

const fouten = [];
const zak = (m) => fouten.push(m);

// --------------------------------------------------------------- de pagina's inlezen
const bestanden = [];
(function loop(map) {
  for (const i of readdirSync(map, { withFileTypes: true })) {
    const pad = `${map}/${i.name}`;
    if (i.isDirectory()) loop(pad);
    else if (i.name.endsWith('.html')) bestanden.push(pad);
  }
})('dist');
bestanden.sort();

/*
 * Van bestandspad naar het adres waarop het wordt uitgeleverd, volgens
 * html_handling: "force-trailing-slash" in wrangler.jsonc. 404.html is geen adres - dat
 * bestand wordt door Workers Assets uitgeleverd bij een onbekend pad en staat nergens
 * in de navigatie.
 */
const adresVan = (pad) => {
  const p = pad.replace(/^dist/, '');
  if (p === '/404.html') return null;
  if (p === '/index.html') return '/';
  if (p.endsWith('/index.html')) return p.replace(/index\.html$/, '');
  return p;
};

const paginas = bestanden.map((bestand) => ({
  bestand,
  adres: adresVan(bestand),
  html: readFileSync(bestand, 'utf8'),
}));

const is404 = (p) => p.adres === null;
const indexeerbaar = paginas.filter((p) => !is404(p));

/** De zichtbare tekst: zonder script, zonder style, zonder tags. */
function tekstVan(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ------------------------------------------------- wat de worker aan formulieren kent
//
// Uit worker/index.ts gelezen en niet hier opgeschreven. Een action die de worker niet
// kent is een aanvraag die op een 404 landt, en dat is precies het soort fout dat
// maanden onopgemerkt blijft omdat niemand zijn eigen contactformulier invult.
const workerBron = readFileSync('worker/index.ts', 'utf8');
const ENDPOINTS = new Set(
  [...workerBron.matchAll(/url\.pathname === '([^']+)'/g)].map((m) => m[1]),
);
if (!ENDPOINTS.size) {
  zak('vooraf: in worker/index.ts staat geen enkel formulieradres - de regex klopt niet meer');
}
// En het adres uit inhoud.mjs moet er een van zijn. Dat is de koppeling die anders stil
// uit de pas loopt: build.mjs zet FORM_PAD in de action, de worker luistert op zijn
// eigen string, en niets dwingt die twee gelijk te zijn.
if (!ENDPOINTS.has(FORM_PAD)) {
  zak(`vooraf: worker/index.ts luistert niet op ${FORM_PAD} (wel op: ${[...ENDPOINTS].join(', ') || 'niets'})`);
}

// ------------------------------------------------------------------------ per pagina
for (const p of paginas) {
  const naam = p.adres ?? '404.html';
  const zakP = (m) => zak(`${naam} ${m}`);

  // 1. titel + omschrijving
  const titel = (p.html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!titel || !titel.trim()) zakP('heeft geen <title>');
  const omschrijving = (p.html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!omschrijving || !omschrijving.trim()) zakP('heeft geen meta description');

  // 2. precies een h1, met tekst
  const h1s = [...p.html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1s.length !== 1) zakP(`heeft ${h1s.length} h1-elementen, dat moet er precies een zijn`);
  else if (!tekstVan(h1s[0][1])) zakP('heeft een lege h1');

  // 3. canonical
  const canon = (p.html.match(/rel="canonical" href="([^"]+)"/) || [])[1];
  if (is404(p)) {
    if (canon) zakP(`heeft een canonical (${canon}) - een foutpagina hoort er geen te hebben`);
  } else if (!canon) {
    zakP('heeft geen canonical');
  } else if (canon !== `${ADRES}${p.adres}`) {
    zakP(`canonical wijst naar ${canon} in plaats van naar ${ADRES}${p.adres}`);
  }

  // 4. de woordvloer - staat de inhoud in de html, of in een script?
  const woorden = tekstVan(p.html).split(' ').filter(Boolean).length;
  const vloer = is404(p) ? WOORDVLOER_404 : WOORDVLOER;
  if (woorden < vloer) {
    zakP(`heeft ${woorden} woorden in de html, onder de vloer van ${vloer} - staat de tekst in een script?`);
  }

  // 5. noindex
  const dicht = /<meta name="robots" content="noindex/.test(p.html);
  if (is404(p) && !dicht) zakP('staat niet op noindex - een foutpagina hoort niet in de index');
  if (!is404(p)) {
    if (DEV && !dicht) zakP('staat niet op noindex in een dichte bouw');
    if (!DEV && dicht) zakP('staat op noindex in een productiebouw - dan ziet niemand de pagina');
  }

  // 6. taal
  if (!/<html lang="nl">/.test(p.html)) zakP('heeft geen lang="nl" op <html>');

  // 7. formulieren
  for (const m of p.html.matchAll(/<form\b[^>]*>/gi)) {
    const action = (m[0].match(/action="([^"]+)"/) || [])[1];
    if (!action) {
      zakP('heeft een <form> zonder action - de browser post dan naar de pagina zelf');
    } else if (!ENDPOINTS.has(action)) {
      zakP(`heeft een <form action="${action}"> die de worker niet kent - die aanvraag landt op een 404`);
    }
  }

  // 8 + 9 + 10. interne links en bestanden
  for (const m of p.html.matchAll(/(?:src|href)="(?!https?:|mailto:|tel:|data:|#)([^"]+)"/g)) {
    const url = m[1];
    const schoon = url.split(/[?#]/)[0];
    if (!schoon || schoon.startsWith('//')) continue;
    if (/\.html($|[?#])/.test(url)) {
      zakP(`linkt naar ${url} - .html in een intern adres is een 301 per klik`);
    }
    const rel = schoon.replace(/^\//, '');
    const doel = rel === '' || rel.endsWith('/') ? `dist/${rel}index.html` : `dist/${rel}`;
    if (!existsSync(doel)) zakP(`verwijst naar ${url}, maar ${doel} bestaat niet`);
  }

  // 13. de JSON-LD moet parseren. Een stuk kapotte structured data is onzichtbaar op de
  //     pagina en kost precies de rich results waar hij voor staat.
  for (const m of p.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch (e) {
      zakP(`heeft JSON-LD die niet parseert: ${e.message}`);
    }
  }

  // 14. geen bouwnotitie in de pagina (zie controleer.mjs regel 18 en 25-10-2026)
  const commentaar = [...p.html.matchAll(/<!--([\s\S]*?)-->/g)].filter((m) => !/^\s*\[if |^\s*</.test(m[1]));
  if (commentaar.length) {
    zakP(`draagt ${commentaar.length} html-commentaar: "${commentaar[0][1].trim().slice(0, 60)}..."`);
  }

  // 15. het oude conceptadres
  if (p.html.includes(OUD_CONCEPT)) zakP(`noemt het oude conceptadres ${OUD_CONCEPT}`);
}

// ------------------------------------------------------------- 11. sitemap en 12. robots
const sitemapPad = 'dist/sitemap.xml';
const robots = existsSync('dist/robots.txt') ? readFileSync('dist/robots.txt', 'utf8') : '';

if (DEV) {
  if (existsSync(sitemapPad)) zak('vooraf: er staat een sitemap in een dichte bouw');
  if (!/Disallow: \/\s*$/m.test(robots)) zak('vooraf: robots.txt staat niet dicht in een dichte bouw');
} else {
  if (!existsSync(sitemapPad)) {
    zak('vooraf: dist/sitemap.xml ontbreekt in een productiebouw');
  } else {
    const inSitemap = [...readFileSync(sitemapPad, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const hoort = indexeerbaar.map((p) => `${ADRES}${p.adres}`).sort();
    const staat = [...inSitemap].sort();
    const teveel = staat.filter((u) => !hoort.includes(u));
    const tekort = hoort.filter((u) => !staat.includes(u));
    if (teveel.length) zak(`vooraf: sitemap noemt ${teveel.join(', ')}, maar die pagina('s) zijn niet indexeerbaar`);
    if (tekort.length) zak(`vooraf: sitemap mist ${tekort.join(', ')}`);
    /*
     * En de lijst in inhoud.mjs moet hetzelfde zeggen. Dat is de derde partij in dit
     * rijtje: build.mjs schrijft de sitemap uit INDEXEERBAAR_PADEN, dist/ is wat er
     * echt ligt, en deze controle legt die twee naast elkaar. Zonder dit kan een derde
     * pagina gebouwd worden die nergens in de sitemap belandt, en dat is precies de
     * fout die niemand ziet - de pagina werkt namelijk prima.
     */
    const uitInhoud = [...INDEXEERBAAR_PADEN].sort();
    const uitDist = indexeerbaar.map((p) => p.adres).sort();
    if (uitInhoud.join('|') !== uitDist.join('|')) {
      zak(`vooraf: INDEXEERBAAR_PADEN in inhoud.mjs zegt ${uitInhoud.join(', ')}, maar in dist/ staat ${uitDist.join(', ')}`);
    }
  }
  if (!/Allow: \//.test(robots)) zak('vooraf: robots.txt staat niet open in een productiebouw');
  if (!robots.includes(`${ADRES}/sitemap.xml`)) zak('vooraf: robots.txt wijst niet naar de sitemap');
}

// De mail-png. worker/confirmation.ts verwijst ernaar; ontbreekt hij, dan krijgt de
// bezoeker een gebroken plaatje in de enige mail die hij ooit van Pascal krijgt.
if (!existsSync('dist/logo-mail.png')) zak('vooraf: dist/logo-mail.png ontbreekt - de bevestigingsmail verwijst ernaar');

// ----------------------------------------------------------------------------- uitslag
if (fouten.length) {
  console.error(`\nvooraf: ${fouten.length} probleem(en)\n`);
  for (const f of fouten) console.error(`  - ${f}`);
  console.error('');
  process.exit(1);
}
console.log(
  `vooraf: ${paginas.length} pagina's schoon (${indexeerbaar.length} indexeerbaar${DEV ? ', dichte bouw' : ''})`,
);
