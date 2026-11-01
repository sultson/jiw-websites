/**
 * Schrijft sitemap.xml en robots.txt in dist/, uit de paginalijst — zodat een nieuwe
 * pagina zich op één plek aanmeldt (site.config.mjs) en niet half in de sitemap belandt.
 *
 *   node scripts/seo.mjs
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGINAS, SITE_URL } from '../site.config.mjs';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const indexeerbaar = PAGINAS.filter((p) => p.indexeerbaar);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexeerbaar
  .map(
    (p) => `  <url>
    <loc>${SITE_URL}${p.pad}</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
writeFileSync(path.join(DIST, 'robots.txt'), robots);

console.log(`seo: sitemap met ${indexeerbaar.length} pagina('s) + robots.txt geschreven.`);
