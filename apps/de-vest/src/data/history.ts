export type Generation = {
  number: 'I' | 'II' | 'III';
  yearKey: string;
  markKey: string;
  nameKey: string;
  bodyKey: string;
};

export const generations: Generation[] = [
  {
    number: 'I',
    yearKey: 'history.gen1.year',
    markKey: 'history.gen1.mark',
    nameKey: 'history.gen1.name',
    bodyKey: 'history.gen1.body',
  },
  {
    number: 'II',
    yearKey: 'history.gen2.year',
    markKey: 'history.gen2.mark',
    nameKey: 'history.gen2.name',
    bodyKey: 'history.gen2.body',
  },
  {
    number: 'III',
    yearKey: 'history.gen3.year',
    markKey: 'history.gen3.mark',
    nameKey: 'history.gen3.name',
    bodyKey: 'history.gen3.body',
  },
];
