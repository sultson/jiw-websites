import sharp from 'sharp'; import fs from 'node:fs'; import path from 'node:path';
const keys=['solidago','eucalyptus-baby-blue','eucalyptus-silver-dollar','limonium','gypsophila','carnations','spray-carnations','statice','chrysanthemums','hydrangeas','delphiniums','eryngium','roses','spray-roses','garden-roses','david-austin'];
const W=150,H=190,C=8;
const tiles=await Promise.all(keys.map(async(k,i)=>({input:await sharp(`assets/img/${k}.png`).resize(W,H,{fit:'cover'}).png().toBuffer(),left:(i%C)*W,top:Math.floor(i/C)*H})));
await sharp({create:{width:W*C,height:H*Math.ceil(keys.length/C),channels:3,background:'#fff'}}).composite(tiles).png().toFile('shots/sheet.png');
console.log('ok');
