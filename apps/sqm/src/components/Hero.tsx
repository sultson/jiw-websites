import { ArrowRight, Star, BadgeCheck, ShieldCheck } from 'lucide-react';

type Props = { t: (k: string) => string; onIntake: () => void };

export default function Hero({ t, onIntake }: Props) {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* blueprint backdrop */}
      <div className="absolute inset-0 bg-blueprint-fade pointer-events-none" aria-hidden />

      {/* diagonal stripe accent - narrow vertical column far edge, sits behind everything */}
      <div className="absolute right-0 top-0 bottom-0 w-24 lg:w-32 hidden md:block opacity-30 pointer-events-none -z-0" aria-hidden>
        <div className="absolute inset-0 diag-stripes" style={{ maskImage: 'linear-gradient(to bottom, black 0%, transparent 85%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 85%)' }} />
      </div>

      {/* thin orange marker line, edge */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-orange/0 md:bg-gradient-to-b md:from-orange md:via-orange/40 md:to-transparent pointer-events-none" aria-hidden />

      {/* decorative isometric mark, bottom-left of hero */}
      <IsoMark className="absolute left-4 bottom-32 hidden lg:block w-24 h-24 text-charcoal/12 pointer-events-none" />

      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 lg:pt-28 pb-16 sm:pb-24 lg:pb-32">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 rise-in">
            <span className="kicker">{t('hero.kicker')}</span>
            <h1 className="mt-5 text-[44px] sm:text-[64px] lg:text-[88px] leading-[0.95] font-extrabold whitespace-pre-line tracking-[-0.04em]">
              {t('hero.title')}
            </h1>
            <p className="mt-7 text-lg sm:text-xl text-charcoal/80 max-w-2xl leading-relaxed">
              {t('hero.sub')}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button type="button" className="btn-orange" onClick={onIntake}>
                {t('hero.cta')}
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>
              <a href="#diensten" className="btn-outline">{t('hero.cta2')}</a>
            </div>

            {/* pillar word mark */}
            <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] uppercase tracking-[0.28em] text-charcoal/55 font-semibold">
              <span className="inline-block w-8 h-px bg-charcoal/30" />
              <span>Structuur</span>
              <span className="text-orange/60">·</span>
              <span>Inzicht</span>
              <span className="text-orange/60">·</span>
              <span>Kwaliteit</span>
              <span className="text-orange/60">·</span>
              <span>Resultaat</span>
            </div>
          </div>

          {/* proof panel - promoted to an editorial credentials card */}
          <aside className="lg:col-span-5 rise-in-delay-1">
            <div className="relative">
              {/* charcoal-edge frame creating the architectural sheet feel */}
              <div className="absolute -inset-x-2 -inset-y-2 lg:-inset-3 border border-charcoal/15 pointer-events-none" aria-hidden />
              <div className="absolute -top-[7px] -left-[7px] lg:-top-[9px] lg:-left-[9px] w-3 h-3 bg-orange" aria-hidden />
              <div className="absolute -bottom-[7px] -right-[7px] lg:-bottom-[9px] lg:-right-[9px] w-3 h-3 bg-charcoal-ink" aria-hidden />

              <div className="bg-cream-soft border border-charcoal/12 shadow-[0_24px_48px_-24px_rgba(26,32,41,0.18)]">
                {/* sheet header */}
                <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-b border-charcoal/10 bg-charcoal-ink text-cream">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-orange-soft" strokeWidth={2} />
                    <span className="text-[10px] uppercase tracking-[0.28em] font-semibold">Credentials</span>
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.22em] text-cream/55">Sheet · 01</span>
                </div>

                {/* big number - years */}
                <div className="px-5 sm:px-6 pt-6 pb-5 border-b border-charcoal/10">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display font-extrabold text-charcoal-ink leading-none text-[64px] sm:text-[80px] tracking-[-0.05em]">
                      26
                    </span>
                    <span className="font-display font-extrabold text-charcoal-ink/70 text-2xl sm:text-3xl leading-none tracking-[-0.03em]">
                      years
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-charcoal/60 font-semibold">
                    {t('hero.proof.yearsSub')} · {t('hero.kicker')}
                  </p>
                </div>

                {/* rating row */}
                <div className="px-5 sm:px-6 py-5 border-b border-charcoal/10 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1">
                      {[0,1,2,3,4].map((i) => (
                        <Star key={i} size={16} className="text-orange fill-orange" />
                      ))}
                    </div>
                    <div className="mt-1.5 flex items-baseline gap-1.5">
                      <span className="font-display font-extrabold text-charcoal-ink text-2xl tracking-[-0.02em]">{t('hero.proof.rating')}</span>
                      <span className="text-charcoal/55 text-xs">· {t('hero.proof.ratingSub')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-charcoal/55 font-semibold">Werkspot</div>
                    <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-charcoal/70 font-semibold">
                      <BadgeCheck size={12} className="text-orange" strokeWidth={2.4} />
                      Verified
                    </div>
                  </div>
                </div>

                {/* footer row - kvk + warranty */}
                <div className="grid grid-cols-2 divide-x divide-charcoal/10">
                  <div className="px-5 sm:px-6 py-4">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-charcoal/55 font-semibold">KvK</div>
                    <div className="mt-1 font-display font-extrabold text-charcoal-ink text-sm tracking-tight">24330825</div>
                  </div>
                  <div className="px-5 sm:px-6 py-4">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-charcoal/55 font-semibold">{t('hero.proof.warranty')}</div>
                    <div className="mt-1 font-display font-extrabold text-charcoal-ink text-sm tracking-tight">{t('hero.proof.warrantySub')}</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* bottom rule with orange diagonal kicker - connects to next section */}
      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="h-px bg-charcoal/10 flex-1" />
          <div className="diag-stripes h-2 w-12 opacity-80" aria-hidden />
          <div className="h-px bg-charcoal/10 flex-1" />
        </div>
      </div>
    </section>
  );
}

function IsoMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.2} className={className} aria-hidden>
      <path d="M40 8 L72 26 L72 54 L40 72 L8 54 L8 26 Z" />
      <path d="M40 8 L40 40 M40 40 L72 26 M40 40 L8 26 M40 40 L40 72" />
    </svg>
  );
}
