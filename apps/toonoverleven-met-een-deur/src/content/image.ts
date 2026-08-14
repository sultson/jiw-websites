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

export function imgVanRef(ref: string, projectId: string, dataset: string): Img | null {
  const asset = assetVanRef(ref, projectId, dataset);
  if (!asset) return null;

  const bij = (w: number) => `${asset.basis}?w=${w}&q=78&fit=max&auto=format`;

  return {
    ratio: asset.breedte / asset.hoogte,
    klein: bij(560),
    breed: bij(1100),
    vol: bij(1800),
  };
}

/** Het adres van een foto, of hij nu uit het beheer komt of uit public/img. */
export const bron = (foto: Img | string, maat: keyof Omit<Img, 'ratio'> = 'breed'): string =>
  typeof foto === 'string' ? foto : foto[maat];
