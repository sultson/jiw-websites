// Losse teksten komen uit window.FM_T, dat bouw.mjs per taal in de <head> zet.
// Dit bestand is voor alle drie de talen hetzelfde en komt met defer binnen,
// dus het kan niet zelf weten in welke taal de pagina staat. De Nederlandse
// waarde staat als terugval achter elke sleutel: zo staat er nooit
// 'undefined' in een knoplabel als een taal een sleutel mist.
const T = Object.assign({
  menuOpenen: 'Menu openen',
  menuSluiten: 'Menu sluiten',
  vulBedrijf: 'Vul uw bedrijfsnaam in.',
  vulMail: 'Vul een geldig e-mailadres in.',
  stap1: 'Stap 1 van 2',
  stap2: 'Stap 2 van 2',
  reelPauze: 'Showreel pauzeren',
  reelSpeel: 'Showreel afspelen',
}, window.FM_T || {});

// Het menu op de telefoon, de meebewegende actiebalk, het formulier dat niets
// verstuurt, de showreel in de hero, de logoband, de videokaarten en de twee
// meters op de studiopagina.

// Een bezoeker die "minder beweging" heeft aangezet krijgt geen draaiende
// showreel, geen schuivende logoband en geen tekenende meters. Eenmaal
// uitgelezen en overal hergebruikt.
const rustig = window.matchMedia('(prefers-reduced-motion: reduce)');

// Hier stond tot 11-10-2026 de weergaveschakelaar (donker of licht). De klant
// heeft definitief voor donker gekozen, dus de lichte uitvoering is er uit en
// er valt niets meer te schakelen. Zie LEESMIJ.md.

// --- menu ------------------------------------------------------------------
const knop = document.querySelector('.nav-toggle');
if (knop) {
  knop.addEventListener('click', () => {
    const open = knop.getAttribute('aria-expanded') === 'true';
    knop.setAttribute('aria-expanded', String(!open));
    knop.setAttribute('aria-label', open ? T.menuOpenen : T.menuSluiten);
    document.body.classList.toggle('menu-open', !open);
  });
  // Escape sluit het menu; anders zit je vast als je met het toetsenbord werkt.
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && knop.getAttribute('aria-expanded') === 'true') {
      knop.click();
      knop.focus();
    }
  });
}

// --- formulier -------------------------------------------------------------
// Elk formulier heeft zijn eigen action op dezelfde hostnaam (/api/forms/...,
// gezet door bouw.mjs, aangenomen door worker/index.ts). De bedankregel komt
// pas als de worker ja heeft gezegd. Mislukt het, dan blijft het ingevulde
// formulier staan met de reden erbij - een bedankregel over een aanvraag die
// nooit is aangekomen is erger dan een foutmelding.
//
// In de conceptbouw staat window.FM_LEEG en wordt er niets verstuurd; de
// bedankregel zegt daar zelf dat dit een conceptversie is.
async function verstuur(form, dank) {
  const kaart = form.closest('.form-kaart, [data-snelform]');
  const klaar = () => {
    kaart.classList.add('verstuurd');
    kaart.querySelector(dank)?.focus?.();
  };
  const adres = form.getAttribute('action');
  if (window.FM_LEEG || !adres) return klaar();

  const knop = form.querySelector('[type="submit"]');
  const was = knop?.textContent;
  if (knop) { knop.disabled = true; knop.textContent = T.verstuurBezig || was; }
  try {
    const r = await fetch(adres, { method: 'POST', body: new FormData(form) });
    // De worker antwoordt {"ok":true} of {"ok":false,"message":"..."} met een
    // 4xx. Die message is de reden in de taal van het formulier, dus die is
    // bruikbaarder dan "er ging iets mis" - al blijft die laatste de val voor
    // een netwerk dat er helemaal niet was.
    const uit = await r.json().catch(() => null);
    if (!r.ok || (uit && uit.ok === false)) throw new Error((uit && uit.message) || r.status);
    klaar();
  } catch (err) {
    const reden = /^\d+$/.test(String(err.message)) ? T.verstuurMis : (err.message || T.verstuurMis);
    const melding = form.querySelector('[data-melding]');
    if (melding) { melding.textContent = reden; melding.hidden = false; }
    else {
      const p = document.createElement('p');
      p.className = 'form-noot form-mis';
      p.setAttribute('role', 'alert');
      p.textContent = reden;
      form.append(p);
    }
  } finally {
    if (knop) { knop.disabled = false; knop.textContent = was; }
  }
}

document.querySelectorAll('.form-kaart form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const kaart = form.closest('.form-kaart');
    verstuur(form, '.form-dank h3');
    kaart.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

// --- het snelformulier in de hero ------------------------------------------
// Twee velden, dan pas de rest. De eerste stap wordt hier gecontroleerd en
// niet door de browser: novalidate staat erop omdat een native foutballon op
// bewegend beeld half wegvalt, en omdat "Verder" geen submit is - er valt op
// dat moment nog niets te versturen.
document.querySelectorAll('[data-snelform]').forEach(kaart => {
  const form = kaart.querySelector('form');
  const bedrijf = kaart.querySelector('#sf-bedrijf');
  const mail = kaart.querySelector('#sf-mail');
  const melding = kaart.querySelector('[data-melding]');
  const stapnr = kaart.querySelector('[data-stapnr]');
  const deel2 = kaart.querySelector('[data-deel="2"]');

  function klaagAan(veld, tekst) {
    veld.classList.add('veld-fout');
    veld.setAttribute('aria-invalid', 'true');
    melding.textContent = tekst;
    melding.hidden = false;
    veld.focus();
  }
  [bedrijf, mail].forEach(v => v.addEventListener('input', () => {
    v.classList.remove('veld-fout');
    v.removeAttribute('aria-invalid');
    melding.hidden = true;
  }));

  kaart.querySelector('[data-verder]')?.addEventListener('click', () => {
    if (!bedrijf.value.trim()) return klaagAan(bedrijf, T.vulBedrijf);
    // Bewust ruim: een punt en een apenstaartje. Strenger controleren levert
    // vooral valse afwijzingen op bij adressen die echt bestaan.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.value.trim())) {
      return klaagAan(mail, T.vulMail);
    }
    kaart.classList.add('stap-2');
    deel2.hidden = false;
    if (stapnr) stapnr.textContent = T.stap2;
    kaart.querySelector('#sf-naam')?.focus();
  });

  kaart.querySelector('[data-terug]')?.addEventListener('click', () => {
    kaart.classList.remove('stap-2');
    deel2.hidden = true;
    if (stapnr) stapnr.textContent = T.stap1;
    bedrijf.focus();
  });

  form?.addEventListener('submit', e => {
    e.preventDefault();
    verstuur(form, '.snelform-dank h3');
  });
});

// --- meebewegende actiebalk ------------------------------------------------
// Komt pas op als de hero voorbij is, en gaat weer weg zodra de echte
// contactknop in beeld staat. Anders staat dezelfde knop twee keer tegelijk
// op het scherm.
const balk = document.querySelector('.mobiel-cta');
if (balk) {
  // Alles wat als "echte" actie telt. De voettekst hoort daar ook bij: die
  // bevat het telefoonnummer en het mailadres, dus onderaan de pagina staat
  // de actie er al en hoeft de balk er niet overheen.
  const echteKnoppen = [
    ...document.querySelectorAll('.cta-band, .form-kaart, .site-footer'),
  ];
  const inBeeld = new Set();

  if ('IntersectionObserver' in window) {
    const kijker = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) inBeeld.add(e.target); else inBeeld.delete(e.target);
      }
      werkBij();
    }, { threshold: 0 });
    echteKnoppen.forEach(el => kijker.observe(el));
  }

  let wacht = false;
  function werkBij() {
    const voorbijHero = window.scrollY > window.innerHeight * 0.6;
    balk.classList.toggle('zichtbaar', voorbijHero && inBeeld.size === 0);
  }
  window.addEventListener('scroll', () => {
    if (wacht) return;
    wacht = true;
    requestAnimationFrame(() => { werkBij(); wacht = false; });
  }, { passive: true });
  werkBij();
}

// --- showreel in de hero ---------------------------------------------------
// De tijdcode liep eerst als vast plaatje mee ("00:03:47:12"). Nu telt hij de
// werkelijke positie van de showreel, in uren:minuten:seconden:frames op 25
// beeldjes per seconde. Dat is wat op een echte opname staat.
// Sinds de startpagina de showreel van rand tot rand achter de hero zet,
// staat dezelfde video in twee vormen op de site: klein in een .zoeker, groot
// als .hero-film. De besturing eronder is identiek, dus beide selectors.
const reel = document.querySelector('.film-video, .zoeker-video');
if (reel) {
  const tc = document.querySelector('[data-tc]');
  const pauzeKnop = document.querySelector('[data-reel-pauze]');
  const zoeker = reel.closest('.zoeker, .hero-film');

  const tweeCijfers = n => String(Math.floor(n)).padStart(2, '0');
  function toonTijd() {
    if (!tc) return;
    const t = reel.currentTime;
    tc.textContent = `00:${tweeCijfers(t / 60)}:${tweeCijfers(t % 60)}:${tweeCijfers((t % 1) * 25)}`;
  }
  reel.addEventListener('timeupdate', toonTijd);

  function zetDraaien(draaien) {
    if (draaien) reel.play().catch(() => {}); else reel.pause();
    zoeker?.classList.toggle('staat-stil', !draaien);
    pauzeKnop?.setAttribute('aria-label', draaien ? T.reelPauze : T.reelSpeel);
  }
  pauzeKnop?.addEventListener('click', () => zetDraaien(reel.paused));

  // Niet laten draaien terwijl hij niet in beeld staat - dat kost accu en
  // rekenkracht voor iets wat niemand ziet.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      if (rustig.matches) return;
      if (e.isIntersecting) { if (zoeker && !zoeker.classList.contains('staat-stil')) reel.play().catch(() => {}); }
      else reel.pause();
    }, { threshold: 0.1 }).observe(reel);
  }

  // Minder beweging: eerste beeld laten staan en niet afspelen.
  const volgRust = () => { if (rustig.matches) zetDraaien(false); };
  rustig.addEventListener?.('change', volgRust);
  volgRust();
  toonTijd();
}

// --- logoband van opdrachtgevers -------------------------------------------
// De band schuift met een CSS-animatie. De duur hangt af van hoe breed de
// helft werkelijk is, zodat de snelheid gelijk blijft of er nu tien of twintig
// logo's in staan. Stilzetten bij "minder beweging" en bij muis erop.
document.querySelectorAll('[data-marquee]').forEach(band => {
  const helft = band.querySelector('.marquee-helft');
  if (!helft) return;
  const stel = () => {
    const breedte = helft.scrollWidth;
    if (!breedte) return;
    band.style.setProperty('--marquee-breedte', breedte + 'px');
    band.style.setProperty('--marquee-duur', Math.round(breedte / 42) + 's');
    band.classList.add('loopt');
  };
  // Pas meten als de logo's geladen zijn, anders is scrollWidth nog nul.
  if (document.readyState === 'complete') stel();
  else window.addEventListener('load', stel);
  new ResizeObserver(stel).observe(helft);
});

// --- videokaarten ----------------------------------------------------------
// De kaart toont alleen een plaatje. Pas na een klik komt er een insluiting
// van youtube-nocookie in de plaats, met autoplay omdat de bezoeker er net
// zelf om heeft gevraagd. Zo staat er geen YouTube-verkeer op een pagina die
// iemand alleen maar doorbladert.
document.querySelectorAll('[data-video]').forEach(kaart => {
  kaart.addEventListener('click', () => {
    const id = kaart.dataset.video;
    const titel = kaart.dataset.titel || 'Video';
    const houder = document.createElement('div');
    houder.className = 'video-speler kader';
    houder.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1"
        title="${titel}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
        allowfullscreen loading="lazy"></iframe>`;
    kaart.replaceWith(houder);
    houder.querySelector('iframe')?.focus();
  });
});

// --- branchekaarten van Puur Genieten --------------------------------------
// Zelfde idee als hierboven, maar deze clips zijn van onszelf en staan op
// deze server. Er komt dus geen insluiting maar een gewone <video> met
// bediening, en pas na de klik - een mp4 van een paar megabyte haal je niet
// op voor iemand die alleen maar langs scrolt.
document.querySelectorAll('[data-clip]').forEach(kaart => {
  kaart.addEventListener('click', () => {
    const titel = kaart.dataset.titel || 'Video';
    const houder = document.createElement('div');
    houder.className = 'branche-speler kader';
    const v = document.createElement('video');
    v.src = kaart.dataset.clip;
    v.poster = kaart.dataset.poster || '';
    v.controls = true;
    v.autoplay = true;
    v.playsInline = true;
    v.preload = 'auto';
    v.setAttribute('title', titel);
    houder.appendChild(v);
    kaart.replaceWith(houder);
    v.focus();
    // Loopt hij niet (een browser die autoplay met geluid tegenhoudt), dan
    // staat de bediening er en kan de bezoeker hem zelf starten. Niet stil
    // dempen: dit zijn filmpjes met een voice-over.
    v.play().catch(() => {});
  });
});

// --- vectorscope en waveform ----------------------------------------------
// Twee meters zoals ze in Regie A staan, getekend op een canvas. Geen echte
// meting natuurlijk - het is een pagina, er komt geen signaal binnen - maar
// wel de echte vorm: de vectorscope met de zes kleurbalkdoelen op hun juiste
// hoek, en een waveform met een uitslagmeter eronder.
const meterBlok = document.querySelector('[data-meters]');
if (meterBlok) {
  const scope = meterBlok.querySelector('[data-scope]');
  const wave = meterBlok.querySelector('[data-wave]');
  const STAAL = '#95a4a3', LIJN = 'rgba(149,164,163,.26)', ROOD = '#ff4d57';

  // De zes doelen van een kleurbalk op een vectorscope: hoek in graden en
  // afstand vanuit het midden. Dit is de standaardopstelling, niet verzonnen.
  const DOELEN = [
    ['R', 103, 0.63], ['Mg', 61, 0.59], ['B', 347, 0.45],
    ['Cy', 283, 0.63], ['G', 241, 0.59], ['Yl', 167, 0.45],
  ];

  // Zet de canvassen op de echte pixeldichtheid, anders is alles wazig op een
  // scherm met een hogere resolutie.
  function scherp(c) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const b = c.getBoundingClientRect();
    if (!b.width) return null;
    c.width = Math.round(b.width * dpr);
    c.height = Math.round(b.height * dpr);
    const ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w: b.width, h: b.height };
  }

  let t = 0, bezig = false;

  function tekenScope(tijd) {
    const g = scherp(scope); if (!g) return;
    const { ctx, w, h } = g;
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 16;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = LIJN; ctx.lineWidth = 1;
    for (const f of [0.35, 0.7, 1]) {
      ctx.beginPath(); ctx.arc(cx, cy, r * f, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy);
    ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r);
    ctx.stroke();
    // De doelvakjes
    ctx.font = '600 9px Inter, sans-serif'; ctx.textAlign = 'center';
    for (const [naam, hoek, afst] of DOELEN) {
      // De hoek is de fasehoek, tegen de klok in vanaf 3 uur - zoals een
      // vectorscope hem aangeeft. Op een scherm loopt y naar beneden, dus de
      // sinus gaat er met een min af; anders staat het hele beeld gespiegeld.
      const a = hoek * Math.PI / 180;
      const x = cx + Math.cos(a) * r * afst, y = cy - Math.sin(a) * r * afst;
      ctx.strokeStyle = STAAL; ctx.strokeRect(x - 5, y - 5, 10, 10);
      ctx.fillStyle = STAAL; ctx.fillText(naam, x, y - 9);
    }
    // De uitslag: een lus die langzaam van vorm verandert en naar de doelen
    // toe trekt, zodat het op een bewegend signaal lijkt.
    ctx.beginPath();
    for (let i = 0; i <= 180; i++) {
      const a = i / 180 * Math.PI * 2;
      const golf = 0.46 + 0.1 * Math.sin(a * 3 + tijd * 1.1) + 0.05 * Math.sin(a * 6 - tijd * 0.7);
      const x = cx + Math.cos(a) * r * golf, y = cy + Math.sin(a) * r * golf;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(120,230,180,.85)'; ctx.lineWidth = 1.4; ctx.stroke();
  }

  function tekenWave(tijd) {
    const g = scherp(wave); if (!g) return;
    const { ctx, w, h } = g;
    const waveH = h * 0.62, meterY = waveH + 26;
    ctx.clearRect(0, 0, w, h);
    // Raster met de IRE-lijnen
    ctx.strokeStyle = LIJN; ctx.lineWidth = 1;
    ctx.font = '600 9px Inter, sans-serif'; ctx.textAlign = 'left';
    for (let i = 0; i <= 4; i++) {
      const y = 10 + (waveH - 20) * (i / 4);
      ctx.beginPath(); ctx.moveTo(26, y); ctx.lineTo(w - 6, y); ctx.stroke();
      ctx.fillStyle = STAAL; ctx.fillText(String(100 - i * 25), 4, y + 3);
    }
    // De luma-trace
    ctx.beginPath();
    for (let x = 26; x <= w - 6; x++) {
      const p = (x - 26) / (w - 32);
      const v = 0.5 + 0.3 * Math.sin(p * 7 + tijd) * Math.sin(p * 2.3 - tijd * 0.6)
        + 0.08 * Math.sin(p * 31 + tijd * 4);
      const y = 10 + (waveH - 20) * (1 - Math.max(0, Math.min(1, v)));
      x === 26 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(210,228,245,.9)'; ctx.lineWidth = 1.3; ctx.stroke();
    // De uitslagmeter eronder: twee kanalen, groen tot -6 dB, dan rood.
    ctx.font = '600 9px Inter, sans-serif';
    const PIEK = 0.82;                 // daarboven loopt hij in het rood
    for (let k = 0; k < 2; k++) {
      const y = meterY + k * 16;
      // Twee trage golven over elkaar, zodat het niveau onregelmatig op en
      // neer loopt en maar af en toe de piek raakt - zoals spraak doet.
      const g1 = Math.sin(tijd * (k ? 1.7 : 2.3) + k * 1.4);
      const g2 = Math.sin(tijd * (k ? 0.6 : 0.8) + k);
      const niveau = Math.max(0.1, Math.min(1, 0.46 + 0.26 * g1 + 0.16 * g2));
      const breed = w - 32;
      ctx.fillStyle = 'rgba(149,164,163,.14)';
      ctx.fillRect(26, y, breed, 9);
      // Altijd groen tot de piekgrens, en alleen het stuk daarboven rood.
      // Eerder kleurde de hele balk rood zodra de piek werd gehaald, dus hij
      // stond vrijwel altijd vol in het rood.
      const vol = breed * niveau;
      ctx.fillStyle = 'rgba(110,210,150,.9)';
      ctx.fillRect(26, y, Math.min(vol, breed * PIEK), 9);
      if (niveau > PIEK) {
        ctx.fillStyle = ROOD;
        ctx.fillRect(26 + breed * PIEK, y, vol - breed * PIEK, 9);
      }
      ctx.fillStyle = STAAL; ctx.textAlign = 'left';
      ctx.fillText(k ? 'R' : 'L', 8, y + 8);
    }
  }

  function lus() {
    if (!bezig) return;
    t += 0.016;
    tekenScope(t); tekenWave(t);
    requestAnimationFrame(lus);
  }
  function start() { if (bezig || rustig.matches) return; bezig = true; lus(); }
  function stop() { bezig = false; }

  // Alleen tekenen als het blok in beeld staat.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.15 })
      .observe(meterBlok);
  } else start();

  // Eenmaal stilstaand tekenen, zodat er ook zonder animatie iets te zien is.
  requestAnimationFrame(() => { tekenScope(0); tekenWave(0); });
  window.addEventListener('resize', () => { tekenScope(t); tekenWave(t); });
}
