const KEY='n31amyHUqDm25NnCNUu52tcUjjZStVyC', URL='https://api.runware.ai/v1';
const taken=[
 {naam:'korrel-hero', w:1536, h:1024, p:'abstract dark cinematic wallpaper, almost black charcoal field, deep navy blue haze drifting in from the upper right, one faint crimson glow low on the left, heavy analogue film grain and fine sensor noise across the whole frame, soft volumetric light falloff, no objects, no people, no text, pure atmospheric gradient, 35mm grain, moody television studio ambience'},
 {naam:'korrel-vlak', w:1024, h:1024, p:'flat uniform texture of fine monochrome film grain and digital sensor noise on a near black charcoal surface, faint cool blue tint, evenly distributed speckle, no light source, no vignette, no objects, no text, macro photograph of unexposed film emulsion'},
 {naam:'korrel-cta', w:1536, h:1024, p:'abstract dark wallpaper, deep near black with a broad crimson red light bloom sweeping across the lower third and cool steel blue haze above, heavy cinematic film grain, soft defocused bokeh of distant studio lamps, no objects, no people, no text, anamorphic lens glow'}
];
const body=taken.map(t=>({taskType:'imageInference',taskUUID:crypto.randomUUID(),model:'runware:z-image@turbo',positivePrompt:t.p,width:t.w,height:t.h,numberResults:1,outputFormat:'PNG'}));
const r=await fetch(URL,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+KEY},body:JSON.stringify(body)});
const j=await r.json();
console.log(JSON.stringify(j.errors||[]).slice(0,600));
const fs=await import('node:fs/promises');
for(const d of (j.data||[])){
  const i=body.findIndex(b=>b.taskUUID===d.taskUUID), naam=taken[i]?.naam||'beeld';
  const b=Buffer.from(await (await fetch(d.imageURL)).arrayBuffer());
  await fs.writeFile('raw/gen2/'+naam+'.png',b);
  console.log(naam,b.length);
}
