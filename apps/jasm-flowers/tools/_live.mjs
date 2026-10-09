import { chromium } from 'playwright';
const b = await chromium.launch();
const jobs = [['d','https://jasmflowers.jouwidealewebsite.nl/',1440,900],['m','https://jasmflowers.jouwidealewebsite.nl/',390,844]];
for (const [n,u,w,h] of jobs){
  const c = await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
  const p = await c.newPage();
  await p.goto(u,{waitUntil:'networkidle'});
  await p.waitForTimeout(900);
  await p.screenshot({path:`shots/live-${n}.png`});
  await c.close();
}
await b.close();
console.log('ok');
