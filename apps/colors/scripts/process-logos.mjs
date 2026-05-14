// One-off image processing for colors app brand assets.
// Run via: node apps/colors/scripts/process-logos.mjs
// Uses sharp resolved from apps/kwast-exact/node_modules (workspace co-located).
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");
const sharpPath = path.join(repoRoot, "apps/kwast-exact/node_modules/sharp/lib/index.js");
const { default: sharp } = await import(pathToFileURL(sharpPath).href);

const SRC = path.resolve(__dirname, "..");
const OUT = path.join(SRC, "public");

const fullSrc = path.join(SRC, "colors-full.png");
const compactSrc = path.join(SRC, "colors-compact.png");
const monoSrc = path.join(SRC, "colors-compact-mono.png");

// Trim transparent padding from a source buffer, then return a sharp instance.
async function trimmed(src) {
  const buf = await sharp(src).trim().toBuffer({ resolveWithObject: true });
  return { data: buf.data, info: buf.info };
}

async function run() {
  // 1) logo-full.webp (max 1600w, q88, transparent)
  {
    const { data } = await trimmed(fullSrc);
    await sharp(data)
      .resize({ width: 1600, withoutEnlargement: true, fit: "inside" })
      .webp({ quality: 88, alphaQuality: 100 })
      .toFile(path.join(OUT, "logo-full.webp"));
  }

  // 2) logo-full.png (transparent, lossless trimmed, capped at 1600w for retina)
  {
    const { data } = await trimmed(fullSrc);
    await sharp(data)
      .resize({ width: 1600, withoutEnlargement: true, fit: "inside" })
      .png({ compressionLevel: 9, palette: false })
      .toFile(path.join(OUT, "logo-full.png"));
  }

  // 3) logo-mark.png — compact-mono at 96x96, fit inside, transparent bg
  {
    const { data } = await trimmed(monoSrc);
    await sharp(data)
      .resize({
        width: 96,
        height: 96,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT, "logo-mark.png"));
  }

  // 4) logo-compact.webp — compact color, max 600w
  {
    const { data } = await trimmed(compactSrc);
    await sharp(data)
      .resize({ width: 600, withoutEnlargement: true, fit: "inside" })
      .webp({ quality: 90, alphaQuality: 100 })
      .toFile(path.join(OUT, "logo-compact.webp"));
  }

  // 5) favicon-64.png — 64x64 from compact-mono
  {
    const { data } = await trimmed(monoSrc);
    await sharp(data)
      .resize({
        width: 64,
        height: 64,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT, "favicon-64.png"));
  }

  // 6) favicon-32.png — 32x32 from compact-mono
  {
    const { data } = await trimmed(monoSrc);
    await sharp(data)
      .resize({
        width: 32,
        height: 32,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT, "favicon-32.png"));
  }

  // 7) apple-touch-icon.png — 180x180 from compact (color)
  {
    const { data } = await trimmed(compactSrc);
    await sharp(data)
      .resize({
        width: 180,
        height: 180,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT, "apple-touch-icon.png"));
  }

  // 8) og.webp — 1200x630, full logo on neutral cream background.
  // Brand palette is multi-color (red/yellow/blue/orange/green), so a neutral
  // cream (#f5f0e6) reads as clean and lets the logo carry the color.
  {
    const bgWidth = 1200;
    const bgHeight = 630;
    const cream = { r: 0xf5, g: 0xf0, b: 0xe6, alpha: 1 };
    // Resize the logo to fit nicely inside with breathing room.
    const { data: logo } = await sharp((await trimmed(fullSrc)).data)
      .resize({ width: Math.round(bgWidth * 0.55), fit: "inside" })
      .toBuffer({ resolveWithObject: true })
      .then((r) => ({ data: r.data, info: r.info }));

    await sharp({
      create: {
        width: bgWidth,
        height: bgHeight,
        channels: 4,
        background: cream,
      },
    })
      .composite([{ input: logo, gravity: "center" }])
      .webp({ quality: 90 })
      .toFile(path.join(OUT, "og.webp"));
  }

  console.log("Done. Files written to:", OUT);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
