import { ArrowUpRight } from 'lucide-react';
import { serviceCategories } from '../data/services';
import type { Lang } from '../translations';
import { BrushUnderline, SectionNumber } from './Marks';

type Props = { lang: Lang; t: (k: string) => string; onBook: () => void };

export default function Services({ t, onBook }: Props) {
  return (
    <section id="behandelingen" className="py-28 md:py-40 bg-shoji">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-4 mb-4 text-[10.5px] uppercase tracking-[0.34em] text-sumi-soft">
            <SectionNumber n={3} />
            <span className="block w-8 h-px bg-sumi/30" />
            <span>{t('services.kicker')}</span>
            <span className="block w-8 h-px bg-sumi/30" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.06]">
            {t('services.title')}
          </h2>
          <BrushUnderline className="brush mx-auto mt-5" />
          <p className="mt-5 max-w-xl mx-auto text-sumi/65 text-[14.5px] leading-relaxed">
            {t('services.sub')}
          </p>
        </div>

        {/* Treatment menu — printed-menu cadence */}
        <div className="space-y-16 md:space-y-20">
          {serviceCategories.map((cat, ci) => (
            <div key={cat.id}>
              {/* Category heading row */}
              <div className="flex items-baseline justify-between gap-6 mb-7">
                <div className="flex items-baseline gap-5">
                  <span className="font-display text-[12px] tracking-[0.06em] text-sumi/45">
                    0{ci + 1}
                  </span>
                  <h3 className="font-display text-3xl md:text-4xl text-sumi tracking-[-0.01em]">
                    {t(cat.titleKey)}
                  </h3>
                </div>
                <span className="text-[10.5px] uppercase tracking-[0.28em] text-sumi/50 whitespace-nowrap">
                  {cat.services.length} {cat.services.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="border-t border-sumi/20">
                {cat.services.map(s => (
                  <div
                    key={s.id}
                    className="border-b border-sumi/10 py-5 md:py-6 flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 group hover:bg-washi/60 transition-colors px-1 md:px-2"
                  >
                    <div className="md:w-[44%] shrink-0">
                      <p className="font-display text-lg md:text-[1.35rem] leading-snug text-sumi tracking-[-0.005em]">
                        {t(s.nameKey)}
                      </p>
                    </div>
                    <p className="text-[13.5px] md:text-[14px] text-sumi/65 leading-[1.7] md:flex-1">
                      {t(s.descKey)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note + CTA */}
        <div className="mt-16 md:mt-24 flex flex-col items-center gap-6 text-center">
          <p className="text-[13.5px] text-sumi/60 max-w-md leading-relaxed">
            {t('services.priceLine')}
          </p>
          <button onClick={onBook} className="btn-sumi group">
            {t('nav.book')}
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
