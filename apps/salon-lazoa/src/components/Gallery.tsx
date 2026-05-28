import { useMemo, useState } from 'react';
import Lightbox from './Lightbox';
import { galleryImages, type GalleryImage } from '../data/gallery';

type Props = { t: (k: string) => string };

type Tab = 'alle' | 'nails' | 'brows';

function spanClass(span: GalleryImage['span']) {
  if (span === 'wide') return 'col-span-2 md:col-span-2';
  if (span === 'tall') return 'md:row-span-2';
  return '';
}

export default function Gallery({ t }: Props) {
  const [tab, setTab] = useState<Tab>('alle');
  const [idx, setIdx] = useState<number | null>(null);

  const images = useMemo(
    () => tab === 'alle' ? galleryImages : galleryImages.filter(i => i.cat === tab),
    [tab],
  );

  return (
    <section id="werk" className="py-24 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10">
          <span className="kicker">{t('gallery.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('gallery.title')}</h2>
          <p className="mt-3 text-sm text-mute">{t('gallery.sub')}</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full border border-ink/15 p-1 bg-white shadow-sm">
            {(['alle', 'nails', 'brows'] as Tab[]).map(key => (
              <button
                key={key}
                onClick={() => { setTab(key); setIdx(null); }}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  tab === key ? 'bg-ink text-paper' : 'text-ink/60 hover:text-ink'
                }`}
              >
                {t(`gallery.${key}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] sm:auto-rows-[180px] md:auto-rows-[200px] gap-2 md:gap-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setIdx(i)}
              className={`group relative overflow-hidden rounded-md ${spanClass(img.span)} ${
                img.span === 'tall' ? 'row-span-2' : ''
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/15 transition-colors" />
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
