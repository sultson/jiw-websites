/** Een foto uit het beheer, in de maten die de site nodig heeft. */
export type Img = {
  ratio: number;
  klein: string;
  breed: string;
  vol: string;
};

export type Categorie = 'Inloop' | 'Creatief' | 'Bewegen' | 'Wellness' | 'Overig';

export type Herhaling = 'eenmalig' | 'wekelijks' | 'tweewekelijks' | 'maandelijks';

/**
 * Eén regel zoals hij in het beheer staat. Een wekelijkse inloop is hier één
 * regel; de losse donderdagen worden er in agenda/model.ts uit gerekend.
 */
export type AgendaBron = {
  id: string;
  soort: 'activiteit' | 'mededeling';
  titel: string;
  categorie: Categorie;
  omschrijving: string;
  img: Img | null;
  /** ISO-datum, zoals 2026-09-03. Lokale tijd in Zeewolde, geen UTC. */
  datum: string;
  totDatum?: string;
  heleDag: boolean;
  begintijd?: string;
  eindtijd?: string;
  herhaling: Herhaling;
  herhaalTot?: string;
  overslaan: string[];
  aanmelden: boolean;
  bijdrage?: string;
  locatie?: string;
};

/** Eén keer dat iets plaatsvindt: waar de agenda en de kalender mee werken. */
export type Activiteit = {
  /** Uniek per keer, dus bron plus datum. */
  id: string;
  bronId: string;
  soort: 'activiteit' | 'mededeling';
  titel: string;
  categorie: Categorie;
  omschrijving: string;
  img: Img | null;
  /** Hoe de reeks loopt waar deze keer uit komt: voor "elke donderdag". */
  herhaling: Herhaling;
  start: Date;
  eind: Date;
  heleDag: boolean;
  aanmelden: boolean;
  bijdrage?: string;
  locatie?: string;
};

export type RichBlock =
  | { _type: 'image'; _key?: string; img: Img; alt?: string; bijschrift?: string }
  | { _type: string; _key?: string; [key: string]: unknown };

export type Bericht = {
  id: string;
  slug: string;
  datum: string;
  datumISO?: string;
  vastgezet: boolean;
  titel: string;
  intro: string;
  samenvatting: string;
  body: RichBlock[];
  /** Uit het beheer een Img, in de meegeleverde berichten een adres in public/img. */
  img: Img | string | null;
  instagram?: string;
  facebook?: string;
  seoTitel?: string;
  seoOmschrijving?: string;
};

export type Sponsor = { naam: string; beeld: string; web?: string };

export type KopTekst = { kop: string; tekst: string };
export type Persoon = { naam: string; rol: string };

export type Teksten = {
  hero: {
    kicker: string;
    titel: string;
    lead: string;
    knop: string;
    knopTwee: string;
    deurLabel: string;
    deurOpenLabel: string;
  };
  open: { titel: string; tekst: string; punten: KopTekst[] };
  nieuwsBlok: { kicker: string; titel: string; lead: string };
  agendaBlok: { kicker: string; titel: string; lead: string; paginaLead: string };
  welkom: { kicker: string; titel: string; alineas: string[]; knop: string };
  wieWeZijn: {
    kicker: string;
    titel: string;
    lead: string;
    alineas: string[];
    voorWie: string[];
  };
  watWeDoen: {
    kicker: string;
    titel: string;
    lead: string;
    items: { kop: string; wanneer: string; tekst: string; foto: Img | string }[];
    kosten: string;
  };
  naam: { kicker: string; titel: string; alineas: string[]; slot: string };
  jongeren: { kicker: string; titel: string; lead: string; alineas: string[]; knop: string };
  vrijwilliger: {
    kicker: string;
    titel: string;
    lead: string;
    rollen: { kop: string; tekst: string; punten: string[]; slot: string }[];
    uitnodigingTitel: string;
    uitnodiging: string;
  };
  steun: {
    kicker: string;
    titel: string;
    lead: string;
    manieren: KopTekst[];
    anbi: string;
    sponsorenTitel: string;
    sponsorenTekst: string;
  };
  verantwoording: {
    kicker: string;
    titel: string;
    lead: string;
    doel: string;
    beloning: string;
    bestuur: Persoon[];
    advies: Persoon[];
  };
  contact: {
    kicker: string;
    titel: string;
    lead: string;
    formulierTitel: string;
    formulierTekst: string;
    openingstijden: string;
  };
};

export type Content = {
  teksten: Teksten;
  agenda: AgendaBron[];
  nieuws: Bericht[];
  sponsoren: Sponsor[];
};
