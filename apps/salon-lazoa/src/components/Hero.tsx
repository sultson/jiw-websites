import { ArrowUpRight } from 'lucide-react';
import { BrushUnderline, Enso } from './Marks';

type Props = { t: (k: string) => string; onBook: () => void };

export default function Hero({ t, onBook }: Props) {
  const title = t('hero.title');

  return (
    <section
      id="top"
      className="relative bg-shoji overflow-hidden"
    >
      {/* Top hairline grid: vertical rules anchor the asymmetry */}
      <div aria-hidden className="absolute inset-y-0 left-0 right-0 pointer-events-none">
        <div className="h-full max-w-7xl mx-auto relative">
          <span className="hidden md:block absolute top-0 bottom-0 left-[8.333%] w-px bg-sumi/8" />
          <span className="hidden md:block absolute top-0 bottom-0 right-[8.333%] w-px bg-sumi/8" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-16 md:pt-24 lg:pt-28 pb-24 md:pb-32">
        <div className="grid md:grid-cols-12 gap-10 md:gap-12 lg:gap-16 items-end">
          {/* LEFT — typography column */}
          <div className="md:col-span-7 order-2 md:order-1 relative">
            {/* Kicker stacked with hairline */}
            <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.34em] text-sumi-soft rise rise-1">
              <span className="block w-10 h-px bg-sumi-soft" />
              <span>{t('hero.kicker')}</span>
            </div>

            <h1 className="mt-8 md:mt-10 font-display text-[2.6rem] leading-[1.02] sm:text-6xl md:text-[5.2rem] lg:text-[6rem] text-sumi tracking-[-0.012em] whitespace-pre-line rise rise-2">
              {title}
            </h1>

            <BrushUnderline className="brush mt-5 rise rise-3" />

            <p className="mt-7 max-w-[44ch] text-sumi-soft text-base md:text-lg leading-[1.7] rise rise-3">
              {t('hero.sub')}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4 rise rise-4">
              <button onClick={onBook} className="btn-sumi group">
                {t('hero.ctaBook')}
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <a href="#werk" className="btn-line">
                {t('hero.ctaSee')}
              </a>
            </div>

            {/* Trust hairline row */}
            <div className="mt-14 md:mt-20 flex flex-wrap items-center gap-x-6 gap-y-3 text-[10.5px] uppercase tracking-[0.3em] text-sumi/65 rise rise-4">
              <span className="inline-flex items-center gap-2">
                <span className="block w-1 h-1 bg-hinoki rounded-full" />
                5,0 ★ Google
              </span>
              <span className="block w-8 h-px bg-sumi/15" />
              <span>Urban Nails Diamond</span>
              <span className="block w-8 h-px bg-sumi/15" />
              <span>#LASHTAG</span>
            </div>
          </div>

          {/* RIGHT — single editorial image, paper-mounted, slightly offset */}
          <div className="md:col-span-5 order-1 md:order-2 relative">
            <div className="relative ml-auto w-full max-w-[440px]">
              {/* Bengara seal — quiet, rotated, top-left */}
              <div
                className="absolute -top-3 -left-3 z-10 sumi-seal"
                style={{ fontFamily: 'var(--font-display)' }}
                aria-hidden
              >
                LZ
              </div>

              {/* Enso mark — subtle, top-right of image */}
              <Enso className="absolute -top-10 right-2 md:right-6 w-16 h-16 text-sumi/25 rise rise-2" />

              <figure className="paper-mount rise rise-2">
                <div className="overflow-hidden">
                  <img
                    src="/editorial-urbannails-bottle.webp"
                    alt="Hand met french manicure en Urban Nails gelpolish"
                    fetchPriority="high"
                    className="w-full aspect-[4/5] object-cover"
                  />
                </div>
              </figure>

              {/* Vertical text rail down right edge */}
              <div
                aria-hidden
                className="hidden md:flex absolute -right-10 lg:-right-12 top-6 bottom-6 items-center"
              >
                <span
                  className="text-[10px] uppercase tracking-[0.42em] text-sumi/55 whitespace-nowrap"
                  style={{ writingMode: 'vertical-rl' }}
                >
                  Studio · Everbest 64 · Beek en Donk
                </span>
              </div>

              {/* Caption hairline label — sumi/year tag */}
              <figcaption className="mt-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-sumi/55">
                <span className="block w-5 h-px bg-sumi/40" />
                <span>Urban Nails Gel Polish</span>
              </figcaption>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
