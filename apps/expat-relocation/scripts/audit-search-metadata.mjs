import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(appDir, 'dist');
const productionOrigin = 'https://www.expat-relocation.nl';

const criticalRoutes = new Set([
  '/',
  '/immigration/artist-visa-netherlands',
  '/nl/immigration/artist-visa-netherlands',
  '/immigration/athlete-visa-netherlands',
  '/nl/immigration/athlete-visa-netherlands',
  '/nl/immigration/highly-skilled-migrant-visa-netherlands',
  '/nl/starting-a-business/business-relocation-to-the-netherlands',
  '/nl/vip-services/family-relocation-immigration-services-netherlands',
  '/nl/industrial-expat-services/rotterdam-industrial-expat-services',
  '/nl/vip-services',
  '/nl/starting-a-business/relocation-services-for-entrepreneurs-netherlands',
  '/nl/about',
]);

function htmlFiles(directory, out = []) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) htmlFiles(path, out);
    else if (name === 'index.html') out.push(path);
  }
  return out;
}

function routeFor(file) {
  const route = `/${relative(distDir, dirname(file)).replaceAll('\\', '/')}`;
  return route === '/.' ? '/' : route;
}

function one(html, pattern, label, route) {
  const matches = [...html.matchAll(pattern)];
  assert.equal(matches.length, 1, `${route} must contain exactly one ${label}`);
  return matches[0][1];
}

function decodeHtml(value) {
  return value
    .replace(/&(?:amp|#38);/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

assert.ok(existsSync(distDir), 'dist is missing; run pnpm build before this audit');

const pages = htmlFiles(distDir).map((file) => {
  const route = routeFor(file);
  const html = readFileSync(file, 'utf8');
  const title = decodeHtml(one(html, /<title>(.*?)<\/title>/gs, 'title', route));
  const description = decodeHtml(one(html, /<meta name="description" content="([^"]*)"/g, 'meta description', route));
  const canonical = one(html, /<link rel="canonical" href="([^"]*)"/g, 'canonical', route);
  const lang = one(html, /<html lang="([^"]*)"/g, 'HTML language', route);
  const h1 = one(html, /<h1[^>]*>(.*?)<\/h1>/gs, 'H1', route).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const ogTitle = decodeHtml(one(html, /<meta property="og:title" content="([^"]*)"/g, 'og:title', route));
  const ogDescription = decodeHtml(one(html, /<meta property="og:description" content="([^"]*)"/g, 'og:description', route));

  assert.ok(title.trim(), `${route} has an empty title`);
  assert.ok(description.trim(), `${route} has an empty meta description`);
  assert.ok(h1, `${route} has an empty H1`);
  assert.equal(ogTitle, title, `${route} og:title differs from its title`);
  assert.equal(ogDescription, description, `${route} og:description differs from its meta description`);
  assert.equal(new URL(canonical).origin, productionOrigin, `${route} canonical uses a non-production origin`);
  assert.equal(new URL(canonical).pathname.replace(/\/$/, '') || '/', route, `${route} canonical path differs from the built route`);
  assert.doesNotMatch(title, /Expat & Immigration Services.*Expat & Immigration Services/, `${route} repeats the full brand in its title`);

  if (criticalRoutes.has(route)) {
    assert.ok(title.length <= 70, `${route} critical title is not concise (${title.length} characters)`);
    assert.ok(description.length >= 110 && description.length <= 165, `${route} critical description is outside the launch range (${description.length} characters)`);
  }

  return { route, title, description, canonical, lang };
});

for (const route of criticalRoutes) {
  assert.ok(pages.some((page) => page.route === route), `Critical search route was not built: ${route}`);
}

for (const field of ['title', 'description', 'canonical']) {
  const seen = new Map();
  for (const page of pages) {
    const key = field === 'canonical' ? page[field] : `${page.lang}\0${page[field]}`;
    const previous = seen.get(key);
    assert.ok(!previous, `Duplicate ${field}: ${previous} and ${page.route}`);
    seen.set(key, page.route);
  }
}

const home = readFileSync(join(distDir, 'index.html'), 'utf8');
assert.match(home, /"@type":"WebSite"/, 'Home page has no WebSite structured data');
assert.match(home, /"name":"E & I"/, 'WebSite structured data has the wrong preferred site name');
assert.match(home, /"alternateName":\["Expat & Immigration Services","expat-relocation.nl"\]/, 'WebSite structured data has no expected alternate names');

const robots = readFileSync(join(distDir, 'robots.txt'), 'utf8');
assert.match(robots, /Sitemap: https:\/\/www\.expat-relocation\.nl\/sitemap-index\.xml/, 'robots.txt points at the wrong sitemap');

console.log(`Search metadata audit passed: ${pages.length} index pages, ${criticalRoutes.size} migration-critical pages.`);
