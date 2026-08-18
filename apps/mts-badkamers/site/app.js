// MTS Badkamers
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- menu ----------
const burger = document.getElementById('burger');
const links = document.getElementById('navLinks');
if (burger && links) {
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }),
  );
}

// ---------- #werkgebied e.d. zijn dichtgeklapte details: hash klapt ze open ----------
function openHashDetails() {
  const id = location.hash.slice(1);
  if (!id) return;
  const el = document.getElementById(id);
  if (el?.tagName === 'DETAILS' && !el.open) {
    el.open = true;
    el.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
  }
}
openHashDetails();
window.addEventListener('hashchange', openHashDetails);

// ---------- scrollvoortgang + nav-schaduw ----------
const prog = document.querySelector('#prog i');
const nav = document.getElementById('nav');
let raf = 0;
function onScroll() {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (prog) prog.style.transform = `scaleX(${h > 0 ? Math.min(1, window.scrollY / h) : 0})`;
    if (nav) nav.classList.toggle('is-stuck', window.scrollY > 12);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- reveal ----------
// Weg. Hier stond een IntersectionObserver die .reveal-blokken van opacity 0
// naar 1 tilde zodra ze in beeld kwamen. Op een trage telefoon loopt die JS
// achter op de vinger en scroll je langs lege gaten die pas later invullen, en
// wie via een anker binnenkwam hield blokken over die onzichtbaar bleven. De
// inhoud staat volledig in de HTML en is nu ook meteen zichtbaar; zie de
// opmerking bij .reveal in styles.css.

// ---------- voor & na: gedeelde wipe-controller ----------
// v = de stand van de scheidingslijn in procent vanaf links, en tegelijk hoeveel
// procent "na" er te zien is: de nieuwe foto staat LINKS van de lijn en groeit
// mee naar rechts. Naar rechts slepen schuift dus het resultaat over de oude
// badkamer heen -- dat is de richting die je verwacht van een knop die van voor
// naar na loopt. Andersom (na rechts, van rechts naar links opengetrokken) is de
// gangbare variant op andere sites, maar dan betekent "knop naar rechts" terug
// naar de oude situatie, en dat leest verkeerd. Lijn, clip-path en de schuifknop
// hangen alle drie aan --wipe, dus ze kunnen niet uit de pas lopen.
// De VOOR/NA-labels staan daarom op de schuifbalk (links Voor, rechts Na) en niet
// meer op de helften: de linkerhelft is tijdens het slepen de nieuwe badkamer, dus
// elk label dat daar staat leest voor de bezoeker als een omgekeerde slider.
function makeWipe(stage, { range = null, start = 55 } = {}) {
  let v = start;
  const paint = () => {
    stage.style.setProperty('--wipe', v + '%');
    if (range) {
      range.value = String(Math.round(v));
      range.setAttribute('aria-valuetext', v > 50 ? `${Math.round(v)}% na oplevering` : `${Math.round(100 - v)}% oude situatie`);
    }
  };
  const setV = (n) => {
    v = Math.max(0, Math.min(100, n));
    paint();
  };
  setV(start);
  if (range) range.addEventListener('input', () => { touched = true; setV(+range.value); });

  let drag = false;
  let touched = false; // heeft de bezoeker zelf al gesleept of geschoven?
  const fromEvent = (e) => {
    const r = stage.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    setV((x / r.width) * 100);
  };
  // Bewust op window luisteren en geen setPointerCapture: met capture op het
  // beeld kwam alleen de eerste pointermove binnen (de foto eronder pakt de
  // rest af), en dan schuift de lijn een centimeter en blijft hij staan.
  const stop = () => {
    if (!drag) return;
    drag = false;
    stage.classList.remove('dragging');
  };
  stage.addEventListener('pointerdown', (e) => {
    e.preventDefault(); // anders sleept de browser de <img> als plaatje mee
    drag = true;
    touched = true;
    stage.classList.add('dragging');
    fromEvent(e);
  });
  window.addEventListener('pointermove', (e) => drag && fromEvent(e));
  window.addEventListener('pointerup', stop);
  window.addEventListener('pointercancel', stop);
  stage.addEventListener('dragstart', (e) => e.preventDefault());

  // Intro-veeg: van volledig "voor" naar bijna volledig "na" en terug naar de
  // rustpositie. Handmatige tween in rAF, want een CSS-transitie zou met het
  // slepen vechten. Afgebroken zodra iemand zelf sleept -- en hij begint niet
  // eens als er al gesleept is, anders trekt de veeg een seconde later de foto
  // weer weg onder de vinger van iemand die meteen zelf ging schuiven.
  const sweep = () => {
    if (touched) return;
    if (reduce) return setV(start);
    const T = 2100;
    let t0 = null;
    const step = (t) => {
      // touched en niet alleen drag: met alleen drag hervatte de veeg zodra je
      // losliet en trok hij de foto alsnog terug naar de rustpositie.
      if (drag || touched) return;
      if (t0 === null) t0 = t;
      const p = Math.min(1, (t - t0) / T);
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; // easeInOutCubic
      // 0 -> 88 -> start
      setV(e < 0.55 ? (e / 0.55) * 88 : 88 + ((e - 0.55) / 0.45) * (start - 88));
      if (p < 1) requestAnimationFrame(step);
    };
    setV(0);
    requestAnimationFrame(step);
  };
  return { setV, sweep, stage };
}

// Veeg pas af zodra het blok in beeld komt (en maar één keer).
function sweepOnView(w, el) {
  if (!('IntersectionObserver' in window)) return w.sweep();
  const io = new IntersectionObserver(
    (es) => {
      if (es.some((e) => e.isIntersecting)) {
        io.disconnect();
        setTimeout(() => w.sweep(), 220);
      }
    },
    { threshold: 0.35 },
  );
  io.observe(el);
}

// De hero heeft geen wipe meer (gewoon één opgeleverde badkamer); makeWipe
// draait nu alleen nog op het Voor & na-blok.
const ba = document.getElementById('ba');
if (ba) {
  const data = JSON.parse(document.getElementById('baData').textContent);
  const voor = document.getElementById('baVoor');
  const na = document.getElementById('baNa');
  const range = document.getElementById('baRange');
  const cap = document.getElementById('baCap');
  const link = document.getElementById('baLink');
  const tabs = Array.from(document.querySelectorAll('.ba-tab'));
  const stage = ba.querySelector('.ba-stage');
  const wipe = makeWipe(stage, { range, start: 55 });
  sweepOnView(wipe, ba);

  let pre = 0;
  tabs.forEach((t) =>
    t.addEventListener('click', () => {
      const i = +t.dataset.ba;
      const d = data[i];
      tabs.forEach((x) => {
        x.classList.toggle('on', x === t);
        x.setAttribute('aria-selected', String(x === t));
      });
      ba.classList.add('swap');
      const load = () => {
        voor.src = d.voor;
        na.src = d.na;
        cap.textContent = d.cap;
        document.getElementById('baTitle').textContent = d.title;
        link.href = `/werk/${d.slug}/`;
        requestAnimationFrame(() => {
          ba.classList.remove('swap');
          wipe.sweep();
        });
      };
      if (reduce) load();
      else setTimeout(load, 160);
      // volgende paar alvast inladen
      const nxt = data[(i + 1) % data.length];
      if (pre !== nxt.na) {
        pre = nxt.na;
        new Image().src = nxt.na;
      }
    }),
  );
}

// ---------- WhatsApp-formulier ----------
const form = document.getElementById('waForm');
if (form) {
  const NUM = '31647093103';
  // De labels van het appje staan niet in de HTML, dus die komen als JSON mee
  // uit de build (#i18n). Zonder dat blok zou het bericht op een Engelse of
  // Russische pagina alsnog in het Nederlands vertrekken.
  let T = { msg: { intro: 'Hallo Mike,', naam: 'Naam', plaats: 'Plaats', klus: 'Klus', wanneer: 'Wanneer', plan: 'Plan' } };
  try {
    T = { ...T, ...JSON.parse(document.getElementById('i18n').textContent) };
  } catch (e) {}
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = (id) => document.getElementById(id).value.trim();
    const naam = v('fNaam');
    const plaats = v('fPlaats');
    const m = T.msg;
    const regels = [
      `${m.intro}${naam ? ` ${m.naam}: ${naam}.` : ''}`,
      `${m.klus}: ${v('fKlus')}`,
      plaats ? `${m.plaats}: ${plaats}` : null,
      `${m.wanneer}: ${v('fWanneer')}`,
      v('fBericht') ? `${m.plan}: ${v('fBericht')}` : null,
    ].filter(Boolean);
    const note = document.getElementById('fNote');
    if (T.note) note.textContent = T.note;
    window.open(`https://wa.me/${NUM}?text=${encodeURIComponent(regels.join('\n'))}`, '_blank', 'noopener');
  });
}

// ---------- zijwaartse rails ----------
// Elke rail regelt zichzelf: pijlen, voortgangsbalk, teller en slepen met de muis.
// Touch en trackpad doen het native, daar zit dit script niet tussen.
document.querySelectorAll('[data-rail]').forEach((wrap) => {
  const rail = wrap.querySelector('.rail');
  const prev = wrap.querySelector('.rail-prev');
  const next = wrap.querySelector('.rail-next');
  const bar = wrap.querySelector('.rail-bar i');
  const count = wrap.querySelector('.rail-count');
  if (!rail) return;

  const kids = () => Array.from(rail.children);

  // Stap = de breedte van het item dat nu links staat, zodat er nooit half
  // een foto blijft hangen. Bij de bouwmap (2 rijen) springt hij per kolom.
  const stepSize = () => {
    const k = kids();
    if (!k.length) return rail.clientWidth * 0.8;
    const gap = parseFloat(getComputedStyle(rail).columnGap || '16') || 16;
    const first = k[0].getBoundingClientRect().width + gap;
    return Math.max(first, Math.min(rail.clientWidth * 0.85, first * Math.floor(rail.clientWidth / first) || first));
  };

  const update = () => {
    const max = rail.scrollWidth - rail.clientWidth;
    const pct = max > 4 ? rail.scrollLeft / max : 0;
    // Past alles al in beeld? Dan geen swipe-hint, teller of balk laten zien.
    wrap.classList.toggle('rail-static', max <= 4);
    if (max <= 4) {
      // disabled, niet hidden: anders verspringt de voetregel bij elke veeg
      if (prev) prev.disabled = true;
      if (next) next.disabled = true;
      return;
    }
    if (bar) {
      const w = max > 4 ? Math.max(12, (rail.clientWidth / rail.scrollWidth) * 100) : 100;
      bar.style.width = `${w}%`;
      bar.style.transform = `translateX(${pct * ((100 / w) * 100 - 100)}%)`;
    }
    if (prev) prev.disabled = rail.scrollLeft < 8;
    if (next) next.disabled = rail.scrollLeft > max - 8;
    // het verloop rechts verdwijnt zodra je aan het einde bent
    wrap.classList.toggle('at-end', rail.scrollLeft > max - 8);
    if (count) {
      const k = kids();
      if (k.length) {
        // Het eerste item dat links nog helemaal in beeld staat. Niet het item in
        // het midden: bij scrollLeft 0 zou de teller dan al op 2 staan.
        const edge = rail.getBoundingClientRect().left;
        let i = k.findIndex((el) => el.getBoundingClientRect().left >= edge - 4);
        if (i < 0) i = k.length - 1;
        count.textContent = `${i + 1} / ${k.length}`;
      }
    }
  };

  prev?.addEventListener('click', () => rail.scrollBy({ left: -stepSize(), behavior: reduce ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => rail.scrollBy({ left: stepSize(), behavior: reduce ? 'auto' : 'smooth' }));

  rail.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });

  // Slepen met de muis. Pas vanaf 6px als sleep zien, anders werkt klikken
  // (lightbox openen, doorklikken naar een project) niet meer.
  let down = false;
  let startX = 0;
  let startScroll = 0;
  let moved = false;
  rail.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    down = true;
    moved = false;
    startX = e.clientX;
    startScroll = rail.scrollLeft;
  });
  rail.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      rail.classList.add('dragging');
      rail.setPointerCapture?.(e.pointerId);
    }
    rail.scrollLeft = startScroll - dx;
  });
  const stop = (e) => {
    if (!down) return;
    down = false;
    if (moved) {
      rail.classList.remove('dragging');
      // klik na een sleep afvangen, anders opent de lightbox alsnog
      const kill = (ev) => ev.stopPropagation();
      rail.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => rail.removeEventListener('click', kill, { capture: true }), 0);
    }
    rail.releasePointerCapture?.(e.pointerId);
  };
  rail.addEventListener('pointerup', stop);
  rail.addEventListener('pointercancel', stop);

  // pijltjestoetsen als de rail focus heeft
  rail.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      rail.scrollBy({ left: stepSize(), behavior: reduce ? 'auto' : 'smooth' });
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      rail.scrollBy({ left: -stepSize(), behavior: reduce ? 'auto' : 'smooth' });
    }
  });

  update();
  // de srcset-breedtes staan pas na het laden vast
  window.addEventListener('load', update);
});

// ---------- meelopende CTA ----------
const dock = document.getElementById('dock');
if (dock) {
  const hero = document.querySelector('.hero, .p-hero');
  const contact = document.getElementById('contact');
  let pastHero = false;
  let atContact = false;

  const sync = () => {
    const on = pastHero && !atContact;
    dock.classList.toggle('on', on);
    document.body.classList.toggle('has-dock', on);
  };

  if ('IntersectionObserver' in window && hero) {
    new IntersectionObserver(
      ([e]) => {
        pastHero = !e.isIntersecting;
        sync();
      },
      { threshold: 0 },
    ).observe(hero);
  } else {
    pastHero = true;
  }

  if ('IntersectionObserver' in window && contact) {
    new IntersectionObserver(
      ([e]) => {
        atContact = e.isIntersecting;
        sync();
      },
      { rootMargin: '0px 0px -25% 0px' },
    ).observe(contact);
  }
  sync();
}

// ---------- lightbox ----------
const lb = document.getElementById('lb');
const stageEl = document.getElementById('lb-stage');
const cap = document.getElementById('lb-cap');
let items = [];
let cur = 0;
let lastFocus = null;

function collect() {
  items = Array.from(document.querySelectorAll('.ph'));
}

function render() {
  const el = items[cur];
  if (!el) return;
  stageEl.innerHTML = '';
  const video = el.dataset.video;
  if (video) {
    const v = document.createElement('video');
    v.src = video;
    v.poster = el.dataset.poster || '';
    v.controls = true;
    v.autoplay = true;
    v.playsInline = true;
    stageEl.appendChild(v);
  } else {
    const img = document.createElement('img');
    img.src = el.dataset.full;
    img.alt = el.querySelector('img')?.alt || '';
    stageEl.appendChild(img);
    // buren voorladen zodat doorklikken niet hapert
    [1, -1].forEach((d) => {
      const n = items[(cur + d + items.length) % items.length];
      if (n && n.dataset.full) new Image().src = n.dataset.full;
    });
  }
  const c = el.querySelector('figcaption');
  cap.textContent = `${cur + 1} / ${items.length}${c ? ` - ${c.textContent.trim()}` : ''}`;
}

function openLb(el) {
  collect();
  cur = items.indexOf(el);
  if (cur < 0) cur = 0;
  lastFocus = document.activeElement;
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
  render();
  document.getElementById('lb-x').focus();
}

function closeLb() {
  lb.hidden = true;
  stageEl.innerHTML = '';
  document.body.style.overflow = '';
  // Je kunt in de lightbox doorklikken naar een foto die in de rail buiten beeld
  // ligt. Bij sluiten schuift de rail mee, anders sta je op een lege plek.
  const el = items[cur];
  if (el?.closest('.rail')) el.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'auto' });
  lastFocus?.focus?.();
}

function step(d) {
  cur = (cur + d + items.length) % items.length;
  render();
}

document.addEventListener('click', (e) => {
  const ph = e.target.closest('.ph');
  if (ph) {
    e.preventDefault();
    openLb(ph);
  }
});

document.addEventListener('keydown', (e) => {
  const ph = document.activeElement?.closest?.('.ph');
  if (ph && (e.key === 'Enter' || e.key === ' ') && lb.hidden) {
    e.preventDefault();
    openLb(ph);
    return;
  }
  if (lb.hidden) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowRight') step(1);
  if (e.key === 'ArrowLeft') step(-1);
  if (e.key === 'Tab') {
    // focus vasthouden binnen de lightbox
    const f = lb.querySelectorAll('button');
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

document.getElementById('lb-x')?.addEventListener('click', closeLb);
document.getElementById('lb-n')?.addEventListener('click', () => step(1));
document.getElementById('lb-p')?.addEventListener('click', () => step(-1));
lb?.addEventListener('click', (e) => {
  if (e.target === lb || e.target === stageEl) closeLb();
});

// swipe op mobiel
let sx = 0;
lb?.addEventListener('touchstart', (e) => (sx = e.changedTouches[0].clientX), { passive: true });
lb?.addEventListener(
  'touchend',
  (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1);
  },
  { passive: true },
);

// ---------- werkgebiedkaart (Mapbox) ----------
// mapbox-gl is ~250 KB js + css. Die hoort niet in het pad van de hero, dus de
// kaart laadt pas als de sectie in beeld komt en valt terug op de tekstregel als
// het laden of WebGL mislukt (oude toestellen, WebGL uit, adblocker).
(function initMap() {
  const box = document.getElementById('map');
  const raw = document.getElementById('mapData');
  if (!box || !raw) return;
  const data = JSON.parse(raw.textContent);
  const fallback = document.getElementById('mapFallback');
  let started = false;

  const load = (tag, attrs) =>
    new Promise((ok, fail) => {
      const el = Object.assign(document.createElement(tag), attrs);
      el.onload = ok;
      el.onerror = fail;
      document.head.appendChild(el);
    });

  // Cirkel als GeoJSON. Mapbox heeft geen "teken een straal", dus 64 punten op
  // een cirkel; de correctie op de lengtegraad houdt hem rond in plaats van ovaal.
  function ring(center, km, steps = 64) {
    const [lng, lat] = center;
    const dLat = km / 110.574;
    const dLng = km / (111.32 * Math.cos((lat * Math.PI) / 180));
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * 2 * Math.PI;
      pts.push([lng + dLng * Math.cos(a), lat + dLat * Math.sin(a)]);
    }
    return { type: 'Feature', geometry: { type: 'Polygon', coordinates: [pts] } };
  }

  // Het label hangt absoluut onder (of boven) de stip in plaats van eronder in
  // de flow. Anders verschuift het midden van het element mee en staat de stip
  // niet meer op zijn eigen coordinaat: Apeldoorn kwam zo bovenop zijn eigen
  // naam te staan.
  function marker(cls, label, lblCls, above) {
    const wrap = document.createElement('div');
    wrap.className = 'map-mk';
    const dot = document.createElement('span');
    dot.className = 'map-pin ' + cls;
    const txt = document.createElement('span');
    txt.className = 'map-lbl ' + lblCls + (above ? ' up' : '');
    txt.textContent = label;
    wrap.append(dot, txt);
    return wrap;
  }

  async function start() {
    if (started) return;
    started = true;
    try {
      await Promise.all([
        load('link', {
          rel: 'stylesheet',
          href: 'https://api.mapbox.com/mapbox-gl-js/v3.9.0/mapbox-gl.css',
        }),
        load('script', { src: 'https://api.mapbox.com/mapbox-gl-js/v3.9.0/mapbox-gl.js' }),
      ]);
      if (!window.mapboxgl || !mapboxgl.supported()) return;
      mapboxgl.accessToken = data.token;
      const map = new mapboxgl.Map({
        container: box,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: data.hq.ll,
        zoom: 8.1,
        attributionControl: true,
        // Scrollzoom uit: anders kaapt de kaart je scroll zodra je er met de
        // muis overheen komt en kom je de sectie niet meer uit.
        scrollZoom: false,
        cooperativeGestures: true,
      });
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
      map.on('error', () => {});
      map.on('load', () => {
        fallback?.remove();
        // De plaatsnamen van Mapbox eronderuit: die stonden dubbel over onze eigen
        // labels heen (twee keer Apeldoorn) en de rest was ruis. Land, water en
        // wegen blijven, dus je ziet nog waar je bent.
        map
          .getStyle()
          .layers.filter((l) => /settlement.*label/.test(l.id))
          .forEach((l) => map.setLayoutProperty(l.id, 'visibility', 'none'));
        map.addSource('ring', { type: 'geojson', data: ring(data.hq.ll, data.ringKm) });
        map.addLayer({
          id: 'ring-fill',
          type: 'fill',
          source: 'ring',
          paint: { 'fill-color': '#c9b59b', 'fill-opacity': 0.09 },
        });
        map.addLayer({
          id: 'ring-line',
          type: 'line',
          source: 'ring',
          paint: { 'line-color': '#c9b59b', 'line-width': 1, 'line-opacity': 0.42 },
        });
        // Apeldoorn krijgt zijn naam bovenlangs: eronder zit de drukste hoek van
        // de kaart (Ugchelen, Beekbergen) en dan liepen de labels door elkaar.
        new mapboxgl.Marker({ element: marker('hq', data.hq.n, 'hq', true) })
          .setLngLat(data.hq.ll)
          .addTo(map);
        // Op een telefoon is de kaart 350px breed en liepen de labels rond
        // Apeldoorn door elkaar (Ugchelen over Beekbergen, Voorst over Zutphen).
        // Daar houdt de eerste groep (alles binnen de ring, direct om Apeldoorn)
        // alleen zijn stip; die plaatsen liggen toch al onder de naam Apeldoorn
        // en staan er als tekst onder de kaart.
        const narrow = box.clientWidth < 480;
        data.places.forEach((p) =>
          new mapboxgl.Marker({ element: marker('', narrow && p.g === 0 ? '' : p.n, '') })
            .setLngLat(p.ll)
            .addTo(map),
        );
        // Alles in beeld, ook als de doos smaller is dan verwacht.
        const b = new mapboxgl.LngLatBounds();
        [data.hq, ...data.places].forEach((p) => b.extend(p.ll));
        map.fitBounds(b, { padding: 44, duration: 0, maxZoom: 9 });
      });
    } catch {
      /* fallback-tekst blijft staan */
    }
  }

  if (!('IntersectionObserver' in window)) return start();
  const io = new IntersectionObserver(
    (es) => {
      if (es.some((e) => e.isIntersecting)) {
        io.disconnect();
        start();
      }
    },
    { rootMargin: '300px' },
  );
  io.observe(box);
})();

/* Hero-video. De video staat in de HTML met `autoplay muted playsinline`, maar hij
   is in de CSS onzichtbaar (opacity 0) tot dit stukje hem `is-live` geeft. Reden:
   de poster is het eerste frame, en dat is de kale bouwstaat. Speelt de video niet
   -- autoplay geweigerd, databesparing aan, codec niet ondersteund -- dan zou een
   zichtbare video betekenen dat je op een bouwput landt in plaats van op een
   opgeleverde badkamer. Onzichtbaar laten en de foto eronder tonen is dan beter.

   Daarom pas zichtbaar op `playing` (echt bewegende beelden, niet alleen
   `canplay`), en een noodrem: speelt hij na 2,5 s nog steeds niet, dan blijft de
   foto staan en halen we de video uit de weg. Aan het eind blijft het laatste
   frame staan; dat is de herofoto zelf, dus daar is niets te doen. */
(function () {
  const v = document.querySelector('.hero-vid');
  if (!v) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    v.remove();
    return;
  }
  let settled = false;
  const give = () => {
    if (settled) return;
    settled = true;
    v.remove();
  };
  v.addEventListener('playing', () => {
    settled = true;
    v.classList.add('is-live');
  }, { once: true });
  v.addEventListener('error', give, { once: true });
  setTimeout(() => {
    if (!v.classList.contains('is-live')) give();
  }, 2500);
  // Safari op laag energieverbruik weigert autoplay tot er interactie is; een
  // expliciete play() met een genegeerde rejection kost niets en helpt daar wel.
  const p = v.play();
  if (p && typeof p.catch === 'function') p.catch(() => {});
})();
