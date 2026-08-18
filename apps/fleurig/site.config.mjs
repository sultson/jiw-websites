/**
 * Eén plek waar staat op welk adres deze site woont.
 *
 * Elke pagina noemt zichzelf in de canonical, in og:url en in de schema.org
 * blokken, en de sitemap somt ze allemaal op. Stond dat adres in de HTML zelf,
 * dan is een verhuizing naar een eigen domein een zoekactie door zeven
 * bestanden waarbij er altijd één blijft staan. Nu is het één regel.
 *
 * Dit is het adres waarop de site echt te bereiken hoort te zijn. Wijst het naar
 * een domein dat nog niet antwoordt, dan haalt een canonical de pagina uit de
 * index in plaats van hem alvast klaar te zetten, en stuurt de Worker het oude
 * adres door naar een deur die dicht zit.
 *
 * De kale domeinnaam, niet www: de Worker leidt www en het oude adres op
 * jouwidealewebsite.nl hierheen met één 301, en dat rijtje leidt hij af van
 * precies deze regel.
 */
export const SITE_URL = 'https://bloemenwinkelfleurig.nl';

/** Het adres waarop de site is opgeleverd. Blijft doorsturen; niet weghalen. */
export const VORIG_ADRES = 'https://fleurig.jouwidealewebsite.nl';

export const SITE_NAAM = 'Fleurig! Bloemenwinkel';

/* ------------------------------------------------------------------ */
/*  De winkel                                                          */
/* ------------------------------------------------------------------ */

/* Dezelfde gegevens als in src/ui.tsx, hier nog een keer omdat build-scripts
   geen .tsx kunnen inlezen. Wijzigt er iets, dan op beide plekken. */
export const WINKEL = {
  telefoon: '+31630943626',
  /* Zoals een Nederlandse lezer hem schrijft. +31630943626 klopt voor een
     telefoon en voor schema.org, maar in een zin leest het als een foutcode. */
  telefoonWeergave: '06 30 94 36 26',
  email: 'fleurig26@gmail.com',
  straat: 'Molendijk 9-11',
  postcode: '3262 AH',
  plaats: 'Oud-Beijerland',
  regio: 'Zuid-Holland',
  land: 'NL',
  lat: 51.82671,
  lon: 4.41076,
};

/* ------------------------------------------------------------------ */
/*  De pagina's                                                        */
/* ------------------------------------------------------------------ */

/**
 * De volgorde is de volgorde in de sitemap. `prioriteit` is een hint en geen
 * weegschaal: Google gebruikt hem nauwelijks, maar hij kost niets en maakt de
 * onderlinge verhouding leesbaar voor wie de sitemap opent.
 *
 * `bestand` wijst naar het HTML-bestand in de bron; `pad` is het adres waarop
 * de bezoeker hem vindt. Beide worden gebruikt door scripts/prerender.mjs en
 * scripts/seo.mjs, zodat een nieuwe pagina op één plek wordt aangemeld.
 */
export const PAGINAS = [
  {pad: '/', bestand: 'index.html', component: 'src/App.tsx', prioriteit: '1.0', frequentie: 'weekly', inSitemap: true},
  {pad: '/boeketten/', bestand: 'boeketten/index.html', component: 'src/pages/Boeketten.tsx', prioriteit: '0.9', frequentie: 'monthly', inSitemap: true},
  {pad: '/abonnement/', bestand: 'abonnement/index.html', component: 'src/pages/Abonnement.tsx', prioriteit: '0.9', frequentie: 'monthly', inSitemap: true},
  {pad: '/rouwbloemen/', bestand: 'rouwbloemen/index.html', component: 'src/pages/Rouwbloemen.tsx', prioriteit: '0.9', frequentie: 'monthly', inSitemap: true},
  {pad: '/trouwbloemen/', bestand: 'trouwbloemen/index.html', component: 'src/pages/Trouwbloemen.tsx', prioriteit: '0.9', frequentie: 'monthly', inSitemap: true},
  /* De bedankpagina staat op noindex: hij bestaat alleen na het versturen van
     een aanvraag en heeft in de zoekresultaten niets te zoeken. */
  {pad: '/bedankt/', bestand: 'bedankt/index.html', component: 'src/pages/Bedankt.tsx', inSitemap: false},
  {pad: '/404.html', bestand: '404.html', component: 'src/pages/NietGevonden.tsx', inSitemap: false},
];
