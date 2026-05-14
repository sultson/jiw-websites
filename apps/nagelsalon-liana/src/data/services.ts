export type Service = {
  id: string;
  nameNl: string;
  nameEn: string;
  price: number;
  durationMin: number;
  descNl?: string;
  descEn?: string;
  fromPrice?: boolean;
};

export type ServiceCategory = {
  id: string;
  titleNl: string;
  titleEn: string;
  icon: 'nails' | 'feet' | 'brows' | 'wax' | 'laser';
  services: Service[];
};

export function formatPrice(p: number, from = false): string {
  const v = '€ ' + p.toFixed(2).replace('.', ',');
  return from ? 'vanaf ' + v : v;
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'manicure',
    titleNl: 'Manicure & gel',
    titleEn: 'Manicure & gel',
    icon: 'nails',
    services: [
      {
        id: 'manicure-basis',
        nameNl: 'Basis manicure',
        nameEn: 'Basic manicure',
        descNl: 'Vijlen, nagelriemen, behandelen en verzorgen.',
        descEn: 'Filing, cuticles, treatment and care.',
        price: 25, durationMin: 45,
      },
      {
        id: 'russian-manicure',
        nameNl: 'Russian manicure',
        nameEn: 'Russian manicure',
        descNl: 'Precieze droge manicure met e-file. Strakke nagelriemen, lange houdbaarheid.',
        descEn: 'Precise dry manicure with e-file. Sharp cuticles, long lasting.',
        price: 35, durationMin: 60,
      },
      {
        id: 'gel-natural',
        nameNl: 'Gel op natuurlijke nagel',
        nameEn: 'Gel on natural nail',
        descNl: 'Versterken en kleur op je eigen nagel.',
        descEn: 'Strengthening and colour on your own nail.',
        price: 40, durationMin: 75, fromPrice: true,
      },
      {
        id: 'gel-extensions',
        nameNl: 'Gel verlenging',
        nameEn: 'Gel extension',
        descNl: 'Verlenging met tip of forms in gel.',
        descEn: 'Extension with tips or forms in gel.',
        price: 50, durationMin: 90, fromPrice: true,
      },
      {
        id: 'polygel',
        nameNl: 'Polygel set',
        nameEn: 'Polygel set',
        descNl: 'Sterk en lichtgewicht. Ideaal voor langere nagels.',
        descEn: 'Strong and lightweight. Ideal for longer nails.',
        price: 55, durationMin: 105, fromPrice: true,
      },
      {
        id: 'opvullen',
        nameNl: 'Opvullen',
        nameEn: 'Refill',
        descNl: 'Onderhoud van bestaande set, na 3 tot 4 weken.',
        descEn: 'Maintenance of an existing set, after 3 to 4 weeks.',
        price: 35, durationMin: 75, fromPrice: true,
      },
      {
        id: 'french',
        nameNl: 'French / babyboomer',
        nameEn: 'French / babyboomer',
        descNl: 'Tijdloze afwerking. Meerprijs op set of opvullen.',
        descEn: 'Timeless finish. Surcharge on set or refill.',
        price: 10, durationMin: 0,
      },
      {
        id: 'nail-art',
        nameNl: 'Nail art',
        nameEn: 'Nail art',
        descNl: 'Per nagel. Steentjes, foil, hand-painted.',
        descEn: 'Per nail. Stones, foil, hand-painted.',
        price: 3, durationMin: 0, fromPrice: true,
      },
      {
        id: 'remove',
        nameNl: 'Verwijderen gel / polygel',
        nameEn: 'Remove gel / polygel',
        descNl: 'Zonder vervolgbehandeling.',
        descEn: 'Without follow-up treatment.',
        price: 15, durationMin: 30,
      },
    ],
  },
  {
    id: 'pedicure',
    titleNl: 'Pedicure',
    titleEn: 'Pedicure',
    icon: 'feet',
    services: [
      {
        id: 'pedicure-basis',
        nameNl: 'Basis pedicure',
        nameEn: 'Basic pedicure',
        descNl: 'Knippen, vijlen, eelt en nagelriemen.',
        descEn: 'Cutting, filing, callus and cuticles.',
        price: 35, durationMin: 45,
      },
      {
        id: 'pedicure-gellak',
        nameNl: 'Pedicure met gellak',
        nameEn: 'Pedicure with gel polish',
        descNl: 'Pedicure aangevuld met gellak in kleur naar keuze.',
        descEn: 'Pedicure plus gel polish in the colour of your choice.',
        price: 50, durationMin: 75,
      },
      {
        id: 'eeltbehandeling',
        nameNl: 'Eeltbehandeling',
        nameEn: 'Callus treatment',
        descNl: 'Volledige verwijdering van eelt en kloven.',
        descEn: 'Full removal of calluses and cracks.',
        price: 30, durationMin: 30,
      },
      {
        id: 'likdoorn',
        nameNl: 'Likdoorn verwijderen',
        nameEn: 'Corn removal',
        descNl: 'Gerichte verwijdering van een likdoorn.',
        descEn: 'Targeted corn removal.',
        price: 15, durationMin: 0,
      },
    ],
  },
  {
    id: 'brows',
    titleNl: 'Wenkbrauwen & PMU',
    titleEn: 'Brows & PMU',
    icon: 'brows',
    services: [
      {
        id: 'brow-shape',
        nameNl: 'Wenkbrauwen epileren / harsen',
        nameEn: 'Brow shaping',
        descNl: 'Vormgeven met pincet of bijenwas.',
        descEn: 'Shaping with tweezers or beeswax.',
        price: 12, durationMin: 20,
      },
      {
        id: 'brow-tint',
        nameNl: 'Wenkbrauwen verven',
        nameEn: 'Brow tinting',
        descNl: 'Kleuring voor meer diepte en definitie.',
        descEn: 'Tinting for more depth and definition.',
        price: 12, durationMin: 20,
      },
      {
        id: 'brow-shape-tint',
        nameNl: 'Shapen + verven',
        nameEn: 'Shaping + tinting',
        descNl: 'De volledige wenkbrauwbehandeling.',
        descEn: 'The full brow treatment.',
        price: 22, durationMin: 30,
      },
      {
        id: 'henna',
        nameNl: 'Henna brows',
        nameEn: 'Henna brows',
        descNl: 'Natuurlijke kleuring met henna. Resultaat tot 6 weken.',
        descEn: 'Natural henna tint. Lasts up to 6 weeks.',
        price: 32, durationMin: 45,
      },
      {
        id: 'hybrid',
        nameNl: 'Hybrid brows',
        nameEn: 'Hybrid brows',
        descNl: 'Hybride verf, 7 tot 10 dagen op de huid en tot 7 weken op de haartjes.',
        descEn: 'Hybrid dye, 7-10 days on the skin and up to 7 weeks on the hairs.',
        price: 35, durationMin: 45,
      },
      {
        id: 'pmu-brows',
        nameNl: 'PMU wenkbrauwen',
        nameEn: 'PMU brows',
        descNl: 'Permanente make-up voor wenkbrauwen. Inclusief bijwerk-afspraak.',
        descEn: 'Permanent make-up for brows. Includes touch-up appointment.',
        price: 350, durationMin: 150, fromPrice: true,
      },
      {
        id: 'pmu-eyeliner',
        nameNl: 'PMU eyeliner',
        nameEn: 'PMU eyeliner',
        descNl: 'Permanente eyeliner boven of onder. Inclusief bijwerk-afspraak.',
        descEn: 'Permanent eyeliner top or bottom. Touch-up included.',
        price: 300, durationMin: 120, fromPrice: true,
      },
      {
        id: 'pmu-lips',
        nameNl: 'PMU lippen',
        nameEn: 'PMU lips',
        descNl: 'Lipblush of contour. Inclusief bijwerk-afspraak.',
        descEn: 'Lip blush or contour. Touch-up included.',
        price: 400, durationMin: 150, fromPrice: true,
      },
    ],
  },
  {
    id: 'waxing',
    titleNl: 'Ontharing · beeswax',
    titleEn: 'Hair removal · beeswax',
    icon: 'wax',
    services: [
      {
        id: 'wax-bovenlip',  nameNl: 'Bovenlip',         nameEn: 'Upper lip',   price: 10, durationMin: 10 },
        { id: 'wax-kin',     nameNl: 'Kin',              nameEn: 'Chin',        price: 10, durationMin: 10 },
        { id: 'wax-wangen',  nameNl: 'Wangen',           nameEn: 'Cheeks',      price: 12, durationMin: 15 },
        { id: 'wax-oksels',  nameNl: 'Oksels',           nameEn: 'Armpits',     price: 18, durationMin: 20 },
        { id: 'wax-armen',   nameNl: 'Armen',            nameEn: 'Arms',        price: 25, durationMin: 30 },
        { id: 'wax-bikini',  nameNl: 'Bikinilijn',       nameEn: 'Bikini line', price: 22, durationMin: 20 },
        { id: 'wax-onderbenen', nameNl: 'Onderbenen',    nameEn: 'Lower legs',  price: 25, durationMin: 30 },
        { id: 'wax-volledig', nameNl: 'Volledige benen', nameEn: 'Full legs',   price: 45, durationMin: 50 },
    ],
  },
  {
    id: 'laser',
    titleNl: 'Ice diode laser',
    titleEn: 'Ice diode laser',
    icon: 'laser',
    services: [
      {
        id: 'laser-bovenlip',
        nameNl: 'Bovenlip',
        nameEn: 'Upper lip',
        descNl: 'Permanente ontharing met ice diode laser. Prijs per sessie.',
        descEn: 'Permanent hair removal with ice diode laser. Per session.',
        price: 25, durationMin: 15,
      },
      {
        id: 'laser-oksels',
        nameNl: 'Oksels',
        nameEn: 'Armpits',
        price: 45, durationMin: 20,
      },
      {
        id: 'laser-bikini',
        nameNl: 'Bikinilijn',
        nameEn: 'Bikini line',
        price: 55, durationMin: 25,
      },
      {
        id: 'laser-brazilian',
        nameNl: 'Brazilian',
        nameEn: 'Brazilian',
        price: 75, durationMin: 30,
      },
      {
        id: 'laser-onderbenen',
        nameNl: 'Onderbenen',
        nameEn: 'Lower legs',
        price: 90, durationMin: 40,
      },
      {
        id: 'laser-volledige-benen',
        nameNl: 'Volledige benen',
        nameEn: 'Full legs',
        price: 145, durationMin: 60,
      },
      {
        id: 'laser-rug',
        nameNl: 'Rug (heren / dames)',
        nameEn: 'Back (men / women)',
        price: 120, durationMin: 45,
      },
      {
        id: 'laser-consult',
        nameNl: 'Eerste consult + proefpuls',
        nameEn: 'First consult + test pulse',
        descNl: 'Gratis bij het boeken van een eerste sessie.',
        descEn: 'Free when booking a first session.',
        price: 0, durationMin: 20,
      },
    ],
  },
];
