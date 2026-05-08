import { useState } from 'react';
import { Plus } from 'lucide-react';
import { faqKeys } from '../data/faq';

type Props = { t: (k: string) => string };

export default function Faq({ t }: Props) {
  const [open, setOpen] = useState<string | null>(faqKeys[0]);

  return (
    <section id="faq" className="py-20 sm:py-24 lg:py-32 bg-paper-deep border-y border-ink/8">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <span className="kicker">{t('faq.kicker')}</span>
            <h2 className="mt-4 font-bold tracking-[-0.025em] leading-[1.05] max-w-2xl"
                style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
              {t('faq.title')}
            </h2>
          </div>
        </div>

        <ul className="mt-12 lg:mt-16">
          {faqKeys.map((k) => {
            const isOpen = open === k;
            return (
              <li key={k} className="border-t border-ink/15 last:border-b last:border-b-ink/15">
                <button
                  type="button"
                  className="w-full py-6 lg:py-7 flex items-start justify-between gap-6 text-left group"
                  onClick={() => setOpen(isOpen ? null : k)}
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-bold tracking-[-0.02em] leading-tight pr-4 text-ink group-hover:text-ochre-deep transition-colors"
                        style={{ fontSize: 'clamp(20px, 2.4vw, 28px)' }}>
                    {t(`faq.q${k}`)}
                  </span>
                  <Plus
                    size={22}
                    strokeWidth={2}
                    className={`shrink-0 mt-2 text-ink/55 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'rotate-45 text-ochre-deep' : ''}`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-7' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p className="text-ink/75 leading-relaxed text-base lg:text-lg max-w-3xl">
                      {t(`faq.a${k}`)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
