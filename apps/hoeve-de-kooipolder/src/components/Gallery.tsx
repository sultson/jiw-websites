import { useState } from 'react';
import { galleryItems } from '../data/gallery';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string; lang: 'nl' | 'en' };

export default function Gallery({ t, lang }: Props) {
  const [idx, setIdx] = useState<number | null>(null);

  const count = galleryItems.length;
  const lightboxItems = galleryItems.map(item => ({
    src: item.src,
    alt: lang === 'en' ? item.altEn : item.altNl,
  }));

  const renderSet = (hidden: boolean) => (
    <div className="flex gap-4 pr-4" aria-hidden={hidden || undefined}>
      {galleryItems.map((item, i) => (
        <button
          key={`${item.src}-${hidden ? 'dup' : 'main'}`}
          type="button"
          tabIndex={hidden ? -1 : undefined}
          onClick={() => setIdx(i % count)}
          className="group relative shrink-0 h-64 md:h-80 aspect-[4/5] overflow-hidden rounded-2xl"
        >
          <img
            src={item.src}
            alt={hidden ? '' : lang === 'en' ? item.altEn : item.altNl}
            loading={!hidden && i < 3 ? 'eager' : 'lazy'}
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors" />
        </button>
      ))}
    </div>
  );

  return (
    <section id="fotos" className="py-20 md:py-28 overflow-hidden">
      <style>{`
        .hk-marquee { overflow-x: hidden; }
        .hk-marquee-track {
          display: flex;
          width: max-content;
          animation: hk-marquee 40s linear infinite;
        }
        .hk-marquee:hover .hk-marquee-track { animation-play-state: paused; }
        @keyframes hk-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hk-marquee { overflow-x: auto; }
          .hk-marquee-track { animation: none; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center mb-10">
        <span className="kicker">{t('gallery.kicker')}</span>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('gallery.title')}</h2>
      </div>

      <div className="hk-marquee">
        <div className="hk-marquee-track">
          {renderSet(false)}
          {renderSet(true)}
        </div>
      </div>

      {idx !== null && (
        <Lightbox
          items={lightboxItems}
          index={idx}
          onClose={() => setIdx(null)}
          onPrev={() => setIdx(i => (i === null ? i : (i - 1 + count) % count))}
          onNext={() => setIdx(i => (i === null ? i : (i + 1) % count))}
        />
      )}
    </section>
  );
}
