/**
 * Alle inhoud op een plek, in het Nederlands, Engels en Papiamentu.
 *
 * Wat hier staat komt van bonairediaspora.org (missie, visie, de twaalf
 * statutaire taken, het bestuur, de KvK- en CRIB-nummers, het stuk over de
 * zoutpannen) of uit de opdrachtomschrijving. Wat nog niet bekend is staat
 * expliciet als `null`, zodat het op de site zichtbaar open blijft in plaats van
 * dat er iets verzonnen wordt.
 *
 * De Engelse tekst is bij Bonaire vaak dichter bij de bron dan de Nederlandse:
 * hun eigen site is Engels, wij hebben die vertaald.
 *
 * De namen van de stichtingen blijven staan zoals ze geregistreerd zijn, ook in
 * het Papiamentu. Plaatsnamen krijgen daar wel hun eigen vorm: Boneiru, Korsou,
 * Hulanda. Rode Pan en Witte Pan blijven staan, dat zijn de namen van de
 * plekken zelf.
 */

import type {Merk} from './ui';
import type {Tekst} from './taal';

export type Stichting = {
  id: 'bonaire' | 'curacao' | 'nederland';
  naam: string;         /* eigennaam, die vertalen we niet */
  kort: Tekst;
  plaats: Tekst;
  accent: string;      /* css-kleur, geeft elke stichting een eigen gezicht */
  accentZacht: string;
  grond: string;       /* het donkere vlak waarop deze stichting staat */
  merk: Merk;          /* het adinkra-symbool dat bij haar opdracht hoort */
  status: Tekst;
  intro: Tekst;
  tekst: Tekst[];
  focus: {kop: Tekst; uitleg: Tekst}[];
  email: string | null;
  adres: string | null;   /* zoals het in het eigen register staat */
  opgericht: string | null; /* iso-datum uit het uittreksel, null = niet bekend */
  kvk: string | null;
  /* Alleen de eilanden hebben een CRIB-nummer; in Nederland bestaat dat niet.
     `crib: false` betekent dus niet onbekend maar niet van toepassing, en dan
     hoort die regel helemaal niet op de pagina te staan. */
  crib: string | null | false;
  rsin: string | null;
  socials: {soort: 'facebook' | 'instagram' | 'linkedin'; url: string}[];
  logo: string;        /* hun eigen logo, goud op doorzichtig */
  logoVorm: string;    /* dezelfde tekening als masker, zodat hij kan meekleuren */
  logoDoek: string;    /* datzelfde masker met lucht eromheen, voor het doek */
  logoKern: string;    /* alleen de tekening zonder de letterring, voor kleine tekens */
  beeld: string;
  beeldBij: Tekst;
  anbi: boolean;
  /* Eigen missie, visie en statutaire taken, als de stichting die zelf heeft
     aangeleverd. De homepage toont de gezamenlijke tekst (die van Bonaire);
     dit is wat deze stichting van zichzelf zegt.
     `onvolledig` markeert een punt waarvan de aangeleverde zin is afgekapt: dat
     hoort zichtbaar te blijven in plaats van dat wij de zin zelf afmaken.
     `takenGat` doet hetzelfde voor punten die helemaal ontbreken. */
  missie?: Tekst;
  visie?: Tekst;
  taken?: {nr: number; tekst: Tekst; punten?: Tekst[]; onvolledig?: boolean}[];
  takenGat?: {van: number; tot: number};
};

/**
 * Alle drie de zegels staan overal in exact deze ene kleur, en dat is het goud
 * uit het aangeleverde logobestand van de Nederlandse stichting (gemeten:
 * #bda050 is daar de meest voorkomende inktkleur). Eerder kleurde het merkteken
 * mee met het vlak waar het op lag, en dan lijkt het alsof elke stichting een
 * ander logo heeft. Hun eigen bestanden verschillen ook onderling een tikje:
 * Bonaire is #bc9a39 en Curacao #bd9939, dus iets doffer goud. Ook die worden
 * hiermee gelijkgetrokken.
 */
export const ZEGEL_KLEUR = '#bda050';

export const STICHTINGEN: Stichting[] = [
  {
    id: 'bonaire',
    naam: 'Bonaire Diaspora Of Africa Foundation',
    kort: {nl: 'Bonaire', en: 'Bonaire', pap: 'Boneiru'},
    plaats: {nl: 'Kralendijk, Bonaire', en: 'Kralendijk, Bonaire', pap: 'Kralendijk, Boneiru'},
    accent: '#b89838',
    accentZacht: '#e0c069',
    grond: '#2b1a10',
    merk: 'sankofa',
    status: {
      nl: 'Actief sinds de oprichting, met een eigen bestuur van vijf mensen',
      en: 'Active since it was founded, with its own board of five',
      pap: 'Aktivo for di su fundashon, ku su mes direktiva di sinku hende',
    },
    intro: {
      nl: 'De stichting op Bonaire doet onderzoek naar de slavernijgeschiedenis van het eiland, met het zwaartepunt in Rincon en Tera Cora, en brengt die kennis terug naar de buurten en de scholen.',
      en: 'The foundation on Bonaire researches the history of slavery on the island, centred on Rincon and Tera Cora, and brings that knowledge back to the neighbourhoods and the schools.',
      pap: 'E fundashon na Boneiru ta investigá e historia di sklabitut di e isla, ku Rincon i Tera Cora komo enfoke prinsipal, i ta hiba e konosementu ei bèk na e barionan i e skolnan.',
    },
    tekst: [
      {
        nl: 'De Bonaire Diaspora Of Africa Foundation vertegenwoordigt de nakomelingen van tot slaaf gemaakte mensen, lokaal, regionaal en internationaal. Het werk begint bij onderzoek: wat is er precies gebeurd, waar, en met wie. Daarna komt het delen ervan, want een geschiedenis die alleen in een archief ligt verandert niets.',
        en: 'The Bonaire Diaspora Of Africa Foundation represents the descendants of enslaved people, locally, regionally and internationally. The work begins with research: what happened exactly, where, and to whom. Sharing it comes next, because a history that only sits in an archive changes nothing.',
        pap: 'E Bonaire Diaspora Of Africa Foundation ta representá e desendientenan di hendenan ku a wòrdu hasí katibu, lokalmente, regionalmente i internashonalmente. E trabou ta kuminsá ku investigashon: kiko exaktamente a pasa, unda, i ku ken. Despues ta bini e kompartimentu di dje, pasobra un historia ku ta keda den archivo so no ta kambia nada.',
      },
      {
        nl: 'Op Bonaire ligt dat verhaal letterlijk in het landschap. De zoutpannen, de slavenhuisjes bij Rode Pan en Witte Pan, de kunuku rond Rincon: dat zijn geen decorstukken voor toeristen maar de plek waar mensen hebben gewerkt en geleefd. De stichting werkt aan het behoud daarvan en aan het herstel van de landhuizen.',
        en: 'On Bonaire that story lies in the landscape itself. The salt pans, the slave huts at Rode Pan and Witte Pan, the kunuku around Rincon: these are not scenery for visitors but the places where people worked and lived. The foundation works to preserve them and to restore the plantation houses.',
        pap: 'Na Boneiru e historia ei ta pará literalmente den e paisahe. E saliñanan, e kasnan di katibu na Rode Pan i Witte Pan, e kunukunan rònt di Rincon: esakinan no ta dekorado pa turista, ma e lugánan kaminda hende a traha i a biba. E fundashon ta traha riba nan konservashon i riba e restourashon di e kasnan di kunuku.',
      },
    ],
    focus: [
      {
        kop: {nl: 'Rincon en Tera Cora', en: 'Rincon and Tera Cora', pap: 'Rincon i Tera Cora'},
        uitleg: {
          nl: 'Historisch en wetenschappelijk onderzoek naar de slavernij op Bonaire, met deze twee gebieden als zwaartepunt.',
          en: 'Historical and academic research into slavery on Bonaire, with these two areas at its centre.',
          pap: 'Investigashon históriko i sientífiko riba sklabitut na Boneiru, ku e dos áreanan aki komo enfoke prinsipal.',
        },
      },
      {
        kop: {
          nl: 'De oorspronkelijke bewoners',
          en: 'The original inhabitants',
          pap: 'E promé habitantenan',
        },
        uitleg: {
          nl: 'Onderzoek naar de mensen die er waren voordat de kolonisatie begon, een deel van de geschiedenis dat vaak wordt overgeslagen.',
          en: 'Research into the people who were here before colonisation began, a part of the history that is often skipped.',
          pap: 'Investigashon riba e hendenan ku tabata akinan promé ku kolonisashon a kuminsá, un parti di e historia ku hopi biaha ta wòrdu saltá.',
        },
      },
      {
        kop: {
          nl: 'Landhuizen en zoutpannen',
          en: 'Plantation houses and salt pans',
          pap: 'Kasnan di kunuku i saliña',
        },
        uitleg: {
          nl: 'Het herstel en behoud van historische landhuizen en de plekken bij de zoutpannen die de geschiedenis dragen.',
          en: 'Restoring and preserving the historic plantation houses and the places by the salt pans that carry this history.',
          pap: 'E restourashon i konservashon di kasnan di kunuku históriko i e lugánan banda di e saliñanan ku ta karga e historia aki.',
        },
      },
      {
        kop: {nl: 'Scholen en buurten', en: 'Schools and neighbourhoods', pap: 'Skol i bario'},
        uitleg: {
          nl: 'Lesmateriaal op basis van het eigen onderzoek, samen met scholen en wijken op het eiland.',
          en: 'Teaching material built on our own research, together with schools and districts on the island.',
          pap: 'Material di siñansa basá riba nos mes investigashon, huntu ku skolnan i barionan riba e isla.',
        },
      },
    ],
    email: 'bdoaf.bon@gmail.com',
    /* Uittreksel Handelsregister KvK Bonaire (dossiernummer 16071), aangeleverd
       op 18-08-2026 door Dévid zelf. Het uittreksel noemt als adres van de zaak
       'Kaya Pos di Amor 6 Bonaire, Caribisch Nederland'. De plaats staat een
       regel hoger al in het gegevensblok (plaats: Kralendijk, Bonaire), dus op
       Dévids eigen verzoek (18-08-2026) staat achter de 6 geen Kralendijk meer.
       Oprichtingsdatum 10-11-2025, eerste inschrijving 11-11-2025 (dd/mm, zoals
       het uittreksel zelf ook 17/03/2026 als afgiftedatum draagt). */
    adres: 'Kaya Pos di Amor 6',
    opgericht: '2025-11-10',
    kvk: '16071',
    crib: '310043840',
    rsin: null,
    socials: [
      {soort: 'facebook', url: 'https://www.facebook.com/p/Bonaire-Diaspora-Of-Africa-Foundation-61579249800630/'},
      {soort: 'linkedin', url: 'https://www.linkedin.com/in/bonaire-diaspora-of-africa-foundation-foundation-a40749379/'},
    ],
    logo: '/img/logo-bonaire.png',
    logoVorm: '/img/logo-bonaire-vorm.png',
    logoDoek: '/img/logo-bonaire-doek.png',
    logoKern: '/img/logo-bonaire-kern.png',
    beeld: '/img/bonaire-notaris.webp',
    beeldBij: {
      nl: 'Dévid W. Eusenia bij de notaris op Bonaire',
      en: 'Dévid W. Eusenia at the notary on Bonaire',
      pap: 'Dévid W. Eusenia serka e notario na Boneiru',
    },
    anbi: false,
  },
  {
    id: 'curacao',
    naam: 'Curaçao Diaspora Of Africa Foundation',
    kort: {nl: 'Curaçao', en: 'Curaçao', pap: 'Kòrsou'},
    /* Het uittreksel noemt als statutaire zetel alleen Curaçao, niet Willemstad.
       Dat laatste was onze eigen aanname, dus die is eruit. */
    plaats: {nl: 'Curaçao', en: 'Curaçao', pap: 'Kòrsou'},
    accent: '#1b5f70',
    accentZacht: '#63aab6',
    grond: '#0c2138',
    merk: 'nkonsonkonson',
    status: {
      nl: 'Actief, de eigen website is momenteel uit de lucht',
      en: 'Active, its own website is currently offline',
      pap: 'Aktivo, su mes wèpsait ta afó na e momento aki',
    },
    intro: {
      nl: 'De stichting op Curaçao richt zich op de slavernijgeschiedenis van het eiland, met Bandariba als zwaartepunt, en op de vraag wat rechtsherstel concreet zou moeten betekenen.',
      en: 'The foundation on Curaçao focuses on the history of slavery on the island, centred on Bandariba, and on the question of what reparation should actually mean.',
      pap: 'E fundashon na Kòrsou ta enfoká riba e historia di sklabitut di e isla, ku Bandariba komo enfoke prinsipal, i riba e pregunta kiko reparashon mester nifiká konkretamente.',
    },
    tekst: [
      {
        nl: 'De Curaçao Diaspora Of Africa Foundation werkt aan dezelfde opdracht als haar zusterstichting op Bonaire, maar met de geschiedenis van Curaçao als onderwerp. Bandariba, het oostelijke deel van het eiland, is daarbij het zwaartepunt van het onderzoek.',
        en: 'The Curaçao Diaspora Of Africa Foundation works on the same task as its sister foundation on Bonaire, but with the history of Curaçao as its subject. Bandariba, the eastern part of the island, is the centre of that research.',
        pap: 'E Curaçao Diaspora Of Africa Foundation ta traha riba e mesun tarea ku su fundashon ruman na Boneiru, pero ku e historia di Kòrsou komo su tema. Bandariba, e parti pariba di e isla, ta e enfoke prinsipal di e investigashon.',
      },
      {
        nl: 'Curaçao was in de koloniale tijd een doorvoerhaven in de trans-Atlantische slavenhandel. Dat maakt de geschiedenis van dit eiland niet alleen een eilandgeschiedenis: wat hier gebeurde raakt aan de hele regio. De stichting onderzoekt die geschiedenis, vertaalt haar naar lesmateriaal en zoekt de samenwerking met buurten, scholen en verwante organisaties.',
        en: 'In colonial times Curaçao was a transit port in the trans-Atlantic slave trade. That makes the history of this island more than an island history: what happened here reaches across the whole region. The foundation researches it, turns it into teaching material and seeks out neighbourhoods, schools and kindred organisations.',
        pap: 'Den tempu kolonial Kòrsou tabata un haf di tránsito den e komèrsio trans-atlántiko di katibu. Esei ta hasi e historia di e isla aki mas ku un historia di isla so: loke a pasa akinan ta alkansá henter e region. E fundashon ta investigá e historia ei, ta pon’é den material di siñansa i ta buska koperashon ku bario, skol i organisashonnan afin.',
      },
    ],
    focus: [
      {
        kop: {nl: 'Bandariba', en: 'Bandariba', pap: 'Bandariba'},
        uitleg: {
          nl: 'Historisch en wetenschappelijk onderzoek naar de slavernij op Curaçao, met dit gebied als zwaartepunt.',
          en: 'Historical and academic research into slavery on Curaçao, with this area at its centre.',
          pap: 'Investigashon históriko i sientífiko riba sklabitut na Kòrsou, ku e área aki komo enfoke prinsipal.',
        },
      },
      {
        kop: {nl: 'Rechtsherstel', en: 'Reparation', pap: 'Reparashon'},
        uitleg: {
          nl: 'Onderzoek naar de omvang van herstelbetalingen voor de nalatenschap van de slavernij.',
          en: 'Research into the scale of reparations for the legacy of slavery.',
          pap: 'Investigashon riba e magnitut di pago di reparashon pa e legado di sklabitut.',
        },
      },
      {
        kop: {nl: 'Educatie', en: 'Education', pap: 'Edukashon'},
        uitleg: {
          nl: 'Lesprogramma op basis van het onderzoek, voor scholen en buurten op het eiland.',
          en: 'A teaching programme built on the research, for schools and neighbourhoods on the island.',
          pap: 'Un programa di siñansa basá riba e investigashon, pa skol i bario riba e isla.',
        },
      },
      {
        kop: {nl: 'Samenwerking', en: 'Working together', pap: 'Traha huntu'},
        uitleg: {
          nl: 'Verbinding met overheden, particuliere partijen en organisaties die aan hetzelfde werken.',
          en: 'Connecting governments, private parties and organisations working towards the same end.',
          pap: 'Konekshon ku gobiernu, partido privá i organisashonnan ku ta traha riba e mesun kos.',
        },
      },
    ],
    /* Aangeleverd door de stichting zelf (07-08-2026). cdoaf = Curaçao
       Diaspora Of Africa Foundation, .cw = Curaçao, dus dit hoort hier en niet
       bij Bonaire of Nederland. Laat het wel even bevestigen. */
    email: 'cdoaf.cw@gmail.com',
    /* Uittreksel Handelsregister Curaçao (dossiernummer 170355) en het
       Belastingplichtige-blad met het CRIB-nummer, allebei aangeleverd op
       18-08-2026. Adres, oprichtingsdatum en beide nummers komen daar
       woordelijk vandaan. */
    adres: 'Kaya Afido 51 B, Curaçao',
    opgericht: '2025-04-16',
    kvk: '170355',
    crib: '102733703',
    rsin: null,
    socials: [
      {soort: 'facebook', url: 'https://www.facebook.com/profile.php?id=61577495043318'},
      {soort: 'instagram', url: 'https://www.instagram.com/curacao_diaspora/'},
      {soort: 'linkedin', url: 'https://www.linkedin.com/in/cura%C3%A7ao-diaspora-of-africa-fundation-8393a7373/'},
    ],
    logo: '/img/logo-curacao.png',
    logoVorm: '/img/logo-curacao-vorm.png',
    logoDoek: '/img/logo-curacao-doek.png',
    logoKern: '/img/logo-curacao-kern.png',
    beeld: '/img/curacao-ondertekening.webp',
    beeldBij: {
      /* Eigen foto van de stichting. Links Dévid W. Eusenia, herkenbaar aan de
         Afrika-hanger en de bril op zijn hoofd; wie er rechts zit weten wij
         niet, dus dat staat er niet bij. */
      nl: 'Dévid W. Eusenia tekent de stukken, Curaçao',
      en: 'Dévid W. Eusenia signing the documents, Curaçao',
      pap: 'Dévid W. Eusenia ta firma e dokumentonan, Kòrsou',
    },
    anbi: false,
    /* Door de stichting zelf aangeleverd (Dévid W. Eusenia, 07-08-2026). Het
       Engels is zijn eigen tekst, woordelijk; het Nederlands en het Papiamentu
       zijn onze vertaling daarvan. */
    missie: {
      en: 'To represent and support the descendants of enslaved people by promoting historical research, community development, education, and cultural preservation, with a special focus on the connection between Africa and Curaçao.',
      nl: 'De nakomelingen van tot slaaf gemaakte mensen vertegenwoordigen en steunen, door historisch onderzoek, gemeenschapsontwikkeling, educatie en het behoud van cultuur te bevorderen, met bijzondere aandacht voor de band tussen Afrika en Curaçao.',
      pap: 'Representá i sostené e desendientenan di hendenan ku a wòrdu hasí katibu, dor di promové investigashon históriko, desaroyo di komunidat, edukashon i konservashon di kultura, ku atenshon spesial pa e laso entre Africa i Kòrsou.',
    },
    visie: {
      en: 'To build an informed, resilient, and united society that acknowledges its history, preserves its African heritage, and works toward justice and sustainable development.',
      nl: 'Bouwen aan een geïnformeerde, veerkrachtige en verenigde samenleving die haar geschiedenis erkent, haar Afrikaanse erfgoed bewaart en werkt aan rechtvaardigheid en duurzame ontwikkeling.',
      pap: 'Konstruí un sosiedat informá, resiliente i uní ku ta rekonosé su historia, ta konservá su herensia afrikano i ta traha riba hustisia i desaroyo sostenibel.',
    },
    taken: [
      {
        nr: 1,
        tekst: {
          en: 'Represent descendants of enslaved people on a local, regional, and international level.',
          nl: 'De nakomelingen van tot slaaf gemaakte mensen vertegenwoordigen op lokaal, regionaal en internationaal niveau.',
          pap: 'Representá e desendientenan di hendenan ku a wòrdu hasí katibu na nivel lokal, regional i internashonal.',
        },
      },
      {
        nr: 2,
        tekst: {
          en: 'Conduct historical and scientific research on slavery in Curaçao, particularly in the Bandariba region.',
          nl: 'Historisch en wetenschappelijk onderzoek doen naar de slavernij op Curaçao, in het bijzonder in het gebied Bandariba.',
          pap: 'Hasi investigashon históriko i sientífiko riba sklabitut na Kòrsou, en partikular den e region Bandariba.',
        },
      },
      {
        nr: 3,
        tekst: {
          en: 'Investigate the scope of reparations for the legacy of slavery.',
          nl: 'De omvang van de herstelbetalingen voor de nalatenschap van de slavernij onderzoeken.',
          pap: 'Investigá e magnitut di e pago di reparashon pa e legado di sklabitut.',
        },
      },
      {
        nr: 4,
        tekst: {
          en: 'Develop educational curricula based on research findings to share with schools and communities.',
          nl: 'Lesprogramma’s ontwikkelen op basis van de onderzoeksresultaten, om te delen met scholen en gemeenschappen.',
          pap: 'Desaroyá kuríkulo edukativo basá riba e resultadonan di investigashon, pa kompartí ku skol i komunidat.',
        },
      },
      {
        nr: 5,
        tekst: {
          en: 'Promote collaboration between the foundation and local neighborhoods and schools.',
          nl: 'De samenwerking tussen de stichting en de buurten en scholen op het eiland bevorderen.',
          pap: 'Promové e koperashon entre e fundashon i e barionan i skolnan lokal.',
        },
      },
      {
        nr: 6,
        tekst: {
          en: 'Serve as an intermediary between governments, private entities, and similar organizations.',
          nl: 'Optreden als tussenpersoon tussen overheden, particuliere partijen en verwante organisaties.',
          pap: 'Sirbi komo intermediario entre gobiernu, entidat privá i organisashon similar.',
        },
      },
      {
        nr: 7,
        tekst: {
          en: 'Improve communication and support among like-minded foundations.',
          nl: 'De communicatie en de onderlinge steun tussen gelijkgestemde stichtingen verbeteren.',
          pap: 'Mehorá e komunikashon i e apoyo mutuo entre fundashonnan ku mesun ideal.',
        },
      },
      {
        nr: 8,
        tekst: {
          en: 'Research Curaçao’s original inhabitants.',
          nl: 'Onderzoek doen naar de oorspronkelijke bewoners van Curaçao.',
          pap: 'Hasi investigashon riba e habitantenan original di Kòrsou.',
        },
      },
      {
        nr: 9,
        tekst: {
          en: 'Support emancipation efforts for former Netherlands Antilles territories.',
          nl: 'De emancipatie van de voormalige Nederlands-Antilliaanse gebieden ondersteunen.',
          pap: 'Sostené e esfuersonan di emansipashon pa e antiguo teritorionan di Antia Hulandes.',
        },
      },
      {
        nr: 10,
        tekst: {
          en: 'Restore historic country houses (landhuizen).',
          nl: 'Historische landhuizen herstellen.',
          pap: 'Restourá kasnan di kunuku históriko.',
        },
      },
      {
        nr: 11,
        tekst: {
          en: 'Foster inclusivity and reject all forms of discrimination.',
          nl: 'Inclusiviteit bevorderen en elke vorm van discriminatie afwijzen.',
          pap: 'Promové inklusividat i rechasá tur forma di diskriminashon.',
        },
      },
      {
        /* Punt 12 is geen afgekapte zin maar een kop boven zijn eigen lijst,
           net als punt 13 ('... to:'). Vandaar de dubbele punt en geen
           `onvolledig`-markering. */
        nr: 12,
        tekst: {
          en: 'Organize sustainable community:',
          nl: 'Duurzame gemeenschap organiseren:',
          pap: 'Organisá komunidat sostenibel:',
        },
        punten: [
          {en: 'Agriculture', nl: 'Landbouw', pap: 'Agrikultura'},
          {en: 'Nature preservation', nl: 'Natuurbehoud', pap: 'Konservashon di naturalesa'},
          {en: 'Livestock care', nl: 'Veeverzorging', pap: 'Kuido di bestia'},
          {en: 'Poverty reduction', nl: 'Armoedebestrijding', pap: 'Redukshon di pobresa'},
          {
            en: 'Gardening and landscaping',
            nl: 'Tuinieren en landschapsonderhoud',
            pap: 'Hardinería i mantenshon di paisahe',
          },
          {
            en: 'Tree pruning and maintenance',
            nl: 'Bomen snoeien en onderhouden',
            pap: 'Kap i mantenshon di palu',
          },
        ],
      },
      {
        nr: 13,
        tekst: {
          en: 'Establish and operate a kunuku (rural farm) to:',
          nl: 'Een kunuku opzetten en beheren, om:',
          pap: 'Establesé i maneha un kunuku, pa:',
        },
        punten: [
          {
            en: 'Educate and guide the community',
            nl: 'De gemeenschap voorlichten en begeleiden',
            pap: 'Eduká i guia e komunidat',
          },
          {
            en: 'Promote traditional agricultural practices',
            nl: 'Traditionele landbouwmethoden bevorderen',
            pap: 'Promové métodonan tradishonal di kunuku',
          },
          {
            en: 'Preserve cultural heritage',
            nl: 'Cultureel erfgoed behouden',
            pap: 'Konservá herensia kultural',
          },
          {
            en: 'Develop nature trails, museums, playgrounds, and greenhouses',
            nl: 'Natuurpaden, musea, speelplaatsen en kassen ontwikkelen',
            pap: 'Desaroyá kaminda di naturalesa, museo, plenchi di hunga i kas di mata',
          },
        ],
      },
    ],
  },
  {
    id: 'nederland',
    naam: 'Stichting The Netherlands Diaspora Of Africa Foundation',
    kort: {nl: 'Nederland', en: 'The Netherlands', pap: 'Hulanda'},
    plaats: {nl: 'Helmond, Nederland', en: 'Helmond, the Netherlands', pap: 'Helmond, Hulanda'},
    accent: '#a4482f',
    accentZacht: '#d8815b',
    grond: '#3a1a12',
    merk: 'eban',
    status: {
      nl: 'Nieuw opgericht, met ANBI-status als uitgangspunt',
      en: 'Newly founded, with Dutch public benefit (ANBI) status as the starting point',
      pap: 'Resien fundá, ku e estatus ANBI komo punto di salida',
    },
    intro: {
      nl: 'De Nederlandse stichting is de jongste van de drie. Zij verbindt het werk op de eilanden met de Caribische gemeenschap in Nederland, en is het aanspreekpunt voor partners, fondsen en donateurs hier.',
      en: 'The Dutch foundation is the youngest of the three. It connects the work on the islands with the Caribbean community in the Netherlands, and is the point of contact for partners, funds and donors here.',
      pap: 'E fundashon hulandes ta e mas hoben di e tres. E ta konektá e trabou riba e islanan ku e komunidat karibense na Hulanda, i e ta e punto di kontakto pa partnernan, fondonan i donantenan akinan.',
    },
    tekst: [
      {
        nl: 'Een groot deel van de Bonairiaanse en Curaçaose gemeenschap woont in Nederland. Voor hen is de geschiedenis van de eilanden niet ver weg, maar wel moeilijker bij te houden. De Nederlandse stichting maakt het onderzoek en het lesmateriaal van de eilanden hier bereikbaar, en organiseert ontmoeting rond de herdenkingsdagen die er toe doen.',
        en: 'A large part of the Bonairean and Curaçaoan community lives in the Netherlands. For them the history of the islands is not far away, but it is harder to keep up with. The Dutch foundation makes the research and the teaching material from the islands available here, and brings people together around the days of remembrance that matter.',
        pap: 'Un gran parti di e komunidat boneriano i kòrsouwenan ta biba na Hulanda. Pa nan e historia di e islanan no ta leu, pero sí ta mas difísil pa keda al dia kuné. E fundashon hulandes ta hasi e investigashon i e material di siñansa di e islanan alkansabel akinan, i ta organisá enkuentro rònt di e dianan di konmemorashon ku ta konta.',
      },
      {
        nl: 'Daarnaast is deze stichting het adres voor samenwerking met Nederlandse partners: gemeenten, fondsen, onderwijsinstellingen en particuliere donateurs. Omdat zij de ANBI-status voert, publiceert zij hieronder alles wat de Belastingdienst voorschrijft.',
        en: 'This foundation is also the address for working with Dutch partners: municipalities, funds, schools and private donors. Because it holds ANBI status, it publishes everything the Dutch tax authority requires below.',
        pap: 'Ademas, e fundashon aki ta e adres pa koperashon ku partnernan hulandes: munisipionan, fondonan, instansianan di enseñansa i donantenan privá. Komo ku e ta karga e estatus ANBI, e ta publiká abou tur loke e Servisio di Belasting ta eksigí.',
      },
    ],
    focus: [
      {
        kop: {nl: 'De gemeenschap hier', en: 'The community here', pap: 'E komunidat akinan'},
        uitleg: {
          nl: 'Ontmoeting en programma voor de Caribische gemeenschap in Nederland, rond de herdenkingsdagen en daarbuiten.',
          en: 'Gatherings and programme for the Caribbean community in the Netherlands, around the days of remembrance and beyond.',
          pap: 'Enkuentro i programa pa e komunidat karibense na Hulanda, rònt di e dianan di konmemorashon i tambe pafó di nan.',
        },
      },
      {
        kop: {nl: 'Kennis doorgeven', en: 'Passing on knowledge', pap: 'Pasa konosementu aden'},
        uitleg: {
          nl: 'Het onderzoek en lesmateriaal van de eilanden toegankelijk maken voor scholen en instellingen in Nederland.',
          en: 'Making the research and teaching material from the islands available to schools and institutions in the Netherlands.',
          pap: 'Hasi e investigashon i material di siñansa di e islanan alkansabel pa skol i instansia na Hulanda.',
        },
      },
      {
        kop: {nl: 'Partners en fondsen', en: 'Partners and funds', pap: 'Partner i fondo'},
        uitleg: {
          nl: 'Aanspreekpunt voor gemeenten, fondsen en organisaties die willen samenwerken of bijdragen.',
          en: 'The point of contact for municipalities, funds and organisations that want to work together or contribute.',
          pap: 'Punto di kontakto pa munisipio, fondo i organisashon ku ke traha huntu of kontribuí.',
        },
      },
      {
        kop: {nl: 'Verantwoording', en: 'Accountability', pap: 'Rendishon di kuenta'},
        uitleg: {
          nl: 'Als ANBI publiceert de stichting haar beleidsplan, bestuur, beloningsbeleid en jaarlijkse verantwoording.',
          en: 'As an ANBI the foundation publishes its policy plan, board, remuneration policy and annual accounts.',
          pap: 'Komo ANBI e fundashon ta publiká su plan di maneho, su direktiva, su maneho di remunerashon i su rendishon anual.',
        },
      },
    ],
    /* Aangeleverd op 18-08-2026: het KVK-blad van de Nederlandse stichting
       (Helmond, Kortenaerstraat 28, KVK 42130908) en het e-mailadres. Zij
       melden er zelf bij dat alle adressen later naar een eigen domein
       (3diaspora.org) gaan, dus dit is een tussenstand. Een CRIB-nummer staat
       hier bewust op false: dat bestaat in Nederland niet. */
    email: 'info.tnda@gmail.com',
    adres: 'Kortenaerstraat 28, Helmond',
    opgericht: null,
    kvk: '42130908',
    crib: false,
    rsin: null,
    socials: [],
    logo: '/img/logo-nederland.png',
    logoVorm: '/img/logo-nederland-vorm.png',
    logoDoek: '/img/logo-nederland-doek.png',
    logoKern: '/img/logo-nederland-kern.png',
    /* Dévid W. Eusenia opent deze pagina op zijn eigen verzoek: hij tekende bij
       alle drie de notarissen, en dat is precies wat deze samenwerking is. Hij
       is herkenbaar aan het geborduurde DÉVID W EUSENIA / PRESIDENT op zijn
       borstzak en het ronde stichtingsteken ernaast; dezelfde man staat op de
       foto van Curaçao en op die van Bonaire. */
    beeld: '/img/nl-ondertekening.webp',
    beeldBij: {
      nl: 'Dévid W. Eusenia tekent bij de notaris in Nederland, 4 augustus 2026',
      en: 'Dévid W. Eusenia signing at the notary in the Netherlands, 4 August 2026',
      pap: 'Dévid W. Eusenia ta firma serka e notario na Hulanda, 4 di ougùstùs 2026',
    },
    anbi: true,
  },
];

/**
 * De oprichting van de Nederlandse stichting bij Team notarissen.
 *
 * De datum komt uit de film die zij zelf hebben opgenomen: daar staat in beeld
 * "04-08-2026, inschrijving van: De stichting The Netherlands Diaspora
 * Foundation". Alles hieronder is dus hun eigen materiaal van die dag. De
 * bijschriften zeggen niet meer dan wat er te zien is. De man in het midden is
 * Dévid W. Eusenia, voorzitter; de twee vrouwen naast hem kennen wij nog niet
 * bij naam.
 */
export const OPRICHTING_NL = {
  datum: '2026-08-04',
  video: '/video/oprichting-nederland.mp4',
  poster: '/img/nl-video-poster.webp',
  fotos: [
    {
      /* De handtekeningfoto staat nu bovenaan deze pagina, dus hier de
         groepsfoto voor de gevel: die stond eerst bovenaan en raakt zo niet
         van de pagina af. */
      src: '/img/nl-notaris-drie.webp',
      bij: {
        nl: 'Voor de deur bij Team notarissen, met Dévid W. Eusenia in het midden',
        en: 'Outside Team notarissen, with Dévid W. Eusenia in the middle',
        pap: 'Pafó serka Team notarissen, ku Dévid W. Eusenia meimei',
      },
    },
    {
      src: '/img/nl-fondsenboek.webp',
      bij: {
        nl: 'Met het Fondsenboek 2026, na afloop voor de deur',
        en: 'With the 2026 funds directory, outside afterwards',
        pap: 'Ku e Fondsenboek 2026, pafó despues',
      },
    },
  ] as {src: string; bij: Tekst}[],
};

/**
 * De galerij: alle beelden van de drie stichtingen bij elkaar, met een echt
 * bijschrift eronder in plaats van een naamloos raster.
 *
 * Elk beeld draagt zijn herkomst, want die verschilt en dat moet zichtbaar zijn:
 * `eigen` is hun eigen foto, `archief` is een oude opname van hun site, `sfeer`
 * is een sfeerbeeld dat al op hun site stond en geen opname van eigen werk, en
 * `concept` is door ons gemaakt voor dit concept. De bijschriften zeggen niet
 * meer dan wat er te zien is; namen die wij niet weten verzinnen we niet.
 *
 * De afmetingen staan erbij zodat de pagina niet verspringt terwijl de beelden
 * binnenkomen. De beelden zelf worden niet bijgesneden: in de galerij houdt elk
 * beeld zijn eigen verhouding.
 */
export type Herkomst = 'eigen' | 'archief' | 'sfeer' | 'concept';

export type Beeld = {
  src: string;
  b: number;
  h: number;
  wie?: 'bonaire' | 'curacao' | 'nederland';
  herkomst: Herkomst;
  titel: Tekst;
  tekst: Tekst;
  alt: Tekst;
};

export const GALERIJ: Beeld[] = [
  {
    src: '/img/huisjes-zoutpan.webp',
    b: 1600,
    h: 893,
    wie: 'bonaire',
    herkomst: 'concept',
    titel: {
      nl: 'De huisjes bij de zoutpannen',
      en: 'The huts by the salt pans',
      pap: 'E kasnan banda di e saliñanan',
    },
    tekst: {
      nl: 'Aan de zuidkust van Bonaire staan de genummerde huisjes bij de zoutpannen. Hier sliepen de mensen die het zout met de hand oogstten. De plek staat er nog, en veel van het onderzoek begint daar.',
      en: 'On the south coast of Bonaire stand the numbered huts by the salt pans. This is where the people who harvested the salt by hand slept. The place is still there, and much of the research begins with it.',
      pap: 'Na kosta zùit di Boneiru e kasnan numerá ta pará banda di e saliñanan. Akinan e hendenan ku tabata kosechá e salu ku man tabata drumi. E lugá ta ainda einan, i hopi di e investigashon ta kuminsá einan.',
    },
    alt: {
      nl: 'De genummerde slavenhuisjes bij de zoutpannen op de zuidkust van Bonaire, in het late zonlicht',
      en: 'The numbered slave huts by the salt pans on the south coast of Bonaire, in the late sunlight',
      pap: 'E kasnan numerá di katibu banda di e saliñanan na kosta zùit di Boneiru, den lus di solo lat',
    },
  },
  {
    src: '/img/zoutpannen.webp',
    b: 1080,
    h: 792,
    wie: 'bonaire',
    herkomst: 'archief',
    titel: {nl: 'Werken op de zoutpannen', en: 'Working the salt pans', pap: 'Trabou riba e saliñanan'},
    tekst: {
      nl: 'Een oude opname van het werk op de zoutpannen: scheppen, kruiwagens en de witte bergen zout, met de obelisk op de achtergrond. Deze foto stond al op de site van de Bonairiaanse stichting.',
      en: 'An old photograph of the work on the salt pans: shovels, wheelbarrows and the white mounds of salt, with the obelisk behind. This picture was already on the Bonaire foundation’s own site.',
      pap: 'Un portrèt bieu di e trabou riba e saliñanan: pala, garoshi i e serunan blanku di salu, ku e obelisko patras. E portrèt aki tabata kaba riba e sitio di e fundashon di Boneiru.',
    },
    alt: {
      nl: 'Historische opname van arbeiders die zout scheppen op de zoutpannen van Bonaire',
      en: 'Historic photograph of workers shovelling salt on the salt pans of Bonaire',
      pap: 'Portrèt históriko di trahadónan ta pala salu riba e saliñanan di Boneiru',
    },
  },
  {
    src: '/img/portret-werk.webp',
    b: 1000,
    h: 1500,
    wie: 'bonaire',
    herkomst: 'eigen',
    titel: {nl: 'Dévid W Eusenia, voorzitter', en: 'Dévid W Eusenia, chair', pap: 'Dévid W Eusenia, presidente'},
    tekst: {
      nl: 'De voorzitter van de Bonaire Diaspora Of Africa Foundation, met de omtrek van Afrika aan zijn ketting en het zegel van de stichting op zijn hemd.',
      en: 'The chair of the Bonaire Diaspora Of Africa Foundation, with the outline of Africa on his necklace and the seal of the foundation on his shirt.',
      pap: 'E presidente di e Bonaire Diaspora Of Africa Foundation, ku e kontorno di Africa na su kadena i e seyo di e fundashon riba su kamisa.',
    },
    alt: {
      nl: 'Dévid W Eusenia staat voor een groot rond schilderij in blauw en groen',
      en: 'Dévid W Eusenia standing in front of a large round painting in blue and green',
      pap: 'Dévid W Eusenia pará dilanti un pintura grandi i rondó den blou i berde',
    },
  },
  {
    src: '/img/bonaire-notaris-vol.webp',
    b: 1200,
    h: 1144,
    wie: 'bonaire',
    herkomst: 'eigen',
    titel: {nl: 'De hand erop, Bonaire', en: 'Hands on it, Bonaire', pap: 'Man riba dje, Boneiru'},
    tekst: {
      nl: 'De ondertekening bij de notaris op Bonaire, met voorzitter Dévid W. Eusenia rechts. Dezelfde wand met ingelijste documenten staat op de foto van de stukken op tafel, dus dit is dezelfde dag. Wie de vrouw naast hem is, geven zij ons nog door.',
      en: 'The signing at the notary on Bonaire, with chair Dévid W. Eusenia on the right. The same wall of framed documents appears in the photograph of the papers on the table, so this is the same day. Who the woman beside him is, they will still let us know.',
      pap: 'E firmamentu serka e notario na Boneiru, ku presidente Dévid W. Eusenia na man drechi. E mesun muraya ku dokumento den lijst ta sali den e potrèt di e dokumentonan riba mesa, pues esaki ta e mesun dia. Ken e señora banda di dje ta, nan lo pasa nos ainda.',
    },
    alt: {
      nl: 'Een vrouw en Dévid W. Eusenia geven elkaar een hand aan de tafel bij de notaris op Bonaire',
      en: 'A woman and Dévid W. Eusenia shaking hands at the notary’s table on Bonaire',
      pap: 'Un señora i Dévid W. Eusenia ta duna otro man na e mesa serka e notario na Boneiru',
    },
  },
  {
    src: '/img/ondertekening.webp',
    b: 1080,
    h: 1440,
    wie: 'bonaire',
    herkomst: 'eigen',
    titel: {nl: 'De stukken op tafel', en: 'The papers on the table', pap: 'E dokumentonan riba mesa'},
    tekst: {
      nl: 'Drie mensen aan tafel met de getekende stukken in de hand, tegen een wand vol ingelijste documenten. Een stichting begint met papierwerk, en dit is de dag dat het rond was.',
      en: 'Three people at a table with the signed papers in hand, against a wall full of framed documents. A foundation begins with paperwork, and this is the day it was done.',
      pap: 'Tres hende na mesa ku e dokumentonan firmá den man, dilanti un muraya yen di dokumento den lijst. Un fundashon ta kuminsá ku papelnan, i esaki ta e dia ku tur kos tabata kla.',
    },
    alt: {
      nl: 'Drie mensen aan een tafel houden samen een getekend document omhoog',
      en: 'Three people at a table holding up a signed document together',
      pap: 'Tres hende na un mesa ta lanta un dokumento firmá huntu',
    },
  },
  {
    src: '/img/curacao-ondertekening.webp',
    b: 1100,
    h: 1467,
    wie: 'curacao',
    herkomst: 'eigen',
    titel: {nl: 'Het tekenen op Curaçao', en: 'Signing on Curaçao', pap: 'Firmando na Kòrsou'},
    tekst: {
      nl: 'Links Dévid W. Eusenia, die de stukken van de Curaçaose stichting tekent. Wie er rechts naast hem zit geven zij ons nog door.',
      en: 'On the left Dévid W. Eusenia, signing the papers of the Curaçao foundation. Who is sitting beside him on the right, they will still let us know.',
      pap: 'Na man robes Dévid W. Eusenia, ku ta firma e dokumentonan di e fundashon di Kòrsou. Ken ta sintá na su man drechi, nan lo pasa nos ainda.',
    },
    alt: {
      nl: 'Dévid W. Eusenia en een tweede man aan een tafel met de stukken voor zich, achter hen een wand van glasbouwstenen',
      en: 'Dévid W. Eusenia and a second man at a table with the papers in front of them, a wall of glass blocks behind them',
      pap: 'Dévid W. Eusenia i un di dos hòmber na un mesa ku e dokumentonan nan dilanti, patras un muraya di blòki di glas',
    },
  },
  {
    src: '/img/nl-notaris-drie.webp',
    b: 1067,
    h: 1600,
    wie: 'nederland',
    herkomst: 'eigen',
    titel: {nl: 'Voor de deur bij de notaris', en: 'Outside the notary', pap: 'Pafó serka e notario'},
    tekst: {
      nl: 'Op 4 augustus 2026 werd de Nederlandse stichting ingeschreven bij Team notarissen. Vanaf die dag heeft het werk op de eilanden ook een adres in Nederland.',
      en: 'On 4 August 2026 the Dutch foundation was registered at Team notarissen. From that day the work on the islands also has an address in the Netherlands.',
      pap: 'Riba 4 di ougùstùs 2026 e fundashon hulandes a wòrdu inskribí serka Team notarissen. For di e dia ei e trabou riba e islanan tin tambe un adres na Hulanda.',
    },
    alt: {
      nl: 'Drie mensen staan voor de gevel van Team notarissen, met Dévid W. Eusenia in het midden',
      en: 'Three people standing outside the Team notarissen building, with Dévid W. Eusenia in the middle',
      pap: 'Tres hende pará dilanti e edifisio di Team notarissen, ku Dévid W. Eusenia meimei',
    },
  },
  {
    src: '/img/nl-ondertekening.webp',
    b: 1066,
    h: 1600,
    wie: 'nederland',
    herkomst: 'eigen',
    titel: {nl: 'De handtekening', en: 'The signature', pap: 'E firma'},
    tekst: {
      nl: 'Dévid W. Eusenia tekent de akte aan de tafel bij de notaris. Een half blaadje papier, en daarna bestaat er een stichting die hier vragen, fondsen en donateurs kan opvangen. Hij tekende bij alle drie de notarissen: op Bonaire, op Curaçao en hier.',
      en: 'Dévid W. Eusenia signing the deed at the notary’s table. Half a sheet of paper, and after it there is a foundation that can take questions, funds and donors here. He signed at all three notaries: on Bonaire, on Curaçao and here.',
      pap: 'Dévid W. Eusenia ta firma e akto na e mesa serka e notario. Mei un blachi di papel, i despues tin un fundashon ku por risibí pregunta, fondo i donante akinan. El a firma serka tur tres notario: na Boneiru, na Kòrsou i akinan.',
    },
    alt: {
      nl: 'Dévid W. Eusenia in lichtgrijs colbert tekent een document aan een houten tafel',
      en: 'Dévid W. Eusenia in a light grey jacket signing a document at a wooden table',
      pap: 'Dévid W. Eusenia den un saku shinishi kla ta firma un dokumento na un mesa di palu',
    },
  },
  {
    src: '/img/nl-fondsenboek.webp',
    b: 960,
    h: 1600,
    wie: 'nederland',
    herkomst: 'eigen',
    titel: {nl: 'Met het Fondsenboek 2026', en: 'With the 2026 funds directory', pap: 'Ku e Fondsenboek 2026'},
    tekst: {
      nl: 'Na afloop voor de gevel, met het Fondsenboek 2026 in de hand. Daarin staat welke fondsen dit soort werk steunen, en dat is meteen de volgende stap na de oprichting.',
      en: 'Outside afterwards, holding the 2026 funds directory. It lists the funds that support work like this, and that is the next step straight after the founding.',
      pap: 'Pafó despues, ku e Fondsenboek 2026 den man. Aden ta pará ki fondonan ta sostené e sorto di trabou aki, i esei ta e siguiente paso mesora despues di e fundashon.',
    },
    alt: {
      nl: 'Twee mensen houden samen het Fondsenboek 2026 vast voor de gevel van de notaris',
      en: 'Two people holding the 2026 funds directory together outside the notary',
      pap: 'Dos hende ta tene e Fondsenboek 2026 huntu pafó serka e notario',
    },
  },
  {
    src: '/img/samen.webp',
    b: 1200,
    h: 1440,
    wie: 'bonaire',
    herkomst: 'eigen',
    titel: {nl: 'Proosten na afloop', en: 'A toast afterwards', pap: 'Un salú despues'},
    tekst: {
      nl: 'Het bestuur brengt samen een toost uit na een bijeenkomst. Het werk gaat over een zware geschiedenis, maar de mensen die het doen, doen het met elkaar.',
      en: 'The board raising a glass together after a meeting. The work is about a heavy history, but the people who do it, do it with one another.',
      pap: 'E direktiva ta lanta glas huntu despues di un reunion. E trabou ta trata un historia pisá, pero e hendenan ku ta hasi’é, ta hasi’é ku otro.',
    },
    alt: {
      nl: 'Vijf mensen brengen samen een toost uit in een lichte ruimte met houten plafond',
      en: 'Five people raising a toast together in a bright room with a wooden ceiling',
      pap: 'Sinku hende ta lanta un salú huntu den un sala kla ku plafòn di palu',
    },
  },
  {
    src: '/img/leren.webp',
    b: 1600,
    h: 1045,
    herkomst: 'sfeer',
    titel: {nl: 'Kennis doorgeven', en: 'Passing on knowledge', pap: 'Pasa konosementu aden'},
    tekst: {
      nl: 'Lesmateriaal maken op basis van het eigen onderzoek is een van de twaalf statutaire taken. Dit beeld stond al op hun site; een foto uit een echte les zou hier sterker staan.',
      en: 'Making teaching material out of their own research is one of the twelve statutory tasks. This image was already on their site; a photograph from a real lesson would be stronger here.',
      pap: 'Traha material di siñansa basá riba nan mes investigashon ta un di e diesdos tareanan statutario. E imagen aki tabata kaba riba nan sitio; un portrèt di un lès di berdat lo ta mas fuerte akinan.',
    },
    alt: {
      nl: 'Een moeder en haar kind lezen samen in een boek aan tafel',
      en: 'A mother and her child reading a book together at a table',
      pap: 'Un mama ku su yu ta lesa un buki huntu na mesa',
    },
  },
  {
    src: '/img/generaties.webp',
    b: 1100,
    h: 1366,
    herkomst: 'concept',
    titel: {nl: 'Van oma op kleindochter', en: 'From grandmother to granddaughter', pap: 'For di wela pa su ñetu'},
    tekst: {
      nl: 'Twee generaties bij oude familiefoto’s en een handgeschreven brief. Wat nooit is opgeschreven wordt thuis doorverteld, en juist dat probeert het onderzoek vast te leggen voordat het verdwijnt.',
      en: 'Two generations over old family photographs and a handwritten letter. What was never written down is passed on at home, and that is exactly what the research tries to record before it goes.',
      pap: 'Dos generashon serka portrèt bieu di famia i un karta skirbí na man. Loke nunka a wòrdu skirbí ta wòrdu kontá na kas, i ta presis esei e investigashon ta purba dokumentá promé ku e disparsé.',
    },
    alt: {
      nl: 'Een oma en haar kleindochter bekijken samen oude zwart-witfoto’s aan een houten tafel',
      en: 'A grandmother and her granddaughter looking through old black and white photographs at a wooden table',
      pap: 'Un wela ku su ñetu ta wak portrètnan bieu blanku i pretu na un mesa di palu',
    },
  },
];

/** Het bestuur van de Bonairiaanse stichting, van hun eigen ledenpagina. */
export const BESTUUR_BONAIRE: {naam: string; rol: Tekst; foto: string}[] = [
  {
    naam: 'Dévid W Eusenia',
    rol: {nl: 'Voorzitter', en: 'Chair', pap: 'Presidente'},
    foto: '/img/bestuur-eusenia.webp',
  },
  {
    naam: 'Indra Yguara-Sillié',
    rol: {nl: 'Vicevoorzitter', en: 'Vice-chair', pap: 'Vise-presidente'},
    foto: '/img/bestuur-yguara.webp',
  },
  {
    naam: 'Hein Coffie',
    rol: {nl: 'Secretaris', en: 'Secretary', pap: 'Sekretario'},
    foto: '/img/bestuur-coffie.webp',
  },
  {
    naam: 'Solange Silié',
    rol: {nl: 'Penningmeester', en: 'Treasurer', pap: 'Tesorero'},
    foto: '/img/bestuur-silie-s.webp',
  },
  {
    naam: 'Igmar Silié',
    rol: {nl: 'Commissaris', en: 'Board member', pap: 'Miembro di direktiva'},
    foto: '/img/bestuur-silie-i.webp',
  },
];

/** De twaalf taken uit de statuten, zoals ze op hun eigen site staan. */
export const TAKEN: Tekst[] = [
  {
    nl: 'Nakomelingen van tot slaaf gemaakte mensen vertegenwoordigen op lokaal, regionaal en internationaal niveau.',
    en: 'Represent the descendants of enslaved people at local, regional and international level.',
    pap: 'Representá desendientenan di hendenan ku a wòrdu hasí katibu na nivel lokal, regional i internashonal.',
  },
  {
    nl: 'Historisch en wetenschappelijk onderzoek doen naar de slavernij, op Bonaire vooral in Rincon en Tera Cora.',
    en: 'Carry out historical and academic research into slavery, on Bonaire mainly in Rincon and Tera Cora.',
    pap: 'Hasi investigashon históriko i sientífiko riba sklabitut, na Boneiru prinsipalmente na Rincon i Tera Cora.',
  },
  {
    nl: 'Onderzoek doen naar de omvang van herstelbetalingen voor de nalatenschap van de slavernij.',
    en: 'Research the scale of reparations for the legacy of slavery.',
    pap: 'Hasi investigashon riba e magnitut di pago di reparashon pa e legado di sklabitut.',
  },
  {
    nl: 'Lesmateriaal ontwikkelen op basis van de onderzoeksresultaten, voor scholen en gemeenschappen.',
    en: 'Develop teaching material based on the research findings, for schools and communities.',
    pap: 'Desaroyá material di siñansa basá riba e resultadonan di investigashon, pa skol i komunidat.',
  },
  {
    nl: 'De samenwerking bevorderen tussen de stichting en buurten en scholen.',
    en: 'Strengthen the cooperation between the foundation and neighbourhoods and schools.',
    pap: 'Promové e koperashon entre e fundashon i e barionan i skolnan.',
  },
  {
    nl: 'Optreden als tussenpersoon tussen overheden, particuliere partijen en verwante organisaties.',
    en: 'Act as an intermediary between governments, private parties and kindred organisations.',
    pap: 'Aktua komo intermediario entre gobiernu, partido privá i organisashonnan afin.',
  },
  {
    nl: 'De communicatie en steun tussen gelijkgestemde stichtingen verbeteren.',
    en: 'Improve communication and support between like-minded foundations.',
    pap: 'Mehorá e komunikashon i e sosten entre fundashonnan ku ta pensa meskos.',
  },
  {
    nl: 'Onderzoek doen naar de oorspronkelijke bewoners van Bonaire.',
    en: 'Research the original inhabitants of Bonaire.',
    pap: 'Hasi investigashon riba e promé habitantenan di Boneiru.',
  },
  {
    nl: 'Emancipatie-inspanningen steunen voor de voormalige gebieden van de Nederlandse Antillen.',
    en: 'Support emancipation efforts for the former territories of the Netherlands Antilles.',
    pap: 'Sostené e esfuersonan di emansipashon pa e antiguo teritorionan di Antia Hulandes.',
  },
  {
    nl: 'Historische landhuizen herstellen.',
    en: 'Restore historic plantation houses.',
    pap: 'Restourá kasnan di kunuku históriko.',
  },
  {
    nl: 'Inclusiviteit bevorderen en elke vorm van discriminatie afwijzen.',
    en: 'Promote inclusion and reject every form of discrimination.',
    pap: 'Promové inklushon i rechasá tur forma di diskriminashon.',
  },
  {
    nl: 'Duurzame gemeenschapsprojecten organiseren.',
    en: 'Organise sustainable community projects.',
    pap: 'Organisá proyektonan sostenibel di komunidat.',
  },
];

/** De vier pijlers waarin die twaalf taken uiteenvallen. */
export const PIJLERS: {kop: Tekst; tekst: Tekst; beeld: string; alt: Tekst}[] = [
  {
    kop: {nl: 'Onderzoek', en: 'Research', pap: 'Investigashon'},
    tekst: {
      nl: 'Historisch en wetenschappelijk onderzoek naar de slavernij op de eilanden, naar de oorspronkelijke bewoners en naar wat rechtsherstel concreet zou moeten inhouden.',
      en: 'Historical and academic research into slavery on the islands, into the original inhabitants, and into what reparation should actually amount to.',
      pap: 'Investigashon históriko i sientífiko riba sklabitut na e islanan, riba e promé habitantenan i riba kiko reparashon mester nifiká konkretamente.',
    },
    beeld: '/img/ondertekening.webp',
    alt: {
      nl: 'Onderzoek en samenwerking aan tafel, met archiefstukken aan de wand',
      en: 'Research and cooperation around a table, with archive material on the wall',
      pap: 'Investigashon i koperashon na mesa, ku material di archivo na muraya',
    },
  },
  {
    kop: {nl: 'Educatie', en: 'Education', pap: 'Edukashon'},
    tekst: {
      nl: 'Lesmateriaal dat rechtstreeks op dat onderzoek is gebouwd, voor scholen en buurten. Niet de geschiedenis van een ander, maar die van het eiland zelf.',
      en: 'Teaching material built directly on that research, for schools and neighbourhoods. Not somebody else’s history, but that of the island itself.',
      pap: 'Material di siñansa konstruí direktamente riba e investigashon ei, pa skol i bario. No e historia di un otro, ma esun di e isla mes.',
    },
    beeld: '/img/leren.webp',
    alt: {
      nl: 'Een moeder en haar kind lezen samen aan tafel',
      en: 'A mother and her child reading together at a table',
      pap: 'Un mama ku su yu ta lesa huntu na mesa',
    },
  },
  {
    kop: {nl: 'Gemeenschap', en: 'Community', pap: 'Komunidat'},
    tekst: {
      nl: 'Samenwerking met buurten, scholen, overheden en verwante organisaties. De stichtingen zijn de brug daartussen, en houden elkaar onderling op de hoogte.',
      en: 'Working with neighbourhoods, schools, governments and kindred organisations. The foundations are the bridge between them, and keep each other informed.',
      pap: 'Traha huntu ku bario, skol, gobiernu i organisashonnan afin. E fundashonnan ta e puente entre nan, i ta mantené otro informá.',
    },
    beeld: '/img/samen.webp',
    alt: {
      nl: 'Leden van de stichting samen na een bijeenkomst',
      en: 'Members of the foundation together after a meeting',
      pap: 'Miembronan di e fundashon huntu despues di un reunion',
    },
  },
  {
    kop: {nl: 'Erfgoed', en: 'Heritage', pap: 'Herensia'},
    tekst: {
      nl: 'Behoud en herstel van wat er nog staat: de landhuizen, de slavenhuisjes bij de zoutpannen, en de herinnering aan wat daar gebeurd is.',
      en: 'Preserving and restoring what is still standing: the plantation houses, the slave huts by the salt pans, and the memory of what happened there.',
      pap: 'Konservashon i restourashon di loke ainda ta pará: e kasnan di kunuku, e kasnan di katibu banda di e saliñanan, i e memoria di loke a pasa einan.',
    },
    beeld: '/img/zoutpannen.webp',
    alt: {
      nl: 'Historische opname van arbeiders op de zoutpannen van Bonaire',
      en: 'Historic photograph of workers on the salt pans of Bonaire',
      pap: 'Portrèt históriko di trahadónan riba e saliñanan di Boneiru',
    },
  },
];

/**
 * Agenda. De herdenkingsdagen hieronder zijn echte, jaarlijks terugkerende data
 * en geen vulling. De eigen activiteiten van de stichtingen ontbreken nog, die
 * moeten van hen komen. Datum in ISO, zodat sorteren en vergelijken klopt.
 */
export type Soort = 'herdenking' | 'viering' | 'activiteit';

export type Activiteit = {
  datum: string;
  eind?: string;
  titel: Tekst;
  soort: Soort;
  waar: Tekst;
  wie: ('bonaire' | 'curacao' | 'nederland')[];
  tekst: Tekst;
};

export const SOORT_LABEL: Record<Soort, Tekst> = {
  herdenking: {nl: 'Herdenking', en: 'Remembrance', pap: 'Konmemorashon'},
  viering: {nl: 'Viering', en: 'Celebration', pap: 'Selebrashon'},
  activiteit: {nl: 'Activiteit', en: 'Event', pap: 'Aktividat'},
};

export const SOORT_KLEUR: Record<Soort, string> = {
  herdenking: '#16375a',
  viering: '#b89838',
  activiteit: '#1b5f70',
};

const EILANDEN: Tekst = {
  nl: 'Bonaire, Curaçao en Nederland',
  en: 'Bonaire, Curaçao and the Netherlands',
  pap: 'Boneiru, Kòrsou i Hulanda',
};

export const AGENDA: Activiteit[] = [
  {
    datum: '2026-09-06',
    titel: {nl: 'Dia di Boneiru', en: 'Dia di Boneiru', pap: 'Dia di Boneiru'},
    soort: 'viering',
    waar: {nl: 'Bonaire', en: 'Bonaire', pap: 'Boneiru'},
    wie: ['bonaire', 'nederland'],
    tekst: {
      nl: 'De dag van Bonaire, met de vlag, de muziek en het eigen verhaal van het eiland centraal.',
      en: 'The day of Bonaire, with the flag, the music and the island’s own story at its centre.',
      pap: 'E dia di Boneiru, ku e bandera, e músika i e historia propio di e isla na sentro.',
    },
  },
  {
    datum: '2026-10-10',
    titel: {nl: 'Dia di Pais Kòrsou', en: 'Dia di Pais Kòrsou', pap: 'Dia di Pais Kòrsou'},
    soort: 'viering',
    waar: {nl: 'Curaçao', en: 'Curaçao', pap: 'Kòrsou'},
    wie: ['curacao', 'nederland'],
    tekst: {
      nl: 'De dag waarop Curaçao in 2010 een zelfstandig land binnen het Koninkrijk werd.',
      en: 'The day Curaçao became an autonomous country within the Kingdom, in 2010.',
      pap: 'E dia ku Kòrsou a bira un pais outónomo den Reino, na 2010.',
    },
  },
  {
    datum: '2027-02-01',
    eind: '2027-02-28',
    titel: {nl: 'Black History Month', en: 'Black History Month', pap: 'Black History Month'},
    soort: 'herdenking',
    waar: EILANDEN,
    wie: ['bonaire', 'curacao', 'nederland'],
    tekst: {
      nl: 'Een maand lang aandacht voor de geschiedenis en de erfenis van de Afrikaanse diaspora.',
      en: 'A month of attention for the history and the legacy of the African diaspora.',
      pap: 'Un luna largu di atenshon pa e historia i e legado di e diáspora afrikano.',
    },
  },
  {
    datum: '2027-03-25',
    titel: {
      nl: 'Internationale herdenkingsdag slachtoffers slavernij',
      en: 'International Day of Remembrance of the Victims of Slavery',
      pap: 'Dia Internashonal di Konmemorashon di e Víktimanan di Sklabitut',
    },
    soort: 'herdenking',
    waar: {nl: 'Wereldwijd', en: 'Worldwide', pap: 'Mundialmente'},
    wie: ['bonaire', 'curacao', 'nederland'],
    tekst: {
      nl: 'De dag die de Verenigde Naties hebben ingesteld ter herdenking van de slachtoffers van de slavernij en de trans-Atlantische slavenhandel.',
      en: 'The day the United Nations set aside to remember the victims of slavery and the trans-Atlantic slave trade.',
      pap: 'E dia ku Nashonnan Uní a establesé pa kòrda e víktimanan di sklabitut i di e komèrsio trans-atlántiko di katibu.',
    },
  },
  {
    datum: '2027-07-01',
    titel: {
      nl: 'Keti Koti, Dia di Emansipashon',
      en: 'Keti Koti, Dia di Emansipashon',
      pap: 'Keti Koti, Dia di Emansipashon',
    },
    soort: 'herdenking',
    waar: EILANDEN,
    wie: ['bonaire', 'curacao', 'nederland'],
    tekst: {
      nl: 'De afschaffing van de slavernij in 1863. De belangrijkste dag van het jaar voor de stichtingen: herdenken van wat er is geweest en vieren wat er sindsdien is opgebouwd.',
      en: 'The abolition of slavery in 1863. The most important day of the year for the foundations: remembering what was, and celebrating what has been built since.',
      pap: 'E abolishon di sklabitut na 1863. E dia di mas importante di aña pa e fundashonnan: kòrda loke tabatin i selebrá loke a wòrdu konstruí for di e ora ei.',
    },
  },
  {
    datum: '2027-07-02',
    titel: {nl: 'Dia di Bandera', en: 'Dia di Bandera', pap: 'Dia di Bandera'},
    soort: 'viering',
    waar: {nl: 'Curaçao', en: 'Curaçao', pap: 'Kòrsou'},
    wie: ['curacao', 'nederland'],
    tekst: {
      nl: 'De vlagdag van Curaçao, een dag na Keti Koti.',
      en: 'The flag day of Curaçao, one day after Keti Koti.',
      pap: 'E dia di bandera di Kòrsou, un dia despues di Keti Koti.',
    },
  },
];

export const SOCIALS_ALGEMEEN = [
  {soort: 'facebook' as const, url: 'https://www.facebook.com/profile.php?id=61577495043318', label: 'Facebook'},
  {soort: 'instagram' as const, url: 'https://www.instagram.com/curacao_diaspora/', label: 'Instagram'},
  {soort: 'linkedin' as const, url: 'https://www.linkedin.com/in/cura%C3%A7ao-diaspora-of-africa-fundation-8393a7373/', label: 'LinkedIn'},
];

/** De ANBI-publicatieplicht, punt voor punt. `waarde: null` betekent: nog aan te leveren. */
export const ANBI_VELDEN: {kop: Tekst; waarde: string | null}[] = [
  {
    kop: {nl: 'Statutaire naam', en: 'Legal name', pap: 'Nòmber statutario'},
    waarde: 'Stichting The Netherlands Diaspora Of Africa Foundation',
  },
  {
    kop: {nl: 'Handelsnaam', en: 'Trading name', pap: 'Nòmber komersial'},
    waarde: 'Netherlands Diaspora Of Africa Foundation',
  },
  {kop: {nl: 'RSIN / fiscaal nummer', en: 'RSIN / tax number', pap: 'RSIN / number fiskal'}, waarde: null},
  {
    kop: {nl: 'KvK-nummer', en: 'Chamber of Commerce number', pap: 'Number di Kámara di Komersio'},
    waarde: '42130908',
  },
  {kop: {nl: 'Postadres', en: 'Postal address', pap: 'Adres postal'}, waarde: 'Kortenaerstraat 28, Helmond'},
  {kop: {nl: 'E-mailadres', en: 'Email address', pap: 'Adres di e-mail'}, waarde: 'info.tnda@gmail.com'},
  {kop: {nl: 'Telefoonnummer', en: 'Telephone number', pap: 'Number di telefòn'}, waarde: null},
];
