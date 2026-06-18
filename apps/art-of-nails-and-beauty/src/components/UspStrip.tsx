import { Heart, Sparkles, Layers, ShieldCheck } from 'lucide-react';

type Props = { t: (k: string) => string };

const ITEMS = [
  { icon: Heart, t: 'usp.1.t', d: 'usp.1.d' },
  { icon: Sparkles, t: 'usp.2.t', d: 'usp.2.d' },
  { icon: Layers, t: 'usp.3.t', d: 'usp.3.d' },
  { icon: ShieldCheck, t: 'usp.4.t', d: 'usp.4.d' },
] as const;

export default function UspStrip({ t }: Props) {
  return (
    <section className="relative border-y border-wine/8 bg-petal/60">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 md:py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
          {ITEMS.map(({ icon: Icon, t: tt, d }) => (
            <div key={tt} className="reveal flex items-start gap-3.5">
              <span className="grid place-items-center w-10 h-10 rounded-full bg-white/70 ring-1 ring-wine/10 text-wine shrink-0">
                <Icon size={18} />
              </span>
              <div>
                <h3 className="font-serif text-lg leading-snug">{t(tt)}</h3>
                <p className="mt-1 text-sm text-ink-soft leading-relaxed">{t(d)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
