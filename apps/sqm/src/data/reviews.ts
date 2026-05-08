/**
 * Reviews from werkspot, anonymised: first name (or initial) + city only.
 * Owner's name has been replaced with brand-voice references throughout.
 */
export type ReviewItem = {
  name: string;
  city: string;
  date: string;
  workNl: string;
  workEn: string;
  quoteNl: string;
  quoteEn: string;
  rating: number;
};

export const reviews: ReviewItem[] = [
  {
    name: 'T.',
    city: 'Rhoon',
    date: 'mrt 2026',
    workNl: 'Buitenschilderwerk',
    workEn: 'Exterior painting',
    quoteNl: 'Het eindresultaat is heel goed. Ook tips meegekregen. Prima afterservice. Zeer gewaardeerd.',
    quoteEn: 'End result really good. Got useful tips too. Great after-service. Very much appreciated.',
    rating: 5,
  },
  {
    name: 'Kevin',
    city: 'Poortugaal',
    date: 'feb 2026',
    workNl: 'Dakrenovatie · plat dak',
    workEn: 'Roof renovation · flat roof',
    quoteNl: 'Direct vlot contact. Het team weet waar het over gaat, werkt netjes en laat alles netjes zien. Daarnaast een goede prijs.',
    quoteEn: 'Got back to me right away. They know their stuff, work tidily and walk you through everything. Good price, too.',
    rating: 5,
  },
  {
    name: 'Hans',
    city: 'Oud Gastel',
    date: 'dec 2025',
    workNl: 'Dakreparatie · 50 m²',
    workEn: 'Roof repair · 50 m²',
    quoteNl: 'Alles keurig volgens afspraak uitgevoerd met duidelijke communicatie.',
    quoteEn: 'Everything done exactly as agreed, with clear communication.',
    rating: 5,
  },
  {
    name: 'Tom',
    city: 'Roosendaal',
    date: 'dec 2025',
    workNl: 'Schilderwerk · 7 deuren',
    workEn: 'Painting · 7 doors',
    quoteNl: 'Punctueel, snel en ook nog naderhand een kleine sessie om wat dingen bij te werken. Denkt mee en adviseert. Aanrader!',
    quoteEn: 'Punctual, fast, and even came back afterwards to touch up a few details. Thinks along and advises. Recommended.',
    rating: 5,
  },
  {
    name: 'Marjon',
    city: 'Oud-Beijerland',
    date: 'aug 2025',
    workNl: 'Schilderwerk kozijnen',
    workEn: 'Frame painting',
    quoteNl: 'Kwam op afgesproken tijdstip. Goede prijs. Netjes werk afgeleverd!',
    quoteEn: 'Arrived on time. Good price. Tidy work delivered.',
    rating: 5,
  },
  {
    name: 'Familie',
    city: 'Dinteloord',
    date: 'apr 2025',
    workNl: 'Dakgoten vervangen',
    workEn: 'Gutter replacement',
    quoteNl: 'Prettige en klantgerichte benadering. Tijdens de opname duidelijke uitleg in begrijpelijke taal voor leken. Attent op aanvullende dakproblemen die we zelf niet zagen.',
    quoteEn: 'Pleasant, customer-focused approach. During the survey, clear explanations in plain language. Spotted additional roof issues we had missed.',
    rating: 5,
  },
  {
    name: 'Matthijs',
    city: 'Brielle',
    date: 'mrt 2025',
    workNl: 'Kozijnen + dakkapellen',
    workEn: 'Frames + dormers',
    quoteNl: 'Heeft de kozijnen rondom het hele huis geschilderd, inclusief dakkapellen waar zonnepanelen lagen. Andere schilders haakten af, hier kreeg het wél voor elkaar. 5 sterren.',
    quoteEn: 'Painted the frames around the whole house, including the dormer where the solar panels are. Other painters bailed; this team made it happen. 5 stars.',
    rating: 5,
  },
  {
    name: 'Corstiaan',
    city: 'Barendrecht',
    date: 'jun 2025',
    workNl: 'Schilderwerk · 4 deuren / 9 kozijnen',
    workEn: 'Painting · 4 doors / 9 frames',
    quoteNl: 'Prettig en professioneel vanaf het eerste contact. Komt afspraken netjes na, denkt mee, communiceert duidelijk. Snel gestart en alles binnen de afgesproken tijd afgerond.',
    quoteEn: 'Pleasant and professional from the first contact. Sticks to appointments, thinks along, communicates clearly. Started quickly and finished within the agreed time.',
    rating: 5,
  },
  {
    name: 'Claudine',
    city: 'Heinenoord',
    date: 'aug 2025',
    workNl: 'Buitenschilderwerk',
    workEn: 'Exterior painting',
    quoteNl: 'Goed werk, werkt snel. Heeft bij ons de buitenboel geschilderd.',
    quoteEn: 'Good work, fast. Painted the whole exterior for us.',
    rating: 5,
  },
  {
    name: 'K.',
    city: 'Zwartewaal',
    date: 'feb 2025',
    workNl: 'Dakwerk · 12 m²',
    workEn: 'Roof work · 12 m²',
    quoteNl: 'Goed meegedacht, fijne indruk. Snel ingepland en uitgevoerd, veel toegelicht en deskundig. Aardige en kundige vakman.',
    quoteEn: 'Thought along well, gave a great impression. Scheduled and delivered fast, lots of explanation, clearly knows the trade.',
    rating: 5,
  },
];
