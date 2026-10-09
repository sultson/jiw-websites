import { chromium } from 'playwright';
const b=await chromium.launch();
for(const [n,w,h] of [['live-gyp',1440,900],['live-gyp-m',390,844]]){
  const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:2});
  const pg=await ctx.newPage();
  await pg.goto('https://jasmflowers.jouwidealewebsite.nl/catalogue/',{waitUntil:'networkidle'});
  const el=await pg.$('#gypsophila'); await el.scrollIntoViewIfNeeded(); await pg.waitForTimeout(900);
  await el.screenshot({path:`C:/Users/nieuw/dev/claudius/playground/flower/shots/${n}.png`});
  console.log(n,'ok'); await ctx.close();
}
await b.close();
