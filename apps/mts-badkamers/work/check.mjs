// Meet paginahoogte + railwerking. BASE=http://localhost:8788 voor de lokale build.
import { chromium, devices } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const PATHS = (process.env.PATHS || '/|/werk/terrazzo-met-vrijstaand-bad/|/werk/hexagon-badkamer-en-dakkapel/').split('|');
const browser = await chromium.launch();

for (const p of PATHS) {
  for (const [lbl, opts] of [
    ['desktop', { viewport: { width: 1440, height: 900 } }],
    ['mobiel ', { ...devices['iPhone 13'] }],
  ]) {
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    page.on('pageerror', (e) => errs.push(String(e)));
    await page.goto(BASE + p, { waitUntil: 'load', timeout: 60000 });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 45)); }
      scrollTo(0, 0);
    });
    await page.waitForTimeout(700);
    const m = await page.evaluate(() => ({
      h: document.documentElement.scrollHeight,
      vh: innerHeight,
      overflow: document.documentElement.scrollWidth > innerWidth + 1
        ? `${document.documentElement.scrollWidth} > ${innerWidth}` : 'nee',
      secs: [...document.querySelectorAll('main section')].map((s) => `${s.id || s.className.split(' ').pop()}=${Math.round(s.getBoundingClientRect().height)}`),
      rails: [...document.querySelectorAll('[data-rail]')].map((w) => {
        const r = w.querySelector('.rail');
        const nx = w.querySelector('.rail-next');
        return { scrollable: r.scrollWidth - r.clientWidth > 4, arrow: nx && getComputedStyle(nx).display !== 'none' && !nx.hidden, snap: getComputedStyle(r.children[0]).scrollSnapAlign };
      }),
    }));
    const bad = m.rails.filter((r) => r.scrollable && !r.arrow).length;
    console.log(`${lbl} ${p}\n   ${m.h}px / ${m.vh} = ${(m.h / m.vh).toFixed(1)} schermen | h-overflow: ${m.overflow} | rails: ${m.rails.length}, scrollbaar ${m.rails.filter((r) => r.scrollable).length}, zonder pijl ${bad}, snap=${m.rails[0]?.snap}`);
    console.log(`   ${m.secs.join('  ')}`);
    if (errs.length) console.log('   JS-FOUTEN:', errs.slice(0, 3));
    await ctx.close();
  }
}
await browser.close();
