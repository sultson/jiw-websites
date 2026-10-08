/* Het deelplaatje: wat er meekomt als iemand rhklusservice.nl in WhatsApp,
   LinkedIn of Signal stuurt. 1200x630, het witte woordmerk op zwart.

   Robbin koos op 08-10-2026 (via Armando) deze variant uit vier: foto zonder
   logo, logo klein, logo groot, foto met logo in de hoek. Groot is 1020 van de
   1200 breed, dus 85 procent van de breedte.

   Dit was maak-deelproef.mjs, dat drie proefadressen schreef om de varianten in
   WhatsApp naast elkaar te kunnen zien. Die zijn weg; dit bouwt alleen nog het
   gekozen plaatje.

   Let op: dit is bewust niet het beeld in het LocalBusiness-schema. Daar staat
   de foto van de overkapping (FOTO_BEELD in onderdelen.mjs), want Google wil in
   `image` zien wat hij maakt, geen bedrijfsnaam in beeld.

   JPEG en geen AVIF of WebP: de crawlers die dit ophalen snappen alleen jpg en
   png. maak-plaatjes.mjs laat deze map daarom met rust. */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const eis = createRequire(import.meta.url);
const sharp = eis('sharp');

const hier = dirname(fileURLToPath(import.meta.url));
const DIST = join(hier, 'dist');

const BREED = 1200;
const HOOG = 630;
const LOGO_BREED = 1020;

/* Het brede logo is wit en 569x100. sharp schaalt een svg op dichtheid, dus die
   reken ik uit in plaats van hem als plaatje op te blazen; anders wordt de rand
   van de letters zacht. */
const svg = readFileSync(join(DIST, 'logo/rh-klusservice-breed.svg'));
const merk = await sharp(svg, { density: Math.ceil((72 * LOGO_BREED) / 569) })
  .resize({ width: LOGO_BREED })
  .png()
  .toBuffer();

const { height } = await sharp(merk).metadata();

await sharp({
  create: { width: BREED, height: HOOG, channels: 3, background: '#000000' },
})
  .composite([
    {
      input: merk,
      left: Math.round((BREED - LOGO_BREED) / 2),
      top: Math.round((HOOG - height) / 2),
    },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(join(DIST, 'foto/og-rh-klusservice-logo.jpg'));

console.log(`deelplaatje: foto/og-rh-klusservice-logo.jpg (${BREED}x${HOOG}, logo ${LOGO_BREED} breed)`);
