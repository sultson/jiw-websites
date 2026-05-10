import { useEffect } from 'react';
import { Phone, X, AlertOctagon } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  onIntake: () => void;
  t: (key: string) => string;
};

export default function SpoedModal({ open, onClose, onIntake, t }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-night-deep/85 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md panel-bright p-6 sm:p-8 hud-frame">
        <span className="hud-tl" aria-hidden />
        <span className="hud-br" aria-hidden />

        <button
          type="button"
          onClick={onClose}
          aria-label={t('spoed.modal.close')}
          className="absolute top-3 right-3 w-9 h-9 inline-flex items-center justify-center text-steel-mute hover:text-silver transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 text-xenon-bright">
          <AlertOctagon size={16} aria-hidden />
          <span className="kicker !text-xenon-bright">{t('spoed.kicker')}</span>
        </div>
        <h2 className="mt-3 text-2xl sm:text-3xl text-silver font-display tracking-wide leading-tight">
          {t('spoed.modal.title')}
        </h2>
        <p className="mt-3 text-sm text-steel leading-relaxed">
          {t('spoed.modal.lede')}
        </p>

        <a
          href="tel:+31645172726"
          className="mt-6 group flex items-stretch overflow-hidden border border-xenon-bright/50 bg-xenon hover:bg-xenon-bright transition-colors"
        >
          <span className="flex items-center justify-center w-14 bg-xenon-bright/40 text-silver">
            <Phone size={22} aria-hidden />
          </span>
          <span className="flex-1 px-4 py-4 flex flex-col items-start">
            <span className="font-display text-silver text-[13px] uppercase tracking-[0.18em]">
              {t('spoed.modal.call')}
            </span>
            <span className="font-mono text-silver/90 text-[15px] tracking-tight mt-0.5">
              06 45 17 27 26
            </span>
            <span className="spec-line text-silver/70 mt-1">{t('spoed.modal.call.sub')}</span>
          </span>
        </a>

        <div className="mt-5 flex items-center gap-3">
          <span className="hairline-soft flex-1" aria-hidden />
          <span className="spec-line">{t('spoed.modal.alt')}</span>
          <span className="hairline-soft flex-1" aria-hidden />
        </div>

        <button
          type="button"
          onClick={() => {
            onClose();
            onIntake();
          }}
          className="mt-4 btn-outline w-full"
        >
          {t('spoed.modal.alt.cta')}
        </button>

        <p className="mt-4 spec-line text-steel-mute/80">{t('spoed.note')}</p>
      </div>
    </div>
  );
}
