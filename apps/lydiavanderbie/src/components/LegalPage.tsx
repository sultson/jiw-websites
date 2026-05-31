import { ArrowLeft } from 'lucide-react';
import { privacyPolicy, algemeneVoorwaarden, klachtenreglement, type LegalSection } from '../data/legal';
import type { Lang } from '../translations';

type Props = { doc: 'privacy' | 'terms'; t: (k: string) => string; lang: Lang };

export default function LegalPage({ doc, t, lang }: Props) {
  const title = doc === 'privacy' ? t('legal.privacyTitle') : t('legal.termsTitle');

  return (
    <main className="bg-canvas">
      <div className="shell max-w-3xl py-14 sm:py-20">
        <a href="/" className="inline-flex items-center gap-1.5 text-[14px] font-bold text-terra hover:gap-2.5 transition-all">
          <ArrowLeft size={15} strokeWidth={2.5} />
          {t('legal.back')}
        </a>

        <h1 className="mt-6 display-lg text-ink">{title}</h1>
        {doc === 'terms' && <p className="mt-3 text-[16px] text-ink-soft">{t('legal.termsIntro')}</p>}
        <p className="mt-2 text-[13px] text-ink-mute">{t('legal.updated')}</p>

        {lang === 'en' && (
          <p className="mt-6 text-[14px] text-ink-mute bg-sand rounded-xl px-4 py-3 border border-line">
            This document is provided in Dutch, as it is the binding version.
          </p>
        )}

        <div className="mt-10 space-y-8">
          {doc === 'privacy' ? (
            <Sections sections={privacyPolicy} />
          ) : (
            <>
              <Sections sections={algemeneVoorwaarden} />
              <div className="pt-6 border-t border-line">
                <h2 className="display-md text-ink">Klachtenreglement</h2>
                <div className="mt-6 space-y-8">
                  <Sections sections={klachtenreglement} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function Sections({ sections }: { sections: LegalSection[] }) {
  return (
    <>
      {sections.map((s, i) => (
        <section key={i}>
          {s.h && <h2 className="font-display text-[21px] text-ink mb-3">{s.h}</h2>}
          {s.p?.map((para, j) => (
            <p key={j} className="text-[15.5px] leading-relaxed text-ink-soft mb-3">
              {para}
            </p>
          ))}
          {s.ul && (
            <ul className="mt-2 space-y-1.5 list-disc pl-5 marker:text-terra">
              {s.ul.map((li, k) => (
                <li key={k} className="text-[15.5px] leading-relaxed text-ink-soft">
                  {li}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </>
  );
}
