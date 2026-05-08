import { useState } from 'react';
import { showcase, type ShowcaseItem } from '../data/showcase';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

function altKeyFor(category: ShowcaseItem['category']): string {
  if (category === 'exterior') return 'show.alt.exterior';
  if (category === 'interior') return 'show.alt.interior';
  if (category === 'spray')    return 'show.alt.spray';
  return 'show.alt.werk';
}

export default function Showcase({ t }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const open = (idx: number) => setOpenIdx(idx);
  const close = () => setOpenIdx(null);
  const prev = () => setOpenIdx((i) => (i === null ? null : (i - 1 + showcase.length) % showcase.length));
  const next = () => setOpenIdx((i) => (i === null ? null : (i + 1) % showcase.length));

  return (
    <section id="werk" className="py-20 sm:py-24 lg:py-32 bg-paper-soft border-y border-ink/8">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          <div className="lg:col-span-7">
            <span className="kicker">{t('show.kicker')}</span>
            <h2 className="mt-4 font-bold tracking-[-0.025em] leading-[1.05] max-w-2xl"
                style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
              {t('show.title')}
            </h2>
          </div>
          <p className="lg:col-span-4 lg:col-start-9 text-ink/75 leading-relaxed">
            {t('show.intro')}
          </p>
        </div>

        <div className="mt-14 lg:mt-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {showcase.map((item, i) => {
            const aspect = item.shape === 'wide' ? 'aspect-[4/3]' : item.shape === 'square' ? 'aspect-square' : 'aspect-[3/4]';
            return (
              <button
                key={`${item.src}-${i}`}
                type="button"
                onClick={() => open(i)}
                aria-label={t('show.openImage')}
                className={`group relative overflow-hidden bg-stone ${aspect} ${i === 0 ? 'md:col-span-1 md:row-span-2 md:aspect-auto md:h-full' : ''}`}
              >
                <img
                  src={`/showcase/${item.src}`}
                  alt={t(altKeyFor(item.category))}
                  loading={i < 8 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
              </button>
            );
          })}
        </div>
      </div>

      <Lightbox
        src={openIdx === null ? null : `/showcase/${showcase[openIdx].src}`}
        index={openIdx ?? 0}
        total={showcase.length}
        onClose={close}
        onPrev={prev}
        onNext={next}
        closeLabel={t('show.close')}
        alt={openIdx === null ? '' : t(altKeyFor(showcase[openIdx].category))}
      />
    </section>
  );
}
