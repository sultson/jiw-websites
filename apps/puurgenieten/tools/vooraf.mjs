// De poort op de bouw: staat elke pagina echt helemaal in de html, en staat alles
// erbij wat een zoekmachine en een deellink nodig hebben? Overgenomen van
// apps/framemedia/tools/vooraf.mjs en uitgebreid met wat daar niet hoefde
// (hreflang, deelplaat, lang per map, robots).
//
// De site is statisch zonder hydratie, dus "voorgerenderd" is de normale toestand.
// Precies daarom valt het ongemerkt weg: een blok dat morgen met JavaScript wordt
// ingevuld ziet er in een browser hetzelfde uit. Een poort die je kunt overslaan is
// geen poort, dus `pnpm build` stopt hierop.
//
//   node tools/vooraf.mjs            na de productiebouw
//   node tools/vooraf.mjs --concept  na de conceptbouw (laat noindex staan)
//
// Per pagina:
//   1. <title> en meta description, niet leeg; description niet langer dan 170
//   2. precies een <h1>, met tekst erin
//   3. canonical, en die wijst naar deze pagina zelf
//   4. een woordvloer: de tekst staat in de html en niet in een script
//   5. noindex alleen op de 404
//   6. <html lang> klopt met de map (/ = nl, /en/ = en, /de/ = de)
//   7. hreflang-set compleet en wederkerig, elk doel bestaat als bestand
//   8. og:title, og:description, og:url (= canonical), og:image die bestaat
//   9. JSON-LD parseert
//  10. elk <form> heeft een action die de worker kent, en een Turnstile-vak
//  11. geen link naar een intern adres dat niet bestaat
// En voor de site: de sitemap dekt precies de indexeerbare pagina's, robots.txt
// opent en noemt de sitemap.
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const CONCEPT = process.argv.includes('--concept');
const ENDPOINTS = new Set(['/api/forms/puurgenieten']);
const WOORDVLOER = 400;
const DESCRIPTION_MAX = 170;

const bestanden = [];
(function loop(map) {
  for (const i of readdirSync(map, { withFileTypes: true })) {
    const pad = `${map}/${i.name}`;
    if (i.isDirectory()) loop(pad);
    else if (i.name.endsWith('.html')) bestanden.push(pad);
  }
})('dist');
bestanden.sort();

const adresVan = pad => {
  const p = pad.replace(/^dist/, '');
  if (p.endsWith('/index.html')) return p.replace(/index\.html$/, '');
  return p.replace(/\.html$/, '');
};
const ontsnap = s => s.replace(/&amp;/g, '&');
const tekstVan = html => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z]+;|&#\d+;/gi, ' ')
  .split(/\s+/).filter(Boolean);
const lengte = s => s.replace(/&[a-z]+;|&#\d+;/gi, 'x').length;

const klachten = [];
const adressen = new Set(bestanden.map(adresVan));
const indexeerbaar = [];
const hreflangs = new Map();

for (const pad of bestanden) {
  const html = readFileSync(pad, 'utf8');
  const adres = adresVan(pad);
  const is404 = pad === 'dist/404.html';
  const zeg = t => klachten.push(`${adres}: ${t}`);

  const titel = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  if (!titel) zeg('geen <title>');
  const omschrijving = html.match(/<meta name="description" content="([^"]*)"/i)?.[1]?.trim();
  if (!omschrijving && !is404) zeg('geen meta description');
  if (omschrijving && lengte(omschrijving) > DESCRIPTION_MAX) zeg(`meta description is ${lengte(omschrijving)} tekens, Google toont er ~155`);

  const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1.length !== 1) zeg(`${h1.length} keer <h1>, een verwacht`);
  else if (!tekstVan(h1[0][1]).length) zeg('<h1> zonder tekst');

  const noindex = /name="robots"[^>]*noindex/i.test(html);
  if (is404) {
    if (!noindex) zeg('de foutpagina hoort op noindex');
    continue;
  }
  if (!CONCEPT && noindex) zeg('noindex in de productiebouw');
  if (CONCEPT && !noindex) zeg('geen noindex in de conceptbouw');

  const lang = html.match(/<html lang="([^"]+)"/)?.[1];
  const verwacht = adres.startsWith('/en/') ? 'en' : adres.startsWith('/de/') ? 'de' : 'nl';
  if (lang !== verwacht) zeg(`<html lang="${lang}">, verwacht ${verwacht}`);

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  if (!canonical) zeg('geen canonical');
  else if (new URL(canonical).pathname !== adres) zeg(`canonical wijst naar ${new URL(canonical).pathname}, niet naar zichzelf`);
  if (!noindex) indexeerbaar.push(canonical);

  const set = new Map([...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)].map(m => [m[1], m[2]]));
  hreflangs.set(canonical, set);
  for (const t of ['nl', 'en', 'de', 'x-default']) if (!set.has(t)) zeg(`hreflang ${t} ontbreekt`);
  if (set.get(lang) !== canonical) zeg(`hreflang ${lang} wijst niet naar deze pagina`);
  for (const [t, h] of set) {
    if (!adressen.has(new URL(h).pathname)) zeg(`hreflang ${t} wijst naar ${h}, dat bestaat niet`);
  }

  const og = naam => html.match(new RegExp(`<meta property="og:${naam}" content="([^"]*)"`))?.[1];
  for (const n of ['title', 'description', 'url', 'image']) if (!og(n)) zeg(`og:${n} ontbreekt`);
  if (og('url') && og('url') !== canonical) zeg(`og:url ${og('url')} is niet de canonical`);
  const beeld = og('image');
  if (beeld && !existsSync('dist' + new URL(beeld).pathname)) zeg(`og:image ${beeld} staat niet in dist/`);

  for (const s of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const b = JSON.parse(s[1].replace(/\\u003c/g, '<'));
      if (!b['@context'] || !(b['@type'] || b['@graph'])) zeg('JSON-LD zonder @context of @type/@graph');
    } catch (e) {
      zeg(`JSON-LD parseert niet: ${e.message}`);
    }
  }

  const woorden = tekstVan(html).length;
  if (woorden < WOORDVLOER) zeg(`${woorden} woorden in de html, minstens ${WOORDVLOER} verwacht`);

  for (const f of html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)) {
    const action = f[1].match(/action="([^"]*)"/)?.[1];
    if (CONCEPT) continue;
    if (!action) zeg('een <form> zonder action - die aanmelding verdwijnt');
    else if (!ENDPOINTS.has(action)) zeg(`<form action="${action}"> bestaat niet in de worker`);
    if (!/class="cf-turnstile"/.test(f[2])) zeg('formulier zonder Turnstile-vak - de worker weigert dan elke inzending');
  }

  for (const a of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const h = ontsnap(a[1]);
    if (h.startsWith('/assets/')) {
      if (!existsSync('dist' + h)) zeg(`link naar ${h}, dat bestand bestaat niet`);
      continue;
    }
    if (!adressen.has(h) && !adressen.has(h + '/')) zeg(`link naar ${h}, dat adres bestaat niet`);
  }
}

// hreflang moet heen en terug wijzen, anders negeert Google de hele set.
for (const [pagina, set] of hreflangs) {
  for (const [t, doel] of set) {
    if (t === 'x-default' || doel === pagina) continue;
    const terug = hreflangs.get(doel);
    if (!terug || ![...terug.values()].includes(pagina)) klachten.push(`hreflang: ${doel} wijst niet terug naar ${pagina}`);
  }
}

const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
const inSitemap = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
for (const c of indexeerbaar) if (c && !inSitemap.includes(c)) klachten.push(`sitemap: ${c} mist`);
for (const l of inSitemap) if (!indexeerbaar.includes(l)) klachten.push(`sitemap: ${l} staat erin maar is niet indexeerbaar`);

const robots = readFileSync('dist/robots.txt', 'utf8');
if (!CONCEPT) {
  if (/Disallow:\s*\/\s*$/m.test(robots)) klachten.push('robots.txt houdt de productiesite dicht');
  if (!/^Sitemap: https:\/\/puurgenieten\.tv\/sitemap\.xml$/m.test(robots)) klachten.push('robots.txt noemt de sitemap niet');
  if (/X-Robots-Tag/i.test(readFileSync('dist/_headers', 'utf8'))) klachten.push('_headers zet een X-Robots-Tag in de productiebouw');
}

if (klachten.length) {
  console.error(`\nDe bouw is niet heel - ${klachten.length} ${klachten.length === 1 ? 'klacht' : 'klachten'}:`);
  for (const k of klachten) console.error('  ' + k);
  process.exit(1);
}
console.log(`vooraf: ${bestanden.length} pagina's compleet in de html, ${inSitemap.length} in de sitemap, hreflang wederkerig`);
