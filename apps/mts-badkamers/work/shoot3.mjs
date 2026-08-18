import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const MIME = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4','.png':'image/png'};
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
const pg = await b.newPage({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2 });
const bad=[]; pg.on('requestfailed', r=>bad.push(r.url()));
pg.on('response', r=>{ if (r.status()>=400) bad.push(r.status()+' '+r.url()); });
await pg.goto('http://localhost:8899/', { waitUntil:'networkidle' });
await pg.evaluate(async () => { await new Promise(r=>{ let y=0; const t=setInterval(()=>{ window.scrollTo(0,y); y+=600; if (y>document.body.scrollHeight){clearInterval(t);r();} },35); }); });
await pg.waitForTimeout(700);
for (const [name, sel] of [['m-hero','.hero'],['m-voorna','#voorna'],['m-contact','#contact']]) {
  const el = await pg.$(sel); await el.scrollIntoViewIfNeeded(); await pg.waitForTimeout(400);
  await el.screenshot({ path:`work/shots/${name}.png` });
}
// horizontale overflow?
const ow = await pg.evaluate(()=>[document.documentElement.scrollWidth, window.innerWidth]);
console.log('scrollWidth/innerWidth:', ow.join(' / '));
console.log('mislukte requests:', bad.length ? [...new Set(bad)].slice(0,8).join('\n') : 'geen');
await b.close(); srv.close();
