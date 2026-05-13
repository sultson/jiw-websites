import sharp from 'sharp';
import { stat } from 'node:fs/promises';
import path from 'node:path';

const publicDir = path.resolve(process.cwd(), 'public');
const rawDir = path.join(publicDir, 'raw');
const maxEdge = 1800;

const mapping: Array<{ src: string; out: string }> = [
  { src: 'project-schilderwerk.jpg', out: 'hero-main.webp' },
  { src: 'owner-portrait.webp', out: 'owner.webp' },
  { src: 'project-dakgoot-schilderwerk.jpg', out: 'project-buiten.webp' },
  { src: 'project-dak-gevel-renovatie.jpg', out: 'project-dak.webp' },
  { src: 'project-gevelrenovatie.jpg', out: 'project-gevel.webp' },
  { src: 'gallery-6.jpg', out: 'project-binnen.webp' },
];

function human(size: number) {
  if (size > 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB`;
  return `${(size / 1024).toFixed(0)} KB`;
}

async function processOne(src: string, out: string) {
  const inPath = path.join(rawDir, src);
  const outPath = path.join(publicDir, out);
  const before = (await stat(inPath)).size;

  await sharp(inPath)
    .rotate()
    .resize({ width: maxEdge, height: maxEdge, fit: 'inside' })
    .webp({ quality: 82, effort: 6, smartSubsample: true })
    .toFile(outPath);

  const after = (await stat(outPath)).size;
  console.log(`${src.padEnd(38)} -> ${out.padEnd(24)} ${human(before)} -> ${human(after)}`);
}

async function main() {
  console.log(`Processing ${mapping.length} images from raw/ to public/`);
  for (const m of mapping) await processOne(m.src, m.out);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
