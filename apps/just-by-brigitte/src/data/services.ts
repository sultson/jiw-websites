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
    id: 'biab',
    titleNl: 'BIAB',
    titleEn: 'BIAB',
    icon: 'heart',
    blurbNl: 'Builder in a Bottle: versteviging op je eigen nagel.',
    blurbEn: 'Builder in a Bottle: strengthening on your own nail.',
    services: [
      {
        id: 'biab-naturel',
        nameNl: 'BIAB naturel',
        nameEn: 'BIAB natural',
        descNl: 'Natuurlijke afwerking, ideaal voor een rustige look.',
        descEn: 'Natural finish, ideal for a calm look.',
      },
      {
        id: 'biab-kleur',
        nameNl: 'BIAB met kleur',
        nameEn: 'BIAB with colour',
        descNl: 'BIAB met een gellak-kleur of subtiele babyboom.',
        descEn: 'BIAB with a gel-polish colour or subtle babyboom.',
      },
    ],
  },
  {
    id: 'gellak',
    titleNl: 'Gellak',
    titleEn: 'Gel polish',
    icon: 'palette',
    blurbNl: 'Kleur op je eigen nagels, strak en houdbaar.',
    blurbEn: 'Colour on your own nails: clean and long-lasting.',
    services: [
      {
        id: 'gellak-een-kleur',
        nameNl: 'Gellak in één kleur',
        nameEn: 'Gel polish in one colour',
      },
      {
        id: 'gellak-french',
        nameNl: 'French of fading',
        nameEn: 'French or fading',
      },
    ],
  },
  {
    id: 'kunstnagels',
    titleNl: 'Kunstnagels',
    titleEn: 'Artificial nails',
    icon: 'sparkles',
    blurbNl: 'Een nieuwe set met of zonder verlenging.',
    blurbEn: 'A new set, with or without extension.',
    services: [
      {
        id: 'set-natuurlijk',
        nameNl: 'Nieuwe set op natuurlijke nagel',
        nameEn: 'New set on natural nail',
      },
      {
        id: 'set-verlenging',
        nameNl: 'Nieuwe set met verlenging',
        nameEn: 'New set with extension',
      },
      {
        id: 'opvullen',
        nameNl: 'Opvullen (binnen 3–4 weken)',
        nameEn: 'Refill (within 3–4 weeks)',
      },
    ],
  },
  {
    id: 'extra',
    titleNl: 'Extra\'s',
    titleEn: 'Extras',
    icon: 'droplet',
    services: [
      {
        id: 'kleur-extra',
        nameNl: 'Extra kleur of glitter',
        nameEn: 'Extra colour or glitter',
      },
      {
        id: 'reparatie',
        nameNl: 'Reparatie',
        nameEn: 'Repair',
      },
      {
        id: 'verwijderen',
        nameNl: 'Kunstnagels verwijderen',
        nameEn: 'Remove artificial nails',
      },
    ],
  },
];
