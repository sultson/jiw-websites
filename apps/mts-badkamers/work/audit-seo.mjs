/**
 * Loopt de gebouwde site na voordat hij de deur uit gaat.
 *
 * De dingen die hier misgaan zijn onzichtbaar bij het klikken: een canonical die
 * nog naar het oude adres wijst, een pagina die na een hernoeming uit de sitemap
 * valt, twee pagina's met dezelfde title, een taalvariant die zichzelf niet als
 * hreflang noemt. Daar struikelt niemand over, en het kost weken voordat je het
 * in de cijfers ziet.
 *
 * Er komt geen browser aan te pas: dit leest de bestanden zoals een crawler ze
 * krijgt. Dat is meteen de scherpste controle die er is op de vraag of de site
 * zonder JavaScript compleet is -- wat hier niet in de HTML staat, staat er voor
 * Google ook niet in. De browsercontrole staat los in work/js-off.mjs.
 *
 * Draait als onderdeel van `ship`, dus een fout hier betekent geen deploy.
 *
 *   node work/audit-seo.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { projects } from '../projects.mjs';
import { SERVICES } from '../content.mjs';
import { LOCALES, DEFAULT_LOCALE, prefix, HTML_LANG } from '../i18n.mjs';

const SITE = 'site';
const ORIGIN = 'https://mts-badkamers.nl';

// Alles wat er niet klopt wordt verzameld en aan het eind samen gemeld: wie een
// bouw draait wil in een keer zien wat er langs moet, niet vijf keer achter
// elkaar op de eerste regel struikelen.
const bezwaren = [];
const eis = (voorwaarde, melding) => {
  if (!voorwaarde) bezwaren.push(melding);
};

const ontcijfer = (v) =>
  v
    .replace(/&(?:amp|#38);/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

function precies(html, patroon, wat, pagina) {
  const treffers = [...html.matchAll(patroon)];
  if (treffers.length !== 1) {
    bezwaren.push(`${pagina}: verwacht precies een ${wat}, gevonden ${treffers.length}`);
    return '';
  }
  return ontcijfer(treffers[0][1]);
}

// Zichtbare tekst: script, style en tags eruit. Dit is bij benadering wat een
// crawler zonder JavaScript overhoudt.
function zichtbareTekst(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

if (!fs.existsSync(SITE)) {
  console.error('site/ ontbreekt; draai eerst pnpm build');
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/*  Welke pagina's horen er te zijn                                    */
/* ------------------------------------------------------------------ */

// De home, de vier dienstenpagina's, de projecthub en de zestien projecten. De
// hub en de diensten kwamen erbij toen bleek dat /werk/ een 404 gaf en dat de
// home in haar eentje op vier verschillende zoekopdrachten moest scoren.
const paden = [
  '/',
  ...SERVICES.map((sv) => `/${sv.slug}/`),
  '/werk/',
  ...projects.map((p) => `/werk/${p.slug}/`),
];
const verwacht = LOCALES.flatMap((loc) => paden.map((pad) => ({ loc, pad, url: `${prefix(loc)}${pad}` })));

const titels = new Map();
const omschrijvingen = new Map();

for (const { loc, pad, url } of verwacht) {
  const bestand = path.join(SITE, url.replace(/^\//, ''), 'index.html');
  if (!fs.existsSync(bestand)) {
    bezwaren.push(`${url}: index.html staat niet in site/`);
    continue;
  }
  const html = fs.readFileSync(bestand, 'utf8');

  /* --- de vier dingen waar een zoekresultaat uit bestaat --- */
  const titel = precies(html, /<title>(.*?)<\/title>/gs, 'title', url);
  const omschrijving = precies(html, /<meta name="description" content="([^"]*)"/g, 'meta description', url);
  const h1 = precies(html, /<h1[^>]*>([\s\S]*?)<\/h1>/g, 'h1', url)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  eis(titel.trim(), `${url}: lege title`);
  eis(titel.length <= 70, `${url}: title is ${titel.length} tekens, wordt afgekapt (max 70)`);
  eis(omschrijving.trim(), `${url}: lege meta description`);
  eis(
    omschrijving.length >= 70 && omschrijving.length <= 175,
    `${url}: meta description is ${omschrijving.length} tekens (mik op 70-175)`,
  );
  eis(h1, `${url}: lege h1`);

  eis(!titels.has(titel), `${url}: zelfde title als ${titels.get(titel)}`);
  titels.set(titel, url);
  eis(!omschrijvingen.has(omschrijving), `${url}: zelfde meta description als ${omschrijvingen.get(omschrijving)}`);
  omschrijvingen.set(omschrijving, url);

  /* --- een adres, en dat adres is dit --- */
  const canonical = precies(html, /<link rel="canonical" href="([^"]*)"/g, 'canonical', url);
  eis(canonical === `${ORIGIN}${url}`, `${url}: canonical wijst naar ${canonical}`);
  eis(!html.includes('jouwidealewebsite.nl'), `${url}: er staat nog een jouwidealewebsite-adres in de pagina`);
  eis(!/M\.Techno Service/.test(html) || /handelsnaam|trading name|ticari ad|назван/i.test(html),
    `${url}: M.Techno Service staat er zonder de handelsnaam-uitleg bij`);

  /* --- taal --- */
  const lang = precies(html, /<html lang="([^"]*)"/g, 'html lang', url);
  eis(lang === HTML_LANG[loc], `${url}: lang is ${lang}, verwacht ${HTML_LANG[loc]}`);
  for (const a of LOCALES) {
    eis(
      html.includes(`hreflang="${a}" href="${ORIGIN}${prefix(a)}${pad}"`),
      `${url}: hreflang ${a} ontbreekt of wijst verkeerd`,
    );
  }
  eis(
    html.includes(`hreflang="x-default" href="${ORIGIN}${pad}"`),
    `${url}: x-default ontbreekt of wijst niet naar de ${DEFAULT_LOCALE}-versie`,
  );

  /* --- delen --- */
  for (const veld of ['og:title', 'og:description', 'og:url', 'og:image', 'og:site_name']) {
    eis(html.includes(`property="${veld}"`), `${url}: ${veld} ontbreekt`);
  }

  /* --- en het punt van dit alles: de pagina is af zonder JavaScript ---
     De site wordt bij het bouwen als complete HTML weggeschreven, er wordt op
     de client niets nagerenderd. Deze twee eisen zijn de wacht daarop: zodra
     iemand een blok naar JavaScript verplaatst, zakt de tekst hier door de
     ondergrens en valt de bouw om. */
  const tekst = zichtbareTekst(html);
  eis(tekst.length > 2000, `${url}: maar ${tekst.length} tekens tekst in de HTML zelf, is dit nog server-side?`);
  eis(tekst.includes(h1.slice(0, 40)), `${url}: de h1 staat niet als tekst in de HTML`);
  const plaatjes = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  eis(plaatjes.length > 0, `${url}: geen enkele <img> in de HTML`);
  eis(
    plaatjes.every((img) => /\ssrc="/.test(img)),
    `${url}: er staat een <img> zonder src (wordt die door JavaScript ingevuld?)`,
  );
  eis(
    plaatjes.every((img) => /\salt="/.test(img)),
    `${url}: er staat een <img> zonder alt`,
  );
}

/* ------------------------------------------------------------------ */
/*  Sitemap en robots                                                  */
/* ------------------------------------------------------------------ */

const sitemapBestand = path.join(SITE, 'sitemap.xml');
if (!fs.existsSync(sitemapBestand)) {
  bezwaren.push('sitemap.xml ontbreekt');
} else {
  const sitemap = fs.readFileSync(sitemapBestand, 'utf8');
  const inSitemap = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  eis(
    inSitemap.length === verwacht.length,
    `sitemap heeft ${inSitemap.length} adressen, verwacht ${verwacht.length}`,
  );
  for (const { url } of verwacht) {
    eis(inSitemap.includes(`${ORIGIN}${url}`), `sitemap mist ${url}`);
  }
  for (const loc of inSitemap) {
    eis(loc.startsWith(ORIGIN), `sitemap noemt een adres buiten ${ORIGIN}: ${loc}`);
  }
  // 404 hoort er niet in: een pagina die met een 404 antwoordt indexeren vragen
  // is een fout die Search Console je maanden blijft melden.
  eis(!sitemap.includes('/404'), 'sitemap noemt de 404-pagina');
  // Zonder lastmod plant Google zijn hercrawl op niets. Er stond er lang geen
  // enkele in; deze eis houdt dat zo.
  const lastmods = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
  eis(lastmods.length === inSitemap.length, `${lastmods.length} van de ${inSitemap.length} adressen heeft een lastmod`);
  eis(
    lastmods.every((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)),
    'sitemap heeft een lastmod die geen datum is',
  );
}

// De video's staan als data-video in de HTML en worden pas door app.js
// ingeladen. Deze sitemap en de VideoObject in de pagina zijn samen het enige
// wat een crawler over die zestien bestanden te horen krijgt.
const videoSitemap = path.join(SITE, 'sitemap-video.xml');
if (!fs.existsSync(videoSitemap)) {
  bezwaren.push('sitemap-video.xml ontbreekt');
} else {
  const xml = fs.readFileSync(videoSitemap, 'utf8');
  const aantal = [...xml.matchAll(/<video:content_loc>([^<]+)<\/video:content_loc>/g)].map((m) => m[1]);
  eis(aantal.length > 0, 'sitemap-video.xml noemt geen enkele video');
  for (const v of aantal) {
    eis(v.startsWith(`${ORIGIN}/video/`), `videositemap noemt een bestand buiten /video/: ${v}`);
    const opSchijf = path.join(SITE, v.slice(ORIGIN.length));
    eis(fs.existsSync(opSchijf), `videositemap noemt ${v}, maar dat bestand staat niet in site/`);
  }
  // Elke VideoObject op een pagina hoort ook in de sitemap te staan en andersom.
  const inPaginas = new Set();
  for (const p of projects) {
    const bestand = path.join(SITE, 'werk', p.slug, 'index.html');
    if (!fs.existsSync(bestand)) continue;
    for (const m of fs.readFileSync(bestand, 'utf8').matchAll(/"contentUrl":"([^"]+)"/g)) inPaginas.add(m[1]);
  }
  eis(
    inPaginas.size === aantal.length,
    `${inPaginas.size} VideoObject op de paginas tegen ${aantal.length} in de videositemap`,
  );
}

const robotsBestand = path.join(SITE, 'robots.txt');
if (!fs.existsSync(robotsBestand)) {
  bezwaren.push('robots.txt ontbreekt');
} else {
  const robots = fs.readFileSync(robotsBestand, 'utf8');
  eis(robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`), 'robots.txt wijst niet naar de sitemap op het eigen domein');
  eis(!/Disallow: \/\s*$/m.test(robots), 'robots.txt sluit de hele site uit');
}

for (const los of ['404.html', '_headers', 'favicon.svg', 'icon.png', 'logo.svg']) {
  eis(fs.existsSync(path.join(SITE, los)), `${los} ontbreekt in site/`);
}

// De foutpagina stond op index,follow en kon zo als lege pagina in de
// zoekresultaten belanden.
for (const loc of LOCALES) {
  const bestand = path.join(SITE, prefix(loc).replace(/^\//, ''), '404.html');
  if (!fs.existsSync(bestand)) continue;
  eis(
    /<meta name="robots" content="noindex/.test(fs.readFileSync(bestand, 'utf8')),
    `${prefix(loc)}/404.html staat niet op noindex`,
  );
}

/* ------------------------------------------------------------------ */

if (bezwaren.length) {
  console.error(`\n${bezwaren.length} bezwaar(en):`);
  for (const b of bezwaren) console.error(`  - ${b}`);
  process.exit(1);
}
console.log(`seo ok: ${verwacht.length} pagina's, sitemap, robots, canonicals en hreflang kloppen`);
