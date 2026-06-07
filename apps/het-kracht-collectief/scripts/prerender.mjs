// Build-time prerender: turn the client SPA shell into a complete static HTML
// file per route (real <head> AND <body>) so non-JS crawlers — search engines
// and AI bots alike — see the full page without executing JavaScript.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');

const { render, allRoutePaths, routeMetaFor } = await import(join(root, 'dist-ssr/entry-server.js'));

const template = readFileSync(join(distDir, 'index.html'), 'utf-8');

const escapeAttr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

function applyHead(html, meta) {
  let out = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${meta.title}</title>`)
    .replace(/<meta[^>]*name="description"[^>]*>/, `<meta name="description" content="${escapeAttr(meta.description)}">`)
    .replace(/<link[^>]*rel="canonical"[^>]*>/, `<link rel="canonical" href="${escapeAttr(meta.canonical)}">`)
    .replace(/<meta[^>]*property="og:title"[^>]*>/, `<meta property="og:title" content="${escapeAttr(meta.title)}">`)
    .replace(
      /<meta[^>]*property="og:description"[^>]*>/,
      `<meta property="og:description" content="${escapeAttr(meta.description)}">`,
    )
    .replace(/<meta[^>]*property="og:url"[^>]*>/, `<meta property="og:url" content="${escapeAttr(meta.canonical)}">`);

  if (meta.jsonLd && meta.jsonLd.length) {
    const blocks = meta.jsonLd.map((json) => `<script type="application/ld+json">${json}</script>`).join('');
    out = out.replace('</head>', `${blocks}</head>`);
  }
  return out;
}

if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender: could not find <div id="root"></div> in dist/index.html');
}

for (const path of allRoutePaths) {
  const meta = routeMetaFor(path);
  const body = render(path);
  const html = applyHead(template.replace('<div id="root"></div>', `<div id="root">${body}</div>`), meta);
  const outPath = path === '/' ? join(distDir, 'index.html') : join(distDir, path.replace(/^\//, ''), 'index.html');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  console.log(`prerendered ${path} -> ${outPath.replace(`${root}/`, '')}`);
}

console.log(`\nPrerendered ${allRoutePaths.length} routes.`);
