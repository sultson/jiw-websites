import { blokkenVanTekst, samenvatten } from './rich';
import type { AgendaBron, Bericht, Content, Sponsor, Teksten } from './types';
import sponsorenJson from '../sponsoren.json';
import socialsJson from '../socials.json';
import { slugify } from '../meta';

/**
 * De site zoals hij gebouwd is.
 *
 * Alles hieronder is waar de site op terugvalt als er helemaal geen inhoud uit
 * het beheer is: een storing bij Sanity waarvan de Worker ook geen eerdere
 * kopie meer heeft, of de ontwikkelserver. Een storing bij de CMS haalt het
 * inloophuis dus niet offline.
 *
 * Voor een los tekstveld geldt daarnaast: wat in het beheer leeg gelaten is,
 * houdt de tekst van hier, zodat een niet ingevuld vakje nooit een gat op de
 * pagina wordt. Voor lijsten, en voor de agenda, de berichten en de sponsoren,
 * geldt dat juist niet: wat het bestuur daar weghaalt is weg. Een bestuur dat
 * na verwijderen weer terugkomt, is een beheer dat niet luistert.
 *
 * Het is tegelijk de inhoud waarmee een verse dataset gevuld wordt (zie
 * studio/scripts/seed.ts), zodat de klant zijn eigen site in het beheer ziet
 * staan in plaats van lege formulieren.
 */

const teksten: Teksten = {
  naam: {
    alineas: [
      'Toon Hermans was een cabaretier die zijn vrouw aan kanker verloor. De eerste inloophuizen werden naar hem vernoemd, en hij heeft ontzettend veel voor huizen als het onze betekend. Maar wie jonger is dan veertig weet vaak niet meer wie hij was, en juist die groep willen we bereiken.',
      'Daarom heten we sinds 1 juli 2026 Toon over Leven. Een naam die zegt waar het hier over gaat: niet over de ziekte, maar over het leven dat doorgaat.',
    ],
    slot: 'Het adres, de mensen en de koffie blijven hetzelfde. Alleen de naam op het bordje is veranderd.',
  },
  vrijwilliger: {
    lead: 'We zoeken doorlopend nieuwe vrijwilligers. Er is niemand in loondienst, dus het huis draait volledig op mensen die er willen zijn.',
    rollen: [
      {
        kop: 'Gastvrouw of gastheer',
        tekst: 'Een huiskamer begint bij een warm welkom. Als gastheer of gastvrouw ben jij vaak het eerste gezicht dat iemand ziet. Je ontvangt gasten, schenkt koffie of thee en voelt aan wat iemand nodig heeft: een praatje, of juist even stilte.',
        punten: [
          'Vriendelijkheid en tact',
          'Goed kunnen luisteren',
          'Respect voor de manier waarop iemand met ziekte omgaat',
        ],
        slot: 'Geen medische taken, maar menselijke aandacht. Er hoort een basistraining van drie dagen bij, die wij verzorgen en betalen.',
      },
      {
        kop: 'Meewerken in het huis',
        tekst: 'Mensen die warmte willen bieden, respect hebben voor ieders verhaal en het fijn vinden om onderdeel te zijn van een betrokken team. Een zorgachtergrond is niet nodig. Wat telt is oprechte belangstelling en betrouwbaarheid.',
        punten: [
          'Ondersteunen bij activiteiten',
          'Helpen bij praktische zaken in het huis',
          'Meedenken en meewerken achter de schermen',
          'Met de kraam op markten en evenementen staan',
        ],
        slot: 'Je staat er nooit alleen voor. Je werkt samen met andere vrijwilligers en je krijgt begeleiding vanuit het inloopcentrum.',
      },
    ],
    uitnodiging: 'Bel of mail gerust eerst, ook als je nog helemaal niet zeker weet of dit bij je past. We maken graag kennis en laten je zien hoe het er op een donderdagochtend aan toegaat. Je zit nergens aan vast.',
  },
  steun: {
    anbi: 'Wij zijn een ANBI-stichting, dus je gift is onder voorwaarden aftrekbaar van de belasting. Niemand binnen de stichting ontvangt een beloning of salaris, dus je geld gaat naar de koffie, de materialen en het huis.',
    sponsorenTitel: 'Zeewolde houdt dit huis overeind',
    sponsorenTekst: 'Bedrijven, fondsen en ondernemers uit het dorp en daarbuiten dragen bij met geld, materialen of hun vak.',
  },
  verantwoording: {
    beloning: 'Binnen de stichting ontvangt niemand op enigerlei wijze een beloning of salaris. Kosten die iemand voor zijn functie maakt, kunnen worden gedeclareerd. De enige uitzondering die in de toekomst kan ontstaan is een deels betaalde coördinator, en dan alleen als die van elders wordt gefinancierd.',
    bestuur: [
      { naam: 'Henk de Vries', rol: 'Voorzitter' },
      { naam: 'Claudia van Deijck', rol: 'Secretaris' },
      { naam: 'Ron Wille', rol: 'Penningmeester' },
    ],
    advies: [
      { naam: 'Bram Harmsma', rol: 'burgemeester van Zeewolde' },
      { naam: 'Helma Lodders', rol: 'oud-wethouder en oud-Tweede Kamerlid' },
      { naam: 'Henk Krol', rol: 'journalist en voormalig Kamerlid' },
      { naam: 'Melianthe Nicolai', rol: 'uroloog en medisch seksuoloog, Antoni van Leeuwenhoek' },
    ],
  },
  contact: {
    formulierTitel: 'Stuur ons een bericht',
    formulierTekst: 'Je hoeft niet uit te leggen wat er speelt en je hoeft geen naam van een ziekte te noemen. Een berichtje met alleen je naam en de vraag of je een keer mag komen kijken is genoeg. Er reageert altijd een mens, meestal binnen een dag.',
  },
  praktisch: {
    openingstijden: {
      ochtend: 'Elke donderdag van 10:00 tot 12:00 uur.',
      avond: 'Elke derde donderdag van de maand van 19:30 tot 21:30 uur.',
      afwijkingen:
        'In de zomervakantie en de kerstvakantie is er geen inloop. Wanneer de deur weer opengaat, staat in de agenda.',
    },
    kosten: {
      inloop: 'De inloop en de wandelingen kosten niets.',
      activiteiten:
        'Voor een enkele workshop vragen we een bijdrage, en die ligt altijd onder wat je er elders voor betaalt. Wat een activiteit kost, staat erbij in de agenda.',
      drempel:
        'Is een bijdrage een drempel, zeg het gerust, dan zoeken we samen een oplossing.',
    },
    locatie: {
      adres: 'Mazerhard 37\n3891 BR Zeewolde',
      route:
        'Het huis staat in een woonwijk in Zeewolde. Zet Mazerhard 37 in je routeplanner voor de route met de auto, de fiets of het openbaar vervoer.',
      // Hoe het parkeren er ter plaatse uitziet, hebben zij ons niet verteld.
      // Dan staat er wat wél waar is: dat je het kunt vragen.
      parkeren: 'Wil je vooraf weten hoe het parkeren bij het huis werkt, bel dan even.',
      ingang:
        'Het is een gewoon woonhuis, geen instelling: je loopt er naar binnen zoals je bij iemand thuis binnenstapt. Wil je vooraf weten of het huis aansluit bij wat jij nodig hebt, bel dan even, dan bespreken we het voordat je vertrekt.',
      elders:
        'Een activiteit kan ergens anders plaatsvinden. Bij ieder moment in de agenda staat de locatie van die dag.',
    },
    contact: {
      wieReageert: 'Aan de telefoon en achter de mail zitten de vrijwilligers van het huis.',
      watGebeurtEr:
        'Je hoeft niet uit te leggen wat er speelt en je hoeft geen naam van een ziekte te noemen. Een bericht met alleen je naam en de vraag of je een keer mag komen kijken is genoeg.',
      reactietijd: 'Er reageert altijd een mens, meestal binnen een dag.',
    },
    verwijzers:
      'Er is geen verwijzing nodig en aanmelden hoeft niet. Iemand kan op een inloopmoment zo binnenlopen, en eerst bellen of mailen kan ook. Wij zijn aangesloten bij IPSO en werken met vrijwilligers die daarvoor een basistraining volgen.',
  },
};

/**
 * De agenda zoals hij nu loopt.
 *
 * Terugkerende dingen staan hier als één regel met een herhaling erop, precies
 * zoals ze in het beheer ingevoerd worden. Dat is meteen het voorbeeld: wie
 * hierna zelf iets toevoegt, ziet in het beheer hoe de wekelijkse inloop is
 * ingevuld en doet het na.
 *
 * De foto is een echte foto waar die bestaat (de huiskamer, de wandelgroep,
 * werk uit een workshop) en anders een sfeerbeeld zonder herkenbare mensen,
 * met dezelfde regels als in inhoud/beelden.ts. De seed en de backfill zetten
 * deze foto's ook in het beheer, zodat daar hetzelfde staat als op de kaart.
 * Een agendapunt zonder foto krijgt op de site het sfeerbeeld van zijn
 * categorie (agenda/model.ts); een mededeling heeft geen foto.
 */
const agenda: AgendaBron[] = [
  {
    id: 'inloopochtend',
    soort: 'activiteit',
    doelgroepen: ['iedereen'],
    themas: ['ontmoeten'],
    titel: 'Inloopochtend',
    categorie: 'Inloop',
    omschrijving:
      'De deur staat open voor wie even wil praten, een kopje koffie wil of gewoon ergens wil zijn. Aanmelden hoeft niet, je loopt zo naar binnen. Op de laatste donderdag van de maand geven we de inloop een creatief tintje: pak aan wat er op tafel ligt en stip, teken of schilder mee.',
    img: '/img/huis-binnen.jpg',
    datum: '2026-09-03',
    heleDag: false,
    begintijd: '10:00',
    eindtijd: '12:00',
    herhaling: 'wekelijks',
    overslaan: [],
    aanmelden: false,
    bijdrage: 'Gratis',
  },
  {
    id: 'inloopavond',
    soort: 'activiteit',
    doelgroepen: ['iedereen'],
    themas: ['ontmoeten'],
    titel: 'Inloopavond',
    categorie: 'Inloop',
    omschrijving:
      'Overdag komt het er niet altijd van, dus elke derde donderdag van de maand is de deur ’s avonds open. Dezelfde koffie, dezelfde tafel, alleen dan met de lamp aan.',
    // Van de avond bestaat geen foto; een huis in de schemering met de lamp aan
    // zegt precies wat de omschrijving zegt.
    img: '/img/sfeer-huis-avondlicht.webp',
    datum: '2026-09-17',
    heleDag: false,
    begintijd: '19:30',
    eindtijd: '21:30',
    herhaling: 'maandelijks',
    overslaan: [],
    aanmelden: false,
    bijdrage: 'Gratis',
  },
  {
    id: 'wandelgroep',
    soort: 'activiteit',
    doelgroepen: ['iedereen'],
    themas: ['bewegen-en-ontspannen', 'ontmoeten'],
    titel: 'Wandelgroep',
    categorie: 'Bewegen',
    omschrijving:
      'Ongeveer drie kilometer door het groene Zeewolde, in een tempo waar iedereen bij kan blijven. We beginnen met koffie om 10:00 en vertrekken om 10:30. Het gaat niet om de afstand maar om de gesprekken onderweg. Honden zijn welkom.',
    img: '/img/wandelen.jpg',
    datum: '2026-09-04',
    heleDag: false,
    begintijd: '10:00',
    eindtijd: '12:00',
    herhaling: 'maandelijks',
    overslaan: [],
    aanmelden: false,
    bijdrage: 'Gratis',
  },
  {
    id: 'zenmeditatie',
    soort: 'activiteit',
    doelgroepen: ['iedereen'],
    themas: ['bewegen-en-ontspannen', 'herstel-en-energie'],
    titel: 'Zenmeditatie op stoel',
    categorie: 'Wellness',
    omschrijving:
      'Er bestaan veel manieren om te mediteren. Wij zitten op een stoel, dus je hoeft niet op de grond en niet in kleermakerszit. Aan deze activiteit zijn geen kosten verbonden, een donatie is welkom.',
    // mediteren.jpg uit hun eigen post is een tekstposter, geen foto.
    img: '/img/sfeer-meditatie.jpg',
    datum: '2026-09-07',
    heleDag: false,
    begintijd: '10:00',
    eindtijd: '11:30',
    herhaling: 'maandelijks',
    overslaan: [],
    aanmelden: true,
    bijdrage: 'Gratis, een donatie is welkom',
  },
  {
    id: 'mandalagroep',
    soort: 'activiteit',
    doelgroepen: ['iedereen'],
    themas: ['informatie-en-inspiratie', 'ontmoeten'],
    titel: 'Mandala stippen',
    categorie: 'Creatief',
    omschrijving:
      'We beginnen met een eenvoudig ontwerp om het stippen te leren en de effecten te zien van kleur op kleur. Ook de techniek van walking dots komt aan de orde. We werken op canvas, op stenen en op gegoten materiaal. Hooguit vijf deelnemers, dus wees er snel bij.',
    img: '/img/mandala.jpg',
    datum: '2026-09-21',
    heleDag: false,
    begintijd: '13:30',
    eindtijd: '16:00',
    herhaling: 'maandelijks',
    overslaan: [],
    aanmelden: true,
    bijdrage: 'Gratis, een donatie is welkom',
  },
  {
    id: 'encaustic-augustus',
    soort: 'activiteit',
    doelgroepen: ['iedereen'],
    themas: ['informatie-en-inspiratie', 'ontmoeten'],
    titel: 'Encaustic art',
    categorie: 'Creatief',
    omschrijving:
      'Hoe voelt het om je gedachten en gevoelens over te laten vloeien in warme gekleurde was, en wat voor plaatje levert dat op? Met een strijkijzer en bijenwas maak je een tekening waarvan je de uitkomst van tevoren niet weet.',
    img: '/img/encaustic.jpg',
    datum: '2026-08-12',
    heleDag: false,
    begintijd: '10:30',
    eindtijd: '12:30',
    herhaling: 'eenmalig',
    overslaan: [],
    aanmelden: true,
  },
  {
    id: 'mixedmedia-augustus',
    soort: 'activiteit',
    doelgroepen: ['iedereen'],
    themas: ['informatie-en-inspiratie', 'ontmoeten'],
    titel: 'Mixed media',
    categorie: 'Creatief',
    omschrijving:
      'Je combineert verschillende materialen en technieken: verf, papier, stempels en meer. Geschikt voor beginners en gevorderden. In een ontspannen sfeer maak je iets unieks en laat je je verrassen door je eigen creativiteit.',
    img: '/img/mixed-media.jpg',
    datum: '2026-08-26',
    heleDag: false,
    begintijd: '10:30',
    eindtijd: '13:00',
    herhaling: 'eenmalig',
    overslaan: [],
    aanmelden: true,
  },
  {
    id: 'zomersluiting',
    soort: 'mededeling',
    titel: 'Het huis is dicht wegens de zomervakantie',
    categorie: 'Overig',
    omschrijving:
      'Vanaf donderdag 3 september staat de deur weer open voor een kop koffie en een goed gesprek, en starten alle activiteiten weer. Bellen of mailen kan ondertussen gewoon.',
    img: null,
    datum: '2026-07-18',
    totDatum: '2026-08-30',
    heleDag: true,
    herhaling: 'eenmalig',
    overslaan: [],
    aanmelden: false,
  },
];

/**
 * De berichten die er nu zijn.
 *
 * Ze komen van hun eigen Facebook en Instagram, want daar zetten zij hun
 * nieuws als eerste neer. Hier staan ze als gewone berichten met een pagina van
 * zichzelf, en met een verwijzing naar de post waar ze vandaan komen. Vanaf nu
 * schrijven ze ze in het beheer, en deze staan er als voorbeeld bij.
 */
const MAANDEN = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
];

export function nlDatum(iso: string): string {
  const [jaar, maand, dag] = iso.split('-').map(Number);
  return `${dag} ${MAANDEN[maand - 1]} ${jaar}`;
}

/**
 * De koppen en de inleidingen zijn hier geschreven, de berichten zelf zijn hun
 * eigen woorden uit de post. Een kop is namelijk niet hetzelfde als de eerste
 * zin: op een kaart moet in vijf woorden staan waar het over gaat.
 *
 * Welke post bij welke foto en welke links hoort, staat in socials.json; dat
 * bestand is opgehaald van hun eigen tijdlijn en blijft de bron.
 */
const KOPPEN: { titel: string; intro: string; beeld?: string }[] = [
  {
    titel: 'Mixed media op 26 augustus',
    intro:
      'Verf, papier, stempels en meer, door elkaar heen. Geschikt voor beginners en voor wie het al vaker deed.',
  },
  {
    titel: 'Encaustic art op 12 augustus',
    intro:
      'Werken met een strijkijzer en warme bijenwas. Je weet van tevoren niet wat eruit komt, en dat is precies de bedoeling.',
  },
  {
    titel: 'Op 21 september start een nieuwe mandalagroep',
    intro:
      'Eens per maand op de maandagmiddag, met hooguit vijf deelnemers. Wees er snel bij.',
  },
  {
    titel: 'Het huis is dicht tot en met 30 augustus',
    intro:
      'Vanaf donderdag 3 september staat de deur weer open, en starten alle activiteiten weer. Er komen er een paar bij.',
    // Hun eigen post had hier een tekening bij. Op de site staat het huis zelf,
    // want daar gaat het bericht over.
    beeld: '/img/huis-buiten.jpg',
  },
  {
    titel: 'Swim to Fight Cancer bracht 10.628 euro op voor onze jongeren',
    intro:
      'Honderd zwemmers, ruim 70.000 euro opgehaald in Zeewolde, en een deel daarvan gaat naar het jongerenproject.',
  },
  {
    titel: 'Met een kraam bij Swim to Fight Cancer',
    intro: 'We stonden aan de aanloophaven met informatie en een praatje voor wie langskwam.',
  },
];

const nieuws: Bericht[] = (socialsJson as {
  datum: string;
  tekst: string;
  beeld: string;
  links: { instagram?: string; facebook?: string };
}[]).map((post, i) => {
  const kop = KOPPEN[i] ?? { titel: `Bericht ${i + 1}`, intro: '' };
  const body = blokkenVanTekst(post.tekst);
  return {
    id: `bericht-${i}`,
    slug: slugify(kop.titel),
    datum: nlDatum(post.datum),
    datumISO: post.datum,
    vastgezet: false,
    titel: kop.titel,
    intro: kop.intro,
    samenvatting: samenvatten(kop.intro, body),
    body,
    img: kop.beeld ?? post.beeld,
    instagram: post.links.instagram,
    facebook: post.links.facebook,
  };
});

/* De meegeleverde logo's staan al op de maat van de site (320 bij 120), dus
   de voet en de pagina delen hetzelfde bestand. */
const sponsoren: Sponsor[] = (
  sponsorenJson as { naam: string; web: string | null; beeld: string }[]
).map(({ naam, web, beeld }) => ({ naam, beeld, strook: beeld, ...(web ? { web } : {}) }));

// Er staan nog geen verhalen van bezoekers klaar: die komen alleen uit het
// beheer en alleen met toestemming van de verteller.
export const defaults: Content = { teksten, agenda, nieuws, sponsoren, verhalen: [] };
