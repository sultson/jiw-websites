/**
 * Eén plek waar staat op welk adres deze site woont, en wat de winkel is.
 *
 * Elke pagina noemt zichzelf in de canonical, in og:url en in de schema.org
 * blokken, en de sitemap somt ze allemaal op. Stond dat adres in de HTML zelf,
 * dan is een verhuizing naar een eigen domein een zoekactie door zeven
 * bestanden waarbij er altijd één blijft staan. Nu is het één regel.
 *
 * Dit is nog een conceptadres. Wordt het een echte site, dan verhuist SITE_URL
 * naar het eigen domein en blijft dit adres doorsturen (zie worker/index.ts en
 * VORIG_ADRES in de zusterapp fleurig).
 */
export const SITE_URL = 'https://bloei-concept.jouwconcept.app';

export const SITE_NAAM = 'Bloei!';

/* De winkel is open. De schakelaar staat er nog omdat fleurig hem heeft en de
   twee sites dezelfde onderdelen delen; hij hoort hier op false te blijven. */
export const TIJDELIJK_GESLOTEN = false;

export const GESLOTEN = {
  kop: 'Tijdelijk gesloten',
  kort: 'De winkel is dicht en we nemen geen aanvragen aan.',
  lang: 'Bloei! is tijdelijk gesloten. Zodra we weer opengaan, staat het hier en op Facebook.',
};

/* ------------------------------------------------------------------ */
/*  De winkel                                                          */
/* ------------------------------------------------------------------ */

/**
 * LET OP — nog niet bevestigd door de winkel.
 *
 * Het adres en het telefoonnummer komen uit de openbare vermelding van Vershal
 * Ouddorp, waar Bloei! bij hoort. Ze zijn niet door de eigenaren zelf
 * doorgegeven. De openingstijden zijn nergens te vinden en staan hier als
 * aanname, omdat een winkelpagina zonder rooster niet te beoordelen is.
 *
 * Alles in dit blok moet langs de klant voordat deze site live gaat. Zie
 * NOTITIES.md voor de volledige lijst.
 */
export const WINKEL = {
  telefoon: '+31686194517',
  /* Zoals een Nederlandse lezer hem schrijft. +31686194517 klopt voor een
     telefoon en voor schema.org, maar in een zin leest het als een foutcode. */
  telefoonWeergave: '06 86 19 45 17',
  /* Geen mailadres. Er staat er geen op hun Facebook en nergens anders
     openbaar, dus elk adres dat hier zou staan is er een die wij verzonnen
     hebben — en dan komt een aanvraag aan op een postbus die niet bestaat.
     Telefoon en WhatsApp staan er wel; die zijn bevestigd. Geeft de winkel er
     een door, dan komt hij hier terug en verschijnt hij vanzelf in de voet, bij
     de openingstijden en in de bevestigingsmail. */
  straat: 'Hogepad 9',
  postcode: '3253 BH',
  plaats: 'Ouddorp',
  regio: 'Zuid-Holland',
  land: 'NL',
  lat: 51.81876,
  lon: 3.93414,
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
  {pad: '/assortiment/', bestand: 'assortiment/index.html', component: 'src/pages/Assortiment.tsx', prioriteit: '0.9', frequentie: 'monthly', inSitemap: true},
  {pad: '/kerst/', bestand: 'kerst/index.html', component: 'src/pages/Kerst.tsx', prioriteit: '0.9', frequentie: 'monthly', inSitemap: true},
  {pad: '/abonnement/', bestand: 'abonnement/index.html', component: 'src/pages/Abonnement.tsx', prioriteit: '0.9', frequentie: 'monthly', inSitemap: true},
  {pad: '/cadeau/', bestand: 'cadeau/index.html', component: 'src/pages/Cadeau.tsx', prioriteit: '0.9', frequentie: 'monthly', inSitemap: true},
  /* De bedankpagina staat op noindex: hij bestaat alleen na het versturen van
     een aanvraag en heeft in de zoekresultaten niets te zoeken. */
  {pad: '/bedankt/', bestand: 'bedankt/index.html', component: 'src/pages/Bedankt.tsx', inSitemap: false},
  {pad: '/404.html', bestand: '404.html', component: 'src/pages/NietGevonden.tsx', inSitemap: false},
];
