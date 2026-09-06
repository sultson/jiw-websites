import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { type CloudflareFormsEnv } from '@jiw/cloudflare-forms';
import { newsletterWorkers, vraagWorkers } from './forms';
import { HERO_STRIP, HeroShell, type StilWerk } from '../src/components/HeroStill';
import { uiPerTaal } from '../src/content/ui';
import { STRIP_SIZES, assetFromRef, imgFromRef } from '../src/content/image';
import {
  BLOG_TITLE,
  HOME_DESCRIPTION,
  HOME_TITLE,
  HTML_LANG,
  LANGS,
  NOT_FOUND_TITLE,
  OG_LOCALE,
  PRIVACY_DESCRIPTION,
  PRIVACY_TITLE,
  SITE_NAME,
  SITE_URL,
  clamp,
  localeUrl,
  pageTitle,
  slugify,
  splitLang,
  type Lang,
} from '../src/meta';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
  /** Empty until a Sanity project exists; the site then falls back to its bundled copy. */
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
  /** Shared with the Studio's preview tab. Unlocks unpublished copy, nothing else. */
  PREVIEW_KEY?: string;
  /** Viewer token, a Worker secret. Only the Worker ever holds it. */
  SANITY_READ_TOKEN?: string;
  /**
   * "true" once this is the real museum site. Until then every page says
   * noindex and robots.txt disallows everything, so a concept build can never
   * outrank klashorstmuseum.nl.
   */
  SITE_INDEXABLE?: string;
};

/**
 * Which language a submission was made in. Read from a clone, so the form
 * worker still gets an unread body to parse for itself.
 */
async function formTaal(request: Request): Promise<Lang> {
  try {
    const form = await request.clone().formData();
    return form.get('taal') === 'en' ? 'en' : 'nl';
  } catch {
    return 'nl';
  }
}

/**
 * Everything the page needs, in one query, in both languages. Small enough to
 * inline into the HTML, which is exactly what the Worker does below. The `en`
 * object on each document is the translation; the app picks a side by address.
 *
 * Both walls hang in `orderRank` order: the string the Studio's drag-and-drop
 * list writes, which sorts lexicographically into the order the museum dragged
 * the works into. `_createdAt` only settles a tie.
 */
const QUERY = `{
  "teksten": *[_type == "siteTeksten"][0]{
    hero, werk, peter, galerie, nieuws, bezoek, nieuwsbrief, contact, menu, nietGevonden, footer, vindbaarheid
  },
  "werk": *[_type == "werk" && defined(afbeelding.asset)] | order(orderRank asc, _createdAt asc){
    _id, titel, techniek, afmetingen, toelichting, inZaal, afbeelding, en
  },
  "nieuws": *[_type == "nieuws"] | order(coalesce(vastgezet, false) desc, datum desc, _createdAt asc){
    _id, titel, slug, datum, datumWeergave, vastgezet, intro, tekst, afbeelding, body,
    seoTitel, seoOmschrijving, seoFocus, en
  },
  "galerie": *[_type == "galeriewerk" && defined(afbeelding.asset)] | order(orderRank asc, _createdAt asc){
    _id, titel, kunstenaar, techniek, afmetingen, jaar, toelichting, afbeelding, en
  }
}`;

/**
 * Content comes from Sanity at request time.
 *
 * The uncached API, held at the edge for five seconds: long enough that a burst
 * of visitors costs one request, short enough that pressing publish and
 * reloading shows the change. `?fresh=1` skips even that.
 *
 * In preview the query runs against the drafts perspective with a viewer token,
 * so the Studio can show unpublished work. Those answers are never cached.
 */
/**
 * Where the last good answer is kept. A Sanity blip would otherwise drop the
 * page back to the copy this build shipped with, and a client watching their
 * own edit disappear for one request does not think "transient".
 */
const LAST_GOOD = `${SITE_URL}/__cms-content`;

/**
 * `caches.default` is a Workers extension. This tsconfig loads the WebWorker
 * lib alongside the Cloudflare types, and its narrower CacheStorage wins, so
 * the cast is here rather than at each call.
 */
const edgeCache = () => (caches as unknown as { default: Cache }).default;

async function loadContent(
  env: Env,
  opts: { fresh: boolean; preview: boolean },
  ctx: ExecutionContext,
): Promise<unknown> {
  if (!env.SANITY_PROJECT_ID) return null;
  const dataset = env.SANITY_DATASET || 'production';
  const preview = opts.preview && Boolean(env.SANITY_READ_TOKEN);

  const url =
    `https://${env.SANITY_PROJECT_ID}.api.sanity.io/v2025-02-19/data/query/${dataset}` +
    `?query=${encodeURIComponent(QUERY)}` +
    (preview ? '&perspective=drafts' : '');

  try {
    const response = await fetch(url, {
      headers: preview ? { Authorization: `Bearer ${env.SANITY_READ_TOKEN}` } : {},
      cf: { cacheTtl: preview || opts.fresh ? 0 : 5, cacheEverything: !preview },
    });
    if (response.ok) {
      const body = (await response.json()) as { result?: unknown };
      const result = body.result ?? null;
      if (result && !preview) {
        ctx.waitUntil(
          edgeCache().put(
            LAST_GOOD,
            new Response(JSON.stringify(result), {
              headers: { 'content-type': 'application/json', 'cache-control': 'max-age=86400' },
            }),
          ),
        );
      }
      return result;
    }
  } catch {
    // Fall through: a CMS that is unreachable must never take the museum down.
  }

  // Drafts are never served from a copy: a stale draft is worse than none.
  if (preview) return null;
  const stashed = await edgeCache().match(LAST_GOOD);
  return stashed ? await stashed.json() : null;
}

/** JSON is safe inside a script tag once `<` cannot start a closing tag. */
const inlineJson = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

type Doc = Record<string, any>;

/** The English half of a document, when there is one and English is wanted. */
const engels = (doc: Doc | undefined, lang: Lang): Doc =>
  lang === 'en' && doc?.en && typeof doc.en === 'object' ? (doc.en as Doc) : {};

/**
 * What a page is called, and what it looks like when someone shares it.
 *
 * The app writes the same things when it moves between pages in the browser,
 * but only what is written here ever reaches a search engine or the preview in
 * a WhatsApp message: those read the HTML and never run the script. So a blog
 * post shared by the museum arrives with its own headline and its own
 * photograph rather than the museum's front page.
 */
type PageMeta = {
  title: string;
  description: string;
  /** The path without a language, so both alternates can be built from it. */
  path: string;
  image: string | null;
  type: 'website' | 'article';
  /** JSON-LD for this page, already stringified. */
  jsonLd: string | null;
};

/**
 * The address each post sits at. Same rule as the browser: the address from the
 * Studio, or one made from the title, and a number appended if two posts want
 * the same one. Both sides have to agree or a link would resolve to one post in
 * the HTML and another on screen. The address is the Dutch one in both
 * languages: one post, one address, so a link survives a language switch.
 */
function addressed(posts: Doc[]): { slug: string; post: Doc }[] {
  const taken = new Set<string>();
  return posts.map((post) => {
    const given = typeof post?.slug?.current === 'string' ? post.slug.current.trim() : '';
    const base = given || slugify(typeof post?.titel === 'string' && post.titel.trim() ? post.titel : 'Zonder titel');
    let slug = base;
    for (let n = 2; taken.has(slug); n += 1) slug = `${base}-${n}`;
    taken.add(slug);
    return { slug, post };
  });
}

/** The words in a post, for the sentence under a search result. */
function bodyText(body: unknown): string {
  if (!Array.isArray(body)) return '';
  return body
    .filter((block: Doc) => block?._type === 'block' && Array.isArray(block.children))
    .map((block: Doc) =>
      block.children.map((child: Doc) => (typeof child?.text === 'string' ? child.text : '')).join(''),
    )
    .join(' ')
    .trim();
}

/** A post's photograph, cropped to the shape a link preview expects. */
function shareImage(afbeelding: Doc | undefined, projectId: string, dataset: string): string | null {
  const ref = afbeelding?.asset?._ref;
  if (typeof ref !== 'string') return null;
  const asset = assetFromRef(ref, projectId, dataset);
  // 1200x630 exactly, so the width and height already in the HTML stay true.
  return asset ? `${asset.base}?w=1200&h=630&fit=crop&crop=entropy&auto=format` : null;
}

const firstString = (...values: unknown[]): string => {
  for (const value of values) if (typeof value === 'string' && value.trim()) return value;
  return '';
};

/**
 * Structured data. Not decoration: it is what puts a museum in a knowledge
 * panel and a post in a news carousel, and it is the half of Yoast's job that
 * a page cannot do with meta tags alone.
 */
const museumJsonLd = (lang: Lang) =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Museum',
    name: SITE_NAME,
    url: localeUrl(lang, '/'),
    description: HOME_DESCRIPTION[lang],
    inLanguage: HTML_LANG[lang],
    about: {
      '@type': 'Person',
      name: 'Peter Klashorst',
      birthDate: '1957',
      deathDate: '2024-09-11',
      jobTitle: lang === 'en' ? 'Painter' : 'Schilder',
    },
  });

const articleJsonLd = (opts: {
  lang: Lang;
  title: string;
  description: string;
  url: string;
  image: string | null;
  published?: string;
}) =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    inLanguage: HTML_LANG[opts.lang],
    mainEntityOfPage: opts.url,
    ...(opts.image ? { image: opts.image } : {}),
    ...(opts.published ? { datePublished: opts.published } : {}),
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  });

/**
 * The head for an address the site has no page for.
 *
 * Deliberately without a canonical and without alternates: a 404 that names the
 * homepage as its canonical is exactly what makes a search engine file it as a
 * soft 404 and index it anyway. It keeps the page's own title, so a visitor who
 * shares the link sends something that reads as what it is.
 */
function notFound(path: string, lang: Lang, data: Doc | null): { meta: PageMeta; missing: true } {
  const weg = data?.teksten?.nietGevonden ?? {};
  return {
    meta: {
      title: pageTitle(firstString(engels(weg, lang).titel, weg.titel, NOT_FOUND_TITLE[lang])),
      description: clamp(HOME_DESCRIPTION[lang]),
      path,
      image: null,
      type: 'website',
      jsonLd: null,
    },
    missing: true,
  };
}

function pageMeta(
  path: string,
  lang: Lang,
  data: Doc | null,
  projectId: string,
  dataset: string,
): { meta: PageMeta | null; missing: boolean } {
  if (path === '/') {
    // What the museum wrote in the Studio, or the copy this build shipped with.
    const blok = data?.teksten?.vindbaarheid ?? {};
    const vert = engels(blok, lang);
    return {
      meta: {
        title: firstString(vert.titel, blok.titel, HOME_TITLE[lang]),
        description: clamp(firstString(vert.omschrijving, blok.omschrijving, HOME_DESCRIPTION[lang])),
        path: '/',
        image: null,
        type: 'website',
        jsonLd: museumJsonLd(lang),
      },
      missing: false,
    };
  }

  if (path === '/blog') {
    const blok = data?.teksten?.nieuws ?? {};
    const vert = engels(blok, lang);
    const titel = firstString(vert.titel, blok.titel, BLOG_TITLE[lang]);
    return {
      meta: {
        title: pageTitle(titel),
        description: clamp(firstString(vert.lead, blok.lead, HOME_DESCRIPTION[lang])),
        path: '/blog',
        image: null,
        type: 'website',
        jsonLd: null,
      },
      missing: false,
    };
  }

  if (path === '/privacy') {
    return {
      meta: {
        title: pageTitle(PRIVACY_TITLE[lang]),
        description: clamp(PRIVACY_DESCRIPTION[lang]),
        path: '/privacy',
        image: null,
        type: 'website',
        jsonLd: null,
      },
      missing: false,
    };
  }

  const article = /^\/blog\/([^/]+)$/.exec(path);
  // Not the museum, the blog, the privacy page or an article: there is no page
  // at this address. The app has always drawn its own "page not found" here;
  // what it was answered with was a 200.
  if (!article) return notFound(path, lang, data);

  // Sanity unreachable: the app falls back to the copy it was built with, so
  // this is not the moment to tell anyone the post does not exist.
  const posts = Array.isArray(data?.nieuws) ? (data!.nieuws as Doc[]) : null;
  if (!posts) return { meta: null, missing: false };

  // A slug is whatever is in the address, and an address can be malformed.
  // `/blog/%zz` is a request for a post that cannot exist, which is a 404; it
  // is not a reason for the Worker to throw.
  let wanted: string;
  try {
    wanted = decodeURIComponent(article[1]);
  } catch {
    return notFound(path, lang, data);
  }
  const found = addressed(posts).find((entry) => entry.slug === wanted);
  if (!found) return notFound(path, lang, data);

  const { post, slug } = found;
  const vert = engels(post, lang);
  const titel = firstString(vert.titel, post.titel, 'Zonder titel');
  // What the client wrote in the SEO panel wins over what the page is called:
  // that panel exists so a headline and a search result can differ.
  const title = firstString(vert.seoTitel, post.seoTitel, pageTitle(titel));
  const description = clamp(
    firstString(
      vert.seoOmschrijving,
      post.seoOmschrijving,
      vert.intro,
      bodyText(vert.body),
      post.intro,
      bodyText(post.body),
      post.tekst,
      HOME_DESCRIPTION[lang],
    ),
  );
  const image = shareImage(post.afbeelding, projectId, dataset);
  const url = localeUrl(lang, `/blog/${slug}`);
  return {
    meta: {
      title,
      description,
      path: `/blog/${slug}`,
      image,
      type: 'article',
      jsonLd: articleJsonLd({
        lang,
        title: titel,
        description,
        url,
        image,
        published: typeof post.datum === 'string' ? post.datum : undefined,
      }),
    },
    missing: false,
  };
}

/** Rewrites the head the site ships with to describe the page actually asked for. */
function applyMeta(
  rewriter: HTMLRewriter,
  meta: PageMeta,
  lang: Lang,
  indexable: boolean,
  missing: boolean,
): HTMLRewriter {
  const attr = (selector: string, name: string, value: string) =>
    rewriter.on(selector, {
      element(element) {
        element.setAttribute(name, value);
      },
    });

  const canonical = localeUrl(lang, meta.path);

  rewriter.on('html', {
    element(element) {
      element.setAttribute('lang', HTML_LANG[lang]);
    },
  });
  rewriter.on('title', {
    element(element) {
      element.setInnerContent(meta.title);
    },
  });
  attr('meta[name="description"]', 'content', meta.description);
  attr('meta[property="og:title"]', 'content', meta.title);
  attr('meta[property="og:description"]', 'content', meta.description);
  attr('meta[property="og:type"]', 'content', meta.type);
  attr('meta[property="og:locale"]', 'content', OG_LOCALE[lang]);
  if (meta.image) attr('meta[property="og:image"]', 'content', meta.image);

  // An address with no page behind it has no canonical address either, and no
  // version of itself in the other language. The tags the file ships with name
  // the homepage, so they are removed rather than rewritten. The status is what
  // keeps this page out of the index; `noindex` covers the crawl that has
  // already fetched the page before it reads the status line.
  if (missing) {
    const drop = (selector: string) =>
      rewriter.on(selector, {
        element(element) {
          element.remove();
        },
      });
    drop('link[rel="canonical"]');
    drop('meta[property="og:url"]');
    attr('meta[name="robots"]', 'content', 'noindex, follow');
    return rewriter;
  }

  attr('meta[property="og:url"]', 'content', canonical);
  attr('link[rel="canonical"]', 'href', canonical);
  attr('meta[name="robots"]', 'content', indexable ? 'index, follow' : 'noindex, nofollow');

  // The same page in the other language, named for whoever is looking for it.
  const alternates = [
    ...LANGS.map(
      (code) =>
        `<link rel="alternate" hreflang="${HTML_LANG[code]}" href="${escapeHtml(localeUrl(code, meta.path))}" />`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${escapeHtml(localeUrl('nl', meta.path))}" />`,
    meta.jsonLd
      ? `<script type="application/ld+json">${meta.jsonLd.replace(/</g, '\\u003c')}</script>`
      : '',
  ].join('');

  rewriter.on('head', {
    element(head) {
      head.append(alternates, { html: true });
    },
  });

  return rewriter;
}

/**
 * The painting the first screen is mostly made of.
 *
 * A fallback for the page that could not be given a hero to paint: without one,
 * the strip is rendered by the app, from content in a script tag, so the request
 * for it would start only once the bundle had been fetched and parsed. Named
 * here it starts with the document instead.
 *
 * Same address, same srcset and same sizes as the component, or the preload is
 * a second download rather than a head start.
 */
function heroPreload(data: Doc | null, projectId: string, dataset: string): string {
  const werken = Array.isArray(data?.werk) ? (data!.werk as Doc[]) : [];
  const eerste = werken.find(
    (doc) => doc?.inZaal !== false && typeof doc?.afbeelding?.asset?._ref === 'string',
  );
  const img = eerste ? imgFromRef(eerste.afbeelding.asset._ref as string, projectId, dataset) : null;
  if (!img) return '';
  return (
    `<link rel="preload" as="image" fetchpriority="high" href="${escapeHtml(img.strip)}"` +
    ` imagesrcset="${escapeHtml(img.stripSet)}" imagesizes="${escapeHtml(STRIP_SIZES)}">`
  );
}

/**
 * The hero's photographs, on the museum's own address.
 *
 * A pass-through to Sanity's image CDN and nothing more, so the one image the
 * front page waits for arrives over the connection that already carried the
 * document instead of paying for a second host. Held at the edge for a year:
 * a Sanity asset id is a hash of the file, so this address and these bytes are
 * the same pair forever.
 *
 * Deliberately narrow. Only a real asset filename and only the handful of
 * parameters `imgFromRef` writes get through, or this is an open image proxy
 * that anyone can point at anything and have the museum pay for.
 */
const FOTO_BESTAND = /^[a-f0-9]{40}-\d{1,5}x\d{1,5}\.(?:webp|jpe?g|png)$/;
const FOTO_PARAMS = new Set(['w', 'h', 'q', 'fit', 'fm', 'auto']);

async function foto(url: URL, env: Env, ctx: ExecutionContext): Promise<Response> {
  const bestand = url.pathname.slice('/foto/'.length);
  if (!FOTO_BESTAND.test(bestand) || !env.SANITY_PROJECT_ID) {
    return new Response('Not found', { status: 404 });
  }

  const params = new URLSearchParams();
  for (const key of FOTO_PARAMS) {
    const value = url.searchParams.get(key);
    if (value !== null && /^[a-zA-Z0-9=,.-]{1,32}$/.test(value)) params.set(key, value);
  }

  const dataset = env.SANITY_DATASET || 'production';
  const bron = `https://cdn.sanity.io/images/${env.SANITY_PROJECT_ID}/${dataset}/${bestand}?${params}`;

  const sleutel = new Request(url.toString(), { method: 'GET' });
  const bewaard = await edgeCache().match(sleutel);
  if (bewaard) return bewaard;

  const antwoord = await fetch(bron, { cf: { cacheTtl: 31536000, cacheEverything: true } });
  if (!antwoord.ok) {
    return new Response('Not found', { status: antwoord.status === 404 ? 404 : 502 });
  }

  const headers = new Headers();
  headers.set('content-type', antwoord.headers.get('content-type') ?? 'image/webp');
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  const uit = new Response(antwoord.body, { headers });
  ctx.waitUntil(edgeCache().put(sleutel, uit.clone()));
  return uit;
}

/**
 * The first screen, written into the page before it is sent.
 *
 * Without this the museum's opening screen is a black rectangle until a phone
 * has fetched, parsed and run the whole bundle: the room's photographs, the
 * name of the museum and its opening sentence all live in React, and React is
 * the last thing to arrive. Rendered here they are simply in the HTML, painted
 * the moment the document lands, and the bundle replaces them with the same
 * markup a second later.
 *
 * It is the app's own components doing the rendering — `HeroShell` is what
 * `HeroRoom` builds its resting state out of — so this cannot drift into a
 * second, slightly different hero that shifts the page when React catches up.
 *
 * Only the first screen. Everything below it is off screen at first paint and
 * belongs to the bundle.
 */
function heroShell(data: Doc | null, lang: Lang, projectId: string, dataset: string): string {
  const hero = data?.teksten?.hero ?? {};
  const vert = engels(hero, lang);
  const t = {
    titel: firstString(vert.titel, hero.titel),
    tagline: firstString(vert.tagline, hero.tagline),
    lead: firstString(vert.lead, hero.lead),
    knop: firstString(vert.knop, hero.knop),
  };

  // The same four works the strip shows, chosen the same way: hung in the
  // room, photographed, in the order the museum dragged them into.
  const zonderTitel = uiPerTaal[lang].werk.zonderTitel;
  const werken: StilWerk[] = [];
  for (const doc of Array.isArray(data?.werk) ? (data!.werk as Doc[]) : []) {
    if (werken.length >= HERO_STRIP) break;
    if (doc?.inZaal === false) continue;
    const ref = doc?.afbeelding?.asset?._ref;
    if (typeof ref !== 'string' || !doc._id) continue;
    const img = imgFromRef(ref, projectId, dataset);
    if (!img) continue;
    const werkVert = engels(doc, lang);
    const alt =
      [
        firstString(werkVert.titel, doc.titel),
        firstString(werkVert.techniek, doc.techniek),
        firstString(doc.afmetingen),
      ]
        .filter(Boolean)
        .join(', ') || zonderTitel;
    werken.push({ id: String(doc._id), alt, img });
  }

  if (!werken.length && !t.titel) return '';
  return renderToStaticMarkup(createElement(HeroShell, { t, werken }));
}

/** Every address worth crawling, in both languages, pointing at each other. */
function sitemap(data: Doc | null): string {
  const paths = ['/', '/blog', '/privacy'];
  const posts = Array.isArray(data?.nieuws) ? (data!.nieuws as Doc[]) : [];
  for (const { slug } of addressed(posts)) paths.push(`/blog/${slug}`);

  const entries = paths
    .flatMap((path) =>
      LANGS.map((lang) => {
        const alternates = LANGS.map(
          (other) =>
            `<xhtml:link rel="alternate" hreflang="${HTML_LANG[other]}" href="${escapeHtml(localeUrl(other, path))}"/>`,
        ).join('');
        return `<url><loc>${escapeHtml(localeUrl(lang, path))}</loc>${alternates}</url>`;
      }),
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries}</urlset>`;
}

/**
 * The museum has one address. The Worker also answers on www and on the
 * jouwidealewebsite.nl subdomain this was built at, and both send a visitor
 * (and a crawler) on rather than serving a second copy of the site for a search
 * engine to pick between.
 *
 * Only over https, and only for a request that can be repeated: `wrangler dev`
 * hands the Worker the custom domain's own hostname over http, so without that
 * guard local development redirects itself to production, and a 301 on a form
 * POST would drop the submission.
 */
const CANONICAL_HOST = new URL(SITE_URL).host;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const indexable = env.SITE_INDEXABLE === 'true';

    if (
      url.protocol === 'https:' &&
      url.host !== CANONICAL_HOST &&
      (request.method === 'GET' || request.method === 'HEAD')
    ) {
      url.host = CANONICAL_HOST;
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    // The Studio, on the museum's own domain. Its assets are absolute (/static,
    // /vendor) and served straight off the assets layer; every other path under
    // /beheer is a client-side route and gets the Studio's page.
    if (url.pathname === '/beheer' || url.pathname.startsWith('/beheer/')) {
      const studio = await env.ASSETS.fetch(new URL('/beheer/index.html', url));
      const headers = new Headers(studio.headers);
      headers.set('x-robots-tag', 'noindex, nofollow');
      headers.set('cache-control', 'no-cache');
      return new Response(studio.body, { status: studio.status, headers });
    }

    // Two forms, named. Everything else under /api is nothing: a catch-all here
    // would quietly accept a newsletter sign-up at any address anyone guessed,
    // and would keep answering at the address of an endpoint that was removed.
    if (url.pathname === '/api/forms/vraag') {
      return vraagWorkers[await formTaal(request)].fetch!(request, env, ctx);
    }
    if (url.pathname === '/api/forms/newsletter') {
      return newsletterWorkers[await formTaal(request)].fetch!(request, env, ctx);
    }
    if (url.pathname.startsWith('/api/')) {
      return new Response('Not found', { status: 404 });
    }

    if (url.pathname.startsWith('/foto/')) return foto(url, env, ctx);

    if (url.pathname === '/robots.txt') {
      const body = indexable
        ? `User-agent: *\nDisallow: /beheer\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
        : `# Conceptversie. Niets hiervan hoort in de index zolang klashorstmuseum.nl bestaat.\nUser-agent: *\nDisallow: /\n`;
      return new Response(body, {
        headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'max-age=300' },
      });
    }

    if (url.pathname === '/sitemap.xml') {
      const data = (await loadContent(env, { fresh: false, preview: false }, ctx)) as Doc | null;
      return new Response(sitemap(data), {
        headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'max-age=300' },
      });
    }

    const response = await env.ASSETS.fetch(request);
    if (!response.headers.get('content-type')?.includes('text/html')) return response;

    const { lang, path } = splitLang(url.pathname);
    const preview = Boolean(env.PREVIEW_KEY) && url.searchParams.get('preview') === env.PREVIEW_KEY;
    const data = (await loadContent(
      env,
      { fresh: url.searchParams.get('fresh') === '1', preview },
      ctx,
    )) as Doc | null;

    const projectId = env.SANITY_PROJECT_ID ?? '';
    const dataset = env.SANITY_DATASET || 'production';
    const { meta, missing } = pageMeta(path, lang, data, projectId, dataset);
    if (!data && !meta) return response;

    let rewriter = new HTMLRewriter();

    if (data) {
      const payload = inlineJson({ projectId, dataset, preview, data });
      // Only the museum page has the room, so only it names a photograph and
      // only it is worth painting before the bundle arrives.
      const shell = path === '/' ? heroShell(data, lang, projectId, dataset) : '';
      // The shell puts the photograph in the document itself, which is a better
      // head start than a link to it; the preload is for the page that has no
      // shell to paint.
      const preload = path === '/' && !shell ? heroPreload(data, projectId, dataset) : '';

      rewriter = rewriter.on('head', {
        element(head) {
          head.append(
            `${preload}<script id="klashorst-content" type="application/json">${payload}</script>`,
            { html: true },
          );
        },
      });

      if (shell) {
        rewriter = rewriter.on('#root', {
          element(root) {
            root.setInnerContent(shell, { html: true });
          },
        });
      }
    }

    if (meta) rewriter = applyMeta(rewriter, meta, lang, indexable && !preview, missing);

    const page = rewriter.transform(response);

    // The document itself must not be held anywhere, or an edit would sit
    // behind a stale page even though the content behind it is current. A
    // preview carries unpublished copy, so it may not be stored at all.
    const headers = new Headers(page.headers);
    headers.set('cache-control', preview ? 'no-store' : 'no-cache');
    if (preview || !indexable) headers.set('x-robots-tag', 'noindex, nofollow');
    // An address under /blog that belongs to no post is a 404, not a page that
    // happens to say so: a link checker has to be able to tell the difference.
    return new Response(page.body, { status: missing ? 404 : page.status, headers });
  },
} satisfies ExportedHandler<Env>;
