import { useState } from 'react';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

const images = [
  { src: '/done-nails-1.webp', alt: 'Elegante gellak set', cls: 'row-span-2 aspect-[3/4]' },
  { src: '/done-nails-2.webp', alt: 'French manicure', cls: 'aspect-square' },
  { src: '/done-nails-3.webp', alt: 'Natuurlijke BIAB set', cls: 'aspect-square' },
  { src: '/done-nails-4.webp', alt: 'Strakke gel afwerking', cls: 'aspect-[4/3]' },
  { src: '/done-nails-5.webp', alt: 'Nail art detail', cls: 'aspect-[4/3]' },
  { src: '/done-nails-6.webp', alt: 'Nude gellak', cls: 'aspect-square' },
  { src: '/done-nails-7.webp', alt: 'Glossy finish', cls: 'aspect-square' },
  { src: '/done-nails-8.webp', alt: 'Subtiele glitter', cls: 'aspect-[4/3]' },
  { src: '/done-nails-9.webp', alt: 'Klassieke rode nagels', cls: 'aspect-[4/3]' },
  { src: '/done-nails-10.webp', alt: 'Verfijnde manicure', cls: 'aspect-square' },
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
            href="https://www.instagram.com/nagelstudio_nail_it/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            Instagram @nagelstudio_nail_it
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
