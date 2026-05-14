// All Color's Schildersbedrijf site copy + data. Dutch only.
// Tone: short, simple, no em dashes, no fillers.

export const business = {
  name: "Color's Schildersbedrijf",
  shortName: "Color's",
  tagline: 'Schilder Rotterdam',
  owner: 'Nigel',
  founded: '2022',
  yearsExperience: 10,
  team: 4,
  reviewsCount: 11,
  reviewsScore: '9,2',
  reviewsScoreNumeric: 9.2,
  address: {
    street: 'Bellamystraat 153',
    postalCode: '3027 RG',
    city: 'Rotterdam',
    province: 'Zuid-Holland',
  },
  phone: {
    display: '010 321 1389',
    href: 'tel:+31103211389',
  },
  mobile: {
    display: '06 277 43 895',
    href: 'tel:+31627743895',
    whatsapp: 'https://wa.me/31627743895',
  },
  email: {
    display: 'info@colorsschilderwerk.com',
    href: 'mailto:info@colorsschilderwerk.com',
  },
  website: {
    display: 'colorsschilderwerk.com',
    href: 'https://colorsschilderwerk.com',
  },
  trustoo:
    'https://trustoo.nl/zuid-holland/rotterdam/schilder/colors/',
  gmaps:
    'https://www.google.com/maps/place/Colors/@51.9169052,4.4301547,916m/data=!3m2!1e3!4b1!4m6!3m5!1s0x47c4359e3204dbeb:0x82ff570d539bd522!8m2!3d51.9169019!4d4.4327296',
  hours: [
    { day: 'Maandag', time: '08:00 tot 17:00' },
    { day: 'Dinsdag', time: '08:00 tot 17:00' },
    { day: 'Woensdag', time: '08:00 tot 17:00' },
    { day: 'Donderdag', time: '08:00 tot 17:00' },
    { day: 'Vrijdag', time: '08:00 tot 17:00' },
    { day: 'Zaterdag', time: 'Op afspraak' },
    { day: 'Zondag', time: 'Gesloten' },
  ],
  serviceArea: [
    'Rotterdam',
    'Schiedam',
    'Capelle aan den IJssel',
    'Vlaardingen',
    'Barendrecht',
    'Spijkenisse',
    'Ridderkerk',
    'Dordrecht',
    'Oud-Beijerland',
    'Hoogvliet',
  ],
  certificates: ['KVK gecontroleerd', 'Garantie op het werk', 'Vaste prijs vooraf'],
};

export const usps = [
  { title: 'Reactie binnen 1 uur', body: 'U krijgt snel een eerlijke prijs en plan van aanpak.' },
  { title: 'Vaste prijs vooraf', body: 'Geen verrassingen achteraf. U weet waar u aan toe bent.' },
  { title: 'Strak afgewerkt', body: 'Rechte lijnen, dekkende verf, schoon opgeleverd.' },
  { title: 'Garantie op het werk', body: 'We staan achter elk resultaat. Klacht? We lossen het op.' },
];

export const services = [
  {
    key: 'binnen',
    title: 'Binnenschilderwerk',
    body: 'Plafonds, wanden, deuren en kozijnen. Strak afgewerkt en zonder rommel in huis.',
  },
  {
    key: 'buiten',
    title: 'Buitenschilderwerk',
    body: 'Gevels, kozijnen, dakkapellen en deuren. Bestand tegen weer en zon.',
  },
  {
    key: 'houtrot',
    title: 'Houtrotherstel',
    body: 'Aangetast hout wegsnijden, herstellen en netjes overschilderen.',
  },
  {
    key: 'behangen',
    title: 'Behangen',
    body: 'Glasvezel, vlies of renovlies. Naden onzichtbaar, hoeken strak.',
  },
  {
    key: 'sauzen',
    title: 'Sauswerk',
    body: 'Egale muren en plafonds in elke kleur. Snel en zonder strepen.',
  },
  {
    key: 'lakken',
    title: 'Lakwerk en spuiten',
    body: 'Hoogglans, zijdeglans of mat. Strak gespoten of met de kwast.',
  },
  {
    key: 'kozijnen',
    title: 'Kozijnen herstellen',
    body: 'Kit vervangen, hout herstellen, weer jarenlang beschermd.',
  },
  {
    key: 'voorbereiding',
    title: 'Schuren en gronden',
    body: 'Goede basis bepaalt het eindresultaat. Schuren, plamuren, gronden.',
  },
];

export type Review = { name: string; date: string; text: string; source?: 'Trustoo' | 'Google' };

export const reviews: Review[] = [
  {
    name: 'Chantal T.',
    date: '9 sep. 2025',
    source: 'Google',
    text: 'Zeer betrouwbare schilder. Komt afspraken na en goede, snelle communicatie. Heeft de raamkozijnen keurig afgewerkt en geschilderd. Het zit nu nog steeds prachtig en ik zou hem zeker voor een nieuwe klus opnieuw vragen. Eerlijke prijs en kwaliteit bij Nigel en Colors.',
  },
  {
    name: 'Margaret Deignan',
    date: '3 sep. 2025',
    source: 'Google',
    text: 'Ik ben zeer tevreden over het schilderwerk. Mijn huis ziet er prachtig uit. De medewerkers van Colors zijn professioneel, vriendelijk en denken met je mee.',
  },
  {
    name: 'Susanne van Nieuwland',
    date: '12 jul. 2025',
    source: 'Google',
    text: 'Goede vakkundige schilder die zijn woord houdt, afspraken nakomt en goede, eerlijke prijzen hanteert. Wij zijn zeer tevreden over zijn diensten en als persoon ook erg prettig. Wij bevelen Colors zeker aan.',
  },
  {
    name: 'Denise van de Kamp',
    date: '12 jul. 2025',
    source: 'Google',
    text: 'Helemaal tevreden. Dit is inmiddels het tweede huis dat hij voor ons schilderde, en weer heel netjes en precies uitgevoerd. Vriendelijke en betrouwbare schilder. Zeker aan te raden.',
  },
  {
    name: 'Rijschool Startis',
    date: '18 dec. 2023',
    source: 'Trustoo',
    text: 'Goed personeel. Keurig gewerkt en afgewerkt. Vriendelijk en professioneel.',
  },
];

export type Project = {
  key: string;
  title: string;
  text: string;
  images: { src: string; alt: string }[];
};

export const projects: Project[] = [
  {
    key: 'gevel',
    title: 'Gevel en kozijnen',
    text: 'Volledige gevelbehandeling met houtreparatie, schuren en dekkende afwerking. Eerst de fundering op orde, dan pas verf.',
    images: [
      { src: '/gevel-1.webp', alt: 'Gevel met steiger tijdens schilderwerk in Rotterdam' },
      { src: '/gevel-2.webp', alt: 'Voorzijde woning tijdens behandeling van kozijnen' },
      { src: '/gevel-3.webp', alt: 'Strak afgewerkte gevel na schilderwerk' },
      { src: '/gevel-4.webp', alt: 'Detail van afgewerkt kozijn naast metselwerk' },
    ],
  },
  {
    key: 'tuinhuis',
    title: 'Tuinhuis in mahonie',
    text: 'Houten tuinhuis schuren, lakken en beschermen tegen weer en zon. Warme mahonie tint die het hout laat ademen.',
    images: [
      { src: '/tuinhuis-1.webp', alt: 'Afgewerkt tuinhuis in mahonie kleur' },
      { src: '/tuinhuis-2.webp', alt: 'Tuinhuis tijdens lakwerk' },
      { src: '/tuinhuis-3.webp', alt: 'Detail van houtafwerking tuinhuis' },
      { src: '/tuinhuis-4.webp', alt: 'Tuinhuis vanuit ander perspectief' },
    ],
  },
  {
    key: 'binnen',
    title: 'Binnenwerk en deuren',
    text: 'Voordeur en kozijnen binnen lakken in diep nachtblauw. Strakke lijnen, geen lopers, alles netjes afgeplakt.',
    images: [
      { src: '/binnen-1.webp', alt: 'Hoogglans nachtblauwe voordeur na lakken' },
      { src: '/binnen-2.webp', alt: 'Detail van afgewerkte binnendeur' },
      { src: '/binnen-3.webp', alt: 'Raam tijdens lakwerk met afplakband' },
    ],
  },
  {
    key: 'plafonds',
    title: 'Plafonds en nieuwbouw',
    text: 'Plafonds en wanden in nieuwbouw, met blootliggende balken die we netjes afsteken. Wit dat wit blijft.',
    images: [
      { src: '/plafond-1.webp', alt: 'Wit plafond met houten balken' },
      { src: '/plafond-2.webp', alt: 'Nieuwbouw plafond afgewerkt in wit' },
      { src: '/plafond-3.webp', alt: 'Hoek van plafond en wand strak afgewerkt' },
      { src: '/plafond-4.webp', alt: 'Plafond detail met balk' },
    ],
  },
];

export const galleryImages: { src: string; alt: string; caption?: string }[] = [
  { src: '/gevel-1.webp', alt: 'Gevel met steiger', caption: 'Gevel Rotterdam' },
  { src: '/tuinhuis-1.webp', alt: 'Tuinhuis mahonie', caption: 'Tuinhuis' },
  { src: '/binnen-1.webp', alt: 'Nachtblauwe deur', caption: 'Voordeur' },
  { src: '/gevel-3.webp', alt: 'Gevel na schilderwerk', caption: 'Na' },
  { src: '/plafond-1.webp', alt: 'Plafond wit', caption: 'Plafond' },
  { src: '/gevel-2.webp', alt: 'Woning voorzijde', caption: 'Buitenwerk' },
  { src: '/extra-tuin.webp', alt: 'Tuinaanzicht na werk', caption: 'Tuin' },
  { src: '/binnen-2.webp', alt: 'Binnendeur', caption: 'Binnen' },
  { src: '/tuinhuis-2.webp', alt: 'Tuinhuis tijdens werk', caption: 'Tijdens' },
  { src: '/gevel-4.webp', alt: 'Detail kozijn', caption: 'Detail' },
  { src: '/plafond-2.webp', alt: 'Plafond nieuwbouw', caption: 'Nieuwbouw' },
  { src: '/binnen-3.webp', alt: 'Raam tijdens lakwerk', caption: 'Lakwerk' },
  { src: '/tuinhuis-3.webp', alt: 'Tuinhuis hout detail', caption: 'Lakken' },
  { src: '/extra-detail.webp', alt: 'Vakwerk detail', caption: 'Vakwerk' },
  { src: '/plafond-3.webp', alt: 'Plafond hoek', caption: 'Hoek' },
  { src: '/tuinhuis-4.webp', alt: 'Tuinhuis vooraanzicht', caption: 'Buiten' },
];

export type Stage = { src: string; label: string; sub: string; alt: string };

export const beforeAfterStages: Stage[] = [
  {
    src: '/stage-voor.webp',
    label: 'Voor',
    sub: 'Verweerd hout, losse verflagen, scheuren in de kit.',
    alt: 'Kozijn voor de behandeling met houtrot en losse verf',
  },
  {
    src: '/stage-tijdens.webp',
    label: 'Tijdens',
    sub: 'Schuren, plamuren met epoxy, gronden, naden netjes afkitten.',
    alt: 'Kozijn tijdens herstel met plamuur',
  },
  {
    src: '/stage-na.webp',
    label: 'Na',
    sub: 'Strakke afwerking, dekkende verf, weer jarenlang beschermd.',
    alt: 'Kozijn na schilderwerk strak afgewerkt',
  },
];

// Hero copy
export const hero = {
  eyebrow: 'Schildersbedrijf Rotterdam',
  titleStart: 'Strak ',
  titleEm: 'schilderwerk',
  titleEnd: ', met kleur.',
  sub: 'Binnen en buiten, behangen en houtrotherstel. Vakwerk uit Rotterdam met vaste prijzen en garantie op het werk.',
  ctaPrimary: 'Gratis prijsindicatie',
  ctaSecondary: 'Bel direct',
};

// Section titles
export const sectionTitles = {
  about: { eyebrow: 'Over Color’s', title: 'Schildersbedrijf dat zijn werk netjes oplevert.' },
  services: { eyebrow: 'Wat we doen', title: 'Schilderwerk dat klopt, tot in de hoek.' },
  gallery: { eyebrow: 'Werk', title: 'Een greep uit recente projecten.' },
  showcase: { eyebrow: 'In beeld', title: 'Voor, tijdens en na, naast elkaar.' },
  reviews: { eyebrow: 'Reviews', title: 'Wat klanten zeggen.' },
  offerte: { eyebrow: 'Prijsindicatie', title: 'Vraag een gratis prijsindicatie aan.' },
  contact: { eyebrow: 'Contact', title: 'Bellen of mailen, beide kan.' },
};
