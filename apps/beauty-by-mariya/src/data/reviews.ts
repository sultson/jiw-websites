import type { Lang } from '../translations';

export type Review = {
  id: number;
  name: string;
  rating: number;
  nl: string;
  en: string;
  ua: string;
  service?: string;
  source: 'Google';
};

export function reviewText(r: Review, lang: Lang): string {
  if (lang === 'en') return r.en;
  if (lang === 'ua') return r.ua;
  return r.nl;
}

export const reviews: Review[] = [
  {
    id: 1,
    name: 'erica Verhoeven',
    rating: 5,
    nl: 'Mariya werkt zeer precies en schoon. Ben zeer tevreden over haar permanente make-up. Zou haar zeker aanraden.',
    en: 'Mariya works very precisely and cleanly. I am very satisfied with her permanent make-up. I would definitely recommend her.',
    ua: 'Марія працює дуже точно і охайно. Дуже задоволена її перманентним макіяжем. Однозначно рекомендую.',
    service: 'Permanent make-up',
    source: 'Google',
  },
  {
    id: 2,
    name: 'Ana Hrom',
    rating: 5,
    nl: 'Mijn eerste lasersessie om de gekleurde wenkbrauwen weg te halen. Ik ben weer blond. Tien minuten, geen pijn. Een fijn persoon.',
    en: 'My first laser session to take out the coloured eyebrows. Now I am back to blond. Ten minutes, no pain. A nice person.',
    ua: 'Мій перший сеанс лазера, щоб прибрати фарбовані брови. Я знову блондинка. Десять хвилин і без болю. Дуже приємна людина.',
    service: 'PMU laser removal',
    source: 'Google',
  },
  {
    id: 3,
    name: 'Arzu Merzifonluoglu',
    rating: 5,
    nl: 'Ze doet geweldig werk.',
    en: 'She is doing a great job.',
    ua: 'Вона робить чудову роботу.',
    service: 'Manicure & nail design',
    source: 'Google',
  },
];

export const rating = {
  overall: 5.0,
  count: 4,
  source: 'Google',
};
