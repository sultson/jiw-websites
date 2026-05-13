import { useEffect, useState } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { PHONE_TEL, PHONE_DISPLAY, WHATSAPP_URL } from '../contact';

export default function StickyBookCta() {
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
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-4 safe-bottom pt-3 pointer-events-none">
      <div className="pointer-events-auto flex gap-2">
        <a
          href={PHONE_TEL}
          className="flex-1 bg-gold text-cream rounded-full py-3 font-medium flex items-center justify-center gap-2 shadow-[0_10px_30px_-8px_rgba(168,69,94,0.5)]"
        >
          <Phone size={16} />
          Bel {PHONE_DISPLAY}
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-espresso border border-espresso/15 rounded-full py-3 px-5 font-medium flex items-center justify-center gap-2 shadow-[0_10px_30px_-8px_rgba(44,26,16,0.25)]"
        >
          <MessageCircle size={16} />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
