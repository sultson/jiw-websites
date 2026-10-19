// Maakt een thumbnail van 640x360 met het Puur Genieten-logo midden op het
// donkere vlak van de site, voor de videokaart die eerst de Life Is
// Beautiful-leader als beeld had (19-10-2026, verzoek van de klant).
import sharp from '../../../jiw-crm/node_modules/sharp/lib/index.js';

const W = 640, H = 360, D = 260;   // logo 260px hoog, laat lucht rondom
const logo = await sharp('inhoud/assets/download/puur-genieten-logo-2048.png')
  .resize(D, D, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toBuffer();

await sharp({ create: { width: W, height: H, channels: 4, background: { r: 13, g: 17, b: 23, alpha: 1 } } })
  .composite([{ input: logo, left: (W - D) >> 1, top: (H - D) >> 1 }])
  .webp({ quality: 90 })
  .toFile('inhoud/assets/video/thumbs/5vDZX9njxsI.webp');
console.log('thumb geschreven');
