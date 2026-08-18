import sharp from 'sharp';
import fs from 'node:fs';
const dir = 'site/img';
const files = fs.readdirSync(dir).filter(f=>f.endsWith('.jpg'));
const out = [];
for (const f of files) {
  const img = sharp(`${dir}/${f}`).greyscale();
  const meta = await img.metadata();
  const W = 400, H = Math.round(meta.height * 400 / meta.width);
  const { data } = await sharp(`${dir}/${f}`).greyscale().resize(W).raw().toBuffer({resolveWithObject:true});
  const box = (x0,x1,y0,y1) => {
    let n=0,t=0;
    for (let y=Math.round(y0*H); y<Math.round(y1*H); y++)
      for (let x=Math.round(x0*W); x<Math.round(x1*W); x++){ t++; if (data[y*W+x] >= 250) n++; }
    return n/t;
  };
  const wm = box(0.03,0.45,0.87,0.99);
  const ctrl = box(0.55,0.97,0.87,0.99);
  out.push({f, wm:+wm.toFixed(4), ctrl:+ctrl.toFixed(4), score:+(wm-ctrl).toFixed(4)});
}
out.sort((a,b)=>b.score-a.score);
console.log(out.slice(0,26).map(o=>`${o.f} wm=${o.wm} ctrl=${o.ctrl} s=${o.score}`).join('\n'));
fs.writeFileSync('work/wm-scores.json', JSON.stringify(out,null,1));
