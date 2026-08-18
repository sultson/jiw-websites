// Contactvel van alle resultaatfoto's, om de sterkste heroshot te kiezen.
import sharp from 'sharp';
import fs from 'node:fs';
import { projects } from '../projects.mjs';

const files = fs.readdirSync('site/m').filter((f) => f.endsWith('-900.jpg'));
const byIdx = new Map(files.map((f) => [parseInt(f.slice(0, 3), 10), f]));

const idxs = [];
for (const p of projects) for (const r of p.results || []) if (!idxs.includes(r.i)) idxs.push(r.i);
console.log('resultaatfotos:', idxs.length);

const CW = 260, CH = 200, COLS = 6;
const rows = Math.ceil(idxs.length / COLS);
const tiles = [];
for (const [k, i] of idxs.entries()) {
  const f = byIdx.get(i);
  if (!f) { console.log('mist', i); continue; }
  const buf = await sharp(`site/m/${f}`).resize(CW, CH, { fit: 'cover' }).toBuffer();
  const lbl = await sharp({ create: { width: CW, height: 26, channels: 4, background: '#000000cc' } })
    .composite([{ input: Buffer.from(`<svg width="${CW}" height="26"><text x="6" y="19" font-size="18" fill="#fff" font-family="monospace">${i}</text></svg>`) }])
    .png().toBuffer();
  tiles.push({ input: buf, left: (k % COLS) * CW, top: Math.floor(k / COLS) * CH });
  tiles.push({ input: lbl, left: (k % COLS) * CW, top: Math.floor(k / COLS) * CH });
}
await sharp({ create: { width: CW * COLS, height: CH * rows, channels: 3, background: '#111' } })
  .composite(tiles).jpeg({ quality: 82 }).toFile('work/hero-sheet.jpg');
console.log('work/hero-sheet.jpg', CW * COLS, 'x', CH * rows);
