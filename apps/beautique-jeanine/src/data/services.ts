// Current salon price list from March 2026.
export type Service = {
  id: string;
  nameNl: string;
  nameEn: string;
  price: number;
  priceLabelNl?: string;
  priceLabelEn?: string;
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
    id: 'facials',
    titleNl: 'IK gezichtsbehandelingen',
    titleEn: 'IK facial treatments',
    icon: 'droplet',
    blurbNl: 'Gezichtsbehandelingen met huidanalyse en verzorging.',
    blurbEn: 'Facials with skin analysis and care.',
    services: [
      {
        id: 'ik-basic',
        nameNl: 'IK Basic treatment',
        nameEn: 'IK Basic treatment',
        price: 41.5,
        descNl: '45 minuten · huidanalyse, reiniging, verzorgend masker en dag/nachtverzorging.',
        descEn: '45 minutes · skin analysis, cleansing, caring mask and day/night care.',
      },
      {
        id: 'ik-compleet',
        nameNl: 'IK Compleet treatment',
        nameEn: 'IK Complete treatment',
        price: 55.5,
        descNl: '60 minuten · met huidverbeterende module, serum en huidadvies voor thuis.',
        descEn: '60 minutes · with skin-improving module, serum and home-care advice.',
      },
      {
        id: 'ik-deluxe',
        nameNl: 'IK Deluxe treatment',
        nameEn: 'IK Deluxe treatment',
        price: 72.5,
        descNl: '90 minuten · met epileren, onzuiverheden verwijderen en gelaat/decolleté massage.',
        descEn: '90 minutes · with epilation, impurity removal and face/decollete massage.',
      },
      {
        id: 'module-1',
        nameNl: 'Losse modules behandeling · 1 module',
        nameEn: 'Single treatment module · 1 module',
        price: 6,
        priceLabelNl: '€ 6,00',
        priceLabelEn: '€ 6,00',
      },
      {
        id: 'module-2',
        nameNl: 'Losse modules behandeling · 2 modules',
        nameEn: 'Single treatment module · 2 modules',
        price: 9.5,
      },
      {
        id: 'module-3',
        nameNl: 'Losse modules behandeling · 3 modules',
        nameEn: 'Single treatment module · 3 modules',
        price: 16.5,
      },
      {
        id: 'module-4',
        nameNl: 'Losse modules behandeling · 4 modules',
        nameEn: 'Single treatment module · 4 modules',
        price: 20.5,
      },
    ],
  },
  {
    id: 'skin-improvement',
    titleNl: 'Huidverbetering & massage',
    titleEn: 'Skin improvement & massage',
    icon: 'heart',
    blurbNl: 'Microdermabrasie, peeling en bindweefselmassage.',
    blurbEn: 'Microdermabrasion, peeling and connective tissue massage.',
    services: [
      {
        id: 'microdermabrasie',
        nameNl: 'Microdermabrasie behandeling',
        nameEn: 'Microdermabrasion treatment',
        price: 50.5,
      },
      {
        id: 'peelsysteem',
        nameNl: 'IK SKIN peeling systeem',
        nameEn: 'IK SKIN peeling system',
        price: 59.5,
      },
      {
        id: 'bindweefselmassage',
        nameNl: 'Bindweefselmassage',
        nameEn: 'Connective tissue massage',
        price: 48.5,
      },
      {
        id: 'bindweefsel-kuur',
        nameNl: 'Bindweefselmassage kuurverband',
        nameEn: 'Connective tissue massage course',
        price: 280,
        descNl: '6 behandelingen incl. gratis serum t.w.v. € 19,95.',
        descEn: '6 treatments incl. free serum worth € 19,95.',
      },
    ],
  },
  {
    id: 'lashes-brows',
    titleNl: 'Wimpers & brows',
    titleEn: 'Lashes & brows',
    icon: 'sparkles',
    blurbNl: 'Extensions, lifting, brow lamination en verven.',
    blurbEn: 'Extensions, lifting, brow lamination and tinting.',
    services: [
      {
        id: 'extensions-new',
        nameNl: 'Wimperextensions · nieuwe set',
        nameEn: 'Lash extensions · new set',
        price: 62.5,
      },
      {
        id: 'extensions-fill-2',
        nameNl: 'Wimperextensions · bijvullen 2 weken',
        nameEn: 'Lash extensions · refill 2 weeks',
        price: 29.5,
      },
      {
        id: 'extensions-fill-3',
        nameNl: 'Wimperextensions · bijvullen 3 weken',
        nameEn: 'Lash extensions · refill 3 weeks',
        price: 35.5,
      },
      {
        id: 'extensions-fill-4',
        nameNl: 'Wimperextensions · bijvullen 4 weken',
        nameEn: 'Lash extensions · refill 4 weeks',
        price: 41.5,
      },
      {
        id: 'extensions-remove',
        nameNl: 'Wimperextensions verwijderen',
        nameEn: 'Lash extensions removal',
        price: 17.5,
      },
      {
        id: 'lvl',
        nameNl: 'Lash volume lifting incl. verven',
        nameEn: 'Lash volume lifting incl. tinting',
        price: 48.5,
      },
      {
        id: 'brow-lamination',
        nameNl: 'Brow lamination',
        nameEn: 'Brow lamination',
        price: 42.5,
      },
      {
        id: 'epileren',
        nameNl: 'Epileren',
        nameEn: 'Epilation',
        price: 15.5,
      },
      {
        id: 'verven-brows-lashes',
        nameNl: 'Wenkbrauwen of wimpers verven',
        nameEn: 'Brow or lash tinting',
        price: 13.5,
      },
      {
        id: 'brows-verven-epileren',
        nameNl: 'Wenkbrauwen verven en epileren',
        nameEn: 'Brow tinting and epilation',
        price: 25.5,
      },
      {
        id: 'brows-lashes-verven-epileren',
        nameNl: 'Wenkbrauwen, wimpers verven en epileren',
        nameEn: 'Brow and lash tinting with epilation',
        price: 29.5,
      },
    ],
  },
  {
    id: 'waxing',
    titleNl: 'Waxen',
    titleEn: 'Waxing',
    icon: 'palette',
    blurbNl: 'Lichaam en gezicht.',
    blurbEn: 'Body and face.',
    services: [
      {
        id: 'wax-underlegs',
        nameNl: 'Waxen onderbenen',
        nameEn: 'Waxing lower legs',
        price: 27.5,
      },
      {
        id: 'wax-full-legs',
        nameNl: 'Waxen volledige benen',
        nameEn: 'Waxing full legs',
        price: 34.5,
      },
      {
        id: 'wax-chest-back',
        nameNl: 'Waxen borst/rug',
        nameEn: 'Waxing chest/back',
        price: 30.5,
      },
      {
        id: 'wax-armpits',
        nameNl: 'Waxen oksels',
        nameEn: 'Waxing underarms',
        price: 19.5,
      },
      {
        id: 'wax-arms',
        nameNl: 'Waxen armen',
        nameEn: 'Waxing arms',
        price: 22.5,
      },
      {
        id: 'wax-upper-lip-or-chin',
        nameNl: 'Waxen bovenlip of kin',
        nameEn: 'Waxing upper lip or chin',
        price: 10.5,
      },
      {
        id: 'wax-upper-lip-chin',
        nameNl: 'Waxen bovenlip en kin',
        nameEn: 'Waxing upper lip and chin',
        price: 17.5,
      },
      {
        id: 'wax-face',
        nameNl: 'Waxen gelaat',
        nameEn: 'Waxing face',
        price: 19.5,
      },
    ],
  },
];

export function formatPrice(n: number): string {
  if (Number.isInteger(n)) return `€ ${n},-`;
  return `€ ${n.toFixed(2).replace('.', ',')}`;
}
