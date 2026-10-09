import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const DIST='C:/Users/nieuw/dev/claudius/playground/flower/dist';
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const s=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=path.join(DIST,p);if(p.endsWith('/'))f=path.join(f,'index.html');if(!fs.existsSync(f)){r.writeHead(404);return r.end('x')}r.writeHead(200,{'content-type':T[path.extname(f)]||'application/octet-stream'});r.end(fs.readFileSync(f))});
await new Promise(r=>s.listen(0,r)); const base=`http://127.0.0.1:${s.address().port}`;
const b=await chromium.launch();
for(const lang of ['','/nl','/de']) for(const w of [360,390,430,768,820,1024,1280,1440,1920]){
  const ctx=await b.newContext({viewport:{width:w,height:900}}); const pg=await ctx.newPage();
  await pg.goto(base+lang+'/catalogue/',{waitUntil:'networkidle'});
  const m=await pg.evaluate(()=>{
    const c=document.querySelector('#gypsophila'),f=c.querySelector('.cat-x'),
      cap=f.querySelector('figcaption'),im=f.querySelector('img');
    const a=c.getBoundingClientRect(),bb=f.getBoundingClientRect(),cc=cap.getBoundingClientRect(),ii=im.getBoundingClientRect();
    return {over:document.documentElement.scrollWidth>innerWidth?document.documentElement.scrollWidth:0,
      figIn:+(bb.left-a.left).toFixed(1)>=-0.5&&+(a.right-bb.right).toFixed(1)>=-0.5,
      capRight:+(a.right-cc.right).toFixed(1), capLines:Math.round(cc.height/parseFloat(getComputedStyle(cap).lineHeight)),
      imgW:Math.round(ii.width), imgH:Math.round(ii.height), nat:im.naturalWidth};});
  console.log((lang||'/en').padEnd(4), String(w).padStart(5), JSON.stringify(m));
  await ctx.close();
}
await b.close(); s.close();
