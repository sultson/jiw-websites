export type Service = {
  key: string;
  title: string;
  blurb: string;
  bullets: string[];
};

export const services: Service[] = [
  {
    key: 'stuken',
    title: 'Stucwerk',
    blurb: 'Strak gladde wanden en plafonds. Binnen en buiten.',
    bullets: ['Sausklaar stuken', 'Behangklaar stuken', 'Raapwerk', 'Spachtelputz / sierpleister'],
  },
  {
    key: 'schilderen',
    title: 'Schilderwerk',
    blurb: 'Binnen en buiten schilderen. Strakke afwerking.',
    bullets: ['Wanden en plafonds', 'Deuren en kozijnen', 'Gevels', 'Houtrotreparatie'],
  },
  {
    key: 'renovatie',
    title: 'Renovatie',
    blurb: 'Van badkamer tot complete woning. Eén aanspreekpunt.',
    bullets: ['Badkamer en wc', 'Vloer egaliseren', 'Behangen', 'Complete woningrenovatie'],
  },
  {
    key: 'nieuwbouw',
    title: 'Nieuwbouw',
    blurb: 'Strak en professioneel werk voor nieuwbouwprojecten.',
    bullets: ['Stucwerk nieuwbouw', 'Afbouw', 'Spuitwerk', 'Oplevering zonder punten'],
  },
];
