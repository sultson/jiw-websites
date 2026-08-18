import { chromium, webkit } from 'playwright';
const BASE = 'https://m-techno-service.jouwidealewebsite.nl';
for (const v of [
  { tag: 'desk', engine: chromium, vp: { width: 1440, height: 900 }, mobile: false },
  { tag: 'mob', engine: webkit, vp: { width: 390, height: 664 }, mobile: true },
]) {
  const b = await v.engine.launch();
  const ctx = await b.newContext({ viewport: v.vp, deviceScaleFactor: 2, isMobile: v.mobile, hasTouch: v.mobile });
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(String(e).slice(0, 100)));
  pg.on('response', r => r.status() >= 400 && errs.push(r.status() + ' ' + r.url().split('/').pop()));
  await pg.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await pg.waitForTimeout(3000);
  const mid = await pg.evaluate(() => {
    const vd = document.querySelector('.hero-vid');
    return vd ? { live: vd.classList.contains('is-live'), t: +vd.currentTime.toFixed(2), paused: vd.paused } : 'removed';
  });
  await pg.screenshot({ path: `work/gen/live-${v.tag}-mid.png`, animations: 'disabled', timeout: 15000 }).catch(e => errs.push('shot1 ' + e.message.slice(0, 40)));
  await pg.waitForTimeout(5000);
  const end = await pg.evaluate(() => {
    const vd = document.querySelector('.hero-vid');
    const hero = document.querySelector('.hero');
    return {
      vid: vd ? { live: vd.classList.contains('is-live'), t: +vd.currentTime.toFixed(2), ended: vd.ended } : 'removed',
      heroH: Math.round(hero.getBoundingClientRect().height),
      chip: getComputedStyle(document.querySelector('.trust-chip')).display,
      strip: [...document.querySelectorAll('.strip-in span')].filter(s => getComputedStyle(s).display !== 'none').length,
      over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  await pg.screenshot({ path: `work/gen/live-${v.tag}-end.png`, animations: 'disabled', timeout: 15000 }).catch(e => errs.push('shot2 ' + e.message.slice(0, 40)));
  console.log(v.tag, 'mid=' + JSON.stringify(mid), 'end=' + JSON.stringify(end), errs.length ? 'ERR ' + errs.join('|') : 'clean');
  await b.close();
}
