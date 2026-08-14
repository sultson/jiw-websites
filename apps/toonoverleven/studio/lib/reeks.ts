import { expandeer, ritme } from '../../src/agenda/model';
import type { Activiteit, AgendaBron, Categorie } from '../../src/content/types';

/**
 * De agenda uitrekenen in het beheer, met exact dezelfde som als de site.
 *
 * Dit bestand importeert `expandeer` uit de site zelf en rekent niets na. Dat
 * is met opzet: als het beheer zijn eigen versie van "elke derde donderdag"
 * zou hebben, dan zou de kalender in het beheer op een dag andere datums tonen
 * dan de kalender op de site, en dan is het beheer een leugen.
 */

export type { Activiteit, Categorie };

/** Een half ingevuld formulier, zoals het in het beheer op het scherm staat. */
export type Concept = {
  _id?: string;
  soort?: string;
  titel?: string;
  categorie?: string;
  omschrijving?: string;
  datum?: string;
  totDatum?: string;
  heleDag?: boolean;
  begintijd?: string;
  eindtijd?: string;
  herhaling?: string;
  herhaalTot?: string;
  overslaan?: string[];
  aanmelden?: boolean;
  bijdrage?: string;
  locatie?: string;
};

/**
 * Van wat er in het formulier staat naar wat de site leest. Alles wat nog leeg
 * is krijgt hier de waarde waar de site ook op terugvalt, zodat een document
 * dat halverwege het invullen is toch al te bekijken valt.
 */
export function alsBron(doc: Concept): AgendaBron | null {
  if (!doc?.datum) return null;
  return {
    id: doc._id ?? 'concept',
    soort: doc.soort === 'mededeling' ? 'mededeling' : 'activiteit',
    titel: doc.titel || 'Zonder naam',
    categorie: (doc.categorie as Categorie) || 'Overig',
    omschrijving: doc.omschrijving ?? '',
    img: null,
    datum: doc.datum,
    totDatum: doc.totDatum,
    heleDag: Boolean(doc.heleDag),
    begintijd: doc.begintijd,
    eindtijd: doc.eindtijd,
    herhaling: (doc.herhaling as AgendaBron['herhaling']) || 'eenmalig',
    herhaalTot: doc.herhaalTot,
    // Bewust leeg: de lijst met keren laat juist zien wát er is uitgezet, dus
    // die keren moeten er ín zitten en niet uit gefilterd zijn.
    overslaan: [],
    aanmelden: Boolean(doc.aanmelden),
    bijdrage: doc.bijdrage,
    locatie: doc.locatie,
  };
}

/** De eerstvolgende keren dat één agendapunt plaatsvindt. */
export function keren(doc: Concept, hoeveel = 12): Activiteit[] {
  const bron = alsBron(doc);
  if (!bron) return [];
  const vanaf = new Date();
  vanaf.setHours(0, 0, 0, 0);
  const tot = new Date(vanaf.getFullYear() + 2, vanaf.getMonth(), vanaf.getDate());
  return expandeer([bron], vanaf, tot).slice(0, hoeveel);
}

/** Alle keren van alle agendapunten binnen een venster, voor de kalender. */
export function kalender(docs: Concept[], van: Date, tot: Date): Activiteit[] {
  const bronnen = docs
    .map((doc) => {
      const bron = alsBron(doc);
      if (!bron) return null;
      return { ...bron, overslaan: doc.overslaan ?? [] };
    })
    .filter((b): b is AgendaBron => b !== null);
  return expandeer(bronnen, van, tot);
}

export { ritme };

/* ------------------------------------------------------------------ */
/*  Datums in gewone woorden                                           */
/* ------------------------------------------------------------------ */

export const sleutel = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const langeDatum = (d: Date): string =>
  d.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' });

export const korteDatum = (d: Date): string =>
  d.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' });

export const MAANDEN = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
];

export const WEEKKOPPEN = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];

/** De kleur van een categorie, dezelfde familie als op de site. */
export const KLEUR: Record<string, { vlak: string; rand: string; tekst: string }> = {
  Inloop: { vlak: '#e4efec', rand: '#5b9586', tekst: '#2d5c48' },
  Creatief: { vlak: '#f7edd3', rand: '#c9a227', tekst: '#6b5410' },
  Bewegen: { vlak: '#e9f0df', rand: '#7f9d5c', tekst: '#41562a' },
  Wellness: { vlak: '#e0f0ec', rand: '#6aa79b', tekst: '#2f5d55' },
  Overig: { vlak: '#eceaea', rand: '#8a7c81', tekst: '#43363b' },
  Mededeling: { vlak: '#fbe6ec', rand: '#a34a68', tekst: '#7d1f41' },
};

export const kleurVan = (a: Activiteit) =>
  a.soort === 'mededeling' ? KLEUR.Mededeling : (KLEUR[a.categorie] ?? KLEUR.Overig);
