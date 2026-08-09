import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { lang, ui } from '../content';
import { localePath, type Lang } from '../meta';
import { sectionHref, to } from '../router';

/**
 * The same bar on every page. The museum's sections stay anchors, so they still
 * scroll when you are already there and still work from the blog; the blog is a
 * page of its own and is linked as one.
 *
 * Deliberately loud: bigger type than the rest of the site, a solid button for
 * the newsletter, and a labelled menu rather than three lines on their own. A
 * museum's front page is mostly picture, and a bar that whispers over it is a
 * bar nobody uses.
 */
const sections = (path: string) => [
  { href: sectionHref(path, 'museum'), label: ui.nav.museum },
  { href: sectionHref(path, 'over'), label: ui.nav.over },
  { href: sectionHref(path, 'werk'), label: ui.nav.werk },
  { href: sectionHref(path, 'peter'), label: ui.nav.peter },
  { href: sectionHref(path, 's21'), label: ui.nav.s21 },
  { href: sectionHref(path, 'galerie'), label: ui.nav.galerie },
  { href: to('/blog'), label: ui.nav.blog, blog: true },
  { href: sectionHref(path, 'bezoek'), label: ui.nav.bezoek },
];

/** Both languages, always both visible: a single toggle hides the one you want. */
function Talen({
  path,
  onPick,
  className = '',
}: {
  path: string;
  onPick?: () => void;
  className?: string;
}) {
  const talen: { code: Lang; label: string }[] = [
    { code: 'nl', label: 'NL' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <div className={`items-center gap-1.5 ${className}`} aria-label={ui.nav.taal}>
      {talen.map((taal, i) => (
        <span key={taal.code} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-hair">/</span>}
          <a
            href={localePath(taal.code, path)}
            // The whole document is in one language, inlined content and all,
            // so the other one is a load rather than a navigation.
            data-reload
            onClick={onPick}
            aria-current={taal.code === lang ? 'true' : undefined}
            className={`navlink !text-[0.84rem] !tracking-[0.1em] ${
              taal.code === lang ? '!text-red-soft' : '!text-bone/55 hover:!text-bone'
            }`}
          >
            {taal.label}
          </a>
        </span>
      ))}
    </div>
  );
}

export default function Nav({
  path,
  newsletterOpDezePagina,
}: {
  path: string;
  newsletterOpDezePagina: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // The menu belongs to the page it was opened on.
  useEffect(() => setOpen(false), [path]);

  const home = path === '/';
  // The room behind the bar is light now, so the bar washes the page colour
  // from the first pixel and gains its line once the page moves under it.
  const solid = scrolled || !home;
  const links = sections(path);
  const nieuwsbrief = newsletterOpDezePagina ? '#nieuwsbrief' : `${to('/')}#nieuwsbrief`;
  const blogActief = path.startsWith('/blog');

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solid ? 'border-b border-hair bg-ink/90 backdrop-blur-md' : 'bg-ink/70'
        }`}
      >
        <div className="mx-auto flex h-[4.5rem] max-w-[1400px] items-center justify-between gap-3 px-5 sm:gap-6 md:h-20 md:px-10">
          <a
            href={home ? '#museum' : to('/')}
            className="display whitespace-nowrap text-[0.82rem] tracking-[0.16em] sm:text-base sm:tracking-[0.2em] md:text-lg"
          >
            Klashorst<span className="text-red"> Museum</span>
          </a>

          <nav className="hidden items-center gap-5 xl:flex 2xl:gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={link.blog && blogActief ? 'page' : undefined}
                className="navlink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
            {/* On a phone the bar has room for the button and the menu and
                nothing else; the languages are the first thing inside it. */}
            <Talen path={path} className="hidden sm:flex" />

            {/* The newsletter is the client's headline ask, so it is the one
                solid button in the bar and stays reachable on a phone too. */}
            <a
              href={nieuwsbrief}
              className="btn btn-solid !px-3.5 !py-2.5 !text-[0.7rem] sm:!px-6 sm:!py-3 sm:!text-[0.84rem]"
            >
              {ui.nav.cta}
            </a>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="navlink flex items-center gap-2 xl:hidden"
              aria-label={ui.nav.menu}
            >
              <Menu size={26} strokeWidth={1.75} />
              <span className="hidden sm:inline">{ui.nav.menu}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Rendered as a sibling of the header so it never clips to the blurred bar. */}
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-ink xl:hidden">
          <div className="flex h-[4.5rem] items-center justify-between px-5 md:h-20 md:px-10">
            <span className="display text-[0.82rem] tracking-[0.16em] sm:text-base sm:tracking-[0.2em] md:text-lg">
              Klashorst<span className="text-red"> Museum</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={ui.nav.sluiten}
              className="navlink flex items-center gap-2"
            >
              <span className="hidden sm:inline">{ui.nav.sluiten}</span>
              <X size={28} strokeWidth={1.75} />
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-5 overflow-y-auto px-8 py-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="display text-3xl text-bone"
              >
                {link.label}
              </a>
            ))}
            <a href={nieuwsbrief} onClick={() => setOpen(false)} className="btn btn-solid mt-4 self-start">
              {ui.nav.cta}
            </a>
            <Talen path={path} onPick={() => setOpen(false)} className="mt-2 flex" />
          </nav>
        </div>
      )}
    </>
  );
}
