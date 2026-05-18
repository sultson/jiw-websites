// Cuts the flat dark background out of the supplied brand logos so the white +
// orange artwork can sit on any surface, and produces the favicon assets.
import sharp from 'sharp';
import path from 'node:path';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'source-assets');
const LOGOS = path.join(ROOT, 'public', 'logos');
const PUBLIC = path.join(ROOT, 'public');

// Distance-keyed transparency: pixels close to the background colour become
// transparent, with a feathered band so anti-aliased edges stay smooth.
const INNER = 24; // fully transparent below this channel distance
const OUTER = 78; // fully opaque above this

async function keyOut(srcFile: string, outFile: string) {
  const src = path.join(SRC, srcFile);
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  // Background sample = average of the four corners.
  const corners = [
    0,
    (width - 1) * channels,
    (height - 1) * width * channels,
    ((height - 1) * width + (width - 1)) * channels,
  ];
  let br = 0, bg = 0, bb = 0;
  for (const c of corners) {
    br += data[c];
    bg += data[c + 1];
    bb += data[c + 2];
  }
  br /= 4; bg /= 4; bb /= 4;

  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += channels) {
    const d = Math.max(
      Math.abs(out[i] - br),
      Math.abs(out[i + 1] - bg),
      Math.abs(out[i + 2] - bb),
    );
    let a = 255;
    if (d <= INNER) a = 0;
    else if (d < OUTER) a = Math.round(((d - INNER) / (OUTER - INNER)) * 255);
    out[i + 3] = Math.min(out[i + 3], a);
  }

  await sharp(out, { raw: { width, height, channels } })
    .trim({ threshold: 6 })
    .png({ compressionLevel: 9 })
    .toFile(path.join(LOGOS, outFile));
  console.log(`  ${srcFile.padEnd(28)} -> logos/${outFile}`);
}

async function favicon() {
  const src = path.join(SRC, 'at-logo.png'); // white mark on orange square
  await sharp(src).resize(64, 64).png().toFile(path.join(PUBLIC, 'favicon-64.png'));
  await sharp(src).resize(180, 180).png().toFile(path.join(PUBLIC, 'apple-touch-icon.png'));
  console.log('  favicon-64.png + apple-touch-icon.png');
}

async function main() {
  await keyOut('at-logo-full.png', 'at-full.png');
  await keyOut('at-logo-black.png', 'at-mark.png');
  await keyOut('ay-flex-logo-full.png', 'ay-full.png');
  await keyOut('ay-flex-logo-black.png', 'ay-mark.png');
  await favicon();
  console.log('\nLogos done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
