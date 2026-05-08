import { Check, ArrowRight } from 'lucide-react';
import { services } from '../data/services';

type Props = { t: (k: string) => string; onIntake: () => void };

export default function Services({ t, onIntake }: Props) {
  return (
    <section id="diensten" className="bg-cream relative">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-8 mb-12 lg:mb-16">
          <div className="lg:col-span-5">
            <span className="kicker">{t('svc.kicker')}</span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.05]">
              {t('svc.title')}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 self-end">
            <p className="text-base sm:text-lg text-charcoal/75 leading-relaxed">{t('svc.intro')}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-charcoal/10">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            const num = String(i + 1).padStart(2, '0');
            return (
              <div key={svc.id} className="group bg-cream-soft p-7 sm:p-9 flex flex-col relative overflow-hidden hover:bg-cream transition-colors">
                {/* subtle corner accent */}
                <div className="absolute top-0 left-0 w-10 h-[2px] bg-orange/0 group-hover:bg-orange transition-colors" aria-hidden />

                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 flex items-center justify-center bg-charcoal-ink text-orange-soft rounded-sm group-hover:bg-orange group-hover:text-cream transition-colors">
                    <Icon size={26} strokeWidth={1.5} />
                  </div>
                  <span className="font-mono text-[11px] tracking-[0.22em] text-charcoal/40">
                    {num}
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold tracking-tight text-charcoal-ink">
                  {t(svc.labelKey)}
                </h3>
                <p className="mt-2 text-sm font-medium text-charcoal/70">{t(svc.subKey)}</p>

                <ul className="mt-5 space-y-2.5 flex-1">
                  {svc.bulletKeys.map((bk) => (
                    <li key={bk} className="flex items-start gap-2.5 text-sm leading-relaxed text-charcoal/85">
                      <Check size={15} className="mt-0.5 text-orange shrink-0" strokeWidth={2.5} />
                      <span>{t(bk)}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={onIntake}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-charcoal-ink hover:text-orange transition-colors self-start group/btn"
                >
                  {t('hero.cta')}
                  <ArrowRight size={14} strokeWidth={2.5} className="transition-transform group-hover/btn:translate-x-0.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
