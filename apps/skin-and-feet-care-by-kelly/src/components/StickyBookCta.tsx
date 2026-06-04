import { useEffect, useState } from 'react';
import { CalendarHeart } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void; hidden?: boolean };

/**
 * Anchored bottom-left so it never collides with the WhatsApp bubble
 * (which lives bottom-right). Appears after a little scrolling, hides over the footer.
 */
export default function StickyBookCta({ t, onBook, hidden }: Props) {
  const [show, setShow] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
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
    <div
      className="fixed bottom-4 left-4 z-40 md:hidden"
      style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <button
        onClick={onBook}
        className="inline-flex items-center gap-2 bg-ink text-cream rounded-full pl-4 pr-5 py-3 text-sm font-medium shadow-[0_10px_30px_-8px_rgba(43,27,51,0.6)] active:scale-95 transition-transform"
      >
        <CalendarHeart size={18} className="text-plum-soft" />
        {t('nav.bookShort')}
      </button>
    </div>
  );
}
