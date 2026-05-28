export type Review = {
  id: number;
  name: string;
  rating: number;
  nl: string;
  en: string;
  source: 'Google';
  service?: string;
  publishedAt: string;
};

/**
 * Verbatim quotes from real Google Maps reviews of ZK Beauty (5.0 / 7).
 * EN versions are translations of the same review.
 */
export const reviews: Review[] = [
  {
    id: 1,
    name: 'Natasja',
    rating: 5,
    nl: 'Wat een verschil! Mijn wimpers hebben nu een prachtige krul en zien er veel voller uit. Geen wimperkruller of mascara meer nodig. De behandeling was comfortabel en hygiënisch uitgevoerd. Heel tevreden met het eindresultaat!',
    en: 'What a difference! My lashes now have a beautiful curl and look much fuller. No more lash curler or mascara needed. The treatment felt comfortable and hygienic. Very happy with the end result.',
    source: 'Google',
    service: 'Wimperlift',
    publishedAt: '2026-02-11',
  },
  {
    id: 2,
    name: 'Rafael Van Merlevoort',
    rating: 5,
    nl: 'Onlangs mijn tanden laten bleken bij deze salon, met goed resultaat. Zoë werkt professioneel, ze neemt de tijd om alles goed uit te leggen voor ze begint. Het resultaat is erg goed, ik zou deze salon zeker aanraden.',
    en: 'Recently had my teeth whitened at this salon, with a great result. Zoë works professionally, takes time to explain everything before she starts. The result is excellent, I would definitely recommend this salon.',
    source: 'Google',
    service: 'Tanden bleken',
    publishedAt: '2025-09-25',
  },
  {
    id: 3,
    name: 'fb visser',
    rating: 5,
    nl: 'Fantastisch! Mijn wenkbrauwen zijn prachtig!',
    en: 'Fantastic! My brows look beautiful!',
    source: 'Google',
    service: 'Wenkbrauw shaping',
    publishedAt: '2026-03-30',
  },
  {
    id: 4,
    name: "Booty Nina",
    rating: 5,
    nl: 'Zoë heeft mijn haar gekleurd en wenkbrauwen weer in model gebracht. Luistert goed naar wat je wenst, en het eindresultaat was prachtig.',
    en: 'Zoë coloured my hair and shaped my brows back into form. She really listens to what you want, and the end result was beautiful.',
    source: 'Google',
    service: 'Haarstyling, Wenkbrauw shaping',
    publishedAt: '2025-09-30',
  },
  {
    id: 5,
    name: 'Cha\'ré Gorter',
    rating: 5,
    nl: 'Top salon! Ik heb hier mijn tanden laten bleken en ben er heel tevreden over. Ze neemt goed de tijd voor je en weet wat ze doet.',
    en: 'Top salon! Had my teeth whitened here and I am really happy with it. She takes proper time for you and clearly knows what she is doing.',
    source: 'Google',
    service: 'Tanden bleken',
    publishedAt: '2025-09-24',
  },
  {
    id: 6,
    name: 'Lisa Pruim',
    rating: 5,
    nl: 'Goed geholpen in een super mooie salon.',
    en: 'Looked after really well, in a beautiful salon.',
    source: 'Google',
    service: 'Haarstyling, Wimperlift',
    publishedAt: '2025-09-27',
  },
  {
    id: 7,
    name: 'Lynn Reining',
    rating: 5,
    nl: 'Super mooie salon en een leuke meid. Wat ik vroeg heeft ze precies gedaan zoals ik wilde. Ik ga zeker terug!',
    en: 'A really beautiful salon and a lovely girl. She did exactly what I asked for. I will definitely be back.',
    source: 'Google',
    publishedAt: '2025-09-24',
  },
];
