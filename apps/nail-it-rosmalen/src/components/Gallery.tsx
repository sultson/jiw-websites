import { useState } from 'react';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

// Newest first, by Instagram post date (@nagelstudio_nail_it); the date is in each comment.
const images = [
  { src: '/done-nails-11.webp', alt: 'Babyboom met subtiele glitter voor een bruid' }, // 2026-08
  { src: '/done-nails-12.webp', alt: 'Rode BIAB op de natuurlijke nagel met witte stippen' }, // 2026-04
  { src: '/done-nails-13.webp', alt: 'Oudroze gellak met glitter' }, // 2025-10
  { src: '/done-nails-14.webp', alt: 'Nude gellak met gouden glitter' }, // 2025-09
  { src: '/done-nails-15.webp', alt: 'Rode gellak' }, // 2025-09
  { src: '/done-nails-16.webp', alt: 'Lichtblauwe gellak' }, // 2025-02
  { src: '/done-nails-17.webp', alt: 'Acrylnagels met verlenging in babyboom' }, // 2025-02
  { src: '/done-nails-7.webp', alt: 'Lichtroze gellak' }, // 2024-10
  { src: '/done-nails-6.webp', alt: 'Rode gellak, amandelvorm' }, // 2024-05
  { src: '/done-nails-5.webp', alt: 'Herstel van beschadigde nagels, stap voor stap' }, // 2024-03
  { src: '/done-nails-4.webp', alt: 'Donkerblauwe gellak' }, // 2023-11
  { src: '/done-nails-3.webp', alt: 'Voor en na: roze verlenging' }, // 2023-10
  { src: '/done-nails-2.webp', alt: 'Voor en na: nude met glitter' }, // 2023-01
  { src: '/done-nails-10.webp', alt: 'Voor en na: natuurlijke set' }, // 2022-12
  { src: '/done-nails-9.webp', alt: 'Nude gellak' }, // 2022-11
  { src: '/done-nails-8.webp', alt: 'Rode bruidsnagels' }, // 2022-11
  { src: '/done-nails-1.webp', alt: 'Grijze gellak met zwarte glitter' }, // 2022-09
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
              className={`group relative overflow-hidden rounded-xl md:rounded-2xl aspect-square ${
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
