# JP Schilderwerken — Floating CTA + WhatsApp bubble pattern

Source: `apps/jp-schilderwerken/`

## Overview

- **One component** (`OfferteFab.tsx`) renders BOTH the WhatsApp bubble and the "Prijsindicatie" pill.
- **Mobile-only**: wrapper has `md:hidden` — completely hidden on tablet/desktop.
- WhatsApp bubble is **always visible** (on mobile).
- Prijsindicatie pill appears only after the user scrolls **> 60% of viewport height** (slides up + fades in).
- Both hide when the offerte modal is open (driven by `isOpen` from `OfferteContext`).
- Positioning: `fixed bottom-5 right-5 z-40`, stacked vertically with `flex-col items-end gap-3`.
- The pill calls `open()` from context, which is consumed by `OfferteModal`.
- Modal sits at `z-[100]`, comfortably above the FAB.

## Files referenced

- `/Users/alfred/Projects/jiw-websites/apps/jp-schilderwerken/src/components/OfferteFab.tsx`
- `/Users/alfred/Projects/jiw-websites/apps/jp-schilderwerken/src/components/OfferteModal.tsx`
- `/Users/alfred/Projects/jiw-websites/apps/jp-schilderwerken/src/contexts/OfferteContext.tsx`
- `/Users/alfred/Projects/jiw-websites/apps/jp-schilderwerken/src/App.tsx`
- `/Users/alfred/Projects/jiw-websites/apps/jp-schilderwerken/src/content.ts` (provides `business.phone.whatsapp`)

---

## 1. `OfferteFab.tsx` (FAB + WhatsApp bubble — single file)

```tsx
import { useEffect, useState } from 'react';
import { Paintbrush } from 'lucide-react';
import { useOfferte } from '../contexts/OfferteContext';
import { business } from '../content';

function WhatsAppIcon({ size = 26 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function OfferteFab() {
  const { open, isOpen } = useOfferte();
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolledPast(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const hidden = isOpen;

  return (
    <div
      className={`md:hidden fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 transition-opacity duration-300 ${
        hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <a
        href={business.phone.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Stuur ons een appje"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-6px_rgba(37,211,102,0.55)] hover:scale-105 transition-transform duration-300"
      >
        <WhatsAppIcon size={26} />
      </a>

      <button
        type="button"
        onClick={open}
        aria-label="Vraag gratis prijsindicatie aan"
        className={`inline-flex items-center gap-2 rounded-full bg-saffron text-paper font-semibold pl-5 pr-6 py-3.5 shadow-[0_12px_30px_-8px_rgba(249,123,28,0.55)] transition-all duration-300 ${
          scrolledPast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <Paintbrush size={18} strokeWidth={2} />
        <span>Prijsindicatie</span>
      </button>
    </div>
  );
}
```

### Notes for tp-totaal

- Copy is already `Prijsindicatie` (matches INFO.md "Gratis prijsindicatie / Prijsindicatie" preference). Keep `aria-label="Vraag gratis prijsindicatie aan"`.
- `bg-saffron` / `text-paper` / `shadow rgba(249,123,28,...)` are jp-schilderwerken's Tailwind theme tokens — swap for tp-totaal's palette tokens.
- `business.phone.whatsapp` is a `wa.me` URL — replicate in tp-totaal's `content.ts`.
- `Paintbrush` icon from `lucide-react`.

---

## 2. `OfferteContext.tsx` (open/close state + escape + body lock + `#offerte` deep link)

```tsx
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
      if (window.location.hash === '#offerte') {
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
```

Behavior:
- ESC closes.
- Locks `body` scroll while open.
- `/#offerte` deep link opens modal then strips the hash.

---

## 3. `OfferteModal.tsx` (the modal the FAB opens)

```tsx
import { useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import { useOfferte } from '../contexts/OfferteContext';
import { sectionTitles, usps } from '../content';
import OfferteForm from './OfferteForm';

export default function OfferteModal() {
  const { isOpen, close } = useOfferte();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const previouslyFocused = document.activeElement as HTMLElement | null;
      const focusable = dialogRef.current?.querySelector<HTMLElement>(
        'input, button, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
      return () => previouslyFocused?.focus();
    }
  }, [isOpen]);

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-[100] transition-opacity duration-200 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <button
        type="button"
        aria-label="Sluiten"
        onClick={close}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        tabIndex={isOpen ? 0 : -1}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="offerte-modal-title"
        className={`absolute inset-x-0 bottom-0 md:inset-0 md:m-auto md:h-fit md:max-h-[90vh] md:max-w-3xl md:rounded-2xl bg-bone shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-8 md:translate-y-4'
        }`}
        style={{ maxHeight: 'min(100dvh, 100vh)' }}
      >
        {/* header + body — see source for full content */}
      </div>
    </div>
  );
}
```

Modal pattern highlights:
- `z-[100]` (above FAB's `z-40`).
- Mobile: bottom sheet (`inset-x-0 bottom-0`, slides from `translate-y-8`).
- Desktop: centered card (`md:inset-0 md:m-auto md:max-w-3xl md:rounded-2xl`).
- Focus management: first focusable on open, restore previous on close.
- Backdrop is a `<button>` for click-to-close + keyboard a11y.

---

## 4. Mounting in `App.tsx`

```tsx
import OfferteModal from './components/OfferteModal';
import OfferteFab from './components/OfferteFab';
import { OfferteProvider } from './contexts/OfferteContext';

export default function App() {
  return (
    <OfferteProvider>
      <Nav />
      <main>
        {/* sections */}
      </main>
      <Footer />
      <OfferteFab />
      <OfferteModal />
    </OfferteProvider>
  );
}
```

- Wrap whole app in `OfferteProvider`.
- Mount `OfferteFab` and `OfferteModal` as siblings AFTER `<Footer>` so they sit at the top of the DOM stacking context.

---

## 5. Z-index / positioning / safe-area cheatsheet

| Layer | z-index |
|---|---|
| Nav (if sticky) | `z-30` typical |
| FAB wrapper | `z-40` |
| Modal | `z-[100]` |

- FAB position: `fixed bottom-5 right-5` (20px inset).
- iOS safe-area: jp doesn't currently add `env(safe-area-inset-bottom)`. For tp-totaal you can optionally bump with `style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}` on the wrapper if the buttons feel too close to the home indicator.
- WhatsApp bubble: `w-14 h-14` (56px), brand green `#25D366`.
- Pill: `pl-5 pr-6 py-3.5`, `rounded-full`, `font-semibold`.

## 6. Behavior summary (mobile-only vs desktop)

- **Mobile (<`md` / 768px)**: WhatsApp visible always, Prijsindicatie pill appears after 60% viewport scroll.
- **Desktop (`md`+)**: entire FAB stack hidden via `md:hidden`. Desktop users get the CTA via Nav / Hero / inline section buttons that also call `useOfferte().open()`.
- Both hide when modal is open (`isOpen`), preventing overlap.

## 7. Drop-in checklist for tp-totaal

1. Copy `OfferteContext.tsx` into `apps/tp-totaal/src/contexts/`.
2. Copy `OfferteFab.tsx` — swap `bg-saffron`/`text-paper`/`shadow rgba(...)` for tp-totaal palette tokens.
3. Ensure `content.ts` exports `business.phone.whatsapp` as `https://wa.me/<digits>` (TP Totaal number from INFO.md: `010 321 0928` is a landline, no WhatsApp — confirm a mobile/WA number before wiring).
4. Mount `<OfferteProvider>` + `<OfferteFab />` + `<OfferteModal />` in `App.tsx`.
5. Keep label "Prijsindicatie" on the pill and `aria-label="Vraag gratis prijsindicatie aan"`.
6. Optional: add safe-area inset padding for newer iPhones.
