import {useEffect, useMemo, useRef, useState, type FormEvent} from 'react';
import {
  Bike, Calendar, Trees, MapPin, Phone, MessageCircle, Mail, Menu, X, Users, BedDouble,
  PawPrint, Wifi, Sun, Camera, ChevronRight, ChevronLeft, Star, Send, Globe,
  Flame, Waves, Bath, Car, TreePine, Sparkles, Check, Accessibility, Play, WashingMachine, Baby,
  Palmtree, Umbrella, ShieldCheck,
} from 'lucide-react';
import {CONTACT_EMAIL, SITE_NAME, SITE_URL} from './site';
import imageSizes from './image-manifest.json';

type Lang = 'nl' | 'en' | 'de';
/** Order of the language switcher, Dutch first. */
const LANGS: Lang[] = ['nl', 'en', 'de'];
/* The language at the root of the site; the others get a path prefix. Dutch,
   because that is who searches for a holiday home in Winterswijk: the Achterhoek
   draws Dutch and German guests, and English is the smaller, third audience. */
const DEFAULT_LANG: Lang = 'nl';
const WHATSAPP = '31655124460';
const PHONE = '+31655124460';
const PHONE_DISPLAY = '+31 6 55124460';
/* From the owner's own site (winterswijkvakantiehuis.nl) — replaces the earlier guessed info@ address. */
const EMAIL = CONTACT_EMAIL;
const HUURKALENDER = 'https://www.huurkalender.nl/';
/* The film on the owners' own denmollenhof.nl/nl/paarden page. */
const HORSES_VIDEO = 'KI75VK53uQU';

/* ------------------------------------------------------------------ */
/*  huurkalender.nl embeds                                             */
/* ------------------------------------------------------------------ *
   The owner takes bookings through huurkalender.nl. Account 21492 holds one
   calendar per home; the ids in `calId` below come from that account's own
   overview widget (cal-id -> service name).

   Their pages are cross-origin iframes, so nothing *inside* them can be
   restyled from here. What we do control:
     1. the iframe element  -> a CSS filter pulls their neon greens / #f07e6f
        into the sage + clay range the rest of the site lives in. The two views
        need two different filters, see HK_FILTER / HK_FILTER_OVERVIEW;
     2. how much of the page we show -> their toolbar (a "Website" button
        pointing at denmollenhof.nl, prev/next, a flag picker) and their
        LEGENDA box are cropped off and replaced with ours;
     3. the URL -> `start` and `m` are how our own month navigation works,
        and `lang` follows the language switch at the top of the site.
   Their huurkalender.js posts the page's rendered height to us on load, and
   that is what sizes the frame — see useHkHeight(). One catch, and it is the
   reason the frame starts life 240px tall: their getDocHeight() returns
   Math.max(body.scrollHeight, ..., html.clientHeight), and html.clientHeight
   IS the height we gave the iframe. Size the frame generously up front and it
   just reads our own number back to us. Start it shorter than the content and
   the first value that arrives is their true height. Measured Aug 2026: a
   frame opened at 240px reports 902, the same frame opened at 2000px reports
   2000.

   hkGridHeight() computes the same number from the calendar grid and is kept
   as the fallback for when no message arrives at all (their JS blocked, a
   parse failure, an offline dev run).

   The frame is only ever given a width at which their
   toolbar is known not to wrap: 330px (one month column, toolbar on two lines)
   or >= 660px (two or three columns, one line). Anything in between would move
   the crop, so we never render it there.                                      */
const HK_BASE = 'https://www.huurkalender.nl';
const HK_ACCOUNT = 21492;
const HK_LANG: Record<Lang, string> = {nl: 'nl', en: 'gb', de: 'de'};
/* The two views do NOT paint availability the same way, so one filter cannot
   serve both. A home calendar leaves free days as the pale field its month block
   sits on (#efffcb) and only paints the booked ones (#f07e6f) -- so free reads as
   "no colour" and the filter only has to tame the reds. The all-homes overview
   paints every single cell: free is #ddffcc, a pale mint. Run that through
   HK_FILTER and the sepia tips its hue from 100 to 63 while brightness(1.02)
   clips R and G at 255 -- it comes out #ffffe6, plain yellow. That is the
   "available is yellow" the client saw on the homepage, and it is why the
   overview drops the sepia/brightness pair and leans on saturate instead: the
   mint is so close to white that a warm tint swamps it, but desaturating leaves
   the hue intact. Measured with the account's own colours (Aug 2026):
     free  #ddffcc -> #eefcde  (was #ffffe6)
     booked #f07e6f -> #c88b83, within a hair of the #c8958d a home calendar's
                       booked days land on, so both views read as one palette. */
const HK_FILTER = 'saturate(0.46) sepia(0.2) hue-rotate(-6deg) brightness(1.02)';
const HK_FILTER_OVERVIEW = 'saturate(0.55) sepia(0.06) hue-rotate(-2deg)';
/** One month column is ~330px wide in their grid; the day grid of the all-homes
    overview needs ~1010px before the 31st of the month stops being clipped. */
const HK_COL = 330;
const HK_OVERVIEW_W = 1010;
/** Height of their calendar blocks. A month block is a title bar, a weekday row
    and one 40px row per week; month rows sit 25px apart. Measured Aug 2026. */
const HK_MONTH_BASE = 62;
const HK_WEEK_ROW = 40;
const HK_MONTH_GAP = 25;
/** The all-homes overview always renders twelve months of one row per calendar,
    so its height only moves when the owner adds a home to the account. Only a
    fallback now — normally their postMessage height is used instead. */
const HK_OVERVIEW_HOMES = 4;
const HK_OVERVIEW_FULL = 12 * (46 + HK_OVERVIEW_HOMES * 25) + 11 * 30 + 20;
/** Height their frame opens at, before their own height message arrives. Must
    stay well under the real content height or getDocHeight() echoes it back. */
const HK_PROBE_H = 240;
/** What sits below the month grid, and so gets cropped off along with it.
    A home calendar ends in their LEGENDA box (108px) plus 45px of padding —
    constant across 330/660/1010/1110px wide, nl/gb/de, and every start month
    measured. The all-homes overview has no legend: its content ends flush. */
const HK_BOTTOM_HOME = 153;
const HK_BOTTOM_OVERVIEW = 0;
/** Shaved off the crop so no hairline of their legend border can show. */
const HK_SAFETY = 2;
/** Collapsed height on the landing page — a year at once is far too tall. */
const HK_OVERVIEW_PEEK = 470;
/** Where their own chrome ends: page title + toolbar above the grid (on a narrow
    frame the toolbar wraps onto a second line), toolbar only for the overview. */
const HK_CROP_HOME_WIDE = 128;
const HK_CROP_HOME_NARROW = 160;
const HK_CROP_OVERVIEW = 90;

/* ------------------------------------------------------------------ */
/*  Translations                                                       */
/* ------------------------------------------------------------------ */
const t = {
  nl: {
    nav: {homes: 'Huizen', horses: 'Paarden', curacao: 'Curaçao', area: 'In de buurt', availability: 'Beschikbaarheid', about: 'Over ons', contact: 'Contact'},
    /* Head tags per page, per language. Written for the query rather than lifted
       from the body copy: these are what a searcher reads in the result list. */
    meta: {
      title: 'Vakantiehuizen in Winterswijk met sauna | Winterswijk Vakantiehuis',
      description: 'Karaktervolle vakantiehuizen in Winterswijk en de Achterhoek. Elk huis heeft een eigen sauna, uw hond is welkom in vijf van de negen huizen en uw paard mag mee. Boek direct bij de beheerder.',
      todoTitle: 'Te doen in Winterswijk en de Achterhoek | Winterswijk Vakantiehuis',
      todoDescription: 'Fietsen, wandelen, natuur en evenementen rond Winterswijk. Waar u fietsen huurt, wat er nu in de natuur te zien is en wat er speelt tijdens uw verblijf.',
      horsesTitle: 'Vakantie met uw eigen paard in Winterswijk | Winterswijk Vakantiehuis',
      horsesDescription: 'Neem uw eigen paard mee op vakantie: 10 tot 14 stallen, dagelijks weidegang, verzorging inbegrepen en zandpaden bij de deur op recreatiepark Den Möllenhof.',
      curacaoTitle: 'Aemilius Curaçao: villa, appartement en studio | Winterswijk Vakantiehuis',
      curacaoDescription: 'Ons privé mini-resort in Barber op Curaçao: villa Fenya, appartement Yeva en een studio rond een eigen zwembad. Volledig ommuurd en rolstoeltoegankelijk.',
    },
    notFound: {
      title: 'Deze pagina bestaat niet',
      text: 'De link klopt niet meer of is verkeerd overgenomen. Hieronder vindt u alle vakantiehuizen terug.',
      cta: 'Naar de vakantiehuizen',
    },
    hero: {
      kicker: 'Vakantiehuizen in de Achterhoek',
      title: 'Even helemaal weg, kom tot rust in de natuur',
      sub: 'Karaktervolle vakantiehuizen in en rond Winterswijk. Direct contact met de beheerder.',
      ctaHomes: 'Bekijk de huizen',
      ctaAvail: 'Check beschikbaarheid',
    },
    /* Replaces the old "Zomer in de Achterhoek" band. The client does NOT want the site to
       promise seasonal styling of the homes — but they DO want it front and centre that they
       personally tip guests on what is on in the area. */
    tips: {
      kicker: 'Persoonlijke tips',
      title: 'Wij weten precies wat er te doen is',
      text: 'Wij wonen hier zelf en houden de agenda van Winterswijk bij. Voor en tijdens uw verblijf tippen we u persoonlijk: welke route er in dit seizoen het mooist bij ligt, wat er op dit moment in de natuur te zien is en welke evenementen er zijn tijdens de dagen dat u er bent.',
      cta: 'Bekijk wat er nu te doen is',
    },
    homes: {
      title: 'Onze vakantiehuizen',
      sub: 'Elk huis heeft een eigen sauna en in vijf van de negen huizen is uw hond welkom. Het verschil zit in de plek: onze drie huizen aan de Jonkersweg staan op een kleinschalig recreatiepark, vlak bij het meer het Hilgelo, en onze woningen op de Kattenberg staan midden in het bos.',
      guests: 'gasten', bedrooms: 'slaapkamers', book: 'Bekijk & boek', view: 'Bekijk huis',
      capacityAsk: 'Indeling op aanvraag',
      badgeLake: 'Aan het meer', badgeForest: 'In het bos', badgeAccessible: 'Rolstoeltoegankelijk',
      groupLake: 'Aan het meer het Hilgelo: Jonkersweg, Den Möllenhof',
      groupLakeText: 'Drie huizen naast elkaar op recreatiepark Den Möllenhof in Winterswijk Meddo, op een paar minuten van het Hilgelo met zijn strandje en wandelpaden. Alle drie bieden ze plek aan zes personen en hebben ze een eigen sauna.',
      groupForest: 'In het bos op de Kattenberg, vlak bij natuurreservaat Korenburgerveen en Meddoseveen',
      groupForestText: 'Onze woningen op de Kattenberg staan juist midden in het bos: het groen begint achter de tuin en de wandel-, fiets- en ruiterpaden bij de deur. Ook hier heeft elk huis een eigen sauna.',
      /* Was "Meer locaties op komst" — Aemilius op Curaçao is inmiddels open, dus dit blok
         is nu een echte teaser met een eigen pagina erachter. */
      curacaoKicker: 'Ook op Curaçao',
      curacaoTitle: 'Aemilius, ons mini resort op Curaçao',
      curacaoText: 'Ons tweede adres: een volledig ommuurd privé mini-resort in het rustige dorp Barber, met villa Fenya, appartement Yeva en een studio rond een eigen zwembad. Rolstoeltoegankelijk, en de mooiste stranden van het eiland liggen op korte rijafstand.',
      curacaoCta: 'Bekijk Curaçao',
      manage: 'Interesse om uw huis te laten beheren? Neem contact met ons op.',
    },
    /* The owner had this confirmed at a viewing on 31-07: hers is the only wheelchair
       accessible holiday home in Winterswijk. Own band on the landing page, because it
       is both a unique selling point and the kind of thing guests give up searching for. */
    access: {
      kicker: 'Uniek in Winterswijk',
      title: 'De enige rolstoeltoegankelijke vakantiewoning van Winterswijk',
      text: 'Onze geschakelde 8-persoonswoning op de Kattenberg is volledig rolstoeltoegankelijk. Bij een bezichtiging bleek het de enige vakantiewoning in Winterswijk te zijn waar dat zo is. Kom gerust met een rolstoel: neem even contact op, dan lopen we samen door wat u nodig heeft en zorgen we dat alles klaarstaat als u aankomt.',
      points: [
        'Slaapkamer én badkamer op de begane grond',
        'Drempelloze inloopdouche met opklapbare douchestoel',
        'Toilet met steunbeugels en een onderrijdbare wastafel',
        'Brede doorgangen en drempelloos naar tuin en terras',
      ],
      cta: 'Bekijk deze woning',
      contact: 'Overleg uw wensen',
      photoCaption: 'De aangepaste badkamer op de begane grond',
    },
    detail: {
      back: 'Alle huizen', overview: 'In het kort', amenities: 'Voorzieningen',
      availTitle: 'Beschikbaarheid & boeken',
      availText: 'Hieronder ziet u de actuele kalender van dit huis, rechtstreeks uit ons boekingssysteem. Ziet u een periode die vrij is? Laat het ons weten via WhatsApp, dan zetten we het huis voor u klaar.',
      note: 'Boek direct bij ons, zonder tussenpersonen en zonder boekingskosten.',
      bookWa: 'Boek via WhatsApp', calendar: 'Naar de kalender',
      nearby: 'In de buurt', nearbyText: 'Fietsroutes, natuur en het gezellige centrum van Winterswijk liggen op korte afstand. Wij tippen u graag over wat er tijdens uw verblijf te doen is.',
    },
    avail: {
      title: 'Beschikbaarheid & boeken',
      text: 'Hieronder ziet u in één oogopslag wanneer onze huizen vrij zijn. De kalender is live: hij komt rechtstreeks uit ons boekingssysteem en loopt een jaar vooruit. Boeken doet u direct bij ons, zonder tussenpersonen.',
      note: 'Per huis staat de volledige kalender op de pagina van dat huis.',
      button: 'Naar de kalender',
    },
    /* Copy that sits around the huurkalender iframes. Their own labels inside the
       frame follow the language switch too (nl / gb / de). */
    hk: {
      free: 'Beschikbaar', booked: 'Bezet', past: 'Verstreken',
      live: 'Live beschikbaarheid',
      loading: 'Kalender laden…',
      swipe: 'Sleep de kalender opzij voor de rest van de maand',
      expand: 'Toon het hele jaar',
      collapse: 'Toon minder',
      prev: 'Eerder', next: 'Later',
      fromToday: 'Vanaf deze maand',
      openTab: 'Kalender openen op huurkalender.nl',
      soonTitle: 'Kalender wordt aangesloten',
      soonText: 'Voor dit huis loopt de koppeling met onze kalender nog. Vraag de beschikbaarheid even bij ons op, u krijgt meestal dezelfde dag antwoord.',
    },
    area: {
      title: 'Te doen in de buurt',
      sub: 'Winterswijk is het kloppende hart van het Nationaal Landschap Achterhoek. Dit kunt u vanuit het huis allemaal doen.',
      items: [
        {icon: 'bike', title: 'Fietsen & wandelen', text: 'Duizenden kilometers knooppuntenroutes door coulisselandschap, langs beken en oude boerderijen. Routekaarten liggen klaar in het huis.'},
        {icon: 'trees', title: 'Natuur spotten', text: 'Reeën, dassen, ijsvogels en steenuilen. We geven per seizoen door wat er nu te zien is en waar.'},
        {icon: 'calendar', title: 'Evenementen', text: 'Streekmarkten, muziek, de Zwarte Cross en het Winterswijkse zomerprogramma. We tippen wat er tijdens uw verblijf speelt.'},
        {icon: 'camera', title: 'Dorp & cultuur', text: 'Het gezellige centrum van Winterswijk met terrasjes, het Steengroeve-theater en musea op korte afstand.'},
      ],
      bikeTitle: 'Fietsen huren',
      bikeText: 'Geen eigen fiets mee? In Winterswijk huurt u eenvoudig een stadsfiets, e-bike, tandem of fatbike. Verschillende verhuurders brengen de fietsen bij het huis en halen ze daar ook weer op. Wij regelen de reservering of leggen precies uit waar en hoe, zodat u de volgende ochtend zo op pad kunt.',
      bikeButton: 'Vraag naar fietsverhuur',
      allButton: 'Alles om te doen in de buurt',
      eventsTitle: 'Wat er nu speelt',
      eventsSub: 'Een greep uit de agenda van Winterswijk. Vraag ons naar de actuele agenda voor uw aankomstdatum: wij weten wat er die week speelt en wat de moeite waard is.',
      eventsNote: 'Data onder voorbehoud. Vraag ons naar de actuele agenda voor uw aankomstdatum.',
      parkTitle: 'Het park vanuit de lucht',
      photoBy: 'Foto:',
      parkText: 'Recreatiepark Den Möllenhof in Winterswijk Meddo, met de bosranden en het water op loopafstand.',
      natureTitle: 'Natuur in de buurt',
      natureSub: 'Wat u hier tegenkomt als u even stil blijft staan. Vraag ons wat er op dit moment te zien is, dan wijzen we u meteen de goede plek aan.',
      nowBadge: 'Nu te zien',
      nearbyTitle: 'Vanaf de deur',
      nearbySub: 'Wat er binnen handbereik ligt vanaf de huizen. De afstanden zijn gemeten vanaf de Kattenberg; vanaf de Jonkersweg ligt het Hilgelo juist om de hoek.',
    },
    /* The client asked to make it prominent that the flamingos are only visible for a short
       window. The colony breeds April–July, so at the end of July this is genuinely the tail end. */
    flamingo: {
      badge: 'Nu te zien, nog heel even',
      title: 'De flamingo’s zijn er nu nog',
      text: 'Echt waar: op zo’n 15 km, in het Zwillbrocker Venn, broedt de noordelijkste flamingokolonie ter wereld. Het broedseizoen loopt van april tot juli, dus dit is de laatste kans van dit jaar om ze met hun jongen te zien. Vraag ons naar de beste kijkplek en het beste tijdstip.',
      cta: 'Vraag naar de kijkplek',
    },
    about: {
      title: 'Over ons',
      text: 'Winterswijk Vakantiehuis is gespecialiseerd in sfeervolle vakantiewoningen in de natuur van Winterswijk. Wij verhuren geen anonieme accommodaties: als beheerders kennen we de streek en elke fietsroute, en weten we precies wat er tijdens uw verblijf in de omgeving te doen is. Wij geloven in een persoonlijke benadering en zorgen ervoor dat uw verblijf onvergetelijk wordt.',
      point1: 'Persoonlijk beheerd, geen groot verhuurkantoor',
      point2: 'Alleen eigen of in beheer genomen huizen',
      point3: 'Persoonlijke tips over routes, natuur en evenementen',
      point4: 'Uw hond is in vijf van onze negen huizen welkom',
      stats: [
        {value: '25', label: 'jaar ervaring'},
        {value: '5 van 9', label: 'hondvriendelijk'},
        {value: '9', label: 'vakantiewoningen'},
      ],
    },
    contact: {
      title: 'Neem contact op',
      sub: 'Vragen of direct boeken? Stuur een bericht, we reageren snel.',
      name: 'Naam', email: 'E-mail', dates: 'Gewenste periode', guests: 'Aantal personen',
      pets: 'Huisdieren mee?', kids: 'Kinderen mee?', wheelchair: 'Rolstoel of hulpmiddel nodig?',
      message: 'Uw bericht', send: 'Verstuur bericht', or: 'of bel',
      wa: 'WhatsApp', call: 'Bel ons', callShort: 'Bellen',
      /* Het formulier gaat sinds de overzet naar e-mail in plaats van WhatsApp. */
      sending: 'Versturen…',
      sentTitle: 'Bedankt, uw bericht is verstuurd',
      sentText: 'U ontvangt een bevestiging per e-mail. Wij nemen zo snel mogelijk contact met u op.',
      errorTitle: 'Versturen is niet gelukt.',
      errorText: 'Probeer het nog een keer, of neem contact op via WhatsApp of telefoon.',
      errName: 'Vul uw naam in.',
      errEmail: 'Vul een geldig e-mailadres in.',
      errMessage: 'Vertel ons kort iets over uw verblijf.',
      privacy: 'Wij gebruiken uw gegevens alleen om uw aanvraag te beantwoorden.',
      placeholder: {
        name: 'Uw naam', email: 'u@voorbeeld.nl', dates: 'bijv. 12 t/m 19 juli', guests: 'bijv. 4',
        pets: 'bijv. 1 hond (labrador)', kids: 'bijv. 2 kinderen van 4 en 7',
        wheelchair: 'bijv. ja, 1 rolstoel',
        message: 'Vertel ons over uw verblijf...',
      },
    },
    /* Vakantie met uw paard — the owners also run recreatiepark Den Möllenhof's stables
       (denmollenhof.nl/nl/paarden, same phone number as the owner). Content and photos
       come from that page. Stabling rates deliberately left off, in line with the
       no-prices-on-the-site rule. */
    horses: {
      kicker: 'Vakantie met uw paard',
      title: 'Uw paard gaat gewoon mee op vakantie',
      teaser: 'Neem uw eigen paard of pony mee. Op recreatiepark Den Möllenhof, waar ook onze huizen aan de Jonkersweg staan, zijn stallen en weilanden, verzorgen wij uw paard en beginnen de zandpaden bij de deur.',
      cta: 'Alles over vakantie met uw paard',
      intro: 'Den Möllenhof biedt gasten de mogelijkheid hun eigen paard of pony mee te brengen: wij beschikken over 10 tot 14 stallen en meerdere weilanden. De ultieme vakantie voor de paardenliefhebber, samen met het gezin, familie of vrienden. Onze huizen aan de Jonkersweg staan op ditzelfde park, dus u slaapt op loopafstand van uw paard.',
      back: 'Terug naar de huizen',
      facTitle: 'Stalling & verzorging',
      facilities: [
        {title: '10 tot 14 stallen', text: 'Uw paard verblijft in een frisse box voorzien van vlas, met dagelijkse weidegang op een van de weilanden.'},
        {title: 'Verzorging inbegrepen', text: 'Wij verzorgen uw paard tijdens uw verblijf: meerdere malen per dag ruwvoer en twee keer daags krachtvoer, afgestemd op uw wensen.'},
        {title: 'Trailer, koets en tuig', text: 'Stalling voor uw trailer en eventueel uw koets, en ruime afsluitbare zadelkasten voor uw tuigage.'},
        {title: 'Routes op kaart en GPX', text: 'Wij hebben diverse routes klaarliggen, op kaart en als GPX-bestand, voor uren rij- en menplezier.'},
      ],
      ridingTitle: 'Rijden in het Nationaal Landschap',
      ridingText: 'Urenlang rijplezier langs het water en over de vele zandpaden van het Nationaal Landschap Winterswijk, dwars door het coulissenlandschap. In de buurt ligt een crossbos met diverse hindernissen en een waterbak, en over de zandbulten van recreatieterrein het Rommelgebergte kunt u galopperen.',
      eventsTitle: 'Winterswijk is een hippisch dorp',
      eventsText: 'Rijd mee met de jaarlijkse paardenvierdaagse, een geliefd evenement: vier avonden lang al het moois van Winterswijk en zijn buurtschappen ontdekken, te paard of met de koets. Verder zijn er menmarathons, veldritten en wedstrijden onder het zadel, en in november de traditionele slipjacht. Het hele jaar door dus paardensport in de buurt.',
      knhsTitle: 'PaardenWelkom-label van de KNHS',
      knhsText: 'Onder het label PaardenWelkom verzamelt de KNHS de plekken waar paardenliefhebbers met hun paard écht welkom zijn. Den Möllenhof heeft dit gevelbord ontvangen.',
      rulesTitle: 'Goed om te weten',
      rulesText: 'Uw paard dient ingeënt en vrij van ziektes te zijn; neem het paspoort mee. De tarieven voor stalling en de beschikbaarheid van de stallen vraagt u bij ons op, dan reserveren we de stal meteen samen met uw vakantiehuis.',
      ctaTitle: 'Stal reserveren bij uw huis?',
      ctaText: 'Laat ons weten hoeveel paarden u meeneemt en wanneer u komt, dan regelen we de stalling samen met uw vakantiehuis.',
      videoTitle: 'Bekijk de sfeer op het park',
      videoText: 'Een korte film over paardrijden bij Den Möllenhof: de stallen, de weilanden en de zandpaden die bij de deur beginnen.',
      videoPlay: 'Video afspelen',
    },
    todo: {
      kicker: 'Te doen in de buurt',
      title: 'Winterswijk zit vol met dingen om te doen',
      intro: 'Winterswijk is het kloppende hart van het Nationaal Landschap Achterhoek: coulisselandschap, beken, een echte steengroeve en een gezellig dorpscentrum. Hieronder vindt u wat er in dit seizoen te doen is, waar u fietsen huurt en wat er nu in de natuur te zien valt. Vraag ons gerust om tips, we wonen hier zelf.',
      backHome: 'Terug naar de huizen',
      ctaTitle: 'Zelf even overleggen?',
      ctaText: 'Wij weten wat er tijdens uw verblijf speelt, welke route bij uw gezelschap past en waar u het beste een fiets huurt. Stuur een bericht of bel ons gewoon.',
    },
    /* Aemilius op Curaçao — het tweede adres van de eigenaren. Tekst en foto's zijn
       aangeleverd door de klant (05-08-2026); de Nederlandse tekst is de bron, en/de zijn
       vertalingen daarvan. Geen prijzen, in lijn met de rest van de site. */
    curacao: {
      kicker: 'Aemilius, Curaçao',
      title: 'Ons mini resort op Curaçao',
      intro: 'Aemilius is een kleinschalig, volledig privé mini-resort in het rustige, landelijke dorp Barber. Het terrein is volledig ommuurd en biedt gasten een veilige, serene omgeving met alle voorzieningen voor een ontspannen verblijf, met uitzicht op zee.',
      back: 'Terug naar de huizen',
      staysTitle: 'Drie zelfstandige verblijven',
      staysSub: 'Ideaal voor koppels, families of kleine groepen. U kunt de verblijven los boeken of het hele terrein voor uw gezelschap.',
      stays: [
        {
          name: 'Villa Fenya, 3 slaapkamers',
          sub: 'Het grootste verblijf, met directe toegang tot het terras en het zwembad.',
          points: ['Drie slaapkamers: een master, een kamer met tweepersoonsbed en een kamer met twee eenpersoonsbedden', 'Twee ruime badkamers', 'Volledig ingerichte keuken', 'Comfortabele woonkamer', 'Directe toegang tot terras en zwembad'],
        },
        {
          name: 'Appartement Yeva, 1 slaapkamer',
          sub: 'Comfortabel voor koppels, en in te richten voor een gezin.',
          points: ['Eén slaapkamer, met een extra slaapbank', 'Ruim raam met uitzicht over de groene heuvels', 'In te richten voor gezinnen, ook met een baby: campingbedje en kinderstoel', 'Eigen badkamer met inloopdouche en douchezitje', 'Eigen keuken'],
        },
        {
          name: 'Studio voor 2 personen',
          sub: 'Perfect voor korte verblijven.',
          points: ['Perfect voor korte verblijven', 'Eigen kitchenette', 'Badkamer en privé-ingang'],
        },
      ],
      /* Slaapkamerfoto's per verblijf, aangeleverd 07-08-2026. */
      roomsTitle: 'De slaapkamers',
      roomsSub: 'Per verblijf, zodat u vooraf weet hoe er geslapen wordt.',
      roomsFenya: 'Villa Fenya, drie slaapkamers',
      roomsYeva: 'Appartement Yeva, één slaapkamer',
      facTitle: 'Voorzieningen',
      facilities: [
        {title: 'Privé beach-style zwembad', text: 'Met een geleidelijke inloop, ideaal voor kinderen en gasten die minder mobiel zijn.'},
        {title: 'Prieel / palapa', text: 'Perfect voor BBQ’s, borrels en sociale activiteiten.'},
        {title: 'Volledig ommuurd privéterrein', text: 'Maximale rust en veiligheid, het hele terrein is van u en uw gezelschap.'},
        {title: 'Rolstoeltoegankelijk', text: 'Alle verblijven, het zwembad en de paden zijn toegankelijk voor gasten met een rolstoel.'},
      ],
      /* Zorgbed en drempelvrije doorgangen staan op de foto's van de klant; net als bij de
         Kattenberg is toegankelijkheid hier geen voetnoot maar een eigen blok. */
      careTitle: 'Ook met zorgvraag welkom',
      careText: 'Drempelvrije doorgangen, brede paden en een zwembad met geleidelijke inloop. Een verstelbaar hoog-laagbed met papegaai is aanwezig, en een rolstoel staat klaar. Zo\'n hoog-laagbed kunnen we desgewenst in elke slaapkamer op het resort plaatsen. Laat ons weten wat u nodig heeft, dan zorgen we dat het klaarstaat voor uw aankomst.',
      locTitle: 'Ligging',
      locText: 'Aemilius ligt in Barber, een authentiek en groen deel van Curaçao. Hier ervaart u het eiland zoals het echt is: rustig, vriendelijk en omgeven door natuur. Winkels, lokale eetgelegenheden en de bekendste stranden zijn binnen enkele minuten bereikbaar.',
      beachesTitle: 'De mooiste stranden op korte rijafstand',
      beaches: ['Playa Lagun', 'Playa Grandi', 'Cas Abao', 'Playa Porto Mari'],
      whyTitle: 'Waarom kiezen voor Aemilius?',
      why: [
        'Ideaal voor families, koppels en kleine groepen',
        'Volledige privacy en rust',
        'Centrale ligging ten opzichte van de mooiste stranden',
        'Comfortabele verblijven met moderne voorzieningen',
        'Rolstoelvriendelijk en geschikt voor alle leeftijden',
      ],
      galleryTitle: 'Het terrein in beeld',
      gallerySub: 'Foto’s van het resort, de verblijven en het zwembad, aangeleverd door de eigenaren.',
      ctaTitle: 'Interesse in Curaçao?',
      ctaText: 'Laat ons weten wanneer u wilt komen en met hoeveel personen, dan vertellen we u alles over de verblijven en de beschikbaarheid. Dezelfde persoonlijke aanpak als in Winterswijk.',
    },
    footer: {tagline: 'Vakantiehuizen in Winterswijk & de Achterhoek', rights: 'Alle rechten voorbehouden.', placeholder: 'Concept. Alle huizen en foto’s zijn van de eigenaar; de exacte indeling per woning en de live beschikbaarheidskalender worden nog aangevuld.'},
  },
  en: {
    nav: {homes: 'Homes', horses: 'Horses', curacao: 'Curaçao', area: 'The area', availability: 'Availability', about: 'About', contact: 'Contact'},
    meta: {
      title: 'Holiday homes in Winterswijk with a private sauna | Winterswijk Vakantiehuis',
      description: 'Characterful holiday homes in Winterswijk and the Achterhoek. Every home has its own sauna, dogs are welcome in five of the nine homes and your horse can come along. Book directly with the owner.',
      todoTitle: 'Things to do in Winterswijk and the Achterhoek | Winterswijk Vakantiehuis',
      todoDescription: 'Cycling, walking, wildlife and events around Winterswijk. Where to rent bikes, what can be spotted in nature right now and what is on during your stay.',
      horsesTitle: 'Holidays with your own horse in Winterswijk | Winterswijk Vakantiehuis',
      horsesDescription: 'Bring your own horse on holiday: 10 to 14 stalls, daily turnout, care included and sand tracks starting at the door of the Den Möllenhof holiday park.',
      curacaoTitle: 'Aemilius Curaçao: villa, apartment and studio | Winterswijk Vakantiehuis',
      curacaoDescription: 'Our private mini resort in Barber on Curaçao: villa Fenya, apartment Yeva and a studio around a private pool. Fully walled and wheelchair accessible.',
    },
    notFound: {
      title: 'This page does not exist',
      text: 'The link is out of date or was copied incorrectly. All of our holiday homes are one click away below.',
      cta: 'To the holiday homes',
    },
    hero: {
      kicker: 'Vacation homes in the Achterhoek',
      title: 'Get away from it all, find peace in nature',
      sub: 'Characterful holiday homes in and around Winterswijk. Direct contact with your host.',
      ctaHomes: 'View the homes',
      ctaAvail: 'Check availability',
    },
    tips: {
      kicker: 'Personal tips',
      title: 'We know exactly what is on',
      text: 'We live here ourselves and keep track of the Winterswijk agenda. Before and during your stay we tip you personally: which route is at its best this season, what can be spotted in nature right now, and which events are on during the days you are here.',
      cta: 'See what is on right now',
    },
    homes: {
      title: 'Our vacation homes',
      sub: 'Every home has its own private sauna and your dog is welcome in five of the nine. The difference is the setting: our three homes on the Jonkersweg sit on a small-scale holiday park, close to the Hilgelo lake, while our homes on the Kattenberg sit right in the middle of the woods.',
      guests: 'guests', bedrooms: 'bedrooms', book: 'View & book', view: 'View home',
      capacityAsk: 'Layout on request',
      badgeLake: 'By the lake', badgeForest: 'In the woods', badgeAccessible: 'Wheelchair accessible',
      groupLake: 'By the Hilgelo lake: Jonkersweg, Den Möllenhof',
      groupLakeText: 'Three homes side by side on the Den Möllenhof holiday park in Winterswijk Meddo, a few minutes from the Hilgelo lake with its little beach and walking paths. All three sleep six and have their own sauna.',
      groupForest: 'In the woods on the Kattenberg, close to the Korenburgerveen and Meddoseveen nature reserves',
      groupForestText: 'Our homes on the Kattenberg sit right in the forest: the greenery starts behind the garden and the walking, cycling and bridle paths start at the door. Here too, every home has its own sauna.',
      curacaoKicker: 'Also on Curaçao',
      curacaoTitle: 'Aemilius, our mini resort on Curaçao',
      curacaoText: 'Our second address: a fully walled, entirely private mini resort in the quiet village of Barber, with villa Fenya, apartment Yeva and a studio around a pool of their own. Wheelchair accessible, and the finest beaches on the island are a short drive away.',
      curacaoCta: 'See Curaçao',
      manage: 'Would you like us to manage your home? Get in touch with us.',
    },
    access: {
      kicker: 'Unique in Winterswijk',
      title: 'The only wheelchair accessible holiday home in Winterswijk',
      text: 'Our linked 8-person home on the Kattenberg is fully wheelchair accessible. At a viewing it turned out to be the only holiday home in Winterswijk where that is the case. Do come with a wheelchair: get in touch and we will go through exactly what you need, so everything is ready when you arrive.',
      points: [
        'Bedroom and bathroom on the ground floor',
        'Step-free walk-in shower with a fold-down shower chair',
        'Toilet with grab rails and a basin you can use seated',
        'Wide doorways and step-free access to garden and terrace',
      ],
      cta: 'View this home',
      contact: 'Discuss what you need',
      photoCaption: 'The adapted bathroom on the ground floor',
    },
    detail: {
      back: 'All homes', overview: 'At a glance', amenities: 'Amenities',
      availTitle: 'Availability & booking',
      availText: 'Below is this home’s live calendar, straight out of our booking system. Found a week that is free? Send us a message on WhatsApp and we will get the house ready for you.',
      note: 'Book straight with us, with no middlemen and no booking fees.',
      bookWa: 'Book via WhatsApp', calendar: 'Open the calendar',
      nearby: 'Nearby', nearbyText: 'Cycle routes, nature and the cosy centre of Winterswijk are all a short hop away. We are happy to tip you off about what is on during your stay.',
    },
    avail: {
      title: 'Availability & booking',
      text: 'Here you can see at a glance when our homes are free. The calendar is live: it comes straight out of our booking system and runs a year ahead. You book directly with us, with no middlemen.',
      note: 'The full calendar for each home is on that home’s own page.',
      button: 'Open the calendar',
    },
    hk: {
      free: 'Available', booked: 'Booked', past: 'Past',
      live: 'Live availability',
      loading: 'Loading calendar…',
      swipe: 'Drag the calendar sideways for the rest of the month',
      expand: 'Show the whole year',
      collapse: 'Show less',
      prev: 'Earlier', next: 'Later',
      fromToday: 'From this month',
      openTab: 'Open the calendar on huurkalender.nl',
      soonTitle: 'Calendar being connected',
      soonText: 'This home is still being linked up to our calendar. Just ask us for its availability and you will usually hear back the same day.',
    },
    area: {
      title: 'Things to do nearby',
      sub: 'Winterswijk is the beating heart of the Achterhoek National Landscape. Here is what waits just outside your door.',
      items: [
        {icon: 'bike', title: 'Cycling & walking', text: 'Thousands of kilometres of signposted routes through hedgerow landscape, along streams and old farms. Route maps are ready in the house.'},
        {icon: 'trees', title: 'Wildlife spotting', text: 'Deer, badgers, kingfishers and little owls. Each season we share what can be spotted right now and where.'},
        {icon: 'calendar', title: 'Events', text: 'Regional markets, music, the Zwarte Cross festival and Winterswijk’s summer programme. We tip you off about what is on during your stay.'},
        {icon: 'camera', title: 'Village & culture', text: 'The cosy centre of Winterswijk with terraces, the quarry open-air theatre and museums a short hop away.'},
      ],
      bikeTitle: 'Bike rental',
      bikeText: 'No bikes of your own? In Winterswijk you can easily rent a city bike, e-bike, tandem or fatbike. Several rental shops bring the bikes to the house and collect them there again. We arrange the reservation or explain exactly where and how, so you can head out first thing.',
      bikeButton: 'Ask about bike rental',
      allButton: 'Everything to do nearby',
      eventsTitle: 'What is on right now',
      eventsSub: 'A selection from the Winterswijk agenda. Ask us for the current agenda for your arrival date: we know what is on that week and what is worth your time.',
      eventsNote: 'Dates subject to change. Ask us for the current agenda for your arrival date.',
      parkTitle: 'The park from above',
      photoBy: 'Photo:',
      parkText: 'Den Möllenhof holiday park in Winterswijk Meddo, with woodland edges and open water within walking distance.',
      natureTitle: 'Nature on your doorstep',
      natureSub: 'What you come across here if you stand still for a moment. Ask us what can be spotted at the moment and we will point you straight to the right spot.',
      nowBadge: 'Visible now',
      nearbyTitle: 'Right on the doorstep',
      nearbySub: 'What is within easy reach of the homes. Distances are measured from the Kattenberg; from the Jonkersweg the Hilgelo lake is right around the corner.',
    },
    flamingo: {
      badge: 'Visible now, but not for long',
      title: 'The flamingos are still here',
      text: 'Genuinely: some 15 km away, at the Zwillbrocker Venn, breeds the northernmost flamingo colony in the world. The breeding season runs from April to July, so this is the last chance this year to see them with their young. Ask us for the best viewing spot and time of day.',
      cta: 'Ask about the viewing spot',
    },
    about: {
      title: 'About us',
      text: 'Winterswijk Vakantiehuis specialises in characterful holiday homes set in the nature around Winterswijk. We don’t rent out anonymous accommodation: as managers we know the region and every cycle route, and we know exactly what is on around here during your stay. We believe in a personal approach and in making your stay unforgettable.',
      point1: 'Personally managed, not a large rental agency',
      point2: 'Only our own or entrusted homes',
      point3: 'Personal tips on routes, wildlife and events',
      point4: 'Your dog is welcome in five of our nine homes',
      stats: [
        {value: '25', label: 'years of experience'},
        {value: '5 of 9', label: 'dog friendly'},
        {value: '9', label: 'holiday homes'},
      ],
    },
    contact: {
      title: 'Get in touch',
      sub: 'Questions or ready to book? Send a message, we reply quickly.',
      name: 'Name', email: 'Email', dates: 'Preferred dates', guests: 'Number of guests',
      pets: 'Bringing pets?', kids: 'Bringing children?', wheelchair: 'Wheelchair or aids needed?',
      message: 'Your message', send: 'Send message', or: 'or call',
      wa: 'WhatsApp', call: 'Call us', callShort: 'Call',
      sending: 'Sending…',
      sentTitle: 'Thank you, your message has been sent',
      sentText: 'You will receive a confirmation by email. We will get back to you as soon as we can.',
      errorTitle: 'Sending failed.',
      errorText: 'Please try again, or reach us on WhatsApp or by phone.',
      errName: 'Enter your name.',
      errEmail: 'Enter a valid email address.',
      errMessage: 'Tell us briefly about your stay.',
      privacy: 'We only use your details to answer your request.',
      placeholder: {
        name: 'Your name', email: 'you@example.com', dates: 'e.g. 12 to 19 July', guests: 'e.g. 4',
        pets: 'e.g. 1 dog (labrador)', kids: 'e.g. 2 children aged 4 and 7',
        wheelchair: 'e.g. yes, 1 wheelchair',
        message: 'Tell us about your stay...',
      },
    },
    horses: {
      kicker: 'A holiday with your horse',
      title: 'Your horse simply comes along',
      teaser: 'Bring your own horse or pony. The Den Möllenhof holiday park, where our Jonkersweg homes stand, has stables and pastures, we care for your horse, and the sand tracks start at the door.',
      cta: 'All about holidaying with your horse',
      intro: 'Den Möllenhof lets guests bring their own horse or pony: we have 10 to 14 stalls and several pastures. The ultimate holiday for horse lovers, together with the family or friends. Our Jonkersweg homes are on this same park, so you sleep within walking distance of your horse.',
      back: 'Back to the homes',
      facTitle: 'Stabling & care',
      facilities: [
        {title: '10 to 14 stalls', text: 'Your horse stays in a fresh box bedded with flax, with daily turnout on one of the pastures.'},
        {title: 'Care included', text: 'We look after your horse during your stay: roughage several times a day and concentrate twice daily, tailored to your wishes.'},
        {title: 'Trailer, carriage and tack', text: 'Storage for your trailer and, if you bring one, your carriage, plus spacious lockable tack lockers.'},
        {title: 'Routes on map and GPX', text: 'We have a range of routes ready, on paper and as GPX files, for hours of riding and driving.'},
      ],
      ridingTitle: 'Riding in the National Landscape',
      ridingText: 'Hours of riding along the water and over the many sand tracks of the Winterswijk National Landscape, straight through the hedgerow countryside. Nearby there is a cross-country forest with obstacles and a water jump, and you can gallop over the sand hills of the Rommelgebergte recreation area.',
      eventsTitle: 'Winterswijk is a horse village',
      eventsText: 'Ride along in the annual four-day horse event, a much-loved fixture: four evenings discovering Winterswijk and its hamlets on horseback or by carriage. There are also driving marathons, cross-country events and ridden competitions, and in November the traditional drag hunt. Equestrian sport all year round.',
      knhsTitle: 'KNHS PaardenWelkom label',
      knhsText: 'Under the PaardenWelkom label the Dutch equestrian federation KNHS collects the places where horse lovers and their horses are genuinely welcome. Den Möllenhof has been awarded this plaque.',
      rulesTitle: 'Good to know',
      rulesText: 'Your horse must be vaccinated and free of disease; please bring its passport. Ask us for stabling rates and stall availability, and we will reserve the stall together with your holiday home.',
      ctaTitle: 'Reserve a stall with your home?',
      ctaText: 'Tell us how many horses you are bringing and when you are coming, and we will arrange the stabling along with your holiday home.',
      videoTitle: 'See what the park is like',
      videoText: 'A short film about horse riding at Den Möllenhof: the stables, the paddocks and the sandy tracks that start right at the door.',
      videoPlay: 'Play video',
    },
    todo: {
      kicker: 'Things to do nearby',
      title: 'Winterswijk is packed with things to do',
      intro: 'Winterswijk is the beating heart of the Achterhoek National Landscape: hedgerow countryside, streams, a real quarry and a cosy village centre. Below you will find what is on this season, where to rent bikes and what can be spotted in nature right now. Do ask us for tips, we live here ourselves.',
      backHome: 'Back to the homes',
      ctaTitle: 'Rather talk it through?',
      ctaText: 'We know what is on during your stay, which route suits your group and where best to rent a bike. Send a message or simply give us a call.',
    },
    curacao: {
      kicker: 'Aemilius, Curaçao',
      title: 'Our mini resort on Curaçao',
      intro: 'Aemilius is a small-scale, entirely private mini resort in the quiet, rural village of Barber. The grounds are fully walled and give guests a safe, serene setting with everything you need for a relaxed stay, looking out over the sea.',
      back: 'Back to the homes',
      staysTitle: 'Three self-contained stays',
      staysSub: 'Ideal for couples, families or small groups. Book a single stay, or the whole place for your party.',
      stays: [
        {
          name: 'Villa Fenya, 3 bedrooms',
          sub: 'The largest of the three, opening straight onto the terrace and the pool.',
          points: ['Three bedrooms: a master, one with a double bed and one with two single beds', 'Two spacious bathrooms', 'Fully equipped kitchen', 'Comfortable living room', 'Direct access to the terrace and pool'],
        },
        {
          name: 'Apartment Yeva, 1 bedroom',
          sub: 'Comfortable for couples, and can be set up for a family.',
          points: ['One bedroom, with an extra sofa bed', 'Wide window looking out over the green hills', 'Can be set up for families, babies included: travel cot and high chair', 'Own bathroom with a walk-in shower and shower seat', 'Its own kitchen'],
        },
        {
          name: 'Studio for 2 people',
          sub: 'Perfect for shorter stays.',
          points: ['Perfect for shorter stays', 'Its own kitchenette', 'Bathroom and private entrance'],
        },
      ],
      roomsTitle: 'The bedrooms',
      roomsSub: 'Per stay, so you know how everyone sleeps before you book.',
      roomsFenya: 'Villa Fenya, three bedrooms',
      roomsYeva: 'Apartment Yeva, one bedroom',
      facTitle: 'Amenities',
      facilities: [
        {title: 'Private beach-style pool', text: 'With a gradual walk-in entry, ideal for children and for guests who are less mobile.'},
        {title: 'Palapa', text: 'Perfect for barbecues, drinks and getting everyone together.'},
        {title: 'Fully walled private grounds', text: 'Maximum peace and safety: the whole site is yours and your party’s.'},
        {title: 'Wheelchair accessible', text: 'Every stay, the pool and the paths are accessible to guests using a wheelchair.'},
      ],
      careTitle: 'Welcome with care needs too',
      careText: 'Step-free thresholds, wide paths and a pool with a gradual walk-in entry. An adjustable high-low care bed with a lifting pole is on site, and a wheelchair is ready for use. On request we can place a high-low bed in any bedroom on the resort. Let us know what you need and we will have it waiting when you arrive.',
      locTitle: 'The setting',
      locText: 'Aemilius sits in Barber, an authentic and green part of Curaçao. Here you experience the island as it really is: quiet, friendly and surrounded by nature. Shops, local places to eat and the best-known beaches are all minutes away.',
      beachesTitle: 'The finest beaches, a short drive away',
      beaches: ['Playa Lagun', 'Playa Grandi', 'Cas Abao', 'Playa Porto Mari'],
      whyTitle: 'Why choose Aemilius?',
      why: [
        'Ideal for families, couples and small groups',
        'Complete privacy and quiet',
        'Central to the most beautiful beaches',
        'Comfortable stays with modern amenities',
        'Wheelchair friendly and suitable for all ages',
      ],
      galleryTitle: 'The resort in pictures',
      gallerySub: 'Photos of the grounds, the stays and the pool, supplied by the owners.',
      ctaTitle: 'Interested in Curaçao?',
      ctaText: 'Tell us when you would like to come and with how many, and we will talk you through the stays and what is available. The same personal approach as in Winterswijk.',
    },
    footer: {tagline: 'Vacation homes in Winterswijk & the Achterhoek', rights: 'All rights reserved.', placeholder: 'Concept. Every home and photo comes from the owner; the exact layout per home and the live availability calendar are still being added.'},
  },
  de: {
    nav: {homes: 'Häuser', horses: 'Pferde', curacao: 'Curaçao', area: 'Umgebung', availability: 'Verfügbarkeit', about: 'Über uns', contact: 'Kontakt'},
    meta: {
      title: 'Ferienhäuser in Winterswijk mit eigener Sauna | Winterswijk Vakantiehuis',
      description: 'Charaktervolle Ferienhäuser in Winterswijk und im Achterhoek. Jedes Haus hat eine eigene Sauna, in fünf von neun Häusern ist Ihr Hund willkommen und Ihr Pferd darf mit. Direkt beim Gastgeber buchen.',
      todoTitle: 'Ausflüge und Aktivitäten rund um Winterswijk | Winterswijk Vakantiehuis',
      todoDescription: 'Radfahren, Wandern, Natur und Veranstaltungen rund um Winterswijk. Wo Sie Räder mieten, was gerade in der Natur zu sehen ist und was während Ihres Aufenthalts läuft.',
      horsesTitle: 'Urlaub mit eigenem Pferd in Winterswijk | Winterswijk Vakantiehuis',
      horsesDescription: 'Bringen Sie Ihr eigenes Pferd mit in den Urlaub: 10 bis 14 Boxen, täglicher Weidegang, Versorgung inklusive und Sandwege direkt vor der Tür im Ferienpark Den Möllenhof.',
      curacaoTitle: 'Aemilius Curaçao: Villa, Apartment und Studio | Winterswijk Vakantiehuis',
      curacaoDescription: 'Unser privates Mini-Resort in Barber auf Curaçao: Villa Fenya, Apartment Yeva und ein Studio rund um einen eigenen Pool. Komplett ummauert und rollstuhlgerecht.',
    },
    notFound: {
      title: 'Diese Seite gibt es nicht',
      text: 'Der Link ist veraltet oder wurde falsch übernommen. Unten finden Sie alle Ferienhäuser wieder.',
      cta: 'Zu den Ferienhäusern',
    },
    hero: {
      kicker: 'Ferienhäuser im Achterhoek',
      title: 'Einfach mal raus, zur Ruhe kommen in der Natur',
      sub: 'Charaktervolle Ferienhäuser in und um Winterswijk. Direkter Kontakt zum Gastgeber.',
      ctaHomes: 'Häuser ansehen',
      ctaAvail: 'Verfügbarkeit prüfen',
    },
    tips: {
      kicker: 'Persönliche Tipps',
      title: 'Wir wissen genau, was gerade los ist',
      text: 'Wir wohnen selbst hier und verfolgen den Veranstaltungskalender von Winterswijk. Vor und während Ihres Aufenthalts geben wir Ihnen persönliche Tipps: welche Route in dieser Jahreszeit am schönsten ist, was gerade in der Natur zu sehen ist und welche Veranstaltungen genau an Ihren Tagen stattfinden.',
      cta: 'Sehen, was gerade läuft',
    },
    homes: {
      title: 'Unsere Ferienhäuser',
      sub: 'Jedes Haus hat eine eigene Sauna und in fünf der neun Häuser ist Ihr Hund willkommen. Der Unterschied liegt in der Lage: unsere drei Häuser an der Jonkersweg liegen in einem kleinen, überschaubaren Ferienpark, ganz nah am See Hilgelo, unsere Häuser auf dem Kattenberg dagegen mitten im Wald.',
      guests: 'Gäste', bedrooms: 'Schlafzimmer', book: 'Ansehen & buchen', view: 'Haus ansehen',
      capacityAsk: 'Aufteilung auf Anfrage',
      badgeLake: 'Am See', badgeForest: 'Im Wald', badgeAccessible: 'Rollstuhlgerecht',
      groupLake: 'Am See Hilgelo: Jonkersweg, Den Möllenhof',
      groupLakeText: 'Drei Häuser nebeneinander im Ferienpark Den Möllenhof in Winterswijk Meddo, wenige Minuten vom Badesee Hilgelo mit Strand und Wanderwegen. Alle drei bieten Platz für sechs Personen und haben eine eigene Sauna.',
      groupForest: 'Im Wald auf dem Kattenberg, nahe den Naturschutzgebieten Korenburgerveen und Meddoseveen',
      groupForestText: 'Unsere Häuser auf dem Kattenberg liegen mitten im Wald: das Grün beginnt hinter dem Garten, Wander-, Rad- und Reitwege direkt an der Tür. Auch hier hat jedes Haus eine eigene Sauna.',
      curacaoKicker: 'Auch auf Curaçao',
      curacaoTitle: 'Aemilius, unser Mini-Resort auf Curaçao',
      curacaoText: 'Unsere zweite Adresse: ein vollständig ummauertes, ganz privates Mini-Resort im ruhigen Dorf Barber, mit Villa Fenya, Apartment Yeva und einem Studio rund um einen eigenen Pool. Rollstuhlgerecht, und die schönsten Strände der Insel liegen nur eine kurze Fahrt entfernt.',
      curacaoCta: 'Curaçao ansehen',
      manage: 'Möchten Sie Ihr Haus verwalten lassen? Nehmen Sie Kontakt mit uns auf.',
    },
    access: {
      kicker: 'Einzigartig in Winterswijk',
      title: 'Das einzige rollstuhlgerechte Ferienhaus in Winterswijk',
      text: 'Unser geschakeltes 8-Personen-Haus auf dem Kattenberg ist vollständig rollstuhlgerecht. Bei einer Besichtigung stellte sich heraus, dass es das einzige Ferienhaus in Winterswijk ist, bei dem das so ist. Kommen Sie ruhig mit einem Rollstuhl: melden Sie sich kurz, dann gehen wir gemeinsam durch, was Sie brauchen, damit bei Ihrer Ankunft alles bereitsteht.',
      points: [
        'Schlafzimmer und Badezimmer im Erdgeschoss',
        'Schwellenlose Dusche mit klappbarem Duschstuhl',
        'WC mit Haltegriffen und unterfahrbares Waschbecken',
        'Breite Durchgänge und schwellenlos in Garten und Terrasse',
      ],
      cta: 'Dieses Haus ansehen',
      contact: 'Ihre Wünsche besprechen',
      photoCaption: 'Das angepasste Badezimmer im Erdgeschoss',
    },
    detail: {
      back: 'Alle Häuser', overview: 'Auf einen Blick', amenities: 'Ausstattung',
      availTitle: 'Verfügbarkeit & Buchung',
      availText: 'Unten sehen Sie den Live-Kalender dieses Hauses, direkt aus unserem Buchungssystem. Ein Zeitraum ist frei? Schreiben Sie uns kurz über WhatsApp, dann machen wir das Haus für Sie bereit.',
      note: 'Sie buchen direkt bei uns, ohne Vermittler und ohne Buchungsgebühren.',
      bookWa: 'Über WhatsApp buchen', calendar: 'Zum Kalender',
      nearby: 'In der Umgebung', nearbyText: 'Radrouten, Natur und das gemütliche Zentrum von Winterswijk sind nur einen Katzensprung entfernt. Wir geben Ihnen gern Tipps, was während Ihres Aufenthalts los ist.',
    },
    avail: {
      title: 'Verfügbarkeit & Buchung',
      text: 'Hier sehen Sie auf einen Blick, wann unsere Häuser frei sind. Der Kalender ist live: er kommt direkt aus unserem Buchungssystem und reicht ein Jahr voraus. Gebucht wird direkt bei uns, ohne Vermittler.',
      note: 'Den vollständigen Kalender pro Haus finden Sie auf der Seite des Hauses.',
      button: 'Zum Kalender',
    },
    hk: {
      free: 'Frei', booked: 'Belegt', past: 'Vergangen',
      live: 'Live-Verfügbarkeit',
      loading: 'Kalender wird geladen…',
      swipe: 'Ziehen Sie den Kalender zur Seite für den Rest des Monats',
      expand: 'Ganzes Jahr anzeigen',
      collapse: 'Weniger anzeigen',
      prev: 'Früher', next: 'Später',
      fromToday: 'Ab diesem Monat',
      openTab: 'Kalender auf huurkalender.nl öffnen',
      soonTitle: 'Kalender wird angebunden',
      soonText: 'Dieses Haus wird gerade mit unserem Kalender verbunden. Fragen Sie die Verfügbarkeit einfach kurz bei uns an, meist antworten wir noch am selben Tag.',
    },
    area: {
      title: 'In der Umgebung',
      sub: 'Winterswijk ist das Herz der Nationallandschaft Achterhoek. Das alles wartet direkt vor Ihrer Tür.',
      items: [
        {icon: 'bike', title: 'Radfahren & Wandern', text: 'Tausende Kilometer beschilderte Knotenpunktrouten durch Heckenlandschaft, entlang Bächen und alten Höfen. Karten liegen im Haus bereit.'},
        {icon: 'trees', title: 'Tiere beobachten', text: 'Rehe, Dachse, Eisvögel und Steinkäuze. Jede Saison verraten wir, was gerade zu sehen ist und wo.'},
        {icon: 'calendar', title: 'Veranstaltungen', text: 'Regionalmärkte, Musik, das Festival Zwarte Cross und das Sommerprogramm von Winterswijk. Wir sagen Ihnen, was während Ihres Aufenthalts los ist.'},
        {icon: 'camera', title: 'Ort & Kultur', text: 'Das gemütliche Zentrum von Winterswijk mit Terrassen, dem Steinbruch-Freilichttheater und Museen in der Nähe.'},
      ],
      bikeTitle: 'Fahrradverleih',
      bikeText: 'Keine eigenen Räder dabei? In Winterswijk mieten Sie problemlos ein Stadtrad, E-Bike, Tandem oder Fatbike. Mehrere Verleiher bringen die Räder zum Haus und holen sie dort auch wieder ab. Wir übernehmen die Reservierung oder erklären genau wo und wie, damit Sie gleich am Morgen los können.',
      bikeButton: 'Nach Fahrradverleih fragen',
      allButton: 'Alles in der Umgebung',
      eventsTitle: 'Was gerade läuft',
      eventsSub: 'Eine Auswahl aus dem Winterswijker Veranstaltungskalender. Fragen Sie uns nach dem aktuellen Programm für Ihren Anreisetag: wir wissen, was in dieser Woche läuft und was sich lohnt.',
      eventsNote: 'Termine unter Vorbehalt. Fragen Sie uns nach dem aktuellen Kalender für Ihren Anreisetag.',
      parkTitle: 'Der Park von oben',
      photoBy: 'Foto:',
      parkText: 'Ferienpark Den Möllenhof in Winterswijk Meddo, mit Waldrändern und Wasser in Gehweite.',
      natureTitle: 'Natur vor der Tür',
      natureSub: 'Was Ihnen hier begegnet, wenn Sie kurz stehen bleiben. Fragen Sie uns, was gerade zu sehen ist, dann zeigen wir Ihnen sofort die richtige Stelle.',
      nowBadge: 'Jetzt zu sehen',
      nearbyTitle: 'Direkt vor der Tür',
      nearbySub: 'Was von den Häusern aus in Reichweite liegt. Die Entfernungen sind vom Kattenberg aus gemessen; von der Jonkersweg liegt der Badesee Hilgelo gleich um die Ecke.',
    },
    flamingo: {
      badge: 'Jetzt zu sehen, nur noch kurz',
      title: 'Die Flamingos sind noch da',
      text: 'Tatsächlich: rund 15 km entfernt, im Zwillbrocker Venn, brütet die nördlichste Flamingokolonie der Welt. Die Brutzeit läuft von April bis Juli, dies ist also die letzte Chance in diesem Jahr, sie mit ihren Jungen zu sehen. Fragen Sie uns nach dem besten Beobachtungsplatz und der besten Tageszeit.',
      cta: 'Nach dem Beobachtungsplatz fragen',
    },
    about: {
      title: 'Über uns',
      text: 'Winterswijk Vakantiehuis ist spezialisiert auf stimmungsvolle Ferienhäuser in der Natur rund um Winterswijk. Wir vermieten keine anonymen Unterkünfte: als Verwalter kennen wir die Region und jede Radroute und wissen genau, was während Ihres Aufenthalts in der Umgebung los ist. Wir glauben an einen persönlichen Ansatz und daran, Ihren Aufenthalt unvergesslich zu machen.',
      point1: 'Persönlich betreut, keine große Vermietungsagentur',
      point2: 'Nur eigene oder anvertraute Häuser',
      point3: 'Persönliche Tipps zu Routen, Natur und Veranstaltungen',
      point4: 'Ihr Hund ist in fünf unserer neun Häuser willkommen',
      stats: [
        {value: '25', label: 'Jahre Erfahrung'},
        {value: '5 von 9', label: 'hundefreundlich'},
        {value: '9', label: 'Ferienhäuser'},
      ],
    },
    contact: {
      title: 'Kontakt aufnehmen',
      sub: 'Fragen oder direkt buchen? Schreiben Sie uns, wir antworten schnell.',
      name: 'Name', email: 'E-Mail', dates: 'Wunschzeitraum', guests: 'Anzahl Personen',
      pets: 'Haustiere dabei?', kids: 'Kinder dabei?', wheelchair: 'Rollstuhl oder Hilfsmittel nötig?',
      message: 'Ihre Nachricht', send: 'Nachricht senden', or: 'oder anrufen',
      wa: 'WhatsApp', call: 'Rufen Sie uns an', callShort: 'Anrufen',
      sending: 'Wird gesendet…',
      sentTitle: 'Vielen Dank, Ihre Nachricht ist unterwegs',
      sentText: 'Sie erhalten eine Bestätigung per E-Mail. Wir melden uns so schnell wie möglich bei Ihnen.',
      errorTitle: 'Senden fehlgeschlagen.',
      errorText: 'Bitte versuchen Sie es erneut oder erreichen Sie uns über WhatsApp oder telefonisch.',
      errName: 'Bitte geben Sie Ihren Namen ein.',
      errEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
      errMessage: 'Erzählen Sie uns kurz von Ihrem Aufenthalt.',
      privacy: 'Wir verwenden Ihre Daten ausschließlich zur Beantwortung Ihrer Anfrage.',
      placeholder: {
        name: 'Ihr Name', email: 'sie@beispiel.de', dates: 'z. B. 12. bis 19. Juli', guests: 'z. B. 4',
        pets: 'z. B. 1 Hund (Labrador)', kids: 'z. B. 2 Kinder, 4 und 7 Jahre',
        wheelchair: 'z. B. ja, 1 Rollstuhl',
        message: 'Erzählen Sie uns von Ihrem Aufenthalt...',
      },
    },
    horses: {
      kicker: 'Urlaub mit Ihrem Pferd',
      title: 'Ihr Pferd kommt einfach mit in den Urlaub',
      teaser: 'Bringen Sie Ihr eigenes Pferd oder Pony mit. Im Ferienpark Den Möllenhof, wo auch unsere Häuser an der Jonkersweg stehen, gibt es Boxen und Weiden, wir versorgen Ihr Pferd, und die Sandwege beginnen direkt vor der Tür.',
      cta: 'Alles über Urlaub mit Ihrem Pferd',
      intro: 'Den Möllenhof bietet seinen Gästen die Möglichkeit, das eigene Pferd oder Pony mitzubringen: wir verfügen über 10 bis 14 Boxen und mehrere Weiden. Der ultimative Urlaub für Pferdeliebhaber, gemeinsam mit Familie oder Freunden. Unsere Häuser an der Jonkersweg liegen auf demselben Park, Sie schlafen also in Gehweite Ihres Pferdes.',
      back: 'Zurück zu den Häusern',
      facTitle: 'Unterbringung & Versorgung',
      facilities: [
        {title: '10 bis 14 Boxen', text: 'Ihr Pferd steht in einer frischen Box mit Leinstroh und hat täglich Weidegang auf einer der Weiden.'},
        {title: 'Versorgung inklusive', text: 'Wir versorgen Ihr Pferd während Ihres Aufenthalts: mehrmals täglich Raufutter und zweimal täglich Kraftfutter, abgestimmt auf Ihre Wünsche.'},
        {title: 'Anhänger, Kutsche und Zaumzeug', text: 'Stellplatz für Ihren Anhänger und gegebenenfalls Ihre Kutsche, dazu geräumige abschließbare Sattelschränke.'},
        {title: 'Routen auf Karte und als GPX', text: 'Wir haben verschiedene Routen bereitliegen, auf Karte und als GPX-Datei, für stundenlanges Reit- und Fahrvergnügen.'},
      ],
      ridingTitle: 'Reiten in der Nationallandschaft',
      ridingText: 'Stundenlanges Reitvergnügen am Wasser entlang und über die vielen Sandwege der Nationallandschaft Winterswijk, mitten durch die Heckenlandschaft. In der Nähe liegt ein Crosswald mit verschiedenen Hindernissen und einem Wassergraben, und über die Sandhügel des Erholungsgebiets Rommelgebergte können Sie galoppieren.',
      eventsTitle: 'Winterswijk ist ein Pferdedorf',
      eventsText: 'Reiten Sie mit bei der jährlichen Pferde-Viertagetour, einem beliebten Ereignis: vier Abende lang Winterswijk und seine Bauerschaften entdecken, zu Pferd oder mit der Kutsche. Dazu Fahrmarathons, Geländeritte und Turniere unter dem Sattel, und im November die traditionelle Schleppjagd. Also das ganze Jahr über Pferdesport in der Nähe.',
      knhsTitle: 'PaardenWelkom-Label der KNHS',
      knhsText: 'Unter dem Label PaardenWelkom sammelt der niederländische Reitsportverband KNHS die Orte, an denen Pferdeliebhaber mit ihrem Pferd wirklich willkommen sind. Den Möllenhof hat dieses Schild erhalten.',
      rulesTitle: 'Gut zu wissen',
      rulesText: 'Ihr Pferd muss geimpft und frei von Krankheiten sein; bitte bringen Sie den Pass mit. Die Preise für die Unterbringung und die Verfügbarkeit der Boxen erfragen Sie bei uns, dann reservieren wir die Box gleich zusammen mit Ihrem Ferienhaus.',
      ctaTitle: 'Box zusammen mit dem Haus reservieren?',
      ctaText: 'Sagen Sie uns, wie viele Pferde Sie mitbringen und wann Sie kommen, dann regeln wir die Unterbringung zusammen mit Ihrem Ferienhaus.',
      videoTitle: 'Sehen Sie, wie es auf dem Park ist',
      videoText: 'Ein kurzer Film über das Reiten bei Den Möllenhof: die Ställe, die Weiden und die Sandwege, die direkt vor der Tür beginnen.',
      videoPlay: 'Video abspielen',
    },
    todo: {
      kicker: 'In der Umgebung',
      title: 'Winterswijk hat unendlich viel zu bieten',
      intro: 'Winterswijk ist das Herz der Nationallandschaft Achterhoek: Heckenlandschaft, Bäche, ein echter Steinbruch und ein gemütlicher Ortskern. Unten finden Sie, was in dieser Saison läuft, wo Sie Fahrräder mieten und was gerade in der Natur zu sehen ist. Fragen Sie uns gern nach Tipps, wir wohnen selbst hier.',
      backHome: 'Zurück zu den Häusern',
      ctaTitle: 'Lieber persönlich besprechen?',
      ctaText: 'Wir wissen, was während Ihres Aufenthalts los ist, welche Route zu Ihrer Gruppe passt und wo Sie am besten ein Fahrrad mieten. Schreiben Sie uns oder rufen Sie einfach an.',
    },
    curacao: {
      kicker: 'Aemilius, Curaçao',
      title: 'Unser Mini-Resort auf Curaçao',
      intro: 'Aemilius ist ein kleines, ganz privates Mini-Resort im ruhigen, ländlichen Dorf Barber. Das Gelände ist vollständig ummauert und bietet Gästen eine sichere, ruhige Umgebung mit allem für einen entspannten Aufenthalt, mit Blick aufs Meer.',
      back: 'Zurück zu den Häusern',
      staysTitle: 'Drei eigenständige Unterkünfte',
      staysSub: 'Ideal für Paare, Familien oder kleine Gruppen. Buchen Sie eine einzelne Unterkunft oder das ganze Gelände für Ihre Gruppe.',
      stays: [
        {
          name: 'Villa Fenya, 3 Schlafzimmer',
          sub: 'Die größte der drei, mit direktem Zugang zu Terrasse und Pool.',
          points: ['Drei Schlafzimmer: ein Hauptschlafzimmer, eines mit Doppelbett und eines mit zwei Einzelbetten', 'Zwei geräumige Badezimmer', 'Voll ausgestattete Küche', 'Gemütliches Wohnzimmer', 'Direkter Zugang zu Terrasse und Pool'],
        },
        {
          name: 'Apartment Yeva, 1 Schlafzimmer',
          sub: 'Komfortabel für Paare, und für eine Familie einzurichten.',
          points: ['Ein Schlafzimmer, mit zusätzlichem Schlafsofa', 'Breites Fenster mit Blick über die grünen Hügel', 'Für Familien einzurichten, auch mit Baby: Reisebett und Hochstuhl', 'Eigenes Bad mit begehbarer Dusche und Duschsitz', 'Eigene Küche'],
        },
        {
          name: 'Studio für 2 Personen',
          sub: 'Perfekt für kurze Aufenthalte.',
          points: ['Perfekt für kurze Aufenthalte', 'Eigene Kochnische', 'Badezimmer und eigener Eingang'],
        },
      ],
      roomsTitle: 'Die Schlafzimmer',
      roomsSub: 'Pro Unterkunft, damit Sie vorab wissen, wie geschlafen wird.',
      roomsFenya: 'Villa Fenya, drei Schlafzimmer',
      roomsYeva: 'Apartment Yeva, ein Schlafzimmer',
      facTitle: 'Ausstattung',
      facilities: [
        {title: 'Privater Beach-Style-Pool', text: 'Mit flachem Einstieg, ideal für Kinder und für Gäste, die weniger mobil sind.'},
        {title: 'Palapa', text: 'Perfekt für Grillabende, ein Glas zusammen und geselliges Beisammensein.'},
        {title: 'Vollständig ummauertes Privatgelände', text: 'Größtmögliche Ruhe und Sicherheit: das ganze Gelände gehört Ihnen und Ihrer Gruppe.'},
        {title: 'Rollstuhlgerecht', text: 'Alle Unterkünfte, der Pool und die Wege sind für Gäste im Rollstuhl zugänglich.'},
      ],
      careTitle: 'Auch mit Pflegebedarf willkommen',
      careText: 'Schwellenlose Übergänge, breite Wege und ein Pool mit flachem Einstieg. Ein verstellbares Hoch-Niedrig-Pflegebett mit Bettgalgen ist vorhanden, ein Rollstuhl steht bereit. Ein solches Pflegebett stellen wir auf Wunsch in jedem Schlafzimmer des Resorts auf. Sagen Sie uns, was Sie brauchen, dann steht es bei Ihrer Ankunft bereit.',
      locTitle: 'Lage',
      locText: 'Aemilius liegt in Barber, einem authentischen und grünen Teil von Curaçao. Hier erleben Sie die Insel, wie sie wirklich ist: ruhig, freundlich und von Natur umgeben. Geschäfte, lokale Restaurants und die bekanntesten Strände sind in wenigen Minuten erreichbar.',
      beachesTitle: 'Die schönsten Strände in kurzer Fahrt',
      beaches: ['Playa Lagun', 'Playa Grandi', 'Cas Abao', 'Playa Porto Mari'],
      whyTitle: 'Warum Aemilius?',
      why: [
        'Ideal für Familien, Paare und kleine Gruppen',
        'Vollständige Privatsphäre und Ruhe',
        'Zentral zu den schönsten Stränden',
        'Komfortable Unterkünfte mit moderner Ausstattung',
        'Rollstuhlfreundlich und für jedes Alter geeignet',
      ],
      galleryTitle: 'Das Resort in Bildern',
      gallerySub: 'Fotos vom Gelände, den Unterkünften und dem Pool, bereitgestellt von den Eigentümern.',
      ctaTitle: 'Interesse an Curaçao?',
      ctaText: 'Sagen Sie uns, wann Sie kommen möchten und mit wie vielen Personen, dann erzählen wir Ihnen alles über die Unterkünfte und die Verfügbarkeit. Dieselbe persönliche Betreuung wie in Winterswijk.',
    },
    footer: {tagline: 'Ferienhäuser in Winterswijk & im Achterhoek', rights: 'Alle Rechte vorbehalten.', placeholder: 'Konzept. Alle Häuser und Fotos stammen vom Eigentümer; die genaue Aufteilung je Haus und der Live-Verfügbarkeitskalender werden noch ergänzt.'},
  },
};

/* ------------------------------------------------------------------ */
/*  Amenities — key -> icon + trilingual label                         */
/* ------------------------------------------------------------------ */
const amenityDef: Record<string, {icon: any; label: Record<Lang, string>}> = {
  wifi: {icon: Wifi, label: {nl: 'Wifi', en: 'Wifi', de: 'WLAN'}},
  pets: {icon: PawPrint, label: {nl: 'Huisdier welkom', en: 'Pets welcome', de: 'Haustiere willkommen'}},
  fireplace: {icon: Flame, label: {nl: 'Houtkachel', en: 'Wood stove', de: 'Holzofen'}},
  garden: {icon: TreePine, label: {nl: 'Grote tuin', en: 'Large garden', de: 'Großer Garten'}},
  terrace: {icon: Sun, label: {nl: 'Terras op het zuiden', en: 'South-facing terrace', de: 'Südterrasse'}},
  hottub: {icon: Waves, label: {nl: 'Hot tub', en: 'Hot tub', de: 'Hot Tub'}},
  sauna: {icon: Sparkles, label: {nl: 'Privé sauna', en: 'Private sauna', de: 'Private Sauna'}},
  bath: {icon: Bath, label: {nl: 'Ligbad', en: 'Bathtub', de: 'Badewanne'}},
  shower: {icon: Waves, label: {nl: 'Aparte douche', en: 'Separate shower', de: 'Separate Dusche'}},
  gasfire: {icon: Flame, label: {nl: 'Gashaard', en: 'Gas fireplace', de: 'Gaskamin'}},
  parking: {icon: Car, label: {nl: 'Gratis parkeren', en: 'Free parking', de: 'Kostenlos parken'}},
  park: {icon: TreePine, label: {nl: 'Op recreatiepark', en: 'On a holiday park', de: 'Auf einem Ferienpark'}},
  nature: {icon: Trees, label: {nl: 'Aan de natuur', en: 'Next to nature', de: 'Direkt an der Natur'}},
  lake: {icon: Waves, label: {nl: 'Bij het Hilgelo', en: 'Close to the Hilgelo lake', de: 'Nahe am See Hilgelo'}},
  forest: {icon: Trees, label: {nl: 'Midden in het bos', en: 'Right in the woods', de: 'Mitten im Wald'}},
  wheelchair: {icon: Accessibility, label: {nl: 'Rolstoeltoegankelijk', en: 'Wheelchair accessible', de: 'Rollstuhlgerecht'}},
  washer: {icon: WashingMachine, label: {nl: 'Gratis wasmachine', en: 'Free use of washing machine', de: 'Waschmaschine gratis'}},
  babycot: {icon: Baby, label: {nl: 'Kinderbedje aanwezig', en: 'Cot available', de: 'Kinderbett vorhanden'}},
};

/* ------------------------------------------------------------------ */
/*  Home data (features language-agnostic; blurbs per language)        */
/* ------------------------------------------------------------------ */
type Home = {
  id: string; name: string; imgs: string[];
  /** Which of the two settings this home sits in — the client wants that difference obvious:
      the Jonkersweg homes sit by the lake, the Kattenberg homes in the woods. */
  area: 'lake' | 'forest';
  /** Omitted while the owner has not confirmed the exact capacity yet. */
  guests?: number; bedrooms?: number; pets: boolean;
  /** Set wherever the dog rule needs a sentence of its own. kattenberg6 is four
      identical homes and only two of them take dogs (Marie, 05-08) — so the chip gets
      the short form and the detail page the long one. The XL and the chalet take no
      dogs at all (Marie, 05-08): no chip there, so only the long form is set. */
  petsNote?: {short?: Record<Lang, string>; long: Record<Lang, string>};
  /** Shown on the detail page instead of the generic region line. */
  location?: string;
  /** Drives the badge on the card and the callout on the detail page. Only the
      geschakelde 8-persoons has it, and per the owner it is the only wheelchair
      accessible holiday home in Winterswijk — so it gets its own band on the landing page. */
  accessible?: boolean;
  /** huurkalender.nl calendar id for this home (account 21492). Only the three
      Den Möllenhof park homes are set up so far — their service names there are
      "DenMöllenhof 55 / 57 / 65", i.e. the same house numbers as the Jonkersweg
      addresses. The account also carries a "DenMöllenhof 63" (21479) that has no
      page on this site. Homes without an id fall back to booking by WhatsApp. */
  calId?: number;
  amenities: string[];
  tagline: Record<Lang, string>;
  blurb: Record<Lang, string>;
  long: Record<Lang, string>;
};

const homes: Home[] = [
  {
    id: 'jonkersweg55', name: 'Jonkersweg 55',
    location: 'Jonkersweg 55, 7104 AB Winterswijk Meddo, Recreatiepark Den Möllenhof',
    imgs: [
      '/img/jonkersweg-1.webp', '/img/jonkersweg-2.webp', '/img/jonkersweg-12.webp',
      '/img/jonkersweg-3.webp', '/img/jonkersweg-4.webp',
      '/img/jonkersweg-5.webp', '/img/jonkersweg-6.webp', '/img/jonkersweg-7.webp', '/img/jonkersweg-8.webp',
      '/img/jonkersweg-9.webp', '/img/jonkersweg-10.webp', '/img/jonkersweg-11.webp',
    ],
    area: 'lake', guests: 6, bedrooms: 3, pets: true, calId: 21470,
    amenities: ['wifi', 'pets', 'sauna', 'hottub', 'gasfire', 'bath', 'shower', 'terrace', 'garden', 'lake', 'park', 'parking'],
    tagline: {
      nl: 'Vrijstaand huis met sauna en bubbelbad',
      en: 'Detached home with sauna and hot tub',
      de: 'Freistehendes Haus mit Sauna und Whirlpool',
    },
    blurb: {
      nl: 'Vrijstaand vakantiehuis aan de Jonkersweg in Winterswijk Meddo, op recreatiepark Den Möllenhof. Eigen sauna én bubbelbad, lichte woonkamer met gashaard, tuin met terras en het Hilgelo vlakbij.',
      en: 'Detached holiday home on Jonkersweg in Winterswijk Meddo, on the Den Möllenhof holiday park. Private sauna and hot tub, a bright living room with gas fireplace, garden with terrace and the Hilgelo lake close by.',
      de: 'Freistehendes Ferienhaus an der Jonkersweg in Winterswijk Meddo, im Ferienpark Den Möllenhof. Eigene Sauna und Whirlpool, helles Wohnzimmer mit Gaskamin, Garten mit Terrasse und der Badesee Hilgelo ganz in der Nähe.',
    },
    long: {
      nl: 'Dit vrijstaande vakantiehuis staat aan de Jonkersweg 55 op recreatiepark Den Möllenhof in Winterswijk Meddo, herkenbaar aan de rode houten topgevel met groene luiken. Binnen is het licht en ruim: een woonkamer met twee zitbanken en een gashaard, openslaande deuren naar de tuin en een eethoek bij het raam. De keuken is compleet ingericht met oven, kookplaat, koffiezetapparaat en waterkoker. De indeling: beneden een slaapkamer met eigen badkamer, boven twee slaapkamers met een badkamer en de sauna. In de badkamer vindt u zowel een ligbad als een aparte douche, en het huis heeft een eigen sauna en een bubbelbad. Uw hond mag mee. Buiten ligt een eigen terras met tuinmeubilair aan het groen. Het Hilgelo, met strandje en wandelpaden eromheen, ligt vlakbij en vanaf het park stapt u zo het coulisselandschap in.',
      en: 'This detached holiday home sits at Jonkersweg 55 on the Den Möllenhof holiday park in Winterswijk Meddo, recognisable by its red timber gable and green shutters. Inside it is light and roomy: a living room with two sofas and a gas fireplace, garden doors opening onto the terrace and a dining corner by the window. The kitchen is fully equipped with an oven, hob, coffee maker and kettle. The layout: one bedroom downstairs with its own bathroom, two bedrooms upstairs sharing a bathroom and the sauna. The bathroom has both a bathtub and a separate shower, and the house has its own sauna and a hot tub. Your dog is welcome. Outside there is a private terrace with garden furniture facing the greenery. The Hilgelo lake, with its beach and walking paths, is close by, and from the park you step straight into the hedgerow landscape.',
      de: 'Dieses freistehende Ferienhaus liegt an der Jonkersweg 55 im Ferienpark Den Möllenhof in Winterswijk Meddo, erkennbar am roten Holzgiebel mit grünen Fensterläden. Drinnen ist es hell und geräumig: ein Wohnzimmer mit zwei Sofas und Gaskamin, Gartentüren zur Terrasse und eine Essecke am Fenster. Die Küche ist komplett ausgestattet mit Backofen, Kochfeld, Kaffeemaschine und Wasserkocher. Die Aufteilung: unten ein Schlafzimmer mit eigenem Badezimmer, oben zwei Schlafzimmer mit Badezimmer und Sauna. Im Badezimmer gibt es sowohl eine Badewanne als auch eine separate Dusche, und das Haus verfügt über eine eigene Sauna und einen Whirlpool. Ihr Hund darf mit. Draußen liegt eine eigene Terrasse mit Gartenmöbeln im Grünen. Der Badesee Hilgelo mit Strand und Wanderwegen liegt ganz in der Nähe, und vom Park aus sind Sie direkt in der Heckenlandschaft.',
    },
  },
  {
    /* Split out from Jonkersweg 55 on the owner's own site, which lists 55 *and* 57.
       Photo set replaced 30-07: the owner sent six phone photos with "Deze foto's zijn de
       juiste wat huisnr 57 betreft". The welcome binder on the coffee table reads
       "57 — Villa Winterswijk", so this set is confirmed. The four professional shots that
       used to sit here belong to neither 55 nor 57 and are parked in unassigned-photos/
       until the owner says which home they are.
       Sauna + hot tub are kept from her own text ("Jonkersweg 55: vakantiewoningen met
       sauna en bubbelbad", plural, covering both Jonkersweg homes) — they are not visible
       in these photos. Gas fireplace dropped: it came from the misassigned pro shot and
       there is no fireplace in the real 57 living room. Capacity unconfirmed. */
    id: 'jonkersweg57', name: 'Jonkersweg 57',
    location: 'Jonkersweg 57, 7104 AB Winterswijk Meddo, Recreatiepark Den Möllenhof',
    imgs: [
      '/img/jonkersweg57-1.webp', '/img/jonkersweg57-2.webp', '/img/jonkersweg57-3.webp',
      '/img/jonkersweg57-4.webp', '/img/jonkersweg57-5.webp', '/img/jonkersweg57-6.webp',
    ],
    area: 'lake', guests: 6, bedrooms: 3, pets: true, calId: 21471,
    amenities: ['wifi', 'pets', 'sauna', 'hottub', 'bath', 'shower', 'terrace', 'garden', 'lake', 'park', 'parking'],
    tagline: {
      nl: 'Villa Winterswijk 57, buurhuis met sauna en bubbelbad',
      en: 'Villa Winterswijk 57, the house next door, with sauna and hot tub',
      de: 'Villa Winterswijk 57, Nachbarhaus mit Sauna und Whirlpool',
    },
    blurb: {
      nl: 'Onze tweede woning aan de Jonkersweg, direct naast nummer 55 op Den Möllenhof. Lichte woonkamer met ruime zithoek, eethoek voor zes, eigen sauna en bubbelbad, ligbad én aparte douche, en een terras aan het groen.',
      en: 'Our second home on Jonkersweg, right next to number 55 on Den Möllenhof. A light living room with a roomy seating area, a dining table for six, private sauna and hot tub, a bathtub and separate shower, and a terrace facing the greenery.',
      de: 'Unser zweites Haus an der Jonkersweg, direkt neben Nummer 55 im Ferienpark Den Möllenhof. Helles Wohnzimmer mit großzügiger Sitzecke, Essplatz für sechs, eigene Sauna und Whirlpool, Badewanne und separate Dusche sowie eine Terrasse im Grünen.',
    },
    long: {
      nl: 'Jonkersweg 57, in huis bekend als Villa Winterswijk 57, staat naast nummer 55 op recreatiepark Den Möllenhof in Winterswijk Meddo. Buiten herkent u het aan de rode houten topgevel en de karakteristieke boogramen, met een magnolia die in het voorjaar vol in bloei staat boven het terras. Binnen is het licht en ruim: een woonkamer met drie leren zitbanken en een fauteuil rond de salontafels, een tv-hoek met boekenkast, en grote schuifpuien naar de tuin. De eethoek heeft een ruime tafel met zes stoelen. De slaapkamers hebben boxsprings die u als tweepersoonsbed of als losse bedden kunt zetten. De indeling is dezelfde als bij nummer 55: beneden een slaapkamer met eigen badkamer, boven twee slaapkamers met een badkamer en de sauna. In de badkamer vindt u zowel een ligbad als een aparte douchecabine, en het huis heeft een eigen sauna en bubbelbad. Uw hond mag mee. Net als bij nummer 55 ligt het Hilgelo op een steenworp afstand en fietst u zo het coulisselandschap in. Deze woning verhuren we samen met nummer 55, dus een groep kan de twee huizen naast elkaar boeken.',
      en: 'Jonkersweg 57, known in-house as Villa Winterswijk 57, stands next to number 55 on the Den Möllenhof holiday park in Winterswijk Meddo. Outside you recognise it by its red timber gable and the characteristic arched windows, with a magnolia in full bloom above the terrace in spring. Inside it is light and roomy: a living room with three leather sofas and an armchair around the coffee tables, a TV corner with a bookcase, and wide sliding doors to the garden. The dining area has a generous table with six chairs. The bedrooms have box-spring beds that can be set up as a double or as two singles. The layout matches number 55: one bedroom downstairs with its own bathroom, two bedrooms upstairs sharing a bathroom and the sauna. The bathroom has both a bathtub and a separate shower cabin, and the house has its own sauna and hot tub. Your dog is welcome. Just as at number 55, the Hilgelo lake is a stone’s throw away and you cycle straight into the hedgerow landscape. We rent this home out alongside number 55, so a larger group can book the two houses side by side.',
      de: 'Jonkersweg 57, im Haus bekannt als Villa Winterswijk 57, liegt direkt neben Nummer 55 im Ferienpark Den Möllenhof in Winterswijk Meddo. Von außen erkennen Sie es am roten Holzgiebel und den charakteristischen Bogenfenstern, mit einer Magnolie, die im Frühjahr über der Terrasse in voller Blüte steht. Drinnen ist es hell und geräumig: ein Wohnzimmer mit drei Ledersofas und einem Sessel rund um die Couchtische, eine Fernsehecke mit Bücherregal und große Schiebetüren zum Garten. Der Essbereich bietet einen großzügigen Tisch mit sechs Stühlen. Die Schlafzimmer haben Boxspringbetten, die als Doppelbett oder als zwei Einzelbetten gestellt werden können. Die Aufteilung entspricht der von Nummer 55: unten ein Schlafzimmer mit eigenem Bad, oben zwei Schlafzimmer mit Badezimmer und Sauna. Das Badezimmer verfügt über eine Badewanne und eine separate Duschkabine, und das Haus hat eine eigene Sauna und einen Whirlpool. Ihr Hund darf mit. Wie bei Nummer 55 liegt der Badesee Hilgelo einen Steinwurf entfernt und Sie radeln direkt in die Heckenlandschaft. Wir vermieten dieses Haus zusammen mit Nummer 55, sodass eine größere Gruppe die beiden Häuser nebeneinander buchen kann.',
    },
  },
  {
    /* Third Jonkersweg home, sent in by the owner on 30-07 ("foto's van nr 65, deze verhuren wij ook").
       Interior is clearly its own: dark leather sofas + red leather armchairs, a black marble gas
       fireplace and a cherry-wood kitchen — no overlap with 55 (blue sofas) or 57 (burgundy leather,
       free-standing stove). 31-07: the owner confirmed every home has a sauna and that all three
       Jonkersweg homes sleep six, so both are on now. The hot tub is still only confirmed for 55/57,
       so it stays off here. Bedroom count still unconfirmed. */
    id: 'jonkersweg65', name: 'Jonkersweg 65',
    location: 'Jonkersweg 65, 7104 AB Winterswijk Meddo, Recreatiepark Den Möllenhof',
    imgs: [
      '/img/jonkersweg65-1.webp', '/img/jonkersweg65-2.webp', '/img/jonkersweg65-3.webp',
      '/img/jonkersweg65-4.webp', '/img/jonkersweg65-5.webp', '/img/jonkersweg65-6.webp',
      '/img/jonkersweg65-7.webp',
    ],
    area: 'lake', guests: 6, pets: true, calId: 21480,
    amenities: ['wifi', 'pets', 'sauna', 'gasfire', 'terrace', 'garden', 'lake', 'park', 'parking'],
    tagline: {
      nl: 'Vrijstaand huis met sauna, gashaard en overdekte veranda',
      en: 'Detached home with sauna, gas fireplace and covered veranda',
      de: 'Freistehendes Haus mit Sauna, Gaskamin und überdachter Veranda',
    },
    blurb: {
      nl: 'Ons derde huis aan de Jonkersweg op Den Möllenhof, voor zes personen en met een eigen sauna. Ruime woonkamer met een gashaard in een zwart marmeren schouw, een overdekte veranda met loungeset en een tuin met terras tussen de berken.',
      en: 'Our third home on Jonkersweg at Den Möllenhof, sleeping six and with its own sauna. A roomy living room with a gas fireplace in a black marble surround, a covered veranda with a lounge set and a garden terrace among the birches.',
      de: 'Unser drittes Haus an der Jonkersweg im Ferienpark Den Möllenhof, für sechs Personen und mit eigener Sauna. Geräumiges Wohnzimmer mit Gaskamin in schwarzem Marmorkamin, eine überdachte Veranda mit Loungeset und eine Gartenterrasse zwischen den Birken.',
    },
    long: {
      nl: 'Jonkersweg 65 is het derde huis dat wij op recreatiepark Den Möllenhof in Winterswijk Meddo verhuren, met dezelfde vertrouwde rode topgevel en groene luiken. Er is plek voor zes personen en net als in onze andere huizen hoort er een eigen sauna bij. De woonkamer is ruim en licht: twee leren banken, twee rode fauteuils en een gashaard in een zwart marmeren schouw, met de karakteristieke boogramen en openslaande deuren naar de tuin. De keuken loopt door vanaf de woonkamer en is compleet ingericht met oven, kookplaat, granieten werkblad en koffiezetapparaat. De slaapkamers hebben boxsprings die u als tweepersoonsbed of als losse bedden kunt zetten. Buiten heeft dit huis iets extra’s: een overdekte veranda met een royale loungeset, waar u ook bij een buitje droog blijft zitten, én een eigen terras met tuinmeubilair aan het gazon tussen de berken en hortensia’s. Uw hond mag mee. Het Hilgelo ligt vlakbij en vanaf het park stapt u zo het coulisselandschap in.',
      en: 'Jonkersweg 65 is the third home we rent out on the Den Möllenhof holiday park in Winterswijk Meddo, with the same familiar red timber gable and green shutters. It sleeps six and, like our other homes, comes with its own sauna. The living room is roomy and light: two leather sofas, two red armchairs and a gas fireplace in a black marble surround, with the characteristic arched windows and garden doors. The kitchen runs on from the living room and is fully equipped with an oven, hob, granite worktop and coffee maker. The bedrooms have box-spring beds that can be set up as a double or as two singles. Outside this home has something extra: a covered veranda with a generous lounge set, so you stay dry even in a shower, plus a private terrace with garden furniture on the lawn among the birches and hydrangeas. Your dog is welcome. The Hilgelo lake is close by and from the park you step straight into the hedgerow landscape.',
      de: 'Jonkersweg 65 ist das dritte Haus, das wir im Ferienpark Den Möllenhof in Winterswijk Meddo vermieten, mit dem gleichen vertrauten roten Holzgiebel und grünen Fensterläden. Es bietet Platz für sechs Personen und hat, wie unsere anderen Häuser, eine eigene Sauna. Das Wohnzimmer ist geräumig und hell: zwei Ledersofas, zwei rote Sessel und ein Gaskamin in schwarzem Marmorkamin, dazu die charakteristischen Bogenfenster und Gartentüren. Die Küche schließt an das Wohnzimmer an und ist komplett ausgestattet mit Backofen, Kochfeld, Granitarbeitsplatte und Kaffeemaschine. Die Schlafzimmer haben Boxspringbetten, die als Doppelbett oder als zwei Einzelbetten gestellt werden können. Draußen hat dieses Haus etwas Besonderes: eine überdachte Veranda mit großzügigem Loungeset, sodass Sie auch bei einem Schauer trocken sitzen, sowie eine eigene Terrasse mit Gartenmöbeln am Rasen zwischen Birken und Hortensien. Ihr Hund darf mit. Der Badesee Hilgelo liegt ganz in der Nähe und vom Park aus sind Sie direkt in der Heckenlandschaft.',
    },
  },
  {
    id: 'kattenberg6', name: 'Boswoning Kattenberg',
    location: 'Kattenbergweg 6, 7101 BM Winterswijk',
    /* Photo set replaced 31-07 with the real gallery from dekattenberg.nl — those owners
       have us manage their homes, confirmed by Armando. Replaces the funda screenshots. */
    imgs: [
      '/img/kattenberg6-1.webp', '/img/kattenberg6-2.webp', '/img/kattenberg6-3.webp', '/img/kattenberg6-4.webp',
      '/img/kattenberg6-5.webp', '/img/kattenberg6-6.webp', '/img/kattenberg6-7.webp', '/img/kattenberg6-8.webp',
      '/img/kattenberg6-9.webp', '/img/kattenberg6-10.webp', '/img/kattenberg6-11.webp', '/img/kattenberg6-12.webp',
      '/img/kattenberg6-13.webp',
    ],
    area: 'forest', guests: 6, bedrooms: 3, pets: true,
    petsNote: {
      short: {nl: '2 van de 4', en: '2 of the 4', de: '2 von 4'},
      long: {
        nl: 'Van de vier woningen van dit type zijn er twee waar uw hond mee mag. Geef bij uw aanvraag even door dat u een hond meeneemt, dan zetten we een hondvriendelijke woning voor u klaar.',
        en: 'Of the four homes of this type, two take dogs. Just mention your dog when you enquire and we will set aside one of the dog-friendly homes for you.',
        de: 'Von den vier Häusern dieses Typs nehmen zwei Hunde auf. Sagen Sie bei Ihrer Anfrage kurz Bescheid, dass ein Hund mitkommt, dann halten wir eines der hundefreundlichen Häuser für Sie bereit.',
      },
    },
    amenities: ['wifi', 'pets', 'sauna', 'bath', 'shower', 'terrace', 'garden', 'washer', 'forest', 'nature', 'parking'],
    tagline: {
      nl: 'Geschakelde boswoning met eigen sauna, 4 beschikbaar',
      en: 'Linked woodland home with a private sauna, 4 available',
      de: 'Reihen-Waldhaus mit eigener Sauna, 4 verfügbar',
    },
    blurb: {
      nl: 'Geschakelde vakantiewoning voor zes personen midden in het bos op de Kattenberg. Met eigen sauna, ligbad én aparte douche, een ruim terras en het bos direct achter de tuin. Wij hebben er vier van dit type, waarvan twee hondvriendelijk.',
      en: 'Linked holiday home for six in the middle of the woods on the Kattenberg. With a private sauna, a bathtub and a separate shower, a generous terrace and the forest right behind the garden. We have four of this type, two of them dog-friendly.',
      de: 'Reihen-Ferienhaus für sechs Personen mitten im Wald auf dem Kattenberg. Mit eigener Sauna, Badewanne und separater Dusche, großer Terrasse und dem Wald direkt hinter dem Garten. Wir haben vier von diesem Typ, zwei davon hundefreundlich.',
    },
    long: {
      nl: 'Deze geschakelde vakantiewoning staat op de Kattenberg, midden in het bos even buiten Winterswijk. U komt binnen via de ingang aan de zijkant van het complex. Op de begane grond ligt de ruime en smaakvol ingerichte woonkamer met open keuken, voorzien van combimagnetron, vaatwasser en een vierpits inductieplaat. Grote schuifpuien halen het groen naar binnen en brengen u zo op het terras. Slaapkamer 1 ligt op de begane grond en heeft een eigen badkamer met douche en wastafel; het toilet zit apart. Op de eerste verdieping liggen slaapkamer 2 en 3 en de tweede badkamer, met ligbad, douche, toilet en een eigen sauna. Alle slaapkamers hebben luxe boxsprings en bedlinnen is inbegrepen. Van de wasmachine in het receptiegebouw maakt u gratis gebruik. Van de vier woningen van dit type zijn er twee waar uw hond mee mag: geef bij uw aanvraag even door dat u een hond meeneemt, dan zetten we een hondvriendelijke woning voor u klaar. Buiten ligt een besloten terras met tuinmeubilair, beschut tussen de bomen, en achter de tuin begint het bos. Wij verhuren vier woningen van dit type, elk voor zes personen.',
      en: 'This linked holiday home sits on the Kattenberg, right in the woods just outside Winterswijk. You enter through the door on the side of the complex. Downstairs is the spacious, tastefully furnished living room with an open kitchen, complete with a combination microwave, dishwasher and a four-ring induction hob. Wide sliding doors pull the greenery inside and take you straight onto the terrace. Bedroom 1 is on the ground floor with its own bathroom with shower and basin; the toilet is separate. Upstairs are bedrooms 2 and 3 and the second bathroom, with a bathtub, shower, toilet and a private sauna. All bedrooms have luxury box-spring beds and bed linen is included. The washing machine in the reception building is free to use. Of the four homes of this type, two take dogs: just mention your dog when you enquire and we will set aside a dog-friendly home for you. Outside there is a sheltered terrace with garden furniture among the trees, and the forest starts right behind the garden. We rent out four homes of this type, each sleeping six.',
      de: 'Dieses Reihen-Ferienhaus liegt auf dem Kattenberg, mitten im Wald kurz außerhalb von Winterswijk. Sie betreten es über den Eingang an der Seite des Komplexes. Im Erdgeschoss liegt das geräumige, geschmackvoll eingerichtete Wohnzimmer mit offener Küche, ausgestattet mit Kombi-Mikrowelle, Geschirrspüler und einem Vier-Zonen-Induktionskochfeld. Große Schiebetüren holen das Grün herein und führen direkt auf die Terrasse. Schlafzimmer 1 liegt im Erdgeschoss und hat ein eigenes Bad mit Dusche und Waschbecken; das WC ist separat. Im ersten Stock liegen Schlafzimmer 2 und 3 sowie das zweite Bad mit Badewanne, Dusche, WC und eigener Sauna. Alle Schlafzimmer haben luxuriöse Boxspringbetten, Bettwäsche ist inklusive. Die Waschmaschine im Rezeptionsgebäude nutzen Sie kostenlos. Von den vier Häusern dieses Typs nehmen zwei Hunde auf: sagen Sie bei Ihrer Anfrage kurz Bescheid, dass ein Hund mitkommt, dann halten wir eines der hundefreundlichen Häuser für Sie bereit. Draußen liegt eine geschützte Terrasse mit Gartenmöbeln zwischen den Bäumen, und hinter dem Garten beginnt der Wald. Wir vermieten vier Häuser dieses Typs für jeweils sechs Personen.',
    },
  },
  {
    /* The stand-out home: per the owner (viewing 31-07) this is the only wheelchair
       accessible holiday home in Winterswijk. Photo set and layout from dekattenberg.nl,
       whose owners have us manage their homes. kattenberg8-9 is the accessible bathroom
       (fold-down shower chair, grab bars, roll-in shower) — the proof for the claim. */
    id: 'kattenberg8', name: 'Boswoning Kattenberg XL',
    location: 'Kattenbergweg 6, 7101 BM Winterswijk',
    imgs: [
      '/img/kattenberg8-1.webp', '/img/kattenberg8-2.webp', '/img/kattenberg8-3.webp', '/img/kattenberg8-4.webp',
      '/img/kattenberg8-5.webp', '/img/kattenberg8-6.webp', '/img/kattenberg8-7.webp', '/img/kattenberg8-8.webp',
      '/img/kattenberg8-9.webp', '/img/kattenberg8-10.webp', '/img/kattenberg8-11.webp', '/img/kattenberg8-12.webp',
      '/img/kattenberg8-13.webp', '/img/kattenberg8-14.webp',
    ],
    area: 'forest', guests: 8, bedrooms: 4, pets: false, accessible: true,
    petsNote: {
      long: {
        nl: 'In deze woning zijn helaas geen huisdieren toegestaan. Komt u met een hond? Kijk dan bij onze huizen aan de Jonkersweg of bij de Boswoning Kattenberg.',
        en: 'Pets are unfortunately not allowed in this home. Travelling with a dog? Take a look at our homes on the Jonkersweg or at the Boswoning Kattenberg.',
        de: 'In diesem Haus sind Haustiere leider nicht erlaubt. Sie reisen mit Hund? Schauen Sie sich unsere Häuser an der Jonkersweg oder das Boswoning Kattenberg an.',
      },
    },
    amenities: ['wheelchair', 'wifi', 'sauna', 'bath', 'shower', 'terrace', 'garden', 'washer', 'babycot', 'forest', 'nature', 'parking'],
    tagline: {
      nl: 'Rolstoeltoegankelijk, de enige in Winterswijk',
      en: 'Wheelchair accessible, the only one in Winterswijk',
      de: 'Rollstuhlgerecht, das einzige in Winterswijk',
    },
    blurb: {
      nl: 'De ruimste geschakelde woning op de Kattenberg, voor acht personen en met een eigen sauna. Volledig rolstoeltoegankelijk: slaapkamer én badkamer op de begane grond, douchestoel en steunbeugels.',
      en: 'The most spacious linked home on the Kattenberg, sleeping eight and with a private sauna. Fully wheelchair accessible: bedroom and bathroom on the ground floor, shower chair and grab rails.',
      de: 'Das geräumigste Reihenhaus auf dem Kattenberg, für acht Personen und mit eigener Sauna. Vollständig rollstuhlgerecht: Schlafzimmer und Bad im Erdgeschoss, Duschstuhl und Haltegriffe.',
    },
    long: {
      nl: 'De grote variant van onze boswoningen op de Kattenberg, met plaats voor acht personen, en de enige vakantiewoning in Winterswijk die volledig rolstoeltoegankelijk is. Op de begane grond ligt een slaapkamer met luxe boxsprings en een eigen badkamer: de douche is voorzien van een opklapbare douchestoel en drempelloos, het toilet heeft steunbeugels en de wastafel is onderrijdbaar. Ook de woonkamer, de keuken en de tuindeuren zijn drempelloos bereikbaar. De woonkamer zelf is licht en ruim, met een grote hoekbank en een eettafel voor acht, en de keuken is compleet uitgerust met een vijfpits gasfornuis, oven en vaatwasser. Via de schuifpui loopt u de zonnige, volledig omheinde tuin in, met tuinmeubilair en parasol. Boven liggen nog drie slaapkamers met boxsprings en een tweede badkamer met ligbad, douche, toilet en een eigen sauna. Er is een kinderbedje aanwezig en van de wasmachine in het receptiegebouw maakt u gratis gebruik. Wilt u met een rolstoel komen? Neem even contact op, dan lopen we samen door wat u nodig heeft en zorgen we dat alles klaarstaat.',
      en: 'The larger version of our woodland homes on the Kattenberg, sleeping eight, and the only holiday home in Winterswijk that is fully wheelchair accessible. On the ground floor there is a bedroom with luxury box-spring beds and its own bathroom: the shower is step-free with a fold-down shower chair, the toilet has grab rails and the basin can be used from a seated position. The living room, kitchen and garden doors are all step-free as well. The living room itself is light and roomy, with a large corner sofa and a dining table for eight, and the kitchen is fully equipped with a five-burner gas hob, oven and dishwasher. Through the sliding door you step into the sunny, fully fenced garden with furniture and a parasol. Upstairs are three more bedrooms with box-spring beds and a second bathroom with a bathtub, shower, toilet and a private sauna. A cot is available and the washing machine in the reception building is free to use. Coming with a wheelchair? Get in touch and we will go through exactly what you need so everything is ready for you.',
      de: 'Die große Variante unserer Waldhäuser auf dem Kattenberg, für acht Personen, und das einzige Ferienhaus in Winterswijk, das vollständig rollstuhlgerecht ist. Im Erdgeschoss liegt ein Schlafzimmer mit luxuriösen Boxspringbetten und eigenem Bad: die Dusche ist schwellenlos und mit einem klappbaren Duschstuhl ausgestattet, das WC hat Haltegriffe und das Waschbecken ist unterfahrbar. Auch Wohnzimmer, Küche und Gartentüren sind schwellenlos erreichbar. Das Wohnzimmer selbst ist hell und geräumig, mit großem Ecksofa und einem Esstisch für acht, und die Küche ist komplett ausgestattet mit Fünf-Flammen-Gasherd, Backofen und Geschirrspüler. Durch die Schiebetür treten Sie in den sonnigen, vollständig eingezäunten Garten mit Gartenmöbeln und Sonnenschirm. Oben liegen drei weitere Schlafzimmer mit Boxspringbetten sowie ein zweites Bad mit Badewanne, Dusche, WC und eigener Sauna. Ein Kinderbett ist vorhanden und die Waschmaschine im Rezeptionsgebäude nutzen Sie kostenlos. Sie kommen mit einem Rollstuhl? Melden Sie sich kurz, dann gehen wir gemeinsam durch, was Sie brauchen, und sorgen dafür, dass alles bereitsteht.',
    },
  },
  {
    id: 'finschalet', name: 'Fins chalet Kattenberg',
    location: 'Kattenbergweg 6, 7101 BN Winterswijk',
    imgs: [
      '/img/chalet-1.webp', '/img/chalet-2.webp', '/img/chalet-3.webp', '/img/chalet-4.webp',
      '/img/chalet-5.webp', '/img/chalet-6.webp', '/img/chalet-7.webp', '/img/chalet-8.webp',
      '/img/chalet-9.webp', '/img/chalet-10.webp', '/img/chalet-11.webp', '/img/chalet-12.webp',
      '/img/chalet-13.webp', '/img/chalet-14.webp', '/img/chalet-15.webp', '/img/chalet-16.webp',
    ],
    area: 'forest', guests: 8, bedrooms: 4, pets: false,
    petsNote: {
      long: {
        nl: 'In dit chalet zijn helaas geen huisdieren toegestaan. Komt u met een hond? Kijk dan bij onze huizen aan de Jonkersweg of bij de Boswoning Kattenberg.',
        en: 'Pets are unfortunately not allowed in this chalet. Travelling with a dog? Take a look at our homes on the Jonkersweg or at the Boswoning Kattenberg.',
        de: 'In diesem Chalet sind Haustiere leider nicht erlaubt. Sie reisen mit Hund? Schauen Sie sich unsere Häuser an der Jonkersweg oder das Boswoning Kattenberg an.',
      },
    },
    amenities: ['wifi', 'sauna', 'shower', 'terrace', 'garden', 'washer', 'babycot', 'forest', 'nature', 'parking'],
    tagline: {
      nl: 'Vrijstaand houten chalet voor acht personen',
      en: 'Detached wooden chalet for eight guests',
      de: 'Freistehendes Holzchalet für acht Personen',
    },
    blurb: {
      nl: 'Vrijstaand Fins chalet met een hoge glasgevel, eigen sauna en het bos rondom. Acht personen, waarvan twee slapen in een apart bijgebouwtje.',
      en: 'Detached Finnish chalet with a tall glass gable, private sauna and woodland all around. Sleeps eight, two of them in a separate outbuilding.',
      de: 'Freistehendes finnisches Chalet mit hoher Glasfront, eigener Sauna und Wald ringsum. Für acht Personen, davon zwei in einem separaten Nebengebäude.',
    },
    long: {
      nl: 'Onze verscholen parel op de Kattenberg: een vrijstaand Fins chalet van hout, met een eigen hek waar u doorheen rijdt en dan pas ziet hoe groot het is. Het chalet heeft een gigantische tuin met een royaal terras en een fijne tuinset om lekker in de zon te zitten, terwijl de kinderen een balletje trappen op het gras. Binnen komt u in de fraai ingerichte woonkamer met een erker die uitkijkt op de tuin, en een grote luxe keuken met combi-oven en vaatwasser. Op de begane grond ligt een slaapkamer met luxe boxsprings, met daarnaast een douche en een apart toilet. Boven vindt u nog twee grote slaapkamers, ook met boxsprings, een gloednieuwe badkamer met douche en toilet, en een eigen sauna. Naast het chalet staat een apart bijgebouw met nog een slaapkamer en een eigen badkamer met douche en toilet: een eigen gastenverblijf voor een stel dat meekomt of voor de oudste kinderen. Er is ook een schuurtje met een grote vriezer, een kinderbedje is aanwezig en van de wasmachine in het receptiegebouw maakt u gratis gebruik. Vrijstaand, dus geen buren aan de muur.',
      en: 'Our hidden gem on the Kattenberg: a detached Finnish timber chalet with its own gate. You only realise how big it is once you have driven through it. The chalet has an enormous garden with a generous terrace and a proper garden set to sit in the sun while the children kick a ball around on the lawn. Inside you walk into a beautifully furnished living room with a bay window looking out over the garden, and a large luxury kitchen with a combination oven and dishwasher. On the ground floor there is a bedroom with luxury box-spring beds, with a shower and separate toilet next to it. Upstairs are two more large bedrooms, also with box-springs, a brand-new bathroom with shower and toilet, and a private sauna. Beside the chalet stands a separate outbuilding with one more bedroom and its own bathroom with shower and toilet: a private guest cabin for a couple joining you or for the older children. There is also a shed with a large freezer, a cot is available and the washing machine in the reception building is free to use. Detached, so no neighbours through the wall.',
      de: 'Unsere versteckte Perle auf dem Kattenberg: ein freistehendes finnisches Holzchalet mit eigenem Tor. Erst wenn Sie hindurchgefahren sind, sehen Sie, wie groß es ist. Das Chalet hat einen riesigen Garten mit großzügiger Terrasse und einer schönen Gartengarnitur, um in der Sonne zu sitzen, während die Kinder auf der Wiese Ball spielen. Drinnen betreten Sie das schön eingerichtete Wohnzimmer mit Erker und Blick in den Garten sowie eine große Luxusküche mit Kombi-Backofen und Geschirrspüler. Im Erdgeschoss liegt ein Schlafzimmer mit luxuriösen Boxspringbetten, daneben eine Dusche und ein separates WC. Oben finden Sie zwei weitere große Schlafzimmer, ebenfalls mit Boxspringbetten, ein nagelneues Bad mit Dusche und WC sowie eine eigene Sauna. Neben dem Chalet steht ein separates Nebengebäude mit einem weiteren Schlafzimmer und eigenem Bad mit Dusche und WC: ein eigenes Gästehaus für ein mitreisendes Paar oder die älteren Kinder. Es gibt außerdem einen Schuppen mit großer Gefriertruhe, ein Kinderbett ist vorhanden und die Waschmaschine im Rezeptionsgebäude nutzen Sie kostenlos. Freistehend, also keine Nachbarn an der Wand.',
    },
  },
];

const iconMap: Record<string, any> = {bike: Bike, trees: Trees, calendar: Calendar, camera: Camera};

/* ------------------------------------------------------------------ */
/*  Nature gallery — the owner's own photos from in and around the park */
/* ------------------------------------------------------------------ */
const naturePhotos: {src: string; title: Record<Lang, string>; text: Record<Lang, string>; credit?: string; now?: boolean}[] = [
  {
    src: '/img/nature-owl-flight.webp',
    credit: 'Jacob Doornheim',
    title: {nl: 'Oehoe in de steengroeve', en: 'Eagle owl in the quarry', de: 'Uhu im Steinbruch'},
    text: {
      nl: 'In de steengroeve broedt al jaren een paartje oehoes, de grootste uil van Europa. Hier vliegt het vrouwtje langs de wand terwijl de jongen toekijken.',
      en: 'A pair of eagle owls, Europe’s largest owl, has been breeding in the quarry for years. Here the female sweeps past the rock face while the young look on.',
      de: 'Im Steinbruch brütet seit Jahren ein Uhu-Paar, die größte Eule Europas. Hier fliegt das Weibchen an der Wand entlang, während die Jungen zusehen.',
    },
  },
  {
    src: '/img/nature-owl-pair.webp',
    credit: 'Jacob Doornheim',
    title: {nl: 'Moeder en jong', en: 'Mother and chick', de: 'Mutter und Jungvogel'},
    text: {
      nl: 'Vanaf de uitkijkplek is het nest met een verrekijker goed te zien. In het voorjaar zitten de jongen overdag op de richel.',
      en: 'From the viewing point the nest is easy to spot with binoculars. In spring the chicks sit out on the ledge during the day.',
      de: 'Vom Aussichtspunkt ist das Nest mit dem Fernglas gut zu sehen. Im Frühjahr sitzen die Jungen tagsüber auf dem Felsvorsprung.',
    },
  },
  {
    src: '/img/nature-owl-nest.webp',
    credit: 'Jacob Doornheim',
    title: {nl: 'Op wacht bij het nest', en: 'On guard at the nest', de: 'Wache am Nest'},
    text: {
      nl: 'Blijf op afstand en houd het rustig, dan blijven ze gewoon zitten. Een verrekijker is hier belangrijker dan een goede lens.',
      en: 'Keep your distance and stay quiet and they will simply stay put. Binoculars matter more here than a long lens.',
      de: 'Halten Sie Abstand und bleiben Sie ruhig, dann bleiben sie einfach sitzen. Ein Fernglas ist hier wichtiger als ein gutes Objektiv.',
    },
  },
  {
    src: '/img/nature-robin.webp',
    title: {nl: 'Roodborstje', en: 'Robin', de: 'Rotkehlchen'},
    text: {
      nl: 'Het hele jaar in de tuin en langs de heggen, en zo nieuwsgierig dat hij vaak vlak naast u komt zitten.',
      en: 'In the garden and along the hedges all year round, and curious enough to perch right next to you.',
      de: 'Das ganze Jahr im Garten und an den Hecken, und so neugierig, dass es sich oft direkt neben Sie setzt.',
    },
  },
  {
    src: '/img/nature-squirrel.webp',
    title: {nl: 'Eekhoorn', en: 'Red squirrel', de: 'Eichhörnchen'},
    text: {
      nl: 'Rode eekhoorns zijn vaste gasten op het park. Leg een appel op de tafel en de kans is groot dat er eentje langskomt.',
      en: 'Red squirrels are regulars on the park. Leave an apple out and there is a good chance one drops by.',
      de: 'Eichhörnchen sind Stammgäste im Park. Legen Sie einen Apfel hin, und gut möglich, dass eines vorbeikommt.',
    },
  },
  {
    src: '/img/nature-flamingos.webp',
    now: true,
    title: {nl: 'Flamingo’s', en: 'Flamingos', de: 'Flamingos'},
    text: {
      nl: 'De noordelijkste flamingokolonie ter wereld, op 15 km in het Zwillbrocker Venn. Het broedseizoen loopt van april tot juli, dus wie ze dit jaar nog wil zien moet er snel bij zijn.',
      en: 'The northernmost flamingo colony in the world, 15 km away at the Zwillbrocker Venn. The breeding season runs from April to July, so if you want to see them this year you will have to be quick.',
      de: 'Die nördlichste Flamingokolonie der Welt, 15 km entfernt im Zwillbrocker Venn. Die Brutzeit läuft von April bis Juli. Wer sie dieses Jahr noch sehen will, muss schnell sein.',
    },
  },
  {
    src: '/img/nature-lake.webp',
    title: {nl: 'Aan het water', en: 'By the water', de: 'Am Wasser'},
    text: {
      nl: 'Bankjes langs de waterkant op loopafstand van het park. Vroeg in het voorjaar heeft u ze vaak helemaal voor uzelf.',
      en: 'Benches along the waterside within walking distance of the park. In early spring you often have them entirely to yourself.',
      de: 'Bänke am Wasser in Gehweite des Parks. Im zeitigen Frühjahr haben Sie sie oft ganz für sich allein.',
    },
  },
  {
    src: '/img/nature-robin-2.webp',
    title: {nl: 'Vlak voor de deur', en: 'Right outside the door', de: 'Direkt vor der Tür'},
    text: {
      nl: 'U hoeft er niet ver voor te lopen. Het meeste komt gewoon naar het terras toe.',
      en: 'You do not have to walk far for it. Most of it simply comes to the terrace.',
      de: 'Sie müssen dafür nicht weit laufen. Das meiste kommt einfach zur Terrasse.',
    },
  },
  {
    src: '/img/area-park-autumn.webp',
    title: {nl: 'Het park in de herfst', en: 'The park in autumn', de: 'Der Park im Herbst'},
    text: {
      nl: 'Berken, rode topgevels en een laan vol bladeren. Elk seizoen ziet het park er weer anders uit.',
      en: 'Birches, red gables and a lane full of leaves. Every season gives the park a different face.',
      de: 'Birken, rote Giebel und eine Allee voller Blätter. Jede Saison zeigt den Park von einer anderen Seite.',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Events — real entries from the Winterswijk agenda (100procentwinterswijk.nl).
    Refreshed per season; the dates are what makes the site feel alive next to
    a static competitor, so they must be updated when the season turns.        */
/* ------------------------------------------------------------------ */
const events: {title: Record<Lang, string>; when: Record<Lang, string>; text: Record<Lang, string>}[] = [
  {
    title: {nl: 'Wild Kiek’n Safari', en: 'Wild Kiek’n wildlife safari', de: 'Wild Kiek’n Wildsafari'},
    when: {nl: 't/m 30 oktober', en: 'until 30 October', de: 'bis 30. Oktober'},
    text: {
      nl: 'Onder begeleiding het veld in om reeën, dassen en vogels te spotten. Favoriet bij gasten met kinderen.',
      en: 'Head into the fields with a guide to spot deer, badgers and birds. A favourite with guests bringing children.',
      de: 'Mit Führung ins Feld, um Rehe, Dachse und Vögel zu beobachten. Beliebt bei Gästen mit Kindern.',
    },
  },
  {
    /* Added on the client's request. Deliberately no exact dates: the Zwarte Cross runs in
       mid-July but the 2027 dates are not fixed yet, and the client asked us to drop anything
       that can go stale or is not theirs. */
    title: {nl: 'Zwarte Cross', en: 'Zwarte Cross festival', de: 'Zwarte Cross Festival'},
    when: {nl: 'jaarlijks in juli', en: 'every July', de: 'jährlich im Juli'},
    text: {
      nl: 'Het grootste festival van de Achterhoek, op een klein half uur rijden in Lichtenvoorde. Muziek, motorcross en Achterhoekse gekte, vier dagen lang.',
      en: 'The biggest festival in the Achterhoek, a short drive away in Lichtenvoorde. Music, motocross and local madness, four days long.',
      de: 'Das größte Festival des Achterhoek, eine knappe halbe Stunde entfernt in Lichtenvoorde. Musik, Motocross und Achterhoeker Verrücktheit, vier Tage lang.',
    },
  },
  {
    title: {nl: 'Wijngaard Hesselink: rondleiding & proeverij', en: 'Hesselink vineyard: tour & tasting', de: 'Weingut Hesselink: Führung & Probe'},
    when: {nl: 't/m 29 oktober', en: 'until 29 October', de: 'bis 29. Oktober'},
    text: {
      nl: 'Ja, er wordt hier wijn gemaakt. Rondleiding door de wijngaard met een proeverij na.',
      en: 'Yes, they really do make wine here. A tour of the vineyard followed by a tasting.',
      de: 'Ja, hier wird tatsächlich Wein gemacht. Führung durch den Weinberg mit anschließender Probe.',
    },
  },
  {
    title: {nl: 'Fietstocht met een Gilde-gids', en: 'Guided cycle tour with a Gilde guide', de: 'Radtour mit einem Gilde-Guide'},
    when: {nl: 't/m 29 oktober', en: 'until 29 October', de: 'bis 29. Oktober'},
    text: {
      nl: 'Een gids uit het dorp neemt u langs de plekken die u zelf nooit zou vinden. Er is ook een dorpswandeling t/m 31 oktober.',
      en: 'A local guide takes you past the spots you would never find on your own. There is a village walk too, until 31 October.',
      de: 'Ein einheimischer Guide zeigt Ihnen Orte, die Sie allein nie finden würden. Es gibt auch einen Dorfspaziergang bis 31. Oktober.',
    },
  },
  {
    title: {nl: 'Museum Villa Mondriaan: Zij aan Zij', en: 'Museum Villa Mondriaan: Side by Side', de: 'Museum Villa Mondriaan: Seite an Seite'},
    when: {nl: 't/m 11 oktober', en: 'until 11 October', de: 'bis 11. Oktober'},
    text: {
      nl: 'Mondriaan groeide op in Winterswijk. In zijn museum hangt nu Mondriaan in dialoog met tijdgenoten.',
      en: 'Mondrian grew up in Winterswijk. His museum currently shows Mondrian in dialogue with his contemporaries.',
      de: 'Mondrian wuchs in Winterswijk auf. In seinem Museum hängt derzeit Mondrian im Dialog mit Zeitgenossen.',
    },
  },
  {
    title: {nl: 'Theater Nachttour in Theater Astoria', en: 'Theatre Night Tour at Theater Astoria', de: 'Theater-Nachttour im Theater Astoria'},
    when: {nl: 'diverse avonden', en: 'various evenings', de: 'verschiedene Abende'},
    text: {
      nl: 'Na sluitingstijd achter de coulissen van het oude theater. Leuk voor een avond zonder kinderen.',
      en: 'Behind the scenes of the old theatre after closing time. A good one for an evening without the kids.',
      de: 'Nach Feierabend hinter die Kulissen des alten Theaters. Schön für einen Abend ohne Kinder.',
    },
  },
  {
    title: {nl: 'Brouwerij Wentersch', en: 'Wentersch brewery', de: 'Brauerei Wentersch'},
    when: {nl: 'wekelijks', en: 'weekly', de: 'wöchentlich'},
    text: {
      nl: 'De plaatselijke brouwerij, op fietsafstand. Kijkje achter de tap en daarna proeven.',
      en: 'The local brewery, within cycling distance. A look behind the taps and a tasting after.',
      de: 'Die örtliche Brauerei, in Radentfernung. Ein Blick hinter den Zapfhahn und danach probieren.',
    },
  },
  {
    title: {nl: 'Zomerspeurtocht Geheimtaal', en: 'Summer treasure hunt: Secret Language', de: 'Sommer-Suchspiel: Geheimsprache'},
    when: {nl: 't/m 30 augustus', en: 'until 30 August', de: 'bis 30. August'},
    text: {
      nl: 'Speurtocht door het dorp voor kinderen. Gratis en zo het huis uit te doen.',
      en: 'A treasure hunt through the village for children. Free, and easy to do straight from the house.',
      de: 'Eine Schnitzeljagd durchs Dorf für Kinder. Kostenlos und direkt vom Haus aus machbar.',
    },
  },
  {
    title: {nl: 'Openluchttheater in de steengroeve', en: 'Open-air theatre in the quarry', de: 'Freilichttheater im Steinbruch'},
    when: {nl: 'zomerseizoen', en: 'summer season', de: 'Sommersaison'},
    text: {
      nl: 'Voorstellingen in de Steengroeve, tussen de rotswanden waar ook de oehoes broeden.',
      en: 'Performances in the quarry, among the rock faces where the eagle owls nest.',
      de: 'Aufführungen im Steinbruch, zwischen den Felswänden, wo auch die Uhus brüten.',
    },
  },
];

/* Bike rental shops in Winterswijk. Prices removed on the client's request: the money does not
   go to them and rates change, so we only describe what each place offers. The owner still has
   to confirm which of these she actually works with. */
const bikeRentals: {name: string; what: Record<Lang, string>; contact: string; url: string}[] = [
  {
    /* The rental our own park works with: they deliver to the door and collect again,
       free of charge. Straight from the Kattenberg facilities page. */
    name: 'Profile Wesselink',
    what: {
      nl: 'Onze vaste fietsverhuurder. Wesselink brengt en haalt uw fiets gratis bij het vakantiehuis. Vooraf reserveren kan.',
      en: 'The rental we work with. Wesselink delivers your bike to the house and collects it again, free of charge. You can reserve in advance.',
      de: 'Unser fester Fahrradverleih. Wesselink bringt und holt Ihr Rad kostenlos am Ferienhaus. Vorab reservieren ist möglich.',
    },
    contact: 'profilewesselink.nl',
    url: 'https://www.profilewesselink.nl/',
  },
  {
    name: 'Bike Totaal Winterswijk',
    what: {
      nl: 'Stadsfietsen en e-bikes. Bezorgen de fietsen bij het huis en halen ze daar ook weer op.',
      en: 'City bikes and e-bikes. They deliver the bikes to the house and collect them there again.',
      de: 'Stadträder und E-Bikes. Sie bringen die Räder zum Haus und holen sie dort wieder ab.',
    },
    contact: 'verhuur@biketotaalwinterswijk.nl',
    url: 'https://www.biketotaal.nl/fietsenwinkel/bike-totaal-winterswijk/fietsverhuur',
  },
  {
    name: 'Oonk Speciaalzaak',
    what: {
      nl: 'Ook tandems en e-bikes, per dag of per week te huren.',
      en: 'Tandems and e-bikes too, by the day or by the week.',
      de: 'Auch Tandems und E-Bikes, tage- oder wochenweise.',
    },
    contact: 'oonkspeciaalzaak.nl',
    url: 'https://www.oonkspeciaalzaak.nl/nl/Fietsverhuur/',
  },
  {
    name: 'Route Wenters',
    what: {
      nl: 'Iets anders: e-choppers en fatbikes, leuk met tieners.',
      en: 'Something different: e-choppers and fatbikes, fun with teenagers.',
      de: 'Etwas anderes: E-Chopper und Fatbikes, ideal mit Teenagern.',
    },
    contact: 'routewenters.nl',
    url: 'https://routewenters.nl/',
  },
];

/* ------------------------------------------------------------------ */
/*  "Vanaf de deur" — what sits within reach of the homes. Content and the four
    photos come from the facilities page of dekattenberg.nl, whose owners have us
    manage their homes. Distances are measured from the Kattenberg, so they are
    labelled as such rather than presented as true for every home.               */
const nearbyPlaces: {img?: string; dist: Record<Lang, string>; title: Record<Lang, string>; text: Record<Lang, string>}[] = [
  {
    img: '/img/area-hilgelo.webp',
    dist: {nl: 'Om de hoek', en: 'Around the corner', de: 'Um die Ecke'},
    title: {nl: 'Het Hilgelo', en: 'Hilgelo lake', de: 'Badesee Hilgelo'},
    text: {
      nl: 'Zo’n 36 hectare waterplas met strand en ruime lig- en speelweiden. Waterfietsen, kano’s, ligstoelen en parasols huurt u ter plekke, en er is een surfkluis.',
      en: 'Some 36 hectares of lake with a beach and generous lawns to play and sunbathe on. Pedalos, canoes, deckchairs and parasols are for hire on site, and there is a surf locker.',
      de: 'Rund 36 Hektar Badesee mit Strand und weiten Liege- und Spielwiesen. Tretboote, Kanus, Liegestühle und Sonnenschirme mieten Sie vor Ort, dazu gibt es ein Surfdepot.',
    },
  },
  {
    img: '/img/area-strandbad.webp',
    dist: {nl: 'Winterswijk', en: 'Winterswijk', de: 'Winterswijk'},
    title: {nl: 'Het Strandbad', en: 'The Strandbad open-air pool', de: 'Das Strandbad'},
    text: {
      nl: 'Een authentiek buitenbad uit de jaren dertig, in 2010 volledig gerestaureerd. Een aflopende ligweide naar het zandstrand, dus u houdt de kinderen goed in het oog, en een diep bassin met duiktoren voor de geoefende zwemmer.',
      en: 'An authentic 1930s open-air pool, fully restored in 2010. A lawn sloping down to the sandy beach so you keep an eye on the children, plus a deep basin with a diving tower for confident swimmers.',
      de: 'Ein authentisches Freibad aus den dreißiger Jahren, 2010 vollständig restauriert. Eine zum Sandstrand abfallende Liegewiese, sodass Sie die Kinder gut im Blick haben, und ein tiefes Becken mit Sprungturm für geübte Schwimmer.',
    },
  },
  {
    img: '/img/area-mondriaan.webp',
    dist: {nl: 'Centrum', en: 'Town centre', de: 'Zentrum'},
    title: {nl: 'Villa Mondriaan', en: 'Villa Mondriaan', de: 'Villa Mondriaan'},
    text: {
      nl: 'Museum over de jonge jaren van Piet Mondriaan. Hij werd wereldberoemd in Parijs en New York, maar zijn schilderscarrière begon hier in Winterswijk, waar hij van zijn achtste tot zijn twintigste woonde.',
      en: 'A museum about Piet Mondriaan’s early years. He became world famous in Paris and New York, but his career as a painter began here in Winterswijk, where he lived from the age of eight to twenty.',
      de: 'Ein Museum über die jungen Jahre von Piet Mondriaan. Weltberühmt wurde er in Paris und New York, doch seine Malerkarriere begann hier in Winterswijk, wo er vom achten bis zum zwanzigsten Lebensjahr wohnte.',
    },
  },
  {
    img: '/img/area-bredevoort.webp',
    dist: {nl: 'Bredevoort', en: 'Bredevoort', de: 'Bredevoort'},
    title: {nl: 'Boekenstad Bredevoort', en: 'Bredevoort, town of books', de: 'Bücherstadt Bredevoort'},
    text: {
      nl: 'Sinds 1993 de Nationale Boekenstad. In het historische centrum zitten meerdere antiquariaten en op de boekenmarkten struint u uren tussen de kraampjes.',
      en: 'The national town of books since 1993. Several antiquarian bookshops line the historic centre, and at the book markets you can browse the stalls for hours.',
      de: 'Seit 1993 die nationale Bücherstadt. Im historischen Zentrum sitzen mehrere Antiquariate, und auf den Büchermärkten stöbern Sie stundenlang zwischen den Ständen.',
    },
  },
  {
    dist: {nl: '± 200 meter', en: '± 200 metres', de: '± 200 Meter'},
    title: {nl: 'Trimbaan en speelbos', en: 'Trim trail and play forest', de: 'Trimmpfad und Spielwald'},
    text: {
      nl: 'Op zo’n 200 meter van de woningen op de Kattenberg, midden in het bos: een geheel vernieuwde trimbaan en een speelbos voor de kinderen.',
      en: 'About 200 metres from the homes on the Kattenberg, right in the woods: a completely renewed trim trail and a play forest for the children.',
      de: 'Rund 200 Meter von den Häusern auf dem Kattenberg, mitten im Wald: ein komplett erneuerter Trimmpfad und ein Spielwald für die Kinder.',
    },
  },
  {
    dist: {nl: '± 1 km', en: '± 1 km', de: '± 1 km'},
    title: {nl: 'Korenburgerveen', en: 'Korenburgerveen', de: 'Korenburgerveen'},
    text: {
      nl: 'Een kwetsbaar hoogveengebied vlak bij Winterswijk. Te ontdekken via de wandelroutes, of ga mee op excursie in het meest kwetsbare deel dat verder niet toegankelijk is.',
      en: 'A fragile raised bog just outside Winterswijk. Explore it on the walking routes, or join an excursion into the most delicate part, which is otherwise closed to visitors.',
      de: 'Ein empfindliches Hochmoor direkt bei Winterswijk. Auf den Wanderwegen zu entdecken, oder gehen Sie mit auf Exkursion in den empfindlichsten Teil, der sonst nicht zugänglich ist.',
    },
  },
  {
    dist: {nl: '± 1 km', en: '± 1 km', de: '± 1 km'},
    title: {nl: 'Meddoseveen', en: 'Meddoseveen', de: 'Meddoseveen'},
    text: {
      nl: 'Paarse heidepracht en uitgestrekt moerasveen. Kikkers springen voor u uit en vlinders fladderen om u heen als u dit bijzondere gebied doorkruist.',
      en: 'Purple heather and wide marshy peat. Frogs jump ahead of you and butterflies flutter around as you cross this remarkable landscape.',
      de: 'Violette Heidepracht und weites Moorgebiet. Frösche springen vor Ihnen auf und Schmetterlinge flattern um Sie herum, wenn Sie dieses besondere Gebiet durchqueren.',
    },
  },
  {
    dist: {nl: '± 3 km', en: '± 3 km', de: '± 3 km'},
    title: {nl: 'Markt en centrum Winterswijk', en: 'Winterswijk market and centre', de: 'Markt und Zentrum Winterswijk'},
    text: {
      nl: 'De gezelligheid van de markt combineert u prima met de vele winkels, of met een kop koffie, een lunch of een goede maaltijd op een van de terrassen.',
      en: 'The bustle of the market pairs nicely with the many shops, or with a coffee, a lunch or a proper meal on one of the terraces.',
      de: 'Die Gemütlichkeit des Marktes lässt sich gut mit den vielen Geschäften verbinden, oder mit einem Kaffee, einem Mittagessen oder einer guten Mahlzeit auf einer der Terrassen.',
    },
  },
  {
    dist: {nl: '± 3 km', en: '± 3 km', de: '± 3 km'},
    title: {nl: 'VVV Winterswijk', en: 'VVV tourist office', de: 'VVV Winterswijk'},
    text: {
      nl: 'Gevestigd in het raadhuis aan het Mevr. Kuipers Rietbergplein. Van mei tot en met september open van maandag tot en met zaterdag. Wij tippen u trouwens graag zelf ook.',
      en: 'In the town hall on the Mevr. Kuipers Rietbergplein, open Monday to Saturday from May through September. That said, we are happy to give you our own tips.',
      de: 'Im Rathaus am Mevr. Kuipers Rietbergplein, von Mai bis September montags bis samstags geöffnet. Wir geben Ihnen aber auch gerne selbst Tipps.',
    },
  },
];


/* ------------------------------------------------------------------ */
/*  Aemilius, Curaçao — photos                                         */
/*  Supplied by the client over WhatsApp (05-08-2026) and imported with
    scripts/import-curacao.mjs. Portrait and landscape are mixed, so the
    gallery uses Framed rather than a fixed crop.                       */
/* ------------------------------------------------------------------ */
const curacaoPhotos: {src: string; alt: Record<Lang, string>}[] = [
  {src: '/img/curacao-terrein.webp', alt: {nl: 'Het ommuurde terrein van Aemilius met de verblijven', en: 'The walled grounds of Aemilius with the stays', de: 'Das ummauerte Gelände von Aemilius mit den Unterkünften'}},
  {src: '/img/curacao-villa.webp', alt: {nl: 'De villa gezien vanaf het zwembad', en: 'The villa seen from the pool', de: 'Die Villa vom Pool aus gesehen'}},
  {src: '/img/curacao-zwembad-1.webp', alt: {nl: 'Het zwembad met het overdekte terras', en: 'The pool with the covered terrace', de: 'Der Pool mit der überdachten Terrasse'}},
  {src: '/img/curacao-zwembad-2.webp', alt: {nl: 'Het beach-style zwembad met geleidelijke inloop', en: 'The beach-style pool with its gradual entry', de: 'Der Beach-Style-Pool mit flachem Einstieg'}},
  {src: '/img/curacao-uitzicht.webp', alt: {nl: 'Uitzicht over Barber vanaf het zwembad, met de palapa', en: 'The view over Barber from the pool, with the palapa', de: 'Blick über Barber vom Pool aus, mit der Palapa'}},
  {src: '/img/curacao-zwembad-3.webp', alt: {nl: 'Het zwembad met ligbedden in de avondzon', en: 'The pool and loungers in the evening sun', de: 'Pool und Liegen in der Abendsonne'}},
  {src: '/img/curacao-woonkamer.webp', alt: {nl: 'De woonkamer van de villa onder de open houten kap', en: 'The villa living room under its open timber roof', de: 'Das Wohnzimmer der Villa unter dem offenen Holzdach'}},
  {src: '/img/curacao-keuken-studio.webp', alt: {nl: 'De eigen kitchenette van het kleinere verblijf', en: 'The kitchenette in the smaller stay', de: 'Die Kochnische der kleineren Unterkunft'}},
  {src: '/img/curacao-appartement.webp', alt: {nl: 'Het appartement met eigen badkamer en slaapkamer', en: 'The apartment with its own bathroom and bedroom', de: 'Das Apartment mit eigenem Bad und Schlafzimmer'}},
  {src: '/img/curacao-drempelvrij.webp', alt: {nl: 'Drempelvrije doorgang tussen de ruimtes', en: 'Step-free threshold between the rooms', de: 'Schwellenloser Übergang zwischen den Räumen'}},
  {src: '/img/curacao-zorgbed.webp', alt: {nl: 'Verstelbaar zorgbed met papegaai en een rolstoel', en: 'Adjustable care bed with lifting pole, and a wheelchair', de: 'Verstellbares Pflegebett mit Bettgalgen und ein Rollstuhl'}},
];

/* Pick a Curacao photo by its filename slug. The page pulls single photos out of the
   list above (hero, stay cards, the accessibility band) and the client drops photos
   from the set now and then — by index those picks silently shift to the wrong image. */
const cPhoto = (slug: string) => {
  const photo = curacaoPhotos.find((p) => p.src === `/img/curacao-${slug}.webp`);
  // Was a non-null assertion, which turned a renamed file into `undefined.alt`
  // deep inside a render. The prerender step runs every page, so throwing here
  // fails the build with the slug that no longer resolves.
  if (!photo) throw new Error(`cPhoto: no Curaçao photo for slug "${slug}"`);
  return photo;
};

/* Bedrooms and bathroom, second batch (07-08-2026, scripts/import-curacao-slaapkamers.mjs).
   Kept out of curacaoPhotos on purpose: the gallery above shows the grounds, while every
   shot here answers a booking question (how many beds, what view, can a baby come along),
   so they get their own section with a caption per photo instead of a bare alt text. This
   batch is also where the stay names came from — the villa is Fenya, the apartment Yeva. */
const curacaoRooms: {stay: 'fenya' | 'yeva'; src: string; cap: Record<Lang, string>}[] = [
  {
    stay: 'fenya', src: '/img/curacao-fenya-master.webp',
    cap: {
      nl: 'De master bedroom van villa Fenya, onder de open houten kap.',
      en: 'The master bedroom of villa Fenya, under its open timber roof.',
      de: 'Das Hauptschlafzimmer der Villa Fenya, unter dem offenen Holzdach.',
    },
  },
  {
    stay: 'fenya', src: '/img/curacao-fenya-kamer-2.webp',
    cap: {
      nl: 'De tweede slaapkamer, met een tweepersoonsbed.',
      en: 'The second bedroom, with a double bed.',
      de: 'Das zweite Schlafzimmer, mit Doppelbett.',
    },
  },
  {
    stay: 'fenya', src: '/img/curacao-fenya-kamer-3.webp',
    cap: {
      nl: 'De derde slaapkamer, ingericht met twee eenpersoonsbedden.',
      en: 'The third bedroom, laid out with two single beds.',
      de: 'Das dritte Schlafzimmer, eingerichtet mit zwei Einzelbetten.',
    },
  },
  {
    stay: 'yeva', src: '/img/curacao-yeva-slaapkamer.webp',
    cap: {
      nl: 'De slaapkamer van appartement Yeva, met een extra slaapbank langs de wand.',
      en: 'The bedroom of apartment Yeva, with an extra sofa bed along the wall.',
      de: 'Das Schlafzimmer des Apartments Yeva, mit zusätzlichem Schlafsofa an der Wand.',
    },
  },
  {
    stay: 'yeva', src: '/img/curacao-yeva-uitzicht.webp',
    cap: {
      nl: 'Wat Yeva bijzonder maakt: het brede raam met uitzicht over de groene heuvels.',
      en: 'What makes Yeva special: the wide window looking out over the green hills.',
      de: 'Was Yeva besonders macht: das breite Fenster mit Blick über die grünen Hügel.',
    },
  },
  {
    stay: 'yeva', src: '/img/curacao-yeva-gezin.webp',
    cap: {
      nl: 'Yeva kan worden ingericht voor gezinnen, ook met een baby: campingbedje en kinderstoel staan klaar.',
      en: 'Yeva can be set up for families, babies included: a travel cot and a high chair are ready.',
      de: 'Yeva lässt sich für Familien einrichten, auch mit Baby: Reisebett und Hochstuhl stehen bereit.',
    },
  },
  {
    stay: 'yeva', src: '/img/curacao-yeva-badkamer.webp',
    cap: {
      nl: 'De badkamer van Yeva, met inloopdouche, opklapbaar douchezitje en beugel.',
      en: 'The Yeva bathroom, with a walk-in shower, fold-down seat and grab rail.',
      de: 'Das Badezimmer von Yeva, mit begehbarer Dusche, Klappsitz und Haltegriff.',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Routing                                                            */
/* ------------------------------------------------------------------ *
   Real paths, not "/huis/..." fragments. A fragment never reaches the server,
   so a hash-routed page can only ever be prerendered as the landing page — and
   the whole point of the prerender step (scripts/prerender.mjs) is that every
   route ships as finished HTML that a crawler or an LLM can read without
   running the bundle. Navigation stays client-side: App installs one delegated
   click handler that turns same-origin "/..." links into history.pushState.  */
/* One URL per language, not one URL that swaps language in JavaScript. A crawler
   only ever sees the language it was served, so the Dutch and German copy — which
   is where the searches actually are ("vakantiehuis Winterswijk sauna",
   "Ferienhaus Winterswijk mit Sauna") — has to live at its own address to be
   indexable at all. English is the default and sits at the root; the other two are
   prefixed. The slug is translated too, since it is part of what gets matched. */
type PageKind = 'landing' | 'todo' | 'horses' | 'curacao' | 'home' | 'notFound';
type SluggedKind = 'todo' | 'horses' | 'curacao' | 'home';

const PAGE_SLUGS: Record<SluggedKind, Record<Lang, string>> = {
  todo: {en: 'things-to-do', nl: 'te-doen', de: 'umgebung'},
  horses: {en: 'horses', nl: 'paarden', de: 'pferde'},
  curacao: {en: 'curacao', nl: 'curacao', de: 'curacao'},
  /** Path segment in front of a home id: /huis/x, /en/homes/x, /de/haus/x. */
  home: {en: 'homes', nl: 'huis', de: 'haus'},
};

/** The default language owns the root; the rest are prefixed with their code.
    Derived rather than written out, so moving DEFAULT_LANG moves every URL. */
const PREFIXED_LANGS: Lang[] = LANGS.filter((l) => l !== DEFAULT_LANG);
const langPrefix = (lang: Lang) => (lang === DEFAULT_LANG ? '' : `/${lang}`);
/** hreflang values. Language-only: the site targets speakers, not countries. */
const HREFLANG: Record<Lang, string> = {en: 'en', nl: 'nl', de: 'de'};
const OG_LOCALE: Record<Lang, string> = {en: 'en_GB', nl: 'nl_NL', de: 'de_DE'};
/* x-default is the version for a searcher whose language the site does not
   speak. That is English, not the root: a French or Polish visitor gets further
   with the English pages than with the Dutch ones. */
const XDEFAULT_LANG: Lang = 'en';

export type Route = {lang: Lang; kind: PageKind; homeId?: string};

function parseRoute(path: string): Route {
  const segments = path.split('/').filter(Boolean).map(decodeURIComponent);
  let lang: Lang = DEFAULT_LANG;
  if (PREFIXED_LANGS.includes(segments[0] as Lang)) lang = segments.shift() as Lang;

  if (segments.length === 0) return {lang, kind: 'landing'};
  const [first, second, ...rest] = segments;
  if (rest.length) return {lang, kind: 'notFound'};

  if (first === PAGE_SLUGS.home[lang]) {
    const home = second ? homes.find((h) => h.id === second) : null;
    return home ? {lang, kind: 'home', homeId: home.id} : {lang, kind: 'notFound'};
  }
  if (second) return {lang, kind: 'notFound'};
  for (const kind of ['todo', 'horses', 'curacao'] as const) {
    if (first === PAGE_SLUGS[kind][lang]) return {lang, kind};
  }
  return {lang, kind: 'notFound'};
}

/** The address of a page in a given language — also what the language switcher
    links to, so switching language keeps you on the page you were reading. */
function pathFor(route: {kind: PageKind; homeId?: string}, lang: Lang): string {
  const prefix = langPrefix(lang);
  if (route.kind === 'home' && route.homeId) return `${prefix}/${PAGE_SLUGS.home[lang]}/${route.homeId}`;
  if (route.kind === 'todo' || route.kind === 'horses' || route.kind === 'curacao') {
    return `${prefix}/${PAGE_SLUGS[route.kind][lang]}`;
  }
  return prefix || '/';
}

const PRERENDERED_KINDS: PageKind[] = ['landing', 'todo', 'horses', 'curacao'];

/** Every route the build prerenders — 3 languages x 10 pages. Read by
    scripts/prerender.mjs. */
export const allRoutePaths = LANGS.flatMap((lang) => [
  ...PRERENDERED_KINDS.map((kind) => pathFor({kind}, lang)),
  ...homes.map((h) => pathFor({kind: 'home', homeId: h.id}, lang)),
]);

export type RouteMeta = {
  lang: Lang;
  htmlLang: string;
  ogLocale: string;
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  /** hreflang set for this page, including x-default. */
  alternates: {hreflang: string; href: string}[];
  jsonLd: string[];
};

const abs = (src: string) => `${SITE_URL}${src}`;

/** A search result shows roughly 155 characters, and a sentence cut mid-word
    reads as neglect. Trim to the last whole word instead. */
function clampDescription(text: string, limit = 165): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[.,;:-]$/, '')}…`;
}

/** Structured data for one home, so a listing page is more than prose to a bot. */
function homeJsonLd(home: Home, lang: Lang, canonical: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VacationRental',
    name: home.name,
    description: home.blurb[lang],
    url: canonical,
    inLanguage: lang,
    image: home.imgs.slice(0, 6).map(abs),
    petsAllowed: home.pets,
    ...(home.guests ? {occupancy: {'@type': 'QuantitativeValue', maxValue: home.guests, unitText: 'guests'}} : {}),
    ...(home.bedrooms ? {numberOfBedrooms: home.bedrooms} : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Winterswijk',
      addressRegion: 'Gelderland',
      addressCountry: 'NL',
    },
    containedInPlace: {'@type': 'Place', name: 'Winterswijk, Achterhoek'},
    amenityFeature: home.amenities
      .filter((a) => amenityDef[a])
      .map((a) => ({'@type': 'LocationFeatureSpecification', name: amenityDef[a].label[lang], value: true})),
  };
}

/** The business itself. Only on the three homepages — it used to sit in
    index.html, which put it on every page and always in English. */
function businessJsonLd(lang: Lang, canonical: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: SITE_NAME,
    description: t[lang].meta.description,
    url: canonical,
    inLanguage: lang,
    image: abs('/img/hero-park.webp'),
    telephone: PHONE,
    email: EMAIL,
    petsAllowed: true,
    availableLanguage: LANGS,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kattenbergweg 6',
      postalCode: '7101 BM',
      addressLocality: 'Winterswijk',
      addressRegion: 'Gelderland',
      addressCountry: 'NL',
    },
    amenityFeature: ['sauna', 'hottub', 'wifi', 'pets'].map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenityDef[a].label[lang],
      value: true,
    })),
    areaServed: {'@type': 'Place', name: 'Winterswijk, Achterhoek'},
  };
}

/** Where a page sits in the site, so a result shows a path rather than a bare
    URL. Every subpage hangs directly off the homepage; the homes are listed in
    a section of it rather than on a page of their own. */
function breadcrumbJsonLd(lang: Lang, leaf: {name: string; url: string}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {'@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE_URL}${pathFor({kind: 'landing'}, lang)}`},
      {'@type': 'ListItem', position: 2, name: leaf.name, item: leaf.url},
    ],
  };
}

/** Head tags for a prerendered route, in that route's own language. */
export function routeMetaFor(path: string): RouteMeta {
  const route = parseRoute(path);
  const {lang} = route;
  const L = t[lang];
  const canonical = `${SITE_URL}${pathFor(route, lang)}`;
  const home = route.homeId ? homes.find((h) => h.id === route.homeId) : null;

  // Every page announces all three of its language versions, plus x-default for
  // searchers whose language we do not have.
  const alternates = [
    ...LANGS.map((alt) => ({hreflang: HREFLANG[alt], href: `${SITE_URL}${pathFor(route, alt)}`})),
    {hreflang: 'x-default', href: `${SITE_URL}${pathFor(route, XDEFAULT_LANG)}`},
  ];
  const base = {lang, htmlLang: HREFLANG[lang], ogLocale: OG_LOCALE[lang], canonical, alternates};

  if (route.kind === 'notFound') {
    return {
      ...base,
      // A 404 is not a translation of anything and gets no canonical of its own.
      canonical: `${SITE_URL}${pathFor({kind: 'landing'}, lang)}`,
      alternates: [],
      title: `${L.notFound.title} | ${SITE_NAME}`,
      description: L.notFound.text,
      ogImage: abs('/img/hero-park.webp'),
      jsonLd: [],
    };
  }

  if (home) {
    return {
      ...base,
      title: `${home.name}, ${home.tagline[lang]} | ${SITE_NAME}`,
      description: clampDescription(home.blurb[lang]),
      ogImage: abs(home.imgs[0]),
      jsonLd: [
        JSON.stringify(homeJsonLd(home, lang, canonical)),
        JSON.stringify(breadcrumbJsonLd(lang, {name: home.name, url: canonical})),
      ],
    };
  }
  if (route.kind === 'todo') {
    return {
      ...base,
      title: L.meta.todoTitle,
      description: L.meta.todoDescription,
      ogImage: abs('/img/area-landscape.webp'),
      jsonLd: [JSON.stringify(breadcrumbJsonLd(lang, {name: L.nav.area, url: canonical}))],
    };
  }
  if (route.kind === 'horses') {
    return {
      ...base,
      title: L.meta.horsesTitle,
      description: L.meta.horsesDescription,
      ogImage: abs('/img/paarden-koets.webp'),
      jsonLd: [JSON.stringify(breadcrumbJsonLd(lang, {name: L.nav.horses, url: canonical}))],
    };
  }
  if (route.kind === 'curacao') {
    return {
      ...base,
      title: L.meta.curacaoTitle,
      description: L.meta.curacaoDescription,
      ogImage: abs('/img/curacao-uitzicht.webp'),
      jsonLd: [JSON.stringify(breadcrumbJsonLd(lang, {name: L.nav.curacao, url: canonical}))],
    };
  }
  return {
    ...base,
    title: L.meta.title,
    description: L.meta.description,
    ogImage: abs('/img/hero-park.webp'),
    jsonLd: [JSON.stringify(businessJsonLd(lang, canonical))],
  };
}

type ContactForm = {name: string; email: string; dates: string; guests: string; pets: string; kids: string; wheelchair: string; message: string};
const emptyForm: ContactForm = {name: '', email: '', dates: '', guests: '', pets: '', kids: '', wheelchair: '', message: ''};

function waMessage(lang: Lang, form: ContactForm, L: any, homeName?: string) {
  const intro = {
    nl: homeName ? `Hallo, ik heb interesse in ${homeName} in Winterswijk.` : 'Hallo, ik heb interesse in een vakantiehuis in Winterswijk.',
    en: homeName ? `Hello, I am interested in ${homeName} in Winterswijk.` : 'Hello, I am interested in a vacation home in Winterswijk.',
    de: homeName ? `Hallo, ich interessiere mich für ${homeName} in Winterswijk.` : 'Hallo, ich interessiere mich für ein Ferienhaus in Winterswijk.',
  }[lang];
  const body = [
    intro,
    form.name && `${L.contact.name}: ${form.name}`,
    form.dates && `${L.contact.dates}: ${form.dates}`,
    form.guests && `${L.contact.guests}: ${form.guests}`,
    form.pets && `${L.contact.pets} ${form.pets}`,
    form.kids && `${L.contact.kids} ${form.kids}`,
    form.wheelchair && `${L.contact.wheelchair} ${form.wheelchair}`,
    form.message && `${L.contact.message}: ${form.message}`,
  ].filter(Boolean).join('\n');
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(body)}`;
}

/* ================================================================== */
export default function App({initialPath}: {initialPath?: string}) {
  const [path, setPath] = useState(
    () => initialPath ?? (typeof window === 'undefined' ? '/' : window.location.pathname),
  );
  /* The language is read off the URL rather than held in state: /nl/huis/... is
     the Dutch page, full stop. That also removes the old localStorage restore,
     which could only ever disagree with the prerendered markup it hydrated. */
  const route = parseRoute(path);
  const {lang} = route;
  const firstRender = useRef(true);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  /* Client-side navigation across the prerendered routes. One delegated handler
     turns same-origin "/..." links into history.pushState; modifier clicks,
     target="_blank", downloads and in-page "#anchor" links fall through to the
     browser untouched. */
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('/')) return;
      if (anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;

      const url = new URL(href, window.location.origin);
      event.preventDefault();
      window.history.pushState({}, '', url.pathname + url.hash);
      if (url.pathname === path) {
        // Same page, e.g. "/#contact" tapped from the landing page itself.
        const el = url.hash ? document.getElementById(url.hash.slice(1)) : null;
        if (el) el.scrollIntoView();
        else window.scrollTo(0, 0);
        return;
      }
      setPath(url.pathname);
    };
    const onPop = () => setPath(window.location.pathname);

    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPop);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onPop);
    };
  }, [path]);

  /* Links shared while the site still routed on "#/huis/..." keep working. The
     old fragments were language-less, so they land on the English page. */
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith('#/')) return;
    // Those fragments used the Dutch slug set (/huis/, /te-doen, /paarden),
    // which is exactly what sits at the root now.
    const target = parseRoute(hash.slice(1));
    const next = pathFor(target, target.lang);
    window.history.replaceState({}, '', next);
    setPath(next);
  }, []);

  const activeHome = route.homeId ? homes.find((h) => h.id === route.homeId) : null;

  /* Deep links like /#area only work once React has rendered the section — the
     browser's own anchor jump happens before mount and silently does nothing.
     Any other route change starts at the top of the new page. */
  useEffect(() => {
    const wasFirstRender = firstRender.current;
    firstRender.current = false;
    const id = window.location.hash.slice(1);
    const el = id && !id.startsWith('/') ? document.getElementById(id) : null;
    if (el) {
      el.scrollIntoView();
      return;
    }
    if (!wasFirstRender) window.scrollTo(0, 0);
  }, [path]);

  const L = t[lang];

  return (
    <div className="min-h-screen">
      <Header route={route} lang={lang} L={L} onDetail={route.kind !== 'landing'} />
      {activeHome ? (
        <HomeDetail home={activeHome} lang={lang} L={L} />
      ) : route.kind === 'todo' ? (
        <TodoPage lang={lang} L={L} />
      ) : route.kind === 'horses' ? (
        <HorsesPage lang={lang} L={L} />
      ) : route.kind === 'curacao' ? (
        <CuracaoPage lang={lang} L={L} />
      ) : route.kind === 'notFound' ? (
        <NotFoundPage lang={lang} L={L} />
      ) : (
        <Landing lang={lang} L={L} />
      )}
      <Footer route={route} lang={lang} L={L} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
function Header({route, lang, L, onDetail}: {route: Route; lang: Lang; L: any; onDetail: boolean}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const home = pathFor({kind: 'landing'}, lang);
  // On a detail page, nav links must first return to the landing page, then jump to the section.
  const prefix = onDetail ? home : '';
  const nav = [
    {href: `${prefix}#homes`, label: L.nav.homes},
    // "In de buurt", "Paarden" and "Curaçao" are pages of their own, so routes rather than anchors.
    {href: pathFor({kind: 'todo'}, lang), label: L.nav.area},
    {href: pathFor({kind: 'horses'}, lang), label: L.nav.horses},
    {href: pathFor({kind: 'curacao'}, lang), label: L.nav.curacao},
    // Availability is switched off for now — see CALENDARS OFF in Landing().
    // {href: `${prefix}#availability`, label: L.nav.availability},
    {href: `${prefix}#about`, label: L.nav.about},
    {href: `${prefix}#contact`, label: L.nav.contact},
  ];
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-brand-cream/90 backdrop-blur border-b border-brand-sand">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Below sm the wordmark is shortened so it cannot collide with the language switcher */}
        <a href={onDetail ? home : '#top'} className="flex items-center gap-2 sm:gap-2.5 font-serif text-lg sm:text-xl text-brand-green-dark leading-tight">
          <Photo src="/img/logo.webp" alt="" hidden eager sizes="40px" className="h-8 sm:h-9 w-auto" />
          Winterswijk<span className="hidden sm:inline"><span className="text-brand-sun">.</span>Vakantiehuis</span>
        </a>
        {/* Seven items now that Curaçao has its own page — tighter gaps so the row still
            fits between the wordmark and the language switcher at the md breakpoint. */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-5 text-sm font-medium text-stone-700">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-brand-green transition-colors">{n.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {/* Links, not buttons: each language is a real URL, and switching keeps
              you on the page you were reading. A crawler follows these too, which
              is how the Dutch and German versions get discovered at all. */}
          <div className="flex items-center gap-1 text-xs">
            {LANGS.map((l) => (
              <a
                key={l}
                href={pathFor(route, l)}
                hrefLang={HREFLANG[l]}
                aria-current={lang === l ? 'true' : undefined}
                className={`px-1.5 py-0.5 rounded uppercase tracking-wide transition-colors ${lang === l ? 'text-brand-green font-semibold' : 'text-stone-400 hover:text-stone-600'}`}
              >{l}</a>
            ))}
          </div>
          <button className="md:hidden text-brand-green-dark" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="md:hidden border-t border-brand-sand bg-brand-cream px-5 py-3 flex flex-col gap-3 text-sm font-medium">
          {nav.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)} className="py-1 text-stone-700">{n.label}</a>
          ))}
        </nav>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
function Landing({lang, L}: {lang: Lang; L: any}) {
  const [form, setForm] = useState<ContactForm>(emptyForm);
  const waLink = useMemo(() => waMessage(lang, form, L), [form, lang, L]);
  const lakeHomes = homes.filter((h) => h.area === 'lake');
  const forestHomes = homes.filter((h) => h.area === 'forest');

  return (
    <>
      {/* Hero */}
      <section id="top" className="relative pt-16">
        <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
          {/* Real drone photo of Den Möllenhof. object-position keeps the houses + lake in frame
              on narrow screens, where a wide aerial would otherwise crop to empty field. */}
          <Photo
            src="/img/hero-park.webp" alt={L.area.parkTitle} eager sizes="100vw"
            className="absolute inset-0 w-full h-full object-cover object-[42%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-brand-dark/35 to-brand-dark/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/60 via-transparent to-transparent" />
          <div className="relative max-w-6xl mx-auto px-5 h-full flex flex-col justify-center text-white">
            <span className="inline-flex items-center gap-2 text-sm font-medium mb-4 text-brand-cream/90">
              <MapPin size={16} className="text-brand-sun" /> {L.hero.kicker}
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl max-w-2xl leading-[1.05]">{L.hero.title}</h1>
            <p className="mt-5 max-w-xl text-base sm:text-lg text-brand-cream/90 font-light">{L.hero.sub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#homes" className="inline-flex items-center gap-2 bg-brand-sun hover:bg-brand-sun/90 text-white px-6 py-3 rounded-full font-medium transition-colors">
                {L.hero.ctaHomes} <ChevronRight size={18} />
              </a>
              {/* CALENDARS OFF — the "check availability" button pointed at the
                  #availability band, which is commented out below. Outline, not a
                  frosted fill: next to the call button two grey glass pills read as
                  one muddy pair.
              <a href="#availability" className="inline-flex items-center gap-2 bg-transparent hover:bg-white/15 text-white border-2 border-white/80 px-6 py-3 rounded-full font-medium transition-colors">
                {L.hero.ctaAvail}
              </a>
              */}
            </div>
            {/* Desktop only: on mobile the floating WhatsApp/call pair already sits over the hero,
                so repeating the buttons here would duplicate them. */}
            <div className="mt-4 hidden md:flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                <MessageCircle size={18} /> {L.contact.wa}
              </a>
              <a
                href={`tel:${PHONE}`}
                className="inline-flex items-center gap-2 bg-white hover:bg-brand-cream text-brand-green-dark px-6 py-3 rounded-full font-medium transition-colors"
              >
                <Phone size={18} /> {L.contact.callShort} {PHONE_DISPLAY}
              </a>
            </div>
          </div>
          <span className="absolute bottom-4 right-4 hidden sm:inline-flex items-center gap-1.5 text-xs text-white/80 bg-brand-dark/40 backdrop-blur px-3 py-1.5 rounded-full">
            <MapPin size={12} /> {L.area.parkTitle}
          </span>
        </div>
      </section>

      {/* Personal tips band — replaces the old seasonal-styling band. */}
      <section className="bg-brand-green text-brand-cream">
        <div className="max-w-6xl mx-auto px-5 py-12 flex flex-col md:flex-row md:items-center gap-6">
          <div className="shrink-0 md:max-w-xs">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-brand-sun">
              <Sparkles size={16} /> {L.tips.kicker}
            </span>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl leading-snug">{L.tips.title}</h2>
          </div>
          <div className="md:border-l md:border-white/20 md:pl-8">
            <p className="text-brand-cream/85 font-light">{L.tips.text}</p>
            <a href={pathFor({kind: 'todo'}, lang)} className="mt-5 inline-flex items-center gap-2 bg-brand-sun hover:bg-brand-sun/90 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors">
              {L.tips.cta} <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Homes */}
      <section id="homes" className="max-w-6xl mx-auto px-5 py-20">
        <SectionHead title={L.homes.title} sub={L.homes.sub} />

        {/* Split into the two settings so the difference the client asked for is unmissable:
            the Jonkersweg homes sit by the lake, the Kattenberg homes in the woods. */}
        <HomeGroup
          icon={Waves} title={L.homes.groupLake} text={L.homes.groupLakeText}
          list={lakeHomes} lang={lang} L={L}
        />
        <HomeGroup
          icon={TreePine} title={L.homes.groupForest} text={L.homes.groupForestText}
          list={forestHomes} lang={lang} L={L}
        />

        {/* Curaçao teaser — replaces the old "more locations coming" placeholder now that
            Aemilius is open. Deliberately compact: the full story lives on /curacao. */}
        <a
          href={pathFor({kind: 'curacao'}, lang)}
          className="group mt-10 grid md:grid-cols-[1.25fr_1fr] gap-6 items-stretch rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
        >
          <div className="bg-brand-sand/60 rounded-3xl p-8 flex flex-col justify-center">
            <span className="inline-flex items-center gap-2 text-brand-sun font-medium text-sm"><Palmtree size={16} /> {L.homes.curacaoKicker}</span>
            <h3 className="mt-2 font-serif text-2xl text-brand-green-dark leading-snug">{L.homes.curacaoTitle}</h3>
            <p className="mt-3 text-stone-700 max-w-lg text-sm">{L.homes.curacaoText}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-brand-green font-medium text-sm group-hover:gap-3 transition-all">
              {L.homes.curacaoCta} <ChevronRight size={16} />
            </span>
          </div>
          {/* The client's own photo of the grounds. The Aemilius logo lives on the sub page
              header instead — a wide banner mark does not survive this crop. */}
          <div className="rounded-3xl overflow-hidden min-h-[280px] relative">
            {/* Portrait shot in a landscape frame: object-position pulls the crop up to the
                houses, otherwise the card fills with the gravel in the foreground. */}
            <Photo
              src="/img/curacao-terrein.webp" alt="Aemilius, Curaçao" sizes="(min-width: 768px) 460px, 100vw"
              className="absolute inset-0 w-full h-full object-cover object-[center_35%] transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        </a>
        <p className="mt-4 text-sm text-stone-500">{L.homes.manage} <a href="#contact" className="text-brand-green font-medium hover:underline">{L.nav.contact}</a></p>
      </section>

      {/* The only wheelchair accessible holiday home in Winterswijk — the client asked for
          this to be prominent, so it gets a full-width band of its own rather than a bullet. */}
      <AccessBand lang={lang} L={L} />

      {/* CALENDARS OFF — the live huurkalender.nl overview of every home at once.
          Hidden for now at the client's request; uncomment this band (and the
          hero button and nav entry that point at #availability) to bring the
          live availability back. The AvailabilityOverview component and the
          HK_* constants it needs are all still in this file.
      <section id="availability" className="bg-brand-cream border-y border-brand-sand">
        <div className="max-w-6xl mx-auto px-5 py-20">
          <SectionHead title={L.avail.title} sub={L.avail.text} />
          <AvailabilityOverview lang={lang} L={L} />
          <p className="mt-4 text-center text-sm text-stone-500">{L.avail.note}</p>
        </div>
      </section>
      */}

      {/* Area */}
      <section id="area" className="max-w-6xl mx-auto px-5 py-20">
        <SectionHead title={L.area.title} sub={L.area.sub} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {L.area.items.map((it: any, i: number) => {
            const Icon = iconMap[it.icon];
            return (
              <div key={i} className="bg-white rounded-2xl border border-brand-sand p-6 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 font-serif text-xl text-brand-green-dark">{it.title}</h3>
                <p className="mt-2 text-sm text-stone-600">{it.text}</p>
              </div>
            );
          })}
        </div>

        {/* Events teaser — the client wanted nearby events surfaced (they were thinking banners).
            Three concrete, dated entries here; the full agenda lives on the /te-doen page. */}
        <div className="mt-12 bg-white rounded-3xl border border-brand-sand p-7 sm:p-9">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 text-brand-sun font-medium text-sm"><Calendar size={16} /> {L.area.eventsTitle}</span>
              <p className="mt-2 text-stone-600 max-w-xl text-sm">{L.area.eventsSub}</p>
            </div>
            <a href={pathFor({kind: 'todo'}, lang)} className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors">
              {L.area.allButton} <ChevronRight size={16} />
            </a>
          </div>
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {events.slice(0, 3).map((e) => (
              <div key={e.title.nl} className="bg-brand-cream rounded-2xl p-5">
                <span className="text-xs font-medium text-brand-sun uppercase tracking-wide">{e.when[lang]}</span>
                <h4 className="mt-1.5 font-serif text-lg text-brand-green-dark leading-snug">{e.title[lang]}</h4>
                <p className="mt-1.5 text-sm text-stone-600">{e.text[lang]}</p>
              </div>
            ))}
          </div>
        </div>

        <FlamingoAlert lang={lang} L={L} waLink={waLink} />

        {/* Nature gallery — the owner's photos are a mix of portrait and landscape, so each one
            gets the full frame (Framed) instead of being cropped to a fixed card height. */}
        <div className="mt-14">
          <SectionHead title={L.area.natureTitle} sub={L.area.natureSub} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {naturePhotos.map((p) => <NatureCard key={p.src} p={p} lang={lang} L={L} hover />)}
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6 items-center bg-brand-green-dark text-brand-cream rounded-3xl overflow-hidden">
          <div className="p-8">
            <span className="inline-flex items-center gap-2 text-brand-sun font-medium text-sm"><Bike size={18} /> {L.area.bikeTitle}</span>
            <p className="mt-3 text-brand-cream/85 font-light">{L.area.bikeText}</p>
            <a href="#contact" className="mt-5 inline-flex items-center gap-2 bg-brand-sun hover:bg-brand-sun/90 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors">
              {L.area.bikeButton} <ChevronRight size={16} />
            </a>
          </div>
          <Photo src="/img/area-bikes.webp" alt={L.area.bikeTitle} sizes="(min-width: 768px) 576px, 100vw" className="h-full w-full object-cover min-h-[220px]" />
        </div>
      </section>

      {/* Horses — the owners also run the stables on Den Möllenhof, where three of our homes are. */}
      <section id="horses" className="bg-brand-green-dark text-brand-cream">
        <div className="max-w-6xl mx-auto px-5 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-brand-sun font-medium text-sm">
              <Sparkles size={16} /> {L.horses.kicker}
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl">{L.horses.title}</h2>
            <p className="mt-4 text-brand-cream/85 font-light">{L.horses.teaser}</p>
            <a href={pathFor({kind: 'horses'}, lang)} className="mt-6 inline-flex items-center gap-2 bg-brand-sun hover:bg-brand-sun/90 text-white px-6 py-3 rounded-full font-medium transition-colors">
              {L.horses.cta} <ChevronRight size={18} />
            </a>
          </div>
          <a href={pathFor({kind: 'horses'}, lang)} className="group relative block rounded-3xl overflow-hidden">
            <Photo
              src="/img/paarden-koets.webp" alt={L.horses.title} sizes="(min-width: 768px) 576px, 100vw"
              className="w-full h-72 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 bg-brand-dark/70 backdrop-blur text-white text-xs font-medium px-3 py-1.5 rounded-full">
              <Play size={12} fill="currentColor" /> {L.horses.videoPlay}
            </span>
          </a>
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-brand-sand/50">
        <div className="max-w-6xl mx-auto px-5 py-20 grid md:grid-cols-2 gap-12 items-center">
          <Framed src="/img/jonkersweg-1.webp" alt={L.about.title} className="rounded-3xl h-80 shadow-sm" />
          <div>
            <SectionHead title={L.about.title} sub={L.about.text} align="left" />
            <ul className="mt-6 space-y-3">
              {[L.about.point1, L.about.point2, L.about.point3, L.about.point4].map((p: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-stone-700">
                  <Star size={18} className="text-brand-sun shrink-0 mt-0.5" /> {p}
                </li>
              ))}
            </ul>
            {/* Trust figures taken from the owner's own site. Their "100% pet friendly" is
                dropped to "5 of 9": per Marie (05-08) all three Jonkersweg homes take dogs,
                two of the four kattenberg6 homes do, and the XL and the chalet take none. */}
            <div className="mt-7 grid grid-cols-3 gap-4">
              {L.about.stats.map((s: {value: string; label: string}) => (
                <div key={s.label} className="bg-white rounded-2xl border border-brand-sand px-4 py-4 text-center">
                  <div className="font-serif text-2xl sm:text-3xl text-brand-green">{s.value}</div>
                  <div className="mt-0.5 text-xs text-stone-500 leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactSection lang={lang} L={L} form={form} setForm={setForm} />

      <FloatingContact L={L} waLink={waLink} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Wheelchair-accessible highlight. Per the owner (viewing 31-07) the geschakelde
    8-persoons on the Kattenberg is the only wheelchair accessible holiday home in
    Winterswijk — worth its own band, and the photo is the actual adapted bathroom
    so the claim is backed by what a guest can see.                              */
function AccessBand({lang, L}: {lang: Lang; L: any}) {
  return (
    <section id="rolstoel" className="bg-brand-green-dark text-brand-cream">
      <div className="max-w-6xl mx-auto px-5 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 bg-brand-sun text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            <Accessibility size={14} /> {L.access.kicker}
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl leading-tight">{L.access.title}</h2>
          <p className="mt-4 text-brand-cream/85 font-light">{L.access.text}</p>
          <ul className="mt-6 space-y-2.5">
            {L.access.points.map((pt: string) => (
              <li key={pt} className="flex items-start gap-3 text-brand-cream/90 text-sm">
                <Check size={17} className="text-brand-sun shrink-0 mt-0.5" /> {pt}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={pathFor({kind: 'home', homeId: 'kattenberg8'}, lang)} className="inline-flex items-center gap-2 bg-brand-sun hover:bg-brand-sun/90 text-white px-6 py-3 rounded-full font-medium transition-colors">
              {L.access.cta} <ChevronRight size={18} />
            </a>
            <a
              href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-brand-cream text-brand-green-dark px-6 py-3 rounded-full font-medium transition-colors"
            >
              <MessageCircle size={18} /> {L.access.contact}
            </a>
          </div>
        </div>
        <figure>
          <Photo
            src="/img/kattenberg8-9.webp" alt={L.access.photoCaption} sizes="(min-width: 768px) 576px, 100vw"
            className="rounded-3xl w-full h-72 md:h-96 object-cover"
          />
          <figcaption className="mt-2.5 text-xs text-brand-cream/60">{L.access.photoCaption}</figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Click-to-load YouTube. Only the poster image loads with the page; the iframe
    (and all of YouTube's scripts) is mounted on click, so this costs nothing on
    first paint — same rule as the rest of the media on this site.               */
function YouTubeEmbed({id, title, playLabel}: {id: string; title: string; playLabel: string}) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    return (
      <iframe
        title={title}
        className="w-full aspect-video rounded-3xl border-0"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return (
    <button
      type="button" onClick={() => setPlaying(true)} aria-label={playLabel}
      className="group relative w-full aspect-video rounded-3xl overflow-hidden bg-brand-dark"
    >
      <img
        loading="lazy" decoding="async" src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt={title}
        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="w-16 h-16 rounded-full bg-brand-sun/95 group-hover:bg-brand-sun flex items-center justify-center shadow-lg transition-colors">
          <Play size={26} className="text-white translate-x-0.5" fill="currentColor" />
        </span>
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  huurkalender.nl embeds — see the HK_* constants at the top of the file
    for what we can and cannot control inside a cross-origin calendar.        */

const HK_LOCALE: Record<Lang, string> = {nl: 'nl-NL', en: 'en-GB', de: 'de-DE'};

/** First of the month, `offset` months from now. */
function monthFromNow(offset: number) {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + offset, 1);
}
const hkDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
const hkMonth = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

/** Live width of an element — decides how many month columns we may ask for. */
function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width));
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

/** Week rows their grid draws for a month (weeks start on Monday). */
function weeksInMonth(d: Date) {
  const firstWeekday = (new Date(d.getFullYear(), d.getMonth(), 1).getDay() + 6) % 7;
  const days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return Math.ceil((firstWeekday + days) / 7);
}

/** Height of `months` month blocks laid out `cols` across, exactly as their
    float grid stacks them: each row is as tall as its tallest month. Asking for
    a whole number of rows also parks their LEGENDA box on a row of its own,
    just past the bottom edge of what we show. */
function hkGridHeight(first: Date, months: number, cols: number) {
  let total = 0;
  for (let row = 0; row * cols < months; row++) {
    let tallest = 0;
    for (let c = 0; c < cols && row * cols + c < months; c++) {
      const m = new Date(first.getFullYear(), first.getMonth() + row * cols + c, 1);
      tallest = Math.max(tallest, HK_MONTH_BASE + weeksInMonth(m) * HK_WEEK_ROW);
    }
    total += tallest + (row === 0 ? 0 : HK_MONTH_GAP);
  }
  return total + 12;
}

/** Their own height, straight from huurkalender.js. The frame is opened at
    HK_PROBE_H so the number they post is the content's and not ours; the
    largest value seen wins, because a narrow layout re-measures once its fonts
    have settled and posts a second, taller figure. Resets whenever `src`
    changes, so month navigation re-measures instead of reusing a stale height.
    `calId` picks this frame's messages out on pages carrying more than one. */
function useHkHeight(src: string, calId: number) {
  const [docHeight, setDocHeight] = useState(0);
  useEffect(() => setDocHeight(0), [src]);
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!/(^|\.)huurkalender\.nl$/.test(new URL(e.origin).hostname)) return;
      let msg: any;
      try {
        msg = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (!msg || Number(msg.cal_id) !== calId) return;
      const h = Number(msg.docHeight);
      // Ignore an echo of the probe height — that is our number, not theirs.
      if (!Number.isFinite(h) || h <= HK_PROBE_H) return;
      setDocHeight((prev) => Math.max(prev, h));
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [calId, src]);
  return docHeight;
}

/** The frame itself: their page pulled up by `cropTop` so its toolbar sits
    above the clip, tinted into our palette, and cut off where their content
    ends. Height comes from their own message where we have it, and from
    `fallbackHeight` until (or unless) that arrives. */
function HuurkalenderFrame({
  src, title, calId, bottomChrome, frameWidth, containerWidth, cropTop, fallbackHeight, maxHeight,
  filter = HK_FILTER, L,
}: {
  src: string; title: string; calId: number; bottomChrome: number;
  frameWidth: number; containerWidth: number; cropTop: number;
  fallbackHeight: number; maxHeight?: number; filter?: string; L: any;
}) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(false), [src]);
  const docHeight = useHkHeight(src, calId);

  const measured = docHeight > 0;
  const contentHeight = measured
    ? Math.max(120, docHeight - cropTop - bottomChrome - HK_SAFETY)
    : fallbackHeight;
  // Until they report, the frame stays short on purpose: a tall frame would be
  // fed back to us as its own height and the crop would never settle.
  const frameHeight = measured ? docHeight : HK_PROBE_H;

  const visibleH = maxHeight ? Math.min(contentHeight, maxHeight) : contentHeight;
  const fits = frameWidth <= containerWidth;

  return (
    <div className="relative">
      <div style={{overflowX: fits ? 'hidden' : 'auto', overflowY: 'hidden'}}>
        <div
          className="relative"
          style={{
            width: frameWidth, height: visibleH, overflow: 'hidden',
            marginInline: fits ? 'auto' : 0,
            transition: 'height 200ms ease',
          }}
        >
          <iframe
            src={src} title={title} loading="lazy" scrolling="no" onLoad={() => setLoaded(true)}
            style={{
              width: frameWidth, height: frameHeight, border: 0, display: 'block',
              marginTop: -cropTop, filter, colorScheme: 'light',
            }}
          />
        </div>
      </div>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/85 text-sm text-stone-500 gap-2">
          <Calendar size={16} className="text-brand-green/60" /> {L.hk.loading}
        </div>
      )}
    </div>
  );
}

/** Our legend, in the site's language — theirs is cropped off. Swatches are the
    huurkalender colours as they come out the other side of HK_FILTER. */
function HkLegend({L, className = ''}: {L: any; className?: string}) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-600 ${className}`}>
      <span className="inline-flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-[3px] bg-[#83c47f] border border-black/5" /> {L.hk.free}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-[3px] bg-[#d29a90] border border-black/5" /> {L.hk.booked}
      </span>
    </div>
  );
}

/** All homes at once, on the landing page. Their overview always renders twelve
    months and a full month of day columns, so it gets a peek height with an
    expander, and scrolls sideways where the day grid does not fit. */
function AvailabilityOverview({lang, L}: {lang: Lang; L: any}) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [open, setOpen] = useState(false);
  const src = `${HK_BASE}/vacancy/all/overview-${HK_ACCOUNT}.html?m=1&start=${hkMonth(monthFromNow(0))}`
    + `&lang=${HK_LANG[lang]}&vertical=0&type=iframe`;

  return (
    <div ref={ref} className="mt-10 bg-white rounded-3xl border border-brand-sand shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-7 py-4 border-b border-brand-sand bg-brand-cream/60">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-brand-green-dark">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full bg-brand-green/60 animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-brand-green" />
          </span>
          {L.hk.live}
        </span>
        <HkLegend L={L} />
      </div>

      <div className="relative">
        {width > 0 && (
          <HuurkalenderFrame
            src={src} title={L.avail.title} calId={HK_ACCOUNT} bottomChrome={HK_BOTTOM_OVERVIEW}
            frameWidth={HK_OVERVIEW_W} containerWidth={width}
            cropTop={HK_CROP_OVERVIEW} fallbackHeight={HK_OVERVIEW_FULL}
            maxHeight={open ? undefined : HK_OVERVIEW_PEEK} filter={HK_FILTER_OVERVIEW} L={L}
          />
        )}
        {!open && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-7 py-4 border-t border-brand-sand">
        <button
          type="button" onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
        >
          <Calendar size={16} /> {open ? L.hk.collapse : L.hk.expand}
        </button>
        {width > 0 && width < HK_OVERVIEW_W && <span className="text-xs text-stone-500">{L.hk.swipe}</span>}
      </div>
    </div>
  );
}

/** One home's calendar. Column count follows the space we have: their month
    blocks are a fixed ~330px, and we ask for exactly two rows of them so their
    LEGENDA box always lands on a row of its own and can be cropped away.      */
function HomeAvailability({home, lang, L}: {home: Home; lang: Lang; L: any}) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [offset, setOffset] = useState(0);

  const narrow = width > 0 && width < HK_COL * 2;
  const cols = narrow ? 1 : Math.max(1, Math.min(3, Math.floor(width / HK_COL)));
  const months = cols * 2;
  const frameWidth = narrow ? HK_COL : Math.floor(width);
  const cropTop = narrow ? HK_CROP_HOME_NARROW : HK_CROP_HOME_WIDE;

  const from = monthFromNow(offset);
  const to = monthFromNow(offset + months - 1);
  const label = (d: Date) => d.toLocaleDateString(HK_LOCALE[lang], {month: 'long', year: 'numeric'});
  const src = `${HK_BASE}/vacancy/calendar-${home.calId}.html?type=iframe`
    + `&lang=${HK_LANG[lang]}&m=${months}&start=${hkDay(from)}`;

  return (
    <div ref={ref} className="bg-white rounded-3xl border border-brand-sand shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-7 py-4 border-b border-brand-sand bg-brand-cream/60">
        <div>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-brand-green-dark">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-brand-green/60 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-brand-green" />
            </span>
            {L.hk.live}
          </span>
          <p className="mt-1 text-xs text-stone-500 first-letter:uppercase">{label(from)} tot {label(to)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button" onClick={() => setOffset((o) => Math.max(0, o - months))} disabled={offset === 0}
            aria-label={L.hk.prev}
            className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-brand-sand text-brand-green-dark hover:bg-brand-sand disabled:opacity-35 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft size={17} />
          </button>
          <button
            type="button" onClick={() => setOffset((o) => Math.min(24, o + months))} disabled={offset >= 24}
            aria-label={L.hk.next}
            className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-brand-sand text-brand-green-dark hover:bg-brand-sand disabled:opacity-35 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      {width > 0 && (
        <div className="pt-4">
          <HuurkalenderFrame
            src={src} title={`${L.detail.availTitle}: ${home.name}`} calId={home.calId!}
            bottomChrome={HK_BOTTOM_HOME} frameWidth={frameWidth}
            containerWidth={width} cropTop={cropTop} fallbackHeight={hkGridHeight(from, months, cols)} L={L}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-7 py-4 border-t border-brand-sand">
        <HkLegend L={L} />
        <a
          href={`${HK_BASE}/vacancy/calendar-${home.calId}.html`} target="_blank" rel="noopener noreferrer"
          className="text-xs text-stone-500 hover:text-brand-green underline underline-offset-2"
        >
          {L.hk.openTab}
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Always-reachable WhatsApp + call pair. Side by side across the bottom on
    mobile, stacked bottom-right on desktop, so booking is never more than one
    tap away on any page.                                                     */
function FloatingContact({L, waLink}: {L: any; waLink: string}) {
  return (
    <div className="fixed z-40 bottom-4 inset-x-4 md:inset-x-auto md:right-6 md:bottom-6 flex gap-3 md:flex-col md:items-end">
      <a
        href={waLink} target="_blank" rel="noopener noreferrer"
        className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-5 py-3 rounded-full font-medium shadow-lg transition-colors"
      >
        <MessageCircle size={18} /> {L.contact.wa}
      </a>
      <a
        href={`tel:${PHONE}`}
        className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-brand-sun hover:bg-brand-sun/90 text-white px-5 py-3 rounded-full font-medium shadow-lg transition-colors"
      >
        <Phone size={18} /> {L.contact.callShort}
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function HomeDetail({home, lang, L}: {home: Home; lang: Lang; L: any}) {
  const [active, setActive] = useState(0);
  const waLink = waMessage(lang, emptyForm, L, home.name);

  return (
    <main className="pt-16">
      <div className="max-w-6xl mx-auto px-5 pt-8">
        <a href={pathFor({kind: 'landing'}, lang)} className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-brand-green transition-colors">
          <ChevronLeft size={16} /> {L.detail.back}
        </a>
      </div>

      {/* Title */}
      <div className="max-w-6xl mx-auto px-5 mt-4">
        <h1 className="font-serif text-3xl sm:text-5xl text-brand-green-dark">{home.name}</h1>
        <p className="mt-2 text-brand-sun font-medium">{home.tagline[lang]}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-stone-600">
          <span className="inline-flex items-center gap-1.5"><MapPin size={15} className="text-brand-green" /> {home.location ?? 'Winterswijk, Achterhoek'}</span>
          {home.guests
            ? <span className="inline-flex items-center gap-1.5"><Users size={15} className="text-brand-green" /> {home.guests} {L.homes.guests}</span>
            : <span className="inline-flex items-center gap-1.5"><Users size={15} className="text-brand-green" /> {L.homes.capacityAsk}</span>}
          {home.bedrooms && <span className="inline-flex items-center gap-1.5"><BedDouble size={15} className="text-brand-green" /> {home.bedrooms} {L.homes.bedrooms}</span>}
        </div>
      </div>

      {/* Gallery */}
      <div className="max-w-6xl mx-auto px-5 mt-8">
        <Framed src={home.imgs[active]} alt={home.name} eager className="rounded-3xl aspect-[3/2]" />
        <div className={`mt-3 grid gap-3 ${home.imgs.length > 4 ? 'grid-cols-4 sm:grid-cols-5' : 'grid-cols-3'}`}>
          {home.imgs.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-2xl overflow-hidden aspect-[3/2] border-2 transition-colors ${active === i ? 'border-brand-green' : 'border-transparent opacity-80 hover:opacity-100'}`}
            >
              <Photo src={src} alt={`${home.name} ${i + 1}`} sizes="(min-width: 640px) 220px, 30vw" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-5 mt-12 grid md:grid-cols-[1.6fr_1fr] gap-10">
        <div>
          {home.accessible && (
            <div className="mb-8 bg-brand-green-dark text-brand-cream rounded-3xl p-6">
              <span className="inline-flex items-center gap-2 bg-brand-sun text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                <Accessibility size={14} /> {L.access.kicker}
              </span>
              <h3 className="mt-3 font-serif text-xl sm:text-2xl leading-snug">{L.access.title}</h3>
              <ul className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-2">
                {L.access.points.map((pt: string) => (
                  <li key={pt} className="flex items-start gap-2.5 text-sm text-brand-cream/90">
                    <Check size={16} className="text-brand-sun shrink-0 mt-0.5" /> {pt}
                  </li>
                ))}
              </ul>
              <a
                href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 bg-brand-sun hover:bg-brand-sun/90 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
              >
                <MessageCircle size={16} /> {L.access.contact}
              </a>
            </div>
          )}
          <h2 className="font-serif text-2xl text-brand-green-dark">{L.detail.overview}</h2>
          <p className="mt-3 text-stone-700 leading-relaxed">{home.long[lang]}</p>

          <h2 className="font-serif text-2xl text-brand-green-dark mt-10">{L.detail.amenities}</h2>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {home.amenities.map((a) => {
              const def = amenityDef[a];
              if (!def) return null;
              const Icon = def.icon;
              return (
                <div key={a} className="flex items-center gap-3 bg-white border border-brand-sand rounded-xl px-4 py-3 text-sm text-stone-700">
                  <Icon size={18} className="text-brand-green shrink-0" /> {def.label[lang]}
                </div>
              );
            })}
          </div>
          {/* Only set where the dog rule needs spelling out — see petsNote on the Home type. */}
          {home.petsNote && (
            <p className="mt-3 flex items-start gap-2.5 text-sm text-stone-600">
              <PawPrint size={16} className="text-brand-green shrink-0 mt-0.5" /> {home.petsNote.long[lang]}
            </p>
          )}

          <div className="mt-10 bg-brand-sand/50 rounded-3xl p-6">
            <h3 className="font-serif text-xl text-brand-green-dark inline-flex items-center gap-2"><Trees size={18} className="text-brand-green" /> {L.detail.nearby}</h3>
            <p className="mt-2 text-stone-700 text-sm">{L.detail.nearbyText}</p>
          </div>

          {/* Only the Den Möllenhof homes: the stables are on that same park. */}
          {home.area === 'lake' && (
            <a href={pathFor({kind: 'horses'}, lang)} className="mt-4 block bg-brand-green-dark text-brand-cream rounded-3xl p-6 hover:bg-brand-green transition-colors">
              <h3 className="font-serif text-xl inline-flex items-center gap-2"><Sparkles size={18} className="text-brand-sun" /> {L.horses.kicker}</h3>
              <p className="mt-2 text-brand-cream/85 text-sm">{L.horses.teaser}</p>
              <span className="mt-3 inline-flex items-center gap-2 text-brand-sun text-sm font-medium">{L.horses.cta} <ChevronRight size={16} /></span>
            </a>
          )}
        </div>

        {/* Booking sidebar */}
        <aside className="md:sticky md:top-24 self-start">
          <div className="bg-white border border-brand-sand rounded-3xl p-6 shadow-sm">
            <h3 className="font-serif text-xl text-brand-green-dark">{L.detail.availTitle}</h3>
            {/* CALENDARS OFF — availText reads "below is this home's live calendar",
                which is only true with the calendar section switched on, so every
                home falls back to the "ask us for the dates" copy for now. */}
            <p className="mt-2 text-sm text-stone-600">{L.hk.soonText}</p>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-5 py-3 rounded-full font-medium transition-colors">
              <Send size={17} /> {L.detail.bookWa}
            </a>
            {/* CALENDARS OFF — "to the calendar" jumped to #house-availability (or
                out to huurkalender.nl for a home without an id). Both are back the
                moment the calendar section below is uncommented.
            {home.calId ? (
              <a href="#house-availability" className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-brand-cream hover:bg-brand-sand text-brand-green-dark px-5 py-3 rounded-full font-medium transition-colors border border-brand-sand">
                <Calendar size={17} /> {L.detail.calendar}
              </a>
            ) : (
              <a href={HUURKALENDER} target="_blank" rel="noopener noreferrer" className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-brand-cream hover:bg-brand-sand text-brand-green-dark px-5 py-3 rounded-full font-medium transition-colors border border-brand-sand">
                <Calendar size={17} /> {L.detail.calendar}
              </a>
            )}
            */}
            {/* Was gated on home.calId; with the calendars off it holds for every home. */}
            <p className="mt-3 text-xs text-stone-500 text-center">{L.detail.note}</p>
            <div className="mt-5 pt-4 border-t border-brand-sand flex flex-col gap-2 text-sm">
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-stone-700 hover:text-brand-green">
                <MessageCircle size={16} className="text-brand-sun" /> {L.contact.wa} {PHONE_DISPLAY}
              </a>
              <a href={`tel:${PHONE}`} className="flex items-center gap-2 text-stone-700 hover:text-brand-green">
                <Phone size={16} className="text-brand-sun" /> {L.contact.call} {PHONE_DISPLAY}
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 text-stone-700 hover:text-brand-green">
                <Mail size={16} className="text-brand-sun" /> {EMAIL}
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* CALENDARS OFF — this home's live calendar, hidden for now at the client's
          request. Full width rather than in the sidebar: their month blocks are a
          fixed ~330px, so a narrow column would have shown one month at a time with
          a lot of dead space next to it. Uncomment together with the sidebar button
          above; HomeAvailability is still in this file.
      <section id="house-availability" className="max-w-6xl mx-auto px-5 mt-14 scroll-mt-24">
        <h2 className="font-serif text-2xl sm:text-3xl text-brand-green-dark">{L.detail.availTitle}</h2>
        <p className="mt-2 text-stone-600 max-w-2xl">{home.calId ? L.detail.availText : L.hk.soonText}</p>
        <div className="mt-6">
          {home.calId ? (
            <HomeAvailability home={home} lang={lang} L={L} />
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-brand-green/25 bg-white p-10 text-center">
              <Calendar size={34} className="mx-auto text-brand-green/45" />
              <h3 className="mt-3 font-serif text-lg text-brand-green-dark">{L.hk.soonTitle}</h3>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors">
                <Send size={16} /> {L.detail.bookWa}
              </a>
            </div>
          )}
        </div>
      </section>
      */}

      {/* Other homes */}
      <section className="max-w-6xl mx-auto px-5 mt-16 mb-4">
        <h2 className="font-serif text-2xl text-brand-green-dark">{L.homes.title}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          {homes.filter((h) => h.id !== home.id).slice(0, 4).map((h) => (
            <a key={h.id} href={pathFor({kind: 'home', homeId: h.id}, lang)} className="group bg-white rounded-2xl overflow-hidden border border-brand-sand hover:shadow-md transition-shadow">
              <div className="h-32 overflow-hidden">
                <Photo src={h.imgs[0]} alt={h.name} sizes="(min-width: 640px) 270px, 90vw" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-3">
                <h3 className="font-serif text-base text-brand-green-dark">{h.name}</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {h.guests ? `${h.guests} ${L.homes.guests}${h.bedrooms ? ` · ${h.bedrooms} ${L.homes.bedrooms}` : ''}` : L.homes.capacityAsk}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <FloatingContact L={L} waLink={waLink} />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  "Te doen in de buurt" as its own page — the client wanted nearby events and
    bike-rental instructions surfaced properly, not just a banner.            */
function TodoPage({lang, L}: {lang: Lang; L: any}) {
  const waLink = waMessage(lang, emptyForm, L);

  return (
    <main className="pt-16">
      <div className="bg-brand-green text-brand-cream">
        <div className="max-w-6xl mx-auto px-5 pt-8 pb-14">
          <a href={pathFor({kind: 'landing'}, lang)} className="inline-flex items-center gap-1.5 text-sm text-brand-cream/70 hover:text-white transition-colors">
            <ChevronLeft size={16} /> {L.todo.backHome}
          </a>
          <span className="mt-6 flex items-center gap-2 text-sm font-medium text-brand-sun">
            <MapPin size={16} /> {L.todo.kicker}
          </span>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl max-w-3xl leading-tight">{L.todo.title}</h1>
          <p className="mt-4 max-w-2xl text-brand-cream/85 font-light">{L.todo.intro}</p>
        </div>
      </div>

      {/* What there is to do */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {L.area.items.map((it: any, i: number) => {
            const Icon = iconMap[it.icon];
            return (
              <div key={i} className="bg-white rounded-2xl border border-brand-sand p-6">
                <div className="w-11 h-11 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 font-serif text-xl text-brand-green-dark">{it.title}</h3>
                <p className="mt-2 text-sm text-stone-600">{it.text}</p>
              </div>
            );
          })}
        </div>

        {/* Full agenda */}
        <div className="mt-16">
          <SectionHead title={L.area.eventsTitle} sub={L.area.eventsSub} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {events.map((e) => (
              <div key={e.title.nl} className="bg-white rounded-2xl border border-brand-sand p-5 flex flex-col">
                <span className="text-xs font-medium text-brand-sun uppercase tracking-wide">{e.when[lang]}</span>
                <h4 className="mt-1.5 font-serif text-lg text-brand-green-dark leading-snug">{e.title[lang]}</h4>
                <p className="mt-1.5 text-sm text-stone-600 flex-1">{e.text[lang]}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-stone-400 text-center">{L.area.eventsNote}</p>
        </div>

        {/* What sits within reach of the homes — from the facilities page of the Kattenberg. */}
        <div className="mt-16">
          <SectionHead title={L.area.nearbyTitle} sub={L.area.nearbySub} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {nearbyPlaces.map((n) => (
              <div key={n.title.nl} className="bg-white rounded-2xl border border-brand-sand overflow-hidden flex flex-col">
                {n.img && (
                  <div className="h-40 overflow-hidden">
                    <Photo src={n.img} alt={n.title[lang]} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5 flex-1">
                  <span className="text-xs font-medium text-brand-sun uppercase tracking-wide">{n.dist[lang]}</span>
                  <h4 className="mt-1.5 font-serif text-lg text-brand-green-dark leading-snug">{n.title[lang]}</h4>
                  <p className="mt-1.5 text-sm text-stone-600">{n.text[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bike rental, with concrete places */}
        <div className="mt-16 grid md:grid-cols-[1fr_1.1fr] gap-6 items-stretch">
          <div className="bg-brand-green-dark text-brand-cream rounded-3xl p-8 flex flex-col justify-center">
            <span className="inline-flex items-center gap-2 text-brand-sun font-medium text-sm"><Bike size={18} /> {L.area.bikeTitle}</span>
            <p className="mt-3 text-brand-cream/85 font-light">{L.area.bikeText}</p>
            <a href="#contact" className="mt-5 inline-flex items-center gap-2 bg-brand-sun hover:bg-brand-sun/90 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors self-start">
              {L.area.bikeButton} <ChevronRight size={16} />
            </a>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {bikeRentals.map((b) => (
              <a
                key={b.name} href={b.url} target="_blank" rel="noopener noreferrer"
                className="bg-white rounded-2xl border border-brand-sand p-5 hover:shadow-md transition-shadow flex flex-col"
              >
                <h4 className="font-serif text-lg text-brand-green-dark">{b.name}</h4>
                <p className="mt-1.5 text-sm text-stone-600 flex-1">{b.what[lang]}</p>
                <span className="mt-3 text-xs text-brand-green break-all">{b.contact}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Nature */}
        <div className="mt-16">
          <FlamingoAlert lang={lang} L={L} waLink={waLink} />
          <div className="mt-14">
            <SectionHead title={L.area.natureTitle} sub={L.area.natureSub} />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {naturePhotos.map((p) => <NatureCard key={p.src} p={p} lang={lang} L={L} />)}
          </div>
        </div>

        {/* Ask us */}
        <div id="contact" className="mt-16 bg-brand-sand/60 rounded-3xl p-8 sm:p-10 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-brand-green-dark">{L.todo.ctaTitle}</h2>
          <p className="mt-3 text-stone-700 max-w-xl mx-auto">{L.todo.ctaText}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 rounded-full font-medium transition-colors">
              <MessageCircle size={18} /> {L.contact.wa} {PHONE_DISPLAY}
            </a>
            <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 bg-brand-sun hover:bg-brand-sun/90 text-white px-6 py-3 rounded-full font-medium transition-colors">
              <Phone size={18} /> {L.contact.call}
            </a>
          </div>
        </div>
      </section>

      <FloatingContact L={L} waLink={waLink} />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  "Vakantie met uw paard" — the owners also run the stables on recreatiepark
    Den Möllenhof, where three of our homes stand. Content and both photos come
    from their own denmollenhof.nl/nl/paarden page. Stabling rates left off on
    purpose: the client asked for no prices on the site.                       */
function HorsesPage({lang, L}: {lang: Lang; L: any}) {
  const waLink = waMessage(lang, emptyForm, L);

  return (
    <main className="pt-16">
      <div className="bg-brand-green-dark text-brand-cream">
        <div className="max-w-6xl mx-auto px-5 pt-8 pb-14">
          <a href={pathFor({kind: 'landing'}, lang)} className="inline-flex items-center gap-1.5 text-sm text-brand-cream/70 hover:text-white transition-colors">
            <ChevronLeft size={16} /> {L.horses.back}
          </a>
          <span className="mt-6 flex items-center gap-2 text-sm font-medium text-brand-sun">
            <Sparkles size={16} /> {L.horses.kicker}
          </span>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl max-w-3xl leading-tight">{L.horses.title}</h1>
          <p className="mt-4 max-w-2xl text-brand-cream/85 font-light">{L.horses.intro}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 -mt-8">
        <Photo
          src="/img/paarden-koets.webp" alt={L.horses.kicker} eager sizes={WIDE_SIZES}
          className="rounded-3xl w-full h-64 sm:h-96 object-cover shadow-sm"
        />
      </div>

      <section className="max-w-6xl mx-auto px-5 py-16">
        {/* Their own film, embedded from denmollenhof.nl/nl/paarden. Click-to-load, so the
            page still paints without pulling in YouTube's player. */}
        <div className="grid md:grid-cols-[1fr_1.1fr] gap-8 items-center mb-16">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-brand-green-dark">{L.horses.videoTitle}</h2>
            <p className="mt-3 text-stone-700">{L.horses.videoText}</p>
          </div>
          <YouTubeEmbed id={HORSES_VIDEO} title={L.horses.videoTitle} playLabel={L.horses.videoPlay} />
        </div>

        {/* Stabling & care */}
        <SectionHead title={L.horses.facTitle} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {L.horses.facilities.map((f: {title: string; text: string}) => (
            <div key={f.title} className="bg-white rounded-2xl border border-brand-sand p-6">
              <div className="w-11 h-11 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                <Check size={20} />
              </div>
              <h3 className="mt-4 font-serif text-xl text-brand-green-dark leading-snug">{f.title}</h3>
              <p className="mt-2 text-sm text-stone-600">{f.text}</p>
            </div>
          ))}
        </div>

        {/* Riding + the village */}
        <div className="mt-14 grid md:grid-cols-2 gap-6">
          <div className="bg-brand-sand/50 rounded-3xl p-8">
            <h3 className="font-serif text-2xl text-brand-green-dark inline-flex items-center gap-2">
              <Trees size={20} className="text-brand-green" /> {L.horses.ridingTitle}
            </h3>
            <p className="mt-3 text-stone-700">{L.horses.ridingText}</p>
          </div>
          <div className="bg-brand-sand/50 rounded-3xl p-8">
            <h3 className="font-serif text-2xl text-brand-green-dark inline-flex items-center gap-2">
              <Calendar size={20} className="text-brand-green" /> {L.horses.eventsTitle}
            </h3>
            <p className="mt-3 text-stone-700">{L.horses.eventsText}</p>
          </div>
        </div>

        {/* KNHS label + house rules */}
        <div className="mt-6 grid md:grid-cols-[auto_1fr] gap-6 items-center bg-white rounded-3xl border border-brand-sand p-8">
          <Photo
            src="/img/paarden-knhs.webp" alt={L.horses.knhsTitle} sizes="200px"
            className="h-40 w-auto mx-auto rounded-xl border border-brand-sand"
          />
          <div>
            <h3 className="font-serif text-2xl text-brand-green-dark">{L.horses.knhsTitle}</h3>
            <p className="mt-2 text-stone-600">{L.horses.knhsText}</p>
            <h4 className="mt-5 font-serif text-lg text-brand-green-dark">{L.horses.rulesTitle}</h4>
            <p className="mt-1.5 text-sm text-stone-600">{L.horses.rulesText}</p>
          </div>
        </div>

        {/* Homes on the same park */}
        <div className="mt-14">
          <h3 className="font-serif text-2xl text-brand-green-dark">{L.homes.groupLake}</h3>
          <p className="mt-1.5 text-stone-600 text-sm max-w-2xl">{L.homes.groupLakeText}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-7">
            {homes.filter((h) => h.area === 'lake').map((h) => <HomeCard key={h.id} home={h} lang={lang} L={L} />)}
          </div>
        </div>

        {/* Ask us */}
        <div id="contact" className="mt-16 bg-brand-sand/60 rounded-3xl p-8 sm:p-10 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-brand-green-dark">{L.horses.ctaTitle}</h2>
          <p className="mt-3 text-stone-700 max-w-xl mx-auto">{L.horses.ctaText}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 rounded-full font-medium transition-colors">
              <MessageCircle size={18} /> {L.contact.wa} {PHONE_DISPLAY}
            </a>
            <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 bg-brand-sun hover:bg-brand-sun/90 text-white px-6 py-3 rounded-full font-medium transition-colors">
              <Phone size={18} /> {L.contact.call}
            </a>
          </div>
        </div>
      </section>

      <FloatingContact L={L} waLink={waLink} />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Aemilius on Curaçao — the owners' second address. Copy and photos were supplied
    by the client on 05-08-2026; the Dutch text is the source, en/de are translations.
    Same no-prices rule as the rest of the site: availability is asked, not listed.  */
function CuracaoPage({lang, L}: {lang: Lang; L: any}) {
  const waLink = useMemo(() => {
    const intro = {
      nl: 'Hallo, ik heb interesse in Aemilius op Curaçao.',
      en: 'Hello, I am interested in Aemilius on Curaçao.',
      de: 'Hallo, ich interessiere mich für Aemilius auf Curaçao.',
    }[lang];
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(intro)}`;
  }, [lang]);

  const facIcons = [Waves, Umbrella, ShieldCheck, Accessibility];

  return (
    <main className="pt-16">
      <div className="bg-brand-green-dark text-brand-cream">
        <div className="max-w-6xl mx-auto px-5 pt-8 pb-14">
          <a href={pathFor({kind: 'landing'}, lang)} className="inline-flex items-center gap-1.5 text-sm text-brand-cream/70 hover:text-white transition-colors">
            <ChevronLeft size={16} /> {L.curacao.back}
          </a>
          <div className="mt-6 flex flex-col-reverse gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="flex items-center gap-2 text-sm font-medium text-brand-sun">
                <Palmtree size={16} /> {L.curacao.kicker}
              </span>
              <h1 className="mt-2 font-serif text-3xl sm:text-5xl max-w-2xl leading-tight">{L.curacao.title}</h1>
              <p className="mt-4 max-w-2xl text-brand-cream/85 font-light">{L.curacao.intro}</p>
            </div>
            {/* The Aemilius logo on its own cream plaque. We tried cutting it out to a
                transparent PNG so it sat straight on the green, but the subtitle line and
                the hairline rule are dark neutrals — recoloured for the green they went
                thin and washed out (05-08-2026 feedback). Keeping the designer's cream
                ground keeps the artwork intact; import-curacao-logo.mjs crops the
                screenshot to the mark and pads it evenly, so this is just the image with
                rounded corners. Sized by width: it is a wide banner and height-
                constraining it makes the subtitle unreadable. */}
            <Photo
              src="/img/curacao-logo.webp" alt="Aemilius, appartementen en villa verhuur Curaçao" eager sizes="(min-width: 640px) 384px, 288px"
              className="w-72 sm:w-96 h-auto self-start shrink-0 rounded-2xl shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 -mt-8">
        <Photo
          src="/img/curacao-uitzicht.webp" alt={cPhoto('uitzicht').alt[lang]} eager sizes={WIDE_SIZES}
          className="rounded-3xl w-full h-64 sm:h-96 object-cover shadow-sm"
        />
      </div>

      <section className="max-w-6xl mx-auto px-5 py-16">
        {/* The three stays */}
        <SectionHead title={L.curacao.staysTitle} sub={L.curacao.staysSub} />
        <div className="grid md:grid-cols-3 gap-7 mt-10">
          {L.curacao.stays.map((s: {name: string; sub: string; points: string[]}, i: number) => (
            <div key={s.name} className="bg-white rounded-3xl border border-brand-sand overflow-hidden flex flex-col">
              <Framed
                src={[cPhoto('villa'), cPhoto('appartement'), cPhoto('keuken-studio')][i].src}
                alt={s.name}
                className="h-52"
              />
              <div className="p-6 flex flex-col grow">
                <h3 className="font-serif text-xl text-brand-green-dark leading-snug">{s.name}</h3>
                <p className="mt-1.5 text-sm text-stone-600">{s.sub}</p>
                <ul className="mt-4 space-y-2 text-sm text-stone-700">
                  {s.points.map((p: string) => (
                    <li key={p} className="flex gap-2">
                      <Check size={16} className="text-brand-green shrink-0 mt-0.5" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Bedrooms, grouped per stay. "How do we all sleep?" is the first question a
            family asks, and the client's captions answer it per room, so each photo
            carries its caption instead of hiding it in an alt attribute. The studio has
            no bedroom photos yet, so it simply has no group here. */}
        <div className="mt-16">
          <SectionHead title={L.curacao.roomsTitle} sub={L.curacao.roomsSub} />
          {([['fenya', L.curacao.roomsFenya], ['yeva', L.curacao.roomsYeva]] as const).map(([stay, heading], gi) => (
            <div key={stay} className={gi === 0 ? 'mt-10' : 'mt-12'}>
              <h3 className="font-serif text-2xl text-brand-green-dark">{heading}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {curacaoRooms.filter((r) => r.stay === stay).map((r) => (
                  <figure key={r.src} className="bg-white rounded-2xl border border-brand-sand overflow-hidden flex flex-col">
                    <Framed src={r.src} alt={r.cap[lang]} className="h-64" />
                    <figcaption className="p-4 text-sm text-stone-600 grow">{r.cap[lang]}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Amenities */}
        <div className="mt-16">
          <SectionHead title={L.curacao.facTitle} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {L.curacao.facilities.map((f: {title: string; text: string}, i: number) => {
              const Icon = facIcons[i] ?? Check;
              return (
                <div key={f.title} className="bg-white rounded-2xl border border-brand-sand p-6">
                  <div className="w-11 h-11 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 font-serif text-xl text-brand-green-dark leading-snug">{f.title}</h3>
                  <p className="mt-2 text-sm text-stone-600">{f.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accessibility — the same point that earns the Kattenberg home its own band on
            the landing page, so it gets a band here rather than a bullet. */}
        <div className="mt-14 grid md:grid-cols-[1.3fr_1fr] gap-6 items-stretch">
          <div className="bg-brand-green text-brand-cream rounded-3xl p-8 sm:p-10 flex flex-col justify-center">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-brand-sun">
              <Accessibility size={16} /> {L.homes.badgeAccessible}
            </span>
            <h3 className="mt-2 font-serif text-2xl sm:text-3xl leading-snug">{L.curacao.careTitle}</h3>
            <p className="mt-3 text-brand-cream/85 font-light">{L.curacao.careText}</p>
          </div>
          <Framed src={cPhoto('zorgbed').src} alt={cPhoto('zorgbed').alt[lang]} className="rounded-3xl min-h-[240px]" />
        </div>

        {/* Setting + beaches */}
        <div className="mt-14 grid md:grid-cols-2 gap-6">
          <div className="bg-brand-sand/50 rounded-3xl p-8">
            <h3 className="font-serif text-2xl text-brand-green-dark inline-flex items-center gap-2">
              <MapPin size={20} className="text-brand-green" /> {L.curacao.locTitle}
            </h3>
            <p className="mt-3 text-stone-700">{L.curacao.locText}</p>
          </div>
          <div className="bg-brand-sand/50 rounded-3xl p-8">
            <h3 className="font-serif text-2xl text-brand-green-dark inline-flex items-center gap-2">
              <Waves size={20} className="text-brand-green" /> {L.curacao.beachesTitle}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {L.curacao.beaches.map((b: string) => (
                <li key={b} className="bg-white border border-brand-sand rounded-full px-4 py-1.5 text-sm text-stone-700">{b}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Why Aemilius */}
        <div className="mt-6 bg-white rounded-3xl border border-brand-sand p-8 sm:p-10">
          <h3 className="font-serif text-2xl text-brand-green-dark">{L.curacao.whyTitle}</h3>
          <ul className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
            {L.curacao.why.map((w: string) => (
              <li key={w} className="flex gap-2 text-stone-700">
                <Check size={18} className="text-brand-green shrink-0 mt-0.5" /> {w}
              </li>
            ))}
          </ul>
        </div>

        {/* Gallery — Framed, because the client's photos mix portrait and landscape. */}
        <div className="mt-16">
          <SectionHead title={L.curacao.galleryTitle} sub={L.curacao.gallerySub} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {curacaoPhotos.map((p) => (
              <Framed key={p.src} src={p.src} alt={p.alt[lang]} className="rounded-2xl h-64" />
            ))}
          </div>
        </div>

        {/* Ask us */}
        <div id="contact" className="mt-16 bg-brand-sand/60 rounded-3xl p-8 sm:p-10 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-brand-green-dark">{L.curacao.ctaTitle}</h2>
          <p className="mt-3 text-stone-700 max-w-xl mx-auto">{L.curacao.ctaText}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 rounded-full font-medium transition-colors">
              <MessageCircle size={18} /> {L.contact.wa} {PHONE_DISPLAY}
            </a>
            <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 bg-brand-sun hover:bg-brand-sun/90 text-white px-6 py-3 rounded-full font-medium transition-colors">
              <Phone size={18} /> {L.contact.call}
            </a>
          </div>
        </div>
      </section>

      <FloatingContact L={L} waLink={waLink} />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  The form used to open WhatsApp with a prefilled message. It now posts to
    the shared @jiw/cloudflare-forms endpoint in worker/index.ts: the enquiry
    lands as e-mail with JIW and the guest gets a confirmation in the language
    they filled the form in. The WhatsApp and call buttons all over the site are
    untouched — only the form changed.                                        */
const FORM_ENDPOINT = '/api/forms/contact';
/* Read by the forms package to pick the confirmation e-mail's language; see
   CONFIRMATION_LOCALE_FIELD in @jiw/cloudflare-forms (worker-side only, so the
   name is repeated here rather than imported into the browser bundle). */
const CONFIRMATION_LOCALE_FIELD = '__jiw_confirmation_locale';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ContactSection({lang, L, form, setForm}: {lang: Lang; L: any; form: ContactForm; setForm: (f: ContactForm) => void}) {
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  /* Validated here as well as in the worker: the worker answers in Dutch, and a
     guest reading the site in English or German should not be handed a message
     in a language they did not pick. */
  const localError = () => {
    if (!form.name.trim()) return L.contact.errName;
    if (!EMAIL_PATTERN.test(form.email.trim())) return L.contact.errEmail;
    if (!form.message.trim()) return L.contact.errMessage;
    return '';
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const invalid = localError();
    if (invalid) {
      setState('error');
      setError(invalid);
      return;
    }

    setState('sending');
    setError('');
    const data = new FormData(event.currentTarget);
    // One "Naam" field on screen, first name + surname on the worker's side.
    const [firstName, ...rest] = form.name.trim().split(/\s+/);
    data.delete('name');
    data.set('firstName', firstName);
    data.set('lastName', rest.join(' '));
    data.set('pageUrl', window.location.href);

    try {
      const response = await fetch(FORM_ENDPOINT, {method: 'POST', body: data});
      const result = (await response.json().catch(() => ({}))) as {ok?: boolean; message?: string};
      if (!response.ok || !result.ok) throw new Error(result.message || L.contact.errorText);
      setForm(emptyForm);
      setState('success');
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : L.contact.errorText);
    }
  };

  return (
    <section id="contact" className="max-w-6xl mx-auto px-5 py-20">
      <SectionHead title={L.contact.title} sub={L.contact.sub} />
      <div className="grid md:grid-cols-2 gap-10 mt-10">
        {state === 'success' ? (
          <div className="bg-white rounded-3xl border border-brand-sand p-7 flex flex-col justify-center text-center">
            <span className="mx-auto w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
              <Check size={24} />
            </span>
            <h3 className="mt-4 font-serif text-2xl text-brand-green-dark">{L.contact.sentTitle}</h3>
            <p className="mt-2 text-stone-600">{L.contact.sentText}</p>
          </div>
        ) : (
        <form onSubmit={submit} className="bg-white rounded-3xl border border-brand-sand p-7 space-y-4">
          {/* Bots fill everything; guests never see this one, so anything that
              arrives with it set is dropped by the worker without a trace. */}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <input type="hidden" name="lang" value={lang} />
          <input type="hidden" name={CONFIRMATION_LOCALE_FIELD} value={lang} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field name="name" required label={L.contact.name} value={form.name} ph={L.contact.placeholder.name} onChange={(v) => setForm({...form, name: v})} />
            <Field name="email" required type="email" label={L.contact.email} value={form.email} ph={L.contact.placeholder.email} onChange={(v) => setForm({...form, email: v})} />
            <Field name="dates" label={L.contact.dates} value={form.dates} ph={L.contact.placeholder.dates} onChange={(v) => setForm({...form, dates: v})} />
            <Field name="guests" label={L.contact.guests} value={form.guests} ph={L.contact.placeholder.guests} onChange={(v) => setForm({...form, guests: v})} />
            {/* The owners asked to know up front whether guests bring pets (and which) and children. */}
            <Field name="pets" label={L.contact.pets} value={form.pets} ph={L.contact.placeholder.pets} onChange={(v) => setForm({...form, pets: v})} />
            <Field name="kids" label={L.contact.kids} value={form.kids} ph={L.contact.placeholder.kids} onChange={(v) => setForm({...form, kids: v})} />
            {/* The 8-persoons is the only wheelchair accessible home in Winterswijk, so the
                owners want to know up front whether a guest needs it. */}
            <Field name="wheelchair" label={L.contact.wheelchair} value={form.wheelchair} ph={L.contact.placeholder.wheelchair} onChange={(v) => setForm({...form, wheelchair: v})} />
          </div>
          <div>
            <label htmlFor="contact-message" className="text-sm font-medium text-stone-600">
              {L.contact.message} <span className="text-brand-sun">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              value={form.message}
              onChange={(e) => setForm({...form, message: e.target.value})}
              placeholder={L.contact.placeholder.message}
              rows={4}
              className="mt-1 w-full rounded-xl border border-brand-sand bg-brand-cream/50 px-4 py-2.5 text-sm outline-none focus:border-brand-green"
            />
          </div>
          {state === 'error' && (
            <p role="alert" className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <span className="font-medium">{L.contact.errorTitle}</span> {error}
            </p>
          )}
          <button
            type="submit"
            disabled={state === 'sending'}
            className="w-full inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-dark disabled:opacity-60 text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            <Send size={17} /> {state === 'sending' ? L.contact.sending : L.contact.send}
          </button>
          <p className="text-xs text-stone-500 text-center">{L.contact.privacy}</p>
        </form>
        )}

        <div className="flex flex-col gap-4">
          <div className="bg-brand-green text-brand-cream rounded-3xl p-7 flex-1 flex flex-col justify-center gap-4">
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white">
              <MessageCircle size={20} className="text-brand-sun" />
              <span>{L.contact.wa} <span className="font-medium">{PHONE_DISPLAY}</span></span>
            </a>
            <a href={`tel:${PHONE}`} className="flex items-center gap-3 hover:text-white">
              <Phone size={20} className="text-brand-sun" />
              <span>{L.contact.call} <span className="font-medium">{PHONE_DISPLAY}</span></span>
            </a>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 hover:text-white">
              <Mail size={20} className="text-brand-sun" /> {EMAIL}
            </a>
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-brand-sun" /> Winterswijk, Achterhoek
            </div>
          </div>
          <iframe
            title="Winterswijk"
            className="rounded-3xl w-full h-56 border border-brand-sand"
            loading="lazy"
            src="https://www.openstreetmap.org/export/embed.html?bbox=6.6%2C51.94%2C6.83%2C52.02&layer=mapnik&marker=51.97%2C6.72"
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function Footer({route, lang, L}: {route: Route; lang: Lang; L: any}) {
  return (
    <footer className="bg-brand-dark text-brand-cream/70">
      <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <Photo src="/img/logo-light.webp" alt="" hidden sizes="56px" className="h-11 w-auto" />
            <div className="font-serif text-xl text-brand-cream">Winterswijk<span className="text-brand-sun">.</span>Vakantiehuis</div>
          </div>
          <p className="mt-2 text-sm">{L.footer.tagline}</p>
        </div>
        <div className="text-sm md:text-right">
          {/* A second, crawlable set of language links — the header pair sits in a
              sticky bar that some crawlers treat as boilerplate. */}
          <div className="flex items-center gap-2 md:justify-end">
            <Globe size={14} />
            {LANGS.map((l, i) => (
              <span key={l} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden>·</span>}
                <a
                  href={pathFor(route, l)}
                  hrefLang={HREFLANG[l]}
                  aria-current={lang === l ? 'true' : undefined}
                  className={lang === l ? 'text-brand-cream' : 'hover:text-brand-cream transition-colors'}
                >{l.toUpperCase()}</a>
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-brand-cream/40 max-w-xs">{L.footer.placeholder}</p>
          <p className="mt-1 text-xs">© {new Date().getFullYear()} Winterswijk Vakantiehuis. {L.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Served with a real 404 status (dist/404.html, wired up through
    not_found_handling in wrangler.jsonc) rather than the silent 200 an SPA
    fallback returns, which search engines read as a soft 404.               */
function NotFoundPage({lang, L}: {lang: Lang; L: any}) {
  return (
    <main className="pt-16">
      <div className="max-w-6xl mx-auto px-5 py-24 text-center">
        <p className="font-serif text-6xl text-brand-sand">404</p>
        <h1 className="mt-4 font-serif text-3xl sm:text-4xl text-brand-green-dark">{L.notFound.title}</h1>
        <p className="mt-3 text-stone-600 max-w-xl mx-auto">{L.notFound.text}</p>
        <a
          href={`${pathFor({kind: 'landing'}, lang)}#homes`}
          className="mt-7 inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 rounded-full font-medium transition-colors"
        >
          {L.notFound.cta} <ChevronRight size={18} />
        </a>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-7 text-left">
          {homes.map((h) => <HomeCard key={h.id} home={h} lang={lang} L={L} />)}
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Time-limited nature highlight. The client wanted it obvious that the flamingo
    colony is only there for a short window, so it gets its own banner rather than
    being one card among nine.                                                   */
function FlamingoAlert({lang, L, waLink}: {lang: Lang; L: any; waLink: string}) {
  return (
    <div className="mt-14 grid md:grid-cols-[1fr_1.15fr] gap-0 rounded-3xl overflow-hidden border border-brand-sand bg-white">
      <Framed src="/img/nature-flamingos.webp" alt={L.flamingo.title} className="h-56 md:h-full min-h-[220px]" />
      <div className="p-8 flex flex-col justify-center">
        <span className="self-start inline-flex items-center gap-2 bg-brand-sun/15 text-brand-sun text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full">
          <Sun size={13} /> {L.flamingo.badge}
        </span>
        <h3 className="mt-3 font-serif text-2xl sm:text-3xl text-brand-green-dark">{L.flamingo.title}</h3>
        <p className="mt-3 text-stone-600">{L.flamingo.text}</p>
        <a
          href={waLink} target="_blank" rel="noopener noreferrer"
          className="mt-5 self-start inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
        >
          <MessageCircle size={16} /> {L.flamingo.cta}
        </a>
      </div>
    </div>
  );
}

function NatureCard({p, lang, L, hover = false}: {p: (typeof naturePhotos)[number]; lang: Lang; L: any; hover?: boolean}) {
  return (
    <figure className={`bg-white rounded-2xl border border-brand-sand overflow-hidden flex flex-col ${hover ? 'hover:shadow-md transition-shadow' : ''}`}>
      <div className="relative">
        <Framed src={p.src} alt={p.title[lang]} className="aspect-[4/3]" />
        {p.now && (
          <span className="absolute top-3 left-3 bg-brand-sun text-white text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
            <Sun size={12} /> {L.area.nowBadge}
          </span>
        )}
      </div>
      <figcaption className="p-5 flex-1">
        <h4 className="font-serif text-lg text-brand-green-dark">{p.title[lang]}</h4>
        <p className="mt-1.5 text-sm text-stone-600">{p.text[lang]}</p>
        {p.credit && <p className="mt-2 text-[11px] text-stone-400">{L.area.photoBy} {p.credit}</p>}
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  One labelled group of homes ("Aan het meer" / "In het bos").        */
function HomeGroup({icon: Icon, title, text, list, lang, L}: {icon: any; title: string; text: string; list: Home[]; lang: Lang; L: any}) {
  return (
    <div className="mt-14 first:mt-12">
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 shrink-0 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
          <Icon size={19} />
        </span>
        <div>
          <h3 className="font-serif text-2xl text-brand-green-dark leading-snug">{title}</h3>
          <p className="mt-1.5 text-stone-600 text-sm max-w-2xl">{text}</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-7">
        {list.map((h) => <HomeCard key={h.id} home={h} lang={lang} L={L} />)}
      </div>
    </div>
  );
}

function HomeCard({home: h, lang, L}: {home: Home; lang: Lang; L: any}) {
  return (
    <a href={pathFor({kind: 'home', homeId: h.id}, lang)} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-brand-sand flex flex-col hover:shadow-lg transition-shadow">
      <div className="relative h-52 overflow-hidden">
        <Photo src={h.imgs[0]} alt={h.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {h.guests && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-brand-green-dark text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1">
            <Users size={12} /> {h.guests}
          </span>
        )}
        <span className="absolute top-3 right-3 bg-brand-green-dark/85 backdrop-blur text-white text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1">
          {h.area === 'lake' ? <Waves size={12} /> : <TreePine size={12} />}
          {h.area === 'lake' ? L.homes.badgeLake : L.homes.badgeForest}
        </span>
        <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur text-brand-green-dark text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1">
          <Camera size={12} /> {h.imgs.length}
        </span>
        {h.accessible && (
          <span className="absolute bottom-3 right-3 bg-brand-sun text-white text-xs px-2.5 py-1 rounded-full font-semibold inline-flex items-center gap-1">
            <Accessibility size={12} /> {L.homes.badgeAccessible}
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-xl text-brand-green-dark">{h.name}</h3>
        <p className="text-xs text-brand-sun font-medium mt-0.5">{h.tagline[lang]}</p>
        <p className="mt-2 text-stone-600 text-sm flex-1">{h.blurb[lang]}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-stone-500">
          {h.guests
            ? <span className="inline-flex items-center gap-1"><Users size={14} /> {h.guests} {L.homes.guests}</span>
            : <span className="inline-flex items-center gap-1"><Users size={14} /> {L.homes.capacityAsk}</span>}
          {h.bedrooms && <span className="inline-flex items-center gap-1"><BedDouble size={14} /> {h.bedrooms} {L.homes.bedrooms}</span>}
          {h.pets && (
            <span className="inline-flex items-center gap-1">
              <PawPrint size={14} /> {amenityDef.pets.label[lang]}{h.petsNote?.short && ` (${h.petsNote.short[lang]})`}
            </span>
          )}
        </div>
        <span className="mt-5 inline-flex items-center gap-2 text-brand-green font-medium text-sm group-hover:gap-3 transition-all">
          {L.homes.view} <ChevronRight size={16} />
        </span>
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Images                                                             */
/* ------------------------------------------------------------------ *
   scripts/optimize-images.ts converts every photo to WebP at three widths and
   writes their real pixel sizes to image-manifest.json. Photo turns that into a
   srcset, so a phone fetches the 640px copy instead of the 1600px one, and into
   width/height, so the browser reserves the right box before a single byte of
   the image arrives — which is what stops the page shifting while it loads.   */
function variantSrc(src: string, width: number) {
  return src.replace(/\.webp$/, `-${width}w.webp`);
}

/** Cards sit in a 1152px grid: three across on desktop, two on tablet, full width on a phone. */
const CARD_SIZES = '(min-width: 1024px) 360px, (min-width: 640px) 45vw, 100vw';
/** Anything spanning the content column or the viewport. */
const WIDE_SIZES = '(min-width: 1152px) 1152px, 100vw';

function Photo({
  src, alt, className = '', sizes = CARD_SIZES, eager = false, hidden = false,
}: {
  src: string; alt: string; className?: string; sizes?: string; eager?: boolean; hidden?: boolean;
}) {
  const entry = (imageSizes as Record<string, number[] | undefined>)[src];
  const [width, height, ...smaller] = entry ?? [];
  const srcSet = smaller.length
    ? [...smaller.map((w) => `${variantSrc(src, w)} ${w}w`), `${src} ${width}w`].join(', ')
    : undefined;

  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={hidden || undefined}
      className={className}
      width={width}
      height={height}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      loading={eager ? undefined : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
    />
  );
}

/** The smallest copy on disk — good enough for something that gets blurred. */
function previewSrc(src: string) {
  const smaller = (imageSizes as Record<string, number[] | undefined>)[src]?.slice(2) ?? [];
  return smaller.length ? variantSrc(src, Math.min(...smaller)) : src;
}

/*  Shows a photo in full, never cropped: the frame is filled with a blurred
    copy of the same photo and the real one sits contained on top. Lets a grid
    keep one card height while portrait and landscape shots both stay intact. */
function Framed({
  src, alt, className = '', sizes = CARD_SIZES, eager = false,
}: {src: string; alt: string; className?: string; sizes?: string; eager?: boolean}) {
  return (
    <div className={`relative overflow-hidden bg-brand-sand ${className}`}>
      {/* The small copy: at blur-2xl nobody can tell, and pulling the full-size
          file twice would double the weight of every card on the page. */}
      <img
        aria-hidden src={previewSrc(src)} alt="" loading={eager ? undefined : 'lazy'} decoding="async"
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60"
      />
      <Photo src={src} alt={alt} sizes={sizes} eager={eager} className="relative w-full h-full object-contain" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
function SectionHead({title, sub, align = 'center'}: {title: string; sub?: string; align?: 'center' | 'left'}) {
  return (
    <div className={align === 'center' ? 'text-center max-w-2xl mx-auto' : 'max-w-xl'}>
      <h2 className="font-serif text-3xl sm:text-4xl text-brand-green-dark">{title}</h2>
      {sub && <p className="mt-3 text-stone-600 font-light">{sub}</p>}
    </div>
  );
}

function Field({
  name, label, value, ph, onChange, required = false, type = 'text',
}: {
  name: string; label: string; value: string; ph: string; onChange: (v: string) => void;
  required?: boolean; type?: string;
}) {
  const id = `contact-${name}`;
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-stone-600">
        {label}{required && <span className="text-brand-sun"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={ph}
        className="mt-1 w-full rounded-xl border border-brand-sand bg-brand-cream/50 px-4 py-2.5 text-sm outline-none focus:border-brand-green"
      />
    </div>
  );
}
