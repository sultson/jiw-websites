export type Review = {
  id: number;
  name: string;
  rating: number;
  date: string;
  nl?: string;
  en?: string;
  source: string;
};

// Echte Google Maps recensies voor Nailtique by Linn (5,0 uit 7).
// Tekst is overgenomen zoals klanten hem op Google plaatsten.
export const reviews: Review[] = [
  {
    id: 1,
    name: 'Martine B.',
    rating: 5,
    date: 'dec. 2025',
    nl: 'Ik ga al enige tijd naar Nailtique by Linn voor mijn nagels. Lindsay werkt ontzettend nauwkeurig, heeft oog voor detail en mijn nagels zien er elke keer weer prachtig uit en blijven supergoed zitten. Een aanrader voor iedereen die op zoek is naar kwaliteit, gezelligheid en mooie nagels!',
    en: 'I have been going to Nailtique by Linn for my nails for a while now. Lindsay works incredibly precisely, has an eye for detail, and my nails look beautiful every single time and stay on really well. A recommendation for anyone looking for quality, a warm welcome and beautiful nails!',
    source: 'Google',
  },
  {
    id: 2,
    name: 'Julia Mulder',
    rating: 5,
    date: 'dec. 2025',
    nl: 'Ik ben bij veel verschillende nagelstudio\'s geweest, maar vind de studio van Lindsay super mooi en netjes. Ik zou mijn nagels bij geen andere studio meer willen doen. De nagels zien er fantastisch uit en ze neemt uitgebreid de tijd voor je, zodat je met een grote glimlach weer kunt vertrekken. Heel meedenkend is ze ook!',
    en: 'I have been to many different nail studios, but I find Lindsay\'s studio really beautiful and tidy. I would not want to have my nails done anywhere else. The nails look fantastic and she takes plenty of time for you, so you leave with a big smile. She thinks along with you too!',
    source: 'Google',
  },
  {
    id: 3,
    name: 'Joyce T.',
    rating: 5,
    date: 'dec. 2025',
    nl: 'Ik ga al een aantal maanden naar Lindsay voor mijn wimpers. Ik ben begonnen met one by one en op haar advies overgestapt naar hybride. Lindsay denkt mee in wat bij jou past als persoon, en werkt heel netjes en zorgvuldig.',
    en: 'I have been going to Lindsay for my lashes for a few months now. I started with one by one and switched to hybrid on her advice. Lindsay thinks along about what suits you as a person, and works very neatly and carefully.',
    source: 'Google',
  },
  {
    id: 4,
    name: 'Lex van Loon',
    rating: 5,
    date: 'dec. 2025',
    nl: 'Super gezellige salon, mooie kwaliteit, werkt zorgvuldig en altijd gezellig! Heel blij altijd met het resultaat!',
    en: 'Really lovely salon, beautiful quality, works carefully and always so welcoming! Always very happy with the result!',
    source: 'Google',
  },
  {
    id: 5,
    name: 'Barbara van Brakel',
    rating: 5,
    date: 'dec. 2025',
    nl: 'Ik ben erg blij met het advies en de manier waarop Lindsay werkt. Fijne en gezellige salon, waar de klant centraal staat!',
    en: 'I am very happy with the advice and the way Lindsay works. A pleasant, welcoming salon where the client comes first!',
    source: 'Google',
  },
  {
    id: 6,
    name: 'Mirjam de Roos',
    rating: 5,
    date: 'dec. 2025',
    nl: 'Weet waar ze mee bezig is, vakkundig advies. Mooie en ruime salon waarin ze verschillende behandelingen aanbiedt.',
    en: 'She knows what she is doing, with expert advice. A beautiful, spacious salon offering several treatments.',
    source: 'Google',
  },
  {
    id: 7,
    name: 'Melissa van Goor',
    rating: 5,
    date: 'dec. 2025',
    nl: 'De allermooiste nagels.',
    en: 'The most beautiful nails.',
    source: 'Google',
  },
];
