/**
 * The demo's whole server: the Studio at /beheer, and every page with the
 * Sanity content inlined in its <head> so the app renders it on first paint.
 * The same shape as apps/klashorst/worker, minus everything a demo does not need.
 */

interface Env {
  ASSETS: Fetcher;
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
  PREVIEW_KEY?: string;
  /** Viewer token, `wrangler secret put SANITY_READ_TOKEN`. Only used for drafts. */
  SANITY_READ_TOKEN?: string;
}

const QUERY = `{
  "site": *[_id == "siteTeksten"][0]{titel, intro, heroFoto, overTitel, overTekst, contactEmail, contactTelefoon},
  "berichten": *[_type == "bericht"] | order(datum desc){_id, titel, datum, tekst, foto}
}`;

const LAST_GOOD = 'https://demo.jouwconcept.app/__cms-content';
const edgeCache = () => (caches as unknown as { default: Cache }).default;

/**
 * Held at the edge for five seconds, so publish-and-reload shows the change.
 * `?fresh=1` skips that. Drafts (`?preview=<key>`) are never cached, and a
 * Sanity blip falls back to the last good answer instead of the bundled copy.
 */
async function loadContent(
  env: Env,
  opts: { fresh: boolean; preview: boolean },
  ctx: ExecutionContext,
): Promise<{ data: unknown; drafts: boolean }> {
  if (!env.SANITY_PROJECT_ID) return { data: null, drafts: false };
  const dataset = env.SANITY_DATASET || 'production';
  const drafts = opts.preview && Boolean(env.SANITY_READ_TOKEN);
  const url =
    `https://${env.SANITY_PROJECT_ID}.api.sanity.io/v2025-02-19/data/query/${dataset}` +
    `?query=${encodeURIComponent(QUERY)}` +
    (drafts ? '&perspective=drafts' : '');

  try {
    const response = await fetch(url, {
      headers: drafts ? { Authorization: `Bearer ${env.SANITY_READ_TOKEN}` } : {},
      cf: { cacheTtl: drafts || opts.fresh ? 0 : 5, cacheEverything: !drafts },
    });
    if (response.ok) {
      const result = ((await response.json()) as { result?: unknown }).result ?? null;
      if (result && !drafts) {
        ctx.waitUntil(
          edgeCache().put(
            LAST_GOOD,
            new Response(JSON.stringify(result), {
              headers: { 'content-type': 'application/json', 'cache-control': 'max-age=86400' },
            }),
          ),
        );
      }
      return { data: result, drafts: drafts && result !== null };
    }
  } catch {
    // An unreachable CMS must never take the site down.
  }
  if (drafts) return { data: null, drafts: false };
  const stashed = await edgeCache().match(LAST_GOOD);
  return { data: stashed ? await stashed.json() : null, drafts: false };
}

/** JSON is safe inside a script tag once `<` cannot start a closing tag. */
const inlineJson = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);

    // The Studio. Its assets are absolute (/static, /vendor) and come straight
    // off the assets layer; every path under /beheer is a client-side route.
    if (url.pathname === '/beheer' || url.pathname.startsWith('/beheer/')) {
      const studio = await env.ASSETS.fetch(new URL('/beheer/index.html', url));
      const headers = new Headers(studio.headers);
      headers.set('x-robots-tag', 'noindex, nofollow');
      headers.set('cache-control', 'no-cache');
      return new Response(studio.body, { status: studio.status, headers });
    }

    if (url.pathname === '/robots.txt') {
      return new Response('User-agent: *\nDisallow: /\n', {
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      });
    }

    const response = await env.ASSETS.fetch(request);
    if (!response.headers.get('content-type')?.includes('text/html')) return response;

    const preview = Boolean(env.PREVIEW_KEY) && url.searchParams.get('preview') === env.PREVIEW_KEY;
    const { data, drafts } = await loadContent(
      env,
      { fresh: url.searchParams.get('fresh') === '1', preview },
      ctx,
    );

    const headers = new Headers(response.headers);
    headers.set('cache-control', preview ? 'no-store' : 'no-cache');
    headers.set('x-robots-tag', 'noindex, nofollow');
    if (!data) return new Response(response.body, { status: response.status, headers });

    const projectId = env.SANITY_PROJECT_ID ?? '';
    const dataset = env.SANITY_DATASET || 'production';
    const payload = inlineJson({ projectId, dataset, preview: drafts, data });
    const titel = (data as { site?: { titel?: unknown } }).site?.titel;

    let rewriter = new HTMLRewriter().on('head', {
      element(head) {
        head.append(`<script id="demo-content" type="application/json">${payload}</script>`, {
          html: true,
        });
      },
    });
    if (typeof titel === 'string' && titel.trim()) {
      rewriter = rewriter.on('title', {
        element(el) {
          el.setInnerContent(escapeHtml(titel));
        },
      });
    }

    const page = rewriter.transform(response);
    return new Response(page.body, { status: page.status, headers });
  },
} satisfies ExportedHandler<Env>;
