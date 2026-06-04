import { ArrowRight } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

export default function Hero({ t, onBook }: Props) {
  const title = t('hero.title');

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-ink">
        <img
          src="/hero.webp"
          alt="Kelly geeft een gezichtsbehandeling in haar salon"
          className="w-full h-full object-cover object-[50%_30%] opacity-55"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/55 to-ink/90" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-28 md:pt-32 md:pb-44 lg:pt-40 lg:pb-52">
        <div className="max-w-2xl">
          <span className="inline-block text-[11px] uppercase tracking-[0.24em] text-plum-soft font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
            {t('hero.kicker')}
          </span>
          <h1 className="mt-5 font-serif text-[2.5rem] leading-[1.05] sm:text-6xl md:text-7xl text-cream drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] whitespace-pre-line">
            {title}
          </h1>
          <p className="mt-6 text-cream/90 text-base md:text-lg leading-relaxed max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            {t('hero.sub')}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button onClick={onBook} className="btn-plum">
              {t('hero.ctaBook')}
              <ArrowRight size={16} />
            </button>
            <a href="#behandelingen" className="btn-outline !border-cream/30 !text-cream hover:!bg-cream/10 hover:!border-cream/50">
              {t('hero.ctaServices')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
