/**
 * PortfolioDrift — three-column kinetic photo wall for the Hero.
 *
 * Replaces the static flagship hero image with a continuous, asymmetric drift:
 * three columns of photos moving at different speeds and directions, framed
 * inside a contact-sheet header. Twelve unique photos visible across columns,
 * no overlap with the Werk grid or Behang band.
 *
 * Why this over a slideshow:
 * - 12 photos visible at once vs 1 in a slideshow.
 * - Continuous kinetic motion = constantly fresh visual without UI controls.
 * - Asymmetric speeds + reversed middle column = the loop never feels mechanical.
 * - Pause-on-hover lets curious eyes inspect detail without clicking.
 *
 * Performance: each column is a flex stack rendered twice (originals +
 * duplicates). A single CSS translateY animation drives the whole column,
 * promoted to its own layer via will-change. No JS in the hot loop.
 *
 * Reduced motion: animations are collapsed by the global rule in index.css,
 * leaving a static contact-sheet grid. Still legible, still curated.
 */
import { driftColA, driftColB, driftColC, type WorkItem } from '../data/work';

export default function PortfolioDrift() {
  return (
    <figure className="mt-12 lg:mt-16 rise-in-delay-4">
      {/* Contact-sheet header bar — borrows the Vakkaart sheet language */}
      <div className="flex items-center justify-between gap-4 mb-3 text-[11px] font-mono uppercase tracking-[0.22em] text-ink-mute">
        <span>№ III · Portfolio</span>
        <span className="hidden sm:inline">12 projecten · Eindhoven · de Kempen</span>
        <span className="hidden md:inline">Live · uit ons archief</span>
      </div>

      <div className="drift-stage relative overflow-hidden bg-paper-deep border border-ink/10 h-[440px] sm:h-[520px] lg:h-[600px]">
        <div className="absolute inset-0 grid grid-cols-3 gap-2 sm:gap-3 px-2 sm:px-3">
          <DriftColumn items={driftColA} mode="down" duration="56s" />
          <DriftColumn items={driftColB} mode="up"   duration="72s" />
          <DriftColumn items={driftColC} mode="down" duration="48s" />
        </div>

        {/* Edge fades top and bottom for a printed contact-sheet feel. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-16 sm:h-24"
          style={{ background: 'linear-gradient(to bottom, var(--color-paper-deep), transparent)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 sm:h-24"
          style={{ background: 'linear-gradient(to top, var(--color-paper-deep), transparent)' }}
        />
      </div>
    </figure>
  );
}

function DriftColumn({
  items,
  mode,
  duration,
}: {
  items: WorkItem[];
  mode: 'up' | 'down';
  duration: string;
}) {
  // Duplicate the list so the loop is seamless.
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden">
      <div
        className={`drift-col flex flex-col gap-2 sm:gap-3 ${mode === 'up' ? 'drift-up' : 'drift-down'}`}
        style={{ animationDuration: duration }}
      >
        {doubled.map((item, i) => (
          <div key={`${item.src}-${i}`} className="relative aspect-[3/4] bg-stone overflow-hidden flex-shrink-0">
            <img
              src={item.src}
              alt={item.alt}
              loading={i < items.length ? 'eager' : 'lazy'}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
