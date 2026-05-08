import { ArrowRight } from 'lucide-react';
import { services, type ServiceKey } from '../data/services';

type Props = { t: (k: string) => string; onIntake: () => void };

/**
 * Each service gets a small paint-swatch block. The colour is descriptive of
 * the typical work surface, not branding for the service. Binnen uses a
 * hatched texture so it doesn't disappear into the paper-deep section bg.
 */
const swatchFor: Record<ServiceKey, { bg?: string; className?: string }> = {
  buiten: { bg: '#5A6E55' },        // exterior moss / facade
  binnen: { className: 'swatch-hatch' }, // warm interior wall, hatched
  spray:  { bg: '#1A1D22' },        // factory-grade lacquer (ink)
  wand:   { bg: '#C5934A' },        // ochre, the brand mark
};

export default function Services({ t, onIntake }: Props) {
  return (
    <section id="diensten" className="py-20 sm:py-24 lg:py-32 bg-paper-deep border-y border-ink/8">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-end mb-12 lg:mb-16">
          <div className="lg:col-span-8">
            <span className="kicker">{t('svc.kicker')}</span>
            <h2 className="mt-4 font-bold tracking-[-0.025em] leading-[1.05] max-w-3xl"
                style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
              {t('svc.title')}
            </h2>
          </div>
          <p className="lg:col-span-4 text-ink/75 leading-relaxed">
            {t('svc.intro')}
          </p>
        </div>

        {/* Catalog rows. Title left half (with inline swatch), bullets right half. */}
        <div className="border-t border-ink/15">
          {services.map((svc) => (
            <article
              key={svc.key}
              className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 gap-x-12 py-10 lg:py-14 border-b border-ink/15 group"
            >
              {/* Title block: swatch + headline + sub */}
              <div className="lg:col-span-6 flex items-start gap-5">
                <span
                  className={`block w-12 h-12 lg:w-14 lg:h-14 mt-1 shrink-0 ${swatchFor[svc.key].className ?? ''}`}
                  style={swatchFor[svc.key].bg ? { background: swatchFor[svc.key].bg } : undefined}
                  aria-hidden
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-extrabold tracking-[-0.025em] leading-[0.98]"
                      style={{ fontSize: 'clamp(28px, 3.4vw, 44px)' }}>
                    {t(svc.trKey)}
                  </h3>
                  <p className="mt-3 text-ink/70 leading-relaxed">
                    {t(`${svc.trKey}Sub`)}
                  </p>
                </div>
              </div>

              {/* Bullets + CTA */}
              <div className="lg:col-span-6">
                <ul className="space-y-2.5 text-ink/85">
                  {Array.from({ length: svc.itemCount }).map((_, idx) => (
                    <li key={idx} className="flex items-start gap-3 leading-relaxed">
                      <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-ochre shrink-0" aria-hidden />
                      <span>{t(`${svc.trKey}.${idx + 1}`)}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={onIntake}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-ink hover:text-ochre-deep transition-colors"
                >
                  {t('nav.cta')}
                  <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
