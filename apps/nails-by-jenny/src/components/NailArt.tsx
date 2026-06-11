import { MessageCircle, Sparkles } from 'lucide-react';
import { WA_URL } from '../data/contact';

type Props = { t: (k: string) => string };

const points = [1, 2, 3] as const;

export default function NailArt({ t }: Props) {
  return (
    <section id="nailart" className="py-20 md:py-28 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

          <div className="relative order-last md:order-first">
            <div className="aspect-[5/4] md:aspect-[4/3] rounded-2xl overflow-hidden bg-blush-soft shadow-[0_30px_80px_-30px_rgba(68,33,30,0.45)]">
              <img
                src="/nailart-citroen.webp"
                alt={t('art.imgAlt')}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
          </div>

          <div>
            <span className="kicker">{t('art.kicker')}</span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.1]">
              {t('art.title')}
            </h2>
            <p className="mt-6 text-espresso/70 leading-relaxed">
              {t('art.body')}
            </p>

            <ul className="mt-8 space-y-4">
              {points.map(i => (
                <li key={i} className="flex items-start gap-4">
                  <span className="mt-0.5 shrink-0 w-9 h-9 rounded-full bg-blush flex items-center justify-center text-gold">
                    <Sparkles size={15} />
                  </span>
                  <p className="text-espresso/75 leading-relaxed pt-1.5">{t(`art.b${i}`)}</p>
                </li>
              ))}
            </ul>

            <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="mt-10 btn-gold">
              <MessageCircle size={16} />
              {t('art.cta')}
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
