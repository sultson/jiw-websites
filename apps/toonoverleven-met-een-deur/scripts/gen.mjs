import crypto from 'crypto';
import fs from 'fs';
const KEY=process.env.RUNWARE_API_KEY;
if(!KEY){console.error('RUNWARE_API_KEY ontbreekt. Zet hem in de omgeving voor je dit script draait.');process.exit(1)}
const URL='https://api.runware.ai/v1';
const STYLE = "flat vector illustration in a modern minimal editorial style, clean thick-free smooth shapes, no outlines, soft organic forms, subtle grain-free flat fills, gentle drop shadow under figures only. Colour palette strictly: deep sea green #4B8073, sage green #B9D4A8, soft mint #CFE3DE, warm sand #EDE0C4, cream #F7F2E7, off white, with a single muted terracotta accent. Faces are simple and friendly, no facial detail beyond a small smile and closed or dot eyes. Composition centred with generous empty margin. Plain pure white background #FFFFFF, completely flat, no background scenery outside the scene objects, no border, no frame, no text, no lettering, no watermark.";
const NEG = "photo, photorealistic, 3d render, text, letters, words, watermark, logo, frame, border, gradient background, textured background, dark colours, sad, clinical, hospital, medical, busy background";
const jobs = JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
for (const j of jobs) {
  const body = [{taskType:'imageInference',taskUUID:crypto.randomUUID(),model:'google:4@3',
    positivePrompt:`${j.prompt} ${STYLE}`, negativePrompt:NEG,
    width:j.w||1024,height:j.h||1024,numberResults:1,outputFormat:'PNG'}];
  const r = await fetch(URL,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${KEY}`},body:JSON.stringify(body)});
  const t = await r.text();
  let d; try{d=JSON.parse(t)}catch{console.log(j.naam,'BADJSON',t.slice(0,300));continue}
  if(!d.data||!d.data[0]){console.log(j.naam,'ERR',JSON.stringify(d).slice(0,400));continue}
  const u=d.data[0].imageURL;
  const buf=Buffer.from(await (await fetch(u)).arrayBuffer());
  fs.writeFileSync(`raw/ill/${j.naam}.png`,buf);
  console.log(j.naam,'ok',buf.length);
}
