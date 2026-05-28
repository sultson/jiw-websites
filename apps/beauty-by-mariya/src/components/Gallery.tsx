import { useState } from 'react';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

type Img = { src: string; alt: string };

const nails: Img[] = Array.from({ length: 8 }, (_, i) => ({
  src: `/gal-nails-0${i + 1}.webp`,
  alt: `Nagelwerk door Maryna ${i + 1}`,
}));
const brows: Img[] = Array.from({ length: 6 }, (_, i) => ({
  src: `/gal-brows-0${i + 1}.webp`,
  alt: `Brows of permanent make-up resultaat ${i + 1}`,
}));
const hair: Img[] = Array.from({ length: 6 }, (_, i) => ({
  src: `/gal-hair-0${i + 1}.webp`,
  alt: `Haarstyling resultaat ${i + 1}`,
}));
const beauty: Img[] = Array.from({ length: 4 }, (_, i) => ({
  src: `/gal-beauty-0${i + 1}.webp`,
  alt: `Schoonheidsbehandeling ${i + 1}`,
}));

type Tab = 'all' | 'nails' | 'brows' | 'hair' | 'beauty';

export default function Gallery({ t }: Props) {
  const [tab, setTab] = useState<Tab>('all');
  const [idx, setIdx] = useState<number | null>(null);

  const map: Record<Tab, Img[]> = {
    all: [...nails, ...brows, ...hair, ...beauty],
    nails, brows, hair, beauty,
  };
  const images = map[tab];

  return (
    <section id="fotos" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10">
          <span className="kicker">{t('gallery.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('gallery.title')}</h2>
          <p className="mt-3 text-sm text-ink/60">{t('gallery.sub')}</p>
        </div>

        <div className="flex justify-center mb-8 px-2">
          <div className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-ink/15 p-1 bg-pearl shadow-sm">
            {(['all', 'nails', 'brows', 'hair', 'beauty'] as Tab[]).map(key => (
              <button
                key={key}
                onClick={() => { setTab(key); setIdx(null); }}
                className={`px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-colors ${
                  tab === key
                    ? 'bg-ink text-pearl'
                    : 'text-ink/60 hover:text-ink'
                }`}
              >
                {t(`gallery.${key}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setIdx(i)}
              className={`group relative overflow-hidden rounded-xl md:rounded-2xl aspect-square ${
                i === 0 ? 'col-span-2 row-span-2 aspect-auto' : ''
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      <Lightbox
        images={images}
        index={idx}
        onClose={() => setIdx(null)}
        onNav={dir => setIdx(i => (i === null ? null : (i + dir + images.length) % images.length))}
      />
    </section>
  );
}
