import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const appDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const redirectsPath = join(appDir, 'public', '_redirects');
const distDir = join(appDir, 'dist');

const legacySitemapPaths = [
  '/',
  '/en',
  '/Adviesgesprek',
  '/en/Adviesgesprek',
  '/contact',
  '/en/contact',
  '/expat-pakketten',
  '/en/expat-pakketten',
  '/search',
  '/en/search',
  '/diensten',
  '/en/diensten',
  '/over-ons',
  '/en/over-ons',
  '/expat-pakketten-individueel',
  '/en/expat-pakketten-individueel',
  '/expat-pakketten-partner',
  '/en/expat-pakketten-partner',
  '/expat-pakketten-familie',
  '/en/expat-pakketten-familie',
  '/expat-pakketten-zakelijk',
  '/en/expat-pakketten-zakelijk',
  '/mvv-visum-verblijfsvergunning',
  '/en/mvv-visum-verblijfsvergunning',
  '/werkvisum-kennismigranten',
  '/en/werkvisum-kennismigranten',
  '/familiehereniging-gezinsmigratie',
  '/en/familiehereniging-gezinsmigratie',
  '/visum-topsporters',
  '/en/visum-topsporters',
  '/visum-artiesten',
  '/en/visum-artiesten',
  '/zakelijke-expat-begeleiding',
  '/en/zakelijke-expat-begeleiding',
  '/relocatie-werkgevers',
  '/en/relocatie-werkgevers',
  '/expat-services-rotterdam-havengebied',
  '/en/expat-services-rotterdam-havengebied',
];

const gscPaths = [
  '/en',
  '/visum-artiesten',
  '/',
  '/expat-pakketten',
  '/visum-topsporters',
  '/en/visum-artiesten',
  '/expat-services-rotterdam-havengebied',
  '/en/expat-pakketten-familie',
  '/relocatie-werkgevers',
  '/expat-pakketten-familie',
  '/over-ons',
  '/diensten',
  '/en/familiehereniging-gezinsmigratie',
  '/Adviesgesprek',
  '/expat-pakketten-partner',
  '/werkvisum-kennismigranten',
  '/zakelijke-expat-begeleiding',
  '/mvv-visum-verblijfsvergunning',
  '/expat-pakketten-zakelijk',
  '/en/expat-pakketten-individueel',
  '/en/Adviesgesprek',
  '/familiehereniging-gezinsmigratie',
  '/en/visum-topsporters',
  '/expat-pakketten-individueel',
  '/en/expat-pakketten',
  '/en/over-ons',
  '/en/zakelijke-expat-begeleiding',
];

const expectedTopTen = new Map([
  ['/en', '/'],
  ['/werkvisum-kennismigranten', '/nl/immigration/highly-skilled-migrant-visa-netherlands'],
  ['/relocatie-werkgevers', '/nl/starting-a-business/business-relocation-to-the-netherlands'],
  ['/en/visum-artiesten', '/immigration/artist-visa-netherlands'],
  ['/expat-pakketten-familie', '/nl/vip-services/family-relocation-immigration-services-netherlands'],
  ['/expat-services-rotterdam-havengebied', '/nl/industrial-expat-services/rotterdam-industrial-expat-services'],
  ['/expat-pakketten', '/nl/vip-services'],
  ['/zakelijke-expat-begeleiding', '/nl/starting-a-business/relocation-services-for-entrepreneurs-netherlands'],
  ['/over-ons', '/nl/about'],
]);

function parseRedirects(source) {
  const rules = new Map();
  for (const [index, rawLine] of source.split(/\r?\n/).entries()) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const [from, to, status, ...extra] = line.split(/\s+/);
    assert.equal(extra.length, 0, `Unexpected fields on _redirects line ${index + 1}`);
    assert.ok(from?.startsWith('/') && to?.startsWith('/'), `Only same-origin paths are allowed on line ${index + 1}`);
    assert.equal(status, '301', `Migration redirect must be 301 on line ${index + 1}`);
    assert.ok(!rules.has(from), `Duplicate redirect source: ${from}`);
    rules.set(from, { to, status: Number(status) });
  }
  return rules;
}

function builtHtmlPath(route) {
  return route === '/' ? join(distDir, 'index.html') : join(distDir, route.slice(1), 'index.html');
}

assert.ok(existsSync(redirectsPath), 'public/_redirects is missing');
assert.ok(existsSync(distDir), 'dist is missing; run pnpm build before this audit');

const rules = parseRedirects(readFileSync(redirectsPath, 'utf8'));
const intentionalKeeps = new Set(['/', '/contact']);

for (const path of legacySitemapPaths) {
  assert.ok(intentionalKeeps.has(path) || rules.has(path), `Legacy sitemap path is unmapped: ${path}`);
}
for (const path of gscPaths) {
  assert.ok(intentionalKeeps.has(path) || rules.has(path), `Search Console path is unmapped: ${path}`);
}
for (const [from, expectedTo] of expectedTopTen) {
  assert.equal(rules.get(from)?.to, expectedTo, `Top-ten destination changed for ${from}`);
}

for (const [from, { to }] of rules) {
  assert.ok(!rules.has(to), `Redirect chain found: ${from} -> ${to} -> ${rules.get(to)?.to}`);
  assert.ok(existsSync(builtHtmlPath(to)), `Redirect destination was not built: ${from} -> ${to}`);
}
for (const path of intentionalKeeps) {
  assert.ok(existsSync(builtHtmlPath(path)), `Intentionally retained route was not built: ${path}`);
}

const intentChecks = [
  ['/immigration/artist-visa-netherlands', ['artist visa', 'gvva', 'self-employed']],
  ['/nl/immigration/artist-visa-netherlands', ['artiestenvisum', 'gvva', 'zelfstandig']],
  ['/immigration/athlete-visa-netherlands', ['athlete visa', 'twv', 'gvva']],
  ['/nl/immigration/athlete-visa-netherlands', ['topsportersvisum', 'twv', 'gvva']],
];
for (const [route, terms] of intentChecks) {
  const html = readFileSync(builtHtmlPath(route), 'utf8').toLowerCase();
  for (const term of terms) {
    assert.ok(html.includes(term), `${route} does not preserve required search intent: ${term}`);
  }
  assert.match(html, /<link rel="canonical"[^>]+>/, `${route} has no canonical link`);
  assert.match(html, /hreflang="en"/, `${route} has no English hreflang`);
  assert.match(html, /hreflang="nl"/, `${route} has no Dutch hreflang`);
}

const baseUrl = process.env.MIGRATION_BASE_URL?.replace(/\/$/, '');
if (baseUrl) {
  for (const path of legacySitemapPaths) {
    const first = await fetch(`${baseUrl}${path}`, { redirect: 'manual' });
    if (intentionalKeeps.has(path)) {
      assert.equal(first.status, 200, `Retained route did not return 200: ${path}`);
      continue;
    }

    const expected = rules.get(path);
    assert.equal(first.status, 301, `Legacy route did not return an exact 301: ${path}`);
    const location = first.headers.get('location');
    assert.ok(location, `Legacy route has no Location header: ${path}`);
    const actualDestination = new URL(location, baseUrl);
    assert.equal(actualDestination.pathname, expected.to, `Live destination changed for ${path}`);

    const destination = await fetch(actualDestination, { redirect: 'manual' });
    assert.equal(
      destination.status,
      200,
      `Destination is not a direct 200: ${path} -> ${actualDestination.pathname} (${destination.status})`,
    );
  }
}

console.log(
  `Migration audit passed: ${legacySitemapPaths.length} sitemap URLs, ${gscPaths.length} GSC URLs, ${rules.size} one-hop 301 redirects${baseUrl ? ' verified over HTTP' : ''}.`,
);
