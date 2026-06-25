// Downscale + recompress public images to web-appropriate sizes. In place.
// Run: node scripts/optimize-images.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const img = (...x) => path.join(root, 'public/images', ...x);

async function shrink(file, maxWidth, quality, fmt = 'webp') {
  const input = await sharp(file).toBuffer();
  const meta = await sharp(input).metadata();
  let pipe = sharp(input).resize({ width: maxWidth, withoutEnlargement: true });
  if (fmt === 'webp') pipe = pipe.webp({ quality });
  else pipe = pipe.jpeg({ quality, mozjpeg: true });
  const out = await pipe.toBuffer();
  await sharp(out).toFile(file);
  const before = (meta.size ?? input.length) / 1024;
  const after = out.length / 1024;
  console.log(`${path.basename(file)}  ${before.toFixed(0)}KB -> ${after.toFixed(0)}KB  (${meta.width}px -> ${Math.min(maxWidth, meta.width ?? maxWidth)}px)`);
}

async function run() {
  await shrink(img('hero.webp'), 860, 74);
  await shrink(img('owner.webp'), 900, 80);

  const tdir = img('treatments');
  for (const f of await readdir(tdir)) {
    if (f.endsWith('.webp')) await shrink(path.join(tdir, f), 860, 72);
  }

  const bdir = img('before-after');
  for (const f of await readdir(bdir)) {
    if (f.endsWith('.webp')) await shrink(path.join(bdir, f), 1000, 74);
  }

  // OG image to the standard 1200x630 social ratio.
  await sharp(await sharp(img('og-default.jpg')).toBuffer())
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(img('og-default.jpg') + '.tmp.jpg');
  const { rename } = await import('node:fs/promises');
  await rename(img('og-default.jpg') + '.tmp.jpg', img('og-default.jpg'));
  console.log('og-default.jpg -> 1200x630');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
