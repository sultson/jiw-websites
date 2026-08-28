// Projectdefinities. Indices verwijzen naar de volgnummers van de aangeleverde media.
// c = caption. Alles wat niet in secties/resultaat staat, komt in de projectgalerij.

export const BIZ = {
  // MTS Badkamers is de handelsnaam waaronder het bedrijf naar buiten treedt;
  // M. Techno Service is de naam waaronder het bij de KvK staat. Overal waar de
  // site een merknaam toont staat BIZ.name; BIZ.legalName hoort alleen op de
  // plekken waar de inschrijving telt (footer, FAQ over garantie, JSON-LD).
  name: 'MTS Badkamers',
  legalName: 'M. Techno Service',
  city: 'Apeldoorn',
  kvk: '91131537',
  // rating/reviews zijn er bewust uit: de Werkspot-score (4,3 uit 7) staat op
  // verzoek nergens meer op de site, ook niet in de structured data. Zet ze hier
  // niet terug zonder de bijbehorende blokken in build.mjs.
  waNumber: '31647093103',
  waDisplay: '+31 6 47093103',
  werkspot: 'https://www.werkspot.nl/profiel/m-techno-service',

  // Coordinaten van de thuisbasis, gelijk aan HQ in content.mjs. Google koppelt
  // een LocalBusiness aan een plek op de kaart; zonder geo blijft het een naam.
  geo: { lat: 52.2112, lon: 5.9699 },

  // De dag dat de site op mts-badkamers.nl live ging. Dit is datePublished op de
  // projectpaginas: niet de datum van de verbouwing (die is nergens vastgelegd,
  // WhatsApp haalt de EXIF eruit) maar de datum waarop deze pagina er kwam. Dat
  // is precies wat schema.org met datePublished bedoelt.
  published: '2026-08-18',

  // ---- nog in te vullen door Mike -------------------------------------------
  // Alle drie staan bewust leeg. build.mjs zet ze alleen in de structured data
  // als er iets staat en waarschuwt bij elke bouw zolang dat niet zo is. Een
  // verzonnen openingstijd of prijsklasse is erger dan een ontbrekend veld:
  // Google vergelijkt ze met het Google-bedrijfsprofiel en met wat bezoekers
  // melden.
  //
  //   email: 'info@mts-badkamers.nl',
  //   priceRange: '$$',                       // grove klasse, geen bedragen
  //   hours: [
  //     { dagen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], van: '07:30', tot: '17:00' },
  //     { dagen: ['Saturday'], van: '09:00', tot: '13:00' },
  //   ],
  email: '',
  priceRange: '',
  hours: [],

  // Sociale en zakelijke profielen. Elk adres hier komt in sameAs terecht en
  // vertelt Google dat dit dezelfde onderneming is. Lege regels worden
  // overgeslagen, dus een profiel toevoegen is een adres invullen.
  //
  // Het Google-bedrijfsprofiel is het belangrijkste en bestaat nog niet; zodra
  // het geverifieerd is hoort de deel-URL hier.
  profielen: {
    google: '',
    instagram: '',
    facebook: '',
    trustoo: '',
  },
};

export const projects = [
  {
    slug: 'visgraat-badkamer-met-ligbad',
    title: 'Visgraat, ligbad en vloerverwarming',
    kicker: 'Complete badkamer',
    hero: 245,
    card: 245,
    tags: ['Complete renovatie', 'Vloerverwarming', 'Visgraat tegelwerk'],
    blurb: 'Een badkamer die tot op de dekvloer is gestript en opnieuw is opgebouwd: nieuw leidingwerk, vloerverwarming, een ingebouwd ligbad en een wand in visgraatverband.',
    intro: [
      'Bij deze verbouwing bleef er van de oude badkamer niets over. De wanden gingen terug tot het beton, de vloer werd opnieuw opgebouwd en al het leidingwerk is opnieuw getrokken. Dat is meteen het moment om dingen goed te doen die je daarna nooit meer ziet: de plek van de afvoeren, het afschot van de douchevloer, de aansluitingen achter de wand.',
      'Boven op de nieuwe vloer ligt vloerverwarming, zodat er geen radiator ruimte hoeft te stelen. De wand achter de wastafel is in visgraatverband gezet. Dat patroon werkt alleen als de ondergrond kaarsrecht is en je de tegels vooraf uitzet.',
    ],
    sections: [
      {
        h: 'Terug naar het casco',
        p: 'Muren gestript, oude leidingen eruit, nieuwe waterleiding en afvoer op maat getrokken. Elke aansluiting is uitgemeten voordat de wand weer dichtging.',
        imgs: [
          { i: 241, c: 'Nieuwe koperen leidingen in de gestripte wand' },
          { i: 242, c: 'Aftakkingen uitgezet met de kruislijnlaser' },
          { i: 223, c: 'Afvoer en leidingwerk in de vloer' },
          { i: 244, c: 'Wandaansluitingen op hoogte' },
        ],
      },
      {
        h: 'Vloerverwarming onder de tegels',
        p: 'De vloerverwarming is in de dekvloer meegenomen. Het oude bad stond er nog toen de mat werd uitgerold, zodat de badkamer zo lang mogelijk bruikbaar bleef.',
        imgs: [
          { i: 243, c: 'Vloerverwarmingsmat, klaar voor de dekvloer' },
          { i: 249, c: 'Egale dekvloer als ondergrond voor het tegelwerk' },
        ],
      },
      {
        h: 'Bad inbouwen en alles waterdicht',
        p: 'Het ligbad is ingemetseld en afgetimmerd, de douchehoek is volledig waterdicht gemaakt met kimband en waterdichtingslagen tot ruim boven de doucheslang.',
        imgs: [
          { i: 226, c: 'Bad op zijn plek, wanden waterdicht afgewerkt' },
          { i: 231, c: 'Waterdichting doorgezet tot in de hoeken' },
          { i: 230, c: 'Douchehoek waterdicht, klaar om te tegelen' },
          { i: 227, c: 'Badomranding opgemetseld' },
          { i: 233, c: 'Bad ingepakt tijdens de afbouw' },
          { i: 239, c: 'Laatste controle voor het tegelwerk' },
        ],
      },
      {
        h: 'Uitzetten en tegelen',
        p: 'Grootformaat tegels op de wand, visgraat achter de wastafel. Alles begint bij het uitzetten: waar valt de eerste tegel, waar komt de snijmaat, hoe loopt het patroon de hoek om.',
        imgs: [
          { i: 225, c: 'Wandtegels uitgezet met levelling clips' },
          { i: 229, c: 'Laserlijnen bepalen het vertrekpunt' },
          { i: 234, c: 'Tegelwerk rond de badomranding' },
          { i: 236, c: 'Uitmeten voor de snijmaat' },
          { i: 228, c: 'Douchevloer met lijngoot en afschot' },
          { i: 235, c: 'Nis op tegelmaat uitgezet' },
        ],
      },
    ],
    results: [
      { i: 245, c: 'Visgraatwand met zwevend toilet en meubel' },
      { i: 248, c: 'Dubbele wastafel met spiegelverlichting' },
      { i: 220, c: 'Houten meubel en zwarte radiator' },
      { i: 222, c: 'De wand in vol daglicht' },
      { i: 240, c: 'Ingebouwd ligbad met douchecombinatie' },
      { i: 232, c: 'Strak afgewerkte bedieningsplaat' },
      { i: 237, c: 'Douchecabine met zwart profiel' },
    ],
  },

  {
    slug: 'terrazzo-met-vrijstaand-bad',
    title: 'Terrazzo met een vrijstaand bad',
    kicker: 'Complete badkamer',
    hero: 173,
    card: 173,
    tags: ['Complete renovatie', 'Terrazzo', 'Vrijstaand bad'],
    blurb: 'Oude betegelde badkamer eruit, terrazzo erin. Een vrijstaand bad onder het raam, een inloopdouche met lijngoot en een dubbele wastafel op een houten meubel.',
    intro: [
      'De oude badkamer was volledig betegeld met kleine witte tegels en helemaal ingedeeld rond een hoekbad. Alles is eruit gesloopt, tot op de steen.',
      'Wat ervoor terugkwam is rustiger: terrazzo op de vloer en in de douche, gladde wanden, en een vrijstaand bad dat vrij in de ruimte staat in plaats van weggedrukt in een hoek.',
    ],
    sections: [
      {
        h: 'De oude badkamer eruit',
        p: 'Wandtegels eraf, vloer eruit, sanitair afgekoppeld. Wat overblijft is een kale ruimte waarin je opnieuw kunt indelen.',
        imgs: [
          { i: 170, c: 'Wandtegels eraf tot op de steen' },
          { i: 182, c: 'Oude aansluitingen zichtbaar' },
          { i: 172, c: 'Alles eruit, klaar voor de nieuwe opbouw' },
          { i: 177, c: 'Sloopwerk rond de oude douchehoek' },
        ],
      },
      {
        h: 'Terrazzo op vloer en in de douche',
        p: 'Terrazzotegels vragen strak uitgezet werk: het spikkelpatroon verbergt niets, elke voeglijn moet kloppen. De douchevloer heeft afschot naar een lijngoot.',
        imgs: [
          { i: 167, c: 'Terrazzovloer met lijngoot in de douche' },
          { i: 179, c: 'Doucheruimte volledig in terrazzo' },
          { i: 178, c: 'Regendouche tegen de terrazzowand' },
          { i: 171, c: 'Tweede douche met glazen wand' },
        ],
      },
      {
        h: 'Het bad op zijn plek',
        p: 'Het vrijstaande bad kwam onder het raam te staan, met de aansluitingen vooraf uitgezet in de vloer. Tijdens de afbouw ging het ingepakt.',
        imgs: [
          { i: 166, c: 'Bad ingepakt tijdens het afbouwen' },
          { i: 163, c: 'Badrand en kraanwerk gemonteerd' },
          { i: 165, c: 'Badcombinatie met zwart kraanwerk' },
        ],
      },
    ],
    results: [
      { i: 173, c: 'Vrijstaand bad met terrazzovloer' },
      { i: 180, c: 'Het bad onder het raam' },
      { i: 181, c: 'Ronde spiegel tegenover het bad' },
      { i: 176, c: 'Wastafelmeubel met ronde spiegel' },
      { i: 174, c: 'Hanglampen boven de terrazzowand' },
      { i: 161, c: 'Twee waskommen met spiegelverlichting' },
      { i: 160, c: 'Meubel met handdoekradiator ernaast' },
    ],
  },

  {
    slug: 'hexagon-badkamer-en-dakkapel',
    title: 'Hexagon, terrazzo en een dakkapel erbij',
    kicker: 'Badkamer + uitbouw',
    // 196 stond hier eerst, maar daar staat de fotograaf in de spiegel; als
    // kaart- en heroshot leest dat als slordig. 210 is dezelfde hoek, schoon.
    hero: 210,
    // De kaart stond ook op 210, en dat is sinds vandaag de hero van de homepage
    // plus de "na" van deze voor/na. Drie keer dezelfde foto op één pagina. 194
    // (roze hexagon met het groene ribbelpaneel) is even herkenbaar en anders.
    card: 194,
    tags: ['Complete renovatie', 'Dakkapel', 'Hexagon tegelwerk'],
    blurb: 'De grootste klus uit het archief: eerst het dak open voor een dakkapel, daarna een complete badkamer met roze hexagon, terrazzo en een groen ribbelmeubel.',
    intro: [
      'Deze badkamer werd eerst groter gemaakt. Er ging een steiger tegen de gevel, het dakvlak werd opengelegd en er kwam een dakkapel in. Pas daarna begon de badkamer zelf.',
      'De afwerking mocht kleur hebben: roze hexagontegels tegen een terrazzo-achtige ondergrond, een groen ribbelmeubel met twee waskommen en een ronde spiegel die het daglicht van de nieuwe dakkapel de ruimte in gooit.',
    ],
    sections: [
      {
        h: 'Eerst het dak open',
        p: 'Steiger tegen de gevel, dakvlak open, dakkapel erin en het platte dak opnieuw dichtgezet. Zonder die ruimte was de rest van het plan niet gelukt.',
        imgs: [
          { i: 183, c: 'Steiger tegen de gevel' },
          { i: 188, c: 'Het dakvlak opengelegd' },
          { i: 190, c: 'De dakkapel wordt geplaatst' },
          { i: 201, c: 'Werken vanaf de steiger' },
          { i: 207, c: 'Constructie van de dakkapel' },
          { i: 217, c: 'Plat dak opnieuw dichtgezet' },
        ],
      },
      {
        h: 'Alles eruit',
        p: 'Binnen ging tegelijk de complete oude badkamer eruit: tegels, sanitair, leidingen en de oude scheidingswand.',
        imgs: [
          { i: 185, c: 'Wanden gestript' },
          { i: 191, c: 'Oude leidingen in beeld' },
          { i: 193, c: 'Het oude toilet eruit' },
          { i: 209, c: 'Sloopwerk in volle gang' },
          { i: 216, c: 'Nieuw inbouwreservoir op zijn plek' },
        ],
      },
      {
        h: 'Vloer, verwarming en tegelwerk',
        p: 'Vloerverwarming in de nieuwe vloer, daarna het tegelwerk. Hexagon uitzetten is precisiewerk: het patroon moet de hoek om zonder dat je een halve tegel ziet vallen op een verkeerde plek.',
        imgs: [
          { i: 186, c: 'Vloerverwarming voor de dekvloer' },
          { i: 192, c: 'Wandtegels uitgezet' },
          { i: 218, c: 'De hexagonwand groeit' },
          { i: 219, c: 'Roze hexagon tegen de spikkelwand' },
          { i: 203, c: 'Tegelwerk richting het plafond' },
          { i: 215, c: 'Laatste rijen op maat' },
        ],
      },
    ],
    results: [
      { i: 210, c: 'Roze hexagon, groen meubel en ronde spiegel' },
      { i: 213, c: 'Dubbele waskom onder het nieuwe raam' },
      { i: 196, c: 'Het meubel in vol daglicht' },
      { i: 184, c: 'Hoge kast in dezelfde groentint' },
      { i: 187, c: 'Zwevend toilet tegen de hexagonwand' },
      { i: 194, c: 'Groene ribbelradiator als accent' },
      { i: 200, c: 'Toilethoek afgewerkt' },
      { i: 202, c: 'Bedieningsplaat strak in de tegel' },
      { i: 214, c: 'Inloopdouche met glazen wand' },
    ],
    videos: [199, 206, 211],
  },

  {
    slug: 'betonlook-met-zwart-staal',
    title: 'Betonlook met zwart staal',
    kicker: 'Complete badkamer',
    hero: 93,
    card: 93,
    tags: ['Complete renovatie', 'Betonlook', 'Dubbele waskom'],
    blurb: 'Grootformaat betonlook van vloer tot plafond, een douchewand met zwart stalen profiel en twee donkere waskommen op een houten meubel.',
    intro: [
      'De oude badkamer zat vol kleur: gele wanden, oud leidingwerk, een indeling die niet meer klopte. Alles ging eruit, tot op de vloerbalken toe.',
      'De nieuwe badkamer draait om rust. Grootformaat betonlooktegels lopen door van vloer tot plafond, en het enige echte contrast is het zwarte staal: de douchewand, de radiator, het kraanwerk en het toilet.',
    ],
    sections: [
      {
        h: 'Alles eruit',
        p: 'De wanden werden teruggebracht tot de kern en de vloerconstructie is opengelegd om afvoer en leidingwerk opnieuw te leggen.',
        imgs: [
          { i: 92, c: 'De oude badkamer gestript' },
          { i: 98, c: 'Oude elektra en leidingen eruit' },
          { i: 96, c: 'Wanden voorbereid voor de nieuwe opbouw' },
          { i: 101, c: 'Vloerconstructie open voor nieuwe afvoer' },
        ],
      },
      {
        h: 'Techniek in de vloer',
        p: 'Vloerverwarming en leidingwerk zijn ingemeten voordat de dekvloer erover ging. Wat hier misgaat, kost je later de hele vloer.',
        imgs: [
          { i: 95, c: 'Leidingwerk en verwarming in de vloer' },
          { i: 97, c: 'Voorzetwand met nis in aanbouw' },
        ],
      },
      {
        h: 'Betonlook van vloer tot plafond',
        p: 'Grote tegels betekenen weinig voegen, en dus valt het des te meer op als er iets niet vlak zit. De wanden zijn eerst uitgevlakt, daarna getegeld.',
        imgs: [
          { i: 100, c: 'Regendouche tegen de betonlookwand' },
          { i: 102, c: 'Douchewand met zwart stalen profiel' },
          { i: 104, c: 'Nis in de doucheruimte' },
          { i: 103, c: 'Zwart toilet, strak in de tegel' },
        ],
      },
    ],
    results: [
      { i: 93, c: 'Dubbele waskom met stalen douchewand' },
      { i: 91, c: 'Wastafelmeubel langs het raam' },
      { i: 94, c: 'Handdoekradiator in dezelfde zwarte lijn' },
      { i: 99, c: 'Zicht op de badkamer vanaf de deur' },
    ],
  },

  {
    slug: 'badkamer-met-betegelde-zitbank',
    title: 'Een betegelde zitbank in de douche',
    kicker: 'Complete badkamer',
    hero: 111,
    card: 111,
    tags: ['Complete renovatie', 'Zitbank', 'LED-verlichting'],
    blurb: 'Warme beige tegels, een structuurwand in groen en een gemetselde zitbank met LED-verlichting eronder. Plus een lijngoot over de volle breedte.',
    intro: [
      'De oude badkamer was klein, wit betegeld en gedateerd. De wens: een doucheruimte waar je ook echt kunt zitten, zonder dat het een badkamer voor later wordt.',
      'De zitbank is gemetseld, betegeld en onderbouwd met een LED-strip, zodat hij lijkt te zweven. De achterwand kreeg een structuurtegel in groen, het enige stuk waar het oog blijft hangen.',
    ],
    sections: [
      {
        h: 'De oude badkamer',
        p: 'Wit tegelwerk, een klein toilet en een indeling die de ruimte niet gebruikte. Alles is eruit gehaald.',
        imgs: [
          { i: 121, c: 'De oude badkamer voor de sloop' },
          { i: 122, c: 'Tegelwerk eraf' },
          { i: 110, c: 'Puin op de oude vloer' },
          { i: 120, c: 'Wanden uitgezet met de laser' },
          { i: 125, c: 'Klaar voor de nieuwe opbouw' },
        ],
      },
      {
        h: 'Waterdicht en uitgezet',
        p: 'Doucheput, afschot en waterdichting zijn eerst gemaakt. Pas als dat klopt, begint het tegelwerk.',
        imgs: [
          { i: 106, c: 'Leidingwerk in de wand, waterdicht afgeplakt' },
          { i: 118, c: 'Douchevloer met lijngoot uitgezet' },
          { i: 119, c: 'Nis uitgehakt op tegelmaat' },
          { i: 128, c: 'De zitbank opgemetseld' },
          { i: 127, c: 'Voorzetwand in aanbouw' },
        ],
      },
      {
        h: 'De bank en de lichtlijn',
        p: 'De bank is betegeld in dezelfde structuurtegel als de achterwand. De LED-strip loopt onder de zitting door en zet de wand aan.',
        imgs: [
          { i: 111, c: 'Zitbank met lijngoot en LED-verlichting' },
          { i: 112, c: 'De bank in de hoek doorgezet' },
          { i: 114, c: 'Structuurwand met verlichte nis' },
          { i: 116, c: 'De douche over de volle breedte' },
          { i: 126, c: 'Kraanwerk in de beige wand' },
          { i: 124, c: 'Regendouche boven de zitbank' },
        ],
      },
    ],
    results: [
      { i: 107, c: 'Zwevend meubel met natuurstenen waskom' },
      { i: 105, c: 'Handdoekradiator naast de wastafel' },
      { i: 109, c: 'Zicht op de badkamer vanaf de deur' },
      { i: 115, c: 'Ronde spiegel boven het meubel' },
      { i: 123, c: 'Zwart toilet in de beige wand' },
    ],
    videos: [129],
  },

  {
    slug: 'chevron-met-messing',
    title: 'Zwart-wit chevron met messing',
    kicker: 'Badkamer en toilet',
    hero: 85,
    card: 85,
    tags: ['Marmerlook', 'Chevron', 'Messing details'],
    blurb: 'Marmerlook op de wanden, een chevronpatroon in zwart-wit in de doucheruimte en messing kranen, goot en beugels als accent.',
    intro: [
      'Een klein oppervlak, een groot statement. De wanden zijn afgewerkt in marmerlook, en de doucheruimte kreeg een chevronpatroon in zwart-wit dat van vloer tot plafond doorloopt.',
      'De messing accenten zijn bewust beperkt gehouden: de lijngoot, het kraanwerk en de beugels. Dat werkt alleen als het patroon zelf strak ligt. Bij chevron is elke naad zichtbaar.',
    ],
    sections: [
      {
        h: 'Waterdicht vóór alles',
        p: 'De douchevloer en de onderste wanddelen zijn volledig waterdicht afgewerkt, inclusief kimband in alle hoeken en aansluitingen.',
        imgs: [
          { i: 79, c: 'Waterdichting over de vloer' },
          { i: 80, c: 'Waterdichte lagen tot boven de nissen' },
          { i: 75, c: 'Vloer voorbereid voor de doucheput' },
          { i: 81, c: 'Afvoeren op maat gezet' },
        ],
      },
      {
        h: 'Marmerlook uitzetten',
        p: 'Grootformaat marmerlook: eerst uitzetten, dan pas lijmen. De tekening moet doorlopen over de naden, anders valt het patroon uit elkaar.',
        imgs: [
          { i: 83, c: 'Wandtegels met levelling clips' },
          { i: 88, c: 'Nis en leidingdoorvoer ingepast' },
          { i: 86, c: 'Inbouwreservoir in de voorzetwand' },
          { i: 89, c: 'Voorzetwand klaar om te tegelen' },
        ],
      },
      {
        h: 'Chevron met messing',
        p: 'Het chevronpatroon loopt de nissen in en om de hoek. De messing lijngoot ligt precies in het midden van de doucheruimte.',
        imgs: [
          { i: 77, c: 'Chevronwand met messing beugel' },
          { i: 78, c: 'Nissen ingepast in het patroon' },
          { i: 76, c: 'Messing lijngoot in de douchevloer' },
        ],
      },
    ],
    results: [
      { i: 85, c: 'De doucheruimte opgeleverd' },
      { i: 82, c: 'Toilet in marmerlook met messing' },
      { i: 90, c: 'Marmerlookwand achter het toilet' },
      { i: 84, c: 'Verdeler en expansievat, netjes weggewerkt' },
    ],
  },

  {
    slug: 'marmerlook-met-ronde-spiegel',
    title: 'Marmerlook met een ronde spiegel',
    kicker: 'Complete badkamer',
    hero: 18,
    card: 18,
    tags: ['Complete renovatie', 'Marmerlook', 'Zwart sanitair'],
    blurb: 'Een oude ruimte terug tot op het metselwerk, en daarna afgewerkt in marmerlook met zwart kraanwerk, een zwarte waskom en een ronde spiegel met verlichting.',
    intro: [
      'Achter de oude wanden zat metselwerk, oud leidingwerk en een plafond dat open moest. Dat is allemaal vervangen voordat er ook maar één tegel op ging.',
      'De afwerking is licht gehouden: marmerlook op de wanden, zwart kraanwerk als tegenwicht en een ronde spiegel met verlichting boven een zwarte waskom.',
    ],
    sections: [
      {
        h: 'Terug tot op de steen',
        p: 'Wanden gestript, plafond open voor nieuwe leidingen, en een nieuw inbouwreservoir ingebouwd in de voorzetwand.',
        imgs: [
          { i: 10, c: 'Wand gestript tot op het metselwerk' },
          { i: 14, c: 'Nieuw leidingwerk in de oude muur' },
          { i: 17, c: 'Plafond open voor de installatie' },
          { i: 13, c: 'Inbouwreservoir in de voorzetwand' },
        ],
      },
      {
        h: 'Tegelwerk en kraanwerk',
        p: 'De marmerlooktegels lopen door in de douche. Inbouwkranen zitten in de wand, zodat er zo min mogelijk op het tegelwerk staat.',
        imgs: [
          { i: 12, c: 'Douchewand tijdens de afbouw' },
          { i: 20, c: 'Inbouwkraan in de marmerlookwand' },
          { i: 18, c: 'Doucheruimte opgeleverd' },
          { i: 9, c: 'Nis met bediening in de tweede douche' },
          { i: 15, c: 'Tweede doucheruimte afgewerkt' },
        ],
      },
    ],
    results: [],
    videos: [11, 16, 19],
  },

  {
    slug: 'houtlook-inloopdouche',
    title: 'Houtlook met inloopdouche',
    kicker: 'Complete badkamer',
    hero: 7,
    card: 7,
    tags: ['Complete renovatie', 'Houtlook tegels', 'Lijngoot'],
    blurb: 'Houtlooktegels op wand en vloer, een inloopdouche met lijngoot over de volle breedte en een wastafelmeubel met spiegelwand.',
    intro: [
      'Houtlooktegels geven de warmte van hout zonder het onderhoud. Ze zijn wel lastiger te leggen: de tegels zijn lang en smal, dus elke afwijking in de ondergrond zie je meteen terug in de voeg.',
      'De douche is drempelloos uitgevoerd met een lijngoot tegen de wand, zodat de vloer in één vlak doorloopt van de deur tot de douchekop.',
    ],
    sections: [
      {
        h: 'Sloop en opbouw',
        p: 'De oude ruimte is teruggebracht tot metselwerk. Daarna zijn de wanden uitgevlakt en is het tegelwerk uitgezet met de laser.',
        imgs: [
          { i: 6, c: 'Terug tot op het metselwerk' },
          { i: 1, c: 'Wandtegels uitgezet met levelling clips' },
          { i: 2, c: 'Douchehoek in aanbouw' },
          { i: 4, c: 'Tegelwerk richting het plafond' },
        ],
      },
      {
        h: 'De lijngoot en de vloer',
        p: 'De lijngoot ligt strak tegen de wand, met afschot vanuit de hele douchevloer. Zo blijft het vloerbeeld rustig en loopt het water toch weg.',
        imgs: [
          { i: 0, c: 'Lijngoot ingepast in de vloer' },
          { i: 8, c: 'Inloopdouche met lijngoot' },
        ],
      },
    ],
    results: [
      { i: 7, c: 'De badkamer opgeleverd' },
      { i: 5, c: 'Wastafelmeubel met spiegelwand' },
    ],
    videos: [3],
  },

  {
    slug: 'travertijn-met-natuursteen-wastafel',
    title: 'Travertijn met natuurstenen wastafel',
    kicker: 'Badkamer en toilet',
    hero: 45,
    card: 45,
    tags: ['Travertijnlook', 'Natuursteen', 'Ronde spiegel'],
    blurb: 'Een warme travertijnlook op wand en vloer, een massieve natuurstenen wastafel op een donker meubel en een douchevloer met vier kanten afschot.',
    intro: [
      'Deze badkamer is afgewerkt in travertijnlook: een warme, licht gevlekte steenlook die grote vlakken rustig houdt.',
      'Het pronkstuk is de massieve natuurstenen wastafel, met daarboven een ronde spiegel met verlichting. Het kraanwerk zit in de wand, zodat het blad helemaal vrij blijft.',
    ],
    sections: [
      {
        h: 'Het oude toilet eruit',
        p: 'De oude ruimte is gestript tot op de steen, inclusief de vloer en het oude sanitair.',
        imgs: [
          { i: 41, c: 'Het oude toilet voor de sloop' },
          { i: 43, c: 'Tegels en vloer eruit' },
        ],
      },
      {
        h: 'Uitzetten met de laser',
        p: 'De wanden zijn met de kruislijnlaser uitgezet en waterdicht afgewerkt voordat de eerste tegel op de wand ging.',
        imgs: [
          { i: 46, c: 'Waterdichting en tegelwerk in uitvoering' },
          { i: 47, c: 'Uitzetten met laser en waterpas' },
          { i: 42, c: 'Wandtegels op hoogte gebracht' },
        ],
      },
    ],
    results: [
      { i: 45, c: 'Natuurstenen wastafel met ronde spiegel' },
      { i: 44, c: 'Spiegelverlichting boven het blad' },
      { i: 48, c: 'Het meubel in vol daglicht' },
      { i: 49, c: 'Douchevloer met lijngoot en afschot' },
    ],
  },

  {
    slug: 'badkamer-met-ligbad-metamorfose',
    title: 'Van gedateerd bad naar strakke badkamer',
    kicker: 'Complete badkamer',
    hero: 55,
    card: 55,
    tags: ['Complete renovatie', 'Ligbad', 'Dubbele wastafel'],
    blurb: 'Een badkamer uit de vorige eeuw met bruin tegelwerk, een hoekbad en een losse radiator, vervangen door een strakke ruimte met ligbad en dubbele wastafel.',
    intro: [
      'Dit is de duidelijkste voor-na uit het archief. De oude badkamer had klein bruin tegelwerk, een ingebouwd bad met betegelde rand en een radiator midden op de wand.',
      'De nieuwe badkamer gebruikt precies dezelfde vierkante meters, maar dan met grootformaat tegels, een strak ligbad, een dubbele wastafel en een zwarte designradiator.',
    ],
    sections: [
      {
        h: 'Hoe het was',
        p: 'Klein tegelwerk, gedateerd sanitair en een indeling die de ruimte niet benutte.',
        imgs: [
          { i: 53, c: 'De oude badkamer' },
          { i: 54, c: 'Het oude bad met betegelde rand' },
          { i: 56, c: 'Het oude toilet' },
          { i: 58, c: 'Sloop van de badomranding' },
        ],
      },
      {
        h: 'Opnieuw opgebouwd',
        p: 'Nieuwe wanden, nieuw leidingwerk en grootformaat tegelwerk, uitgezet vanaf de raamzijde.',
        imgs: [
          { i: 51, c: 'Wanden gestript' },
          { i: 57, c: 'Wandtegels uitgezet' },
        ],
      },
    ],
    results: [
      { i: 55, c: 'Dubbele wastafel met zwarte designradiator' },
      { i: 52, c: 'Ligbad met wastafelmeubel' },
      { i: 50, c: 'Het nieuwe bad met inbouwkraan' },
    ],
    videos: [59],
  },

  {
    slug: 'woonkamer-en-keuken',
    title: 'Woonkamer, keuken en trappenhuis',
    kicker: 'Verbouwing',
    hero: 28,
    card: 28,
    tags: ['Verbouwing', 'Indirecte verlichting', 'Wandpanelen'],
    blurb: 'Niet alleen badkamers: een complete woonlaag met verlaagd plafond, indirecte verlichting, houten wandpanelen en een visgraatvloer.',
    intro: [
      'Deze klus laat zien dat het werk niet ophoudt bij de badkamerdeur. Hier ging de hele woonlaag op de schop: plafonds eruit, nieuwe indeling, nieuwe vloer.',
      'Het verlaagde plafond met indirecte verlichting bepaalt het beeld. Daaronder: houten ribbelpanelen rond de tv, een open trap en een visgraatvloer die doorloopt tot in de keuken.',
    ],
    sections: [
      {
        h: 'Plafonds eruit',
        p: 'Het oude plafond is helemaal verwijderd om ruimte te maken voor nieuwe leidingen, spots en de verlaagde constructie.',
        imgs: [
          { i: 25, c: 'Plafond eruit, balken vrij' },
          { i: 26, c: 'De woonlaag gestript' },
          { i: 29, c: 'Klaar voor de nieuwe plafondconstructie' },
        ],
      },
      {
        h: 'Licht in het plafond',
        p: 'De verlaagde delen zijn zo gemaakt dat de LED-verlichting niet zichtbaar is: je ziet alleen de lichtlijn tegen het plafond.',
        imgs: [
          { i: 31, c: 'Verlaagd plafond met lichtlijn' },
          { i: 36, c: 'De lichtlijn langs de trap' },
          { i: 37, c: 'Indirecte verlichting rondom' },
          { i: 40, c: 'Afwerking richting de tuindeuren' },
        ],
      },
    ],
    results: [
      { i: 28, c: 'De woonkamer opgeleverd' },
      { i: 32, c: 'Keuken en trap met wandpanelen' },
      { i: 39, c: 'Ribbelpanelen rond de tv-wand' },
    ],
    // 35 stond bij de oplevering, maar het is een filmpje en er staat nog
    // materiaal in beeld. Hoort bij de videos, niet bij de opleverfotos.
    videos: [33, 35],
  },

  {
    slug: 'toiletrenovaties',
    title: 'Toiletrenovaties',
    kicker: 'Toilet',
    hero: 142,
    card: 142,
    tags: ['Toiletrenovatie', 'Inbouwreservoir', 'Fonteintje'],
    blurb: 'Een toilet is klein, en juist daarom onvergeeflijk: elke snijmaat en elke voeg valt op. Een serie complete toiletrenovaties, van sloop tot fonteintje.',
    intro: [
      'Bij een toilet zie je alles. De ruimte is zo klein dat je in één blik de hele wand overziet, dus moet het tegelwerk vanaf de eerste tegel kloppen.',
      'Deze renovaties gingen steeds hetzelfde: oude tegels en sanitair eruit, nieuw inbouwreservoir in een voorzetwand, grootformaat tegelwerk en een zwevend toilet met fonteintje.',
    ],
    sections: [
      {
        h: 'Sloop en inbouwreservoir',
        p: 'De oude wandtegels gaan eraf, daarna komt er een voorzetwand met inbouwreservoir. Daar verdwijnt meteen al het leidingwerk in.',
        imgs: [
          { i: 149, c: 'Wandtegels eraf' },
          { i: 158, c: 'Inbouwreservoir geplaatst' },
          { i: 146, c: 'Voorzetwand in aanbouw' },
          { i: 159, c: 'Klaar voor het tegelwerk' },
          { i: 139, c: 'Reservoir uitgelijnd' },
          { i: 135, c: 'Oude ruimte gestript' },
        ],
      },
    ],
    results: [
      { i: 142, c: 'Zwevend toilet met fonteintje' },
      { i: 145, c: 'Toilet met betegelde voorzetwand' },
      { i: 151, c: 'Fonteintje met zwart kraanwerk' },
      { i: 152, c: 'Grootformaat tegels tot het plafond' },
      { i: 148, c: 'Fonteintje strak op de wand' },
      { i: 153, c: 'Toiletruimte in afbouw' },
    ],
  },

  {
    slug: 'grijze-badkamer-houten-meubel',
    title: 'Grijze badkamer met houten meubel',
    kicker: 'Complete badkamer',
    hero: 138,
    card: 138,
    tags: ['Complete renovatie', 'Inloopdouche', 'Houten meubel'],
    blurb: 'Grijs grootformaat tegelwerk, een houten wastafelmeubel met ronde waskom en een inloopdouche achter glas.',
    intro: [
      'De oude badkamer had een terracotta vloer, een ingebouwd bad en gedateerd sanitair. De nieuwe indeling ruilde het bad in voor een ruime inloopdouche.',
      'Het tegelwerk is grijs en grootformaat gehouden; het hout van het wastafelmeubel doet de rest.',
    ],
    sections: [
      {
        h: 'De oude badkamer',
        p: 'Terracotta vloer, ingebouwd bad, gedateerd sanitair. De indeling paste niet meer bij het gebruik.',
        imgs: [
          { i: 147, c: 'De oude badkamer met bad' },
          { i: 144, c: 'Vloer eruit, leidingen vrijgelegd' },
        ],
      },
    ],
    results: [
      { i: 138, c: 'Houten meubel met ronde waskom' },
      { i: 155, c: 'Zicht op de badkamer met inloopdouche' },
      { i: 136, c: 'Inloopdouche achter glas' },
      { i: 143, c: 'Douchevloer met lijngoot' },
    ],
    videos: [154, 156, 157],
  },

  {
    slug: 'patroontegels-in-de-douche',
    title: 'Patroontegels in de douche',
    kicker: 'Doucheruimte',
    hero: 132,
    card: 132,
    tags: ['Patroontegels', 'Waterdichting', 'Lijngoot'],
    blurb: 'Een doucheruimte met Portugese patroontegels als achterwand, tegen een rustige grijze omlijsting en met een lijngoot in de vloer.',
    intro: [
      'Patroontegels werken het beste als ze één wand krijgen en de rest rustig blijft. Hier vormt de patroonwand de achterwand van de douche; de zijwanden en de vloer zijn effen gehouden.',
      'Onder het tegelwerk zit het echte werk: een volledig waterdicht gemaakte douchevloer met afschot naar een lijngoot.',
    ],
    sections: [
      {
        h: 'Waterdicht maken',
        p: 'De doucheruimte is helemaal waterdicht afgewerkt, inclusief kimband in de hoeken en rond de doorvoeren.',
        imgs: [
          { i: 140, c: 'Waterdichting in de doucheruimte' },
          { i: 141, c: 'Kimband rond de aansluitingen' },
        ],
      },
    ],
    results: [
      { i: 132, c: 'Patroonwand met zwarte stangdouche' },
      { i: 133, c: 'Het patroon van onder gezien' },
      { i: 134, c: 'Douchevloer met lijngoot' },
    ],
  },

  {
    slug: 'bruine-tegels-met-hexagon',
    title: 'Bruine tegels met hexagon',
    kicker: 'Complete badkamer',
    hero: 24,
    card: 24,
    tags: ['Hexagon', 'Ronde spiegel', 'Inloopdouche'],
    blurb: 'Warme bruine wandtegels, een hexagonvlak als accent en een ronde spiegel met verlichting boven een strak wastafelblad.',
    intro: [
      'Een badkamer in warme, donkere tinten. De grote wandtegels lopen door tot in de douche; het hexagonvlak breekt dat op één plek open.',
      'De ronde spiegel met verlichting hangt vrij op de wand, zodat de tegel er zichtbaar achter doorloopt.',
    ],
    sections: [],
    results: [
      { i: 24, c: 'Wastafelblad op donker meubel' },
      { i: 21, c: 'Bruine wandtegels met houten plank' },
      { i: 23, c: 'Hexagon als accentvlak' },
      { i: 22, c: 'Ronde spiegel met verlichting' },
      { i: 30, c: 'Doucheruimte met ronde spiegel' },
      { i: 34, c: 'Lijngoot in de doucheruimte' },
    ],
  },

  {
    slug: 'leidingwerk-cv-en-techniek',
    title: 'Leidingwerk, CV en techniek',
    kicker: 'Installatiewerk',
    hero: 66,
    card: 66,
    tags: ['CV-ketel', 'Verdeler', 'Waterleiding'],
    blurb: 'Het deel van het werk dat je later nooit meer ziet: CV-ketels, verdelers, expansievaten en waterleiding die netjes en bereikbaar is weggewerkt.',
    intro: [
      'Een badkamer is voor de helft installatiewerk. Waterleiding, afvoer, elektra en verwarming liggen straks achter tegels en dekvloer. Daar kom je niet zomaar meer bij.',
      'Deze fotos komen uit verschillende klussen: CV-ketels met verdeler en expansievat, nieuwe waterleidingen en afvoeren, en voorzetwanden waarin het allemaal verdwijnt.',
    ],
    sections: [
      {
        h: 'CV-ketel, verdeler en expansievat',
        p: 'De ketel hangt met de verdeler en het expansievat in één blok, zodat het onderhoud bereikbaar blijft en de leidingen strak naast elkaar lopen.',
        imgs: [
          { i: 66, c: 'CV-ketel met verdeler en expansievat' },
          { i: 70, c: 'Verdeler met aan- en afvoerleidingen' },
          { i: 73, c: 'Complete opstelling gemonteerd' },
          { i: 67, c: 'Ketel aangesloten tijdens de verbouwing' },
          { i: 68, c: 'Leidingwerk richting de badkamer' },
        ],
      },
      {
        h: 'Waterleiding en voorzetwanden',
        p: 'Nieuwe leidingen worden op maat getrokken en verdwijnen in voorzetwanden of in de vloer, met de aansluitpunten precies op tegelmaat.',
        imgs: [
          { i: 69, c: 'Leidingwerk in de voorzetwand' },
          { i: 71, c: 'Aansluitpunten uitgezet' },
          { i: 65, c: 'Wandopbouw rond het leidingwerk' },
          { i: 72, c: 'Vloertegels rond nieuwe leidingen' },
        ],
      },
    ],
    results: [],
    videos: [74],
  },
];
