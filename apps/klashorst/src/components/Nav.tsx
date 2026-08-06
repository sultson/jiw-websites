import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ui } from '../content';
import { sectionHref } from '../router';

/**
 * The same bar on every page. The museum's sections stay anchors, so they still
 * scroll when you are already there and still work from the blog; the blog is a
 * page of its own and is linked as one.
 */
const sections = (path: string) => [
  { href: sectionHref(path, 'zaal'), label: ui.nav.zaal },
  { href: sectionHref(path, 'werk'), label: ui.nav.werk },
  { href: sectionHref(path, 'peter'), label: ui.nav.peter },
  { href: sectionHref(path, 's21'), label: ui.nav.s21 },
  { href: sectionHref(path, 'galerie'), label: ui.nav.galerie },
  { href: '/blog', label: ui.nav.blog },
  { href: sectionHref(path, 'bezoek'), label: ui.nav.bezoek },
];

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
  // Transparent only over the room. Every other page starts with type under the
  // bar, and type needs a bar to sit against.
  const solid = scrolled || !home;
  const links = sections(path);
  const nieuwsbrief = newsletterOpDezePagina ? '#nieuwsbrief' : '/#nieuwsbrief';

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solid ? 'border-b border-hair bg-ink/85 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-10">
          <a
            href={home ? '#zaal' : '/'}
            className="display whitespace-nowrap text-sm tracking-[0.2em] md:text-base"
          >
            Klashorst<span className="text-red"> Museum</span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={link.href === '/blog' && path.startsWith('/blog') ? 'page' : undefined}
                className={`eyebrow transition-colors hover:text-bone ${
                  link.href === '/blog' && path.startsWith('/blog') ? 'text-bone' : 'text-bone/70'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* The newsletter is the client's headline ask, so it stays
                reachable on a phone too. */}
            <a
              href={nieuwsbrief}
              className="btn !px-3 !py-2 !text-[0.68rem] sm:!px-5 sm:!py-2.5 sm:!text-[0.72rem]"
            >
              {ui.nav.cta}
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="lg:hidden"
              aria-label={ui.nav.menu}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Rendered as a sibling of the header so it never clips to the blurred bar. */}
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-ink lg:hidden">
          <div className="flex h-16 items-center justify-between px-5">
            <span className="display text-sm tracking-[0.2em]">
              Klashorst<span className="text-red"> Museum</span>
            </span>
            <button type="button" onClick={() => setOpen(false)} aria-label={ui.nav.sluiten}>
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-5 px-8">
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
          </nav>
        </div>
      )}
    </>
  );
}
