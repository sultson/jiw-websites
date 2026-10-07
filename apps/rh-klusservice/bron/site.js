/* Alles wat op elke pagina draait: de zwevende WhatsApp-knop,
   de fotocarrousel in de hero, de schuifrij met beoordelingen, het schermvullend
   openen van foto's en de cookiemelding. Elk blok stapt er zelf uit als het
   onderdeel op deze pagina niet bestaat. */
(function(){
  'use strict';

  var rust = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ================= zwevende WhatsApp =================
     Uit beeld zodra er al een WhatsApp-knop op het scherm staat, bijvoorbeeld
     in de hero of onderaan bij contact. Twee groene knoppen tegelijk is
     op een telefoon te druk. */
  (function(){
    var zweef = document.querySelector('.zweef');
    if (!zweef) return;

    var cta = document.querySelectorAll('.knop--wa, .rij--wa');
    if (!cta.length || !('IntersectionObserver' in window)) return;

    // bijhouden welke knoppen in beeld staan, niet optellen en aftrekken:
    // een teller loopt scheef zodra er een melding gemist wordt
    var inBeeld = [];
    var kijker = new IntersectionObserver(function(regels){
      regels.forEach(function(r){
        var i = inBeeld.indexOf(r.target);
        if (r.isIntersecting && i < 0) inBeeld.push(r.target);
        if (!r.isIntersecting && i > -1) inBeeld.splice(i, 1);
      });
      zweef.classList.toggle('is-weg', inBeeld.length > 0);
    }, {rootMargin: '-10px 0px -10px 0px', threshold: 0.35});

    Array.prototype.forEach.call(cta, function(k){ kijker.observe(k); });
  })();

  /* ================= hero: wisselende foto's ================= */
  (function(){
    var dia = document.querySelector('.dia');
    if (!dia) return;
    var fotos = Array.prototype.slice.call(dia.querySelectorAll('.dia__foto'));
    var stippen = dia.querySelector('.dia__stippen');
    var terug = dia.querySelector('.dia__pijl--terug');
    var verder = dia.querySelector('.dia__pijl--verder');

    if (fotos.length < 2) {
      [stippen, terug, verder].forEach(function(e){ if (e) e.remove(); });
      return;
    }

    var nu = 0, klok = null, vast = false;

    fotos.forEach(function(_, i){
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'dia__stip';
      b.setAttribute('aria-label', 'Foto ' + (i+1) + ' van ' + fotos.length);
      b.setAttribute('aria-current', String(i === 0));
      b.addEventListener('click', function(){ naar(i); start(); });
      stippen.appendChild(b);
    });
    var knoppen = Array.prototype.slice.call(stippen.children);

    function naar(i){
      if (vast) return;
      i = (i + fotos.length) % fotos.length;
      if (i === nu) return;
      var oud = fotos[nu];

      // de zoom bevriezen op de stand van nu. Haal je alleen de klasse weg, dan
      // valt de foto terug naar zijn beginformaat en zie je hem terugspringen
      // terwijl de nieuwe er nog over aan het schuiven is.
      var vorm = getComputedStyle(oud).transform;
      oud.style.transform = (vorm && vorm !== 'none') ? vorm : '';
      oud.classList.remove('is-aan', 'dia--uit');
      oud.classList.add('is-af');

      nu = i;
      var nieuw = fotos[nu];
      nieuw.classList.remove('is-af');
      nieuw.style.transform = '';
      void nieuw.offsetWidth;  // anders begint de zoom niet opnieuw
      nieuw.classList.add('is-aan');
      if (nu % 2) nieuw.classList.add('dia--uit');

      // de oude mag weg zodra de nieuwe er helemaal overheen ligt
      clearTimeout(oud.dataset.klok);
      oud.dataset.klok = setTimeout(function(){
        oud.classList.remove('is-af');
        oud.style.transform = '';
      }, 1200);

      knoppen.forEach(function(b, j){ b.setAttribute('aria-current', String(j === nu)); });
    }
    function start(){
      stop();
      if (vast || rust.matches) return;
      klok = setInterval(function(){ naar(nu + 1); }, 6500);
    }
    function stop(){ if (klok) { clearInterval(klok); klok = null; } }

    terug.addEventListener('click', function(){ naar(nu - 1); start(); });
    verder.addEventListener('click', function(){ naar(nu + 1); start(); });

    // vegen op een telefoon. Alleen reageren als de veeg duidelijk horizontaal
    // is, anders vangen we het verticale scrollen van de pagina af.
    var x0 = null, y0 = null;
    dia.addEventListener('touchstart', function(e){
      var t = e.changedTouches[0];
      x0 = t.clientX; y0 = t.clientY;
      stop();
    }, {passive:true});
    dia.addEventListener('touchend', function(e){
      if (x0 === null) return;
      var t = e.changedTouches[0];
      var dx = t.clientX - x0, dy = t.clientY - y0;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) naar(nu + (dx < 0 ? 1 : -1));
      x0 = y0 = null;
      start();
    }, {passive:true});

    // niet doorlopen als het tabblad op de achtergrond staat
    document.addEventListener('visibilitychange', function(){
      if (document.hidden) stop(); else start();
    });
    dia.addEventListener('mouseenter', stop);
    dia.addEventListener('mouseleave', start);

    start();
  })();

  /* ================= beoordelingen: schuiven en Lees meer ================= */
  (function(){
    var lijst = document.querySelector('.ws__lijst');
    if (!lijst) return;

    // een beoordeling die niet in zes regels past krijgt een knop. De kaarten
    // zijn daardoor allemaal even hoog tot iemand er zelf een openklapt.
    // Pas meten als het lettertype binnen is: met de terugvalletter passen er
    // andere aantallen regels in en zetten we de knop bij de verkeerde kaarten.
    /* Eerst alle 41 kaarten meten en daarna pas alle knoppen plaatsen, en niet
       om en om. Dat laatste deed het hier tot 07-10-2026 wel, en dat is de
       duurste fout die je op een pagina met een lange lijst kunt maken: na elke
       knop die erbij komt is de opmaak ongeldig, dus moet de browser die voor de
       volgende meting volledig opnieuw rekenen. Een en veertig keer.

       In de meting van Alfred stond dat als een taak van 438 ms op site.js en als
       1043 ms "Style & Layout" — bij elkaar vrijwel de hele blokkeertijd van de
       pagina. Gesplitst is het een opmaakberekening in plaats van een en veertig. */
    function knippen(){
      var kaarten = Array.prototype.slice.call(lijst.querySelectorAll('.review'));
      var teLang = [];

      // lezen
      for (var i = 0; i < kaarten.length; i++) {
        if (kaarten[i].classList.contains('heeft-meer')) continue;
        var p = kaarten[i].querySelector('p');
        if (p && p.scrollHeight > p.clientHeight + 2) teLang.push([kaarten[i], p]);
      }

      // en dan schrijven
      for (var j = 0; j < teLang.length; j++) {
        (function(kaart, tekst){
          var knop = document.createElement('button');
          knop.type = 'button';
          knop.className = 'review__meer';
          knop.textContent = 'Lees meer';
          knop.addEventListener('click', function(){
            var open = kaart.classList.toggle('is-open');
            knop.textContent = open ? 'Minder tonen' : 'Lees meer';
          });
          tekst.insertAdjacentElement('afterend', knop);
          kaart.classList.add('heeft-meer');
        })(teLang[j][0], teLang[j][1]);
      }
    }

    /* Twee voorwaarden voordat er gemeten wordt.

       Het lettertype moet binnen zijn: met de terugvalletter passen er andere
       aantallen regels in en zet je de knop bij de verkeerde kaarten.

       En het blok moet in de buurt van het scherm staan. Ook netjes gesplitst
       kost dit een opmaakberekening over 41 kaarten, en op een telefoon staat dit
       blok ruim twee schermen onder de vouw. Dat hoort niet in de tijd te zitten
       waarin de bezoeker op de bovenkant zit te wachten.

       Let op: dit verbergt niets. De tekst staat er in zijn geheel in het HTML en
       wordt door CSS op zes regels gehouden; het enige wat later komt is de knop
       "Lees meer". Dat is iets anders dan inhoud pas tonen als JavaScript draait. */
    var geknipt = false;
    function knippenNu(){
      if (geknipt) return;
      geknipt = true;
      if (window.requestIdleCallback) requestIdleCallback(knippen, {timeout:1500});
      else setTimeout(knippen, 60);
    }
    function klaarOm(){
      if (!window.IntersectionObserver) return knippenNu();
      var kijker = new IntersectionObserver(function(regels){
        if (!regels.some(function(r){ return r.isIntersecting; })) return;
        kijker.disconnect();
        knippenNu();
      }, {rootMargin: '400px'});
      kijker.observe(lijst);
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(klaarOm);
    else window.addEventListener('load', klaarOm);

    var terug = document.querySelector('[data-ws="terug"]');
    var verder = document.querySelector('[data-ws="verder"]');
    if (!terug || !verder) return;

    // Er staan 41 beoordelingen in de rij, dus een pijl schuift een scherm vol
    // door en niet een kaart. Een heel aantal kaarten, anders valt hij naast
    // een punt van scroll-snap en springt de rij terug.
    function stap(){
      var kaart = lijst.querySelector('.review');
      if (!kaart) return 340;
      var breed = kaart.getBoundingClientRect().width + 18;
      return breed * Math.max(1, Math.floor(lijst.clientWidth / breed));
    }
    function stand(){
      var rest = lijst.scrollWidth - lijst.clientWidth;
      terug.disabled = lijst.scrollLeft < 8;
      verder.disabled = lijst.scrollLeft > rest - 8;
    }
    /* Niet meteen meten. scrollWidth opvragen terwijl de pagina nog aan zijn
       eerste opmaak bezig is, dwingt de browser die alsnog af te ronden voordat
       hij verder leest; dat stond in de meting van Alfred (07-10-2026) als
       "forced reflow, 31 ms" op deze regel, en het is de duurste van de twee.

       Het beginpunt is bekend zonder te meten: de rij staat links, dus terug kan
       niet en verder wel. De echte stand volgt zodra de browser niets te doen
       heeft, en daarna bij elke scroll — gebundeld per beeldje, want anders staat
       er een opmaakberekening in elke scrollstap. */
    var geplanned = 0;
    function standStraks(){
      if (geplanned) return;
      geplanned = requestAnimationFrame(function(){ geplanned = 0; stand(); });
    }
    terug.addEventListener('click', function(){ lijst.scrollBy({left:-stap(), behavior:'smooth'}); });
    verder.addEventListener('click', function(){ lijst.scrollBy({left:stap(), behavior:'smooth'}); });
    lijst.addEventListener('scroll', standStraks, {passive:true});
    window.addEventListener('resize', standStraks);

    terug.disabled = true;
    verder.disabled = false;
    if (window.requestIdleCallback) requestIdleCallback(stand, {timeout:1000});
    else setTimeout(stand, 300);
  })();

  /* ================= foto schermvullend =================
     De dienstkaarten, het mozaiek bij ons werk, de foto bij over ons en de
     galerij op projecten. Per blok loop je met de pijlen door die reeks. */
  (function(){
    var groepen = [
      {kies: '.inzicht__beeld img'},
      {kies: '.galerij figure'}
    ].map(function(g){
      return Array.prototype.slice.call(document.querySelectorAll(g.kies));
    }).filter(function(a){ return a.length; });

    if (!groepen.length) return;

    /* De kaarten dragen de kleine versie; schermvullend hoort de grote erin.
       Waar die staat zet maak-snel.mjs als data-groot op de <img>. Zelf uit de
       bestandsnaam rekenen kan sinds 07-10-2026 niet meer: elke foto zit in een
       <picture> met een reeks breedtes, dus currentSrc is iets als
       dakraam-nis-klein-314.avif en daar valt het origineel niet uit af te leiden.
       De terugval blijft voor een foto die nog geen data-groot heeft. */
    function groot(img){
      return img.getAttribute('data-groot')
        || (img.currentSrc || img.src).replace(/-klein(\.\w+)$/, '$1');
    }

    function lees(el){
      var img = el.tagName === 'IMG' ? el : el.querySelector('img');
      if (!img) return null;
      var kop = el.querySelector('h3');
      var uitleg = el.querySelector('.dienst__tekst p, figcaption');
      return {
        src: groot(img),
        alt: img.alt || '',
        kop: kop ? kop.textContent : '',
        tekst: uitleg ? uitleg.textContent : (el.tagName === 'IMG' ? img.alt : '')
      };
    }

    var venster = document.createElement('div');
    venster.className = 'licht';
    venster.setAttribute('role', 'dialog');
    venster.setAttribute('aria-modal', 'true');
    venster.setAttribute('aria-label', 'Foto schermvullend');
    venster.innerHTML =
      '<button type="button" class="licht__sluit" aria-label="Sluiten">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<button type="button" class="licht__pijl licht__pijl--terug" aria-label="Vorige foto">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 8 12l7 7"/></svg></button>' +
      '<button type="button" class="licht__pijl licht__pijl--verder" aria-label="Volgende foto">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button>' +
      '<img alt="">' +
      '<div class="licht__bij"><h3></h3><p></p><span class="licht__tel"></span></div>';
    document.body.appendChild(venster);

    var vBeeld = venster.querySelector('img');
    var vKop = venster.querySelector('.licht__bij h3');
    var vTekst = venster.querySelector('.licht__bij p');
    var vTel = venster.querySelector('.licht__tel');
    var vTerug = venster.querySelector('.licht__pijl--terug');
    var vVerder = venster.querySelector('.licht__pijl--verder');

    var reeks = [], stand = 0, vanwaar = null;

    function toon(i){
      stand = (i + reeks.length) % reeks.length;
      var d = lees(reeks[stand]);
      if (!d) return;
      vBeeld.src = d.src;
      vBeeld.alt = d.alt;
      vKop.textContent = d.kop;
      vKop.hidden = !d.kop;
      vTekst.textContent = d.tekst;
      vTekst.hidden = !d.tekst;
      vTel.textContent = reeks.length > 1 ? (stand + 1) + ' van ' + reeks.length : '';
      var meer = reeks.length > 1;
      vTerug.hidden = !meer;
      vVerder.hidden = !meer;
    }
    function open(groep, el){
      // op projecten staat een filter aan: wat verborgen is hoort ook niet in
      // de reeks waar je met de pijlen doorheen loopt
      reeks = groep.filter(function(e){ return !e.hidden && e.offsetParent !== null; });
      if (reeks.indexOf(el) < 0) reeks = [el];
      vanwaar = el;
      toon(reeks.indexOf(el));
      venster.classList.add('is-aan');
      document.body.classList.add('licht-aan');
      venster.querySelector('.licht__sluit').focus();
    }
    function sluit(){
      venster.classList.remove('is-aan');
      document.body.classList.remove('licht-aan');
      if (vanwaar && vanwaar.focus) vanwaar.focus();
    }

    venster.querySelector('.licht__sluit').addEventListener('click', sluit);
    vTerug.addEventListener('click', function(){ toon(stand - 1); });
    vVerder.addEventListener('click', function(){ toon(stand + 1); });
    // klikken naast de foto sluit; op de foto of de tekst zelf niet
    venster.addEventListener('click', function(e){ if (e.target === venster) sluit(); });
    document.addEventListener('keydown', function(e){
      if (!venster.classList.contains('is-aan')) return;
      if (e.key === 'Escape') sluit();
      if (e.key === 'ArrowLeft') toon(stand - 1);
      if (e.key === 'ArrowRight') toon(stand + 1);
    });

    groepen.forEach(function(groep){
      groep.forEach(function(el){
        // De kaart is bewust geen <button>: dan zou de h3 uit de koppenlijst van
        // de pagina verdwijnen, en juist die dienstnamen moeten koppen blijven.
        // De rol en de toetsenbediening komen hier.
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        if (!el.getAttribute('aria-label')) {
          var kop = el.querySelector('h3');
          var i = el.tagName === 'IMG' ? el : el.querySelector('img');
          el.setAttribute('aria-label', 'Vergroot: ' + ((kop && kop.textContent) || (i && i.alt) || 'foto'));
        }
        el.addEventListener('keydown', function(e){
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(groep, el); }
        });
        el.addEventListener('click', function(){
          open(groep, el);
        });
      });
    });
  })();

  /* ================= offerteformulier =================
     Sinds 07-10-2026 gaat de aanvraag naar onze eigen worker
     (/api/forms/offerte, @jiw/cloudflare-forms) en niet meer naar formsubmit.co.
     Die antwoordt met JSON, dus de pagina moet zelf versturen en zelf zeggen
     dat het gelukt is: er komt geen bedanktpagina meer tussen.

     Op de homepagina staan twee formulieren met dezelfde velden (#offerte-boven
     en #offerte), dus dit loopt over alle formulieren op de pagina. */
  (function(){
    var TEL = '06 31 29 51 56';
    var formulieren = document.querySelectorAll('form.form--aanvraag');
    if (!formulieren.length) return;

    Array.prototype.forEach.call(formulieren, function(form){
      var knop = form.querySelector('button[type=submit]');
      var melding = form.querySelector('.form__melding');
      var opschrift = knop ? knop.textContent : 'Offerte aanvragen';

      function meld(tekst){
        if (!melding) return;
        melding.textContent = tekst || '';
        if (tekst) melding.removeAttribute('hidden'); else melding.setAttribute('hidden', '');
      }

      /* Het e-mailadres is optioneel. Wie het invulde krijgt een bevestiging van
         de worker en hoort dat hier ook, zodat niemand zijn inbox in gaat zoeken
         naar een mail die nooit komt. Wie het oversloeg leest alleen dat hij
         gebeld wordt, net als voorheen. */
      function gelukt(metMail){
        var blok = document.createElement('div');
        blok.className = 'form__klaar';
        blok.setAttribute('role', 'status');
        blok.innerHTML =
          '<span class="vink" aria-hidden="true">&#10003;</span>' +
          '<h3>Uw aanvraag is binnen</h3>' +
          '<p>' + (metMail ? 'U krijgt er een bevestiging van per e-mail. ' : '') +
          'We bellen u op het nummer dat u heeft ingevuld. Heeft u haast, bel dan zelf: ' +
          '<a href="tel:+31631295156">' + TEL + '</a>.</p>';
        form.replaceWith(blok);
        blok.scrollIntoView({ block: 'center', behavior: rust.matches ? 'auto' : 'smooth' });
      }

      form.addEventListener('submit', function(e){
        e.preventDefault();
        meld('');

        var fd = new FormData(form);
        if (!String(fd.get('firstName') || '').trim()) {
          meld('Vul uw naam in.');
          form.elements.firstName.focus();
          return;
        }
        if (!String(fd.get('telefoon') || '').trim()) {
          meld('Vul uw telefoonnummer in, dan kunnen wij u bereiken.');
          form.elements.telefoon.focus();
          return;
        }

        if (knop) { knop.disabled = true; knop.textContent = 'Versturen...'; }
        fetch(form.getAttribute('action'), {
          method: 'POST',
          body: fd,
          headers: { accept: 'application/json' }
        })
          .then(function(r){
            return r.json().catch(function(){ return null; }).then(function(j){
              if (!r.ok || !j || j.ok !== true) {
                // de worker zegt zelf welk veld eraan schort; dat leest beter dan "mislukt"
                var fout = new Error('formulier');
                fout.melding = j && j.message;
                throw fout;
              }
              gelukt(Boolean(String(fd.get('email') || '').trim()));
            });
          })
          .catch(function(err){
            if (knop) { knop.disabled = false; knop.textContent = opschrift; }
            meld((err && err.melding) ||
              'Versturen lukte niet. Probeer het nog eens, of bel ' + TEL + '.');
          });
      });
    });
  })();

  /* ================= cookiemelding ================= */
  (function(){
    var sleutel = 'rh-koek';
    try { if (localStorage.getItem(sleutel) === 'ja') return; } catch(e){}

    var balk = document.createElement('div');
    balk.className = 'koek';
    balk.setAttribute('role', 'region');
    balk.setAttribute('aria-label', 'Cookiemelding');
    balk.innerHTML =
      '<p>Deze site gebruikt alleen functionele opslag, om te onthouden dat u deze ' +
      'melding gezien heeft. <b>Er wordt niets over u gevolgd of gedeeld.</b></p>' +
      '<button type="button" class="knop">Akkoord</button>';

    var zweef = document.querySelector('.zweef');
    if (zweef) document.body.insertBefore(balk, zweef); else document.body.appendChild(balk);

    /* De zwevende WhatsApp-knop moet erboven uitkomen; de hoogte hangt af van
       hoeveel regels de tekst op dit scherm pakt, dus die meten we.

       Meteen en niet in een requestAnimationFrame, al is dit wat Lighthouse een
       forced reflow noemt. Geprobeerd, en gemeten: in een beeldje erna staat de
       knop één beeld lang op zijn oude plek en springt dan omhoog. Dat kostte
       0,017 aan verschuiving tegen 2 ms opmaak die je hier bespaart, en dit script
       draait met defer dus die opmaak gebeurt vóór het eerste beeld — er wordt
       niets weggegooid wat al getekend was. Verschuiving telt mee in de score,
       die 2 ms niet.

       De resize erna wél gebundeld: daar is geen eerste beeld meer in het spel. */
    var meting = 0;
    function meet(){
      document.documentElement.style.setProperty('--koek-h', balk.offsetHeight + 'px');
    }
    function meetStraks(){
      if (meting) return;
      meting = requestAnimationFrame(function(){ meting = 0; meet(); });
    }
    meet();
    requestAnimationFrame(function(){ balk.classList.add('is-aan'); });
    window.addEventListener('resize', meetStraks);

    balk.querySelector('.knop').addEventListener('click', function(){
      try { localStorage.setItem(sleutel, 'ja'); } catch(e){}
      balk.classList.remove('is-aan');
      setTimeout(function(){ balk.remove(); }, 400);
    });
  })();
})();
