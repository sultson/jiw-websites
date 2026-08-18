import sharp from 'sharp';
import fs from 'node:fs';
const files = fs.readdirSync('site/m').filter(f=>f.endsWith('-1600.jpg'));
const byIdx = new Map(files.map(f=>[parseInt(f.slice(0,3),10), f]));
const sel = process.argv.slice(2).map(Number);
const CW=420, CH=560, COLS=3;
const rows=Math.ceil(sel.length/COLS); const tiles=[];
for (const [k,i] of sel.entries()) {
  const f=byIdx.get(i); if(!f){console.log('mist',i);continue;}
  const buf=await sharp(`site/m/${f}`).resize(CW,CH,{fit:'cover'}).toBuffer();
  const lbl=await sharp({create:{width:CW,height:26,channels:4,background:'#000000dd'}})
    .composite([{input:Buffer.from(`<svg width="${CW}" height="26"><text x="6" y="20" font-size="18" fill="#fff" font-family="monospace">${i}</text></svg>`)}]).png().toBuffer();
  tiles.push({input:buf,left:(k%COLS)*CW,top:Math.floor(k/COLS)*CH});
  tiles.push({input:lbl,left:(k%COLS)*CW,top:Math.floor(k/COLS)*CH});
}
await sharp({create:{width:CW*COLS,height:CH*rows,channels:3,background:'#111'}}).composite(tiles).jpeg({quality:88}).toFile('work/hero-big-cand.jpg');
console.log('ok');
