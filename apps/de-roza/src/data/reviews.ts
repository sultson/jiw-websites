export type Review = {
  id: number;
  name: string;
  rating: number;
  nl: string;
  en: string;
  source: 'Google';
};

export const reviews: Review[] = [
  {
    id: 1,
    name: 'Jolanda B.',
    rating: 5,
    nl: 'Ik ben altijd heel erg blij met mijn gemanicuurde en gelgelakte nagels van De Roza Nagelstudio. Rozalia is heel professioneel en daarnaast ook heel gastvrij en vriendelijk. Het ontwerp en de kleur zijn altijd prachtig. Ze heeft passie voor haar vak, is secuur en precies. Zeer aan te bevelen.',
    en: "I'm always so happy with my manicured and gel-polished nails from De Roza Nagelstudio. Rozalia is very professional and also warm and welcoming. The design and colour are always beautiful. She has passion for her craft, is precise and careful. Highly recommended.",
    source: 'Google',
  },
  {
    id: 2,
    name: 'Trientje D.',
    rating: 5,
    nl: 'Vandaag voor het eerst bij De Roza geweest. Een hele aardige en relaxte mevrouw met passie voor haar vak. Ze geeft heel goed advies. Heel tevreden met mijn mooie nagels. Ik ga zeker weer naar haar toe.',
    en: 'My first visit to De Roza today. A very kind and relaxed woman with passion for her craft. She gives really good advice. Very happy with my beautiful nails. I will definitely be back.',
    source: 'Google',
  },
  {
    id: 3,
    name: 'Bo-Lynn S.',
    rating: 5,
    nl: 'Zeer kundig, erg vriendelijk en geeft goed en eerlijk advies over je nagels en wat wel en niet mogelijk is. Ik kom graag terug!',
    en: 'Very skilled, really friendly and gives good and honest advice about your nails and what is and is not possible. I will gladly be back.',
    source: 'Google',
  },
  {
    id: 4,
    name: 'Hans S.',
    rating: 5,
    nl: 'Gastvrij, vriendelijk en professioneel. Erg fijne behandeling, met vele extra\'s. Meedenkend en geeft advies waar nodig is.',
    en: 'Welcoming, friendly and professional. A really nice treatment, with lots of little extras. She thinks along and gives advice where needed.',
    source: 'Google',
  },
  {
    id: 5,
    name: 'Martje K.',
    rating: 5,
    nl: 'Wat een heerlijke behandeling. Met mooie nagels voorzien van twee kleine kunstwerkjes de deur uitgegaan. Helemaal blij. Bij De Roza word je professioneel geholpen in een fijne ambiance. Tot de volgende keer.',
    en: 'What a lovely treatment. I left with beautiful nails and two tiny artworks on them. Completely happy. At De Roza you get professional care in a really nice atmosphere. Until next time.',
    source: 'Google',
  },
  {
    id: 6,
    name: 'Natascha S.',
    rating: 5,
    nl: 'Een lieve gastvrije dame, met passie voor haar vak. Neemt de tijd en werkt precies. Hele fijne ervaring, nogmaals bedankt.',
    en: 'A lovely, welcoming woman with passion for her craft. Takes the time and works precisely. A really nice experience, thank you again.',
    source: 'Google',
  },
  {
    id: 7,
    name: 'Demi',
    rating: 5,
    nl: 'Vandaag voor het eerst bij Rozalia geweest. Ze nam de tijd om de acryl, die moeilijk te verwijderen was, voorzichtig weg te halen. Daarna heeft ze mijn nagels prachtig gedaan. Ze heeft echt oog voor details en dat heeft tot een prachtig resultaat geleid. Ik kom zeker terug.',
    en: 'My first visit to Rozalia today. She took her time to gently remove the acrylic, which was hard to take off. After that she did my nails beautifully. She really has an eye for detail and that led to a wonderful result. I will definitely come back.',
    source: 'Google',
  },
  {
    id: 8,
    name: 'Henny H.',
    rating: 5,
    nl: 'Het is altijd een feestje om naar Rozalia te gaan. Onder het genot van een kopje koffie en de tv krijg je altijd weer prachtige nagels.',
    en: "It's always a treat to go to Rozalia. With a cup of coffee and the tv on you always come away with beautiful nails.",
    source: 'Google',
  },
];
