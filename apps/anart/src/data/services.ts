export type Service = {
  id: string;
  nameNl: string;
  nameEn: string;
  namePl: string;
  price: number;
  durationMin: number;
  descNl?: string;
  descEn?: string;
  descPl?: string;
};

export type ServiceCategory = {
  id: string;
  titleNl: string;
  titleEn: string;
  titlePl: string;
  icon: 'sparkles' | 'heart' | 'flower' | 'leaf' | 'eye' | 'scissors' | 'hands' | 'gift';
  services: Service[];
};

export function formatPrice(p: number): string {
  return '€\u00a0' + p.toFixed(2).replace('.', ',');
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'manicure',
    titleNl: 'Manicure',
    titleEn: 'Manicure',
    titlePl: 'Manicure',
    icon: 'sparkles',
    services: [
      { id: 'hand-manicure',    nameNl: 'Hand manicure',             nameEn: 'Hand manicure',             namePl: 'Manicure klasyczny',           price: 29,   durationMin: 45 },
      { id: 'gel-polish-super', nameNl: 'Gellak incl. nagelstructuur', nameEn: 'Gel polish incl. nail structure', namePl: 'Hybryda z żelową strukturą', price: 43.5, durationMin: 60 },
      { id: 'hybrid-gel',       nameNl: 'Hybrid nails met gel',       nameEn: 'Hybrid nails with gel',     namePl: 'Hybryda z żelem',              price: 48.5, durationMin: 75 },
      { id: 'biab-emani',       nameNl: 'BIAB + E-manicure',          nameEn: 'BIAB + E-manicure',         namePl: 'BIAB + E-manicure',            price: 47.5, durationMin: 60 },
      { id: 'biab-gel',         nameNl: 'BIAB + Gellak',              nameEn: 'BIAB + Gel polish',         namePl: 'BIAB + hybryda',               price: 52.5, durationMin: 75 },
      { id: 'gel-natural',      nameNl: 'Gel op natuurlijke nagel',   nameEn: 'Gel on natural nail',       namePl: 'Żel na naturalną płytkę',      price: 50,   durationMin: 90 },
    ],
  },
  {
    id: 'gel-extensions',
    titleNl: 'Gel extensions',
    titleEn: 'Gel extensions',
    titlePl: 'Przedłużanie żelem',
    icon: 'leaf',
    services: [
      { id: 'gel-ext-s',  nameNl: 'Gel Extensions S',  nameEn: 'Gel Extensions S',  namePl: 'Przedłużanie żelem S',  price: 60,   durationMin: 120 },
      { id: 'gel-ext-m',  nameNl: 'Gel Extensions M',  nameEn: 'Gel Extensions M',  namePl: 'Przedłużanie żelem M',  price: 65,   durationMin: 150 },
      { id: 'gel-ext-xl', nameNl: 'Gel Extensions L/XL', nameEn: 'Gel Extensions L/XL', namePl: 'Przedłużanie żelem L/XL', price: 70, durationMin: 150 },
      { id: 'gel-refill', nameNl: 'Gel Refill',         nameEn: 'Gel Refill',         namePl: 'Żel — uzupełnienie',    price: 53.5, durationMin: 90 },
    ],
  },
  {
    id: 'pedicure',
    titleNl: 'Pedicure',
    titleEn: 'Pedicure',
    titlePl: 'Pedicure',
    icon: 'heart',
    services: [
      { id: 'pedi-basic',   nameNl: 'Basis pedicure',         nameEn: 'Basic pedicure',          namePl: 'Pedicure podstawowy',     price: 36.5, durationMin: 45 },
      { id: 'pedi-full',    nameNl: 'Pedicure (likdoornverwijdering)', nameEn: 'Pedicure (callus removal)', namePl: 'Pedicure (usuwanie nagniotków)', price: 46.5, durationMin: 60 },
      { id: 'pedi-gel',     nameNl: 'Pedicure met gellak',    nameEn: 'Pedicure with gel polish', namePl: 'Pedicure z hybrydą',      price: 55,   durationMin: 85 },
      { id: 'pedi-toenail', nameNl: 'Gellak op teennagels',   nameEn: 'Gel polish on toenails',  namePl: 'Hybryda na paznokcie nóg', price: 40,  durationMin: 60 },
    ],
  },
  {
    id: 'removal',
    titleNl: 'Verwijdering',
    titleEn: 'Removal',
    titlePl: 'Zdejmowanie',
    icon: 'scissors',
    services: [
      { id: 'removal-gel',       nameNl: 'Gel/hybrid verwijdering',             nameEn: 'Gel/hybrid removal',              namePl: 'Zdejmowanie żelu/hybrydy',            price: 22, durationMin: 45 },
      { id: 'removal-gel-emani', nameNl: 'Gel/hybrid verwijdering + E-manicure', nameEn: 'Gel/hybrid removal + E-manicure', namePl: 'Zdejmowanie żelu/hybrydy + E-manicure', price: 35, durationMin: 60 },
    ],
  },
  {
    id: 'wimpers',
    titleNl: 'Wimperextensions',
    titleEn: 'Lash extensions',
    titlePl: 'Przedłużanie rzęs',
    icon: 'eye',
    services: [
      { id: 'lash-1-1',       nameNl: 'Lash Extensions 1:1',          nameEn: 'Lash Extensions 1:1',          namePl: 'Przedłużanie rzęs 1:1',          price: 55, durationMin: 120 },
      { id: 'lash-2-3d',      nameNl: 'Lash Extensions 2-3D',         nameEn: 'Lash Extensions 2-3D',         namePl: 'Przedłużanie rzęs 2-3D',         price: 65, durationMin: 150 },
      { id: 'lash-4-6d',      nameNl: 'Lash Extensions 4-6D',         nameEn: 'Lash Extensions 4-6D',         namePl: 'Przedłużanie rzęs 4-6D',         price: 70, durationMin: 150 },
      { id: 'lash-6d-plus',   nameNl: 'Lash Extensions 6D+',          nameEn: 'Lash Extensions 6D+',          namePl: 'Przedłużanie rzęs 6D+',          price: 80, durationMin: 150 },
      { id: 'lash-wet',       nameNl: 'Lash Extensions Wet look',      nameEn: 'Lash Extensions Wet look',      namePl: 'Przedłużanie rzęs Wet look',     price: 65, durationMin: 120 },
      { id: 'lash-refill-1-3w', nameNl: 'Lash Refill 1:1 (3 weken)',  nameEn: 'Lash Refill 1:1 (3 weeks)',   namePl: 'Uzupełnienie 1:1 (3 tyg.)',      price: 45, durationMin: 90 },
      { id: 'lash-refill-1-4w', nameNl: 'Lash Refill 1:1 (4 weken)',  nameEn: 'Lash Refill 1:1 (4 weeks)',   namePl: 'Uzupełnienie 1:1 (4 tyg.)',      price: 50, durationMin: 90 },
      { id: 'lash-refill-2-3w', nameNl: 'Lash Refill 2-3D (3 weken)', nameEn: 'Lash Refill 2-3D (3 weeks)',  namePl: 'Uzupełnienie 2-3D (3 tyg.)',     price: 55, durationMin: 120 },
      { id: 'lash-refill-2-4w', nameNl: 'Lash Refill 2-3D (4 weken)', nameEn: 'Lash Refill 2-3D (4 weeks)',  namePl: 'Uzupełnienie 2-3D (4 tyg.)',     price: 60, durationMin: 120 },
      { id: 'lash-refill-4-3w', nameNl: 'Lash Refill 4-6D (3 weken)', nameEn: 'Lash Refill 4-6D (3 weeks)',  namePl: 'Uzupełnienie 4-6D (3 tyg.)',     price: 60, durationMin: 120 },
      { id: 'lash-refill-4-4w', nameNl: 'Lash Refill 4-6D (4 weken)', nameEn: 'Lash Refill 4-6D (4 weeks)',  namePl: 'Uzupełnienie 4-6D (4 tyg.)',     price: 65, durationMin: 120 },
      { id: 'lash-dye',       nameNl: 'Wimperverf',                   nameEn: 'Lash dye',                     namePl: 'Henna rzęs',                     price: 15, durationMin: 30 },
      { id: 'lash-removal',   nameNl: 'Wimperverwijdering',           nameEn: 'Lash removal',                 namePl: 'Zdejmowanie rzęs',               price: 15, durationMin: 15 },
    ],
  },
  {
    id: 'wenkbrauwen',
    titleNl: 'Wenkbrauwen',
    titleEn: 'Eyebrows',
    titlePl: 'Brwi',
    icon: 'flower',
    services: [
      { id: 'brow-henna',   nameNl: 'Henna wenkbrauwen + waxen/epileren', nameEn: 'Eyebrow henna + waxing/tweezing', namePl: 'Henna brwi + woskowanie/depilacja', price: 35, durationMin: 60 },
      { id: 'brow-dye',     nameNl: 'Wenkbrauwverf + waxen/epileren',     nameEn: 'Eyebrow dye + waxing/tweezing',  namePl: 'Barwienie brwi + woskowanie',      price: 30, durationMin: 60 },
      { id: 'brow-wax',     nameNl: 'Waxen/epileren wenkbrauwen',          nameEn: 'Eyebrow waxing/tweezing',         namePl: 'Woskowanie/depilacja brwi',        price: 15, durationMin: 60 },
    ],
  },
  {
    id: 'massage',
    titleNl: 'Massage',
    titleEn: 'Massage',
    titlePl: 'Masaż',
    icon: 'hands',
    services: [
      { id: 'massage-30',       nameNl: 'Classic massage rug/schouders — 30 min', nameEn: 'Classic back/shoulder massage — 30 min', namePl: 'Masaż klasyczny plecy/ramiona — 30 min', price: 30, durationMin: 30 },
      { id: 'massage-45',       nameNl: 'Classic massage rug/schouders — 45 min', nameEn: 'Classic back/shoulder massage — 45 min', namePl: 'Masaż klasyczny plecy/ramiona — 45 min', price: 45, durationMin: 45 },
      { id: 'kobido-hand',      nameNl: 'Kobido + handmassage',                  nameEn: 'Kobido + hand massage',                 namePl: 'Kobido + masaż dłoni',
        descNl: 'Natuurlijke facelift + ontspannende handmassage.',
        descEn: 'Natural facelift + relaxing hand massage.',
        descPl: 'Naturalny lifting twarzy + relaksujący masaż dłoni.',
        price: 50, durationMin: 60 },
      { id: 'kobido-mask',      nameNl: 'Kobido + masker',                       nameEn: 'Kobido + mask',                         namePl: 'Kobido + maska',
        descNl: 'Diepte reiniging en liftend masker.',
        descEn: 'Deep cleanse and lifting mask.',
        descPl: 'Głębokie oczyszczanie i liftingująca maska.',
        price: 70, durationMin: 70 },
      { id: 'kobido-tape',      nameNl: 'Kobido + masker + taping',              nameEn: 'Kobido + mask + taping',                namePl: 'Kobido + maska + taping',
        descNl: 'Meest complete kobido behandeling met liftend tape.',
        descEn: 'Most complete kobido treatment with lifting tape.',
        descPl: 'Najbardziej kompletny zabieg kobido z liftingującym tapingiem.',
        price: 75, durationMin: 70 },
    ],
  },
  {
    id: 'combos',
    titleNl: 'Combinatiedeals',
    titleEn: 'Combo deals',
    titlePl: 'Pakiety',
    icon: 'gift',
    services: [
      { id: 'combo-gel-feet',  nameNl: 'Gellak handen + voeten',          nameEn: 'Gel polish hands + feet',          namePl: 'Hybryda ręce + nogi',               price: 76.5, durationMin: 120,
        descNl: '10% korting', descEn: '10% discount', descPl: '10% zniżki' },
      { id: 'combo-hybrid-toe', nameNl: 'Hybrid nails + gellak teennagels', nameEn: 'Hybrid nails + gel polish toenails', namePl: 'Hybryda ręce + hybryda nogi',     price: 78.5, durationMin: 150,
        descNl: '10% korting', descEn: '10% discount', descPl: '10% zniżki' },
      { id: 'combo-gel-pedi',  nameNl: 'Gellak handen + pedicure gellak', nameEn: 'Gel polish hands + pedicure gel', namePl: 'Hybryda ręce + pedicure z hybrydą', price: 87.5, durationMin: 150,
        descNl: '10% korting', descEn: '10% discount', descPl: '10% zniżki' },
      { id: 'combo-refill-toe', nameNl: 'Gel refill + gellak teennagels',  nameEn: 'Gel refill + gel polish toenails', namePl: 'Uzupełnienie żel + hybryda nogi',  price: 83,   durationMin: 175,
        descNl: '10% korting', descEn: '10% discount', descPl: '10% zniżki' },
    ],
  },
];
