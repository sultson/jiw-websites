import sharp from 'sharp';
import { readdir, stat, unlink } from 'node:fs/promises';
import path from 'node:path';

const PUBLIC = path.resolve(process.cwd(), 'public');
const QUALITY = 80;
const MAX_EDGE = 1600;

function human(size: number): string {
  if (size > 1024 * 1024) return (size / 1024 / 1024).toFixed(2) + ' MB';
  return (size / 1024).toFixed(0) + ' KB';
}

async function processOne(dir: string, file: string) {
  const full = path.join(dir, file);
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

  const before = (await stat(full)).size;
  const meta = await sharp(full).metadata();
  const longest = Math.max(meta.width ?? 0, meta.height ?? 0);

  let pipeline = sharp(full).rotate();
  if (longest > MAX_EDGE) {
    if ((meta.width ?? 0) >= (meta.height ?? 0)) pipeline = pipeline.resize({ width: MAX_EDGE });
    else pipeline = pipeline.resize({ height: MAX_EDGE });
  }

  const outWebp = path.join(dir, file.replace(/\.(jpe?g|png)$/i, '.webp'));
  await pipeline.webp({ quality: QUALITY, effort: 6, smartSubsample: true }).toFile(outWebp);
  const after = (await stat(outWebp)).size;
  console.log(`  ${file.padEnd(28)} ${human(before)} -> ${human(after)}`);
  await unlink(full);
}

async function processDir(dir: string) {
  let entries: string[] = [];
  try {
    entries = await readdir(dir);
  } catch {
    return;
  }
  const targets = entries.filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
  if (!targets.length) return;
  console.log(`\n${path.relative(PUBLIC, dir) || '.'}: ${targets.length} files`);
  for (const file of targets) {
    try {
      await processOne(dir, file);
    } catch (err) {
      console.error(`  ! ${file}: ${(err as Error).message}`);
    }
  }
}

async function main() {
  await processDir(PUBLIC);
  await processDir(path.join(PUBLIC, 'work'));
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
