import { Instagram, Facebook, MapPin } from 'lucide-react';
import { business } from '../data/contact';

type Props = { t: (k: string) => string };

export default function Footer({ t }: Props) {
  return (
    <footer className="bg-ink border-t border-line pt-14 pb-10">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <a href="#top" className="inline-flex items-center gap-3">
              <img
                src="/dani-logo.png"
                alt="Dani's beauty style"
                width={140}
                height={70}
                className="h-12 w-auto"
              />
            </a>
            <p className="mt-5 text-bone-soft text-sm max-w-md leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">{t('visit.kicker')}</p>
            <address className="mt-3 not-italic text-sm text-bone-soft leading-relaxed">
              <a
                href={business.google}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-2 hover:text-gold-bright"
              >
                <MapPin size={14} className="mt-1 shrink-0" aria-hidden="true" />
                <span>
                  Scheldestraat 39<br />
                  1823 WD Alkmaar
                </span>
              </a>
              <br />
              <a href={business.phone.href} className="mt-3 inline-block hover:text-gold-bright">
                {business.phone.display}
              </a>
            </address>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">{t('footer.follow')}</p>
            <div className="mt-3 flex gap-3">
              <a
                href={business.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-bone-soft hover:text-gold-bright hover:border-gold"
              >
                <Instagram size={16} />
              </a>
              <a
                href={business.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-bone-soft hover:text-gold-bright hover:border-gold"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-mute">{t('footer.rights')}</p>
          <p className="text-xs text-mute">
            Website door{' '}
            <a
              href="https://jouwidealewebsite.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone-soft hover:text-gold-bright"
            >
              jouwidealewebsite.nl
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
