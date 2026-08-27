import { PAGINAS as REDACTIE, vindPagina } from './inhoud';

/**
 * Hoe een pagina heet, in het tabblad en in een voorbeeld van een gedeelde
 * link.
 *
 * Bewust gedeeld met de Worker: die schrijft deze regels in de HTML voordat de
 * pagina verstuurd wordt, en dat is de versie die een zoekmachine of WhatsApp
 * ooit ziet. De app schrijft dezelfde regels als hij zonder herladen naar een
 * andere pagina gaat. Eén bron, dus ze kunnen niet uit elkaar lopen.
 *
 * Hier staat geen DOM in: de Worker importeert dit bestand ook.
 */

export const SITE_NAAM = 'Toon over Leven';
export const SITE_URL = 'https://toonoverleven.jouwidealewebsite.nl';

type PaginaMeta = { titel: string; omschrijving: string };

/**
 * De pagina's die niet uit de redactielaag komen omdat ze uit het beheer
 * gevuld worden: het nieuws en de losse berichten eronder.
 */
const EIGEN: Record<string, PaginaMeta> = {
  '/nieuws': {
    titel: 'Nieuws en verhalen',
    omschrijving:
      'Nieuwe workshops, een wandeling die verzet wordt, een dag die goed uitpakte. Wat er bij Toon over Leven in Zeewolde gebeurt.',
  },
};

/**
 * Elk adres dat de site heeft: de 72 bestemmingen uit de vastgestelde
 * structuur, plus het nieuws uit het beheer.
 */
export const PADEN: readonly string[] = [
  ...REDACTIE.map((p) => p.pad),
  ...Object.keys(EIGEN),
];

export type Pad = string;

/**
 * Twee koppen komen in de vastgestelde structuur meer dan één keer voor, en
 * een zoekresultaat waarin twee regels hetzelfde heten helpt niemand. Alleen
 * de titel in het tabblad verandert; de kop op de pagina blijft zoals het
 * bestuur hem heeft vastgesteld.
 */
const EIGEN_TITEL: Record<string, string> = {
  '/voor-naasten/activiteiten-voor-naasten': 'Iets doen als naaste',
  '/ervaringen/jong-en-kanker': 'Ervaringen van jonge mensen',
  '/voor-jou/jong-en-kanker': 'Jong en kanker: waar wil je beginnen',
};

const REDACTIEMETA: Record<string, PaginaMeta> = Object.fromEntries(
  REDACTIE.map((p) => [p.pad, { titel: p.titel, omschrijving: p.omschrijving }]),
);

export const PAGINAS: Record<string, PaginaMeta> = Object.fromEntries(
  Object.entries({ ...REDACTIEMETA, ...EIGEN }).map(([pad, meta]) => [
    pad,
    EIGEN_TITEL[pad] ? { ...meta, titel: EIGEN_TITEL[pad] } : meta,
  ]),
);

/**
 * De site heette eerder acht pagina's lang anders. Wie een oude link opent of
 * er een bewaard heeft, hoort op de nieuwe plek uit te komen en niet op een
 * foutmelding.
 */
export const VERHUISD: Record<string, string> = {
  '/wie-we-zijn': '/over-ons/wie-wij-zijn',
  '/agenda': '/activiteiten/agenda',
  '/vrijwilliger': '/over-ons/vrijwilliger-worden',
  '/steun': '/over-ons/steun-ons',
  '/verantwoording': '/over-ons/organisatie-en-verantwoording',
  '/contact': '/praktisch/contact',
  '/over-ons/index.html': '/over-ons',
  '/voor-jou': '/',
};

export const NIET_GEVONDEN = 'Pagina niet gevonden';

export const paginaTitel = (kop: string) => `${kop} · ${SITE_NAAM}`;


/** De titel zoals hij in het tabblad hoort te staan. */
export function titelVan(pad: string): string {
  const vast = PAGINAS[pad];
  if (!vast) return paginaTitel(NIET_GEVONDEN);
  return pad === '/' ? `${vast.titel} · ${SITE_NAAM}` : paginaTitel(vast.titel);
}

/** Het adres zonder afsluitende schuine streep: wat een pagina is. */
export function schoonPad(pathname: string): string {
  const pad = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return pad || '/';
}

export const absoluutUrl = (pad: string): string => `${SITE_URL}${pad === '/' ? '/' : pad}`;

/** Of dit adres een pagina uit de vastgestelde structuur is. */
export const isRedactiePad = (pad: string): boolean => Boolean(vindPagina(pad));

/**
 * Een kop omgezet naar een adres: "Nieuwe mandalagroep" wordt
 * "nieuwe-mandalagroep". Waar een bericht op terugvalt als er in het beheer
 * nooit een adres is gegenereerd, zodat elk bericht hoe dan ook bereikbaar is.
 *
 * Gedeeld met de Worker: die lost een binnenkomend adres hiermee op, de app
 * lost hetzelfde adres in de browser op, en die twee moeten het over elk
 * bericht eens zijn.
 */
export function slugify(waarde: string): string {
  const slug = waarde
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 64)
    .replace(/^-+|-+$/g, '');
  return slug || 'bericht';
}

/** Kort af tot wat een zoekresultaat of een linkvoorbeeld werkelijk toont. */
export function kort(waarde: string, max = 165): string {
  const tekst = waarde.replace(/\s+/g, ' ').trim();
  if (tekst.length <= max) return tekst;
  const snee = tekst.slice(0, max);
  const spatie = snee.lastIndexOf(' ');
  return `${(spatie > max * 0.6 ? snee.slice(0, spatie) : snee).replace(/[.,;:]$/, '')}…`;
}
