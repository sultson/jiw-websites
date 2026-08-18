import sharp from 'sharp';
import fs from 'node:fs';
const inner = fs.readFileSync('site/logo.svg','utf8').replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f4f4f2"/>${inner}</svg>`;
await sharp(Buffer.from(svg)).resize(500,500).png().toFile('work/logo-svg.png');
await sharp('brand/logo-src.jpg').resize(500,500,{fit:'fill'}).png().toFile('work/logo-src.png');
const a = await sharp('work/logo-svg.png').greyscale().raw().toBuffer();
const b = await sharp('work/logo-src.png').greyscale().raw().toBuffer();
let diff=0; for(let i=0;i<a.length;i++) if(Math.abs(a[i]-b[i])>60) diff++;
console.log('pixels off:', diff, '=', (100*diff/a.length).toFixed(2)+'%');
await sharp({create:{width:1010,height:500,channels:3,background:'#ffffff'}})
  .composite([{input:'work/logo-src.png',left:0,top:0},{input:'work/logo-svg.png',left:510,top:0}])
  .jpeg({quality:88}).toFile('work/logo-cmp.jpg');
