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
    },
    footer: {
      tagline: 'Boutique relocatie- en immigratiediensten voor expats die naar Nederland verhuizen.',
      services: 'Diensten',
      company: 'Bedrijf',
      contactHeading: 'Contact',
      legalHeading: 'Juridisch',
      kvkLabel: 'KvK',
      rightsReserved: 'Alle rechten voorbehouden.',
      builtBy: 'Website door',
    },
    misc: {
      from: 'vanaf',
      whatsIncluded: 'Wat is inbegrepen',
      otherServices: 'Andere diensten',
      relatedGuides: 'Gerelateerde gidsen',
    },
  },

  home: {
    metaTitle: 'Boutique Relocatie- & Immigratiediensten in Nederland | E & I',
    metaDescription:
      'Persoonlijke relocatie- en immigratiebegeleiding voor expats, gezinnen en ondernemers die naar Rotterdam, Europoort en de Nederlandse industrieregio verhuizen. Visa, wonen, BSN, scholen en VIP-pakketten.',
    hero: {
      h1: 'Boutique relocatie- en immigratiediensten in Nederland',
      sub: 'Persoonlijke relocatiebegeleiding voor expats, gezinnen, ondernemers en internationale professionals die naar Rotterdam, Europoort en de Nederlandse industrieregio verhuizen.',
      ctaPrimary: 'Plan een relocatiegesprek',
      ctaWhatsapp: 'Stuur ons direct een WhatsApp',
      ctaSecondary: 'Start uw relocatie',
    },
    paths: {
      heading: 'Hoe kunnen wij u helpen aankomen?',
      sub: 'Drie wegen naar binnen. Eén persoon die uw naam kent, van het eerste bericht tot de dag dat u zich thuis voelt.',
      items: [
        {
          key: 'immigration',
          title: 'Immigratiediensten',
          text: 'Visa en vergunningen voor professionals, partners, gezinnen en oprichters. Zorgvuldig voorbereid en persoonlijk begeleid, van toetsing tot goedkeuring.',
          label: 'Ontdek immigratie',
          path: '/immigration',
          image: '/images/path-immigration.jpg',
          imageAlt: 'Adviseur die een cliënt begeleidt bij verblijfsdocumenten',
        },
        {
          key: 'relocation',
          title: 'Relocatie & wonen',
          text: 'Complete relocatiepakketten of losse diensten: woningzoektocht, scholen, BSN, verzekeringen en alles daartussenin.',
          label: 'Ontdek relocatie',
          path: '/relocation',
          image: '/images/path-relocation.jpg',
          imageAlt: 'Gezin dat aankomt bij een Nederlands grachtenpand',
        },
        {
          key: 'vip',
          title: 'VIP-relocatie',
          text: 'Voor artiesten, sporters, bestuurders en wie maar één weekend heeft. Uw hele verhuizing georkestreerd rond één bezoek, met elke deur al open.',
          label: 'Ontdek VIP-diensten',
          path: '/vip-services',
          image: '/images/path-vip.jpg',
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
    regionBlock: {
      eyebrow: 'Specialist in Rotterdam & Europoort',
      heading: 'De regio die wij straat voor straat kennen',
      text: [
        'De grootste haven van Europa staat in geen enkele relocatiebrochure, en toch bouwen tienduizenden internationale professionals er hun carrière. Wij zijn het enige boutique bureau gespecialiseerd in Rotterdam, Europoort en de Maasvlakte, van penthouse op de Wilhelminapier tot gezinswoning op twintig minuten van de terminals.',
      ],
      label: 'Diensten voor industriële expats',
      areas: [
        { title: 'Rotterdam', text: 'Wonen met skyline, internationale scholen en de snelst veranderende stad van Nederland.' },
        { title: 'Europoort & Maasvlakte', text: 'Praktische relocatie voor haven-, offshore- en raffinaderijprofessionals en hun gezinnen.' },
        { title: 'De industrieregio', text: 'Rustige stadjes als Brielle en Rozenburg, op minuten van de terminals en een wereld ervan verwijderd.' },
      ],
    },
    whyBoutique: {
      eyebrow: 'Waarom boutique',
      heading: 'Eén bureau. Eén persoon. Uw naam.',
      text: [
        'Grote relocatiebureaus geven u een ticketnummer. Een boutique bureau geeft u een persoon. Johanna bouwde haar reputatie op in de ambassadewereld, waar discretie en precisie geen eigenschappen zijn, maar de functieomschrijving.',
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
    image: '/images/about-Johanna.jpg',
    imageAlt: 'Johanna, oprichter van E & I, in haar kantoor',
    approach: {
      heading: 'Onze persoonlijke relocatieaanpak',
      text: [
        'Elke cliënt heeft één aanspreekpunt dat het hele dossier kent. Als de gemeente u persoonlijk nodig heeft, zitten wij in de stoel naast u. Als een verhuurder belt, nemen wij op in het Nederlands. Als er in uw eerste week om elf uur ’s avonds iets gebeurt, is de WhatsApp-lijn dezelfde persoon die u van het vliegveld haalde.',
        'Die manier van werken schaalt niet naar duizenden cliënten per jaar. Dat is precies de bedoeling.',
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
