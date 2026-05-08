import { Compass, Eye, ShieldCheck, Trophy } from 'lucide-react';

type Props = { t: (k: string) => string };

const pillars = [
  { icon: Compass,     k: 'usp.structuur',  ks: 'usp.structuurSub' },
  { icon: Eye,         k: 'usp.inzicht',    ks: 'usp.inzichtSub' },
  { icon: ShieldCheck, k: 'usp.kwaliteit',  ks: 'usp.kwaliteitSub' },
  { icon: Trophy,      k: 'usp.resultaat',  ks: 'usp.resultaatSub' },
];

export default function Pillars({ t }: Props) {
  return (
    <section className="bg-charcoal-ink text-cream relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06] bg-blueprint pointer-events-none" aria-hidden />
      {/* orange marker top-left */}
      <div className="absolute top-0 left-0 w-16 sm:w-24 h-1 bg-orange" aria-hidden />

      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <span className="kicker text-orange-soft">{t('usp.kicker')}</span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cream leading-[1.05]">
              {t('usp.title')}
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 hidden lg:block">
            <div className="font-mono text-[11px] tracking-[0.22em] text-cream/40 uppercase">
              <span className="inline-block w-8 h-px bg-cream/30 align-middle mr-3" />
              Heinenoord · sinds 2000
            </div>
          </div>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-cream/15">
          {pillars.map(({ icon: Icon, k, ks }, i) => (
            <div key={k} className="bg-charcoal-ink p-6 sm:p-8 group hover:bg-charcoal-soft/40 transition-colors relative overflow-hidden">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 flex items-center justify-center bg-orange/10 border border-orange/20 text-orange-soft group-hover:bg-orange/20 transition-colors">
                  <Icon size={22} strokeWidth={1.6} />
                </div>
                <span className="font-mono text-[11px] tracking-[0.22em] text-cream/40">
                  0{i + 1}
                </span>
              </div>
              <h3 className="text-xl font-extrabold tracking-tight text-cream">{t(k)}</h3>
              <p className="mt-2 text-sm text-cream/70 leading-relaxed">{t(ks)}</p>
              {/* subtle hover bar */}
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-orange transition-all duration-500 group-hover:w-full" aria-hidden />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
