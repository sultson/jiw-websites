// All MHA Installaties site copy + data. Dutch only.
// Tone: short, simple, no em dashes, no fillers.

export const business = {
  name: 'MHA Installaties',
  tagline: 'Vakmanschap & kwaliteit',
  kicker: 'Loodgieter & installateur in Roermond',
  owner: 'Youssef',
  address: {
    street: 'Gershwinstraat 27',
    postalCode: '6044 VC',
    city: 'Roermond',
    province: 'Limburg',
  },
  phone: {
    display: '06 22 28 59 03',
    href: 'tel:+31622285903',
  },
  whatsapp: {
    display: '06 22 28 59 03',
    href: 'tel:+31622285903',
    link: 'https://wa.me/31622285903',
  },
  email: {
    display: 'mhainstallaties@gmail.com',
    href: 'mailto:MHAinstallaties@gmail.com',
  },
  kvk: '42057808',
  maps: 'https://www.google.com/maps/place/Mhainstallaties+Limburg/@51.1822171,6.0094742,853m/data=!3m2!1e3!4b1!4m6!3m5!1s0x4bd8d34169981dc9:0xf2f7e867d3d5c4ee!8m2!3d51.1822172!4d6.0143451',
  socials: {
    instagram: 'https://www.instagram.com/mhainstallaties2001/',
    facebook: 'https://www.facebook.com/profile.php?id=61573560466579',
    tiktok: 'https://www.tiktok.com/@installatietechni8',
    youtube: 'https://www.youtube.com/@installatietechni8',
  },
  hours: [{ day: 'Maandag t/m zondag', time: '24/7 bereikbaar' }],
  serviceArea: [
    'Roermond',
    'Swalmen',
    'Herten',
    'Roerdalen',
    'Maasbracht',
    'Echt',
    'Heel',
    'Weert',
    'Leudal',
    'Posterholt',
    'Sittard-Geleen',
    'Midden-Limburg',
  ],
};

// Hero
export const hero = {
  eyebrow: business.kicker,
  titleStart: 'Verwarming, water en comfort, ',
  titleEm: 'vakkundig geregeld',
  titleEnd: '.',
  sub: 'MHA Installaties verzorgt cv-ketels, vloerverwarming, badkamers, ventilatie en storingen in en rond Roermond. Snel ter plaatse, eerlijk advies en netjes opgeleverd.',
  ctaPrimary: 'Gratis prijsindicatie',
  ctaSecondary: 'Bel direct',
  image: '/hero',
  imageAlt: 'Installateur van MHA Installaties sluit een cv-ketel aan',
};

// Star rating shown across the site (real Google data)
export const reviewsMeta = {
  score: '5,0',
  scoreNumeric: 5,
  count: 16,
  source: 'Google',
};

// USP chips under the hero
export const heroChips = ['Vaak dezelfde dag', 'Eerlijke prijs vooraf', '10+ jaar ervaring'];

// USP cards
type Usp = {
  title: string;
  body: string;
  /** Optional badge image (base path, no extension) shown instead of the Lucide icon. */
  badge?: { src: string; alt: string };
};

export const usps: Usp[] = [
  {
    title: 'Snel ter plaatse',
    body: 'Bij storingen en lekkages reageren we snel, vaak nog dezelfde dag.',
  },
  {
    title: 'Eén aanspreekpunt',
    body: 'Van cv-ketel tot badkamer. U regelt alles met Youssef, persoonlijk.',
  },
  {
    title: 'Koolmonoxide-vrij',
    body: 'Werkzaam volgens het CO-vrij keurmerk van de Rijksoverheid. Een veilige installatie, gecontroleerd op koolmonoxide.',
    badge: {
      src: '/keurmerk-co-vrij',
      alt: 'CO-vrij keurmerk Rijksoverheid: koolmonoxidevrije en veilige installatie',
    },
  },
];

// Services
export const services = [
  {
    key: 'cv-ketel',
    title: 'CV-ketel onderhoud & reparatie',
    body: 'Onderhoud, storingen verhelpen en vervanging van uw cv-ketel. Veilig en zuinig stoken, het hele jaar door.',
  },
  {
    key: 'verwarming',
    title: 'Verwarming & vloerverwarming',
    body: 'Aanleg, vervanging en optimalisatie van radiatoren en vloerverwarming voor gelijkmatige warmte in huis.',
  },
  {
    key: 'badkamer',
    title: 'Badkamer, toilet & sanitair',
    body: 'Van een nieuwe kraan tot een complete badkamer. Strak, waterdicht en netjes afgewerkt.',
  },
  {
    key: 'lekkage',
    title: 'Lekkages & storingen',
    body: 'Snel ter plaatse bij lekkages, verstoppingen en acute storingen. Probleem opgespoord en opgelost.',
  },
  {
    key: 'ventilatie',
    title: 'Ventilatie & luchtkwaliteit',
    body: 'Reiniging en onderhoud van ventilatieboxen, kanalen en roosters voor gezonde lucht in huis.',
  },
  {
    key: 'leidingwerk',
    title: 'Leidingwerk & installaties',
    body: 'Nieuwe leidingen, gaswerk en aanpassingen. Complete installaties, vakkundig aangelegd en weggewerkt.',
  },
];

// Options for the prijsindicatie form select
export const serviceFormOptions = [
  { value: 'cv-ketel', label: 'CV-ketel onderhoud of reparatie' },
  { value: 'verwarming', label: 'Verwarming of vloerverwarming' },
  { value: 'badkamer', label: 'Badkamer, toilet of sanitair' },
  { value: 'lekkage', label: 'Lekkage of storing' },
  { value: 'ventilatie', label: 'Ventilatie of luchtkwaliteit' },
  { value: 'leidingwerk', label: 'Leidingwerk of installatie' },
  { value: 'other', label: 'Iets anders' },
];

// Werkwijze (how we work)
export const werkwijze = [
  {
    step: '01',
    title: 'Contact & uitleg',
    body: 'U belt, appt of stuurt het formulier. We bespreken rustig wat er speelt.',
  },
  {
    step: '02',
    title: 'Bekijken & prijs',
    body: 'We bekijken de situatie, denken mee en geven een duidelijke prijs vooraf.',
  },
  {
    step: '03',
    title: 'Vakkundig uitvoeren',
    body: 'We voeren het werk netjes en secuur uit en testen alles na afloop.',
  },
  {
    step: '04',
    title: 'Uitleg & nazorg',
    body: 'We leggen uit wat er is gedaan. Vragen achteraf? We blijven bereikbaar.',
  },
];

// About
export const about = {
  paragraphs: [
    'Met vakmanschap en oog voor detail zorgen we dat uw woning veilig, warm en comfortabel blijft.',
    'Of het nu gaat om onderhoud aan de cv-ketel, een lekkage, vloerverwarming of een complete badkamer: u heeft één aanspreekpunt dat het werk van begin tot eind netjes regelt.',
    'U krijgt heldere communicatie, een eerlijke prijs en werk dat klopt. Veiligheid staat voorop en uw woning leveren we schoon weer op.',
  ],
  image: '/work/installateur',
  imageAlt: 'Installateur van MHA Installaties aan het werk',
};

// Before/after projects — drag-to-compare sliders
export const beforeAfters = [
  {
    title: 'Keukenleidingen verplaatst',
    body: 'Oude leidingen in de keuken gedemonteerd en strak opnieuw aangelegd. Klaar voor een nieuwe inrichting.',
    before: { src: '/work/keuken-voor', alt: 'Keukenleidingen voor de werkzaamheden' },
    after: { src: '/work/keuken-na', alt: 'Keukenleidingen netjes opnieuw aangelegd' },
    beforeLabel: 'Na',
    afterLabel: 'Voor',
    // Frame classes — landscape photos, so a wide frame fits without cropping.
    frame: 'aspect-[4/3] sm:aspect-[16/10]',
  },
  {
    title: 'CV-ketel vervangen',
    body: 'Oude opstelling vervangen door een nieuwe cv-ketel. Strak gemonteerd, leidingwerk netjes weggewerkt en veilig opgeleverd.',
    before: { src: '/work/boiler-na', alt: 'Nieuwe cv-ketel netjes gemonteerd' },
    after: { src: '/work/boiler-voor', alt: 'Cv-ketelopstelling voor de werkzaamheden' },
    beforeLabel: 'Na',
    afterLabel: 'Voor',
    // Portrait photos (3:4) — match the frame to them and cap the width so the
    // full boiler stays visible without cropping top or bottom.
    frame: 'aspect-[3/4] mx-auto max-w-[22rem] sm:max-w-[26rem]',
  },
];

// Work gallery
export const gallery = [
  { src: '/work/verwarming', alt: 'Aangelegde verwarmingsinstallatie met isolatie', caption: 'Verwarmingsinstallatie' },
  { src: '/work/leidingwerk', alt: 'Strak weggewerkt leidingwerk', caption: 'Leidingwerk' },
  { src: '/work/badkamer', alt: 'Badkamer en toilet werkzaamheden', caption: 'Badkamer & sanitair' },
  { src: '/work/lekkage', alt: 'Lekkage aan een kraan verholpen', caption: 'Lekkage verholpen' },
  { src: '/work/montagewerk', alt: 'Montage en installatiewerk', caption: 'Montagewerk' },
  { src: '/work/bedrijfsbus', alt: 'De bedrijfsbus van MHA Installaties', caption: 'Onderweg in Limburg' },
];

// Real Google reviews (5,0 over 16 reviews)
export const reviews = [
  {
    name: 'Kon. HBV De Roerboog',
    date: '25 apr. 2026',
    text: 'Vandaag uitermate goed geholpen door Youssef bij het reinigen van de verwarmingsketel, het verplaatsen van een thermostaat en het aanbrengen van nieuwe drukknoppen. Een echte vakman en belangrijk, zeer correct.',
  },
  {
    name: 'Mohamed Ait Boussaid',
    date: '4 apr. 2026',
    text: 'Youssef heeft bij ons verschillende klussen uitgevoerd, van het reinigen van het ventilatiesysteem tot het onderhouden van de cv-installatie. Hij constateerde problemen die een vorige installateur had veroorzaakt en verhielp deze. Veiligheid staat bij Youssef centraal. Klantgericht en prettig in de omgang.',
  },
  {
    name: 'caroline berkers',
    date: '28 mrt. 2026',
    text: 'Youssef werkt heel netjes en secuur. Hij heeft al meerdere klussen voor mij gedaan: oude verwarmingen afkoppelen, nieuwe verwarming plaatsen, dakgoten leegmaken en een buitenkraan gemaakt. Ik ben heel tevreden.',
  },
  {
    name: 'Bart Munsters',
    date: '24 nov. 2025',
    text: 'Keurig werk geleverd door MHA. Vooraf goed geïnventariseerd wat er nodig was en rekening gehouden met onze wensen. Er wordt netjes gewerkt en alles wordt goed uitgelegd.',
  },
  {
    name: 'Chantal Haenen',
    date: '6 dec. 2025',
    text: 'Wij zijn uitstekend geholpen door MHA Installaties bij de storing aan onze cv-ketel. Youssef is zeer klantvriendelijk en vakbekwaam.',
  },
  {
    name: 'Ineke Voorintholt',
    date: '29 apr. 2026',
    text: 'Alles werd goed uitgelegd en ook mijn vragen werden beantwoord. Erg fijn dat er nu weer een werkende ketel hangt.',
  },
  {
    name: 'Jason Pieters',
    date: '31 mei 2025',
    text: 'Heeft mijn badkamer en gas heel mooi gemaakt. Geweldig werk en super aardig, zelfs toen ik op het laatste moment een wijziging wilde.',
  },
  {
    name: 'Ingrid Kuijpers',
    date: '9 aug. 2025',
    text: 'Youssef is een gedreven, bekwaam vakman. Het is heel fijn om te weten dat je altijd op hem kunt rekenen als er een storing is.',
  },
  {
    name: 'Sylvie R.',
    date: '14 mrt. 2026',
    text: 'Goed werk afgeleverd. Hebben bij ons de kanalen schoongemaakt. Fijne service en erg netjes. Wij zijn zeer tevreden.',
  },
  {
    name: 'M Seriese',
    date: '9 mei 2026',
    text: 'Wij zijn super goed geholpen. Goed werk, goede uitleg en heel aardig. Wij zijn blij met MHA Installaties.',
  },
  {
    name: 'Samet Vab',
    date: '26 mei 2025',
    text: 'Top service, erg klantvriendelijk en een echte vakman. Hij werkt professioneel en denkt goed met je mee. Absoluut aan te raden.',
  },
  {
    name: 'B.',
    date: '21 feb. 2026',
    text: 'Heel bekwaam en vakkundig werk geleverd bij het plaatsen van de nieuwe cv-ketel.',
  },
];

// Onze werkzaamheden — edge-to-edge auto-scrolling carousel.
// Mix of AI-generated work images (no people) and real TikTok video cards.
type WerkzaamItem =
  | { type: 'image'; src: string; label: string }
  | { type: 'video'; src: string; label: string; tiktokId: string };

export const werkzaamheden: {
  eyebrow: string;
  title: string;
  intro: string;
  tiktokFollowers: string;
  tiktokUrl: string;
  items: WerkzaamItem[];
} = {
  eyebrow: 'In beeld',
  title: 'Onze werkzaamheden.',
  intro:
    'Een doorlopende greep uit het installatie- en loodgieterswerk in en rond Roermond. Tik op een video om mee te kijken op TikTok.',
  tiktokFollowers: '10,1k',
  tiktokUrl: 'https://www.tiktok.com/@installatietechni8',
  items: [
    { type: 'image', src: '/werk/cv-ketel', label: 'CV-ketel plaatsen' },
    { type: 'video', src: '/werk/social/7597896644809559329', label: 'CV-ketel vervangen', tiktokId: '7597896644809559329' },
    { type: 'image', src: '/werk/vloerverwarming', label: 'Vloerverwarming aanleggen' },
    { type: 'video', src: '/werk/social/7466911724503895318', label: 'CV-ketel onderhoud', tiktokId: '7466911724503895318' },
    { type: 'image', src: '/werk/radiator', label: 'Radiatoren plaatsen' },
    { type: 'video', src: '/werk/social/7506578892879105312', label: 'Nieuwe cv-ketel', tiktokId: '7506578892879105312' },
    { type: 'image', src: '/werk/verdeler', label: 'Cv-verdeler installeren' },
    { type: 'image', src: '/werk/badkamer', label: 'Badkamer en sanitair' },
    { type: 'video', src: '/werk/social/7499208676780166422', label: 'CV-ketel geïnstalleerd', tiktokId: '7499208676780166422' },
    { type: 'image', src: '/werk/ventilatie', label: 'Ventilatie onderhouden' },
    { type: 'video', src: '/werk/social/7517776740278652182', label: 'Leidingwerk en gas', tiktokId: '7517776740278652182' },
    { type: 'image', src: '/werk/leidingwerk', label: 'Leidingwerk' },
    { type: 'video', src: '/werk/social/7609399771618413857', label: 'Afvoer en leidingen', tiktokId: '7609399771618413857' },
    { type: 'image', src: '/werk/gaswerk', label: 'Gas en aansluitingen' },
  ],
};

// Section titles
export const sectionTitles = {
  usps: { eyebrow: 'Waarom MHA', title: 'Installatiewerk waar u op kunt rekenen.' },
  services: { eyebrow: 'Diensten', title: 'Alles voor verwarming, water en comfort.' },
  about: { eyebrow: 'Over MHA Installaties', title: 'Een installateur die afspraken nakomt.' },
  werkwijze: { eyebrow: 'Werkwijze', title: 'Zo pakken we het aan.' },
  work: { eyebrow: 'Werk', title: 'Recent uitgevoerd werk.' },
  reviews: { eyebrow: 'Ervaringen', title: 'Wat klanten zeggen.' },
  contact: { eyebrow: 'Contact', title: 'Plan uw afspraak zonder gedoe.' },
  offerte: { eyebrow: 'Prijsindicatie', title: 'Vraag een gratis prijsindicatie aan.' },
};
