import { useState } from 'react';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

type Cat = 'mani' | 'design';
type Img = { src: string; alt: string; cat: Cat };

const all: Img[] = [
  { src: '/gallery-01.webp', alt: 'Soft nude square manicure', cat: 'mani' },
  { src: '/gallery-03.webp', alt: 'White nails with gold foil accent', cat: 'mani' },
  { src: '/gallery-05.webp', alt: 'Black French nails with heart accent', cat: 'design' },
  { src: '/gallery-06.webp', alt: 'Pink ombre French almond nails', cat: 'design' },
  { src: '/gallery-02.webp', alt: 'Soft pink manicure', cat: 'mani' },
  { src: '/gallery-08.webp', alt: 'Milky white nails with pink marble art', cat: 'design' },
  { src: '/gallery-07.webp', alt: 'Milky nails with delicate floral art', cat: 'design' },
  { src: '/gallery-04.webp', alt: 'Almond nude nails', cat: 'mani' },
  { src: '/gallery-09.webp', alt: 'Classic French manicure', cat: 'design' },
  { src: '/gallery-10.webp', alt: 'Glitter French nails with charms', cat: 'design' },
];

type Tab = 'all' | Cat;

export default function Gallery({ t }: Props) {
  const [tab, setTab] = useState<Tab>('all');
  const [idx, setIdx] = useState<number | null>(null);

  const images = tab === 'all' ? all : all.filter(i => i.cat === tab);

  return (
    <section id="work" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10">
          <span className="kicker">{t('gallery.kicker')}</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">{t('gallery.title')}</h2>
          <p className="mt-3 text-sm text-ink-mute max-w-md mx-auto">{t('gallery.sub')}</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full border border-ink/15 p-1 bg-cream shadow-sm">
            {(['all', 'mani', 'design'] as Tab[]).map(key => (
              <button
                key={key}
                onClick={() => { setTab(key); setIdx(null); }}
                className={`px-5 py-2 rounded-full text-xs font-medium tracking-[0.12em] uppercase transition-colors ${
                  tab === key ? 'bg-ink text-cream' : 'text-ink/60 hover:text-ink'
                }`}
              >
                {t(`gallery.${key}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setIdx(i)}
              className={`group relative overflow-hidden rounded-xl md:rounded-2xl aspect-square ${
                i === 0 && images.length > 2 ? 'col-span-2 row-span-2 md:col-span-1 md:row-span-1' : ''
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
        onNav={dir =>
          setIdx(i => {
            if (i === null) return i;
            return (i + dir + images.length) % images.length;
          })
        }
      />
    </section>
  );
}
