// Bouwt dist/ uit inhoud/. De <head>, het merk, de menubalk en de voettekst
// staan hier een keer, zodat een wijziging niet door acht bestanden hoeft.
//   node bouw.mjs
//
// Sinds 10-10-2026 staat de site in drie talen. Het Nederlands staat op de
// wortel, het Engels onder /en/ en het Duits onder /de/. Elke taal heeft zijn
// eigen bestandsnamen (/en/about-us.html, /de/ueber-uns.html), zodat elke
// pagina een eigen vindbaar adres heeft en niet een vlag die met JavaScript de
// tekst omwisselt. De drie verwijzen met hreflang naar elkaar.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync, rmSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import * as NL_DATA from './inhoud/data.mjs';
import { BLOKKEN, zetTaal } from './inhoud/blokken.mjs';
import nl from './inhoud/taal/nl.mjs';
import en from './inhoud/taal/en.mjs';
import de from './inhoud/taal/de.mjs';

const TALEN = [nl, en, de];

// Twee bouwen uit dezelfde bron. `node bouw.mjs` maakt de conceptversie: op het
// conceptadres, met noindex en een robots.txt die alles dichthoudt.
// `node bouw.mjs --prod` maakt de versie voor puurgenieten.tv: zonder noindex,
// met canonicals en sitemap op het echte adres en een robots.txt die opent.
// Een conceptadres dat per ongeluk opengaat is twee kopieen van dezelfde site in
// Google, dus het lint gaat er met een vlaggetje af en niet met de hand.
const PROD = process.argv.includes('--prod') || process.env.FM_PROD === '1';

// --- waar een formulier heen gaat ------------------------------------------
// Tot 17-10-2026 verstuurden de formulieren niets: site.js ving het af en liet
// een bedankregel zien die er zelf bij zei dat dit een conceptversie was. Sinds
// de verhuizing naar jiw-websites zit er een worker onder (zie worker/index.ts,
// @jiw/cloudflare-forms), dus ze posten naar hun eigen adres op dezelfde
// hostnaam. Geen los endpoint, geen CORS, geen omgevingsvariabele die iemand
// moet onthouden.
//
// Een pagina heeft er maximaal een, dus de sleutel van de pagina is genoeg om
// te weten welk formulier het is. `herkomst` gaat als eigen regel mee in onze
// eigen melding: drie formulieren in een mailbox zonder te zien welke, is
// drie keer dezelfde vraag stellen.
const FORMULIEREN = {
  puurgenieten: { pad: '/api/forms/puurgenieten', herkomst: 'Puur Genieten (puurgenieten.tv)' },
};

// Elk formulier krijgt hier zijn adres, zijn taal en zijn lokvink. Dat gebeurt
// in de bouw en niet met de hand in zeven html-bestanden, want dan staat er
// over een maand een formulier zonder adres op de site en valt een aanvraag
// stil in het niets.
//
// `website` is het lokvink: het staat er wel in de html (anders ziet een bot
// het niet) maar buiten beeld en buiten de tabvolgorde. Een bot die het vult
// krijgt {"ok":true} terug en er wordt niets opgeslagen en niets gemaild.
//
// Het lokvink alleen hield het niet: vanaf eind oktober 2026 kwam er elke dag
// een stroom Russische en Griekse spam door het contactformulier, van bots die
// het verborgen veld gewoon leeg laten. Sinds 02-11-2026 zit er daarom ook een
// Turnstile in elk formulier (hier: widget "Puur Genieten formulieren", managed). Hij
// staat op interaction-only: een gewone bezoeker ziet niets, alleen wie
// Cloudflare niet vertrouwt krijgt een vinkje vlak boven de verstuurknop.
// De geheime sleutel staat als TURNSTILE_SECRET_KEY op de worker (wrangler
// secret), deze sitekey is openbaar.
//
// `__jiw_confirmation_locale` bepaalt in welke taal de bezoeker zijn eigen
// bevestiging terugkrijgt. Die staat hier per pagina vast en wordt niet uit de
// browser gelezen: wie de Duitse pagina invult hoort Duits terug te krijgen,
// ook met een Engelse browser.
let formulierenGeraakt = 0;
function vulFormulier(html, taal, sleutel) {
  const f = FORMULIEREN[sleutel];
  if (!f) {
    if (html.includes('<form novalidate>')) throw new Error(`${taal.code}/${sleutel}: formulier zonder bestemming in FORMULIEREN`);
    return html;
  }
  if (!html.includes('<form novalidate>')) throw new Error(`${taal.code}/${sleutel}: staat in FORMULIEREN maar heeft geen formulier`);
  const id = `${taal.code}-${sleutel}`;
  const verborgen = `
          <div class="lokvink" aria-hidden="true">
            <label for="hp-${id}">Website</label>
            <input id="hp-${id}" name="website" type="text" tabindex="-1" autocomplete="off">
          </div>
          <input type="hidden" name="__jiw_confirmation_locale" value="${taal.code}">
          <input type="hidden" name="lang" value="${taal.naam}">
          <input type="hidden" name="herkomst" value="${f.herkomst}">`;
  const knoppen = html.match(/<button\b[^>]*type="submit"/g) || [];
  if (knoppen.length !== 1) throw new Error(`${taal.code}/${sleutel}: ${knoppen.length} verstuurknoppen, Turnstile verwacht er precies 1`);
  const wachter = `<div class="cf-turnstile" data-sitekey="${TURNSTILE_SITEKEY}" data-appearance="interaction-only" data-size="flexible" data-language="${taal.code}"></div>
          `;
  formulierenGeraakt++;
  return html
    .replace(/<button\b[^>]*type="submit"/, m => wachter + m)
    .split('<form novalidate>').join(
      `<form novalidate method="post" action="${f.pad}">${verborgen}`);
}

// Eigen widget sinds 10-11-2026, niet die van FRAME MEDIA: een sitekey werkt
// alleen op de hosts die in zijn widget staan.
const TURNSTILE_SITEKEY = '0x4AAAAAAF7NUbeEgnOjmPKq';
// Alleen op een pagina met een formulier: de rest van de site haalt niets bij
// Cloudflare op.
const TURNSTILE_SCRIPT = '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>\n';

// Puur Genieten is op 10-11-2026 losgekoppeld van framemedia.tv (Armando) en
// krijgt een eigen domein. Eerst als voorbeeld op concept.puurgenieten.tv.
const ADRES = PROD
  ? 'https://puurgenieten.tv'
  : 'https://puurgenieten-concept.jouwconcept.app';

const FONTS = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700&family=Inter:wght@400;500;600&display=swap';

// Het 020-nummer is er op 10-10-2026 af: dat heeft FRAME MEDIA niet meer. Het
// mobiele nummer is nu het enige telefoonnummer op de site, en ook het nummer
// achter de WhatsApp-knop.
const MOBIEL = '+31634861375';
const MOBIEL_TEKST = '06 3486 1375';
// Eigen adres sinds 10-11-2026 (Armando).
const MAIL = 'info@puurgenieten.tv';
const WA_TEKST = {
  nl: 'Hallo, ik wil meer informatie over Puur Genieten.',
  en: 'Hello, I would like more information about Puur Genieten.',
  de: 'Hallo, ich möchte mehr Informationen über Puur Genieten.',
};
const wa_link = t => 'https://wa.me/31634861375?text=' + encodeURIComponent(WA_TEKST[t.code]);

const pijl = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const hoorn = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 005 5L15 13l5 2v4a1.5 1.5 0 01-1.7 1.5C10.5 19.4 4.6 13.5 3.5 5.7A1.5 1.5 0 015 4z"/></svg>';
// Het WhatsApp-teken is een merkteken van iemand anders: dat herteken je niet
// in onze eigen lijnstijl. Het staat een keer als bestand in
// assets/wa.svg en wordt via een mask ingekleurd met currentColor, zodat het
// in allebei de weergaves meekleurt met de knop waar het in staat. Vandaar een
// span en niet een <img>: een img houdt zijn eigen kleur.
const wa = '<span class="ico-wa" aria-hidden="true"></span>';

// --- paden per taal --------------------------------------------------------
// Een pagina heet intern 'over' en heeft per taal een eigen bestandsnaam. Een
// taal die een pagina niet heeft (het Engels heeft geen vacature) krijgt er ook
// geen link naar: liever een menu met vijf knoppen dan een knop naar een
// pagina die in die taal niet bestaat.
function padNaar(taal, sleutel) {
  const p = taal.paden[sleutel];
  if (!p) return null;
  if (typeof p === 'object') return p.extern;           // staat buiten deze taal
  // De startpagina van een taal eindigt op een slash (/en/, niet /en): zo is
  // het een map met een index.html en niet een bestand dat 'en' heet.
  if (p === '/') return taal.basis ? taal.basis + '/' : '/';
  return taal.basis + p;
}
const heeft = (taal, sleutel) => Boolean(taal.paden[sleutel]);

// --- cachebrekers voor de drie bestanden die op hun plek blijven -----------
// dist/_headers zet /assets/* op een jaar `immutable`. Dat is precies goed voor
// beeld met een eigen naam, maar style.css, site.js en favicon.svg houden hun
// naam en veranderen wel. Een terugkerende bezoeker hield daardoor tot een jaar
// lang de oude opmaak - en bij een nieuw logo levert dat geen oud logo op maar
// een kapot logo: de nieuwe plaat in de oude maat.
//
// Dus hangt de bouw een stukje van de inhoud zelf achter het adres. Verandert
// het bestand niet, dan verandert het adres niet en blijft de cache staan.
// Beeld hoeft dit niet: dat krijgt bij een nieuwe versie gewoon een nieuwe naam
// (zie assets/merk/ en de mail-png).
const versie = naam => {
  const h = createHash('sha1').update(readFileSync(`inhoud/assets/${naam}`)).digest('hex').slice(0, 8);
  return `/assets/${naam}?v=${h}`;
};

// Twee maten van hetzelfde merk, allebei uit hun eigen logobestand (zie
// maak-logo.mjs). Klein is het woordmerk met de regel eronder; het insigne
// eromheen is bij 44 beeldpunten hoog een vlek, want daarin is de naam maar
// zeven punten hoog. Groot is hun insigne zelf, ongewijzigd - dat staat in de
// voettekst en op de foutpagina, waar de ruimte er wel is.
//
// Op 31-10-2026 stond hier het nieuwe gouden merk van de klant; op 07-11-2026
// is dat op verzoek van Armando teruggedraaid naar dit marine-en-rode
// woordmerk. Het gouden merk ligt klaar in raw/merk-2026/ met zijn eigen
// script (tools/maak-merk.mjs) en de twee webp-bestanden staan nog in
// inhoud/assets/merk/, dus terugzetten is een regel per merk hieronder.
//
// Tot 11-10-2026 stond elk merk er twee keer in - de lichte uitvoering voor
// een donkere ondergrond en de donkere voor de lichte weergave, met css die er
// een van liet zien. De site is nu alleen donker, dus alleen de lichte
// bestanden gaan mee en er wordt er precies een voorgelezen.
// Het merk is hier het rondje van Puur Genieten zelf. FRAME MEDIA staat als
// producent in de voet: het programma is van hen, maar dit is niet hun site.
// Linksboven het woordmerk: de letters uit het oude rondje, losgeknipt door
// tools/maak-woordmerk.py. Het hele rondje was op 52 px niet scherp (Armando
// 10-11-2026); in de voet staat het rondje wel, daar is de ruimte er.
const merk = taal => `<a class="brand brand-pg" href="${padNaar(taal, 'home')}">
      <img src="/assets/woordmerk-puur-genieten.png" alt="Puur Genieten" width="213" height="192">
    </a>`;

const merkGroot = (taal, klasse = 'brand-groot') => `<a class="${klasse} brand-pg-groot" href="${padNaar(taal, 'home')}">
      <img src="/assets/logo-puur-genieten.webp" alt="Puur Genieten" width="240" height="241">
    </a>`;

// --- losse teksten voor site.js --------------------------------------------
// site.js is voor alle drie de talen hetzelfde bestand en komt met defer
// binnen, dus het kan niet zelf weten in welke taal de pagina staat. Vandaar
// dit scriptje in de <head>.
//
// Hier stond tot 11-10-2026 ook de weergaveschakelaar (donker of licht). De
// klant heeft definitief voor donker gekozen, dus de lichte uitvoering, het
// knopje en ?thema= in het adres zijn eruit. Zie LEESMIJ.md.
// `window.FM_LEEG` zegt site.js dat er geen verwerking onder de formulieren
// zit. Dat is alleen zo in de conceptbouw; de productiebouw laat hem weg en
// dan post het formulier naar zijn eigen action.
const kopScript = taal => `<script>window.FM_T=${JSON.stringify(taal.js)};`
  + `</script>`;

// De bedankregels zeggen op het conceptadres dat er niets verstuurd is. Dat is
// daar waar en op www.framemedia.tv onwaar, dus in de productiebouw gaan ze om.
// Woordelijk per plek, want "uw bericht", "uw idee" en "uw aanmelding" zijn
// drie verschillende dingen. Een regel die niets meer raakt laat de bouw
// vallen - anders dekt deze tabel morgen stilletjes iets anders toe.
const DANKREGELS = [
  ['Dit is een conceptversie, dus er is niets verstuurd. Op de echte site komt deze aanmelding binnen bij FRAME MEDIA.',
    'Uw aanmelding is verstuurd. Wij reageren binnen een werkdag.'],
  ['This is a concept version, so nothing has been sent. On the live site this application reaches FRAME MEDIA.',
    'Your application has been sent. We will reply within one working day.'],
  ['Dies ist eine Konzeptversion, es wurde also nichts gesendet. Auf der echten Website geht diese Anmeldung bei FRAME MEDIA ein.',
    'Ihre Anmeldung wurde gesendet. Wir antworten innerhalb eines Werktags.'],
];
const geraakt = new Set();
function echteDankregels(html) {
  for (const [concept, echt] of DANKREGELS) {
    if (html.includes(concept)) { geraakt.add(concept); html = html.split(concept).join(echt); }
  }
  return html;
}

// De taalkeuze. Staat in de menubalk en niet onderin bij de weergaveknop: dit
// hoort bij de site zelf en niet bij de conceptversie. Een taal die deze
// pagina niet heeft wijst naar zijn eigen startpagina, want een link naar een
// bestand dat daar niet staat is een 404.
function taalKeuze(taal, sleutel) {
  const items = TALEN.map(t => {
    const doel = heeft(t, sleutel) ? padNaar(t, sleutel) : padNaar(t, 'home');
    const nu = t.code === taal.code;
    return `      <a href="${doel}" lang="${t.lang}" hreflang="${t.lang}"${nu ? ' aria-current="true"' : ''}>`
      + `<span aria-hidden="true">${t.kort}</span><span class="visueel-verborgen">${t.naam}</span></a>`;
  }).join('\n');
  return `    <div class="taalkeuze" role="group" aria-label="${taal.taalLabel}">
${items}
    </div>`;
}

// hreflang verwijst de drie versies naar elkaar. x-default staat op het
// Nederlands: dat is de thuistaal van het bedrijf.
function alternates(sleutel) {
  const r = TALEN.filter(t => heeft(t, sleutel)).map(t =>
    `<link rel="alternate" hreflang="${t.lang}" href="${ADRES}${padNaar(t, sleutel)}">`);
  if (heeft(nl, sleutel)) r.push(`<link rel="alternate" hreflang="x-default" href="${ADRES}${padNaar(nl, sleutel)}">`);
  return r.map(l => l + '\n').join('');
}

// --- structured data -------------------------------------------------------
// Tot de verhuizing stond er geen enkele JSON-LD op de site. Dat is geen fout in
// de html, maar het is wel het verschil tussen een gewoon zoekresultaat en een
// resultaat met het bedrijf eraan vast of met de vragen uitklapbaar eronder.
//
// Twee blokken, en bewust niet meer:
//
//   Organization op de startpagina van elke taal. Naam, adres, telefoon, logo en
//   hun eigen YouTube-kanaal. Alles daarin staat ook op de pagina zelf; een
//   schema dat iets beweert wat de bezoeker niet kan nalezen is precies wat
//   Google een handmatige maatregel noemt.
//
//   FAQPage op branded-content, uit dezelfde D.VRAGEN waar de uitklappers op de
//   pagina van gemaakt worden. Een los lijstje zou morgen uit de pas lopen met
//   wat er staat; dit kan dat niet.
//
// Niet gedaan: geen Offer of PriceSpecification bij de tarieven. Die bedragen
// zijn deels van Armando en deels van hun eigen Mondzorg.TV-pagina, en de vier
// extra's zijn nog niet bevestigd. Een prijs in structured data is een aanbod in
// het zoekresultaat zelf, en dat zet je er niet onder voorbehoud neer.
const ontdoe = s => String(s)
  .replace(/<[^>]+>/g, '')
  .replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘')
  .replace(/&rdquo;/g, '”').replace(/&ldquo;/g, '“')
  .replace(/&eacute;/g, 'e').replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/\s+/g, ' ').trim();

// Een @graph op elke taalversie, met vaste @id's zodat de drie talen naar
// hetzelfde programma en hetzelfde bedrijf wijzen in plaats van naar drie.
//
//   WebSite      de site zelf, met de taal van deze pagina.
//   WebPage      deze pagina, met de deelplaat als primaire afbeelding.
//   TVSeries     Puur Genieten, het programma waar de pagina over gaat.
//   Organization FRAME MEDIA, de producent: de wettelijke afzender, en het
//                adres, het nummer en de KvK staan ook in de voet.
//
// Bewust niet: geen Offer of prijs (een prijs in structured data is een aanbod in
// het zoekresultaat zelf, zie framemedia), en geen VideoObject - daar hoort een
// uploaddatum bij die we niet van de klant hebben, en zonder die datum keurt
// Google hem af.
const PRODUCENT_ID = `${ADRES}/#frame-media`;
function grafiek(taal, sleutel, m) {
  const pagina = ADRES + padNaar(taal, sleutel);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${ADRES}/#website`,
        url: `${ADRES}/`,
        name: 'Puur Genieten',
        inLanguage: TALEN.map(t => t.lang),
        publisher: { '@id': PRODUCENT_ID },
      },
      {
        '@type': 'WebPage',
        '@id': `${pagina}#pagina`,
        url: pagina,
        name: ontdoe(m.titel),
        description: ontdoe(m.omschrijving),
        inLanguage: taal.lang,
        isPartOf: { '@id': `${ADRES}/#website` },
        about: { '@id': `${ADRES}/#programma` },
        primaryImageOfPage: { '@type': 'ImageObject', url: OG_BEELD, width: 1200, height: 630 },
      },
      {
        '@type': 'TVSeries',
        '@id': `${ADRES}/#programma`,
        name: 'Puur Genieten',
        url: `${ADRES}/`,
        inLanguage: 'nl',
        genre: 'Lifestyle',
        countryOfOrigin: { '@type': 'Country', name: 'NL' },
        image: `${ADRES}/assets/mail/puurgenieten-email.png`,
        productionCompany: { '@id': PRODUCENT_ID },
      },
      {
        '@type': 'Organization',
        '@id': PRODUCENT_ID,
        name: 'FRAME MEDIA',
        legalName: 'Frame Productions & Management',
        url: 'https://www.framemedia.tv/',
        telephone: MOBIEL,
        email: MAIL,
        identifier: { '@type': 'PropertyValue', propertyID: 'KvK', value: '85865346' },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'John Blankensteinstraat 23 A',
          postalCode: '1095 MB',
          addressLocality: 'Amsterdam',
          addressCountry: 'NL',
        },
        sameAs: ['https://www.framemedia.tv/', 'https://www.youtube.com/@framemediatv'],
      },
    ],
  };
}

// </script> in een tekst zou de blok hier afkappen; de ontsnapping staat er
// zodat dat later ook niet kan.
const schema = (taal, sleutel, m) => `<script type="application/ld+json">`
  + JSON.stringify(grafiek(taal, sleutel, m)).replace(/</g, '\\u003c') + `</script>\n`;

// --- delen ---------------------------------------------------------------
// Open Graph en Twitter: wat WhatsApp, LinkedIn en Facebook laten zien als
// iemand de link deelt. Zonder dit pakt WhatsApp een willekeurig plaatje of
// niets. De plaat komt uit tools/gen-beeld.mjs.
const OG_BEELD = `${ADRES}/assets/og/puurgenieten-og.png`;
const OG_LOCALE = { nl: 'nl_NL', en: 'en_GB', de: 'de_DE' };
function delen(taal, sleutel, { titel, omschrijving }) {
  const andere = TALEN.filter(t => t.code !== taal.code && heeft(t, sleutel))
    .map(t => `<meta property="og:locale:alternate" content="${OG_LOCALE[t.code]}">\n`).join('');
  return `<meta property="og:type" content="website">
<meta property="og:site_name" content="Puur Genieten">
<meta property="og:title" content="${titel}">
<meta property="og:description" content="${omschrijving}">
<meta property="og:url" content="${ADRES}${padNaar(taal, sleutel)}">
<meta property="og:locale" content="${OG_LOCALE[taal.code]}">
${andere}<meta property="og:image" content="${OG_BEELD}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Puur Genieten">
<meta name="twitter:card" content="summary_large_image">
`;
}

function kop(taal, sleutel, { titel, omschrijving }) {
  return `<!DOCTYPE html>
<html lang="${taal.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titel}</title>
<meta name="description" content="${omschrijving}">
${PROD ? '' : '<meta name="robots" content="noindex, nofollow">\n'}<meta name="theme-color" content="#0d1117">
<link rel="canonical" href="${ADRES}${padNaar(taal, sleutel)}">
${alternates(sleutel)}${delen(taal, sleutel, { titel, omschrijving })}${schema(taal, sleutel, { titel, omschrijving })}${kopScript(taal)}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS}" rel="stylesheet">
<link rel="stylesheet" href="${versie('style.css')}">
<link rel="icon" href="${versie('favicon.svg')}" type="image/svg+xml">
</head>
<body>
<a class="skip" href="#main">${taal.skip}</a>
<div class="korrel" aria-hidden="true"></div>
`;
}

function header(taal, sleutel) {
  const links = taal.nav.map(([anker, tekst]) => `      <a href="#${anker}">${tekst}</a>`).join('\n');
  return `
<header class="site-header">
  <div class="wrap header-inner">
    ${merk(taal)}
    <button class="nav-toggle" aria-expanded="false" aria-controls="hoofdmenu" aria-label="${taal.menuOpenen}">
      <svg class="burger" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      <svg class="x" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
    <nav class="nav" id="hoofdmenu" aria-label="${taal.menuLabel}">
${links}
${taalKeuze(taal, sleutel)}
      <a class="btn btn-primair" href="#aanmelden">${taal.navKnop}</a>
    </nav>
  </div>
</header>

<main id="main">
`;
}

// Zwevend paar, 1:1 FloatingContact uit jiw-websites/apps/winterswijkvakantiehuis
// (Armando 10-11-2026). Vervangt de oude mobiele actiebalk. Telefoonicoon is
// lucide Phone, zoals daar.
const telIco = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
const BEL_KORT = { nl: 'Bellen', en: 'Call', de: 'Anrufen' };
const zwevend = taal => `
<div class="zwevend" aria-label="${taal.ctaLabel}">
  <a class="zw-wa" href="${wa_link(taal)}" target="_blank" rel="noopener">${wa}WhatsApp</a>
  <a class="zw-bel" href="tel:${MOBIEL}">${telIco}${BEL_KORT[taal.code]}</a>
</div>
`;

function voet(taal, sleutel) {
  const v = taal.voet;
  const fm = taal.code === 'nl' ? 'https://www.framemedia.tv/' : `https://www.framemedia.tv/${taal.code}/`;
  const anker = taal.nav.map(([a, t]) => `          <li><a href="#${a}">${t}</a></li>`).join('\n');
  return `
</main>
${zwevend(taal)}
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        ${merkGroot(taal)}
        <p>${v.zin}</p>
      </div>
      <div>
        <p class="foot-h">Puur Genieten</p>
        <ul class="foot-lijst">
${anker}
        </ul>
      </div>
      <div>
        <p class="foot-h">${v.producent}</p>
        <ul class="foot-lijst">
          <li><a href="${fm}">FRAME MEDIA</a></li>
          <li>John Blankensteinstraat 23 A</li>
          <li>1095 MB Amsterdam</li>
        </ul>
      </div>
      <div>
        <p class="foot-h">${v.contact}</p>
        <ul class="foot-lijst">
          <li><a href="mailto:${MAIL}">${MAIL}</a></li>
          <li><a href="tel:${MOBIEL}">${MOBIEL_TEKST}</a></li>
          <li><a href="${wa_link(taal)}" target="_blank" rel="noopener">WhatsApp</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-onder">
      <span>&copy; 2026 Puur Genieten &middot; FRAME MEDIA</span>
      <span><a href="https://www.framemedia.tv/voorwaarden">${v.voorwaarden}</a>${taal.code === 'nl' ? '' : ' <span class="voet-taal">(NL)</span>'}</span>
    </div>
  </div>
</footer>
<script src="${versie('site.js')}" defer></script>
</body>
</html>
`;
}

// Een pagina in inhoud// is alleen de <main>. Overal waar <!--#naam--> staat
// komt het bijbehorende blok uit blokken.mjs. Een onbekende naam is een fout
// en geen stille lege plek - anders valt een halve pagina weg zonder dat je
// het merkt.
function lees(bestand) {
  return readFileSync('inhoud/' + bestand, 'utf8').replace(/<!--#(\w+)-->/g, (_, naam) => {
    if (!BLOKKEN[naam]) throw new Error(`${bestand}: onbekend blok <!--#${naam}-->`);
    return BLOKKEN[naam]();
  });
}

// Welke pagina's er per taal zijn. sleutel = de interne naam (ook de sleutel in
// taal.paden en taal.meta), bron = het bestand in inhoud/.
//
// Het Engels en het Duits hebben de formatpagina, de vacature en de
// voorwaarden niet. Dat is een keuze en geen half werk: de formatpagina is een
// lijst Nederlandse programmatitels, de vacature is een zzp-rol in Nederland
// en de voorwaarden zijn een juridisch stuk dat je niet door een vertaling
// haalt. Zie LEESMIJ.md.
const PAGINAS = {
  nl: [['puurgenieten', 'puurgenieten.html']],
  en: [['puurgenieten', 'en/puur-genieten.html']],
  de: [['puurgenieten', 'de/puur-genieten.html']],
};

// Waar het bestand in dist/ komt. /en/ eindigt op een map met index.html,
// net als de landingspagina - dan klopt de slash in het adres.
//
// De adressen zijn sinds 17-10-2026 zonder .html (/studio en niet
// /studio.html). Workers assets stuurt /studio.html met een 307 door naar
// /studio, dus met .html in de links wees elke canonical en elke sitemap-url
// van onze eigen site naar een omleiding. Het bestand heet nog wel studio.html,
// want dat is wat assets zoekt.
function uitPad(taal, sleutel) {
  const p = padNaar(taal, sleutel);
  const schoon = p.replace(/^\//, '');
  if (p.endsWith('/')) return (schoon + 'index.html').replace(/^$/, 'index.html');
  return schoon + '.html';
}

// --- schoon beginnen -------------------------------------------------------
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist/assets', { recursive: true });

// Recursief, want assets/fotos/ is een map. Een platte readdir zou daar stil
// niets mee doen en dan staat de studiopagina live zonder foto's.
function kopieerMap(van, naar) {
  mkdirSync(naar, { recursive: true });
  for (const item of readdirSync(van, { withFileTypes: true })) {
    if (item.isDirectory()) kopieerMap(`${van}/${item.name}`, `${naar}/${item.name}`);
    else copyFileSync(`${van}/${item.name}`, `${naar}/${item.name}`);
  }
}
kopieerMap('inhoud/assets', 'dist/assets');

let n = 0;
const sitemap = [];

for (const taal of TALEN) {
  // VIDEOS_BIJ is geen eigen lijst maar alleen het labeltje onder de kaart.
  // Het id, de duur en de titel zijn geen taal, dus die blijven uit data.mjs
  // komen - anders staat er bij een nieuwe video in een van de drie talen
  // niets.
  const data = { ...taal.data };
  if (taal.data.VIDEOS_BIJ) {
    data.VIDEOS = NL_DATA.VIDEOS.map(v => ({
      ...v,
      bij: taal.data.VIDEOS_BIJ[v.id] ?? v.bij,
      // Een eigen alt-tekst heeft maar een kaart (het logo van Puur
      // Genieten); zonder deze regel stond daar de Nederlandse zin in
      // het Engels en het Duits.
      ...(taal.data.VIDEOS_ALT?.[v.id] ? { alt: taal.data.VIDEOS_ALT[v.id] } : {}),
    }));
    delete data.VIDEOS_BIJ;
    delete data.VIDEOS_ALT;
  }
  zetTaal({ data, ui: taal.ui, basis: taal.basis });

  for (const [sleutel, bron] of PAGINAS[taal.code]) {
    if (!existsSync('inhoud/' + bron)) throw new Error(`${taal.code}: ${bron} bestaat niet`);
    const m = taal.meta[sleutel];
    if (!m) throw new Error(`${taal.code}: geen titel/omschrijving voor '${sleutel}'`);
    let html = echteDankregels(kop(taal, sleutel, m) + header(taal, sleutel)
      + vulFormulier(lees(bron).replace(/\s*$/, '\n'), taal, sleutel) + voet(taal, sleutel));
    if (FORMULIEREN[sleutel]) html = html.replace('</head>', TURNSTILE_SCRIPT + '</head>');
    const pad = 'dist/' + uitPad(taal, sleutel);
    mkdirSync(pad.replace(/\/[^/]+$/, ''), { recursive: true });
    writeFileSync(pad, html);
    sitemap.push({ loc: ADRES + padNaar(taal, sleutel), sleutel, taal });
    n++;
  }
}

// De foutpagina heeft geen menu en geen voettekst, alleen het merk. Hij gaat
// niet door de bouwer heen en staat er dus maar in een taal; op een
// Nederlandse server is dat het Nederlands.
zetTaal({ data: {}, ui: nl.ui, basis: '' });
// Hij gaat niet door kop()/voet() heen, dus de cachebrekers moeten hier met de
// hand op. Staat in de bron zonder, zodat het bestand op zichzelf nog opent.
writeFileSync('dist/404.html', ['style.css', 'site.js', 'favicon.svg'].reduce(
  (h, naam) => h.split(`/assets/${naam}"`).join(`${versie(naam)}"`), lees('404.html')));
n++;

// Sitemap met de drie talen erin, elk met hreflang naar de andere twee. Zolang
// de site op noindex staat doet een zoekmachine hier niets mee, maar dan staat
// het in orde zodra het lint eraf gaat.
// lastmod is de bouwdatum. De site is een pagina per taal en elke bouw is een
// uitrol, dus dat is ook echt de laatste keer dat de inhoud kon veranderen.
const VANDAAG = new Date().toISOString().slice(0, 10);
const sm = sitemap.map(({ loc, sleutel }) => {
  const alt = TALEN.filter(t => heeft(t, sleutel)).map(t =>
    `    <xhtml:link rel="alternate" hreflang="${t.lang}" href="${ADRES}${padNaar(t, sleutel)}"/>`).join('\n');
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${VANDAAG}</lastmod>\n${alt}\n  </url>`;
}).join('\n');
writeFileSync('dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`
  + ` xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sm}\n</urlset>\n`);

// Concept: alles dicht voor zoekmachines. Productie: open, met de sitemap erin.
writeFileSync('dist/robots.txt', PROD
  ? `User-agent: *\nAllow: /\n\nSitemap: ${ADRES}/sitemap.xml\n`
  : 'User-agent: *\nDisallow: /\n');

// --- IndexNow-sleutel -------------------------------------------------------
// Bing (en daarmee ChatGPT en Copilot) haalt nieuwe adressen sneller op als we ze
// melden: tools/indexnow.mjs na een uitrol. Die melding geldt alleen als dit
// bestand live op de wortel staat met de sleutel zelf als inhoud.
const INDEXNOW_KEY = 'a17e6cda91a997e3c702d5e7d4951bfa';
writeFileSync(`dist/${INDEXNOW_KEY}.txt`, INDEXNOW_KEY + '\n');

// --- kopregels -------------------------------------------------------------
// _headers werkt op Workers Static Assets, niet alleen op Pages. De drie
// veiligheidsregels zijn de standaard voor de sites hier. De cache-regel staat
// er omdat alles onder /assets/ een vaste naam heeft en nooit verandert zonder
// dat de naam verandert; een html-pagina juist niet, die moet elke keer
// nagevraagd worden of de site na een wijziging nog dagen oud bij iemand staat.
//
// In de conceptbouw gaat er ook een X-Robots-Tag bij. De noindex staat al in
// elke pagina, maar een pdf of een afbeelding heeft geen <head> - en /oud/
// bestaat juist uit afbeeldingen.
writeFileSync('dist/_headers', `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
${PROD ? '' : '  X-Robots-Tag: noindex, nofollow\n'}
/assets/*
  Cache-Control: public, max-age=31536000, immutable
`);

// --- de adressen van de oude WordPress-site --------------------------------
// Elk adres dat in Google of in een link naar buiten staat moet blijven werken,
// anders verdwijnt de kracht die eraan hangt in een 404. Workers assets leest
// dit bestand net als Cloudflare Pages.
//
// Twee regels uit de analyse staan hier bewust anders. /puurgenieten/ zou naar
// /formats wijzen, maar dat adres is hier een echte pagina - een omleiding zou
// de landingspagina wegvangen. En /algemene-leveringsvoorwaarden/ zou naar de
// startpagina gaan; die tekst staat hier op /voorwaarden, dus daar gaat hij
// naartoe. Een omleiding naar de pagina die hetzelfde zegt houdt de kracht
// vast, een omleiding naar de startpagina gooit hem weg.
// framemedia.tv/puurgenieten/ is het oude adres. Dat omleiden gebeurt op
// framemedia.tv zelf, zodra dit domein live staat - niet hier.

const oud = 0;

// --- de poort op de productiebouw ------------------------------------------
// Een conceptwoord of het conceptadres dat meegaat naar puurgenieten.tv is
// geen schoonheidsfoutje: het staat dan onder een formulier dat de klant net
// heeft ingevuld, of het wijst een zoekmachine naar het conceptadres. Dus kijkt
// de bouw zelf na wat er in dist/ staat in plaats van erop te vertrouwen.
if (PROD) {
  const klachten = [];
  const niet = /conceptversie|concept version|Konzeptversion|jouwconcept\.app|concept\.puurgenieten|noindex|framemedia-email\.png/i;
  const loop = map => {
    for (const i of readdirSync(map, { withFileTypes: true })) {
      const pad = `${map}/${i.name}`;
      if (i.isDirectory()) { loop(pad); continue; }
      if (!/\.(html|xml|txt)$/.test(i.name)) continue;
      // De foutpagina hoort op noindex te staan: die geeft een 404 terug en
      // hoort niet in de zoekresultaten.
      if (pad === 'dist/404.html') continue;
      const t = readFileSync(pad, 'utf8');
      const m = t.match(niet);
      if (m) klachten.push(`${pad}: ${m[0]}`);
    }
  };
  loop('dist');
  for (const [concept] of DANKREGELS) {
    if (!geraakt.has(concept)) klachten.push(`dankregel raakt niets meer: "${concept.slice(0, 60)}..."`);
  }
  // Een formulier dat na een verbouwing zonder action op de echte site staat
  // slikt elke aanvraag. Dus telt de bouw ze, en 10 is wat er horen te zijn:
  // nl heeft vier formulieren (hero, contact, puurgenieten, programma-idee),
  // en + de elk drie.
  const hoort = TALEN.reduce((s, t) => s + PAGINAS[t.code].filter(([k]) => FORMULIEREN[k]).length, 0);
  if (formulierenGeraakt !== hoort) klachten.push(`${formulierenGeraakt} formulieren gevuld, ${hoort} verwacht`);
  if (klachten.length) {
    console.error('\nDe productiebouw is gestopt - dit mag niet mee naar puurgenieten.tv:');
    for (const k of klachten) console.error('  ' + k);
    process.exit(1);
  }
}

console.log(`${n} paginas gebouwd (${TALEN.map(t => `${t.code}: ${PAGINAS[t.code].length}`).join(', ')})`);
console.log(`adres: ${ADRES}${PROD ? '  [PRODUCTIE: geen noindex, robots open]' : '  [concept: noindex, robots dicht]'}`);
console.log(`${oud} oude bestanden op hun oude pad meegenomen`);
console.log(`${formulierenGeraakt} formulieren gekoppeld aan /api/forms/`);
