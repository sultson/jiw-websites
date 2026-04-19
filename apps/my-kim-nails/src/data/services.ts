// TODO confirm with owner: price list is placeholder derived from reviews + typical NL nail salon rates.
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
  icon: 'sparkles' | 'heart' | 'flower' | 'leaf';
  services: Service[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'nagels',
    titleNl: 'Nagels',
    titleEn: 'Nails',
    icon: 'sparkles',
    services: [
      { id: 'new-set-gel', nameNl: 'Nieuwe set — gellak', nameEn: 'New set — gel polish', price: 45, durationMin: 60 },
      { id: 'new-set-french', nameNl: 'Nieuwe set — French', nameEn: 'New set — French', price: 55, durationMin: 75 },
      { id: 'biab', nameNl: 'BIAB (Builder in a Bottle)', nameEn: 'BIAB (Builder in a Bottle)', price: 40, durationMin: 60 },
      { id: 'fill', nameNl: 'Bijvullen', nameEn: 'Refill', price: 35, durationMin: 60 },
      { id: 'gel-polish', nameNl: 'Gellak', nameEn: 'Gel polish', price: 20, durationMin: 45 },
      { id: 'cat-eye', nameNl: 'Cat eye', nameEn: 'Cat eye', price: 50, durationMin: 75 },
      { id: 'manicure', nameNl: 'Manicure', nameEn: 'Manicure', price: 25, durationMin: 30 },
      { id: 'soak-off', nameNl: 'Verwijderen (soak-off)', nameEn: 'Removal (soak-off)', price: 15, durationMin: 30 },
    ],
  },
  {
    id: 'pedicure',
    titleNl: 'Pedicure',
    titleEn: 'Pedicure',
    icon: 'heart',
    services: [
      { id: 'pedicure-gel', nameNl: 'Pedicure met gellak', nameEn: 'Pedicure with gel polish', price: 40, durationMin: 60 },
      { id: 'pedicure-spa', nameNl: 'Spa pedicure', nameEn: 'Spa pedicure', price: 45, durationMin: 60 },
      { id: 'pedicure-french', nameNl: 'Pedicure French', nameEn: 'Pedicure French', price: 50, durationMin: 75 },
      { id: 'foot-massage', nameNl: 'Voetmassage', nameEn: 'Foot massage', price: 20, durationMin: 30 },
    ],
  },
  {
    id: 'extras',
    titleNl: "Extra's",
    titleEn: 'Extras',
    icon: 'flower',
    services: [
      { id: 'nail-art', nameNl: 'Nail art (per nagel)', nameEn: 'Nail art (per nail)', price: 3, durationMin: 10 },
      { id: 'repair', nameNl: 'Reparatie (per nagel)', nameEn: 'Repair (per nail)', price: 5, durationMin: 15 },
      { id: 'long-nails', nameNl: 'Lange nagels toeslag', nameEn: 'Long nails surcharge', price: 5, durationMin: 0 },
    ],
  },
];

export function findService(id: string): { category: ServiceCategory; service: Service } | null {
  for (const c of serviceCategories) {
    const s = c.services.find(x => x.id === id);
    if (s) return { category: c, service: s };
  }
  return null;
}
