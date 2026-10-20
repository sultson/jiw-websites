// De overbrugging naar het formulier op /puurgenieten/, in alle drie de talen.
// Het blokje ("Doet u mee?" + pijl) is een eigen kolom tussen de hero-tekst en
// de kaart. Dit script controleert per schermbreedte dat hij vanaf 1000px
// zichtbaar is en daaronder uit staat, dat hij netjes tussen de twee kolommen
// valt, dat hij geen letter van de hero-tekst links of van de kaart rechts
// raakt (de Duitse kop is daar het langst), en dat de kop van de hero niet op
// een los woord eindigt doordat de kolom te smal werd.
//   node bouw.mjs && POORT=4176 node serveer.mjs   ->  node meet-brug.mjs
import { chromium } from 'playwright';
const b = await chromium.launch();
// BASIS=https://www.framemedia.tv node meet-brug.mjs meet tegen het echte adres.
const basis = process.env.BASIS || 'http://localhost:4176';
const paden = { nl: '/puurgenieten/', en: '/en/puur-genieten/', de: '/de/puur-genieten/' };
let fout = 0, n = 0;
for (const [taal, pad] of Object.entries(paden)) {
  for (const w of [901, 950, 999, 1000, 1040, 1100, 1200, 1280, 1366, 1440, 1600, 1920, 2560]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(basis + pad, { waitUntil: 'networkidle' });
    const r = await p.evaluate(() => {
      const brug = document.querySelector('.form-brug');
      if (!brug) return { err: 'geen overbrugging' };
      const cs = getComputedStyle(brug);
      const bb = brug.getBoundingClientRect();
      const kaart = document.querySelector('.form-kaart');
      const kb = kaart.getBoundingClientRect();
      const links = document.querySelector('.hero-grid > div');
      const rechthoeken = (wortel) => {
        const uit = [];
        const loop = document.createTreeWalker(wortel, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = loop.nextNode())) {
          if (!node.textContent.trim()) continue;
          const rg = document.createRange(); rg.selectNodeContents(node);
          for (const r of rg.getClientRects()) if (r.width > 1 && r.height > 1) uit.push({ t: node.textContent.trim().slice(0, 24), x: r.x, y: r.y, r: r.right, b: r.bottom });
        }
        return uit;
      };
      const raakt = (lijst) => lijst.filter(t => bb.x < t.r && bb.right > t.x && bb.y < t.b && bb.bottom > t.y);
      // De kop mag niet op een los woord eindigen: dan is de linkerkolom te smal
      // geworden en leest de hero rafelig.
      const h1 = document.querySelector('.hero h1');
      const rg = document.createRange(); rg.selectNodeContents(h1);
      const regels = [...rg.getClientRects()].filter(r => r.width > 1);
      const laatste = regels.length > 1 ? Math.round(regels[regels.length - 1].width) : null;
      // is het eerste veld van het formulier gewoon aanklikbaar?
      // .veld, niet zomaar input: het eerste input-element in de kaart is de
      // honeypot die bouw.mjs erin zet, en die staat buiten beeld.
      const veld = document.querySelector('.form-kaart .veld input');
      const vb = veld.getBoundingClientRect();
      const onder = document.elementFromPoint(vb.x + 8, vb.y + vb.height / 2);
      return {
        display: cs.display,
        brug: { x: Math.round(bb.x), r: Math.round(bb.right), w: Math.round(bb.width) },
        kaartX: Math.round(kb.x), linksR: Math.round(links.getBoundingClientRect().right),
        raaktLinks: raakt(rechthoeken(links)).map(t => t.t),
        raaktKaart: raakt(rechthoeken(kaart)).map(t => t.t),
        regels: regels.length, laatste,
        veldVrij: onder === veld,
      };
    });
    n++;
    const aan = w >= 1000;
    const ok = r.err ? false
      : aan
        ? r.display === 'block' && r.brug.x >= r.linksR - 1 && r.brug.r <= r.kaartX + 1
          && r.raaktLinks.length === 0 && r.raaktKaart.length === 0
          && (r.laatste === null || r.laatste > 80) && r.veldVrij
        : r.display === 'none' && r.veldVrij;
    if (!ok) { fout++; console.log('FOUT', taal, w, JSON.stringify(r)); }
    else console.log('ok  ', taal, w, aan ? `| brug ${r.brug.x}-${r.brug.r} (${r.brug.w}) | links tot ${r.linksR} | kaart ${r.kaartX} | kop ${r.regels} regels` : '| uit');
    await p.close();
  }
}
console.log(`\n${n} metingen, ${fout} fouten`);
await b.close();
if (fout) process.exit(1);
