import { useState } from 'react';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

const images = [
  { src: '/nail-floral-pink.webp', alt: 'Handgeschilderde roze bloemen op witte basis', cls: 'aspect-square' },
  { src: '/nail-easter.webp', alt: 'Pasen design met eitjes en strikje', cls: 'aspect-square' },
  { src: '/nail-blue-mermaid.webp', alt: 'Blauwe mermaid set met shimmer', cls: 'aspect-[3/4]' },
  { src: '/nail-wine-purple.webp', alt: 'Wijnpaarse set met getekende blad accent', cls: 'aspect-[4/3]' },
  { src: '/nail-christmas-red.webp', alt: 'Rood-gouden kerstset met sneeuwvlokken', cls: 'aspect-[4/3]' },
  { src: '/nail-rainbow-ombre.webp', alt: 'Regenboog ombre nail art', cls: 'aspect-square' },
  { src: '/nail-leopard.webp', alt: 'Luipaard print french op naturel', cls: 'aspect-[4/3]' },
  { src: '/nail-blue-sapphire.webp', alt: 'Saffierblauwe gellak met glitter accent', cls: 'aspect-square' },
  { src: '/nail-pastel-winter.webp', alt: 'Pastel winterset met sneeuwvlok en swirl', cls: 'aspect-square' },
  { src: '/nail-blue-chrome.webp', alt: 'Chroom blauwe set met hartje', cls: 'aspect-[4/3]' },
  { src: '/nail-red-bow.webp', alt: 'Gouden glitter met rood lint art', cls: 'aspect-square' },
  { src: '/nail-black-french-hearts.webp', alt: 'Zwarte french met hart accent', cls: 'aspect-square' },
  { src: '/nail-soft-french.webp', alt: 'Klassieke zachte french', cls: 'aspect-square' },
];

export default function Gallery({ t }: Props) {
  const [idx, setIdx] = useState<number | null>(null);

  return (
    <section id="werk" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10">
          <span className="kicker">{t('gallery.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('gallery.title')}</h2>
          <p className="mt-3 text-sm text-ink/60">{t('gallery.sub')}</p>
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
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10" />
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-ink/60">
          Meer foto's op{' '}
          <a
            href="https://www.facebook.com/people/BeautyBar-Ter-Apel/61552088251660/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose hover:underline"
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
        onNav={(dir) =>
          setIdx((i) => {
            if (i === null) return i;
            return (i + dir + images.length) % images.length;
          })
        }
      />
    </section>
  );
}
