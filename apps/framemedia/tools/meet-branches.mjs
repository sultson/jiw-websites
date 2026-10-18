// Controleert dat de branchekaarten in beide beeldverhoudingen het goede
// bestand pakken: het posterbeeld dat de browser echt kiest, en de clip die
// na een klik in de speler komt. Loopt over de drie talen.
//   node tools/meet-branches.mjs [url]
import { chromium } from 'playwright';

const basis = process.argv[2] || 'http://localhost:4175';
const PADEN = ['/puurgenieten/', '/en/puur-genieten/', '/de/puur-genieten/', '/'];
const browser = await chromium.launch();
let fout = 0, metingen = 0;

for (const [breedte, soort] of [[1440, 'breed'], [1100, 'breed'], [900, 'staand'], [390, 'staand']]) {
  const ctx = await browser.newContext({ viewport: { width: breedte, height: 900 } });
  const page = await ctx.newPage();
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
      await k.click();
      const speler = page.locator('.branche-speler').first();
      const [src, isBreed] = await speler.evaluate(e => [e.querySelector('video').getAttribute('src'), e.classList.contains('breed')]);
      metingen += 2;
      if (src.includes('-breed.mp4') !== wil) { console.log(`! verkeerde clip op ${breedte} ${pad} #${i}: ${src}`); fout++; }
      if (isBreed !== wil) { console.log(`! verkeerde verhouding speler op ${breedte} ${pad} #${i}`); fout++; }
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
