/* Schrijft dist/stijl.css en dist/site.js uit bron/.

   Tot 07-10-2026 stonden die twee bestanden zelf in dist en gingen ze onverkort
   de deur uit: 45,7 KB css en 17,2 KB js met alle uitleg erin. Dat is prettig om
   te lezen en onnodig om te versturen. De bron staat nu in bron/ en is onaangetast
   — dat is waar je in werkt — en dit script zet er de verkleinde versie van in dist.

   Scheelt ongeveer 9 KB css en 9 KB js onverpakt. Niet wereldschokkend, maar
   stijl.css blokkeert het eerste beeld, dus het zit in de regel die er het meest
   toe doet.

   lightningcss doet er meteen de prefixen bij voor de browsers uit de lijst, en
   die lijst is hier ruim: een klusbedrijf heeft klanten op oude telefoons. */

import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'lightningcss';
import { transformSync } from 'esbuild';

const hier = dirname(fileURLToPath(import.meta.url));

/* ---------- css ---------- */

const cssVan = join(hier, 'bron/stijl.css');
const cssNaar = join(hier, 'dist/stijl.css');

const { code: css, warnings } = transform({
  filename: 'stijl.css',
  code: readFileSync(cssVan),
  minify: true,
  targets: {
    chrome: 100 << 16,
    firefox: 100 << 16,
    safari: (15 << 16) | (4 << 8),
    edge: 100 << 16,
  },
});
for (const w of warnings) console.warn(`  css: ${w.message}`);
writeFileSync(cssNaar, css);

/* ---------- js ---------- */

const jsVan = join(hier, 'bron/site.js');
const jsNaar = join(hier, 'dist/site.js');

// Geen bundelstap: site.js is één bestand zonder imports en staat met defer in de
// head. Alleen verkleinen, en in es2017 houden zodat een oudere telefoon hem nog leest.
const { code: js } = transformSync(readFileSync(jsVan, 'utf8'), {
  loader: 'js',
  minify: true,
  target: 'es2017',
  legalComments: 'none',
});
writeFileSync(jsNaar, js);

const kb = (p) => (statSync(p).size / 1024).toFixed(1);
console.log(`bundel: stijl.css ${kb(cssVan)} -> ${kb(cssNaar)} KB, site.js ${kb(jsVan)} -> ${kb(jsNaar)} KB`);
