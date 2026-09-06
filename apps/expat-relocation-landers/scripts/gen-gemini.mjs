/**
 * Photography generator for the landers, on Gemini (Nano Banana Pro).
 *
 * Runware ran out of credits mid-project, so this is the second generator in
 * scripts/. Same contract as gen-ph-v3.mjs: it reads a SHOTS list, writes
 * `<name>.jpg` at 1264w into image-candidates/, and never touches public/.
 *
 * Usage: node scripts/gen-gemini.mjs <shots-file.mjs>
 * The shots file default-exports { STYLE, SHOTS: [{ name, prompt, ratio? }] }.
 */
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) throw new Error('GEMINI_API_KEY is not set. Run: set -a && source ../../.env && set +a');

const MODEL = 'gemini-3-pro-image-preview';
const API = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const OUT = new URL('../image-candidates/', import.meta.url);

const shotsFile = process.argv[2];
if (!shotsFile) throw new Error('Usage: node scripts/gen-gemini.mjs <shots-file.mjs>');
const { STYLE, SHOTS } = await import(new URL(shotsFile, `file://${process.cwd()}/`).href);

/** One attempt. Returns the JPEG bytes, or throws with the API's own message. */
async function once(shot) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${shot.prompt} ${STYLE}` }] }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: { aspectRatio: shot.ratio ?? '3:2', imageSize: '2K' },
      },
    }),
    signal: AbortSignal.timeout(300000),
  });
  const json = await res.json();
  const part = json?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData || p.inline_data);
  const data = part?.inlineData?.data ?? part?.inline_data?.data;
  if (!data) throw new Error(JSON.stringify(json).slice(0, 400));
  return Buffer.from(data, 'base64');
}

async function run(shot) {
  for (let i = 0; i < 3; i++) {
    try {
      const buf = await once(shot);
      await writeFile(
        new URL(`${shot.name}.jpg`, OUT),
        await sharp(buf).resize({ width: 1264 }).jpeg({ quality: 82, mozjpeg: true }).toBuffer(),
      );
      return `${shot.name} ok`;
    } catch (e) {
      if (i === 2) return `FAILED ${shot.name}: ${e.message}`;
      await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
    }
  }
}

// Gemini rate-limits hard on parallel image requests, so this runs a small
// pool rather than firing the whole list at once.
const POOL = 4;
const queue = [...SHOTS];
const results = [];
await Promise.all(
  Array.from({ length: POOL }, async () => {
    for (let shot = queue.shift(); shot; shot = queue.shift()) {
      const r = await run(shot);
      console.log(r);
      results.push(r);
    }
  }),
);
