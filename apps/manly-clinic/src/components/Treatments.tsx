import { ArrowUpRight } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

const items = [
  { id: 't1', img: '/work/treatment-back.webp' },
  { id: 't2', img: '/work/treatment-chest.webp' },
  { id: 't3', img: '/work/treatment-beard.webp' },
  { id: 't4', img: '/work/treatment-body.webp' },
  { id: 't5', img: '/work/treatment-skin.webp' },
];

export default function Treatments({ t, onBook }: Props) {
  return (
    <section id="behandelingen" className="section-pad-lg">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 md:mb-20">
          <div className="lg:col-span-6">
            <span className="roman">I.</span>
            <span className="kicker block mt-3">{t('treat.kicker')}</span>
            <h2 className="mt-5 text-[40px] md:text-[56px] leading-[1.02]">
              {t('treat.title')}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 lg:pt-6">
            <p className="text-base md:text-lg text-ink-soft leading-relaxed max-w-[42ch]">
              {t('treat.lede')}
            </p>
          </div>
        </div>

        {/* Asymmetric editorial: lead card spans 7 cols, four sibling tiles share the remaining grid. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-ink-line">
          <article className="lg:col-span-7 bg-paper p-8 md:p-12 flex flex-col">
            <div className="aspect-[16/10] mb-8 overflow-hidden bg-paper-deep">
              <img
                src={items[0].img}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')}
              />
            </div>
            <div className="flex items-baseline gap-3">
              <span className="roman">i.</span>
              <h3 className="font-display text-[28px] md:text-[34px] text-ink leading-tight">
                {t(`treat.${items[0].id}.name`)}
              </h3>
            </div>
            <p className="mt-3 text-ink-soft leading-relaxed max-w-[52ch]">
              {t(`treat.${items[0].id}.body`)}
            </p>
            <button
              type="button"
              onClick={onBook}
              className="btn-line mt-8 self-start"
            >
              {t('treat.book')}
              <ArrowUpRight size={14} strokeWidth={1.6} />
            </button>
          </article>

          <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-px bg-ink-line">
            {items.slice(1).map((it, idx) => (
              <article
                key={it.id}
                className={`bg-paper p-6 md:p-8 flex flex-col ${
                  idx === 3 ? 'md:col-span-2' : ''
                }`}
              >
                <div className="aspect-[4/3] mb-5 overflow-hidden bg-paper-deep">
                  <img
                    src={it.img}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')}
                  />
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="roman">{['ii.', 'iii.', 'iv.', 'v.'][idx]}</span>
                  <h3 className="font-display text-[22px] md:text-[26px] leading-tight">
                    {t(`treat.${it.id}.name`)}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                  {t(`treat.${it.id}.body`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
