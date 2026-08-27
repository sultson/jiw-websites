import type { Verhaal } from './verhalen';

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
 * Voor wie iets bedoeld is. De site heeft pagina's voor jongeren, voor
 * vijfendertig tot vijftig en voor naasten, en die pagina's mogen alleen tonen
 * wat er werkelijk voor die groep is. "Iedereen" is daarom geen restcategorie
 * maar een antwoord: het meeste staat voor iedereen open.
 */
export type Doelgroep = 'jongeren-15-35' | '35-50' | 'naasten' | 'iedereen';

/**
 * De zes thema's waar /activiteiten/per-thema pagina's voor heeft. De sleutels
 * zijn de adressen van die pagina's, zodat een thema en zijn pagina niet uit
 * elkaar kunnen lopen.
 */
export type Thema =
  | 'ontmoeten'
  | 'bewegen-en-ontspannen'
  | 'werk-en-studie'
  | 'herstel-en-energie'
  | 'relaties-en-gezin'
  | 'informatie-en-inspiratie';

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
  /**
   * Voor wie dit is. Blijft het vakje in het beheer leeg, dan is het voor
   * iedereen; agenda/model.ts vult dat in zodat de site nergens hoeft te raden.
   */
  doelgroepen?: Doelgroep[];
  /** Onder welke thema's dit valt. Leeg is leeg: geen verzonnen thema. */
  themas?: Thema[];
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
  /** Altijd ingevuld: een regel zonder keuze staat voor iedereen open. */
  doelgroepen: Doelgroep[];
  themas: Thema[];
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
  praktisch: Praktisch;
};

/**
 * De praktische gegevens: een tijd, een bedrag, een vakantie waarin de deur
 * dicht blijft. Dat zijn precies de dingen die veranderen zonder dat er iemand
 * aan de site werkt, dus ze staan in het beheer en niet in de code.
 *
 * De vastgestelde pagina's uit de mock-up laten hier ruimte voor open; in
 * inhoud/feiten.ts worden deze gegevens er als feit overheen gelegd.
 */
export type Praktisch = {
  openingstijden: { ochtend: string; avond: string; afwijkingen: string };
  kosten: { inloop: string; activiteiten: string; drempel: string };
  locatie: { adres: string; route: string; parkeren: string; ingang: string; elders: string };
  contact: { wieReageert: string; watGebeurtEr: string; reactietijd: string };
  /** De alinea voor huisartsen en ziekenhuizen op /voor-verwijzers. */
  verwijzers: string;
};

export type Content = {
  teksten: Teksten;
  agenda: AgendaBron[];
  nieuws: Bericht[];
  sponsoren: Sponsor[];
  /** De verhalen van bezoekers, alleen wat met toestemming gepubliceerd is. */
  verhalen: Verhaal[];
};
