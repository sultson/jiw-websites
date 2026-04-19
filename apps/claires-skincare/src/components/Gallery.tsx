import { useState } from 'react';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

const images = [
  { src: '/before-after-forehead.webp',        alt: 'Voor en na — voorhoofd behandeling',   cls: 'row-span-2 aspect-[3/4]' },
  { src: '/before-after-skin-texture.webp',    alt: 'Voor en na — huidtextuur',             cls: 'aspect-[3/4]' },
  { src: '/before-after-brow-lift.webp',       alt: 'Voor en na — wenkbrauwen',             cls: 'aspect-[3/4]' },
  { src: '/before-after-pore-extraction.webp', alt: 'Voor en na — porie-reiniging',         cls: 'aspect-[3/4]' },
  { src: '/before-after-oxygen-facial.webp',   alt: 'Voor en na — oxygen facial',           cls: 'aspect-[3/4]' },
  { src: '/treatment-room-sage.webp',          alt: 'Behandelkamer met apparatuur',         cls: 'aspect-[4/3]' },
  { src: '/before-after-mens-facial.webp',     alt: 'Voor en na — heren facial',            cls: 'aspect-[3/4]' },
  { src: '/before-after-back-acne.webp',       alt: 'Voor en na — rug acne',                cls: 'aspect-[3/4]' },
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
                i === 0 ? 'col-span-2 md:col-span-2 md:row-span-2' : 'col-span-1'
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
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
