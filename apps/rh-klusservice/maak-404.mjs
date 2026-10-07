/* Schrijft dist/404.html.
   Draaien:  node maak-404.mjs  (zit in `pnpm build`)

   Waarom dit er is: `not_found_handling` in wrangler.jsonc stond eerst op niets,
   en dan krijgt een onbekend pad een kale Cloudflare-foutpagina. De startpagina
   met status 200 teruggeven is nog slechter — Google leest dat als een soft 404
   en neemt het adres alsnog op. Dit is een eigen pagina mét status 404.

   De pagina staat niet in sitemap.xml en heeft `noindex`: hij bestaat alleen om
   iemand die verkeerd klikt weer op weg te helpen. */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TEL, TEL_TOON, WA, SITE, BALK, VOET, ZWEEF } from './onderdelen.mjs';

const hier = dirname(fileURLToPath(import.meta.url));
const TITEL = 'Pagina niet gevonden | RH Klusservice';

const pagina = `<!doctype html>
<html lang="nl" data-thema="midnight-clean">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${TITEL}</title>
<meta name="robots" content="noindex,follow">
<link rel="icon" href="/logo/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/stijl.css">
</head>
<body>

${BALK(TITEL)}

<main>

<section class="vak vak--zwart">
  <div class="binnen">
    <h1>Deze pagina bestaat niet</h1>
    <p class="lood">Het adres klopt niet meer of er zit een typefout in. Van hieruit komt u er wel:</p>
    <div class="knoppen">
      <a class="knop knop--wit" href="/">Naar de startpagina</a>
      <a class="knop knop--licht" href="/projecten/">Bekijk ons werk</a>
      <a class="knop knop--licht" href="tel:${TEL}">Bel ${TEL_TOON}</a>
      <a class="knop knop--wa" href="${WA}" rel="noopener">WhatsApp</a>
    </div>
  </div>
</section>

</main>

${VOET}
${ZWEEF}
<script src="/site.js" defer></script>
</body>
</html>
`;

writeFileSync(join(hier, 'dist/404.html'), pagina, 'utf8');
console.log(`404.html geschreven (${SITE}/<onbekend pad>)`);
