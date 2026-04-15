export type Review = {
  id: number;
  name: string;
  rating: number;
  nl: string;
  en: string;
  source: string;
};

export const reviews: Review[] = [
  {
    id: 1,
    name: 'Linda Kloet',
    rating: 5,
    nl: 'Echt een verademing. Niet zitten wachten, nagels hygiënisch en prachtig gezet. Daarnaast is het gewoon een hele leuke vrouw.',
    en: 'A real breath of fresh air. No waiting, nails done hygienically and beautifully. On top of that she is just a really lovely woman.',
    source: 'Google',
  },
  {
    id: 2,
    name: 'Wout Aarninkhof',
    rating: 5,
    nl: 'Ik als voormalig nagelbijter (man). Lisa heeft mij geholpen met korte, mannelijke, tijdelijke hars nagels over mijn afbeten nagels. Niemand die het kon zien dat het nep was — nu bijt ik geen nagels meer.',
    en: "As a former nail-biter (and a man), Lisa helped me with short, masculine temporary resin nails over my bitten ones. Nobody could tell they weren't real — and I don't bite my nails anymore.",
    source: 'Google',
  },
  {
    id: 3,
    name: 'Marina Vd V',
    rating: 5,
    nl: 'Hele leuke styliste, zeer uitgebreide keuze uit nagellak kleurtjes en ze voldoet aan jouw wensen. En als verrassing een leuke korting op je eerste set.',
    en: 'Very lovely stylist, a huge choice of polish colours, and she delivers exactly what you want. Plus a nice discount on your first set as a surprise.',
    source: 'Google',
  },
  {
    id: 4,
    name: 'Elsira Vogels',
    rating: 5,
    nl: 'Mijn hele leven al een enorme nagelbijter. Lisa durfde het aan en ik ben meer dan tevreden. Ze is vriendelijk, neemt de tijd, is deskundig en werkt schoon.',
    en: 'I have been a heavy nail-biter all my life. Lisa took it on and I am more than satisfied. She is friendly, takes her time, knowledgeable and works clean.',
    source: 'Google',
  },
  {
    id: 5,
    name: 'Iris Schoones',
    rating: 5,
    nl: 'Ik kom nu een half jaar bij Lisa voor BIAB en ben er super blij mee. Het ziet er altijd mooi en strak uit. Prijs-kwaliteit is super en ik krijg vaak complimenten.',
    en: 'I have been coming to Lisa for BIAB for six months and I am thrilled. It always looks neat and sharp. Great value for money and I get a lot of compliments.',
    source: 'Google',
  },
  {
    id: 6,
    name: 'Sabrina van Eijsden',
    rating: 5,
    nl: 'Altijd weer blij met mijn nieuwe nagels. Het ziet er heel netjes uit. Lisa is altijd gastvrij en maakt een gezellig babbeltje.',
    en: 'Always happy with my new nails. Everything looks really neat. Lisa is always welcoming and has a nice chat with you.',
    source: 'Google',
  },
  {
    id: 7,
    name: 'Helma Bruel',
    rating: 5,
    nl: 'Lisa is de enige die ervoor zorgt dat er geen lucht onder mijn gelnagels komt, waardoor ze heel lang mooi blijven. Ze werkt snel en heel vaardig. Echt een aanrader!',
    en: 'Lisa is the only one who keeps air from getting under my gel nails, so they stay beautiful for a long time. She works fast and skilfully. Really recommended!',
    source: 'Google',
  },
  {
    id: 8,
    name: 'Martine Roodnat',
    rating: 5,
    nl: 'Altijd heel blij met mijn BIAB nagels. Ziet er netjes en verzorgd uit en blijft zeker 3 weken zitten. Geeft goed en eerlijk advies.',
    en: 'Always very happy with my BIAB nails. Neat and tidy, and they last at least three weeks. She gives good, honest advice.',
    source: 'Google',
  },
];
