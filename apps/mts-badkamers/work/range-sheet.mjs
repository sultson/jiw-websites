import sharp from 'sharp';
import fs from 'node:fs';
const files = fs.readdirSync('site/m').filter(f=>f.endsWith('-900.jpg'));
const byIdx = new Map(files.map(f=>[parseInt(f.slice(0,3),10), f]));
const [a,b,out]=[+process.argv[2],+process.argv[3],process.argv[4]];
const sel=[]; for(let i=a;i<=b;i++) if(byIdx.has(i)) sel.push(i);
const CW=180,CH=240,COLS=8;
const rows=Math.ceil(sel.length/COLS); const tiles=[];
for(const [k,i] of sel.entries()){
  const buf=await sharp(`site/m/${byIdx.get(i)}`).resize(CW,CH,{fit:'cover'}).toBuffer();
  const lbl=await sharp({create:{width:CW,height:22,channels:4,background:'#000000dd'}})
   .composite([{input:Buffer.from(`<svg width="${CW}" height="22"><text x="4" y="17" font-size="16" fill="#fff" font-family="monospace">${i}</text></svg>`)}]).png().toBuffer();
  tiles.push({input:buf,left:(k%COLS)*CW,top:Math.floor(k/COLS)*CH});
  tiles.push({input:lbl,left:(k%COLS)*CW,top:Math.floor(k/COLS)*CH});
}
await sharp({create:{width:CW*COLS,height:CH*rows,channels:3,background:'#111'}}).composite(tiles).jpeg({quality:82}).toFile(out);
console.log(out, sel.length);
