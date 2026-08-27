import type { Actie, Blok, Pagina, Tekst } from './index';
import type { Teksten } from '../content/types';

/**
 * De bevestigde feiten, over de vastgestelde pagina's heen.
 *
 * De mock-up is geschreven voordat het bestuur de gegevens had bevestigd.
 * Daarom staat er op sommige plekken nog een voorbehoud waar wij het antwoord
 * inmiddels wél hebben: dat de inloop elke donderdag van 10:00 tot 12:00 is,
 * dat hij niets kost, en dat er geen verwijzing bij hoeft. Die zinnen worden
 * hier vervangen door wat er werkelijk waar is.
 *
 * Twee regels gelden overal in dit bestand. Alleen vervangen waar er een bron
 * voor is, in content/defaults.ts of in het materiaal van de klant zelf; waar
 * de mock-up het al goed zegt, blijft de zin staan zoals het bestuur hem heeft
 * goedgekeurd. En alles wat in de loop van de tijd verandert (een tijd, een
 * bedrag, een vakantie) komt uit het beheer en niet uit deze code.
 *
 * Zuiver rekenwerk: dezelfde pagina erin geeft dezelfde pagina eruit, en er
 * wordt niets aangeraakt. Dit draait ook in de Worker.
 */

/* ------------------------------------------------------------------ */
/*  Gegevens die niet veranderen                                       */
/* ------------------------------------------------------------------ */

/*
 * Het nummer, het mailadres en de inschrijving staan ook in ui.tsx, voor de
 * kop en de voettekst. Ze staan hier opnieuw omdat dit bestand ook binnen de
 * Worker draait, en daar mag geen React naar binnen komen.
 */
const TEL = '036-8450265';
const MAIL = 'info@toonoverleven.nl';
const KVK = '32143598';
const RSIN = '820209685';
const STICHTING = 'Stichting Toon Hermans Huis Zeewolde';
const ROUTE =
  'https://www.google.com/maps/search/?api=1&query=Mazerhard+37,+3891+BR+Zeewolde';

/* ------------------------------------------------------------------ */
/*  Wat een herschrijving is                                           */
/* ------------------------------------------------------------------ */

/** Een alinea: gewone tekst, of losse stukjes met iets vets of een link erin. */
type Zin = string | Tekst;

/** Wat er aan één blok verandert zodra de feiten eroverheen gaan. */
type Wijziging = {
  kop?: string;
  /** Komt in de plaats van alle alinea's die er staan. */
  tekst?: Zin[];
  /** Komt onder de alinea's die er al staan. */
  erbij?: Zin[];
  /** Hoeveel alinea's er achteraan vervallen voordat `erbij` erbij komt. */
  korten?: number;
  punten?: Zin[];
  acties?: Actie[];
  /** Alleen in een kennisblok: de inleiding, de kaarten en het kader. */
  intro?: Zin;
  inzichten?: Record<string, Zin[]>;
  grens?: Zin[];
};

/** Wat er aan één pagina verandert. */
type Herschrijving = {
  /** De inleiding onder de titel, als die iets zegt wat we nu beter weten. */
  lead?: Zin;
  /** De blokken, op het id dat ze in de mock-up al hadden. */
  blokken?: Record<string, Wijziging>;
};

const alinea = (zin: Zin): Tekst => (typeof zin === 'string' ? [zin] : zin);

const alineas = (zinnen: Zin[]): Tekst[] => zinnen.map(alinea);

const plat = (tekst: Tekst): string =>
  tekst.map((stuk) => (typeof stuk === 'string' ? stuk : stuk.tekst)).join('');

/** Een adres van twee regels, op één regel, voor een kop of een opsomming. */
const opEenRegel = (waarde: string): string =>
  waarde
    .split('\n')
    .map((regel) => regel.trim())
    .filter(Boolean)
    .join(', ');

/**
 * Een opsomming zoals de mock-up ze schrijft: puntkomma's tussendoor en een
 * punt aan het eind. Zo blijft een lijst die wij aanvullen er hetzelfde
 * uitzien als de lijsten ernaast.
 */
const opsomming = (regels: string[]): string[] =>
  regels.map((regel, i) => `${regel}${i === regels.length - 1 ? '.' : ';'}`);

/**
 * Een naam met zijn rol erachter, zoals de mock-up het bestuur opsomt. Alleen
 * de eerste letter gaat omlaag: "Voorzitter" wordt "voorzitter", maar in
 * "burgemeester van Zeewolde" blijft Zeewolde staan zoals het hoort.
 */
const metRol = (mensen: { naam: string; rol: string }[]): string[] =>
  opsomming(mensen.map(({ naam, rol }) => `${naam}, ${rol.charAt(0).toLowerCase()}${rol.slice(1)}`));

/* ------------------------------------------------------------------ */
/*  Blokken die op meer dan één pagina staan                           */
/* ------------------------------------------------------------------ */

/**
 * Het kennisblok onder de vier praktische pagina's. In de mock-up staat er een
 * aantekening voor de bouwers in ("controleer vóór livegang openingstijden,
 * contactgegevens, kosten en toegankelijkheid"). Dat is nagekeken, dus er
 * staat nu wat een bezoeker eraan heeft.
 */
const PRAKTISCH_KENNISBLOK: Wijziging = {
  intro:
    'Praktische duidelijkheid helpt om te beslissen of je wilt komen. Je mag eerst lezen, eerst bellen, of iemand meenemen die je vertrouwt.',
  grens: ['Je hoeft je niet aan te melden, je hebt geen verwijzing nodig, en de inloop kost niets.'],
};

/**
 * Hetzelfde kennisblok onder de vier pagina's over de organisatie. Daar stond
 * dat namen en formele gegevens pas getoond worden nadat het bestuur ze heeft
 * bevestigd. Dat is gebeurd, en wat er nu staat is die bevestiging zelf.
 */
const ORGANISATIE_KENNISBLOK: Wijziging = {
  inzichten: {
    'Duidelijk over rollen': [
      'Je ontmoet vrijwilligers en bestuursleden. Niemand binnen de stichting is in loondienst.',
    ],
  },
  grens: [
    'Toon over Leven is aangesloten bij IPSO, de landelijke koepel van centra voor leven met en na kanker. De stichting is een ANBI en publiceert haar beleidsplan en jaarstukken.',
  ],
};

/* ------------------------------------------------------------------ */
/*  Per pagina                                                         */
/* ------------------------------------------------------------------ */

const HERSCHRIJVINGEN: Record<string, (teksten: Teksten) => Herschrijving> = {
  /* ---- Praktisch ------------------------------------------------- */

  '/praktisch': () => ({
    blokken: {
      'snel-antwoord-of-contact': {
        tekst: [
          'Bekijk de veelgestelde vragen. Staat je onderwerp er niet bij, neem dan contact op.',
        ],
      },
      kennis: PRAKTISCH_KENNISBLOK,
    },
  }),

  '/praktisch/eerste-keer': () => ({ blokken: { kennis: PRAKTISCH_KENNISBLOK } }),

  '/praktisch/zo-werkt-toon-over-leven': () => ({ blokken: { kennis: PRAKTISCH_KENNISBLOK } }),

  '/praktisch/openingstijden': ({ praktisch }) => ({
    blokken: {
      inloopochtend: {
        tekst: [
          praktisch.openingstijden.ochtend,
          'Je hoeft je niet aan te melden en je hebt geen verwijzing nodig. Je belt aan en je bent binnen.',
        ],
      },
      inloopavond: { tekst: [praktisch.openingstijden.avond] },
      'vakanties-en-tijdelijke-afwijkingen': { tekst: [praktisch.openingstijden.afwijkingen] },
    },
  }),

  '/praktisch/kosten': ({ praktisch }) => ({
    lead: 'De inloop kost niets. Voor een workshop vragen we een bijdrage, en wat die is staat bij de activiteit in de agenda.',
    blokken: {
      'kosten-van-een-activiteit': { tekst: [praktisch.kosten.activiteiten] },
      'inloop-en-andere-vormen-van-bezoek': {
        tekst: [praktisch.kosten.inloop, praktisch.kosten.drempel],
      },
    },
  }),

  '/praktisch/locatie-en-bereikbaarheid': ({ praktisch }) => ({
    blokken: {
      // De kaart heeft in de mock-up geen id: hij is er één per pagina en gaat
      // daarom op zijn soort.
      'kaart-plek': {
        kop: opEenRegel(praktisch.locatie.adres),
        tekst: [],
        acties: [{ label: 'Open de route', href: ROUTE, soort: 'hoofd' }],
      },
      'plan-je-route': {
        tekst: [praktisch.locatie.route, praktisch.locatie.parkeren],
        acties: [{ label: 'Open de route', href: ROUTE, soort: 'hoofd' }],
      },
      'ingang-en-toegankelijkheid': { tekst: [praktisch.locatie.ingang] },
      'een-activiteit-op-een-andere-plek': { tekst: [praktisch.locatie.elders] },
    },
  }),

  '/praktisch/contact': ({ praktisch }) => ({
    blokken: {
      bellen: { erbij: [praktisch.contact.wieReageert] },
      'e-mailen': { erbij: [praktisch.contact.watGebeurtEr, praktisch.contact.reactietijd] },
      langskomen: {
        tekst: [
          opEenRegel(praktisch.locatie.adres),
          praktisch.openingstijden.ochtend,
          praktisch.openingstijden.avond,
        ],
      },
    },
  }),

  '/praktisch/vragen-over-een-bezoek': ({ praktisch }) => ({
    blokken: {
      'wat-kost-een-bezoek-of-activiteit': {
        tekst: [praktisch.kosten.inloop, praktisch.kosten.activiteiten],
      },
      kennis: PRAKTISCH_KENNISBLOK,
    },
  }),

  '/praktisch/vragen/wat-kost-een-bezoek-of-activiteit': ({ praktisch }) => ({
    lead: 'De inloop kost niets. Voor een workshop vragen we een bijdrage, en wat die is staat bij de activiteit in de agenda.',
    blokken: {
      'wat-moet-bij-een-activiteit-staan': {
        kop: 'Wat staat er bij een activiteit?',
        tekst: ['Bij ieder moment in de agenda staat:'],
        punten: opsomming([
          'of deelname gratis is',
          'welke bijdrage we vragen',
          'of je je van tevoren moet aanmelden',
        ]),
      },
      'laat-kosten-geen-onverwachte-drempel-worden': {
        tekst: [
          praktisch.kosten.drempel,
          'Bellen of mailen kan ook als je alleen een praktische vraag hebt.',
        ],
      },
    },
  }),

  // Het voorbehoud stond in een eigen alinea, dus dat kan er los af.
  '/praktisch/vragen/heb-ik-een-verwijzing-nodig': () => ({
    lead: 'Voor een bezoek aan de inloop heb je geen verwijzing van een huisarts of ziekenhuis nodig. Je kunt zelf contact opnemen of gewoon binnenlopen.',
    blokken: { 'verwijzen-mag-wel': { korten: 1 } },
  }),

  /* ---- Over ons -------------------------------------------------- */

  '/over-ons': () => ({ blokken: { kennis: ORGANISATIE_KENNISBLOK } }),

  '/over-ons/wie-wij-zijn': ({ naam }) => ({
    blokken: {
      'een-plek-in-zeewolde': {
        erbij: [
          'We zitten aan het Mazerhard 37, in een woonhuis met een huiskamer, een grote tafel en een tuin. Bewust geen kantoor en geen instelling.',
        ],
      },
      'naam-en-organisatie': {
        tekst: [
          ...naam.alineas,
          naam.slot,
          `De stichting heet ${STICHTING}. De formele gegevens staan op Organisatie en verantwoording.`,
        ],
      },
      kennis: ORGANISATIE_KENNISBLOK,
    },
  }),

  '/over-ons/onze-mensen': ({ verantwoording }) => ({
    blokken: {
      'wie-je-als-bezoeker-ontmoet': {
        erbij: [
          'Iedere gastheer en gastvrouw volgt eerst een basistraining van IPSO, de landelijke koepel van inloophuizen. Er is altijd iemand met wie je kunt overleggen.',
        ],
      },
      // De opsomming komt onder alle alinea's, dus de regel met de dubbele
      // punt hoort de laatste te zijn. In de mock-up stond hij bovenaan en
      // hing hij in de lucht.
      'het-bestuur': {
        tekst: [
          'Het bestuur is verantwoordelijk voor de koers, continuïteit en verantwoording van de stichting. Formele gegevens en documenten staan op Organisatie en verantwoording.',
          'Het bestuur bestaat uit:',
        ],
        punten: metRol(verantwoording.bestuur),
      },
    },
  }),

  '/over-ons/onze-werkwijze': () => ({
    blokken: {
      'voorbereide-vrijwilligers': {
        tekst: [
          'Vrijwilligers werken samen en krijgen begeleiding bij hun rol. Iedere gastheer en gastvrouw volgt eerst een basistraining van drie dagen via IPSO, die wij verzorgen en betalen.',
        ],
      },
      kennis: ORGANISATIE_KENNISBLOK,
    },
  }),

  '/over-ons/organisatie-en-verantwoording': ({ verantwoording, praktisch }) => ({
    blokken: {
      organisatiegegevens: {
        tekst: [
          `De stichting achter Toon over Leven is ${STICHTING}. Sinds 1 juli 2026 gaat het huis naar buiten toe verder als Toon over Leven. In formele stukken en bij een donatie kom je de oude naam nog tegen.`,
        ],
        punten: [
          [{ tekst: 'Statutaire naam:' }, ` ${STICHTING}`],
          [{ tekst: 'Publieksnaam:' }, ' Toon over Leven'],
          [{ tekst: 'Adres:' }, ` ${opEenRegel(praktisch.locatie.adres)}`],
          [{ tekst: 'KvK-nummer:' }, ` ${KVK}`],
          [{ tekst: 'RSIN of fiscaal nummer:' }, ` ${RSIN}`],
          [
            { tekst: 'ANBI:' },
            ' de stichting is aangemerkt als algemeen nut beogende instelling, dus een gift is onder voorwaarden aftrekbaar van de belasting.',
          ],
        ],
      },
      'bestuur-en-toezicht-of-advies': {
        tekst: [
          'Het bestuur is verantwoordelijk voor de koers en de continuïteit van de stichting. Wie erin zitten, staat op Onze mensen.',
          verantwoording.beloning,
          'Daarnaast is er een raad van advies:',
        ],
        punten: metRol(verantwoording.advies),
      },
    },
  }),

  '/over-ons/vrijwilliger-worden': ({ vrijwilliger }) => ({
    blokken: {
      'wat-kun-je-doen': {
        tekst: [
          'Er is niemand in loondienst: het huis draait volledig op vrijwilligers. Zij kunnen onder meer:',
        ],
        punten: opsomming([
          'bezoekers ontvangen als gastheer of gastvrouw',
          'koffie en thee verzorgen',
          'ondersteunen bij activiteiten',
          'helpen met praktische werkzaamheden in het huis',
          'meedenken of meewerken achter de schermen',
          'met de kraam op markten en evenementen staan',
        ]),
      },
      'gastheer-of-gastvrouw': {
        korten: 1,
        erbij: [
          'Er hoort een basistraining van drie dagen bij, die wij verzorgen en betalen. Die training komt van IPSO, de landelijke koepel van inloophuizen.',
        ],
      },
      interesse: { tekst: [vrijwilliger.uitnodiging] },
    },
  }),

  /* ---- Voor verwijzers ------------------------------------------- */


  /* ---------------------------------------------------------------- */
  /*  Zinnen die over het voorstel gingen in plaats van over het huis  */
  /* ---------------------------------------------------------------- */

  /*
   * De mock-up is geschreven om beoordeeld te worden, en op een handvol plekken
   * staat dat er ook: dat de kaartopzet af is, dat de definitieve pagina nog
   * partners moet tonen, dat er in de mock-up geen ervaringen worden verzonnen.
   * Een bezoeker die net van de dokter komt heeft daar niets aan; die leest
   * hieronder wat er werkelijk staat te gebeuren.
   */

  '/activiteiten/agenda': () => ({
    blokken: {
      verkenner: {
        intro:
          'Filter op thema of op voor wie iets bedoeld is, of kies een dag in de kalender. Bij ieder moment staan de volledige datum, de tijd, de plek, de kosten en hoe je je aanmeldt.',
      },
    },
  }),

  '/activiteiten/alle-activiteiten': () => ({
    blokken: {
      verkenner: {
        intro:
          'Per activiteit lees je wat je kunt verwachten en hoe vaak hij terugkomt. De concrete datums en tijden staan in de agenda.',
      },
    },
  }),

  '/activiteiten/per-thema/herstel-en-energie': () => ({
    lead: 'Tijdens of na een behandeling kan je energie anders zijn dan je gewend was. Misschien wil je rustig iets doen, andere mensen ontmoeten of informatie vinden die bij deze periode past.',
    blokken: {
      kennis: {
        grens: [
          'Bij ieder moment in de agenda staat wat de activiteit inhoudt en wie erbij is. Weet je niet of het aansluit bij hoeveel energie je nu hebt, bel of mail dan even, dan denken we mee.',
        ],
      },
    },
  }),

  '/activiteiten/per-thema/relaties-en-gezin': () => ({
    lead: 'Kanker raakt vaak meer mensen dan degene die ziek is. Partners, ouders, kinderen en andere gezinsleden kunnen ieder hun eigen vragen hebben. Bij ieder moment in de agenda staat voor wie het bedoeld is.',
    blokken: {
      'voor-wie-is-een-activiteit-bedoeld': { tekst: ['Lees bij ieder moment zorgvuldig:'] },
    },
  }),

  '/ervaringen': () => ({ blokken: { kennis: { grens: ['Toon over Leven publiceert alleen echte verhalen van bezoekers, en alleen als diegene daar toestemming voor geeft. Er wordt hier nooit een ervaring bedacht of door een computer ingevuld.'] } } }),

  '/ervaringen/echte-vragen': () => ({ blokken: { kennis: { grens: ['Toon over Leven publiceert alleen echte verhalen van bezoekers, en alleen als diegene daar toestemming voor geeft. Er wordt hier nooit een ervaring bedacht of door een computer ingevuld.'] } } }),

  '/ervaringen/verhalen-van-bezoekers': () => ({
    blokken: { echtheid: { tekst: ['Een verzonnen verhaal zou overtuigend kunnen klinken, maar het is niet de ervaring van een bezoeker. Daarom staat hier pas iets zodra iemand die hier zelf geweest is zijn verhaal vertelt en er toestemming voor geeft.'] }, kennis: { grens: ['Toon over Leven publiceert alleen echte verhalen van bezoekers, en alleen als diegene daar toestemming voor geeft. Er wordt hier nooit een ervaring bedacht of door een computer ingevuld.'] } },
  }),

  '/ervaringen/jong-en-kanker': () => ({
    blokken: { echtheid: { tekst: ['Een verzonnen verhaal zou overtuigend kunnen klinken, maar het is niet de ervaring van een bezoeker. Daarom staat hier pas iets zodra iemand die hier zelf geweest is zijn verhaal vertelt en er toestemming voor geeft.'] }, kennis: { grens: ['Toon over Leven publiceert alleen echte verhalen van bezoekers, en alleen als diegene daar toestemming voor geeft. Er wordt hier nooit een ervaring bedacht of door een computer ingevuld.'] } },
  }),

  '/ervaringen/naasten': () => ({
    blokken: { echtheid: { tekst: ['Een verzonnen verhaal zou overtuigend kunnen klinken, maar het is niet de ervaring van een bezoeker. Daarom staat hier pas iets zodra iemand die hier zelf geweest is zijn verhaal vertelt en er toestemming voor geeft.'] }, kennis: { grens: ['Toon over Leven publiceert alleen echte verhalen van bezoekers, en alleen als diegene daar toestemming voor geeft. Er wordt hier nooit een ervaring bedacht of door een computer ingevuld.'] } },
  }),

  '/ervaringen/leven-na-behandeling': () => ({
    blokken: { echtheid: { tekst: ['Een verzonnen verhaal zou overtuigend kunnen klinken, maar het is niet de ervaring van een bezoeker. Daarom staat hier pas iets zodra iemand die hier zelf geweest is zijn verhaal vertelt en er toestemming voor geeft.'] }, kennis: { grens: ['Toon over Leven publiceert alleen echte verhalen van bezoekers, en alleen als diegene daar toestemming voor geeft. Er wordt hier nooit een ervaring bedacht of door een computer ingevuld.'] } },
  }),

  '/over-ons/samenwerkingspartners': () => ({
    blokken: {
      kennis: ORGANISATIE_KENNISBLOK,
      'wat-komt-hier-te-staan': {
        kop: 'Met wie werken we samen?',
        tekst: [
          'Toon over Leven is aangesloten bij IPSO, de landelijke koepel van centra voor leven met en na kanker. Daarnaast werken we in Zeewolde samen met huisartsen, het ziekenhuis, de gemeente en lokale ondernemers die het huis steunen.',
          'Wil je weten of we met een bepaalde organisatie samenwerken, bel of mail ons dan. De bedrijven en fondsen die het huis financieel mogelijk maken staan bij Steun ons.',
        ],
      },
    },
  }),

  '/over-ons/steun-ons': () => ({
    blokken: {
      'vriend-worden': {
        tekst: [
          'Wil je vaker bijdragen, dan kun je vriend van Toon over Leven worden met een terugkerende gift. Je bepaalt zelf het bedrag en hoe vaak, en je kunt er altijd mee stoppen. Bel of mail ons, dan regelen we het samen.',
        ],
      },
    },
  }),

  '/praktisch/vragen/wat-gebeurt-er-tijdens-een-eerste-bezoek': () => ({
    blokken: {
      'samen-komen': {
        tekst: [
          'Je kunt iemand meenemen die je vertrouwt: je partner, een familielid, een vriend. Dat hoef je niet vooraf te laten weten. Voor een groepsactiviteit kunnen andere voorwaarden gelden; dat staat dan bij het moment in de agenda.',
        ],
      },
    },
  }),

  '/voor-jou/contact-of-een-activiteit': () => ({
    blokken: {
      kennis: {
        grens: [
          `Bellen kan op ${TEL}, mailen op ${MAIL}. Er reageert altijd een mens, meestal binnen een dag. Loop je liever gewoon binnen, kijk dan bij de openingstijden.`,
        ],
      },
    },
  }),

  '/voor-verwijzers': ({ praktisch }) => ({
    blokken: {
      'iemand-wijzen-op-toon-over-leven': { erbij: [praktisch.verwijzers] },
      'terugkoppeling-en-privacy': {
        tekst: [
          'Terugkoppeling aan een verwijzer kan alleen binnen de geldende privacyafspraken en met toestemming van de bezoeker.',
        ],
      },
      'overleggen-met-toon-over-leven': {
        tekst: [
          'Wil je bespreken of Toon over Leven een passende aanvulling is, of afspraken maken over samenwerking?',
          ['Bel ', { tekst: TEL }, ' of mail ', { tekst: MAIL }, '.'],
        ],
      },
    },
  }),
};

/* ------------------------------------------------------------------ */
/*  Toepassen                                                          */
/* ------------------------------------------------------------------ */

/**
 * Waar een blok op aan te spreken is: het id dat het in de mock-up al had.
 * Blokken zonder id (de kaart met de plek, het kennisblok) staan er maar één
 * keer per pagina en gaan daarom op hun soort.
 */
const sleutelVan = (blok: Blok): string => ('id' in blok && blok.id ? blok.id : blok.soort);

const nieuweTekst = (huidig: Tekst[] | undefined, wijziging: Wijziging): Tekst[] | undefined => {
  if (wijziging.tekst) return alineas(wijziging.tekst);
  if (!wijziging.erbij && !wijziging.korten) return huidig;
  const blijft = wijziging.korten ? (huidig ?? []).slice(0, -wijziging.korten) : (huidig ?? []);
  return [...blijft, ...alineas(wijziging.erbij ?? [])];
};

function herschreven(blok: Blok, wijziging: Wijziging): Blok {
  if (blok.soort === 'kennis') {
    return {
      ...blok,
      ...(wijziging.intro ? { intro: alinea(wijziging.intro) } : {}),
      ...(wijziging.inzichten
        ? {
            inzichten: blok.inzichten?.map((kaart) => {
              const nieuw = wijziging.inzichten?.[kaart.kop];
              return nieuw ? { ...kaart, tekst: alineas(nieuw) } : kaart;
            }),
          }
        : {}),
      ...(wijziging.grens && blok.grens
        ? { grens: { ...blok.grens, tekst: alineas(wijziging.grens) } }
        : {}),
    };
  }

  if (blok.soort === 'verkenner') {
    return {
      ...blok,
      ...(wijziging.kop ? { kop: wijziging.kop } : {}),
      ...(wijziging.intro ? { intro: alinea(wijziging.intro) } : {}),
    };
  }

  if (blok.soort === 'echtheid') {
    return {
      ...blok,
      ...(wijziging.kop ? { kop: wijziging.kop } : {}),
      ...(wijziging.tekst ? { tekst: alineas(wijziging.tekst) } : {}),
    };
  }

  if (blok.soort === 'kaart-plek') {
    return {
      ...blok,
      kop: wijziging.kop ?? blok.kop,
      tekst: nieuweTekst(blok.tekst, wijziging) ?? blok.tekst,
      ...(wijziging.acties ? { acties: wijziging.acties } : {}),
    };
  }

  if (blok.soort !== 'tekst' && blok.soort !== 'kaarten') return blok;

  return {
    ...blok,
    ...(wijziging.kop ? { kop: wijziging.kop } : {}),
    tekst: nieuweTekst(blok.tekst, wijziging),
    ...(wijziging.punten ? { punten: alineas(wijziging.punten) } : {}),
    ...(wijziging.acties ? { acties: wijziging.acties } : {}),
  };
}

/** De vastgestelde pagina met de bevestigde feiten erin. */
export function metFeiten(pagina: Pagina, teksten: Teksten): Pagina {
  const schrijf = HERSCHRIJVINGEN[pagina.pad];
  if (!schrijf) return pagina;

  const herschrijving = schrijf(teksten);
  const blokken = pagina.blokken.map((blok) => {
    const wijziging = herschrijving.blokken?.[sleutelVan(blok)];
    return wijziging ? herschreven(blok, wijziging) : blok;
  });

  if (!herschrijving.lead) return { ...pagina, blokken };

  // De inleiding is ook de omschrijving in de zoekresultaten. Die horen niet
  // uit elkaar te lopen, dus ze veranderen samen.
  const lead = alinea(herschrijving.lead);
  return { ...pagina, omschrijving: plat(lead), blokken, hero: { ...pagina.hero, lead } };
}
