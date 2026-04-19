import { useState } from 'react';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

// Voeg foto's toe aan /public/ en update deze lijst
const images = [
  { src: '/photo-2.webp',  alt: 'De studio van Claire\'s Skincare',  cls: 'row-span-2 aspect-[3/4]' },
  { src: '/photo-5.webp',  alt: 'Behandelruimte totaaloverzicht',    cls: 'aspect-square' },
  { src: '/photo-12.webp', alt: 'Claire\'s Skincare Studio gevel',   cls: 'aspect-square' },
  { src: '/photo-6.webp',  alt: 'Behandelkamer met apparatuur',      cls: 'aspect-[4/3]' },
  { src: '/photo-7.webp',  alt: 'Behandelkamer detail',              cls: 'aspect-[4/3]' },
  { src: '/photo-4.webp',  alt: 'Producten en studio inrichting',    cls: 'aspect-square' },
  { src: '/photo-9.webp',  alt: 'Emergin C productlijn',             cls: 'aspect-square' },
  { src: '/photo-10.webp', alt: 'Emergin C serums en gua sha',       cls: 'aspect-[4/3]' },
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
