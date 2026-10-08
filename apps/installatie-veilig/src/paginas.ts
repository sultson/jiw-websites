import {PLAATSEN} from './ui';

/**
 * Elke pagina van de site, op één plek.
 *
 * Tot oktober 2026 was dit één pagina met ankers. Google indexeerde hem niet
 * en een anker is voor een zoekmachine geen eigen adres, dus "groepenkast
 * vervangen Breda" of "elektricien Oosterhout" had nergens een pagina om op
 * te landen. Nu heeft elke dienst en elke plaats uit het werkgebied een eigen
 * adres, met een eigen titel en kop.
 *
 * scripts/prerender.mjs bakt elke pagina als losse HTML (`/pad` wordt
 * `dist/pad.html`) en zet de koppen hieruit in de <head>; src/main.tsx kiest
 * met hetzelfde pad welke pagina React overneemt. public/sitemap.xml volgt
 * deze lijst, en de prerender valt om als die twee uit elkaar lopen.
 */

export type Dienst = 'groepenkast' | 'laadpaal';

export type Plaats = {
  naam: string;
  slug: string;
  /** Eén zin die alleen over deze plaats klopt. */
  zin: string;
  lon: number;
  lat: number;
};

type Basis = {
  pad: string;
  title: string;
  description: string;
};

export type Pagina =
  | (Basis & {soort: 'home'})
  | (Basis & {soort: 'dienst'; dienst: Dienst; kop: string})
  | (Basis & {soort: 'plaats'; plaats: Plaats});

export const DIENST_PAD: Record<Dienst, string> = {
  groepenkast: '/groepenkast-vervangen-breda',
  laadpaal: '/laadpaal-installeren-breda',
};

const ZINNEN: Record<string, string> = {
  Prinsenbeek: 'Prinsenbeek ligt tegen de westkant van Breda en hoort sinds 1997 bij de gemeente Breda.',
  Princenhage: 'Princenhage was tot 1942 een eigen gemeente en is nu de westelijke wijk van Breda.',
  Teteringen: 'Teteringen ligt aan de noordoostkant van Breda en hoort sinds 1997 bij de gemeente Breda.',
  Bavel: 'Bavel ligt ten zuidoosten van Breda en hoort sinds 1997 bij de gemeente Breda.',
  Ulvenhout: 'Ulvenhout ligt aan de zuidkant van Breda, tegen het Ulvenhoutse Bos, en hoort sinds 1997 bij de gemeente Breda.',
  Dorst: 'Dorst ligt tussen Breda en Oosterhout en hoort bij de gemeente Oosterhout.',
  Oosterhout: 'Oosterhout ligt direct ten noorden van Breda en is een eigen gemeente.',
  Made: 'Made ligt ten noorden van Breda en hoort bij de gemeente Drimmelen.',
  'Etten-Leur': 'Etten-Leur ligt ten westen van Breda, langs de A58.',
  Rijsbergen: 'Rijsbergen ligt ten zuidwesten van Breda en hoort bij de gemeente Zundert.',
  Zundert: 'Zundert ligt ten zuiden van Breda, richting de Belgische grens.',
};

const slug = (naam: string) => naam.toLowerCase().replace(/[^a-z0-9]+/g, '-');

/** Breda zelf staat niet in deze lijst: dat is de homepage en de dienstpagina's. */
export const PLAATS_PAGINAS: Plaats[] = PLAATSEN.filter(([, , , thuis]) => !thuis).map(
  ([naam, lon, lat]) => {
    const zin = ZINNEN[naam];
    if (!zin) throw new Error(`paginas: geen zin voor ${naam}`);
    return {naam, slug: slug(naam), zin, lon, lat};
  },
);

export const plaatsPad = (p: Plaats) => `/elektricien-${p.slug}`;

const [, BREDA_LON, BREDA_LAT] = PLAATSEN.find(([, , , thuis]) => thuis)!;

/** Hemelsbreed, afgerond op hele kilometers. */
function km(lon1: number, lat1: number, lon2: number, lat2: number) {
  const r = (g: number) => (g * Math.PI) / 180;
  const a =
    Math.sin(r(lat2 - lat1) / 2) ** 2 +
    Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lon2 - lon1) / 2) ** 2;
  return Math.round(6371 * 2 * Math.asin(Math.sqrt(a)));
}

export const kmVanafBreda = (p: Plaats) => km(BREDA_LON, BREDA_LAT, p.lon, p.lat);

export const PAGINAS: Pagina[] = [
  {
    soort: 'home',
    pad: '/',
    title: 'Elektricien Breda | Groepenkasten en laadpalen | Installatie Veilig',
    description:
      'Elektricien in Breda en omgeving voor groepenkasten en laadpalen. Elke dag open van 08:00 tot 23:00 uur. U weet vooraf wat het kost.',
  },
  {
    soort: 'dienst',
    dienst: 'groepenkast',
    pad: DIENST_PAD.groepenkast,
    kop: 'Groepenkast vervangen in Breda',
    title: 'Groepenkast vervangen in Breda, vanaf € 619 | Installatie Veilig',
    description:
      'Nieuwe groepenkast in Breda en omgeving, 1-fase of 3-fase. Vaste prijs vanaf € 619 inclusief montage en btw, in een halve tot hele dag geplaatst.',
  },
  {
    soort: 'dienst',
    dienst: 'laadpaal',
    pad: DIENST_PAD.laadpaal,
    kop: 'Laadpaal installeren in Breda',
    title: 'Laadpaal installeren in Breda, vanaf € 1.495 | Installatie Veilig',
    description:
      'Zaptec, Enphase of Alfen laadpaal thuis in Breda en omgeving. Compleet geïnstalleerd met eigen groep en load balancing, vanaf € 1.495 inclusief btw.',
  },
  ...PLAATS_PAGINAS.map((plaats): Pagina => ({
    soort: 'plaats',
    plaats,
    pad: plaatsPad(plaats),
    title: `Elektricien in ${plaats.naam} | Groepenkast en laadpaal | Installatie Veilig`,
    description: `Elektricien in ${plaats.naam} voor een nieuwe groepenkast of een laadpaal. Vaste prijs vooraf, elke dag bereikbaar van 08:00 tot 23:00 uur.`,
  })),
];

/** Het pad zoals de Worker het serveert: zonder schuine streep aan het eind. */
export function zoekPagina(pad: string): Pagina {
  const schoon = pad.replace(/\/+$/, '') || '/';
  return PAGINAS.find((p) => p.pad === schoon) ?? PAGINAS[0];
}
