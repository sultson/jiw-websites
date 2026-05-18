import { useState } from 'react';
import { Instagram } from 'lucide-react';
import { galleryImages } from '../data/gallery';
import type { Lang } from '../translations';
import Lightbox from './Lightbox';

type Props = { lang: Lang; t: (k: string) => string };

export default function Gallery({ lang, t }: Props) {
  const [idx, setIdx] = useState<number | null>(null);

  const images = galleryImages.map(g => ({
    src: g.src,
    alt: lang === 'en' ? g.en : g.nl,
  }));

  return (
    <section id="fotos" className="py-20 md:py-28 bg-blush-soft/60">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10 max-w-xl mx-auto">
          <span className="kicker">{t('gallery.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('gallery.title')}</h2>
          <p className="mt-3 text-sm text-ink/60">{t('gallery.sub')}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setIdx(i)}
              className="group relative overflow-hidden rounded-xl md:rounded-2xl aspect-square bg-blush"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors" />
            </button>
          ))}
        </div>

        <div className="mt-9 text-center">
          <a
            href="https://www.instagram.com/nagelstyliste_monique/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex"
          >
            <Instagram size={16} />
            {t('gallery.follow')}
          </a>
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
