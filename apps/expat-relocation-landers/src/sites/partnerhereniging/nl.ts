import type { LanderContent } from '../types';

/**
 * partnerhereniging.nl, Nederlands.
 *
 * Zoekintentie: "ik wil mijn partner naar Nederland halen". Deze pagina gaat
 * dus over immigratie, niet over het examen. Het basisexamen inburgering
 * buitenland komt alleen voor als voorwaarde en als onderdeel van het complete
 * traject; het is nooit het onderwerp. Twee commerciële keuzes, één lead.
 */
export const nl: LanderContent = {
  lang: 'nl',
  meta: {
    title: 'Partnerhereniging Nederland: hulp bij de MVV/TEV-aanvraag',
    description:
      'Wilt u uw partner uit het buitenland naar Nederland halen? Wij bereiden uw MVV/TEV-partneraanvraag professioneel voor, inclusief documentencheck en begeleiding. Vanaf €799 excl. btw.',
    imageAlt: 'Stel lacht samen in de aankomsthal van een Nederlandse luchthaven',
  },
  nav: {
    links: [
      { label: 'Uw situatie', href: '#situatie' },
      { label: 'Begeleiding', href: '#begeleiding' },
      { label: 'Het traject', href: '#traject' },
      { label: 'Ervaringen', href: '#ervaringen' },
      { label: 'Vragen', href: '#vragen' },
    ],
    cta: { label: 'Start mijn aanvraag', href: '#contact' },
    langSwitch: 'English',
  },
  hero: {
    eyebrow: 'Partnerhereniging in Nederland',
    h1: 'Wilt u uw partner naar Nederland halen?',
    intro: [
      'Woont uw partner nog in het buitenland en wilt u samen in Nederland verder? Afhankelijk van uw situatie gelden er eisen aan uw inkomen, aan uw relatie, aan de documenten die u aanlevert, aan het basisexamen inburgering buitenland en aan de MVV/TEV-procedure.',
      'Wij bereiden uw partneraanvraag professioneel voor en verzorgen waar nodig ook de A1-examenvoorbereiding, zodat het hele traject bij één partij ligt.',
    ],
    benefits: [
      'Persoonlijke begeleiding',
      'Documentenchecklist op maat',
      'Professionele voorbereiding van uw aanvraag',
      'Compleet traject inclusief A1-voorbereiding mogelijk',
    ],
    offer: {
      name: 'MVV/TEV-partneraanvraag',
      price: 'vanaf €799 excl. btw',
      note: 'Dit tarief betreft onze dienstverlening. Leges van de overheid en kosten van derden zijn niet inbegrepen, tenzij uitdrukkelijk anders overeengekomen.',
    },
    cta: { label: 'Start mijn partneraanvraag', href: '#aanvraag', situation: 'Hero' },
    note: 'Wij nemen persoonlijk contact met u op, meestal binnen één werkdag.',
    photo: {
      src: '/images/ph-hero.jpg',
      alt: 'Stel lacht samen in de aankomsthal van een Nederlandse luchthaven',
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
      'Wat u precies moet aantonen, hangt af van uw relatievorm, uw inkomen en de nationaliteit van uw partner. Daar gaat het in de praktijk het vaakst mis. Een dossier dat op één onderdeel niet compleet is, levert vragen en vertraging op.',
    ],
    points: [
      'Uw partner woont op dit moment buiten Nederland.',
      'U wilt samen en blijvend in Nederland wonen.',
      'U bent getrouwd, geregistreerd partner of ongehuwd partner.',
      'U twijfelt of u aan de inkomenseis voldoet.',
      'Uw partner heeft mogelijk een MVV nodig.',
      'Uw partner moet mogelijk eerst het basisexamen inburgering buitenland halen.',
    ],
    cta: { label: 'Bespreek mijn situatie', href: '#contact', situation: 'Uw situatie' },
    photo: {
      src: '/images/ph-keukentafel.jpg',
      alt: 'Stel bekijkt samen aan de keukentafel de documenten voor hun aanvraag',
    },
    photoNote:
      'Twijfelt u over de inkomenseis of over uw bewijsstukken? Laat uw gegevens achter, dan lopen wij uw situatie met u door.',
  },
  packages: {
    eyebrow: 'Begeleiding',
    heading: 'Kies het niveau van begeleiding dat bij u past',
    intro:
      'Twee mogelijkheden. Welke bij u past, hangt af van één vraag: moet uw partner nog het basisexamen inburgering buitenland afleggen?',
    cards: [
      {
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
        badge: 'Compleet traject',
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
  journey: {
    eyebrow: 'Het traject',
    heading: 'Van examenvoorbereiding tot de partneraanvraag',
    intro:
      'Wij behandelen het examen en de aanvraag niet als twee losse zaken. Dit is de volgorde die wij aanhouden voor cliënten die beide nodig hebben.',
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
    ],
    outcome: 'Eén doorlopend traject, één dossierstrategie, één aanspreekpunt.',
    cta: { label: 'Ik wil het complete traject', href: '#contact', situation: 'Het traject' },
  },
  help: {
    eyebrow: 'Waarom wij',
    heading: 'Waarom cliënten hun partneraanvraag bij ons neerleggen',
    intro:
      'Wij zijn sinds 2009 gespecialiseerd in Nederlandse immigratieprocedures en begeleiden cliënten uit de hele wereld. U krijgt antwoord in gewone taal, van iemand die uw dossier kent.',
    items: [
      {
        title: 'Gespecialiseerde immigratiebegeleiding',
        body: 'Partnerhereniging, MVV en TEV zijn ons dagelijks werk, geen bijzaak.',
      },
      {
        title: 'Eén vast aanspreekpunt',
        body: 'Dezelfde persoon van uw eerste vraag tot de beslissing op de aanvraag.',
      },
      {
        title: 'Duidelijke communicatie',
        body: 'U weet wat er nodig is, wat het kost en wat u wanneer kunt verwachten.',
      },
      {
        title: 'Professionele dossieropbouw',
        body: 'Wij controleren uw bewijsstukken en bouwen het dossier op zoals het beoordeeld wordt.',
      },
    ],
    cta: { label: 'Bespreek uw situatie', href: '#contact', situation: 'Waarom wij' },
    photo: {
      src: '/images/ph-advies.jpg',
      alt: 'Adviseur bespreekt aan tafel de aanvraag met een stel',
    },
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
    heading: 'Samen wonen in Nederland',
    body: 'Achter elke aanvraag zit een stel dat samen verder wil. Daarom krijgt u bij ons één aanspreekpunt dat uw dossier kent en dat u kunt bellen als er iets verandert.',
    cta: { label: 'Start mijn partneraanvraag', href: '#contact', situation: 'Fotoband' },
    photo: {
      src: '/images/ph-samen.jpg',
      alt: 'Stel loopt hand in hand door een Nederlandse woonstraat',
    },
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
      'Persoonlijk antwoord binnen één werkdag',
      'Vrijblijvend, u zit nergens aan vast',
      'Nederlands of Engels',
    ],
    directContact: 'Liever direct contact?',
    photo: { src: '/images/ph-thuis.jpg', alt: 'Stel staat met de sleutels in de deuropening van hun Nederlandse woning' },
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
    messagePlaceholder: 'Bijvoorbeeld: mijn partner woont in de Filipijnen, wij zijn getrouwd en willen de aanvraag starten.',
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
