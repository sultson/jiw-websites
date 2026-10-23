// Build gate: fails `pnpm build` (and so `pnpm ship`) when a page in dist/ is no
// longer whole in the HTML. A crawler or an AI assistant reads the file, not the
// browser, so everything checked here is checked on the file.
//
// Per indexable page: title, meta description, exactly one non-empty h1, <html lang>
// equal to the language of the path, canonical pointing at the page itself on
// rescuewatercraft.eu, a reciprocal hreflang set (nl, en, de, x-default) whose every
// target exists as a file, JSON-LD that parses, a word floor, no `noindex`, and no
// dead internal link. Then: the sitemap lists exactly the indexable pages, and every
// form posts to a route the Worker answers.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { defaultLang } from './default-lang.mjs';

const SITE = 'https://rescuewatercraft.eu';
const DIST = new URL('../dist/', import.meta.url).pathname;
const WORD_FLOOR = 120;
// Contact and the news feed are short by nature; the feed refreshes from LinkedIn in the browser.
const SHORT_PAGES = /\/(contact|kontakt|actueel|updates|aktuelles)$/;
const DEFAULT_LANG = defaultLang();
const FORM_ROUTES = new Set(['nl', 'en', 'de'].flatMap(l => ['course', 'equipment', 'contact'].map(k => `/api/forms/${l === 'nl' ? '' : `${l}/`}${k}`)));

const walk = dir => readdirSync(dir).flatMap(name => {
  const full = join(dir, name);
  return statSync(full).isDirectory() ? walk(full) : [full];
});
const toPath = file => {
  const rel = relative(DIST, file).replace(/\.html$/, '');
  return rel === 'index' ? '/' : `/${rel}`;
};
const toFile = path => {
  const clean = path.split(/[?#]/)[0].replace(/\/$/, '') || '/';
  if (clean === '/') return join(DIST, 'index.html');
  const direct = join(DIST, clean);
  if (/\.[a-z0-9]+$/i.test(clean)) return direct;
  return `${direct}.html`;
};
const exists = path => {
  const file = toFile(path);
  if (existsSync(file)) return true;
  // Worker-served paths are not files.
  return path.startsWith('/api/');
};
const langOf = path => ['nl', 'en', 'de'].find(l => path === `/${l}` || path.startsWith(`/${l}/`)) ?? DEFAULT_LANG;
const text = html => html
  .replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<template[\s\S]*?<\/template>/g, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
const attr = (html, re) => html.match(re)?.[1];

const errors = [];
const pages = walk(DIST).filter(f => f.endsWith('.html') && !f.endsWith('404.html'));
let forms = 0;

for (const file of pages) {
  const path = toPath(file);
  const html = readFileSync(file, 'utf8');
  const fail = msg => errors.push(`${path}: ${msg}`);
  const lang = langOf(path);

  if (attr(html, /<html[^>]*\blang="([^"]+)"/) !== lang) fail(`<html lang> is not "${lang}"`);
  const title = attr(html, /<title>([^<]*)<\/title>/);
  if (!title?.trim()) fail('no <title>');
  if (title && title.length > 75) fail(`title is ${title.length} chars: "${title}"`);
  const desc = attr(html, /<meta name="description" content="([^"]*)"/);
  if (!desc?.trim()) fail('no meta description');
  if (desc && desc.length > 170) fail(`description is ${desc.length} chars`);
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map(m => text(m[1]));
  if (h1s.length !== 1 || !h1s[0]) fail(`expected one filled <h1>, found ${h1s.length}`);
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) fail('carries noindex');

  const canonical = attr(html, /<link rel="canonical" href="([^"]+)"/);
  const expected = `${SITE}${path}`;
  if (canonical !== expected) fail(`canonical is ${canonical}, expected ${expected}`);

  const hreflangs = Object.fromEntries([...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map(m => [m[1], m[2]]));
  for (const l of ['nl', 'en', 'de', 'x-default']) {
    const href = hreflangs[l];
    if (!href) { fail(`no hreflang ${l}`); continue; }
    if (!href.startsWith(SITE)) { fail(`hreflang ${l} is off-site: ${href}`); continue; }
    const target = href.slice(SITE.length) || '/';
    if (!exists(target)) { fail(`hreflang ${l} points at a missing page: ${target}`); continue; }
    // Reciprocity: the target must point back at this page.
    if (l !== 'x-default') {
      const back = readFileSync(toFile(target), 'utf8').match(new RegExp(`hreflang="${lang}" href="([^"]+)"`))?.[1];
      if (back !== expected) fail(`hreflang ${l} target ${target} does not point back (says ${back})`);
    }
  }
  if (hreflangs[lang] !== expected) fail('hreflang for its own language is not itself');
  if (hreflangs['x-default'] !== hreflangs[DEFAULT_LANG]) fail(`x-default is not the ${DEFAULT_LANG} page`);

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(json); } catch { fail('JSON-LD does not parse'); }
  }
  if (!html.includes('application/ld+json')) fail('no JSON-LD');

  const words = text(html.replace(/<header class="site-header"[\s\S]*?<\/header>/, '').replace(/<footer[\s\S]*?<\/footer>/, '')).split(' ').length;
  if (words < (SHORT_PAGES.test(path) ? 50 : WORD_FLOOR)) fail(`only ${words} words of body text`);

  for (const [, href] of html.matchAll(/<a[^>]*\shref="(\/[^"]*)"/g)) {
    if (href.startsWith('//')) continue;
    if (!exists(href)) fail(`dead internal link ${href}`);
  }
  for (const [, action] of html.matchAll(/<form[^>]*\saction="([^"]+)"/g)) {
    forms++;
    if (!FORM_ROUTES.has(action)) fail(`form posts to ${action}, which the Worker does not answer`);
    const formLang = action.match(/^\/api\/forms\/(en|de)\//)?.[1] ?? 'nl';
    if (formLang !== lang) fail(`form posts to the ${formLang} endpoint from a ${lang} page`);
  }
}

const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
const listed = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].slice(SITE.length) || '/'));
const built = new Set(pages.map(toPath));
for (const p of built) if (!listed.has(p)) errors.push(`sitemap misses ${p}`);
for (const p of listed) if (!built.has(p)) errors.push(`sitemap lists ${p}, which is not a page`);
if (!readFileSync(join(DIST, 'robots.txt'), 'utf8').includes(`Sitemap: ${SITE}/sitemap.xml`)) errors.push('robots.txt does not point at the sitemap');
if (!existsSync(join(DIST, '404.html'))) errors.push('no 404.html');
// 3 languages x (courses + equipment + contact)
if (forms !== 9) errors.push(`expected 9 forms (3 per language), found ${forms}`);

if (errors.length) {
  console.error(`check-seo: ${errors.length} problem(s)\n${errors.map(e => `  - ${e}`).join('\n')}`);
  process.exit(1);
}
console.log(`check-seo (default ${DEFAULT_LANG} on /): ${pages.length} pages whole in the HTML, ${listed.size} in the sitemap, ${forms} forms wired.`);
