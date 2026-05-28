import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = path.resolve(process.cwd(), 'scraped-media');
const DST = path.resolve(SRC, 'grids');
await mkdir(DST, { recursive: true });

const all = (await readdir(SRC)).filter(f => /\.(jpe?g)$/i.test(f)).sort();

const TILE = 220;        // each thumbnail tile
const COLS = 3;
const ROWS = 3;          // 9 per grid
const PAD = 8;
const LABEL_H = 26;

const W = COLS * TILE + (COLS + 1) * PAD;
const H = ROWS * (TILE + LABEL_H) + (ROWS + 1) * PAD;

let gridIdx = 0;
for (let start = 0; start < all.length; start += COLS * ROWS) {
  const batch = all.slice(start, start + COLS * ROWS);
  const composites = [];
  for (let i = 0; i < batch.length; i++) {
    const f = batch[i];
    const r = Math.floor(i / COLS);
    const c = i % COLS;
    const x = PAD + c * (TILE + PAD);
    const y = PAD + r * (TILE + LABEL_H + PAD);
    // thumbnail
    const thumb = await sharp(path.join(SRC, f))
      .rotate()
      .resize({ width: TILE, height: TILE, fit: 'cover' })
      .jpeg({ quality: 78 })
      .toBuffer();
    composites.push({ input: thumb, left: x, top: y });
    // label
    const label = `<svg width="${TILE}" height="${LABEL_H}">
      <rect width="100%" height="100%" fill="#fff"/>
      <text x="6" y="18" font-family="monospace" font-size="14" fill="#000">${f}</text>
    </svg>`;
    composites.push({ input: Buffer.from(label), left: x, top: y + TILE });
  }
  const outName = `grid-${++gridIdx}.jpg`;
  await sharp({
    create: { width: W, height: H, channels: 3, background: '#222' }
  })
    .composite(composites)
    .jpeg({ quality: 82 })
    .toFile(path.join(DST, outName));
  console.log(outName, '←', batch.length, 'tiles');
}
