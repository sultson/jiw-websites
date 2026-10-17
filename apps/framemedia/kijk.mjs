// Loopt elke pagina na op desktop en telefoon: consolefouten, mislukte
// requests, kapotte afbeeldingen, overlopende breedte, knopcontrast, en het
// gedrag van de meebewegende balk. Screenshots in shots/.
//
//   node kijk.mjs                       -> tegen het live adres
//   node kijk.mjs http://localhost:4174 -> tegen de lokale proefserver
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = process.argv[2] || 'https://www.framemedia.tv';

// De site had tot 11-10-2026 een donkere en een lichte weergave en liep deze
// ronde twee keer, met ?thema= in het adres. De klant heeft definitief voor
// donker gekozen, dus er is nog een weergave en een ronde.
const adres = route => `${BASE}${route}`;
// Alle drie de talen erin. De Engelse en Duitse versie hebben hun eigen
// bestandsnamen, dus ze moeten hier los staan - een taalmap die je vergeet
// wordt stil niet gemeten en dan meldt het script nul fouten over een pagina
// die het nooit heeft opgevraagd. Zo ging het eerder al mis met
// /voorwaarden.html, die er vier uur op stond zonder ooit gemeten te zijn.
// De adressen staan hier zonder .html, net als in de links, de canonicals en
// de sitemap (sinds 17-10-2026). Met .html erachter stuurt Workers assets een
// 307 naar hetzelfde adres zonder, en dan meet dit script de pagina na een
// omleiding in plaats van op het adres dat we zelf publiceren.
const PAGINAS = [
  '/', '/branded-content', '/studio', '/formats',
  '/over-ons', '/contact', '/puurgenieten/',
  '/programma-idee/', '/vacature', '/voorwaarden', '/404.html',
  '/en/', '/en/branded-content', '/en/studio',
  '/en/about-us', '/en/contact', '/en/puur-genieten/',
  '/de/', '/de/branded-content', '/de/studio',
  '/de/ueber-uns', '/de/kontakt', '/de/puur-genieten/',
];

// VASTIP=<ip> omzeilt de naamserver, voor als de eigen router een net
// aangemaakt subdomein nog als niet-bestaand in de cache heeft staan.
const VASTIP = process.env.VASTIP;
const host = new URL(BASE).hostname;

mkdirSync('shots', { recursive: true });
const b = await chromium.launch(
  VASTIP ? { args: [`--host-resolver-rules=MAP ${host} ${VASTIP}`] } : {}
);

let fouten = 0;
let metingen = 0;
const links = new Set();
const fout = (waar, wat) => { console.log(`  FOUT  ${waar}: ${wat}`); fouten++; };

// --- contrast --------------------------------------------------------------
const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ontleed = s => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
function contrast(voor, achter) {
  const a = lum(ontleed(voor)), b2 = lum(ontleed(achter));
  return (Math.max(a, b2) + 0.05) / (Math.min(a, b2) + 0.05);
}

for (const [tag, w, h, mobiel] of [['desk', 1440, 900, false], ['mob', 390, 844, true]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });

  for (const route of PAGINAS) {
    const p = await ctx.newPage();
    const consoleFouten = [];
    const mislukt = [];
    // Chromium meldt af en toe zelf "compute-pressure is not allowed in this
    // document". Dat komt niet uit de pagina maar uit de browser, hij komt
    // willekeurig op, en hij liet de ronde dus om de zoveel keer zakken op
    // iets wat niemand kan repareren.
    p.on('console', m => {
      if (m.type() !== 'error') return;
      if (/compute-pressure is not allowed/.test(m.text())) return;
      consoleFouten.push(m.text());
    });
    p.on('pageerror', e => consoleFouten.push('pageerror: ' + e.message));
    // De speler van YouTube houdt na de klik verbindingen open (telemetrie,
    // segmenten). Sluiten wij de pagina, dan worden die afgebroken en dat
    // meldt Chromium als ERR_ABORTED. Dat is onze eigen controle die opruimt,
    // geen fout op de pagina - dus niet meetellen. Een echte statuscode van
    // 400 of hoger van YouTube telt wel gewoon mee.
    //
    // Onze eigen film loopt tegen hetzelfde aan, maar alleen live: de showreel
    // en de signaallus zijn een halve megabyte en worden in stukken opgehaald,
    // dus bij het sluiten staat er nog een stuk open. Lokaal is dat binnen een
    // oogwenk klaar en zie je het nooit, over het net wel - en dan meldt hij
    // een fout die er geen is. Een bestand dat echt weg is geeft geen afbreking
    // maar een 404, en die telt hieronder gewoon mee.
    const eigenOpruiming = u =>
      /youtube|ytimg|ggpht/.test(u) || /\.(mp4|webm)(\?|$)/.test(u);
    p.on('requestfailed', r => {
      const waarom = r.failure()?.errorText || '';
      if (waarom === 'net::ERR_ABORTED' && eigenOpruiming(r.url())) return;
      mislukt.push(`${r.url()} (${waarom})`);
    });
    p.on('response', r => { if (r.status() >= 400) mislukt.push(`${r.url()} -> ${r.status()}`); });

    const naam = `${tag}_${route.replace(/[/.]/g, '_') || 'home'}`;
    console.log(`${tag} ${route}`);

    const res = await p.goto(adres(route), { waitUntil: 'networkidle', timeout: 45000 });
    metingen++;
    if (!res || res.status() >= 400) fout(route, `status ${res?.status()}`);

    // --- interne links verzamelen -------------------------------------------
    if (!mobiel) {
      for (const href of await p.$$eval('a[href]', as => as.map(a => a.getAttribute('href')))) {
        if (href && !/^(https?:|mailto:|tel:|#)/.test(href)) links.add(href.split('#')[0]);
      }
    }

    // --- kapotte afbeeldingen ------------------------------------------------
    // Eerst de pagina doorlopen, anders staan de studiofoto's met
    // loading="lazy" nog op complete=false en telt elke foto onder de vouw
    // hier als kapot. Daarna weer naar boven, want de controles hierna gaan
    // uit van een pagina die bovenaan staat.
    await p.evaluate(async () => {
      const stap = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += stap) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await p.waitForLoadState('networkidle');

    const kapot = await p.$$eval('img', is => is
      .filter(i => !i.complete || i.naturalWidth === 0)
      .map(i => i.getAttribute('src')));
    metingen++;
    if (kapot.length) fout(route, `kapotte afbeelding: ${kapot.join(', ')}`);

    // --- horizontaal scrollen ------------------------------------------------
    const over = await p.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    metingen++;
    if (over > 1) {
      const boosdoeners = await p.evaluate(() => {
        const max = document.documentElement.clientWidth;
        return [...document.querySelectorAll('*')]
          .filter(e => e.getBoundingClientRect().right > max + 1)
          .slice(0, 4)
          .map(e => e.tagName.toLowerCase() + (e.className ? '.' + String(e.className).split(' ')[0] : ''));
      });
      fout(route, `${over}px te breed (${boosdoeners.join(', ')})`);
    }

    // --- roosters zonder grijs gat -------------------------------------------
    // De roosters trokken hun lijnen ooit met een gat van 1px over een
    // lijnkleurige ondergrond. Zodra de laatste rij niet vol was bleef daar
    // een grijs vlak staan. De lijn hoort nu op de tegel te liggen, dus de
    // ondergrond van het rooster moet doorzichtig zijn en elke tegel moet
    // zijn ring hebben - anders vallen alle scheidslijnen stil weg.
    const roosters = await p.$$eval(
      '.namen, .specs, .stappen, .cijfers, .extras',
      els => els.map(e => {
        const eigen = getComputedStyle(e).backgroundColor;
        const tegels = [...e.children].map(k => getComputedStyle(k).boxShadow);
        return {
          klasse: String(e.className).split(' ')[0],
          eigen,
          zonderRing: tegels.filter(s => !s || s === 'none').length,
          aantal: tegels.length,
        };
      }));
    for (const r of roosters) {
      metingen++;
      if (r.eigen !== 'rgba(0, 0, 0, 0)' && r.eigen !== 'transparent') {
        fout(route, `rooster .${r.klasse} heeft zelf een achtergrond (${r.eigen}) - grijs gat bij een halve rij`);
      }
      metingen++;
      if (r.zonderRing) fout(route, `rooster .${r.klasse}: ${r.zonderRing} van ${r.aantal} tegels zonder scheidslijn`);
    }

    // --- knopcontrast --------------------------------------------------------
    // Alle zichtbare knoppen, tegen hun eigen achtergrond. WCAG AA wil 4,5:1
    // voor gewone tekst; knoptekst hier is 0,93rem dus gewone tekst.
    const knoppen = await p.$$eval('.btn', els => els.map(e => {
      const s = getComputedStyle(e);
      let ouder = e, achter = s.backgroundColor;
      while (ouder && (achter === 'rgba(0, 0, 0, 0)' || achter === 'transparent')) {
        ouder = ouder.parentElement;
        if (!ouder) { achter = 'rgb(13, 17, 23)'; break; }
        achter = getComputedStyle(ouder).backgroundColor;
      }
      return { tekst: e.textContent.trim().slice(0, 28), voor: s.color, achter, zichtbaar: e.offsetParent !== null };
    }));
    for (const k of knoppen.filter(k => k.zichtbaar)) {
      metingen++;
      const c = contrast(k.voor, k.achter);
      if (c < 4.5) fout(route, `knop "${k.tekst}" contrast ${c.toFixed(2)}:1`);
    }

    // --- lopende tekst -------------------------------------------------------
    // De drempel hangt af van de maat: WCAG AA wil 4,5:1 voor gewone tekst maar
    // 3:1 voor grote tekst (>=24px, of >=18,66px vet). Zonder dat onderscheid
    // valt elk groot cijfer ten onrechte om.
    // De kaarttitels staan in een <span> en vielen daardoor buiten deze meting.
    // Dat is precies waar het op 10-10-2026 misging: de branchekaarten kregen
    // alleen hun eigen klasse en niet .video-kaart, dus stond er witte tekst op
    // de grijze knopkleur van de browser en zei dit script nul fouten.
    // De oude bovengrens van 60 elementen was de tweede helft van hetzelfde
    // probleem: de startpagina zat daar al overheen, dus nieuwe blokken werden
    // sowieso niet meer gemeten.
    const teksten = await p.$$eval(
      'p, li, dd, dt, .antwoord, .video-titel, .video-bij, .branche-regel, .video-duur',
      els => els.slice(0, 250).map(e => {
      const s = getComputedStyle(e);
      let ouder = e, achter = s.backgroundColor;
      while (ouder && (achter === 'rgba(0, 0, 0, 0)' || achter === 'transparent')) {
        ouder = ouder.parentElement;
        if (!ouder) { achter = 'rgb(13, 17, 23)'; break; }
        achter = getComputedStyle(ouder).backgroundColor;
      }
      const px = parseFloat(s.fontSize);
      const vet = parseInt(s.fontWeight, 10) >= 700;
      return {
        voor: s.color, achter, px, groot: px >= 24 || (vet && px >= 18.66),
        tekst: e.textContent.trim().slice(0, 22), zichtbaar: e.offsetParent !== null,
      };
    }));
    for (const t of teksten.filter(t => t.zichtbaar && t.tekst)) {
      metingen++;
      const c = contrast(t.voor, t.achter);
      const drempel = t.groot ? 3 : 4.5;
      if (c < drempel) {
        fout(route, `tekst "${t.tekst}" contrast ${c.toFixed(2)}:1 (${Math.round(t.px)}px, moet ${drempel})`);
      }
    }

    // --- de meebewegende balk op de telefoon ---------------------------------
    // Hier wordt niet een losse scrollpositie getoetst maar de afspraak zelf:
    // de balk hoort zichtbaar te zijn precies wanneer je de hero voorbij bent
    // EN er geen echte actie in beeld staat. Dat is per pagina anders - op
    // contact vult het formulier het halve scherm - dus een vaste positie
    // afvinken zou op de ene pagina terecht en op de andere onterecht klagen.
    if (mobiel && route !== '/404.html') {
      const toestand = () => p.evaluate(() => {
        const el = document.querySelector('.mobiel-cta');
        if (!el) return null;
        const echte = [...document.querySelectorAll('.cta-band, .form-kaart, .site-footer')];
        const h = window.innerHeight;
        const inBeeld = echte.some(e => {
          const r = e.getBoundingClientRect();
          return r.top < h && r.bottom > 0;
        });
        return {
          zichtbaar: el.classList.contains('zichtbaar'),
          opScherm: el.getBoundingClientRect().top < h - 10,
          hoort: window.scrollY > h * 0.6 && !inBeeld,
        };
      });

      const hoogte = await p.evaluate(() => document.body.scrollHeight);
      for (const y of [0, hoogte * 0.25, hoogte * 0.5, hoogte * 0.75, hoogte]) {
        await p.evaluate(v => window.scrollTo(0, v), y);
        await p.waitForTimeout(350);
        const t = await toestand();
        metingen++;
        if (t.zichtbaar !== t.hoort) {
          fout(route, `balk ${t.zichtbaar ? 'staat er' : 'staat er niet'} op ${Math.round(y)}px, hoort ${t.hoort ? 'wel' : 'niet'}`);
        }
        metingen++;
        if (t.zichtbaar !== t.opScherm) fout(route, `balk-klasse en positie lopen uiteen op ${Math.round(y)}px`);
      }

      // En op de bodem mag hij de onderste regel van de voettekst niet afdekken.
      const dekt = await p.evaluate(() => {
        const balk = document.querySelector('.mobiel-cta');
        const regel = document.querySelector('.foot-onder');
        if (!balk || !regel || !balk.classList.contains('zichtbaar')) return false;
        const b = balk.getBoundingClientRect(), r = regel.getBoundingClientRect();
        return b.top < r.bottom && b.bottom > r.top;
      });
      metingen++;
      if (dekt) fout(route, 'balk dekt de onderste voetregel af');
      await p.evaluate(() => window.scrollTo(0, 0));
      await p.waitForTimeout(200);
    }

    // --- menu op de telefoon --------------------------------------------------
    if (mobiel && route !== '/404.html') {
      await p.click('.nav-toggle');
      await p.waitForTimeout(350);
      metingen++;
      const menuOpen = await p.evaluate(() => {
        const n = document.querySelector('.nav');
        return n && n.getBoundingClientRect().top >= -5;
      });
      if (!menuOpen) fout(route, 'menu opent niet');
      await p.click('.nav-toggle');
      await p.waitForTimeout(300);
    }

    // --- ankers ---------------------------------------------------------------
    // Elke #link op deze pagina moet bestaan en na het springen vrij van de
    // vastgezette menubalk staan. Zonder scroll-margin-top landt een anker
    // eronder en lijkt de kop weggevallen.
    const ankers = await p.$$eval('a[href^="#"]', as => as
      .map(a => a.getAttribute('href')).filter(h => h && h.length > 1));
    for (const anker of [...new Set(ankers)]) {
      metingen++;
      const uitkomst = await p.evaluate(id => {
        const doel = document.querySelector(id);
        if (!doel) return { bestaat: false };
        doel.scrollIntoView();
        const balk = document.querySelector('.site-header');
        const onder = balk && getComputedStyle(balk).position === 'sticky'
          ? balk.getBoundingClientRect().bottom : 0;
        return { bestaat: true, top: doel.getBoundingClientRect().top, onder };
      }, anker);
      if (!uitkomst.bestaat) { fout(route, `anker ${anker} bestaat niet`); continue; }
      if (uitkomst.top < uitkomst.onder - 1) {
        fout(route, `anker ${anker} landt ${Math.round(uitkomst.onder - uitkomst.top)}px onder de menubalk`);
      }
    }
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(150);

    // --- logotegels -----------------------------------------------------------
    // Niet alleen "is het bestand geladen" maar ook "staat er iets zichtbaars
    // op de tegel". Een SVG met alleen een witte vulling laadt prima en is op
    // een witte tegel toch onzichtbaar - dat is precies wat er bij Febo en
    // Culimaat misging. Daarom wordt de tegel uitgelezen en geteld hoeveel
    // beeldpunten er van wit afwijken.
    const tegels = await p.$$eval('.logo-tegel img', imgs => imgs.map(i => ({
      src: i.getAttribute('src'),
      klaar: i.complete && i.naturalWidth > 0,
      b: Math.round(i.getBoundingClientRect().width),
      h: Math.round(i.getBoundingClientRect().height),
    })));
    for (const t of tegels) {
      metingen++;
      if (!t.klaar) fout(route, `logo laadt niet: ${t.src}`);
      else if (t.b < 8 || t.h < 8) fout(route, `logo is ${t.b}x${t.h}px: ${t.src}`);
    }
    if (tegels.length) {
      metingen++;
      const leeg = await p.evaluate(async () => {
        const uit = [];
        for (const tegel of document.querySelectorAll('.logo-tegel')) {
          const img = tegel.querySelector('img');
          if (!img?.complete || !img.naturalWidth) continue;
          const c = document.createElement('canvas');
          c.width = 60; c.height = 30;
          const ctx = c.getContext('2d');
          // Wit eronder, want dat is de tegel. Wat daarna nog wit is, is niets.
          ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 60, 30);
          // Het omkeerfilter staat op de <img>, niet op de tegel eromheen.
          // Las je het van de tegel af, dan meet je Febo zonder zijn filter en
          // meldt de controle onterecht dat hij wegvalt.
          if (getComputedStyle(img).filter.includes('invert')) ctx.filter = 'invert(1)';
          try { ctx.drawImage(img, 0, 0, 60, 30); } catch { continue; }
          let anders = 0;
          const d = ctx.getImageData(0, 0, 60, 30).data;
          for (let i = 0; i < d.length; i += 4) {
            if (d[i] < 236 || d[i + 1] < 236 || d[i + 2] < 236) anders++;
          }
          if (anders / 1800 < 0.02) uit.push(img.getAttribute('src'));
        }
        return uit;
      });
      if (leeg.length) fout(route, `logo valt weg op de witte tegel: ${leeg.join(', ')}`);
    }

    // --- de showreel in de hero -----------------------------------------------
    if (route === '/' || route === '/en/' || route === '/de/') {
      metingen++;
      const reel = await p.evaluate(async () => {
        const v = document.querySelector('.film-video, .zoeker-video');
        if (!v) return { er: false };
        await new Promise(r => setTimeout(r, 1200));
        const begin = v.currentTime;
        await new Promise(r => setTimeout(r, 900));
        return {
          er: true, bronnen: v.querySelectorAll('source').length,
          breedte: v.videoWidth, gepauzeerd: v.paused,
          liep: v.currentTime > begin,
          tc: document.querySelector('[data-tc]')?.textContent || '',
        };
      });
      if (!reel.er) fout(route, 'geen showreel in de hero');
      else {
        if (!reel.breedte) fout(route, 'showreel heeft geen beeld (videoWidth 0)');
        if (!reel.liep && !reel.gepauzeerd) fout(route, 'showreel staat op spelen maar loopt niet');
        if (!/^00:\d\d:\d\d:\d\d$/.test(reel.tc)) fout(route, `tijdcode klopt niet: "${reel.tc}"`);
      }

      // De schuivende logoband moet zijn opgemeten, anders staat hij stil op 0.
      metingen++;
      const band = await p.evaluate(() => {
        const m = document.querySelector('[data-marquee]');
        if (!m) return null;
        return {
          loopt: m.classList.contains('loopt'),
          breedte: parseFloat(getComputedStyle(m).getPropertyValue('--marquee-breedte')) || 0,
          helften: m.querySelectorAll('.marquee-helft').length,
        };
      });
      if (!band) fout(route, 'geen logoband gevonden');
      else {
        if (!band.loopt || band.breedte < 200) fout(route, `logoband niet opgemeten (breedte ${band.breedte})`);
        if (band.helften !== 2) fout(route, `logoband heeft ${band.helften} helften, moet er 2 zijn`);
      }
    }

    // --- videokaarten ----------------------------------------------------------
    const kaarten = await p.$$eval('[data-video]', ks => ks.length);
    if (kaarten) {
      metingen++;
      // Pas na een klik mag er iets van YouTube geladen worden. Daarvoor mag
      // er geen enkel verzoek naar google of youtube op de pagina staan.
      // Niet op "google" matchen: de lettertypes komen van fonts.googleapis.com
      // en fonts.gstatic.com, en die zijn hier niet het punt.
      const naarYoutube = await p.evaluate(() =>
        performance.getEntriesByType('resource')
          .filter(r => /youtube|ytimg|ggpht/.test(r.name)).map(r => r.name));
      if (naarYoutube.length) fout(route, `${naarYoutube.length} verzoek(en) naar YouTube zonder klik: ${naarYoutube[0]}`);

      // En na een klik moet er wel een speler staan.
      metingen++;
      await p.click('[data-video]');
      await p.waitForTimeout(400);
      const speler = await p.$$eval('.video-speler iframe', fs =>
        fs.map(f => f.getAttribute('src')));
      if (speler.length !== 1) fout(route, `na klik ${speler.length} spelers (moet er 1 zijn)`);
      else if (!speler[0].includes('youtube-nocookie.com')) fout(route, `speler gebruikt ${speler[0]}`);
    }

    // --- de meters op de studiopagina -----------------------------------------
    if (route === '/studio.html') {
      metingen++;
      const getekend = await p.evaluate(async () => {
        const blok = document.querySelector('[data-meters]');
        if (!blok) return null;
        blok.scrollIntoView();
        await new Promise(r => setTimeout(r, 900));
        // Een canvas waar niets op staat is overal doorzichtig. Tellen hoeveel
        // beeldpunten een alfa hebben; staat die op nul, dan is er niets
        // getekend en hangt er een leeg vlak op de pagina.
        return [...blok.querySelectorAll('canvas')].map(c => {
          const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
          let aan = 0;
          for (let i = 3; i < d.length; i += 4) if (d[i] > 10) aan++;
          return { naam: c.dataset.scope !== undefined ? 'scope' : 'wave', aan };
        });
      });
      if (!getekend) fout(route, 'geen meters gevonden');
      else for (const m of getekend) {
        if (m.aan < 500) fout(route, `meter ${m.naam} is leeg (${m.aan} beeldpunten getekend)`);
      }

      // De maatschetsen moeten een echte viewBox hebben, anders schalen ze niet.
      metingen++;
      const schetsen = await p.$$eval('.schets svg', ss => ss.map(s => ({
        vb: s.getAttribute('viewBox'),
        b: Math.round(s.getBoundingClientRect().width),
      })));
      if (schetsen.length !== 4) fout(route, `${schetsen.length} maatschetsen (moeten er 4 zijn)`);
      for (const s of schetsen) if (!s.vb || s.b < 60) fout(route, `maatschets zonder maat (viewBox ${s.vb}, ${s.b}px)`);

      // Tekst in een <svg> breekt niet af en wordt niet afgekapt: loopt een
      // label zijn vak uit, dan hangt het er gewoon naast. Dus nameten.
      metingen++;
      const uitKader = await p.evaluate(() => {
        const svg = document.querySelector('.keten svg');
        if (!svg) return ['geen keten'];
        const vb = svg.viewBox.baseVal;
        const uit = [];
        for (const t of svg.querySelectorAll('text')) {
          const d = t.getBBox();
          if (d.x + d.width > vb.width - 2 || d.y + d.height > vb.height + 2) {
            uit.push(`${t.textContent} loopt het kader uit`);
          }
        }
        // En per vak: past het label binnen zijn eigen rechthoek?
        for (const g of svg.querySelectorAll('g')) {
          const r = g.querySelector('rect'), n = g.querySelector('.k-naam');
          if (!r || !n) continue;
          const rb = r.getBBox(), nb = n.getBBox();
          if (nb.x + nb.width > rb.x + rb.width - 2) uit.push(`"${n.textContent}" past niet in zijn vak`);
        }
        return uit;
      });
      for (const u of uitKader) fout(route, u);
    }

    // --- een kop per pagina ---------------------------------------------------
    metingen++;
    const h1 = await p.$$eval('h1', hs => hs.length);
    if (h1 !== 1) fout(route, `${h1} h1-koppen (moet er 1 zijn)`);

    await p.screenshot({ path: `shots/${naam}.png`, fullPage: false });
    if (consoleFouten.length) fout(route, `console: ${consoleFouten.slice(0, 3).join(' | ')}`);
    if (mislukt.length) fout(route, `requests: ${[...new Set(mislukt)].slice(0, 3).join(' | ')}`);
    await p.close();
  }
  await ctx.close();
}

// --- alle interne links nalopen ---------------------------------------------
console.log(`\n${links.size} interne links nalopen`);
const ctx = await b.newContext();
const p = await ctx.newPage();
for (const href of [...links].sort()) {
  const url = href.startsWith('/') ? BASE + href : BASE + '/' + href;
  const r = await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => null);
  metingen++;
  if (!r || r.status() >= 400) fout('link ' + href, `status ${r?.status() ?? 'geen antwoord'}`);
}
await ctx.close();
await b.close();

console.log(`\n${metingen} metingen, ${fouten} fout${fouten === 1 ? '' : 'en'}`);
process.exit(fouten ? 1 : 0);
