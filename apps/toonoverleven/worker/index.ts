import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';
import { assetVanRef } from '../src/content/image';
import {
  NIET_GEVONDEN,
  PADEN,
  PAGINAS,
  SITE_NAAM,
  SITE_URL,
  absoluutUrl,
  kort,
  paginaTitel,
  schoonPad,
  slugify,
  type Pad,
} from '../src/meta';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
  /** Leeg zolang er geen Sanity-project is; de site rendert dan zijn eigen tekst. */
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
  /** Gedeeld met het tabblad Voorbeeld in het beheer. Opent alleen concepten. */
  PREVIEW_KEY?: string;
  /** Leestoken, een geheim van de Worker. Komt nooit in de browser. */
  SANITY_READ_TOKEN?: string;
  /**
   * "true" zodra dit de echte site is. Tot die tijd zegt elke pagina noindex en
   * verbiedt robots.txt alles, zodat een concept nooit kan concurreren met de
   * site waarvoor het een voorstel is.
   */
  SITE_INDEXABLE?: string;
};

/**
 * Eén formulier: het bericht dat iemand achterlaat.
 *
 * Bewust kort. Wie hier komt heeft vaak net slecht nieuws gehad of zorgt voor
 * iemand die dat heeft, en moet niet eerst vijftien velden door.
 */
const contactWorker = createFormWorker({
  formPath: '/api/forms/contact',
  locale: 'nl',
  siteName: 'Toon over Leven',
  ownerName: 'het inloophuis',
  senderName: 'Toon over Leven',
  subjectPrefix: 'Bericht via de site',
  confirmationFollowUpSentence:
    'Een van onze vrijwilligers neemt contact met u op. Wilt u liever meteen iemand spreken, bel dan 036-8450265.',
  subjectFields: ['onderwerp'],
  messageField: 'bericht',
  emailFields: [
    { name: 'onderwerp', label: 'Waar het over gaat' },
    { name: 'telefoon', label: 'Telefoonnummer' },
  ],
  // Een achternaam is hier niet nodig, een manier om terug te schrijven wel.
  requireFirstName: true,
  requireLastName: false,
  requireEmail: true,
  honeypotField: 'company',
});

/**
 * Alles wat de site nodig heeft, in één vraag. Klein genoeg om in de HTML mee
 * te sturen, en dat is precies wat de Worker hieronder doet.
 *
 * De agenda wordt bij de bron al ingekort: een eenmalige activiteit die voorbij
 * is hoeft niet meegestuurd te worden, een reeks wel, want die loopt door.
 */
const query = (vandaag: string) => `{
  "teksten": *[_type == "siteTeksten"][0]{
    hero, open, nieuwsBlok, agendaBlok, welkom, wieWeZijn, watWeDoen, naam, jongeren,
    vrijwilliger, steun, verantwoording, contact
  },
  "agenda": *[_type == "activiteit" && (
    (defined(herhaling) && herhaling != "eenmalig") || coalesce(totDatum, datum) >= "${vandaag}"
  )] | order(datum asc){
    _id, soort, titel, categorie, omschrijving, afbeelding, datum, totDatum, heleDag,
    begintijd, eindtijd, herhaling, herhaalTot, overslaan, aanmelden, bijdrage, locatie
  },
  "nieuws": *[_type == "nieuws"] | order(coalesce(vastgezet, false) desc, datum desc){
    _id, titel, slug, datum, vastgezet, intro, body, afbeelding, instagram, facebook,
    seoTitel, seoOmschrijving
  },
  "sponsoren": *[_type == "sponsor" && defined(logo.asset)] | order(coalesce(volgorde, 9999) asc, naam asc){
    naam, logo, website
  }
}`;

/**
 * Waar het laatste goede antwoord bewaard wordt. Een storing bij Sanity zou de
 * pagina anders terugzetten op de tekst waarmee de build geleverd is, en een
 * klant die zijn eigen wijziging even ziet verdwijnen denkt niet "tijdelijk".
 */
const LAATST_GOED = `${SITE_URL}/__cms-content`;

/**
 * `caches.default` is een uitbreiding van Workers. Deze tsconfig laadt de
 * WebWorker-lib naast de Cloudflare-types, en die smallere CacheStorage wint,
 * dus de cast staat hier en niet bij elke aanroep.
 */
const randCache = () => (caches as unknown as { default: Cache }).default;

async function laadInhoud(
  env: Env,
  opts: { vers: boolean; voorbeeld: boolean },
  ctx: ExecutionContext,
): Promise<unknown> {
  if (!env.SANITY_PROJECT_ID) return null;
  const dataset = env.SANITY_DATASET || 'production';
  const voorbeeld = opts.voorbeeld && Boolean(env.SANITY_READ_TOKEN);
  const vandaag = new Date().toISOString().slice(0, 10);

  const url =
    `https://${env.SANITY_PROJECT_ID}.api.sanity.io/v2025-02-19/data/query/${dataset}` +
    `?query=${encodeURIComponent(query(vandaag))}` +
    (voorbeeld ? '&perspective=drafts' : '');

  try {
    const antwoord = await fetch(url, {
      headers: voorbeeld ? { Authorization: `Bearer ${env.SANITY_READ_TOKEN}` } : {},
      cf: { cacheTtl: voorbeeld || opts.vers ? 0 : 5, cacheEverything: !voorbeeld },
    });
    if (antwoord.ok) {
      const body = (await antwoord.json()) as { result?: unknown };
      const resultaat = body.result ?? null;
      if (resultaat && !voorbeeld) {
        ctx.waitUntil(
          randCache().put(
            LAATST_GOED,
            new Response(JSON.stringify(resultaat), {
              headers: { 'content-type': 'application/json', 'cache-control': 'max-age=86400' },
            }),
          ),
        );
      }
      return resultaat;
    }
  } catch {
    // Doorlopen: een CMS die niet bereikbaar is mag het inloophuis niet
    // offline halen.
  }

  // Concepten worden nooit uit een kopie geserveerd: een oud concept is erger
  // dan geen concept.
  if (voorbeeld) return null;
  const bewaard = await randCache().match(LAATST_GOED);
  return bewaard ? await bewaard.json() : null;
}

/** JSON is veilig in een scripttag zodra `<` geen sluittag kan beginnen. */
const inlineJson = (waarde: unknown) => JSON.stringify(waarde).replace(/</g, '\\u003c');

const escapeHtml = (waarde: string) =>
  waarde
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

type Doc = Record<string, any>;

type PaginaMeta = {
  titel: string;
  omschrijving: string;
  pad: string;
  beeld: string | null;
  type: 'website' | 'article';
  /** JSON-LD voor deze pagina, al omgezet naar tekst. */
  jsonLd: string | null;
};

/**
 * Het adres waarop elk bericht staat. Dezelfde regel als in de browser: het
 * adres uit het beheer, of een adres gemaakt van de kop, met een nummer erachter
 * als twee berichten hetzelfde adres willen. Beide kanten moeten het eens zijn,
 * anders wijst een link in de HTML naar een ander bericht dan op het scherm.
 */
function metAdres(berichten: Doc[]): { slug: string; bericht: Doc }[] {
  const bezet = new Set<string>();
  return berichten.map((bericht) => {
    const gegeven = typeof bericht?.slug?.current === 'string' ? bericht.slug.current.trim() : '';
    const basis =
      gegeven ||
      slugify(typeof bericht?.titel === 'string' && bericht.titel.trim() ? bericht.titel : 'bericht');
    let slug = basis;
    for (let n = 2; bezet.has(slug); n += 1) slug = `${basis}-${n}`;
    bezet.add(slug);
    return { slug, bericht };
  });
}

/** De woorden in een bericht, voor de regel onder een zoekresultaat. */
function bodyTekst(body: unknown): string {
  if (!Array.isArray(body)) return '';
  return body
    .filter((blok: Doc) => blok?._type === 'block' && Array.isArray(blok.children))
    .map((blok: Doc) =>
      blok.children.map((kind: Doc) => (typeof kind?.text === 'string' ? kind.text : '')).join(''),
    )
    .join(' ')
    .trim();
}

/** De foto van een bericht, bijgesneden op de maat die een linkvoorbeeld toont. */
function deelBeeld(afbeelding: Doc | undefined, projectId: string, dataset: string): string | null {
  const ref = afbeelding?.asset?._ref;
  if (typeof ref !== 'string') return null;
  const asset = assetVanRef(ref, projectId, dataset);
  return asset ? `${asset.basis}?w=1200&h=630&fit=crop&crop=entropy&auto=format` : null;
}

const eersteTekst = (...waarden: unknown[]): string => {
  for (const waarde of waarden) if (typeof waarde === 'string' && waarde.trim()) return waarde;
  return '';
};

/**
 * Gestructureerde gegevens. Geen versiering: dit is wat een stichting in een
 * kennispaneel zet en een bericht in een nieuwscarrousel, en het is de helft
 * van het werk die een pagina met metatags alleen niet kan doen.
 */
const stichtingJsonLd = () =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'NGO',
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
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Mazerhard 37',
      postalCode: '3891 BR',
      addressLocality: 'Zeewolde',
      addressRegion: 'Flevoland',
      addressCountry: 'NL',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 52.333788, longitude: 5.538774 },
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
  });

const berichtJsonLd = (opts: {
  titel: string;
  omschrijving: string;
  url: string;
  beeld: string | null;
  datum?: string;
}) =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.titel,
    description: opts.omschrijving,
    inLanguage: 'nl',
    mainEntityOfPage: opts.url,
    ...(opts.beeld ? { image: opts.beeld } : {}),
    ...(opts.datum ? { datePublished: opts.datum } : {}),
    publisher: { '@type': 'Organization', name: SITE_NAAM, url: SITE_URL },
  });

function paginaMeta(
  pad: string,
  data: Doc | null,
  projectId: string,
  dataset: string,
): { meta: PaginaMeta | null; ontbreekt: boolean } {
  if ((PADEN as readonly string[]).includes(pad)) {
    const vast = PAGINAS[pad as Pad];
    return {
      meta: {
        titel: pad === '/' ? vast.titel : paginaTitel(vast.titel),
        omschrijving: kort(vast.omschrijving),
        pad,
        beeld: null,
        type: 'website',
        jsonLd: pad === '/' ? stichtingJsonLd() : null,
      },
      ontbreekt: false,
    };
  }

  const artikel = /^\/nieuws\/([^/]+)$/.exec(pad);
  if (!artikel) return { meta: null, ontbreekt: false };

  // Sanity onbereikbaar: de app valt terug op de berichten waarmee hij gebouwd
  // is, dus dit is niet het moment om te zeggen dat het bericht niet bestaat.
  const berichten = Array.isArray(data?.nieuws) ? (data!.nieuws as Doc[]) : null;
  if (!berichten) return { meta: null, ontbreekt: false };

  const gezocht = decodeURIComponent(artikel[1]);
  const gevonden = metAdres(berichten).find((regel) => regel.slug === gezocht);
  if (!gevonden) {
    return {
      meta: {
        titel: paginaTitel(NIET_GEVONDEN),
        omschrijving: kort(PAGINAS['/nieuws'].omschrijving),
        pad: '/nieuws',
        beeld: null,
        type: 'website',
        jsonLd: null,
      },
      ontbreekt: true,
    };
  }

  const { bericht, slug } = gevonden;
  const kop = eersteTekst(bericht.titel, 'Bericht');
  // Wat de klant in het tabblad Vindbaarheid schreef wint van de kop van het
  // bericht: dat tabblad bestaat juist omdat die twee mogen verschillen.
  const titel = eersteTekst(bericht.seoTitel, paginaTitel(kop));
  const omschrijving = kort(
    eersteTekst(
      bericht.seoOmschrijving,
      bericht.intro,
      bodyTekst(bericht.body),
      PAGINAS['/nieuws'].omschrijving,
    ),
  );
  const beeld = deelBeeld(bericht.afbeelding, projectId, dataset);
  const url = absoluutUrl(`/nieuws/${slug}`);
  return {
    meta: {
      titel,
      omschrijving,
      pad: `/nieuws/${slug}`,
      beeld,
      type: 'article',
      jsonLd: berichtJsonLd({
        titel: kop,
        omschrijving,
        url,
        beeld,
        datum: typeof bericht.datum === 'string' ? bericht.datum : undefined,
      }),
    },
    ontbreekt: false,
  };
}

/** Schrijft de head die de site meestuurt om naar de pagina die gevraagd is. */
function zetMeta(rewriter: HTMLRewriter, meta: PaginaMeta, indexeerbaar: boolean): HTMLRewriter {
  const attr = (selector: string, naam: string, waarde: string) =>
    rewriter.on(selector, {
      element(element) {
        element.setAttribute(naam, waarde);
      },
    });

  const canoniek = absoluutUrl(meta.pad);

  rewriter.on('title', {
    element(element) {
      element.setInnerContent(meta.titel);
    },
  });
  attr('meta[name="description"]', 'content', meta.omschrijving);
  attr('meta[property="og:title"]', 'content', meta.titel);
  attr('meta[property="og:description"]', 'content', meta.omschrijving);
  attr('meta[property="og:url"]', 'content', canoniek);
  attr('meta[property="og:type"]', 'content', meta.type);
  attr('link[rel="canonical"]', 'href', canoniek);
  attr('meta[name="robots"]', 'content', indexeerbaar ? 'index, follow' : 'noindex, nofollow');
  if (meta.beeld) attr('meta[property="og:image"]', 'content', meta.beeld);

  if (meta.jsonLd) {
    const blok = `<script type="application/ld+json">${meta.jsonLd.replace(/</g, '\\u003c')}</script>`;
    rewriter.on('head', {
      element(head) {
        head.append(blok, { html: true });
      },
    });
  }

  return rewriter;
}

/** Elk adres dat het waard is om te doorzoeken. */
function sitemap(data: Doc | null): string {
  const paden: string[] = [...PADEN];
  const berichten = Array.isArray(data?.nieuws) ? (data!.nieuws as Doc[]) : [];
  for (const { slug } of metAdres(berichten)) paden.push(`/nieuws/${slug}`);

  const regels = paden
    .map((pad) => `<url><loc>${escapeHtml(absoluutUrl(pad))}</loc></url>`)
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${regels}</urlset>`;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const indexeerbaar = env.SITE_INDEXABLE === 'true';

    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    // Het beheer, op hun eigen domein. De eigen bestanden staan absoluut
    // (/static, /vendor) en komen rechtstreeks van de assetslaag; elk ander pad
    // onder /beheer is een route van de Studio zelf en krijgt zijn pagina.
    if (url.pathname === '/beheer' || url.pathname.startsWith('/beheer/')) {
      const studio = await env.ASSETS.fetch(new URL('/beheer/index.html', url));
      const headers = new Headers(studio.headers);
      headers.set('x-robots-tag', 'noindex, nofollow');
      headers.set('cache-control', 'no-cache');
      return new Response(studio.body, { status: studio.status, headers });
    }

    // Eén formulier, met naam. Een vangnet voor alles onder /api zou stilletjes
    // berichten aannemen op elk adres dat iemand raadt.
    if (url.pathname === '/api/forms/contact') {
      return contactWorker.fetch!(request, env, ctx);
    }
    if (url.pathname.startsWith('/api/')) {
      return new Response('Niet gevonden', { status: 404 });
    }

    if (url.pathname === '/robots.txt') {
      const body = indexeerbaar
        ? `User-agent: *\nDisallow: /beheer\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
        : `# Conceptversie. Niets hiervan hoort in de index zolang toonoverleven.nl bestaat.\nUser-agent: *\nDisallow: /\n`;
      return new Response(body, {
        headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'max-age=300' },
      });
    }

    if (url.pathname === '/sitemap.xml') {
      const data = (await laadInhoud(env, { vers: false, voorbeeld: false }, ctx)) as Doc | null;
      return new Response(sitemap(data), {
        headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'max-age=300' },
      });
    }

    const antwoord = await env.ASSETS.fetch(request);
    if (!antwoord.headers.get('content-type')?.includes('text/html')) return antwoord;

    const pad = schoonPad(url.pathname);
    const voorbeeld = Boolean(env.PREVIEW_KEY) && url.searchParams.get('preview') === env.PREVIEW_KEY;
    const data = (await laadInhoud(
      env,
      { vers: url.searchParams.get('fresh') === '1', voorbeeld },
      ctx,
    )) as Doc | null;

    const projectId = env.SANITY_PROJECT_ID ?? '';
    const dataset = env.SANITY_DATASET || 'production';
    const { meta, ontbreekt } = paginaMeta(pad, data, projectId, dataset);
    if (!data && !meta) return antwoord;

    let rewriter = new HTMLRewriter();

    if (data) {
      const payload = inlineJson({ projectId, dataset, preview: voorbeeld, data });
      rewriter = rewriter.on('head', {
        element(head) {
          head.append(
            `<script id="toonoverleven-content" type="application/json">${payload}</script>`,
            { html: true },
          );
        },
      });
    }

    if (meta) rewriter = zetMeta(rewriter, meta, indexeerbaar && !voorbeeld);

    const pagina = rewriter.transform(antwoord);

    // Het document zelf mag nergens blijven hangen, anders zit een wijziging
    // achter een oude pagina terwijl de inhoud erachter allang bij is. Een
    // voorbeeld draagt ongepubliceerde tekst en mag dus helemaal niet bewaard.
    const headers = new Headers(pagina.headers);
    headers.set('cache-control', voorbeeld ? 'no-store' : 'no-cache');
    if (voorbeeld || !indexeerbaar) headers.set('x-robots-tag', 'noindex, nofollow');
    // Een adres onder /nieuws dat bij geen bericht hoort is een 404, en niet
    // een pagina die dat toevallig zegt: een linkchecker moet het verschil zien.
    return new Response(pagina.body, { status: ontbreekt ? 404 : pagina.status, headers });
  },
} satisfies ExportedHandler<Env>;
