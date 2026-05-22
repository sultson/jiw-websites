import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Lightbox from './Lightbox';

type Props = { t: (k: string) => string };

type RailItem =
  | { kind: 'video'; src: string; poster: string; alt: string }
  | { kind: 'image'; src: string; alt: string };

const items: RailItem[] = [
  { kind: 'video', src: '/reel-selfcare.mp4',       poster: '/reel-selfcare-poster.webp',       alt: 'Self-care moment in de praktijk' },
  { kind: 'image', src: '/work-06-facial.webp',      alt: 'Gezichtsbehandeling met masker' },
  { kind: 'video', src: '/reel-laser-body.mp4',     poster: '/reel-laser-body-poster.webp',     alt: 'Laserontharing lichaam' },
  { kind: 'image', src: '/work-04-laser-precisie.webp', alt: 'Precisielaser met de GentleMax Pro Plus' },
  { kind: 'image', src: '/work-05-klantervaring.webp',  alt: 'Klantervaring in close-up' },
  { kind: 'video', src: '/reel-microneedling.mp4',  poster: '/reel-microneedling-poster.webp',  alt: 'Micro-needling met de Dermapen 4' },
  { kind: 'image', src: '/work-09-intake.webp',         alt: 'Intake en huidanalyse' },
  { kind: 'image', src: '/work-11-device.webp',         alt: 'GentleMax Pro Plus laserapparaat' },
  { kind: 'image', src: '/work-17-biopeeling.webp',     alt: 'BioPeeling behandeling' },
  { kind: 'image', src: '/work-01-laser-aftekenen.webp',alt: 'Aftekenen voorafgaand aan de laserbehandeling' },
  { kind: 'image', src: '/work-13-microneedling.webp',  alt: 'Micro-needling close-up' },
  { kind: 'image', src: '/work-08-full-body-laser.webp',alt: 'Full body laserontharing' },
];

export default function Gallery({ t }: Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollLeft > 8);
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const videos = el.querySelectorAll<HTMLVideoElement>('video[data-lazy]');
    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            if (!v.src && v.dataset.src) v.src = v.dataset.src;
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { rootMargin: '200px', threshold: 0.25 },
    );
    videos.forEach(v => io.observe(v));
    return () => io.disconnect();
  }, []);

  const lightboxImages = items
    .map((it, i) => (it.kind === 'image' ? { src: it.src, alt: it.alt, originalIndex: i } : null))
    .filter((x): x is { src: string; alt: string; originalIndex: number } => x !== null);

  return (
    <section id="werk" className="py-20 md:py-28 bg-ivory">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 mb-8 md:mb-10">
        <div className="md:flex md:items-end md:justify-between gap-10">
          <div className="max-w-xl">
            <span className="kicker">{t('gallery.kicker')}</span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.08]">{t('gallery.title')}</h2>
            <p className="mt-4 text-ink/65 text-sm md:text-base max-w-md">{t('gallery.sub')}</p>
          </div>
          <div
            className={`hidden md:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-stone transition-opacity ${
              scrolled ? 'opacity-0' : 'opacity-100'
            }`}
            aria-hidden="true"
          >
            <span>{t('gallery.scroll')}</span>
            <ArrowRight size={14} className="nudge-x" />
          </div>
        </div>
      </div>

      <div
        ref={railRef}
        className="no-scrollbar overflow-x-auto pl-5 sm:pl-8 lg:pl-10"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <div className="flex gap-3 md:gap-4 pr-5 sm:pr-8 lg:pr-10 pb-2">
          {items.map((it, i) => (
            <div
              key={i}
              className="shrink-0 w-[16rem] sm:w-[17rem] md:w-[19rem] lg:w-[20rem]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-bone/60 h-[24rem] sm:h-[26rem] md:h-[28rem] lg:h-[30rem]">
                {it.kind === 'video' ? (
                  <video
                    data-lazy
                    data-src={it.src}
                    poster={it.poster}
                    muted
                    playsInline
                    loop
                    preload="none"
                    className="absolute inset-0 w-full h-full object-cover"
                    aria-label={it.alt}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const lightboxPos = lightboxImages.findIndex(li => li.originalIndex === i);
                      setLightboxIdx(lightboxPos >= 0 ? lightboxPos : null);
                    }}
                    className="absolute inset-0 w-full h-full"
                    aria-label={it.alt}
                  >
                    <img
                      src={it.src}
                      alt={it.alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        images={lightboxImages.map(({ src, alt }) => ({ src, alt }))}
        index={lightboxIdx}
        onClose={() => setLightboxIdx(null)}
        onNav={dir =>
          setLightboxIdx(i => {
            if (i === null) return i;
            return (i + dir + lightboxImages.length) % lightboxImages.length;
          })
        }
      />
    </section>
  );
}
