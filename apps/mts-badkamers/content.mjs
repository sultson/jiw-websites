// Losse tekstblokken: voor/na-paren, werkgebied en veelgestelde vragen.
// Let op: de FAQ-antwoorden zijn conceptteksten. Doorlooptijden en afspraken
// moeten door Mike bevestigd worden voordat dit echt live gaat.

// Voor & na. Alleen paren uit dezelfde ruimte, met ongeveer hetzelfde standpunt.
export const BA = [
  {
    tab: 'Terrazzo',
    slug: 'terrazzo-met-vrijstaand-bad',
    voor: 172,
    na: 180,
    cap: 'Oude betegelde badkamer gestript tot op de steen. Daarna terrazzo op vloer en wand, met een vrijstaand bad onder hetzelfde raam.',
  },
  {
    tab: 'Betonlook',
    slug: 'betonlook-met-zwart-staal',
    voor: 92,
    na: 99,
    cap: 'Gele wanden en een indeling die niet meer klopte. Nu grootformaat betonlook van vloer tot plafond, met zwart staal als enige contrast.',
  },
  {
    tab: 'Ligbad',
    slug: 'badkamer-met-ligbad-metamorfose',
    voor: 54,
    // Stond op 50: een close-up van het nieuwe bad in de hoek. Dat is een ander
    // standpunt dan de voor-foto, en dan werkt de wipe niet -- je ziet twee foto's
    // in plaats van dezelfde ruimte. 52 is vanaf dezelfde plek genomen als 54:
    // zelfde raam, zelfde hoek, bad rechts en de wastafel links.
    na: 52,
    cap: 'Het oude ingebouwde bad met betegelde rand eruit, een strak ligbad met inbouwkraan erin. Zelfde raam, zelfde vierkante meters.',
  },
  {
    tab: 'Hexagon',
    slug: 'hexagon-badkamer-en-dakkapel',
    voor: 185,
    na: 210,
    cap: 'Terug tot op het metselwerk, dakkapel erbij voor het daglicht, en daarna roze hexagon met een groen ribbelmeubel.',
  },
  {
    tab: 'Zitbank',
    slug: 'badkamer-met-betegelde-zitbank',
    voor: 121,
    na: 109,
    cap: 'Klein wit tegelwerk en een indeling die de ruimte niet gebruikte. Nu warme beige tegels, een lijngoot en een gemetselde zitbank.',
  },
  {
    tab: 'Inloopdouche',
    slug: 'grijze-badkamer-houten-meubel',
    voor: 147,
    na: 155,
    cap: 'Terracotta vloer en een ingebouwd bad eruit. Het bad is ingeruild voor een ruime inloopdouche achter glas.',
  },
];

// Werkgebied. De coordinaten zijn erbij gekomen voor de kaart in de
// werkgebied-sectie; `ll` is [lengtegraad, breedtegraad], zoals Mapbox ze wil.
export const HQ = { n: 'Apeldoorn', ll: [5.9699, 52.2112] };

export const AREA = [
  {
    h: 'Direct in de omgeving',
    places: [
      { n: 'Apeldoorn', km: 'thuisbasis', ll: [5.9699, 52.2112] },
      { n: 'Ugchelen', km: 'ca. 4 km', ll: [5.9333, 52.1817] },
      { n: 'Beekbergen', km: 'ca. 6 km', ll: [5.9667, 52.1583] },
      { n: 'Vaassen', km: 'ca. 9 km', ll: [5.9667, 52.2833] },
      { n: 'Twello', km: 'ca. 11 km', ll: [6.1028, 52.2361] },
      { n: 'Loenen', km: 'ca. 11 km', ll: [6.0167, 52.1167] },
      { n: 'Hoenderloo', km: 'ca. 12 km', ll: [5.85, 52.125] },
      { n: 'Epe', km: 'ca. 14 km', ll: [5.9861, 52.3486] },
      { n: 'Voorst', km: 'ca. 14 km', ll: [6.15, 52.1667] },
    ],
  },
  {
    h: 'Binnen een half uur',
    places: [
      { n: 'Deventer', km: 'ca. 18 km', ll: [6.1639, 52.2551] },
      { n: 'Heerde', km: 'ca. 22 km', ll: [6.0417, 52.3861] },
      { n: 'Zutphen', km: 'ca. 22 km', ll: [6.2, 52.14] },
      { n: 'Arnhem', km: 'ca. 26 km', ll: [5.8987, 51.9851] },
      { n: 'Barneveld', km: 'ca. 26 km', ll: [5.5833, 52.14] },
    ],
  },
  {
    h: 'Verder weg, in overleg',
    places: [
      { n: 'Huissen', km: 'ca. 33 km', ll: [5.9417, 51.9333] },
      { n: 'Ede', km: 'ca. 35 km', ll: [5.6667, 52.0333] },
      { n: 'Harderwijk', km: 'ca. 35 km', ll: [5.6208, 52.3417] },
      { n: 'Zwolle', km: 'ca. 40 km', ll: [6.083, 52.5168] },
      { n: 'Amersfoort', km: 'ca. 45 km', ll: [5.3878, 52.1561] },
    ],
  },
];

// Reviews. Woordelijk overgenomen van het Werkspot-profiel, inclusief de score.
// `stars` is de eigen score van die review omgerekend van de Werkspot-schaal van
// 10 naar 5 sterren; alle drie staan op 10/10. Niet zelf invullen: de ruwe data
// staat in work/reviews.json, opnieuw op te halen van het profiel.
export const REVIEWS = [
  {
    n: 'Stefan',
    d: 'augustus 2026',
    stars: 5,
    t: 'Zeer tevreden over Mike, hij heeft de complete installatie van onze badkamer verzorgd. Mike heeft oog voor detail en denkt goed mee. Ik kan hem aan iedereen aanraden.',
  },
  {
    n: 'Floris',
    d: 'juni 2026',
    stars: 5,
    t: 'Geweldig geholpen door Mike, hij heeft onze hele badkamer gedaan. Van het sloopwerk tot het volledig installeren van alles. Mike kwam zijn afspraken altijd na. Absoluut aan te raden!!',
  },
  {
    n: 'Martin',
    d: 'april 2025',
    stars: 5,
    t: 'Vakman met een enorm gevoel voor detail! De badkamer is werkelijk prachtig. Prettige communicatie en erg net gewerkt.',
  },
];

export const FAQ = [
  {
    q: 'Wat kost een badkamerrenovatie?',
    a: 'Dat hangt af van het formaat, de tegelkeuze en hoeveel er achter de wand moet gebeuren. Daarom staan er hier geen rekenmodules: je krijgt eerst een opname in de ruimte en daarna een vaste prijsopgave met materiaal en werk apart. Zo weet je waar je aan toe bent voordat de eerste tegel eraf gaat.',
  },
  {
    q: 'Hoe lang duurt een complete badkamer?',
    a: 'Een complete badkamer is doorgaans twee tot drie weken werk, een toilet een paar dagen. Bij de opname hoor je een startdatum en een doorlooptijd, en tijdens het werk hoor je het meteen als iets afwijkt.',
  },
  {
    q: 'Kan ik thuis blijven wonen tijdens de verbouwing?',
    a: 'Ja. De ruimte wordt afgeschermd, het puin gaat elke dag mee en de rest van je huis blijft schoon. Het toilet blijft zo lang mogelijk in bedrijf; als het er echt even uit moet, weet je dat vooraf.',
  },
  {
    q: 'Regelen jullie ook het materiaal?',
    a: 'Beide kan. Je kiest zelf in de showroom en wij monteren het, of we adviseren en bestellen alles voor je. Een zelf gekochte badkamer, ook een IKEA-badkamer, plaatsen en sluiten we net zo goed aan.',
  },
  {
    q: 'Doen jullie ook alleen tegelwerk of alleen het loodgieterswerk?',
    a: 'Ja. Losse klussen kunnen ook: alleen wandtegels, een kraan of radiator vervangen, een lekkage verhelpen, een CV-ketel met verdeler installeren of nieuwe waterleiding trekken.',
  },
  {
    q: 'Wie doet het leidingwerk en de techniek?',
    a: 'Het water, de afvoer en de verwarming doet Mike zelf. Daarom zitten installatiewerk en tegelwerk hier in één hand. Wat er voor de elektra nodig is, bespreken we bij de opname.',
  },
  {
    q: 'Krijg ik garantie op het werk?',
    a: `Ja, op het geleverde werk. MTS Badkamers is een handelsnaam van M. Techno Service, ingeschreven bij de Kamer van Koophandel onder nummer 91131537 en een geverifieerd bedrijf op Werkspot.`,
  },
  {
    q: 'En als er na de oplevering toch iets is?',
    a: 'Dan kom je bij dezelfde man terug die het gebouwd heeft. Bij de oplevering lopen we alles samen na en restpunten worden direct opgelost; daarna blijft het nummer gewoon hetzelfde.',
  },
  {
    q: 'Werken jullie ook buiten Apeldoorn?',
    a: 'Ja. Apeldoorn is de thuisbasis, maar Deventer, Zutphen, Arnhem, Epe, Vaassen en Twello liggen allemaal binnen bereik. Bij een complete verbouwing komen we ook verder rijden. Even appen is het snelst.',
  },
];

/**
 * Dienstenpagina's.
 *
 * De homepage moest tot nu toe in haar eentje scoren op badkamerrenovatie,
 * toiletrenovatie, tegelwerk en loodgieterswerk tegelijk. Dat kan niet: één
 * pagina kan niet het beste antwoord zijn op vier verschillende zoekopdrachten,
 * en de secties op de home zijn te kort om er een te winnen.
 *
 * Deze vier pagina's zijn de landingspagina's voor die vier zoekopdrachten. De
 * secties op de home blijven staan zoals ze zijn en linken hierheen, dus er
 * verdwijnt niets.
 *
 * Per dienst:
 *   slug     het adres, en meteen de belangrijkste zoekterm
 *   hero     media-index voor de kop van de pagina
 *   projects slugs uit projects.mjs; dit is het bewijs onder de tekst
 *   faq      indices in FAQ hierboven, de vragen die bij deze dienst horen
 *   omvat    wat er wel en niet onder valt, als lijst
 *
 * De teksten staan hier en niet in i18n-content.mjs omdat dit de Nederlandse
 * bron is; de vertalingen volgen hetzelfde patroon als de projecten (terugval
 * per veld, zie i18n-content.mjs).
 */
export const SERVICES = [
  {
    slug: 'badkamerrenovatie',
    hero: 107,
    projects: [
      'visgraat-badkamer-met-ligbad',
      'terrazzo-met-vrijstaand-bad',
      'betonlook-met-zwart-staal',
      'badkamer-met-ligbad-metamorfose',
      'hexagon-badkamer-en-dakkapel',
      'marmerlook-met-ronde-spiegel',
    ],
    faq: [0, 1, 2, 3],
    title: 'Badkamerrenovatie Apeldoorn',
    kicker: 'Complete badkamers',
    h1: 'Een complete badkamer, van sloop tot oplevering',
    lead: 'Alles wat er tussen de oude en de nieuwe badkamer zit, door dezelfde vakman: slopen, leidingwerk, waterdichten, tegelen en afmonteren.',
    desc: 'Complete badkamerrenovatie in Apeldoorn en omgeving. Sloop, leidingwerk, waterdichting, tegelwerk en afmontage door een vakman. Vaste prijs na de opname.',
    intro: [
      'Een badkamer renoveren is niet één klus maar zes, en bij de meeste bedrijven komt er voor elke klus iemand anders langs. Hier niet. De sloop, het water, de afvoer, de verwarming, het tegelwerk en de afmontage doet Mike zelf. Dat scheelt je het gedoe dat bij een verbouwing meestal het vervelendst is: uitzoeken bij wie je moet zijn als iets niet klopt.',
      'De volgorde ligt vast omdat de bouw dat afdwingt. Eerst gaat alles eruit tot op het casco, want pas dan zie je wat er achter de wand zit. Dan het leidingwerk, uitgemeten op de plek waar het sanitair straks komt. Dan de waterdichting, en die is het enige onderdeel dat je later nooit meer kunt herstellen zonder de tegels eraf te halen. Pas daarna wordt er getegeld.',
      'Een complete badkamer is doorgaans twee tot drie weken werk. Je hoort bij de opname welke weken dat zijn en je hoort het meteen als er iets afwijkt. De ruimte wordt afgeschermd, het puin gaat elke dag mee en het toilet blijft zo lang mogelijk in bedrijf.',
    ],
    omvat: [
      ['Slopen en afvoeren', 'Oude badkamer eruit, tot op de dekvloer of tot op het casco. Puin gaat elke dag mee.'],
      ['Leidingwerk en afvoer', 'Nieuwe waterleiding en riolering, uitgemeten op de plek van het nieuwe sanitair.'],
      ['Vloerverwarming', 'Elektrisch of op de cv, zodat er geen radiator ruimte hoeft te stelen.'],
      ['Waterdichting', 'Vloer, hoeken en douchezone waterdicht voordat er ook maar één tegel op gaat.'],
      ['Wand- en vloertegels', 'Uitgezet voordat er gesneden wordt. Visgraat, hexagon, grootformaat of natuursteenlook.'],
      ['Sanitair en afmontage', 'Wastafel, meubel, douchewand, toilet, kranen en radiator geplaatst en aangesloten.'],
    ],
    slot: 'Wat er voor de elektra nodig is bespreken we bij de opname. Wil je het materiaal zelf uitzoeken in de showroom, dan monteren we dat net zo goed als wat wij bestellen.',
  },
  {
    slug: 'toiletrenovatie',
    hero: 231,
    projects: ['toiletrenovaties', 'patroontegels-in-de-douche', 'grijze-badkamer-houten-meubel'],
    faq: [0, 1, 2, 6],
    title: 'Toiletrenovatie Apeldoorn',
    kicker: 'Toilet en fonteintje',
    h1: 'Een nieuw toilet in een paar dagen',
    lead: 'Hangend toilet, inbouwreservoir, tegelwerk en een fonteintje. De kleinste ruimte van het huis, en de ruimte waar slordig werk het snelst opvalt.',
    desc: 'Toiletrenovatie in Apeldoorn en omgeving. Hangend toilet, inbouwreservoir, tegelwerk en fonteintje, meestal binnen een paar dagen klaar.',
    intro: [
      'Een toilet is een paar vierkante meter, en juist daarom zie je er alles. Een voeg die niet doorloopt, een tegel die op de verkeerde plek gesneden is, een reservoir dat een centimeter uit het lood staat: in een badkamer valt dat weg tegen het formaat, in een toilet staat het op ooghoogte.',
      'Bij een toiletrenovatie gaat het oude toilet eruit, komt er een inbouwreservoir in de wand en wordt de afvoer op de nieuwe hoogte gezet. De wand eromheen wordt dichtgezet en betegeld tot waar jij wilt: helemaal tot het plafond, of tot halverwege met stucwerk erboven.',
      'De meeste toiletten zijn in twee tot vier dagen klaar. Dat is korter dan een badkamer, maar het is wel de ruimte die je thuis het hardst mist. Daarom wordt hij aan één stuk afgemaakt en niet tussen andere klussen door ingepland.',
    ],
    omvat: [
      ['Hangend toilet met inbouwreservoir', 'Reservoir in de wand, afvoer op de juiste hoogte, wand dichtgezet en betegeld.'],
      ['Tegelwerk', 'Vloer en wand, tot het plafond of tot een tegellijst met stucwerk erboven.'],
      ['Fonteintje met kraan', 'Inclusief water en afvoer, ook als er nog nooit een fonteintje heeft gezeten.'],
      ['Toilet vervangen zonder verbouwing', 'Alleen de pot en het reservoir, tegelwerk blijft zoals het is.'],
      ['Ventilatie', 'Afzuiging aansluiten of vervangen, zodat het vocht eruit gaat.'],
    ],
    slot: 'Ook een staand toilet vervangen door een hangend kan. Dan verschuift de afvoer, dus daar kijken we bij de opname naar.',
  },
  {
    slug: 'tegelwerk',
    hero: 250,
    projects: [
      'visgraat-badkamer-met-ligbad',
      'chevron-met-messing',
      'bruine-tegels-met-hexagon',
      'travertijn-met-natuursteen-wastafel',
      'houtlook-inloopdouche',
      'badkamer-met-betegelde-zitbank',
    ],
    faq: [4, 3, 6],
    title: 'Tegelzetter Apeldoorn',
    kicker: 'Wand- en vloertegels',
    h1: 'Tegelwerk waar de lijnen doorlopen',
    lead: 'Visgraat, chevron, hexagon, grootformaat en natuursteenlook. Ook als tegelwerk de enige klus is en de rest van de badkamer blijft staan.',
    desc: 'Tegelzetter in Apeldoorn en omgeving. Visgraat, chevron, hexagon en grootformaat tegelwerk, ook als losse klus zonder complete renovatie.',
    intro: [
      'Aan een tegelvloer zie je binnen een seconde of iemand hem heeft uitgezet of gewoon in een hoek is begonnen. Uitzetten betekent: eerst uitrekenen waar het patroon uitkomt, zodat je niet in het zicht met een reepje van twee centimeter eindigt en de voegen om de hoek doorlopen.',
      'Patronen als visgraat en chevron vragen daar het meest om. Ze werken alleen als de ondergrond kaarsrecht is, want elke oneffenheid wordt door het patroon uitvergroot in plaats van verstopt. Bij grootformaat tegels geldt hetzelfde om een andere reden: hoe groter de tegel, hoe minder een scheve ondergrond zich laat wegwerken in de lijm.',
      'Tegelwerk hoeft geen onderdeel van een complete verbouwing te zijn. Alleen een douchewand opnieuw, een keukenachterwand, een halvloer of een toilet: dat kan als losse klus. Wel altijd met dezelfde volgorde, dus eerst kijken wat er onder zit.',
    ],
    omvat: [
      ['Visgraat en chevron', 'Vooraf uitgezet, want in dit patroon valt een centimeter afwijking meteen op.'],
      ['Grootformaat tegels', 'Vlakke ondergrond eerst, anders komt de tegel nooit strak te liggen.'],
      ['Hexagon en mozaïek', 'Ook als accentvlak in een douche of achter een wastafel.'],
      ['Natuursteen en natuursteenlook', 'Travertijn, marmerlook en terrazzo, inclusief de behandeling die erbij hoort.'],
      ['Vloertegels met vloerverwarming', 'Dekvloer eerst egaliseren, dan pas tegelen.'],
      ['Voegen en kitwerk', 'Ook los, als het oude voegwerk of de kitrand aan vervanging toe is.'],
    ],
    slot: 'De tegels kun je zelf uitzoeken of samen met ons bestellen. Breng bij de opname een foto of een monster mee, dan rekenen we meteen door hoeveel je nodig hebt.',
  },
  {
    slug: 'loodgieter-en-cv',
    hero: 241,
    projects: ['leidingwerk-cv-en-techniek', 'visgraat-badkamer-met-ligbad', 'woonkamer-en-keuken'],
    faq: [5, 4, 6, 8],
    title: 'Loodgieter en CV Apeldoorn',
    kicker: 'Water, afvoer en verwarming',
    h1: 'Leidingwerk, cv en alles achter de wand',
    lead: 'Waterleiding, riolering, radiatoren en cv-ketels. Het werk dat je na de oplevering nooit meer ziet en dat je daarom in één keer goed wilt hebben.',
    desc: 'Loodgieter in Apeldoorn en omgeving. Waterleiding, riolering, lekkages, radiatoren en cv-ketel installeren, ook zonder badkamerverbouwing.',
    intro: [
      'Het meeste installatiewerk verdwijnt achter een wand of onder een vloer. Dat maakt het niet minder belangrijk, het maakt het alleen duurder om later te herstellen. Een aftakking op de verkeerde hoogte, een afvoer met te weinig afschot of een koppeling die je nooit meer kunt bereiken: dat zijn de dingen waar een verbouwing jaren later alsnog op stukloopt.',
      'Bij MTS Badkamers zit het installatiewerk in dezelfde hand als het tegelwerk. Dat is geen detail. De man die de leidingen trekt weet waar de tegels straks komen, en de man die tegelt weet wat er achter die wand zit. Bij een badkamer scheelt dat de klassieke discussie tussen twee partijen over wie er nu iets fout heeft gemeten.',
      'Losse klussen kunnen ook, zonder verbouwing eromheen. Een lekkage verhelpen, een kraan of radiator vervangen, nieuwe waterleiding trekken of een cv-ketel vervangen inclusief verdeler en expansievat.',
    ],
    omvat: [
      ['Waterleiding', 'Verplaatsen, vervangen of compleet opnieuw trekken, in koper of kunststof.'],
      ['Riolering en afvoer', 'Nieuwe afvoer met het juiste afschot, ook als het sanitair verplaatst wordt.'],
      ['Lekkage opsporen en verhelpen', 'Eerst vinden waar het vandaan komt, dan pas openmaken.'],
      ['Cv-ketel installeren', 'Vervanging of nieuwe installatie, inclusief verdeler en expansievat.'],
      ['Radiatoren', 'Design- en handdoekradiatoren plaatsen of verplaatsen, inclusief het leidingwerk ernaartoe.'],
      ['Vloerverwarming', 'Aanleggen en aansluiten op de cv of als elektrische mat onder de tegels.'],
    ],
    slot: 'Wat er voor de elektra nodig is bespreken we bij de opname. Voor een lekkage of een defecte ketel is een appje met een foto het snelst.',
  },
];
