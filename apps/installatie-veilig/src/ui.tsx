import {useEffect, useRef, useSyncExternalStore} from 'react';
import {Check} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

export const WHATSAPP = '31618195027';
export const PHONE = '+31618195027';
export const PHONE_DISPLAY = '+31\u00a06\u00a018\u00a019\u00a050\u00a027';
/* Placeholder until Jasper picks a mailbox on installatieveilig.nl. */
export const EMAIL = 'info@installatieveilig.nl';

export const wa = (text: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

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
/*  Electricity motif                                                  */
/* ------------------------------------------------------------------ */

/**
 * Circuit traces that run behind the dark sections. Orthogonal runs with
 * chamfered corners, the way a board is actually routed, plus solder pads where
 * a trace terminates. Sits at a very low opacity: it should read as texture you
 * only notice on a second look, never as decoration competing with the copy.
 */
export function Traces({
  className = '', variant = 0, tweedePuls = false,
}: {
  className?: string;
  variant?: 0 | 1 | 2;
  /* Een tweede, tragere lading over een andere baan. Alleen waar het blok groot
     genoeg is om dat te dragen, anders wordt het onrustig. */
  tweedePuls?: boolean;
}) {
  const sets = [
    [
      'M0 120 H180 l28 28 V300 l28 28 H520',
      'M0 300 H90 l32 -32 V96 l28 -28 H400 l36 36 V240',
      'M120 480 H300 l40 -40 V210 l30 -30 H640',
      'M640 60 H480 l-32 32 V330 l34 34 H700',
      'M0 420 H200 l30 30 H560 l32 -32 V150',
    ],
    [
      'M700 100 H520 l-30 30 V320 l-34 34 H180',
      'M60 60 V260 l30 30 H340 l30 -30 V120 l28 -28 H660',
      'M0 380 H260 l34 34 V500',
      'M700 440 H440 l-30 -30 V220',
      'M140 500 V400 l30 -30 H420',
    ],
    [
      'M0 200 H240 l36 -36 V60',
      'M700 260 H460 l-32 32 V460 l-30 30 H120',
      'M40 40 V180 l30 30 H300 l30 30 V420',
      'M700 160 H600 l-30 30 V340',
      'M180 500 H480 l30 -30 V300',
    ],
  ];
  const paths = sets[variant];
  /* Pads sit at the visual ends of the runs above. */
  const pads = [
    [180, 120], [520, 300], [400, 68], [640, 180], [700, 364], [200, 420], [592, 150],
  ];

  return (
    <svg
      viewBox="0 0 700 540"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        {paths.map((d, i) => <path key={i} d={d} />)}
      </g>
      {variant === 0 && pads.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx={x} cy={y} r="1.8" fill="currentColor" />
        </g>
      ))}
      {/* One live run: a charge travelling the longest trace. Held back for
          anyone who has asked the OS for less motion. */}
      <path
        d={paths[0]}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="trace-pulse"
      />
      {tweedePuls && paths[2] && (
        <path
          d={paths[2]}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          className="trace-pulse-2"
        />
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */

type Tone = 'white' | 'mist' | 'ink';

export function Section({
  id, children, className = '', tone = 'white', traces,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  tone?: Tone;
  traces?: 0 | 1 | 2;
}) {
  const bg = tone === 'mist' ? 'bg-mist' : tone === 'ink' ? 'bg-ink text-white' : 'bg-white';
  return (
    <section id={id} className={`relative overflow-hidden ${bg} ${className}`}>
      {tone === 'ink' && traces !== undefined && <Traces variant={traces} className="text-white/[0.05]" />}
      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">{children}</div>
    </section>
  );
}

export function Kicker({children, light = false}: {children: React.ReactNode; light?: boolean}) {
  return (
    <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.18em] ${light ? 'text-accent' : 'text-accent-dark'}`}>
      {children}
    </p>
  );
}

export function Bullet({children, light = false}: {children: React.ReactNode; light?: boolean}) {
  return (
    <li className="flex gap-3">
      <Check className={`mt-0.5 h-5 w-5 shrink-0 ${light ? 'text-accent' : 'text-accent-dark'}`} strokeWidth={2} />
      <span>{children}</span>
    </li>
  );
}

/* Het aardteken uit het logo, als vector zodat het op elk formaat scherp blijft. */
export function Mark({className = ''}: {className?: string}) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className={className}>
      <g stroke="currentColor">
        <path d="M50 15V53" strokeWidth="4.4" />
        <path d="M8 53h84" strokeWidth="5.2" />
        <path d="M23.4 66h54.6" strokeWidth="5.2" />
        <path d="M33 79.2h33.2" strokeWidth="5.2" />
      </g>
    </svg>
  );
}

export function Logo({variant = 'dark', className = ''}: {variant?: 'dark' | 'light'; className?: string}) {
  return (
    <img
      src={variant === 'light' ? '/img/logo-light.png' : '/img/logo-dark.png'}
      alt="Installatie Veilig Elektrotechniek"
      width={579}
      height={114}
      className={`h-8 w-auto sm:h-9 ${className}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Werkgebied                                                         */
/* ------------------------------------------------------------------ */

/* naam, lon, lat, thuisbasis. Gedeeld met de kaart, die apart geladen wordt. */
export const PLAATSEN: [string, number, number, boolean][] = [
  /* naam, lon, lat, thuisbasis */
  ['Breda', 4.7761, 51.5865, true],
  ['Prinsenbeek', 4.7106, 51.5978, false],
  ['Princenhage', 4.7345, 51.5786, false],
  ['Teteringen', 4.8203, 51.6014, false],
  ['Bavel', 4.8347, 51.5537, false],
  ['Ulvenhout', 4.7981, 51.5477, false],
  ['Dorst', 4.8836, 51.5911, false],
  ['Oosterhout', 4.8600, 51.6450, false],
  ['Made', 4.7906, 51.6786, false],
  ['Etten-Leur', 4.6389, 51.5714, false],
  ['Rijsbergen', 4.6828, 51.5178, false],
  ['Zundert', 4.6567, 51.4700, false],
];
