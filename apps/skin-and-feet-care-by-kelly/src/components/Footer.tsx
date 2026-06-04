import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { site } from '../data/site';

type Props = { t: (k: string) => string };

export default function Footer({ t }: Props) {
  return (
    <footer className="bg-ink text-cream/85">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <span className="font-serif text-2xl text-cream">
              Skin &amp; feet care <span className="text-plum-soft">by Kelly</span>
            </span>
            <p className="mt-4 text-sm text-cream/60 leading-relaxed max-w-xs">{t('footer.tagline')}</p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-plum-soft mb-3">{t('footer.contact')}</p>
            <p className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-plum-soft" />
              {site.address}
            </p>
            <a href={`tel:${site.phoneE164}`} className="flex items-center gap-2 hover:text-cream">
              <Phone size={14} className="shrink-0 text-plum-soft" />
              {site.phoneDisplay}
            </a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-cream break-all">
              <Mail size={14} className="shrink-0 text-plum-soft" />
              {site.email}
            </a>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-plum-soft mb-3">{t('footer.follow')}</p>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-cream">
              <Instagram size={14} className="text-plum-soft" /> {site.instagramHandle}
            </a>
            <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-cream">
              <Facebook size={14} className="text-plum-soft" /> Skin &amp; feet care by Kelly
            </a>
            <div className="pt-2 space-y-1 text-cream/40 text-xs">
              <a href="#over-kelly"    className="block hover:text-cream/70">{t('nav.about')}</a>
              <a href="#behandelingen" className="block hover:text-cream/70">{t('nav.services')}</a>
              <a href="#voetzorg"      className="block hover:text-cream/70">{t('nav.voetzorg')}</a>
              <a href="#bezoek"        className="block hover:text-cream/70">{t('nav.visit')}</a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-cream/40">
          <p>{t('footer.rights')}</p>
          <p>{site.city} · {site.region}</p>
        </div>

        <div className="mt-6 pt-6 border-t border-cream/10 flex justify-center items-center gap-2 text-xs text-cream/40">
          <a href="https://jouwidealewebsite.nl" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-cream">
            <img src="/jiw-logo.png" alt="jouwidealewebsite.nl" className="h-5 w-auto" />
            <span>Gemaakt met liefde door jouwidealewebsite.nl</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
