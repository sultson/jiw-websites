// Stukken HTML die uit data.mjs komen. De pagina's in inhoud/ roepen ze aan
// met een <!--#naam--> op de plek waar het blok moet komen; bouw.mjs vult in.
import { existsSync } from 'node:fs';
import * as NL from './data.mjs';

// --- de actieve taal -------------------------------------------------------
// De blokken stonden eerst rechtstreeks op de Nederlandse data. Sinds de site
// ook in het Engels en het Duits bestaat komt die data uit het taalbestand dat
// bouw.mjs per versie inzet: D is de data, U zijn de losse schermteksten en
// BASIS is het pad waar die versie onder staat ('' voor nl, '/en', '/de').
// Een taal die iets niet overschrijft valt terug op het Nederlands, zodat een
// vergeten sleutel niet als 'undefined' op de pagina belandt.
let D = NL;
let U = {};
let BASIS = '';

export function zetTaal({ data = NL, ui = {}, basis = '' } = {}) {
  D = { ...NL, ...data };
  U = ui;
  BASIS = basis;
}

// Elke interne link in een blok moet onder de juiste taalmap blijven, anders
// stapt de bezoeker halverwege over naar het Nederlands.
export const link = pad => (pad === '/' ? (BASIS || '/') : BASIS + pad);

const pijl = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const speel = '<svg class="speel-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';

// Een logo op een witte tegel. De breedte volgt uit de opgemeten verhouding,
// niet uit een vaste maat: een kaal woordmerk (AIRBUS, 5,4:1) en een staand
// merkteken (SBS 6, 0,76:1) op dezelfde breedte zetten laat het ene logo vier
// keer zo groot lijken als het andere.
// Bewust geen loading="lazy". De logo's in de schuivende band staan voor de
// helft buiten beeld naar rechts, en een plaatje dat door een CSS-animatie in
// beeld schuift wordt niet betrouwbaar alsnog geladen - dan blijft er een gat
// in de band staan. Ze zijn samen ook maar ruim honderd kilobyte en staan
// boven de vouw, dus er valt niets te winnen met uitstellen.
function logoTegel(l, klasse = '') {
  const b = Math.round(l.hoogte * (l.verhouding || 1));
  return `<span class="logo-tegel ${klasse}${l.keerOm ? ' keer-om' : ''}">`
    + `<img src="${l.pad}" alt="${l.naam}" width="${b}" height="${l.hoogte}" decoding="async">`
    + `</span>`;
}

// Hun eigen studiofoto's (raw/fotos/, april 2023). Twee breedtes, allemaal
// 16:9, dus width/height staan er vast in en de pagina springt niet tijdens
// het laden. De eerste foto van de eerste ruimte is het enige beeld dat direct
// in beeld staat; de rest laadt lui.
export function foto({ bestand, alt }, { lui = true, maten = '(max-width: 900px) 100vw, 900px' } = {}) {
  return `<figure class="foto kader">
              <img src="/assets/fotos/${bestand}-1600.webp"
                   srcset="/assets/fotos/${bestand}-800.webp 800w, /assets/fotos/${bestand}-1600.webp 1600w"
                   sizes="${maten}" width="1600" height="900" alt="${alt}"${lui ? ' loading="lazy" decoding="async"' : ''}>
            </figure>`;
}

export const zenderRij = () => `
      <div class="zenders-rij">
        <span class="zenders-label">${U.uitgezondenOp}</span>
        <div class="zender-logos">
${D.ZENDERS.map(z => '          ' + logoTegel(z, 'zender')).join('\n')}
        </div>
      </div>`;

// De marquee met opdrachtgevers, direct onder de hero. De lijst staat er twee
// keer in: de band schuift precies de breedte van een helft op en springt dan
// terug, en omdat de tweede helft identiek is ziet niemand het terugspringen.
// aria-hidden op de kopie, anders leest een schermlezer elk merk dubbel voor.
export const klantMarquee = () => {
  const rij = D.KLANT_LOGOS.map(l => '        ' + logoTegel(l, 'klant')).join('\n');
  return `
      <div class="marquee" data-marquee>
        <div class="marquee-spoor">
          <div class="marquee-helft">
${rij}
          </div>
          <div class="marquee-helft" aria-hidden="true">
${rij}
          </div>
        </div>
      </div>`;
};

// De showreel in de zoeker. Bijna negen seconden, geknipt uit vier van hun eigen
// uitzendingen (zie LEESMIJ.md). Geen geluid, dus autoplay mag; muted+playsinline
// zijn allebei nodig anders weigert iOS. De poster is een echt beeld uit de
// reel, zodat er ook zonder video meteen iets staat.
//
// Twee bronnen per maat: webm voor wie het aankan, mp4 als terugval. De
// mediaquery in <source> kiest de kleine versie op de telefoon - 580 kB in
// plaats van 1,1 MB.
export const showreel = () => `
        <div class="zoeker heeft-reel">
          <video class="zoeker-video" autoplay muted loop playsinline preload="metadata"
                 poster="/assets/video/showreel-poster.webp"
                 aria-label="${U.showreelLabel(D.SHOWREEL)}">
            <source src="/assets/video/showreel-854.webm" type="video/webm" media="(max-width: 700px)">
            <source src="/assets/video/showreel-854.mp4" type="video/mp4" media="(max-width: 700px)">
            <source src="/assets/video/showreel-1280.webm" type="video/webm">
            <source src="/assets/video/showreel-1280.mp4" type="video/mp4">
          </video>
          <span class="zoeker-floers" aria-hidden="true"></span>
          <span class="zoeker-hoek lb"></span>
          <span class="zoeker-hoek rb"></span>
          <span class="zoeker-hoek lo"></span>
          <span class="zoeker-hoek ro"></span>
          <span class="zoeker-rec"><i></i>REC</span>
          <span class="zoeker-tc" data-tc>00:00:00:00</span>
          <button class="zoeker-pauze" type="button" data-reel-pauze aria-label="${U.showreelPauze}">
            <svg class="i-pauze" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5h3v14H8zM13 5h3v14h-3z"/></svg>
            <svg class="i-speel" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>
          </button>
        </div>`;

// Dezelfde showreel, maar nu van rand tot rand achter de hero. De markeringen
// liggen op de randen van het vlak zelf: je kijkt niet naar een zoeker, je
// kijkt erdoorheen. De drie lagen erboven (floers, scanlijnen, korrel) zijn
// geen effect maar noodzaak - het is bewegend televisiebeeld, dus er komt
// gegarandeerd een licht shot voorbij en wit op wit is onleesbaar.
export const filmBeeld = () => `
    <div class="film-beeld" aria-hidden="true">
      <video class="film-video" autoplay muted loop playsinline preload="metadata"
             poster="/assets/video/showreel-poster.webp">
        <source src="/assets/video/showreel-854.webm" type="video/webm" media="(max-width: 700px)">
        <source src="/assets/video/showreel-854.mp4" type="video/mp4" media="(max-width: 700px)">
        <source src="/assets/video/showreel-1280.webm" type="video/webm">
        <source src="/assets/video/showreel-1280.mp4" type="video/mp4">
      </video>
    </div>
    <span class="film-floers" aria-hidden="true"></span>
    <span class="film-scan" aria-hidden="true"></span>
    <span class="film-hoek lb" aria-hidden="true"></span>
    <span class="film-hoek rb" aria-hidden="true"></span>
    <span class="film-hoek lo" aria-hidden="true"></span>
    <span class="film-hoek ro" aria-hidden="true"></span>
    <span class="film-rec" aria-hidden="true"><i></i>REC</span>
    <span class="film-tc" data-tc aria-hidden="true">00:00:00:00</span>
    <button class="film-pauze" type="button" data-reel-pauze
            aria-label="${U.showreelPauzeLang(D.SHOWREEL)}">
      <svg class="i-pauze" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5h3v14H8zM13 5h3v14h-3z"/></svg>
      <svg class="i-speel" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>
    </button>`;

// Het formulier in de hero. Twee velden, meer niet. De rest komt pas na
// "Verder", en dan is er al iets ingevuld - dat laatste is het hele punt: wie
// twee velden invult maakt de tweede stap vaker af dan wie meteen zeven lege
// velden ziet. Stap twee staat met hidden in de pagina en niet alleen met
// display:none, zodat een schermlezer er niet per ongeluk in belandt.
export const snelform = () => `
        <div class="snelform" data-snelform>
          <form novalidate>
            <div class="snelform-kop">
              <h2>${U.sfKop}</h2>
              <span class="snelform-stap" data-stapnr>${U.sfStap}</span>
            </div>

            <div data-deel="1">
              <p class="snelform-melding" hidden data-melding></p>
              <div class="veld">
                <label for="sf-bedrijf">${U.vBedrijf}</label>
                <input id="sf-bedrijf" name="bedrijf" type="text" autocomplete="organization" required>
              </div>
              <div class="veld">
                <label for="sf-mail">${U.vMail}</label>
                <input id="sf-mail" name="email" type="email" autocomplete="email" required>
              </div>
              <button class="btn btn-primair btn-groot" type="button" data-verder>${U.sfVerder}${pijl}</button>
              <p class="snelform-noot">${U.sfNoot}</p>
            </div>

            <div data-deel="2" hidden>
              <div class="veld">
                <label for="sf-naam">${U.vNaam}</label>
                <input id="sf-naam" name="firstName" type="text" autocomplete="name" required>
              </div>
              <div class="veld">
                <label for="sf-tel">${U.vTel}</label>
                <input id="sf-tel" name="tel" type="tel" autocomplete="tel">
              </div>
              <div class="veld">
                <label for="sf-over">${U.vOver}</label>
                <select id="sf-over" name="onderwerp">
${U.sfOpties.map(o => `                  <option>${o}</option>`).join('\n')}
                </select>
              </div>
              <button class="btn btn-primair btn-groot" type="submit">${U.sfVerstuur}</button>
              <button class="snelform-terug" type="button" data-terug>${U.sfTerug}</button>
            </div>
          </form>
          <div class="snelform-dank">
            <h3 tabindex="-1">${U.sfDankKop}</h3>
            <p>${U.sfDank}</p>
          </div>
        </div>`;

// De video's van hun eigen kanaal. De kaart laadt alleen een plaatje; pas na
// een klik komt er een youtube-nocookie-insluiting in de plaats. Dat scheelt
// een stuk of vijf verzoeken naar Google per kaart op een pagina die iemand
// misschien alleen maar doorbladert.
export const videoGrid = (n = D.VIDEOS.length) => `
      <div class="videos">
${D.VIDEOS.slice(0, n).map(v => `        <button class="video-kaart kader" type="button" data-video="${v.id}" data-titel="${v.titel}">
          <span class="video-beeld">
            <img src="/assets/video/thumbs/${v.id}.webp" width="640" height="360" loading="lazy" decoding="async"
                 alt="${v.alt ?? U.beeldUit(v.titel)}">
            <span class="video-speel">${speel}</span>
            <span class="video-duur">${v.duur}</span>
          </span>
          <span class="video-tekst">
            <span class="video-bij">${v.bij}</span>
            <span class="video-titel">${v.titel}</span>
          </span>
        </button>`).join('\n')}
      </div>`;

// De branches van Puur Genieten. Anders dan videoGrid: dit zijn eigen
// bestanden en geen YouTube. De kaart laadt alleen het posterbeeld; pas na een
// klik komt er een <video> in de plaats, met autoplay omdat de bezoeker er net
// om vroeg. Een mp4 van een paar megabyte haal je niet ongevraagd op.
//
// Elke branche bestaat in twee beeldverhoudingen (zie maak-branches.mjs). De
// telefoon krijgt de staande clip van 720x1280, de desktop de liggende van
// 1280x720 - op verzoek van de klant, 18-10-2026. Het posterbeeld wisselt met
// een <picture>, dus zonder JavaScript en zonder dat de telefoon het brede
// beeld ophaalt; welke clip er na de klik komt kiest site.js met dezelfde
// grens (901px, zie style.css).
//
// Een branche zonder liggende versie krijgt `staand` als extra klasse. Die
// kaart blijft dan ook op de desktop rechtop staan, in een liggend kader met
// een vervaagde rand - wat er niet is kun je niet tonen, en een staande clip
// bijsnijden tot 16:9 zaagt de ondertitel eraf.
const BREED_BESTAND = (slug) =>
  existsSync(new URL(`./assets/video/branches/${slug}-breed.mp4`, import.meta.url));

const brancheKaart = (b, metRegel) => {
  const breed = BREED_BESTAND(b.slug);
  const poster = `/assets/video/branches/${b.slug}-poster.webp`;
  const posterBreed = `/assets/video/branches/${b.slug}-breed-poster.webp`;
  return `        <button class="video-kaart branche-kaart kader${breed ? '' : ' staand'}" type="button" data-clip="/assets/video/branches/${b.slug}.mp4"
                data-poster="${poster}"${breed ? `
                data-clip-breed="/assets/video/branches/${b.slug}-breed.mp4" data-poster-breed="${posterBreed}"` : ''}
                data-titel="${b.naam}">
          <span class="branche-beeld"${breed ? '' : ` style="--vul: url('${poster}')"`}>
            <picture>${breed ? `
              <source media="(min-width: 901px)" srcset="${posterBreed}" width="854" height="480">` : ''}
              <img src="${poster}" width="480" height="854" loading="lazy" decoding="async"
                   alt="${U.beeldBranche(b.naam)}">
            </picture>
            <span class="video-speel">${speel}</span>
            <span class="video-duur">${b.duur}</span>
          </span>
          <span class="video-tekst">
            <span class="video-titel">${b.naam}</span>${metRegel ? `
            <span class="branche-regel">${b.tekst}</span>` : ''}
          </span>
        </button>`;
};

export const branches = () => `
      <div class="branches">
${D.BRANCHES.map(b => brancheKaart(b, false)).join('\n')}
      </div>`;

// Dezelfde acht kaarten, maar met de regel van ons onder elke naam. Staat op
// precies een pagina: optie 1 van de landingspagina. Dat is de enige plek waar
// die regels nog mogen staan, want ze komen niet uit de brochure van de klant
// (zie data.mjs bij BRANCHES en LEESMIJ.md). Een eigen blok en geen vlaggetje
// op `branches`, omdat een blok geen argumenten kent - en omdat je in de
// pagina dan kunt zien welke van de twee er staat.
export const branchesVol = () => `
      <div class="branches">
${D.BRANCHES.map(b => brancheKaart(b, true)).join('\n')}
      </div>`;

// De keuzelijst voor het aanmeldformulier op de landingspagina. Hun eigen
// formulier had hier een leeg tekstveld; een vaste lijst voorkomt dat de
// bezoeker moet gokken hoe wij een branche noemen.
//
// Stond eerst op D.BRANCHES (de acht kaarten met een voorbeeldfilm). Sinds de
// brochure van 10-10-2026 komt hij uit D.PG_CATEGORIEEN: dat zijn de tien
// categorieen die de klant zelf verkoopt, en die lijst is breder dan de acht
// films. De laatste optie blijft open - hun eigen brochure zegt er zelf bij
// dat andere branches ook kunnen.
export const brancheOpties = () => [
  `              <option value="">${U.kiesBranche}</option>`,
  ...D.PG_CATEGORIEEN.map(c => `              <option>${c}</option>`),
  `              <option>${U.brancheAnders}</option>`,
].join('\n');

// Twee losse regels uit de brochure. Ze staan als blok en niet in de pagina
// zelf, omdat ze per taal uit het taalbestand moeten komen.
export const pgKijker = () => D.PG_KIJKER;
export const pgAnders = () => D.PG_ANDERS;

// De tien categorieen uit de brochure, plus de regel dat andere branches ook
// kunnen. Twee kolommen, net als in hun pdf.
export const pgCategorieen = () => `
      <ul class="vink">
${D.PG_CATEGORIEEN.map(c => `        <li>${c}</li>`).join('\n')}
      </ul>`;

export const pgOpbrengst = () => `
        <ul class="vink">
${D.PG_OPBRENGST.map(i => `          <li>${i}</li>`).join('\n')}
        </ul>`;

export const pgGebruik = () => `
        <ul class="vink">
${D.PG_GEBRUIK.map(i => `          <li>${i}</li>`).join('\n')}
        </ul>`;

// Het item uit Puur Genieten dat op de landingspagina staat, een kaart breed
// in plaats van vier op een rij. Zelfde kaart en dus dezelfde klik-naar-
// insluiting als in videoGrid; alleen de maat is anders.
export const pgVideo = () => {
  const v = D.VIDEOS.find(x => x.id === 'deTdhbPWHEw');
  if (!v) throw new Error('pgVideo: het Puur Genieten-item staat niet meer in D.VIDEOS');
  return `
      <div class="videos videos-een">
        <button class="video-kaart kader" type="button" data-video="${v.id}" data-titel="${v.titel}">
          <span class="video-beeld">
            <img src="/assets/video/thumbs/${v.id}.webp" width="640" height="360" loading="lazy" decoding="async"
                 alt="${v.alt ?? U.beeldUit(v.titel)}">
            <span class="video-speel">${speel}</span>
            <span class="video-duur">${v.duur}</span>
          </span>
          <span class="video-tekst">
            <span class="video-bij">${v.bij}</span>
            <span class="video-titel">${v.titel}</span>
          </span>
        </button>
      </div>`;
};

// Het rondje van Puur Genieten. Het aangeleverde bestand is een jpg met witte
// hoeken om een cirkel die precies tot de rand loopt, dus de hoeken gaan er in
// de css af (border-radius) in plaats van met een uitsnede - dan blijft de
// rand netjes glad op elk scherm.
export const puurGenietenLogo = () => `
      <img class="pg-logo" src="/assets/logo-puur-genieten.webp" width="240" height="241"
           loading="lazy" decoding="async" alt="${U.pgLogoAlt}">`;

// Maatschets per ruimte, op schaal getekend uit hun eigen afmetingen. Een
// gewone <svg> en geen plaatje, want dan schaalt de tekst mee en blijft het
// scherp. De schaal is voor alle vier gelijk (zelfde meter-per-eenheid), dus
// de rechthoeken zijn onderling te vergelijken - dat is het hele punt.
export const maatschetsen = () => {
  const maxB = Math.max(...D.MATEN.map(m => m.b));
  const maxD = Math.max(...D.MATEN.map(m => m.d));
  const PX = 15.5;                                  // beeldpunten per meter
  const RAND = 30;                                  // ruimte voor de maatlijnen
  const vbB = Math.round(maxB * PX + RAND * 2);
  const vbH = Math.round(maxD * PX + RAND * 2);
  return `
      <div class="schetsen">
${D.MATEN.map(m => {
    const w = m.b * PX, h = m.d * PX;
    const x = RAND, y = RAND + (maxD * PX - h);     // op de grondlijn uitlijnen
    const fmt = n => n.toFixed(2).replace('.', ',');
    return `        <figure class="schets">
          <svg viewBox="0 0 ${vbB} ${vbH}" role="img" aria-label="${U.schetsLabel(m, fmt)}">
            <rect class="s-vlak" x="${x}" y="${y}" width="${w.toFixed(1)}" height="${h.toFixed(1)}"/>
            <line class="s-maat" x1="${x}" y1="${(y + h + 13).toFixed(1)}" x2="${(x + w).toFixed(1)}" y2="${(y + h + 13).toFixed(1)}"/>
            <line class="s-tik" x1="${x}" y1="${(y + h + 9).toFixed(1)}" x2="${x}" y2="${(y + h + 17).toFixed(1)}"/>
            <line class="s-tik" x1="${(x + w).toFixed(1)}" y1="${(y + h + 9).toFixed(1)}" x2="${(x + w).toFixed(1)}" y2="${(y + h + 17).toFixed(1)}"/>
            <text class="s-tekst" x="${(x + w / 2).toFixed(1)}" y="${(y + h + 27).toFixed(1)}" text-anchor="middle">${fmt(m.b)} m</text>
            <line class="s-maat" x1="${(x - 13)}" y1="${y.toFixed(1)}" x2="${(x - 13)}" y2="${(y + h).toFixed(1)}"/>
            <line class="s-tik" x1="${(x - 17)}" y1="${y.toFixed(1)}" x2="${(x - 9)}" y2="${y.toFixed(1)}"/>
            <line class="s-tik" x1="${(x - 17)}" y1="${(y + h).toFixed(1)}" x2="${(x - 9)}" y2="${(y + h).toFixed(1)}"/>
            <text class="s-tekst" x="${(x - 19)}" y="${(y + h / 2).toFixed(1)}" text-anchor="middle"
                  transform="rotate(-90 ${(x - 19)} ${(y + h / 2).toFixed(1)})">${fmt(m.d)} m</text>
          </svg>
          <figcaption><b>${m.naam}</b><span>${(m.b * m.d).toFixed(0)} m&sup2; &middot; ${U.mHoog(fmt(m.h))}</span></figcaption>
        </figure>`;
  }).join('\n')}
      </div>
      <p class="schets-noot">${U.schetsNoot}</p>`;
};

// Het signaalpad in Regie A, uit hun eigen specificaties. Hun tekst noemt alle
// onderdelen los; naast elkaar met pijlen ertussen zie je in een blik hoe het
// loopt. Een <svg> met <text>, dus de schermlezer leest gewoon mee.
export const signaalketen = () => {
  // VAK/STAP moeten ruim genoeg zijn voor het langste label
  // ("Zendlijnprocessing", 18 tekens). Te krap en de tekst loopt de rechthoek
  // uit - een <text> in een <svg> breekt niet af en wordt ook niet afgekapt.
  const VAK = 138, STAP = 170, X0 = 10;
  const stops = U.ketenBeeld;
  const audio = U.ketenGeluid;
  const rij = (items, y, kleur) => items.map((it, i) => {
    const x = X0 + i * STAP;
    return `          <g>
            <rect x="${x}" y="${y}" width="${VAK}" height="54" rx="3" class="k-vak ${kleur}"/>
            ${it[0] ? `<text x="${x + 11}" y="${y + 21}" class="k-aantal">${it[0]}</text>` : ''}
            <text x="${x + 11}" y="${y + (it[0] ? 39 : 32)}" class="k-naam">${it[1]}</text>
          </g>${i < items.length - 1 ? `
          <path d="M${x + VAK + 6} ${y + 27}h${STAP - VAK - 14}" class="k-pijl" marker-end="url(#kpunt)"/>` : ''}`;
  }).join('\n');
  const breed = X0 * 2 + VAK + STAP * 3;
  return `
      <figure class="keten">
        <svg viewBox="0 0 ${breed} 172" role="img" aria-label="${U.ketenLabel}">
          <defs>
            <marker id="kpunt" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0l8 4-8 4z" class="k-punt"/>
            </marker>
          </defs>
          <text x="${X0}" y="12" class="k-rij">${U.ketenRijBeeld}</text>
${rij(stops, 20, 'beeld')}
          <text x="${X0}" y="100" class="k-rij">${U.ketenRijGeluid}</text>
${rij(audio, 108, 'geluid')}
        </svg>
      </figure>`;
};

// Vectorscope en waveform, getekend op een canvas. Hun eigen tekst bij Regie A
// zegt dat het videosignaal met een vectorscope wordt gemeten en dat het
// geluidsniveau nauwkeurig wordt gemeten - dit is dat, in beeld. De tekening
// zelf zit in site.js; hier staat alleen het haakje plus een beschrijving voor
// wie het canvas niet ziet.
export const meters = () => `
      <figure class="meters" data-meters>
        <div class="meter">
          <span class="meter-kop">Vectorscope</span>
          <canvas data-scope width="260" height="260" role="img"
                  aria-label="${U.scopeLabel}"></canvas>
        </div>
        <div class="meter meter-breed">
          <span class="meter-kop">${U.meterWave}</span>
          <canvas data-wave width="520" height="260" role="img"
                  aria-label="${U.waveLabel}"></canvas>
        </div>
      </figure>`;

export const cijfers = () => `
      <div class="cijfers">
${D.CIJFERS.map(c => `        <div class="cijfer"><b>${c.getal}</b><span>${c.label}</span></div>`).join('\n')}
      </div>`;

export const routes = () => `
      <div class="routes">
${D.ROUTES.map(r => `        <a class="route kader" href="${r.href || link(`/${r.slug}`)}">
          <span class="route-nr">${r.nr}</span>
          <h3>${r.titel}</h3>
          <p>${r.zin}</p>
          <ul>
${r.punten.map(p => `            <li>${p}</li>`).join('\n')}
          </ul>
          <span class="route-meer">${r.kort} ${pijl}</span>
        </a>`).join('\n')}
      </div>`;

// De koppen gaan mee als data-kop, want onder 680px wordt de tabel een stapel
// kaartjes en dan moet elke cel zijn eigen kop meenemen.
export const vergelijking = () => `
      <div class="vgl-wrap">
        <table class="vgl">
          <thead>
            <tr>
              <th scope="col"><span class="visueel-verborgen">${U.vglOnderdeel}</span></th>
${D.VERGELIJKING.kolommen.map(k => `              <th scope="col">${k}</th>`).join('\n')}
            </tr>
          </thead>
          <tbody>
${D.VERGELIJKING.rijen.map(([label, a, b]) => `            <tr>
              <th scope="row">${label}</th>
              <td data-kop="${D.VERGELIJKING.kolommen[0]}">${a}</td>
              <td data-kop="${D.VERGELIJKING.kolommen[1]}">${b}</td>
            </tr>`).join('\n')}
          </tbody>
        </table>
      </div>`;

const stappenLijst = rij => `
      <div class="stappen">
${rij.map(s => `        <div class="stap">
          <span class="stap-nr">${s.nr}</span>
          <h3>${s.titel}</h3>
          <p>${s.tekst}</p>
        </div>`).join('\n')}
      </div>`;

export const stappen = () => stappenLijst(D.STAPPEN);

// Twee keer uitzenden is iets van Puur Genieten, niet van branded content in
// het algemeen (Armando, 12-10-2026). Daarom staat die belofte alleen in de
// pg-variant van deze drie blokken; de gewone versie zegt alleen dat het item
// wordt uitgezonden en laat het aantal keren open.
export const stappenPg = () =>
  stappenLijst(D.STAPPEN.map(s => (s.nr === D.STAP_UITZENDING_PG.nr ? { ...s, ...D.STAP_UITZENDING_PG } : s)));

const vinkLijst = rij => `
        <ul class="vink">
${rij.map(i => `          <li>${i}</li>`).join('\n')}
        </ul>`;

export const inbegrepen = () => vinkLijst(D.INBEGREPEN);

export const inbegrepenPg = () => vinkLijst([...D.INBEGREPEN, D.INBEGREPEN_UITZENDING_PG]);

// Staat er een woord in plaats van een bedrag ('Op aanvraag' bij 5 minuten),
// dan krijgt dat dezelfde kleinere maat als bij de lange items - een woord in
// de prijsmaat van een getal loopt over zijn kaart heen.
//
// De zendtijdregel tussen de prijs en de kleine regel eronder zegt dat je het
// dubbele aan zendtijd krijgt, want het item gaat op zaterdag en op zondag de
// lucht in. Dat geldt bij Puur Genieten en niet bij branded content in het
// algemeen (Armando, 12-10-2026), dus die regel staat alleen in tariefkaarten
// op de pg-pagina.
const tariefKaarten = (zendtijd = false) => `
      <div class="tarieven">
${D.TARIEVEN.map(t => `        <div class="tarief${t.uitgelicht ? ' uit' : ''}">
          ${t.uitgelicht ? `<span class="tarief-vlag">${U.meestGekozen}</span>` : ''}
          <span class="tarief-duur">${t.duur}</span>
          <span class="tarief-prijs${/^\d/.test(t.prijs) ? '' : ' tarief-prijs-woord'}">${t.prijs}</span>
          ${zendtijd ? `<span class="tarief-zendtijd">${t.zendtijd}</span>` : ''}
          <span class="tarief-bij">${t.bij}</span>
        </div>`).join('\n')}
      </div>`;

export const tarieven = () => tariefKaarten(false);
export const tarievenPg = () => tariefKaarten(true);

// Hier staat sinds 11-10-2026 geen bedrag maar een woord ('Op aanvraag'), en
// een woord in de prijsmaat van een getal wordt een regel die over zijn kaart
// heen loopt. Vandaar de eigen klasse, die hem een maat kleiner zet.
export const tarievenGroot = () => `
      <div class="kaarten k2">
${D.TARIEVEN_GROOT.map(t => `        <div class="tarief">
          <span class="tarief-duur">${U.allIn} ${t.duur}</span>
          <span class="tarief-prijs tarief-prijs-woord">${t.prijs}</span>
          <span class="tarief-bij">${t.bij}</span>
        </div>`).join('\n')}
      </div>`;

export const extras = () => `
      <div class="extras">
${D.EXTRAS.map(e => `        <div class="extra">
          <span class="extra-naam">${e.naam}</span>
          <span class="extra-bij">${e.bij}</span>
          <span class="extra-prijs">${e.prijs}</span>
        </div>`).join('\n')}
      </div>`;

export const studioAnkers = () => `
      <div class="ankers">
${D.RUIMTES.map(r => `        <a href="#${r.slug}">${r.naam}</a>`).join('\n')}
      </div>`;

export const ruimtes = () => D.RUIMTES.map((r, i) => `
      <article class="ruimte" id="${r.slug}">
        <div class="ruimte-kop">
          <div>
            <span class="ruimte-type">${r.type}</span>
            <h2>${r.naam}</h2>
          </div>
          <div><p>${r.zin}</p></div>
        </div>
${r.fotos?.length ? `
        <div class="ruimte-fotos${r.fotos.length > 1 ? ' twee' : ''}">
          ${r.fotos.map((f, j) => foto(f, {
            lui: !(i === 0 && j === 0),
            maten: r.fotos.length > 1 ? '(max-width: 900px) 100vw, 580px' : '(max-width: 1220px) 100vw, 1180px',
          })).join('\n          ')}
        </div>` : ''}

        <dl class="specs">
${r.kerncijfers.map(([k, v]) => `          <div class="spec"><dt>${k}</dt><dd>${v}</dd></div>`).join('\n')}
        </dl>

        <div class="ruimte-body">
          <div>
            <h4>${U.inbegrepen}</h4>
${r.inbegrepen.length ? `            <ul class="vink">
${r.inbegrepen.map(i => `              <li>${i}</li>`).join('\n')}
            </ul>` : ''}
          </div>
          <div class="blokken">
${r.blokken.map(b => `            <div class="blok">
              <h4>${b.kop}</h4>
              <p>${b.tekst}</p>
            </div>`).join('\n')}
          </div>
        </div>
      </article>`).join('\n');

// De hero draagt weer het insigne, dus stond er op de startpagina geen enkele
// foto meer. Hun eigen Studio A staat nu hier: eerst het woord, dan het bewijs,
// met een doorverwijzing naar het specificatieblad.
export const studioband = () => `
      <div class="studioband">
        ${foto(D.RUIMTES[0].fotos[0], { maten: '(max-width: 900px) 100vw, 640px' })}
        <div>
          <p class="kicker">${U.sbKicker}</p>
          <h2>${U.sbKop}</h2>
          <p>${U.sbTekst}</p>
          <div class="knoppen" style="margin-top:1.6rem">
            <a class="btn btn-rand" href="${link('/studio')}">${U.sbKnop}</a>
          </div>
        </div>
      </div>`;

export const opRtl4 = () => `
      <div class="namen">
${D.OP_RTL4.map(f => `        <span>${f}</span>`).join('\n')}
      </div>`;

export const eigenFormats = () => `
      <div class="kaarten k3">
${D.EIGEN_FORMATS.map(f => `        <article class="kaart kader">
          <span class="kaart-bij">${f.bij}</span>
          <h3>${f.naam}</h3>
          <p>${f.tekst}</p>
        </article>`).join('\n')}
      </div>`;

export const eerder = () => `
      <div class="pillen">
${D.EERDER.map(f => `        <span>${f}</span>`).join('\n')}
      </div>`;

export const referenties = () => `
      <div class="namen">
${D.REFERENTIES.map(r => `        <span>${r}</span>`).join('\n')}
      </div>`;

export const vragen = () => `
      <div class="vragen">
${D.VRAGEN.map(q => `        <details>
          <summary>${q.v}</summary>
          <div class="antwoord">${q.a}</div>
        </details>`).join('\n')}
      </div>`;

// Alles wat bouw.mjs kan invullen. Sleutel = <!--#sleutel--> in de pagina.
export const BLOKKEN = {
  zenderRij, klantMarquee, showreel, filmBeeld, snelform, videoGrid, branches, branchesVol, puurGenietenLogo,
  brancheOpties, pgVideo, pgKijker, pgAnders, pgCategorieen, pgOpbrengst, pgGebruik,
  maatschetsen, signaalketen, meters,
  cijfers, routes, vergelijking, stappen, stappenPg, inbegrepen, inbegrepenPg,
  tarieven, tarievenPg, tarievenGroot, extras, studioAnkers, ruimtes, studioband,
  opRtl4, eigenFormats, eerder, referenties, vragen,
  videoGridKort: () => videoGrid(6),
};
