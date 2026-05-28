import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import path from 'node:path';

const PUBLIC = path.resolve(process.cwd(), 'public');

const LIGHT = 82;
const HEAVY = 72;
const MAX_EDGE = 1800;
const logoMaxEdge = 512;

function pickQuality(file: string): number {
  return file.startsWith('hero') ? HEAVY : LIGHT;
}

async function human(size: number): Promise<string> {
  if (size > 1024 * 1024) return (size / 1024 / 1024).toFixed(2) + ' MB';
  return (size / 1024).toFixed(0) + ' KB';
}

async function processOne(dir: string, file: string) {
  const full = path.join(dir, file);
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
    const outBuf = await pipeline
      .png({ compressionLevel: 9, palette: true, effort: 10 })
      .toBuffer();
    const tmp = full + '.tmp';
    await sharp(outBuf).toFile(tmp);
    await unlink(full);
    await rename(tmp, full);
    const after = (await stat(full)).size;
    console.log(`  ${file.padEnd(38)} ${await human(before)} → ${await human(after)}  (PNG)`);
    return;
  }

  const outWebp = path.join(dir, file.replace(/\.(jpe?g|png)$/i, '.webp'));
  await pipeline
    .webp({ quality, effort: 6, smartSubsample: true })
    .toFile(outWebp);

  const after = (await stat(outWebp)).size;
  console.log(
    `  ${file.padEnd(38)} ${await human(before)} → ${await human(after)}  (WebP q${quality})`,
  );

  if (ext !== '.webp') await unlink(full);
}

async function walk(dir: string) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory()) await walk(path.join(dir, e.name));
    else if (/\.(jpe?g|png|webp)$/i.test(e.name)) {
      try {
        await processOne(dir, e.name);
      } catch (err) {
        console.error(`  ! ${e.name}: ${(err as Error).message}`);
      }
    }
  }
}

async function main() {
  console.log(`Compressing images under ${PUBLIC}\n`);
  await walk(PUBLIC);
  console.log('\nDone.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
