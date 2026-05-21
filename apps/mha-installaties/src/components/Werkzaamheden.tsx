import { useEffect, useState } from 'react';
import { Play, X } from 'lucide-react';
import { werkzaamheden } from '../content';
import Pic from './Pic';

type Item = (typeof werkzaamheden.items)[number];

function TikTokGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M16.5 0h-3.2v16.2a3 3 0 1 1-3-3c.2 0 .4 0 .6.1V9.9a6.4 6.4 0 1 0 5.6 6.4V8.1a8 8 0 0 0 4.7 1.5V6.4a4.7 4.7 0 0 1-4.7-4.7V0Z" />
    </svg>
  );
}

function Card({ item, onPlay }: { item: Item; onPlay: (id: string) => void }) {
  const base =
    'relative w-[78vw] max-w-[340px] shrink-0 overflow-hidden rounded-2xl border border-line bg-ink-3 sm:w-[360px]';

  if (item.type === 'video') {
    return (
      <button
        type="button"
        onClick={() => onPlay(item.tiktokId)}
        aria-label={`TikTok ${item.label}`}
        className={`group ${base} cursor-pointer`}
      >
        <div className="aspect-[4/3] w-full overflow-hidden">
          <Pic
            src={item.src}
            alt={item.label}
            width={360}
            height={270}
            sizes="(max-width: 640px) 78vw, 360px"
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/30" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-semibold text-bone backdrop-blur-sm">
          <TikTokGlyph className="h-3 w-3 text-gold" />
          TikTok
        </span>
        <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-[#c89e48] via-[#f2e394] to-[#b98c41] text-ink shadow-[0_8px_24px_-6px_rgba(0,0,0,0.7)] transition-transform duration-200 group-hover:scale-110">
          <Play size={22} strokeWidth={2.5} className="ml-0.5" fill="currentColor" />
        </span>
        <span className="absolute inset-x-3 bottom-3 text-left text-sm font-semibold text-bone">
          {item.label}
        </span>
      </button>
    );
  }

  return (
    <figure className={base}>
      <div className="aspect-[4/3] w-full overflow-hidden">
        <Pic
          src={item.src}
          alt={item.label}
          width={360}
          height={270}
          sizes="(max-width: 640px) 78vw, 360px"
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
      <figcaption className="absolute inset-x-3 bottom-3 text-sm font-semibold text-bone">
        {item.label}
      </figcaption>
    </figure>
  );
}

function VideoLightbox({ id, onClose }: { id: string; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="TikTok video"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Sluiten"
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-line bg-ink-3 text-bone transition-colors hover:border-gold hover:text-gold"
      >
        <X size={22} aria-hidden="true" />
      </button>
      <div
        className="h-[min(80vh,740px)] w-[min(92vw,325px)] overflow-hidden rounded-2xl bg-ink-3 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          title="TikTok video MHA Installaties"
          src={`https://www.tiktok.com/embed/v2/${id}`}
          className="h-full w-full border-0"
          allow="autoplay; encrypted-media; fullscreen"
          scrolling="no"
        />
      </div>
    </div>
  );
}

export default function Werkzaamheden() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const items = werkzaamheden.items;
  const loop = [...items, ...items];

  return (
    <section id="werkzaamheden" className="section overflow-hidden bg-ink">
      <div className="container-page">
        <span className="eyebrow">{werkzaamheden.eyebrow}</span>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-12">
          <h2 className="max-w-xl text-4xl md:text-5xl">
            Onze <span className="text-gradient-gold">werkzaamheden</span>.
          </h2>
          <div className="max-w-md md:pt-1">
            <p className="text-bone-soft">{werkzaamheden.intro}</p>
            <a
              href={werkzaamheden.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-ink-3 px-4 py-2 text-sm font-medium text-bone transition-colors hover:border-gold hover:text-gold"
            >
              <TikTokGlyph className="h-4 w-4 text-gold" />
              <span>
                <span className="font-semibold">{werkzaamheden.tiktokFollowers}</span> volgers op
                TikTok
              </span>
            </a>
          </div>
        </div>
      </div>

      <div
        className="marquee-viewport mt-12 w-full md:mt-16"
        aria-label="Doorlopende weergave van uitgevoerd werk"
      >
        <div className="marquee-track gap-5 pl-5">
          {loop.map((item, i) => (
            <Card
              key={`${item.label}-${i}`}
              item={item}
              onPlay={setActiveVideo}
            />
          ))}
        </div>
      </div>

      {activeVideo && (
        <VideoLightbox id={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </section>
  );
}
