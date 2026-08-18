import sharp from 'sharp';
import fs from 'node:fs';
const scores = JSON.parse(fs.readFileSync('work/wm-scores.json','utf8')).slice(0,32);
const CW = 360, CH = 70;
const tiles = [];
for (const [k,s] of scores.entries()) {
  const m = await sharp(`site/img/${s.f}`).metadata();
  const top = Math.round(m.height*0.85), h = Math.min(Math.round(m.height*0.15), m.height-top);
  const buf = await sharp(`site/img/${s.f}`).extract({left:0, top, width:Math.round(m.width*0.55), height:h}).resize(CW,CH,{fit:'fill'}).toBuffer();
  tiles.push({input: buf, left: 0, top: k*CH});
}
await sharp({create:{width:CW,height:CH*tiles.length,channels:3,background:'#000'}}).composite(tiles).jpeg({quality:80}).toFile('work/wm-sheet.jpg');
console.log(scores.map((s,i)=>`${i}: ${s.f.slice(0,3)} s=${s.score}`).join('  '));
