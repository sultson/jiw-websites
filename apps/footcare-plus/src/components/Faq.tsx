import { useState } from 'react';
import { Plus, Phone, MessageCircle } from 'lucide-react';

type Props = { t: (k: string) => string };

const PHONE_TEL = 'tel:+31648490004';
const PHONE_WA  = 'https://wa.me/31648490004';

export default function Faq({ t }: Props) {
  const [open, setOpen] = useState<number | null>(0);
  const items = [1, 2, 3, 4, 5, 6, 7];

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
                  <span className="font-serif text-lg md:text-xl text-ink">
                    {t(`faq.q${i}`)}
                  </span>
                  <Plus
                    size={20}
                    className={`shrink-0 text-ink/60 transition-transform ${isOpen ? 'rotate-45' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="pb-6">
                    <p className="text-ink/75 leading-relaxed max-w-prose">
                      {t(`faq.a${i}`)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <a href={PHONE_TEL} className="btn-gold">
            <Phone size={16} />
            Bel 06 48490004
          </a>
          <a
            href={PHONE_WA}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
