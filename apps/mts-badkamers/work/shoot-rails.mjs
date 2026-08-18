// Controleshots voor de zijwaartse rails + de meelopende CTA.
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain',
};

const srv = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join('site', p);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('nope'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => srv.listen(8901, r));
fs.mkdirSync('work/shots', { recursive: true });

const b = await chromium.launch();
const errs = [];

async function run(tag, opts) {
  const pg = await b.newPage(opts);
  pg.on('pageerror', (e) => errs.push(`${tag}: ${e.message}`));
  pg.on('console', (m) => m.type() === 'error' && errs.push(`${tag} console: ${m.text()}`));
  pg.on('response', (r) => r.status() >= 400 && errs.push(`${tag} ${r.status()} ${r.url()}`));

  // home
  await pg.goto('http://localhost:8901/', { waitUntil: 'networkidle' });
  await pg.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('in')));
  await pg.waitForTimeout(300);
  await pg.locator('#projecten').scrollIntoViewIfNeeded();
  await pg.waitForTimeout(600);
  await pg.locator('#projecten').screenshot({ path: `work/shots/r-${tag}-projecten.png` });

  // rail doorschuiven
  await pg.evaluate(() => {
    const r = document.querySelector('#projecten .rail');
    r.scrollLeft = r.scrollWidth * 0.35;
  });
  await pg.waitForTimeout(500);
  await pg.locator('#projecten').screenshot({ path: `work/shots/r-${tag}-projecten-mid.png` });

  // dock zichtbaar? screenshot van het hele scherm halverwege de pagina
  await pg.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.4));
  await pg.waitForTimeout(900);
  const dockOn = await pg.evaluate(() => document.getElementById('dock').classList.contains('on'));
  await pg.screenshot({ path: `work/shots/r-${tag}-dock.png` });

  // bij het contactblok moet de dock juist weg zijn
  await pg.locator('#contact').scrollIntoViewIfNeeded();
  await pg.waitForTimeout(900);
  const dockOff = await pg.evaluate(() => document.getElementById('dock').classList.contains('on'));

  // projectpagina
  await pg.goto('http://localhost:8901/werk/terrazzo-met-vrijstaand-bad/', { waitUntil: 'networkidle' });
  await pg.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('in')));
  await pg.waitForTimeout(400);
  const stories = pg.locator('.story');
  await stories.first().scrollIntoViewIfNeeded();
  await pg.waitForTimeout(600);
  await stories.first().screenshot({ path: `work/shots/r-${tag}-fase.png` });
  await pg.locator('#galerij').scrollIntoViewIfNeeded();
  await pg.waitForTimeout(600);
  await pg.locator('#galerij').screenshot({ path: `work/shots/r-${tag}-bouwmap.png` });

  const h = await pg.evaluate(() => document.documentElement.scrollHeight);
  const overflow = await pg.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  await pg.close();
  return { dockOn, dockOff, h, overflow };
}

const d = await run('d', { viewport: { width: 1440, height: 900 } });
const m = await run('m', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });

console.log('desktop', d);
console.log('mobiel ', m);
console.log(errs.length ? `PROBLEMEN:\n${errs.join('\n')}` : 'geen console/netwerkfouten');
await b.close();
srv.close();
