import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { projects, BIZ } from './projects.mjs';
import { FAQ, AREA, HQ, BA, REVIEWS, SERVICES } from './content.mjs';
import {
  LOCALES, DEFAULT_LOCALE, prefix, UI, fill, LANG_NAME, LANG_SHORT, OG_LOCALE, HTML_LANG,
} from './i18n.mjs';
import { tProject, tFaq, tBa, tArea, tReview, tService } from './i18n-content.mjs';

// Actieve taal, module-level. Zo goed als elke functie hieronder rendert tekst;
// ze allemaal een locale-parameter geven zou zestig aanroepen raken zonder dat
// het ergens duidelijker van wordt. buildAll() zet LOC/L per taal.
let LOC = DEFAULT_LOCALE;
let L = UI[DEFAULT_LOCALE];
// PATH is het pad van de pagina die nu gebouwd wordt, zonder taalprefix. De
// taalwisselaar heeft dat nodig: die moet naar dezelfde pagina in een andere
// taal wijzen, niet naar de homepage.
let PATH = '/';
const U = (p) => `${prefix(LOC)}${p}`;
const outDir = () => (LOC === DEFAULT_LOCALE ? SITE : path.join(SITE, LOC));

const ROOT = path.resolve('.');
const SITE = path.join(ROOT, 'site');
const MEDIA = path.join(ROOT, 'assets', 'media');
// Publieke Mapbox-token (pk). Die hoort in de client te staan; beperken doe je
// bij Mapbox op domein, niet door hem te verstoppen. Zelfde token als
// jiw-concepts gebruikt.
// De .env staat op de root van de monorepo (twee mappen hoger dan deze app).
// De omgevingsvariabele wint, zodat een deploy vanuit CI geen bestand nodig heeft.
const MAPBOX_TOKEN = (() => {
  if (process.env.MAPBOX_TOKEN) return process.env.MAPBOX_TOKEN.trim().replace(/^"|"$/g, '');
  const envFile = path.join(ROOT, '..', '..', '.env');
  if (!fs.existsSync(envFile)) return '';
  return (
    fs.readFileSync(envFile, 'utf8').match(/^MAPBOX_TOKEN=(.+)$/m)?.[1].trim().replace(/^"|"$/g, '') || ''
  );
})();
if (!MAPBOX_TOKEN.startsWith('pk.')) {
  throw new Error('MAPBOX_TOKEN niet gevonden: zet hem in de .env op de root van jiw-websites');
}
// Het eigen domein is de canonieke host. www en de oude
// jouwidealewebsite-adressen hangen als route aan dezelfde Worker en worden daar
// met een 301 hierheen gestuurd (worker/index.ts), zodat gedeelde links blijven
// werken zonder dat er twee vindbare kopieen van de site ontstaan.
const ORIGIN = 'https://mts-badkamers.nl';

// ---- lastmod -----------------------------------------------------------------
// Elk adres in de sitemap hoort een <lastmod> te hebben: Google plant zijn
// hercrawl er mede op, en juist bij een site waar projecten bij komen is dat het
// verschil tussen binnen een week of binnen een maand opgemerkt worden. Er stond
// er geen enkele in.
//
// De datum komt uit de bronbestanden die de pagina maken, niet uit de klok: een
// bouw zonder inhoudelijke wijziging mag de datum niet vooruitschuiven, want dan
// is het signaal binnen twee deploys niets meer waard. Git is de nauwkeurigste
// bron (de commitdatum van het bestand), met de wijzigingsdatum op schijf als
// terugval voor een omgeving zonder git-geschiedenis.
const bronDatums = new Map();
function bronDatum(bestand) {
  if (bronDatums.has(bestand)) return bronDatums.get(bestand);
  let datum;
  try {
    datum = execFileSync('git', ['log', '-1', '--format=%cs', '--', bestand], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    datum = '';
  }
  // De laatste van de twee. Git is de nauwkeurigste bron, maar een bestand dat
  // is aangepast en nog niet gecommit zou dan een oude datum houden; de mtime
  // vangt dat op. Ontbreekt git, dan blijft alleen de mtime over.
  const opSchijf = fs.statSync(path.join(ROOT, bestand)).mtime.toISOString().slice(0, 10);
  datum = /^\d{4}-\d{2}-\d{2}$/.test(datum) && datum > opSchijf ? datum : opSchijf;
  bronDatums.set(bestand, datum);
  return datum;
}
// De laatste van een reeks bronbestanden. `content.mjs` en `projects.mjs` dragen
// de inhoud, `build.mjs` de vorm; verandert een van de drie, dan is de pagina
// veranderd.
const laatste = (...bestanden) => bestanden.map(bronDatum).sort().at(-1);
const LASTMOD = {
  home: laatste('build.mjs', 'content.mjs', 'projects.mjs', 'i18n.mjs'),
  project: laatste('build.mjs', 'projects.mjs', 'i18n-content.mjs'),
  dienst: laatste('build.mjs', 'content.mjs', 'i18n-content.mjs'),
};

// Duur en afmetingen per video, gemeten met ffprobe door work/video-meta.mjs.
// Nodig voor VideoObject: zonder duration en thumbnailUrl komt een video niet in
// de videoresultaten van Google. Ontbreekt het bestand, dan blijft de rest van de
// bouw gewoon werken en vervalt alleen de videomarkup.
const videoMeta = (() => {
  const f = path.join(ROOT, '_video.json');
  if (!fs.existsSync(f)) {
    console.warn('let op: _video.json ontbreekt, geen VideoObject in de structured data (draai node work/video-meta.mjs)');
    return {};
  }
  return JSON.parse(fs.readFileSync(f, 'utf8'));
})();

// ---- css/js met contenthash --------------------------------------------------
// styles.css en app.js stonden op een vaste URL met max-age=3600. Bij een deploy
// kreeg een bezoeker dus nieuwe HTML met een uur oude CSS uit de Cloudflare-cache -
// en dan valt de opmaak half weg (de "Over Mike"-foto stond zo op 517x1095 in
// plaats van vierkant, met het halve gezin buiten beeld). Nu krijgt elk bestand
// zijn hash in de naam: nieuwe inhoud is een nieuwe URL, dus er valt niets te
// verversen. Oude hashbestanden worden per build opgeruimd.
function hashedAsset(name, ext) {
  const src = path.join(SITE, `${name}.${ext}`);
  const body = fs.readFileSync(src);
  const hash = crypto.createHash('sha256').update(body).digest('hex').slice(0, 10);
  for (const f of fs.readdirSync(SITE)) {
    if (new RegExp(`^${name}\\.[0-9a-f]{10}\\.${ext}$`).test(f)) fs.rmSync(path.join(SITE, f));
  }
  const out = `${name}.${hash}.${ext}`;
  fs.writeFileSync(path.join(SITE, out), body);
  return `/${out}`;
}
const CSS_URL = hashedAsset('styles', 'css');
const JS_URL = hashedAsset('app', 'js');

// ---- media index ------------------------------------------------------------
const files = fs.readdirSync(MEDIA).sort();
const byIdx = new Map();
for (const f of files) {
  const idx = parseInt(f.slice(0, 3), 10);
  byIdx.set(idx, { file: f, video: f.toLowerCase().endsWith('.mp4') });
}
// _media.json komt uit work/media.mjs: afmetingen NA het wegsnijden van watermerken
const mediaMeta = new Map(JSON.parse(fs.readFileSync(path.join(ROOT, '_media.json'), 'utf8')).map((d) => [d.base, d]));

function media(i) {
  const m = byIdx.get(i);
  if (!m) throw new Error(`geen media voor index ${i}`);
  const base = m.file.replace(/\.(mp4|jpg)$/i, '');
  const d = mediaMeta.get(base);
  if (!d) throw new Error(`geen afmetingen voor ${base} - draai eerst: node work/media.mjs`);
  return {
    i,
    base,
    video: m.video,
    videoSrc: m.video ? `/video/${m.file}` : null,
    w: d.w,
    h: d.h,
    portrait: d.h > d.w,
  };
}

// Welke indices horen bij welk project (galerij vult aan met de rest van de range)
const RANGES = {
  'houtlook-inloopdouche': r(0, 8),
  'marmerlook-met-ronde-spiegel': r(9, 20),
  'bruine-tegels-met-hexagon': [21, 22, 23, 24, 30, 34],
  'woonkamer-en-keuken': [25, 26, 27, 28, 29, 31, 32, 33, 35, 36, 37, 38, 39, 40],
  'travertijn-met-natuursteen-wastafel': r(41, 49),
  'badkamer-met-ligbad-metamorfose': r(50, 59),
  'leidingwerk-cv-en-techniek': [...r(60, 74), 131, 137],
  'chevron-met-messing': r(75, 90),
  'betonlook-met-zwart-staal': r(91, 104),
  'badkamer-met-betegelde-zitbank': r(105, 129),
  'patroontegels-in-de-douche': [132, 133, 134, 140, 141],
  'grijze-badkamer-houten-meubel': [136, 138, 143, 144, 147, 154, 155, 156, 157],
  toiletrenovaties: [135, 139, 142, 145, 146, 148, 149, 150, 151, 152, 153, 158, 159],
  'terrazzo-met-vrijstaand-bad': r(160, 182),
  'hexagon-badkamer-en-dakkapel': r(183, 219),
  'visgraat-badkamer-met-ligbad': [...r(220, 250), 252, 260],
};
function r(a, b) {
  return Array.from({ length: b - a + 1 }, (_, k) => a + k);
}

// Beelden die nergens op de site horen. Eerder werd hier per project handmatig
// omheen gewerkt (zie de opmerking bij hexagon), maar dan lekken ze alsnog via
// de bouwmap terug de pagina op -- precies wat er op de woonkamerpagina gebeurde.
// Nu een lijst die op elke plek geldt: kaart, hero, fase, oplevering en bouwmap.
const DROP = new Map([
  // Mike met de telefoon zichtbaar in de spiegel: leest als een kiekje, niet als
  // een opleverfoto. Van elk van deze ruimtes staat dezelfde hoek er schoon in.
  [22, 'fotograaf in de ronde spiegel'],
  [64, 'fotograaf in de spiegel'],
  [168, 'fotograaf in de spiegel'],
  [175, 'fotograaf in de spiegel'],
  [196, 'fotograaf in de spiegel'],
  [213, 'fotograaf in de spiegel'],
  [220, 'fotograaf in de spiegel'],
  [248, 'fotograaf in de spiegel'],
  [252, 'fotograaf in de spiegel'],
  // Geen projectfoto: hoort niet tussen de fases of de oplevering van de woonkamer.
  // Staat wél bewust bij "Over Mike" (zie OVER_IMG) - daar is het geen bewijs van
  // het werk maar het portret van de man zelf.
  [27, 'selfie met de klant, geen projectfoto (alleen bij Over Mike)'],
  // Vielen binnen de range van een klus waar ze niet bij horen.
  [38, 'badkamer uit een andere klus, viel in de woonkamer-range'],
  [224, 'dakwerk, hoort niet bij de visgraat-badkamer'],
]);
const kept = (i) => !DROP.has(i);

// Portret bij "Over Mike". Bewust een foto uit de DROP-lijst: 27 hoort niet tussen
// de opleverfotos van een project, maar het is het enige beeld waarop Mike samen met
// een klant staat. Sterker dan 213 (Mike alleen, met zijn telefoon in de spiegel).
const OVER_IMG = 27;

// ---- helpers ----------------------------------------------------------------
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// De voorinvulling van het appje staat in de taal van de pagina, dus dit is een
// functie en geen constante.
const waLink = () => `https://wa.me/${BIZ.waNumber}?text=${encodeURIComponent(L.waPrefill)}`;

// Beeld: webp-srcset met jpg-fallback. w/h van het bronbeeld, zodat er geen layout shift is.
function pic(m, { sizes, alt, cls = '', eager = false, full = false }) {
  const s = full ? 1600 : 900;
  const srcset = [480, 900, 1600]
    .filter((wd) => wd <= Math.max(480, m.w))
    .map((wd) => `/m/${m.base}-${wd}.webp ${wd}w`)
    .join(', ');
  const load = eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';
  return `<picture${cls ? ` class="${cls}"` : ''}>
    <source type="image/webp" srcset="${srcset}" sizes="${sizes}">
    <img src="/m/${m.base}-${s}.jpg" alt="${esc(alt)}" width="${m.w}" height="${m.h}" sizes="${sizes}" ${load}>
  </picture>`;
}

// Fotos staan in een zijwaartse rail op vaste hoogte, dus de breedte ligt rond
// de 400px op desktop en driekwart schermbreedte op mobiel.
const GRID_SIZES = '(min-width: 700px) 440px, 74vw';
const HERO_SIZES = '(min-width: 1000px) 46vw, 96vw';

// De hero krijgt op een telefoon een ander beeld dan op desktop. Dat is geen
// luxe: op desktop staat de foto als kaartje van 4/5 naast de tekst en zie je
// hem helemaal, op mobiel vult hij het scherm in verhouding 0,66 met de tekst
// eroverheen -- dan telt alleen de bovenste helft. Een foto die het ene doet,
// doet het andere zelden. De breekpuntgrens is 700px, gelijk aan de media query
// in styles.css.
const HERO_BP = '(max-width: 700px)';
const heroSrcset = (m) =>
  [480, 900, 1600]
    .filter((wd) => wd <= Math.max(480, m.w))
    .map((wd) => `/m/${m.base}-${wd}.webp ${wd}w`)
    .join(', ');
function heroPic(desk, mob, alt) {
  const set = heroSrcset;
  // Twee <source>-regels met media: de eerste die matcht wint, dus mobiel eerst.
  // De <img> houdt de desktopfoto als laatste vangnet. Eén alt voor allebei --
  // een screenreader hoort geen breekpunten en beide foto's zijn hetzelfde soort
  // beeld, dus twee beschrijvingen zouden alleen ruis toevoegen.
  return `<picture>
    <source media="${HERO_BP}" type="image/webp" srcset="${set(mob)}" sizes="${HERO_SIZES}">
    <source media="${HERO_BP}" srcset="/m/${mob.base}-900.jpg">
    <source type="image/webp" srcset="${set(desk)}" sizes="${HERO_SIZES}">
    <img src="/m/${desk.base}-900.jpg" alt="${esc(alt)}" width="${desk.w}" height="${desk.h}" sizes="${HERO_SIZES}" fetchpriority="high" decoding="async">
  </picture>`;
}

// Hero-video: dezelfde badkamer die zichzelf opbouwt, van kale bouwstaat naar
// opgeleverd. Het laatste frame is de echte herofoto (107), dus als de video
// uitgespeeld is staat er precies het beeld dat er zonder video ook stond -- de
// video vervangt zichzelf dus door de foto en er is geen sprong op het eind.
//
// Gemaakt met lightricks:ltx@2.5-pro (Runware, work/gen/video.mjs): eerste frame
// is een uit 107 gegenereerde kale bouwstaat (work/gen/bare.mjs), laatste frame
// 107 zelf, beide op exact dezelfde 9:16-uitsnede zodat de ruimte niet verspringt.
//
// Ligt boven de <picture>, niet in plaats daarvan: de foto blijft de LCP en het
// vangnet bij prefers-reduced-motion, geblokkeerde autoplay of een browser die
// het bestand niet trekt. Zonder `loop`, want een badkamer die zichzelf in een
// oneindige lus blijft slopen en herbouwen is een gif, geen hero.
// aria-hidden + tabindex=-1: puur decoratief, de alt van de foto dekt de inhoud.
function heroVideo() {
  return `<video class="hero-vid" playsinline muted autoplay preload="auto"
    poster="/poster/hero-build.jpg" aria-hidden="true" tabindex="-1" disablepictureinpicture>
    <source src="/video/hero-build.webm" type="video/webm">
    <source src="/video/hero-build.mp4" type="video/mp4">
  </video>`;
}

// `alt` is de omschrijving als er geen bijschrift is. De rails met opleverings- en
// bouwmapfoto's hebben er geen (43 van de 277 foto's droegen daardoor allemaal
// dezelfde tekst "Werk van MTS Badkamers"), dus geeft de aanroeper daar de
// projectnaam mee. Het blijft waar wat het is - een bouwfoto van dat project -
// zonder te doen alsof we weten wat er precies op staat.
function figure(m, caption, cls = '', alt = '') {
  const orient = m.portrait ? 'is-portrait' : 'is-land';
  const vid = m.video ? ' is-video' : '';
  const data = m.video
    ? `data-video="${m.videoSrc}" data-poster="/m/${m.base}-1600.jpg"`
    : `data-full="/m/${m.base}-1600.jpg"`;
  const label = caption || (m.video ? L.fig.video : L.fig.foto);
  return `<figure class="ph ${orient}${vid} ${cls}" ${data} tabindex="0" role="button" aria-label="${esc(label)}">
    ${pic(m, { sizes: GRID_SIZES, alt: caption || alt || L.fig.alt })}
    ${m.video ? '<span class="play" aria-hidden="true"></span>' : ''}
    ${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}
  </figure>`;
}

// Zijwaartse rail: fotos staan naast elkaar in plaats van onder elkaar, zodat een
// projectpagina niet uit kilometers verticaal scrollen bestaat. Swipen op mobiel,
// slepen/pijltjes op desktop. De rail bloedt door tot de schermrand, maar het eerste
// item lijnt uit met de tekst erboven (padding-inline in de CSS).
function railBlock(items, { label, kind = 'ph', cls = '' }) {
  // De knoppen staan in de voetregel, niet los boven de rail. Op een breed scherm
  // tilt de CSS ze eruit en legt ze over de foto's; op een telefoon blijven ze
  // eronder staan - anders vangen ze precies de veeg af die je rechts begint.
  return `<div class="rail-wrap reveal${cls ? ` ${cls}` : ''}" data-rail>
    <div class="rail rail-${kind}" tabindex="0" role="region" aria-label="${esc(label)}">
${items.join('\n')}
    </div>
    <div class="rail-foot">
      <span class="rail-hint"><span class="rail-hand" aria-hidden="true"></span>${esc(L.rail.hint)}</span>
      <span class="rail-count" aria-hidden="true"></span>
      <div class="rail-bar" aria-hidden="true"><i></i></div>
      <div class="rail-nav">
        <button class="rail-b rail-prev" type="button" aria-label="${esc(L.rail.prev)}" disabled>&#8249;</button>
        <button class="rail-b rail-next" type="button" aria-label="${esc(L.rail.next)}">&#8250;</button>
      </div>
    </div>
  </div>`;
}

// Vinkje voor de vertrouwensbadge. Stond hier eerder een sterrenbalk met de
// Werkspot-score (4,3 uit 7): op verzoek van de klant staat die score nergens
// meer op de site. De losse reviews blijven wel staan, die zeggen meer dan een
// gemiddelde over zeven beoordelingen.
function checkIcon(cls = '') {
  return `<svg class="chk ${cls}" viewBox="0 0 16 16" aria-hidden="true"><path d="M6.4 11.5 3.2 8.3l1.1-1.1 2.1 2.1 5-5 1.1 1.1z" fill="currentColor"/></svg>`;
}

// Sterrenrij bij een review. Alleen hele sterren: elke review die hier staat
// heeft op Werkspot 10 van de 10. Halve sterren zijn er dus bewust niet, die
// zouden alleen maar suggereren dat we een gemiddelde tekenen.
const STAR =
  'M8 1.2l2.06 4.18 4.61.67-3.34 3.25.79 4.6L8 11.72l-4.12 2.17.79-4.6L1.33 6.05l4.61-.67z';
function starRow(n) {
  if (!Number.isInteger(n) || n < 1 || n > 5) throw new Error(`starRow: ${n} is geen hele score 1-5`);
  const star = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="${STAR}"/></svg>`;
  return `<span class="stars" role="img" aria-label="${esc(fill(L.rev.stars, { n }))}">${star.repeat(n)}</span>`;
}

// Het Werkspot-logo, zoals het op werkspot.nl staat (site/werkspot.svg). Als
// <img> en niet inline: het is hun merk, dat hoort een los bestand te zijn dat
// je in een keer vervangt als zij het veranderen.
function werkspotLogo(cls = '') {
  return `<img class="ws-logo ${cls}" src="/werkspot.svg" width="237" height="32" alt="Werkspot" loading="lazy" decoding="async">`;
}

function head(title, desc, canonical, { ogImage, extraHead = '', ogType = 'website', robots = 'index, follow' } = {}) {
  const og = ogImage || `/m/${media(93).base}-1600.jpg`;
  // hreflang naar dezelfde pagina in elke taal, plus x-default op de NL-versie:
  // die staat op de root en is de versie waar Google op mag terugvallen.
  const alts = [
    ...LOCALES.map((l) => `<link rel="alternate" hreflang="${l}" href="${ORIGIN}${prefix(l)}${canonical}">`),
    `<link rel="alternate" hreflang="x-default" href="${ORIGIN}${canonical}">`,
  ].join('\n');
  return `<!DOCTYPE html>
<html lang="${HTML_LANG[LOC]}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${ORIGIN}${U(canonical)}">
${alts}
<meta name="theme-color" content="#111418">
<meta name="robots" content="${robots}">
<meta property="og:site_name" content="${esc(BIZ.name)}">
<meta property="og:locale" content="${OG_LOCALE[LOC]}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="${ogType}">
<meta property="og:url" content="${ORIGIN}${U(canonical)}">
<meta property="og:image" content="${ORIGIN}${og}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/icon.png">
<link rel="preload" href="/f/instrumentserif-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/f/satoshi-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${CSS_URL}">
${extraHead}
</head>
<body>
<a class="skip" href="#main">${esc(L.skip)}</a>
<div class="prog" id="prog" aria-hidden="true"><i></i></div>`;
}

// Het beeldmerk (bad, kraan, raam en waterlijn in een cirkel) is met potrace
// uit brand/logo-src.png getrokken en staat als kleurloze bron in
// brand/logo-mark.svg: de romp op currentColor, de kraan op var(--logo-teal).
// Het is een donker logo, dus juist die twee haken zijn nodig -- in de footer en
// op de hero staat hij op bijna zwart en zou een platte PNG wegvallen. Inline en
// niet als <img>, anders kan de kleur niet met de ondergrond meebewegen.
const LOGO_INNER = fs
  .readFileSync(path.join(ROOT, 'brand', 'logo-mark.svg'), 'utf8')
  .match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1]
  .trim();
const LOGO_VIEWBOX = fs
  .readFileSync(path.join(ROOT, 'brand', 'logo-mark.svg'), 'utf8')
  .match(/viewBox="([^"]+)"/)[1];

function logoMark(cls = '') {
  return `<svg class="brand-mark${cls}" viewBox="${LOGO_VIEWBOX}" aria-hidden="true" focusable="false">${LOGO_INNER}</svg>`;
}

// De naam op de bovenregel en de plaats eronder. Op de merkkaart stond
// M.TECHNO boven SERVICE, maar bij MTS BADKAMERS is dat tweede woord de naam
// zelf: die op de kleine onderregel zetten zou de merknaam halveren.
function brandLockup() {
  return `${logoMark()}<span class="brand-txt"><b>MTS BADKAMERS</b><i>${esc(BIZ.city)}</i></span>`;
}

// Taalwisselaar. Staat binnen #navLinks en dus in een keer op beide plekken:
// op desktop rechts in de balk, op mobiel bovenin het uitklapmenu. Een tweede
// exemplaar buiten het menu zou op mobiel naast de burger moeten passen, en daar
// is met de logo-lockup en de app-knop geen ruimte voor.
//
// Elke knop wijst naar dezelfde pagina in die taal (PATH), niet naar de
// homepage: wie een projectpagina leest wil die pagina in het Engels, niet het
// begin van de site.
function langSwitch() {
  const opts = LOCALES.map((l) => {
    const on = l === LOC;
    return `<a class="lang-o${on ? ' on' : ''}" href="${prefix(l)}${PATH}" hreflang="${l}" lang="${l}"${
      on ? ' aria-current="true"' : ''
    } title="${esc(LANG_NAME[l])}"><span class="lang-s">${LANG_SHORT[l]}</span><span class="lang-f">${esc(
      LANG_NAME[l],
    )}</span></a>`;
  }).join('');
  return `<div class="lang" role="group" aria-label="${esc(L.langLabel)}">${opts}</div>`;
}

function nav(active = '') {
  return `<header class="nav" id="nav">
  <div class="wrap nav-in">
    <a class="brand" href="${U('/')}" aria-label="${esc(L.brandAria)}">${brandLockup()}</a>
    <nav class="nav-links" id="navLinks" aria-label="${esc(L.mainMenu)}">
      <a href="${U('/werk/')}"${active === 'werk' ? ' class="on"' : ''}>${esc(L.nav.projecten)}</a>
      <a href="${U('/#voorna')}">${esc(L.nav.voorna)}</a>
      <a href="${U('/#diensten')}">${esc(L.nav.diensten)}</a>
      <a href="${U('/#werkwijze')}">${esc(L.nav.werkwijze)}</a>
      <a href="${U('/#reviews')}">${esc(L.nav.reviews)}</a>
      <a href="${U('/#faq')}">${esc(L.nav.faq)}</a>
      ${langSwitch()}
    </nav>
    <a class="btn btn-wa btn-sm nav-cta" href="${waLink()}" target="_blank" rel="noopener">
      ${waIcon()} <span>${esc(L.nav.cta)}</span>
    </a>
    <button class="burger" id="burger" aria-label="${esc(L.menu)}" aria-expanded="false" aria-controls="navLinks"><span></span><span></span></button>
  </div>
</header>`;
}

function waIcon() {
  return `<svg class="wa-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.06s.89 2.39 1.01 2.56c.12.16 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29z"/></svg>`;
}

// Contactblok met een formulier dat een WhatsApp-bericht opbouwt (geen backend nodig).
// Werkgebied met een kaart. Het was een dichtgeklapt FAQ-item ("in welke
// plaatsen werken jullie?"): goed voor de paginalengte, maar niemand klapte het
// open en de straal rond Apeldoorn zag je nergens. De kaart laat dat in een
// oogopslag zien; de plaatsnamen staan er nog gewoon als tekst onder, dus voor
// Google verandert er niets.
//
// De kaart laadt pas als de sectie in beeld komt (zie app.js): mapbox-gl is
// ~250 KB en dat hoort niet in het pad van de hero.
function mapSection() {
  const data = {
    token: MAPBOX_TOKEN,
    hq: HQ,
    // De ring is geen rijtijd-isochroon maar een cirkel op de kaart; het bijschrift
    // zegt daarom "ongeveer".
    ringKm: 30,
    places: AREA.flatMap((g, gi) =>
      g.places.filter((pl) => pl.n !== HQ.n).map((pl) => ({ n: pl.n, ll: pl.ll, g: gi })),
    ),
  };
  const cols = AREA.map(
    (g, gi) =>
      `<div class="area-col"><b>${esc(tArea(LOC, gi, g.h))}</b><p>${g.places
        .map((pl) => esc(pl.n))
        .join(', ')}</p></div>`,
  ).join('\n      ');
  return `<section class="map-sec" id="werkgebied">
  <div class="wrap map-grid reveal">
    <div class="map-txt">
      <h2>${esc(L.map.h)}</h2>
      <p>${esc(L.map.p)}</p>
      <p class="map-note">${esc(L.map.note)}</p>
    </div>
    <div class="map-box">
      <div class="map-canvas" id="map" aria-label="${esc(L.map.canvas)}" role="img"></div>
      <p class="map-fallback" id="mapFallback">${esc(fill(L.map.fallback, { km: data.ringKm }))}</p>
    </div>
  </div>
  <div class="wrap area-cols reveal">
      ${cols}
  </div>
  <script id="mapData" type="application/json">${JSON.stringify(data)}</script>
</section>`;
}

function contactBlock(kop, tekst) {
  return `<section class="sec sec-cta" id="contact">
  <div class="wrap cta-grid">
    <div class="cta-txt reveal">
      <h2>${esc(kop)}</h2>
      <p>${esc(tekst)}</p>
      <p class="cta-line">${L.cta.line}</p>
      <div class="cta-btns">
        <a class="btn btn-wa btn-lg" href="${waLink()}" target="_blank" rel="noopener">${waIcon()} <span>${esc(L.cta.app)}</span></a>
        <a class="btn btn-ghost-l" href="tel:+${BIZ.waNumber}">${esc(L.cta.bel)}</a>
      </div>
      <p class="cta-note">${esc(fill(L.cta.note, { kvk: BIZ.kvk }))}</p>
    </div>
    <form class="form reveal" id="waForm" novalidate>
      <p class="form-kop">${esc(L.form.kop)}</p>
      <div class="form-row">
        <label>${esc(L.form.naam)}<input type="text" name="naam" id="fNaam" autocomplete="name" placeholder="${esc(L.form.naamPh)}"></label>
        <label>${esc(L.form.plaats)}<input type="text" name="plaats" id="fPlaats" autocomplete="address-level2" placeholder="Apeldoorn"></label>
      </div>
      <div class="form-row">
        <label>${esc(L.form.klus)}
          <select name="klus" id="fKlus">
${L.form.klusOpts.map((o) => `            <option>${esc(o)}</option>`).join('\n')}
          </select>
        </label>
        <label>${esc(L.form.wanneer)}
          <select name="wanneer" id="fWanneer">
${L.form.wanneerOpts.map((o) => `            <option>${esc(o)}</option>`).join('\n')}
          </select>
        </label>
      </div>
      <label>${esc(L.form.plan)}<textarea name="bericht" id="fBericht" rows="2" placeholder="${esc(L.form.planPh)}"></textarea></label>
      <button class="btn btn-wa btn-lg form-go" type="submit">${waIcon()} <span>${esc(L.form.go)}</span></button>
      <p class="form-note" id="fNote" role="status">${esc(L.form.note)}</p>
    </form>
  </div>
</section>`;
}

// Meelopende CTA. Komt omhoog zodra de hero uit beeld is en duikt weer weg zodra
// je bij het contactblok bent aangekomen - daar staan dezelfde knoppen al.
function ctaDock(kop) {
  kop = kop || L.dock.home;
  return `<div class="dock" id="dock">
  <div class="dock-in">
    <div class="dock-txt">
      <b>${esc(kop)}</b>
      <span class="dock-sub">${checkIcon()} ${L.dock.sub}</span>
    </div>
    <div class="dock-btns">
      <a class="btn btn-wa dock-wa" href="${waLink()}" target="_blank" rel="noopener">${waIcon()} <span>${esc(L.cta.app)}</span></a>
      <a class="btn dock-tel" href="tel:+${BIZ.waNumber}"><svg class="wa-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2z"/></svg> <span>${esc(L.cta.bel)}</span></a>
    </div>
  </div>
</div>`;
}

function footer(dockKop) {
  const links = projects
    .slice(0, 4)
    .map((p) => `<a href="${U(`/werk/${p.slug}/`)}">${esc(tProject(LOC, p).title)}</a>`)
    .join('\n      ');
  return `<footer class="foot">
  <div class="wrap foot-in">
    <div>
      <span class="brand">${brandLockup()}</span>
      <p class="foot-sub">${esc(L.foot.sub)}</p>
      <a class="foot-wa" href="${waLink()}" target="_blank" rel="noopener">${waIcon()} ${BIZ.waDisplay}</a>
    </div>
    <div>
      <h4>${esc(L.foot.projecten)}</h4>
      ${links}
      <a class="foot-more" href="${U('/werk/')}">${esc(fill(L.foot.alle, { n: projects.length }))}</a>
    </div>
    <div>
      <h4>${esc(L.foot.diensten)}</h4>
${SERVICES.map((sv) => `      <a href="${U(`/${sv.slug}/`)}">${esc(tService(LOC, sv).title)}</a>`).join('\n')}
      <a href="${U('/#werkgebied')}">${esc(L.foot.werkgebied)}</a>
    </div>
    <div>
      <h4>${esc(L.foot.gegevens)}</h4>
      <p>${esc(L.foot.land)}</p>
      <p>KvK ${BIZ.kvk}</p>
      <p><a href="${BIZ.werkspot}" target="_blank" rel="noopener">${esc(L.foot.werkspot)}</a></p>
    </div>
  </div>
  <div class="wrap foot-bot">
    <span>&copy; 2026 ${esc(BIZ.name)}</span>
    <span>${esc(L.foot.handelsnaam)}</span>
    <span>KvK ${BIZ.kvk} &middot; Apeldoorn</span>
  </div>
</footer>
${ctaDock(dockKop)}
<div class="lb" id="lb" hidden role="dialog" aria-modal="true" aria-label="${esc(L.lb.title)}">
  <button class="lb-x" id="lb-x" aria-label="${esc(L.lb.close)}">&times;</button>
  <button class="lb-p" id="lb-p" aria-label="${esc(L.lb.prev)}">&#8249;</button>
  <button class="lb-n" id="lb-n" aria-label="${esc(L.lb.next)}">&#8250;</button>
  <div class="lb-stage" id="lb-stage"></div>
  <div class="lb-cap" id="lb-cap" aria-live="polite"></div>
</div>
<script id="i18n" type="application/json">${JSON.stringify({ msg: L.form.msg, note: L.form.note })}</script>
<script src="${JS_URL}" defer></script>
</body>
</html>`;
}

// ---- structured data --------------------------------------------------------
function ldBusiness() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
    '@id': `${ORIGIN}/#business`,
    name: BIZ.name,
    // De handelsnaam is wat de klant ziet; de inschrijving staat op de
    // statutaire naam. Beide in de structured data, anders matcht Google het
    // KvK-nummer niet met het bedrijf dat op de pagina staat.
    legalName: BIZ.legalName,
    alternateName: BIZ.legalName,
    description: L.ldDesc,
    url: `${ORIGIN}${U('/')}`,
    telephone: `+${BIZ.waNumber}`,
    image: `${ORIGIN}/m/${media(93).base}-1600.jpg`,
    address: { '@type': 'PostalAddress', addressLocality: 'Apeldoorn', addressCountry: 'NL' },
    // Zonder geo blijft een LocalBusiness een naam; hiermee hangt hij aan een
    // plek op de kaart. Coordinaten van de thuisbasis, gelijk aan HQ.
    geo: { '@type': 'GeoCoordinates', latitude: BIZ.geo.lat, longitude: BIZ.geo.lon },
    // De straal waarbinnen we komen. AREA is de lijst plaatsen, dit is de vorm
    // waarin Google een servicegebied verwacht van een bedrijf zonder winkel.
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: BIZ.geo.lat, longitude: BIZ.geo.lon },
      geoRadius: '30000',
    },
    logo: `${ORIGIN}/icon.png`,
    areaServed: AREA.flatMap((g) => g.places).map((p) => ({ '@type': 'City', name: p.n })),
    // Elk profiel dat hetzelfde bedrijf beschrijft. Lege regels vallen eruit, dus
    // een profiel toevoegen is een adres invullen in BIZ.profielen.
    sameAs: [BIZ.werkspot, ...Object.values(BIZ.profielen)].filter(Boolean),
    identifier: { '@type': 'PropertyValue', name: 'KvK', value: BIZ.kvk },
    // De laatste drie staan alleen in de structured data als Mike ze heeft
    // ingevuld. Een verzonnen openingstijd of prijsklasse is erger dan een leeg
    // veld: Google legt ze naast het bedrijfsprofiel en naast wat bezoekers
    // melden. buildAll waarschuwt zolang ze leeg zijn.
    ...(BIZ.email ? { email: BIZ.email } : {}),
    ...(BIZ.priceRange ? { priceRange: BIZ.priceRange } : {}),
    ...(BIZ.hours.length
      ? {
          openingHoursSpecification: BIZ.hours.map((h) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: h.dagen,
            opens: h.van,
            closes: h.tot,
          })),
        }
      : {}),
    // Bewust geen aggregateRating: de Werkspot-score staat op verzoek nergens
    // meer op de site, dus hij hoort ook niet in de structured data (Google zou
    // hem anders alsnog als sterren in de zoekresultaten tonen).
    makesOffer: L.ldOffers.map((n) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: n } })),
  };
}

function ldFaq() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f, i) => {
      const t = tFaq(LOC, i, f);
      return { '@type': 'Question', name: t.q, acceptedAnswer: { '@type': 'Answer', text: t.a } };
    }),
  };
}

function ldProject(p) {
  const t = tProject(LOC, p);
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: t.title,
    description: t.blurb,
    inLanguage: LOC,
    url: `${ORIGIN}${U(`/werk/${p.slug}/`)}`,
    image: `${ORIGIN}/m/${media(p.hero).base}-1600.jpg`,
    creator: { '@id': `${ORIGIN}/#business` },
    about: (t.tags || []).join(', '),
    // Wanneer deze pagina er kwam en wanneer hij voor het laatst veranderde.
    // Niet de datum van de verbouwing zelf: die is nergens vastgelegd, WhatsApp
    // haalt de EXIF uit elke foto. Zonder deze twee kan Google niet zien dat er
    // werk bij komt en blijft de hele map even oud.
    datePublished: BIZ.published,
    dateModified: LASTMOD.project,
  };
}

// Een VideoObject per video op de pagina.
//
// De video's staan als data-video in de HTML en worden pas door app.js ingeladen
// (16 bestanden van samen 83 MB vooraf laden zou de pagina slopen). Daardoor ziet
// een crawler ze niet: er staat geen <video>-element en dus ook geen video. Deze
// markup is wat dat gat dicht. Google leest contentUrl, thumbnailUrl en duration
// en kan de video dan als miniatuur in het zoekresultaat zetten.
//
// name/description komen uit het project waar de video bij hoort: een generieke
// omschrijving levert wel markup op maar geen resultaat.
function ldVideos(p, indices) {
  const t = tProject(LOC, p);
  return indices
    .map((i) => {
      const m = media(i);
      const meta = videoMeta[path.basename(m.videoSrc || '')];
      if (!meta) return null;
      return {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: fill(L.page.videoName, { titel: t.title }),
        description: `${t.blurb} ${L.page.videoP}`.trim(),
        inLanguage: LOC,
        thumbnailUrl: [`${ORIGIN}/m/${m.base}-900.jpg`, `${ORIGIN}/m/${m.base}-1600.jpg`],
        contentUrl: `${ORIGIN}${m.videoSrc}`,
        // uploadDate is verplicht. Dit is de dag dat de video op de site kwam,
        // niet de dag van de opname; dat laatste weet niemand meer.
        uploadDate: BIZ.published,
        duration: meta.duration,
        width: meta.w,
        height: meta.h,
        isFamilyFriendly: true,
        publisher: { '@id': `${ORIGIN}/#business` },
        // Zodat de video aan de pagina hangt waar hij op staat en niet als los
        // bestand in de index belandt.
        embedUrl: `${ORIGIN}${U(`/werk/${p.slug}/`)}#video`,
      };
    })
    .filter(Boolean);
}

function ldCrumbs(p) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: L.page.home, item: `${ORIGIN}${U('/')}` },
      { '@type': 'ListItem', position: 2, name: L.page.projecten, item: `${ORIGIN}${U('/werk/')}` },
      { '@type': 'ListItem', position: 3, name: tProject(LOC, p).title, item: `${ORIGIN}${U(`/werk/${p.slug}/`)}` },
    ],
  };
}

const ld = (...objs) =>
  objs.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');

// ---- project pages ----------------------------------------------------------
// Per project de video-indices die op de pagina terechtkwamen; buildExtras maakt
// er de videositemap van.
const videosPerProject = new Map();

function buildProject(p, prev, next) {
  PATH = `/werk/${p.slug}/`;
  const T = tProject(LOC, p);
  const Tprev = tProject(LOC, prev);
  const Tnext = tProject(LOC, next);
  const used = new Set();
  const mark = (i) => used.add(i);

  const hero = media(p.hero);
  mark(p.hero);

  const sections = (p.sections || [])
    .map((s, n) => {
      const imgs = (s.imgs || []).filter((x) => kept(x.i));
      (s.imgs || []).forEach((x) => mark(x.i));
      return `<section class="story">
  <div class="wrap story-in reveal">
    <div class="story-txt">
      <span class="story-n">${esc(fill(L.page.fase, { n: String(n + 1).padStart(2, '0') }))}</span>
      <h2>${esc(T.sections[n].h)}</h2>
      <p>${esc(T.sections[n].p)}</p>
    </div>
  </div>
  <div class="wrap">${railBlock(
    imgs.map((x) => figure(media(x.i), x.c)),
    { label: fill(L.page.faseLabel, { n: n + 1, h: T.sections[n].h }) },
  )}</div>
</section>`;
    })
    .join('\n');

  const results = (p.results || []).filter((x) => kept(x.i));
  (p.results || []).forEach((x) => mark(x.i));
  // Alt-teksten voor de rails zonder bijschrift. Per foto genummerd, zodat een
  // schermlezer twaalf foto's uit elkaar kan houden in plaats van twaalf keer
  // dezelfde regel te horen.
  const altVoor = (soort, n, van) => fill(L.fig.altProj, { soort, n, van, titel: T.title });
  const resultBlock = results.length
    ? `<section class="story story-result">
  <div class="wrap story-in reveal">
    <div class="story-txt">
      <span class="story-n">${esc(L.page.oplevering)}</span>
      <h2>${esc(L.page.resultH)}</h2>
      <p>${esc(L.page.resultP)}</p>
    </div>
  </div>
  <div class="wrap">${railBlock(
    results.map((x, n) => figure(media(x.i), x.c, '', altVoor(L.fig.soortOplevering, n + 1, results.length))),
    { label: L.page.resultLabel },
  )}</div>
</section>`
    : '';

  const vids = p.videos || [];
  vids.forEach((i) => mark(i));
  const videoBlock = vids.length
    ? `<section class="story" id="video">
  <div class="wrap story-in reveal">
    <div class="story-txt">
      <span class="story-n">${esc(L.page.video)}</span>
      <h2>${esc(L.page.videoH)}</h2>
      <p>${esc(L.page.videoP)}</p>
    </div>
  </div>
  <div class="wrap">${railBlock(
    vids.map((i, n) => figure(media(i), '', '', altVoor(L.fig.soortVideo, n + 1, vids.length))),
    { label: L.page.videoLabel, kind: 'vid' },
  )}</div>
</section>`
    : '';

  const range = RANGES[p.slug] || [];
  const rest = range.filter((i) => !used.has(i) && byIdx.has(i) && kept(i));
  const galleryBlock = rest.length
    ? `<section class="story" id="galerij">
  <div class="wrap story-in reveal">
    <div class="story-txt">
      <span class="story-n">${esc(L.page.bouwmap)}</span>
      <h2>${esc(L.page.galH)}</h2>
      <p>${esc(fill(L.page.galP, { n: rest.length }))}${rest.length >= 8 ? esc(L.page.galP2) : ''}</p>
    </div>
  </div>
  <div class="wrap">${railBlock(
    rest.map((i, n) => figure(media(i), '', '', altVoor(L.fig.soortBouw, n + 1, rest.length))),
    // Onder de acht restfotos is een tweede rij zonde: dan gewoon de grote strip.
    { label: fill(L.page.galLabel, { n: rest.length }), kind: rest.length >= 8 ? 'thumb' : 'ph' },
  )}</div>
</section>`
    : '';

  // Welke video's er werkelijk op deze pagina staan. Niet p.videos afgaan: dat
  // is de lijst voor het videoblok, maar er zitten ook video's in de fase- en
  // opleveringsrails en in de bouwmap, en drie indices in p.videos zijn in
  // werkelijkheid foto's. Alleen wat gerenderd is, mag in de structured data.
  const videoIdx = [...used, ...rest].filter((i) => byIdx.has(i) && byIdx.get(i).video && kept(i));

  const tags = (T.tags || []).map((t) => `<span>${esc(t)}</span>`).join('');
  const intro = (T.intro || []).map((t) => `<p>${esc(t)}</p>`).join('\n      ');
  const phases = (p.sections || []).length;
  const shots = range.filter((i) => byIdx.has(i) && kept(i)).length;

  const html = `${head(`${T.title} | ${L.page.titleSuffix}`, T.blurb, `/werk/${p.slug}/`, {
    ogImage: `/m/${hero.base}-1600.jpg`,
    // Een projectpagina is een artikel over een uitgevoerde klus, geen
    // website-startpunt. Met article leest een deelkaart hem ook als zodanig.
    ogType: 'article',
    extraHead: ld(ldProject(p), ldCrumbs(p), ...ldVideos(p, videoIdx)),
  })}
${nav('werk')}
<main id="main">
<article class="proj">
  <section class="p-hero">
    <div class="wrap p-hero-grid">
      <div class="p-hero-txt">
        <nav class="crumbs" aria-label="${esc(L.page.crumbs)}">
          <a href="${U('/')}">${esc(L.page.home)}</a><span>/</span><a href="${U('/werk/')}">${esc(
            L.page.projecten,
          )}</a><span>/</span><b>${esc(T.title)}</b>
        </nav>
        <h1>${esc(T.title)}</h1>
        <p class="p-lead">${esc(T.blurb)}</p>
        <div class="chips">${tags}</div>
        <dl class="p-meta">
          <div><dt>${esc(L.page.plaats)}</dt><dd>${esc(L.page.plaatsVal)}</dd></div>
          ${phases ? `<div><dt>${esc(L.page.fases)}</dt><dd>${phases}</dd></div>` : ''}
          <div><dt>${L.page.fotos}</dt><dd>${shots}</dd></div>
        </dl>
      </div>
      <figure class="p-hero-art">
        ${pic(hero, { sizes: '(min-width: 1000px) 46vw, 92vw', alt: T.title, eager: true, full: true })}
      </figure>
    </div>
  </section>

  <section class="sec p-intro">
    <div class="wrap reveal">
      <div class="story-in intro-txt">
      ${intro}
      </div>
    </div>
  </section>

${sections}
${resultBlock}
${videoBlock}
${galleryBlock}

  <section class="sec p-nav-sec">
    <div class="wrap p-nav">
      <a class="p-nav-l" href="${U(`/werk/${prev.slug}/`)}"><span>${esc(L.page.prev)}</span><b>${esc(
        Tprev.title,
      )}</b></a>
      <a class="p-nav-c" href="${U('/werk/')}">${esc(L.page.all)}</a>
      <a class="p-nav-r" href="${U(`/werk/${next.slug}/`)}"><span>${esc(L.page.next)}</span><b>${esc(
        Tnext.title,
      )}</b></a>
    </div>
  </section>
</article>

${contactBlock(L.cta.projKop, L.cta.projTxt)}
</main>
${footer(L.dock.proj)}`;

  const dir = path.join(outDir(), 'werk', p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  // videoIdx gaat mee terug: de videositemap moet precies dezelfde lijst
  // aanmelden als de pagina zelf beschrijft, anders meldt hij bestanden aan die
  // nergens op de site staan.
  videosPerProject.set(p.slug, videoIdx);
  return { rest: rest.length, used: used.size };
}

// ---- home -------------------------------------------------------------------
function buildHome() {
  PATH = '/';
  // Hero, en die is per breekpunt anders (zie heroPic).
  //
  // Desktop (107): de foto staat als kaartje van 4/5 naast de tekst en je ziet hem
  // helemaal. 107 is dan de rustigste van het stel -- ronde spiegel, zwevend blad,
  // niets op de vloer.
  //
  // Mobiel (48): daar vult de foto het scherm in verhouding 0,66 tegen de 0,75 van
  // het beeld, dus de browser toont de volle hoogte en snijdt links en rechts bij,
  // en de onderste helft verdwijnt achter de tekst. Alleen de bovenste helft telt.
  // 107 is daar juist zwak: die bovenste helft is egale beige wand, geen contrast
  // en geen diepte.
  //
  // Stond op 210 (roze hexagon met een raam erin). Die had wel kleur, maar de
  // grootste vlakken in de bovenste helft waren de glazen douchedeur en de
  // bakstenen zijgevel van de buren -- je keek de badkamer dus dwars door een
  // deur heen in en het beeld las als "foto door een ruit". 48 is dezelfde
  // spiegelwand als 107 maar dan van verder weg: de volle halo van de ronde
  // spiegel, de natuurstenen wasbak op het donkere meubel en de inloopdouche
  // erin weerspiegeld -- allemaal in de bovenste helft, warm licht, geen glas
  // ertussen. 44 viel af (spiegel loopt boven en links het beeld uit), 45 omdat
  // de witte radiator een derde van het kader inneemt, 7 omdat het te donker is.
  //
  // Gekozen met work/heromob-try.mjs: dat zet elke kandidaat echt in de pagina en
  // schiet hem op een iPhone, in plaats van hem op een contactvel te beoordelen.
  // (work/hero-try.mjs doet hetzelfde voor de desktopfoto, work/heromob-sheet2.mjs
  // zet een hele reeks als mobiele uitsnede naast elkaar, verloop en al.)
  const heroA = media(107);
  const heroMob = media(48);

  const cards = projects.map((p, n) => {
    const m = media(p.card);
    const T = tProject(LOC, p);
    return `<a class="card" href="${U(`/werk/${p.slug}/`)}">
      <div class="card-img">${pic(m, { sizes: '(min-width: 700px) 380px, 78vw', alt: T.title })}<span class="card-n">${String(n + 1).padStart(2, '0')}</span></div>
      <div class="card-txt">
        <span class="card-kick">${esc(T.kicker)}</span>
        <h3>${esc(T.title)}</h3>
        <p>${esc(T.blurb)}</p>
        <span class="card-go">${esc(L.proj.go)} &rarr;</span>
      </div>
    </a>`;
  });

  // Voor & na: bewust alleen paren uit dezelfde ruimte, met vergelijkbaar standpunt.
  const baTabs = BA.map(
    (b, i) => `<button class="ba-tab${i === 0 ? ' on' : ''}" type="button" role="tab" aria-selected="${i === 0}" data-ba="${i}">${esc(tBa(LOC, i, b).tab)}</button>`,
  ).join('');
  const baData = BA.map((b, i) => ({
    voor: `/m/${media(b.voor).base}-1600.jpg`,
    voorW: `/m/${media(b.voor).base}-900.webp`,
    na: `/m/${media(b.na).base}-1600.jpg`,
    naW: `/m/${media(b.na).base}-900.webp`,
    cap: tBa(LOC, i, b).cap,
    slug: U(`/werk/${b.slug}/`),
    title: tBa(LOC, i, b).tab,
  }));
  const first = baData[0];

  const faq = FAQ.map((f, i) => {
    const t = tFaq(LOC, i, f);
    return `<details class="fq">
        <summary><span>${esc(t.q)}</span></summary>
        <div class="fq-a"><p>${esc(t.a)}</p></div>
      </details>`;
  }).join('\n');

  // Diensten: titel plus een halve regel. De omschrijving valt op een telefoon weg,
  // de titels zeggen het al.
  const SVC = L.svc.map(([t, d]) => `<li><b>${t}</b><span>${esc(d)}</span></li>`).join('\n');

  const STEPS = L.steps
    .map(([t, d], i) => `<li><span class="n">${String(i + 1).padStart(2, '0')}</span><div><h3>${t}</h3><p>${esc(d)}</p></div></li>`)
    .join('\n');

  // Reviews in de vorm waarin ze op Werkspot staan: sterren, datum, naam en het
  // logo erboven. Als los citaat op een donkere kaart lazen ze als tekst die wij
  // zelf hadden opgeschreven.
  //
  // De vijf sterren zijn geen opsmuk. Werkspot werkt met een schaal van 10 en
  // deze drie staan er alle drie op 10 van de 10 (uit het profiel gehaald, zie
  // work/reviews.json). Het gemiddelde over alle zeven staat er op verzoek van
  // de klant nergens meer op; de score van een losse review is iets anders dan
  // die aggregatie en mag dus wel.
  const revRail = railBlock(
    REVIEWS.map(
      (r0, ri) => { const r = tReview(LOC, ri, r0); return `<blockquote class="rev">
        <div class="rev-top">
          ${starRow(r.stars)}
          <span class="rev-date">${esc(r.d)}</span>
        </div>
        <p>${esc(r.t)}</p>
        <footer class="rev-by">
          <span class="rev-av" aria-hidden="true">${esc(r.n.slice(0, 1))}</span>
          <cite>${esc(r.n)}<i class="rev-verif">${checkIcon()} ${esc(L.rev.verified)}</i></cite>
        </footer>
      </blockquote>`; },
    ),
    { label: L.rev.railLabel, kind: 'rev' },
  );

  const html = `${head(
    L.homeTitle,
    L.homeDesc,
    '/',
    {
      // Preload per breekpunt, anders haalt een telefoon de desktopfoto op en
      // daarna alsnog de mobiele: twee downloads en een LCP die te laat komt.
      // De preload moet exact dezelfde kandidaten en sizes aanbieden als de
      // <source> in heroPic. Bied je er minder aan, dan kiest de preload een
      // andere breedte dan het beeld zelf en haalt de browser hem twee keer op.
      extraHead: `<link rel="preload" as="image" media="${HERO_BP}" imagesrcset="${heroSrcset(heroMob)}" imagesizes="${HERO_SIZES}" type="image/webp" fetchpriority="high">
<link rel="preload" as="image" media="(min-width: 701px)" imagesrcset="${heroSrcset(heroA)}" imagesizes="${HERO_SIZES}" type="image/webp" fetchpriority="high">
${ld(ldBusiness(), ldFaq())}`,
    },
  )}
${nav()}
<main id="main">

<section class="hero" id="top">
  <div class="wrap hero-grid">
    <!-- Volgorde in de DOM is de desktopvolgorde. Op mobiel schuift de trust-chip
         met flex-order naar onder de knoppen: daar staat hij naast de handeling
         (bewijs pal naast de knop) in plaats van middenin de foto, waar hij een
         hele regel kostte en het beeld doorsneed. Hier stond eerder de
         Werkspot-score; die is eruit, en herhalen wat de strip eronder al zegt
         (geverifieerd, KvK) heeft geen zin - dus staat er nu de belofte die
         hoort bij de knop ernaast. -->
    <div class="hero-txt">
      <div class="trust-chip">
        ${checkIcon()}
        <span>${esc(L.hero.chip)}</span>
      </div>
      <!-- Kicker: zegt in vier woorden wat we doen en waar. Stond er niet, en de
           kop alleen ("een badkamer die klopt") vertelt niet dat dit een bedrijf
           uit Apeldoorn is. Tegelijk de sterkste lokale zoekterm, in de h1-omgeving. -->
      <p class="hero-kick">${esc(L.hero.kick)}</p>
      <h1>${esc(L.hero.h1)}</h1>
      <!-- Twee varianten van dezelfde belofte: op een telefoon staat deze tekst
           over de foto en telt elke regel, dus daar de korte. Beide noemen nu
           hetzelfde harde punt -- alles door één man, vaste prijs vooraf -- in
           plaats van alleen te herhalen wat de kop al zegt. -->
      <p class="hero-sub"><span class="only-wide">${esc(L.hero.subWide)}</span><span class="only-narrow">${esc(L.hero.subNarrow)}</span></p>
      <div class="hero-cta">
        <a class="btn btn-wa btn-lg" href="${waLink()}" target="_blank" rel="noopener">${waIcon()} <span>${esc(L.hero.cta1)}<i class="only-wide">: ${BIZ.waDisplay}</i></span></a>
        <a class="btn btn-ghost" href="#projecten">${esc(L.hero.cta2)}</a>
      </div>
    </div>
    <div class="hero-art">
      <!-- Eén opgeleverde badkamer, verder niks. De hero had een sleepbare voor/na,
           maar die vraagt een handeling voordat je weet wat je ziet en hij liet in
           rust vooral de oude badkamer zien. Vergelijken doe je bij Voor & na. -->
      <figure class="hero-a">
        <div class="hero-shot">
          ${heroPic(heroA, heroMob, L.hero.alt)}
          ${heroVideo()}
        </div>
        <!-- Bijschrift hoort bij de desktopfoto (107) en staat op mobiel uit
             (.hero-cap display:none), waar een ander beeld geladen wordt. Blijft
             bij wat er te zien is: geen materiaalclaims die we niet kunnen aflezen. -->
        <figcaption class="hero-cap">${esc(L.hero.cap)}</figcaption>
      </figure>
    </div>
  </div>
  <div class="hero-strip">
    <div class="wrap strip-in">
${L.hero.strip.map((t) => `      <span>${esc(fill(t, { kvk: BIZ.kvk }))}</span>`).join('\n')}
    </div>
  </div>
</section>

<section class="sec sec-alt" id="projecten">
  <div class="wrap sec-head reveal">
    <h2 class="sec-h">${esc(L.proj.h)}</h2>
    <p class="sec-lead">${esc(fill(L.proj.lead, { n: projects.length }))}</p>
  </div>
  <div class="wrap">${railBlock(cards, { label: fill(L.proj.railLabel, { n: projects.length }), kind: 'card' })}</div>
</section>

<section class="sec sec-dark ba-sec" id="voorna">
  <div class="wrap ba-head reveal">
    <h2>${esc(L.ba.h)}</h2>
    <p>${esc(L.ba.lead)}</p>
  </div>
  <div class="wrap">
    <div class="ba-tabs reveal" role="tablist" aria-label="${esc(L.ba.tablist)}">${baTabs}</div>
    <div class="ba reveal" id="ba">
      <div class="ba-stage">
        <img class="ba-img ba-voor" id="baVoor" src="${first.voor}" alt="${esc(L.ba.altVoor)}" loading="lazy" decoding="async">
        <img class="ba-img ba-na" id="baNa" src="${first.na}" alt="${esc(L.ba.altNa)}" loading="lazy" decoding="async">
        <!-- Geen VOOR/NA-label op de helften meer. De "na" schuift van links naar
             rechts over de oude foto heen (knop naar links = de oude badkamer, naar
             rechts = klaar). Daarmee is de linkerhelft tijdens het slepen per
             definitie de nieuwe badkamer: een VOOR-label linksboven zou dus liegen,
             en een NA-label linksboven leest als "de slider staat omgekeerd".
             Beide varianten zijn hier langsgekomen en beide voelden fout. De
             richting staat nu waar hij hoort -- op de schuifbalk zelf: Voor aan het
             linker uiteinde, Na aan het rechter. Dat is de as, niet de helft. -->
        <span class="ba-div" aria-hidden="true"></span>
      </div>
      <div class="ba-ctrl">
        <h3 class="ba-title" id="baTitle">${esc(first.title)}</h3>
        <p class="ba-cap" id="baCap">${esc(first.cap)}</p>
        <label class="ba-slide">
          <span class="ba-slide-lbl"><b>&larr; ${esc(L.ba.voor)}</b><b>${esc(L.ba.na)} &rarr;</b></span>
          <input type="range" min="0" max="100" value="55" id="baRange" aria-label="${esc(L.ba.range)}">
          <span class="ba-hint">${esc(L.ba.hint)}</span>
        </label>
        <a class="ba-link" id="baLink" href="${first.slug}">${esc(L.ba.link)} &rarr;</a>
      </div>
    </div>
  </div>
  <script id="baData" type="application/json">${JSON.stringify(baData)}</script>
</section>

<section class="sec sec-alt" id="reviews">
  <div class="wrap sec-head reveal">
    <div>
      <div class="rev-head">${werkspotLogo()}</div>
      <h2 class="sec-h">${esc(L.rev.h)}</h2>
    </div>
    <p class="sec-lead">${esc(L.rev.lead)}
      <a href="${BIZ.werkspot}" target="_blank" rel="noopener">${esc(L.rev.all)}</a></p>
  </div>
  <div class="wrap">${revRail}</div>
</section>

<section class="sec" id="over">
  <div class="wrap grid-2 wide-gap va-center reveal">
    <figure class="over-img">${pic(media(OVER_IMG), { sizes: '(min-width: 1000px) 44vw, 92vw', alt: L.over.imgAlt })}
      <figcaption>${esc(L.over.imgCap)}</figcaption></figure>
    <div>
      <h2>${esc(L.over.h)}</h2>
      <p>${esc(L.over.p)}</p>
      <div class="facts">
        <div><b>${projects.length}</b><span>${esc(L.over.facts[0])}</span></div>
        <div><b>1</b><span>${esc(L.over.facts[1])}</span></div>
        <div><b>${esc(L.over.factCity)}</b><span>${esc(L.over.facts[2])}</span></div>
      </div>
    </div>
  </div>
</section>

<section class="sec sec-alt" id="diensten">
  <div class="wrap grid-2 wide-gap">
    <div class="reveal">
      <h2>${esc(L.svcH)}</h2>
      <ul class="svc-l">
${SVC}
      </ul>
    </div>
    <div class="reveal" id="werkwijze">
      <h2>${esc(L.stepsH)}</h2>
      <ol class="steps">
${STEPS}
      </ol>
    </div>
  </div>
</section>

<section class="sec faq-sec" id="faq">
  <div class="wrap grid-2 wide-gap">
    <div class="faq-head reveal">
      <h2>${esc(L.faq.h)}</h2>
      <p>${esc(L.faq.p)}</p>
      <a class="btn btn-wa btn-sm" href="${waLink()}" target="_blank" rel="noopener">${waIcon()} <span>${esc(L.faq.btn)}</span></a>
    </div>
    <div class="faq reveal">
${faq}
    </div>
  </div>
</section>

${mapSection()}

${contactBlock(L.cta.homeKop, L.cta.homeTxt)}
</main>
${footer()}`;

  fs.mkdirSync(outDir(), { recursive: true });
  fs.writeFileSync(path.join(outDir(), 'index.html'), html);
}

// ---- 404, robots, sitemap, favicon -----------------------------------------
// ---- /werk/ : de projecthub --------------------------------------------------
// Deze map bestond niet als pagina. De zestien projecten hingen eronder en het
// adres zelf gaf een 404: elke gedeelde of geraden link naar /werk/ liep dood en
// er was geen pagina die de projecten aan elkaar knoopte, alleen een anker op de
// home. Nu is het de hub waar de nav, het kruimelpad en de footer naartoe wijzen.
function buildWerkHub() {
  PATH = '/werk/';
  const n = projects.length;

  const cards = projects.map((p, i) => {
    const m = media(p.card);
    const T = tProject(LOC, p);
    return `<a class="card" href="${U(`/werk/${p.slug}/`)}">
      <div class="card-img">${pic(m, { sizes: '(min-width: 700px) 380px, 78vw', alt: T.title })}<span class="card-n">${String(i + 1).padStart(2, '0')}</span></div>
      <div class="card-txt">
        <span class="card-kick">${esc(T.kicker)}</span>
        <h3>${esc(T.title)}</h3>
        <p>${esc(T.blurb)}</p>
        <span class="card-go">${esc(L.proj.go)} &rarr;</span>
      </div>
    </a>`;
  });

  // Tellen wat er werkelijk staat, niet wat we denken dat er staat: de aantallen
  // schuiven mee zodra er een project of een reeks foto's bij komt.
  const fotos = new Set();
  let videos = 0;
  for (const p of projects) {
    for (const i of RANGES[p.slug] || []) if (byIdx.has(i) && kept(i)) fotos.add(i);
    // videosPerProject en niet p.videos: dat laatste is de lijst voor het
    // videoblok en klopt niet als telling (drie indices erin zijn foto's, en er
    // staan video's in de fase- en opleveringsrails die er niet in staan).
    // buildProject vult de map, en die draait voor deze pagina.
    videos += (videosPerProject.get(p.slug) || []).length;
  }

  const svcKaarten = SERVICES.map((sv) => {
    const S = tService(LOC, sv);
    return `<a class="svc-card" href="${U(`/${sv.slug}/`)}">
      <span class="svc-kick">${esc(S.kicker)}</span>
      <h3>${esc(S.title)}</h3>
      <p>${esc(S.lead)}</p>
      <span class="card-go">${esc(L.proj.go)} &rarr;</span>
    </a>`;
  }).join('\n      ');

  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: L.page.home, item: `${ORIGIN}${U('/')}` },
      { '@type': 'ListItem', position: 2, name: L.page.projecten, item: `${ORIGIN}${U('/werk/')}` },
    ],
  };
  // Een ItemList met alle zestien: dit is een overzichtspagina, en zo leest
  // Google hem ook als een lijst in plaats van als zestien losse links.
  const lijst = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: fill(L.hub.h1, { n }),
    numberOfItems: n,
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${ORIGIN}${U(`/werk/${p.slug}/`)}`,
      name: tProject(LOC, p).title,
    })),
  };

  // Dezelfde opleverfoto die de site als deelbeeld gebruikt: dit is de pagina
  // die het werk als geheel moet verkopen.
  const heroHub = media(93);
  const html = `${head(fill(L.hub.title, { n }), fill(L.hub.desc, { n }), '/werk/', {
    ogImage: `/m/${heroHub.base}-1600.jpg`,
    extraHead: ld(crumbs, lijst),
  })}
${nav('werk')}
<main id="main">
<article class="proj">
  <section class="p-hero">
    <div class="wrap p-hero-grid">
      <div class="p-hero-txt">
        <nav class="crumbs" aria-label="${esc(L.page.crumbs)}">
          <a href="${U('/')}">${esc(L.page.home)}</a><span>/</span><b>${esc(L.page.projecten)}</b>
        </nav>
        <span class="eyebrow eyebrow-l">${esc(L.hub.kick)}</span>
        <h1>${esc(fill(L.hub.h1, { n }))}</h1>
        <p class="p-lead">${esc(L.hub.lead)}</p>
        <dl class="p-meta">
          <div><dt>${esc(L.hub.statP)}</dt><dd>${n}</dd></div>
          <div><dt>${esc(L.hub.statF)}</dt><dd>${fotos.size}</dd></div>
          <div><dt>${esc(L.hub.statV)}</dt><dd>${videos}</dd></div>
        </dl>
      </div>
      <figure class="p-hero-art">
        ${pic(heroHub, { sizes: '(min-width: 1000px) 46vw, 92vw', alt: L.hero.alt, eager: true, full: true })}
      </figure>
    </div>
  </section>

  <section class="sec p-intro">
    <div class="wrap reveal">
      <div class="story-in intro-txt">
      ${L.hub.intro.map((t) => `<p>${esc(t)}</p>`).join('\n      ')}
      </div>
    </div>
  </section>

<section class="sec sec-alt" id="projecten">
  <div class="wrap">${railBlock(cards, { label: fill(L.proj.railLabel, { n }), kind: 'card' })}</div>
</section>

<section class="sec" id="diensten">
  <div class="wrap sec-head reveal">
    <h2 class="sec-h">${esc(L.hub.svcH)}</h2>
    <p class="sec-lead">${esc(L.hub.svcLead)}</p>
  </div>
  <div class="wrap svc-cards">
      ${svcKaarten}
  </div>
</section>
</article>

${contactBlock(L.cta.projKop, L.cta.projTxt)}
</main>
${footer(L.dock.proj)}`;

  const dir = path.join(outDir(), 'werk');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

// ---- dienstenpagina's --------------------------------------------------------
// De home moest in haar eentje scoren op badkamerrenovatie, toiletrenovatie,
// tegelwerk en loodgieterswerk tegelijk, met een lijstje van tien regels als
// enige tekst per dienst. Deze vier pagina's zijn de landingspagina per dienst:
// wat er onder valt, welke uitgevoerde klussen het bewijs zijn, en de vragen die
// juist bij deze klus horen. De secties op de home blijven staan en linken hier
// naartoe.
function buildService(sv) {
  PATH = `/${sv.slug}/`;
  const S = tService(LOC, sv);
  const hero = media(sv.hero);

  const omvat = S.omvat
    .map(([kop, tekst]) => `<li><b>${kop}</b><span>${esc(tekst)}</span></li>`)
    .join('\n      ');

  const eigen = sv.projects.map((slug) => projects.find((p) => p.slug === slug));
  const kaarten = eigen.map((p) => {
    const m = media(p.card);
    const T = tProject(LOC, p);
    return `<a class="card" href="${U(`/werk/${p.slug}/`)}">
      <div class="card-img">${pic(m, { sizes: '(min-width: 700px) 380px, 78vw', alt: T.title })}</div>
      <div class="card-txt">
        <span class="card-kick">${esc(T.kicker)}</span>
        <h3>${esc(T.title)}</h3>
        <p>${esc(T.blurb)}</p>
        <span class="card-go">${esc(L.proj.go)} &rarr;</span>
      </div>
    </a>`;
  });

  // Zelfde markup als de FAQ op de home (.fq / .fq-a), zodat er geen tweede
  // uitklapper met eigen opmaak naast komt te staan.
  const vragen = sv.faq
    .map((i) => {
      const t = tFaq(LOC, i, FAQ[i]);
      return `<details class="fq">
        <summary><span>${esc(t.q)}</span></summary>
        <div class="fq-a"><p>${esc(t.a)}</p></div>
      </details>`;
    })
    .join('\n      ');

  const andere = SERVICES.filter((x) => x.slug !== sv.slug)
    .map((x) => `<a href="${U(`/${x.slug}/`)}">${esc(tService(LOC, x).title)}</a>`)
    .join('\n      ');

  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: L.page.home, item: `${ORIGIN}${U('/')}` },
      { '@type': 'ListItem', position: 2, name: L.svcPage.crumbs, item: `${ORIGIN}${U('/')}#diensten` },
      { '@type': 'ListItem', position: 3, name: S.title, item: `${ORIGIN}${U(`/${sv.slug}/`)}` },
    ],
  };
  // Een Service die aan het bedrijf hangt, met het gebied waarin hij geleverd
  // wordt. Dit is de vorm waarin Google een dienst van een lokaal bedrijf leest;
  // de losse Offer-regels in de LocalBusiness op de home blijven daarnaast staan.
  const dienst = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: S.title,
    description: S.desc,
    inLanguage: LOC,
    url: `${ORIGIN}${U(`/${sv.slug}/`)}`,
    serviceType: S.kicker,
    provider: { '@id': `${ORIGIN}/#business` },
    areaServed: AREA.flatMap((g) => g.places).map((p) => ({ '@type': 'City', name: p.n })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: S.title,
      itemListElement: S.omvat.map(([kop]) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: kop.replace(/&amp;/g, '&') },
      })),
    },
  };
  // Alleen de vragen die op deze pagina staan; een FAQPage met vragen die er niet
  // staan is precies wat Google als misleidend aanmerkt.
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: sv.faq.map((i) => {
      const t = tFaq(LOC, i, FAQ[i]);
      return { '@type': 'Question', name: t.q, acceptedAnswer: { '@type': 'Answer', text: t.a } };
    }),
  };

  const html = `${head(`${S.title} | ${BIZ.name}`, S.desc, `/${sv.slug}/`, {
    ogImage: `/m/${hero.base}-1600.jpg`,
    extraHead: ld(crumbs, dienst, faqLd),
  })}
${nav('diensten')}
<main id="main">
<article class="proj">
  <section class="p-hero">
    <div class="wrap p-hero-grid">
      <div class="p-hero-txt">
        <nav class="crumbs" aria-label="${esc(L.page.crumbs)}">
          <a href="${U('/')}">${esc(L.page.home)}</a><span>/</span><b>${esc(S.title)}</b>
        </nav>
        <span class="eyebrow eyebrow-l">${esc(S.kicker)}</span>
        <h1>${esc(S.h1)}</h1>
        <p class="p-lead">${esc(S.lead)}</p>
        <div class="hero-cta">
          <a class="btn btn-wa" href="${waLink()}" target="_blank" rel="noopener">${waIcon()} <span>${esc(L.hero.cta1)}</span></a>
          <a class="btn btn-ghost" href="#werk">${esc(L.svcPage.werkH)}</a>
        </div>
        <dl class="p-meta">
          <div><dt>${esc(L.page.plaats)}</dt><dd>${esc(L.page.plaatsVal)}</dd></div>
          <div><dt>${esc(L.hub.statP)}</dt><dd>${eigen.length}</dd></div>
        </dl>
      </div>
      <figure class="p-hero-art">
        ${pic(hero, { sizes: '(min-width: 1000px) 46vw, 92vw', alt: S.h1, eager: true, full: true })}
      </figure>
    </div>
  </section>

  <section class="sec p-intro">
    <div class="wrap reveal">
      <div class="story-in intro-txt">
      ${S.intro.map((t) => `<p>${esc(t)}</p>`).join('\n      ')}
      </div>
    </div>
  </section>

  <section class="sec sec-alt">
    <div class="wrap sec-head reveal">
      <h2 class="sec-h">${esc(L.svcPage.omvatH)}</h2>
    </div>
    <div class="wrap">
      <ul class="svc-l svc-l-wide">
      ${omvat}
      </ul>
      <p class="svc-slot">${esc(S.slot)}</p>
    </div>
  </section>

  <section class="sec" id="werk">
    <div class="wrap sec-head reveal">
      <h2 class="sec-h">${esc(L.svcPage.werkH)}</h2>
      <p class="sec-lead">${esc(L.svcPage.werkLead)}</p>
    </div>
    <div class="wrap">${railBlock(kaarten, { label: L.svcPage.werkH, kind: 'card' })}</div>
    <div class="wrap"><a class="foot-more" href="${U('/werk/')}">${esc(L.svcPage.alleWerk)} &rarr;</a></div>
  </section>

  <section class="sec sec-alt" id="vragen">
    <div class="wrap sec-head reveal">
      <h2 class="sec-h">${esc(L.svcPage.faqH)}</h2>
    </div>
    <div class="wrap faq">
      ${vragen}
    </div>
  </section>

  <section class="sec p-nav-sec">
    <div class="wrap">
      <h2 class="sec-h">${esc(L.svcPage.andere)}</h2>
      <div class="svc-other">
      ${andere}
      </div>
    </div>
  </section>
</article>

${contactBlock(L.cta.homeKop, L.cta.homeTxt)}
</main>
${footer(L.dock.proj)}`;

  const dir = path.join(outDir(), sv.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

function buildExtras() {
  PATH = '/404.html';
  // De foutpagina hoort niet in de index: hij stond op index,follow en kon dus
  // als lege pagina in de zoekresultaten belanden.
  const html404 = `${head(L.nf.title, L.nf.desc, '/404.html', { robots: 'noindex, follow' })}
${nav()}
<main id="main">
<section class="sec nf">
  <div class="wrap">

    <h1>${esc(L.nf.h1)}</h1>
    <p>${esc(L.nf.p)}</p>
    <div class="hero-cta">
      <a class="btn" href="${U('/werk/')}">${esc(L.nf.btn)}</a>
      <a class="btn btn-wa" href="${waLink()}" target="_blank" rel="noopener">${waIcon()} <span>${esc(L.nf.wa)}</span></a>
    </div>
  </div>
</section>
</main>
${footer()}`;
  fs.mkdirSync(outDir(), { recursive: true });
  fs.writeFileSync(path.join(outDir(), '404.html'), html404);

  // Een sitemap voor alle talen samen, met xhtml:link per taal: dat is de vorm
  // die Google voor meertalige sites vraagt. Losse sitemaps per taal mag ook,
  // maar dan moet elke variant alsnog naar de andere wijzen.
  // Elk adres met een <lastmod>: die stond er op geen enkele van de 68 in, en
  // Google plant zijn hercrawl er mede op. De datum komt uit de bronbestanden
  // (zie LASTMOD), niet uit de klok, zodat een bouw zonder wijziging hem niet
  // vooruitschuift.
  //
  // Prioriteit vertelt Google alleen iets over de onderlinge verhouding binnen
  // deze site: de home bovenaan, daarna de dienstenpagina's (dat zijn de
  // landingspagina's voor de zoekopdrachten waar de omzet in zit), dan de hub,
  // dan de losse projecten als bewijsmateriaal eronder.
  const paths = [
    { u: '/', prio: '1.0', mod: LASTMOD.home },
    ...SERVICES.map((sv) => ({ u: `/${sv.slug}/`, prio: '0.9', mod: LASTMOD.dienst })),
    { u: '/werk/', prio: '0.8', mod: LASTMOD.project },
    ...projects.map((p) => ({ u: `/werk/${p.slug}/`, prio: '0.7', mod: LASTMOD.project })),
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths
  .flatMap(({ u, prio, mod }) =>
    LOCALES.map(
      (l) => `  <url><loc>${ORIGIN}${prefix(l)}${u}</loc>
${LOCALES.map((a) => `    <xhtml:link rel="alternate" hreflang="${a}" href="${ORIGIN}${prefix(a)}${u}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${u}"/>
    <lastmod>${mod}</lastmod><changefreq>monthly</changefreq><priority>${prio}</priority></url>`,
    ),
  )
  .join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(SITE, 'sitemap.xml'), sitemap);

  // Aparte videositemap. De zestien video's staan als data-video in de HTML en
  // worden pas door app.js ingeladen, dus een crawler komt ze bij het lezen van
  // de pagina niet tegen. De VideoObject in de structured data beschrijft ze,
  // deze sitemap wijst Google er ook naartoe. Alleen de Nederlandse pagina's:
  // dezelfde video op vier adressen aanmelden is viermaal hetzelfde bestand.
  const videoUrls = projects
    .filter((p) => (videosPerProject.get(p.slug) || []).length)
    .map((p) => {
      const T = tProject(DEFAULT_LOCALE, p);
      const items = (videosPerProject.get(p.slug) || [])
        .map((i) => {
          const m = media(i);
          const meta = videoMeta[path.basename(m.videoSrc || '')];
          if (!meta) return '';
          return `    <video:video>
      <video:thumbnail_loc>${ORIGIN}/m/${m.base}-900.jpg</video:thumbnail_loc>
      <video:title>${esc(fill(UI[DEFAULT_LOCALE].page.videoName, { titel: T.title }))}</video:title>
      <video:description>${esc(T.blurb)}</video:description>
      <video:content_loc>${ORIGIN}${m.videoSrc}</video:content_loc>
      <video:duration>${meta.seconds}</video:duration>
      <video:publication_date>${BIZ.published}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
    </video:video>`;
        })
        .filter(Boolean)
        .join('\n');
      return items
        ? `  <url>
    <loc>${ORIGIN}/werk/${p.slug}/</loc>
${items}
  </url>`
        : '';
    })
    .filter(Boolean)
    .join('\n');
  fs.writeFileSync(
    path.join(SITE, 'sitemap-video.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videoUrls}
</urlset>\n`,
  );

  fs.writeFileSync(
    path.join(SITE, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\nSitemap: ${ORIGIN}/sitemap-video.xml\n`,
  );

  fs.writeFileSync(
    path.join(SITE, 'favicon.svg'),
    // Zelfde beeldmerk als in de nav, in de lichte variant op de donkere
    // merkkleur: als donker logo is hij op een browsertab anders niet te zien.
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#111418"/><svg x="6" y="7" width="52" height="50" viewBox="${LOGO_VIEWBOX}">${LOGO_INNER.replace('class="lg-b"', 'fill="#f6f6f4"').replace('class="lg-t"', 'fill="#54b8b3"')}</svg></svg>`,
  );

  fs.writeFileSync(
    path.join(SITE, '_headers'),
    // De gehashte css/js mogen een jaar blijven staan: een wijziging is een andere
    // URL. De HTML zelf nooit cachen op de edge, anders wijst hij naar een hash die
    // net vervangen is. De kale styles.css/app.js worden niet meer gelinkt maar
    // staan er nog voor oude, gecachte HTML - kort houden dus.
    [
      '/m/*\n  Cache-Control: public, max-age=31536000, immutable',
      '/video/*\n  Cache-Control: public, max-age=31536000, immutable',
      '/f/*\n  Cache-Control: public, max-age=31536000, immutable',
      '/styles.*.css\n  Cache-Control: public, max-age=31536000, immutable',
      '/app.*.js\n  Cache-Control: public, max-age=31536000, immutable',
      '/styles.css\n  Cache-Control: public, max-age=60',
      '/app.js\n  Cache-Control: public, max-age=60',
      '/*.html\n  Cache-Control: public, max-age=0, must-revalidate',
      '/\n  Cache-Control: public, max-age=0, must-revalidate',
      '/*/\n  Cache-Control: public, max-age=0, must-revalidate',
    ].join('\n\n') + '\n',
  );
}

// ---- run --------------------------------------------------------------------
// Een hero of kaartfoto stilletjes wegfilteren zou een lege plek opleveren, dus
// dat is hier een harde fout in plaats van een filter.
for (const p of projects) {
  for (const [k, i] of [['hero', p.hero], ['card', p.card]]) {
    if (DROP.has(i)) throw new Error(`${p.slug}: ${k} is foto ${i}, en die staat op de DROP-lijst (${DROP.get(i)})`);
  }
  if ((p.results || []).filter((x) => !DROP.has(x.i)).length === 0 && (p.results || []).length)
    throw new Error(`${p.slug}: alle opleveringsfotos zijn weggefilterd`);
}
for (const b of BA) {
  for (const i of [b.voor, b.na]) if (DROP.has(i)) throw new Error(`voor/na ${b.tab}: foto ${i} staat op de DROP-lijst`);
}

for (const loc of LOCALES) {
  LOC = loc;
  L = UI[loc];
  console.log(`\n[${loc}] -> ${loc === DEFAULT_LOCALE ? 'site/' : `site/${loc}/`}`);
  for (const [i, p] of projects.entries()) {
    const prev = projects[(i - 1 + projects.length) % projects.length];
    const next = projects[(i + 1) % projects.length];
    const info = buildProject(p, prev, next);
    if (loc === DEFAULT_LOCALE) console.log(`  ${p.slug}: ${info.used} gebruikt, ${info.rest} in galerij`);
  }
  buildHome();
  buildWerkHub();
  for (const sv of SERVICES) buildService(sv);
  buildExtras();
}
LOC = DEFAULT_LOCALE;
L = UI[DEFAULT_LOCALE];

// Drie velden in de LocalBusiness die Google graag ziet en die niemand hier kan
// verzinnen: ze moeten kloppen met het Google-bedrijfsprofiel en met wat
// bezoekers melden. Zolang ze leeg zijn staan ze niet in de structured data, en
// herinnert de bouw eraan dat ze er nog niet zijn.
const ontbreekt = [
  !BIZ.email && 'email',
  !BIZ.priceRange && 'priceRange',
  !BIZ.hours.length && 'openingHoursSpecification',
  !BIZ.profielen.google && 'het Google-bedrijfsprofiel in sameAs',
].filter(Boolean);
if (ontbreekt.length) {
  console.log(`\nnog in te vullen in BIZ (projects.mjs): ${ontbreekt.join(', ')}`);
}

// dekking controleren
const covered = new Set();
for (const list of Object.values(RANGES)) list.forEach((i) => covered.add(i));
const missing = [...byIdx.keys()].filter((i) => !covered.has(i));
console.log(`\nprojecten: ${projects.length}`);
console.log(`media in projecten: ${covered.size} / ${byIdx.size}`);
console.log(`niet gebruikt: ${missing.join(', ') || '-'}`);
console.log(`bewust weggelaten: ${[...DROP.keys()].join(', ')}`);
