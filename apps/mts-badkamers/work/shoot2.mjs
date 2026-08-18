import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const MIME = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4'};
const srv = http.createServer((req,res)=>{
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join('site', p);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('nope'); }
  res.writeHead(200, {'Content-Type': MIME[path.extname(f)] || 'application/octet-stream'});
  fs.createReadStream(f).pipe(res);
});
await new Promise(r=>srv.listen(8899,r));
const b = await chromium.launch();
const pg = await b.newPage({ viewport:{width:1380,height:900} });
const errs=[]; pg.on('pageerror',e=>errs.push(String(e))); pg.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
await pg.goto('http://localhost:8899/', { waitUntil:'networkidle' });
await pg.evaluate(async () => { await new Promise(r=>{ let y=0; const t=setInterval(()=>{ window.scrollTo(0,y); y+=700; if (y>document.body.scrollHeight){clearInterval(t);r();} },35); }); });
await pg.waitForTimeout(800);
for (const [name, sel] of [['s-hero','.hero'],['s-voorna','#voorna'],['s-werkgebied','#werkgebied'],['s-faq','#faq'],['s-contact','#contact'],['s-reviews','#reviews']]) {
  const el = await pg.$(sel);
  await el.scrollIntoViewIfNeeded(); await pg.waitForTimeout(500);
  await el.screenshot({ path:`work/shots/${name}.png` });
}
// slider testen: naar 0 zetten
await pg.$eval('#baRange', el => { el.value = 0; el.dispatchEvent(new Event('input')); });
await pg.waitForTimeout(400);
await (await pg.$('#voorna')).screenshot({ path:'work/shots/s-voorna-0.png' });
// tab wisselen
await pg.$$eval('.ba-tab', els => els[3].click());
await pg.waitForTimeout(900);
await (await pg.$('#voorna')).screenshot({ path:'work/shots/s-voorna-tab.png' });
console.log('JS-fouten:', errs.length ? errs.join(' | ') : 'geen');
await b.close(); srv.close();
