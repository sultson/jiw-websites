/**
 * Alle 68 pagina's met JavaScript uit.
 *
 * work/audit-seo.mjs leest de HTML als tekst; dit zet er een echte browser op
 * met `javaScriptEnabled: false`, wat het dichtst bij een crawler komt die de
 * pagina wel ophaalt maar niets uitvoert. Wat hier ontbreekt, ontbreekt in de
 * index.
 *
 * Gemeten per pagina: de h1 staat er en is zichtbaar, er staat een fatsoenlijke
 * hoeveelheid tekst, elke foto heeft een echte bron en een hoogte, en er is geen
 * blok dat op nul staat omdat het op JavaScript wachtte.
 *
 *   node work/js-off.mjs                     (eigen servertje op site/)
 *   BASE=https://mts-badkamers.nl node work/js-off.mjs
 */
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.png': 'image/png',
  '.xml': 'application/xml', '.txt': 'text/plain', '.woff2': 'font/woff2',
};

let BASE = process.env.BASE;
let srv;
if (!BASE) {
  srv = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join('site', p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('x'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise((r) => srv.listen(8902, r));
  BASE = 'http://127.0.0.1:8902';
}

const paden = fs
  .readFileSync('site/sitemap.xml', 'utf8')
  .match(/<loc>[^<]+<\/loc>/g)
  .map((x) => new URL(x.slice(5, -6)).pathname);

const browser = await chromium.launch();
// javaScriptEnabled staat op de context, niet op de pagina: alles wat hierna
// laadt draait zonder scripts.
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: false });
const page = await ctx.newPage();

let fout = 0;
for (const p of paden) {
  const meldingen = [];
  await page.goto(BASE + p, { waitUntil: 'domcontentloaded', timeout: 30000 });

  const h1 = page.locator('h1').first();
  if ((await h1.count()) === 0) meldingen.push('geen h1');
  else {
    const box = await h1.boundingBox();
    if (!box || box.width < 40 || box.height < 10) meldingen.push('h1 heeft geen afmeting');
    const zichtbaar = await h1.evaluate((el) => {
      const s = getComputedStyle(el);
      return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) > 0.05;
    });
    if (!zichtbaar) meldingen.push('h1 is er wel maar staat onzichtbaar');
  }

  const tekst = (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
  if (tekst.length < 1200) meldingen.push(`maar ${tekst.length} tekens leesbare tekst`);

  // Blokken die zonder JavaScript op nul uitkomen: dat is precies het gat dat
  // een scroll-reveal achterlaat, en een crawler ziet er niets in staan.
  const leeg = await page.evaluate(() => {
    const uit = [];
    for (const el of document.querySelectorAll('main section, .foot, .hero')) {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      if (r.height < 24 || s.display === 'none' || Number(s.opacity) < 0.05) {
        uit.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : '.' + el.className.split(' ')[0]}`);
      }
    }
    return uit;
  });
  if (leeg.length) meldingen.push(`blok(ken) zonder hoogte of onzichtbaar: ${leeg.join(', ')}`);

  const plaatjes = await page.evaluate(() =>
    [...document.images].filter((i) => !i.getAttribute('src') || i.naturalWidth === 0).map((i) => i.getAttribute('src') || '(geen src)'),
  );
  if (plaatjes.length) meldingen.push(`${plaatjes.length} foto('s) laadden niet: ${plaatjes.slice(0, 3).join(', ')}`);

  if (meldingen.length) {
    fout++;
    console.log(` FOUT  ${p}: ${meldingen.join(' | ')}`);
  } else {
    console.log(` ok    ${p} (${tekst.length} tekens)`);
  }
}

await browser.close();
srv?.close();
console.log(fout ? `\n${fout} pagina(s) niet compleet zonder JavaScript` : `\nalle ${paden.length} pagina's zijn compleet zonder JavaScript`);
process.exit(fout ? 1 : 0);
