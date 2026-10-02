/* Yanis Klussenbedrijf. Geen bibliotheken. Het enige verzoek dat dit script doet is de
   offerteaanvraag naar onze eigen worker; verder gaat er niets de deur uit. */
;(function () {
  'use strict'

  // ── de enige plek waar zijn gegevens staan ───────────────
  var TEL_TOON = '06 11 41 67 36'
  var TEL_LINK = 'tel:+31611416736'
  var WA_LINK = 'https://wa.me/31611416736'

  // Het formulier gaat naar de eigen worker (@jiw/cloudflare-forms): die bewaart de
  // aanvraag, mailt hem naar ons en stuurt de aanvrager een bevestiging. Twee adressen,
  // want de bevestiging aan de aanvrager moet in zijn eigen taal aankomen.
  var ENDPOINTS = { nl: '/api/forms/offerte', en: '/api/forms/en/quote' }

  // ── de teksten die uit dit script komen, in beide talen ───
  // De taal komt uit <html lang>, dus hij volgt de pagina waar je op staat.
  var WOORDEN = {
    nl: {
      bel: 'Bel ',
      bellen: 'Bellen',
      geenNaam: 'Vul uw voornaam in.',
      geenTel: 'Vul een telefoonnummer in, dan kunnen wij u bereiken.',
      geenMail: 'Vul een geldig e-mailadres in, dan sturen wij u een bevestiging.',
      binnen: 'Aanvraag binnengekomen',
      binnenSub: 'U krijgt een bevestiging per e-mail. Wij nemen contact met u op over de afspraak.',
      bezig: 'Versturen...',
      verstuur: 'Aanvraag versturen',
      mislukt1: 'Versturen lukte niet. Bel ',
      mislukt2: ' of stuur een WhatsApp, dan pakken wij het meteen op.',
      contactPad: '/contact',
    },
    en: {
      bel: 'Call ',
      bellen: 'Call us',
      geenNaam: 'Please fill in your first name.',
      geenTel: 'Please add a phone number, so we can reach you.',
      geenMail: 'Please add a valid email address, so we can confirm your request.',
      binnen: 'Request received',
      binnenSub: 'You will get a confirmation by email. We will get in touch with you about the appointment.',
      bezig: 'Sending...',
      verstuur: 'Send the request',
      mislukt1: 'Sending did not work. Call ',
      mislukt2: ' or send a WhatsApp and we will pick it up right away.',
      contactPad: '/en/contact',
    },
  }
  var T = WOORDEN[(document.documentElement.lang || 'nl').slice(0, 2)] || WOORDEN.nl

  var $ = function (s, r) {
    return (r || document).querySelector(s)
  }
  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s))
  }
  var stil = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ── gegevens invullen ─────────────────────────────────── */
  function gegevens() {
    $$('[data-bel]').forEach(function (a) {
      a.href = TEL_LINK
      var em = $('em', a)
      if (em) em.textContent = TEL_TOON
      else if (!a.textContent.trim()) a.textContent = TEL_TOON
    })
    $$('[data-wa]').forEach(function (a) {
      a.href = WA_LINK
      a.rel = 'noopener'
      a.target = '_blank'
    })
    $$('[data-tel-tekst]').forEach(function (el) {
      el.textContent = TEL_TOON
    })

    var vc = $('#voetContact')
    if (vc) {
      vc.innerHTML =
        '<a href="' +
        TEL_LINK +
        '">' +
        TEL_TOON +
        '</a><a data-wa href="' +
        WA_LINK +
        '" rel="noopener" target="_blank">WhatsApp</a>'
    }
    var vk = $('#voetKnoppen')
    if (vk) {
      vk.innerHTML =
        '<a class="btn btn--vol btn--klein" href="' +
        TEL_LINK +
        '">' +
        T.bel +
        TEL_TOON +
        '</a><a class="btn btn--licht btn--klein" data-wa href="' +
        WA_LINK +
        '" rel="noopener" target="_blank">WhatsApp</a>'
    }
    var jaar = $('#jaar')
    if (jaar) jaar.textContent = String(new Date().getFullYear())

    // op de contactpagina sta je al bij het formulier: dan is bellen de tweede knop
    var cta = $('#mobalkCta')
    if (cta && location.pathname.replace(/\/$/, '') === T.contactPad) {
      cta.textContent = T.bellen
      cta.href = TEL_LINK
    }
  }

  /* ── kopbalk en leesbalk ───────────────────────────────── */
  function balken() {
    var nav = $('#nav')
    var prog = $('#prog')
    var i = prog ? prog.firstElementChild : null
    var bezig = false
    function meet() {
      var y = window.scrollY || document.documentElement.scrollTop
      if (nav) nav.classList.toggle('nav--diep', y > 8)
      if (i) {
        var h = document.documentElement.scrollHeight - window.innerHeight
        i.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%'
      }
      bezig = false
    }
    window.addEventListener(
      'scroll',
      function () {
        if (!bezig) {
          bezig = true
          requestAnimationFrame(meet)
        }
      },
      { passive: true }
    )
    meet()
  }

  /* ── menu op telefoon ──────────────────────────────────── */
  function menu() {
    var knop = $('#burger')
    var lade = $('#drawer')
    if (!knop || !lade) return
    function zet(open) {
      knop.setAttribute('aria-expanded', String(open))
      lade.hidden = !open
      document.body.style.overflow = open ? 'hidden' : ''
    }
    knop.addEventListener('click', function () {
      zet(knop.getAttribute('aria-expanded') !== 'true')
    })
    $$('a', lade).forEach(function (a) {
      a.addEventListener('click', function () {
        zet(false)
      })
    })
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') zet(false)
    })
    window.addEventListener('resize', function () {
      if (window.innerWidth > 980) zet(false)
    })
  }

  /* ── kop: beeld trager dan de pagina, woorden omhoog ───── */
  function kop() {
    var beeld = $('.hero__beeld')
    if (beeld && !stil) {
      var bezig = false
      window.addEventListener(
        'scroll',
        function () {
          if (bezig) return
          bezig = true
          requestAnimationFrame(function () {
            var y = window.scrollY || 0
            if (y < window.innerHeight * 1.3) beeld.style.transform = 'translate3d(0,' + y * 0.16 + 'px,0)'
            bezig = false
          })
        },
        { passive: true }
      )
    }

    var titel = $('.hero__in h1')
    if (titel && !stil && !titel.dataset.klaar) {
      titel.dataset.klaar = '1'
      var woorden = titel.textContent.trim().split(/\s+/)
      titel.textContent = ''
      woorden.forEach(function (w, n) {
        var s = document.createElement('span')
        s.className = 'woord'
        s.textContent = w
        s.style.animationDelay = n * 0.055 + 's'
        titel.appendChild(s)
        if (n < woorden.length - 1) titel.appendChild(document.createTextNode(' '))
      })
    }
  }

  /* ── opkomen bij scrollen ──────────────────────────────── */
  function opkomen() {
    var dingen = $$('.op')
    if (!dingen.length) return
    if (stil || !('IntersectionObserver' in window)) {
      dingen.forEach(function (el) {
        el.classList.add('in')
      })
      return
    }
    var kijker = new IntersectionObserver(
      function (rijen) {
        rijen.forEach(function (r) {
          if (r.isIntersecting) {
            r.target.classList.add('in')
            kijker.unobserve(r.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    )
    dingen.forEach(function (el, n) {
      el.style.transitionDelay = (n % 4) * 0.06 + 's'
      kijker.observe(el)
    })
  }

  /* ── glans op de knoppen volgt de muis ─────────────────── */
  function glans() {
    document.addEventListener('pointermove', function (e) {
      var k = e.target.closest ? e.target.closest('.btn') : null
      if (!k) return
      var r = k.getBoundingClientRect()
      k.style.setProperty('--gx', e.clientX - r.left + 'px')
    })
  }

  /* ── formulier ─────────────────────────────────────────── */
  function formulier() {
    var form = $('#form')
    if (!form) return
    var knop = $('#formKnop')
    var fout = $('#formFout')

    function meld(t) {
      if (!fout) return
      fout.textContent = t
      fout.hidden = !t
    }

    // De aanvraag wordt niet op de pagina teruggelezen: de bevestigingsmail doet dat,
    // en die komt uit de worker. Hier stond een samenvatting met een WhatsApp-knop
    // eronder, omdat er toen nog geen mailbox was om naartoe te sturen.
    function gelukt() {
      var blok = document.createElement('div')
      blok.className = 'klaar'
      blok.setAttribute('role', 'status')
      blok.innerHTML =
        '<div class="klaar__vink" aria-hidden="true">&#10003;</div><h3>' +
        T.binnen +
        '</h3><p>' +
        T.binnenSub +
        '</p>'
      form.replaceWith(blok)
      blok.scrollIntoView({ block: 'center', behavior: stil ? 'auto' : 'smooth' })
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault()
      meld('')
      var fd = new FormData(form)
      if (!String(fd.get('firstName') || '').trim()) {
        meld(T.geenNaam)
        form.elements.firstName.focus()
        return
      }
      if (!String(fd.get('telefoon') || '').trim()) {
        meld(T.geenTel)
        form.elements.telefoon.focus()
        return
      }
      var mail = String(fd.get('email') || '').trim()
      if (!mail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
        meld(T.geenMail)
        form.elements.email.focus()
        return
      }
      // De aangevinkte werkzaamheden staan tien keer onder dezelfde naam in het
      // formulier. De worker leest per naam één waarde, dus hij zou negen vinkjes
      // kwijtraken: samenvoegen tot één regel voordat hij de deur uit gaat.
      var werk = fd.getAll('werk')
      fd.delete('werk')
      if (werk.length) fd.set('werk', werk.join(', '))

      var endpoint = ENDPOINTS[(document.documentElement.lang || 'nl').slice(0, 2)] || ENDPOINTS.nl

      knop.disabled = true
      knop.textContent = T.bezig
      fetch(endpoint, { method: 'POST', body: fd, headers: { accept: 'application/json' } })
        .then(function (r) {
          return r
            .json()
            .catch(function () {
              return null
            })
            .then(function (j) {
              if (!r.ok || !j || j.ok !== true) {
                // de worker zegt zelf welk veld eraan schort; dat leest beter dan "mislukt"
                var e2 = new Error('form')
                e2.melding = j && j.message
                throw e2
              }
              gelukt()
            })
        })
        .catch(function (err) {
          knop.disabled = false
          knop.textContent = T.verstuur
          meld((err && err.melding) || T.mislukt1 + TEL_TOON + T.mislukt2)
        })
    })
  }

  gegevens()
  balken()
  menu()
  kop()
  opkomen()
  glans()
  formulier()
})()
