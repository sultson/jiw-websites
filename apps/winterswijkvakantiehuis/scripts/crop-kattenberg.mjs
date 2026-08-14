import sharp from 'sharp';
import fs from 'node:fs';

const SRC = 'C:/Users/nieuw/dev/jiw-crm/uploads';
const OUT = 'C:/Users/nieuw/dev/jiw-concepts/winterswijkvakantiehuis/public/img';

/**
 * The owner sent phone screenshots of a funda.nl gallery: browser chrome, an ad
 * banner and a phone status bar around a photo that spans the full width. Find
 * the longest run of rows that are "photo-like" (almost no near-white pixels)
 * and keep only that band.
 */
async function autoCropBand(file, out) {
  const img = sharp(`${SRC}/${file}.jpg`);
  const {width, height} = await img.metadata();
  const {data} = await img.clone().greyscale().raw().toBuffer({resolveWithObject: true});

  const photoish = [];
  for (let y = 0; y < height; y++) {
    let dark = 0;
    for (let x = 0; x < width; x++) if (data[y * width + x] < 238) dark++;
    photoish.push(dark / width > 0.92);
  }

  // A bright patch inside the photo (white door, sunlit wall) can break the run,
  // so bridge gaps of a few rows before picking the longest band.
  for (let y = 1; y < height - 1; y++) {
    if (photoish[y]) continue;
    let gap = 0;
    while (y + gap < height && !photoish[y + gap]) gap++;
    if (gap <= 12 && photoish[y - 1] && photoish[y + gap]) {
      for (let g = 0; g < gap; g++) photoish[y + g] = true;
    }
    y += gap - 1;
  }

  let best = {start: 0, len: 0};
  let run = 0;
  for (let y = 0; y <= height; y++) {
    if (y < height && photoish[y]) run++;
    else {
      if (run > best.len) best = {start: y - run, len: run};
      run = 0;
    }
  }
  if (best.len < 200) throw new Error(`no photo band found in ${file}`);

  await sharp(`${SRC}/${file}.jpg`)
    .extract({left: 0, top: best.start, width, height: best.len})
    .resize({width: 1600, withoutEnlargement: true})
    .jpeg({quality: 82, mozjpeg: true})
    .toFile(`${OUT}/${out}`);
  console.log(out, `${width}x${best.len}`, `(band y=${best.start})`);
}

/** Full-bleed gallery screenshots with next/prev chevrons burned into the sides. */
async function cropSides(file, out, frac = 0.13) {
  const img = sharp(`${SRC}/${file}.jpg`);
  const {width, height} = await img.metadata();
  const cut = Math.round(width * frac);
  await img
    .extract({left: cut, top: 0, width: width - cut * 2, height})
    .resize({width: 1600, withoutEnlargement: true})
    .jpeg({quality: 82, mozjpeg: true})
    .toFile(`${OUT}/${out}`);
  console.log(out, `${width - cut * 2}x${height}`);
}

/** Already a clean photo — just compress. */
async function plain(file, out) {
  await sharp(`${SRC}/${file}.jpg`)
    .resize({width: 1600, withoutEnlargement: true})
    .jpeg({quality: 82, mozjpeg: true})
    .toFile(`${OUT}/${out}`);
  console.log(out, 'plain');
}

fs.mkdirSync(OUT, {recursive: true});

// Freestanding Finnish chalet — only an exterior shot so far.
await plain('vi8mv4hcc8k8u7w5ky7f5xi7', 'chalet-1.jpg');

// 8-person linked home — the interior with the staircase and sage kitchen.
await cropSides('lqn3q59ndi4ulmmpxubodbd5', 'kattenberg8-1.jpg');

// 6-person linked home — one full funda set: two exteriors plus the interior.
await autoCropBand('x5vjy6r7y4wxn33rfaok4lbh', 'kattenberg6-1.jpg');
await autoCropBand('v2yjxdu70uvjd95h5ga7xjxt', 'kattenberg6-2.jpg');
await autoCropBand('ti1ndgj1b2ffdka4fsuv16ts', 'kattenberg6-3.jpg');
await cropSides('mt8p4e7magmwjq4vsqj4acry', 'kattenberg6-4.jpg');
await autoCropBand('pxg4truiwlf7mm9e3or9evhk', 'kattenberg6-5.jpg');
await autoCropBand('m85iedlbcfznytnocvzj11fd', 'kattenberg6-6.jpg');
await autoCropBand('zdgc5kp8xbbequa6rk1d71i2', 'kattenberg6-7.jpg');
