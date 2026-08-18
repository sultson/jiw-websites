// Simuleert de mobiele hero-uitsnede: de foto vult 390x590 (cover), horizontaal op
// 38%, en de onderste helft gaat achter het verloop + de tekst. Alleen de bovenste
// helft telt dus. Dit vel laat precies dat zien -- onderaan gedimd, zodat je niet
// per ongeluk een foto kiest waarvan het beste stuk achter de kop verdwijnt.
import sharp from 'sharp';
import fs from 'node:fs';

const files = fs.readdirSync('site/m').filter(f => f.endsWith('-900.jpg'));
const byIdx = new Map(files.map(f => [parseInt(f.slice(0, 3), 10), f]));
const sel = process.argv.slice(2).map(Number);
const CW = 320, CH = 484, COLS = 5, LAB = 22;
const rows = Math.ceil(sel.length / COLS);
const tiles = [];
// verloop: vanaf 40% hoogte naar zwart, zoals in styles.css
const veil = await sharp({ create: { width: CW, height: CH, channels: 4, background: '#00000000' } })
  .composite([{ input: Buffer.from(`<svg width="${CW}" height="${CH}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0.40" stop-color="#000" stop-opacity="0"/><stop offset="0.58" stop-color="#000" stop-opacity="0.72"/><stop offset="1" stop-color="#000" stop-opacity="0.92"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`) }])
  .png().toBuffer();

for (const [k, i] of sel.entries()) {
  const f = byIdx.get(i);
  if (!f) { console.log('mist', i); continue; }
  const buf = await sharp(`site/m/${f}`).resize(CW, CH, { fit: 'cover', position: 'attention' }).toBuffer();
  const left = (k % COLS) * CW, top = Math.floor(k / COLS) * (CH + LAB) + LAB;
  tiles.push({ input: buf, left, top });
  tiles.push({ input: veil, left, top });
  tiles.push({ input: Buffer.from(`<svg width="${CW}" height="${LAB}"><rect width="100%" height="100%" fill="#111"/><text x="5" y="17" font-size="15" fill="#0f0" font-family="monospace">${i}</text></svg>`), left, top: top - LAB });
}
await sharp({ create: { width: CW * COLS, height: (CH + LAB) * rows, channels: 3, background: '#111' } })
  .composite(tiles).jpeg({ quality: 82 }).toFile('work/heromob-sheet2.jpg');
console.log('work/heromob-sheet2.jpg', sel.length);
