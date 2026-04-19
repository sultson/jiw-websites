import { Check, ArrowRight } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

const benefitKeys = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'] as const;

export default function Kobido({ t, onBook }: Props) {
  return (
    <section id="kobido" className="py-20 md:py-28 bg-espresso text-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Tekst */}
          <div>
            <span className="inline-block text-[11px] uppercase tracking-[0.22em] text-gold-soft font-medium">
              {t('kobido.kicker')}
            </span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl text-cream leading-[1.1]">
              {t('kobido.title')}
            </h2>
            <p className="mt-6 text-cream/75 leading-relaxed max-w-prose">
              {t('kobido.body')}
            </p>

            <p className="mt-8 text-sm font-medium text-gold-soft uppercase tracking-wider">
              {t('kobido.benefits')}
            </p>
            <ul className="mt-4 space-y-3">
              {benefitKeys.map(key => (
                <li key={key} className="flex items-start gap-3 text-cream/80 text-sm leading-relaxed">
                  <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-gold/30 flex items-center justify-center">
                    <Check size={12} className="text-gold-soft" />
                  </span>
                  {t(`kobido.${key}`)}
                </li>
              ))}
            </ul>

            <button
              onClick={onBook}
              className="mt-10 inline-flex items-center gap-2 bg-gold text-cream px-6 py-3 rounded-full text-sm font-medium tracking-wide hover:opacity-90"
              style={{ minHeight: 44 }}
            >
              {t('kobido.cta')}
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Video/foto placeholder */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden aspect-[9/16] md:aspect-[4/5] bg-espresso/40">
              <iframe
                src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fv%2F1AwTLWCQem%2F&show_text=false&mute=0"
                className="w-full h-full"
                style={{ border: 0 }}
                scrolling="no"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="Kobido massage AnArt Studio"
              />
            </div>
            {/* Decoratieve achtergrondcirkel */}
            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-gold/10 -z-0 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
