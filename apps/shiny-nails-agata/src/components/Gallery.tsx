import { useState } from 'react';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

type Img = { src: string; alt: string };

const images: Img[] = [
  { src: '/nail-02.webp', alt: 'Healthy structured manicure' },
  { src: '/nail-03.webp', alt: 'Russian manicure detail' },
  { src: '/nail-04.webp', alt: 'Long-lasting gel polish set' },
  { src: '/nail-05.webp', alt: 'Elegant nail finish' },
  { src: '/nail-06.webp', alt: 'Healthy cuticle preparation' },
  { src: '/nail-07.webp', alt: 'Gel manicure with structured base' },
  { src: '/nail-08.webp', alt: 'Nail art detail' },
  { src: '/nail-09.webp', alt: 'Healthy nail extensions' },
  { src: '/nail-10.webp', alt: 'Clean structured finish' },
  { src: '/nail-11.webp', alt: 'Dark glitter gel set' },
  { src: '/nail-12.webp', alt: 'Recent set' },
  { src: '/nail-13.webp', alt: 'Soft pink with hearts' },
  { src: '/nail-14.webp', alt: 'Classic red almond set' },
  { src: '/nail-15.webp', alt: 'Nude with gold and black accent' },
  { src: '/nail-01.webp', alt: 'Recent set' },
];

export default function Gallery({ t }: Props) {
  const [idx, setIdx] = useState<number | null>(null);

  return (
    <section id="fotos" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10">
          <span className="kicker">{t('gallery.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('gallery.title')}</h2>
          <p className="mt-3 text-sm text-espresso/60">{t('gallery.sub')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setIdx(i)}
              className="group relative overflow-hidden rounded-xl md:rounded-2xl aspect-square"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/10 transition-colors" />
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
