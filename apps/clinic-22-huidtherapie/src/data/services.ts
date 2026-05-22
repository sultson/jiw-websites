export type Service = {
  id: string;
  nameNl: string;
  nameEn: string;
  price: number;
  free?: boolean;
  strikePrice?: number;
  durationMin: number;
  descNl?: string;
  descEn?: string;
};

export type ServiceCategory = {
  id: string;
  titleNl: string;
  titleEn: string;
  icon: 'sparkles' | 'leaf' | 'flower' | 'droplet' | 'zap' | 'sun' | 'tag' | 'gift';
  intakeNote?: { nl: string; en: string };
  services: Service[];
};

export function formatPrice(p: number): string {
  return '€ ' + p.toFixed(2).replace('.', ',');
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'acties',
    titleNl: 'Acties',
    titleEn: 'Deals',
    icon: 'gift',
    intakeNote: {
      nl: 'Lopende acties op laserontharing. Op = op, alleen via online boeking.',
      en: 'Active deals on laser hair removal. While supplies last, online bookings only.',
    },
    services: [
      {
        id: 'acties-gratis-oksels',
        nameNl: '1x Gratis oksels laseren',
        nameEn: '1x Free underarm laser',
        descNl: 'Maak kennis met laserontharing zonder kosten.',
        descEn: 'Try laser hair removal at no cost.',
        price: 0, free: true, durationMin: 30,
      },
      {
        id: 'acties-3-zones',
        nameNl: '3 zones laserontharen',
        nameEn: '3-zone laser hair removal',
        price: 170, strikePrice: 200, durationMin: 40,
      },
      {
        id: 'acties-4-zones',
        nameNl: '4 zones laserontharen',
        nameEn: '4-zone laser hair removal',
        price: 190, strikePrice: 220, durationMin: 50,
      },
      {
        id: 'acties-5-zones',
        nameNl: '5 zones laserontharen',
        nameEn: '5-zone laser hair removal',
        price: 220, strikePrice: 250, durationMin: 60,
      },
      {
        id: 'acties-full-body',
        nameNl: 'Full body laserontharen',
        nameEn: 'Full body laser hair removal',
        price: 250, strikePrice: 299, durationMin: 90,
      },
    ],
  },
  {
    id: 'intake',
    titleNl: 'Intake en consult',
    titleEn: 'Intake & consult',
    icon: 'sparkles',
    intakeNote: {
      nl: 'Elk traject begint met een gratis kennismaking en huidanalyse op maat.',
      en: 'Every course starts with a free intake and tailored skin analysis.',
    },
    services: [
      {
        id: 'intake-huidadvies',
        nameNl: 'Intake huidadvies',
        nameEn: 'Skin advice intake',
        descNl: 'Kennismaking, huidanalyse en behandelplan op maat.',
        descEn: 'Introduction, skin analysis and tailored treatment plan.',
        price: 0, free: true, durationMin: 30,
      },
      {
        id: 'intake-huidadvies-behandeling',
        nameNl: 'Intake huidadvies met behandeltijd',
        nameEn: 'Skin advice intake with treatment time',
        descNl: 'Uitgebreide intake plus tijd voor een directe behandeling.',
        descEn: 'In-depth intake plus time for an immediate treatment.',
        price: 0, free: true, durationMin: 60,
      },
      {
        id: 'intake-laser',
        nameNl: 'Intake laserontharen',
        nameEn: 'Laser hair removal intake',
        descNl: 'Korte intake speciaal voor laserontharing.',
        descEn: 'Short intake specifically for laser hair removal.',
        price: 0, free: true, durationMin: 15,
      },
    ],
  },
  {
    id: 'huidbehandelingen',
    titleNl: 'Huidbehandelingen gezicht en lichaam',
    titleEn: 'Skin treatments face & body',
    icon: 'droplet',
    services: [
      {
        id: 'chemische-peeling',
        nameNl: 'Chemische peeling',
        nameEn: 'Chemical peel',
        descNl: 'Resultaatgerichte peeling voor pigment, doffe huid en oneffenheden.',
        descEn: 'Result-driven peel for pigment, dull skin and uneven texture.',
        price: 110, durationMin: 60,
      },
      {
        id: 'biopeeling-gezicht',
        nameNl: 'BIO peeling gezicht',
        nameEn: 'BIO peel face',
        descNl: 'Intensieve peeling op basis van algen en plantenextracten.',
        descEn: 'Intensive peel based on algae and plant extracts.',
        price: 110, durationMin: 60,
      },
      {
        id: 'biopeeling-rug',
        nameNl: 'BIO peeling rug',
        nameEn: 'BIO peel back',
        price: 160, durationMin: 60,
      },
      {
        id: 'dieptereiniging',
        nameNl: 'Dieptereiniging',
        nameEn: 'Deep cleansing',
        descNl: 'Grondige reiniging met extractie en kalmerende afronding.',
        descEn: 'Thorough cleansing with extraction and calming finish.',
        price: 65, durationMin: 60,
      },
      {
        id: 'microneedling-plekje',
        nameNl: 'Microneedling Dermapen 4: 1 plekje',
        nameEn: 'Microneedling Dermapen 4: 1 spot',
        price: 90, durationMin: 30,
      },
      {
        id: 'microneedling-klein',
        nameNl: 'Microneedling Dermapen 4: klein oppervlak',
        nameEn: 'Microneedling Dermapen 4: small area',
        price: 120, durationMin: 30,
      },
      {
        id: 'microneedling-groot',
        nameNl: 'Microneedling Dermapen 4: groot oppervlak',
        nameEn: 'Microneedling Dermapen 4: large area',
        price: 185, durationMin: 45,
      },
      {
        id: 'microneedling-gezicht',
        nameNl: 'Microneedling Dermapen 4: gezicht',
        nameEn: 'Microneedling Dermapen 4: face',
        descNl: 'Volledige gezichtsbehandeling voor textuur, poriën en littekens.',
        descEn: 'Full face treatment for texture, pores and scars.',
        price: 165, durationMin: 45,
      },
      {
        id: 'microneedling-gezicht-hals',
        nameNl: 'Microneedling Dermapen 4: gezicht en hals',
        nameEn: 'Microneedling Dermapen 4: face & neck',
        price: 185, durationMin: 50,
      },
      {
        id: 'microneedling-gezicht-hals-decollete',
        nameNl: 'Microneedling Dermapen 4: gezicht, hals en décolleté',
        nameEn: 'Microneedling Dermapen 4: face, neck & décolleté',
        price: 200, durationMin: 60,
      },
      {
        id: 'microneedling-rug',
        nameNl: 'Microneedling Dermapen 4: rug',
        nameEn: 'Microneedling Dermapen 4: back',
        price: 200, durationMin: 60,
      },
      {
        id: 'acne-litteken',
        nameNl: 'Acne littekenbehandeling met microneedling',
        nameEn: 'Acne scar treatment with microneedling',
        descNl: 'Gerichte aanpak van acne-littekens in het gelaat.',
        descEn: 'Targeted treatment of acne scars on the face.',
        price: 165, durationMin: 60,
      },
    ],
  },
  {
    id: 'laser-pakketten',
    titleNl: 'Laserontharen pakketten',
    titleEn: 'Laser hair removal packages',
    icon: 'zap',
    intakeNote: {
      nl: 'Behandelingen met de GentleMax Pro Plus, veilig en effectief voor alle huidtypes.',
      en: 'Treatments with the GentleMax Pro Plus, safe and effective for all skin types.',
    },
    services: [
      {
        id: 'pakket-3-zones',
        nameNl: '3 zones',
        nameEn: '3 zones',
        price: 170, strikePrice: 200, durationMin: 40,
      },
      {
        id: 'pakket-4-zones',
        nameNl: '4 zones',
        nameEn: '4 zones',
        price: 190, strikePrice: 220, durationMin: 50,
      },
      {
        id: 'pakket-5-zones',
        nameNl: '5 zones',
        nameEn: '5 zones',
        price: 220, strikePrice: 250, durationMin: 60,
      },
      {
        id: 'pakket-full-body',
        nameNl: 'Full body',
        nameEn: 'Full body',
        price: 250, strikePrice: 299, durationMin: 90,
      },
    ],
  },
  {
    id: 'laser-zones',
    titleNl: 'Laserontharen losse zones',
    titleEn: 'Laser hair removal per zone',
    icon: 'zap',
    services: [
      { id: 'l-bovenlip',     nameNl: 'Bovenlip',                  nameEn: 'Upper lip',           price: 45,  durationMin: 15 },
      { id: 'l-bakkebaard',   nameNl: 'Bakkebaard',                nameEn: 'Sideburns',           price: 45,  durationMin: 15 },
      { id: 'l-kin',          nameNl: 'Kin',                       nameEn: 'Chin',                price: 55,  durationMin: 15 },
      { id: 'l-hals',         nameNl: 'Hals',                      nameEn: 'Throat',              price: 75,  durationMin: 15 },
      { id: 'l-nek',          nameNl: 'Nek',                       nameEn: 'Neck',                price: 75,  durationMin: 15 },
      { id: 'l-gelaat',       nameNl: 'Gelaat',                    nameEn: 'Full face',           price: 99,  durationMin: 30 },
      { id: 'l-gezicht-hals', nameNl: 'Gezicht en hals',           nameEn: 'Face & throat',       price: 99,  durationMin: 20 },
      { id: 'l-oksels',       nameNl: 'Oksels',                    nameEn: 'Armpits',             price: 60,  durationMin: 15 },
      { id: 'l-onderarmen',   nameNl: 'Onderarmen',                nameEn: 'Lower arms',          price: 120, durationMin: 20 },
      { id: 'l-bovenarmen',   nameNl: 'Bovenarmen',                nameEn: 'Upper arms',          price: 120, durationMin: 20 },
      { id: 'l-armen',        nameNl: 'Gehele armen',              nameEn: 'Full arms',           price: 160, durationMin: 30 },
      { id: 'l-tepels',       nameNl: 'Rondom de tepels',          nameEn: 'Around nipples',      price: 45,  durationMin: 15 },
      { id: 'l-buik',         nameNl: 'Buik',                      nameEn: 'Abdomen',             price: 120, durationMin: 25 },
      { id: 'l-rug',          nameNl: 'Rug',                       nameEn: 'Back',                price: 125, durationMin: 30 },
      { id: 'l-onderbenen',   nameNl: 'Onderbenen',                nameEn: 'Lower legs',          price: 130, durationMin: 30 },
      { id: 'l-bovenbenen',   nameNl: 'Bovenbenen',                nameEn: 'Upper legs',          price: 130, durationMin: 30 },
      { id: 'l-benen',        nameNl: 'Gehele benen',              nameEn: 'Full legs',           price: 170, durationMin: 40 },
      { id: 'l-schaamstreek', nameNl: 'Volledige schaamstreek',    nameEn: 'Full bikini area',    price: 120, durationMin: 20 },
    ],
  },
  {
    id: 'medisch',
    titleNl: 'Vaat- en pigmentlasertherapie',
    titleEn: 'Vascular & pigment laser therapy',
    icon: 'sun',
    intakeNote: {
      nl: 'Voor couperose, kleine vaatjes en pigmentvlekken. Onderdeel van het traject huidverbetering.',
      en: 'For couperose, small vessels and pigment spots. Part of the skin improvement journey.',
    },
    services: [
      { id: 'vaat-plekje',    nameNl: 'Vaatlaser: 1 plekje',          nameEn: 'Vascular laser: 1 spot',         price: 55,  durationMin: 10 },
      { id: 'vaat-15',        nameNl: 'Vaatlaser: per 15 minuten',    nameEn: 'Vascular laser: per 15 minutes', price: 95,  durationMin: 25 },
      { id: 'vaat-30',        nameNl: 'Vaatlaser: per 30 minuten',    nameEn: 'Vascular laser: per 30 minutes', price: 150, durationMin: 35 },
      { id: 'pigment-plekje', nameNl: 'Pigmentlaser: 1 plekje',       nameEn: 'Pigment laser: 1 spot',          price: 55,  durationMin: 30 },
      { id: 'pigment-klein',  nameNl: 'Pigmentlaser: klein oppervlak',nameEn: 'Pigment laser: small area',      price: 95,  durationMin: 30 },
      { id: 'pigment-groot',  nameNl: 'Pigmentlaser: groot oppervlak',nameEn: 'Pigment laser: large area',      price: 150, durationMin: 35 },
    ],
  },
];
