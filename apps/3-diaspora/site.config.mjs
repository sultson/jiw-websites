/**
 * Eén plek waar staat op welk adres deze site woont.
 *
 * De canonical in index.html, de hreflang-regels, og:url, het schema.org-blok
 * en elke regel in de sitemap noemen dit adres. Stond het in al die bestanden
 * los, dan is een verhuizing een zoekactie waarbij er altijd één blijft staan.
 *
 * De kale domeinnaam, niet www: de Worker leidt www en het adres op
 * jouwidealewebsite.nl hierheen met één 301, en dat rijtje leidt hij af van
 * precies deze regel.
 */
export const SITE_URL = 'https://3diaspora.org';

/** Het adres waarop de site is opgeleverd. Blijft doorsturen; niet weghalen. */
export const VORIG_ADRES = 'https://3diaspora.jouwidealewebsite.nl';

export const SITE_NAAM = '3 Diaspora';

/** Waar het formulier en de directe mailtjes heen gaan. */
export const CONTACT_EMAIL = 'info@3diaspora.org';

/* ------------------------------------------------------------------ */
/*  De lancering                                                       */
/* ------------------------------------------------------------------ */

/**
 * Het moment waarop de site opengaat, met de tijdzone erin geschreven.
 *
 * Curacao staat het hele jaar op UTC-4 en kent geen zomertijd, dus -04:00 is
 * hier geen aanname die in oktober omvalt. Door de zone in de tekst te zetten
 * is dit een vast moment op de wereldklok: een bezoeker in Amsterdam telt af
 * naar hetzelfde punt als een bezoeker in Kralendijk, alleen staat het op zijn
 * eigen klok dan 02:18 's nachts.
 *
 * Is dit moment voorbij, dan verdwijnt het aftellen vanzelf en blijft er niets
 * van over; src/Aftellen.tsx hoeft daarna niet weggehaald te worden.
 */
export const LANCERING = '2026-08-18T20:18:00-04:00';

/** Hoe lang na de lancering een nieuwe bezoeker nog confetti krijgt. */
export const CONFETTI_VENSTER_MS = 5 * 60 * 1000;

/* ------------------------------------------------------------------ */
/*  De talen en de pagina's                                            */
/* ------------------------------------------------------------------ */

/**
 * Engels staat op het kale adres, Nederlands en Papiamentu krijgen een
 * voorvoegsel. Dezelfde tabel staat in src/taal.tsx; build-scripts kunnen geen
 * .tsx inlezen, vandaar hier nog een keer. Wijzigt er iets, dan op beide
 * plekken.
 */
export const TALEN = ['en', 'nl', 'pap'];

export const VOORVOEGSEL = {en: '', nl: '/nl', pap: '/pap'};

/** Elk pad dat de router kent, met het gewicht dat het in de sitemap krijgt. */
export const PADEN = [
  {pad: '/', gewicht: 1.0},
  {pad: '/bonaire', gewicht: 0.8},
  {pad: '/curacao', gewicht: 0.8},
  {pad: '/nederland', gewicht: 0.8},
  {pad: '/agenda', gewicht: 0.7},
  {pad: '/galerij', gewicht: 0.7},
  {pad: '/steun', gewicht: 0.7},
  {pad: '/contact', gewicht: 0.6},
];

/** Het adres van een pad in een taal, zoals href() in src/taal.tsx het maakt. */
export function padVoor(taal, pad) {
  return `${VOORVOEGSEL[taal]}${pad === '/' && taal !== 'en' ? '' : pad}`;
}
