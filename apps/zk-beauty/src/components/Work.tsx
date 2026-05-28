import { useState, useMemo } from 'react';
import Lightbox from './Lightbox';
import { workImages, type WorkImage } from '../data/work';

type Props = { t: (k: string) => string };

type Tab = 'alle' | 'lashes' | 'brows' | 'hair';

const tabs: Tab[] = ['alle', 'lashes', 'brows', 'hair'];

export default function Work({ t }: Props) {
  const [tab, setTab] = useState<Tab>('alle');
  const [idx, setIdx] = useState<number | null>(null);

  const images = useMemo<WorkImage[]>(
    () => (tab === 'alle' ? workImages : workImages.filter(i => i.category === tab)),
    [tab],
  );

  return (
    <section id="werk" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <span className="gold-rule">{t('work.kicker')}</span>
            <h2 className="mt-5 font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              {t('work.title')}
            </h2>
            <p className="mt-4 text-sm text-ink-mute">{t('work.sub')}</p>
          </div>

          <div className="inline-flex rounded-full border border-ink/15 p-1 bg-ivory shadow-sm self-start">
            {tabs.map(k => (
              <button
                key={k}
                onClick={() => { setTab(k); setIdx(null); }}
                className={`px-4 md:px-5 py-2 rounded-full text-[11px] font-medium tracking-[0.18em] uppercase transition-colors ${
                  tab === k
                    ? 'bg-ink text-ivory'
                    : 'text-ink-mute hover:text-ink'
                }`}
              >
                {t(`work.${k}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
          {images.map((img, i) => {
            const featured = i === 0 && images.length > 1;
            return (
              <button
                key={img.src}
                onClick={() => setIdx(i)}
                className={`group relative overflow-hidden rounded-xl md:rounded-2xl bg-ink/5 ${
                  featured ? 'col-span-2 row-span-2 aspect-[4/3] md:aspect-[3/2]' : 'aspect-square'
                }`}
                aria-label={img.alt}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors" />
              </button>
            );
          })}
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
