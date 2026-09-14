import {useEffect, useState} from 'react';
import {
  Phone, MessageCircle, Mail, Menu, X, ShieldCheck, Gauge, MapPin,
  ChevronDown, Clock, FileCheck2, Wrench, Plug, CircuitBoard, Star,
  ArrowRight, Ruler, Zap,
} from 'lucide-react';
import Aanvraag from './Aanvraag';
import AnalyticsConsent from './AnalyticsConsent';
import {readConsent, trackPage, trackContactLink} from './analytics';
import KaartLazy from './KaartLazy';
import {
  Bullet, Kicker, Logo, Mark, PHONE, PHONE_DISPLAY, EMAIL, PLAATSEN, Section, Traces,
  useFormKnopInBeeld, wa,
} from './ui';
import {
  Marquee, Reveal, Teller, useKantel, useScrollVoortgang, useSpot, useWisselwoord,
  useZachteWaarde,
} from './anim';
import {Laadtijd, Tijdlijn, VoorNa} from './interactief';

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

/* Prices taken from the reference price list Armando sent, plus the EUR 100
   across-the-board raise he asked for on 2026-09-01. */
const GROEPEN_1F = [
  {groepen: 4, prijs: 619}, {groepen: 5, prijs: 629}, {groepen: 6, prijs: 640},
  {groepen: 7, prijs: 665}, {groepen: 8, prijs: 680}, {groepen: 9, prijs: 760},
  {groepen: 10, prijs: 780}, {groepen: 11, prijs: 799},
];

/* Only the 5-groeps 3-fase price appeared on the reference list (EUR 595, now
   695 after the raise). The rest of this ladder is an estimate and is flagged
   as such on the site. */
const GROEPEN_3F = [
  {groepen: 5, prijs: 695}, {groepen: 6, prijs: 720}, {groepen: 7, prijs: 750},
  {groepen: 8, prijs: 775}, {groepen: 9, prijs: 845}, {groepen: 10, prijs: 875},
  {groepen: 11, prijs: 899},
];

const GROEPENKAST_INBEGREPEN = [
  'Groepenkast van ABB, Hager of Eaton naar keuze',
  'Uw oude groepenkast gedemonteerd en afgevoerd',
  'Alle bestaande groepen opnieuw aangesloten',
  'Elke groep leesbaar gelabeld',
  'Doorgemeten en getest',
];

const LAADPALEN = [
  {
    merk: 'Zaptec',
    model: 'Go 2',
    prijs: 1495,
    tag: 'Meest gekozen',
    tekst: 'Compact aan de gevel en schakelt zelf tussen 1- en 3-fase.',
    specs: ['1- en 3-fase, tot 22 kW', 'MID-meter ingebouwd', 'Laadt op zonoverschot', 'Wifi en 4G, bediening via app'],
  },
  {
    merk: 'Enphase',
    model: 'IQ EV Charger 2',
    prijs: 1695,
    tag: null,
    tekst: 'Voor wie al Enphase op het dak heeft: laadpaal, panelen en verbruik in één app.',
    specs: ['1- en 3-fase, tot 22 kW', 'Één app met uw panelen', 'Stuurt op eigen opwek', 'Vaste kabel of contactdoos'],
  },
  {
    merk: 'Alfen',
    model: 'Eve Single Pro-line',
    prijs: 1695,
    tag: 'Nederlands fabricaat',
    tekst: 'In Nederland gemaakt, ook geschikt voor zakelijk gebruik en verrekenen.',
    specs: ['1- en 3-fase, tot 22 kW', 'Actieve load balancing', 'Zakelijk verrekenen mogelijk', 'Ook als laadpaal op een voet'],
  },
];

const LAADPAAL_INBEGREPEN = [
  'De laadpaal zelf, met fabrieksgarantie',
  'Montage aan de gevel of op een eigen voet',
  'Tot 10 meter kabel vanaf de meterkast',
  'Eigen groep met de juiste beveiliging',
  'Load balancing, zodat uw hoofdzekering niet uitvalt',
  'Ingesteld in de app en bij u thuis uitgelegd',
  'Doorgemeten en getest',
];

const MEERWERK = [
  {wat: 'Extra kabel boven de 10 meter', prijs: 'vanaf € 9 per meter'},
  {wat: 'Kabel weggewerkt in een sleuf of onder bestrating', prijs: 'op maat'},
  {wat: 'Doorvoer door een muur of kruipruimte', prijs: 'op maat'},
  {wat: 'Verzwaring naar 3-fase (aanvraag netbeheerder)', prijs: 'op maat'},
  {wat: 'Extra groep of aardlekautomaat in de meterkast', prijs: 'op maat'},
];

const STAPPEN = [
  {
    icon: MapPin,
    titel: 'U vult het formulier in',
    tekst: 'Wat er moet gebeuren en waar, met een foto van de groepenkast erbij.',
  },
  {
    icon: FileCheck2,
    titel: 'Ik reken het uit',
    tekst: 'Binnen één werkdag één bedrag, zonder uurtje-factuurtje.',
  },
  {
    icon: Wrench,
    titel: 'Ik kom het doen',
    tekst: 'Een groepenkast in een halve tot hele dag, een laadpaal meestal in een halve.',
  },
  {
    icon: Ruler,
    titel: 'Ik meet het na',
    tekst: 'Elke groep doorgemeten, getest en leesbaar gelabeld.',
  },
];

const REVIEWS = [
  {
    quote: 'Oude stoppenkast eruit, nieuwe groepenkast erin, en om vier uur was alles weer aan. Netjes gewerkt en alles keurig gelabeld.',
    naam: 'Familie de Wit',
    plaats: 'Breda',
  },
  {
    quote: 'Vooraf een bedrag gekregen en dat is het ook gebleven. De laadpaal hangt precies waar ik hem hebben wilde.',
    naam: 'Mark',
    plaats: 'Prinsenbeek',
  },
  {
    quote: 'Kwam op een zaterdag langs omdat de aardlek er steeds uit vloog. Probleem gevonden en meteen opgelost.',
    naam: 'Sanne',
    plaats: 'Oosterhout',
  },
];

const FAQ = [
  {
    v: 'Hoe weet ik of ik 1-fase of 3-fase heb?',
    a: 'Kijk in uw meterkast naar de hoofdschakelaar boven de groepen. Ziet u één brede zwarte schakelaar, dan heeft u 1-fase. Ziet u er drie naast elkaar, of één blok waar drie hendels aan elkaar gekoppeld zitten, dan heeft u 3-fase. Twijfelt u? Zet er een foto bij in het formulier, dan zeg ik het u binnen een paar minuten.',
  },
  {
    v: 'Moet mijn groepenkast vervangen worden?',
    a: 'Dat is verstandig als u nog draaizekeringen of keramische stoppen heeft, als er geen of maar één aardlekschakelaar zit, als de groepenkast vol zit en u wilt uitbreiden, of als de aardlek er regelmatig uit vliegt. Ook bij een verbouwing, een nieuwe keuken, een warmtepomp of een laadpaal is het meestal het moment.',
  },
  {
    v: 'Hoe lang zit ik zonder stroom?',
    a: 'Bij het vervangen van een groepenkast staat de stroom een aantal uren uit. We spreken vooraf af wanneer, zodat u er rekening mee kunt houden.',
  },
  {
    v: 'Kan ik een laadpaal krijgen met 1-fase?',
    a: 'Ja. Op 1-fase laadt u tot ongeveer 7,4 kW: een lege accu is er in een nacht weer doorheen. Wilt u sneller, of staan er twee auto\'s op de oprit, dan is verzwaren het overwegen waard. Die aanvraag doe ik voor u bij de netbeheerder.',
  },
  {
    v: 'Werkt de laadpaal samen met mijn zonnepanelen?',
    a: 'Ja. Alle laadpalen die ik plaats laden op uw eigen opwek, zodat er zoveel mogelijk van uw eigen stroom de auto in gaat. Bij de oplevering stel ik dat meteen goed voor u in.',
  },
  {
    v: 'Krijg ik garantie?',
    a: 'Op de apparatuur geldt de fabrieksgarantie, bij laadpalen doorgaans drie jaar. Op mijn eigen werk geef ik garantie. Voor ik wegga wordt elke groep doorgemeten en getest, zodat de installatie aantoonbaar volgens NEN 1010 is aangelegd.',
  },
];

/* ------------------------------------------------------------------ */
/*  Header met voortgangsbalk                                          */
/* ------------------------------------------------------------------ */

const NAV = [
  {href: '#groepenkasten', label: 'Groepenkasten'},
  {href: '#laadpalen', label: 'Laadpalen'},
  {href: '#werkwijze', label: 'Werkwijze'},
  {href: '#over', label: 'Over Jasper'},
  {href: '#contact', label: 'Contact'},
];

function Header() {
  const [open, setOpen] = useState(false);
  const [gescrold, setGescrold] = useState(false);
  const voortgang = useScrollVoortgang();

  useEffect(() => {
    const onScroll = () => setGescrold(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* De balk is altijd zwart met witte tekst; scrollen zet er alleen een randje
     en wat diepte onder. Nieuw in deze versie: de dunne groene lijn onderaan
     laat zien hoe ver u door de pagina bent. */
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-ink transition-shadow duration-300 ${
        gescrold || open ? 'border-b border-white/10 shadow-lg shadow-black/20' : ''
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" aria-label="InstallatieVeilig">
          <Logo variant="light" />
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="group relative text-sm font-medium text-white/80 transition hover:text-white"
            >
              {n.label}
              <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={`tel:${PHONE}`}
            className="flex items-center gap-2 rounded-full border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/60"
          >
            <Phone className="h-4 w-4 text-accent" /> <span className="data">{PHONE_DISPLAY}</span>
          </a>
          <a
            href="#aanvraag"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-accent-dark"
          >
            Prijs aanvragen
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-lg border border-accent/40 bg-accent/12 text-accent transition lg:hidden"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10">
        <div
          className="h-full bg-accent"
          style={{width: `${voortgang * 100}%`, transition: 'width .15s linear'}}
        />
      </div>

      {open && (
        <div className="border-t border-white/10 bg-ink lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-5 py-2 sm:px-8">
            {NAV.map((n) => (
              <a
                key={n.href} href={n.href} onClick={() => setOpen(false)}
                className="border-b border-white/10 py-3.5 font-medium text-white last:border-0"
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

const WISSELWOORDEN = ['veilig geregeld', 'vakkundig gelegd', 'netjes weggewerkt', 'gekeurd opgeleverd'];

function Hero() {
  const [woord, i] = useWisselwoord(WISSELWOORDEN);
  const spot = useSpot<HTMLDivElement>();

  return (
    <div id="top" ref={spot} className="spot relative overflow-hidden bg-ink pt-20 text-white">
      <Traces variant={0} className="text-white/[0.05]" tweedePuls />
      {/* Het aardteken uit het logo, groot en heel licht. De vonk laat het af en
          toe even oplichten; zonder animatie blijft het gewoon op 10 procent. */}
      <Mark className="pointer-events-none absolute -bottom-24 -left-28 h-[26rem] w-[26rem] text-white/[0.10] vonk" />

      {/* Op mobiel komt het formulier direct onder de introtekst, daarom de
          losse volgorde-klassen; op desktop staat het rechts naast de tekst. */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid lg:grid-cols-[1fr_26rem] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-8 lg:py-20">
        <div className="order-1 lg:order-none lg:col-start-1 lg:row-start-1 lg:self-start">
          <div className="mb-5 flex flex-wrap items-center gap-2.5">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white">
              <MapPin className="h-3.5 w-3.5 text-accent" /> Regio Breda
            </p>
          </div>

          <h1 className="text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-[3.3rem]">
            Elektra in huis,{' '}
            {/* Het slot van de kop wisselt: vier keer hetzelfde vak werk. */}
            <span key={i} className="woord-in text-accent">{woord}</span>
          </h1>

          <p className="mt-6 hidden max-w-lg text-lg leading-relaxed text-white/70 sm:block">
            Een nieuwe groepenkast of een laadpaal aan de gevel. U weet vooraf wat het kost,
            ik doe het werk zelf en meestal is dat binnen één dag gerealiseerd.
          </p>
        </div>

        <div id="aanvraag" className="order-2 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
          <Aanvraag />
        </div>

        <div className="order-3 lg:order-none lg:col-start-1 lg:row-start-2 lg:self-start">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {href: '#groepenkasten', icon: CircuitBoard, titel: 'Groepenkasten', onder: 'ABB · Hager · Eaton'},
              {href: '#laadpalen', icon: Plug, titel: 'Laadpalen', onder: 'Zaptec · Enphase · Alfen'},
            ].map((d) => (
              <a
                key={d.titel}
                href={d.href}
                className="group flex items-center gap-3.5 rounded-2xl border border-white/15 bg-white/[0.06] p-4 transition hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/[0.08]"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/20 text-accent ring-1 ring-accent/30 transition group-hover:ring-accent/70">
                  <d.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 font-semibold">
                    {d.titel}
                    <ArrowRight className="h-4 w-4 text-accent transition group-hover:translate-x-1" />
                  </span>
                  <span className="block truncate text-xs text-white/50">{d.onder}</span>
                </span>
              </a>
            ))}
          </div>

          {/* Secundair: liever even overleggen dan een formulier invullen. */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
            <span className="text-white/45">Liever direct overleggen?</span>
            <a
              href={wa('Hallo Jasper, ik heb een vraag over')}
              target="_blank" rel="noreferrer"
              className="flex items-center gap-2 font-semibold text-white/85 underline-offset-4 transition hover:text-white hover:underline"
            >
              <MessageCircle className="h-4 w-4 text-accent" /> WhatsApp
            </a>
            <a
              href={`tel:${PHONE}`}
              className="flex items-center gap-2 font-semibold text-white/85 underline-offset-4 transition hover:text-white hover:underline"
            >
              <Phone className="h-4 w-4 text-accent" /> <span className="data">{PHONE_DISPLAY}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Doorlopende merkenstrook                                           */
/* ------------------------------------------------------------------ */

const MERKEN = ['ABB', 'Hager', 'Eaton', 'Zaptec', 'Enphase', 'Alfen', 'NEN 1010'];

function MerkenStrook() {
  return (
    <div className="border-y border-white/10 bg-ink-soft py-5 text-white">
      <Marquee seconden={34}>
        {MERKEN.map((m) => (
          <span key={m} className="flex items-center gap-7 pr-7">
            <span className="font-display text-xl font-semibold tracking-tight text-white/70">{m}</span>
            <Zap className="h-3.5 w-3.5 text-accent" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Trust strip                                                        */
/* ------------------------------------------------------------------ */

const TRUST = [
  {icon: FileCheck2, titel: 'Één bedrag vooraf'},
  {icon: Clock, titel: 'Antwoord binnen een werkdag'},
  {icon: ShieldCheck, titel: 'Gekeurd volgens NEN 1010'},
  {icon: MapPin, titel: 'Regio Breda'},
];

function TrustStrip() {
  return (
    <div className="border-b border-line bg-mist">
      <div className="mx-auto grid max-w-6xl gap-5 px-5 py-7 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {TRUST.map((t, i) => (
          <Reveal key={t.titel} delay={i * 80}>
            <div className="flex items-center gap-3">
              <t.icon className="h-5 w-5 shrink-0 text-accent-dark" strokeWidth={1.75} />
              <p className="text-sm font-semibold leading-snug">{t.titel}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Diensten                                                           */
/* ------------------------------------------------------------------ */

type Dienst = {
  href: string;
  img: string;
  alt: string;
  icon: typeof Plug;
  titel: string;
  tekst: string;
  merken: string;
};

function DienstKaart({c, delay}: {c: Dienst; delay: number}) {
  const kantel = useKantel<HTMLAnchorElement>(4);
  return (
    <Reveal delay={delay}>
      <a
        ref={kantel}
        href={c.href}
        className="group block overflow-hidden rounded-2xl border border-line bg-white hover:shadow-2xl"
        style={{transition: 'transform .25s ease, box-shadow .3s ease'}}
      >
        <div className="overflow-hidden">
          <img
            src={c.img} alt={c.alt} loading="lazy"
            className="h-56 w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </div>
        <div className="p-7">
          <div className="flex items-center gap-2.5">
            <c.icon className="h-5 w-5 text-accent-dark" />
            <h3 className="text-2xl font-semibold">{c.titel}</h3>
          </div>
          <p className="mt-3 leading-relaxed text-ink-muted">{c.tekst}</p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-ink-muted">{c.merken}</p>
          <p className="mt-5 flex items-center gap-1.5 font-semibold text-ink">
            Bekijk de opties en prijzen
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </p>
        </div>
      </a>
    </Reveal>
  );
}

function Diensten() {
  const cards: Dienst[] = [
    {
      href: '#groepenkasten',
      img: '/img/meterkast.jpg',
      alt: 'Nieuwe groepenkast naast de meter, op de vaste plek in de meterkast',
      icon: CircuitBoard,
      titel: 'Groepenkasten',
      tekst: 'Een veilige en toekomstbestendige groepenkast volgens de huidige normen.',
      merken: 'ABB · Hager · Eaton',
    },
    {
      href: '#laadpalen',
      img: '/img/laadpaal-detail.jpg',
      alt: 'Strakke witte laadpaal aan een gevel',
      icon: Plug,
      titel: 'Laadpalen',
      tekst:
        'Slim, snel en betrouwbaar laden met een laadpaal die professioneel wordt geïnstalleerd en klaar is voor de toekomst.',
      merken: 'Zaptec · Enphase · Alfen',
    },
  ];

  return (
    <Section id="diensten">
      <Reveal>
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold sm:text-4xl">Onze diensten</h2>
        </div>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2">
        {cards.map((c, i) => <DienstKaart key={c.titel} c={c} delay={i * 120} />)}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Groepenkasten: 1-fase vs 3-fase                                    */
/* ------------------------------------------------------------------ */

/** Draadje dat laat zien hoeveel fasen er binnenkomen, met stroom erdoorheen. */
function FaseDraden({fasen}: {fasen: 1 | 3}) {
  const aders = fasen === 1 ? ['#8a5a2b'] : ['#8a5a2b', '#2a2a2a', '#9aa0a6'];
  return (
    <svg viewBox="0 0 240 56" className="h-12 w-full" aria-hidden="true">
      {aders.map((c, i) => {
        const y = fasen === 1 ? 28 : 14 + i * 14;
        return (
          <g key={i}>
            <line x1="8" y1={y} x2="232" y2={y} stroke={c} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
            <line
              x1="8" y1={y} x2="232" y2={y}
              stroke="#45d62f" strokeWidth="2.5" strokeLinecap="round"
              className="stroom" style={{animationDelay: `${i * 0.2}s`}}
            />
          </g>
        );
      })}
    </svg>
  );
}

function FaseUitleg() {
  const kolommen = [
    {
      fasen: 1 as const,
      img: '/img/groepenkast-1fase.jpg',
      titel: '1-fase',
      spanning: '230 V',
      aders: 'L + N',
      tekst:
        'Veilige en overzichtelijke groepenkast voor woningen met een 1-fase aansluiting. Geïnstalleerd volgens de geldende normen en voorbereid op de toekomst.',
      punten: [
        'Hoofdaansluiting 1 x 25A of 1 x 35A',
        'Ongeveer 5,7 tot 8 kW tegelijk',
        'Een laadpaal laadt tot circa 7,4 kW',
      ],
    },
    {
      fasen: 3 as const,
      img: '/img/groepenkast-3fase.jpg',
      titel: '3-fase',
      spanning: '230/400 V',
      aders: 'L1 + L2 + L3 + N',
      tekst:
        'Meer vermogen en klaar voor de toekomst. Een 3-fase groepenkast biedt voldoende capaciteit voor zwaardere elektrische installaties, zoals laadpalen, zonnepanelen, inductieplaat en warmtepompen.',
      punten: [
        'Hoofdaansluiting meestal 3 x 25A',
        'Ongeveer 17 kW tegelijk',
        'Een laadpaal laadt tot 11 of 22 kW',
      ],
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {kolommen.map((k, i) => (
        <Reveal key={k.titel} delay={i * 130} vorm={i === 0 ? 'links' : 'rechts'}>
          <div className="group h-full overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] transition hover:border-accent/40">
            <div className="overflow-hidden">
              <img
                src={k.img}
                alt={`Open groepenkast met een ${k.titel} aansluiting: ${k.spanning}, ${k.aders}`}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="px-7 pt-5">
              <FaseDraden fasen={k.fasen} />
              <p className="data mt-1 mb-2 text-center text-xs font-semibold uppercase tracking-widest text-white/45">
                {k.spanning} <span className="text-white/25">/</span> {k.aders}
              </p>
            </div>
            <div className="px-7 pb-7">
              <h4 className="text-2xl font-semibold">{k.titel}</h4>
              <p className="mt-3 leading-relaxed text-white/65">{k.tekst}</p>
              <ul className="mt-5 space-y-2.5 text-sm text-white/80">
                {k.punten.map((p) => <Bullet key={p} light>{p}</Bullet>)}
              </ul>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/** Het bedrag telt naar zijn nieuwe waarde als u van fase wisselt. */
function PrijsCel({prijs}: {prijs: number}) {
  const zacht = useZachteWaarde(prijs, 650);
  return <>€ {Math.round(zacht).toLocaleString('nl-NL')},-</>;
}

function Prijstabel() {
  const [fase, setFase] = useState<'1' | '3'>('1');
  const rows = fase === '1' ? GROEPEN_1F : GROEPEN_3F;

  return (
    <div>
      <div className="mb-6 inline-flex rounded-full border border-white/15 bg-white/[0.06] p-1">
        {(['1', '3'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFase(f)}
            aria-pressed={fase === f}
            className={`data rounded-full px-6 py-2.5 text-sm font-bold transition ${
              fase === f ? 'bg-accent text-ink' : 'text-white/55 hover:text-white'
            }`}
          >
            {f}-fase
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/12 bg-white/[0.03]">
        <div className="grid grid-cols-2 gap-4 border-b border-white/10 bg-white/[0.04] px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-white/45 sm:grid-cols-3">
          <span>Groepenkast</span>
          <span className="hidden sm:block">Geschikt voor</span>
          <span className="text-right">Inclusief montage vanaf</span>
        </div>
        {rows.map((r) => (
          <div
            key={r.groepen}
            className="grid grid-cols-2 items-center gap-4 border-b border-white/[0.07] px-6 py-4 transition last:border-0 hover:bg-white/[0.04] sm:grid-cols-3"
          >
            <span className="font-semibold">
              <span className="data">{r.groepen}</span> groepen{' '}
              <span className="text-sm font-normal text-white/45">/ <span className="data">{fase}</span>-fase</span>
            </span>
            <span className="hidden text-sm text-white/50 sm:block">
              {r.groepen <= 5 ? 'Appartement of kleine woning'
                : r.groepen <= 8 ? 'Rijwoning of tussenwoning'
                : 'Ruime woning of veel apparatuur'}
            </span>
            <span className="data text-right text-lg font-bold text-white">
              <PrijsCel prijs={r.prijs} />
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-white/50">
        Inclusief montage en btw, voor een vervanging op de bestaande plek.
        {fase === '3' && ' De 3-fase tarieven zijn richtprijzen: wat het exact wordt hangt af van het aantal krachtgroepen.'}
      </p>
    </div>
  );
}

function Groepenkasten() {
  const spot = useSpot<HTMLElement>();
  return (
    <section id="groepenkasten" ref={spot} className="spot relative overflow-hidden bg-ink text-white">
      <Traces variant={1} className="text-white/[0.05]" />
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <div className="mb-10 max-w-2xl">
            <Kicker light>Groepenkasten</Kicker>
            <h2 className="text-3xl font-bold sm:text-4xl">1-fase of 3-fase?</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/65">
              Dat verschil bepaalt hoeveel stroom u tegelijk kunt gebruiken. En welke groepenkast geschikt is
            </p>
          </div>
        </Reveal>

        <FaseUitleg />

        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-white/12 bg-white/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3.5">
            <Gauge className="mt-0.5 h-6 w-6 shrink-0 text-accent" />
            <p className="text-sm leading-relaxed text-white/80">
              <strong className="text-white">Niet zeker welke aansluiting u heeft?</strong>{' '}
              Fotografeer de groepenkast en stuur het mee met uw aanvraag.
            </p>
          </div>
          <a
            href="#aanvraag"
            className="shrink-0 rounded-full bg-accent px-5 py-3 text-center text-sm font-semibold text-ink transition hover:bg-accent-dark"
          >
            Laat het me zien
          </a>
        </div>

        {/* Voor en na, met een greep om te slepen. Twee keer eigen werk, en
            per paar staat de camera op dezelfde plek: schuiven laat alleen
            zien wat er echt veranderd is. */}
        <div className="mt-20">
          <Reveal>
            <div className="mb-10 max-w-2xl">
              <Kicker light>Voor en na</Kicker>
              <h3 className="text-2xl font-semibold sm:text-3xl">Sleep de greep en zie het verschil</h3>
              <p className="mt-4 leading-relaxed text-white/65">
                Twee klussen van mijn eigen hand, allebei vanaf dezelfde plek gefotografeerd
                voordat ik begon en nadat ik klaar was.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-10 sm:grid-cols-2 sm:gap-8 lg:gap-12">
            <Reveal vorm="links">
              <VoorNa
                voor="/img/groepenkast-voor.jpg"
                na="/img/groepenkast-na.jpg"
                voorAlt="Meterkast voor de verbouwing, met keramische draaizekeringen en losse bedrading"
                naAlt="Dezelfde meterkast na de verbouwing, met een nieuwe groepenkast met aardlekautomaten"
                titel="Groepenkast"
                tekst="Van draaizekeringen en los hangende bedrading naar een groepenkast waarin elke groep zijn eigen beveiliging heeft, met ruimte om een laadpaal of warmtepomp bij te plaatsen."
              />
            </Reveal>
            <Reveal vorm="rechts" delay={120}>
              <VoorNa
                voor="/img/laadpaal-voor.jpg"
                na="/img/laadpaal-na.jpg"
                voorAlt="Kale gevel van een woning voordat de laadpaal geplaatst werd"
                naAlt="Dezelfde gevel met een geplaatste Zaptec laadpaal en de kabel netjes weggewerkt"
                titel="Laadpaal"
                tekst="Van een kale gevel naar een laadpaal die er hoort te hangen: recht uitgelijnd, de kabel strak langs de muur weggewerkt en aangesloten op een eigen groep."
              />
            </Reveal>
          </div>
        </div>

        <div id="prijzen" className="mt-20 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <Reveal vorm="links">
            <Kicker light>Prijzen</Kicker>
            <h3 className="mb-6 text-3xl font-semibold">Wat kost een nieuwe groepenkast?</h3>
            <Prijstabel />
          </Reveal>

          <Reveal vorm="rechts" delay={120}>
            <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-7">
              <h4 className="text-xl font-semibold">Dit zit er altijd bij</h4>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white/80">
                {GROEPENKAST_INBEGREPEN.map((i) => <Bullet key={i} light>{i}</Bullet>)}
              </ul>
            </div>

            <div className="mt-6 rounded-2xl border border-white/12 bg-white/[0.04] p-7">
              <h4 className="text-xl font-semibold">Ik werk met</h4>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {['ABB', 'Hager', 'Eaton'].map((m) => (
                  <div
                    key={m}
                    className="rounded-xl border border-white/12 bg-white/[0.06] py-4 text-center font-semibold tracking-tight transition hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/[0.08]"
                  >
                    {m}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Laadpalen                                                          */
/* ------------------------------------------------------------------ */

function Laadpalen() {
  const spot = useSpot<HTMLElement>();
  return (
    <section id="laadpalen" ref={spot} className="spot relative overflow-hidden bg-ink text-white">
      <Traces variant={2} className="text-white/[0.05]" tweedePuls />
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-12 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-14">
          <Reveal vorm="links">
            <Kicker light>Laadpalen</Kicker>
            <h2 className="text-3xl font-bold sm:text-4xl">Thuis laden, compleet geregeld</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/65">
              U kiest een laadpaal, ik regel de rest.
            </p>
            <ul className="mt-7 space-y-3 text-white/80">
              {LAADPAAL_INBEGREPEN.map((i) => <Bullet key={i} light>{i}</Bullet>)}
            </ul>
          </Reveal>
          <Reveal vorm="rechts">
            <div className="overflow-hidden rounded-2xl">
              <img
                src="/img/laadpaal-huis.jpg"
                alt="Laadpaal aan de gevel van een woning met een elektrische auto op de oprit"
                loading="lazy"
                className="aspect-[16/10] w-full object-cover transition duration-[1200ms] hover:scale-105"
              />
            </div>
          </Reveal>
        </div>

        {/* Laadtijdrekenaar */}
        <Reveal vorm="schaal">
          <Laadtijd />
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {LAADPALEN.map((l, i) => (
            <Reveal key={l.merk} delay={i * 110}>
              <div className="relative flex h-full flex-col rounded-2xl border border-white/12 bg-white/[0.04] p-7 transition hover:-translate-y-1 hover:border-accent/50 hover:bg-white/[0.06]">
                {l.tag && (
                  <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-xs font-bold text-ink">
                    {l.tag}
                  </span>
                )}
                <p className="text-xs font-semibold uppercase tracking-widest text-white/45">{l.merk}</p>
                <h3 className="mt-1 text-2xl font-semibold">{l.model}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{l.tekst}</p>
                <ul className="mt-5 space-y-2.5 text-sm text-white/80">
                  {l.specs.map((s) => <Bullet key={s} light>{s}</Bullet>)}
                </ul>
                <div className="mt-7 border-t border-white/10 pt-5">
                  <p className="text-xs text-white/45">Compleet geïnstalleerd vanaf</p>
                  <p className="data text-3xl font-bold text-white">
                    € <Teller naar={l.prijs} />,-
                  </p>
                  <a
                    href="#aanvraag"
                    className="mt-4 flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:border-accent hover:bg-accent/10"
                  >
                    Vraag deze aan
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Reveal vorm="links">
            <div className="overflow-hidden rounded-2xl border border-white/12">
              <div className="border-b border-white/10 bg-white/[0.04] px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-white/45">
                Meerwerk
              </div>
              {MEERWERK.map((m) => (
                <div
                  key={m.wat}
                  className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-6 py-3.5 text-sm text-white/75 transition last:border-0 hover:bg-white/[0.04]"
                >
                  <span>{m.wat}</span>
                  <span className="data shrink-0 text-xs font-bold text-white/45">{m.prijs}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal vorm="rechts">
            <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-7">
              <h4 className="text-xl font-semibold">Nog geen idee welke laadpaal?</h4>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Geef uw automerk door en of u panelen heeft, dan hoort u welke laadpaal past.
              </p>
              <a
                href="#aanvraag"
                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-ink transition hover:bg-accent-dark"
              >
                Vraag advies
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Werkwijze                                                          */
/* ------------------------------------------------------------------ */

function Werkwijze() {
  return (
    <Section id="werkwijze" tone="mist">
      <Reveal>
        <div className="mb-12 max-w-2xl">
          <Kicker>Werkwijze</Kicker>
          <h2 className="text-3xl font-bold sm:text-4xl">Van aanvraag tot oplevering</h2>
        </div>
      </Reveal>
      <Tijdlijn stappen={STAPPEN} />
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Over                                                               */
/* ------------------------------------------------------------------ */

function Over() {
  return (
    <Section id="over">
      {/* Jaspers foto staat sinds 1-9 op zijn volle bron (1200x1600 in plaats
          van de 240x320 thumbnail), dus de kolom hoeft niet langer klein te
          blijven om de zachtheid te verbergen. Op 480 px is hij nog altijd
          ruim twee keer oversampled. */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
        <Reveal vorm="links">
          <figure className="mx-auto max-w-[480px] lg:sticky lg:top-28 lg:mx-0">
            <div className="overflow-hidden rounded-2xl">
              <img
                src="/img/jasper.jpg"
                alt="Jasper Mijvis naast een door hem geplaatste laadpaal"
                loading="lazy"
                className="aspect-[3/4] w-full object-cover transition duration-[1200ms] hover:scale-105"
              />
            </div>
            <figcaption className="mt-3 text-sm text-ink-muted">
              Jasper Mijvis bij een door hem geplaatste laadpaal
            </figcaption>
          </figure>
        </Reveal>

        <div>
          <Reveal vorm="rechts">
            <Kicker>Over Jasper</Kicker>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Mijn naam is Jasper en ik ben de eigenaar van Installatie Veilig
            </h2>

            <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink-muted">
              <p>
                Als elektricien help ik particulieren en bedrijven met veilige, betrouwbare en
                toekomstbestendige elektrotechnische installaties. Of het nu gaat om het
                vervangen van een groepenkast, het installeren van een laadpaal of het
                uitbreiden van een bestaande installatie, ik vind het belangrijk dat iedere klus
                netjes, veilig en volgens de nieuwste normen wordt uitgevoerd.
              </p>
              <p>
                Naast mijn werk als zelfstandig elektricien werk ik al jarenlang bij Defensie.
                Daar draag ik de verantwoordelijkheid voor het onderhoud, de veiligheid en de
                inzetbaarheid van complexe technische systemen. In die functie is
                nauwkeurigheid, verantwoordelijkheid en kwaliteit geen keuze, maar een absolute
                vereiste. Die manier van werken neem ik iedere dag mee in mijn eigen bedrijf.
              </p>
              <p>
                Ik geloof dat vakmanschap verder gaat dan alleen een goede installatie
                opleveren. Heldere communicatie, eerlijk advies en afspraken nakomen zijn voor
                mij minstens zo belangrijk. Ik neem de tijd om uit te leggen wat ik doe, denk
                graag mee over de beste oplossing en zorg ervoor dat een installatie niet alleen
                vandaag goed werkt, maar ook klaar is voor de toekomst.
              </p>
              <p>
                Als zelfstandig ondernemer ben ik pas tevreden wanneer mijn klanten dat ook
                zijn. Daarom werk ik uitsluitend met kwalitatieve materialen, volgens de
                geldende NEN-normen en met oog voor een nette afwerking. U kunt rekenen op een
                persoonlijke aanpak, korte lijnen en één vast aanspreekpunt van offerte tot
                oplevering.
              </p>
              <p className="font-medium text-ink">
                Bent u op zoek naar een betrouwbare elektricien die kwaliteit, veiligheid en
                service voorop stelt? Dan help ik u graag verder.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Reviews                                                            */
/* ------------------------------------------------------------------ */

function Reviews() {
  const spot = useSpot<HTMLElement>();
  return (
    <section ref={spot} className="spot relative overflow-hidden bg-ink text-white">
      <Traces variant={0} className="text-white/[0.05]" />
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <div className="mb-10 max-w-2xl">
            <Kicker light>Klanten</Kicker>
            <h2 className="text-3xl font-bold sm:text-4xl">Wat klanten zeggen</h2>
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.naam} delay={i * 130}>
              <div className="h-full rounded-2xl border border-white/12 bg-white/[0.04] p-7 transition hover:-translate-y-1 hover:border-accent/40">
                <div className="flex gap-0.5">
                  {Array.from({length: 5}).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="mt-4 leading-relaxed text-white/85">"{r.quote}"</p>
                <p className="mt-5 text-sm font-semibold">{r.naam}</p>
                <p className="text-sm text-white/45">{r.plaats}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Werkgebied                                                         */
/* ------------------------------------------------------------------ */

function Werkgebied() {
  return (
    <Section tone="ink">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14">
        <Reveal vorm="links">
          <Kicker light>Werkgebied</Kicker>
          <h2 className="text-3xl font-bold sm:text-4xl">Regio Breda</h2>
          <div className="mt-7 flex flex-wrap gap-2">
            {PLAATSEN.map(([naam, , , thuis]) => (
              <span
                key={naam}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:border-accent/60 ${
                  thuis ? 'border-accent/50 bg-accent/10 text-white' : 'border-white/15 bg-white/[0.05] text-white/75'
                }`}
              >
                {naam}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm text-white/45">
            Woont u er net buiten? Vraag het gerust.
          </p>
        </Reveal>

        <Reveal vorm="rechts">
          <KaartLazy />
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section tone="mist">
      <Reveal>
        <div className="mb-10 max-w-2xl">
          <Kicker>Veelgestelde vragen</Kicker>
          <h2 className="text-3xl font-bold sm:text-4xl">Goed om te weten</h2>
        </div>
      </Reveal>
      <div className="mx-auto max-w-3xl divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {FAQ.map((f, i) => (
          <div key={f.v}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold transition hover:bg-mist"
            >
              {f.v}
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-ink-muted transition-transform duration-300 ${
                  open === i ? 'rotate-180 text-accent-dark' : ''
                }`}
              />
            </button>
            {/* Uitklappen zonder sprong: de rij groeit van 0fr naar 1fr. */}
            <div className={`acc ${open === i ? 'acc-open' : ''}`}>
              <div>
                <p className="px-6 pb-6 leading-relaxed text-ink-muted">{f.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact                                                            */
/* ------------------------------------------------------------------ */

function Contact() {
  const spot = useSpot<HTMLElement>();
  return (
    <section id="contact" ref={spot} className="spot relative overflow-hidden bg-ink text-white">
      <Traces variant={1} className="text-white/[0.05]" tweedePuls />
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_26rem] lg:gap-16">
          <Reveal vorm="links">
            <Kicker light>Contact</Kicker>
            <h2 className="text-3xl font-bold sm:text-4xl">Vraag uw prijs aan</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/65">
              Zet er een foto van uw meterkast bij, dan hoef ik meestal niet eerst langs te
              komen om te kijken.
            </p>

            <div className="mt-8 space-y-3">
              <a
                href={wa('Hallo Jasper, ik heb een vraag over')}
                target="_blank" rel="noreferrer"
                className="flex items-center gap-4 rounded-xl border border-white/12 bg-white/[0.04] p-4 transition hover:-translate-y-0.5 hover:border-white/30"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#25D366]/15">
                  <MessageCircle className="h-5 w-5 text-[#25D366]" />
                </span>
                <span className="font-semibold">WhatsApp</span>
              </a>
              <a
                href={`tel:${PHONE}`}
                className="flex items-center gap-4 rounded-xl border border-white/12 bg-white/[0.04] p-4 transition hover:-translate-y-0.5 hover:border-white/30"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white/10">
                  <Phone className="h-5 w-5 text-white/70" />
                </span>
                <span>
                  <span className="block font-semibold">Bellen</span>
                  <span className="data block text-sm text-white/50">{PHONE_DISPLAY}</span>
                </span>
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-4 rounded-xl border border-white/12 bg-white/[0.04] p-4 transition hover:-translate-y-0.5 hover:border-white/30"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white/10">
                  <Mail className="h-5 w-5 text-white/70" />
                </span>
                <span>
                  <span className="block font-semibold">E-mail</span>
                  <span className="block text-sm text-white/50">{EMAIL}</span>
                </span>
              </a>
            </div>

            <div className="mt-8 hidden overflow-hidden rounded-2xl lg:block">
              <img
                src="/img/werk-detail.jpg"
                alt="Monteur werkt aan de bedrading in een groepenkast"
                loading="lazy"
                className="aspect-[3/2] w-full object-cover transition duration-[1200ms] hover:scale-105"
              />
            </div>
          </Reveal>

          <Reveal vorm="rechts">
            <Aanvraag />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer + mobiele actiebalk                                         */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink pb-24 text-white lg:pb-0">
      <Traces variant={2} className="text-white/[0.04]" />
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo variant="light" className="h-9 sm:h-10" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
              Groepenkasten en laadpalen in en rond Breda.
            </p>
          </div>
          <div>
            <p className="font-semibold">Diensten</p>
            <ul className="mt-3 space-y-2 text-sm text-white/55">
              <li><a href="#groepenkasten" className="transition hover:text-accent">Groepenkasten</a></li>
              <li><a href="#prijzen" className="transition hover:text-accent">Prijzen</a></li>
              <li><a href="#laadpalen" className="transition hover:text-accent">Laadpalen</a></li>
              <li><a href="#werkwijze" className="transition hover:text-accent">Werkwijze</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-white/55">
              <li><a href="#aanvraag" className="transition hover:text-accent">Prijs aanvragen</a></li>
              <li><a href={`tel:${PHONE}`} className="data transition hover:text-accent">{PHONE_DISPLAY}</a></li>
              <li><a href={wa('Hallo Jasper,')} target="_blank" rel="noreferrer" className="transition hover:text-accent">WhatsApp</a></li>
              <li><a href={`mailto:${EMAIL}`} className="transition hover:text-accent">{EMAIL}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-xs text-white/40">
          <p>© {new Date().getFullYear()} InstallatieVeilig, Jasper Mijvis</p>
          <p>KvK: 87402270</p>
          <AnalyticsConsent />
        </div>
      </div>
    </footer>
  );
}

function MobielCta() {
  /* Zolang de knop van het formulier zelf in beeld staat, blijft deze balk weg:
     anders staan er twee knoppen die hetzelfde doen. */
  const formKnopInBeeld = useFormKnopInBeeld();
  if (formKnopInBeeld) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[auto_1fr] gap-2 border-t border-white/10 bg-ink/95 p-3 backdrop-blur lg:hidden">
      <a
        href={wa('Hallo Jasper, ik heb een vraag over')}
        target="_blank" rel="noreferrer"
        aria-label="WhatsApp"
        className="grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white"
      >
        <MessageCircle className="h-5 w-5" />
      </a>
      <a
        href="#aanvraag"
        className="flex items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-semibold text-ink"
      >
        Vraag uw prijs aan <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function App() {
  useEffect(() => {
    readConsent();
    trackPage();
    document.addEventListener('click', trackContactLink);
    return () => document.removeEventListener('click', trackContactLink);
  }, []);
  return (
    <>
      <Header />
      <main>
        <Hero />
        <MerkenStrook />
        <TrustStrip />
        <Diensten />
        <Groepenkasten />
        <Laadpalen />
        <Werkwijze />
        <Over />
        <Reviews />
        <Werkgebied />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobielCta />
    </>
  );
}
