/* Het logo voor de bevestigingsmail, als png.
 *
 * De site gebruikt een svg. In een mail kan dat niet: Outlook en Gmail tonen een svg
 * niet, dus staat er een leeg vak waar zijn naam hoort. Daarom een png, en daarom in de
 * bouw gemaakt en niet een keer met de hand - dan loopt hij achter zodra het
 * merkbestand verandert.
 *
 * Twee keer de weergavebreedte (440 voor een weergave op 220, zie `logoWidth` in
 * worker/confirmation.ts), zodat hij op een retina-scherm scherp blijft.
 *
 * Op wit en NIET transparant. Een deel van de mailprogramma's zet zijn eigen
 * achtergrond onder een transparante png, en dan staat zijn donkerblauwe woordmerk op
 * donkergrijs. Wit is ook wat eronder zit: de logobalk van de mail is `surfaceAlt`
 * (#F7F8FB), een tint die van wit nauwelijks te onderscheiden is.
 *
 * Schrijft naar public/, niet naar dist/ - build.mjs gooit dist/ bij elke bouw leeg en
 * zou deze plaat dus meenemen. build.mjs kopieert hem naar dist/ en ZAKT als hij er niet
 * ligt, want de mail verwijst naar /logo-mail.png: ontbreekt dat bestand, dan krijgt de
 * bezoeker een gebroken plaatje in de enige mail die hij ooit van Pascal krijgt.
 *
 *   node tools/gen-mail-logo.mjs
 */
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const BREED = 440;
const WIT = { r: 255, g: 255, b: 255, alpha: 1 };

const bron = new URL('../public/logo.svg', import.meta.url);
const doel = new URL('../public/logo-mail.png', import.meta.url);

/* Geen `density` erbij. Het svg is van zichzelf 1420 breed, dus rasteren op de eigen
   maat en daarna terug naar 440 zit ruim boven de weergavebreedte; met een hoge density
   maakt sharp er een plaat van duizenden pixels breed en dat weigert hij. (Zelfde noot
   staat bij velvet-cakes, waar dit een keer misging.)

   sharp neemt geen URL aan zodra er ook opties meegaan, en op Windows is een
   file:///C:/... url als string niet hetzelfde als het pad - dat geeft "unsupported
   input". Dus fileURLToPath ertussen. */
const plaat = await sharp(fileURLToPath(bron))
  .resize({ width: BREED })
  .flatten({ background: WIT })
  .png({ compressionLevel: 9 })
  .toFile(fileURLToPath(doel));

console.log(`logo-mail.png  ${plaat.width}x${plaat.height}, ${(plaat.size / 1024).toFixed(1)} kB`);
