import { content, ui } from '../content';
import { sectionHref } from '../router';

export default function Footer({
  path,
  newsletterOpDezePagina,
}: {
  path: string;
  newsletterOpDezePagina: boolean;
}) {
  const t = content.teksten.footer;

  return (
    <footer className="border-t border-hair bg-wall py-14">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="display text-lg tracking-[0.2em]">
              Klashorst<span className="text-red"> Museum</span>
            </p>
            <p className="mt-3 max-w-sm text-sm text-muted">{t.rechten} 1957 / 2024</p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            <a href={sectionHref(path, 'werk')} className="eyebrow text-bone/70 hover:text-bone">
              {ui.footer.collectie}
            </a>
            <a href={sectionHref(path, 'peter')} className="eyebrow text-bone/70 hover:text-bone">
              {ui.footer.over}
            </a>
            <a href={sectionHref(path, 'galerie')} className="eyebrow text-bone/70 hover:text-bone">
              {ui.nav.galerie}
            </a>
            <a href="/blog" className="eyebrow text-bone/70 hover:text-bone">
              {ui.nav.blog}
            </a>
            <a
              href={newsletterOpDezePagina ? '#nieuwsbrief' : '/#nieuwsbrief'}
              className="eyebrow text-bone/70 hover:text-bone"
            >
              {ui.nav.cta}
            </a>
          </nav>
        </div>

        <div className="rule mt-10" />
        <p className="mt-5 text-xs text-muted">{t.demo}</p>
      </div>
    </footer>
  );
}
