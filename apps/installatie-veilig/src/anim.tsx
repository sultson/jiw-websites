import {useEffect, useRef, useState} from 'react';

/* ------------------------------------------------------------------ */
/*  Bewegingsgereedschap                                               */
/* ------------------------------------------------------------------ */

/**
 * Deze versie van de site leunt op beweging. Alles wat hier staat kijkt daarom
 * eerst of de bezoeker in zijn systeem om minder beweging heeft gevraagd: dan
 * springt het meteen naar de eindstand in plaats van te animeren.
 */
export const minderBeweging = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Meldt zodra het element voor het eerst in beeld komt, daarna niet meer. */
export function useInBeeld<T extends HTMLElement>(marge = '0px 0px -10% 0px') {
  const ref = useRef<T | null>(null);
  const [zichtbaar, setZichtbaar] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (minderBeweging()) {
      setZichtbaar(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setZichtbaar(true);
          io.disconnect();
        }
      },
      {rootMargin: marge, threshold: 0.12},
    );
    io.observe(el);
    return () => io.disconnect();
  }, [marge]);

  return [ref, zichtbaar] as const;
}

type Vorm = 'op' | 'links' | 'rechts' | 'schaal';

/** Laat zijn inhoud binnenkomen zodra hij in beeld scrollt. */
export function Reveal({
  children, delay = 0, vorm = 'op', className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  vorm?: Vorm;
  className?: string;
}) {
  const [ref, zichtbaar] = useInBeeld<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{transitionDelay: `${delay}ms`}}
      className={`reveal reveal-${vorm} ${zichtbaar ? 'is-in' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

/** Telt naar een getal zodra het in beeld staat. */
export function Teller({
  naar, duur = 1400, decimalen = 0, prefix = '', suffix = '',
}: {
  naar: number;
  duur?: number;
  decimalen?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [ref, zichtbaar] = useInBeeld<HTMLSpanElement>();
  const [waarde, setWaarde] = useState(0);
  /* Bij het bouwen wordt de pagina als HTML weggeschreven, en daar telt niets:
     stond hier de beginstand, dan las een crawler letterlijk "EUR 0,-" als de
     prijs van een laadpaal. Tot React het overneemt staat het eindbedrag er dus
     gewoon; het aftellen naar nul en weer omhoog begint pas in de browser. */
  const [inBrowser, setInBrowser] = useState(false);
  useEffect(() => setInBrowser(true), []);

  useEffect(() => {
    if (!zichtbaar) return;
    if (minderBeweging()) {
      setWaarde(naar);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const stap = (t: number) => {
      const p = Math.min(1, (t - start) / duur);
      setWaarde(naar * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(stap);
    };
    raf = requestAnimationFrame(stap);
    return () => cancelAnimationFrame(raf);
  }, [zichtbaar, naar, duur]);

  return (
    <span ref={ref}>
      {prefix}
      {(inBrowser ? waarde : naar).toLocaleString('nl-NL', {
        minimumFractionDigits: decimalen,
        maximumFractionDigits: decimalen,
      })}
      {suffix}
    </span>
  );
}

/** Loopt zacht naar een nieuwe waarde toe, ook als die tijdens het kijken verandert. */
export function useZachteWaarde(doel: number, duur = 550) {
  const [waarde, setWaarde] = useState(doel);
  const vanaf = useRef(doel);

  useEffect(() => {
    if (minderBeweging()) {
      vanaf.current = doel;
      setWaarde(doel);
      return;
    }
    const begin = vanaf.current;
    const start = performance.now();
    let raf = 0;
    const stap = (t: number) => {
      const p = Math.min(1, (t - start) / duur);
      const e = 1 - Math.pow(1 - p, 3);
      const nu = begin + (doel - begin) * e;
      vanaf.current = nu;
      setWaarde(nu);
      if (p < 1) raf = requestAnimationFrame(stap);
    };
    raf = requestAnimationFrame(stap);
    return () => cancelAnimationFrame(raf);
  }, [doel, duur]);

  return waarde;
}

/** Hoe ver de bezoeker door de pagina is, 0 tot 1. */
export function useScrollVoortgang() {
  const [voortgang, setVoortgang] = useState(0);

  useEffect(() => {
    const meet = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setVoortgang(max > 0 ? Math.min(1, el.scrollTop / max) : 0);
    };
    meet();
    window.addEventListener('scroll', meet, {passive: true});
    window.addEventListener('resize', meet);
    return () => {
      window.removeEventListener('scroll', meet);
      window.removeEventListener('resize', meet);
    };
  }, []);

  return voortgang;
}

/**
 * Zet de muispositie als css-variabele op het element, zodat er een zachte
 * groene gloed achter de cursor mee kan lopen op de donkere vlakken.
 */
export function useSpot<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || minderBeweging()) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const beweeg = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    el.addEventListener('mousemove', beweeg);
    return () => el.removeEventListener('mousemove', beweeg);
  }, []);

  return ref;
}

/** Wisselt om de zoveel tijd naar het volgende woord. */
export function useWisselwoord(woorden: string[], ms = 2600) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (minderBeweging()) return;
    const t = setInterval(() => setI((v) => (v + 1) % woorden.length), ms);
    return () => clearInterval(t);
  }, [woorden.length, ms]);
  return [woorden[i], i] as const;
}

/**
 * Een strook die zichzelf eindeloos herhaalt. De animatie schuift precies de
 * helft op en springt dan terug, dus de tweede helft moet altijd hetzelfde
 * beeld geven als de eerste.
 *
 * Twee kopieën is daarvoor niet genoeg: staat de inhoud een keer smaller dan
 * het scherm, dan is de strook op het eind van de rit korter dan de houder en
 * zie je rechts een gat waarna hij terugklapt. Daarom meten we hoe breed een
 * kopie is en herhalen we hem zo vaak dat elke helft het scherm vult. De duur
 * schaalt mee, anders raast een brede strook sneller voorbij dan een smalle.
 */
export function Marquee({
  children, seconden = 38, omgekeerd = false, className = '',
}: {
  children: React.ReactNode;
  seconden?: number;
  omgekeerd?: boolean;
  className?: string;
}) {
  const houder = useRef<HTMLDivElement>(null);
  const eersteKopie = useRef<HTMLDivElement>(null);
  const [kopieen, setKopieen] = useState(1);

  useEffect(() => {
    const meet = () => {
      const h = houder.current;
      const k = eersteKopie.current;
      if (!h || !k) return;
      const breedte = k.offsetWidth;
      if (!breedte) return;
      const nodig = Math.max(1, Math.ceil(h.offsetWidth / breedte));
      setKopieen((oud) => (oud === nodig ? oud : nodig));
    };

    meet();
    // Een ResizeObserver vangt zowel het draaien van het scherm als het moment
    // waarop het lettertype binnen is en de inhoud ineens breder wordt.
    const ro = new ResizeObserver(meet);
    if (houder.current) ro.observe(houder.current);
    if (eersteKopie.current) ro.observe(eersteKopie.current);
    return () => ro.disconnect();
  }, [children]);

  return (
    <div ref={houder} className={`marquee-houder relative overflow-hidden ${className}`}>
      <div
        className={`marquee ${omgekeerd ? 'marquee-om' : ''}`}
        style={{['--duur' as string]: `${seconden * kopieen}s`}}
      >
        {Array.from({length: kopieen * 2}, (_, i) => (
          <div
            key={i}
            ref={i === 0 ? eersteKopie : undefined}
            className="flex shrink-0 items-center"
            aria-hidden={i > 0 ? true : undefined}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Kaart die licht meekantelt met de cursor. Alleen op een echte muis. */
export function useKantel<T extends HTMLElement>(sterkte = 6) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || minderBeweging()) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const beweeg = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${-y * sterkte}deg) rotateY(${x * sterkte}deg) translateZ(0)`;
    };
    const weg = () => {
      el.style.transform = '';
    };
    el.addEventListener('mousemove', beweeg);
    el.addEventListener('mouseleave', weg);
    return () => {
      el.removeEventListener('mousemove', beweeg);
      el.removeEventListener('mouseleave', weg);
    };
  }, [sterkte]);

  return ref;
}
