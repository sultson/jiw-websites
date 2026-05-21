import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { portfolio } from '../data/portfolio';

type Props = {
  t: (k: string) => string;
};

export default function PortfolioStrip({ t }: Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const videos = el.querySelectorAll<HTMLVideoElement>('video[data-lazy]');
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) {
            if (!v.src) v.src = v.dataset.src!;
            v.play().catch(() => {});
          } else {
            v.pause();
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
    <section className="py-24 lg:py-32 bg-coffee text-bone">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex items-end justify-between gap-8 mb-10 lg:mb-14">
          <h2 className="display-lg text-bone max-w-3xl">
            {t('home.portfolio.title')}
          </h2>
          <span
            className={`hidden sm:inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-sand font-semibold transition-opacity duration-500 shrink-0 ${
              hintVisible ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden
          >
            {t('home.portfolio.hint')}
            <ArrowRight size={14} strokeWidth={1.75} className="nudge-x" />
          </span>
        </div>
      </div>

      <div
        ref={railRef}
        className="overflow-x-auto no-scrollbar pl-6 lg:pl-10"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <div className="flex gap-6 pr-6 lg:pr-10 pb-2">
          {portfolio.map(item => {
            const isPortrait = item.aspect === 'portrait';
            const widthClasses = isPortrait
              ? 'w-[11.25rem] md:w-[13.5rem] lg:w-[15.75rem]'
              : 'w-[35.55rem] md:w-[42.67rem] lg:w-[49.78rem]';
            return (
              <div
                key={item.id}
                className={`shrink-0 ${widthClasses}`}
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="relative overflow-hidden rounded-3xl bg-coffee-soft/40 h-[20rem] md:h-[24rem] lg:h-[28rem]">
                  <video
                    data-lazy
                    data-src={item.src}
                    poster={item.poster}
                    muted
                    playsInline
                    loop
                    preload="none"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
