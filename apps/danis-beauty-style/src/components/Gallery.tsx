import { useState } from 'react';
import { Instagram } from 'lucide-react';
import { gallery, type InstaPost } from '../data/content';
import { business } from '../data/contact';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

type Filter = 'all' | 'nails' | 'braids' | 'gems';

export default function Gallery({ t }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const items = filter === 'all'
    ? gallery
    : gallery.filter(g => g.tag === filter);

  const filters: Array<{ id: Filter; label: string }> = [
    { id: 'all',    label: t('gallery.all') },
    { id: 'nails',  label: t('gallery.nails') },
    { id: 'braids', label: t('gallery.braids') },
    { id: 'gems',   label: t('gallery.gems') },
  ];

  return (
    <section id="gallery" className="section bg-ink">
      <div className="container-page">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="kicker">{t('gallery.kicker')}</span>
            <h2 className="mt-5 text-4xl md:text-5xl font-serif text-bone">
              {t('gallery.title')}
            </h2>
            <p className="mt-4 text-bone-soft text-base">{t('gallery.sub')}</p>
          </div>
          <a
            href={business.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.22em] text-gold inline-flex items-center gap-2 hover:text-gold-bright self-start sm:self-auto"
          >
            <Instagram size={14} aria-hidden="true" />
            {t('gallery.more')}
          </a>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map(f => {
            const active = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.18em] font-semibold border transition-colors ${
                  active
                    ? 'bg-bone text-ink border-bone'
                    : 'border-line text-bone-soft hover:border-gold hover:text-gold-bright'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {items.map((post, idx) => (
            <button
              key={post.shortCode}
              type="button"
              onClick={() => setLightboxIndex(idx)}
              className={`group relative overflow-hidden rounded-2xl bg-ink-3 ${
                post.aspect === 'landscape' ? 'md:col-span-2 aspect-[16/10]' :
                post.aspect === 'square'    ? 'aspect-square' :
                'aspect-[4/5]'
              }`}
            >
              <img
                src={post.poster}
                alt={post.caption}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span
                className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
              />
              <span className="absolute bottom-3 left-3 right-3 text-left text-bone text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                {post.caption}
              </span>
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={items}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}

export type { InstaPost };
