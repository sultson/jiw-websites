/*
 * De mailhandtekening van Pascal: /handtekening/
 *
 * Een hulppagina en geen pagina van de site. Hij staat niet in het menu, niet in de
 * voet, niet in de sitemap, en draagt noindex - ook in een productiebouw. Wie hem niet
 * krijgt toegestuurd, vindt hem niet. tools/vooraf.mjs keurt hem apart (HULP_PADEN in
 * inhoud.mjs) en eist bovendien dat geen enkele pagina ernaartoe linkt.
 *
 * Twee dingen zitten hier bewust anders dan in de voorganger op noverabouw.nl:
 *
 * 1. De handtekening wordt HIER gebouwd en staat als gewone html in de pagina. Bij
 *    Novera tekende het script hem pas in de browser, en dan staat de enige inhoud van
 *    de pagina in een <script> - precies wat de woordvloer van vooraf.mjs moet vangen,
 *    en niets kan er dan op toetsen. Dezelfde functie gaat ook mee naar de browser (via
 *    String(), zie onderaan), zodat er een rekensom bestaat voor de naam die Pascal zelf
 *    intypt en niet twee.
 *
 * 2. De gegevens komen uit BEDRIJF in inhoud.mjs en staan hier niet op schrift. Een
 *    handtekening is de plek waar een oud telefoonnummer het langst blijft staan: hij
 *    hangt onder elke mail en niemand leest hem nog. Verandert zijn nummer, dan is
 *    inhoud.mjs de enige plek waar je hoeft te zijn, en controleer.mjs legt de gebouwde
 *    pagina ernaast.
 *
 * Er is GEEN functieveld, en onder de naam staat geen "Eigenaar - Hulskers
 * Schilderwerken" (Armando streepte die regel door op 27-10-2026). Novera heeft dat veld
 * omdat daar meer mensen mailen; hier mailt Pascal. En de bedrijfsnaam staat al in het
 * logo ernaast, dus die regel zei hem een tweede keer. Zet je het veld terug, zet dan
 * ook de regel terug - een veld dat niets verandert is erger dan geen veld.
 *
 * De instructies gaan ALLEEN over Mail van Apple, op de Mac en op de iPhone (Armando,
 * 27-10-2026: "hulskers gebruikt alleen de mail app op iphone / macbook de officiele").
 * Gmail en Outlook staan er dus niet in. Dat scheelt niet alleen regels: de twee
 * valkuilen hieronder zijn van Mail en van niets anders.
 *
 *  - Op de Mac gooit Mail de kleuren en het lettertype van een geplakte handtekening weg
 *    zolang het vinkje over het standaardberichtlettertype aan staat. Dat is de stap die
 *    iedereen overslaat, want de handtekening ziet er in het vak nog goed uit.
 *  - Op de iPhone kun je een afbeelding niet rechtstreeks in het handtekeningveld
 *    krijgen; de weg die het wel doet is hem uit een ontvangen mail kopieren. Daarom
 *    staat die weg hier vooraan en de snelle weg erachter, en niet andersom.
 *
 * Het logo is logo-handtekening.png, met een witte achtergrond ingebakken (zie
 * tools/gen-mail-logo.mjs), en het gaat als data:-beeld MEE in de handtekening in plaats
 * van als adres op onze server - zie de noot bij `logo` in handtekeningGegevens. Een svg
 * toont geen enkel mailprogramma. De hoogte wordt uit het bestand zelf gelezen, niet
 * hier opgeschreven - anders staat de verhouding scheef zodra het merkbestand verandert.
 *
 * Het is NIET dezelfde plaat als in de bevestigingsmail (logo-mail.png, 440 breed voor
 * een weergave op 220). Die was hij wel, en daar ging het op 01-11-2026 op stuk: Mail
 * op de Mac toont een handtekeningplaat op zijn EIGEN pixelmaat en gooit de opgegeven
 * width en height weg, dus er stond een logo van 440 px in een veld van 320 en de tabel
 * viel om.
 *
 * "Kan het echt niet scherper?" (Armando, 01-11-2026). Dat kon, en de reparatie van
 * vanochtend - de plaat op precies LOGO_BREED zetten - was de botte helft van het
 * antwoord. Zie LOGO_SCHAAL hieronder: wat Mail weggooit is de maat in de OPMAAK, niet
 * de maat die de plaat zelf aandraagt, en een png draagt naast zijn pixels ook zijn
 * pixeldichtheid (de pHYs-blok). Twee keer de pixels op twee keer de dichtheid is
 * dezelfde maat op papier en twee keer zoveel beeld.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { aipoort } from './tools/poorten/aipoort.mjs'
import { BEDRIJF } from './inhoud.mjs'

const HIER = path.dirname(fileURLToPath(import.meta.url))

/*
 * De maten van de handtekening. Ze staan hier bij elkaar omdat ze samen EEN rekensom
 * zijn: logo + tussenruimte + de langste tekstregel moeten in het berichtveld van Mail
 * passen. Op een telefoon is dat ongeveer 320 tot 360 px.
 *
 * Armando, 28-10-2026, met een schermafdruk uit Mail op zijn iPhone: "Het is vervelend
 * dat ie over twee regels gaat." Er stond info@hulskersschilderwer / ken.nl en
 * hulskersschilderwerken / .nl - midden in het woord afgebroken. De handtekening was 394
 * px breed en het veld ongeveer 360, dus Mail hakte het langste woord doormidden.
 *
 * De reparatie is niet een andere regelval maar 74 px eraf, en ze zit op twee plekken:
 *
 *  - het mailadres en het webadres dragen white-space:nowrap, dus ze KUNNEN niet meer
 *    midden in een woord breken;
 *  - en de maten hieronder zorgen dat dat ook niet hoeft. Zonder dat tweede stuk zou de
 *    tabel gewoon buiten het veld steken, en dan is er niets opgelost.
 *
 * tools/handtekening-breedte.mjs rekent dat na en zakt bij een regel die breekt of een
 * tabel die niet past. Draai hem voordat je hier een getal omhoog zet: het mailadres is
 * 30 tekens en dat is de regel die alles bepaalt.
 */
export const LOGO_BREED = 110 /* was 174: 64 px eraf */

/*
 * Hoeveel pixels de handtekeningplaat per weergavepixel draagt. 2 = 220x84 beeld in een
 * vak van 110x42, en dat is wat een retina-scherm ook echt kan tonen.
 *
 * Waarom dat kan terwijl de plaat vanochtend juist op 110 moest. Mail gooit width en
 * height uit de OPMAAK weg en vraagt de plaat zelf hoe groot hij is. Dat antwoord is
 * niet "mijn pixels": een png draagt een pHYs-blok met zijn pixeldichtheid, en macOS
 * rekent daarmee pixels naar punten (pixels / (dpi / 72)). Een plaat van 220 px op 144
 * dpi is dus 110 punten breed - dezelfde maat als nu, met twee keer zoveel beeld erin.
 * Zonder pHYs valt een png terug op 72 dpi, en dan IS 220 px ook 220 punten: precies de
 * kapotte tabel van vorige week. Daarom is de dichtheid hier een eis en geen bijzaak.
 *
 * EEN knop, aan beide kanten vastgezet: gen-mail-logo.mjs maakt de plaat op
 * LOGO_BREED * LOGO_SCHAAL met 72 * LOGO_SCHAAL dpi, en handtekeningGegevens zakt als de
 * plaat die maat of die dichtheid niet heeft. Blijkt Mail de dichtheid toch te negeren,
 * dan is dit getal terug op 1 de hele terugdraai - niet een plaat die ergens
 * achterblijft bij een maat die hier veranderde.
 */
export const LOGO_SCHAAL = 2
const KIER = 14 /* ruimte links en rechts van de streep, was 18 */
const MAAT = {
  naam: 15, /* was 16 */
  tekst: 12, /* was 13 - dit is de regel met het mailadres erin, dus hier zit de winst */
  klein: 11,
}

const STANDAARD = { naam: 'Pascal Hulskers' }

/*
 * De tekst van de pagina. Een eigen blok, zodat hij door dezelfde ai-poort gaat als de
 * copy van de site (onderaan dit bestand). Een hulppagina is geen klantcopy, maar hij
 * wordt wel gelezen door de klant.
 */
export const HT = {
  omschrijving: 'Hulppagina: hier kopieert Pascal zijn mailhandtekening met logo.',
  kop: 'Mailhandtekening',
  lead: 'Vul uw naam in, kopieer de handtekening en zet hem in Mail. Het logo en de kleuren staan er al in.',
  veldNaam: 'Naam',
  kopieer: 'Handtekening kopieren',
  selecteer: 'Selecteer hem zelf',
  gelukt: 'Gekopieerd, met logo en kleuren.',
  geluktKaal: 'Gekopieerd.',
  mislukt: 'Hij staat geselecteerd, kopieer hem nu zelf.',
  geselecteerd: 'Hij staat geselecteerd. Kopieer hem met Cmd+C of met het menu.',

  macKop: 'In Mail op de Mac',
  mac: [
    'Druk hierboven op <strong>Handtekening kopieren</strong>.',
    'Open Mail en kies in de menubalk <strong>Mail</strong> &rsaquo; <strong>Instellingen</strong> (op oudere versies <strong>Voorkeuren</strong>).',
    'Klik op het tabblad <strong>Handtekeningen</strong> en kies links het account waarmee u mailt.',
    'Druk op de plusknop onder de middelste kolom en geef de handtekening een naam.',
    'Klik in het vak rechts, haal de voorbeeldtekst weg en plak.',
    'Zet het vinkje over het standaardlettertype <strong>uit</strong>: <em>Pas aan standaardberichtlettertype aan</em>, op oudere versies <em>Gebruik altijd mijn standaardlettertype</em>. Staat dat vinkje aan, dan vervangt Mail de kleuren en het lettertype door die van uw bericht.',
    'Kies onderaan bij <strong>Kies handtekening</strong> deze handtekening, dan staat hij onder elke nieuwe mail.',
  ],

  iphoneKop: 'In Mail op de iPhone',
  iphoneLead:
    'Op de telefoon laat Mail een afbeelding niet rechtstreeks in het handtekeningveld toe. De weg die het wel doet loopt via een mail die u uzelf stuurt.',
  iphone: [
    'Zet de handtekening eerst op de Mac (hierboven) en stuur uzelf een mail. De handtekening staat er dan onder.',
    'Open die mail op de telefoon in <strong>Mail</strong>. Houd uw vinger op de handtekening, kies <strong>Selecteer alles</strong> en daarna <strong>Kopieer</strong>.',
    'Ga naar <strong>Instellingen</strong> &rsaquo; <strong>Apps</strong> &rsaquo; <strong>Mail</strong> &rsaquo; <strong>Handtekening</strong>. Op oudere iOS-versies staat Mail niet onder Apps maar los in de lijst.',
    'Haal <em>Verstuurd vanaf mijn iPhone</em> weg, houd ingedrukt en kies <strong>Plak</strong>.',
  ],
  schud:
    'Is de opmaak na het plakken weg? Schud de telefoon. Er verschijnt een venster om de wijziging ongedaan te maken; tik daarop en de kleuren komen terug. Dat is een eigenaardigheid van iOS en zegt niets over de handtekening.',
  snel:
    'Sneller, al lukt het op de telefoon lang niet altijd: open deze pagina op de iPhone, druk op Handtekening kopieren en plak meteen in dat veld. Komt het logo niet mee, neem dan de weg hierboven.',
  twee:
    'Mail op de Mac en Mail op de telefoon bewaren elk hun eigen handtekening. U zet hem dus twee keer, en na een wijziging ook twee keer opnieuw.',
  voet:
    'Het logo zit in de handtekening zelf en wordt nergens opgehaald. Het staat er dus ook bij een ontvanger die externe afbeeldingen blokkeert.',
}

/* ------------------------------------------------------------------ de handtekening
 *
 * Deze functie draait twee keer: hier in de bouw (voor de html die in de pagina staat)
 * en in de browser (zodra Pascal zijn naam wijzigt). Hij gaat met String()
 * mee de pagina in, dus hij mag NIETS gebruiken wat buiten zijn eigen argumenten staat.
 *
 * Een tabel met stijl per element en geen enkele klasse: een mailprogramma leest geen
 * stylesheet, en Mail knipt bij het plakken alles weg wat het niet begrijpt.
 */
export function handtekeningHtml(naam, G) {
  const ont = (s) =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const n = ont(naam.trim() || G.naam)

  /* Het adres en het webadres mogen nooit midden in het woord afbreken: nowrap. */
  const vast = 'white-space:nowrap;'

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="vertical-align:middle;padding:0 ${G.kier}px 0 0;">
      <img src="${G.logo}" width="${G.breed}" height="${G.hoog}" alt="${ont(G.bedrijf)}" style="display:block;border:0;width:${G.breed}px;height:${G.hoog}px;" />
    </td>
    <td style="vertical-align:middle;border-left:2px solid ${G.blauw};padding:2px 0 2px ${G.kier}px;">
      <div style="font:700 ${G.maatNaam}px/1.3 Arial,Helvetica,sans-serif;color:${G.navy};${vast}">${n}</div>
      <div style="height:7px;line-height:7px;font-size:0;">&nbsp;</div>
      <div style="font:400 ${G.maatTekst}px/1.7 Arial,Helvetica,sans-serif;color:${G.inkt};">
        <a href="tel:${G.telLink}" style="color:${G.inkt};text-decoration:none;${vast}">${G.telToon}</a><br />
        <a href="mailto:${G.mail}" style="color:${G.inkt};text-decoration:none;${vast}">${G.mail}</a><br />
        <a href="https://${G.domein}/" style="color:${G.blauw};text-decoration:none;font-weight:bold;${vast}">${G.domein}</a>
      </div>
      <div style="height:7px;line-height:7px;font-size:0;">&nbsp;</div>
      <div style="font:400 ${G.maatKlein}px/1.5 Arial,Helvetica,sans-serif;color:${G.grijs};${vast}">${ont(G.plaats)} &middot; KvK ${G.kvk}</div>
    </td>
  </tr>
</table>`
}

/* De platte versie, voor een mailprogramma dat alleen tekst aanneemt. Draait alleen in
   de browser, naast de html op het klembord.
 *
 * Hier staat de bedrijfsnaam WEL als regel, terwijl hij uit de html-versie is (Armando,
 * 27-10-2026, streepte "Eigenaar - Hulskers Schilderwerken" door). Dat is geen
 * verschil dat uit de pas loopt maar de reden ervoor: in de html draagt het logo de
 * naam, en in platte tekst is er geen logo. Zonder die regel staat er een mail van
 * Pascal Hulskers zonder dat ergens zijn bedrijf staat. */
export function handtekeningPlat(naam, G) {
  const r = [naam.trim() || G.naam, G.bedrijf]
  r.push('', G.telToon, G.mail, G.domein, '', `${G.plaats} - KvK ${G.kvk}`)
  return r.join('\n')
}

/*
 * De maat van het logo, uit het bestand zelf.
 *
 * Een png draagt zijn breedte en hoogte in de IHDR, de eerste blok na de acht bytes van
 * de handtekening: vier bytes breedte op 16 en vier bytes hoogte op 20. Dat scheelt een
 * afhankelijkheid, en belangrijker: de verhouding in de handtekening kan niet scheef
 * gaan staan zodra het merkbestand verandert. Een vaste hoogte hier zou dat stil doen,
 * en een uitgerekt logo in een mail ziet alleen de ontvanger.
 */
function maatVanPng(bestand) {
  /* Met zijn eigen melding: een kale ENOENT uit de bouw zegt niet dat er een script
     naast ligt dat deze plaat maakt. */
  if (!fs.existsSync(bestand)) {
    throw new Error(`handtekening: ${path.basename(bestand)} ligt niet in public/ - draai \`node tools/gen-mail-logo.mjs\``)
  }
  return maatVanPngBuffer(fs.readFileSync(bestand), path.basename(bestand))
}

/*
 * Breedte, hoogte EN pixeldichtheid uit de png zelf. Die derde is hier geen bijzaak maar
 * de maat waar Mail op afgaat (zie LOGO_SCHAAL), en hij staat in een blok dat optioneel
 * is - dus ontbreken is een echte uitkomst en niet een leesfout.
 *
 * De blokken staan achter de acht bytes van de png-handtekening, elk als lengte (4),
 * naam (4), inhoud, controlegetal (4). IHDR is altijd de eerste: breedte op 16, hoogte op
 * 20. pHYs kan erachter overal staan en draagt pixels per eenheid in x en y plus de
 * eenheid; eenheid 1 is de meter, en dan is dpi het aantal maal 0,0254.
 */
function maatVanPngBuffer(b, naam) {
  if (b.length < 24 || b.readUInt32BE(12) !== 0x49484452) {
    throw new Error(`handtekening: ${naam} is geen png met een IHDR op de verwachte plek`)
  }
  let dpi = null
  for (let p = 8; p + 12 <= b.length; ) {
    const len = b.readUInt32BE(p)
    if (b.toString('ascii', p + 4, p + 8) === 'pHYs' && len === 9 && p + 8 + len <= b.length) {
      if (b[p + 16] === 1) dpi = Math.round(b.readUInt32BE(p + 8) * 0.0254)
      break
    }
    p += 12 + len
  }
  return { breed: b.readUInt32BE(16), hoog: b.readUInt32BE(20), dpi }
}

/*
 * De twee eisen aan de handtekeningplaat bij elkaar, zodat ze niet uit elkaar kunnen
 * lopen: de bouw toetst het bestand in public/, keurHandtekening toetst het beeld dat
 * ECHT in de html staat. Dat zijn twee verschillende dingen - een plaat die na het
 * inlezen vervangen wordt haalt de eerste en niet de tweede.
 */
function keurPlaat(m, wat) {
  const moetBreed = LOGO_BREED * LOGO_SCHAAL
  if (m.breed !== moetBreed) {
    throw new Error(
      `handtekening: ${wat} is ${m.breed} px breed en moet ${moetBreed} zijn (${LOGO_BREED} weergave x ${LOGO_SCHAAL}). ` +
        'Mail op de Mac gooit de opgegeven maat weg en vraagt de plaat zelf hoe groot hij is. ' +
        'Draai `node tools/gen-mail-logo.mjs`.',
    )
  }
  const moetDpi = 72 * LOGO_SCHAAL
  if (LOGO_SCHAAL !== 1 && m.dpi !== moetDpi) {
    throw new Error(
      `handtekening: ${wat} draagt ${m.dpi === null ? 'geen pixeldichtheid' : m.dpi + ' dpi'} en moet ${moetDpi} dpi dragen. ` +
        `Zonder die dichtheid rekent Mail ${moetBreed} px als ${moetBreed} punten, en dan staat het logo ` +
        `${LOGO_SCHAAL} keer te groot naast de tekst - de kapotte tabel van 01-11-2026. ` +
        'Draai `node tools/gen-mail-logo.mjs`.',
    )
  }
}

export const LOGO_BESTAND = 'logo-handtekening.png'

export function handtekeningGegevens() {
  const echt = maatVanPng(path.join(HIER, 'public', LOGO_BESTAND))
  /*
   * Zakken en niet stil rechttrekken: een plaat van de verkeerde maat of zonder
   * pixeldichtheid is hier geen schoonheidsfoutje maar een kapotte handtekening, en hij
   * is op deze pagina niet te zien - die toont de plaat op de maat uit de opmaak, en dat
   * is precies de maat die Mail weggooit.
   */
  keurPlaat(echt, LOGO_BESTAND)
  return {
    /*
     * Het logo gaat als data:-beeld MEE in de handtekening, niet als adres op onze
     * server. Gemeten op 01-11-2026, en het is de omgekeerde keuze van vanochtend.
     *
     * Wat er stond was `https://<domein>/logo-handtekening.png`. Het klembord van deze
     * pagina draagt maar twee dingen - text/plain en text/html - en dus GEEN plaatje
     * (`node tools/klembord-dump.mjs`). Wie dat plakt geeft Mail een adres, en Mail moet
     * het er zelf bij halen. Lukt dat niet, dan zet hij een leeg vak van precies
     * 110x42 in de handtekening en BEWAART dat: de editor legt vast wat hij op dat
     * moment toont. Dat is wat Armando terugstuurde, en het is niet te repareren door
     * nog eens te plakken.
     *
     * Een data:-beeld heeft dat moment niet. Er valt niets op te halen, dus het kan ook
     * niet mislukken - niet bij het plakken, niet bij een mailprogramma dat externe
     * beelden blokkeert, en niet bij de ontvanger. De prijs is ~5,6 kB base64 onder elke
     * mail, en dat is dezelfde bijlage die een ingesloten logo toch al is.
     *
     * Hier stond eerder als reden tegen dat een data:-beeld "als bijlage meekomt of
     * verdwijnt". Het eerste klopt en is de bedoeling; het tweede was een vermoeden, en
     * het adres dat ervoor in de plaats kwam is wel aantoonbaar stukgegaan.
     */
    logo: `data:image/png;base64,${fs.readFileSync(path.join(HIER, 'public', LOGO_BESTAND)).toString('base64')}`,
    breed: LOGO_BREED,
    hoog: Math.round((LOGO_BREED * echt.hoog) / echt.breed),
    kier: KIER,
    maatNaam: MAAT.naam,
    maatTekst: MAAT.tekst,
    maatKlein: MAAT.klein,
    bedrijf: BEDRIJF.kort,
    naam: STANDAARD.naam,
    telToon: BEDRIJF.telWeergave,
    telLink: BEDRIJF.telLink,
    mail: BEDRIJF.mail,
    domein: BEDRIJF.domein,
    plaats: BEDRIJF.plaats,
    kvk: BEDRIJF.kvk,
    navy: '#0B1E8A',
    blauw: '#2D6BFF',
    inkt: '#1F2937',
    grijs: '#6B7280',
  }
}

/* ------------------------------------------------------------------------- de pagina */
const STIJL = `
:root{--navy:#0B1E8A;--blauw:#2D6BFF;--inkt:#1F2937;--grijs:#6B7280;--lijn:#E3E6EC;--mist:#F3F4F6}
*{box-sizing:border-box}
body{margin:0;background:var(--mist);color:var(--inkt);
  font:400 16px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  padding:32px 20px 72px}
.wrap{max-width:720px;margin:0 auto}
h1{color:var(--navy);font-size:clamp(26px,5vw,34px);line-height:1.15;margin:0 0 10px;letter-spacing:-.01em}
h2{color:var(--navy);font-size:19px;margin:34px 0 12px}
p{margin:0 0 14px;color:var(--inkt)}
.kaart{background:#fff;border:1px solid var(--lijn);border-radius:8px;padding:24px}
.velden{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:22px}
label{flex:1 1 200px;font-size:13px;font-weight:600;color:var(--navy)}
input{display:block;width:100%;margin-top:6px;padding:11px 12px;font:400 16px/1.4 inherit;
  color:var(--inkt);background:#fff;border:1px solid #C9CFDB;border-radius:6px}
input:focus{outline:2px solid var(--blauw);outline-offset:1px}
/* De handtekening is 317 px breed (zie de maten bovenin handtekening.mjs) en past
   daarmee ook op een telefoon in deze kaart. Het schuiven blijft staan voor het geval
   een langere naam hem toch breder maakt: dan knipt de kaart hem niet af. */
.voorbeeld{padding:4px 0 2px;overflow-x:auto}
.knoppen{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:22px}
button{font:600 15px/1.2 inherit;padding:12px 20px;border-radius:6px;border:1px solid var(--navy);
  background:var(--navy);color:#fff;cursor:pointer}
button.stil{background:#fff;color:var(--navy);border-color:#C9CFDB}
.melding{font-size:14px;color:var(--navy);font-weight:600}
ol{color:var(--inkt);padding-left:22px;margin:0 0 14px}
li{margin-bottom:9px}
.let{border-left:3px solid var(--blauw);padding:2px 0 2px 14px;margin:18px 0;font-size:15px;color:var(--inkt)}
footer{margin-top:40px;font-size:13px;color:var(--grijs)}
footer a{color:var(--navy)}
@media (max-width:420px){body{padding:24px 14px 56px}.kaart{padding:18px}}
`

/*
 * De poort op de handtekening zelf, en hij hangt in de bouw.
 *
 * Wat hier mis kan gaan is onzichtbaar op deze pagina: een handtekening die het hier
 * goed doet kan bij de ontvanger stuk zijn. Drie eisen daarom.
 *
 * 1. Elk zaakgegeven uit inhoud.mjs staat er ook echt in. Iemand die aan de opmaak
 *    sleutelt kan een regel kwijtraken, en een handtekening zonder telefoonnummer valt
 *    niemand op: hij hangt onder elke mail en wordt niet meer gelezen.
 * 2. Geen `class` en geen `<style>`. Een mailprogramma leest geen stylesheet, dus een
 *    klasse is opmaak die alleen hier werkt.
 * 3. Het logo hangt aan een volledig adres. Een pad dat met / begint zoekt het
 *    mailprogramma van de ontvanger op ZIJN domein, en dan staat er een kapot plaatje.
 * 4. Logo en tekst staan NAAST elkaar: een rij met twee vakken (Armando, 27-10-2026,
 *    "kan het niet naast elkaar zoals bij novera bouw"). Hij stond gestapeld, en dat is
 *    de vorm waar hij vanzelf naar terugvalt zodra iemand aan de tabel sleutelt - een
 *    tweede <tr> erbij en het staat weer onder elkaar, zonder dat er iets kapot lijkt.
 */
function keurHandtekening(html, G) {
  const moet = [
    ['telefoonnummer', G.telToon],
    ['telefoonlink', `tel:${G.telLink}`],
    ['mailadres', G.mail],
    ['domein', G.domein],
    ['plaats', G.plaats],
    ['kvk-nummer', G.kvk],
    ['logo', G.logo],
  ]
  for (const [wat, waarde] of moet) {
    if (!html.includes(waarde)) throw new Error(`handtekening: het ${wat} (${waarde}) staat niet in de handtekening`)
  }
  if (/\sclass=|<style/.test(html)) {
    throw new Error('handtekening: er staat een class of een <style> in - een mailprogramma leest geen stylesheet')
  }
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    if (!/^(?:https:\/\/|tel:|mailto:)/.test(m[1])) {
      throw new Error(`handtekening: ${m[1]} is geen volledig adres - bij de ontvanger wijst dat naar zijn eigen domein`)
    }
  }
  /*
   * Het logo mag NIET aan een adres hangen, ook niet aan een volledig adres op ons eigen
   * domein. Dat was de vorm tot 01-11-2026 en daar ging hij op stuk: het klembord draagt
   * geen plaatje, dus Mail moest het ophalen, en toen dat niet lukte bewaarde hij een
   * leeg vak. Een mislukte fetch is hier geen tijdelijk probleem maar een handtekening
   * die kapot in zijn Mail staat tot iemand hem opnieuw plakt.
   *
   * Vandaar beide kanten als eis, en niet alleen de goede vorm: zakken op een src die
   * opgehaald moet worden, en eisen dat het een data:-beeld is dat ook echt een png van
   * de weergavemaat bevat. Zonder dat tweede stuk is een lege of halve data-url ook een
   * leeg vak, en dat ziet niemand op deze pagina.
   */
  for (const m of html.matchAll(/src="([^"]+)"/g)) {
    if (/^https?:/.test(m[1])) {
      throw new Error(
        `handtekening: het logo hangt aan een adres (${m[1].slice(0, 60)}). Mail moet dat zelf ophalen en ` +
          'bewaart een leeg vak als dat mislukt - het beeld hoort als data: in de handtekening zelf.',
      )
    }
    const d = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(m[1])
    if (!d) throw new Error(`handtekening: ${m[1].slice(0, 40)} is geen data:image/png;base64 beeld`)
    keurPlaat(maatVanPngBuffer(Buffer.from(d[1], 'base64'), 'het ingesloten beeld'), 'het ingesloten beeld')
  }
  const rijen = (html.match(/<tr\b/g) || []).length
  const vakken = (html.match(/<td\b/g) || []).length
  if (rijen !== 1 || vakken !== 2) {
    throw new Error(
      `handtekening: logo en tekst moeten naast elkaar staan (een rij met twee vakken), gevonden: ${rijen} rij(en) en ${vakken} vak(ken)`,
    )
  }
  if (!/<td[^>]*border-left:/.test(html)) {
    throw new Error('handtekening: de streep tussen logo en tekst staat niet op het rechtervak (border-left)')
  }
  /*
   * 5. Het mailadres en het webadres mogen niet midden in het woord afbreken (Armando,
   *    28-10-2026). Dit is de goedkope helft van die reparatie en hij hoort hier, want
   *    het is te zien aan de html. De andere helft - past het geheel wel in het veld van
   *    Mail - is een meting en staat in tools/handtekening-breedte.mjs.
   */
  for (const [wat, naald] of [
    ['het mailadres', `mailto:${G.mail}`],
    ['het webadres', `https://${G.domein}/`],
  ]) {
    const regel = html.match(new RegExp(`<a href="${naald.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`))
    if (!regel || !regel[0].includes('white-space:nowrap')) {
      throw new Error(`handtekening: ${wat} draagt geen white-space:nowrap en kan dus midden in het woord afbreken`)
    }
  }
}

export function paginaHandtekening() {
  const G = handtekeningGegevens()
  const lijst = (regels) => regels.map((r) => `        <li>${r}</li>`).join('\n')
  const voorbeeld = handtekeningHtml(STANDAARD.naam, G)
  keurHandtekening(voorbeeld, G)

  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<title>${HT.kop} - ${BEDRIJF.kort}</title>
<meta name="description" content="${HT.omschrijving}">
<meta name="theme-color" content="#0B1E8A">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>${STIJL}</style>
</head>
<body>
<div class="wrap">
  <h1>${HT.kop}</h1>
  <p>${HT.lead}</p>

  <div class="kaart">
    <div class="velden">
      <label>${HT.veldNaam}
        <input id="naam" type="text" value="${STANDAARD.naam}" autocomplete="off" spellcheck="false">
      </label>
    </div>

    <div class="voorbeeld" id="voorbeeld">${voorbeeld}</div>

    <div class="knoppen">
      <button id="kopieer" type="button">${HT.kopieer}</button>
      <button id="kies" class="stil" type="button">${HT.selecteer}</button>
      <span class="melding" id="melding"></span>
    </div>
  </div>

  <h2>${HT.macKop}</h2>
  <ol>
${lijst(HT.mac)}
  </ol>

  <h2>${HT.iphoneKop}</h2>
  <p>${HT.iphoneLead}</p>
  <ol>
${lijst(HT.iphone)}
  </ol>
  <div class="let">${HT.schud}</div>
  <p>${HT.snel}</p>
  <p>${HT.twee}</p>

  <footer>${HT.voet} <a href="/">Terug naar de site</a></footer>
</div>
<script>
(function(){
var G = ${JSON.stringify(G)};
${String(handtekeningHtml)}
${String(handtekeningPlat)}
var veldNaam = document.getElementById('naam')
var voorbeeld = document.getElementById('voorbeeld')
var melding = document.getElementById('melding')

function teken(){ voorbeeld.innerHTML = handtekeningHtml(veldNaam.value, G) }
veldNaam.addEventListener('input', teken)

function zeg(t){ melding.textContent = t; setTimeout(function(){ melding.textContent = '' }, 5000) }

function kies(){
  var bereik = document.createRange()
  bereik.selectNodeContents(voorbeeld)
  var sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(bereik)
}

document.getElementById('kies').addEventListener('click', function(){
  kies()
  zeg(${JSON.stringify(HT.geselecteerd)})
})

document.getElementById('kopieer').addEventListener('click', function(){
  var html = handtekeningHtml(veldNaam.value, G)
  var plat = handtekeningPlat(veldNaam.value, G)
  var klaar = function(){ zeg(${JSON.stringify(HT.gelukt)}) }
  var terugval = function(){
    kies()
    try {
      if (document.execCommand('copy')) { zeg(${JSON.stringify(HT.geluktKaal)}); return }
    } catch (e) {}
    zeg(${JSON.stringify(HT.mislukt)})
  }
  try {
    new ClipboardItem({
      'text/html': new Blob([html], { type: 'text/html' }),
      'text/plain': new Blob([plat], { type: 'text/plain' }),
    })
  } catch (e) { terugval(); return }
  navigator.clipboard.write([
    new ClipboardItem({
      'text/html': new Blob([html], { type: 'text/html' }),
      'text/plain': new Blob([plat], { type: 'text/plain' }),
    }),
  ]).then(klaar, terugval)
})
})();
</script>
</body>
</html>
`
}

/*
 * De ai-poort over de tekst van deze pagina. Hij hangt HIER en niet in build.mjs, naast
 * de aanroep over TEKST: dan kan deze pagina niet stil buiten de poort vallen doordat
 * iemand hem later ergens anders vandaan bouwt.
 */
aipoort({ talen: { nl: HT } })
