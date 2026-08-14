import type { RichBlock } from './types';

/**
 * Portable Text: het formaat waarin het beheer een bericht bewaart. Hier staat
 * alleen wat de site ervan moet weten buiten het renderen om, namelijk hoe je
 * er losse woorden uit haalt en hoe je er een samenvatting van maakt.
 */

/** De platte tekst van een bericht, voor zoekresultaten en samenvattingen. */
export function platteTekst(blokken: RichBlock[]): string {
  return blokken
    .filter((blok) => blok._type === 'block' && Array.isArray((blok as any).children))
    .map((blok) =>
      (blok as any).children
        .map((kind: any) => (typeof kind?.text === 'string' ? kind.text : ''))
        .join(''),
    )
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Losse regels tekst omgezet naar blokken, voor berichten die als één stuk
 * tekst binnenkomen. Een lege regel begint een nieuwe alinea.
 */
export function blokkenVanTekst(tekst: string): RichBlock[] {
  return tekst
    .split(/\n{2,}/)
    .map((stuk) => stuk.trim())
    .filter(Boolean)
    .map((stuk, i) => ({
      _type: 'block',
      _key: `t${i}`,
      style: 'normal',
      children: [{ _type: 'span', _key: `t${i}s`, text: stuk, marks: [] }],
    }));
}

/**
 * Wat er op de kaart komt te staan. De inleiding als die er is, anders het
 * begin van het bericht zelf. Geleend en niet gekopieerd: het bericht begint
 * dan met het stuk zelf in plaats van twee keer hetzelfde te zeggen.
 */
export function samenvatten(intro: string, body: RichBlock[], max = 190): string {
  const tekst = intro.trim() || platteTekst(body);
  if (tekst.length <= max) return tekst;
  const snee = tekst.slice(0, max);
  const spatie = snee.lastIndexOf(' ');
  return `${(spatie > max * 0.6 ? snee.slice(0, spatie) : snee).replace(/[.,;:]$/, '')}…`;
}
