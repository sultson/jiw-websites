// Engels. Alleen wat taal is staat hier; de rest (logo's, video-id's,
// afmetingen, bedrijfsnamen, bedragen) komt uit data.mjs.
//
// Twee dingen bewust niet vertaald, want het zijn eigennamen: de
// programmatitels (Puur Genieten, Mondzorg.TV, Code Blauw) en de zenders.
// "Mediawet" is wel vertaald, als "Dutch Media Act" - een Engelse lezer kent
// die term niet en het is een wet, geen merk.
export default {
  code: 'en',
  lang: 'en',
  basis: '/en',
  naam: 'English',
  kort: 'EN',

  paden: {
    home: '/',
    branded: '/branded-content',
    studio: '/studio',
    over: '/about-us',
    contact: '/contact',
    puurgenieten: '/puur-genieten/',
    // Deze twee bestaan alleen in het Nederlands, dus een absoluut pad buiten
    // deze taal om. De voorwaarden zijn een juridisch stuk: dat laten we niet
    // door een vertaling heen gaan.
    voorwaarden: { extern: '/voorwaarden', bij: 'NL' },
  },

  nav: [
    ['home', 'Home'],
    ['puurgenieten', 'Puur Genieten'],
    ['branded', 'Branded content'],
    ['studio', 'Studio'],
    ['over', 'About us'],
    ['contact', 'Contact'],
  ],
  navKnop: 'Book a call',
  skip: 'Skip to content',
  menuOpenen: 'Open menu',
  menuLabel: 'Main menu',
  taalLabel: 'Language',

  ctaLabel: 'Direct contact',
  bellen: 'Call',
  mailen: 'Email',

  voet: {
    zin: 'Creators of content. Branded content, studio facilities and format development for the Dutch commercial channels.',
    watWijDoen: 'What we do',
    studio: 'Studio',
    contact: 'Contact',
    tarieven: 'Rates',
    referenties: 'Clients',
    voorwaarden: 'General terms and conditions',
    concept: 'Concept version &mdash; copy, rates and company details not yet final',
  },

  ui: {
    uitgezondenOp: 'Broadcast on',
    showreelLabel: r => `Showreel: clips from ${r.join(', ')}`,
    showreelPauze: 'Pause showreel',
    showreelPauzeLang: r => `Pause showreel (clips from ${r.join(', ')})`,

    sfKop: 'Ask what is possible',
    sfStap: 'Step 1 of 2',
    vBedrijf: 'Company name',
    vMail: 'Email address',
    vNaam: 'Contact person',
    vTel: 'Phone number',
    vOver: 'What is it about?',
    sfVerder: 'Continue',
    sfNoot: 'Two fields now, the rest in a moment. We reply within one working day.',
    sfOpties: [
      'My company on television',
      'Renting the studio or podcast studio',
      'I have an idea for a programme',
      'Something else',
    ],
    sfVerstuur: 'Send enquiry',
    sfTerug: 'Back to step 1',
    sfDankKop: 'Thank you for your enquiry',
    sfDank: 'This is a concept version, so nothing has been sent. On the live site this reaches FRAME MEDIA.',

    beeldUit: t => `Still from ${t}`,
    beeldBranche: n => `Still from the Puur Genieten film on ${n}`,
    kiesBranche: 'Choose your sector',
    brancheAnders: 'My sector is not listed',
    pgLogoAlt: 'Logo of the programme Puur Genieten',

    schetsLabel: (m, fmt) => `${m.naam}, ${fmt(m.b)} by ${fmt(m.d)} metres, height ${fmt(m.h)} metres`,
    mHoog: h => `${h} m high`,
    schetsNoot: 'Drawn to scale from the dimensions FRAME MEDIA states itself. The four areas are comparable with one another; this is not a floor plan of the building.',

    ketenBeeld: [
      ['6&#215;', 'Robotic camera'], ['', 'Vision mixer'],
      ['', 'Vectorscope'], ['2&#215;', 'SSD recorder'],
    ],
    ketenGeluid: [
      ['4&#215;', 'Microphone'], ['', 'Audio mixer'], ['', 'Broadcast processing'],
    ],
    ketenLabel: 'Signal path in Gallery A. Vision: six robotic cameras to the vision mixer, to the vectorscope, to two SSD recorders. Sound: four microphones to the audio mixer, to the broadcast processing.',
    ketenRijBeeld: 'VISION',
    ketenRijGeluid: 'SOUND',
    meterWave: 'Waveform &amp; audio',
    scopeLabel: 'Vectorscope showing the six colour bar targets, as used in Gallery A to measure the video signal',
    waveLabel: 'Waveform monitor with a level meter for the audio underneath',

    vglOnderdeel: 'Aspect',
    meestGekozen: 'Most chosen',
    allIn: 'All-in',
    inbegrepen: 'Included',

    sbKicker: 'Our own studio',
    sbKop: 'Recorded in Hilversum, in our own studio',
    sbTekst: 'Not a room hired by the half-day. Studio A with its lighting grid and cyclorama, our own gallery next door, a podcast studio, a green room and a make-up room - all at one address, so a shoot day stays a shoot day.',
    sbKnop: 'See the studio',
  },

  js: {
    menuOpenen: 'Open menu',
    menuSluiten: 'Close menu',
    vulBedrijf: 'Please enter your company name.',
    vulMail: 'Please enter a valid email address.',
    stap1: 'Step 1 of 2',
    stap2: 'Step 2 of 2',
    reelPauze: 'Pause showreel',
    reelSpeel: 'Play showreel',
    verstuurBezig: 'Sending...',
    verstuurMis: 'Sending failed. Please try again, or call +31 6 3486 1375.',
  },

  meta: {
    home: {
      titel: 'FRAME MEDIA | Creators of content &mdash; your company on Dutch television',
      omschrijving: 'FRAME MEDIA puts companies on RTL 4, RTL 7, SBS 6 and AT5 with branded content: three to five minutes of editorial airtime instead of a commercial. Our own HD studio in Hilversum.',
    },
    branded: {
      titel: 'Branded content on Dutch television | FRAME MEDIA',
      omschrijving: 'Non-spot advertising: an editorial item of 3 to 9 minutes featuring your product, with you interviewed on camera. How it works, what is included and the rates.',
    },
    studio: {
      titel: 'Studio facilities in Hilversum | FRAME MEDIA',
      omschrijving: 'HD television studio with six robotic cameras, an adjoining gallery, podcast studio, green room and make-up room. Full specifications per room.',
    },
    over: {
      titel: 'About us | FRAME MEDIA',
      omschrijving: 'FRAME MEDIA is the platform matching supply and demand for programme sponsorship on the Dutch commercial channels. Our story and over a hundred clients.',
    },
    contact: {
      titel: 'Contact | FRAME MEDIA',
      omschrijving: 'Get in touch with FRAME MEDIA about branded content, studio hire or an idea for a programme. No obligations.',
    },
    puurgenieten: {
      titel: 'Puur Genieten on SBS 6 | your company in the programme | FRAME MEDIA',
      omschrijving: 'Puur Genieten is a lifestyle programme on SBS 6 and KIJK for viewers who enjoy life deliberately. Presenter Roxanna and the film crew come to your location for an interview and an impression of your company. Your item is broadcast twice, on Saturday and on Sunday, all-in from 2990. From travel and second homes to wellness, interiors and personal care.',
    },
  },

  // --- data die wel taal is --------------------------------------------------
  data: {
    ROUTES: [
      {
        slug: 'branded-content',
        nr: '01',
        kort: 'Branded content',
        titel: 'Your company inside a TV programme',
        zin: 'Three to five minutes of airtime in which your product is shown and you are interviewed yourself. Not a commercial break, but editorial.',
        punten: ['Non-spot of 3 to 9 minutes', 'Shot on location or in the studio', 'All-in from 2990'],
      },
      {
        slug: 'studio',
        nr: '02',
        kort: 'Hire the studio',
        titel: 'Our studio, your recording',
        zin: 'An HD television studio with six remote-controlled cameras, an adjoining gallery, a podcast studio and everything around it.',
        punten: ['Studio A: talk show, webinar, live', 'Studio B: podcast at broadcast quality', 'Green room and make-up included'],
      },
      {
        slug: 'formats',
        href: '/en/contact',
        nr: '03',
        kort: 'Develop a format',
        titel: 'From idea to broadcast',
        zin: 'Do you have an idea for a programme? We assess it on content and on sponsorship, and put it to the channels.',
        punten: ['Editorial, scripting and production', 'Checked against the Dutch Media Act', 'Direct lines to the channels'],
      },
    ],

    CIJFERS: [
      { getal: '100+', label: 'companies brought to television' },
      { getal: '7', label: 'commercial channels' },
      { getal: '3-5', label: 'minutes of airtime per item' },
      { getal: '1981', label: 'making television since' },
    ],

    VERGELIJKING: {
      kolommen: ['Commercial', 'Non-spot (branded content)'],
      rijen: [
        ['Length', '20 to 30 seconds', '3 to 9 minutes'],
        ['Form', 'An advert in the commercial break', 'An editorial item inside the programme'],
        ['Who speaks', 'A voice-over', 'You, interviewed by the presenter'],
        ['Location', 'A studio or the agency set', 'Your own business, or our studio'],
        ['The viewer', 'Zaps away or sits out the break', 'Keeps watching, because it is the programme'],
        ['What sticks', 'A message', 'A story and a face'],
      ],
    },

    STAPPEN: [
      { nr: '1', titel: 'First meeting', tekst: 'Together we look at which programme and which channel suit your product and your audience. No cost, no obligation.' },
      { nr: '2', titel: 'Running order', tekst: 'You decide what the item is about. Before the shoot there is a running order built around your wishes, checked against the Dutch Media Act.' },
      { nr: '3', titel: 'Shoot', tekst: 'Shot at your own premises or in our studio in Hilversum. We supply the presenter, direction, camera, lighting and sound.' },
      { nr: '4', titel: 'Post', tekst: 'Final edit, colour grading, audio post and voice-over. Music rights (BUMA/STEMRA) are cleared.' },
      { nr: '5', titel: 'Broadcast', tekst: 'Your item goes out on the agreed channel, at the broadcast slot we go through with you. The channel fee is included in the price.' },
      { nr: '6', titel: 'Afterwards', tekst: 'Placement on social media, plus a digital version of the item that you may use without limit, on your own site and in your own channels.' },
    ],

    INBEGREPEN: [
      'Preparation and Media Act check',
      'Filming at your own premises',
      'Production, editorial and direction',
      'Presenter and voice-over',
      'Colour grading and audio post',
      'Line production on location',
      'Final edit, ready for broadcast',
      'Channel fee',
      'Placement on social media',
      'Music rights cleared (BUMA/STEMRA)',
      'Digital item for your own use',
    ],

    // Only on the Puur Genieten page - see data.mjs.
    INBEGREPEN_UITZENDING_PG: 'Broadcast on Saturday and on Sunday',
    STAP_UITZENDING_PG: {
      nr: '5',
      tekst: 'Two broadcasts, on Saturday and on Sunday, at two separate times. The channel fee is included in the price.',
    },

    TARIEVEN: [
      { duur: '3 minutes', prijs: '2990', zendtijd: '2 &times; 3 minutes = 6 minutes of airtime', bij: 'All-in, excluding add-ons', uitgelicht: true },
      { duur: '4 minutes', prijs: '3990', zendtijd: '2 &times; 4 minutes = 8 minutes of airtime', bij: 'All-in, excluding add-ons' },
      { duur: '5 minutes', prijs: 'On request', zendtijd: '2 &times; 5 minutes = 10 minutes of airtime', bij: 'All-in, excluding add-ons' },
    ],
    TARIEVEN_GROOT: [
      { duur: '6 minutes', prijs: 'On request', bij: 'Price depends on the content' },
      { duur: '9 minutes', prijs: 'On request', bij: 'Price depends on the content' },
    ],
    EXTRAS: [
      { naam: 'Custom item for your own use', prijs: '490', bij: 'With 3, 4 and 5 minutes' },
      { naam: 'Interview in the studio in Hilversum', prijs: '990', bij: 'With 3, 4 and 5 minutes' },
      { naam: 'Break bumper including logo and voice-over', prijs: '590', bij: 'With 3, 4 and 5 minutes' },
      { naam: 'Break bumper or billboard including logo and voice-over', prijs: '1490', bij: 'With 3 minutes of airtime only' },
    ],

    BRANCHES: [
      { slug: '2nd-home', naam: '2nd home', duur: '0:26', tekst: 'Estate agents and second-home providers.' },
      { slug: 'beautyfarm', naam: 'Beauty farm, wellness &amp; spa', duur: '0:29', tekst: 'Resorts, saunas and spas.' },
      { slug: 'eten-en-drinken', naam: 'Food and drink', duur: '0:26', tekst: 'Restaurants, producers and specialist shops.' },
      { slug: 'golfen', naam: 'Golf', duur: '0:25', tekst: 'Courses, clubs and everything around them.' },
      { slug: 'massage', naam: 'Massage', duur: '0:14', tekst: 'Practices and treatment centres.' },
      { slug: 'meubelzaak', naam: 'Furniture', duur: '0:19', tekst: 'Home stores and interior brands.' },
      { slug: 'reizen', naam: 'Travel', duur: '0:23', tekst: 'Tour operators and destinations.' },
      { slug: 'tuinen', naam: 'Gardens', duur: '0:26', tekst: 'Garden centres, landscapers and outdoor living.' },
    ],

    // Uit de brochure van de klant (10-10-2026). Vertaling van ons; het
    // Nederlands in data.mjs is de brontekst.
    PG_KIJKER: 'Puur Genieten is a lifestyle programme for viewers who enjoy life deliberately. The audience is made up of men and women of roughly 20 to 70 years old, with an interest in quality, health, personal care, luxury, good food, comfort and a pleasant way of living.',

    PG_CATEGORIEEN: [
      'Travel and holidays',
      'Second homes, villas, bungalows and glamping',
      'Gadgets and innovations',
      'Food and drink',
      'Relaxation and wellness',
      'Interiors, living and garden',
      'Sustainability and electric driving',
      'Fashion, accessories and jewellery',
      'Exercise, fitness and vitality',
      'Personal care: skin, hair, nails and perfumes',
    ],

    PG_ANDERS: 'Other sectors are possible as well, as long as the company or brand suits the character and the audience of the programme.',

    PG_OPBRENGST: [
      'National visibility through television and online video',
      'Professional video production without a large advertising budget',
      'A strong combination of television, KIJK and social media',
      'More trust, recognition and brand positioning',
      'A rights-free item you can keep using yourself after the broadcast',
    ],

    PG_GEBRUIK: [
      'Website and social media',
      'Trade fairs and presentations',
      'Showroom or shop window',
      'Newsletters and other marketing',
    ],

    VRAGEN: [
      {
        v: 'Is this advertising or is it a programme?',
        a: 'It is an editorial item within a programme, paid for by you. That is called non-spot. The Dutch Media Act sets conditions for it and every item is checked against them before it is broadcast. What the viewer sees is a programme item, not a commercial break.',
      },
      {
        v: 'What does it cost?',
        a: 'An all-in item of three minutes costs 2990 and four minutes 3990. That covers everything: preparation, filming, production, editing, presenter, music rights, the channel fee and the broadcast. The price of 5, 6 or 9 minutes is quoted on request.',
      },
      {
        v: 'Where is it filmed?',
        a: 'Usually at your own location, because your business tells the story best. If you would rather be interviewed in the studio in Hilversum, that can be added as an option.',
      },
      {
        v: 'When is it broadcast?',
        a: 'The programmes mostly go out on weekend mornings and afternoons on the Dutch commercial channels. How often your item airs depends on the programme; at the first meeting you hear which broadcast slots are in view for you.',
      },
      {
        v: 'May I use the item myself?',
        a: 'Yes. You receive a digital version for your own use, so on your own website and in your own channels. We also place it on social media.',
      },
      {
        v: 'Do I decide what it is about?',
        a: 'You stay in control. You decide the subject, and before filming starts there is a running order built around your wishes.',
      },
      {
        v: 'How long does the whole process take?',
        a: 'That depends on the programme and on the channel&rsquo;s broadcast planning. At the first meeting we tell you which broadcast slots are in view and what that means for the schedule.',
      },
      {
        v: 'I have an idea for a programme myself. Is that possible?',
        a: 'Yes, there is a separate route for that. We assess the idea on content and on sponsorship and, once we agree, put it to the Dutch commercial channels. All ideas are treated confidentially.',
      },
    ],

    RUIMTES: [
      {
        slug: 'studio-a',
        fotos: [
          { bestand: 'studio-a-1', alt: 'Studio A from the gallery side: the lighting grid, the cyclorama and the L-shaped presentation desk' },
          { bestand: 'studio-a-2', alt: 'Close-up of the presentation desk in Studio A, with the set and its lighting effect behind it' },
        ],
        naam: 'Studio A',
        type: 'HD television studio',
        zin: 'An HD television studio with six remote-controlled cameras, used to broadcast live webinars at broadcast quality and to make programmes for national and international channels.',
        kerncijfers: [
          ['Floor area', '9.75 &times; 7.30 m'],
          ['Height', '2.75 m'],
          ['Cameras', 'Six HD robotic cameras'],
          ['Speakers', 'Up to four at the desk'],
        ],
        inbegrepen: [
          'Six HD robotic cameras',
          'L-shaped presentation desk for up to four speakers',
          'PowerPoint slides, clicker operated by the speaker',
          'Two teleprompters for the autocue system',
          'Three set monitors',
          'Red, green or blue light on the cyclorama',
          'Lighting grid set for four speakers and set',
          'L-shaped set with lighting effect',
          'In-ear system (talkback earpiece)',
          'Monitors to follow the programme output',
          'Audio monitoring for programme and intercom',
          'Wi-Fi and air conditioning',
        ],
        blokken: [
          { kop: 'Set', tekst: 'The standard set is an L-shaped horizontal banner roughly 9 metres wide and 80 cm high, with graphic effects in a red-orange tint, a built-in screen and lighting effects. Eight panels of 80 &times; 40 cm hang above and below it. With magnetic foil the look and feel can be matched to your own house style: an attractive and cost-efficient way to put your branding in the studio.' },
          { kop: 'Lighting', tekst: 'The lighting grid consists of individual lamps and groups of lamps, operated from a 12-circuit lighting desk in Gallery A. Changes are therefore visible on the monitors immediately and easy to judge.' },
          { kop: 'Cameras', tekst: 'We work with robotic cameras on fixed pedestals. Several cameras are operated remotely by one Remote Camera Operator, which keeps the crew, and therefore the cost, low.' },
          { kop: 'Sound', tekst: 'Headsets, lapel microphones or desk microphones, wired or wireless. Set loudspeakers for video inserts and idents, and for direction during rehearsal.' },
          { kop: 'Autocue', tekst: 'One camera carries a teleprompter with the script, so the speaker can keep looking straight down the lens. Intended for speakers with experience of it.' },
          { kop: 'Acoustics and climate', tekst: 'The room is set up for speech. There is ventilation and air conditioning, which is switched off during a recording or live broadcast because of the noise.' },
        ],
      },
      {
        slug: 'regie-a',
        fotos: [
          { bestand: 'regie-a', alt: 'Gallery A: vision mixer, audio mixer and reference monitors, linked to Studio A' },
        ],
        naam: 'Gallery A',
        type: 'Control gallery',
        zin: 'Gallery A is linked to Studio A. The combination is designed to deliver recordings and live broadcasts of television programmes, webcasts and webinars cost-efficiently within a standard set.',
        kerncijfers: [
          ['Floor area', '9.75 &times; 5.25 m'],
          ['Height', '2.75 m'],
          ['Layout', 'Three desks'],
          ['Recording', 'Two SSD recorders'],
        ],
        inbegrepen: [
          'Vision mixer',
          'Remote control of six HD robotic cameras',
          'Audio mixer with broadcast processing',
          'Four microphone receivers',
          'Transmitter for the in-ear system',
          'Editing system (Avid Media Composer)',
          'Autocue system (Portaprompt)',
          'Playout of full-screen video inserts and stills',
          'Name and role captions',
          'PowerPoint slide playout',
          'Stills on the set monitors',
          'Lighting desk, 12 circuits',
          'Two SSD recorders for the recording',
          'Wi-Fi and air conditioning',
        ],
        blokken: [
          { kop: 'Layout', tekst: 'Three rows. Front row: director, Remote Camera Operator and sound engineer. Second row: webcast engineer and executive editor. Back row: other crew.' },
          { kop: 'Vision mixer', tekst: 'A switching panel with preview monitors to view and judge the video sources, plus a separate monitor showing the cut programme. The video signal is measured with a vectorscope, so that it meets professional standards.' },
          { kop: 'Audio', tekst: 'A professional audio mixer handles microphones, video inserts and idents. Levels are measured precisely: broadcast requirements are strict. Reference monitors and broadcast processing keep speech intelligible.' },
          { kop: 'Extra crew', tekst: 'A simple opening and closing script is usually something the sound engineer can take on as well. If more is read off the autocue, a separate autocue operator is needed. If microphones have to be swapped during a broadcast, an assistant sound engineer.' },
        ],
      },
      {
        slug: 'studio-b',
        fotos: [
          { bestand: 'studio-b', alt: 'Studio B: the round podcast table with four microphones and headphones' },
        ],
        naam: 'Studio B',
        type: 'Podcast studio',
        zin: 'Studio B is a podcast studio where sound is recorded at professional quality. The round table seats four speakers as standard. More speakers are possible by arrangement.',
        kerncijfers: [
          ['Floor area', '6.35 &times; 6.30 m'],
          ['Height', '2.75 m'],
          ['Speakers', 'Four at the round table'],
          ['Archive', 'At least a year, free'],
        ],
        inbegrepen: [
          'Recording at professional sound quality',
          'Round table for four speakers',
          'Tunes, jingles and music fired live',
          'Conversations with remote speakers',
          'Editing of separate segments',
          'Sound processing and finishing',
          'Delivery as WAV and MP3',
          'Sent via WeTransfer',
          'Archived for at least a year',
          'Air conditioning, off while recording',
        ],
        blokken: [
          { kop: 'Recorded in one go', tekst: 'Tunes, jingles and music can be fired live, which means a complete programme can be captured in a single pass. That makes the production highly cost-efficient. We advise stopping as little as possible during the recording; it does the flow of the conversation good.' },
          { kop: 'In parts after all', tekst: 'If it really has to be, parts can be recorded separately or segments done again. Recording and editing time do go up.' },
          { kop: 'Finishing and delivery', tekst: 'Sound processing follows the edit. The WAV file is then ready; because of the file size we usually also encode it to MP3. Delivery is via WeTransfer, among other routes.' },
          { kop: 'Archiving', tekst: 'We keep your podcast in our archive for at least a year, free of charge. If something happens to your own file, you have something to fall back on.' },
        ],
      },
      {
        slug: 'greenroom',
        fotos: [
          { bestand: 'greenroom', alt: 'The green room with its large table, the monitor screen and the pantry' },
        ],
        naam: 'Green room',
        type: 'Production room',
        zin: 'The production room where speakers and guests wait, prepare and eat. Available separately, but included when you hire a studio.',
        kerncijfers: [
          ['Floor area', '4.90 &times; 6.40 m'],
          ['Height', '2.75 m'],
          ['Seats', 'About eight at the table'],
          ['With studio hire', 'Included'],
        ],
        inbegrepen: [
          'Large table for about eight people',
          'Monitor screen showing Studio A',
          'Laptop connection for PowerPoint',
          'Coffee, tea and soft drinks',
          'Pantry with fridge, freezer and microwave',
          'Separate drinks fridge',
          'Room to eat a meal',
          'Ventilation and air conditioning',
        ],
        blokken: [
          { kop: 'Self-service or a host', tekst: 'Catering is self-service as standard. As an option we provide a host to receive and look after speakers and guests.' },
          { kop: 'Watching along', tekst: 'The monitor screen shows what is happening in Studio A. Useful for speakers who are on later, and for clients who want to watch without standing in the studio.' },
        ],
      },
      {
        slug: 'visagie',
        fotos: [
          { bestand: 'visagie', alt: 'The make-up room with two work stations and mirrors with task lighting' },
        ],
        naam: 'Make-up room',
        type: 'Make-up',
        zin: 'A make-up room with good mirrors, where two speakers can be made up at the same time. Hired separately when it is used as a make-up artist&rsquo;s work space.',
        kerncijfers: [
          ['Places', 'Two at a time'],
          ['Per speaker', 'About 15 to 45 min'],
          ['Hire', 'Separate, with a make-up artist'],
          ['Advice', 'Bring spare clothing'],
        ],
        inbegrepen: [
          'Good mirrors and task lighting',
          'Two work stations',
          'Television make-up',
          'Space to change clothes',
        ],
        blokken: [
          { kop: 'Allow time for it', tekst: 'Build a realistic schedule to get television make-up onto everyone who appears on camera. Allow roughly 45 minutes for a woman and 15 minutes for a man.' },
          { kop: 'Clothing', tekst: 'Wear clothing suitable for a television appearance and bring spare clothing. We send the note &ldquo;Tips for appearing on television&rdquo; in advance.' },
        ],
      },
    ],

    // Alleen het label onder de kaart is taal; titels zijn programmanamen.
    VIDEOS_BIJ: {
      'deTdhbPWHEw': 'Introduction, made with AI',
      'hph7jDwIAck': 'Puur Genieten, SBS 6',
      'UAUAB-dQgP4': 'RTL 4',
      'nnXSpXg--8o': 'RTL 4',
      'iEV0h4Me6Zs': 'RTL 4',
      '5vDZX9njxsI': 'Title sequence, RTL 4',
      'v4jBMUAzz4U': 'Format, RTL 4',
      '0k0XVDhqFOw': 'Pilot, with Klaas Wilting',
      'LyYLSzc4GgQ': 'Format, with Bart Bosch',
      '_iHCL5n1Yis': 'Branded content',
      'fI2kSRnNMFU': 'Branded content',
      '65IBEqDsmA8': 'Format',
      'mQz7qHNO30g': 'Pilot',
      '-ukWLwLRgsc': 'Rolo Commercial',
    },
  },
};
