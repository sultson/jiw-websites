// Waarom is de voor/na-foto weg op mobiel? Meet de stage + de img-elementen.
import { chromium, webkit, firefox, devices } from 'playwright';

const BASE = process.env.BASE || 'https://m-techno-service-concept.jouwidealewebsite.nl';
const eng = { chromium, webkit, firefox }[process.env.ENG || "chromium"];
const browser = await eng.launch();

for (const [lbl, opts] of [
  ['mobiel ', { ...devices['iPhone 13'] }],
  ['desktop', { viewport: { width: 1440, height: 900 } }],
]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const bad = [];
  page.on('response', (r) => r.status() >= 400 && bad.push(`${r.status()} ${r.url()}`));
  await page.goto(BASE + '/', { waitUntil: 'load', timeout: 60000 });
  await page.evaluate(() => document.querySelector('#voorna')?.scrollIntoView());
  await page.waitForTimeout(1500);
  const m = await page.evaluate(() => {
    const s = document.querySelector('#ba .ba-stage');
    const box = (el) => (el ? { w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) } : null);
    const img = (id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { ...box(el), src: el.getAttribute('src'), complete: el.complete, nw: el.naturalWidth, disp: cs.display, op: cs.opacity, vis: cs.visibility };
    };
    return {
      stage: box(s),
      stageAR: s ? getComputedStyle(s).aspectRatio : null,
      baClass: document.getElementById('ba')?.className,
      voor: img('baVoor'),
      na: img('baNa'),
      heroStage: box(document.querySelector('#heroBa')),
    };
  });
  console.log(lbl, JSON.stringify(m, null, 1));
  if (bad.length) console.log(lbl, 'HTTP fouten:', bad.slice(0, 8));
  await ctx.close();
}
await browser.close();
