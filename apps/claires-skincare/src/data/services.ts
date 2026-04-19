export type Service = {
  id: string;
  nameNl: string;
  nameEn: string;
  price: number | string;
  durationMin: number;
  descNl?: string;
  descEn?: string;
};

export type ServiceCategory = {
  id: string;
  titleNl: string;
  titleEn: string;
  icon: 'sparkles' | 'heart' | 'flower' | 'leaf' | 'zap';
  services: Service[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'facials',
    titleNl: 'Gezichtsbehandelingen',
    titleEn: 'Facial Treatments',
    icon: 'sparkles',
    services: [
      {
        id: 'quick-glow',
        nameNl: 'Quick Glow',
        nameEn: 'Quick Glow',
        price: 82,
        durationMin: 40,
        descNl: 'Snelle opfrisbehandeling voor een stralende huid.',
        descEn: 'Quick refresh treatment for glowing skin.',
      },
      {
        id: 'supreme-glow',
        nameNl: 'Supreme Glow Facial',
        nameEn: 'Supreme Glow Facial',
        price: 110,
        durationMin: 70,
        descNl: 'Dieptereiniging, exfoliatie, serum op maat en massage.',
        descEn: 'Deep cleanse, exfoliation, bespoke serum and massage.',
      },
      {
        id: 'purifying',
        nameNl: 'Purifying Facial',
        nameEn: 'Purifying Facial',
        price: 96,
        durationMin: 60,
        descNl: 'Ideaal voor onzuivere of vette huid.',
        descEn: 'Ideal for blemish-prone or oily skin.',
      },
      {
        id: 'hydration-booster',
        nameNl: 'Hydration Booster Facial',
        nameEn: 'Hydration Booster Facial',
        price: 96,
        durationMin: 60,
        descNl: 'Intense hydratatie voor droge of doffe huid.',
        descEn: 'Intense hydration for dry or dull skin.',
      },
    ],
  },
  {
    id: 'advanced',
    titleNl: 'Geavanceerde behandelingen',
    titleEn: 'Advanced Treatments',
    icon: 'zap',
    services: [
      {
        id: 'microdermabrasion-basic',
        nameNl: 'Microdermabrasie',
        nameEn: 'Microdermabrasion',
        price: 110,
        durationMin: 60,
        descNl: 'Mechanische exfoliatie voor een gladde, verfijnde huid.',
        descEn: 'Mechanical exfoliation for smooth, refined skin.',
      },
      {
        id: 'microdermabrasion-plus',
        nameNl: 'Microdermabrasie Plus',
        nameEn: 'Microdermabrasion Plus',
        price: 128,
        durationMin: 75,
        descNl: 'Uitgebreide microdermabrasie met aanvullende verzorging.',
        descEn: 'Extended microdermabrasion with additional care.',
      },
      {
        id: 'microneedling',
        nameNl: 'Microneedling',
        nameEn: 'Microneedling',
        price: 150,
        durationMin: 75,
        descNl: 'Stimuleert collageenproductie voor zichtbaar jonger ogende huid.',
        descEn: 'Stimulates collagen production for visibly younger-looking skin.',
      },
    ],
  },
  {
    id: 'massage',
    titleNl: 'Massage',
    titleEn: 'Massage',
    icon: 'leaf',
    services: [
      {
        id: 'massage-basic',
        nameNl: 'Massage',
        nameEn: 'Massage',
        price: 108,
        durationMin: 60,
        descNl: 'Ontspannende lichaamsmassage.',
        descEn: 'Relaxing body massage.',
      },
      {
        id: 'massage-plus',
        nameNl: 'Massage Plus',
        nameEn: 'Massage Plus',
        price: 128,
        durationMin: 75,
        descNl: 'Uitgebreide massage met extra aandacht voor spanning.',
        descEn: 'Extended massage with extra focus on tension areas.',
      },
    ],
  },
  {
    id: 'brows-lashes',
    titleNl: 'Wenkbrauwen & Wimpers',
    titleEn: 'Eyebrows & Lashes',
    icon: 'heart',
    services: [
      { id: 'brow-shaping', nameNl: 'Wenkbrauw styling', nameEn: 'Brow shaping', price: 20, durationMin: 20 },
      { id: 'brow-tint', nameNl: 'Wenkbrauw verven', nameEn: 'Brow tint', price: 20, durationMin: 15 },
      { id: 'lash-lift', nameNl: 'Lash lift', nameEn: 'Lash lift', price: 75, durationMin: 60 },
      { id: 'lash-tint', nameNl: 'Wimpers verven', nameEn: 'Lash tint', price: 20, durationMin: 20 },
      { id: 'lash-lift-tint', nameNl: 'Lash lift & verven', nameEn: 'Lash lift & tint', price: 80, durationMin: 75 },
    ],
  },
  {
    id: 'waxing',
    titleNl: 'Ontharing (wax)',
    titleEn: 'Waxing',
    icon: 'flower',
    services: [
      { id: 'wax-lip', nameNl: 'Bovenlip', nameEn: 'Upper lip', price: 10, durationMin: 10 },
      { id: 'wax-brows', nameNl: 'Wenkbrauwen', nameEn: 'Eyebrows', price: 15, durationMin: 15 },
      { id: 'wax-underarm', nameNl: 'Oksels', nameEn: 'Underarms', price: 25, durationMin: 20 },
      { id: 'wax-half-leg', nameNl: 'Halve been', nameEn: 'Half leg', price: 35, durationMin: 30 },
      { id: 'wax-full-leg', nameNl: 'Hele been', nameEn: 'Full leg', price: 52, durationMin: 45 },
    ],
  },
  {
    id: 'laser',
    titleNl: 'Laser ontharing',
    titleEn: 'Laser Hair Removal',
    icon: 'sparkles',
    services: [
      { id: 'laser-lip', nameNl: 'Bovenlip', nameEn: 'Upper lip', price: 40, durationMin: 15 },
      { id: 'laser-underarm', nameNl: 'Oksels', nameEn: 'Underarms', price: 60, durationMin: 20 },
      { id: 'laser-half-leg', nameNl: 'Halve been', nameEn: 'Half leg', price: 120, durationMin: 40 },
      { id: 'laser-full-leg', nameNl: 'Hele been', nameEn: 'Full leg', price: 250, durationMin: 60 },
    ],
  },
];
