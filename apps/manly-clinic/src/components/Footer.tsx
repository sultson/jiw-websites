import { Instagram } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

const ig = 'https://www.instagram.com/manlyclinic/';
const tt = 'https://www.tiktok.com/@manlyclinic';

export default function Footer({ t, onBook }: Props) {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10 pt-16 md:pt-24 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-5">
            <div className="font-display text-[40px] md:text-[56px] leading-[0.95] tracking-tight">
              Manly<br />Clinic
            </div>
            <p className="mt-6 text-paper/65 max-w-[40ch] leading-relaxed">
              {t('footer.tag')}
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7 space-y-3 text-sm">
            <p className="text-[11px] tracking-[0.28em] uppercase text-paper/55">
              {t('visit.kicker')}
            </p>
            <p className="text-paper/85 leading-relaxed">{t('footer.address')}</p>
          </div>

          <div className="md:col-span-3 flex flex-col items-start md:items-end gap-4">
            <button type="button" onClick={onBook} className="btn-paper">
              {t('footer.book')}
            </button>
            <div className="flex gap-5 text-sm">
              <a href={ig} target="_blank" rel="noreferrer" className="text-paper/70 hover:text-paper inline-flex items-center gap-1.5">
                <Instagram size={14} strokeWidth={1.6} />
                {t('footer.instagram')}
              </a>
              <a href={tt} target="_blank" rel="noreferrer" className="text-paper/70 hover:text-paper">
                {t('footer.tiktok')}
              </a>
            </div>
          </div>
        </div>

        <div className="rule-light mt-14 mb-6" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[11px] tracking-[0.22em] uppercase text-paper/50">
          <span>{t('footer.copy')}</span>
          <span>Den Haag · NL</span>
        </div>
      </div>
    </footer>
  );
}
