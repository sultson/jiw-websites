import { chromium, devices } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const MIME={'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4','.xml':'text/xml','.txt':'text/plain','.png':'image/png'};
const srv=http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join('site',p);if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('x');}res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);});
await new Promise(r=>srv.listen(8902,r));
const b=await chromium.launch();
for(const [name,opts] of [['mob',{...devices['iPhone 13']}],['desk',{viewport:{width:1440,height:1000}}]]){
  const ctx=await b.newContext(opts); const page=await ctx.newPage();
  await page.goto('http://127.0.0.1:8902/',{waitUntil:'load'});
  await page.waitForTimeout(600);
  console.log(name, JSON.stringify(await page.evaluate(()=>{
    const i=document.querySelector('.over-img img'); const cs=getComputedStyle(i); const r=i.getBoundingClientRect();
    return {w:Math.round(r.width),h:Math.round(r.height),ar:cs.aspectRatio,fit:cs.objectFit,pos:cs.objectPosition,
      attr:i.getAttribute('width')+'x'+i.getAttribute('height'), natW:i.naturalWidth, natH:i.naturalHeight, cur:i.currentSrc.split('/').pop()};
  })));
  await ctx.close();
}
await b.close(); srv.close();
