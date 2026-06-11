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
  return '€ ' + p.toFixed(2).replace('.', ',');
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'wenkbrauwen',
    titleNl: 'Wenkbrauwen',
    titleEn: 'Eyebrows',
    icon: 'flower',
    services: [
      {
        id: 'wenkbrauwen-shapen',
        nameNl: 'Wenkbrauwen shapen',
        nameEn: 'Eyebrow shaping',
        descNl: 'Precies waxen of epileren voor de perfecte wenkbrauwvorm.',
        descEn: 'Precise waxing or tweezing for perfectly shaped brows.',
        price: 15, durationMin: 30,
      },
      {
        id: 'wenkbrauwen-shapen-verven',
        nameNl: 'Wenkbrauwen shapen en verven',
        nameEn: 'Eyebrow shaping & tinting',
        descNl: 'Shapen aangevuld met kleuring voor meer diepte en definitie.',
        descEn: 'Shaping combined with tinting for more depth and definition.',
        price: 25, durationMin: 30,
      },
      {
        id: 'hybrid-brows',
        nameNl: 'Hybrid Brows',
        nameEn: 'Hybrid Brows',
        descNl: 'De wenkbrauwen worden geverfd met hybrid en mooi gevormd. Hybrid blijft 7 tot 10 dagen op de huid. Op de haartjes blijft het resultaat tot 7 weken.',
        descEn: 'Brows are tinted with hybrid dye and shaped. Hybrid lasts 7 to 10 days on the skin and up to 7 weeks on the hairs.',
        price: 32, durationMin: 45,
      },
      {
        id: 'browlift',
        nameNl: 'Browlift (excl. verven)',
        nameEn: 'Brow lift (excl. tint)',
        descNl: 'Ook wel brow lamination genoemd. De haartjes worden met lotions in de juiste positie gezet voor optisch vollere wenkbrauwen. Resultaat van 6 tot 8 weken.',
        descEn: 'Also known as brow lamination. Lotions set the hairs in the right position for visually fuller brows. Result lasts 6 to 8 weeks.',
        price: 50, durationMin: 45,
      },
      {
        id: 'browlift-hybrid',
        nameNl: 'Browlift incl. hybrid verf',
        nameEn: 'Brow lift incl. hybrid tint',
        descNl: 'Een browlift waarbij de wenkbrauwen worden behandeld met hybrid verf. Vollere, opgelichte wenkbrauwen met een resultaat van 6 tot 8 weken.',
        descEn: 'A brow lift finished with hybrid tint. Fuller, lifted brows with a result lasting 6 to 8 weeks.',
        price: 55, durationMin: 60,
      },
    ],
  },
  {
    id: 'gezicht',
    titleNl: 'Suikerontharing Gezicht',
    titleEn: 'Sugar Waxing · Face',
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
        nameNl: 'Kaak & wangen',
        nameEn: 'Jawline & cheeks',
        descNl: 'Suikerontharing langs de kaaklijn en wangen.',
        descEn: 'Sugar waxing along the jawline and cheeks.',
        price: 14, durationMin: 15,
      },
      {
        id: 'hals',
        nameNl: 'Hals',
        nameEn: 'Neck',
        descNl: 'Suikerontharing van de halszone.',
        descEn: 'Sugar waxing of the neck area.',
        price: 14, durationMin: 15,
      },
      {
        id: 'volledig-gelaat',
        nameNl: 'Volledig gelaat',
        nameEn: 'Full face',
        descNl: 'Alles zoals voornoemd.',
        descEn: 'All facial zones listed above.',
        price: 52, durationMin: 0,
      },
      {
        id: 'combi-bovenlip-kin-kaak',
        nameNl: 'Combi: bovenlip, kin, kaak',
        nameEn: 'Combo: upper lip, chin, jaw',
        price: 28, durationMin: 0,
      },
      {
        id: 'combi-wenkbrauwen-bovenlip',
        nameNl: 'Combi: wenkbrauwen, bovenlip',
        nameEn: 'Combo: eyebrows, upper lip',
        price: 24, durationMin: 0,
      },
    ],
  },
  {
    id: 'onderlichaam-dames',
    titleNl: 'Onderlichaam dames',
    titleEn: 'Lower body · Women',
    icon: 'leaf',
    services: [
      {
        id: 'buik-navelgebied',
        nameNl: 'Buik (navelgebied)',
        nameEn: 'Abdomen (navel area)',
        descNl: 'Suikerontharing van het navelgebied.',
        descEn: 'Sugar waxing of the navel area.',
        price: 15, durationMin: 15,
      },
      {
        id: 'billen',
        nameNl: 'Billen',
        nameEn: 'Buttocks',
        price: 20, durationMin: 0,
      },
      {
        id: 'bilnaad',
        nameNl: 'Bilnaad',
        nameEn: 'Buttock crease',
        price: 10, durationMin: 0,
      },
      {
        id: 'bikinilijn',
        nameNl: 'Bikinilijn',
        nameEn: 'Bikini line',
        descNl: 'Verzorgde ontharing langs de bikinirand.',
        descEn: 'Neat hair removal along the bikini line.',
        price: 22, durationMin: 20,
      },
      {
        id: 'brazilian',
        nameNl: 'Brazilian',
        nameEn: 'Brazilian',
        descNl: 'Bikinilijn en venusheuvel.',
        descEn: 'Bikini line and mons pubis.',
        price: 31, durationMin: 30,
      },
      {
        id: 'eerste-keer-hollywood',
        nameNl: 'Eerste keer hollywood',
        nameEn: 'First time Hollywood',
        price: 42, durationMin: 0,
      },
      {
        id: 'hollywood',
        nameNl: 'Hollywood',
        nameEn: 'Hollywood',
        descNl: 'Volledige schaamstreek met of zonder bilnaad.',
        descEn: 'Full intimate area with or without buttock crease.',
        price: 42, durationMin: 0,
      },
      {
        id: 'bovenbenen',
        nameNl: 'Bovenbenen',
        nameEn: 'Upper legs',
        descNl: 'Suikerontharing van de bovenbenen.',
        descEn: 'Sugar waxing of the upper legs.',
        price: 32, durationMin: 35,
      },
      {
        id: 'achterkant-bovenbenen',
        nameNl: 'Achterkant bovenbenen',
        nameEn: 'Back of upper legs',
        price: 16, durationMin: 0,
      },
      {
        id: 'onderbenen-voeten',
        nameNl: 'Onderbenen & voeten',
        nameEn: 'Lower legs & feet',
        descNl: 'Suikerontharing van onderbenen en voeten.',
        descEn: 'Sugar waxing of lower legs and feet.',
        price: 32, durationMin: 30,
      },
      {
        id: 'volledige-benen-voeten',
        nameNl: 'Volledige benen & voeten',
        nameEn: 'Full legs & feet',
        descNl: 'Volledige beenbehandeling inclusief voeten.',
        descEn: 'Full leg treatment including feet.',
        price: 60, durationMin: 50,
      },
      {
        id: 'voeten',
        nameNl: 'Voeten',
        nameEn: 'Feet',
        price: 12, durationMin: 0,
      },
      {
        id: 'hollywood-masker',
        nameNl: 'Hollywood + masker',
        nameEn: 'Hollywood + mask',
        price: 50, durationMin: 0,
      },
      {
        id: 'brazilian-masker',
        nameNl: 'Brazilian + masker',
        nameEn: 'Brazilian + mask',
        price: 39, durationMin: 0,
      },
    ],
  },
  {
    id: 'bovenlichaam-dames',
    titleNl: 'Bovenlichaam dames',
    titleEn: 'Upper body · Women',
    icon: 'leaf',
    services: [
      {
        id: 'oksels',
        nameNl: 'Oksels',
        nameEn: 'Armpits',
        descNl: 'Zachte en effectieve ontharing van beide oksels.',
        descEn: 'Gentle and effective removal of both armpits.',
        price: 20, durationMin: 20,
      },
      {
        id: 'onderarmen-handen',
        nameNl: 'Onderarmen & handen',
        nameEn: 'Lower arms & hands',
        price: 28, durationMin: 0,
      },
      {
        id: 'volledige-armen-handen',
        nameNl: 'Volledige armen & handen',
        nameEn: 'Full arms & hands',
        descNl: 'Zachte suikerontharing van armen en handen.',
        descEn: 'Gentle sugar waxing of arms and hands.',
        price: 36, durationMin: 30,
      },
      {
        id: 'onder-rug',
        nameNl: '(Onder) rug',
        nameEn: '(Lower) back',
        descNl: 'Suikerontharing van de rug.',
        descEn: 'Sugar waxing of the back.',
        price: 25, durationMin: 30,
      },
    ],
  },
];
