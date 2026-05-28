import { ArrowRight, MessageCircle } from 'lucide-react';
import { contact } from '../data/contact';

type Props = { t: (k: string) => string; onBook: () => void };

const tiles = [
  { src: '/hero-01.webp', alt: 'Manicure close-up',      cls: 'row-span-2' },
  { src: '/hero-02.webp', alt: 'Powder brows resultaat', cls: '' },
  { src: '/hero-03.webp', alt: 'Haar kleur en styling',  cls: '' },
  { src: '/hero-04.webp', alt: 'Pedicure resultaat',     cls: 'row-span-2' },
  { src: '/hero-05.webp', alt: 'Schoonheidsbehandeling', cls: '' },
  { src: '/hero-06.webp', alt: 'Nail art',               cls: '' },
];

export default function Hero({ t, onBook }: Props) {
  return (
    <section id="top" className="relative overflow-hidden bg-pearl">
      <div className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-blush/40 via-blush-soft/30 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-3 md:pt-12 lg:pt-20 pb-14 md:pb-24">
        <div className="grid lg:grid-cols-12 gap-0 md:gap-8 lg:gap-12 items-center">
          {/* Collage */}
          <div className="lg:col-span-6 order-1 lg:order-2 relative">
            <div className="grid grid-cols-3 grid-rows-4 gap-2 md:gap-3 aspect-[3/4] min-h-[480px] max-h-[640px] lg:aspect-auto lg:h-[640px] lg:max-h-none lg:min-h-0 lg:max-w-[560px] lg:ml-auto">
              {tiles.map((tile, i) => (
                <div
                  key={tile.src}
                  className={`relative overflow-hidden rounded-xl md:rounded-2xl bg-blush ${tile.cls}`}
                  style={{
                    transform: i % 2 === 0 ? 'translateY(0)' : 'translateY(8px)',
                  }}
                >
                  <img
                    src={tile.src}
                    alt={tile.alt}
                    loading={i < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={i === 0 ? 'high' : 'auto'}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            {/* Fade so the copy block can overlap the bottom of the grid on mobile */}
            <div className="lg:hidden pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-pearl/75 to-pearl" />
          </div>

          {/* Copy — pulled up over the bottom of the collage on mobile */}
          <div className="lg:col-span-6 order-2 lg:order-1 relative z-10 -mt-20 md:-mt-10 lg:mt-0">
            <span className="inline-block text-[11px] uppercase tracking-[0.28em] text-rose font-medium">
              {t('hero.kicker')}
            </span>
            <h1 className="mt-3 md:mt-5 font-serif text-[2.5rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-[4.25rem] text-ink whitespace-pre-line drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)] lg:drop-shadow-none">
              {t('hero.title')}
            </h1>
            <p className="mt-4 md:mt-6 text-ink/70 text-base md:text-lg leading-relaxed max-w-xl">
              {t('hero.sub')}
            </p>

            <div className="mt-6 md:mt-9 flex items-center gap-3">
              <button onClick={onBook} className="btn-rose">
                {t('hero.ctaBook')}
                <ArrowRight size={16} />
              </button>
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="shrink-0 w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_8px_22px_-8px_rgba(37,211,102,0.55)] hover:bg-[#1DA851] transition-colors"
              >
                <MessageCircle size={20} fill="currentColor" strokeWidth={0} />
              </a>
            </div>

            <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-4 text-ink/55 text-xs tracking-widest uppercase">
              <span>Nagels</span>
              <span className="h-px w-6 bg-ink/20" />
              <span>Brows · PMU</span>
              <span className="h-px w-6 bg-ink/20" />
              <span>Haar</span>
              <span className="h-px w-6 bg-ink/20" />
              <span>Beauty</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
