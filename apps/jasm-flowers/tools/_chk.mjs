import { chromium } from 'playwright';
const B='https://jasmflowers.jouwidealewebsite.nl';
const b=await chromium.launch();
for(const [w,h,tag] of [[1440,900,'d'],[390,844,'m']]){
  const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});
  for(const [path,name] of [['/','home'],['/about/','about'],['/contact/','contact']]){
    await p.goto(B+path,{waitUntil:'networkidle'});
    await p.evaluate(()=>new Promise(r=>{let y=0;const i=setInterval(()=>{window.scrollTo(0,y);y+=600;if(y>document.body.scrollHeight){clearInterval(i);window.scrollTo(0,0);r();}},40);}));
    await p.waitForTimeout(600);
    await p.screenshot({path:`shots/chk-${name}-${tag}.png`,fullPage:true});
  }
  await p.close();
}
await b.close(); console.log('ok');
