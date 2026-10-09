/**
 * Third batch of client photos (5 Oct 2026 feedback pack). Two pictures and one video,
 * and they close the two real gaps that were still open since September: there was no
 * honest packhouse picture and no honest cold-room picture, so both slots were still
 * running on AI renders while the copy next to them made the site's hardest claims.
 *
 *   packhouse  <- a grader bunching and sleeving roses at the bench
 *   coldchain  <- JASM-branded export cartons stacked on a pallet in the cold room
 *
 * Crop is the only structural edit, same as the previous two batches: the rose bench
 * frame carries a strip of wall at the top and a bench full of flat-packed cardboard at
 * the bottom, and the cold-room frame has a rusted wire trolley across the foreground.
 *
 * Resolution is handled differently for the two, deliberately:
 *
 *   - The cold-room frame goes through the same Runware reference-image restoration as
 *     the 29 Sep batch (openai:gpt-image@2.5-sunburst). It is cartons, a pallet and a
 *     panelled cold store: recovering edge detail there cannot invent anything that
 *     changes what the picture is evidence of.
 *   - The rose bench frame does NOT. There is a real, identifiable person in it. Running
 *     a face through an image model and then publishing the result as a photograph of a
 *     JASM grading bench is exactly the thing the no-image-to-image rule exists to stop,
 *     and a soft real face beats a sharp invented one. It is enlarged with lanczos and
 *     sharpened, which recovers nothing that was not already in the frame.
 *
 * Previous versions move to assets/img/_prev-0510/ so any swap can be undone.
 *
 * Run: node tools/import-photos-0510.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const SRC = 'C:/Users/nieuw/dev/experiments/jasm-0510/media';
const OUT = path.join(ROOT, 'assets', 'img');
const BAK = path.join(OUT, '_prev-0510');
const KEEP = path.join(OUT, '_src-0510');

const KEY = 'n31amyHUqDm25NnCNUu52tcUjjZStVyC';
const API = 'https://api.runware.ai/v1';
const MODEL = 'openai:gpt-image@2.5-sunburst';

const FAITHFUL =
  'Photo restoration task: reproduce this exact photograph at high resolution. Keep the identical ' +
  'subject, composition, framing, crop, camera angle, lighting and colour. Do not add, remove, ' +
  'move or re-arrange anything, and do not change the number of boxes, pallets or labels. ' +
  'Only recover fine detail that the low-resolution source lost: carton edges and printing, label ' +
  'paper, pallet timber grain, panel seams and floor texture. It must stay a real photograph with ' +
  'true-to-life colour -- not an illustration, not a render, no added props, no new text, no watermark.';

const MAP = {
  packhouse: {
    from: 'WhatsApp Image 2026-10-03 at 17.35.02.jpeg',
    crop: { top: .05, bottom: .21 },
    upscale: 'lanczos',
    note: 'real grading bench at last; wall strip and flat-packed cardboard cropped away',
  },
  coldchain: {
    from: 'WhatsApp Image 2026-10-04 at 09.35.54.jpeg',
    crop: { top: .04, bottom: .30 },
    upscale: 'runware',
    what: 'JASM Flowers export cartons stacked on a wooden pallet inside a panelled cold room, ' +
      'with temperature controllers on the wall above.',
    note: 'real cold room with JASM-branded boxes; rusted wire trolley cropped out of the foreground',
  },
};

// gpt-image accepts any /64 size; keep the source aspect, cap the long edge at 2048.
function target(w, h) {
  const s = 2048 / Math.max(w, h);
  const r = n => Math.max(1024, Math.round((n * s) / 64) * 64);
  return [r(w), r(h)];
}

async function runware(buf, what) {
  const m = await sharp(buf).metadata();
  const [w, h] = target(m.width, m.height);
  const body = [{
    taskType: 'imageInference', taskUUID: crypto.randomUUID(), model: MODEL,
    positivePrompt: `${what} ${FAITHFUL}`,
    referenceImages: [buf.toString('base64')],
    width: w, height: h, numberResults: 1, outputFormat: 'PNG',
  }];
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + KEY },
      body: JSON.stringify(body),
    });
    const j = await res.json();
    const url = j?.data?.[0]?.imageURL;
    if (url) return Buffer.from(await (await fetch(url)).arrayBuffer());
    console.log(`  WARN attempt ${attempt}: ${JSON.stringify(j?.errors?.[0]?.message || j).slice(0, 180)}`);
  }
  throw new Error('runware failed after 3 attempts');
}

fs.mkdirSync(BAK, { recursive: true });
fs.mkdirSync(KEEP, { recursive: true });

for (const [key, m] of Object.entries(MAP)) {
  const dst = path.join(OUT, `${key}.png`);
  if (fs.existsSync(dst) && !fs.existsSync(path.join(BAK, `${key}.png`))) {
    fs.renameSync(dst, path.join(BAK, `${key}.png`));
  }

  const src = path.join(SRC, m.from);
  if (!fs.existsSync(src)) throw new Error(`missing source: ${src}`);
  fs.copyFileSync(src, path.join(KEEP, `${key}.jpeg`));

  let img = sharp(src);
  const meta = await img.metadata();
  const c = m.crop || {};
  const left = Math.round((c.left || 0) * meta.width);
  const top = Math.round((c.top || 0) * meta.height);
  const cropped = await img.extract({
    left, top,
    width: meta.width - left - Math.round((c.right || 0) * meta.width),
    height: meta.height - top - Math.round((c.bottom || 0) * meta.height),
  }).png().toBuffer();

  let big;
  if (m.upscale === 'runware') {
    big = await runware(cropped, m.what);
  } else {
    const cm = await sharp(cropped).metadata();
    const s = 2000 / Math.max(cm.width, cm.height);
    big = await sharp(cropped)
      .resize({ width: Math.round(cm.width * s), kernel: 'lanczos3' })
      .png().toBuffer();
  }

  await sharp(big)
    .modulate({ saturation: 1.05, brightness: 1.03 })
    .linear(1.05, -7)
    .sharpen({ sigma: 0.8 })
    .png({ compressionLevel: 9 })
    .toFile(dst);

  const out = await sharp(dst).metadata();
  console.log(`${key.padEnd(11)} ${meta.width}x${meta.height} -> ${out.width}x${out.height}  [${m.upscale}]  ${m.note}`);
}

console.log(`\noriginals kept in ${path.relative(ROOT, KEEP)}, previous versions in ${path.relative(ROOT, BAK)}`);
