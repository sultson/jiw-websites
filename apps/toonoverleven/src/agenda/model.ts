import type { Activiteit, AgendaBron, Categorie } from '../content/types';

/**
 * De agenda rekenen.
 *
 * In het beheer staat de wekelijkse inloop als één regel met "elke week"
 * erop. Hier worden daar de losse donderdagen uit gerekend, zodat de rest van
 * de site met gewone activiteiten kan werken en niemand tweeënvijftig keer
 * hetzelfde hoeft in te voeren.
 *
 * Geen DOM en geen React: dit is rekenwerk, en de Worker mag het ook gebruiken.
 */

export const MAANDEN = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
];

export const DAGEN = [
  'zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag',
];

/** Maandag eerst, want zo staat een kalender in Nederland. */
export const WEEKKOPPEN = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];

export const maandNaam = (d: Date) => MAANDEN[d.getMonth()];
export const dagNaam = (d: Date) => DAGEN[d.getDay()];

/**
 * Waar een activiteit op lijkt als er in het beheer geen foto bij staat.
 *
 * Een kaart zonder beeld valt in een rij met beeld door de mand, en van de
 * meeste activiteiten bestaat geen foto. Dit is dus geen versiering maar de
 * ondergrens: per soort activiteit één sfeerbeeld, zodat een rij kaarten er
 * hetzelfde uitziet ook als er nog niets is gefotografeerd.
 */
export const CATEGORIE_FOTO: Record<Categorie, string> = {
  Inloop: '/img/sfeer-koffie.jpg',
  Creatief: '/img/sfeer-creatief.jpg',
  Bewegen: '/img/sfeer-wandeling.jpg',
  Wellness: '/img/sfeer-meditatie.jpg',
  Overig: '/img/sfeer-huiskamer.jpg',
};

/** Elke categorie krijgt een kleur uit het logo. */
export const CATEGORIE_STIJL: Record<Categorie, { vlak: string; stip: string; rand: string }> = {
  Inloop: { vlak: 'bg-teal/12 text-teal-tekst', stip: 'bg-teal', rand: 'border-teal/30' },
  Creatief: { vlak: 'bg-zand text-groen', stip: 'bg-[#c9a227]', rand: 'border-[#c9a227]/35' },
  Bewegen: { vlak: 'bg-salie/45 text-groen', stip: 'bg-salie-diep', rand: 'border-salie-diep/35' },
  Wellness: { vlak: 'bg-mint/50 text-groen', stip: 'bg-[#6aa79b]', rand: 'border-[#6aa79b]/35' },
  Overig: { vlak: 'bg-groen/10 text-groen', stip: 'bg-groen', rand: 'border-groen/25' },
};

/** "2026-09-03" plus "10:00" wordt lokale tijd in Zeewolde, niet UTC. */
export function leesDatum(iso: string, tijd?: string): Date {
  const [jaar, maand, dag] = iso.split('-').map(Number);
  const [uur, minuut] = (tijd ?? '00:00').split(':').map(Number);
  return new Date(jaar, (maand || 1) - 1, dag || 1, uur || 0, minuut || 0, 0, 0);
}

/** Een datum als 2026-09-03, de vorm waarin het beheer datums bewaart. */
export function datumSleutel(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const zelfdeDag = (a: Date, b: Date) => datumSleutel(a) === datumSleutel(b);

const middernacht = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const plusDagen = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/**
 * De hoeveelste keer die weekdag in zijn maand is: 3 september is de eerste
 * donderdag, 17 september de derde. Daarop herhaalt "elke maand" zich, want zo
 * staat het in hun agenda ("elke derde donderdag").
 */
const hoeveelste = (d: Date) => Math.floor((d.getDate() - 1) / 7) + 1;

/** De n-de weekdag van een maand, of niets als die maand er maar vier heeft. */
function nDeWeekdag(jaar: number, maand: number, weekdag: number, n: number): Date | null {
  const eerste = new Date(jaar, maand, 1);
  const schuif = (weekdag - eerste.getDay() + 7) % 7;
  const dag = 1 + schuif + (n - 1) * 7;
  const datum = new Date(jaar, maand, dag);
  return datum.getMonth() === maand ? datum : null;
}

/** Hoe lang een reeks zonder einddatum vooruit blijft lopen. */
const JAAR_VOORUIT = 12;

/**
 * Alle keren dat de regels in het beheer plaatsvinden, binnen een venster.
 *
 * Het venster is er om twee redenen: een wekelijkse reeks zonder einddatum
 * loopt anders eindeloos door, en de agendapagina laat sowieso een beperkte
 * periode zien.
 */
export function expandeer(bronnen: AgendaBron[], vanaf: Date, tot: Date): Activiteit[] {
  const start = middernacht(vanaf);
  const eindVenster = middernacht(tot);
  const uit: Activiteit[] = [];

  for (const bron of bronnen) {
    const overslaan = new Set(bron.overslaan);

    // Een mededeling is één blok van dag tot dag, niet iets dat zich herhaalt.
    if (bron.soort === 'mededeling') {
      const van = leesDatum(bron.datum);
      const totEnMet = leesDatum(bron.totDatum ?? bron.datum);
      const eind = new Date(totEnMet.getFullYear(), totEnMet.getMonth(), totEnMet.getDate(), 23, 59);
      if (eind >= start && van <= eindVenster) uit.push(maak(bron, van, eind));
      continue;
    }

    const eerste = leesDatum(bron.datum);
    const grens = bron.herhaalTot
      ? leesDatum(bron.herhaalTot)
      : new Date(start.getFullYear(), start.getMonth() + JAAR_VOORUIT, start.getDate());
    const laatste = grens < eindVenster ? grens : eindVenster;

    const datums: Date[] = [];
    if (bron.herhaling === 'eenmalig') {
      datums.push(eerste);
    } else if (bron.herhaling === 'maandelijks') {
      const weekdag = eerste.getDay();
      const welke = hoeveelste(eerste);
      // Vanaf de eerste keer, maand voor maand, tot de reeks ophoudt.
      for (let m = 0; m < JAAR_VOORUIT * 2 + 1; m += 1) {
        const kandidaat = nDeWeekdag(
          eerste.getFullYear(),
          eerste.getMonth() + m,
          weekdag,
          welke,
        );
        if (!kandidaat) continue;
        if (kandidaat > laatste) break;
        datums.push(kandidaat);
      }
    } else {
      const stap = bron.herhaling === 'tweewekelijks' ? 14 : 7;
      for (let dag = eerste; dag <= laatste; dag = plusDagen(dag, stap)) datums.push(dag);
    }

    for (const datum of datums) {
      if (datum > eindVenster) continue;
      if (overslaan.has(datumSleutel(datum))) continue;
      const van = leesDatum(datumSleutel(datum), bron.heleDag ? '00:00' : bron.begintijd);
      const eind = bron.heleDag
        ? new Date(datum.getFullYear(), datum.getMonth(), datum.getDate(), 23, 59)
        : leesDatum(datumSleutel(datum), bron.eindtijd ?? bron.begintijd ?? '00:00');
      // Wat voorbij is hoort niet meer in de agenda, maar wat vandaag nog
      // loopt wel: iemand die om elf uur kijkt kan er nog naartoe.
      if (eind < vanaf) continue;
      uit.push(maak(bron, van, eind));
    }
  }

  return uit.sort((a, b) => a.start.getTime() - b.start.getTime());
}

function maak(bron: AgendaBron, start: Date, eind: Date): Activiteit {
  return {
    id: `${bron.id}-${datumSleutel(start)}`,
    bronId: bron.id,
    soort: bron.soort,
    titel: bron.titel,
    categorie: bron.categorie,
    omschrijving: bron.omschrijving,
    img: bron.img,
    herhaling: bron.herhaling,
    start,
    eind,
    heleDag: bron.heleDag,
    aanmelden: bron.aanmelden,
    bijdrage: bron.bijdrage,
    locatie: bron.locatie,
  };
}

/**
 * Elke activiteit één keer, met zijn eerstvolgende keer.
 *
 * De wekelijkse inloop komt er anders tweeënvijftig keer in te staan, en dan
 * is een lijst met "wat is er te doen" een lijst met donderdagen. Wie een
 * bepaalde dag wil zien, kiest die in de kalender; daar hoort de volle lijst.
 */
export function perActiviteit(lijst: Activiteit[]): Activiteit[] {
  const gezien = new Set<string>();
  return lijst.filter((a) => {
    if (gezien.has(a.bronId)) return false;
    gezien.add(a.bronId);
    return true;
  });
}

const HOEVEELSTE = ['', 'eerste', 'tweede', 'derde', 'vierde', 'vijfde'];

/**
 * Hoe vaak iets terugkomt, in de woorden waarin ze het zelf zeggen: "elke
 * donderdag", "elke derde donderdag van de maand". Bij iets dat maar één keer
 * is, is er niets te zeggen en komt er niets terug.
 *
 * Dit is wat er op een kaart hoort te staan in plaats van tweeënvijftig keer
 * dezelfde donderdag onder elkaar.
 */
export function ritme(a: Activiteit): string | undefined {
  switch (a.herhaling) {
    case 'wekelijks':
      return `Elke ${dagNaam(a.start)}`;
    case 'tweewekelijks':
      return `Om de week op ${dagNaam(a.start)}`;
    case 'maandelijks':
      return `Elke ${HOEVEELSTE[hoeveelste(a.start)]} ${dagNaam(a.start)} van de maand`;
    default:
      return undefined;
  }
}

/**
 * Hoe laat iets is, in gewone woorden. Loopt het over meer dan een dag, dan is
 * de einddatum het nieuws en niet de begintijd: een vakantiesluiting als
 * "0:00 tot 23:59" zegt niemand iets.
 */
export function tijdvak(a: Activiteit): string {
  if (!zelfdeDag(a.start, a.eind)) {
    return `tot en met ${a.eind.getDate()} ${maandNaam(a.eind)}`;
  }
  if (a.heleDag) return 'hele dag';
  const tijd = (d: Date) => `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${tijd(a.start)} tot ${tijd(a.eind)}`;
}

/** Alleen de begintijd, voor de smalle kaartjes en de kalender. */
export const beginTijd = (a: Activiteit): string =>
  a.heleDag ? 'hele dag' : `${a.start.getHours()}:${String(a.start.getMinutes()).padStart(2, '0')}`;

/** Een mededeling die nu loopt, bijvoorbeeld de vakantiesluiting. */
export function lopendeMelding(lijst: Activiteit[]): Activiteit | undefined {
  const nu = Date.now();
  return lijst.find(
    (a) => a.soort === 'mededeling' && a.start.getTime() <= nu && a.eind.getTime() >= nu,
  );
}

/** De eerstvolgende activiteit waar iemand nog naartoe kan. */
export function eerstvolgende(lijst: Activiteit[]): Activiteit | undefined {
  const nu = Date.now();
  return lijst.find((a) => a.soort === 'activiteit' && a.eind.getTime() > nu);
}

/* ------------------------------------------------------------------ */
/*  In je eigen agenda zetten                                          */
/* ------------------------------------------------------------------ */

const pad2 = (n: number) => String(n).padStart(2, '0');

const icsDatum = (d: Date) =>
  `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`;

const icsMoment = (d: Date) => `${icsDatum(d)}T${pad2(d.getHours())}${pad2(d.getMinutes())}00`;

/**
 * Een regel in een .ics mag 75 tekens lang zijn; wat langer is gaat door op de
 * volgende regel die met een spatie begint. Agenda's die dat niet zien, kappen
 * de omschrijving af halverwege een zin.
 */
function vouw(regel: string): string {
  if (regel.length <= 74) return regel;
  const stukken = [regel.slice(0, 74)];
  for (let i = 74; i < regel.length; i += 73) stukken.push(` ${regel.slice(i, i + 73)}`);
  return stukken.join('\r\n');
}

const ontsnap = (waarde: string) =>
  waarde.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/**
 * De tijdzone erbij, en niet stilletjes de tijd van de bezoeker gebruiken. Wie
 * dit bestand in Duitsland opent, hoort de activiteit op de Nederlandse klok in
 * zijn agenda te krijgen en niet een uur ernaast.
 */
const TIJDZONE = [
  'BEGIN:VTIMEZONE',
  'TZID:Europe/Amsterdam',
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:+0100',
  'TZOFFSETTO:+0200',
  'TZNAME:CEST',
  'DTSTART:19700329T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:+0200',
  'TZOFFSETTO:+0100',
  'TZNAME:CET',
  'DTSTART:19701025T030000',
  'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
];

/** Eén activiteit als .ics, klaar om te openen in Agenda, Outlook of Google. */
export function ics(a: Activiteit, opts: { url: string; plaats: string }): string {
  const regels = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Toon over Leven//Agenda//NL',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...(a.heleDag ? [] : TIJDZONE),
    'BEGIN:VEVENT',
    `UID:${a.id}@toonoverleven.nl`,
    // Zonder tijdstempel weigeren sommige agenda's het bestand. De begintijd
    // van de activiteit is een stempel die niet van de klok van de bezoeker
    // afhangt, dus het bestand blijft bij elke download hetzelfde.
    `DTSTAMP:${icsMoment(a.start)}Z`,
    ...(a.heleDag
      ? [
          `DTSTART;VALUE=DATE:${icsDatum(a.start)}`,
          `DTEND;VALUE=DATE:${icsDatum(plusDagen(a.eind, 1))}`,
        ]
      : [
          `DTSTART;TZID=Europe/Amsterdam:${icsMoment(a.start)}`,
          `DTEND;TZID=Europe/Amsterdam:${icsMoment(a.eind)}`,
        ]),
    vouw(`SUMMARY:${ontsnap(a.titel)}`),
    vouw(`LOCATION:${ontsnap(a.locatie || opts.plaats)}`),
    vouw(
      `DESCRIPTION:${ontsnap(
        [a.omschrijving, a.aanmelden ? 'Aanmelden nodig.' : '', opts.url]
          .filter(Boolean)
          .join('\n\n'),
      )}`,
    ),
    `URL:${opts.url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `${regels.join('\r\n')}\r\n`;
}

/** Een nette bestandsnaam: toon-overleven-inloopochtend-3-september.ics */
export function icsBestandsnaam(a: Activiteit): string {
  const naam = a.titel
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `toon-overleven-${naam || 'activiteit'}-${datumSleutel(a.start)}.ics`;
}
