import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

const canonicalHost = 'rn-schilders.nl';
const siteUrl = `https://${canonicalHost}`;

type PageMeta = {
  title: string;
  description: string;
};

type LocationStructuredData = {
  areas: string[];
  services: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

const pageMeta: Record<string, PageMeta> = {
  '/': {
    title: 'RN Schilders & Renovatie | Schilder Woerden',
    description:
      'RN Schilders & Renovatie in Woerden. Schilderwerk, renovatie, kozijnen, spuitwerk, stucwerk en houtrotherstel met gratis offerte.',
  },
  '/schilderwerk-woerden': {
    title: 'Schilderwerk Woerden | RN Schilders & Renovatie',
    description:
      'Schilderwerk in Woerden voor woningen en bedrijfspanden. Binnen- en buitenschilderwerk, kozijnen, deuren en onderhoud met gratis prijsindicatie.',
  },
  '/kozijnen-woerden': {
    title: 'Kozijnen Woerden | Renovatie en plaatsing',
    description:
      'Kozijnen in Woerden laten renoveren, herstellen of plaatsen. Houten en kunststof kozijnen, houtwerk, isolatie en PKVW hang- en sluitwerk.',
  },
  '/spuitwerk-woerden': {
    title: 'Spuitwerk Woerden | Strakke wanden en plafonds',
    description:
      'Professioneel spuitwerk in Woerden voor woningen, kantoren en bedrijfspanden. Strakke muren en plafonds met zorgvuldige voorbereiding.',
  },
  '/stucwerk-woerden': {
    title: 'Stucwerk Woerden | Wanden en plafonds strak afgewerkt',
    description:
      'Stucwerk in Woerden voor renovatie, reparatie, wanden en plafonds. Sterke basis voor schilderwerk of spuitwerk door RN Schilders.',
  },
  '/houtrotherstel-woerden': {
    title: 'Houtrotherstel Woerden | Kozijnen en buitenhout herstellen',
    description:
      'Houtrotherstel in Woerden voor kozijnen, deuren en boeidelen. Inspectie, duurzaam herstel en schilderwerk voordat schade groter wordt.',
  },
  '/sloopwerk-woerden': {
    title: 'Sloopwerk Woerden | Voorbereiding voor renovatie',
    description:
      'Sloopwerk in Woerden als voorbereiding op renovatie, stucwerk, schilderwerk of spuitwerk. Netjes, veilig en met korte lijnen.',
  },
  '/werkgebied': {
    title: 'Werkgebied | RN Schilders & Renovatie',
    description:
      'Bekijk het werkgebied van RN Schilders & Renovatie rondom Woerden, met plaatsen zoals Vleuten, Maarssen, Mijdrecht, Bodegraven, Houten en Zeist.',
  },
  '/schilder-vleuten-de-meern': {
    title: 'Schilder Vleuten, De Meern en Leidsche Rijn | RN Schilders',
    description:
      'Schilder nodig in Vleuten, De Meern of Leidsche Rijn? Buitenschilderwerk, houtrotherstel, kozijnen, spuitwerk en binnenafwerking.',
  },
  '/schilder-maarssen-stichtse-vecht': {
    title: 'Schilder Maarssen, Stichtse Vecht en Breukelen | RN Schilders',
    description:
      'Schilderwerk in Maarssen, Stichtse Vecht en Breukelen voor woningen met aandacht voor buitenhout, kozijnen, houtrotherstel en duurzame afwerking.',
  },
  '/schilder-mijdrecht-de-ronde-venen': {
    title: 'Schilder Mijdrecht, De Ronde Venen en Vinkeveen | RN Schilders',
    description:
      'Schilder in Mijdrecht, De Ronde Venen of Vinkeveen voor buitenschilderwerk, houtrotherstel, kozijnen, spuitwerk en renovatie-afwerking.',
  },
  '/schilder-bodegraven-reeuwijk': {
    title: 'Schilder Bodegraven en Reeuwijk | RN Schilders Woerden',
    description:
      'Schilder in Bodegraven of Reeuwijk nodig? Schilderwerk, houtrotherstel, kozijnen, stucwerk en renovatie-afwerking voor woningen.',
  },
  '/schilder-ijsselstein': {
    title: 'Schilder IJsselstein | Schilderwerk en houtrotherstel',
    description:
      'Schilder in IJsselstein voor binnen- en buitenschilderwerk, houtrotherstel, kozijnen, spuitwerk en stucwerk. Gratis prijsindicatie.',
  },
  '/schilder-houten': {
    title: 'Schilder Houten | Betrouwbaar schilderwerk door RN Schilders',
    description:
      'Schilderwerk in Houten voor gezinswoningen en bedrijfspanden: kozijnen, buitenschilderwerk, spuitwerk, stucwerk en binnenafwerking.',
  },
  '/schilder-de-bilt-bilthoven': {
    title: 'Schilder De Bilt en Bilthoven | Schilderwerk en houtrotherstel',
    description:
      'Schilder in De Bilt of Bilthoven voor zorgvuldig buitenschilderwerk, houtrotherstel, kozijnen en nette binnenafwerking.',
  },
  '/schilder-zeist': {
    title: 'Schilder Zeist | Schilderwerk, houtrotherstel en kozijnen',
    description:
      'Schilder in Zeist nodig? RN Schilders verzorgt schilderwerk, houtrotherstel, kozijnen, stucwerk en spuitwerk met duidelijke offerte.',
  },
  '/algemene-voorwaarden': {
    title: 'Algemene voorwaarden | RN Schilders & Renovatie',
    description: 'Algemene voorwaarden van RN Schilders & Renovatie in Woerden.',
  },
};

const locationStructuredData: Record<string, LocationStructuredData> = {
  '/schilder-vleuten-de-meern': {
    areas: ['Vleuten', 'De Meern', 'Leidsche Rijn', 'Veldhuizen', 'Terwijde'],
    services: ['Schilderwerk', 'Houtrotherstel', 'Kozijnen', 'Spuitwerk'],
    faqs: [
      {
        question: 'Waar wordt bij kozijnen in Vleuten of De Meern op gelet?',
        answer: 'Vooral op open naden, loslatende verf, kitwerk, raamhoeken, dorpels en beginnende houtrot. Die punten bepalen of schilderwerk genoeg is of dat eerst herstel nodig is.',
      },
      {
        question: 'Kan binnenwerk na verhuizing of verbouwing worden meegenomen?',
        answer: 'Ja. Wanden, plafonds, deuren, kozijnen, stucwerk en latex spuiten kunnen samen worden bekeken, zodat de volgorde en afwerking vooraf helder zijn.',
      },
    ],
  },
  '/schilder-maarssen-stichtse-vecht': {
    areas: ['Maarssen', 'Breukelen', 'Stichtse Vecht', 'Maarssenbroek', 'Tienhoven'],
    services: ['Schilderwerk', 'Houtrotherstel', 'Kozijnen', 'Stucwerk'],
    faqs: [
      {
        question: 'Waarom is houtrotherstel hier vaak relevant?',
        answer: 'Bij ouder buitenhout kan vocht rondom verbindingen, dorpels en kozijnhoeken schade veroorzaken. Tijdig herstel voorkomt vaak duurdere vervanging.',
      },
      {
        question: 'Kan RN Schilders ook kozijnen meenemen in het schilderwerk?',
        answer: 'Ja. Kozijnherstel, voorbereiding, gronden en aflakken kunnen in een traject worden beoordeeld.',
      },
    ],
  },
  '/schilder-mijdrecht-de-ronde-venen': {
    areas: ['Mijdrecht', 'Wilnis', 'Vinkeveen', 'De Ronde Venen', 'Abcoude'],
    services: ['Schilderwerk', 'Houtrotherstel', 'Kozijnen', 'Spuitwerk'],
    faqs: [
      {
        question: 'Is buitenschilderwerk rond Vinkeveen anders door vocht?',
        answer: 'Bij vochtige of open omgevingen is inspectie van naden, hoeken en liggende delen extra belangrijk voordat er geschuurd, hersteld en afgewerkt wordt.',
      },
      {
        question: 'Kan ik foto’s meesturen voor een eerste inschatting?',
        answer: 'Ja. Foto’s van kozijnen, deuren, boeidelen of beschadigingen helpen om sneller te bepalen welke opname nodig is.',
      },
    ],
  },
  '/schilder-bodegraven-reeuwijk': {
    areas: ['Bodegraven', 'Reeuwijk', 'Reeuwijk-Brug', 'Nieuwerbrug', 'Driebruggen'],
    services: ['Schilderwerk', 'Houtrotherstel', 'Kozijnen', 'Stucwerk'],
    faqs: [
      {
        question: 'Wanneer is houtrotherstel nodig bij buitenhout?',
        answer: 'Wanneer hout zacht wordt, verf loslaat, naden openstaan of dorpels en raamhoeken vocht vasthouden. Eerst herstellen voorkomt dat nieuw schilderwerk snel weer schade laat zien.',
      },
      {
        question: 'Is een onderhoudsplanning mogelijk?',
        answer: 'Ja. Bij buitenschilderwerk kan per gevel, kozijn of bouwdeel worden bekeken wat nu moet gebeuren en wat later ingepland kan worden.',
      },
    ],
  },
  '/schilder-ijsselstein': {
    areas: ['IJsselstein', 'Zenderpark', 'Achterveld', 'Binnenstad', 'Eiteren'],
    services: ['Schilderwerk', 'Houtrotherstel', 'Spuitwerk', 'Stucwerk'],
    faqs: [
      {
        question: 'Doet RN Schilders ook binnenschilderwerk in IJsselstein?',
        answer: 'Ja. Binnenwerk, spuitwerk en stucwerk kunnen worden gecombineerd met buitenschilderwerk of los worden aangevraagd.',
      },
      {
        question: 'Hoe vraag ik snel een prijsindicatie aan?',
        answer: 'Stuur via het offerteformulier kort de dienst, plaats, omschrijving en eventueel foto’s mee. Dan kan Richard gericht reageren.',
      },
    ],
  },
  '/schilder-houten': {
    areas: ['Houten', 'Houten-Zuid', 'Castellum', 'Schalkwijk', "Tull en 't Waal"],
    services: ['Schilderwerk', 'Kozijnen', 'Spuitwerk', 'Stucwerk'],
    faqs: [
      {
        question: 'Kan RN Schilders meerdere werkzaamheden combineren?',
        answer: 'Ja. Schilderwerk, stucwerk, spuitwerk en kozijnwerk kunnen samen worden beoordeeld, zodat voorbereiding, droogtijd en afwerking goed op elkaar aansluiten.',
      },
      {
        question: 'Kan schilderwerk per ruimte of geveldeel worden gepland?',
        answer: 'Ja. Bij bewoonde woningen kan het werk in delen worden gepland, bijvoorbeeld eerst buitenkozijnen of juist kamer voor kamer binnen.',
      },
    ],
  },
  '/schilder-de-bilt-bilthoven': {
    areas: ['De Bilt', 'Bilthoven', 'Groenekan', 'Maartensdijk', 'Hollandsche Rading'],
    services: ['Schilderwerk', 'Houtrotherstel', 'Kozijnen', 'Stucwerk'],
    faqs: [
      {
        question: 'Past RN Schilders bij oudere of karaktervolle woningen?',
        answer: 'Ja. Juist bij waardevol houtwerk is inspectie, herstel en afwerking in de juiste volgorde belangrijk.',
      },
      {
        question: 'Is een opname op locatie mogelijk?',
        answer: 'Ja. Voor buitenschilderwerk, houtrot en kozijnen is een opname vaak de beste manier om scope en planning helder te krijgen.',
      },
    ],
  },
  '/schilder-zeist': {
    areas: ['Zeist', 'Den Dolder', 'Austerlitz', 'Bosch en Duin', 'Huis ter Heide'],
    services: ['Schilderwerk', 'Houtrotherstel', 'Kozijnen', 'Spuitwerk'],
    faqs: [
      {
        question: 'Komt RN Schilders ook naar Zeist voor een opname?',
        answer: 'Ja. Voor schilderwerk, kozijnen en houtrotherstel kan een opname op locatie helpen om voorbereiding, herstelpunten en planning helder te krijgen.',
      },
      {
        question: 'Kan RN Schilders ook renovatie-afwerking in Zeist doen?',
        answer: 'Ja. Naast schilderwerk kan RN Schilders ook stucwerk, spuitwerk, sloopvoorbereiding en kozijnwerk beoordelen.',
      },
    ],
  },
};

function buildLocationJsonLd(pathname: string, meta: PageMeta, data: LocationStructuredData) {
  const pageUrl = `${siteUrl}${pathname}`;
  return JSON.stringify([
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${pageUrl}#service`,
      name: meta.title,
      description: meta.description,
      provider: { '@id': `${siteUrl}/#business` },
      url: pageUrl,
      serviceType: data.services,
      areaServed: data.areas.map((name) => ({ '@type': 'City', name })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      mainEntity: data.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ]);
}

const formWorker = createFormWorker({
  formPath: '/api/forms/offerte',
  siteName: 'RN Schilders & Renovatie',
  ownerName: 'Richard',
  senderName: 'RN Schilders',
  subjectPrefix: 'Nieuwe offerteaanvraag RN Schilders',
  confirmationFollowUpSentence: 'Richard neemt binnen 24 tot 48 uur contact met u op om uw project en de volgende stap door te spreken.',
  messageField: 'message',
  serviceOtherField: 'serviceOther',
  subjectFields: ['service', 'postalCode', 'city'],
  requiredFields: [
    { name: 'phone', label: 'telefoonnummer', message: 'Vul uw telefoonnummer in.' },
    { name: 'postalCode', label: 'postcode', message: 'Vul uw postcode in.' },
    { name: 'streetName', label: 'straatnaam', message: 'Vul uw straatnaam in.' },
    { name: 'houseNumber', label: 'huisnummer', message: 'Vul uw huisnummer in.' },
    { name: 'city', label: 'plaatsnaam', message: 'Vul uw plaatsnaam in.' },
    { name: 'service', label: 'dienst', message: 'Kies een dienst.' },
    {
      name: 'serviceOther',
      label: 'dienst toelichting',
      message: 'Vul de gewenste dienst in.',
      when: { field: 'service', equals: 'other' },
    },
    { name: 'preferredExecutionDate', label: 'gewenste uitvoeringsdatum', message: 'Kies een gewenste uitvoeringsdatum.' },
    { name: 'message', label: 'projectomschrijving', message: 'Beschrijf kort wat er moet gebeuren.' },
  ],
  emailFields: [
    { name: 'phone', label: 'Telefoon' },
    { name: 'postalCode', label: 'Postcode' },
    { name: 'streetName', label: 'Straatnaam' },
    { name: 'houseNumber', label: 'Huisnummer' },
    { name: 'city', label: 'Plaatsnaam' },
    { name: 'service', label: 'Dienst' },
    { name: 'preferredExecutionDate', label: 'Gewenste uitvoeringsdatum' },
    { name: 'urgent', label: 'Spoed' },
  ],
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    let shouldRedirect = false;

    if (url.hostname === `www.${canonicalHost}`) {
      url.hostname = canonicalHost;
      shouldRedirect = true;
    }

    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
      shouldRedirect = true;
    }

    if (shouldRedirect) {
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname.startsWith('/api/')) {
      return formWorker.fetch!(request, env, ctx);
    }

    const response = await env.ASSETS.fetch(request);
    const meta = pageMeta[url.pathname];
    const contentType = response.headers.get('content-type') ?? '';

    if (request.method !== 'GET' || !meta || !contentType.includes('text/html')) {
      return response;
    }

    const canonicalUrl = `${siteUrl}${url.pathname === '/' ? '/' : url.pathname}`;
    const structuredData = locationStructuredData[url.pathname]
      ? buildLocationJsonLd(url.pathname, meta, locationStructuredData[url.pathname])
      : null;
    return new HTMLRewriter()
      .on('head', {
        element(element) {
          if (!structuredData) return;
          element.append(`<script type="application/ld+json">${structuredData}</script>`, { html: true });
        },
      })
      .on('title', {
        element(element) {
          element.setInnerContent(meta.title);
        },
      })
      .on('meta[name="description"]', {
        element(element) {
          element.setAttribute('content', meta.description);
        },
      })
      .on('link[rel="canonical"]', {
        element(element) {
          element.setAttribute('href', canonicalUrl);
        },
      })
      .on('meta[property="og:title"]', {
        element(element) {
          element.setAttribute('content', meta.title);
        },
      })
      .on('meta[property="og:description"]', {
        element(element) {
          element.setAttribute('content', meta.description);
        },
      })
      .on('meta[property="og:url"]', {
        element(element) {
          element.setAttribute('content', canonicalUrl);
        },
      })
      .transform(response);
  },
} satisfies ExportedHandler<Env>;
