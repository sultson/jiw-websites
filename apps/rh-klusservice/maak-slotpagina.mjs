/* Schrijft dist/slot-vervangen-valkenswaard/index.html.
   Draaien:  node maak-slotpagina.mjs
   Niet met de hand bewerken, de volgende ronde overschrijft het.

   Waarom deze pagina los staat (verzoek Armando 07-10-2026, na een gesprek met
   Robbin): hij doet slot- en sluitwerk, maar dat loopt nu via via en nooit via
   Google. Hij wil er wel op gevonden worden, zonder dat het groot op de
   homepagina staat. Dus: eigen pagina met eigen zoekwoorden, geen enkele link
   vanaf de homepagina. De dienstkaart "Sloten en hang-en-sluitwerk" blijft daar
   staan zoals hij is en linkt bewust nergens naar.

   Google komt er langs twee wegen bij: dist/sitemap.xml en de voet van de acht
   plaatspagina's (zie onderdelen.mjs). Die plaatspagina's staan wel in de voet
   van de homepagina, dus de pagina is in twee stappen te bereiken zonder dat
   hij op de homepagina staat.

   Let op: dist/_headers zet X-Robots-Tag: noindex over de hele site, zolang dit
   een concept is. Deze pagina wordt dus nog niet geindexeerd. Dat is een regel
   bij de oplevering op zijn eigen domein.

   Geen offerteformulier in de hero (verzoek Armando 07-10-2026): wie zijn slot
   kwijt is vult geen formulier in, die belt. Bellen en WhatsApp zijn hier de
   enige twee acties; de plaatspagina's houden hun formulier wel.

   De plaatsnaam staat niet in de h1 (zelfde verzoek, het werk is breder dan
   Valkenswaard). Hij staat nog wel in de titel, de omschrijving, de inleiding
   en de structured data, dus voor Google is de pagina nog steeds lokaal.

   Spoed staat vooraan (verzoek Armando 07-10-2026: "is vooral voor spoed, dus
   dat mag ook belicht worden"). Dat zit op vier plekken: de h1 en de titel
   beginnen met buitengesloten, een strook in de hero met het nummer erin, een
   eigen sectie #spoed direct onder de hero, en de spoedvraag staat bovenaan bij
   de veelgestelde vragen.
   Wat er bewust niet staat: een aanrijtijd ("binnen 30 minuten"), 24-uurs
   bereikbaarheid en avond- of weekenddienst. Robbin heeft daar nog niets over
   gezegd. Zegt hij ja, dan kan dit blok een stuk harder (zie README).
   Wat er wel staat is wat zijn eigen klanten op Werkspot schrijven: binnen vijf
   minuten reactie (Julisca, 801925) en dezelfde dag geholpen (827235 uit
   Gemonde en 799114 uit Waalre). Dat is bewijs en geen belofte van ons, dus de
   bron staat er onder.

   Het zoekwoord. "Slotenmaker" is de grootste zoekterm, en die staat hier
   bewust niet in de titel: een slotenmaker is 24 uur bereikbaar en Robbin heeft
   dat nooit gezegd. "Slot vervangen" en "buitengesloten" zijn wat er overblijft
   en die zijn waar te maken. Zegt hij dat hij wel uitrijdt bij spoed, ook
   's avonds, dan is "slotenmaker Valkenswaard" de volgende stap. */

import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TEL, TEL_TOON, WA, MAIL, WERKSPOT, SITE, SLOT_SLUG, PLAATSEN, BEDRIJF, ogTags, vlucht, maandJaar, BALK, VOET, ZWEEF } from './onderdelen.mjs';

const hier = dirname(fileURLToPath(import.meta.url));
const beoordelingen = JSON.parse(readFileSync(join(hier, 'werkspot-reviews.json'), 'utf8'));

const SLUG = SLOT_SLUG;

const TITEL = 'Buitengesloten of slot vervangen in Valkenswaard | RH Klusservice';
const OMSCHRIJVING = 'Staat u buiten of is uw slot kapot? Bel 06 31 29 51 56, dan hoort u direct of we vandaag kunnen komen. '
  + 'Slot en cilinder vervangen, afgebroken sleutel, hang-en-sluitwerk. Valkenswaard, Eindhoven en omstreken. 5,0 op Werkspot.';

/* De plaatsen waar slotwerk realistisch is: binnen een half uur rijden. Het
   werkgebied op zijn Werkspot-profiel loopt tot Amsterdam, maar daar ga je niet
   anderhalf uur voor een cilinder naartoe. Navragen bij Robbin hoe ver hij
   hiervoor wil rijden. */
const DICHTBIJ = ['Valkenswaard', 'Dommelen', 'Waalre', 'Leende', 'Bergeijk', 'Veldhoven', 'Eindhoven'];

/* Zes dingen die hij aan sloten doet. Geen foto's: hij heeft geen enkele foto
   van slotwerk, dus hier staat een icoon en geen vervanger die de dienst niet
   is. Sinds 07-10-2026 (verzoek Armando) zijn dit losse opgetilde kaarten met
   het icoon zichtbaar in alle drie de stijlen, zoals de dienstkaarten op de
   homepagina: .inzet--kaarten in stijl.css. */
const WERK = [
  {
    kop: 'Buitengesloten',
    icoon: '<rect x="4.4" y="10.4" width="15.2" height="10" rx="1.6"/><path d="M8.2 10.4V7.6a3.8 3.8 0 0 1 7.6 0v2.8"/><circle cx="12" cy="14.6" r="1.2"/><path d="M12 15.8v2"/>',
    tekst: 'Staat u voor een deur die u niet open krijgt? Bel, dan hoort u direct of we kunnen komen en wat we meenemen.'
  },
  {
    kop: 'Cilinder vervangen',
    icoon: '<circle cx="9" cy="9" r="4.4"/><path d="M11.8 12.2 20 20.4"/><path d="M17.2 17.8l2-2"/><path d="M14.8 15.4l2-2"/>',
    tekst: 'Een nieuwe cilinder met nieuwe sleutels in dezelfde deur. Na een verhuizing, een kwijtgeraakte sleutel of een huurder die eruit gaat.'
  },
  {
    kop: 'Slot kapot of sleutel afgebroken',
    icoon: '<rect x="4.4" y="10.4" width="15.2" height="10" rx="1.6"/><path d="M8.2 10.4V7.6a3.8 3.8 0 0 1 7.6 0v2.8"/><path d="M9.6 14.2l4.8 3.4"/><path d="M14.4 14.2l-4.8 3.4"/>',
    tekst: 'Een slot dat vastloopt, een sleutel die in het slot afbreekt of een kruk die loszit. We vervangen of repareren het, wat verstandiger is.'
  },
  {
    kop: 'Eén sleutel voor alle deuren',
    icoon: '<circle cx="7.4" cy="8.4" r="3.4"/><path d="M9.8 10.8 17 18"/><path d="M15 16.2l1.8-1.8"/><path d="M4 16.4h5"/><path d="M4 19.8h8"/>',
    tekst: 'Voordeur, achterdeur en de berging gelijksluitend maken. Daarna past één sleutel op alles en kan de rest van de bos weg.'
  },
  {
    kop: 'Raam- en deurbeslag',
    icoon: '<rect x="4" y="3.6" width="16" height="16.8" rx="1.2"/><path d="M12 3.6v16.8"/><path d="M9.4 12h-1.8"/><path d="M14.6 12h1.8"/>',
    tekst: 'Sluitwerk op draai-kiepramen, schuifpuien en terrasdeuren. Ook scharnieren, sluitplaten en een raam dat niet meer dicht wil.'
  },
  {
    kop: 'De deur zelf',
    icoon: '<path d="M5.4 20.8V4.2a1 1 0 0 1 1-1h11.2a1 1 0 0 1 1 1v16.6"/><path d="M3 20.8h18"/><circle cx="15.4" cy="12.4" r="1"/><path d="M8.6 7.4l3 3-3 3"/>',
    tekst: 'Een deur die klemt of niet meer in het slot valt, komt vaak van hout dat gewerkt heeft of een kozijn dat is gaan zakken. Dat passen we dan aan.'
  }
];

/* Hoe een spoedklus gaat, in drie stappen. Staat als eigen sectie direct onder
   de hero (verzoek Armando 07-10-2026: spoed mag belicht worden). Geen enkele
   aanrijtijd en geen avonddienst: dat is wat Robbin nog moet bevestigen. Wat er
   staat is wat hij aan de telefoon waar kan maken. */
const SPOED = [
  {
    kop: 'Bellen gaat het snelst',
    /* lijnversie van de telefoon; de gevulde SVG_TEL hieronder wordt in dit
       raster met stroke getekend en valt dan uit elkaar */
    icoon: '<path d="M21.4 16.9v2.9a2 2 0 0 1-2.2 2 19.5 19.5 0 0 1-8.5-3 19.2 19.2 0 0 1-5.9-5.9 19.5 19.5 0 0 1-3-8.6 2 2 0 0 1 2-2.2h2.9a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.6 9.9a15.8 15.8 0 0 0 5.9 5.9l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2.1Z"/>',
    tekst: 'Een deur waar u buiten staat, los je niet via e-mail. Daarom staat er op deze pagina geen formulier. U heeft Robbin zelf aan de lijn.'
  },
  {
    kop: 'U hoort direct of het vandaag lukt',
    icoon: '<circle cx="12" cy="12" r="9"/><path d="M12 7.2V12l3.4 2"/>',
    tekst: 'Lukt het vandaag niet, dan zeggen we dat meteen. Dan kunt u verder zoeken in plaats van wachten op een terugbelverzoek.'
  },
  {
    kop: 'We komen uit Valkenswaard',
    icoon: '<path d="M12 21.4s7-5.6 7-10.6a7 7 0 0 0-14 0c0 5 7 10.6 7 10.6Z"/><circle cx="12" cy="10.6" r="2.6"/>',
    tekst: 'Valkenswaard, Dommelen, Waalre, Leende, Bergeijk, Veldhoven en Eindhoven liggen binnen een half uur rijden. Dat is de ronde waarin een spoedklus te doen is.'
  }
];

/* Twee beoordelingen van Werkspot over snelheid, als bewijs onder de
   spoedsectie. Letterlijk ingekort tot de zin die over snel reageren gaat; de
   hele tekst staat in de schuifrij verderop en op zijn profiel. Niet verzinnen
   of aanvullen: dit zijn de enige twee die dezelfde dag met zoveel woorden
   noemen. 801925 (Julisca) staat erbij in de rij hieronder. */
const CITATEN = [
  {
    id: '827235',
    tekst: 'Reageerde snel en kon de zelfde dag al.'
  },
  {
    id: '801925',
    tekst: 'We hadden met spoed hulp nodig, hij reageerde binnen 5 minuten.'
  }
];

/* Vier vragen waar in Valkenswaard echt op gezocht wordt. De spoedvraag staat
   bovenaan sinds 07-10-2026, want dat is waar deze pagina voor is. De
   antwoorden staan ook als FAQPage in de structured data onderaan de pagina.
   Geen prijzen en geen tijden: die heeft Robbin nooit genoemd. */
const VRAGEN = [
  {
    vraag: 'Komt u ook als ik buitengesloten ben?',
    antwoord: 'Bel, dan hoort u direct of we kunnen. In Valkenswaard en de dorpen eromheen zitten we dichtbij. '
      + 'Een vaste tijd kunnen we aan de telefoon niet beloven, wel meteen zeggen of het vandaag lukt.'
  },
  {
    vraag: 'Hoe snel kunt u er zijn?',
    antwoord: 'Dat hangt af van waar we op dat moment aan het werk zijn. U hoort het aan de telefoon, voordat u ophangt. '
      + 'Klanten op Werkspot schrijven dat we snel reageren en meerdere keren dezelfde dag konden komen.'
  },
  {
    vraag: 'Wat kost het vervangen van een slot?',
    antwoord: 'Dat hangt af van het slot en van de deur. Een cilinder in een bestaande voordeur is ander werk dan het sluitwerk van een schuifpui. '
      + 'Bel of stuur een foto van de deur via WhatsApp, dan hoort u wat het wordt voordat we komen.'
  },
  {
    vraag: 'Werkt u ook buiten Valkenswaard?',
    antwoord: 'Voor slot- en sluitwerk komen we in Valkenswaard, Dommelen, Waalre, Leende, Bergeijk, Veldhoven en Eindhoven. '
      + 'Verder in ons werkgebied, van Breda tot Amsterdam, doen we sloten in combinatie met ander klus- of timmerwerk.'
  }
];

/* De beoordelingen op deze pagina gaan over snelheid, deuren, kozijnen en
   hang-en-sluitwerk. Over een slot gaat er geen een, want in zijn 49
   beoordelingen op Werkspot staat geen slotenklus. Daarom staan ze hier op hun
   id en niet op een filter: dan is te zien welke het zijn en waarom.
   Sinds 07-10-2026 staan de drie over snelheid vooraan, want daar gaat deze
   pagina over: Julisca (spoed, binnen vijf minuten reactie), Gemonde (zelfde
   dag) en Waalre (zelfde dag, poort). Daarna het deurwerk: Maaike noemt hang-
   en sluitwerk met zoveel woorden, Marianne het hang- en sluitwerk van een
   nieuwe buitendeur, Diana gaat over een scheef huis en Harry over een
   voordeur. */
const REVIEW_IDS = ['801925', '827235', '799114', '908396', '895918', '888434', '1001721'];

const VINK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6.2 11.6 2.9 8.3 4 7.2l2.2 2.2 5.8-5.8 1.1 1.1z"/></svg>';

/* Het spoedicoon: een klok met een uitroep erin. Zelfde hand als de iconen in
   WERK, dus lijnen en geen vlakken. */
const ICOON_SPOED = '<circle cx="12" cy="13" r="8"/><path d="M12 9.2v4"/><path d="M12 16.4h.01"/><path d="M9 2.6h6"/><path d="M12 2.6v2.4"/>';

const SVG_TEL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2Z"/></svg>';
const SVG_WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 5-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.2 1.3-2 1.4-.5.1-1.2.2-3.5-.8-2.9-1.2-4.8-4.2-5-4.4-.1-.2-1.1-1.5-1.1-2.9 0-1.4.7-2 1-2.3.2-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.9 2.2c.1.2 0 .4-.1.6l-.4.5c-.1.2-.3.3-.1.6.1.3.6 1.2 1.4 1.9 1 .9 1.8 1.1 2.1 1.3.2.1.4 0 .6-.1l.8-1c.2-.2.4-.2.6-.1l2.1 1c.3.1.5.2.5.4.1.2.1.9-.1 1.6Z"/></svg>';
const SVG_MAIL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18c.6 0 1 .4 1 1v12c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1Zm9 8L4.3 7H19.7L12 13Zm0 2.3L4 9.1V17h16V9.1l-8 6.2Z"/></svg>';
const SVG_VINKJE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 14.3-4-4 1.5-1.4 2.5 2.5 5.4-5.4 1.5 1.4-6.9 6.9Z"/></svg>';

const vind = (id) => {
  const b = beoordelingen.find((x) => x.id === id);
  if (!b) throw new Error(`beoordeling ${id} staat niet in werkspot-reviews.json`);
  return b;
};

/* Twee namen zitten niet in werkspot-reviews.json maar wel in de oudere scrape
   die de homepagina gebruikt. Zelfde lijstje als in maak-reviews.mjs; staat
   hier los omdat die twee bestanden elkaar niet importeren. */
const NAMEN = { 929355: 'Marc', 895918: { naam: 'Marianne', plaats: 'Maarheeze' } };

/* 15 van de 41 beoordelingen kwamen zonder naam uit de scrape. Dan komt de
   plaats op de naamregel te staan. Een naam verzinnen betekent een klant op de
   site die niet bestaat. Eerder stond hier naam[0] zonder die afhandeling, en
   dat liep stuk zodra er een naamloze beoordeling bij kwam. */
function wie(b){
  const extra = NAMEN[b.id];
  const naam = (typeof extra === 'string' ? extra : extra?.naam) || (b.naam || '').trim();
  const plaats = (typeof extra === 'object' ? extra.plaats : '') || (b.plaats || '').trim();
  if (naam) return { regel: plaats ? `${naam}, ${plaats}` : naam, letter: vlucht(naam[0].toUpperCase()) };
  if (plaats) return { regel: `Klant uit ${plaats}`, letter: vlucht(plaats[0].toUpperCase()) };
  return { regel: 'Klant via Werkspot', letter: '&rdquo;' };
}

function reviewkaart(id){
  const b = vind(id);
  const vol = Math.round(b.score / 2);
  const sterren = '&#9733;'.repeat(vol) + '&#9734;'.repeat(5 - vol);
  const { regel, letter } = wie(b);
  return `      <article class="review">
        <div class="review__top">
          <span class="sterren" aria-hidden="true">${sterren}</span>
          <span class="review__datum">${maandJaar(b.datum)}</span>
        </div>
        <p>&ldquo;${vlucht(b.tekst.trim()).replace(/\r?\n+/g, '<br>')}&rdquo;</p>
        <footer>
          <span class="review__cirkel" aria-hidden="true">${letter}</span>
          <span class="review__wie"><b>${vlucht(regel)}</b><small>${VINK} Geverifieerde klus via Werkspot</small></span>
        </footer>
      </article>`;
}

/* Een citaat onder de spoedsectie: de ingekorte zin plus wie het zei en
   wanneer, zodat te zien is dat het van een klant komt en niet van ons. */
function citaatkaart(c){
  const b = vind(c.id);
  const { regel } = wie(b);
  return `      <blockquote class="citaat">
        <p>&ldquo;${vlucht(c.tekst)}&rdquo;</p>
        <small>${VINK} ${vlucht(regel)} &middot; ${maandJaar(b.datum)} &middot; via Werkspot</small>
      </blockquote>`;
}

const pagina = () => `<!doctype html>
<html lang="nl" data-thema="midnight-clean">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${vlucht(TITEL)}</title>
<meta name="description" content="${vlucht(OMSCHRIJVING)}">
<link rel="canonical" href="${SITE}/${SLUG}/">
${ogTags({ titel: TITEL, omschrijving: OMSCHRIJVING, pad: `/${SLUG}/` })}
<link rel="icon" href="/logo/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/stijl.css">
</head>
<body>

${BALK(TITEL)}

<main>

<section class="lok">
  <div class="binnen">
    <div class="lok__grid">
      <div>
        <h1>Buitengesloten of slot vervangen</h1>
        <p class="lok__lood">U staat voor een deur die niet opengaat, er is een sleutel afgebroken in het slot of de deur gaat niet meer op slot.
          RH Klusservice vervangt sloten en hang-en-sluitwerk in Valkenswaard, Eindhoven en de dorpen eromheen.</p>
        <div class="knoppen">
          <a class="knop knop--wit" href="tel:${TEL}">${SVG_TEL}${TEL_TOON}</a>
          <a class="knop knop--wa" href="${WA}" rel="noopener">${SVG_WA}WhatsApp</a>
        </div>
        <div class="spoed">
          <span class="spoed__tegel"><svg viewBox="0 0 24 24" aria-hidden="true">${ICOON_SPOED}</svg></span>
          <div>
            <b>Spoed? Bel <a href="tel:${TEL}">${TEL_TOON}</a></b>
            <p>Dan hoort u direct of we vandaag kunnen komen. Robbin neemt zelf op.</p>
          </div>
        </div>
        <a class="hero__cijfer" href="${WERKSPOT}" rel="noopener">
          <span class="sterren" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
          <b>5,0</b>
          <span class="tel">&middot; 49 beoordelingen<span class="tel__op"> op</span></span>
          <img class="ws__mark" src="/logo/werkspot.png" alt="Werkspot" width="359" height="64">
        </a>
        <div class="bewijs">
          <span>${SVG_VINKJE}Voordeuren, achterdeuren, schuifpuien en ramen</span>
          <span>${SVG_VINKJE}We kijken naar het slot, de deur en het kozijn</span>
        </div>
      </div>
      <div class="lok__beeld">
        <img src="/foto/buitendeur-gevel.jpg" alt="Nieuwe buitendeur met slot en hang-en-sluitwerk in een gemetselde gevel" width="892" height="1400" fetchpriority="high">
      </div>
    </div>
  </div>
</section>

<section class="vak vak--grijs" id="spoed">
  <div class="binnen">
    <div class="kopgroep">
      <h2>Met spoed een slot of een deur</h2>
      <div class="streep"></div>
      <p class="lood">Slotwerk is bijna altijd haast. U staat buiten, of de deur gaat niet meer op slot en dan wilt u hem vandaag dicht hebben. Zo gaat dat bij ons.</p>
    </div>
    <div class="inzet inzet--licht">
${SPOED.map((s) => `      <div>
        <span class="tegel tegel--lijn"><svg viewBox="0 0 24 24" aria-hidden="true">${s.icoon}</svg></span>
        <h3>${s.kop}</h3>
        <p>${s.tekst}</p>
      </div>`).join('\n')}
    </div>
    <div class="citaten">
${CITATEN.map(citaatkaart).join('\n')}
    </div>
  </div>
</section>

<section class="vak vak--zwart">
  <div class="binnen">
    <div class="kopgroep">
      <h2>Wat we doen aan sloten en sluitwerk</h2>
      <div class="streep"></div>
      <p class="lood">Van een cilinder die vervangen moet tot het sluitwerk van een schuifpui. In woningen, bedrijfspanden en opslagruimtes.</p>
    </div>
    <div class="inzet inzet--zes inzet--kaarten">
${WERK.map((w) => `      <div>
        <span class="tegel tegel--lijn"><svg viewBox="0 0 24 24" aria-hidden="true">${w.icoon}</svg></span>
        <h3>${w.kop}</h3>
        <p>${w.tekst}</p>
      </div>`).join('\n')}
    </div>
  </div>
</section>

<section class="vak vak--grijs">
  <div class="binnen">
    <div class="ws__kop">
      <div class="ws__titel">
        <h2>Beoordelingen over snelheid en deurwerk</h2>
        <a class="ws__merk" href="${WERKSPOT}" rel="noopener">
          <img src="/logo/werkspot.png" alt="Werkspot" width="359" height="64" loading="lazy">
        </a>
      </div>
      <p class="ws__intro">5,0 gemiddeld uit 49 beoordelingen. Deze ${REVIEW_IDS.length} gaan over snel reageren, deuren, kozijnen en hang-en-sluitwerk.
        <a href="${WERKSPOT}" rel="noopener">Alle beoordelingen bekijken</a></p>
      <div class="ws__nav">
        <button type="button" class="ws__pijl" data-ws="terug" aria-label="Vorige beoordelingen">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 8 12l7 7"/></svg>
        </button>
        <button type="button" class="ws__pijl" data-ws="verder" aria-label="Volgende beoordelingen">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  </div>
  <div class="ws__rand">
    <div class="ws__lijst" tabindex="0" role="group" aria-label="Beoordelingen op Werkspot">
${REVIEW_IDS.map(reviewkaart).join('\n')}
    </div>
  </div>
</section>

<section class="vak vak--zwart">
  <div class="binnen">
    <div class="over">
      <div>
        <div class="kopgroep">
          <h2>Een klusbedrijf dat ook sloten doet</h2>
          <div class="streep"></div>
        </div>
        <p class="lood">Wij zijn een klusbedrijf uit Valkenswaard. Deuren en kozijnen zijn het werk waar we het meest om gevraagd worden, en sloten horen daarbij.</p>
        <p>Een slot dat klemt of een deur die niet meer in het slot valt, heeft vaak met het hout en het kozijn te maken. Wordt er dan alleen een nieuwe cilinder in gezet, dan loopt die net zo hard weer vast. Wij kijken naar alle drie: het slot, de deur en het kozijn.</p>
        <p>U houdt één aanspreekpunt. Wat er nodig is en wat het kost, hoort u voordat we beginnen.</p>
        <div class="knoppen">
          <a class="knop knop--wit" href="tel:${TEL}">${SVG_TEL}${TEL_TOON}</a>
          <a class="knop knop--licht" href="/projecten/">Bekijk ons werk</a>
        </div>
      </div>
      <div class="over__beeld">
        <img src="/foto/binnendeur-gang-klein.jpg" alt="Binnendeur met nieuw kozijn in de gang" width="570" height="760" loading="lazy" style="object-position:center 45%">
      </div>
    </div>
  </div>
</section>

<section class="vak vak--grijs">
  <div class="binnen">
    <div class="kopgroep">
      <h2>Veelgestelde vragen</h2>
      <div class="streep"></div>
    </div>
    <div class="inzet inzet--licht">
${VRAGEN.map((v) => `      <div>
        <h3>${v.vraag}</h3>
        <p>${v.antwoord}</p>
      </div>`).join('\n')}
    </div>
  </div>
</section>

<section class="vak vak--zwart">
  <div class="binnen">
    <div class="kopgroep">
      <h2>Bel voor een spoedklus of een nieuw slot</h2>
      <div class="streep"></div>
      <p class="lood">Staat u buiten, bel dan. Kan het wachten, stuur dan een bericht met een foto van de deur.</p>
    </div>
    <div class="contact__blok">
      <a href="tel:${TEL}">
        <span class="tegel">${SVG_TEL}</span>
        <span><small>Bellen</small><strong>${TEL_TOON}</strong></span>
      </a>
      <a class="rij--wa" href="${WA}" rel="noopener">
        <span class="tegel">${SVG_WA}</span>
        <span><small>WhatsApp</small><strong>Stuur een bericht</strong></span>
      </a>
      <a href="mailto:${MAIL}">
        <span class="tegel">${SVG_MAIL}</span>
        <span><small>E-mail</small><strong>${MAIL}</strong></span>
      </a>
    </div>
    <p class="gebied"><b>Voor slotwerk komen we in:</b> ${DICHTBIJ.join(', ')}. Voor ander klus- en timmerwerk is ons werkgebied groter:
      ${PLAATSEN.map((p) => `<a href="/${p.slug}/">${p.naam}</a>`).join(', ')}.</p>
  </div>
</section>

</main>

${VOET}

<script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      ...BEDRIJF,
      '@id': `${SITE}/#bedrijf`,
      url: `${SITE}/${SLUG}/`,
      areaServed: DICHTBIJ.map((naam) => ({ '@type': 'City', name: naam }))
    },
    {
      '@type': 'Service',
      name: 'Slot vervangen, buitensluiting en hang-en-sluitwerk',
      serviceType: 'Slot vervangen',
      description: 'Buitengesloten, een slot dat kapot is of een afgebroken sleutel. Bel, dan hoort u direct of we vandaag kunnen komen.',
      provider: { '@id': `${SITE}/#bedrijf` },
      areaServed: DICHTBIJ.map((naam) => ({ '@type': 'City', name: naam })),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Sloten en sluitwerk',
        itemListElement: WERK.map((w) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: w.kop } }))
      }
    },
    {
      '@type': 'FAQPage',
      mainEntity: VRAGEN.map((v) => ({
        '@type': 'Question',
        name: v.vraag,
        acceptedAnswer: { '@type': 'Answer', text: v.antwoord }
      }))
    }
  ]
})}
</script>

${ZWEEF}

<script src="/site.js" defer></script>

</body>
</html>
`;

const map = join(hier, 'dist', SLUG);
mkdirSync(map, { recursive: true });
writeFileSync(join(map, 'index.html'), pagina(), 'utf8');
console.log(`dist/${SLUG}/index.html geschreven (${WERK.length} blokken, ${REVIEW_IDS.length} beoordelingen, ${VRAGEN.length} vragen)`);
