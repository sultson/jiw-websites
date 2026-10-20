// De pijl naar het formulier op /puurgenieten/, in alle drie de talen.
// Hij staat in het gat tussen de twee kolommen van de hero en wijst naar de
// kop van de kaart. Dit script controleert per schermbreedte dat hij zichtbaar
// is, binnen het scherm valt, geen letter van de hero-tekst links raakt (de
// Duitse kop is daar het langst), geen tekst in de kaart zelf raakt, en dat
// hij geen klik op het formulier opvangt.
//   node bouw.mjs && POORT=4176 node serveer.mjs   ->  node meet-pijl.mjs
import { chromium } from 'playwright';
const b = await chromium.launch();
// BASIS=https://www.framemedia.tv node meet-pijl.mjs meet tegen het echte adres.
const basis = process.env.BASIS || 'http://localhost:4176';
const paden = { nl: '/puurgenieten/', en: '/en/puur-genieten/', de: '/de/puur-genieten/' };
let fout = 0, n = 0;
for (const [taal, pad] of Object.entries(paden)) {
  for (const w of [901, 920, 950, 1000, 1040, 1100, 1200, 1280, 1366, 1440, 1600, 1920, 2560]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(basis + pad, { waitUntil: 'networkidle' });
    const r = await p.evaluate(() => {
      const pijl = document.querySelector('.pijl-form');
      if (!pijl) return { err: 'geen pijl' };
      const cs = getComputedStyle(pijl);
      const pb = pijl.getBoundingClientRect();
      const kaart = document.querySelector('.form-kaart');
      const kb = kaart.getBoundingClientRect();
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
      const raakt = (lijst) => lijst.filter(t => pb.x < t.r && pb.right > t.x && pb.y < t.b && pb.bottom > t.y);
      const links = raakt(rechthoeken(document.querySelector('.hero-grid > div')));
      const inKaart = raakt(rechthoeken(kaart));
      // vangt de pijl een klik op het formulier af?
      const mid = document.elementFromPoint(pb.x + pb.width - 6, pb.y + pb.height / 2);
      return {
        display: cs.display,
        pijl: { x: Math.round(pb.x), y: Math.round(pb.y), r: Math.round(pb.right), b: Math.round(pb.bottom), w: Math.round(pb.width) },
        kaartX: Math.round(kb.x),
        buiten: pb.x < 0,
        links: links.map(t => t.t), inKaart: inKaart.map(t => t.t),
        onder: mid ? mid.className || mid.tagName : null,
      };
    });
    n++;
    const ok = r.display === 'block' && !r.buiten && r.links.length === 0 && r.inKaart.length === 0 && r.onder !== 'pijl-form';
    if (!ok) { fout++; console.log('FOUT', taal, w, JSON.stringify(r)); }
    else console.log('ok  ', taal, w, '| pijl', r.pijl.x + '-' + r.pijl.r, '| kaart', r.kaartX, '| breed', r.pijl.w);
    await p.close();
  }
}
console.log(`\n${n} metingen, ${fout} fouten`);
await b.close();
