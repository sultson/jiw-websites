// Re-shoot every variety with ONE art direction so the catalogue reads as a single shoot.
// Fixed: grower's bucket, seamless warm-cream backdrop, straight-on, light from the left.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const API_KEY = 'n31amyHUqDm25NnCNUu52tcUjjZStVyC';
const OUT = path.resolve('assets/img');

const LOOK =
  'Shot on a seamless warm cream studio backdrop (#F1EBE0), the SAME backdrop in every frame. ' +
  'The bunch stands upright, centred, straight-on eye-level camera, filling the middle third of the ' +
  'frame with generous empty backdrop above and to the sides. Soft diffused studio light from the ' +
  'left, one soft shadow falling to the right on the floor. Photorealistic editorial product ' +
  'photography, sharp focus on the flower heads, muted natural colour grading, subtle film grain, ' +
  'no props, no vase, no table, no text, no watermark, no logo, no people, no hands.';

const NEG =
  'growing in the ground, garden bed, flower bed, shrub, soil, outdoors, garden, landscape, meadow, ' +
  'greenhouse, vase, glass vase, jug, table, wooden surface, linen cloth, hands, people, props, ' +
  'busy background, patterned background, dark background, white blown-out background, text, ' +
  'watermark, logo, letters, oversaturated, HDR, cartoon, illustration, 3d render, blurry, low quality';

const bucket = 'gathered into one tight grower bunch, cut stems bound with a rubber band, standing ' +
  'upright in a plain matte black plastic flower bucket';

const JOBS = [
  ['solidago', `A bunch of golden yellow solidago goldenrod, feathery plumes, ${bucket}.`],
  ['eucalyptus-baby-blue', `A bunch of baby blue eucalyptus foliage, small round powder-blue leaves, ${bucket}.`],
  ['eucalyptus-silver-dollar', `A bunch of silver dollar eucalyptus, large round silvery-green leaves, ${bucket}.`],
  ['limonium', `A bunch of lavender purple limonium sea lavender, airy sprays of tiny papery flowers, ${bucket}.`],
  ['statice', `A bunch of statice limonium sinuatum mixing purple, white, apricot and yellow papery clustered blooms on winged stems, ${bucket}.`],
  ['gypsophila', `A bunch of white gypsophila babys breath, a dense cloud of tiny white blooms, ${bucket}.`],
  ['carnations', `A bunch of single standard carnations in dusty pink and cream, ruffled petals, one bloom per stem, ${bucket}.`],
  ['spray-carnations', `A bunch of spray carnations, several smaller coral, white and burgundy blooms per stem, ${bucket}.`],
  ['chrysanthemums', `A bunch of spray chrysanthemums in white and bronze, daisy form blooms, ${bucket}.`],
  ['hydrangeas', `A bunch of antique blue and sage green hydrangeas, large mophead blooms, ${bucket}.`],
  ['delphiniums', `A bunch of tall blue delphinium spires, densely packed florets, ${bucket}.`],
  ['eryngium', `A bunch of steel blue eryngium sea holly, spiky metallic bracts, ${bucket}.`],
  ['roses', `A bunch of premium long stem red and blush roses, tight elegant heads, ${bucket}.`],
  ['spray-roses', `A bunch of spray roses, several small peach and white blooms per stem, ${bucket}.`],
  ['garden-roses', `A bunch of open garden roses in blush and apricot, ruffled cupped blooms, ${bucket}.`],
  ['david-austin', `A bunch of David Austin style English garden roses in soft peach and ivory, deeply cupped rosette blooms, ${bucket}.`],
];

const only = process.argv.slice(2);
const jobs = only.length ? JOBS.filter(j => only.includes(j[0])) : JOBS;

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
    if (buf.length < 20000) throw new Error('tiny file');
    fs.writeFileSync(path.join(OUT, `${key}.png`), buf);
    console.log(`ok   ${key} ${(buf.length / 1024).toFixed(0)}KB`);
  } catch (e) {
    console.log(`FAIL ${key} (${attempt}): ${e.message}`);
    if (attempt < 3) { await new Promise(r => setTimeout(r, 3000 * attempt)); return gen([key, prompt], attempt + 1); }
  }
}

const Q = [...jobs];
await Promise.all(Array.from({ length: 4 }, async () => { while (Q.length) await gen(Q.shift()); }));
console.log('done');
