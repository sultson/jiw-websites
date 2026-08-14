// Build-time prerender: turn the client SPA shell into a complete static HTML
// file per route (real <head> AND <body>) so non-JS crawlers — search engines
// and AI bots alike — see the full page without executing JavaScript. Same step
// rn-schilders runs, extended for the three languages: every route exists once
// per language at its own URL, and each of those announces the other two with
// hreflang. The route list comes from allRoutePaths in src/App.tsx.
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');

const { render, allRoutePaths, routeMetaFor, SITE_URL, EMAIL_LOGO_PATH } = await import(join(root, 'dist-ssr/entry-server.js'));

const template = readFileSync(join(distDir, 'index.html'), 'utf-8');

const escapeAttr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

function applyHead(html, meta) {
  const alternates = meta.alternates
    .map((alt) => `<link rel="alternate" hreflang="${alt.hreflang}" href="${escapeAttr(alt.href)}">`)
    .join('\n    ');
  const jsonLd = meta.jsonLd.map((json) => `<script type="application/ld+json">${json}</script>`).join('');

  return html
    .replace(/<html lang="[^"]*">/, `<html lang="${meta.htmlLang}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${meta.title}</title>`)
    .replace(/<meta[^>]*name="description"[^>]*>/, `<meta name="description" content="${escapeAttr(meta.description)}">`)
    .replace(/<link[^>]*rel="canonical"[^>]*>/, `<link rel="canonical" href="${escapeAttr(meta.canonical)}">`)
    .replace(/<meta[^>]*property="og:title"[^>]*>/, `<meta property="og:title" content="${escapeAttr(meta.title)}">`)
    .replace(
      /<meta[^>]*property="og:description"[^>]*>/,
      `<meta property="og:description" content="${escapeAttr(meta.description)}">`,
    )
    .replace(/<meta[^>]*property="og:url"[^>]*>/, `<meta property="og:url" content="${escapeAttr(meta.canonical)}">`)
    .replace(/<meta[^>]*property="og:image"[^>]*>/, `<meta property="og:image" content="${escapeAttr(meta.ogImage)}">`)
    .replace(/<meta[^>]*property="og:locale"[^>]*>/, `<meta property="og:locale" content="${meta.ogLocale}">`)
    .replace('</head>', `${alternates}\n    ${jsonLd}</head>`);
}

if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender: could not find <div id="root"></div> in dist/index.html');
}

function writePage(path, html) {
  const outPath = path === '/' ? join(distDir, 'index.html') : join(distDir, path.replace(/^\//, ''), 'index.html');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  return outPath;
}

/* Every /img/... the prerendered pages point at, so a renamed or re-encoded
   photo fails the build instead of shipping as a broken image. */
const referencedImages = new Set();
function collectImages(html) {
  for (const [, url] of html.matchAll(/(?:src|srcset)="([^"]+)"/g)) {
    for (const candidate of url.split(',')) {
      const file = candidate.trim().split(' ')[0];
      if (file.startsWith('/img/')) referencedImages.add(file);
    }
  }
}

for (const path of allRoutePaths) {
  const meta = routeMetaFor(path);
  const body = render(path);
  const html = applyHead(template.replace('<div id="root"></div>', `<div id="root">${body}</div>`), meta);
  collectImages(html);
  console.log(`prerendered ${path} -> ${writePage(path, html).replace(`${root}/`, '')}`);
}

/* The confirmation e-mail's logo is loaded by a mail client, not by a page, so
   nothing else in this build would notice it going missing — which is exactly
   how it broke once, when the image pipeline turned logo.png into logo.webp. */
referencedImages.add(EMAIL_LOGO_PATH);

const missingImages = [...referencedImages].filter((file) => !existsSync(join(distDir, file)));
if (missingImages.length) {
  throw new Error(`prerender: ${missingImages.length} referenced image(s) are not in dist:\n  ${missingImages.join('\n  ')}`);
}
console.log(`\nChecked ${referencedImages.size} image references, all present.`);

/* The 404 body Cloudflare serves for anything that is not a route (see
   not_found_handling in wrangler.jsonc). One file, so it is the default
   language, and it must never be indexed or offered as an alternate. */
const notFoundHtml = applyHead(
  template.replace('<div id="root"></div>', `<div id="root">${render('/__not-found__')}</div>`),
  routeMetaFor('/__not-found__'),
).replace(/<meta[^>]*name="robots"[^>]*>/, '<meta name="robots" content="noindex, follow">');
writeFileSync(join(distDir, '404.html'), notFoundHtml);
console.log('prerendered 404 -> dist/404.html');

// Every language version of every page, each carrying its alternates, so the
// three versions are understood as translations instead of duplicates.
const lastmod = new Date().toISOString().slice(0, 10);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...allRoutePaths.map((path) => {
    const meta = routeMetaFor(path);
    return [
      '  <url>',
      `    <loc>${meta.canonical}</loc>`,
      ...meta.alternates.map(
        (alt) => `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}"/>`,
      ),
      `    <lastmod>${lastmod}</lastmod>`,
      `    <priority>${path === '/' ? '1.0' : '0.8'}</priority>`,
      '  </url>',
    ].join('\n');
  }),
  '</urlset>',
  '',
].join('\n');
writeFileSync(join(distDir, 'sitemap.xml'), sitemap);

// Generated rather than kept in public/, so the hostname only lives in src/site.ts.
writeFileSync(join(distDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

console.log(`\nPrerendered ${allRoutePaths.length} routes + 404, wrote sitemap.xml and robots.txt.`);
