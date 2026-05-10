import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

type Props = { t: (k: string) => string };

const ids = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const;

export default function Faq({ t }: Props) {
  const [open, setOpen] = useState<number>(0);
  return (
    <section className="bg-paper-soft section-pad-lg">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14 md:mb-16">
          <div className="lg:col-span-7">
            <span className="roman">VII.</span>
            <span className="kicker block mt-3">{t('faq.kicker')}</span>
            <h2 className="mt-5 text-[36px] md:text-[52px] leading-[1.02]">
              {t('faq.title')}
            </h2>
          </div>
        </div>

        <div className="border-t border-ink-line">
          {ids.map((id, i) => {
            const isOpen = open === i;
            return (
              <div key={id} className="border-b border-ink-line">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full py-5 md:py-7 flex items-baseline gap-6 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="roman shrink-0 w-10">
                    {['i.', 'ii.', 'iii.', 'iv.', 'v.', 'vi.'][i]}
                  </span>
                  <span className="flex-1 font-display text-[20px] md:text-[24px] leading-snug text-ink">
                    {t(`faq.${id}`)}
                  </span>
                  <span className="shrink-0 text-ink-mute group-hover:text-ink transition-colors">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pl-16 pr-6 pb-7 max-w-[64ch] text-ink-soft leading-relaxed">
                      {t(`faq.a${i + 1}`)}
                    </p>
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
