import { useState } from 'react';
import { ChevronDown, ArrowRight, Phone } from 'lucide-react';
import Reveal from './Reveal';
import SectionHeader from './SectionHeader';
import { faqItems } from '../data/faq';
import { SITE } from '../lib/site';

type Props = { t: (k: string) => string; onIntake: () => void };

export default function Faq({ t, onIntake }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section bg-white">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* ── LEFT — header + helper card (sticky) ─────────── */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionHeader
                eyebrow={t('faq.eyebrow')}
                title={t('faq.title')}
                dot="cobalt"
              />

              <Reveal delay={2}>
                <div className="mt-8 rounded-2xl border border-line-cool bg-mist p-6">
                  <p className="text-[15px] font-bold text-ink">{t('faq.helpTitle')}</p>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">
                    {t('faq.helpText')}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button type="button" className="btn-cobalt" onClick={onIntake}>
                      {t('cta.button')}
                      <ArrowRight size={16} strokeWidth={2.6} />
                    </button>
                    <a
                      href={SITE.phoneHref}
                      className="inline-flex items-center gap-2 text-[14px] font-bold text-ink hover:text-cobalt transition-colors"
                    >
                      <Phone size={15} strokeWidth={2.5} />
                      <span className="tnum">{SITE.phoneDisplay}</span>
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* ── RIGHT — accordion ────────────────────────────── */}
          <div className="lg:col-span-7">
            <Reveal delay={1}>
              <div className="border-t border-line-cool">
                {faqItems.map((f, i) => {
                  const isOpen = open === i;
                  const panelId = `faq-panel-${i}`;
                  const btnId = `faq-btn-${i}`;
                  return (
                    <div key={f.qKey} className="border-b border-line-cool">
                      <h3>
                        <button
                          type="button"
                          id={btnId}
                          onClick={() => setOpen(isOpen ? null : i)}
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          className="w-full flex items-center gap-5 py-6 text-left group"
                        >
                          <span className="flex-1 text-[17px] sm:text-[18px] font-bold text-ink leading-snug group-hover:text-cobalt transition-colors">
                            {t(f.qKey)}
                          </span>
                          <span
                            className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                              isOpen
                                ? 'bg-cobalt text-white'
                                : 'bg-mist text-ink-soft group-hover:bg-cobalt/10 group-hover:text-cobalt'
                            }`}
                          >
                            <ChevronDown
                              size={18}
                              strokeWidth={2.5}
                              className={`transition-transform duration-300 ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </span>
                        </button>
                      </h3>
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={btnId}
                        className="grid transition-all duration-300 ease-out"
                        style={{
                          gridTemplateRows: isOpen ? '1fr' : '0fr',
                          opacity: isOpen ? 1 : 0,
                        }}
                      >
                        <div className="overflow-hidden">
                          <p className="pb-7 pr-8 text-[15.5px] leading-relaxed text-ink-soft">
                            {t(f.aKey)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
