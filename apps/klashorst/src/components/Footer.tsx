import { content } from '../content';
import Paragraphs from './Paragraphs';
import Wordmark from './Wordmark';
import { sectionHref, to } from '../router';

export default function Footer({
  path,
  newsletterOpDezePagina,
}: {
  path: string;
  newsletterOpDezePagina: boolean;
}) {
  const t = content.teksten.footer;
  const menu = content.teksten.menu;
  const nieuwsbrief = newsletterOpDezePagina ? '#nieuwsbrief' : `${to('/')}#nieuwsbrief`;

  // The same links as the bar, named from the same boxes in the Studio, so
  // renaming a section renames it in both places.
  const links = [
    { href: sectionHref(path, 'werk'), label: menu.werk },
    { href: sectionHref(path, 'peter'), label: menu.peter },
    { href: to('/blog'), label: menu.blog },
    { href: sectionHref(path, 'galerie'), label: menu.galerie },
    { href: nieuwsbrief, label: menu.nieuwsbrief },
    { href: sectionHref(path, 'contact'), label: menu.contact },
  ].filter((link) => link.label);

  return (
    <footer className="border-t border-hair bg-wall py-14">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Wordmark className="display block text-lg tracking-[0.2em]" />
            <div className="mt-3 max-w-sm">
              <Paragraphs value={t.rechten} className="text-sm text-muted" gap="mt-2" />
            </div>
          </div>

          {links.length > 0 && (
            <nav className="flex flex-wrap gap-x-8 gap-y-3">
              {links.map((link) => (
                <a key={link.href} href={link.href} className="eyebrow hover:text-bone">
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>

        <div className="rule mt-10" />
        <div className="mt-5">
          <Paragraphs value={t.demo} className="text-xs text-muted" gap="mt-2" />
        </div>
      </div>
    </footer>
  );
}
