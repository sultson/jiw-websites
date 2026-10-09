// Indexing audit. Usage: node tools/seo.mjs [origin]   (default https://jasmflowers.com)
//
// Written for the move onto jasmflowers.com on 09-10-2026. The question it answers is
// narrow: if Google crawls this site today, does it find anything to complain about?
// So it checks the things Search Console actually reports as errors or exclusions —
// redirect hops inside the sitemap, canonicals that disagree with the URL they sit on,
// one-way hreflang, soft 404s, pages in the sitemap that are noindex, and any absolute
// URL still pointing at an address the site has moved off.
//
// Every assertion runs against the deployed site over the network. Nothing is read off
// dist/, because the thing being tested is partly Cloudflare's behaviour (trailing-slash
// handling, the redirect rules, the 404 status) and that does not exist locally.

const ORIGIN = (process.argv[2] || 'https://jasmflowers.com').replace(/\/$/, '');
const OLD = ['jasmflowers.jouwidealewebsite.nl', 'flower.jouwidealewebsite.nl'];

let pass = 0;
const fails = [];
const ok = (cond, label, detail = '') => {
  if (cond) pass++;
  else fails.push(`${label}${detail ? ` — ${detail}` : ''}`);
};

// Cloudflare rate-limits a fast serial crawl of a free zone less than it does a burst,
// and the page count here is small, so a modest pool keeps the whole run under a minute
// without ever having more than six requests in flight.
async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); }
  }));
  return out;
}

const get = (url, opts = {}) => fetch(url, { redirect: 'manual', ...opts });

const attr = (html, re) => { const m = html.match(re); return m ? m[1] : null; };

/* ---------------- robots.txt ---------------- */
{
  const r = await get(`${ORIGIN}/robots.txt`);
  ok(r.status === 200, 'robots.txt is 200', `got ${r.status}`);
  const body = await r.text();
  ok(/^Allow: \/$/m.test(body), 'robots.txt allows the crawl');
  ok(!/^Disallow: \/$/m.test(body), 'robots.txt does not block the site');
  const sm = body.match(/^Sitemap:\s*(\S+)$/m);
  ok(!!sm, 'robots.txt names a sitemap');
  ok(sm && sm[1] === `${ORIGIN}/sitemap.xml`, 'sitemap line is on the live origin',
    sm ? sm[1] : 'absent');
  ok(!OLD.some(h => body.includes(h)), 'robots.txt has no old hostname');
}

/* ---------------- sitemap.xml ---------------- */
const r = await get(`${ORIGIN}/sitemap.xml`);
ok(r.status === 200, 'sitemap.xml is 200', `got ${r.status}`);
const xml = await r.text();
ok((r.headers.get('content-type') || '').includes('xml'), 'sitemap is served as XML',
  r.headers.get('content-type') || 'no content-type');

const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
ok(locs.length > 0, 'sitemap has entries');
ok(new Set(locs).size === locs.length, 'sitemap has no duplicate URLs',
  `${locs.length} entries, ${new Set(locs).size} unique`);
ok(locs.every(u => u.startsWith(`${ORIGIN}/`)), 'every sitemap URL is on the live origin',
  locs.filter(u => !u.startsWith(`${ORIGIN}/`)).slice(0, 3).join(' '));
ok(!OLD.some(h => xml.includes(h)), 'sitemap has no old hostname');
ok(locs.every(u => u.endsWith('/') || u.includes('.')), 'sitemap URLs are in canonical form');

const inSitemap = new Set(locs);

/* ---------------- every page in the sitemap ---------------- */
const pages = await pool(locs, 6, async url => {
  const res = await get(url);
  if (res.status !== 200) return { url, status: res.status };
  const html = await res.text();
  return {
    url,
    status: 200,
    html,
    canonical: attr(html, /<link rel="canonical" href="([^"]+)"/),
    robots: attr(html, /<meta name="robots" content="([^"]+)"/),
    ogUrl: attr(html, /<meta property="og:url" content="([^"]+)"/),
    title: attr(html, /<title>([^<]*)<\/title>/),
    desc: attr(html, /<meta name="description" content="([^"]*)"/),
    lang: attr(html, /<html lang="([^"]+)"/),
    alts: [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)]
      .map(m => ({ code: m[1], href: m[2] })),
  };
});

for (const p of pages) {
  const id = p.url.replace(ORIGIN, '') || '/';
  // A redirect or a 404 on a URL we put in the sitemap ourselves is the single most
  // common Search Console error, so it is checked first and hard.
  ok(p.status === 200, `${id} answers 200 directly`, `got ${p.status}`);
  if (p.status !== 200) continue;

  ok(p.canonical === p.url, `${id} canonical points at itself`, `canonical=${p.canonical}`);
  ok(!p.robots || !/noindex/i.test(p.robots), `${id} is not noindex`, p.robots || '');
  ok(p.ogUrl === p.url, `${id} og:url matches the canonical`, `og:url=${p.ogUrl}`);
  ok(!!p.title && p.title.length > 10, `${id} has a title`, p.title || 'absent');
  ok(!!p.desc && p.desc.length > 40, `${id} has a description`,
    p.desc ? `${p.desc.length} chars` : 'absent');

  // hreflang: three languages plus x-default, every one of them a URL we also publish.
  const codes = p.alts.map(a => a.code).sort();
  ok(JSON.stringify(codes) === JSON.stringify(['de', 'en', 'nl', 'x-default']),
    `${id} lists all three languages and x-default`, codes.join(','));
  ok(p.alts.some(a => a.href === p.url), `${id} hreflang set includes itself`);
  for (const a of p.alts) {
    if (a.code === 'x-default') continue;
    ok(inSitemap.has(a.href), `${id} hreflang ${a.code} target is in the sitemap`, a.href);
  }
  // The page's own language must match the hreflang entry claiming it.
  const self = p.alts.find(a => a.href === p.url && a.code !== 'x-default');
  ok(self && self.code === p.lang, `${id} html lang agrees with its hreflang`,
    `lang=${p.lang} hreflang=${self?.code}`);

  // Nothing absolute may still point at an address the site has moved off. The footer
  // credit link to jouwidealewebsite.nl itself is legitimate, so only the two old
  // hostnames for THIS site count.
  for (const h of OLD) ok(!p.html.includes(h), `${id} has no link to ${h}`);
  // Only things the browser would actually fetch. A bare `http://` search also hits
  // xmlns="http://www.w3.org/2000/svg", which is an XML namespace identifier and has to
  // be that exact string - it is not a URL and is never requested.
  const insecure = [...p.html.matchAll(/(?:href|src|content)="(http:\/\/[^"]+)"/g)]
    .map(m => m[1]);
  ok(insecure.length === 0, `${id} fetches nothing over plain http`, insecure.slice(0, 2).join(' '));
}

/* ---------------- hreflang reciprocity ---------------- */
// Google drops a whole hreflang cluster if the return link is missing, and that is only
// visible by cross-referencing pages, not by reading one.
const byUrl = new Map(pages.filter(p => p.status === 200).map(p => [p.url, p]));
for (const p of byUrl.values()) {
  for (const a of p.alts) {
    if (a.code === 'x-default') continue;
    const other = byUrl.get(a.href);
    if (!other) continue;
    ok(other.alts.some(b => b.href === p.url),
      `${a.href.replace(ORIGIN, '')} links back to ${p.url.replace(ORIGIN, '')}`);
  }
}

/* ---------------- things that must NOT be indexed ---------------- */
{
  // A soft 404 - unknown path answering 200 - is an error in Search Console. Cloudflare
  // only returns a real 404 here because of not_found_handling in wrangler.jsonc.
  const res = await get(`${ORIGIN}/no-such-page-9a7f/`);
  ok(res.status === 404, 'an unknown path returns a real 404', `got ${res.status}`);
  const html = await res.text();
  ok(/noindex/i.test(html), '404 page is noindex');
  ok(!inSitemap.has(`${ORIGIN}/404.html`), '404 is not in the sitemap');
}
for (const sheet of ['/catalogue-sheet/', '/nl/catalogue-sheet/', '/de/catalogue-sheet/']) {
  const res = await get(ORIGIN + sheet);
  ok(res.status === 200, `${sheet} is reachable for the PDF build`, `got ${res.status}`);
  ok(/noindex/i.test(await res.text()), `${sheet} is noindex`);
  ok(!inSitemap.has(ORIGIN + sheet), `${sheet} is not in the sitemap`);
}

/* ---------------- trailing slash, one address per page ---------------- */
for (const slug of ['/about', '/catalogue', '/nl/contact', '/de/shipping']) {
  const res = await get(ORIGIN + slug);
  ok(res.status === 307 || res.status === 301, `${slug} redirects to the slashed form`,
    `got ${res.status}`);
  const loc = res.headers.get('location') || '';
  ok(loc.endsWith(`${slug}/`), `${slug} redirect target is ${slug}/`, loc);
}

/* ---------------- the three PDFs ---------------- */
for (const pdf of ['/jasm-flowers-catalogue.pdf', '/nl/jasm-flowers-catalogue.pdf',
  '/de/jasm-flowers-catalogue.pdf']) {
  const res = await get(ORIGIN + pdf);
  ok(res.status === 200, `${pdf} is 200`, `got ${res.status}`);
  ok((res.headers.get('content-type') || '').includes('pdf'), `${pdf} is served as a PDF`,
    res.headers.get('content-type') || '');
}

/* ---------------- the addresses the site moved off ---------------- */
for (const host of OLD) {
  for (const p of ['/', '/catalogue/', '/nl/about/']) {
    const res = await get(`https://${host}${p}`);
    ok(res.status === 301, `${host}${p} is a 301`, `got ${res.status}`);
    ok(res.headers.get('location') === `${ORIGIN}${p}`,
      `${host}${p} lands on the matching page`, res.headers.get('location') || '');
  }
}
{
  const res = await get('https://www.jasmflowers.com/nl/catalogue/?utm_source=t');
  ok(res.status === 301, 'www is a 301', `got ${res.status}`);
  ok(res.headers.get('location') === `${ORIGIN}/nl/catalogue/?utm_source=t`,
    'www keeps the path and the query', res.headers.get('location') || '');
}

/* ---------------- report ---------------- */
console.log(`\n${pass} checks pass`);
if (fails.length) {
  console.log(`${fails.length} FAIL:`);
  for (const f of fails) console.log('  x ' + f);
  process.exit(1);
}
console.log('no indexing problems found');
