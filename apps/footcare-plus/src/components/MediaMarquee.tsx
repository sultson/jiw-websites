import { useState } from 'react';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

type Item = { src: string; alt: string };

const items: Item[] = [
  { src: '/marquee-1.webp?v=20260526', alt: 'Aan-huis behandeling door Gerda' },
  { src: '/marquee-2.webp?v=20260526', alt: 'Aan-huis behandeling in de huiskamer' },
  { src: '/marquee-3.webp?v=20260526', alt: 'Aan-huis voetzorg bij een cliënt in een rolstoel' },
  { src: '/marquee-4.webp?v=20260526', alt: 'Aan-huis behandeling met mobiele instrumentenkoffer' },
  { src: '/marquee-5.webp?v=20260526', alt: 'Aan-huis voetzorg op locatie' },
  { src: '/marquee-6.webp?v=20260526', alt: 'Gerda aan het werk' },
  { src: '/marquee-7.webp?v=20260526', alt: 'De praktijk in Wijckel' },
  { src: '/marquee-8.webp?v=20260526', alt: 'Gerda tijdens een behandeling' },
];

export default function MediaMarquee({ t }: Props) {
  const [idx, setIdx] = useState<number | null>(null);
  // Duplicate once so the -50% -> 0 keyframe loop reads as continuous.
  const loop = [...items, ...items];

  return (
    <section id="praktijk" className="py-20 md:py-28 overflow-hidden bg-ink text-cream">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid md:grid-cols-2 gap-6 md:gap-12 md:items-end">
          <div>
            <span className="inline-block text-[11px] uppercase tracking-[0.22em] text-sage font-medium">
              {t('marquee.kicker')}
            </span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.08] text-cream">
              {t('marquee.title')}
            </h2>
          </div>
          <p className="text-cream/75 leading-relaxed md:pb-2">
            {t('marquee.intro')}
          </p>
        </div>
      </div>

      <div
        className="marquee-viewport mt-12 md:mt-16 w-full"
        aria-label="Doorlopende weergave van praktijkfoto's"
      >
        <div className="marquee-track gap-4 md:gap-5 pl-5">
          {loop.map((item, i) => {
            const realIdx = i % items.length;
            return (
              <button
                key={`${item.src}-${i}`}
                type="button"
                onClick={() => setIdx(realIdx)}
                aria-label={item.alt}
                className="group relative w-[72vw] max-w-[320px] sm:w-[340px] shrink-0 overflow-hidden rounded-2xl border border-cream/10 bg-ink-soft"
              >
                <div className="aspect-[4/5] w-full overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={e => {
                      const el = e.currentTarget as HTMLImageElement;
                      el.style.opacity = '0';
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Lightbox
        images={items}
        index={idx}
        onClose={() => setIdx(null)}
        onNav={dir =>
          setIdx(i => {
            if (i === null) return i;
            return (i + dir + items.length) % items.length;
          })
        }
      />
    </section>
  );
}
