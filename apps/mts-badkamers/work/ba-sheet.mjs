import sharp from 'sharp';
import fs from 'node:fs';
const files = fs.readdirSync('site/img');
const byIdx = new Map(files.map(f=>[parseInt(f.slice(0,3),10), f]));
const pairs = [[53,55],[54,52],[54,50],[170,173],[172,180],[92,99],[121,109],[121,111],[147,155],[185,210],[209,196]];
const CW=210, CH=280;
const tiles=[];
for (const [k,[a,b]] of pairs.entries()) {
  for (const [j,i] of [a,b].entries()) {
    const buf = await sharp(`site/img/${byIdx.get(i)}`).resize(CW,CH,{fit:'cover'}).toBuffer();
    tiles.push({input:buf, left:j*CW, top:k*CH});
  }
}
await sharp({create:{width:CW*2,height:CH*pairs.length,channels:3,background:'#111'}}).composite(tiles).jpeg({quality:72}).toFile('work/ba-sheet.jpg');
console.log(pairs.map((p,i)=>`row${i}: ${p[0]} -> ${p[1]}`).join('\n'));
