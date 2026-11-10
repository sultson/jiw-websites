// Klikproef op /handtekening/: past de handtekening op een telefoon, staat het
// logo niet uitgerekt, volgen de velden, en wat zetten de twee knoppen echt op
// het klembord. `node tools/handtekening-kijk.mjs [adres]` - zonder adres
// serveert hij dist/ zelf. Maakt shots/handtekening-<breedte>.png.
import { chromium } from '../../../../claudius/node_modules/playwright/index.mjs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const MIME = { '.html': 'text/html', '.png': 'image/png', '.svg': 'image/svg+xml', '.css': 'text/css', '.js': 'text/javascript' };
let adres = process.argv[2];
let srv;
if (!adres) {
  srv = createServer(async (req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    try { res.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' }); res.end(await readFile(join(DIST, p))); }
    catch { res.writeHead(404).end('404'); }
  }).listen(0);
  adres = `http://localhost:${srv.address().port}`;
}
console.log(`adres: ${adres}`);

const fout = [];
const browser = await chromium.launch();
for (const breed of [360, 390, 1280]) {
  const ctx = await browser.newContext({ viewport: { width: breed, height: 900 } });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: adres });
  const pg = await ctx.newPage();
  await pg.goto(`${adres}/handtekening/`, { waitUntil: 'load' });
  const m = await pg.evaluate(() => {
    const t = document.querySelector('#voorbeeld table');
    const img = t.querySelector('img');
    const r = img.getBoundingClientRect();
    return {
      tabel: Math.round(t.getBoundingClientRect().width),
      kaart: Math.round(document.querySelector('#voorbeeld').clientWidth),
      pagina: document.documentElement.scrollWidth,
      img: [Math.round(r.width), Math.round(r.height), img.naturalWidth, img.naturalHeight],
      regels: [...t.querySelectorAll('a,div')].filter(e => e.children.length === 0 && e.getClientRects().length > 1).map(e => e.textContent),
    };
  });
  const verh = Math.abs(m.img[0] / m.img[1] - m.img[2] / m.img[3]);
  console.log(`${breed}: tabel ${m.tabel} in ${m.kaart}, pagina ${m.pagina}, logo ${m.img[0]}x${m.img[1]} (bron ${m.img[2]}x${m.img[3]})`);
  if (m.pagina > breed) fout.push(`${breed}: pagina steekt uit (${m.pagina})`);
  if (m.tabel > m.kaart) fout.push(`${breed}: handtekening breder dan de kaart`);
  if (verh > 0.02) fout.push(`${breed}: logo uitgerekt`);
  if (m.regels.length) fout.push(`${breed}: regel breekt: ${m.regels.join(', ')}`);
  await pg.screenshot({ path: `shots/handtekening-${breed}.png`, fullPage: breed !== 1280 ? false : true });

  if (breed === 1280) {
    await pg.fill('#naam', 'Test Naam');
    await pg.fill('#functie', 'Eigenaar');
    const v = await pg.textContent('#voorbeeld');
    if (!v.includes('Test Naam') || !v.includes('Eigenaar')) fout.push('voorbeeld volgt de velden niet');
    await pg.click('#kopieer');
    await pg.waitForTimeout(300);
    const kb = await pg.evaluate(async () => {
      const [it] = await navigator.clipboard.read();
      return { soorten: it.types, html: await (await it.getType('text/html')).text() };
    });
    if (!kb.soorten.includes('text/html')) fout.push('kopieerknop zet geen html op het klembord');
    if (!/src="data:image\/png;base64,/.test(kb.html)) fout.push('geplakte handtekening zonder ingesloten logo');
    if (!kb.html.includes('Test Naam') || !kb.html.includes('06 3486 1375')) fout.push('klembord mist naam of nummer');
    await pg.click('#code');
    await pg.waitForTimeout(300);
    const code = await pg.evaluate(() => navigator.clipboard.readText());
    if (!code.startsWith('<table') || !code.includes('src="https://puurgenieten.tv/assets/mail/handtekening-logo.png"')) fout.push('codeknop geeft niet de html met het logo-adres');
    await pg.fill('#naam', '');
    if (!(await pg.textContent('#voorbeeld')).includes('Frans')) fout.push('leeg naamveld valt niet terug op Frans');
    console.log(`klembord: ${kb.soorten.join(', ')}; code ${code.length} tekens`);
  }
  await ctx.close();
}
await browser.close();
srv?.close();
if (fout.length) { console.error('FOUT:\n  ' + fout.join('\n  ')); process.exit(1); }
console.log('handtekening: nul fouten');
