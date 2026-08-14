/*
 * Photos arrived from the client as 106 JPEGs, up to 412 KB each, served at full
 * size to every device and with no intrinsic dimensions in the markup — so a
 * phone downloaded a 1600px file to paint a 350px card, and the layout jumped
 * while it did. This converts them to WebP at two widths and records each one's
 * real size in src/image-manifest.json, which <Photo> turns into srcset +
 * width/height.
 *
 * Idempotent: sources are consumed, and the manifest is rebuilt by measuring
 * whatever WebP files are on disk, so re-running is a no-op.
 *
 *   pnpm --filter @jiw/winterswijkvakantiehuis optimize-images
 */
import sharp from 'sharp';
import { readdir, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

const IMG_DIR = path.resolve(process.cwd(), 'public/img');
const MANIFEST = path.resolve(process.cwd(), 'src/image-manifest.json');

/** Nothing on the site is displayed wider than this, hero included. */
const MAX_EDGE = 1600;
/** Widths a browser can pick between, next to the full-size file. 640 covers a
    phone at 2x; 1024 covers a card in a three-column grid at 2x, which would
    otherwise jump straight to the 1600px file. */
const VARIANT_WIDTHS = [640, 1024];
/* These sources are already-compressed JPEGs, so re-encoding is lossy on lossy
   and a grainy photo can come out *larger* than it went in. 74 keeps that to a
   handful of files; anything that still grows is logged rather than hidden. */
const QUALITY = 74;

/** `name-640w.webp` — a derivative, not an image the site refers to directly.
    The trailing `w` matters: plenty of the client's photos are already named
    `jonkersweg-10.webp`, and a bare `-<digits>` suffix would swallow them. */
const VARIANT = /-\d+w\.webp$/;
const variantName = (file: string, width: number) => file.replace(/\.webp$/, `-${width}w.webp`);

function human(size: number): string {
  return size > 1024 * 1024 ? `${(size / 1024 / 1024).toFixed(2)} MB` : `${(size / 1024).toFixed(0)} KB`;
}

async function convertSources(files: string[]): Promise<number> {
  let saved = 0;
  for (const file of files) {
    const full = path.join(IMG_DIR, file);
    const before = (await stat(full)).size;
    const meta = await sharp(full).metadata();
    const longest = Math.max(meta.width ?? 0, meta.height ?? 0);

    let pipeline = sharp(full).rotate();
    if (longest > MAX_EDGE) {
      pipeline = (meta.width ?? 0) >= (meta.height ?? 0)
        ? pipeline.resize({ width: MAX_EDGE })
        : pipeline.resize({ height: MAX_EDGE });
    }

    const out = path.join(IMG_DIR, file.replace(/\.(jpe?g|png)$/i, '.webp'));
    await pipeline.webp({ quality: QUALITY, effort: 6, smartSubsample: true }).toFile(out);
    const after = (await stat(out)).size;
    saved += before - after;
    const verdict = after > before ? '  (larger — grainy source)' : '';
    console.log(`  ${file.padEnd(34)} ${human(before).padStart(8)} -> ${human(after).padStart(8)}${verdict}`);
    await unlink(full);
  }
  return saved;
}

async function buildVariants(bases: string[]): Promise<void> {
  for (const file of bases) {
    const full = path.join(IMG_DIR, file);
    const { width } = await sharp(full).metadata();
    if (!width) continue;

    for (const target of VARIANT_WIDTHS) {
      if (width <= target) continue;
      const out = path.join(IMG_DIR, variantName(file, target));
      try {
        await stat(out);
        continue; // already generated on an earlier run
      } catch {
        // not there yet
      }
      await sharp(full).resize({ width: target }).webp({ quality: QUALITY, effort: 6 }).toFile(out);
      console.log(`  + ${path.basename(out)}`);
    }
  }
}

/**
 * `"/img/hero-park.webp": [1600, 973, 640, 1024]` — intrinsic width, intrinsic
 * height, then every smaller width that exists as `<name>-<width>w.webp`.
 */
async function buildManifest(bases: string[]): Promise<Record<string, number[]>> {
  const present = new Set(await readdir(IMG_DIR));
  const manifest: Record<string, number[]> = {};

  for (const file of bases.sort()) {
    const { width, height } = await sharp(path.join(IMG_DIR, file)).metadata();
    if (!width || !height) continue;
    const variants = VARIANT_WIDTHS.filter(
      (w) => w < width && present.has(variantName(file, w)),
    );
    manifest[`/img/${file}`] = [width, height, ...variants];
  }
  return manifest;
}

const entries = await readdir(IMG_DIR);
const sources = entries.filter((file) => /\.(jpe?g|png)$/i.test(file)).sort();

if (sources.length) {
  console.log(`Converting ${sources.length} source images to WebP:`);
  const saved = await convertSources(sources);
  console.log(`\nSaved ${human(saved)}.`);
} else {
  console.log('No JPEG/PNG sources left to convert.');
}

const bases = (await readdir(IMG_DIR)).filter((file) => file.endsWith('.webp') && !VARIANT.test(file));
console.log(`\nBuilding ${VARIANT_WIDTHS.join('px / ')}px variants:`);
await buildVariants(bases);

const manifest = await buildManifest(bases);
await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`\nWrote ${path.relative(process.cwd(), MANIFEST)} with ${Object.keys(manifest).length} entries.`);
