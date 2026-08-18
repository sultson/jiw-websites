import sharp from 'sharp';
import fs from 'node:fs';
const known = new Set(['034','058','027','064','030','054','022','050','021','023','052','024','055','062','065','152']);
const files = fs.readdirSync('site/img').filter(f=>f.endsWith('.jpg'));
const hits = [];
for (const f of files) {
  const { data, info } = await sharp(`site/img/${f}`).greyscale().resize(400).raw().toBuffer({resolveWithObject:true});
  const W = info.width, H = info.height;
  // sliding window over lower half, left 55%
  let best = 0, bestY = 0;
  const wh = Math.round(H*0.10);
  for (let y0 = Math.round(H*0.55); y0 + wh < H; y0 += 4) {
    let n=0,t=0, cn=0, ct=0;
    for (let y=y0; y<y0+wh; y++) {
      for (let x=Math.round(W*0.04); x<Math.round(W*0.46); x++){ t++; if (data[y*W+x]>=250) n++; }
      for (let x=Math.round(W*0.60); x<Math.round(W*0.98); x++){ ct++; if (data[y*W+x]>=250) cn++; }
    }
    const s = n/t - cn/ct;
    if (s > best) { best = s; bestY = y0/H; }
  }
  hits.push({f, s:+best.toFixed(4), y:+bestY.toFixed(2), known: known.has(f.slice(0,3))});
}
hits.sort((a,b)=>b.s-a.s);
const unknown = hits.filter(h=>!h.known && h.s>0.008);
console.log('KNOWN scores:', hits.filter(h=>h.known).map(h=>`${h.f.slice(0,3)}:${h.s}@${h.y}`).join(' '));
console.log('\nUNKNOWN candidates:', unknown.length);
console.log(unknown.map(h=>`${h.f} s=${h.s} y=${h.y}`).join('\n'));
fs.writeFileSync('work/wm-scan2.json', JSON.stringify(unknown,null,1));
