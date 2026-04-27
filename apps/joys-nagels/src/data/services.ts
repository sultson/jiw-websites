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
  icon: 'sparkles' | 'heart' | 'palette' | 'droplet';
  blurbNl?: string;
  blurbEn?: string;
  services: Service[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'gellac',
    titleNl: 'Gellac',
    titleEn: 'Gel polish',
    icon: 'palette',
    blurbNl: 'Op vingers en tenen. Keuze uit ruim 150 kleuren, ook TPO-vrij.',
    blurbEn: 'Fingers and toes. More than 150 colours, including TPO-free.',
    services: [
      {
        id: 'gellac-vingers',
        nameNl: 'Gellac op vingernagels',
        nameEn: 'Gel polish on fingernails',
      },
      {
        id: 'gellac-tenen',
        nameNl: 'Gellac op teennagels',
        nameEn: 'Gel polish on toenails',
      },
      {
        id: 'gellac-french',
        nameNl: 'French of fading',
        nameEn: 'French or fading',
      },
    ],
  },
  {
    id: 'gel-acryl',
    titleNl: 'Gel & acryl',
    titleEn: 'Gel & acrylic',
    icon: 'sparkles',
    blurbNl: 'Een nieuwe set, met of zonder verlenging.',
    blurbEn: 'A new set, with or without extension.',
    services: [
      {
        id: 'gel-set',
        nameNl: 'Gel nagels',
        nameEn: 'Gel nails',
      },
      {
        id: 'acryl-set',
        nameNl: 'Acryl nagels',
        nameEn: 'Acrylic nails',
      },
      {
        id: 'opvullen',
        nameNl: 'Opvullen',
        nameEn: 'Refill',
      },
    ],
  },
  {
    id: 'biab',
    titleNl: 'BIAB & versteviging',
    titleEn: 'BIAB & strengthening',
    icon: 'heart',
    blurbNl: 'Versteviging op je eigen nagel.',
    blurbEn: 'Strengthening on your own nail.',
    services: [
      {
        id: 'biab-naturel',
        nameNl: 'BIAB naturel',
        nameEn: 'BIAB natural',
        descNl: 'Versteviging met een rustige, natuurlijke afwerking.',
        descEn: 'Strengthening with a calm, natural finish.',
      },
      {
        id: 'biab-kleur',
        nameNl: 'BIAB met gellac',
        nameEn: 'BIAB with gel polish',
        descNl: 'Versteviging plus een kleur naar keuze.',
        descEn: 'Strengthening plus a colour of your choice.',
      },
    ],
  },
  {
    id: 'probleemnagels',
    titleNl: 'Probleemnagels & nagelbijters',
    titleEn: 'Problem nails & nail biters',
    icon: 'droplet',
    blurbNl: 'Specialiteit. Eerlijk advies en de tijd om het goed te doen.',
    blurbEn: 'My specialty. Honest advice and the time to do it well.',
    services: [
      {
        id: 'manicure',
        nameNl: 'Manicure',
        nameEn: 'Manicure',
      },
      {
        id: 'reparatie',
        nameNl: 'Reparatie van scheurende of brekende nagels',
        nameEn: 'Repair of cracked or broken nails',
      },
      {
        id: 'nagelbijters',
        nameNl: 'Begeleiding voor nagelbijters',
        nameEn: 'Support for nail biters',
        descNl: 'Stap voor stap, op het tempo van de klant.',
        descEn: "Step by step, at the client's pace.",
      },
    ],
  },
];
