import { ArrowRight, Phone, Star, Check } from 'lucide-react';
import Reveal from './Reveal';
import Magnetic from './Magnetic';
import { SITE } from '../lib/site';

type Props = {
  t: (k: string) => string;
  onIntake: () => void;
};

export default function CtaBand({ t, onIntake }: Props) {
  const points = [t('cta.point1'), t('cta.point2'), t('cta.point3')];

  return (
    <section className="relative overflow-hidden bg-cobalt text-white">
      <div className="absolute inset-0 bg-grid-light pointer-events-none" aria-hidden />
      <div
        className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full pointer-events-none"
        aria-hidden
        style={{
          background:
            'radial-gradient(circle at center, rgba(255,255,255,0.14), transparent 65%)',
        }}
      />

      <div className="relative shell py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* ── LEFT — message + CTA ─────────────────────── */}
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="display-lg text-white dot-spark">{t('cta.title')}</h2>
            </Reveal>
            <Reveal delay={1}>
              <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/80">
                {t('cta.sub')}
              </p>
            </Reveal>

            <Reveal delay={2}>
              <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-5">
                <Magnetic>
                  <button
                    type="button"
                    onClick={onIntake}
                    className="btn bg-white text-cobalt shadow-[0_12px_30px_-10px_rgba(0,0,0,0.4)] hover:-translate-y-0.5"
                  >
                    {t('cta.button')}
                    <ArrowRight size={17} strokeWidth={2.5} />
                  </button>
                </Magnetic>

                <div className="flex items-center gap-2.5 text-[15px]">
                  <span className="text-white/70 font-medium">{t('cta.call')}</span>
                  <a
                    href={SITE.phoneHref}
                    className="inline-flex items-center gap-2 font-bold text-white hover:text-white/80 transition-colors"
                  >
                    <Phone size={16} strokeWidth={2.5} />
                    {SITE.phoneDisplay}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ── RIGHT — reassurance card ─────────────────── */}
          <div className="lg:col-span-5">
            <Reveal delay={2}>
              <div className="rounded-2xl bg-white/10 border border-white/15 p-7 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5" aria-hidden>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} size={17} className="fill-[#FBBF24] text-[#FBBF24]" />
                    ))}
                  </div>
                  <span className="text-[18px] font-extrabold text-white leading-none tnum">
                    {SITE.ratingValue}
                  </span>
                  <span className="text-[13px] text-white/65">
                    {SITE.ratingCount} {t('rv.eyebrow').toLowerCase()}
                  </span>
                </div>

                <ul className="mt-5 flex flex-col gap-3 border-t border-white/15 pt-5">
                  {points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-[15px] text-white/90">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/15">
                        <Check size={12} strokeWidth={3} className="text-white" />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
