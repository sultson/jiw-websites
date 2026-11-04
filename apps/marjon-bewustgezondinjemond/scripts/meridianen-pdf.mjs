/* Maakt van de tandmeridianenkaart een pdf die Marjon kan doorsturen:
 *
 *   public/gebit-en-meridianen-bewust-gezond-in-je-mond.pdf        A4, om te mailen
 *   public/gebit-en-meridianen-bewust-gezond-in-je-mond-a3.pdf     A3, om te printen
 *
 * De bron is public/img/tandmeridianen.svg, hetzelfde bestand dat op de site
 * staat (scripts/meridianen.mjs tekent het). De svg wordt INLINE in de pagina
 * gezet, niet als <img>: een plaatje in een img-tag krijgt de letters uit
 * @font-face niet mee en valt terug op een systeemletter.
 *
 * Daarmee is dit echte vector: de kaart blijft scherp tot op een gevelbord, en
 * de tekst is in de pdf te selecteren en te doorzoeken.
 *
 *   node scripts/meridianen-pdf.mjs
 *
 * Twee maten met opzet. De kaart heeft veel kleine tekst (de kleinste staat op
 * 9 van 1600 eenheden). Op A4 is dat rond de 3pt: prima om op een scherm in te
 * zoomen, te klein om te lezen als je hem uitprint. Op A3 wordt het rond de
 * 4,5pt en de hoofdmoot rond de 7pt, en dat kan wel op papier.
 *
 * Draait op de Chromium van playwright, geleend uit ../../claudius/node_modules
 * (staat hier niet in package.json, zelfde leenconstructie als in
 * verklaring-pdf.mjs). Letters komen uit public/fonts, dus tijdens het maken
 * wordt er niets van internet gehaald.
 */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const HIER = path.dirname(fileURLToPath(import.meta.url));
const WORTEL = path.join(HIER, '..');
const PUBLIEK = path.join(WORTEL, 'public');

const pw = await import(
  pathToFileURL(path.join(WORTEL, '../../../claudius/node_modules/playwright/index.js')).href
);
const {chromium} = pw.default ?? pw;

const b64 = (p) => fs.readFileSync(path.join(PUBLIEK, p)).toString('base64');

const LETTER = (naam, bestand, gewicht) => `@font-face{
  font-family:'${naam}';src:url(data:font/woff2;base64,${b64(bestand)}) format('woff2');
  font-weight:${gewicht};font-style:normal;font-display:block;
}`;

/* De svg draagt zijn eigen breedte/hoogte in pixels. Die moeten eraf, anders
   houdt Chromium die 1600 aan en schaalt hij niet naar het blad. De viewBox
   blijft staan en doet het rekenwerk. */
const svgRuw = fs.readFileSync(path.join(PUBLIEK, 'img/tandmeridianen.svg'), 'utf8');
const svg = svgRuw.replace(/^<svg([^>]*)>/, (m, attrs) =>
  `<svg${attrs.replace(/\s(width|height)="[^"]*"/g, '')}>`,
);

const ROOM = '#f6f4ef';
const OLIJF = '#7c8460';
const INKT = '#2b4249';

/* De kaart is bijna vierkant (1600 bij 1680) en een A4 is dat niet. Hij wordt
   dus op de breedte gepast en er blijft hoogte over; die ruimte gaat naar de
   regel eronder, zodat wie de pdf doorstuurt ziet waar hij vandaan komt. */
const pagina = (marge) => `<!doctype html><html lang="nl"><head><meta charset="utf-8">
<title>Gebit en meridianen - Bewust Gezond in je Mond</title>
<style>
${LETTER('Cormorant Garamond', 'fonts/cormorant-garamond-latin.woff2', '400 700')}
${LETTER('Quicksand', 'fonts/quicksand-latin.woff2', '400 700')}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:${ROOM}}
body{
  font-family:'Quicksand',system-ui,sans-serif;color:${INKT};
  padding:${marge};
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  min-height:100vh;
}
svg{display:block;width:100%;height:auto}
.voet{
  margin-top:6mm;text-align:center;font-size:8.5pt;letter-spacing:.06em;
  color:${OLIJF};
}
.voet a{color:inherit;text-decoration:none}
</style></head><body>
${svg}
<div class="voet">Marjon Ooteman &nbsp;&middot;&nbsp; <a href="https://bewustgezondinjemond.nl">bewustgezondinjemond.nl</a></div>
</body></html>`;

const browser = await chromium.launch();
const blad = await browser.newPage();

for (const [bestand, formaat, marge] of [
  ['gebit-en-meridianen-bewust-gezond-in-je-mond.pdf', 'A4', '10mm'],
  ['gebit-en-meridianen-bewust-gezond-in-je-mond-a3.pdf', 'A3', '14mm'],
]) {
  await blad.setContent(pagina(marge), {waitUntil: 'load'});
  await blad.evaluate(() => document.fonts.ready);
  await blad.pdf({
    path: path.join(PUBLIEK, bestand),
    format: formaat,
    printBackground: true,
    margin: {top: 0, bottom: 0, left: 0, right: 0},
  });
  const kb = Math.round(fs.statSync(path.join(PUBLIEK, bestand)).size / 1024);
  console.log(`  ${bestand}  ${formaat}  ${kb} kB`);

  /* --proef zet hetzelfde blad ook als png weg. Headless Chromium downloadt een
     pdf in plaats van hem te tonen, dus terugkijken gaat zo. Zelfde html en
     zelfde verhouding als het blad, dus wat je hier ziet staat ook in de pdf. */
  if (process.argv.includes('--proef')) {
    const hoog = formaat === 'A4' ? 1123 : 1587;
    const breed = formaat === 'A4' ? 794 : 1123;
    await blad.setViewportSize({width: breed, height: hoog});
    const png = path.join(WORTEL, `proef-meridianen-${formaat}.png`);
    await blad.screenshot({path: png});
    console.log(`  ${path.basename(png)}`);
  }
}

await browser.close();
