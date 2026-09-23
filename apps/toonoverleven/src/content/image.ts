import type { Img } from './types';

/**
 * Een fotoverwijzing van Sanity draagt zijn eigen afmetingen mee:
 * `image-<assetId>-<breedte>x<hoogte>-<ext>`. Daar komt de verhouding vandaan,
 * zodat niemand in het beheer een verhouding hoeft in te typen, en de drie
 * maten die de site nodig heeft zijn één upload met drie sets parameters.
 *
 * Het uitpluizen van de verwijzing staat los van de maten die erop gebouwd
 * worden: de Worker vraagt om een eigen snede voor het voorbeeld van een
 * gedeelde link, en heeft dan hetzelfde uitpluiswerk nodig zonder de rest.
 */
export function assetVanRef(
  ref: string,
  projectId: string,
  dataset: string,
): { basis: string; breedte: number; hoogte: number } | null {
  const delen = ref.split('-');
  if (delen.length < 4 || delen[0] !== 'image') return null;

  const ext = delen[delen.length - 1];
  const maten = delen[delen.length - 2];
  const assetId = delen.slice(1, -2).join('-');
  const [breedte, hoogte] = maten.split('x').map(Number);
  if (!assetId || !breedte || !hoogte) return null;

  return {
    basis: `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}-${maten}.${ext}`,
    breedte,
    hoogte,
  };
}

export type ImageFraming = { crop?: { left?: number; top?: number; right?: number; bottom?: number }; hotspot?: { x?: number; y?: number } };
export function imgVanRef(ref: string, projectId: string, dataset: string, framing?: ImageFraming): Img | null {
  const asset = assetVanRef(ref, projectId, dataset);
  if (!asset) return null;

  const crop = framing?.crop;
  const left = Math.round((crop?.left ?? 0) * asset.breedte);
  const top = Math.round((crop?.top ?? 0) * asset.hoogte);
  const width = Math.max(1, asset.breedte - left - Math.round((crop?.right ?? 0) * asset.breedte));
  const height = Math.max(1, asset.hoogte - top - Math.round((crop?.bottom ?? 0) * asset.hoogte));
  const rect = crop ? `&rect=${left},${top},${width},${height}` : '';
  const x = Math.max(0, Math.min(1, ((framing?.hotspot?.x ?? .5) * asset.breedte - left) / width));
  const y = Math.max(0, Math.min(1, ((framing?.hotspot?.y ?? .5) * asset.hoogte - top) / height));
  const bij = (w: number) => `${asset.basis}?w=${w}&q=78&fit=max&auto=format${rect}`;

  return {
    ratio: width / height,
    position: `${x * 100}% ${y * 100}%`,
    mini: bij(240),
    klein: bij(560),
    breed: bij(1100),
    vol: bij(1800),
  };
}

/** Het adres van een foto, of hij nu uit het beheer komt of uit public/img. */
export const bron = (foto: Img | string, maat: 'mini' | 'klein' | 'breed' | 'vol' = 'breed'): string =>
  typeof foto === 'string' ? foto : foto[maat];
