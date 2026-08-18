import sharp from 'sharp';
import fs from 'node:fs';
import { projects } from '../projects.mjs';
const files = fs.readdirSync('site/m').filter((f)=>f.endsWith('-900.jpg'));
const byIdx = new Map(files.map((f)=>[parseInt(f.slice(0,3),10),f]));
const all = [];
for (const p of projects) for (const s of p.sections||[]) for (const x of s.imgs) if(!all.includes(x.i)) all.push(x.i);
console.log('fasefotos:', all.length);
const part = Number(process.argv[2]||0), SIZE=56;
const idxs = all.slice(part*SIZE, part*SIZE+SIZE);
const CW=240,CH=190,COLS=8;
const rows=Math.ceil(idxs.length/COLS); const tiles=[];
for(const [k,i] of idxs.entries()){
  const f=byIdx.get(i); if(!f){console.log('mist',i);continue;}
  tiles.push({input: await sharp(`site/m/${f}`).resize(CW,CH,{fit:'contain',background:'#111'}).toBuffer(), left:(k%COLS)*CW, top:Math.floor(k/COLS)*CH});
  tiles.push({input: await sharp({create:{width:CW,height:24,channels:4,background:'#000000cc'}}).composite([{input:Buffer.from(`<svg width="${CW}" height="24"><text x="5" y="18" font-size="17" fill="#fff" font-family="monospace">${i}</text></svg>`)}]).png().toBuffer(), left:(k%COLS)*CW, top:Math.floor(k/COLS)*CH});
}
await sharp({create:{width:CW*COLS,height:CH*rows,channels:3,background:'#111'}}).composite(tiles).jpeg({quality:82}).toFile(`work/sec-${part}.jpg`);
