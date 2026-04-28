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
  icon: 'sparkles' | 'leaf' | 'flower';
  services: Service[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'biab',
    titleNl: 'BIAB & Gellak',
    titleEn: 'BIAB & Gel polish',
    icon: 'sparkles',
    services: [
      {
        id: 'biab-new',
        nameNl: 'BIAB nieuwe set',
        nameEn: 'BIAB new set',
        descNl: 'Builder In A Bottle voor sterke, natuurlijke nagels. Inclusief vorm en finish.',
        descEn: 'Builder In A Bottle for strong, natural-looking nails. Shape and finish included.',
      },
      {
        id: 'biab-refill',
        nameNl: 'BIAB opvullen',
        nameEn: 'BIAB refill',
        descNl: 'Opvulbeurt na 3 tot 4 weken om je set fris te houden.',
        descEn: 'Refill every 3 to 4 weeks to keep your set looking fresh.',
      },
      {
        id: 'gellak',
        nameNl: 'Gellak op natuurlijke nagel',
        nameEn: 'Gel polish on natural nail',
        descNl: 'Gellak in een kleur naar keuze, glanzend en lang houdbaar.',
        descEn: 'Gel polish in a colour of your choice, glossy and long-lasting.',
      },
    ],
  },
  {
    id: 'gelx',
    titleNl: 'Gel-X & nail art',
    titleEn: 'Gel-X & nail art',
    icon: 'flower',
    services: [
      {
        id: 'gelx-new',
        nameNl: 'Gel-X nieuwe set',
        nameEn: 'Gel-X new set',
        descNl: 'Lichte extensions voor extra lengte. Komt in verschillende vormen.',
        descEn: 'Light extensions for added length. Comes in different shapes.',
      },
      {
        id: 'gelx-long',
        nameNl: 'Gel-X extra lang',
        nameEn: 'Gel-X extra long',
        descNl: 'Extensions voor wie van wat meer drama houdt.',
        descEn: 'Extensions for those who like a bit more drama.',
      },
      {
        id: 'nail-art',
        nameNl: 'Nail art',
        nameEn: 'Nail art',
        descNl: 'French tips, marble, gold flakes, steentjes of een eigen wens.',
        descEn: 'French tips, marble, gold flakes, stones or your own wish.',
      },
    ],
  },
  {
    id: 'pedicure',
    titleNl: 'Manicure & pedicure',
    titleEn: 'Manicure & pedicure',
    icon: 'leaf',
    services: [
      {
        id: 'manicure',
        nameNl: 'Manicure',
        nameEn: 'Manicure',
        descNl: 'Verzorging van nagelriemen en nagels, inclusief lakken op verzoek.',
        descEn: 'Care for cuticles and nails, with polish on request.',
      },
      {
        id: 'pedicure',
        nameNl: 'Pedicure',
        nameEn: 'Pedicure',
        descNl: 'Verzorgende voetbehandeling, eventueel met eeltverwijdering.',
        descEn: 'Foot treatment with optional callus removal.',
      },
      {
        id: 'pedicure-gellak',
        nameNl: 'Pedicure met gellak',
        nameEn: 'Pedicure with gel polish',
        descNl: 'Pedicure afgewerkt met gellak voor een lange houdbaarheid.',
        descEn: 'Pedicure finished with gel polish for long-lasting wear.',
      },
    ],
  },
];
