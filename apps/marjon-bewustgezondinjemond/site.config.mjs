/**
 * Eén plek waar staat op welk adres deze site woont en welke pagina's er zijn.
 *
 * Elke pagina noemt zichzelf in de title, de description, de canonical, in
 * og:url en in de schema.org blokken, en de sitemap somt ze allemaal op. Stond
 * dat per pagina in de HTML, dan is een verhuizing een zoekactie door acht
 * bestanden waarbij er altijd één blijft staan. Nu is het één regel hier.
 *
 * Plain JavaScript en geen TypeScript, want dit bestand wordt gelezen door
 * vite.config.ts, door de build-scripts in scripts/, door de Worker én door de
 * componenten in src/. Een .mjs kan dat allemaal; een .ts niet.
 */

/** Het eigen domein van Marjon. De kale variant is de canonieke host. */
export const SITE_URL = 'https://bewustgezondinjemond.nl';

/** Het adres waarop de site is opgeleverd. Blijft doorsturen; niet weghalen. */
export const VORIG_ADRES = 'https://marjon.jouwidealewebsite.nl';

export const SITE_NAAM = 'Bewust Gezond in je Mond';
export const HAAR_NAAM = 'Marjon Ooteman';

/* ------------------------------------------------------------------ */
/*  Haar gegevens                                                      */
/* ------------------------------------------------------------------ */

/* Dezelfde gegevens als bovenaan src/App.tsx, hier nog een keer omdat
   build-scripts en de Worker geen .tsx kunnen inlezen. Wijzigt er iets, dan op
   beide plekken. */
export const PRAKTIJK = {
  telefoon: '+31620594924',
  /* Zoals een Nederlandse lezer hem schrijft. +31620594924 klopt voor een
     telefoon en voor schema.org, maar in een zin leest het als een foutcode. */
  telefoonWeergave: '06 20594924',
  email: 'info@marjonooteman.nl',
  plaats: 'Schagen',
  regio: 'Noord-Holland',
  land: 'NL',
  instagram: 'https://www.instagram.com/marjon_ooteman_1/',
  facebook: 'https://www.facebook.com/people/Bewust-gezond-in-je-mond/61593185683528/',
};

/* ------------------------------------------------------------------ */
/*  De pagina's                                                        */
/* ------------------------------------------------------------------ */

/**
 * De volgorde is de volgorde in de sitemap.
 *
 * `pad` is het adres waarop de bezoeker de pagina vindt, `bestand` het bestand
 * dat scripts/prerender.mjs in dist/ schrijft. Die twee verschillen omdat
 * Cloudflare deze site zonder schuine streep aan het eind serveert
 * (html_handling: drop-trailing-slash in wrangler.jsonc): het bestand heet
 * aanpak/voeding/index.html en komt uit op /aanpak/voeding. Dat is precies de
 * vorm waarin de adressen al een maand bij Google staan, dus die houden we.
 *
 * `titel` en `kort` worden door prerender.mjs in de head gezet en door de
 * componenten gebruikt als iemand binnen de site doorklikt (dan wisselt de
 * pagina zonder herladen en moet de titel mee). Eén bron, dus die twee kunnen
 * niet uit elkaar lopen.
 */
export const PAGINAS = [
  {
    pad: '/',
    bestand: 'index.html',
    /* Een zoekresultaat laat ongeveer 60 tekens titel zien. De oude titel was
       er 84 en werd dus halverwege "Noord-Holland" afgekapt. De merknaam staat
       niet meer in de titel maar wel in het domein zelf, in de h1 en in
       og:site_name: wie op de naam zoekt vindt hem daar. */
    titel: `Integraal mondhygiënist in Noord-Holland | ${HAAR_NAAM}`,
    kort:
      'Marjon Ooteman, integraal mondhygiënist in Noord-Holland. Over je mond, je voeding ' +
      'en je leefstijl, en hoe die samen je gezondheid bepalen.',
    inSitemap: true,
  },
  {
    pad: '/aanpak/voeding',
    bestand: 'aanpak/voeding/index.html',
    spec: 'voeding',
    inSitemap: true,
  },
  {
    pad: '/aanpak/ontspanning',
    bestand: 'aanpak/ontspanning/index.html',
    spec: 'ontspanning',
    inSitemap: true,
  },
  {
    pad: '/aanpak/zingeving',
    bestand: 'aanpak/zingeving/index.html',
    spec: 'zingeving',
    inSitemap: true,
  },
  {
    pad: '/aanpak/natuurlijke-remedies',
    bestand: 'aanpak/natuurlijke-remedies/index.html',
    spec: 'natuurlijke-remedies',
    inSitemap: true,
  },
  {
    pad: '/aanpak/mondhygiene',
    bestand: 'aanpak/mondhygiene/index.html',
    spec: 'mondhygiene',
    inSitemap: true,
  },
  {
    pad: '/privacy',
    bestand: 'privacy/index.html',
    titel: `Privacyverklaring | ${HAAR_NAAM}`,
    kort:
      'Hoe Bewust Gezond in je Mond omgaat met je gegevens: wat er verwerkt wordt, waarom, ' +
      'hoe lang het bewaard blijft en welke cookies deze website gebruikt.',
    inSitemap: true,
  },
  /* Het oude adres van de patiëntenverklaring. Dat document bestaat niet meer
     (geen behandelpraktijk, alleen online coaching), maar het adres is gedeeld
     en staat bij Google, dus het blijft werken en laat /privacy zien. Niet in
     de sitemap en met een canonical naar /privacy: één pagina, één adres. */
  {
    pad: '/privacyverklaring',
    bestand: 'privacyverklaring/index.html',
    titel: `Privacyverklaring | ${HAAR_NAAM}`,
    kort:
      'Hoe Bewust Gezond in je Mond omgaat met je gegevens: wat er verwerkt wordt, waarom, ' +
      'hoe lang het bewaard blijft en welke cookies deze website gebruikt.',
    canoniek: '/privacy',
    inSitemap: false,
  },
  /* Werkoverleg met verzonnen voorbeeldreviews, geen onderdeel van de site:
     staat niet in het menu, niet in de sitemap en op noindex. */
  {
    pad: '/reviews-voorbeeld',
    bestand: 'reviews-voorbeeld/index.html',
    titel: `Voorbeeld: reviews in Google-stijl | ${HAAR_NAAM}`,
    kort: 'Werkoverleg met voorbeeldreviews. Geen onderdeel van de site.',
    noindex: true,
    inSitemap: false,
  },
  {
    pad: '/404.html',
    bestand: '404.html',
    titel: `Deze pagina bestaat niet | ${HAAR_NAAM}`,
    kort: 'Deze pagina bestaat niet of is verhuisd.',
    noindex: true,
    inSitemap: false,
  },
];
