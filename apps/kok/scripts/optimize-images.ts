import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import path from 'node:path';

const PUBLIC = path.resolve(process.cwd(), 'public');
const SHOWCASE = path.join(PUBLIC, 'showcase');
const LOGO = path.join(PUBLIC, 'logo');

const QUALITY = 78;
const HERO_QUALITY = 70;
const SHOWCASE_MAX_EDGE = 1600;
const HERO_MAX_EDGE = 2000;
const LOGO_MAX_EDGE = 640;

async function human(size: number): Promise<string> {
  if (size > 1024 * 1024) return (size / 1024 / 1024).toFixed(2) + ' MB';
  return (size / 1024).toFixed(0) + ' KB';
}

async function processOne(dir: string, file: string, mode: 'photo' | 'logo' | 'hero') {
  const full = path.join(dir, file);
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;

  const before = (await stat(full)).size;
  const meta = await sharp(full).metadata();
  const longest = Math.max(meta.width ?? 0, meta.height ?? 0);
  const target = mode === 'logo' ? LOGO_MAX_EDGE : mode === 'hero' ? HERO_MAX_EDGE : SHOWCASE_MAX_EDGE;

  let pipeline = sharp(full).rotate();
  if (longest > target) {
    if ((meta.width ?? 0) >= (meta.height ?? 0)) {
      pipeline = pipeline.resize({ width: target });
    } else {
      pipeline = pipeline.resize({ height: target });
    }
  }

  if (mode === 'logo' && ext === '.png') {
    const outBuf = await pipeline
      .png({ compressionLevel: 9, palette: true, effort: 10 })
      .toBuffer();
    const tmp = full + '.tmp';
    await sharp(outBuf).toFile(tmp);
    await unlink(full);
    await rename(tmp, full);
    const after = (await stat(full)).size;
    console.log(`  ${file.padEnd(28)} ${await human(before)} → ${await human(after)}  (PNG)`);
    return;
  }

  const quality = mode === 'hero' ? HERO_QUALITY : QUALITY;
  const outWebp = path.join(dir, file.replace(/\.(jpe?g|png)$/i, '.webp'));
  await pipeline
    .webp({ quality, effort: 6, smartSubsample: true })
    .toFile(outWebp);

  const after = (await stat(outWebp)).size;
  console.log(
    `  ${file.padEnd(28)} ${await human(before)} → ${await human(after)}  (WebP q${quality})`,
  );

  if (ext !== '.webp') await unlink(full);
}

async function processDir(dir: string, mode: 'photo' | 'logo' | 'hero') {
  let entries: string[] = [];
  try {
    entries = await readdir(dir);
  } catch {
    return;
  }
  const targets = entries.filter(f => /\.(jpe?g|png)$/i.test(f)).sort();
  if (!targets.length) return;
  console.log(`\n${path.relative(PUBLIC, dir) || '.'} (${mode}): ${targets.length} files`);
  for (const file of targets) {
    try {
      await processOne(dir, file, mode);
    } catch (err) {
      console.error(`  ! ${file}: ${(err as Error).message}`);
    }
  }
}

async function main() {
  await processDir(SHOWCASE, 'photo');
  await processDir(LOGO, 'logo');
  await processDir(PUBLIC, 'photo');
  console.log('\nDone.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
