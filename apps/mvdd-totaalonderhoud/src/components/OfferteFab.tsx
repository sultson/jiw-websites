import { useEffect, useState } from 'react';
import { Paintbrush } from 'lucide-react';
import { useOfferte } from '../contexts/OfferteContext';

export default function OfferteFab() {
  const { open, isOpen } = useOfferte();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const show = visible && !isOpen;

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Vraag offerte aan"
      className={`md:hidden fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-saffron text-ink font-semibold pl-5 pr-6 py-3.5 shadow-[0_10px_30px_-6px_rgba(15,26,46,0.4)] transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
    >
      <Paintbrush size={18} strokeWidth={2} />
      <span>Offerte</span>
    </button>
  );
}
