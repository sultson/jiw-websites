import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/,'$1'),'..');
const DIST = path.join(ROOT,'dist');
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.mp4':'video/mp4','.pdf':'application/pdf'};
const server=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=path.join(DIST,p);if(p.endsWith('/'))f=path.join(f,'index.html');if(!fs.existsSync(f)){r.writeHead(404);return r.end('x')}r.writeHead(200,{'content-type':T[path.extname(f)]||'application/octet-stream'});r.end(fs.readFileSync(f))});
await new Promise(r=>server.listen(0,r));
const base=`http://127.0.0.1:${server.address().port}`;
const b=await chromium.launch(); const page=await b.newPage({viewport:{width:1380,height:900},deviceScaleFactor:1});
const out=path.join(ROOT,'shots','r0510'); fs.mkdirSync(out,{recursive:true});
async function shot(url,sel,name){
  await page.goto(base+url,{waitUntil:'networkidle'});
  await page.waitForTimeout(500);
  const el=sel?await page.$(sel):null;
  if(el){ await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(700);
    await el.screenshot({path:path.join(out,name+'.png')}); }
  else await page.screenshot({path:path.join(out,name+'.png')});
}
await shot('/','.trip','home-trip');
await shot('/about/','.phead','about-hero');
await shot('/about/','#partnership','about-partnership');
await shot('/shipping/','.proc','ship-chain');
await shot('/shipping/','.sec-pale .wrap','ship-terms');
await shot('/catalogue/','#availability','cat-avail');
await b.close(); server.close(); console.log('shots in shots/r0510');
