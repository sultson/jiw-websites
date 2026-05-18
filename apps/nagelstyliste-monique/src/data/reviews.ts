export type Review = {
  id: number;
  name: string;
  rating: number;
  nl: string;
  en: string;
  source: 'Google';
};

// Real Google reviews for Nagelstyliste Monique (5,0 gemiddeld).
export const reviews: Review[] = [
  {
    id: 1,
    name: 'S. van der H.',
    rating: 5,
    nl: 'Echt top! Monique denkt heel goed mee, heeft heel veel keuzes in kleuren, is super vriendelijk en geeft goede uitleg.',
    en: 'Really great! Monique thinks along with you, has so many colour choices, is super friendly and explains everything well.',
    source: 'Google',
  },
  {
    id: 2,
    name: 'Valerie V.',
    rating: 5,
    nl: 'Heel fijn. Ook de service is goed: vriendelijk, duidelijk en lekker meedenkend.',
    en: 'Very nice. The service is great too: friendly, clear and happy to think along with you.',
    source: 'Google',
  },
  {
    id: 3,
    name: 'Christa P.',
    rating: 5,
    nl: 'Hoge kwaliteit en een fijne service. Goede uitleg en heel betrouwbaar.',
    en: 'High quality and lovely service. Good explanation and very reliable.',
    source: 'Google',
  },
];

export const reviewStats = {
  score: '5,0',
  scoreEn: '5.0',
  count: 7,
};
