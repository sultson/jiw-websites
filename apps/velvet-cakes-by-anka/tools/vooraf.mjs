// De poort op de bouw: staat elke pagina echt helemaal in de html?
//
// Voor deze site is dat geen formaliteit maar precies de reden dat hij verhuisd
// is. Tot 18-10-2026 was dit een conceptmap waarin de Engelse en de Roemeense
// versie pas in de browser ontstonden: i18n.js wisselde de tekst om. Er was een
// adres per pagina, met lang="nl" erop, en twee van de drie talen bestonden
// nergens als pagina. Een bezoeker zag het verschil niet en een zoekmachine zag
// alleen Nederlands.
//
// Dus kijkt de bouw het na in plaats van erop te vertrouwen, en stopt hij als
// het niet klopt. Een poort die je kunt overslaan is geen poort.
//
//   node tools/vooraf.mjs            na de productiebouw
//   node tools/vooraf.mjs --concept  na de conceptbouw (laat noindex staan)
//
// Wat er per pagina gecontroleerd wordt:
//    1. een <title> en een meta description, en ze zijn niet leeg
//    2. precies een <h1>, met tekst erin
//    3. een canonical, en die wijst naar deze pagina zelf
//    4. een woordvloer: de tekst staat in de html en niet in een script
//    5. noindex staat alleen op de 404
//    6. lang op <html> is de taal van de map waar de pagina staat
//    7. de hreflang-set is rond: drie talen plus x-default, en elk adres
//       bestaat ook echt als bestand
//    8. elk <form> heeft een action, en die action bestaat in de worker
//    9. geen link naar een intern adres dat niet bestaat
//   10. geen .html in een intern adres (dat is een 301 per klik)
//   11. geen enkele <img src> of <link href> die niet in dist/ staat
//   12. de sitemap dekt precies de pagina's die indexeerbaar zijn
//   13. de drie verhuisde adressen (eclairs, choux, cupcakes) komen nergens
//       meer voor als link
//   14. het Bakery-blok draagt haar Google-bedrijfsprofiel (sameAs + hasMap)
//       en zeven dagen 07:00-23:00, gelijk aan wat er in dat profiel staat
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const CONCEPT = process.argv.includes('--concept');
const ADRES = 'https://velvetcakesbyanka.nl';
const TALEN = ['nl', 'en', 'ro'];

// Wat de worker aanneemt. Een action die hier niet in staat is een aanvraag die
// op een 404 landt; dat is precies het soort fout dat maanden onopgemerkt
// blijft omdat niemand zijn eigen contactformulier invult.
const ENDPOINTS = new Set(['/api/forms/aanvraag']);

// De tekstvloer per pagina. Lager dan dit en er staat iets niet in de html.
// De macaronpagina is de kortste van de dertig (twee fotos en een prijsregel),
// dus staat de vloer daaronder: hoog genoeg om een pagina te betrappen die zijn
// inhoud kwijt is, laag genoeg dat een redactieronde de bouw niet stilzet.
const WOORDVLOER = 150;

// Adressen die geen pagina meer zijn. De worker stuurt ze met een 301 door,
// maar de site zelf hoort er niet meer naar te linken: dan stuur je een
// bezoeker over een omleiding naar een pagina die je ook direct had kunnen
// aanwijzen.
const VERHUISD = ['eclairs', 'choux.html', 'cupcakes.html'];

// Haar Google-bedrijfsprofiel en haar openingstijden. Die twee horen bij
// elkaar: het profiel is wat Google gebruikt, dit blok is wat het bevestigt.
// Raakt een van de twee zoek, dan staat de site het profiel stil tegen te
// spreken en is er in de pagina niets aan te zien.
const GBP = 'https://maps.google.com/?cid=7038032441905336788';
const DAGEN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
  if (p === '/index.html') return '/';
  if (p.endsWith('/index.html')) return p.replace(/index\.html$/, '');
  return p.replace(/\.html$/, '');
};

// De taal die bij een pad hoort. /en/taarten.html -> en, /taarten.html -> nl.
const taalVan = pad => {
  const m = pad.match(/^dist\/(en|ro)\//);
  return m ? m[1] : 'nl';
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
  const taal = taalVan(pad);
  const is404 = pad === 'dist/404.html';
  const zeg = t => klachten.push(`${adres}: ${t}`);

  const titel = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  if (!titel) zeg('geen <title>');
  const omschrijving = html.match(/<meta name="description" content="([^"]*)"/i)?.[1]?.trim();
  if (!omschrijving && !is404) zeg('geen meta description');

  const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1.length !== 1) zeg(`${h1.length} keer <h1>, een verwacht`);
  else if (!tekstVan(h1[0][1]).length) zeg('<h1> zonder tekst');

  // De taal van het document. Dit is de fout die de conceptsite had op alle
  // dertig varianten, en de enige die je in een browser niet ziet.
  const lang = html.match(/<html lang="([^"]+)"/)?.[1];
  if (lang !== taal) zeg(`lang="${lang}" op een pagina die in ${taal} staat`);

  const noindex = /name="robots"[^>]*noindex/i.test(html);
  if (is404 && !noindex) zeg('de foutpagina hoort op noindex');
  if (!is404) {
    if (!CONCEPT && noindex) zeg('noindex in de productiebouw');
    if (CONCEPT && !noindex) zeg('geen noindex in de conceptbouw');

    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
    if (!canonical) zeg('geen canonical');
    else if (new URL(canonical).pathname !== adres) zeg(`canonical wijst naar ${new URL(canonical).pathname}, niet naar zichzelf`);
    if (!noindex) indexeerbaar.push(canonical);

    // De hreflang-set. Zonder deze zijn /taarten en /en/taarten voor Google
    // twee pagina's die hetzelfde beweren en kiest hij er zelf een.
    const alt = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)];
    const gevonden = alt.map(m => m[1]);
    for (const t of [...TALEN, 'x-default']) {
      if (!gevonden.includes(t)) zeg(`geen hreflang voor ${t}`);
    }
    for (const [, t, href] of alt) {
      const p = new URL(href).pathname;
      if (!adressen.has(p)) zeg(`hreflang ${t} wijst naar ${p}, dat adres bestaat niet`);
    }
    // Een pagina moet in zijn eigen hreflang-set staan, anders is de set niet
    // wederkerig en negeert Google hem.
    if (!alt.some(([, , href]) => new URL(href).pathname === adres)) zeg('staat niet in zijn eigen hreflang-set');
  }

  // JSON-LD die niet parseert is erger dan geen JSON-LD: Google meldt hem als
  // fout en negeert hem, en in de html is er niets aan te zien.
  let bakkerij = null;
  for (const s of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const b = JSON.parse(s[1].replace(/\\u003c/g, '<'));
      if (!b['@context'] || !b['@type']) zeg('JSON-LD zonder @context of @type');
      if (b['@type'] === 'Bakery') {
        if (bakkerij) zeg('twee keer een Bakery-blok');
        else bakkerij = b;
      }
    } catch (e) {
      zeg(`JSON-LD parseert niet: ${e.message}`);
    }
  }

  // Het bedrijfsblok. De 404 hoort er geen te dragen: dat is geen pagina over
  // haar bedrijf.
  if (is404) {
    if (bakkerij) zeg('de foutpagina draagt een Bakery-blok');
  } else if (!bakkerij) {
    zeg('geen Bakery-blok');
  } else {
    if (!(bakkerij.sameAs || []).includes(GBP)) zeg('het Bakery-blok noemt haar Google-bedrijfsprofiel niet in sameAs');
    if (bakkerij.hasMap !== GBP) zeg(`hasMap is ${bakkerij.hasMap || 'leeg'}, verwacht het Google-bedrijfsprofiel`);
    const uren = bakkerij.openingHoursSpecification || [];
    const dagen = uren.flatMap(u => [].concat(u.dayOfWeek || []).map(d => d.replace('https://schema.org/', '')));
    for (const d of DAGEN) if (!dagen.includes(d)) zeg(`geen openingstijd voor ${d}`);
    for (const u of uren) {
      if (u.opens !== '07:00' || u.closes !== '23:00') zeg(`openingstijd ${u.opens}-${u.closes}, haar profiel zegt 07:00-23:00`);
    }
  }

  const woorden = tekstVan(html).length;
  if (!is404 && woorden < WOORDVLOER) zeg(`${woorden} woorden in de html, minstens ${WOORDVLOER} verwacht`);

  for (const f of html.matchAll(/<form\b([\s\S]*?)>/gi)) {
    const action = f[1].match(/action="([^"]*)"/)?.[1];
    if (!action) zeg('een <form> zonder action - die aanvraag verdwijnt');
    else if (!ENDPOINTS.has(action)) zeg(`<form action="${action}"> bestaat niet in de worker`);
  }

  // Interne links: elk adres moet als pagina bestaan, en geen enkel adres mag
  // nog op .html eindigen - dat is een 301 per klik.
  for (const a of html.matchAll(/href="(\/[^"#?]*)([^"]*)"/g)) {
    const h = a[1];
    if (h.endsWith('.html')) { zeg(`link naar ${h}: intern adres met .html erin`); continue; }
    if (/\.(webp|png|svg|jpg|css|js|xml|txt|ico)$/.test(h)) {
      if (!existsSync('dist' + h)) zeg(`verwijst naar ${h}, dat bestand staat niet in dist/`);
      continue;
    }
    if (h === '/') continue;
    if (!adressen.has(h) && !adressen.has(h + '/') && !adressen.has(h.replace(/\/$/, ''))) {
      zeg(`link naar ${h}, dat adres bestaat niet`);
    }
  }

  // Elke foto, elke stijl en elk script moet in dist/ staan. Een gebroken
  // fotoverwijzing is op een taartensite geen detail.
  for (const s of html.matchAll(/(?:src|data-groot)="(\/[^"]+)"/g)) {
    if (!existsSync('dist' + s[1])) zeg(`verwijst naar ${s[1]}, dat bestand staat niet in dist/`);
  }

  for (const v of VERHUISD) {
    if (new RegExp(`href="[^"]*/${v.replace('.', '\\.')}"`).test(html)) zeg(`linkt nog naar het verhuisde adres ${v}`);
  }
}

// De sitemap moet precies de indexeerbare pagina's dekken. Een pagina die erin
// mist wordt later gevonden; een pagina die erin staat maar niet bestaat is een
// fout in Search Console die niemand kan plaatsen.
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
const inSitemap = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
for (const c of indexeerbaar) if (c && !inSitemap.includes(c)) klachten.push(`sitemap: ${c} mist`);
for (const l of inSitemap) if (!indexeerbaar.includes(l)) klachten.push(`sitemap: ${l} staat erin maar is niet indexeerbaar`);
if (!sitemap.includes('xmlns:xhtml')) klachten.push('sitemap: geen xhtml-naamruimte, dus de hreflang-regels erin doen niets');

// robots.txt hoort in de productiebouw naar de sitemap te wijzen en in de
// conceptbouw alles dicht te zetten.
const robots = readFileSync('dist/robots.txt', 'utf8');
if (CONCEPT && !robots.includes('Disallow: /')) klachten.push('robots.txt: de conceptbouw hoort dicht te staan');
if (!CONCEPT && !robots.includes(`Sitemap: ${ADRES}/sitemap.xml`)) klachten.push('robots.txt: geen verwijzing naar de sitemap');

if (klachten.length) {
  console.error(`\nDe bouw is niet heel - ${klachten.length} ${klachten.length === 1 ? 'klacht' : 'klachten'}:`);
  for (const k of klachten) console.error('  ' + k);
  process.exit(1);
}
console.log(`vooraf: ${bestanden.length} pagina's compleet in de html, ${inSitemap.length} in de sitemap, hreflang rond in ${TALEN.length} talen`);
