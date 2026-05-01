import { useState } from 'react';
import { site } from '../data/site';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

const images = [
  {
    src: '/recent-nail-set-2026.webp',
    alt: "Collage van recente nagelsets bij Lisette's Nagelstudio",
    cls: 'aspect-square',
  },
  {
    src: '/handmade-nail-art-2025.webp',
    alt: "Paarse en roze nail art uit Lisette's Nagelstudio",
    cls: 'aspect-square',
  },
  {
    src: '/dark-detail-nail-set-2025.webp',
    alt: "Roze en blauwe nail art bij Lisette's Nagelstudio",
    cls: 'aspect-[4/3]',
  },
  {
    src: '/nail-set-DNYeXYVxhRd-1080x1080.webp',
    alt: 'Roze gelpolish op handen en tenen',
    cls: 'aspect-square',
  },
  {
    src: '/nail-work-DSVzsFDjtiR-1080x1080.webp',
    alt: 'Rode, blauwe en witte nagelsets uit de studio',
    cls: 'aspect-square',
  },
  {
    src: '/training-own-hand-2025.webp',
    alt: 'Training en certificaat gedeeld door Lisette',
    cls: 'aspect-square',
  },
  {
    src: '/studio-reveal-2022.webp',
    alt: "Studio-interieur van Lisette's Nagelstudio",
    cls: 'aspect-square',
  },
  {
    src: '/nail-set-B-DNYeXYXRU3-1080x1080.webp',
    alt: 'Roze gelpolish met salonkaart',
    cls: 'aspect-square',
  },
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
              type="button"
              key={img.src}
              onClick={() => setIdx(i)}
              className={`group relative overflow-hidden rounded-lg ${img.cls} ${
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
          Meer werk op{' '}
          <a
            href={site.instagramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            Instagram
          </a>{' '}
          en{' '}
          <a
            href={site.facebookHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            Facebook
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
