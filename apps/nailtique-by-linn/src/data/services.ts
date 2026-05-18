export type Service = {
  id: string;
  nameNl: string;
  nameEn: string;
  descNl?: string;
  descEn?: string;
};

export type ServiceCategory = {
  id: string;
  titleNl: string;
  titleEn: string;
  icon: 'nails' | 'lashes' | 'brows';
  blurbNl?: string;
  blurbEn?: string;
  services: Service[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'nagels',
    titleNl: 'Nagels',
    titleEn: 'Nails',
    icon: 'nails',
    blurbNl: 'Verzorgde nagels die mooi blijven zitten.',
    blurbEn: 'Cared-for nails that keep looking good.',
    services: [
      {
        id: 'biab',
        nameNl: 'BIAB',
        nameEn: 'BIAB',
        descNl: 'Builder in a Bottle: versteviging op je eigen nagel, met een natuurlijke look.',
        descEn: 'Builder in a Bottle: strengthening on your own nail, with a natural look.',
      },
      {
        id: 'gellak',
        nameNl: 'Gellak',
        nameEn: 'Gel polish',
        descNl: 'Kleur op je eigen nagels, strak afgewerkt en houdbaar.',
        descEn: 'Colour on your own nails, cleanly finished and long-lasting.',
      },
      {
        id: 'soft-gel-x',
        nameNl: 'Soft Gel-X verlenging',
        nameEn: 'Soft Gel-X extension',
        descNl: 'Een lichte, sterke gelnagel-verlenging zonder de zwaarte van acryl.',
        descEn: 'A light, strong gel nail extension without the weight of acrylic.',
      },
      {
        id: 'nailart',
        nameNl: 'Nail art & tandkristallen',
        nameEn: 'Nail art & crystals',
        descNl: 'Van een subtiele french tot kleur, glitter en tandkristallen.',
        descEn: 'From a subtle french to colour, glitter and tooth crystals.',
      },
    ],
  },
  {
    id: 'wimpers',
    titleNl: 'Wimperextensions',
    titleEn: 'Lash extensions',
    icon: 'lashes',
    blurbNl: 'Vollere wimpers, afgestemd op wat bij jou past.',
    blurbEn: 'Fuller lashes, matched to what suits you.',
    services: [
      {
        id: 'one-by-one',
        nameNl: 'One by one',
        nameEn: 'One by one',
        descNl: 'Per natuurlijke wimper één extension, voor een verzorgde, natuurlijke look.',
        descEn: 'One extension per natural lash, for a groomed, natural look.',
      },
      {
        id: 'hybride',
        nameNl: 'Hybride',
        nameEn: 'Hybrid',
        descNl: 'Een mix van one by one en volume, voor net wat meer vulling.',
        descEn: 'A mix of one by one and volume, for a little more fullness.',
      },
      {
        id: 'volume',
        nameNl: 'Volume',
        nameEn: 'Volume',
        descNl: 'Meerdere fijne wimpers per natuurlijke wimper, voor een vol resultaat.',
        descEn: 'Several fine lashes per natural lash, for a full result.',
      },
      {
        id: 'refill',
        nameNl: 'Refill',
        nameEn: 'Refill',
        descNl: 'Bijvullen om de 2 tot 3 weken houdt je wimpers mooi vol.',
        descEn: 'Topping up every 2 to 3 weeks keeps your lashes nicely full.',
      },
    ],
  },
  {
    id: 'brows',
    titleNl: 'Browlamination',
    titleEn: 'Brow lamination',
    icon: 'brows',
    blurbNl: 'Vollere, strak gestylede wenkbrauwen, wekenlang.',
    blurbEn: 'Fuller, neatly styled brows, for weeks.',
    services: [
      {
        id: 'browlamination',
        nameNl: 'Browlamination',
        nameEn: 'Brow lamination',
        descNl: 'De haartjes worden in de juiste richting gefixeerd: voller en strakker gestyled.',
        descEn: 'The hairs are fixed in the right direction: fuller and more neatly styled.',
      },
      {
        id: 'browlamination-verven',
        nameNl: 'Browlamination met verven',
        nameEn: 'Brow lamination with tint',
        descNl: 'Browlamination inclusief verven, voor extra definitie en diepte.',
        descEn: 'Brow lamination including tinting, for extra definition and depth.',
      },
    ],
  },
];
