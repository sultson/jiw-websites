import { Check, X, MessageCircle } from 'lucide-react';

type Props = { t: (k: string) => string };

const rows = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const benefits = [1, 2, 3, 4, 5] as const;

export default function Technique({ t }: Props) {
  return (
    <section id="techniek" className="py-20 md:py-28 bg-blush-soft/50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12 md:mb-16">
          <span className="kicker">{t('technique.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.1] max-w-3xl mx-auto">
            {t('technique.title')}
          </h2>
          <p className="mt-5 text-espresso/70 leading-relaxed max-w-2xl mx-auto">
            {t('technique.body')}
          </p>
        </div>

        <div className="card overflow-hidden mb-12">
          <div className="px-5 md:px-8 py-5 border-b border-espresso/8">
            <p className="text-sm font-medium text-espresso">{t('technique.vs')}</p>
          </div>
          <div className="grid grid-cols-2 text-xs md:text-sm">
            <div className="px-4 md:px-8 py-3 bg-gold/10 text-espresso font-medium border-r border-espresso/8">
              {t('technique.vs.ru')}
            </div>
            <div className="px-4 md:px-8 py-3 text-espresso/60 font-medium">
              {t('technique.vs.cl')}
            </div>
            {rows.map(i => (
              <div key={i} className="contents">
                <div className="px-4 md:px-8 py-3 border-t border-espresso/5 border-r border-espresso/8 text-espresso/85 flex gap-2 items-start">
                  <Check size={14} className="text-gold mt-0.5 shrink-0" />
                  <span>{t(`technique.vs.r${i}a`)}</span>
                </div>
                <div className="px-4 md:px-8 py-3 border-t border-espresso/5 text-espresso/55 flex gap-2 items-start">
                  <X size={14} className="text-espresso/40 mt-0.5 shrink-0" />
                  <span>{t(`technique.vs.r${i}b`)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <h3 className="font-serif text-2xl md:text-3xl mb-6 text-center">{t('technique.benefits')}</h3>
          <ul className="space-y-3">
            {benefits.map(i => (
              <li key={i} className="flex gap-3 items-start text-espresso/80">
                <span className="shrink-0 w-7 h-7 rounded-full bg-blush flex items-center justify-center text-gold mt-0.5">
                  <Check size={14} />
                </span>
                <span className="leading-relaxed">{t(`technique.b${i}`)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 text-center">
            <a
              href="https://wa.me/31616770738"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold inline-flex"
            >
              <MessageCircle size={16} />
              {t('technique.cta')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
