// Eenmalige patch: zet build.mjs om van eentalig NL naar vier talen.
// Staat in work/ zodat je kunt zien wat er precies is gewijzigd; de patch zelf
// is na het draaien overbodig.
import fs from 'node:fs';

// build.mjs staat met CRLF op schijf (Windows). De patronen hieronder zijn met
// LF geschreven, dus eerst normaliseren; aan het eind wordt CRLF teruggezet.
let s = fs.readFileSync('build.mjs', 'utf8').replace(/\r\n/g, '\n');
const rep = (a, b) => {
  if (!s.includes(a)) throw new Error(`niet gevonden:\n${a.slice(0, 120)}`);
  s = s.split(a).join(b);
};

// ---- imports + taalstand ----------------------------------------------------
rep(
  `import { FAQ, AREA, HQ, BA, REVIEWS } from './content.mjs';`,
  `import { FAQ, AREA, HQ, BA, REVIEWS } from './content.mjs';
import {
  LOCALES, DEFAULT_LOCALE, prefix, UI, fill, LANG_NAME, LANG_SHORT, OG_LOCALE, HTML_LANG,
} from './i18n.mjs';
import { tProject, tFaq, tBa, tArea, tReview } from './i18n-content.mjs';

// Actieve taal, module-level. Zo goed als elke functie hieronder rendert tekst;
// ze allemaal een locale-parameter geven zou zestig aanroepen raken zonder dat
// het ergens duidelijker van wordt. buildAll() zet LOC/L per taal.
let LOC = DEFAULT_LOCALE;
let L = UI[DEFAULT_LOCALE];
// PATH is het pad van de pagina die nu gebouwd wordt, zonder taalprefix. De
// taalwisselaar heeft dat nodig: die moet naar dezelfde pagina in een andere
// taal wijzen, niet naar de homepage.
let PATH = '/';
const U = (p) => \`\${prefix(LOC)}\${p}\`;
const outDir = () => (LOC === DEFAULT_LOCALE ? SITE : path.join(SITE, LOC));`,
);

// ---- WhatsApp-link per taal -------------------------------------------------
rep(
  `const WA_TEXT = encodeURIComponent('Hallo Mike, ik zag jullie site en wil graag een offerte voor mijn badkamer.');
const waLink = \`https://wa.me/\${BIZ.waNumber}?text=\${WA_TEXT}\`;`,
  `// De voorinvulling van het appje staat in de taal van de pagina, dus dit is een
// functie en geen constante.
const waLink = () => \`https://wa.me/\${BIZ.waNumber}?text=\${encodeURIComponent(L.waPrefill)}\`;`,
);
rep('href="${waLink}"', 'href="${waLink()}"');

// ---- figure / rail / sterren ------------------------------------------------
rep(
  `const label = caption || (m.video ? 'Video afspelen' : 'Foto vergroten');`,
  `const label = caption || (m.video ? L.fig.video : L.fig.foto);`,
);
rep(`alt: caption || 'Werk van M.Techno Service'`, `alt: caption || L.fig.alt`);
rep(`aria-hidden="true"></span>Veeg opzij</span>`, `aria-hidden="true"></span>\${esc(L.rail.hint)}</span>`);
rep(`aria-label="Naar links"`, `aria-label="\${esc(L.rail.prev)}"`);
rep(`aria-label="Naar rechts"`, `aria-label="\${esc(L.rail.next)}"`);
rep(`aria-label="\${n} van de 5 sterren"`, `aria-label="\${esc(fill(L.rev.stars, { n }))}"`);

// ---- head: taal, hreflang, canonical ---------------------------------------
rep(
  `  const og = ogImage || \`/m/\${media(93).base}-1600.jpg\`;
  return \`<!DOCTYPE html>
<html lang="nl">`,
  `  const og = ogImage || \`/m/\${media(93).base}-1600.jpg\`;
  // hreflang naar dezelfde pagina in elke taal, plus x-default op de NL-versie:
  // die staat op de root en is de versie waar Google op mag terugvallen.
  const alts = [
    ...LOCALES.map((l) => \`<link rel="alternate" hreflang="\${l}" href="\${ORIGIN}\${prefix(l)}\${canonical}">\`),
    \`<link rel="alternate" hreflang="x-default" href="\${ORIGIN}\${canonical}">\`,
  ].join('\\n');
  return \`<!DOCTYPE html>
<html lang="\${HTML_LANG[LOC]}">`,
);
rep(
  `<link rel="canonical" href="\${ORIGIN}\${canonical}">`,
  `<link rel="canonical" href="\${ORIGIN}\${U(canonical)}">
\${alts}`,
);
rep(`<meta property="og:locale" content="nl_NL">`, `<meta property="og:locale" content="\${OG_LOCALE[LOC]}">`);
rep(`<meta property="og:url" content="\${ORIGIN}\${canonical}">`, `<meta property="og:url" content="\${ORIGIN}\${U(canonical)}">`);
rep(`<a class="skip" href="#main">Naar de inhoud</a>`, `<a class="skip" href="#main">\${esc(L.skip)}</a>`);

// ---- nav + taalwisselaar ----------------------------------------------------
rep(
  `function nav(active = '') {
  return \`<header class="nav" id="nav">
  <div class="wrap nav-in">
    <a class="brand" href="/" aria-label="M.Techno Service, naar de homepage">\${brandLockup()}</a>
    <nav class="nav-links" id="navLinks" aria-label="Hoofdmenu">
      <a href="/#projecten"\${active === 'werk' ? ' class="on"' : ''}>Projecten</a>
      <a href="/#voorna">Voor &amp; na</a>
      <a href="/#diensten">Diensten</a>
      <a href="/#werkwijze">Werkwijze</a>
      <a href="/#reviews">Reviews</a>
      <a href="/#faq">Vragen</a>
    </nav>
    <a class="btn btn-wa btn-sm nav-cta" href="\${waLink()}" target="_blank" rel="noopener">
      \${waIcon()} <span>App direct</span>
    </a>
    <button class="burger" id="burger" aria-label="Menu" aria-expanded="false" aria-controls="navLinks"><span></span><span></span></button>
  </div>
</header>\`;
}`,
  `// Taalwisselaar. Staat binnen #navLinks en dus in een keer op beide plekken:
// op desktop rechts in de balk, op mobiel bovenin het uitklapmenu. Een tweede
// exemplaar buiten het menu zou op mobiel naast de burger moeten passen, en daar
// is met de logo-lockup en de app-knop geen ruimte voor.
//
// Elke knop wijst naar dezelfde pagina in die taal (PATH), niet naar de
// homepage: wie een projectpagina leest wil die pagina in het Engels, niet het
// begin van de site.
function langSwitch() {
  const opts = LOCALES.map((l) => {
    const on = l === LOC;
    return \`<a class="lang-o\${on ? ' on' : ''}" href="\${prefix(l)}\${PATH}" hreflang="\${l}" lang="\${l}"\${
      on ? ' aria-current="true"' : ''
    } title="\${esc(LANG_NAME[l])}"><span class="lang-s">\${LANG_SHORT[l]}</span><span class="lang-f">\${esc(
      LANG_NAME[l],
    )}</span></a>\`;
  }).join('');
  return \`<div class="lang" role="group" aria-label="\${esc(L.langLabel)}">\${opts}</div>\`;
}

function nav(active = '') {
  return \`<header class="nav" id="nav">
  <div class="wrap nav-in">
    <a class="brand" href="\${U('/')}" aria-label="\${esc(L.brandAria)}">\${brandLockup()}</a>
    <nav class="nav-links" id="navLinks" aria-label="\${esc(L.mainMenu)}">
      <a href="\${U('/#projecten')}"\${active === 'werk' ? ' class="on"' : ''}>\${esc(L.nav.projecten)}</a>
      <a href="\${U('/#voorna')}">\${esc(L.nav.voorna)}</a>
      <a href="\${U('/#diensten')}">\${esc(L.nav.diensten)}</a>
      <a href="\${U('/#werkwijze')}">\${esc(L.nav.werkwijze)}</a>
      <a href="\${U('/#reviews')}">\${esc(L.nav.reviews)}</a>
      <a href="\${U('/#faq')}">\${esc(L.nav.faq)}</a>
      \${langSwitch()}
    </nav>
    <a class="btn btn-wa btn-sm nav-cta" href="\${waLink()}" target="_blank" rel="noopener">
      \${waIcon()} <span>\${esc(L.nav.cta)}</span>
    </a>
    <button class="burger" id="burger" aria-label="\${esc(L.menu)}" aria-expanded="false" aria-controls="navLinks"><span></span><span></span></button>
  </div>
</header>\`;
}`,
);

// ---- kaartsectie ------------------------------------------------------------
rep(
  `  const cols = AREA.map(
    (g) =>
      \`<div class="area-col"><b>\${esc(g.h)}</b><p>\${g.places.map((pl) => esc(pl.n)).join(', ')}</p></div>\`,
  ).join('\\n      ');`,
  `  const cols = AREA.map(
    (g, gi) =>
      \`<div class="area-col"><b>\${esc(tArea(LOC, gi, g.h))}</b><p>\${g.places
        .map((pl) => esc(pl.n))
        .join(', ')}</p></div>\`,
  ).join('\\n      ');`,
);
rep(
  `      <h2>Vanuit Apeldoorn, en een flink stuk daarbuiten.</h2>
      <p>Apeldoorn is de thuisbasis. Een complete badkamer is weken werk, dus voor zo'n klus rijden we ook een stuk verder.</p>
      <p class="map-note">Woon je buiten de ring? Bij een complete verbouwing komen we daar ook kijken.</p>`,
  `      <h2>\${esc(L.map.h)}</h2>
      <p>\${esc(L.map.p)}</p>
      <p class="map-note">\${esc(L.map.note)}</p>`,
);
rep(
  `      <div class="map-canvas" id="map" aria-label="Kaart van het werkgebied rond Apeldoorn" role="img"></div>
      <p class="map-fallback" id="mapFallback">Werkgebied: Apeldoorn en omgeving, tot ongeveer \${data.ringKm} km.</p>`,
  `      <div class="map-canvas" id="map" aria-label="\${esc(L.map.canvas)}" role="img"></div>
      <p class="map-fallback" id="mapFallback">\${esc(fill(L.map.fallback, { km: data.ringKm }))}</p>`,
);

// ---- contactblok ------------------------------------------------------------
rep(
  `      <p class="cta-line">Vrijblijvende opname &middot; vaste prijsopgave &middot; één aanspreekpunt</p>`,
  `      <p class="cta-line">\${L.cta.line}</p>`,
);
rep(`<span>App Mike</span></a>
        <a class="btn btn-ghost-l" href="tel:+\${BIZ.waNumber}">Bellen</a>`, `<span>\${esc(L.cta.app)}</span></a>
        <a class="btn btn-ghost-l" href="tel:+\${BIZ.waNumber}">\${esc(L.cta.bel)}</a>`);
rep(
  `      <p class="cta-note">Werkgebied: Apeldoorn, Arnhem, Deventer, Zutphen en omstreken. KvK \${BIZ.kvk}.</p>`,
  `      <p class="cta-note">\${esc(fill(L.cta.note, { kvk: BIZ.kvk }))}</p>`,
);
rep(
  `      <p class="form-kop">Stuur je aanvraag via WhatsApp</p>
      <div class="form-row">
        <label>Naam<input type="text" name="naam" id="fNaam" autocomplete="name" placeholder="Je naam"></label>
        <label>Plaats<input type="text" name="plaats" id="fPlaats" autocomplete="address-level2" placeholder="Apeldoorn"></label>
      </div>
      <div class="form-row">
        <label>Wat wil je laten doen?
          <select name="klus" id="fKlus">
            <option>Complete badkamerrenovatie</option>
            <option>Toiletrenovatie</option>
            <option>Alleen tegelwerk</option>
            <option>Sanitair plaatsen of vervangen</option>
            <option>CV, leidingwerk of installatie</option>
            <option>Reparatie of lekkage</option>
            <option>Iets anders</option>
          </select>
        </label>
        <label>Wanneer?
          <select name="wanneer" id="fWanneer">
            <option>Zo snel mogelijk</option>
            <option>Binnen 3 maanden</option>
            <option>Later dit jaar</option>
            <option>Nog aan het orienteren</option>
          </select>
        </label>
      </div>
      <label>Kort je plan<textarea name="bericht" id="fBericht" rows="2" placeholder="Bijvoorbeeld: badkamer van 6 m2, bad eruit en een inloopdouche erin."></textarea></label>
      <button class="btn btn-wa btn-lg form-go" type="submit">\${waIcon()} <span>Bericht klaarzetten</span></button>
      <p class="form-note" id="fNote" role="status">WhatsApp opent met je bericht erin. Je kunt het nog aanpassen voordat je verstuurt.</p>`,
  `      <p class="form-kop">\${esc(L.form.kop)}</p>
      <div class="form-row">
        <label>\${esc(L.form.naam)}<input type="text" name="naam" id="fNaam" autocomplete="name" placeholder="\${esc(L.form.naamPh)}"></label>
        <label>\${esc(L.form.plaats)}<input type="text" name="plaats" id="fPlaats" autocomplete="address-level2" placeholder="Apeldoorn"></label>
      </div>
      <div class="form-row">
        <label>\${esc(L.form.klus)}
          <select name="klus" id="fKlus">
\${L.form.klusOpts.map((o) => \`            <option>\${esc(o)}</option>\`).join('\\n')}
          </select>
        </label>
        <label>\${esc(L.form.wanneer)}
          <select name="wanneer" id="fWanneer">
\${L.form.wanneerOpts.map((o) => \`            <option>\${esc(o)}</option>\`).join('\\n')}
          </select>
        </label>
      </div>
      <label>\${esc(L.form.plan)}<textarea name="bericht" id="fBericht" rows="2" placeholder="\${esc(L.form.planPh)}"></textarea></label>
      <button class="btn btn-wa btn-lg form-go" type="submit">\${waIcon()} <span>\${esc(L.form.go)}</span></button>
      <p class="form-note" id="fNote" role="status">\${esc(L.form.note)}</p>`,
);

// ---- dock -------------------------------------------------------------------
rep(
  `function ctaDock(kop = 'Badkamerplannen?') {`,
  `function ctaDock(kop) {
  kop = kop || L.dock.home;`,
);
rep(
  `      <span class="dock-sub">\${checkIcon()} Geverifieerd op Werkspot &middot; reactie meestal dezelfde dag</span>`,
  `      <span class="dock-sub">\${checkIcon()} \${L.dock.sub}</span>`,
);
rep(`<a class="btn btn-wa dock-wa" href="\${waLink()}" target="_blank" rel="noopener">\${waIcon()} <span>App Mike</span></a>`,
   `<a class="btn btn-wa dock-wa" href="\${waLink()}" target="_blank" rel="noopener">\${waIcon()} <span>\${esc(L.cta.app)}</span></a>`);
rep(`</svg> <span>Bellen</span></a>`, `</svg> <span>\${esc(L.cta.bel)}</span></a>`);

// ---- footer -----------------------------------------------------------------
rep(
  `  const links = projects
    .slice(0, 4)
    .map((p) => \`<a href="/werk/\${p.slug}/">\${esc(p.title)}</a>\`)
    .join('\\n      ');`,
  `  const links = projects
    .slice(0, 4)
    .map((p) => \`<a href="\${U(\`/werk/\${p.slug}/\`)}">\${esc(tProject(LOC, p).title)}</a>\`)
    .join('\\n      ');`,
);
rep(
  `      <p class="foot-sub">Badkamerrenovatie, tegelwerk en installatiewerk in Apeldoorn en omgeving.</p>`,
  `      <p class="foot-sub">\${esc(L.foot.sub)}</p>`,
);
rep(
  `      <h4>Projecten</h4>
      \${links}
      <a class="foot-more" href="/#projecten">Alle \${projects.length} projecten</a>
    </div>
    <div>
      <h4>Diensten</h4>
      <a href="/#diensten">Badkamerrenovatie</a>
      <a href="/#diensten">Tegelwerk</a>
      <a href="/#diensten">Sanitair &amp; kranen</a>
      <a href="/#diensten">CV &amp; leidingwerk</a>
      <a href="/#werkgebied">Werkgebied</a>
    </div>
    <div>
      <h4>Gegevens</h4>
      <p>Apeldoorn, Nederland</p>
      <p>KvK \${BIZ.kvk}</p>
      <p><a href="\${BIZ.werkspot}" target="_blank" rel="noopener">Werkspot-profiel</a></p>`,
  `      <h4>\${esc(L.foot.projecten)}</h4>
      \${links}
      <a class="foot-more" href="\${U('/#projecten')}">\${esc(fill(L.foot.alle, { n: projects.length }))}</a>
    </div>
    <div>
      <h4>\${esc(L.foot.diensten)}</h4>
\${L.foot.dienstenLinks.map((t) => \`      <a href="\${U('/#diensten')}">\${t}</a>\`).join('\\n')}
      <a href="\${U('/#werkgebied')}">\${esc(L.foot.werkgebied)}</a>
    </div>
    <div>
      <h4>\${esc(L.foot.gegevens)}</h4>
      <p>\${esc(L.foot.land)}</p>
      <p>KvK \${BIZ.kvk}</p>
      <p><a href="\${BIZ.werkspot}" target="_blank" rel="noopener">\${esc(L.foot.werkspot)}</a></p>`,
);
rep(
  `<div class="lb" id="lb" hidden role="dialog" aria-modal="true" aria-label="Foto bekijken">
  <button class="lb-x" id="lb-x" aria-label="Sluiten">&times;</button>
  <button class="lb-p" id="lb-p" aria-label="Vorige">&#8249;</button>
  <button class="lb-n" id="lb-n" aria-label="Volgende">&#8250;</button>`,
  `<div class="lb" id="lb" hidden role="dialog" aria-modal="true" aria-label="\${esc(L.lb.title)}">
  <button class="lb-x" id="lb-x" aria-label="\${esc(L.lb.close)}">&times;</button>
  <button class="lb-p" id="lb-p" aria-label="\${esc(L.lb.prev)}">&#8249;</button>
  <button class="lb-n" id="lb-n" aria-label="\${esc(L.lb.next)}">&#8250;</button>`,
);
// Labels die app.js zelf opbouwt (het WhatsApp-bericht uit het formulier) staan
// niet in de HTML, dus die gaan als JSON mee.
rep(
  `<script src="\${JS_URL}" defer></script>`,
  `<script id="i18n" type="application/json">\${JSON.stringify({ msg: L.form.msg, note: L.form.note })}</script>
<script src="\${JS_URL}" defer></script>`,
);

// ---- structured data --------------------------------------------------------
rep(
  `    description:
      'Badkamerspecialist en installatiebedrijf in Apeldoorn. Complete badkamerrenovaties, tegelwerk, sanitair, leidingwerk en CV.',
    url: ORIGIN,`,
  `    description: L.ldDesc,
    url: \`\${ORIGIN}\${U('/')}\`,`,
);
rep(
  `    makesOffer: [
      'Badkamerrenovatie',
      'Toiletrenovatie',
      'Wand- en vloertegels',
      'Sanitair plaatsen',
      'Waterleiding en riolering',
      'CV-ketel installeren',
    ].map`,
  `    makesOffer: L.ldOffers.map`,
);
rep(
  `    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),`,
  `    mainEntity: FAQ.map((f, i) => {
      const t = tFaq(LOC, i, f);
      return { '@type': 'Question', name: t.q, acceptedAnswer: { '@type': 'Answer', text: t.a } };
    }),`,
);
rep(
  `function ldProject(p) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.title,
    description: p.blurb,
    url: \`\${ORIGIN}/werk/\${p.slug}/\`,`,
  `function ldProject(p) {
  const t = tProject(LOC, p);
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: t.title,
    description: t.blurb,
    inLanguage: LOC,
    url: \`\${ORIGIN}\${U(\`/werk/\${p.slug}/\`)}\`,`,
);
rep(
  `    about: (p.tags || []).join(', '),`,
  `    about: (t.tags || []).join(', '),`,
);
rep(
  `      { '@type': 'ListItem', position: 1, name: 'Home', item: \`\${ORIGIN}/\` },
      { '@type': 'ListItem', position: 2, name: 'Projecten', item: \`\${ORIGIN}/#projecten\` },
      { '@type': 'ListItem', position: 3, name: p.title, item: \`\${ORIGIN}/werk/\${p.slug}/\` },`,
  `      { '@type': 'ListItem', position: 1, name: L.page.home, item: \`\${ORIGIN}\${U('/')}\` },
      { '@type': 'ListItem', position: 2, name: L.page.projecten, item: \`\${ORIGIN}\${U('/#projecten')}\` },
      { '@type': 'ListItem', position: 3, name: tProject(LOC, p).title, item: \`\${ORIGIN}\${U(\`/werk/\${p.slug}/\`)}\` },`,
);

// ---- projectpagina ----------------------------------------------------------
rep(
  `function buildProject(p, prev, next) {
  const used = new Set();`,
  `function buildProject(p, prev, next) {
  PATH = \`/werk/\${p.slug}/\`;
  const T = tProject(LOC, p);
  const Tprev = tProject(LOC, prev);
  const Tnext = tProject(LOC, next);
  const used = new Set();`,
);
rep(
  `      <span class="story-n">Fase \${String(n + 1).padStart(2, '0')}</span>
      <h2>\${esc(s.h)}</h2>
      <p>\${esc(s.p)}</p>`,
  `      <span class="story-n">\${esc(fill(L.page.fase, { n: String(n + 1).padStart(2, '0') }))}</span>
      <h2>\${esc(T.sections[n].h)}</h2>
      <p>\${esc(T.sections[n].p)}</p>`,
);
rep(
  `    { label: \`Foto's bij fase \${n + 1}: \${s.h}\` },`,
  `    { label: fill(L.page.faseLabel, { n: n + 1, h: T.sections[n].h }) },`,
);
rep(
  `      <span class="story-n">Oplevering</span>
      <h2>Het resultaat</h2>
      <p>Zoals opgeleverd, gefotografeerd op de dag van oplevering.</p>`,
  `      <span class="story-n">\${esc(L.page.oplevering)}</span>
      <h2>\${esc(L.page.resultH)}</h2>
      <p>\${esc(L.page.resultP)}</p>`,
);
rep(`    { label: 'Opleveringsfotos' },`, `    { label: L.page.resultLabel },`);
rep(
  `      <span class="story-n">Video</span>
      <h2>Video's van de klus</h2>
      <p>Rondje door de ruimte, opgenomen tijdens of vlak na de oplevering.</p>`,
  `      <span class="story-n">\${esc(L.page.video)}</span>
      <h2>\${esc(L.page.videoH)}</h2>
      <p>\${esc(L.page.videoP)}</p>`,
);
rep(`    { label: "Video's van dit project", kind: 'vid' },`, `    { label: L.page.videoLabel, kind: 'vid' },`);
rep(
  `      <span class="story-n">Bouwmap</span>
      <h2>Alle foto's van dit project</h2>
      <p>\${rest.length} opnames uit de bouwmap: sloop, techniek, tegelwerk en detailfoto's.\${rest.length >= 8 ? ' Twee rijen, zijwaarts door te scrollen.' : ''}</p>`,
  `      <span class="story-n">\${esc(L.page.bouwmap)}</span>
      <h2>\${esc(L.page.galH)}</h2>
      <p>\${esc(fill(L.page.galP, { n: rest.length }))}\${rest.length >= 8 ? esc(L.page.galP2) : ''}</p>`,
);
rep(
  `    { label: \`Alle \${rest.length} fotos van dit project\`, kind: rest.length >= 8 ? 'thumb' : 'ph' },`,
  `    { label: fill(L.page.galLabel, { n: rest.length }), kind: rest.length >= 8 ? 'thumb' : 'ph' },`,
);
rep(
  `  const tags = (p.tags || []).map((t) => \`<span>\${esc(t)}</span>\`).join('');
  const intro = (p.intro || []).map((t) => \`<p>\${esc(t)}</p>\`).join('\\n      ');`,
  `  const tags = (T.tags || []).map((t) => \`<span>\${esc(t)}</span>\`).join('');
  const intro = (T.intro || []).map((t) => \`<p>\${esc(t)}</p>\`).join('\\n      ');`,
);
rep(
  `  const html = \`\${head(\`\${p.title} | M.Techno Service Apeldoorn\`, p.blurb, \`/werk/\${p.slug}/\`, {`,
  `  const html = \`\${head(\`\${T.title} | \${L.page.titleSuffix}\`, T.blurb, \`/werk/\${p.slug}/\`, {`,
);
rep(
  `        <nav class="crumbs" aria-label="Kruimelpad">
          <a href="/">Home</a><span>/</span><a href="/#projecten">Projecten</a><span>/</span><b>\${esc(p.title)}</b>
        </nav>
        <h1>\${esc(p.title)}</h1>
        <p class="p-lead">\${esc(p.blurb)}</p>`,
  `        <nav class="crumbs" aria-label="\${esc(L.page.crumbs)}">
          <a href="\${U('/')}">\${esc(L.page.home)}</a><span>/</span><a href="\${U('/#projecten')}">\${esc(
            L.page.projecten,
          )}</a><span>/</span><b>\${esc(T.title)}</b>
        </nav>
        <h1>\${esc(T.title)}</h1>
        <p class="p-lead">\${esc(T.blurb)}</p>`,
);
rep(
  `          <div><dt>Plaats</dt><dd>Apeldoorn e.o.</dd></div>
          \${phases ? \`<div><dt>Fases in beeld</dt><dd>\${phases}</dd></div>\` : ''}
          <div><dt>Foto's &amp; video</dt><dd>\${shots}</dd></div>`,
  `          <div><dt>\${esc(L.page.plaats)}</dt><dd>\${esc(L.page.plaatsVal)}</dd></div>
          \${phases ? \`<div><dt>\${esc(L.page.fases)}</dt><dd>\${phases}</dd></div>\` : ''}
          <div><dt>\${L.page.fotos}</dt><dd>\${shots}</dd></div>`,
);
rep(
  `        \${pic(hero, { sizes: '(min-width: 1000px) 46vw, 92vw', alt: p.title, eager: true, full: true })}`,
  `        \${pic(hero, { sizes: '(min-width: 1000px) 46vw, 92vw', alt: T.title, eager: true, full: true })}`,
);
rep(
  `      <a class="p-nav-l" href="/werk/\${prev.slug}/"><span>Vorige</span><b>\${esc(prev.title)}</b></a>
      <a class="p-nav-c" href="/#projecten">Alle projecten</a>
      <a class="p-nav-r" href="/werk/\${next.slug}/"><span>Volgende</span><b>\${esc(next.title)}</b></a>`,
  `      <a class="p-nav-l" href="\${U(\`/werk/\${prev.slug}/\`)}"><span>\${esc(L.page.prev)}</span><b>\${esc(
        Tprev.title,
      )}</b></a>
      <a class="p-nav-c" href="\${U('/#projecten')}">\${esc(L.page.all)}</a>
      <a class="p-nav-r" href="\${U(\`/werk/\${next.slug}/\`)}"><span>\${esc(L.page.next)}</span><b>\${esc(
        Tnext.title,
      )}</b></a>`,
);
rep(
  `\${contactBlock('Zoiets voor jouw huis?', 'Stuur een appje met een paar fotos van je huidige badkamer. Je krijgt een eerlijke inschatting terug, vrijblijvend.')}
</main>
\${footer('Zoiets voor jouw huis?')}\`;

  const dir = path.join(SITE, 'werk', p.slug);`,
  `\${contactBlock(L.cta.projKop, L.cta.projTxt)}
</main>
\${footer(L.dock.proj)}\`;

  const dir = path.join(outDir(), 'werk', p.slug);`,
);

// ---- home -------------------------------------------------------------------
rep(
  `function buildHome() {`,
  `function buildHome() {
  PATH = '/';`,
);
rep(
  `  const cards = projects.map((p, n) => {
    const m = media(p.card);
    return \`<a class="card" href="/werk/\${p.slug}/">`,
  `  const cards = projects.map((p, n) => {
    const m = media(p.card);
    const T = tProject(LOC, p);
    return \`<a class="card" href="\${U(\`/werk/\${p.slug}/\`)}">`,
);
rep(
  `      <div class="card-img">\${pic(m, { sizes: '(min-width: 700px) 380px, 78vw', alt: p.title })}<span class="card-n">\${String(n + 1).padStart(2, '0')}</span></div>
      <div class="card-txt">
        <span class="card-kick">\${esc(p.kicker)}</span>
        <h3>\${esc(p.title)}</h3>
        <p>\${esc(p.blurb)}</p>
        <span class="card-go">Bekijk het project &rarr;</span>`,
  `      <div class="card-img">\${pic(m, { sizes: '(min-width: 700px) 380px, 78vw', alt: T.title })}<span class="card-n">\${String(n + 1).padStart(2, '0')}</span></div>
      <div class="card-txt">
        <span class="card-kick">\${esc(T.kicker)}</span>
        <h3>\${esc(T.title)}</h3>
        <p>\${esc(T.blurb)}</p>
        <span class="card-go">\${esc(L.proj.go)} &rarr;</span>`,
);
rep(
  `  const baTabs = BA.map(
    (b, i) => \`<button class="ba-tab\${i === 0 ? ' on' : ''}" type="button" role="tab" aria-selected="\${i === 0}" data-ba="\${i}">\${esc(b.tab)}</button>\`,
  ).join('');
  const baData = BA.map((b) => ({`,
  `  const baTabs = BA.map(
    (b, i) => \`<button class="ba-tab\${i === 0 ? ' on' : ''}" type="button" role="tab" aria-selected="\${i === 0}" data-ba="\${i}">\${esc(tBa(LOC, i, b).tab)}</button>\`,
  ).join('');
  const baData = BA.map((b, i) => ({`,
);
rep(
  `    cap: b.cap,
    slug: b.slug,
    title: b.tab,
  }));`,
  `    cap: tBa(LOC, i, b).cap,
    slug: U(\`/werk/\${b.slug}/\`),
    title: tBa(LOC, i, b).tab,
  }));`,
);
rep(
  `  const faq = FAQ.map(
    (f) => \`<details class="fq">
        <summary><span>\${esc(f.q)}</span></summary>
        <div class="fq-a"><p>\${esc(f.a)}</p></div>
      </details>\`,
  ).join('\\n');`,
  `  const faq = FAQ.map((f, i) => {
    const t = tFaq(LOC, i, f);
    return \`<details class="fq">
        <summary><span>\${esc(t.q)}</span></summary>
        <div class="fq-a"><p>\${esc(t.a)}</p></div>
      </details>\`;
  }).join('\\n');`,
);
rep(
  `  const SVC = [
    ['Badkamer renoveren of plaatsen', 'Sloop, leidingwerk, elektra, waterdichting, tegelwerk en afmontage.'],
    ['Toiletrenovatie', 'Nieuw toilet, inbouwreservoir en tegelwerk.'],
    ['Wand- en vloertegels', 'Visgraat, hexagon, grootformaat of natuursteenlook.'],
    ['Sanitair plaatsen of vervangen', 'Wastafels, meubels, douchewanden en toiletten.'],
    ['Douche- of badreparatie', 'Lekkage, afvoer of kitwerk dat aan vervanging toe is.'],
    ['IKEA badkamer monteren', 'Montage en aansluiting van je zelf gekochte badkamer.'],
    ['Kranen plaatsen of repareren', 'Inbouwkranen, thermostaatkranen en reparaties.'],
    ['Radiator (ver)plaatsen', 'Design- en handdoekradiatoren, inclusief leidingwerk.'],
    ['Waterleiding &amp; riolering', 'Verplaatsen, vervangen of compleet nieuw aanleggen.'],
    ['CV-ketel installeren', 'Vervanging of nieuwe installatie, incl. verdeler en expansievat.'],
  ]
    .map(([t, d]) => \`<li><b>\${t}</b><span>\${esc(d)}</span></li>\`)
    .join('\\n');`,
  `  const SVC = L.svc.map(([t, d]) => \`<li><b>\${t}</b><span>\${esc(d)}</span></li>\`).join('\\n');`,
);
rep(
  `  const STEPS = [
    ['Opname bij je thuis', 'Samen in de ruimte kijken wat kan en wat het mag kosten.'],
    ['Offerte', 'Vaste prijs, materiaal en werk uitgesplitst.'],
    ['Sloop', 'Alles afgeschermd, afvoer geregeld, de rest van je huis blijft schoon.'],
    ['Installatie', 'Leidingwerk, elektra, afvoer en waterdichting.'],
    ['Tegelwerk &amp; afmontage', 'Uitzetten, tegelen, voegen, kitten, sanitair monteren.'],
    ['Oplevering', 'Samen doorlopen, restpunten direct opgelost, met garantie.'],
  ]
    .map`,
  `  const STEPS = L.steps
    .map`,
);
rep(
  `  const revRail = railBlock(
    REVIEWS.map(
      (r) => \`<blockquote class="rev">`,
  `  const revRail = railBlock(
    REVIEWS.map(
      (r0, ri) => { const r = tReview(LOC, ri, r0); return \`<blockquote class="rev">`,
);
rep(
  `          <cite>\${esc(r.n)}<i class="rev-verif">\${checkIcon()} Geverifieerde klus via Werkspot</i></cite>
        </footer>
      </blockquote>\`,
    ),
    { label: 'Reviews op Werkspot', kind: 'rev' },
  );`,
  `          <cite>\${esc(r.n)}<i class="rev-verif">\${checkIcon()} \${esc(L.rev.verified)}</i></cite>
        </footer>
      </blockquote>\`; },
    ),
    { label: L.rev.railLabel, kind: 'rev' },
  );`,
);
rep(
  `  const html = \`\${head(
    'Badkamerspecialist Apeldoorn | M.Techno Service',
    \`M.Techno Service uit Apeldoorn renoveert badkamers van sloop tot oplevering. Tegelwerk, sanitair, leidingwerk en CV, alles door een vakman. Vaste prijsopgave na de opname.\`,
    '/',`,
  `  const html = \`\${head(
    L.homeTitle,
    L.homeDesc,
    '/',`,
);
rep(
  `        <span>Één vakman voor de hele klus</span>`,
  `        <span>\${esc(L.hero.chip)}</span>`,
);
rep(
  `      <p class="hero-kick">Badkamerspecialist in Apeldoorn</p>
      <h1>Een badkamer die klopt tot in de laatste voeg.</h1>`,
  `      <p class="hero-kick">\${esc(L.hero.kick)}</p>
      <h1>\${esc(L.hero.h1)}</h1>`,
);
rep(
  `      <p class="hero-sub"><span class="only-wide">Sloop, leidingwerk, waterdichting, tegelwerk en afmontage, door dezelfde vakman. Na de opname aan huis krijg je een vaste prijs.</span><span class="only-narrow">Van sloop tot afmontage. Na de opname een vaste prijs.</span></p>`,
  `      <p class="hero-sub"><span class="only-wide">\${esc(L.hero.subWide)}</span><span class="only-narrow">\${esc(L.hero.subNarrow)}</span></p>`,
);
rep(
  `<span>App ons<i class="only-wide">: \${BIZ.waDisplay}</i></span></a>
        <a class="btn btn-ghost" href="#projecten">Bekijk het werk</a>`,
  `<span>\${esc(L.hero.cta1)}<i class="only-wide">: \${BIZ.waDisplay}</i></span></a>
        <a class="btn btn-ghost" href="#projecten">\${esc(L.hero.cta2)}</a>`,
);
rep(
  `          \${heroPic(heroA, heroMob, 'Opgeleverde badkamer in Apeldoorn door M.Techno Service')}`,
  `          \${heroPic(heroA, heroMob, L.hero.alt)}`,
);
rep(
  `        <figcaption class="hero-cap">Opgeleverd in Apeldoorn: zwevend wastafelblad onder een ronde spiegel met indirecte verlichting</figcaption>`,
  `        <figcaption class="hero-cap">\${esc(L.hero.cap)}</figcaption>`,
);
rep(
  `      <span>Geverifieerd door Werkspot</span>
      <span>Biedt garantie</span>
      <span>KvK \${BIZ.kvk}</span>
      <span>Apeldoorn &amp; omgeving</span>`,
  `\${L.hero.strip.map((t) => \`      <span>\${esc(fill(t, { kvk: BIZ.kvk }))}</span>\`).join('\\n')}`,
);
rep(
  `    <h2 class="sec-h">Het werk, project voor project</h2>
    <p class="sec-lead">Van sloopfoto tot oplevering, alle \${projects.length} klussen.</p>
  </div>
  <div class="wrap">\${railBlock(cards, { label: \`Alle \${projects.length} projecten\`, kind: 'card' })}</div>`,
  `    <h2 class="sec-h">\${esc(L.proj.h)}</h2>
    <p class="sec-lead">\${esc(fill(L.proj.lead, { n: projects.length }))}</p>
  </div>
  <div class="wrap">\${railBlock(cards, { label: fill(L.proj.railLabel, { n: projects.length }), kind: 'card' })}</div>`,
);
rep(
  `    <h2>Dezelfde ruimte. Een paar weken later.</h2>
    <p>Zelfde standpunt, zelfde uitsnede. Alleen de badkamer is anders.</p>`,
  `    <h2>\${esc(L.ba.h)}</h2>
    <p>\${esc(L.ba.lead)}</p>`,
);
rep(
  `    <div class="ba-tabs reveal" role="tablist" aria-label="Kies een transformatie">\${baTabs}</div>`,
  `    <div class="ba-tabs reveal" role="tablist" aria-label="\${esc(L.ba.tablist)}">\${baTabs}</div>`,
);
rep(
  `alt="De oude situatie voor de verbouwing" loading="lazy" decoding="async">`,
  `alt="\${esc(L.ba.altVoor)}" loading="lazy" decoding="async">`,
);
rep(
  `alt="Dezelfde ruimte na oplevering" loading="lazy" decoding="async">`,
  `alt="\${esc(L.ba.altNa)}" loading="lazy" decoding="async">`,
);
rep(
  `          <span class="ba-slide-lbl"><b>&larr; Voor</b><b>Na &rarr;</b></span>
          <input type="range" min="0" max="100" value="55" id="baRange" aria-label="Van voor naar na">
          <span class="ba-hint">Sleep ook op de foto zelf.</span>
        </label>
        <a class="ba-link" id="baLink" href="/werk/\${first.slug}/">Hele project bekijken &rarr;</a>`,
  `          <span class="ba-slide-lbl"><b>&larr; \${esc(L.ba.voor)}</b><b>\${esc(L.ba.na)} &rarr;</b></span>
          <input type="range" min="0" max="100" value="55" id="baRange" aria-label="\${esc(L.ba.range)}">
          <span class="ba-hint">\${esc(L.ba.hint)}</span>
        </label>
        <a class="ba-link" id="baLink" href="\${first.slug}">\${esc(L.ba.link)} &rarr;</a>`,
);
rep(
  `      <h2 class="sec-h">Wat klanten zeggen</h2>
    </div>
    <p class="sec-lead">Deze beoordelingen staan op het Werkspot-profiel, ze zijn hier niet zelf verzameld.
      <a href="\${BIZ.werkspot}" target="_blank" rel="noopener">Alle beoordelingen bekijken</a></p>`,
  `      <h2 class="sec-h">\${esc(L.rev.h)}</h2>
    </div>
    <p class="sec-lead">\${esc(L.rev.lead)}
      <a href="\${BIZ.werkspot}" target="_blank" rel="noopener">\${esc(L.rev.all)}</a></p>`,
);
rep(
  `alt: 'Mike van M.Techno Service met een klant en zijn gezin, duimen omhoog na de klus' })}
      <figcaption>Mike (links) bij een klant thuis, aan het eind van de klus</figcaption></figure>
    <div>
      <h2>Één vakman die het hele traject doet, en er ook op terugkomt.</h2>
      <p>Bij de meeste badkamerverbouwingen lopen er vijf partijen door je huis. Hier is dat er één: Mike sloopt, trekt de leidingen, maakt waterdicht, tegelt en monteert het sanitair.</p>
      <div class="facts">
        <div><b>\${projects.length}</b><span>projecten in beeld</span></div>
        <div><b>1</b><span>vakman voor de hele klus</span></div>
        <div><b>Apeldoorn</b><span>en wijde omgeving</span></div>
      </div>`,
  `alt: L.over.imgAlt })}
      <figcaption>\${esc(L.over.imgCap)}</figcaption></figure>
    <div>
      <h2>\${esc(L.over.h)}</h2>
      <p>\${esc(L.over.p)}</p>
      <div class="facts">
        <div><b>\${projects.length}</b><span>\${esc(L.over.facts[0])}</span></div>
        <div><b>1</b><span>\${esc(L.over.facts[1])}</span></div>
        <div><b>\${esc(L.over.factCity)}</b><span>\${esc(L.over.facts[2])}</span></div>
      </div>`,
);
rep(
  `      <h2>Wat we doen</h2>`,
  `      <h2>\${esc(L.svcH)}</h2>`,
);
rep(
  `      <h2>Zes stappen, één aanspreekpunt</h2>`,
  `      <h2>\${esc(L.stepsH)}</h2>`,
);
rep(
  `      <h2>Wat mensen vooraf willen weten</h2>
      <p>Staat je vraag er niet bij? App hem gewoon.</p>
      <a class="btn btn-wa btn-sm" href="\${waLink()}" target="_blank" rel="noopener">\${waIcon()} <span>Stel je vraag</span></a>`,
  `      <h2>\${esc(L.faq.h)}</h2>
      <p>\${esc(L.faq.p)}</p>
      <a class="btn btn-wa btn-sm" href="\${waLink()}" target="_blank" rel="noopener">\${waIcon()} <span>\${esc(L.faq.btn)}</span></a>`,
);
rep(
  `\${contactBlock('Badkamerplannen? Stuur een appje.', 'Vertel kort wat je in gedachten hebt en stuur een paar fotos mee. Je krijgt een vrijblijvende prijsopgave en een realistische planning.')}
</main>
\${footer()}\`;

  fs.writeFileSync(path.join(SITE, 'index.html'), html);`,
  `\${contactBlock(L.cta.homeKop, L.cta.homeTxt)}
</main>
\${footer()}\`;

  fs.mkdirSync(outDir(), { recursive: true });
  fs.writeFileSync(path.join(outDir(), 'index.html'), html);`,
);

// ---- 404 / sitemap / robots -------------------------------------------------
rep(
  `  const html404 = \`\${head('Pagina niet gevonden | M.Techno Service', 'Deze pagina bestaat niet (meer).', '/404.html')}`,
  `  PATH = '/404.html';
  const html404 = \`\${head(L.nf.title, L.nf.desc, '/404.html')}`,
);
rep(
  `    <h1>Deze pagina bestaat niet.</h1>
    <p>Misschien zocht je een van de projecten, of wil je gewoon even appen.</p>
    <div class="hero-cta">
      <a class="btn" href="/#projecten">Naar de projecten</a>
      <a class="btn btn-wa" href="\${waLink()}" target="_blank" rel="noopener">\${waIcon()} <span>App ons</span></a>`,
  `    <h1>\${esc(L.nf.h1)}</h1>
    <p>\${esc(L.nf.p)}</p>
    <div class="hero-cta">
      <a class="btn" href="\${U('/#projecten')}">\${esc(L.nf.btn)}</a>
      <a class="btn btn-wa" href="\${waLink()}" target="_blank" rel="noopener">\${waIcon()} <span>\${esc(L.nf.wa)}</span></a>`,
);
rep(
  `  fs.writeFileSync(path.join(SITE, '404.html'), html404);

  const urls = ['/', ...projects.map((p) => \`/werk/\${p.slug}/\`)];
  const sitemap = \`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
\${urls.map((u) => \`  <url><loc>\${ORIGIN}\${u}</loc><changefreq>monthly</changefreq><priority>\${u === '/' ? '1.0' : '0.7'}</priority></url>\`).join('\\n')}
</urlset>\`;
  fs.writeFileSync(path.join(SITE, 'sitemap.xml'), sitemap);`,
  `  fs.mkdirSync(outDir(), { recursive: true });
  fs.writeFileSync(path.join(outDir(), '404.html'), html404);`,
);
rep(
  `  fs.writeFileSync(
    path.join(SITE, 'robots.txt'),`,
  `  // Een sitemap voor alle talen samen, met xhtml:link per taal: dat is de vorm
  // die Google voor meertalige sites vraagt. Losse sitemaps per taal mag ook,
  // maar dan moet elke variant alsnog naar de andere wijzen.
  const paths = ['/', ...projects.map((p) => \`/werk/\${p.slug}/\`)];
  const sitemap = \`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
\${paths
  .flatMap((u) =>
    LOCALES.map(
      (l) => \`  <url><loc>\${ORIGIN}\${prefix(l)}\${u}</loc>
\${LOCALES.map((a) => \`    <xhtml:link rel="alternate" hreflang="\${a}" href="\${ORIGIN}\${prefix(a)}\${u}"/>\`).join('\\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="\${ORIGIN}\${u}"/>
    <changefreq>monthly</changefreq><priority>\${u === '/' ? '1.0' : '0.7'}</priority></url>\`,
    ),
  )
  .join('\\n')}
</urlset>\`;
  fs.writeFileSync(path.join(SITE, 'sitemap.xml'), sitemap);

  fs.writeFileSync(
    path.join(SITE, 'robots.txt'),`,
);

// ---- run: per taal ----------------------------------------------------------
rep(
  `for (const [i, p] of projects.entries()) {
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const info = buildProject(p, prev, next);
  console.log(\`  \${p.slug}: \${info.used} gebruikt, \${info.rest} in galerij\`);
}
buildHome();
buildExtras();`,
  `for (const loc of LOCALES) {
  LOC = loc;
  L = UI[loc];
  console.log(\`\\n[\${loc}] -> \${loc === DEFAULT_LOCALE ? 'site/' : \`site/\${loc}/\`}\`);
  for (const [i, p] of projects.entries()) {
    const prev = projects[(i - 1 + projects.length) % projects.length];
    const next = projects[(i + 1) % projects.length];
    const info = buildProject(p, prev, next);
    if (loc === DEFAULT_LOCALE) console.log(\`  \${p.slug}: \${info.used} gebruikt, \${info.rest} in galerij\`);
  }
  buildHome();
  buildExtras();
}
LOC = DEFAULT_LOCALE;
L = UI[DEFAULT_LOCALE];`,
);

fs.writeFileSync('build.mjs', s);
console.log('build.mjs gepatcht');
