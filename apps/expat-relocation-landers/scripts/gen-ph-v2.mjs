/**
 * partnerhereniging.nl, second design round.
 * The new layout uses full-bleed photo bands, so the hero shot has to survive a
 * very wide crop: subject centred, nothing important near the top or bottom edge.
 */
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import crypto from 'node:crypto';

const KEY = process.env.RUNWARE_API_KEY;
if (!KEY) throw new Error('RUNWARE_API_KEY is not set. Run: set -a && source ../../.env && set +a');
const API = 'https://api.runware.ai/v1';
const OUT = new URL('file:///Users/alfred/Projects/jiw-websites/apps/expat-relocation-landers/image-candidates/');

const STYLE =
  'Natural documentary photography, real everyday Netherlands, warm daylight, candid and unposed, ' +
  'true-to-life colour, gentle natural contrast, ordinary approachable people, believable everyday clothing, ' +
  'photorealistic. Faces clearly visible, eyes open, relaxed genuine smiles. ' +
  'No crying, no tears, no distress, no grimacing. No text, no lettering, no logos, no signage, no watermarks.';

const SHOTS = [
  {
    name: 'v2-hero-a',
    prompt:
      'A Dutch woman in her early thirties and her partner, a man of West African descent, hold each other in the ' +
      'arrivals hall of a Dutch airport, foreheads close, both laughing with relief after months apart. His suitcase ' +
      'stands beside them. Very wide cinematic framing with generous empty space to the left and right of the couple; ' +
      'the couple is centred slightly right of the middle and placed at mid height, nothing important near the top or ' +
      'bottom edge of the frame. Bright diffused daylight through tall terminal windows, other travellers far out of focus.',
  },
  {
    name: 'v2-hero-b',
    prompt:
      'A young mixed-nationality couple walk together through a bright Dutch airport arrivals hall pulling one ' +
      'suitcase, her arm hooked through his, both grinning at each other mid-conversation. She is Dutch, he is from ' +
      'South East Asia. Very wide cinematic framing, the couple centred at mid height with a lot of open airy space ' +
      'on both sides, soft daylight, pale terminal floor, blurred travellers in the far distance.',
  },
  {
    name: 'v2-hero-c',
    prompt:
      'A Dutch woman and her partner from Latin America stand close together on a Dutch railway platform in the ' +
      'morning, one suitcase at their feet, laughing warmly at each other. A yellow and blue Dutch train and a long ' +
      'steel canopy behind them. Very wide cinematic framing, the couple centred at mid height, the empty platform ' +
      'stretching away on both sides, clear soft daylight.',
  },
  {
    name: 'v2-hero-d',
    prompt:
      'A Dutch woman in her thirties and her partner, a man from North Africa, sit side by side on the brick front ' +
      'step of an ordinary Dutch terraced house on a bright afternoon, a bicycle leaning next to them, laughing with ' +
      'their heads tilted together. Very wide cinematic framing, the couple centred at mid height, brick facade and ' +
      'pavement stretching away on both sides, warm soft light.',
  },
  {
    name: 'v2-situatie-a',
    prompt:
      'A woman in her thirties sits on a plain sofa in a small Dutch flat in the evening with a laptop on her knees, ' +
      'talking and smiling at her partner on a video call, a mug of tea beside her, a warm lamp and a rainy window ' +
      'behind her. Calm and hopeful. Ordinary Dutch interior, nothing luxurious.',
  },
  {
    name: 'v2-situatie-b',
    prompt:
      'A couple in their thirties sit close together on the floor beside a low table in a modest Dutch living room, ' +
      'a phone between them showing a calendar, sorting through a small pile of printed papers and a passport. She is ' +
      'Dutch, he is from the Middle East. They look at each other and laugh. Soft late afternoon daylight through a ' +
      'large window, plants, a rug, ordinary Dutch home.',
  },
  {
    name: 'v2-band-a',
    prompt:
      'A mixed-nationality couple and a small group of Dutch family and friends sit around a long table in a garden ' +
      'behind a Dutch terraced house on a summer evening, plates and glasses on the table, everyone laughing and ' +
      'talking. The couple sits together on the right of the frame. Warm low sunlight, string lights, brick wall, ' +
      'plain garden. Very wide framing with space on the left.',
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
  await writeFile(new URL(`${shot.name}.jpg`, OUT), await sharp(buf).resize({ width: 1264 }).jpeg({ quality: 82 }).toBuffer());
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
