// Rooktest over alle pagina's: JS-fouten, overloop, pijlknoppen, lightbox, ankers.
import { chromium, devices } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.BASE || 'http://127.0.0.1:8788';
// De projecthub en de vier dienstenpagina's staan er sinds kort bij; readdirSync
// op site/werk levert nu ook index.html op, dus die eruit filteren.
const paths = [
  '/',
  '/404.html',
  '/werk/',
  ...['badkamerrenovatie', 'toiletrenovatie', 'tegelwerk', 'loodgieter-en-cv'].map((s) => `/${s}/`),
  ...fs
    .readdirSync('site/werk')
    .filter((s) => fs.statSync(`site/werk/${s}`).isDirectory())
    .map((s) => `/werk/${s}/`),
];
const browser = await chromium.launch();
let fails = 0;

for (const [lbl, opts] of [['desk', { viewport: { width: 1440, height: 900 } }], ['mob ', { ...devices['iPhone 13'] }]]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  page.on('requestfailed', (r) => errs.push(`404? ${r.url()}`));
  for (const p of paths) {
    errs.length = 0;
    await page.goto(BASE + p, { waitUntil: 'load', timeout: 30000 });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } scrollTo(0, 0); });
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => {
      const over = document.documentElement.scrollWidth > innerWidth + 1;
      const rails = [...document.querySelectorAll('[data-rail]')];
      const noCount = rails.filter((w) => {
        const rail = w.querySelector('.rail');
        const scrollable = rail.scrollWidth - rail.clientWidth > 4;
        return scrollable && w.querySelector('.rail-count').textContent.trim() !== `1 / ${rail.children.length}`;
      }).length;
      return { over, rails: rails.length, noCount };
    });
    // pijl indrukken
    let arrow = 'n.v.t.';
    const next = await page.$('.rail-next:not(:disabled)');
    if (next) {
      // de rail die bij DEZE knop hoort, niet zomaar de eerste van de pagina
      const own = (el) => el.evaluate((b) => b.closest('[data-rail]').querySelector('.rail').scrollLeft);
      const before = await own(next);
      await next.click();
      await page.waitForTimeout(700);
      const after = await own(next);
      arrow = after > before ? 'ok' : `FOUT ${before}->${after}`;
    }
    // lightbox
    let lb = 'n.v.t.';
    const ph = await page.$('.ph');
    if (ph) {
      await ph.scrollIntoViewIfNeeded();
      await ph.click();
      await page.waitForTimeout(500);
      lb = (await page.$eval('#lb', (e) => !e.hidden)) ? 'ok' : 'FOUT';
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }
    const bad = r.over || r.noCount || arrow.startsWith('FOUT') || lb === 'FOUT' || errs.length;
    if (bad) fails++;
    if (bad) console.log(`${lbl} ${p}  overloop=${r.over} tellerfout=${r.noCount} pijl=${arrow} lightbox=${lb} ${errs.slice(0, 2).join(' | ')}`);
  }
  await ctx.close();
}
await browser.close();
console.log(fails ? `${fails} pagina's met problemen` : `alle ${paths.length} pagina's schoon (desktop + mobiel)`);
