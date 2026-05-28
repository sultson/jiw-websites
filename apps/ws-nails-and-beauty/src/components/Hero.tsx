import { ArrowRight, Star } from 'lucide-react';
import { heroTiles } from '../data/work';

type Props = { t: (k: string) => string; onBook: () => void };

// Absolute-positioned tiles for desktop. Top is the % from the top of the canvas.
// Width/height in % of the canvas. Rotation in deg.
type TilePos = { top: string; left: string; width: string; height: string; rotate: number; z: number; anim: 'a' | 'b' | 'c' };

const positions: TilePos[] = [
  { top: '6%',  left: '4%',   width: '20%', height: '38%', rotate: -8, z: 4, anim: 'a' },
  { top: '46%', left: '2%',   width: '17%', height: '34%', rotate: 5,  z: 3, anim: 'b' },
  { top: '12%', left: '26%',  width: '22%', height: '52%', rotate: -3, z: 5, anim: 'c' },
  { top: '8%',  left: '52%',  width: '20%', height: '36%', rotate: 6,  z: 4, anim: 'b' },
  { top: '50%', left: '50%',  width: '18%', height: '38%', rotate: -5, z: 3, anim: 'a' },
  { top: '6%',  left: '76%',  width: '20%', height: '46%', rotate: 4,  z: 5, anim: 'c' },
  { top: '58%', left: '76%',  width: '18%', height: '32%', rotate: -7, z: 3, anim: 'b' },
];

export default function Hero({ t, onBook }: Props) {
  return (
    <section id="top" className="relative overflow-x-clip bg-porcelain">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-blush/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 w-[520px] h-[520px] rounded-full bg-rose-soft/30 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-12 pb-16 md:pt-20 md:pb-28">
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          {/* Copy */}
          <div className="lg:col-span-5 relative z-10 max-w-xl w-full min-w-0">
            <span className="inline-block text-[11px] uppercase tracking-[0.28em] text-rose font-medium">
              {t('hero.kicker')}
            </span>
            <h1 className="mt-5 font-serif text-[2.5rem] leading-[1.05] sm:text-6xl md:text-[4.25rem] text-plum whitespace-pre-line">
              {t('hero.title')}
            </h1>
            <p className="mt-6 text-plum/75 text-base md:text-lg leading-relaxed">
              {t('hero.sub')}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={onBook} className="btn-rose">
                {t('hero.ctaBook')}
                <ArrowRight size={16} />
              </button>
              <a href="#werk" className="btn-outline">
                {t('hero.ctaWork')}
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-plum/8 text-plum/70 tracking-wide">
                {t('hero.badge1')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-plum/8 text-plum/70 tracking-wide">
                {t('hero.badge2')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-plum/8 text-plum/70 tracking-wide">
                <Star size={11} className="fill-rose text-rose" />
                {t('hero.badge3')}
              </span>
            </div>
          </div>

          {/* Collage */}
          <div className="lg:col-span-7 relative w-full min-w-0">
            {/* Desktop absolute collage */}
            <div className="hidden md:block relative aspect-[10/8] w-full">
              {heroTiles.map((tile, i) => {
                const p = positions[i];
                return (
                  <div
                    key={tile.src}
                    className={`hero-tile hero-anim-${p.anim}`}
                    style={{
                      top: p.top,
                      left: p.left,
                      width: p.width,
                      height: p.height,
                      transform: `rotate(${p.rotate}deg)`,
                      zIndex: p.z,
                    }}
                  >
                    <img
                      src={tile.src}
                      alt={tile.alt}
                      loading={i < 3 ? 'eager' : 'lazy'}
                      fetchPriority={i === 2 ? 'high' : undefined}
                    />
                  </div>
                );
              })}
            </div>
            {/* Mobile horizontal scroller */}
            <div className="md:hidden -mx-5 overflow-x-auto no-scrollbar touch-pan-x">
              <div className="flex gap-3 px-5 pb-2 snap-x snap-mandatory w-max">
                {heroTiles.map((tile, i) => (
                  <div
                    key={tile.src}
                    className="shrink-0 w-44 aspect-[4/5] rounded-2xl overflow-hidden bg-blush snap-center shadow-[0_14px_40px_-20px_rgba(42,24,32,0.35)]"
                  >
                    <img
                      src={tile.src}
                      alt={tile.alt}
                      loading={i < 2 ? 'eager' : 'lazy'}
                      fetchPriority={i === 0 ? 'high' : undefined}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
