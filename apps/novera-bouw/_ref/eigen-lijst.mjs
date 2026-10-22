// De foto's die Ekrem zelf in de groep stuurde (via Armando).
// ek-01 t/m ek-11 op 27-09-2026 (badkamers en toiletten), ek-12 t/m ek-14 op
// 09-10-2026 (een trap wit in de lak, met balustrade en leuning), ek-15 t/m ek-21
// diezelfde dag (stucwerk, schilderwerk en vloeren in een woning die hij leeg
// opknapte, plus een ingebouwde tv-wand van gipsplaat). ek-22 t/m ek-32 op 19-10-2026:
// één trapgat, van gestript tot geschilderd. ek-33 t/m ek-40 op 22-10-2026: één kamer
// waar de verf bovenaan de wand losliet — allebei die klussen staan in VOORNA onderaan.
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

  // De kamer van 22-10-2026. Het voor-en-na van die klus staat in VOORNA; hier staan
  // de twee foto's die ook los overeind blijven. De drie kale voor-foto's staan met
  // opzet NIET in deze galerij: een gestripte wand zonder de na-foto ernaast leest
  // hier als een klus die niet af is. Die hangen onder het paar op /stucwerk.
  { bron: 'ek-37', alt: 'Wapeningsband over een scheur in de wand, klaar om dichtgezet te worden' },
  { bron: 'ek-40', alt: 'Penant naast de haldeur, glad gestuct van plint tot plafond' },
]

/* ── voor en na ────────────────────────────────────────────
   Een lijst klussen, elk met een eigen kop en een of meer paren. Een paar is pas een
   paar als het DEZELFDE plek is, van hetzelfde punt af gefotografeerd; staat er een
   andere muur naast, dan vergelijkt niemand iets. Daarom staan hier minder paren dan
   er na-foto's zijn, en hangen de losse foto's van dezelfde klus eronder in `los`.

   4:5 uitsnede uit een staande telefoonfoto. y = waar de uitsnede begint, als deel
   (0..1) van de ruimte die er verticaal over is. Bij een 9:16-bron is dat veel
   ruimte, bij een 3:4-bron vrijwel niets.

   `los` is vierkant (1:1) en staat drie naast elkaar onder het paar. Daar mag een
   liggende foto in: bij een liggende bron stuurt x waar de uitsnede begint, bij een
   staande y. Dat is de enige plek waar een kale voor-foto thuishoort — in de galerij
   op /werkzaamheden staat werk dat af is. */
export const VOORNA = [
  {
    naam: 'trapgat',
    kop: 'Het trapgat dat nergens meer vlak was',
    kopEn: 'The stairwell that was flat nowhere',
    intro:
      "Één klus van Ekrem, van gestript tot geschilderd. De loper op de trap is op de na-foto's " +
      'nog dezelfde: dit is wandwerk, geen nieuwe trap.',
    introEn:
      "One job of Ekrem's, from stripped to painted. The carpet on the stairs is the same one in " +
      'every after photo: this is wall work, not a new staircase.',
    paren: [
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
    ],
  },
  /* 22-10-2026. Eén kamer in een bovenwoning: de verf liet bovenaan de wand in vellen
     los tot op de oude pleister, lager zaten pluggaten, scheuren en oude reparaties.
     ek-33, ek-34 en ek-35 zijn aantoonbaar dezelfde wand (dezelfde drie gaten op een
     rij, dezelfde naad, dezelfde radiator onder hetzelfde raam) en ek-38 is diezelfde
     wand af — daarom is ek-34/ek-38 een paar en de rest niet.
     ek-39 blijft ongebruikt: dat is dezelfde penant als ek-40 vanuit de kamer in plaats
     van vanuit de hal, en naast elkaar lezen die twee als één foto. */
  {
    naam: 'kamer',
    kop: 'De kamer waar de verf van de muur kwam',
    kopEn: 'The room where the paint came off the wall',
    intro:
      'Dezelfde aanpak in een kamer: alles wat los zat eraf, de scheuren met band dichtgezet, ' +
      'de gaten gevuld en daarna de hele wand in lagen glad getrokken. Van plint tot plafond, ' +
      'niet alleen de plek waar het misging.',
    introEn:
      'The same approach in a room: everything loose off, the cracks taped and filled, the holes ' +
      'made good and then the whole wall pulled smooth in layers. Skirting to ceiling, not just ' +
      'the spot where it went wrong.',
    paren: [
      {
        naam: 'vn-kamer',
        voor: { bron: 'ek-34', y: 0.5, alt: 'De wand bij het raam: de bovenste helft tot op de oude pleister afgebladderd, met pluggaten en een oude reparatie eronder', altEn: 'The wall by the window: the top half flaked back to the old plaster, with plug holes and an old repair below it' },
        na: { bron: 'ek-38', y: 0.5, alt: 'Dezelfde wand bij het raam, van plint tot plafond glad gestuct, met dezelfde leiding en radiator ernaast', altEn: 'The same wall by the window, plastered smooth from skirting to ceiling, with the same pipe and radiator beside it' },
        bij: 'Dezelfde hoek, hetzelfde raam, dezelfde radiator. Bovenin liet de verf los tot op de pleister, in het midden zaten de gaten van wat er aan de muur hing. Daar is nu niets meer van terug te zien.',
        bijEn: 'Same corner, same window, same radiator. Along the top the paint was letting go down to the plaster, in the middle sat the holes from whatever used to hang there. None of it shows any more.',
      },
    ],
    los: [
      { bron: 'ek-33', y: 0.6, alt: 'Dezelfde kamer van verder af, de losse verf eraf geschraapt en het schraapsel over de vloer', altEn: 'The same room from further back, the loose paint scraped off and the scrapings across the floor', bij: 'Eerst alles eraf wat los zat. Wat op de vloer ligt, komt anders na een jaar als een blaas in de nieuwe verf terug.', bijEn: 'First everything loose comes off. What is on the floor would otherwise come back as a blister in the new paint within a year.' },
      { bron: 'ek-35', x: 0.25, alt: 'Van dichtbij drie pluggaten op een rij in de wand, met de verf die er in vellen naast loslaat', altEn: 'Close up of three plug holes in a row in the wall, with the paint letting go in sheets beside them', bij: 'Van dichtbij, en het is dezelfde wand als hierboven: diezelfde drie gaten op een rij, diezelfde naad.', bijEn: 'Close up, and it is the same wall as above: those same three holes in a row, that same seam.' },
      { bron: 'ek-36', y: 0.5, alt: 'Bladderende verf en kale pleister in een hoek, met wapeningsband dat er al overheen zit', altEn: 'Flaking paint and bare plaster in a corner, with scrim tape already over it', bij: 'Waar een scheur zat gaat er band overheen voordat er gevuld wordt. Zonder dat staat dezelfde scheur er volgend jaar weer.', bijEn: 'Where there was a crack, tape goes over it before any filling. Without that the same crack is back next year.' },
    ],
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
