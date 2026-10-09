// Regenerate specific variety shots as cut stems, not growing plants.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const API_KEY = 'n31amyHUqDm25NnCNUu52tcUjjZStVyC';
const OUT = path.resolve('assets/img');

const LOOK = 'Photorealistic editorial product photography of CUT FLOWERS that have been harvested. ' +
  'A gathered bunch of cut stems with the cut ends visible, standing in a plain bucket or laid on a ' +
  'surface, photographed indoors against a plain seamless studio backdrop. Soft diffused window light, ' +
  'shallow depth of field, muted natural colour grading, clean and airy, generous negative space, ' +
  'no text, no watermark, no logo.';

const NEG = 'growing in the ground, garden bed, flower bed, rose bush, shrub, soil, outdoors, garden, ' +
  'landscape, foliage background, leaves background, wild meadow, text, watermark, logo, letters, ' +
  'oversaturated, HDR, cartoon, illustration, 3d render, blurry, low quality';

const JOBS = [
  ['delphiniums', 'A gathered bunch of long cut blue delphinium stems, tall dense flower spires, ' +
    'bound together and standing upright in a simple grey bucket against a plain pale studio wall.'],
  ['garden-roses', 'A gathered bunch of cut open garden roses in blush and apricot, deeply ruffled ' +
    'cupped blooms on long cut stems, laid together on a plain warm cream studio surface.'],
  ['spray-roses', 'A gathered bunch of cut spray roses, several small peach and white blooms per ' +
    'stem, held together as a florist bunch against a plain cream studio backdrop.'],
  ['david-austin', 'A gathered bunch of cut David Austin style English garden roses in soft peach ' +
    'and ivory, deeply cupped rosette blooms on cut stems, arranged as a florist bunch on a plain ' +
    'cream studio backdrop.'],
];

async function gen([key, prompt], attempt = 1) {
  try {
    const res = await fetch('https://api.runware.ai/v1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
      body: JSON.stringify([{
        taskType: 'imageInference', taskUUID: crypto.randomUUID(), model: 'google:4@3',
        positivePrompt: `${prompt} ${LOOK}`, negativePrompt: NEG,
        width: 1696, height: 2528, numberResults: 1, outputFormat: 'PNG',
      }]),
    });
    const json = await res.json();
    const url = json?.data?.[0]?.imageURL;
    if (!url) throw new Error(JSON.stringify(json).slice(0, 240));
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    fs.writeFileSync(path.join(OUT, `${key}.png`), buf);
    console.log(`ok   ${key} ${(buf.length / 1024).toFixed(0)}KB`);
  } catch (e) {
    console.log(`FAIL ${key} (${attempt}): ${e.message}`);
    if (attempt < 3) { await new Promise(r => setTimeout(r, 3000 * attempt)); return gen([key, prompt], attempt + 1); }
  }
}

await Promise.all(JOBS.map(j => gen(j)));
console.log('done');
