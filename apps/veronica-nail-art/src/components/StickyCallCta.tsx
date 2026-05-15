import { useEffect, useState } from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export default function StickyCallCta() {
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
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-4 safe-bottom pt-10 bg-gradient-to-t from-cream via-cream/95 to-transparent pointer-events-none">
      <div className="flex gap-2">
        <a
          href="tel:+31611087951"
          className="pointer-events-auto flex-1 bg-gold text-cream rounded-full py-3.5 font-medium flex items-center justify-center gap-2 shadow-[0_10px_30px_-8px_rgba(176,134,58,0.6)]"
        >
          <Phone size={18} />
          Bel direct
        </a>
        <a
          href="https://wa.me/31611087951"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="pointer-events-auto w-14 bg-ink text-cream rounded-full py-3.5 flex items-center justify-center shadow-[0_10px_30px_-8px_rgba(32,33,42,0.6)]"
        >
          <MessageCircle size={18} />
        </a>
      </div>
    </div>
  );
}
