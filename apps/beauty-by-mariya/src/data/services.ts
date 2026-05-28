import type { Lang } from '../translations';

export type Service = {
  id: string;
  nameNl: string;
  nameEn: string;
  nameUa: string | null;
  price: number;
  priceLabel?: string;
  durationMin: number;
  noteNl?: string;
  noteEn?: string;
  noteUa?: string;
};

export type ServiceCategory = {
  id: string;
  titleNl: string;
  titleEn: string;
  titleUa: string;
  descriptionNl: string;
  descriptionEn: string;
  descriptionUa: string;
  icon: 'sparkles' | 'flower' | 'wand' | 'scissors' | 'sun' | 'droplet';
  services: Service[];
  /** when true, render a "see Fresha" note instead of a price list */
  hideList?: boolean;
  noteKey?: string;
};

export function formatPrice(p: number, label: string | undefined, lang: Lang): string {
  if (label) {
    if (lang === 'en') return label === 'gratis' ? 'free' : label;
    if (lang === 'ua') return label === 'gratis' ? 'безкоштовно' : label;
    return label;
  }
  return '€ ' + p.toFixed(2).replace('.', ',');
}

export function svcName(s: Service, lang: Lang): string {
  if (lang === 'ua' && s.nameUa) return s.nameUa;
  if (lang === 'en') return s.nameEn;
  return s.nameNl;
}

export function svcNote(s: Service, lang: Lang): string | undefined {
  if (lang === 'ua') return s.noteUa ?? s.noteEn ?? s.noteNl;
  if (lang === 'en') return s.noteEn ?? s.noteNl;
  return s.noteNl;
}

export function catTitle(c: ServiceCategory, lang: Lang): string {
  if (lang === 'en') return c.titleEn;
  if (lang === 'ua') return c.titleUa;
  return c.titleNl;
}

export function catDescription(c: ServiceCategory, lang: Lang): string {
  if (lang === 'en') return c.descriptionEn;
  if (lang === 'ua') return c.descriptionUa;
  return c.descriptionNl;
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'nagels',
    titleNl: 'Nagels',
    titleEn: 'Nails',
    titleUa: 'Нігті',
    descriptionNl: 'Manicure, pedicure, gellak en gelnagels, persoonlijk en met oog voor detail.',
    descriptionEn: 'Manicure, pedicure, gel polish and gel nails, personal and detail-driven.',
    descriptionUa: 'Манікюр, педикюр, гель-лак та нарощування з увагою до деталей.',
    icon: 'sparkles',
    services: [
      { id: 'classic-manicure', nameNl: 'Classic manicure', nameEn: 'Classic manicure', nameUa: 'Класичний манікюр', price: 30, durationMin: 45 },
      { id: 'manicure-lakgel', nameNl: 'Manicure met gellak', nameEn: 'Manicure with gel polish', nameUa: 'Манікюр з гель-лаком', price: 60, durationMin: 90 },
      { id: 'gellak-verw-manicure-nieuwe-gellak', nameNl: 'Oude gellak verwijderen, manicure, nieuwe gellak', nameEn: 'Old gel removal, manicure and new gel polish', nameUa: 'Зняття старого гель-лаку, манікюр та новий гель-лак', price: 65, durationMin: 105 },
      { id: 'blushes-magnetic-manicure', nameNl: 'Blushes Magnetic (rubber base), oude gellak verwijderen, manicure', nameEn: 'Blushes Magnetic (rubber base), gel removal and manicure', nameUa: null, price: 65, durationMin: 105 },
      { id: 'manicure-rubber-base-french', nameNl: 'Manicure met rubber base en french', nameEn: 'Manicure with rubber base and french finish', nameUa: 'Манікюр з каучуковою базою та френч', price: 75, durationMin: 135 },
      { id: 'gellak-verwijderen-nagels', nameNl: 'Gellak verwijderen (nagels)', nameEn: 'Gel polish removal (nails)', nameUa: 'Зняття гель-лаку (нігті)', price: 20, durationMin: 15 },
      { id: 'lakken-polish', nameNl: 'Lakken (nagellak)', nameEn: 'Nail polish application', nameUa: 'Покриття лаком', price: 10, durationMin: 15 },
      { id: 'repair-one-nail', nameNl: 'Reparatie van één nagel', nameEn: 'Single-nail repair', nameUa: 'Ремонт одного нігтя', price: 5, durationMin: 15 },
      { id: 'pedicure', nameNl: 'Pedicure', nameEn: 'Pedicure', nameUa: 'Педикюр', price: 55, durationMin: 60 },
      { id: 'pedicure-lakgel', nameNl: 'Pedicure met gellak', nameEn: 'Pedicure with gel polish', nameUa: 'Педикюр з гель-лаком', price: 60, durationMin: 80 },
      { id: 'gellak-verw-pedicure-nieuwe-gellak', nameNl: 'Oude gellak verwijderen, pedicure, nieuwe gellak', nameEn: 'Old gel removal, pedicure and new gel polish', nameUa: 'Зняття старого гель-лаку, педикюр та новий гель-лак', price: 65, durationMin: 100 },
      { id: 'gellak-verwijderen-tenen', nameNl: 'Gellak verwijderen (tenen)', nameEn: 'Gel polish removal (toes)', nameUa: 'Зняття гель-лаку (пальці ніг)', price: 20, durationMin: 10 },
      { id: 'gelnagels-nieuwe-set', nameNl: 'Gelnagels, nieuwe set', nameEn: 'Gel nails, new set', nameUa: 'Нарощування нігтів, новий комплект', price: 80, durationMin: 165 },
      { id: 'gelnagels-opvullen', nameNl: 'Gelnagels opvullen', nameEn: 'Gel nails refill', nameUa: 'Корекція гель-нігтів', price: 80, durationMin: 120 },
      { id: 'nail-art-magnetic', nameNl: 'Nail art, stamping "magnetic" (2 of 4 nagels)', nameEn: 'Nail art, magnetic stamping (2 or 4 nails)', nameUa: 'Дизайн нігтів, магнітний штамп (2 або 4 нігті)', price: 10, durationMin: 10 },
    ],
  },
  {
    id: 'brows-pmu',
    titleNl: 'Wenkbrauwen, wimpers & PMU',
    titleEn: 'Brows, lashes & PMU',
    titleUa: 'Брови, вії та ПМ',
    descriptionNl: 'Modelleren, verven, lifting, wax en permanente make-up voor een verzorgde, natuurlijke blik.',
    descriptionEn: 'Shaping, tinting, lifting, waxing and permanent make-up for a groomed, natural look.',
    descriptionUa: 'Моделювання, фарбування, ламінування, віск та перманентний макіяж для природного вигляду.',
    icon: 'flower',
    services: [
      { id: 'wenkbrauwen-modelleren', nameNl: 'Wenkbrauwen modelleren', nameEn: 'Brow shaping', nameUa: 'Моделювання брів', price: 25, durationMin: 20 },
      { id: 'wenkbrauwen-modelleren-wax-verven', nameNl: 'Wenkbrauwen modelleren, wax en verven', nameEn: 'Brow shaping, wax and tinting', nameUa: 'Моделювання брів, віск та фарбування', price: 45, durationMin: 30 },
      { id: 'wenkbrauwen-of-wimpers-verven', nameNl: 'Wenkbrauwen of wimpers verven', nameEn: 'Brow or lash tinting', nameUa: 'Фарбування брів або вій', price: 16, durationMin: 10 },
      { id: 'brow-lift', nameNl: 'Brow Lift', nameEn: 'Brow lift', nameUa: 'Ламінування брів', price: 55, durationMin: 75 },
      { id: 'wimperlifting', nameNl: 'Wimperlifting', nameEn: 'Lash lift', nameUa: 'Ламінування вій', price: 55, durationMin: 75 },
      { id: 'wax-boven-lippen', nameNl: 'Wax boven de lippen', nameEn: 'Upper-lip wax', nameUa: 'Віск над губою', price: 15, durationMin: 10 },
      { id: 'pmu-adviesgesprek', nameNl: 'PMU adviesgesprek', nameEn: 'PMU consultation', nameUa: 'PMU консультація', price: 0, priceLabel: 'gratis', durationMin: 10 },
      { id: 'powder-wenkbrauwen', nameNl: 'Powder wenkbrauwen', nameEn: 'Powder brows', nameUa: 'Пудрові брови', price: 230, durationMin: 150 },
      { id: 'powder-wenkbrauwen-nabehandeling', nameNl: 'Powder wenkbrauwen, nabehandeling', nameEn: 'Powder brows, touch-up', nameUa: 'Пудрові брови, корекція', price: 150, durationMin: 150, noteNl: 'Na 4–5 weken', noteEn: 'After 4–5 weeks', noteUa: 'Через 4–5 тижнів' },
      { id: 'eyeliner', nameNl: 'Eyeliner', nameEn: 'Eyeliner', nameUa: 'Підводка очей', price: 240, durationMin: 150 },
      { id: 'eyeliner-onder', nameNl: 'Eyeliner onder', nameEn: 'Lower-lid eyeliner', nameUa: 'Підводка нижньої повіки', price: 150, durationMin: 40 },
      { id: 'shadow-eyeliner', nameNl: 'Shadow eyeliner', nameEn: 'Shadow eyeliner', nameUa: 'Тіньова підводка', price: 230, durationMin: 150 },
      { id: 'shadow-eyeliner-nabehandeling', nameNl: 'Shadow eyeliner, nabehandeling', nameEn: 'Shadow eyeliner, touch-up', nameUa: 'Тіньова підводка, корекція', price: 150, durationMin: 135, noteNl: 'Na 4–5 weken', noteEn: 'After 4–5 weeks', noteUa: 'Через 4–5 тижнів' },
      { id: 'infralash', nameNl: 'Infralash', nameEn: 'Infralash', nameUa: null, price: 100, durationMin: 30 },
      { id: 'aquarelle-lippen', nameNl: 'Aquarelle lippen', nameEn: 'Aquarelle lips', nameUa: 'Акварельні губи', price: 250, durationMin: 150 },
      { id: 'aquarelle-lippen-nabehandeling', nameNl: 'Aquarelle lippen, nabehandeling', nameEn: 'Aquarelle lips, touch-up', nameUa: 'Акварельні губи, корекція', price: 150, durationMin: 150 },
    ],
  },
  {
    id: 'laser',
    titleNl: 'Laser',
    titleEn: 'Laser',
    titleUa: 'Лазер',
    descriptionNl: 'Carbon peeling en het laseren van permanente make-up.',
    descriptionEn: 'Carbon peeling and laser removal of permanent make-up.',
    descriptionUa: 'Карбоновий пілінг та лазерне видалення перманентного макіяжу.',
    icon: 'wand',
    services: [
      { id: 'laser-adviesgesprek', nameNl: 'Adviesgesprek', nameEn: 'Consultation', nameUa: 'Консультація', price: 0, priceLabel: 'gratis', durationMin: 10 },
      { id: 'carbon-peeling-1', nameNl: 'Carbon laser peeling gelaat (1 sessie)', nameEn: 'Carbon laser face peeling (1 session)', nameUa: 'Карбоновий лазерний пілінг обличчя (1 сеанс)', price: 90, durationMin: 40 },
      { id: 'carbon-peeling-4', nameNl: 'Carbon laser peeling gelaat (4 sessies)', nameEn: 'Carbon laser face peeling (4 sessions)', nameUa: 'Карбоновий лазерний пілінг обличчя (4 сеанси)', price: 320, durationMin: 40 },
      { id: 'pmu-laseren-wenkbrauwen', nameNl: 'PMU laseren, wenkbrauwen', nameEn: 'PMU laser removal, brows', nameUa: 'Лазерне видалення PMU, брови', price: 100, durationMin: 30 },
      { id: 'pmu-laseren-eyeliner', nameNl: 'PMU laseren, eyeliner', nameEn: 'PMU laser removal, eyeliner', nameUa: 'Лазерне видалення PMU, підводка', price: 120, durationMin: 30 },
      { id: 'pmu-laseren-lippen', nameNl: 'PMU laseren, lippen', nameEn: 'PMU laser removal, lips', nameUa: 'Лазерне видалення PMU, губи', price: 120, durationMin: 30 },
      { id: 'laser-removal', nameNl: 'Tattoo / PMU removal', nameEn: 'Tattoo / PMU removal', nameUa: 'Видалення татуажу / PMU', price: 80, durationMin: 60 },
    ],
  },
  {
    id: 'haar',
    titleNl: 'Haar',
    titleEn: 'Hair',
    titleUa: 'Волосся',
    descriptionNl: 'Knippen en kleuren door Lyuba, op afspraak. Stuur een berichtje voor prijzen en beschikbaarheid.',
    descriptionEn: 'Cuts and colour by Lyuba, by appointment. Send a message for prices and availability.',
    descriptionUa: 'Стрижки та фарбування у Люби, за записом. Напиши нам про ціни і вільні дати.',
    icon: 'scissors',
    services: [],
    hideList: true,
    noteKey: 'services.haarNote',
  },
];
