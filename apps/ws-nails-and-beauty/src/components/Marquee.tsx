import { stripItems } from '../data/work';

export default function Marquee() {
  // Duplicate so the loop never shows a gap.
  const items = [...stripItems, ...stripItems];

  return (
    <section aria-label="Recent werk" className="py-10 md:py-14 bg-plum overflow-hidden">
      <div className="relative">
        <div className="flex marquee-track w-max gap-3 md:gap-4 px-3 md:px-6">
          {items.map((m, i) => (
            <div
              key={i}
              className="shrink-0 w-40 md:w-56 aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden bg-plum-soft shadow-[0_18px_40px_-22px_rgba(0,0,0,0.5)]"
            >
              <img
                src={m.src}
                alt={m.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        {/* Fading edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-plum to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-plum to-transparent" />
      </div>
    </section>
  );
}
