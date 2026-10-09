import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const DIST='dist';const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=path.join(DIST,p);if(p.endsWith('/'))f=path.join(f,'index.html');if(!fs.existsSync(f)){r.writeHead(404);return r.end('x')}r.writeHead(200,{'content-type':T[path.extname(f)]||'application/octet-stream'});r.end(fs.readFileSync(f))});
await new Promise(r=>srv.listen(0,r)); const base=`http://127.0.0.1:${srv.address().port}`;
const b=await chromium.launch();
for(const [n,w,h] of [['hdr-d',1440,240],['hdr-m',390,200]]){
  const c=await b.newContext({viewport:{width:w,height:h}});const p=await c.newPage();
  await p.goto(base+'/',{waitUntil:'networkidle'});await p.waitForTimeout(400);
  await p.screenshot({path:`shots/${n}.png`});await c.close();
}
const p2=await b.newPage({viewport:{width:400,height:200}});
await p2.setContent(`<body style="margin:0;background:#eee;display:flex;gap:24px;align-items:center;padding:24px">
${[16,32,64,128].map(s=>`<img src="${base}/favicon.svg" width="${s}" height="${s}">`).join('')}</body>`);
await p2.waitForTimeout(300); await p2.screenshot({path:'shots/favicon.png'});
await b.close();srv.close();console.log('ok');
