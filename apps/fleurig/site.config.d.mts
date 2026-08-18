/**
 * De vorm van site.config.mjs.
 *
 * De configuratie zelf is gewoon JavaScript, want scripts/prerender.mjs en
 * scripts/seo.mjs draaien met node en kunnen geen TypeScript inlezen. Deze
 * verklaring staat ernaast zodat vite.config.ts en de Worker er wel types van
 * krijgen zonder dat `allowJs` aan hoeft: met allowJs aan gaat TypeScript op
 * zoek naar @cloudflare/workers-types op een manier die in een pnpm-workspace
 * niets vindt, en dan kent de Worker zijn eigen omgeving niet meer.
 */

export declare const SITE_URL: string;
export declare const VORIG_ADRES: string;
export declare const SITE_NAAM: string;

export declare const WINKEL: {
  telefoon: string;
  telefoonWeergave: string;
  email: string;
  straat: string;
  postcode: string;
  plaats: string;
  regio: string;
  land: string;
  lat: number;
  lon: number;
};

export type Pagina = {
  /** Het adres waarop de bezoeker de pagina vindt, met schuine streep aan het eind. */
  pad: string;
  /** Het HTML-bestand in de bron, relatief aan de app. */
  bestand: string;
  /** De component die de pagina tekent; gebruikt om de datum van de laatste wijziging te bepalen. */
  component: string;
  prioriteit?: string;
  frequentie?: string;
  inSitemap: boolean;
};

export declare const PAGINAS: Pagina[];
