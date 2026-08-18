import {useEffect, useState} from 'react';
import {PIJLERS, SOCIALS_ALGEMEEN, STICHTINGEN, TAKEN, ZEGEL_KLEUR} from './data';
import {Adinkra, Anker, Doek, Kente, Link, MERKTEKENS, Teller, Zegel, type Merk} from './ui';
import {href, TALEN, TaalProvider, useT, useTaal, type Taal} from './taal';
import {SITE_URL} from '../site.config.mjs';
import T from './tekst';
import {
  AgendaKaart,
  AgendaPagina,
  ContactFormulier,
  ContactPagina,
  Kop,
  SteunPagina,
  StichtingPagina,
  komende,
} from './Paginas';
import {GalerijPagina} from './Galerij';
import {ArrowRight, Facebook, Heart, Instagram, Linkedin, Menu, X} from 'lucide-react';

/* ------------------------------------------------------------- taalknopje */

function TaalKnop({krap = false}: {krap?: boolean}) {
  const {taal, zetTaal} = useTaal();
  const t = useT();
  /* Volgorde op verzoek van de klant: hun eigen taal eerst. Engels blijft wel de
     standaard, dus wie zonder taal in de link binnenkomt krijgt Engels. */
  const talen: {code: Taal; kort: string}[] = [
    {code: 'pap', kort: 'PAP'},
    {code: 'en', kort: 'EN'},
    {code: 'nl', kort: 'NL'},
  ];
  return (
    <div
      className="inline-flex shrink-0 items-center rounded-full border border-white/20 p-0.5"
      role="group"
      aria-label={t(T.taal.label)}>
      {talen.map((x) => {
        const aan = taal === x.code;
        return (
          <button
            key={x.code}
            type="button"
            onClick={() => zetTaal(x.code)}
            aria-pressed={aan}
            lang={x.code}
            title={t(T.taal[x.code])}
            className={`rounded-full font-semibold uppercase tracking-wider transition ${
              krap ? 'px-1.5 py-1 text-[0.6rem]' : 'px-2.5 py-1 text-[0.72rem]'
            } ${aan ? 'bg-goud text-nacht' : 'text-zand/60 hover:text-goud-licht'}`}>
            {x.kort}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ header */

function Header({pad}: {pad: string}) {
  const [open, setOpen] = useState(false);
  const t = useT();
  useEffect(() => setOpen(false), [pad]);

  /* Sta je op de pagina van een stichting, dan staat hun eigen zegel linksboven.
     Op de gedeelde pagina's staat er geen zegel maar alleen de naam: het merk van
     3 Diaspora is namelijk het zegel van de Bonairiaanse stichting, en dat zou op
     een gedeelde pagina lezen alsof Bonaire boven de andere twee staat. */
  const hier = STICHTINGEN.find((s) => pad === `/${s.id}`);

  const menu = [
    {naar: '/bonaire', label: T.menu.bonaire},
    {naar: '/curacao', label: T.menu.curacao},
    {naar: '/nederland', label: T.menu.nederland},
    {naar: '/agenda', label: T.menu.agenda},
    {naar: '/galerij', label: T.menu.galerij},
    {naar: '/contact', label: T.menu.contact},
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-nacht-diep/95 backdrop-blur">
      <div className="ruim flex h-[4.5rem] items-center justify-between gap-2 sm:gap-4">
        <Link naar="/" className="flex min-w-0 items-center gap-2 sm:gap-3" aria-label={t(T.merk.naarHome)}>
          {/* Op deze maat is de letterring om het zegel toch niet te lezen en wordt
              het een veeg, dus hier staat alleen de tekening zelf. */}
          {hier && (
            <Zegel key={hier.id} vorm={hier.logoKern} maat={36} kleur={ZEGEL_KLEUR} klasse="sm:!size-10" />
          )}
          <span className="min-w-0 leading-tight">
            {/* op een heel smal scherm past de naam niet naast de knoppen; dan
                staat het zegel er alleen, in plaats van een afgekapt woord. Staat
                er geen zegel, dan moet de naam er hoe dan ook staan. */}
            <span
              className={`truncate font-display font-semibold text-zand text-[0.85rem] min-[360px]:text-[0.98rem] sm:text-[1.2rem] ${
                hier ? 'hidden min-[360px]:block' : 'block'
              }`}>
              3 Diaspora
            </span>
            {/* op een telefoon past deze regel niet naast de knoppen, daar valt hij weg */}
            <span className="hidden text-[0.66rem] uppercase tracking-[0.18em] text-goud-licht sm:block">
              {t(T.merk.onder)}
            </span>
          </span>
        </Link>

        {/* Met zes menu-items erin past de balk pas vanaf xl uitgeklapt: op
            1024 breed liep hij in het Engels vast op The Netherlands. */}
        <nav className="hidden items-center gap-1 xl:flex" aria-label={t(T.menu.label)}>
          {menu.map((m) => (
            <Link
              key={m.naar}
              naar={m.naar}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                pad === m.naar ? 'bg-white/10 text-zand' : 'text-zand/70 hover:text-goud-licht'
              }`}>
              {t(m.label)}
            </Link>
          ))}
          <span className="ml-2">
            <TaalKnop />
          </span>
          <Link
            naar="/steun"
            className="ml-2 inline-flex items-center gap-2 rounded-full bg-goud px-5 py-2.5 text-sm font-semibold text-nacht transition hover:bg-goud-licht">
            <Heart size={15} aria-hidden /> {t(T.menu.doneer)}
          </Link>
        </nav>

        {/* Onder 360 breed moet de naam er ook staan, want daar hangt geen zegel
            meer naast. Die paar pixels komen hier vandaan. */}
        <div className="flex shrink-0 items-center gap-1 min-[360px]:gap-1.5 sm:gap-2 xl:hidden">
          <TaalKnop krap />
          <Link
            naar="/steun"
            className="rounded-full bg-goud px-2.5 py-2 text-[0.8rem] font-semibold text-nacht min-[360px]:px-3 sm:px-4 sm:text-sm">
            {t(T.menu.doneer)}
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? t(T.menu.sluiten) : t(T.menu.openen)}
            className="rounded-full border border-white/20 p-1.5 text-zand min-[360px]:p-2 sm:p-2.5">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-nacht-diep xl:hidden" aria-label={t(T.menu.label)}>
          <div className="ruim flex flex-col py-3">
            {menu.map((m) => (
              <Link key={m.naar} naar={m.naar} className="border-b border-white/8 py-3 text-zand/85 last:border-0">
                {t(m.label)}
              </Link>
            ))}
          </div>
        </nav>
      )}
      <Kente hoogte={4} />
    </header>
  );
}

/* ------------------------------------------------------------------ footer */

const SOCIAL_ICOON = {facebook: Facebook, instagram: Instagram, linkedin: Linkedin};

function Footer() {
  const t = useT();
  return (
    <footer className="relative overflow-hidden bg-nacht-diep pt-16 pb-10 text-zand/70">
      <Doek dekking={0.09} />
      <div className="wrap relative">
        {/* De drie zegels naast elkaar, want dat is precies wat 3 Diaspora is.
            Hier mogen ze groot: de letterring is op deze hoogte gewoon te lezen,
            anders dan bij de kleine tekens.

            Ze staan als masker en niet als plaatje, want hun eigen bestanden
            verschillen onderling van goud: Bonaire en Curacao zijn #bc9a39 en
            Nederland #bda050. Naast elkaar zie je dat. Zo dragen ze alle drie
            exact dezelfde kleur, die van het Nederlandse bestand. */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-8 border-b border-white/10 pb-10 sm:justify-start sm:gap-x-16">
          {STICHTINGEN.map((s) => (
            <Link key={s.id} naar={`/${s.id}`} className="group block" aria-label={s.naam}>
              <span
                role="img"
                aria-label={s.naam}
                className={`block opacity-85 transition duration-500 group-hover:scale-[1.04] group-hover:opacity-100 ${
                  /* Het Nederlandse zegel draagt 'Foundation' onder de ring in
                     plaats van erin, dus op gelijke hoogte wordt zijn ring
                     kleiner dan die van de andere twee. Iets hoger zetten en de
                     drie ringen zijn even groot. */
                  s.id === 'nederland' ? 'h-[5.3rem] sm:h-[7rem]' : 'h-[4.5rem] sm:h-24'
                }`}
                style={{
                  aspectRatio: s.id === 'nederland' ? '560 / 611' : '560 / 548',
                  background: ZEGEL_KLEUR,
                  maskImage: `url(${s.logoVorm})`,
                  WebkitMaskImage: `url(${s.logoVorm})`,
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                }}
              />
            </Link>
          ))}
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            {/* Geen zegel boven deze kolom: het merk van 3 Diaspora is het zegel
                van Bonaire, en de drie stichtingen staan hierboven al gelijk. */}
            <p className="font-display text-xl text-zand">3 Diaspora</p>
            <p className="mt-2 text-[0.92rem] leading-relaxed">{t(T.footer.over)}</p>
            <div className="mt-5">
              <TaalKnop />
            </div>
          </div>

          <div>
            <h3 className="font-display text-[1.1rem] text-zand">{t(T.footer.stichtingen)}</h3>
            <ul className="mt-3 space-y-2 text-[0.92rem]">
              {STICHTINGEN.map((s) => (
                <li key={s.id}>
                  <Link naar={`/${s.id}`} className="inline-flex items-center gap-2 transition hover:text-goud-licht">
                    <Zegel vorm={s.logoKern} maat={18} kleur={ZEGEL_KLEUR} />
                    {t(s.kort)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-[1.1rem] text-zand">{t(T.footer.opDezeSite)}</h3>
            <ul className="mt-3 space-y-2 text-[0.92rem]">
              <li>
                <Link naar="/agenda" className="transition hover:text-goud-licht">
                  {t(T.menu.agenda)}
                </Link>
              </li>
              <li>
                <Link naar="/galerij" className="transition hover:text-goud-licht">
                  {t(T.menu.galerij)}
                </Link>
              </li>
              <li>
                <Link naar="/steun" className="transition hover:text-goud-licht">
                  {t(T.footer.steunOns)}
                </Link>
              </li>
              <li>
                <Link naar="/contact" className="transition hover:text-goud-licht">
                  {t(T.menu.contact)}
                </Link>
              </li>
              <li>
                <Link naar="/nederland#anbi" className="transition hover:text-goud-licht">
                  {t(T.footer.anbiLink)}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-[1.1rem] text-zand">{t(T.footer.volg)}</h3>
            <div className="mt-3 flex gap-2">
              {SOCIALS_ALGEMEEN.map((s) => {
                const Icoon = SOCIAL_ICOON[s.soort];
                return (
                  <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={s.label}
                    className="rounded-full border border-white/20 p-2.5 transition hover:border-goud hover:text-goud-licht">
                    <Icoon size={17} aria-hidden />
                  </a>
                );
              })}
            </div>
            <p className="mt-4 text-[0.85rem] leading-relaxed">
              {t(T.footer.bereikbaar)}{' '}
              <a href="mailto:bdoaf.bon@gmail.com" className="underline decoration-goud underline-offset-4">
                bdoaf.bon@gmail.com
              </a>
              .
            </p>
          </div>
        </div>

        <p className="mt-12 border-t border-white/10 pt-6 text-[0.82rem]">{t(T.footer.concept)}</p>
      </div>
    </footer>
  );
}

/* --------------------------------------------------------------- bouwstenen */

/** Bijschrift bovenaan een sectie, met het bijbehorende adinkra-teken ervoor. */
function Merkkop({merk, kicker, kleur}: {merk: Merk; kicker: string; kleur: string}) {
  return (
    <p className="kicker inline-flex items-center gap-3" style={{color: kleur}}>
      <Adinkra merk={merk} maat={22} dikte={8} titel={MERKTEKENS[merk].naam} />
      {kicker}
    </p>
  );
}

/* --------------------------------------------------------------------- hero */

function Hero() {
  const t = useT();
  return (
    <section className="relative isolate overflow-hidden bg-nacht">
      <img
        src="/img/huisjes-zoutpan.webp"
        alt={t(T.hero.beeldAlt)}
        width={1600}
        height={893}
        fetchPriority="high"
        className="absolute inset-0 -z-10 size-full object-cover object-[62%_center]"
      />
      {/* Twee lagen: een donkere voet zodat de tekst leesbaar is, en een warme
          gloed van links zodat het beeld niet dood grijs wordt. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-nacht-diep via-nacht-diep/75 to-nacht-diep/10"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-nacht-diep/90 via-nacht-diep/30 to-transparent"
      />

      {/* Kolomflex met justify-end: de tekst zakt naar de onderkant van het beeld,
          en de container blijft wel de volle breedte houden. */}
      <div className="ruim relative flex min-h-[88vh] flex-col justify-end pb-20 pt-40 sm:pb-28">
        <div className="max-w-3xl">
          <Merkkop merk="sankofa" kicker={t(T.hero.kicker)} kleur="#e0c069" />
          <h1 className="mt-5 text-[2.6rem] leading-[0.98] text-zand sm:text-[4.6rem] lg:text-[5.4rem]">
            {t(T.hero.titel)}
            <span className="block text-goud-licht italic">{t(T.hero.titelCursief)}</span>
          </h1>
          <p className="mt-7 max-w-xl lees text-zand/80">{t(T.hero.lead)}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              naar="/steun"
              className="inline-flex items-center gap-2 rounded-full bg-goud px-7 py-4 font-semibold text-nacht transition hover:bg-goud-licht">
              <Heart size={17} aria-hidden /> {t(T.hero.steun)}
            </Link>
            <Anker
              naar="stichtingen"
              className="inline-flex items-center gap-2 rounded-full border border-zand/35 px-7 py-4 font-semibold text-zand transition hover:border-goud hover:text-goud-licht">
              {t(T.hero.kennis)} <ArrowRight size={16} aria-hidden />
            </Anker>
          </div>
        </div>

        <div className="mt-12 flex justify-start lg:justify-end">
          <p className="max-w-sm border-l-2 border-goud/60 pl-4 text-[0.84rem] leading-relaxed text-zand/55">
            {t(T.hero.bijschrift)}
          </p>
        </div>
      </div>

      <Kente hoogte={10} klasse="absolute inset-x-0 bottom-0" />
    </section>
  );
}

/* -------------------------------------------------------- de drie stichtingen */

function DrieStichtingen() {
  const t = useT();
  /* De drie kolommen staan bewust niet op één lijn. Gelijke kaarten naast elkaar
     is precies de rasterindeling die deze site niet moet hebben. */
  const verschuiving = ['lg:mt-0', 'lg:mt-14', 'lg:mt-28'];

  return (
    <section id="stichtingen" className="wrap py-20 sm:py-28">
      <div className="max-w-3xl">
        <Merkkop merk="nkonsonkonson" kicker={t(T.drie.kicker)} kleur="#7f631a" />
        <h2 className="mt-5 text-[2.2rem] leading-[1.06] sm:text-[3.4rem]">
          {t(T.drie.titel)}
          <span className="italic text-goud-diep"> {t(T.drie.titelCursief)}</span>
        </h2>
        <p className="mt-5 lees text-grijs">{t(T.drie.lead)}</p>
      </div>

      <div className="mt-16 grid gap-12 sm:gap-10 lg:grid-cols-3">
        {STICHTINGEN.map((s, i) => (
          <Link
            key={s.id}
            naar={`/${s.id}`}
            className={`group relative block ${verschuiving[i]}`}
            aria-label={`${t(T.drie.bekijkPagina)} ${t(s.kort)}`}>
            <figure className="relative">
              <div className="boog overflow-hidden">
                <img
                  src={s.beeld}
                  alt={t(s.beeldBij)}
                  width={900}
                  height={1125}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />
              </div>
              {/* Hun eigen zegel hangt over de onderrand van de boog heen, en
                  het schijfje eronder heeft dezelfde kleur als elk ander zegel:
                  drie verschillende kleuren naast elkaar leest als drie logo's. */}
              <span
                className="absolute -bottom-7 left-8 grid size-14 place-items-center rounded-full text-zand shadow-lg transition group-hover:-translate-y-1"
                style={{background: ZEGEL_KLEUR}}>
                <Zegel vorm={s.logoKern} maat={34} />
              </span>
            </figure>

            <div className="mt-12">
              <p className="kicker" style={{color: s.accent}}>
                {t(s.kort)}
              </p>
              <h3 className="mt-2 text-[1.45rem] leading-snug">{s.naam}</h3>
              <p className="mt-3 text-[0.97rem] leading-relaxed text-grijs">{t(s.intro)}</p>
              <p className="mt-4 text-[0.85rem] italic text-grijs/80">
                {MERKTEKENS[s.merk].naam}: {t(MERKTEKENS[s.merk].betekenis)}.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold" style={{color: s.accent}}>
                {t(T.drie.bekijk)}
                <ArrowRight size={15} aria-hidden className="transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- wat we doen */

function WatWeDoen() {
  const t = useT();
  return (
    <section className="relative overflow-hidden bg-nacht py-20 text-zand sm:py-28">
      <Doek dekking={0.1} />
      <div className="wrap relative">
        <div className="max-w-3xl">
          <Merkkop merk="nkyinkyim" kicker={t(T.doen.kicker)} kleur="#e0c069" />
          <h2 className="mt-5 text-[2.2rem] leading-[1.06] text-zand sm:text-[3.4rem]">
            {t(T.doen.titel)}
            <span className="italic text-goud-licht"> {t(T.doen.titelCursief)}</span>
          </h2>
          <p className="mt-5 lees text-zand/70">{t(T.doen.lead)}</p>
        </div>

        <div className="mt-16 space-y-14 sm:space-y-16">
          {PIJLERS.map((p, i) => {
            const rechts = i % 2 === 1;
            const staand = i % 2 === 0;
            return (
              <article key={p.beeld} className="grid items-center gap-8 sm:gap-14 lg:grid-cols-[0.62fr_1.38fr]">
                <figure className={rechts ? 'lg:order-2' : ''}>
                  <img
                    src={p.beeld}
                    alt={t(p.alt)}
                    width={1100}
                    height={staand ? 1375 : 825}
                    loading="lazy"
                    className={`w-full rounded-2xl object-cover ${
                      staand ? 'aspect-[4/5]' : 'aspect-[4/3]'
                    } ${rechts ? 'kiep-r' : 'kiep-l'}`}
                  />
                </figure>
                <div className={rechts ? 'lg:order-1' : ''}>
                  <p className="font-display text-[3rem] leading-none text-goud/40">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-1 text-[1.9rem] leading-tight text-zand sm:text-[2.6rem]">{t(p.kop)}</h3>
                  <p className="mt-4 max-w-2xl lees text-zand/70">{t(p.tekst)}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- missie en visie */

function MissieVisie() {
  const t = useT();
  return (
    <section className="relative overflow-hidden bg-indigo-diep py-20 text-zand sm:py-28">
      <Doek kleur="#6f9fc6" dekking={0.12} />
      <div className="wrap relative">
        <Merkkop merk="adinkrahene" kicker={t(T.missie.kicker)} kleur="#6f9fc6" />
        <p className="mt-5 max-w-2xl lees text-zand/65">{t(T.missie.lead)}</p>

        <div className="mt-14 space-y-16">
          <blockquote className="max-w-4xl">
            <p className="font-display text-[1.7rem] leading-[1.25] text-zand sm:text-[2.6rem]">{t(T.missie.missie)}</p>
            <footer className="kicker mt-5 text-indigo-licht">{t(T.missie.missieLabel)}</footer>
          </blockquote>

          <blockquote className="ml-auto max-w-4xl lg:text-right">
            <p className="font-display text-[1.7rem] leading-[1.25] italic text-zand sm:text-[2.6rem]">
              {t(T.missie.visie)}
            </p>
            <footer className="kicker mt-5 text-indigo-licht">{t(T.missie.visieLabel)}</footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- twaalf taken */

function TwaalfTaken() {
  const t = useT();
  return (
    <section className="bg-zand-warm py-20 sm:py-28">
      <div className="wrap">
        <div className="max-w-2xl">
          <p className="kicker text-klei">{t(T.taken.kicker)}</p>
          <h2 className="mt-4 text-[2rem] leading-[1.08] sm:text-[3rem]">{t(T.taken.titel)}</h2>
          <p className="mt-4 lees text-inkt/70">{t(T.taken.lead)}</p>
        </div>

        <ol className="mt-12 grid gap-x-14 gap-y-8 sm:grid-cols-2">
          {TAKEN.map((taak, i) => (
            <li key={i} className="flex gap-5 border-t border-inkt/12 pt-5">
              <span className="font-display text-[2rem] leading-none text-klei/55">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-[1rem] leading-[1.7] text-inkt/85">{t(taak)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- geschiedenis */

function Geschiedenis() {
  const t = useT();
  return (
    <section className="relative overflow-hidden bg-nacht text-zand">
      <Doek dekking={0.07} />
      <div className="relative grid lg:grid-cols-2">
        <figure className="relative min-h-[24rem] lg:min-h-[38rem]">
          <img
            src="/img/zoutpannen.webp"
            alt={t(T.geschiedenis.beeldAlt)}
            width={1080}
            height={792}
            loading="lazy"
            className="size-full object-cover"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-nacht-diep to-transparent px-6 pb-5 pt-16 text-[0.8rem] text-zand/70">
            {t(T.geschiedenis.bijschrift)}
          </figcaption>
        </figure>

        <div className="flex items-center px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
          <div className="max-w-xl">
            <Merkkop merk="sankofa" kicker={t(T.geschiedenis.kicker)} kleur="#e0c069" />
            <h2 className="mt-5 text-[2rem] leading-[1.08] text-zand sm:text-[2.9rem]">
              {t(T.geschiedenis.titel)}
              <span className="italic text-goud-licht"> {t(T.geschiedenis.titelCursief)}</span>
            </h2>
            <p className="kapitaal mt-6 lees text-zand/75">{t(T.geschiedenis.een)}</p>
            <p className="mt-4 lees text-zand/75">{t(T.geschiedenis.twee)}</p>
            <p className="mt-5 text-[0.85rem] text-zand/45">{t(T.geschiedenis.bron)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ cijfers */

function Cijfers() {
  const t = useT();
  const cijfers = [
    {getal: 3, label: T.cijfers.stichtingen},
    {getal: 12, label: T.cijfers.taken},
    {getal: 1863, label: T.cijfers.jaar},
  ];
  return (
    <section className="bg-zand-diep">
      <Kente hoogte={8} />
      <div className="wrap grid gap-10 py-14 text-center sm:grid-cols-3">
        {cijfers.map((c) => (
          <div key={c.getal}>
            <p className="font-display text-[3.2rem] leading-none text-goud-diep">
              <Teller naar={c.getal} />
            </p>
            <p className="mt-2 text-[0.95rem] text-grijs">{t(c.label)}</p>
          </div>
        ))}
      </div>
      <Kente hoogte={8} />
    </section>
  );
}

/* ------------------------------------------------------------------- agenda */

function AgendaTeaser() {
  const t = useT();
  const eerstvolgend = komende(3);
  return (
    <section className="wrap py-20 sm:py-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="kicker text-zee">{t(T.agenda.kicker)}</p>
          <h2 className="mt-4 text-[2rem] leading-[1.08] sm:text-[3rem]">{t(T.agenda.titel)}</h2>
          <p className="mt-4 lees text-grijs">{t(T.agenda.lead)}</p>
        </div>
        <Link
          naar="/agenda"
          className="inline-flex items-center gap-2 rounded-full border border-inkt/20 px-6 py-3 text-sm font-semibold transition hover:border-goud hover:text-goud-diep">
          {t(T.agenda.hele)} <ArrowRight size={15} aria-hidden />
        </Link>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {eerstvolgend.map((a) => (
          <AgendaKaart key={a.datum + a.titel.nl} a={a} />
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- steun ons */

function SteunBlok() {
  const t = useT();
  return (
    <section className="relative overflow-hidden bg-palm py-20 text-zand sm:py-28">
      <Doek kleur="#e0c069" dekking={0.11} />
      <div className="wrap relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Merkkop merk="akoma" kicker={t(T.steun.kicker)} kleur="#e0c069" />
          <h2 className="mt-5 text-[2.2rem] leading-[1.06] text-zand sm:text-[3.2rem]">
            {t(T.steun.titel)}
            <span className="italic text-goud-licht"> {t(T.steun.titelCursief)}</span>
          </h2>
          <p className="mt-6 max-w-xl lees text-zand/75">{t(T.steun.lead)}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              naar="/steun"
              className="inline-flex items-center gap-2 rounded-full bg-goud px-7 py-4 font-semibold text-nacht transition hover:bg-goud-licht">
              <Heart size={17} aria-hidden /> {t(T.steun.doneren)}
            </Link>
            <Link
              naar="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-zand/35 px-7 py-4 font-semibold text-zand transition hover:border-goud hover:text-goud-licht">
              {t(T.steun.sponsor)}
            </Link>
          </div>
        </div>

        <figure className="relative mx-auto w-full max-w-md">
          <div className="boog overflow-hidden">
            <img
              src="/img/generaties.webp"
              alt={t(T.steun.beeldAlt)}
              width={1100}
              height={1366}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <figcaption className="mt-4 text-[0.8rem] leading-relaxed text-zand/50">{t(T.steun.bijschrift)}</figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ over de tekens */

function OverDeTekens() {
  const t = useT();
  const gebruikt: Merk[] = ['adinkrahene', 'sankofa', 'nkonsonkonson', 'eban', 'akoma', 'nkyinkyim'];
  return (
    <section className="border-t border-lijn bg-zand-diep py-16">
      <div className="wrap">
        <div className="max-w-2xl">
          <p className="kicker text-goud-diep">{t(T.tekens.kicker)}</p>
          <h2 className="mt-4 text-[1.6rem] leading-snug sm:text-[2.1rem]">{t(T.tekens.titel)}</h2>
          <p className="mt-4 lees text-grijs">{t(T.tekens.lead)}</p>
        </div>
        <ul className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {gebruikt.map((m) => (
            <li key={m} className="flex items-start gap-4 border-t border-lijn pt-4">
              <Adinkra merk={m} maat={30} dikte={8} klasse="mt-0.5 shrink-0 text-goud-diep" />
              <p className="text-[0.95rem] leading-relaxed">
                <span className="font-semibold">{MERKTEKENS[m].naam}</span>
                <span className="block text-grijs">{t(MERKTEKENS[m].betekenis)}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- contact */

function ContactBlok() {
  const t = useT();
  return (
    <section className="wrap py-20 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Kop kicker={t(T.contact.kicker)} titel={t(T.contact.titel)} tekst={t(T.contact.lead)} />
          <div className="mt-8 space-y-3">
            {STICHTINGEN.map((s) => (
              <div
                key={s.id}
                className="flex flex-wrap items-center gap-3 border-l-2 bg-white/50 px-4 py-3"
                style={{borderColor: s.accent}}>
                <Zegel vorm={s.logoKern} maat={22} kleur={ZEGEL_KLEUR} />
                <span className="text-[0.95rem]">{t(s.kort)}</span>
                <span className="ml-auto text-[0.88rem] text-grijs">{s.email ?? t(T.contact.mailVolgt)}</span>
              </div>
            ))}
          </div>
          {/* Sinds 18-08-2026 hebben alle drie de stichtingen een eigen adres.
              Deze regel hoort dus alleen te verschijnen zolang er nog een
              ontbreekt, niet als vaste zin. */}
          {STICHTINGEN.some((s) => !s.email) && (
            <p className="mt-6 text-[0.9rem] leading-relaxed text-grijs">{t(T.contact.nogGeenMail)}</p>
          )}
        </div>
        <ContactFormulier />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- home */

function Home() {
  return (
    <>
      <Hero />
      <DrieStichtingen />
      <WatWeDoen />
      <TwaalfTaken />
      <MissieVisie />
      <Geschiedenis />
      <Cijfers />
      <AgendaTeaser />
      <SteunBlok />
      <OverDeTekens />
      <ContactBlok />
    </>
  );
}

/* -------------------------------------------------------------------- app */

function Site() {
  const {pad, taal} = useTaal();
  const t = useT();
  const stichting = STICHTINGEN.find((s) => pad === `/${s.id}`);

  useEffect(() => {
    const titels: Record<string, string> = {
      '/agenda': t(T.agenda.kicker),
      '/galerij': t(T.galerij.kicker),
      '/steun': t(T.footer.steunOns),
      '/contact': t(T.menu.contact),
    };
    const deel = stichting ? t(stichting.kort) : titels[pad];
    document.title = deel ? `${deel} · 3 Diaspora` : t(T.titels.home);

    const omschrijving = document.querySelector('meta[name="description"]');
    if (omschrijving) omschrijving.setAttribute('content', t(T.titels.omschrijving));
    const og: Record<Taal, string> = {en: 'en_GB', nl: 'nl_NL', pap: 'pap_CW'};
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', og[taal]);

    /* Elke pagina bestaat in drie talen op drie eigen adressen. Staan die
       adressen alleen in index.html, dan noemt elke pagina zichzelf de
       startpagina en gooit een zoekmachine de andere drieëntwintig weg als
       kopie. Ze verhuizen dus mee met de route. */
    const zet = (kies: string, waarde: string) =>
      document.querySelector(kies)?.setAttribute('href', waarde);
    zet('link[rel="canonical"]', `${SITE_URL}${href(taal, pad)}`);
    zet('link[rel="alternate"][hreflang="x-default"]', `${SITE_URL}${href('en', pad)}`);
    for (const x of TALEN) zet(`link[rel="alternate"][hreflang="${x}"]`, `${SITE_URL}${href(x, pad)}`);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', `${SITE_URL}${href(taal, pad)}`);
  }, [pad, stichting, taal, t]);

  return (
    <>
      <Anker
        naar="inhoud"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-goud focus:px-5 focus:py-3 focus:font-semibold focus:text-nacht">
        {t(T.naarInhoud)}
      </Anker>
      <Header pad={pad} />
      <main id="inhoud">
        {stichting ? (
          <StichtingPagina s={stichting} />
        ) : pad === '/agenda' ? (
          <AgendaPagina />
        ) : pad === '/galerij' ? (
          <GalerijPagina />
        ) : pad === '/steun' ? (
          <SteunPagina />
        ) : pad === '/contact' ? (
          <ContactPagina />
        ) : (
          <Home />
        )}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <TaalProvider>
      <Site />
    </TaalProvider>
  );
}
