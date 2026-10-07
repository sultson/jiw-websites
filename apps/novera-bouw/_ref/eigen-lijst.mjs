// De foto's die Ekrem zelf op 27-09-2026 in de groep stuurde (via Armando).
// Originelen: _ref/eigen/ek-NN.jpg. Dit is de ENIGE lijst met volgorde en alt-tekst;
// eigen.mjs maakt er de bestanden mee en schrijft het galerijblok in werkzaamheden.html.
//
// De galerij staat in kolommen en niet in rijen, dus boven in beeld komen
// nummer 1, 4, 7 en 10. Daar staan met opzet de sterkste, opgeleverde foto's.
export const GALERIJ = [
  { bron: 'ek-01', alt: 'Opgeleverd toilet in betonlook tegels met een verlichte nis, hangtoilet en een ronde zwarte spiegel' },
  { bron: 'ek-08', alt: 'Doucheruimte met een wand in terracotta visgraattegels naast grootformaat wandtegels' },
  { bron: 'ek-10', alt: 'Grootformaat vloertegels worden gelegd, twee zuignappen liggen er nog op' },

  { bron: 'ek-02', alt: 'Opgeleverde badkamer onder een schuin dak met terrazzovloer, inloopdouche en een houten lamellenwand' },
  { bron: 'ek-04', alt: 'Douchewand van grootformaat marmerlook platen met roodbruine adering' },
  { bron: 'ek-09', alt: 'Toilet betegeld in houtlook visgraat, de nivelleerclips zitten er nog in' },

  { bron: 'ek-03', alt: 'Badkamer in onyxlook platen met een wand in houten lamellen, de vloertegels liggen al' },
  { bron: 'ek-05', alt: 'Badkamer met marmerlook wandplaten en een ingebouwd bad, de rand nog afgeplakt' },
  { bron: 'ek-11', alt: 'Badkamer bijna klaar, het meubel en de wasmachine staan nog in folie' },

  { bron: 'ek-06', alt: 'Badkamer met terrazzovloer, een wand in houten lamellen en zicht op de overloop' },
  { bron: 'ek-07', alt: 'Badkamer met zwarte wandtegels, een houten meubel en twee marmeren waskommen' },
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
]

// ── hero: GEEN eigen foto ──
// De kop van de startpagina is een brede band (16:9). Uit een staande telefoonfoto blijft
// daar nog geen halve hoogte van over, en dan komt bij al zijn elf foto's het bewoonde deel
// in beeld: tandenborstels, een tissuedoos, een snoer, was op de gang. Armando keurde dat
// op 27-09-2026 af ("ziet er goed uit allemaal behalve de hero foto") en hij heeft gelijk.
// Daarom draagt de kop ons eigen beeld (src/img/hero.webp) tot hij een LIGGENDE foto van
// een opgeleverde badkamer stuurt. Zijn foto's staan gewoon op de kaarten en in de galerij.
export const HERO = null
