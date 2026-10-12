/* Eenmalige omzetting: de hele site van je naar u.
 *
 * Marjon vroeg dit op 28 sep 2026 via Armando. Haar praktijknaam blijft
 * "Bewust gezond in je mond": dat is haar merknaam en staat zo bij de KvK, dus
 * die zin gaat NIET mee in de omzetting. Zelfde voor haar facebookpagina.
 *
 * Waarom dit een script is en geen zoek-en-vervang: "je" wordt u OF uw, en bij
 * een omgedraaide zin verandert ook het werkwoord (heb je -> hebt u, kun je ->
 * kunt u, word je -> wordt u). Elke regel hieronder is dus een hele zin of een
 * heel zinsdeel, met het aantal keren dat het voor moet komen. Klopt dat aantal
 * niet, dan stopt het script en is er niets aangepast.
 *
 * Het staat in de map omdat de omzetting hiermee na te lezen is. Het hoeft niet
 * nog een keer te draaien; dat kan ook niet, want de oude zinnen staan er dan
 * niet meer in.
 */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HIER = path.dirname(fileURLToPath(import.meta.url));
const R = (p) => path.join(HIER, '..', p);

/* [bestand, [ [van, naar, hoeveel keer], ... ] ] */
const WERK = [
  [
    'src/App.tsx',
    [
      // formulier
      ['Dank je wel', 'Dank u wel', 1],
      [
        '{`Je bericht staat genoteerd. Ik neem zelf contact met je op. Heb je haast, bel dan gerust ${TEL_TONEN}.`}',
        '{`Uw bericht staat genoteerd. Ik neem zelf contact met u op. Hebt u haast, bel dan gerust ${TEL_TONEN}.`}',
        1,
      ],
      ['          Je naam\n', '          Uw naam\n', 1],
      ['placeholder="Je naam"', 'placeholder="Uw naam"', 1],
      ['Waar kan ik je mee helpen?', 'Waar kan ik u mee helpen?', 2],
      [
        'Je gegevens gebruik ik alleen om je antwoord te geven.',
        'Uw gegevens gebruik ik alleen om u antwoord te geven.',
        1,
      ],
      // hero
      ['Jouw reis naar Bewust Gezond in je Mond', 'Uw reis naar Bewust Gezond in je Mond', 1],
      // inspiratie
      ["titel: 'Je mond is de voordeur van je lichaam'", "titel: 'Uw mond is de voordeur van uw lichaam'", 1],
      ['een laaggradige ontsteking die je hele lijf belast.', 'een laaggradige ontsteking die uw hele lijf belast.', 1],
      [
        "'Wat je eet bepaalt mee hoe je tandvlees eruitziet. Over variatie, vezels en de link tussen je darmen en je mond.'",
        "'Wat u eet bepaalt mee hoe uw tandvlees eruitziet. Over variatie, vezels en de link tussen uw darmen en uw mond.'",
        1,
      ],
      [
        "'Hoe je mondzorg omdraait van een klusje dat moet naar iets waar je zin in hebt, zonder opgeheven vinger.'",
        "'Hoe u mondzorg omdraait van een klusje dat moet naar iets waar u zin in hebt, zonder opgeheven vinger.'",
        1,
      ],
      [
        'Waarom je prestaties last hebben van wat er in je mond gebeurt.',
        'Waarom uw prestaties last hebben van wat er in uw mond gebeurt.',
        1,
      ],
      // tips
      ["titel: 'Je poetsroutine in vijf minuten'", "titel: 'Uw poetsroutine in vijf minuten'", 1],
      [
        "'Volgorde, tijd en techniek. Wat er echt toe doet en wat je gerust mag laten liggen.'",
        "'Volgorde, tijd en techniek. Wat er echt toe doet en wat u gerust mag laten liggen.'",
        1,
      ],
      [
        "titel: 'Je ochtend, van tong schrapen tot oil pulling'",
        "titel: 'Uw ochtend, van tong schrapen tot oil pulling'",
        1,
      ],
      [
        "tekst: 'Een dagritme dat je volhoudt, opgebouwd uit stappen van een minuut.'",
        "tekst: 'Een dagritme dat u volhoudt, opgebouwd uit stappen van een minuut.'",
        1,
      ],
      ["titel: 'Wat je op een doordeweekse dag eet'", "titel: 'Wat u op een doordeweekse dag eet'", 1],
      [
        "tekst: 'Boodschappen, tussendoortjes en drinken, vertaald naar je tandvlees.'",
        "tekst: 'Boodschappen, tussendoortjes en drinken, vertaald naar uw tandvlees.'",
        1,
      ],
      ["titel: 'Essentiële olie in je dagelijkse verzorging'", "titel: 'Essentiële olie in uw dagelijkse verzorging'", 1],
      [
        "tekst: 'Welke je gebruikt, hoeveel, en waar je op let bij het kiezen.'",
        "tekst: 'Welke u gebruikt, hoeveel, en waar u op let bij het kiezen.'",
        1,
      ],
      [
        'Stappenplannen, dagelijkse rituelen, poetsinstructies, en hoe je voeding en olie',
        'Stappenplannen, dagelijkse rituelen, poetsinstructies, en hoe u voeding en olie',
        1,
      ],
      ['laagdrempelig verweeft in je dag. Voor wie de regie wil pakken', 'laagdrempelig verweeft in uw dag. Voor wie de regie wil pakken', 1],
      // de drie werelden
      [
        'Als natuurlijk voedingsdeskundige inspireer ik je om je immuunsysteem en mondflora van binnenuit te voeden.',
        'Als natuurlijk voedingsdeskundige inspireer ik u om uw immuunsysteem en mondflora van binnenuit te voeden.',
        1,
      ],
      [
        'Ik kan je begeleiden bij het inzetten van voeding als medicijn op weg naar een gezonde mond.',
        'Ik kan u begeleiden bij het inzetten van voeding als medicijn op weg naar een gezonde mond.',
        1,
      ],
      [
        'essentiële oliën voor een natuurlijke balans in je mond.',
        'essentiële oliën voor een natuurlijke balans in uw mond.',
        1,
      ],
      [
        'De eeuwenoude oosterse kennis ziet verbanden met je algehele gezondheid en dit is terug te lezen in je mond middels tongdiagnose en/of je tanden en kiezen, welke in verbinding staan met alle organen en orgaansystemen in je lichaam. Ook tekorten van bijvoorbeeld vitamines zijn terug te lezen uit je mondgezondheid.',
        'De eeuwenoude oosterse kennis ziet verbanden met uw algehele gezondheid en dit is terug te lezen in uw mond middels tongdiagnose en/of uw tanden en kiezen, welke in verbinding staan met alle organen en orgaansystemen in uw lichaam. Ook tekorten van bijvoorbeeld vitamines zijn terug te lezen uit uw mondgezondheid.',
        1,
      ],
      // wie ben ik
      ['Mooi dat je mijn website hebt gevonden en de tijd neemt', 'Mooi dat u mijn website hebt gevonden en de tijd neemt', 1],
      [
        'Ooteman, mondhygi&euml;nist, en ik nodig je uit om op een compleet nieuwe manier naar je gezondheid te',
        'Ooteman, mondhygi&euml;nist, en ik nodig u uit om op een compleet nieuwe manier naar uw gezondheid te',
        1,
      ],
      [
        'jouw gezondheid. En het geheim van die gezondheid? Dat begint vaak in je mond.',
        'uw gezondheid. En het geheim van die gezondheid? Dat begint vaak in uw mond.',
        1,
      ],
      [
        'Als mondhygiënist met inmiddels 30 jaar ervaring zag ik hoe alle puzzelstukjes in elkaar vielen. Je mond is',
        'Als mondhygiënist met inmiddels 30 jaar ervaring zag ik hoe alle puzzelstukjes in elkaar vielen. Uw mond is',
        1,
      ],
      [
        'geen losstaand onderdeel; het is de spiegel en de poort van je algehele welzijn. Wat er in je lichaam',
        'geen losstaand onderdeel; het is de spiegel en de poort van uw algehele welzijn. Wat er in uw lichaam',
        1,
      ],
      ['gebeurt, zie je terug in je mond, en andersom!', 'gebeurt, ziet u terug in uw mond, en andersom!', 1],
      [
        'Om jou écht in je kracht te zetten, combineer ik de ijzersterke basis',
        'Om u écht in uw kracht te zetten, combineer ik de ijzersterke basis',
        1,
      ],
      ['Wel een laagdrempelige, holistische benadering\n            die je ogen opent.', 'Wel een laagdrempelige, holistische benadering\n            die uw ogen opent.', 1],
      // pioniers
      ["dan de oppervlakte en de échte oorzaak van je klachten wilt aanpakken.", 'dan de oppervlakte en de échte oorzaak van uw klachten wilt aanpakken.', 1],
      [
        "'en klaar bent voor bewuste, positieve stappen in je dagelijkse routine.',",
        "'en klaar bent voor bewuste, positieve stappen in uw dagelijkse routine.',",
        1,
      ],
      ["'in jouw eigen vrijheid en levenskwaliteit.'", "'in uw eigen vrijheid en levenskwaliteit.'", 1],
      ['Mijn aanbod is speciaal voor jou als je{', 'Mijn aanbod is speciaal voor u als u{', 1],
      [
        'klaar bent om de verantwoordelijkheid over je eigen gezondheid weer in eigen handen te nemen',
        'klaar bent om de verantwoordelijkheid over uw eigen gezondheid weer in eigen handen te nemen',
        1,
      ],
      [
        'ze ontstaan wanneer jij besluit de regie te pakken.',
        'ze ontstaan wanneer u besluit de regie te pakken.',
        1,
      ],
      ['maar om jouw gids te zijn naar een duurzame', 'maar om uw gids te zijn naar een duurzame', 1],
      ['Wij zijn een match als jij:', 'Wij zijn een match als u:', 1],
      [
        'Herken jij die vonk in jezelf? Dan sta ik met al mijn ervaring en passie klaar om samen met jou de weg te',
        'Herkent u die vonk in uzelf? Dan sta ik met al mijn ervaring en passie klaar om samen met u de weg te',
        1,
      ],
      // contact en voet
      ['Een vraag over je mond, een kennismaking inplannen', 'Een vraag over uw mond, een kennismaking inplannen', 1],
      [
        'Gegevens uit het formulier gebruik ik alleen om je vraag te beantwoorden',
        'Gegevens uit het formulier gebruik ik alleen om uw vraag te beantwoorden',
        1,
      ],
      // commentaar: de voetnoot over het tweede document
      ['eerste gaat over deze website, de tweede over je patientendossier.', 'eerste gaat over deze website, de tweede over uw patientendossier.', 1],
    ],
  ],

  [
    'src/specialisaties.tsx',
    [
      ["samenvatting: 'Wat je in je mond stopt, bepaalt de basis.'", "samenvatting: 'Wat u in uw mond stopt, bepaalt de basis.'", 1],
      [
        "'Natuurlijke voeding bouwt je mond- en darmflora op, terwijl roken het microbioom juist volledig verwoest. Roken vernauwt de bloedvaten in je tandvlees,",
        "'Natuurlijke voeding bouwt uw mond- en darmflora op, terwijl roken het microbioom juist volledig verwoest. Roken vernauwt de bloedvaten in uw tandvlees,",
        1,
      ],
      [
        "samenvatting: 'Rust, ademhaling en beweging zijn de herstelmotoren van je mond.'",
        "samenvatting: 'Rust, ademhaling en beweging zijn de herstelmotoren van uw mond.'",
        1,
      ],
      [
        'Ze bepalen hoeveel herstel je mond krijgt en hoeveel spanning erin blijft zitten.',
        'Ze bepalen hoeveel herstel uw mond krijgt en hoeveel spanning erin blijft zitten.',
        1,
      ],
      [
        'Nachtrust en ademhaling zijn de ultieme herstelmotoren voor je mond.',
        'Nachtrust en ademhaling zijn de ultieme herstelmotoren voor uw mond.',
        1,
      ],
      [
        'Goede slaap en een gezonde neusademhaling beschermen je gebit en je energieniveau.',
        'Goede slaap en een gezonde neusademhaling beschermen uw gebit en uw energieniveau.',
        1,
      ],
      [
        "samenvatting: 'Dit is de spirituele en emotionele motor van je welzijn (jouw ikigai).'",
        "samenvatting: 'Dit is de spirituele en emotionele motor van uw welzijn (uw ikigai).'",
        1,
      ],
      [
        "'Wanneer je leeft met een duidelijk doel en zingeving ervaart, zorg je automatisch beter voor jezelf. Het geeft je de motivatie om de verantwoordelijkheid voor je eigen gezondheid en vrijheid écht te dragen.'",
        "'Wanneer u leeft met een duidelijk doel en zingeving ervaart, zorgt u automatisch beter voor uzelf. Het geeft u de motivatie om de verantwoordelijkheid voor uw eigen gezondheid en vrijheid écht te dragen.'",
        1,
      ],
      [
        "samenvatting: 'Plantenkracht in plaats van agressieve chemie, en de signalen die je lichaam zelf afgeeft.'",
        "samenvatting: 'Plantenkracht in plaats van agressieve chemie, en de signalen die uw lichaam zelf afgeeft.'",
        1,
      ],
      [
        "'Je lichaam vertelt zelf waar de disbalans zit, en de natuur levert het middel om er iets aan te doen.",
        "'Uw lichaam vertelt zelf waar de disbalans zit, en de natuur levert het middel om er iets aan te doen.",
        1,
      ],
      [
        'lezen we de diepere signalen van je organen en je energiebanen (Qi).',
        'lezen we de diepere signalen van uw organen en uw energiebanen (Qi).',
        1,
      ],
      [
        "'Het ondersteunen van je mondhygiëne met zuivere plantenkracht",
        "'Het ondersteunen van uw mondhygiëne met zuivere plantenkracht",
        1,
      ],
      [
        "'De praktische vertaling van al deze pijlers naar simpele, effectieve rituelen in jouw badkamer en dagelijkse leven.'",
        "'De praktische vertaling van al deze pijlers naar simpele, effectieve rituelen in uw badkamer en dagelijkse leven.'",
        1,
      ],
      [
        "'Hier komt alles samen: wat je eet, hoe je slaapt en wat je gebruikt, terug te zien in wat je elke ochtend en avond doet. Kleine rituelen die je vol kunt houden, in plaats van een lijst die je na een week weer loslaat.'",
        "'Hier komt alles samen: wat u eet, hoe u slaapt en wat u gebruikt, terug te zien in wat u elke ochtend en avond doet. Kleine rituelen die u vol kunt houden, in plaats van een lijst die u na een week weer loslaat.'",
        1,
      ],
    ],
  ],

  [
    'src/privacy.tsx',
    [
      ['Deze site plaatst geen cookies en maakt geen profiel van je.', 'Deze site plaatst geen cookies en maakt geen profiel van u.', 1],
      ['Hoe ik met je gegevens omga', 'Hoe ik met uw gegevens omga', 1],
      [
        'zodat je browser daar niets hoeft op te halen.',
        'zodat uw browser daar niets hoeft op te halen.',
        1,
      ],
      [
        'Er wordt niets op je apparaat gezet, er wordt geen profiel van je gemaakt en je wordt niet over andere websites heen gevolgd.',
        'Er wordt niets op uw apparaat gezet, er wordt geen profiel van u gemaakt en u wordt niet over andere websites heen gevolgd.',
        1,
      ],
      [
        'Omdat er niets op je apparaat wordt opgeslagen, valt er hier ook niets te weigeren of aan te vinken. Dat is de reden dat je geen scherm met schuifjes krijgt voordat je de site kunt lezen.',
        'Omdat er niets op uw apparaat wordt opgeslagen, valt er hier ook niets te weigeren of aan te vinken. Dat is de reden dat u geen scherm met schuifjes krijgt voordat u de site kunt lezen.',
        1,
      ],
      ["kop: 'Wat je browser wel bewaart'", "kop: 'Wat uw browser wel bewaart'", 1],
      [
        "'Precies een ding: dat je de melding onderaan hebt weggeklikt. Dat staat in de opslag van je eigen browser, het bevat geen nummer waaraan jij te herkennen bent, en het wordt nooit naar ons of naar iemand anders verstuurd. Wis je je browsergegevens, dan is het weg en verschijnt de melding opnieuw.'",
        "'Precies een ding: dat u de melding onderaan hebt weggeklikt. Dat staat in de opslag van uw eigen browser, het bevat geen nummer waaraan u te herkennen bent, en het wordt nooit naar ons of naar iemand anders verstuurd. Wist u uw browsergegevens, dan is het weg en verschijnt de melding opnieuw.'",
        1,
      ],
      [
        "'Vul je het formulier in, dan vraag ik om je naam, je e-mailadres, eventueel je telefoonnummer, waar je vraag over gaat en je bericht zelf. Je telefoonnummer is niet verplicht.'",
        "'Vult u het formulier in, dan vraag ik om uw naam, uw e-mailadres, eventueel uw telefoonnummer, waar uw vraag over gaat en uw bericht zelf. Uw telefoonnummer is niet verplicht.'",
        1,
      ],
      [
        "'Die gegevens gebruik ik om je vraag te beantwoorden en contact met je op te nemen, en voor niets anders.",
        "'Die gegevens gebruik ik om uw vraag te beantwoorden en contact met u op te nemen, en voor niets anders.",
        1,
      ],
      [
        'Ik bewaar ze niet langer dan nodig is om je vraag af te handelen; daarna gaan ze weg.',
        'Ik bewaar ze niet langer dan nodig is om uw vraag af te handelen; daarna gaan ze weg.',
        1,
      ],
      [
        "'Word je patient, dan komt je dossier in de administratie van de praktijk terecht",
        "'Wordt u patient, dan komt uw dossier in de administratie van de praktijk terecht",
        1,
      ],
      ["'Je hoeft het formulier niet te gebruiken: bellen of mailen kan ook.'", "'U hoeft het formulier niet te gebruiken: bellen of mailen kan ook.'", 1],
      [
        'en naar de agenda waarin je een kennismaking plant. Die openen in een nieuw tabblad. Vanaf het moment dat je daarop klikt ben je op de site van dat bedrijf, en gelden hun voorwaarden en hun cookies. Daar heb ik geen invloed op. Zolang je niet klikt, weten zij niet dat je hier bent geweest.',
        'en naar de agenda waarin u een kennismaking plant. Die openen in een nieuw tabblad. Vanaf het moment dat u daarop klikt bent u op de site van dat bedrijf, en gelden hun voorwaarden en hun cookies. Daar heb ik geen invloed op. Zolang u niet klikt, weten zij niet dat u hier bent geweest.',
        1,
      ],
      ["kop: 'Je rechten'", "kop: 'Uw rechten'", 1],
      [
        "'Je mag altijd vragen welke gegevens ik van je heb, ze laten verbeteren, laten verwijderen of bezwaar maken tegen het gebruik ervan.",
        "'U mag altijd vragen welke gegevens ik van u heb, ze laten verbeteren, laten verwijderen of bezwaar maken tegen het gebruik ervan.",
        1,
      ],
      [
        "'Kom je er met mij niet uit, dan kun je een klacht indienen bij de Autoriteit Persoonsgegevens.'",
        "'Komt u er met mij niet uit, dan kunt u een klacht indienen bij de Autoriteit Persoonsgegevens.'",
        1,
      ],
      [
        "'Deze website plaatst geen cookies en maakt geen profiel van bezoekers. Wat er met de gegevens uit het contactformulier gebeurt, en welke rechten je hebt.';",
        "'Deze website plaatst geen cookies en maakt geen profiel van bezoekers. Wat er met de gegevens uit het contactformulier gebeurt, en welke rechten u hebt.';",
        1,
      ],
      ['JOUW GEGEVENS', 'UW GEGEVENS', 1],
      [
        'Kort gezegd: deze site zet geen cookies, maakt geen profiel van je en deelt niets met anderen. Wat je zelf\n            invult in het contactformulier gebruik ik alleen om je vraag te beantwoorden.',
        'Kort gezegd: deze site zet geen cookies, maakt geen profiel van u en deelt niets met anderen. Wat u zelf\n            invult in het contactformulier gebruik ik alleen om uw vraag te beantwoorden.',
        1,
      ],
      [
        'Er wordt niets op je apparaat opgeslagen en er wordt geen profiel van je gemaakt. Wat je hier\n            leest blijft van jou, tot je zelf een bericht stuurt.',
        'Er wordt niets op uw apparaat opgeslagen en er wordt geen profiel van u gemaakt. Wat u hier\n            leest blijft van u, tot u zelf een bericht stuurt.',
        1,
      ],
      [
        'Ben je patient? Dan gaat het over je dossier en niet over deze site.',
        'Bent u patient? Dan gaat het over uw dossier en niet over deze site.',
        1,
      ],
      ['Wie je hiervoor hebt', 'Wie u hiervoor hebt', 1],
      // commentaar
      ['Ben je patient, dan is het', 'Bent u patient, dan is het', 1],
      ['andere document het document dat je zoekt', 'andere document het document dat u zoekt', 1],
    ],
  ],

  [
    'src/privacyverklaring.tsx',
    [
      [
        "'Wat ik als mondhygienist van je vastleg, waarom, wie er verder bij kan en hoe lang ik het bewaar.",
        "'Wat ik als mondhygienist van u vastleg, waarom, wie er verder bij kan en hoe lang ik het bewaar.",
        1,
      ],
      [
        'Kort gezegd: ik leg alleen vast wat ik nodig heb om je te kunnen behandelen. Ik ben de enige die bij je',
        'Kort gezegd: ik leg alleen vast wat ik nodig heb om u te kunnen behandelen. Ik ben de enige die bij uw',
        1,
      ],
      [
        'dossier kan. Ik declareer niet bij je verzekeraar, verstuur geen nieuwsbrieven en verkoop niets door. Met',
        'dossier kan. Ik declareer niet bij uw verzekeraar, verstuur geen nieuwsbrieven en verkoop niets door. Met',
        1,
      ],
      ['je tandarts wissel ik alleen iets uit als jij daar toestemming voor geeft.', 'uw tandarts wissel ik alleen iets uit als u daar toestemming voor geeft.', 1],
      [
        'Ik behandel je in een ruimte die ik huur bij Mondzorg Schagen. Je bent patient van mij en niet van die',
        'Ik behandel u in een ruimte die ik huur bij Mondzorg Schagen. U bent patient van mij en niet van die',
        1,
      ],
      ['praktijk, en zij kunnen niet bij je dossier.', 'praktijk, en zij kunnen niet bij uw dossier.', 1],
      ['Deze verklaring gaat over je dossier als patient.', 'Deze verklaring gaat over uw dossier als patient.', 1],
      ['Wat je op het intakeformulier tekent', 'Wat u op het intakeformulier tekent', 1],
      [
        'Bij je eerste afspraak krijg je deze verklaring en een intakeformulier. Daarop staan drie vinkjes. Het',
        'Bij uw eerste afspraak krijgt u deze verklaring en een intakeformulier. Daarop staan drie vinkjes. Het',
        1,
      ],
      [
        'eerste is een bevestiging dat je deze verklaring gehad hebt. De andere twee zijn toestemming, en die zijn',
        'eerste is een bevestiging dat u deze verklaring gehad hebt. De andere twee zijn toestemming, en die zijn',
        1,
      ],
      ['vrij: je wordt ook zonder gewoon behandeld.', 'vrij: u wordt ook zonder gewoon behandeld.', 1],
      // commentaar
      ['intakeformulier, kan dat hier teruglezen zonder iets te downloaden.', 'intakeformulier, kan dat hier teruglezen zonder iets te downloaden.', 1],
    ],
  ],

  [
    'src/verklaring-tekst.js',
    [
      // de regel bovenaan over de aanspreekvorm
      [
        ` * AANSPREEKVORM: je, niet u. Het model gebruikt u, maar haar hele site staat in
 * je, inclusief de bestaande privacypagina die al over het patientendossier
 * schrijft. Twee documenten van dezelfde praktijk die de patient anders
 * aanspreken leest raar. Juridisch maakt het niets uit.`,
        ` * AANSPREEKVORM: u, niet je. Dit stond eerst in je, omdat de rest van de site
 * dat deed. Marjon vroeg op 28 sep 2026 via Armando om de HELE site in u, en
 * daarmee ook dit document: het gaat naar haar patienten en zij spreekt die met
 * u aan. De hele site is in dezelfde ronde omgezet, dus de verklaring en de
 * paginas eromheen spreken de patient hetzelfde aan. Juridisch maakt het niets
 * uit. Let op: de praktijknaam blijft "Bewust gezond in je mond", dat is haar
 * merknaam en staat zo bij de KvK.`,
        1,
      ],
      [
        "  'Bij een mondhygienist leg je dingen op tafel die niet veel persoonlijker worden: je gezondheid, je medicijnen, je mond. In deze verklaring staat wat ik van je vastleg, waarom ik dat doe, wie er verder bij kan en wat je daaraan kunt veranderen.';",
        "  'Bij een mondhygienist legt u dingen op tafel die niet veel persoonlijker worden: uw gezondheid, uw medicijnen, uw mond. In deze verklaring staat wat ik van u vastleg, waarom ik dat doe, wie er verder bij kan en wat u daaraan kunt veranderen.';",
        1,
      ],
      [
        "rijen: ['Je naam, adres en woonplaats', 'Je geboortedatum', 'Je telefoonnummer', 'Je e-mailadres'],",
        "rijen: ['Uw naam, adres en woonplaats', 'Uw geboortedatum', 'Uw telefoonnummer', 'Uw e-mailadres'],",
        1,
      ],
      ["'Je burgerservicenummer (BSN)',", "'Uw burgerservicenummer (BSN)',", 1],
      ["'Gegevens over je gezondheid',", "'Gegevens over uw gezondheid',", 1],
      ["'Welke medicijnen je gebruikt',", "'Welke medicijnen u gebruikt',", 1],
      ['"Foto\'s van je mond",', '"Foto\'s van uw mond",', 1],
      [
        'In deze verklaring lees je hoe ik in mijn praktijk met jouw gegevens omga en hoe die beschermd zijn.`',
        'In deze verklaring leest u hoe ik in mijn praktijk met uw gegevens omga en hoe die beschermd zijn.`',
        1,
      ],
      [
        "          'je gegevens alleen gebruik voor het doel waarvoor je ze gegeven hebt. Die doelen staan in hoofdstuk 2.',",
        "          'uw gegevens alleen gebruik voor het doel waarvoor u ze gegeven hebt. Die doelen staan in hoofdstuk 2.',",
        1,
      ],
      [
        "          'maatregelen heb genomen om je gegevens te beveiligen. Die staan in hoofdstuk 5.',",
        "          'maatregelen heb genomen om uw gegevens te beveiligen. Die staan in hoofdstuk 5.',",
        1,
      ],
      [
        "          'je gegevens niet aan anderen geef, tenzij dat nodig is voor die doelen of de wet mij daartoe verplicht.',",
        "          'uw gegevens niet aan anderen geef, tenzij dat nodig is voor die doelen of de wet mij daartoe verplicht.',",
        1,
      ],
      [
        "          'weet welke rechten je hebt, die respecteer en je erover vertel.',",
        "          'weet welke rechten u hebt, die respecteer en u erover vertel.',",
        1,
      ],
      [
        'Ik ben dus zelf verantwoordelijk voor wat er met je gegevens gebeurt, en ik ben ook degene bij wie je terecht kunt met een vraag of een verzoek.',
        'Ik ben dus zelf verantwoordelijk voor wat er met uw gegevens gebeurt, en ik ben ook degene bij wie u terecht kunt met een vraag of een verzoek.',
        1,
      ],
      [
        "{t: 'kopje', v: 'Waarom je bij een andere praktijk naar binnen loopt'},",
        "{t: 'kopje', v: 'Waarom u bij een andere praktijk naar binnen loopt'},",
        1,
      ],
      [
        'v: `Ik behandel je in een ruimte die ik huur bij Mondzorg Schagen aan de Noord 22.',
        'v: `Ik behandel u in een ruimte die ik huur bij Mondzorg Schagen aan de Noord 22.',
        1,
      ],
      [
        'Ik werk niet voor hen en zij niet voor mij. Je bent patient van ${PRAKTIJK} en niet van Mondzorg Schagen.`',
        'Ik werk niet voor hen en zij niet voor mij. U bent patient van ${PRAKTIJK} en niet van Mondzorg Schagen.`',
        1,
      ],
      [
        "'Voor je gegevens betekent dat het volgende: ik houd mijn eigen dossier bij, in mijn eigen administratie, en Mondzorg Schagen kan daar niet bij. Zij zien je in de wachtkamer, maar zij zien je dossier niet. Andersom kan ik niet bij hun dossiers. Wil je dat ik iets met een behandelaar daar overleg, dan vraag ik je daar eerst toestemming voor, net als bij je tandarts.'",
        "'Voor uw gegevens betekent dat het volgende: ik houd mijn eigen dossier bij, in mijn eigen administratie, en Mondzorg Schagen kan daar niet bij. Zij zien u in de wachtkamer, maar zij zien uw dossier niet. Andersom kan ik niet bij hun dossiers. Wilt u dat ik iets met een behandelaar daar overleg, dan vraag ik u daar eerst toestemming voor, net als bij uw tandarts.'",
        1,
      ],
      ["kop: 'Waarvoor ik je gegevens gebruik',", "kop: 'Waarvoor ik uw gegevens gebruik',", 1],
      ["v: 'Ik gebruik je gegevens voor twee dingen:'", "v: 'Ik gebruik uw gegevens voor twee dingen:'", 1],
      [
        "          'Een behandelovereenkomst met je aangaan en je behandelen. Daar hoort bij dat ik je dossier bijhoud en dat ik je een factuur stuur.',",
        "          'Een behandelovereenkomst met u aangaan en u behandelen. Daar hoort bij dat ik uw dossier bijhoud en dat ik u een factuur stuur.',",
        1,
      ],
      ["          'Contact met je houden over je afspraken.',", "          'Contact met u houden over uw afspraken.',", 1],
      [
        'je krijgt de factuur rechtstreeks van mij en regelt zelf wat je verzekering daarvan vergoedt.',
        'u krijgt de factuur rechtstreeks van mij en regelt zelf wat uw verzekering daarvan vergoedt.',
        1,
      ],
      [
        "'De gegevens in de rechterkolom zijn gevoeliger dan de andere. Zonder die gegevens kan ik je niet behandelen. Wil je ze niet geven, dan kan de behandelovereenkomst niet tot stand komen en kan ik je niet als patient inschrijven.'",
        "'De gegevens in de rechterkolom zijn gevoeliger dan de andere. Zonder die gegevens kan ik u niet behandelen. Wilt u ze niet geven, dan kan de behandelovereenkomst niet tot stand komen en kan ik u niet als patient inschrijven.'",
        1,
      ],
      [
        "'Je BSN heb ik nodig om zeker te weten wie je bent. Dat je mij over je gezondheid en je medicijnen vertelt is geen beleefdheid maar een wettelijke plicht:",
        "'Uw BSN heb ik nodig om zeker te weten wie u bent. Dat u mij over uw gezondheid en uw medicijnen vertelt is geen beleefdheid maar een wettelijke plicht:",
        1,
      ],
      ['{t: \'kopje\', v: "Foto\'s van je mond"},', '{t: \'kopje\', v: "Foto\'s van uw mond"},', 1],
      [
        'v: "Foto\'s die ik in je mond maak horen bij je dossier en gebruik ik alleen daarvoor: om te zien hoe iets ervoor staat en om het je te laten zien. Ze gaan niet op mijn website en niet op sociale media. Zou ik ooit zo\'n foto buiten je dossier willen gebruiken, dan vraag ik je daar apart om toestemming voor. Die toestemming staat los van je behandeling en je mag altijd nee zeggen.",',
        'v: "Foto\'s die ik in uw mond maak horen bij uw dossier en gebruik ik alleen daarvoor: om te zien hoe iets ervoor staat en om het u te laten zien. Ze gaan niet op mijn website en niet op sociale media. Zou ik ooit zo\'n foto buiten uw dossier willen gebruiken, dan vraag ik u daar apart om toestemming voor. Die toestemming staat los van uw behandeling en u mag altijd nee zeggen.",',
        1,
      ],
      [
        "'Vanaf zestien jaar schrijf je jezelf in. Ben je jonger, dan leg ik pas gegevens vast nadat een ouder, verzorger of wettelijk vertegenwoordiger daar schriftelijk toestemming voor heeft gegeven.",
        "'Vanaf zestien jaar schrijft u uzelf in. Bent u jonger, dan leg ik pas gegevens vast nadat een ouder, verzorger of wettelijk vertegenwoordiger daar schriftelijk toestemming voor heeft gegeven.",
        1,
      ],
      ["kop: 'Wie er verder bij je gegevens kan',", "kop: 'Wie er verder bij uw gegevens kan',", 1],
      [
        "'Ik geef je gegevens alleen aan anderen als dat nodig is voor de doelen hierboven,",
        "'Ik geef uw gegevens alleen aan anderen als dat nodig is voor de doelen hierboven,",
        1,
      ],
      ['Daarin staat wat zij met je gegevens mogen en hoe zij die beveiligen.', 'Daarin staat wat zij met uw gegevens mogen en hoe zij die beveiligen.', 1],
      [
        'Mijn websitebouwer kan dus niet bij je dossier. Verandert dat ooit, bijvoorbeeld als je online een afspraak kunt maken,',
        'Mijn websitebouwer kan dus niet bij uw dossier. Verandert dat ooit, bijvoorbeeld als u online een afspraak kunt maken,',
        1,
      ],
      [
        'zij houden geen administratie voor mij bij en kunnen niet bij je dossier.',
        'zij houden geen administratie voor mij bij en kunnen niet bij uw dossier.',
        1,
      ],
      ["{t: 'kopje', v: 'Je tandarts'},", "{t: 'kopje', v: 'Uw tandarts'},", 1],
      [
        "'Je mond wordt er beter van als je tandarts en ik weten wat de ander ziet. Maar dat gebeurt alleen als jij daar toestemming voor geeft. Die toestemming geef je op het intakeformulier, met de naam van je tandarts erbij, en je kunt hem op elk moment weer intrekken. Geef je hem niet, dan behandel ik je gewoon.'",
        "'Uw mond wordt er beter van als uw tandarts en ik weten wat de ander ziet. Maar dat gebeurt alleen als u daar toestemming voor geeft. Die toestemming geeft u op het intakeformulier, met de naam van uw tandarts erbij, en u kunt hem op elk moment weer intrekken. Geeft u hem niet, dan behandel ik u gewoon.'",
        1,
      ],
      [
        'Je dossier, uitslagen en klachten over je gezondheid stuur ik daar niet doorheen.',
        'Uw dossier, uitslagen en klachten over uw gezondheid stuur ik daar niet doorheen.',
        1,
      ],
      [
        'WhatsApp is van Meta en je bericht loopt over hun servers, buiten Europa. Wil je iets bespreken wat over je gezondheid gaat, bel me dan of bewaar het voor in de stoel.',
        'WhatsApp is van Meta en uw bericht loopt over hun servers, buiten Europa. Wilt u iets bespreken wat over uw gezondheid gaat, bel me dan of bewaar het voor in de stoel.',
        1,
      ],
      [
        'En alles wat buiten de doelen uit hoofdstuk 2 valt doe ik alleen als jij daar toestemming voor hebt gegeven.',
        'En alles wat buiten de doelen uit hoofdstuk 2 valt doe ik alleen als u daar toestemming voor hebt gegeven.',
        1,
      ],
      ["kop: 'Hoe lang ik je gegevens bewaar',", "kop: 'Hoe lang ik uw gegevens bewaar',", 1],
      [
        "'Je dossier bewaar ik zolang je bij mij ingeschreven staat, en daarna nog twintig jaar.",
        "'Uw dossier bewaar ik zolang u bij mij ingeschreven staat, en daarna nog twintig jaar.",
        1,
      ],
      [
        'en die is er om jou te beschermen: is er later iets met je mond, dan is terug te zien wat er ooit gedaan is.',
        'en die is er om u te beschermen: is er later iets met uw mond, dan is terug te zien wat er ooit gedaan is.',
        1,
      ],
      [
        "'Je mag vragen om je dossier te vernietigen. Dat doe ik dan binnen drie maanden.",
        "'U mag vragen om uw dossier te vernietigen. Dat doe ik dan binnen drie maanden.",
        1,
      ],
      [
        'of als het bewaren van aanmerkelijk belang is voor iemand anders dan jij.',
        'of als het bewaren van aanmerkelijk belang is voor iemand anders dan u.',
        1,
      ],
      [
        "'Andere gegevens die ik voor de praktijk nodig heb bewaar ik zolang je ingeschreven staat.",
        "'Andere gegevens die ik voor de praktijk nodig heb bewaar ik zolang u ingeschreven staat.",
        1,
      ],
      ["kop: 'Hoe je gegevens beveiligd zijn',", "kop: 'Hoe uw gegevens beveiligd zijn',", 1],
      [
        "{t: 'p', v: 'Dit is wat ik doe om je gegevens te beschermen tegen verlies en tegen gebruik waar ze niet voor bedoeld zijn.'},",
        "{t: 'p', v: 'Dit is wat ik doe om uw gegevens te beschermen tegen verlies en tegen gebruik waar ze niet voor bedoeld zijn.'},",
        1,
      ],
      [
        "          'Ik houd je dossier bij in een patientenadministratie waarmee ik een verwerkersovereenkomst heb,",
        "          'Ik houd uw dossier bij in een patientenadministratie waarmee ik een verwerkersovereenkomst heb,",
        1,
      ],
      ["          'Je dossier houd ik zo actueel mogelijk.',", "          'Uw dossier houd ik zo actueel mogelijk.',", 1],
      [
        "          'Per e-mail en WhatsApp gaan alleen afspraken. Je dossier en je medische gegevens gaan daar niet doorheen.',",
        "          'Per e-mail en WhatsApp gaan alleen afspraken. Uw dossier en uw medische gegevens gaan daar niet doorheen.',",
        1,
      ],
      [
        "          'Gaat er ondanks alles toch iets mis met je gegevens, dan werk ik volgens het protocol meldplicht datalekken van NVM-mondhygienisten. Raakt het jou, dan hoor je dat van mij.',",
        "          'Gaat er ondanks alles toch iets mis met uw gegevens, dan werk ik volgens het protocol meldplicht datalekken van NVM-mondhygienisten. Raakt het u, dan hoort u dat van mij.',",
        1,
      ],
      ["    kop: 'Je rechten',", "    kop: 'Uw rechten',", 1],
      [
        "'Je hebt recht op inzage in je gegevens en in je dossier. Je mag ze laten verbeteren als er iets niet klopt, en je mag vragen ze te laten vernietigen. Je hebt ook het recht je gegevens te laten overdragen aan jezelf of aan een andere zorgverlener. Ik vraag je in al die gevallen om je te legitimeren, want ik wil zeker weten dat jij het bent.'",
        "'U hebt recht op inzage in uw gegevens en in uw dossier. U mag ze laten verbeteren als er iets niet klopt, en u mag vragen ze te laten vernietigen. U hebt ook het recht uw gegevens te laten overdragen aan uzelf of aan een andere zorgverlener. Ik vraag u in al die gevallen om u te legitimeren, want ik wil zeker weten dat u het bent.'",
        1,
      ],
      [
        "'Bij het vernietigen van je dossier hoort een waarschuwing. Zonder je medische voorgeschiedenis kan ik geen goede diagnose stellen en kan ik je veiligheid niet garanderen. Het kan dus betekenen dat ik je daarna niet meer kan behandelen.'",
        "'Bij het vernietigen van uw dossier hoort een waarschuwing. Zonder uw medische voorgeschiedenis kan ik geen goede diagnose stellen en kan ik uw veiligheid niet garanderen. Het kan dus betekenen dat ik u daarna niet meer kan behandelen.'",
        1,
      ],
      [
        "'Heb je ergens toestemming voor gegeven, bijvoorbeeld voor het uitwisselen met je tandarts, dan mag je die altijd weer intrekken.'",
        "'Hebt u ergens toestemming voor gegeven, bijvoorbeeld voor het uitwisselen met uw tandarts, dan mag u die altijd weer intrekken.'",
        1,
      ],
      [
        'v: `Ik doe er alles aan om je gegevens goed te beschermen. Heb je een vraag, of ben je niet tevreden over hoe ik ermee omga, zeg het me dan. Bel ${TEL_V} of mail ${MAIL_V}. Ik probeer er samen met je uit te komen.`,',
        'v: `Ik doe er alles aan om uw gegevens goed te beschermen. Hebt u een vraag, of bent u niet tevreden over hoe ik ermee omga, zeg het me dan. Bel ${TEL_V} of mail ${MAIL_V}. Ik probeer er samen met u uit te komen.`,',
        1,
      ],
      [
        "'Kom je er met mij niet uit, dan kun je terecht bij de klachtenregeling van NVM-mondhygienisten.",
        "'Komt u er met mij niet uit, dan kunt u terecht bij de klachtenregeling van NVM-mondhygienisten.",
        1,
      ],
      ["'En je kunt altijd een klacht indienen bij de Autoriteit Persoonsgegevens.", "'En u kunt altijd een klacht indienen bij de Autoriteit Persoonsgegevens.", 1],
      [
        "    onder: 'Vrijwillig. Laat je dit leeg, dan word je gewoon behandeld en hoor je alleen over je afspraken.',",
        "    onder: 'Vrijwillig. Laat u dit leeg, dan wordt u gewoon behandeld en hoort u alleen over uw afspraken.',",
        1,
      ],
      [
        "    onder: 'Vrijwillig, en altijd weer in te trekken. Vul de naam van je tandarts in op de regel erachter.',",
        "    onder: 'Vrijwillig, en altijd weer in te trekken. Vul de naam van uw tandarts in op de regel erachter.',",
        1,
      ],
      // commentaar in de kop dat de patient aanspreekt
      ['die zij niet doet. Op 28 sep 2026 beantwoordde zij alle 17 vragen van', 'die zij niet doet. Op 28 sep 2026 beantwoordde zij alle 17 vragen van', 1],
    ],
  ],

  [
    'index.html',
    [
      [
        'Die factoren bepalen mee hoe je tandvlees erbij staat.',
        'Die factoren bepalen mee hoe uw tandvlees erbij staat.',
        1,
      ],
      [
        'Je lichaam is er continu energie aan kwijt, ook als je er zelf weinig van merkt. Dat merk je onder andere aan je herstel.',
        'Uw lichaam is er continu energie aan kwijt, ook als u er zelf weinig van merkt. Dat merkt u onder andere aan uw herstel.',
        1,
      ],
      [
        'hoe je voeding en essentiële olie laagdrempelig verweeft in je dag.',
        'hoe u voeding en essentiële olie laagdrempelig verweeft in uw dag.',
        1,
      ],
      ['Interesse kun je nu al doorgeven via het contactformulier.', 'Interesse kunt u nu al doorgeven via het contactformulier.', 1],
    ],
  ],
];

let totaal = 0;
const problemen = [];
const uit = new Map();

/* De bestanden in dit project staan met CRLF op de schijf. Een zin die over twee
   regels loopt moet dus ook met CRLF gezocht en teruggeschreven worden, anders
   vindt hij niets (of hij zet er een losse LF tussen). */
const regels = (s, crlf) => (crlf ? s.replace(/\r?\n/g, '\r\n') : s.replace(/\r\n/g, '\n'));

for (const [bestand, paren] of WERK) {
  const pad = R(bestand);
  let t = fs.readFileSync(pad, 'utf8');
  const crlf = t.includes('\r\n');
  for (let [van, naar, hoeveel] of paren) {
    van = regels(van, crlf);
    naar = regels(naar, crlf);
    const n = t.split(van).length - 1;
    if (n !== hoeveel) {
      problemen.push(`${bestand}: ${n}x gevonden, ${hoeveel}x verwacht -> ${van.slice(0, 70)}`);
      continue;
    }
    t = t.split(van).join(naar);
    totaal += n;
  }
  uit.set(pad, t);
}

if (problemen.length) {
  console.log('NIETS AANGEPAST. Deze regels kloppen niet:\n' + problemen.join('\n'));
  process.exit(1);
}

for (const [pad, t] of uit) fs.writeFileSync(pad, t);
console.log(`${totaal} zinnen omgezet in ${uit.size} bestanden.`);
