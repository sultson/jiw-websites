(function () {
  'use strict';
  var T = window.__T || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- mobile nav ---------- */
  var burger = $('.burger'), mnav = $('#mnav');
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      mnav.classList.toggle('open', !open);
    });
    $$('#mnav a').forEach(function (a) {
      a.addEventListener('click', function () {
        burger.setAttribute('aria-expanded', 'false');
        mnav.classList.remove('open');
      });
    });
  }

  /* ---------- packhouse clip ----------
     The markup ships with native `controls` so a browser without JS can still start it.
     Here we take them away and put a play disc over the poster instead, because the
     control bar sits exactly where the caption does; both come back the moment the clip
     starts, and the caption fades so they are not stacked on each other. */
  $$('.trip figure.v').forEach(function (fig) {
    var v = $('video', fig), btn = $('.vplay', fig);
    if (!v || !btn) return;
    v.controls = false;
    btn.hidden = false;
    btn.addEventListener('click', function () {
      v.controls = true;
      fig.classList.add('playing');
      btn.hidden = true;
      var p = v.play();
      // Autoplay policy can refuse a programmatic play(); the controls are already up,
      // so leave the user with a working player rather than a dead frame.
      if (p && p.catch) p.catch(function () {});
      v.focus();
    });
    v.addEventListener('ended', function () {
      fig.classList.remove('playing');
      v.controls = false;
      btn.hidden = false;
    });
  });

  /* ---------- hero market chip ----------
     Every chip is already in the page; this only moves the `on` class. Reduced
     motion, or no JS at all, leaves the first one (Europe) showing. */
  var mkt = $('#mkt');
  if (mkt) {
    var chips = $$(':scope > span', mkt), mi = 0;
    if (chips.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInterval(function () {
        chips[mi].classList.remove('on');
        mi = (mi + 1) % chips.length;
        chips[mi].classList.add('on');
      }, 2400);
    }
  }

  /* ---------- reveal on scroll ---------- */
  var rev = $$('.reveal');
  if (rev.length) {
    if (!('IntersectionObserver' in window) ||
        matchMedia('(prefers-reduced-motion: reduce)').matches) {
      rev.forEach(function (e) { e.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: .06 });
      rev.forEach(function (e, i) { e.style.transitionDelay = (i % 5) * 55 + 'ms'; io.observe(e); });
    }
  }

  /* ---------- rails ---------- */
  $$('[data-rail-next]').forEach(function (btn) {
    var rail = document.getElementById(btn.getAttribute('data-rail-next'));
    if (rail) btn.addEventListener('click', function () { scrollRail(rail, 1); });
  });
  $$('[data-rail-prev]').forEach(function (btn) {
    var rail = document.getElementById(btn.getAttribute('data-rail-prev'));
    if (rail) btn.addEventListener('click', function () { scrollRail(rail, -1); });
  });
  function scrollRail(rail, dir) {
    var first = rail.firstElementChild;
    var step = first ? first.getBoundingClientRect().width + 16 : 260;
    rail.scrollBy({ left: dir * step * 2, behavior: 'smooth' });
  }
  $$('.rail').forEach(function (rail) {
    var sync = function () {
      var max = rail.scrollWidth - rail.clientWidth - 2;
      var p = $('[data-rail-prev="' + rail.id + '"]');
      var n = $('[data-rail-next="' + rail.id + '"]');
      if (p) p.disabled = rail.scrollLeft <= 2;
      if (n) n.disabled = rail.scrollLeft >= max;
    };
    rail.addEventListener('scroll', sync, { passive: true });
    addEventListener('resize', sync);
    sync();
    rail.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); scrollRail(rail, 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); scrollRail(rail, -1); }
    });
  });

  /* ---------- sticky CTA ---------- */
  var stick = $('#stick');
  if (stick) {
    var hero = $('.hero') || $('.phead');
    var quote = $('#quote');
    var tick = function () {
      var pastHero = hero ? (hero.getBoundingClientRect().bottom < 40) : (scrollY > 500);
      var atQuote = quote && quote.getBoundingClientRect().top < innerHeight - 60;
      var basketOpen = basketEl && basketEl.classList.contains('show');
      stick.classList.toggle('show', pastHero && !atQuote && !basketOpen);
    };
    addEventListener('scroll', tick, { passive: true });
    addEventListener('resize', tick);
    setTimeout(tick, 60);
    var _tick = tick;
  }

  /* ---------- quote basket ---------- */
  var KEY = 'jasm.quote.v1';
  var basketEl = $('#basket');
  var read = function () {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  };
  var write = function (list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  };
  var names = {};
  $$('[data-add]').forEach(function (b) { names[b.getAttribute('data-add')] = b.getAttribute('data-name'); });

  function paint() {
    var list = read();
    $$('[data-add]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(list.indexOf(b.getAttribute('data-add')) > -1));
    });
    if (basketEl) {
      var c = $('#basketCount'), t = $('#basketText');
      if (c) c.textContent = String(list.length);
      if (t) {
        t.innerHTML = list.length
          ? '<b>' + list.map(function (s) { return names[s] || s; }).join(', ') + '</b>'
          : (T.empty || 'No items yet');
      }
      basketEl.classList.toggle('show', list.length > 0);
    }
    if (typeof _tick === 'function') _tick();
  }

  $$('[data-add]').forEach(function (b) {
    b.addEventListener('click', function () {
      var slug = b.getAttribute('data-add'), list = read(), i = list.indexOf(slug);
      if (i > -1) list.splice(i, 1); else list.push(slug);
      write(list); paint();
    });
  });
  var clr = $('#basketClear');
  if (clr) clr.addEventListener('click', function () { write([]); paint(); });
  paint();

  /* ---------- catalogue filters ---------- */
  var grid = $('#catGrid');
  if (grid) {
    var items = $$('.cat-item', grid);
    var out = $('#filterCount');
    var apply = function (f) {
      var n = 0;
      items.forEach(function (it) {
        var ok = f === 'All' || (f === 'Core' ? it.dataset.tier === 'signature' : it.dataset.group === f);
        it.classList.toggle('hide', !ok);
        if (ok) n++;
      });
      if (out) out.textContent = n + ' ' + (T.of || 'of') + ' ' + items.length +
        ' ' + (T.shown || 'shown');
    };
    $$('[data-filter]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        $$('[data-filter]').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        chip.setAttribute('aria-pressed', 'true');
        apply(chip.getAttribute('data-filter'));
      });
    });
    apply('All');
    // deep link: /catalogue/#slug should not be hidden
    if (location.hash) {
      var el = document.getElementById(location.hash.slice(1));
      if (el) setTimeout(function () { el.scrollIntoView({ block: 'center' }); }, 80);
    }
  }

  /* ---------- contact form ---------- */
  var form = $('#quoteForm');
  if (form) {
    // pre-select whatever is in the basket
    var picked = read();
    $$('[data-pick]').forEach(function (p) {
      if (picked.indexOf(p.getAttribute('data-pick')) > -1) p.setAttribute('aria-pressed', 'true');
      p.addEventListener('click', function () {
        p.setAttribute('aria-pressed', String(p.getAttribute('aria-pressed') !== 'true'));
      });
    });

    var val = function (n) { var e = form.elements[n]; return e ? e.value.trim() : ''; };

    function chosen() {
      return $$('[data-pick][aria-pressed="true"]').map(function (p) { return p.textContent.trim(); });
    }

    function validate() {
      var bad = null;
      ['company', 'country', 'name', 'email'].forEach(function (n) {
        var el = form.elements[n];
        if (!el) return;
        var ok = el.value.trim() && (n !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim()));
        el.style.borderColor = ok ? '' : '#B4453C';
        if (!ok && !bad) bad = el;
      });
      if (bad) { bad.focus(); bad.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
      return !bad;
    }

    function build() {
      // Written in the language the buyer is reading, labels included, so the
      // enquiry that lands in the inbox matches the page it was sent from.
      var lines = [];
      var f = function (k, d) { return T[k] || d; };
      lines.push(f('quoteVia', 'Quote request via') + ' ' + location.hostname);
      lines.push('');
      lines.push(f('fName', 'Name') + ': ' + val('name'));
      lines.push(f('fCompany', 'Company') + ': ' + val('company'));
      lines.push(f('fEmail', 'Email') + ': ' + val('email'));
      if (val('phone')) lines.push(f('fPhone', 'Phone') + ': ' + val('phone'));
      lines.push(f('fCountry', 'Country') + ': ' + val('country'));
      lines.push('');
      var c = chosen();
      lines.push(f('fLines', 'Flowers required') + ': ' +
        (c.length ? c.join(', ') : f('fNone', 'not specified')));
      if (val('volume')) lines.push(f('fVolume', 'Estimated quantity') + ': ' + val('volume'));
      if (val('spec')) lines.push(f('fSpec', 'Stem length / specification') + ': ' + val('spec'));
      if (val('dest')) lines.push(f('fDest', 'Delivery destination') + ': ' + val('dest'));
      if (val('freq')) lines.push(f('fFreq', 'Shipment frequency') + ': ' + val('freq'));
      if (val('message')) { lines.push(''); lines.push(f('fNotes', 'Message') + ':'); lines.push(val('message')); }
      return lines.join('\n');
    }

    /* The enquiry goes to the worker in front of this site (see worker/index.ts),
       which stores it, mails it to the office and sends the buyer a confirmation in
       the language of the page they are on. Until this site moved into the monorepo
       the button opened the visitor's own mail client instead, which did nothing at
       all on a desktop with no mail handler registered. The WhatsApp button below
       still works the old way, on purpose: for this audience it is often faster. */
    var status = $('#formStatus');
    var sendBtn = $('[data-send="post"]', form);
    var sending = false;

    function say(state, msg) {
      if (!status) return;
      status.setAttribute('data-state', state);
      status.textContent = msg;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending) return;
      if (!validate()) return;

      var fd = new FormData(form);
      // The package reads exactly these three names and carries everything else
      // through under the name the field already has. The page asks for one name,
      // not a first and a last one, so it goes in as firstName.
      fd.set('firstName', val('name'));
      fd.delete('name');
      // The pick buttons are buttons, not inputs, so they are not in FormData at all.
      // They also have to arrive as ONE field: the package walks FormData once per
      // key, so ten values under one name would lose nine of them.
      fd.set('flowers', chosen().join(', ') || (T.fNone || 'not specified'));
      // Which language to confirm in, and which to answer in. Read off <html lang>
      // rather than threaded through the build, so it cannot drift from the page.
      var lang = document.documentElement.lang || 'en';
      fd.set('lang', lang);
      fd.set('__jiw_confirmation_locale', lang);

      sending = true;
      if (sendBtn) sendBtn.disabled = true;
      say('busy', T.sending || 'Sending your enquiry...');

      var done = function () {
        sending = false;
        if (sendBtn) sendBtn.disabled = false;
      };

      fetch(form.dataset.endpoint || '/api/forms/enquiry', { method: 'POST', body: fd })
        .then(function (r) {
          return r.json().catch(function () { return { ok: false }; });
        })
        .then(function (d) {
          if (!d || !d.ok) {
            // The worker returns its own message for a field it rejected, which is
            // more use than anything we could guess from out here.
            say('err', (d && d.message) ||
              (T.sendFailed || 'The enquiry could not be sent. Please email or WhatsApp us instead.'));
            return done();
          }
          form.reset();
          $$('[data-pick]').forEach(function (p) { p.setAttribute('aria-pressed', 'false'); });
          // The enquiry is in, so the basket it came from has served its purpose.
          write([]);
          paint();
          say('ok', T.sent ||
            'Thank you. Your enquiry is with us and a copy is on its way to your inbox.');
          if (status && status.scrollIntoView) status.scrollIntoView({ block: 'center', behavior: 'smooth' });
          done();
        })
        .catch(function () {
          say('err', T.sendFailed ||
            'The enquiry could not be sent. Please email or WhatsApp us instead.');
          done();
        });
    });

    var wa = $('[data-send="wa"]', form);
    if (wa) wa.addEventListener('click', function () {
      if (!validate()) return;
      window.open('https://wa.me/' + form.dataset.wa + '?text=' + encodeURIComponent(build()), '_blank', 'noopener');
    });
  }
})();
