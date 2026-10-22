/**
 * De vorm van site.config.mjs.
 *
 * De configuratie zelf is gewoon JavaScript, want scripts/prerender.mjs en
 * scripts/seo.mjs draaien met node en kunnen geen TypeScript inlezen. Deze
 * verklaring staat ernaast zodat vite.config.ts, de componenten in src/ en de
 * Worker er wel types van krijgen zonder dat `allowJs` aan hoeft: met allowJs
 * aan gaat TypeScript op zoek naar @cloudflare/workers-types op een manier die
 * in een pnpm-workspace niets vindt, en dan kent de Worker zijn eigen omgeving
 * niet meer.
 */

export declare const SITE_URL: string;
export declare const VORIG_ADRES: string;
export declare const SITE_NAAM: string;
export declare const HAAR_NAAM: string;

export declare const PRAKTIJK: {
  telefoon: string;
  telefoonWeergave: string;
  email: string;
  /** Het KvK-nummer van de eenmanszaak. Staat in de footer en op /privacy. */
  kvk: string;
  plaats: string;
  regio: string;
  land: string;
  instagram: string;
  facebook: string;
};

export type Pagina = {
  /** Het adres waarop de bezoeker de pagina vindt, zonder schuine streep aan het eind. */
  pad: string;
  /** Het HTML-bestand dat prerender.mjs in dist/ schrijft, relatief aan dist. */
  bestand: string;
  /** De slug van de pijler; titel en omschrijving komen dan uit src/specialisaties.tsx. */
  spec?: string;
  titel?: string;
  kort?: string;
  /** Een ander pad als canonical, voor een adres dat op een andere pagina uitkomt. */
  canoniek?: string;
  noindex?: boolean;
  inSitemap: boolean;
};

export declare const PAGINAS: Pagina[];
