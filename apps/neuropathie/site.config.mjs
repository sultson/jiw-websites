/** Eén plek voor het adres van de site en de lijst pagina's. */

export const SITE_URL = 'https://neuropathie.jouwidealewebsite.nl';

/**
 * Elke pagina meldt zich hier aan: vite bouwt hem als los HTML-bestand,
 * scripts/prerender.mjs bakt de inhoud erin en scripts/seo.mjs zet de
 * indexeerbare pagina's in de sitemap.
 */
export const PAGINAS = [
  { pad: '/', bestand: 'index.html', indexeerbaar: true },
  { pad: '/404.html', bestand: '404.html', indexeerbaar: false },
];
