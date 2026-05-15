/**
 * Portfolio images sourced from the Marktplaats listing.
 */
export type PortfolioItem = {
  src: string;
  altKey: 'show.alt.dak' | 'show.alt.schilder' | 'show.alt.gevel' | 'show.alt.inspectie' | 'show.alt.werk';
};

export const portfolio: PortfolioItem[] = [
  { src: '/portfolio/p-01.webp', altKey: 'show.alt.werk' },
  { src: '/portfolio/p-02.webp', altKey: 'show.alt.dak' },
  { src: '/portfolio/p-03.webp', altKey: 'show.alt.werk' },
  { src: '/portfolio/p-04.webp', altKey: 'show.alt.schilder' },
  { src: '/portfolio/p-05.webp', altKey: 'show.alt.gevel' },
];
