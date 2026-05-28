export type WorkItem = {
  src: string;
  alt: string;
  cat: 'biab' | 'color' | 'seasonal';
};

// "biab" = natural / nude / subtle. "color" = bold colour / nail-art. "seasonal" = themed.
export const heroTiles: { src: string; alt: string }[] = [
  { src: '/work/hero-1-valentine-french.webp',  alt: 'Rode french met hartjes — gellak met nail art' },
  { src: '/work/hero-2-pastel-favoriet.webp',   alt: 'Pastel mix van mint, lila, geel en blauw' },
  { src: '/work/hero-3-aubergine-glitter.webp', alt: 'Aubergine paars met glitter accent' },
  { src: '/work/hero-4-chocolate-gold.webp',    alt: 'Chocolade bruin met bladgoud' },
  { src: '/work/hero-5-pink-swirl.webp',        alt: 'Roze gellak met gouden swirl' },
  { src: '/work/hero-6-midnight-cateye.webp',   alt: 'Diepblauwe cat-eye gellak' },
  { src: '/work/hero-7-gold-glitter.webp',      alt: 'Gouden glitter feestnagels' },
];

export const galleryItems: WorkItem[] = [
  { src: '/work/gallery-01-pastel-mint-lilac.webp',     alt: 'Pastel populair: mint, lila en pastelgeel', cat: 'color' },
  { src: '/work/gallery-02-mint-lilac-french.webp',     alt: 'Subtiele french met mint en lila tipjes',  cat: 'biab' },
  { src: '/work/gallery-03-black-silver-glitter.webp',  alt: 'Zwart met zilveren glitter accentnagel',   cat: 'color' },
  { src: '/work/gallery-04-orange-white-stripes.webp',  alt: 'Oranje, wijnrood en wit met gouden lijntjes', cat: 'color' },
  { src: '/work/gallery-05-autumn-maroon.webp',         alt: 'Herfst setje in warm bordeauxrood',         cat: 'seasonal' },
  { src: '/work/gallery-06-mocha-glitter.webp',         alt: 'Mocha bruin met glitter accentnagels',     cat: 'color' },
  { src: '/work/gallery-07-pink-glitter-tips.webp',     alt: 'Roze glitter tips op naturel basis',       cat: 'biab' },
  { src: '/work/gallery-08-coral-summer.webp',          alt: 'Coral summer met gouden accentstreepje',   cat: 'seasonal' },
  { src: '/work/gallery-09-floral-pink.webp',           alt: 'Roze gellak met bloemetjes nailart',       cat: 'color' },
  { src: '/work/gallery-10-blush-heart.webp',           alt: 'Naturel blush met klein hartje',           cat: 'biab' },
  { src: '/work/gallery-11-red-glitter.webp',           alt: 'Rode glitter — feestelijk en speels',      cat: 'color' },
  { src: '/work/gallery-12-snowflake.webp',             alt: 'Wintergebonden setje met sneeuwvlokken',   cat: 'seasonal' },
  { src: '/work/gallery-13-disco.webp',                 alt: 'Disco-ball glitter setje',                 cat: 'color' },
  { src: '/work/gallery-14-frenchies.webp',             alt: 'Klassieke frenchies in zacht roze',        cat: 'biab' },
  { src: '/work/gallery-15-cherry-disco.webp',          alt: 'Kers met disco glitter',                   cat: 'color' },
];

export const stripItems: { src: string; alt: string }[] = [
  { src: '/work/strip-01-xmas-red-glitter.webp', alt: 'Kerstrode glitter nagels' },
  { src: '/work/strip-02-santa.webp',            alt: 'Kerst nail art' },
  { src: '/work/strip-03-sparkle.webp',          alt: 'Sparkle setje' },
  { src: '/work/strip-04-glitter-glamour.webp',  alt: 'Glitter & glamour' },
  { src: '/work/strip-05-spring-french.webp',    alt: 'Lente french' },
  { src: '/work/strip-06-blossom.webp',          alt: 'Bloesem zachtroze' },
  { src: '/work/strip-07-subtle-biab.webp',      alt: 'Subtiele BIAB met sparkle' },
  { src: '/work/strip-08-purple.webp',           alt: 'Paars met hologlitter' },
];
