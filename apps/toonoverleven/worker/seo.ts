import { beeldVan } from '../src/inhoud/beelden';
import {
  CONTROLEDATUM_ISO,
  vindPagina,
  type Blok,
  type Kruimel,
  type Pagina,
  type PaginaSoort,
  type Tekst,
} from '../src/inhoud';
import { PAGINAS, SITE_NAAM, SITE_URL, absoluutUrl, kort, titelVan } from '../src/meta';

/**
 * Wat een zoekmachine en een AI-antwoordmachine van deze site te zien krijgen.
 *
 * De klant vergelijkt de oplevering punt voor punt met zijn eigen overdracht:
 * per pagina een unieke titel, omschrijving en canoniek adres, valide JSON-LD
 * voor Organization, WebSite, WebPage, BreadcrumbList, Article en FAQPage waar
 * het paginatype dat rechtvaardigt, een sitemap met lastmod, en een robots.txt
 * die OAI-SearchBot met naam toelaat. Dat staat daarom hier bij elkaar en niet
 * verspreid door de Worker: één bestand waarvan aantoonbaar is dat het aan dat
 * lijstje voldoet.
 *
 * Geen DOM en geen Cloudflare. De Worker gebruikt dit tijdens een verzoek, een
 * buildscript kan er dezelfde sitemap uit halen, en een test kan er los in
 * kijken.
 */

/* ------------------------------------------------------------------ */
/*  Wat de Worker hiervan gebruikt                                     */
/* ------------------------------------------------------------------ */

export type PaginaMeta = {
  titel: string;
  omschrijving: string;
  pad: string;
  beeld: string | null;
  type: 'website' | 'article';
  /** Alle JSON-LD voor deze pagina, al omgezet naar tekst. */
  jsonLd: string | null;
};

/** Eén knoop uit de @graph. Los type, zodat een aanroeper er ook een kan maken. */
export type JsonLdKnoop = Record<string, unknown>;

/**
 * De dag waarop de redactie van de 72 vastgestelde pagina's voor het laatst
 * inhoudelijk is nagelopen: de datum van de door het bestuur goedgekeurde
 * mock-up waar deze teksten letterlijk uit komen. Eén datum voor de hele site,
 * want er is er voorlopig maar één.
 *
 * De overdracht vraagt om een controledatum per pagina, beheerbaar in het CMS.
 * Zodra dat veld er is hoort het te winnen en is dit de terugval voor een
 * pagina die nog nooit is nagelopen.
 */
export const CONTROLEDATUM = CONTROLEDATUM_ISO;

/** Nederlands zoals schema.org het wil zien: taal én land. */
const TAAL = 'nl-NL';

/* ------------------------------------------------------------------ */
/*  Ontsnappen                                                         */
/* ------------------------------------------------------------------ */

/** XML kent vijf tekens die tekst kunnen laten ophouden tekst te zijn. */
const xml = (waarde: string) =>
  waarde
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

/**
 * JSON is veilig in een scripttag zodra `<` geen sluittag kan beginnen. Al
 * ontsnapt teruggeven scheelt de aanroeper het onthouden ervan, en een tweede
 * keer ontsnappen verandert er niets meer aan.
 */
const alsScript = (waarde: unknown) => JSON.stringify(waarde).replace(/</g, '\\u003c');

/* ------------------------------------------------------------------ */
/*  De vaste knopen: de stichting en de site                           */
/* ------------------------------------------------------------------ */

const ORGANISATIE = `${SITE_URL}/#organization`;
const WEBSITE = `${SITE_URL}/#website`;

/**
 * De stichting zelf.
 *
 * Deze knoop staat in de graaf van elke pagina, want een zoekmachine leest elke
 * pagina op zichzelf en een verwijzing naar een organisatie die daar niet
 * beschreven staat levert niets op. Binnen één pagina wordt hij daarna alleen
 * nog met `@id` aangehaald, zodat het adres, de openingstijden en het RSIN er
 * precies één keer staan.
 */
const STICHTING: JsonLdKnoop = {
  '@type': 'NGO',
  '@id': ORGANISATIE,
  name: SITE_NAAM,
  // Alleen de oude naam: wie daarop zoekt moet hier uitkomen. Een tweede
  // schrijfwijze van de huidige naam hoort hier niet, die is er maar één.
  alternateName: ['Toon Hermans Huis Zeewolde'],
  description: PAGINAS['/'].omschrijving,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/img/logo-vol.png`,
  image: `${SITE_URL}/img/deel.jpg`,
  telephone: '+31368450265',
  email: 'info@toonoverleven.nl',
  nonprofitStatus: 'NonprofitANBI',
  taxID: '820209685',
  identifier: [{ '@type': 'PropertyValue', propertyID: 'KvK', value: '32143598' }],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Mazerhard 37',
    postalCode: '3891 BR',
    addressLocality: 'Zeewolde',
    addressRegion: 'Flevoland',
    addressCountry: 'NL',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 52.333788, longitude: 5.538774 },
  // Dit moet meebewegen met de openingstijden die de pagina toont. Wijkt het af,
  // dan zegt de vermelding iets anders dan de bezoeker leest, en dat is precies
  // wat de overdracht van de klant verbiedt.
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '10:00', closes: '12:00' },
  ],
  sameAs: [
    'https://www.facebook.com/ToonHermansHuisZeewolde',
    'https://www.instagram.com/toon_over_leven_zeewolde/',
  ],
  memberOf: { '@type': 'Organization', name: 'IPSO', url: 'https://ipso.nl' },
  areaServed: ['Zeewolde', 'Harderwijk', 'Nijkerk', 'Almere', 'Ermelo', 'Putten'].map((naam) => ({
    '@type': 'City',
    name: naam,
  })),
};

/**
 * De site als geheel. Geen SearchAction: die belooft een zoekveld dat de site
 * niet heeft, en een belofte die de pagina niet waarmaakt hoort hier niet.
 */
const SITEKNOOP: JsonLdKnoop = {
  '@type': 'WebSite',
  '@id': WEBSITE,
  url: `${SITE_URL}/`,
  name: SITE_NAAM,
  alternateName: ['Toon Hermans Huis Zeewolde'],
  publisher: { '@id': ORGANISATIE },
  inLanguage: TAAL,
};

/* ------------------------------------------------------------------ */
/*  Van redactietekst naar kale zinnen                                 */
/* ------------------------------------------------------------------ */

/** De aankondiging dat een link elders opent hoort bij de link, niet bij de zin. */
const LINKUITLEG = /\s*\((?:opent op een andere website|opent in een nieuw tabblad)\)/gi;

/** Eén regel opgemaakte tekst als kale zin; wat in een link staat telt gewoon mee. */
function platteTekst(tekst: Tekst | undefined): string {
  if (!tekst?.length) return '';
  return tekst
    .map((stuk) => (typeof stuk === 'string' ? stuk : stuk.tekst))
    .join('')
    .replace(LINKUITLEG, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** De alinea's en opsommingspunten die een blok zichtbaar op de pagina zet. */
function blokTekst(blok: Blok): string[] {
  const regels: Tekst[] = [];
  if ('tekst' in blok && blok.tekst) regels.push(...blok.tekst);
  if ('punten' in blok && blok.punten) regels.push(...blok.punten);
  return regels.map(platteTekst).filter(Boolean);
}

/**
 * Een blok dat op de pagina zichtbaar een vraag stelt én beantwoordt.
 *
 * Alle drie de voorwaarden zijn hard: de kop is een vraag, er staan alinea's
 * onder, en die alinea's zijn het antwoord. Een kop met alleen een opsomming
 * eronder is een wegwijzer ("waar gaan de vragen over?") en geen antwoord, dus
 * die wordt hier geen Question. Zo krijgt een pagina alleen een FAQPage als er
 * werkelijk beantwoorde vragen op staan, wat de overdracht van de klant eist.
 */
function vraagUitBlok(blok: Blok): JsonLdKnoop | null {
  const kop = 'kop' in blok && typeof blok.kop === 'string' ? blok.kop.trim() : '';
  if (!kop.endsWith('?')) return null;
  const alineas = 'tekst' in blok && blok.tekst ? blok.tekst.map(platteTekst).filter(Boolean) : [];
  if (!alineas.length) return null;
  return {
    '@type': 'Question',
    name: kop,
    acceptedAnswer: { '@type': 'Answer', text: blokTekst(blok).join(' ') },
  };
}

/**
 * Het volledige antwoord zoals het op een vraagpagina staat: eerst het korte
 * antwoord in de lead, daarna de alinea's eronder. Letterlijk, niet ingekort en
 * niet naverteld, anders citeert een antwoordmachine iets wat er niet staat.
 */
function antwoordVan(pagina: Pagina): string {
  const delen = [platteTekst(pagina.hero.lead), platteTekst(pagina.hero.onder)];
  for (const blok of pagina.blokken) delen.push(...blokTekst(blok));
  return delen.filter(Boolean).join(' ');
}

/** De organisaties waar de kennislaag naartoe verwijst, op hun eigen domein. */
const BRONORGANISATIE: Record<string, string> = {
  'ipso.nl': 'IPSO',
  'kanker.nl': 'Kanker.nl',
  'kwf.nl': 'KWF Kankerbestrijding',
  'ayazorgnetwerk.nl': 'AYA Zorgnetwerk',
};

/** Wie er achter een bronlink zit, of niets als we dat niet met zekerheid weten. */
function uitgeverVan(href: string): string | undefined {
  try {
    return BRONORGANISATIE[new URL(href).hostname.replace(/^www\./, '')];
  } catch {
    return undefined;
  }
}

/**
 * Elke externe link die ergens in een stuk redactie als tekst zichtbaar staat.
 *
 * Recursief, omdat een link in een alinea, een opsomming, een kaart of een
 * inzicht kan zitten en die vormen blijven veranderen. Een knop naar buiten
 * heeft geen `tekst` maar een `label` en wordt daarom niet meegeteld: dat is
 * een vervolgstap en geen bronvermelding.
 */
function externeLinks(waarde: unknown, uit: Map<string, string>): void {
  if (Array.isArray(waarde)) {
    for (const deel of waarde) externeLinks(deel, uit);
    return;
  }
  if (!waarde || typeof waarde !== 'object') return;
  const { href, tekst } = waarde as { href?: unknown; tekst?: unknown };
  if (typeof href === 'string' && /^https?:/.test(href) && typeof tekst === 'string') {
    if (!uit.has(href)) uit.set(href, tekst.replace(LINKUITLEG, '').trim());
  }
  for (const deel of Object.values(waarde as Record<string, unknown>)) externeLinks(deel, uit);
}

/**
 * De bronnen die een pagina zichtbaar aanhaalt: eerst de bronkaarten met hun
 * eigen kop en organisatie, daarna de links in de lopende tekst. De klant vraagt
 * bij kennis- en vraagpagina's om bronorganisatie, brontitel en bron-URL, en dit
 * zijn precies de drie die de bezoeker daar ook ziet staan.
 */
function bronvermeldingen(pagina: Pagina): JsonLdKnoop[] {
  const gevonden = new Map<string, { naam: string; uitgever?: string }>();

  for (const blok of pagina.blokken) {
    if (blok.soort !== 'bronnen' || !blok.bronnen) continue;
    for (const bron of blok.bronnen) {
      if (!gevonden.has(bron.href)) gevonden.set(bron.href, { naam: bron.kop, uitgever: bron.bron });
    }
  }

  const links = new Map<string, string>();
  externeLinks(pagina.hero, links);
  externeLinks(pagina.blokken, links);
  for (const [href, naam] of links) {
    if (!gevonden.has(href) && naam) gevonden.set(href, { naam, uitgever: uitgeverVan(href) });
  }

  return [...gevonden].map(([href, { naam, uitgever }]) => ({
    '@type': 'WebPage',
    // Een link midden in een zin begint met een kleine letter; als titel van een
    // bron leest hij dan als een halve zin.
    name: naam.charAt(0).toUpperCase() + naam.slice(1),
    url: href,
    ...(uitgever ? { publisher: { '@type': 'Organization', name: uitgever } } : {}),
  }));
}

/* ------------------------------------------------------------------ */
/*  Wat elk paginatype krijgt                                          */
/* ------------------------------------------------------------------ */

/**
 * Het preciezere type naast WebPage.
 *
 * WebPage blijft er altijd bij staan, ook waar een scherper type volgt: de
 * overdracht vraagt letterlijk om WebPage op iedere pagina, en een lijst van
 * twee typen is geldig JSON-LD. FAQPage en QAPage staan hier niet in maar
 * worden pas toegevoegd als de pagina de bijbehorende vragen werkelijk toont.
 */
const EXTRA_PAGINATYPE: Record<PaginaSoort, string | null> = {
  home: null,
  hub: 'CollectionPage',
  route: null,
  regular: null,
  knowledge: null,
  question: null,
  faq: null,
  stories: 'CollectionPage',
  activities: 'CollectionPage',
  agenda: 'CollectionPage',
  contact: 'ContactPage',
  location: null,
  referrer: null,
};

/** De pagina's die een op zichzelf staand stuk uitleg zijn, met een auteur. */
const ARTIKELSOORTEN = new Set<PaginaSoort>(['knowledge', 'referrer']);

/** De pagina's waarvan het onderwerp de stichting zelf is: haar deur en haar huis. */
const OVER_DE_STICHTING = new Set<PaginaSoort>(['contact', 'location']);

/**
 * Waar een kennispagina over gaat, los van de vraagvorm van de kop.
 *
 * Wie "psychosociale ondersteuning bij kanker" opzoekt moet hier uitkomen zonder
 * de vraag letterlijk te stellen. Handmatig, want er zijn er zeven en een uit de
 * titel gegokt onderwerp zou niet beter zijn dan een gelezen onderwerp.
 */
const ONDERWERP: Record<string, string> = {
  '/kennis-en-wegwijzer/wat-is-een-centrum-voor-leven-met-en-na-kanker':
    'Centra voor leven met en na kanker',
  '/kennis-en-wegwijzer/wat-is-psychosociale-ondersteuning':
    'Psychosociale ondersteuning bij kanker',
  '/kennis-en-wegwijzer/praten-lotgenotencontact-of-professionele-hulp':
    'Lotgenotencontact en professionele hulp bij kanker',
  '/kennis-en-wegwijzer/wanneer-past-een-ipso-centrum': 'IPSO-centra voor leven met en na kanker',
  '/kennis-en-wegwijzer/emoties-energie-werk-en-relaties':
    'Gevolgen van kanker voor emoties, energie, werk en relaties',
  '/kennis-en-wegwijzer/passende-ondersteuning-vinden': 'Passende ondersteuning bij kanker vinden',
  '/voor-verwijzers': 'Verwijzen naar informele ondersteuning bij kanker',
};

/** De kruimels van de pagina, plus de pagina zelf als laatste stap. */
function kruimelpad(pagina: Pagina, id: string): JsonLdKnoop {
  const kruimels: Kruimel[] = pagina.kruimels?.length
    ? pagina.kruimels
    : [{ label: 'Home', href: '/' }];
  return {
    '@type': 'BreadcrumbList',
    '@id': id,
    itemListElement: kruimels.map((kruimel, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: kruimel.label,
      // De laatste kruimel draagt geen eigen adres, want dat is deze pagina.
      item: absoluutUrl(kruimel.href ?? pagina.pad),
    })),
  };
}

/**
 * De head van een van de 72 vastgestelde pagina's. Null als het adres er geen is.
 *
 * `extraKnopen` is er voor gegevens die pas tijdens een verzoek bestaan, zoals
 * de agendamomenten uit het beheer; zie `agendaKnopen`.
 */
export function metaVoorPagina(pad: string, extraKnopen: JsonLdKnoop[] = []): PaginaMeta | null {
  const pagina = vindPagina(pad);
  if (!pagina) return null;

  const url = absoluutUrl(pagina.pad);
  const paginaId = `${url}#webpage`;
  const kruimelId = `${url}#kruimelpad`;
  const foto = beeldVan(pagina);
  const beeld = foto ? absoluutUrl(foto.src) : null;

  const typen = ['WebPage'];
  const webpagina: JsonLdKnoop = {
    '@type': typen,
    '@id': paginaId,
    url,
    name: pagina.titel,
    // De volledige omschrijving, want dat is de zin die als lead op de pagina
    // staat. De metatag hieronder wordt wel ingekort tot wat een zoekresultaat
    // toont; dat is een andere vraag dan wat de pagina zegt.
    description: pagina.omschrijving,
    isPartOf: { '@id': WEBSITE },
    about: { '@id': ORGANISATIE },
    breadcrumb: { '@id': kruimelId },
    inLanguage: TAAL,
    dateModified: CONTROLEDATUM,
  };

  if (foto && beeld) {
    webpagina.primaryImageOfPage = { '@type': 'ImageObject', url: beeld, caption: foto.alt };
  }

  const extra = EXTRA_PAGINATYPE[pagina.soort];
  if (extra) typen.push(extra);

  if (OVER_DE_STICHTING.has(pagina.soort)) {
    webpagina.mainEntity = { '@id': ORGANISATIE };
  }

  if (pagina.soort === 'faq') {
    const vragen = pagina.blokken
      .map(vraagUitBlok)
      .filter((vraag): vraag is JsonLdKnoop => vraag !== null);
    if (vragen.length) {
      typen.push('FAQPage');
      webpagina.mainEntity = vragen;
    }
    // Een vraagpagina hoort haar bronnen te tonen; dat is hier de bronkaart
    // onder de antwoorden.
    const bronnen = bronvermeldingen(pagina);
    if (bronnen.length) webpagina.citation = bronnen;
  }

  // Eén vraag met één antwoord op een eigen adres zou je QAPage kunnen noemen,
  // maar de opdrachtgever vraagt in zijn eisen om FAQPage en zet dat in zijn
  // eigen voorstel ook op deze acht pagina's. Die keuze volgen we: het is hun
  // baseline, en het is wat er bij de beoordeling naast elkaar gelegd wordt.
  if (pagina.soort === 'question') {
    typen.push('FAQPage');
    const antwoord: JsonLdKnoop = { '@type': 'Answer', text: antwoordVan(pagina), url };
    const bronnen = bronvermeldingen(pagina);
    if (bronnen.length) antwoord.citation = bronnen;
    webpagina.mainEntity = [
      {
        '@type': 'Question',
        name: pagina.titel,
        answerCount: 1,
        acceptedAnswer: antwoord,
      },
    ];
  }

  const knopen: JsonLdKnoop[] = [STICHTING, SITEKNOOP, webpagina, kruimelpad(pagina, kruimelId)];

  if (ARTIKELSOORTEN.has(pagina.soort)) {
    const onderwerp = ONDERWERP[pagina.pad];
    const artikel: JsonLdKnoop = {
      '@type': 'Article',
      headline: pagina.titel,
      description: pagina.omschrijving,
      mainEntityOfPage: { '@id': paginaId },
      // Geen persoon maar de stichting: zij is de inhoudelijk eigenaar, en dat
      // is wat de overdracht onder auteurschap verstaat.
      author: { '@id': ORGANISATIE },
      publisher: { '@id': ORGANISATIE },
      about: onderwerp ? { '@type': 'Thing', name: onderwerp } : { '@id': ORGANISATIE },
      inLanguage: TAAL,
      dateModified: CONTROLEDATUM,
    };
    if (beeld) artikel.image = beeld;
    const bronnen = bronvermeldingen(pagina);
    if (bronnen.length) artikel.citation = bronnen;
    knopen.push(artikel);
  }

  knopen.push(...extraKnopen);

  // Een kennisstuk, een verwijzerspagina en een antwoord zijn redactie met een
  // eigen onderwerp; de rest van de site is de site zelf.
  const redactioneel = ARTIKELSOORTEN.has(pagina.soort) || pagina.soort === 'question';

  return {
    titel: titelVan(pagina.pad),
    omschrijving: kort(pagina.omschrijving),
    pad: pagina.pad,
    beeld,
    type: redactioneel ? 'article' : 'website',
    jsonLd: alsScript({ '@context': 'https://schema.org', '@graph': knopen }),
  };
}

/* ------------------------------------------------------------------ */
/*  Berichten uit het beheer                                           */
/* ------------------------------------------------------------------ */

/**
 * De graaf van één nieuwsbericht, in dezelfde vorm als de vaste pagina's: ook
 * hier hoort de stichting erbij en hoort een kruimelpad te staan.
 *
 * De aanroeper heeft het adres en de omschrijving al bepaald, want die regel
 * hoort bij de plek waar berichten uit het beheer gelezen worden.
 */
export function berichtJsonLd(bericht: {
  titel: string;
  omschrijving: string;
  pad: string;
  beeld?: string | null;
  gepubliceerd?: string;
  gewijzigd?: string;
}): string {
  const url = absoluutUrl(bericht.pad);
  const paginaId = `${url}#webpage`;
  const kruimelId = `${url}#kruimelpad`;

  const artikel: JsonLdKnoop = {
    '@type': 'NewsArticle',
    headline: bericht.titel,
    description: bericht.omschrijving,
    mainEntityOfPage: { '@id': paginaId },
    author: { '@id': ORGANISATIE },
    publisher: { '@id': ORGANISATIE },
    inLanguage: TAAL,
  };
  if (bericht.beeld) artikel.image = bericht.beeld;
  if (bericht.gepubliceerd) artikel.datePublished = bericht.gepubliceerd;
  if (bericht.gewijzigd ?? bericht.gepubliceerd) {
    artikel.dateModified = bericht.gewijzigd ?? bericht.gepubliceerd;
  }

  const webpagina: JsonLdKnoop = {
    '@type': ['WebPage', 'ItemPage'],
    '@id': paginaId,
    url,
    name: bericht.titel,
    description: bericht.omschrijving,
    isPartOf: { '@id': WEBSITE },
    about: { '@id': ORGANISATIE },
    breadcrumb: { '@id': kruimelId },
    inLanguage: TAAL,
  };
  if (bericht.gewijzigd ?? bericht.gepubliceerd) {
    webpagina.dateModified = bericht.gewijzigd ?? bericht.gepubliceerd;
  }

  const kruimels: JsonLdKnoop = {
    '@type': 'BreadcrumbList',
    '@id': kruimelId,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluutUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Nieuws', item: absoluutUrl('/nieuws') },
      { '@type': 'ListItem', position: 3, name: bericht.titel, item: url },
    ],
  };

  return alsScript({
    '@context': 'https://schema.org',
    '@graph': [STICHTING, SITEKNOOP, webpagina, kruimels, artikel],
  });
}

/* ------------------------------------------------------------------ */
/*  De agenda                                                          */
/* ------------------------------------------------------------------ */

/**
 * Eén agendamoment waarvan alles al vaststaat: geen reeks die nog uitgerekend
 * moet worden, geen mededeling, geen activiteit waarvan de tijd nog ontbreekt.
 */
export type Agendamoment = {
  titel: string;
  omschrijving?: string;
  /** Het begin met tijdzone, bijvoorbeeld 2026-09-03T10:00:00+02:00. */
  begint: string;
  eindigt?: string;
  /** De zichtbare plaatsaanduiding. Leeg betekent: in het huis zelf. */
  locatie?: string;
  /** Het bedrag in euro's, 0 voor gratis. Laat weg zolang het niet vaststaat. */
  prijs?: number;
  /** De kostenregel zoals de bezoeker hem leest, bijvoorbeeld "Een vrije gift". */
  bijdrage?: string;
  aanmelden: boolean;
  aanmeldUrl?: string;
  afgelast?: boolean;
  /** Het adres waarop de bezoeker dit moment ziet staan. */
  url: string;
};

/**
 * Agendamomenten als Event.
 *
 * Roep dit NOOIT aan met gegevens die niet al gecontroleerd zijn. De overdracht
 * van de klant staat Event alleen toe voor echte, actuele momenten waarvan
 * datum, tijd, locatie, kosten en aanmeldstatus letterlijk overeenkomen met wat
 * er op de zichtbare pagina staat. Een moment waarvan iets van dat rijtje nog
 * ontbreekt hoort hier dus niet in: verkeerde gestructureerde gegevens kosten
 * meer vertrouwen dan geen gestructureerde gegevens opleveren.
 */
export function agendaKnopen(momenten: Agendamoment[]): JsonLdKnoop[] {
  return momenten.map((moment) => {
    const gebeurtenis: JsonLdKnoop = {
      '@type': 'Event',
      name: moment.titel,
      startDate: moment.begint,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: moment.afgelast
        ? 'https://schema.org/EventCancelled'
        : 'https://schema.org/EventScheduled',
      location: moment.locatie
        ? { '@type': 'Place', name: moment.locatie }
        : {
            '@type': 'Place',
            name: SITE_NAAM,
            address: STICHTING.address,
          },
      organizer: { '@id': ORGANISATIE },
      url: moment.url,
    };
    if (moment.omschrijving) gebeurtenis.description = moment.omschrijving;
    if (moment.eindigt) gebeurtenis.endDate = moment.eindigt;
    // Alleen een bedrag dat werkelijk vaststaat wordt een Offer. Een prijs uit
    // een vrije tekstregel raden is precies wat hier niet mag.
    if (typeof moment.prijs === 'number') {
      const aanbod: JsonLdKnoop = {
        '@type': 'Offer',
        price: moment.prijs.toFixed(2),
        priceCurrency: 'EUR',
        url: moment.aanmeldUrl ?? moment.url,
      };
      if (moment.bijdrage) aanbod.description = moment.bijdrage;
      gebeurtenis.offers = aanbod;
    }
    return gebeurtenis;
  });
}

/* ------------------------------------------------------------------ */
/*  Sitemap en robots                                                  */
/* ------------------------------------------------------------------ */

/** Een datum die een sitemap mag dragen: een echte dag, of niets. */
function dagVan(waarde: string | undefined): string | null {
  if (!waarde) return null;
  const dag = waarde.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dag)) return null;
  return Number.isNaN(Date.parse(dag)) ? null : dag;
}

/** De sitemap, met een datum per adres waar we die kennen. */
export function sitemapXml(regels: { pad: string; gewijzigd?: string }[]): string {
  const gezien = new Set<string>();
  const stukken: string[] = [];

  for (const regel of regels) {
    if (gezien.has(regel.pad)) continue;
    gezien.add(regel.pad);
    // Van de 72 vastgestelde pagina's kennen we de datum wel: dat is de dag
    // waarop die redactie is nagelopen. Alleen wat uit het beheer komt moet
    // zijn eigen datum meebrengen.
    const dag = dagVan(regel.gewijzigd) ?? (vindPagina(regel.pad) ? CONTROLEDATUM : null);
    stukken.push(
      `<url><loc>${xml(absoluutUrl(regel.pad))}</loc>${dag ? `<lastmod>${dag}</lastmod>` : ''}</url>`,
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${stukken.join('')}</urlset>`;
}

/** Wat robots.txt zegt, afhankelijk van of dit al de echte site is. */
export function robotsTxt(indexeerbaar: boolean): string {
  if (!indexeerbaar) {
    return [
      '# Conceptversie. Niets hiervan hoort in de index zolang toonoverleven.nl bestaat.',
      'User-agent: *',
      'Disallow: /',
      '',
    ].join('\n');
  }

  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /beheer',
    'Disallow: /api/',
    '',
    // De crawler waarmee ChatGPT Search pagina's ophaalt om ze te kunnen
    // noemen. Hij valt al onder "*", maar de klant vraagt hem met naam, dus
    // staat hij er met naam: zo is het één regel om hem later te weren.
    'User-agent: OAI-SearchBot',
    'Allow: /',
    'Disallow: /beheer',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');
}
