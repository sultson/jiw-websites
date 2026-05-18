import sharp from 'sharp';
import { readdir, stat, unlink } from 'node:fs/promises';
import path from 'node:path';

const PUBLIC = path.resolve(process.cwd(), 'public');
const QUALITY = 82;
const MAX_EDGE = 1600;

// Folders whose PNG/JPG sources should NOT be converted (already-final assets).
const SKIP_DIRS = new Set(['logos']);

function human(size: number): string {
  if (size > 1024 * 1024) return (size / 1024 / 1024).toFixed(2) + ' MB';
  return (size / 1024).toFixed(0) + ' KB';
}

async function processOne(dir: string, file: string) {
  const full = path.join(dir, file);
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;
  // favicon / touch-icon must stay PNG
  if (/^(favicon|apple-touch-icon)/i.test(file)) return;

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
  console.log(`  ${file.padEnd(40)} ${human(before)} -> ${human(after)}`);
  await unlink(full);
}

async function processDir(dir: string) {
  let entries: import('node:fs').Dirent[] = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  const files = entries
    .filter((e) => e.isFile() && /\.(jpe?g|png)$/i.test(e.name))
    .map((e) => e.name)
    .sort();
  if (files.length) {
    console.log(`\n${path.relative(PUBLIC, dir) || '.'}: ${files.length} files`);
    for (const file of files) {
      try {
        await processOne(dir, file);
      } catch (err) {
        console.error(`  ! ${file}: ${(err as Error).message}`);
      }
    }
  }
  for (const e of entries) {
    if (e.isDirectory() && !SKIP_DIRS.has(e.name)) {
      await processDir(path.join(dir, e.name));
    }
  }
}

async function main() {
  await processDir(PUBLIC);
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
