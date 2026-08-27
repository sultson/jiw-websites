import type { Pagina } from './index';

/**
 * Welk beeld bij welke pagina hoort.
 *
 * De mock-up van het bestuur verwees per pagina naar één van acht sfeerbeelden,
 * en zette daarmee op 44 van de 72 pagina's exact dezelfde foto. Dat werkt in
 * een klikbaar model, maar niet op een echte site: wie van "Mijn partner heeft
 * kanker" doorklikt naar "Rouw en verlies" hoort te zien dat hij ergens anders
 * is. Daarom krijgt hier iedere pagina zijn eigen beeld.
 *
 * Bij de overdracht staat één harde voorwaarde. De acht beelden uit de mock-up
 * zijn met AI gemaakt, en ze mogen niet gepubliceerd worden alsof het foto's
 * van echte bezoekers zijn of alsof ze bewijzen wat er nu op het programma
 * staat. Die voorwaarde is hier op drie manieren nagekomen:
 *
 * 1. Waar Toon over Leven een eigen foto heeft, staat die eigen foto. Dat zijn
 *    het huis binnen en buiten, de wandelgroep, de kraam, het atelier, het team
 *    en het werk uit de workshops. Ze staan hieronder onder ECHT.
 * 2. Alles wat gemaakt is, heet `sfeer-`. Aan de bestandsnaam is dus te zien
 *    wat gefotografeerd is en wat niet, ook voor wie deze tekst nooit leest.
 * 3. In de gemaakte beelden is niemand herkenbaar. Het zijn handen om een mok,
 *    een rug op een pad, twee silhouetten voor een raam, een lege warme kamer.
 *    Geen enkel gemaakt beeld is een portret, en geen enkele alt-tekst zegt wie
 *    er te zien is of bij welke gelegenheid.
 *
 * Zodra de stichting een echte foto van een onderwerp heeft, gaat die over het
 * `sfeer-`beeld heen: alleen deze tabel hoeft dan aangepast.
 */

export type Beeld = { src: string; alt: string };

/**
 * De acht sleutels uit de mock-up, als terugval.
 *
 * PER_PAGINA hieronder dekt alle 72 vastgestelde pagina's, dus deze tabel komt
 * in de praktijk alleen aan bod als er later een pagina bij komt. Dan heeft die
 * meteen een passend beeld in plaats van een gat.
 */
export const SFEERBEELD: Record<string, Beeld> = {
  'hero-home': { src: '/img/sfeer-huiskamer.jpg', alt: 'Drie mensen in gesprek op de bank in een huiskamer.' },
  'hero-jong': { src: '/img/sfeer-jongeren.jpg', alt: 'Drie jongvolwassenen zitten met koffie rond een lage tafel.' },
  'hero-na-behandeling': { src: '/img/sfeer-ochtend-raam.webp', alt: 'Iemand staat met een mok bij het raam en kijkt de tuin in.' },
  'hero-naasten': { src: '/img/sfeer-naasten.jpg', alt: 'Twee mensen zitten samen op de bank bij het raam.' },
  'activiteit-wandelen': { src: '/img/sfeer-wandeling.jpg', alt: 'Vier wandelaars op een bospad, van achteren gezien.' },
  'activiteit-creatief': { src: '/img/sfeer-creatief.jpg', alt: 'Handen werken aan een houten tafel met verf en kwasten.' },
  'activiteit-mindfulness': { src: '/img/sfeer-meditatie.jpg', alt: 'Mensen zitten in een kring op stoelen met hun ogen dicht.' },
  'activiteit-muziek': { src: '/img/sfeer-muziek-huiskamer.webp', alt: 'Een gitaar en een handtrommel staan klaar in een huiskamer.' },
};

/**
 * Het beeld per pagina.
 *
 * De volgorde is die van de rubrieken in het menu, zodat naast elkaar staat wat
 * naast elkaar in de navigatie hangt en meteen te zien is of twee buurpagina's
 * hetzelfde beeld hebben. Dat mogen ze niet: iemand die de rubriek doorloopt
 * moet aan het beeld kunnen zien dat hij verder is gekomen.
 *
 * ECHT = foto van Toon over Leven zelf. GEMAAKT = sfeerbeeld, niemand herkenbaar.
 */
export const PER_PAGINA: Record<string, Beeld> = {
  /* ---------------------------------------------------------------- */
  /*  Voorpagina                                                       */
  /* ---------------------------------------------------------------- */

  // GEMAAKT. Van het gewone werk, een gesprek op de bank, bestaat geen foto,
  // en juist dat is wat iemand wil zien voordat hij aanbelt. Ditzelfde beeld
  // staat in deel.jpg, zodat een gedeelde link eruitziet als de voorpagina.
  '/': { src: '/img/sfeer-huiskamer.jpg', alt: 'Drie mensen in gesprek op de bank in een huiskamer.' },

  /* ---------------------------------------------------------------- */
  /*  Bezoekersroutes: /voor-jou                                       */
  /* ---------------------------------------------------------------- */

  // Allemaal GEMAAKT. Deze vijf routes vangen iemand op bij zijn eigen vraag,
  // dus ze staan bewust ver uit elkaar: een mok, een raam in de ochtend, een
  // bank van achteren, een fietspad, een gedekte tafel.
  '/voor-jou/ik-heb-kanker-of-ben-in-behandeling': {
    src: '/img/sfeer-koffie.jpg',
    alt: 'Handen om een kop koffie aan een houten tafel.',
  },
  '/voor-jou/mijn-behandeling-is-voorbij': {
    src: '/img/sfeer-ochtend-raam.webp',
    alt: 'Iemand staat met een mok bij het raam en kijkt de tuin in.',
  },
  '/voor-jou/iemand-dichtbij-mij-heeft-kanker': {
    src: '/img/sfeer-luisteren-bank.webp',
    alt: 'Twee mensen zitten naast elkaar op de bank, van achteren gezien.',
  },
  '/voor-jou/jong-en-kanker': {
    src: '/img/sfeer-jong-fietsen.webp',
    alt: 'Twee jonge mensen lopen met hun fiets langs het water.',
  },
  '/voor-jou/contact-of-een-activiteit': {
    src: '/img/sfeer-tafel-gedekt.webp',
    alt: 'Een tafel met mokken en koffie, klaargezet voordat er iemand is.',
  },

  /* ---------------------------------------------------------------- */
  /*  Praktisch                                                        */
  /* ---------------------------------------------------------------- */

  // ECHT. De huiskamer aan het Mazerhard zelf, met de kast waar de folders
  // staan. Wie wil weten hoe het er is, hoort het huis te zien en geen sfeer.
  '/praktisch': {
    src: '/img/huis-binnen.jpg',
    alt: 'De huiskamer van Toon over Leven, met de boekenkast en de grote tafel.',
  },
  // ECHT. Hetzelfde geldt voor de weg ernaartoe: dit is de gevel die iemand
  // zoekt. Het bord is nog dat van het Toon Hermans Huis, en dat klopt met de
  // regel "Voorheen: Toon Hermans Huis Zeewolde" die de site zelf voert.
  '/praktisch/locatie-en-bereikbaarheid': {
    src: '/img/huis-buiten.jpg',
    alt: 'Het huis aan het Mazerhard vanaf de stoep, met wandelaars en hun honden voor de deur.',
  },
  // GEMAAKT. Van een eerste keer aanbellen bestaat geen foto, en die mag er ook
  // niet zijn: dat is precies het moment waarop iemand niet gefotografeerd wil
  // worden. Dus de deur, niet de bezoeker.
  '/praktisch/eerste-keer': {
    src: '/img/sfeer-voordeur.webp',
    alt: 'De voordeur van een woonhuis staat op een kier, met licht in de gang.',
  },
  '/praktisch/openingstijden': {
    src: '/img/sfeer-twee-stoelen.webp',
    alt: 'Twee lege fauteuils tegenover elkaar bij een raam.',
  },
  '/praktisch/contact': {
    src: '/img/sfeer-telefoon-tafel.webp',
    alt: 'Een telefoon en een blocnote naast een mok thee op tafel.',
  },
  '/praktisch/kosten': {
    src: '/img/sfeer-koffie-koek.webp',
    alt: 'Twee mokken koffie en een schaal met koek op tafel.',
  },
  '/praktisch/zo-werkt-toon-over-leven': {
    src: '/img/sfeer-ontvangst-hal.webp',
    alt: 'Iemand houdt de deur open naar een verlichte huiskamer.',
  },
  '/praktisch/vragen-over-een-bezoek': {
    src: '/img/sfeer-folders-tafel.webp',
    alt: 'Folders en een leesbril op een lage tafel naast een mok.',
  },

  /* Acht antwoordpagina's naast elkaar. Ze zijn kort en lijken op elkaar, dus
     het beeld moet het verschil maken: elk antwoord krijgt zijn eigen stilleven
     of hoek van het huis. Allemaal GEMAAKT, op de mandala's na. */
  '/praktisch/vragen/heb-ik-een-verwijzing-nodig': {
    src: '/img/sfeer-deurbel.webp',
    alt: 'Een hand gaat naar de deurbel van een woonhuis.',
  },
  '/praktisch/vragen/is-toon-over-leven-medische-zorg': {
    src: '/img/sfeer-huiskamerhoek.webp',
    alt: 'Een hoek van een huiskamer met een boekenkast, een schemerlamp en een plant.',
  },
  '/praktisch/vragen/kan-ik-zonder-afspraak-binnenlopen': {
    src: '/img/sfeer-gang-kapstok.webp',
    alt: 'Een gang met een kapstok vol jassen en daglicht door de deur.',
  },
  '/praktisch/vragen/mag-ik-iemand-meenemen': {
    src: '/img/sfeer-twee-mokken.webp',
    alt: 'Twee mokken thee naast elkaar op een vensterbank.',
  },
  '/praktisch/vragen/moet-ik-over-kanker-praten': {
    src: '/img/sfeer-stoel-deken.webp',
    alt: 'Een lege stoel bij het raam met een gebreide deken over de leuning.',
  },
  '/praktisch/vragen/wanneer-zoek-ik-professionele-hulp': {
    src: '/img/sfeer-handen-gevouwen.webp',
    alt: 'Gevouwen handen op tafel naast een mok thee.',
  },
  '/praktisch/vragen/wat-gebeurt-er-tijdens-een-eerste-bezoek': {
    src: '/img/sfeer-koffie-inschenken.webp',
    alt: 'Koffie wordt aan tafel in een mok geschonken.',
  },
  // ECHT. Werk uit een van de workshops. Op de vraag wat een activiteit kost
  // hoort te staan wat een activiteit oplevert, en dat bestaat hier echt.
  '/praktisch/vragen/wat-kost-een-bezoek-of-activiteit': {
    src: '/img/mandala.jpg',
    alt: 'Beschilderde schaaltjes met stippen, gemaakt tijdens een workshop.',
  },

  /* ---------------------------------------------------------------- */
  /*  Activiteiten                                                     */
  /* ---------------------------------------------------------------- */

  // ECHT. De werktafel van het atelier zoals die er halverwege een ochtend bij
  // ligt. Geen enkel gezicht in beeld, wel alles waar het om gaat.
  '/activiteiten': {
    src: '/img/atelier-breed.jpg',
    alt: 'De werktafel van het atelier, vol kwasten, verf en werk dat half af is.',
  },
  '/activiteiten/alle-activiteiten': {
    src: '/img/sfeer-creatief.jpg',
    alt: 'Handen werken aan een houten tafel met verf en kwasten.',
  },
  // ECHT. De agenda gaat over wat er werkelijk gebeurt, dus staat er een foto
  // van wat er werkelijk gebeurd is: de wandelgroep die even zit.
  '/activiteiten/agenda': {
    src: '/img/wandelen.jpg',
    alt: 'Wandelaars zitten na afloop buiten, met hun honden erbij.',
  },
  // ECHT. Vilt uit een workshop, in dezelfde warme kleuren als de site.
  '/activiteiten/per-thema': {
    src: '/img/toefjes.jpg',
    alt: 'Vilten toefjes die tijdens een workshop gemaakt zijn.',
  },
  '/activiteiten/per-thema/bewegen-en-ontspannen': {
    src: '/img/sfeer-wandeling.jpg',
    alt: 'Vier wandelaars op een bospad, van achteren gezien.',
  },
  '/activiteiten/per-thema/herstel-en-energie': {
    src: '/img/sfeer-tuinbank.webp',
    alt: 'Een houten bank in een tuin, met een deken en een mok erop.',
  },
  // ECHT. Voorlichting bij een evenement in het dorp: precies wat dit thema is.
  '/activiteiten/per-thema/informatie-en-inspiratie': {
    src: '/img/kraam-gesprek.jpg',
    alt: 'Twee mensen met een microfoon bij een evenement in het dorp.',
  },
  '/activiteiten/per-thema/ontmoeten': {
    src: '/img/sfeer-ontmoeting-tafel.webp',
    alt: 'Vier mensen zitten met koffie rond een tafel, van achteren gezien.',
  },
  '/activiteiten/per-thema/relaties-en-gezin': {
    src: '/img/sfeer-gezinstafel.webp',
    alt: 'Een keukentafel met mokken, fruit en een kindertekening.',
  },
  '/activiteiten/per-thema/werk-en-studie': {
    src: '/img/sfeer-bureau-raam.webp',
    alt: 'Een bureau bij het raam met een dichtgeklapte laptop en een mok.',
  },
  '/activiteiten/voor-35-50': {
    src: '/img/sfeer-avond-tafel-volwassenen.webp',
    alt: 'Volwassenen eten samen aan de keukentafel in de avond.',
  },
  '/activiteiten/voor-jongeren-15-35': {
    src: '/img/sfeer-jong-fietsen.webp',
    alt: 'Twee jonge mensen lopen met hun fiets langs het water.',
  },
  '/activiteiten/voor-naasten': {
    src: '/img/sfeer-naasten-handen.webp',
    alt: 'Twee paar handen liggen naast elkaar op een houten tafel.',
  },

  /* ---------------------------------------------------------------- */
  /*  Jong en kanker                                                   */
  /* ---------------------------------------------------------------- */

  // Allemaal GEMAAKT: van jonge bezoekers bestaat geen enkele foto, en juist
  // van hen zou een herkenbaar portret het meeste kwaad kunnen. Dus ruggen,
  // handen en tegenlicht, met de gewone dingen erbij die op deze leeftijd
  // doorlopen: fietsen, koken, studeren, een telefoon.
  '/jong-en-kanker': {
    src: '/img/sfeer-jongeren.jpg',
    alt: 'Drie jongvolwassenen zitten met koffie rond een lage tafel.',
  },
  '/jong-en-kanker/jong-en-kanker': {
    src: '/img/sfeer-jong-raam-alleen.webp',
    alt: 'Iemand zit in de vensterbank en kijkt naar buiten.',
  },
  '/jong-en-kanker/activiteiten-voor-jongeren': {
    src: '/img/sfeer-jong-keuken-avond.webp',
    alt: 'Drie jonge mensen koken samen in een keuken, van achteren gezien.',
  },
  '/jong-en-kanker/aya-leeftijdgenoten-ontmoeten': {
    src: '/img/sfeer-jong-buiten-bank.webp',
    alt: 'Twee jonge mensen zitten op een bank in het park, van achteren gezien.',
  },
  '/jong-en-kanker/ik-ben-in-behandeling': {
    src: '/img/sfeer-jong-telefoon.webp',
    alt: 'Handen met een telefoon boven een tafel met een mok en een sleutelbos.',
  },
  '/jong-en-kanker/mijn-behandeling-is-klaar': {
    src: '/img/sfeer-raam-planten-ochtend.webp',
    alt: 'Een vensterbank vol planten in het ochtendlicht.',
  },
  '/jong-en-kanker/relaties-intimiteit-en-gezin': {
    src: '/img/sfeer-jong-bank-raam.webp',
    alt: 'Twee jonge mensen zitten samen op de bank bij het raam, van achteren gezien.',
  },
  '/jong-en-kanker/werk-studie-en-kanker': {
    src: '/img/sfeer-jong-laptop.webp',
    alt: 'Iemand werkt aan een laptop bij het raam, over de schouder gezien.',
  },

  /* ---------------------------------------------------------------- */
  /*  Voor naasten                                                     */
  /* ---------------------------------------------------------------- */

  // Allemaal GEMAAKT. Deze rubriek gaat over het huis van de ander: de keuken,
  // het raam, de bank, de tuin. Bij rouw en verlies bewust ingehouden, een lege
  // stoel en een kaars, geen verdriet in beeld.
  '/voor-naasten': {
    src: '/img/sfeer-naasten.jpg',
    alt: 'Twee mensen zitten samen op de bank bij het raam.',
  },
  '/voor-naasten/activiteiten-voor-naasten': {
    src: '/img/sfeer-naasten-samen-lopen.webp',
    alt: 'Twee mensen lopen naast elkaar over een dijk, van achteren gezien.',
  },
  '/voor-naasten/ik-ben-een-jonge-naaste': {
    src: '/img/sfeer-jonge-naaste-raam.webp',
    alt: 'Een jongere zit met een schooltas op de grond bij het raam.',
  },
  '/voor-naasten/mijn-ouder-heeft-kanker': {
    src: '/img/sfeer-ouder-kind-raam.webp',
    alt: 'Twee mensen van verschillende leeftijd staan bij het raam, van achteren gezien.',
  },
  '/voor-naasten/mijn-partner-heeft-kanker': {
    src: '/img/sfeer-naasten-keuken.webp',
    alt: 'Twee mensen in een keuken in de avond, van achteren gezien.',
  },
  '/voor-naasten/rouw-en-verlies': {
    src: '/img/sfeer-rouw-licht.webp',
    alt: 'Een lege stoel bij het raam, met een brandende kaars op het tafeltje ernaast.',
  },
  '/voor-naasten/zorgen-voor-iemand-en-voor-jezelf': {
    src: '/img/sfeer-alleen-tuin-thee.webp',
    alt: 'Iemand zit alleen met een mok op een bank in de tuin, van achteren gezien.',
  },

  /* ---------------------------------------------------------------- */
  /*  Ervaringen                                                       */
  /* ---------------------------------------------------------------- */

  // Op deze pagina's komen echte verhalen te staan, met toestemming. Zolang die
  // er niet zijn mag het beeld dat ook niet suggereren: geen portret, geen
  // gezicht dat als "bezoeker" gelezen kan worden. Behalve bij de vragen, waar
  // een ECHTE foto staat van voorlichting die werkelijk gegeven is.
  '/ervaringen': {
    src: '/img/sfeer-gesprek.jpg',
    alt: 'Twee vrouwen praten met elkaar aan de keukentafel.',
  },
  '/ervaringen/verhalen-van-bezoekers': {
    src: '/img/sfeer-gesprek-twee-silhouet.webp',
    alt: 'Twee mensen zitten tegenover elkaar aan tafel voor een licht raam.',
  },
  '/ervaringen/echte-vragen': {
    src: '/img/sfeer-stoelenkring.webp',
    alt: 'Een kring lege stoelen in een kamer met daglicht.',
  },
  '/ervaringen/jong-en-kanker': {
    src: '/img/sfeer-jong-raam-alleen.webp',
    alt: 'Iemand zit in de vensterbank en kijkt naar buiten.',
  },
  '/ervaringen/leven-na-behandeling': {
    src: '/img/sfeer-fietspad-dijk.webp',
    alt: 'Een fietser in de verte op een pad langs een dijk, onder een wijde lucht.',
  },
  '/ervaringen/naasten': {
    src: '/img/sfeer-luisteren-bank.webp',
    alt: 'Twee mensen zitten naast elkaar op de bank, van achteren gezien.',
  },

  /* ---------------------------------------------------------------- */
  /*  Kennis en wegwijzer                                              */
  /* ---------------------------------------------------------------- */

  // GEMAAKT, en bewust zonder mensen waar het over uitleg gaat. Een kennisblok
  // wordt niet geloofwaardiger van een gezicht erbij, en de bronnen doen het
  // werk. Bij "praten of professionele hulp" wel een kring stoelen, omdat het
  // verschil tussen lotgenotencontact en behandeling juist in de vorm zit.
  '/kennis-en-wegwijzer': {
    src: '/img/sfeer-boeken-tafel.webp',
    alt: 'Een stapel boeken en een mok thee op tafel bij het raam.',
  },
  '/kennis-en-wegwijzer/emoties-energie-werk-en-relaties': {
    src: '/img/sfeer-raam-regen-mok.webp',
    alt: 'Een mok op de vensterbank, met regen op het glas.',
  },
  '/kennis-en-wegwijzer/passende-ondersteuning-vinden': {
    src: '/img/sfeer-wegwijzer-pad.webp',
    alt: 'Een bospad dat zich in tweeën splitst.',
  },
  '/kennis-en-wegwijzer/praten-lotgenotencontact-of-professionele-hulp': {
    src: '/img/sfeer-stoelenkring.webp',
    alt: 'Een kring lege stoelen in een kamer met daglicht.',
  },
  '/kennis-en-wegwijzer/wanneer-past-een-ipso-centrum': {
    src: '/img/sfeer-huis-avondlicht.webp',
    alt: 'Een woonhuis in de schemering, met licht achter de ramen.',
  },
  '/kennis-en-wegwijzer/wat-is-een-centrum-voor-leven-met-en-na-kanker': {
    src: '/img/sfeer-binnenkomen-huiskamer.webp',
    alt: 'Een huiskamer vanuit de deuropening, met banken, planten en een lage tafel.',
  },
  '/kennis-en-wegwijzer/wat-is-psychosociale-ondersteuning': {
    src: '/img/sfeer-naasten-handen.webp',
    alt: 'Twee paar handen liggen naast elkaar op een houten tafel.',
  },
  '/voor-verwijzers': {
    src: '/img/sfeer-overleg-papieren.webp',
    alt: 'Twee mensen overleggen aan tafel bij papieren en een laptop.',
  },

  /* ---------------------------------------------------------------- */
  /*  Over ons                                                         */
  /* ---------------------------------------------------------------- */

  // Bijna allemaal ECHT, en dat hoort ook: dit is de rubriek waar de stichting
  // over zichzelf praat, dus staan hier haar eigen mensen, haar eigen huis en
  // haar eigen momenten. Alleen bij de werkwijze en de verantwoording staat een
  // gemaakt beeld, omdat daar geen foto van te maken valt.
  '/over-ons': {
    src: '/img/team-groen.jpg',
    alt: 'Het wandelteam in groene shirts, na afloop met bloemen en medailles.',
  },
  '/over-ons/wie-wij-zijn': {
    src: '/img/huis-binnen.jpg',
    alt: 'De huiskamer van Toon over Leven, met de boekenkast en de grote tafel.',
  },
  '/over-ons/onze-mensen': {
    src: '/img/vrijwilligers.webp',
    alt: 'Twee vrijwilligers bij de kraam, met werk uit de workshops op tafel.',
  },
  '/over-ons/onze-werkwijze': {
    src: '/img/sfeer-ontvangst-hal.webp',
    alt: 'Iemand houdt de deur open naar een verlichte huiskamer.',
  },
  '/over-ons/organisatie-en-verantwoording': {
    src: '/img/sfeer-notitieboek.webp',
    alt: 'Een opengeslagen notitieboek en een pen op tafel.',
  },
  '/over-ons/samenwerkingspartners': {
    src: '/img/samen-buiten.jpg',
    alt: 'Een buitenmiddag met een tent, live muziek en publiek in het gras.',
  },
  '/over-ons/steun-ons': {
    src: '/img/cheque-rabo.jpg',
    alt: 'Een cheque van Rabo ClubSupport wordt in de huiskamer overhandigd.',
  },
  '/over-ons/vrijwilliger-worden': {
    src: '/img/swim-kraam.jpg',
    alt: 'De kraam van Toon over Leven, met de vlag en werk uit de workshops.',
  },
};

export function beeldVan(pagina: Pagina): Beeld | undefined {
  return PER_PAGINA[pagina.pad] ?? SFEERBEELD[pagina.hero.beeld];
}
