import { chromium, webkit, devices } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const MIME={'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4','.xml':'text/xml','.txt':'text/plain','.png':'image/png'};
const srv=http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join('site',p);if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('x');}res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);});
await new Promise(r=>srv.listen(8899,r));
const paths = JSON.parse(fs.readFileSync('site/sitemap.xml','utf8').match(/<loc>[^<]+<\/loc>/g).map(x=>x.slice(5,-6)).map(u=>JSON.stringify(new URL(u).pathname)).join(',').replace(/^/,'[').replace(/$/,']'));
let bad=0;
for (const [bn,br] of [['chromium',chromium],['webkit',webkit]]) {
  const b=await br.launch();
  for (const [lbl,opts] of [['mob',{...devices['iPhone 13']}],['desk',{viewport:{width:1440,height:900}}]]) {
    const ctx=await b.newContext(opts); const page=await ctx.newPage();
    for (const p of paths) {
      const errs=[]; page.on('pageerror',e=>errs.push(String(e)));
      await page.goto('http://127.0.0.1:8899'+p,{waitUntil:'load'});
      await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,30));}scrollTo(0,0);});
      await page.waitForTimeout(250);
      const m=await page.evaluate(()=>{
        const zero=[...document.querySelectorAll('.rail, .hero-shot, .ba-stage, .ph')].filter(e=>{const r=e.getBoundingClientRect();return r.width<2||r.height<2;}).length;
        const broken=[...document.images].filter(i=>i.complete&&i.naturalWidth===0).length;
        return {h:document.documentElement.scrollHeight, over:document.documentElement.scrollWidth>innerWidth+1, zero, broken};
      });
      if(m.over||m.zero||m.broken||errs.length){bad++;console.log('  FOUT',bn,lbl,p,JSON.stringify(m),errs.join('|'));}
    }
    await ctx.close();
  }
  await b.close();
}
console.log(bad? `\n${bad} problemen` : `\nalle ${paths.length} paginas ok in chromium + webkit, mobiel + desktop`);
srv.close();
