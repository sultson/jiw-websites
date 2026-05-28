export type Review = {
  id: number;
  name: string;
  rating: number;
  nl: string;
  en: string;
  source: 'Google';
  date: string;
};

// Verbatim Google reviews (NL); EN translated for international visitors.
export const reviews: Review[] = [
  {
    id: 1,
    name: 'Angelique P.',
    rating: 5,
    date: '2026-02',
    nl: 'Wendy is een echte prof. Werkt hygiënisch en heel netjes. Daarnaast is ze een heel leuk mens. Altijd weer gezellig om mijn nagels te laten doen. Kortom zeer tevreden en een aanrader als je mooie verzorgde nagels wil.',
    en: 'Wendy is a real pro. She works hygienically and very neatly, and she is a lovely person to chat with. It is always a fun moment to get my nails done. Highly recommended if you want beautifully cared-for nails.',
    source: 'Google',
  },
  {
    id: 2,
    name: 'Corry K.',
    rating: 5,
    date: '2025-03',
    nl: 'Werkt heel secuur en netjes. Is echt een perfectionist. Werkt hygiënisch en er staat altijd bakje koffie klaar. Heerlijk babbeluurtje. Is voor mij echt ontspanning en het levert nog hele mooie nagels op ook. Heb nooit geen schade. Echt een top nagelstyliste.',
    en: "She works very precisely and neatly — a real perfectionist. Hygienic, and there is always a fresh coffee waiting. A nice little chat too. For me it is genuinely relaxing and the nails turn out beautiful. I have never had any damage. A top nail stylist.",
    source: 'Google',
  },
  {
    id: 3,
    name: 'Denise V.',
    rating: 5,
    date: '2025-03',
    nl: 'Wendy is zeer kundig in haar vak en haar perfectionisme zie je ook terug in haar werk, dit straalt professionaliteit en kwaliteit uit! Ik kreeg veel complimenten over mijn nagels. Ik kan haar bij iedereen aanbevelen en haar nieuwe werkplek is zeker een positieve doorstroming en straalt ook rust en neutraliteit uit!',
    en: 'Wendy is highly skilled at her craft and the perfectionism shines through in the work — really professional and high quality. I got many compliments on my nails. I can recommend her to anyone, and her new space feels calm and neutral.',
    source: 'Google',
  },
  {
    id: 4,
    name: 'Henri & Ingrid H.',
    rating: 5,
    date: '2025-02',
    nl: 'Mijn nagels zien er altijd top uit dankzij Wendy! Creatief en gezellig.',
    en: 'My nails always look great thanks to Wendy. Creative and good fun.',
    source: 'Google',
  },
  {
    id: 5,
    name: 'Naomi K.',
    rating: 5,
    date: '2023-09',
    nl: 'Altijd mooie nagels! Ze werkt precies, netjes en is gezellig.',
    en: 'Always lovely nails. Precise, neat work and nice company.',
    source: 'Google',
  },
  {
    id: 6,
    name: 'Elisa C.',
    rating: 5,
    date: '2023-09',
    nl: 'Super kwaliteit en service.',
    en: 'Top quality and service.',
    source: 'Google',
  },
];
