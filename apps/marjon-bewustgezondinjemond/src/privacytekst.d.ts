/**
 * De vorm van privacytekst.js.
 *
 * De tekst zelf staat in gewoon JavaScript omdat hij letterlijk haar eigen
 * document is en er geen regel code in staat; deze verklaring staat ernaast
 * zodat privacy.tsx er types van krijgt zonder dat `allowJs` aan hoeft (zie
 * tsconfig.json voor waarom dat uit staat).
 */

export declare const VERKLARING_BIJGEWERKT: string;

export type Partij = {
  naam: string;
  land: string;
  categorie: string;
  doel: string;
  gegevens: string;
};

export declare const PARTIJEN: Partij[];

/**
 * Vier soorten blok. `v` staat hier als unie en niet per soort apart, omdat
 * privacy.tsx op `t` kijkt en `v` daarna zelf tot het goede type maakt - de
 * manier waarop dat bestand al geschreven was.
 */
export type Blok = {
  t: 'p' | 'lijst' | 'cookies' | 'partijen';
  v: string | string[] | {naam: string; termijn: string}[];
};

export type Hoofdstuk = {
  kop: string;
  blokken: Blok[];
};

export declare const HOOFDSTUKKEN: Hoofdstuk[];
