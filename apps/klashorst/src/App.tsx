import { useEffect } from 'react';
import CookieConsent from './components/CookieConsent';
import Nav from './components/Nav';
import Footer from './components/Footer';
import PreviewBar from './components/PreviewBar';
import Home from './pages/Home';
import BlogIndex from './pages/BlogIndex';
import BlogPostPage from './pages/BlogPost';
import NotFound from './pages/NotFound';
import Privacy from './pages/Privacy';
import { content, findPost, isPreview, lang } from './content';
import { HTML_LANG, PRIVACY_DESCRIPTION, PRIVACY_TITLE, clamp, pageTitle } from './meta';
import { useInternalLinks, usePath, useScrollOnNavigate } from './router';

/**
 * Which page an address is, what that page calls itself, and whether the
 * newsletter form is on it: the nav's one button has to reach a form that is
 * actually there, wherever the visitor is standing.
 */
function resolve(path: string) {
  if (path === '/') {
    const t = content.teksten.vindbaarheid;
    return {
      page: <Home />,
      title: t.titel,
      description: clamp(t.omschrijving),
      newsletter: true,
    };
  }

  if (path === '/blog') {
    const t = content.teksten.blog;
    return {
      page: <BlogIndex />,
      title: pageTitle(t.titel),
      description: clamp(t.lead),
      newsletter: true,
    };
  }

  if (path === '/privacy') {
    return {
      page: <Privacy />,
      title: pageTitle(PRIVACY_TITLE[lang]),
      description: clamp(PRIVACY_DESCRIPTION[lang]),
      // Its own page, and not one the newsletter belongs on: the nav's button
      // has to point back at the page that carries the form.
      newsletter: false,
    };
  }

  const article = /^\/blog\/([^/]+)$/.exec(path);
  if (article) {
    // A slug comes out of the address bar, so it can be malformed: `%zz` is
    // not a post, and decoding it throws. Without the guard that throw takes
    // the render with it and the visitor gets a blank page instead of the
    // page that says the post is not there.
    let slug: string | null = null;
    try {
      slug = decodeURIComponent(article[1]);
    } catch {
      slug = null;
    }
    const post = slug === null ? undefined : findPost(slug);
    if (post) {
      return {
        page: <BlogPostPage post={post} />,
        title: pageTitle(post.seoTitel ?? post.titel),
        description: clamp(post.seoOmschrijving ?? post.samenvatting),
        newsletter: true,
      };
    }
  }

  return {
    page: <NotFound />,
    title: pageTitle(content.teksten.nietGevonden.titel),
    description: clamp(content.teksten.vindbaarheid.omschrijving),
    newsletter: false,
  };
}

export default function App() {
  const path = usePath();
  const { page, title, description, newsletter } = resolve(path);

  useInternalLinks();
  useScrollOnNavigate(path);

  // The Worker already put these in the HTML for the address that was
  // requested. This keeps them right afterwards, when the visitor moves to
  // another page without the page being fetched again.
  useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [title, description]);

  // The document is served in Dutch and read again in English at /en, so the
  // attribute a screen reader and a search engine go by has to follow.
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
  }, []);

  return (
    <>
      <Nav path={path} newsletterOpDezePagina={newsletter} />
      {page}
      <Footer path={path} newsletterOpDezePagina={newsletter} />
      <CookieConsent path={path} />
      {isPreview && <PreviewBar />}
    </>
  );
}
