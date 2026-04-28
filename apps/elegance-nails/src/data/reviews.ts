export type Review = {
  id: number;
  name: string;
  rating: number;
  date: string;
  nl: string;
  en: string;
  source: 'Google';
};

export const reviews: Review[] = [
  {
    id: 1,
    name: 'Maxime de Wit',
    rating: 5,
    date: '2026-03-01',
    nl: 'Ik kom inmiddels al langere tijd bij Kelly voor BIAB-nagels en ik kan haar echt aan iedereen aanraden. Ze is ontzettend goed in wat ze doet. Ze luistert goed naar je wensen en komt zelf ook met leuke ideeën. Ze stelt je op je gemak en zorgt altijd voor een fijne, ontspannen sfeer.',
    en: 'I’ve been going to Kelly for BIAB nails for a while now and I can recommend her to anyone. She’s really good at what she does. She listens to what you want and brings nice ideas of her own. She puts you at ease and creates a calm, relaxed atmosphere.',
    source: 'Google',
  },
  {
    id: 2,
    name: 'Jo-Jo Willekes',
    rating: 5,
    date: '2026-04-18',
    nl: 'Ik ben super blij met mijn BIAB nagels! Kelly neemt echt de tijd voor je en werkt heel precies. Mijn nagels zien er niet alleen mooi uit, maar voelen ook sterk en natuurlijk aan. Alles wordt hygiënisch en professioneel gedaan.',
    en: "I'm super happy with my BIAB nails! Kelly really takes her time and works very precisely. My nails not only look beautiful, they also feel strong and natural. Everything is done hygienically and professionally.",
    source: 'Google',
  },
  {
    id: 3,
    name: 'Gaya Gritter',
    rating: 5,
    date: '2026-04-21',
    nl: 'Sinds een paar maanden kom ik bij Kelly voor BIAB op mijn nagels. Na veel teleurstellingen bij andere salons, ben ik eindelijk super tevreden. Enorm lieve meid, die haar werk echt heel goed en secuur doet.',
    en: 'For a few months now I’ve been going to Kelly for BIAB on my nails. After many disappointments at other salons, I’m finally really happy. Such a sweet woman who does her work very well and precisely.',
    source: 'Google',
  },
  {
    id: 4,
    name: 'Janneke van Dijk-Wolswinkel',
    rating: 5,
    date: '2025-12-04',
    nl: 'Kelly reageerde snel op mijn appje en een afspraak was snel gemaakt. Blij met haar professionele advies. Gekozen voor BIAB-nagels afgelakt met gellak in een mooie rode kleur. Goede prijs-kwaliteitverhouding. Mooie en nette salon. Ik raad Elégance Nails zeker aan!',
    en: 'Kelly replied quickly to my message and the appointment was made fast. Happy with her professional advice. Chose BIAB nails finished with gel polish in a lovely red. Good value for money. A beautiful, tidy studio. I really recommend Elégance Nails!',
    source: 'Google',
  },
  {
    id: 5,
    name: 'Tania',
    rating: 5,
    date: '2025-11-29',
    nl: 'Vandaag langs geweest voor mijn nagels en tenen. Kelly was uiterst deskundig, luisterde goed naar mijn wensen en gaf goed advies. Het resultaat was prachtig, echt zó mooi. Naast de persoonlijke aandacht is de salon ook nog eens modern ingericht en hygiënisch.',
    en: 'Visited today for my nails and toes. Kelly was very skilled, listened well to my wishes and gave good advice. The result was beautiful, really lovely. On top of the personal attention, the salon is also modern and hygienic.',
    source: 'Google',
  },
  {
    id: 6,
    name: 'Cindy Su',
    rating: 5,
    date: '2025-12-01',
    nl: 'Kelly is een topper! Ze werkt super precies, luistert echt naar wat je wilt en denkt goed met je mee. Verder is de salon echt prachtig, schoon en gezellig. Ik voelde mij meteen op mijn gemak.',
    en: 'Kelly is the best! She works really precisely, truly listens to what you want and thinks along with you. The salon is also beautiful, clean and welcoming. I felt at ease right away.',
    source: 'Google',
  },
];
