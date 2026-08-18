import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const MIME = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4','.xml':'text/xml','.txt':'text/plain'};
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
const shots = [
  ['home-desk', '/', 1440, 1000, false],
  ['proj-desk', '/werk/terrazzo-met-vrijstaand-bad/', 1440, 1000, false],
  ['home-mob', '/', 400, 850, true],
];
for (const [name, url, w, h, mob] of shots) {
  const pg = await b.newPage({ viewport:{width:w,height:h}, deviceScaleFactor: 1, isMobile: mob, hasTouch: mob });
  await pg.goto(`http://localhost:8899${url}`, { waitUntil:'networkidle' });
  await pg.evaluate(async () => { await new Promise(r=>{ let y=0; const t=setInterval(()=>{ window.scrollTo(0,y); y+=600; if (y>document.body.scrollHeight){clearInterval(t);r();} },40); }); });
  await pg.waitForTimeout(900);
  await pg.evaluate(()=>window.scrollTo(0,0));
  await pg.waitForTimeout(400);
  await pg.screenshot({ path:`work/shots/${name}.png`, fullPage:true });
  const errs = [];
  pg.on('pageerror', e=>errs.push(String(e)));
  await pg.close();
}
await b.close(); srv.close();
console.log('shots klaar');
