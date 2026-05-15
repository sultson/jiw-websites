import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { portfolio, sectionTitles, business } from '../content';
import Lightbox from './Lightbox';

export default function Showcase() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="werk" className="bg-bone-soft relative">
      <div className="container-page py-20 md:py-28">
        <div className="grid lg:grid-cols-12 gap-8 mb-10 lg:mb-14 items-end">
          <div className="lg:col-span-5">
            <span className="eyebrow">{sectionTitles.gallery.eyebrow}</span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05]">
              {sectionTitles.gallery.title}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-base sm:text-lg text-stone leading-relaxed">
              Een doorsnede van schilderwerk en renovaties uit Rotterdam en de regio.
            </p>
            <div className="mt-5 hidden lg:flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-stone font-semibold">
              <span className="font-mono">{portfolio.length} foto's</span>
              <span className="inline-block w-12 h-px bg-line" />
              <span>Rotterdam · Zuid-Holland</span>
            </div>
          </div>
        </div>

        {/* Mobile: uniform grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 lg:hidden">
          {portfolio.map((p, idx) => (
            <Tile key={p.src} p={p} idx={idx} onOpen={setOpenIdx} eager={idx < 6} />
          ))}
        </div>

        {/* Desktop: editorial bento */}
        <div className="hidden lg:grid grid-cols-12 auto-rows-[160px] gap-3">
          {portfolio.map((p, idx) => {
            const layouts: Array<{ col: number; row: number }> = [
              { col: 6, row: 3 },
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
              { col: 6, row: 2 },
              { col: 6, row: 2 },
            ];
            const l = layouts[idx % layouts.length];
            return (
              <Tile
                key={p.src}
                p={p}
                idx={idx}
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
            href={business.trustoo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            Meer werk op Trustoo
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </a>
        </div>
      </div>

      <Lightbox
        open={openIdx !== null}
        images={portfolio}
        index={openIdx ?? 0}
        onClose={() => setOpenIdx(null)}
        onPrev={() =>
          setOpenIdx((i) => (i === null ? null : (i - 1 + portfolio.length) % portfolio.length))
        }
        onNext={() => setOpenIdx((i) => (i === null ? null : (i + 1) % portfolio.length))}
      />
    </section>
  );
}

function Tile({
  p,
  idx,
  onOpen,
  eager,
  style,
  isLead,
}: {
  p: { src: string; alt: string };
  idx: number;
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
      className={`group relative overflow-hidden bg-bone cursor-zoom-in focus:outline-none rounded-xl ${
        style ? '' : 'aspect-square'
      }`}
      aria-label={`Open foto: ${p.alt}`}
    >
      <img
        src={p.src}
        alt={p.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/0 to-ink/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {isLead && (
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 bg-bone/95 text-ink px-2 py-1 text-[10px] uppercase tracking-[0.22em] font-semibold rounded-md">
          <span className="w-1.5 h-1.5 bg-brick rounded-full" />
          Uitgelicht
        </div>
      )}
      <div className="absolute bottom-3 left-3 right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-1 group-hover:translate-y-0">
        <span className="text-[11px] uppercase tracking-[0.22em] text-bone font-semibold drop-shadow">
          {p.alt}
        </span>
      </div>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0">
        <span className="inline-flex items-center justify-center w-9 h-9 bg-bone text-ink rounded-md shadow-md">
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </span>
      </div>
    </button>
  );
}
