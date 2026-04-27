export type Review = {
  id: number;
  name: string;
  rating: number;
  date: string;
  nl?: string;
  en?: string;
  source: string;
};

// Real Google Maps reviews for Just by Brigitte (5,0 ★ uit 6).
// Tekst is overgenomen zoals Brigitte's klanten hem op Google plaatsten.
export const reviews: Review[] = [
  {
    id: 1,
    name: 'Henriëtte Kuiper',
    rating: 5,
    date: 'okt. 2025',
    nl: 'Wat een fijne ervaring! Heerlijke geuren gecombineerd met zachte aanrakingen, die toch net genoeg druk geven (wat ik persoonlijk heel fijn vind). Na afloop ging ik heerlijk ontspannen weer naar huis. Echt een aanrader!',
    en: 'What a lovely experience! Wonderful scents combined with soft touches that still give just enough pressure (which I personally really like). Afterwards I went home feeling beautifully relaxed. Really recommended!',
    source: 'Google · Local Guide',
  },
  {
    id: 2,
    name: 'Nicole Velings',
    rating: 5,
    date: 'okt. 2025',
    nl: 'Een heerlijk kadootje voor mezelf, ingepakt door Brigitte. En met veel warmte gegeven aan mij. Echt ontspannen, een sensatie voor je lichaam, de geuren en oliën op je huid. Geslapen als een roosje die nacht.',
    en: 'A wonderful gift to myself, wrapped up by Brigitte. And given with such warmth. Truly relaxing, a treat for the body, scents and oils on your skin. Slept like a baby that night.',
    source: 'Google',
  },
  {
    id: 3,
    name: 'Linda Verberne',
    rating: 5,
    date: 'okt. 2023',
    nl: 'Weer blij met mijn mooie nageltjes!',
    en: 'Happy with my pretty nails again!',
    source: 'Google · Local Guide',
  },
  {
    id: 4,
    name: 'Wilma Smolders',
    rating: 5,
    date: 'sep. 2021',
    source: 'Google',
  },
  {
    id: 5,
    name: 'Joyce Van De Leur',
    rating: 5,
    date: 'aug. 2020',
    source: 'Google · Local Guide',
  },
  {
    id: 6,
    name: 'Brigitte Kroon',
    rating: 5,
    date: 'dec. 2019',
    source: 'Google',
  },
];
