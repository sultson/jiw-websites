// uitklapmenu op de telefoon
const kop = document.querySelector('.kop');
const knop = document.querySelector('.menu-knop');
knop.addEventListener('click', () => {
  const open = kop.classList.toggle('is-open');
  knop.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.menu a').forEach(a =>
  a.addEventListener('click', () => kop.classList.remove('is-open'))
);

// welk menu-item is aan de beurt
//
// De sleutel is het fragment van de link en niet href.slice(1). Dat tweede
// stond er tot de verhuizing, en toen waren de adressen relatief: een menu-item
// was href="#over" en slice(1) gaf "over". Nu zijn ze absoluut en per taal
// (/#over, /ro/#over, /ro/smaken), dus slice(1) gaf "#over" of "ro/smaken" en
// kwam de kaart nooit meer overeen met een section-id. Het menu-item lichtte
// dan nergens meer op. Via new URL(a.href).hash komt het fragment eruit,
// ongeacht de taal of de map waar de pagina staat.
const vlakken = [...document.querySelectorAll('section[id]')];
const links = new Map([...document.querySelectorAll('.menu a')]
  .map(a => [new URL(a.href, location.href).hash.slice(1), a])
  .filter(([id]) => id));
if ('IntersectionObserver' in window) {
  const waarnemer = new IntersectionObserver(items => {
    items.forEach(i => {
      if (!i.isIntersecting) return;
      // op een assortimentspagina blijft "Assortiment" aan staan, waar je ook bent
      links.forEach(a => { if (!a.classList.contains('is-blad')) a.classList.remove('is-nu'); });
      const a = links.get(i.target.id);
      if (a) a.classList.add('is-nu');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  vlakken.forEach(v => waarnemer.observe(v));
}

// meelopende knoppen: pas voorbij de opener, en niet bovenop het formulier
const dock = document.getElementById('dock');
let formulierInBeeld = false;
if ('IntersectionObserver' in window) {
  const w = new IntersectionObserver(items => {
    formulierInBeeld = items.some(i => i.isIntersecting);
    stand();
  }, { threshold: 0.15 });
  [document.getElementById('contact'), document.getElementById('bestellen')].filter(Boolean).forEach(v => w.observe(v));
}
function stand() {
  const hoogte = window.scrollY || document.documentElement.scrollTop || 0;
  const hero = document.querySelector('.hero');
  dock.classList.toggle('is-uit', hoogte > (hero ? hero.offsetHeight * 0.7 : 300) && !formulierInBeeld);
}
window.addEventListener('scroll', stand, { passive: true });
window.addEventListener('resize', stand);
stand();


/* ---------- aanvraagformulier ----------
   Tot de verhuizing bundelde dit blok de antwoorden tot een WhatsApp-bericht en
   opende het wa.me in een nieuw tabblad. Dat werkte, maar de bezoeker hield
   zelf niets over, de inspiratiefoto moest hij daarna nog los sturen, en bij
   een geblokkeerde pop-up verdween de aanvraag zonder dat iemand het merkte.

   Het post nu naar /api/forms/aanvraag op dezelfde hostnaam. Anka krijgt een
   mail met de aanvraag en de bezoeker een bevestiging in de taal van de pagina.

   De drie regels die hier getoond kunnen worden staan als data-attribuut op het
   formulier (data-dank, data-mis, data-bezig), door de bouw in de taal van de
   pagina gezet. Zo is dit bestand hetzelfde voor alle drie de talen en hoeft er
   geen tekstbestand ingeladen te worden om in het Roemeens te kunnen antwoorden.

   Mislukt het versturen, dan staat er niet "er ging iets fout" maar haar
   WhatsApp-nummer: dat is de weg die het altijd deed, en een bezoeker die net
   de datum van zijn bruiloft heeft ingetypt hoort niet met niets achter te
   blijven. */
const formulier = document.querySelector('form[action="/api/forms/aanvraag"]');
if (formulier) {
  const melding = formulier.querySelector('[data-melding]');
  const knop = formulier.querySelector('[type="submit"]');
  const knopTekst = knop ? knop.innerHTML : '';

  /* `soort` is 'goed', 'mis' of 'bezig'. Drie klassen in plaats van een
     ja/nee, want tijdens het versturen is het geen van beide en een lopende
     verzending in het groen melden is liegen over iets dat nog kan mislukken. */
  const zeg = (tekst, soort) => {
    if (!melding) return;
    melding.textContent = tekst;
    melding.classList.toggle('is-goed', soort === 'goed');
    melding.classList.toggle('is-mis', soort === 'mis');
    melding.classList.toggle('is-bezig', soort === 'bezig');
  };

  /* Het formulier in rust zetten en weer vrijgeven.

     De velden worden NIET op disabled gezet: een disabled veld valt uit de
     FormData, en die wordt hier pas na het blokkeren opgebouwd - dan vertrekt
     er een lege aanvraag. Daarom een klasse op het formulier die de velden
     dooft en de muis erbuiten houdt; de waarden blijven gewoon staan. */
  const blokkeer = aan => {
    formulier.classList.toggle('is-bezig', aan);
    formulier.setAttribute('aria-busy', aan ? 'true' : 'false');
    if (!knop) return;
    knop.disabled = aan;
    if (aan) {
      /* De molen staat IN de knop, naast het woord. Op de knop drukken is de
         laatste handeling van de bezoeker, dus daar kijkt hij ook. */
      knop.innerHTML = `<span class="knop-molen" aria-hidden="true"></span> <span>${formulier.dataset.bezig || 'Versturen'}</span>`;
    } else {
      knop.innerHTML = knopTekst;
    }
  };

  /* XMLHttpRequest en geen fetch, om een reden: fetch meldt niets over het
     versturen zelf. Zit er een inspiratiefoto bij (en dat is een foto van een
     telefoon, dus al snel enkele megabytes), dan duurt de upload op 4G
     seconden tot tientallen seconden waarin fetch je niets te vertellen heeft.
     Een molentje dat draait zonder iets te weten is precies de "hij hangt"
     die dit moest oplossen. xhr.upload.progress weet het wel, dus de bezoeker
     ziet een percentage lopen zolang er bytes de deur uit gaan, en pas daarna
     de algemene regel terwijl de server de mail verstuurt. */
  const verstuur = (data, bijUpload) => new Promise((klaar, mis) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', formulier.getAttribute('action'));
    xhr.responseType = 'text';
    xhr.upload.addEventListener('progress', e => {
      if (e.lengthComputable) bijUpload(e.loaded / e.total);
    });
    xhr.addEventListener('load', () => {
      let uitslag = {};
      try { uitslag = JSON.parse(xhr.responseText); } catch (fout) { /* leeg antwoord */ }
      klaar({ ok: xhr.status >= 200 && xhr.status < 300, uitslag });
    });
    xhr.addEventListener('error', () => mis(new Error('netwerk')));
    xhr.addEventListener('timeout', () => mis(new Error('timeout')));
    xhr.addEventListener('abort', () => mis(new Error('afgebroken')));
    xhr.send(data);
  });

  formulier.addEventListener('submit', async e => {
    e.preventDefault();

    /* novalidate staat op het formulier zodat de browser niet zijn eigen
       ballon over het veld zet voordat wij iets kunnen zeggen, maar de
       verplichte velden moeten wel nagekeken worden. reportValidity doet dat
       en wijst het eerste lege veld aan. */
    if (!formulier.checkValidity()) {
      formulier.reportValidity();
      return;
    }

    /* Eerst de gegevens inlezen, dan pas het formulier op slot. Andersom is
       hierboven bij blokkeer() al beschreven. */
    const data = new FormData(formulier);
    const foto = formulier.querySelector('input[type="file"]');
    const heeftFoto = !!(foto && foto.files && foto.files.length);

    blokkeer(true);
    const bezigregel = formulier.dataset.bezigregel || formulier.dataset.bezig || '';
    zeg(bezigregel, 'bezig');

    /* Alleen een percentage tonen als er ook echt iets te uploaden valt. Een
       formulier zonder foto is een paar kilobyte en staat in een oogwenk op
       100 procent - dat telt af voor de bezoeker het gelezen heeft en leest
       als gestotter. */
    const bijUpload = deel => {
      if (!heeftFoto) return;
      const p = Math.min(99, Math.round(deel * 100));
      const sjabloon = formulier.dataset.upload || '{p}%';
      zeg(p >= 99 ? bezigregel : sjabloon.replace('{p}', String(p)), 'bezig');
    };

    try {
      const { ok, uitslag } = await verstuur(data, bijUpload);
      if (!ok || !uitslag.ok) {
        /* Bij een 4xx draagt het antwoord de reden in de taal van het
           formulier. Die is preciezer dan onze eigen regel ("Vul de datum van
           het feest in"), dus die krijgt voorrang. */
        zeg(uitslag.message || formulier.dataset.mis, 'mis');
        blokkeer(false);
        return;
      }
      /* Gelukt: het formulier gaat weg en de bedankregel komt ervoor in de
         plaats. Blijven staan nodigt uit tot nog een keer versturen, en dan
         komt dezelfde aanvraag twee keer binnen. */
      formulier.classList.remove('is-bezig');
      formulier.setAttribute('aria-busy', 'false');
      formulier.querySelectorAll('.veld, [type="submit"], .vormnoot').forEach(el => el.remove());
      zeg(formulier.dataset.dank, 'goed');
      melding?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (fout) {
      zeg(formulier.dataset.mis, 'mis');
      blokkeer(false);
    }
  });
}
