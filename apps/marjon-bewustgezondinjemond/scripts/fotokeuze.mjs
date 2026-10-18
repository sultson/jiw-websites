/**
 * De fotokeuzepagina: /fotokeuze
 *
 * Marjon kiest hier zelf welke foto uit de sessie in de hero staat, en ziet
 * meteen hoe die eruitziet op een computer en op een telefoon. Dat scheelt een
 * ronde waarin Armando een foto doorgeeft, wij hem erin zetten en zij pas op de
 * echte site ziet of het werkt.
 *
 * WAAROM HIER EN NIET IN HET OUDE CONCEPT
 * Het concept in jiw-concepts/marjon is met pensioen (zie de VERHUISD.md daar).
 * Zou je die Worker opnieuw uitrollen, dan staat er een tweede, verouderde kopie
 * van dezelfde site online en pakt hij marjon.jouwidealewebsite.nl terug - dat
 * adres staat bij Google en stuurt nu met een 301 door naar het echte domein.
 * Deze pagina hangt daarom aan de echte site, net als /logo: eigen adres, op
 * noindex (public/_headers), nergens naartoe gelinkt.
 *
 * WAT DE PAGINA LAAT ZIEN
 * Twee voorbeelden naast elkaar, met de echte kop, knoppen en kleuren van de
 * hero: de kolomopstelling van een computer (4:5 naast de tekst) en het volle
 * scherm van een telefoon (9:16 met de tekst eroverheen). Het zijn twee aparte
 * keuzes, want dat zijn het op de site ook - sinds 17-10 staat er op allebei een
 * andere opname.
 *
 * DE UITSNEDES
 * Van de twee foto's die nu op de site staan komt de uitsnede uit scripts/hero.mjs,
 * met de hand opgemeten. Die zijn hier dus precies wat zij op de site ziet. Voor
 * de andere achttien kiest sharp zelf het interessantste deel van het beeld
 * (strategy.attention). Dat is goed genoeg om te beoordelen of een foto werkt,
 * maar het is niet het werk van een mens: kiest ze er een, dan meten wij de
 * uitsnede alsnog met de hand op. Dat staat ook zo op de pagina.
 *
 * Draait na `vite build`, dus na het kopieren van public/ naar dist/.
 *
 *   node scripts/fotokeuze.mjs
 */
import assert from 'node:assert/strict';
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BRON = path.join(APP, 'raw', 'fotograaf');
const UIT = path.join(APP, 'dist', 'fotokeuze');
const UIT_IMG = path.join(UIT, 'img');

/* Wat er op elke foto staat. Met de hand beschreven na ze alle twintig bekeken
   te hebben; de nummering is de volgorde in de Drive-map van de fotograaf en
   zegt verder niets. Deze regels staan onder de foto's op de pagina, zodat zij
   op haar telefoon niet hoeft te raden welke nummer 13 ook alweer was. */
const FOTOS = [
  {nr: 1, tekst: 'Close-up tegen de beukenstam, lacht breeduit recht in de camera.'},
  {nr: 2, tekst: 'Zittend tegen een boom met een boek, kijkt opzij.'},
  {nr: 3, tekst: 'Portret tegen de stam, lacht, kijkt net langs de camera.'},
  {nr: 4, tekst: 'Liggend in de bladeren, van boven gefotografeerd.', let: 'Staat ondersteboven in het bestand; hier rechtgezet.'},
  {nr: 5, tekst: 'Liggend op een omgevallen stam bij het water.', let: 'Liggende foto: als hero moet er veel af.'},
  {nr: 6, tekst: 'Staand tegen een boom, kijkt omhoog, hele figuur.'},
  {nr: 7, tekst: 'Klein in beeld tussen de stammen, veel bos eromheen.', let: 'Liggende foto: als hero moet er veel af.'},
  {nr: 8, tekst: 'Staand tegen de stam, kijkt omhoog, halve figuur.'},
  {nr: 9, tekst: 'Zittend op een mosheuvel tussen de krokussen, lacht.'},
  {nr: 10, tekst: 'Zittend op het hek bij het water, hele figuur.'},
  {nr: 11, tekst: 'Close-up met haar hand op haar hart, recht in de camera.'},
  {nr: 12, tekst: 'Loopt het bospad op je af, hele figuur, veel lucht erboven.'},
  {nr: 13, tekst: 'Staand met een tak in haar handen, lacht in de camera.'},
  {nr: 14, tekst: 'Hand op een dikke tak, lacht, halve figuur.'},
  {nr: 15, tekst: 'Detail: haar handen boven de bladeren.', let: 'Liggende foto zonder gezicht: niet geschikt als hero.'},
  {nr: 16, tekst: 'In kleermakerszit aan de oever, kijkt lachend omhoog.'},
  {nr: 17, tekst: 'Gehurkt bij het water, lacht uitbundig in de camera.'},
  {nr: 18, tekst: 'Zittend bij het water, lacht opzij.'},
  {nr: 19, tekst: 'Zittend tegen een boom in het bos, hele figuur.'},
  {nr: 20, tekst: 'Staand bij het witte huis, hand op de vensterbank.'},
];

/* Foto 4 staat 180 graden gedraaid in het bestand van de fotograaf (geen
   exif-orientatie, de pixels zelf staan zo). Op de keuzepagina zetten we hem
   rechtop, anders beoordeelt zij een foto die op zijn kop hangt. */
const GEDRAAID = new Set([4]);

/* De twee uitsnedes die NU op de site staan, letterlijk overgenomen uit
   scripts/hero.mjs. Daar zijn ze met de hand opgemeten tegen deze bronbestanden.
   Staan ze hier ook, dan is het voorbeeld van de huidige stand precies wat zij
   op de site ziet - en niet een tweede, automatische uitsnede van dezelfde foto
   die er net naast zit. Verandert hero.mjs, dan hoort dit mee te veranderen. */
const HAND = {
  computer: {1: {left: 0, top: 206, width: 2400, height: 3000}},
  telefoon: {12: {left: 450, top: 600, width: 1688, height: 3000}},
};

/* Wat er nu op de site staat. Staat als markering op de twee foto's en achter
   de knop "Zet terug zoals het nu staat". */
const HUIDIG = {computer: 1, telefoon: 12};

const VAKKEN = {
  computer: {breedte: 720, hoogte: 900, kwaliteit: 80},
  telefoon: {breedte: 540, hoogte: 960, kwaliteit: 78},
};

/* Licht onscherptemasker na het verkleinen, dezelfde instelling als hero.mjs,
   zodat wat zij hier ziet net zo scherp oogt als op de site. */
const VERSCHERP = {sigma: 0.6, m1: 0.5, m2: 1.0};

mkdirSync(UIT_IMG, {recursive: true});

let bytes = 0;
function schrijf(naam, buf) {
  writeFileSync(path.join(UIT_IMG, naam), buf);
  bytes += buf.length;
}

for (const {nr} of FOTOS) {
  const bestand = path.join(BRON, `marjon-${nr}.jpg`);
  assert.ok(existsSync(bestand), `raw/fotograaf/marjon-${nr}.jpg ontbreekt`);

  const basis = () => {
    const s = sharp(bestand);
    return GEDRAAID.has(nr) ? s.rotate(180) : s;
  };

  /* De hele foto, niets eraf. Dit is wat ze in het raster ziet en wat de
     vergrootknop opent: kiezen doe je op de foto, niet op onze uitsnede. */
  schrijf(
    `klein-${nr}.webp`,
    await basis().resize(440, 440, {fit: 'inside'}).sharpen(VERSCHERP).webp({quality: 72, effort: 6}).toBuffer()
  );
  schrijf(
    `groot-${nr}.webp`,
    await basis().resize(1100, 1100, {fit: 'inside'}).sharpen(VERSCHERP).webp({quality: 80, effort: 6}).toBuffer()
  );

  for (const [vak, maat] of Object.entries(VAKKEN)) {
    const snede = HAND[vak][nr];
    const beeld = snede
      ? basis()
          .extract(snede)
          .resize(maat.breedte, maat.hoogte, {fit: 'cover', kernel: 'lanczos3'})
      : basis().resize(maat.breedte, maat.hoogte, {
          fit: 'cover',
          position: sharp.strategy.attention,
          kernel: 'lanczos3',
        });
    schrijf(
      `${vak}-${nr}.webp`,
      await beeld.sharpen(VERSCHERP).webp({quality: maat.kwaliteit, effort: 6}).toBuffer()
    );
  }
}

/* ------------------------------------------------------------------ */
/*  De pagina                                                          */
/* ------------------------------------------------------------------ */

const kaartjes = FOTOS.map(
  ({nr, tekst, let: waarschuwing}) => `
      <li class="kaart" data-nr="${nr}">
        <button type="button" class="kies" data-nr="${nr}">
          <img src="/fotokeuze/img/klein-${nr}.webp" alt="Foto ${nr}: ${tekst}" loading="lazy" decoding="async" width="440" height="440">
          <span class="nummer">${nr}</span>
          <span class="vlag"></span>
        </button>
        <button type="button" class="loep" data-nr="${nr}" aria-label="Foto ${nr} groter bekijken">Groter bekijken</button>
        <p class="bijschrift">${tekst}${waarschuwing ? ` <em>${waarschuwing}</em>` : ''}</p>
      </li>`
).join('');

const html = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Welke foto past het best? - Bewust Gezond in je Mond</title>
<link rel="icon" href="/favicon.svg">
<link rel="preload" href="/fonts/quicksand-latin.woff2" as="font" type="font/woff2" crossorigin>
<style>
@font-face{font-family:'Quicksand';font-style:normal;font-weight:400 700;font-display:swap;src:url('/fonts/quicksand-latin.woff2') format('woff2')}
@font-face{font-family:'Cormorant Garamond';font-style:normal;font-weight:300 600;font-display:swap;src:url('/fonts/cormorant-garamond-latin.woff2') format('woff2')}
:root{
  --zand:#dce2df; --zand-diep:#c9d3ce; --room:#f6f4ef; --olijf:#7c8460;
  --petrol:#497b89; --petrol-diep:#33606d; --inkt:#2b4249;
}
*{box-sizing:border-box}
/* Zonder height:auto wint het height-attribuut van de img (Chrome zet dat als
   stijl) en doet aspect-ratio hieronder niets: dan staat de herofoto als een
   smalle strook in het voorbeeld. Tailwind doet dit op de site zelf in zijn
   preflight; deze pagina heeft geen Tailwind, dus het moet hier staan. */
img{max-width:100%;height:auto}
body{margin:0;font-family:'Quicksand',system-ui,sans-serif;color:var(--inkt);background:var(--room);line-height:1.6}
.wrap{max-width:1080px;margin:0 auto;padding:0 20px}
header{background:var(--zand);padding:40px 0 32px}
h1{font-family:'Quicksand',sans-serif;font-weight:700;font-size:clamp(1.5rem,4.5vw,2.1rem);margin:0 0 10px}
h2{font-weight:700;font-size:1.15rem;margin:0 0 6px}
.lead{margin:0;max-width:56ch;color:rgba(43,66,73,.8)}
section{padding:34px 0}
.uitleg{color:rgba(43,66,73,.72);max-width:62ch;margin:0 0 20px}

/* ---- de twee voorbeelden ---- */
.voorbeelden{display:grid;gap:26px}
@media(min-width:900px){.voorbeelden{grid-template-columns:1.35fr 1fr;align-items:start}}
.paneel{background:#fff;border:1px solid var(--zand-diep);border-radius:18px;overflow:hidden}
.paneel > figcaption{display:flex;justify-content:space-between;align-items:baseline;gap:10px;padding:12px 16px;border-bottom:1px solid var(--zand-diep);font-weight:700}
.paneel figcaption small{font-weight:400;color:rgba(43,66,73,.6)}

/* computer: de kolomopstelling van de hero. Met een maximum erop, anders wordt
   dit voorbeeld twee keer zo hoog als het telefoonvoorbeeld ernaast en lijkt de
   foto op een computer veel groter dan hij in het echt is. */
.pc{background:var(--zand);padding:22px 20px;display:grid;grid-template-columns:.95fr 1.05fr;gap:18px;align-items:center;max-width:620px;margin:0 auto}
.pc .tekst h3{font-family:'Quicksand',sans-serif;font-weight:700;font-size:clamp(.85rem,2vw,1.15rem);line-height:1.18;margin:0}
.pc .tekst h3 span{white-space:nowrap}
.pc .kicker{font-size:.72rem;font-weight:700;color:var(--petrol);margin:12px 0 0}
.pc .knoppen{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.pc img{width:100%;max-width:300px;justify-self:end;aspect-ratio:4/5;object-fit:cover;border-radius:14px;display:block;box-shadow:0 10px 24px rgba(43,66,73,.12)}
.knop{font-family:inherit;font-size:.72rem;font-weight:700;border-radius:999px;padding:7px 14px;border:1px solid var(--petrol);color:var(--petrol);background:transparent}
.knop.vol{background:var(--petrol);color:#fff}

/* telefoon: foto over het volle scherm met de tekst eroverheen */
.tel{background:var(--zand);padding:22px;display:flex;justify-content:center}
.tel .scherm{position:relative;width:260px;aspect-ratio:9/16;border-radius:22px;overflow:hidden;box-shadow:0 12px 30px rgba(43,66,73,.2)}
.tel .scherm img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.tel .laag{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(43,66,73,.25),rgba(43,66,73,.55) 55%,rgba(43,66,73,.85))}
.tel .over{position:absolute;inset:auto 0 0 0;padding:16px 14px 20px;text-align:center;color:var(--room)}
.tel .over h3{font-family:'Quicksand',sans-serif;font-weight:700;font-size:.95rem;line-height:1.18;margin:0;text-shadow:0 1px 8px rgba(43,66,73,.55)}
.tel .over h3 span{white-space:nowrap}
.tel .over .kicker{font-size:.7rem;font-weight:700;margin:8px 0 0;text-shadow:0 1px 6px rgba(43,66,73,.55)}
.tel .over .knoppen{justify-content:center}
.tel .knop{border-color:var(--room);color:var(--room)}
.tel .knop.vol{background:var(--petrol);border-color:var(--petrol);color:#fff}

/* ---- kiezen ---- */
.schakel{display:inline-flex;background:var(--zand);border-radius:999px;padding:4px;gap:4px;margin:0 0 6px}
.schakel button{font-family:inherit;font-size:.92rem;font-weight:700;border:0;border-radius:999px;padding:9px 18px;background:transparent;color:var(--inkt);cursor:pointer}
.schakel button[aria-pressed="true"]{background:var(--petrol);color:#fff}
.rooster{list-style:none;margin:18px 0 0;padding:0;display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}
.kaart{margin:0}
.kies{display:block;position:relative;width:100%;padding:0;border:2px solid transparent;border-radius:14px;overflow:hidden;background:var(--zand);cursor:pointer;line-height:0}
.kies img{width:100%;height:190px;object-fit:contain;background:var(--zand)}
.kies .nummer{position:absolute;top:6px;left:6px;background:rgba(43,66,73,.82);color:#fff;font-size:.74rem;font-weight:700;line-height:1;padding:4px 7px;border-radius:7px}
.kies .vlag{position:absolute;left:6px;bottom:6px;display:none;background:var(--petrol);color:#fff;font-size:.68rem;font-weight:700;line-height:1;padding:5px 8px;border-radius:7px}
.kaart[data-gekozen] .kies{border-color:var(--petrol)}
.kaart[data-gekozen] .vlag{display:inline-block}
.loep{display:block;width:100%;margin-top:6px;font-family:inherit;font-size:.78rem;color:var(--petrol);background:none;border:0;padding:4px;cursor:pointer;text-decoration:underline}
.bijschrift{margin:2px 0 0;font-size:.82rem;color:rgba(43,66,73,.72)}
.bijschrift em{display:block;font-style:normal;color:var(--olijf)}

/* ---- doorgeven ---- */
.doorgeven{background:#fff;border:1px solid var(--zand-diep);border-radius:18px;padding:22px}
.samenvatting{font-weight:700;margin:0 0 14px}
textarea{width:100%;font-family:inherit;font-size:.95rem;border:1px solid var(--zand-diep);border-radius:12px;padding:10px 12px;min-height:84px;resize:vertical;background:var(--room);color:inherit}
.acties{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px;align-items:center}
.doe{font-family:inherit;font-size:.95rem;font-weight:700;border:0;border-radius:999px;padding:12px 22px;background:var(--petrol);color:#fff;cursor:pointer;text-decoration:none;display:inline-block}
.doe.rand{background:transparent;color:var(--petrol);border:1px solid var(--petrol)}
.melding{font-size:.88rem;color:var(--olijf);font-weight:700}
footer{background:var(--zand);padding:26px 0;margin-top:20px;font-size:.86rem;color:rgba(43,66,73,.75)}

/* ---- vergroten ---- */
dialog{border:0;padding:0;background:transparent;max-width:min(94vw,900px)}
dialog::backdrop{background:rgba(43,66,73,.88)}
dialog img{width:100%;height:auto;border-radius:14px;display:block}
dialog .sluit{position:absolute;top:10px;right:10px;font-family:inherit;font-weight:700;border:0;border-radius:999px;padding:8px 16px;background:var(--room);color:var(--inkt);cursor:pointer}
dialog .vanuit{display:flex;gap:10px;justify-content:center;margin-top:12px;flex-wrap:wrap}
</style>
</head>
<body>

<header>
  <div class="wrap">
    <h1>Welke foto past het best?</h1>
    <p class="lead">Alle twintig foto's van de fotosessie staan hier. Kies er een voor een groot scherm en een voor de
      telefoon, en je ziet meteen hoe de voorpagina er dan uitziet. Je verandert hier niets aan de website - dit is een
      kladblok. Onderaan geef je je keuze door.</p>
  </div>
</header>

<section>
  <div class="wrap">
    <div class="voorbeelden">

      <figure class="paneel" style="margin:0">
        <figcaption>Op een computer <small>foto <b data-toon="computer">${HUIDIG.computer}</b></small></figcaption>
        <div class="pc">
          <div class="tekst">
            <h3>Jouw reis naar <span>Bewust Gezond in je Mond</span></h3>
            <p class="kicker">Inspireer mij met Blogs &amp; Tips</p>
            <div class="knoppen">
              <span class="knop vol">Start hier</span>
              <span class="knop">Neem rechtstreeks contact op</span>
            </div>
          </div>
          <img id="pc-foto" src="/fotokeuze/img/computer-${HUIDIG.computer}.webp" alt="Voorbeeld van de voorpagina op een computer" width="720" height="900">
        </div>
      </figure>

      <figure class="paneel" style="margin:0">
        <figcaption>Op een telefoon <small>foto <b data-toon="telefoon">${HUIDIG.telefoon}</b></small></figcaption>
        <div class="tel">
          <div class="scherm">
            <img id="tel-foto" src="/fotokeuze/img/telefoon-${HUIDIG.telefoon}.webp" alt="Voorbeeld van de voorpagina op een telefoon" width="540" height="960">
            <div class="laag"></div>
            <div class="over">
              <h3>Jouw reis naar <span>Bewust Gezond in je Mond</span></h3>
              <p class="kicker">Inspireer mij met Blogs &amp; Tips</p>
              <div class="knoppen">
                <span class="knop vol">Start hier</span>
                <span class="knop">Contact</span>
              </div>
            </div>
          </div>
        </div>
      </figure>

    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <h2>Kies een foto</h2>
    <p class="uitleg">Zet eerst hieronder waar je voor kiest, en tik dan op een foto. De foto's staan hier heel, zoals de
      fotograaf ze aanleverde; in de voorbeelden hierboven zie je het stuk dat op de site past.</p>
    <div class="schakel" role="group" aria-label="Waar kies je voor">
      <button type="button" data-vak="computer" aria-pressed="true">Voor een computer</button>
      <button type="button" data-vak="telefoon" aria-pressed="false">Voor de telefoon</button>
    </div>
    <ul class="rooster">${kaartjes}
    </ul>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="doorgeven">
      <h2>Je keuze doorgeven</h2>
      <p class="samenvatting" id="samenvatting"></p>
      <label for="briefje">Wil je er nog iets bij zeggen? Bijvoorbeeld een foto die ergens anders op de site moet.</label>
      <textarea id="briefje" placeholder="Bijvoorbeeld: foto 11 zou mooi staan bij Wie ben ik."></textarea>
      <div class="acties">
        <button type="button" class="doe" id="kopieer">Kopieer mijn keuze</button>
        <a class="doe rand" id="mail" href="#">Stuur het per mail</a>
        <button type="button" class="doe rand" id="terug">Zet terug zoals het nu staat</button>
        <span class="melding" id="melding"></span>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="wrap">
    <p>Deze pagina staat niet in Google en er staat nergens op de site een link naartoe: alleen wie het adres heeft komt
      hier. Je keuze blijft op je eigen telefoon of computer staan, hij wordt nergens opgeslagen - pas als je hem
      doorstuurt weten wij ervan.</p>
    <p>De uitsnedes van de achttien foto's die nu niet op de site staan zijn door de computer gekozen. Kies je er een,
      dan meten wij de uitsnede met de hand op, zodat je gezicht precies goed staat. De foto's zijn van de fotograaf van
      de sessie; op je eigen site is dat geregeld, ergens anders even navragen.</p>
  </div>
</footer>

<dialog id="vergroot">
  <div style="position:relative">
    <img id="vergroot-foto" src="" alt="">
    <button type="button" class="sluit" id="vergroot-sluit">Sluiten</button>
  </div>
  <div class="vanuit">
    <button type="button" class="doe" data-vanuit="computer">Kies voor een computer</button>
    <button type="button" class="doe" data-vanuit="telefoon">Kies voor de telefoon</button>
  </div>
</dialog>

<script>
(function () {
  var HUIDIG = {computer: ${HUIDIG.computer}, telefoon: ${HUIDIG.telefoon}};
  var SLEUTEL = 'marjon-fotokeuze';
  var keuze = {computer: HUIDIG.computer, telefoon: HUIDIG.telefoon};
  var vak = 'computer';

  var bewaard = null;
  try {
    bewaard = JSON.parse(localStorage.getItem(SLEUTEL) || 'null');
    if (bewaard && bewaard.computer && bewaard.telefoon) keuze = {computer: bewaard.computer, telefoon: bewaard.telefoon};
  } catch (e) {}

  var pcFoto = document.getElementById('pc-foto');
  var telFoto = document.getElementById('tel-foto');
  var samenvatting = document.getElementById('samenvatting');
  var briefje = document.getElementById('briefje');
  var melding = document.getElementById('melding');
  var mail = document.getElementById('mail');

  function tekst() {
    var regels = [
      'Mijn keuze voor de foto op de website:',
      '- op een computer: foto ' + keuze.computer,
      '- op de telefoon: foto ' + keuze.telefoon,
    ];
    var erbij = (briefje.value || '').trim();
    if (erbij) regels.push('', erbij);
    return regels.join('\\n');
  }

  function teken() {
    pcFoto.src = '/fotokeuze/img/computer-' + keuze.computer + '.webp';
    telFoto.src = '/fotokeuze/img/telefoon-' + keuze.telefoon + '.webp';

    var tonen = document.querySelectorAll('[data-toon]');
    for (var i = 0; i < tonen.length; i++) tonen[i].textContent = keuze[tonen[i].getAttribute('data-toon')];

    var kaarten = document.querySelectorAll('.kaart');
    for (var j = 0; j < kaarten.length; j++) {
      var nr = Number(kaarten[j].getAttribute('data-nr'));
      var vlaggen = [];
      if (keuze.computer === nr) vlaggen.push('computer');
      if (keuze.telefoon === nr) vlaggen.push('telefoon');
      if (vlaggen.length) {
        kaarten[j].setAttribute('data-gekozen', '');
        kaarten[j].querySelector('.vlag').textContent = vlaggen.join(' + ');
      } else {
        kaarten[j].removeAttribute('data-gekozen');
      }
    }

    var zelfde = keuze.computer === HUIDIG.computer && keuze.telefoon === HUIDIG.telefoon;
    samenvatting.textContent = zelfde
      ? 'Je kijkt nu naar de foto\\u2019s die al op de site staan: ' + keuze.computer + ' voor een computer en ' + keuze.telefoon + ' voor de telefoon.'
      : 'Jouw keuze: foto ' + keuze.computer + ' op een computer, foto ' + keuze.telefoon + ' op de telefoon.';

    mail.href = 'mailto:hallo@jouwidealewebsite.nl?subject=' + encodeURIComponent('Fotokeuze Bewust Gezond in je Mond') + '&body=' + encodeURIComponent(tekst());

    /* Het briefje gaat mee de opslag in: wie er iets in typt en de pagina daarna
       sluit of ververst, is anders zijn tekst kwijt. */
    try {
      localStorage.setItem(SLEUTEL, JSON.stringify({computer: keuze.computer, telefoon: keuze.telefoon, briefje: briefje.value}));
    } catch (e) {}
  }

  if (bewaard && bewaard.briefje) briefje.value = bewaard.briefje;

  var schakels = document.querySelectorAll('.schakel button');
  for (var s = 0; s < schakels.length; s++) {
    schakels[s].addEventListener('click', function () {
      vak = this.getAttribute('data-vak');
      for (var t = 0; t < schakels.length; t++) schakels[t].setAttribute('aria-pressed', String(schakels[t] === this));
    });
  }

  function kiesFoto(nr, waar) {
    keuze[waar || vak] = nr;
    teken();
    melding.textContent = 'Foto ' + nr + ' staat nu in het voorbeeld.';
    setTimeout(function () { melding.textContent = ''; }, 2600);
  }

  var knoppen = document.querySelectorAll('.kies');
  for (var k = 0; k < knoppen.length; k++) {
    knoppen[k].addEventListener('click', function () {
      kiesFoto(Number(this.getAttribute('data-nr')));
      document.querySelector('.voorbeelden').scrollIntoView({behavior: 'smooth', block: 'nearest'});
    });
  }

  /* Vergroten. <dialog> kent elke browser van de laatste jaren; kan hij het niet,
     dan opent de foto gewoon in een nieuw tabblad in plaats van helemaal niet. */
  var venster = document.getElementById('vergroot');
  var vensterFoto = document.getElementById('vergroot-foto');
  var vensterNr = null;
  var loepen = document.querySelectorAll('.loep');
  for (var l = 0; l < loepen.length; l++) {
    loepen[l].addEventListener('click', function () {
      vensterNr = Number(this.getAttribute('data-nr'));
      vensterFoto.src = '/fotokeuze/img/groot-' + vensterNr + '.webp';
      vensterFoto.alt = 'Foto ' + vensterNr;
      if (venster.showModal) venster.showModal();
      else window.open(vensterFoto.src, '_blank');
    });
  }
  document.getElementById('vergroot-sluit').addEventListener('click', function () { venster.close(); });
  venster.addEventListener('click', function (e) { if (e.target === venster) venster.close(); });
  var vanuit = venster.querySelectorAll('[data-vanuit]');
  for (var v = 0; v < vanuit.length; v++) {
    vanuit[v].addEventListener('click', function () {
      kiesFoto(vensterNr, this.getAttribute('data-vanuit'));
      venster.close();
    });
  }

  briefje.addEventListener('input', teken);

  document.getElementById('kopieer').addEventListener('click', function () {
    var klaar = function () {
      melding.textContent = 'Gekopieerd. Plak het in WhatsApp of in een mail.';
      setTimeout(function () { melding.textContent = ''; }, 4000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(tekst()).then(klaar, function () { window.prompt('Kopieer deze tekst:', tekst()); });
    } else {
      window.prompt('Kopieer deze tekst:', tekst());
    }
  });

  document.getElementById('terug').addEventListener('click', function () {
    keuze = {computer: HUIDIG.computer, telefoon: HUIDIG.telefoon};
    teken();
    melding.textContent = 'Terug naar wat er nu op de site staat.';
    setTimeout(function () { melding.textContent = ''; }, 2600);
  });

  teken();
})();
</script>
</body>
</html>
`;

writeFileSync(path.join(UIT, 'index.html'), html, 'utf8');

console.log(
  `fotokeuze: /fotokeuze met ${FOTOS.length} foto's, ${FOTOS.length * 4} afbeeldingen, ${(bytes / 1024 / 1024).toFixed(1)} MB`
);
