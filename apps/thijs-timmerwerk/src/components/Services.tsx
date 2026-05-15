import { Check } from 'lucide-react';
import { services } from '../data/services';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import Magnetic from './Magnetic';

type Props = { t: (k: string) => string; lang: 'nl' | 'en'; onIntake: () => void };

/** Services section — white background, 3-up grid of 6 image-headed service cards. */
export default function Services({ t, onIntake }: Props) {
  return (
    <section id="diensten" className="section bg-white">
      <div className="shell">
        <SectionHeader
          eyebrow={t('svc.eyebrow')}
          title={t('svc.title')}
          dot="spark"
          intro={t('svc.intro')}
          align="center"
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <Reveal key={svc.id} delay={(i % 3) as 0 | 1 | 2} className="h-full">
                <article className="group card flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-cobalt">
                  {/* image header */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 11' }}>
                    <img
                      src={svc.image}
                      alt={t(svc.labelKey)}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      loading="lazy"
                      decoding="async"
                    />
                    {/* icon chip — top-left of the card */}
                    <span className="absolute left-5 top-5 grid h-12 w-12 place-items-center rounded-xl bg-cobalt text-white shadow-[0_8px_22px_-8px_rgba(12,27,58,0.55)]">
                      <Icon className="h-6 w-6" strokeWidth={2} />
                    </span>
                  </div>

                  {/* body */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="display-md text-ink">{t(svc.labelKey)}</h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">
                      {t(svc.subKey)}
                    </p>

                    <ul className="mt-5 space-y-2.5 border-t border-line-cool pt-5">
                      {svc.bulletKeys.map((bk) => (
                        <li key={bk} className="flex items-start gap-2.5 text-[14px] leading-snug text-ink-soft">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-cobalt" strokeWidth={3} />
                          <span>{t(bk)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={1} className="mt-12 flex justify-center">
          <Magnetic>
            <button type="button" onClick={onIntake} className="btn-cobalt">
              {t('svc.cta')}
            </button>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
