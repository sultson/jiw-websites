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

  if (meta.jsonLd.length) {
    const blocks = meta.jsonLd.map((json) => `<script type="application/ld+json">${json}</script>`).join('');
    out = out.replace('</head>', `${blocks}</head>`);
  }
  return out;
}

function deferCampaignTracking(html) {
  const deferredGoogleTag = `<script>
      window.addEventListener('load', function () {
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-18294027643';
        document.head.appendChild(script);
      }, { once: true });
    </script>`;
  const deferredClarity = `<!-- Microsoft Clarity -->
    <script type="text/javascript">
      window.addEventListener('load', function () {
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "xlin4iqzro");
      }, { once: true });
    </script>
    <!-- End Microsoft Clarity -->`;

  return html
    .replace(
      '<script async src="https://www.googletagmanager.com/gtag/js?id=AW-18294027643"></script>',
      deferredGoogleTag,
    )
    .replace(/<!-- Microsoft Clarity -->[\s\S]*?<!-- End Microsoft Clarity -->/, deferredClarity)
    // Campaign submissions are protected by the server-side honeypot and rate
    // limit, so this route never renders a Turnstile widget.
    .replace(/\s*<script src="https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/api\.js\?render=explicit" async defer><\/script>/, '');
}

if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender: could not find <div id="root"></div> in dist/index.html');
}

for (const path of allRoutePaths) {
  const meta = routeMetaFor(path);
  const body = render(path);
  let html = applyHead(template.replace('<div id="root"></div>', `<div id="root">${body}</div>`), meta);
  const homepageHeroPreload = /<link[^>]*rel="preload"[^>]*rn-schilders-main\.webp[^>]*>/;
  if (path === '/buitenschilderwerk-aanvraag') {
    html = html.replace(
      homepageHeroPreload,
      '<link rel="preload" as="image" href="/campaign-hero-buitenschilderwerk-mobile.webp?v=20260714" type="image/webp" fetchpriority="high" />\n    <link rel="preload" as="image" href="/campaign-hero-buitenschilderwerk.webp?v=20260714" type="image/webp" media="(min-width: 768px)" fetchpriority="high" />',
    );
    html = deferCampaignTracking(html);
  } else if (path !== '/') {
    // The homepage hero preload only helps the homepage; drop it elsewhere so
    // subpages don't warn about a preloaded-but-unused image.
    html = html.replace(homepageHeroPreload, '');
  }
  const outPath = path === '/' ? join(distDir, 'index.html') : join(distDir, path.replace(/^\//, ''), 'index.html');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  console.log(`prerendered ${path} -> ${outPath.replace(`${root}/`, '')}`);
}

console.log(`\nPrerendered ${allRoutePaths.length} routes.`);
