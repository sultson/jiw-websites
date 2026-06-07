import type { SiteContent } from '../i18n';
import { WHATSAPP_URL } from '../data/site';
import Logo from './Logo';

type Props = { c: SiteContent };

export default function Footer({ c }: Props) {
  const year = 2026;
  return (
    <footer className="relative px-4 pb-10 pt-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="glass flex flex-col items-start justify-between gap-6 px-6 py-7 sm:flex-row sm:items-center sm:px-8">
          <div className="glass-scrim" />
          <div className="relative">
            <Logo />
            <p className="mt-2.5 text-[0.95rem] text-ink-faint">{c.footer.tagline}</p>
            <p className="mt-1.5 text-[0.8rem] leading-relaxed text-ink-faint/85">{c.footer.legal}</p>
          </div>
          <div className="relative flex items-center gap-5 text-[0.92rem] text-ink-dim">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">
              WhatsApp
            </a>
            <span className="text-ink-faint">
              © {year} Doelio
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
