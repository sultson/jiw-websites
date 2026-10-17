// Zet de gegenereerde korrel om naar een kleine tegel, en de sfeerplaten naar webp.
// Geen sharp hier, dus het gaat door een canvas in een echte browser.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const b = await chromium.launch();
const p = await b.newPage();

async function webp(bron, doel, breedte, kwal = .72, korrel = false) {
  const data = 'data:image/png;base64,' + (await fs.readFile(bron)).toString('base64');
  const uit = await p.evaluate(async ([src, w, q, grain]) => {
    const im = new Image(); im.src = src; await im.decode();
    const h = Math.round(im.height * (w / im.width));
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d');
    x.drawImage(im, 0, 0, w, h);
    if (grain) {
      // De korrel uit het model is heel vlak. Hier wordt hij om het midden
      // uitgerekt tot grijs, zodat hij op 6% dekking nog iets doet.
      const d = x.getImageData(0, 0, w, h), a = d.data;
      let som = 0;
      for (let i = 0; i < a.length; i += 4) som += (a[i] + a[i + 1] + a[i + 2]) / 3;
      const gem = som / (a.length / 4);
      for (let i = 0; i < a.length; i += 4) {
        const l = (a[i] + a[i + 1] + a[i + 2]) / 3;
        const v = Math.max(0, Math.min(255, 128 + (l - gem) * 9));
        a[i] = a[i + 1] = a[i + 2] = v; a[i + 3] = 255;
      }
      x.putImageData(d, 0, 0);
    }
    return c.toDataURL('image/webp', q);
  }, [data, breedte, kwal, korrel]);
  await fs.writeFile(doel, Buffer.from(uit.split(',')[1], 'base64'));
  const st = await fs.stat(doel);
  console.log(doel, Math.round(st.size / 1024) + ' kB');
}

await webp('raw/gen2/korrel-vlak.png', 'inhoud/assets/gen/korrel.webp', 256, .62, true);
await webp('raw/gen2/korrel-cta.png', 'inhoud/assets/gen/sfeer-cta-1600.webp', 1600, .7);
await webp('raw/gen2/korrel-cta.png', 'inhoud/assets/gen/sfeer-cta-800.webp', 800, .7);
await webp('raw/gen2/korrel-hero.png', 'inhoud/assets/gen/sfeer-hero-1600.webp', 1600, .7);
await webp('raw/gen2/korrel-hero.png', 'inhoud/assets/gen/sfeer-hero-800.webp', 800, .7);
await b.close();
