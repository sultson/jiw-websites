/* ---------- de privacyverklaring ----------
 *
 * Dit is de tekst uit de pdf die Marjon zelf heeft aangeleverd (10-10-2026),
 * woord voor woord. Hij vervangt de twee documenten die er stonden: de oude
 * 'Privacy en cookies' over de website en de oude privacyverklaring over het
 * patientendossier. Dat laatste kan weg omdat ze alleen nog online coaching
 * doet en geen eigen behandelpraktijk meer heeft (Armando, 10-10-2026).
 *
 * LET OP bij toekomstige rondes: niets van onszelf toevoegen. Geen samenvatting,
 * geen uitleg, geen extra kopje, geen toelichtende zin bij een knop. Armando
 * heeft daar op 10-10-2026 drie keer op moeten wijzen. Wat hier staat is haar
 * document; wil iemand iets anders, dan levert zij een nieuwe pdf aan.
 *
 * Twee dingen uit de pdf staan er bewust NIET in, allebei afgestemd met Armando:
 *
 *   1. Het vestigingsadres Kievitlaan 99, 1742 AC Schagen. Marjon wil dat niet
 *      publiek en de AVG eist geen bezoekadres, alleen dat je de
 *      verwerkingsverantwoordelijke kunt bereiken. Website, telefoon en e-mail
 *      staan er dus wel.
 *   2. '(bijvoorbeeld omdat dit bedrijf onderdeel is van een advertentienetwerk)'
 *      achter het surfgedrag-punt. Dat is zij niet. Het surfgedrag-punt zelf
 *      blijft staan, want de Meta Pixel doet dat.
 *
 * De 'wij'-vorm is die van haar document. De rest van de site is 'ik'. Dat is
 * bewust zo gelaten: dit zijn haar woorden.
 *
 * Nog niet binnen en dus nergens genoemd: het KvK-nummer en de meet-ID's van
 * Google en Meta.
 */

export const VERKLARING_BIJGEWERKT = 'oktober 2026';

export const PARTIJEN = [
  {
    naam: 'Doelio B.V.',
    land: 'Nederland',
    categorie: 'Websitebeheer',
    doel: 'Bouwen, onderhouden en beveiligen van de website',
    gegevens:
      'Gegevens die via de website binnenkomen, zoals berichten via het contactformulier, en technische gegevens zoals je IP-adres',
  },
  {
    naam: 'Cloudflare, Inc.',
    land: 'Verenigde Staten',
    categorie: 'Hosting en beveiliging',
    doel: 'Hosten van de website, snel laden en bescherming tegen aanvallen',
    gegevens: 'IP-adres, browser- en apparaatgegevens',
  },
  {
    naam: 'Mailchimp, onderdeel van Intuit Inc.',
    land: 'Verenigde Staten',
    categorie: 'E-mailmarketing',
    doel: 'Verzenden van onze nieuwsbrief',
    gegevens: 'Naam, e-mailadres, open- en klikgedrag',
  },
  {
    naam: 'Google Ireland Ltd. en Google LLC',
    land: 'Ierland en Verenigde Staten',
    categorie: 'Websiteanalyse',
    doel: 'Bijhouden van websitestatistieken via Google Analytics',
    gegevens: 'IP-adres, surfgedrag, apparaat- en locatiegegevens',
  },
  {
    naam: 'Meta Platforms Ireland Ltd.',
    land: 'Ierland, met doorgifte naar de Verenigde Staten',
    categorie: 'Social media en advertenties',
    doel: 'Meten van advertentieresultaten via de Meta Pixel en tonen van advertenties op Facebook en Instagram',
    gegevens: 'IP-adres, surfgedrag, apparaatgegevens',
  },
];

export const HOOFDSTUKKEN = [
  {
    kop: 'Persoonsgegevens die wij verwerken',
    blokken: [
      {
        t: 'p',
        v: 'Bewust Gezond in je Mond verwerkt je persoonsgegevens doordat je gebruik maakt van onze diensten en/of omdat je deze gegevens zelf aan ons verstrekt. Hieronder vind je een overzicht van de persoonsgegevens die wij verwerken:',
      },
      {
        t: 'lijst',
        v: [
          'Voor- en achternaam',
          'Internetbrowser en apparaattype',
          'Bankrekeningnummer',
          'Geslacht',
          'Telefoonnummer',
          'E-mailadres',
          'IP-adres',
          'Overige persoonsgegevens die je actief verstrekt, bijvoorbeeld door een profiel op onze website aan te maken, in correspondentie en telefonisch',
          'Locatiegegevens',
          'Gegevens over jouw activiteiten op onze website',
          'Gegevens over jouw surfgedrag over verschillende websites heen',
        ],
      },
    ],
  },
  {
    kop: 'Bijzondere en/of gevoelige persoonsgegevens die wij verwerken',
    blokken: [
      {
        t: 'p',
        v: 'Onze website en/of dienst heeft niet de intentie gegevens te verzamelen over websitebezoekers die jonger zijn dan 16 jaar, tenzij ze toestemming hebben van ouders of voogd. We kunnen echter niet controleren of een bezoeker ouder dan 16 is. Wij raden ouders dan ook aan betrokken te zijn bij de online activiteiten van hun kinderen, om zo te voorkomen dat er gegevens over kinderen verzameld worden zonder ouderlijke toestemming. Als je ervan overtuigd bent dat wij zonder die toestemming persoonlijke gegevens hebben verzameld over een minderjarige, neem dan contact met ons op via info@marjonooteman.nl. Dan verwijderen wij deze informatie.',
      },
    ],
  },
  {
    kop: 'Met welk doel wij persoonsgegevens verwerken',
    blokken: [
      {t: 'p', v: 'Bewust Gezond in je Mond verwerkt jouw persoonsgegevens voor de volgende doelen:'},
      {
        t: 'lijst',
        v: [
          'Het afhandelen van jouw betaling',
          'Verzenden van onze nieuwsbrief en/of reclamefolder',
          'Je te kunnen bellen of e-mailen als dit nodig is om onze dienstverlening uit te kunnen voeren',
          'Je te informeren over wijzigingen van onze diensten en producten',
          'Bewust Gezond in je Mond analyseert jouw gedrag op de website om daarmee de website te verbeteren en het aanbod van producten en diensten af te stemmen op jouw voorkeuren',
          'Bewust Gezond in je Mond verwerkt ook persoonsgegevens als wij hier wettelijk toe verplicht zijn, zoals gegevens die wij nodig hebben voor onze belastingaangifte',
        ],
      },
    ],
  },
  {
    kop: 'Geautomatiseerde besluitvorming',
    blokken: [
      {t: 'p', v: 'Bewust Gezond in je Mond maakt geen gebruik van geautomatiseerde besluitvorming.'},
    ],
  },
  {
    kop: 'Hoe lang we persoonsgegevens bewaren',
    blokken: [
      {
        t: 'p',
        v: 'Bewust Gezond in je Mond bewaart je persoonsgegevens niet langer dan strikt nodig is om de doelen te realiseren waarvoor je gegevens worden verzameld. Wij hanteren een bewaartermijn van 84 maanden (7 jaar).',
      },
    ],
  },
  {
    kop: 'Delen van persoonsgegevens met derden',
    blokken: [
      {
        t: 'p',
        v: 'Bewust Gezond in je Mond deelt jouw persoonsgegevens met verschillende derden als dit noodzakelijk is voor het uitvoeren van de overeenkomst en om te voldoen aan een eventuele wettelijke verplichting. Met bedrijven die je gegevens verwerken in onze opdracht, sluiten wij een verwerkersovereenkomst om te zorgen voor eenzelfde niveau van beveiliging en vertrouwelijkheid van jouw gegevens. Bewust Gezond in je Mond blijft verantwoordelijk voor deze verwerkingen. Daarnaast verstrekt Bewust Gezond in je Mond jouw persoonsgegevens aan andere derden. Dit doen wij alleen met jouw nadrukkelijke toestemming.',
      },
      {t: 'p', v: 'Hieronder een overzicht van de partijen waarmee wij werken:'},
      {t: 'partijen'},
      {
        t: 'p',
        v: 'Een deel van deze partijen verwerkt gegevens in de Verenigde Staten. Die doorgifte gebeurt op basis van het EU-VS Data Privacy Framework of de standaardcontractbepalingen van de Europese Commissie.',
      },
    ],
  },
  {
    kop: 'Cookies, of vergelijkbare technieken, die wij gebruiken',
    blokken: [
      {
        t: 'p',
        v: 'Bewust Gezond in je Mond gebruikt functionele, analytische en tracking cookies. Een cookie is een klein tekstbestand dat bij het eerste bezoek aan deze website wordt opgeslagen in de browser van je computer, tablet of smartphone. Bewust Gezond in je Mond gebruikt cookies met een puur technische functionaliteit. Deze zorgen ervoor dat de website naar behoren werkt en dat bijvoorbeeld jouw voorkeursinstellingen onthouden worden. Deze cookies worden ook gebruikt om de website goed te laten werken en deze te kunnen optimaliseren. Daarnaast plaatsen we cookies die jouw surfgedrag bijhouden, zodat we op maat gemaakte content en advertenties kunnen aanbieden.',
      },
      {
        t: 'p',
        v: 'Bij jouw eerste bezoek aan onze website hebben wij je al geïnformeerd over deze cookies en hebben we je toestemming gevraagd voor het plaatsen ervan.',
      },
      {
        t: 'p',
        v: 'Je kunt je afmelden voor cookies door je internetbrowser zo in te stellen dat deze geen cookies meer opslaat. Daarnaast kun je ook alle informatie die eerder is opgeslagen via de instellingen van je browser verwijderen. Zie voor een toelichting: https://veiliginternetten.nl/wat-zijn-cookies/',
      },
      {
        t: 'p',
        v: 'Op deze website worden ook cookies geplaatst door derden. Dit zijn bijvoorbeeld adverteerders en/of sociale-mediabedrijven. Hieronder een overzicht:',
      },
      {
        t: 'cookies',
        v: [
          {naam: 'Google Analytics', termijn: '24 maanden'},
          {naam: 'Meta Pixel (Facebook)', termijn: '24 maanden'},
        ],
      },
    ],
  },
  {
    kop: 'Gegevens inzien, aanpassen of verwijderen',
    blokken: [
      {
        t: 'p',
        v: 'Je hebt het recht om je persoonsgegevens in te zien, te corrigeren of te verwijderen. Daarnaast heb je het recht om je eventuele toestemming voor de gegevensverwerking in te trekken of bezwaar te maken tegen de verwerking van jouw persoonsgegevens door Bewust Gezond in je Mond, en heb je het recht op gegevensoverdraagbaarheid. Dat betekent dat je bij ons een verzoek kunt indienen om de persoonsgegevens die wij van jou hebben in een computerbestand naar jou of een andere, door jou genoemde organisatie te sturen.',
      },
      {
        t: 'p',
        v: 'Je kunt een verzoek tot inzage, correctie, verwijdering of overdracht van je persoonsgegevens, of een verzoek tot intrekking van je toestemming of bezwaar op de verwerking van jouw persoonsgegevens, sturen naar info@marjonooteman.nl. We reageren zo snel mogelijk op je verzoek, uiterlijk binnen vier weken.',
      },
      {
        t: 'p',
        v: 'Bewust Gezond in je Mond wil je er tevens op wijzen dat je de mogelijkheid hebt om een klacht in te dienen bij de nationale toezichthouder, de Autoriteit Persoonsgegevens. Dat kan via de volgende link: https://autoriteitpersoonsgegevens.nl/nl/contact-met-de-autoriteit-persoonsgegevens/tip-ons',
      },
    ],
  },
  {
    kop: 'Hoe wij persoonsgegevens beveiligen',
    blokken: [
      {
        t: 'p',
        v: 'Bewust Gezond in je Mond neemt de bescherming van jouw gegevens serieus en neemt passende maatregelen om misbruik, verlies, onbevoegde toegang, ongewenste openbaarmaking en ongeoorloofde wijziging tegen te gaan. Als jij het idee hebt dat jouw gegevens toch niet goed beveiligd zijn of er aanwijzingen zijn van misbruik, neem dan contact met ons op via info@marjonooteman.nl.',
      },
    ],
  },
];
