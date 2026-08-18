// Screenshot + meting van de "Over Mike"-sectie, mobiel en desktop, in Chromium en WebKit.
// Controle op: staat de foto er, is hij niet 0 hoog, en valt er niemand buiten het kader.
import { chromium, webkit, devices } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const MIME={'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4','.xml':'text/xml','.txt':'text/plain','.png':'image/png'};
const srv=http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join('site',p);if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('x');}res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);});
await new Promise(r=>srv.listen(8901,r));
const tag=process.argv[2]||'a';
for(const [eng,launch] of [['cr',chromium],['wk',webkit]]){
  const b=await launch.launch();
  for(const [name,opts] of [['mob',{...devices['iPhone 13']}],['desk',{viewport:{width:1440,height:1000}}]]){
    const ctx=await b.newContext(opts); const page=await ctx.newPage();
    await page.goto('http://127.0.0.1:8901/',{waitUntil:'load'});
    await page.evaluate(()=>document.querySelector('#over').scrollIntoView());
    await page.waitForTimeout(900);
    await page.locator('#over').screenshot({path:`work/over-${tag}-${eng}-${name}.png`});
    const m=await page.evaluate(()=>{const i=document.querySelector('.over-img img');const r=i.getBoundingClientRect();
      return {src:i.currentSrc.split('/').pop(),box:Math.round(r.width)+'x'+Math.round(r.height),nat:i.naturalWidth+'x'+i.naturalHeight,ok:i.complete&&i.naturalWidth>0};});
    console.log(eng,name,JSON.stringify(m));
    await ctx.close();
  }
  await b.close();
}
srv.close();
