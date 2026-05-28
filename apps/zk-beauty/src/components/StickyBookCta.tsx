import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { contact } from '../data/contact';

type Props = { t: (k: string) => string };

export default function StickyBookCta({ t }: Props) {
  const [show, setShow] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const io = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { rootMargin: '0px 0px -20% 0px' },
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  if (!show || footerVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden px-4 pt-3 safe-bottom pointer-events-none">
      <a
        href={contact.bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto w-full bg-ink text-ivory rounded-full py-4 pl-6 pr-5 text-xs font-medium tracking-[0.22em] uppercase flex items-center justify-center gap-2 shadow-[0_18px_40px_-12px_rgba(26,24,22,0.6)]"
      >
        {t('nav.book')}
        <ArrowUpRight size={16} />
      </a>
    </div>
  );
}
