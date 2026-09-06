import {useEffect, useState} from 'react';
import {
  ArrowRight, Briefcase, Camera, ChevronDown, CircleAlert, Clock, Flower2, Gift, Heart, Instagram,
  MapPin, Navigation, Phone, Repeat, Sparkles, Wallet,
} from 'lucide-react';
import {Bezoek, Footer, MobielBalk, Nav, VraagAan} from './layout';
import {
  FACEBOOK, GESLOTEN, INSTAGRAM, KNOP_DERDE, KNOP_HOOFD, KNOP_TWEEDE_DONKER,
  KNOP_TWEEDE_LICHT, Kicker, PLAATS, ROUTE, Section, STRAAT,
  TEL, TEL_DISPLAY, TIJDELIJK_GESLOTEN, WHATSAPP, useKnopInBeeld, useWinkelStatus,
} from './ui';

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

/* Een wijde gloed om de letters maakt ze op dit drukke tapijt juist wolliger:
   de bloemblaadjes blijven er doorheen prikken en de rand van de letter wordt
   zacht. Wat overblijft is een klein randje, als achtervang voor browsers die
   de vervaging achter het paneel niet kunnen. */
const TEKST_HALO = '[text-shadow:0_1px_3px_rgb(13_42_33_/_0.55)]';

/* De leesbaarheid zit in dit paneel en niet in een waas over de foto: het is
   klein, het staat alleen onder de tekst, en de rest van het beeld houdt zijn
   eigen kleur. De vervaging doet het echte werk. Ze haalt het bloemenpatroon
   eronder weg, zodat de ondergrond een vlakke toon wordt in plaats van honderd
   losse blaadjes, en dan is minder dekking nodig voor meer contrast.
   Rechts staat de witte statuskaart, dus twee panelen die elkaar in evenwicht
   houden in plaats van een donkere vlek aan een kant. */
const PANEEL =
  'rounded-3xl bg-ink/55 px-6 py-7 backdrop-blur-2xl ring-1 ring-white/10 ' +
  'shadow-[0_30px_70px_-40px_rgb(0_0_0_/_0.8)] sm:px-8 sm:py-9';

/* De klant heeft twee foto's aangeleverd en wil ze allebei kunnen bekijken.
   De dahlia's staan er standaard op; met ?hero=tulpen erachter verschijnt de
   tulpenfoto op precies dezelfde pagina. Een gewone bezoeker merkt er niets
   van, en de link is te delen. Beide bestanden krijgen dezelfde bewerking,
   zie raw/hero-nieuw.mjs. */
const HEROS = {
  dahlias: {
    naam: 'hero-dahlias',
    alt: "Een dicht tapijt van dahlia's in roze, paars, oranje en wit",
  },
  tulpen: {
    naam: 'hero-tulpen',
    alt: 'Een dicht tapijt van tulpen in rood, geel, roze, wit en paars',
  },
} as const;

/* Uit de zoekopdracht in de adresbalk, en dus pas als de browser meedoet: de
   pagina wordt als kant-en-klare HTML gebakken en kent daar geen adresbalk. Zou
   dit tijdens het renderen gebeuren, dan valt de gebakken HTML niet meer samen
   met wat React in de browser maakt. */
function useHeroFoto() {
  const [foto, setFoto] = useState<(typeof HEROS)[keyof typeof HEROS]>(HEROS.dahlias);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('hero') === 'tulpen') setFoto(HEROS.tulpen);
  }, []);
  return foto;
}

function StatusKaart() {
  const status = useWinkelStatus();
  return (
    <div className="rounded-2xl border border-line bg-white p-5 text-ink shadow-[0_24px_60px_-30px_rgb(0_0_0_/_0.7)]">
      <div className="flex items-center gap-2.5">
        <span className={`relative flex h-2.5 w-2.5 ${status.open ? 'text-accent-dark' : TIJDELIJK_GESLOTEN ? 'text-roze' : 'text-ink/30'}`}>
          <span className={`absolute inline-flex h-full w-full rounded-full ${status.open ? 'animate-ping bg-accent-dark/60' : ''}`} />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-current" />
        </span>
        <p className="font-semibold">{status.kop}</p>
      </div>
      <p className="mt-1 text-sm text-ink/60">{status.onder}</p>

      <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
        <div className="flex gap-3">
          <dt className="shrink-0 text-ink/45"><Clock className="h-4 w-4" /></dt>
          <dd>
            {TIJDELIJK_GESLOTEN
              ? 'Geen openingstijden zolang de winkel dicht is'
              : 'Woensdag tot en met zaterdag, 8:00 tot 17:30'}
          </dd>
        </div>
        <div className="flex gap-3">
          <dt className="shrink-0 text-ink/45"><MapPin className="h-4 w-4" /></dt>
          <dd>{STRAAT}, {PLAATS}</dd>
        </div>
      </dl>

      {/* Deze kaart droeg zelf ook een roze knop, naast die in de tekst
          ernaast. Nu vertelt hij alleen of de deur openstaat; de knoppen staan
          op één plek, bij de tekst. */}
      <p className="mt-4 border-t border-line pt-4 text-sm text-ink/55">
        {TIJDELIJK_GESLOTEN ? 'Een vraag over iets dat al liep?' : 'Liever eerst even overleggen?'}{' '}
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
    <section id="top" className="relative isolate overflow-hidden bg-ink text-white">
      {/* Door de klant aangeleverd: een dicht tapijt van dahlia's, van bovenaf.
          Het beeld doet hier het werk en staat daarom onbedekt in beeld; de
          tekst brengt zijn eigen ondergrond mee (zie PANEEL).

          Het origineel is staand (1200x1600) en dat is te weinig voor een beeld
          over de volle breedte. De bron gaat daarom eerst 2x door de opschaler,
          zodat de brede band (1600 px, uit het midden) en de staande uitsnede
          allebei een verkleining zijn in plaats van een vergroting.
          Zie raw/hero-upscale.mjs en raw/hero-nieuw.mjs.
          Welke van de twee foto's hier staat, bepaalt HEROS/heroFoto. */}
      <picture className="absolute inset-0 -z-20 block">
        <source media="(min-width: 1024px)" srcSet={`/img/${foto.naam}-wide.webp`} />
        <img
          src={`/img/${foto.naam}.webp`}
          alt={foto.alt}
          fetchPriority="high"
          className="h-full w-full object-cover object-center"
        />
      </picture>
      {/* Hier lag een waas over de hele foto. Die is weg: hij maakte het beeld
          overal somber, terwijl alleen de plek onder de tekst rustig hoeft te
          zijn. De foto staat nu onbedekt in beeld. */}

      {/* De meldingsbalk maakt de vaste kop hoger, dus begint de hero lager. */}
      <div
        className={
          'mx-auto grid max-w-6xl items-center gap-10 px-5 pb-14 sm:px-8 sm:pb-20 ' +
          'lg:grid-cols-[1.05fr_0.85fr] lg:gap-14 lg:pb-24 ' +
          (TIJDELIJK_GESLOTEN ? 'pt-36 sm:pt-40 lg:pt-44' : 'pt-28 sm:pt-32 lg:pt-36')
        }
      >
        {/* Het randje staat op de kolom en niet per regel, want text-shadow
            erft: zo dragen de kicker, de kop, de alinea en de tekstlink hem
            alledrie zonder dat er ergens een klasse vergeten kan worden. Op de
            knoppen zet ik hem uit, die hebben een eigen vlak. */}
        <div className={`${PANEEL} ${TEKST_HALO}`}>
          <Kicker bloesem>Bloemenwinkel op de Molendijk, Oud-Beijerland</Kicker>

          {TIJDELIJK_GESLOTEN ? (
            <>
              {/* Het eerste wat iemand op deze pagina leest. Een balk bovenaan
                  is te missen als je meteen naar de foto kijkt; dit niet. */}
              <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-roze px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white [text-shadow:none]">
                <CircleAlert className="h-4 w-4" aria-hidden="true" /> {GESLOTEN.kop}
              </span>
              <h1 className="text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
                De winkel is<br />
                <span className="text-bloesem">tijdelijk gesloten</span>
              </h1>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-white">{GESLOTEN.lang}</p>

              {/* Geen roze knop: er is niets om op te drukken dat iets oplevert.
                  Wat er staat is waar het nieuws straks als eerste komt te
                  staan, en het nummer voor wie iets moet vragen. */}
              <div className="mt-7 flex flex-wrap items-center gap-3 [text-shadow:none]">
                <a
                  ref={knopRef}
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noreferrer"
                  className={`${KNOP_TWEEDE_DONKER} bg-white/10`}
                >
                  <Instagram className="h-4 w-4 text-bloesem" /> Volg ons op Instagram
                </a>
                <a href={`tel:${TEL}`} className={`${KNOP_TWEEDE_DONKER} bg-white/10`}>
                  <Phone className="h-4 w-4 text-bloesem" /> {TEL_DISPLAY}
                </a>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
                Verse bloemen,<br />
                <span className="text-bloesem">dagelijks nieuw</span>
              </h1>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-white">
                Loop binnen en stel zelf een boeket samen, of neem er een mee die al klaarstaat.
                Rouwboeketten, bruidsboeketten en boeketten op maat maken we op aanvraag.
              </p>

              {/* Eén hoofdknop. De winkel leeft van mensen die binnenlopen, dus dat
                  is de route. Bellen staat er als rand naast, en doorbladeren is
                  alleen een tekstlink: het is een sprong op dezelfde pagina, geen
                  stap die om aandacht hoort te vragen. */}
              <div className="mt-7 flex flex-wrap items-center gap-3 [text-shadow:none]">
                <a ref={knopRef} href={ROUTE} target="_blank" rel="noreferrer" className={KNOP_HOOFD}>
                  <Navigation className="h-4 w-4" /> Route naar de winkel
                </a>
                <a href={`tel:${TEL}`} className={`${KNOP_TWEEDE_DONKER} bg-white/10`}>
                  <Phone className="h-4 w-4 text-bloesem" /> {TEL_DISPLAY}
                </a>
              </div>
            </>
          )}

          <a href="#winkel" className={`${KNOP_DERDE} mt-5 text-sm text-white/90`}>
            Bekijk wat we doen <ArrowRight className="h-4 w-4" />
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
/*  Strip                                                              */
/* ------------------------------------------------------------------ */

/* De eerste twee regels gaan over openingstijden en aanvoer. Zolang de winkel
   dicht is kloppen ze geen van beide, dus staat daar wat er wel klopt. */
const STRIP = TIJDELIJK_GESLOTEN
  ? [
      {icon: CircleAlert, kop: GESLOTEN.kop, onder: 'De winkel is dicht'},
      {icon: MapPin, kop: STRAAT, onder: 'In het centrum van Oud-Beijerland'},
      {icon: Clock, kop: 'Geen aanvragen', onder: 'We nemen nu geen bestellingen aan'},
      {icon: Instagram, kop: 'Nieuws op Instagram', onder: 'Daar staat het als we opengaan'},
    ]
  : [
      {icon: Clock, kop: 'Woensdag t/m zaterdag', onder: '8:00 tot 17:30'},
      {icon: MapPin, kop: STRAAT, onder: 'In het centrum van Oud-Beijerland'},
      {icon: Sparkles, kop: 'Dagelijks nieuwe aanvoer', onder: 'Wat er staat, staat er vers'},
      {icon: Flower2, kop: 'Bloemen van dichtbij', onder: 'Bloemen uit de Hoeksche Waard'},
    ];

/* Licht in plaats van donker: de hero is al een donker vlak, en twee groene
   banden onder elkaar maken de bovenkant van de pagina zwaar. */
function Strip() {
  return (
    <Section tone="cream" slank className="border-b border-line">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {STRIP.map((s) => (
          <div key={s.kop} className="flex gap-3.5">
            <s.icon className="mt-0.5 h-5 w-5 shrink-0 text-roze" />
            <div>
              <p className="font-semibold leading-snug">{s.kop}</p>
              <p className="mt-0.5 text-sm text-ink/55">{s.onder}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  In de winkel                                                       */
/* ------------------------------------------------------------------ */

/**
 * Vijf onderdelen, vier daarvan met een eigen pagina erachter. De cadeaubon
 * heeft er geen: daar is niets over uit te leggen dat niet in deze twee regels
 * past, en een knop naar een pagina die alleen zichzelf herhaalt is een
 * teleurstelling.
 */
const WINKELKAARTEN = [
  {
    img: '/img/plukboeket.webp',
    icon: Flower2,
    titel: 'Boeketten',
    tekst: 'Neem een boeket mee dat al klaarstaat, of laat er een samenstellen naar eigen keuze.',
    href: '/boeketten/',
  },
  {
    /* Het aangeleverde abonnementsboeket, op room dichtgezet: deze tegel toont
       met object-cover en de emmers met pioenen staan verderop al bij het
       abonnementsblok. */
    img: '/img/abo-boeket-kaart.webp',
    icon: Repeat,
    titel: 'Abonnementen',
    tekst: 'Wekelijks, tweewekelijks of maandelijks een vers boeket, voor 15, 20 of 35 euro per boeket.',
    href: '/abonnement/',
  },
  {
    /* Op verzoek van de klant het conceptbeeld, zelfde beeld als de kop van de
       rouwpagina. Hun eigen studiofoto's staan lager op die pagina bij de
       voorbeelden; de 4:5 uitsnede ligt klaar als rouw-rond-wit-groen-kaart.webp. */
    img: '/img/rouwbloemwerk-kaart.webp',
    icon: Heart,
    titel: 'Rouwbloemen',
    tekst: 'Een boeket, een stuk voor op de kist, een hart of een krans. Met zorg gemaakt.',
    href: '/rouwbloemen/',
  },
  {
    img: '/img/bruidsboeket.webp',
    icon: Sparkles,
    titel: 'Trouwbloemen',
    tekst: 'Het bruidsboeket, de corsages en de bloemen op uw locatie.',
    href: '/trouwbloemen/',
  },
  {
    img: '/img/cadeaubon.webp',
    icon: Gift,
    titel: 'Cadeaubon',
    tekst: TIJDELIJK_GESLOTEN
      ? 'Laat de ontvanger zelf uitzoeken. De bon ligt klaar zodra de winkel weer open is.'
      : 'Laat de ontvanger zelf uitzoeken. De bon ligt in de winkel klaar.',
    href: null,
  },
];

function InDeWinkel() {
  return (
    <Section id="winkel" tone="wit">
      <div className="max-w-2xl">
        <Kicker>In de winkel</Kicker>
        {/* "Kom gerust even binnen" boven een dichte deur is een uitnodiging
            die niemand kan aannemen. Wat we maken blijft staan, in de tijd die
            erbij hoort. */}
        <h2 className="text-3xl font-semibold sm:text-4xl">
          {TIJDELIJK_GESLOTEN ? 'Dit maken we' : 'Kom gerust even binnen'}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-ink/70">
          {TIJDELIJK_GESLOTEN
            ? 'Normaal staat de winkel vol met verse bloemen die we dagelijks aanvullen, om mee te nemen of om samen te stellen naar eigen keuze. Zolang we gesloten zijn kan dat niet; dit is wat er weer staat zodra we opengaan.'
            : 'De winkel staat vol met verse bloemen die we dagelijks aanvullen. Neem een boeket mee dat al klaar staat of laat er een samenstellen naar eigen keuze. Uiteraard denken wij graag met u mee.'}
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {WINKELKAARTEN.map((k) => (
          <article key={k.titel} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-cream">
            <img src={k.img} alt={k.titel} loading="lazy" className="aspect-[4/5] w-full object-cover" />
            <div className="flex flex-1 flex-col p-5">
              <k.icon className="h-5 w-5 text-accent-dark" />
              <h3 className="mt-3 text-lg font-semibold">{k.titel}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{k.tekst}</p>
              {k.href && (
                <a
                  href={k.href}
                  className="mt-4 inline-flex items-center gap-1.5 self-start pt-1 text-sm font-semibold text-accent-dark underline decoration-accent-dark/25 underline-offset-4 transition hover:decoration-accent-dark"
                >
                  Meer informatie <ArrowRight className="h-4 w-4" />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Door het seizoen                                                   */
/* ------------------------------------------------------------------ */

const SEIZOEN = [
  {
    img: '/img/tulpen.webp',
    titel: 'Voorjaar',
    tekst: 'Tulpen, narcissen, ranonkels, hyacinten en takken prunus. De winkel kleurt bij als eerste.',
  },
  {
    img: '/img/pioenen.webp',
    titel: 'Pioenentijd',
    tekst: 'Van eind april tot in juni. Rechtstreeks van de kweker, zo staan ze snel na het snijden bij ons in de winkel.',
  },
  {
    img: '/img/zonnebloemen.webp',
    titel: 'Zomer',
    tekst: 'Zonnebloemen, hortensia in alle kleuren en zomerbloemen van eigen bodem.',
  },
];

/* Kleine vierkante uitsneden: deze staan als miniatuur op de pagina, dus de
   volle bestanden zouden puur laadtijd zijn die niemand ziet. */
const STROOK = [
  ['/img/narcissen-klein.webp', 'Narcissen'],
  ['/img/prunus-klein.webp', 'Prunus'],
  ['/img/ranonkels-roze-klein.webp', 'Ranonkels'],
  ['/img/hortensia-klein.webp', "Hortensia's"],
  ['/img/tulpen-2-klein.webp', 'Tulpen'],
  ['/img/pioenen-roze-klein.webp', 'Pioenen'],
  ['/img/bessen-klein.webp', 'Hypericum'],
  ['/img/zonnebloemen-2-klein.webp', 'Zonnebloemen'],
];

function Seizoen() {
  return (
    <Section id="seizoen">
      <div className="max-w-2xl">
        <Kicker>Door het jaar heen</Kicker>
        <h2 className="text-3xl font-semibold sm:text-4xl">Wat er staat, verandert mee</h2>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {SEIZOEN.map((s) => (
          <article key={s.titel} className="overflow-hidden rounded-2xl border border-line bg-white">
            <img src={s.img} alt={s.titel} loading="lazy" className="aspect-[4/5] w-full object-cover" />
            <div className="p-6">
              <h3 className="text-lg font-semibold">{s.titel}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{s.tekst}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-4 gap-3 sm:grid-cols-8">
        {STROOK.map(([src, naam]) => (
          <figure key={src} className="group">
            <img src={src} alt={naam} loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
            <figcaption className="mt-1.5 text-center text-[11px] font-medium text-ink/45">{naam}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Op aanvraag                                                        */
/* ------------------------------------------------------------------ */

/**
 * Deze drie komen ook al voor in het rijtje bij "In de winkel". Dat is bewust:
 * bloemwerk op bestelling is waar de winkel het van moet hebben, en het staat
 * hier uitgebreider dan in twee regels op een kaartje. De knoppen wijzen naar
 * dezelfde onderwerppagina's.
 */
const OP_AANVRAAG = [
  {
    img: '/img/rouw-liggend-wit-kaart.webp',
    icon: Heart,
    titel: 'Rouwbloemen',
    tekst:
      'Een rouwboeket, een stuk voor op de kist, een hart of een krans. In de kleuren die bij hem of haar pasten, en op tijd op de juiste plek.',
    href: '/rouwbloemen/',
  },
  {
    /* Kaart heet Bruidsboeketten, dus hier hoort een bruidsboeket. Niet
       hetzelfde beeld als bij "In de winkel" hierboven: dat is het staande
       bruidsboeket, dit is de liggende variant op de werkbank. */
    img: '/img/bruidsboeket-werkbank.webp',
    icon: Sparkles,
    titel: 'Bruidsboeketten',
    tekst:
      'We beginnen met een gesprek over de kleuren en de sfeer van uw dag, en komen daarna met een voorstel voor het boeket, de corsages en de bloemen op locatie.',
    href: '/trouwbloemen/',
  },
  {
    img: '/img/plukboeket.webp',
    icon: Flower2,
    titel: 'Boeketten op maat',
    tekst:
      'Een cadeau, een jubileum of gewoon omdat het kan. Vertel wat het ongeveer mag kosten en voor wie het is, dan maken wij er iets van.',
    href: '/boeketten/',
  },
];

function OpAanvraag() {
  return (
    <Section id="op-aanvraag" tone="wit">
      <div className="max-w-2xl">
        <Kicker>Op aanvraag</Kicker>
        <h2 className="text-3xl font-semibold sm:text-4xl">Bloemwerk op bestelling</h2>
        <p className="mt-4 text-lg leading-relaxed text-ink/70">
          {TIJDELIJK_GESLOTEN
            ? 'Naast wat er in de winkel staat maken we bloemwerk op bestelling. Dat ligt nu stil: zolang de winkel gesloten is nemen we geen aanvragen aan. Dit is wat we maken zodra we weer open zijn.'
            : 'Naast wat er in de winkel staat maken we bloemwerk op aanvraag. Bel ons, loop binnen of vul het formulier in, dan denken we met u mee.'}
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {OP_AANVRAAG.map((k) => (
          <article key={k.titel} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-cream">
            <img src={k.img} alt={k.titel} loading="lazy" className="aspect-[4/3] w-full object-cover" />
            <div className="flex flex-1 flex-col p-6">
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

      {/* Geen knop naar het formulier zolang er geen formulier is. Het nummer
          blijft staan voor wie iets moet vragen over wat al liep. */}
      <div className="mt-9 flex flex-wrap items-center gap-3">
        {!TIJDELIJK_GESLOTEN && (
          <a href="#vraag-aan" className={KNOP_HOOFD}>
            Aanvraag doen <ArrowRight className="h-4 w-4" />
          </a>
        )}
        <a href={`tel:${TEL}`} className={KNOP_TWEEDE_LICHT}>
          <Phone className="h-4 w-4 text-accent-dark" /> {TEL_DISPLAY}
        </a>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Abonnement                                                         */
/* ------------------------------------------------------------------ */

/* Geen bezorgbelofte: die is nog onbevestigd door de winkel. Wat hier staat is
   de vorm van het abonnement, niet de voorwaarden. */
const ABONNEMENT = [
  {
    icon: Repeat,
    kop: 'Wekelijks, tweewekelijks of maandelijks',
    tekst: 'U kiest het ritme. Een keer overslaan of stoppen kan altijd.',
  },
  {
    icon: Wallet,
    kop: '15, 20 of 35 euro per boeket',
    tekst: 'U spreekt af wat een boeket mag kosten, daar maken wij telkens het mooiste van dat erin past.',
  },
  {
    icon: Sparkles,
    kop: 'Rond of pluk',
    tekst: 'Geen twee keer hetzelfde boeket. U kunt kiezen tussen een klassiek rond boeket of een plukboeket.',
  },
  {
    icon: Briefcase,
    kop: 'Ook voor de zaak',
    tekst: 'Op de balie, in de wachtkamer of op kantoor. Een vaste dag, en het staat er weer vers.',
  },
];

/* Cream in plaats van wit: "Op aanvraag" er direct boven is wit, en twee witte
   vlakken achter elkaar laten de scheiding wegvallen. */
function Abonnement() {
  return (
    <Section id="abonnement">
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Hier stond een emmer pioenen in knop: bijna alleen groen, en het liet
            juist niet zien wat een abonnement oplevert. Dit blok belooft "wat op
            dat moment het mooist is", dus staat er nu een bak gemengde ranonkels
            in alle kleuren. Het aangeleverde abonnementsboeket kon hier niet:
            dat staat al op de tegel Abonnementen hoger op deze pagina. */}
        <img
          src="/img/abo-blok.webp"
          alt="Gemengde ranonkels in alle kleuren in de winkel aan de Molendijk"
          width={900}
          height={1125}
          loading="lazy"
          className="aspect-[4/5] w-full rounded-2xl object-cover"
        />

        <div>
          <Kicker>Abonnement</Kicker>
          <h2 className="text-3xl font-semibold sm:text-4xl">Steeds verse bloemen, zonder eraan te denken</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/70">
            Met een bloemenabonnement staat er wekelijks, tweewekelijks of maandelijks een vers boeket
            voor u klaar, tegen een vaste prijs per boeket: 15, 20 of 35 euro. Wij zorgen dat erin gaat
            wat op dat moment het mooist is.
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
            {!TIJDELIJK_GESLOTEN && (
              <a href="#vraag-aan" className={KNOP_HOOFD}>
                Abonnement aanvragen <ArrowRight className="h-4 w-4" />
              </a>
            )}
            <a href="/abonnement/" className={TIJDELIJK_GESLOTEN ? KNOP_HOOFD : KNOP_TWEEDE_LICHT}>
              Meer informatie <ArrowRight className={`h-4 w-4 ${TIJDELIJK_GESLOTEN ? '' : 'text-accent-dark'}`} />
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
    <Section id="over" tone="wit">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          {/* De echte maten staan erbij: zonder die twee getallen stond de tekst
              eronder tot het laden een stuk hoger op de pagina en sprong hij
              daarna weg. */}
          <img
            src="/img/winkel-molendijk.webp"
            alt="De winkel van Fleurig! aan de Molendijk, met de bloemen buiten op de stoep"
            loading="lazy"
            decoding="async"
            width={1200}
            height={963}
            className="h-auto w-full rounded-2xl object-cover"
          />
          <p className="mt-2.5 text-xs text-ink/45">Voor de winkel aan de Molendijk</p>
        </div>

        <div>
          <Kicker>Over ons</Kicker>
          <h2 className="text-3xl font-semibold sm:text-4xl">Wij zijn Fleurig!</h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink/70">
            <p>
              Op 11 februari 2026 openden wij Fleurig! in het oude, vertrouwde bloemenpand aan de Molendijk.
              {TIJDELIJK_GESLOTEN
                ? ' Sinds die dag stonden we hier vier dagen per week met een winkel vol verse bloemen. Op dit moment is de winkel tijdelijk gesloten.'
                : ' Sindsdien staan we hier vier dagen per week met een winkel vol verse bloemen.'}
            </p>
            <p>
              We halen zoveel mogelijk Hollandse en duurzaam gekweekte bloemen. Een deel komt rechtstreeks
              van kwekers hier in de Hoeksche Waard, zo staan ze binnen een dag na het snijden bij ons in
              de emmer.
            </p>
            <p>
              {TIJDELIJK_GESLOTEN
                ? 'Zodra we weer opengaan kunt u gerust binnenlopen om te kijken. Weet u niet wat u zoekt, dan denken we graag met u mee.'
                : 'Loop gerust binnen om te kijken. Weet u niet wat u zoekt, dan denken we graag met u mee.'}
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className={KNOP_TWEEDE_LICHT}>
              <Instagram className="h-4 w-4 text-accent-dark" /> Volg ons op Instagram
            </a>
            <a href={FACEBOOK} target="_blank" rel="noreferrer" className={KNOP_TWEEDE_LICHT}>
              <Camera className="h-4 w-4 text-accent-dark" /> Facebook
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
  TIJDELIJK_GESLOTEN
    ? [
        'Zijn jullie open?',
        'Nee, de winkel is tijdelijk gesloten. De deur is dicht en we nemen op dit moment geen aanvragen of bestellingen aan, ook niet voor rouw- en trouwbloemen. Zodra we weer opengaan staat het hier op de site en op Instagram en Facebook.',
      ]
    : [
        'Kan ik zomaar binnenlopen?',
        'Ja. Woensdag tot en met zaterdag van 8:00 tot 17:30 staat de winkel open, zonder afspraak. Voor bloemwerk op bestelling is even bellen of een aanvraag doen handiger.',
      ],
  [
    'Kan ik zelf een boeket laten samenstellen?',
    'Dat kan. U wijst aan welke bloemen u mooi vindt, wij snijden ze en binden er een boeket van. Wilt u liever iets meenemen dat al klaarstaat, dan kan dat ook.',
  ],
  TIJDELIJK_GESLOTEN
    ? [
        'Kan ik nog rouwbloemen bestellen?',
        'Op dit moment niet. Zolang de winkel gesloten is maken we geen rouwbloemen, ook niet met haast. Voor een dienst die binnenkort is kunt u het beste bij een andere bloemist in de buurt terecht.',
      ]
    : [
        'Hoe snel kunnen jullie een rouwboeket maken?',
        'Bel ons even, dan bespreken we wat er nog past voor de datum van de dienst. Vertel gerust in welke kleuren u denkt en of er een lint met tekst bij moet.',
      ],
  [
    'Maken jullie ook bruidsboeketten?',
    'Ja. We beginnen met een gesprek over de kleuren en de sfeer van uw dag, en komen daarna met een voorstel voor het boeket, de corsages en de bloemen op de locatie.',
  ],
  [
    'Hoe werkt een bloemenabonnement?',
    'U kiest of u wekelijks, tweewekelijks of maandelijks bloemen wilt, en spreekt zelf af wat een boeket mag kosten: 15, 20 of 35 euro. Geen twee keer hetzelfde boeket: u kunt kiezen tussen een klassiek rond boeket of een plukboeket. Overslaan of stoppen kan altijd, en ook voor de zaak kan het.',
  ],
  [
    'Hebben jullie een cadeaubon?',
    TIJDELIJK_GESLOTEN
      ? 'Die hebben we. Handig als u iets moois wilt geven maar de ontvanger liever zelf laat kiezen. Hij is te koop zodra de winkel weer open is.'
      : 'Die hebben we. Handig als u iets moois wilt geven maar de ontvanger liever zelf laat kiezen. De bon ligt in de winkel klaar.',
  ],
];

function Vragen() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="vragen" tone="wit">
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
      <main id="inhoud" className={TIJDELIJK_GESLOTEN ? '' : 'pb-20 md:pb-0'}>
        <Hero />
        <Strip />
        <InDeWinkel />
        <Seizoen />
        <OpAanvraag />
        <Abonnement />
        <VraagAan />
        <Over />
        <Bezoek bezorggebied />
        <Vragen />
      </main>
      <Footer />
      <MobielBalk />
    </>
  );
}
