import ruw from './paginas.json';

/**
 * De inhoud van de site zoals het bestuur hem heeft vastgesteld.
 *
 * De klant leverde een klikbare mock-up van 72 pagina's aan: de structuur, de
 * navigatie, de teksten en de vormtaal waar de nieuwe site aan moet voldoen.
 * Die pagina's zijn eruit gelezen (scripts/mockup-extract.py) in plaats van
 * overgetypt, zodat er geen zin verloren gaat en een nieuwe versie van de
 * mock-up opnieuw ingelezen kan worden.
 *
 * Wat hier staat is de redactionele laag: koppen, alinea's, kaarten en links.
 * Alles wat verandert zonder dat er iemand aan de site werkt (de agenda, de
 * berichten, de sponsoren, de praktische gegevens) komt uit het beheer en
 * wordt er in de pagina's overheen gelegd.
 */

/** Een stukje lopende tekst: gewoon, vet, cursief of een link. */
export type Stuk =
  | string
  | { tekst: string; href: string; extern: boolean }
  | { tekst: string };

export type Tekst = Stuk[];

export type Actie = { label: string; href: string; soort: 'hoofd' | 'rand' | 'tekst' };

export type Kaart = {
  icoon?: string | null;
  kop: string;
  tekst: Tekst[];
  acties?: Actie[];
};

export type Bron = {
  href: string;
  bron: string;
  kop: string;
  tekst: string;
  label: string;
};

export type Blok =
  | { soort: 'tekst'; id?: string; kicker?: string; kop?: string; tekst?: Tekst[]; punten?: Tekst[]; acties?: Actie[] }
  | { soort: 'kaarten'; id?: string; kicker?: string; kop?: string; tekst?: Tekst[]; punten?: Tekst[]; kaarten?: Kaart[]; acties?: Actie[] }
  | { soort: 'kennis'; id?: string; kicker?: string; kop?: string; intro?: Tekst; inzichten?: Kaart[]; grens?: { kop: string; tekst: Tekst[] } }
  | { soort: 'bronnen'; id?: string; kicker?: string; kop?: string; intro?: Tekst; bronnen?: Bron[] }
  | { soort: 'echtheid'; kop: string; tekst: Tekst[] }
  | { soort: 'kaart-plek'; kop: string; tekst: Tekst[]; acties?: Actie[] }
  | { soort: 'verkenner'; id?: string; kop?: string; intro?: Tekst; filters?: string[]; kaarten?: unknown[] };

export type Kruimel = { label: string; href?: string };

export type Hero = {
  kicker: string;
  titel: string;
  lead: Tekst;
  onder: Tekst;
  acties: Actie[];
  /** De sleutel van het sfeerbeeld; de echte foto staat in beelden.ts. */
  beeld: string;
  alt: string;
  route: boolean;
};

export type Zijkaart = {
  kicker: string;
  kop: string;
  tekst: Tekst[];
  acties: Actie[];
};

export type PaginaSoort =
  | 'home' | 'hub' | 'route' | 'regular' | 'knowledge' | 'question' | 'faq'
  | 'stories' | 'activities' | 'agenda' | 'contact' | 'location' | 'referrer';

export type Rubriek =
  | 'home' | 'activities' | 'young' | 'near' | 'stories' | 'knowledge' | 'practical' | 'route' | 'about' | 'news';

export type Pagina = {
  pad: string;
  titel: string;
  omschrijving: string;
  soort: PaginaSoort;
  sectie: Rubriek;
  kruimels?: Kruimel[];
  hero: Hero;
  /** De regel met de controledatum, de bronnen en 'geen medisch advies'. */
  vertrouwen?: Tekst[];
  blokken: Blok[];
  zijkaart?: Zijkaart;
};

const bestand = ruw as unknown as { iconen: Record<string, string>; paginas: Pagina[] };

export const ICOONPADEN: Record<string, string> = bestand.iconen;

export const PAGINAS: Pagina[] = bestand.paginas;

/**
 * Wanneer de teksten voor het laatst inhoudelijk zijn nagekeken.
 *
 * Staat op de kennis- en antwoordpagina's, omdat de opdrachtgever in zijn eigen
 * eisen vraagt om te tonen wanneer een antwoord is gecontroleerd. Eén plek, dus
 * de datum kan nooit op de ene pagina anders staan dan op de andere. Werk hem
 * bij zodra iemand de teksten opnieuw heeft doorgelezen.
 */
export const CONTROLEDATUM = '23 augustus 2026';

/** Dezelfde dag, zoals schema.org en een sitemap hem willen lezen. */
export const CONTROLEDATUM_ISO = '2026-08-23';

const opPad = new Map(PAGINAS.map((p) => [p.pad, p]));

export const vindPagina = (pad: string): Pagina | undefined => opPad.get(pad);

export const REDACTIEPADEN: string[] = PAGINAS.map((p) => p.pad);

/** De pagina's onder één rubriek, voor het menu en de sitemap. */
export const inRubriek = (rubriek: Rubriek): Pagina[] =>
  PAGINAS.filter((p) => p.sectie === rubriek);
