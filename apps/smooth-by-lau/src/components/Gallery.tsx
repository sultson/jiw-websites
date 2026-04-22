import { useState } from 'react';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

type Img = { src: string; alt: string; cls: string };

const ontharingImages: Img[] = [
  { src: '/resultaat-oksels.webp',    alt: 'Before & after suikerontharing oksels',  cls: 'aspect-square' },
  { src: '/resultaat-bovenlip.webp',  alt: 'Before & after bovenlip suikerontharing', cls: 'aspect-square' },
  { src: '/resultaat-oksel-2.webp',   alt: 'Before & after suikerontharing oksel',   cls: 'aspect-square' },
];

const wenkbrauwImages: Img[] = [
  { src: '/resultaat-wenkbrauwen.webp', alt: 'Before & after wenkbrauw behandeling', cls: 'aspect-square' },
];

type Tab = 'ontharing' | 'wenkbrauw';

export default function Gallery({ t }: Props) {
  const [tab, setTab] = useState<Tab>('ontharing');
  const [idx, setIdx] = useState<number | null>(null);

  const images = tab === 'ontharing' ? ontharingImages : wenkbrauwImages;

  return (
    <section id="fotos" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10">
          <span className="kicker">{t('gallery.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('gallery.title')}</h2>
          <p className="mt-3 text-sm text-espresso/60">{t('gallery.sub')}</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full border border-espresso/15 p-1 bg-cream shadow-sm">
            {(['ontharing', 'wenkbrauw'] as Tab[]).map(key => (
              <button
                key={key}
                onClick={() => { setTab(key); setIdx(null); }}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  tab === key
                    ? 'bg-espresso text-cream'
                    : 'text-espresso/60 hover:text-espresso'
                }`}
              >
                {t(`gallery.${key}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setIdx(i)}
              className={`group relative overflow-hidden rounded-xl md:rounded-2xl ${img.cls} ${
                i === 0 && images.length > 1 ? 'col-span-2 md:col-span-1' : ''
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
