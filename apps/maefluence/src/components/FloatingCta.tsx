import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import CalButton from './CalButton';

type Props = { t: (k: string) => string };

export default function FloatingCta({ t }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 transition-all duration-300 md:hidden ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <CalButton className="inline-flex items-center gap-2 bg-coffee text-bone px-5 py-3.5 rounded-full text-[12px] uppercase tracking-[0.22em] font-medium shadow-[0_12px_30px_-10px_rgba(84,69,65,0.6)]">
        <Calendar size={16} strokeWidth={1.5} />
        {t('cta.float')}
      </CalButton>
    </div>
  );
}
