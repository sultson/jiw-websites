/* De logoplaten voor de mail, als png. Er zijn er TWEE en dat is met opzet.
 *
 * De site gebruikt een svg. In een mail kan dat niet: Outlook en Gmail tonen een svg
 * niet, dus staat er een leeg vak waar zijn naam hoort. Daarom een png, en daarom in de
 * bouw gemaakt en niet een keer met de hand - dan loopt hij achter zodra het
 * merkbestand verandert.
 *
 *  - logo-mail.png, 440 breed voor een weergave op 220 (`logoWidth` in
 *    worker/confirmation.ts). Twee keer de weergavemaat, zodat hij op een retina-scherm
 *    scherp blijft. Dat MAG daar, want een bevestigingsmail wordt GELEZEN en elke lezer
 *    (Gmail, Outlook, Mail) houdt zich aan de opgegeven breedte.
 *
 *  - logo-handtekening.png, precies even breed als hij getoond wordt (LOGO_BREED uit
 *    handtekening.mjs, nu 110). Geen retina-plaat, en daar is een gemeten reden voor.
 *
 * Waarom die tweede plaat bestaat. Armando, 01-11-2026, met een schermafdruk uit Mail
 * op de MacBook: logo enorm, en de tekst eronder in plaats van ernaast. Nagemeten in die
 * schermafdruk (2x retina): het logo stond 154 css-px HOOG terwijl er `height="42"` op
 * staat, en dat is op 13 px na de natuurlijke hoogte van de plaat van 440x167. De
 * handtekening is dus niet verkeerd opgemaakt - Mail toont de plaat op zijn EIGEN
 * pixelmaat en gooit de opgegeven breedte en hoogte weg. Een logovak van 440 past
 * daarna niet meer naast de tekst, en dan valt de tabel om. Een handtekening gaat door
 * de editor van Mail en die bewaart wat hij toont; een mail wordt alleen weergegeven.
 *
 * De reparatie is niet een andere opmaak maar de plaat zelf op de weergavemaat zetten.
 * Dat werkt in beide werelden: houdt een programma zich wel aan width/height, dan komt
 * er hetzelfde uit. Een opmaak die van de goede wil van de lezer afhangt is geen
 * reparatie. De prijs is dat het logo op een retina-scherm iets zachter staat; dat is
 * niet te vermijden zolang de maat uit het bestand komt.
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
import { LOGO_BREED, LOGO_SCHAAL } from '../handtekening.mjs';

const WIT = { r: 255, g: 255, b: 255, alpha: 1 };

/* De handtekeningplaat leest zijn maat uit handtekening.mjs en staat hier niet op
   schrift: twee getallen voor dezelfde breedte lopen gegarandeerd uit de pas, en dan
   staat het logo in zijn handtekening weer te groot zonder dat iemand het hier ziet.
   handtekening.mjs toetst het bovendien andersom - die zakt als de plaat niet precies
   LOGO_BREED breed is. */
const PLATEN = [
  { naam: 'logo-mail.png', breed: 440, dpi: 72 },
  { naam: 'logo-handtekening.png', breed: LOGO_BREED * LOGO_SCHAAL, dpi: 72 * LOGO_SCHAAL },
];

const bron = new URL('../public/logo.svg', import.meta.url);

/* Geen `density` erbij. Het svg is van zichzelf 1420 breed, dus rasteren op de eigen
   maat en daarna terug naar 440 zit ruim boven de weergavebreedte; met een hoge density
   maakt sharp er een plaat van duizenden pixels breed en dat weigert hij. (Zelfde noot
   staat bij velvet-cakes, waar dit een keer misging.)

   sharp neemt geen URL aan zodra er ook opties meegaan, en op Windows is een
   file:///C:/... url als string niet hetzelfde als het pad - dat geeft "unsupported
   input". Dus fileURLToPath ertussen. */
for (const { naam, breed, dpi } of PLATEN) {
  const doel = new URL(`../public/${naam}`, import.meta.url);
  /* `withMetadata({density})` schrijft de pHYs-blok (dpi / 0,0254 pixels per meter).
     Dat is de maat waar Mail op de Mac op afgaat voor de handtekeningplaat; voor
     logo-mail.png doet hij niets, want die mail wordt alleen weergegeven en daar geldt
     de opgegeven breedte. Zie LOGO_SCHAAL in handtekening.mjs. */
  const plaat = await sharp(fileURLToPath(bron))
    .resize({ width: breed })
    .flatten({ background: WIT })
    .withMetadata({ density: dpi })
    .png({ compressionLevel: 9 })
    .toFile(fileURLToPath(doel));

  const weergave = Math.round(plaat.width / (dpi / 72));
  console.log(
    `${naam}  ${plaat.width}x${plaat.height} op ${dpi} dpi = ${weergave} px weergave, ${(plaat.size / 1024).toFixed(1)} kB`,
  );
}
