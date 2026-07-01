export type Service = {
  id: string;
  nameNl: string;
  nameEn: string;
  price: string | null;
  itemsNl: string[];
  itemsEn: string[];
  noteNl?: string;
  noteEn?: string;
};

export const services: Service[] = [
  {
    id: 'basisbehandeling',
    nameNl: 'Basisbehandeling',
    nameEn: 'Basic treatment',
    price: '€ 33,50',
    itemsNl: [
      'Knippen van de nagels',
      'Verzorgen van de nagels',
      'Voetcrème',
    ],
    itemsEn: [
      'Nail trimming',
      'Nail care',
      'Foot cream',
    ],
  },
  {
    id: 'basisbehandeling-plus',
    nameNl: 'Basisbehandeling +',
    nameEn: 'Basic treatment +',
    price: '€ 38,50',
    itemsNl: [
      'Knippen en verzorgen van de nagels',
      'Eelt verwijderen',
      'Afvlakken van de nagels (kalknagels)',
      'Kloven behandelen',
      'Likdoorn verwijderen',
      'Ingroeiende nagel behandelen',
      'Voetcrème',
    ],
    itemsEn: [
      'Nail trimming and care',
      'Callus removal',
      'Smoothing thickened nails (fungal nails)',
      'Treating cracked heels',
      'Corn removal',
      'Treating ingrown toenails',
      'Foot cream',
    ],
  },
  {
    id: 'gellak',
    nameNl: 'Gellak op de teennagels',
    nameEn: 'Gel polish on the toenails',
    price: '€ 25',
    itemsNl: [],
    itemsEn: [],
  },
  {
    id: 'voetenbad',
    nameNl: 'Voetenbad met lavendel badkristallen',
    nameEn: 'Foot bath with lavender bath crystals',
    price: null,
    itemsNl: [],
    itemsEn: [],
    noteNl: 'Extra verwennerij',
    noteEn: 'An extra treat',
  },
];
