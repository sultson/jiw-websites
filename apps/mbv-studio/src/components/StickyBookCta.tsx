import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void; hidden?: boolean };

export default function StickyBookCta({ t, onBook, hidden }: Props) {
  const [show, setShow] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      // Show once past the hero, and prefer to reveal while scrolling down.
      if (y > 500 && y >= last) setShow(true);
      else if (y < 400) setShow(false);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const io = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  if (!show || hidden || footerVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-4 safe-bottom pt-3 pointer-events-none">
      {/* leave room on the right for the WhatsApp bubble */}
      <button
        onClick={onBook}
        className="pointer-events-auto w-[calc(100%-4.5rem)] bg-ink text-cream rounded-full py-3.5 font-medium text-xs uppercase tracking-[0.18em] flex items-center justify-center gap-2 shadow-[0_12px_30px_-10px_rgba(42,34,29,0.6)]"
      >
        <Calendar size={17} />
        {t('nav.book')}
      </button>
    </div>
  );
}
