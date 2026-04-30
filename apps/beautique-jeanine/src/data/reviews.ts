export type Review = {
  id: number;
  name: string;
  rating: number;
  date: string;
  nl?: string;
  en?: string;
  source: string;
};

export const reviews: Review[] = [
  {
    id: 1,
    name: 'Siepy Van Den Berg',
    rating: 5,
    date: 'mrt. 2024',
    nl: 'Al jaren lang super tevreden! Goed advies en denkt mee naar oplossingen. Mijn huid is sindsdien een stuk rustiger.',
    en: 'Satisfied for many years! Good advice and thinks along about solutions. My skin has been much calmer since.',
    source: 'Google',
  },
  {
    id: 2,
    name: 'Wietske Dijkstra',
    rating: 5,
    date: 'mrt. 2024',
    source: 'Google',
  },
  {
    id: 3,
    name: 'Ypiedijkstra',
    rating: 5,
    date: 'mrt. 2024',
    source: 'Google',
  },
  {
    id: 4,
    name: 'Jorrit Alta',
    rating: 5,
    date: 'mrt. 2024',
    source: 'Google',
  },
  {
    id: 5,
    name: 'Marieke de Boer',
    rating: 5,
    date: 'mrt. 2024',
    nl: 'Ik kom al jaren bij Jeanine voor verschillende behandelingen. Ze is altijd ontzettend vriendelijk, doet haar werk heel goed en ga altijd heel tevreden de deur uit. Ik zou haar absoluut aanraden bij iedereen!',
    en: 'I have been coming to Jeanine for years for different treatments. She is always very friendly, does her work very well and I always leave very satisfied. I would absolutely recommend her to everyone!',
    source: 'Google',
  },
  {
    id: 6,
    name: 'Rikst Veenstra',
    rating: 5,
    date: 'mrt. 2024',
    source: 'Google',
  },
  {
    id: 7,
    name: 'Doeke Holtrop',
    rating: 5,
    date: 'feb. 2022',
    source: 'Google',
  },
  {
    id: 8,
    name: 'Anneke Schreur',
    rating: 5,
    date: 'okt. 2021',
    source: 'Google',
  },
  {
    id: 9,
    name: 'Nienke Koopmans',
    rating: 5,
    date: 'jun. 2021',
    source: 'Google',
  },
  {
    id: 10,
    name: 'Sandra Lenes',
    rating: 5,
    date: 'mei 2021',
    nl: 'Kom er al heel lang dat zegt genoeg. Goede service en altijd even vriendelijk. Een aanrader!!',
    en: 'I have been coming here for a very long time, that says enough. Good service and always friendly. Recommended!',
    source: 'Google',
  },
  {
    id: 11,
    name: 'Jantine',
    rating: 5,
    date: 'dec. 2020',
    nl: 'Hele goede service, erg klantvriendelijk en veel mogelijkheden. En dat ook nog eens voor een heel leuk prijsje. Aanrader! ✨',
    en: 'Very good service, very customer-friendly and many options. And all that for a very nice price. Recommended!',
    source: 'Google',
  },
  {
    id: 12,
    name: 'Esther Mintjes',
    rating: 5,
    date: 'sep. 2020',
    nl: 'Heerlijke behandeling door Jeanine en weer prachtige wenkbrauwen!',
    en: 'Lovely treatment by Jeanine and beautiful brows again!',
    source: 'Google',
  },
];
