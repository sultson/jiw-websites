/**
 * Photography in public/images is replaced in place when a lander is
 * redesigned, and Cloudflare's edge plus the visitor's browser will happily
 * keep serving the previous file under the same name. Every reference to an
 * image therefore carries a version query: the <img>, its srcset, the og:image,
 * the LCP preload and the schema.org image all have to agree, or the preload
 * fetches a second copy of the same picture.
 *
 * Bump this on the day you swap an asset.
 */
export const ASSET_VERSION = '20260901';

export function asset(src: string): string {
  return src.includes('?') ? src : `${src}?v=${ASSET_VERSION}`;
}
