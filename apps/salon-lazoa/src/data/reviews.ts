export type Review = {
  id: number;
  name: string;
  rating: number;
  nl: string | null;
  en: string | null;
  date: string;
  source: 'Google';
};

export const reviews: Review[] = [
  {
    id: 1,
    name: 'Evi van Melfoort',
    rating: 5,
    nl: 'Super leuke nagelsalon! Vrolijke meid en wil altijd het allerbeste voor haar klanten. Ben er zelf een aantal keer geweest en krijg alleen maar complimenten over mijn nagels van andere mensen. Zeker de moeite waard om te proberen.',
    en: 'Super lovely nail salon. Cheerful woman who always wants the very best for her clients. I’ve been a few times and only get compliments on my nails from other people. Definitely worth trying.',
    date: '2025-06',
    source: 'Google',
  },
  {
    id: 2,
    name: 'Fleur van de Rijt',
    rating: 5,
    nl: 'Super gezellige meid! Secuur en hygiënisch. Mega blij met mijn nagels, kom graag weer terug.',
    en: 'Super pleasant person. Precise and hygienic. Really happy with my nails, I’ll be back.',
    date: '2025-06',
    source: 'Google',
  },
  {
    id: 3,
    name: 'Sophie van Ittersum',
    rating: 5,
    nl: 'Heen geweest voor mijn nagels, echt prachtig resultaat. Super tevreden en ontzettend aardige medewerkster.',
    en: 'Went for my nails, truly beautiful result. Super happy and an incredibly kind person behind the desk.',
    date: '2025-06',
    source: 'Google',
  },
  {
    id: 4,
    name: 'Hanna Last',
    rating: 5,
    nl: 'Fijne nagelstyliste, Zoa heeft er echt oog voor.',
    en: 'A wonderful nail stylist. Zoa really has an eye for it.',
    date: '2025-06',
    source: 'Google',
  },
  {
    id: 5,
    name: 'Heidi van der Heijden',
    rating: 5,
    nl: null,
    en: null,
    date: '2025-06',
    source: 'Google',
  },
  {
    id: 6,
    name: 'Lenn Swinkels',
    rating: 5,
    nl: null,
    en: null,
    date: '2025-06',
    source: 'Google',
  },
];
