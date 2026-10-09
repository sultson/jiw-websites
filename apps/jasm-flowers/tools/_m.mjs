import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const DIST='C:/Users/nieuw/dev/claudius/playground/flower/dist';
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.mp4':'video/mp4'};
const server=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=path.join(DIST,p);if(p.endsWith('/'))f=path.join(f,'index.html');if(!fs.existsSync(f)){r.writeHead(404);return r.end('x')}r.writeHead(200,{'content-type':T[path.extname(f)]||'application/octet-stream'});r.end(fs.readFileSync(f))});
await new Promise(r=>server.listen(0,r));
const b=await chromium.launch(); const page=await b.newPage({viewport:{width:1380,height:900}});
await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});
await page.evaluate(()=>document.querySelector('.trip').scrollIntoView({block:'center'}));
await page.waitForTimeout(800);
console.log(await page.evaluate(()=>{
  const fig=document.querySelector('.trip figure.v'), v=fig.querySelector('video');
  const cap=fig.querySelector('figcaption'), b=fig.querySelector('figcaption b');
  const fr=fig.getBoundingClientRect(), vr=v.getBoundingClientRect(), br=b.getBoundingClientRect();
  const imgs=[...document.querySelectorAll('.trip img')].map(i=>({src:i.currentSrc.split('/').pop(),w:i.naturalWidth}));
  return {fig:[fr.width,fr.height],video:[vr.width,vr.height],vLeft:vr.left-fr.left,vTop:vr.top-fr.top,
    bLeft:br.left-fr.left, bTop:br.top-fr.top, radius:getComputedStyle(fig).borderTopLeftRadius, imgs};
}));
await b.close(); server.close();
