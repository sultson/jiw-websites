/**
 * Alle vaste tekst van de site, in het Engels, Nederlands en Papiamentu.
 *
 * Koppen die uit twee stukken bestaan (recht plus cursief) staan hier ook als
 * twee stukken, zodat de cursieve staart in elke taal op een woord valt waar
 * hij ook echt hoort en niet op een letterlijke vertaling.
 *
 * Papiamentu is geschreven in de spelling van Curacao en Bonaire (de
 * fonologische, met k in plaats van c). Eigennamen van de stichtingen blijven
 * staan zoals ze in het register staan; plaatsnamen krijgen wel hun eigen vorm,
 * dus Boneiru, Korsou en Hulanda.
 */

import type {Tekst} from './taal';

const T = {
  /* ---------------------------------------------------------------- header */
  merk: {
    onder: {
      en: 'Diaspora Of Africa Foundations',
      nl: 'Diaspora Of Africa Foundations',
      pap: 'Diaspora Of Africa Foundations',
    },
    naarHome: {
      en: '3 Diaspora, to the home page',
      nl: '3 Diaspora, naar de startpagina',
      pap: '3 Diaspora, bai na e página prinsipal',
    },
  },
  menu: {
    label: {en: 'Main menu', nl: 'Hoofdmenu', pap: 'Menú prinsipal'},
    openen: {en: 'Open menu', nl: 'Menu openen', pap: 'Habri menú'},
    sluiten: {en: 'Close menu', nl: 'Menu sluiten', pap: 'Sera menú'},
    bonaire: {en: 'Bonaire', nl: 'Bonaire', pap: 'Boneiru'},
    curacao: {en: 'Curaçao', nl: 'Curaçao', pap: 'Kòrsou'},
    nederland: {en: 'The Netherlands', nl: 'Nederland', pap: 'Hulanda'},
    agenda: {en: 'Events', nl: 'Agenda', pap: 'Agenda'},
    galerij: {en: 'Gallery', nl: 'Galerij', pap: 'Galería'},
    contact: {en: 'Contact', nl: 'Contact', pap: 'Kontakto'},
    doneer: {en: 'Donate', nl: 'Doneer', pap: 'Doná'},
  },
  taal: {
    label: {en: 'Choose language', nl: 'Taal kiezen', pap: 'Skohe idioma'},
    en: {en: 'English', nl: 'Engels', pap: 'Ingles'},
    nl: {en: 'Dutch', nl: 'Nederlands', pap: 'Hulandes'},
    pap: {en: 'Papiamentu', nl: 'Papiaments', pap: 'Papiamentu'},
  },
  naarInhoud: {en: 'Skip to content', nl: 'Naar de inhoud', pap: 'Bai na e kontenido'},

  /* Alleen voor een schermlezer. Op het scherm staan er cijfers en verder
     niets; wie de pagina hoort in plaats van ziet krijgt er dit bij, anders is
     het een rij losse getallen zonder betekenis. */
  aftellen: {
    opent: {en: 'The site opens in', nl: 'De site gaat open over', pap: 'E sitio ta habri den'},
    dag: {en: 'days', nl: 'dagen', pap: 'dia'},
    uur: {en: 'hours', nl: 'uur', pap: 'ora'},
    minuut: {en: 'minutes', nl: 'minuten', pap: 'minüt'},
    seconde: {en: 'seconds', nl: 'seconden', pap: 'sekònde'},
  },

  /* ------------------------------------------------------------------ hero */
  hero: {
    kicker: {
      en: 'Bonaire · Curaçao · The Netherlands',
      nl: 'Bonaire · Curaçao · Nederland',
      pap: 'Boneiru · Kòrsou · Hulanda',
    },
    titel: {
      en: 'Our story begins in Africa,',
      nl: 'Ons verhaal begint in Afrika,',
      pap: 'Nos historia ta kuminsá na Africa,',
    },
    titelCursief: {
      en: 'and it is not finished yet.',
      nl: 'en het is nog niet uitverteld.',
      pap: 'i ainda no a kaba di konta.',
    },
    lead: {
      en: 'Three foundations, one task. We research the history of slavery on the islands, bring that knowledge back to the schools and the neighbourhoods, and keep the African heritage of the Caribbean community alive.',
      nl: 'Drie stichtingen, één opdracht. Wij onderzoeken de slavernijgeschiedenis van de eilanden, brengen die kennis terug naar de scholen en de buurten, en houden het Afrikaanse erfgoed van de Caribische gemeenschap levend.',
      pap: 'Tres fundashon, un solo tarea. Nos ta investigá e historia di sklabitut di e islanan, ta hiba e konosementu ei bèk na e skolnan i e barionan, i ta mantené e herensia afrikano di e komunidat karibense bibu.',
    },
    steun: {en: 'Support our work', nl: 'Steun ons werk', pap: 'Sostené nos trabou'},
    kennis: {en: 'Get to know us', nl: 'Leer ons kennen', pap: 'Konosé nos'},
    beeldAlt: {
      en: 'The four numbered slave huts by the salt pans on the south coast of Bonaire, in the last of the sunlight',
      nl: 'De vier genummerde slavenhuisjes bij de zoutpannen op de zuidkust van Bonaire, in het laatste zonlicht',
      pap: 'E kuater kasnan numerá di katibu banda di e saliñanan na kosta zùit di Boneiru, den e último lus di solo',
    },
    bijschrift: {
      en: 'The numbered huts by the salt pans of Bonaire. This is where the people who harvested the salt by hand slept.',
      nl: 'De genummerde huisjes bij de zoutpannen van Bonaire. Hier sliepen de mensen die het zout met de hand oogstten.',
      pap: 'E kasnan numerá banda di e saliñanan di Boneiru. Akinan e hendenan ku tabata kosechá e salu ku man tabata drumi.',
    },
  },

  /* ---------------------------------------------------------- de stichtingen */
  drie: {
    kicker: {en: 'One platform', nl: 'Eén platform', pap: 'Un plataforma'},
    titel: {en: 'Three foundations,', nl: 'Drie stichtingen,', pap: 'Tres fundashon,'},
    titelCursief: {
      en: 'each with a face of its own',
      nl: 'elk met een eigen gezicht',
      pap: 'kada un ku su mes kara',
    },
    lead: {
      en: 'Bonaire, Curaçao and the Netherlands work on the same task, but each on its own ground and with its own board. On this site every foundation keeps its own page, its own colour and its own symbol.',
      nl: 'Bonaire, Curaçao en Nederland werken aan dezelfde opdracht, maar elk op eigen grond en met een eigen bestuur. Op deze site houdt elke stichting haar eigen pagina, haar eigen kleur en haar eigen teken.',
      pap: 'Boneiru, Kòrsou i Hulanda ta traha riba e mesun tarea, pero kada un riba su mes tera i ku su mes direktiva. Riba e sitio aki kada fundashon ta warda su mes página, su mes koló i su mes símbolo.',
    },
    bekijk: {en: 'Visit this foundation', nl: 'Bekijk deze stichting', pap: 'Mira e fundashon aki'},
    bekijkPagina: {en: 'Go to the page of', nl: 'Bekijk de pagina van', pap: 'Bai na e página di'},
  },

  /* ------------------------------------------------------------ wat we doen */
  doen: {
    kicker: {en: 'What we do', nl: 'Wat we doen', pap: 'Kiko nos ta hasi'},
    titel: {
      en: 'Research it, pass it on,',
      nl: 'Onderzoeken, doorgeven,',
      pap: 'Investigá, pasa aden,',
    },
    titelCursief: {en: 'keep it', nl: 'bewaren', pap: 'warda'},
    lead: {
      en: 'The statutes name a long list of tasks. In practice they fall into four kinds of work, and they hold each other up: without research there is no teaching material, without community there is no reach.',
      nl: 'De statuten noemen een lange reeks taken. In de praktijk vallen die uiteen in vier soorten werk, en ze hangen aan elkaar: zonder onderzoek geen lesmateriaal, zonder gemeenschap geen bereik.',
      pap: 'E statutonan ta menshoná un lista largu di tarea. Den práktika nan ta kai den kuater sorto di trabou, i nan ta wanta otro: sin investigashon no tin material di siñansa, sin komunidat no tin alkanse.',
    },
  },

  /* ------------------------------------------------------- missie en visie */
  missie: {
    kicker: {en: 'Mission and vision', nl: 'Missie en visie', pap: 'Mishon i vishon'},
    lead: {
      en: 'These two paragraphs are on the foundation’s own website, in their own words. We have left them as they are.',
      nl: 'Deze twee alinea’s staan in hun eigen woorden op de site van de stichting. Wij hebben ze vertaald en verder met rust gelaten.',
      pap: 'E dos alineanan aki ta pará ku nan mes palabra riba e sitio di e fundashon. Nos a tradusí nan i a laga nan asina.',
    },
    missieLabel: {en: 'Mission', nl: 'Missie', pap: 'Mishon'},
    visieLabel: {en: 'Vision', nl: 'Visie', pap: 'Vishon'},
    missie: {
      en: 'To represent and support the descendants of enslaved people by promoting historical research, community building, education and the preservation of culture, with particular attention to the bond between Africa and the islands.',
      nl: 'De nakomelingen van tot slaaf gemaakte mensen vertegenwoordigen en steunen, door historisch onderzoek, gemeenschapsopbouw, educatie en het behoud van cultuur te bevorderen, met bijzondere aandacht voor de band tussen Afrika en de eilanden.',
      pap: 'Representá i sostené e desendientenan di hendenan ku a wòrdu hasí katibu, dor di promové investigashon históriko, konstrukshon di komunidat, edukashon i konservashon di kultura, ku atenshon spesial pa e laso entre Africa i e islanan.',
    },
    visie: {
      en: 'To build an informed, resilient and united society that acknowledges its history, preserves its African heritage and works towards justice and sustainable development.',
      nl: 'Bouwen aan een geïnformeerde, veerkrachtige en verenigde samenleving die haar geschiedenis erkent, haar Afrikaanse erfgoed bewaart en werkt aan rechtvaardigheid en duurzame ontwikkeling.',
      pap: 'Konstruí un sosiedat informá, resiliente i uní ku ta rekonosé su historia, ta konservá su herensia afrikano i ta traha riba hustisia i desaroyo sostenibel.',
    },
  },

  /* --------------------------------------------------- taken uit de statuten */
  /* Elke stichting heeft haar eigen genummerde lijst (Bonaire twaalf punten,
     Curaçao dertien). Deze lijst op de homepage is die van Bonaire, en dat
     staat er ook bij; de titel telt daarom niet meer mee. */
  taken: {
    kicker: {en: 'From the statutes', nl: 'Uit de statuten', pap: 'For di e statutonan'},
    titel: {en: 'The tasks from the statutes', nl: 'De taken uit de statuten', pap: 'E tareanan for di e statutonan'},
    lead: {
      en: 'Word for word as they appear in the statutes of the Bonaire foundation. Nothing summarised, nothing left out. Each foundation has its own list; it stands on its own page.',
      nl: 'Woordelijk zoals ze in de statuten van de Bonairiaanse stichting staan. Niets samengevat, niets weggelaten. Elke stichting heeft haar eigen lijst, die staat op haar eigen pagina.',
      pap: 'Palabra pa palabra manera nan ta pará den e statutonan di e fundashon boneriano. Nada resumí, nada lagá afó. Kada fundashon tin su mes lista, ku ta pará riba su mes página.',
    },
  },

  /* ------------------------------------------------------------ geschiedenis */
  geschiedenis: {
    kicker: {en: 'Why this work', nl: 'Waarom dit werk', pap: 'Pakiko e trabou aki'},
    titel: {en: 'The salt, the huts,', nl: 'Het zout, de huisjes,', pap: 'E salu, e kasnan,'},
    titelCursief: {
      en: 'the silence around them',
      nl: 'de stilte eromheen',
      pap: 'e silensio rònt di nan',
    },
    een: {
      en: 'During colonial times enslaved Africans were forced to work in the salt pans of Bonaire under harsh conditions. They worked long days in the burning sun and harvested the salt by hand, which often caused injuries because of the sharp crystals and the high salinity. Many lived in small stone huts near the pans, which we know today as the slave huts.',
      nl: 'In de koloniale tijd moesten tot slaaf gemaakte Afrikanen in de zoutpannen van Bonaire werken, onder zware omstandigheden. Zij maakten lange dagen in de brandende zon en oogstten het zout met de hand, wat vaak verwondingen opleverde door de scherpe kristallen en het hoge zoutgehalte. Velen woonden in kleine stenen hutjes bij de pannen, die wij vandaag kennen als de slavenhuisjes.',
      pap: 'Den tempu kolonial, afrikanonan ku a wòrdu hasí katibu mester a traha den e saliñanan di Boneiru, bou di kondishonnan duru. Nan tabata traha dia largu bou di solo kayente i tabata kosechá e salu ku man, loke hopi biaha tabata kousa herida pa motibu di e kristalnan skèrpi i e kantidat haltu di salu. Hopi di nan tabata biba den kasnan chikitu di piedra banda di e saliñanan, ku awe nos ta konosé komo e kasnan di katibu.',
    },
    twee: {
      en: 'Slavery was abolished in 1863, but its legacy has remained an important part of the history of Bonaire. Remembering that history is necessary to do justice to the victims and to work towards justice today.',
      nl: 'De slavernij werd in 1863 afgeschaft, maar de nalatenschap ervan is een belangrijk deel van de geschiedenis van Bonaire gebleven. Die geschiedenis herinneren is nodig om de slachtoffers recht te doen en om aan rechtvaardigheid te werken.',
      pap: 'Sklabitut a wòrdu aboli na 1863, pero su legado a keda un parti importante di e historia di Boneiru. Kòrda e historia ei ta nesesario pa hasi hustisia na e víktimanan i pa traha riba hustisia awe.',
    },
    bron: {
      en: 'This text is taken from the website of the foundation on Bonaire, in their own words.',
      nl: 'Deze tekst staat in het Engels op de eigen website van de stichting op Bonaire. Wij hebben hem vertaald.',
      pap: 'E teksto aki ta pará na ingles riba e wèpsait di e fundashon na Boneiru. Nos a tradusí e.',
    },
    beeldAlt: {
      en: 'Historic photograph of workers harvesting salt by hand on the salt pans of Bonaire',
      nl: 'Historische opname van arbeiders die met de hand zout oogsten op de zoutpannen van Bonaire',
      pap: 'Portrèt históriko di trahadónan ta kosechá salu ku man riba e saliñanan di Boneiru',
    },
    bijschrift: {
      en: 'Harvesting salt by hand on Bonaire. Source: bonairediaspora.org',
      nl: 'Zoutwinning met de hand op Bonaire. Bron: bonairediaspora.org',
      pap: 'Kosechá salu ku man na Boneiru. Fuente: bonairediaspora.org',
    },
  },

  /* ---------------------------------------------------------------- cijfers */
  cijfers: {
    stichtingen: {
      en: 'Foundations, one partnership',
      nl: 'Stichtingen, één samenwerking',
      pap: 'Fundashon, un solo koperashon',
    },
    taken: {en: 'Tasks in the statutes', nl: 'Taken in de statuten', pap: 'Tarea den e statutonan'},
    jaar: {en: 'The year of abolition', nl: 'Het jaar van de afschaffing', pap: 'E aña di abolishon'},
  },

  /* ----------------------------------------------------------------- agenda */
  agenda: {
    kicker: {en: 'Events', nl: 'Agenda', pap: 'Agenda'},
    titel: {en: 'What is coming', nl: 'Wat er komt', pap: 'Loke ta bini'},
    lead: {
      en: 'The days on which our community reflects on its history and celebrates what has been built.',
      nl: 'De dagen waarop onze gemeenschap stilstaat bij haar geschiedenis en viert wat er is opgebouwd.',
      pap: 'E dianan ku nos komunidat ta para ketu na su historia i ta selebrá loke a wòrdu konstruí.',
    },
    hele: {en: 'All events', nl: 'Hele agenda', pap: 'Henter e agenda'},
    paginaTekst: {
      en: 'The days of remembrance and celebration that matter to our community, and the events the three foundations organise around them.',
      nl: 'De herdenkings- en vierdagen die voor onze gemeenschap tellen, en de activiteiten die de drie stichtingen daaromheen organiseren.',
      pap: 'E dianan di konmemorashon i selebrashon ku ta konta pa nos komunidat, i e aktividatnan ku e tres fundashonnan ta organisá rònt di nan.',
    },
    alles: {en: 'All', nl: 'Alles', pap: 'Tur'},
    door: {en: 'By', nl: 'Door', pap: 'Dor di'},
    totEnMet: {en: 'to', nl: 'tot en met', pap: 'te ku'},
    eigenKop: {
      en: 'Your own events are not in here yet',
      nl: 'Jullie eigen activiteiten staan er nog niet bij',
      pap: 'Boso mes aktividatnan ainda no ta aden',
    },
    eigenTekst: {
      en: 'The days above are real, yearly days of remembrance and celebration. The gatherings, lectures and neighbourhood events the foundations organise themselves still have to be added. As soon as we know how you want to keep them up to date we will switch that on, so a volunteer can add an event without anyone having to touch the website.',
      nl: 'De dagen hierboven zijn echte, jaarlijks terugkerende herdenkings- en vierdagen. De bijeenkomsten, lezingen en buurtactiviteiten die de stichtingen zelf organiseren moeten er nog in. Zodra we weten hoe jullie die willen bijhouden zetten we die koppeling aan, zodat een vrijwilliger een activiteit kan toevoegen zonder dat er iemand aan de website hoeft te komen.',
      pap: 'E dianan ariba ta dianan real di konmemorashon i selebrashon ku ta bolbe tur aña. E reunionnan, charlanan i aktividatnan di bario ku e fundashonnan mes ta organisá mester wòrdu agregá ainda. Ora nos sa kon boso ke mantené nan al dia, nos ta sende e konekshon ei, asina un boluntario por agregá un aktividat sin ku ningun hende mester mishi ku e wèpsait.',
    },
  },

  /* -------------------------------------------------------------- steun ons */
  steun: {
    kicker: {en: 'Support us', nl: 'Steun ons', pap: 'Sostené nos'},
    titel: {
      en: 'This work runs on people',
      nl: 'Dit werk draait op mensen',
      pap: 'E trabou aki ta kore riba hende',
    },
    titelCursief: {
      en: 'who think it matters',
      nl: 'die het belangrijk vinden',
      pap: 'ku ta hañ’é importante',
    },
    lead: {
      en: 'Archive research takes time. Making teaching material takes time. Keeping a plantation house standing takes money. Every contribution pays for a piece of it.',
      nl: 'Archiefonderzoek kost tijd. Lesmateriaal maken kost tijd. Een landhuis overeind houden kost geld. Elke bijdrage maakt daar een stuk van mogelijk.',
      pap: 'Investigashon den archivo ta kosta tempu. Traha material di siñansa ta kosta tempu. Wanta un kas di kunuku na pia ta kosta plaka. Kada kontribushon ta paga un pida di esei.',
    },
    doneren: {en: 'Donate', nl: 'Doneren', pap: 'Doná'},
    sponsor: {
      en: 'Become a sponsor or volunteer',
      nl: 'Word sponsor of vrijwilliger',
      pap: 'Bira sponsor of boluntario',
    },
    beeldAlt: {
      en: 'A grandmother and her granddaughter looking through old family photographs and a handwritten letter',
      nl: 'Een grootmoeder en haar kleindochter kijken samen naar oude familiefotos en een handgeschreven brief',
      pap: 'Un wela ku su nietu muhé ta wak huntu portrètnan bieu di famia i un karta skirbí na man',
    },
    bijschrift: {
      en: 'Concept image. As soon as the foundations supply their own photographs, their own work goes here.',
      nl: 'Conceptbeeld. Zodra de stichtingen eigen foto’s aanleveren komt daar hun eigen werk te staan.',
      pap: 'Imágen di konsepto. Ora e fundashonnan entregá nan mes portrètnan, nan mes trabou ta bini akinan.',
    },
    paginaTitel: {
      en: 'Research takes time,',
      nl: 'Onderzoek kost tijd,',
      pap: 'Investigashon ta kosta tempu,',
    },
    paginaCursief: {
      en: 'and time costs money',
      nl: 'en tijd kost geld',
      pap: 'i tempu ta kosta plaka',
    },
    paginaTekst: {
      en: 'Archive research, making teaching material, keeping a plantation house standing, organising a day of remembrance. Every contribution pays for a piece of it.',
      nl: 'Archiefonderzoek, lesmateriaal maken, een landhuis overeind houden, een herdenking organiseren. Elke bijdrage maakt daar een stuk van mogelijk.',
      pap: 'Investigashon den archivo, traha material di siñansa, wanta un kas di kunuku na pia, organisá un konmemorashon. Kada kontribushon ta paga un pida di esei.',
    },
    paginaBeeldBij: {
      en: 'Members of the foundations after a meeting',
      nl: 'Leden van de stichtingen na een bijeenkomst',
      pap: 'Miembronan di e fundashonnan despues di un reunion',
    },
    /* Woordelijk van de stichting zelf; het Engels is hun eigen tekst. */
    citaat: {
      en: 'every contribution can make a difference',
      nl: 'elke bijdrage kan het verschil maken',
      pap: 'kada kontribushon por hasi diferensia',
    },
    citaatOnder: {
      en: 'Together, we unlock opportunities that can transform the dialogue between Africa and the Caribbean Community into action.',
      nl: 'Samen ontsluiten we kansen die de dialoog tussen Afrika en de Caribische gemeenschap kunnen omzetten in daden.',
      pap: 'Huntu nos ta habri oportunidat ku por transformá e diálogo entre Africa i e Komunidat Karibense den akshon.',
    },
    citaatContact: {en: 'contact', nl: 'contact', pap: 'kontakto'},
    kopKicker: {en: 'Donate', nl: 'Doneren', pap: 'Doná'},
    kopTitel: {en: 'Once,', nl: 'Eenmalig', pap: 'Un biaha,'},
    kopCursief: {en: 'or every month', nl: 'of elke maand', pap: 'of tur luna'},
    kiesBedrag: {en: 'Choose an amount', nl: 'Kies een bedrag', pap: 'Skohe un suma'},
    anderBedrag: {en: 'Other amount', nl: 'Ander bedrag', pap: 'Otro suma'},
    uwBedrag: {en: 'Your amount in euros', nl: 'Uw bedrag in euro', pap: 'Bo suma na euro'},
    voorbeeld: {en: 'For example 75', nl: 'Bijvoorbeeld 75', pap: 'Por ehèmpel 75'},
    doneerKnop: {en: 'Donate', nl: 'Doneer', pap: 'Doná'},
    koppelingUit: {
      en: 'The payment link is not switched on yet. As soon as we know which provider you want to receive through, iDEAL via Mollie or otherwise, this button is half an hour of work.',
      nl: 'De betaalkoppeling staat nog niet aan. Zodra bekend is via welke partij jullie willen ontvangen, iDEAL via Mollie of anders, is dit knopje in een half uur werkend.',
      pap: 'E konekshon di pago ainda no ta sendí. Ora nos sa via ki partido boso ke risibí, iDEAL via Mollie of otro, e boton aki ta mei ora di trabou.',
    },
    vriendKop: {en: 'Become a friend', nl: 'Word vriend', pap: 'Bira amigu'},
    vriendTekst: {
      en: 'A fixed amount every month or every year. That makes it possible to plan ahead instead of project by project.',
      nl: 'Een vast bedrag per maand of per jaar. Daarmee kan er vooruit gepland worden in plaats van per project.',
      pap: 'Un suma fiho pa luna of pa aña. Ku esei por planiá padilanti en bes di proyekto pa proyekto.',
    },
    sponsorKop: {en: 'Become a sponsor', nl: 'Word sponsor', pap: 'Bira sponsor'},
    sponsorTekst: {
      en: 'For companies and institutions. From supporting a single piece of research to attaching your name to the work for years.',
      nl: 'Voor bedrijven en instellingen. Van het steunen van een enkel onderzoek tot het meerjarig verbinden van uw naam aan het werk.',
      pap: 'Pa empresa i instansia. For di sostené un solo investigashon te na mara bo nòmber na e trabou pa vários aña.',
    },
    helpKop: {en: 'Lend a hand', nl: 'Help mee', pap: 'Yuda nos'},
    helpTekst: {
      en: 'There is work that costs no money too: archive research, translating, photography, helping build a day of remembrance.',
      nl: 'Er is ook werk dat geen geld kost: archiefonderzoek, vertalen, fotograferen, een herdenking mee opbouwen.',
      pap: 'Tin trabou tambe ku no ta kosta plaka: investigashon den archivo, tradusí, saka portrèt, yuda konstruí un konmemorashon.',
    },
    anbiNote: {
      en: 'As soon as the Dutch foundation has its ANBI status in place, a gift to that foundation is deductible from Dutch income tax. For donors in the Netherlands that is one more reason to give, so we will state it clearly here once it is final.',
      nl: 'Zodra de Nederlandse stichting haar ANBI-status rond heeft, is een gift aan die stichting aftrekbaar voor de inkomstenbelasting. Dat is voor donateurs in Nederland een reden te meer, dus dat vermelden we hier duidelijk zodra het definitief is.',
      pap: 'Ora e fundashon hulandes haña su estatus ANBI kla, un donashon na e fundashon ei ta dedusibel di e belasting riba entrada na Hulanda. Pa donantenan na Hulanda esei ta un motibu mas, p’esei nos ta menshoná esei kla akinan ora e ta definitivo.',
    },
  },

  /* -------------------------------------------------------------- de tekens */
  tekens: {
    kicker: {
      en: 'The symbols on this site',
      nl: 'De tekens op deze site',
      pap: 'E símbolonan riba e sitio aki',
    },
    titel: {en: 'Adinkra', nl: 'Adinkra', pap: 'Adinkra'},
    lead: {
      en: 'Adinkra are symbols of the Akan from present-day Ghana, used throughout the African diaspora. They are not decoration here: every symbol sits in the place its meaning is about.',
      nl: 'Adinkra zijn symbolen van de Akan uit het huidige Ghana, die in de hele Afrikaanse diaspora gebruikt worden. Ze staan hier niet als versiering: elk teken staat op de plek waar zijn betekenis over gaat.',
      pap: 'Adinkra ta símbolonan di e pueblo Akan for di loke awe ta Ghana, ku ta wòrdu usá den henter e diáspora afrikano. Nan no ta pará akinan komo adorno: kada símbolo ta pará na e lugá ku su nifikashon ta trata di dje.',
    },
    vanStichting: {
      en: 'The symbol of this foundation is',
      nl: 'Het teken van deze stichting is',
      pap: 'E símbolo di e fundashon aki ta',
    },
  },

  /* ---------------------------------------------------------------- contact */
  contact: {
    kicker: {en: 'Contact', nl: 'Contact', pap: 'Kontakto'},
    titel: {en: 'Get in touch', nl: 'Laat van u horen', pap: 'Laga nos tende di bo'},
    lead: {
      en: 'A question, an idea, a document you have at home, or the wish to take part.',
      nl: 'Een vraag, een idee, een archiefstuk dat u thuis heeft liggen, of de wens om mee te doen.',
      pap: 'Un pregunta, un idea, un dokumento di archivo ku bo tin na kas, of e deseo pa partisipá.',
    },
    paginaTitel: {en: 'Get in', nl: 'Neem', pap: 'Tuma'},
    paginaCursief: {en: 'touch', nl: 'contact op', pap: 'kontakto'},
    paginaTekst: {
      en: 'A question, an idea, a document you have at home, or the wish to take part. We would like to hear from you.',
      nl: 'Een vraag, een idee, een archiefstuk dat u thuis heeft liggen, of de wens om mee te doen. Wij horen het graag.',
      pap: 'Un pregunta, un idea, un dokumento di archivo ku bo tin na kas, of e deseo pa partisipá. Nos ta gusta tende di bo.',
    },
    mailVolgt: {en: 'email to follow', nl: 'e-mail volgt', pap: 'e-mail ta sigui'},
    mailNog: {
      en: 'Email address still to be provided',
      nl: 'E-mailadres nog aan te leveren',
      pap: 'Adres di e-mail ainda pa entregá',
    },
    nogGeenMail: {
      en: 'Curaçao and the Netherlands have not given us an email address of their own yet. Until they do, everything arrives at the foundation on Bonaire.',
      nl: 'Curaçao en Nederland hebben nog geen eigen e-mailadres doorgegeven. Tot die er zijn komt alles bij de stichting op Bonaire binnen.',
      pap: 'Kòrsou i Hulanda ainda no a pasa un adres di e-mail di nan mes. Te ora nan hasi esei, tur kos ta drenta serka e fundashon na Boneiru.',
    },
    rechtstreeksKicker: {en: 'Directly', nl: 'Rechtstreeks', pap: 'Direktamente'},
    rechtstreeksTitel: {en: 'Where to', nl: 'Waar u', pap: 'Unda bo por'},
    rechtstreeksCursief: {en: 'find us', nl: 'ons vindt', pap: 'haña nos'},
    formulierKicker: {en: 'Form', nl: 'Formulier', pap: 'Formulario'},
    formulierTitel: {en: 'Send us', nl: 'Stuur', pap: 'Manda'},
    formulierCursief: {en: 'a message', nl: 'een bericht', pap: 'un mensahe'},
    waarover: {en: 'What is it about?', nl: 'Waar gaat het over?', pap: 'Di kiko e ta trata?'},
    onderwerpAlgemeen: {en: 'General question', nl: 'Algemene vraag', pap: 'Pregunta general'},
    onderwerpSamenwerken: {
      en: 'Partnership or sponsorship',
      nl: 'Samenwerken of sponsoren',
      pap: 'Kolaborashon of sponsor',
    },
    onderwerpVrijwilliger: {en: 'Volunteering', nl: 'Meehelpen', pap: 'Yuda komo boluntario'},
    voornaam: {en: 'First name', nl: 'Voornaam', pap: 'Nòmber'},
    achternaam: {en: 'Last name', nl: 'Achternaam', pap: 'Fam'},
    email: {en: 'Email address', nl: 'E-mailadres', pap: 'Adres di e-mail'},
    telefoon: {en: 'Phone number', nl: 'Telefoonnummer', pap: 'Number di telefòn'},
    bericht: {en: 'Your message', nl: 'Uw bericht', pap: 'Bo mensahe'},
    bijlage: {
      en: 'Add an attachment, for example a photo or a document',
      nl: 'Bijlage meesturen, bijvoorbeeld een foto of document',
      pap: 'Manda un anekso, por ehèmpel un portrèt of un dokumento',
    },
    bestandGekozen: {en: 'file selected', nl: 'bestand gekozen', pap: 'dokumento skohí'},
    bestandenGekozen: {en: 'files selected', nl: 'bestanden gekozen', pap: 'dokumento skohí'},
    fout: {
      en: 'Sending failed. Please try again, or email info@3diaspora.org directly.',
      nl: 'Het versturen lukte niet. Probeer het opnieuw, of mail rechtstreeks naar info@3diaspora.org.',
      pap: 'E mensahe no a sali. Purba atrobe, of manda un e-mail direktamente na info@3diaspora.org.',
    },
    bezig: {en: 'Sending', nl: 'Bezig met versturen', pap: 'Ta manda'},
    verstuur: {en: 'Send message', nl: 'Verstuur bericht', pap: 'Manda mensahe'},
    kiesEerst: {
      en: 'Please choose a subject first.',
      nl: 'Kies eerst waar het over gaat.',
      pap: 'Skohe promé di kiko e ta trata.',
    },
    dank: {en: 'Thank you', nl: 'Dank u wel', pap: 'Danki'},
    dankTekst: {
      en: 'Your message has reached us. We will get back to you as soon as we can.',
      nl: 'Uw bericht is bij ons binnen. Wij nemen zo snel mogelijk contact met u op.',
      pap: 'Bo mensahe a yega serka nos. Nos ta tuma kontakto ku bo mas lihé posibel.',
    },
    vraagAan: {en: 'A question for', nl: 'Iets vragen aan', pap: 'Un pregunta pa'},
    vraagTekst: {
      en: 'Use the form and choose {x} as the subject, then it reaches the right people.',
      nl: 'Gebruik het formulier en kies {x} als onderwerp, dan komt het bij de juiste mensen terecht.',
      pap: 'Usa e formulario i skohe {x} komo tema, asina e ta yega serka e hendenan korekto.',
    },
    naarFormulier: {
      en: 'To the contact form',
      nl: 'Naar het contactformulier',
      pap: 'Bai na e formulario di kontakto',
    },
  },

  /* --------------------------------------------------------- stichtingpagina */
  stichting: {
    over: {en: 'About this foundation', nl: 'Over deze stichting', pap: 'Tokante e fundashon aki'},
    gegevens: {en: 'Details', nl: 'Gegevens', pap: 'Datonan'},
    plaats: {en: 'Based in', nl: 'Plaats', pap: 'Ubiká na'},
    adres: {en: 'Registered address', nl: 'Adres', pap: 'Adres'},
    opgericht: {en: 'Founded', nl: 'Opgericht', pap: 'Fundá'},
    status: {en: 'Status', nl: 'Status', pap: 'Estado'},
    emailLabel: {en: 'Email', nl: 'E-mail', pap: 'E-mail'},
    kvk: {en: 'Chamber of Commerce', nl: 'Kamer van Koophandel', pap: 'Kámara di Komersio'},
    crib: {en: 'CRIB number', nl: 'CRIB-nummer', pap: 'Number CRIB'},
    volg: {en: 'Follow this foundation', nl: 'Volg deze stichting', pap: 'Sigui e fundashon aki'},
    logoVan: {en: 'Logo of', nl: 'Logo van', pap: 'Logo di'},
    nogAanTeLeveren: {en: 'still to be provided', nl: 'nog aan te leveren', pap: 'ainda pa entregá'},
    werkKicker: {en: 'The work', nl: 'Het werk', pap: 'E trabou'},
    werkTitel: {
      en: 'What this foundation',
      nl: 'Waar deze stichting',
      pap: 'Riba kiko e fundashon aki',
    },
    werkCursief: {en: 'works on', nl: 'aan werkt', pap: 'ta traha'},

    /* eigen missie, visie en statutaire taken van een stichting */
    eigenLead: {
      en: 'In the words of the foundation itself, as its board supplied them.',
      nl: 'In de woorden van de stichting zelf, zoals haar bestuur ze heeft aangeleverd.',
      pap: 'Den palabra di e fundashon mes, manera su direktiva a entregá nan.',
    },
    takenTitel: {
      en: 'The tasks in the statutes',
      nl: 'De taken uit de statuten',
      pap: 'E tareanan for di e statutonan',
    },
    takenGat: {
      en: 'Points {a} to {b} have not reached us yet. As soon as the board sends them they will stand here, in the same numbering.',
      nl: 'Punt {a} tot en met {b} hebben wij nog niet ontvangen. Zodra het bestuur ze aanlevert staan ze hier, in dezelfde nummering.',
      pap: 'Punto {a} te ku {b} ainda no a yega serka nos. Ora e direktiva mand’é nan, nan ta pará akinan, den e mesun numerashon.',
    },
    takenAfgekapt: {
      en: 'The sentence of point {a} breaks off there in the text we received. The underlying points are complete; the closing words are not, so we have left them open rather than filling them in ourselves.',
      nl: 'De zin van punt {a} houdt daar op in de tekst die wij hebben ontvangen. De onderliggende punten zijn wel compleet, het slot van de zin niet. Wij laten dat liever open dan dat wij het zelf invullen.',
      pap: 'E frase di punto {a} ta kaba einan den e teksto ku nos a risibí. E puntonan bou di dje sí ta kompleto, e final di e frase nò. Nos ta laga esei habrí en bes di kompletá esaki nos mes.',
    },
  },

  /* ------------------------------------------------------------- oprichting */
  oprichting: {
    kicker: {en: 'The founding', nl: 'De oprichting', pap: 'E fundashon'},
    titel: {en: 'The day it', nl: 'De dag dat het', pap: 'E dia ku el a'},
    cursief: {en: 'became official', nl: 'officieel werd', pap: 'bira ofisial'},
    tekst: {
      en: 'The Dutch foundation was registered at the notary. From that moment the work on the islands has an address in the Netherlands: a place partners, funds and donors here can turn to. These are their own pictures and their own film of that morning.',
      nl: 'De Nederlandse stichting is bij de notaris ingeschreven. Vanaf dat moment heeft het werk op de eilanden ook een adres in Nederland, waar partners, fondsen en donateurs hier terechtkunnen. Dit zijn hun eigen foto’s en hun eigen film van die ochtend.',
      pap: 'E fundashon hulandes a wòrdu inskribí serka e notario. For di e momento ei e trabou riba e islanan tin tambe un adres na Hulanda, kaminda partner, fondo i donante akinan por bai. Esakinan ta nan mes portrètnan i nan mes pelíkula di e mainta ei.',
    },
    videoBij: {
      en: 'Their own film of the registration, outside the notary. With sound.',
      nl: 'Hun eigen film van de inschrijving, voor de deur bij de notaris. Met geluid.',
      pap: 'Nan mes pelíkula di e inskripshon, pafó serka e notario. Ku zonido.',
    },
  },

  /* ---------------------------------------------------------------- bestuur */
  bestuur: {
    kicker: {en: 'Board', nl: 'Bestuur', pap: 'Direktiva'},
    titel: {en: 'The people', nl: 'De mensen', pap: 'E hendenan'},
    cursief: {en: 'on Bonaire', nl: 'op Bonaire', pap: 'na Boneiru'},
    tekst: {
      en: 'The board of the Bonaire Diaspora Of Africa Foundation, as listed on their own members page.',
      nl: 'Het bestuur van de Bonaire Diaspora Of Africa Foundation, zoals het op hun eigen ledenpagina staat.',
      pap: 'E direktiva di e Bonaire Diaspora Of Africa Foundation, manera e ta pará riba nan mes página di miembronan.',
    },
  },

  /* ------------------------------------------------------------------- anbi */
  anbi: {
    kicker: {en: 'ANBI', nl: 'ANBI', pap: 'ANBI'},
    titel: {en: 'Accountability', nl: 'Verantwoording', pap: 'Rendishon di kuenta'},
    lead: {
      en: 'As a recognised public benefit organisation under Dutch law, this foundation has to publish a fixed set of details. They are all here, in one place.',
      nl: 'Als algemeen nut beogende instelling moet deze stichting een vaste set gegevens openbaar maken. Hieronder staan ze allemaal, op één plek.',
      pap: 'Komo instansia di benefisio públiko bou di lei hulandes, e fundashon aki mester publiká un set fiho di datonan. Nan tur ta pará akinan, na un solo lugá.',
    },
    naamKop: {en: 'Name and details', nl: 'Naam en gegevens', pap: 'Nòmber i datonan'},
    nogAanTeLeveren: {
      en: 'To be provided by the foundation',
      nl: 'Aan te leveren door de stichting',
      pap: 'Pa e fundashon entregá',
    },
    doelKop: {en: 'Objective', nl: 'Doelstelling', pap: 'Meta'},
    doelTekst: {
      en: 'To represent and support the descendants of enslaved people by promoting historical research, community building, education and the preservation of cultural heritage, with particular attention to the bond between Africa and the Caribbean.',
      nl: 'Het vertegenwoordigen en steunen van de nakomelingen van tot slaaf gemaakte mensen door historisch onderzoek, gemeenschapsopbouw, educatie en het behoud van cultureel erfgoed te bevorderen, met bijzondere aandacht voor de band tussen Afrika en de Cariben.',
      pap: 'Representá i sostené e desendientenan di hendenan ku a wòrdu hasí katibu dor di promové investigashon históriko, konstrukshon di komunidat, edukashon i konservashon di patrimonio kultural, ku atenshon spesial pa e laso entre Africa i Karibe.',
    },
    bestuurKop: {
      en: 'Board and remuneration policy',
      nl: 'Bestuur en beloningsbeleid',
      pap: 'Direktiva i maneho di remunerashon',
    },
    bestuurTekst: {
      en: 'The composition of the board and the names of its members will be published here as soon as the foundation has passed them on. The remuneration policy belongs here too: at most foundations like this one, board members receive no payment and only expenses incurred can be claimed. We will only fill that in once the foundation has confirmed it itself.',
      nl: 'De samenstelling van het bestuur en de namen van de bestuurders worden hier gepubliceerd zodra de stichting die heeft doorgegeven. Ook het beloningsbeleid hoort hier te staan: bij de meeste stichtingen als deze ontvangen bestuurders geen beloning en kunnen alleen gemaakte onkosten worden gedeclareerd. Wij vullen dat pas in wanneer de stichting het zelf heeft bevestigd.',
      pap: 'E komposishon di e direktiva i e nòmbernan di su miembronan lo wòrdu publiká akinan ora e fundashon a pasa nan. E maneho di remunerashon tambe ta pertenesé akinan: na mayoria fundashon manera esaki, miembronan di direktiva no ta risibí pago i ta solamente gastunan hasí por wòrdu deklará. Nos lo yena esei numa ora e fundashon mes a konfirm’é.',
    },
    stukkenKop: {
      en: 'Documents to download',
      nl: 'Stukken om te downloaden',
      pap: 'Dokumentonan pa baha',
    },
    nogNiet: {en: 'Still to be provided', nl: 'Nog aan te leveren', pap: 'Ainda pa entregá'},
    beleidsplan: {en: 'Policy plan', nl: 'Beleidsplan', pap: 'Plan di maneho'},
    beleidsplanTekst: {
      en: 'The current policy plan, with the plans for the years ahead.',
      nl: 'Het actuele beleidsplan met de plannen voor de komende jaren.',
      pap: 'E plan di maneho aktual, ku e plannan pa e añanan ku ta bini.',
    },
    verslag: {en: 'Annual report', nl: 'Activiteitenverslag', pap: 'Informe anual'},
    verslagTekst: {
      en: 'An account of what the foundation did over the past year.',
      nl: 'Een verslag van wat de stichting het afgelopen jaar heeft gedaan.',
      pap: 'Un relato di loke e fundashon a hasi durante e aña pasá.',
    },
    financieel: {en: 'Financial statement', nl: 'Financiële verantwoording', pap: 'Rendishon finansiero'},
    financieelTekst: {
      en: 'The balance sheet, the statement of income and expenditure, and the notes to them.',
      nl: 'De balans, de staat van baten en lasten en een toelichting daarop.',
      pap: 'E balansa, e estado di entrada i gastu, i e notanan riba nan.',
    },
    eigenBestand: {
      en: 'We put these three documents on this website as files, not as a link to somewhere else. An ANBI has to publish them itself, and a link to a site that could go offline tomorrow is not enough for that.',
      nl: 'Deze drie stukken zetten wij als bestand op deze website zelf, niet als link naar een andere plek. Een ANBI moet ze zelf publiceren, en een verwijzing naar een site die morgen offline kan gaan is daarvoor niet genoeg.',
      pap: 'E tres dokumentonan aki nos ta pone komo archivo riba e wèpsait aki mes, no komo un enlace pa un otro lugá. Un ANBI mester publiká nan mes, i un referensia pa un sitio ku mañan por bai afó no ta sufisiente pa esei.',
    },
  },

  /* ---------------------------------------------------------------- galerij */
  galerij: {
    kicker: {en: 'Gallery', nl: 'Galerij', pap: 'Galería'},
    titel: {en: 'Pictures from', nl: 'Beelden van', pap: 'Imágennan di'},
    cursief: {en: 'all three foundations', nl: 'de drie stichtingen', pap: 'e tres fundashonnan'},
    lead: {
      en: 'The islands and the Netherlands in one place: the work, the people, and the places where this history can still be seen. Every picture carries what it is and where it comes from.',
      nl: 'De eilanden en Nederland op één plek: het werk, de mensen en de plekken waar deze geschiedenis nog te zien is. Bij elk beeld staat wat het is en waar het vandaan komt.',
      pap: 'E islanan i Hulanda na un solo lugá: e trabou, e hendenan i e lugánan kaminda e historia aki ainda ta di mira. Serka kada imagen ta pará kiko e ta i for di unda e ta bini.',
    },
    open: {en: 'View larger', nl: 'Groter bekijken', pap: 'Mira mas grandi'},
    sluiten: {en: 'Close', nl: 'Sluiten', pap: 'Sera'},
    vorige: {en: 'Previous image', nl: 'Vorige beeld', pap: 'Imagen anterior'},
    volgende: {en: 'Next image', nl: 'Volgende beeld', pap: 'Siguiente imagen'},
    van: {en: 'of', nl: 'van', pap: 'di'},
    eigen: {en: 'Their own photograph', nl: 'Eigen foto', pap: 'Portrèt di nan mes'},
    archief: {en: 'Archive image', nl: 'Archiefbeeld', pap: 'Imagen di archivo'},
    sfeer: {en: 'Image from their own site', nl: 'Beeld van hun eigen site', pap: 'Imagen di nan mes sitio'},
    concept: {en: 'Concept image, made by us', nl: 'Conceptbeeld, door ons gemaakt', pap: 'Imagen di konsepto, trahá pa nos'},
    meerKop: {en: 'Do you have more pictures?', nl: 'Heeft u meer beelden?', pap: 'Bo tin mas imagen?'},
    meerTekst: {
      en: 'Nine of these eleven pictures are theirs. Two are concept images we made, because there was no photograph of that subject: the huts at golden hour and the two generations at the table. Every photograph of a lesson, a gathering or a day of remembrance that they send replaces one of those, and makes this page stronger.',
      nl: 'Negen van deze elf beelden zijn van henzelf. Twee zijn conceptbeelden van ons, omdat er van dat onderwerp geen foto was: de huisjes in het late licht en de twee generaties aan tafel. Elke foto van een les, een bijeenkomst of een herdenking die zij sturen vervangt er zo een, en maakt deze pagina sterker.',
      pap: 'Nuebe di e diesun imágennan aki ta di nan mes. Dos ta imagen di konsepto di nos, pasobra no tabatin portrèt di e tema ei: e kasnan den e lus lat i e dos generashonnan na mesa. Kada portrèt di un lès, un reunion of un konmemorashon ku nan manda ta remplasá un di nan, i ta hasi e página aki mas fuerte.',
    },
    meerKnop: {en: 'Send us your pictures', nl: 'Stuur ons uw beelden', pap: 'Manda nos bo imágennan'},
  },

  /* ----------------------------------------------------------------- footer */
  footer: {
    over: {
      en: 'A partnership of three foundations that research, preserve and pass on the African heritage and history of the Caribbean community.',
      nl: 'Een samenwerking van drie stichtingen die het Afrikaanse erfgoed en de geschiedenis van de Caribische gemeenschap onderzoeken, bewaren en doorgeven.',
      pap: 'Un koperashon di tres fundashon ku ta investigá, konservá i pasa aden e herensia afrikano i e historia di e komunidat karibense.',
    },
    stichtingen: {en: 'The foundations', nl: 'De stichtingen', pap: 'E fundashonnan'},
    opDezeSite: {en: 'On this site', nl: 'Op deze site', pap: 'Riba e sitio aki'},
    steunOns: {en: 'Support us', nl: 'Steun ons', pap: 'Sostené nos'},
    anbiLink: {en: 'ANBI accountability', nl: 'ANBI-verantwoording', pap: 'Rendishon di kuenta ANBI'},
    volg: {en: 'Follow us', nl: 'Volg ons', pap: 'Sigui nos'},
    bereikbaar: {
      en: 'The Bonaire foundation can be reached at',
      nl: 'De Bonairiaanse stichting is bereikbaar op',
      pap: 'E fundashon di Boneiru ta alkansabel na',
    },
    concept: {
      en: 'Concept version for 3 Diaspora. The texts and details come from bonairediaspora.org and from the brief.',
      nl: 'Conceptversie voor 3 Diaspora. De teksten en gegevens komen van bonairediaspora.org en uit de opdracht.',
      pap: 'Vershon di konsepto pa 3 Diaspora. E tekstonan i datonan ta bini for di bonairediaspora.org i for di e enkargo.',
    },
  },

  /* ------------------------------------------------------------ paginatitels */
  titels: {
    home: {
      en: '3 Diaspora · African heritage in the Caribbean community',
      nl: '3 Diaspora · Afrikaans erfgoed in de Caribische gemeenschap',
      pap: '3 Diaspora · Herensia afrikano den e komunidat karibense',
    },
    omschrijving: {
      en: '3 Diaspora is the partnership of the Diaspora Of Africa Foundations of Bonaire, Curaçao and the Netherlands. Research into the history of slavery, education for schools and neighbourhoods, and the preservation of African heritage.',
      nl: '3 Diaspora is de samenwerking van de Diaspora Of Africa Foundations van Bonaire, Curaçao en Nederland. Onderzoek naar de slavernijgeschiedenis, educatie voor scholen en buurten, en het behoud van Afrikaans erfgoed.',
      pap: '3 Diaspora ta e koperashon di e Diaspora Of Africa Foundations di Boneiru, Kòrsou i Hulanda. Investigashon riba e historia di sklabitut, edukashon pa skol i bario, i konservashon di herensia afrikano.',
    },
  },
};

/* Even nakijken dat er nergens een taal is vergeten: elk blad moet {en, nl, pap} zijn. */
type Blad = Tekst | {[k: string]: Tekst};
const _controle: Record<string, Blad> = T;
void _controle;

export default T;
