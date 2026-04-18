import { Check, ArrowRight } from 'lucide-react';

type Props = { t: (k: string) => string };

const benefitKeys = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'] as const;

export default function Kobido({ t }: Props) {
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

            <a
              href="https://anart-studio.salonized.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 bg-gold text-cream px-6 py-3 rounded-full text-sm font-medium tracking-wide hover:opacity-90"
              style={{ minHeight: 44 }}
            >
              {t('kobido.cta')}
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Video/foto placeholder */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden aspect-[4/5]">
              <img
                src="/massage_kobido_gezichtsbehandeling.webp"
                alt="Kobido gezichtsbehandeling bij AnArt Studio"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              {/* Vervang de img hierboven door een <video> of Facebook-embed zodra je de video-link hebt */}
            </div>
            {/* Decoratieve achtergrondcirkel */}
            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-gold/10 -z-0 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
