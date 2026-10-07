/* ══════════════════════════════════════════════════════════════
   Novera Bouw — gedrag
   Alles wat de bezoeker nodig heeft staat al in de HTML; dit bestand
   voegt alleen gedrag toe. Contactgegevens, prijzen en teksten komen
   uit bouw.mjs en de pagina's zelf, niet hieruit.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict'

  /* Alleen nog voor de vaste knoppen onderin op mobiel (dok()). De contactgegevens
     op de pagina zelf worden sinds de overzetting naar jiw-websites door bouw.mjs in
     de HTML gezet, niet meer hier: een telefoonnummer dat alleen in JavaScript staat,
     leest een zoekmachine niet. Wijzigt het nummer, dan gaat het in bouw.mjs om en
     hier. Telefoon in E.164 zonder +. */
  var BEDRIJF = {
    telefoon: '31648569040',
    whatsapp: '31648569040',
  }

  /* ── de vaste prijzen van /aanbod ────────────────────────
     Vul een bedrag in euro (punt of komma) en het staat meteen op de kaart.
     Leeg = die kaart blijft Prijs op aanvraag zeggen; er wordt niets beweerd.
     De naam moet letterlijk gelijk zijn aan data-artikel op de kaart,
     anders valt kijk.mjs om.
       btw   'incl' of 'excl'; leeg = wij zeggen er niets over
       dekt  wat de prijs dekt, bv 'het materiaal' of 'het materiaal en het zetten'
     Let op: bij een particulier hoort de prijs inclusief btw te staan.
     dekt/dektEn: dezelfde zin in het Nederlands en in het Engels. Vul je
     alleen dekt, dan blijft die regel op de Engelse site weg. */
  var PRIJS = { btw: '', dekt: '', dektEn: '' }

  /* ── de badkamerpakketten van /badkamer ─────────────────
     Eén regel per pakket, de naam gelijk aan data-pakket op de kaart.
     van/tot in hele euro's. Allebei leeg = de kaart zegt Vanaf-prijs op
     aanvraag en er wordt niets beweerd. Alleen van = 'vanaf € x'.
     Een pakketprijs is het zwaarste dat hier kan staan, dus zet hem er pas
     in als Ekrem hem zelf gegeven heeft.
       btw        'incl' of 'excl'; leeg = wij zeggen er niets over
       materiaal  'in'    het bedrag dekt werk én materiaal
                  'apart' het bedrag is alleen het werk
                  ''      wij zeggen er niets over
     Deze twee zetten samen de regel onder de kaarten én het regeltje op
     elke kaart zelf (zie W.kaart* en W.dekt*). Eén plek dus, in beide
     talen en op alle vier de pagina's waar pakketten staan. */
  var PAKKETPRIJS = { btw: 'incl', materiaal: 'in' }
  var PAKKET = {
    Opfrissen: { van: 3500, tot: 6500 },
    Compleet: { van: 6500, tot: 9500 },
    'Compleet plus': { van: 11000, tot: 17000 },
  }

  var TARIEF = {
    'Witte wandtegel 10 x 10': '',
    'Metrotegel 7,5 x 15': '',
    'Antraciet tegel, mat': '',
    'Antraciet mozaiek 5 x 5': '',
    'Betonlook vloertegel 60 x 60': '',
    'Marmerlook tegel, groot formaat': '',
    'Hangtoilet, randloos': '',
    'Fonteintje met kraan': '',
    'Bedieningsplaat mat zwart': '',
    'Wastafelkraan mat zwart': '',
    'Regendoucheset mat zwart': '',
    'Handdoekradiator antraciet': '',
  }
  var EENHEID = { 'per m2': 'per m²' }

  var SLEUTEL = 'novera:wensen'

  /* ── Nederlands of Engels ───────────────────────────────
     De schil zet lang="nl" of lang="en" op <html>. Alles wat dit
     bestand zelf op de pagina schrijft staat hieronder, links het
     Nederlands en rechts het Engels. Komt er een regel bij, vul dan
     allebei in — anders staat er straks Nederlands op de Engelse site. */
  var EN = document.documentElement.lang === 'en'
  var TAAL = {
    contact: ['/contact', '/en/contact'],
    bellen: ['Bellen', 'Call'],
    offerte: ['Offerte aanvragen', 'Request a quote'],
    staatErin: ['Staat in uw lijst', 'On your list'],
    zetErin: ['In mijn lijst', 'Add to my list'],
    hintLeeg: [
      'Uw keuze blijft staan, ook als u verder klikt.',
      'Your choice is saved, even if you move to another page.',
    ],
    hintEen: [
      '1 keuze staat in uw lijst. Die gaat mee in het formulier.',
      '1 choice is on your list. It will be included in the form.',
    ],
    hintMeer: [
      ' keuzes staan in uw lijst. Die gaan mee in het formulier.',
      ' choices are on your list. They will be included in the form.',
    ],
    inLijst: [' in uw lijst: ', ' on your list: '],
    enMeer: [' en ', ' and '],
    meer: [' meer', ' more'],
    artikel: ['1 artikel', '1 item'],
    artikelen: [' artikelen', ' items'],
    prijsIncl: ['Alle prijzen zijn inclusief btw', 'All prices include VAT'],
    prijsExcl: ['Alle prijzen zijn exclusief btw', 'All prices exclude VAT'],
    enGelden: [' en gelden voor ', ' and apply to '],
    gelden: ['De prijzen gelden voor ', 'The prices apply to '],
    bedragIncl: ['Alle bedragen zijn inclusief btw', 'All amounts include VAT'],
    bedragExcl: ['Alle bedragen zijn exclusief btw', 'All amounts exclude VAT'],
    enDekken: [' en dekken ', ' and cover '],
    dekken: ['De bedragen dekken ', 'The amounts cover '],
    vanaf: ['Vanaf', 'From'],
    richtprijs: ['Richtprijs', 'Guide price'],
    /* Staat op elke pakketkaart, direct onder het bedrag. Dit is de vraag
       waar iemand bij een pakketprijs op blijft hangen, dus hij hoort bij
       het getal te staan en niet alleen in een regel eronder. */
    kaartInIncl: ['Inclusief materiaal en btw', 'Materials and VAT included'],
    kaartInExcl: ['Inclusief materiaal, exclusief btw', 'Materials included, VAT excluded'],
    kaartIn: ['Inclusief materiaal', 'Materials included'],
    kaartApartIncl: ['Inclusief btw, materiaal komt erbij', 'VAT included, materials on top'],
    kaartApartExcl: ['Exclusief materiaal en btw', 'Materials and VAT excluded'],
    kaartApart: ['Exclusief materiaal', 'Materials not included'],
    dektIn: [
      'het werk en het materiaal, dus ook de tegels, het sanitair en de kranen',
      'both the work and the materials, so the tiles, the sanitary ware and the taps as well',
    ],
    dektApart: [
      'alleen het werk, het materiaal komt daar apart bij',
      'the work only, materials are charged separately',
    ],
    /* Het formulier stuurt sinds de overzetting naar jiw-websites echt iets weg
       (@jiw/cloudflare-forms, zie worker/index.ts). Hier stonden daarom ook de
       zinnen voor "deze site heeft nog geen mailbox, kopieer uw aanvraag maar" en
       de samenvatting die daarbij hoorde. Die zijn weg: de bevestigingsmail leest
       de aanvraag nu zelf terug. */
    foutNaam: [
      'Vul uw voornaam in, dan weten wij wie wij terugbellen.',
      'Please fill in your first name, so we know who to call back.',
    ],
    foutTel: [
      'Vul uw telefoonnummer in, dan kunnen wij u bellen.',
      'Please fill in your phone number, so we can call you.',
    ],
    foutMail: [
      'Vul een e-mailadres in dat klopt. Daar sturen wij de bevestiging naartoe.',
      'Please fill in a valid email address. That is where we send the confirmation.',
    ],
    foutVerzend: [
      'Het versturen lukte niet. Probeer het zo nog eens, of bel ons.',
      'We could not send your request. Please try again in a moment, or give us a call.',
    ],
    bezig: ['Versturen...', 'Sending...'],
    verstuur: ['Aanvraag versturen', 'Send request'],
    dankKop: ['Aanvraag binnengekomen', 'Request received'],
    dankTxt: [
      'U krijgt er een bevestiging van per mail. Wij bellen u snel om een moment af te spreken om te komen kijken.',
      'You will get a confirmation by email. We will call you shortly to arrange a time to come and take a look.',
    ],
  }
  var W = {}
  for (var sleutel in TAAL) W[sleutel] = TAAL[sleutel][EN ? 1 : 0]
  if (EN) {
    PRIJS.dekt = PRIJS.dektEn
    // de wensenlijst bewaart de naam van het artikel, en die is per taal
    // anders. Een eigen sleutel dus, anders staan er straks Nederlandse
    // namen in het Engelse formulier.
    SLEUTEL = 'novera:wensen:en'
  }

  var $ = function (s, r) {
    return (r || document).querySelector(s)
  }
  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s))
  }
  var rustig = window.matchMedia('(prefers-reduced-motion: reduce)').matches


  var IC = {
    tel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16 12l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 6.2 2 2 0 0 1 6.5 3z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.7-5.2A8.5 8.5 0 1 1 21 11.5z"/><path d="M8.8 8.4c.3-.7 1.4-.6 1.7 0l.5 1.1-.7.8a5 5 0 0 0 2.9 2.9l.8-.7 1.1.5c.6.3.7 1.4 0 1.7-1.4.6-3.6-.3-5-1.7s-2.3-3.6-1.3-4.6z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>',
  }


  /* ── vaste knoppen onderin op mobiel ───────────────────── */
  function dok() {
    var wa = BEDRIJF.whatsapp || BEDRIJF.telefoon
    var tel = BEDRIJF.telefoon
    if (!wa && !tel) return
    var opContact = location.pathname.indexOf(W.contact) === 0

    var k = ''
    if (wa) k += '<a class="btn btn--lijn" href="https://wa.me/' + wa + '" rel="noopener">' + IC.wa + 'WhatsApp</a>'
    if (opContact && tel) k += '<a class="btn btn--accent" href="tel:+' + tel + '">' + IC.tel + W.bellen + '</a>'
    else k += '<a class="btn btn--accent" href="' + W.contact + '">' + W.offerte + '</a>'

    var el = document.createElement('div')
    el.className = 'dok'
    el.id = 'dok'
    el.innerHTML = k
    document.body.appendChild(el)
    document.body.classList.add('heeft-dok')
    dokGedrag(el)
  }

  /* Wanneer die balk onderin in beeld mag komen.
     Twee voorwaarden, en ze moeten allebei waar zijn:
       - je bent minstens een schermhoogte naar beneden. Bovenaan staan de twee
         knoppen van de kop al in beeld; een derde knop erover is te veel.
       - er staat op dit moment geen offerteknop en geen formulier in beeld. Zat
         hij er dan wel, dan legde hij zich over precies de knop waar hij naartoe
         wijst — op de contactpagina lag hij zelfs over het formulier.
     Gemeten wordt wat de bezoeker echt ziet, dus met getBoundingClientRect en
     niet met een vaste lijst pagina's: komt er ergens een knop bij, dan doet hij
     vanzelf mee. Een knop die weggezet is (de offerteknop in de kop staat op
     mobiel op display none) heeft geen maat en telt dus niet mee. */
  function dokGedrag(el) {
    var doelen = $$('a.btn--accent, a.drawer__cta, form').filter(function (n) {
      return !el.contains(n)
    })
    var wacht = false
    function meet() {
      wacht = false
      var h = window.innerHeight
      var ver = window.scrollY > h * 0.9
      var botst = false
      for (var i = 0; i < doelen.length && !botst; i++) {
        var r = doelen[i].getBoundingClientRect()
        if (r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < h) botst = true
      }
      var op = ver && !botst
      el.classList.toggle('is-op', op)
      document.body.classList.toggle('dok-op', op)
    }
    function plan() {
      if (wacht) return
      wacht = true
      requestAnimationFrame(meet)
    }
    window.addEventListener('scroll', plan, { passive: true })
    window.addEventListener('resize', plan)
    meet()
  }

  /* ── nav ───────────────────────────────────────────────── */
  function nav() {
    var balk = $('#nav')
    var knop = $('#burger')
    var lade = $('#drawer')

    if (balk) {
      var meet = function () {
        balk.classList.toggle('is-vast', window.scrollY > 24)
      }
      window.addEventListener('scroll', meet, { passive: true })
      meet()
    }
    if (!knop || !lade) return
    function zet(open) {
      knop.setAttribute('aria-expanded', open ? 'true' : 'false')
      lade.hidden = !open
      document.body.classList.toggle('is-vast', open)
    }
    knop.addEventListener('click', function () {
      zet(knop.getAttribute('aria-expanded') !== 'true')
    })
    $$('a', lade).forEach(function (a) {
      a.addEventListener('click', function () {
        zet(false)
      })
    })
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') zet(false)
    })
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) zet(false)
    })
  }

  /* ── leesbalk ──────────────────────────────────────────── */
  function leesbalk() {
    var balk = $('#prog i')
    if (!balk) return
    var bezig = false
    function meet() {
      var h = document.documentElement.scrollHeight - window.innerHeight
      balk.style.width = (h > 0 ? Math.min(1, window.scrollY / h) * 100 : 0) + '%'
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


  /* ── kop woord voor woord ──────────────────────────────── */
  function kinetiek() {
    var h = $('.kinetiek')
    if (!h || rustig) return
    var stuk = []
    Array.prototype.forEach.call(h.childNodes, function (n) {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach(function (w) {
          if (w.trim()) stuk.push({ t: w, em: false })
        })
      } else if (n.nodeType === 1) {
        n.textContent.split(/(\s+)/).forEach(function (w) {
          if (w.trim()) stuk.push({ t: w, em: n.tagName === 'EM' })
        })
      }
    })
    h.innerHTML = stuk
      .map(function (s, i) {
        return (
          '<span' +
          (s.em ? ' class="is-em"' : '') +
          '><i style="--d:' +
          (i * 70 + 90) +
          'ms">' +
          s.t +
          '</i></span> '
        )
      })
      .join('')
    $$('.is-em', h).forEach(function (s) {
      s.style.color = 'var(--accent)'
    })
  }


  /* ── tellers ───────────────────────────────────────────── */
  function tellers() {
    var els = $$('[data-tel]')
    if (!els.length) return
    if (rustig || !('IntersectionObserver' in window)) {
      els.forEach(function (e) {
        e.textContent = e.dataset.tel
      })
      return
    }
    var io = new IntersectionObserver(
      function (rijen) {
        rijen.forEach(function (r) {
          if (!r.isIntersecting) return
          var el = r.target
          io.unobserve(el)
          var doel = Number(el.dataset.tel)
          var start = performance.now()
          function stap(nu) {
            var p = Math.min(1, (nu - start) / 900)
            el.textContent = Math.round(doel * (1 - Math.pow(1 - p, 3)))
            if (p < 1) requestAnimationFrame(stap)
          }
          requestAnimationFrame(stap)
        })
      },
      { threshold: 0.4 }
    )
    els.forEach(function (e) {
      io.observe(e)
    })
  }

  /* ── galerij: de foto groot ────────────────────────────── */
  function galerij() {
    var bak = $('#gal')
    var lens = $('#lens')
    if (!bak || !lens) return
    var knoppen = $$('.gal__k', bak)
    var in_ = $('#lensIn')
    var tel = $('#lensTel')
    var nu = -1
    var terug = null

    function toon(i) {
      nu = (i + knoppen.length) % knoppen.length
      var bron = knoppen[nu]
      var mini = $('img', bron)
      // het grote bestand wordt pas hier opgehaald, niet bij het laden van de pagina
      in_.innerHTML = ''
      var beeld = document.createElement('img')
      beeld.src = bron.getAttribute('data-groot')
      beeld.alt = mini ? mini.alt : ''
      var bij = document.createElement('figcaption')
      bij.textContent = beeld.alt
      in_.appendChild(beeld)
      in_.appendChild(bij)
      tel.textContent = nu + 1 + ' van ' + knoppen.length
    }

    function open(i) {
      terug = knoppen[i]
      lens.hidden = false
      document.body.classList.add('is-vast')
      toon(i)
      $('#lensX').focus()
    }

    function dicht() {
      lens.hidden = true
      in_.innerHTML = ''
      document.body.classList.remove('is-vast')
      if (terug) terug.focus()
    }

    knoppen.forEach(function (k, i) {
      k.addEventListener('click', function () {
        open(i)
      })
    })
    $('#lensX').addEventListener('click', dicht)
    $('#lensVorig').addEventListener('click', function () {
      toon(nu - 1)
    })
    $('#lensVolgend').addEventListener('click', function () {
      toon(nu + 1)
    })
    lens.addEventListener('click', function (e) {
      if (e.target === lens || e.target === in_) dicht()
    })
    window.addEventListener('keydown', function (e) {
      if (lens.hidden) return
      if (e.key === 'Escape') dicht()
      if (e.key === 'ArrowLeft') toon(nu - 1)
      if (e.key === 'ArrowRight') toon(nu + 1)
    })

    // vegen op een telefoon
    var x0 = null
    lens.addEventListener(
      'touchstart',
      function (e) {
        x0 = e.touches[0].clientX
      },
      { passive: true }
    )
    lens.addEventListener(
      'touchend',
      function (e) {
        if (x0 === null) return
        var d = e.changedTouches[0].clientX - x0
        if (Math.abs(d) > 46) toon(nu + (d < 0 ? 1 : -1))
        x0 = null
      },
      { passive: true }
    )
  }

  /* ── knopglans volgt de muis ───────────────────────────── */
  function glans() {
    document.addEventListener('pointermove', function (e) {
      var b = e.target.closest ? e.target.closest('.btn') : null
      if (!b) return
      var r = b.getBoundingClientRect()
      b.style.setProperty('--mx', e.clientX - r.left + 'px')
      b.style.setProperty('--my', e.clientY - r.top + 'px')
    })
  }

  /* ── prijzen op het aanbod ─────────────────────────────── */
  function euro(n) {
    // 12.5 -> '€ 12,50' in het Nederlands, '€ 12.50' in het Engels
    if (EN) return '€ ' + n.toFixed(2).replace(/\.00$/, '')
    return '€ ' + n.toFixed(2).replace('.', ',').replace(/,00$/, ',-')
  }

  // undefined = dit artikel staat niet in TARIEF, null = nog geen bedrag
  function bedrag(naam) {
    if (!Object.prototype.hasOwnProperty.call(TARIEF, naam)) return undefined
    var r = parseFloat(String(TARIEF[naam]).replace(',', '.'))
    return isFinite(r) && r > 0 ? r : null
  }

  function prijzen() {
    $$('.pkaart').forEach(function (k) {
      var em = $('.prijs', k)
      if (!em) return
      // data-sleutel staat op de Engelse kaarten: de naam die de bezoeker
      // ziet is Engels, maar TARIEF blijft één lijst op de Nederlandse naam.
      var p = bedrag(k.dataset.sleutel || k.dataset.artikel)
      if (p === undefined) return em.classList.add('prijs--onbekend')
      if (p === null) return
      var e = k.dataset.eenheid || ''
      em.className = 'prijs prijs--vast'
      em.innerHTML = '<b>' + euro(p) + '</b>' + (e ? ' <span>' + (EENHEID[e] || e) + '</span>' : '')
    })

    var regel = $('#prijsRegel')
    if (!regel) return
    var stuk = ''
    if (PRIJS.btw === 'incl') stuk = W.prijsIncl
    else if (PRIJS.btw === 'excl') stuk = W.prijsExcl
    if (stuk && PRIJS.dekt) stuk += W.enGelden + PRIJS.dekt
    else if (!stuk && PRIJS.dekt) stuk = W.gelden + PRIJS.dekt
    if (!stuk) return regel.remove()
    regel.textContent = stuk + '.'
  }

  /* ── prijzen op de badkamerpakketten ───────────────────── */
  function rond(v) {
    var r = parseFloat(String(v).replace(/\./g, '').replace(',', '.'))
    return isFinite(r) && r > 0 ? r : null
  }

  function euroRond(n) {
    return '€ ' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, EN ? ',' : '.')
  }

  /* Het regeltje onder het bedrag op de kaart zelf. Materiaal en btw in
     één zin, want los van elkaar leest niemand ze. */
  function kaartRegel() {
    if (PAKKETPRIJS.materiaal === 'in') {
      if (PAKKETPRIJS.btw === 'incl') return W.kaartInIncl
      if (PAKKETPRIJS.btw === 'excl') return W.kaartInExcl
      return W.kaartIn
    }
    if (PAKKETPRIJS.materiaal === 'apart') {
      if (PAKKETPRIJS.btw === 'incl') return W.kaartApartIncl
      if (PAKKETPRIJS.btw === 'excl') return W.kaartApartExcl
      return W.kaartApart
    }
    return ''
  }

  function pakketten() {
    var kaarten = $$('.pakket')
    if (!kaarten.length) return
    var opKaart = kaartRegel()

    kaarten.forEach(function (k) {
      var em = $('.ppr', k)
      if (!em) return
      var p = PAKKET[k.dataset.pakket]
      if (!p) return em.classList.add('ppr--onbekend')
      var van = rond(p.van)
      var tot = rond(p.tot)
      if (!van) return
      em.className = 'ppr ppr--vast'
      em.innerHTML =
        '<i>' +
        (tot && tot > van ? W.richtprijs : W.vanaf) +
        '</i><b>' +
        euroRond(van) +
        (tot && tot > van ? ' &ndash; ' + euroRond(tot) : '') +
        '</b>'
      if (!opKaart || $('.pakket__dekt', k)) return
      var d = document.createElement('p')
      d.className = 'pakket__dekt'
      d.textContent = opKaart
      em.parentNode.insertBefore(d, em.nextSibling)
    })

    var regel = $('#pakketRegel')
    if (!regel) return
    var dekt = ''
    if (PAKKETPRIJS.materiaal === 'in') dekt = W.dektIn
    else if (PAKKETPRIJS.materiaal === 'apart') dekt = W.dektApart
    var stuk = ''
    if (PAKKETPRIJS.btw === 'incl') stuk = W.bedragIncl
    else if (PAKKETPRIJS.btw === 'excl') stuk = W.bedragExcl
    if (stuk && dekt) stuk += W.enDekken + dekt
    else if (!stuk && dekt) stuk = W.dekken + dekt
    if (!stuk) return regel.remove()
    regel.textContent = stuk + '.'
  }

  /* ── wensenlijst ───────────────────────────────────────── */
  var wensen = {
    lees: function () {
      try {
        var r = JSON.parse(localStorage.getItem(SLEUTEL) || '[]')
        return Array.isArray(r) ? r : []
      } catch (e) {
        return []
      }
    },
    schrijf: function (r) {
      try {
        localStorage.setItem(SLEUTEL, JSON.stringify(r))
      } catch (e) {}
    },
  }

  function lijst() {
    var kaarten = $$('.mkaart, .pkaart')
    var bak = $('#chipsMat')
    var veld = $('#matVeld')
    var hint = $('#matHint')
    var balk = $('#balk')
    var balkTxt = $('#balkTxt')
    var balkLeeg = $('#balkLeeg')
    var opContact = !!bak

    var gekozen = wensen.lees()

    function teken() {
      wensen.schrijf(gekozen)

      kaarten.forEach(function (k) {
        var aan = gekozen.indexOf(k.dataset.artikel) !== -1
        k.classList.toggle('is-aan', aan)
        k.setAttribute('aria-pressed', aan ? 'true' : 'false')
        var knop = $('.pkaart__knop', k)
        if (knop) knop.textContent = aan ? W.staatErin : W.zetErin
      })

      if (hint) {
        hint.classList.toggle('is-vol', gekozen.length > 0)
        hint.textContent = gekozen.length
          ? gekozen.length === 1
            ? W.hintEen
            : gekozen.length + W.hintMeer
          : W.hintLeeg
      }

      if (bak && veld) {
        bak.innerHTML = gekozen
          .map(function (naam) {
            return (
              '<label class="chip"><input type="checkbox" name="materiaal_item" value="' +
              naam +
              '" checked /><span>' +
              naam +
              '</span></label>'
            )
          })
          .join('')
        veld.hidden = gekozen.length === 0
        $$('input', bak).forEach(function (inp) {
          inp.addEventListener('change', function () {
            if (inp.checked) return
            gekozen = gekozen.filter(function (n) {
              return n !== inp.value
            })
            teken()
          })
        })
      }

      if (balk && balkTxt) {
        var toon = gekozen.length > 0 && !opContact
        balk.hidden = !toon
        if (toon) {
          balkTxt.innerHTML =
            '<b>' +
            gekozen.length +
            '</b>' +
            W.inLijst +
            gekozen.slice(0, 3).join(', ') +
            (gekozen.length > 3 ? W.enMeer + (gekozen.length - 3) + W.meer : '')
        }
      }
    }

    kaarten.forEach(function (k) {
      k.setAttribute('aria-pressed', 'false')
      k.addEventListener('click', function () {
        var naam = k.dataset.artikel
        gekozen =
          gekozen.indexOf(naam) !== -1
            ? gekozen.filter(function (n) {
                return n !== naam
              })
            : gekozen.concat(naam)
        teken()
      })
    })

    if (balkLeeg)
      balkLeeg.addEventListener('click', function () {
        gekozen = []
        teken()
      })

    teken()
  }

  /* ── filter op het aanbod ──────────────────────────────── */
  function filter() {
    var bak = $('#filter')
    var grid = $('#pgrid')
    if (!bak || !grid) return
    var knoppen = $$('.filter__k', bak)
    var kaarten = $$('.pkaart', grid)
    var tel = $('#filterTel')

    knoppen.forEach(function (k) {
      k.addEventListener('click', function () {
        var toon = k.dataset.toon
        knoppen.forEach(function (x) {
          x.classList.toggle('is-aan', x === k)
          x.setAttribute('aria-pressed', x === k ? 'true' : 'false')
        })
        var n = 0
        kaarten.forEach(function (c) {
          var aan = toon === 'alles' || c.dataset.groep === toon
          c.hidden = !aan
          if (aan) {
            n++
            c.classList.add('is-in')
          }
        })
        if (tel) tel.textContent = n === 1 ? W.artikel : n + W.artikelen
      })
      k.setAttribute('aria-pressed', k.classList.contains('is-aan') ? 'true' : 'false')
    })
    if (tel) tel.textContent = kaarten.length + W.artikelen

    // /aanbod#tegels komt van de home: zet dat filter meteen aan.
    var uit = (location.hash || '').slice(1)
    if (uit) {
      var start = knoppen.filter(function (k) {
        return k.dataset.toon === uit
      })[0]
      if (start) start.click()
    }
  }

  /* ── formulier ───────────────────────────────────────────
     De aanvraag gaat naar de worker in worker/index.ts, die hem met
     @jiw/cloudflare-forms doorstuurt: een mail aan ons en een bevestiging aan de
     aanvrager. Daarvoor stond hier een Formspark-adres dat nooit ingevuld is, dus
     verstuurde dit formulier niets. */
  function formulier() {
    var form = $('#form')
    if (!form) return
    var knop = $('#formKnop')
    var fout = $('#formFout')
    var dank = $('#dank')
    var dankTekst = $('#dankTekst')
    var MAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/
    var bezig = false

    // Het adres hangt aan de taal van de pagina, en elke taal heeft zijn eigen
    // worker: daar komt de taal van de bevestigingsmail uit.
    var ENDPOINT = EN ? '/api/forms/en/quote' : '/api/forms/offerte'

    function toon(bericht) {
      fout.textContent = bericht
      fout.hidden = !bericht
    }

    function mis(veld, bericht) {
      toon(bericht)
      veld.classList.add('is-fout')
      veld.focus()
    }

    function klaar() {
      $$('.form__rij, fieldset, label.veld, .lok, #formKnop, .form__klein', form).forEach(function (el) {
        el.hidden = true
      })
      dank.hidden = false
      $('h3', dank).textContent = W.dankKop
      dankTekst.textContent = W.dankTxt
      dank.scrollIntoView({ behavior: rustig ? 'auto' : 'smooth', block: 'center' })
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault()
      if (bezig) return
      toon('')
      $$('.is-fout', form).forEach(function (el) {
        el.classList.remove('is-fout')
      })

      var fd = new FormData(form)
      var voornaam = String(fd.get('firstName') || '').trim()
      var telefoon = String(fd.get('telefoon') || '').trim()
      var mail = String(fd.get('email') || '').trim()

      if (!voornaam) return mis(form.elements.firstName, W.foutNaam)
      if (!telefoon) return mis(form.elements.telefoon, W.foutTel)
      if (!mail || !MAIL.test(mail)) return mis(form.elements.email, W.foutMail)

      // De vinkjes staan tien keer onder dezelfde naam in het formulier, en de
      // wensenlijst nog eens. De worker leest per naam één waarde, dus hij zou negen
      // vinkjes kwijtraken: samenvoegen tot één regel voordat hij de deur uit gaat.
      ;['werk', 'materiaal_item'].forEach(function (naam) {
        var waarden = fd.getAll(naam)
        fd.delete(naam)
        if (waarden.length) fd.set(naam, waarden.join(', '))
      })

      bezig = true
      knop.disabled = true
      knop.textContent = W.bezig
      fetch(ENDPOINT, { method: 'POST', body: fd, headers: { accept: 'application/json' } })
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
              try {
                localStorage.removeItem(SLEUTEL)
              } catch (e3) {}
              klaar()
            })
        })
        .catch(function (err) {
          bezig = false
          knop.disabled = false
          knop.textContent = W.verstuur
          toon((err && err.melding) || W.foutVerzend)
        })
    })
  }

  /* ── start ─────────────────────────────────────────────── */
  // contactUitrollen(), reveal() en parallax() stonden hier. Het eerste zet bouw.mjs
  // nu in de HTML (een telefoonnummer dat alleen in JS staat, leest een zoekmachine
  // niet), de andere twee waren beweging die inhoud achter JS zette.
  var jaar = $('#jaar')
  if (jaar) jaar.textContent = String(new Date().getFullYear())
  nav()
  leesbalk()
  kinetiek()
  tellers()
  glans()
  galerij()
  prijzen()
  pakketten()
  lijst()
  filter()
  formulier()
  // als laatste: dok() zoekt alle offerteknoppen en formulieren op de pagina op,
  // dus alles wat hierboven iets neerzet moet er al staan
  dok()
})()
