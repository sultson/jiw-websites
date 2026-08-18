import sharp from 'sharp';
import fs from 'node:fs';
const files = fs.readdirSync('site/m').filter(f=>f.endsWith('-1600.jpg'));
const byIdx = new Map(files.map(f=>[parseInt(f.slice(0,3),10), f]));
// [idx, object-position-y%]
const cands = [[173,45],[180,35],[180,42],[180,52],[181,45],[160,50]];
const W=330,H=570;
const grad = Buffer.from(`<svg width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
<stop offset="0.35" stop-color="#000" stop-opacity="0"/><stop offset="0.62" stop-color="#0b0b0c" stop-opacity="0.55"/><stop offset="1" stop-color="#0b0b0c" stop-opacity="0.94"/></linearGradient></defs>
<rect width="100%" height="100%" fill="url(#g)"/>
<text x="20" y="${H-150}" font-size="34" font-family="Georgia,serif" fill="#fff">Een badkamer die</text>
<text x="20" y="${H-112}" font-size="34" font-family="Georgia,serif" fill="#fff">klopt tot in de</text>
<text x="20" y="${H-74}" font-size="34" font-family="Georgia,serif" fill="#fff">laatste voeg.</text>
<text x="20" y="${H-40}" font-size="17" font-family="Arial" fill="#cfcfcf">Badkamers uit Apeldoorn</text></svg>`);
const tiles=[]; const COLS=6;
for(const [k,[i,py]] of cands.entries()){
  const f=byIdx.get(i);
  const md=await sharp(`site/m/${f}`).metadata();
  const scale=Math.max(W/md.width,H/md.height);
  const rw=Math.round(md.width*scale), rh=Math.round(md.height*scale);
  const top=Math.round((rh-H)*(py/100)), left=Math.round((rw-W)/2);
  const base=await sharp(`site/m/${f}`).resize(rw,rh).extract({left:Math.max(0,left),top:Math.max(0,Math.min(top,rh-H)),width:W,height:H}).toBuffer();
  const withG=await sharp(base).composite([{input:grad}]).toBuffer();
  const lbl=Buffer.from(`<svg width="${W}" height="24"><rect width="100%" height="100%" fill="#000c"/><text x="5" y="18" font-size="16" fill="#0f0" font-family="monospace">${i} @${py}%</text></svg>`);
  tiles.push({input:withG,left:(k%COLS)*W,top:Math.floor(k/COLS)*(H+24)+24});
  tiles.push({input:lbl,left:(k%COLS)*W,top:Math.floor(k/COLS)*(H+24)});
}
await sharp({create:{width:W*COLS,height:(H+24)*Math.ceil(cands.length/COLS),channels:3,background:'#111'}}).composite(tiles).jpeg({quality:88}).toFile('work/heromob-test.jpg');
console.log('ok');
