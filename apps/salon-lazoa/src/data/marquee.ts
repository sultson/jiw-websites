export type MarqueeItem = {
  id: string;
  src: string;
  alt: string;
  url: string;
};

const IG = (s: string) => `https://www.instagram.com/p/${s}/`;

export const marqueeItems: MarqueeItem[] = [
  { id: 'cat-eye-copper', src: '/nail-cat-eye-copper.webp',     alt: 'Bruin cat-eye gellak met koperen glitter',           url: IG('DPW1R9ajNw-') },
  { id: 'mocha-copper',   src: '/nail-mocha-copper.webp',       alt: 'Mocha bruin met koperen shimmer accent',            url: IG('DPzbHvbjpbl') },
  { id: 'red-almond',     src: '/nail-red-almond.webp',         alt: 'Rood amandelvormige gellak',                        url: IG('DQfBZ1OjLdW') },
  { id: 'bordeaux',       src: '/nail-bordeaux.webp',           alt: 'Bordeauxrode gellak in herfstcollectie',            url: IG('DQMvh5ajPsE') },
  { id: 'mauve-short',    src: '/nail-mauve-short.webp',        alt: 'Mauve chestnut gellak op korte natuurlijke nagel',  url: IG('DQZZ34ZjA6j') },
  { id: 'chocolate-deep', src: '/nail-chocolate-deep.webp',     alt: 'Donker chocolade bruine gellak',                    url: IG('DQLuThKDACl') },
  { id: 'nude-shimmer',   src: '/nail-nude-shimmer.webp',       alt: 'Milky nude shimmer set',                            url: IG('DXEDs5pDIfQ') },
  { id: 'nude-greige',    src: '/nail-nude-greige.webp',        alt: 'Nude greige gellak in clean stijl',                 url: IG('DPRbqUFjJEk') },
  { id: 'french-bottle',  src: '/editorial-urbannails-bottle.webp', alt: 'French manicure met Urban Nails gelpolish',     url: IG('DOEuvLHjkWo') },
  { id: 'fan-jeans',      src: '/editorial-fan-jeans.webp',     alt: 'Kleurenwaaier met nude tinten',                     url: IG('DQMK-hQjE_X') },
  { id: 'fan-rings',      src: '/editorial-fan-rings.webp',     alt: 'Klant kiest kleur uit de kleurenwaaier',            url: IG('DRWsWpSjKbh') },
  { id: 'brow-lash',      src: '/brow-lash-green-eye.webp',     alt: 'Lash lift en gestylde wenkbrauw, groene ogen',      url: IG('DQrswVQjPZC') },
];
