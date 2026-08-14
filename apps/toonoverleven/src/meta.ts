/**
 * Hoe een pagina heet, in het tabblad en in een voorbeeld van een gedeelde
 * link.
 *
 * Bewust gedeeld met de Worker: die schrijft deze regels in de HTML voordat de
 * pagina verstuurd wordt, en dat is de versie die een zoekmachine of WhatsApp
 * ooit ziet. De app schrijft dezelfde regels als hij zonder herladen naar een
 * andere pagina gaat. Eén bron, dus ze kunnen niet uit elkaar lopen.
 *
 * Hier staat geen DOM in: de Worker importeert dit bestand ook.
 */

export const SITE_NAAM = 'Toon over Leven';
export const SITE_URL = 'https://toonoverleven.jouwidealewebsite.nl';

/** De pagina's die de site heeft, in de volgorde van het menu. */
export const PADEN = [
  '/',
  '/wie-we-zijn',
  '/agenda',
  '/nieuws',
  '/vrijwilliger',
  '/steun',
  '/verantwoording',
  '/contact',
] as const;

export type Pad = (typeof PADEN)[number];

type PaginaMeta = { titel: string; omschrijving: string };

/**
 * De voorpagina houdt de titel van de site zelf; de rest zet zijn eigen naam
 * ervoor. Zo leest een zoekresultaat als "Agenda | Toon over Leven" in plaats
 * van acht keer dezelfde regel.
 */
export const PAGINAS: Record<Pad, PaginaMeta> = {
  '/': {
    titel: 'Toon over Leven Zeewolde | Inloophuis voor leven met en na kanker',
    omschrijving:
      'Loop binnen aan het Mazerhard 37 in Zeewolde. Elke donderdag van 10:00 tot 12:00, zonder afspraak en zonder verwijzing. Voor iedereen die met kanker te maken heeft of heeft gehad, en voor hun naasten.',
  },
  '/wie-we-zijn': {
    titel: 'Wie we zijn en wat we doen',
    omschrijving:
      'Een huis met een huiskamer, een grote tafel en een tuin, gerund door vrijwilligers uit Zeewolde. Koffie, gesprekken, creatieve workshops, wandelen en meditatie.',
  },
  '/agenda': {
    titel: 'Agenda',
    omschrijving:
      'Alles wat er de komende tijd te doen is bij Toon over Leven in Zeewolde: de inloop, creatieve workshops, wandelingen en meditatie. Met datum, tijd en of aanmelden nodig is.',
  },
  '/nieuws': {
    titel: 'Nieuws & Blog',
    omschrijving:
      'Nieuwe workshops, een wandeling die verzet wordt, een dag die goed uitpakte. Wat er bij Toon over Leven in Zeewolde gebeurt.',
  },
  '/vrijwilliger': {
    titel: 'Vrijwilliger worden',
    omschrijving:
      'Het inloophuis draait volledig op vrijwilligers. Gastheer, gastvrouw of meehelpen achter de schermen: een zorgachtergrond is niet nodig, de training krijgt u van ons.',
  },
  '/steun': {
    titel: 'Steun ons',
    omschrijving:
      'Toon over Leven krijgt geen vaste financiering en draait op giften. Doneren, vriend worden, sponsoren of gratis steunen via SponsorKliks.',
  },
  '/verantwoording': {
    titel: 'Verantwoording en ANBI',
    omschrijving:
      'Beleidsplan, jaarverslagen en ANBI-verantwoording van Stichting Toon Hermans Huis Zeewolde, sinds 1 juli 2026 Toon over Leven. Alle stukken als PDF.',
  },
  '/contact': {
    titel: 'Kom langs',
    omschrijving:
      'Mazerhard 37 in Zeewolde. Bel 036-8450265, mail info@toonoverleven.nl of stuur een bericht. Aanmelden hoeft niet.',
  },
};

export const NIET_GEVONDEN = 'Pagina niet gevonden';

export const paginaTitel = (kop: string) => `${kop} | ${SITE_NAAM}`;

/** Het adres zonder afsluitende schuine streep: wat een pagina is. */
export function schoonPad(pathname: string): string {
  const pad = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return pad || '/';
}

export const absoluutUrl = (pad: string): string => `${SITE_URL}${pad === '/' ? '/' : pad}`;

/**
 * Een kop omgezet naar een adres: "Nieuwe mandalagroep" wordt
 * "nieuwe-mandalagroep". Waar een bericht op terugvalt als er in het beheer
 * nooit een adres is gegenereerd, zodat elk bericht hoe dan ook bereikbaar is.
 *
 * Gedeeld om dezelfde reden als de titels hierboven: de Worker lost een
 * binnenkomend adres hiermee op, de app lost hetzelfde adres in de browser op,
 * en die twee moeten het over elk bericht eens zijn.
 */
export function slugify(waarde: string): string {
  const slug = waarde
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 64)
    .replace(/^-+|-+$/g, '');
  return slug || 'bericht';
}

/** Kort af tot wat een zoekresultaat of een linkvoorbeeld werkelijk toont. */
export function kort(waarde: string, max = 165): string {
  const tekst = waarde.replace(/\s+/g, ' ').trim();
  if (tekst.length <= max) return tekst;
  const snee = tekst.slice(0, max);
  const spatie = snee.lastIndexOf(' ');
  return `${(spatie > max * 0.6 ? snee.slice(0, spatie) : snee).replace(/[.,;:]$/, '')}…`;
}
