import { chromium, webkit, devices } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const MIME={'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4','.xml':'text/xml','.txt':'text/plain','.png':'image/png','.woff2':'font/woff2','.json':'application/json'};
const srv=http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join('site',p);if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('x');}res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);});
await new Promise(r=>srv.listen(8901,r));
const B='http://127.0.0.1:8901';
const b=await chromium.launch();
for (const [lbl,opts] of [['desk',{viewport:{width:1440,height:940}}],['mob',{...devices['iPhone 13']}]]) {
  const ctx=await b.newContext(opts); const page=await ctx.newPage();
  const errs=[]; page.on('pageerror',e=>errs.push(String(e)));
  page.on('console',m=>{ if(m.type()==='error') errs.push('console: '+m.text()); });
  await page.goto(B+'/',{waitUntil:'networkidle'});
  await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}scrollTo(0,0);});
  await page.waitForTimeout(2500);
  await page.screenshot({path:`work/v2-${lbl}-full.png`,fullPage:true});
  for (const [n,sel] of [['hero','.hero'],['rev','#reviews'],['map','#werkgebied'],['over','#over']]) {
    const el=await page.$(sel); if(el) await el.screenshot({path:`work/v2-${lbl}-${n}.png`}).catch(()=>{});
  }
  console.log(lbl,'errors:',errs.length?errs:'none','h=',await page.evaluate(()=>document.body.scrollHeight));
  await ctx.close();
}
await b.close(); srv.close();
