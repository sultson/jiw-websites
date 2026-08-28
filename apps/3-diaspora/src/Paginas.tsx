import {useMemo, useState} from 'react';
import {
  AGENDA,
  ANBI_VELDEN,
  BESTUUR_BONAIRE,
  OPRICHTING_NL,
  SOORT_KLEUR,
  SOORT_LABEL,
  STICHTINGEN,
  ZEGEL_KLEUR,
  type Activiteit,
  type Stichting,
} from './data';
import {Adinkra, Doek, Kente, Link, MERKTEKENS, Zegel, type Merk} from './ui';
import {LOCALE, useT, useTaal, type Taal, type Tekst} from './taal';
import T from './tekst';
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  FileText,
  Heart,
  Mail,
  MapPin,
  Paperclip,
  ShieldCheck,
  Users,
} from 'lucide-react';

/* ------------------------------------------------------------------ helpers */

/**
 * Papiamentu zit niet in de datumtabellen van de browser, dus die maanden staan
 * hier zelf. In het Nederlands en het Engels doet de browser het werk.
 */
const MAANDEN_PAP = [
  'yanüari',
  'febrüari',
  'mart',
  'aprel',
  'mei',
  'yüni',
  'yüli',
  'ougùstùs',
  'sèptèmber',
  'oktober',
  'novèmber',
  'desèmber',
];

function opmaak(taal: Taal) {
  if (taal === 'pap') {
    const maand = (d: Date) => MAANDEN_PAP[d.getMonth()];
    return {
      lang: {format: (d: Date) => `${d.getDate()} di ${maand(d)} ${d.getFullYear()}`},
      kort: {format: (d: Date) => `${d.getDate()} ${maand(d).slice(0, 3)}`},
      dag: {format: (d: Date) => String(d.getDate())},
      maand: {format: (d: Date) => maand(d).slice(0, 3)},
    };
  }
  return {
    lang: new Intl.DateTimeFormat(LOCALE[taal], {day: 'numeric', month: 'long', year: 'numeric'}),
    kort: new Intl.DateTimeFormat(LOCALE[taal], {day: 'numeric', month: 'short'}),
    dag: new Intl.DateTimeFormat(LOCALE[taal], {day: 'numeric'}),
    maand: new Intl.DateTimeFormat(LOCALE[taal], {month: 'short'}),
  };
}

/** Een losse iso-datum voluit, in de taal van de bezoeker. */
export function losseDatum(iso: string, taal: Taal) {
  return opmaak(taal).lang.format(new Date(iso + 'T12:00:00'));
}

export function datumTekst(a: Activiteit, taal: Taal) {
  const f = opmaak(taal);
  const van = new Date(a.datum + 'T12:00:00');
  if (!a.eind) return f.lang.format(van);
  const tot = new Date(a.eind + 'T12:00:00');
  return `${f.kort.format(van)} ${T.agenda.totEnMet[taal]} ${f.lang.format(tot)}`;
}

/** Activiteiten die nog moeten komen, op datum. */
export function komende(max?: number) {
  const nu = new Date();
  nu.setHours(0, 0, 0, 0);
  const lijst = AGENDA.filter((a) => new Date((a.eind ?? a.datum) + 'T23:59:59') >= nu).sort((a, b) =>
    a.datum.localeCompare(b.datum),
  );
  return max ? lijst.slice(0, max) : lijst;
}

export function Kop({
  kicker,
  titel,
  cursief,
  tekst,
  licht = false,
  kleur,
}: {kicker: string; titel: string; cursief?: string; tekst?: string; licht?: boolean; kleur?: string}) {
  return (
    <div className="max-w-2xl">
      <p className="kicker" style={{color: kleur ?? (licht ? '#e0c069' : '#7f631a')}}>
        {kicker}
      </p>
      <h2 className={`mt-4 text-[2rem] leading-[1.08] sm:text-[3rem] ${licht ? 'text-zand' : 'text-inkt'}`}>
        {titel}
        {cursief && (
          <span className="italic" style={{color: kleur ?? (licht ? '#e0c069' : '#7f631a')}}>
            {' '}
            {cursief}
          </span>
        )}
      </h2>
      {tekst && <p className={`mt-5 lees ${licht ? 'text-zand/70' : 'text-grijs'}`}>{tekst}</p>}
    </div>
  );
}

/* --------------------------------------------------------------- agendakaart */

export function AgendaKaart({a}: {a: Activiteit}) {
  const {taal} = useTaal();
  const t = useT();
  const f = opmaak(taal);
  const van = new Date(a.datum + 'T12:00:00');
  const soortKleur = SOORT_KLEUR[a.soort];

  return (
    <article className="flex h-full flex-col bg-white/60">
      <div className="flex items-stretch">
        {/* Het datumblok is de eyecatcher, niet een grijs regeltje bovenaan. */}
        <div className="grid w-20 shrink-0 place-items-center py-4 text-zand" style={{background: soortKleur}}>
          <div className="text-center leading-none">
            <span className="block font-display text-[1.9rem]">{f.dag.format(van)}</span>
            <span className="mt-1 block text-[0.72rem] uppercase tracking-wider opacity-80">
              {f.maand.format(van).replace('.', '')}
            </span>
          </div>
        </div>
        <div className="flex-1 px-5 py-4">
          <span className="kicker" style={{color: soortKleur}}>
            {t(SOORT_LABEL[a.soort])}
          </span>
          <h3 className="mt-1.5 text-[1.25rem] leading-snug">{t(a.titel)}</h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        <p className="text-[0.95rem] leading-relaxed text-grijs">{t(a.tekst)}</p>
        <div className="mt-auto space-y-1.5 pt-4 text-[0.82rem] text-grijs">
          <p className="inline-flex items-center gap-1.5">
            <MapPin size={14} aria-hidden /> {t(a.waar)}
          </p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-grijs/70">{t(T.agenda.door)}</span>
            {a.wie.map((w) => {
              const s = STICHTINGEN.find((x) => x.id === w)!;
              return (
                <span key={w} className="inline-flex items-center gap-1.5">
                  <Zegel vorm={s.logoKern} maat={16} kleur={ZEGEL_KLEUR} />
                  {t(s.kort)}
                </span>
              );
            })}
          </p>
        </div>
      </div>
      <span aria-hidden className="h-1 w-full" style={{background: soortKleur}} />
    </article>
  );
}

/* ------------------------------------------------------------ paginakoppen */

export function PaginaKop({
  kicker,
  titel,
  cursief,
  tekst,
  accent = '#b89838',
  accentZacht = '#e0c069',
  grond = '#2b1a10',
  merk = 'adinkrahene',
  beeld,
  beeldBij,
  logoKern,
  logoDoek,
}: {
  kicker: string;
  titel: string;
  cursief?: string;
  tekst: string;
  accent?: string;
  accentZacht?: string;
  grond?: string;
  merk?: Merk;
  beeld?: string;
  beeldBij?: string;
  logoKern?: string;
  logoDoek?: string;
}) {
  return (
    <header className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28" style={{background: grond}}>
      {/* Op de pagina van een stichting draagt hun eigen zegel het doek. */}
      <Doek vorm={logoDoek} kleur={accentZacht} dekking={0.12} />
      <div className="ruim relative grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="kicker inline-flex items-center gap-3" style={{color: accentZacht}}>
            {logoKern ? (
              <Zegel vorm={logoKern} maat={26} kleur={ZEGEL_KLEUR} titel={kicker} />
            ) : (
              <Adinkra merk={merk} maat={22} dikte={8} titel={MERKTEKENS[merk].naam} />
            )}
            {kicker}
          </p>
          <h1 className="mt-5 text-[2.3rem] leading-[1.02] text-zand sm:text-[3.6rem]">
            {titel}
            {cursief && (
              <span className="block italic" style={{color: accentZacht}}>
                {cursief}
              </span>
            )}
          </h1>
          <p className="mt-6 max-w-2xl lees text-zand/75">{tekst}</p>
        </div>
        {beeld && (
          <figure className="mx-auto w-full max-w-sm">
            {/* Het zegel hangt aan de onderrand van de boog. Het eigen relatieve
                vak is nodig, anders hangt het aan de onderkant van het hele
                blok en gaat het over het bijschrift heen. */}
            <div className="relative">
              <div className="boog overflow-hidden">
                <img
                  src={beeld}
                  alt={beeldBij ?? ''}
                  width={900}
                  height={1125}
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <span
                className="absolute -bottom-6 left-7 grid size-12 place-items-center rounded-full text-zand shadow-lg"
                style={{background: logoKern ? ZEGEL_KLEUR : accent}}>
                {logoKern ? <Zegel vorm={logoKern} maat={28} /> : <Adinkra merk={merk} maat={22} dikte={8} />}
              </span>
            </div>
            {beeldBij && <figcaption className="mt-10 pl-24 text-[0.78rem] text-zand/50">{beeldBij}</figcaption>}
          </figure>
        )}
      </div>
      <Kente hoogte={8} klasse="absolute inset-x-0 bottom-0" />
    </header>
  );
}

/* --------------------------------------------------------- stichtingpagina */

export function StichtingPagina({s}: {s: Stichting}) {
  const t = useT();
  const {taal} = useTaal();
  return (
    <>
      <PaginaKop
        kicker={t(s.kort)}
        titel={s.naam}
        tekst={t(s.intro)}
        accent={s.accent}
        accentZacht={s.accentZacht}
        grond={s.grond}
        merk={s.merk}
        beeld={s.beeld}
        beeldBij={t(s.beeldBij)}
        logoKern={s.logoKern}
        logoDoek={s.logoDoek}
      />

      <section className="wrap py-16 sm:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="kicker" style={{color: s.accent}}>
              {t(T.stichting.over)}
            </p>
            <div className="mt-5 space-y-6">
              {s.tekst.map((p, i) => (
                <p key={i} className={`lees text-inkt/85 ${i === 0 ? 'kapitaal' : ''}`}>
                  {t(p)}
                </p>
              ))}
            </div>
            <p
              className="mt-8 flex items-start gap-4 border-l-2 pl-5 text-[0.95rem] italic leading-relaxed text-grijs"
              style={{borderColor: s.accent}}>
              <Adinkra merk={s.merk} maat={26} dikte={8} klasse="mt-0.5 shrink-0" style={{color: s.accent}} />
              {t(T.tekens.vanStichting)} {MERKTEKENS[s.merk].naam}: {t(MERKTEKENS[s.merk].betekenis)}.
            </p>
          </div>

          <aside className="self-start border-t-4 bg-zand-diep p-6 sm:p-7" style={{borderColor: s.accent}}>
            {/* Hun eigen zegel. Alle drie hebben Afrika naast het eigen eiland of
                land staan, en dat vertelt in een beeld waar deze samenwerking
                over gaat. */}
            <img
              src={s.logo}
              alt={`${t(T.stichting.logoVan)} ${s.naam}`}
              width={320}
              height={320}
              className="mb-5 size-24 object-contain sm:size-28"
            />
            <h2 className="text-xl">{t(T.stichting.gegevens)}</h2>
            <dl className="mt-4 space-y-3 text-[0.95rem]">
              <Regel k={t(T.stichting.plaats)} v={t(s.plaats)} />
              {s.adres && <Regel k={t(T.stichting.adres)} v={s.adres} />}
              {s.opgericht && <Regel k={t(T.stichting.opgericht)} v={losseDatum(s.opgericht, taal)} />}
              <Regel k={t(T.stichting.status)} v={t(s.status)} />
              <Regel k={t(T.stichting.emailLabel)} v={s.email} link={s.email ? `mailto:${s.email}` : undefined} />
              <Regel k={t(T.stichting.kvk)} v={s.kvk} />
              {/* Nederland kent geen CRIB-nummer, daar hoort deze regel niet te
                  staan. `false` is dus iets anders dan `null`. */}
              {s.crib !== false && <Regel k={t(T.stichting.crib)} v={s.crib} />}
            </dl>
            {s.socials.length > 0 && (
              <>
                <h3 className="mt-6 text-[0.95rem] font-semibold">{t(T.stichting.volg)}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.socials.map((so) => (
                    <a
                      key={so.url}
                      href={so.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="rounded-full border border-lijn bg-white/60 px-4 py-2 text-sm font-medium capitalize transition hover:border-goud hover:text-goud-diep">
                      {so.soort}
                    </a>
                  ))}
                </div>
              </>
            )}
          </aside>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 text-zand sm:py-24" style={{background: s.grond}}>
        <Doek vorm={s.logoDoek} kleur={s.accentZacht} dekking={0.1} />
        <div className="wrap relative">
          <Kop
            licht
            kleur={s.accentZacht}
            kicker={t(T.stichting.werkKicker)}
            titel={t(T.stichting.werkTitel)}
            cursief={t(T.stichting.werkCursief)}
          />
          <div className="mt-12 grid gap-x-14 gap-y-10 sm:grid-cols-2">
            {s.focus.map((f, i) => (
              <div key={i} className="border-t border-white/15 pt-5">
                <p className="font-display text-[2rem] leading-none" style={{color: s.accentZacht, opacity: 0.55}}>
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-2 text-[1.35rem] text-zand">{t(f.kop)}</h3>
                <p className="mt-2 lees text-zand/70">{t(f.uitleg)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {(s.missie || s.visie) && <EigenMissieBlok s={s} />}
      {s.taken && s.taken.length > 0 && <EigenTakenBlok s={s} />}

      {s.id === 'bonaire' && <BestuurBlok />}
      {s.id === 'nederland' && <OprichtingBlok s={s} />}
      {s.anbi && <AnbiBlok s={s} />}

      <section className="wrap py-16 sm:py-24">
        <div
          className="flex flex-wrap items-center justify-between gap-8 border-t-4 bg-zand-diep p-8 sm:p-10"
          style={{borderColor: s.accent}}>
          <div className="max-w-xl">
            <h2 className="text-[1.8rem] leading-snug sm:text-[2.2rem]">
              {t(T.contact.vraagAan)} {t(s.kort)}?
            </h2>
            <p className="mt-3 lees text-grijs">{t(T.contact.vraagTekst).replace('{x}', t(s.kort))}</p>
          </div>
          <Link
            naar="/contact"
            className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold text-white"
            style={{background: s.accent}}>
            {t(T.contact.naarFormulier)} <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------ eigen missie, visie en statuten */

/**
 * De missie en visie van deze stichting zelf. De homepage toont de
 * gezamenlijke tekst; hier staat wat deze stichting van zichzelf zegt, en die
 * twee verschillen: Bonaire zegt Afrika en de eilanden, Curaçao zegt Afrika en
 * Curaçao.
 */
function EigenMissieBlok({s}: {s: Stichting}) {
  const t = useT();
  return (
    <section className="bg-zand-warm py-16 sm:py-24">
      <div className="wrap">
        <div className="max-w-2xl">
          <p className="kicker" style={{color: s.accent}}>
            {t(T.missie.kicker)}
          </p>
          <p className="mt-4 lees text-inkt/70">{t(T.stichting.eigenLead)}</p>
        </div>

        <div className="mt-12 space-y-14">
          {s.missie && (
            <blockquote className="max-w-4xl">
              <p className="font-display text-[1.55rem] leading-[1.25] text-inkt sm:text-[2.3rem]">{t(s.missie)}</p>
              <footer className="kicker mt-5" style={{color: s.accent}}>
                {t(T.missie.missieLabel)}
              </footer>
            </blockquote>
          )}
          {s.visie && (
            <blockquote className="ml-auto max-w-4xl lg:text-right">
              <p className="font-display text-[1.55rem] leading-[1.25] italic text-inkt sm:text-[2.3rem]">
                {t(s.visie)}
              </p>
              <footer className="kicker mt-5" style={{color: s.accent}}>
                {t(T.missie.visieLabel)}
              </footer>
            </blockquote>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * De statutaire taken van deze stichting, met hun eigen nummering. Wat wij niet
 * compleet hebben ontvangen blijft als zodanig zichtbaar: een ontbrekend punt
 * als open plek (`takenGat`), een afgekapte zin met een puntje-puntje en een
 * regel eronder (`onvolledig`). Stilletjes doorlopen zou suggereren dat dit de
 * volledige statuten zijn.
 */
function EigenTakenBlok({s}: {s: Stichting}) {
  const t = useT();
  const gat = s.takenGat;
  const afgekapt = s.taken!.filter((taak) => taak.onvolledig);
  return (
    <section className="wrap py-16 sm:py-24">
      <div className="max-w-2xl">
        <p className="kicker" style={{color: s.accent}}>
          {t(T.taken.kicker)}
        </p>
        <h2 className="mt-4 text-[2rem] leading-[1.08] sm:text-[2.8rem]">{t(T.stichting.takenTitel)}</h2>
      </div>

      <ol className="mt-12 grid items-start gap-x-14 gap-y-8 sm:grid-cols-2">
        {s.taken!.map((taak) => (
          <li key={taak.nr} className="flex gap-5 border-t border-inkt/12 pt-5">
            <span className="font-display text-[2rem] leading-none" style={{color: s.accent, opacity: 0.55}}>
              {String(taak.nr).padStart(2, '0')}
            </span>
            <div>
              <p className="text-[1rem] leading-[1.7] text-inkt/85">
                {t(taak.tekst)}
                {taak.onvolledig && <span className="text-inkt/40"> […]</span>}
              </p>
              {taak.punten && (
                <ul className="mt-3 space-y-1.5">
                  {taak.punten.map((p, i) => (
                    <li key={i} className="flex gap-2.5 text-[0.95rem] leading-[1.6] text-inkt/75">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full" style={{background: s.accent}} />
                      {t(p)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>

      {gat && (
        <p className="mt-10 border-l-2 pl-5 text-[0.95rem] italic leading-relaxed text-grijs" style={{borderColor: s.accent}}>
          {t(T.stichting.takenGat).replace('{a}', String(gat.van)).replace('{b}', String(gat.tot))}
        </p>
      )}

      {afgekapt.map((taak) => (
        <p
          key={taak.nr}
          className="mt-10 border-l-2 pl-5 text-[0.95rem] italic leading-relaxed text-grijs"
          style={{borderColor: s.accent}}
        >
          {t(T.stichting.takenAfgekapt).replace('{a}', String(taak.nr))}
        </p>
      ))}
    </section>
  );
}

function Regel({k, v, link}: {k: string; v: string | null; link?: string}) {
  const t = useT();
  return (
    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-lijn pb-3 last:border-0">
      <dt className="text-grijs">{k}</dt>
      <dd className="font-medium">
        {v ? (
          link ? (
            <a href={link} className="underline decoration-goud underline-offset-4">
              {v}
            </a>
          ) : (
            v
          )
        ) : (
          <span className="text-grijs/70 italic">{t(T.stichting.nogAanTeLeveren)}</span>
        )}
      </dd>
    </div>
  );
}

/* ------------------------------------------------------------ oprichtingblok */

/**
 * De oprichting van de Nederlandse stichting bij de notaris. Hun eigen film en
 * hun eigen foto's van die dag.
 *
 * De film staat op preload="none" met een posterbeeld ervoor: hij is zestien
 * megabyte, en dat mag niemand betalen die alleen even langs scrollt. Hij staat
 * ook niet op autoplay en niet op mute, want er wordt gesproken en dat is het
 * hele punt van deze opname.
 */
export function OprichtingBlok({s}: {s: Stichting}) {
  const t = useT();
  const {taal} = useTaal();
  const datum = opmaak(taal).lang.format(new Date(OPRICHTING_NL.datum + 'T12:00:00'));

  return (
    <section className="relative overflow-hidden bg-zand-warm py-16 sm:py-24">
      <Doek vorm={s.logoDoek} kleur={s.accent} dekking={0.06} />
      <div className="wrap relative">
        <div className="max-w-2xl">
          <p className="kicker" style={{color: s.accent}}>
            {t(T.oprichting.kicker)}
          </p>
          <h2 className="mt-4 text-[2rem] leading-[1.08] sm:text-[3rem]">
            {t(T.oprichting.titel)}
            <span className="italic" style={{color: s.accent}}>
              {' '}
              {t(T.oprichting.cursief)}
            </span>
          </h2>
          <p className="mt-5 lees text-grijs">{t(T.oprichting.tekst)}</p>
          <p className="mt-4 inline-flex items-center gap-2 text-[0.85rem] font-semibold" style={{color: s.accent}}>
            <CalendarDays size={15} aria-hidden />
            {datum}
          </p>
        </div>

        {/* Film en foto's staan op gelijke hoogte: drie even brede kolommen en
            overal dezelfde verhouding als de film, zodat de bovenkanten en de
            onderkanten van de beelden uitlijnen. De film houdt daarmee zijn
            eigen vorm (staand, uit een telefoon) en wordt niet bijgesneden; de
            foto's verliezen links en rechts een paar procent. */}
        <div className="mt-12 grid items-start gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-10">
          <figure className="mx-auto w-full max-w-[19rem] sm:mx-0 sm:max-w-none">
            <video
              controls
              preload="none"
              playsInline
              poster={OPRICHTING_NL.poster}
              width={514}
              height={850}
              className="w-full rounded-xl bg-nacht shadow-lg"
              style={{aspectRatio: '514 / 850'}}>
              <source src={OPRICHTING_NL.video} type="video/mp4" />
            </video>
            <figcaption className="mt-3 text-[0.8rem] text-grijs">{t(T.oprichting.videoBij)}</figcaption>
          </figure>

          {OPRICHTING_NL.fotos.map(f => (
            <figure key={f.src} className="mx-auto w-full max-w-[19rem] sm:mx-0 sm:max-w-none">
              <img
                src={f.src}
                alt={t(f.bij)}
                width={1066}
                height={1600}
                loading="lazy"
                className="w-full rounded-xl object-cover shadow-lg"
                style={{aspectRatio: '514 / 850'}}
              />
              <figcaption className="mt-3 text-[0.8rem] text-grijs">{t(f.bij)}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- bestuurblok */

export function BestuurBlok() {
  const t = useT();
  return (
    <section className="bg-zand-warm py-16 sm:py-24">
      <div className="wrap">
        <Kop
          kicker={t(T.bestuur.kicker)}
          kleur="#a4482f"
          titel={t(T.bestuur.titel)}
          cursief={t(T.bestuur.cursief)}
          tekst={t(T.bestuur.tekst)}
        />
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {BESTUUR_BONAIRE.map((b, i) => (
            <figure key={b.naam} className={i % 2 === 1 ? 'sm:mt-8' : ''}>
              <div className="boog overflow-hidden">
                <img
                  src={b.foto}
                  alt={`${b.naam}, ${t(b.rol)}`}
                  width={640}
                  height={800}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <figcaption className="mt-3">
                <p className="font-display text-[1.02rem] leading-tight">{b.naam}</p>
                <p className="text-[0.85rem] text-grijs">{t(b.rol)}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ ANBI */

export function AnbiBlok({s}: {s: Stichting}) {
  const t = useT();
  const stukken: {kop: Tekst; tekst: Tekst}[] = [
    {kop: T.anbi.beleidsplan, tekst: T.anbi.beleidsplanTekst},
    {kop: T.anbi.verslag, tekst: T.anbi.verslagTekst},
    {kop: T.anbi.financieel, tekst: T.anbi.financieelTekst},
  ];
  return (
    <section id="anbi" className="relative overflow-hidden bg-nacht-diep py-16 text-zand sm:py-24">
      <Doek vorm={s.logoDoek} kleur={s.accentZacht} dekking={0.09} />
      <div className="wrap relative">
        <div className="flex items-start gap-4">
          <ShieldCheck size={30} aria-hidden style={{color: s.accentZacht}} className="mt-2 shrink-0" />
          <Kop
            licht
            kleur={s.accentZacht}
            kicker={t(T.anbi.kicker)}
            titel={t(T.anbi.titel)}
            tekst={t(T.anbi.lead)}
          />
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="border-t-2 bg-white/[0.04] p-6 sm:p-7" style={{borderColor: s.accent}}>
            <h3 className="text-xl text-zand">{t(T.anbi.naamKop)}</h3>
            <dl className="mt-4 space-y-3 text-[0.95rem]">
              {ANBI_VELDEN.map((v) => (
                <div
                  key={v.kop.nl}
                  className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-white/10 pb-3 last:border-0">
                  <dt className="text-zand/55">{t(v.kop)}</dt>
                  <dd className="max-w-[60%] text-right font-medium text-zand">
                    {v.waarde ?? <span className="italic text-zand/45">{t(T.anbi.nogAanTeLeveren)}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="space-y-6">
            <div className="border-t-2 bg-white/[0.04] p-6 sm:p-7" style={{borderColor: s.accent}}>
              <h3 className="text-xl text-zand">{t(T.anbi.doelKop)}</h3>
              <p className="mt-3 leading-relaxed text-zand/75">{t(T.anbi.doelTekst)}</p>
            </div>

            <div className="border-t-2 bg-white/[0.04] p-6 sm:p-7" style={{borderColor: s.accent}}>
              <h3 className="text-xl text-zand">{t(T.anbi.bestuurKop)}</h3>
              <p className="mt-3 leading-relaxed text-zand/75">{t(T.anbi.bestuurTekst)}</p>
            </div>
          </div>
        </div>

        <h3 className="mt-14 text-xl text-zand">{t(T.anbi.stukkenKop)}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {stukken.map((d) => (
            <div key={d.kop.nl} className="border border-dashed border-white/20 bg-white/[0.03] p-5">
              <FileText size={20} aria-hidden style={{color: s.accentZacht}} />
              <h4 className="mt-3 text-[1.05rem] text-zand">{t(d.kop)}</h4>
              <p className="mt-1.5 text-[0.88rem] leading-relaxed text-zand/60">{t(d.tekst)}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-wider text-zand/40">
                {t(T.anbi.nogNiet)}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-5 max-w-3xl text-[0.9rem] leading-relaxed text-zand/55">{t(T.anbi.eigenBestand)}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- agenda */

export function AgendaPagina() {
  const t = useT();
  const [filter, setFilter] = useState<'alle' | 'bonaire' | 'curacao' | 'nederland'>('alle');
  const lijst = useMemo(() => komende().filter((a) => filter === 'alle' || a.wie.includes(filter)), [filter]);

  return (
    <>
      <PaginaKop
        kicker={t(T.agenda.kicker)}
        titel={t(T.agenda.titel)}
        tekst={t(T.agenda.paginaTekst)}
        grond="#0c2138"
        accent="#1b5f70"
        accentZacht="#63aab6"
        merk="nkyinkyim"
      />
      <section className="wrap py-16 sm:py-24">
        <div className="flex flex-wrap gap-2">
          {(['alle', 'bonaire', 'curacao', 'nederland'] as const).map((k) => {
            const s = STICHTINGEN.find((x) => x.id === k);
            const aan = filter === k;
            return (
              <button
                key={k}
                onClick={() => setFilter(k)}
                aria-pressed={aan}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                  aan ? 'border-transparent text-white' : 'border-lijn bg-white/60 text-inkt hover:border-goud'
                }`}
                style={aan ? {background: s ? s.accent : '#1b110a'} : undefined}>
                {s && <Zegel vorm={s.logoKern} maat={17} />}
                {s ? t(s.kort) : t(T.agenda.alles)}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lijst.map((a) => (
            <AgendaKaart key={a.datum + a.titel.nl} a={a} />
          ))}
        </div>

        <div className="mt-12 border-l-4 border-goud bg-goud/10 p-6 sm:p-8">
          <h3 className="text-[1.5rem]">{t(T.agenda.eigenKop)}</h3>
          <p className="mt-3 max-w-3xl lees text-grijs">{t(T.agenda.eigenTekst)}</p>
        </div>
      </section>
    </>
  );
}

/* --------------------------------------------------------------- steun ons */

export function SteunPagina() {
  const t = useT();
  const [bedrag, setBedrag] = useState<number | 'anders'>(25);
  const [eigen, setEigen] = useState('');
  const bedragen = [10, 25, 50, 100];

  const kaarten = [
    {icoon: Users, kop: T.steun.vriendKop, tekst: T.steun.vriendTekst},
    {icoon: Building2, kop: T.steun.sponsorKop, tekst: T.steun.sponsorTekst},
    {icoon: Heart, kop: T.steun.helpKop, tekst: T.steun.helpTekst},
  ];

  return (
    <>
      <PaginaKop
        kicker={t(T.steun.kicker)}
        titel={t(T.steun.paginaTitel)}
        cursief={t(T.steun.paginaCursief)}
        tekst={t(T.steun.paginaTekst)}
        grond="#2c4c34"
        accent="#b89838"
        accentZacht="#e0c069"
        merk="akoma"
        beeld="/img/samen.webp"
        beeldBij={t(T.steun.paginaBeeldBij)}
      />

      {/* Woordelijk de tekst van de stichting zelf, aangeleverd voor precies
          deze plek. Goud tussen de groene kop en het witte doneerblok, zodat
          het als eigen stem leest en niet als nog een alinea. */}
      <section className="relative overflow-hidden bg-goud text-nacht">
        <Doek dekking={0.07} kleur="#1b110a" />
        <div className="wrap relative py-14 text-center sm:py-20">
          <blockquote className="mx-auto max-w-4xl">
            <p className="font-display text-[1.9rem] leading-[1.15] sm:text-[3.2rem]">
              {'“'}
              {t(T.steun.citaat)}
              {'”'}
            </p>
          </blockquote>
          <p className="mx-auto mt-6 max-w-2xl lees text-nacht/80">{t(T.steun.citaatOnder)}</p>
          <p className="mt-7 text-[0.95rem]">
            <span className="kicker text-nacht/60">{t(T.steun.citaatContact)}</span>{' '}
            <a
              href="mailto:info@3diaspora.org"
              className="font-medium underline decoration-nacht/30 underline-offset-4 transition hover:decoration-nacht">
              info@3diaspora.org
            </a>
          </p>
        </div>
      </section>

      <section className="wrap py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:items-start">
          <div>
            <Kop kicker={t(T.steun.kopKicker)} titel={t(T.steun.kopTitel)} cursief={t(T.steun.kopCursief)} />
            <div className="mt-8 border-t-4 border-goud bg-zand-diep p-6 sm:p-8">
              <p className="kicker text-grijs">{t(T.steun.kiesBedrag)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {bedragen.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBedrag(b)}
                    aria-pressed={bedrag === b}
                    className={`rounded-xl border px-5 py-3 font-display text-lg transition ${
                      bedrag === b ? 'border-goud bg-goud/20 text-goud-diep' : 'border-lijn bg-white hover:border-goud/60'
                    }`}>
                    {'€'} {b}
                  </button>
                ))}
                <button
                  onClick={() => setBedrag('anders')}
                  aria-pressed={bedrag === 'anders'}
                  className={`rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                    bedrag === 'anders' ? 'border-goud bg-goud/20 text-goud-diep' : 'border-lijn bg-white hover:border-goud/60'
                  }`}>
                  {t(T.steun.anderBedrag)}
                </button>
              </div>
              {bedrag === 'anders' && (
                <label className="mt-4 block">
                  <span className="text-sm font-medium text-grijs">{t(T.steun.uwBedrag)}</span>
                  <input
                    type="number"
                    min={1}
                    inputMode="decimal"
                    value={eigen}
                    onChange={(e) => setEigen(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-lijn bg-white px-4 py-3 outline-none focus:border-goud"
                    placeholder={t(T.steun.voorbeeld)}
                  />
                </label>
              )}
              <button
                type="button"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-goud px-6 py-4 font-semibold text-nacht transition hover:bg-goud-licht">
                <Heart size={17} aria-hidden />
                {t(T.steun.doneerKnop)} {bedrag === 'anders' ? (eigen ? `€ ${eigen}` : '') : `€ ${bedrag}`}
              </button>
              <p className="mt-3 text-[0.82rem] leading-relaxed text-grijs">{t(T.steun.koppelingUit)}</p>
            </div>
          </div>

          <div className="space-y-6">
            {kaarten.map((k) => (
              <div key={k.kop.nl} className="border-l-2 border-goud/50 pl-6">
                <k.icoon size={22} className="text-goud-diep" aria-hidden />
                <h3 className="mt-3 text-[1.35rem]">{t(k.kop)}</h3>
                <p className="mt-2 lees text-grijs">{t(k.tekst)}</p>
              </div>
            ))}
            <div className="relative overflow-hidden bg-nacht p-7 text-zand">
              <Doek dekking={0.1} />
              <p className="relative leading-relaxed text-zand/80">{t(T.steun.anbiNote)}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------------------------------------------------------------- contact */

/**
 * Waar het formulier heen gaat. De Worker in worker/index.ts vangt dit pad op,
 * legt de bijlagen in R2 en stuurt twee mailtjes: een naar de stichting en een
 * bevestiging terug naar de afzender.
 */
const ENDPOINT = '/api/forms/contact';

/** Het veld waarmee de Worker weet in welke taal die bevestiging moet. */
const TAALVELD = '__jiw_confirmation_locale';

export function ContactFormulier() {
  const t = useT();
  const {taal} = useTaal();
  const [onderwerp, setOnderwerp] = useState('');
  const [verzonden, setVerzonden] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState(false);
  const [bijlagen, setBijlagen] = useState<File[]>([]);

  const onderwerpen = [
    {id: 'algemeen', label: T.contact.onderwerpAlgemeen},
    {id: 'bonaire', label: STICHTINGEN[0].kort},
    {id: 'curacao', label: STICHTINGEN[1].kort},
    {id: 'nederland', label: STICHTINGEN[2].kort},
    {id: 'samenwerken', label: T.contact.onderwerpSamenwerken},
    {id: 'vrijwilliger', label: T.contact.onderwerpVrijwilliger},
  ];

  async function verstuur(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (bezig) return;
    setBezig(true);
    setFout(false);

    const data = new FormData(e.currentTarget);

    /* Het pakket achter de Worker kent drie namen van zichzelf. De rest van de
       velden komt door onder de naam die worker/index.ts noemt bij emailFields;
       wat daar niet in staat, staat ook niet in de mail. */
    data.set('firstName', String(data.get('voornaam') ?? ''));
    data.set('lastName', String(data.get('achternaam') ?? ''));
    data.delete('voornaam');
    data.delete('achternaam');

    /* In de mail aan de stichting hoort te staan waar het over gaat, niet de
       sleutel waarmee de knop is aangezet. Engels, want dat is de taal van die
       mail; welke taal de bezoeker zelf las staat er hieronder los bij. */
    data.set('onderwerp', onderwerpen.find((o) => o.id === onderwerp)?.label.en ?? '');
    data.set('onderwerpId', onderwerp);

    /* Alle bijlagen onder dezelfde naam: zo leest de Worker ze uit. */
    bijlagen.forEach((b) => data.append('files', b));

    data.set(TAALVELD, taal);

    try {
      const r = await fetch(ENDPOINT, {method: 'POST', body: data});
      const antwoord = (await r.json().catch(() => null)) as {ok?: boolean} | null;
      /* Alleen een echt geslaagde verzending mag "dank u wel" opleveren. Een
         bericht dat in het niets verdween en toch bedankt wordt, is een bericht
         dat niemand nog een keer stuurt. */
      if (!r.ok || !antwoord?.ok) throw new Error('verzenden mislukt');
      setVerzonden(true);
    } catch {
      setFout(true);
    } finally {
      setBezig(false);
    }
  }

  if (verzonden) {
    return (
      <div className="border-t-4 border-goud bg-goud/10 p-10 text-center">
        <Check size={30} className="mx-auto text-goud-diep" aria-hidden />
        <h3 className="mt-3 text-[1.8rem]">{t(T.contact.dank)}</h3>
        <p className="mt-2 text-grijs">{t(T.contact.dankTekst)}</p>
      </div>
    );
  }

  return (
    <form onSubmit={verstuur} className="border-t-4 border-goud bg-zand-diep p-6 sm:p-8">
      <fieldset>
        <legend className="kicker text-grijs">{t(T.contact.waarover)}</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {onderwerpen.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setOnderwerp(o.id)}
              aria-pressed={onderwerp === o.id}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                onderwerp === o.id ? 'border-goud bg-goud/20 text-goud-diep' : 'border-lijn bg-white hover:border-goud/60'
              }`}>
              {t(o.label)}
            </button>
          ))}
        </div>
        <input type="hidden" name="onderwerp" value={onderwerp} />
      </fieldset>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Veld naam="voornaam" label={t(T.contact.voornaam)} autoComplete="given-name" verplicht />
        <Veld naam="achternaam" label={t(T.contact.achternaam)} autoComplete="family-name" verplicht />
        <Veld naam="email" label={t(T.contact.email)} type="email" autoComplete="email" verplicht />
        <Veld naam="telefoon" label={t(T.contact.telefoon)} type="tel" autoComplete="tel" inputMode="tel" />
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-grijs">{t(T.contact.bericht)}</span>
        <textarea
          name="bericht"
          rows={5}
          required
          className="mt-1.5 w-full rounded-xl border border-lijn bg-white px-4 py-3 outline-none focus:border-goud"
        />
      </label>

      <label className="mt-4 block cursor-pointer rounded-xl border border-dashed border-lijn bg-white px-4 py-4 text-sm text-grijs transition hover:border-goud">
        <span className="inline-flex items-center gap-2 font-medium">
          <Paperclip size={16} aria-hidden /> {t(T.contact.bijlage)}
        </span>
        <input
          type="file"
          multiple
          accept="image/*,.pdf"
          className="sr-only"
          onChange={(e) => setBijlagen(Array.from(e.target.files ?? []).slice(0, 6))}
        />
        {bijlagen.length > 0 && (
          <span className="mt-2 block text-[0.85rem] text-goud-diep">
            {bijlagen.length} {t(bijlagen.length > 1 ? T.contact.bestandenGekozen : T.contact.bestandGekozen)}
          </span>
        )}
      </label>

      {/* Het veld waar een bot in trapt. Het staat gewoon in de HTML, want daar
          leest hij hem uit; een bezoeker ziet hem nooit en het toetsenbord en
          de schermlezer lopen er langs. Komt hij ingevuld binnen, dan gooit de
          Worker het bericht weg zonder iets te versturen. */}
      <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label>
          Organisatie
          <input type="text" name="organisatie" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {fout && (
        <p className="mt-4 border-l-2 border-klei bg-klei/10 px-4 py-3 text-sm text-klei">{t(T.contact.fout)}</p>
      )}

      <button
        type="submit"
        disabled={!onderwerp || bezig}
        className="mt-6 w-full rounded-full bg-nacht px-6 py-4 font-semibold text-zand transition hover:bg-nacht-zacht disabled:cursor-not-allowed disabled:opacity-45">
        {bezig ? t(T.contact.bezig) : t(T.contact.verstuur)}
      </button>
      {!onderwerp && <p className="mt-2 text-center text-[0.82rem] text-grijs">{t(T.contact.kiesEerst)}</p>}
    </form>
  );
}

function Veld({
  naam,
  label,
  verplicht,
  ...rest
}: {naam: string; label: string; verplicht?: boolean} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-grijs">{label}</span>
      <input
        name={naam}
        required={verplicht}
        className="mt-1.5 w-full rounded-xl border border-lijn bg-white px-4 py-3 outline-none focus:border-goud"
        {...rest}
      />
    </label>
  );
}

export function ContactPagina() {
  const t = useT();
  return (
    <>
      <PaginaKop
        kicker={t(T.contact.kicker)}
        titel={t(T.contact.paginaTitel)}
        cursief={t(T.contact.paginaCursief)}
        tekst={t(T.contact.paginaTekst)}
        grond="#2b1a10"
        merk="nkonsonkonson"
      />
      <section className="wrap grid gap-12 py-16 sm:py-24 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Kop
            kicker={t(T.contact.rechtstreeksKicker)}
            titel={t(T.contact.rechtstreeksTitel)}
            cursief={t(T.contact.rechtstreeksCursief)}
          />
          <div className="mt-8 space-y-6">
            {STICHTINGEN.map((s) => (
              <div key={s.id} className="border-l-2 pl-6" style={{borderColor: s.accent}}>
                <div className="flex items-center gap-2.5">
                  <Zegel vorm={s.logoKern} maat={24} kleur={ZEGEL_KLEUR} />
                  <h3 className="text-[1.2rem]">{t(s.kort)}</h3>
                </div>
                <p className="mt-1 text-[0.9rem] text-grijs">{t(s.plaats)}</p>
                {s.email ? (
                  <a
                    href={`mailto:${s.email}`}
                    className="mt-2 inline-flex items-center gap-2 text-[0.95rem] font-medium underline decoration-goud underline-offset-4">
                    <Mail size={15} aria-hidden /> {s.email}
                  </a>
                ) : (
                  <p className="mt-2 text-[0.9rem] italic text-grijs/70">{t(T.contact.mailNog)}</p>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <Kop
            kicker={t(T.contact.formulierKicker)}
            titel={t(T.contact.formulierTitel)}
            cursief={t(T.contact.formulierCursief)}
          />
          <div className="mt-8">
            <ContactFormulier />
          </div>
        </div>
      </section>
    </>
  );
}
