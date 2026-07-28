export type ServiceKey =
  | 'loodgieterswerk'
  | 'timmerwerk'
  | 'tegelwerk'
  | 'kitwerk'
  | 'schilderwerk'
  | 'stucwerk'
  | 'straatwerk';

export interface Service {
  key: ServiceKey;
  name: string;
  short: string;
  description: string;
  image: string;
}

export const SERVICES: Service[] = [
  {
    key: 'loodgieterswerk',
    name: 'Loodgieterswerk',
    short: 'Lekkages, leidingen en sanitair',
    description:
      'Van het verhelpen van een lekkage tot het leggen van nieuwe leidingen en het installeren van sanitair. Snel ter plaatse, opgelost met zo min mogelijk overlast.',
    image: '/images/loodgieterswerk.webp',
  },
  {
    key: 'timmerwerk',
    name: 'Timmerwerk',
    short: 'Maatwerk in hout',
    description:
      'Timmerwerk dat functionaliteit combineert met esthetiek. Maatwerkoplossingen die aansluiten op het interieur en de wensen van de opdrachtgever.',
    image: '/images/timmerwerk.webp',
  },
  {
    key: 'tegelwerk',
    name: 'Tegelwerk',
    short: 'Vloeren en wanden',
    description:
      'Vloeren, wanden en overige ruimtes betegeld met precisie. Een strakke, duurzame afwerking in uiteenlopende materialen.',
    image: '/images/tegelwerk.webp',
  },
  {
    key: 'kitwerk',
    name: 'Kitwerk',
    short: 'Waterdichte afwerking',
    description:
      'Waterdichte en duurzame afwerking in badkamers, keukens en andere vochtgevoelige ruimtes. Klein werk dat de levensduur van een gebouw verlengt.',
    image: '/images/kitwerk.webp',
  },
  {
    key: 'schilderwerk',
    name: 'Schilderwerk',
    short: 'Binnen en buiten',
    description:
      'Binnen- en buitenschilderwerk met hoogwaardige verfproducten. Oog voor detail en een resultaat dat lang meegaat.',
    image: '/images/schilderwerk.webp',
  },
  {
    key: 'stucwerk',
    name: 'Stucwerk',
    short: 'Strakke wanden en plafonds',
    description:
      'Gladde, strak afgewerkte wanden en plafonds. Als eindresultaat of als voorbereiding op schilderwerk of behang.',
    image: '/images/stucwerk.webp',
  },
  {
    key: 'straatwerk',
    name: 'Straatwerk',
    short: 'Opritten, terrassen en paden',
    description:
      'Opritten, terrassen en tuinpaden, strak gelegd en duurzaam afgewerkt. De buitenruimte net zo verzorgd als het gebouw zelf.',
    image: '/images/straatwerk.webp',
  },
];

export const PHONE_DISPLAY = '085 124 94 29';
export const PHONE_HREF = 'tel:+31851249429';
export const EMAIL = 'info@behrbouw.nl';
export const ADDRESS = 'Spakenburglaan 5, 8244 DW Lelystad';
