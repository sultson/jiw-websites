// Prices taken from the official prijslijst (Kunstnagels — Nagelstudio Nail It Rosmalen).
export type Service = {
  id: string;
  nameNl: string;
  nameEn: string;
  price: number;
  /** Optional override for how the price is displayed (e.g. "v.a. € 1,- p/nagel"). */
  priceLabelNl?: string;
  priceLabelEn?: string;
  descNl?: string;
  descEn?: string;
};

export type ServiceCategory = {
  id: string;
  titleNl: string;
  titleEn: string;
  icon: 'sparkles' | 'heart' | 'stamp' | 'palette' | 'scissors' | 'droplet';
  /** Short line shown under the category title. */
  blurbNl?: string;
  blurbEn?: string;
  services: Service[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'nieuw-verlenging',
    titleNl: 'Nieuwe set kunstnagels met verlenging',
    titleEn: 'New set of artificial nails with extension',
    icon: 'sparkles',
    blurbNl: 'Voor een volledige nieuwe set met verlenging.',
    blurbEn: 'A fresh new set, sculpted with extension.',
    services: [
      { id: 'ext-one-tone', nameNl: 'One-Tone', nameEn: 'One-Tone', price: 65 },
      {
        id: 'ext-french',
        nameNl: 'French Manicure of Fading',
        nameEn: 'French Manicure or Fading',
        price: 75,
        descNl: 'Babyboom of French.',
        descEn: 'Babyboom or French.',
      },
      { id: 'ext-gelpolish', nameNl: 'Gelpolish', nameEn: 'Gel polish', price: 80 },
    ],
  },
  {
    id: 'nieuw-natuurlijk',
    titleNl: 'Nieuwe set — op natuurlijke nagel',
    titleEn: 'New set — on natural nail',
    icon: 'heart',
    blurbNl: 'Verstevigen zonder verlenging — met gel of acryl op de natuurlijke nagel.',
    blurbEn: 'Reinforcement without extension — gel or acrylic on the natural nail.',
    services: [
      {
        id: 'nat-one-tone',
        nameNl: 'One-Tone',
        nameEn: 'One-Tone',
        price: 52.5,
        descNl: 'Naturel of transparante kleur.',
        descEn: 'Natural or transparent colour.',
      },
      {
        id: 'nat-french',
        nameNl: 'French Manicure of Fading',
        nameEn: 'French Manicure or Fading',
        price: 70,
        descNl: 'Wit of 1 kleur / glitter.',
        descEn: 'White or one colour / glitter.',
      },
      {
        id: 'nat-one-tone-gellak',
        nameNl: 'One-Tone met gellak kleur',
        nameEn: 'One-Tone with gel polish colour',
        price: 75,
      },
    ],
  },
  {
    id: 'nabehandeling',
    titleNl: 'Nabehandeling (bijvullen)',
    titleEn: 'Refill',
    icon: 'stamp',
    blurbNl: 'Binnen 4 weken opvullen — zo blijven de nagels heel en gezond.',
    blurbEn: 'Refill within 4 weeks — keeps the nails strong and healthy.',
    services: [
      {
        id: 'fill-one-tone',
        nameNl: 'One-Tone',
        nameEn: 'One-Tone',
        price: 47.5,
        descNl: 'Naturel of transparante kleur.',
        descEn: 'Natural or transparent colour.',
      },
      {
        id: 'fill-french',
        nameNl: 'French Manicure of Fading',
        nameEn: 'French Manicure or Fading',
        price: 49.5,
        descNl: 'Wit of 1 kleur / glitter.',
        descEn: 'White or one colour / glitter.',
      },
      { id: 'fill-onetone-gelpolish', nameNl: 'One-tone + colour gelpolish', nameEn: 'One-Tone + colour gel polish', price: 54 },
    ],
  },
  {
    id: 'gellak-biab',
    titleNl: 'Gellak & BIAB',
    titleEn: 'Gel polish & BIAB',
    icon: 'palette',
    blurbNl: 'Kleur op je eigen nagels — zonder verlenging.',
    blurbEn: 'Colour on your own nails — no extension.',
    services: [
      {
        id: 'gellak',
        nameNl: 'Gellak',
        nameEn: 'Gel polish',
        price: 36.5,
      },
      {
        id: 'biab',
        nameNl: 'BIAB',
        nameEn: 'BIAB',
        price: 41.5,
        descNl: 'Builder in a Bottle — valt onder gellak-behandelingen.',
        descEn: 'Builder in a Bottle — part of the gel polish range.',
      },
    ],
  },
  {
    id: 'opties',
    titleNl: "Opties & extra's",
    titleEn: 'Options & extras',
    icon: 'palette',
    services: [
      {
        id: 'opt-kleur',
        nameNl: 'Extra kleur of glitter — alle nagels',
        nameEn: 'Extra colour or glitter — all nails',
        price: 5,
        priceLabelNl: '€ 5,- p/kleur',
        priceLabelEn: '€ 5,- per colour',
      },
      {
        id: 'opt-nailart',
        nameNl: 'Nailart',
        nameEn: 'Nail art',
        price: 1,
        priceLabelNl: 'v.a. € 1,- p/nagel',
        priceLabelEn: 'from € 1,- per nail',
      },
      {
        id: 'opt-reparatie',
        nameNl: 'Reparatie nagel (na 1 week)',
        nameEn: 'Nail repair (after 1 week)',
        price: 6.5,
      },
      {
        id: 'opt-verwijderen',
        nameNl: 'Kunstnagels verwijderen + manicure',
        nameEn: 'Removal + manicure',
        price: 20,
      },
    ],
  },
  {
    id: 'vijlen',
    titleNl: 'Vijlen',
    titleEn: 'Nail files',
    icon: 'scissors',
    services: [
      { id: 'vijl', nameNl: 'Vijl', nameEn: 'Nail file', price: 4 },
    ],
  },
  {
    id: 'producten',
    titleNl: 'Producten',
    titleEn: 'Products',
    icon: 'droplet',
    blurbNl: 'Dadi verzorging voor thuis.',
    blurbEn: 'Dadi home-care products.',
    services: [
      { id: 'dadi-oil-3-75', nameNl: 'Dadi oil 3,75 ml', nameEn: 'Dadi oil 3.75 ml', price: 7.95 },
      { id: 'dadi-oil-15', nameNl: 'Dadi oil 15 ml', nameEn: 'Dadi oil 15 ml', price: 21.95 },
      { id: 'dadi-oil-72', nameNl: 'Dadi oil 72 ml', nameEn: 'Dadi oil 72 ml', price: 61.9 },
      { id: 'dadi-oil-180', nameNl: 'Dadi oil 180 ml', nameEn: 'Dadi oil 180 ml', price: 121 },
      { id: 'dadi-lotion-59', nameNl: 'Dadi lotion 59 ml', nameEn: 'Dadi lotion 59 ml', price: 9.9 },
      { id: 'dadi-lotion-236', nameNl: 'Dadi lotion 236 ml', nameEn: 'Dadi lotion 236 ml', price: 29.9 },
      { id: 'dadi-lotion-917', nameNl: 'Dadi lotion 917 ml', nameEn: 'Dadi lotion 917 ml', price: 74.9 },
      { id: 'dadi-scrub-groot', nameNl: 'Dadi scrub groot', nameEn: 'Dadi scrub large', price: 50 },
      { id: 'dadi-scrub-klein', nameNl: 'Dadi scrub klein', nameEn: 'Dadi scrub small', price: 10.95 },
      { id: 'dadi-lip-balm', nameNl: 'Dadi lip balm', nameEn: 'Dadi lip balm', price: 9.9 },
    ],
  },
];

/** Format a euro amount in Dutch style: 65 → "€ 65,-", 49.5 → "€ 49,50". */
export function formatPrice(n: number): string {
  if (Number.isInteger(n)) return `€ ${n},-`;
  return `€ ${n.toFixed(2).replace('.', ',')}`;
}
