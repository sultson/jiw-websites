import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/,'$1'), '..');
const DIST = path.join(ROOT,'dist'), OUT = path.join(ROOT,'shots');
fs.mkdirSync(OUT,{recursive:true});
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=path.join(DIST,p);if(p.endsWith('/'))f=path.join(f,'index.html');if(!fs.existsSync(f)){r.writeHead(404);return r.end('x')}r.writeHead(200,{'content-type':T[path.extname(f)]||'application/octet-stream'});r.end(fs.readFileSync(f))});
await new Promise(r=>server.listen(0,r));
const base=`http://127.0.0.1:${server.address().port}`;
const b=await chromium.launch();
const jobs=[
 ['i-home-m','/',390,844,false],
 ['i-home-m-full','/',390,844,true],
 ['i-contact-m','/contact/',390,844,false],
 ['i-home-d','/',1440,900,false],
];
for(const [n,u,w,h,full] of jobs){
  const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:2,isMobile:w<700,hasTouch:w<700});
  const p=await ctx.newPage();
  await p.goto(base+u,{waitUntil:'load'});
  await p.evaluate(()=>[...document.images].forEach(i=>{i.loading='eager'}));
  await p.waitForTimeout(2500);
  await p.screenshot({path:path.join(OUT,n+'.png'),fullPage:full});
  await ctx.close();
}
// measure the quote button + strip + ccards
const ctx=await b.newContext({viewport:{width:1440,height:900}});
const p=await ctx.newPage();
await p.goto(base+'/',{waitUntil:'load'});
const btn=await p.evaluate(()=>{
  const b=[...document.querySelectorAll('.hdr-cta .btn-p')][0];
  const cs=getComputedStyle(b);
  return {text:b.textContent.trim(),rect:b.getBoundingClientRect().toJSON(),pad:[cs.paddingTop,cs.paddingRight,cs.paddingBottom,cs.paddingLeft].join(' '),ws:cs.whiteSpace};
});
console.log('quote btn', JSON.stringify(btn));
const strip=await p.evaluate(()=>{
  const s=document.querySelector('.hero-strip');const hero=document.querySelector('.hero');
  return {stripBottom:s.getBoundingClientRect().bottom+scrollY, heroBottom:hero.getBoundingClientRect().bottom+scrollY,
    stripMB:getComputedStyle(s).marginBottom, heroPB:getComputedStyle(hero).paddingBottom};
});
console.log('strip', JSON.stringify(strip));
await p.goto(base+'/contact/',{waitUntil:'load'});
const cc=await p.evaluate(()=>{
  const s=document.querySelector('.ccards').closest('section');
  const ph=document.querySelector('.phead');
  return {secPT:getComputedStyle(s).paddingTop, secStyle:s.getAttribute('style'), cardsMT:getComputedStyle(document.querySelector('.ccards')).marginTop,
   pheadBottom:ph.getBoundingClientRect().bottom, secTop:s.getBoundingClientRect().top};
});
console.log('contact cards', JSON.stringify(cc));
await b.close(); server.close();
