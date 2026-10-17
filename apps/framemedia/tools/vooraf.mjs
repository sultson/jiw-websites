// De poort op de bouw: staat elke pagina echt helemaal in de html?
//
// Deze site is statisch en heeft geen hydratie, dus "voorgerenderd" is hier de
// normale toestand en niet een extra stap. Precies daarom is dit het soort
// eigenschap dat ongemerkt wegvalt: een blok dat morgen met JavaScript wordt
// ingevuld ziet er in een browser net zo uit, en alleen een zoekmachine en een
// voorleesprogramma merken het verschil. Dus kijkt de bouw het na in plaats van
// erop te vertrouwen, en stopt hij als het niet klopt. Een poort die je kunt
// overslaan is geen poort.
//
//   node tools/vooraf.mjs            na de productiebouw
//   node tools/vooraf.mjs --concept  na de conceptbouw (laat noindex staan)
//
// Wat er per pagina gecontroleerd wordt:
//   1. een <title> en een meta description, en ze zijn niet leeg
//   2. precies een <h1>, met tekst erin
//   3. een canonical, en die wijst naar deze pagina zelf
//   4. een woordvloer: de tekst staat in de html en niet in een script
//   5. noindex staat alleen op de 404
//   6. elk <form> heeft een action, en elke action bestaat in de worker
//   7. geen link naar een intern adres dat niet bestaat
//   8. de sitemap dekt precies de pagina's die indexeerbaar zijn
import { readFileSync, readdirSync, existsSync } from 'fs';

const CONCEPT = process.argv.includes('--concept');

// Wat de worker aanneemt. Een action die hier niet in staat is een aanvraag die
// op een 404 landt; dat is precies het soort fout dat maanden onopgemerkt blijft
// omdat niemand zijn eigen contactformulier invult.
const ENDPOINTS = new Set([
  '/api/forms/contact',
  '/api/forms/snel',
  '/api/forms/puurgenieten',
  '/api/forms/programma-idee',
]);

// De tekstvloer per pagina. Lager dan dit en er staat iets niet in de html.
// De getallen zijn de gemeten stand bij de verhuizing, met ruimte eronder zodat
// een redactieronde die een alinea inkort niet meteen de bouw stilzet.
const WOORDVLOER = 180;

const bestanden = [];
(function loop(map) {
  for (const i of readdirSync(map, { withFileTypes: true })) {
    const pad = `${map}/${i.name}`;
    if (i.isDirectory()) loop(pad);
    else if (i.name.endsWith('.html')) bestanden.push(pad);
  }
})('dist');
bestanden.sort();

// Van bestandspad naar het adres waarop het wordt uitgeleverd, volgens
// html_handling: "auto-trailing-slash" in wrangler.jsonc.
const adresVan = pad => {
  const p = pad.replace(/^dist/, '');
  if (p.endsWith('/index.html')) return p.replace(/index\.html$/, '');
  return p.replace(/\.html$/, '');
};

const tekstVan = html => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z]+;|&#\d+;/gi, ' ')
  .split(/\s+/).filter(Boolean);

const klachten = [];
const adressen = new Set(bestanden.map(adresVan));
const indexeerbaar = [];

for (const pad of bestanden) {
  const html = readFileSync(pad, 'utf8');
  const adres = adresVan(pad);
  const is404 = pad === 'dist/404.html';
  const zeg = t => klachten.push(`${adres}: ${t}`);

  const titel = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  if (!titel) zeg('geen <title>');
  const omschrijving = html.match(/<meta name="description" content="([^"]*)"/i)?.[1]?.trim();
  if (!omschrijving && !is404) zeg('geen meta description');

  const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1.length !== 1) zeg(`${h1.length} keer <h1>, een verwacht`);
  else if (!tekstVan(h1[0][1]).length) zeg('<h1> zonder tekst');

  const noindex = /name="robots"[^>]*noindex/i.test(html);
  if (is404 && !noindex) zeg('de foutpagina hoort op noindex');
  if (!is404) {
    if (!CONCEPT && noindex) zeg('noindex in de productiebouw');
    if (CONCEPT && !noindex) zeg('geen noindex in de conceptbouw');

    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
    if (!canonical) zeg('geen canonical');
    else if (new URL(canonical).pathname !== adres) zeg(`canonical wijst naar ${new URL(canonical).pathname}, niet naar zichzelf`);
    if (!noindex) indexeerbaar.push(canonical);
  }

  // JSON-LD die niet parseert is erger dan geen JSON-LD: Google meldt hem als
  // fout en negeert hem, en in de html is er niets aan te zien.
  for (const s of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const b = JSON.parse(s[1].replace(/\\u003c/g, '<'));
      if (!b['@context'] || !b['@type']) zeg('JSON-LD zonder @context of @type');
    } catch (e) {
      zeg(`JSON-LD parseert niet: ${e.message}`);
    }
  }

  const woorden = tekstVan(html).length;
  if (!is404 && woorden < WOORDVLOER) zeg(`${woorden} woorden in de html, minstens ${WOORDVLOER} verwacht`);

  for (const f of html.matchAll(/<form\b([^>]*)>/gi)) {
    const action = f[1].match(/action="([^"]*)"/)?.[1];
    if (CONCEPT) continue;
    if (!action) zeg('een <form> zonder action - die aanvraag verdwijnt');
    else if (!ENDPOINTS.has(action)) zeg(`<form action="${action}"> bestaat niet in de worker`);
  }

  // Interne links. Alleen de eigen pagina's: /assets/, /wp-content/ en de
  // oude adressen uit _redirects worden door de edge afgehandeld en staan dus
  // niet als bestand in dist/ op het adres waar ze heen wijzen.
  for (const a of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const h = a[1];
    if (h.startsWith('/assets/') || h.startsWith('/wp-content/')) continue;
    if (h === '/') continue;
    if (!adressen.has(h.replace(/\/$/, '') || '/') && !adressen.has(h) && !adressen.has(h + '/')) {
      if (existsSync('dist' + h)) continue;
      zeg(`link naar ${h}, dat adres bestaat niet`);
    }
  }
}

// De sitemap moet precies de indexeerbare pagina's dekken. Een pagina die erin
// mist wordt later gevonden; een pagina die erin staat maar niet bestaat is een
// fout in Search Console die niemand kan plaatsen.
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
const inSitemap = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
for (const c of indexeerbaar) if (c && !inSitemap.includes(c)) klachten.push(`sitemap: ${c} mist`);
for (const l of inSitemap) if (!indexeerbaar.includes(l)) klachten.push(`sitemap: ${l} staat erin maar is niet indexeerbaar`);

if (klachten.length) {
  console.error(`\nDe bouw is niet heel - ${klachten.length} ${klachten.length === 1 ? 'klacht' : 'klachten'}:`);
  for (const k of klachten) console.error('  ' + k);
  process.exit(1);
}
console.log(`vooraf: ${bestanden.length} pagina's compleet in de html, ${inSitemap.length} in de sitemap`);
