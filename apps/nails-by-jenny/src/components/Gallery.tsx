import { useState } from 'react';
import type { Lang } from '../translations';
import Lightbox from './Lightbox';

type Props = { lang: Lang; t: (k: string) => string };

type Img = { src: string; altNl: string; altEn: string };

const images: Img[] = [
  {
    src: '/werk-roze-stippen.webp',
    altNl: 'Melkroze nagels met rode stippen nail art. Werk van Nails by Jenny.',
    altEn: 'Milky pink nails with red polka dot nail art. Work by Nails by Jenny.',
  },
  {
    src: '/werk-diepgroen.webp',
    altNl: 'Diepgroene gellak nagels. Werk van Nails by Jenny.',
    altEn: 'Deep green gel polish nails. Work by Nails by Jenny.',
  },
  {
    src: '/werk-nude-amandel.webp',
    altNl: 'Nude amandelvormige nagelverlenging. Werk van Nails by Jenny.',
    altEn: 'Nude almond shaped nail extensions. Work by Nails by Jenny.',
  },
  {
    src: '/werk-rood-witte-stip.webp',
    altNl: 'Steenrode gellak met witte stip accenten. Werk van Nails by Jenny.',
    altEn: 'Brick red gel polish with white dot accents. Work by Nails by Jenny.',
  },
  {
    src: '/werk-parelmoer-wit.webp',
    altNl: 'Parelmoer witte gellak nagels. Werk van Nails by Jenny.',
    altEn: 'Pearl white gel polish nails. Work by Nails by Jenny.',
  },
  {
    src: '/werk-koraal.webp',
    altNl: 'Koraalroze gellak nagels. Werk van Nails by Jenny.',
    altEn: 'Coral pink gel polish nails. Work by Nails by Jenny.',
  },
  {
    src: '/werk-blauwe-glitter.webp',
    altNl: 'Blauwe glitternagels met building power. Werk van Nails by Jenny.',
    altEn: 'Blue glitter nails with building power. Work by Nails by Jenny.',
  },
  {
    src: '/werk-framboos.webp',
    altNl: 'Frambooskleurige biab nagels. Werk van Nails by Jenny.',
    altEn: 'Raspberry coloured BIAB nails. Work by Nails by Jenny.',
  },
  {
    src: '/werk-zachtroze-ombre.webp',
    altNl: 'Zachtroze ombre nagels met subtiel accent. Werk van Nails by Jenny.',
    altEn: 'Soft pink ombre nails with a subtle accent. Work by Nails by Jenny.',
  },
];

export default function Gallery({ lang, t }: Props) {
  const [idx, setIdx] = useState<number | null>(null);

  const lightboxImages = images.map(img => ({
    src: img.src,
    alt: lang === 'en' ? img.altEn : img.altNl,
  }));

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
              className={`group relative overflow-hidden rounded-xl md:rounded-2xl aspect-square ${
                i === 0 ? 'col-span-2 md:col-span-1' : ''
              }`}
            >
              <img
                src={img.src}
                alt={lang === 'en' ? img.altEn : img.altNl}
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
        images={lightboxImages}
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
