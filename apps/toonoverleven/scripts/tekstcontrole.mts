/**
 * Loopt de tweeënzeventig pagina's na zoals ze werkelijk gerenderd worden, dus
 * ná de bevestigde feiten en de herstelde links, en meldt elke zin die nog over
 * het voorstel gaat in plaats van over het inloophuis.
 */
import { PAGINAS, type Pagina, type Tekst } from '../src/inhoud';
import { metFeiten } from '../src/inhoud/feiten';
import { metEchteLinks } from '../src/inhoud/links';
import { defaults } from '../src/content/defaults';

const VERDACHT =
  /(mock-?up|deze pagina toont|de definitieve (website|pagina)|op de definitieve|bij realisatie|wordt bij realisatie|nog niet bevestigd|zodra .{0,40}bevestigd|moeten? .{0,40}(bevestigd|uitgelegd|worden getoond)|worden pas als feit|kaartopzet|bestuursmock|controlepunt|sfeerbeeld|voorbeelden zijn ontleend)/i;

const plat = (t: Tekst): string => t.map((s) => (typeof s === 'string' ? s : s.tekst)).join('');

function zinnen(pagina: Pagina): string[] {
  const uit: string[] = [];
  const voegToe = (t?: Tekst[]) => t?.forEach((r) => uit.push(plat(r)));
  uit.push(pagina.titel, pagina.omschrijving, pagina.hero.titel);
  voegToe([pagina.hero.lead, pagina.hero.onder]);
  for (const blok of pagina.blokken) {
    if ('kop' in blok && blok.kop) uit.push(blok.kop);
    if ('intro' in blok && blok.intro) uit.push(plat(blok.intro));
    if ('tekst' in blok) voegToe(blok.tekst);
    if ('punten' in blok) voegToe(blok.punten);
    if ('kaarten' in blok)
      blok.kaarten?.forEach((k: any) => {
        uit.push(k.kop);
        voegToe(k.tekst);
      });
    if ('inzichten' in blok)
      blok.inzichten?.forEach((k) => {
        uit.push(k.kop);
        voegToe(k.tekst);
      });
    if ('grens' in blok && blok.grens) {
      uit.push(blok.grens.kop);
      voegToe(blok.grens.tekst);
    }
    if ('acties' in blok) blok.acties?.forEach((a) => uit.push(a.label));
  }
  if (pagina.zijkaart) {
    uit.push(pagina.zijkaart.kop);
    voegToe(pagina.zijkaart.tekst);
  }
  return uit.filter(Boolean);
}

let totaal = 0;
for (const ruw of PAGINAS) {
  const pagina = metEchteLinks(metFeiten(ruw, defaults.teksten));
  const raak = zinnen(pagina).filter((z) => VERDACHT.test(z));
  if (raak.length) {
    console.log(`\n== ${pagina.pad}`);
    for (const z of raak) console.log('   -', z.slice(0, 220));
    totaal += raak.length;
  }
}
console.log(`\n${totaal} verdachte zinnen`);
