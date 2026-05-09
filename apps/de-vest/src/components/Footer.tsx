import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react';
import LogoMark from './LogoMark';

type Props = {
  t: (key: string) => string;
  onIntake: () => void;
};

export default function Footer({ t, onIntake }: Props) {
  return (
    <footer id="contact" className="bg-ink text-paper">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 grid lg:grid-cols-12 gap-y-12 gap-x-10">
        <div className="lg:col-span-5">
          <LogoMark tone="light" animate={false} className="h-14 w-auto" />
          <p className="mt-6 text-paper/75 text-base sm:text-lg leading-relaxed max-w-[42ch]">
            {t('footer.tagline')}
          </p>
          <button type="button" onClick={onIntake} className="btn-orange mt-7">
            {t('nav.cta')}
          </button>
        </div>

        <div className="lg:col-span-3">
          <h4 className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55 mb-4">
            {t('footer.contact')}
          </h4>
          <ul className="space-y-3 text-paper/85 text-sm">
            <li>
              <a href="tel:+31653860031" className="flex items-center gap-2.5 hover:text-paper transition-colors">
                <Phone size={14} className="text-orange" aria-hidden />
                <span className="font-mono">06 53 86 00 31</span>
              </a>
            </li>
            <li>
              <a
                href="mailto:toon@devestschilderwerken.nl"
                className="flex items-center gap-2.5 hover:text-paper transition-colors break-all"
              >
                <Mail size={14} className="text-orange flex-shrink-0" aria-hidden />
                <span>toon@devestschilderwerken.nl</span>
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={14} className="text-orange mt-0.5 flex-shrink-0" aria-hidden />
              <span>{t('footer.address')}</span>
            </li>
          </ul>

          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://www.instagram.com/de_vest_schilderwerken/"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram"
              className="w-9 h-9 inline-flex items-center justify-center border border-paper/20 hover:border-paper transition-colors"
            >
              <Instagram size={15} />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100054338869371"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Facebook"
              className="w-9 h-9 inline-flex items-center justify-center border border-paper/20 hover:border-paper transition-colors"
            >
              <Facebook size={15} />
            </a>
            <a
              href="https://www.linkedin.com/in/toon-hoevenaars-377900376/"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
              className="w-9 h-9 inline-flex items-center justify-center border border-paper/20 hover:border-paper transition-colors"
            >
              <Linkedin size={15} />
            </a>
          </div>
        </div>

        <div className="lg:col-span-4">
          <h4 className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55 mb-4">
            № III · drie generaties
          </h4>
          <p className="text-paper/75 text-sm leading-relaxed max-w-[42ch]">
            Antoon · 1930 · Schildersbedrijf Hoevenaars.
            <br />
            Pierre · jaren ’70 · De Vest Schilderwerken.
            <br />
            Toon · vandaag · zelfde vak, frisse plannen.
          </p>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center gap-x-6 gap-y-2 justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-paper/45">
          <span>{t('footer.legal')}</span>
          <span>{t('footer.copy')}</span>
          <span>
            {t('footer.built')} <a href="https://jouwidealewebsite.nl" target="_blank" rel="noreferrer noopener" className="hover:text-paper transition-colors">{t('footer.builtName')}</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
