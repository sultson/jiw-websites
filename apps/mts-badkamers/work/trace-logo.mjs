import sharp from 'sharp';
const W = 100, H = 100;
const { data, info } = await sharp('brand/logo-src.jpg').resize(W, H, { fit: 'fill' }).greyscale().raw().toBuffer({ resolveWithObject: true });
let out = '    ' + Array.from({length:W},(_,x)=>x%10===0?String(x/10):' ').join('') + '\n';
for (let y = 0; y < H; y++) {
  let row = String(y).padStart(3,' ') + ' ';
  for (let x = 0; x < W; x++) row += data[y*W+x] < 170 ? '#' : '.';
  out += row + '\n';
}
console.log(out);
