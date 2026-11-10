// Controleert dat de branchekaarten in beide beeldverhoudingen het goede
// bestand pakken: het posterbeeld dat de browser echt kiest, en de clip die
// na een klik in de speler komt. Loopt over de drie talen.
//   node tools/meet-branches.mjs [url]
import { chromium } from 'playwright';

const basis = process.argv[2] || 'http://localhost:4175';
const PADEN = ['/', '/en/', '/de/'];
const browser = await chromium.launch();
let fout = 0, metingen = 0;

for (const [breedte, soort] of [[1440, 'breed'], [1100, 'breed'], [900, 'staand'], [390, 'staand']]) {
  const ctx = await browser.newContext({ viewport: { width: breedte, height: 900 } });
  const page = await ctx.newPage();
  // Turnstile houdt na het laden een verbinding met challenges.cloudflare.com
  // open, dus `networkidle` komt op een pagina met een formulier nooit - sinds
  // 02-11-2026 liep dit script daar in zijn timeout, net als kijk.mjs. Zelfde
  // oplossing: het vinkje met een leeg antwoord buiten de deur zetten. Voor wat
  // hier gemeten wordt (posterbeeld en clip) doet het niet mee.
  await page.route('**://challenges.cloudflare.com/**', r =>
    r.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
  for (const pad of PADEN) {
    await page.goto(basis + pad, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); }
    });
    await page.waitForTimeout(500);
    const kaarten = page.locator('.branche-kaart');
    const n = await kaarten.count();
    if (!n) { console.log(`! geen branchekaarten op ${pad}`); fout++; continue; }

    for (let i = 0; i < n; i++) {
      const k = kaarten.nth(i);
      const heeftBreed = await k.evaluate(e => !!e.dataset.clipBreed);
      const wil = soort === 'breed' && heeftBreed;
      // 1. het posterbeeld dat de browser koos
      const img = k.locator('img');
      const [bron, geladen] = await img.evaluate(e => [e.currentSrc, e.naturalWidth > 0 && e.complete]);
      metingen += 2;
      if (!geladen) { console.log(`! poster niet geladen: ${breedte} ${pad} #${i}`); fout++; }
      if (bron.includes('-breed-poster') !== wil) {
        console.log(`! verkeerd posterbeeld op ${breedte} ${pad} #${i}: ${bron}`); fout++;
      }
      // 2. de clip in de speler
      // De speler staat sinds 08-11-2026 in de lichtbak over de pagina heen en
      // niet meer in de kaart. De verhouding staat als --arn op het vak: 1,78
      // voor een liggende clip, 0,56 voor een staande.
      await k.click();
      const speler = page.locator('.lichtbak:not([hidden]) .lichtbak-vak').first();
      const [src, arn] = await speler.evaluate(e => [
        e.querySelector('video').getAttribute('src'),
        parseFloat(e.style.getPropertyValue('--arn')),
      ]);
      metingen += 2;
      if (src.includes('-breed.mp4') !== wil) { console.log(`! verkeerde clip op ${breedte} ${pad} #${i}: ${src}`); fout++; }
      if ((arn > 1) !== wil) { console.log(`! verkeerde verhouding speler op ${breedte} ${pad} #${i}: ${arn}`); fout++; }
      await page.reload({ waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
      });
      await page.waitForTimeout(300);
    }
  }
  await ctx.close();
}
await browser.close();
console.log(`${metingen} metingen, ${fout} fouten`);
process.exit(fout ? 1 : 0);
