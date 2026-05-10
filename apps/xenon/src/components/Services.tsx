import { ArrowUpRight } from 'lucide-react';
import { services } from '../data/services';

type Props = {
  t: (key: string) => string;
  onIntake: () => void;
};

export default function Services({ t, onIntake }: Props) {
  return (
    <section id="diensten" className="relative py-20 sm:py-28 lg:py-32 bg-night border-t border-mist">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="kicker !text-xenon-bright">{t('services.kicker')}</span>
          <h2 className="mt-4 text-[30px] sm:text-[40px] lg:text-[48px] leading-[1.08] text-silver font-display">
            {t('services.title')}
          </h2>
          <p className="mt-5 text-[15.5px] sm:text-[16.5px] text-steel/90 leading-relaxed max-w-2xl">
            {t('services.lede')}
          </p>
        </div>

        {/* Asymmetric grid: portier (large) + 4 cards in a 2x2 alongside on lg, stacked below on smaller */}
        <div className="mt-12 sm:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
          {services.map((s, i) => {
            const isFeature = i === 0;
            const span = isFeature
              ? 'lg:col-span-6 lg:row-span-2'
              : i === 1
                ? 'lg:col-span-6'
                : i === 2
                  ? 'lg:col-span-3'
                  : i === 3
                    ? 'lg:col-span-3'
                    : 'lg:col-span-6';
            return (
              <article
                key={s.id}
                className={`group relative overflow-hidden bg-night-soft border border-mist ${span}`}
              >
                <div className={`relative ${isFeature ? 'aspect-[4/5]' : 'aspect-[16/10]'} overflow-hidden`}>
                  <img
                    src={s.image}
                    alt={t(s.titleKey)}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(6,8,15,0) 30%, rgba(6,8,15,0.85) 100%)',
                    }}
                    aria-hidden
                  />
                  <div className="absolute top-3 left-3 spec-line text-xenon-bright bg-night-deep/65 backdrop-blur-sm px-2 py-1">
                    {String(i + 1).padStart(2, '0')} · {t(s.subKey)}
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <h3 className={`font-display text-silver tracking-wide ${isFeature ? 'text-[24px] sm:text-[28px]' : 'text-[19px] sm:text-[21px]'}`}>
                    {t(s.titleKey)}
                  </h3>
                  <p className={`mt-2 text-steel/85 leading-relaxed ${isFeature ? 'text-[15px] max-w-md' : 'text-[13.5px]'}`}>
                    {t(s.bodyKey)}
                  </p>
                  <button
                    type="button"
                    onClick={onIntake}
                    className="mt-4 inline-flex items-center gap-1.5 text-xenon-bright hover:text-silver transition-colors text-[12px] uppercase tracking-[0.18em] font-display font-semibold"
                  >
                    {t('svc.cta')}
                    <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
