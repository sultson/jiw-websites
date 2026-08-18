// Genereert de "kale bouwstaat" van de herofoto: eerste frame van de hero-video.
// Zelfde standpunt, zelfde ruimte, maar voor de afwerking.
import fs from 'node:fs';

const KEY = process.env.RUNWARE_API_KEY;
if (!KEY) throw new Error("RUNWARE_API_KEY niet gezet");
const API = "https://api.runware.ai/v1";
const SRC = process.argv[2] || "assets/media/115_f0knx5qd1atmq2gzswern7ga.jpg";
const TAG = process.argv[3] || "bare";
const N = Number(process.argv[4] || 2);

const b64 = "data:image/jpeg;base64," + fs.readFileSync(SRC).toString("base64");

const prompt = [
  "Edit this bathroom photo so it shows the exact same room from the exact same camera position, lens and framing,",
  "but at the bare construction stage before any finishing work.",
  "Remove the round mirror, the vanity unit, the washbasin, the tap and the light fixture completely.",
  "Strip the wall tiles: walls are raw grey cement plaster and bare gypsum board with visible seams.",
  "Capped copper and chrome pipe stubs and a rough electrical back box stick out of the wall where the basin and mirror will be.",
  "The floor is unfinished grey screed, no floor tiles.",
  "Keep the room geometry, the wall corners, the door opening, the window and the direction of the daylight exactly the same.",
  "Realistic construction site photograph, no people, no tools on the floor, no text.",
].join(" ");

async function main() {
  const body = [{
    taskType: "imageInference",
    taskUUID: crypto.randomUUID(),
    model: "google:4@3",
    positivePrompt: prompt,
    referenceImages: [b64],
    // 896x1200 = 3:4, gelijk aan de bronfoto (1200x1600). Google's model accepteert
    // alleen een vaste lijst maten; 768x1024 zit daar niet bij.
    width: 896, height: 1200,
    numberResults: N,
    outputType: "URL",
    outputFormat: "JPG",
  }];
  const r = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + KEY },
    body: JSON.stringify(body),
  });
  const txt = await r.text();
  if (r.status !== 200) { console.log("HTTP", r.status, txt.slice(0, 1200)); return; }
  const j = JSON.parse(txt);
  if (!j.data || !j.data.length) { console.log("FAIL", txt.slice(0, 1200)); return; }
  let i = 0;
  for (const d of j.data) {
    const out = `work/gen/${TAG}-${i}.jpg`;
    const img = await fetch(d.imageURL);
    fs.writeFileSync(out, Buffer.from(await img.arrayBuffer()));
    console.log("OK", out);
    i++;
  }
}

main().catch(e => console.log("ERR", e.stack));
