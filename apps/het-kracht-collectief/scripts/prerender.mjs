// Build-time prerender: turn the client SPA shell into a complete static HTML
// file per route (real <head> AND <body>) so non-JS crawlers — search engines
// and AI bots alike — see the full page without executing JavaScript.
//
// Every page exists once per language (Dutch on /, English on /en), each with
// its own canonical, the full hreflang set and <html lang>. Also writes the
// 404 page, sitemap.xml and robots.txt, then FAILS the build if any page is
// not whole in the HTML. A gate you can skip is not a gate.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');

const { render, allRoutePaths, routeMetaFor, SITE_URL } = await import(
  pathToFileURL(join(root, 'dist-ssr/entry-server.js')).href
);

const template = readFileSync(join(distDir, 'index.html'), 'utf-8');

const escapeAttr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const escapeText = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function applyHead(html, meta) {
  let out = html
    .replace(/<html lang="[^"]*">/, `<html lang="${meta.lang}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeText(meta.title)}</title>`)
    .replace(/<meta[^>]*name="description"[^>]*>/, `<meta name="description" content="${escapeAttr(meta.description)}">`)
    .replace(/<meta[^>]*property="og:title"[^>]*>/, `<meta property="og:title" content="${escapeAttr(meta.title)}">`)
    .replace(
      /<meta[^>]*property="og:description"[^>]*>/,
      `<meta property="og:description" content="${escapeAttr(meta.description)}">`,
    )
    .replace(/<meta[^>]*property="og:locale"[^>]*>/, `<meta property="og:locale" content="${meta.ogLocale}">`)
    .replace(
      /<meta[^>]*property="og:locale:alternate"[^>]*>/,
      `<meta property="og:locale:alternate" content="${meta.ogLocaleAlternate}">`,
    );

  // The skyline photo only appears in the home hero; elsewhere the preload is wasted bandwidth.
  if (meta.page !== 'home') out = out.replace(/\s*<link[^>]*rel="preload"[^>]*>/, '');

  if (meta.canonical) {
    const alternates = Object.entries(meta.alternates)
      .map(([hreflang, href]) => `<link rel="alternate" hreflang="${hreflang}" href="${escapeAttr(href)}">`)
      .join('');
    out = out
      .replace(/<link[^>]*rel="canonical"[^>]*>/, `<link rel="canonical" href="${escapeAttr(meta.canonical)}">${alternates}`)
      .replace(/<meta[^>]*property="og:url"[^>]*>/, `<meta property="og:url" content="${escapeAttr(meta.canonical)}">`);
  } else {
    // The 404 must not name any page as its canonical, or that is what gets indexed.
    out = out
      .replace(/\s*<link[^>]*rel="canonical"[^>]*>/, '')
      .replace(/\s*<meta[^>]*property="og:url"[^>]*>/, '')
      .replace(/\s*<link[^>]*rel="preload"[^>]*>/, '')
      .replace('</title>', '</title><meta name="robots" content="noindex, follow">');
  }

  if (meta.jsonLd && meta.jsonLd.length) {
    const blocks = meta.jsonLd
      .map((json) => `<script type="application/ld+json">${json.replace(/</g, '\\u003c')}</script>`)
      .join('');
    out = out.replace('</head>', `${blocks}</head>`);
  }
  return out;
}

if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender: could not find <div id="root"></div> in dist/index.html');
}

const renderPage = (path) =>
  applyHead(template.replace('<div id="root"></div>', `<div id="root">${render(path)}</div>`), routeMetaFor(path));

const outFile = (path) => (path === '/' ? join(distDir, 'index.html') : join(distDir, path.replace(/^\//, ''), 'index.html'));

const pages = new Map();
for (const path of allRoutePaths) {
  const html = renderPage(path);
  pages.set(path, html);
  const outPath = outFile(path);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  console.log(`prerendered ${path} -> ${outPath.replace(`${root}/`, '')}`);
}

// Workers Static Assets serves this with status 404 for any unknown path
// (`not_found_handling: "404-page"`). Rendered on a path no route matches.
const notFoundHtml = renderPage('/__404__');
writeFileSync(join(distDir, '404.html'), notFoundHtml);
console.log('prerendered 404 -> dist/404.html');

const lastmod = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allRoutePaths
  .map((path) => {
    const meta = routeMetaFor(path);
    const links = Object.entries(meta.alternates)
      .map(([hreflang, href]) => `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}"/>`)
      .join('\n');
    return `  <url>\n    <loc>${meta.canonical}</loc>\n    <lastmod>${lastmod}</lastmod>\n${links}\n  </url>`;
  })
  .join('\n')}
</urlset>
`;
writeFileSync(join(distDir, 'sitemap.xml'), sitemap);
writeFileSync(join(distDir, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log('wrote dist/sitemap.xml + dist/robots.txt');

// ── Gate ─────────────────────────────────────────────────────────────────────
const WORD_FLOOR = 180;
const errors = [];
const fail = (path, msg) => errors.push(`${path}: ${msg}`);
const known = new Set(allRoutePaths);
const textOf = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);
const titles = new Set();

for (const [path, html] of pages) {
  const meta = routeMetaFor(path);
  const body = html.slice(html.indexOf('<div id="root">'));
  const words = textOf(body).length;
  if (words < WORD_FLOOR) fail(path, `only ${words} words in the HTML (floor ${WORD_FLOOR})`);

  const h1s = [...body.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];
  if (h1s.length !== 1) fail(path, `${h1s.length} <h1> elements, expected exactly 1`);
  else if (!textOf(h1s[0][1]).length) fail(path, 'empty <h1>');

  if (!html.includes(`<html lang="${meta.lang}">`)) fail(path, `<html lang> is not "${meta.lang}"`);
  const canon = html.match(/<link rel="canonical" href="([^"]+)">/g) ?? [];
  if (canon.length !== 1 || !canon[0].includes(`"${SITE_URL}${path}"`)) fail(path, `canonical is not ${SITE_URL}${path}`);
  if (html.includes('jouwidealewebsite.nl')) fail(path, 'still mentions the old jouwidealewebsite.nl host');
  for (const hl of ['nl', 'en', 'x-default']) {
    if (!html.includes(`hreflang="${hl}"`)) fail(path, `missing hreflang="${hl}"`);
  }
  if (/name="robots"[^>]*noindex/.test(html)) fail(path, 'carries noindex');

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  if (!title) fail(path, 'empty <title>');
  if (titles.has(title)) fail(path, `duplicate <title> "${title}"`);
  titles.add(title);

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(json);
    } catch (e) {
      fail(path, `JSON-LD does not parse: ${e.message}`);
    }
  }

  for (const [, href] of body.matchAll(/<a[^>]*href="(\/[^"#?]*)/g)) {
    if (!known.has(href)) fail(path, `internal link to ${href}, which is not a page`);
  }
}

if (!/name="robots" content="noindex/.test(notFoundHtml) || /rel="canonical"/.test(notFoundHtml)) {
  fail('/404', 'must be noindex and carry no canonical');
}
const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort();
const expected = allRoutePaths.map((p) => `${SITE_URL}${p}`).sort();
if (JSON.stringify(sitemapLocs) !== JSON.stringify(expected)) fail('sitemap.xml', 'does not list exactly the pages');
for (const path of allRoutePaths) if (!existsSync(outFile(path))) fail(path, 'no file written');

if (errors.length) {
  console.error(`\nPrerender gate FAILED:\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(`\nPrerendered ${allRoutePaths.length} pages + 404; gate passed.`);
