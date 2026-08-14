/**
 * De beweging op de site.
 *
 * Dit gaat over kanker, dus alles hier is traag, klein en zacht. Niets
 * knippert, niets springt en niets vraagt aandacht die het niet verdient.
 *
 * Alles kijkt naar de systeeminstelling 'minder beweging'. Staat die aan, dan
 * zie je meteen de eindstand. Bij dit publiek is dat geen luxe: beweging kan
 * mensen letterlijk misselijk maken.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/** Heeft iemand in zijn systeem minder beweging ingesteld? */
export function useMinderBeweging(): boolean {
  const [minder, setMinder] = useState(false);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const kijk = () => setMinder(mq.matches);
    kijk();
    mq.addEventListener('change', kijk);
    return () => mq.removeEventListener('change', kijk);
  }, []);

  return minder;
}

/* ------------------------------------------------------------------ */
/*  De schuivende strook                                               */
/* ------------------------------------------------------------------ */

/**
 * De strook met berichten schuift vanzelf door en blijft ondertussen een gewoon
 * scrollbaar vak.
 *
 * Eerst liep hij op een css-animatie in een vak met overflow: hidden. Die
 * combinatie is een val: hij stopte zodra je hem aanraakte, en juist dan kon je
 * hem ook niet met de hand verschuiven. Nu verzetten we de scrollpositie zelf,
 * dus vegen, slepen, het wiel, het toetsenbord en de twee knoppen doen het
 * allemaal, en na een eigen zet pakt hij het vanzelf weer op.
 *
 * De rij staat er twee keer in; na de helft is de stand weer gelijk, dus daar
 * springen we terug zonder dat je het ziet. Dat werkt beide kanten op.
 */
export function useStrook<T extends HTMLElement>(pixelsPerSeconde = 22) {
  const ref = useRef<T>(null);
  const minder = useMinderBeweging();
  // Wordt binnen het effect gevuld, zodat de knoppen bij dezelfde afspraken
  // kunnen die het doorschuiven ook gebruikt.
  const bediening = useRef<((richting: 1 | -1) => void) | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let zweeft = false;
    let focus = false;
    let sleept = false;
    let versleept = false;
    let startX = 0;
    let startScroll = 0;
    // Waar wij de strook zelf net hebben neergezet. Wijkt de stand daarvan af,
    // dan heeft de bezoeker zelf gescrold en laten we hem even met rust.
    let verwacht = -1;
    // De stand die wij bijhouden, met de cijfers achter de komma erbij. Een
    // scrollpositie wordt op hele pixels gezet, en 22 px per seconde is minder
    // dan een halve pixel per frame: alleen uitlezen en ophogen zou altijd op
    // nul uitkomen en dan staat de strook stil.
    let positie = 0;
    let wachtTot = 0;
    let vorigeTijd = 0;
    let frame = 0;

    const helft = () => el.scrollWidth / 2;

    const zet = (x: number) => {
      positie = x;
      el.scrollLeft = x;
      verwacht = el.scrollLeft;
    };

    /** Terug naar dezelfde plek in de andere helft, zodat het rond blijft lopen. */
    const wikkel = () => {
      const h = helft();
      if (h < 1) return;
      if (el.scrollLeft >= h) zet(el.scrollLeft - h);
      else if (el.scrollLeft <= 0) zet(h - 1);
    };

    const stap = (nu: number) => {
      frame = requestAnimationFrame(stap);
      // Een sprong van meer dan een tiende seconde (tabblad weg geweest) niet
      // inhalen, anders schiet de strook vooruit zodra je terugkomt.
      const verstreken = vorigeTijd ? Math.min(100, nu - vorigeTijd) : 0;
      vorigeTijd = nu;
      if (zweeft || focus || sleept || nu < wachtTot) return;
      const h = helft();
      if (h < 1) return;
      const doel = positie + (pixelsPerSeconde * verstreken) / 1000;
      zet(doel >= h ? doel - h : doel);
    };

    const gescrold = () => {
      // Eigen zet of die van de bezoeker? Bij die laatste even wachten, anders
      // vecht het doorschuiven met wat iemand aan het doen is.
      if (verwacht < 0 || Math.abs(el.scrollLeft - verwacht) > 2) {
        wachtTot = performance.now() + 1500;
        positie = el.scrollLeft;
      }
      wikkel();
    };

    const binnen = () => (zweeft = true);
    const buiten = () => (zweeft = false);
    const focusIn = () => (focus = true);
    const focusUit = () => (focus = false);

    const omlaag = (e: PointerEvent) => {
      // Vegen op een telefoon doet de browser zelf, en beter dan wij.
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      sleept = true;
      versleept = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.classList.add('sleept');
      // Aan het venster hangen, niet aan de strook: anders is de sleep voorbij
      // zodra de muis buiten de kaarten komt.
      window.addEventListener('pointermove', beweeg);
      window.addEventListener('pointerup', omhoog);
      window.addEventListener('pointercancel', omhoog);
    };

    const beweeg = (e: PointerEvent) => {
      if (!sleept) return;
      const dx = e.clientX - startX;
      // Een paar pixels speling, anders wordt elke klik op een kaart een sleep.
      if (!versleept && Math.abs(dx) < 4) return;
      versleept = true;
      e.preventDefault();
      const h = helft();
      const doel = startScroll - dx;
      zet(h >= 1 ? ((doel % h) + h) % h : doel);
    };

    const omhoog = () => {
      if (!sleept) return;
      sleept = false;
      el.classList.remove('sleept');
      window.removeEventListener('pointermove', beweeg);
      window.removeEventListener('pointerup', omhoog);
      window.removeEventListener('pointercancel', omhoog);
      wachtTot = performance.now() + 1500;
    };

    // Een foto of een link oppakken en meeslepen is wat de browser standaard
    // doet, en dat sloopt het slepen: je krijgt een spookplaatje aan de muis en
    // de strook blijft staan.
    const geenSleepbeeld = (e: DragEvent) => e.preventDefault();

    // Na een sleep niet ook nog de kaart openen waar je toevallig op losliet.
    const klik = (e: MouseEvent) => {
      if (!versleept) return;
      versleept = false;
      e.preventDefault();
      e.stopPropagation();
    };

    bediening.current = (richting) => {
      const kaart = el.querySelector('li');
      const breedte = kaart instanceof HTMLElement ? kaart.offsetWidth + 24 : 320;
      const h = helft();
      // Aan het begin is er links niets meer; spring eerst naar de andere helft,
      // anders loopt de knop tegen de rand en gebeurt er niets.
      if (richting < 0 && h >= 1 && el.scrollLeft < breedte) zet(el.scrollLeft + h);
      el.scrollBy({ left: richting * breedte, behavior: 'smooth' });
      wachtTot = performance.now() + 1500;
    };

    el.addEventListener('scroll', gescrold, { passive: true });
    el.addEventListener('pointerenter', binnen);
    el.addEventListener('pointerleave', buiten);
    el.addEventListener('focusin', focusIn);
    el.addEventListener('focusout', focusUit);
    el.addEventListener('pointerdown', omlaag);
    el.addEventListener('dragstart', geenSleepbeeld);
    el.addEventListener('click', klik, true);
    if (!minder) frame = requestAnimationFrame(stap);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('scroll', gescrold);
      el.removeEventListener('pointerenter', binnen);
      el.removeEventListener('pointerleave', buiten);
      el.removeEventListener('focusin', focusIn);
      el.removeEventListener('focusout', focusUit);
      el.removeEventListener('pointerdown', omlaag);
      el.removeEventListener('dragstart', geenSleepbeeld);
      el.removeEventListener('click', klik, true);
      omhoog();
      bediening.current = null;
    };
  }, [minder, pixelsPerSeconde]);

  const naar = useCallback((richting: 1 | -1) => bediening.current?.(richting), []);

  return { ref, naar };
}

/* ------------------------------------------------------------------ */
/*  Aftellen naar de eerstvolgende activiteit                          */
/* ------------------------------------------------------------------ */

/**
 * "Over vier dagen" zegt meer dan een datum, zeker als je twijfelt of je zult
 * gaan. De datum staat er gewoon naast, dit is een extra.
 */
export function aftelTekst(start: Date, eind: Date, nu: number): string | null {
  if (start.getTime() <= nu) {
    return eind.getTime() > nu ? 'Nu bezig' : null;
  }
  const min = Math.round((start.getTime() - nu) / 60000);
  if (min < 60) return `Over ${min} ${min === 1 ? 'minuut' : 'minuten'}`;

  const uur = Math.floor(min / 60);
  if (uur < 24) {
    const rest = min % 60;
    return rest ? `Over ${uur} uur en ${rest} min` : `Over ${uur} uur`;
  }

  const dag = Math.floor(uur / 24);
  const restUur = uur % 24;
  if (dag === 1) return restUur ? `Over 1 dag en ${restUur} uur` : 'Over 1 dag';
  if (dag < 14) return restUur ? `Over ${dag} dagen en ${restUur} uur` : `Over ${dag} dagen`;
  return `Over ${Math.round(dag / 7)} weken`;
}

export function Aftellen({ start, eind }: { start: Date; eind: Date }) {
  const [nu, setNu] = useState(() => Date.now());

  useEffect(() => {
    // Elke halve minuut is ruim genoeg; de kleinste eenheid die we tonen is een minuut.
    const t = setInterval(() => setNu(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const tekst = aftelTekst(start, eind, nu);
  if (!tekst) return null;

  return (
    <span className="inline-flex items-center gap-2">
      <span className="stip" aria-hidden="true" />
      {tekst}
    </span>
  );
}
