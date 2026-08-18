import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const MIME={'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4','.xml':'text/xml','.txt':'text/plain','.png':'image/png','.woff2':'font/woff2','.json':'application/json'};
const srv=http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join('site',p);if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('x');}res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);});
await new Promise(r=>srv.listen(8903,r));
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1440,height:940}}); const page=await ctx.newPage();
await page.goto('http://127.0.0.1:8903/',{waitUntil:'load'});
await page.evaluate(()=>document.getElementById('werkgebied').scrollIntoView());
await page.waitForTimeout(7000);
console.log(await page.evaluate(()=>{
  const box=document.querySelector('.map-box'), cv=document.querySelector('.map-canvas'), c=document.querySelector('#map canvas');
  const gl = c && (c.getContext('webgl2')||c.getContext('webgl'));
  const mp=document.querySelector('.map-pin');
  return {box:box.getBoundingClientRect().height, cv:cv.getBoundingClientRect().height,
    canvasAttr:c? c.width+'x'+c.height:'none', canvasCss:c?getComputedStyle(c).width+' '+getComputedStyle(c).height:'-',
    hasCssLink: !![...document.styleSheets].find(s=>String(s.href).includes('mapbox')),
    glCtx: !!gl, mapClass: document.querySelector('.mapboxgl-map')?'yes':'no',
    pinVisible: mp? getComputedStyle(mp).display+'/'+mp.getBoundingClientRect().top : 'no pin',
    canvasParentPos: c? getComputedStyle(c.parentElement).position : '-'};
}));
await page.locator('.map-box').screenshot({path:'work/map-dbg2.png'});
await b.close(); srv.close();
