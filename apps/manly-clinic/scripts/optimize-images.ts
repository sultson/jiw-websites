import sharp from 'sharp';
import { readdir, stat, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const RAW = path.join(ROOT, 'data', 'raw-images');
const PUBLIC = path.join(ROOT, 'public');
const WORK = path.join(PUBLIC, 'work');

const QUALITY = 78;
const MAX_EDGE = 1600;

async function human(size: number): Promise<string> {
  if (size > 1024 * 1024) return (size / 1024 / 1024).toFixed(2) + ' MB';
  return (size / 1024).toFixed(0) + ' KB';
}

async function processOne(srcDir: string, outDir: string, file: string) {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;

  const full = path.join(srcDir, file);
  const before = (await stat(full)).size;
  const meta = await sharp(full).metadata();
  const longest = Math.max(meta.width ?? 0, meta.height ?? 0);

  let pipeline = sharp(full).rotate();
  if (longest > MAX_EDGE) {
    if ((meta.width ?? 0) >= (meta.height ?? 0)) pipeline = pipeline.resize({ width: MAX_EDGE });
    else pipeline = pipeline.resize({ height: MAX_EDGE });
  }

  const outName = file.replace(/\.(jpe?g|png)$/i, '.webp');
  const outPath = path.join(outDir, outName);
  await pipeline.webp({ quality: QUALITY, effort: 6, smartSubsample: true }).toFile(outPath);
  const after = (await stat(outPath)).size;
  console.log(`  ${file.padEnd(36)} ${await human(before)} → ${await human(after)}`);
}

async function processDir(srcDir: string, outDir: string) {
  let entries: string[] = [];
  try {
    entries = await readdir(srcDir);
  } catch {
    return;
  }
  const targets = entries.filter(f => /\.(jpe?g|png|webp)$/i.test(f)).sort();
  if (!targets.length) return;
  await mkdir(outDir, { recursive: true });
  console.log(`\n${path.relative(ROOT, srcDir)} → ${path.relative(ROOT, outDir)}: ${targets.length} files`);
  for (const file of targets) {
    try {
      await processOne(srcDir, outDir, file);
    } catch (err) {
      console.error(`  ! ${file}: ${(err as Error).message}`);
    }
  }
}

async function copyLogos() {
  const dest = path.join(PUBLIC, 'logo');
  await mkdir(dest, { recursive: true });
  const compactSrc = path.join(ROOT, 'logo-compact.png');
  const fullSrc = path.join(ROOT, 'logo-full.png');

  // Compact mark, used for favicon and small contexts. Resize to a clean 256.
  try {
    await sharp(compactSrc)
      .resize({ width: 256, withoutEnlargement: true })
      .png({ quality: 92, compressionLevel: 9 })
      .toFile(path.join(dest, 'manly-mark.png'));

    await sharp(compactSrc)
      .resize({ width: 800, withoutEnlargement: true })
      .png({ quality: 92, compressionLevel: 9 })
      .toFile(path.join(dest, 'manly-mark@2x.png'));

    await copyFile(compactSrc, path.join(dest, 'manly-mark-source.png'));
    console.log('Logo: manly-mark.png + @2x written');
  } catch (err) {
    console.warn(`! compact logo: ${(err as Error).message}`);
  }

  try {
    await sharp(fullSrc)
      .resize({ width: 1200, withoutEnlargement: true })
      .png({ quality: 92, compressionLevel: 9 })
      .toFile(path.join(dest, 'manly-full.png'));
    console.log('Logo: manly-full.png written');
  } catch (err) {
    console.warn(`! full logo: ${(err as Error).message}`);
  }
}

async function main() {
  await processDir(RAW, WORK);
  await copyLogos();
  console.log('\nDone.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
