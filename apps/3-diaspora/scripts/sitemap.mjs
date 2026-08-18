/**
 * Schrijft public/sitemap.xml en public/robots.txt.
 *
 * Elke pagina bestaat in drie talen op drie eigen adressen. Die horen alle drie
 * in de sitemap, en bij elk adres hoort te staan welke andere twee dezelfde
 * pagina in een andere taal zijn. Dat laatste is de xhtml:link-regel: zonder
 * die regels ziet een zoekmachine drie losse pagina's die veel op elkaar lijken,
 * en kiest hij er zelf een uit om te tonen. Mét die regels weet hij dat het
 * dezelfde pagina is en toont hij aan een Nederlander de Nederlandse.
 *
 * De lijst komt uit site.config.mjs, dezelfde plek waar het adres van de site
 * staat. Een pagina erbij is daar één regel, en dan staat hij hier vanzelf in.
 */
import {writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {PADEN, SITE_URL, TALEN, padVoor} from '../site.config.mjs';

const HIER = path.dirname(fileURLToPath(import.meta.url));
const PUBLIEK = path.join(HIER, '..', 'public');

const adres = (taal, pad) => `${SITE_URL}${padVoor(taal, pad)}`;

const regels = [];
for (const {pad, gewicht} of PADEN) {
  for (const taal of TALEN) {
    /* De hreflang-regels zijn voor elk van de drie talen hetzelfde rijtje, en
       ze horen ook op de pagina zelf te staan: die zet src/App.tsx neer. */
    const alternatieven = [
      ...TALEN.map((x) => `    <xhtml:link rel="alternate" hreflang="${x}" href="${adres(x, pad)}" />`),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${adres('en', pad)}" />`,
    ].join('\n');

    regels.push(
      [
        '  <url>',
        `    <loc>${adres(taal, pad)}</loc>`,
        alternatieven,
        /* Engels staat op het kale adres en is de taal waarin de site geschreven
           is; de vertalingen wegen daaronder. */
        `    <priority>${(taal === 'en' ? gewicht : gewicht - 0.1).toFixed(1)}</priority>`,
        '  </url>',
      ].join('\n'),
    );
  }
}

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...regels,
  '</urlset>',
  '',
].join('\n');

const robots = [
  'User-agent: *',
  'Allow: /',
  '',
  `Sitemap: ${SITE_URL}/sitemap.xml`,
  '',
].join('\n');

writeFileSync(path.join(PUBLIEK, 'sitemap.xml'), sitemap);
writeFileSync(path.join(PUBLIEK, 'robots.txt'), robots);

console.log(`sitemap.xml: ${PADEN.length * TALEN.length} adressen`);
