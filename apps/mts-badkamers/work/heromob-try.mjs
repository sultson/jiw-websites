// Zelfde idee als hero-try.mjs, maar voor de MOBIELE hero (heroMob).
// Zet elke kandidaat echt in de pagina, schiet hem op een iPhone 13 en legt ze naast elkaar.
import { chromium, devices } from 'playwright';
import sharp from 'sharp';
import { execSync } from 'node:child_process';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const CANDS = process.argv.slice(2).map(Number);
const SRC = 'build.mjs'; const orig = fs.readFileSync(SRC, 'utf8');
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.xml': 'text/xml', '.txt': 'text/plain', '.png': 'image/png' };
const srv = http.createServer((req, res) => { let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html'; const f = path.join('site', p); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('x'); } res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res); });
await new Promise(r => srv.listen(8896, r));
const b = await chromium.launch(); const shots = [];
try {
  for (const i of CANDS) {
    fs.writeFileSync(SRC, orig.replace(/const heroMob = media\(\d+\);/, `const heroMob = media(${i});`));
    execSync('node build.mjs', { stdio: 'ignore' });
    const ctx = await b.newContext({ ...devices['iPhone 13'] }); const page = await ctx.newPage();
    await page.goto('http://127.0.0.1:8896/', { waitUntil: 'load' }); await page.waitForTimeout(800);
    shots.push({ i, buf: await page.screenshot() }); await ctx.close();
  }
} finally { fs.writeFileSync(SRC, orig); execSync('node build.mjs', { stdio: 'ignore' }); }
await b.close(); srv.close();
const W = 380, H = Math.round(1992 / 1170 * W), LAB = 24;
const tiles = [];
for (const [k, s] of shots.entries()) {
  tiles.push({ input: await sharp(s.buf).resize(W, H, { fit: 'fill' }).toBuffer(), left: k * W, top: LAB });
  tiles.push({ input: Buffer.from(`<svg width="${W}" height="${LAB}"><rect width="100%" height="100%" fill="#111"/><text x="6" y="18" font-size="16" fill="#0f0" font-family="monospace">heroMob ${s.i}</text></svg>`), left: k * W, top: 0 });
}
await sharp({ create: { width: W * shots.length, height: H + LAB, channels: 3, background: '#111' } })
  .composite(tiles).jpeg({ quality: 88 }).toFile('work/heromob-try.jpg');
console.log('work/heromob-try.jpg', CANDS.join(','));
