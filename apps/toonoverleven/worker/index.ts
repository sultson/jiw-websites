import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';
import { assetVanRef } from '../src/content/image';
import { contentVan, type RawPayload } from '../src/content';
import { tekenPagina } from '../src/entry-server';
import { vindPagina } from '../src/inhoud';
import { metFeiten } from '../src/inhoud/feiten';
import { berichtJsonLd, metaVoorPagina, robotsTxt, sitemapXml, type PaginaMeta } from './seo';
import {
  NIET_GEVONDEN,
  PADEN,
  PAGINAS,
  SITE_URL,
  absoluutUrl,
  kort,
  paginaTitel,
  schoonPad,
  slugify,
  VERHUISD,
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
    'Een van onze vrijwilligers neemt contact met je op. Wil je liever meteen iemand spreken, bel dan 036-8450265.',
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
 *
 * Elk blok dat het beheer kent staat hier opgesomd, `praktisch` inbegrepen: de
 * openingstijden, de kosten, het adres en de alinea voor verwijzers. Die staan
 * op tien pagina's en veranderen zonder dat er iemand aan de site werkt. Wat
 * hier niet opgesomd staat wordt niet opgehaald, en dan blijft de site de tekst
 * tonen waarmee hij gebouwd is terwijl het beheer iets anders zegt. Komt er een
 * blok bij in studio/schemas/siteTeksten.ts, dan hoort het hier ook bij.
 */
const query = (vandaag: string) => `{
  "teksten": *[_type == "siteTeksten"][0]{
    hero, open, nieuwsBlok, agendaBlok, welkom, wieWeZijn, watWeDoen, naam, jongeren,
    vrijwilliger, steun, verantwoording, contact, praktisch
  },
  "agenda": *[_type == "activiteit" && (
    (defined(herhaling) && herhaling != "eenmalig") || coalesce(totDatum, datum) >= "${vandaag}"
  )] | order(datum asc){
    _id, soort, titel, categorie, omschrijving, afbeelding, datum, totDatum, heleDag,
    begintijd, eindtijd, herhaling, herhaalTot, overslaan, aanmelden, bijdrage, locatie,
    doelgroepen, themas
  },
  "nieuws": *[_type == "nieuws"] | order(coalesce(vastgezet, false) desc, datum desc){
    _id, titel, slug, datum, vastgezet, intro, body, afbeelding, instagram, facebook,
    seoTitel, seoOmschrijving
  },
  "verhalen": *[_type == "verhaal" && toestemming == true && status == "gepubliceerd"] | order(datum desc){
    _id, kop, verteller, rubriek, intro, body, afbeelding, datum, link
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

type Doc = Record<string, any>;

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
 * De head van de gevraagde pagina.
 *
 * De titels, de omschrijvingen en de gestructureerde gegevens van de
 * tweeënzeventig vastgestelde pagina's komen uit worker/seo.ts, dat dezelfde
 * inhoudsboom leest als de site zelf. Alleen het nieuws komt uit het beheer en
 * wordt hier opgelost.
 */
function paginaMeta(
  pad: string,
  data: Doc | null,
  teksten: ReturnType<typeof contentVan>['teksten'],
  projectId: string,
  dataset: string,
): { meta: PaginaMeta | null; ontbreekt: boolean } {
  const vast = metaVoorPagina(pad);
  if (vast) {
    // De omschrijving in een zoekresultaat hoort te zeggen wat er op de pagina
    // staat. Op een paar pagina's is die tekst hier bijgewerkt met wat het
    // bestuur inmiddels bevestigd heeft, dus die versie wint.
    const bron = vindPagina(pad);
    const bijgewerkt = bron ? metFeiten(bron, teksten).omschrijving : '';
    return {
      meta: bijgewerkt ? { ...vast, omschrijving: kort(bijgewerkt) } : vast,
      ontbreekt: false,
    };
  }

  if (pad === '/nieuws') {
    const overzicht = PAGINAS['/nieuws'];
    return {
      meta: {
        titel: paginaTitel(overzicht.titel),
        omschrijving: kort(overzicht.omschrijving),
        pad,
        beeld: null,
        type: 'website',
        jsonLd: null,
      },
      ontbreekt: false,
    };
  }

  // Geen vastgestelde pagina, niet het nieuwsoverzicht en geen bericht: dan
  // bestaat dit adres niet. Dat hoort een 404 te zijn en niet een pagina die
  // dat toevallig zegt, anders ziet geen enkele linkchecker het verschil.
  const artikel = /^\/nieuws\/([^/]+)$/.exec(pad);
  if (!artikel) return { meta: null, ontbreekt: true };

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
        pad: `/nieuws/${slug}`,
        beeld,
        gepubliceerd: typeof bericht.datum === 'string' ? bericht.datum : undefined,
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
  const regels: { pad: string; gewijzigd?: string }[] = PADEN.map((pad) => ({ pad }));
  const berichten = Array.isArray(data?.nieuws) ? (data!.nieuws as Doc[]) : [];
  for (const { slug, bericht } of metAdres(berichten)) {
    regels.push({
      pad: `/nieuws/${slug}`,
      gewijzigd: typeof bericht.datum === 'string' ? bericht.datum : undefined,
    });
  }
  return sitemapXml(regels);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const indexeerbaar = env.SITE_INDEXABLE === 'true';

    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    // De site heette acht pagina's lang anders. Een oude link uit een mail, een
    // folder of Google hoort op de nieuwe plek uit te komen en niet op een
    // foutmelding, en met een 301 verhuist de vindbaarheid mee.
    const nieuwePlek = VERHUISD[schoonPad(url.pathname)];
    if (nieuwePlek) {
      url.pathname = nieuwePlek;
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
      return new Response(robotsTxt(indexeerbaar), {
        headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'max-age=300' },
      });
    }

    if (url.pathname === '/sitemap.xml') {
      // Een concept hoort niet alleen buiten de index te blijven, maar ook
      // buiten de kaart die je aan een zoekmachine geeft.
      if (!indexeerbaar) return new Response('Niet gevonden', { status: 404 });
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

    // De inhoud wordt hier één keer opgebouwd, en daarna twee keer gebruikt:
    // om de pagina te tekenen en om de head te schrijven. Zo kan de HTML die
    // verstuurd wordt niet iets anders zeggen dan wat erin staat.
    const payload: RawPayload = { projectId, dataset, preview: voorbeeld, data: data as never };
    const inhoud = contentVan(data ? payload : null);

    const { meta, ontbreekt } = paginaMeta(pad, data, inhoud.teksten, projectId, dataset);

    let rewriter = new HTMLRewriter();

    // Het moment waarop deze pagina getekend wordt. De browser rekent er bij
    // het overnemen mee, anders kan de agenda daar net één keer anders
    // uitvallen dan in de HTML en gooit React de hele server-versie weg.
    const nu = Date.now();
    rewriter = rewriter.on('html', {
      element(html) {
        html.setAttribute('data-nu', String(nu));
      },
    });

    if (data) {
      const meegestuurd = inlineJson({ projectId, dataset, preview: voorbeeld, data });
      rewriter = rewriter.on('head', {
        element(head) {
          head.append(
            `<script id="toonoverleven-content" type="application/json">${meegestuurd}</script>`,
            { html: true },
          );
        },
      });
    }

    // De pagina getekend meesturen. De opdrachtgever vraagt er in zijn eigen
    // eisen om: iedere pagina moet zijn hoofdinhoud in de broncode hebben, voor
    // een zoekmachine, een voorleesprogramma en een trage verbinding. Gaat het
    // tekenen mis, dan gaat de lege huls eruit en tekent de browser hem alsnog.
    try {
      const getekend = await tekenPagina({ pad, inhoud, voorbeeld, nu });
      rewriter = rewriter.on('#root', {
        element(wortel) {
          wortel.setInnerContent(getekend, { html: true });
        },
      });
    } catch {
      // Doorlopen: een pagina die de browser zelf tekent is nog altijd een
      // pagina, en een storing hier mag het inloophuis niet offline halen.
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
