import { webkit, devices } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const MIME={'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.json':'application/json','.xml':'text/xml','.txt':'text/plain','.mp4':'video/mp4'};
const srv=http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join('site',p);if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('x');}res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);});
await new Promise(r=>srv.listen(8907,r));
const b=await webkit.launch();
for (const [lbl,opts] of [['mob',{...devices['iPhone 13']}],['desk',{viewport:{width:1440,height:940}}]]) {
  for (const url of ['/werk/badkamer-met-betegelde-zitbank/','/']) {
    const ctx=await b.newContext(opts); const page=await ctx.newPage();
    const errs=[]; page.on('pageerror',e=>errs.push('js: '+e)); page.on('console',m=>{if(m.type()==='error')errs.push('c: '+m.text().slice(0,120));});
    await page.goto('http://127.0.0.1:8907'+url,{waitUntil:'load'});
    await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){scrollTo(0,y);await new Promise(r=>setTimeout(r,50));}});
    await page.waitForTimeout(5000);
    const mp = await page.evaluate(()=>({pins:document.querySelectorAll('.map-pin').length, canvas: !!document.querySelector('#map canvas')}));
    console.log(lbl, url, 'errors:', errs.length? errs : 'none', JSON.stringify(mp));
    if (url==='/') await page.locator('#werkgebied').screenshot({path:`work/wk-map-${lbl}.png`}).catch(e=>console.log('shot fail'));
    await ctx.close();
  }
}
await b.close(); srv.close();
