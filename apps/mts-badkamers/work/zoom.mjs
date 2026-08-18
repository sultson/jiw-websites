import sharp from 'sharp';
import fs from 'node:fs';
const files = fs.readdirSync('site/m').filter((f)=>f.endsWith('-900.jpg'));
const byIdx = new Map(files.map((f)=>[parseInt(f.slice(0,3),10),f]));
const idxs = process.argv.slice(2).map(Number);
const CW=440,CH=440,COLS=3;
const rows=Math.ceil(idxs.length/COLS); const tiles=[];
for(const [k,i] of idxs.entries()){
  const f=byIdx.get(i);
  tiles.push({input: await sharp(`site/m/${f}`).resize(CW,CH,{fit:'contain',background:'#111'}).toBuffer(), left:(k%COLS)*CW, top:Math.floor(k/COLS)*CH});
  tiles.push({input: await sharp({create:{width:CW,height:26,channels:4,background:'#000000cc'}}).composite([{input:Buffer.from(`<svg width="${CW}" height="26"><text x="6" y="20" font-size="18" fill="#fff" font-family="monospace">${i}</text></svg>`)}]).png().toBuffer(), left:(k%COLS)*CW, top:Math.floor(k/COLS)*CH});
}
await sharp({create:{width:CW*COLS,height:CH*rows,channels:3,background:'#111'}}).composite(tiles).jpeg({quality:88}).toFile('work/zoom.jpg');
