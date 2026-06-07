import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import type { Content, Profile } from "../content";
import AanvraagForm from "./AanvraagForm";

type AanvraagContext = { open: (profile?: Profile) => void };

const Ctx = createContext<AanvraagContext>({ open: () => {} });

export function useAanvraag() {
  return useContext(Ctx);
}

export function AanvraagProvider({ c, children }: { c: Content; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<Profile>("werknemer");

  const open = useCallback((p?: Profile) => {
    if (p) setProfile(p);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <AanvraagModal c={c} open={isOpen} profile={profile} setProfile={setProfile} onClose={close} />
    </Ctx.Provider>
  );
}

function AanvraagModal({
  c,
  open,
  profile,
  setProfile,
  onClose,
}: {
  c: Content;
  open: boolean;
  profile: Profile;
  setProfile: (p: Profile) => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const successTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  useEffect(() => () => clearTimeout(successTimer.current), []);

  const handleSuccess = useCallback(() => {
    clearTimeout(successTimer.current);
    successTimer.current = setTimeout(onClose, 3500);
  }, [onClose]);

  if (!open) return null;

  const p = c.pages[profile];
  const options: { value: Profile; label: string }[] = [
    { value: "werknemer", label: c.hero.werknemerBtn },
    { value: "werkgever", label: c.hero.werkgeverBtn },
  ];

  return (
    <div
      className="fixed inset-0 z-[90] flex justify-center bg-ink/85 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={p.formTitle}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex max-h-[100dvh] w-full flex-col bg-white sm:max-h-[calc(100dvh-3rem)] sm:max-w-3xl sm:border sm:border-ink">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-ink px-5 py-4 sm:px-8 sm:py-5">
          <h2 className="min-w-0 text-[clamp(1.4rem,4vw,2rem)] leading-[1.0]">{p.formTitle}</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={c.form.close}
            className="grid h-10 w-10 shrink-0 place-items-center border border-ink text-ink transition-colors hover:bg-ink hover:text-bone"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
          {/* Profile toggle */}
          <div
            className="grid grid-cols-2 border border-ink"
            role="group"
            aria-label={c.form.profileToggleLabel}
          >
            {options.map((o, i) => {
              const active = profile === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setProfile(o.value)}
                  aria-pressed={active}
                  className={`px-4 py-2.5 font-display text-sm font-medium uppercase tracking-[0.02em] transition-colors ${
                    i === 0 ? "border-r border-ink" : ""
                  } ${active ? "bg-ink text-bone" : "bg-white text-steel hover:text-ink"}`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <AanvraagForm c={c} profile={profile} bare onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
}
