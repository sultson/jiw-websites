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
import * as NL_DATA from './inhoud/data.mjs';
import { BLOKKEN, zetTaal } from './inhoud/blokken.mjs';
import nl from './inhoud/taal/nl.mjs';
import en from './inhoud/taal/en.mjs';
import de from './inhoud/taal/de.mjs';

const TALEN = [nl, en, de];

// Twee bouwen uit dezelfde bron. `node bouw.mjs` maakt de conceptversie: op het
// conceptadres, met noindex en een robots.txt die alles dichthoudt.
// `node bouw.mjs --prod` maakt de versie voor www.framemedia.tv: zonder noindex,
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
  home: { pad: '/api/forms/snel', herkomst: 'Snelformulier op de startpagina' },
  contact: { pad: '/api/forms/contact', herkomst: 'Contactpagina' },
  puurgenieten: { pad: '/api/forms/puurgenieten', herkomst: 'Landingspagina Puur Genieten' },
  programmaIdee: { pad: '/api/forms/programma-idee', herkomst: 'Pagina programma-idee' },
};

// Elk formulier krijgt hier zijn adres, zijn taal en zijn lokvink. Dat gebeurt
// in de bouw en niet met de hand in zeven html-bestanden, want dan staat er
// over een maand een formulier zonder adres op de site en valt een aanvraag
// stil in het niets.
//
// `website` is het lokvink: het staat er wel in de html (anders ziet een bot
// het niet) maar buiten beeld en buiten de tabvolgorde. Een bot die het vult
// krijgt {"ok":true} terug en er wordt niets opgeslagen en niets gemaild. Dat
// scheelt een Turnstile, dus ook een extra verzoek naar Cloudflare voor iemand
// die alleen een vraag wil stellen.
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
  formulierenGeraakt++;
  return html.split('<form novalidate>').join(
    `<form novalidate method="post" action="${f.pad}">${verborgen}`);
}

const ADRES = PROD
  ? 'https://www.framemedia.tv'
  : 'https://framemedia-concept.jouwconcept.app';

const FONTS = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700&family=Inter:wght@400;500;600&display=swap';

// Het 020-nummer is er op 10-10-2026 af: dat heeft FRAME MEDIA niet meer. Het
// mobiele nummer is nu het enige telefoonnummer op de site, en ook het nummer
// achter de WhatsApp-knop.
const MOBIEL = '+31634861375';
const MOBIEL_TEKST = '06 3486 1375';
const MAIL = 'info@framemedia.tv';
const WA_TEKST = {
  nl: 'Hallo FRAME MEDIA, ik heb een vraag over een item op televisie.',
  en: 'Hello FRAME MEDIA, I have a question about an item on television.',
  de: 'Hallo FRAME MEDIA, ich habe eine Frage zu einem Beitrag im Fernsehen.',
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

// Twee maten van hetzelfde merk, allebei uit hun eigen logobestand (zie
// maak-logo.mjs). Klein is het woordmerk met de regel eronder; het insigne
// eromheen is bij 44 beeldpunten hoog een vlek, want daarin is de naam maar
// zeven punten hoog. Groot is hun insigne zelf, ongewijzigd - dat staat in de
// voettekst en op de foutpagina, waar de ruimte er wel is.
// Tot 11-10-2026 stond elk merk er twee keer in - de lichte uitvoering voor
// een donkere ondergrond en de donkere voor de lichte weergave, met css die er
// een van liet zien. De site is nu alleen donker, dus alleen de lichte
// bestanden staan er nog en er wordt er precies een voorgelezen.
const merk = taal => `<a class="brand" href="${padNaar(taal, 'home')}">
      <img src="/assets/logo-woord-licht.svg" alt="FRAME MEDIA" width="311" height="66">
    </a>`;

const merkGroot = (taal, klasse = 'brand-groot') => `<a class="${klasse}" href="${padNaar(taal, 'home')}">
      <img src="/assets/logo-licht.svg" alt="FRAME MEDIA - Producent in TV content" width="311" height="193">
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
  + (PROD ? '' : 'window.FM_LEEG=1;') + `</script>`;

// De bedankregels zeggen op het conceptadres dat er niets verstuurd is. Dat is
// daar waar en op www.framemedia.tv onwaar, dus in de productiebouw gaan ze om.
// Woordelijk per plek, want "uw bericht", "uw idee" en "uw aanmelding" zijn
// drie verschillende dingen. Een regel die niets meer raakt laat de bouw
// vallen - anders dekt deze tabel morgen stilletjes iets anders toe.
const DANKREGELS = [
  ['Dit is een conceptversie, dus er is niets verstuurd. Op de echte site komt dit bericht binnen bij FRAME MEDIA.',
    'Uw bericht is verstuurd. Wij reageren binnen een werkdag.'],
  ['Dit is een conceptversie, dus er is niets verstuurd. Op de echte site komt deze aanmelding binnen bij FRAME MEDIA.',
    'Uw aanmelding is verstuurd. Wij reageren binnen een werkdag.'],
  ['Dit is een conceptversie, dus er is niets verstuurd. Op de echte site komt dit binnen bij FRAME MEDIA.',
    'Uw aanvraag is verstuurd. Wij reageren binnen een werkdag.'],
  ['This is a concept version, so nothing has been sent. On the live site this message reaches FRAME MEDIA.',
    'Your message has been sent. We will reply within one working day.'],
  ['This is a concept version, so nothing has been sent. On the live site this application reaches FRAME MEDIA.',
    'Your application has been sent. We will reply within one working day.'],
  ['This is a concept version, so nothing has been sent. On the live site this reaches FRAME MEDIA.',
    'Your enquiry has been sent. We will reply within one working day.'],
  ['Dies ist eine Konzeptversion, es wurde also nichts gesendet. Auf der echten Website geht diese Nachricht bei FRAME MEDIA ein.',
    'Ihre Nachricht wurde gesendet. Wir antworten innerhalb eines Werktags.'],
  ['Dies ist eine Konzeptversion, es wurde also nichts gesendet. Auf der echten Website geht diese Anmeldung bei FRAME MEDIA ein.',
    'Ihre Anmeldung wurde gesendet. Wir antworten innerhalb eines Werktags.'],
  ['Dies ist eine Konzeptversion, es wurde also nichts gesendet. Auf der echten Website geht das bei FRAME MEDIA ein.',
    'Ihre Anfrage wurde gesendet. Wir antworten innerhalb eines Werktags.'],
];
const geraakt = new Set();
function echteDankregels(html) {
  if (!PROD) return html;
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

const ORGANISATIE = taal => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${ADRES}/#organisatie`,
  name: 'FRAME MEDIA',
  legalName: 'Frame Productions & Management',
  url: ADRES + padNaar(taal, 'home'),
  logo: `${ADRES}/assets/mail/framemedia-email.png`,
  image: `${ADRES}/assets/mail/framemedia-email.png`,
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
  sameAs: ['https://www.youtube.com/@framemediatv'],
});

const VRAGEN_SCHEMA = taal => {
  const vragen = taal.data.VRAGEN ?? NL_DATA.VRAGEN;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: vragen.map(q => ({
      '@type': 'Question',
      name: ontdoe(q.v),
      acceptedAnswer: { '@type': 'Answer', text: ontdoe(q.a) },
    })),
  };
};

function schema(taal, sleutel) {
  const blokken = [];
  if (sleutel === 'home') blokken.push(ORGANISATIE(taal));
  if (sleutel === 'branded') blokken.push(VRAGEN_SCHEMA(taal));
  if (!blokken.length) return '';
  // </script> in een tekst zou de blok hier afkappen; dat kan niet voorkomen in
  // deze inhoud, maar een ontsnapping die er staat gaat later niet stuk.
  return blokken.map(b => `<script type="application/ld+json">`
    + JSON.stringify(b).replace(/</g, '\\u003c') + `</script>\n`).join('');
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
${alternates(sleutel)}${schema(taal, sleutel)}${kopScript(taal)}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS}" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
</head>
<body>
<a class="skip" href="#main">${taal.skip}</a>
<div class="korrel" aria-hidden="true"></div>
`;
}

function header(taal, sleutel) {
  const links = taal.nav.map(([s, tekst]) =>
    `      <a href="${padNaar(taal, s)}"${s === sleutel ? ' aria-current="page"' : ''}>${tekst}</a>`).join('\n');
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
      <a class="btn btn-primair" href="${padNaar(taal, 'contact')}">${taal.navKnop}</a>
    </nav>
  </div>
</header>

<main id="main">
`;
}

// Op contact wijst de tweede knop naar de mail in plaats van naar de pagina
// waar je al staat - bellen of mailen zijn daar de twee echte routes.
const mobieleCta = (taal, sleutel) => `
<nav class="mobiel-cta" aria-label="${taal.ctaLabel}">
  <a class="btn btn-rand" href="tel:${MOBIEL}">${hoorn}${taal.bellen}</a>
  <a class="btn btn-rand" href="${wa_link(taal)}" target="_blank" rel="noopener">${wa}WhatsApp</a>
  ${sleutel === 'contact'
    ? `<a class="btn btn-primair" href="mailto:${MAIL}">${taal.mailen}</a>`
    : `<a class="btn btn-primair" href="${padNaar(taal, 'contact')}">${taal.navKnop}</a>`}
</nav>
`;

function voet(taal, sleutel) {
  const D = { ...NL_DATA, ...taal.data };
  const studioLinks = D.RUIMTES.map(r =>
    `          <li><a href="${padNaar(taal, 'studio')}#${r.slug}">${r.naam}</a></li>`).join('\n');

  // Alleen linken naar wat deze taal heeft. Het Nederlands heeft de
  // formatpagina en de vacature, het Engels en Duits niet.
  const doen = [
    [heeft(taal, 'branded'), `<a href="${padNaar(taal, 'branded')}">${taal.nav.find(n => n[0] === 'branded')[1]}</a>`],
    [heeft(taal, 'branded'), `<a href="${padNaar(taal, 'branded')}#tarieven">${taal.voet.tarieven}</a>`],
    [heeft(taal, 'puurgenieten'), `<a href="${padNaar(taal, 'puurgenieten')}">Puur Genieten</a>`],
    [heeft(taal, 'formats'), `<a href="${padNaar(taal, 'formats')}">Formats</a>`],
    [heeft(taal, 'programmaIdee'), `<a href="${padNaar(taal, 'programmaIdee')}">${taal.voet.programmaIdee || ''}</a>`],
    [heeft(taal, 'over'), `<a href="${padNaar(taal, 'over')}#referenties">${taal.voet.referenties}</a>`],
  ].filter(([ja]) => ja).map(([, html]) => `          <li>${html}</li>`).join('\n');

  const contactLijst = [
    `          <li><a href="mailto:${MAIL}">${MAIL}</a></li>`,
    `          <li><a href="tel:${MOBIEL}">${MOBIEL_TEKST}</a></li>`,
    `          <li><a href="${wa_link(taal)}" target="_blank" rel="noopener">WhatsApp</a></li>`,
    heeft(taal, 'vacature') ? `          <li><a href="${padNaar(taal, 'vacature')}">${taal.voet.vacature}</a></li>` : '',
  ].filter(Boolean).join('\n');

  // De voorwaarden bestaan alleen in het Nederlands. Een juridisch stuk laten
  // we niet door een vertaling heen; op de andere talen staat er NL achter.
  const vw = taal.paden.voorwaarden;
  const vwBij = typeof vw === 'object' && vw.bij ? ` <span class="voet-taal">(${vw.bij})</span>` : '';

  return `
</main>
${mobieleCta(taal, sleutel)}
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        ${merkGroot(taal)}
        <p>${taal.voet.zin}</p>
      </div>
      <div>
        <p class="foot-h">${taal.voet.watWijDoen}</p>
        <ul class="foot-lijst">
${doen}
        </ul>
      </div>
      <div>
        <p class="foot-h">${taal.voet.studio}</p>
        <ul class="foot-lijst">
${studioLinks}
        </ul>
      </div>
      <div>
        <p class="foot-h">${taal.voet.contact}</p>
        <ul class="foot-lijst">
${contactLijst}
        </ul>
      </div>
    </div>
    <div class="foot-onder">
      <span>&copy; 2026 FRAME MEDIA</span>
      <span><a href="${padNaar(taal, 'voorwaarden')}">${taal.voet.voorwaarden}</a>${vwBij}</span>${PROD ? '' : `
      <span>${taal.voet.concept}</span>`}
    </div>
  </div>
</footer>
<script src="/assets/site.js" defer></script>
</body>
</html>
`;
}

// Een pagina in inhoud/ is alleen de <main>. Overal waar <!--#naam--> staat
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
  nl: [
    ['home', 'index.html'],
    ['branded', 'branded-content.html'],
    ['studio', 'studio.html'],
    ['formats', 'formats.html'],
    ['over', 'over-ons.html'],
    ['contact', 'contact.html'],
    ['puurgenieten', 'puurgenieten.html'],
    ['programmaIdee', 'programma-idee.html'],
    ['vacature', 'vacature.html'],
    ['voorwaarden', 'voorwaarden.html'],
  ],
  en: [
    ['home', 'en/index.html'],
    ['branded', 'en/branded-content.html'],
    ['studio', 'en/studio.html'],
    ['over', 'en/about-us.html'],
    ['contact', 'en/contact.html'],
    ['puurgenieten', 'en/puur-genieten.html'],
  ],
  de: [
    ['home', 'de/index.html'],
    ['branded', 'de/branded-content.html'],
    ['studio', 'de/studio.html'],
    ['over', 'de/ueber-uns.html'],
    ['contact', 'de/kontakt.html'],
    ['puurgenieten', 'de/puur-genieten.html'],
  ],
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
    const html = echteDankregels(kop(taal, sleutel, m) + header(taal, sleutel)
      + vulFormulier(lees(bron).replace(/\s*$/, '\n'), taal, sleutel) + voet(taal, sleutel));
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
writeFileSync('dist/404.html', lees('404.html'));
n++;

// Sitemap met de drie talen erin, elk met hreflang naar de andere twee. Zolang
// de site op noindex staat doet een zoekmachine hier niets mee, maar dan staat
// het in orde zodra het lint eraf gaat.
const sm = sitemap.map(({ loc, sleutel }) => {
  const alt = TALEN.filter(t => heeft(t, sleutel)).map(t =>
    `    <xhtml:link rel="alternate" hreflang="${t.lang}" href="${ADRES}${padNaar(t, sleutel)}"/>`).join('\n');
  return `  <url>\n    <loc>${loc}</loc>\n${alt}\n  </url>`;
}).join('\n');
writeFileSync('dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`
  + ` xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sm}\n</urlset>\n`);

// Concept: alles dicht voor zoekmachines. Productie: open, met de sitemap erin.
writeFileSync('dist/robots.txt', PROD
  ? `User-agent: *\nAllow: /\n\nSitemap: ${ADRES}/sitemap.xml\n`
  : 'User-agent: *\nDisallow: /\n');

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
const REDIRECTS = `# Oude WordPress-adressen -> de pagina hier die hetzelfde doet.
# /puurgenieten/ en /algemene-leveringsvoorwaarden/ staan hier niet: dat zijn
# op deze site echte pagina's op hetzelfde adres (zie bouw.mjs).
/over-frame-media/      /over-ons             301
/referenties/           /over-ons#referenties 301
/vacatures/             /vacature             301
/formats/               /formats              301
/op-rtl4/               /formats              301
/mondzorg-tv/           /formats              301
/studiofaciliteiten/    /studio               301
/algemene-leveringsvoorwaarden/  /voorwaarden 301
/programma-idee         /programma-idee/      301
/hello-world/           /                     301
/feed/                  /                     301
/category/*             /                     301
/author/*               /                     301

# De zes studio-pdf's stonden onder de downloads van de oude site.
/wp-content/uploads/2023/04/1-Tekst-Studioruimte-A.pdf          /studio 301
/wp-content/uploads/2023/04/2-Tekst-Regieruimte.pdf             /studio 301
/wp-content/uploads/2023/04/3-Tekst-Studioruimte-B.pdf          /studio 301
/wp-content/uploads/2023/04/4-Productieruimte-Greenroom.pdf     /studio 301
/wp-content/uploads/2023/04/5-Tekst-Visagieruimte.pdf           /studio 301
/wp-content/uploads/2023/04/6-Dagdeelprijzen-tips-voor-op-TV.pdf /studio 301
`;
writeFileSync('dist/_redirects', REDIRECTS);

// --- de oude afbeeldingen op hun oude adres --------------------------------
// Het logo en de studiofoto's staan in Google Afbeeldingen op hun eigen
// /wp-content/uploads/-adres. Een nieuwe site op een nieuw pad is voor Google
// een andere afbeelding, dus die bestanden gaan mee zoals ze zijn. Ze worden
// nergens vanaf gelinkt en staan niet in de sitemap - ze moeten alleen blijven
// antwoorden. Ophalen: node haal-oude-media.mjs
let oud = 0;
if (existsSync('oud')) {
  const tel = map => {
    for (const i of readdirSync(map, { withFileTypes: true })) {
      if (i.isDirectory()) tel(`${map}/${i.name}`); else oud++;
    }
  };
  kopieerMap('oud', 'dist');
  tel('oud');
}

// --- de poort op de productiebouw ------------------------------------------
// Een conceptwoord of het conceptadres dat meegaat naar www.framemedia.tv is
// geen schoonheidsfoutje: het staat dan onder een formulier dat de klant net
// heeft ingevuld, of het wijst een zoekmachine naar het conceptadres. Dus kijkt
// de bouw zelf na wat er in dist/ staat in plaats van erop te vertrouwen.
if (PROD) {
  const klachten = [];
  const niet = /conceptversie|concept version|Konzeptversion|jouwconcept\.app|noindex/i;
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
    console.error('\nDe productiebouw is gestopt - dit mag niet mee naar www.framemedia.tv:');
    for (const k of klachten) console.error('  ' + k);
    process.exit(1);
  }
}

console.log(`${n} paginas gebouwd (${TALEN.map(t => `${t.code}: ${PAGINAS[t.code].length}`).join(', ')})`);
console.log(`adres: ${ADRES}${PROD ? '  [PRODUCTIE: geen noindex, robots open]' : '  [concept: noindex, robots dicht]'}`);
console.log(`${oud} oude bestanden op hun oude pad meegenomen`);
console.log(`${formulierenGeraakt} formulieren gekoppeld aan /api/forms/`);
if (PROD) {
  console.log('\nLET OP - dit staat niet in de bouw en moet in Cloudflare zelf:');
  console.log('  1. Always Use HTTPS aan op de zone framemedia.tv.');
  console.log('  2. Een Redirect Rule framemedia.tv/* -> https://www.framemedia.tv/$1 (301),');
  console.log('     anders staat dezelfde site op twee hostnamen.');
  console.log('  3. Sitemap aanmelden in Search Console zodra de site live staat.');
}
