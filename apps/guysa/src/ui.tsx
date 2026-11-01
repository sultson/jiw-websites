import {useEffect, useRef, useSyncExternalStore} from 'react';
import {Check} from 'lucide-react';
import {SITE_NAAM, ZAAK} from '../site.config.mjs';

/* ------------------------------------------------------------------ */
/*  Gegevens van de zaak                                               */
/* ------------------------------------------------------------------ */

/* Doorgegeven uit site.config.mjs, zodat de Worker, de bevestigingsmail en de
   pagina's hetzelfde telefoonnummer en hetzelfde mailadres gebruiken. Stond dit
   hier los, dan verandert er bij een nieuw nummer precies een van de drie. */
export const BEDRIJF = SITE_NAAM;
export const TEL = ZAAK.telefoon;
export const TEL_TEKST = ZAAK.telefoonWeergave;
export const MAIL = ZAAK.mail;
export const GOOGLE_REVIEWS = ZAAK.googleReviews;

/* ------------------------------------------------------------------ */
/*  Staat de knop van het formulier in beeld?                          */
/* ------------------------------------------------------------------ */

/**
 * De vaste balk onderaan op mobiel mag niet naast de knop van het formulier
 * staan: dan wijzen twee knoppen naar hetzelfde. Elk formulier meldt hier of
 * zijn eigen hoofdknop in beeld is; de balk verbergt zich zolang dat zo is.
 */
const knoppenInBeeld = new Set<Element>();
const luisteraars = new Set<() => void>();

export function useFormKnopInBeeld() {
  return useSyncExternalStore(
    (fn) => {
      luisteraars.add(fn);
      return () => luisteraars.delete(fn);
    },
    () => knoppenInBeeld.size > 0,
    /* Bij het bakken van de HTML bestaat er geen scherm, dus geen knop in
       beeld: de balk staat in de gebakken pagina zichtbaar, en de browser
       verbergt hem zodra de waarnemer afgaat. Andersom zou de balk bij een
       bezoeker zonder JavaScript nooit verschijnen. */
    () => false,
  );
}

/** Ref voor de hoofdknop van een formulier. `sleutel` opnieuw observeren bij stapwissel. */
export function useKnopInBeeld<T extends Element>(sleutel: unknown) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const meld = () => luisteraars.forEach((fn) => fn());
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) knoppenInBeeld.add(el);
        else knoppenInBeeld.delete(el);
        meld();
      },
      {threshold: 0.5},
    );
    io.observe(el);
    return () => {
      io.disconnect();
      knoppenInBeeld.delete(el);
      meld();
    };
  }, [sleutel]);

  return ref;
}

/* ------------------------------------------------------------------ */
/*  Plattegrondmotief                                                  */
/* ------------------------------------------------------------------ */

/**
 * Bouwkundige plattegrond in dunne lijn achter de donkere vlakken: kamers,
 * muurdiktes, een trap en raamopeningen. Staat op zeer lage dekking, het moet
 * textuur zijn die je pas bij tweede blik ziet. Een deur draait langzaam open,
 * de enige beweging op de pagina.
 */
export function Plattegrond({className = '', variant = 0}: {className?: string; variant?: 0 | 1 | 2}) {
  const kamers = [
    [
      /* x, y, breedte, hoogte */
      [40, 40, 260, 200], [300, 40, 200, 120], [300, 160, 200, 80],
      [40, 240, 160, 220], [200, 240, 300, 220], [500, 40, 160, 420],
    ],
    [
      [60, 60, 200, 160], [260, 60, 300, 240], [60, 220, 200, 240],
      [260, 300, 160, 160], [420, 300, 140, 160], [560, 60, 100, 400],
    ],
    [
      [30, 80, 300, 140], [330, 80, 220, 220], [30, 220, 160, 240],
      [190, 220, 140, 240], [330, 300, 220, 160], [550, 80, 120, 380],
    ],
  ][variant];

  /* Raamopeningen: korte dubbele lijnen in een buitenmuur. */
  const ramen = [
    [90, 40, 60], [190, 40, 60], [560, 40, 60], [110, 460, 70], [300, 460, 80],
  ];

  return (
    <svg
      viewBox="0 0 700 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.6">
        {kamers.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} />)}
      </g>

      {/* Buitenmuur dubbel getrokken, zoals op een echte plattegrond. */}
      <rect
        x={kamers[0][0] - 8} y={kamers[0][1] - 8}
        width={660 - kamers[0][0]} height={508 - kamers[0][1]}
        fill="none" stroke="currentColor" strokeWidth="2.4"
      />

      {ramen.map(([x, y, w], i) => (
        <g key={`r${i}`} stroke="currentColor" strokeWidth="1.4">
          <line x1={x} y1={y - 4} x2={x + w} y2={y - 4} />
          <line x1={x} y1={y + 4} x2={x + w} y2={y + 4} />
        </g>
      ))}

      {/* Trap. */}
      <g stroke="currentColor" strokeWidth="1.3">
        {Array.from({length: 8}, (_, i) => (
          <line key={i} x1={508} y1={70 + i * 22} x2={652} y2={70 + i * 22} />
        ))}
      </g>

      {/* Deur met draaicirkel. Het blad zwaait open en weer dicht. */}
      <g stroke="currentColor" fill="none">
        <path d="M300 240 A60 60 0 0 1 360 300" strokeWidth="1.1" strokeDasharray="3 4" />
        <line x1="300" y1="240" x2="300" y2="300" strokeWidth="2.2" className="deur-zwaai" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */

type Tone = 'ink' | 'soft' | 'bone';

export function Section({
  id, children, className = '', tone = 'ink', plattegrond,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  tone?: Tone;
  plattegrond?: 0 | 1 | 2;
}) {
  const bg =
    tone === 'bone' ? 'bg-bone text-ink' : tone === 'soft' ? 'bg-ink-soft text-white' : 'bg-ink text-white';
  return (
    <section id={id} className={`relative overflow-hidden ${bg} ${className}`}>
      {tone !== 'bone' && plattegrond !== undefined && (
        <Plattegrond variant={plattegrond} className="text-white/[0.045]" />
      )}
      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">{children}</div>
    </section>
  );
}

export function Kicker({children, dark = false}: {children: React.ReactNode; dark?: boolean}) {
  return (
    <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.2em] ${dark ? 'text-gold-deep' : 'text-gold'}`}>
      {children}
    </p>
  );
}

export function Bullet({children, dark = false}: {children: React.ReactNode; dark?: boolean}) {
  return (
    <li className="flex gap-3">
      <Check className={`mt-0.5 h-5 w-5 shrink-0 ${dark ? 'text-gold-deep' : 'text-gold'}`} strokeWidth={2} />
      <span>{children}</span>
    </li>
  );
}

/* Het huisje uit het logo, natekend als vector zodat het op elk formaat en op
   de favicon scherp blijft. */
export function Huisje({className = ''}: {className?: string}) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className={className}>
      <g stroke="currentColor" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M12 46 44 20l32 26" />
        <path d="M18 44v34h52V44" />
        <path d="M70 46 88 60v18H70" />
        <rect x="26" y="54" width="14" height="12" />
        <rect x="56" y="54" width="14" height="12" />
        <rect x="43" y="56" width="10" height="22" />
        <rect x="39" y="28" width="9" height="8" />
      </g>
    </svg>
  );
}

export function Logo({className = 'h-11 w-auto'}: {className?: string}) {
  return (
    <img
      src="/img/logo.png"
      alt={BEDRIJF}
      width={512}
      height={505}
      /* Het logo staat bovenaan in beeld en is daarmee een kandidaat voor de
         grootste afbeelding van de eerste weergave. Lazy zou hem juist later
         laten komen. */
      fetchPriority="high"
      className={className}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Werkgebied                                                         */
/* ------------------------------------------------------------------ */

/* De gemeentes waar de bestelwagen dagelijks komt. Staan als lijst naast de
   kaart; de kaart zelf zet er geen spelden bij. */
export const PLAATSEN: string[] = [
  'Antwerpen', 'Deurne', 'Berchem', 'Borsbeek', 'Wommelgem', 'Wilrijk',
  'Mortsel', 'Edegem', 'Hove', 'Boechout', 'Vremde', 'Kontich', 'Lint',
  'Ranst', 'Lier',
];

/* Gemeentes met postcode voor het formulier. Belgie heeft geen gratis open
   adres-API zoals PDOK in Nederland, dus dit is een vaste lijst voor hun
   werkgebied. Vult de postcode aan zodra de gemeente gekozen is. */
export const GEMEENTES: [string, string][] = [
  ['Antwerpen', '2000'],
  ['Antwerpen Zuid', '2018'],
  ['Berchem', '2600'],
  ['Berendrecht', '2040'],
  ['Borgerhout', '2140'],
  ['Borsbeek', '2150'],
  ['Boechout', '2530'],
  ['Deurne', '2100'],
  ['Edegem', '2650'],
  ['Ekeren', '2180'],
  ['Hoboken', '2660'],
  ['Hove', '2540'],
  ['Kontich', '2550'],
  ['Lier', '2500'],
  ['Lint', '2547'],
  ['Merksem', '2170'],
  ['Mortsel', '2640'],
  ['Ranst', '2520'],
  ['Vremde', '2531'],
  ['Wilrijk', '2610'],
  ['Wommelgem', '2160'],
];
