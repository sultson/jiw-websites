import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/,'$1'), '..');
const DIST = path.join(ROOT,'dist');
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=path.join(DIST,p);if(p.endsWith('/'))f=path.join(f,'index.html');if(!fs.existsSync(f)){r.writeHead(404);return r.end('x')}r.writeHead(200,{'content-type':T[path.extname(f)]||'application/octet-stream'});r.end(fs.readFileSync(f))});
await new Promise(r=>server.listen(0,r));
const base=`http://127.0.0.1:${server.address().port}`;
const b=await chromium.launch();
const pages=['/','/catalogue/','/shipping/','/about/','/contact/'];
const langs=['','/nl','/de'];
const views=[[390,844],[360,800],[768,900],[1440,900]];
const bad=[];
for(const [w,h] of views){
  const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,isMobile:w<700,hasTouch:w<700});
  const p=await ctx.newPage();
  for(const l of langs) for(const u of pages){
    await p.goto(base+l+u,{waitUntil:'domcontentloaded'});
    // open drawer + show basket/stick so hidden controls get measured too
    await p.evaluate(()=>{document.querySelector('.mnav')?.classList.add('open');
      document.querySelector('.basket')?.classList.add('show');
      document.querySelector('.stick')?.classList.add('show');});
    await p.waitForTimeout(150);
    const r=await p.evaluate(()=>{
      const out=[];
      for(const el of document.querySelectorAll('.btn,.add,.chip,.pick,.link')){
        const cs=getComputedStyle(el);
        if(cs.display==='none'||!el.offsetParent&&cs.position!=='fixed') continue;
        const rect=el.getBoundingClientRect();
        if(!rect.width) continue;
        const pl=parseFloat(cs.paddingLeft), pr=parseFloat(cs.paddingRight), bw=parseFloat(cs.borderLeftWidth)||0;
        // inner content width
        let cmin=Infinity,cmax=-Infinity;
        for(const n of el.childNodes){
          let rr=null;
          if(n.nodeType===3){ if(!n.textContent.trim())continue; const rg=document.createRange(); rg.selectNodeContents(n); rr=rg.getBoundingClientRect(); }
          else if(n.nodeType===1){ if(getComputedStyle(n).display==='none')continue; rr=n.getBoundingClientRect(); }
          if(!rr||!rr.width)continue; cmin=Math.min(cmin,rr.left); cmax=Math.max(cmax,rr.right);
        }
        if(cmin===Infinity)continue;
        const gapL=cmin-rect.left, gapR=rect.right-cmax;
        if(gapL < pl+bw-1.5 || gapR < pr+bw-1.5 || gapL<6 || gapR<6)
          out.push({t:el.textContent.trim().slice(0,34),cls:el.className,gapL:+gapL.toFixed(1),gapR:+gapR.toFixed(1),pl,pr,w:+rect.width.toFixed(1)});
      }
      return out;
    });
    for(const x of r) bad.push({v:`${w}x${h}`,url:l+u,...x});
  }
  await ctx.close();
}
await b.close(); server.close();
const seen=new Set();
for(const x of bad){const k=x.v+x.cls+x.t; if(seen.has(k))continue; seen.add(k); console.log(JSON.stringify(x));}
console.log('total flagged:',bad.length);
