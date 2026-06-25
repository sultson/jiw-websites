// One-off: make a WIDE (3:2) version of the portrait hero photo, keeping the
// same woman, so the desktop hero can run edge-to-edge without zoom-cropping.
// Feeds the existing hero.webp to gpt-image@2 as a reference image.
import { readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

const API = 'https://api.runware.ai/v1';
const KEY = process.env.RUNWARE_API_KEY || 'n31amyHUqDm25NnCNUu52tcUjjZStVyC';
const root = new URL('../public/images/', import.meta.url);

const refBuf = await readFile(new URL('hero.webp', root));
const ref = `data:image/webp;base64,${refBuf.toString('base64')}`;

const prompt =
  'Wide landscape editorial photograph extending this exact scene: the same young woman with light blonde hair tied back and a cream knit sweater, relaxed genuine healthy smile, seated in a sage-green dental chair in a bright modern Dutch dental practice with soft plants and clean cabinetry. Keep her likeness and the warm cream-and-sage palette. Compose her on the LEFT third of a wide frame, with the calm bright clinic interior opening up to the right. Soft natural daylight, shallow depth of field, premium trustworthy healthcare photography, photorealistic, no text, no watermark, no logo, no signage.';

async function gen(refImages) {
  const body = [{
    taskType: 'imageInference',
    taskUUID: randomUUID(),
    model: 'openai:gpt-image@2',
    positivePrompt: prompt,
    ...(refImages ? { referenceImages: [ref] } : {}),
    width: 1536,
    height: 1024,
    numberResults: 1,
    outputFormat: 'WEBP',
  }];
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  return json;
}

let json = await gen(true);
let url = json?.data?.[0]?.imageURL;
if (!url) {
  console.error('referenceImages attempt failed:', JSON.stringify(json).slice(0, 400));
  console.error('retrying without reference (text-to-image)…');
  json = await gen(false);
  url = json?.data?.[0]?.imageURL;
}
if (!url) {
  console.error('FAILED:', JSON.stringify(json).slice(0, 600));
  process.exit(1);
}
const img = Buffer.from(await (await fetch(url)).arrayBuffer());
await writeFile(new URL('hero-wide.webp', root), img);
console.log('OK hero-wide.webp', img.length, 'bytes  source:', url);
