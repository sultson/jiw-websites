import type { LanderContent } from '../types';

/**
 * inburgeringsplichtig.nl, Dutch. Follows the client's landing-page brief for
 * this domain: no price in the hero, no standalone A1 course, three routing
 * situations, capture first and qualify second.
 */
export const nl: LanderContent = {
  lang: 'nl',
  meta: {
    title: 'Inburgeringsplichtig in Nederland? Wij helpen u verder',
    description:
      'Bericht gekregen dat u moet inburgeren, of twijfelt u of de inburgeringsplicht op u van toepassing is? Wij brengen uw situatie in kaart en begeleiden u bij de juiste vervolgstappen.',
    imageAlt: 'Stel aan de gracht in een Nederlandse stad in het avondlicht',
  },
  nav: {
    links: [
      { label: 'Uw situatie', href: '#situatie' },
      { label: 'Zo werkt het', href: '#werkwijze' },
      { label: 'Ervaringen', href: '#ervaringen' },
      { label: 'Vragen', href: '#vragen' },
    ],
    cta: { label: 'Ik heb hulp nodig', href: '#contact' },
    langSwitch: 'English',
  },
  hero: {
    eyebrow: 'Inburgering in Nederland',
    h1: 'Bent u <span class="hl">inburgeringsplichtig</span> in Nederland?',
    intro: [
      'Heeft u bericht gekregen dat u moet inburgeren, of weet u niet zeker welke eisen in uw situatie gelden? Dat hangt af van uw verblijfssituatie, wanneer u naar Nederland kwam en welke inburgeringsroute op u van toepassing is.',
      'Wij brengen uw situatie in kaart en helpen u bepalen wat uw juiste vervolgstap is.',
    ],
    benefits: [
      'Duidelijkheid over uw eigen situatie',
      'Eén vast aanspreekpunt van begin tot eind',
      'Begeleiding bij examen en immigratieprocedure',
    ],
    cta: { label: 'Ik heb hulp nodig', href: '#aanvraag', situation: 'Hero' },
    photo: {
      src: '/images/living.jpg',
      alt: 'Stel wandelt samen door een Nederlandse straat langs de gracht',
    },
    note: 'Persoonlijk antwoord van een specialist. Geen lange vragenlijst vooraf.',
  },
  stats: [
    { value: '1500+', label: 'cliënten wereldwijd begeleid' },
    { value: 'Sinds 2009', label: 'gespecialiseerd in Nederlandse immigratieprocedures' },
    { value: '1 vast', label: 'aanspreekpunt per dossier' },
    { value: 'NL · EN', label: 'begeleiding in twee talen' },
  ],
  explain: {
    eyebrow: 'De term uitgelegd',
    heading: 'Wat betekent inburgeringsplichtig?',
    body: [
      'Inburgeringsplichtig zijn betekent dat u volgens de Nederlandse regels verplicht bent om in te burgeren: de Nederlandse taal leren en kennis opdoen van de Nederlandse samenleving, afgesloten met een of meer examens binnen een bepaalde termijn.',
      'De verwarring zit bijna altijd in hetzelfde punt. Niet iedereen valt onder dezelfde eisen.',
    ],
    points: [
      'Welke verplichtingen gelden, hangt af van uw persoonlijke omstandigheden.',
      'Er kunnen verschillende routes, examens en termijnen van toepassing zijn.',
      'Er bestaan uitzonderingen en vrijstellingen.',
      'De eerste stap is vaststellen welke eisen in uw situatie gelden.',
    ],
    cta: { label: 'Bespreek mijn situatie', href: '#contact', situation: 'Uitleg inburgeringsplicht' },
    photo: {
      src: '/images/letter.jpg',
      alt: 'Vrouw aan de keukentafel die een officiële Nederlandse brief over inburgering leest',
    },
    photoNote: 'Brief binnen met een termijn erin? Stuur ons uw gegevens, dan lopen wij hem met u door.',
  },
  routing: {
    eyebrow: 'Uw situatie',
    heading: 'Welke situatie past bij u?',
    intro:
      'Inburgering betekent iets anders voor iemand die al in Nederland woont dan voor iemand die zich nog bij een partner wil voegen. Kies hieronder wat het dichtst bij uw situatie ligt.',
    cards: [
      {
        title: 'Woont u al in Nederland?',
        body: 'Heeft u informatie gekregen over uw inburgeringsplicht en weet u niet wat u moet doen, welke eisen gelden of wat uw volgende stap is? Wij bekijken uw situatie en leggen uit wat er van u wordt verwacht.',
        cta: { label: 'Ik wil begeleiding bij inburgering', href: '#contact', situation: 'Woont al in Nederland' },
        photo: {
          src: '/images/street.jpg',
          alt: 'Vrouw op de fiets in een zonnige Nederlandse woonstraat',
        },
      },
      {
        title: 'Woont u nog in het buitenland en wilt u naar uw partner?',
        body: 'Woont u nog buiten Nederland en wilt u zich bij uw partner voegen? Dan moet u mogelijk eerst het basisexamen inburgering buitenland afleggen. Wij bieden die voorbereiding aan als onderdeel van ons complete partnertraject.',
        cta: { label: 'Ik kom naar mijn partner', href: '#contact', situation: 'Nog in het buitenland, naar partner' },
        photo: {
          src: '/images/exam.jpg',
          alt: 'Man die thuis met koptelefoon Nederlands oefent op zijn laptop',
        },
      },
      {
        title: 'Heeft u het examen in het buitenland al behaald?',
        body: 'Heeft u het basisexamen inburgering buitenland al gehaald en heeft u nu hulp nodig bij de MVV/TEV-partneraanvraag? Dan begeleiden wij de immigratieprocedure.',
        price: 'MVV/TEV-partneraanvraag, €799 excl. btw',
        cta: { label: 'Ik heb hulp nodig bij mijn MVV', href: '#contact', situation: 'Examen behaald, MVV/TEV nodig' },
        photo: {
          src: '/images/papers.jpg',
          alt: 'Paspoort en aanvraagdocumenten op een bureau',
        },
      },
    ],
  },
  distinction: {
    eyebrow: 'Belangrijk onderscheid',
    heading: 'Voor of na aankomst in Nederland: verwar deze twee niet',
    intro:
      'Twee verschillende trajecten dragen in het dagelijks taalgebruik dezelfde naam. Ze hebben andere regels, andere examens en een andere volgorde.',
    abroad: {
      badge: 'Alles in één traject',
      title: 'Basisexamen inburgering buitenland',
      body: 'Dit speelt bij mensen die nog in het buitenland wonen en het vereiste examen moeten afleggen voordat de betreffende MVV- of partnerprocedure verder kan. Voor cliënten die zowel examenvoorbereiding als de partneraanvraag nodig hebben, bieden wij één doorlopend traject aan.',
      packageName: 'Compleet partnertraject',
      price: '€1.199 excl. btw',
      priceNote:
        'Dit tarief betreft onze dienstverlening. Leges van de overheid en kosten van derden zijn niet inbegrepen, tenzij uitdrukkelijk anders overeengekomen.',
      includes: [
        '6 uur privé 1-op-1 voorbereiding op het A1-examen',
        'Voorbereiding op Spreken, Lezen en KNS',
        'Begeleiding bij MVV/TEV-partneraanvraag',
        'Persoonlijke documentenchecklist',
        'Controle van documenten en voorbereiding van de aanvraag',
        'Begeleiding tijdens de overeengekomen procedure',
      ],
      cta: { label: 'Bekijk het complete partnertraject', href: '#contact', situation: 'Compleet partnertraject' },
      photo: {
        src: '/images/partner.jpg',
        alt: 'Herenigd stel op een brug in een Nederlandse stad',
      },
    },
    inNl: {
      title: 'Inburgeren in Nederland',
      body: [
        'Wie al in Nederland woont en inburgeringsplichtig is, zit in een andere situatie. Hier gelden andere routes, examens en termijnen dan bij het examen in het buitenland.',
        'Wij presenteren u in dat geval niet automatisch het partnerpakket. De eerste stap is vaststellen welke hulp u werkelijk nodig heeft.',
      ],
      cta: { label: 'Ik heb hulp nodig bij mijn situatie', href: '#contact', situation: 'Inburgering in Nederland' },
      photo: {
        src: '/images/canalside.jpg',
        alt: 'Stel wandelt langs een gracht in een Nederlandse stad',
      },
    },
  },
  help: {
    eyebrow: 'Onze hulp',
    heading: 'Hoe wij u kunnen helpen',
    intro:
      'Met meer dan tien jaar ervaring in Nederlandse immigratieprocedures weten wij welke stap in welke volgorde nodig is, en wat er in uw geval juist niet nodig is.',
    items: [
      {
        title: 'Persoonlijke begeleiding',
        body: 'Wij bekijken uw situatie en leggen uit welke stappen voor u relevant zijn, in begrijpelijke taal.',
      },
      {
        title: 'Examen en voorbereiding',
        body: 'Waar dat past, verzorgen wij voorbereiding op het examen dat in uw situatie aan de orde is.',
      },
      {
        title: 'Immigratiebegeleiding',
        body: 'Speelt er ook een MVV, gezinshereniging of een andere procedure die wij verzorgen, dan begeleiden wij die aanvraag.',
      },
      {
        title: 'Compleet partnertraject',
        body: 'Voor partnercliënten die nog het basisexamen inburgering buitenland moeten doen, bieden wij het complete A1- en MVV/TEV-traject.',
      },
    ],
    cta: { label: 'Vertel ons uw situatie', href: '#contact', situation: 'Hoe wij helpen' },
    photo: {
      src: '/images/advies.jpg',
      alt: 'Adviseur in gesprek met een cliënt aan tafel in een kantoor met uitzicht op een gracht',
    },
  },
  steps: {
    eyebrow: 'Werkwijze',
    heading: 'Zo werkt het',
    intro: 'Drie stappen, en de eerste kost u twee minuten.',
    items: [
      { title: 'Laat uw gegevens achter', body: 'Vertel kort waarmee wij u kunnen helpen. Meer is niet nodig.' },
      {
        title: 'Wij nemen contact met u op',
        body: 'Wij bespreken uw situatie en bepalen welke hulp daadwerkelijk relevant is.',
      },
      {
        title: 'U start het juiste traject',
        body: 'Kunnen wij u helpen, dan leggen wij de dienst en de vervolgstappen duidelijk uit.',
      },
    ],
    cta: { label: 'Ik wil beginnen', href: '#contact', situation: 'Werkwijze' },
  },
  reviews: {
    eyebrow: 'Ervaringen',
    heading: 'Wat cliënten zeggen',
    intro: 'Wij plaatsen alleen ervaringen die wij daadwerkelijk hebben ontvangen.',
    items: [
      {
        quote: 'Dankzij E & I was onze gezinshereniging een stressvrij proces. Alles werd perfect geregeld.',
        name: 'Anna',
        context: 'Rusland naar Nederland',
      },
      {
        quote: 'Johanna stond de eerste dagen 24/7 voor ons klaar. Echt een unieke service!',
        name: 'Chinedu',
        context: 'Nigeria naar Nederland',
      },
    ],
    countriesLabel: 'Cliënten uit onder meer',
    countries: ['India', 'Nigeria', 'Ghana', 'Suriname', 'Colombia', 'de Filipijnen', 'Turkije', 'de Verenigde Staten'],
  },
  band: {
    heading: 'Betrokken. Duidelijk. Persoonlijk.',
    body: 'Achter elke aanvraag zit een gezin dat samen verder wil. Daarom krijgt u bij ons één vast aanspreekpunt dat uw dossier kent, en antwoord in gewone taal.',
    cta: { label: 'Bespreek uw situatie', href: '#contact', situation: 'Fotoband' },
    photo: {
      src: '/images/reunion.jpg',
      alt: 'Stel omhelst elkaar bij aankomst in de aankomsthal van de luchthaven',
    },
  },
  faq: {
    eyebrow: 'Veelgestelde vragen',
    heading: 'Vragen die wij vaak krijgen',
    intro: 'Staat uw vraag er niet bij? Stel hem gerust, wij beantwoorden hem persoonlijk.',
    items: [
      {
        q: 'Ben ik inburgeringsplichtig in Nederland?',
        a: 'Dat hangt af van uw persoonlijke omstandigheden, onder meer van uw nationaliteit, uw verblijfsdoel en wanneer u naar Nederland bent gekomen. Er bestaan uitzonderingen en vrijstellingen. Laat uw gegevens achter, dan bekijken wij uw situatie en vertellen wij u wat er in uw geval speelt.',
      },
      {
        q: 'Ik heb een brief over inburgering ontvangen. Wat moet ik nu doen?',
        a: 'Bewaar de brief en let op de genoemde termijn, want daar staat meestal in vanaf wanneer en binnen welke tijd u aan uw verplichting moet voldoen. Weet u niet wat de brief voor u betekent, stuur ons dan uw gegevens. Wij nemen contact op en lopen de inhoud met u door.',
      },
      {
        q: 'Is het basisexamen inburgering buitenland hetzelfde als inburgeren in Nederland?',
        a: 'Nee. Het basisexamen inburgering buitenland wordt afgelegd terwijl iemand nog in het buitenland is en gaat vooraf aan de betreffende MVV- of partnerprocedure. Inburgeren in Nederland speelt daarna en kent eigen routes, examens en termijnen.',
      },
      {
        q: 'Moet ik eerst een examen halen voordat ik een MVV kan aanvragen?',
        a: 'Voor een deel van de aanvragers geldt dat het basisexamen inburgering buitenland eerst moet worden behaald. Of dat in uw situatie geldt, hangt af van uw nationaliteit, het verblijfsdoel en mogelijke vrijstellingen. Wij bekijken dit voordat er een aanvraag wordt voorbereid.',
      },
      {
        q: 'Kunnen jullie zowel bij de A1-voorbereiding als bij mijn MVV helpen?',
        a: 'Ja. Voor cliënten die beide nodig hebben, bieden wij het complete partnertraject van €1.199 excl. btw. Daarin zitten 6 uur privé 1-op-1 voorbereiding op het A1-examen en de volledige begeleiding bij de MVV/TEV-partneraanvraag.',
      },
      {
        q: 'Ik heb het examen in het buitenland al behaald. Kunnen jullie mij nog helpen?',
        a: 'Ja. Heeft u het examen al gehaald, dan heeft u het complete traject niet nodig. Wij begeleiden dan alleen de MVV/TEV-partneraanvraag voor €799 excl. btw.',
      },
    ],
  },
  finalCta: {
    eyebrow: 'Uw aanvraag',
    heading: 'Hulp nodig bij uw inburgering?',
    body: 'Laat uw gegevens achter. Wij nemen contact met u op om uw situatie te bespreken en de mogelijke vervolgstappen door te nemen.',
    assurances: [
      'Persoonlijk antwoord binnen één werkdag',
      'Vrijblijvend, u zit nergens aan vast',
      'Nederlands of Engels',
    ],
    directContact: 'Liever direct contact?',
    cta: { label: 'Neem contact met mij op', href: '#contact', situation: 'Afsluitende CTA' },
  },
  form: {
    heading: 'Vertel ons kort uw situatie',
    intro: 'Wij nemen persoonlijk contact met u op. U hoeft vooraf geen vragenlijst in te vullen.',
    badge: 'Reactie binnen één werkdag',
    name: 'Volledige naam',
    namePlaceholder: 'Voor- en achternaam',
    email: 'E-mailadres',
    phone: 'Telefoon of WhatsApp',
    phoneHint: 'Inclusief landnummer, bijvoorbeeld +31 6 12345678',
    message: 'Waarmee kunnen wij u helpen?',
    messagePlaceholder: 'Bijvoorbeeld: ik heb een brief over inburgering gekregen en weet niet wat ik moet doen.',
    optional: 'optioneel',
    consent: 'Ik ga akkoord met het',
    consentLink: 'privacybeleid',
    submit: 'Ik heb hulp nodig',
    submitting: 'Versturen',
    error: 'Het versturen is niet gelukt. Probeer het opnieuw of stuur ons een WhatsApp-bericht.',
    privacyNote: 'Uw gegevens worden alleen gebruikt om contact met u op te nemen over uw aanvraag.',
  },
  whatsapp: {
    label: 'Stel uw vraag via WhatsApp',
    aria: 'Contact opnemen via WhatsApp',
    text: 'Hallo, ik heb een vraag over mijn inburgeringsplicht.',
  },
  stickyCta: 'Ik heb hulp nodig',
  disclaimer:
    'Immigration Services NL is een onafhankelijke particuliere dienstverlener op het gebied van immigratie en is niet verbonden aan of onderdeel van de IND, DUO, de Nederlandse overheid, een gemeente, ambassade of consulaat. Genoemde tarieven hebben uitsluitend betrekking op onze dienstverlening. Leges van de overheid en kosten van derden zijn niet inbegrepen, tenzij uitdrukkelijk anders overeengekomen. De bevoegde instantie beslist uiteindelijk over de aanvraag.',
  footer: {
    about: 'Sinds 2009 begeleiden wij mensen bij inburgering en Nederlandse immigratieprocedures.',
    contactHeading: 'Contact',
    legalHeading: 'Bedrijfsgegevens',
    privacy: 'Privacybeleid',
    rights: 'Alle rechten voorbehouden.',
  },
  thanks: {
    metaTitle: 'Bedankt voor uw bericht',
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
        label: 'Waar woont u op dit moment?',
        options: ['In Nederland', 'In het buitenland'],
      },
      situation: {
        label: 'Welke situatie past het beste bij u?',
        options: [
          'Ik heb bericht gekregen dat ik moet inburgeren',
          'Ik wil mij bij mijn partner in Nederland voegen',
          'Ik heb het basisexamen inburgering buitenland al behaald',
          'Anders of ik weet het nog niet',
        ],
      },
      exam: {
        label: 'Basisexamen buitenland al gedaan?',
        options: ['Ja, behaald', 'Nee, nog niet', 'Weet ik niet'],
      },
      nationality: { label: 'Wat is uw nationaliteit?' },
      arrival: { label: 'Sinds wanneer woont u in Nederland?', hint: 'Alleen invullen als u al in Nederland woont' },
      notes: {
        label: 'Wilt u nog iets toevoegen?',
        placeholder: 'Bijvoorbeeld een termijn uit uw brief of een eerdere aanvraag.',
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
