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
