import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Lightbox from './Lightbox';
import { portfolio } from '../data/portfolio';

type Props = { t: (k: string) => string };

export default function Showcase({ t }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const images = portfolio.map((p) => ({ src: p.src, alt: t(p.altKey) }));

  return (
    <section id="werk" className="bg-cream relative">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-8 mb-10 lg:mb-14 items-end">
          <div className="lg:col-span-5">
            <span className="kicker">{t('show.kicker')}</span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.05]">
              {t('show.title')}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-base sm:text-lg text-charcoal/75 leading-relaxed">{t('show.intro')}</p>
            <div className="mt-5 hidden lg:flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-charcoal/50 font-semibold">
              <span className="font-mono">{portfolio.length} projects</span>
              <span className="inline-block w-12 h-px bg-charcoal/25" />
              <span>Hoeksche Waard · Voorne-Putten · West-Brabant</span>
            </div>
          </div>
        </div>

        {/* Editorial asymmetric grid (desktop) - 12-col bento with hero + ribbon rows.
            Mobile keeps a clean 2-col square grid for legibility. */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 lg:hidden">
          {portfolio.map((p, idx) => (
            <Tile key={p.src} p={p} idx={idx} t={t} onOpen={setOpenIdx} eager={idx < 6} />
          ))}
        </div>

        <div className="hidden lg:grid grid-cols-12 auto-rows-[160px] gap-3">
          {portfolio.map((p, idx) => {
            // Pattern of (col-span, row-span) over 12-col grid.
            // 20 tiles → arranged in repeating editorial cadence.
            const layouts: Array<{ col: number; row: number }> = [
              { col: 6, row: 3 }, // hero lead
              { col: 3, row: 2 },
              { col: 3, row: 2 },
              { col: 3, row: 1 },
              { col: 3, row: 1 },
              { col: 4, row: 2 },
              { col: 4, row: 2 },
              { col: 4, row: 2 },
              { col: 3, row: 2 },
              { col: 6, row: 2 },
              { col: 3, row: 2 },
              { col: 4, row: 1 },
              { col: 4, row: 1 },
              { col: 4, row: 1 },
              { col: 6, row: 2 },
              { col: 3, row: 2 },
              { col: 3, row: 2 },
              { col: 4, row: 2 },
              { col: 4, row: 2 },
              { col: 4, row: 2 },
            ];
            const l = layouts[idx % layouts.length];
            return (
              <Tile
                key={p.src}
                p={p}
                idx={idx}
                t={t}
                onOpen={setOpenIdx}
                eager={idx < 6}
                style={{
                  gridColumn: `span ${l.col} / span ${l.col}`,
                  gridRow: `span ${l.row} / span ${l.row}`,
                }}
                isLead={idx === 0}
              />
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="https://www.werkspot.nl/profiel/sqm-bouwmanagement/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            {t('show.viewAll')}
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </a>
        </div>
      </div>

      <Lightbox
        open={openIdx !== null}
        images={images}
        index={openIdx ?? 0}
        onClose={() => setOpenIdx(null)}
        onPrev={() => setOpenIdx((i) => (i === null ? null : (i - 1 + images.length) % images.length))}
        onNext={() => setOpenIdx((i) => (i === null ? null : (i + 1) % images.length))}
      />
    </section>
  );
}

function Tile({
  p,
  idx,
  t,
  onOpen,
  eager,
  style,
  isLead,
}: {
  p: { src: string; altKey: 'show.alt.dak' | 'show.alt.schilder' | 'show.alt.gevel' | 'show.alt.inspectie' | 'show.alt.werk' };
  idx: number;
  t: (k: string) => string;
  onOpen: (i: number) => void;
  eager: boolean;
  style?: React.CSSProperties;
  isLead?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(idx)}
      style={style}
      className={`group relative overflow-hidden bg-stone-soft cursor-zoom-in focus:outline-none ${
        style ? '' : 'aspect-square'
      }`}
      aria-label={t('show.openImage')}
    >
      <img
        src={p.src}
        alt={t(p.altKey)}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-ink/55 via-charcoal-ink/0 to-charcoal-ink/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {isLead && (
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 bg-cream/95 text-charcoal-ink px-2 py-1 text-[10px] uppercase tracking-[0.22em] font-semibold rounded-sm">
          <span className="w-1.5 h-1.5 bg-orange rounded-full" />
          Featured
        </div>
      )}
      <div className="absolute bottom-3 left-3 right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-1 group-hover:translate-y-0">
        <span className="text-[11px] uppercase tracking-[0.22em] text-cream font-semibold drop-shadow">
          {t(p.altKey)}
        </span>
      </div>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0">
        <span className="inline-flex items-center justify-center w-9 h-9 bg-cream text-charcoal-ink rounded-sm shadow-md">
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </span>
      </div>
    </button>
  );
}
