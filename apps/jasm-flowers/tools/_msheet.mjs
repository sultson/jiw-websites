import fs from 'node:fs'; import sharp from 'sharp';
const sizes=[20,32,64,140];
const rows=[];
for (const k of ['A','B','C']){
  const svg=fs.readFileSync(new URL(`./_mark-${k}.svg`,import.meta.url),'utf8').replace('currentColor','#17241E');
  const tiles=[];
  for(const s of sizes){
    const b=await sharp(Buffer.from(svg),{density:600}).resize(s,s).png().toBuffer();
    tiles.push(await sharp({create:{width:160,height:160,channels:4,background:'#F7F5F1'}})
      .composite([{input:b,gravity:'center'}]).png().toBuffer());
  }
  rows.push(await sharp({create:{width:160*sizes.length,height:160,channels:4,background:'#F7F5F1'}})
    .composite(tiles.map((t,i)=>({input:t,left:i*160,top:0}))).png().toBuffer());
}
await sharp({create:{width:160*sizes.length,height:160*rows.length,channels:4,background:'#F7F5F1'}})
  .composite(rows.map((r,i)=>({input:r,left:0,top:i*160}))).png().toFile('shots/marks.png');
console.log('ok');
