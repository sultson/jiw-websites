import { useState } from 'react';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

const images: { src: string; alt: string; cls: string }[] = [
  { src: '/resultaat-wenkbrauwen.webp',        alt: 'Before & after wenkbrauw behandeling',   cls: 'aspect-square' },
  { src: '/resultaat-oksels.webp',             alt: 'Before & after suikerontharing oksels',  cls: 'aspect-square' },
  { src: '/suikerpasta-closeup.webp',          alt: 'Suikerpasta — 100% natuurlijk',          cls: 'aspect-[3/4]' },
  { src: '/suikeren-vs-harsen.webp',           alt: 'Suikeren vs harsen vergelijking',        cls: 'aspect-square' },
  { src: '/checklist-suikerontharing.webp',    alt: 'Voor de behandeling checklist',          cls: 'aspect-square' },
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
