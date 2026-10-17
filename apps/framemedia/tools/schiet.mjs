// Snelle schermafdrukken om naar te kijken tijdens het bouwen.
//   node schiet.mjs [url]
import { chromium } from 'playwright';

const basis = process.argv[2] || 'http://localhost:4174';
const paginas = [['', 'home'], ['/branded-content.html', 'branded'], ['/studio.html', 'studio'], ['/formats.html', 'formats']];

const browser = await chromium.launch();
for (const [breedte, maat] of [[1360, 'desk'], [390, 'mob']]) {
  const ctx = await browser.newContext({ viewport: { width: breedte, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const [pad, naam] of paginas) {
    await page.goto(basis + pad, { waitUntil: 'networkidle' });
    // Alles een keer langslopen zodat de lui-ladende beelden er echt staan.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(900);
    await page.screenshot({ path: `shots/nu-${naam}-${maat}.png`, fullPage: true });
  }
  await ctx.close();
}
await browser.close();
console.log('klaar');
