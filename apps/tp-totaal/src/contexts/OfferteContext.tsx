import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

type OfferteContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const OfferteContext = createContext<OfferteContextValue | null>(null);

export function OfferteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#offerte' || window.location.hash === '#prijsindicatie') {
        setIsOpen(true);
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  return (
    <OfferteContext.Provider value={{ isOpen, open, close }}>{children}</OfferteContext.Provider>
  );
}

export function useOfferte(): OfferteContextValue {
  const ctx = useContext(OfferteContext);
  if (!ctx) throw new Error('useOfferte must be used within OfferteProvider');
  return ctx;
}
