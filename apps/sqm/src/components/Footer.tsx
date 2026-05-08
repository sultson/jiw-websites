import { ArrowUpRight, Star } from 'lucide-react';
import { services } from '../data/services';

type Props = { t: (k: string) => string; onIntake: () => void };

const regios = ['ft.regio.1', 'ft.regio.2', 'ft.regio.3', 'ft.regio.4', 'ft.regio.5'];

export default function Footer({ t, onIntake }: Props) {
  return (
    <footer id="contact" className="bg-charcoal-ink text-cream relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] bg-blueprint pointer-events-none" aria-hidden />

      {/* top orange marker rule + diagonal stripe ribbon */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-orange" aria-hidden />
      <div className="absolute top-1 left-0 w-32 sm:w-48 h-2 diag-stripes opacity-70" aria-hidden />

      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* CTA banner echoing the hero credentials sheet */}
        <div className="mb-14 lg:mb-16 grid lg:grid-cols-12 gap-8 items-center pb-12 border-b border-cream/10">
          <div className="lg:col-span-7">
            <span className="kicker text-orange-soft">Contact</span>
            <h3 className="mt-4 font-display font-extrabold text-2xl sm:text-3xl lg:text-[40px] leading-[1.05] tracking-[-0.02em] text-cream max-w-xl">
              {t('ct.title')}
            </h3>
            <p className="mt-4 text-cream/70 text-base leading-relaxed max-w-lg">{t('ct.intro')}</p>
            <button type="button" onClick={onIntake} className="btn-orange mt-7">
              {t('hero.cta')}
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </button>
          </div>

          {/* mini credentials echo */}
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="bg-charcoal/60 border border-cream/12 p-5">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-cream/50 font-semibold pb-3 border-b border-cream/10">
                <span>Credentials</span>
                <span className="font-mono text-cream/40">02</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="font-display font-extrabold text-3xl text-cream tracking-[-0.03em] leading-none">26</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-cream/55 font-semibold">years active</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-orange-soft fill-orange-soft" />
                    <span className="font-display font-extrabold text-3xl text-cream tracking-[-0.03em] leading-none">4,8</span>
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-cream/55 font-semibold">267 reviews</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-cream/10 text-[11px] text-cream/60 font-mono tracking-wide">
                KvK 24330825 · Heinenoord
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <img src="/logo/sqm-mark.png" alt="" className="h-12 w-auto" />
              <div>
                <div className="font-display font-extrabold text-xl tracking-tight text-cream">SQM</div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-cream/60">Bouwmanagement</div>
              </div>
            </div>
            <p className="mt-5 text-base text-cream/75 leading-relaxed max-w-md">{t('ft.about')}</p>
            <p className="mt-5 italic text-orange-soft text-sm">"{t('ft.tag')}"</p>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <h3 className="text-[11px] uppercase tracking-[0.24em] text-cream/50 font-semibold mb-4">
              {t('ft.dienstenHeading')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.id}>
                  <a href="#diensten" className="text-cream/80 hover:text-orange-soft transition-colors">
                    {t(s.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-[11px] uppercase tracking-[0.24em] text-cream/50 font-semibold mb-4">
              {t('ft.werkgebiedHeading')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {regios.map((r) => (
                <li key={r} className="text-cream/80">{t(r)}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-cream/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-cream/55">
          <div>{t('ft.legal')}</div>
          <div className="font-mono tracking-wide">{t('ft.legalSub')}</div>
        </div>
      </div>
    </footer>
  );
}
