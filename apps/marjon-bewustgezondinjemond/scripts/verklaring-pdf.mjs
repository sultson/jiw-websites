/* Maakt de twee documenten die op /privacyverklaring te downloaden zijn:
 *
 *   public/privacyverklaring-bewust-gezond-in-je-mond.pdf
 *   public/intakeformulier-vinkjes-bewust-gezond-in-je-mond.pdf
 *
 * De tekst komt uit src/verklaring-tekst.js, hetzelfde bestand dat de pagina
 * leest. Zo kan het document in iemands hand nooit iets anders zeggen dan de
 * pagina op de site. Dat is bij een privacyverklaring geen nettigheid: de
 * verklaring wordt aan de patient overhandigd en staat daarnaast openbaar, en
 * die twee moeten gelijk zijn.
 *
 *   node scripts/verklaring-pdf.mjs
 *
 * Draait op de Chromium van playwright, geleend uit ../../claudius/node_modules
 * (staat hier niet in package.json, zelfde leenconstructie als trustoo-rank).
 * De letters en de bloem komen uit public/, dus het document staat in haar
 * eigen huisstijl en haalt tijdens het maken niets van internet op.
 *
 * ER STAAT GEEN LOGO IN. Een logobestand bestaat nog niet, bevestigd door
 * Armando op 25 sep 2026. De kop is haar bloem met haar naam eronder, precies
 * zoals de vragenpagina dat deed. Komt er ooit een echt logo, dan wisselt dat
 * hier en op de site.
 */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const HIER = path.dirname(fileURLToPath(import.meta.url));
const WORTEL = path.join(HIER, '..');
const PUBLIEK = path.join(WORTEL, 'public');

/* Absoluut pad op Windows moet als file:// naar import, anders leest node de
   schijfletter als protocol. Dezelfde val als in jiw-websites. */
const T = await import(pathToFileURL(path.join(WORTEL, 'src/verklaring-tekst.js')).href);

/* playwright is CommonJS: uit een esm-import komt alles onder .default binnen
   en staat chromium niet los in de naamruimte. */
const pw = await import(
  pathToFileURL(path.join(WORTEL, '../../claudius/node_modules/playwright/index.js')).href
);
const {chromium} = pw.default ?? pw;

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const b64 = (p) => fs.readFileSync(path.join(PUBLIEK, p)).toString('base64');

const LETTER = (naam, bestand, gewicht) => `@font-face{
  font-family:'${naam}';src:url(data:font/woff2;base64,${b64(bestand)}) format('woff2');
  font-weight:${gewicht};font-style:normal;font-display:block;
}`;

/* Kleuren uit src/index.css, zodat het document en de site hetzelfde zijn. */
const STIJL = `
${LETTER('Cormorant Garamond', 'fonts/cormorant-garamond-latin.woff2', '400 700')}
${LETTER('Quicksand', 'fonts/quicksand-latin.woff2', '400 700')}
:root{
  --inkt:#2b4249; --olijf:#7c8460; --olijf-diep:#5f6749; --petrol:#497b89;
  --zand:#dce2df; --zand-diep:#c9d3ce; --room:#f6f4ef;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{
  font-family:'Quicksand',system-ui,sans-serif;font-size:10.5pt;line-height:1.65;
  color:var(--inkt);background:#fff;
}
.titel{font-family:'Cormorant Garamond',Georgia,serif;font-weight:700;letter-spacing:.02em}

/* De kop staat alleen op blad 1. Op de bladen daarna zet de paginavoet van
   Chromium de praktijknaam en het bladnummer, zie marge/footerTemplate. */
.kop{display:flex;align-items:center;gap:14mm;padding-bottom:6mm;border-bottom:2px solid var(--zand-diep)}
.kop img{width:22mm;height:22mm;object-fit:contain}
.kop .naam{font-size:20pt;line-height:1.1;color:var(--inkt);text-transform:uppercase}
.kop .onder{margin-top:1.5mm;font-size:9pt;color:var(--olijf-diep);letter-spacing:.14em;text-transform:uppercase}

h1{font-family:'Cormorant Garamond',Georgia,serif;font-size:26pt;font-weight:700;margin:9mm 0 0;letter-spacing:.02em}
.inleiding{margin:4mm 0 0;font-size:11pt;color:#2b4249cc}
.versie{margin:2mm 0 0;font-size:9pt;color:#2b424999}

h2{font-family:'Cormorant Garamond',Georgia,serif;font-size:16pt;font-weight:700;
   margin:9mm 0 0;color:var(--inkt);break-after:avoid;page-break-after:avoid}
h3{font-size:10.5pt;font-weight:700;margin:6mm 0 0;break-after:avoid;page-break-after:avoid}
p{margin:2.5mm 0 0;color:#2b4249d9}
ul{margin:2.5mm 0 0;padding:0;list-style:none}
li{position:relative;padding-left:5mm;margin-top:1.8mm;color:#2b4249d9}
li::before{content:'';position:absolute;left:0;top:2.1mm;width:1.6mm;height:1.6mm;
  border-radius:50%;background:var(--olijf)}

/* Niets mag over een bladrand heen breken: een tabel of een contactblok dat
   halverwege afknapt leest als een fout in het document. */
.gegevens,.tabel,.vinkje{break-inside:avoid;page-break-inside:avoid}

.gegevens{margin:4mm 0 0;border:1px solid var(--zand-diep);border-radius:2mm;overflow:hidden}
.gegevens .rij{display:flex;gap:4mm;padding:2mm 4mm}
.gegevens .rij:nth-child(odd){background:#dce2df40}
.gegevens dt{width:52mm;flex:0 0 52mm;font-weight:700;font-size:9pt;color:#2b424999}
.gegevens dd{margin:0;color:#2b4249e6}

.tabel{display:flex;gap:4mm;margin:4mm 0 0}
.tabel .kol{flex:1;border:1px solid var(--zand-diep);border-radius:2mm;padding:4mm}
.tabel .kol p{margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-size:13pt;font-weight:700;color:var(--inkt)}

.slot{margin:10mm 0 0;padding-top:4mm;border-top:1px solid var(--zand-diep);font-size:9pt;color:#2b424999}

.vinkje{display:flex;gap:4mm;margin-top:6mm}
.vinkje .hok{flex:0 0 5mm;width:5mm;height:5mm;margin-top:1mm;border:1.5pt solid var(--olijf);border-radius:1mm}
.vinkje .onder{margin-top:1mm;font-size:9pt;color:#2b424999}
.streep{display:inline-block;min-width:60mm;border-bottom:.6pt solid #2b424966}
.hand{margin-top:12mm;display:flex;gap:10mm}
.hand .veld{flex:1}
.hand .lijn{margin-top:12mm;border-bottom:.6pt solid #2b424966}
.hand .label{margin-top:1.5mm;font-size:9pt;color:#2b424999}
`;

const bloem = `data:image/png;base64,${b64('img/bloem.png')}`;

const kop = `<div class="kop">
  <img src="${bloem}" alt="">
  <div>
    <div class="titel naam">${esc(T.PRAKTIJK)}</div>
    <div class="onder">${esc(T.NAAM)} &nbsp;&middot;&nbsp; integraal mondhygienist</div>
  </div>
</div>`;

function blok(b) {
  if (b.t === 'gegevens') {
    return `<dl class="gegevens">${T.GEGEVENS.map(
      ([k, v]) => `<div class="rij"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`,
    ).join('')}</dl>`;
  }
  if (b.t === 'tabel') {
    const kol = (k) =>
      `<div class="kol"><p>${esc(k.kop)}</p><ul>${k.rijen.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></div>`;
    return `<div class="tabel">${kol(T.TABEL.links)}${kol(T.TABEL.rechts)}</div>`;
  }
  if (b.t === 'lijst') return `<ul>${b.v.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>`;
  if (b.t === 'kopje') return `<h3>${esc(b.v)}</h3>`;
  return `<p>${esc(b.v)}</p>`;
}

const VERKLARING = `<!doctype html><html lang="nl"><head><meta charset="utf-8">
<title>Privacyverklaring ${esc(T.PRAKTIJK)}</title><style>${STIJL}</style></head><body>
${kop}
<h1>Privacyverklaring</h1>
<p class="inleiding">${esc(T.INLEIDING)}</p>
<p class="versie">Versie van ${esc(T.VERSIE)}</p>
${T.HOOFDSTUKKEN.map(
  (h) => `<h2>${h.nr}. ${esc(h.kop)}</h2>${h.blokken.map(blok).join('')}`,
).join('')}
<p class="slot">${esc(T.SLOT)}</p>
</body></html>`;

const VINKJESDOC = `<!doctype html><html lang="nl"><head><meta charset="utf-8">
<title>Vinkjes intakeformulier ${esc(T.PRAKTIJK)}</title><style>${STIJL}</style></head><body>
${kop}
<h1>Bij het intakeformulier</h1>
<p class="inleiding">Deze drie regels horen op het intakeformulier te staan, samen met de privacyverklaring die je bij je eerste afspraak krijgt. Het eerste vinkje is een bevestiging dat je die verklaring gehad hebt. De andere twee zijn toestemming, en die zijn vrij: je wordt ook zonder gewoon behandeld.</p>
<p class="versie">Versie van ${esc(T.VERSIE)}</p>
${T.VINKJES.map(
  (v) => `<div class="vinkje"><div class="hok"></div><div>
    <div>${esc(v.tekst)}${v.regel ? ' <span class="streep"></span>' : ''}</div>
    ${v.onder ? `<div class="onder">${esc(v.onder)}</div>` : ''}
  </div></div>`,
).join('')}
<p class="slot">${esc(T.VINKJES_SLOT)}</p>
<div class="hand">
  <div class="veld"><div class="lijn"></div><div class="label">Naam</div></div>
  <div class="veld"><div class="lijn"></div><div class="label">Datum</div></div>
  <div class="veld"><div class="lijn"></div><div class="label">Handtekening</div></div>
</div>
</body></html>`;

const voet = (titel) => `<div style="width:100%;padding:0 18mm;font-family:sans-serif;font-size:7.5pt;color:#2b424999;
  display:flex;justify-content:space-between;">
  <span>${esc(titel)} &middot; ${esc(T.PRAKTIJK)}</span>
  <span>blad <span class="pageNumber"></span> van <span class="totalPages"></span></span>
</div>`;

const browser = await chromium.launch();
const pagina = await browser.newPage();

for (const [html, bestand, titel] of [
  [VERKLARING, 'privacyverklaring-bewust-gezond-in-je-mond.pdf', 'Privacyverklaring'],
  [VINKJESDOC, 'intakeformulier-vinkjes-bewust-gezond-in-je-mond.pdf', 'Bij het intakeformulier'],
]) {
  await pagina.setContent(html, {waitUntil: 'load'});
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.pdf({
    path: path.join(PUBLIEK, bestand),
    format: 'A4',
    printBackground: true,
    margin: {top: '18mm', bottom: '20mm', left: '18mm', right: '18mm'},
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: voet(titel),
  });
  const kb = Math.round(fs.statSync(path.join(PUBLIEK, bestand)).size / 1024);
  console.log(`  ${bestand}  ${kb} kB`);

  /* --proef zet dezelfde bladzijde ook als png weg, op A4-breedte. Een pdf is
     hier niet terug te lezen (headless chromium downloadt hem in plaats van hem
     te tonen), en dit document moet je met je ogen gezien hebben voordat het
     naar een patient gaat. */
  if (process.argv.includes('--proef')) {
    const png = path.join(WORTEL, `proef-${bestand.replace(/\.pdf$/, '.png')}`);
    await pagina.setViewportSize({width: 794, height: 1123});
    await pagina.screenshot({path: png, fullPage: true});
    console.log(`  ${path.basename(png)}`);
  }
}

await browser.close();
