/* Schrijft dist/sitemap.xml en dist/robots.txt.
   Draaien:  node maak-sitemap.mjs  (zit in `pnpm build`)

   Waarom dit er is: de slotpagina staat bewust niet op de homepagina
   (verzoek Armando 07-10-2026). Zonder sitemap is dat voor Google een pagina
   die alleen via de voet van een plaatspagina te vinden is. Met sitemap staat
   hij er rechtstreeks in.

   `lastmod` komt uit de laatste wijziging van het HTML-bestand zelf, niet uit de
   datum van vandaag. Anders zou elke build elke pagina als "net gewijzigd"
   melden en betekent het veld niets meer.

   /bedankt/ staat er niet in: dat is de pagina na het versturen van een
   formulier en die hoort niet in de zoekresultaten. Sinds het formulier via de
   eigen worker loopt komt er niemand meer, zie de README. */

import { writeFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, PLAATSEN, SLOT_SLUG } from './onderdelen.mjs';

const hier = dirname(fileURLToPath(import.meta.url));

/* Volgorde = wat we willen dat als eerste wordt opgepikt. Geen <priority> en
   geen <changefreq>: Google negeert die velden sinds 2023 openlijk. */
const PADEN = ['/', '/projecten/', `/${SLOT_SLUG}/`, ...PLAATSEN.map((p) => `/${p.slug}/`)];

const gewijzigd = (pad) => {
  const bestand = join(hier, 'dist', pad === '/' ? 'index.html' : `${pad.slice(1, -1)}/index.html`);
  return statSync(bestand).mtime.toISOString().slice(0, 10);
};

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PADEN.map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${gewijzigd(p)}</lastmod></url>`).join('\n')}
</urlset>
`;

const robots = `# RH Klusservice
User-agent: *
Allow: /
Disallow: /api/
Disallow: /bedankt/

Sitemap: ${SITE}/sitemap.xml
`;

writeFileSync(join(hier, 'dist/sitemap.xml'), sitemap, 'utf8');
writeFileSync(join(hier, 'dist/robots.txt'), robots, 'utf8');
console.log(`sitemap.xml (${PADEN.length} pagina's) en robots.txt geschreven`);
