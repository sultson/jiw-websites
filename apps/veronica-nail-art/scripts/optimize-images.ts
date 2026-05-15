import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import path from 'node:path';

const PUBLIC = path.resolve(process.cwd(), 'public');

const QUALITY = 80;
const MAX_EDGE = 2000;

async function human(size: number): Promise<string> {
  if (size > 1024 * 1024) return (size / 1024 / 1024).toFixed(2) + ' MB';
  return (size / 1024).toFixed(0) + ' KB';
}

async function processOne(file: string) {
  const full = path.join(PUBLIC, file);
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;

  const before = (await stat(full)).size;
  const meta = await sharp(full).metadata();
  const longest = Math.max(meta.width ?? 0, meta.height ?? 0);

  let pipeline = sharp(full).rotate();
  if (longest > MAX_EDGE) {
    if ((meta.width ?? 0) >= (meta.height ?? 0)) {
      pipeline = pipeline.resize({ width: MAX_EDGE });
    } else {
      pipeline = pipeline.resize({ height: MAX_EDGE });
    }
  }

  if (ext === '.webp') {
    const tmp = full + '.tmp';
    await pipeline.webp({ quality: QUALITY, effort: 6, smartSubsample: true }).toFile(tmp);
    await unlink(full);
    await rename(tmp, full);
  } else {
    const outWebp = path.join(PUBLIC, file.replace(/\.(jpe?g|png)$/i, '.webp'));
    await pipeline.webp({ quality: QUALITY, effort: 6, smartSubsample: true }).toFile(outWebp);
    await unlink(full);
  }

  const outName = file.replace(/\.(jpe?g|png)$/i, '.webp');
  const after = (await stat(path.join(PUBLIC, outName))).size;
  console.log(`  ${outName.padEnd(22)} ${await human(before)} → ${await human(after)}`);
}

async function main() {
  const all = await readdir(PUBLIC);
  const targets = all.filter(f => /\.(jpe?g|png|webp)$/i.test(f)).sort();
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

main().catch(err => {
  console.error(err);
  process.exit(1);
});
