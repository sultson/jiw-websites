/**
 * Portfolio images (sourced from werkspot, owned by the company).
 * Filenames are written assuming optimize-images has converted to .webp.
 */
export type PortfolioItem = {
  src: string;
  /** Caption is shown only as alt + lightbox label; deliberately abstract - no project address. */
  altKey: 'show.alt.dak' | 'show.alt.schilder' | 'show.alt.gevel' | 'show.alt.inspectie' | 'show.alt.werk';
};

export const portfolio: PortfolioItem[] = [
  { src: '/portfolio/p-57021466.webp', altKey: 'show.alt.dak' },
  { src: '/portfolio/p-60d6c93b.webp', altKey: 'show.alt.dak' },
  { src: '/portfolio/p-635df8a2.webp', altKey: 'show.alt.werk' },
  { src: '/portfolio/p-54f8fbfc.webp', altKey: 'show.alt.gevel' },
  { src: '/portfolio/p-0e227a16.webp', altKey: 'show.alt.dak' },
  { src: '/portfolio/p-c55e208e.webp', altKey: 'show.alt.dak' },
  { src: '/portfolio/p-c43b901c.webp', altKey: 'show.alt.gevel' },
  { src: '/portfolio/p-309f17c8.webp', altKey: 'show.alt.schilder' },
  { src: '/portfolio/p-8ab9ae69.webp', altKey: 'show.alt.dak' },
  { src: '/portfolio/p-d08ab94f.webp', altKey: 'show.alt.dak' },
  { src: '/portfolio/p-8200ee61.webp', altKey: 'show.alt.werk' },
  { src: '/portfolio/p-dd5b116a.webp', altKey: 'show.alt.werk' },
  { src: '/portfolio/p-204fc178.webp', altKey: 'show.alt.dak' },
  { src: '/portfolio/p-916cf3bc.webp', altKey: 'show.alt.gevel' },
  { src: '/portfolio/p-83870912.webp', altKey: 'show.alt.werk' },
  { src: '/portfolio/p-3ef67738.webp', altKey: 'show.alt.werk' },
  { src: '/portfolio/p-e3bd54e2.webp', altKey: 'show.alt.werk' },
  { src: '/portfolio/p-c6da1a38.webp', altKey: 'show.alt.werk' },
  { src: '/portfolio/p-91cb2b01.webp', altKey: 'show.alt.gevel' },
  { src: '/portfolio/p-f8e5f8bd.webp', altKey: 'show.alt.dak' },
];
