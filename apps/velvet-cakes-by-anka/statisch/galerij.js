/* Grote fotoweergave op de assortimentspaginas.
   Doorbladeren gebeurt met de scrollbalk zelf: alle fotos van de pagina staan
   als dias naast elkaar in een horizontale scroller met snap. Vegen op de
   telefoon, pijlen of toetsen op desktop. Alleen de dias rond de huidige laden
   hun foto, zodat opengaan snel blijft. */
const lb = document.getElementById('lightbox');

if (lb) {
  const spoor = document.getElementById('lb-track');
  const bijschriftVak = document.getElementById('lb-caption');
  const nuVak = document.getElementById('lb-nu');
  const totaalVak = document.getElementById('lb-totaal');

  // alle tegels van de pagina, in leesvolgorde, over de groepen heen
  const tegels = [...document.querySelectorAll('.galerij .tegel')];
  let reeks = [];
  function leesBij() {
    reeks = tegels.map(t => ({
      groot: t.dataset.groot,
      bij: t.querySelector('figcaption')?.textContent || '',
    }));
  }
  leesBij();

  /* De bijschriften komen uit de pagina zelf, dus bij een taalwissel staan ze
     hier nog in de oude taal. Dat valt pas op als iemand de grote weergave
     opent nadat hij RO heeft aangezet, en dan staat er Nederlands onder een
     Roemeense pagina. Dus opnieuw lezen, en een open weergave bijwerken. */
  document.addEventListener('taalgewijzigd', () => {
    leesBij();
    spoor.querySelectorAll('.lb-slide img').forEach((img, i) => { img.alt = reeks[i]?.bij || ''; });
    if (!lb.hidden) bijschrift();
  });

  let nu = 0;
  let paginaY = 0;

  function laad(pos) {
    spoor.querySelectorAll('.lb-slide img').forEach((img, i) => {
      if (Math.abs(i - pos) <= 3 && !img.src) img.src = img.dataset.src;
    });
  }

  function bijschrift() {
    bijschriftVak.textContent = reeks[nu]?.bij || '';
    nuVak.textContent = nu + 1;
    spoor.querySelectorAll('.lb-slide').forEach((s, i) => s.classList.toggle('is-nu', i === nu));
  }

  /* de dias zijn op de telefoon smaller dan het scherm (de buren piepen erlangs),
     dus reken met de werkelijke plek van de dia, niet met index maal breedte */
  function plek(pos) {
    const dia = spoor.children[pos];
    if (!dia) return 0;
    return dia.offsetLeft - (spoor.clientWidth - dia.offsetWidth) / 2;
  }

  function naar(pos, zacht = true) {
    if (!reeks.length) return;
    const rond = pos < 0 || pos >= reeks.length;   // omslaan doet geen lange sleep
    nu = (pos + reeks.length) % reeks.length;
    laad(nu);
    spoor.scrollTo({ left: plek(nu), behavior: rond || !zacht ? 'auto' : 'smooth' });
    bijschrift();
  }

  function toon(index) {
    if (!reeks.length) return;
    spoor.innerHTML = reeks.map(f =>
      `<div class="lb-slide"><img data-src="${f.groot}" alt="${f.bij.replace(/"/g, '&quot;')}" decoding="async"></div>`
    ).join('');
    totaalVak.textContent = reeks.length;
    lb.hidden = false;
    paginaY = window.scrollY;
    document.documentElement.classList.add('lb-open');
    document.body.classList.add('lb-vast');
    naar(index, false);
  }

  function sluit() {
    lb.hidden = true;
    spoor.innerHTML = '';
    document.documentElement.classList.remove('lb-open');
    document.body.classList.remove('lb-vast');
    window.scrollTo(0, paginaY);
  }

  // de scrollpositie bepaalt welke foto de huidige is
  let tikker;
  spoor.addEventListener('scroll', () => {
    clearTimeout(tikker);
    tikker = setTimeout(() => {
      if (lb.hidden || !spoor.clientWidth) return;
      const midden = spoor.scrollLeft + spoor.clientWidth / 2;
      let pos = 0, best = Infinity;
      [...spoor.children].forEach((s, i) => {
        const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - midden);
        if (d < best) { best = d; pos = i; }
      });
      laad(pos);
      if (pos !== nu) { nu = pos; bijschrift(); }
    }, 70);
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (!lb.hidden) spoor.scrollTo({ left: plek(nu), behavior: 'auto' });
  });

  document.querySelectorAll('.galerij').forEach(g => {
    g.addEventListener('click', e => {
      const t = e.target.closest('.tegel');
      if (t) toon(tegels.indexOf(t));
    });
    g.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const t = e.target.closest('.tegel');
      if (t) { e.preventDefault(); toon(tegels.indexOf(t)); }
    });
  });

  lb.querySelector('.lb-close').addEventListener('click', sluit);
  lb.querySelector('.lb-next').addEventListener('click', () => naar(nu + 1));
  lb.querySelector('.lb-prev').addEventListener('click', () => naar(nu - 1));
  // klik naast de foto sluit; de dia zelf is de vlakke achtergrond
  spoor.addEventListener('click', e => { if (e.target.tagName !== 'IMG') sluit(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') sluit();
    if (e.key === 'ArrowRight') naar(nu + 1);
    if (e.key === 'ArrowLeft') naar(nu - 1);
  });
}
