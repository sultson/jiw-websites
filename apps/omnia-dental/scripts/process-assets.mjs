// Process brand assets: knock the black background out of the gold logo mark,
// convert the owner photo, and emit a favicon. Run: node scripts/process-assets.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const p = (...x) => path.join(root, ...x);

async function logoToTransparent(size, out) {
  const src = p('omnia-dental-logo.png');
  const { data, info } = await sharp(src)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0 } })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const out4 = Buffer.alloc(width * height * 4);
  for (let i = 0, j = 0; i < data.length; i += channels, j += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // Luminance drives alpha: black background -> transparent, gold -> opaque.
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    let a = Math.round(Math.min(255, (luma - 18) * 1.9));
    if (a < 0) a = 0;
    out4[j] = r;
    out4[j + 1] = g;
    out4[j + 2] = b;
    out4[j + 3] = a;
  }
  await sharp(out4, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(p('public/images', out));
  console.log('wrote', out, `${width}x${height}`);
}

async function run() {
  await logoToTransparent(512, 'omnia-logo-mark.png');

  // Favicon: 64px transparent mark.
  await sharp(p('public/images/omnia-logo-mark.png'))
    .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(p('public/favicon.png'));
  console.log('wrote favicon.png');

  // Owner portrait -> optimized webp.
  await sharp(p('owner.png'))
    .resize(1000, 1250, { fit: 'cover', position: 'top' })
    .webp({ quality: 86 })
    .toFile(p('public/images/owner.webp'));
  console.log('wrote owner.webp');

  // Root canal illustration provided in the brief -> treatment image.
  await sharp(p('wortelkanaalbehandeling.png'))
    .resize(1536, 1024, { fit: 'cover' })
    .webp({ quality: 85 })
    .toFile(p('public/images/treatments/wortelkanaalbehandeling.webp'));
  console.log('wrote treatments/wortelkanaalbehandeling.webp');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
