import sharp from 'sharp';
import fs from 'node:fs';
const files = fs.readdirSync('site/m').filter((f) => f.endsWith('-900.jpg'));
const byIdx = new Map(files.map((f) => [parseInt(f.slice(0, 3), 10), f]));
const idxs = [24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41];
const CW = 300, CH = 240, COLS = 6;
const rows = Math.ceil(idxs.length / COLS);
const tiles = [];
for (const [k, i] of idxs.entries()) {
  const f = byIdx.get(i);
  if (!f) { console.log('mist', i); continue; }
  const buf = await sharp(`site/m/${f}`).resize(CW, CH, { fit: 'contain', background: '#111' }).toBuffer();
  const lbl = await sharp({ create: { width: CW, height: 28, channels: 4, background: '#000000cc' } })
    .composite([{ input: Buffer.from(`<svg width="${CW}" height="28"><text x="6" y="21" font-size="20" fill="#fff" font-family="monospace">${i}</text></svg>`) }])
    .png().toBuffer();
  tiles.push({ input: buf, left: (k % COLS) * CW, top: Math.floor(k / COLS) * CH });
  tiles.push({ input: lbl, left: (k % COLS) * CW, top: Math.floor(k / COLS) * CH });
}
await sharp({ create: { width: CW * COLS, height: CH * rows, channels: 3, background: '#111' } })
  .composite(tiles).jpeg({ quality: 84 }).toFile('work/wk-sheet.jpg');
console.log('ok', CW*COLS, CH*rows);
