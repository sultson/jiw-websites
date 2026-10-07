import {useEffect, useState} from 'react';
import {
  ArrowRight, Camera, ChevronDown, Clock, Flower2, Gift, Home, Leaf, MapPin, Navigation,
  Phone, Shovel, Sparkles, TreePine,
} from 'lucide-react';
import {Bezoek, Footer, MobielBalk, Nav, VraagAan} from './layout';
import {
  FACEBOOK, KNOP_DERDE, KNOP_HOOFD, KNOP_TWEEDE_LICHT, Kicker, PLAATS, ROUTE, Section, STRAAT,
  TEL, TEL_DISPLAY, WHATSAPP, useKnopInBeeld, useWinkelStatus,
} from './ui';

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

/**
 * Bij Fleurig! was dit paneel donkergroen op de foto. De winkel wilde van het
 * zwart af, dus staat het hier andersom: een licht paneel met donkergroene
 * letters erop. De vervaging doet het echte werk. Ze haalt het patroon eronder
 * weg, zodat de ondergrond een vlakke toon wordt in plaats van honderd losse
 * blaadjes.
 *
 * Geen randje om de letters. Dat kwam mee uit Fleurig!, waar lichte tekst op
 * een donker paneel stond: daar licht een donkere rand de letter op. Hier is
 * de tekst zelf donkergroen, en dan zet datzelfde randje een wolk van dezelfde
 * kleur om elke letter heen — de letter wordt dikker en de vorm vaag. Daarom
 * staat het paneel ook op 95 in plaats van 85 procent: de foto erachter mag
 * niet meer door de tekst heen prikken.
 */
const PANEEL =
  'rounded-3xl bg-cream/95 px-6 py-7 backdrop-blur-2xl ring-1 ring-white/50 ' +
  'shadow-[0_30px_70px_-40px_rgb(39_53_27_/_0.6)] sm:px-8 sm:py-9';

/**
 * Twee kopfoto's, allebei van henzelf.
 *
 * Standaard het buitenterrein in kleur. De gevel met het naambord stond hier
 * eerst, want op een nieuwe naam is dat het eerste dat moet landen — maar het
 * paneel met de tekst en de witte statuskaart staan allebei over het bord
 * heen, en een logo dat half achter twee panelen verdwijnt landt niet. Het
 * bord staat nu groot in beeld bij "Waar u ons vindt", waar niets eroverheen
 * valt, en in de balk bovenaan.
 *
 * Met ?hero=pui erachter verschijnt de gevel alsnog op precies dezelfde
 * pagina. Een gewone bezoeker merkt er niets van, en de link is te delen.
 */
const HEROS = {
  bloemen: {
    naam: 'hero-bloemen',
    alt: 'De buitentafels vol chrysanten en margrieten in geel, rood, oranje en roze',
  },
  pui: {
    naam: 'hero-pui',
    alt: 'De gevel van Bloei! met het groene naambord, de karren met planten ervoor',
  },
} as const;

/* Uit de zoekopdracht in de adresbalk, en dus pas als de browser meedoet: de
   pagina wordt als kant-en-klare HTML gebakken en kent daar geen adresbalk. Zou
   dit tijdens het renderen gebeuren, dan valt de gebakken HTML niet meer samen
   met wat React in de browser maakt. */
function useHeroFoto() {
  const [foto, setFoto] = useState<(typeof HEROS)[keyof typeof HEROS]>(HEROS.bloemen);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('hero') === 'pui') setFoto(HEROS.pui);
  }, []);
  return foto;
}

function StatusKaart() {
  const status = useWinkelStatus();
  return (
    <div className="rounded-2xl border border-line bg-white p-5 text-ink shadow-[0_24px_60px_-30px_rgb(39_53_27_/_0.5)]">
      <div className="flex items-center gap-2.5">
        <span className={`relative flex h-2.5 w-2.5 ${status.open ? 'text-accent-dark' : 'text-ink/30'}`}>
          <span className={`absolute inline-flex h-full w-full rounded-full ${status.open ? 'animate-ping bg-accent-dark/60' : ''}`} />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-current" />
        </span>
        <p className="font-semibold">{status.kop}</p>
      </div>
      <p className="mt-1 text-sm text-ink/60">{status.onder}</p>

      <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
        <div className="flex gap-3">
          <dt className="shrink-0 text-ink/45"><Clock className="h-4 w-4" /></dt>
          <dd>Maandag tot en met zaterdag, 9:00 tot 18:00</dd>
        </div>
        <div className="flex gap-3">
          <dt className="shrink-0 text-ink/45"><MapPin className="h-4 w-4" /></dt>
          <dd>{STRAAT}, {PLAATS}</dd>
        </div>
      </dl>

      <p className="mt-4 border-t border-line pt-4 text-sm text-ink/55">
        Zoekt u iets bepaalds?{' '}
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-accent-dark underline decoration-accent-dark/30 underline-offset-4 transition hover:decoration-accent-dark"
        >
          Stuur ons een appje
        </a>
      </p>
    </div>
  );
}

function Hero() {
  /* De hoofdknop meldt zich aan, zodat de vaste balk onderaan op mobiel
     wegblijft zolang hij zelf in beeld staat. */
  const knopRef = useKnopInBeeld<HTMLAnchorElement>('hero');
  const foto = useHeroFoto();

  return (
    <section id="top" className="relative isolate overflow-hidden bg-cream text-ink">
      <picture className="absolute inset-0 -z-20 block">
        <source media="(min-width: 1024px)" srcSet={`/img/${foto.naam}.webp`} />
        <img
          src={`/img/${foto.naam}-staand.webp`}
          alt={foto.alt}
          fetchPriority="high"
          className="h-full w-full object-cover object-center"
        />
      </picture>

      <div
        className={
          'mx-auto grid max-w-6xl items-center gap-10 px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-32 ' +
          'lg:grid-cols-[1.05fr_0.85fr] lg:gap-14 lg:pb-24 lg:pt-36'
        }
      >
        <div className={PANEEL}>
          <Kicker>Bloemen, planten, tuin en wonen &middot; Ouddorp</Kicker>

          <h1 className="text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
            Alles voor binnen<br />
            <span className="text-accent-dark">en buiten</span>
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink">
            Snijbloemen en kamerplanten, tuinplanten en potten, potgrond en meststoffen. Het hele jaar
            door, van voorjaarsviolen tot de kerstboom.
          </p>

          {/* Eén hoofdknop. De winkel leeft van mensen die binnenlopen, dus dat
              is de route. Bellen staat er als rand naast, en doorbladeren is
              alleen een tekstlink: het is een sprong op dezelfde pagina, geen
              stap die om aandacht hoort te vragen. */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a ref={knopRef} href={ROUTE} target="_blank" rel="noreferrer" className={KNOP_HOOFD}>
              <Navigation className="h-4 w-4" /> Route naar de winkel
            </a>
            <a href={`tel:${TEL}`} className={`${KNOP_TWEEDE_LICHT} border-ink/20 bg-white/70`}>
              <Phone className="h-4 w-4 text-accent-dark" /> {TEL_DISPLAY}
            </a>
          </div>

          <a href="#winkel" className={`${KNOP_DERDE} mt-5 text-sm text-ink/70 decoration-ink/25 hover:decoration-ink`}>
            Bekijk wat er staat <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="lg:justify-self-end lg:w-full">
          <StatusKaart />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  In de winkel                                                       */
/* ------------------------------------------------------------------ */

/**
 * Vijf onderdelen, vier daarvan met een eigen pagina erachter. "Wonen" heeft er
 * geen: wat daarover te zeggen valt staat op de assortimentspagina, en een knop
 * naar een pagina die alleen zichzelf herhaalt is een teleurstelling.
 */
const WINKELKAARTEN = [
  {
    img: '/img/kaart-bloemen.webp',
    icon: Flower2,
    titel: 'Bloemen',
    tekst: 'Snijbloemen, orchideeën en bloeiende kamerplanten. Het assortiment groeit; boeketten maken we op bestelling.',
    href: '/assortiment/#bloemen',
  },
  {
    img: '/img/kaart-planten.webp',
    icon: Leaf,
    titel: 'Planten',
    tekst: 'Kamerplanten van klein tot manshoog, vetplanten, palmen en olijfbomen.',
    href: '/assortiment/#planten',
  },
  {
    img: '/img/kaart-tuin.webp',
    icon: Shovel,
    titel: 'Tuin',
    tekst: 'Perkgoed en vaste planten, potgrond en tuinaarde, meststoffen, houtsnippers en graszaad voor elk soort gazon.',
    href: '/assortiment/#tuin',
  },
  {
    img: '/img/kaart-wonen.webp',
    icon: Home,
    titel: 'Wonen',
    tekst: 'Binnen- en buitenpotten, schalen en vazen, in keramiek en in kleur.',
    href: '/assortiment/#wonen',
  },
  {
    img: '/img/kaart-cadeau.webp',
    icon: Gift,
    titel: 'Cadeau',
    tekst: 'Cadeaubonnen en samengestelde cadeaupakketjes. U zegt wat het mag kosten, wij maken het klaar.',
    href: '/cadeau/',
  },
];

function InDeWinkel() {
  return (
    <Section id="winkel" tone="cream" ranken={0}>
      <div className="max-w-2xl">
        <Kicker>In de winkel</Kicker>
        <h2 className="text-3xl font-semibold sm:text-4xl">Kom gerust even rondkijken</h2>
        <p className="mt-4 text-lg leading-relaxed text-ink/70">
          Binnen staat de overdekte hal met kamerplanten, potten en schalen. Buiten liggen de tafels met
          perkgoed, vaste planten en heesters, en staan de zakken grond en mest. Weet u niet wat u zoekt,
          dan denken we graag met u mee.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {WINKELKAARTEN.map((k) => (
          <article key={k.titel} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
            <img src={k.img} alt={k.titel} loading="lazy" width={800} height={1000} className="aspect-[4/5] w-full object-cover" />
            <div className="flex flex-1 flex-col p-5">
              <k.icon className="h-5 w-5 text-accent-dark" />
              <h3 className="mt-3 text-lg font-semibold">{k.titel}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{k.tekst}</p>
              <a
                href={k.href}
                className="mt-4 inline-flex items-center gap-1.5 self-start pt-1 text-sm font-semibold text-accent-dark underline decoration-accent-dark/25 underline-offset-4 transition hover:decoration-accent-dark"
              >
                Meer informatie <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Kerst                                                              */
/* ------------------------------------------------------------------ */

/**
 * November en december zijn het seizoen waar de winkel het van moet hebben, dus
 * staat kerst hoog op de pagina en niet onderaan bij "door het jaar heen".
 *
 * Geen foto: er is nog geen enkele kerstfoto van deze winkel. Een gekochte
 * sfeerfoto van een andere kerstafdeling zou hier precies de verwachting zetten
 * die de winkel daarna moet waarmaken. Daarom een vlak in hun eigen groen met
 * de opsomming erop, tot ze zelf beeld hebben.
 */
const KERST = ['Kerstbomen', 'Kerstkransen', 'Verlichting', 'Kerstaccessoires', 'Kerststukjes'];

function Kerstblok() {
  return (
    <Section id="kerst" tone="ink" ranken={1}>
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <Kicker light>November en december</Kicker>
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Vanaf november staat de winkel in het teken van kerst
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/75">
            De hal gaat om: kerstbomen voor de deur, kransen en verlichting binnen, en een tafel vol
            accessoires. Wie vroeg is heeft de ruimste keuze, en wie laat is vindt er nog altijd een
            boom.
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {KERST.map((k) => (
              <span key={k} className="rounded-full border border-white/20 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/85">
                {k}
              </span>
            ))}
          </div>

          <div className="mt-9">
            <a href="/kerst/" className={KNOP_HOOFD}>
              Bekijk het kerstassortiment <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-8">
          <TreePine className="h-10 w-10 text-accent" strokeWidth={1.5} />
          <p className="mt-5 text-lg font-semibold">Vanaf begin november</p>
          <p className="mt-2 leading-relaxed text-white/65">
            De kerstafdeling bouwen we elk jaar opnieuw op. Wilt u weten wanneer de bomen binnen zijn?
            Bel ons of kijk op Facebook.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`tel:${TEL}`} className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:border-white hover:bg-white/10">
              <Phone className="h-4 w-4 text-accent" /> {TEL_DISPLAY}
            </a>
            <a href={FACEBOOK} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:border-white hover:bg-white/10">
              <Camera className="h-4 w-4 text-accent" /> Facebook
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Door het seizoen                                                   */
/* ------------------------------------------------------------------ */

const SEIZOEN = [
  {
    img: '/img/seizoen-voorjaar.webp',
    titel: 'Voorjaar',
    tekst: 'Violen en primula\'s op de tafels buiten, hortensia\'s in knop, en graszaad en tuinaarde voor wie het gazon weer wil bijwerken.',
  },
  {
    img: '/img/seizoen-zomer.webp',
    titel: 'Zomer',
    tekst: 'Hibiscus, echinacea, mandevilla en lavendel. Hangpotten voor aan de schutting en terraspotten voor de grote planten.',
  },
  {
    img: '/img/seizoen-najaar.webp',
    titel: 'Najaar',
    tekst: 'Chrysanten in alle kleuren, heide, siergrassen en herfstschalen. Daarna draait de hele winkel door naar kerst.',
  },
];

/* Kleine vierkante uitsneden: deze staan als miniatuur op de pagina, dus de
   volle bestanden zouden puur laadtijd zijn die niemand ziet. */
const STROOK: [string, string][] = [
  ['/img/mini-violen.webp', 'Violen'],
  ['/img/mini-echinacea.webp', 'Echinacea'],
  ['/img/mini-mandevilla.webp', 'Mandevilla'],
  ['/img/mini-olijf.webp', 'Olijfbomen'],
  ['/img/mini-palm.webp', 'Palmen'],
  ['/img/mini-peper.webp', 'Sierpeper'],
  ['/img/mini-potten.webp', 'Potten'],
  ['/img/mini-schalen.webp', 'Schalen'],
];

function Seizoen() {
  return (
    <Section id="seizoen" tone="cream">
      <div className="max-w-2xl">
        <Kicker>Door het jaar heen</Kicker>
        <h2 className="text-3xl font-semibold sm:text-4xl">Wat er staat, verandert mee</h2>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {SEIZOEN.map((s) => (
          <article key={s.titel} className="overflow-hidden rounded-2xl border border-line bg-white">
            <img src={s.img} alt={s.titel} loading="lazy" width={800} height={1000} className="aspect-[4/5] w-full object-cover" />
            <div className="p-6">
              <h3 className="text-lg font-semibold">{s.titel}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{s.tekst}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-4 gap-3 sm:grid-cols-8">
        {STROOK.map(([src, naam]) => (
          <figure key={src}>
            <img src={src} alt={naam} loading="lazy" width={320} height={320} className="aspect-square w-full rounded-xl object-cover" />
            <figcaption className="mt-1.5 text-center text-[11px] font-medium text-ink/45">{naam}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Abonnement                                                         */
/* ------------------------------------------------------------------ */

/**
 * Het abonnement van Bloei! is iets anders dan dat van Fleurig!: daar ging het
 * om een boeket voor thuis, hier om opgemaakte plantenbakken en vazen die bij
 * restaurants en bedrijven op tafel en in de zaak staan en die de winkel komt
 * verversen. Het heet toch abonnement: de winkel wil die naam houden.
 *
 * Geen prijzen en geen frequenties: die zijn niet bekend. Wat hier staat is de
 * vorm, niet de voorwaarden.
 */
const ABONNEMENT = [
  {
    icon: Leaf,
    kop: 'Opgemaakte plantenbakken',
    tekst: 'Voor op tafel, bij de ingang of op het terras. Wij maken ze op en komen ze verversen.',
  },
  {
    icon: Flower2,
    kop: 'Vazen met bloemen',
    tekst: 'Liever snijbloemen dan groen? Dan komen er vazen, met wat op dat moment het mooist is.',
  },
  {
    icon: Sparkles,
    kop: 'Passend bij de zaak',
    tekst: 'We kijken eerst bij u binnen: wat past bij de ruimte, het licht en de kleuren die er al zijn.',
  },
  {
    icon: Clock,
    kop: 'Een vast ritme',
    tekst: 'U spreekt af hoe vaak we langskomen. Een keer overslaan of stoppen kan altijd.',
  },
];

function Abonnementblok() {
  return (
    <Section id="abonnement" tone="wit">
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <img
          src="/img/zakelijk.webp"
          alt="Opgemaakte plantenbakken in keramiek op de toonbank van de winkel"
          width={1000}
          height={1250}
          loading="lazy"
          className="aspect-[4/5] w-full rounded-2xl object-cover"
        />

        <div>
          <Kicker>Abonnement voor restaurants en bedrijven</Kicker>
          <h2 className="text-3xl font-semibold sm:text-4xl">Groen op tafel, zonder dat u er omkijken naar heeft</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/70">
            Opgemaakte plantenbakken of vazen met bloemen, bij u in de zaak. Wij maken ze op, zetten ze
            neer en komen ze verversen, zodat er nooit iets staat dat over zijn hoogtepunt heen is.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {ABONNEMENT.map((a) => (
              <div key={a.kop} className="flex gap-3.5">
                <a.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent-dark" />
                <div>
                  <p className="font-semibold leading-snug">{a.kop}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink/65">{a.tekst}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#vraag-aan" className={KNOP_HOOFD}>
              Vraag een voorstel aan <ArrowRight className="h-4 w-4" />
            </a>
            <a href="/abonnement/" className={KNOP_TWEEDE_LICHT}>
              Meer informatie <ArrowRight className="h-4 w-4 text-accent-dark" />
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Over ons                                                           */
/* ------------------------------------------------------------------ */

function Over() {
  return (
    <Section id="over" tone="cream" ranken={2}>
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          {/* De echte maten staan erbij: zonder die twee getallen stond de tekst
              eronder tot het laden een stuk hoger op de pagina en sprong hij
              daarna weg. */}
          <img
            src="/img/over-winkel.webp"
            alt="De overdekte hal van Bloei! met de houten wanden, de stellingen met potten en de grote kamerplanten"
            loading="lazy"
            decoding="async"
            width={1200}
            height={900}
            className="h-auto w-full rounded-2xl object-cover"
          />
          <p className="mt-2.5 text-xs text-ink/45">Binnen in de hal aan het Hogepad</p>
        </div>

        <div>
          <Kicker>Over ons</Kicker>
          <h2 className="text-3xl font-semibold sm:text-4xl">Wij zijn Bloei!</h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink/70">
            <p>
              Bloei! is onze winkel voor bloemen, planten, tuin en wonen in Ouddorp. Binnen de overdekte
              hal met kamerplanten, potten en schalen, buiten het terrein met perkgoed, vaste planten en
              alles wat er in de grond moet.
            </p>
            <p>
              Het bloemenassortiment is nog aan het groeien. Dat betekent niet dat het er niet is: kunt u
              niet vinden wat u zoekt, laat het ons weten. We kunnen veel regelen, en boeketten maken we
              op bestelling.
            </p>
            <p>
              Loop gerust binnen om te kijken. Weet u niet precies wat u nodig heeft voor uw tuin of uw
              kamer, dan denken we graag met u mee.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href={FACEBOOK} target="_blank" rel="noreferrer" className={KNOP_TWEEDE_LICHT}>
              <Camera className="h-4 w-4 text-accent-dark" /> Volg ons op Facebook
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Vragen                                                             */
/* ------------------------------------------------------------------ */

const VRAGEN: [string, string][] = [
  [
    'Kan ik zomaar binnenlopen?',
    'Ja. Maandag tot en met zaterdag staat de winkel open, zonder afspraak. Voor een boeket of een cadeaupakket op bestelling is even bellen of een aanvraag doen handiger.',
  ],
  [
    'Ik kan niet vinden wat ik zoek. Kunnen jullie het bestellen?',
    'Waarschijnlijk wel. Ons bloemenassortiment is aan het groeien, dus het kan zijn dat iets er vandaag nog niet staat. Vertel ons wat u zoekt, dan kijken we wat we kunnen regelen.',
  ],
  [
    'Maken jullie boeketten op bestelling?',
    'Dat doen we. U zegt voor wie het is, in welke kleuren u denkt en wat het ongeveer mag kosten, dan maken wij er iets van. Bel ons of vul het formulier in.',
  ],
  [
    'Wat verkopen jullie voor de tuin?',
    'Potgrond, tuinaarde en hydrokorrels, meststoffen en houtsnippers. Graszaad in verschillende soorten: om door te zaaien, voor een nieuw gazon, voor schaduw en voor een gazon waar gespeeld wordt. Daarnaast perkgoed en vaste planten, heesters, siergrassen en bomen in pot, en binnen- en buitenpotten in alle maten.',
  ],
  [
    'Hebben jullie een cadeaubon?',
    'Die hebben we. Handig als u iets moois wilt geven maar de ontvanger liever zelf laat kiezen. Daarnaast stellen we cadeaupakketjes samen: u zegt wat het mag kosten, wij maken het klaar.',
  ],
  [
    'Doen jullie ook iets voor bedrijven?',
    'Ja. We maken plantenbakken en vazen op voor restaurants en bedrijven, zetten ze neer en komen ze verversen. U spreekt zelf af hoe vaak dat is.',
  ],
  [
    'Wanneer begint het kerstseizoen?',
    'Vanaf begin november. Dan komen de kerstbomen, de kransen, de verlichting en de accessoires binnen en gaat de hal om. Wie vroeg is heeft de ruimste keuze.',
  ],
];

function Vragen() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="vragen" tone="cream">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <Kicker>Vragen</Kicker>
          <h2 className="text-3xl font-semibold sm:text-4xl">Veelgesteld</h2>
          <p className="mt-4 leading-relaxed text-ink/65">
            Staat uw vraag er niet bij? Bel of app ons gerust.
          </p>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {VRAGEN.map(([vraag, antwoord], i) => (
            <div key={vraag}>
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-semibold">{vraag}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-accent-dark transition ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && <p className="-mt-1 pb-5 leading-relaxed text-ink/65">{antwoord}</p>}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

export default function App() {
  return (
    <>
      <Nav />
      <main id="inhoud" className="pb-20 md:pb-0">
        <Hero />
        <InDeWinkel />
        <Kerstblok />
        <Seizoen />
        <Abonnementblok />
        <VraagAan />
        <Over />
        <Bezoek streek />
        <Vragen />
      </main>
      <Footer />
      <MobielBalk />
    </>
  );
}
