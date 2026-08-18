import { chromium, devices } from 'playwright';
const B='https://m-techno-service-concept.jouwidealewebsite.nl/werk/terrazzo-met-vrijstaand-bad/';
const br=await chromium.launch();
for (const [lbl,opts] of [['desktop',{viewport:{width:1440,height:900}}],['mobiel',{...devices['iPhone 13']}]]) {
  const c=await br.newContext(opts); const p=await c.newPage();
  await p.goto(B,{waitUntil:'load',timeout:60000});
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,50));}scrollTo(0,0);});
  await p.waitForTimeout(800);
  const m=await p.evaluate(()=>({h:document.documentElement.scrollHeight,vh:innerHeight,
    blocks:[...document.querySelectorAll('main > *')].map(s=>`${s.className||s.tagName}=${Math.round(s.getBoundingClientRect().height)}`)}));
  console.log(lbl, m.h+'px /', m.vh, '=', (m.h/m.vh).toFixed(1),'schermen');
  console.log('  ', m.blocks.join('  '));
  await c.close();
}
await br.close();
