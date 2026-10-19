// Nederlands - de brontaal. `data` is hier leeg: data.mjs IS het Nederlands.
// De Engelse en Duitse bestanden hiernaast overschrijven daarvan alleen de
// stukken die taal zijn; cijfers, logo's, video-id's en namen van bedrijven
// blijven uit data.mjs komen.
export default {
  code: 'nl',
  lang: 'nl',
  basis: '',                       // de Nederlandse versie staat op de wortel
  naam: 'Nederlands',
  kort: 'NL',
  data: {},

  // Welke pagina onder welke bestandsnaam staat. De sleutel is de interne
  // naam, de waarde het pad binnen deze taal. Zo kan elke taal zijn eigen
  // vindbare adres hebben zonder dat de links in de blokken dat hoeven weten.
  paden: {
    home: '/',
    branded: '/branded-content',
    studio: '/studio',
    formats: '/formats',
    over: '/over-ons',
    contact: '/contact',
    puurgenieten: '/puurgenieten/',
    // Zelfde adres als op hun eigen site (framemedia.tv/programma-idee/),
    // inclusief de slash: dat adres staat in Google en in hun eigen menu.
    programmaIdee: '/programma-idee/',
    vacature: '/vacature',
    voorwaarden: '/voorwaarden',
  },

  nav: [
    ['home', 'Home'],
    // Puur Genieten staat als tweede, net als op hun eigen site. Dit is de
    // pagina waar verkeer naartoe moet, dus die hoort vooraan en niet weggestopt.
    ['puurgenieten', 'Puur Genieten'],
    ['branded', 'Branded content'],
    ['studio', 'Studio'],
    ['formats', 'Formats'],
    // Programma idee staat sinds 17-10-2026 in het menu. Dat adres is bij hen
    // het sterkste van de hele site (nummer 1 tot 2 in Google op 'tv programma
    // idee', 'programma idee' en 'programma idee insturen'), en het stond hier
    // alleen in de voettekst en in een knop op de formatpagina. Zonder
    // streepje, want dat is de zoekopdracht waar die pagina op staat.
    ['programmaIdee', 'Programma idee'],
    ['over', 'Over ons'],
    ['contact', 'Contact'],
  ],
  navKnop: 'Plan een gesprek',
  skip: 'Naar de inhoud',
  menuOpenen: 'Menu openen',
  menuLabel: 'Hoofdmenu',
  taalLabel: 'Taal',

  // de meebewegende balk op de telefoon
  ctaLabel: 'Direct contact',
  bellen: 'Bellen',
  mailen: 'Mailen',

  voet: {
    zin: 'Creators of content. Branded content, studiofaciliteiten en formatontwikkeling voor de commerci&euml;le zenders.',
    watWijDoen: 'Wat wij doen',
    studio: 'Studio',
    contact: 'Contact',
    tarieven: 'Tarieven',
    referenties: 'Referenties',
    programmaIdee: 'Programma idee',
    vacature: 'Vacature',
    voorwaarden: 'Algemene leveringsvoorwaarden',
    concept: 'Conceptversie &mdash; teksten, tarieven en gegevens nog niet definitief',
  },

  // --- losse schermteksten in de blokken -----------------------------------
  ui: {
    uitgezondenOp: 'Uitgezonden op',
    showreelLabel: r => `Showreel: fragmenten uit ${r.join(', ')}`,
    showreelPauze: 'Showreel pauzeren',
    showreelPauzeLang: r => `Showreel pauzeren (fragmenten uit ${r.join(', ')})`,

    sfKop: 'Vraag de mogelijkheden op',
    sfStap: 'Stap 1 van 2',
    vBedrijf: 'Bedrijfsnaam',
    vMail: 'E-mailadres',
    vNaam: 'Contactpersoon',
    vTel: 'Telefoonnummer',
    vOver: 'Waar gaat het over?',
    sfVerder: 'Verder',
    sfNoot: 'Twee velden nu, de rest zo. Binnen een werkdag antwoord.',
    sfOpties: [
      'Mijn bedrijf op televisie',
      'De studio of podcaststudio huren',
      'Ik heb een programma-idee',
      'Iets anders',
    ],
    sfVerstuur: 'Aanvraag versturen',
    sfTerug: 'Terug naar stap 1',
    sfDankKop: 'Bedankt voor uw aanvraag',
    sfDank: 'Dit is een conceptversie, dus er is niets verstuurd. Op de echte site komt dit binnen bij FRAME MEDIA.',

    beeldUit: t => `Beeld uit ${t}`,
    beeldBranche: n => `Beeld uit de Puur Genieten-film over ${n}`,
    kiesBranche: 'Kies uw branche',
    brancheAnders: 'Mijn branche staat er niet bij',
    pgLogoAlt: 'Logo van het programma Puur Genieten',

    schetsLabel: (m, fmt) => `${m.naam}, ${fmt(m.b)} bij ${fmt(m.d)} meter, hoogte ${fmt(m.h)} meter`,
    mHoog: h => `${h} m hoog`,
    schetsNoot: 'Op schaal getekend uit de afmetingen die FRAME MEDIA zelf opgeeft. De vier vlakken zijn onderling vergelijkbaar; dit is geen plattegrond van het pand.',

    ketenBeeld: [
      ['6&#215;', 'Robotcamera'], ['', 'Beeldmenger'],
      ['', 'Vectorscope'], ['2&#215;', 'SSD-recorder'],
    ],
    ketenGeluid: [
      ['4&#215;', 'Microfoon'], ['', 'Audiomixer'], ['', 'Zendlijnprocessing'],
    ],
    ketenLabel: 'Signaalpad in Regie A. Beeld: zes robotcamera&rsquo;s naar de beeldmenger, naar de vectorscope, naar twee SSD-recorders. Geluid: vier microfoons naar de audiomixer, naar de zendlijnprocessing.',
    ketenRijBeeld: 'BEELD',
    ketenRijGeluid: 'GELUID',
    meterWave: 'Waveform &amp; audio',
    scopeLabel: 'Vectorscope met de zes kleurbalkdoelen, zoals in Regie A gebruikt om het videosignaal te meten',
    waveLabel: 'Waveformmonitor met daaronder een uitslagmeter voor het geluidsniveau',

    vglOnderdeel: 'Onderdeel',
    meestGekozen: 'Meest gekozen',
    allIn: 'All-in',
    inbegrepen: 'Inbegrepen',

    sbKicker: 'Eigen studio',
    sbKop: 'Opgenomen in Hilversum, in onze eigen studio',
    sbTekst: 'Geen gehuurde ruimte per dagdeel. Studio A met lichtplafond en horizondoek, de eigen regie ernaast, een podcaststudio, een greenroom en een visagieruimte - alles op &eacute;&eacute;n adres, dus een opnamedag blijft een opnamedag.',
    sbKnop: 'Bekijk de studio',
  },

  // Wat site.js nodig heeft. Staat als JSON in de <head>, want site.js komt
  // met defer binnen en is voor alle drie de talen hetzelfde bestand.
  js: {
    menuOpenen: 'Menu openen',
    menuSluiten: 'Menu sluiten',
    vulBedrijf: 'Vul uw bedrijfsnaam in.',
    vulMail: 'Vul een geldig e-mailadres in.',
    stap1: 'Stap 1 van 2',
    stap2: 'Stap 2 van 2',
    reelPauze: 'Showreel pauzeren',
    reelSpeel: 'Showreel afspelen',
    // Alleen in gebruik als er een echte bestemming onder het formulier zit
    // (FM_FORM_ENDPOINT, zie bouw.mjs). Op het conceptadres wordt er niets
    // verstuurd en kan het dus ook niet mislukken.
    verstuurBezig: 'Versturen...',
    verstuurMis: 'Het versturen is niet gelukt. Probeer het nog eens, of bel 06 3486 1375.',
  },

  // titel en omschrijving per pagina
  meta: {
    home: {
      titel: 'FRAME MEDIA | Creators of content &mdash; uw bedrijf op televisie',
      omschrijving: 'FRAME MEDIA brengt bedrijven op RTL 4, RTL 7, SBS 6 en AT5 met branded content: drie tot vijf minuten redactionele zendtijd in plaats van een reclamespot. Eigen HD-studio in Hilversum.',
    },
    branded: {
      titel: 'Branded content | FRAME MEDIA',
      omschrijving: 'Non-spot advertising: een redactioneel item van 3 tot 9 minuten waarin uw product in beeld komt en u zelf wordt ge&iuml;nterviewd. Werkwijze, wat erin zit en de tarieven.',
    },
    studio: {
      titel: 'Studiofaciliteiten | FRAME MEDIA',
      omschrijving: 'HD-televisiestudio met zes robotcamera&rsquo;s, aangekoppelde regie, podcaststudio, greenroom en visagie. Volledige specificaties per ruimte.',
    },
    formats: {
      titel: 'Formats | FRAME MEDIA',
      omschrijving: 'Formats waar FRAME MEDIA als producent of co-producent aan werkte, wat er nu op RTL 4 loopt, en de route voor uw eigen programma-idee.',
    },
    over: {
      titel: 'Over ons | FRAME MEDIA',
      omschrijving: 'FRAME MEDIA is het platform voor vraag en aanbod van programmasponsoring op de commerci&euml;le zenders. Ons verhaal en ruim honderd opdrachtgevers.',
    },
    contact: {
      titel: 'Contact | FRAME MEDIA',
      omschrijving: 'Neem vrijblijvend contact op met FRAME MEDIA over branded content, studiohuur of een programma-idee.',
    },
    puurgenieten: {
      titel: 'Puur Genieten op SBS 6 | uw bedrijf in het programma | FRAME MEDIA',
      omschrijving: 'Puur Genieten is een lifestyleprogramma op SBS 6 en KIJK voor kijkers die bewust genieten van het leven. Presentatrice Roxanna komt met de filmcrew bij u op locatie voor een interview en een impressie van uw bedrijf. Uw item wordt twee keer uitgezonden, op zaterdag en op zondag, all-in vanaf 2990. Van reizen en second homes tot wellness, interieur en persoonlijke verzorging.',
    },
    // Titel en H1 beginnen met dezelfde woorden als op hun eigen pagina
    // ('Programma idee? - FrameMedia'), zodat het adres en de zoekwoorden
    // gelijk blijven aan wat er nu al staat. Zonder streepje: 'programma idee'
    // is de zoekopdracht waarop die pagina nummer 1 tot 2 staat, en bij een
    // verhuizing verander je niet precies dat. In de lopende tekst staat het
    // wel met streepje ('programma-idee&euml;n'), want zo is het Nederlands.
    programmaIdee: {
      titel: 'Programma idee insturen? | FRAME MEDIA',
      omschrijving: 'Goede programma-idee&euml;n zijn goud waard. FRAME MEDIA beoordeelt uw tv-idee op inhoud en op sponsoring, werkt het uit tot een format en presenteert het aan de commerci&euml;le zenders. Alle idee&euml;n vertrouwelijk.',
    },
    vacature: {
      titel: 'Vacature: zelfstandig accountmanager | FRAME MEDIA',
      omschrijving: 'FRAME MEDIA zoekt een zelfstandig accountmanager (zzp) voor acquisitie en relatiebeheer rond televisieproducties.',
    },
    voorwaarden: {
      titel: 'Algemene leveringsvoorwaarden | FRAME MEDIA',
      omschrijving: 'De algemene leveringsvoorwaarden van FRAME MEDIA, vijftien artikelen over offertes, meerwerk, aansprakelijkheid, tarieven, betaling, intellectuele eigendom, opnamen en uitzending.',
    },
  },
};
