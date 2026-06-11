import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  ChevronLeft,
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
  MoveHorizontal,
  PaintRoller,
  Phone,
  Play,
  Ruler,
  ShieldCheck,
  Sparkles,
  Star,
  Upload,
  Wrench,
  X,
} from 'lucide-react';

const phoneDisplay = '085 060 6309';
const phoneHref = 'tel:+31850606309';
const whatsappHref = 'https://wa.me/31645172726?text=Hallo%20RN%20Schilders%2C%20ik%20wil%20graag%20een%20gratis%20prijsindicatie%20aanvragen.';
// Email stays on the rn-schilders.nl domain for now; only the public site URL moves.
const email = 'info@rnschilders.nl';
const mapsHref = 'https://www.google.com/maps/search/?api=1&query=Kuipersweg+33+3449+JA+Woerden';
const siteUrl = 'https://rnschilders.nl';
const siteName = 'RN Schilders & Renovatie';
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

type ServiceImage = string | { src: string; alt: string };

type Service = {
  title: string;
  slug: string;
  text: string;
  image: string;
  images?: ServiceImage[];
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
  seoTitle: string;
  seoDescription: string;
  faqs: Array<{ question: string; answer: string }>;
};

type LocationPage = {
  title: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  lead: string;
  routeNote: string;
  localFit: string;
  areas: string[];
  featuredServices: string[];
  commonRequests: string[];
  serviceLinks: Array<{
    label: string;
    serviceTitle: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  heroImage?: { src: string; alt: string; width: number; height: number };
  projectStory?: {
    eyebrow: string;
    title: string;
    intro: string[];
    images: Array<{ src: string; alt: string; width: number; height: number; caption: string }>;
  };
};

type WorkAreaGroup = {
  title: string;
  text: string;
  slugs: string[];
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
  ['Over ons', '/over-ons'],
  ['Werkgebied', '/werkgebied'],
  ['Contact', '/contact'],
] as const;

const services: Service[] = [
  {
    title: 'Schilderwerk',
    slug: 'schilderwerk-woerden',
    text: 'Binnen en buiten strak afgewerkt met duurzame verfproducten, van muren en plafonds tot kozijnen, deuren en boeidelen.',
    image: '/showcase-progress-ceiling-paint.webp',
    images: [
      { src: '/showcase-progress-ceiling-paint.webp', alt: 'Schilder van RN Schilders rolt een plafond in een afgeplakte keuken' },
      { src: '/schilderwerk-almere-erker-glas-in-lood.webp', alt: 'Strak geschilderde kamer met glas-in-lood kozijnen na schilderwerk in Almere' },
      { src: '/schilderwerk-almere-kozijn-glas-in-lood.webp', alt: 'In creme gelakt binnenkozijn met glas-in-lood bovenlichten, schilderwerk in Almere' },
      { src: '/schilderwerk-almere-binnendeur.webp', alt: 'Nieuw gelakte creme binnendeur tijdens renovatie in Almere' },
      { src: '/schilderwerk-almere-dagkant-lak.webp', alt: 'Hoogglans gelakte dagkant naast een glas-in-lood raam in Almere' },
      { src: '/schilderwerk-almere-wand-structuur.webp', alt: 'Wand met structuurafwerking en gelakte kozijnen na schilderwerk in Almere' },
      { src: '/schilderwerk-almere-tuinraam.webp', alt: 'Gelakt draairaam met tuinzicht na binnenschilderwerk in Almere' },
      { src: '/schilderwerk-2.webp?v=20260517', alt: 'Slaapkamer met diepzwarte paneelwanden na binnenschilderwerk' },
      { src: '/schilderwerk-3.webp?v=20260514', alt: 'Verfblikken op de hoogwerker tijdens buitenschilderwerk' },
    ],
    width: 1200,
    height: 900,
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
    seoTitle: 'Schilderwerk in Woerden | Binnen en buiten | RN Schilders',
    seoDescription:
      'Binnen- en buitenschilderwerk in Woerden door RN Schilders. Strakke afwerking van muren, plafonds, kozijnen en boeidelen met duurzame verf. Vraag een gratis offerte aan.',
    faqs: [
      {
        question: 'Doen jullie zowel binnen- als buitenschilderwerk?',
        answer:
          'Ja. Binnen schilderen we muren, plafonds, kozijnen, deuren en trappen. Buiten richten we ons op kozijnen, deuren, boeidelen en gevelhout, altijd met grondige voorbereiding.',
      },
      {
        question: 'Welke verf gebruiken jullie?',
        answer:
          'We werken met hoogwaardige, duurzame verfproducten die passen bij de ondergrond en het gebruik. Zo blijft het werk langer mooi en beschermd tegen vocht en UV.',
      },
      {
        question: 'Geven jullie garantie op buitenschilderwerk?',
        answer:
          'Op buitenschilderwerk geldt een garantie van vijf jaar, mits het werk volgens afspraak wordt onderhouden. De voorwaarden staan in onze algemene voorwaarden.',
      },
    ],
  },
  {
    title: 'Kozijnen',
    slug: 'kozijnen-woerden',
    text: 'Renovatie, plaatsing en herstel van houten en kunststof kozijnen, inclusief hang- en sluitwerk met PKVW-focus.',
    image: '/kozijnen-7.webp?v=20260517',
    images: [
      '/kozijnen-7.webp?v=20260517',
      '/kozijnen-6.webp?v=20260517',
      '/kozijnen-5.webp',
    ],
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
    seoTitle: 'Kozijnen in Woerden | Hout en kunststof | RN Schilders',
    seoDescription:
      'Houten en kunststof kozijnen in Woerden: plaatsing, renovatie en herstel met PKVW hang- en sluitwerk. RN Schilders adviseert per woning. Vraag een gratis offerte aan.',
    faqs: [
      {
        question: 'Werken jullie met houten en kunststof kozijnen?',
        answer:
          'Ja. Houten kozijnen geven een warme uitstraling en zijn goed te herstellen; kunststof kozijnen zijn onderhoudsarm en kleurvast. We adviseren wat per woning het beste past.',
      },
      {
        question: 'Wat is PKVW hang- en sluitwerk?',
        answer:
          'PKVW staat voor het Politiekeurmerk Veilig Wonen. We besteden aandacht aan inbraakwerend hang- en sluitwerk, zodat uw kozijnen veilig afsluiten.',
      },
      {
        question: 'Kunnen kozijnen hersteld worden in plaats van vervangen?',
        answer:
          'Vaak wel. Bij beperkte schade of houtrot herstellen we het hout gericht, zodat volledige vervanging niet altijd nodig is.',
      },
    ],
  },
  {
    title: 'Spuitwerk',
    slug: 'spuitwerk-woerden',
    text: 'Egaal spuitwerk voor woningen, kantoren en bedrijfspanden wanneer tempo en een moderne afwerking belangrijk zijn.',
    image: '/spuitwerk-1.webp?v=20260516',
    images: [
      '/spuitwerk-1.webp?v=20260516',
      '/spuitwerk-2.webp?v=20260516',
    ],
    width: 1536,
    height: 1024,
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
    seoTitle: 'Spuitwerk in Woerden | Strakke afwerking | RN Schilders',
    seoDescription:
      'Egaal spuitwerk in Woerden voor woningen, kantoren en bedrijfspanden. Strakke, moderne afwerking van muren en plafonds met zorgvuldige voorbereiding. Vraag een gratis offerte aan.',
    faqs: [
      {
        question: 'Waarom kiezen voor spuitwerk in plaats van rollen?',
        answer:
          'Spuitwerk geeft een egaal, strak en modern resultaat, vooral op grote oppervlakken. Het werkt efficiënt en laat geen rolstructuur achter.',
      },
      {
        question: 'Voor welke ruimtes is spuitwerk geschikt?',
        answer:
          'Voor woningen, nieuwbouw, kantoren, winkels en bedrijfspanden. We spuiten muren, plafonds en andere grote vlakken.',
      },
      {
        question: 'Hoe bereiden jullie de ruimte voor?',
        answer:
          'We reinigen en maken de ondergrond glad, herstellen beschadigingen en plakken vloeren, ramen en deuren zorgvuldig af voordat we beginnen.',
      },
    ],
  },
  {
    title: 'Stucwerk',
    slug: 'stucwerk-woerden',
    text: 'Gladde wanden en plafonds als sterke basis voor schilderwerk, renovatiestuc en reparaties in bestaande woningen.',
    image: '/stucwerk-almere-plamuren-raamwand.webp',
    images: [
      { src: '/stucwerk-almere-plamuren-raamwand.webp', alt: 'Stukadoor van RN Schilders plamuurt een wand bij het kozijn tijdens renovatie in Almere' },
      { src: '/stucwerk-almere-behang-verwijderen.webp', alt: 'Oud behang verwijderen als voorbereiding op stucwerk in Almere' },
      { src: '/stucwerk-almere-wand-uitvlakken.webp', alt: 'Wand uitvlakken en naden bijwerken voor strak stucwerk in Almere' },
      { src: '/stucwerk-almere-dagkant-kozijn.webp', alt: 'Dagkant bij het kozijn strak afwerken tijdens stucwerk in Almere' },
      { src: '/stucwerk-almere-trapgat-strak.webp', alt: 'Strak gestuukt trapgat klaar voor schilderwerk in Almere' },
      { src: '/stucwerk-almere-wanden-gereed.webp', alt: 'Glad gestuukte wanden klaar voor afwerking in Almere' },
    ],
    width: 1200,
    height: 900,
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
    seoTitle: 'Stucwerk in Woerden | Gladde wanden en plafonds | RN Schilders',
    seoDescription:
      'Strak stucwerk in Woerden voor gladde wanden en plafonds, als basis voor schilder- of spuitwerk. Inclusief voorbereiding en schadeherstel. Vraag een gratis offerte aan.',
    faqs: [
      {
        question: 'Wat is het verschil tussen stucwerk en spuitwerk?',
        answer:
          'Stucwerk maakt wanden en plafonds glad als basis; spuitwerk is een afwerktechniek. We combineren beide vaak voor een strak eindresultaat.',
      },
      {
        question: 'Doen jullie ook reparaties aan bestaand stucwerk?',
        answer:
          'Ja. We herstellen scheuren en beschadigingen en bereiden de ondergrond voor, zodat de afwerking weer strak wordt.',
      },
      {
        question: 'Is stucwerk geschikt voor renovatie en nieuwbouw?',
        answer:
          'Ja, voor allebei. We stemmen de aanpak af op de staat van de ondergrond en de gewenste afwerking.',
      },
    ],
  },
  {
    title: 'Houtrotherstel',
    slug: 'houtrotherstel-woerden',
    text: 'Aangetast houtwerk duurzaam herstellen voordat vocht grotere schade veroorzaakt aan kozijnen, deuren of boeidelen.',
    image: '/houtrotherstel.webp',
    images: [
      '/houtrotherstel.webp',
      '/houtrotherstel-2.webp?v=20260517',
    ],
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
    seoTitle: 'Houtrotherstel in Woerden | Kozijnen en buitenhout | RN Schilders',
    seoDescription:
      'Houtrotherstel in Woerden voor kozijnen, deuren en boeidelen. RN Schilders herstelt aangetast hout duurzaam voordat vocht grotere schade veroorzaakt. Vraag een gratis offerte aan.',
    faqs: [
      {
        question: 'Hoe weet ik of ik houtrot heb?',
        answer:
          'Zacht, verkleurd of afbladderend hout bij kozijnen, dorpels of boeidelen wijst vaak op houtrot. Bij twijfel kijkt Richard tijdens de opname mee.',
      },
      {
        question: 'Moet aangetast hout altijd vervangen worden?',
        answer:
          'Niet altijd. Bij beperkte schade verwijderen we het rotte deel en herstellen we met gespecialiseerde reparatieproducten, daarna schuren, gronden en schilderen we het bij.',
      },
      {
        question: 'Kan houtrot terugkomen?',
        answer:
          'Met goed herstel, afwerking en onderhoud blijft het hout lang beschermd. We geven preventief advies om vocht buiten te houden.',
      },
    ],
  },
  {
    title: 'Sloopwerk',
    slug: 'sloopwerk-woerden',
    text: 'Zorgvuldig voorbereid sloopwerk voor renovaties, zodat de ruimte schoon, veilig en klaar is voor de volgende stap.',
    image: '/sloopwerk.webp?v=20260514',
    images: [
      '/sloopwerk.webp?v=20260514',
      '/sloopwerk-2.webp?v=20260514',
      '/sloopwerk-3.webp?v=20260517',
    ],
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
    seoTitle: 'Sloopwerk in Woerden | Voorbereiding renovatie | RN Schilders',
    seoDescription:
      'Zorgvuldig sloopwerk in Woerden als voorbereiding op renovatie. RN Schilders verwijdert oude materialen veilig en netjes, klaar voor herstel en afwerking. Vraag een gratis offerte aan.',
    faqs: [
      {
        question: 'Hoort sloopwerk bij een renovatie?',
        answer:
          'Vaak wel. Sloopwerk is meestal de eerste fase: oude wanden, afwerkingen en plafondmaterialen verwijderen voordat herstel en afwerking beginnen.',
      },
      {
        question: 'Voeren jullie het sloopafval af?',
        answer:
          'In overleg. We halen materialen zorgvuldig los en regelen de afvoer zoals afgesproken in de offerte.',
      },
      {
        question: 'Sluit het sloopwerk aan op de afwerking?',
        answer:
          'Ja. We gaan direct door naar herstel, stucwerk, schilderwerk of spuitwerk, zodat het hele traject bij één partij ligt.',
      },
    ],
  },
];

const locationPages: LocationPage[] = [
  {
    title: 'Woerden',
    slug: 'schilder-woerden',
    seoTitle: 'Schilder in Woerden en omgeving | RN Schilders & Renovatie',
    seoDescription:
      'Schilder uit Woerden voor buiten- en binnenschilderwerk, kozijnen, houtrotherstel en renovatie. Bekijk recent werk in de regio Woerden en vraag een gratis prijsindicatie aan.',
    lead:
      'RN Schilders & Renovatie is gevestigd aan de Kuipersweg in Woerden, en het grootste deel van ons werk ligt binnen een kwartier rijden. Van de jaren-30 woningen rond het centrum en de Bloemen- en Bomenbuurt tot de nieuwere wijken Snel en Polanen en Waterrijk vraagt elk type woning om een eigen aanpak van buitenhout, kozijnen en gevels. Richard komt zelf langs, beoordeelt de staat van het werk en zorgt dat u vooraf weet wat er nodig is.',
    routeNote:
      'Bij een opname in Woerden kijken we eerst naar de delen die het meeste te verduren krijgen: dorpels, raamhoeken, boeidelen en de onderkant van kozijnen. Daar begint vocht. Per onderdeel bepalen we of een nieuwe verflaag volstaat of dat eerst houtrotherstel, nieuw kitwerk of grondwerk nodig is, zodat het schilderwerk daarna jaren meegaat.',
    localFit:
      'Binnen pakken we na een verbouwing of verhuizing wanden, plafonds, trappen en kozijnen aan, met stucwerk of latex spuiten als dat strakker uitpakt. Omdat we uit Woerden komen zijn de lijnen kort: een extra blik op locatie of een snelle aanpassing in de planning is zo geregeld.',
    areas: ['Woerden', 'Harmelen', 'Kamerik', 'Zegveld', 'Montfoort', 'Oudewater', 'Linschoten', 'Snel en Polanen', 'Waterrijk'],
    featuredServices: ['Schilderwerk', 'Kozijnen', 'Houtrotherstel', 'Stucwerk'],
    commonRequests: [
      'Buitenschilderwerk aan kozijnen, voordeuren en boeidelen bij jaren-30 woningen rond het centrum van Woerden.',
      'Houtrotherstel aan dorpels en raamhoeken voordat de gevel weer volledig in de lak gaat.',
      'Strak binnenschilderwerk, stucwerk of latex spuiten na een verbouwing in Snel en Polanen of Waterrijk.',
    ],
    serviceLinks: [
      { label: 'Buitenschilderwerk in Woerden', serviceTitle: 'Schilderwerk' },
      { label: 'Kozijnen in Woerden', serviceTitle: 'Kozijnen' },
      { label: 'Houtrotherstel in Woerden', serviceTitle: 'Houtrotherstel' },
    ],
    faqs: [
      {
        question: 'Komt Richard zelf langs voor een opname in Woerden?',
        answer: 'Ja. Omdat we in Woerden gevestigd zijn, plant Richard een opname meestal snel in. Hij beoordeelt het werk zelf op locatie, zodat de offerte aansluit op wat er echt nodig is.',
      },
      {
        question: 'Werken jullie aan zowel oudere als nieuwere woningen?',
        answer: 'Ja. Bij oudere woningen rond het centrum ligt de nadruk op buitenhout, houtrot en kozijnen. In nieuwere wijken zoals Snel en Polanen en Waterrijk gaat het vaker om afwerking na verbouwing of het strak houden van kozijnen en gevels.',
      },
      {
        question: 'Hoe snel kan het werk starten?',
        answer: 'Dat hangt af van het seizoen en de omvang, maar door de korte lijnen vanuit Woerden kunnen we vaak vlot een datum afspreken. In de offerte staat een duidelijke indicatie van de planning.',
      },
      {
        question: 'Geven jullie garantie op het schilderwerk?',
        answer: 'Op buitenschilderwerk geldt een garantie van vijf jaar, mits het werk volgens afspraak wordt onderhouden. De voorwaarden staan in onze algemene voorwaarden.',
      },
    ],
    heroImage: {
      src: '/woerden-vakwerk-hero.webp?v=20260604',
      alt: 'Woning in Woerden in de steigers met RN Schilders spandoek tijdens buitenschilderwerk',
      width: 1500,
      height: 1125,
    },
    projectStory: {
      eyebrow: 'Project in beeld',
      title: 'Recent werk in de regio Woerden.',
      intro: [
        'Dit project laat zien hoe we te werk gaan. De woning staat volledig in de steigers, zodat gevel, kozijnen, boeidelen en dakranden allemaal goed bereikbaar zijn. Eerst herstel en voorbereiding, daarna pas de afwerking.',
        'De spandoeken en bedrijfsbussen op locatie horen erbij. We werken zichtbaar en netjes in de buurt, met Richard als vast aanspreekpunt op de vloer.',
      ],
      images: [
        {
          src: '/woerden-vakwerk-banner.webp?v=20260604',
          alt: 'RN Schilders spandoek aan de steiger van een woning in Woerden',
          width: 825,
          height: 1100,
          caption: 'Vakwerk in de steigers',
        },
        {
          src: '/werk-gevel-erker-tuindeuren.webp?v=20260530',
          alt: 'Bakstenen gevel met witte erker en openslaande tuindeuren na schilderwerk',
          width: 1280,
          height: 960,
          caption: 'Gevel en kozijnen strak afgewerkt',
        },
        {
          src: '/hero-tuinvilla-steiger.webp?v=20260530',
          alt: 'Tuinvilla in de steigers tijdens buitenschilderwerk',
          width: 1200,
          height: 1600,
          caption: 'Volledig in de steigers',
        },
        {
          src: '/werk-boerderij-rieten-schuur.webp?v=20260530',
          alt: 'Renovatie van een boerderij met rieten schuur in het buitengebied',
          width: 960,
          height: 1280,
          caption: 'Renovatie in het buitengebied',
        },
      ],
    },
  },
  {
    title: 'Vleuten, De Meern en Leidsche Rijn',
    slug: 'schilder-vleuten-de-meern',
    seoTitle: 'Schilder Vleuten, De Meern en Leidsche Rijn | RN Schilders',
    seoDescription:
      'Schilder in Vleuten, De Meern en Leidsche Rijn voor buitenschilderwerk, houtrotherstel, kozijnen en strakke afwerking na verbouwing of oplevering.',
    lead:
      'Vleuten, De Meern en Leidsche Rijn lopen sterk uiteen in bouwjaar, en dat bepaalt het schilderwerk. In de nieuwbouw van Leidsche Rijn, Terwijde en Vleuterweide gaat het vaak om afwerking na oplevering of verbouwing: kozijnen strak houden, wanden en plafonds netjes opleveren. In de oudere kernen van Vleuten en De Meern vraagt buitenhout juist om controle op houtrot, naden en oude verflagen voordat er een kwast aan te pas komt.',
    routeNote:
      'Bij nieuwbouw is de ondergrond meestal goed, maar luistert de afwerking nauw: strakke latex, nette kozijnen en geen spatranden. Bij oudere woningen begint het werk met inspectie van dorpels, raamhoeken, kitnaden en boeidelen. Per onderdeel bepalen we wat geschilderd kan worden en waar eerst herstel nodig is, zodat u niet halverwege voor verrassingen komt te staan.',
    localFit:
      'Omdat Leidsche Rijn dicht bij Woerden ligt, plannen we het werk hier vaak gecombineerd in: binnen latex spuiten of stucwerk na een verbouwing, buiten de kozijnen en gevel in een traject. Zo vallen voorbereiding, droogtijd en afwerking in een heldere planning.',
    areas: ['Vleuten', 'De Meern', 'Leidsche Rijn', 'Terwijde', 'Vleuterweide', 'Veldhuizen', 'Haarzuilens'],
    featuredServices: ['Schilderwerk', 'Kozijnen', 'Houtrotherstel', 'Spuitwerk'],
    commonRequests: [
      'Kozijnen, voordeuren en boeidelen schilderen bij oudere woningen in Vleuten-dorp en De Meern.',
      'Latex spuiten of strak binnenschilderwerk na oplevering of verbouwing in Leidsche Rijn en Terwijde.',
      'Houtrotherstel aan dorpels en raamhoeken voordat de buitenboel weer wordt afgelakt.',
    ],
    serviceLinks: [
      { label: 'Buitenschilderwerk in Vleuten', serviceTitle: 'Schilderwerk' },
      { label: 'Kozijnen in De Meern', serviceTitle: 'Kozijnen' },
      { label: 'Spuitwerk in Leidsche Rijn', serviceTitle: 'Spuitwerk' },
    ],
    faqs: [
      {
        question: 'Werken jullie veel in de nieuwbouw van Leidsche Rijn?',
        answer: 'Ja. In Leidsche Rijn, Terwijde en Vleuterweide gaat het vaak om afwerking na oplevering of verbouwing: strak latex spuiten, wanden en plafonds netjes opleveren en kozijnen goed in de lak zetten.',
      },
      {
        question: 'Waar wordt bij kozijnen in Vleuten of De Meern op gelet?',
        answer: 'Op open naden, loslatende verf, kitwerk, raamhoeken, dorpels en beginnende houtrot. Die punten bepalen of schilderwerk volstaat of dat eerst herstel nodig is.',
      },
      {
        question: 'Kan binnenwerk na een verbouwing worden meegenomen?',
        answer: 'Ja. Wanden, plafonds, deuren, kozijnen, stucwerk en latex spuiten kunnen samen worden bekeken, zodat de volgorde en afwerking vooraf helder zijn.',
      },
      {
        question: 'Hoe ver is Vleuten van jullie vandaan?',
        answer: 'Vleuten en De Meern liggen vlak bij Woerden, dus we zijn er snel voor een opname en kunnen het werk goed inplannen.',
      },
    ],
    heroImage: {
      src: '/kozijnen-7.webp?v=20260517',
      alt: 'Geschilderde houten kozijnen aan een woning',
      width: 1024,
      height: 1536,
    },
  },
  {
    title: 'Ridderkerk',
    slug: 'schilder-ridderkerk',
    seoTitle: 'Schilder Ridderkerk | RN Schilders & Renovatie',
    seoDescription:
      'Schilder in Ridderkerk voor buitenschilderwerk aan gevels, boeidelen, dakranden en sierlijsten. Veilig uitgevoerd vanaf een nette steigeropbouw.',
    lead:
      'In Ridderkerk verzorgt RN Schilders buitenschilderwerk aan woningen, van gevels en boeidelen tot de hogere dakranden en sierlijsten. Een veilige steigeropbouw maakt elk onderdeel goed bereikbaar, zodat het werk strak en duurzaam wordt afgewerkt.',
    routeNote:
      'Bij een opname wordt gekeken naar de staat van gevelhout, boeidelen, dakranden, kozijnen en bestaande verflagen, en naar de manier waarop het pand veilig bereikbaar wordt gemaakt.',
    localFit:
      'Zo ontstaat een duidelijke offerte voor buitenschilderwerk en houtrotherstel, met een planning waarin steiger, voorbereiding en afwerking op elkaar aansluiten.',
    areas: ['Ridderkerk', 'Bolnes', 'Slikkerveer', 'Drievliet', 'Rijsoord'],
    featuredServices: ['Schilderwerk', 'Houtrotherstel', 'Kozijnen'],
    commonRequests: [
      'Buitenschilderwerk aan gevels, boeidelen en dakranden van woningen in Ridderkerk en Bolnes.',
      'Houtrotherstel aan kozijnen, dorpels en gevelhout voordat het schilderwerk wordt afgewerkt.',
      'Schilderwerk op hoogte dat veilig wordt uitgevoerd vanaf een vakkundig geplaatste steiger.',
    ],
    serviceLinks: [
      { label: 'Buitenschilderwerk in Ridderkerk', serviceTitle: 'Schilderwerk' },
      { label: 'Houtrotherstel in Ridderkerk', serviceTitle: 'Houtrotherstel' },
      { label: 'Kozijnen schilderen in Ridderkerk', serviceTitle: 'Kozijnen' },
    ],
    faqs: [
      {
        question: 'Werkt RN Schilders ook buiten de directe regio Woerden?',
        answer: 'Ja. Voor projecten zoals buitenschilderwerk in Ridderkerk komt RN Schilders ook in de regio Rotterdam. Stuur uw adres en wat beeldmateriaal mee, dan volgt een duidelijke inschatting.',
      },
      {
        question: 'Hoe wordt schilderwerk op hoogte veilig uitgevoerd?',
        answer: 'Hogere gevels, dakranden en boeidelen worden bereikbaar gemaakt met een stevige steigeropbouw. Daardoor kan elk onderdeel rustig, veilig en met aandacht voor de afwerking worden geschilderd.',
      },
    ],
    heroImage: {
      src: '/ridderkerk-3.webp',
      alt: 'Woning in Ridderkerk in de steigers voor buitenschilderwerk',
      width: 1800,
      height: 1346,
    },
    projectStory: {
      eyebrow: 'Project in beeld',
      title: 'Weer mooi in de steigers gezet.',
      intro: [
        'Dankzij een veilige en nette steigeropbouw kan RN Schilders zich volledig richten op strak en duurzaam schilderwerk. Van gevels en boeidelen tot de hogere dakranden en sierlijsten is alles weer goed bereikbaar gemaakt, zodat er veilig, efficiënt en met kwaliteit gewerkt wordt.',
        'Met dank aan M83 Steiger Service voor het vakkundig plaatsen van de steigers en het meedenken op locatie. Op naar een strak eindresultaat.',
      ],
      images: [
        {
          src: '/ridderkerk-2.webp',
          alt: 'Steigers rond de voorgevel van een woning in Ridderkerk',
          width: 1346,
          height: 1800,
          caption: 'Steigers rond de voorgevel',
        },
        {
          src: '/ridderkerk-1.webp',
          alt: 'Steiger langs de dakrand van een woning in Ridderkerk',
          width: 1346,
          height: 1800,
          caption: 'Dakranden goed bereikbaar',
        },
        {
          src: '/ridderkerk-3.webp',
          alt: 'Steigeropbouw langs de zijgevel van een woning in Ridderkerk',
          width: 1800,
          height: 1346,
          caption: 'Veilig werken langs de gevel',
        },
        {
          src: '/ridderkerk-4.webp',
          alt: 'Woning in Ridderkerk volledig in de steigers gezien vanuit de tuin',
          width: 1800,
          height: 1346,
          caption: 'Het pand klaar voor afwerking',
        },
      ],
    },
  },
];

const workAreaGroups: WorkAreaGroup[] = [
  {
    title: 'Woerden en directe omgeving',
    text: 'Vanuit onze vestiging aan de Kuipersweg werken we dagelijks in Woerden en de omliggende kernen zoals Harmelen, Kamerik, Zegveld, Montfoort, Oudewater en Linschoten. Korte lijnen, snel een opname en een vast aanspreekpunt op de vloer.',
    slugs: ['schilder-woerden'],
  },
  {
    title: 'Utrecht west',
    text: 'Voor woningen in Vleuten, De Meern en Leidsche Rijn gaat het vaak om buitenschilderwerk en kozijnonderhoud bij oudere woningen, en strakke afwerking na oplevering of verbouwing in de nieuwbouw.',
    slugs: ['schilder-vleuten-de-meern'],
  },
  {
    title: 'Regio Rotterdam',
    text: 'Ook buiten de directe regio voert RN Schilders projecten uit, zoals buitenschilderwerk in Ridderkerk waarbij gevels, boeidelen en dakranden vanaf een nette steigeropbouw worden aangepakt.',
    slugs: ['schilder-ridderkerk'],
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
    src: '/showcase-roof-window-before.webp?v=20260517',
    alt: 'Dakkapel en dakraam vóór afwerking',
    width: 1024,
    height: 1536,
    title: 'Dakraamhoek',
    label: 'Voor',
  },
  {
    src: '/showcase-roof-window-after.webp?v=20260517',
    alt: 'Dakkapel en dakraam na afwerking',
    width: 1024,
    height: 1536,
    title: 'Dakraamhoek',
    label: 'Na',
  },
  {
    src: '/showcase-roof-window-after-detail.webp?v=20260517',
    alt: 'Afgewerkte dakkapel vanaf straatniveau',
    width: 1024,
    height: 1536,
    title: 'Afwerking buiten',
    label: 'Detail',
  },
];

const showcaseGroups: ShowcaseGroup[] = [
  {
    title: 'Buiten en gevels',
    text: 'Recent buitenwerk: gevels, kozijnen en erkers strak in de lak, plus renovatie aan een monumentale boerderij.',
    images: [
      {
        src: '/werk-gevel-erker-tuindeuren.webp?v=20260530',
        alt: 'Bakstenen gevel met witte erker en crème openslaande tuindeuren na schilderwerk',
        width: 1280,
        height: 960,
        title: 'Gevel met erker',
        label: 'Resultaat',
      },
      {
        src: '/werk-witte-kozijnen-topgevel.webp?v=20260530',
        alt: 'Witte kozijnen in een zwarte houten topgevel tegen een blauwe lucht',
        width: 1280,
        height: 960,
        title: 'Houten topgevel',
        label: 'Resultaat',
      },
      {
        src: '/werk-antraciet-bovengevel.webp?v=20260530',
        alt: 'Antracietgrijze houten bovengevel op een bakstenen onderbouw met witte kozijnen',
        width: 1280,
        height: 960,
        title: 'Antraciet bovengevel',
        label: 'Resultaat',
      },
      {
        src: '/werk-erker-prep-bijgebouw.webp?v=20260530',
        alt: 'Schilder bereidt de crème erker van een zwart houten bijgebouw voor',
        width: 960,
        height: 1280,
        title: 'Erker voorbereiden',
        label: 'In uitvoering',
      },
      {
        src: '/werk-boerderij-rieten-schuur.webp?v=20260530',
        alt: 'Schilder op een boerenerf bij een bakstenen boerderij met rieten schuur',
        width: 960,
        height: 1280,
        title: 'Boerderijrenovatie',
        label: 'Op locatie',
      },
      {
        src: '/werk-houten-poort-renovatie.webp?v=20260530',
        alt: 'Schilder draagt een grote houten poort tijdens renovatie bij een rieten schuur',
        width: 960,
        height: 1280,
        title: 'Houten poort',
        label: 'Renovatie',
      },
    ],
  },
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
        src: '/showcase-damaged-wood-detail.webp?v=20260517',
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
        src: '/showcase-ceiling-tiles-finish.webp?v=20260517',
        alt: 'Donker plafond met strakke plafondplaten en inbouwspots',
        width: 1408,
        height: 1056,
        title: 'Plafond',
        label: 'Afgewerkt',
      },
      {
        src: '/showcase-fireplace-lighting.webp?v=20260517',
        alt: 'Moderne haardombouw met geïntegreerde verlichting',
        width: 1320,
        height: 1309,
        title: 'Haardombouw',
        label: 'Lichtdetail',
      },
      {
        src: '/showcase-room-good-as-new.webp?v=20260517',
        alt: 'Afgewerkte kamer met groene wand, lichte vloer en inbouwspots',
        width: 1320,
        height: 1641,
        title: 'Kamer',
        label: 'Eindbeeld',
      },
      {
        src: '/showcase-ceiling-tiles-downlights.webp',
        alt: 'Zwart systeemplafond met strakke inbouwspots',
        width: 1200,
        height: 1600,
        title: 'Systeemplafond',
        label: 'Inbouwspots',
      },
      {
        src: '/showcase-fireplace-mantel.webp',
        alt: 'Moderne hoekhaard met houten schouwblad',
        width: 880,
        height: 1173,
        title: 'Schouwombouw',
        label: 'Afgewerkt',
      },
      {
        src: '/showcase-ceiling-corner-pillar.webp',
        alt: 'Plafondhoek met crème pilaar tegen een groene wand',
        width: 1013,
        height: 1800,
        title: 'Plafondhoek',
        label: 'Afgewerkt',
      },
      {
        src: '/showcase-skirting-detail.webp',
        alt: 'Witte plint en deurkozijn op een vinylvloer',
        width: 1800,
        height: 1350,
        title: 'Plint en kozijn',
        label: 'Detail',
      },
    ],
  },
  {
    title: 'Deuren en details',
    text: 'Afwerking valt op bij randen, profielen en zichtlijnen. Juist daarom krijgen deze details ruimte.',
    images: [
      {
        src: '/showcase-door-dark-finish.webp?v=20260517',
        alt: 'Donker afgelakte binnendeur met paneelverdeling',
        width: 1320,
        height: 1640,
        title: 'Binnendeur',
        label: 'Lakwerk',
      },
      {
        src: '/showcase-door-hall-finish.webp?v=20260517',
        alt: 'Witte binnendeur in hal met groene wand',
        width: 1320,
        height: 1629,
        title: 'Hal',
        label: 'Afgewerkt',
      },
      {
        src: '/showcase-door-black-arched-glass.webp',
        alt: 'Hoogglans zwarte boogdeur met ribbelglas',
        width: 1350,
        height: 1800,
        title: 'Booglichtdeur',
        label: 'Hoogglans',
      },
      {
        src: '/showcase-door-anthracite.webp',
        alt: 'Antracietgrijze voordeur in een licht gevelpand',
        width: 1350,
        height: 1800,
        title: 'Voordeur',
        label: 'Antraciet',
      },
      {
        src: '/showcase-door-green-panelled.webp',
        alt: 'Groene paneeldeur met klimrozen langs de gevel',
        width: 880,
        height: 1173,
        title: 'Paneeldeur',
        label: 'Buiten',
      },
      {
        src: '/showcase-door-sage-green.webp',
        alt: 'Saliegroene voordeur van een rijtjeswoning',
        width: 880,
        height: 1173,
        title: 'Voordeur',
        label: 'Lakwerk',
      },
      {
        src: '/showcase-door-brick-entrance.webp?v=20260517',
        alt: 'Bakstenen entreepartij met zwarte stalen deuren',
        width: 1024,
        height: 1536,
        title: 'Entreepartij',
        label: 'Buiten',
      },
      {
        src: '/werk-creme-tuindeuren-baksteen.webp?v=20260530',
        alt: 'Crème openslaande tuindeuren in een oude bakstenen gevel',
        width: 1280,
        height: 960,
        title: 'Openslaande tuindeuren',
        label: 'Resultaat',
      },
      {
        src: '/werk-creme-tuindeuren-binnenplaats.webp?v=20260530',
        alt: 'Crème openslaande deuren in een bakstenen gevel op een binnenplaats',
        width: 1280,
        height: 960,
        title: 'Tuindeuren binnenplaats',
        label: 'Resultaat',
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
      {
        src: '/showcase-progress-ceiling-paint.webp',
        alt: 'Schilder op een ladder werkt het plafond wit',
        width: 1112,
        height: 944,
        title: 'Plafond schilderen',
        label: 'In uitvoering',
      },
      {
        src: '/showcase-progress-attic.webp',
        alt: 'Zolderrenovatie met gipsplaten en zichtbare balken',
        width: 960,
        height: 1280,
        title: 'Zolderrenovatie',
        label: 'Opbouw',
      },
      {
        src: '/showcase-progress-commercial.webp?v=20260517',
        alt: 'Bedrijfsruimte in opbouw met grijze wanden',
        width: 1536,
        height: 1024,
        title: 'Bedrijfsruimte',
        label: 'In opbouw',
      },
      {
        src: '/showcase-progress-door-prep.webp',
        alt: 'Grijze binnendeur met verfblik op een trapje',
        width: 1013,
        height: 1800,
        title: 'Deur voorbereiden',
        label: 'Schuren',
      },
      {
        src: '/werk-prep-kozijn-steiger.webp?v=20260530',
        alt: 'Schilder bereidt een kozijn voor op een steiger bij een antraciet houten gevel',
        width: 960,
        height: 1280,
        title: 'Kozijn voorbereiden',
        label: 'Op de steiger',
      },
      {
        src: '/werk-schuren-erker-boven.webp?v=20260530',
        alt: 'Schilder schuurt de bovenkant van een crème erkerkozijn',
        width: 1280,
        height: 960,
        title: 'Erkerkozijn schuren',
        label: 'Schuren',
      },
      {
        src: '/werk-schuren-erker-oranje.webp?v=20260530',
        alt: 'Schilder schuurt een wit erkerkozijn met een schuurmachine',
        width: 1280,
        height: 960,
        title: 'Kozijn schuren',
        label: 'Schuren',
      },
      {
        src: '/werk-schuren-erker-kozijnen.webp?v=20260530',
        alt: 'Schilder schuurt de crème kozijnen van een erker op een binnenplaats',
        width: 1280,
        height: 960,
        title: 'Erker schuren',
        label: 'Schuren',
      },
      {
        src: '/werk-erker-terras-parasol.webp?v=20260530',
        alt: 'Schilder werkt aan een erker op een terras met haag en parasol',
        width: 720,
        height: 1280,
        title: 'Erker op terras',
        label: 'In uitvoering',
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

function absoluteUrl(path: string) {
  return `${siteUrl}${path === '/' ? '/' : path}`;
}

function getLocationPath(location: LocationPage) {
  return `/${location.slug}`;
}

// Service detail pages live at a clean single-word path (e.g. /schilderwerk),
// derived from the title so there is one source of truth.
function getServicePath(service: Service) {
  return `/${service.title.toLowerCase()}`;
}

function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}

function resolveNavHref(href: string, isSubPage: boolean) {
  if (href.startsWith('/')) return href;
  return isSubPage ? `/${href}` : href;
}

function setMetaTag(selector: string, attr: 'content' | 'href', value: string) {
  if (typeof document === 'undefined') return;
  const element = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
  if (element) element.setAttribute(attr, value);
}

export type RouteMeta = {
  path: string;
  title: string;
  description: string;
  canonical: string;
  jsonLd: string[];
};

const homeMeta = {
  title: `✴️ ${siteName} | Schilder Woerden`,
  description:
    'Vakkundige schilder in Woerden voor binnen- en buitenschilderwerk, kozijnen, stucwerk en houtrotherstel. Richard komt zelf langs en u krijgt snel een gratis offerte.',
};

const workAreaMeta = {
  title: `Werkgebied | ${siteName}`,
  description:
    'Bekijk het werkgebied van RN Schilders & Renovatie rondom Woerden, met plaatsen zoals Vleuten, De Meern, Leidsche Rijn en Ridderkerk.',
};

const termsMeta = {
  title: `Algemene voorwaarden | ${siteName}`,
  description: 'Algemene voorwaarden van RN Schilders & Renovatie in Woerden.',
};

const aboutMeta = {
  title: `Over RN Schilders | Schilder en renovatiebedrijf in Woerden`,
  description:
    'Maak kennis met RN Schilders & Renovatie uit Woerden. Een meewerkend eigenaar, Richard, met meer dan vijftien jaar ervaring, korte lijnen en duidelijke afspraken.',
};

const contactMeta = {
  title: `Contact | RN Schilders & Renovatie Woerden`,
  description:
    'Neem contact op met RN Schilders & Renovatie in Woerden. Bel, mail of vraag online een gratis offerte aan. Kuipersweg 33, 3449 JA Woerden.',
};

// BreadcrumbList so Google understands the page sits under the homepage and can
// render a breadcrumb trail (and treat the subpages as distinct entries) in the
// search result instead of a single bare listing.
function buildBreadcrumbJsonLd(pageName: string, pageUrl: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: pageName, item: pageUrl },
    ],
  });
}

// Service + FAQPage structured data for a location page, derived straight from
// the page's own areas, services and FAQs so there is one source of truth.
function buildLocationJsonLd(location: LocationPage): string[] {
  const pageUrl = absoluteUrl(getLocationPath(location));
  return [
    buildBreadcrumbJsonLd(location.title, pageUrl),
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${pageUrl}#service`,
      name: location.seoTitle,
      description: location.seoDescription,
      provider: { '@id': `${siteUrl}/#business` },
      url: pageUrl,
      serviceType: location.featuredServices,
      areaServed: location.areas.map((name) => ({ '@type': 'City', name })),
    }),
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      mainEntity: location.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    }),
  ];
}

// Service + FAQPage structured data for a service detail page.
function buildServiceJsonLd(service: Service): string[] {
  const pageUrl = absoluteUrl(getServicePath(service));
  return [
    buildBreadcrumbJsonLd(service.title, pageUrl),
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${pageUrl}#service`,
      name: service.detailTitle,
      description: service.seoDescription,
      provider: { '@id': `${siteUrl}/#business` },
      url: pageUrl,
      serviceType: service.title,
      areaServed: { '@type': 'City', name: 'Woerden' },
    }),
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      mainEntity: service.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    }),
  ];
}

// Single source of truth for per-route <head> metadata, used by both the
// client (SPA navigation) and the build-time prerender script.
export function routeMetaFor(pathname: string): RouteMeta {
  const path = normalizePathname(pathname);
  const location = locationPages.find((item) => getLocationPath(item) === path);
  const service = services.find((item) => getServicePath(item) === path);

  let base = homeMeta;
  let jsonLd: string[] = [];
  if (location) {
    base = { title: location.seoTitle, description: location.seoDescription };
    jsonLd = buildLocationJsonLd(location);
  } else if (service) {
    base = { title: service.seoTitle, description: service.seoDescription };
    jsonLd = buildServiceJsonLd(service);
  } else if (path === '/werkgebied') {
    base = workAreaMeta;
    jsonLd = [buildBreadcrumbJsonLd('Werkgebied', absoluteUrl(path))];
  } else if (path === '/over-ons') {
    base = aboutMeta;
    jsonLd = [buildBreadcrumbJsonLd('Over ons', absoluteUrl(path))];
  } else if (path === '/contact') {
    base = contactMeta;
    jsonLd = [buildBreadcrumbJsonLd('Contact', absoluteUrl(path))];
  } else if (path === '/algemene-voorwaarden') {
    base = termsMeta;
    jsonLd = [buildBreadcrumbJsonLd('Algemene voorwaarden', absoluteUrl(path))];
  }

  return { path, title: base.title, description: base.description, canonical: absoluteUrl(path), jsonLd };
}

// Every route the site renders, in sitemap order. Drives the prerender loop.
export const allRoutePaths: string[] = [
  '/',
  ...services.map((service) => getServicePath(service)),
  '/werkgebied',
  ...locationPages.map((location) => getLocationPath(location)),
  '/over-ons',
  '/contact',
  '/algemene-voorwaarden',
];

function useRouteMetadata(pathname: string) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const meta = routeMetaFor(pathname);
    document.title = meta.title;
    setMetaTag('meta[name="description"]', 'content', meta.description);
    setMetaTag('link[rel="canonical"]', 'href', meta.canonical);
    setMetaTag('meta[property="og:title"]', 'content', meta.title);
    setMetaTag('meta[property="og:description"]', 'content', meta.description);
    setMetaTag('meta[property="og:url"]', 'content', meta.canonical);
  }, [pathname]);
}

function App({ initialPath }: { initialPath?: string } = {}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [pathname, setPathname] = useState(() =>
    typeof window === 'undefined' ? initialPath ?? '/' : window.location.pathname,
  );
  const normalizedPathname = normalizePathname(pathname);
  const isTermsPage = normalizedPathname === '/algemene-voorwaarden';
  const isWorkAreaPage = normalizedPathname === '/werkgebied';
  const isAboutPage = normalizedPathname === '/over-ons';
  const isContactPage = normalizedPathname === '/contact';
  const locationPage = locationPages.find((location) => normalizedPathname === getLocationPath(location));
  const servicePage = services.find((service) => normalizedPathname === getServicePath(service));
  const isSubPage =
    isTermsPage || isWorkAreaPage || isAboutPage || isContactPage || Boolean(locationPage) || Boolean(servicePage);
  useRouteMetadata(normalizedPathname);

  useEffect(() => {
    const onLocationChange = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  return (
    <div id="top" className="min-h-[100dvh] bg-paper">
      <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} openQuote={() => setQuoteOpen(true)} isTermsPage={isSubPage} />
      <main>
        {isTermsPage ? (
          <TermsPage openQuote={() => setQuoteOpen(true)} />
        ) : isWorkAreaPage ? (
          <WorkAreaPage openQuote={() => setQuoteOpen(true)} />
        ) : isAboutPage ? (
          <AboutPage openQuote={() => setQuoteOpen(true)} />
        ) : isContactPage ? (
          <ContactPage openQuote={() => setQuoteOpen(true)} />
        ) : servicePage ? (
          <ServicePageView service={servicePage} openQuote={() => setQuoteOpen(true)} />
        ) : locationPage ? (
          <LocationPageView location={locationPage} openQuote={() => setQuoteOpen(true)} />
        ) : (
          <>
            <Hero openQuote={() => setQuoteOpen(true)} />
            <Services />
            <ProofStrip />
            <OwnerSection />
            <WorkMarquee />
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
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="shell pt-3 sm:pt-4">
        <div
          className={`overflow-hidden rounded-2xl border px-4 transition sm:px-5 ${
            scrolled
              ? 'border-line/70 bg-whitewash/95 shadow-[0_18px_50px_-30px_rgba(13,30,61,0.55)] backdrop-blur-md'
              : 'border-white/55 bg-whitewash/80 shadow-[0_14px_44px_-32px_rgba(13,30,61,0.45)] backdrop-blur'
          }`}
        >
          <div className="flex h-16 items-center justify-between md:h-[4.25rem]">
            <a href={isTermsPage ? '/' : '#top'} className="flex min-w-0 items-center gap-3" aria-label="RN Schilders & Renovatie">
              <img src="/logo-mark.webp" alt="" width={800} height={679} className="h-11 w-11 object-contain" />
              <span className="min-w-0">
                <span className="block truncate font-display text-lg font-extrabold text-navy sm:text-xl">RN Schilders</span>
                <span className="block text-xs font-bold uppercase tracking-[0.12em] text-roller">Woerden</span>
              </span>
            </a>

            <nav className="hidden items-center gap-7 lg:flex">
              {navLinks.map(([label, href]) => (
                <a key={href} href={resolveNavHref(href, isTermsPage)} className="text-sm font-semibold text-graphite transition hover:text-navy">
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
            <div className="border-t border-line/70 lg:hidden">
              <div className="py-5">
                <div className="grid gap-1">
              {navLinks.map(([label, href]) => (
                <a
                  key={href}
                  href={resolveNavHref(href, isTermsPage)}
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
        </div>
      </div>
    </header>
  );
}

const heroSlides = [
  { src: '/rn-schilders-main.webp?v=20260530', width: 1024, height: 1536, position: '50% 28%' },
  { src: '/hero-schilder-dakrand.webp?v=20260530', width: 1200, height: 1600, position: '50% 32%' },
  { src: '/hero-tuinvilla-steiger.webp?v=20260530', width: 1200, height: 1600, position: '50% 42%' },
  { src: '/hero-steigertoren-villa.webp?v=20260530', width: 1200, height: 1600, position: '50% 40%' },
] as const;

function Hero({ openQuote }: { openQuote: () => void }) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setSlide((current) => (current + 1) % heroSlides.length), 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[82dvh] overflow-hidden md:min-h-[calc(92dvh-5rem)]">
      <div className="hero-bg absolute inset-0">
        {heroSlides.map((item, index) => (
          <img
            key={item.src}
            src={item.src}
            alt=""
            width={item.width}
            height={item.height}
            style={{ objectPosition: item.position }}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${index === slide ? 'opacity-100' : 'opacity-0'}`}
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'low'}
            decoding="async"
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,30,61,0.94)_0%,rgba(13,30,61,0.78)_46%,rgba(13,30,61,0.28)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-whitewash to-transparent" />
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
            Vakwerk dat zichtbaar blijft. Richard werkt zelf mee en regelt schilderwerk, kozijnen, stucwerk en renovatie vanuit één aanspreekpunt.
          </p>

          <div className="hero-reveal hero-reveal-4 mt-8 flex flex-col gap-3 md:flex-row md:flex-wrap">
            <button type="button" onClick={openQuote} className="btn-primary w-full md:w-auto">
              Gratis prijsindicatie
              <ArrowRight size={18} />
            </button>
            <a href={phoneHref} draggable={false} className="btn-light w-full md:w-auto">
              <Phone size={18} />
              <span className="select-text cursor-text">{phoneDisplay}</span>
            </a>
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
    [CalendarCheck, '15+ jaar ervaring', 'Ervaring met woningen en bedrijfspanden.'],
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

function OwnerSection() {
  return (
    <section className="section-pad">
      <div className="shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <img src="/workspace-hero.webp?v=20260514" alt="Bedrijfsbus van RN Schilders & Renovatie" width={1536} height={1024} className="aspect-[4/3] w-full rounded-lg object-cover" loading="lazy" decoding="async" />

        <div>
          <h2 className="max-w-2xl text-4xl font-extrabold leading-tight text-navy md:text-5xl">
            Niet alleen een schilder, maar een meewerkend eigenaar op uw project.
          </h2>
          <p className="mt-6 text-lg leading-8 text-graphite">
            RN Schilders & Renovatie is gebouwd rond Richard: meer dan vijftien jaar ervaring, direct contact en zelf aanwezig bij de uitvoering. Voor u betekent dat één aanspreekpunt, duidelijke afspraken en iemand die voorbereiding, planning en eindresultaat zelf controleert.
          </p>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="diensten" className="bg-whitewash pb-16 pt-2 md:pb-24 md:pt-4">
      <div className="shell">
        <div>
          <p className="eyebrow">Diensten</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-navy md:text-5xl">
            Onze werkzaamheden
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <a
              key={service.title}
              href={getServicePath(service)}
              className="group overflow-hidden rounded-lg border border-line bg-white text-left transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-30px_rgba(13,30,61,0.65)] focus-visible:-translate-y-0.5"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={service.image}
                  alt={`${service.title} door RN Schilders in Woerden`}
                  width={service.width}
                  height={service.height}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  loading="lazy"
                  decoding="async"
                />
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
                  Bekijk dienst
                  <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedWork({ openQuote }: { openQuote: () => void }) {
  return (
    <section id="werk" className="section-pad bg-navy text-white">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow text-roller-soft">Recent werk</p>
            <h2 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
              Van versleten voordeur naar hoogglans visitekaartje.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/88">
              Foto’s maken het verschil tussen beloven en laten zien. Daarom krijgt recent werk hier de ruimte: voorbereiding, herstel en afwerking naast elkaar.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {['Schuren', 'Herstellen', 'Aflakken'].map((step, index) => (
                <div key={step} className="rounded-md border border-white/12 bg-white/8 p-3.5">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-roller-soft">Stap {index + 1}</span>
                  <strong className="mt-1.5 block font-display text-xl font-extrabold">{step}</strong>
                </div>
              ))}
            </div>

            <button type="button" onClick={openQuote} className="btn-primary mt-6">
              Ik wil dit resultaat
              <ArrowRight size={17} />
            </button>
          </div>

          <DoorRenovationSlider />
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <ProjectSlideshow
            slides={['/interieur-slide-1.webp?v=20260517', '/interieur-slide-2.webp?v=20260517', '/interieur-slide-3.webp?v=20260517']}
            imageWidth={720}
            imageHeight={880}
            title="Interieur renovatie"
            text="Donkere luxe tint, strak afgewerkt en direct klaar voor gebruik."
          />
          <ProjectSlideshow
            slides={['/kantoor-slide-1.webp?v=20260517', '/kantoor-slide-2.webp?v=20260517', '/kantoor-slide-3.webp?v=20260517']}
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

type MarqueeItem =
  | { type: 'image'; src: string; alt: string; caption: string; width: number; height: number }
  | { type: 'video'; src: string; poster: string; caption: string; width: number; height: number };

const marqueeItems: MarqueeItem[] = [
  {
    type: 'video',
    src: '/video-spuit-gevel.mp4',
    poster: '/video-spuit-gevel-poster.webp',
    caption: 'Gevel spuiten in de avondzon',
    width: 540,
    height: 960,
  },
  {
    type: 'video',
    src: '/carousel-werk-video.mp4',
    poster: '/carousel-werk-video-poster.webp',
    caption: 'Plafondproject van dichtbij',
    width: 464,
    height: 832,
  },
  {
    type: 'image',
    src: '/carousel-voordeur-renovatie.webp',
    alt: 'Schilder van RN Schilders werkt aan een houten voordeur in een bakstenen entree',
    caption: 'Voordeur in renovatie',
    width: 1013,
    height: 1800,
  },
  {
    type: 'video',
    src: '/video-steiger-villa.mp4',
    poster: '/video-steiger-villa-poster.webp',
    caption: 'Buitenwerk vanaf de steiger',
    width: 540,
    height: 960,
  },
  {
    type: 'image',
    src: '/carousel-staircase.webp?v=20260517',
    alt: 'Strak wit gelakte trap van bovenaf gezien',
    caption: 'Strak gelakte trap',
    width: 1320,
    height: 1389,
  },
  {
    type: 'video',
    src: '/video-stucwerk-almere.mp4',
    poster: '/video-stucwerk-almere-poster.webp',
    caption: 'Stucwerk in Almere',
    width: 540,
    height: 960,
  },
  {
    type: 'video',
    src: '/video-dakrand-schuren.mp4',
    poster: '/video-dakrand-schuren-poster.webp',
    caption: 'Dakrand schuren en strak maken',
    width: 540,
    height: 960,
  },
  {
    type: 'image',
    src: '/carousel-terracotta-walls.webp',
    alt: 'Interieurhoek met terracotta en crème geschilderde wanden',
    caption: 'Warme wandkleuren binnen',
    width: 1350,
    height: 1800,
  },
  {
    type: 'image',
    src: '/carousel-beam-ceiling.webp',
    alt: 'Woonkamer met wit geschilderd balkenplafond',
    caption: 'Wit afgewerkt balkenplafond',
    width: 880,
    height: 660,
  },
  {
    type: 'video',
    src: '/video-verfspuit-steiger.mp4',
    poster: '/video-verfspuit-steiger-poster.webp',
    caption: 'Spuitwerk op de steiger',
    width: 540,
    height: 960,
  },
  {
    type: 'image',
    src: '/carousel-garden-shed.webp',
    alt: 'Moderne tuinberging met zwarte en houten gevelbekleding',
    caption: 'Tuinberging in hout en zwart',
    width: 1350,
    height: 1800,
  },
  {
    type: 'image',
    src: '/carousel-floor-coating.webp',
    alt: 'Vloercoating aangebracht in een bedrijfshal',
    caption: 'Vloercoating in een bedrijfshal',
    width: 1800,
    height: 1350,
  },
  {
    type: 'video',
    src: '/video-boogvenster.mp4',
    poster: '/video-boogvenster-poster.webp',
    caption: 'Schilderwerk rond een boogvenster',
    width: 540,
    height: 960,
  },
  {
    type: 'image',
    src: '/carousel-ceiling-tiles.webp',
    alt: 'Zwart akoestisch plafond met inbouwspots',
    caption: 'Akoestisch plafond met inbouwspots',
    width: 1200,
    height: 1600,
  },
  {
    type: 'image',
    src: '/carousel-badkamer-zolder.webp',
    alt: 'Zolderbadkamer in renovatie met turquoise tegelwerk',
    caption: 'Zolderbadkamer in renovatie',
    width: 1350,
    height: 1800,
  },
  {
    type: 'video',
    src: '/video-erker-schuren.mp4',
    poster: '/video-erker-schuren-poster.webp',
    caption: 'Erkerkozijn schuren',
    width: 540,
    height: 960,
  },
  {
    type: 'video',
    src: '/carousel-werk-video-2.mp4',
    poster: '/carousel-werk-video-2-poster.webp',
    caption: 'Spuitwerk in een nieuwbouwwoning',
    width: 576,
    height: 1024,
  },
  {
    type: 'image',
    src: '/carousel-taupe-wanden.webp',
    alt: 'Strak gesausde taupe wanden met witte structuurplafond',
    caption: 'Strak gesausde wanden',
    width: 1350,
    height: 1800,
  },
  {
    type: 'image',
    src: '/carousel-serre.webp',
    alt: 'Serre met zwarte kozijnen, glasdak en visgraatvloer',
    caption: 'Serre met zwarte kozijnen',
    width: 1800,
    height: 1350,
  },
  {
    type: 'video',
    src: '/video-kozijn-parasol.mp4',
    poster: '/video-kozijn-parasol-poster.webp',
    caption: 'Kozijn schuren op het terras',
    width: 540,
    height: 960,
  },
  {
    type: 'image',
    src: '/carousel-stalen-deur.webp?v=20260517',
    alt: 'Stalen binnendeur in voorbereiding tijdens renovatie',
    caption: 'Stalen binnendeur in voorbereiding',
    width: 1320,
    height: 1746,
  },
  {
    type: 'video',
    src: '/video-binnenplaats-overzicht.mp4',
    poster: '/video-binnenplaats-overzicht-poster.webp',
    caption: 'Buitenwerk op de binnenplaats',
    width: 540,
    height: 960,
  },
  {
    type: 'video',
    src: '/carousel-werk-video-3.mp4',
    poster: '/carousel-werk-video-3-poster.webp',
    caption: 'Renovatie in voorbereiding',
    width: 480,
    height: 848,
  },
  {
    type: 'image',
    src: '/carousel-diepblauw-spuitwerk.webp',
    alt: 'Diepblauw gespoten wanden in een nieuwbouwwoning',
    caption: 'Diepblauw spuitwerk',
    width: 1013,
    height: 1800,
  },
  {
    type: 'image',
    src: '/carousel-roze-accentwand.webp?v=20260517',
    alt: 'Kamer met een zacht roze accentwand',
    caption: 'Roze accentwand',
    width: 1320,
    height: 1790,
  },
];

function MarqueeCard({ item, onPlay }: { item: MarqueeItem; onPlay: (video: { src: string; poster: string }) => void }) {
  const base =
    'relative w-[74vw] max-w-[320px] shrink-0 overflow-hidden rounded-lg border border-line bg-white sm:w-[340px]';

  if (item.type === 'video') {
    return (
      <button
        type="button"
        onClick={() => onPlay({ src: item.src, poster: item.poster })}
        aria-label={`Video bekijken: ${item.caption}`}
        className={`group ${base}`}
      >
        <div className="aspect-[3/4] w-full overflow-hidden">
          <img
            src={item.poster}
            alt={item.caption}
            width={item.width}
            height={item.height}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/15 to-navy/35" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-navy/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
          <Play size={11} fill="currentColor" />
          Video
        </span>
        <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-roller text-white shadow-[0_10px_26px_-8px_rgba(255,106,0,0.9)] transition group-hover:scale-110">
          <Play size={22} fill="currentColor" className="ml-0.5" />
        </span>
        <span className="absolute inset-x-3 bottom-3 text-left text-sm font-bold text-white">{item.caption}</span>
      </button>
    );
  }

  return (
    <figure className={base}>
      <div className="aspect-[3/4] w-full overflow-hidden">
        <img
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
      <figcaption className="absolute inset-x-3 bottom-3 text-sm font-bold text-white">{item.caption}</figcaption>
    </figure>
  );
}

function VideoLightbox({ src, poster, onClose }: { src: string; poster: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/90 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Video van uitgevoerd werk"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Sluiten"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-md bg-white text-navy"
      >
        <X size={22} />
      </button>
      <video
        src={src}
        poster={poster}
        controls
        autoPlay
        playsInline
        className="max-h-[82dvh] w-auto max-w-full rounded-lg"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}

function WorkMarquee() {
  const [activeVideo, setActiveVideo] = useState<{ src: string; poster: string } | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const hoverRef = useRef(false);
  const resumeTimer = useRef<number | null>(null);
  const drag = useRef({ active: false, captured: false, moved: false, startX: 0, startScroll: 0 });
  const loop = [...marqueeItems, ...marqueeItems];

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let pos = el.scrollLeft;
    const step = () => {
      const half = el.scrollWidth / 2;
      if (pausedRef.current) {
        // Stay in sync with whatever the user scrolled to manually.
        pos = el.scrollLeft;
      } else {
        pos += 0.5;
        if (half > 0 && pos >= half) pos -= half;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(
    () => () => {
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    },
    [],
  );

  const pause = () => {
    pausedRef.current = true;
    if (resumeTimer.current) {
      window.clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
  };
  // Resume auto-scroll after a quiet beat, but never while still hovered or dragging.
  const resumeSoon = (delay: number) => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      resumeTimer.current = null;
      if (!hoverRef.current && !drag.current.active) pausedRef.current = false;
    }, delay);
  };

  const onMouseEnter = () => {
    hoverRef.current = true;
    pause();
  };
  const onMouseLeave = () => {
    hoverRef.current = false;
    resumeSoon(250);
  };

  // Click-and-drag to scroll (mouse / pen). Native touch scrolling handles swipe.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const el = viewportRef.current;
    if (!el) return;
    pause();
    drag.current = { active: true, captured: false, moved: false, startX: e.clientX, startScroll: el.scrollLeft };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const el = viewportRef.current;
    if (!el) return;
    const dx = e.clientX - drag.current.startX;
    if (!drag.current.moved && Math.abs(dx) > 4) {
      // Only hijack the pointer once it's clearly a drag, so taps still open videos.
      drag.current.moved = true;
      drag.current.captured = true;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = 'grabbing';
    }
    if (drag.current.moved) {
      e.preventDefault();
      el.scrollLeft = drag.current.startScroll - dx;
    }
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = viewportRef.current;
    if (drag.current.captured && el) {
      el.releasePointerCapture?.(e.pointerId);
      el.style.cursor = '';
    }
    drag.current.active = false;
    drag.current.captured = false;
    resumeSoon(2000);
  };

  return (
    <section className="section-pad overflow-hidden">
      <div className="shell">
        <p className="eyebrow">In uitvoering</p>
        <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-2xl text-4xl font-extrabold leading-tight text-navy md:text-5xl">
            Een doorlopende blik op recent werk.
          </h2>
          <p className="max-w-md text-base leading-7 text-graphite">
            Van buitenschilderwerk tot afgewerkte interieurs. Swipe of sleep door de strook om zelf te bladeren.
          </p>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="marquee-viewport mt-10 w-full cursor-grab md:mt-12"
        aria-label="Doorlopende weergave van uitgevoerd werk; sleep, scroll of swipe om te bladeren"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={() => {
          pause();
          resumeSoon(1500);
        }}
        onTouchStart={pause}
        onTouchEnd={() => resumeSoon(2000)}
        onTouchCancel={() => resumeSoon(2000)}
      >
        <div className="marquee-track gap-5 px-5">
          {loop.map((item, index) => (
            <MarqueeCard key={`${item.src}-${index}`} item={item} onPlay={setActiveVideo} />
          ))}
        </div>
      </div>

      {activeVideo && (
        <VideoLightbox src={activeVideo.src} poster={activeVideo.poster} onClose={() => setActiveVideo(null)} />
      )}
    </section>
  );
}

type Stage = { src: string; label: string; sub: string; alt: string };

type ComparePair = {
  before: { src: string; alt: string };
  after: { src: string; alt: string };
  beforeLabel: string;
  afterLabel: string;
};

// Drag-to-compare door renovations. `before` shows on the left under
// `beforeLabel`, `after` on the right under `afterLabel`.
const doorCompareCases: readonly { label: string; pair: ComparePair }[] = [
  {
    label: 'Eikenhouten deur',
    pair: {
      before: { src: '/voordeur-eik-voor.webp', alt: 'Verweerde eikenhouten voordeur met dofgeworden lak' },
      after: { src: '/voordeur-eik-na.webp', alt: 'Eikenhouten voordeur na renovatie met diepe hoogglans afwerking' },
      beforeLabel: 'Voor',
      afterLabel: 'Na',
    },
  },
  {
    label: 'Groene paneeldeur',
    pair: {
      before: { src: '/voordeur-voor.webp?v=20260517', alt: 'Groene dubbele voordeur met afgebladderde verflagen' },
      after: { src: '/voordeur-na.webp?v=20260517', alt: 'Groene dubbele voordeur na renovatie met strakke hoogglans afwerking' },
      beforeLabel: 'Voor',
      afterLabel: 'Na',
    },
  },
];

const dakraamStages: readonly Stage[] = [
  { src: '/showcase-roof-window-before.webp?v=20260517', label: 'Voor', sub: 'Versleten dakkapel met losse verflagen en houtwerk dat aandacht vraagt.', alt: 'Dakkapel en dakraamhoek voor afwerking' },
  { src: '/showcase-roof-window-after.webp?v=20260517', label: 'Na', sub: 'Strakke afwerking, herstelde naden en duurzaam beschermd hout.', alt: 'Dakkapel en dakraamhoek na afwerking' },
  { src: '/showcase-roof-window-after-detail.webp?v=20260517', label: 'Detail', sub: 'Vanaf straatniveau valt op hoe schoon de aansluitingen zijn afgewerkt.', alt: 'Afgewerkte dakkapel vanaf straatniveau' },
] as const;

function StageSlider({
  stages,
  ariaLabel,
  imageWidth,
  imageHeight,
}: {
  stages: readonly Stage[];
  ariaLabel: string;
  imageWidth: number;
  imageHeight: number;
}) {
  const max = (stages.length - 1) * 100;
  const [pos, setPos] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);
  const active = Math.min(stages.length - 1, Math.round(pos / 100));

  const release = () => {
    setScrubbing(false);
    setPos((value) => Math.round(value / 100) * 100);
  };

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white/8 ring-1 ring-white/10">
      <div className="relative aspect-[4/5] w-full bg-navy">
        {stages.map((stage, i) => {
          const opacity = Math.max(0, 1 - Math.abs(pos / 100 - i));
          return (
            <img
              key={stage.src}
              src={stage.src}
              alt={stage.alt}
              width={imageWidth}
              height={imageHeight}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity, transition: scrubbing ? 'none' : 'opacity 240ms ease-out' }}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          );
        })}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-4">
          <span className="rounded-md bg-navy/75 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-roller-soft backdrop-blur-sm">
            {stages[active].label}
          </span>
          <span className="rounded-md bg-navy/75 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
            {active + 1} / {stages.length}
          </span>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/95 via-navy/55 to-transparent px-5 pb-5 pt-14">
          <p className="text-sm font-semibold leading-snug text-white/92">{stages[active].sub}</p>
        </div>
      </div>

      <div className="px-4 pt-4 pb-5">
        <div className="flex gap-2">
          {stages.map((stage, i) => (
            <button
              key={stage.label}
              type="button"
              onClick={() => setPos(i * 100)}
              aria-pressed={active === i}
              className={`flex-1 rounded-md px-2 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${active === i ? 'bg-roller text-white shadow-[0_8px_18px_-8px_rgba(255,106,0,0.9)]' : 'bg-white/8 text-white/70 hover:bg-white/15 hover:text-white'}`}
            >
              {stage.label}
            </button>
          ))}
        </div>

        <input
          type="range"
          min={0}
          max={max}
          step={1}
          value={pos}
          onChange={(event) => setPos(Number(event.currentTarget.value))}
          onPointerDown={() => setScrubbing(true)}
          onPointerUp={release}
          onPointerCancel={release}
          onTouchStart={() => setScrubbing(true)}
          onTouchEnd={release}
          onBlur={release}
          aria-label={ariaLabel}
          aria-valuetext={`${stages[active].label}: ${stages[active].sub}`}
          className="door-slider mt-4"
        />
      </div>
    </div>
  );
}

function CompareSlider({ pair }: { pair: ComparePair }) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const clamp = (n: number) => Math.min(100, Math.max(0, n));

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    setPos(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  // Pointer events cover both mouse and touch with a single API.
  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      if (!draggingRef.current) return;
      event.preventDefault();
      updateFromClientX(event.clientX);
    };
    const stop = () => {
      draggingRef.current = false;
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
  }, [updateFromClientX]);

  const startDrag = (event: React.PointerEvent) => {
    draggingRef.current = true;
    updateFromClientX(event.clientX);
  };

  const onKeyDown = (event: ReactKeyboardEvent) => {
    const step = event.shiftKey ? 10 : 4;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      setPos((p) => clamp(p - step));
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      setPos((p) => clamp(p + step));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setPos(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setPos(100);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/5] w-full select-none overflow-hidden rounded-lg bg-navy ring-1 ring-white/10"
    >
      {/* After (base layer) */}
      <img src={pair.after.src} alt={pair.after.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" draggable={false} />

      {/* Before (clipped top layer, revealed on the left) */}
      <div className="absolute inset-0 h-full w-full overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={pair.before.src} alt={pair.before.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" draggable={false} />
      </div>

      {/* Corner labels */}
      <span className="pointer-events-none absolute left-3 top-3 rounded-md bg-navy/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm">
        {pair.beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-md bg-navy/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-roller-soft backdrop-blur-sm">
        {pair.afterLabel}
      </span>

      {/* Divider + handle */}
      <div className="absolute inset-y-0 z-10 w-px bg-white/90" style={{ left: `${pos}%` }}>
        <div
          role="slider"
          tabIndex={0}
          aria-label={`Vergelijk ${pair.beforeLabel.toLowerCase()} en ${pair.afterLabel.toLowerCase()}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}% ${pair.beforeLabel.toLowerCase()} zichtbaar`}
          onPointerDown={startDrag}
          onKeyDown={onKeyDown}
          className="absolute top-1/2 left-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize touch-none place-items-center rounded-full bg-roller text-white shadow-[0_8px_24px_-6px_rgba(0,0,0,0.7)] transition-transform duration-150 hover:scale-105"
        >
          <MoveHorizontal size={20} strokeWidth={2.5} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

function DoorRenovationSlider() {
  const [active, setActive] = useState(0);
  const current = doorCompareCases[active];

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-3 flex gap-2">
        {doorCompareCases.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={selected}
              className={`flex-1 rounded-md px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${selected ? 'bg-roller text-white shadow-[0_8px_18px_-8px_rgba(255,106,0,0.9)]' : 'bg-white/8 text-white/70 hover:bg-white/15 hover:text-white'}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <CompareSlider key={current.label} pair={current.pair} />

      <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-white/70">
        <MoveHorizontal size={16} className="text-roller-soft" aria-hidden="true" />
        Sleep om voor en na te vergelijken
      </p>
    </div>
  );
}

function DakraamhoekSlider() {
  return <StageSlider stages={dakraamStages} ariaLabel="Sleep om dakraamhoek voor, na en detail te vergelijken" imageWidth={1024} imageHeight={1280} />;
}

function ProjectCarousel({
  slides,
  alt = '',
  className = 'absolute inset-0',
  imageWidth,
  imageHeight,
  autoplayMs = 5000,
  loadingFirst = 'lazy',
}: {
  slides: ServiceImage[];
  alt?: string;
  className?: string;
  imageWidth?: number;
  imageHeight?: number;
  autoplayMs?: number;
  loadingFirst?: 'eager' | 'lazy';
}) {
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  const pauseTemporarily = useCallback(() => {
    setPaused(true);
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => setPaused(false), 10000);
  }, []);

  useEffect(() => {
    if (paused || total < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [paused, total, autoplayMs]);

  useEffect(() => () => {
    if (resumeRef.current) clearTimeout(resumeRef.current);
  }, []);

  if (total === 0) return null;

  const stop = (event: ReactMouseEvent | ReactKeyboardEvent) => {
    event.stopPropagation();
  };

  return (
    <div className={`overflow-hidden ${className}`}>
      {slides.map((slide, i) => (
        <img
          key={typeof slide === 'string' ? slide : slide.src}
          src={typeof slide === 'string' ? slide : slide.src}
          alt={typeof slide === 'string' ? alt : slide.alt}
          width={imageWidth}
          height={imageHeight}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${i === index ? 'opacity-100' : 'opacity-0'}`}
          loading={i === 0 ? loadingFirst : 'lazy'}
          decoding="async"
          draggable={false}
        />
      ))}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => { stop(event); prev(); pauseTemporarily(); }}
            onKeyDown={stop}
            aria-label="Vorige beeld"
            className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md bg-navy/65 text-white backdrop-blur-sm transition hover:bg-navy/90 focus-visible:bg-navy/90"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={(event) => { stop(event); next(); pauseTemporarily(); }}
            onKeyDown={stop}
            aria-label="Volgende beeld"
            className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md bg-navy/65 text-white backdrop-blur-sm transition hover:bg-navy/90 focus-visible:bg-navy/90"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
            {slides.map((slide, i) => (
              <button
                key={typeof slide === 'string' ? slide : slide.src}
                type="button"
                onClick={(event) => { stop(event); setIndex(i); pauseTemporarily(); }}
                onKeyDown={stop}
                aria-label={`Beeld ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-2 bg-white/55 hover:bg-white/85'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
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
      <div className="relative aspect-[4/5] bg-navy md:aspect-auto md:h-full">
        <ProjectCarousel slides={slides} imageWidth={imageWidth} imageHeight={imageHeight} />
      </div>
      <div className="p-6">
        <h3 className="font-display text-2xl font-extrabold">{title}</h3>
        <p className="mt-3 leading-7 text-white/88">{text}</p>
      </div>
    </article>
  );
}

function WorkShowcase({ openQuote }: { openQuote: () => void }) {
  const allImages = useMemo(() => [...roofWindowStory, ...showcaseGroups.flatMap((group) => group.images)], []);
  const [selectedImage, setSelectedImage] = useState<ShowcaseImage | null>(null);
  const [activeGroupTitle, setActiveGroupTitle] = useState(showcaseGroups[0].title);
  const activeGroup = showcaseGroups.find((group) => group.title === activeGroupTitle) ?? showcaseGroups[0];

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
      <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div>
          <p className="eyebrow text-roller-soft">Werk in beeld</p>
          <h3 className="mt-3 font-display text-3xl font-extrabold leading-tight text-white md:text-4xl">
            Dakraamhoek: van versleten tot strak afgewerkt.
          </h3>
          <p className="mt-4 leading-7 text-white/82">
            Sleep door de stappen om te zien hoe een dakraamhoek wordt hersteld en netjes wordt afgewerkt. Daaronder vindt u meer werk per onderwerp gegroepeerd.
          </p>
        </div>
        <DakraamhoekSlider />
      </div>

      <div className="mt-10">
        <div className="flex flex-wrap gap-2">
          {showcaseGroups.map((group) => {
            const active = group.title === activeGroup.title;
            return (
              <button
                key={group.title}
                type="button"
                onClick={() => setActiveGroupTitle(group.title)}
                aria-pressed={active}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  active
                    ? 'bg-roller text-white shadow-[0_12px_24px_-16px_rgba(255,106,0,0.9)]'
                    : 'border border-white/15 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                {group.title}
              </button>
            );
          })}
        </div>

        <p className="mt-5 max-w-2xl text-sm leading-6 text-white/70">{activeGroup.text}</p>

        <div className="mt-6 columns-2 gap-3 sm:columns-3 lg:columns-4">
          {activeGroup.images.map((image) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setSelectedImage(image)}
              className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-lg bg-white/8"
            >
              <img
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className="w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                loading="lazy"
                decoding="async"
              />
              <span className="absolute inset-0 bg-navy/0 transition group-hover:bg-navy/15" />
              <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-md bg-white/90 text-navy opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                <Maximize2 size={17} />
              </span>
            </button>
          ))}
        </div>
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
        <p className="mt-1 font-semibold text-navy"><span className="select-text cursor-text">{value}</span></p>
      </div>
    </div>
  );

  if (!href) return content;
  return (
    <a href={href} draggable={false} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>
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
    // Only naam, telefoon en e-mail zijn verplicht; de rest is optioneel.
    const requiredFields: Array<[QuoteFieldName, string]> = [
      ['firstName', 'Vul uw naam in.'],
      ['phone', 'Vul uw telefoonnummer in.'],
      ['email', 'Vul uw e-mailadres in.'],
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
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-hidden bg-navy/70 pt-10 backdrop-blur-sm md:items-center md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Offerte aanvragen"
    >
      <div className="quote-sheet relative flex max-h-[calc(100dvh-2.5rem)] w-full flex-col overflow-hidden rounded-t-2xl bg-whitewash shadow-2xl md:max-h-[calc(100dvh-3rem)] md:max-w-3xl md:rounded-lg">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line p-5 md:p-7">
          <div>
            <p className="eyebrow">Offerte aanvragen</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight text-navy md:text-3xl">Vertel kort wat er moet gebeuren.</h2>
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
          <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-y-auto px-6 py-16 text-center md:px-10 md:py-20">
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
          <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain safe-bottom">
            <form
              ref={formRef}
              className={`grid gap-5 p-5 md:grid-cols-2 md:p-7 ${isSubmitting ? 'pointer-events-none select-none opacity-60' : ''}`}
              onSubmit={submitQuote}
              aria-busy={isSubmitting}
              noValidate
            >
              <label className="grid gap-2 text-sm font-bold text-navy">
                <span>Naam <RequiredMark /></span>
                <input className="field" name="firstName" placeholder="Voornaam" autoComplete="given-name" required onChange={handleFieldChange('firstName')} aria-invalid={Boolean(fieldErrors.firstName)} aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined} />
                <FieldError id="firstName-error" message={fieldErrors.firstName} />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                <span>Achternaam <OptionalMark /></span>
                <input className="field" name="lastName" placeholder="Achternaam" autoComplete="family-name" onChange={handleFieldChange('lastName')} aria-invalid={Boolean(fieldErrors.lastName)} aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined} />
                <FieldError id="lastName-error" message={fieldErrors.lastName} />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                <span>Postcode <OptionalMark /></span>
                <input className="field" name="postalCode" placeholder="3449 JA" autoComplete="postal-code" onChange={handleFieldChange('postalCode')} aria-invalid={Boolean(fieldErrors.postalCode)} aria-describedby={fieldErrors.postalCode ? 'postalCode-error' : undefined} />
                <FieldError id="postalCode-error" message={fieldErrors.postalCode} />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                <span>Plaatsnaam <OptionalMark /></span>
                <input className="field" name="city" placeholder="Woerden" autoComplete="address-level2" onChange={handleFieldChange('city')} aria-invalid={Boolean(fieldErrors.city)} aria-describedby={fieldErrors.city ? 'city-error' : undefined} />
                <FieldError id="city-error" message={fieldErrors.city} />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                <span>Straatnaam <OptionalMark /></span>
                <input className="field" name="streetName" placeholder="Kuipersweg" autoComplete="address-line1" onChange={handleFieldChange('streetName')} aria-invalid={Boolean(fieldErrors.streetName)} aria-describedby={fieldErrors.streetName ? 'streetName-error' : undefined} />
                <FieldError id="streetName-error" message={fieldErrors.streetName} />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                <span>Huisnummer <OptionalMark /></span>
                <input className="field" name="houseNumber" placeholder="33" autoComplete="address-line2" onChange={handleFieldChange('houseNumber')} aria-invalid={Boolean(fieldErrors.houseNumber)} aria-describedby={fieldErrors.houseNumber ? 'houseNumber-error' : undefined} />
                <FieldError id="houseNumber-error" message={fieldErrors.houseNumber} />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                <span>Dienst <OptionalMark /></span>
                <select className="field" name="service" value={serviceValue} onChange={handleFieldChange('service')} aria-invalid={Boolean(fieldErrors.service)} aria-describedby={fieldErrors.service ? 'service-error' : undefined}>
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
                <span>Gewenste uitvoeringsdatum <OptionalMark /></span>
                <input className="field" name="preferredExecutionDate" type="date" onChange={handleFieldChange('preferredExecutionDate')} aria-invalid={Boolean(fieldErrors.preferredExecutionDate)} aria-describedby={fieldErrors.preferredExecutionDate ? 'preferredExecutionDate-error' : undefined} />
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
                <span>Projectomschrijving <OptionalMark /></span>
                <textarea
                  className="field min-h-32 resize-y"
                  name="message"
                  placeholder="Bijvoorbeeld: buitenschilderwerk kozijnen, houtrot bij voordeur, stucwerk woonkamer..."
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
                  <a href={phoneHref} draggable={false} className="font-bold text-navy underline decoration-roller/50 underline-offset-4">
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

function OptionalMark() {
  return <span className="font-semibold text-graphite/70">(optioneel)</span>;
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

function WorkAreaPage({ openQuote }: { openQuote: () => void }) {
  return (
    <>
      <section className="bg-navy text-white">
        <div className="shell grid gap-8 pb-12 pt-24 md:grid-cols-[1fr_auto] md:items-center md:pb-16 md:pt-28">
          <div className="max-w-3xl">
            <p className="eyebrow text-roller-soft">Werkgebied</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">Schilderwerk rondom Woerden.</h1>
            <p className="mt-6 text-lg leading-8 text-white/88 md:text-xl">
              Bekijk per regio welke plaatsen binnen het werkgebied vallen en welke werkzaamheden u kunt aanvragen: schilderwerk, kozijnen, houtrotherstel, stucwerk en spuitwerk. Staat uw plaats er niet bij, stuur dan uw postcode mee in de offerteaanvraag.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={openQuote} className="btn-primary">
                Offerte aanvragen
                <ArrowRight size={17} />
              </button>
              <a href={phoneHref} draggable={false} className="btn-light">
                <Phone size={17} />
                <span className="select-text cursor-text">{phoneDisplay}</span>
              </a>
            </div>
          </div>
          <div className="hidden rounded-lg border border-white/12 bg-white/8 p-6 md:block">
            <MapPin className="text-roller-soft" size={32} />
            <p className="mt-5 max-w-xs text-sm font-semibold leading-6 text-white/82">
              Duidelijke afspraken over opname, voorbereiding, planning en afwerking.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="shell">
          <div className="grid gap-6 lg:grid-cols-2">
            {workAreaGroups.map((group) => (
              <section key={group.title} className="rounded-lg border border-line bg-whitewash p-5 md:p-6">
                <h2 className="font-display text-2xl font-extrabold leading-tight text-navy">{group.title}</h2>
                <p className="mt-3 text-sm leading-6 text-graphite">{group.text}</p>
                <div className="mt-5 grid gap-3">
                  {group.slugs.map((slug) => {
                    const location = locationPages.find((item) => item.slug === slug);
                    if (!location) return null;
                    return (
                      <a key={location.slug} href={getLocationPath(location)} className="group flex items-center justify-between gap-4 rounded-md border border-line bg-white p-4 transition hover:border-navy/35">
                        <span>
                          <span className="block font-display text-lg font-extrabold text-navy">{location.title}</span>
                          <span className="mt-1 block text-sm leading-6 text-graphite">{location.featuredServices.slice(0, 3).join(', ')}</span>
                        </span>
                        <ChevronRight className="shrink-0 text-roller transition group-hover:translate-x-0.5" size={20} />
                      </a>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <Contact openQuote={openQuote} />
    </>
  );
}

function LocationPageView({ location, openQuote }: { location: LocationPage; openQuote: () => void }) {
  const featuredServices = location.featuredServices
    .map((title) => services.find((service) => service.title === title))
    .filter((service): service is Service => Boolean(service));
  const otherLocations = locationPages.filter((item) => item.slug !== location.slug).slice(0, 3);

  return (
    <>
      <section className="bg-navy text-white">
        <div className="shell grid gap-10 pb-12 pt-24 md:grid-cols-[1fr_0.78fr] md:items-center md:pb-16 md:pt-28">
          <div className="max-w-3xl">
            <a href="/werkgebied" className="inline-flex items-center gap-2 text-sm font-bold text-roller-soft">
              <ChevronRight size={16} className="rotate-180" />
              Terug naar werkgebied
            </a>
            <p className="eyebrow mt-8 text-roller-soft">Werkgebied rondom Woerden</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">Schilder voor {location.title}</h1>
            <p className="mt-6 text-lg leading-8 text-white/88 md:text-xl md:leading-8">{location.lead}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={openQuote} className="btn-primary">
                Gratis prijsindicatie
                <ArrowRight size={17} />
              </button>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-light">
                <MessageCircle size={17} />
                WhatsApp
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/10 bg-white/8">
            <img
              src={location.heroImage?.src ?? '/rn-schilders-main.webp?v=20260530'}
              alt={location.heroImage?.alt ?? `Schilderwerk voor ${location.title}`}
              width={location.heroImage?.width ?? 1024}
              height={location.heroImage?.height ?? 1536}
              className={`w-full object-cover ${location.heroImage ? 'aspect-[4/3]' : 'aspect-[3/4] object-top'}`}
              loading="eager"
              decoding="async"
            />
            <div className="grid gap-3 p-5">
              {location.areas.slice(0, 4).map((area) => (
                <div key={area} className="flex items-center gap-3 text-sm font-semibold text-white/88">
                  <MapPin size={16} className="text-roller-soft" />
                  {area}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {location.projectStory && (
        <section className="section-pad bg-whitewash">
          <div className="shell">
            <p className="eyebrow">{location.projectStory.eyebrow}</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight text-navy md:text-4xl">
              {location.projectStory.title}
            </h2>
            <div className="mt-5 grid max-w-3xl gap-4 text-base leading-8 text-graphite">
              {location.projectStory.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {location.projectStory.images.map((image) => (
                <figure key={image.src} className="overflow-hidden rounded-lg border border-line bg-white">
                  <img
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className="px-4 py-3 text-sm font-semibold text-graphite">{image.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-pad">
        <div className="shell grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <aside className="rounded-lg border border-line bg-whitewash p-5 lg:sticky lg:top-24">
            <MapPin className="text-roller" size={26} />
            <h2 className="mt-4 font-display text-2xl font-extrabold text-navy">Aanvraag uit {location.areas[0]}</h2>
            <p className="mt-3 text-sm leading-6 text-graphite">
              Voeg bij voorkeur foto's toe van kozijnen, deuren, gevelhout, muren of plafonds. Dan kan Richard sneller bepalen wat er nodig is.
            </p>
            <div className="mt-5 grid gap-3">
              <button type="button" onClick={openQuote} className="btn-primary w-full">
                Offerte aanvragen
              </button>
              <a href={phoneHref} draggable={false} className="btn-outline w-full">
                <Phone size={17} />
                <span className="select-text cursor-text">{phoneDisplay}</span>
              </a>
            </div>
          </aside>

          <div className="grid gap-8">
            <article className="rounded-lg border border-line bg-whitewash p-5 md:p-8">
              <p className="eyebrow">Waar we op letten</p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-navy md:text-4xl">Een opname die verder kijkt dan verf.</h2>
              <div className="mt-5 grid gap-4 text-base leading-8 text-graphite">
                <p>{location.routeNote}</p>
                <p>{location.localFit}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {location.areas.map((area) => (
                  <span key={area} className="rounded-md border border-line bg-white px-4 py-2 text-sm font-bold text-navy">
                    {area}
                  </span>
                ))}
              </div>
            </article>

            <article className="rounded-lg border border-line bg-whitewash p-5 md:p-8">
              <p className="eyebrow">Veelgevraagd in deze regio</p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-navy md:text-4xl">Veelvoorkomende schilderklussen in en rond {location.areas[0]}.</h2>
              <div className="mt-6 grid gap-4">
                {location.commonRequests.map((request) => (
                  <div key={request} className="flex gap-3 rounded-lg border border-line bg-white p-4 text-sm leading-6 text-ink">
                    <Check className="mt-1 shrink-0 text-roller" size={16} />
                    <span>{request}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-lg border border-line bg-whitewash p-5 md:p-8">
              <p className="eyebrow">Diensten</p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-navy md:text-4xl">Direct naar de juiste werkzaamheden.</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {location.serviceLinks.map((link) => {
                  const service = services.find((item) => item.title === link.serviceTitle);
                  if (!service) return null;
                  return (
                    <a key={link.label} href={getServicePath(service)} className="btn-outline px-4 py-2">
                      {link.label}
                      <ChevronRight size={16} />
                    </a>
                  );
                })}
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {featuredServices.map((service) => (
                  <a key={service.slug} href={getServicePath(service)} className="group rounded-lg border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-navy/35">
                    <service.icon className="text-roller" size={23} />
                    <h3 className="mt-4 font-display text-xl font-extrabold text-navy">{service.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-graphite">{service.text}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-roller">
                      Bekijk dienst
                      <ArrowRight size={16} />
                    </span>
                  </a>
                ))}
              </div>
            </article>

            <article className="rounded-lg border border-line bg-whitewash p-5 md:p-8">
              <p className="eyebrow">Veelgestelde vragen</p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-navy md:text-4xl">Praktisch voordat u een offerte aanvraagt.</h2>
              <div className="mt-6 grid gap-4">
                {location.faqs.map((faq) => (
                  <section key={faq.question} className="rounded-lg border border-line bg-white p-5">
                    <h3 className="font-display text-xl font-extrabold text-navy">{faq.question}</h3>
                    <p className="mt-3 text-sm leading-6 text-graphite">{faq.answer}</p>
                  </section>
                ))}
              </div>
            </article>

            <article className="rounded-lg border border-line bg-whitewash p-5 md:p-8">
              <p className="eyebrow">Meer regio</p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-navy md:text-4xl">Andere plaatsen in het werkgebied.</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {otherLocations.map((item) => (
                  <a key={item.slug} href={getLocationPath(item)} className="rounded-lg border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-navy/35">
                    <h3 className="font-display text-lg font-extrabold leading-tight text-navy">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-graphite">{item.seoDescription}</p>
                  </a>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <Contact openQuote={openQuote} />
    </>
  );
}

function ServicePageView({ service, openQuote }: { service: Service; openQuote: () => void }) {
  const otherServices = services.filter((item) => item.title !== service.title);
  const gallery = service.images && service.images.length > 1 ? service.images : null;

  return (
    <>
      <section className="bg-navy text-white">
        <div className="shell grid gap-10 pb-12 pt-24 md:grid-cols-[1fr_0.85fr] md:items-center md:pb-16 md:pt-28">
          <div className="max-w-3xl">
            <a href="/#diensten" className="inline-flex items-center gap-2 text-sm font-bold text-roller-soft">
              <ChevronRight size={16} className="rotate-180" />
              Terug naar diensten
            </a>
            <div className="mt-8 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-roller-soft">
              <service.icon size={18} />
              <span className="eyebrow text-roller-soft">Dienst in Woerden</span>
            </div>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">{service.detailTitle}</h1>
            <p className="mt-6 text-lg leading-8 text-white/88 md:text-xl">{service.detailIntro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={openQuote} className="btn-primary">
                Gratis prijsindicatie
                <ArrowRight size={17} />
              </button>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-light">
                <MessageCircle size={17} />
                WhatsApp
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/10 bg-white/8">
            <div className="relative aspect-[4/3]">
              {gallery ? (
                <ProjectCarousel slides={gallery} className="absolute inset-0 h-full w-full bg-navy" imageWidth={service.width} imageHeight={service.height} loadingFirst="eager" />
              ) : (
                <img
                  src={service.image}
                  alt={`${service.title} door RN Schilders in Woerden`}
                  width={service.width}
                  height={service.height}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="shell grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <aside className="rounded-lg border border-line bg-whitewash p-5 lg:sticky lg:top-24">
            <service.icon className="text-roller" size={26} />
            <h2 className="mt-4 font-display text-2xl font-extrabold text-navy">{service.title} aanvragen</h2>
            <p className="mt-3 text-sm leading-6 text-graphite">
              Voeg bij voorkeur een paar foto's toe bij uw aanvraag. Dan kan Richard sneller bepalen wat er nodig is en wat het ongeveer kost.
            </p>
            <div className="mt-5 grid gap-3">
              <button type="button" onClick={openQuote} className="btn-primary w-full">
                Offerte aanvragen
              </button>
              <a href={phoneHref} draggable={false} className="btn-outline w-full">
                <Phone size={17} />
                <span className="select-text cursor-text">{phoneDisplay}</span>
              </a>
            </div>
          </aside>

          <div className="grid gap-8">
            <article className="rounded-lg border border-line bg-whitewash p-5 md:p-8">
              <p className="eyebrow">Wat we doen</p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-navy md:text-4xl">{service.title} van voorbereiding tot afwerking.</h2>
              <p className="mt-5 text-base leading-8 text-graphite">{service.text}</p>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {service.detailSections.map((section) => (
                  <div key={section.title} className="rounded-md border border-line bg-white p-5">
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
            </article>

            {gallery && (
              <article className="rounded-lg border border-line bg-whitewash p-5 md:p-8">
                <p className="eyebrow">Werk in beeld</p>
                <h2 className="mt-4 text-3xl font-extrabold leading-tight text-navy md:text-4xl">Voorbeelden van {service.title.toLowerCase()}.</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {gallery.map((item) => (
                    <figure key={typeof item === 'string' ? item : item.src} className="overflow-hidden rounded-lg border border-line bg-white">
                      <img
                        src={typeof item === 'string' ? item : item.src}
                        alt={typeof item === 'string' ? `${service.title} project van RN Schilders in de regio Woerden` : item.alt}
                        width={service.width}
                        height={service.height}
                        className="aspect-[4/3] w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </figure>
                  ))}
                </div>
              </article>
            )}

            <article className="rounded-lg border border-line bg-whitewash p-5 md:p-8">
              <p className="eyebrow">Veelgestelde vragen</p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-navy md:text-4xl">Praktisch over {service.title.toLowerCase()}.</h2>
              <div className="mt-6 grid gap-4">
                {service.faqs.map((faq) => (
                  <section key={faq.question} className="rounded-lg border border-line bg-white p-5">
                    <h3 className="font-display text-xl font-extrabold text-navy">{faq.question}</h3>
                    <p className="mt-3 text-sm leading-6 text-graphite">{faq.answer}</p>
                  </section>
                ))}
              </div>
            </article>

            <article className="rounded-lg border border-line bg-whitewash p-5 md:p-8">
              <p className="eyebrow">Meer diensten</p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-navy md:text-4xl">Andere werkzaamheden.</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {otherServices.map((item) => (
                  <a key={item.title} href={getServicePath(item)} className="group rounded-lg border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-navy/35">
                    <item.icon className="text-roller" size={22} />
                    <h3 className="mt-4 font-display text-lg font-extrabold text-navy">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-graphite">{item.text}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-roller">
                      Bekijk dienst
                      <ArrowRight size={16} />
                    </span>
                  </a>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <Contact openQuote={openQuote} />
    </>
  );
}

function AboutPage({ openQuote }: { openQuote: () => void }) {
  return (
    <>
      <section className="bg-navy text-white">
        <div className="shell grid gap-10 pb-12 pt-24 md:grid-cols-[1fr_0.85fr] md:items-center md:pb-16 md:pt-28">
          <div className="max-w-3xl">
            <p className="eyebrow text-roller-soft">Over ons</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">Een meewerkend eigenaar op elk project.</h1>
            <p className="mt-6 text-lg leading-8 text-white/88 md:text-xl">
              RN Schilders & Renovatie is gebouwd rond Richard: meer dan vijftien jaar ervaring, direct contact en zelf aanwezig bij de uitvoering. Eén aanspreekpunt, duidelijke afspraken en iemand die voorbereiding, planning en eindresultaat zelf controleert.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={openQuote} className="btn-primary">
                Offerte aanvragen
                <ArrowRight size={17} />
              </button>
              <a href={phoneHref} draggable={false} className="btn-light">
                <Phone size={17} />
                <span className="select-text cursor-text">{phoneDisplay}</span>
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/10 bg-white/8">
            <img
              src="/workspace-hero.webp?v=20260514"
              alt="Bedrijfsbus van RN Schilders & Renovatie in Woerden"
              width={1536}
              height={1024}
              className="aspect-[4/3] w-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="shell grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="eyebrow">Wie zijn wij</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-navy md:text-4xl">Vakwerk dat zichtbaar blijft in Woerden en omgeving.</h2>
            <div className="mt-5 grid gap-4 text-base leading-8 text-graphite">
              <p>
                RN Schilders & Renovatie is een schilder- en renovatiebedrijf uit Woerden. We verzorgen binnen- en buitenschilderwerk, kozijnen, spuitwerk, stucwerk, houtrotherstel en sloopwerk, voor zowel woningen als bedrijfspanden.
              </p>
              <p>
                Richard komt zelf langs voor de opname, beoordeelt het werk op locatie en blijft uw vaste aanspreekpunt tijdens de uitvoering. Zo weet u vooraf wat er nodig is en sluit de offerte aan op de praktijk.
              </p>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {services.map((service) => (
                <a key={service.title} href={getServicePath(service)} className="btn-outline px-4 py-2">
                  {service.title}
                  <ChevronRight size={16} />
                </a>
              ))}
            </div>
          </div>
          <img
            src="/rn-schilders-main.webp?v=20260530"
            alt="Schilder van RN Schilders aan het werk in Woerden"
            width={1024}
            height={1536}
            className="aspect-[3/4] w-full rounded-lg object-cover object-top"
            loading="lazy"
            decoding="async"
          />
        </div>
      </section>

      <section className="section-pad bg-whitewash">
        <div className="shell">
          <p className="eyebrow">Werkwijze</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight text-navy md:text-4xl">
            Zo verloopt een project van offerte tot oplevering.
          </h2>
          <div className="mt-9 grid gap-4 md:grid-cols-2">
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
      </section>

      <Contact openQuote={openQuote} />
    </>
  );
}

function ContactPage({ openQuote }: { openQuote: () => void }) {
  return (
    <>
      <section className="bg-navy text-white">
        <div className="shell grid gap-8 pb-12 pt-24 md:grid-cols-[1fr_auto] md:items-center md:pb-16 md:pt-28">
          <div className="max-w-3xl">
            <p className="eyebrow text-roller-soft">Contact</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">Vraag een gratis offerte aan in Woerden.</h1>
            <p className="mt-6 text-lg leading-8 text-white/88 md:text-xl">
              Bel, mail of stuur uw projectinformatie online. Richard neemt binnen 24 tot 48 uur contact op om uw plan en de volgende stap door te spreken.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={openQuote} className="btn-primary">
                Offerte aanvragen
                <ArrowRight size={17} />
              </button>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-light">
                <MessageCircle size={17} />
                WhatsApp
              </a>
            </div>
          </div>
          <div className="hidden rounded-lg border border-white/12 bg-white/8 p-6 md:block">
            <Phone className="text-roller-soft" size={32} />
            <p className="mt-5 max-w-xs text-sm font-semibold leading-6 text-white/82">
              Direct contact met de eigenaar, korte lijnen en geen tussenpersonen.
            </p>
          </div>
        </div>
      </section>

      <Contact openQuote={openQuote} />
    </>
  );
}

function TermsPage({ openQuote }: { openQuote: () => void }) {
  return (
    <section className="bg-paper">
      <div className="bg-navy text-white">
        <div className="shell grid gap-8 pb-10 pt-24 md:grid-cols-[1fr_auto] md:items-center md:pb-14 md:pt-28">
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
                <a href={phoneHref} draggable={false} className="underline decoration-roller-soft/70 underline-offset-4">
                  085 060 6309
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

// Clicking the Google reviews part of the Trustoo widget should open our Google
// Maps place page, not the Trustoo profile that the widget links to by default.
const GOOGLE_MAPS_REVIEWS_URL =
  'https://www.google.com/maps/place/RN+Schilders+%26+Renovatie/@52.0837987,4.8587872,836m/data=!3m1!1e3!4m8!3m7!1s0x47c67727f0dfd923:0x4e29cd84763f73f5!8m2!3d52.0837988!4d4.8636581!9m1!1b1!16s%2Fg%2F11n4xgf7kn?entry=ttu';

function TrustooWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://static.trustoo.nl/widget/widget_v2.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // The whole widget is covered by a single absolutely-positioned anchor that
  // links to the Trustoo profile, so the Google rating block underneath it is
  // not independently clickable. Lay our own anchor (-> Google Maps) over just
  // the Google badge, promoting the badge to its own stacking context so the
  // overlay sits above Trustoo's. A real anchor keeps native link behaviour
  // (new tab, middle/ctrl-click, focus, hover URL). The widget renders async
  // and may re-render, so (re)attach via a MutationObserver.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const findGoogleBadge = (): HTMLElement | null => {
      // `.Lb4cK` is Trustoo's minified wrapper for the Google rating block.
      const byClass = container.querySelector<HTMLElement>('.Lb4cK');
      if (byClass) return byClass;
      // Fallback: an element that contains the Google branding/score.
      return (
        Array.from(container.querySelectorAll<HTMLElement>('div, a')).find((el) =>
          /google/i.test(el.getAttribute('aria-label') ?? el.textContent ?? ''),
        ) ?? null
      );
    };

    const attachOverlay = () => {
      const badge = findGoogleBadge();
      if (!badge || badge.querySelector('a[data-maps-overlay]')) return;
      badge.style.position = 'relative';
      badge.style.zIndex = '10'; // beat Trustoo's z-index:9 sibling overlay
      const overlay = document.createElement('a');
      overlay.href = GOOGLE_MAPS_REVIEWS_URL;
      overlay.target = '_blank';
      overlay.rel = 'noopener noreferrer';
      overlay.setAttribute('aria-label', 'Bekijk onze Google reviews');
      overlay.setAttribute('data-maps-overlay', '');
      overlay.style.cssText = 'position:absolute;inset:0;z-index:10;display:block;cursor:pointer';
      badge.appendChild(overlay);
    };

    attachOverlay();
    const observer = new MutationObserver(attachOverlay);
    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
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

const socials = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61587764523860",
    hover: "hover:bg-[#1877F2] hover:border-[#1877F2]",
    path: "M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.988H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.129 22 16.991 22 12c0-5.523-4.477-10-10-10z",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/rn.schilders/",
    hover: "hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:border-transparent",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.849.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@rn.schilders",
    hover: "hover:bg-[#fe2c55] hover:border-[#fe2c55]",
    path: "M19.589 6.686a4.793 4.793 0 01-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 01-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 013.183-4.51v-3.5a6.329 6.329 0 00-5.394 10.692 6.33 6.33 0 0010.857-4.424V8.687a8.182 8.182 0 004.773 1.526V6.79a4.831 4.831 0 01-1.003-.104z",
  },
];

function SocialLinks() {
  return (
    <div className="flex gap-3">
      {socials.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          aria-label={s.name}
          title={s.name}
          className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/85 transition-colors hover:text-white ${s.hover}`}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d={s.path} />
          </svg>
        </a>
      ))}
    </div>
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
          <div className="flex flex-col gap-4 md:items-end">
            <SocialLinks />
            <div className="flex flex-wrap gap-3 text-sm font-semibold text-white/88 md:justify-end">
              {services.map((service) => (
                <a key={service.slug} href={getServicePath(service)} className="hover:text-white">
                  {service.title} Woerden
                </a>
              ))}
              {locationPages.map((location) => (
                <a key={location.slug} href={getLocationPath(location)} className="hover:text-white">
                  Schilder {location.title}
                </a>
              ))}
              <a href="/werkgebied" className="hover:text-white">
                Werkgebied
              </a>
              <a href="/over-ons" className="hover:text-white">
                Over ons
              </a>
              <a href="/contact" className="hover:text-white">
                Contact
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
      </div>
    </footer>
  );
}

export default App;
