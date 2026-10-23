// Makes the A4 PDF of the manual from index.html, so the PDF and the web page share one text.
// Two passes: the first finds the page each chapter starts on, the second prints those
// numbers in the table of contents.
//
//   node docs/handleiding-beheer/pdf.mjs
import { createRequire } from 'node:module';
import { readdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const hier = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(hier, '../../../..');
// Playwright is only installed for the workspace's other apps; borrow theirs.
const pnpm = path.join(root, 'node_modules/.pnpm');
const pw = readdirSync(pnpm).filter((d) => /^playwright@\d/.test(d)).sort().pop();
const { chromium } = createRequire(import.meta.url)(path.join(pnpm, pw, 'node_modules/playwright'));
const uit = path.join(hier, 'Handleiding beheer Toon over Leven.pdf');

const CSS = `
@page { size: A4; margin: 17mm 18mm 19mm; }
html, body { background: #fff !important; }
body { padding: 0 !important; font-size: 9.6pt !important; line-height: 1.5; color: #111; }
main { display: block !important; max-width: none !important; }
main > *, section > * { margin: 0; }

/* Cover: title, what it is, contents with page numbers. */
.voorblad { height: 255mm; display: flex; flex-direction: column; break-after: page; }
.voorblad .label { font-size: 9pt; letter-spacing: 0.12em; text-transform: uppercase; color: #c4001a; font-weight: 600; }
.voorblad h1 { font-size: 30pt !important; margin-top: 5mm !important; line-height: 1.1; }
.voorblad .lead { font-size: 12pt !important; margin-top: 5mm !important; max-width: 120mm; color: #333; }
.voorblad .meta { margin-top: 3mm !important; font-size: 9pt !important; }
.voorblad .inhoud { margin-top: auto !important; border: 0; border-top: 1.5pt solid #111; border-radius: 0; padding: 5mm 0 0; display: block; }
.voorblad .inhoud h2 { font-size: 11pt; margin: 0 0 3mm; padding: 0; border: 0; }
.voorblad .inhoud ol { list-style: none; padding: 0; display: block; }
.voorblad .inhoud li { display: flex; align-items: baseline; gap: 3mm; padding: 1.6mm 0; border-bottom: 0.5pt solid #ccc; font-size: 10.5pt; }
.voorblad .inhoud li a { text-decoration: none; }
.voorblad .inhoud li .vul { flex: 1; }
.voorblad .inhoud li .nr { font-variant-numeric: tabular-nums; width: 8mm; text-align: right; }

/* Chapters start on a new page; steps never split from their screenshot. */
section { display: block !important; }
section > h2 { break-before: page; font-size: 17pt !important; padding-top: 4mm !important; border-top: 1.5pt solid #111 !important; margin-bottom: 6mm !important; }
h3 { font-size: 11.5pt !important; }
.stap { display: grid !important; grid-template-columns: minmax(0, 1fr) 70mm !important; gap: 8mm !important; break-inside: avoid; margin-top: 7mm !important; }
section > h2 + .stap { margin-top: 0 !important; }
.stap > div { gap: 2.5mm !important; }
.stap.breed { grid-template-columns: minmax(0, 1fr) !important; gap: 4mm !important; }
.stap.breed > div { max-width: 150mm; }
.stap.breed figure { width: 150mm; }
.stap.breed figure img { max-height: 112mm; width: auto; max-width: 100%; }
figure img { border: 0.5pt solid #bbb !important; border-radius: 1.5mm !important; }
figure, .let, table, li { break-inside: avoid; }
ol, ul { gap: 1.5mm !important; padding-left: 5mm !important; }
.let { padding: 3mm 4mm !important; font-size: 9.2pt; }
.knop { font-size: 8.4pt !important; padding: 0 1.4mm !important; }
table { font-size: 9.2pt !important; }
th, td { padding: 1.8mm 3mm 1.8mm 0 !important; }
a { text-decoration: none; }
`;

async function render(paginas) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.join(hier, 'index.html'), { waitUntil: 'networkidle' });
  await page.evaluate(({ css, paginas }) => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.append(style);
    // The header and the contents become the cover.
    const header = document.querySelector('header');
    const nav = document.querySelector('nav.inhoud');
    const voorblad = document.createElement('div');
    voorblad.className = 'voorblad';
    const label = document.createElement('p');
    label.className = 'label';
    label.textContent = 'Toon over Leven';
    voorblad.append(label, ...header.children, nav);
    header.replaceWith(voorblad);
    voorblad.querySelector('.meta').textContent = 'Versie oktober 2026 · toonoverleven.nl/beheer';
    nav.querySelectorAll('li').forEach((li, i) => {
      const a = li.querySelector('a');
      li.innerHTML = '';
      const nr = document.createElement('span');
      nr.className = 'nr';
      nr.textContent = paginas[i] ?? '';
      li.append(Object.assign(document.createElement('span'), { textContent: i + 1 + '.' }), a, Object.assign(document.createElement('span'), { className: 'vul' }), nr);
    });
  }, { css: CSS, paginas });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: uit, preferCSSPageSize: true, printBackground: true, displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="width:100%;padding:0 18mm;display:flex;justify-content:space-between;font:7.5pt Helvetica,Arial,sans-serif;color:#777"><span>Handleiding beheer · Toon over Leven</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
  });
  await browser.close();
}

// Pass 1: where does each chapter start?
await render([]);
const tekst = execFileSync('pdftotext', ['-layout', uit, '-'], { encoding: 'utf8' }).split('\f');
const koppen = [...readFileSync(path.join(hier, 'index.html'), 'utf8').matchAll(/<h2>(\d+\. [^<]+)<\/h2>/g)].map((m) => m[1].replace(/&amp;/g, '&'));
const paginas = koppen.map((kop) => {
  const i = tekst.findIndex((p, n) => n > 0 && p.split('\n').some((r) => r.trim() === kop));
  if (i < 0) throw new Error('Hoofdstuk niet gevonden in de PDF: ' + kop);
  return String(i + 1);
});
// Pass 2: the same layout, now with page numbers in the contents.
await render(paginas);
console.log(path.relative(process.cwd(), uit), koppen.map((k, i) => `${k} p.${paginas[i]}`).join(' | '));
