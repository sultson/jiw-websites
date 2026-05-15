import { Award, Palette, Sparkles, Heart } from 'lucide-react';

const items = [
  { icon: Award,    title: 'Ervaren nagelstyliste', sub: 'Al jaren een vast adres' },
  { icon: Palette,  title: 'Creatief handwerk',     sub: 'Designs met de hand' },
  { icon: Sparkles, title: 'Netjes & hygiënisch',   sub: 'Zorgvuldig afgewerkt' },
  { icon: Heart,    title: 'Iedereen welkom',       sub: 'Persoonlijke aandacht' },
];

export default function UspStrip() {
  return (
    <section className="relative -mt-12 md:-mt-16 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 bg-white rounded-2xl p-3 md:p-4 shadow-[0_10px_40px_-20px_rgba(32,33,42,0.3)] border border-ink/5">
          {items.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3 p-3 rounded-xl md:hover:bg-cream transition-colors">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-gold">
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink leading-tight">{title}</p>
                <p className="text-xs text-ink/55 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
