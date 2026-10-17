import { chromium } from 'playwright';
const b = await chromium.launch();
// Alle drie de talen: een Duits knoplabel is langer dan het Nederlandse
// ("Gespraech vereinbaren" tegen "Plan een gesprek"), dus de smalste maat van
// de pagina kan per taal ergens anders zitten.
const paginas = ['/','/branded-content','/studio','/formats','/over-ons','/contact','/puurgenieten/','/programma-idee/','/vacature','/voorwaarden','/404.html',
  '/en/','/en/branded-content','/en/studio','/en/about-us','/en/contact','/en/puur-genieten/',
  '/de/','/de/branded-content','/de/studio','/de/ueber-uns','/de/kontakt','/de/puur-genieten/'];
let fout = 0;
// Liep tot 11-10-2026 twee keer, een keer per weergave. De klant heeft
// definitief voor donker gekozen, dus de lichte weergave is er uit.
const ctx = await b.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
for (const pad of paginas) {
  await p.goto('http://localhost:4174' + pad, { waitUntil: 'load' });
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.75));
  await p.waitForTimeout(500);
  const r = await p.evaluate(() => {
    const d = document.documentElement;
    const bar = document.querySelector('.mobiel-cta');
    const knoppen = bar ? [...bar.querySelectorAll('.btn')].map(a => {
      const re = a.getBoundingClientRect();
      return { tekst: a.textContent.trim(), b: Math.round(re.width), h: Math.round(re.height), l: Math.round(re.left), r: Math.round(re.right) };
    }) : [];
    return { breedte: d.scrollWidth, scherm: d.clientWidth, knoppen, zichtbaar: bar ? bar.classList.contains('zichtbaar') : null };
  });
  const over = r.breedte > r.scherm;
  const buiten = r.knoppen.some(k => k.l < 0 || k.r > r.scherm);
  if (over || buiten) { fout++; console.log('FOUT', pad, JSON.stringify(r)); }
  else if (pad === '/') console.log('ok', pad, r.breedte + '/' + r.scherm, JSON.stringify(r.knoppen));
}
await ctx.close();
await b.close();
// Niet een vast getal: dat bleef op 18 staan toen er een pagina bij kwam.
console.log(fout ? fout + ' fout' : `alle ${paginas.length} goed op 360 breed`);
