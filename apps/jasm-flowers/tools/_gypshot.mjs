import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const DIST = 'C:/Users/nieuw/dev/claudius/playground/flower/dist';
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=path.join(DIST,p);if(p.endsWith('/'))f=path.join(f,'index.html');if(!fs.existsSync(f)){r.writeHead(404);return r.end('x')}r.writeHead(200,{'content-type':T[path.extname(f)]||'application/octet-stream'});r.end(fs.readFileSync(f))});
await new Promise(r=>server.listen(0,r));
const base=`http://127.0.0.1:${server.address().port}`;
const b=await chromium.launch();
for(const [name,w,h] of [['gyp-desk',1440,900],['gyp-m',390,844],['gyp-360',360,780],['gyp-tab',820,1100]]){
  const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:2});
  const pg=await ctx.newPage();
  await pg.goto(base+'/catalogue/',{waitUntil:'networkidle'});
  const el=await pg.$('#gypsophila');
  await el.scrollIntoViewIfNeeded(); await pg.waitForTimeout(700);
  await el.screenshot({path:`C:/Users/nieuw/dev/claudius/playground/flower/shots/${name}.png`});
  // overflow check: figure inside its card
  const m=await pg.evaluate(()=>{const c=document.querySelector('#gypsophila'),f=document.querySelector('#gypsophila .cat-x');
    if(!f) return 'NO FIGURE'; const a=c.getBoundingClientRect(),bb=f.getBoundingClientRect();
    return {left:+(bb.left-a.left).toFixed(1),right:+(a.right-bb.right).toFixed(1),figW:+bb.width.toFixed(1),figH:+bb.height.toFixed(1)};});
  console.log(name,w+'x'+h,JSON.stringify(m));
  await ctx.close();
}
await b.close(); server.close();
