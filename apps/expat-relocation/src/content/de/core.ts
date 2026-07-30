import type { CoreContent } from '../types';

export const core: CoreContent = {
  ui: {
    skipToContent: 'Zum Inhalt springen',
    nav: {
      home: 'Home',
      immigration: 'Immigration',
      housing: 'Wohnen',
      relocation: 'Relocation',
      business: 'Unternehmensgründung',
      vip: 'VIP-Services',
      guides: 'Ratgeber',
      about: 'Über uns',
      contact: 'Kontakt',
    },
    cta: {
      whatsapp: 'WhatsApp',
      whatsappLong: 'Direkt auf WhatsApp schreiben',
      consultation: 'Relocation-Beratung buchen',
      startRelocation: 'Starten Sie Ihre Relocation',
      readMore: 'Mehr erfahren',
      allServices: 'Alle Leistungen',
      backTo: 'Zurück zu',
      send: 'Anfrage senden',
      sending: 'Wird gesendet…',
      explore: 'Entdecken',
    },
    langBanner: {
      prompt: 'Möchten Sie diese Seite lieber auf {lang} lesen?',
      switch: 'Wechseln',
      dismiss: 'Nein, danke',
    },
    form: {
      firstName: 'Vorname',
      lastName: 'Nachname',
      email: 'E-Mail-Adresse',
      phone: 'Telefon / WhatsApp',
      optional: 'optional',
      successTitle: 'Vielen Dank, Ihre Anfrage wurde gesendet',
      successBody:
        'Johanna sieht sich Ihre Situation persönlich an und antwortet innerhalb eines Werktags, meist deutlich schneller. Bei dringenden Anliegen schreiben Sie uns auf WhatsApp.',
      errorTitle: 'Etwas ist schiefgelaufen',
      errorBody: 'Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie uns auf WhatsApp.',
      consent: 'Mit dem Absenden dieses Formulars stimmen Sie unserer Datenschutzerklärung zu.',
      nextSteps:
        'Nachdem Sie dieses Formular abgesendet haben, sieht sich Johanna Ihre Situation persönlich an und antwortet innerhalb eines Werktags mit einer ehrlichen Einschätzung, ob und wie wir helfen können. Liegt Ihr Anliegen außerhalb unserer Leistungen oder unserer Region, sagen wir Ihnen das sofort.',
    },
    footer: {
      tagline: 'Boutique-Relocation- und Immigrationsservices für Expats, die nach Rotterdam, in den Europoort und die weitere Hafenregion ziehen.',
      services: 'Leistungen',
      company: 'Unternehmen',
      contactHeading: 'Kontakt',
      legalHeading: 'Rechtliches',
      kvkLabel: 'KvK',
      rightsReserved: 'Alle Rechte vorbehalten.',
      builtBy: 'Website von',
    },
    misc: {
      from: 'ab',
      whatsIncluded: 'Das ist enthalten',
      otherServices: 'Weitere Leistungen',
      relatedGuides: 'Passende Ratgeber',
    },
  },

  home: {
    metaTitle: 'Boutique Relocation & Immigration Services in den Niederlanden | E & I',
    metaDescription:
      'Persönliche Relocation- und Immigrationsbegleitung für Expats, Familien und Unternehmer in Rotterdam, Europoort und der niederländischen Industrieregion. Visa, Wohnen, BSN, Schulen und VIP-Pakete.',
    hero: {
      h1: 'Boutique Relocation & Immigration Services in den Niederlanden',
      sub: 'Persönliche Relocation-Begleitung für Expats, Familien, Unternehmer und internationale Fachkräfte, die nach Rotterdam, in den Europoort und die niederländische Industrieregion ziehen.',
      ctaPrimary: 'Relocation-Beratung buchen',
      ctaWhatsapp: 'Direkt auf WhatsApp schreiben',
      ctaSecondary: 'Starten Sie Ihre Relocation',
      trust: 'Persönliche Begleitung durch Johanna, 24/7 erreichbar',
    },
    paths: {
      heading: 'Wie dürfen wir Sie beim Ankommen begleiten?',
      sub: 'Immigration, Wohnen, Relocation und VIP-Support, abgewickelt über ein einziges Unternehmen. Wählen Sie Ihren Weg hinein, und eine Person kennt Ihren Namen, von der ersten Nachricht bis zu dem Tag, an dem Sie sich zu Hause fühlen.',
      items: [
        {
          key: 'immigration',
          title: 'Immigrationsservices',
          text: 'Visa und Aufenthaltstitel für Fachkräfte, Partner, Familien und Gründer. Präzise vorbereitet, persönlich begleitet, von der ersten Prüfung bis zur Genehmigung.',
          label: 'Immigration entdecken',
          path: '/immigration',
          image: '/images/path-immigration.jpg?v=20260728',
          imageAlt: 'Beraterin führt eine Klientin durch Aufenthaltsdokumente',
        },
        {
          key: 'relocation',
          title: 'Relocation & Wohnen',
          text: 'Komplette Relocation-Pakete oder einzeln buchbare Leistungen: Wohnungssuche, Schulen, BSN, Versicherungen und alles dazwischen.',
          label: 'Relocation entdecken',
          path: '/relocation',
          image: '/images/path-relocation.jpg?v=20260728',
          imageAlt: 'Familie kommt an einem niederländischen Grachtenhaus an',
        },
        {
          key: 'vip',
          title: 'VIP-Relocation',
          text: 'Für Künstler, Sportler, Führungskräfte und Wochenend-Fly-ins. Ihr gesamter Umzug orchestriert um einen einzigen Besuch, mit Türen, die bereits offen stehen.',
          label: 'VIP-Services entdecken',
          path: '/vip-services',
          image: '/images/path-vip.jpg?v=20260728',
          imageAlt: 'Chauffeur öffnet eine Wagentür vor der Skyline von Rotterdam',
        },
      ],
    },
    mostRequested: {
      heading: 'Die meistgefragten Leistungen',
      sub: 'Die acht Dinge, nach denen Expats uns zuerst fragen.',
      items: [
        { label: 'Highly Skilled Migrant Visum', path: '/immigration/highly-skilled-migrant-visa-netherlands' },
        { label: 'Unterstützung bei der Wohnungssuche', path: '/housing/housing-search-assistance-netherlands' },
        { label: 'Partnervisum Niederlande', path: '/immigration/partner-visa-netherlands' },
        { label: 'BSN-Anmeldung', path: '/relocation/bsn-registration-netherlands' },
        { label: 'Startup-Visum Niederlande', path: '/immigration/startup-visa-netherlands' },
        { label: 'Schulsuche', path: '/relocation/school-search-netherlands' },
        { label: 'Komplettes Relocation-Paket', path: '/vip-services' },
        { label: 'Relocation Services Rotterdam', path: '/relocation/relocation-services-rotterdam' },
      ],
    },
    vipBlock: {
      eyebrow: 'VIP-Relocation-Services',
      heading: 'Kommen Sie so an, wie Sie es gewohnt sind',
      text: [
        'Manche Klienten können keine sechs Wochen für Papierkram aufbringen. Sie fliegen für ein Wochenende ein, unterschreiben, melden sich an und fliegen zurück, während wir den Rest erledigen. Unsere VIP-Pakete verdichten eine komplette Relocation zu einem Zeitplan, der um Sie herum gebaut ist: Termine gebündelt in einem einzigen Besuch, die Wohnungsauswahl vor Ihrer Landung getroffen, ein Wagen wartet am Schiphol.',
        'Paare, Familien und Unternehmen haben jeweils ihr eigenes Paket, und die Concierge-Stufe wird um das geschrieben, was Ihr Leben verlangt.',
      ],
      label: 'VIP-Relocation entdecken',
    },
    immigrationBlock: {
      eyebrow: 'Immigration für Expats',
      heading: 'Der richtige Aufenthaltstitel, richtig vorbereitet',
      text: [
        'Die niederländische Einwanderung belohnt Vorbereitung. Wir prüfen, welcher Weg tatsächlich zu Ihrer Situation passt, bereiten den Antrag so vor, wie die IND ihn sehen möchte, und begleiten Sie zu den Terminen, auf die es ankommt.',
      ],
      label: 'Alle Immigrationsservices',
      links: [
        { label: 'Highly Skilled Migrant', path: '/immigration/highly-skilled-migrant-visa-netherlands' },
        { label: 'Blaue Karte EU', path: '/immigration/eu-blue-card-netherlands' },
        { label: 'Partnervisum', path: '/immigration/partner-visa-netherlands' },
        { label: 'Startup-Visum', path: '/immigration/startup-visa-netherlands' },
        { label: 'DAFT-Visum', path: '/immigration/daft-visa-netherlands' },
        { label: 'Aufenthaltstitel', path: '/immigration/residence-permit-netherlands' },
      ],
    },
    housingBlock: {
      eyebrow: 'Wohnen & Ankommen',
      heading: 'Ein Zuhause, nicht nur eine Adresse',
      text: [
        'Der niederländische Mietmarkt bewegt sich in Tagen, nicht in Wochen. Wir suchen, gehen mit Ihnen oder für Sie zu Besichtigungen, prüfen jede Vertragsklausel vor der Unterschrift und bleiben Ansprechpartner für Ihren Vermieter, lange nachdem die Schlüssel Ihnen gehören.',
      ],
      label: 'Alle Wohnservices',
      links: [
        { label: 'Wohnungssuche', path: '/housing/housing-search-assistance-netherlands' },
        { label: 'Expat-Wohnen Rotterdam', path: '/housing/housing-for-expats-rotterdam' },
        { label: 'Besichtigungsbegleitung', path: '/housing/viewing-assistance-netherlands' },
        { label: 'Wohnen auf Zeit', path: '/housing/temporary-housing-for-expats-netherlands' },
      ],
    },
    businessBlock: {
      eyebrow: 'Unternehmensgründung',
      heading: 'Gründen Sie dort, wo die Welt anlegt',
      text: [
        'Startup-Visum, DAFT-Abkommen, KvK-Eintragung, eine Adresse, ein Zuhause, eine Schule für Ihre Kinder. Die meisten Kanzleien übernehmen eines davon. Wir übernehmen die gesamte Abfolge, denn ein Gründer zieht nicht in Etappen um, ein Gründer verlegt ein Leben.',
      ],
      label: 'Business-Services',
    },
    portBlock: {
      eyebrow: 'Häfen, Hafenwirtschaft & Offshore',
      heading: 'Der Spezialist für den Rotterdamer Hafen',
      text: [
        'Europas größter Hafen taucht in keiner Relocation-Broschüre auf, und doch bauen Zehntausende internationale Fachkräfte dort ihre Karriere. Wir sind die einzige Boutique-Agentur, die auf Rotterdam, die Region südlich davon, Europoort und die Maasvlakte spezialisiert ist, und arbeiten täglich mit den Hafen-, Offshore-, Schifffahrts- und Engineering-Unternehmen, die Menschen hierher holen.',
      ],
      label: 'Services für Industrie-Expats',
      areas: [
        { title: 'Rotterdam', text: 'Leben mit Skyline, internationale Schulen und die Stadt, die sich schneller wandelt als jede andere in den Niederlanden.' },
        { title: 'Europoort & Maasvlakte', text: 'Praktische Relocation für Hafen-, Offshore- und Raffineriefachkräfte und ihre Familien.' },
        { title: 'Südlich von Rotterdam', text: 'Ruhige Städte wie Brielle, Rozenburg und Hellevoetsluis, Minuten von den Terminals entfernt und doch eine Welt für sich.' },
      ],
      advantages: [
        { title: 'Lokale Ortskenntnis', text: 'Wir kennen die Viertel, Schulen, Vermieter und Pendelwege dieser Region Straße für Straße.' },
        { title: 'Schnelle persönliche Hilfe', text: 'Wir sind in der Nähe und können kurzfristig bei einer Besichtigung, am Gemeindeschalter oder in einem Notfall vor Ort sein.' },
        { title: 'Ein gewachsenes Netzwerk', text: 'Makler, Gemeinden, Schulen und internationale Arbeitgeber der Region kennen uns bereits.' },
        { title: 'Begleitung nach der Ankunft', text: 'Die Beziehung endet nicht bei den Schlüsseln. Wir bleiben Ansprechpartner, lange nachdem Sie angekommen sind.' },
      ],
      links: [
        { label: 'Europoort-Expats', path: '/industrial-expat-services/europoort-relocation-services-netherlands' },
        { label: 'Maasvlakte-Expats', path: '/industrial-expat-services/maasvlakte-expat-relocation-netherlands' },
        { label: 'Offshore-Fachkräfte', path: '/industrial-expat-services/offshore-expat-services-netherlands' },
        { label: 'Logistik-Fachkräfte', path: '/industrial-expat-services/relocation-for-logistics-professionals-netherlands' },
      ],
    },
    familyBlock: {
      eyebrow: 'Familien-Relocation',
      heading: 'Eine Familie umzuziehen ist eine eigene Disziplin',
      text: [
        'Schuljahre mit festen Stichtagen, mehrere IND-Akten statt einer, und ein Zuhause, das für alle funktionieren muss. Wir koordinieren die Ankunft der ganzen Familie, Immigration eingeschlossen, in einem Plan und einer Hand.',
      ],
      label: 'Relocation-Services für Familien',
      path: '/relocation/family-relocation-netherlands',
      image: '/images/relocation-family.jpg?v=20260728',
      imageAlt: 'Eltern und Kinder packen Kartons in ihrem neuen niederländischen Zuhause aus',
      links: [
        { label: 'VIP-Paket für Familien', path: '/vip-services/family-relocation-immigration-services-netherlands' },
        { label: 'Schulsuche', path: '/relocation/school-search-netherlands' },
        { label: 'Familienzusammenführung', path: '/immigration/family-reunification-netherlands' },
      ],
    },
    whyBoutique: {
      eyebrow: 'Warum Boutique',
      heading: 'Eine Agentur. Eine Person. Ihr Name.',
      text: [
        'Große Relocation-Firmen geben Ihnen eine Ticketnummer. Eine Boutique-Agentur gibt Ihnen einen Menschen. Johanna hat sich ihren Ruf in der Welt der Botschaften erarbeitet, wo Diskretion und Präzision keine Eigenschaften sind, sondern die Stellenbeschreibung.',
        'Wir sind keine allgemeine Expat-Agentur, die jede erdenkliche Leistung anbietet. Wir übernehmen Immigration, Wohnen, Relocation und VIP-Support für eine Region, über ein Unternehmen, und das vollständig.',
      ],
      points: [
        {
          title: 'Wir gehen mit',
          text: 'Zur Gemeinde, zur IND, zur Bank und zur Besichtigung. Sie bekommen bei uns nie eine Checkliste in die Hand gedrückt und viel Glück gewünscht.',
        },
        {
          title: '24/7, persönlich',
          text: 'Eine WhatsApp-Nummer, beantwortet von der Person, die Ihre Akte führt. Tag und Nacht, in der ersten Woche wie im ersten Jahr.',
        },
        {
          title: 'Die Einzige ihrer Art',
          text: 'Die Niederlande haben Corporate-Mobility-Firmen und Visa-Schalter. Und genau einen Boutique-Concierge für Expats.',
        },
        {
          title: 'Pakete, gebaut um Leben',
          text: 'Paar, Familie, Unternehmen oder Full Concierge. Jedes Paket deckt das gesamte Ankommen ab, nicht nur einen Ausschnitt.',
        },
      ],
      stats: [
        { value: '1200+', label: 'Begleitete Expats und Familien' },
        { value: '98%', label: 'Kundenzufriedenheit' },
        { value: '24/7', label: 'Persönlicher WhatsApp-Support' },
      ],
    },
    reviews: {
      eyebrow: 'Klientenstimmen',
      heading: 'Ankünfte, auf die wir stolz sind',
      sub: 'Echte Klienten, echte Wege in die Niederlande.',
      items: [
        {
          quote: 'Dank E & I war unsere Familienzusammenführung ein stressfreier Prozess. Alles war perfekt organisiert.',
          name: 'Anna',
          route: 'Von Russland in die Niederlande',
          tags: ['Relocation', 'Visum', 'Arbeitserlaubnis', 'Wohnungssuche', 'Familie'],
        },
        {
          quote: 'Johanna war in unseren ersten Tagen rund um die Uhr für uns da. Wirklich ein einzigartiger Service!',
          name: 'Chinedu',
          route: 'Von Nigeria in die Niederlande',
          tags: ['Relocation', 'Visum', 'Business', 'Startup', 'Integration'],
        },
      ],
    },
    whatsappCta: {
      heading: 'Eine Nachricht. Wir übernehmen ab hier.',
      text: 'Sagen Sie uns, wo Sie stehen und wo Sie hinmüssen. Sie schreiben mit Johanna, nicht mit einem Chatbot.',
      label: 'Auf WhatsApp schreiben',
    },
    contactBlock: {
      eyebrow: 'Beginnen Sie das Gespräch',
      heading: 'Erzählen Sie uns von Ihrem Umzug',
      text: 'Ein paar Zeilen genügen. Wir antworten innerhalb eines Werktags.',
    },
  },

  about: {
    metaTitle: 'Über E & I | Boutique-Agentur für Expats & Immigration Niederlande',
    metaDescription:
      'E & I ist die einzige Boutique-Agentur für Expat-Relocation und Immigration in den Niederlanden. Persönliche Begleitung durch Johanna, vom Visum über das Zuhause bis zum Ankommen.',
    eyebrow: 'Über E & I',
    title: 'Die Boutique hinter tausend Ankünften',
    intro: [
      'E & I: Expat, Relocation and Immigration Services The Netherlands entstand aus einer einfachen Beobachtung aus der Welt der Botschaften: Am besten wechseln jene Menschen das Land, die persönlich begleitet werden. Nicht verwaltet. Begleitet.',
      'Heute führt Johanna mit ihrem Netzwerk Fachkräfte, Paare, Familien und Gründer in die Niederlande, mit einer Spezialisierung, die sonst niemand beansprucht: Rotterdam, Europoort und die Industrieregion rund um Europas größten Hafen.',
    ],
    image: '/images/about-joanna.jpg',
    imageAlt: 'Johanna, Gründerin von E & I, in ihrem Büro',
    approach: {
      heading: 'Unser persönlicher Relocation-Ansatz',
      text: [
        'Jeder Klient hat einen festen Ansprechpartner, der die gesamte Akte kennt. Wenn die Gemeinde Sie persönlich sehen möchte, sitzen wir auf dem Stuhl neben Ihnen. Wenn ein Vermieter anruft, antworten wir auf Niederländisch. Und wenn in Ihrer ersten Woche um elf Uhr nachts etwas passiert, meldet sich auf WhatsApp dieselbe Person, die Sie vom Flughafen abgeholt hat.',
        'Diese Arbeitsweise lässt sich nicht auf Tausende Klienten pro Jahr skalieren. Genau das ist der Punkt.',
      ],
    },
    boutique: {
      heading: 'Warum eine Boutique-Agentur',
      text: [
        'Corporate-Mobility-Firmen sind auf Volumen gebaut: Portale, Tickets, Service-Level. Eine Boutique ist auf Ergebnisse gebaut. Sie erhalten das Urteilsvermögen von jemandem, der Hunderte Klienten durch die IND begleitet hat, die Geschwindigkeit eines Teams, das jeden Schalter der Region kennt, und die Diskretion, die ein unter Diplomaten aufgebauter Ruf verlangt.',
      ],
      points: [
        { title: 'Wurzeln in der Botschaftswelt', text: 'Präzision und Diskretion, gelernt dort, wo Fehler keine Option sind.' },
        { title: 'Eine Region, die sonst niemand bedient', text: 'Rotterdam, Europoort und die Maasvlakte, Straße für Straße vertraut.' },
        { title: 'Immigration und Relocation in einer Hand', text: 'Der Aufenthaltstitel, das Zuhause und das Leben darum herum, orchestriert von einem Team.' },
      ],
    },
    families: {
      heading: 'Begleitung für Expats und Familien',
      text: [
        'Die Hälfte einer gelungenen Relocation hat mit Papierkram nichts zu tun. Schulen, die zu Ihren Kindern passen, ein Viertel, das zu Ihren Abenden passt, ein Arzt, ein Fitnessstudio, ein Weg zur Arbeit. Unser Settling-in-Support nimmt diese Dinge so ernst wie das Visum, denn genau daran entscheidet sich, ob ein Umzug gelingt.',
      ],
    },
    reviews: {
      heading: 'Bewertungen & Erfahrungen',
      sub: 'Was Klienten über das Ankommen mit E & I sagen.',
    },
    cta: {
      title: 'Lernen Sie uns kennen, bevor Sie entscheiden',
      text: 'Eine Beratung kostet nichts und zeigt Ihnen genau, wo Sie stehen.',
      label: 'Relocation-Beratung buchen',
    },
  },

  contact: {
    metaTitle: 'Kontakt E & I | Relocation & Immigration Support Niederlande',
    metaDescription:
      'Vereinbaren Sie eine Relocation-Beratung, schreiben Sie uns auf WhatsApp oder senden Sie eine Immigrations-, Relocation- oder VIP-Anfrage. Persönliche Antwort innerhalb eines Werktags.',
    eyebrow: 'Kontakt',
    title: 'Starten Sie Ihre Relocation',
    intro: [
      'Wählen Sie den Weg, der zu Ihrer Situation passt, und schreiben Sie uns ein paar Zeilen. Ihre Anfrage landet direkt bei Johanna, und Sie erhalten innerhalb eines Werktags eine persönliche Antwort.',
    ],
    tabs: [
      {
        key: 'immigration',
        label: 'Immigration',
        text: 'Visa, Aufenthaltstitel und IND-Anträge.',
      },
      {
        key: 'relocation',
        label: 'Relocation & Wohnen',
        text: 'Pakete, Wohnungssuche, Schulen und Ankommen.',
      },
      {
        key: 'vip',
        label: 'VIP',
        text: 'Concierge-Relocations und Fly-in-Besuche.',
      },
    ],
    whatsapp: {
      heading: 'WhatsApp Relocation Support',
      text: 'Der schnellste Weg zu uns, und der Kanal, den unsere Klienten auch lange nach der Ankunft weiter nutzen.',
      label: 'Auf WhatsApp schreiben',
    },
    emergency: {
      heading: 'Dringende Relocation-Hilfe',
      text: 'Frist morgen, Wohnung geplatzt, ein Termin, den Sie nicht verpassen dürfen? Schreiben Sie uns auf WhatsApp mit dem Wort URGENT, und wir reagieren sofort, Tag und Nacht.',
    },
    details: {
      heading: 'Kontaktdaten',
    },
    formCopy: {
      immigration: {
        heading: 'Immigrations- & Relocation-Anfrage',
        text: 'Nennen Sie uns Ihre Staatsangehörigkeit und den Weg, den Sie im Blick haben. Unsicher, welches Visum passt? Sagen Sie es, genau diese Einschätzung ist unsere Arbeit.',
        service: 'Welche Leistung benötigen Sie?',
        serviceOptions: [
          'Highly Skilled Migrant Visum',
          'Blaue Karte EU',
          'Orientierungsjahr-Visum',
          'Partnervisum',
          'Familienzusammenführung',
          'Startup-Visum',
          'DAFT-Visum',
          'Business-Schengen-Visum',
          'Aufenthaltstitel',
          'Noch unsicher',
        ],
        nationality: 'Staatsangehörigkeit',
        currentLocation: 'Aktuelles Wohnsitzland',
        status: 'Aktueller Aufenthaltsstatus',
        statusOptions: [
          'Außerhalb der EU, noch kein niederländischer Aufenthaltstitel',
          'Bereits mit Visum oder Aufenthaltstitel in den Niederlanden',
          'EU- oder EWR-Bürger',
          'Anderes oder unsicher',
        ],
        timeline: 'Wann planen Sie den Umzug?',
        timelineOptions: ['So bald wie möglich', 'Innerhalb von 3 Monaten', '3 bis 6 Monate', 'Ich orientiere mich noch'],
        message: 'Ihre Situation',
        messagePlaceholder: 'Zum Beispiel: US-Staatsbürger, Stelle in Rotterdam ab März, Partnerin und zwei Kinder ziehen mit.',
      },
      relocation: {
        heading: 'Relocation- & Wohn-Anfrage',
        text: 'Von der einzelnen Leistung bis zum Komplettpaket. Sagen Sie uns, wie Ihre Ankunft aussehen soll.',
        service: 'Was benötigen Sie?',
        serviceOptions: [
          'Komplettes Relocation-Paket',
          'Wohnungssuche',
          'Schulsuche',
          'BSN und Anmeldungen',
          'Settling-in-Support',
          'Wohnen auf Zeit',
          'Relocation in die Industrieregion',
          'Etwas anderes',
        ],
        movingFrom: 'Umzug aus',
        household: 'Wer zieht um?',
        householdOptions: ['Nur ich', 'Mein Partner und ich', 'Meine Familie mit Kindern', 'Mitarbeiter meines Unternehmens', 'Anderes'],
        timeline: 'Wann kommen Sie an?',
        timelineOptions: ['So bald wie möglich', 'Innerhalb von 3 Monaten', '3 bis 6 Monate', 'Ich orientiere mich noch'],
        message: 'Ihr Umzug',
        messagePlaceholder: 'Zum Beispiel: vierköpfige Familie, Umzug aus Zürich im Sommer, Wohnung in der Nähe einer internationalen Schule gesucht.',
      },
      vip: {
        heading: 'VIP-Relocation-Anfrage',
        text: 'Diskret, schnell und um Ihren Kalender gebaut. Nennen Sie uns die Daten, wir gestalten den Besuch.',
        package: 'Welches Paket interessiert Sie?',
        packageOptions: [
          'VIP-Paket für Paare',
          'VIP-Paket für Familien',
          'VIP-Paket für Unternehmen',
          'VIP Relocation Concierge',
          'Noch unsicher',
        ],
        preferredContact: 'Bevorzugter Kontaktweg',
        preferredContactOptions: ['WhatsApp', 'Telefon', 'E-Mail'],
        arrival: 'Geplante Ankunft',
        movingFrom: 'Umzug aus',
        message: 'Ihre Relocation',
        messagePlaceholder: 'Zum Beispiel: Umzug aus Los Angeles im Oktober, verfügbar für einen Vorbereitungsbesuch im September.',
      },
    },
  },

  privacy: {
    metaTitle: 'Datenschutzerklärung | E & I Expat & Immigration Services',
    title: 'Datenschutzerklärung',
    intro: [
      'E & I: Expat, Relocation and Immigration Services The Netherlands verarbeitet personenbezogene Daten ausschließlich, um Ihre Anfrage zu beantworten und die Relocation- und Immigrationsleistungen zu erbringen, mit denen Sie uns beauftragen.',
    ],
    sections: [
      {
        heading: 'Welche Daten wir erheben',
        paragraphs: [
          'Wenn Sie uns kontaktieren, erhalten wir die Angaben, die Sie mit uns teilen möchten: Ihren Namen, Ihre Kontaktdaten und die Beschreibung Ihrer Situation. Für aktive Klienten verarbeiten wir zusätzlich die für Anträge erforderlichen Dokumente, stets mit Ihrem Wissen.',
        ],
      },
      {
        heading: 'Wie wir sie verwenden',
        paragraphs: [
          'Ihre Daten dienen dazu, Ihnen zu antworten sowie Ihre Relocation- oder Immigrationsakte vorzubereiten und zu führen, für keinen anderen Zweck. Wir verkaufen keine Daten und nutzen sie nicht für Werbung.',
        ],
      },
      {
        heading: 'Aufbewahrung und Ihre Rechte',
        paragraphs: [
          'Anfragedaten bewahren wir nur so lange auf, wie es für Ihre Betreuung nötig ist. Sie können jederzeit über die unten stehenden Kontaktdaten Auskunft, Berichtigung oder Löschung Ihrer Daten verlangen.',
        ],
      },
      {
        heading: 'Kontakt',
        paragraphs: [
          'E & I: Expat, Relocation and Immigration Services The Netherlands, Laan van Zuid Hoorn 70, Rijswijk. KvK 65768922.',
        ],
      },
    ],
  },

  notFound: {
    title: 'Diese Seite ist weitergezogen',
    text: 'Die gesuchte Seite existiert nicht oder ihre Adresse hat sich geändert. Lassen Sie sich von uns zurückführen.',
    label: 'Zurück zur Startseite',
  },
};
