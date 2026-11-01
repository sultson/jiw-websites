/**
 * Een plek waar staat op welk adres deze site woont, en wat de zaak is.
 *
 * Elke pagina noemt zichzelf in de canonical, in og:url en in de schema.org
 * blokken, en de sitemap somt ze op. Stond dat adres in de HTML zelf, dan is
 * een verhuizing naar het eigen domein een zoekactie door een handvol
 * bestanden waarbij er altijd een blijft staan. Nu is het deze ene regel.
 */

/**
 * LET OP bij de verhuizing naar het eigen domein.
 *
 * GuySa heeft al een eigen site op `guysa-inboedels.be`, en die staat op dit
 * moment live. In het concept wees de canonical daar naartoe. Dat is netjes
 * bedoeld, maar het betekent letterlijk: "wat hier staat telt niet mee, kijk
 * daar maar". Een pagina met zo'n canonical wordt niet geindexeerd, hoe goed
 * hij ook is, dus er viel aan de vindbaarheid van deze site niets te meten.
 *
 * Sinds 01-11-2026 wijst de canonical naar deze site zelf. Daarmee kan hij
 * geindexeerd worden en is er iets te volgen in Search Console. De keerzijde
 * hoort erbij: er staan nu twee vindbare sites over hetzelfde bedrijf, en voor
 * dezelfde zoekwoorden. Zolang dit een voorstel is dat nog niet gewonnen is, is
 * dat een afweging en geen vergissing — maar ze mogen niet allebei blijven
 * staan. Neemt GuySa de site af, dan verhuist hij naar het eigen domein en
 * stuurt dit adres met een 301 door; gaat het niet door, dan hoort hier
 * `noindex` op.
 */
export const SITE_URL = 'https://guysa.jouwidealewebsite.nl';

export const SITE_NAAM = 'GuySa Inboedels & Opruimingen';

/** Het domein van de zaak zelf. Staat in de footer en in schema.org als `sameAs`. */
export const EIGEN_SITE = 'https://guysa-inboedels.be';

/* ------------------------------------------------------------------ */
/*  De zaak                                                            */
/* ------------------------------------------------------------------ */

/**
 * Telefoon, mail en de voorwaarden komen van hun eigen site; die zijn van hen
 * en openbaar. Er staat met opzet geen vestigingsadres bij: GuySa werkt vanuit
 * de bestelwagen en heeft geen balie, en een adres dat wij erbij verzinnen komt
 * in schema.org terecht en daarmee in Google.
 */
export const ZAAK = {
  telefoon: '+32472688835',
  /* Zoals een Vlaamse lezer hem schrijft. +32472688835 klopt voor een telefoon
     en voor schema.org, maar in een zin leest het als een foutcode. */
  telefoonWeergave: '0472 68 88 35',
  mail: 'info@guysa-inboedels.be',
  plaats: 'Antwerpen',
  regio: 'Antwerpen',
  land: 'BE',
  /* Het midden van het werkgebied, niet een vestiging. Gebruikt voor de
     straal in schema.org. */
  lat: 51.17,
  lon: 4.47,
  /* De straal waarbinnen ze dagelijks rijden, in meters. De gemeentes staan in
     PLAATSEN in src/ui.tsx; dit is dezelfde regio als cirkel, voor een
     zoekmachine die geen lijst met gemeentes leest. */
  straalMeter: 25_000,
  voorwaarden: 'https://guysa-inboedels.be/products/pages/terms',
  privacy: 'https://guysa-inboedels.be/products/pages/privacy-policy',
  googleReviews: 'https://www.google.com/search?q=GuySa+Inboedels+en+Opruimingen+Reviews&hl=nl',
};

/* ------------------------------------------------------------------ */
/*  De pagina's                                                        */
/* ------------------------------------------------------------------ */

/**
 * `bestand` wijst naar het HTML-bestand in de bron, `pad` is het adres waarop
 * de bezoeker hem vindt. Beide worden gebruikt door scripts/prerender.mjs,
 * scripts/seo.mjs en scripts/audit-seo.mjs, zodat een nieuwe pagina zich op een
 * plek aanmeldt en dan meteen ook in de sitemap en in de controle meeloopt.
 *
 * Het zijn er nu twee: de site is een lange pagina met ankers, en de 404. Dat
 * is bewust zo gebleven bij het overzetten — losse dienstpagina's maken
 * ("inboedel opruimen", "inboedel opkopen", "ontruiming na overlijden") is de
 * grootste winst die er voor de vindbaarheid nog te halen valt, maar daar is
 * tekst voor nodig die GuySa zelf moet aanleveren. Zie SEO.md.
 */
export const PAGINAS = [
  {pad: '/', bestand: 'index.html', component: 'src/App.tsx', inSitemap: true},
  {pad: '/404.html', bestand: '404.html', component: 'src/pages/NietGevonden.tsx', inSitemap: false},
];
