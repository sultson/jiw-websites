// Kandidaat-heroshots in de twee crops die de site gebruikt: 4:5 (desktop) en 4:3 (mobiel).
import sharp from 'sharp';
import fs from 'node:fs';
const IDX = (process.env.IDX || '93,91,181,248,184,45,107,161').split(',').map(Number);
const files = fs.readdirSync('site/m').filter((f) => f.endsWith('-1600.jpg'));
const byIdx = new Map(files.map((f) => [parseInt(f.slice(0, 3), 10), f]));
const W = 320, H5 = 400, H3 = 240, ROW = H5 + H3 + 30;
const tiles = [];
for (const [k, i] of IDX.entries()) {
  const f = byIdx.get(i); if (!f) { console.log('mist', i); continue; }
  const left = k * W;
  tiles.push({ input: await sharp(`site/m/${f}`).resize(W, H5, { fit: 'cover' }).toBuffer(), left, top: 30 });
  tiles.push({ input: await sharp(`site/m/${f}`).resize(W, H3, { fit: 'cover' }).toBuffer(), left, top: 30 + H5 });
  tiles.push({ input: Buffer.from(`<svg width="${W}" height="30"><rect width="${W}" height="30" fill="#000"/><text x="8" y="22" font-size="20" fill="#fff" font-family="monospace">${i}</text></svg>`), left, top: 0 });
}
await sharp({ create: { width: W * IDX.length, height: ROW, channels: 3, background: '#111' } })
  .composite(tiles).jpeg({ quality: 86 }).toFile('work/hero-pick.jpg');
console.log('work/hero-pick.jpg');
