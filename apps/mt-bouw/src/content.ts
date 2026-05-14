// All MT Bouw site copy + data. Dutch only.
// Tone: short, simple, no em dashes, no fillers.

export const business = {
  name: 'MT Bouw',
  tagline: 'Schilder Rijswijk',
  owner: 'Tarek',
  teamMate: 'Hasim',
  founded: '2020',
  yearsExperience: 21,
  yearsInBusiness: 6,
  reviewsCount: 58,
  reviewsScore: '9,3',
  reviewsScoreNumeric: 9.3,
  address: {
    street: 'Henri Ter Hallsingel 22',
    postalCode: '2284 XB',
    city: 'Rijswijk',
    province: 'Zuid-Holland',
  },
  phone: {
    display: '06 86 27 97 02',
    href: 'tel:+31686279702',
  },
  mobile: {
    display: '06 86 27 97 02',
    href: 'tel:+31686279702',
    whatsapp: 'https://wa.me/31686279702',
  },
  email: {
    display: 'info@mt-bouw.jouwidealewebsite.nl',
    href: 'mailto:info@mt-bouw.jouwidealewebsite.nl',
  },
  website: 'https://www.yasso-schilderwerk.nl',
  kvk: 'Geverifieerd via Trustoo',
  trustoo: 'https://trustoo.nl/zuid-holland/rijswijk/schilder/yasso/',
  hours: [
    { day: 'Maandag', time: '09:00 tot 17:00' },
    { day: 'Dinsdag', time: '09:00 tot 17:00' },
    { day: 'Woensdag', time: '09:00 tot 17:00' },
    { day: 'Donderdag', time: '09:00 tot 17:00' },
    { day: 'Vrijdag', time: '09:00 tot 17:00' },
    { day: 'Zaterdag', time: '09:00 tot 17:00' },
    { day: 'Zondag', time: 'Op afspraak' },
  ],
  serviceArea: [
    'Rijswijk',
    'Den Haag',
    'Voorburg',
    'Nootdorp',
    'Leidschendam',
    'Wateringen',
    'Delft',
  ],
  certificates: [
    'Top Pro 2026 op Trustoo',
    'Top Score 2026 op Trustoo',
    'Lid van Schilderslabel',
    'Premium Partner Trustoo',
  ],
};

export const usps = [
  { title: 'Snelle reactie', body: 'Vaak de eerste die belt na uw aanvraag. Binnen 1 uur reactie.' },
  { title: 'Afspraken nakomen', body: 'Duidelijke planning, op tijd op locatie en netjes opgeleverd.' },
  { title: 'Oog voor detail', body: 'Houtrot proactief opgespoord en hersteld, niet alleen overschilderd.' },
  { title: '21 jaar ervaring', body: 'Vakmanschap dat door 58 reviews op Trustoo wordt bevestigd.' },
];

export const services = [
  {
    key: 'buiten',
    title: 'Buitenschilderwerk',
    body: 'Gevels, kozijnen, dakkapellen en deuren. Bestand tegen weer en zon.',
  },
  {
    key: 'kozijnen',
    title: 'Kozijnen schilderen',
    body: 'Houten en kunststof kozijnen schuren, gronden en strak aflakken.',
  },
  {
    key: 'houtrot',
    title: 'Houtrotherstel',
    body: 'Aangetast hout uitsnijden, herstellen en netjes overschilderen.',
  },
  {
    key: 'binnen',
    title: 'Binnenschilderwerk',
    body: 'Plafonds, wanden, deuren en kozijnen. Geen rommel in huis.',
  },
  {
    key: 'behangen',
    title: 'Behangwerk',
    body: 'Glasvezel, vlies of klassiek papier. Naden onzichtbaar, hoeken strak.',
  },
  {
    key: 'glaszetten',
    title: 'Glaszetten',
    body: 'Enkel of dubbel glas vervangen. Inclusief kit en afwerking.',
  },
];

export type Review = { name: string; date: string; text: string };

// 13 reviews picked from 58 on Trustoo (rating 8+, recent).
export const reviews: Review[] = [
  {
    name: 'Joop',
    date: '12 mei 2026',
    text: 'Goed gewerkt en alle werkzaamheden tot tevredenheid verricht.',
  },
  {
    name: 'Henny Ivo',
    date: '11 mei 2026',
    text: 'Wij zijn heel tevreden omdat er goed geluisterd wordt naar wat onze wensen zijn. Behangwerk is echt mooi gedaan en het verfwerk ook.',
  },
  {
    name: 'Daan',
    date: '10 mei 2026',
    text: 'Het was gezellig met Tarik en zijn team. Ze deden goed werk en ik ben tevreden.',
  },
  {
    name: 'Rene',
    date: '2 mei 2026',
    text: 'Toen ik een offerte opvroeg was MT Bouw de eerste die me belde. Tarek en zijn team konden vrij snel komen en het houtrot is vakkundig verwijderd en gerepareerd. Tijdens het verven zag hij nog een paar plekken, wat hij heeft laten zien en ook heeft verwijderd. Het schilderwerk is strak en zorgvuldig uitgevoerd, met oog voor detail. Alles werd netjes achtergelaten.',
  },
  {
    name: 'Albert',
    date: '28 apr. 2026',
    text: 'Tarek kwam met zijn team ons huis verven en dat van de buren. Hij zag wat er gerepareerd moest worden en pakte dit zelfstandig aan. Hij gebruikte goede materialen en we zijn erg blij met het resultaat.',
  },
  {
    name: 'H. v. Ofwegen',
    date: '7 apr. 2026',
    text: 'Doet wat er beloofd is, vriendelijk en snel.',
  },
  {
    name: 'Andrei',
    date: '29 mrt. 2026',
    text: 'Tarek and his team have fulfilled what was promised. The painting, glass replacement and window wood repair was done to a high standard. He is a man who keeps his word and worked even outside normal hours to make sure the job gets done within the timeframe.',
  },
  {
    name: 'Ger Ligtvoet',
    date: '20 mrt. 2026',
    text: 'Tarek is een professionele schilder. Een vakman. En nog aardig ook.',
  },
  {
    name: 'Tanja',
    date: '1 mrt. 2026',
    text: 'Dit is een goed schildersbedrijf. De reactie op mijn aanvraag en de offerte volgden snel. Tijdens de werkzaamheden werd extra houtrot geconstateerd. Dit werd goed gecommuniceerd en ook zorgvuldig behandeld en vakkundig hersteld. Er werd hard gewerkt en alles werd netjes afgewerkt. Zeker een aanrader.',
  },
  {
    name: 'John',
    date: '10 dec. 2025',
    text: 'Yasso is een betrouwbaar en integer bedrijf. Uitstekende communicatie en snelle afhandeling. Met name Tarek wil ik bedanken voor zijn aanbeveling van de prachtige muurkleuren. Het appartement ziet er nu prachtig uit.',
  },
  {
    name: 'Sam',
    date: '26 okt. 2025',
    text: 'Uitstekende klantenservice, professionele houding en goede waarde voor de prijs. Echt warm en behulpzaam team dat weet hoe naar de klant te luisteren en werkzaamheden aan te passen.',
  },
  {
    name: 'Joris',
    date: '14 okt. 2025',
    text: 'Tarek en zijn team hebben uitstekend werk geleverd. Netjes wat houtreparaties gedaan. Deuren netjes gelakt en alle kozijnen strak in de verf. Ook het wijzigen van kleur was geen probleem. De offerte vooraf was duidelijk. We hebben samen al het schilderwerk nogmaals nagelopen, totdat ik helemaal tevreden was.',
  },
  {
    name: 'Marc Thuijls',
    date: '22 sep. 2025',
    text: 'Goed schildersbedrijf. Werken netjes en houtwerk ziet er prima uit. Slechte stukken hout worden vervangen na overleg. Komen afspraken na en houden ons goed op de hoogte.',
  },
];

export type ProjectImage = { src: string; alt: string };
export type Project = {
  key: string;
  title: string;
  location: string;
  scope: string;
  images: ProjectImage[];
};

// 4 project ensembles, 22 photos in total. Designed for a balanced 2x2 grid.
export const projects: Project[] = [
  {
    key: 'hoogwerker',
    title: 'Monumentaal pand op hoogwerker',
    location: 'Rijswijk',
    scope: 'Gevels en houtwerk op grote hoogte. Hoogwerker en steiger voor elk detail.',
    images: [
      { src: '/photo-13.webp', alt: 'Hoogwerker bij toren van monumentaal pand' },
      { src: '/photo-01.webp', alt: 'Hoogwerker bij toren tegen donkere lucht' },
      { src: '/photo-05.webp', alt: 'Steiger en hoogwerker langs bakstenen gevel' },
      { src: '/photo-24.webp', alt: 'Gebouw volledig in de steiger met veiligheidsdoek' },
    ],
  },
  {
    key: 'gevel-buitenwerk',
    title: 'Strakke gevels en buitenwerk',
    location: 'Zuid-Holland',
    scope: 'Houten gevels schuren, gronden en afwerken. Kleur kiezen samen met de klant.',
    images: [
      { src: '/photo-03.webp', alt: 'Witte villa met strak afgewerkte gevel en kozijnen' },
      { src: '/photo-07.webp', alt: 'Witte boerderij met schilder op hoogwerker' },
      { src: '/photo-09.webp', alt: 'Witte landelijke woning met schilder op ladder' },
      { src: '/photo-02.webp', alt: 'Close-up van schilder die houten gevel beitst' },
    ],
  },
  {
    key: 'historische-gevels',
    title: 'Historische gevels in Rijswijk',
    location: 'Rijswijk en Den Haag',
    scope: 'Trapgevels, dakkapellen en monumentale details. Klassiek schilderwerk met geduld.',
    images: [
      { src: '/photo-17.webp', alt: 'Tarek op ladder bij witte trapgevel' },
      { src: '/photo-25.webp', alt: 'Tarek met meerdere ladders bij oud pand' },
      { src: '/photo-23.webp', alt: 'Tarek hoog op ladder bij witte halsgevel' },
      { src: '/photo-16.webp', alt: 'Donkerblauwe houten geveldetail strak afgelakt' },
      { src: '/photo-06.webp', alt: 'Donker geverfde houten gevel, strak afgewerkt' },
    ],
  },
  {
    key: 'binnen-behang',
    title: 'Binnenwerk en behang',
    location: 'Rijswijk en omgeving',
    scope: 'Plafonds, wanden en behang. Bijzondere muurschilderingen op aanvraag.',
    images: [
      { src: '/photo-18.webp', alt: 'Muurschildering van Van Goghs Sterrennacht op zolderkamer' },
      { src: '/photo-20.webp', alt: 'Goud getextureerd behang met patroon' },
      { src: '/photo-26.webp', alt: 'Kamer in voorbereiding met afdekzeil en verfblikken' },
    ],
  },
];

// "Buitenschilderwerk op hoogte" gallery: 4 height-themed shots.
export const gallery: Array<{ src: string; alt: string; caption: string }> = [
  { src: '/photo-15.webp', alt: 'Schilder op gele steiger', caption: 'Op de steiger' },
  { src: '/photo-11.webp', alt: 'Pand in steiger met veiligheidsdoek', caption: 'VvE in onderhoud' },
  { src: '/photo-21.webp', alt: 'Tarek werkt aan dakkapel op pannendak', caption: 'Op het dak' },
  { src: '/photo-12.webp', alt: 'Steiger bij stadspand', caption: 'Stadspand' },
];

export const ownerImage = '/owner.webp';
export const heroImage = '/hero.webp';

export const hero = {
  eyebrow: 'Schilder in Rijswijk',
  titleStart: 'Strak werk, ',
  titleEm: 'afspraken',
  titleEnd: ' nagekomen.',
  sub: 'Tarek en zijn team schilderen binnen en buiten, herstellen houtrot en vervangen glas. Eén ploeg uit Rijswijk voor uw hele klus.',
  ctaPrimary: 'Gratis prijsindicatie',
  ctaSecondary: 'Bel direct',
};

export const sectionTitles = {
  about: { eyebrow: 'Over MT Bouw', title: 'Persoonlijk contact en strak werk.' },
  services: { eyebrow: 'Wat we doen', title: 'Schilderwerk en houtherstel, netjes afgewerkt.' },
  projects: { eyebrow: 'Werk', title: 'Een greep uit recente projecten.' },
  gallery: { eyebrow: 'Op hoogte', title: 'Buitenschilderwerk op hoogte.' },
  reviews: { eyebrow: 'Reviews', title: 'Wat klanten zeggen.' },
  area: { eyebrow: 'Werkgebied', title: 'Actief in Rijswijk en omgeving.' },
  offerte: { eyebrow: 'Prijsindicatie', title: 'Vraag een gratis prijsindicatie aan.' },
  contact: { eyebrow: 'Contact', title: 'Even kennismaken kost niets.' },
};
