import type { Copy } from '../translations';

export default function Footer({ t }: { t: Copy }) {
  return (
    <footer className="border-t border-hair bg-wall py-14">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="display text-lg tracking-[0.2em]">
              Klashorst<span className="text-red"> Museum</span>
            </p>
            <p className="mt-3 max-w-sm text-sm text-muted">{t.footer.rights} 1957 / 2024</p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            <a href="#werk" className="eyebrow text-bone/70 hover:text-bone">
              {t.footer.collection}
            </a>
            <a href="#peter" className="eyebrow text-bone/70 hover:text-bone">
              {t.footer.about}
            </a>
            <a href="#nieuwsbrief" className="eyebrow text-bone/70 hover:text-bone">
              {t.nav.cta}
            </a>
          </nav>
        </div>

        <div className="rule mt-10" />
        <p className="mt-5 text-xs text-muted">{t.footer.demo}</p>
      </div>
    </footer>
  );
}
