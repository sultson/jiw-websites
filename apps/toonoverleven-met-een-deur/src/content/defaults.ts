import { blokkenVanTekst, samenvatten } from './rich';
import type { AgendaBron, Bericht, Content, Sponsor, Teksten } from './types';
import sponsorenJson from '../sponsoren.json';
import socialsJson from '../socials.json';
import { slugify } from '../meta';

/**
 * De site zoals hij gebouwd is.
 *
 * Alles hieronder is wat er op de pagina staat zolang er in het beheer nog
 * niets is ingevuld, en waar de site op terugvalt als Sanity even niet
 * bereikbaar is. Een leeg veld in het beheer kan de pagina dus nooit leeg
 * maken, en een storing bij de CMS haalt het inloophuis niet offline.
 *
 * Het is tegelijk de tekst waarmee de dataset gevuld wordt (zie
 * studio/scripts/seed.ts), zodat de klant zijn eigen site in het beheer ziet
 * staan in plaats van lege formulieren.
 */

const teksten: Teksten = {
  hero: {
    kicker: 'Inloophuis in Zeewolde',
    titel: 'Kom binnen, de koffie staat klaar',
    lead: 'Kanker raakt je hele leven, en dat van de mensen om je heen. Hier kun je zitten, praten, meedoen aan iets, of juist even niets. Je hoeft je niet aan te melden en je hoeft niets uit te leggen.',
    knop: 'Kijk wat er te doen is',
    knopTwee: 'Zo vind je ons',
    deurLabel: 'Doe de deur open',
    deurOpenLabel: 'Dit is wat er achter de deur gebeurt',
  },
  open: {
    titel: 'Elke donderdag van 10:00 tot 12:00 staat de deur open',
    tekst: 'Je loopt zo naar binnen, zonder afspraak en zonder verwijzing van een arts. Elke derde donderdag van de maand zijn we er ook ’s avonds.',
    punten: [
      { kop: 'Zonder aanmelden', tekst: 'Je belt aan en je bent binnen' },
      { kop: 'Zonder kosten', tekst: 'De inloop en de wandelingen zijn gratis' },
      { kop: 'Een gewoon huis', tekst: 'Een huiskamer met een grote tafel, geen wachtkamer' },
    ],
  },
  nieuwsBlok: {
    kicker: 'Nieuws & Blog',
    titel: 'Wat er de laatste tijd gebeurde',
    lead: 'Nieuwe workshops, een wandeling die verzet wordt, een dag die goed uitpakte.',
  },
  agendaBlok: {
    kicker: 'Agenda',
    titel: 'Wat er de komende weken te doen is',
    lead: 'Bij de inloop hoef je je niet aan te melden. Voor een workshop is een berichtje handig, want er is een beperkt aantal plekken.',
    paginaLead: 'Kijk wat er de komende weken te doen is. Filter op soort activiteit, of klik een dag aan in de kalender. Je hoeft niet te weten wat je zoekt: we denken graag met je mee.',
  },
  welkom: {
    kicker: 'Voor wie',
    titel: 'Je hoeft niet ziek te zijn om hier te mogen zijn',
    alineas: [
      'Het inloophuis is er voor iedereen die door kanker geraakt is. Dat is een grotere groep dan mensen denken: naast wie zelf ziek is of is geweest, zijn dat ook partners, kinderen, ouders, collega’s en buren, en iedereen die iemand verloren heeft.',
      'Na de behandeling houdt het niet op. De angst dat het terugkomt, de vermoeidheid, het gevoel dat de rest van de wereld verder is gegaan. Daar is in de reguliere zorg weinig ruimte voor. Hier wel.',
    ],
    knop: 'Lees wie we zijn',
  },
  wieWeZijn: {
    kicker: 'Wie we zijn',
    titel: 'Twintig vrijwilligers uit Zeewolde, in een gewoon huis',
    lead: 'Geen artsen en geen behandelaars, maar mensen die tijd hebben, die kunnen luisteren en die weten hoe zwaar dit kan zijn.',
    alineas: [
      'Iedere gastheer en gastvrouw volgt eerst een basistraining van IPSO, de landelijke koepel van inloophuizen, en er is altijd iemand met wie je kunt overleggen. Niemand hier krijgt betaald.',
      'We zitten aan het Mazerhard 37, in een woonhuis met een huiskamer, een grote tafel en een tuin. Bewust geen kantoor en geen instelling. Je loopt er naar binnen zoals je bij iemand thuis binnenstapt.',
    ],
    voorWie: [
      'Je bent zelf ziek of bent het geweest',
      'Je partner, kind of ouder is ziek',
      'Je hebt iemand verloren aan kanker',
      'Een collega of buur is ziek',
      'Je hebt een andere chronische ziekte',
      'Je weet niet goed hoe je kunt helpen',
    ],
  },
  watWeDoen: {
    kicker: 'Wat we doen',
    titel: 'Praten mag, meedoen mag, en niets hoeft',
    lead: 'Sommige mensen komen elke week voor de koffie en vertellen nooit hun verhaal. Anderen komen alleen voor een workshop. Allebei is goed.',
    items: [
      {
        kop: 'Inloopochtend',
        wanneer: 'Elke donderdag, 10:00 tot 12:00',
        tekst: 'De deur staat open voor wie even wil praten, een kopje koffie wil of gewoon ergens wil zijn. Aanmelden hoeft niet, je loopt zo naar binnen.',
        foto: '/img/huis-binnen.jpg',
      },
      {
        kop: 'Creatieve workshops',
        wanneer: 'Meerdere keren per maand',
        tekst: 'Encaustic art met bijenwas, mixed media, mandala stippen, alcohol inkt, junk journaling, pasteltekenen en toefjes van schapenwol. Altijd onder begeleiding, ook als je van jezelf vindt dat je niet creatief bent.',
        foto: '/img/atelier.jpg',
      },
      {
        kop: 'Samen wandelen',
        wanneer: 'Maandelijks, koffie om 10:00 en vertrek om 10:30',
        tekst: 'Ongeveer drie kilometer door het groene Zeewolde, in een tempo waar iedereen bij kan blijven. Het gaat niet om de afstand maar om de gesprekken onderweg. Honden zijn welkom.',
        foto: '/img/wandelen.jpg',
      },
      {
        kop: 'Zenmeditatie op stoel',
        wanneer: 'Elke eerste maandag van de maand',
        tekst: 'Zittend op een stoel, dus je hoeft niet op de grond en niet in kleermakerszit. Het gaat er niet om je hoofd leeg te maken, maar om even niet mee te gaan met alles wat er rondtolt.',
        foto: '/img/mediteren.jpg',
      },
    ],
    kosten: 'De inloop en de wandelingen kosten niets. Voor een enkele workshop vragen we een bijdrage, en die ligt altijd onder wat je er elders voor betaalt. Is dat een drempel, zeg het gerust, dan zoeken we samen een oplossing.',
  },
  naam: {
    kicker: 'Sinds 1 juli 2026',
    titel: 'Waarom we niet meer Toon Hermans Huis heten',
    alineas: [
      'Toon Hermans was een cabaretier die zijn vrouw aan kanker verloor. De eerste inloophuizen werden naar hem vernoemd, en hij heeft ontzettend veel voor huizen als het onze betekend. Maar wie jonger is dan veertig weet vaak niet meer wie hij was, en juist die groep willen we bereiken.',
      'Daarom heten we sinds 1 juli 2026 Toon over Leven. Een naam die zegt waar het hier over gaat: niet over de ziekte, maar over het leven dat doorgaat.',
    ],
    slot: 'Het adres, de mensen en de koffie blijven hetzelfde. Alleen de naam op het bordje is veranderd.',
  },
  jongeren: {
    kicker: 'In de maak',
    titel: 'We bouwen aan een plek voor jongeren',
    lead: 'Als je twintig bent en je moeder is ziek, of je bent zelf ziek geweest, dan zit je niet te wachten op een kring van mensen die veertig jaar ouder zijn.',
    alineas: [
      'Op 4 juli 2026 gingen zo’n honderd zwemmers het water in bij de eerste Swim to Fight Cancer in de haven van Zeewolde. Het evenement bracht ruim 70.000 euro op, en 10.628 euro daarvan is bestemd voor ons jongerenproject.',
      'We zijn nu bezig met de invulling. Ben je jong, heb je hier iets mee, en weet je wat jou zou helpen? Laat het ons weten, want we bouwen dit liever samen dan voor je.',
    ],
    knop: 'Denk mee over het jongerenproject',
  },
  vrijwilliger: {
    kicker: 'Vrijwilliger worden',
    titel: 'De deur kan alleen open als er iemand achter staat',
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
    uitnodigingTitel: 'Lijkt het je wat?',
    uitnodiging: 'Bel of mail gerust eerst, ook als je nog helemaal niet zeker weet of dit bij je past. We maken graag kennis en laten je zien hoe het er op een donderdagochtend aan toegaat. Je zit nergens aan vast.',
  },
  steun: {
    kicker: 'Steun ons',
    titel: 'Wij hebben uw steun nu echt nodig',
    lead: 'Toon over Leven krijgt geen vaste financiering en draait volledig op giften. Zonder nieuwe inkomsten kunnen we de activiteiten aan het Mazerhard niet volhouden.',
    manieren: [
      {
        kop: 'Word vriend',
        tekst: 'Steun ons met een vast bedrag per jaar. Daarmee weten we waar we het komende jaar op kunnen rekenen, en dat is precies wat een huis als het onze nodig heeft.',
      },
      {
        kop: 'Sponsor worden',
        tekst: 'Als bedrijf of fonds. Van een jaarlijkse bijdrage tot het leveren van koffie, materialen of een dienst. Uw logo komt op deze pagina te staan.',
      },
      {
        kop: 'Gratis steunen',
        tekst: 'Doe uw online aankopen via SponsorKliks, dan krijgen wij een percentage van uw bestelling zonder dat het u een cent extra kost. Kies daar voorlopig nog THHZ in het keuzemenu.',
      },
      {
        kop: 'Geef uw tijd',
        tekst: 'Geld is niet de enige manier. Een paar uur op donderdagochtend is voor het huis net zo veel waard als een gift.',
      },
    ],
    anbi: 'Wij zijn een ANBI-stichting, dus uw gift is onder voorwaarden aftrekbaar van de belasting. Niemand binnen de stichting ontvangt een beloning of salaris, dus uw geld gaat naar de koffie, de materialen en het huis.',
    sponsorenTitel: 'Zeewolde houdt dit huis overeind',
    sponsorenTekst: 'Bedrijven, fondsen en ondernemers uit het dorp en daarbuiten dragen bij met geld, materialen of hun vak.',
  },
  verantwoording: {
    kicker: 'Verantwoording',
    titel: 'Waar het geld heen gaat, en wie erover gaat',
    lead: 'Wij zijn een ANBI-stichting. Dat betekent dat wij verplicht zijn openbaar te maken wat we doen, wat we ontvangen en wat we uitgeven. Alle stukken staan hieronder en u kunt ze gewoon downloaden.',
    doel: 'Laagdrempelige, professionele en warme psychosociale ondersteuning bieden aan mensen die leven met en na kanker, en aan hun naasten. Vanuit het gedachtegoed van Positieve Gezondheid ondersteunen wij hen bij het versterken van veerkracht, eigen regie en kwaliteit van leven, zodat zij zich gezien, gehoord en gesteund voelen. Daarbij is er ook aandacht voor de eenzaamheid die bij kanker hoort.',
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
    kicker: 'Kom langs',
    titel: 'Waar je ons vindt',
    lead: 'Aanmelden is niet nodig. Loop op donderdagochtend binnen, dat is genoeg. Vind je dat spannend, bel dan van tevoren even, dan staat er iemand voor je klaar.',
    formulierTitel: 'Stuur ons een bericht',
    formulierTekst: 'Je hoeft niet uit te leggen wat er speelt en je hoeft geen naam van een ziekte te noemen. Een berichtje met alleen je naam en de vraag of je een keer mag komen kijken is genoeg. Er reageert altijd een mens, meestal binnen een dag.',
    openingstijden: 'Elke donderdag van 10:00 tot 12:00\nElke derde donderdag van de maand ook ’s avonds\nIn de zomer- en kerstvakantie is er geen inloop',
  },
};

/**
 * De agenda zoals hij nu loopt.
 *
 * Terugkerende dingen staan hier als één regel met een herhaling erop, precies
 * zoals ze in het beheer ingevoerd worden. Dat is meteen het voorbeeld: wie
 * hierna zelf iets toevoegt, ziet in het beheer hoe de wekelijkse inloop is
 * ingevuld en doet het na.
 */
const agenda: AgendaBron[] = [
  {
    id: 'inloopochtend',
    soort: 'activiteit',
    titel: 'Inloopochtend',
    categorie: 'Inloop',
    omschrijving:
      'De deur staat open voor wie even wil praten, een kopje koffie wil of gewoon ergens wil zijn. Aanmelden hoeft niet, je loopt zo naar binnen. Op de laatste donderdag van de maand geven we de inloop een creatief tintje: pak aan wat er op tafel ligt en stip, teken of schilder mee.',
    img: null,
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
    titel: 'Inloopavond',
    categorie: 'Inloop',
    omschrijving:
      'Overdag komt het er niet altijd van, dus elke derde donderdag van de maand is de deur ’s avonds open. Dezelfde koffie, dezelfde tafel, alleen dan met de lamp aan.',
    img: null,
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
    titel: 'Wandelgroep',
    categorie: 'Bewegen',
    omschrijving:
      'Ongeveer drie kilometer door het groene Zeewolde, in een tempo waar iedereen bij kan blijven. We beginnen met koffie om 10:00 en vertrekken om 10:30. Het gaat niet om de afstand maar om de gesprekken onderweg. Honden zijn welkom.',
    img: null,
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
    titel: 'Zenmeditatie op stoel',
    categorie: 'Wellness',
    omschrijving:
      'Er bestaan veel manieren om te mediteren. Wij zitten op een stoel, dus je hoeft niet op de grond en niet in kleermakerszit. Aan deze activiteit zijn geen kosten verbonden, een donatie is welkom.',
    img: null,
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
    titel: 'Mandala stippen',
    categorie: 'Creatief',
    omschrijving:
      'We beginnen met een eenvoudig ontwerp om het stippen te leren en de effecten te zien van kleur op kleur. Ook de techniek van walking dots komt aan de orde. We werken op canvas, op stenen en op gegoten materiaal. Hooguit vijf deelnemers, dus wees er snel bij.',
    img: null,
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
    titel: 'Encaustic art',
    categorie: 'Creatief',
    omschrijving:
      'Hoe voelt het om je gedachten en gevoelens over te laten vloeien in warme gekleurde was, en wat voor plaatje levert dat op? Met een strijkijzer en bijenwas maak je een tekening waarvan je de uitkomst van tevoren niet weet.',
    img: null,
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
    titel: 'Mixed media',
    categorie: 'Creatief',
    omschrijving:
      'Je combineert verschillende materialen en technieken: verf, papier, stempels en meer. Geschikt voor beginners en gevorderden. In een ontspannen sfeer maak je iets unieks en laat je je verrassen door je eigen creativiteit.',
    img: null,
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

const sponsoren = sponsorenJson as Sponsor[];

export const defaults: Content = { teksten, agenda, nieuws, sponsoren };
