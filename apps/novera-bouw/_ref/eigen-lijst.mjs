// De foto's die Ekrem zelf in de groep stuurde (via Armando).
// ek-01 t/m ek-11 op 27-09-2026 (badkamers en toiletten), ek-12 t/m ek-14 op
// 09-10-2026 (een trap wit in de lak, met balustrade en leuning), ek-15 t/m ek-21
// diezelfde dag (stucwerk, schilderwerk en vloeren in een woning die hij leeg
// opknapte, plus een ingebouwde tv-wand van gipsplaat). ek-22 t/m ek-32 op 19-10-2026:
// één trapgat, van gestript tot geschilderd — zie VOORNA onderaan.
// Originelen: _ref/eigen/ek-NN.jpg. Dit is de ENIGE lijst met volgorde en alt-tekst;
// eigen.mjs maakt er de bestanden mee en schrijft het galerijblok in werkzaamheden.html
// én het Engelse blok in en/services.html (alt-teksten uit _ref/en-alt.json), plus het
// voor-en-na-blok in stucwerk.html en en/plastering.html.
//
// De galerij staat in kolommen en niet in rijen, dus de lijst loopt van boven naar
// beneden door kolom 1, dan kolom 2. Bovenaan staat met opzet een sterke, opgeleverde
// foto, en soortgelijke beelden staan uit elkaar: de drie trapfoto's lijken naast
// elkaar één foto, en dat geldt net zo voor de vier lege kamers met een nieuwe vloer.
//
// Staat er een bron in deze lijst die nog niet in _ref/en-alt.json staat, dan valt
// eigen.mjs om. Dat is de bedoeling: anders zou er een Nederlandse alt op de Engelse
// pagina belanden.
export const GALERIJ = [
  { bron: 'ek-01', alt: 'Opgeleverd toilet in betonlook tegels met een verlichte nis, hangtoilet en een ronde zwarte spiegel' },
  { bron: 'ek-12', alt: 'Trap met kwartslag wit in de lak, met een witte balustrade en een houten leuning langs de wand' },
  { bron: 'ek-20', alt: 'Ingebouwde tv-wand van gipsplaat met open nissen, strak afgewerkt, de spots zijn al bedraad' },
  { bron: 'ek-02', alt: 'Opgeleverde badkamer onder een schuin dak met terrazzovloer, inloopdouche en een houten lamellenwand' },
  { bron: 'ek-15', alt: 'Kamer met vers gestucte wanden en een glad plafond, met een nieuwe houtlook vloer' },

  { bron: 'ek-08', alt: 'Doucheruimte met een wand in terracotta visgraattegels naast grootformaat wandtegels' },
  { bron: 'ek-10', alt: 'Grootformaat vloertegels worden gelegd, twee zuignappen liggen er nog op' },
  { bron: 'ek-13', alt: 'Dezelfde trap van onderaf: elke trede, de wangen en de spijlen wit in de lak' },

  { bron: 'ek-04', alt: 'Douchewand van grootformaat marmerlook platen met roodbruine adering' },
  { bron: 'ek-19', alt: 'Glad afgewerkt plafond in een kamer waar gewoond wordt, de inboedel en de vloer liggen onder folie' },
  { bron: 'ek-06', alt: 'Badkamer met terrazzovloer, een wand in houten lamellen en zicht op de overloop' },
  { bron: 'ek-21', alt: 'Slaapkamer met gladde witte wanden en een nieuwe houtlook vloer tot onder de radiator' },
  { bron: 'ek-09', alt: 'Toilet betegeld in houtlook visgraat, de nivelleerclips zitten er nog in' },

  { bron: 'ek-03', alt: 'Badkamer in onyxlook platen met een wand in houten lamellen, de vloertegels liggen al' },
  { bron: 'ek-17', alt: 'Woonkamer met pas geschilderde wanden en plafond, de vloer ligt er al in en het trapje staat nog in de hoek' },
  { bron: 'ek-14', alt: 'Witte trap vanuit de hal, met de balustrade en het hekwerk langs het trapgat in dezelfde lak' },
  { bron: 'ek-07', alt: 'Badkamer met zwarte wandtegels, een houten meubel en twee marmeren waskommen' },
  { bron: 'ek-05', alt: 'Badkamer met marmerlook wandplaten en een ingebouwd bad, de rand nog afgeplakt' },
  { bron: 'ek-11', alt: 'Badkamer bijna klaar, het meubel en de wasmachine staan nog in folie' },

  // Het trapgat van 19-10-2026. De vier losse foto's hieronder; de voor-en-na-paren
  // uit diezelfde klus staan in VOORNA en gaan niet door de galerij heen.
  { bron: 'ek-23', alt: 'De hal onder de trap helemaal afgedekt met folie en zeil voordat het stucwerk begint' },
  { bron: 'ek-26', alt: 'Trapgat met gladde witte wanden, de leuning terug aan de muur en de oude loper nog op de trap' },
  { bron: 'ek-32', alt: 'Onderzijde van de trap na het stucwerk: strakke vlakken en een scherpe kant langs de trede' },
  { bron: 'ek-25', alt: 'Overloop met gladde witte wanden en een glad plafond, het schilderwerk is af' },
]

/* ── voor en na ────────────────────────────────────────────
   Eén klus, 19-10-2026: het trapgat en de overloop. De wanden waren tot op de oude
   pleister gestript; daarna glad gestuct en geschilderd. De loper op de trap is in
   alle na-foto's nog dezelfde, en dat is precies waarom het paar klopt: dit is
   wandwerk, geen nieuwe trap. Zet er dus nooit traprenovatie bij.

   4:5 uitsnede uit een staande telefoonfoto. y = waar de uitsnede begint, als deel
   (0..1) van de ruimte die er verticaal over is. Bij een 9:16-bron is dat veel
   ruimte, bij een 3:4-bron vrijwel niets. */
export const VOORNA = [
  {
    naam: 'vn-wand',
    voor: { bron: 'ek-29', y: 0.65, alt: 'De wand langs de trap gestript tot op de oude pleister, de leuning er nog voor en de treden onder het puin', altEn: 'The wall alongside the stairs stripped back to the old plaster, the handrail still in front of it and debris on the treads' },
    na: { bron: 'ek-26', y: 0.3, alt: 'Dezelfde wand langs de trap, glad gestuct en wit geschilderd, met de leuning terug aan de muur', altEn: 'The same wall alongside the stairs, plastered smooth and painted white, with the handrail back on' },
    bij: 'De wand langs de trap. Het losse materiaal eraf, de gaten gevuld en daarna in lagen glad getrokken. De leuning gaat eraf en weer terug.',
    bijEn: 'The wall alongside the stairs. Loose material off, holes filled, then pulled smooth in layers. The handrail comes off and goes back on.',
  },
  {
    naam: 'vn-dichtbij',
    voor: { bron: 'ek-28', y: 0.4, alt: 'Van dichtbij: de gestripte wand onder de leuning, met restanten lijm en oude verf', altEn: 'Close up: the stripped wall below the handrail, with remnants of glue and old paint' },
    na: { bron: 'ek-24', y: 0.78, alt: 'Van dichtbij: een wand onder de leuning na het stucwerk, strak wit en vlak', altEn: 'Close up: a wall below the handrail after plastering, crisp white and flat' },
    bij: 'Van dichtbij. Hier komt het op aan: strijklicht in een trapgat trekt elke bult eruit zodra de verf erop zit. Rechts is er niets meer te zien.',
    bijEn: 'Close up. This is what it comes down to: raking light in a stairwell pulls out every bump the moment the paint goes on. On the right there is nothing left to see.',
  },
  {
    naam: 'vn-trapgat',
    voor: { bron: 'ek-22', y: 0.5, alt: 'Naar beneden in het trapgat, de gebogen wand langs de trapboom nog kaal en bruin', altEn: 'Looking down the stairwell, the curved wall along the stringer still bare and brown' },
    na: { bron: 'ek-31', y: 0.8, alt: 'Naar beneden in hetzelfde trapgat, alle wanden glad en wit afgewerkt', altEn: 'Looking down the same stairwell, every wall smooth and finished in white' },
    bij: 'Naar beneden in het trapgat. De ronding langs de trapboom is het lastigste stuk van een huis om vlak te krijgen, en het valt het meest op.',
    bijEn: 'Looking down the stairwell. The curve along the stringer is the hardest part of a house to get flat, and it is the part people notice most.',
  },
]

// ── kaartbeeld: 4:3 uit een staande foto. y = waar de uitsnede begint,
//    als deel (0..1) van de ruimte die er verticaal over is.
//    breed = hoeveel van de breedte je meeneemt (1 = alles), x = waar die
//    smallere uitsnede begint (0 = links, 1 = rechts). Alleen nodig als er
//    aan een kant iets in beeld staat wat er niet op hoort. ──
export const KAART = [
  { naam: 'eigen-badkamer', bron: 'ek-05', y: 0.42, alt: 'Badkamer met marmerlook wandplaten en een ingebouwd bad onder het raam' },
  // Het blok "De badkamer is ons vak" op de startpagina. Dit is de enige foto van
  // Ekrem waar een badkamer helemaal áf op staat. Links eraf gesneden: daar staan
  // zijn tandenborstels en een tissuedoos op het meubel.
  { naam: 'eigen-badkamer-af', bron: 'ek-02', breed: 0.68, x: 0.89, y: 0.27, alt: 'Opgeleverde badkamer met een inloopdouche in terrazzolook, een wand van houten lamellen en een zwart wastafelmeubel' },
  { naam: 'eigen-toilet', bron: 'ek-01', y: 0.38, alt: 'Opgeleverd toilet in betonlook tegels met een verlichte nis, hangtoilet en een ronde zwarte spiegel' },
  { naam: 'eigen-tegelwerk', bron: 'ek-08', y: 0.2, alt: 'Wand in terracotta visgraattegels naast grootformaat wandtegels die nog gezet worden' },
  { naam: 'eigen-douche', bron: 'ek-04', y: 0.24, alt: 'Douchewand van grootformaat marmerlook platen met roodbruine adering' },
  { naam: 'eigen-afwerking', bron: 'ek-03', y: 0.36, alt: 'Badkamer in onyxlook platen met een wand in houten lamellen' },
  { naam: 'eigen-bad', bron: 'ek-05', y: 0.42, alt: 'Ingebouwd bad tegen een wand van marmerlook platen, de rand nog afgeplakt' },
  { naam: 'eigen-tegels', bron: 'ek-10', y: 0.45, alt: 'Grootformaat vloertegels worden gelegd, twee zuignappen liggen er nog op' },
  // De trap van 09-10-2026. Let op: dit is een trap wit in de lak, GEEN overzettreden.
  // Daarom staan ze op /schilderwerk bij het houtwerk en op /traprenovatie alleen bij
  // opmeten en bij de leuning en de wangen — nooit naast de uitleg over overzetten.
  { naam: 'eigen-trap-af', bron: 'ek-12', y: 0.35, alt: 'Trap met kwartslag wit in de lak, met een witte balustrade en een houten leuning langs de wand' },
  { naam: 'eigen-trap-op', bron: 'ek-13', y: 0.45, alt: 'Trap met kwartslag van onderaf gezien, elke trede en elke spijl wit in de lak' },
  { naam: 'eigen-trap-hal', bron: 'ek-14', y: 0.35, alt: 'Witte trap vanuit de hal, met het hekwerk langs het trapgat en de wangen in dezelfde lak' },
  // Stucwerk, schilderwerk en vloeren van 09-10-2026. Eén woning die hij leeg opknapte,
  // plus de tv-wand. Dit is het eerste eigen beeld bij deze drie diensten: daarvoor
  // droeg elk van die pagina's een beeld van ons met het label "Ons werk" erbij.
  { naam: 'eigen-stucwerk', bron: 'ek-15', y: 0.38, alt: 'Kamer met vers gestucte wanden en een glad plafond, met een nieuwe houtlook vloer' },
  { naam: 'eigen-stuc-plafond', bron: 'ek-19', y: 0.25, alt: 'Glad afgewerkt plafond in een kamer waar gewoond wordt, de inboedel en de vloer liggen onder folie' },
  { naam: 'eigen-tvwand', bron: 'ek-20', y: 0.4, alt: 'Ingebouwde tv-wand van gipsplaat met open nissen, strak afgewerkt, de spots zijn al bedraad' },
  { naam: 'eigen-verf-kamer', bron: 'ek-17', y: 0.42, alt: 'Woonkamer met pas geschilderde wanden en plafond, de vloer ligt er al in' },
  // Rechterdeel van de foto. In het glas van de balkondeur links staat Ekrem zelf met
  // zijn telefoon; die kant snijden wij eraf. Daarom staat ek-18 ook NIET in de galerij,
  // want daar gaat elke foto als geheel op de pagina.
  { naam: 'eigen-laminaat', bron: 'ek-18', breed: 0.68, x: 1, y: 0.42, alt: 'Kamer met balkondeuren, witte wanden en een nieuwe vloer die tot aan het kozijn doorloopt' },
  { naam: 'eigen-vloer-kamer', bron: 'ek-21', y: 0.4, alt: 'Slaapkamer met gladde witte wanden en een nieuwe houtlook vloer tot onder de radiator' },
]

// ek-16 (hal met de binnendeuren wit in de lak) staat met opzet nergens. De fotograaf
// staat gespiegeld in het glas van de tussendeur, midden in beeld, en elke 4:3-uitsnede
// die hem mist houdt te weinig foto over om nog scherp te zijn.

// ── hero: GEEN eigen foto ──
// De kop van de startpagina is een brede band (16:9). Uit een staande telefoonfoto blijft
// daar nog geen halve hoogte van over, en dan komt bij al zijn elf foto's het bewoonde deel
// in beeld: tandenborstels, een tissuedoos, een snoer, was op de gang. Armando keurde dat
// op 27-09-2026 af ("ziet er goed uit allemaal behalve de hero foto") en hij heeft gelijk.
// Daarom draagt de kop ons eigen beeld (src/img/hero.webp) tot hij een LIGGENDE foto van
// een opgeleverde badkamer stuurt. Zijn foto's staan gewoon op de kaarten en in de galerij.
export const HERO = null
