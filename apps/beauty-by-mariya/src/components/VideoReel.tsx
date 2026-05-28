import { useEffect, useRef } from 'react';

type Props = { t: (k: string) => string };

const reels = [
  { src: '/reel-01.mp4', poster: '/reel-01-poster.webp' },
  { src: '/reel-02.mp4', poster: '/reel-02-poster.webp' },
  { src: '/reel-03.mp4', poster: '/reel-03-poster.webp' },
  { src: '/reel-04.mp4', poster: '/reel-04-poster.webp' },
  { src: '/reel-05.mp4', poster: '/reel-05-poster.webp' },
  { src: '/reel-07.mp4', poster: '/reel-07-poster.webp' },
  { src: '/reel-08.mp4', poster: '/reel-08-poster.webp' },
  { src: '/reel-09.mp4', poster: '/reel-09-poster.webp' },
  { src: '/reel-10.mp4', poster: '/reel-10-poster.webp' },
];

const doubled = [...reels, ...reels];

export default function VideoReel({ t }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = trackRef.current;
    if (!root) return;
    const vids = Array.from(root.querySelectorAll('video')) as HTMLVideoElement[];

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        });
      },
      { rootMargin: '50px' },
    );

    vids.forEach(v => io.observe(v));
    return () => io.disconnect();
  }, []);

  return (
    <section id="reel" className="py-20 md:py-28 bg-ink text-pearl overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 mb-10 md:mb-14">
        <span className="inline-block text-[11px] uppercase tracking-[0.22em] text-rose-soft font-medium">
          {t('reel.kicker')}
        </span>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl text-pearl">{t('reel.title')}</h2>
        <p className="mt-3 text-sm text-pearl/60 max-w-md">{t('reel.sub')}</p>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div ref={trackRef} className="marquee-track flex gap-4 md:gap-5 w-max">
            {doubled.map((r, i) => (
              <div
                key={i}
                className="relative shrink-0 w-[68vw] sm:w-[44vw] md:w-[280px] lg:w-[300px] aspect-[9/14] rounded-2xl overflow-hidden bg-ink-soft ring-1 ring-pearl/10"
              >
                <video
                  src={r.src}
                  poster={r.poster}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-ink to-transparent" />
      </div>
    </section>
  );
}
