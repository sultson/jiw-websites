import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const MIME = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png'};
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
const pg = await b.newPage({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true });
await pg.goto('http://localhost:8899/', { waitUntil:'domcontentloaded' });
const rect = () => pg.$eval('#navLinks', el => { const r = el.getBoundingClientRect(); return {top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height)}; });
console.log('dicht:', JSON.stringify(await rect()));
await pg.click('#burger');
await pg.waitForTimeout(400);
console.log('open :', JSON.stringify(await rect()));
await pg.screenshot({ path:'work/shots/m-menu.png' });
await b.close(); srv.close();
