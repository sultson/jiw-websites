/**
 * De goedkeuringspagina voor haar Google-bedrijfsprofiel: /gbp
 *
 * Marjon leest hier de voorgestelde profieltekst en de zes diensten, en zet er
 * per blok zelf bij of het goed is of anders moet. Kiest ze 'anders', dan opent
 * een veld met de tekst er al in, zodat ze erin kan schrijven in plaats van hem
 * over te typen. Onderaan kopieert ze het hele antwoord in een keer.
 *
 * WAAROM EEN PAGINA EN GEEN WORD-BESTAND
 * Een bestand heen en weer mailen levert bij de derde ronde drie versies op
 * waarvan niemand weet welke de laatste is. Hier staat de tekst op een vast
 * adres, zij antwoordt op haar telefoon, en wij krijgen een plat antwoord terug
 * waarin per blok staat wat goed is en wat niet.
 *
 * WAAROM OP HAAR EIGEN DOMEIN
 * Zelfde reden als bij /logo en /fotokeuze: de link verloopt niet, en het is
 * haar eigen adres. Op noindex (public/_headers), nergens naartoe gelinkt.
 *
 * DE TELLERS
 * Google kapt af wat niet past en zegt dat niet altijd netjes: 750 tekens voor
 * de profieltekst, 300 per dienst en 120 voor een dienstnaam. Elke teller staat
 * er daarom bij, en hij wordt rood zodra haar eigen tekst over de grens gaat.
 * Zo ontdekt ze dat hier en niet pas als het profiel een halve zin toont.
 *
 * Draait na `vite build`, dus na het kopieren van public/ naar dist/.
 *
 *   node scripts/gbp.mjs
 */
import assert from 'node:assert/strict';
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const UIT = path.join(APP, 'dist', 'gbp');

/* De grenzen die Google aanhoudt. Niet door ons bedacht: dit is wat het
   profielbeheer weigert of afkapt. */
const MAX = {beschrijving: 750, dienstnaam: 120, dienst: 300};

/* ------------------------------------------------------------------ */
/*  De tekst die ter goedkeuring voorligt                              */
/* ------------------------------------------------------------------ */

const BESCHRIJVING = [
  'Ik ben Marjon Ooteman, integraal mondhygiënist met 30 jaar ervaring. Met Bewust Gezond in je Mond kijk ik verder dan je gebit. Je mond laat zien hoe het met de rest van je lichaam gaat, en andersom. Daarom combineer ik reguliere mondzorg met kennis van natuurlijke voeding, essentiële oliën en oosterse geneeskunde.',
  'Ik begeleid je met coaching op het gebied van mondgezondheid en leefstijl, met voeding als belangrijke basis. Dat doe ik praktisch en zonder medisch jargon, zodat je zelf de regie over je gezondheid terugpakt. Daarnaast geef ik lezingen over de verbinding tussen mond en lichaam.',
  'Ben je klaar om de regie over je gezondheid terug te pakken? Bel me, dan gaan we in gesprek.',
].join('\n\n');

const DIENSTEN = [
  {
    naam: 'Kennismakingsgesprek',
    tekst:
      'In een eerste gesprek leren we elkaar kennen. Je vertelt waar je tegenaan loopt en wat je wilt bereiken, en ik leg uit hoe ik werk. Daarna weet je of mijn aanpak bij je past. Bel of app me om een moment af te spreken.',
  },
  {
    naam: 'Coaching mondgezondheid en leefstijl',
    tekst:
      'Samen kijken we naar het grotere plaatje. Je mond, je voeding, je ontspanning en je dagelijkse gewoontes hangen met elkaar samen. In een persoonlijk traject zetten we kleine, haalbare stappen die je volhoudt, zodat je zelf de regie over je gezondheid pakt.',
  },
  {
    naam: 'Voedingsadvies voor een gezonde mond',
    tekst:
      'Wat je eet, zie je terug in je mond. Als natuurlijk voedingsdeskundige help ik je met praktische keuzes voor je boodschappen, tussendoortjes en drinken. Zo voed je je tandvlees en mondflora van binnenuit, zonder streng dieet.',
  },
  {
    naam: 'Natuurlijke mondverzorging',
    tekst:
      'Ik laat je kennismaken met natuurlijke manieren om je mond te verzorgen, zoals oil pulling, tong schrapen en het verantwoord gebruiken van essentiële oliën. Je leert welke producten je kiest, hoeveel je gebruikt en hoe je het in je dagritme inpast.',
  },
  {
    naam: 'Mondhygiëne-advies en poetsinstructie',
    tekst:
      'Met 30 jaar ervaring als mondhygiënist leer ik je een poetsroutine die werkt en makkelijk vol te houden is. Volgorde, techniek en tijd, afgestemd op jouw mond. Je hoort ook wat je gerust kunt laten liggen.',
  },
  {
    naam: 'Lezingen',
    tekst:
      'Ik geef lezingen over de verbinding tussen je mond en de rest van je lichaam. Voor verenigingen, bedrijven, sportclubs en andere groepen die meer willen weten over preventie, voeding en leefstijl. Neem contact op om de mogelijkheden te bespreken.',
  },
];

/* Niet onderhandelbaar: wat hier staat gaat straks woord voor woord in haar
   profiel. Past het niet, dan kapt Google het af en staat er een halve zin bij
   haar bedrijfsnaam in de zoekresultaten. Dus liever hier stuk dan daar. */
assert.ok(
  BESCHRIJVING.length <= MAX.beschrijving,
  `De profieltekst is ${BESCHRIJVING.length} tekens, Google neemt er ${MAX.beschrijving}`
);
for (const d of DIENSTEN) {
  assert.ok(d.naam.length <= MAX.dienstnaam, `Dienstnaam te lang: ${d.naam}`);
  assert.ok(d.tekst.length <= MAX.dienst, `Dienst '${d.naam}' is ${d.tekst.length} tekens, Google neemt er ${MAX.dienst}`);
}

/* ------------------------------------------------------------------ */
/*  De blokken waar zij ja of nee bij zet                              */
/* ------------------------------------------------------------------ */

const BLOKKEN = [
  {
    id: 'beschrijving',
    soort: 'Profieltekst',
    kop: 'Over Bewust Gezond in je Mond',
    hulp:
      'Dit is het stukje over jou dat mensen op je Google-profiel lezen, onder het kopje Over. Het is de enige plek waar je in je eigen woorden mag uitleggen wat je doet.',
    tekst: BESCHRIJVING,
    grens: MAX.beschrijving,
  },
  ...DIENSTEN.map((d, i) => ({
    id: `dienst-${i + 1}`,
    soort: `Dienst ${i + 1} van ${DIENSTEN.length}`,
    kop: d.naam,
    hulp: null,
    tekst: d.tekst,
    grens: MAX.dienst,
  })),
];

const alinea = (t) =>
  t
    .split('\n\n')
    .map((p) => `<p>${p.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</p>`)
    .join('');

const kaarten = BLOKKEN.map(
  (b) => `
      <li class="blok" id="blok-${b.id}" data-id="${b.id}" data-grens="${b.grens}">
        <div class="soort">${b.soort}<span class="vink" aria-hidden="true"></span></div>
        <h2>${b.kop}</h2>
        ${b.hulp ? `<p class="hulp">${b.hulp}</p>` : ''}
        <div class="tekst">${alinea(b.tekst)}</div>
        <div class="keuze" role="group" aria-label="Je antwoord op: ${b.kop}">
          <button type="button" class="ja" data-zet="goed">Zo is het goed</button>
          <button type="button" class="nee" data-zet="anders">Dit moet anders</button>
        </div>
        <div class="anders" hidden>
          <label for="veld-${b.id}">Zet hier hoe het moet worden. De tekst staat er al in, je kunt er zo in schrijven.</label>
          <textarea id="veld-${b.id}" rows="7"></textarea>
          <p class="teller"><b>0</b> van ${b.grens} tekens<span class="tever"> - dit past niet in Google, haal er iets uit</span></p>
          <button type="button" class="herstel">Zet de oorspronkelijke tekst terug</button>
        </div>
      </li>`
).join('');

const html = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Je Google-profiel nalezen - Bewust Gezond in je Mond</title>
<link rel="icon" href="/favicon.svg">
<link rel="preload" href="/fonts/quicksand-latin.woff2" as="font" type="font/woff2" crossorigin>
<style>
@font-face{font-family:'Quicksand';font-style:normal;font-weight:400 700;font-display:swap;src:url('/fonts/quicksand-latin.woff2') format('woff2')}
:root{
  --zand:#dce2df; --zand-diep:#c9d3ce; --room:#f6f4ef; --olijf:#7c8460;
  --petrol:#497b89; --petrol-diep:#33606d; --inkt:#2b4249; --rood:#9c3b2f;
}
*{box-sizing:border-box}
img{max-width:100%;height:auto}
body{margin:0;font-family:'Quicksand',system-ui,sans-serif;color:var(--inkt);background:var(--room);line-height:1.6}
.wrap{max-width:760px;margin:0 auto;padding:0 20px}
header{background:var(--zand);padding:40px 0 32px}
h1{font-weight:700;font-size:clamp(1.5rem,4.5vw,2.1rem);margin:0 0 10px}
.lead{margin:0;max-width:56ch;color:rgba(43,66,73,.8)}
section{padding:30px 0}

/* ---- de stand, blijft onderaan in beeld staan ---- */
.stand{position:sticky;bottom:0;z-index:5;background:var(--inkt);color:var(--room);padding:12px 0}
.stand .wrap{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between}
.stand p{margin:0;font-weight:700;font-size:.92rem}
.stand a{color:var(--room);font-weight:700}
.balk{flex:1 1 120px;height:7px;min-width:110px;background:rgba(246,244,239,.25);border-radius:999px;overflow:hidden}
.balk i{display:block;height:100%;width:0;background:var(--olijf);border-radius:999px;transition:width .25s}

/* ---- de blokken ---- */
ul.blokken{list-style:none;margin:0;padding:0;display:grid;gap:18px}
.blok{background:#fff;border:1px solid var(--zand-diep);border-left:5px solid var(--zand-diep);border-radius:16px;padding:20px 22px}
.blok[data-antwoord="goed"]{border-left-color:var(--olijf)}
.blok[data-antwoord="anders"]{border-left-color:var(--petrol)}
.soort{display:flex;align-items:center;gap:8px;font-size:.76rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--olijf);margin:0 0 4px}
.vink{font-size:.78rem;text-transform:none;letter-spacing:0;color:var(--inkt);opacity:.7}
.blok h2{font-weight:700;font-size:1.18rem;margin:0 0 8px}
.hulp{margin:0 0 12px;font-size:.88rem;color:rgba(43,66,73,.7)}
.tekst{background:var(--room);border-radius:12px;padding:14px 16px}
.tekst p{margin:0 0 10px}
.tekst p:last-child{margin:0}
.keuze{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}
.keuze button{font-family:inherit;font-size:.92rem;font-weight:700;border-radius:999px;padding:10px 20px;cursor:pointer;border:1px solid var(--zand-diep);background:#fff;color:var(--inkt)}
.keuze .ja[aria-pressed="true"]{background:var(--olijf);border-color:var(--olijf);color:#fff}
.keuze .nee[aria-pressed="true"]{background:var(--petrol);border-color:var(--petrol);color:#fff}
.anders{margin-top:14px}
.anders label{display:block;font-size:.88rem;color:rgba(43,66,73,.75);margin-bottom:6px}
textarea{width:100%;font-family:inherit;font-size:1rem;line-height:1.55;border:1px solid var(--zand-diep);border-radius:12px;padding:12px 14px;resize:vertical;background:var(--room);color:inherit}
.teller{margin:6px 0 0;font-size:.82rem;color:rgba(43,66,73,.65)}
.teller .tever{display:none;color:var(--rood);font-weight:700}
.teller[data-tever] b{color:var(--rood)}
.teller[data-tever] .tever{display:inline}
.herstel{margin-top:8px;font-family:inherit;font-size:.82rem;color:var(--petrol);background:none;border:0;padding:0;cursor:pointer;text-decoration:underline}

/* ---- doorgeven ---- */
.doorgeven{background:#fff;border:1px solid var(--zand-diep);border-radius:16px;padding:22px}
.doorgeven h2{font-weight:700;font-size:1.18rem;margin:0 0 8px}
.samenvatting{margin:0 0 14px;font-weight:700}
.openstaand{margin:0 0 14px;font-size:.9rem;color:var(--olijf)}
.openstaand a{color:var(--petrol)}
.acties{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px;align-items:center}
.doe{font-family:inherit;font-size:.95rem;font-weight:700;border:0;border-radius:999px;padding:12px 22px;background:var(--petrol);color:#fff;cursor:pointer;text-decoration:none;display:inline-block}
.doe.rand{background:transparent;color:var(--petrol);border:1px solid var(--petrol)}
.melding{font-size:.88rem;color:var(--olijf);font-weight:700}
.uitkomst{width:100%;margin-top:14px;min-height:170px;font-size:.88rem}
footer{background:var(--zand);padding:26px 0;font-size:.86rem;color:rgba(43,66,73,.75)}
footer p{margin:0 0 10px}
footer p:last-child{margin:0}
</style>
</head>
<body>

<header>
  <div class="wrap">
    <h1>Je Google-profiel nalezen</h1>
    <p class="lead">Dit is de tekst die we voor je Google-bedrijfsprofiel hebben geschreven: het stukje over jou, en de
      zes diensten die je aanbiedt. Lees het door en zet er per stuk bij of het goed is of dat het anders moet. Er
      verandert hier niets zolang je het niet doorstuurt - onderaan kopieer je je antwoord in een keer.</p>
  </div>
</header>

<section>
  <div class="wrap">
    <ul class="blokken">${kaarten}
    </ul>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="doorgeven" id="doorgeven">
      <h2>Je antwoord doorsturen</h2>
      <p class="samenvatting" id="samenvatting"></p>
      <p class="openstaand" id="openstaand"></p>
      <label for="slot">Wil je er nog iets bij zeggen?</label>
      <textarea id="slot" rows="3" placeholder="Bijvoorbeeld: ik wil er nog een dienst bij, of iets over de foto's op mijn profiel."></textarea>
      <div class="acties">
        <button type="button" class="doe" id="kopieer">Kopieer mijn antwoord</button>
        <a class="doe rand" id="mail" href="#">Stuur het per mail</a>
        <button type="button" class="doe rand" id="leeg">Begin opnieuw</button>
        <span class="melding" id="melding"></span>
      </div>
      <label for="uitkomst" style="display:block;margin-top:16px;font-size:.88rem;color:rgba(43,66,73,.75)">Dit is wat je doorstuurt:</label>
      <textarea class="uitkomst" id="uitkomst" readonly></textarea>
    </div>
  </div>
</section>

<div class="stand">
  <div class="wrap">
    <p id="stand-tekst"></p>
    <span class="balk"><i id="stand-balk"></i></span>
    <a href="#doorgeven">Naar doorsturen</a>
  </div>
</div>

<footer>
  <div class="wrap">
    <p>Deze pagina staat niet in Google en er staat nergens op je website een link naartoe: alleen wie het adres heeft
      komt hier. Je antwoord blijft op je eigen telefoon of computer staan, ook als je de pagina sluit en er later
      verdergaat. Wij zien het pas als je het doorstuurt.</p>
    <p>De tellers bij een aangepaste tekst zijn geen pesterij: Google neemt maximaal ${MAX.beschrijving} tekens voor het
      stukje over jou en ${MAX.dienst} per dienst, en kapt af wat daar niet in past.</p>
  </div>
</footer>

<script>
(function () {
  var SLEUTEL = 'marjon-gbp';
  var BLOKKEN = ${JSON.stringify(
    BLOKKEN.map((b) => ({id: b.id, soort: b.soort, kop: b.kop, tekst: b.tekst, grens: b.grens}))
  )};
  var stand = {};

  try {
    var bewaard = JSON.parse(localStorage.getItem(SLEUTEL) || 'null');
    if (bewaard && typeof bewaard === 'object') stand = bewaard;
  } catch (e) {}

  var slot = document.getElementById('slot');
  var samenvatting = document.getElementById('samenvatting');
  var openstaand = document.getElementById('openstaand');
  var standTekst = document.getElementById('stand-tekst');
  var standBalk = document.getElementById('stand-balk');
  var uitkomst = document.getElementById('uitkomst');
  var melding = document.getElementById('melding');
  var mail = document.getElementById('mail');

  if (stand.__slot) slot.value = stand.__slot;

  function blokVan(id) {
    for (var i = 0; i < BLOKKEN.length; i++) if (BLOKKEN[i].id === id) return BLOKKEN[i];
    return null;
  }

  function antwoordVan(id) {
    var s = stand[id];
    return s && s.antwoord ? s.antwoord : null;
  }

  function nieuweTekst(id) {
    var s = stand[id];
    return s && typeof s.tekst === 'string' ? s.tekst : blokVan(id).tekst;
  }

  function tekst() {
    var regels = ['Mijn antwoord op de tekst voor mijn Google-profiel:', ''];
    for (var i = 0; i < BLOKKEN.length; i++) {
      var b = BLOKKEN[i];
      var a = antwoordVan(b.id);
      regels.push('--- ' + b.soort + ': ' + b.kop + ' ---');
      if (a === 'goed') {
        regels.push('GOED ZO, zo mag het erin.');
      } else if (a === 'anders') {
        var nw = nieuweTekst(b.id).trim();
        regels.push('DIT MOET ANDERS. Zo moet het worden:');
        regels.push(nw || '(nog niets ingevuld)');
        if (nw.length > b.grens) {
          regels.push('(let op: ' + nw.length + ' tekens, Google neemt er ' + b.grens + ')');
        }
      } else {
        regels.push('NOG NIET BEOORDEELD.');
      }
      regels.push('');
    }
    var erbij = (slot.value || '').trim();
    if (erbij) {
      regels.push('--- Nog dit ---');
      regels.push(erbij);
      regels.push('');
    }
    return regels.join('\\n').replace(/\\n+$/, '\\n');
  }

  function bewaar() {
    stand.__slot = slot.value;
    try {
      localStorage.setItem(SLEUTEL, JSON.stringify(stand));
    } catch (e) {}
  }

  function teken() {
    var klaar = 0;
    var open = [];

    for (var i = 0; i < BLOKKEN.length; i++) {
      var b = BLOKKEN[i];
      var el = document.getElementById('blok-' + b.id);
      var a = antwoordVan(b.id);
      var veld = el.querySelector('textarea');
      var anders = el.querySelector('.anders');
      var teller = el.querySelector('.teller');
      var vink = el.querySelector('.vink');

      if (a) el.setAttribute('data-antwoord', a);
      else el.removeAttribute('data-antwoord');

      el.querySelector('.ja').setAttribute('aria-pressed', String(a === 'goed'));
      el.querySelector('.nee').setAttribute('aria-pressed', String(a === 'anders'));
      anders.hidden = a !== 'anders';
      vink.textContent = a === 'goed' ? 'goed' : a === 'anders' ? 'wordt aangepast' : '';

      if (a === 'anders') {
        if (veld.value !== nieuweTekst(b.id)) veld.value = nieuweTekst(b.id);
        var n = veld.value.length;
        teller.querySelector('b').textContent = String(n);
        if (n > b.grens) teller.setAttribute('data-tever', '');
        else teller.removeAttribute('data-tever');
      }

      if (a) klaar++;
      else open.push(b);
    }

    var totaal = BLOKKEN.length;
    standTekst.textContent = klaar + ' van ' + totaal + ' beoordeeld';
    standBalk.style.width = Math.round((klaar / totaal) * 100) + '%';

    if (klaar === totaal) {
      samenvatting.textContent = 'Je hebt alle ' + totaal + ' stukken beoordeeld. Kopieer je antwoord en stuur het naar Armando.';
      openstaand.textContent = '';
    } else {
      samenvatting.textContent = 'Je hebt ' + klaar + ' van de ' + totaal + ' stukken beoordeeld.';
      openstaand.innerHTML =
        'Nog open: ' +
        open
          .map(function (b) {
            return '<a href="#blok-' + b.id + '">' + b.kop + '</a>';
          })
          .join(', ') +
        '. Je mag het ook zo doorsturen, dan pakken we de rest later op.';
    }

    uitkomst.value = tekst();
    mail.href =
      'mailto:hallo@jouwidealewebsite.nl?subject=' +
      encodeURIComponent('Google-profiel Bewust Gezond in je Mond') +
      '&body=' +
      encodeURIComponent(tekst());

    bewaar();
  }

  for (var i = 0; i < BLOKKEN.length; i++) {
    (function (b) {
      var el = document.getElementById('blok-' + b.id);
      var veld = el.querySelector('textarea');

      var knoppen = el.querySelectorAll('.keuze button');
      for (var k = 0; k < knoppen.length; k++) {
        knoppen[k].addEventListener('click', function () {
          var zet = this.getAttribute('data-zet');
          /* Nog een keer op dezelfde knop haalt het antwoord weg. Zonder dat kan
             iemand die per ongeluk tikt zijn antwoord nooit meer op onbeantwoord
             zetten, en dan staat er straks 'goed' bij een stuk dat ze niet las. */
          var nu = antwoordVan(b.id);
          stand[b.id] = stand[b.id] || {};
          stand[b.id].antwoord = nu === zet ? null : zet;
          teken();
          if (stand[b.id].antwoord === 'anders') veld.focus();
        });
      }

      veld.addEventListener('input', function () {
        stand[b.id] = stand[b.id] || {};
        stand[b.id].tekst = veld.value;
        teken();
      });

      el.querySelector('.herstel').addEventListener('click', function () {
        stand[b.id] = stand[b.id] || {};
        stand[b.id].tekst = b.tekst;
        veld.value = b.tekst;
        teken();
      });
    })(BLOKKEN[i]);
  }

  slot.addEventListener('input', teken);

  function zeg(t) {
    melding.textContent = t;
    setTimeout(function () {
      melding.textContent = '';
    }, 4000);
  }

  document.getElementById('kopieer').addEventListener('click', function () {
    var t = tekst();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(
        function () {
          zeg('Gekopieerd. Plak het in WhatsApp of in een mail.');
        },
        function () {
          uitkomst.select();
          zeg('Kopieren lukte niet. De tekst staat geselecteerd, doe het met de hand.');
        }
      );
    } else {
      uitkomst.select();
      zeg('De tekst staat geselecteerd, kopieer hem met de hand.');
    }
  });

  document.getElementById('leeg').addEventListener('click', function () {
    if (!window.confirm('Al je antwoorden op deze pagina weghalen?')) return;
    stand = {};
    slot.value = '';
    for (var j = 0; j < BLOKKEN.length; j++) {
      var v = document.getElementById('blok-' + BLOKKEN[j].id).querySelector('textarea');
      v.value = BLOKKEN[j].tekst;
    }
    teken();
    zeg('Alles staat weer leeg.');
  });

  teken();
})();
</script>
</body>
</html>
`;

if (!existsSync(UIT)) mkdirSync(UIT, {recursive: true});
writeFileSync(path.join(UIT, 'index.html'), html, 'utf8');

console.log(
  `gbp: /gbp met ${BLOKKEN.length} blokken (profieltekst ${BESCHRIJVING.length}/${MAX.beschrijving}, ${DIENSTEN.length} diensten), ${(Buffer.byteLength(html) / 1024).toFixed(0)} kB`
);
