import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';
import { assetFromRef } from '../src/content/image';
import { BLOG_TITLE, HOME_DESCRIPTION, SITE_URL, clamp, pageTitle, slugify } from '../src/meta';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
  /** Empty until a Sanity project exists; the site then falls back to its bundled copy. */
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
  /** Shared with the Studio's preview tab. Unlocks unpublished copy, nothing else. */
  PREVIEW_KEY?: string;
  /** Viewer token, a Worker secret. Only the Worker ever holds it. */
  SANITY_READ_TOKEN?: string;
};

const newsletterWorker = createFormWorker({
  formPath: '/api/forms/newsletter',
  siteName: 'Klashorst Museum',
  ownerName: 'het museum',
  senderName: 'Klashorst Museum',
  subjectPrefix: 'Nieuwe aanmelding nieuwsbrief',
  confirmationFollowUpSentence:
    'U hoort van ons zodra de openingsdatum bekend is en wanneer er nieuw werk in de collectie komt.',
  // An opt-in only needs an address; a name is welcome but never demanded.
  requireFirstName: false,
  requireLastName: false,
  requireEmail: true,
  honeypotField: 'company',
});

const interestWorker = createFormWorker({
  formPath: '/api/forms/interesse',
  siteName: 'Klashorst Museum',
  ownerName: 'het museum',
  senderName: 'Klashorst Museum',
  subjectPrefix: 'Interesse in werk',
  confirmationFollowUpSentence: 'Het museum neemt contact met u op over dit werk.',
  // Which work it is about rides along in the subject line.
  subjectFields: ['werk'],
  messageField: 'bericht',
  requireFirstName: true,
  requireLastName: false,
  requireEmail: true,
  honeypotField: 'company',
});

/**
 * Everything the page needs, in one query. Small enough to inline into the
 * HTML, which is exactly what the Worker does below.
 */
const QUERY = `{
  "teksten": *[_type == "siteTeksten"][0]{hero, werk, peter, s21, galerie, nieuws, bezoek, nieuwsbrief, footer},
  "werk": *[_type == "werk" && defined(afbeelding.asset)] | order(coalesce(volgorde, 9999) asc, _createdAt asc){
    _id, titel, techniek, afmetingen, toelichting, reeks, inZaal, afbeelding
  },
  "nieuws": *[_type == "nieuws"] | order(coalesce(vastgezet, false) desc, datum desc, _createdAt asc){
    _id, titel, slug, datum, datumWeergave, vastgezet, intro, tekst, afbeelding, body
  },
  "galerie": *[_type == "galeriewerk" && defined(afbeelding.asset)] | order(coalesce(volgorde, 9999) asc, _createdAt desc){
    _id, titel, kunstenaar, techniek, afmetingen, jaar, status, prijs, huurprijs, toelichting, afbeelding
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
const LAST_GOOD = 'https://klashorst.jouwidealewebsite.nl/__cms-content';

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

type Doc = Record<string, any>;

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
  canonical: string;
  image: string | null;
  type: 'website' | 'article';
};

/**
 * The address each post sits at. Same rule as the browser: the address from the
 * Studio, or one made from the title, and a number appended if two posts want
 * the same one. Both sides have to agree or a link would resolve to one post in
 * the HTML and another on screen.
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

function pageMeta(
  path: string,
  data: Doc | null,
  projectId: string,
  dataset: string,
): { meta: PageMeta | null; missing: boolean } {
  if (path === '/blog') {
    const t = data?.teksten?.nieuws ?? {};
    const titel = firstString(t.titel, BLOG_TITLE);
    return {
      meta: {
        title: pageTitle(titel),
        description: clamp(firstString(t.lead, HOME_DESCRIPTION)),
        canonical: `${SITE_URL}/blog`,
        image: null,
        type: 'website',
      },
      missing: false,
    };
  }

  const article = /^\/blog\/([^/]+)$/.exec(path);
  if (!article) return { meta: null, missing: false };

  // Sanity unreachable: the app falls back to the copy it was built with, so
  // this is not the moment to tell anyone the post does not exist.
  const posts = Array.isArray(data?.nieuws) ? (data!.nieuws as Doc[]) : null;
  if (!posts) return { meta: null, missing: false };

  const wanted = decodeURIComponent(article[1]);
  const found = addressed(posts).find((entry) => entry.slug === wanted);
  if (!found) {
    return {
      meta: {
        title: pageTitle('Pagina niet gevonden'),
        description: clamp(HOME_DESCRIPTION),
        canonical: `${SITE_URL}/blog`,
        image: null,
        type: 'website',
      },
      missing: true,
    };
  }

  const { post, slug } = found;
  const titel = firstString(post.titel, 'Zonder titel');
  return {
    meta: {
      title: pageTitle(titel),
      description: clamp(firstString(post.intro, bodyText(post.body), post.tekst, HOME_DESCRIPTION)),
      canonical: `${SITE_URL}/blog/${slug}`,
      image: shareImage(post.afbeelding, projectId, dataset),
      type: 'article',
    },
    missing: false,
  };
}

/** Rewrites the head the site ships with to describe the page actually asked for. */
function applyMeta(rewriter: HTMLRewriter, meta: PageMeta): HTMLRewriter {
  const attr = (selector: string, name: string, value: string) =>
    rewriter.on(selector, {
      element(element) {
        element.setAttribute(name, value);
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
  attr('meta[property="og:url"]', 'content', meta.canonical);
  attr('meta[property="og:type"]', 'content', meta.type);
  attr('link[rel="canonical"]', 'href', meta.canonical);
  if (meta.image) attr('meta[property="og:image"]', 'content', meta.image);
  return rewriter;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

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

    if (url.pathname === '/api/forms/interesse') {
      return interestWorker.fetch!(request, env, ctx);
    }
    if (url.pathname.startsWith('/api/')) {
      return newsletterWorker.fetch!(request, env, ctx);
    }

    const response = await env.ASSETS.fetch(request);
    if (!response.headers.get('content-type')?.includes('text/html')) return response;

    const preview = Boolean(env.PREVIEW_KEY) && url.searchParams.get('preview') === env.PREVIEW_KEY;
    const data = (await loadContent(
      env,
      { fresh: url.searchParams.get('fresh') === '1', preview },
      ctx,
    )) as Doc | null;

    const projectId = env.SANITY_PROJECT_ID ?? '';
    const dataset = env.SANITY_DATASET || 'production';
    const { meta, missing } = pageMeta(url.pathname, data, projectId, dataset);
    if (!data && !meta) return response;

    let rewriter = new HTMLRewriter();

    if (data) {
      const payload = inlineJson({ projectId, dataset, preview, data });
      rewriter = rewriter.on('head', {
        element(head) {
          head.append(`<script id="klashorst-content" type="application/json">${payload}</script>`, {
            html: true,
          });
        },
      });
    }

    if (meta) rewriter = applyMeta(rewriter, meta);

    const page = rewriter.transform(response);

    // The document itself must not be held anywhere, or an edit would sit
    // behind a stale page even though the content behind it is current. A
    // preview carries unpublished copy, so it may not be stored at all.
    const headers = new Headers(page.headers);
    headers.set('cache-control', preview ? 'no-store' : 'no-cache');
    if (preview) headers.set('x-robots-tag', 'noindex, nofollow');
    // An address under /blog that belongs to no post is a 404, not a page that
    // happens to say so: a link checker has to be able to tell the difference.
    return new Response(page.body, { status: missing ? 404 : page.status, headers });
  },
} satisfies ExportedHandler<Env>;
