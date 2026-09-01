/**
 * Hero candidates for partnerhereniging.nl. The first arrivals-hall shot read
 * as distress rather than relief (tears, screwed-up eyes), so every prompt here
 * is explicit: open-eyed, laughing, no tears, no anguish.
 */
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import crypto from 'node:crypto';

const KEY = process.env.RUNWARE_API_KEY;
if (!KEY) throw new Error('RUNWARE_API_KEY is not set. Run: set -a && source ../../.env && set +a');
const API = 'https://api.runware.ai/v1';
const OUT = new URL('file:///Users/alfred/Projects/jiw-websites/apps/expat-relocation-landers/image-candidates/');

const STYLE =
  'Natural documentary photography, real everyday Netherlands, warm daylight, candid, true-to-life colour, ' +
  'gentle natural contrast, ordinary approachable people, believable clothing, photorealistic. ' +
  'Both faces clearly visible, eyes open, relaxed happy expressions, genuine easy smiles. ' +
  'Absolutely no crying, no tears, no distress, no fear, no grimacing, no screwed-up eyes. ' +
  'No text, no lettering, no logos, no signage, no watermarks.';

const SHOTS = [
  {
    name: 'hero-a',
    prompt:
      'A Dutch woman in her early thirties and her partner, a man of West African descent, have just met again in ' +
      'the arrivals hall of a Dutch airport after months apart. They stand close, both laughing openly, looking at ' +
      'each other with delight; his suitcase is beside them. Bright diffused daylight through tall windows, other ' +
      'travellers softly out of focus. The couple stands in the right half of the frame; the left third is open and ' +
      'quiet.',
  },
  {
    name: 'hero-b',
    prompt:
      'A young mixed-nationality couple walk out of the arrivals gate of a Dutch airport side by side, pushing a ' +
      'luggage trolley together, both grinning broadly at each other in the middle of a conversation. She is Dutch, ' +
      'he is from South East Asia. Bright airy terminal, big windows, soft daylight, other passengers blurred in ' +
      'the background. They occupy the right half of the frame.',
  },
  {
    name: 'hero-c',
    prompt:
      'A Dutch woman and her partner from Latin America stand together on a Dutch railway platform on a bright ' +
      'morning, his suitcase beside them, her arm through his. Both are laughing at something one of them just ' +
      'said, faces open and relaxed. A red and white train and a canopy of steel beams behind them. Clear daylight. ' +
      'They stand right of centre, the left of the frame opens down the empty platform.',
  },
  {
    name: 'hero-d',
    prompt:
      'A Dutch woman in her thirties and her partner, a man from North Africa, sit close together on the front step ' +
      'of a brick Dutch terraced house on a sunny afternoon, a bicycle leaning beside them, both laughing warmly ' +
      'with their heads tilted together. Ordinary residential street, plants in pots, soft golden light. They sit ' +
      'in the right half of the frame, the pavement and street open out to the left.',
  },
];

async function once(shot) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify([
      {
        taskType: 'imageInference',
        taskUUID: crypto.randomUUID(),
        model: 'google:4@3',
        positivePrompt: `${shot.prompt} ${STYLE}`,
        width: 2528,
        height: 1696,
        numberResults: 1,
        outputType: 'URL',
        outputFormat: 'JPG',
      },
    ]),
    signal: AbortSignal.timeout(240000),
  });
  const json = await res.json();
  const url = json?.data?.[0]?.imageURL;
  if (!url) throw new Error(`${shot.name}: ${JSON.stringify(json).slice(0, 300)}`);
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  await writeFile(new URL(`${shot.name}.jpg`, OUT), await sharp(buf).resize({ width: 1264 }).jpeg({ quality: 80 }).toBuffer());
  return `${shot.name} ok`;
}

async function run(shot) {
  for (let i = 0; i < 3; i++) {
    try {
      return await once(shot);
    } catch (e) {
      if (i === 2) return `FAILED ${shot.name}: ${e.message}`;
    }
  }
}

(await Promise.all(SHOTS.map(run))).forEach((r) => console.log(r));
