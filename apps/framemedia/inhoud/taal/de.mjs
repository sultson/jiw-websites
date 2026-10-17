// Duits. Alleen wat taal is; de rest komt uit data.mjs.
//
// Programmatitels blijven staan zoals ze heten - Puur Genieten is de naam van
// een Nederlands SBS 6-programma, ook op een Duitse pagina. De Duitse pilot
// heet Purer Genoss Deutschland en is een pilot: op deze pagina's staat dus
// nergens dat er in Duitsland wordt uitgezonden. Zie LEESMIJ.md.
// "Mediawet" is wel vertaald naar "niederlandisches Mediengesetz", want dat is
// een wet en geen merk.
export default {
  code: 'de',
  lang: 'de',
  basis: '/de',
  naam: 'Deutsch',
  kort: 'DE',

  paden: {
    home: '/',
    branded: '/branded-content',
    studio: '/studio',
    over: '/ueber-uns',
    contact: '/kontakt',
    puurgenieten: '/puur-genieten/',
    voorwaarden: { extern: '/voorwaarden', bij: 'NL' },
  },

  nav: [
    ['home', 'Start'],
    ['puurgenieten', 'Puur Genieten'],
    ['branded', 'Branded Content'],
    ['studio', 'Studio'],
    ['over', '&Uuml;ber uns'],
    ['contact', 'Kontakt'],
  ],
  navKnop: 'Gespr&auml;ch vereinbaren',
  skip: 'Zum Inhalt',
  menuOpenen: 'Men&uuml; &ouml;ffnen',
  menuLabel: 'Hauptmen&uuml;',
  taalLabel: 'Sprache',

  ctaLabel: 'Direkter Kontakt',
  bellen: 'Anrufen',
  mailen: 'E-Mail',

  voet: {
    zin: 'Creators of content. Branded Content, Studiokapazit&auml;ten und Formatentwicklung f&uuml;r die niederl&auml;ndischen Privatsender.',
    watWijDoen: 'Was wir machen',
    studio: 'Studio',
    contact: 'Kontakt',
    tarieven: 'Preise',
    referenties: 'Referenzen',
    voorwaarden: 'Allgemeine Liefer&shy;bedingungen',
    concept: 'Konzeptversion &mdash; Texte, Preise und Firmenangaben noch nicht endg&uuml;ltig',
  },

  ui: {
    uitgezondenOp: 'Ausgestrahlt auf',
    showreelLabel: r => `Showreel: Ausschnitte aus ${r.join(', ')}`,
    showreelPauze: 'Showreel anhalten',
    showreelPauzeLang: r => `Showreel anhalten (Ausschnitte aus ${r.join(', ')})`,

    sfKop: 'Fragen Sie die M&ouml;glichkeiten ab',
    sfStap: 'Schritt 1 von 2',
    vBedrijf: 'Firmenname',
    vMail: 'E-Mail-Adresse',
    vNaam: 'Ansprechpartner',
    vTel: 'Telefonnummer',
    vOver: 'Worum geht es?',
    sfVerder: 'Weiter',
    sfNoot: 'Zwei Felder jetzt, der Rest gleich. Antwort innerhalb eines Werktages.',
    sfOpties: [
      'Mein Unternehmen im Fernsehen',
      'Studio oder Podcaststudio mieten',
      'Ich habe eine Programmidee',
      'Etwas anderes',
    ],
    sfVerstuur: 'Anfrage senden',
    sfTerug: 'Zur&uuml;ck zu Schritt 1',
    sfDankKop: 'Danke f&uuml;r Ihre Anfrage',
    sfDank: 'Dies ist eine Konzeptversion, es wurde also nichts gesendet. Auf der echten Website geht das bei FRAME MEDIA ein.',

    beeldUit: t => `Bild aus ${t}`,
    beeldBranche: n => `Bild aus dem Puur Genieten-Film &uuml;ber ${n}`,
    kiesBranche: 'W&auml;hlen Sie Ihre Branche',
    brancheAnders: 'Meine Branche steht nicht dabei',
    pgLogoAlt: 'Logo der Sendung Puur Genieten',

    schetsLabel: (m, fmt) => `${m.naam}, ${fmt(m.b)} mal ${fmt(m.d)} Meter, H&ouml;he ${fmt(m.h)} Meter`,
    mHoog: h => `${h} m hoch`,
    schetsNoot: 'Ma&szlig;stabsgetreu gezeichnet nach den Abmessungen, die FRAME MEDIA selbst angibt. Die vier Fl&auml;chen sind untereinander vergleichbar; dies ist kein Grundriss des Geb&auml;udes.',

    ketenBeeld: [
      ['6&#215;', 'Robotkamera'], ['', 'Bildmischer'],
      ['', 'Vektorskop'], ['2&#215;', 'SSD-Recorder'],
    ],
    ketenGeluid: [
      ['4&#215;', 'Mikrofon'], ['', 'Audiomischer'], ['', 'Sendeprocessing'],
    ],
    ketenLabel: 'Signalweg in Regie A. Bild: sechs Robotkameras zum Bildmischer, zum Vektorskop, zu zwei SSD-Recordern. Ton: vier Mikrofone zum Audiomischer, zum Sendeprocessing.',
    ketenRijBeeld: 'BILD',
    ketenRijGeluid: 'TON',
    meterWave: 'Waveform &amp; Audio',
    scopeLabel: 'Vektorskop mit den sechs Farbbalkenzielen, wie in Regie A zur Messung des Videosignals verwendet',
    waveLabel: 'Waveform-Monitor mit darunter einer Aussteuerungsanzeige f&uuml;r den Tonpegel',

    vglOnderdeel: 'Merkmal',
    meestGekozen: 'Am h&auml;ufigsten gew&auml;hlt',
    allIn: 'All-in',
    inbegrepen: 'Inklusive',

    sbKicker: 'Eigenes Studio',
    sbKop: 'Aufgenommen in Hilversum, im eigenen Studio',
    sbTekst: 'Kein halbtags gemieteter Raum. Studio A mit Lichtdecke und Rundhorizont, die eigene Regie daneben, ein Podcaststudio, ein Greenroom und ein Maskenraum - alles an einer Adresse, damit ein Drehtag ein Drehtag bleibt.',
    sbKnop: 'Studio ansehen',
  },

  js: {
    menuOpenen: 'Menü öffnen',
    menuSluiten: 'Menü schließen',
    vulBedrijf: 'Bitte geben Sie Ihren Firmennamen ein.',
    vulMail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    stap1: 'Schritt 1 von 2',
    stap2: 'Schritt 2 von 2',
    reelPauze: 'Showreel anhalten',
    reelSpeel: 'Showreel abspielen',
    verstuurBezig: 'Senden...',
    verstuurMis: 'Das Senden ist nicht gelungen. Versuchen Sie es noch einmal oder rufen Sie +31 6 3486 1375 an.',
  },

  meta: {
    home: {
      titel: 'FRAME MEDIA | Creators of content &mdash; Ihr Unternehmen im niederl&auml;ndischen Fernsehen',
      omschrijving: 'FRAME MEDIA bringt Unternehmen mit Branded Content auf RTL 4, RTL 7, SBS 6 und AT5: drei bis f&uuml;nf Minuten redaktionelle Sendezeit statt eines Werbespots. Eigenes HD-Studio in Hilversum.',
    },
    branded: {
      titel: 'Branded Content im niederl&auml;ndischen Fernsehen | FRAME MEDIA',
      omschrijving: 'Non-Spot-Werbung: ein redaktioneller Beitrag von 3 bis 9 Minuten, in dem Ihr Produkt zu sehen ist und Sie selbst interviewt werden. Ablauf, Leistungsumfang und Preise.',
    },
    studio: {
      titel: 'Studiokapazit&auml;ten in Hilversum | FRAME MEDIA',
      omschrijving: 'HD-Fernsehstudio mit sechs Robotkameras, angeschlossener Regie, Podcaststudio, Greenroom und Maske. Vollst&auml;ndige Spezifikationen pro Raum.',
    },
    over: {
      titel: '&Uuml;ber uns | FRAME MEDIA',
      omschrijving: 'FRAME MEDIA ist die Plattform f&uuml;r Angebot und Nachfrage von Programmsponsoring bei den niederl&auml;ndischen Privatsendern. Unsere Geschichte und &uuml;ber hundert Auftraggeber.',
    },
    contact: {
      titel: 'Kontakt | FRAME MEDIA',
      omschrijving: 'Nehmen Sie unverbindlich Kontakt mit FRAME MEDIA auf: Branded Content, Studiomiete oder eine Programmidee.',
    },
    puurgenieten: {
      titel: 'Puur Genieten auf SBS 6 | Ihr Unternehmen in der Sendung | FRAME MEDIA',
      omschrijving: 'Puur Genieten ist eine Lifestyle-Sendung auf SBS 6 und KIJK f&uuml;r Zuschauer, die bewusst das Leben genie&szlig;en. Moderatorin Roxanna kommt mit dem Filmteam zu Ihnen vor Ort f&uuml;r ein Interview und einen Eindruck Ihres Unternehmens. Ihr Beitrag wird zweimal ausgestrahlt, am Samstag und am Sonntag, all-in ab 2990. Von Reisen und Zweitwohnsitzen bis Wellness, Interieur und K&ouml;rperpflege.',
    },
  },

  data: {
    ROUTES: [
      {
        slug: 'branded-content',
        nr: '01',
        kort: 'Branded Content',
        titel: 'Ihr Unternehmen in einer TV-Sendung',
        zin: 'Drei bis f&uuml;nf Minuten Sendezeit, in denen Ihr Produkt zu sehen ist und Sie selbst interviewt werden. Kein Werbeblock, sondern Redaktion.',
        punten: ['Non-Spot von 3 bis 9 Minuten', 'Aufnahme vor Ort oder im Studio', 'All-in ab 2990'],
      },
      {
        slug: 'studio',
        nr: '02',
        kort: 'Studio mieten',
        titel: 'Unser Studio, Ihre Aufnahme',
        zin: 'Ein HD-Fernsehstudio mit sechs fernbedienbaren Kameras, angeschlossener Regie, einem Podcaststudio und allem, was dazugeh&ouml;rt.',
        punten: ['Studio A: Talkshow, Webinar, Live', 'Studio B: Podcast in Broadcastqualit&auml;t', 'Greenroom und Maske inklusive'],
      },
      {
        slug: 'formats',
        href: '/de/kontakt',
        nr: '03',
        kort: 'Format entwickeln',
        titel: 'Von der Idee zur Ausstrahlung',
        zin: 'Sie haben eine Programmidee? Wir bewerten sie inhaltlich und im Hinblick auf Sponsoring und legen sie den Sendern vor.',
        punten: ['Redaktion, Skript und Produktion', 'Pr&uuml;fung nach dem niederl&auml;ndischen Mediengesetz', 'Direkter Kontakt zu den Sendern'],
      },
    ],

    CIJFERS: [
      { getal: '100+', label: 'Unternehmen ins Fernsehen gebracht' },
      { getal: '7', label: 'Privatsender' },
      { getal: '3-5', label: 'Minuten Sendezeit pro Beitrag' },
      { getal: '1981', label: 'machen wir Fernsehen seit' },
    ],

    VERGELIJKING: {
      kolommen: ['Werbespot', 'Non-Spot (Branded Content)'],
      rijen: [
        ['Dauer', '20 bis 30 Sekunden', '3 bis 9 Minuten'],
        ['Form', 'Anzeige im Werbeblock', 'Redaktioneller Beitrag in der Sendung'],
        ['Wer spricht', 'Ein Sprecher aus dem Off', 'Sie selbst, interviewt vom Moderator'],
        ['Ort', 'Studio oder Set der Werbeagentur', 'Ihr eigener Betrieb oder unser Studio'],
        ['Der Zuschauer', 'Zappt weg oder sitzt den Block aus', 'Bleibt dabei, denn es ist die Sendung'],
        ['Was h&auml;ngen bleibt', 'Eine Botschaft', 'Eine Geschichte und ein Gesicht'],
      ],
    },

    STAPPEN: [
      { nr: '1', titel: 'Kennenlernen', tekst: 'Wir schauen gemeinsam, welche Sendung und welcher Sender zu Ihrem Produkt und Ihrer Zielgruppe passen. Unverbindlich und kostenlos.' },
      { nr: '2', titel: 'Drehbuch', tekst: 'Sie bestimmen, worum es im Beitrag geht. Vor dem Dreh liegt ein Ablaufplan vor, der auf Ihre W&uuml;nsche abgestimmt und nach dem niederl&auml;ndischen Mediengesetz gepr&uuml;ft ist.' },
      { nr: '3', titel: 'Aufnahme', tekst: 'Aufnahme in Ihrem eigenen Betrieb oder in unserem Studio in Hilversum. Wir liefern Moderation, Regie, Kamera, Licht und Ton.' },
      { nr: '4', titel: 'Postproduktion', tekst: 'Endmontage, Farbkorrektur, Tonbearbeitung und Sprecher. Die Musikrechte (BUMA/STEMRA) sind abgegolten.' },
      { nr: '5', titel: 'Ausstrahlung', tekst: 'Ihr Beitrag geht auf dem vereinbarten Sender auf Sendung, zu dem Sendetermin, den wir mit Ihnen durchgehen. Die Sendergeb&uuml;hr ist im Preis enthalten.' },
      { nr: '6', titel: 'Danach', tekst: 'Ver&ouml;ffentlichung in den sozialen Medien und ein digitaler Beitrag, den Sie unbegrenzt selbst nutzen d&uuml;rfen, auf Ihrer Website und in Ihren eigenen Kan&auml;len.' },
    ],

    INBEGREPEN: [
      'Vorbereitung und Pr&uuml;fung nach dem Mediengesetz',
      'Aufnahmen in Ihrem eigenen Betrieb',
      'Produktion, Redaktion und Regie',
      'Moderatorin und Sprecher',
      'Farbkorrektur und Tonbearbeitung',
      'Lineproduktion am Drehort',
      'Endmontage, sendefertig',
      'Sendergeb&uuml;hr',
      'Ver&ouml;ffentlichung in den sozialen Medien',
      'Abgeltung BUMA/STEMRA',
      'Digitaler Beitrag zur eigenen Nutzung',
    ],

    // Nur auf der Puur Genieten-Seite - siehe data.mjs.
    INBEGREPEN_UITZENDING_PG: 'Ausstrahlung am Samstag und am Sonntag',
    STAP_UITZENDING_PG: {
      nr: '5',
      tekst: 'Zwei Ausstrahlungen, am Samstag und am Sonntag, zu zwei verschiedenen Zeitpunkten. Die Sendergeb&uuml;hr ist im Preis enthalten.',
    },

    TARIEVEN: [
      { duur: '3 Minuten', prijs: '2990', zendtijd: '2 &times; 3 Minuten = 6 Minuten Sendezeit', bij: 'All-in, ohne Extras', uitgelicht: true },
      { duur: '4 Minuten', prijs: '3990', zendtijd: '2 &times; 4 Minuten = 8 Minuten Sendezeit', bij: 'All-in, ohne Extras' },
      { duur: '5 Minuten', prijs: 'Auf Anfrage', zendtijd: '2 &times; 5 Minuten = 10 Minuten Sendezeit', bij: 'All-in, ohne Extras' },
    ],
    TARIEVEN_GROOT: [
      { duur: '6 Minuten', prijs: 'Auf Anfrage', bij: 'Preis abh&auml;ngig vom Inhalt' },
      { duur: '9 Minuten', prijs: 'Auf Anfrage', bij: 'Preis abh&auml;ngig vom Inhalt' },
    ],
    EXTRAS: [
      { naam: 'Custom-Beitrag zur eigenen Nutzung', prijs: '490', bij: 'Bei 3, 4 und 5 Minuten' },
      { naam: 'Interview im Studio in Hilversum', prijs: '990', bij: 'Bei 3, 4 und 5 Minuten' },
      { naam: 'Break-Bumper inklusive Logo und Sprecher', prijs: '590', bij: 'Bei 3, 4 und 5 Minuten' },
      { naam: 'Break-Bumper oder Billboard inklusive Logo und Sprecher', prijs: '1490', bij: 'Nur bei 3 Minuten Sendezeit' },
    ],

    BRANCHES: [
      { slug: '2nd-home', naam: '2nd home', duur: '0:26', tekst: 'Makler und Anbieter von Zweitwohnsitzen.' },
      { slug: 'beautyfarm', naam: 'Beautyfarm, Wellness &amp; Spa', duur: '0:29', tekst: 'Resorts, Saunen und Spas.' },
      { slug: 'eten-en-drinken', naam: 'Essen und Trinken', duur: '0:26', tekst: 'Restaurants, Hersteller und Fachgesch&auml;fte.' },
      { slug: 'golfen', naam: 'Golf', duur: '0:25', tekst: 'Pl&auml;tze, Clubs und alles drumherum.' },
      { slug: 'massage', naam: 'Massage', duur: '0:14', tekst: 'Praxen und Behandlungszentren.' },
      { slug: 'meubelzaak', naam: 'M&ouml;belhaus', duur: '0:19', tekst: 'Wohngesch&auml;fte und Interieurmarken.' },
      { slug: 'reizen', naam: 'Reisen', duur: '0:23', tekst: 'Reiseveranstalter und Reiseziele.' },
      { slug: 'tuinen', naam: 'G&auml;rten', duur: '0:26', tekst: 'Gartencenter, G&auml;rtner und Outdoor-Leben.' },
    ],

    // Aus der Brosch&uuml;re des Kunden (10-10-2026). Vertaling van ons; het
    // Nederlands in data.mjs is de brontekst.
    PG_KIJKER: 'Puur Genieten ist ein Lifestyle-Programm f&uuml;r Zuschauer, die das Leben bewusst genie&szlig;en. Die Zielgruppe besteht aus M&auml;nnern und Frauen von etwa 20 bis 70 Jahren, mit Interesse an Qualit&auml;t, Gesundheit, K&ouml;rperpflege, Luxus, guter Ern&auml;hrung, Komfort und einem angenehmen Lebensstil.',

    PG_CATEGORIEEN: [
      'Reisen und Urlaub',
      'Zweitwohnsitze, Villen, Bungalows und Glamping',
      'Gadgets und Innovationen',
      'Essen und Trinken',
      'Entspannung und Wellness',
      'Interieur, Wohnen und Garten',
      'Nachhaltigkeit und Elektromobilit&auml;t',
      'Mode, Accessoires und Schmuck',
      'Bewegung, Fitness und Vitalit&auml;t',
      'K&ouml;rperpflege: Haut, Haar, N&auml;gel und Parf&uuml;ms',
    ],

    PG_ANDERS: 'Auch in anderen Branchen gibt es M&ouml;glichkeiten, solange das Unternehmen oder die Marke zum Charakter und zur Zielgruppe des Programms passt.',

    PG_OPBRENGST: [
      'Landesweite Sichtbarkeit &uuml;ber Fernsehen und Online-Video',
      'Professionelle Videoproduktion ohne gro&szlig;es Werbebudget',
      'Eine starke Kombination aus Fernsehen, KIJK und Social Media',
      'Mehr Vertrauen, Wiedererkennung und Markenpositionierung',
      'Ein rechtefreier Beitrag, den Sie auch nach der Ausstrahlung weiter nutzen k&ouml;nnen',
    ],

    PG_GEBRUIK: [
      'Website und Social Media',
      'Messen und Pr&auml;sentationen',
      'Showroom oder Schaufenster',
      'Newsletter und andere Marketingma&szlig;nahmen',
    ],

    VRAGEN: [
      {
        v: 'Ist das Werbung oder eine Sendung?',
        a: 'Es ist ein redaktioneller Beitrag innerhalb einer Sendung, bezahlt von Ihnen. Das hei&szlig;t Non-Spot. Das niederl&auml;ndische Mediengesetz stellt daran Anforderungen, und jeder Beitrag wird vor der Ausstrahlung daran gepr&uuml;ft. Der Zuschauer sieht einen Programmbeitrag, keinen Werbeblock.',
      },
      {
        v: 'Was kostet das?',
        a: 'Ein All-in-Beitrag von drei Minuten kostet 2990 und vier Minuten 3990. Darin ist alles enthalten: Vorbereitung, Aufnahme, Produktion, Montage, Moderation, Musikrechte, Sendergeb&uuml;hr und die Ausstrahlung. Den Preis f&uuml;r 5, 6 oder 9 Minuten nennen wir auf Anfrage.',
      },
      {
        v: 'Wo wird gedreht?',
        a: 'Meistens bei Ihnen vor Ort, denn Ihr eigener Betrieb erz&auml;hlt die Geschichte am besten. Wenn Sie ein Interview im Studio in Hilversum m&ouml;chten, ist das als Option m&ouml;glich.',
      },
      {
        v: 'Wann wird ausgestrahlt?',
        a: 'Die Sendungen laufen meist an den Wochenenden vormittags und nachmittags auf den niederl&auml;ndischen Privatsendern. Wie oft Ihr Beitrag auf Sendung geht, h&auml;ngt von der Sendung ab; beim Kennenlerngespr&auml;ch erfahren Sie, welche Sendetermine f&uuml;r Sie in Frage kommen.',
      },
      {
        v: 'Darf ich den Beitrag selbst nutzen?',
        a: 'Ja. Sie erhalten einen digitalen Beitrag zur eigenen Nutzung, also f&uuml;r Ihre Website und Ihre eigenen Kan&auml;le. Zus&auml;tzlich ver&ouml;ffentlichen wir ihn in den sozialen Medien.',
      },
      {
        v: 'Bestimme ich selbst, worum es geht?',
        a: 'Sie behalten die Regie. Sie bestimmen das Thema, und vor Drehbeginn liegt ein Ablaufplan vor, der auf Ihre W&uuml;nsche abgestimmt ist.',
      },
      {
        v: 'Wie lange dauert der ganze Ablauf?',
        a: 'Das h&auml;ngt von der Sendung und der Sendeplanung des Senders ab. Beim Kennenlerngespr&auml;ch sagen wir Ihnen, welche Sendetermine in Sicht sind und was das f&uuml;r die Planung bedeutet.',
      },
      {
        v: 'Ich habe selbst eine Idee f&uuml;r eine Sendung. Geht das?',
        a: 'Ja, daf&uuml;r gibt es einen eigenen Weg. Wir bewerten die Idee inhaltlich und im Hinblick auf Sponsoring und legen sie nach einer Einigung den niederl&auml;ndischen Privatsendern vor. Alle Ideen werden vertraulich behandelt.',
      },
    ],

    RUIMTES: [
      {
        slug: 'studio-a',
        fotos: [
          { bestand: 'studio-a-1', alt: 'Studio A von der Regieseite: Lichtdecke, Rundhorizont und das L-f&ouml;rmige Moderationspult' },
          { bestand: 'studio-a-2', alt: 'Das Moderationspult in Studio A aus der N&auml;he, dahinter das Dekor mit Lichteffekt' },
        ],
        naam: 'Studio A',
        type: 'HD-Fernsehstudio',
        zin: 'Ein HD-Fernsehstudio mit sechs fernbedienbaren Kameras, aus dem Live-Webinare in Broadcastqualit&auml;t gesendet und Sendungen f&uuml;r nationale und internationale Sender produziert werden.',
        kerncijfers: [
          ['Grundfl&auml;che', '9,75 &times; 7,30 m'],
          ['H&ouml;he', '2,75 m'],
          ['Kameras', 'Sechs HD-Robotkameras'],
          ['Sprecher', 'Maximal vier am Pult'],
        ],
        inbegrepen: [
          'Sechs HD-Robotkameras',
          'L-f&ouml;rmiges Moderationspult f&uuml;r maximal vier Sprecher',
          'PowerPoint-Folien, Clicker vom Sprecher bedient',
          'Zwei Teleprompter f&uuml;r das Autocue-System',
          'Drei Dekor-Bildschirme',
          'Rotes, gr&uuml;nes oder blaues Licht auf dem Rundhorizont',
          'Lichtdecke eingerichtet f&uuml;r vier Sprecher und Dekor',
          'L-f&ouml;rmiges Dekor mit Lichteffekt',
          'In-Ear-System (Ohrh&ouml;rer)',
          'Monitore zur Kontrolle des Programms',
          'Tonmonitore f&uuml;r Programm und Intercom',
          'WLAN und Klimaanlage',
        ],
        blokken: [
          { kop: 'Dekor', tekst: 'Das Standarddekor ist ein L-f&ouml;rmiges horizontales Banner von rund 9 Metern Breite und 80 cm H&ouml;he, mit grafischen Effekten in rot-orangem Ton, einem eingebauten Bildschirm und Lichteffekten. Dar&uuml;ber und darunter h&auml;ngen acht Tafeln von 80 &times; 40 cm. Mit Magnetfolie l&auml;sst sich die Anmutung an Ihr eigenes Corporate Design anpassen: eine sch&ouml;ne und kosteneffiziente Art, das Studio mit Ihrem Branding zu versehen.' },
          { kop: 'Licht', tekst: 'Die Lichtdecke besteht aus einzelnen Lampen und Lampengruppen, bedient von einem 12-Kreis-Lichtpult in Regie A. &Auml;nderungen sind dadurch sofort auf den Monitoren sichtbar und gut zu beurteilen.' },
          { kop: 'Kameras', tekst: 'Wir arbeiten mit Robotkameras auf festen Stativen. Mehrere Kameras werden von einem Remote Camera Operator fernbedient, was die Besetzung und damit die Kosten niedrig h&auml;lt.' },
          { kop: 'Ton', tekst: 'Headsets, Ansteckmikrofone oder Tischmikrofone, mit Kabel oder Funk. Dekorlautsprecher f&uuml;r Videoeinspieler und Gestaltung sowie f&uuml;r Regieanweisungen w&auml;hrend der Probe.' },
          { kop: 'Autocue', tekst: 'Vor einer Kamera steht ein Teleprompter mit dem zu sprechenden Text, damit der Sprecher direkt in die Linse blicken kann. Gedacht f&uuml;r Sprecher, die damit Erfahrung haben.' },
          { kop: 'Akustik und Klima', tekst: 'Der Raum ist optimal auf Sprache ausgelegt. Es gibt L&uuml;ftung und Klimaanlage, die w&auml;hrend einer Aufnahme oder Live-Sendung wegen des Ger&auml;uschs abgeschaltet wird.' },
        ],
      },
      {
        slug: 'regie-a',
        fotos: [
          { bestand: 'regie-a', alt: 'Regie A: Bildmischer, Audiomischer und Referenzmonitore, an Studio A angeschlossen' },
        ],
        naam: 'Regie A',
        type: 'Regieraum',
        zin: 'Regie A ist an Studio A angeschlossen. Diese Kombination ist darauf ausgelegt, Aufnahmen und Live-Sendungen von Fernsehprogrammen, Webcasts und Webinaren kosteneffizient in einem Standardset zu realisieren.',
        kerncijfers: [
          ['Grundfl&auml;che', '9,75 &times; 5,25 m'],
          ['H&ouml;he', '2,75 m'],
          ['Aufteilung', 'Drei Pulte'],
          ['Aufnahme', 'Zwei SSD-Recorder'],
        ],
        inbegrepen: [
          'Bildmischer',
          'Fernbedienung von sechs HD-Robotkameras',
          'Audiomischer mit Sendeprocessing',
          'Vier Mikrofonempf&auml;nger',
          'Sender f&uuml;r das In-Ear-System',
          'Schnittsystem (Avid Media Composer)',
          'Autocue-System (Portaprompt)',
          'Ausspielung von Vollbild-Videoeinspielern und Stills',
          'Namens- und Funktionseinblendungen',
          'Ausspielung von PowerPoint-Folien',
          'Stills auf den Dekor-Bildschirmen',
          'Lichtpult, 12 Kreise',
          'Zwei SSD-Recorder f&uuml;r die Aufnahme',
          'WLAN und Klimaanlage',
        ],
        blokken: [
          { kop: 'Aufteilung', tekst: 'Drei Reihen. Vordere Reihe: Regie, Remote Camera Operator und Tontechnik. Zweite Reihe: Webcast Engineer und Chefredaktion. Hintere Reihe: weitere Mitarbeitende.' },
          { kop: 'Bildmischer', tekst: 'Ein Schaltpult mit Kontrollmonitoren, um die Videoquellen zu sehen und zu beurteilen, plus ein eigener Monitor mit dem geschalteten Programm. Das Videosignal wird mit einem Vektorskop gemessen, damit es den professionellen Normen entspricht.' },
          { kop: 'Ton', tekst: 'Ein professioneller Audiomischer steuert Mikrofone, Videoeinspieler und Gestaltung. Der Tonpegel wird genau gemessen: f&uuml;r Broadcast gelten strenge Anforderungen. Referenzmonitore und Sendeprocessing sorgen f&uuml;r die Verst&auml;ndlichkeit.' },
          { kop: 'Zus&auml;tzliche Besetzung', tekst: 'Eine einfache An- und Abmoderation kann die Tontechnik meist mit &uuml;bernehmen. Wird mehr vom Autocue gelesen, ist ein eigener Autocue-Operator n&ouml;tig. M&uuml;ssen w&auml;hrend einer Sendung Mikrofone gewechselt werden, kommt eine Tonassistenz dazu.' },
        ],
      },
      {
        slug: 'studio-b',
        fotos: [
          { bestand: 'studio-b', alt: 'Studio B: der runde Podcasttisch mit vier Mikrofonen und Kopfh&ouml;rern' },
        ],
        naam: 'Studio B',
        type: 'Podcaststudio',
        zin: 'Studio B ist ein Podcaststudio, in dem Ton in professioneller Qualit&auml;t aufgenommen wird. An einem runden Tisch ist standardm&auml;&szlig;ig Platz f&uuml;r vier Sprecher. Nach Absprache sind mehr Sprecher m&ouml;glich.',
        kerncijfers: [
          ['Grundfl&auml;che', '6,35 &times; 6,30 m'],
          ['H&ouml;he', '2,75 m'],
          ['Sprecher', 'Vier am runden Tisch'],
          ['Archiv', 'Mindestens ein Jahr gratis'],
        ],
        inbegrepen: [
          'Aufnahme in professioneller Tonqualit&auml;t',
          'Runder Tisch f&uuml;r vier Sprecher',
          'Tunes, Jingles und Musik live einspielbar',
          'Gespr&auml;che mit Sprechern aus der Ferne',
          'Montage einzelner Fragmente',
          'Soundprocessing und Finishing',
          'Lieferung als WAV und MP3',
          'Versand &uuml;ber WeTransfer',
          'Mindestens ein Jahr Archivierung',
          'Klimaanlage, w&auml;hrend der Aufnahme aus',
        ],
        blokken: [
          { kop: 'In einem Durchgang aufnehmen', tekst: 'Tunes, Jingles und Musik k&ouml;nnen live eingespielt werden, wodurch eine komplette Sendung in einem Durchgang aufgenommen werden kann. Das macht die Produktion sehr kosteneffizient. Wir empfehlen, w&auml;hrend der Aufnahme so wenig wie m&ouml;glich zu stoppen, das kommt dem Gespr&auml;chsfluss zugute.' },
          { kop: 'Doch in Teilen', tekst: 'Wenn es sein muss, k&ouml;nnen Teile getrennt aufgenommen oder Fragmente wiederholt werden. Aufnahme- und Montagezeit werden dann allerdings l&auml;nger.' },
          { kop: 'Finishing und Lieferung', tekst: 'Nach der Montage folgt das Soundprocessing. Danach ist die WAV-Datei fertig; wegen der Dateigr&ouml;&szlig;e codieren wir sie meist auch nach MP3. Der Versand l&auml;uft unter anderem &uuml;ber WeTransfer.' },
          { kop: 'Archivierung', tekst: 'Wir bewahren Ihren Podcast mindestens ein Jahr gratis in unserem Archiv auf. Geht mit Ihrer eigenen Datei etwas schief, haben Sie etwas, worauf Sie zur&uuml;ckgreifen k&ouml;nnen.' },
        ],
      },
      {
        slug: 'greenroom',
        fotos: [
          { bestand: 'greenroom', alt: 'Der Greenroom mit gro&szlig;em Tisch, Kontrollbildschirm und Pantry' },
        ],
        naam: 'Greenroom',
        type: 'Produktionsraum',
        zin: 'Der Produktionsraum, in dem Sprecher und G&auml;ste warten, sich vorbereiten und essen. Einzeln mietbar, bei der Miete eines Studioraums aber inklusive.',
        kerncijfers: [
          ['Grundfl&auml;che', '4,90 &times; 6,40 m'],
          ['H&ouml;he', '2,75 m'],
          ['Pl&auml;tze', 'Rund acht am Tisch'],
          ['Bei Studiomiete', 'Inklusive'],
        ],
        inbegrepen: [
          'Gro&szlig;er Tisch f&uuml;r rund acht Personen',
          'Kontrollbildschirm mit Bild aus Studio A',
          'Laptop-Anschluss f&uuml;r PowerPoint',
          'Kaffee, Tee und Softdrinks',
          'Pantry mit K&uuml;hlschrank, Gefrierfach und Mikrowelle',
          'Separater Getr&auml;nkek&uuml;hlschrank',
          'Platz, um Mahlzeiten einzunehmen',
          'L&uuml;ftung und Klimaanlage',
        ],
        blokken: [
          { kop: 'Selbstbedienung oder Gastgeber', tekst: 'Das Catering l&auml;uft standardm&auml;&szlig;ig auf Selbstbedienungsbasis. Optional sorgen wir f&uuml;r einen Gastgeber oder eine Gastgeberin f&uuml;r den Empfang und die Betreuung von Sprechern und G&auml;sten.' },
          { kop: 'Mitschauen', tekst: 'Auf dem Kontrollbildschirm verfolgen Sie, was in Studio A passiert. Praktisch f&uuml;r Sprecher, die sp&auml;ter dran sind, und f&uuml;r Auftraggeber, die mitschauen wollen, ohne im Studio zu stehen.' },
        ],
      },
      {
        slug: 'visagie',
        fotos: [
          { bestand: 'visagie', alt: 'Der Maskenraum mit zwei Arbeitspl&auml;tzen und Spiegeln mit Arbeitslicht' },
        ],
        naam: 'Maskenraum',
        type: 'Maske',
        zin: 'Ein Maskenraum mit guten Spiegeln, in dem zwei Sprecher gleichzeitig geschminkt werden k&ouml;nnen. Wird separat vermietet, wenn er als Arbeitsraum einer Maskenbildnerin genutzt wird.',
        kerncijfers: [
          ['Pl&auml;tze', 'Zwei gleichzeitig'],
          ['Pro Sprecher', 'Rund 15 bis 45 Min.'],
          ['Vermietung', 'Separat, bei Einsatz einer Maske'],
          ['Empfehlung', 'Wechselkleidung mitbringen'],
        ],
        inbegrepen: [
          'Gute Spiegel und Arbeitslicht',
          'Zwei Arbeitspl&auml;tze',
          'Fernseh-Make-up',
          'Platz zum Umkleiden',
        ],
        blokken: [
          { kop: 'Planen Sie Zeit ein', tekst: 'Erstellen Sie einen realistischen Zeitplan, um alle, die vor der Kamera stehen, mit Fernseh-Make-up zu versehen. Rechnen Sie mit rund 45 Minuten f&uuml;r eine Frau und 15 Minuten f&uuml;r einen Mann.' },
          { kop: 'Kleidung', tekst: 'Tragen Sie Kleidung, die f&uuml;r einen Fernsehauftritt geeignet ist, und bringen Sie Wechselkleidung mit. Wir senden vorab den Anhang &bdquo;Tipps f&uuml;r Fernsehauftritte&ldquo; mit.' },
        ],
      },
    ],

    VIDEOS_BIJ: {
      'deTdhbPWHEw': 'Einf&uuml;hrung, mit KI erstellt',
      'hph7jDwIAck': 'Puur Genieten, SBS 6',
      'UAUAB-dQgP4': 'RTL 4',
      'nnXSpXg--8o': 'RTL 4',
      'iEV0h4Me6Zs': 'RTL 4',
      '5vDZX9njxsI': 'Vorspann, RTL 4',
      'v4jBMUAzz4U': 'Format, RTL 4',
      '0k0XVDhqFOw': 'Pilot, mit Klaas Wilting',
      'LyYLSzc4GgQ': 'Format, mit Bart Bosch',
      '_iHCL5n1Yis': 'Branded Content',
      'fI2kSRnNMFU': 'Branded Content',
      '65IBEqDsmA8': 'Format',
      'mQz7qHNO30g': 'Pilot',
      '-ukWLwLRgsc': 'Rolo Commercial',
    },
  },
};
