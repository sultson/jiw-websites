import { content, ui } from '../content';
import { sectionHref, to } from '../router';

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
            <p className="mt-3 max-w-sm text-sm text-muted">{t.rechten}</p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            <a href={sectionHref(path, 'werk')} className="eyebrow hover:text-bone">
              {ui.footer.collectie}
            </a>
            <a href={sectionHref(path, 'over')} className="eyebrow hover:text-bone">
              {ui.nav.over}
            </a>
            <a href={sectionHref(path, 'peter')} className="eyebrow hover:text-bone">
              {ui.nav.peter}
            </a>
            <a href={sectionHref(path, 'galerie')} className="eyebrow hover:text-bone">
              {ui.nav.galerie}
            </a>
            <a href={to('/blog')} className="eyebrow hover:text-bone">
              {ui.nav.blog}
            </a>
            <a
              href={newsletterOpDezePagina ? '#nieuwsbrief' : `${to('/')}#nieuwsbrief`}
              className="eyebrow hover:text-bone"
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
