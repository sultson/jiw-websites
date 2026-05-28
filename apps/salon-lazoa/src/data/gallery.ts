export type GalleryImage = {
  src: string;
  alt: string;
  cat: 'nails' | 'brows';
  span?: 'wide' | 'tall';
};

export const galleryImages: GalleryImage[] = [
  { src: '/nail-bordeaux.webp',            alt: 'Bordeauxrode gellak in herfstcollectie',           cat: 'nails', span: 'wide' },
  { src: '/nail-cat-eye-copper.webp',      alt: 'Bruin cat-eye gellak met koperen glitter',         cat: 'nails' },
  { src: '/nail-chocolate-deep.webp',      alt: 'Donker chocolade bruine gellak',                   cat: 'nails' },
  { src: '/nail-mocha-copper.webp',        alt: 'Mocha bruin met koperen shimmer accent',           cat: 'nails' },
  { src: '/nail-red-almond.webp',          alt: 'Rood amandelvormige gellak',                       cat: 'nails' },
  { src: '/nail-mauve-short.webp',         alt: 'Mauve chestnut op korte natuurlijke nagel',        cat: 'nails' },
  { src: '/nail-nude-shimmer.webp',        alt: 'Milky nude shimmer set',                           cat: 'nails' },
  { src: '/nail-nude-greige.webp',         alt: 'Nude greige gellak in clean stijl',                cat: 'nails' },
  { src: '/editorial-urbannails-bottle.webp', alt: 'French manicure met Urban Nails gelpolish',     cat: 'nails', span: 'tall' },
  { src: '/brow-lash-green-eye.webp',      alt: 'Lash lift en gestylde wenkbrauw, groene ogen',     cat: 'brows' },
  { src: '/brow-lamination-fluffy.webp',   alt: 'Brow lamination met opgekamde haartjes',           cat: 'brows' },
  { src: '/brow-lash-blonde.webp',         alt: 'Wenkbrauw gestyled, lash lift bij blonde klant',   cat: 'brows' },
  { src: '/brow-result-face.webp',         alt: 'Resultaat browstyling, klant na behandeling',      cat: 'brows' },
];
