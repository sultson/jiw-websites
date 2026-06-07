import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const logo = join(root, "logo.png");
const pub = join(root, "public");
await mkdir(pub, { recursive: true });

// Slimmed source logo at /logo.png for schema.org + sharing.
await sharp(logo).resize(512, 512, { fit: "cover" }).png({ quality: 90 }).toFile(join(pub, "logo.png"));

// Square icons straight from the logo (it is already a black 1:1 wordmark tile).
await sharp(logo).resize(64, 64, { fit: "cover" }).png().toFile(join(pub, "favicon-64.png"));
await sharp(logo).resize(180, 180, { fit: "cover" }).png().toFile(join(pub, "apple-touch-icon.png"));

// OG image: 1200x630 black canvas with the wordmark centred. The logo's own
// black background blends into the canvas, so it reads as one clean tile.
const logoOnOg = await sharp(logo).resize(520, 520, { fit: "inside" }).png().toBuffer();
await sharp({
  create: { width: 1200, height: 630, channels: 4, background: { r: 11, g: 11, b: 11, alpha: 1 } },
})
  .composite([{ input: logoOnOg, gravity: "center" }])
  .png()
  .toFile(join(pub, "og.png"));

console.log("icons + og generated");
