// One-off: tile the source imagery into labeled contact sheets for review.
import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = path.join(process.cwd(), 'adriaan-concept-imagery');
const OUT = '/tmp';
const COLS = 4;
const CELL_W = 460;
const CELL_H = 320;
const LABEL_H = 46;

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function sheet(files: string[], name: string) {
  const rows = Math.ceil(files.length / COLS);
  const cellH = CELL_H + LABEL_H;
  const canvas = sharp({
    create: {
      width: COLS * CELL_W,
      height: rows * cellH,
      channels: 3,
      background: '#111',
    },
  });

  const composites: sharp.OverlayOptions[] = [];
  for (let i = 0; i < files.length; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const thumb = await sharp(path.join(SRC, files[i]))
      .resize(CELL_W - 8, CELL_H - 8, { fit: 'cover' })
      .toBuffer();
    composites.push({ input: thumb, left: col * CELL_W + 4, top: row * cellH + 4 });
    const label = Buffer.from(
      `<svg width="${CELL_W}" height="${LABEL_H}"><rect width="100%" height="100%" fill="#1a1a1a"/><text x="8" y="29" font-family="monospace" font-size="15" fill="#fd5701">${esc(files[i])}</text></svg>`,
    );
    composites.push({ input: label, left: col * CELL_W, top: row * cellH + CELL_H });
  }

  await canvas.composite(composites).jpeg({ quality: 78 }).toFile(path.join(OUT, `sheet-${name}.jpg`));
  console.log(`sheet-${name}.jpg : ${files.length} images`);
}

async function main() {
  const all = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
  const groups: Record<string, string[]> = { sloop: [], nieuwbouw: [], oplevering: [], verbouwing: [] };
  for (const f of all) {
    const key = Object.keys(groups).find((k) => f.startsWith(k));
    if (key) groups[key].push(f);
  }
  for (const [name, files] of Object.entries(groups)) {
    if (!files.length) continue;
    if (files.length > 14) {
      const mid = Math.ceil(files.length / 2);
      await sheet(files.slice(0, mid), `${name}-a`);
      await sheet(files.slice(mid), `${name}-b`);
    } else {
      await sheet(files, name);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
