import type { Img } from './types';

/**
 * Sanity image references carry their own dimensions:
 * `image-<assetId>-<width>x<height>-<ext>`. That is where the aspect ratio for
 * the 3D room comes from, so nobody has to type a ratio into the CMS, and the
 * sizes the site needs are one upload with several sets of parameters.
 *
 * The reference is unpicked separately from the sizes built on top of it: the
 * Worker asks for a crop of its own for link previews, and needs the same
 * parsing without the rest.
 */
/**
 * Where the hero's photographs are asked for.
 *
 * Our own origin, not cdn.sanity.io, and only for these: the first painting on
 * the museum's front page is the largest thing on the screen, and fetching it
 * from a second host costs a DNS lookup, a connection and a TLS handshake
 * before a byte of it moves — about six tenths of a second on a phone, spent
 * on the one image the page is waiting for. On this origin the connection that
 * carried the document is already open. The Worker answers this path by
 * passing the request on to Sanity and holding the answer at the edge; every
 * other photograph on the site is below the fold and stays on the CDN.
 */
const FOTO = '/foto/';

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

/**
 * How wide a card in the collection grid is, so the browser can pick a
 * photograph the size of the box rather than one the size of the page. Two
 * columns on a phone, three from tablet, four from a laptop, inside a
 * 1400-pixel measure.
 */
export const GRID_SIZES = '(min-width: 1400px) 340px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw';

/**
 * The still strip behind the room. Its images are sized by their height, not
 * their width, so this is what an upright painting comes out at: about 300
 * device-independent pixels wide on a phone and about 460 on a desktop.
 */
export const STRIP_SIZES = '(min-width: 640px) 460px, 300px';

export function imgFromRef(ref: string, projectId: string, dataset: string): Img | null {
  const asset = assetFromRef(ref, projectId, dataset);
  if (!asset) return null;

  const { base, width, height } = asset;
  // `<assetId>-<breedte>x<hoogte>.<ext>`: what the Worker needs to rebuild the
  // Sanity address, and nothing else.
  const eigen = FOTO + base.slice(base.lastIndexOf('/') + 1);
  /**
   * Quality per job, not one number for the whole site. These are thickly
   * painted canvases and they encode expensively: at q=80 a 640-pixel WebP of
   * one of them is 127 KB, which is a hero image nobody waits for. The two
   * sizes a visitor studies a work at, the lightbox and the room, keep their
   * quality; the thumbnail and the strip behind the room do not need it.
   */
  const at = (w: number, q: number, params = 'auto=format', host = base) =>
    `${host}?w=${w}&q=${q}&fit=max&${params}`;
  const set = (widths: number[], q: number, params?: string, host?: string) =>
    widths.map((w) => `${at(w, q, params, host)} ${w}w`).join(', ');

  return {
    ratio: width / height,
    grid: at(700, 74),
    gridSet: set([320, 480, 700, 1000], 74),
    // The still hero, before the room is asked for. Explicit WebP, like the
    // texture below: this is the one image on the page whose bytes are on the
    // critical path, and content negotiation is not the place for a surprise.
    strip: at(640, 72, 'fm=webp', eigen),
    stripSet: set([400, 560, 640, 1000], 72, 'fm=webp', eigen),
    // Decoded into a WebGL texture, so its own size and format: 900 is more
    // than a work ever occupies on screen, even brought forward, and 1100 was
    // costing four times the decode of the pixels it put on the wall.
    room: at(900, 78, 'fm=webp'),
    full: at(2200, 82),
  };
}
