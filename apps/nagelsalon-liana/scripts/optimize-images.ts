import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import path from 'node:path';

const PUBLIC = path.resolve(process.cwd(), 'public');

const LIGHT = 82;
const HEAVY = 70;
const MAX_EDGE = 2000;
const GALLERY_EDGE = 1200;
const logoMaxEdge = 512;

function pickQuality(file: string): number {
  return /^hero/i.test(path.basename(file)) ? HEAVY : LIGHT;
}

async function human(size: number): Promise<string> {
  if (size > 1024 * 1024) return (size / 1024 / 1024).toFixed(2) + ' MB';
  return (size / 1024).toFixed(0) + ' KB';
}

async function processOne(file: string) {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;

  const base = path.basename(file);
  const before = (await stat(file)).size;
  const quality = pickQuality(file);
  const isLogo = /(^|-)logo\.png$/i.test(base);
  const isGallery = file.includes(path.sep + 'gallery' + path.sep);

  const meta = await sharp(file).metadata();
  const longest = Math.max(meta.width ?? 0, meta.height ?? 0);
  const target = isLogo ? logoMaxEdge : isGallery ? GALLERY_EDGE : MAX_EDGE;

  let pipeline = sharp(file).rotate();
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
    const tmp = file + '.tmp';
    await sharp(outBuf).toFile(tmp);
    await unlink(file);
    await rename(tmp, file);
    const after = (await stat(file)).size;
    console.log(`  ${base.padEnd(22)} ${await human(before)} → ${await human(after)}  (PNG)`);
    return;
  }

  const outWebp = file.replace(/\.(jpe?g|png)$/i, '.webp');
  await pipeline
    .webp({ quality, effort: 6, smartSubsample: true })
    .toFile(outWebp);

  const after = (await stat(outWebp)).size;
  console.log(
    `  ${path.relative(PUBLIC, outWebp).padEnd(28)} ${await human(before)} → ${await human(after)}  (WebP q${quality})`,
  );

  if (ext !== '.webp') await unlink(file);
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (/\.(jpe?g|png)$/i.test(e.name)) {
      out.push(full);
    }
  }
  return out;
}

async function main() {
  const targets = (await walk(PUBLIC)).sort();
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
