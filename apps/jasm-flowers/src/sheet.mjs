// Print-only source document for the downloadable PDF catalogue.
// Rendered to dist/catalogue-sheet/index.html by build.mjs, then printed to
// dist/jasm-flowers-catalogue.pdf by tools/gen-pdf.mjs (headless Chromium).
// Noindex: it exists so the PDF has a source, not as a page anyone browses.
import { company, varieties, signature, qualityFocus, markets, regions, MONTHS } from './data.mjs';
import { esc, LOGO } from './ui.mjs';

const cell = a => `<td class="m ${a === 2 ? 'p' : a ? 'y' : 'n'}"></td>`;

/**
 * The client's own lockup, same two files the site header and footer use: the dark
 * variant (cream lettering) on the ink cover, the light one on the white running
 * head. LOGO is filled in by build.mjs before sheet() runs, so the paths are the
 * hashed ones that actually exist in dist/i/.
 */
const logo = (variant, cls) =>
  `<img class="${cls}" src="${LOGO[variant]}" alt="${esc(company.name)}">`;

// The running head carried a 5.4mm mark plus the company name set in caps. The
// lockup already contains the name, so it replaces both.
const runHead = right => `<header class="ph">${logo('light', 'ph-logo')}` +
  `<span class="ph-r">${right}</span></header>`;

export function sheet(img) {
  const row = v => `<tr>
    <th scope="row"><b>${esc(v.name)}</b><i>${esc(v.latin)}</i></th>
    <td>${esc(v.group)}</td>
    <td>${v.lengths.join(' &middot; ')}</td>
    <td>${esc(v.packBunch)}</td>
    <td>${esc(v.packBox)}</td>
    <td>${esc(v.vaseLife)}</td>
  </tr>`;

  const card = v => `<section class="v">
    <div class="v-img">${img(v.img, v.name, 180, { ratio: '1/1', sizes: '180px' })}</div>
    <div class="v-b">
      <h3>${esc(v.name)}<span>${esc(v.group)}</span></h3>
      <p class="lat">${esc(v.latin)}${v.common ? ` &middot; ${esc(v.common)}` : ''}</p>
      <p class="bl">${esc(v.blurb)}</p>
      <dl>
        <div><dt>Lengths</dt><dd>${v.lengths.join(' &middot; ')}</dd></div>
        <div><dt>Colours</dt><dd>${esc(v.colours.join(', '))}</dd></div>
        <div><dt>Bunch</dt><dd>${esc(v.packBunch)}</dd></div>
        <div><dt>Per box</dt><dd>${esc(v.packBox)}</dd></div>
        <div><dt>Vase life</dt><dd>${esc(v.vaseLife)}</dd></div>
      </dl>
    </div>
  </section>`;

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${esc(company.name)} catalogue and specification sheet</title>
<link rel="stylesheet" href="/SHEETCSS">
</head>
<body class="sheet">

<div class="page cover">
  <div class="cover-img">${img('hero-field', 'Kenyan highland flower farm at sunrise', 800, { ratio: '4/3', sizes: '800px' })}</div>
  <div class="cover-t">
    ${logo('dark', 'cv-logo')}
    <p class="kick">Grown in Kenya &middot; Exported worldwide</p>
    <h1>Catalogue &amp;<br><em>specification sheet</em></h1>
    <p class="sub">${varieties.length} lines, one airway bill. Stem lengths, bunch and box specs,
      and month by month availability for the full programme.</p>
    <p class="cv-f"><b>${esc(company.name)}</b> &middot; ${esc(company.origin)}<br>
      ${esc(company.email)} &middot; ${esc(company.domain)}</p>
  </div>
</div>

<div class="page">
  ${runHead(`Specification sheet`)}
  <h2>Full specification, all ${varieties.length} lines</h2>
  <table class="spec-t">
    <thead><tr><th>Line</th><th>Type</th><th>Lengths</th><th>Bunch</th><th>Per box</th><th>Vase life</th></tr></thead>
    <tbody>${varieties.map(row).join('')}</tbody>
  </table>
  <p class="note">Box counts are a guide for a standard full box. Actual counts depend on stem length
    and cut stage, and are confirmed on your order confirmation. Bunch weight, stem length and cut
    stage can all be set to your own programme.</p>

  <h2 class="mt">Availability by month</h2>
  <table class="av-t">
    <thead><tr><th>Line</th>${MONTHS.map(m => `<th>${m[0]}</th>`).join('')}</tr></thead>
    <tbody>${varieties.map(v => `<tr><th scope="row">${esc(v.name)}</th>${v.avail.map(cell).join('')}</tr>`).join('')}</tbody>
  </table>
  <p class="leg"><span class="k p"></span> Peak volume <span class="k y"></span> Available
    <span class="k n"></span> Limited or out of season</p>
</div>

<div class="page">
  ${runHead(`Key flowers`)}
  <h2>Solidago, eucalyptus and limonium</h2>
  <p class="note" style="margin-top:0">Solidago, Eucalyptus Baby Blue and Eucalyptus Silver Dollar are our key flowers. Limonium runs alongside them as a core programme line.</p>
  ${signature.map(card).join('')}
</div>

${chunk(varieties.filter(v => v.tier !== 'signature'), 3).map((g, i) => `
<div class="page">
  ${runHead(`Additional flowers ${i + 1}`)}
  ${g.map(card).join('')}
</div>`).join('')}

<div class="page">
  ${runHead(`Ordering`)}
  <h2>How an order runs</h2>
  <div class="two">
    <div>
      <h3 class="sh">Ordering and transit</h3>
      <ul class="ul">
        <li>Orders confirmed 4 days before the scheduled shipment date; earlier for larger
          volumes and standing programmes.</li>
        <li>Cut the morning after the order, graded and bunched the same day.</li>
        <li>Out of Nairobi JKIA on the booked and confirmed flight.</li>
        <li>Cold chain unbroken at 2 to 4 &deg;C, cleared into a cold store on arrival.</li>
      </ul>
      <h3 class="sh">Freight</h3>
      <ul class="ul">
        <li>Minimum order 5 boxes, trial orders included.</li>
        <li>Full and half boxes, mixed lines on one airway bill.</li>
        <li>Photos of your pallet before it flies, on request.</li>
        <li>Incoterms: FOB Nairobi, written on every order confirmation.</li>
        <li>Quality or transit issues: photos and shipment details within 24 hours of arrival.</li>
      </ul>
    </div>
    <div>
      <h3 class="sh">Markets we ship to</h3>
      <p class="bl">${[...regions.filter(r => r !== 'Worldwide' && !markets.includes(r)), ...markets]
        .map(esc).join(' &middot; ')}</p>
      <h3 class="sh">Quality focus</h3>
      <ul class="ul">${qualityFocus.map(q => `<li><b>${esc(q.t)}</b> &mdash; ${esc(q.d)}</li>`).join('')}</ul>
      <h3 class="sh">Growing partners</h3>
      <ul class="ul">
        <li>Selected Kenyan growers, working to our written specification.</li>
        <li>1,800 to 2,400 metres, Naivasha and Mount Kenya.</li>
        <li>Cool nights give a tighter head, thicker neck, deeper colour.</li>
      </ul>
    </div>
  </div>
  <div class="cta">
    <h3>Send us your list and we send back a price.</h3>
    <p>Lines, lengths, weekly volume and your destination airport. We check availability with our
      growing partners and come back with a quote.</p>
    <p class="cta-c"><b>${esc(company.email)}</b> &middot; ${esc(company.phone)} &middot; ${esc(company.phoneAlt)}<br>
      ${esc(company.address)} &middot; ${esc(company.domain)}</p>
  </div>
  <p class="note">Specifications are the standard pack and are subject to season and confirmation on
    the order. This sheet supersedes earlier versions.</p>
</div>

</body></html>`;
}

function chunk(a, n) {
  const out = [];
  for (let i = 0; i < a.length; i += n) out.push(a.slice(i, i + n));
  return out;
}

export const SHEET_CSS = `
@page{size:A4;margin:0}
.sheet{margin:0;background:#fff;color:#15211B;font-family:'Satoshi',system-ui,sans-serif;
  font-size:9.6pt;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.sheet *{box-sizing:border-box}
.sheet img{display:block;width:100%;height:100%;object-fit:cover}
.sheet .page{width:210mm;min-height:297mm;padding:16mm 15mm 14mm;page-break-after:always;
  position:relative;overflow:hidden}
.sheet .page:last-child{page-break-after:auto}
.sheet h1,.sheet h2,.sheet h3{font-family:'Instrument Serif',Georgia,serif;font-weight:400;
  letter-spacing:-.015em;line-height:1.08;margin:0}
.sheet em{font-style:italic;color:inherit}

/* cover */
.sheet .cover{padding:0;display:flex;flex-direction:column}
.sheet .cover-img{height:150mm;position:relative}
.sheet .cover-img::after{content:"";position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(27,49,40,.18),rgba(27,49,40,.62))}
.sheet .cover-t{flex:1;background:#15211B;color:#fff;padding:16mm 15mm 14mm;display:flex;flex-direction:column}
/* Explicit width + height:auto: the blanket .sheet img rule above is written for
   the photography, and cover-fitting the lockup into a square would crop it. */
.sheet .cv-logo{width:44mm;height:auto;margin-bottom:8mm;object-fit:contain}
.sheet .kick{font-size:7.6pt;font-weight:700;letter-spacing:.19em;text-transform:uppercase;
  color:#C6CCC4;margin:0 0 5mm}
.sheet .cover h1{font-size:34pt;color:#fff}
.sheet .sub{margin:6mm 0 0;max-width:120mm;color:rgba(255,255,255,.8);font-size:10.4pt}
.sheet .cv-f{margin:auto 0 0;font-size:8.6pt;color:rgba(255,255,255,.72);
  border-top:1px solid rgba(255,255,255,.2);padding-top:5mm}

/* running head */
.sheet .ph{display:flex;align-items:center;gap:3mm;border-bottom:1px solid rgba(18,35,28,.16);
  padding-bottom:3mm;margin-bottom:8mm;font-size:8pt;letter-spacing:.13em;text-transform:uppercase;
  font-weight:700;color:#3B4B43}
.sheet .ph-logo{width:20mm;height:auto;flex:none;object-fit:contain}
.sheet .ph-r{margin-left:auto;color:#8A9189}
.sheet h2{font-size:20pt;margin-bottom:6mm}
.sheet h2.mt{margin-top:11mm}
.sheet .sh{font-size:11.5pt;margin:6mm 0 2.5mm}
.sheet .note{font-size:7.8pt;color:#3B4B43;margin-top:4mm;max-width:150mm}

/* tables */
.sheet table{width:100%;border-collapse:collapse}
.sheet th{text-align:left;font-weight:700}
.sheet .spec-t thead th{font-size:7.6pt;letter-spacing:.1em;text-transform:uppercase;color:#8A9189;
  padding:0 3mm 2mm 0;border-bottom:1.2px solid #15211B}
.sheet .spec-t td,.sheet .spec-t tbody th{padding:2.6mm 3mm 2.6mm 0;
  border-bottom:.5px solid rgba(18,35,28,.12);vertical-align:top;font-size:8.6pt}
.sheet .spec-t tbody th b{display:block;font-size:9.4pt}
.sheet .spec-t tbody th i{font-style:italic;color:#8A9189;font-size:7.8pt}
.sheet .spec-t tbody tr:nth-child(even){background:#F7F5F1}
.sheet .av-t thead th{font-size:7.4pt;color:#8A9189;padding:0 0 2mm;text-align:center;
  border-bottom:1.2px solid #15211B}
.sheet .av-t thead th:first-child{text-align:left}
.sheet .av-t tbody th{font-size:8.4pt;padding:1.5mm 3mm 1.5mm 0;font-weight:500;width:38mm}
.sheet .av-t td.m{height:5.4mm;border:1.4px solid #fff;border-radius:1px}
.sheet .m.p{background:#15211B}
.sheet .m.y{background:#93A491}
.sheet .m.n{background:#E2DED4}
.sheet .leg{font-size:7.8pt;color:#3B4B43;margin-top:3mm;display:flex;align-items:center;gap:2mm}
.sheet .leg .k{width:4mm;height:4mm;display:inline-block;margin-left:4mm;border-radius:1px}
.sheet .leg .k:first-child{margin-left:0}

/* variety cards */
.sheet .v{display:grid;grid-template-columns:46mm 1fr;gap:7mm;padding:6mm 0;
  border-top:.5px solid rgba(18,35,28,.14);page-break-inside:avoid}
.sheet .v:first-of-type{border-top:0;padding-top:0}
.sheet .v-img{height:46mm;background:#EDE9E1;overflow:hidden}
.sheet .v h3{font-size:16pt;display:flex;align-items:baseline;gap:3mm}
.sheet .v h3 span{font-size:7.2pt;font-family:'Satoshi',sans-serif;font-weight:700;
  letter-spacing:.14em;text-transform:uppercase;color:#fff;background:#15211B;padding:1mm 2.4mm;
  border-radius:1px}
.sheet .lat{font-style:italic;color:#8A9189;margin:1.4mm 0 0;font-size:8.4pt}
.sheet .bl{margin:2.6mm 0 0;font-size:8.8pt;color:#3B4B43}
.sheet .v dl{display:grid;grid-template-columns:1fr 1fr;gap:1.6mm 6mm;margin:4mm 0 0}
.sheet .v dl div{display:flex;gap:2mm;font-size:8.2pt;border-bottom:.5px solid rgba(18,35,28,.1);
  padding-bottom:1.2mm}
.sheet .v dt{color:#8A9189;min-width:19mm;font-weight:700;font-size:7.4pt;letter-spacing:.08em;
  text-transform:uppercase;padding-top:.4mm}
.sheet .v dd{margin:0;font-weight:500}

/* ordering page */
.sheet .two{display:grid;grid-template-columns:1fr 1fr;gap:10mm}
.sheet .ul{margin:0;padding-left:4.5mm;font-size:8.8pt;color:#3B4B43}
.sheet .ul li{margin-bottom:1.6mm}
.sheet .cta{margin-top:10mm;background:#15211B;color:#fff;padding:9mm 10mm}
.sheet .cta h3{font-size:17pt;color:#fff}
.sheet .cta p{margin:3mm 0 0;color:rgba(255,255,255,.8);font-size:9.2pt;max-width:130mm}
.sheet .cta-c{border-top:1px solid rgba(255,255,255,.2);padding-top:4mm;margin-top:5mm !important}
`;
