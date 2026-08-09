import { useEffect, useRef, useSyncExternalStore } from 'react';
import { lang } from './content';
import { localePath, splitLang } from './meta';

/**
 * Three kinds of page in one bundle: the museum, the blog, and an article.
 *
 * Real addresses rather than anchors, because an article has to be linkable,
 * shareable and openable in a new tab. Client-side, because the content for
 * every page is already inlined in the document the Worker sent, so moving
 * between them costs no request at all.
 *
 * The language is part of the address and not part of the routing: Dutch is at
 * the root, English one directory in, and everything below works in the
 * language the page was opened in. Switching language is the one link on the
 * site that is a real navigation, because the whole document has to be re-read
 * in the other one.
 */

const listeners = new Set<() => void>();

/** The path without its language and without a trailing slash: what a page is. */
const clean = (pathname: string) => splitLang(pathname).path;

const getPath = () => clean(window.location.pathname);

/** The same page, in the language this document is in. */
export const to = (path: string) => localePath(lang, path);

/**
 * Whether the next render arrives because someone clicked a link, or because
 * they pressed back. A click starts at the top of its new page; back has a
 * place in the old one to return to, and the browser knows where.
 */
let arriving: 'click' | 'history' = 'history';

function announce() {
  for (const listener of listeners) listener();
}

function onPopState() {
  arriving = 'history';
  announce();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener('popstate', onPopState);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('popstate', onPopState);
  };
}

/** The current path, re-rendering whatever reads it when it changes. */
export function usePath(): string {
  return useSyncExternalStore(subscribe, getPath, () => '/');
}

/**
 * A link to a section of the museum page. An anchor while you are on it, the
 * page plus the anchor from anywhere else, so the same nav works everywhere.
 */
export const sectionHref = (path: string, anchor: string) =>
  path === '/' ? `#${anchor}` : `${to('/')}#${anchor}`;

export function navigate(target: string) {
  const url = new URL(target, window.location.href);

  // A preview session has to survive a click. Without the key the Worker
  // answers with published content, and the draft the client is looking at
  // would quietly disappear halfway through checking it.
  const key = new URLSearchParams(window.location.search).get('preview');
  if (key && !url.searchParams.has('preview')) url.searchParams.set('preview', key);

  if (url.href === window.location.href) return;
  arriving = 'click';
  window.history.pushState({}, '', url);
  announce();
}

/**
 * Turns every internal link on the site into a client-side one, so no component
 * has to import anything to link somewhere. Links that leave the site, open in
 * a new tab, point into the Studio or change the language are left to the
 * browser, and so is an anchor on the page you are already on: that is a
 * scroll, not a navigation.
 */
export function useInternalLinks() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.('a');
      const href = anchor?.getAttribute('href');
      if (!anchor || !href) return;
      if (anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      // The language switch. The document itself is in one language, from the
      // inlined content down to <html lang>, so the other one is a fresh load.
      if (anchor.hasAttribute('data-reload')) return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // The Studio is a separate application served at this same origin.
      if (url.pathname === '/beheer' || url.pathname.startsWith('/beheer/')) return;
      // A link into the other language is a load, not a navigation.
      if (splitLang(url.pathname).lang !== lang) return;
      if (clean(url.pathname) === getPath()) return;

      event.preventDefault();
      navigate(url.pathname + url.search + url.hash);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}

/**
 * Where a new page starts. A click lands at the top, or at the section its
 * link named. Back and forward are left alone: the browser puts the visitor
 * where they were, which is the whole point of pressing back.
 */
export function useScrollOnNavigate(path: string) {
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (arriving !== 'click') return;

    const target = window.location.hash ? document.querySelector(window.location.hash) : null;
    if (target) {
      target.scrollIntoView();
    } else {
      // Instant, not smooth: this is a new page, not a move within one, and
      // racing the whole document past the visitor is not an animation.
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [path]);
}
