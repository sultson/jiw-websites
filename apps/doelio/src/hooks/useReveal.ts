import { useEffect } from 'react';

/**
 * Orchestrated reveal-on-scroll. Adds `.is-in` to any `.reveal` element once it
 * enters the viewport. No-op (everything already visible) under reduced motion,
 * which the CSS also enforces.
 */
export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (els.length === 0) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      // Positive bottom margin reveals each element just BEFORE it scrolls into
      // view, so it's already settled by the time it's visible (no mid-scroll pop).
      { rootMargin: '0px 0px 12% 0px', threshold: 0 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
