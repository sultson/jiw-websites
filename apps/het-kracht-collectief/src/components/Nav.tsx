import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import type { Content, Lang } from "../content";
import { Link, useRouter } from "../router";
import LangToggle from "./LangToggle";
import { useAanvraag } from "./AanvraagModal";

type Props = { c: Content; lang: Lang; setLang: (l: Lang) => void };

const PHONE_DISPLAY = "(06) 11 69 40 81";

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="inline-flex items-center transition-opacity hover:opacity-80"
      aria-label="Het Kracht Collectief"
    >
      <img
        src="/logo.png"
        alt="Het Kracht Collectief"
        width={48}
        height={48}
        className="h-11 w-11 sm:h-12 sm:w-12"
      />
    </Link>
  );
}

export default function Nav({ c, lang, setLang }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { path } = useRouter();
  const { open: openAanvraag } = useAanvraag();
  const ctaProfile = path.startsWith("/werkgever") ? "werkgever" : "werknemer";
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(PHONE_DISPLAY);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1600);
  };

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // When the overlay opens: move focus into it, close on Escape, and restore
  // focus to the trigger on close.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
  }, [open]);

  const links: { label: string; to: string }[] = [
    { label: c.nav.aanpak, to: "/#aanpak" },
    { label: c.nav.sectoren, to: "/#sectoren" },
    { label: c.nav.werknemer, to: "/werknemer" },
    { label: c.nav.werkgever, to: "/werkgever" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-ink bg-white">
      <div className="shell flex h-[4.25rem] items-center justify-between gap-4 sm:h-[4.75rem]">
        <Brand />

        <nav className="hidden items-center gap-9 lg:flex" aria-label={c.nav.primaryNav}>
          {links.map((l) => {
            const active = path === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`label transition-colors hover:text-ink ${active ? "text-ink" : "text-steel"}`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <LangToggle lang={lang} setLang={setLang} />
          <button
            type="button"
            onClick={copyPhone}
            aria-label={`${PHONE_DISPLAY} — ${c.nav.copied}`}
            className="whitespace-nowrap font-mono text-[0.74rem] font-bold tracking-tight text-ink transition-colors hover:text-steel sm:text-[0.85rem]"
          >
            {copied ? c.nav.copied : PHONE_DISPLAY}
          </button>
          <button
            type="button"
            onClick={() => openAanvraag(ctaProfile)}
            className="btn btn-solid hidden h-11 min-h-0 px-5 py-0 text-[0.8rem] sm:inline-flex"
          >
            {c.nav.cta}
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </button>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-haspopup="dialog"
            className="grid h-11 w-11 place-items-center border border-ink bg-white text-ink transition-colors hover:bg-ink hover:text-bone lg:hidden"
            aria-label={c.nav.menu}
          >
            <Menu size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={c.nav.menu}
          className="fixed inset-0 z-[60] flex flex-col bg-ink text-bone on-dark lg:hidden"
        >
          <div className="shell flex h-16 items-center justify-between border-b border-line-dark sm:h-[4.5rem]">
            <span className="font-display text-sm font-medium uppercase tracking-[0.02em]">Het Kracht Collectief</span>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-11 w-11 place-items-center border border-bone text-bone transition-colors hover:bg-bone hover:text-ink"
              aria-label={c.nav.close}
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-1 px-5 sm:px-8" aria-label={c.nav.mobileNav}>
            {links.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 border-b border-line-dark py-6 font-display text-4xl font-light uppercase tracking-[-0.01em] transition-colors hover:text-fog sm:text-5xl"
              >
                <span className="font-mono text-sm font-bold text-fog">0{i + 1}</span>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-between gap-4 px-5 pb-8 sm:px-8">
            <LangToggle lang={lang} setLang={setLang} tone="dark" />
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openAanvraag(ctaProfile);
              }}
              className="btn btn-solid-inv flex-1 max-w-[15rem]"
            >
              {c.nav.cta}
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
