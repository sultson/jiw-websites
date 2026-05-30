import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void; hidden?: boolean };

export default function StickyBookCta({ t, onBook, hidden }: Props) {
  const [show, setShow] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 440);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector('footer');
    const visit = document.getElementById('bezoek');
    const targets = [footer, visit].filter(Boolean) as Element[];
    if (!targets.length) return;
    const visibility = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => visibility.set(e.target, e.isIntersecting));
        setFooterVisible(Array.from(visibility.values()).some(Boolean));
      },
      { rootMargin: '0px 0px -20% 0px' },
    );
    targets.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  if (!show || hidden || footerVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-4 safe-bottom pt-3 pointer-events-none">
      <button
        onClick={onBook}
        className="pointer-events-auto w-full bg-sumi text-shoji py-4 text-[12px] font-medium tracking-[0.2em] uppercase flex items-center justify-center gap-3 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)]"
        style={{ borderRadius: 1 }}
      >
        {t('sticky.book')}
        <ArrowUpRight size={16} />
      </button>
    </div>
  );
}
