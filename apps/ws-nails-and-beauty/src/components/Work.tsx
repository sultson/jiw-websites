import { useState } from 'react';
import { Instagram } from 'lucide-react';
import { galleryItems, type WorkItem } from '../data/work';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

type Tab = 'all' | 'biab' | 'color' | 'seasonal';

export default function Work({ t }: Props) {
  const [tab, setTab] = useState<Tab>('all');
  const [idx, setIdx] = useState<number | null>(null);

  const items: WorkItem[] = tab === 'all' ? galleryItems : galleryItems.filter(i => i.cat === tab);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'all',      label: t('work.tabAll') },
    { id: 'biab',     label: t('work.tabBiab') },
    { id: 'color',    label: t('work.tabColor') },
    { id: 'seasonal', label: t('work.tabSeasonal') },
  ];

  return (
    <section id="werk" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
          <div className="max-w-xl">
            <span className="kicker">{t('work.kicker')}</span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('work.title')}</h2>
            <p className="mt-3 text-sm text-plum/60">{t('work.sub')}</p>
          </div>
          <a
            href="https://www.instagram.com/ws.n4ils/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost shrink-0 self-start md:self-end"
          >
            <Instagram size={15} />
            {t('work.viewIg')}
          </a>
        </div>

        <div className="flex justify-start md:justify-center mb-6 overflow-x-auto no-scrollbar -mx-5 px-5 md:mx-0 md:px-0">
          <div className="inline-flex rounded-full border border-plum/15 p-1 bg-white/70 shadow-sm">
            {tabs.map(tb => (
              <button
                key={tb.id}
                onClick={() => { setTab(tb.id); setIdx(null); }}
                className={`px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                  tab === tb.id
                    ? 'bg-plum text-porcelain'
                    : 'text-plum/60 hover:text-plum'
                }`}
              >
                {tb.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {items.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setIdx(i)}
              className="group relative overflow-hidden rounded-xl md:rounded-2xl aspect-[4/5] bg-blush"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading={i < 3 ? 'eager' : 'lazy'}
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-plum/0 group-hover:bg-plum/10 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      <Lightbox
        images={items}
        index={idx}
        onClose={() => setIdx(null)}
        onNav={dir =>
          setIdx(i => {
            if (i === null) return i;
            return (i + dir + items.length) % items.length;
          })
        }
      />
    </section>
  );
}
