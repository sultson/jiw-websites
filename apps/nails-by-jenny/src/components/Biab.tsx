import { Phone, Check } from 'lucide-react';
import { TEL_URL } from '../data/contact';

type Props = { t: (k: string) => string };

const benefits = [1, 2, 3] as const;

export default function Biab({ t }: Props) {
  return (
    <section id="biab" className="py-20 md:py-28 bg-[#44211E] text-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

          <div>
            <span className="inline-block text-[11px] uppercase tracking-[0.22em] text-gold-soft font-medium">
              {t('biab.kicker')}
            </span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl text-cream leading-[1.1]">
              {t('biab.title')}
            </h2>
            <p className="mt-6 text-cream/70 leading-relaxed">
              {t('biab.body')}
            </p>

            <ul className="mt-8 space-y-3">
              {benefits.map(i => (
                <li key={i} className="flex items-start gap-3 text-cream/80 text-sm leading-relaxed">
                  <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
                    <Check size={10} className="text-gold-soft" />
                  </span>
                  {t(`biab.b${i}`)}
                </li>
              ))}
            </ul>

            <a href={TEL_URL} className="mt-10 btn-gold">
              <Phone size={16} />
              {t('biab.cta')}
            </a>
          </div>

          <div className="relative">
            <div className="aspect-[5/4] md:aspect-[3/4] rounded-2xl overflow-hidden bg-espresso-soft shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
              <img
                src="/biab-roze-amandel.webp"
                alt={t('biab.imgAlt')}
                className="w-full h-full object-cover opacity-90"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
            <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-gold/8 blur-2xl pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}
