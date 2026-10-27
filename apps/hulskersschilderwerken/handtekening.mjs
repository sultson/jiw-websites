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
 *    String(), zie onderaan), zodat er een rekensom bestaat voor de naam en de functie
 *    die Pascal zelf intypt en niet twee.
 *
 * 2. De gegevens komen uit BEDRIJF in inhoud.mjs en staan hier niet op schrift. Een
 *    handtekening is de plek waar een oud telefoonnummer het langst blijft staan: hij
 *    hangt onder elke mail en niemand leest hem nog. Verandert zijn nummer, dan is
 *    inhoud.mjs de enige plek waar je hoeft te zijn, en controleer.mjs legt de gebouwde
 *    pagina ernaast.
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
 * Het logo is /logo-mail.png: dezelfde plaat als in de bevestigingsmail, met een witte
 * achtergrond ingebakken (zie tools/gen-mail-logo.mjs). Een svg toont geen enkel
 * mailprogramma en een data:-beeld komt bij de ontvanger als bijlage mee of verdwijnt.
 * De maat wordt uit het bestand zelf gelezen, niet hier opgeschreven - anders staat de
 * verhouding scheef zodra het merkbestand verandert.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { aipoort } from './tools/poorten/aipoort.mjs'
import { BEDRIJF } from './inhoud.mjs'

const HIER = path.dirname(fileURLToPath(import.meta.url))

/* De weergavebreedte van het logo in de handtekening. De hoogte komt uit de plaat. */
const LOGO_BREED = 174

const STANDAARD = { naam: 'Pascal Hulskers', functie: 'Eigenaar' }

/*
 * De tekst van de pagina. Een eigen blok, zodat hij door dezelfde ai-poort gaat als de
 * copy van de site (onderaan dit bestand). Een hulppagina is geen klantcopy, maar hij
 * wordt wel gelezen door de klant.
 */
export const HT = {
  omschrijving: 'Hulppagina: hier kopieert Pascal zijn mailhandtekening met logo.',
  kop: 'Mailhandtekening',
  lead: 'Vul uw naam en functie in, kopieer de handtekening en zet hem in Mail. Het logo en de kleuren staan er al in.',
  veldNaam: 'Naam',
  veldFunctie: 'Functie',
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
  voet: `Het logo wordt opgehaald van ${BEDRIJF.domein}, dus het blijft staan bij degene die de mail ontvangt.`,
}

/* ------------------------------------------------------------------ de handtekening
 *
 * Deze functie draait twee keer: hier in de bouw (voor de html die in de pagina staat)
 * en in de browser (zodra Pascal zijn naam of functie wijzigt). Hij gaat met String()
 * mee de pagina in, dus hij mag NIETS gebruiken wat buiten zijn eigen argumenten staat.
 *
 * Een tabel met stijl per element en geen enkele klasse: een mailprogramma leest geen
 * stylesheet, en Mail knipt bij het plakken alles weg wat het niet begrijpt.
 */
export function handtekeningHtml(naam, functie, G) {
  const ont = (s) =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const n = ont(naam.trim() || G.naam)
  const f = ont(functie.trim())
  const onder = f ? `${f} &middot; ${ont(G.bedrijf)}` : ont(G.bedrijf)

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="padding:0 0 11px;">
      <img src="${G.logo}" width="${G.breed}" height="${G.hoog}" alt="${ont(G.bedrijf)}" style="display:block;border:0;width:${G.breed}px;height:${G.hoog}px;" />
    </td>
  </tr>
  <tr>
    <td style="border-top:2px solid ${G.blauw};padding:11px 0 0;">
      <div style="font:700 16px/1.3 Arial,Helvetica,sans-serif;color:${G.navy};">${n}</div>
      <div style="font:400 13px/1.5 Arial,Helvetica,sans-serif;color:${G.grijs};padding-top:2px;">${onder}</div>
      <div style="height:10px;line-height:10px;font-size:0;">&nbsp;</div>
      <div style="font:400 13px/1.7 Arial,Helvetica,sans-serif;color:${G.inkt};">
        <a href="tel:${G.telLink}" style="color:${G.inkt};text-decoration:none;">${G.telToon}</a><br />
        <a href="mailto:${G.mail}" style="color:${G.inkt};text-decoration:none;">${G.mail}</a><br />
        <a href="https://${G.domein}/" style="color:${G.blauw};text-decoration:none;font-weight:bold;">${G.domein}</a>
      </div>
      <div style="height:8px;line-height:8px;font-size:0;">&nbsp;</div>
      <div style="font:400 11px/1.5 Arial,Helvetica,sans-serif;color:${G.grijs};">${ont(G.plaats)} &middot; KvK ${G.kvk}</div>
    </td>
  </tr>
</table>`
}

/* De platte versie, voor een mailprogramma dat alleen tekst aanneemt. Draait alleen in
   de browser, naast de html op het klembord. */
export function handtekeningPlat(naam, functie, G) {
  const r = [naam.trim() || G.naam]
  r.push(functie.trim() ? `${functie.trim()} - ${G.bedrijf}` : G.bedrijf)
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
  const b = fs.readFileSync(bestand)
  if (b.length < 24 || b.readUInt32BE(12) !== 0x49484452) {
    throw new Error(`handtekening: ${bestand} is geen png met een IHDR op de verwachte plek`)
  }
  return { breed: b.readUInt32BE(16), hoog: b.readUInt32BE(20) }
}

export function handtekeningGegevens() {
  const echt = maatVanPng(path.join(HIER, 'public', 'logo-mail.png'))
  return {
    logo: `https://${BEDRIJF.domein}/logo-mail.png`,
    breed: LOGO_BREED,
    hoog: Math.round((LOGO_BREED * echt.hoog) / echt.breed),
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
.voorbeeld{padding:4px 0 2px}
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
  for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (!/^(?:https:\/\/|tel:|mailto:)/.test(m[1])) {
      throw new Error(`handtekening: ${m[1]} is geen volledig adres - bij de ontvanger wijst dat naar zijn eigen domein`)
    }
  }
}

export function paginaHandtekening() {
  const G = handtekeningGegevens()
  const lijst = (regels) => regels.map((r) => `        <li>${r}</li>`).join('\n')
  const voorbeeld = handtekeningHtml(STANDAARD.naam, STANDAARD.functie, G)
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
      <label>${HT.veldFunctie}
        <input id="functie" type="text" value="${STANDAARD.functie}" autocomplete="off" spellcheck="false">
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
var veldFunctie = document.getElementById('functie')
var voorbeeld = document.getElementById('voorbeeld')
var melding = document.getElementById('melding')

function teken(){ voorbeeld.innerHTML = handtekeningHtml(veldNaam.value, veldFunctie.value, G) }
veldNaam.addEventListener('input', teken)
veldFunctie.addEventListener('input', teken)

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
  var html = handtekeningHtml(veldNaam.value, veldFunctie.value, G)
  var plat = handtekeningPlat(veldNaam.value, veldFunctie.value, G)
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
