import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { projects, BIZ } from './projects.mjs';
import { FAQ, AREA, HQ, BA, REVIEWS } from './content.mjs';

const ROOT = path.resolve('.');
const SITE = path.join(ROOT, 'site');
const MEDIA = path.join(ROOT, 'assets', 'media');
// Publieke Mapbox-token (pk). Die hoort in de client te staan; beperken doe je
// bij Mapbox op domein, niet door hem te verstoppen. Zelfde token als
// jiw-concepts gebruikt.
const MAPBOX_TOKEN =
  fs
    .readFileSync(path.join(ROOT, '..', '..', '..', 'jiw-concepts', '.env'), 'utf8')
    .match(/^MAPBOX_TOKEN=(.+)$/m)?.[1]
    .trim()
    .replace(/^"|"$/g, '') || '';
if (!MAPBOX_TOKEN.startsWith('pk.')) throw new Error('MAPBOX_TOKEN niet gevonden in jiw-concepts/.env');
// Eigen adres zonder 'concept' erin: dat woord stond via de canonical, og:url,
// sitemap en JSON-LD op elke pagina. De oude host blijft als tweede route in
// wrangler.toml staan zodat gedeelde links blijven werken.
const ORIGIN = 'https://m-techno-service.jouwidealewebsite.nl';

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

const WA_TEXT = encodeURIComponent('Hallo Mike, ik zag jullie site en wil graag een offerte voor mijn badkamer.');
const waLink = `https://wa.me/${BIZ.waNumber}?text=${WA_TEXT}`;

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

function figure(m, caption, cls = '') {
  const orient = m.portrait ? 'is-portrait' : 'is-land';
  const vid = m.video ? ' is-video' : '';
  const data = m.video
    ? `data-video="${m.videoSrc}" data-poster="/m/${m.base}-1600.jpg"`
    : `data-full="/m/${m.base}-1600.jpg"`;
  const label = caption || (m.video ? 'Video afspelen' : 'Foto vergroten');
  return `<figure class="ph ${orient}${vid} ${cls}" ${data} tabindex="0" role="button" aria-label="${esc(label)}">
    ${pic(m, { sizes: GRID_SIZES, alt: caption || 'Werk van M.Techno Service' })}
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
      <span class="rail-hint"><span class="rail-hand" aria-hidden="true"></span>Veeg opzij</span>
      <span class="rail-count" aria-hidden="true"></span>
      <div class="rail-bar" aria-hidden="true"><i></i></div>
      <div class="rail-nav">
        <button class="rail-b rail-prev" type="button" aria-label="Naar links" disabled>&#8249;</button>
        <button class="rail-b rail-next" type="button" aria-label="Naar rechts">&#8250;</button>
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
  return `<span class="stars" role="img" aria-label="${n} van de 5 sterren">${star.repeat(n)}</span>`;
}

// Het Werkspot-logo, zoals het op werkspot.nl staat (site/werkspot.svg). Als
// <img> en niet inline: het is hun merk, dat hoort een los bestand te zijn dat
// je in een keer vervangt als zij het veranderen.
function werkspotLogo(cls = '') {
  return `<img class="ws-logo ${cls}" src="/werkspot.svg" width="237" height="32" alt="Werkspot" loading="lazy" decoding="async">`;
}

function head(title, desc, canonical, { ogImage, extraHead = '' } = {}) {
  const og = ogImage || `/m/${media(93).base}-1600.jpg`;
  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${ORIGIN}${canonical}">
<meta name="theme-color" content="#111418">
<meta name="robots" content="index, follow">
<meta property="og:site_name" content="M.Techno Service">
<meta property="og:locale" content="nl_NL">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${ORIGIN}${canonical}">
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
<a class="skip" href="#main">Naar de inhoud</a>
<div class="prog" id="prog" aria-hidden="true"><i></i></div>`;
}

// Het beeldmerk uit de huisstijl. De M staat op currentColor (dus donker in de
// nav, wit in de footer) en alleen het streepje houdt de merkkleur; met een
// platte PNG zou de M in de donkere footer onzichtbaar zijn.
function logoMark(cls = '') {
  return `<svg class="brand-mark${cls}" viewBox="16 13 68 76" aria-hidden="true" focusable="false">
    <g class="m"><path d="M18 15h7v54h-7z"/><path d="M74 15h7v54h-7z"/><path d="M18 15h7.4l20.1 25.5-2.9 6.1z"/><path d="M74 15h6.5l-30 40.5-4-6z"/></g>
    <path class="bar" d="M31 82h37v5H31z"/>
  </svg>`;
}

function brandLockup() {
  return `${logoMark()}<span class="brand-txt"><b>M.TECHNO</b><i>SERVICE</i></span>`;
}

function nav(active = '') {
  return `<header class="nav" id="nav">
  <div class="wrap nav-in">
    <a class="brand" href="/" aria-label="M.Techno Service, naar de homepage">${brandLockup()}</a>
    <nav class="nav-links" id="navLinks" aria-label="Hoofdmenu">
      <a href="/#projecten"${active === 'werk' ? ' class="on"' : ''}>Projecten</a>
      <a href="/#voorna">Voor &amp; na</a>
      <a href="/#diensten">Diensten</a>
      <a href="/#werkwijze">Werkwijze</a>
      <a href="/#reviews">Reviews</a>
      <a href="/#faq">Vragen</a>
    </nav>
    <a class="btn btn-wa btn-sm nav-cta" href="${waLink}" target="_blank" rel="noopener">
      ${waIcon()} <span>App direct</span>
    </a>
    <button class="burger" id="burger" aria-label="Menu" aria-expanded="false" aria-controls="navLinks"><span></span><span></span></button>
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
    (g) =>
      `<div class="area-col"><b>${esc(g.h)}</b><p>${g.places.map((pl) => esc(pl.n)).join(', ')}</p></div>`,
  ).join('\n      ');
  return `<section class="map-sec" id="werkgebied">
  <div class="wrap map-grid reveal">
    <div class="map-txt">
      <h2>Vanuit Apeldoorn, en een flink stuk daarbuiten.</h2>
      <p>Apeldoorn is de thuisbasis. Een complete badkamer is weken werk, dus voor zo'n klus rijden we ook een stuk verder.</p>
      <p class="map-note">Woon je buiten de ring? Bij een complete verbouwing komen we daar ook kijken.</p>
    </div>
    <div class="map-box">
      <div class="map-canvas" id="map" aria-label="Kaart van het werkgebied rond Apeldoorn" role="img"></div>
      <p class="map-fallback" id="mapFallback">Werkgebied: Apeldoorn en omgeving, tot ongeveer ${data.ringKm} km.</p>
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
      <p class="cta-line">Vrijblijvende opname &middot; vaste prijsopgave &middot; één aanspreekpunt</p>
      <div class="cta-btns">
        <a class="btn btn-wa btn-lg" href="${waLink}" target="_blank" rel="noopener">${waIcon()} <span>App Mike</span></a>
        <a class="btn btn-ghost-l" href="tel:+${BIZ.waNumber}">Bellen</a>
      </div>
      <p class="cta-note">Werkgebied: Apeldoorn, Arnhem, Deventer, Zutphen en omstreken. KvK ${BIZ.kvk}.</p>
    </div>
    <form class="form reveal" id="waForm" novalidate>
      <p class="form-kop">Stuur je aanvraag via WhatsApp</p>
      <div class="form-row">
        <label>Naam<input type="text" name="naam" id="fNaam" autocomplete="name" placeholder="Je naam"></label>
        <label>Plaats<input type="text" name="plaats" id="fPlaats" autocomplete="address-level2" placeholder="Apeldoorn"></label>
      </div>
      <div class="form-row">
        <label>Wat wil je laten doen?
          <select name="klus" id="fKlus">
            <option>Complete badkamerrenovatie</option>
            <option>Toiletrenovatie</option>
            <option>Alleen tegelwerk</option>
            <option>Sanitair plaatsen of vervangen</option>
            <option>CV, leidingwerk of installatie</option>
            <option>Reparatie of lekkage</option>
            <option>Iets anders</option>
          </select>
        </label>
        <label>Wanneer?
          <select name="wanneer" id="fWanneer">
            <option>Zo snel mogelijk</option>
            <option>Binnen 3 maanden</option>
            <option>Later dit jaar</option>
            <option>Nog aan het orienteren</option>
          </select>
        </label>
      </div>
      <label>Kort je plan<textarea name="bericht" id="fBericht" rows="2" placeholder="Bijvoorbeeld: badkamer van 6 m2, bad eruit en een inloopdouche erin."></textarea></label>
      <button class="btn btn-wa btn-lg form-go" type="submit">${waIcon()} <span>Bericht klaarzetten</span></button>
      <p class="form-note" id="fNote" role="status">WhatsApp opent met je bericht erin. Je kunt het nog aanpassen voordat je verstuurt.</p>
    </form>
  </div>
</section>`;
}

// Meelopende CTA. Komt omhoog zodra de hero uit beeld is en duikt weer weg zodra
// je bij het contactblok bent aangekomen - daar staan dezelfde knoppen al.
function ctaDock(kop = 'Badkamerplannen?') {
  return `<div class="dock" id="dock">
  <div class="dock-in">
    <div class="dock-txt">
      <b>${esc(kop)}</b>
      <span class="dock-sub">${checkIcon()} Geverifieerd op Werkspot &middot; reactie meestal dezelfde dag</span>
    </div>
    <div class="dock-btns">
      <a class="btn btn-wa dock-wa" href="${waLink}" target="_blank" rel="noopener">${waIcon()} <span>App Mike</span></a>
      <a class="btn dock-tel" href="tel:+${BIZ.waNumber}"><svg class="wa-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2z"/></svg> <span>Bellen</span></a>
    </div>
  </div>
</div>`;
}

function footer(dockKop) {
  const links = projects
    .slice(0, 4)
    .map((p) => `<a href="/werk/${p.slug}/">${esc(p.title)}</a>`)
    .join('\n      ');
  return `<footer class="foot">
  <div class="wrap foot-in">
    <div>
      <span class="brand">${brandLockup()}</span>
      <p class="foot-sub">Badkamerrenovatie, tegelwerk en installatiewerk in Apeldoorn en omgeving.</p>
      <a class="foot-wa" href="${waLink}" target="_blank" rel="noopener">${waIcon()} ${BIZ.waDisplay}</a>
    </div>
    <div>
      <h4>Projecten</h4>
      ${links}
      <a class="foot-more" href="/#projecten">Alle ${projects.length} projecten</a>
    </div>
    <div>
      <h4>Diensten</h4>
      <a href="/#diensten">Badkamerrenovatie</a>
      <a href="/#diensten">Tegelwerk</a>
      <a href="/#diensten">Sanitair &amp; kranen</a>
      <a href="/#diensten">CV &amp; leidingwerk</a>
      <a href="/#werkgebied">Werkgebied</a>
    </div>
    <div>
      <h4>Gegevens</h4>
      <p>Apeldoorn, Nederland</p>
      <p>KvK ${BIZ.kvk}</p>
      <p><a href="${BIZ.werkspot}" target="_blank" rel="noopener">Werkspot-profiel</a></p>
    </div>
  </div>
  <div class="wrap foot-bot"><span>&copy; 2026 M.Techno Service</span><span>KvK ${BIZ.kvk} &middot; Apeldoorn</span></div>
</footer>
${ctaDock(dockKop)}
<div class="lb" id="lb" hidden role="dialog" aria-modal="true" aria-label="Foto bekijken">
  <button class="lb-x" id="lb-x" aria-label="Sluiten">&times;</button>
  <button class="lb-p" id="lb-p" aria-label="Vorige">&#8249;</button>
  <button class="lb-n" id="lb-n" aria-label="Volgende">&#8250;</button>
  <div class="lb-stage" id="lb-stage"></div>
  <div class="lb-cap" id="lb-cap" aria-live="polite"></div>
</div>
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
    description:
      'Badkamerspecialist en installatiebedrijf in Apeldoorn. Complete badkamerrenovaties, tegelwerk, sanitair, leidingwerk en CV.',
    url: ORIGIN,
    telephone: `+${BIZ.waNumber}`,
    image: `${ORIGIN}/m/${media(93).base}-1600.jpg`,
    address: { '@type': 'PostalAddress', addressLocality: 'Apeldoorn', addressCountry: 'NL' },
    areaServed: AREA.flatMap((g) => g.places).map((p) => ({ '@type': 'City', name: p.n })),
    sameAs: [BIZ.werkspot],
    identifier: { '@type': 'PropertyValue', name: 'KvK', value: BIZ.kvk },
    // Bewust geen aggregateRating: de Werkspot-score staat op verzoek nergens
    // meer op de site, dus hij hoort ook niet in de structured data (Google zou
    // hem anders alsnog als sterren in de zoekresultaten tonen).
    makesOffer: [
      'Badkamerrenovatie',
      'Toiletrenovatie',
      'Wand- en vloertegels',
      'Sanitair plaatsen',
      'Waterleiding en riolering',
      'CV-ketel installeren',
    ].map((n) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: n } })),
  };
}

function ldFaq() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

function ldProject(p) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.title,
    description: p.blurb,
    url: `${ORIGIN}/werk/${p.slug}/`,
    image: `${ORIGIN}/m/${media(p.hero).base}-1600.jpg`,
    creator: { '@id': `${ORIGIN}/#business` },
    about: (p.tags || []).join(', '),
  };
}

function ldCrumbs(p) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Projecten', item: `${ORIGIN}/#projecten` },
      { '@type': 'ListItem', position: 3, name: p.title, item: `${ORIGIN}/werk/${p.slug}/` },
    ],
  };
}

const ld = (...objs) =>
  objs.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');

// ---- project pages ----------------------------------------------------------
function buildProject(p, prev, next) {
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
      <span class="story-n">Fase ${String(n + 1).padStart(2, '0')}</span>
      <h2>${esc(s.h)}</h2>
      <p>${esc(s.p)}</p>
    </div>
  </div>
  <div class="wrap">${railBlock(
    imgs.map((x) => figure(media(x.i), x.c)),
    { label: `Foto's bij fase ${n + 1}: ${s.h}` },
  )}</div>
</section>`;
    })
    .join('\n');

  const results = (p.results || []).filter((x) => kept(x.i));
  (p.results || []).forEach((x) => mark(x.i));
  const resultBlock = results.length
    ? `<section class="story story-result">
  <div class="wrap story-in reveal">
    <div class="story-txt">
      <span class="story-n">Oplevering</span>
      <h2>Het resultaat</h2>
      <p>Zoals opgeleverd, gefotografeerd op de dag van oplevering.</p>
    </div>
  </div>
  <div class="wrap">${railBlock(
    results.map((x) => figure(media(x.i), x.c)),
    { label: 'Opleveringsfotos' },
  )}</div>
</section>`
    : '';

  const vids = p.videos || [];
  vids.forEach((i) => mark(i));
  const videoBlock = vids.length
    ? `<section class="story">
  <div class="wrap story-in reveal">
    <div class="story-txt">
      <span class="story-n">Video</span>
      <h2>Video's van de klus</h2>
      <p>Rondje door de ruimte, opgenomen tijdens of vlak na de oplevering.</p>
    </div>
  </div>
  <div class="wrap">${railBlock(
    vids.map((i) => figure(media(i), '')),
    { label: "Video's van dit project", kind: 'vid' },
  )}</div>
</section>`
    : '';

  const range = RANGES[p.slug] || [];
  const rest = range.filter((i) => !used.has(i) && byIdx.has(i) && kept(i));
  const galleryBlock = rest.length
    ? `<section class="story" id="galerij">
  <div class="wrap story-in reveal">
    <div class="story-txt">
      <span class="story-n">Bouwmap</span>
      <h2>Alle foto's van dit project</h2>
      <p>${rest.length} opnames uit de bouwmap: sloop, techniek, tegelwerk en detailfoto's.${rest.length >= 8 ? ' Twee rijen, zijwaarts door te scrollen.' : ''}</p>
    </div>
  </div>
  <div class="wrap">${railBlock(
    rest.map((i) => figure(media(i), '')),
    // Onder de acht restfotos is een tweede rij zonde: dan gewoon de grote strip.
    { label: `Alle ${rest.length} fotos van dit project`, kind: rest.length >= 8 ? 'thumb' : 'ph' },
  )}</div>
</section>`
    : '';

  const tags = (p.tags || []).map((t) => `<span>${esc(t)}</span>`).join('');
  const intro = (p.intro || []).map((t) => `<p>${esc(t)}</p>`).join('\n      ');
  const phases = (p.sections || []).length;
  const shots = range.filter((i) => byIdx.has(i) && kept(i)).length;

  const html = `${head(`${p.title} | M.Techno Service Apeldoorn`, p.blurb, `/werk/${p.slug}/`, {
    ogImage: `/m/${hero.base}-1600.jpg`,
    extraHead: ld(ldProject(p), ldCrumbs(p)),
  })}
${nav('werk')}
<main id="main">
<article class="proj">
  <section class="p-hero">
    <div class="wrap p-hero-grid">
      <div class="p-hero-txt">
        <nav class="crumbs" aria-label="Kruimelpad">
          <a href="/">Home</a><span>/</span><a href="/#projecten">Projecten</a><span>/</span><b>${esc(p.title)}</b>
        </nav>
        <h1>${esc(p.title)}</h1>
        <p class="p-lead">${esc(p.blurb)}</p>
        <div class="chips">${tags}</div>
        <dl class="p-meta">
          <div><dt>Plaats</dt><dd>Apeldoorn e.o.</dd></div>
          ${phases ? `<div><dt>Fases in beeld</dt><dd>${phases}</dd></div>` : ''}
          <div><dt>Foto's &amp; video</dt><dd>${shots}</dd></div>
        </dl>
      </div>
      <figure class="p-hero-art">
        ${pic(hero, { sizes: '(min-width: 1000px) 46vw, 92vw', alt: p.title, eager: true, full: true })}
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
      <a class="p-nav-l" href="/werk/${prev.slug}/"><span>Vorige</span><b>${esc(prev.title)}</b></a>
      <a class="p-nav-c" href="/#projecten">Alle projecten</a>
      <a class="p-nav-r" href="/werk/${next.slug}/"><span>Volgende</span><b>${esc(next.title)}</b></a>
    </div>
  </section>
</article>

${contactBlock('Zoiets voor jouw huis?', 'Stuur een appje met een paar fotos van je huidige badkamer. Je krijgt een eerlijke inschatting terug, vrijblijvend.')}
</main>
${footer('Zoiets voor jouw huis?')}`;

  const dir = path.join(SITE, 'werk', p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  return { rest: rest.length, used: used.size };
}

// ---- home -------------------------------------------------------------------
function buildHome() {
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
    return `<a class="card" href="/werk/${p.slug}/">
      <div class="card-img">${pic(m, { sizes: '(min-width: 700px) 380px, 78vw', alt: p.title })}<span class="card-n">${String(n + 1).padStart(2, '0')}</span></div>
      <div class="card-txt">
        <span class="card-kick">${esc(p.kicker)}</span>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.blurb)}</p>
        <span class="card-go">Bekijk het project &rarr;</span>
      </div>
    </a>`;
  });

  // Voor & na: bewust alleen paren uit dezelfde ruimte, met vergelijkbaar standpunt.
  const baTabs = BA.map(
    (b, i) => `<button class="ba-tab${i === 0 ? ' on' : ''}" type="button" role="tab" aria-selected="${i === 0}" data-ba="${i}">${esc(b.tab)}</button>`,
  ).join('');
  const baData = BA.map((b) => ({
    voor: `/m/${media(b.voor).base}-1600.jpg`,
    voorW: `/m/${media(b.voor).base}-900.webp`,
    na: `/m/${media(b.na).base}-1600.jpg`,
    naW: `/m/${media(b.na).base}-900.webp`,
    cap: b.cap,
    slug: b.slug,
    title: b.tab,
  }));
  const first = baData[0];

  const faq = FAQ.map(
    (f) => `<details class="fq">
        <summary><span>${esc(f.q)}</span></summary>
        <div class="fq-a"><p>${esc(f.a)}</p></div>
      </details>`,
  ).join('\n');

  // Diensten: titel plus een halve regel. De omschrijving valt op een telefoon weg,
  // de titels zeggen het al.
  const SVC = [
    ['Badkamer renoveren of plaatsen', 'Sloop, leidingwerk, elektra, waterdichting, tegelwerk en afmontage.'],
    ['Toiletrenovatie', 'Nieuw toilet, inbouwreservoir en tegelwerk.'],
    ['Wand- en vloertegels', 'Visgraat, hexagon, grootformaat of natuursteenlook.'],
    ['Sanitair plaatsen of vervangen', 'Wastafels, meubels, douchewanden en toiletten.'],
    ['Douche- of badreparatie', 'Lekkage, afvoer of kitwerk dat aan vervanging toe is.'],
    ['IKEA badkamer monteren', 'Montage en aansluiting van je zelf gekochte badkamer.'],
    ['Kranen plaatsen of repareren', 'Inbouwkranen, thermostaatkranen en reparaties.'],
    ['Radiator (ver)plaatsen', 'Design- en handdoekradiatoren, inclusief leidingwerk.'],
    ['Waterleiding &amp; riolering', 'Verplaatsen, vervangen of compleet nieuw aanleggen.'],
    ['CV-ketel installeren', 'Vervanging of nieuwe installatie, incl. verdeler en expansievat.'],
  ]
    .map(([t, d]) => `<li><b>${t}</b><span>${esc(d)}</span></li>`)
    .join('\n');

  const STEPS = [
    ['Opname bij je thuis', 'Samen in de ruimte kijken wat kan en wat het mag kosten.'],
    ['Offerte', 'Vaste prijs, materiaal en werk uitgesplitst.'],
    ['Sloop', 'Alles afgeschermd, afvoer geregeld, de rest van je huis blijft schoon.'],
    ['Installatie', 'Leidingwerk, elektra, afvoer en waterdichting.'],
    ['Tegelwerk &amp; afmontage', 'Uitzetten, tegelen, voegen, kitten, sanitair monteren.'],
    ['Oplevering', 'Samen doorlopen, restpunten direct opgelost, met garantie.'],
  ]
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
      (r) => `<blockquote class="rev">
        <div class="rev-top">
          ${starRow(r.stars)}
          <span class="rev-date">${esc(r.d)}</span>
        </div>
        <p>${esc(r.t)}</p>
        <footer class="rev-by">
          <span class="rev-av" aria-hidden="true">${esc(r.n.slice(0, 1))}</span>
          <cite>${esc(r.n)}<i class="rev-verif">${checkIcon()} Geverifieerde klus via Werkspot</i></cite>
        </footer>
      </blockquote>`,
    ),
    { label: 'Reviews op Werkspot', kind: 'rev' },
  );

  const html = `${head(
    'Badkamerspecialist Apeldoorn | M.Techno Service',
    `M.Techno Service uit Apeldoorn renoveert badkamers van sloop tot oplevering. Tegelwerk, sanitair, leidingwerk en CV, alles door een vakman. Vaste prijsopgave na de opname.`,
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
        <span>Één vakman voor de hele klus</span>
      </div>
      <!-- Kicker: zegt in vier woorden wat we doen en waar. Stond er niet, en de
           kop alleen ("een badkamer die klopt") vertelt niet dat dit een bedrijf
           uit Apeldoorn is. Tegelijk de sterkste lokale zoekterm, in de h1-omgeving. -->
      <p class="hero-kick">Badkamerspecialist in Apeldoorn</p>
      <h1>Een badkamer die klopt tot in de laatste voeg.</h1>
      <!-- Twee varianten van dezelfde belofte: op een telefoon staat deze tekst
           over de foto en telt elke regel, dus daar de korte. Beide noemen nu
           hetzelfde harde punt -- alles door één man, vaste prijs vooraf -- in
           plaats van alleen te herhalen wat de kop al zegt. -->
      <p class="hero-sub"><span class="only-wide">Sloop, leidingwerk, waterdichting, tegelwerk en afmontage, door dezelfde vakman. Na de opname aan huis krijg je een vaste prijs.</span><span class="only-narrow">Van sloop tot afmontage. Na de opname een vaste prijs.</span></p>
      <div class="hero-cta">
        <a class="btn btn-wa btn-lg" href="${waLink}" target="_blank" rel="noopener">${waIcon()} <span>App ons<i class="only-wide">: ${BIZ.waDisplay}</i></span></a>
        <a class="btn btn-ghost" href="#projecten">Bekijk het werk</a>
      </div>
    </div>
    <div class="hero-art">
      <!-- Eén opgeleverde badkamer, verder niks. De hero had een sleepbare voor/na,
           maar die vraagt een handeling voordat je weet wat je ziet en hij liet in
           rust vooral de oude badkamer zien. Vergelijken doe je bij Voor & na. -->
      <figure class="hero-a">
        <div class="hero-shot">
          ${heroPic(heroA, heroMob, 'Opgeleverde badkamer in Apeldoorn door M.Techno Service')}
          ${heroVideo()}
        </div>
        <!-- Bijschrift hoort bij de desktopfoto (107) en staat op mobiel uit
             (.hero-cap display:none), waar een ander beeld geladen wordt. Blijft
             bij wat er te zien is: geen materiaalclaims die we niet kunnen aflezen. -->
        <figcaption class="hero-cap">Opgeleverd in Apeldoorn: zwevend wastafelblad onder een ronde spiegel met indirecte verlichting</figcaption>
      </figure>
    </div>
  </div>
  <div class="hero-strip">
    <div class="wrap strip-in">
      <span>Geverifieerd door Werkspot</span>
      <span>Biedt garantie</span>
      <span>KvK ${BIZ.kvk}</span>
      <span>Apeldoorn &amp; omgeving</span>
    </div>
  </div>
</section>

<section class="sec sec-alt" id="projecten">
  <div class="wrap sec-head reveal">
    <h2 class="sec-h">Het werk, project voor project</h2>
    <p class="sec-lead">Van sloopfoto tot oplevering, alle ${projects.length} klussen.</p>
  </div>
  <div class="wrap">${railBlock(cards, { label: `Alle ${projects.length} projecten`, kind: 'card' })}</div>
</section>

<section class="sec sec-dark ba-sec" id="voorna">
  <div class="wrap ba-head reveal">
    <h2>Dezelfde ruimte. Een paar weken later.</h2>
    <p>Zelfde standpunt, zelfde uitsnede. Alleen de badkamer is anders.</p>
  </div>
  <div class="wrap">
    <div class="ba-tabs reveal" role="tablist" aria-label="Kies een transformatie">${baTabs}</div>
    <div class="ba reveal" id="ba">
      <div class="ba-stage">
        <img class="ba-img ba-voor" id="baVoor" src="${first.voor}" alt="De oude situatie voor de verbouwing" loading="lazy" decoding="async">
        <img class="ba-img ba-na" id="baNa" src="${first.na}" alt="Dezelfde ruimte na oplevering" loading="lazy" decoding="async">
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
          <span class="ba-slide-lbl"><b>&larr; Voor</b><b>Na &rarr;</b></span>
          <input type="range" min="0" max="100" value="55" id="baRange" aria-label="Van voor naar na">
          <span class="ba-hint">Sleep ook op de foto zelf.</span>
        </label>
        <a class="ba-link" id="baLink" href="/werk/${first.slug}/">Hele project bekijken &rarr;</a>
      </div>
    </div>
  </div>
  <script id="baData" type="application/json">${JSON.stringify(baData)}</script>
</section>

<section class="sec sec-alt" id="reviews">
  <div class="wrap sec-head reveal">
    <div>
      <div class="rev-head">${werkspotLogo()}</div>
      <h2 class="sec-h">Wat klanten zeggen</h2>
    </div>
    <p class="sec-lead">Deze beoordelingen staan op het Werkspot-profiel, ze zijn hier niet zelf verzameld.
      <a href="${BIZ.werkspot}" target="_blank" rel="noopener">Alle beoordelingen bekijken</a></p>
  </div>
  <div class="wrap">${revRail}</div>
</section>

<section class="sec" id="over">
  <div class="wrap grid-2 wide-gap va-center reveal">
    <figure class="over-img">${pic(media(OVER_IMG), { sizes: '(min-width: 1000px) 44vw, 92vw', alt: 'Mike van M.Techno Service met een klant en zijn gezin, duimen omhoog na de klus' })}
      <figcaption>Mike (links) bij een klant thuis, aan het eind van de klus</figcaption></figure>
    <div>
      <h2>Één vakman die het hele traject doet, en er ook op terugkomt.</h2>
      <p>Bij de meeste badkamerverbouwingen lopen er vijf partijen door je huis. Hier is dat er één: Mike sloopt, trekt de leidingen, maakt waterdicht, tegelt en monteert het sanitair.</p>
      <div class="facts">
        <div><b>${projects.length}</b><span>projecten in beeld</span></div>
        <div><b>1</b><span>vakman voor de hele klus</span></div>
        <div><b>Apeldoorn</b><span>en wijde omgeving</span></div>
      </div>
    </div>
  </div>
</section>

<section class="sec sec-alt" id="diensten">
  <div class="wrap grid-2 wide-gap">
    <div class="reveal">
      <h2>Wat we doen</h2>
      <ul class="svc-l">
${SVC}
      </ul>
    </div>
    <div class="reveal" id="werkwijze">
      <h2>Zes stappen, één aanspreekpunt</h2>
      <ol class="steps">
${STEPS}
      </ol>
    </div>
  </div>
</section>

<section class="sec faq-sec" id="faq">
  <div class="wrap grid-2 wide-gap">
    <div class="faq-head reveal">
      <h2>Wat mensen vooraf willen weten</h2>
      <p>Staat je vraag er niet bij? App hem gewoon.</p>
      <a class="btn btn-wa btn-sm" href="${waLink}" target="_blank" rel="noopener">${waIcon()} <span>Stel je vraag</span></a>
    </div>
    <div class="faq reveal">
${faq}
    </div>
  </div>
</section>

${mapSection()}

${contactBlock('Badkamerplannen? Stuur een appje.', 'Vertel kort wat je in gedachten hebt en stuur een paar fotos mee. Je krijgt een vrijblijvende prijsopgave en een realistische planning.')}
</main>
${footer()}`;

  fs.writeFileSync(path.join(SITE, 'index.html'), html);
}

// ---- 404, robots, sitemap, favicon -----------------------------------------
function buildExtras() {
  const html404 = `${head('Pagina niet gevonden | M.Techno Service', 'Deze pagina bestaat niet (meer).', '/404.html')}
${nav()}
<main id="main">
<section class="sec nf">
  <div class="wrap">

    <h1>Deze pagina bestaat niet.</h1>
    <p>Misschien zocht je een van de projecten, of wil je gewoon even appen.</p>
    <div class="hero-cta">
      <a class="btn" href="/#projecten">Naar de projecten</a>
      <a class="btn btn-wa" href="${waLink}" target="_blank" rel="noopener">${waIcon()} <span>App ons</span></a>
    </div>
  </div>
</section>
</main>
${footer()}`;
  fs.writeFileSync(path.join(SITE, '404.html'), html404);

  const urls = ['/', ...projects.map((p) => `/werk/${p.slug}/`)];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${ORIGIN}${u}</loc><changefreq>monthly</changefreq><priority>${u === '/' ? '1.0' : '0.7'}</priority></url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(SITE, 'sitemap.xml'), sitemap);

  fs.writeFileSync(
    path.join(SITE, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`,
  );

  fs.writeFileSync(
    path.join(SITE, 'favicon.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#111418"/><g fill="#f6f6f4" transform="translate(9 8) scale(0.47)"><path d="M18 15h8v54h-8z"/><path d="M73 15h8v54h-8z"/><path d="M18 15h8.4l20.1 25.5-3.4 6.6z"/><path d="M73 15h7.5l-30.5 41-4.5-6.5z"/></g><rect x="24" y="45" width="17" height="3.4" fill="#c9b59b"/></svg>`,
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

for (const [i, p] of projects.entries()) {
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const info = buildProject(p, prev, next);
  console.log(`  ${p.slug}: ${info.used} gebruikt, ${info.rest} in galerij`);
}
buildHome();
buildExtras();

// dekking controleren
const covered = new Set();
for (const list of Object.values(RANGES)) list.forEach((i) => covered.add(i));
const missing = [...byIdx.keys()].filter((i) => !covered.has(i));
console.log(`\nprojecten: ${projects.length}`);
console.log(`media in projecten: ${covered.size} / ${byIdx.size}`);
console.log(`niet gebruikt: ${missing.join(', ') || '-'}`);
console.log(`bewust weggelaten: ${[...DROP.keys()].join(', ')}`);
