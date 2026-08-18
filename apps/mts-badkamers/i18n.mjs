// Taallaag. NL is de bron en staat op de root; en/tr/ru staan onder /en/ /tr/ /ru/.
//
// Alleen UI-teksten staan hier. De inhoud (projecttitels, intros, FAQ, voor/na-
// captions, reviews) staat per taal in i18n-content.mjs, met terugval op NL:
// zo blijft de site bouwen terwijl een vertaling nog niet af is, in plaats van
// halverwege om te vallen of een lege pagina op te leveren.

import { TR } from './i18n-tr.mjs';
import { RU } from './i18n-ru.mjs';

export const LOCALES = ['nl', 'en', 'tr', 'ru'];
export const DEFAULT_LOCALE = 'nl';

// URL-prefix per taal. NL heeft er geen: die staat op de root en blijft dus op
// zijn bestaande adressen staan (gedeelde links, Google-index, Werkspot-profiel).
export const prefix = (loc) => (loc === DEFAULT_LOCALE ? '' : `/${loc}`);

export const LANG_NAME = { nl: 'Nederlands', en: 'English', tr: 'Türkçe', ru: 'Русский' };
export const LANG_SHORT = { nl: 'NL', en: 'EN', tr: 'TR', ru: 'RU' };
export const OG_LOCALE = { nl: 'nl_NL', en: 'en_GB', tr: 'tr_TR', ru: 'ru_RU' };
export const HTML_LANG = { nl: 'nl', en: 'en', tr: 'tr', ru: 'ru' };

export const UI = {
  nl: {
    skip: 'Naar de inhoud',
    brandAria: 'MTS Badkamers, naar de homepage',
    menu: 'Menu',
    mainMenu: 'Hoofdmenu',
    langLabel: 'Taal',
    nav: {
      projecten: 'Projecten',
      voorna: 'Voor & na',
      diensten: 'Diensten',
      werkwijze: 'Werkwijze',
      reviews: 'Reviews',
      faq: 'Vragen',
      cta: 'App direct',
    },
    rail: { hint: 'Veeg opzij', prev: 'Naar links', next: 'Naar rechts' },
    fig: { video: 'Video afspelen', foto: 'Foto vergroten', alt: 'Werk van MTS Badkamers' },
    lb: { title: 'Foto bekijken', close: 'Sluiten', prev: 'Vorige', next: 'Volgende' },
    waPrefill: 'Hallo Mike, ik zag jullie site en wil graag een offerte voor mijn badkamer.',

    homeTitle: 'Badkamerspecialist Apeldoorn | MTS Badkamers',
    homeDesc:
      'MTS Badkamers uit Apeldoorn renoveert badkamers van sloop tot oplevering. Tegelwerk, sanitair, leidingwerk en CV, alles door een vakman. Vaste prijsopgave na de opname.',

    hero: {
      chip: 'Een vakman voor de hele klus',
      kick: 'Badkamerspecialist in Apeldoorn',
      h1: 'Een badkamer die klopt tot in de laatste voeg.',
      subWide:
        'Sloop, leidingwerk, waterdichting, tegelwerk en afmontage, door dezelfde vakman. Na de opname aan huis krijg je een vaste prijs.',
      subNarrow: 'Van sloop tot afmontage. Na de opname een vaste prijs.',
      cta1: 'App ons',
      cta2: 'Bekijk het werk',
      alt: 'Opgeleverde badkamer in Apeldoorn door MTS Badkamers',
      cap: 'Opgeleverd in Apeldoorn: zwevend wastafelblad onder een ronde spiegel met indirecte verlichting',
      strip: ['Geverifieerd door Werkspot', 'Biedt garantie', 'KvK {kvk}', 'Apeldoorn & omgeving'],
    },

    proj: {
      h: 'Het werk, project voor project',
      lead: 'Van sloopfoto tot oplevering, alle {n} klussen.',
      railLabel: 'Alle {n} projecten',
      go: 'Bekijk het project',
    },

    ba: {
      h: 'Dezelfde ruimte. Een paar weken later.',
      lead: 'Zelfde standpunt, zelfde uitsnede. Alleen de badkamer is anders.',
      tablist: 'Kies een transformatie',
      voor: 'Voor',
      na: 'Na',
      range: 'Van voor naar na',
      hint: 'Sleep ook op de foto zelf.',
      link: 'Hele project bekijken',
      altVoor: 'De oude situatie voor de verbouwing',
      altNa: 'Dezelfde ruimte na oplevering',
    },

    rev: {
      h: 'Wat klanten zeggen',
      lead: 'Deze beoordelingen staan op het Werkspot-profiel, ze zijn hier niet zelf verzameld.',
      all: 'Alle beoordelingen bekijken',
      verified: 'Geverifieerde klus via Werkspot',
      railLabel: 'Reviews op Werkspot',
      stars: '{n} van de 5 sterren',
    },

    over: {
      h: 'Een vakman die het hele traject doet, en er ook op terugkomt.',
      p: 'Bij de meeste badkamerverbouwingen lopen er vijf partijen door je huis. Hier is dat er een: Mike sloopt, trekt de leidingen, maakt waterdicht, tegelt en monteert het sanitair.',
      imgAlt: 'Mike van MTS Badkamers met een klant en zijn gezin, duimen omhoog na de klus',
      imgCap: 'Mike (links) bij een klant thuis, aan het eind van de klus',
      facts: ['projecten in beeld', 'vakman voor de hele klus', 'en wijde omgeving'],
      factCity: 'Apeldoorn',
    },

    svcH: 'Wat we doen',
    svc: [
      ['Badkamer renoveren of plaatsen', 'Sloop, leidingwerk, elektra, waterdichting, tegelwerk en afmontage.'],
      ['Toiletrenovatie', 'Nieuw toilet, inbouwreservoir en tegelwerk.'],
      ['Wand- en vloertegels', 'Visgraat, hexagon, grootformaat of natuursteenlook.'],
      ['Sanitair plaatsen of vervangen', 'Wastafels, meubels, douchewanden en toiletten.'],
      ['Douche- of badreparatie', 'Lekkage, afvoer of kitwerk dat aan vervanging toe is.'],
      ['IKEA badkamer monteren', 'Montage en aansluiting van je zelf gekochte badkamer.'],
      ['Kranen plaatsen of repareren', 'Inbouwkranen, thermostaatkranen en reparaties.'],
      ['Radiator (ver)plaatsen', 'Design- en handdoekradiatoren, inclusief leidingwerk.'],
      ['Waterleiding &amp; riolering', 'Verplaatsen, vervangen of compleet nieuw aanleggen.'],
      ['CV-ketel installeren', 'Vervanging of nieuwe installatie, incl. verdeler en expansievat.'],
    ],
    stepsH: 'Zes stappen, een aanspreekpunt',
    steps: [
      ['Opname bij je thuis', 'Samen in de ruimte kijken wat kan en wat het mag kosten.'],
      ['Offerte', 'Vaste prijs, materiaal en werk uitgesplitst.'],
      ['Sloop', 'Alles afgeschermd, afvoer geregeld, de rest van je huis blijft schoon.'],
      ['Installatie', 'Leidingwerk, elektra, afvoer en waterdichting.'],
      ['Tegelwerk &amp; afmontage', 'Uitzetten, tegelen, voegen, kitten, sanitair monteren.'],
      ['Oplevering', 'Samen doorlopen, restpunten direct opgelost, met garantie.'],
    ],

    faq: {
      h: 'Wat mensen vooraf willen weten',
      p: 'Staat je vraag er niet bij? App hem gewoon.',
      btn: 'Stel je vraag',
    },

    map: {
      h: 'Vanuit Apeldoorn, en een flink stuk daarbuiten.',
      p: "Apeldoorn is de thuisbasis. Een complete badkamer is weken werk, dus voor zo'n klus rijden we ook een stuk verder.",
      note: 'Woon je buiten de ring? Bij een complete verbouwing komen we daar ook kijken.',
      canvas: 'Kaart van het werkgebied rond Apeldoorn',
      fallback: 'Werkgebied: Apeldoorn en omgeving, tot ongeveer {km} km.',
    },

    cta: {
      homeKop: 'Badkamerplannen? Stuur een appje.',
      homeTxt:
        'Vertel kort wat je in gedachten hebt en stuur een paar fotos mee. Je krijgt een vrijblijvende prijsopgave en een realistische planning.',
      projKop: 'Zoiets voor jouw huis?',
      projTxt:
        'Stuur een appje met een paar fotos van je huidige badkamer. Je krijgt een eerlijke inschatting terug, vrijblijvend.',
      line: 'Vrijblijvende opname &middot; vaste prijsopgave &middot; een aanspreekpunt',
      app: 'App Mike',
      bel: 'Bellen',
      note: 'Werkgebied: Apeldoorn, Arnhem, Deventer, Zutphen en omstreken. KvK {kvk}.',
    },

    form: {
      kop: 'Stuur je aanvraag via WhatsApp',
      naam: 'Naam',
      naamPh: 'Je naam',
      plaats: 'Plaats',
      klus: 'Wat wil je laten doen?',
      klusOpts: [
        'Complete badkamerrenovatie',
        'Toiletrenovatie',
        'Alleen tegelwerk',
        'Sanitair plaatsen of vervangen',
        'CV, leidingwerk of installatie',
        'Reparatie of lekkage',
        'Iets anders',
      ],
      wanneer: 'Wanneer?',
      wanneerOpts: ['Zo snel mogelijk', 'Binnen 3 maanden', 'Later dit jaar', 'Nog aan het orienteren'],
      plan: 'Kort je plan',
      planPh: 'Bijvoorbeeld: badkamer van 6 m2, bad eruit en een inloopdouche erin.',
      go: 'Bericht klaarzetten',
      note: 'WhatsApp opent met je bericht erin. Je kunt het nog aanpassen voordat je verstuurt.',
      // Labels in het WhatsApp-bericht dat het formulier opbouwt (app.js).
      msg: { intro: 'Hallo Mike,', naam: 'Naam', plaats: 'Plaats', klus: 'Klus', wanneer: 'Wanneer', plan: 'Plan' },
    },

    dock: {
      home: 'Badkamerplannen?',
      proj: 'Zoiets voor jouw huis?',
      sub: 'Geverifieerd op Werkspot &middot; reactie meestal dezelfde dag',
    },

    foot: {
      sub: 'Badkamerrenovatie, tegelwerk en installatiewerk in Apeldoorn en omgeving.',
      projecten: 'Projecten',
      alle: 'Alle {n} projecten',
      diensten: 'Diensten',
      dienstenLinks: ['Badkamerrenovatie', 'Tegelwerk', 'Sanitair &amp; kranen', 'CV &amp; leidingwerk'],
      werkgebied: 'Werkgebied',
      gegevens: 'Gegevens',
      land: 'Apeldoorn, Nederland',
      werkspot: 'Werkspot-profiel',
      handelsnaam: 'MTS Badkamers is een handelsnaam van M. Techno Service.',
    },

    page: {
      crumbs: 'Kruimelpad',
      home: 'Home',
      projecten: 'Projecten',
      plaats: 'Plaats',
      plaatsVal: 'Apeldoorn e.o.',
      fases: 'Fases in beeld',
      fotos: "Foto's &amp; video",
      fase: 'Fase {n}',
      faseLabel: "Foto's bij fase {n}: {h}",
      oplevering: 'Oplevering',
      resultH: 'Het resultaat',
      resultP: 'Zoals opgeleverd, gefotografeerd op de dag van oplevering.',
      resultLabel: 'Opleveringsfotos',
      video: 'Video',
      videoH: "Video's van de klus",
      videoP: 'Rondje door de ruimte, opgenomen tijdens of vlak na de oplevering.',
      videoLabel: "Video's van dit project",
      bouwmap: 'Bouwmap',
      galH: "Alle foto's van dit project",
      galP: "{n} opnames uit de bouwmap: sloop, techniek, tegelwerk en detailfoto's.",
      galP2: ' Twee rijen, zijwaarts door te scrollen.',
      galLabel: 'Alle {n} fotos van dit project',
      prev: 'Vorige',
      next: 'Volgende',
      all: 'Alle projecten',
      titleSuffix: 'MTS Badkamers Apeldoorn',
    },

    nf: {
      title: 'Pagina niet gevonden | MTS Badkamers',
      desc: 'Deze pagina bestaat niet (meer).',
      h1: 'Deze pagina bestaat niet.',
      p: 'Misschien zocht je een van de projecten, of wil je gewoon even appen.',
      btn: 'Naar de projecten',
      wa: 'App ons',
    },

    ldDesc:
      'Badkamerspecialist en installatiebedrijf in Apeldoorn. Complete badkamerrenovaties, tegelwerk, sanitair, leidingwerk en CV.',
    ldOffers: [
      'Badkamerrenovatie',
      'Toiletrenovatie',
      'Wand- en vloertegels',
      'Sanitair plaatsen',
      'Waterleiding en riolering',
      'CV-ketel installeren',
    ],
  },

  en: {
    skip: 'Skip to content',
    brandAria: 'MTS Badkamers, back to the homepage',
    menu: 'Menu',
    mainMenu: 'Main menu',
    langLabel: 'Language',
    nav: {
      projecten: 'Projects',
      voorna: 'Before & after',
      diensten: 'Services',
      werkwijze: 'How it works',
      reviews: 'Reviews',
      faq: 'FAQ',
      cta: 'Message us',
    },
    rail: { hint: 'Swipe sideways', prev: 'Scroll left', next: 'Scroll right' },
    fig: { video: 'Play video', foto: 'Enlarge photo', alt: 'Work by MTS Badkamers' },
    lb: { title: 'View photo', close: 'Close', prev: 'Previous', next: 'Next' },
    waPrefill: 'Hi Mike, I saw your website and would like a quote for my bathroom.',

    homeTitle: 'Bathroom Specialist Apeldoorn | MTS Badkamers',
    homeDesc:
      'MTS Badkamers in Apeldoorn renovates bathrooms from strip-out to handover. Tiling, sanitary ware, pipework and heating, all by one craftsman. Fixed price after the site visit.',

    hero: {
      chip: 'One craftsman for the whole job',
      kick: 'Bathroom specialist in Apeldoorn',
      h1: 'A bathroom that is right down to the last joint.',
      subWide:
        'Strip-out, pipework, waterproofing, tiling and fitting, all by the same craftsman. After the visit to your home you get a fixed price.',
      subNarrow: 'From strip-out to fitting. A fixed price after the visit.',
      cta1: 'Message us',
      cta2: 'See the work',
      alt: 'Finished bathroom in Apeldoorn by MTS Badkamers',
      cap: 'Completed in Apeldoorn: a floating vanity top under a round mirror with indirect lighting',
      strip: ['Verified by Werkspot', 'Work guaranteed', 'Chamber of Commerce {kvk}', 'Apeldoorn & surroundings'],
    },

    proj: {
      h: 'The work, project by project',
      lead: 'From the first strip-out photo to handover, all {n} jobs.',
      railLabel: 'All {n} projects',
      go: 'View the project',
    },

    ba: {
      h: 'The same room. A few weeks later.',
      lead: 'Same viewpoint, same frame. Only the bathroom is different.',
      tablist: 'Choose a transformation',
      voor: 'Before',
      na: 'After',
      range: 'From before to after',
      hint: 'You can drag on the photo too.',
      link: 'View the whole project',
      altVoor: 'The old situation before the renovation',
      altNa: 'The same room after handover',
    },

    rev: {
      h: 'What customers say',
      lead: 'These reviews are on the Werkspot profile, they were not collected here.',
      all: 'See all reviews',
      verified: 'Verified job via Werkspot',
      railLabel: 'Reviews on Werkspot',
      stars: '{n} out of 5 stars',
    },

    over: {
      h: 'One craftsman who does the whole job, and comes back for it.',
      p: 'In most bathroom renovations five different parties walk through your house. Here it is one: Mike strips it out, runs the pipework, waterproofs, tiles and fits the sanitary ware.',
      imgAlt: 'Mike of MTS Badkamers with a customer and his family, thumbs up after the job',
      imgCap: 'Mike (left) at a customer at home, at the end of the job',
      facts: ['projects shown', 'craftsman for the whole job', 'and the wider region'],
      factCity: 'Apeldoorn',
    },

    svcH: 'What we do',
    svc: [
      ['Bathroom renovation or new build', 'Strip-out, pipework, electrics, waterproofing, tiling and fitting.'],
      ['Toilet renovation', 'New toilet, concealed cistern and tiling.'],
      ['Wall and floor tiles', 'Herringbone, hexagon, large format or stone look.'],
      ['Fitting or replacing sanitary ware', 'Basins, vanity units, shower screens and toilets.'],
      ['Shower or bath repairs', 'Leaks, drainage or silicone work that needs replacing.'],
      ['IKEA bathroom assembly', 'Fitting and connecting the bathroom you bought yourself.'],
      ['Fitting or repairing taps', 'Concealed taps, thermostatic taps and repairs.'],
      ['Fitting or moving a radiator', 'Design and towel radiators, including pipework.'],
      ['Water and waste pipes', 'Moving, replacing or installing from scratch.'],
      ['Boiler installation', 'Replacement or new installation, incl. manifold and expansion vessel.'],
    ],
    stepsH: 'Six steps, one point of contact',
    steps: [
      ['Visit to your home', 'Looking at the room together: what is possible and what it should cost.'],
      ['Quote', 'Fixed price, materials and labour listed separately.'],
      ['Strip-out', 'Everything screened off, waste removed, the rest of your house stays clean.'],
      ['Installation', 'Pipework, electrics, drainage and waterproofing.'],
      ['Tiling &amp; fitting', 'Setting out, tiling, grouting, sealing, fitting sanitary ware.'],
      ['Handover', 'Walked through together, snags fixed straight away, with a guarantee.'],
    ],

    faq: {
      h: 'What people want to know beforehand',
      p: 'Question not listed? Just message it.',
      btn: 'Ask your question',
    },

    map: {
      h: 'From Apeldoorn, and a good way beyond.',
      p: 'Apeldoorn is the home base. A complete bathroom is weeks of work, so for a job like that we drive further out.',
      note: 'Live outside the ring? For a complete renovation we will come and look there too.',
      canvas: 'Map of the working area around Apeldoorn',
      fallback: 'Working area: Apeldoorn and surroundings, up to roughly {km} km.',
    },

    cta: {
      homeKop: 'Bathroom plans? Send a message.',
      homeTxt:
        'Tell us briefly what you have in mind and send a few photos. You get a free quote and a realistic schedule.',
      projKop: 'Something like this for your home?',
      projTxt:
        'Send a message with a few photos of your current bathroom. You get an honest estimate back, no obligation.',
      line: 'Free site visit &middot; fixed quote &middot; one point of contact',
      app: 'Message Mike',
      bel: 'Call',
      note: 'Working area: Apeldoorn, Arnhem, Deventer, Zutphen and surroundings. CoC {kvk}.',
    },

    form: {
      kop: 'Send your request via WhatsApp',
      naam: 'Name',
      naamPh: 'Your name',
      plaats: 'Town',
      klus: 'What would you like done?',
      klusOpts: [
        'Complete bathroom renovation',
        'Toilet renovation',
        'Tiling only',
        'Fitting or replacing sanitary ware',
        'Heating, pipework or installation',
        'Repair or leak',
        'Something else',
      ],
      wanneer: 'When?',
      wanneerOpts: ['As soon as possible', 'Within 3 months', 'Later this year', 'Still orientating'],
      plan: 'Your plan in short',
      planPh: 'For example: 6 m2 bathroom, take out the bath and put in a walk-in shower.',
      go: 'Prepare message',
      note: 'WhatsApp opens with your message in it. You can still edit it before you send.',
      msg: { intro: 'Hi Mike,', naam: 'Name', plaats: 'Town', klus: 'Job', wanneer: 'When', plan: 'Plan' },
    },

    dock: {
      home: 'Bathroom plans?',
      proj: 'Something like this for you?',
      sub: 'Verified on Werkspot &middot; usually replies the same day',
    },

    foot: {
      sub: 'Bathroom renovation, tiling and installation work in Apeldoorn and the surrounding area.',
      projecten: 'Projects',
      alle: 'All {n} projects',
      diensten: 'Services',
      dienstenLinks: ['Bathroom renovation', 'Tiling', 'Sanitary ware &amp; taps', 'Heating &amp; pipework'],
      werkgebied: 'Working area',
      gegevens: 'Details',
      land: 'Apeldoorn, Netherlands',
      werkspot: 'Werkspot profile',
      handelsnaam: 'MTS Badkamers is a trading name of M. Techno Service.',
    },

    page: {
      crumbs: 'Breadcrumb',
      home: 'Home',
      projecten: 'Projects',
      plaats: 'Location',
      plaatsVal: 'Apeldoorn area',
      fases: 'Phases shown',
      fotos: 'Photos &amp; video',
      fase: 'Phase {n}',
      faseLabel: 'Photos of phase {n}: {h}',
      oplevering: 'Handover',
      resultH: 'The result',
      resultP: 'As handed over, photographed on the day of completion.',
      resultLabel: 'Handover photos',
      video: 'Video',
      videoH: 'Videos of the job',
      videoP: 'A walk through the room, filmed during or just after handover.',
      videoLabel: 'Videos of this project',
      bouwmap: 'Job file',
      galH: 'All photos of this project',
      galP: '{n} shots from the job file: strip-out, pipework, tiling and detail photos.',
      galP2: ' Two rows, scroll sideways.',
      galLabel: 'All {n} photos of this project',
      prev: 'Previous',
      next: 'Next',
      all: 'All projects',
      titleSuffix: 'MTS Badkamers Apeldoorn',
    },

    nf: {
      title: 'Page not found | MTS Badkamers',
      desc: 'This page does not exist (any more).',
      h1: 'This page does not exist.',
      p: 'Maybe you were looking for one of the projects, or you just want to send a message.',
      btn: 'To the projects',
      wa: 'Message us',
    },

    ldDesc:
      'Bathroom specialist and installation company in Apeldoorn. Complete bathroom renovations, tiling, sanitary ware, pipework and central heating.',
    ldOffers: [
      'Bathroom renovation',
      'Toilet renovation',
      'Wall and floor tiles',
      'Fitting sanitary ware',
      'Water and waste pipes',
      'Boiler installation',
    ],
  },

  tr: TR,
  ru: RU,
};

// {n}-achtige plaatshouders invullen.
export const fill = (s, vals = {}) => String(s).replace(/\{(\w+)\}/g, (m, k) => (k in vals ? vals[k] : m));
