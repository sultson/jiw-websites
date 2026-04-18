import { useState } from 'react';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

/**
 * Voeg je foto's toe aan /public en zet ze hier in de lijst.
 * Geef elke foto een beschrijvende alt-tekst.
 * De eerste foto wordt groter weergegeven (col-span-2 / row-span-2).
 *
 * Voorbeeld:
 *   { src: '/nails-1.webp', alt: 'BIAB resultaat', cls: 'row-span-2 aspect-[3/4]' },
 *   { src: '/nails-2.webp', alt: 'Gel extensions', cls: 'aspect-square' },
 */
const images: { src: string; alt: string; cls: string }[] = [
  // Hier komen jouw foto's — voorlopig leeg
];

export default function Gallery({ t }: Props) {
  const [idx, setIdx] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <section id="fotos" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 text-center">
          <span className="kicker">{t('gallery.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('gallery.title')}</h2>
          <p className="mt-6 text-espresso/40 italic">Foto's worden binnenkort toegevoegd.</p>
        </div>
      </section>
    );
  }

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
