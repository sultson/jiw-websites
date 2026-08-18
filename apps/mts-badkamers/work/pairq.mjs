import sharp from 'sharp';
import fs from 'node:fs';
const files = fs.readdirSync('site/m').filter(f=>f.endsWith('-1600.jpg'));
const byIdx = new Map(files.map(f=>[parseInt(f.slice(0,3),10), f]));
const pairs=[]; for(let k=2;k<process.argv.length;k+=2) pairs.push([+process.argv[k],+process.argv[k+1]]);
const CW=440,CH=550,LAB=26; const tiles=[];
for(const [k,[a,b]] of pairs.entries()){
 for(const [j,i] of [a,b].entries()){
  const buf=await sharp(`site/m/${byIdx.get(i)}`).resize(CW,CH,{fit:'cover'}).toBuffer();
  tiles.push({input:buf,left:j*CW,top:k*(CH+LAB)+LAB});
 }
 tiles.push({input:Buffer.from(`<svg width="${CW*2}" height="${LAB}"><rect width="100%" height="100%" fill="#111"/><text x="6" y="19" font-size="16" fill="#fff" font-family="monospace">voor ${a}  ->  na ${b}</text></svg>`),left:0,top:k*(CH+LAB)});
}
await sharp({create:{width:CW*2,height:(CH+LAB)*pairs.length,channels:3,background:'#111'}}).composite(tiles).jpeg({quality:86}).toFile('work/pairq.jpg');
console.log('ok');
