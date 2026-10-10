import {useEffect, useRef, useState, useSyncExternalStore} from 'react';
import {Check} from 'lucide-react';
import {GESLOTEN, TIJDELIJK_GESLOTEN, WINKEL as WINKELGEGEVENS} from '../site.config.mjs';

/* De schakelaar, de tekst en de winkelgegevens staan in site.config.mjs, want
   de Worker en de bouwscripts hebben ze ook nodig en die kunnen geen .tsx
   inlezen. Hier weer naar buiten, zodat de rest van de site alles uit dezelfde
   plek haalt.

   De naam verschilt met opzet van de `WINKEL` onderaan dit bestand: dat zijn de
   coördinaten voor de kaart, dit zijn de gegevens van de winkel. */
export {GESLOTEN, TIJDELIJK_GESLOTEN, WINKELGEGEVENS};

/* ------------------------------------------------------------------ */
/*  Constanten                                                         */
/* ------------------------------------------------------------------ */

export const TEL = WINKELGEGEVENS.telefoon;
export const TEL_DISPLAY = WINKELGEGEVENS.telefoonWeergave;
export const WHATSAPP = `https://wa.me/${WINKELGEGEVENS.telefoon.replace('+', '')}`;
/* Geen EMAIL. Zie de toelichting bij WINKEL in site.config.mjs: de winkel heeft
   nergens een mailadres staan, dus de site noemt er ook geen. */

/* De kernen op en rond Goeree-Overflakkee waar de winkel zijn klanten vandaan
   haalt. Ze staan op één plek op de homepage, bij de openingstijden, en verder
   nergens: op elke pagina herhaald wordt het een rij plaatsnamen die er alleen
   voor de zoekmachine staat, en dat is precies wat het niet is.

   NOG TE BEVESTIGEN: dit is de streek, geen bezorggebied. Of Bloei! bezorgt en
   wat dat kost is niet bekend, dus daar staat nergens iets over. */
export const STREEKKERNEN = [
  'Goedereede', 'Stellendam', 'Melissant', 'Dirksland', 'Herkingen',
  'Sommelsdijk', 'Middelharnis', 'Nieuwe-Tonge', 'Oude-Tonge',
];
export const STRAAT = WINKELGEGEVENS.straat;
export const PLAATS = `${WINKELGEGEVENS.postcode} ${WINKELGEGEVENS.plaats}`;
export const ROUTE =
  'https://www.google.com/maps/dir/?api=1&destination=Hogepad+9%2C+3253+BH+Ouddorp';
export const FACEBOOK = 'https://www.facebook.com/profile.php?id=100082968740640';

/**
 * NOG TE BEVESTIGEN — zie site.config.mjs.
 *
 * Deze tijden zijn een aanname. Ze staan nergens openbaar en de eigenaren
 * hebben ze niet doorgegeven. Een winkelpagina zonder rooster is niet te
 * beoordelen, dus staat er een rooster dat bij een tuincentrum past; het moet
 * langs de klant voordat deze site live gaat.
 *
 * Maandag tot en met zaterdag, 9:00 tot 18:00, zaterdag tot 17:00. Zondag = 0.
 */
export const OPEN_VAN = 9 * 60;
export const OPEN_TOT = 18 * 60;
export const ZATERDAG_TOT = 17 * 60;
export const OPEN_DAGEN = [1, 2, 3, 4, 5, 6];

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

  /* Zaterdag gaat de deur een uur eerder dicht dan de rest van de week. */
  const sluit = (d: number) => (d === 6 ? ZATERDAG_TOT : OPEN_TOT);
  const klok = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;

  if (OPEN_DAGEN.includes(dag) && minuut >= OPEN_VAN && minuut < sluit(dag)) {
    return {open: true, kop: 'Nu open', onder: `Vandaag tot ${klok(sluit(dag))}, loop gerust binnen`};
  }
  if (OPEN_DAGEN.includes(dag) && minuut < OPEN_VAN) {
    return {open: false, kop: `Vandaag open vanaf ${klok(OPEN_VAN)}`, onder: 'Straks staan de karren weer buiten'};
  }

  /* Zoek de eerstvolgende dag dat de deur opengaat. */
  for (let i = 1; i <= 7; i++) {
    const volgende = (dag + i) % 7;
    if (OPEN_DAGEN.includes(volgende)) {
      const naam = i === 1 ? 'morgen' : DAGEN[volgende];
      return {
        open: false,
        kop: `Nu gesloten`,
        onder: `${naam.charAt(0).toUpperCase()}${naam.slice(1)} weer open vanaf ${klok(OPEN_VAN)}`,
      };
    }
  }
  return {open: false, kop: 'Nu gesloten', onder: 'Maandag weer open vanaf 9:00'};
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
  onder: 'Maandag tot en met zaterdag, 9:00 tot 18:00',
};

/**
 * Zolang de winkel tijdelijk gesloten is klopt het rooster niet en de klok
 * evenmin: er gaat geen deur open, ook niet morgen om 8:00. Dan staat hier de
 * melding, en verder niets dat op een openingstijd lijkt.
 *
 * De berekening hierboven blijft staan. Gaat de winkel weer open, dan is
 * TIJDELIJK_GESLOTEN op false zetten genoeg.
 */
const GESLOTEN_STATUS: Status = {open: false, kop: GESLOTEN.kop, onder: GESLOTEN.kort};

export function useWinkelStatus(): Status {
  const [status, setStatus] = useState<Status>(TIJDELIJK_GESLOTEN ? GESLOTEN_STATUS : ROOSTER_STATUS);
  useEffect(() => {
    if (TIJDELIJK_GESLOTEN) return;
    setStatus(bepaalStatus(new Date()));
  }, []);
  useEffect(() => {
    if (TIJDELIJK_GESLOTEN) return;
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
/*  Vurentakken                                                        */
/* ------------------------------------------------------------------ */

/**
 * Hetzelfde idee als Ranken, maar dan voor november en december: geen blad aan
 * een steel maar naalden aan een tak, zoals aan een kerstboom.
 *
 * De naalden worden gerekend en niet uitgeschreven. Een vurentak heeft er
 * tientallen, en die met de hand in een pad zetten levert een bestand op dat
 * niemand meer durft aan te raken; zo is het één lus met drie getallen eraan.
 * Ze worden korter naar de punt toe, want dat is wat een tak doet.
 */
function Tak({lengte}: {lengte: number}) {
  const naalden = [];
  /* Om de 7 eenheden een paar naalden. Dat getal doet het werk: bij een grotere
     stap worden het losse sprieten en lijkt het eerder een visgraat of een web
     dan een tak, en dat is precies waar de eerste versie hiervan op uitkwam. */
  const stap = 7;
  for (let x = stap; x < lengte; x += stap) {
    const t = x / lengte;
    /* Bij de stam lang, naar de punt toe korter — en nooit langer dan 24, ook
       niet op een lange tak: naalden hebben een eigen maat en schalen niet mee
       met de tak waar ze aan zitten. */
    const n = (1 - t * 0.62) * 24;
    naalden.push(
      <g key={x}>
        <path d={`M${x} 0 l${n * 0.5} ${-n}`} />
        <path d={`M${x} 0 l${n * 0.5} ${n}`} />
      </g>,
    );
  }
  return (
    <g>
      <path d={`M0 0 L${lengte} 0`} />
      {naalden}
    </g>
  );
}

/**
 * Takken die vanuit de randen het vlak in groeien. Staan net als Ranken op zeer
 * lage dekking: textuur die je bij een tweede blik ziet, nooit versiering die
 * met de tekst concurreert.
 */
export function Kerstgroen({className = ''}: {className?: string}) {
  const takken: [number, number, number, number][] = [
    /* x, y, hoek, lengte — langs de randen, nooit door het midden waar de
       tekst staat. */
    [-12, 72, 20, 150],
    [-12, 196, -6, 118],
    [-12, 430, -22, 138],
    [732, 104, 160, 142],
    [732, 268, 186, 112],
    [732, 452, 204, 156],
    [214, -12, 68, 104],
    [470, -12, 104, 96],
    [296, 552, -78, 112],
    [566, 552, -112, 126],
  ];
  return (
    <svg
      viewBox="0 0 720 540"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        {takken.map(([x, y, hoek, lengte], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${hoek})`}>
            <Tak lengte={lengte} />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */

/**
 * Vijf vlakken, en de pagina wisselt ze af zodat er grenzen zichtbaar blijven
 * zonder dat er ergens zwart aan te pas komt:
 *
 *   cream  het lichte groen waar de site op staat
 *   diep   een slag donkerder, voor de kop van een onderwerppagina
 *   wit    waar iets echt moet opvallen tussen twee groene vlakken
 *   ink    het groen van hun bord; het formulier en de voet
 *   kerst  dieper dan ink, met warm licht erop; alleen november en december
 */
type Tone = 'cream' | 'diep' | 'wit' | 'ink' | 'kerst';

const VLAK: Record<Tone, string> = {
  cream: 'bg-cream',
  diep: 'bg-creme-diep',
  wit: 'bg-white',
  ink: 'bg-ink text-white',
  kerst: 'bg-kerstgroen text-white',
};

const DONKER: Tone[] = ['ink', 'kerst'];

export function Section({
  id, children, className = '', tone = 'cream', ranken, slank = false, kerst = false, kraag = false,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  tone?: Tone;
  ranken?: 0 | 1 | 2;
  /** Smalle band in plaats van een volle sectie. */
  slank?: boolean;
  /** Vurentakken en het lichtsnoer langs de bovenrand. */
  kerst?: boolean;
  /**
   * Afgeronde bovenhoeken die over de sectie erboven heen vallen. Alleen onder
   * de hero: daar loopt een foto van rand tot rand door, en een kaarsrechte
   * naad eronder knipt die foto af. Met de kraag schuift het vlak eronder er
   * als een afgerond blad overheen.
   */
  kraag?: boolean;
}) {
  const pad = slank ? 'py-10' : 'py-16 sm:py-24';
  /* Op de donkere vlakken moet het motief lichter zijn dan de ondergrond, op de
     lichte vlakken juist donkerder. Eén tint die het allebei doet bestaat niet. */
  const donker = DONKER.includes(tone);
  const rankKleur = donker ? 'text-white/[0.07]' : 'text-ink/[0.06]';
  const kraagClass = kraag
    ? 'z-10 -mt-7 rounded-t-[2rem] sm:-mt-10 sm:rounded-t-[2.75rem] lg:-mt-12 lg:rounded-t-[3.5rem]'
    : '';
  return (
    <section id={id} className={`relative overflow-hidden ${VLAK[tone]} ${kraagClass} ${className}`}>
      {ranken !== undefined && <Ranken variant={ranken} className={rankKleur} />}
      {kerst && (
        <>
          <Kerstgroen className="text-white/[0.06]" />
          {/* Warm lamplicht dat vanaf de bovenrand het vlak in zakt. Zonder dit
              is het alleen een donkerder groen vlak; mét dit lijkt er licht te
              branden en dat is het verschil tussen groen en kerst. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(70%_100%_at_50%_0%,rgb(246_200_122_/_0.16),transparent_72%)]"
          />
          <div aria-hidden="true" className="kerstsnoer pointer-events-none absolute inset-x-0 top-0 h-[76px]" />
        </>
      )}
      <div className={`relative mx-auto max-w-6xl px-5 sm:px-8 ${pad} ${kerst ? 'pt-24 sm:pt-28' : ''}`}>{children}</div>
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
 * Het echte WhatsApp-teken: de hoorn in de tekstballon. Hier stond eerder de
 * gewone tekstballon uit de iconenset, en die leest als "chat" en niet als
 * WhatsApp — net zoals het Facebook-vlak eerst een fototoestel was. Een
 * merkteken moet je in één oogopslag herkennen, anders weet niemand waar de
 * knop heen gaat.
 *
 * Pad uit simple-icons, dus letterlijk hun eigen vorm. `currentColor`, zodat
 * hij meeloopt met de plek waar hij staat; alleen de knop in de mobiele balk
 * staat in het groen van WhatsApp zelf (#25D366).
 */
/** Het groen van WhatsApp zelf. Het donkere is voor op wit: #25D366 haalt daar geen contrast. */
export const WA_GROEN = '#25D366';
export const WA_DONKER = '#128C7E';

export function WhatsAppMerk({className = '', style}: {className?: string; style?: React.CSSProperties}) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className} style={style}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.347-.347.52-.52.174-.173.232-.297.347-.495.115-.198.057-.372-.03-.521-.087-.148-.669-1.611-.916-2.206-.244-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/**
 * Het blad uit hun eigen bord: het enkele blad dat dwars door de O van BLOEI
 * steekt. Als vector, dus scherp op elk formaat, en meteen de vorm waar de
 * knoppen op de site naar verwijzen.
 */
export function Blad({className = ''}: {className?: string}) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <circle cx="32" cy="32" r="32" fill="currentColor" />
      {/* Het blad staat los van de rand: raakt het de cirkel, dan wordt het op
          28 pixels een vlek in plaats van een blad. */}
      <path
        d="M47 15 C 26 17, 15 31, 17 50 C 38 48, 50 34, 47 15 Z"
        fill="none"
        stroke="#fff"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      <path d="M47 15 C 37 26, 27 38, 17 50" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Hun eigen logo: crèmekleurige letters, het blad door de O, de twee takjes en
 * de vuurtoren van Ouddorp eronder. Dat is letterlijk hun tekening en geen
 * nagezette letter.
 *
 * Twee verschijningen:
 * - `plaatje` (de balk bovenaan en de voet): het hele logo, vrijstaand. Dit
 *   stond hier eerder als een stuk uit de foto van de gevel geknipt, en dat
 *   bracht het groene bord als vlak mee — een postzegel op de pagina, met de
 *   gevel er in de hoeken nog bij. De winkel leverde daarna het logo aan op fel
 *   magenta, juist zodat die achtergrond eruit kan; raw/maak-logo.mjs doet dat
 *   en schrijft logo-bloei.webp met een doorzichtige achtergrond. Het logo
 *   staat nu dus op het vlak zelf en niet op zijn eigen rechthoek.
 * - zonder `plaatje`: blad plus de naam als tekst, meekleurend met de plek waar
 *   hij staat. Voor de plekken midden in een lichte pagina.
 *
 * Let op bij de hoogte: dit logo is hoger dan breed vergeleken met het stuk
 * bord dat hier eerst stond (verhouding 1,6:1 tegen 3:1), want het blad steekt
 * boven de letters uit en de vuurtoren staat eronder. Een balk die op de oude
 * verhouding is gemaakt snijdt de punt van het blad eraf.
 */
export function Merk({
  className = '', maat = 'h-[26px]', plaats = false, plaatje = false,
}: {
  className?: string;
  /** Hoogte van het woordmerk; de breedte volgt uit de verhouding van het logo. */
  maat?: string;
  /** Zet "Ouddorp" ernaast; alleen waar de ruimte het toelaat. */
  plaats?: boolean;
  /** Het hele logo als plaatje, in plaats van blad plus naam als tekst. */
  plaatje?: boolean;
}) {
  if (plaatje) {
    return (
      <span className={`inline-flex items-center gap-3 ${className}`}>
        <img
          src="/img/logo-bloei.webp?v=20261009"
          width={900}
          height={564}
          alt="Bloei!"
          className={`block w-auto ${maat}`}
        />
        {plaats && (
          <span className="hidden text-[11px] font-semibold uppercase leading-none tracking-[0.16em] text-current/45 2xl:block">
            Ouddorp
          </span>
        )}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Blad className="h-8 w-8 shrink-0 text-accent-dark sm:h-9 sm:w-9" />
      <span className={`font-display font-semibold leading-none tracking-tight ${maat}`} style={{fontSize: 'inherit'}}>
        Bloei!
      </span>
      {plaats && (
        <span className="hidden text-[11px] font-semibold uppercase leading-none tracking-[0.16em] text-current/45 2xl:block">
          Ouddorp
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

export const WINKEL: [number, number] = [WINKELGEGEVENS.lon, WINKELGEGEVENS.lat];
