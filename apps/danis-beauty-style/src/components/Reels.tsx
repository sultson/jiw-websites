import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Instagram, Play } from 'lucide-react';
import { reels } from '../data/content';
import { business } from '../data/contact';

type Props = { t: (k: string) => string };

export default function Reels({ t }: Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const videos = el.querySelectorAll<HTMLVideoElement>('video[data-lazy]');
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          const video = e.target as HTMLVideoElement;
          if (e.isIntersecting) {
            if (!video.src && video.dataset.src) video.src = video.dataset.src;
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { rootMargin: '200px', threshold: 0.25 },
    );
    videos.forEach(v => io.observe(v));

    const onScroll = () => {
      if (el.scrollLeft > 8) setHintVisible(false);
    };
    el.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      io.disconnect();
      el.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section id="reels" className="section bg-ink-2 border-y border-line text-bone overflow-hidden">
      <div className="container-page">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="kicker">{t('reels.kicker')}</span>
            <h2 className="mt-5 text-4xl md:text-5xl font-serif text-bone">
              {t('reels.title')}
            </h2>
            <p className="mt-4 text-bone-soft text-base">{t('reels.sub')}</p>
          </div>
          <span
            className={`hidden sm:inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-gold font-semibold transition-opacity duration-500 shrink-0 ${
              hintVisible ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden
          >
            {t('reels.hint')}
            <ArrowRight size={14} strokeWidth={1.75} className="nudge-x" />
          </span>
        </div>
      </div>

      <div
        ref={railRef}
        className="mt-10 overflow-x-auto no-scrollbar pl-5 md:pl-8 lg:pl-12"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <div className="flex gap-4 md:gap-5 pr-5 md:pr-8 lg:pr-12 pb-2">
          {reels.map(reel => {
            const isLandscape = reel.aspect === 'landscape';
            const widthClasses = isLandscape
              ? 'w-[18rem] md:w-[24rem] lg:w-[28rem]'
              : 'w-[11rem] md:w-[13.5rem] lg:w-[15.75rem]';
            return (
              <a
                key={reel.shortCode}
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`shrink-0 ${widthClasses} group`}
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="relative overflow-hidden rounded-3xl bg-ink-3 border border-line h-[20rem] md:h-[24rem] lg:h-[28rem]">
                  {reel.video ? (
                    <video
                      data-lazy
                      data-src={reel.video}
                      poster={reel.poster}
                      muted
                      playsInline
                      loop
                      preload="metadata"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={reel.poster}
                      alt={reel.caption}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <span
                    className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <span className="absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 rounded-full bg-ink-3/80 backdrop-blur-sm border border-line text-gold-bright">
                    {reel.video ? <Play size={14} fill="currentColor" /> : <Instagram size={14} />}
                  </span>
                  <span className="absolute bottom-3 left-3 right-3 text-bone text-sm font-medium line-clamp-2">
                    {reel.caption}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <div className="container-page mt-10 flex justify-center">
        <a
          href={business.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          <Instagram size={16} aria-hidden="true" />
          {t('reels.follow')}
        </a>
      </div>
    </section>
  );
}
