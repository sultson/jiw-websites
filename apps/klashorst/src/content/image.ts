import type { Img } from './types';

/**
 * Sanity image references carry their own dimensions:
 * `image-<assetId>-<width>x<height>-<ext>`. That is where the aspect ratio for
 * the 3D room comes from, so nobody has to type a ratio into the CMS, and the
 * three sizes the site needs are one upload with three sets of parameters.
 *
 * The reference is unpicked separately from the sizes built on top of it: the
 * Worker asks for a crop of its own for link previews, and needs the same
 * parsing without the rest.
 */
export function assetFromRef(
  ref: string,
  projectId: string,
  dataset: string,
): { base: string; width: number; height: number } | null {
  const parts = ref.split('-');
  if (parts.length < 4 || parts[0] !== 'image') return null;

  const ext = parts[parts.length - 1];
  const dimensions = parts[parts.length - 2];
  const assetId = parts.slice(1, -2).join('-');
  const [width, height] = dimensions.split('x').map(Number);
  if (!assetId || !width || !height) return null;

  return {
    base: `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}-${dimensions}.${ext}`,
    width,
    height,
  };
}

export function imgFromRef(ref: string, projectId: string, dataset: string): Img | null {
  const asset = assetFromRef(ref, projectId, dataset);
  if (!asset) return null;

  const { base, width, height } = asset;
  const at = (w: number, params = 'auto=format') => `${base}?w=${w}&q=80&fit=max&${params}`;

  return {
    ratio: width / height,
    grid: at(700),
    // Explicit WebP: this one is decoded into a WebGL texture, so it is not the
    // place to let content negotiation pick something exotic.
    room: at(1100, 'fm=webp'),
    full: at(2200),
  };
}
