import { Sparkles, ArrowRight } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

export default function Biab({ t, onBook }: Props) {
  return (
    <section id="biab" className="relative py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-emerald text-cream p-8 md:p-14 lg:p-20">
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.8) 0.5px, transparent 0.6px), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.5) 0.5px, transparent 0.6px)',
              backgroundSize: '24px 24px, 32px 32px',
            }}
          />
          <div className="relative grid md:grid-cols-5 gap-10 items-center">
            <div className="md:col-span-3">
              <span className="kicker !text-gold-soft">{t('biab.kicker')}</span>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-cream">
                {t('biab.title')}
              </h2>
              <p className="mt-6 text-cream/80 max-w-xl leading-relaxed">{t('biab.body')}</p>
              <button
                onClick={onBook}
                className="mt-8 inline-flex items-center gap-2 bg-gold text-espresso px-6 py-3 rounded-full text-sm font-medium tracking-wide hover:bg-gold-soft"
                style={{ minHeight: 44 }}
              >
                {t('biab.cta')}
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="md:col-span-2 flex md:justify-end">
              <div className="w-36 h-36 md:w-56 md:h-56 rounded-full bg-emerald-soft/30 flex items-center justify-center">
                <Sparkles size={80} className="text-gold-soft md:w-28 md:h-28" strokeWidth={1} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
