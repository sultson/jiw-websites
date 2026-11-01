/**
 * De vorm van site.config.mjs.
 *
 * De configuratie zelf is gewoon JavaScript, want scripts/prerender.mjs,
 * scripts/seo.mjs en scripts/audit-seo.mjs draaien met node en kunnen geen
 * TypeScript inlezen. Deze verklaring staat ernaast zodat vite.config.ts, de
 * componenten en de Worker er wel types van krijgen zonder dat `allowJs` aan
 * hoeft: met allowJs aan gaat TypeScript op zoek naar @cloudflare/workers-types
 * op een manier die in een pnpm-workspace niets vindt, en dan kent de Worker
 * zijn eigen omgeving niet meer.
 */

export declare const SITE_URL: string;
export declare const SITE_NAAM: string;
export declare const EIGEN_SITE: string;

export declare const ZAAK: {
  telefoon: string;
  telefoonWeergave: string;
  mail: string;
  plaats: string;
  regio: string;
  land: string;
  lat: number;
  lon: number;
  straalMeter: number;
  voorwaarden: string;
  privacy: string;
  googleReviews: string;
};

export type Pagina = {
  /** Het adres waarop de bezoeker de pagina vindt. */
  pad: string;
  /** Het HTML-bestand in de bron, relatief aan de app. */
  bestand: string;
  /** De component die de pagina tekent; gebruikt om de datum van de laatste wijziging te bepalen. */
  component: string;
  inSitemap: boolean;
};

export declare const PAGINAS: Pagina[];
