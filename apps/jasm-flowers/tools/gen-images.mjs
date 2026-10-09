// Generates all site imagery via Runware. Run: node tools/gen-images.mjs [onlyKey]
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const API_KEY = 'n31amyHUqDm25NnCNUu52tcUjjZStVyC';
const API_URL = 'https://api.runware.ai/v1';
const MODEL = 'google:4@3';
const OUT = path.resolve('assets/img');
fs.mkdirSync(OUT, { recursive: true });

const LOOK =
  'Photorealistic editorial photography, natural diffused daylight, crisp focus on the flowers, ' +
  'shallow depth of field, clean airy composition, muted natural colour grading, subtle film grain, ' +
  'no text, no watermark, no logo, no people looking at camera.';

const NEG =
  'text, watermark, logo, signature, caption, letters, words, ugly, oversaturated, HDR, cartoon, ' +
  'illustration, 3d render, plastic, distorted petals, blurry, low quality, cluttered, messy background';

// google:4@3 only accepts a fixed set of dimensions.
// Landscape 3:2 = 2528x1696, portrait 2:3 = 1696x2528, small landscape = 1264x848.
// [key, w, h, prompt]
const JOBS = [
  ['hero-field', 2528, 1696,
    'Wide establishing shot of a highland cut-flower farm in Kenya at golden hour. Long neat rows of ' +
    'golden solidago and purple limonium stretching to the horizon, distant volcanic hills and acacia ' +
    'silhouettes under a soft warm sky, low sun flare, red-brown volcanic soil between the beds.'],
  ['hero-bunch', 1696, 2528,
    'Editorial still life from above: a florist bunch of silver dollar eucalyptus, baby blue eucalyptus, ' +
    'golden solidago and lavender limonium laid on a warm oatmeal linen cloth, soft window light from the ' +
    'left, generous negative space, muted sage and cream palette.'],
  ['greenhouse', 2528, 1696,
    'Interior of a bright commercial flower greenhouse in the Kenyan highlands, long rows of solidago in ' +
    'full bloom under a translucent polytunnel roof, soft diffused light, vanishing point perspective, ' +
    'gravel path down the centre.'],
  ['packhouse', 2528, 1696,
    'Interior of a clean modern flower grading and bunching packhouse, stainless steel tables, buckets of ' +
    'fresh cut summer flowers, hands of workers bunching stems, cool even light, out of focus background, ' +
    'professional and hygienic.'],
  ['coldchain', 2528, 1696,
    'Stacked white cardboard flower export boxes on a pallet inside a refrigerated cold room, condensation ' +
    'on the metal door, cool blue-grey light, industrial and clean, shot at a slight angle.'],
  ['cargo', 2528, 1696,
    'Air cargo pallets of flower boxes being loaded at night onto a freighter aircraft, apron floodlights, ' +
    'ground crew silhouettes, wet tarmac reflections, cinematic cool blue tones.'],
  ['harvest', 2528, 1696,
    'Close over-the-shoulder shot of a farm worker in a bright apron harvesting golden solidago stems into ' +
    'a bucket at sunrise, hands and secateurs in focus, rows of flowers softly blurred behind.'],
  ['qc', 1264, 848,
    'Close up of hands holding a measuring gauge against a bunch of cut flower stems on a stainless steel ' +
    'grading table, checking stem length, shallow depth of field, clinical soft light.'],

  // Varieties (portrait crops)
  ['solidago', 1696, 2528,
    'Close up bunch of golden yellow solidago goldenrod cut flowers, feathery plumes, against a soft ' +
    'warm cream studio backdrop, fresh and dewy.'],
  ['eucalyptus-baby-blue', 1696, 2528,
    'Close up bunch of baby blue eucalyptus foliage stems, small round powder-blue leaves, against a soft ' +
    'pale sage studio backdrop.'],
  ['eucalyptus-silver-dollar', 1696, 2528,
    'Close up bunch of silver dollar eucalyptus stems, large round silvery-green leaves, against a soft ' +
    'warm grey studio backdrop.'],
  ['limonium', 1696, 2528,
    'Close up bunch of lavender purple limonium sea lavender, airy sprays of tiny papery flowers, against ' +
    'a soft cream studio backdrop.'],
  ['statice', 1696, 2528,
    'Close up mixed bunch of statice limonium sinuatum in purple, white, apricot and yellow, papery ' +
    'clustered blooms on winged stems, soft cream studio backdrop.'],
  ['gypsophila', 1696, 2528,
    'Close up bunch of white gypsophila babys breath, dense cloud of tiny white blooms, soft pale grey ' +
    'studio backdrop, bright and airy.'],
  ['carnations', 1696, 2528,
    'Close up bunch of single standard carnations in dusty pink and cream, ruffled petals, soft cream ' +
    'studio backdrop.'],
  ['spray-carnations', 1696, 2528,
    'Close up bunch of spray carnations, multiple smaller blooms per stem in coral, white and burgundy, ' +
    'soft cream studio backdrop.'],
  ['chrysanthemums', 1696, 2528,
    'Close up bunch of spray chrysanthemums in white and bronze, daisy form blooms, soft warm grey ' +
    'studio backdrop.'],
  ['hydrangeas', 1696, 2528,
    'Close up of three antique blue and sage green hydrangea heads, large mophead blooms, soft cream ' +
    'studio backdrop, painterly and premium.'],
  ['delphiniums', 1696, 2528,
    'Close up of tall blue delphinium spires, densely packed florets, soft pale backdrop, elegant ' +
    'vertical composition.'],
  ['eryngium', 1696, 2528,
    'Close up bunch of steel blue eryngium sea holly, spiky metallic bracts, soft warm grey studio ' +
    'backdrop, sculptural and graphic.'],
  ['roses', 1696, 2528,
    'Close up bunch of premium long stem red and blush roses, tight elegant heads, soft cream studio ' +
    'backdrop, luxury florist quality.'],
  ['spray-roses', 1696, 2528,
    'Close up bunch of spray roses, several small blooms per stem in peach and white, soft cream studio ' +
    'backdrop.'],
  ['garden-roses', 1696, 2528,
    'Close up of open garden roses in blush and apricot, many ruffled petals, cupped romantic form, soft ' +
    'warm backdrop, painterly.'],
  ['david-austin', 1696, 2528,
    'Close up of David Austin style English garden roses in soft peach and ivory, deeply cupped rosette ' +
    'blooms, soft cream backdrop, luxurious and romantic.'],
];

const only = process.argv[2];
const jobs = only ? JOBS.filter(j => j[0] === only) : JOBS;

async function gen([key, w, h, prompt], attempt = 1) {
  const file = path.join(OUT, `${key}.png`);
  if (fs.existsSync(file) && fs.statSync(file).size > 20000) {
    console.log(`skip ${key}`);
    return;
  }
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
      body: JSON.stringify([{
        taskType: 'imageInference',
        taskUUID: crypto.randomUUID(),
        model: MODEL,
        positivePrompt: `${prompt} ${LOOK}`,
        negativePrompt: NEG,
        width: w, height: h,
        numberResults: 1,
        outputFormat: 'PNG',
      }]),
    });
    const json = await res.json();
    const url = json?.data?.[0]?.imageURL;
    if (!url) throw new Error(JSON.stringify(json).slice(0, 300));
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    fs.writeFileSync(file, buf);
    console.log(`ok   ${key}  ${(buf.length / 1024).toFixed(0)}KB`);
  } catch (e) {
    console.log(`FAIL ${key} (try ${attempt}): ${e.message}`);
    if (attempt < 3) { await new Promise(r => setTimeout(r, 4000 * attempt)); return gen([key, w, h, prompt], attempt + 1); }
  }
}

// modest concurrency
const QUEUE = [...jobs];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (QUEUE.length) await gen(QUEUE.shift());
}));
console.log('done');
