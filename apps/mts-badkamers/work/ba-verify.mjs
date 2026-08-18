import sharp from 'sharp';
import fs from 'node:fs';
import { BA } from '../content.mjs';
const files = fs.readdirSync('site/m').filter(f=>f.endsWith('-900.jpg'));
const byIdx = new Map(files.map(f=>[parseInt(f.slice(0,3),10), f]));
const CW=300, CH=380, LAB=26;
const tiles=[];
const svgs=[];
for (const [k,p] of BA.entries()) {
  for (const [j,i] of [p.voor,p.na].entries()) {
    const f = byIdx.get(i);
    if(!f){console.log('MISSING',i);continue;}
    const buf = await sharp(`site/m/${f}`).resize(CW,CH,{fit:'cover'}).toBuffer();
    tiles.push({input:buf, left:j*CW, top:k*(CH+LAB)+LAB});
  }
  const label = `${p.tab}: LINKS=voor(${p.voor})  RECHTS=na(${p.na})`;
  const svg = Buffer.from(`<svg width="${CW*2}" height="${LAB}"><rect width="100%" height="100%" fill="#111"/><text x="6" y="19" font-family="sans-serif" font-size="16" fill="#fff">${label}</text></svg>`);
  tiles.push({input:svg, left:0, top:k*(CH+LAB)});
}
await sharp({create:{width:CW*2,height:(CH+LAB)*BA.length,channels:3,background:'#111'}}).composite(tiles).jpeg({quality:78}).toFile('work/ba-verify.jpg');
console.log('ok', BA.length);
