export type Review = {
  id: number;
  name: string;
  rating: number;
  nl: string;
  en: string;
  pl: string;
  source: 'Google' | 'Treatwell';
};

export const reviews: Review[] = [
  {
    id: 1,
    name: 'Alexandra Anamaria',
    rating: 5,
    nl: 'Ana heeft mijn nagels en wimpers gedaan, en ik kan vol vertrouwen zeggen dat ze absoluut geweldig is. De kwaliteit spreekt voor zich — je ziet de passie, precisie en toewijding in elk detail.',
    en: 'Ana did my nails and lashes, and I can confidently say she is absolutely amazing. The quality speaks for itself — you can see the passion, precision and dedication in every detail.',
    pl: 'Ana zrobiła mi paznokcie i rzęsy — mogę z całą pewnością powiedzieć, że jest absolutnie niesamowita. Jakość mówi sama za siebie, widać pasję, precyzję i zaangażowanie w każdym detalu.',
    source: 'Google',
  },
  {
    id: 2,
    name: 'AG Handmade',
    rating: 5,
    nl: 'Ik verlaat Ania\'s salon altijd met een glimlach! Ze heeft echt plezier in haar werk en het resultaat spreekt voor zich. Elke manicure is nauwkeurig, esthetisch aangenaam en houdt lang.',
    en: 'I always leave Ania\'s salon with a smile! She genuinely enjoys her work and the results speak for themselves. Every manicure is precise, aesthetically pleasing and long-lasting.',
    pl: 'Zawsze wychodzę z salonu Ani z uśmiechem! Naprawdę lubi swoją pracę, a efekty mówią same za siebie. Każdy manicure jest dokładny, estetyczny i długotrwały.',
    source: 'Google',
  },
  {
    id: 3,
    name: 'M. Ignasiak',
    rating: 5,
    nl: 'Ik ga hier altijd ontzettend blij weg. Volledige professionaliteit, een geweldige sfeer en prachtig verzorgde nagels. Ik raad het van harte aan.',
    en: 'I always leave here incredibly happy. Complete professionalism, a wonderful atmosphere and beautifully groomed nails. I highly recommend it.',
    pl: 'Zawsze wychodzę stąd niesamowicie zadowolona. Pełen profesjonalizm, świetna atmosfera i pięknie zadbane paznokcie. Serdecznie polecam.',
    source: 'Google',
  },
  {
    id: 4,
    name: 'Julia Malewicz',
    rating: 5,
    nl: 'Ik kan deze salon met een gerust hart aanbevelen — ik ga er elke keer weer tevreden weg. Ania en Marta doen hun werk met passie.',
    en: 'I can wholeheartedly recommend this salon — I leave satisfied every single time. Ania and Marta do their work with real passion.',
    pl: 'Mogę z czystym sumieniem polecić ten salon — za każdym razem wychodzę zadowolona. Ania i Marta wykonują swoją pracę z pasją.',
    source: 'Google',
  },
  {
    id: 5,
    name: 'Joanna Glejndek',
    rating: 5,
    nl: 'Ania is een echte professional die haar vak verstaat. De manicure is altijd perfect en mijn nagels blijven lang prachtig. De sfeer tijdens mijn bezoek is erg prettig en ontspannend.',
    en: 'Ania is a true professional who knows her craft. The manicure is always perfect and my nails stay beautiful for a long time. The atmosphere during my visit is very pleasant and relaxing.',
    pl: 'Ania to prawdziwa profesjonalistka, która zna swój fach. Manicure jest zawsze perfekcyjny, a paznokcie długo wyglądają pięknie. Atmosfera podczas wizyty jest bardzo przyjemna i relaksująca.',
    source: 'Google',
  },
  {
    id: 6,
    name: 'Sara Szepietowska',
    rating: 5,
    nl: 'Ik voelde me heel blij en ontspannen toen ik wegging! Het was geweldig om Pools te horen in Nederland!',
    en: 'I felt so happy and relaxed when I left! It was wonderful to hear Polish spoken here in the Netherlands!',
    pl: 'Wyszłam bardzo szczęśliwa i zrelaksowana! Wspaniale było usłyszeć język polski w Holandii!',
    source: 'Google',
  },
  {
    id: 7,
    name: 'Ik Schmink',
    rating: 5,
    nl: 'Super blij met de pedicure behandeling bij AnArt Studio! Ik kom er zeker terug — ook voor de andere behandelingen.',
    en: 'Super happy with the pedicure treatment at AnArt Studio! I will definitely be back — for the other treatments too.',
    pl: 'Bardzo zadowolona z zabiegu pedicure w AnArt Studio! Na pewno wrócę — również na inne zabiegi.',
    source: 'Google',
  },
  {
    id: 8,
    name: 'Marylva Lapar',
    rating: 5,
    nl: 'Hele aardige dame, heel professioneel. Super goed gedaan. Mijn nagels zien er prachtig uit. Een aanrader — ik kom terug.',
    en: 'Very kind lady, very professional. Superb work. My nails look beautiful. Highly recommended — I will be back.',
    pl: 'Bardzo miła pani, bardzo profesjonalna. Świetna robota. Moje paznokcie wyglądają przepięknie. Polecam — wracam!',
    source: 'Google',
  },
];
