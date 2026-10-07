/* Controleert met een echte browser of de <picture>-omzetting goed valt.

   Draaien:  node scripts/meet-plaatjes.mjs [adres]
   Standaard http://127.0.0.1:3069 (wrangler dev), geef een adres mee voor live.

   Wat het nakijkt, per pagina:
   - welk formaat de browser werkelijk ophaalt en hoeveel bytes dat is
   - of elke foto een plek met hoogte heeft (0x0 betekent dat display:contents
     of een selector ergens verkeerd valt — dat is de val bij <picture>)
   - of het mozaiek bij "Bekijk ons werk" nog een hoge en twee lage vakken heeft
   - of data-groot ergens naar een bestand wijst dat niet bestaat
   - fouten in de console en mislukte verzoeken */

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import playwright from 'file:///C:/Users/nieuw/dev/claudius/node_modules/playwright-core/index.js';
const { chromium } = playwright;

const DIST = join(dirname(fileURLToPath(import.meta.url)), '../dist');

const SITE = process.argv[2] || 'http://127.0.0.1:3069';
const PADEN = ['/', '/projecten/', '/slot-vervangen-valkenswaard/', '/timmerman-eindhoven/'];

const browser = await chromium.launch({ headless: true });
let stuk = 0;

for (const breed of [1440, 412]) {
  const pagina = await browser.newPage({
    viewport: { width: breed, height: breed === 412 ? 823 : 900 },
    deviceScaleFactor: breed === 412 ? 1.75 : 1,
  });

  const fouten = [];
  pagina.on('console', (m) => { if (m.type() === 'error') fouten.push(m.text()); });
  pagina.on('pageerror', (e) => fouten.push(String(e)));
  pagina.on('requestfailed', (r) => fouten.push(`${r.failure()?.errorText} ${r.url()}`));

  for (const pad of PADEN) {
    const bytes = new Map();
    const opHet = (res) => {
      const u = new URL(res.url()).pathname;
      if (!/\.(avif|webp|jpg|png|woff2|css|js)$/.test(u)) return;
      bytes.set(u, Number(res.headers()['content-length'] || 0));
    };
    pagina.on('response', opHet);

    await pagina.goto(SITE + pad, { waitUntil: 'load' });
    // helemaal naar beneden en terug, anders staan de lazy foto's nog op hun jpg
    // en meet je het formaat van een plaatje dat nooit is opgehaald
    await pagina.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 500));
    });
    pagina.off('response', opHet);

    const info = await pagina.evaluate(() => {
      const imgs = [...document.querySelectorAll('img')];
      const leeg = [];
      const groot = [];
      for (const i of imgs) {
        // de viewer voor schermvullend zet een lege <img> in de body klaar en
        // vult die pas bij een klik; die hoort hier niet als probleem te staan
        if (!i.getAttribute('src') || i.src.endsWith('.svg')) continue;
        const r = i.getBoundingClientRect();
        if (i.offsetParent !== null && (r.width < 2 || r.height < 2)) {
          leeg.push((i.currentSrc || i.src).split('/').pop());
        }
        const g = i.getAttribute('data-groot');
        if (g) groot.push(g);
      }
      const mozaiek = [...document.querySelectorAll('.inzicht__beeld img')]
        .map((i) => Math.round(i.getBoundingClientRect().height));
      const vorm = [...imgs]
        .map((i) => (i.currentSrc || i.src).split('.').pop())
        .filter((e) => ['avif', 'webp', 'jpg', 'png'].includes(e));
      return { aantal: imgs.length, leeg, groot, mozaiek, vorm };
    });

    // wijst data-groot naar iets dat bestaat. Op schijf en niet met een HEAD uit
    // de browser: Chromium meldt zo'n antwoord zonder lichaam als ERR_ABORTED en
    // dat komt dan als een valse fout in de lijst terecht.
    const dood = [...new Set(info.groot)].filter((g) => !existsSync(join(DIST, g)));

    const vorm = info.vorm.reduce((o, e) => ({ ...o, [e]: (o[e] || 0) + 1 }), {});
    const totaal = [...bytes.values()].reduce((a, b) => a + b, 0);
    const plaatjes = [...bytes].filter(([u]) => /\.(avif|webp|jpg|png)$/.test(u))
      .reduce((a, [, b]) => a + b, 0);

    console.log(`${breed}px ${pad.padEnd(34)} ${info.aantal} img  ${JSON.stringify(vorm)}  beeld ${(plaatjes / 1024).toFixed(0)} KB  totaal ${(totaal / 1024).toFixed(0)} KB`);
    /* Schermvullend hoort de grote versie te openen. Dat loopt via data-groot,
       en dat is precies het stukje dat stuk ging toen de foto's in een <picture>
       kwamen: site.js rekende de grote versie uit de bestandsnaam en kreeg sinds
       de srcset een variant als -klein-314.avif in handen. */
    /* Alleen deze twee blokken hangen aan de viewer (zie site.js). De foto in de
       hero van de slotpagina en die bij "Over RH Klusservice" niet: de eerste is
       geen reeks, de tweede staat in deze stijl verborgen. */
    const kaart = pagina.locator('.galerij figure:visible, .inzicht__beeld img:visible').first();
    if (info.groot.length && await kaart.count()) {
      await kaart.click();
      await pagina.waitForSelector('.licht.is-aan img', { timeout: 4000 }).catch(() => {});
      const open = await pagina.evaluate(async () => {
        const i = document.querySelector('.licht img');
        if (!i || !i.getAttribute('src')) return null;
        for (let n = 0; n < 40 && !i.naturalWidth; n++) await new Promise((r) => setTimeout(r, 100));
        return { src: i.getAttribute('src'), breed: i.naturalWidth };
      });
      await pagina.keyboard.press('Escape');
      if (!open || open.breed < 700) {
        console.log(`        SCHERMVULLEND STUK: ${JSON.stringify(open)}`);
        stuk++;
      } else {
        console.log(`        schermvullend: ${open.src.split('/').pop()} (${open.breed}px breed)`);
      }
    }

    if (info.mozaiek.length) console.log(`        mozaiek hoogtes: ${info.mozaiek.join(' / ')}`);
    if (info.leeg.length) { console.log(`        ZONDER MAAT: ${info.leeg.join(', ')}`); stuk++; }
    if (dood.length) { console.log(`        DATA-GROOT STUK: ${dood.join(', ')}`); stuk++; }
  }

  if (fouten.length) { console.log(`  fouten (${breed}px): ${[...new Set(fouten)].join(' | ')}`); stuk++; }
  await pagina.close();
}

await browser.close();
console.log(stuk ? `\n${stuk} probleem(en)` : '\nalles in orde');
process.exit(stuk ? 1 : 0);
