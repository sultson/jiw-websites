// Smoke tests. Usage: node tools/smoke.mjs [baseUrl]
// Default runs against a local static server over dist/.
import { chromium, webkit } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { varieties, company } from '../src/data.mjs';
import { LANGS } from '../src/i18n.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const DIST = path.join(ROOT, 'dist');
const EXTERNAL = process.argv[2];

const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };

let server, base = EXTERNAL;
if (!EXTERNAL) {
  server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    let f = path.join(DIST, p);
    if (p.endsWith('/')) f = path.join(f, 'index.html');
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      const alt = path.join(DIST, p, 'index.html');
      if (fs.existsSync(alt)) f = alt;
      else { res.writeHead(404, { 'content-type': 'text/html' });
             return res.end(fs.readFileSync(path.join(DIST, '404.html'))); }
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
    res.end(fs.readFileSync(f));
  });
  await new Promise(r => server.listen(0, r));
  base = `http://127.0.0.1:${server.address().port}`;
}

const PAGES = ['/', '/catalogue/', '/shipping/', '/about/', '/contact/'];
const VIEWS = [
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: 'desktop', width: 1440, height: 900 },
];

let pass = 0, fails = [];
const ok = (cond, msg) => { if (cond) pass++; else fails.push(msg); };

for (const [engineName, engine] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await engine.launch();
  for (const view of VIEWS) {
    const ctx = await browser.newContext({ viewport: { width: view.width, height: view.height },
      isMobile: view.isMobile, hasTouch: view.hasTouch, deviceScaleFactor: view.deviceScaleFactor });
    const page = await ctx.newPage();
    const tag = `${engineName}/${view.name}`;

    for (const p of PAGES) {
      const errors = [], bad = [];
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      page.on('pageerror', e => errors.push(String(e)));
      page.on('response', r => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`); });

      const res = await page.goto(base + p, { waitUntil: 'networkidle' });
      ok(res && res.ok(), `${tag} ${p} loads`);
      ok(errors.length === 0, `${tag} ${p} no console errors: ${errors.slice(0, 2).join(' | ')}`);
      ok(bad.length === 0, `${tag} ${p} no failed requests: ${bad.slice(0, 3).join(' | ')}`);

      // no horizontal overflow
      const of = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      ok(of <= 1, `${tag} ${p} no horizontal overflow (was ${of}px)`);

      // the layout viewport must still be the device width. If wide content escapes a
      // scroll container the browser silently zooms the whole page out instead of
      // showing a scrollbar, and the overflow check above still passes.
      const iw = await page.evaluate(() => innerWidth);
      ok(Math.abs(iw - view.width) <= 1,
        `${tag} ${p} layout viewport is ${view.width}px, not zoomed out (got ${iw})`);

      // exactly one h1
      const h1 = await page.locator('h1').count();
      ok(h1 === 1, `${tag} ${p} exactly one h1 (found ${h1})`);

      // Nothing may butt straight into the bottom of the page header. The contact
      // cards did: zero top padding plus a -1px pull, which on a phone read as a
      // missing margin with the card corners touching the dark band.
      const gap = await page.evaluate(() => {
        const head = document.querySelector('.phead');
        if (!head) return null;
        const next = head.nextElementSibling;
        if (!next) return null;
        const inner = next.querySelector('.wrap > *') || next;
        return Math.round(inner.getBoundingClientRect().top - head.getBoundingClientRect().bottom);
      });
      ok(gap === null || gap >= 16, `${tag} ${p} first block clears the page header (${gap}px)`);

      // walk the whole page so lazy images actually fetch, then come back to the top
      await page.evaluate(async () => {
        const step = innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          scrollTo(0, y);
          await new Promise(r => setTimeout(r, 45));
        }
        // Horizontal rails lazy-load sideways, but only while the rail is vertically on
        // screen, so bring each one into view before sweeping it. scroll-behavior:smooth
        // would swallow the jumps, so turn it off for the sweep.
        for (const rail of document.querySelectorAll('.rail')) {
          rail.scrollIntoView({ block: 'center' });
          await new Promise(r => setTimeout(r, 120));
          const prev = rail.style.scrollBehavior;
          rail.style.scrollBehavior = 'auto';
          for (let x = 0; x <= rail.scrollWidth; x += rail.clientWidth * 0.6) {
            rail.scrollLeft = x;
            await new Promise(r => setTimeout(r, 90));
          }
          rail.scrollLeft = rail.scrollWidth;
          await new Promise(r => setTimeout(r, 300));
          rail.scrollLeft = 0;
          rail.style.scrollBehavior = prev;
        }
        // Flip anything still lazy to eager before waiting. WebKit will drop or never
        // start the fetch for an image that leaves the viewport again during the sweep,
        // and this check is about whether the file exists and decodes, not about when
        // the browser chose to ask for it.
        for (const i of document.images) i.loading = 'eager';
        await new Promise(r => setTimeout(r, 150));
        await Promise.all(Array.from(document.images).filter(i => !i.complete)
          .map(i => new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 4000); })));
        scrollTo(0, 0);
      });
      await page.waitForTimeout(250);

      // all images have real dimensions and are loaded
      const imgs = await page.evaluate(() => Array.from(document.images).map(i => ({
        src: i.currentSrc || i.src, w: i.naturalWidth, h: i.naturalHeight,
        alt: i.alt, box: i.getBoundingClientRect().width })));
      const broken = imgs.filter(i => i.w === 0);
      ok(broken.length === 0, `${tag} ${p} no broken images (${broken.map(b => b.src).slice(0, 2)})`);
      const noAlt = imgs.filter(i => !i.alt);
      ok(noAlt.length === 0, `${tag} ${p} every image has alt text (${noAlt.length} missing)`);
      const zero = imgs.filter(i => i.box === 0);
      ok(zero.length === 0, `${tag} ${p} no zero-width rendered images (${zero.length})`);

      // fonts actually applied (Safari font loading regression guard)
      const fontOk = await page.evaluate(() =>
        getComputedStyle(document.querySelector('.d1') || document.body).fontFamily.includes('Instrument'));
      ok(fontOk, `${tag} ${p} display font applied`);

      // header + footer + skip link
      ok(await page.locator('header .brand').count() === 1, `${tag} ${p} header brand present`);
      ok(await page.locator('footer').count() === 1, `${tag} ${p} footer present`);
      ok(await page.locator('a.skip').count() === 1, `${tag} ${p} skip link present`);

      // brand lockup renders at a real size AND actually decoded: a broken src still
      // lays out a box, so naturalWidth is the check that matters for a logo swap.
      const logo = await page.locator('header .brand img.brand-logo').first();
      const logoBox = await logo.boundingBox();
      ok(logoBox && logoBox.width > 40, `${tag} ${p} brand logo rendered (${logoBox && Math.round(logoBox.width)})`);
      ok(await logo.evaluate(e => e.naturalWidth > 0), `${tag} ${p} brand logo loaded`);
      ok(await page.locator('footer .brand img.brand-logo').first()
        .evaluate(e => e.naturalWidth > 0), `${tag} ${p} footer logo loaded`);

      // canonical + description
      ok(await page.locator('link[rel=canonical]').count() === 1, `${tag} ${p} has canonical`);
      const desc = await page.getAttribute('meta[name=description]', 'content');
      ok(desc && desc.length > 60 && desc.length < 300, `${tag} ${p} meta description sane`);

      // no leftover template placeholders
      const body = await page.evaluate(() => document.body.innerText);
      ok(!/undefined|\[object|NaN|TODO/.test(body), `${tag} ${p} no placeholder junk in copy`);
      ok(!/\bconcept\b/i.test(body) || p === '/about/', `${tag} ${p} no stray concept wording`);

      // Dark page heads: .phead never carried .on-dark, so .lead kept its ink colour
      // and rendered dark on near-black. Guard the contrast, not the class name.
      const leadC = await page.evaluate(() => {
        const l = document.querySelector('.phead .lead');
        if (!l) return null;
        const rgba = getComputedStyle(l).color.match(/[\d.]+/g).map(Number);
        const a = rgba[3] ?? 1, bg = [21, 33, 27];
        const s = c => (c /= 255) <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
        const lum = ([r, g, b]) => .2126 * s(r) + .7152 * s(g) + .0722 * s(b);
        const L1 = lum(rgba.slice(0, 3).map((v, i) => v * a + bg[i] * (1 - a))), L2 = lum(bg);
        return (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
      });
      if (leadC !== null) ok(leadC >= 4.5,
        `${tag} ${p} page-head lead readable on the dark panel (${leadC.toFixed(1)}:1)`);

      // Every .link ends in an arrow. The SVG has no width attribute, so without a CSS
      // rule it collapsed to 0x0 as a flex child, and the text broke into stacked words
      // when the row was squeezed ("All / 15 / lines").
      const links = await page.evaluate(() => [...document.querySelectorAll('.link')].map(l => {
        const s = l.querySelector('svg');
        return { t: l.textContent.trim().slice(0, 30), h: l.getBoundingClientRect().height,
          sw: s ? s.getBoundingClientRect().width : -1 };
      }));
      for (const l of links) {
        ok(l.sw === -1 || l.sw >= 12, `${tag} ${p} link arrow rendered: "${l.t}" (${l.sw}px)`);
        ok(l.h < 46, `${tag} ${p} link stays on one line: "${l.t}" (${Math.round(l.h)}px tall)`);
      }

      // primary CTA reachable on first screen (mobile)
      if (view.name === 'mobile' && p === '/') {
        const cta = await page.locator('.hero-btns .btn').first().boundingBox();
        ok(cta && cta.y + cta.height < view.height,
          `${tag} hero CTA above the fold (bottom ${cta && Math.round(cta.y + cta.height)} of ${view.height})`);
      }

      page.removeAllListeners();
    }

    // ---- catalogue behaviour ----
    await page.goto(base + '/catalogue/', { waitUntil: 'networkidle' });
    const cards = await page.locator('.cat-item').count();
    ok(cards === varieties.length, `${tag} catalogue shows all ${varieties.length} lines (${cards})`);

    // Second photo on a catalogue line (gypsophila: the tinted bunch under "Dyed to
    // order"). Checks it decoded, not just that the markup is there - it sits below the
    // fold in a lazy-loaded card, which is exactly where a broken src goes unnoticed.
    for (const v of varieties.filter(x => x.img2)) {
      const fig = page.locator(`#${v.slug} .cat-x`);
      ok(await fig.count() === 1, `${tag} ${v.slug} carries its second photo`);
      await fig.scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
      const im = fig.locator('img');
      ok(await im.evaluate(e => e.complete && e.naturalWidth > 0),
        `${tag} ${v.slug} second photo loads`);
      const box = await fig.boundingBox();
      const card = await page.locator(`#${v.slug}`).boundingBox();
      ok(box && card && box.x >= card.x - 1 && box.x + box.width <= card.x + card.width + 1,
        `${tag} ${v.slug} second photo sits inside its card`);
      ok((await fig.locator('figcaption').innerText()).trim().length > 0,
        `${tag} ${v.slug} second photo is captioned`);
    }

    // filter
    await page.locator('[data-filter="Rose"]').click();
    await page.waitForTimeout(120);
    const visRose = await page.locator('.cat-item:not(.hide)').count();
    const expectRose = varieties.filter(v => v.group === 'Rose').length;
    ok(visRose === expectRose, `${tag} rose filter shows ${expectRose} (got ${visRose})`);
    await page.locator('[data-filter="All"]').click();
    await page.waitForTimeout(120);
    ok(await page.locator('.cat-item:not(.hide)').count() === varieties.length,
      `${tag} All filter restores every line`);

    // quote basket
    ok(!(await page.locator('#basket').evaluate(e => e.classList.contains('show'))),
      `${tag} basket hidden when empty`);
    await page.locator('[data-add="solidago"]').click();
    await page.locator('[data-add="limonium"]').click();
    await page.waitForTimeout(220);
    ok(await page.locator('#basketCount').innerText() === '2', `${tag} basket counts 2`);
    ok((await page.locator('#basketText').innerText()).includes('Solidago'), `${tag} basket names the line`);
    ok(await page.locator('#basket').evaluate(e => e.classList.contains('show')), `${tag} basket bar shows`);
    const basketBox = await page.locator('#basket').boundingBox();
    ok(basketBox && basketBox.y + basketBox.height <= view.height + 2,
      `${tag} basket bar sits on screen`);

    // basket carries to the contact form
    await page.goto(base + '/contact/', { waitUntil: 'networkidle' });
    const picked = await page.locator('[data-pick][aria-pressed="true"]').count();
    ok(picked === 2, `${tag} contact form pre-selects the 2 basket lines (got ${picked})`);

    // form validation blocks empty submit
    await page.locator('[data-send="wa"]').click();
    await page.waitForTimeout(150);
    const nameBorder = await page.locator('#f-name').evaluate(e => e.style.borderColor);
    ok(!!nameBorder, `${tag} empty form is rejected`);

    // filled form builds a message
    await page.fill('#f-name', 'Test Buyer');
    await page.fill('#f-company', 'Bloem BV');
    await page.fill('#f-email', 'test@example.com');
    const msg = await page.evaluate(() => {
      const $$ = s => Array.from(document.querySelectorAll(s));
      const f = document.getElementById('quoteForm');
      const v = n => f.elements[n] ? f.elements[n].value.trim() : '';
      const c = $$('[data-pick][aria-pressed="true"]').map(p => p.textContent.trim());
      return [v('name'), v('company'), v('email'), c.join(', ')].join('|');
    });
    ok(msg.includes('Test Buyer') && msg.includes('Solidago'),
      `${tag} enquiry text carries name and selected lines`);

    // clear basket
    await page.goto(base + '/catalogue/', { waitUntil: 'networkidle' });
    await page.locator('#basketClear').click();
    await page.waitForTimeout(180);
    ok(await page.locator('#basketCount').innerText() === '0', `${tag} basket clears`);

    // ---- rail scrolls (the m-techno regression) ----
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    const before = await page.locator('#r1').evaluate(e => e.scrollLeft);
    await page.locator('[data-rail-next="r1"]').click();
    await page.waitForTimeout(700);
    const after = await page.locator('#r1').evaluate(e => e.scrollLeft);
    ok(after > before, `${tag} home rail actually scrolls (${before} -> ${after})`);

    // ---- mobile nav ----
    if (view.name === 'mobile') {
      ok(!(await page.locator('#mnav').evaluate(e => e.classList.contains('open'))),
        `${tag} mobile menu starts closed`);
      await page.locator('.burger').click();
      await page.waitForTimeout(160);
      ok(await page.locator('#mnav').evaluate(e => e.classList.contains('open')),
        `${tag} mobile menu opens`);
      const navLink = await page.locator('#mnav a').first().boundingBox();
      ok(navLink && navLink.height >= 40, `${tag} mobile nav links are tappable`);
      // `.mnav a` used to beat `.btn` on specificity and zero the drawer CTA's side
      // padding, so its label sat hard against the left edge of the pill.
      const drawerBtn = await page.locator('#mnav .btn').evaluate(el => {
        const cs = getComputedStyle(el);
        return { pl: parseFloat(cs.paddingLeft), pr: parseFloat(cs.paddingRight), display: cs.display };
      });
      ok(drawerBtn.pl >= 16 && drawerBtn.pr >= 16,
        `${tag} drawer CTA keeps its side padding (${drawerBtn.pl}/${drawerBtn.pr})`);
      ok(drawerBtn.display.includes('flex'), `${tag} drawer CTA is still a pill (${drawerBtn.display})`);
      await page.locator('.burger').click();
      // The switcher lives in the top bar on a phone, not behind the burger.
      const langBox = await page.locator('.hdr-cta .lang').boundingBox();
      const burgerBox = await page.locator('.burger').boundingBox();
      ok(langBox && langBox.width > 0, `${tag} language switcher is visible in the top bar`);
      ok(langBox && burgerBox && langBox.x + langBox.width <= burgerBox.x + 1,
        `${tag} language switcher sits left of the burger`);
      ok(await page.locator('#mnav .lang').count() === 0,
        `${tag} no duplicate switcher left in the drawer`);
    }

    // ---- hero: fact strip clears the fold, market chip rotates ----
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    const strip = await page.evaluate(() => {
      const s = document.querySelector('.hero-strip').getBoundingClientRect();
      const h = document.querySelector('.hero').getBoundingClientRect();
      return Math.round(h.bottom - s.bottom);
    });
    ok(strip >= 18, `${tag} fact strip has room under it (${strip}px)`);

    const chip = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('#mkt > span'));
      return { n: all.length, on: all.filter(s => s.classList.contains('on')).length,
        flags: all.filter(s => s.querySelector('svg')).length,
        first: all[0] && all[0].textContent.trim(),
        w: document.querySelector('#mkt').getBoundingClientRect().width };
    });
    ok(chip.n > 1, `${tag} market chip has a list to cycle (${chip.n})`);
    ok(chip.on === 1, `${tag} exactly one market chip is showing (${chip.on})`);
    ok(chip.flags === chip.n, `${tag} every market chip carries a flag (${chip.flags}/${chip.n})`);
    // One grid cell for all of them, so the line cannot reflow as it rotates.
    await page.waitForTimeout(2700);
    const after2 = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('#mkt > span'));
      return { i: all.findIndex(s => s.classList.contains('on')),
        w: document.querySelector('#mkt').getBoundingClientRect().width };
    });
    ok(after2.i !== 0, `${tag} market chip advanced (index ${after2.i})`);
    ok(Math.abs(after2.w - chip.w) < 1, `${tag} market chip does not resize as it rotates`);

    // ---- sticky CTA appears after hero, hides at the quote band ----
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    ok(!(await page.locator('#stick').evaluate(e => e.classList.contains('show'))),
      `${tag} sticky CTA hidden at top`);
    await page.evaluate(() => scrollTo(0, document.querySelector('.hero').offsetHeight + 700));
    await page.waitForTimeout(320);
    ok(await page.locator('#stick').evaluate(e => e.classList.contains('show')),
      `${tag} sticky CTA appears past the hero`);
    await page.evaluate(() => document.getElementById('quote').scrollIntoView());
    await page.waitForTimeout(320);
    ok(!(await page.locator('#stick').evaluate(e => e.classList.contains('show'))),
      `${tag} sticky CTA hides at the quote band`);

    // ---- availability table ----
    await page.goto(base + '/catalogue/', { waitUntil: 'networkidle' });
    const rows = await page.locator('.avail tbody tr').count();
    ok(rows === varieties.length, `${tag} availability table has a row per line`);
    const cellH = await page.locator('.avail .a-cell').first().boundingBox();
    ok(cellH && cellH.height > 10, `${tag} availability cells have height`);

    // ---- 404 ----
    const r404 = await page.goto(base + '/nope/', { waitUntil: 'domcontentloaded' });
    ok(r404.status() === 404, `${tag} unknown path returns 404`);
    ok((await page.locator('h1').innerText()).length > 3, `${tag} 404 page has a heading`);

    await ctx.close();
  }
  await browser.close();
}

/* ---- languages ----
   Every page in every language, loaded for real in both engines. Cheaper than folding
   the languages into PAGES above (that would triple the deep per-page sweep) but it
   still catches the things that actually break: a page that does not exist, a switcher
   that drops you on the home page, a canonical pointing at the English copy, and
   English copy left standing on a translated page. */
{
  const browser = await chromium.launch();
  const page = await browser.newPage();
  // One sentence per language that has to be on the home page, and must not be on the others.
  // Was the old hero strap, which the client cut. The positioning line replaces it:
  // it is the one sentence guaranteed to be on the home page in every language.
  const PROBE = { en: 'Consistent quality. Reliable supply.',
    nl: 'Constante kwaliteit. Betrouwbare aanvoer.',
    de: 'Gleichbleibende Qualität. Verlässliche Versorgung.' };

  for (const { code } of LANGS) {
    const dir = code === 'en' ? '' : '/' + code;
    for (const p of PAGES) {
      const res = await page.goto(base + dir + p, { waitUntil: 'domcontentloaded' });
      ok(res && res.ok(), `i18n ${code}${p} loads`);
      ok(await page.getAttribute('html', 'lang') === code, `i18n ${code}${p} html lang is ${code}`);
      const canon = await page.getAttribute('link[rel=canonical]', 'href');
      ok(canon && canon.endsWith(dir + p), `i18n ${code}${p} canonical is the ${code} url (${canon})`);
      const alts = await page.locator('link[rel=alternate][hreflang]').count();
      ok(alts === LANGS.length + 1, `i18n ${code}${p} has hreflang for every language + x-default`);
      // Internal links must stay inside the language.
      const strays = await page.evaluate(l => Array.from(document.querySelectorAll('main a[href^="/"]'))
        .map(a => a.getAttribute('href'))
        .filter(h => !/^\/(i|f)\//.test(h) && !/\.(css|js|svg)$/.test(h))
        .filter(h => !h.startsWith('/' + l + '/')), code);
      if (code !== 'en') {
        ok(strays.length === 0, `i18n ${code}${p} no links escaping to English (${strays.slice(0, 3)})`);
      }
      // The switcher offers every language and keeps you on this page.
      const sw = await page.evaluate(() => Array.from(document.querySelectorAll('.hdr-cta .lang a'))
        .map(a => [a.dataset.lang, a.getAttribute('href')]));
      ok(sw.length === LANGS.length, `i18n ${code}${p} switcher lists every language`);
      for (const [c, href] of sw) {
        const want = (c === 'en' ? '' : '/' + c) + p;
        ok(href === want, `i18n ${code}${p} switch to ${c} stays on the page (${href})`);
      }
    }
    // No other language's headline is showing on this home page.
    await page.goto(base + dir + '/', { waitUntil: 'domcontentloaded' });
    const body = await page.evaluate(() => document.body.innerText);
    ok(body.includes(PROBE[code]), `i18n ${code} home is written in ${code}`);
    for (const [other, probe] of Object.entries(PROBE)) {
      if (other !== code) ok(!body.includes(probe), `i18n ${code} home has no ${other} copy left`);
    }
    // The download button must hand over that language's PDF, and it must exist.
    const pdf = await page.getAttribute('a[href$=".pdf"]', 'href');
    ok(pdf === dir + '/jasm-flowers-catalogue.pdf', `i18n ${code} PDF link is localised (${pdf})`);
    ok((await page.request.get(base + pdf)).ok(), `i18n ${code} PDF downloads`);
  }

  // Round trip: pick a language from a deep page and land on the same deep page.
  await page.goto(base + '/shipping/', { waitUntil: 'domcontentloaded' });
  await page.locator('.hdr-cta .lang a[data-lang="de"]').click();
  await page.waitForLoadState('domcontentloaded');
  ok(new URL(page.url()).pathname === '/de/shipping/',
    `i18n switching from /shipping/ lands on /de/shipping/ (got ${new URL(page.url()).pathname})`);
  await page.locator('.hdr-cta .lang a[data-lang="nl"]').click();
  await page.waitForLoadState('domcontentloaded');
  ok(new URL(page.url()).pathname === '/nl/shipping/', 'i18n de -> nl keeps the page');

  // The enquiry the buyer sends must be written in the language they were reading.
  await page.goto(base + '/de/contact/', { waitUntil: 'networkidle' });
  await page.fill('#f-name', 'Test');
  await page.fill('#f-company', 'Blumen GmbH');
  await page.fill('#f-email', 'test@example.com');
  const built = await page.evaluate(() => (window.__T || {}).fCompany);
  ok(built === 'Firma', `i18n German form labels reach the runtime (${built})`);

  await browser.close();
}

// ---- content guards ----
const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
ok(/Badkamer|loodgieter/i.test(html) === false, 'no copy leaked from another project');
ok(html.includes(company.email), 'contact email present on home');
ok(fs.existsSync(path.join(DIST, 'sitemap.xml')), 'sitemap exists');
ok(fs.existsSync(path.join(DIST, 'robots.txt')), 'robots exists');
const sm = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
ok((sm.match(/<loc>/g) || []).length === 5 * LANGS.length,
  'sitemap lists 5 indexable pages per language');
ok(fs.readFileSync(path.join(DIST, 'catalogue', 'index.html'), 'utf8')
  .includes('Solidago'), 'catalogue mentions Solidago');
// Client, 9 Oct 2026: they tint gypsophila and roses, not solidago. The question is the
// last FAQ, so it is on the shipping page (full list) and not on the home page, which
// takes the first six - checked in all three languages, body copy and FAQ JSON-LD.
for (const { code } of LANGS) {
  const f = path.join(DIST, code === 'en' ? '' : code, 'shipping', 'index.html');
  const h = fs.readFileSync(f, 'utf8');
  const m = h.match(/[^<>"]*(?:Tinting is done|Getönt wird|Het tinten gebeurt)[^<>"]*/g) || [];
  ok(m.length >= 2, `${code} shipping: tinting answer present twice, copy + JSON-LD (${m.length})`);
  ok(m.every(s => !/solidago/i.test(s)), `${code} shipping: tinting answer does not name solidago`);
}
// every variety has an image on disk, second photos included
for (const v of varieties) {
  for (const key of [v.img, v.img2].filter(Boolean)) {
    ok(fs.readdirSync(path.join(DIST, 'i')).some(f => f.startsWith(key + '-')),
      `image built for ${v.slug}${key === v.img2 ? ' (second photo)' : ''}`);
  }
}

if (server) server.close();

console.log(`\n${pass} checks passed, ${fails.length} failed`);
if (fails.length) { fails.forEach(f => console.log('  FAIL ' + f)); process.exit(1); }
