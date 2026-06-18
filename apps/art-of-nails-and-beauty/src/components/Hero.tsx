import { Calendar, MessageCircle, Star, MapPin } from 'lucide-react';
import { site } from '../data/site';

type Props = { t: (k: string) => string; onBook: () => void };

export default function Hero({ t, onBook }: Props) {
  const lines = t('hero.title').split('\n');

  return (
    <section id="top" className="relative overflow-hidden">
      {/* soft lacquer glow blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 w-[42rem] h-[42rem] rounded-full blur-3xl opacity-50"
          style={{ background: 'radial-gradient(circle at center, rgba(199,154,138,0.55), transparent 65%)' }} />
        <div className="absolute top-1/3 -left-32 w-[34rem] h-[34rem] rounded-full blur-3xl opacity-40"
          style={{ background: 'radial-gradient(circle at center, rgba(181,107,120,0.4), transparent 65%)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
          {/* Copy */}
          <div className="max-w-xl">
            <span className="kicker">{t('hero.kicker')}</span>
            <h1 className="mt-5 font-serif text-[3rem] leading-[1.02] sm:text-6xl md:text-[4.6rem] md:leading-[0.98]">
              {lines.map((l, i) => (
                <span key={i} className={`block ${i === 1 ? 'italic text-wine' : ''}`}>
                  {l}
                </span>
              ))}
            </h1>
            <p className="mt-6 text-ink-soft text-base md:text-lg leading-relaxed max-w-md">
              {t('hero.sub')}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={onBook} className="btn-gloss">
                <Calendar size={18} />
                {t('hero.ctaBook')}
              </button>
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="btn-soft"
              >
                <MessageCircle size={18} />
                {t('hero.ctaWhats')}
              </a>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-rosegold text-rosegold" />
                  ))}
                </span>
                <span className="font-medium text-ink">{t('hero.stat1')}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-rose/60" />
                {t('hero.stat2')}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-rose/60" />
                {t('hero.stat3')}
              </span>
            </div>
          </div>

          {/* Photo */}
          <div className="relative">
            <div className="relative mx-auto max-w-[26rem] lg:max-w-none">
              <div
                className="relative rounded-[2rem] overflow-hidden rotate-[1.5deg] shadow-[0_40px_80px_-40px_rgba(83,45,53,0.55)] ring-1 ring-white/60"
              >
                <picture>
                  <source media="(max-width: 640px)" srcSet="/hero-nails-mobile.webp" />
                  <img
                    src="/hero-nails.webp"
                    alt="Verzorgde natuurlijke nagels met zachte ombre"
                    className="w-full h-full object-cover aspect-[4/5]"
                    fetchPriority="high"
                    width={1100}
                    height={1375}
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-wine-deep/15 to-transparent" />
                {/* glossy sheen */}
                <div aria-hidden className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/25 to-transparent" />
              </div>

              {/* floating location pill */}
              <div className="absolute -bottom-4 left-4 sm:left-6 card-gloss px-4 py-2.5 flex items-center gap-2 -rotate-2">
                <MapPin size={16} className="text-wine" />
                <span className="text-sm font-medium text-ink">{site.city}</span>
                <span className="text-ink-faint text-sm">· {site.street.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
