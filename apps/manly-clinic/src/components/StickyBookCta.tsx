import { useEffect, useState } from 'react';

type Props = { t: (k: string) => string; onBook: () => void; hidden?: boolean };

export default function StickyBookCta({ t, onBook, hidden }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show || hidden) return null;

  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-30 bg-paper/95 backdrop-blur border-t border-ink-line safe-bottom">
      <div className="px-4 py-3">
        <button type="button" onClick={onBook} className="btn-copper w-full">
          {t('nav.book')}
        </button>
      </div>
    </div>
  );
}
