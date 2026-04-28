import { useState } from 'react';
import { Instagram } from 'lucide-react';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

type Img = { src: string; alt: string; cls: string };

const images: Img[] = [
  { src: '/nails-soft-french.webp',     alt: 'Soft french BIAB-nagels',                cls: 'aspect-square' },
  { src: '/nails-classic-french.webp',  alt: 'Klassieke french manicure',              cls: 'aspect-square' },
  { src: '/nails-clean-girl.webp',      alt: 'Clean-girl natuurlijke nagels',          cls: 'aspect-square' },
  { src: '/nails-pink-biab.webp',       alt: 'Roze BIAB-set',                          cls: 'aspect-square' },
  { src: '/nails-cute-pink.webp',       alt: 'Pastelroze nagels',                       cls: 'aspect-square' },
  { src: '/nails-almond-pink.webp',     alt: 'Almond-vorm in soft pink',                cls: 'aspect-square' },
  { src: '/nails-french-sparkles.webp', alt: 'French met sparkles',                     cls: 'aspect-square' },
  { src: '/nails-gelx-french.webp',     alt: 'Gel-X met klassieke french',              cls: 'aspect-square' },
  { src: '/nails-gelx-stones.webp',     alt: 'Gel-X met nail-art steentjes',            cls: 'aspect-square' },
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setIdx(i)}
              className={`group relative overflow-hidden rounded-xl md:rounded-2xl ${img.cls}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/10 transition-colors" />
            </button>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://www.instagram.com/elegancenailsstudio_/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex"
          >
            <Instagram size={14} />
            @elegancenailsstudio_
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
