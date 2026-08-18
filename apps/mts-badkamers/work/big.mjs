import sharp from 'sharp';
import fs from 'node:fs';
const files = fs.readdirSync('site/m').filter((f)=>f.endsWith('-1600.jpg'));
const byIdx = new Map(files.map((f)=>[parseInt(f.slice(0,3),10),f]));
const i = Number(process.argv[2]);
await sharp(`site/m/${byIdx.get(i)}`).resize(1100,1100,{fit:'inside'}).jpeg({quality:90}).toFile('work/big.jpg');
console.log(byIdx.get(i));
