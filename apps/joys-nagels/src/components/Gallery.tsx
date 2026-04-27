import { useState } from 'react';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

const images = [
  { src: '/nails-naturel-nude.webp', alt: 'Naturel nude gellac', cls: 'aspect-[3/4]' },
  { src: '/nails-classic-red.webp', alt: 'Klassiek rood', cls: 'aspect-square' },
  { src: '/nails-burgundy-copper.webp', alt: 'Bordeaux met koper accent', cls: 'aspect-square' },
  { src: '/nails-blue-silver-glitter.webp', alt: 'Blauw met zilveren glitter', cls: 'aspect-[4/3]' },
  { src: '/nails-pink-glitter.webp', alt: 'Zacht roze met glitter', cls: 'aspect-[4/3]' },
  { src: '/nails-clear-shimmer.webp', alt: 'Naturel met fijne shimmer', cls: 'aspect-square' },
  { src: '/nails-red-glitter-accent.webp', alt: 'Rood met glitter accent', cls: 'aspect-square' },
  { src: '/nails-chrome-silver.webp', alt: 'Chrome zilver', cls: 'aspect-[4/3]' },
  { src: '/nails-taupe-natural.webp', alt: 'Warm taupe naturel', cls: 'aspect-[4/3]' },
  { src: '/nails-silver-ombre.webp', alt: 'Zilver ombré met glitter', cls: 'aspect-square' },
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-auto">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setIdx(i)}
              className={`group relative overflow-hidden rounded-xl md:rounded-2xl ${img.cls} ${
                i === 0 ? 'col-span-2 md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/10" />
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-espresso/60">
          Meer foto's op{' '}
          <a
            href="https://www.facebook.com/joysnagels/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            Facebook /joysnagels
          </a>
          .
        </p>
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
