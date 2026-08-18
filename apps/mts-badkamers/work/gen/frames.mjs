// Zet het eerste (kale bouwstaat) en laatste (opgeleverd) frame klaar voor de hero-video.
// LTX accepteert alleen 1280x720/720x1280/1920x1080/1080x1920, dus 9:16.
// Beide bronnen zijn 3:4, dus ze krijgen exact dezelfde uitsnede - anders verspringt
// de ruimte tussen het eerste en het laatste frame en klopt de opbouw niet meer.
import sharp from 'sharp';

const W = 1080, H = 1920;

async function frame(src, out) {
  const img = sharp(src);
  const { width, height } = await img.metadata();
  // 9:16 uit een 3:4 bron: volle hoogte, breedte terug naar height * 9/16.
  const cw = Math.round(height * 9 / 16);
  const left = Math.round((width - cw) / 2);
  await sharp(src)
    .extract({ left, top: 0, width: cw, height })
    .resize(W, H)
    .jpeg({ quality: 94 })
    .toFile(out);
  console.log("OK", out, `${width}x${height} -> crop ${cw}x${height} @${left} -> ${W}x${H}`);
}

await frame("work/gen/bare-1.jpg", "work/gen/f-first.jpg");
await frame("assets/media/115_f0knx5qd1atmq2gzswern7ga.jpg", "work/gen/f-last.jpg");
