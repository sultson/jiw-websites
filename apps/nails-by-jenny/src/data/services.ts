export type Service = {
  id: string;
  nameNl: string;
  nameEn: string;
  price: number;
  descNl?: string;
  descEn?: string;
  /** Overrides the formatted price, e.g. for surcharges and "vanaf" prices. */
  priceDisplayNl?: string;
  priceDisplayEn?: string;
};

export type ServiceCategory = {
  id: string;
  titleNl: string;
  titleEn: string;
  icon: 'sparkles' | 'plus' | 'wrench';
  services: Service[];
};

export function formatPrice(p: number): string {
  return '€ ' + p.toFixed(2).replace('.', ',');
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'behandelingen',
    titleNl: 'Behandelingen',
    titleEn: 'Treatments',
    icon: 'sparkles',
    services: [
      {
        id: 'gellak',
        nameNl: 'Gellak, incl. kleur',
        nameEn: 'Gel polish, incl. colour',
        descNl: 'Kleur en glans op je eigen nagel.',
        descEn: 'Colour and shine on your natural nail.',
        price: 32.5,
      },
      {
        id: 'biab',
        nameNl: 'Biab, incl. kleur',
        nameEn: 'BIAB, incl. colour',
        descNl: 'Verstevigende gellaag, de stevige basis voor elke set.',
        descEn: 'Strengthening gel layer, the sturdy base for any set.',
        price: 35,
      },
      {
        id: 'building-power',
        nameNl: 'Building power, incl. kleur',
        nameEn: 'Building power, incl. colour',
        descNl: 'Extra stevige opbouwlaag voor wie meer sterkte vraagt.',
        descEn: 'Extra firm builder layer when you need more strength.',
        price: 42.5,
      },
      {
        id: 'acrygel',
        nameNl: 'Acrygel/polygel, incl. kleur',
        nameEn: 'Acrygel/polygel, incl. colour',
        descNl: 'De sterkste opbouw, ook geschikt voor langere sets.',
        descEn: 'The strongest build, also suited to longer sets.',
        price: 45,
      },
    ],
  },
  {
    id: 'extras',
    titleNl: 'In combinatie met een behandeling',
    titleEn: 'Combined with a treatment',
    icon: 'plus',
    services: [
      {
        id: 'verlenging',
        nameNl: 'Verlenging',
        nameEn: 'Extensions',
        descNl: 'Extra lengte met tips of sjablonen.',
        descEn: 'Extra length with tips or forms.',
        price: 10,
        priceDisplayNl: '+ € 10,00',
        priceDisplayEn: '+ € 10,00',
      },
      {
        id: 'french-babyboom',
        nameNl: 'French/babyboom',
        nameEn: 'French/babyboom',
        descNl: 'Klassieke french of zachte babyboom finish.',
        descEn: 'Classic french or soft babyboom finish.',
        price: 6,
        priceDisplayNl: '+ € 6,00',
        priceDisplayEn: '+ € 6,00',
      },
      {
        id: 'nailart',
        nameNl: 'Nail art',
        nameEn: 'Nail art',
        descNl: 'Per nagel, afhankelijk van het ontwerp.',
        descEn: 'Per nail, depending on the design.',
        price: 1,
        priceDisplayNl: 'vanaf € 1,00 per nagel',
        priceDisplayEn: 'from € 1,00 per nail',
      },
    ],
  },
  {
    id: 'reparatie',
    titleNl: 'Reparatie en verwijderen',
    titleEn: 'Repairs and removal',
    icon: 'wrench',
    services: [
      {
        id: 'reparatie',
        nameNl: 'Reparatie per nagel',
        nameEn: 'Repair per nail',
        descNl: 'Geldt buiten de garantie. Vanaf vier nagels reken ik de prijs van een nieuwe set.',
        descEn: 'Applies outside the guarantee. From four nails I charge the price of a new set.',
        price: 4,
        priceDisplayNl: 'vanaf € 4,00',
        priceDisplayEn: 'from € 4,00',
      },
      {
        id: 'verwijderen',
        nameNl: 'Verwijderen',
        nameEn: 'Removal',
        descNl: 'Gratis wanneer ik direct een nieuwe set zet.',
        descEn: 'Free when I apply a new set right away.',
        price: 12.5,
      },
    ],
  },
];
