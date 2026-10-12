/**
 * De kop van een pagina: title, description, canonical, og:, twitter:, robots
 * en de schema.org-blokken.
 *
 * Eén functie, twee gebruikers. vite.config.ts zet hiermee de kop van de
 * voorpagina in index.html (ook tijdens `pnpm dev`, anders heeft een pagina
 * lokaal geen titel), en scripts/prerender.mjs vervangt het blok per pagina in
 * de gebouwde bestanden. Zo kan de kop van /privacy niet uit de pas lopen met
 * die van de voorpagina, en staat het adres van de site op één plek
 * (site.config.mjs).
 */
import {HAAR_NAAM, PRAKTIJK, SITE_NAAM, SITE_URL} from '../site.config.mjs';

/** Wat er in de og:image staat. Een eigen afbeelding per pagina is er niet. */
const DEEL_BEELD = `${SITE_URL}/img/hero-glimlach.jpg`;
const DEEL_BEELD_ALT = 'Marjon Ooteman, integraal mondhygiënist';

function teken(tekst) {
  return String(tekst)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/* ------------------------------------------------------------------ */
/*  schema.org                                                         */
/* ------------------------------------------------------------------ */

/**
 * Wie ze is. Staat op elke pagina, want op elke pagina is de vraag "van wie is
 * deze site" dezelfde. `@id` zorgt dat het overal om dezelfde persoon gaat en
 * niet om acht losse personen met dezelfde naam.
 */
const PERSOON = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#marjon`,
  name: HAAR_NAAM,
  jobTitle: 'Integraal mondhygiënist',
  url: `${SITE_URL}/`,
  image: DEEL_BEELD,
  telephone: PRAKTIJK.telefoon,
  email: `mailto:${PRAKTIJK.email}`,
  description:
    'Integraal mondhygiënist, woonachtig in Schagen. Online coaching over mondgezondheid met ' +
    'aandacht voor voeding, darmen, leefstijl en dagelijkse gewoontes.',
  knowsAbout: [
    'Mondhygiëne',
    'Preventieve mondzorg',
    'Tandvleesontsteking',
    'Voeding en mondgezondheid',
    'Mondzorg voor sporters',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: PRAKTIJK.plaats,
    addressRegion: PRAKTIJK.regio,
    addressCountry: PRAKTIJK.land,
  },
  areaServed: {'@type': 'AdministrativeArea', name: PRAKTIJK.regio},
  sameAs: [PRAKTIJK.instagram, PRAKTIJK.facebook],
};

const SITE = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#site`,
  url: `${SITE_URL}/`,
  name: SITE_NAAM,
  inLanguage: 'nl-NL',
  publisher: {'@id': `${SITE_URL}/#marjon`},
};

/**
 * Vijf vragen en antwoorden die op het conceptadres als FAQPage in de
 * schema.org-gegevens stonden.
 *
 * Ze staan hier bewust NIET meer in de gegevens van de pagina. Google eist dat
 * wat je als FAQPage opgeeft woordelijk zichtbaar op diezelfde pagina staat, en
 * dat was hier nooit zo: de vragen stonden alleen in de code. Dat is precies
 * wat een handmatige maatregel oplevert ("structured data die niet overeenkomt
 * met de zichtbare inhoud"), en sinds Google de FAQ-resultaten in augustus 2023
 * voor vrijwel alle sites uitzette, leverde het ook niets meer op.
 *
 * Ze blijven hier staan omdat het goede vragen zijn, in haar eigen woorden, en
 * omdat ze de moeite waard zijn als blok op de voorpagina. Komen ze daar als
 * echte tekst te staan, dan kan het FAQPage-blok hieronder er weer in en vangt
 * scripts/audit-seo.mjs het als ze weer uit elkaar lopen.
 */
export const VRAGEN_NOG_NIET_OP_DE_PAGINA = [
  [
    'Wat betekent integraal mondhygiënist?',
    'Naast het reinigen en behandelen van gebit en tandvlees kijk ik ook naar voeding, darmen, slaap en spanning. Die factoren bepalen mee hoe je tandvlees erbij staat.',
  ],
  [
    'Waarom is een ontstoken tandvlees meer dan een mondprobleem?',
    'Tandvleesontsteking is een laaggradige ontsteking. Je lichaam is er continu energie aan kwijt, ook als je er zelf weinig van merkt. Dat merk je onder andere aan je herstel.',
  ],
  [
    'Waarom is mondgezondheid belangrijk voor sporters?',
    'Bij sporters komen cariës, erosie en tandvleesontsteking vaker voor door minder speeksel, stress, koolhydraatrijke voeding en sportdrank. Een ontsteking kost energie en kan herstel na een blessure vertragen.',
  ],
  [
    'Wat vind ik bij Tips en tools en bij Inspiratie?',
    'Tips en tools is het praktische deel: stappenplannen, dagelijkse rituelen, poetsinstructies en hoe je voeding en essentiële olie laagdrempelig verweeft in je dag. Inspiratie is het verdiepende deel: artikelen over actuele gezondheidsthema’s, verhalen uit de praktijk en de link tussen mond en lichaam.',
  ],
  [
    'Geeft Marjon Ooteman ook lezingen?',
    'Lezingen en workshops voor teams, praktijken en sportclubs zijn in ontwikkeling. Interesse kun je nu al doorgeven via het contactformulier.',
  ],
];

function kruimels(pagina) {
  const delen = [{naam: 'Home', pad: '/'}];
  if (pagina.pad.startsWith('/aanpak/')) {
    /* Mijn aanpak heeft geen eigen pagina, het is een blok op de voorpagina.
       Dus wijst deze kruimel daarheen in plaats van naar een adres dat niet
       bestaat. */
    delen.push({naam: 'Mijn aanpak', pad: '/#specialisaties'});
  }
  delen.push({naam: pagina.kruimel ?? pagina.titel, pad: pagina.pad});

  return {
    '@type': 'BreadcrumbList',
    itemListElement: delen.map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: d.naam,
      item: `${SITE_URL}${d.pad === '/' ? '/' : d.pad}`,
    })),
  };
}

function schema(pagina) {
  const isHome = pagina.pad === '/';
  const adres = `${SITE_URL}${pagina.canoniek ?? pagina.pad}`;

  const blokken = [
    PERSOON,
    SITE,
    {
      '@type': 'WebPage',
      '@id': `${adres}#pagina`,
      url: adres,
      name: pagina.titel,
      description: pagina.kort,
      inLanguage: 'nl-NL',
      isPartOf: {'@id': `${SITE_URL}/#site`},
      about: {'@id': `${SITE_URL}/#marjon`},
      primaryImageOfPage: DEEL_BEELD,
    },
  ];

  if (!isHome) blokken.push(kruimels(pagina));

  return {'@context': 'https://schema.org', '@graph': blokken};
}

/* ------------------------------------------------------------------ */
/*  Het blok zelf                                                      */
/* ------------------------------------------------------------------ */

export const KOP_START = '<!--kop:start-->';
export const KOP_EIND = '<!--kop:end-->';

/**
 * @param pagina een regel uit PAGINAS in site.config.mjs, aangevuld met titel
 *   en kort als die van een pijler komen (zie scripts/prerender.mjs).
 */
export function kopBlok(pagina) {
  const adres = `${SITE_URL}${pagina.canoniek ?? pagina.pad}`;
  const titel = pagina.titel;
  const kort = pagina.kort;

  const regels = [
    `<title>${teken(titel)}</title>`,
    `<meta name="description" content="${teken(kort)}" />`,
    /* Ook op een noindex-pagina staat de canonical: hij kost niets en als die
       pagina ooit wel in de index mag, wijst hij al naar het goede adres. */
    `<link rel="canonical" href="${teken(adres)}" />`,
    pagina.noindex
      ? '<meta name="robots" content="noindex, nofollow" />'
      : '<meta name="robots" content="index, follow, max-image-preview:large" />',
    '',
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${teken(SITE_NAAM)}" />`,
    `<meta property="og:title" content="${teken(titel)}" />`,
    `<meta property="og:description" content="${teken(kort)}" />`,
    `<meta property="og:url" content="${teken(adres)}" />`,
    `<meta property="og:image" content="${teken(DEEL_BEELD)}" />`,
    `<meta property="og:image:alt" content="${teken(DEEL_BEELD_ALT)}" />`,
    '<meta property="og:locale" content="nl_NL" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${teken(titel)}" />`,
    `<meta name="twitter:description" content="${teken(kort)}" />`,
    `<meta name="twitter:image" content="${teken(DEEL_BEELD)}" />`,
    '',
    '<script type="application/ld+json">',
    JSON.stringify(schema(pagina)),
    '</script>',
  ];

  return `${KOP_START}\n    ${regels.join('\n    ')}\n    ${KOP_EIND}`;
}

/**
 * Het blok in een pagina vervangen. Werpt als de markeringen er niet staan:
 * dan heeft iemand index.html aangepast en zou de pagina zonder titel en
 * zonder canonical de deur uit gaan, en dat valt bij een crawler eerder op dan
 * bij ons.
 */
export function zetKop(html, pagina) {
  const start = html.indexOf(KOP_START);
  const eind = html.indexOf(KOP_EIND);
  if (start === -1 || eind === -1) {
    throw new Error(`kop: ${KOP_START} ... ${KOP_EIND} niet gevonden in de pagina (${pagina.pad})`);
  }
  return html.slice(0, start) + kopBlok(pagina) + html.slice(eind + KOP_EIND.length);
}
