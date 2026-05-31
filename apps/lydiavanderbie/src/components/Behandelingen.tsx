import { ArrowRight, Info } from 'lucide-react';
import Reveal from './Reveal';
import SectionHeader from './SectionHeader';
import { behandelingGroups } from '../data/behandelingen';
import type { Lang } from '../translations';

type Props = { t: (k: string) => string; lang: Lang; onOpen: (subject?: string) => void };

export default function Behandelingen({ t, lang, onOpen }: Props) {
  return (
    <section id="behandelingen" className="section bg-canvas">
      <div className="shell-wide">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <SectionHeader eyebrow={t('beh.eyebrow')} title={t('beh.title')} intro={t('beh.intro')} />
          <Reveal>
            <button type="button" onClick={() => onOpen('behandeling')} className="btn-terra shrink-0">
              {t('beh.ctaBook')}
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </Reveal>
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-6">
          {behandelingGroups.map((g, i) => (
            <Reveal key={g.id} delay={(i % 2) as 0 | 1}>
              <article className="card h-full overflow-hidden flex flex-col">
                <div className="relative h-44 sm:h-52 overflow-hidden">
                  <img src={g.image} alt={g.title[lang]} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-terra-ink/75 via-terra-ink/10 to-transparent" />
                  <h3 className="absolute bottom-4 left-5 right-5 font-display text-[26px] text-cream leading-tight">
                    {g.title[lang]}
                  </h3>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <p className="text-[15px] leading-relaxed text-ink-soft">{g.blurb[lang]}</p>

                  <ul className="mt-5 divide-y divide-line">
                    {g.items.map((item) => (
                      <li key={item.name} className="py-3 flex items-baseline justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-[15px] font-semibold text-ink">{item.name}</div>
                          <div className="text-[13px] text-ink-mute leading-snug">{item.desc[lang]}</div>
                        </div>
                        <div className="shrink-0 text-[14px] font-bold text-terra tnum whitespace-nowrap">
                          {item.price ? item.price[lang] : t('beh.priceVaries')}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 flex items-start gap-2.5 text-[13px] text-ink-mute max-w-2xl">
          <Info size={15} className="mt-0.5 shrink-0" />
          <p>{t('beh.disclaimer')}</p>
        </div>
      </div>
    </section>
  );
}
