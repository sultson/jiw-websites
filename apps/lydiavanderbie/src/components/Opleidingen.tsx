import { Check, ArrowRight } from 'lucide-react';
import Reveal from './Reveal';
import SectionHeader from './SectionHeader';
import { opleidingen } from '../data/opleidingen';
import type { Lang } from '../translations';

type Props = { t: (k: string) => string; lang: Lang; onOpen: (subject?: string) => void };

export default function Opleidingen({ t, lang, onOpen }: Props) {
  return (
    <section id="opleidingen" className="section bg-sand relative overflow-hidden">
      <div className="absolute inset-0 wash-sage pointer-events-none" aria-hidden />
      <div className="shell-wide relative">
        <SectionHeader eyebrow={t('op.eyebrow')} title={t('op.title')} intro={t('op.intro')} />

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {opleidingen.map((op, i) => (
            <Reveal key={op.id} delay={(i % 3) as 0 | 1 | 2}>
              <article className="card h-full flex flex-col overflow-hidden group hover:border-terra/40 hover:shadow-[0_28px_60px_-40px_rgba(58,33,24,0.5)] transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={op.image}
                    alt={op.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 chip chip-cream backdrop-blur-sm">{op.price[lang]}</span>
                </div>

                <div className="flex flex-col flex-1 p-6">
                  <h3 className="display-md text-ink leading-tight">{op.name}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{op.desc[lang]}</p>

                  <ul className="mt-5 space-y-2">
                    {op.facts[lang].map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[14px] text-ink-soft">
                        <Check size={16} className="mt-0.5 shrink-0 text-sage-deep" strokeWidth={2.4} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => onOpen('opleiding')}
                    className="mt-6 pt-5 border-t border-line inline-flex items-center gap-1.5 text-[14px] font-bold text-terra hover:gap-2.5 transition-all"
                  >
                    {t('op.cta')}
                    <ArrowRight size={15} strokeWidth={2.5} />
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
