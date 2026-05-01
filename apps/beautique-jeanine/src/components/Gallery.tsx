import { useState } from 'react';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

const images = [
  { src: '/jeanine-salon-portrait.webp', alt: 'Jeanine in de salon met IK Skin Perfection producten', cls: 'aspect-[4/3]' },
  { src: '/salon-treatment-room.webp', alt: 'Behandelruimte van Beautique Jeanine', cls: 'aspect-[4/3]' },
  { src: '/salon-exterior.webp', alt: 'Vernieuwde salonruimte in Rotsterhaule', cls: 'aspect-[3/4]' },
  { src: '/lash-lift-result.webp', alt: 'Lash lifting resultaat', cls: 'aspect-square' },
  { src: '/brow-lamination-result.webp', alt: 'Brow lamination resultaat', cls: 'aspect-[4/3]' },
  { src: '/ik-products-event.webp', alt: 'IK Skin Perfection producten', cls: 'aspect-square' },
  { src: '/ik-skin-products.webp', alt: 'IK Skin producten uit de salon', cls: 'aspect-square' },
  { src: '/beauty-event-makeup.webp', alt: 'Make-up en beauty event', cls: 'aspect-square' },
  { src: '/beauty-event-products.webp', alt: 'Producten tijdens beauty event', cls: 'aspect-square' },
  { src: '/bindweefselmassage.webp', alt: 'Bindweefselmassage sfeerbeeld', cls: 'aspect-[3/4]' },
  { src: '/pune-makeup-training.webp', alt: 'PUNE make-up training sfeerbeeld', cls: 'aspect-[3/4]' },
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
          Meer foto's op{' '}
          <a
            href="https://www.instagram.com/beautiquejeanine/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            Instagram @beautiquejeanine
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
