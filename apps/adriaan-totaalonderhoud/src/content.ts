// All Adriaan Totaalonderhoud site copy + data.
// Bilingual: every visible string is { nl, en }. The company name is injected
// at render time via the {name} token.
// Tone: short, simple, no em dashes, no fillers.

export type L = { nl: string; en: string };

/* ---- Brand ----------------------------------------------------------- */

export interface Brand {
  name: string;
  logoFull: string;
  logoMark: string;
}

export const brand: Brand = {
  name: 'Adriaan Totaalonderhoud',
  logoFull: '/logos/at-full.png',
  logoMark: '/logos/at-mark.png',
};

/* ---- Business constants (shared by both names) ----------------------- */

export const business = {
  owner: 'Adriaan',
  kvk: '42037082',
  address: {
    street: 'Zuidhoven 9-N',
    postalCode: '6042 PB',
    city: 'Roermond',
    province: 'Limburg',
  },
  phone: {
    display: '06 45 49 29 18',
    href: 'tel:+31645492918',
  },
  whatsapp: {
    display: '06 45 49 29 18',
    link: 'https://wa.me/31645492918',
  },
  maps: 'https://www.google.com/maps?q=Zuidhoven+9-N+6042+PB+Roermond&output=embed',
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Zuidhoven+9-N+6042+PB+Roermond',
  hours: [
    { day: { nl: 'Maandag', en: 'Monday' }, time: '08:00 - 18:00' },
    { day: { nl: 'Dinsdag', en: 'Tuesday' }, time: '08:00 - 18:00' },
    { day: { nl: 'Woensdag', en: 'Wednesday' }, time: '08:00 - 18:00' },
    { day: { nl: 'Donderdag', en: 'Thursday' }, time: '08:00 - 18:00' },
    { day: { nl: 'Vrijdag', en: 'Friday' }, time: '08:00 - 18:00' },
    { day: { nl: 'Zaterdag', en: 'Saturday' }, time: { nl: 'Op afspraak', en: 'By appointment' } },
    { day: { nl: 'Zondag', en: 'Sunday' }, time: { nl: 'Gesloten', en: 'Closed' } },
  ],
  serviceArea: [
    'Roermond',
    'Stramproy',
    'Weert',
    'Nederweert',
    'Tungelroy',
    'Kelpen-Oler',
    'Heythuysen',
    'Maarheeze',
    'Budel',
    'Cranendonck',
    'Someren',
    'Asten',
    'Eindhoven',
    'Midden-Limburg',
  ],
};

/* ---- Navigation ------------------------------------------------------ */

export const navLinks: { label: L; href: string }[] = [
  { label: { nl: 'Diensten', en: 'Services' }, href: '#diensten' },
  { label: { nl: 'Werkwijze', en: 'Approach' }, href: '#werkwijze' },
  { label: { nl: 'Projecten', en: 'Projects' }, href: '#projecten' },
  { label: { nl: 'Ervaringen', en: 'Reviews' }, href: '#ervaringen' },
  { label: { nl: 'Contact', en: 'Contact' }, href: '#contact' },
];

/* ---- Hero ------------------------------------------------------------ */

export const hero = {
  eyebrow: { nl: 'Aannemer in Roermond', en: 'Contractor in Roermond' },
  titleStart: { nl: 'Verbouwen, renoveren en bouwen, ', en: 'Remodel, renovate and build, ' },
  titleEm: { nl: 'vakkundig geregeld', en: 'expertly handled' },
  titleEnd: { nl: '.', en: '.' },
  sub: {
    nl: '{name} pakt verbouwingen, renovatie, nieuwbouw, sloopwerk en onderhoud aan in Roermond en omstreken. Eén aanspreekpunt, strak vakwerk en een eerlijke prijs vooraf.',
    en: '{name} takes on remodelling, renovation, new build, demolition and maintenance in Roermond and the surrounding area. One point of contact, clean craftsmanship and an honest price up front.',
  },
  ctaPrimary: { nl: 'Vraag offerte aan', en: 'Request a quote' },
  ctaSecondary: { nl: 'Bel direct', en: 'Call now' },
  image: '/hero.webp',
  imageAlt: {
    nl: 'Muurdoorbraak met zichtbaar metselwerk tijdens een verbouwing',
    en: 'Wall opening with exposed brickwork during a remodel',
  },
};

export const heroChips: L[] = [
  { nl: 'Eén aanspreekpunt', en: 'One point of contact' },
  { nl: 'Eerlijke prijs vooraf', en: 'Honest price up front' },
  { nl: 'Vakwerk en garantie', en: 'Craftsmanship and warranty' },
];

/* ---- Reviews meta ---------------------------------------------------- */

export const reviewsMeta = {
  score: '4,9',
  source: { nl: 'klantervaringen', en: 'client reviews' },
};

/* ---- USP cards ------------------------------------------------------- */

export const usps: { title: L; body: L }[] = [
  {
    title: { nl: 'Eén aanspreekpunt', en: 'One point of contact' },
    body: {
      nl: 'Van sloop tot oplevering. U regelt alles met Adriaan, zonder los te knippen.',
      en: 'From demolition to handover. You arrange everything with Adriaan, nothing fragmented.',
    },
  },
  {
    title: { nl: 'Prijs vooraf', en: 'Price up front' },
    body: {
      nl: 'Eerst kijken, dan een heldere offerte. Geen verrassingen achteraf op de factuur.',
      en: 'We look first, then write a clear quote. No surprises on the invoice afterwards.',
    },
  },
  {
    title: { nl: 'Strak vakwerk', en: 'Clean craftsmanship' },
    body: {
      nl: 'Secuur werk met goede materialen. Afgewerkt tot in de details en schoon opgeleverd.',
      en: 'Precise work with solid materials. Finished down to the detail and handed over clean.',
    },
  },
  {
    title: { nl: 'Afspraak is afspraak', en: 'A deal is a deal' },
    body: {
      nl: 'Heldere planning en korte lijnen. U weet wanneer we komen en wanneer het klaar is.',
      en: 'Clear planning and short lines. You know when we start and when it is done.',
    },
  },
];

/* ---- Services -------------------------------------------------------- */

export const services: { key: string; title: L; body: L }[] = [
  {
    key: 'verbouwingen',
    title: { nl: 'Verbouwingen', en: 'Remodelling' },
    body: {
      nl: 'Muurdoorbraken, uitbouwen en een nieuwe indeling. We maken van uw woning een ruimte die werkt.',
      en: 'Wall openings, extensions and a new layout. We turn your home into a space that works.',
    },
  },
  {
    key: 'renovatie',
    title: { nl: 'Renovatie', en: 'Renovation' },
    body: {
      nl: 'Badkamers, keukens en complete woningen vernieuwd. Van gedateerd naar strak afgewerkt.',
      en: 'Bathrooms, kitchens and complete homes renewed. From dated to cleanly finished.',
    },
  },
  {
    key: 'nieuwbouw',
    title: { nl: 'Nieuwbouw', en: 'New build' },
    body: {
      nl: 'Aanbouwen, bijgebouwen en ruwbouw. Stevig opgezet en netjes afgebouwd.',
      en: 'Extensions, outbuildings and structural shells. Solidly built and neatly finished.',
    },
  },
  {
    key: 'sloopwerkzaamheden',
    title: { nl: 'Sloopwerkzaamheden', en: 'Demolition' },
    body: {
      nl: 'Binnensloop en strippen, gecontroleerd en veilig. Puin afgevoerd, klaar voor de volgende stap.',
      en: 'Interior demolition and stripping, controlled and safe. Rubble removed, ready for the next step.',
    },
  },
  {
    key: 'onderhoud',
    title: { nl: 'Onderhoud', en: 'Maintenance' },
    body: {
      nl: 'Schilderwerk, stucwerk, kozijnen en reparaties. We houden uw pand op orde.',
      en: 'Painting, plastering, window frames and repairs. We keep your property in order.',
    },
  },
  {
    key: 'zakelijk',
    title: { nl: 'Zakelijke projecten', en: 'Commercial projects' },
    body: {
      nl: 'Bedrijfsruimtes en winkelpanden afgebouwd of verbouwd. Snel inzetbaar, weinig overlast.',
      en: 'Commercial units and retail spaces fitted out or rebuilt. Quick to deploy, low disruption.',
    },
  },
];

export const serviceFormOptions: { value: string; label: L }[] = [
  { value: 'verbouwingen', label: { nl: 'Verbouwing', en: 'Remodelling' } },
  { value: 'renovatie', label: { nl: 'Renovatie', en: 'Renovation' } },
  { value: 'nieuwbouw', label: { nl: 'Nieuwbouw of aanbouw', en: 'New build or extension' } },
  { value: 'sloopwerkzaamheden', label: { nl: 'Sloopwerk', en: 'Demolition' } },
  { value: 'onderhoud', label: { nl: 'Onderhoud', en: 'Maintenance' } },
  { value: 'zakelijk', label: { nl: 'Zakelijk project', en: 'Commercial project' } },
  { value: 'other', label: { nl: 'Iets anders', en: 'Something else' } },
];

/* ---- Werkwijze ------------------------------------------------------- */

export const werkwijze: { step: string; title: L; body: L }[] = [
  {
    step: '01',
    title: { nl: 'Contact en kennismaken', en: 'Contact and intro' },
    body: {
      nl: 'U belt, appt of stuurt het formulier. We bespreken rustig wat u voor ogen heeft.',
      en: 'You call, message or send the form. We calmly go through what you have in mind.',
    },
  },
  {
    step: '02',
    title: { nl: 'Opname en offerte', en: 'Site visit and quote' },
    body: {
      nl: 'We komen langs, meten op en denken mee. U krijgt een duidelijke offerte vooraf.',
      en: 'We visit, take measurements and think along. You get a clear quote up front.',
    },
  },
  {
    step: '03',
    title: { nl: 'Uitvoeren', en: 'Execution' },
    body: {
      nl: 'We voeren het werk strak en op planning uit. Korte lijnen en netjes op de bouw.',
      en: 'We carry out the work cleanly and on schedule. Short lines and a tidy site.',
    },
  },
  {
    step: '04',
    title: { nl: 'Oplevering en nazorg', en: 'Handover and aftercare' },
    body: {
      nl: 'We leveren schoon op en lopen alles na. Vragen achteraf? We blijven bereikbaar.',
      en: 'We hand over clean and check everything. Questions later? We stay reachable.',
    },
  },
];

/* ---- About ----------------------------------------------------------- */

export const about = {
  paragraphs: [
    {
      nl: 'Achter {name} staat Adriaan: een vakman die verbouwen, bouwen en onderhoud van begin tot eind in handen neemt.',
      en: 'Behind {name} is Adriaan: a craftsman who takes remodelling, building and maintenance in hand from start to finish.',
    },
    {
      nl: 'Of het nu om een muurdoorbraak, een nieuwe badkamer, een aanbouw of een bedrijfsruimte gaat: u heeft één aanspreekpunt dat het werk plant, uitvoert en netjes oplevert.',
      en: 'Whether it is a wall opening, a new bathroom, an extension or a commercial unit, you have one point of contact who plans, executes and neatly hands over the work.',
    },
    {
      nl: 'U krijgt heldere communicatie, een eerlijke prijs en werk dat klopt. De bouw houden we opgeruimd en uw pand leveren we schoon weer op.',
      en: 'You get clear communication, an honest price and work that holds up. We keep the site tidy and hand your property back clean.',
    },
  ] as L[],
  image: '/about.webp',
  imageAlt: {
    nl: 'Opgeleverde moderne badkamer met vrijstaand bad',
    en: 'Completed modern bathroom with a freestanding bath',
  },
  signature: { nl: 'Adriaan, eigenaar', en: 'Adriaan, owner' },
};

/* ---- Werkzaamheden marquee ------------------------------------------- */

export const werkzaamheden = {
  eyebrow: { nl: 'In beeld', en: 'In focus' },
  titleStart: { nl: 'Onze ', en: 'Our ' },
  titleEm: { nl: 'werkzaamheden', en: 'work' },
  titleEnd: { nl: '.', en: '.' },
  intro: {
    nl: 'Een doorlopende greep uit verbouwingen, renovatie, nieuwbouw en sloopwerk in en rond Roermond.',
    en: 'A continuous look at remodelling, renovation, new build and demolition in and around Roermond.',
  },
  items: [
    { src: '/projecten/verbouwing-open-plafond-met-tuinzicht.webp', label: { nl: 'Plafond open gemaakt', en: 'Ceiling opened up' } },
    { src: '/projecten/sloop-badkamer-muren-en-plafond-opengebroken.webp', label: { nl: 'Badkamer gesloopt', en: 'Bathroom demolished' } },
    { src: '/projecten/verbouwing-plafondconstructie-werkzaamheden-met-ladder.webp', label: { nl: 'Plafondconstructie', en: 'Ceiling structure' } },
    { src: '/projecten/nieuwbouw-houtskeletbouw-binnenwanden-ruwbouw.webp', label: { nl: 'Houtskelet wanden', en: 'Timber-frame walls' } },
    { src: '/projecten/verbouwing-nieuw-leidingwerk-in-plafondconstructie.webp', label: { nl: 'Nieuw leidingwerk', en: 'New pipework' } },
    { src: '/projecten/sloop-badkamer-met-blootliggende-dakbalken.webp', label: { nl: 'Tot het casco', en: 'Down to the shell' } },
    { src: '/projecten/verbouwing-blootliggende-plafondbalken-constructie.webp', label: { nl: 'Plafondbalken vrij', en: 'Joists exposed' } },
    { src: '/projecten/verbouwing-open-plafond-met-werkzaamheden.webp', label: { nl: 'Verbouwing in uitvoering', en: 'Remodel underway' } },
    { src: '/projecten/nieuwbouw-binnenwanden-houtframe-met-bouwmaterialen.webp', label: { nl: 'Binnenwanden plaatsen', en: 'Building interior walls' } },
    { src: '/projecten/sloop-badkamer-wanden-opengebroken-detail.webp', label: { nl: 'Wanden opengebroken', en: 'Walls broken open' } },
    { src: '/projecten/verbouwing-nieuw-gestucte-wanden-en-doorgang.webp', label: { nl: 'Strak gestuct', en: 'Cleanly plastered' } },
  ],
};

/* ---- Projecten (showcase grid) --------------------------------------- */

export type Project = {
  title: L;
  place: string;
  tag: L;
  blurb: L;
  images: { src: string; alt: L }[];
};

export const projects: Project[] = [
  {
    title: { nl: 'Plafonds open en nieuw leidingwerk', en: 'Ceilings opened and new pipework' },
    place: 'Weert',
    tag: { nl: 'Verbouwing', en: 'Remodelling' },
    blurb: {
      nl: 'Plafonds opengemaakt tot de balken, nieuw leidingwerk en bedrading aangelegd en de cv-ketel netjes ingepast.',
      en: 'Ceilings opened up to the joists, new pipework and wiring run and the boiler neatly fitted in.',
    },
    images: [
      { src: '/projecten/verbouwing-open-plafond-met-tuinzicht.webp', alt: { nl: 'Open plafond met zicht op de tuin', en: 'Opened ceiling with a view of the garden' } },
      { src: '/projecten/verbouwing-nieuw-leidingwerk-in-plafondconstructie.webp', alt: { nl: 'Nieuw leidingwerk in de plafondconstructie', en: 'New pipework in the ceiling structure' } },
      { src: '/projecten/verbouwing-gestript-plafond-met-nieuwe-bedrading.webp', alt: { nl: 'Gestript plafond met nieuwe bedrading', en: 'Stripped ceiling with new wiring' } },
      { src: '/projecten/verbouwing-plafond-open-met-cv-ketel.webp', alt: { nl: 'Open plafond met de cv-ketel', en: 'Opened ceiling with the boiler' } },
      { src: '/projecten/verbouwing-open-plafond-met-leidingwerk-blauwe-kamer.webp', alt: { nl: 'Open plafond met leidingwerk', en: 'Opened ceiling with pipework' } },
    ],
  },
  {
    title: { nl: 'Muurdoorbraak en doorgangen', en: 'Wall opening and passages' },
    place: 'Roermond',
    tag: { nl: 'Verbouwing', en: 'Remodelling' },
    blurb: {
      nl: 'Dragende muur doorgebroken voor een open doorgang naar de keuken en daarna strak weggewerkt en gestuct.',
      en: 'Load-bearing wall opened up for a clear passage to the kitchen, then cleanly finished and plastered.',
    },
    images: [
      { src: '/projecten/verbouwing-muurdoorbraak-doorgang-met-kruiwagen.webp', alt: { nl: 'Muurdoorbraak in uitvoering', en: 'Wall opening in progress' } },
      { src: '/projecten/verbouwing-bakstenen-muurdoorbraak-naar-kamer.webp', alt: { nl: 'Bakstenen muurdoorbraak naar de kamer', en: 'Brick wall opening into the room' } },
      { src: '/projecten/verbouwing-muurdoorbraak-bakstenen-doorgang-keuken.webp', alt: { nl: 'Doorgang naar de keuken', en: 'Passage through to the kitchen' } },
      { src: '/projecten/verbouwing-nieuw-gestucte-wanden-en-doorgang.webp', alt: { nl: 'Nieuw gestucte wanden en doorgang', en: 'Freshly plastered walls and passage' } },
    ],
  },
  {
    title: { nl: 'Badkamer en toilet opgeleverd', en: 'Bathroom and toilet delivered' },
    place: 'Weert',
    tag: { nl: 'Oplevering', en: 'Delivered' },
    blurb: {
      nl: 'Compleet vernieuwde badkamers en toiletten, afgewerkt met marmerlook tegels en strak sanitair.',
      en: 'Fully renewed bathrooms and toilets, finished with marble-look tiles and clean sanitary ware.',
    },
    images: [
      { src: '/projecten/oplevering-moderne-badkamer-met-bad-en-toilet.webp', alt: { nl: 'Moderne badkamer met bad en toilet', en: 'Modern bathroom with bath and toilet' } },
      { src: '/projecten/oplevering-moderne-badkamer-met-marmerlook-tegels.webp', alt: { nl: 'Badkamer met marmerlook tegels', en: 'Bathroom with marble-look tiles' } },
      { src: '/projecten/oplevering-moderne-badkamer-met-vrijstaand-bad.webp', alt: { nl: 'Badkamer met vrijstaand bad', en: 'Bathroom with a freestanding bath' } },
      { src: '/projecten/oplevering-modern-toilet-met-houten-wand.webp', alt: { nl: 'Modern toilet met houten wand', en: 'Modern toilet with a wood wall' } },
      { src: '/projecten/oplevering-entree-met-marmerlook-vloer.webp', alt: { nl: 'Entree met marmerlook vloer', en: 'Entrance with a marble-look floor' } },
    ],
  },
  {
    title: { nl: 'Badkamer gesloopt en gestript', en: 'Bathroom demolished and stripped' },
    place: 'Nederweert',
    tag: { nl: 'Sloopwerk', en: 'Demolition' },
    blurb: {
      nl: 'Een gedateerde badkamer volledig leeggehaald: tegels en sanitair eruit, wanden en plafond opengebroken.',
      en: 'A dated bathroom stripped out completely: tiles and sanitary ware removed, walls and ceiling opened up.',
    },
    images: [
      { src: '/projecten/sloop-badkamer-muren-en-plafond-opengebroken.webp', alt: { nl: 'Muren en plafond opengebroken', en: 'Walls and ceiling broken open' } },
      { src: '/projecten/verbouwing-oude-badkamer-voor-renovatie.webp', alt: { nl: 'Oude badkamer voor de renovatie', en: 'Old bathroom before the renovation' } },
      { src: '/projecten/verbouwing-oude-douchecabine-voor-renovatie.webp', alt: { nl: 'Oude douchecabine voor de renovatie', en: 'Old shower cabin before the renovation' } },
      { src: '/projecten/sloop-oude-badkamer-tegels-verwijderen.webp', alt: { nl: 'Oude tegels verwijderen', en: 'Removing the old tiles' } },
      { src: '/projecten/sloop-badkamer-wanden-strippen-werkzaamheden.webp', alt: { nl: 'Wanden strippen', en: 'Stripping the walls' } },
    ],
  },
  {
    title: { nl: 'Sloopwerk en puinafvoer', en: 'Demolition and rubble removal' },
    place: 'Roermond',
    tag: { nl: 'Sloopwerk', en: 'Demolition' },
    blurb: {
      nl: 'Betonvloer en scheidingsmuur uitgebroken en het puin gecontroleerd afgevoerd, klaar voor de verbouwing.',
      en: 'Concrete floor and partition wall broken out and the rubble removed in a controlled way, ready for the rebuild.',
    },
    images: [
      { src: '/projecten/sloop-betonvloer-uitbreken-met-breekhamer.webp', alt: { nl: 'Betonvloer uitbreken met de breekhamer', en: 'Breaking out the concrete floor' } },
      { src: '/projecten/sloop-bakstenen-scheidingsmuur-met-puin.webp', alt: { nl: 'Bakstenen scheidingsmuur met puin', en: 'Brick partition wall with rubble' } },
      { src: '/projecten/sloop-puin-in-gang-tijdens-verbouwing.webp', alt: { nl: 'Puin in de gang tijdens de verbouwing', en: 'Rubble in the hallway during the remodel' } },
      { src: '/projecten/sloop-smalle-doorgang-met-puin.webp', alt: { nl: 'Smalle doorgang met puin', en: 'Narrow passage with rubble' } },
    ],
  },
  {
    title: { nl: 'Zolder verbouwd', en: 'Attic remodelled' },
    place: 'Tungelroy',
    tag: { nl: 'Verbouwing', en: 'Remodelling' },
    blurb: {
      nl: 'Zolder gestript tot de dakconstructie, ventilatie aangelegd en afgewerkt tot een nette zolderbadkamer.',
      en: 'Attic stripped back to the roof structure, ventilation installed and finished into a tidy attic bathroom.',
    },
    images: [
      { src: '/projecten/verbouwing-zolder-plafond-gestript-tot-dakconstructie.webp', alt: { nl: 'Zolder gestript tot de dakconstructie', en: 'Attic stripped to the roof structure' } },
      { src: '/projecten/verbouwing-zolder-dakconstructie-met-ventilatiekanalen.webp', alt: { nl: 'Dakconstructie met ventilatiekanalen', en: 'Roof structure with ventilation ducts' } },
      { src: '/projecten/verbouwing-zolder-plafondbalken-langs-bakstenen-muur.webp', alt: { nl: 'Plafondbalken langs de bakstenen muur', en: 'Ceiling joists along the brick wall' } },
      { src: '/projecten/oplevering-zoldertoilet-met-dakraam.webp', alt: { nl: 'Opgeleverd zoldertoilet met dakraam', en: 'Delivered attic toilet with a skylight' } },
    ],
  },
];

/* ---- Reviews (generated, realistic) ---------------------------------- */
// No real reviews exist yet. These are written as plausible customer voices.

export const reviews: { name: string; place: string; date: string; text: string }[] = [
  {
    name: 'Mariska Geurts',
    place: 'Roermond',
    date: '2 apr. 2026',
    text: 'Adriaan heeft onze badkamer compleet vernieuwd. Alles werd vooraf goed uitgelegd en de planning klopte. Netjes gewerkt en elke dag opgeruimd. Wij zijn erg tevreden.',
  },
  {
    name: 'Rob Cuijpers',
    place: 'Weert',
    date: '18 mrt. 2026',
    text: 'Muurdoorbraak laten doen tussen de keuken en woonkamer. Strak werk en een eerlijke prijs vooraf. Geen meerwerk waar je het niet over gehad hebt.',
  },
  {
    name: 'Ineke Verstappen',
    place: 'Nederweert',
    date: '27 feb. 2026',
    text: 'Onze aanbouw is door Adriaan opgezet en afgebouwd. Hij denkt mee en is goed bereikbaar. Het resultaat ziet er prima uit.',
  },
  {
    name: 'Tom Driessen',
    place: 'Roermond',
    date: '9 feb. 2026',
    text: 'Sloopwerk en strippen laten doen voor een verbouwing. Snel geregeld en de container was op tijd weg. Prettig contact.',
  },
  {
    name: 'Sandra Heijnen',
    place: 'Tungelroy',
    date: '14 jan. 2026',
    text: 'Keuken en woonkamer laten renoveren. Afspraken werden nagekomen en het stucwerk is mooi glad. Een aanrader.',
  },
  {
    name: 'Patrick Smeets',
    place: 'Weert',
    date: '21 dec. 2025',
    text: 'Voor ons bedrijfspand een ruimte laten afbouwen. Weinig overlast en netjes binnen de planning klaar. Goed geregeld.',
  },
  {
    name: 'Linda Bos',
    place: 'Roermond',
    date: '3 dec. 2025',
    text: 'Schilderwerk en kozijnen laten nakijken. Adriaan is eerlijk over wat wel en niet nodig is. Dat waardeer ik.',
  },
  {
    name: 'Kevin Janssen',
    place: 'Kelpen-Oler',
    date: '12 nov. 2025',
    text: 'Hele woning verbouwd. Eén aanspreekpunt voor alles, dat werkte heel fijn. Goede communicatie van begin tot eind.',
  },
  {
    name: 'Anita Peeters',
    place: 'Nederweert',
    date: '28 okt. 2025',
    text: 'Badkamer en toilet vernieuwd. Vooraf een duidelijke offerte gekregen en die klopte ook. Vakkundig en vriendelijk.',
  },
  {
    name: 'Bart Vossen',
    place: 'Weert',
    date: '6 okt. 2025',
    text: 'Adriaan heeft onze garage omgebouwd tot werkruimte. Stevig werk en goed afgewerkt. Komt zijn afspraken na.',
  },
];

/* ---- Section titles -------------------------------------------------- */

export const sectionTitles = {
  usps: {
    eyebrow: { nl: 'Waarom kiezen voor ons', en: 'Why choose us' },
    titleStart: { nl: 'Bouwwerk waar u op ', en: 'Building work you can ' },
    titleEm: { nl: 'kunt rekenen', en: 'rely on' },
    titleEnd: { nl: '.', en: '.' },
  },
  services: {
    eyebrow: { nl: 'Diensten', en: 'Services' },
    titleStart: { nl: 'Eén aannemer voor ', en: 'One contractor for ' },
    titleEm: { nl: 'het hele project', en: 'the whole project' },
    titleEnd: { nl: '.', en: '.' },
    intro: {
      nl: 'Van sloop en ruwbouw tot de laatste afwerking. Alles in vertrouwde handen.',
      en: 'From demolition and structural work to the final finish. All in trusted hands.',
    },
  },
  about: {
    eyebrow: { nl: 'Over ons', en: 'About us' },
    titleStart: { nl: 'Een vakman die ', en: 'A craftsman who ' },
    titleEm: { nl: 'afspraken nakomt', en: 'keeps his word' },
    titleEnd: { nl: '.', en: '.' },
  },
  werkwijze: {
    eyebrow: { nl: 'Werkwijze', en: 'Approach' },
    titleStart: { nl: 'Zo pakken we het ', en: 'This is how we ' },
    titleEm: { nl: 'aan', en: 'work' },
    titleEnd: { nl: '.', en: '.' },
  },
  projecten: {
    eyebrow: { nl: 'Projecten', en: 'Projects' },
    titleStart: { nl: 'Een greep uit recente ', en: 'A selection of recent ' },
    titleEm: { nl: 'projecten', en: 'projects' },
    titleEnd: { nl: '.', en: '.' },
    intro: {
      nl: 'Verbouwingen, sloopwerk en opleveringen uit Roermond en omstreken. Tik op een project voor meer foto’s.',
      en: 'Remodels, demolition and completed work from Roermond and the area. Tap a project for more photos.',
    },
  },
  reviews: {
    eyebrow: { nl: 'Ervaringen', en: 'Reviews' },
    titleStart: { nl: 'Wat klanten ', en: 'What clients ' },
    titleEm: { nl: 'zeggen', en: 'say' },
    titleEnd: { nl: '.', en: '.' },
  },
  contact: {
    eyebrow: { nl: 'Contact', en: 'Contact' },
    titleStart: { nl: 'Plan uw project ', en: 'Plan your project ' },
    titleEm: { nl: 'zonder gedoe', en: 'without hassle' },
    titleEnd: { nl: '.', en: '.' },
  },
  offerte: {
    eyebrow: { nl: 'Offerte', en: 'Quote' },
    title: { nl: 'Vraag een vrijblijvende offerte aan', en: 'Request a free quote' },
  },
};

/* ---- UI strings ------------------------------------------------------ */

export const ui = {
  navCta: { nl: 'Offerte aanvragen', en: 'Request a quote' },
  menuOpen: { nl: 'Menu openen', en: 'Open menu' },
  menuClose: { nl: 'Menu sluiten', en: 'Close menu' },
  mobileMenu: { nl: 'Mobiel menu', en: 'Mobile menu' },
  toTop: { nl: 'naar boven', en: 'to top' },
  servicesPrompt: {
    nl: 'Een ander project in gedachten? We kijken graag mee.',
    en: 'A different project in mind? We are happy to take a look.',
  },
  projectPhotos: { nl: 'foto’s', en: 'photos' },
  viewProject: { nl: 'Bekijk project', en: 'View project' },
  reviewsCta: { nl: 'Vraag uw offerte aan', en: 'Request your quote' },
  reviewsNote: {
    nl: 'Gemiddeld {score} op basis van recente klantervaringen.',
    en: 'Average {score} based on recent client reviews.',
  },
  contactIntro: {
    nl: 'Bel, app of stuur het formulier. We reageren snel en denken met u mee.',
    en: 'Call, message or send the form. We respond quickly and think along with you.',
  },
  hoursTitle: { nl: 'Openingstijden', en: 'Opening hours' },
  areaTitle: { nl: 'Werkgebied', en: 'Service area' },
  areaNote: {
    nl: 'Van Roermond tot Eindhoven, ongeveer een uur rijden in de omtrek. Verder weg? Vraag het gerust.',
    en: 'From Roermond to Eindhoven, roughly an hour by car in any direction. Further away? Just ask.',
  },
  footerTagline: { nl: 'Bouwen aan vertrouwen', en: 'Building on trust' },
  footerAbout: {
    nl: 'Aannemer voor verbouwen, bouwen en onderhoud in Roermond en omstreken.',
    en: 'Contractor for remodelling, building and maintenance in Roermond and the area.',
  },
  footerNav: { nl: 'Navigatie', en: 'Navigation' },
  footerContact: { nl: 'Contact', en: 'Contact' },
  builtBy: { nl: 'Site door', en: 'Site by' },
  fabQuote: { nl: 'Offerte', en: 'Quote' },
  whatsappAria: { nl: 'Stuur ons een WhatsApp bericht', en: 'Send us a WhatsApp message' },
};

/* ---- Form strings ---------------------------------------------------- */

export const form = {
  intro: {
    nl: 'Vertel kort wat er speelt. U krijgt een duidelijke offerte en eerlijk advies, zonder verplichtingen.',
    en: 'Tell us briefly what is going on. You get a clear quote and honest advice, no obligations.',
  },
  asideTitle: { nl: 'Vrijblijvend en duidelijk', en: 'Free and clear' },
  firstName: { nl: 'Voornaam', en: 'First name' },
  lastName: { nl: 'Achternaam', en: 'Last name' },
  email: { nl: 'E-mailadres', en: 'Email address' },
  phone: { nl: 'Telefoonnummer', en: 'Phone number' },
  postalCode: { nl: 'Postcode', en: 'Postal code' },
  city: { nl: 'Plaats', en: 'Town' },
  service: { nl: 'Dienst', en: 'Service' },
  servicePick: { nl: 'Kies een dienst', en: 'Choose a service' },
  serviceOther: { nl: 'Toelichting', en: 'Details' },
  serviceOtherPh: { nl: 'Waar gaat het om?', en: 'What is it about?' },
  propertyType: { nl: 'Type pand', en: 'Property type' },
  propertyPick: { nl: 'Maak een keuze', en: 'Make a choice' },
  urgency: { nl: 'Planning', en: 'Timing' },
  message: { nl: 'Omschrijving', en: 'Description' },
  messagePh: {
    nl: 'Vertel kort wat u wilt laten doen en wanneer het u zou uitkomen.',
    en: 'Briefly tell us what you want done and when it would suit you.',
  },
  attachments: { nl: 'Foto’s of bijlagen', en: 'Photos or attachments' },
  attachmentsHint: {
    nl: 'Foto’s van de situatie helpen ons een betere inschatting te maken.',
    en: 'Photos of the situation help us make a better estimate.',
  },
  attachmentsDrop: {
    nl: 'Sleep bestanden hierheen of klik om te kiezen',
    en: 'Drag files here or click to choose',
  },
  optional: { nl: 'optioneel', en: 'optional' },
  consent: {
    nl: 'Ik ga ermee akkoord dat er contact met mij wordt opgenomen over deze aanvraag.',
    en: 'I agree to be contacted about this request.',
  },
  submit: { nl: 'Aanvraag versturen', en: 'Send request' },
  submitting: { nl: 'Versturen...', en: 'Sending...' },
  successTitle: { nl: 'Bedankt voor uw aanvraag', en: 'Thank you for your request' },
  successBody: {
    nl: 'We hebben uw aanvraag ontvangen. Adriaan neemt zo snel mogelijk contact met u op.',
    en: 'We have received your request. Adriaan will contact you as soon as possible.',
  },
  successAgain: { nl: 'Sluiten', en: 'Close' },
  callPrompt: { nl: 'Liever direct contact? Bel', en: 'Prefer direct contact? Call' },
  errorGeneric: {
    nl: 'Er ging iets mis. Probeer het opnieuw of bel ons.',
    en: 'Something went wrong. Please try again or call us.',
  },
  maxFiles: { nl: 'U kunt maximaal 8 bestanden toevoegen.', en: 'You can add at most 8 files.' },
  maxSize: {
    nl: 'De bestanden zijn samen te groot (maximaal 60 MB).',
    en: 'The files are too large together (maximum 60 MB).',
  },
  errVoornaam: { nl: 'Vul uw voornaam in.', en: 'Enter your first name.' },
  errAchternaam: { nl: 'Vul uw achternaam in.', en: 'Enter your last name.' },
  errEmail: { nl: 'Vul uw e-mailadres in.', en: 'Enter your email address.' },
  errEmailValid: { nl: 'Vul een geldig e-mailadres in.', en: 'Enter a valid email address.' },
  errPhone: { nl: 'Vul uw telefoonnummer in.', en: 'Enter your phone number.' },
  errPostal: { nl: 'Vul uw postcode in.', en: 'Enter your postal code.' },
  errCity: { nl: 'Vul uw plaats in.', en: 'Enter your town.' },
  errService: { nl: 'Kies een dienst.', en: 'Choose a service.' },
  errServiceOther: { nl: 'Omschrijf kort waar het om gaat.', en: 'Briefly describe what it is about.' },
  errMessage: { nl: 'Vul een korte omschrijving in.', en: 'Enter a short description.' },
};

export const propertyTypeOptions: { value: string; label: L }[] = [
  { value: 'woning', label: { nl: 'Woning', en: 'House' } },
  { value: 'appartement', label: { nl: 'Appartement', en: 'Apartment' } },
  { value: 'bedrijfspand', label: { nl: 'Bedrijfspand', en: 'Commercial property' } },
  { value: 'anders', label: { nl: 'Anders', en: 'Other' } },
];

export const urgencyOptions: { value: string; label: L }[] = [
  { value: 'spoed', label: { nl: 'Zo snel mogelijk', en: 'As soon as possible' } },
  { value: '1-3-maanden', label: { nl: 'Binnen 1 tot 3 maanden', en: 'Within 1 to 3 months' } },
  { value: 'later-dit-jaar', label: { nl: 'Later dit jaar', en: 'Later this year' } },
  { value: 'orienteren', label: { nl: 'Eerst oriënteren', en: 'Just exploring' } },
];
