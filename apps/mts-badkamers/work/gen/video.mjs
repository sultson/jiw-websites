// Hero-video: de badkamer bouwt zichzelf op.
// Eerste frame = kale bouwstaat (work/gen/f-first.jpg, gegenereerd uit de herofoto),
// laatste frame = de echte opgeleverde herofoto. Beide 1080x1920, zelfde uitsnede.
import fs from 'node:fs';

const KEY = process.env.RUNWARE_API_KEY;
if (!KEY) throw new Error("RUNWARE_API_KEY niet gezet");
const API = "https://api.runware.ai/v1";

const uri = f => "data:image/jpeg;base64," + fs.readFileSync(f).toString("base64");

const prompt = [
  "Time-lapse of a small bathroom being finished, static locked-off camera, no camera movement at all.",
  "The bare grey concrete and plasterboard room transforms into the finished bathroom:",
  "large warm beige stone-look tiles spread across the walls and floor,",
  "a black floating vanity top with an integrated basin and a wall-mounted tap appear on the left wall,",
  "a light oak drawer cabinet slides in underneath,",
  "a round black-framed mirror with a soft backlit halo appears above the basin and lights up,",
  "a tall slim black towel radiator builds up on the back wall,",
  "a black toilet appears in the alcove on the right,",
  "and the ceiling spotlight switches on with warm light.",
  "Smooth continuous construction, materials growing into place, clean and calm, photorealistic interior,",
  "no people, no hands, no tools, no text, no logos.",
].join(" ");

async function post(body) {
  const r = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + KEY },
    body: JSON.stringify(body),
  });
  const t = await r.text();
  let j = null;
  try { j = JSON.parse(t); } catch { /* laat j null */ }
  return { status: r.status, text: t, json: j };
}

async function main() {
  const taskUUID = crypto.randomUUID();
  const task = {
    taskType: "videoInference",
    taskUUID,
    model: "lightricks:ltx@2.5-pro",
    positivePrompt: prompt,
    frameImages: [
      { inputImage: uri("work/gen/f-first.jpg"), frame: "first" },
      { inputImage: uri("work/gen/f-last.jpg"), frame: "last" },
    ],
    duration: 6,
    width: 1080, height: 1920,
    numberResults: 1,
    outputType: "URL",
    outputFormat: "MP4",
    includeCost: true,
    deliveryMethod: "async",
  };
  const res = await post([task]);
  console.log("submit", res.status, res.text.slice(0, 1200));
  if (res.status !== 200) return;

  // async: pollen tot er een videoURL is
  for (let i = 0; i < 120; i++) {
    await new Promise(r => setTimeout(r, 5000));
    const p = await post([{ taskType: "getResponse", taskUUID }]);
    const d = p.json && p.json.data && p.json.data[0];
    if (d && d.videoURL) {
      const v = await fetch(d.videoURL);
      fs.writeFileSync("work/gen/hero.mp4", Buffer.from(await v.arrayBuffer()));
      console.log("DONE work/gen/hero.mp4 cost=" + d.cost, d.videoURL);
      return;
    }
    const st = (d && d.status) || (p.json && p.json.errors ? "ERR " + JSON.stringify(p.json.errors).slice(0, 400) : "?");
    console.log(i, st);
    if (String(st).startsWith("ERR")) return;
  }
  console.log("TIMEOUT");
}

main().catch(e => console.log("ERR", e.stack));
