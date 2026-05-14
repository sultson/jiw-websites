import type { Lang } from '../translations';

export type Service = {
  id: string;
  name: Record<Lang, string>;
  desc?: Record<Lang, string>;
  price: number;
  durationMin: number;
};

export type ServiceCategory = {
  id: string;
  title: Record<Lang, string>;
  icon: 'sparkles' | 'gem' | 'palette';
  services: Service[];
};

export function formatPrice(p: number): string {
  if (p === 0) return '—';
  return '€ ' + p.toFixed(2).replace('.', ',');
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'manicure',
    title: { en: 'Manicure', nl: 'Manicure', pl: 'Manicure' },
    icon: 'sparkles',
    services: [
      {
        id: 'classic-manicure',
        name: {
          en: 'Classic manicure',
          nl: 'Klassieke manicure',
          pl: 'Manicure klasyczny',
        },
        desc: {
          en: 'Shape, cuticle care and buff. Natural finish, no polish.',
          nl: 'Vijlen, nagelriemverzorging en buffen. Natuurlijke afwerking, zonder lak.',
          pl: 'Piłowanie, pielęgnacja skórek i polerowanie. Naturalne wykończenie, bez lakieru.',
        },
        price: 30,
        durationMin: 45,
      },
      {
        id: 'structured-manicure',
        name: {
          en: 'Structured manicure (Russian)',
          nl: 'Gestructureerde manicure (Russisch)',
          pl: 'Manicure strukturalny (rosyjski)',
        },
        desc: {
          en: 'Dry e-file cuticle prep, shaping and finish. The base of every long-lasting set.',
          nl: 'Droge nagelriembewerking met frees, vijlen en afwerking. De basis voor elke set die lang meegaat.',
          pl: 'Sucha praca frezarką wokół skórek, piłowanie i wykończenie. Baza każdej trwałej stylizacji.',
        },
        price: 40,
        durationMin: 60,
      },
      {
        id: 'gel-polish',
        name: {
          en: 'Structured manicure + gel polish',
          nl: 'Gestructureerde manicure + gellak',
          pl: 'Manicure strukturalny + hybryda',
        },
        desc: {
          en: 'Full structured prep with gel polish. Holds 3 to 4 weeks.',
          nl: 'Volledige gestructureerde voorbereiding met gellak. Houdt 3 tot 4 weken.',
          pl: 'Pełne strukturalne opracowanie z hybrydą. Utrzymuje się 3 do 4 tygodni.',
        },
        price: 45,
        durationMin: 75,
      },
      {
        id: 'soak-off',
        name: {
          en: 'Soak-off and care',
          nl: 'Verwijderen en verzorgen',
          pl: 'Zdjęcie i pielęgnacja',
        },
        desc: {
          en: 'Safe removal of gel polish or extensions, plus a care manicure.',
          nl: 'Veilig verwijderen van gellak of verlenging, met verzorgende manicure.',
          pl: 'Bezpieczne zdjęcie hybrydy lub przedłużeń wraz z manicure pielęgnacyjnym.',
        },
        price: 25,
        durationMin: 45,
      },
    ],
  },
  {
    id: 'extensions',
    title: { en: 'Extensions', nl: 'Verlengingen', pl: 'Przedłużanie' },
    icon: 'gem',
    services: [
      {
        id: 'gel-extensions',
        name: {
          en: 'Gel extensions',
          nl: 'Nagelverlenging in gel',
          pl: 'Przedłużanie żelem',
        },
        desc: {
          en: 'Length and shape built in gel, finished in the color of your choice.',
          nl: 'Lengte en vorm opgebouwd in gel, afgewerkt in de kleur naar keuze.',
          pl: 'Długość i kształt budowane żelem, wykończone wybranym kolorem.',
        },
        price: 55,
        durationMin: 105,
      },
      {
        id: 'refill',
        name: {
          en: 'Gel refill',
          nl: 'Bijvullen gel',
          pl: 'Uzupełnienie żelu',
        },
        desc: {
          en: 'Refill on existing gel extensions, including cuticle prep and color.',
          nl: 'Bijvulbeurt op bestaande gelverlenging, inclusief nagelriem en kleur.',
          pl: 'Uzupełnienie istniejącej stylizacji, łącznie z opracowaniem skórek i kolorem.',
        },
        price: 50,
        durationMin: 90,
      },
    ],
  },
  {
    id: 'art',
    title: { en: 'Nail art & extras', nl: 'Nail art & extra', pl: 'Zdobienia i dodatki' },
    icon: 'palette',
    services: [
      {
        id: 'nailart',
        name: {
          en: 'Nail art (per nail)',
          nl: 'Nail art (per nagel)',
          pl: 'Zdobienia (za paznokieć)',
        },
        desc: {
          en: 'French, ombré, line work or small designs. Price per nail.',
          nl: 'French, ombré, lijntjes of kleine designs. Tarief per nagel.',
          pl: 'French, ombré, linie lub drobne wzory. Cena za paznokieć.',
        },
        price: 2,
        durationMin: 15,
      },
      {
        id: 'pedicure',
        name: {
          en: 'Pedicure with gel polish',
          nl: 'Pedicure met gellak',
          pl: 'Pedicure z hybrydą',
        },
        desc: {
          en: 'Foot care, shaping and gel polish. Comfortable and long-lasting.',
          nl: 'Voetverzorging, vorm geven en gellak. Comfortabel en langdurig.',
          pl: 'Pielęgnacja stóp, kształtowanie i hybryda. Komfortowo i na długo.',
        },
        price: 40,
        durationMin: 60,
      },
    ],
  },
];
