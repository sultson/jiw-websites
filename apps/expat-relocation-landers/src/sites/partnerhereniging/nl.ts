import type { LanderContent } from '../types';

/**
 * partnerhereniging.nl, Nederlands.
 *
 * Zoekintentie: "ik wil mijn partner naar Nederland halen". Deze pagina gaat
 * dus over immigratie, niet over het examen. Het basisexamen inburgering
 * buitenland komt alleen voor als voorwaarde en als onderdeel van het complete
 * traject; het is nooit het onderwerp. Twee commerciële keuzes, één lead.
 *
 * Tweede ronde, na de feedback van de klant van 31-08. Wat er is veranderd:
 * de pagina opent op een gezicht in plaats van op een kleurvlak, er staat op
 * elk scherm een mens, er is een interactieve situatiecheck bijgekomen, een
 * vergelijking die de vraag "waarom jullie" concreet beantwoordt, en op elk
 * blok een weg terug naar het formulier. Elke claim hieronder is er een die
 * de klant zelf heeft aangeleverd; er staan geen verzonnen cijfers of
 * ervaringen op de pagina.
 */
export const nl: LanderContent = {
  lang: 'nl',
  meta: {
    title: 'Partnerhereniging Nederland: hulp bij de MVV/TEV-aanvraag',
    description:
      'Wilt u uw partner uit het buitenland naar Nederland halen? Wij bereiden uw MVV/TEV-partneraanvraag professioneel voor, inclusief documentencheck en begeleiding. Vanaf €799 excl. btw.',
    imageAlt: 'Stel lacht samen op een brug over een Amsterdamse gracht',
  },
  nav: {
    links: [
      { label: 'Uw situatie', href: '#situatie' },
      { label: 'Doe de check', href: '#check' },
      { label: 'Begeleiding', href: '#begeleiding' },
      { label: 'Ervaringen', href: '#ervaringen' },
      { label: 'Vragen', href: '#vragen' },
    ],
    cta: { label: 'Start mijn aanvraag', href: '#contact' },
    langSwitch: 'English',
    tagline: 'Specialist in partnerhereniging en Nederlandse immigratieprocedures sinds 2009',
  },
  hero: {
    eyebrow: 'Partnerhereniging · specialist sinds 2009',
    route: { from: 'Uw partner in het buitenland', to: 'Samen in Nederland' },
    h1: 'Wilt u uw partner <span class="hl">naar Nederland</span> halen?',
    intro: [
      'Woont uw partner nog in het buitenland en wilt u samen in Nederland verder? Wij bereiden uw MVV/TEV-partneraanvraag professioneel voor, van documentencheck tot indiening, en verzorgen waar nodig ook de A1-examenvoorbereiding. Eén aanspreekpunt, tot uw partner bij u thuis is.',
    ],
    benefits: [
      'Persoonlijke begeleiding',
      'Documentenchecklist op maat',
      'Professionele dossieropbouw',
      'Compleet traject met A1-voorbereiding',
    ],
    offer: {
      name: 'MVV/TEV-partneraanvraag',
      price: 'vanaf €799 excl. btw',
      note: 'Dit tarief betreft onze dienstverlening. Leges van de overheid en kosten van derden zijn niet inbegrepen, tenzij uitdrukkelijk anders overeengekomen.',
    },
    cta: { label: 'Start mijn partneraanvraag', href: '#aanvraag', situation: 'Hero' },
    whatsappCta: 'WhatsApp direct',
    note: 'Wij nemen persoonlijk contact met u op, meestal binnen één werkdag.',
    proof: {
      quote: 'Dankzij Immigration Services NL konden wij eindelijk samen zijn. Ze zagen ons niet als dossier, maar als gezin.',
      name: 'Emily',
      context: 'Canada naar Nederland',
    },
    photo: {
      src: '/images/ph-hero.jpg',
      alt: 'Stel lacht samen op een brug over een Amsterdamse gracht, met grachtenpanden en fietsen op de achtergrond',
    },
  },
  stats: [
    { value: 'Sinds 2009', label: 'gespecialiseerd in Nederlandse immigratieprocedures' },
    { value: '1500+', label: 'cliënten wereldwijd begeleid' },
    { value: '1 vast', label: 'aanspreekpunt voor uw hele dossier' },
    { value: 'NL · EN', label: 'begeleiding in twee talen' },
  ],
  explain: {
    eyebrow: 'Uw situatie',
    heading: 'Is dit uw situatie?',
    body: [
      'Bij partnerhereniging vraagt u als referent in Nederland verblijf aan voor uw partner die nog in het buitenland woont. Meestal loopt dat via de TEV-procedure, waarin de machtiging tot voorlopig verblijf (MVV) en de verblijfsvergunning in één aanvraag worden beoordeeld.',
      'Wat u precies moet aantonen, hangt af van uw inkomen, de nationaliteit van uw partner en uw relatievorm: gehuwd, geregistreerd partner of ongehuwd samenwonend. Daar gaat het in de praktijk het vaakst mis. Een dossier dat op één onderdeel niet compleet is, levert vragen en vertraging op.',
    ],
    pointsStyle: 'quotes',
    points: [
      'Mijn partner woont nog in het buitenland.',
      'Wij willen samen verder, hier in Nederland.',
      'Wij zijn niet getrouwd, maar wel al jaren samen.',
      'Ik weet niet of mijn inkomen genoeg is.',
      'Heeft mijn partner een MVV nodig?',
      'Moet mijn partner eerst het basisexamen halen?',
    ],
    cta: { label: 'Bespreek mijn situatie', href: '#contact', situation: 'Uw situatie' },
    photo: {
      src: '/images/ph-afstand.jpg',
      alt: "Vrouw videobelt 's avonds vanuit haar Nederlandse woonkamer met haar partner in het buitenland",
    },
    photoNote:
      'De afstand is het echte probleem, niet het formulier. Hoe eerder wij weten wat er in uw situatie geldt, hoe korter die afstand duurt.',
  },
  checker: {
    eyebrow: 'Doe de check',
    heading: 'Welke route geldt in uw situatie?',
    intro:
      'Drie vragen, en u ziet welke van onze twee trajecten bij u past. Dit is een eerste wegwijzer en geen beoordeling van uw aanvraag; die maken wij pas nadat wij uw documenten hebben gezien.',
    questions: [
      {
        id: 'partner',
        label: 'Waar woont uw partner nu?',
        options: ['In het buitenland', 'Al in Nederland'],
      },
      {
        id: 'relatie',
        label: 'Wat is uw relatievorm?',
        options: ['Getrouwd', 'Geregistreerd partnerschap', 'Ongehuwd samenwonend', 'Wij willen nog trouwen'],
      },
      {
        id: 'examen',
        label: 'Basisexamen inburgering buitenland al behaald?',
        options: ['Ja, behaald', 'Nee, nog niet', 'Vrijgesteld', 'Weet ik niet'],
      },
    ],
    resultKey: 'examen',
    resultDefault: {
      title: 'Beantwoord de drie vragen hiernaast',
      body: 'Dan ziet u meteen welk traject bij uw situatie hoort en wat dat bij ons kost. Uw antwoorden gaan mee naar het formulier, zodat ons eerste gesprek meteen ergens over gaat.',
    },
    results: {
      'Ja, behaald': {
        title: 'De MVV/TEV-partneraanvraag past bij u',
        body: 'Het examen staat u niet meer in de weg. Wij beoordelen uw route, stellen de documentenchecklist op, controleren uw bewijsstukken en bereiden de aanvraag voor. Dat is onze dienst van €799 excl. btw.',
      },
      Vrijgesteld: {
        title: 'De MVV/TEV-partneraanvraag past bij u',
        body: 'Is uw partner vrijgesteld van de examenplicht, dan gaat u rechtstreeks naar de aanvraag. Wij toetsen de vrijstelling voordat wij beginnen en bouwen daarna het dossier op. €799 excl. btw.',
      },
      'Nee, nog niet': {
        title: 'Het complete partnertraject past bij u',
        body: 'Geldt de examenplicht voor uw partner, dan moet het examen zijn behaald voordat de MVV kan worden afgegeven. In het complete traject van €1.199 excl. btw verzorgen wij de A1-voorbereiding en de aanvraag samen, met één aanspreekpunt.',
      },
      'Weet ik niet': {
        title: 'Dit zoeken wij eerst voor u uit',
        body: 'Of de examenplicht geldt, hangt af van de nationaliteit van uw partner, het verblijfsdoel en mogelijke vrijstellingen. Wij stellen dat vast voordat er iets wordt ingediend. Pas daarna weet u welk traject u nodig heeft.',
      },
    },
    note: 'Wat dit betekent',
    cta: { label: 'Bespreek deze uitkomst', href: '#contact', situation: 'Situatiecheck' },
    photo: {
      src: '/images/ph-station.jpg',
      alt: 'Stel met een koffer op een Nederlands treinperron',
    },
  },
  packages: {
    eyebrow: 'Begeleiding',
    heading: 'Kies de begeleiding die bij u past',
    intro:
      'Twee mogelijkheden. Welke bij u past, hangt af van één vraag: moet uw partner nog het basisexamen inburgering buitenland afleggen?',
    cards: [
      {
        badge: 'Examen al behaald of vrijgesteld',
        title: 'MVV/TEV-partneraanvraag',
        price: '€799 excl. btw',
        body: 'Voor cliënten die het vereiste examen al hebben behaald, daarvan zijn vrijgesteld, of geen A1-voorbereiding van ons nodig hebben.',
        includesHeading: 'Inbegrepen',
        includes: [
          'Beoordeling van het immigratietraject',
          'Persoonlijke documentenchecklist',
          'Controle van uw bewijsstukken',
          'Voorbereiding van de MVV/TEV-aanvraag',
          'Professionele opbouw van het dossier',
          'Begeleiding tijdens de overeengekomen procedure',
          'Eén vast aanspreekpunt',
        ],
        cta: { label: 'Start mijn aanvraag', href: '#contact', situation: 'MVV/TEV-partneraanvraag €799' },
      },
      {
        badge: 'Meest gekozen · compleet traject',
        featured: true,
        title: 'Compleet partnertraject',
        price: '€1.199 excl. btw',
        body: 'Voor cliënten die zich nog moeten voorbereiden op het basisexamen inburgering buitenland en daarna de MVV/TEV-partneraanvraag nodig hebben.',
        includesHeading: 'Inbegrepen',
        includes: [
          '6 uur privé 1-op-1 voorbereiding op het A1-examen',
          'Voorbereiding op Spreken, Lezen en KNS',
          'Hulp bij het examenproces en de aanmelding, voor zover in de dienst inbegrepen',
          'Alles uit de MVV/TEV-partneraanvraag',
          'Persoonlijke documentenchecklist en controle van bewijsstukken',
          'Voorbereiding van de aanvraag en opbouw van het dossier',
          'Eén aanspreekpunt voor het complete traject',
        ],
        cta: { label: 'Start mijn complete traject', href: '#contact', situation: 'Compleet partnertraject €1.199' },
      },
    ],
    note: 'Deze tarieven betreffen onze dienstverlening. Leges van de overheid en kosten van derden, zoals legalisatie, vertalingen en het examen zelf, zijn niet inbegrepen tenzij uitdrukkelijk anders overeengekomen. De bevoegde instantie beslist over de aanvraag.',
  },
  compare: {
    eyebrow: 'Waarom wij',
    heading: 'Zelf uitzoeken, of het door ons laten voorbereiden',
    intro:
      'U mag de aanvraag zelf indienen. De vraag is alleen wat het u kost als er iets ontbreekt. Dit is het verschil, per onderdeel.',
    selfLabel: 'Zelf regelen',
    usLabel: 'Met ons',
    rows: [
      {
        topic: 'De route bepalen',
        self: 'U zoekt zelf uit of de TEV-procedure geldt, of uw partner MVV-plichtig is en of het basisexamen van toepassing is.',
        us: 'Wij stellen vooraf vast welke route en welke eisen in uw situatie gelden, voordat er iets wordt ingediend.',
      },
      {
        topic: 'De documenten',
        self: 'U verzamelt de bewijsstukken en merkt vaak pas na indienen dat er iets ontbreekt, verkeerd vertaald of niet gelegaliseerd is.',
        us: 'U krijgt een documentenchecklist op maat en wij controleren elk stuk voordat het in het dossier gaat.',
      },
      {
        topic: 'De inkomenseis',
        self: 'De bedragen worden twee keer per jaar aangepast en wat als duurzaam inkomen telt, verschilt per contractvorm.',
        us: 'Wij toetsen uw inkomen aan de eis die geldt op het moment van indienen en zeggen het u eerlijk als het nog niet haalbaar is.',
      },
      {
        topic: 'De onderbouwing',
        self: 'Bent u niet getrouwd, dan moet u zelf aannemelijk maken dat uw relatie duurzaam en exclusief is.',
        us: 'Wij bouwen die onderbouwing op zoals een beoordelaar hem leest, met de bewijsstukken die er in de praktijk toe doen.',
      },
      {
        topic: 'Als er iets verandert',
        self: 'U zoekt zelf uit wat een aanvullende vraag of een wijziging in uw situatie betekent voor de lopende aanvraag.',
        us: 'U belt één aanspreekpunt dat uw dossier kent en die dezelfde dag weet waar u staat.',
      },
      {
        topic: 'Wat het kost',
        self: 'Niets vooraf. Een afwijzing betekent wel een nieuwe aanvraag, opnieuw leges en opnieuw wachten.',
        us: 'Een vast tarief vanaf €799 excl. btw voor onze dienstverlening, vooraf met u afgesproken.',
      },
    ],
    note: 'Wij kunnen de uitkomst van een procedure nooit garanderen. De bevoegde instantie beslist over de aanvraag. Wat wij wel doen, is zorgen dat uw dossier compleet en onderbouwd wordt ingediend.',
    cta: { label: 'Laat ons uw dossier voorbereiden', href: '#contact', situation: 'Zelf of met ons' },
  },
  journey: {
    eyebrow: 'Het traject',
    heading: 'Van examenvoorbereiding tot aankomst in Nederland',
    intro:
      'Wij behandelen het examen en de aanvraag niet als twee losse zaken. Dit is de volgorde die wij aanhouden voor cliënten die beide nodig hebben, tot en met de eerste weken in Nederland.',
    items: [
      {
        title: 'A1-voorbereiding indien nodig',
        body: '6 uur privé 1-op-1 voorbereiding op het basisexamen inburgering buitenland.',
      },
      {
        title: 'Het examen',
        body: 'Voorbereiding op Spreken, Lezen en KNS, en hulp bij het examenproces.',
      },
      {
        title: 'MVV/TEV-aanvraag',
        body: 'Professionele voorbereiding van de partneraanvraag en de onderbouwing van uw dossier.',
      },
      {
        title: 'De procedure',
        body: 'Begeleiding tijdens de overeengekomen procedure, tot aan de beslissing.',
      },
      {
        title: 'Aankomst in Nederland',
        body: 'De MVV ophalen bij de ambassade, de verblijfspas bij de IND, inschrijven bij de gemeente. Ook daarbij kunnen wij u begeleiden.',
      },
    ],
    photos: [
      { src: '/images/ph-keukentafel.jpg', alt: 'Stel bereidt samen aan de keukentafel het examen voor op een laptop' },
      { src: '/images/ph-examen.jpg', alt: 'Man legt met een koptelefoon op het examen af achter een computer' },
      { src: '/images/ph-dossier.jpg', alt: 'Twee paar handen sorteren de documenten voor de aanvraag in een map' },
      { src: '/images/ph-gemeente.jpg', alt: 'Stel loopt lachend de trap af bij een Nederlands gemeentehuis' },
      { src: '/images/ph-aankomst.jpg', alt: 'Omhelzing in de aankomsthal van een Nederlandse luchthaven' },
    ],
    outcome: 'Eén doorlopend traject, één dossierstrategie, één aanspreekpunt.',
    cta: { label: 'Ik wil het complete traject', href: '#contact', situation: 'Het traject' },
  },
  relationship: {
    eyebrow: 'Relatievorm',
    heading: 'Getrouwd, geregistreerd of samenwonend?',
    intro:
      'Alle drie de vormen komen in aanmerking voor partnerhereniging. Wat verschilt, is wat u moet aantonen. Kies uw situatie.',
    tabs: [
      {
        label: 'Getrouwd',
        title: 'U bent getrouwd',
        body: 'Een in het buitenland gesloten huwelijk moet in Nederland erkend kunnen worden. Daarvoor moet de huwelijksakte in de meeste gevallen gelegaliseerd of van een apostille voorzien zijn en vertaald worden door een beëdigd vertaler.',
        points: [
          'Gelegaliseerde of geapostilleerde huwelijksakte',
          'Beëdigde vertaling waar dat vereist is',
          'Bewijs dat u beiden ongehuwd was op de huwelijksdatum',
          'De gebruikelijke eisen aan inkomen en verblijf van de referent',
        ],
      },
      {
        label: 'Geregistreerd partnerschap',
        title: 'U heeft een geregistreerd partnerschap',
        body: 'Een geregistreerd partnerschap wordt voor deze procedure in beginsel gelijkgesteld aan een huwelijk, mits het naar Nederlands recht als zodanig kan worden erkend. Niet elke buitenlandse samenlevingsvorm valt daaronder.',
        points: [
          'Bewijs van registratie, gelegaliseerd waar dat vereist is',
          'Toets of de registratie in Nederland erkend kan worden',
          'Beëdigde vertaling waar dat vereist is',
          'De gebruikelijke eisen aan inkomen en verblijf van de referent',
        ],
      },
      {
        label: 'Ongehuwd samenwonend',
        title: 'U woont ongehuwd samen',
        body: 'Ook zonder huwelijk kunt u een aanvraag doen. U moet dan aantonen dat sprake is van een duurzame en exclusieve relatie. Dat is het onderdeel waar in de praktijk het meest te winnen valt, omdat u het zelf moet onderbouwen.',
        points: [
          'Een relatieverklaring van u beiden',
          'Bewijs van contact en van bezoeken over een langere periode',
          'Bewijs dat u beiden ongehuwd bent',
          'Onderbouwing die laat zien dat de relatie duurzaam en exclusief is',
        ],
      },
    ],
    note: 'Twijfelt u of trouwen in uw situatie de snelste route is? Dat hangt af van uw land, uw documenten en uw planning. Leg het ons voor voordat u iets vastlegt.',
    cta: { label: 'Vraag het ons', href: '#contact', situation: 'Relatievorm' },
    photo: {
      src: '/images/ph-park.jpg',
      alt: 'Stel zit samen op een bank in een Nederlands stadspark in de herfst',
    },
  },
  help: {
    eyebrow: 'Werkwijze',
    heading: 'Hoe wij uw dossier aanpakken',
    intro:
      'Wij zijn sinds 2009 gespecialiseerd in Nederlandse immigratieprocedures en begeleiden cliënten uit de hele wereld. U krijgt antwoord in gewone taal, van iemand die uw dossier kent.',
    items: [
      {
        title: 'Eerst toetsen, dan pas indienen',
        body: 'Wij stellen vast welke route geldt en of u aan de eisen voldoet voordat er een aanvraag de deur uitgaat.',
      },
      {
        title: 'Uw bewijsstukken stuk voor stuk gecontroleerd',
        body: 'Legalisatie, vertaling, geldigheidsduur en inhoud, voordat een document in het dossier belandt.',
      },
      {
        title: 'Een dossier dat leest zoals het beoordeeld wordt',
        body: 'Wij bouwen de onderbouwing op in de volgorde waarin er naar gekeken wordt, niet in de volgorde waarin u het aanlevert.',
      },
      {
        title: 'Bereikbaar zolang de procedure loopt',
        body: 'Verandert er iets in uw werk, uw adres of uw relatie, dan weet u dezelfde dag wat dat betekent.',
      },
    ],
    cta: { label: 'Bespreek uw situatie', href: '#contact', situation: 'Werkwijze' },
    photo: {
      src: '/images/ph-advies.jpg',
      alt: 'Adviseur bespreekt aan tafel de aanvraag met een stel',
    },
    contact: {
      heading: 'Wie u aan de lijn krijgt',
      body: 'Geen callcenter en geen wisselende adviseurs. U spreekt met Johanna, oprichter van Immigration Services NL, of met een collega die uw dossier kent. Bellen, mailen of appen: u kiest.',
      name: 'Johanna',
      role: 'Oprichter, Immigration Services NL',
    },
  },
  reviews: {
    eyebrow: 'Ervaringen',
    heading: 'Wat cliënten zeggen',
    intro: 'Wij plaatsen alleen ervaringen die wij daadwerkelijk hebben ontvangen.',
    items: [
      {
        quote: 'Dankzij Immigration Services NL konden wij eindelijk samen zijn. Ze zagen ons niet als dossier, maar als gezin.',
        name: 'Emily',
        context: 'Canada naar Nederland',
      },
      {
        quote: 'Dankzij E & I was onze gezinshereniging een stressvrij proces. Alles werd perfect geregeld.',
        name: 'Anna',
        context: 'Rusland naar Nederland',
      },
      {
        quote: 'Ze hielpen me met elke stap en gaven nuttige adviezen waardoor ik mij meteen welkom voelde in Nederland.',
        name: 'Liam',
        context: 'Mexico naar Nederland',
      },
      {
        quote: 'Johanna stond de eerste dagen 24/7 voor ons klaar. Echt een unieke service!',
        name: 'Chinedu',
        context: 'Nigeria naar Nederland',
      },
    ],
    panel: {
      heading: 'Liever met een cliënt zelf spreken?',
      body: 'Wij verzinnen geen ervaringen en plaatsen geen slaagpercentages. Wilt u weten hoe het traject in de praktijk gaat, dan brengen wij u graag in contact met een cliënt die uw route al heeft afgelegd.',
      cta: { label: 'Vraag naar een referentie', href: '#contact', situation: 'Referentie gevraagd' },
    },
    countriesLabel: 'Cliënten uit onder meer',
    countries: ['India', 'Nigeria', 'Ghana', 'Suriname', 'Colombia', 'de Filipijnen', 'Turkije', 'de Verenigde Staten'],
    countriesNote: 'Waaronder stellen die u kent uit All You Need Is Love.',
    cta: { label: 'Start mijn partneraanvraag', href: '#contact', situation: 'Ervaringen' },
  },
  gallery: {
    eyebrow: 'Samen in Nederland',
    heading: 'Dit is waar de procedure over gaat',
    intro:
      'Niet over formulieren, maar over boodschappen doen op zaterdag, een sleutel die past en een tafel met te veel mensen eraan.',
    photos: [
      { src: '/images/ph-fietsen.jpg', alt: 'Stel fietst naast elkaar door een Nederlandse straat met bakstenen huizen' },
      { src: '/images/ph-markt.jpg', alt: 'Stel koopt tulpen op een Nederlandse markt op zaterdagochtend' },
      { src: '/images/ph-sleutel.jpg', alt: 'Stel staat met de sleutels in de deuropening van hun Nederlandse woning' },
      { src: '/images/ph-tuin.jpg', alt: 'Stel eet met Nederlandse familie en vrienden aan een lange tafel in de tuin' },
      { src: '/images/ph-strand.jpg', alt: 'Stel wandelt in de herfst over een leeg Nederlands strand' },
      { src: '/images/ph-aankomst.jpg', alt: 'Omhelzing in de aankomsthal van een Nederlandse luchthaven' },
    ],
    cta: { label: 'Begin aan uw aanvraag', href: '#contact', situation: 'Samen in Nederland' },
  },
  band: {
    heading: 'Samen wonen in Nederland',
    body: 'Achter elke aanvraag zit een stel dat samen verder wil. Daarom krijgt u bij ons één aanspreekpunt dat uw dossier kent en dat u kunt bellen als er iets verandert.',
    cta: { label: 'Start mijn partneraanvraag', href: '#contact', situation: 'Fotoband' },
    photo: {
      src: '/images/ph-band.jpg',
      alt: 'Stel staat in de schemering aan een Amsterdamse gracht met verlichte grachtenpanden',
    },
  },
  steps: {
    eyebrow: 'Zo begint het',
    heading: 'In drie stappen aan tafel',
    intro: 'Geen vragenlijst vooraf. U laat uw gegevens achter, de rest bespreken wij persoonlijk.',
    items: [
      {
        title: 'Laat uw gegevens achter',
        body: 'Naam, e-mail en een nummer waarop wij u kunnen bereiken. Meer hoeft nu niet.',
      },
      {
        title: 'Wij bellen u persoonlijk',
        body: 'Wij lopen uw situatie door en zeggen welke route en welk tarief daarbij horen.',
      },
      {
        title: 'Wij starten uw traject',
        body: 'Gaat u akkoord, dan beginnen wij met de documentencheck en de opbouw van uw dossier.',
      },
    ],
    cta: { label: 'Zet de eerste stap', href: '#contact', situation: 'Zo begint het' },
  },
  aside: {
    heading: 'Wilt u uw partner eerst laten overkomen voor een bezoek?',
    body: 'Voor een tijdelijk bezoek aan Nederland is een Schengenvisum de aangewezen route, niet de partnerprocedure. Wij verzorgen die aanvraag apart.',
    linkLabel: 'Vraag ons naar het Schengenvisum',
    href: '#contact',
  },
  faq: {
    eyebrow: 'Veelgestelde vragen',
    heading: 'Vragen die wij vaak krijgen',
    intro: 'Staat uw vraag er niet bij? Stel hem gerust, wij beantwoorden hem persoonlijk.',
    items: [
      {
        q: 'Heeft mijn partner een MVV nodig?',
        a: 'Dat hangt af van de nationaliteit van uw partner. Een deel van de nationaliteiten is vrijgesteld van de MVV-plicht, voor de overige geldt dat de MVV in het buitenland moet worden opgehaald voordat uw partner naar Nederland komt. In de TEV-procedure worden de MVV en de verblijfsvergunning in één aanvraag beoordeeld. Wij stellen vast welke route in uw situatie geldt.',
      },
      {
        q: 'Moet mijn partner het basisexamen inburgering buitenland halen?',
        a: 'Voor een deel van de aanvragers geldt die eis, afhankelijk van nationaliteit, verblijfsdoel en mogelijke vrijstellingen. Geldt de eis, dan moet het examen zijn behaald voordat de MVV kan worden afgegeven. Wij bekijken dit voordat wij aan de aanvraag beginnen, en verzorgen de voorbereiding binnen het complete partnertraject.',
      },
      {
        q: 'Welke inkomenseis geldt er voor mij?',
        a: 'Als referent moet u in beginsel zelfstandig en duurzaam beschikken over een inkomen dat ten minste gelijk is aan het minimumloon dat voor uw situatie geldt. Wat als duurzaam telt verschilt per contractvorm, en voor ondernemers gelden eigen regels. De bedragen worden twee keer per jaar aangepast. Wij toetsen uw situatie aan de eis die geldt op het moment van indienen.',
      },
      {
        q: 'Kunnen ongehuwde partners ook een aanvraag doen?',
        a: 'Ja. Naast gehuwden en geregistreerd partners kunnen ook ongehuwde partners een aanvraag doen. U moet dan aantonen dat sprake is van een duurzame en exclusieve relatie. Dat vraagt om onderbouwing met bewijsstukken, en juist daar valt in de praktijk het meest te winnen.',
      },
      {
        q: 'Hoe lang duurt de procedure?',
        a: 'De beslistermijn wordt door de bevoegde instantie bepaald en kan worden verlengd, bijvoorbeeld als er aanvullende vragen komen. Wat u zelf in de hand heeft, is de tijd vóór het indienen: legalisatie en vertaling van documenten in het buitenland kosten vaak meer weken dan mensen verwachten. Daar beginnen wij daarom als eerste mee.',
      },
      {
        q: 'Wat zit er in de MVV/TEV-partneraanvraag van €799?',
        a: 'De beoordeling van uw traject, een persoonlijke documentenchecklist, controle van uw bewijsstukken, de voorbereiding van de aanvraag en de opbouw van het dossier, plus begeleiding tijdens de overeengekomen procedure met één vast aanspreekpunt. Deze dienst is bedoeld voor cliënten die geen A1-voorbereiding van ons nodig hebben.',
      },
      {
        q: 'Wat zit er in het complete partnertraject van €1.199?',
        a: 'Alles uit de MVV/TEV-partneraanvraag, aangevuld met 6 uur privé 1-op-1 voorbereiding op het A1-examen, voorbereiding op Spreken, Lezen en KNS en hulp bij het examenproces. Eén aanspreekpunt voor het examen en de aanvraag samen.',
      },
    ],
  },
  finalCta: {
    eyebrow: 'Uw aanvraag',
    heading: 'Klaar om uw partneraanvraag te starten?',
    body: 'Of u het examen al achter de rug heeft of het complete A1- en MVV/TEV-traject nodig heeft: laat uw gegevens achter, dan nemen wij contact met u op over de juiste vervolgstap.',
    assurances: [
      'U spreekt iemand die uw soort dossier dagelijks behandelt',
      'Wij bespreken eerst uw situatie, daarna pas een voorstel',
      'Nederlands of Engels, wat u prettig vindt',
    ],
    directContact: 'Liever direct contact?',
    photo: {
      src: '/images/ph-avond.jpg',
      alt: 'Stel loopt in de avond samen door een Nederlandse straat met verlichte huizen',
    },
    cta: { label: 'Neem contact met mij op', href: '#contact', situation: 'Afsluitende CTA' },
  },
  form: {
    heading: 'Start uw partneraanvraag',
    intro: 'Wij nemen persoonlijk contact met u op. U hoeft vooraf geen vragenlijst in te vullen.',
    badge: 'Reactie binnen één werkdag',
    name: 'Volledige naam',
    namePlaceholder: 'Voor- en achternaam',
    email: 'E-mailadres',
    phone: 'Telefoon of WhatsApp',
    phoneHint: 'Inclusief landnummer, bijvoorbeeld +31 6 12345678',
    message: 'Waarmee kunnen wij u helpen?',
    messagePlaceholder:
      'Bijvoorbeeld: mijn partner woont in de Filipijnen, wij zijn getrouwd en willen de aanvraag starten.',
    optional: 'optioneel',
    consent: 'Ik ga akkoord met het',
    consentLink: 'privacybeleid',
    submit: 'Start mijn partneraanvraag',
    submitting: 'Versturen',
    error: 'Het versturen is niet gelukt. Probeer het opnieuw of stuur ons een WhatsApp-bericht.',
    privacyNote: 'Uw gegevens worden alleen gebruikt om contact met u op te nemen over uw aanvraag.',
  },
  whatsapp: {
    label: 'Stel uw vraag via WhatsApp',
    aria: 'Contact opnemen via WhatsApp',
    text: 'Hallo, ik heb een vraag over partnerhereniging en de MVV/TEV-aanvraag.',
  },
  exitIntent: {
    heading: 'Nog geen tijd om alles door te lezen?',
    body: 'Laat uw naam en nummer achter, dan bellen wij u en lopen wij uw situatie in tien minuten door. U zit nergens aan vast.',
    cta: { label: 'Bel mij terug', href: '#contact', situation: 'Exit intent' },
    dismiss: 'Nee, ik lees eerst verder',
    ariaClose: 'Sluiten',
  },
  stickyCta: 'Start mijn aanvraag',
  disclaimer:
    'Immigration Services NL is een onafhankelijke particuliere dienstverlener op het gebied van immigratie en is niet verbonden aan of onderdeel van de IND, DUO, de Nederlandse overheid, een gemeente, ambassade of consulaat. Genoemde tarieven hebben uitsluitend betrekking op onze dienstverlening. Leges van de overheid en kosten van derden zijn niet inbegrepen, tenzij uitdrukkelijk anders overeengekomen. De bevoegde instantie beslist uiteindelijk over de aanvraag.',
  footer: {
    about: 'Sinds 2009 begeleiden wij stellen bij partnerhereniging en Nederlandse immigratieprocedures.',
    contactHeading: 'Contact',
    legalHeading: 'Bedrijfsgegevens',
    privacy: 'Privacybeleid',
    rights: 'Alle rechten voorbehouden.',
  },
  thanks: {
    metaTitle: 'Bedankt voor uw aanvraag',
    heading: 'Dank u. Wij hebben uw gegevens ontvangen.',
    body: [
      'Wij nemen persoonlijk contact met u op om uw situatie te bespreken, meestal binnen één werkdag.',
      'Wilt u ons alvast verder helpen? Beantwoord hieronder een paar korte vragen. Dat is niet verplicht, uw aanvraag staat al bij ons genoteerd.',
    ],
    qualifyHeading: 'Help ons uw situatie sneller beoordelen',
    qualifyIntro: 'Hoe meer wij vooraf weten, hoe gerichter ons eerste gesprek is.',
    choose: 'Maak een keuze',
    fields: {
      location: {
        label: 'Waar woont uw partner op dit moment?',
        options: ['In het buitenland', 'In Nederland'],
      },
      situation: {
        label: 'Wat is uw relatievorm?',
        options: ['Getrouwd', 'Geregistreerd partnerschap', 'Ongehuwd partner', 'Wij willen eerst trouwen'],
      },
      exam: {
        label: 'Basisexamen inburgering buitenland al gedaan?',
        options: ['Ja, behaald', 'Nee, nog niet', 'Vrijgesteld', 'Weet ik niet'],
      },
      nationality: { label: 'Wat is de nationaliteit van uw partner?' },
      arrival: {
        label: 'Wanneer wilt u de aanvraag indienen?',
        hint: 'Een maand of een periode is genoeg',
      },
      notes: {
        label: 'Wilt u nog iets toevoegen?',
        placeholder: 'Bijvoorbeeld uw inkomenssituatie, kinderen, of een eerdere aanvraag.',
      },
    },
    submit: 'Antwoorden versturen',
    submitting: 'Versturen',
    done: 'Dank u wel.',
    doneBody: 'Uw aanvullingen zijn ontvangen. Wij nemen zo snel mogelijk contact met u op.',
    skip: 'Terug naar de website',
    error: 'Het versturen is niet gelukt. Probeer het opnieuw.',
  },
  privacy: {
    metaTitle: 'Privacybeleid',
    heading: 'Privacybeleid',
    updated: 'Laatst bijgewerkt: augustus 2026',
    sections: [
      {
        heading: 'Wie verwerkt uw gegevens',
        body: [
          'Immigration Services NL, onderdeel van E & I: Expat, Relocation and Immigration Services The Netherlands, Laan van Zuid Hoorn 70, Rijswijk, KvK 65768922, is verantwoordelijk voor de verwerking van de gegevens die u via deze website achterlaat.',
        ],
      },
      {
        heading: 'Welke gegevens wij verwerken',
        body: [
          'Via het contactformulier verwerken wij uw naam, e-mailadres, telefoon- of WhatsApp-nummer en de toelichting die u zelf invult. Vult u het aanvullende formulier op de bedanktpagina in, dan verwerken wij ook de antwoorden die u daar geeft.',
          'Daarnaast leggen wij technische gegevens vast die bij uw aanvraag horen, zoals de pagina waarop u het formulier heeft verzonden, de verwijzende website, het tijdstip van verzending en eventuele campagnegegevens uit de link waarmee u binnenkwam.',
        ],
      },
      {
        heading: 'Waarvoor en op welke grondslag',
        body: [
          'Wij gebruiken uw gegevens om contact met u op te nemen, uw situatie te beoordelen en u een passend voorstel te doen. De grondslag daarvoor is uw toestemming en, zodra er een opdracht ontstaat, de uitvoering van de overeenkomst.',
          'Wij gebruiken uw gegevens niet voor ongevraagde commerciële berichten en verkopen ze niet aan derden.',
        ],
      },
      {
        heading: 'Bewaartermijn',
        body: [
          'Aanvragen die niet tot een opdracht leiden bewaren wij maximaal twee jaar. Gegevens die horen bij een lopende of afgeronde opdracht bewaren wij zolang dat nodig is voor het dossier en de wettelijke bewaartermijnen.',
        ],
      },
      {
        heading: 'Ontvangers en verwerkers',
        body: [
          'Deze website en de verwerking van formulieren draaien op de infrastructuur van Cloudflare, Inc. Uw aanvraag wordt per e-mail aan ons verzonden en tijdelijk opgeslagen zodat wij hem kunnen terugvinden.',
        ],
      },
      {
        heading: 'Uw rechten',
        body: [
          'U kunt uw gegevens inzien, laten corrigeren of laten verwijderen, en uw toestemming intrekken. Stuur daarvoor een bericht naar info@expat-relocation.nl. U heeft ook het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens.',
        ],
      },
      {
        heading: 'Cookies',
        body: [
          'Deze website plaatst geen tracking cookies zonder uw toestemming. Voor het correct verzenden van het formulier kan technische opslag nodig zijn die noodzakelijk is voor de werking van de website.',
        ],
      },
    ],
  },
};
