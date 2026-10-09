// Builds dist/. Run: node src/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { company, varieties, faqs, markets } from './data.mjs';
import { header, footer, basket, stickyCta, esc, mark, setLogo } from './ui.mjs';
import * as P from './pages.mjs';
import { sheet, SHEET_CSS } from './sheet.mjs';
import { LANGS, translateHtml, localise, runtimeStrings, t } from './i18n.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const IMGSRC = path.join(ROOT, 'assets', 'img');
const ORIGIN = `https://${company.domain}`;

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'i'), { recursive: true });
fs.mkdirSync(path.join(DIST, 'f'), { recursive: true });

const hash = buf => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 8);

/* ---------------- fonts ---------------- */
for (const f of fs.readdirSync(path.join(ROOT, 'assets', 'fonts'))) {
  fs.copyFileSync(path.join(ROOT, 'assets', 'fonts', f), path.join(DIST, 'f', f));
}

/* ---------------- images ---------------- */
const WIDTHS = [420, 660, 900, 1300, 1900];
const manifest = new Map();

async function prepare(key) {
  if (manifest.has(key)) return manifest.get(key);
  const src = path.join(IMGSRC, `${key}.png`);
  if (!fs.existsSync(src)) throw new Error(`missing image: ${key}.png`);
  const meta = await sharp(src).metadata();
  const set = [];
  for (const w of WIDTHS) {
    if (w > meta.width * 1.05) continue;
    const buf = await sharp(src).resize({ width: w }).webp({ quality: 78, effort: 5 }).toBuffer();
    const name = `${key}-${w}.webp`;
    fs.writeFileSync(path.join(DIST, 'i', name), buf);
    set.push({ w, name });
  }
  // jpg fallback at a mid width
  const fw = Math.min(1300, meta.width);
  const jbuf = await sharp(src).resize({ width: fw }).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  const jname = `${key}-${fw}.jpg`;
  fs.writeFileSync(path.join(DIST, 'i', jname), jbuf);
  const rec = { set, jpg: jname, jw: fw, w: meta.width, h: meta.height };
  manifest.set(key, rec);
  return rec;
}

/**
 * <picture> with webp srcset + jpg fallback.
 * opts: {ratio:'4/5', eager:true, plain:true, sizes:'...'}
 */
function makeImg(key, alt, displayW = 900, opts = {}) {
  const rec = manifest.get(key);
  if (!rec) throw new Error(`image not prepared: ${key}`);
  const srcset = rec.set.map(s => `/i/${s.name} ${s.w}w`).join(', ');
  const sizes = opts.sizes || (opts.plain ? '100vw' : `(max-width:900px) 100vw, ${displayW}px`);
  // intrinsic size keeps layout stable; ratio overrides via CSS aspect-ratio on the parent
  let w = rec.w, h = rec.h;
  if (opts.ratio) {
    const [rw, rh] = opts.ratio.split('/').map(Number);
    w = 1000; h = Math.round(1000 * rh / rw);
  }
  const loading = opts.eager ? 'eager" fetchpriority="high' : 'lazy';
  const style = opts.ratio ? ` style="aspect-ratio:${opts.ratio};object-fit:cover;width:100%;height:100%"` : '';
  // Art direction, not just resizing: a 3:2 landscape poured into a portrait phone frame
  // shows its whole vertical span, so object-position cannot pull the field up out of the
  // sky. mobileKey swaps in a separately cropped portrait file below the breakpoint.
  let alt2 = '';
  if (opts.mobileKey) {
    const m = manifest.get(opts.mobileKey);
    if (!m) throw new Error(`image not prepared: ${opts.mobileKey}`);
    // The hero stacks at 760, the split sections at 880 - so the swap point is per-call,
    // otherwise a 800px-wide window gets the stacked band with the unstacked crop in it.
    alt2 = `<source type="image/webp" media="(max-width:${opts.mobileAt || 760}px)" ` +
      `srcset="${m.set.map(s => `/i/${s.name} ${s.w}w`).join(', ')}" sizes="100vw">`;
  }
  return `<picture>${alt2}<source type="image/webp" srcset="${srcset}" sizes="${sizes}">` +
    `<img src="/i/${rec.jpg}" alt="${esc(alt)}" width="${w}" height="${h}" ` +
    `loading="${loading}" decoding="async"${style}></picture>`;
}

/* ---------------- video ----------------
   One clip, from the client, served straight: hashed like the images because /v/ is
   immutable for a year, preload="none" so the home page still ships as three pictures
   until someone presses play, and a poster taken from the still they shot at the same
   bench. No autoplay: it has sound and it is evidence, not wallpaper. */
const VIDSRC = path.join(ROOT, 'assets', 'video');
const videos = new Map();
function prepareVideo(key) {
  if (videos.has(key)) return videos.get(key);
  const src = path.join(VIDSRC, `${key}.mp4`);
  if (!fs.existsSync(src)) throw new Error(`missing video: ${key}.mp4`);
  const buf = fs.readFileSync(src);
  const name = `${key}-${hash(buf)}.mp4`;
  fs.mkdirSync(path.join(DIST, 'v'), { recursive: true });
  fs.writeFileSync(path.join(DIST, 'v', name), buf);
  const rec = { path: `/v/${name}` };
  videos.set(key, rec);
  return rec;
}

function makeVideo(key, posterKey, alt) {
  const v = videos.get(key);
  if (!v) throw new Error(`video not prepared: ${key}`);
  const poster = manifest.get(posterKey);
  if (!poster) throw new Error(`poster not prepared: ${posterKey}`);
  // `controls` is in the markup and app.js takes it away: with no JS the browser's own
  // controls are the only way to start this, so they have to be the default state.
  return `<video controls preload="none" playsinline poster="/i/${poster.jpg}" ` +
    `aria-label="${esc(alt)}"><source src="${v.path}" type="video/mp4">` +
    `<p>${esc(alt)}</p></video>` +
    `<button class="vplay" type="button" hidden aria-label="Play the video">` +
    `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">` +
    `<path d="M8 5.2v13.6a.6.6 0 0 0 .92.5l10.7-6.8a.6.6 0 0 0 0-1l-10.7-6.8a.6.6 0 0 0-.92.5Z"/>` +
    `</svg></button>`;
}

/* ---------------- brand lockup ----------------
   The client's logo, not a rebuilt version of it. Kept as alpha WebP so it drops onto
   the paper header and the ink footer without a plate behind it; hashed, because /i/
   is served immutable for a year and a logo change has to be able to reach a browser
   that already cached the old one. */
async function logo(key) {
  const src = path.join(IMGSRC, `${key}.png`);
  const meta = await sharp(src).metadata();
  // 3x the largest place it is drawn (the footer at ~150px wide), so it stays crisp
  // on a retina screen without shipping the full 1500px original.
  const buf = await sharp(src).resize({ width: 460 }).webp({ quality: 88, effort: 6 }).toBuffer();
  const name = `${key}-${hash(buf)}.webp`;
  fs.writeFileSync(path.join(DIST, 'i', name), buf);
  return { path: `/i/${name}`, w: meta.width, h: meta.height };
}
const [logoLight, logoDark] = [await logo('logo-light'), await logo('logo-dark')];
// One intrinsic ratio for both: they are the same artwork, and CSS sizes on height.
setLogo({ light: logoLight.path, dark: logoDark.path, w: logoLight.w, h: logoLight.h });

/* ---------------- assets with hashed names ---------------- */
const cssRaw = fs.readFileSync(path.join(SRC, 'styles.css'), 'utf8');
const css = cssRaw + '\n.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;' +
  'overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}\n';
const cssName = `s.${hash(css)}.css`;
fs.writeFileSync(path.join(DIST, cssName), css);

// The print sheet gets its own stylesheet: it shares only the @font-face block,
// not the screen layout, so a change to one cannot quietly reflow the other.
const faces = cssRaw.slice(0, cssRaw.indexOf(':root'));
const sheetCss = faces + SHEET_CSS +
  '\n.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}\n';
const sheetCssName = `sheet.${hash(sheetCss)}.css`;
fs.writeFileSync(path.join(DIST, sheetCssName), sheetCss);

const js = fs.readFileSync(path.join(SRC, 'app.js'), 'utf8');
const jsName = `a.${hash(js)}.js`;
fs.writeFileSync(path.join(DIST, jsName), js);

/* ---------------- favicon ---------------- */
// A bare outline vanishes in a 16px browser tab, so the favicon is the mark
// reversed out of a filled green seal: one high-contrast shape at any size.
const markSvg = fs.readFileSync(path.join(SRC, 'brand', 'mark.svg'), 'utf8');
const markBody = markSvg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();
fs.writeFileSync(path.join(DIST, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#FAF8F3">` +
  `<rect width="64" height="64" rx="13" fill="#1B3128"/>` +
  `<g transform="translate(32 32) scale(.8) translate(-32 -32)">${markBody}</g></svg>`);

/* ---------------- structured data ---------------- */
// Built per language rather than translated afterwards: the JSON sits inside a
// <script>, which the HTML pass deliberately leaves alone.
const misses = {};
function jsonLd(page, lang) {
  const tr = s => t(s, lang, misses);
  const org = {
    '@type': 'Organization', '@id': `${ORIGIN}/#org`, name: company.name,
    url: ORIGIN, email: company.email, telephone: company.phone,
    description: tr('Grower and exporter of Kenyan summer flowers, foliage and roses to Europe.'),
    address: {
      '@type': 'PostalAddress', streetAddress: company.addressStreet,
      postOfficeBoxNumber: company.addressPoBox,
      addressLocality: 'Nairobi', addressCountry: 'KE',
    },
    areaServed: markets.map(m => ({ '@type': 'Country', name: m })),
    logo: `${ORIGIN}/favicon.svg`,
  };
  const graph = [org, {
    '@type': 'WebSite', '@id': `${ORIGIN}/#site`, url: ORIGIN, name: company.name,
    publisher: { '@id': `${ORIGIN}/#org` }, inLanguage: lang,
  }];
  if (page.path === '/') {
    graph.push({
      '@type': 'ItemList', name: 'Flower catalogue',
      itemListElement: varieties.map((v, i) => ({
        '@type': 'ListItem', position: i + 1, name: v.name,
        item: { '@type': 'Product', name: v.name, category: tr(v.group),
          description: tr(v.blurb), brand: { '@id': `${ORIGIN}/#org` } },
      })),
    });
  }
  if (page.path === '/' || page.path === '/shipping/') {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: (page.path === '/' ? faqs.slice(0, 6) : faqs).map(f => ({
        '@type': 'Question', name: tr(f.q),
        acceptedAnswer: { '@type': 'Answer', text: tr(f.a) },
      })),
    });
  }
  if (page.path !== '/' && !page.noindex) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: tr('Home'), item: ORIGIN + localise('/', lang) },
        { '@type': 'ListItem', position: 2, name: tr(CRUMB[page.path] || page.title.split('|')[0].trim()),
          item: ORIGIN + localise(page.path, lang) },
      ],
    });
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

/* ---------------- layout ---------------- */
const CRUMB = { '/catalogue/': 'Catalogue', '/shipping/': 'Shipping',
  '/about/': 'About', '/contact/': 'Contact' };

function layout(page, lang) {
  const canonical = ORIGIN + localise(page.path === '/404.html' ? '/404.html' : page.path, lang);
  const ogImg = `${ORIGIN}/i/${manifest.get('hero-field').jpg}`;
  // Every language points at every other one, so Google treats them as one site in
  // four versions rather than four thin copies of the same page.
  const alts = page.noindex ? '' : LANGS.map(l =>
    `<link rel="alternate" hreflang="${l.code}" href="${ORIGIN}${localise(page.path, l.code)}">`).join('\n') +
    `\n<link rel="alternate" hreflang="x-default" href="${ORIGIN}${page.path}">`;
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.desc)}">
${page.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
${alts}
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImg}">
<meta property="og:site_name" content="${esc(company.name)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#1B3128">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/f/instrumentserif-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/f/satoshi-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/${cssName}">
<script type="application/ld+json">${jsonLd(page, lang)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${header(page.path, lang)}
<main id="main">${page.body}</main>
${footer(lang)}
${page.path === '/catalogue/' ? basket() : ''}
${page.noindex || page.path === '/contact/' ? '' : stickyCta()}
<script>window.__T=${JSON.stringify(runtimeStrings(lang, misses))}</script>
<script src="/${jsName}" defer></script>
</body>
</html>`;
}

/* ---------------- build ---------------- */
const KEYS = ['hero-field', 'hero-field-tall', 'hero-bunch', 'greenhouse', 'packhouse', 'coldchain', 'cargo', 'harvest', 'qc',
  'field-rows', 'bunch-real', 'highlands', 'highlands-wide',
  ...new Set(varieties.flatMap(v => [v.img, v.img2].filter(Boolean)))];

for (const k of KEYS) await prepare(k);
prepareVideo('packhouse');
P.setImg(makeImg);
P.setVideo(makeVideo);

const pages = [P.home(makeImg), P.catalogue(makeImg), P.shipping(makeImg), P.about(makeImg),
  P.contact(makeImg), P.notFound()];

const sheetEn = sheet(makeImg).replace('/SHEETCSS', `/${sheetCssName}`);

for (const { code } of LANGS) {
  for (const page of pages) {
    let html = layout(page, code);
    if (page.path === '/contact/') {
      // data-wa is for the WhatsApp button, which still composes a message in the
      // visitor's own app. data-endpoint is where the primary button posts; it is an
      // attribute rather than a constant in app.js so the same script works against
      // a local `wrangler dev` without a rebuild.
      html = html.replace('<form class="form" id="quoteForm"',
        `<form class="form" id="quoteForm" data-endpoint="/api/forms/enquiry" data-wa="${company.whatsapp}"`);
    }
    html = translateHtml(html, code, misses);
    const rel = page.path === '/404.html' ? '404.html'
      : (page.path === '/' ? 'index.html' : page.path.replace(/^\/|\/$/g, '') + '/index.html');
    const out = path.join(DIST, code === 'en' ? '' : code, rel);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
  }
  // Print sheet: same source, same translation pass, so the PDF cannot drift from the site.
  const sd = path.join(DIST, code === 'en' ? '' : code, 'catalogue-sheet');
  fs.mkdirSync(sd, { recursive: true });
  fs.writeFileSync(path.join(sd, 'index.html'), translateHtml(sheetEn, code, misses));
}

/* ---------------- sitemap + robots ---------------- */
const indexed = pages.filter(p => !p.noindex);
const urls = LANGS.flatMap(({ code }) => indexed.map(p => {
  const links = LANGS.map(l =>
    `    <xhtml:link rel="alternate" hreflang="${l.code}" href="${ORIGIN}${localise(p.path, l.code)}"/>`).join('\n');
  return `  <url><loc>${ORIGIN}${localise(p.path, code)}</loc>\n${links}\n` +
    `    <changefreq>monthly</changefreq><priority>${p.path === '/' ? '1.0' : '0.8'}</priority></url>`;
})).join('\n');
fs.writeFileSync(path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ` +
  `xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`);
fs.writeFileSync(path.join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);

/* ---------------- headers ---------------- */
fs.writeFileSync(path.join(DIST, '_headers'),
  `/i/*\n  Cache-Control: public, max-age=31536000, immutable\n` +
  `/f/*\n  Cache-Control: public, max-age=31536000, immutable\n` +
  `/v/*\n  Cache-Control: public, max-age=31536000, immutable\n` +
  `/*.css\n  Cache-Control: public, max-age=31536000, immutable\n` +
  `/*.js\n  Cache-Control: public, max-age=31536000, immutable\n` +
  `/*\n  Cache-Control: public, max-age=0, must-revalidate\n` +
  `  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n`);

/* ---------------- translation coverage ---------------- */
// Printed, not assumed. If a string has no entry the page still renders in English,
// so a gap is a quality problem rather than a broken build - it has to be visible.
const gaps = Object.entries(misses).filter(([, s]) => s.size);
if (gaps.length) {
  if (process.env.DUMP_KEYS) {
    const all = new Set();
    for (const [, s] of gaps) for (const k of s) all.add(k);
    fs.writeFileSync(path.join(ROOT, 'tools', 'keys.txt'), [...all].join('\n') + '\n');
    console.log(`dumped ${all.size} untranslated keys to tools/keys.txt`);
  }
  for (const [lang, s] of gaps) console.log(`  ${lang}: ${s.size} strings untranslated`);
} else {
  console.log('  translations: complete for ' + LANGS.slice(1).map(l => l.code).join(', '));
}

const size = d => fs.readdirSync(d, { withFileTypes: true }).reduce((n, e) =>
  n + (e.isDirectory() ? size(path.join(d, e.name)) : fs.statSync(path.join(d, e.name)).size), 0);
console.log(`built ${pages.length * LANGS.length} pages in ${LANGS.length} languages, ` +
  `${manifest.size} images, ${(size(DIST) / 1048576).toFixed(1)} MB`);
