import { Phone, Mail } from 'lucide-react';
import LogoMark from './LogoMark';

type Props = {
  t: (key: string) => string;
  onIntake: () => void;
};

export default function Footer({ t, onIntake }: Props) {
  const year = new Date().getFullYear();
  return (
    <footer id="contact" className="relative bg-night-deep border-t border-mist">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Brand block */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <LogoMark variant="compact" className="h-10 w-10" />
              <div className="leading-none">
                <div className="font-display text-silver text-[16px] tracking-[0.14em] font-bold">XENON</div>
                <div className="font-display text-steel-mute text-[10.5px] tracking-[0.32em] uppercase mt-1">
                  Security
                </div>
              </div>
            </div>
            <p className="mt-5 text-steel/80 text-[14px] max-w-md leading-relaxed">
              {t('footer.tagline')}. Camerabeveiliging, portiers en gastheren, nachtportiers, verkeersregelaars, winkelbeveiliging, persoonlijke inzet en spoedhulp. {t('trust.hours')}.
            </p>
            <button type="button" onClick={onIntake} className="btn-xenon mt-7">
              {t('nav.cta')}
            </button>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-silver text-[12px] uppercase tracking-[0.22em]">
              {t('footer.contact')}
            </h3>
            <ul className="mt-5 space-y-3 text-[14px] text-steel/85">
              <li>
                <a href="tel:+31645172726" className="inline-flex items-center gap-2 hover:text-silver transition-colors">
                  <Phone size={13} className="text-xenon-bright" aria-hidden />
                  <span className="font-mono">06 45 17 27 26</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@xenonsecurity.nl" className="inline-flex items-center gap-2 hover:text-silver transition-colors">
                  <Mail size={13} className="text-xenon-bright" aria-hidden />
                  <span>info@xenonsecurity.nl</span>
                </a>
              </li>
              <li className="spec-line text-steel-mute pt-1">{t('trust.hours')}</li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-silver text-[12px] uppercase tracking-[0.22em]">
              {t('footer.services')}
            </h3>
            <ul className="mt-5 space-y-2.5 text-[14px] text-steel/85">
              <li><a href="#cameras"   className="hover:text-silver transition-colors">{t('nav.cameras')}</a></li>
              <li><a href="#diensten"  className="hover:text-silver transition-colors">{t('nav.services')}</a></li>
              <li><a href="#werkwijze" className="hover:text-silver transition-colors">{t('nav.method')}</a></li>
              <li><a href="#dekking"   className="hover:text-silver transition-colors">{t('nav.coverage')}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-silver text-[12px] uppercase tracking-[0.22em]">
              {t('footer.legal')}
            </h3>
            <ul className="mt-5 space-y-2.5 text-[14px] text-steel/85">
              <li><a href="#" className="hover:text-silver transition-colors">{t('footer.privacy')}</a></li>
              <li><a href="#" className="hover:text-silver transition-colors">{t('footer.terms')}</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-mist">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-steel-mute spec-line">
          <span>{t('footer.copy')} {year}</span>
          <span>{t('footer.built')}</span>
        </div>
      </div>
    </footer>
  );
}
