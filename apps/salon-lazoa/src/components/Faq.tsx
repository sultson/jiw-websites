import { useState } from 'react';
import { Plus, Phone, MessageCircle } from 'lucide-react';
import { BrushUnderline, SectionNumber } from './Marks';

type Props = { t: (k: string) => string; onBook: () => void };

export default function Faq({ t, onBook }: Props) {
  const [open, setOpen] = useState<number | null>(0);
  const items = [1, 2, 3, 4, 5, 6];

  return (
    <section id="faq" className="py-28 md:py-40 bg-washi">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-14 md:mb-16">
          <div className="inline-flex items-center gap-4 mb-4 text-[10.5px] uppercase tracking-[0.34em] text-sumi-soft">
            <SectionNumber n={7} />
            <span className="block w-8 h-px bg-sumi/30" />
            <span>{t('faq.kicker')}</span>
            <span className="block w-8 h-px bg-sumi/30" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.06]">
            {t('faq.title')}
          </h2>
          <BrushUnderline className="brush mx-auto mt-5" />
        </div>

        <div className="border-t border-sumi/15">
          {items.map(i => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-sumi/15">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-baseline justify-between gap-6 py-6 text-left group"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-baseline gap-5">
                    <span className="font-display text-[12px] tracking-[0.06em] text-sumi/40 mt-1">
                      0{i}
                    </span>
                    <span className="font-display text-lg md:text-[1.3rem] text-sumi tracking-[-0.005em] group-hover:text-hinoki transition-colors">
                      {t(`faq.q${i}`)}
                    </span>
                  </div>
                  <Plus
                    size={18}
                    className={`shrink-0 text-sumi/55 transition-transform duration-500 mt-1 ${isOpen ? 'rotate-45' : ''}`}
                  />
                </button>
                {isOpen && (
                  i === 1 ? (
                    <div className="pb-7 pl-10 md:pl-12 max-w-[58ch] space-y-4">
                      <p className="text-sumi/75 leading-[1.75]">
                        {t('faq.a1.p1')}
                        <button
                          onClick={onBook}
                          className="underline underline-offset-4 decoration-hinoki/70 hover:text-sumi"
                        >
                          {t('faq.a1.book')}
                        </button>
                        {t('faq.a1.p2')}
                      </p>
                      <div className="flex flex-wrap gap-3 pt-1">
                        <a
                          href="tel:+31683434002"
                          className="inline-flex items-center gap-2 px-4 py-2 border border-sumi/25 text-[11px] uppercase tracking-[0.18em] text-sumi/85 hover:bg-sumi hover:text-shoji transition-colors"
                          style={{ borderRadius: 1 }}
                        >
                          <Phone size={12} />
                          06 83434002
                        </a>
                        <a
                          href="https://wa.me/31683434002"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 border border-sumi/25 text-[11px] uppercase tracking-[0.18em] text-sumi/85 hover:bg-sumi hover:text-shoji transition-colors"
                          style={{ borderRadius: 1 }}
                        >
                          <MessageCircle size={12} />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="pb-7 pl-10 md:pl-12 max-w-[58ch] text-sumi/75 leading-[1.75]">
                      {t(`faq.a${i}`)}
                    </p>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
