// De mailhandtekening van FRAME MEDIA: /handtekening/
//
// Armando, 10-11-2026: "https://hulskersschilderwerken.nl/handtekening/ we moeten
// hetzelfde doen voor zowel iphone als airmail voor frame media". Dit is dus de
// hulppagina van Hulskers (apps/hulskersschilderwerken/handtekening.mjs), met de
// lessen die daar met schade en schande zijn geleerd, plus Airmail.
//
// Een hulppagina en geen pagina van de site: niet in het menu, niet in de voet,
// niet in de sitemap, en noindex - ook in de productiebouw. bouw.mjs en
// tools/vooraf.mjs kennen hem als uitzondering (HULP_PADEN hieronder).
//
// Wat van Hulskers is meegekomen, en waarom:
//
//  - De handtekening wordt hier gebouwd en staat als gewone html in de pagina.
//    Dezelfde functie gaat met String() mee naar de browser voor de naam die
//    iemand zelf intypt, dus er is een rekensom en niet twee.
//  - De gegevens komen uit inhoud/zaak.mjs, dezelfde bron als de site.
//  - Het logo gaat als data:-beeld MEE in de handtekening. Het klembord draagt
//    alleen text/html en text/plain, geen plaatje; hangt het logo aan een adres,
//    dan moet Mail het zelf ophalen, en als dat mislukt bewaart Mail een leeg vak
//    (Hulskers, 01-11-2026).
//  - De plaat is LOGO_BREED x LOGO_SCHAAL pixels op 72 x LOGO_SCHAAL dpi. Mail op
//    de Mac gooit width/height uit de opmaak weg en vraagt de png hoe groot hij is,
//    en dat antwoord komt uit pixels gedeeld door dpi/72. Zonder pHYs-blok staat
//    het logo twee keer te groot naast de tekst.
//  - Mailadres en webadres dragen white-space:nowrap: op de iPhone hakte Mail
//    anders het langste woord doormidden (Hulskers, 28-10-2026).
//
// Wat hier anders is:
//
//  - Airmail. Dat is geen Apple-programma maar een losse app (Mac en iPhone), en
//    het handtekeningvak daar neemt naast plakken ook html-code aan. Daarom is er
//    een tweede knop die de CODE kopieert. In die code hangt het logo wel aan een
//    adres op www.framemedia.tv: een programma dat ruwe html verstuurt stuurt een
//    data:-beeld ongewijzigd mee, en Gmail toont data:-beelden bij de ontvanger
//    niet. Een adres toont Gmail wel. Dat is de omgekeerde keuze van de plakroute,
//    en met opzet: daar zet Mail een geplakt data:-beeld zelf om in een bijlage.
//  - Een functieveld. Bij Hulskers mailt een persoon; bij FRAME MEDIA mailen
//    Frans, Armando, de presentatrice. Leeg = geen regel.
//  - Het merk staat als insigne (logo.svg, de marine-en-rode ring met FRAME MEDIA
//    erdoor), niet als los woordmerk. Het woordmerk is 4,7 keer zo breed als hoog
//    en wordt naast vier regels tekst een streepje van 23 punten hoog.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ZAAK } from './inhoud/zaak.mjs';

const HIER = path.dirname(fileURLToPath(import.meta.url));

export const HULP_PADEN = ['/handtekening/'];

// De maten. Logo + kier + streep + kier + langste regel moeten in het berichtveld
// van Mail op een telefoon passen (~320-360). tools/handtekening-kijk.mjs meet het.
export const LOGO_BREED = 112;
export const LOGO_SCHAAL = 2;
export const LOGO_BESTAND = 'assets/mail/handtekening-logo.png';
const KIER = 12;
const MAAT = { naam: 15, functie: 12, tekst: 12, klein: 11 };

const STANDAARD = { naam: 'Frans', functie: '' };

const KLEUR = {
  marine: '#2e3e50',
  rood: '#bf2027',
  inkt: '#1F2937',
  grijs: '#6B7280',
};

const HT = {
  omschrijving: 'Hulppagina: hier kopieert u de mailhandtekening van FRAME MEDIA met logo.',
  kop: 'Mailhandtekening',
  lead: 'Vul uw naam in, kopieer de handtekening en zet hem in Mail of Airmail. Het logo en de kleuren staan er al in.',
  veldNaam: 'Naam',
  veldFunctie: 'Functie (mag leeg)',
  kopieer: 'Handtekening kopiëren',
  code: 'Html-code kopiëren (Airmail)',
  selecteer: 'Selecteer hem zelf',
  gelukt: 'Gekopieerd, met logo en kleuren.',
  geluktKaal: 'Gekopieerd.',
  geluktCode: 'De html-code staat op het klembord.',
  mislukt: 'Hij staat geselecteerd, kopieer hem nu zelf.',
  geselecteerd: 'Hij staat geselecteerd. Kopieer hem met Cmd+C of met het menu.',

  iphoneKop: 'In Mail op de iPhone',
  iphoneLead:
    'Op de telefoon laat Mail een afbeelding niet rechtstreeks in het handtekeningveld toe. De weg die het wel doet loopt via een mail die u uzelf stuurt.',
  iphone: [
    'Open deze pagina op de computer, druk op <strong>Handtekening kopiëren</strong>, plak hem in een nieuwe mail en stuur die mail naar uzelf.',
    'Open die mail op de iPhone in <strong>Mail</strong>. Houd uw vinger op de handtekening, kies <strong>Selecteer alles</strong> en daarna <strong>Kopieer</strong>.',
    'Ga naar <strong>Instellingen</strong> &rsaquo; <strong>Apps</strong> &rsaquo; <strong>Mail</strong> &rsaquo; <strong>Handtekening</strong>. Op oudere iOS-versies staat Mail niet onder Apps maar los in de lijst.',
    'Haal <em>Verstuurd vanaf mijn iPhone</em> weg, houd ingedrukt en kies <strong>Plak</strong>.',
  ],
  schud:
    'Is de opmaak na het plakken weg? Schud de telefoon. Er verschijnt een venster om de wijziging ongedaan te maken; tik daarop en de kleuren komen terug. Dat is een eigenaardigheid van iOS en zegt niets over de handtekening.',
  snel:
    'Sneller, al lukt het op de telefoon lang niet altijd: open deze pagina op de iPhone, druk op Handtekening kopiëren en plak meteen in dat veld. Komt het logo niet mee, neem dan de weg hierboven.',

  airKop: 'In Airmail',
  airLead:
    'Airmail bewaart een handtekening per account. Op de Mac en op de iPhone gaat het op dezelfde plek, alleen de weg ernaartoe verschilt.',
  air: [
    'Op de Mac: open Airmail en kies in de menubalk <strong>Airmail</strong> &rsaquo; <strong>Instellingen</strong> (op oudere versies <strong>Voorkeuren</strong>) &rsaquo; <strong>Accounts</strong>. Kies het account en open het tabblad <strong>Handtekening</strong>.',
    'Op de iPhone: open Airmail, tik linksboven op het menu, dan op het tandwiel, kies <strong>Accounts</strong>, het account, en daarna <strong>Handtekening</strong>.',
    'Maak een nieuwe handtekening aan, druk hierboven op <strong>Handtekening kopiëren</strong> en plak in het vak.',
    'Komt het logo niet mee, of staat er platte tekst: zet het vak op <strong>HTML</strong> (het knopje met &lt;/&gt; of de schakelaar HTML), druk hierboven op <strong>Html-code kopiëren</strong> en plak de code in dat vak.',
    'Kies de handtekening als standaard voor nieuwe mails en voor antwoorden.',
  ],
  airLet:
    'In de html-code wordt het logo opgehaald van www.framemedia.tv. Dat is de vorm die bij elke ontvanger werkt, ook in Gmail. Een ontvanger die externe afbeeldingen blokkeert ziet het logo pas na een klik op Afbeeldingen laden.',

  twee:
    'Elk programma en elk toestel bewaart zijn eigen handtekening. Mailt u op de Mac en op de iPhone, dan zet u hem op allebei, en na een wijziging ook allebei opnieuw.',
  voet:
    'Bij plakken zit het logo in de handtekening zelf en wordt het nergens opgehaald.',
};

// --------------------------------------------------------------- de handtekening
// Draait in de bouw en in de browser (via String()), dus alleen eigen argumenten.
// `logo` is het adres van het beeld: data: voor plakken, https: voor de code.
export function handtekeningHtml(naam, functie, G, logo) {
  const ont = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const n = ont(String(naam).trim() || G.naam);
  const f = String(functie || '').trim();
  const vast = 'white-space:nowrap;';
  const fRegel = f
    ? `\n      <div style="font:400 ${G.maatFunctie}px/1.4 Arial,Helvetica,sans-serif;color:${G.grijs};${vast}">${ont(f)}</div>`
    : '';
  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="vertical-align:middle;padding:0 ${G.kier}px 0 0;">
      <img src="${logo || G.logo}" width="${G.breed}" height="${G.hoog}" alt="${ont(G.bedrijf)}" style="display:block;border:0;width:${G.breed}px;height:${G.hoog}px;" />
    </td>
    <td style="vertical-align:middle;border-left:2px solid ${G.rood};padding:2px 0 2px ${G.kier}px;">
      <div style="font:700 ${G.maatNaam}px/1.3 Arial,Helvetica,sans-serif;color:${G.marine};${vast}">${n}</div>${fRegel}
      <div style="height:7px;line-height:7px;font-size:0;">&nbsp;</div>
      <div style="font:400 ${G.maatTekst}px/1.7 Arial,Helvetica,sans-serif;color:${G.inkt};">
        <a href="tel:${G.telLink}" style="color:${G.inkt};text-decoration:none;${vast}">${G.telToon}</a><br />
        <a href="mailto:${G.mail}" style="color:${G.inkt};text-decoration:none;${vast}">${G.mail}</a><br />
        <a href="https://${G.domein}/" style="color:${G.rood};text-decoration:none;font-weight:bold;${vast}">${G.domein}</a>
      </div>
      <div style="height:7px;line-height:7px;font-size:0;">&nbsp;</div>
      <div style="font:400 ${G.maatKlein}px/1.5 Arial,Helvetica,sans-serif;color:${G.grijs};${vast}">Studio ${ont(G.studio)} &middot; KvK ${G.kvk}</div>
    </td>
  </tr>
</table>`;
}

// Platte tekst, voor een programma dat alleen tekst aanneemt. Hier staat de
// bedrijfsnaam als regel: in de html draagt het logo hem, in platte tekst niet.
export function handtekeningPlat(naam, functie, G) {
  const r = [String(naam).trim() || G.naam];
  const f = String(functie || '').trim();
  r.push(f ? `${f} - ${G.bedrijf}` : G.bedrijf);
  r.push('', G.telToon, G.mail, G.domein, '', `Studio ${G.studio} - KvK ${G.kvk}`);
  return r.join('\n');
}

// ---------------------------------------------------------- de plaat zelf keuren
// Breedte en hoogte uit de IHDR, dpi uit pHYs. Zie de kop van dit bestand.
function maatVanPngBuffer(b, naam) {
  if (b.length < 24 || b.readUInt32BE(12) !== 0x49484452) {
    throw new Error(`handtekening: ${naam} is geen png met een IHDR op de verwachte plek`);
  }
  let dpi = null;
  for (let p = 8; p + 12 <= b.length;) {
    const len = b.readUInt32BE(p);
    if (b.toString('ascii', p + 4, p + 8) === 'pHYs' && len === 9) {
      if (b[p + 16] === 1) dpi = Math.round(b.readUInt32BE(p + 8) * 0.0254);
      break;
    }
    p += 12 + len;
  }
  return { breed: b.readUInt32BE(16), hoog: b.readUInt32BE(20), dpi };
}

function keurPlaat(m, wat) {
  const moet = LOGO_BREED * LOGO_SCHAAL;
  if (m.breed !== moet) {
    throw new Error(`handtekening: ${wat} is ${m.breed} px breed en moet ${moet} zijn. Draai \`node tools/gen-mail-logo.mjs\`.`);
  }
  if (LOGO_SCHAAL !== 1 && m.dpi !== 72 * LOGO_SCHAAL) {
    throw new Error(
      `handtekening: ${wat} draagt ${m.dpi ?? 'geen'} dpi en moet ${72 * LOGO_SCHAAL} dragen - anders staat het logo in Mail ` +
      `${LOGO_SCHAAL} keer te groot. Draai \`node tools/gen-mail-logo.mjs\`.`);
  }
}

export function handtekeningGegevens() {
  const bestand = path.join(HIER, 'inhoud', LOGO_BESTAND);
  if (!fs.existsSync(bestand)) throw new Error(`handtekening: ${LOGO_BESTAND} ontbreekt - draai \`node tools/gen-mail-logo.mjs\``);
  const buf = fs.readFileSync(bestand);
  const m = maatVanPngBuffer(buf, LOGO_BESTAND);
  keurPlaat(m, LOGO_BESTAND);
  return {
    logo: `data:image/png;base64,${buf.toString('base64')}`,
    // Het adres voor de code-route. Altijd het echte domein, ook in de
    // conceptbouw: deze code belandt onder echte mails.
    logoAdres: `https://${ZAAK.domein}/${LOGO_BESTAND}`,
    breed: LOGO_BREED,
    hoog: Math.round((LOGO_BREED * m.hoog) / m.breed),
    kier: KIER,
    maatNaam: MAAT.naam,
    maatFunctie: MAAT.functie,
    maatTekst: MAAT.tekst,
    maatKlein: MAAT.klein,
    bedrijf: ZAAK.naam,
    naam: STANDAARD.naam,
    telToon: ZAAK.mobielTekst,
    telLink: ZAAK.mobiel,
    mail: ZAAK.mail,
    domein: ZAAK.domein,
    studio: ZAAK.studio,
    kvk: ZAAK.kvk,
    ...KLEUR,
  };
}

// De poort op de handtekening. Wat hier misgaat is op deze pagina onzichtbaar.
function keurHandtekening(html, G, { code }) {
  const moet = [
    ['telefoonnummer', G.telToon], ['telefoonlink', `tel:${G.telLink}`], ['mailadres', G.mail],
    ['domein', G.domein], ['studio', G.studio], ['kvk-nummer', G.kvk],
  ];
  for (const [wat, waarde] of moet) {
    if (!html.includes(waarde)) throw new Error(`handtekening: het ${wat} (${waarde}) staat niet in de handtekening`);
  }
  if (/\sclass=|<style/.test(html)) throw new Error('handtekening: class of <style> - een mailprogramma leest geen stylesheet');
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    if (!/^(?:https:\/\/|tel:|mailto:)/.test(m[1])) throw new Error(`handtekening: ${m[1]} is geen volledig adres`);
  }
  const src = [...html.matchAll(/src="([^"]+)"/g)].map(m => m[1]);
  if (src.length !== 1) throw new Error(`handtekening: ${src.length} beelden, een verwacht`);
  if (code) {
    if (src[0] !== G.logoAdres) throw new Error(`handtekening: de code hangt het logo aan ${src[0].slice(0, 60)}, niet aan ${G.logoAdres}`);
  } else {
    const d = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(src[0]);
    if (!d) throw new Error('handtekening: het geplakte logo moet een data:image/png zijn - een adres wordt in Mail een leeg vak');
    keurPlaat(maatVanPngBuffer(Buffer.from(d[1], 'base64'), 'het ingesloten beeld'), 'het ingesloten beeld');
  }
  const rijen = (html.match(/<tr\b/g) || []).length;
  const vakken = (html.match(/<td\b/g) || []).length;
  if (rijen !== 1 || vakken !== 2) throw new Error(`handtekening: logo en tekst moeten naast elkaar staan, gevonden ${rijen} rij(en), ${vakken} vak(ken)`);
  for (const naald of [`mailto:${G.mail}`, `https://${G.domein}/`]) {
    const a = html.match(new RegExp(`<a href="${naald.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`));
    if (!a || !a[0].includes('white-space:nowrap')) throw new Error(`handtekening: ${naald} kan midden in het woord afbreken`);
  }
}

// --------------------------------------------------------------------- de pagina
const STIJL = `
:root{--marine:#2e3e50;--rood:#bf2027;--inkt:#1F2937;--grijs:#6B7280;--lijn:#E3E6EC;--mist:#F3F4F6}
*{box-sizing:border-box}
body{margin:0;background:var(--mist);color:var(--inkt);
  font:400 16px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  padding:32px 20px 72px}
.wrap{max-width:720px;margin:0 auto}
h1{color:var(--marine);font-size:clamp(26px,5vw,34px);line-height:1.15;margin:0 0 10px;letter-spacing:-.01em}
h2{color:var(--marine);font-size:19px;margin:34px 0 12px}
p{margin:0 0 14px}
.kaart{background:#fff;border:1px solid var(--lijn);border-radius:8px;padding:24px}
.velden{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:22px}
label{flex:1 1 200px;font-size:13px;font-weight:600;color:var(--marine)}
input{display:block;width:100%;margin-top:6px;padding:11px 12px;font:400 16px/1.4 inherit;
  color:var(--inkt);background:#fff;border:1px solid #C9CFDB;border-radius:6px}
input:focus{outline:2px solid var(--rood);outline-offset:1px}
.voorbeeld{padding:4px 0 2px;overflow-x:auto}
.knoppen{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:22px}
button{font:600 15px/1.2 inherit;padding:12px 20px;border-radius:6px;border:1px solid var(--marine);
  background:var(--marine);color:#fff;cursor:pointer}
button.stil{background:#fff;color:var(--marine);border-color:#C9CFDB}
.melding{font-size:14px;color:var(--marine);font-weight:600}
ol{padding-left:22px;margin:0 0 14px}
li{margin-bottom:9px}
.let{border-left:3px solid var(--rood);padding:2px 0 2px 14px;margin:18px 0;font-size:15px}
footer{margin-top:40px;font-size:13px;color:var(--grijs)}
footer a{color:var(--marine)}
@media (max-width:420px){body{padding:24px 14px 56px}.kaart{padding:18px 12px}}
`;

export function paginaHandtekening() {
  const G = handtekeningGegevens();
  const lijst = regels => regels.map(r => `    <li>${r}</li>`).join('\n');
  const voorbeeld = handtekeningHtml(STANDAARD.naam, STANDAARD.functie, G);
  keurHandtekening(voorbeeld, G, { code: false });
  keurHandtekening(handtekeningHtml(STANDAARD.naam, 'Eigenaar', G, G.logoAdres), G, { code: true });

  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<title>${HT.kop} - ${ZAAK.naam}</title>
<meta name="description" content="${HT.omschrijving}">
<meta name="theme-color" content="#2e3e50">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
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
      <label>${HT.veldFunctie}
        <input id="functie" type="text" value="${STANDAARD.functie}" autocomplete="off" spellcheck="false">
      </label>
    </div>

    <div class="voorbeeld" id="voorbeeld">${voorbeeld}</div>

    <div class="knoppen">
      <button id="kopieer" type="button">${HT.kopieer}</button>
      <button id="code" class="stil" type="button">${HT.code}</button>
      <button id="kies" class="stil" type="button">${HT.selecteer}</button>
      <span class="melding" id="melding" role="status"></span>
    </div>
  </div>

  <h2>${HT.iphoneKop}</h2>
  <p>${HT.iphoneLead}</p>
  <ol>
${lijst(HT.iphone)}
  </ol>
  <div class="let">${HT.schud}</div>
  <p>${HT.snel}</p>

  <h2>${HT.airKop}</h2>
  <p>${HT.airLead}</p>
  <ol>
${lijst(HT.air)}
  </ol>
  <div class="let">${HT.airLet}</div>
  <p>${HT.twee}</p>

  <footer>${HT.voet} <a href="/">Terug naar de site</a></footer>
</div>
<script>
(function(){
var G = ${JSON.stringify(G)};
${String(handtekeningHtml)}
${String(handtekeningPlat)}
var veldNaam = document.getElementById('naam')
var veldFunctie = document.getElementById('functie')
var voorbeeld = document.getElementById('voorbeeld')
var melding = document.getElementById('melding')

function teken(){ voorbeeld.innerHTML = handtekeningHtml(veldNaam.value, veldFunctie.value, G) }
veldNaam.addEventListener('input', teken)
veldFunctie.addEventListener('input', teken)

var klok
function zeg(t){ melding.textContent = t; clearTimeout(klok); klok = setTimeout(function(){ melding.textContent = '' }, 5000) }

function kies(){
  var bereik = document.createRange()
  bereik.selectNodeContents(voorbeeld)
  var sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(bereik)
}

document.getElementById('kies').addEventListener('click', function(){ kies(); zeg(${JSON.stringify(HT.geselecteerd)}) })

document.getElementById('kopieer').addEventListener('click', function(){
  var html = handtekeningHtml(veldNaam.value, veldFunctie.value, G)
  var plat = handtekeningPlat(veldNaam.value, veldFunctie.value, G)
  var terugval = function(){
    kies()
    try { if (document.execCommand('copy')) { zeg(${JSON.stringify(HT.geluktKaal)}); return } } catch (e) {}
    zeg(${JSON.stringify(HT.mislukt)})
  }
  var item
  try {
    item = new ClipboardItem({
      'text/html': new Blob([html], { type: 'text/html' }),
      'text/plain': new Blob([plat], { type: 'text/plain' }),
    })
  } catch (e) { terugval(); return }
  navigator.clipboard.write([item]).then(function(){ zeg(${JSON.stringify(HT.gelukt)}) }, terugval)
})

// De code als platte tekst: die plakt Airmail in zijn html-vak. Hier hangt het
// logo aan het adres op www.framemedia.tv, zie de kop van handtekening.mjs.
document.getElementById('code').addEventListener('click', function(){
  var code = handtekeningHtml(veldNaam.value, veldFunctie.value, G, G.logoAdres)
  var oud = function(){
    var t = document.createElement('textarea')
    t.value = code; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0'
    document.body.appendChild(t); t.select()
    var ok = false
    try { ok = document.execCommand('copy') } catch (e) {}
    document.body.removeChild(t)
    zeg(ok ? ${JSON.stringify(HT.geluktCode)} : ${JSON.stringify(HT.mislukt)})
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(function(){ zeg(${JSON.stringify(HT.geluktCode)}) }, oud)
  } else oud()
})
})();
</script>
</body>
</html>
`;
}
