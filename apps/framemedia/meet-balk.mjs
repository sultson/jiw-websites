// Meet de menubalk zelf, op de breedtes waar hij nog een rij is (vanaf 881px).
// GRENS is de breedte waaronder de balk een uitklapmenu wordt - dezelfde maat als
// de media query in style.css. Staan ze niet gelijk, dan meet dit script iets
// anders dan de site doet.
const GRENS = 1220;
// Sinds 10-10-2026 staat Puur Genieten in het menu; dat is een knop erbij en
// dus de vraag of de rij nog past naast het merk en de taalkeuze.
//   node bouw.mjs && node serveer.mjs   en dan   node meet-balk.mjs
import { chromium } from 'playwright';
const b = await chromium.launch();
const paginas = ['/', '/puurgenieten/', '/en/', '/de/'];
const breedtes = [881, 900, 960, 1024, 1100, 1180, 1200, 1220, 1221, 1240, 1280, 1366, 1440, 1600];
let fout = 0;
// Liep tot 11-10-2026 twee keer, een keer per weergave. De klant heeft
// definitief voor donker gekozen, dus de lichte weergave is er uit.
{
  for (const w of breedtes) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
    const p = await ctx.newPage();
    for (const pad of paginas) {
      await p.goto('http://localhost:4174' + pad, { waitUntil: 'load' });
      await p.waitForTimeout(120);
      const r = await p.evaluate(() => {
        const d = document.documentElement;
        const nav = document.querySelector('.nav');
        const toggle = document.querySelector('.nav-toggle');
        // Onder de grens is het een uitklapmenu: dan is de enige eis dat de
        // knop er staat en dat de pagina niet opzij te slepen is.
        if (getComputedStyle(toggle).display !== 'none') {
          return { ingeklapt: true, paginaBreedte: d.scrollWidth, scherm: d.clientWidth };
        }
        const merk = document.querySelector('.brand');
        const kop = document.querySelector('.header-inner');
        const nr = nav.getBoundingClientRect(), mr = merk.getBoundingClientRect(), kr = kop.getBoundingClientRect();
        // Links die tegen elkaar aan komen te staan: gat tussen twee knoppen.
        const links = [...nav.querySelectorAll('a')].map(a => a.getBoundingClientRect());
        let krap = 0;
        for (let i = 1; i < links.length; i++) krap = Math.min(krap || 99, links[i].left - links[i - 1].right);
        return {
          paginaBreedte: d.scrollWidth, scherm: d.clientWidth,
          navLinks: Math.round(nr.left), merkRechts: Math.round(mr.right),
          navRechts: Math.round(nr.right), kopRechts: Math.round(kr.right),
          krap: Math.round(krap), hoogte: Math.round(nr.height),
        };
      });
      const probleem = [];
      if (r.paginaBreedte > r.scherm) probleem.push('pagina steekt uit');
      if (r.ingeklapt) {
        if (w >= GRENS + 1) probleem.push('menu is ingeklapt terwijl het past');
        if (probleem.length) { fout++; console.log('FOUT', w, pad, probleem.join(' + '), JSON.stringify(r)); }
        continue;
      }
      if (w <= GRENS) probleem.push('menu staat als rij onder de grens');
      if (r.navLinks < r.merkRechts + 8) probleem.push('menu raakt het merk');
      if (r.navRechts > r.kopRechts + 1) probleem.push('menu steekt buiten de kop');
      if (r.hoogte > 70) probleem.push('menu breekt naar twee regels');
      if (probleem.length) { fout++; console.log('FOUT', w, pad, probleem.join(' + '), JSON.stringify(r)); }
    }
    await ctx.close();
  }
}
await b.close();
console.log(fout ? fout + ' fout' : `alle ${breedtes.length * paginas.length} goed in de menubalk`);
