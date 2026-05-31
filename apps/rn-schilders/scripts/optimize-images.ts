import sharp from 'sharp';
import { readdir, rename, stat, unlink } from 'node:fs/promises';
import path from 'node:path';

const publicDir = path.resolve(process.cwd(), 'public');
const maxEdge = 1800;

// Real PNG/ICO icons that must stay PNG. Google's search-result favicon and
// Apple touch icon are not reliably served as WebP, so keep these untouched —
// converting them to .webp (and deleting the source) 404s the favicon.
const keepAsIs = new Set(['favicon-64.png', 'apple-touch-icon.png']);

async function human(size: number) {
  if (size > 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB`;
  return `${(size / 1024).toFixed(0)} KB`;
}

async function processOne(file: string) {
  const full = path.join(publicDir, file);
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;
  if (keepAsIs.has(file)) return;

  const before = (await stat(full)).size;
  const meta = await sharp(full).metadata();
  const longest = Math.max(meta.width ?? 0, meta.height ?? 0);
  const resize = longest > maxEdge ? { width: maxEdge, height: maxEdge, fit: 'inside' as const } : undefined;
  const outWebp = path.join(publicDir, file.replace(/\.(jpe?g|png)$/i, '.webp'));
  const tmp = ext === '.webp' ? `${full}.tmp` : outWebp;

  await sharp(full).rotate().resize(resize).webp({ quality: 82, effort: 6, smartSubsample: true }).toFile(tmp);

  if (ext === '.webp') {
    await unlink(full);
    await rename(tmp, full);
  } else {
    await unlink(full);
  }

  const after = (await stat(ext === '.webp' ? full : outWebp)).size;
  console.log(`${file.padEnd(28)} ${await human(before)} -> ${await human(after)}`);
}

async function main() {
  const files = (await readdir(publicDir)).filter((file) => /\.(jpe?g|png|webp)$/i.test(file)).sort();
  console.log(`Optimizing ${files.length} images in public/`);
  for (const file of files) await processOne(file);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
