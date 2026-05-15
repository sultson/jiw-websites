/**
 * Real reviews collected from Marktplaats and Werkspot. Used verbatim.
 */
export type ReviewItem = {
  name: string;
  city: string;
  date: string;
  rating: number;
  jobNl: string;
  jobEn: string;
  quoteNl: string;
  quoteEn: string;
};

export const reviews: ReviewItem[] = [
  {
    name: 'Linda',
    city: 'Breda',
    date: '2012',
    rating: 5,
    jobNl: '2 kozijnen plaatsen en zolder uittimmeren',
    jobEn: 'Installing 2 window frames and building out an attic',
    quoteNl: 'Prima vakmanschap, zeer snelle reactie op mijn opdracht. Mooie afwerking en netjes opgeruimd. Bedankt en tot de volgende klus.',
    quoteEn: 'Fine craftsmanship, a very quick response to my request. Beautiful finishing and tidily cleaned up. Thanks and until the next job.',
  },
  {
    name: 'Werkspot-gebruiker',
    city: 'Roosendaal',
    date: '2012',
    rating: 5,
    jobNl: 'Twee slaapkamers samenvoegen tot een ruimte',
    jobEn: 'Merging two bedrooms into one space',
    quoteNl: 'De mannen van Thijs Timmerwerk leveren goed werk, werken snel en doen dat voor een aangename prijs.',
    quoteEn: 'The men of Thijs Timmerwerk deliver good work, work fast and do it for a pleasant price.',
  },
  {
    name: 'Mariëtte',
    city: 'Breda',
    date: '2012',
    rating: 5,
    jobNl: 'Dakkapellen en keuken plaatsen',
    jobEn: 'Installing dormers and a kitchen',
    quoteNl: 'Super vakman. Dank je wel voor je mooie afwerking.',
    quoteEn: 'Excellent craftsman. Thank you for your beautiful finishing.',
  },
  {
    name: 'La Meuse',
    city: 'Marktplaats',
    date: '2012',
    rating: 5,
    jobNl: 'Kasten inkorten',
    jobEn: 'Trimming cabinets',
    quoteNl: 'Goed telefonisch bereikbaar. Duidelijke vakkundige reactie op de gestelde vraag. Heldere prijsafspraak. Redelijk snel beschikbaar. Klinkt vertrouwenwekkend.',
    quoteEn: 'Easy to reach by phone. A clear, expert response to my question. A clear price agreement. Available reasonably soon. Sounds trustworthy.',
  },
  {
    name: 'Werkspot-gebruiker',
    city: 'Tilburg',
    date: '2012',
    rating: 5,
    jobNl: 'Renovatie overkapping voordeur',
    jobEn: 'Renovation of a front-door canopy',
    quoteNl: 'Super. Werkt hard, heeft verstand van klussen. Zeker aan te bevelen!',
    quoteEn: 'Excellent. Works hard, knows the job. Definitely recommended!',
  },
  {
    name: 'L B',
    city: 'Tilburg',
    date: '2012',
    rating: 4,
    jobNl: 'Gebarsten glasplaat vervangen door trespa paneel',
    jobEn: 'Replacing a cracked glass panel with a Trespa panel',
    quoteNl: 'Prima ervaring, heeft kennis van zaken en geeft advies.',
    quoteEn: 'A fine experience, knows the trade and gives advice.',
  },
];

/** Aggregated traits most often cited across the 63 Marktplaats ratings. */
export type Trait = { labelNl: string; labelEn: string; count: number };

export const traits: Trait[] = [
  { labelNl: 'Reageert snel',     labelEn: 'Responds quickly',   count: 45 },
  { labelNl: 'Vriendelijk',       labelEn: 'Friendly',           count: 45 },
  { labelNl: 'Komt afspraken na', labelEn: 'Keeps appointments', count: 43 },
  { labelNl: 'Komt op tijd',      labelEn: 'Arrives on time',    count: 15 },
];
