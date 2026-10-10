/* Dezelfde controle als verifieer.mjs, maar tegen de live site in plaats van
   tegen dist/. Run na een deploy: pnpm --filter @jiw/dagmar-voss live */
import { chromium } from "playwright";
import { shotPad } from "./serve.mjs";
const b = await chromium.launch({ args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const U = "https://dagmarvoss-concept.jouwidealewebsite.nl";
const p = await b.newPage({ viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true });
await p.goto(U + "/", { waitUntil:"networkidle" });
await p.click('#navToggle'); await p.waitForTimeout(350);
console.log('menu:', JSON.stringify(await p.evaluate(()=>{const r=document.getElementById('siteNav').getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width)}})));
await p.keyboard.press('Escape'); await p.waitForTimeout(250);
console.log('balk bovenaan zichtbaar:', await p.evaluate(()=>document.querySelector('.mobile-cta').classList.contains('is-zichtbaar')));
await p.evaluate(()=>scrollTo(0,1500)); await p.waitForTimeout(500);
console.log('balk onder hero zichtbaar:', await p.evaluate(()=>document.querySelector('.mobile-cta').classList.contains('is-zichtbaar')));
await p.goto(U + "/contact/", { waitUntil:"networkidle" });
await p.locator('.kaart').scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
await p.click('.kaart-aan');
console.log('kaart interactief:', await p.waitForFunction(()=>window.__kaartGeladen===true,null,{timeout:25000}).then(()=>true).catch(()=>false));
await p.waitForTimeout(2500);
await p.locator('.kaart').screenshot({ path: await shotPad('live-kaart.png') });
await b.close();
