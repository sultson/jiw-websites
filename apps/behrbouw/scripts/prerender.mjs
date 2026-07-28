// Build-time prerender: bake the rendered App into dist/index.html so crawlers
// and first paint get complete HTML without executing JavaScript.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');

const { render } = await import(join(root, 'dist-ssr/entry-server.js'));

const template = readFileSync(join(distDir, 'index.html'), 'utf-8');
if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender: could not find <div id="root"></div> in dist/index.html');
}

const jsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: 'BEHR Bouw en Installatietechniek',
  url: 'https://behrbouw.jouwidealewebsite.nl/',
  telephone: '+31851249429',
  email: 'info@behrbouw.nl',
  foundingDate: '2019',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Spakenburglaan 5',
    postalCode: '8244 DW',
    addressLocality: 'Lelystad',
    addressCountry: 'NL',
  },
  areaServed: ['Amsterdam', 'Lelystad'],
  openingHours: 'Mo-Fr 08:00-16:00',
});

const html = template
  .replace('<div id="root"></div>', `<div id="root">${render()}</div>`)
  .replace('</head>', `<script type="application/ld+json">${jsonLd}</script></head>`);

writeFileSync(join(distDir, 'index.html'), html);
console.log('prerendered / -> dist/index.html');
