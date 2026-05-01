import { Phone, MessageCircle } from 'lucide-react';
import { site } from '../data/site';

type Props = { t: (k: string) => string };

const heroImages = [
  { src: '/recent-nail-set-2026.webp', cls: 'col-span-2 row-span-2' },
  { src: '/handmade-nail-art-2025.webp', cls: '' },
  { src: '/studio-reveal-2022.webp', cls: '' },
  { src: '/training-own-hand-2025.webp', cls: '' },
  { src: '/dark-detail-nail-set-2025.webp', cls: '' },
  { src: '/nail-set-DNYeXYVxhRd-1080x1080.webp', cls: 'hidden md:block' },
  { src: '/nail-work-DSVzsFDjtiR-1080x1080.webp', cls: 'hidden md:block' },
];

export default function Hero({ t }: Props) {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-espresso">
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 auto-rows-fr gap-1 opacity-70">
        {heroImages.map(img => (
          <div key={img.src} className={`relative min-h-36 overflow-hidden ${img.cls}`}>
            <img
              src={img.src}
              alt=""
              className="h-full w-full object-cover"
              fetchPriority={img.src.includes('recent') ? 'high' : undefined}
            />
          </div>
        ))}
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(37,30,35,0.96) 0%, rgba(37,30,35,0.86) 36%, rgba(37,30,35,0.52) 68%, rgba(37,30,35,0.66) 100%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-28 md:pt-32 md:pb-44 lg:pt-40 lg:pb-52">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-gold-soft font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-soft" />
            {t('hero.kicker')}
          </span>

          <h1 className="mt-6 font-serif text-[2.35rem] leading-[1.04] sm:text-6xl md:text-7xl text-cream drop-shadow-[0_1px_10px_rgba(0,0,0,0.55)]">
            {t('hero.title')}
          </h1>

          <p className="mt-6 text-cream/90 text-base md:text-lg leading-relaxed max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]">
            {t('hero.sub')}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-gold">
              <MessageCircle size={16} />
              {t('hero.ctaWa')}
            </a>
            <a
              href={site.phoneHref}
              className="inline-flex items-center justify-center gap-2 border border-cream/30 text-cream px-6 py-3 rounded-full text-sm font-medium tracking-wide hover:bg-cream/10"
              style={{ minHeight: 44 }}
            >
              <Phone size={16} />
              {t('hero.ctaCall')}
            </a>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-[auto_auto_auto] gap-3 sm:gap-5 text-cream/78 text-xs tracking-[0.16em] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            <span>5,0 Google</span>
            <span>12 recensies</span>
            <span>162 Instagram-volgers</span>
          </div>

          <p className="mt-8 script text-cream/95 text-4xl leading-none drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
            Lisette
          </p>
        </div>
      </div>
    </section>
  );
}
