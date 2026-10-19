// Alle inhoud die op meer dan een pagina terugkomt staat hier een keer.
// Bron: framemedia.tv, uitgelezen op 27-09-2026. De ruwe pagina's staan in raw/.
//
// Wat hier staat is bijna allemaal van hen. Waar wij iets hebben toegevoegd of
// geherformuleerd staat dat in LEESMIJ.md onder "Nog open".
import { readFileSync } from 'fs';

// Geschreven door maak-logos.mjs: per logo het pad, de opgemeten verhouding en
// de optische hoogte. Niet met de hand bijwerken.
const LOGOS = JSON.parse(readFileSync(new URL('./logos.json', import.meta.url), 'utf8'));

// --- zenders ---------------------------------------------------------------
// RTL4/RTL7/SBS6/AT5 komen van de homepagina, RTL Z/Net 5/Veronica uit de
// vacaturetekst ("in opdracht van producenten en zenders zoals RTL 4, RTL7,
// RTL Z, SBS 6, Net 5, Veronica").
//
// De logo's zelf komen uit Wikimedia Commons en staan op een witte tegel. Dat
// is geen opmaakkeuze maar noodzaak: zie shots/logoproef-nieuw.png. De 4 van
// RTL 4, de Z van RTL Z en het woordmerk van AT5 zijn zwart, die vallen op een
// donkere band gewoon weg. Omkleuren naar een eenkleurige witte variant kan
// niet, want in meerdere logo's is de vorm een uitsparing.
export const ZENDERS = LOGOS.filter(l => l.groep === 'zenders');

// --- logo's van opdrachtgevers ---------------------------------------------
// Twaalf van de ruim honderd namen uit hun eigen referentielijst waarvan een
// echt logobestand te vinden was: acht uit Wikimedia Commons, vier van de site
// van het bedrijf zelf. Geen plaatjes van Google, allemaal vector behalve Febo
// (die heeft alleen een PNG).
//
// Febo en Culimaat leveren een wit logo. Culimaat is in maak-logos.mjs
// omgekleurd, Febo is een PNG en wordt met een filter omgekeerd - bij een
// grijswaarden-PNG raakt dat de doorzichtigheid niet, dus de vorm blijft heel.
export const KLANT_LOGOS = LOGOS.filter(l => l.groep === 'klanten');

// --- de drie routes naar binnen --------------------------------------------
export const ROUTES = [
  {
    slug: 'branded-content',
    nr: '01',
    kort: 'Branded content',
    titel: 'Uw bedrijf in een tv-programma',
    zin: 'Drie tot vijf minuten zendtijd waarin uw product in beeld komt en u zelf wordt ge&iuml;nterviewd. Geen reclameblok, maar redactie.',
    punten: ['Non-spot van 3 tot 9 minuten', 'Opname op locatie of in de studio', 'All-in vanaf 2990'],
  },
  {
    slug: 'studio',
    nr: '02',
    kort: 'Studio huren',
    titel: 'Onze studio, uw opname',
    zin: 'Een HD-televisiestudio met zes robotcamera&rsquo;s, een aangekoppelde regie, een podcaststudio en alles eromheen.',
    punten: ['Studio A: talkshow, webinar, live', 'Studio B: podcast in broadcastkwaliteit', 'Greenroom en visagie inbegrepen'],
  },
  {
    slug: 'formats',
    // Deze kaart gaat over een eigen idee en niet over onze formats, dus hij
    // wijst naar de pagina programma-idee. Het Engels en het Duits hebben die
    // pagina niet en zetten hier hun eigen contactpagina (zie taal/en.mjs).
    href: '/programma-idee/',
    nr: '03',
    kort: 'Format ontwikkelen',
    titel: 'Van idee tot uitzending',
    zin: 'Heeft u een programma-idee? Wij beoordelen het op inhoud en op sponsoring, en leggen het voor aan de zenders.',
    punten: ['Redactie, scripting en productie', 'Toetsing aan de Mediawet', 'Direct contact met de zenders'],
  },
];

// --- cijfers ---------------------------------------------------------------
// Alle vier zijn te herleiden tot hun eigen site. Zie LEESMIJ.md: het jaartal
// 1981 komt van de format-pagina ("Wij maken tv reclame sinds 1981"), het
// aantal bedrijven is de referentielijst geteld.
export const CIJFERS = [
  { getal: '100+', label: 'bedrijven op televisie gebracht' },
  { getal: '7', label: 'commerci&euml;le zenders' },
  { getal: '3-5', label: 'minuten zendtijd per item' },
  { getal: '1981', label: 'maken wij televisie sinds' },
];

// --- non-spot versus spot --------------------------------------------------
// Hun eigen kernargument, maar zij zetten het in een lopende alinea. Naast
// elkaar in een tabel wint het enorm: dit is het hele verschil in een blik.
export const VERGELIJKING = {
  kolommen: ['Reclamespot', 'Non-spot (branded content)'],
  rijen: [
    ['Duur', '20 tot 30 seconden', '3 tot 9 minuten'],
    ['Vorm', 'Advertentie in het reclameblok', 'Redactioneel item in het programma'],
    ['Wie spreekt', 'Een voice-over', 'U zelf, ge&iuml;nterviewd door de presentator'],
    ['Locatie', 'Studio of set van het reclamebureau', 'Uw eigen bedrijf, of onze studio'],
    ['Kijker', 'Zapt weg of kijkt langs het blok heen', 'Kijkt door, want het is het programma'],
    ['Wat blijft hangen', 'Een boodschap', 'Een verhaal en een gezicht'],
  ],
};

// --- hoe het werkt ---------------------------------------------------------
// Afgeleid van hun eigen opsomming "Wat zit allemaal standaard in de prijs?"
// op de Mondzorg.TV-pagina, plus de werkwijze uit de tekst eromheen.
export const STAPPEN = [
  { nr: '1', titel: 'Kennismaken', tekst: 'We kijken samen welk programma en welke zender bij uw product en uw doelgroep passen. Vrijblijvend en zonder kosten.' },
  { nr: '2', titel: 'Draaiboek', tekst: 'U bepaalt waar het item over gaat. Voor de opnames ligt er een draaiboek dat op uw wensen aansluit, getoetst aan de Mediawet.' },
  { nr: '3', titel: 'Opname', tekst: 'Opname in uw eigen bedrijf of in onze studio in Hilversum. Wij leveren presentatie, regie, camera, licht en geluid.' },
  { nr: '4', titel: 'Montage', tekst: 'Eindmontage, kleurcorrectie, audionabewerking en voice-over. Muziekrechten (BUMA/STEMRA) zijn afgekocht.' },
  { nr: '5', titel: 'Uitzending', tekst: 'Uw item gaat de lucht in op de afgesproken zender, op het uitzendmoment dat we met u doornemen. De zenderfee zit in de prijs.' },
  { nr: '6', titel: 'Daarna', tekst: 'Plaatsing op social media en een digitaal item dat u zelf onbeperkt mag gebruiken, op uw site en in uw eigen kanalen.' },
];

// Bij Puur Genieten gaat het item twee keer de lucht in, op zaterdag en op
// zondag. Bij branded content in het algemeen is dat geen standaard (Armando,
// 12-10-2026), dus stap 5 hierboven laat het aantal uitzendingen open en
// alleen de pg-pagina zet deze tekst ervoor in de plaats.
export const STAP_UITZENDING_PG = {
  nr: '5',
  tekst: 'Twee uitzendingen, op zaterdag en op zondag, op twee verschillende momenten. De zenderfee zit in de prijs.',
};

// Letterlijk hun lijst van de Mondzorg.TV-pagina.
export const INBEGREPEN = [
  'Voorbereiding en toetsing Mediawet',
  'Opnamen in uw eigen bedrijf',
  'Productie, redactie en regie',
  'Presentatrice en voice-over',
  'Kleur- en audionabewerking',
  'Lineproductie op de opnamelocatie',
  'Eindmontage, uitzendklaar',
  'Zenderfee',
  'Plaatsing op social media',
  'Afkoop BUMA/STEMRA',
  'Digitaal item voor eigen gebruik',
];

// Zie STAP_UITZENDING_PG: alleen de Puur Genieten-pagina zet deze regel
// onderaan de inbegrepen-lijst.
export const INBEGREPEN_UITZENDING_PG = 'Uitzending op zaterdag en op zondag';

// --- tarieven --------------------------------------------------------------
// De drie bedragen hieronder gaf Armando zelf (10-10-2026). De lengte in
// `duur` is de lengte van het item; `zendtijd` zegt wat de klant voor dat
// bedrag aan uitzending krijgt: bij Puur Genieten het dubbele, want het item
// gaat op zaterdag en op zondag de lucht in. Sinds 12-10-2026 wordt die regel
// alleen op de Puur Genieten-pagina getoond (blok `tarievenPg`); bij branded
// content in het algemeen is twee keer uitzenden geen standaard.
// 5 minuten staat sinds 11-10-2026 op aanvraag, op verzoek van Armando; het
// bedrag dat daar stond (4990) is eraf.
export const TARIEVEN = [
  { duur: '3 minuten', prijs: '2990', zendtijd: '2 &times; 3 minuten = 6 minuten zendtijd', bij: 'All-in, zonder extra&rsquo;s' },
  { duur: '4 minuten', prijs: '3950', zendtijd: '2 &times; 4 minuten = 8 minuten zendtijd', bij: 'All-in, zonder extra&rsquo;s', uitgelicht: true },
  { duur: '5 minuten', prijs: 'Op aanvraag', zendtijd: '2 &times; 5 minuten = 10 minuten zendtijd', bij: 'All-in, zonder extra&rsquo;s' },
];

// De bedragen die hier stonden (6990 en 9990) komen van hun Mondzorg.TV-pagina
// en gelden daar voor dat format; op 11-10-2026 zijn ze er op verzoek van
// Armando af. Hetzelfde geldt voor de regel dat bij deze twee lengtes alle
// extra's er al bij zitten: dat is niet standaard zo.
export const TARIEVEN_GROOT = [
  { duur: '6 minuten', prijs: 'Op aanvraag', bij: 'Prijs afhankelijk van de inhoud' },
  { duur: '9 minuten', prijs: 'Op aanvraag', bij: 'Prijs afhankelijk van de inhoud' },
];

export const EXTRAS = [
  { naam: 'Custom item voor eigen gebruik', prijs: '490', bij: 'Bij 3, 4 en 5 minuten' },
  { naam: 'Interview in de studio in Hilversum', prijs: '990', bij: 'Bij 3, 4 en 5 minuten' },
  { naam: 'Break-bumper inclusief logo en voice-over', prijs: '590', bij: 'Bij 3, 4 en 5 minuten' },
  { naam: 'Break-bumper of billboard inclusief logo en voice-over', prijs: '1490', bij: 'Alleen bij 3 minuten zendtijd' },
];

// --- studio ----------------------------------------------------------------
// Letterlijk hun specificaties, alleen ingekort en geordend. De lopende tekst
// op hun site is een muur; hier is het een lijst die je kunt scannen.
export const RUIMTES = [
  {
    slug: 'studio-a',
    fotos: [
      { bestand: 'studio-a-1', alt: 'Studio A vanaf de regiezijde: het lichtplafond, het horizondoek en de L-vormige presentatiedesk' },
      { bestand: 'studio-a-2', alt: 'De presentatiedesk in Studio A van dichtbij, met het decor met lichteffect erachter' },
    ],
    naam: 'Studio A',
    type: 'HD-televisiestudio',
    zin: 'Een HD-televisiestudio met zes op afstand bedienbare camera&rsquo;s, van waaruit live-webinars in broadcastkwaliteit worden uitgezonden en programma&rsquo;s worden gemaakt voor nationale en internationale zenders.',
    kerncijfers: [
      ['Vloeroppervlak', '9,75 &times; 7,30 m'],
      ['Hoogte', '2,75 m'],
      ['Camera&rsquo;s', 'Zes HD-robotcamera&rsquo;s'],
      ['Sprekers', 'Maximaal vier aan de desk'],
    ],
    inbegrepen: [
      'Zes HD-robotcamera&rsquo;s',
      'L-vormige presentatiedesk voor maximaal vier sprekers',
      'PowerPoint-slides, met clicker bediend door de spreker',
      'Twee teleprompters voor het autocuesysteem',
      'Drie decorbeeldschermen',
      'Rood, groen of blauw licht op het horizondoek',
      'Lichtplafond ingericht voor vier sprekers en decor',
      'L-vormig decor met lichteffect',
      'In-ear systeem (&ldquo;oortje&rdquo;)',
      'Beeldmonitors voor afkijk van het programma',
      'Geluidmonitors voor programma en intercom',
      'Wifi en airconditioning',
    ],
    blokken: [
      { kop: 'Decor', tekst: 'Het standaarddecor is een L-vormige horizontale banner van circa 9 meter breed en 80 cm hoog, met grafische effecten in rood-oranje tint, een ingebouwd beeldscherm en lichteffecten. Boven en onder hangen acht borden van 80 &times; 40 cm. Met magneetfolie is de look-and-feel aan te passen aan uw eigen huisstijl: een mooie en kosteneffici&euml;nte manier om de studio van uw branding te voorzien.' },
      { kop: 'Licht', tekst: 'Het lichtplafond bestaat uit lampen en groepen lampen, bediend vanaf een 12-krings lichttafel in Regie A. Wijzigingen zijn daardoor onmiddellijk zichtbaar op de monitors en goed te beoordelen.' },
      { kop: 'Camera&rsquo;s', tekst: 'Wij werken met robotcamera&rsquo;s op vaste statieven. Meerdere camera&rsquo;s worden door een Remote Camera Operator op afstand bediend, wat de bezetting en dus de kosten laag houdt.' },
      { kop: 'Geluid', tekst: 'Headsets, reversmicrofoons of tafelmicrofoons, met kabel of zender. Decorluidsprekers voor video-instarts en vormgeving, en regie-aanwijzingen tijdens de repetitie.' },
      { kop: 'Autocue', tekst: 'Voor een camera staat een teleprompter met de uit te spreken tekst, zodat de spreker recht in de lens kan blijven kijken. Bedoeld voor sprekers die daar ervaring mee hebben.' },
      { kop: 'Akoestiek en klimaat', tekst: 'De ruimte is optimaal ingericht voor spraak. Er is ventilatie en airconditioning, die tijdens een opname of live-uitzending wordt uitgeschakeld vanwege het geluid.' },
    ],
  },
  {
    slug: 'regie-a',
    fotos: [
      { bestand: 'regie-a', alt: 'Regie A: beeldmenger, audiomixer en referentiemonitors, gekoppeld aan Studio A' },
    ],
    naam: 'Regie A',
    type: 'Regieruimte',
    zin: 'Regie A is gekoppeld aan Studio A. Die combinatie is ontworpen om opnamen en live-uitzendingen van televisieprogramma&rsquo;s, webcasts en webinars kosteneffici&euml;nt in een standaardset te realiseren.',
    kerncijfers: [
      ['Vloeroppervlak', '9,75 &times; 5,25 m'],
      ['Hoogte', '2,75 m'],
      ['Indeling', 'Drie desks'],
      ['Opname', 'Twee SSD-recorders'],
    ],
    inbegrepen: [
      'Beeldmenger',
      'Remote control van zes HD-robotcamera&rsquo;s',
      'Audiomixer met zendlijnprocessing',
      'Vier microfoonontvangers',
      'Audiozender voor in-ear systeem',
      'Editingsysteem (Avid Media Composer)',
      'Autocuesysteem (Portaprompt)',
      'Weergave fullscreen video-instarts en stills',
      'Weergave naam- en functietitels',
      'Weergave PowerPoint-slides',
      'Weergave stills op de decorbeeldschermen',
      'Lichttafel, 12-krings',
      'Twee SSD-recorders voor de opname',
      'Wifi en airconditioning',
    ],
    blokken: [
      { kop: 'Indeling', tekst: 'Drie rijen. Voorste rij: regisseur, Remote Camera Operator en audiotechnicus. Tweede rij: webcast engineer en eindredacteur. Achterste rij: overige medewerkers.' },
      { kop: 'Beeldmenger', tekst: 'Een schakelpaneel met afkijkmonitors om de videobronnen te bekijken en te beoordelen, plus een aparte monitor met het geschakelde programma. Het videosignaal wordt met een vectorscope gemeten, zodat het aan de professionele normen voldoet.' },
      { kop: 'Audio', tekst: 'Een professionele audiomixer regelt microfoons, video-instarts en vormgeving. Het geluidsniveau wordt nauwkeurig gemeten: voor broadcast gelden strenge eisen. Referentiemonitors en zendlijnprocessing voor de verstaanbaarheid.' },
      { kop: 'Extra bezetting', tekst: 'Een eenvoudige opening en slottekst kan de geluidstechnicus er meestal bij doen. Wordt er meer van de autocue gelezen, dan is een aparte autocue operator nodig. Moeten er tijdens een uitzending microfoons worden gewisseld, dan een assistent geluidstechnicus.' },
    ],
  },
  {
    slug: 'studio-b',
    fotos: [
      { bestand: 'studio-b', alt: 'Studio B: de ronde podcasttafel met vier microfoons en koptelefoons' },
    ],
    naam: 'Studio B',
    type: 'Podcaststudio',
    zin: 'Studio B is een podcaststudio waar in professionele kwaliteit geluid wordt opgenomen. Aan een ronde tafel is standaard plaats voor vier sprekers. In overleg zijn meer sprekers mogelijk.',
    kerncijfers: [
      ['Vloeroppervlak', '6,35 &times; 6,30 m'],
      ['Hoogte', '2,75 m'],
      ['Sprekers', 'Vier aan de ronde tafel'],
      ['Archief', 'Minimaal een jaar gratis'],
    ],
    inbegrepen: [
      'Opname in professionele geluidskwaliteit',
      'Ronde tafel voor vier sprekers',
      'Tunes, jingles en muziek live in te starten',
      'Gesprekken met sprekers op afstand',
      'Montage van losse fragmenten',
      'Soundprocessing en afwerking',
      'Aanlevering als WAV en MP3',
      'Verzending via WeTransfer',
      'Minimaal een jaar archivering',
      'Airconditioning, uit tijdens opname',
    ],
    blokken: [
      { kop: 'In &eacute;&eacute;n keer opnemen', tekst: 'Tunes, jingles en muziek kunnen live worden ingestart, waardoor een compleet programma in &eacute;&eacute;n keer kan worden vastgelegd. Dat maakt de productie zeer kosteneffici&euml;nt. Wij raden aan om tijdens de opname zo min mogelijk te stoppen, dat komt de flow van het gesprek ten goede.' },
      { kop: 'Toch in delen', tekst: 'Moet het per se, dan kunnen onderdelen los van elkaar worden opgenomen of fragmenten opnieuw. Opname- en montagetijd worden dan wel langer.' },
      { kop: 'Afwerking en levering', tekst: 'Na de montage volgt de soundprocessing. Daarna is het WAV-bestand klaar; vanwege de bestandsgrootte coderen we dat meestal ook naar MP3. Verzending gaat onder meer via WeTransfer.' },
      { kop: 'Archivering', tekst: 'Wij bewaren uw podcast minimaal een jaar gratis in ons archief. Gaat er iets mis met uw eigen bestand, dan kunt u daarop terugvallen.' },
    ],
  },
  {
    slug: 'greenroom',
    fotos: [
      { bestand: 'greenroom', alt: 'De greenroom met de grote tafel, het afkijkscherm en de pantry' },
    ],
    naam: 'Greenroom',
    type: 'Productieruimte',
    zin: 'De productieruimte waar sprekers en gasten wachten, voorbereiden en eten. Los te huren, maar inbegrepen bij de huur van een studioruimte.',
    kerncijfers: [
      ['Vloeroppervlak', '4,90 &times; 6,40 m'],
      ['Hoogte', '2,75 m'],
      ['Plaatsen', 'Circa acht aan tafel'],
      ['Bij studiohuur', 'Inbegrepen'],
    ],
    inbegrepen: [
      'Grote tafel voor circa acht personen',
      'Afkijkscherm met beeld uit Studio A',
      'Laptopaansluiting voor PowerPoint',
      'Koffie, thee en frisdrank',
      'Pantry met koelkast, vriezer en magnetron',
      'Aparte drankenkoelkast',
      'Ruimte om maaltijden te gebruiken',
      'Ventilatie en airconditioning',
    ],
    blokken: [
      { kop: 'Zelfbediening of gastheer', tekst: 'Catering gaat standaard op basis van zelfbediening. Optioneel zorgen wij voor een gastheer of gastvrouw voor de opvang en verzorging van sprekers en gasten.' },
      { kop: 'Meekijken', tekst: 'Op het afkijkscherm volgt u wat er in Studio A gebeurt. Handig voor sprekers die later aan de beurt zijn, en voor opdrachtgevers die meekijken zonder in de studio te staan.' },
    ],
  },
  {
    slug: 'visagie',
    fotos: [
      { bestand: 'visagie', alt: 'De visagieruimte met twee werkplekken en spiegels met werkverlichting' },
    ],
    naam: 'Visagieruimte',
    type: 'Visagie',
    zin: 'Een visagieruimte met goede spiegels, waar twee sprekers tegelijk kunnen worden opgemaakt. Wordt apart verhuurd wanneer die als werkruimte van een visagist wordt gebruikt.',
    kerncijfers: [
      ['Plaatsen', 'Twee tegelijk'],
      ['Per spreker', 'Circa 15 tot 45 min'],
      ['Verhuur', 'Apart, bij inzet visagist'],
      ['Advies', 'Reservekleding meenemen'],
    ],
    inbegrepen: [
      'Goede spiegels en werkverlichting',
      'Twee werkplekken',
      'Televisiemake-up',
      'Ruimte om kleding te wisselen',
    ],
    blokken: [
      { kop: 'Plan er tijd voor', tekst: 'Maak een haalbaar schema om alle sprekers die in beeld komen van televisiemake-up te voorzien. Reken op circa 45 minuten voor een vrouw en 15 minuten voor een man.' },
      { kop: 'Kleding', tekst: 'Draag kleding die geschikt is voor televisieoptredens en neem reservekleding mee. Wij sturen vooraf de bijlage &ldquo;Tips voor optredens op televisie&rdquo; mee.' },
    ],
  },
];

// --- maatvoering van de ruimtes --------------------------------------------
// Puur hun eigen cijfers, hierboven in kerncijfers, nog een keer als getal
// zodat blokken.mjs er een maatschets van kan tekenen. De schets toont alleen
// de afmeting van elke ruimte op schaal, naast elkaar ter vergelijking - geen
// plattegrond van het gebouw. Hoe de ruimtes ten opzichte van elkaar liggen
// staat nergens op hun site en dat verzinnen we niet.
export const MATEN = [
  { slug: 'studio-a', naam: 'Studio A', b: 9.75, d: 7.30, h: 2.75 },
  { slug: 'regie-a', naam: 'Regie A', b: 9.75, d: 5.25, h: 2.75 },
  { slug: 'studio-b', naam: 'Studio B', b: 6.35, d: 6.30, h: 2.75 },
  { slug: 'greenroom', naam: 'Greenroom', b: 4.90, d: 6.40, h: 2.75 },
];

// --- eigen video ------------------------------------------------------------
// Van hun eigen YouTube-kanaal (@framemedia8564, uitgelezen 01-10-2026, 20 van
// de 27 video's opgehaald). Titel, lengte en datum zijn van YouTube; de regel
// "bij" is onze indeling. De thumbnails staan lokaal in assets/video/thumbs/
// als webp - niet hotlinken naar i.ytimg.com, want die adressen zijn
// ondertekend en verlopen.
//
// Afspelen gebeurt pas na een klik, in een youtube-nocookie-insluiting. Er
// staat dus geen YouTube-script op de pagina tot de bezoeker erom vraagt.
export const VIDEOS = [
  // Geen uitgezonden item maar een introductiefilm die met AI is gemaakt, om
  // een indruk te geven hoe zo'n item eruitziet (klant, 10-10-2026). Stond
  // eerst als 'SBS 6' op de site; dat label suggereerde een uitzending.
  { id: 'deTdhbPWHEw', titel: 'Puur Genieten', bij: 'Introductie, met AI gemaakt', duur: '2:34', jaar: '2026' },
  { id: 'hph7jDwIAck', titel: 'Kempkes Mode', bij: 'Puur Genieten, SBS 6', duur: '3:08', jaar: '2026' },
  { id: 'UAUAB-dQgP4', titel: 'Hyde Park', bij: 'RTL 4', duur: '2:57', jaar: '2023' },
  { id: 'nnXSpXg--8o', titel: 'Algotrade', bij: 'RTL 4', duur: '1:58', jaar: '2023' },
  { id: 'iEV0h4Me6Zs', titel: 'Moderne Kunst', bij: 'RTL 4', duur: '1:43', jaar: '2023' },
  // Heet op hun eigen kanaal 'Life Is Beautiful'; 19-10-2026 op verzoek van de
  // klant hernoemd naar Puur Genieten - dat is de naam die het programma nu
  // draagt. Het beeld van de leader draagt nog de oude naam, dus de thumbnail
  // is vervangen door het Puur Genieten-logo (maak-pg-thumb.mjs). Daarom ook
  // een eigen alt-tekst: het is geen beeld uit de film maar een logo.
  { id: '5vDZX9njxsI', titel: 'Puur Genieten', bij: 'Leader, RTL 4', duur: '0:20', jaar: '2022', alt: 'Het logo van Puur Genieten' },
  // 'Hey Baby' (v4jBMUAzz4U, format RTL 4) stond hier als kaart; 19-10-2026 op
  // verzoek van de klant van de site af. Het tekstblok bij EIGEN_FORMATS staat
  // er nog, dat is hun eigen formatlijst.
  { id: '0k0XVDhqFOw', titel: 'Code Blauw', bij: 'Pilot, met Klaas Wilting', duur: '0:54', jaar: '2021' },
  { id: 'LyYLSzc4GgQ', titel: 'Ren je Rot', bij: 'Format, met Bart Bosch', duur: '0:40', jaar: '2021' },
  // Stond als ConnectCar op hun eigen YouTube-kanaal; 10-10-2026 op verzoek van
  // de klant hernoemd naar De Bauertjes. De ConnectCar-reeks hieronder bij
  // EIGEN_FORMATS is een ander ding en blijft staan.
  { id: '_iHCL5n1Yis', titel: 'De Bauertjes', bij: 'Branded content', duur: '2:15', jaar: '2021' },
  // Stond als GreenVision TV op hun eigen YouTube-kanaal; 10-10-2026 op
  // verzoek van de klant hernoemd naar Puur Genieten. Derde kaart met die
  // naam - het label eronder houdt ze uit elkaar.
  { id: 'fI2kSRnNMFU', titel: 'Puur Genieten', bij: 'Branded content', duur: '1:31', jaar: '2021' },
  // Stond als Gadget TV op hun eigen YouTube-kanaal; 10-10-2026 op verzoek van
  // de klant hernoemd naar Puur Genieten. Vierde kaart met die naam - het label
  // eronder houdt ze uit elkaar. Gadget TV blijft wel staan in EERDER, dat is
  // een echte productie uit hun verleden.
  { id: '65IBEqDsmA8', titel: 'Puur Genieten', bij: 'Format', duur: '2:33', jaar: '2021' },
  // Stond als Life Is Beautiful Deutschland op hun eigen YouTube-kanaal;
  // 10-10-2026 eerst hernoemd naar Puur Genieten, daarna met een schermfoto
  // van deze kaart gecorrigeerd naar Purer Genoss Deutschland - de Duitse
  // versie heeft een eigen naam. Het tekstblok met de oude naam bij
  // EIGEN_FORMATS staat nog open.
  { id: 'mQz7qHNO30g', titel: 'Purer Genoss Deutschland', bij: 'Pilot', duur: '12:28', jaar: '2021' },
  // Heet op hun eigen kanaal 'Rolo in de Disco' en stond op hun formatpagina
  // bij het blok Rolo Commercial; 10-10-2026 op verzoek van de klant als kaart
  // toegevoegd onder de naam TV Sinds 1981. Duur en datum van YouTube
  // (95 seconden, geplaatst 29-04-2021); het spotje zelf is ouder.
  { id: '-ukWLwLRgsc', titel: 'TV Sinds 1981', bij: 'Rolo Commercial', duur: '1:35', jaar: '2021' },
];

// --- branches Puur Genieten -------------------------------------------------
// Acht clips, door de klant aangeleverd via WeTransfer: staand (720x1280) op
// 08-10-2026 en liggend (4K) op 18-10-2026, Tuinen alleen staand. De
// branchenaam komt uit de bestandsnaam; de originelen staan in
// playground/.aangeleverd-framemedia/ (buiten de projectmap) en de webversies
// worden gemaakt met maak-branches.mjs. Welke van de twee de bezoeker krijgt
// hangt van zijn schermbreedte af, zie blokken.mjs bij `brancheKaart`.
// Dit zijn eigen bestanden, geen YouTube - ze spelen in de pagina zelf.
//
// Een ding is van ons en niet van hen: de volgorde (alfabetisch). De "2 " voor
// Golfen was een nummering in hun map, geen onderdeel van de naam.
//
// Onder elke naam stond een regel van ons ("Makelaars en aanbieders van een
// tweede huis") die ik had afgeleid uit wat er in de clip te zien is. Op
// 11-10-2026 eruit op verzoek van de klant: over Puur Genieten mag alleen
// staan wat uit hun eigen brochure komt, en daar staan die regels niet in.
//
// `tekst` staat er sinds dezelfde dag weer in, maar wordt alleen nog getekend
// door het blok `branchesVol` - en dat blok staat op precies een pagina: optie
// 1 van de landingspagina. Overal elders (startpagina, optie 2) draagt de
// kaart alleen de naam. Zie LEESMIJ.md, "Twee versies van de landingspagina".
export const BRANCHES = [
  { slug: '2nd-home', naam: '2nd home', duur: '0:26', tekst: 'Makelaars en aanbieders van een tweede huis.' },
  { slug: 'beautyfarm', naam: 'Beautyfarm, Wellness &amp; Spa', duur: '0:29', tekst: 'Resorts, sauna&rsquo;s en spa&rsquo;s.' },
  { slug: 'eten-en-drinken', naam: 'Eten en drinken', duur: '0:26', tekst: 'Restaurants, producenten en speciaalzaken.' },
  { slug: 'golfen', naam: 'Golfen', duur: '0:25', tekst: 'Banen, clubs en alles eromheen.' },
  { slug: 'massage', naam: 'Massage', duur: '0:14', tekst: 'Praktijken en behandelcentra.' },
  { slug: 'meubelzaak', naam: 'Meubelzaak', duur: '0:19', tekst: 'Woonwinkels en interieurmerken.' },
  { slug: 'reizen', naam: 'Reizen', duur: '0:23', tekst: 'Reisorganisaties en bestemmingen.' },
  { slug: 'tuinen', naam: 'Tuinen', duur: '0:26', tekst: 'Tuincentra, hoveniers en buitenleven.' },
];

// --- Puur Genieten: de verkoopbrochure van de klant -------------------------
// Pdf van vier pagina's, 10-10-2026 door de klant aangeleverd ("Proost op het
// leven!", SBS6 + KIJK + FRAME MEDIA). Alles hieronder staat woordelijk in die
// brochure; het origineel ligt in raw/brochure-puur-genieten.pdf.
//
// Twee dingen zijn van ons en niet van hen. De brochure schrijft "je" en "jouw"
// en de site spreekt de bezoeker overal met "u" aan, dus de aanspreekvorm is
// omgezet. En in hun lijst staat "Persoonlijke, zoals huid, haar, nagels en
// parfums" - daar is een woord weggevallen; wij maken er "Persoonlijke
// verzorging" van.
export const PG_KIJKER = 'Puur Genieten is een lifestyleprogramma voor kijkers die bewust genieten van het leven. De doelgroep bestaat uit mannen en vrouwen van circa 20 tot 70 jaar, met interesse in kwaliteit, gezondheid, uiterlijke verzorging, luxe, gezonde voeding, comfort en een prettige levensstijl.';

// De tien lifestylecategorieen uit de brochure, in hun eigen volgorde (zij
// zetten ze in twee kolommen; dit is kolom voor kolom gelezen).
export const PG_CATEGORIEEN = [
  'Reizen en vakanties',
  'Second homes, villa&rsquo;s, bungalows en glamping',
  'Gadgets en innovaties',
  'Eten en drinken',
  'Ontspanning en wellness',
  'Interieur, wonen en tuin',
  'Duurzaamheid en elektrisch rijden',
  'Fashion, modeaccessoires en sieraden',
  'Bewegen, fitness en vitaliteit',
  'Persoonlijke verzorging: huid, haar, nagels en parfums',
];

export const PG_ANDERS = 'Ook binnen andere branches zijn er mogelijkheden, zolang het bedrijf of merk past bij de uitstraling en de doelgroep van het programma.';

// Hun blok "Waarom deelnemen?".
export const PG_OPBRENGST = [
  'Landelijke zichtbaarheid via televisie en online video',
  'Professionele videoproductie zonder groot reclamebudget',
  'Een sterke combinatie van televisie, KIJK en social media',
  'Meer vertrouwen, herkenning en merkpositionering',
  'Een rechtenvrij item dat u ook na de uitzending zelf kunt blijven gebruiken',
];

// Hun blok "Wat ontvang je als deelnemer?" - waar het item daarna mag staan.
export const PG_GEBRUIK = [
  'Website en social media',
  'Beurzen en presentaties',
  'Showroom of etalage',
  'Nieuwsbrieven en andere marketinguitingen',
];

// De vier clips die samen de showreel in de hero vormen, in volgorde. Geknipt
// uit bovenstaande video's met ffmpeg (zie LEESMIJ.md). Staat hier zodat de
// bijschrift-regel onder de hero klopt met wat er daadwerkelijk te zien is.
// Triple Dutch zat er als vijfde in en Quiz Masters als zesde; allebei op
// 10-10-2026 op verzoek van de klant eruit, zowel de clip als de videokaart.
export const SHOWREEL = ['Life Is Beautiful', 'Hyde Park', 'Puur Genieten', 'Kempkes Mode'];

// --- formats ---------------------------------------------------------------
export const OP_RTL4 = [
  'High End Nutrition', 'Million Euro Listing', 'Triple Dutch', 'Toptafels',
  'Moderne Kunst', 'Hyde Park', 'Algotrade',
];

export const EIGEN_FORMATS = [
  { naam: 'Code Blauw', bij: 'De roerige jaren van &hellip;', tekst: 'Klaas Wilting was van 1980 tot en met 2000 het gezicht van de Amsterdamse politie. Als woordvoerder in deze roerige tijden zag hij de stad van dichtbij veranderen. De eerste opnames van de pilot zijn gemaakt.' },
  { naam: 'Hey Baby', bij: 'Zwangerschap en opvoeding', tekst: 'Een vrolijke duik in de wereld van zwangerschap, geboorte en opvoeding. Met handige tips voor tijdens de zwangerschap, voeding voor moeder en kind, gezondheidstips en de leukste kraam- en kindercadeaus.' },
  { naam: 'Ren je Rot', bij: 'Met Bart Bosch', tekst: 'Laat je kindertijd weer leven met Bart Bosch.' },
  // De omschrijving stond hier eerst in onze eigen woorden ("voor merken die
  // zich met eten, drinken en beleving willen verbinden"). Hun eigen site zegt
  // over Puur Genieten niets - die pagina is alleen een formulier - dus dat was
  // verzonnen. Sinds 11-10-2026 staat hier de zin uit hun eigen brochure.
  { naam: 'Puur Genieten', bij: 'SBS6, KIJK en social media', tekst: 'Een lifestyleprogramma voor kijkers die bewust genieten van het leven. De uitzending gaat tweemaal op SBS6 de lucht in en is daarnaast te zien via KIJK.' },
  { naam: 'Mondzorg.TV', bij: 'Informatief format', tekst: 'Een informatief format voor mondzorgpraktijken die zich willen profileren en over hun expertise willen vertellen, met als doel mensen weer naar de specialist te krijgen voor de verzorging van hun gebit.' },
  { naam: 'ConnectCar', bij: 'Met Raymond Beense', tekst: 'Meerdelige reeks rond deelmobiliteit. Eigenaar Hemmie Kerklingh demonstreert hoe de Connectcar in de stad op te halen en te parkeren is; presentatrice Laurentien laat zien hoe je er met een smartphone in stapt en wegrijdt.' },
  { naam: 'Boeken als evenement', bij: 'Format', tekst: 'Boeken uit de kast en het podium op: een format dat lezen als uitje neerzet in plaats van als bezigheid voor thuis.' },
  { naam: 'Life Is Beautiful Deutschland', bij: 'Pilot', tekst: 'De pilot van Life Is Beautiful voor de Duitse markt.' },
  { naam: 'Rolo Commercial', bij: 'Sinds 1981', tekst: 'Onze reclametak. Wij maken tv-reclame sinds 1981.' },
];

export const EERDER = [
  'Life Is Beautiful', 'De Ondernemersclub', 'Hollandse Hap', 'Natuurlijk Lekker Leven',
  'Supervrouwen', 'Summertime', 'Ondernemen Met Passie', 'Ik Zou Wel Eens Willen Weten',
  'Gadget TV', 'Beautiful City', 'Amsterdamse Ondernemers',
];

// --- referenties -----------------------------------------------------------
// Letterlijk de lijst van framemedia.tv/referenties/, in hun volgorde.
// De drie zenders die er in hun lijst tussen stonden (AT-5, RTL, SBS) zijn
// eruit: die horen bij de zenderrij, niet bij de opdrachtgevers.
export const REFERENTIES = [
  'Electroworld', 'Febo', 'Kesbeke', 'KAV Autoverhuur', 'Far Out', 'CARD Deutschland',
  'Etos', 'Oost Slaapcomfort', 'S. Oliver', 'Miss Etam', 'RAI', 'Van der Valk Maritiem',
  'Helisports', 'Bang &amp; Olufsen', 'China Airlines', 'Struik', 'Grohe Nederland',
  'Techcomlight', 'Fortados', 'Melle', 'Geisha', 'Kwekkeboom', 'H&auml;stens Bedden',
  'Beauty Pillow', 'Cravt Original', 'Bessima', 'Scropp', 'Deadsea Beauty', 'Fit 20',
  'Jaarbeurs', 'Mijn Leesbril', 'Parcelbox 4U', 'Joker Boat', 'Van Ree Beheer',
  'Louwman Executive', 'Airbus', 'Harbour Village', 'MB Cosmetics', 'TipTop Projects',
  'Lasik Oogcentrum', 'ANZ Raamdeco', 'Panorama Rail', 'Romex Investments', 'SP-Acces',
  'Royaan', 'Fuse Communications', 'Van Vliet', 'ConnectCar', 'HFL Laboratories',
  'Les Pieds', 'Clean &amp; Green', 'Landberg', 'Dorema', 'Beauty Alliens',
  'Polikliniek de Baak', 'Geamoor', 'Rivo', 'X-treme Smile', 'Naturelly Beds',
  'Eric Kant', 'Culimaat Keukens', 'Panache Wijnen', 'Witkar', 'Bubblelodges',
  'VSoundbox', 'Grace Bikes', 'Eco Traveller', 'Menrad NL', 'Streetstyle', 'Sharefoods',
  'Golfresort &rsquo;t Caves', 'ST&amp;T Lelystad', 'B&amp;W Cosmetics', 'Huis van de Kunst',
  'Pakkend Media', 'Mingle Media', 'Alpendreams', 'Curasano', 'Jeunesse', 'OCC Yachting',
  'Blokhutboot', 'Para Mi', 'Brunotti', 'Tribest', 'Vivera', 'Sustar', 'Cystac',
  'Smashed Lemon',
];

// --- veelgestelde vragen ---------------------------------------------------
// Van ons, op basis van wat er feitelijk op hun site staat. Zie LEESMIJ.md.
export const VRAGEN = [
  {
    v: 'Is dit reclame of is het een programma?',
    a: 'Het is een redactioneel item binnen een programma, betaald door u. Dat heet non-spot. De Mediawet stelt daar eisen aan en elk item wordt daaraan getoetst voordat het wordt uitgezonden. De kijker ziet een programma-item, geen reclameblok.',
  },
  {
    v: 'Wat kost het?',
    a: 'Een all-in item van drie minuten kost 2990 en vier minuten 3950. Daar zit alles in: voorbereiding, opname, productie, montage, presentatie, muziekrechten, zenderfee en de uitzending. De prijs van 5, 6 of 9 minuten geven wij op aanvraag.',
  },
  {
    v: 'Waar wordt er opgenomen?',
    a: 'Meestal bij u op locatie, want uw eigen bedrijf vertelt het verhaal het beste. Wilt u een interview in de studio in Hilversum, dan kan dat als optie erbij.',
  },
  {
    v: 'Wanneer wordt het uitgezonden?',
    a: 'De programma&rsquo;s worden veelal in de ochtenden en middagen in de weekeinden uitgezonden op de commerci&euml;le zenders. Hoe vaak uw item de lucht in gaat, hangt af van het programma; bij het kennismakingsgesprek hoort u welke uitzendmomenten er voor u in beeld zijn.',
  },
  {
    v: 'Mag ik het item zelf gebruiken?',
    a: 'Ja. U krijgt een digitaal item voor eigen gebruik, dus op uw eigen website en in uw eigen kanalen. Daarnaast plaatsen wij het op social media.',
  },
  {
    v: 'Bepaal ik zelf waar het over gaat?',
    a: 'U heeft de regie in eigen handen. U bepaalt het onderwerp, en voordat de opnames starten ligt er een draaiboek klaar dat op uw wensen aansluit.',
  },
  {
    v: 'Hoe lang duurt het hele traject?',
    a: 'Dat hangt af van het programma en de uitzendplanning van de zender. Bij het kennismakingsgesprek geven wij aan welke uitzendmomenten er in beeld zijn en wat dat voor de planning betekent.',
  },
  {
    v: 'Ik heb zelf een idee voor een programma. Kan dat?',
    a: 'Ja, daar is een aparte route voor. Wij beoordelen het idee op inhoud en op sponsoring, en leggen het na overeenstemming voor aan de commerci&euml;le zenders. Alle idee&euml;n worden vertrouwelijk behandeld.',
  },
];
