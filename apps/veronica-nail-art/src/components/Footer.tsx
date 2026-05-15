import { MapPin, Phone, Instagram, Facebook, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/85">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <span className="font-serif text-2xl text-cream">
              Veronica <span className="text-gold-soft">Nail Art</span>
            </span>
            <p className="mt-4 text-sm text-cream/60 leading-relaxed max-w-xs">
              Verzorgde nagels en handgeschilderde nail art in Emmeloord. Met aandacht, vakwerk
              en rustig de tijd voor jou.
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold-soft mb-3">Contact</p>
            <p className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-gold-soft" />
              Boelenshage 12, 8302 TJ Emmeloord
            </p>
            <a href="tel:+31611087951" className="flex items-center gap-2 hover:text-cream transition-colors">
              <Phone size={14} className="shrink-0 text-gold-soft" />
              06 11087951
            </a>
            <a
              href="https://wa.me/31611087951"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cream transition-colors"
            >
              <MessageCircle size={14} className="shrink-0 text-gold-soft" />
              WhatsApp
            </a>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold-soft mb-3">Volg & ontdek</p>
            <a
              href="https://www.instagram.com/veronica_nailsalon/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cream transition-colors"
            >
              <Instagram size={14} className="text-gold-soft" /> @veronica_nailsalon
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100003258919588"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cream transition-colors"
            >
              <Facebook size={14} className="text-gold-soft" /> Veronica Nails Art
            </a>
            <div className="mt-5 pt-5 border-t border-cream/10 space-y-1.5 text-cream/45 text-xs">
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold-soft/80 mb-2">Op deze pagina</p>
              <a href="#behandelingen" className="block hover:text-cream/80 transition-colors">Behandelingen</a>
              <a href="#werk"          className="block hover:text-cream/80 transition-colors">Foto's</a>
              <a href="#recensies"     className="block hover:text-cream/80 transition-colors">Recensies</a>
              <a href="#bezoek"        className="block hover:text-cream/80 transition-colors">Bezoek</a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-cream/40">
          <p>© {new Date().getFullYear()} Veronica Nail Art. Alle rechten voorbehouden.</p>
          <p>Emmeloord · Noordoostpolder</p>
        </div>

        <div className="mt-6 pt-6 border-t border-cream/10 flex justify-center items-center gap-2 text-xs text-cream/40">
          <a
            href="https://jouwidealewebsite.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-cream"
          >
            <img src="/jiw-logo.png" alt="jouwidealewebsite.nl" className="h-5 w-auto" />
            <span>Gemaakt met liefde door jouwidealewebsite.nl</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
