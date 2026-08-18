import { chromium, devices } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const MIME={'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png','.mp4':'video/mp4','.xml':'application/xml','.txt':'text/plain','.json':'application/json'};
const srv=http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join('site',p);if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('nope');}res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);});
await new Promise(r=>srv.listen(8904,r));
const br=await chromium.launch();
for(const [lbl,opts] of [['desk',{viewport:{width:1440,height:900}}],['mob',{...devices['iPhone 13']}]]){
  const ctx=await br.newContext(opts);const page=await ctx.newPage();
  await page.goto('http://127.0.0.1:8904/',{waitUntil:'load'});
  await page.locator('.facts').scrollIntoViewIfNeeded();await page.waitForTimeout(400);
  await page.locator('.facts').screenshot({path:`work/facts-${lbl}.png`});
  await page.locator('#reviews .sec-head').scrollIntoViewIfNeeded();await page.waitForTimeout(400);
  await page.locator('#reviews .sec-head').screenshot({path:`work/revhead-${lbl}.png`});
  await page.locator('.hero-txt').scrollIntoViewIfNeeded();await page.waitForTimeout(300);
  await page.locator('.trust-chip').screenshot({path:`work/chip2-${lbl}.png`});
  const h=await page.evaluate(()=>document.querySelector('.hero').getBoundingClientRect().height);
  console.log(lbl,'hero h',Math.round(h),'| vp',opts.viewport?opts.viewport.height:devices['iPhone 13'].viewport.height);
  await ctx.close();
}
await br.close();srv.close();
