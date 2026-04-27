import { useState } from 'react';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

const images = [
  { src: '/brigitte-naturel.webp', alt: 'Naturel set', cls: 'aspect-[3/4]' },
  { src: '/brigitte-biab-lavendel.webp', alt: 'BIAB met zachte lavendel', cls: 'aspect-square' },
  { src: '/brigitte-babyboom.webp', alt: 'Lichte babyboom', cls: 'aspect-square' },
  { src: '/nails-blue-gellak.webp', alt: 'Blauwe gellak', cls: 'aspect-[4/3]' },
  { src: '/nails-naturel-dots.webp', alt: 'Naturel met fijne dots', cls: 'aspect-[4/3]' },
  { src: '/brigitte-pink-set.webp', alt: 'Zachte roze nagels', cls: 'aspect-square' },
  { src: '/brigitte-cupglaze.webp', alt: 'Cupglaze met glitter', cls: 'aspect-square' },
  { src: '/brigitte-rubber-french.webp', alt: 'Rubber base french', cls: 'aspect-[4/3]' },
  { src: '/nails-magenta.webp', alt: 'Frisse magenta', cls: 'aspect-[4/3]' },
  { src: '/nails-colour-mix.webp', alt: 'Vrolijke kleurenmix', cls: 'aspect-square' },
  { src: '/brigitte-blue-set.webp', alt: 'Blauwe set', cls: 'aspect-square' },
  { src: '/nails-festive.webp', alt: 'Feestelijke kerstset', cls: 'aspect-[4/3]' },
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
            href="https://www.instagram.com/queensfeet.brigitte/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            Instagram @queensfeet.brigitte
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
