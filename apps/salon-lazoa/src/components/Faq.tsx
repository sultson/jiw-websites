import { useState } from 'react';
import { Plus, Phone, MessageCircle } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

export default function Faq({ t, onBook }: Props) {
  const [open, setOpen] = useState<number | null>(0);
  const items = [1, 2, 3, 4, 5, 6];

  return (
    <section id="faq" className="py-24 md:py-28 bg-paper-soft/60">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">{t('faq.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('faq.title')}</h2>
        </div>

        <div className="space-y-1">
          {items.map(i => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-ink/10">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg md:text-xl text-ink">{t(`faq.q${i}`)}</span>
                  <Plus
                    size={20}
                    className={`shrink-0 text-ink/60 transition-transform ${isOpen ? 'rotate-45' : ''}`}
                  />
                </button>
                {isOpen && (
                  i === 1 ? (
                    <div className="pb-6 space-y-4">
                      <p className="text-ink/75 leading-relaxed">
                        {t('faq.a1.p1')}
                        <button
                          onClick={onBook}
                          className="underline underline-offset-2 decoration-champagne/60 hover:text-ink"
                        >
                          {t('faq.a1.book')}
                        </button>
                        {t('faq.a1.p2')}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <a
                          href="tel:+31683434002"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ink/20 text-sm text-ink/80 hover:bg-ink hover:text-paper transition-colors"
                        >
                          <Phone size={14} />
                          06 83434002
                        </a>
                        <a
                          href="https://wa.me/31683434002"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ink/20 text-sm text-ink/80 hover:bg-ink hover:text-paper transition-colors"
                        >
                          <MessageCircle size={14} />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="pb-5 text-ink/75 leading-relaxed">{t(`faq.a${i}`)}</p>
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
