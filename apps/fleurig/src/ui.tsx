import {useEffect, useRef, useState, useSyncExternalStore} from 'react';
import {Check} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Constanten                                                         */
/* ------------------------------------------------------------------ */

export const TEL = '+31630943626';
export const TEL_DISPLAY = '06 30 94 36 26';
export const WHATSAPP = 'https://wa.me/31630943626';
export const EMAIL = 'fleurig26@gmail.com';

/* Bezorgen binnen de Hoeksche Waard heeft een vast tarief, daarbuiten spreken
   ze het per keer af. Staat hier omdat zowel het formulier als de bevestiging
   het noemt, en het bedrag dus maar op één plek hoort te staan. */
export const BEZORGKOSTEN = 6;
export const BEZORGGEBIED = 'Hoeksche Waard';

/* De kernen waar bezorgen onder het vaste tarief valt. Ze stonden alleen in de
   schema.org gegevens in de HTML, dus wel voor een zoekmachine en niet voor een
   bezoeker, terwijl "bezorgen jullie ook in Numansdorp" nu juist de vraag is
   waar iemand uit die kernen mee zit. Eén zin, op één plek: op de homepage bij
   de openingstijden. Op elke pagina herhaald zou het een rij plaatsnamen worden
   die er alleen voor de zoekmachine staat, en dat is precies wat het niet is. */
export const BEZORGKERNEN = [
  'Nieuw-Beijerland', 'Zuid-Beijerland', 'Piershil', 'Klaaswaal', 'Numansdorp',
  'Westmaas', 'Mijnsheerenland', 'Heinenoord', 'Puttershoek', "'s-Gravendeel", 'Strijen',
];
export const STRAAT = 'Molendijk 9-11';
export const PLAATS = '3262 AH Oud-Beijerland';
export const ROUTE =
  'https://www.google.com/maps/dir/?api=1&destination=Molendijk+9%2C+3262+AH+Oud-Beijerland';
export const INSTAGRAM = 'https://www.instagram.com/fleurigbloemenwinkel/';
export const FACEBOOK = 'https://www.facebook.com/share/17wKUrpu1R/';

/* Woensdag tot en met zaterdag, 8:00 tot 17:30. Zondag = 0. */
export const OPEN_VAN = 8 * 60;
export const OPEN_TOT = 17 * 60 + 30;
export const OPEN_DAGEN = [3, 4, 5, 6];

export const DAGEN = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];

/* ------------------------------------------------------------------ */
/*  Is de winkel nu open?                                              */
/* ------------------------------------------------------------------ */

/**
 * Bezoekers zoeken een winkel met de vraag "kan ik er nu heen". Daarom rekent
 * de site dat zelf uit in Nederlandse tijd, in plaats van alleen een rooster te
 * tonen dat de bezoeker met zijn eigen klok moet vergelijken.
 */
type Status = {open: boolean; kop: string; onder: string};

function bepaalStatus(nu: Date): Status {
  const fmt = new Intl.DateTimeFormat('nl-NL', {
    timeZone: 'Europe/Amsterdam',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const delen = Object.fromEntries(fmt.formatToParts(nu).map((p) => [p.type, p.value]));
  const kort = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
  const dag = kort.indexOf(String(delen.weekday).slice(0, 2).toLowerCase());
  const minuut = Number(delen.hour) * 60 + Number(delen.minute);

  if (OPEN_DAGEN.includes(dag) && minuut >= OPEN_VAN && minuut < OPEN_TOT) {
    return {open: true, kop: 'Nu open', onder: 'Vandaag tot 17:30, loop gerust binnen'};
  }
  if (OPEN_DAGEN.includes(dag) && minuut < OPEN_VAN) {
    return {open: false, kop: 'Vandaag open vanaf 8:00', onder: 'Straks staan de emmers weer buiten'};
  }

  /* Zoek de eerstvolgende dag dat de deur opengaat. */
  for (let i = 1; i <= 7; i++) {
    const volgende = (dag + i) % 7;
    if (OPEN_DAGEN.includes(volgende)) {
      const naam = i === 1 ? 'morgen' : DAGEN[volgende];
      return {
        open: false,
        kop: `Nu gesloten`,
        onder: `${naam.charAt(0).toUpperCase()}${naam.slice(1)} weer open vanaf 8:00`,
      };
    }
  }
  return {open: false, kop: 'Nu gesloten', onder: 'Woensdag weer open vanaf 8:00'};
}

/**
 * De eerste weergave kent de klok van de bezoeker nog niet.
 *
 * De pagina's gaan als kant-en-klare HTML de deur uit, en die HTML is gebakken
 * op het moment van de build. Zou hier meteen "Nu open" staan, dan draagt elke
 * bezoeker en elke crawler de openingsstatus van dinsdagmiddag met zich mee tot
 * React heeft gedraaid. Daarom begint deze kaart met het rooster zelf, dat
 * altijd klopt, en pas als de browser meedoet komt er "Nu open" of "Nu gesloten"
 * te staan.
 */
const ROOSTER_STATUS: Status = {
  open: false,
  kop: 'Openingstijden',
  onder: 'Woensdag tot en met zaterdag, 8:00 tot 17:30',
};

export function useWinkelStatus(): Status {
  const [status, setStatus] = useState<Status>(ROOSTER_STATUS);
  useEffect(() => {
    setStatus(bepaalStatus(new Date()));
  }, []);
  useEffect(() => {
    /* Elke minuut bijwerken, zodat de melding niet blijft hangen op een
       pagina die lang openstaat. */
    const t = setInterval(() => setStatus(bepaalStatus(new Date())), 60_000);
    return () => clearInterval(t);
  }, []);
  return status;
}

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
/*  Botanisch motief                                                   */
/* ------------------------------------------------------------------ */

/**
 * Dunne stelen met blad die van onder naar boven door het vlak groeien. Staat
 * op zeer lage dekking; het moet textuur zijn die je pas bij een tweede blik
 * ziet, nooit versiering die met de tekst concurreert.
 */
export function Ranken({className = '', variant = 0}: {className?: string; variant?: 0 | 1 | 2}) {
  const sets: {steel: string; blad: [number, number, number][]}[][] = [
    [
      {steel: 'M60 540 C 90 420, 40 320, 96 200 S 120 96, 108 30', blad: [[88, 400, -30], [64, 300, 28], [104, 210, -24]]},
      {steel: 'M300 540 C 268 430, 330 340, 286 236 S 264 120, 288 40', blad: [[300, 430, 26], [292, 330, -28], [274, 220, 24]]},
      {steel: 'M540 540 C 580 440, 512 350, 566 246 S 596 130, 574 44', blad: [[556, 448, -26], [544, 344, 30], [582, 232, -22]]},
    ],
    [
      {steel: 'M140 540 C 176 428, 118 336, 168 226 S 196 108, 176 24', blad: [[158, 436, 28], [140, 330, -26], [186, 224, 22]]},
      {steel: 'M400 540 C 362 436, 428 348, 384 240 S 356 118, 382 30', blad: [[394, 442, -24], [400, 336, 28], [368, 226, -26]]},
      {steel: 'M640 540 C 604 424, 668 336, 620 228 S 592 112, 618 36', blad: [[634, 430, 26], [640, 324, -28], [606, 216, 24]]},
    ],
    [
      {steel: 'M96 540 C 64 424, 128 330, 82 224 S 56 104, 84 28', blad: [[92, 432, -28], [96, 326, 26], [66, 218, -24]]},
      {steel: 'M356 540 C 396 432, 332 340, 380 232 S 408 112, 384 32', blad: [[372, 438, 24], [356, 332, -30], [400, 222, 22]]},
      {steel: 'M600 540 C 566 428, 630 338, 582 232 S 556 110, 584 28', blad: [[596, 434, -26], [600, 328, 28], [568, 220, -24]]},
    ],
  ];
  const ranken = sets[variant];

  return (
    <svg
      viewBox="0 0 720 540"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        {ranken.map((r, i) => (
          <g key={i}>
            <path d={r.steel} />
            {r.blad.map(([x, y, hoek], j) => (
              <ellipse key={j} cx={x} cy={y} rx="26" ry="9" transform={`rotate(${hoek} ${x} ${y})`} />
            ))}
          </g>
        ))}
      </g>
      {/* Eén steel die zichzelf natekent. Weggehouden bij wie het systeem om
          minder beweging heeft gevraagd. */}
      <path d={ranken[1].steel} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="groei" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */

type Tone = 'cream' | 'wit' | 'ink';

export function Section({
  id, children, className = '', tone = 'cream', ranken, slank = false,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  tone?: Tone;
  ranken?: 0 | 1 | 2;
  /** Smalle band in plaats van een volle sectie. */
  slank?: boolean;
}) {
  const bg = tone === 'wit' ? 'bg-white' : tone === 'ink' ? 'bg-ink text-white' : 'bg-cream';
  const pad = slank ? 'py-10' : 'py-16 sm:py-24';
  return (
    <section id={id} className={`relative overflow-hidden ${bg} ${className}`}>
      {tone === 'ink' && ranken !== undefined && <Ranken variant={ranken} className="text-white/[0.07]" />}
      <div className={`relative mx-auto max-w-6xl px-5 sm:px-8 ${pad}`}>{children}</div>
    </section>
  );
}

export function Kicker({
  children, light = false, bloesem = false,
}: {
  children: React.ReactNode;
  light?: boolean;
  /** Roze in plaats van jade: alleen in de hero, waar de foto al groen is. */
  bloesem?: boolean;
}) {
  const kleur = bloesem ? 'text-bloesem' : light ? 'text-accent' : 'text-accent-dark';
  return (
    <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.18em] ${kleur}`}>
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

/* ------------------------------------------------------------------ */
/*  Merk                                                               */
/* ------------------------------------------------------------------ */

/**
 * Het madeliefje uit hun eigen logo: het roze schijfje met vijf omlijnde
 * blaadjes dat op al hun posters linksboven staat. Als vector, dus scherp op
 * elk formaat, en meteen de vorm waar de knoppen op de site naar verwijzen.
 */
export function Bloem({className = ''}: {className?: string}) {
  const blaadjes = [0, 72, 144, 216, 288];
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <circle cx="32" cy="32" r="32" fill="currentColor" />
      {/* De blaadjes staan net los van elkaar en net los van het hart: raken ze
          elkaar, dan wordt het op 28 pixels een kluwen in plaats van een bloem. */}
      <g fill="none" stroke="#fff" strokeWidth="3">
        {blaadjes.map((hoek) => (
          <ellipse key={hoek} cx="32" cy="18.8" rx="7.2" ry="9" transform={`rotate(${hoek} 32 32)`} />
        ))}
        <circle cx="32" cy="32" r="4.2" />
      </g>
    </svg>
  );
}

/**
 * Hun eigen woordmerk, uit het logobestand dat zij aanleverden: wit "Fleurig!"
 * op een zwarte balk. Het zwart is eruit gesneden (raw/woordmerk.mjs), dus wat
 * hier staat is letterlijk hun tekening en geen nagezette letter. Eerder stond
 * hier Alfa Slab One als tekst, en die letter is niet de hunne.
 *
 * Twee verschijningen, zodat ze te vergelijken zijn:
 * - standaard als masker, dus alleen hun letter, meekleurend met de plek waar
 *   hij staat (wit op donker, en straks desnoods groen op room);
 * - met plaatje=true het hele aangeleverde bord als gewoon plaatje, met het
 *   zwarte vlak en de bloemenstroken erop. Een plaatje kan maar een kleur
 *   hebben, dus dat zwart komt overal mee.
 */
export function Merk({
  className = '', maat = 'h-[26px]', plaats = false, plaatje = false,
}: {
  className?: string;
  /** Hoogte van het woordmerk; de breedte volgt uit de verhouding van hun bestand. */
  maat?: string;
  /** Zet "Oud-Beijerland" ernaast; alleen waar de ruimte het toelaat. */
  plaats?: boolean;
  /**
   * Het hele aangeleverde bord als gewoon plaatje, dus met het zwarte vlak en
   * de twee bloemenstroken erop, in plaats van de uitgesneden letter. Staat
   * hier zodat de balk en de aftiteling naast elkaar te vergelijken zijn.
   */
  plaatje?: boolean;
}) {
  if (plaatje) {
    return (
      <span className={`inline-flex items-center gap-3 ${className}`}>
        <img
          src="/img/logobalk.webp"
          width={600}
          height={174}
          alt="Fleurig!"
          className={`block w-auto rounded-[3px] ${maat}`}
        />
        {plaats && (
          <span className="hidden text-[11px] font-semibold uppercase leading-none tracking-[0.16em] text-white/45 2xl:block">
            Oud-Beijerland
          </span>
        )}
      </span>
    );
  }

  const masker = {
    WebkitMaskImage: 'url(/img/woordmerk.png)',
    maskImage: 'url(/img/woordmerk.png)',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    aspectRatio: '644 / 274',
  } as const;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Bloem className="h-8 w-8 shrink-0 text-roze sm:h-9 sm:w-9" />
      <span role="img" aria-label="Fleurig!" className={`block w-auto bg-current ${maat}`} style={masker} />
      {plaats && (
        <span className="hidden text-[11px] font-semibold uppercase leading-none tracking-[0.16em] text-white/45 2xl:block">
          Oud-Beijerland
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Knoppen                                                            */
/* ------------------------------------------------------------------ */

/**
 * Drie gewichten, en per scherm hoort er maar een van het eerste soort in
 * beeld te staan. Ze staan hier bij elkaar zodat die rangorde niet per sectie
 * opnieuw bedacht wordt: dat is precies hoe er eerder drie roze knoppen
 * tegelijk in de hero terechtkwamen.
 */
export const KNOP_HOOFD =
  'knop-bloem inline-flex items-center justify-center gap-2 bg-roze px-6 py-3.5 font-semibold text-white ' +
  'shadow-[0_10px_30px_-12px_rgb(194_42_95_/_0.9)] transition hover:bg-[#a81f4f]';

/** Op de donkere vlakken: rand, geen vulling. */
export const KNOP_TWEEDE_DONKER =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 ' +
  'font-semibold text-white transition hover:border-white hover:bg-white/10';

/** Op room en wit. */
export const KNOP_TWEEDE_LICHT =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold ' +
  'transition hover:border-accent-dark hover:text-accent-dark';

/** Alleen tekst met een pijl: voor wat wel bereikbaar moet zijn, maar niet vraagt om aandacht. */
export const KNOP_DERDE =
  'inline-flex items-center gap-2 font-semibold underline decoration-white/30 underline-offset-4 ' +
  'transition hover:decoration-white';

/* ------------------------------------------------------------------ */
/*  Kaart                                                              */
/* ------------------------------------------------------------------ */

export const WINKEL: [number, number] = [4.41076, 51.82671];
