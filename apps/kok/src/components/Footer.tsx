import { ArrowUpRight, Phone, Mail, MapPin } from 'lucide-react';
import { services } from '../data/services';

type Props = { t: (k: string) => string; onIntake: () => void };

const regios = ['ft.regio.1', 'ft.regio.2', 'ft.regio.3', 'ft.regio.4', 'ft.regio.5'];

export default function Footer({ t, onIntake }: Props) {
  return (
    <footer id="contact" className="bg-ink text-paper relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-ochre" aria-hidden />

      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        {/* CTA banner */}
        <div className="mb-14 lg:mb-20 grid lg:grid-cols-12 gap-10 items-end pb-12 border-b border-paper/15">
          <div className="lg:col-span-8">
            <span className="kicker text-ochre-soft">Contact</span>
            <h3 className="mt-4 font-display font-extrabold leading-[1.02] tracking-[-0.03em] text-paper max-w-2xl"
                style={{ fontSize: 'clamp(36px, 5.5vw, 64px)' }}>
              {t('ct.title')}
            </h3>
            <p className="mt-5 text-paper/70 text-base lg:text-lg leading-relaxed max-w-xl">{t('ct.intro')}</p>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <button type="button" onClick={onIntake} className="btn-ochre">
              {t('hero.cta')}
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <p className="text-base text-paper/75 leading-relaxed max-w-md">{t('ft.about')}</p>

            <ul className="mt-7 space-y-2.5 text-sm text-paper/85">
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-ochre-soft" />
                <a href="tel:+31628395657" className="hover:text-paper transition-colors">+31 6 28 39 56 57</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-ochre-soft" />
                <a href="mailto:info@kokvastgoedonderhoud.nl" className="hover:text-paper transition-colors break-all">info@kokvastgoedonderhoud.nl</a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={14} className="text-ochre-soft" />
                <span>Kersegaarde 1, 3436 GC Nieuwegein</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <h3 className="text-[11px] uppercase tracking-[0.24em] text-paper/55 font-semibold mb-4">
              {t('ft.dienstenHeading')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.key}>
                  <a href="#diensten" className="text-paper/85 hover:text-ochre-soft transition-colors">
                    {t(s.trKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-[11px] uppercase tracking-[0.24em] text-paper/55 font-semibold mb-4">
              {t('ft.werkgebiedHeading')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {regios.map((r) => (
                <li key={r} className="text-paper/85">{t(r)}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 lg:mt-16 pt-6 border-t border-paper/10">
          <div className="text-[10px] uppercase tracking-[0.24em] text-paper/45 font-semibold mb-4">
            {t('ft.hours')}
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-8 text-sm">
            <Hours label={t('ft.hoursWeekday')} value={t('ft.hoursWeekdayVal')} />
            <Hours label={t('ft.hoursSat')}     value={t('ft.hoursSatVal')} />
            <Hours label={t('ft.hoursSun')}     value={t('ft.hoursSunVal')} dim />
          </dl>
        </div>

        <div className="mt-10 pt-6 border-t border-paper/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-paper/55">
          <div>{t('ft.legal')}</div>
          <div className="tracking-wide">{t('ft.legalSub')}</div>
        </div>
      </div>
    </footer>
  );
}

function Hours({ label, value, dim }: { label: string; value: string; dim?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-paper/65">{label}</dt>
      <dd className={`tabular-nums ${dim ? 'text-paper/45' : 'text-paper'}`}>{value}</dd>
    </div>
  );
}
