/* Het logo voor de bevestigingsmail, als png.
 *
 * De site gebruikt sinds 25-09-2026 svg's, en sinds 25-09 's avonds de variant
 * zonder <mask> omdat Safari die door een tussenlaagje duwt en dan wazig
 * tekent. In een mail kan geen van de twee: een svg wordt door Outlook en door
 * Gmail niet getoond, dus staat er een leeg vak waar haar naam hoort. Daarom
 * een png, en daarom in de bouw gemaakt en niet een keer met de hand - dan
 * loopt hij achter zodra het merkbestand verandert.
 *
 * Twee keer de weergavebreedte (440 voor een weergave op 220), zodat hij op een
 * retina-scherm scherp blijft. Op een cremekleurige kaart, niet transparant: een
 * deel van de mailprogramma's zet zijn eigen achtergrond onder een transparante
 * png, en dan staat haar goud op donkergrijs.
 *
 * Het woordmerk op licht is de variant met het verschoven lichtvenster
 * (logo-goud-op-licht-vol.svg). Het aangeleverde verloop loopt door tot bijna
 * wit en valt op creme weg; zie de noot bovenaan styles.css.
 *
 *   node tools/gen-mail-logo.mjs
 */
import { mkdirSync } from 'node:fs';
// sharp neemt geen URL aan zodra er ook opties meegaan (density), en op Windows
// is dat niet hetzelfde als het pad: een file:///C:/... url als string geeft
// "unsupported input". Dus fileURLToPath ertussen.
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const BREED = 440;
const CREME = { r: 0xFC, g: 0xF8, b: 0xF1, alpha: 1 };

const bron = new URL('../statisch/photos/merk/logo-goud-op-licht-vol.svg', import.meta.url);
const doel = new URL('../statisch/photos/merk/logo-mail.png', import.meta.url);

mkdirSync(new URL('.', doel), { recursive: true });

/* Geen density erbij. Het svg is van zichzelf 2396 breed, dus rasteren op de
   eigen maat en daarna terug naar 440 is al ruim boven de weergavebreedte;
   density 600 maakte er een plaat van 19000 breed en sharp weigert die. */
const plaat = await sharp(fileURLToPath(bron))
  .resize({ width: BREED })
  .flatten({ background: CREME })
  .png({ compressionLevel: 9 })
  .toFile(fileURLToPath(doel));

console.log(`logo-mail.png  ${plaat.width}x${plaat.height}, ${(plaat.size / 1024).toFixed(1)} kB`);
