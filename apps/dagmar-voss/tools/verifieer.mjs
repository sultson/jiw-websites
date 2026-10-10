/* Loopt het gedrag na dat alleen in een browser te zien is: het menupaneel,
   de onderbalk die onder de hero omhoog komt, en de kaart die op een tik
   mapbox-gl ophaalt. Schrijft schermafdrukken in shots/.
   Run: pnpm --filter @jiw/dagmar-voss verifieer */
import { chromium } from "playwright";
import { serveDist, shotPad } from "./serve.mjs";

const { url, stop } = await serveDist();
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:390,height:844}, deviceScaleFactor:3 });
await p.goto(url + "/", { waitUntil:"networkidle" });
await p.evaluate(()=>document.fonts.ready);

await p.locator('.site-header').screenshot({ path: await shotPad('v-header.png') });

// menu open
await p.click('#navToggle'); await p.waitForTimeout(350);
console.log('MENU', JSON.stringify(await p.evaluate(()=>{
  const r=x=>{const b=document.querySelector(x).getBoundingClientRect();return {x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width)}};
  return { nav:r('#siteNav'), toggle:r('#navToggle'), vw:innerWidth };
})));
await p.screenshot({ path: await shotPad('v-menu.png') });
await p.keyboard.press('Escape'); await p.waitForTimeout(300);
console.log('ESC sluit:', await p.evaluate(()=>document.getElementById('navToggle').getAttribute('aria-expanded')));

// onderbalk: verborgen bovenaan, zichtbaar onder de hero
const balk = async () => p.evaluate(()=>{
  const el=document.querySelector('.mobile-cta'); const r=el.getBoundingClientRect();
  return { zichtbaar: el.classList.contains('is-zichtbaar'), top: Math.round(r.top), vh: innerHeight };
});
console.log('BALK bovenaan', JSON.stringify(await balk()));
await p.evaluate(()=>window.scrollTo(0, 1400)); await p.waitForTimeout(500);
console.log('BALK onder hero', JSON.stringify(await balk()));

// citaat + kaarten
const q = p.locator('.quote-wrap').first();
await q.scrollIntoViewIfNeeded(); await p.waitForTimeout(900);
await q.screenshot({ path: await shotPad('v-quote.png') });
const c = p.locator('.card').first();
await c.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
await c.screenshot({ path: await shotPad('v-card.png') });
await p.locator('.site-footer').scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
await p.locator('.site-footer').screenshot({ path: await shotPad('v-footer.png') });

// contactpagina / kaart
const p2 = await b.newPage({ viewport:{width:390,height:844}, deviceScaleFactor:2 });
await p2.goto(url + "/contact/", { waitUntil:"networkidle" });
await p2.locator('.kaart').scrollIntoViewIfNeeded(); await p2.waitForTimeout(1200);
await p2.locator('.kaart').screenshot({ path: await shotPad('v-kaart.png') });
await p2.click('.kaart-aan'); await p2.waitForTimeout(5000);
console.log('KAART interactief:', await p2.evaluate(()=>!!document.querySelector('.mapboxgl-canvas')));
await p2.locator('.kaart').screenshot({ path: await shotPad('v-kaart-aan.png') });
await b.close(); await stop();
