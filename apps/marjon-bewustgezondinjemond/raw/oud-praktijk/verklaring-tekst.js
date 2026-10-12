/* De privacyverklaring van Bewust gezond in je mond, als gegevens.
 *
 * WAAROM DIT EEN LOS BESTAND IS. Deze tekst staat op twee plekken: op de pagina
 * /privacyverklaring en in het pdf-bestand dat daar te downloaden is. Dat moet
 * hetzelfde document zijn. Staat het twee keer uitgeschreven, dan lopen ze na
 * de eerste wijziging uit elkaar en staat er straks een andere bewaartermijn op
 * de site dan in het document dat een patient in handen heeft gekregen.
 * Daarom: hier de tekst, daar de opmaak. scripts/verklaring-pdf.mjs leest dit
 * bestand ook, dus het is bewust gewoon .js en geen .tsx.
 *
 * WAAR DIT VANDAAN KOMT. Marjon stuurde op 23 sep 2026 het invulmodel van
 * NVM-mondhygienisten door (jurist Marjolein Stigter, 2021). Dat model is
 * geschreven voor een praktijk met een pand en personeel en staat vol dingen
 * die zij niet doet. Op 28 sep 2026 beantwoordde zij alle 17 vragen van
 * marjon-privacy.klantenkraan.nl. Deze tekst is daarop gebouwd.
 *
 * DE REGEL VOOR DIT BESTAND: hier staat niets in wat zij niet gezegd heeft.
 * Wat zij niet beantwoord heeft, staat er niet in en wordt niet verzonnen.
 * Elke afwijking van het model is hieronder verantwoord.
 *
 * WAT ER UIT HET MODEL IS GEHAALD, en waarom:
 *   - declareren bij zorgverzekeraars, factoringmaatschappij, Vecozo en
 *     verzekeringsgegevens. Vraag 7: nee, zij factureert rechtstreeks aan de
 *     patient.
 *   - nieuwsbrieven, de softwareleverancier daarvan en de drukker. Vraag 8: nee,
 *     zij heeft er geen programma voor en verstuurt ze niet.
 *   - Peilstations en het aanleveren van gegevens aan de beroepsvereniging.
 *     Vraag 12: lid ja, Peilstations nee.
 *   - clean desk policy, systemen van medewerkers, veilig communiceren tussen
 *     collega's, privacy als agendapunt tijdens werkoverleg. Vraag 4: zij werkt
 *     alleen.
 *   - het NVM-logo in de kop en de slotregel dat NVM niet aansprakelijk is.
 *     Dat hoort bij het model en niet bij haar verklaring aan haar patienten.
 *
 * TWEE DINGEN DIE ER JUIST BIJ ZIJN GEKOMEN:
 *   - de bewaartermijn staat op TWINTIG jaar en niet op vijftien. Het model
 *     noemt vijftien jaar, maar dat is achterhaald: sinds 1 januari 2020 staat
 *     er twintig jaar in art. 7:454 lid 3 BW. Het model is van 2021 en is op
 *     dat punt nooit bijgewerkt. Vijftien overnemen zou betekenen dat haar
 *     verklaring een kortere termijn belooft dan de wet van haar eist.
 *   - haar tandarts-alinea in hoofdstuk 3. Dat staat niet in het model. Zij
 *     vroeg er zelf om ("Ja, ik wil graag toestemming van de patient om
 *     gegevens uit te wisselen met zijn tandarts").
 *
 *   - de huurconstructie bij Mondzorg Schagen. Armando gaf op 28 sep 2026 door
 *     dat zij daar huurt. Dat is geen detail: een patient zit straks in het
 *     pand van een andere praktijk en neemt aan dat het een praktijk is. Huren
 *     betekent dat zij zelf verwerkingsverantwoordelijke is en dat Mondzorg
 *     Schagen niet bij het dossier kan. Dat staat nu in hoofdstuk 1, 3 en 5.
 *
 * WAT NOG OPEN STAAT en bewust NIET als aanname in de tekst is gezet:
 *   - de naam van de patientenadministratie. Vraag 5: "Ik ben bezig met een
 *     eigen software programma aan te schaffen", dus die is er nog niet. De AVG
 *     laat toe om een categorie ontvangers te noemen in plaats van een naam
 *     (art. 13 lid 1 sub e), dus er staat nu "de leverancier van mijn
 *     patientenadministratie". Zodra zij kiest hoort die naam hier.
 *   - haar boekhouding. Vraag 14 is met ja beantwoord zonder tekst, terwijl in
 *     die lijst ook dingen stonden die zij elders met nee beantwoordde. Dat ja
 *     is dus niet te lezen als de hele lijst. De boekhouder staat er daarom
 *     niet in. De zeven jaar fiscale bewaarplicht staat er wel: dat is de wet
 *     en geldt ook als zij haar boeken zelf doet.
 *   - het Veilig Incident Melden systeem uit de Wkkgz. Het model beschrijft dat
 *     als iets tussen medewerkers. In haar eentje wordt dat iets anders en zij
 *     heeft er niets over gezegd, dus het staat er niet in.
 *   - de naam van de geschilleninstantie achter de NVM-klachtenregeling.
 *
 * AANSPREEKVORM: je, niet u. Dit document loopt mee met de rest van de site.
 * Die stond in je, ging op 28 sep 2026 op verzoek van Marjon naar u, en op
 * 10 okt 2026 liet zij via Armando weten dat het weer je mag worden. Beide
 * rondes zijn in een keer over de hele site gedaan (`scripts/u-vorm.mjs` en
 * `scripts/je-vorm.mjs`), dus de verklaring en de paginas eromheen spreken de
 * patient hetzelfde aan. Juridisch maakt het niets uit. Let op: de praktijknaam
 * blijft "Bewust gezond in je mond", dat is haar merknaam en staat zo bij de
 * KvK. Heeft zij de verklaring of het intakeformulier in de u-versie al
 * uitgeprint, dan moet dat stapeltje opnieuw.
 */

export const VERSIE = '28 september 2026';

export const PRAKTIJK = 'Bewust gezond in je mond';
export const NAAM = 'Marjon Ooteman';
export const KVK = '37154226';
export const MAIL_V = 'info@marjonooteman.nl';
export const TEL_V = '06 20594924';

/* Zoals zij het zelf opgaf bij vraag 3: "Het adres van de praktijk 'Mondzorg
   Schagen' Noord 22 1741 BD Schagen is de locatie waar ik de mondhygiene
   behandelingen uit ga voeren." Dus als behandellocatie en niet als haar
   vestigingsadres, want dat is het niet.

   Armando bevestigde op 28 sep 2026 dat zij daar HUURT. Dat staat er expres bij
   in plaats van alleen het adres: wie dit leest zit straks in het pand van een
   andere praktijk en moet weten dat zijn dossier daar niet van is. */
export const LOCATIE = 'Mondzorg Schagen, Noord 22, 1741 BD Schagen (ruimte die ik daar huur)';

export const INLEIDING =
  'Bij een mondhygienist leg je dingen op tafel die niet veel persoonlijker worden: je gezondheid, je medicijnen, je mond. In deze verklaring staat wat ik van je vastleg, waarom ik dat doe, wie er verder bij kan en wat je daaraan kunt veranderen.';

export const GEGEVENS = [
  ['Verantwoordelijke en contactpersoon', NAAM],
  ['Praktijknaam', PRAKTIJK],
  ['KvK-nummer', KVK],
  ['Behandellocatie', LOCATIE],
  ['E-mail', MAIL_V],
  ['Telefoon', TEL_V],
];

/* De tabel uit hoofdstuk 2 van het model, teruggebracht tot wat zij echt nodig
   heeft. Verzekeringsgegevens en burgerlijke staat stonden erin en zijn eruit:
   zij declareert niet en heeft ze niet nodig. Fotos van de mond zijn erbij
   gekomen, want die maakt zij wel (vraag 10) en het model noemt ze niet. */
export const TABEL = {
  links: {
    kop: 'Gewone persoonsgegevens',
    rijen: ['Je naam, adres en woonplaats', 'Je geboortedatum', 'Je telefoonnummer', 'Je e-mailadres'],
  },
  rechts: {
    kop: 'Bijzondere persoonsgegevens',
    rijen: [
      'Je burgerservicenummer (BSN)',
      'Gegevens over je gezondheid',
      'Welke medicijnen je gebruikt',
      "Foto's van je mond",
    ],
  },
};

export const HOOFDSTUKKEN = [
  {
    nr: 1,
    kop: 'Waar deze verklaring over gaat',
    blokken: [
      {
        t: 'p',
        v: `${PRAKTIJK} hecht veel waarde aan de bescherming van persoonsgegevens. In deze verklaring lees je hoe ik in mijn praktijk met jouw gegevens omga en hoe die beschermd zijn.`,
      },
      {
        t: 'p',
        v: 'Ik werk volgens de wetten die daarover gaan, waaronder de Algemene verordening gegevensbescherming. Dat betekent in ieder geval dat ik:',
      },
      {
        t: 'lijst',
        v: [
          'je gegevens alleen gebruik voor het doel waarvoor je ze gegeven hebt. Die doelen staan in hoofdstuk 2.',
          'alleen die gegevens vastleg die ik voor dat doel echt nodig heb.',
          'maatregelen heb genomen om je gegevens te beveiligen. Die staan in hoofdstuk 5.',
          'je gegevens niet aan anderen geef, tenzij dat nodig is voor die doelen of de wet mij daartoe verplicht.',
          'weet welke rechten je hebt, die respecteer en je erover vertel.',
        ],
      },
      {
        t: 'p',
        v: 'Ik werk alleen. Er is geen personeel, geen balie en geen collega die meekijkt. Ik ben dus zelf verantwoordelijk voor wat er met je gegevens gebeurt, en ik ben ook degene bij wie je terecht kunt met een vraag of een verzoek.',
      },
      {t: 'kopje', v: 'Waarom je bij een andere praktijk naar binnen loopt'},
      {
        t: 'p',
        v: `Ik behandel je in een ruimte die ik huur bij Mondzorg Schagen aan de Noord 22. Dat is een eigen praktijk met een eigen naam, en daar huur ik alleen de ruimte van. Ik werk niet voor hen en zij niet voor mij. Je bent patient van ${PRAKTIJK} en niet van Mondzorg Schagen.`,
      },
      {
        t: 'p',
        v: 'Voor je gegevens betekent dat het volgende: ik houd mijn eigen dossier bij, in mijn eigen administratie, en Mondzorg Schagen kan daar niet bij. Zij zien je in de wachtkamer, maar zij zien je dossier niet. Andersom kan ik niet bij hun dossiers. Wil je dat ik iets met een behandelaar daar overleg, dan vraag ik je daar eerst toestemming voor, net als bij je tandarts.',
      },
      {t: 'gegevens'},
    ],
  },

  {
    nr: 2,
    kop: 'Waarvoor ik je gegevens gebruik',
    blokken: [
      {t: 'p', v: 'Ik gebruik je gegevens voor twee dingen:'},
      {
        t: 'lijst',
        v: [
          'Een behandelovereenkomst met je aangaan en je behandelen. Daar hoort bij dat ik je dossier bijhoud en dat ik je een factuur stuur.',
          'Contact met je houden over je afspraken.',
        ],
      },
      {
        t: 'p',
        v: 'Meer niet. Ik declareer niet bij zorgverzekeraars en werk niet met een factoringmaatschappij: je krijgt de factuur rechtstreeks van mij en regelt zelf wat je verzekering daarvan vergoedt. Ik verstuur geen nieuwsbrieven. Ik doe niet mee aan onderzoek waarbij praktijken gegevens aan de beroepsvereniging leveren.',
      },
      {t: 'tabel'},
      {
        t: 'p',
        v: 'De gegevens in de rechterkolom zijn gevoeliger dan de andere. Zonder die gegevens kan ik je niet behandelen. Wil je ze niet geven, dan kan de behandelovereenkomst niet tot stand komen en kan ik je niet als patient inschrijven.',
      },
      {
        t: 'p',
        v: 'Je BSN heb ik nodig om zeker te weten wie je bent. Dat je mij over je gezondheid en je medicijnen vertelt is geen beleefdheid maar een wettelijke plicht: zonder dat kan ik geen goede diagnose stellen en niet veilig behandelen.',
      },
      {t: 'kopje', v: "Foto's van je mond"},
      {
        t: 'p',
        v: "Foto's die ik in je mond maak horen bij je dossier en gebruik ik alleen daarvoor: om te zien hoe iets ervoor staat en om het je te laten zien. Ze gaan niet op mijn website en niet op sociale media. Zou ik ooit zo'n foto buiten je dossier willen gebruiken, dan vraag ik je daar apart om toestemming voor. Die toestemming staat los van je behandeling en je mag altijd nee zeggen.",
      },
      {t: 'kopje', v: 'Kinderen en mensen die hun eigen zaken niet kunnen regelen'},
      {
        t: 'p',
        v: 'Vanaf zestien jaar schrijf je jezelf in. Ben je jonger, dan leg ik pas gegevens vast nadat een ouder, verzorger of wettelijk vertegenwoordiger daar schriftelijk toestemming voor heeft gegeven. Hetzelfde geldt voor mensen die hun eigen zaken niet kunnen regelen.',
      },
    ],
  },

  {
    nr: 3,
    kop: 'Wie er verder bij je gegevens kan',
    blokken: [
      {
        t: 'p',
        v: 'Ik geef je gegevens alleen aan anderen als dat nodig is voor de doelen hierboven, of als de wet mij daartoe verplicht. Dat laatste gebeurt bijna nooit en gaat dan bijvoorbeeld om gegevens die de politie opvraagt in een onderzoek.',
      },
      {
        t: 'p',
        v: 'Met de partijen die mij helpen leg ik afspraken vast in een verwerkersovereenkomst. Daarin staat wat zij met je gegevens mogen en hoe zij die beveiligen. Het gaat om:',
      },
      {
        t: 'lijst',
        v: [
          'de leverancier van mijn patientenadministratie',
          'de leverancier van mijn kantoorsoftware en mijn e-mail',
          'de bouwer van mijn website',
        ],
      },
      {
        t: 'p',
        v: 'Die laatste is het minst spannende geval. Op mijn website staat geen enkel formulier dat iets over patienten doorstuurt, en er staan geen meetcookies op. Mijn websitebouwer kan dus niet bij je dossier. Verandert dat ooit, bijvoorbeeld als je online een afspraak kunt maken, dan pas ik deze verklaring aan voordat dat in de lucht gaat.',
      },
      {
        t: 'p',
        v: 'Mondzorg Schagen staat niet in dat rijtje. Ik huur daar een behandelruimte en verder niets: zij houden geen administratie voor mij bij en kunnen niet bij je dossier.',
      },
      {t: 'kopje', v: 'Je tandarts'},
      {
        t: 'p',
        v: 'Je mond wordt er beter van als je tandarts en ik weten wat de ander ziet. Maar dat gebeurt alleen als jij daar toestemming voor geeft. Die toestemming geef je op het intakeformulier, met de naam van je tandarts erbij, en je kunt hem op elk moment weer intrekken. Geef je hem niet, dan behandel ik je gewoon.',
      },
      {t: 'kopje', v: 'WhatsApp en e-mail'},
      {
        t: 'p',
        v: 'Via e-mail en WhatsApp gaat het bij mij alleen over afspraken: maken, verzetten of afzeggen. Je dossier, uitslagen en klachten over je gezondheid stuur ik daar niet doorheen. Dat is een bewuste keuze. WhatsApp is van Meta en je bericht loopt over hun servers, buiten Europa. Wil je iets bespreken wat over je gezondheid gaat, bel me dan of bewaar het voor in de stoel.',
      },
      {
        t: 'p',
        v: 'Op dat ene punt na geef ik geen gegevens door aan partijen buiten de Europese Unie. En alles wat buiten de doelen uit hoofdstuk 2 valt doe ik alleen als jij daar toestemming voor hebt gegeven.',
      },
    ],
  },

  {
    nr: 4,
    kop: 'Hoe lang ik je gegevens bewaar',
    blokken: [
      {
        t: 'p',
        v: 'Je dossier bewaar ik zolang je bij mij ingeschreven staat, en daarna nog twintig jaar. Die termijn staat in de wet, in artikel 7:454 van het Burgerlijk Wetboek, en die is er om jou te beschermen: is er later iets met je mond, dan is terug te zien wat er ooit gedaan is.',
      },
      {
        t: 'p',
        v: 'Je mag vragen om je dossier te vernietigen. Dat doe ik dan binnen drie maanden. Ik doe het niet als de wet mij verplicht het te bewaren, of als het bewaren van aanmerkelijk belang is voor iemand anders dan jij.',
      },
      {
        t: 'p',
        v: 'Andere gegevens die ik voor de praktijk nodig heb bewaar ik zolang je ingeschreven staat. Facturen vallen daarbuiten: die moet ik zeven jaar bewaren voor de Belastingdienst.',
      },
    ],
  },

  {
    nr: 5,
    kop: 'Hoe je gegevens beveiligd zijn',
    blokken: [
      {t: 'p', v: 'Dit is wat ik doe om je gegevens te beschermen tegen verlies en tegen gebruik waar ze niet voor bedoeld zijn.'},
      {
        t: 'lijst',
        v: [
          'Ik houd je dossier bij in een patientenadministratie waarmee ik een verwerkersovereenkomst heb, met afspraken over veilig aansluiten en installeren.',
          'Ik ben de enige die daarbij kan. Er is geen personeel en niemand kijkt mee. Ook de praktijk waar ik mijn behandelruimte huur kan er niet bij.',
          'Inloggen gaat met een eigen code. Mijn apparaten zijn met een code beveiligd en versleuteld.',
          'Je dossier houd ik zo actueel mogelijk.',
          'Ook als ik op locatie of onderweg werk, log ik op dezelfde veilige manier in.',
          'Op mijn apparaten staat bescherming tegen virussen, spam en andere gevaren van buitenaf.',
          'Per e-mail en WhatsApp gaan alleen afspraken. Je dossier en je medische gegevens gaan daar niet doorheen.',
          'Gaat er ondanks alles toch iets mis met je gegevens, dan werk ik volgens het protocol meldplicht datalekken van NVM-mondhygienisten. Raakt het jou, dan hoor je dat van mij.',
          'Ik ben lid van NVM-mondhygienisten en werk met hun document over veelgestelde vragen over privacy en patientenrechten.',
        ],
      },
    ],
  },

  {
    nr: 6,
    kop: 'Je rechten',
    blokken: [
      {
        t: 'p',
        v: 'Je hebt recht op inzage in je gegevens en in je dossier. Je mag ze laten verbeteren als er iets niet klopt, en je mag vragen ze te laten vernietigen. Je hebt ook het recht je gegevens te laten overdragen aan jezelf of aan een andere zorgverlener. Ik vraag je in al die gevallen om je te legitimeren, want ik wil zeker weten dat jij het bent.',
      },
      {
        t: 'p',
        v: 'Bij het vernietigen van je dossier hoort een waarschuwing. Zonder je medische voorgeschiedenis kan ik geen goede diagnose stellen en kan ik je veiligheid niet garanderen. Het kan dus betekenen dat ik je daarna niet meer kan behandelen.',
      },
      {
        t: 'p',
        v: 'Heb je ergens toestemming voor gegeven, bijvoorbeeld voor het uitwisselen met je tandarts, dan mag je die altijd weer intrekken.',
      },
    ],
  },

  {
    nr: 7,
    kop: 'Een vraag of een klacht',
    blokken: [
      {
        t: 'p',
        v: `Ik doe er alles aan om je gegevens goed te beschermen. Heb je een vraag, of ben je niet tevreden over hoe ik ermee omga, zeg het me dan. Bel ${TEL_V} of mail ${MAIL_V}. Ik probeer er samen met je uit te komen.`,
      },
      {
        t: 'p',
        v: 'Kom je er met mij niet uit, dan kun je terecht bij de klachtenregeling van NVM-mondhygienisten. Daar ben ik als lid bij aangesloten.',
      },
      {
        t: 'p',
        v: 'En je kunt altijd een klacht indienen bij de Autoriteit Persoonsgegevens. Dat is de toezichthouder die over de bescherming van persoonsgegevens gaat.',
      },
    ],
  },
];

export const SLOT = `Deze verklaring is van ${VERSIE}. Verandert er iets in mijn praktijk waar deze verklaring iets over zegt, dan pas ik hem aan en staat de nieuwe versie op mijn website.`;

/* ---------- de vinkjes voor het intakeformulier ----------

   Vraag 17: "Het intakeformulier moet nog worden gemaakt maar wil ik uiteraard
   gaan gebruiken en de vinkjes wil ik er dan graag op." Plus haar eigen
   toevoeging over de tandarts. Het model schrijft de eerste twee voor; de derde
   is van haar.

   Vinkje 1 is geen toestemming maar een bevestiging dat zij de verklaring
   gegeven heeft. Vinkje 2 en 3 zijn wel toestemming en die moeten vrij te laten
   zijn, anders is het geen toestemming. Daarom staat er bij allebei dat je ook
   zonder gewoon behandeld wordt. */
export const VINKJES = [
  {
    tekst: `Ik heb de privacyverklaring van ${PRAKTIJK} gelezen en weet waarvoor mijn gegevens gebruikt worden.`,
    onder: null,
  },
  {
    tekst:
      'Ik geef toestemming om mijn naam, adres en e-mailadres te gebruiken voor berichten die niet over mijn behandeling gaan.',
    onder: 'Vrijwillig. Laat je dit leeg, dan word je gewoon behandeld en hoor je alleen over je afspraken.',
  },
  {
    tekst: 'Ik geef toestemming om gegevens over mijn mondgezondheid uit te wisselen met mijn tandarts:',
    onder: 'Vrijwillig, en altijd weer in te trekken. Vul de naam van je tandarts in op de regel erachter.',
    regel: true,
  },
];

export const VINKJES_SLOT =
  'Is de patient jonger dan zestien, of kan hij zijn eigen zaken niet regelen, dan zet een ouder, verzorger of wettelijk vertegenwoordiger hier zijn naam en handtekening.';
