// price 0 → display "Op aanvraag" / "On request" in the component.
// durationMin 0 → hide the duration in the component.

export type Service = {
  id: string;
  nameNl: string;
  nameEn: string;
  price: number;
  durationMin: number;
  descNl?: string;
  descEn?: string;
};

export type ServiceCategory = {
  id: string;
  titleNl: string;
  titleEn: string;
  icon: 'sparkles' | 'leaf' | 'flower';
  services: Service[];
};

export function formatPrice(p: number): string {
  if (p <= 0) return 'Op aanvraag';
  return '€ ' + p.toFixed(2).replace('.', ',');
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'manicure',
    titleNl: 'Manicure & gelmanicure',
    titleEn: 'Manicure',
    icon: 'sparkles',
    services: [
      {
        id: 'manicure',
        nameNl: 'Manicure',
        nameEn: 'Manicure',
        price: 0, durationMin: 0,
      },
      {
        id: 'gelmanicure',
        nameNl: 'Gelmanicure',
        nameEn: 'Gel manicure',
        descNl: 'Gelaagd opgebouwde gellak. Drie tot vier weken strak en glanzend, ook bij dagelijks gebruik.',
        descEn: 'Layered gel polish. Three to four weeks of neat, glossy nails, even with daily use.',
        price: 0, durationMin: 0,
      },
      {
        id: 'franse-manicure',
        nameNl: 'Franse manicure',
        nameEn: 'French manicure',
        price: 0, durationMin: 0,
      },
      {
        id: 'gellak-verwijderen',
        nameNl: 'Gellak verwijderen',
        nameEn: 'Gel polish removal',
        price: 0, durationMin: 0,
      },
      {
        id: 'nagels-lakken',
        nameNl: 'Nagels lakken',
        nameEn: 'Nail polish',
        price: 0, durationMin: 0,
      },
    ],
  },
  {
    id: 'verlengingen',
    titleNl: 'Acryl & verlengingen',
    titleEn: 'Acrylic & extensions',
    icon: 'flower',
    services: [
      {
        id: 'kunstnagels-acryl',
        nameNl: 'Kunstnagels (acryl)',
        nameEn: 'Acrylic nails',
        descNl: 'Sterke, opgebouwde acrylnagels in jouw gewenste vorm en lengte.',
        descEn: 'Strong sculpted acrylic nails in the shape and length you choose.',
        price: 0, durationMin: 0,
      },
      {
        id: 'nagelverlengingen',
        nameNl: 'Nagelverlengingen',
        nameEn: 'Nail extensions',
        price: 0, durationMin: 0,
      },
      {
        id: 'stilettonagels',
        nameNl: 'Stilettonagels',
        nameEn: 'Stiletto nails',
        price: 0, durationMin: 0,
      },
      {
        id: 'nagelreparatie',
        nameNl: 'Nagelreparatie',
        nameEn: 'Nail repair',
        price: 0, durationMin: 0,
      },
      {
        id: 'gelnagels',
        nameNl: 'Gelnagels',
        nameEn: 'Gel nails',
        price: 0, durationMin: 0,
      },
    ],
  },
  {
    id: 'pedicure',
    titleNl: 'Pedicure',
    titleEn: 'Pedicure',
    icon: 'leaf',
    services: [
      {
        id: 'pedicure-basis',
        nameNl: 'Pedicure basis',
        nameEn: 'Pedicure basic',
        price: 0, durationMin: 0,
      },
      {
        id: 'pedicure-gellak',
        nameNl: 'Pedicure + gellak',
        nameEn: 'Pedicure + gel polish',
        descNl: 'Complete voetverzorging afgewerkt met gellak voor een lang mooi resultaat.',
        descEn: 'Full foot care finished with gel polish for a long-lasting result.',
        price: 0, durationMin: 0,
      },
      {
        id: 'voetmassage',
        nameNl: 'Voetmassage',
        nameEn: 'Foot massage',
        price: 0, durationMin: 0,
      },
    ],
  },
  {
    id: 'extra',
    titleNl: 'Extra & ontwerpen',
    titleEn: 'Designs & extras',
    icon: 'sparkles',
    services: [
      {
        id: 'nagelontwerp',
        nameNl: 'Nagelontwerp / artwork',
        nameEn: 'Nail design / artwork',
        descNl: 'Een eigen ontwerp of klein kunstwerkje op je nagels, helemaal naar jouw idee.',
        descEn: 'A custom design or small artwork on your nails, exactly how you want it.',
        price: 0, durationMin: 0,
      },
      {
        id: 'nagelstickers',
        nameNl: 'Nagelstickers',
        nameEn: 'Nail stickers',
        price: 0, durationMin: 0,
      },
      {
        id: 'handmassage',
        nameNl: 'Handmassage',
        nameEn: 'Hand massage',
        price: 0, durationMin: 0,
      },
      {
        id: 'manicure-heren',
        nameNl: 'Manicure voor heren',
        nameEn: 'Manicure for men',
        price: 0, durationMin: 0,
      },
    ],
  },
];
