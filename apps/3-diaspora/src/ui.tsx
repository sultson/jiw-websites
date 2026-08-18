import {useEffect, useId, useRef, useState} from 'react';
import {ga, href, useTaal, type Tekst} from './taal';

/** Respecteert de systeeminstelling 'minder beweging'. */
export function useRustig() {
  const [rustig, setRustig] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const zet = () => setRustig(mq.matches);
    zet();
    mq.addEventListener('change', zet);
    return () => mq.removeEventListener('change', zet);
  }, []);
  return rustig;
}

/** Geeft true zodra het element een keer in beeld is geweest. */
export function useInBeeld<T extends HTMLElement>(marge = '0px 0px -15% 0px') {
  const ref = useRef<T>(null);
  const [zichtbaar, setZichtbaar] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setZichtbaar(true);
          io.disconnect();
        }
      },
      {rootMargin: marge},
    );
    io.observe(el);
    return () => io.disconnect();
  }, [marge]);
  return {ref, zichtbaar};
}

/** Telt op naar een getal zodra het in beeld komt. */
export function Teller({naar, duur = 1500, suffix = ''}: {naar: number; duur?: number; suffix?: string}) {
  const {ref, zichtbaar} = useInBeeld<HTMLSpanElement>();
  const rustig = useRustig();
  const [waarde, setWaarde] = useState(0);

  useEffect(() => {
    if (!zichtbaar) return;
    if (rustig) {
      setWaarde(naar);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const stap = (nu: number) => {
      const t = Math.min(1, (nu - start) / duur);
      setWaarde(Math.round(naar * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(stap);
    };
    frame = requestAnimationFrame(stap);
    return () => cancelAnimationFrame(frame);
  }, [zichtbaar, naar, duur, rustig]);

  return (
    <span ref={ref}>
      {waarde}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ adinkra */

/**
 * Adinkra-symbolen, natekend in geometrie zodat ze op elk formaat scherp zijn.
 *
 * Adinkra is Akan, uit het huidige Ghana, en wordt in de hele Afrikaanse
 * diaspora gebruikt. Ze staan hier niet als versiering: elk symbool zit op de
 * plek waar zijn betekenis over gaat, en waar we hem tonen staat die betekenis
 * er ook bij. Zie MERKTEKENS voor de koppeling.
 *
 * Bewust weggelaten: mmere dane. Dat symbool leest als een hakenkruis en heeft
 * op een site over racisme en slavernij niets te zoeken, hoe oud en onschuldig
 * de herkomst ook is.
 */
const PADEN = {
  /* Adinkrahene, drie concentriche cirkels: grootheid en leiderschap. */
  adinkrahene: <>
    <circle cx="50" cy="50" r="12" />
    <circle cx="50" cy="50" r="26" />
    <circle cx="50" cy="50" r="40" />
  </>,
  /* Sankofa in hartvorm: ga terug en haal het op. */
  sankofa: <>
    <path d="M50 90C28 70 14 55 14 39c0-15 13-25 25-25 6 0 11 4 11 11 0 6-4 9-9 9-4 0-6-2-6-5" />
    <path d="M50 90c22-20 36-35 36-51 0-15-13-25-25-25-6 0-11 4-11 11 0 6 4 9 9 9 4 0 6-2 6-5" />
  </>,
  /* Nkonsonkonson, schakels van een ketting: verbondenheid. */
  nkonsonkonson: <>
    <rect x="8" y="30" width="46" height="40" rx="20" />
    <rect x="46" y="30" width="46" height="40" rx="20" />
  </>,
  /* Eban, de omheining: veiligheid en thuis. */
  eban: <>
    <path d="M14 44V14h30M56 14h30v30M86 56v30H56M44 86H14V56" />
    <rect x="36" y="36" width="28" height="28" />
  </>,
  /* Akoma, het hart: geduld en verdraagzaamheid. */
  akoma: <path d="M50 88C26 68 12 54 12 38c0-14 12-24 24-24 7 0 12 3 14 8 2-5 7-8 14-8 12 0 24 10 24 24 0 16-14 30-38 50Z" />,
  /* Nkyinkyim, de kronkelweg: initiatief en aanpassingsvermogen. */
  nkyinkyim: <path d="M12 88V64h19V40h19V16h19v24h19" />,
} as const;

export type Merk = keyof typeof PADEN;

export const MERKTEKENS: Record<Merk, {naam: string; betekenis: Tekst}> = {
  adinkrahene: {
    naam: 'Adinkrahene',
    betekenis: {
      nl: 'grootheid en leiderschap, het symbool waar alle andere omheen zijn gebouwd',
      en: 'greatness and leadership, the symbol all the others are built around',
      pap: 'grandesa i liderasgo, e símbolo ku tur otro a wòrdu konstruí rònt di dje',
    },
  },
  sankofa: {
    naam: 'Sankofa',
    betekenis: {
      nl: 'ga terug en haal op wat je bent vergeten',
      en: 'go back and fetch what you have forgotten',
      pap: 'bai bèk i buska loke bo a lubidá',
    },
  },
  nkonsonkonson: {
    naam: 'Nkonsonkonson',
    betekenis: {
      nl: 'schakels van een ketting, wij zijn met elkaar verbonden',
      en: 'links of a chain, we are bound to one another',
      pap: 'eslabonnan di un kadena, nos ta mará na otro',
    },
  },
  eban: {
    naam: 'Eban',
    betekenis: {
      nl: 'de omheining, veiligheid en een thuis',
      en: 'the fence, safety and a home',
      pap: 'e trankera, siguridat i un kas',
    },
  },
  akoma: {
    naam: 'Akoma',
    betekenis: {
      nl: 'het hart, geduld en verdraagzaamheid',
      en: 'the heart, patience and tolerance',
      pap: 'e kurason, pasenshi i toleransia',
    },
  },
  nkyinkyim: {
    naam: 'Nkyinkyim',
    betekenis: {
      nl: 'de kronkelweg, initiatief en aanpassingsvermogen',
      en: 'the winding road, initiative and adaptability',
      pap: 'e kaminda ku ta bira, inisiativa i kapasidat pa adaptá',
    },
  },
};

export function Adinkra({
  merk,
  maat = 28,
  dikte = 7,
  klasse = '',
  titel,
  style,
}: {merk: Merk; maat?: number; dikte?: number; klasse?: string; titel?: string; style?: React.CSSProperties}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={maat}
      height={maat}
      className={klasse}
      style={style}
      role={titel ? 'img' : undefined}
      aria-label={titel}
      aria-hidden={titel ? undefined : true}
      fill="none"
      stroke="currentColor"
      strokeWidth={dikte}
      strokeLinecap="round"
      strokeLinejoin="round">
      {PADEN[merk]}
    </svg>
  );
}

/* -------------------------------------------------------------------- zegel */

/**
 * Het zegel van een stichting als teken. Elk van de drie heeft een eigen zegel,
 * met Afrika naast het eigen eiland of land, en dat is precies wat deze
 * samenwerking is. Overal waar een teken voor een stichting staat, staat dus
 * hun eigen logo en niet een symbool dat er voor moet doorgaan.
 *
 * Het gaat als masker en niet als plaatje: de tekening is goud, maar de drie
 * vlakken hebben elk hun eigen kleur en op indigo wordt goud vies. Zo staat hij
 * altijd in de kleur van de plek waar hij ligt.
 */
export function Zegel({
  vorm,
  maat = 26,
  kleur = 'currentColor',
  klasse = '',
  titel,
}: {vorm: string; maat?: number; kleur?: string; klasse?: string; titel?: string}) {
  return (
    <span
      role={titel ? 'img' : undefined}
      aria-label={titel}
      aria-hidden={titel ? undefined : true}
      className={`inline-block shrink-0 ${klasse}`}
      style={{
        width: maat,
        height: maat,
        background: kleur,
        maskImage: `url(${vorm})`,
        WebkitMaskImage: `url(${vorm})`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  );
}

/* --------------------------------------------------------------------- doek */

/**
 * Geweven doek achter een vlak: het laken wordt met een kam in velden verdeeld
 * en in elk veld staat een zegel. Op een vlak van een stichting is dat hun eigen
 * zegel, elders dat van 3 Diaspora. Zeer lage dekking, het is textuur en geen
 * decoratie.
 *
 * Het zegel wordt herhaald via een masker met lucht eromheen (zie
 * scripts/doek.mjs), want css tegelt een masker zonder tussenruimte. De
 * kamlijnen staan op dezelfde maat als die tegel, zodat elk zegel midden in zijn
 * eigen veld valt.
 */
const VELD = 190;

export function Doek({
  vorm,
  kleur = '#e0c069',
  dekking = 0.13,
  klasse = '',
}: {vorm?: string; kleur?: string; dekking?: number; klasse?: string}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  /* Zonder eigen zegel is dit een gedeeld vlak. Daar ligt het doek van drie bij
     drie velden waarin alle drie de zegels evenveel voorkomen: het merk van
     3 Diaspora is het zegel van Bonaire, en dat mag hier niet alleen liggen. */
  const tegel = vorm ? VELD : VELD * 3;
  const masker = vorm ?? '/img/merk-doek-drie.png';
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${klasse}`}>
      <div
        className="doek absolute -inset-44 h-[calc(100%+22rem)] w-[calc(100%+22rem)]"
        style={{opacity: dekking}}>
        <svg className="absolute inset-0 size-full" aria-hidden>
          <defs>
            <pattern id={id} width={VELD} height={VELD} patternUnits="userSpaceOnUse">
              {/* de kamlijnen die het doek in velden verdelen, met de hand getrokken dus dubbel */}
              <g stroke={kleur} fill="none">
                <path d={`M0 1H${VELD}M1 0V${VELD}`} strokeWidth="1.5" opacity="0.5" />
                <path d={`M0 7H${VELD}M7 0V${VELD}`} strokeWidth="0.8" opacity="0.28" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${id})`} />
        </svg>
        <span
          className="absolute inset-0 opacity-55"
          style={{
            background: kleur,
            maskImage: `url(${masker})`,
            WebkitMaskImage: `url(${masker})`,
            maskSize: `${tegel}px ${tegel}px`,
            WebkitMaskSize: `${tegel}px ${tegel}px`,
            maskRepeat: 'repeat',
            WebkitMaskRepeat: 'repeat',
          }}
        />
      </div>
    </div>
  );
}

/** Geweven strook. Scheidt twee vlakken zonder dat er een grijze streep staat. */
export function Kente({hoogte = 12, klasse = ''}: {hoogte?: number; klasse?: string}) {
  return <div aria-hidden className={`kente relative w-full ${klasse}`} style={{height: hoogte}} />;
}

/* --------------------------------------------------------------- routering */

/**
 * Interne link. Het pad is taalonafhankelijk (/bonaire), de href krijgt er het
 * taalvoorvoegsel bij (#/pap/bonaire), zodat een gedeelde link ook in de goede
 * taal opent.
 */
export function Link({
  naar,
  className = '',
  children,
  onClick,
  ...rest
}: {naar: string; className?: string; children: React.ReactNode} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const {taal} = useTaal();
  const adres = href(taal, naar);
  return (
    <a
      href={adres}
      className={className}
      onClick={(e) => {
        onClick?.(e);
        /* Het echte adres staat in href, dus rechtermuisknop, middelklik en
           ctrl-klik openen gewoon een tabblad en een zoekmachine leest een
           volwaardige link. Alleen de gewone linkermuisklik vangen we op, want
           daarvoor is dit een eenpagina-site en hoeft er niets opnieuw
           geladen te worden. */
        if (e.defaultPrevented) return;
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        ga(adres);
      }}
      {...rest}>
      {children}
    </a>
  );
}

/**
 * Sprong naar een blok op dezelfde pagina. Het scrollen gaat door onze eigen
 * hand: dan landt ook wie met het toetsenbord springt echt in dat blok, en niet
 * alleen het beeld maar ook de focus.
 */
export function Anker({
  naar,
  className = '',
  children,
  ...rest
}: {naar: string; className?: string; children: React.ReactNode} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={`#${naar}`}
      className={className}
      onClick={(e) => {
        const doel = document.getElementById(naar);
        if (!doel) return;
        e.preventDefault();
        doel.scrollIntoView({behavior: 'smooth', block: 'start'});
        /* wie met het toetsenbord springt moet ook echt in dat blok landen */
        doel.setAttribute('tabindex', '-1');
        doel.focus({preventScroll: true});
      }}
      {...rest}>
      {children}
    </a>
  );
}
