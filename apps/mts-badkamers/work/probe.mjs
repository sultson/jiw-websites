import { chromium, devices } from 'playwright';

const BASE = process.env.BASE || 'https://m-techno-service-concept.jouwidealewebsite.nl';
const browser = await chromium.launch();

async function probe(label, url, ctxOpts) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
  const m = await page.evaluate(() => {
    const rails = [...document.querySelectorAll('.rail')].map((r) => ({
      cls: r.className,
      label: r.getAttribute('aria-label') || '',
      kids: r.children.length,
      clientW: r.clientWidth,
      scrollW: r.scrollWidth,
      scrollable: r.scrollWidth - r.clientWidth > 4,
      overflowX: getComputedStyle(r).overflowX,
      touchAction: getComputedStyle(r).touchAction,
      static: !!r.closest('[data-rail]')?.classList.contains('rail-static'),
      h: Math.round(r.getBoundingClientRect().height),
    }));
    const secs = [...document.querySelectorAll('section')].map((s) => ({
      id: s.id || s.className,
      h: Math.round(s.getBoundingClientRect().height),
    }));
    return {
      docH: document.documentElement.scrollHeight,
      vh: innerHeight,
      screens: +(document.documentElement.scrollHeight / innerHeight).toFixed(1),
      bodyOverflowX: getComputedStyle(document.body).overflowX,
      htmlOverflowX: getComputedStyle(document.documentElement).overflowX,
      secs, rails,
    };
  });
  console.log(`\n===== ${label} — ${url}`);
  console.log(`doc ${m.docH}px / viewport ${m.vh}px = ${m.screens} schermen | overflow-x html=${m.htmlOverflowX} body=${m.bodyOverflowX}`);
  console.log('sections:', m.secs.map((s) => `${s.id}=${s.h}`).join('  '));
  for (const r of m.rails) {
    console.log(`  rail [${r.label || r.cls}] kids=${r.kids} client=${r.clientW} scroll=${r.scrollW} scrollable=${r.scrollable} static=${r.static} overflowX=${r.overflowX} touchAction=${r.touchAction} h=${r.h}`);
  }
  // probeer echt te scrollen
  const test = await page.evaluate(async () => {
    const r = document.querySelector('.rail');
    if (!r) return 'geen rail';
    const before = r.scrollLeft;
    r.scrollLeft = 400;
    await new Promise((res) => setTimeout(res, 300));
    return `scrollLeft ${before} -> ${r.scrollLeft}`;
  });
  console.log('  js-scroll test:', test);
  await ctx.close();
  return m;
}

await probe('desktop 1440', BASE, { viewport: { width: 1440, height: 900 } });
await probe('mobiel iPhone 13', BASE, { ...devices['iPhone 13'] });

// een projectpagina
const first = process.env.PROJ || '/werk/badkamer-visgraat/';
await probe('project desktop', BASE + first, { viewport: { width: 1440, height: 900 } });
await probe('project mobiel', BASE + first, { ...devices['iPhone 13'] });

await browser.close();
