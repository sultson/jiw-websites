import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  Hammer,
  Home,
  Loader2,
  Mail,
  MapPin,
  Maximize2,
  Menu,
  MessageCircle,
  MessageSquare,
  PaintRoller,
  Phone,
  Ruler,
  ShieldCheck,
  Sparkles,
  Star,
  Upload,
  Wrench,
  X,
} from 'lucide-react';

const phoneDisplay = '06 45172726';
const phoneHref = 'tel:+31645172726';
const whatsappHref = 'https://wa.me/31645172726?text=Hallo%20RN%20Schilders%2C%20ik%20wil%20graag%20een%20gratis%20prijsindicatie%20aanvragen.';
const email = 'info@rn-schilders.nl';
const mapsHref = 'https://www.google.com/maps/search/?api=1&query=Kuipersweg+33+3449+JA+Woerden';
const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
const attachmentAccept = '.jpg,.jpeg,.png,.webp,.heic,.heif,.pdf,image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf';
const MAX_ATTACHMENTS = 5;
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
const SUCCESS_AUTO_CLOSE_MS = 3200;

function isLocalFormHost() {
  if (typeof window === 'undefined') return false;
  return ['localhost', '127.0.0.1', '[::1]', '::1'].includes(window.location.hostname);
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageFile(file: File) {
  return file.type.startsWith('image/') && !file.type.includes('heic') && !file.type.includes('heif');
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

type TurnstileRenderOptions = {
  sitekey: string;
  callback: (token: string) => void;
  'expired-callback': () => void;
  'error-callback': () => void;
};

type Service = {
  title: string;
  text: string;
  image: string;
  width: number;
  height: number;
  icon: typeof PaintRoller;
  bullets: string[];
  detailTitle: string;
  detailIntro: string;
  detailSections: Array<{
    title: string;
    items: string[];
  }>;
};

type Review = {
  name: string;
  date: string;
  quote: string;
};

type ShowcaseImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  label: string;
};

type ShowcaseGroup = {
  title: string;
  text: string;
  images: ShowcaseImage[];
};

type TermsSection = {
  title: string;
  items: Array<string | { text: string; subitems: string[] }>;
};

const navLinks = [
  ['Diensten', '#diensten'],
  ['Werk', '#werk'],
  ['Reviews', '#reviews'],
  ['Werkwijze', '#werkwijze'],
  ['Contact', '#contact'],
] as const;

const stats = [
  ['15+', 'jaar ervaring'],
  ['5.0', 'Google score'],
  ['8', 'recente reviews'],
  ['1', 'vast aanspreekpunt'],
] as const;

const services: Service[] = [
  {
    title: 'Schilderwerk',
    text: 'Binnen en buiten strak afgewerkt met duurzame verfproducten, van muren en plafonds tot kozijnen, deuren en boeidelen.',
    image: '/schilderwerk.webp',
    width: 1300,
    height: 867,
    icon: PaintRoller,
    bullets: ['Binnen en buiten', 'Kozijnen en boeidelen', 'Onderhoudsplanning'],
    detailTitle: 'Binnen- en buitenschilderwerk',
    detailIntro:
      'Schilderwerk bepaalt de uitstraling van uw woning of bedrijfspand, maar beschermt ook tegen vocht, UV en slijtage. RN Schilders werkt met grondige voorbereiding en hoogwaardige verfproducten voor een duurzaam eindresultaat.',
    detailSections: [
      {
        title: 'Binnen',
        items: ['Muren, plafonds, kozijnen, deuren en trappen', 'Schoonmaken, schuren, vullen en gronden', 'Kleuradvies en planning met minimale overlast'],
      },
      {
        title: 'Buiten',
        items: ['Inspectie van houtwerk en bestaande verflagen', 'Herstelwerk voordat er afgewerkt wordt', 'Bescherming tegen weer, vocht en zon'],
      },
    ],
  },
  {
    title: 'Kozijnen',
    text: 'Renovatie, plaatsing en herstel van houten en kunststof kozijnen, inclusief hang- en sluitwerk met PKVW-focus.',
    image: '/kozijnen-3.webp',
    width: 1100,
    height: 733,
    icon: Home,
    bullets: ['Hout en kunststof', 'Plaatsing en renovatie', 'PKVW hang- en sluitwerk'],
    detailTitle: 'Houten en kunststof kozijnen',
    detailIntro:
      'RN Schilders helpt met levering, plaatsing, renovatie en onderhoud van kozijnen. De focus ligt op uitstraling, isolatie, veiligheid en een lange levensduur.',
    detailSections: [
      {
        title: 'Houten kozijnen',
        items: ['Warme, luxe uitstraling', 'Goed te herstellen en geschikt voor maatwerk', 'Sterke isolatie bij correcte plaatsing en onderhoud'],
      },
      {
        title: 'Kunststof kozijnen',
        items: ['Onderhoudsarm en kleurvast', 'Goede warmte- en geluidsisolatie', 'Weerbestendig en geschikt voor moderne renovaties'],
      },
      {
        title: 'Veiligheid',
        items: ['PKVW-gecertificeerd hang- en sluitwerk', 'Aandacht voor inbraakwering', 'Advies per woning of bedrijfspand'],
      },
    ],
  },
  {
    title: 'Spuitwerk',
    text: 'Egaal spuitwerk voor woningen, kantoren en bedrijfspanden wanneer tempo en een moderne afwerking belangrijk zijn.',
    image: '/spuitwerk.webp',
    width: 1300,
    height: 867,
    icon: Sparkles,
    bullets: ['Muren en plafonds', 'Kantoren en woningen', 'Glad eindresultaat'],
    detailTitle: 'Professioneel spuitwerk',
    detailIntro:
      'Spuitwerk is een efficiënte techniek om wanden, plafonds en grote oppervlakken strak en egaal af te werken. Vooral bij grotere ruimtes geeft het een rustig en modern resultaat.',
    detailSections: [
      {
        title: 'Toepassingen',
        items: ['Woningen, nieuwbouw en renovaties', 'Kantoren, winkels en bedrijfspanden', 'Muren, plafonds en andere grote oppervlakken'],
      },
      {
        title: 'Voorbereiding',
        items: ['Reinigen en gladmaken van ondergronden', 'Herstellen van beschadigingen', 'Zorgvuldig afplakken van vloeren, ramen en deuren'],
      },
    ],
  },
  {
    title: 'Stucwerk',
    text: 'Gladde wanden en plafonds als sterke basis voor schilderwerk, renovatiestuc en reparaties in bestaande woningen.',
    image: '/stukadoor.webp',
    width: 1100,
    height: 762,
    icon: Ruler,
    bullets: ['Pleisterwerk', 'Nieuwbouw en renovatie', 'Reparaties'],
    detailTitle: 'Strak stucwerk in Woerden',
    detailIntro:
      'Goed stucwerk is de basis voor een strak interieur. RN Schilders verzorgt pleisterwerk voor wanden en plafonds, inclusief voorbereiding en schadeherstel.',
    detailSections: [
      {
        title: 'Werkzaamheden',
        items: ['Wanden en plafonds glad afwerken', 'Ondergrond voorbereiden en beschadigingen herstellen', 'Geschikt voor renovatie en nieuwbouw'],
      },
      {
        title: 'Combinatie',
        items: ['Naadloos te combineren met schilderwerk', 'Ook geschikt als basis voor spuitwerk', 'Een vaste partij voor voorbereiding en afwerking'],
      },
    ],
  },
  {
    title: 'Houtrotherstel',
    text: 'Aangetast houtwerk duurzaam herstellen voordat vocht grotere schade veroorzaakt aan kozijnen, deuren of boeidelen.',
    image: '/houtrotherstel.webp',
    width: 1200,
    height: 675,
    icon: Wrench,
    bullets: ['Inspectie en herstel', 'Schuren en gronden', 'Bescherming op termijn'],
    detailTitle: 'Houtrotherstel zonder onnodige vervanging',
    detailIntro:
      'Houtrot komt vaak voor bij kozijnen, deuren, boeidelen en ander buitenhout. Tijdig herstel voorkomt dat kleine vochtproblemen uitgroeien tot kostbare vervanging.',
    detailSections: [
      {
        title: 'Aanpak',
        items: ['Grondige inspectie van aangetast houtwerk', 'Beschadigd hout zorgvuldig verwijderen', 'Herstel met gespecialiseerde reparatieproducten'],
      },
      {
        title: 'Afwerking',
        items: ['Schuren, gronden en strak schilderen', 'Bescherming tegen vocht en temperatuurwisselingen', 'Preventief advies voor toekomstig onderhoud'],
      },
    ],
  },
  {
    title: 'Sloopwerk',
    text: 'Zorgvuldig voorbereid sloopwerk voor renovaties, zodat de ruimte schoon, veilig en klaar is voor de volgende stap.',
    image: '/sloopwerk.webp',
    width: 1000,
    height: 500,
    icon: Hammer,
    bullets: ['Voor renovatie', 'Veilig en netjes', 'Afvoer in overleg'],
    detailTitle: 'Sloopwerk als voorbereiding op renovatie',
    detailIntro:
      'Sloopwerk is vaak de eerste fase van een verbouwing. RN Schilders verwijdert oude materialen veilig en zorgvuldig, zodat de ruimte klaar is voor herstel, stucwerk, schilderwerk of spuitwerk.',
    detailSections: [
      {
        title: 'Voorbereiding',
        items: ['Verwijderen van oude wanden, afwerkingen en plafondmaterialen', 'Werkruimte netjes en veilig houden', 'Materialen zorgvuldig loshalen en afvoeren in overleg'],
      },
      {
        title: 'Aansluiting op afwerking',
        items: ['Direct door naar herstelwerk', 'Stucwerk, schilderwerk en spuitwerk sluiten aan', 'Geschikt voor woningen en bedrijfspanden in de regio Woerden'],
      },
    ],
  },
];

const reviews: Review[] = [
  {
    name: 'Barry Verschoor',
    date: 'maart 2026',
    quote:
      'Alles is netjes voorbereid, geschuurd en strak geschilderd. Het contact was prettig, afspraken werden nagekomen en er werd netjes gewerkt.',
  },
  {
    name: 'Marielle Strobos',
    date: 'maart 2026',
    quote:
      'Ze hebben alles voor me geregeld: stucwerk, schilderwerk, egalisatie van de vloer en timmerwerk. Alles was op tijd klaar en de kwaliteit is uitstekend.',
  },
  {
    name: 'Marek Balog',
    date: 'maart 2026',
    quote:
      'De service is top en alles wordt netjes en professioneel geregeld. Ze denken goed mee en komen afspraken na.',
  },
];

const processSteps = [
  ['Foto of afspraak', 'Stuur foto’s mee of plan een opname op locatie in Woerden en omgeving.'],
  ['Duidelijke offerte', 'U weet vooraf wat er gebeurt, welke materialen worden gebruikt en wanneer het werk start.'],
  ['Netjes uitgevoerd', 'Richard werkt zelf mee op de vloer en bewaakt voorbereiding, planning en afwerking.'],
  ['Oplevering', 'Samen controleren we het resultaat en eventuele restpunten worden direct helder gemaakt.'],
] as const;

const roofWindowStory: ShowcaseImage[] = [
  {
    src: '/showcase-roof-window-before.webp',
    alt: 'Dakkapel en dakraam vóór afwerking',
    width: 1024,
    height: 1536,
    title: 'Dakraamhoek',
    label: 'Voor',
  },
  {
    src: '/showcase-roof-window-after.webp',
    alt: 'Dakkapel en dakraam na afwerking',
    width: 1024,
    height: 1536,
    title: 'Dakraamhoek',
    label: 'Na',
  },
  {
    src: '/showcase-roof-window-after-detail.webp',
    alt: 'Afgewerkte dakkapel vanaf straatniveau',
    width: 1024,
    height: 1536,
    title: 'Afwerking buiten',
    label: 'Detail',
  },
];

const showcaseGroups: ShowcaseGroup[] = [
  {
    title: 'Kozijnen en licht',
    text: 'Buitenaanzicht, hoekdetails en glaspartijen bij elkaar, zodat u de aansluiting en afwerking goed kunt beoordelen.',
    images: [
      {
        src: '/showcase-window-corner-1.webp',
        alt: 'Hoekkozijn met meerdere glasvlakken aan een woning',
        width: 1800,
        height: 1498,
        title: 'Hoekkozijn',
        label: 'Buiten',
      },
      {
        src: '/showcase-window-corner-2.webp',
        alt: 'Wit hoekkozijn met donkere raamdetails',
        width: 400,
        height: 395,
        title: 'Kozijndetail',
        label: 'Detail',
      },
      {
        src: '/showcase-damaged-wood-detail.webp',
        alt: 'Beschadigd houtwerk aan buitenzijde',
        width: 1024,
        height: 1536,
        title: 'Houtwerk',
        label: 'Te herstellen',
      },
    ],
  },
  {
    title: 'Interieurafwerking',
    text: 'Vloer, plafond, haardombouw en wandafwerking als losse onderdelen van een rustig eindbeeld.',
    images: [
      {
        src: '/showcase-flooring-finish.webp',
        alt: 'Afgewerkte visgraatvloer in een lichte woonruimte',
        width: 900,
        height: 1600,
        title: 'Vloer',
        label: 'Afgewerkt',
      },
      {
        src: '/showcase-ceiling-tiles-finish.webp',
        alt: 'Donker plafond met strakke plafondplaten en inbouwspots',
        width: 1408,
        height: 1056,
        title: 'Plafond',
        label: 'Afgewerkt',
      },
      {
        src: '/showcase-fireplace-lighting.webp',
        alt: 'Moderne haardombouw met geïntegreerde verlichting',
        width: 1320,
        height: 1309,
        title: 'Haardombouw',
        label: 'Lichtdetail',
      },
      {
        src: '/showcase-room-good-as-new.webp',
        alt: 'Afgewerkte kamer met groene wand, lichte vloer en inbouwspots',
        width: 1320,
        height: 1641,
        title: 'Kamer',
        label: 'Eindbeeld',
      },
    ],
  },
  {
    title: 'Deuren en details',
    text: 'Afwerking valt op bij randen, profielen en zichtlijnen. Juist daarom krijgen deze details ruimte.',
    images: [
      {
        src: '/showcase-door-dark-finish.webp',
        alt: 'Donker afgelakte binnendeur met paneelverdeling',
        width: 1320,
        height: 1640,
        title: 'Binnendeur',
        label: 'Lakwerk',
      },
      {
        src: '/showcase-door-hall-finish.webp',
        alt: 'Witte binnendeur in hal met groene wand',
        width: 1320,
        height: 1629,
        title: 'Hal',
        label: 'Afgewerkt',
      },
    ],
  },
  {
    title: 'Tijdens uitvoering',
    text: 'Niet alleen het eindresultaat telt. Deze beelden laten zien hoe ruimtes stap voor stap worden voorbereid.',
    images: [
      {
        src: '/showcase-work-progress-wall.webp',
        alt: 'Werk in uitvoering bij een wand en vloer',
        width: 906,
        height: 1600,
        title: 'Wandvoorbereiding',
        label: 'Binnen',
      },
      {
        src: '/showcase-work-progress-frame-1.webp',
        alt: 'Metalen frames tijdens renovatiewerk',
        width: 960,
        height: 1280,
        title: 'Framewerk',
        label: 'Opbouw',
      },
      {
        src: '/showcase-work-progress-frame-2.webp',
        alt: 'Ruimte met framewerk en raam tijdens uitvoering',
        width: 1280,
        height: 960,
        title: 'Indeling',
        label: 'In uitvoering',
      },
      {
        src: '/showcase-work-progress-frame-3.webp',
        alt: 'Binnenruimte met steiger en materiaal tijdens renovatie',
        width: 1280,
        height: 960,
        title: 'Werkruimte',
        label: 'Materiaal',
      },
    ],
  },
];

const termsSections: TermsSection[] = [
  {
    title: 'Artikel 1 — Definities',
    items: [
      'In deze algemene voorwaarden wordt verstaan onder:',
      'a. Opdrachtnemer: RN Schilders & Renovatie, gevestigd te Woerden, ingeschreven bij de KvK onder nummer 98075357.',
      'b. Opdrachtgever: de natuurlijke persoon of vereniging van eigenaren, niet handelend in de uitoefening van beroep of bedrijf, die met opdrachtnemer een overeenkomst sluit.',
      'c. Overeenkomst: alle tussen partijen gemaakte afspraken met betrekking tot de uitvoering van werkzaamheden en/of het leveren van materialen.',
      'd. Werkzaamheden: alle werkzaamheden die opdrachtnemer aanbiedt, waaronder schilderwerk (binnen en buiten), renovatie, dakkapellen, vloeren leggen en egaliseren, kunststof kozijnen, houtrotreparatie en aanverwante werkzaamheden.',
    ],
  },
  {
    title: 'Artikel 2 — Toepasselijkheid',
    items: [
      '1. Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, offertes en overeenkomsten tussen opdrachtnemer en opdrachtgever.',
      '2. Afwijkingen van deze voorwaarden zijn uitsluitend geldig indien deze schriftelijk zijn overeengekomen.',
      '3. Deze voorwaarden worden bij elke offerte aan opdrachtgever ter beschikking gesteld.',
    ],
  },
  {
    title: 'Artikel 3 — Aanbieding en totstandkoming overeenkomst',
    items: [
      '1. Een overeenkomst komt tot stand nadat opdrachtgever de offerte schriftelijk (per e-mail, WhatsApp of ondertekend) heeft geaccepteerd.',
      '2. Iedere offerte is vrijblijvend en geldig gedurende 30 dagen, tenzij anders vermeld.',
      '3. Indien opdrachtnemer met instemming van opdrachtgever met de werkzaamheden begint zonder schriftelijke bevestiging, geldt de laatste verstrekte offerte als overeenkomst.',
    ],
  },
  {
    title: 'Artikel 4 — Wettelijke bedenktijd',
    items: [
      '1. Bij overeenkomsten die op afstand of buiten de verkoopruimte tot stand komen (bijvoorbeeld via telefoon, WhatsApp, e-mail of bij opdrachtgever thuis), heeft opdrachtgever recht op een bedenktijd van 14 dagen na het sluiten van de overeenkomst.',
      '2. Indien opdrachtgever wenst dat opdrachtnemer binnen deze 14 dagen start met de werkzaamheden en/of de inkoop van benodigde materialen, dient opdrachtgever hier uitdrukkelijk schriftelijk mee in te stemmen. Opdrachtgever erkent in dat geval dat het herroepingsrecht vervalt zodra de werkzaamheden volledig zijn uitgevoerd.',
      {
        text: '3. Indien opdrachtgever de overeenkomst binnen de bedenktijd herroept terwijl opdrachtnemer reeds — met toestemming van opdrachtgever — is begonnen met de werkzaamheden, materiaalinkoop of personeelsreservering, is opdrachtgever verplicht de volgende kosten volledig te vergoeden:',
        subitems: [
          'a. de werkelijke kosten van reeds ingekochte of bestelde materialen, ongeacht of deze retour kunnen worden gestuurd;',
          'b. de tot dat moment uitgevoerde werkzaamheden, berekend op basis van het overeengekomen uurtarief of een evenredig deel van de aanneemsom;',
          'c. eventuele voorbereidende werkzaamheden zoals inspecties, opmetingen en bestellingen;',
          'd. reeds gereserveerde of ingehuurde mankracht die door de korte termijn niet meer elders kan worden ingezet.',
        ],
      },
      '4. Indien opdrachtgever géén toestemming heeft gegeven om binnen de bedenktijd te starten, zal opdrachtnemer pas na afloop van de bedenktijd aanvangen met werkzaamheden of materiaalinkoop. Dit betekent tevens dat opdrachtnemer pas ná afloop van de bedenktijd de planning kan opmaken en de beschikbaarheid van personeel kan vaststellen. De definitieve startdatum kan hierdoor afwijken van een eerder genoemde indicatieve datum.',
    ],
  },
  {
    title: 'Artikel 5 — Uitvoering van de werkzaamheden',
    items: [
      '1. Opdrachtgever zorgt ervoor dat opdrachtnemer tijdig kan beschikken over de benodigde toegang, vergunningen en gegevens voor de uitvoering van de werkzaamheden.',
      '2. Opdrachtgever stelt kosteloos elektriciteit, water en sanitair ter beschikking gedurende de werkzaamheden.',
      '3. Opdrachtnemer is gerechtigd werkzaamheden geheel of gedeeltelijk door derden te laten uitvoeren.',
      '4. Een overeengekomen uitvoeringstermijn is geen fatale termijn. Bij overschrijding krijgt opdrachtnemer de gelegenheid om alsnog binnen redelijke termijn na te komen.',
      '5. Indien opdrachtgever in gebreke blijft met de in dit artikel genoemde verplichtingen, heeft opdrachtnemer het recht de uitvoering op te schorten en de daaruit voortvloeiende kosten in rekening te brengen.',
    ],
  },
  {
    title: 'Artikel 6 — Prijzen',
    items: [
      '1. Alle prijzen zijn inclusief BTW, tenzij anders vermeld in de offerte.',
      '2. Reis- en parkeerkosten en kosten voor vergunningaanvragen zijn niet bij de prijs inbegrepen, tenzij uitdrukkelijk vermeld.',
      '3. Indien tussen het sluiten van de overeenkomst en de uitvoering meer dan drie maanden is verstreken, is opdrachtnemer gerechtigd prijswijzigingen door te berekenen.',
    ],
  },
  {
    title: 'Artikel 7 — Betaling',
    items: [
      {
        text: '1. Tenzij anders overeengekomen in de offerte, hanteert opdrachtnemer voor grotere projecten de volgende betalingsregeling:',
        subitems: ['• 35% bij acceptatie van de offerte;', '• 55% bij aanvang van de werkzaamheden;', '• 10% binnen 14 dagen na oplevering.'],
      },
      '2. Voor kleinere opdrachten kan opdrachtnemer afwijken van deze regeling. De geldende betalingstermijnen worden in dat geval in de offerte vermeld.',
      '3. Bij niet-tijdige betaling is opdrachtgever van rechtswege in verzuim. Vanaf dat moment is opdrachtgever de wettelijke rente verschuldigd over het openstaande bedrag.',
      '4. Bij verzuim is opdrachtgever tevens buitengerechtelijke incassokosten verschuldigd conform de Wet normering buitengerechtelijke incassokosten.',
      '5. Bij niet-tijdige betaling van een termijn is opdrachtnemer gerechtigd de werkzaamheden op te schorten totdat volledig is betaald.',
    ],
  },
  {
    title: 'Artikel 8 — Garantie',
    items: [
      '1. Opdrachtnemer biedt op uitgevoerd schilderwerk een garantie van 5 jaar na oplevering.',
      '2. Op renovatie- en verbouwingswerkzaamheden geldt een garantie van 5 jaar na oplevering.',
      {
        text: '3. De garantie geldt uitsluitend indien:',
        subitems: [
          'a. opdrachtgever het werk normaal en zorgvuldig gebruikt;',
          'b. opdrachtgever het werk regelmatig en deugdelijk onderhoudt volgens de aanwijzingen van opdrachtnemer;',
          'c. de gebreken niet het gevolg zijn van normale slijtage, externe invloeden, onjuist gebruik of door opdrachtgever of derden uitgevoerde wijzigingen;',
          'd. opdrachtgever zijn betalingsverplichtingen volledig is nagekomen.',
        ],
      },
      '4. Garantieaanspraken dienen binnen 14 dagen na ontdekking schriftelijk bij opdrachtnemer te worden gemeld.',
      '5. Onder garantie wordt verstaan: kosteloos herstel van het gebrek door opdrachtnemer. Vervanging is uitsluitend mogelijk indien herstel redelijkerwijs niet mogelijk is. De totale kosten voor herstel onder deze garantie zijn beperkt tot een maximum van € 2.500,00 per opdracht.',
    ],
  },
  {
    title: 'Artikel 9 — Oplevering en klachten',
    items: [
      '1. Na voltooiing van de werkzaamheden vindt een oplevering plaats waarbij opdrachtnemer en opdrachtgever gezamenlijk het werk inspecteren. Eventuele gebreken worden vastgelegd op het opleveringsformulier dat door beide partijen wordt ondertekend.',
      '2. Het werk wordt geacht te zijn opgeleverd op het moment dat het opleveringsformulier door beide partijen is ondertekend. Opdrachtnemer zal eventuele op het formulier vastgelegde gebreken binnen een redelijke termijn herstellen.',
      '3. Indien opdrachtgever niet aanwezig is bij de oplevering, weigert het werk te inspecteren of weigert het opleveringsformulier te ondertekenen, wordt het werk geacht te zijn aanvaard zodra opdrachtnemer schriftelijk heeft meegedeeld dat het werk gereed is en opdrachtgever niet binnen 14 dagen schriftelijk gebreken heeft gemeld.',
      '4. Ingebruikname van (een gedeelte van) het werk geldt als aanvaarding van dat gedeelte.',
      '5. Klachten over gebreken die bij oplevering redelijkerwijs zichtbaar waren maar niet zijn gemeld op het opleveringsformulier, kunnen achteraf niet meer worden ingediend.',
      '6. Verborgen gebreken die pas na oplevering zichtbaar worden, dienen binnen 14 dagen na ontdekking schriftelijk te worden gemeld. Daarna vervalt het recht om hierover te klagen.',
      '7. Een klacht over een onderdeel van het werk geeft geen recht op opschorting van betaling van het geheel.',
    ],
  },
  {
    title: 'Artikel 10 — Aansprakelijkheid',
    items: [
      '1. Opdrachtnemer dient bij gebreken in de gelegenheid te worden gesteld deze te herstellen, voordat opdrachtgever zich op andere rechten kan beroepen.',
      '2. De aansprakelijkheid van opdrachtnemer is beperkt tot het netto factuurbedrag van de betreffende opdracht, tot een maximum van € 2.500,00.',
      '3. Indien opdrachtnemer voor de schade is verzekerd, is de aansprakelijkheid beperkt tot het bedrag dat door de verzekeraar wordt uitgekeerd, vermeerderd met het eigen risico.',
      '4. Opdrachtnemer is niet aansprakelijk voor gevolgschade, gederfde winst, gemiste besparingen of schade door bedrijfsstagnatie.',
      {
        text: '5. Opdrachtnemer is niet aansprakelijk voor schade die het gevolg is van:',
        subitems: [
          'a. door opdrachtgever ter beschikking gestelde of voorgeschreven materialen;',
          'b. een ondeugdelijke ondergrond waarvoor opdrachtnemer heeft gewaarschuwd;',
          'c. handelen of nalaten van opdrachtgever of derden;',
          'd. overschrijding van de uitvoeringstermijn.',
        ],
      },
      '6. Iedere aansprakelijkheid vervalt één jaar na het ontstaan van de schade, dan wel één jaar nadat opdrachtgever de schade redelijkerwijs heeft kunnen vaststellen.',
    ],
  },
  {
    title: 'Artikel 11 — Overmacht',
    items: [
      '1. Onder overmacht wordt verstaan: omstandigheden die nakoming van de overeenkomst verhinderen en die niet aan opdrachtnemer zijn toe te rekenen, waaronder maar niet beperkt tot: extreme weersomstandigheden, ziekte, stakingen, brand, storingen bij toeleveranciers, overheidsmaatregelen en transportproblemen.',
      '2. Bij overmacht heeft opdrachtnemer het recht de uitvoering op te schorten. Indien de overmacht langer dan één maand voortduurt, zijn beide partijen gerechtigd de overeenkomst te ontbinden zonder schadevergoeding.',
      '3. Indien opdrachtnemer bij intreden van de overmacht reeds gedeeltelijk aan zijn verplichtingen heeft voldaan, is opdrachtnemer gerechtigd dit deel afzonderlijk te factureren.',
    ],
  },
  {
    title: 'Artikel 12 — Eigendomsvoorbehoud',
    items: [
      '1. Alle door opdrachtnemer geleverde goederen blijven eigendom van opdrachtnemer tot volledige betaling van alle vorderingen, inclusief rente en kosten.',
      '2. Tot aan volledige betaling is opdrachtgever niet bevoegd de goederen te verpanden of te vervreemden.',
    ],
  },
  {
    title: 'Artikel 13 — Opzegging en annulering',
    items: [
      '1. Opdrachtgever kan de overeenkomst te allen tijde opzeggen.',
      {
        text: '2. Bij opzegging is opdrachtgever, tenzij anders overeengekomen in de offerte, de volledige kosten verschuldigd van:',
        subitems: [
          'a. reeds ingekochte of bestelde materialen, ongeacht of deze retour kunnen worden gestuurd;',
          'b. reeds gereserveerde of ingehuurde mankracht die door de korte termijn niet meer elders kan worden ingezet;',
          'c. reeds verrichte voorbereidende werkzaamheden zoals inspecties, opmetingen en bestellingen;',
          'd. reeds uitgevoerde werkzaamheden, berekend op basis van het overeengekomen uurtarief of een evenredig deel van de aanneemsom.',
        ],
      },
      '3. Indien opdrachtgever conform artikel 4 lid 2 uitdrukkelijk schriftelijk toestemming heeft gegeven om binnen de bedenktijd te starten, gelden de bovengenoemde kosten direct vanaf het moment van acceptatie van de offerte. In dat geval vervalt het herroepingsrecht voor zover de werkzaamheden zijn uitgevoerd.',
      '4. De opzeggingskosten zijn direct opeisbaar zodra opdrachtgever de opzegging heeft kenbaar gemaakt.',
      '5. Wordt de uitvoering van het werk onmogelijk door een oorzaak die niet aan opdrachtnemer kan worden toegerekend, dan is opdrachtnemer gerechtigd de overeenkomst op te zeggen en de tot dan toe gemaakte kosten in rekening te brengen.',
    ],
  },
  {
    title: 'Artikel 14 — Toepasselijk recht en geschillen',
    items: [
      '1. Op alle overeenkomsten tussen opdrachtnemer en opdrachtgever is uitsluitend Nederlands recht van toepassing.',
      '2. Geschillen worden voorgelegd aan de bevoegde rechter van de Rechtbank Midden-Nederland, locatie Utrecht.',
    ],
  },
  {
    title: 'Artikel 15 — Slotbepalingen',
    items: [
      '1. Indien een bepaling van deze algemene voorwaarden nietig of vernietigbaar blijkt, blijven de overige bepalingen onverminderd van kracht.',
      '2. Opdrachtnemer is gerechtigd deze algemene voorwaarden te wijzigen. De gewijzigde voorwaarden gelden voor alle nieuwe overeenkomsten.',
    ],
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [pathname, setPathname] = useState(() => (typeof window === 'undefined' ? '/' : window.location.pathname));
  const isTermsPage = pathname === '/algemene-voorwaarden';

  useEffect(() => {
    const onLocationChange = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  return (
    <div id="top" className="min-h-[100dvh] bg-paper">
      <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} openQuote={() => setQuoteOpen(true)} isTermsPage={isTermsPage} />
      <main className="pt-16 md:pt-20">
        {isTermsPage ? (
          <TermsPage openQuote={() => setQuoteOpen(true)} />
        ) : (
          <>
            <Hero openQuote={() => setQuoteOpen(true)} />
            <ProofStrip />
            <OwnerSection openQuote={() => setQuoteOpen(true)} />
            <Services openQuote={() => setQuoteOpen(true)} />
            <FeaturedWork openQuote={() => setQuoteOpen(true)} />
            <Reviews />
            <Process openQuote={() => setQuoteOpen(true)} />
            <Contact openQuote={() => setQuoteOpen(true)} />
          </>
        )}
      </main>
      <Footer />
      <MobileCta openQuote={() => setQuoteOpen(true)} />
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}

function Nav({
  menuOpen,
  setMenuOpen,
  openQuote,
  isTermsPage,
}: {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  openQuote: () => void;
  isTermsPage: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition ${scrolled ? 'bg-whitewash/95 shadow-sm backdrop-blur-md' : 'bg-whitewash/90 backdrop-blur-sm'}`}>
      <div className="shell flex h-16 items-center justify-between md:h-20">
        <a href={isTermsPage ? '/' : '#top'} className="flex min-w-0 items-center gap-3" aria-label="RN Schilders & Renovatie">
          <img src="/logo-mark.webp" alt="" width={800} height={679} className="h-11 w-11 object-contain" />
          <span className="min-w-0">
            <span className="block truncate font-display text-lg font-extrabold text-navy sm:text-xl">RN Schilders</span>
            <span className="block text-xs font-bold uppercase tracking-[0.12em] text-roller">Woerden</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map(([label, href]) => (
            <a key={href} href={isTermsPage ? `/${href}` : href} className="text-sm font-semibold text-graphite transition hover:text-navy">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={phoneHref} className="btn-outline hidden md:inline-flex">
            <Phone size={17} />
            Bel direct
          </a>
          <button type="button" onClick={openQuote} className="btn-primary hidden lg:inline-flex">
            Offerte aanvragen
            <ArrowRight size={17} />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line bg-white lg:hidden"
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-whitewash lg:hidden">
          <div className="shell py-5">
            <div className="grid gap-1">
              {navLinks.map(([label, href]) => (
                <a
                  key={href}
                  href={isTermsPage ? `/${href}` : href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-md px-2 py-3 font-display text-xl font-bold text-navy"
                >
                  {label}
                  <ChevronRight size={18} />
                </a>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openQuote();
              }}
              className="btn-primary mt-4 w-full"
            >
              Gratis offerte aanvragen
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero({ openQuote }: { openQuote: () => void }) {
  return (
    <section className="relative min-h-[82dvh] overflow-hidden md:min-h-[calc(92dvh-5rem)]">
      <div className="absolute inset-0">
        <img
          src="/workspace-hero.webp"
          srcSet="/workspace-hero-mobile.webp 720w, /workspace-hero.webp 1536w"
          sizes="100vw"
          alt=""
          width={1536}
          height={1024}
          className="hero-bg h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,30,61,0.94)_0%,rgba(13,30,61,0.78)_46%,rgba(13,30,61,0.28)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-paper to-transparent" />
      </div>

      <div className="shell relative flex min-h-[82dvh] items-center py-14 md:min-h-[calc(92dvh-5rem)] md:py-24">
        <div className="w-full max-w-3xl pb-12">
          <p className="hero-reveal hero-reveal-1 eyebrow max-w-full text-[10px] tracking-[0.14em] text-roller-soft sm:text-xs sm:tracking-[0.18em]">
            Schilder en renovatiebedrijf in Woerden
          </p>
          <h1 className="hero-reveal hero-reveal-2 mt-5 max-w-full text-[2.45rem] font-extrabold leading-[0.98] text-white sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="block">RN Schilders</span>
            <span className="block">& Renovatie</span>
          </h1>
          <p className="hero-reveal hero-reveal-3 mt-6 max-w-2xl text-base leading-7 text-white/88 sm:text-lg sm:leading-8 md:text-xl">
            Vakwerk dat zichtbaar blijft. Richard werkt zelf mee op de vloer, bewaakt de afwerking en regelt schilderwerk, kozijnen, stucwerk en renovatie vanuit één aanspreekpunt.
          </p>

          <div className="hero-reveal hero-reveal-4 mt-8 flex flex-col gap-3 md:flex-row md:flex-wrap">
            <button type="button" onClick={openQuote} className="btn-primary w-full md:w-auto">
              Gratis prijsindicatie
              <ArrowRight size={18} />
            </button>
            <a href={phoneHref} className="btn-light w-full md:w-auto">
              <Phone size={18} />
              {phoneDisplay}
            </a>
          </div>

          <div className="hero-reveal hero-reveal-5 mt-8 grid max-w-2xl grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map(([value, label]) => (
              <div key={label} className="min-w-0 rounded-md border border-white/15 bg-white/10 p-4 text-white backdrop-blur-sm">
                <strong className="block font-display text-2xl font-extrabold">{value}</strong>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-white/85 sm:text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofStrip() {
  const items = [
    [BadgeCheck, 'Eigenaar werkt mee', 'Kwaliteit wordt op locatie bewaakt.'],
    [ShieldCheck, 'PKVW aandacht', 'Veilig hang- en sluitwerk voor kozijnen.'],
    [CalendarCheck, 'Heldere planning', 'Snel schakelen en afspraken nakomen.'],
    [Star, '5.0 op Google', 'Alle recente beoordelingen zijn vijf sterren.'],
  ] as const;

  return (
    <section className="relative -mt-8 z-10">
      <div className="shell">
        <div className="grid overflow-hidden rounded-lg border border-line bg-whitewash shadow-[0_24px_70px_-46px_rgba(13,30,61,0.55)] md:grid-cols-4">
          {items.map(([Icon, title, text]) => (
            <div key={title} className="border-b border-line p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
              <Icon className="text-roller" size={24} />
              <h2 className="mt-4 font-display text-lg font-extrabold text-navy">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-graphite">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OwnerSection({ openQuote }: { openQuote: () => void }) {
  return (
    <section className="section-pad">
      <div className="shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="grid gap-4 sm:grid-cols-[0.72fr_1fr]">
          <img src="/logo-mark.webp" alt="RN Schilders & Renovatie logo" width={800} height={679} className="aspect-[4/5] w-full rounded-lg object-contain p-4 sm:aspect-auto" loading="lazy" decoding="async" />
          <div className="grid gap-4">
            <img src="/hoogwerker.webp" alt="RN Schilders aan het werk bij buitenschilderwerk" width={810} height={540} className="h-full min-h-52 rounded-lg object-cover" loading="lazy" decoding="async" />
            <div className="rounded-lg border border-line bg-whitewash p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-graphite">Belofte</p>
              <img
                src="/slogan.webp"
                alt="Vakwerk met passie."
                width={500}
                height={341}
                className="mt-2 h-auto w-full max-w-xs"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>

        <div>
          <p className="eyebrow">Waarom dit vertrouwen geeft</p>
          <h2 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight text-navy md:text-5xl">
            Niet alleen een schilder, maar een meewerkend eigenaar op uw project.
          </h2>
          <p className="mt-6 text-lg leading-8 text-graphite">
            RN Schilders & Renovatie is gebouwd rond Richard: meer dan vijftien jaar ervaring, direct contact en zelf aanwezig bij de uitvoering. Dat maakt de websiteboodschap sterker dan een standaard aannemerssite: de klant weet wie er komt, wie aanspreekbaar is en wie het resultaat controleert.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {['Schilderwerk binnen en buiten', 'Kozijnen, houtrot en hang- en sluitwerk', 'Stucwerk, spuitwerk en renovatie', 'Gratis offerte met duidelijke scope'].map((item) => (
              <div key={item} className="flex gap-3 rounded-md border border-line bg-whitewash p-4">
                <Check className="mt-0.5 shrink-0 text-roller" size={19} />
                <span className="text-sm font-semibold leading-6 text-ink">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={openQuote} className="btn-dark">
              Plan een opname
              <ArrowRight size={17} />
            </button>
            <a href="#werk" className="btn-outline">
              Bekijk recent werk
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services({ openQuote }: { openQuote: () => void }) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <section id="diensten" className="section-pad bg-whitewash">
      <div className="shell">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Diensten</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-navy md:text-5xl">
              Alles voor een woning of pand dat weer strak, fris en goed beschermd is.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-graphite">
            Van schilderwerk tot renovatie: alle werkzaamheden staan kort bij elkaar, met extra uitleg wanneer u wilt doorlezen.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <button
              key={service.title}
              type="button"
              onClick={() => setSelectedService(service)}
              className="group overflow-hidden rounded-lg border border-line bg-white text-left transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-30px_rgba(13,30,61,0.65)] focus-visible:-translate-y-0.5"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={service.image}
                  alt=""
                  width={service.width}
                  height={service.height}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute left-4 top-4 rounded-md bg-navy p-3 text-white">
                  <service.icon size={22} />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-2xl font-extrabold text-navy">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-graphite">{service.text}</p>
                <div className="mt-5 grid gap-2">
                  {service.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-center gap-2 text-sm font-semibold text-ink">
                      <Check size={16} className="text-roller" />
                      {bullet}
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-2 text-sm font-bold text-roller">
                  Lees uitleg
                  <ArrowRight size={16} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} openQuote={openQuote} />
    </section>
  );
}

function ServiceModal({
  service,
  onClose,
  openQuote,
}: {
  service: Service | null;
  onClose: () => void;
  openQuote: () => void;
}) {
  useEffect(() => {
    if (!service) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [service, onClose]);

  if (!service) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-navy/70 p-4 backdrop-blur-sm md:p-6" role="dialog" aria-modal="true" aria-label={`${service.title} uitleg`}>
      <div className="mx-auto my-4 max-w-4xl overflow-hidden rounded-lg bg-whitewash shadow-2xl md:my-10">
        <div className="grid md:grid-cols-[0.85fr_1.15fr]">
          <div className="relative min-h-64 bg-navy">
            <img src={service.image} alt="" width={service.width} height={service.height} className="h-full w-full object-cover" />
            <div className="absolute left-5 top-5 rounded-md bg-navy p-3 text-white">
              <service.icon size={24} />
            </div>
          </div>
          <div className="p-5 md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Onze diensten</p>
                <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight text-navy">{service.detailTitle}</h2>
              </div>
              <button type="button" onClick={onClose} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-line bg-white" aria-label="Sluiten">
                <X size={22} />
              </button>
            </div>
            <p className="mt-5 text-base leading-7 text-graphite">{service.detailIntro}</p>
            <div className="mt-6 grid gap-5">
              {service.detailSections.map((section) => (
                <div key={section.title} className="rounded-md border border-line bg-white p-4">
                  <h3 className="font-display text-xl font-extrabold text-navy">{section.title}</h3>
                  <div className="mt-3 grid gap-2">
                    {section.items.map((item) => (
                      <div key={item} className="flex gap-2 text-sm leading-6 text-ink">
                        <Check className="mt-1 shrink-0 text-roller" size={16} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openQuote();
                }}
                className="btn-primary"
              >
                Gratis prijsindicatie
                <ArrowRight size={17} />
              </button>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-outline">
                <MessageCircle size={17} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedWork({ openQuote }: { openQuote: () => void }) {
  return (
    <section id="werk" className="section-pad bg-navy text-white">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow text-roller-soft">Recent werk</p>
            <h2 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
              Van versleten voordeur naar hoogglans visitekaartje.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/88">
              Foto’s maken het verschil tussen beloven en laten zien. Daarom krijgt recent werk hier de ruimte: voorbereiding, herstel en afwerking naast elkaar.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {['Schuren', 'Herstellen', 'Aflakken'].map((step, index) => (
                <div key={step} className="rounded-md border border-white/12 bg-white/8 p-4">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-roller-soft">Stap {index + 1}</span>
                  <strong className="mt-2 block font-display text-xl font-extrabold">{step}</strong>
                </div>
              ))}
            </div>

            <button type="button" onClick={openQuote} className="btn-primary mt-8">
              Ik wil dit resultaat
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['/voordeur-voor.webp', 'Voor'],
              ['/voordeur-tijdens.webp', 'Tijdens'],
              ['/voordeur-na.webp', 'Na'],
            ].map(([src, label]) => (
              <figure key={label} className="overflow-hidden rounded-lg bg-white/8">
                <img src={src} alt={`Voordeur ${label.toLowerCase()} behandeling`} width={451} height={590} className="aspect-[4/5] w-full object-cover" loading="lazy" decoding="async" />
                <figcaption className="border-t border-white/10 px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white/85">
                  {label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <ProjectSlideshow
            slides={['/interieur-slide-1.webp', '/interieur-slide-2.webp', '/interieur-slide-3.webp']}
            imageWidth={720}
            imageHeight={880}
            title="Interieur renovatie"
            text="Donkere luxe tint, strak afgewerkt en direct klaar voor gebruik."
          />
          <ProjectSlideshow
            slides={['/kantoor-slide-1.webp', '/kantoor-slide-2.webp', '/kantoor-slide-3.webp']}
            imageWidth={720}
            imageHeight={1072}
            title="Casco naar kantoor"
            text="Systeemwanden, isolatie, plafonds, stuc- en schilderwerk in één traject."
          />
        </div>

        <WorkShowcase openQuote={openQuote} />
      </div>
    </section>
  );
}

function ProjectSlideshow({
  slides,
  imageWidth,
  imageHeight,
  title,
  text,
}: {
  slides: string[];
  imageWidth: number;
  imageHeight: number;
  title: string;
  text: string;
}) {
  return (
    <article className="grid overflow-hidden rounded-lg border border-white/10 bg-white/8 md:grid-cols-[0.72fr_1fr]">
      <div className="project-slideshow relative min-h-72 overflow-hidden bg-navy md:h-full">
        {slides.map((slide, index) => (
          <img
            key={slide}
            src={slide}
            alt=""
            width={imageWidth}
            height={imageHeight}
            className="project-slide absolute inset-0 h-full w-full object-cover"
            style={{ animationDelay: `${index * 4}s` }}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
      <div className="p-6">
        <h3 className="font-display text-2xl font-extrabold">{title}</h3>
        <p className="mt-3 leading-7 text-white/88">{text}</p>
        <div className="mt-6 flex items-center gap-2 text-sm font-bold text-roller-soft">
          Bekijk projectaanpak
          <ArrowRight size={16} />
        </div>
      </div>
    </article>
  );
}

function WorkShowcase({ openQuote }: { openQuote: () => void }) {
  const allImages = useMemo(() => [...roofWindowStory, ...showcaseGroups.flatMap((group) => group.images)], []);
  const [selectedImage, setSelectedImage] = useState<ShowcaseImage | null>(null);

  useEffect(() => {
    if (!selectedImage) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedImage(null);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selectedImage]);

  return (
    <div className="mt-14 rounded-lg border border-white/10 bg-white/[0.06] p-4 sm:p-6 lg:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
        <div>
          <p className="eyebrow text-roller-soft">Werk in beeld</p>
          <h3 className="mt-3 font-display text-3xl font-extrabold leading-tight text-white md:text-4xl">
            Details gegroepeerd zoals u ze beoordeelt.
          </h3>
          <p className="mt-4 leading-7 text-white/82">
            Geen losse collage, maar beelden per onderwerp: kozijnen, interieurafwerking, deuren en werk in uitvoering.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {roofWindowStory.map((image) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setSelectedImage(image)}
              className="group overflow-hidden rounded-lg border border-white/10 bg-white/8 text-left transition hover:-translate-y-0.5 hover:bg-white/12 focus-visible:-translate-y-0.5"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  loading="lazy"
                  decoding="async"
                />
                <span className="absolute left-3 top-3 rounded-md bg-navy/88 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                  {image.label}
                </span>
                <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-md bg-white/90 text-navy opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Maximize2 size={17} />
                </span>
              </div>
              <div className="p-4">
                <strong className="block font-display text-lg font-extrabold text-white">{image.title}</strong>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {showcaseGroups.map((group) => (
          <article key={group.title} className="rounded-lg border border-white/10 bg-navy/35 p-4 sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h4 className="font-display text-2xl font-extrabold text-white">{group.title}</h4>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">{group.text}</p>
              </div>
              <span className="shrink-0 rounded-md border border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white/70">
                {group.images.length} beelden
              </span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {group.images.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`group relative overflow-hidden rounded-lg bg-white/8 text-left ${index === 0 && group.images.length > 2 ? 'col-span-2 row-span-2 sm:col-span-2' : ''}`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className={`w-full object-cover transition duration-500 group-hover:scale-[1.04] ${index === 0 && group.images.length > 2 ? 'aspect-[4/3] h-full sm:aspect-[16/10]' : 'aspect-square'}`}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent p-3 pt-10">
                    <span className="block text-xs font-bold uppercase tracking-[0.12em] text-roller-soft">{image.label}</span>
                    <span className="mt-1 block font-display text-sm font-extrabold text-white sm:text-base">{image.title}</span>
                  </span>
                  <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-md bg-white/90 text-navy opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                    <Maximize2 size={17} />
                  </span>
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-lg bg-whitewash p-5 text-navy sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="font-display text-2xl font-extrabold">Ook zo’n project laten beoordelen?</h4>
          <p className="mt-2 text-sm leading-6 text-graphite">
            Stuur foto’s mee met uw aanvraag. Dan kan RN Schilders sneller inschatten wat er nodig is.
          </p>
        </div>
        <button type="button" onClick={openQuote} className="btn-primary shrink-0">
          Foto’s meesturen
          <Upload size={17} />
        </button>
      </div>

      {selectedImage && <ImageLightbox image={selectedImage} images={allImages} onSelect={setSelectedImage} onClose={() => setSelectedImage(null)} />}
    </div>
  );
}

function ImageLightbox({
  image,
  images,
  onSelect,
  onClose,
}: {
  image: ShowcaseImage;
  images: ShowcaseImage[];
  onSelect: (image: ShowcaseImage) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-navy/88 p-4 backdrop-blur-sm md:p-6" role="dialog" aria-modal="true" aria-label={image.title}>
      <div className="mx-auto grid min-h-[calc(100dvh-2rem)] max-w-6xl content-center gap-4 md:min-h-[calc(100dvh-3rem)]">
        <div className="flex items-center justify-between gap-3 text-white">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-roller-soft">{image.label}</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold md:text-3xl">{image.title}</h2>
          </div>
          <button type="button" onClick={onClose} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white text-navy" aria-label="Sluiten">
            <X size={22} />
          </button>
        </div>
        <div className="overflow-hidden rounded-lg bg-black/30">
          <img src={image.src} alt={image.alt} width={image.width} height={image.height} className="max-h-[72dvh] w-full object-contain" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((item) => (
            <button
              key={item.src}
              type="button"
              onClick={() => onSelect(item)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border transition md:h-20 md:w-20 ${item.src === image.src ? 'border-roller bg-roller' : 'border-white/15 bg-white/10 opacity-70 hover:opacity-100'}`}
              aria-label={`${item.title}: ${item.label}`}
            >
              <img src={item.src} alt="" width={item.width} height={item.height} className="h-full w-full object-cover" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="section-pad">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="eyebrow">Reviews</p>
            <h2 className="mt-4 text-4xl font-extrabold leading-tight text-navy md:text-5xl">
              Recente klanten noemen precies wat nieuwe klanten willen weten.
            </h2>
            <div className="mt-7 rounded-lg border border-line bg-whitewash p-6">
              <div className="flex items-center gap-1 text-roller">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} size={22} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 font-display text-4xl font-extrabold text-navy">5.0 op Google</p>
              <p className="mt-2 text-sm leading-6 text-graphite">Gebaseerd op acht openbare beoordelingen uit maart 2026.</p>
            </div>
          </div>

          <div className="grid gap-5">
            {reviews.map((review) => (
              <article key={review.name} className="rounded-lg border border-line bg-whitewash p-6">
                <div className="flex items-center gap-1 text-roller">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} size={17} fill="currentColor" />
                  ))}
                </div>
                <blockquote className="mt-4 text-lg leading-8 text-ink">“{review.quote}”</blockquote>
                <p className="mt-5 text-sm font-bold text-navy">{review.name}</p>
                <p className="text-sm text-graphite">{review.date}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Process({ openQuote }: { openQuote: () => void }) {
  return (
    <section id="werkwijze" className="section-pad bg-whitewash">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="eyebrow">Werkwijze</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight text-navy md:text-5xl">
              Een renovatie voelt rustiger wanneer de stappen vooraf helder zijn.
            </h2>
            <div className="mt-9 grid gap-4">
              {processSteps.map(([title, text], index) => (
                <div key={title} className="grid grid-cols-[3rem_1fr] gap-4 rounded-lg border border-line bg-white p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-roller text-lg font-extrabold text-white">{index + 1}</div>
                  <div>
                    <h3 className="font-display text-xl font-extrabold text-navy">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-graphite">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-navy p-6 text-white md:p-8">
            <img src="/pkvw-logo.webp" alt="PKVW logo" width={450} height={160} className="h-14 w-auto rounded-md bg-white p-2" />
            <h3 className="mt-8 font-display text-3xl font-extrabold leading-tight">Gratis offerte, snelle opname en duidelijke scope.</h3>
            <p className="mt-4 leading-7 text-white/88">
              De oude offertepagina had vooral contactgegevens. Deze versie geeft bezoekers direct een route: bellen, mailen of projectinformatie achterlaten.
            </p>
            <button type="button" onClick={openQuote} className="btn-primary mt-7 w-full sm:w-auto">
              Start offerteaanvraag
              <MessageSquare size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact({ openQuote }: { openQuote: () => void }) {
  return (
    <section id="contact" className="section-pad">
      <div className="shell">
        <div className="grid overflow-hidden rounded-lg border border-line bg-whitewash lg:grid-cols-[0.9fr_1.1fr]">
          <div className="p-6 md:p-10">
            <p className="eyebrow">Contact</p>
            <h2 className="mt-4 text-4xl font-extrabold leading-tight text-navy md:text-5xl">RN Schilders is bereikbaar van maandag tot en met zaterdag.</h2>
            <div className="mt-8 grid gap-4">
              <ContactLine icon={Phone} label="Bel direct" value={phoneDisplay} href={phoneHref} />
              <ContactLine icon={Mail} label="E-mail" value={email} href={`mailto:${email}`} />
              <ContactLine icon={MapPin} label="Adres" value="Kuipersweg 33, 3449 JA Woerden" href={mapsHref} />
              <ContactLine icon={Clock3} label="Openingstijden" value="Maandag t/m zaterdag, 09.00-17.00" />
            </div>
            <button type="button" onClick={openQuote} className="btn-dark mt-8">
              Stuur projectinformatie
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="min-h-[420px] bg-navy">
            <iframe
              title="Kaart RN Schilders Woerden"
              src="https://www.google.com/maps?q=Kuipersweg%2033%203449%20JA%20Woerden&output=embed"
              width="600"
              height="420"
              className="h-full min-h-[420px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactLine({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex gap-4 rounded-md border border-line bg-white p-4">
      <Icon className="mt-1 shrink-0 text-roller" size={21} />
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-graphite">{label}</p>
        <p className="mt-1 font-semibold text-navy">{value}</p>
      </div>
    </div>
  );

  if (!href) return content;
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>
      {content}
    </a>
  );
}

type FilePreview = { file: File; key: string; url: string | null };

type QuoteFieldName =
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'email'
  | 'service'
  | 'serviceOther'
  | 'postalCode'
  | 'streetName'
  | 'houseNumber'
  | 'city'
  | 'preferredExecutionDate'
  | 'message';

type QuoteFieldErrors = Partial<Record<QuoteFieldName, string>>;

function QuoteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const serviceOptions = useMemo(() => services.map((service) => service.title), []);
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<QuoteFieldErrors>({});
  const [serviceValue, setServiceValue] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [attachmentNotice, setAttachmentNotice] = useState('');
  const formRef = useRef<HTMLFormElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isSubmitting = submitState === 'submitting';
  const isSuccess = submitState === 'success';
  const isLocalForm = isLocalFormHost();
  const shouldUseTurnstile = Boolean(turnstileSiteKey && !isLocalForm);
  const handleTurnstileToken = useCallback((token: string) => setTurnstileToken(token), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose, isSubmitting]);

  const previewsRef = useRef<FilePreview[]>([]);
  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);
  useEffect(() => {
    return () => {
      for (const preview of previewsRef.current) {
        if (preview.url) URL.revokeObjectURL(preview.url);
      }
    };
  }, []);

  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setPreviews((prev) => {
        for (const preview of prev) {
          if (preview.url) URL.revokeObjectURL(preview.url);
        }
        return [];
      });
      setSubmitState('idle');
      setSubmitMessage('');
      setFieldErrors({});
      setServiceValue('');
      setAttachmentNotice('');
      setTurnstileToken('');
      setTurnstileResetKey((value) => value + 1);
      formRef.current?.reset();
    }, 250);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!isSuccess) return;
    const t = setTimeout(onClose, SUCCESS_AUTO_CLOSE_MS);
    return () => clearTimeout(t);
  }, [isSuccess, onClose]);

  const clearFieldError = (field: QuoteFieldName) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleFieldChange = (field: QuoteFieldName) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    clearFieldError(field);
    if (field === 'service') {
      setServiceValue(event.currentTarget.value);
      clearFieldError('serviceOther');
    }
  };

  const validateQuoteForm = (form: HTMLFormElement): QuoteFieldErrors => {
    const formData = new FormData(form);
    const getValue = (field: QuoteFieldName) => String(formData.get(field) ?? '').trim();
    const errors: QuoteFieldErrors = {};
    const requiredFields: Array<[QuoteFieldName, string]> = [
      ['firstName', 'Vul uw voornaam in.'],
      ['lastName', 'Vul uw achternaam in.'],
      ['postalCode', 'Vul uw postcode in.'],
      ['streetName', 'Vul uw straatnaam in.'],
      ['houseNumber', 'Vul uw huisnummer in.'],
      ['city', 'Vul uw plaatsnaam in.'],
      ['service', 'Kies een dienst.'],
      ['preferredExecutionDate', 'Kies een gewenste uitvoeringsdatum.'],
      ['phone', 'Vul uw telefoonnummer in.'],
      ['email', 'Vul uw e-mailadres in.'],
      ['message', 'Beschrijf kort wat er moet gebeuren.'],
    ];

    for (const [field, message] of requiredFields) {
      if (!getValue(field)) errors[field] = message;
    }

    if (getValue('service') === 'other' && !getValue('serviceOther')) {
      errors.serviceOther = 'Vul de gewenste dienst in.';
    }

    const emailValue = getValue('email');
    if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      errors.email = 'Vul een geldig e-mailadres in.';
    }

    return errors;
  };

  const addFiles = (incoming: File[]) => {
    setPreviews((prev) => {
      const seen = new Set(prev.map((p) => p.key));
      const next: FilePreview[] = [...prev];
      let skippedDuplicate = 0;
      let skippedSize = 0;
      let skippedCap = 0;

      for (const file of incoming) {
        if (file.size === 0) continue;
        const key = `${file.name}__${file.size}__${file.lastModified}`;
        if (seen.has(key)) {
          skippedDuplicate += 1;
          continue;
        }
        if (file.size > MAX_ATTACHMENT_BYTES) {
          skippedSize += 1;
          continue;
        }
        if (next.length >= MAX_ATTACHMENTS) {
          skippedCap += 1;
          continue;
        }
        seen.add(key);
        next.push({ file, key, url: isImageFile(file) ? URL.createObjectURL(file) : null });
      }

      const notices: string[] = [];
      if (skippedCap > 0) notices.push(`Maximaal ${MAX_ATTACHMENTS} bestanden. ${skippedCap} bestand(en) overgeslagen.`);
      if (skippedSize > 0) notices.push(`${skippedSize} bestand(en) groter dan 10 MB overgeslagen.`);
      if (skippedDuplicate > 0) notices.push(`${skippedDuplicate} duplicaat overgeslagen.`);
      setAttachmentNotice(notices.join(' '));

      return next;
    });
  };

  const removeFile = (key: string) => {
    setPreviews((prev) => {
      const target = prev.find((p) => p.key === key);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.key !== key);
    });
    setAttachmentNotice('');
  };

  const submitQuote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const validationErrors = validateQuoteForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setSubmitState('error');
      setSubmitMessage('Controleer de gemarkeerde velden.');
      return;
    }

    if (!shouldUseTurnstile && !isLocalForm && !import.meta.env.DEV) {
      setSubmitState('error');
      setSubmitMessage('De spambeveiliging is nog niet ingesteld. Bel of mail RN Schilders direct.');
      return;
    }

    if (shouldUseTurnstile && !turnstileToken) {
      setSubmitState('error');
      setSubmitMessage('De spamcontrole is nog niet klaar. Probeer het formulier opnieuw te versturen.');
      return;
    }

    setSubmitState('submitting');
    setSubmitMessage('');
    setFieldErrors({});

    try {
      const formData = new FormData(form);
      formData.delete('files');
      for (const preview of previews) {
        formData.append('files', preview.file, preview.file.name);
      }
      if (turnstileToken) formData.set('cf-turnstile-response', turnstileToken);

      const response = await fetch('/api/forms/offerte', {
        method: 'POST',
        body: formData,
      });
      const result = (await response.json()) as { ok: boolean; message?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'De aanvraag kon niet worden verstuurd.');
      }

      setSubmitState('success');
      setSubmitMessage('Bedankt. RN Schilders heeft uw aanvraag ontvangen en neemt zo snel mogelijk contact op.');
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      const totalBytes = previews.reduce((sum, p) => sum + (p.file?.size ?? 0), 0);
      const beacon = JSON.stringify({
        name: err.name,
        message: err.message,
        online: typeof navigator !== 'undefined' ? navigator.onLine : null,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        attachmentCount: previews.length,
        attachmentBytes: totalBytes,
        turnstilePresent: Boolean(turnstileToken),
        href: typeof window !== 'undefined' ? window.location.href : null,
        ts: new Date().toISOString(),
      });
      try {
        const blob = new Blob([beacon], { type: 'application/json' });
        if (typeof navigator !== 'undefined' && navigator.sendBeacon?.('/api/forms/offerte/log', blob)) {
          // delivered
        } else {
          void fetch('/api/forms/offerte/log', { method: 'POST', body: beacon, headers: { 'content-type': 'application/json' }, keepalive: true }).catch(() => {});
        }
      } catch {
        // swallow — beacon is best-effort
      }
      setSubmitState('error');
      setSubmitMessage(err.message || 'De aanvraag kon niet worden verstuurd. Bel of mail RN Schilders direct.');
      setTurnstileToken('');
      setTurnstileResetKey((value) => value + 1);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-navy/70 p-4 backdrop-blur-sm md:p-6" role="dialog" aria-modal="true" aria-label="Offerte aanvragen">
      <div className="mx-auto my-4 max-w-3xl rounded-lg bg-whitewash shadow-2xl md:my-10">
        <div className="flex items-start justify-between gap-4 border-b border-line p-5 md:p-7">
          <div>
            <p className="eyebrow">Offerte aanvragen</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-navy">Vertel kort wat er moet gebeuren.</h2>
            <p className="mt-2 text-sm leading-6 text-graphite">Stuur de belangrijkste projectinformatie en eventueel foto's mee. Richard ontvangt uw aanvraag direct per e-mail.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-line bg-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Sluiten"
          >
            <X size={22} />
          </button>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center gap-4 px-6 py-16 text-center md:px-10 md:py-20">
            <div className="success-check flex h-20 w-20 items-center justify-center rounded-full bg-door text-white shadow-[0_18px_30px_-18px_rgba(35,83,63,0.9)]">
              <Check size={44} strokeWidth={3} />
            </div>
            <h3 className="font-display text-2xl font-extrabold text-navy md:text-3xl">Aanvraag verstuurd</h3>
            <p className="max-w-md text-sm leading-6 text-graphite">
              {submitMessage || 'Bedankt. RN Schilders heeft uw aanvraag ontvangen en neemt zo snel mogelijk contact op.'}
            </p>
            <div className="mt-2 h-1 w-48 overflow-hidden rounded-full bg-line">
              <div className="success-bar h-full bg-door" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-graphite">Dit venster sluit automatisch</p>
          </div>
        ) : (
          <div className="relative">
            <form
              ref={formRef}
              className={`grid gap-5 p-5 md:grid-cols-2 md:p-7 ${isSubmitting ? 'pointer-events-none select-none opacity-60' : ''}`}
              onSubmit={submitQuote}
              aria-busy={isSubmitting}
              noValidate
            >
              <label className="grid gap-2 text-sm font-bold text-navy">
                <span>Voornaam <RequiredMark /></span>
                <input className="field" name="firstName" placeholder="Voornaam" autoComplete="given-name" required onChange={handleFieldChange('firstName')} aria-invalid={Boolean(fieldErrors.firstName)} aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined} />
                <FieldError id="firstName-error" message={fieldErrors.firstName} />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                <span>Achternaam <RequiredMark /></span>
                <input className="field" name="lastName" placeholder="Achternaam" autoComplete="family-name" required onChange={handleFieldChange('lastName')} aria-invalid={Boolean(fieldErrors.lastName)} aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined} />
                <FieldError id="lastName-error" message={fieldErrors.lastName} />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                <span>Postcode <RequiredMark /></span>
                <input className="field" name="postalCode" placeholder="3449 JA" autoComplete="postal-code" required onChange={handleFieldChange('postalCode')} aria-invalid={Boolean(fieldErrors.postalCode)} aria-describedby={fieldErrors.postalCode ? 'postalCode-error' : undefined} />
                <FieldError id="postalCode-error" message={fieldErrors.postalCode} />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                <span>Plaatsnaam <RequiredMark /></span>
                <input className="field" name="city" placeholder="Woerden" autoComplete="address-level2" required onChange={handleFieldChange('city')} aria-invalid={Boolean(fieldErrors.city)} aria-describedby={fieldErrors.city ? 'city-error' : undefined} />
                <FieldError id="city-error" message={fieldErrors.city} />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                <span>Straatnaam <RequiredMark /></span>
                <input className="field" name="streetName" placeholder="Kuipersweg" autoComplete="address-line1" required onChange={handleFieldChange('streetName')} aria-invalid={Boolean(fieldErrors.streetName)} aria-describedby={fieldErrors.streetName ? 'streetName-error' : undefined} />
                <FieldError id="streetName-error" message={fieldErrors.streetName} />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                <span>Huisnummer <RequiredMark /></span>
                <input className="field" name="houseNumber" placeholder="33" autoComplete="address-line2" required onChange={handleFieldChange('houseNumber')} aria-invalid={Boolean(fieldErrors.houseNumber)} aria-describedby={fieldErrors.houseNumber ? 'houseNumber-error' : undefined} />
                <FieldError id="houseNumber-error" message={fieldErrors.houseNumber} />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                <span>Dienst <RequiredMark /></span>
                <select className="field" name="service" value={serviceValue} required onChange={handleFieldChange('service')} aria-invalid={Boolean(fieldErrors.service)} aria-describedby={fieldErrors.service ? 'service-error' : undefined}>
                  <option value="">Kies een dienst</option>
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                  <option value="Totaalrenovatie">Totaalrenovatie</option>
                  <option value="other">Anders</option>
                </select>
                <FieldError id="service-error" message={fieldErrors.service} />
              </label>
              {serviceValue === 'other' && (
                <label className="grid gap-2 text-sm font-bold text-navy">
                  <span>Dienst toelichting <RequiredMark /></span>
                  <input className="field" name="serviceOther" placeholder="Welke dienst zoekt u?" required onChange={handleFieldChange('serviceOther')} aria-invalid={Boolean(fieldErrors.serviceOther)} aria-describedby={fieldErrors.serviceOther ? 'serviceOther-error' : undefined} />
                  <FieldError id="serviceOther-error" message={fieldErrors.serviceOther} />
                </label>
              )}
              <label className="grid gap-2 text-sm font-bold text-navy">
                <span>Gewenste uitvoeringsdatum <RequiredMark /></span>
                <input className="field" name="preferredExecutionDate" type="date" required onChange={handleFieldChange('preferredExecutionDate')} aria-invalid={Boolean(fieldErrors.preferredExecutionDate)} aria-describedby={fieldErrors.preferredExecutionDate ? 'preferredExecutionDate-error' : undefined} />
                <FieldError id="preferredExecutionDate-error" message={fieldErrors.preferredExecutionDate} />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                <span>Telefoonnummer <RequiredMark /></span>
                <input className="field" name="phone" placeholder={phoneDisplay} autoComplete="tel" required onChange={handleFieldChange('phone')} aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? 'phone-error' : undefined} />
                <FieldError id="phone-error" message={fieldErrors.phone} />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                <span>E-mailadres <RequiredMark /></span>
                <input className="field" name="email" type="email" placeholder={email} autoComplete="email" required onChange={handleFieldChange('email')} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? 'email-error' : undefined} />
                <FieldError id="email-error" message={fieldErrors.email} />
              </label>
              <div className="rounded-md border border-line bg-white p-4 md:col-span-2">
                <input type="hidden" name="urgent" value="Nee" />
                <label className="flex items-start gap-3 text-sm font-bold text-navy">
                  <input type="checkbox" name="urgent" value="Ja" className="mt-1 h-4 w-4 rounded border-line text-roller focus:ring-roller" />
                  <span>
                    Spoed
                    <span className="block text-xs font-semibold leading-5 text-graphite">Aanvinken als de aanvraag urgent is.</span>
                  </span>
                </label>
              </div>
              <label className="grid gap-2 text-sm font-bold text-navy md:col-span-2">
                <span>Projectomschrijving <RequiredMark /></span>
                <textarea
                  className="field min-h-32 resize-y"
                  name="message"
                  placeholder="Bijvoorbeeld: buitenschilderwerk kozijnen, houtrot bij voordeur, stucwerk woonkamer..."
                  required
                  onChange={handleFieldChange('message')}
                  aria-invalid={Boolean(fieldErrors.message)}
                  aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                />
                <FieldError id="message-error" message={fieldErrors.message} />
              </label>

              <div className="md:col-span-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={attachmentAccept}
                  multiple
                  className="sr-only"
                  onChange={(event) => {
                    const picked = Array.from(event.currentTarget.files ?? []);
                    if (picked.length) addFiles(picked);
                    event.currentTarget.value = '';
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={previews.length >= MAX_ATTACHMENTS}
                  className="flex w-full items-center justify-between gap-4 rounded-md border border-dashed border-navy/25 bg-white p-4 text-left text-sm font-bold text-navy transition hover:border-roller/60 hover:bg-roller/5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="flex items-center gap-3">
                    <Upload size={20} className="text-roller" />
                    {previews.length === 0 ? "Foto's of PDF meesturen" : 'Meer bestanden toevoegen'}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-graphite">
                    {previews.length}/{MAX_ATTACHMENTS}
                  </span>
                </button>
                {attachmentNotice && (
                  <p className="mt-2 text-xs font-semibold text-roller" role="status">
                    {attachmentNotice}
                  </p>
                )}
                {previews.length > 0 && (
                  <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {previews.map((preview) => (
                      <li key={preview.key} className="group relative overflow-hidden rounded-md border border-line bg-white">
                        <div className="flex aspect-square items-center justify-center bg-paper">
                          {preview.url ? (
                            <img src={preview.url} alt={preview.file.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-2 p-3 text-center">
                              <FileText size={28} className="text-roller" />
                              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-graphite">
                                {preview.file.name.split('.').pop()?.toUpperCase() || 'Bestand'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="border-t border-line px-2 py-1.5">
                          <p className="truncate text-xs font-semibold text-navy" title={preview.file.name}>
                            {preview.file.name}
                          </p>
                          <p className="text-[10px] text-graphite">{formatFileSize(preview.file.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(preview.key)}
                          aria-label={`${preview.file.name} verwijderen`}
                          className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-navy/85 text-white shadow-md transition hover:bg-navy md:opacity-0 md:focus:opacity-100 md:group-hover:opacity-100"
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="md:col-span-2">
                {shouldUseTurnstile ? (
                  <TurnstileWidget siteKey={turnstileSiteKey} resetKey={turnstileResetKey} onTokenChange={handleTurnstileToken} />
                ) : (
                  <input type="hidden" name="cf-turnstile-response" value="dev" />
                )}
              </div>
              {submitMessage && submitState === 'error' && (
                <div
                  className="rounded-md border border-roller/25 bg-roller/10 p-4 text-sm font-semibold text-roller md:col-span-2"
                  role="status"
                >
                  {submitMessage}
                </div>
              )}
              <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center md:justify-between">
                <p className="text-sm leading-6 text-graphite">
                  Liever direct bellen? RN Schilders is bereikbaar via{' '}
                  <a href={phoneHref} className="font-bold text-navy underline decoration-roller/50 underline-offset-4">
                    {phoneDisplay}
                  </a>
                  .
                </p>
                <button type="submit" className="btn-primary disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting}>
                  Verstuur aanvraag
                  <ArrowRight size={17} />
                </button>
              </div>
            </form>
            {isSubmitting && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-b-lg bg-whitewash/85 backdrop-blur-[2px]"
                role="status"
                aria-live="polite"
              >
                <Loader2 size={40} className="animate-spin text-roller" />
                <p className="text-sm font-bold text-navy">Aanvraag wordt verstuurd…</p>
                <p className="text-xs text-graphite">Even geduld, dit duurt maximaal een paar seconden.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function RequiredMark() {
  return <span className="text-roller" aria-hidden="true">*</span>;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-xs font-semibold text-roller" role="alert">
      {message}
    </p>
  );
}

function TurnstileWidget({
  siteKey,
  resetKey,
  onTokenChange,
}: {
  siteKey: string;
  resetKey: number;
  onTokenChange: (token: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const hasResetSignalMountedRef = useRef(false);

  useEffect(() => {
    let timer: number | undefined;
    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || widgetIdRef.current || !containerRef.current || !window.turnstile?.render) return false;

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onTokenChange,
        'expired-callback': () => onTokenChange(''),
        'error-callback': () => onTokenChange(''),
      });
      return true;
    };

    if (!renderWidget()) {
      timer = window.setInterval(() => {
        if (renderWidget() && timer) window.clearInterval(timer);
      }, 150);
    }

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
      if (widgetIdRef.current) {
        try {
          window.turnstile?.remove?.(widgetIdRef.current);
        } catch {
          // Turnstile may already have removed the iframe while the modal is unmounting.
        }
        widgetIdRef.current = null;
      }
      onTokenChange('');
    };
  }, [onTokenChange, siteKey]);

  useEffect(() => {
    if (!hasResetSignalMountedRef.current) {
      hasResetSignalMountedRef.current = true;
      return;
    }
    if (!widgetIdRef.current) return;
    try {
      window.turnstile?.reset?.(widgetIdRef.current);
    } catch {
      return;
    }
    onTokenChange('');
  }, [onTokenChange, resetKey]);

  return <div ref={containerRef} />;
}

function TermsPage({ openQuote }: { openQuote: () => void }) {
  return (
    <section className="bg-paper">
      <div className="bg-navy text-white">
        <div className="shell grid gap-8 py-10 md:grid-cols-[1fr_auto] md:items-center md:py-14">
          <div className="max-w-3xl">
            <p className="eyebrow text-roller-soft">Versie april 2026</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">Algemene Voorwaarden RN Schilders & Renovatie</h1>
            <div className="mt-6 grid gap-2 text-sm leading-6 text-white/88 sm:grid-cols-2">
              <p>Kuipersweg 33, 3449 JA Woerden</p>
              <p>KvK: 98075357 | BTW: NL005307357B55</p>
              <p>
                <a href={`mailto:${email}`} className="underline decoration-roller-soft/70 underline-offset-4">
                  {email}
                </a>
              </p>
              <p>
                <a href={phoneHref} className="underline decoration-roller-soft/70 underline-offset-4">
                  0645 17 27 26
                </a>
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center rounded-lg border border-white/12 bg-white/8 p-6">
            <img src="/logo-mono.webp" alt="RN Schilders & Renovatie logo" width={470} height={457} className="h-32 w-32 object-contain md:h-40 md:w-40" />
          </div>
        </div>
      </div>

      <div className="shell py-10 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[17rem_1fr] lg:items-start">
          <aside className="rounded-lg border border-line bg-whitewash p-5 lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
              <FileText className="text-roller" size={22} />
              <p className="font-display text-lg font-extrabold text-navy">Document</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite">
              Deze pagina bevat de algemene voorwaarden van RN Schilders & Renovatie.
            </p>
            <div className="mt-5 grid gap-3">
              <a href="/" className="btn-outline w-full px-4">
                Terug naar website
              </a>
              <button type="button" onClick={openQuote} className="btn-primary w-full px-4">
                Offerte aanvragen
              </button>
            </div>
          </aside>

          <article className="rounded-lg border border-line bg-whitewash p-5 shadow-[0_24px_70px_-54px_rgba(13,30,61,0.55)] md:p-8">
            <div className="border-b border-line pb-6">
              <p className="text-sm font-semibold leading-6 text-graphite">
                RN Schilders & Renovatie | Kuipersweg 33, 3449 JA Woerden | KvK 98075357 | BTW NL005307357B55
              </p>
            </div>

            <div className="mt-8 grid gap-8">
              {termsSections.map((section) => (
                <section key={section.title} className="scroll-mt-24">
                  <h2 className="font-display text-2xl font-extrabold leading-tight text-navy md:text-3xl">{section.title}</h2>
                  <div className="mt-4 grid gap-3">
                    {section.items.map((item, index) =>
                      typeof item === 'string' ? (
                        <p key={`${section.title}-${index}`} className="text-base leading-8 text-graphite">
                          {item}
                        </p>
                      ) : (
                        <div key={`${section.title}-${index}`} className="grid gap-3">
                          <p className="text-base leading-8 text-graphite">{item.text}</p>
                          <div className="grid gap-2 pl-4 sm:pl-6">
                            {item.subitems.map((subitem) => (
                              <p key={subitem} className="text-base leading-8 text-graphite">
                                {subitem}
                              </p>
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-10 border-t border-line pt-6">
              <p className="text-sm font-semibold leading-6 text-graphite">
                RN Schilders & Renovatie | Kuipersweg 33, 3449 JA Woerden | KvK 98075357 | BTW NL005307357B55
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function MobileCta({ openQuote }: { openQuote: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 440);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 grid grid-cols-[0.88fr_1.12fr] gap-2 bg-whitewash/94 px-4 pt-3 shadow-[0_-12px_30px_-24px_rgba(13,30,61,0.8)] backdrop-blur-md md:hidden">
      <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-outline px-3">
        <MessageCircle size={17} />
        WhatsApp
      </a>
      <button type="button" onClick={openQuote} className="btn-primary px-3 text-xs sm:text-sm">
        Gratis prijsindicatie
      </button>
    </div>
  );
}

function TrustooWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://static.trustoo.nl/widget/widget_v2.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="trustoo-widget"
      data-id="uOmxp_aP-RjJ2uxfXOoY5KO9OTh1N2Y-3cH8Hpx4ezRvSg"
      data-language-code="nl"
      data-country-code="NL"
      data-badge="hidden"
      data-quote="default"
      data-size="small"
      data-type="landscape"
      data-border="shadow"
      data-theme="light"
      data-background="default"
      data-google="default"
    />
  );
}

function Footer() {
  return (
    <footer className="bg-ink pb-28 pt-10 text-white md:pb-10">
      <div className="shell flex flex-col gap-8">
        <TrustooWidget />
        <div className="flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo-mono.webp" alt="" width={470} height={457} className="h-14 w-14 shrink-0 object-contain" loading="lazy" decoding="async" />
            <div>
              <p className="font-display text-2xl font-extrabold">RN Schilders & Renovatie</p>
              <p className="mt-2 text-sm text-white/85">Vakwerk dat zichtbaar blijft in Woerden en omgeving.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-semibold text-white/88">
            <a href="https://www.facebook.com/profile.php?id=61588338225794" target="_blank" rel="noreferrer" className="hover:text-white">
              Facebook
            </a>
            <a href="https://www.instagram.com/rn.schilders/" target="_blank" rel="noreferrer" className="hover:text-white">
              Instagram
            </a>
            <a href={`mailto:${email}`} className="hover:text-white">
              {email}
            </a>
            <a href="/algemene-voorwaarden" className="hover:text-white">
              Algemene voorwaarden
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default App;
