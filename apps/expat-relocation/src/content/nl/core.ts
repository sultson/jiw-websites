import type { CoreContent } from '../types';

export const core: CoreContent = {
  ui: {
    skipToContent: 'Naar inhoud',
    nav: {
      home: 'Home',
      immigration: 'Immigratie',
      housing: 'Wonen',
      relocation: 'Relocatie',
      business: 'Bedrijf starten',
      vip: 'VIP-diensten',
      guides: 'Gidsen',
      about: 'Over ons',
      contact: 'Contact',
    },
    cta: {
      whatsapp: 'WhatsApp',
      whatsappLong: 'Stuur ons direct een WhatsApp',
      consultation: 'Plan een relocatiegesprek',
      startRelocation: 'Start uw relocatie',
      readMore: 'Lees meer',
      allServices: 'Alle diensten',
      backTo: 'Terug naar',
      send: 'Verstuur aanvraag',
      sending: 'Versturen…',
      explore: 'Ontdek',
    },
    langBanner: {
      prompt: 'Leest u deze site liever in het {lang}?',
      switch: 'Wissel',
      dismiss: 'Nee, dank u',
    },
    form: {
      firstName: 'Voornaam',
      lastName: 'Achternaam',
      email: 'E-mailadres',
      phone: 'Telefoon / WhatsApp',
      optional: 'optioneel',
      successTitle: 'Dank u, uw aanvraag is verzonden',
      successBody:
        'Johanna bekijkt uw situatie persoonlijk en reageert binnen één werkdag, meestal veel sneller. Voor dringende zaken kunt u ons een WhatsApp sturen.',
      errorTitle: 'Er is iets misgegaan',
      errorBody: 'Uw aanvraag kon niet worden verzonden. Probeer het opnieuw, of stuur ons een WhatsApp.',
      consent: 'Door dit formulier te versturen gaat u akkoord met ons privacybeleid.',
      nextSteps:
        'Nadat u dit formulier verstuurt, bekijkt Johanna uw situatie persoonlijk en reageert zij binnen één werkdag met een eerlijke inschatting of en hoe wij kunnen helpen. Valt uw vraag buiten onze diensten of regio, dan zeggen wij dat direct.',
    },
    footer: {
      tagline: 'Een boutique relocatie-adviespraktijk voor internationale professionals en gezinnen die zich vestigen in Rotterdam, Europoort en de bredere havenregio.',
      services: 'Diensten',
      company: 'Bedrijf',
      contactHeading: 'Contact',
      legalHeading: 'Juridisch',
      kvkLabel: 'KvK',
      rightsReserved: 'Alle rechten voorbehouden.',
      builtBy: 'Website door',
      disclaimer:
        'E & I is een onafhankelijke adviespraktijk voor relocatie en immigratie. Wij zijn geen overheidsinstantie en hebben geen band met de IND, de Nederlandse overheid of enige ambassade of consulaat. Beslissingen over visa, verblijfsvergunningen en naturalisatie worden uitsluitend genomen door de bevoegde instanties.',
    },
    misc: {
      from: 'Investering vanaf',
      whatsIncluded: 'Wat is inbegrepen',
      otherServices: 'Andere diensten',
      relatedGuides: 'Gerelateerde gidsen',
      conditions: 'Voorwaarden',
      investment: 'Investering',
      feesDisclaimer:
        'De genoemde investeringsbedragen betreffen uitsluitend ons honorarium en zijn bedoeld als richtlijn. Overheidsleges (waaronder de leges van de IND), btw, kosten voor legalisatie en apostille, beëdigde vertalingen, consulaire kosten en kosten van derden zijn niet inbegrepen, tenzij het voorstel dat uitdrukkelijk vermeldt.',
    },
  },

  home: {
    metaTitle: 'Boutique Relocatie- & Immigratiediensten in Nederland | E & I',
    metaDescription:
      'Een boutique relocatie-adviespraktijk voor internationale professionals, gezinnen en ondernemers in Rotterdam, Europoort en de bredere havenregio. Wonen, scholen, inschrijvingen, immigratie en VIP-pakketten.',
    hero: {
      h1: 'Boutique relocatie- en immigratiediensten in Nederland',
      sub: 'Een private relocatie-adviespraktijk voor internationale professionals, gezinnen en ondernemers die zich vestigen in Rotterdam, Europoort en de bredere havenregio. Immigratie hoort erbij, maar is nooit het hele verhaal.',
      ctaPrimary: 'Plan een relocatiegesprek',
      ctaWhatsapp: 'Stuur ons direct een WhatsApp',
      ctaSecondary: 'Start uw relocatie',
      trust: 'Persoonlijke begeleiding door Johanna, 24/7 bereikbaar',
    },
    paths: {
      heading: 'Hoe kunnen wij u helpen aankomen?',
      sub: 'Relocatie, wonen, VIP-ondersteuning en immigratie, begeleid door één adviespraktijk. Kies uw weg naar binnen en één persoon kent uw naam, van het eerste bericht tot de dag dat u zich thuis voelt.',
      items: [
        {
          key: 'immigration',
          title: 'Immigratiediensten',
          text: 'Visa en vergunningen voor professionals, partners, gezinnen en oprichters. Zorgvuldig voorbereid en persoonlijk begeleid, van toetsing tot goedkeuring.',
          label: 'Ontdek immigratie',
          path: '/immigration',
          image: '/images/path-immigration.jpg?v=20260731',
          imageAlt: 'Adviseur in gesprek met een internationale cliënt',
        },
        {
          key: 'relocation',
          title: 'Relocatie & wonen',
          text: 'Complete relocatiepakketten of losse diensten: woningzoektocht, scholen, BSN, verzekeringen en alles daartussenin.',
          label: 'Ontdek relocatie',
          path: '/relocation',
          image: '/images/path-relocation.jpg?v=20260731',
          imageAlt: 'Gezin dat aankomt bij een Nederlands grachtenpand',
        },
        {
          key: 'vip',
          title: 'VIP-relocatie',
          text: 'Voor artiesten, sporters, bestuurders en wie maar één weekend heeft. Uw hele verhuizing georkestreerd rond één bezoek, met elke deur al open.',
          label: 'Ontdek VIP-diensten',
          path: '/vip-services',
          image: '/images/path-vip.jpg?v=20260731',
          imageAlt: 'Chauffeur die een autodeur opent tegen de skyline van Rotterdam',
        },
      ],
    },
    mostRequested: {
      heading: 'Meest gevraagde diensten',
      sub: 'De acht dingen waar expats ons als eerste om vragen.',
      items: [
        { label: 'Kennismigrantenvisum', path: '/immigration/highly-skilled-migrant-visa-netherlands' },
        { label: 'Hulp bij woningzoektocht', path: '/housing/housing-search-assistance-netherlands' },
        { label: 'Partnervisum Nederland', path: '/immigration/partner-visa-netherlands' },
        { label: 'BSN-registratie', path: '/relocation/bsn-registration-netherlands' },
        { label: 'Startup-visum Nederland', path: '/immigration/startup-visa-netherlands' },
        { label: 'Scholenzoektocht', path: '/relocation/school-search-netherlands' },
        { label: 'Compleet relocatiepakket', path: '/vip-services' },
        { label: 'Relocatiediensten Rotterdam', path: '/relocation/relocation-services-rotterdam' },
      ],
    },
    vipBlock: {
      eyebrow: 'VIP-relocatiediensten',
      heading: 'Kom aan zoals u gewend bent aan te komen',
      text: [
        'Sommige cliënten kunnen geen zes weken aan papierwerk besteden. Zij vliegen in voor een weekend, tekenen, registreren en vliegen weer uit terwijl wij de rest afronden. Onze VIP-pakketten comprimeren een volledige relocatie tot een schema dat om u heen is gebouwd: afspraken gebundeld in één bezoek, woningen geselecteerd voordat u landt, een auto die wacht op Schiphol.',
        'Stellen, gezinnen en bedrijven hebben elk hun eigen pakket, en het concierge-niveau wordt geschreven rond wat uw leven vraagt.',
      ],
      label: 'Ontdek VIP-relocatie',
    },
    immigrationBlock: {
      eyebrow: 'Immigratie voor expats',
      heading: 'De juiste vergunning, op de juiste manier voorbereid',
      text: [
        'Nederlandse immigratie beloont voorbereiding. Wij beoordelen welke route werkelijk bij uw situatie past, bereiden de aanvraag voor zoals de IND die wil zien, en gaan met u mee naar de afspraken die ertoe doen.',
      ],
      label: 'Alle immigratiediensten',
      links: [
        { label: 'Kennismigrant', path: '/immigration/highly-skilled-migrant-visa-netherlands' },
        { label: 'Europese blauwe kaart', path: '/immigration/eu-blue-card-netherlands' },
        { label: 'Partnervisum', path: '/immigration/partner-visa-netherlands' },
        { label: 'Startup-visum', path: '/immigration/startup-visa-netherlands' },
        { label: 'DAFT-visum', path: '/immigration/daft-visa-netherlands' },
        { label: 'Verblijfsvergunningen', path: '/immigration/residence-permit-netherlands' },
      ],
    },
    housingBlock: {
      eyebrow: 'Wonen & settelen',
      heading: 'Een thuis, niet alleen een adres',
      text: [
        'De Nederlandse huurmarkt beweegt in dagen, niet in weken. Wij zoeken, gaan met u of namens u naar bezichtigingen, controleren elke contractbepaling voordat u tekent, en blijven het aanspreekpunt voor uw verhuurder lang nadat de sleutels van u zijn.',
      ],
      label: 'Alle woondiensten',
      links: [
        { label: 'Woningzoektocht', path: '/housing/housing-search-assistance-netherlands' },
        { label: 'Expatwoningen Rotterdam', path: '/housing/housing-for-expats-rotterdam' },
        { label: 'Hulp bij bezichtigingen', path: '/housing/viewing-assistance-netherlands' },
        { label: 'Tijdelijke huisvesting', path: '/housing/temporary-housing-for-expats-netherlands' },
      ],
    },
    businessBlock: {
      eyebrow: 'Bedrijf starten',
      heading: 'Richt uw bedrijf op waar de wereld aanmeert',
      text: [
        'Startup-visum, DAFT-verdrag, KvK-inschrijving, een adres, een woning, een school voor uw kinderen. De meeste bureaus regelen er één van. Wij regelen de hele volgorde, want een oprichter verhuist niet in fasen, een oprichter verhuist een leven.',
      ],
      label: 'Zakelijke diensten',
    },
    portBlock: {
      eyebrow: 'Havens & offshore',
      heading: 'De specialist voor de Rotterdamse haven',
      text: [
        'De grootste haven van Europa staat in geen enkele relocatiebrochure, en toch bouwen tienduizenden internationale professionals er hun carrière. Wij zijn het enige boutique bureau gespecialiseerd in Rotterdam, de regio ten zuiden ervan, Europoort en de Maasvlakte, en werken dagelijks met de haven-, offshore-, scheepvaart- en engineeringbedrijven die mensen hierheen halen.',
      ],
      label: 'Diensten voor industriële expats',
      areas: [
        { title: 'Rotterdam', text: 'Wonen met skyline, internationale scholen en de snelst veranderende stad van Nederland.' },
        { title: 'Europoort & Maasvlakte', text: 'Praktische relocatie voor haven-, offshore- en raffinaderijprofessionals en hun gezinnen.' },
        { title: 'Ten zuiden van Rotterdam', text: 'Rustige stadjes als Brielle, Rozenburg en Hellevoetsluis, op minuten van de terminals en een wereld ervan verwijderd.' },
      ],
      advantages: [
        { title: 'Lokale kennis', text: 'Wij kennen de buurten, scholen, verhuurders en woon-werkroutes van deze regio straat voor straat.' },
        { title: 'Snelle persoonlijke hulp', text: 'Wij zitten dichtbij, dus wij kunnen op korte termijn bij een bezichtiging, een gemeentebalie of een noodgeval zijn.' },
        { title: 'Een gevestigd netwerk', text: 'Makelaars, gemeenten, scholen en internationale werkgevers in de regio kennen ons al.' },
        { title: 'Ondersteuning na aankomst', text: 'De relatie eindigt niet bij de sleutels. Wij blijven het aanspreekpunt lang nadat u zich heeft gesetteld.' },
      ],
      links: [
        { label: 'Expats Europoort', path: '/industrial-expat-services/europoort-relocation-services-netherlands' },
        { label: 'Expats Maasvlakte', path: '/industrial-expat-services/maasvlakte-expat-relocation-netherlands' },
        { label: 'Offshore-professionals', path: '/industrial-expat-services/offshore-expat-services-netherlands' },
        { label: 'Logistieke professionals', path: '/industrial-expat-services/relocation-for-logistics-professionals-netherlands' },
      ],
    },
    familyBlock: {
      eyebrow: 'Gezinsrelocatie',
      heading: 'Een gezin verhuizen is een ander vak',
      text: [
        'Schooljaren die op vaste data beginnen, meerdere IND-dossiers in plaats van één, en een woning die voor iedereen moet werken. Wij coördineren de aankomst van het hele gezin, immigratie inbegrepen, in één plan en één paar handen.',
      ],
      label: 'Gezinsrelocatiediensten',
      path: '/relocation/family-relocation-netherlands',
      image: '/images/family-unpacking.jpg?v=20260731',
      imageAlt: 'Gezin geïnstalleerd in hun nieuwe Nederlandse woonkamer',
      links: [
        { label: 'Family VIP Package', path: '/vip-services/family-relocation-immigration-services-netherlands' },
        { label: 'Scholenzoektocht', path: '/relocation/school-search-netherlands' },
        { label: 'Gezinshereniging', path: '/immigration/family-reunification-netherlands' },
      ],
    },
    whyBoutique: {
      eyebrow: 'Waarom boutique',
      heading: 'Eén adviespraktijk. Eén persoon. Uw naam.',
      text: [
        'Grote relocatiebureaus geven u een ticketnummer. Een boutique adviespraktijk geeft u een persoon. Johanna bouwde haar reputatie op in de ambassadewereld, waar discretie en precisie geen eigenschappen zijn, maar de functieomschrijving.',
        'Wij zijn geen relocatiefabriek die elke denkbare dienst aanbiedt. Wij doen relocatie, wonen, VIP-ondersteuning en immigratie voor één regio, via één bedrijf, en dat doen wij volledig.',
      ],
      points: [
        {
          title: 'Wij gaan met u mee',
          text: 'Naar de gemeente, de IND, de bank en de bezichtiging. U krijgt nooit een checklist in handen gedrukt met veel succes erbij.',
        },
        {
          title: '24/7, persoonlijk',
          text: 'Eén WhatsApp-lijn, beantwoord door degene die uw dossier beheert. Dag of nacht, eerste week of eerste jaar.',
        },
        {
          title: 'De enige in zijn soort',
          text: 'Nederland heeft corporate mobility-bureaus en het heeft visumloketten. Het heeft precies één boutique expat-concierge.',
        },
        {
          title: 'Pakketten gebouwd rond levens',
          text: 'Stel, gezin, bedrijf of volledige concierge. Elk pakket dekt de hele aankomst, niet een stukje ervan.',
        },
      ],
      stats: [
        { value: 'Sinds 2016', label: 'Begeleiden wij aankomsten in Nederland' },
        { value: '1200+', label: 'Expats en gezinnen geholpen' },
        { value: '98%', label: 'Klanttevredenheid' },
        { value: '24/7', label: 'Persoonlijke WhatsApp-ondersteuning' },
      ],
    },
    reviews: {
      eyebrow: 'Verhalen van cliënten',
      heading: 'Aankomsten waar wij trots op zijn',
      sub: 'Echte cliënten, echte routes naar Nederland.',
      items: [
        {
          quote: 'Dankzij E & I was onze gezinshereniging een stressvrij proces. Alles werd perfect geregeld.',
          name: 'Anna',
          route: 'Rusland naar Nederland',
          tags: ['Relocatie', 'Visum', 'Werkvergunning', 'Woonondersteuning', 'Familie'],
        },
        {
          quote: 'Johanna stond de eerste dagen 24/7 voor ons klaar. Echt een unieke service!',
          name: 'Chinedu',
          route: 'Nigeria naar Nederland',
          tags: ['Relocatie', 'Visum', 'Zakelijk', 'Startup', 'Integratie'],
        },
      ],
    },
    whatsappCta: {
      heading: 'Eén bericht. Wij nemen het over.',
      text: 'Vertel ons waar u bent en waar u moet zijn. U spreekt met Johanna, niet met een chatbot.',
      label: 'Stuur ons een WhatsApp',
    },
    contactBlock: {
      eyebrow: 'Begin het gesprek',
      heading: 'Vertel ons over uw verhuizing',
      text: 'Een paar regels is genoeg. Wij reageren binnen één werkdag.',
    },
  },

  about: {
    metaTitle: 'Over E & I | Boutique Expat- & Immigratiebureau Nederland',
    metaDescription:
      'E & I is het enige boutique bureau voor expat-relocatie en immigratie in Nederland. Persoonlijke begeleiding door Johanna, van visum tot woning tot de dag dat u zich thuis voelt.',
    eyebrow: 'Over E & I',
    title: 'De boutique achter duizend aankomsten',
    intro: [
      'E & I: Expat, Relocation and Immigration Services The Netherlands begon met een eenvoudige observatie vanuit de ambassadewereld: de mensen die het beste van land wisselen, zijn degenen die persoonlijk worden begeleid. Niet als dossier beheerd. Begeleid.',
      'Vandaag begeleiden Johanna en haar netwerk professionals, stellen, gezinnen en oprichters naar Nederland, met een specialisme dat niemand anders claimt: Rotterdam, Europoort en de industrieregio rond de grootste haven van Europa.',
    ],
    image: '/images/about-joanna.jpg',
    imageAlt: 'Johanna, oprichter van E & I, in haar kantoor',
    approach: {
      heading: 'Onze persoonlijke relocatieaanpak',
      text: [
        'Elke cliënt heeft één aanspreekpunt dat het hele dossier kent. Als de gemeente u persoonlijk nodig heeft, zitten wij in de stoel naast u. Als een verhuurder belt, nemen wij op in het Nederlands. Als er in uw eerste week om elf uur ’s avonds iets gebeurt, is de WhatsApp-lijn dezelfde persoon die u van het vliegveld haalde.',
        'Die manier van werken schaalt niet naar duizenden cliënten per jaar. Dat is precies de bedoeling.',
      ],
    },
    history: {
      heading: 'Actief sinds 2016',
      text: [
        'E & I is opgericht in 2016 en begeleidt sindsdien mensen bij hun aankomst in Nederland. Een decennium in één regio is de reden dat wij weten welke gemeente welk document vraagt, welke verhuurders een kandidaat met een contract dat volgende maand ingaat überhaupt overwegen, en hoe lang de IND er in deze maand werkelijk over doet.',
        'Het betekent ook dat de relaties echt zijn. Makelaars, notarissen, schooladministraties en ambtenaren die opnemen omdat ze de naam herkennen. Dat is het stille voordeel dat een kantoor niet kan kopen en een nieuwkomer niet kan nabootsen.',
      ],
    },
    boutique: {
      heading: 'Waarom werken met een boutique bureau',
      text: [
        'Corporate mobility-bureaus zijn gebouwd voor volume: portalen, tickets, servicelevels. Een boutique is gebouwd voor resultaat. U krijgt het oordeel van iemand die honderden cliënten door de IND heeft geleid, de snelheid van een team dat elk loket in de regio kent, en de discretie die een reputatie opgebouwd onder diplomaten vereist.',
      ],
      points: [
        { title: 'Wortels in de ambassadewereld', text: 'Precisie en discretie geleerd waar fouten geen optie zijn.' },
        { title: 'Een regio die niemand anders bedient', text: 'Rotterdam, Europoort en de Maasvlakte, straat voor straat gekend.' },
        { title: 'Immigratie en relocatie in één hand', text: 'De vergunning, de woning en het leven eromheen, in de juiste volgorde door één team.' },
      ],
    },
    families: {
      heading: 'Ondersteuning voor expats en gezinnen',
      text: [
        'De helft van een geslaagde relocatie heeft niets met papierwerk te maken. Scholen die bij uw kinderen passen, een buurt die bij uw avonden past, een huisarts, een sportschool, een route naar het werk. Onze settling-in-ondersteuning neemt dat even serieus als het visum, want daar wordt bepaald of een verhuizing slaagt.',
      ],
    },
    reviews: {
      heading: 'Reviews & ervaringen van cliënten',
      sub: 'Wat cliënten zeggen over aankomen met E & I.',
    },
    cta: {
      title: 'Maak kennis voordat u beslist',
      text: 'Een kennismakingsgesprek kost niets en vertelt u precies waar u staat.',
      label: 'Plan een relocatiegesprek',
    },
  },

  contact: {
    metaTitle: 'Contact E & I | Relocatie- & Immigratieondersteuning Nederland',
    metaDescription:
      'Plan een relocatiegesprek, stuur ons een WhatsApp of dien een immigratie-, relocatie- of VIP-aanvraag in. Persoonlijk antwoord binnen één werkdag.',
    eyebrow: 'Contact',
    title: 'Start uw relocatie',
    intro: [
      'Kies de weg die bij uw situatie past en vertel ons een paar regels. Uw aanvraag komt rechtstreeks bij Johanna terecht, en u ontvangt binnen één werkdag een persoonlijk antwoord.',
    ],
    tabs: [
      {
        key: 'immigration',
        label: 'Immigratie',
        text: 'Visa, vergunningen en IND-aanvragen.',
      },
      {
        key: 'relocation',
        label: 'Relocatie & wonen',
        text: 'Pakketten, wonen, scholen en settelen.',
      },
      {
        key: 'vip',
        label: 'VIP',
        text: 'Concierge-relocaties en fly-in-bezoeken.',
      },
    ],
    whatsapp: {
      heading: 'WhatsApp-relocatieondersteuning',
      text: 'De snelste manier om ons te bereiken, en het kanaal dat onze cliënten blijven gebruiken lang nadat ze zijn aangekomen.',
      label: 'Stuur ons een WhatsApp',
    },
    emergency: {
      heading: 'Spoedondersteuning bij relocatie',
      text: 'Morgen een deadline, woning weggevallen, een afspraak die u niet kunt missen? Stuur ons een WhatsApp met het woord URGENT en wij reageren direct, dag en nacht.',
    },
    details: {
      heading: 'Gegevens',
    },
    formCopy: {
      immigration: {
        heading: 'Intake immigratie & relocatie',
        text: 'Vertel ons uw nationaliteit en de route die u voor ogen heeft. Weet u niet zeker welk visum past? Zeg het gerust, die beoordeling is precies wat wij doen.',
        service: 'Welke dienst heeft u nodig?',
        serviceOptions: [
          'Kennismigrantenvisum',
          'Europese blauwe kaart',
          'Zoekjaarvisum',
          'Partnervisum',
          'Gezinshereniging',
          'Startup-visum',
          'DAFT-visum',
          'Zakelijk Schengenvisum',
          'Verblijfsvergunning',
          'Nog niet zeker',
        ],
        nationality: 'Nationaliteit',
        currentLocation: 'Huidig woonland',
        status: 'Huidige immigratiestatus',
        statusOptions: [
          'Buiten de EU, nog geen Nederlandse vergunning',
          'Al in Nederland op een visum of vergunning',
          'EU- of EER-burger',
          'Anders of niet zeker',
        ],
        timeline: 'Wanneer wilt u verhuizen?',
        timelineOptions: ['Zo snel mogelijk', 'Binnen 3 maanden', '3 tot 6 maanden', 'Oriënterend'],
        message: 'Uw situatie',
        messagePlaceholder: 'Bijvoorbeeld: Amerikaans staatsburger, baan aangeboden in Rotterdam vanaf maart, partner en twee kinderen komen mee.',
      },
      relocation: {
        heading: 'Intake relocatie & wonen',
        text: 'Van een losse dienst tot een compleet pakket. Vertel ons hoe uw aankomst eruit moet zien.',
        service: 'Wat heeft u nodig?',
        serviceOptions: [
          'Compleet relocatiepakket',
          'Woningzoektocht',
          'Scholenzoektocht',
          'BSN en registraties',
          'Settling-in-ondersteuning',
          'Tijdelijke huisvesting',
          'Relocatie industrieregio',
          'Iets anders',
        ],
        movingFrom: 'Verhuizend vanuit',
        household: 'Wie verhuist er?',
        householdOptions: ['Alleen ik', 'Mijn partner en ik', 'Mijn gezin met kinderen', 'Medewerkers van mijn bedrijf', 'Anders'],
        timeline: 'Wanneer komt u aan?',
        timelineOptions: ['Zo snel mogelijk', 'Binnen 3 maanden', '3 tot 6 maanden', 'Oriënterend'],
        message: 'Uw verhuizing',
        messagePlaceholder: 'Bijvoorbeeld: gezin van vier verhuist in de zomer vanuit Zürich, woning nodig bij een internationale school.',
      },
      vip: {
        heading: 'VIP-relocatieaanvraag',
        text: 'Discreet, snel en gebouwd rond uw agenda. Geef ons de data en wij ontwerpen het bezoek.',
        package: 'Welk pakket heeft uw interesse?',
        packageOptions: [
          'Couple VIP Package',
          'Family VIP Package',
          'Business VIP Package',
          'VIP Relocation Concierge',
          'Nog niet zeker',
        ],
        preferredContact: 'Voorkeurscontact',
        preferredContactOptions: ['WhatsApp', 'Telefoon', 'E-mail'],
        arrival: 'Geplande aankomst',
        movingFrom: 'Verhuizend vanuit',
        message: 'Uw relocatie',
        messagePlaceholder: 'Bijvoorbeeld: verhuizing vanuit Los Angeles in oktober, beschikbaar voor één voorbereidingsbezoek in september.',
      },
    },
  },

  privacy: {
    metaTitle: 'Privacybeleid | E & I Expat & Immigration Services',
    title: 'Privacybeleid',
    intro: [
      'E & I: Expat, Relocation and Immigration Services The Netherlands verwerkt persoonsgegevens uitsluitend om op uw aanvraag te reageren en om de relocatie- en immigratiediensten te leveren waarvoor u ons inschakelt.',
    ],
    sections: [
      {
        heading: 'Wat wij verzamelen',
        paragraphs: [
          'Wanneer u contact met ons opneemt, ontvangen wij de gegevens die u zelf deelt: uw naam, contactgegevens en de beschrijving van uw situatie. Voor actieve cliënten verwerken wij daarnaast de documenten die voor aanvragen nodig zijn, altijd met uw medeweten.',
        ],
      },
      {
        heading: 'Hoe wij ze gebruiken',
        paragraphs: [
          'Uw gegevens worden gebruikt om u te antwoorden, om uw relocatie- of immigratiedossier voor te bereiden en te beheren, en voor geen enkel ander doel. Wij verkopen geen gegevens en gebruiken ze niet voor advertenties.',
        ],
      },
      {
        heading: 'Bewaartermijn en uw rechten',
        paragraphs: [
          'Aanvraaggegevens worden niet langer bewaard dan nodig om u van dienst te zijn. U kunt op elk moment inzage, correctie of verwijdering van uw gegevens aanvragen via de onderstaande contactgegevens.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          'E & I: Expat, Relocation and Immigration Services The Netherlands, Laan van Zuid Hoorn 70, Rijswijk. KvK 65768922.',
        ],
      },
    ],
  },

  notFound: {
    title: 'Deze pagina is verhuisd',
    text: 'De pagina die u zoekt bestaat niet, of het adres is veranderd. Laat ons u terugleiden.',
    label: 'Terug naar de homepage',
  },
};
