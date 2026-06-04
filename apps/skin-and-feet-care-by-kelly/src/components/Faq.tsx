import { useState } from 'react';
import { Plus, Phone, MessageCircle } from 'lucide-react';
import { site } from '../data/site';

type Props = { t: (k: string) => string; onBook: () => void };

export default function Faq({ t, onBook }: Props) {
  const [open, setOpen] = useState<number | null>(0);
  const items = [1, 2, 3, 4, 5];
  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(t('wa.text'))}`;

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
                  i === 2 ? (
                    <div className="pb-6 space-y-4">
                      <p className="text-ink/70 leading-relaxed">
                        {t('faq.a2.p1')}
                        <button
                          onClick={onBook}
                          className="underline underline-offset-2 decoration-plum/60 hover:text-ink transition-colors"
                        >
                          {t('faq.a2.book')}
                        </button>
                        {t('faq.a2.p2')}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <a
                          href={`tel:${site.phoneE164}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ink/20 text-sm text-ink/80 hover:bg-ink hover:text-cream transition-colors"
                        >
                          <Phone size={14} />
                          {t('faq.a2.call')}
                        </a>
                        <a
                          href={waHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ink/20 text-sm text-ink/80 hover:bg-ink hover:text-cream transition-colors"
                        >
                          <MessageCircle size={14} />
                          {t('faq.a2.whatsapp')}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="pb-5 text-ink/70 leading-relaxed">{t(`faq.a${i}`)}</p>
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
