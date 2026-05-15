import { ArrowRight, Star } from 'lucide-react';
import Reveal from './Reveal';
import Magnetic from './Magnetic';
import { SITE } from '../lib/site';

type Props = { t: (k: string) => string; onIntake: () => void };

export default function Hero({ t, onIntake }: Props) {
  const stats = [
    { n: t('hero.stat1'), s: t('hero.stat1sub') },
    { n: t('hero.stat2'), s: t('hero.stat2sub') },
    { n: t('hero.stat3'), s: t('hero.stat3sub') },
  ];

  return (
    <section id="top" className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-grid pointer-events-none" aria-hidden />
      <div
        className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-bone/60 to-transparent pointer-events-none"
        aria-hidden
      />

      <div className="relative shell pt-12 lg:pt-20 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* ── LEFT ─────────────────────────────── */}
          <div className="lg:col-span-7">
            <Reveal>
              <span className="chip-cobalt">{t('hero.eyebrow')}</span>
            </Reveal>

            <Reveal delay={1}>
              <h1 className="mt-6 display-xl text-ink">
                {t('hero.title')}
                <span className="text-spark">.</span>
              </h1>
            </Reveal>

            <Reveal delay={2}>
              <p className="mt-6 max-w-xl text-[17px] lg:text-[19px] leading-relaxed text-ink-soft">
                {t('hero.sub')}
              </p>
            </Reveal>

            <Reveal delay={3}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic strength={14}>
                  <button type="button" className="btn-cobalt" onClick={onIntake}>
                    {t('hero.cta')}
                    <ArrowRight size={17} strokeWidth={2.6} />
                  </button>
                </Magnetic>
                <a href="#projecten" className="btn-outline">
                  {t('hero.cta2')}
                </a>
              </div>
            </Reveal>

            {/* ── trust stack ──────────────────── */}
            <Reveal delay={4}>
              <div className="mt-10">
                <div className="flex flex-wrap items-stretch gap-x-6 gap-y-4 border-t border-line-cool pt-6">
                  {stats.map((st, i) => (
                    <div key={st.n} className="flex items-stretch gap-6">
                      {i > 0 && (
                        <span className="hidden sm:block w-px self-stretch bg-line-cool" aria-hidden />
                      )}
                      <div>
                        <div className="text-[15px] font-extrabold text-ink leading-tight">
                          {st.n}
                        </div>
                        <div className="mt-0.5 text-[13px] text-ink-mute leading-snug max-w-[12rem]">
                          {st.s}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* ── RIGHT ────────────────────────────── */}
          <div className="lg:col-span-5">
            <Reveal delay={2}>
              <div className="relative">
                <div className="overflow-hidden rounded-3xl border border-line-cool">
                  <img
                    src="/projects/team-and-cars.webp"
                    alt={t('hero.imageAlt')}
                    width={1600}
                    height={1197}
                    className="w-full aspect-[4/3] object-cover"
                    loading="eager"
                  />
                </div>

                {/* floating rating badge */}
                <div className="absolute -bottom-5 -left-3 sm:-left-5 bg-white border border-line-cool rounded-2xl px-4 py-3 flex items-center gap-3 shadow-[0_18px_40px_-22px_rgba(12,27,58,0.4)]">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-cobalt text-white">
                    <Star size={20} className="fill-white text-white" />
                  </div>
                  <div>
                    <div className="text-[18px] font-extrabold text-ink leading-none tnum">
                      {SITE.ratingValue}
                    </div>
                    <div className="mt-1 text-[12px] text-ink-mute leading-none">
                      {t('hero.ratingbadge')}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
