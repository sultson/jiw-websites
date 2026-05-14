// All JP Schilderwerken site copy + data. Dutch only.
// Tone: short, simple, no em dashes, no fillers.

export const business = {
  name: 'JP Schilderwerken',
  tagline: 'Schilder Houten',
  owner: 'Justin Pothuizen',
  founded: 'oktober 2024',
  yearsCombined: 6,
  address: {
    street: 'Molenaarserf 57',
    postalCode: '3991 KR',
    city: 'Houten',
    province: 'Utrecht',
  },
  phone: {
    display: '06 42038702',
    href: 'tel:+31642038702',
    whatsapp: 'https://wa.me/31642038702',
  },
  email: {
    display: 'info@jp-schilderwerken.nl',
    href: 'mailto:info@jp-schilderwerken.nl',
  },
  kvk: '95131418',
  branche: 'Schilderen en glaszetten',
  linkedin: 'https://www.linkedin.com/in/justin-pothuizen-49868a295/',
  googleMaps: 'https://www.google.com/maps/place/JP+Schilderwerken/@52.0275475,5.1706515,17z/data=!4m6!3m5!1s0x6a4ee0dd1ed8ddd5:0x6096ba3cea751bde!8m2!3d52.02754!4d5.1705267!16s%2Fg%2F11n3_95kbv',
  fatherCompany: {
    name: 'Pothuizen Schildersbedrijf',
    url: 'https://pothuizenschildersbedrijf.nl/',
  },
  hours: [
    { day: 'Maandag', time: '08:00 tot 17:00' },
    { day: 'Dinsdag', time: '08:00 tot 17:00' },
    { day: 'Woensdag', time: '08:00 tot 17:00' },
    { day: 'Donderdag', time: '08:00 tot 17:00' },
    { day: 'Vrijdag', time: '08:00 tot 17:00' },
    { day: 'Zaterdag', time: '09:00 tot 13:00' },
    { day: 'Zondag', time: 'Gesloten' },
  ],
  serviceArea: [
    'Houten',
    'Utrecht',
    'Nieuwegein',
    'IJsselstein',
    'Bunnik',
    'Zeist',
    'Bilthoven',
    'De Bilt',
    'Wijk bij Duurstede',
    'Culemborg',
    'Vianen',
  ],
  certificates: ['Schildersschool niveau 3', 'Gezel schilder'],
};

export const usps = [
  { title: 'Snel een eerlijke prijs', body: 'Binnen 1 dag een gratis prijsindicatie met duidelijk plan.' },
  { title: 'Vakwerk op niveau 3', body: 'Schildersschool afgerond en gezel schilder met oog voor detail.' },
  { title: 'Gratis kennismaking', body: 'Even langskomen om mee te kijken en het werk goed in te schatten.' },
  { title: 'Generaties ervaring', body: 'Vak geleerd van mijn vader. Samen brengen we ruim 30 jaar mee.' },
];

export const services = [
  {
    key: 'interieur',
    title: 'Interieur schilderen',
    body: 'Wanden, plafonds, deuren en kozijnen binnen. Strak afgewerkt en zonder rommel.',
  },
  {
    key: 'exterieur',
    title: 'Exterieur schilderen',
    body: 'Gevels, kozijnen en buitendeuren. Bestand tegen weer en wind.',
  },
  {
    key: 'deuren',
    title: 'Deuren schilderen',
    body: 'Binnen- en buitendeuren. Dekkend, glad en zonder lopers.',
  },
  {
    key: 'spuitwerk',
    title: 'Lak- en latex spuiten',
    body: 'Spuitwerk in lak of latex. Egaal, fijn van structuur en strak in de hoek.',
  },
  {
    key: 'houtrot',
    title: 'Houtrotherstel',
    body: 'Aangetast hout uitsnijden, repareren en overschilderen alsof het nieuw is.',
  },
  {
    key: 'behangen',
    title: 'Muren behangen',
    body: 'Vliesbehang, structuur of klassiek papier. Naden onzichtbaar, hoeken strak.',
  },
  {
    key: 'behang-verwijderen',
    title: 'Behang verwijderen',
    body: 'Oud behang eraf, muren weer schoon en klaar voor nieuw werk.',
  },
  {
    key: 'gevelbeplating',
    title: 'Gevelbeplating verven',
    body: 'Beplating mooi gelijk in kleur. Voorbehandeld zodat het lang blijft staan.',
  },
  {
    key: 'beits',
    title: 'Hout beitsen',
    body: 'Tuinhout, kozijnen of meubels in de juiste kleur en bescherming.',
  },
];

export const gallery = [
  {
    type: 'image',
    src: '/gallery-mural.webp',
    alt: 'Muurschildering binnenwand',
    caption: 'Wandkunst op maat',
  },
  {
    type: 'video',
    src: '/video-blue-doors.mp4',
    poster: '/video-blue-doors-poster.webp',
    alt: 'Hoogglans blauwe deuren',
    caption: 'Hoogglans deuren',
  },
  {
    type: 'video',
    src: '/video-mahogany-door.mp4',
    poster: '/video-mahogany-door-poster.webp',
    alt: 'Mahonie voordeur met glas-in-lood',
    caption: 'Mahonie deur',
  },
  {
    type: 'video',
    src: '/video-dakkapel.mp4',
    poster: '/video-dakkapel-poster.webp',
    alt: 'Dakkapel beplating buiten',
    caption: 'Dakkapel buiten',
  },
  {
    type: 'video',
    src: '/video-storefront.mp4',
    poster: '/video-storefront-poster.webp',
    alt: 'Klassieke gevel in de stad',
    caption: 'Klassieke gevel',
  },
] as const;

export const heroImage = '/hero.webp';

// Hero copy
export const hero = {
  eyebrow: 'Schilder in Houten',
  titleStart: 'Strak ',
  titleEm: 'schilderwerk',
  titleEnd: ', met oog voor detail.',
  sub: 'Binnen en buiten, behangen, spuitwerk en houtrotherstel. Vakwerk uit Houten, doorgegeven van vader op zoon.',
  ctaPrimary: 'Gratis prijsindicatie',
  ctaSecondary: 'Bel direct',
};

// Section titles
export const sectionTitles = {
  about: { eyebrow: 'Over JP', title: 'Het vak van vader op zoon.' },
  services: { eyebrow: 'Wat we doen', title: 'Schilderwerk dat klopt, tot in de hoek.' },
  gallery: { eyebrow: 'Werk', title: 'Recent uitgevoerd.' },
  location: { eyebrow: 'Locatie', title: 'Gevestigd in Houten.' },
  offerte: { eyebrow: 'Prijsindicatie', title: 'Vraag een gratis prijsindicatie aan.' },
  contact: { eyebrow: 'Contact', title: 'Even kennismaken kost niets.' },
};
