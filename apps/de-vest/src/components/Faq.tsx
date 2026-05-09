import { useState } from 'react';
import { Plus } from 'lucide-react';
import { faqKeys, type FaqKey } from '../data/faq';

type Props = { t: (key: string) => string };

export default function Faq({ t }: Props) {
  const [open, setOpen] = useState<FaqKey | null>(null);

  return (
    <section className="bg-paper py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-x-12 gap-y-10">
        <header className="lg:col-span-4">
          <span className="kicker">{t('faq.kicker')}</span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display leading-[1.08] max-w-[18ch]">
            {t('faq.title')}
          </h2>
        </header>
        <ul className="lg:col-span-8 border-t border-ink/12">
          {faqKeys.map((k, i) => {
            const isOpen = open === k;
            return (
              <li key={k} className="border-b border-ink/12">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : k)}
                  className="w-full flex items-start gap-5 sm:gap-6 py-5 sm:py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-mute pt-1.5 hidden sm:inline">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 font-display text-lg sm:text-xl text-ink leading-snug">
                    {t(`${k}.q`)}
                  </span>
                  <Plus
                    size={20}
                    className={`mt-1 flex-shrink-0 text-ink-mute transition-transform duration-300 ${
                      isOpen ? 'rotate-45 text-orange-deep' : ''
                    }`}
                    aria-hidden
                  />
                </button>
                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr', opacity: isOpen ? 1 : 0 }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 sm:pb-8 sm:pl-12 text-base text-ink-soft leading-relaxed max-w-[64ch]">
                      {t(`${k}.a`)}
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
