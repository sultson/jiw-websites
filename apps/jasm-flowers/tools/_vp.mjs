import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const DIST='dist';const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=path.join(DIST,p);if(p.endsWith('/'))f=path.join(f,'index.html');if(!fs.existsSync(f)){r.writeHead(404);return r.end('x')}r.writeHead(200,{'content-type':T[path.extname(f)]||'application/octet-stream'});r.end(fs.readFileSync(f))});
await new Promise(r=>srv.listen(0,r)); const base=`http://127.0.0.1:${srv.address().port}`;
const b=await chromium.launch();
const route=process.argv[2]||'/', tag=process.argv[3]||'vp', y=Number(process.argv[4]||0);
for(const [n,w,h] of [[tag+'-d',1440,900],[tag+'-m',390,844]]){
  const c=await b.newContext({viewport:{width:w,height:h}});const p=await c.newPage();
  await p.goto(base+route,{waitUntil:'networkidle'});
  if(y){await p.evaluate(v=>window.scrollTo(0,v),y);await p.waitForTimeout(500)}
  await p.waitForTimeout(600);
  await p.screenshot({path:`shots/${n}.png`});await c.close();
}
await b.close();srv.close();console.log('ok');
