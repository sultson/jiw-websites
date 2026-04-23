import { useState } from 'react';
import { Plus, Phone, MessageCircle } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

export default function Faq({ t, onBook }: Props) {
  const [open, setOpen] = useState<number | null>(0);
  const items = [1, 2, 3, 4, 5];

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">{t('faq.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('faq.title')}</h2>
        </div>

        <div className="space-y-2">
          {items.map(i => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-espresso/10">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg md:text-xl text-espresso">{t(`faq.q${i}`)}</span>
                  <Plus
                    size={20}
                    className={`shrink-0 text-espresso/60 transition-transform ${isOpen ? 'rotate-45' : ''}`}
                  />
                </button>
                {isOpen && (
                  i === 2 ? (
                    <div className="pb-5 text-espresso/70 leading-relaxed">
                      <p>
                        {t('faq.a2.p1')}
                        <button
                          onClick={onBook}
                          className="underline underline-offset-2 decoration-gold/60 hover:text-espresso transition-colors"
                        >
                          {t('faq.a2.book')}
                        </button>
                        {t('faq.a2.p2')}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a
                          href="tel:+31638502903"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blush text-espresso text-sm hover:bg-gold hover:text-cream transition-colors"
                        >
                          <Phone size={14} />
                          {t('faq.a2.call')}
                        </a>
                        <a
                          href="https://wa.me/31638502903"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blush text-espresso text-sm hover:bg-gold hover:text-cream transition-colors"
                        >
                          <MessageCircle size={14} />
                          {t('faq.a2.whatsapp')}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="pb-5 text-espresso/70 leading-relaxed">{t(`faq.a${i}`)}</p>
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
