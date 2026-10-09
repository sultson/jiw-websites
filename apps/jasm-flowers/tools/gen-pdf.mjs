// Prints dist/catalogue-sheet/ to dist/jasm-flowers-catalogue.pdf.
// Run after src/build.mjs, before deploy. Serves dist over http so /i/ and /f/
// resolve exactly as they do in production.
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const DIST = path.join(ROOT, 'dist');
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };

const server = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]);
  let f = path.join(DIST, p);
  if (p.endsWith('/')) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { r.writeHead(404); return r.end('x'); }
  r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' });
  r.end(fs.readFileSync(f));
});
await new Promise(res => server.listen(0, res));
const base = `http://127.0.0.1:${server.address().port}`;

import { LANGS } from '../src/i18n.mjs';

const browser = await chromium.launch();
const page = await browser.newPage();
const errs = [];
page.on('pageerror', e => errs.push(String(e)));
page.on('response', res => { if (res.status() >= 400) errs.push(`${res.status()} ${res.url()}`); });

// One PDF per language, printed from that language's sheet, so the download button
// on a translated page never hands the buyer an English document.
const done = [];
for (const { code } of LANGS) {
  const dir = code === 'en' ? '' : '/' + code;
  await page.goto(`${base}${dir}/catalogue-sheet/`, { waitUntil: 'load', timeout: 60000 });
  // Lazy images below the fold never fetch in a headless viewport, so the print
  // would come out with holes. Force them all eager and let them settle.
  await page.evaluate(() => [...document.images].forEach(i => { i.loading = 'eager'; }));
  await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0),
    null, { timeout: 60000 });
  await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 8000))]));

  const out = path.join(DIST, dir.slice(1), 'jasm-flowers-catalogue.pdf');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.pdf({ path: out, format: 'A4', printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  const sheets = await page.evaluate(() => document.querySelectorAll('.page').length);
  const kb = fs.statSync(out).size / 1024;
  if (kb < 60) { console.error(`${code} pdf suspiciously small: ${kb.toFixed(0)} KB`); process.exit(1); }
  done.push(`${code}: ${sheets} sheets, ${(kb / 1024).toFixed(2)} MB`);
}
await browser.close();
server.close();
if (errs.length) { console.error('sheet errors:\n' + errs.join('\n')); process.exit(1); }
console.log('pdf -> ' + done.join(' | '));
