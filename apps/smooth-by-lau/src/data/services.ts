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
  icon: 'sparkles' | 'leaf' | 'flower' | 'scissors';
  services: Service[];
};

export function formatPrice(p: number): string {
  return '€ ' + p.toFixed(2).replace('.', ',');
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'gezicht',
    titleNl: 'Suikerontharing Gezicht',
    titleEn: 'Sugar Waxing — Face',
    icon: 'sparkles',
    services: [
      {
        id: 'kin',
        nameNl: 'Kin',
        nameEn: 'Chin',
        descNl: 'Zachte suikerontharing van de kinzone.',
        descEn: 'Gentle sugar waxing of the chin area.',
        price: 11, durationMin: 15,
      },
      {
        id: 'bovenlip',
        nameNl: 'Bovenlip',
        nameEn: 'Upper lip',
        descNl: 'Nauwkeurige ontharing van de bovenlip.',
        descEn: 'Precise hair removal of the upper lip.',
        price: 11, durationMin: 15,
      },
      {
        id: 'kaaklijn-wangen',
        nameNl: 'Kaaklijn & wangen',
        nameEn: 'Jawline & cheeks',
        descNl: 'Suikerontharing langs de kaaklijn en wangen.',
        descEn: 'Sugar waxing along the jawline and cheeks.',
        price: 14, durationMin: 15,
      },
      {
        id: 'nek',
        nameNl: 'Nek',
        nameEn: 'Neck',
        descNl: 'Suikerontharing van de nekzone.',
        descEn: 'Sugar waxing of the neck area.',
        price: 14, durationMin: 15,
      },
    ],
  },
  {
    id: 'lichaam-dames',
    titleNl: 'Suikerontharing Lichaam — Dames',
    titleEn: 'Sugar Waxing — Body (Women)',
    icon: 'leaf',
    services: [
      {
        id: 'oksels',
        nameNl: 'Oksels',
        nameEn: 'Armpits',
        descNl: 'Zachte en effectieve ontharing van beide oksels.',
        descEn: 'Gentle and effective removal of both armpits.',
        price: 15, durationMin: 20,
      },
      {
        id: 'onderbenen',
        nameNl: 'Onderbenen',
        nameEn: 'Lower legs',
        descNl: 'Suikerontharing van knie tot enkel.',
        descEn: 'Sugar waxing from knee to ankle.',
        price: 22, durationMin: 30,
      },
      {
        id: 'bovenbenen',
        nameNl: 'Bovenbenen',
        nameEn: 'Upper legs',
        descNl: 'Suikerontharing van heup tot knie.',
        descEn: 'Sugar waxing from hip to knee.',
        price: 25, durationMin: 35,
      },
      {
        id: 'volledige-benen',
        nameNl: 'Volledige benen',
        nameEn: 'Full legs',
        descNl: 'Volledige beenbehandeling van heup tot enkel.',
        descEn: 'Full leg treatment from hip to ankle.',
        price: 40, durationMin: 50,
      },
      {
        id: 'armen',
        nameNl: 'Armen',
        nameEn: 'Arms',
        descNl: 'Zachte suikerontharing van beide armen.',
        descEn: 'Gentle sugar waxing of both arms.',
        price: 22, durationMin: 30,
      },
      {
        id: 'bikini-lijn',
        nameNl: 'Bikini lijn',
        nameEn: 'Bikini line',
        descNl: 'Verzorgde ontharring langs de bikinirand.',
        descEn: 'Neat hair removal along the bikini line.',
        price: 18, durationMin: 20,
      },
      {
        id: 'brazilian',
        nameNl: 'Brazilian',
        nameEn: 'Brazilian',
        descNl: 'Volledige intieme ontharing — met oog voor comfort en privacy.',
        descEn: 'Full intimate hair removal — with care for comfort and privacy.',
        price: 28, durationMin: 30,
      },
      {
        id: 'buik',
        nameNl: 'Buik',
        nameEn: 'Abdomen',
        descNl: 'Suikerontharing van de buikzone.',
        descEn: 'Sugar waxing of the abdominal area.',
        price: 13, durationMin: 15,
      },
      {
        id: 'rug',
        nameNl: 'Rug',
        nameEn: 'Back',
        descNl: 'Suikerontharing van de rug.',
        descEn: 'Sugar waxing of the back.',
        price: 22, durationMin: 30,
      },
    ],
  },
  {
    id: 'wenkbrauwen',
    titleNl: 'Wenkbrauwen',
    titleEn: 'Eyebrows',
    icon: 'flower',
    services: [
      {
        id: 'brow-shaping',
        nameNl: 'Wenkbrauw stylen',
        nameEn: 'Eyebrow shaping',
        descNl: 'Precies waxen of epileren voor de perfecte wenkbrauwvorm.',
        descEn: 'Precise waxing or tweezing for perfectly shaped brows.',
        price: 15, durationMin: 30,
      },
      {
        id: 'brow-shaping-tint',
        nameNl: 'Wenkbrauw stylen & verven',
        nameEn: 'Eyebrow shaping & tinting',
        descNl: 'Stylen aangevuld met kleuring voor meer diepte en definitie.',
        descEn: 'Shaping combined with tinting for more depth and definition.',
        price: 25, durationMin: 30,
      },
      {
        id: 'hybrid-brows',
        nameNl: 'Hybrid Brows',
        nameEn: 'Hybrid Brows',
        descNl: 'De meest complete wenkbrauwbehandeling — stylen, verven en verzorgen in één.',
        descEn: 'The most complete eyebrow treatment — shaping, tinting and care in one.',
        price: 32, durationMin: 45,
      },
    ],
  },
  {
    id: 'heren',
    titleNl: 'Suikerontharing Heren',
    titleEn: 'Sugar Waxing — Men',
    icon: 'scissors',
    services: [
      {
        id: 'heren-oksels',
        nameNl: 'Oksels',
        nameEn: 'Armpits',
        descNl: 'Suikerontharing van beide oksels.',
        descEn: 'Sugar waxing of both armpits.',
        price: 21, durationMin: 20,
      },
      {
        id: 'heren-rug',
        nameNl: 'Rug',
        nameEn: 'Back',
        descNl: 'Suikerontharing van de volledige rug.',
        descEn: 'Sugar waxing of the full back.',
        price: 28, durationMin: 35,
      },
      {
        id: 'heren-borst',
        nameNl: 'Borst',
        nameEn: 'Chest',
        descNl: 'Suikerontharing van de borst.',
        descEn: 'Sugar waxing of the chest.',
        price: 25, durationMin: 30,
      },
      {
        id: 'heren-onderbenen',
        nameNl: 'Onderbenen',
        nameEn: 'Lower legs',
        descNl: 'Suikerontharing van knie tot enkel.',
        descEn: 'Sugar waxing from knee to ankle.',
        price: 25, durationMin: 30,
      },
      {
        id: 'heren-wenkbrauwen',
        nameNl: 'Wenkbrauwen',
        nameEn: 'Eyebrows',
        descNl: 'Verzorgde wenkbrauwvorm voor heren.',
        descEn: 'Neat eyebrow shaping for men.',
        price: 15, durationMin: 20,
      },
    ],
  },
];
