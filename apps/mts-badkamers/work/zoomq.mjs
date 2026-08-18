import sharp from 'sharp';
import fs from 'node:fs';
const files = fs.readdirSync('site/m').filter(f=>f.endsWith('-1600.jpg'));
const byIdx = new Map(files.map(f=>[parseInt(f.slice(0,3),10), f]));
const i=+process.argv[2];
const f=byIdx.get(i);
const im=sharp(`site/m/${f}`); const md=await im.metadata();
console.log(i,f,md.width,md.height);
await sharp(`site/m/${f}`).resize(1100,null,{fit:'inside'}).jpeg({quality:90}).toFile(`work/zoom-${i}.jpg`);
