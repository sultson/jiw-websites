// One-off: re-render the low-res client photos at high resolution via Runware
// (openai:gpt-image@2.5-sunburst, referenceImages mode -- this architecture has no `strength`,
// so faithfulness has to come from the prompt). Originals are kept in assets/img/_orig/.
import fs from 'fs';
import sharp from 'sharp';

const KEY = 'n31amyHUqDm25NnCNUu52tcUjjZStVyC';
const API = 'https://api.runware.ai/v1';
const MODEL = 'openai:gpt-image@2.5-sunburst';

const FAITHFUL =
  'Photo restoration task: reproduce this exact photograph at high resolution. Keep the identical ' +
  'subject, composition, framing, crop, camera angle, lighting and colour. Do not add, remove, ' +
  'move or re-arrange anything, and do not change the number of stems, bunches or people. ' +
  'Only recover fine detail that the low-resolution source lost: petal and floret edges, leaf ' +
  'texture, stem lines, fabric and soil grain. It must stay a real natural-light photograph with ' +
  'true-to-life colour -- not an illustration, not a render, no added props, no text, no watermark.';

const JOBS = [
  ['greenhouse',               'Open field rows of solidago on a Kenyan highland flower farm.'],
  ['harvest',                  'Solidago in full bloom in the field on a Kenyan highland farm.'],
  ['hero-field-tall',          'Rows of flowers on a Kenyan highland farm, portrait crop.'],
  ['field-rows',               'Solidago at bud stage in the field, red soil path between the rows.'],
  ['solidago',                 'Solidago, bright yellow plumes on strong green stems.'],
  ['bunch-real',               'A graded bunch of solidago, cut and bunched to specification.'],
  ['qc',                       'A hand holding up one full-length eucalyptus stem against a tiled walkway.'],
  ['eucalyptus-baby-blue',     'Eucalyptus Baby Blue: small round powder-blue leaves on a fine stem.'],
  ['eucalyptus-silver-dollar', 'Eucalyptus Silver Dollar: large rounded silver-green coin leaves.'],
  ['limonium',                 'A bunch of limonium in lavender, deep purple, pink and yellow.'],
  ['hydrangeas',               'Hydrangea heads.'],
  ['delphiniums',              'Delphinium spikes.'],
  ['roses',                    'Mixed rose varieties, cut heads.'],
  ['spray-roses',              'Mixed spray rose varieties, several heads per stem.'],
  ['garden-roses',             'Garden roses, open cupped heads.'],
  ['spray-garden-roses',       'Spray garden roses.'],
];

// gpt-image accepts any /64 size; keep the source aspect, cap the long edge at 2048.
function target(w, h) {
  const s = 2048 / Math.max(w, h);
  const r = (n) => Math.max(1024, Math.round((n * s) / 64) * 64);
  return [r(w), r(h)];
}

const ORIG = 'assets/img/_orig';
const OUT = '.up';
fs.mkdirSync(ORIG, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

async function one([key, what]) {
  const src = `assets/img/${key}.png`;
  const keep = `${ORIG}/${key}.png`;
  if (!fs.existsSync(keep)) fs.copyFileSync(src, keep);
  const m = await sharp(keep).metadata();
  const [w, h] = target(m.width, m.height);
  const body = [{
    taskType: 'imageInference', taskUUID: crypto.randomUUID(), model: MODEL,
    positivePrompt: `${what} ${FAITHFUL}`,
    referenceImages: [fs.readFileSync(keep).toString('base64')],
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
    if (url) {
      const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
      fs.writeFileSync(`${OUT}/${key}.png`, buf);
      const om = await sharp(buf).metadata();
      console.log(`OK   ${key}  ${m.width}x${m.height} -> ${om.width}x${om.height}`);
      return;
    }
    console.log(`WARN ${key} attempt ${attempt}: ${JSON.stringify(j?.errors?.[0]?.message || j).slice(0, 160)}`);
  }
  console.log(`FAIL ${key}`);
}

for (const j of JOBS) await one(j);
console.log('done');
