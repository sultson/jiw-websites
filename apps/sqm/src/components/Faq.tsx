import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { faqItems } from '../data/faq';

type Props = { t: (k: string) => string };

export default function Faq({ t }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-cream-soft border-t border-charcoal/8 relative">
      <div className="absolute inset-0 bg-blueprint opacity-20 pointer-events-none" aria-hidden />
      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-5">
            <span className="kicker">{t('faq.kicker')}</span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.05]">
              {t('faq.title')}
            </h2>
            <div className="mt-8 hidden lg:flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-charcoal/55 font-semibold">
              <span className="inline-block w-8 h-px bg-charcoal/30" />
              <span className="font-mono">{String(faqItems.length).padStart(2, '0')} questions</span>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="border-t border-charcoal/15">
              {faqItems.map((f, i) => {
                const isOpen = open === i;
                return (
                  <li key={f.qKey} className="border-b border-charcoal/15">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full flex items-start gap-5 py-6 text-left group"
                      aria-expanded={isOpen}
                    >
                      <span className="font-mono text-[11px] tracking-[0.18em] text-orange font-semibold mt-1.5 shrink-0 w-7">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 text-base sm:text-lg font-semibold text-charcoal-ink leading-snug group-hover:text-orange transition-colors">
                        {t(f.qKey)}
                      </span>
                      <span className={`shrink-0 mt-0.5 w-8 h-8 flex items-center justify-center rounded-sm transition-colors ${
                        isOpen ? 'bg-orange text-cream' : 'bg-charcoal-ink text-cream group-hover:bg-orange'
                      }`}>
                        {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="pb-7 pl-12 pr-10 text-charcoal/75 leading-relaxed">{t(f.aKey)}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
