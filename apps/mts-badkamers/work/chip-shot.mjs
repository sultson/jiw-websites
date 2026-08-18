// Controle na het verwijderen van de 4,3-score: hero-chip, dock, reviewkop en facts.
import { chromium, webkit, devices } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const MIME = { '.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png','.mp4':'video/mp4','.xml':'application/xml','.txt':'text/plain','.json':'application/json' };
const srv = http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join('site',p);if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('nope');}res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);});
await new Promise(r=>srv.listen(8903,r));
const B='http://127.0.0.1:8903';
for (const [eng, br] of [['cr', await chromium.launch()], ['wk', await webkit.launch()]]) {
  for (const [lbl,opts] of [['desk',{viewport:{width:1440,height:900}}],['mob',{...devices['iPhone 13']}]]) {
    const ctx = await br.newContext(opts); const page = await ctx.newPage();
    await page.goto(B+'/', {waitUntil:'load'});
    const chip = await page.locator('.trust-chip').boundingBox();
    const txt = await page.locator('.trust-chip').innerText();
    const chk = await page.locator('.trust-chip .chk').boundingBox();
    await page.screenshot({path:`work/chip-${eng}-${lbl}-hero.png`});
    await page.locator('#reviews').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({path:`work/chip-${eng}-${lbl}-rev.png`});
    const dock = await page.locator('#dock').boundingBox();
    const dsub = await page.locator('.dock-sub').innerText().catch(()=>'-');
    await page.locator('#over').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({path:`work/chip-${eng}-${lbl}-over.png`});
    const facts = await page.locator('.facts').boundingBox();
    const over = await page.evaluate(()=>{const e=document.scrollingElement;return e.scrollWidth>e.clientWidth?e.scrollWidth-e.clientWidth:0;});
    console.log(eng, lbl, '| chip', JSON.stringify(chip), JSON.stringify(txt), '| chk', chk&&chk.width, '| dock', dock&&Math.round(dock.width), JSON.stringify(dsub), '| facts h', facts&&Math.round(facts.height), '| overflow', over);
    await ctx.close();
  }
  await br.close();
}
srv.close();
