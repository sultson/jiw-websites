export type Service = {
  key: string;
  title: string;
  blurb: string;
  bullets: string[];
};

export const services: Service[] = [
  {
    key: 'stukwerk',
    title: 'Stucwerk',
    blurb: 'Strak gestucte wanden en plafonds. Sausklaar of behangklaar.',
    bullets: ['Sausklaar stuken', 'Behangklaar stuken', 'Stucwerk repareren', 'Spachtelputz / sierpleister'],
  },
  {
    key: 'schilderwerk',
    title: 'Schilderwerk',
    blurb: 'Binnen en buiten. Kozijnen, deuren, wanden en plafonds.',
    bullets: ['Wanden en plafonds sausen', 'Deuren en kozijnen', 'Buitenschilderwerk', 'Houtrotreparatie'],
  },
  {
    key: 'tegelwerk',
    title: 'Tegelwerk',
    blurb: 'Wand- en vloertegels voor badkamer, keuken en woonruimte.',
    bullets: ['Badkamer en toilet', 'Keuken backsplash', 'Vloertegels', 'Kitwerk'],
  },
  {
    key: 'renovatie',
    title: 'Renovatie',
    blurb: 'Van badkamer tot complete woning. Eén aanspreekpunt.',
    bullets: ['Badkamer en toilet', 'Keuken plaatsen', 'Vloer egaliseren', 'Laminaat en parket'],
  },
];
