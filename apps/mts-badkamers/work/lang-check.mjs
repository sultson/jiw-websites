// Controleert de taallaag op een echte pagina in plaats van in de HTML-bron:
// staat de wisselaar er op desktop en in het mobiele menu, klikt hij door naar
// dezelfde pagina in die taal, en klopt lang/hreflang/canonical.
//
// Draaien tegen de live site:  BASE=https://m-techno-service.jouwidealewebsite.nl node work/lang-check.mjs
import { chromium, webkit, devices } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const LOCS = ['nl', 'en', 'tr', 'ru'];
const pre = (l) => (l === 'nl' ? '' : `/${l}`);
const PAGES = ['/', '/werk/terrazzo-met-vrijstaand-bad/'];
let fails = 0;
const bad = (m) => {
  fails++;
  console.log(`  FOUT ${m}`);
};

for (const [engName, engine] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await engine.launch();
  for (const [lbl, opts] of [
    ['desk', { viewport: { width: 1440, height: 900 } }],
    ['mob ', { ...devices['iPhone 13'] }],
  ]) {
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => !String(e).includes('cdn-cgi') && errs.push(String(e)));
    page.on('console', (m) => m.type() === 'error' && !m.text().includes('/cdn-cgi/') && errs.push(m.text()));
    // /cdn-cgi/rum is de meetpixel van Cloudflare zelf; die faalt in webkit op CORS
    // en staat los van de site.
    page.on('requestfailed', (r) => !r.url().includes('/cdn-cgi/') && errs.push(`request faalt: ${r.url()}`));

    for (const loc of LOCS) {
      for (const p of PAGES) {
        errs.length = 0;
        const url = `${BASE}${pre(loc)}${p}`;
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(400);
        const tag = `${engName}/${lbl} ${pre(loc) || '/'}${p === '/' ? '' : p}`;

        const lang = await page.getAttribute('html', 'lang');
        if (lang !== loc) bad(`${tag}: html lang=${lang}, verwacht ${loc}`);

        // hreflang: alle vier plus x-default, en elk naar hetzelfde pad.
        const alts = await page.$$eval('link[rel=alternate]', (ls) =>
          ls.map((l) => [l.getAttribute('hreflang'), l.getAttribute('href')]),
        );
        for (const l of [...LOCS, 'x-default']) {
          const hit = alts.find(([h]) => h === l);
          if (!hit) bad(`${tag}: hreflang ${l} ontbreekt`);
          else if (!hit[1].endsWith(`${l === 'x-default' ? '' : pre(l)}${p}`))
            bad(`${tag}: hreflang ${l} wijst naar ${hit[1]}`);
        }
        const can = await page.getAttribute('link[rel=canonical]', 'href');
        if (!can.endsWith(`${pre(loc)}${p}`)) bad(`${tag}: canonical ${can}`);

        // Op mobiel zit de wisselaar in het uitklapmenu: eerst de burger.
        if (lbl === 'mob ') {
          // Dicht hangt het menu met translateY boven het scherm: het element is dus
          // wel 'visible' voor de browser, maar staat niet in beeld. Meten op de
          // positie, niet op isVisible().
          const shut = await page.locator('.lang').boundingBox();
          if (shut && shut.y + shut.height > 0) bad(`${tag}: wisselaar staat in beeld met het menu dicht (y=${Math.round(shut.y)})`);
          await page.click('#burger');
          await page.waitForTimeout(350);
        }
        const box = await page.locator('.lang a.on').boundingBox();
        if (!box || box.width < 24 || box.height < 20)
          bad(`${tag}: actieve taalknop is ${box ? `${box.width}x${box.height}` : 'onzichtbaar'}`);
        const active = await page.textContent('.lang a.on .lang-s');
        if (active.trim().toLowerCase() !== loc) bad(`${tag}: actief gemarkeerd is ${active}, verwacht ${loc}`);

        // Doorklikken naar de volgende taal moet op dezelfde pagina uitkomen.
        const to = LOCS[(LOCS.indexOf(loc) + 1) % LOCS.length];
        await page.click(`.lang a[hreflang="${to}"]`);
        await page.waitForLoadState('domcontentloaded');
        const got = new URL(page.url()).pathname;
        if (got !== `${pre(to)}${p}`) bad(`${tag}: klik ${to} kwam uit op ${got}`);

        // Geen zijwaartse overloop door de wisselaar.
        const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        if (ov > 2) bad(`${tag}: ${ov}px horizontale overloop`);
        if (errs.length) bad(`${tag}: ${errs[0]}`);
      }
    }
    await ctx.close();
  }
  await browser.close();
}

console.log(fails ? `\n${fails} fouten` : '\ntaallaag klopt: lang, hreflang, canonical, wisselaar en doorklikken');
process.exit(fails ? 1 : 0);
