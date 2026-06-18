import { useState } from 'react';
import { Plus } from 'lucide-react';

type Props = { t: (k: string) => string };

const KEYS = ['faq.1', 'faq.2', 'faq.3', 'faq.4', 'faq.5'] as const;

export default function Faq({ t }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="scroll-mt-20">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <div className="text-center max-w-xl mx-auto reveal">
          <span className="kicker kicker-center justify-center">{t('faq.kicker')}</span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">{t('faq.title')}</h2>
        </div>

        <div className="mt-12 divide-y divide-wine/10">
          {KEYS.map((k, i) => {
            const isOpen = open === i;
            return (
              <div key={k} className="reveal">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg md:text-xl text-ink">{t(`${k}.q`)}</span>
                  <span
                    className={`grid place-items-center w-8 h-8 rounded-full bg-petal text-wine shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  >
                    <Plus size={17} />
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 pr-12 text-ink-soft leading-relaxed">{t(`${k}.a`)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
