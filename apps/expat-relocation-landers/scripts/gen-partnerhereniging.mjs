/**
 * partnerhereniging.nl photography.
 * Client feedback: less luxury/boutique, more Dutch, approachable, human.
 * Model google:4@3 (best for people/place), 3:2 at 2528x1696, then sharp down.
 */
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import crypto from 'node:crypto';

const KEY = process.env.RUNWARE_API_KEY;
if (!KEY) throw new Error('RUNWARE_API_KEY is not set. Run: set -a && source ../../.env && set +a');
const URL_API = 'https://api.runware.ai/v1';
const OUT = new URL('file:///Users/alfred/Projects/jiw-websites/apps/expat-relocation-landers/public/images/');

const STYLE =
  'Natural documentary photography, real everyday Netherlands, warm daylight, candid and unposed, ' +
  'true-to-life colour, gentle natural contrast, ordinary approachable people, believable clothing, ' +
  'photorealistic, no text, no lettering, no logos, no signage, no watermarks.';

const SHOTS = [
  {
    name: 'ph-hero',
    prompt:
      'A woman in her early thirties and her partner, a man of West African descent, hold each other tightly in the ' +
      'arrivals hall of a Dutch airport. She has just met him after months apart; his suitcase is beside them. ' +
      'They are laughing and crying at the same time. Other travellers pass by softly out of focus. ' +
      'Bright diffused daylight through tall windows. The couple stands in the RIGHT half of the frame, ' +
      'the left third of the frame is open, softly lit floor and window light with nobody in it.',
  },
  {
    name: 'ph-keukentafel',
    prompt:
      'A Dutch woman in her thirties and her partner, a man from South East Asia, sit close together at a plain ' +
      'wooden kitchen table in a modest Dutch apartment, a laptop open in front of them and a small stack of ' +
      'printed documents and a passport beside it. She points at the screen, he is listening. Mugs of coffee. ' +
      'Soft grey morning light from a large window, a plant on the sill, ordinary Dutch interior, nothing luxurious.',
  },
  {
    name: 'ph-advies',
    prompt:
      'A warm, professional Dutch woman in her late forties with shoulder-length hair sits at a simple table ' +
      'across from a young couple, explaining something calmly with an open folder in front of her. She is dressed ' +
      'smartly but plainly. Small friendly Dutch office, white walls, a window with daylight, a plant. ' +
      'The couple looks relieved. Candid working moment, not a posed corporate portrait.',
  },
  {
    name: 'ph-samen',
    prompt:
      'A mixed-nationality couple in their thirties walk hand in hand along an ordinary Dutch residential street ' +
      'of brick terraced houses, bicycles parked against the facades, a few trees. She is Dutch, he is from Latin ' +
      'America. They are talking and laughing, mid-stride, seen from a slight distance. Late afternoon autumn ' +
      'light, warm and soft. Everyday neighbourhood, not a tourist canal postcard.',
  },
  {
    name: 'ph-afstand',
    prompt:
      'A young woman sits alone on the floor of a small Dutch living room in the evening, laptop on a low table, ' +
      'talking to her partner on a video call, her hand resting near the screen. Warm lamp light, a blanket, ' +
      'a rainy window behind her. Quiet and hopeful rather than sad. Ordinary Dutch flat.',
  },
  {
    name: 'ph-dossier',
    prompt:
      'Close overhead view of a plain desk: a passport, a birth certificate, an employer statement, printed ' +
      'payslips and a neat blue document folder, a pen and a pair of reading glasses. Two hands are sorting the ' +
      'papers into order. Daylight from the side, plain light wood surface. Careful, organised, human.',
  },
  {
    name: 'ph-thuis',
    prompt:
      'A couple stands together in the doorway of their Dutch terraced house, the front door open behind them, ' +
      'a bicycle by the step and a doormat. She holds a set of keys, he has one arm around her shoulder. ' +
      'They look straight out, calm and quietly happy. Brick facade, a window box. Soft overcast daylight.',
  },
];

async function once(shot) {
  const res = await fetch(URL_API, {
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
  if (!url) throw new Error(`${shot.name}: ${JSON.stringify(json).slice(0, 400)}`);
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());

  const wide = await sharp(buf).resize({ width: 1264 }).jpeg({ quality: 78, mozjpeg: true, progressive: true }).toBuffer();
  await writeFile(new URL(`${shot.name}.jpg`, OUT), wide);
  const narrow = await sharp(buf).resize({ width: 640 }).jpeg({ quality: 76, mozjpeg: true, progressive: true }).toBuffer();
  await writeFile(new URL(`${shot.name}-640.jpg`, OUT), narrow);
  return `${shot.name}: ${(wide.length / 1024) | 0}kB + ${(narrow.length / 1024) | 0}kB`;
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

const results = await Promise.all(SHOTS.map(run));
results.forEach((r) => console.log(r));
