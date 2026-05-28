import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import path from 'node:path';

const PUBLIC = path.resolve(process.cwd(), 'public');

const LIGHT = 82;
const HEAVY = 70;

const MAX_EDGE = 2000;
const logoMaxEdge = 512;

function pickQuality(file: string): number {
  return file.startsWith('nail-') ? HEAVY : LIGHT;
}

async function human(size: number): Promise<string> {
  if (size > 1024 * 1024) return (size / 1024 / 1024).toFixed(2) + ' MB';
  return (size / 1024).toFixed(0) + ' KB';
}

async function processOne(file: string) {
  const full = path.join(PUBLIC, file);
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;

  const before = (await stat(full)).size;
  const quality = pickQuality(file);
  const isLogo = /(^|-)logo\.png$/i.test(file);

  const meta = await sharp(full).metadata();
  const longest = Math.max(meta.width ?? 0, meta.height ?? 0);
  const target = isLogo ? logoMaxEdge : MAX_EDGE;

  let pipeline = sharp(full).rotate();
  if (longest > target) {
    if ((meta.width ?? 0) >= (meta.height ?? 0)) {
      pipeline = pipeline.resize({ width: target });
    } else {
      pipeline = pipeline.resize({ height: target });
    }
  }

  if (isLogo) {
    const outBuf = await pipeline.png({ compressionLevel: 9, palette: true, effort: 10 }).toBuffer();
    const tmp = full + '.tmp';
    await sharp(outBuf).toFile(tmp);
    await unlink(full);
    await rename(tmp, full);
    const after = (await stat(full)).size;
    console.log(`  ${file.padEnd(28)} ${await human(before)} → ${await human(after)}  (PNG)`);
    return;
  }

  const outWebp = path.join(PUBLIC, file.replace(/\.(jpe?g|png)$/i, '.webp'));
  await pipeline.webp({ quality, effort: 6, smartSubsample: true }).toFile(outWebp);
  const after = (await stat(outWebp)).size;
  console.log(`  ${file.padEnd(28)} ${await human(before)} → ${await human(after)}  (WebP q${quality})`);
  if (ext !== '.webp') await unlink(full);
}

async function main() {
  const all = await readdir(PUBLIC);
  const targets = all.filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
  console.log(`Compressing ${targets.length} images in public/\n`);
  for (const file of targets) {
    try {
      await processOne(file);
    } catch (err) {
      console.error(`  ! ${file}: ${(err as Error).message}`);
    }
  }
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
