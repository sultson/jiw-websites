import { useEffect } from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import PreviewBar from './components/PreviewBar';
import Home from './pages/Home';
import BlogIndex from './pages/BlogIndex';
import BlogPostPage from './pages/BlogPost';
import NotFound from './pages/NotFound';
import { content, findPost, isPreview, lang } from './content';
import { HOME_DESCRIPTION, HOME_TITLE, HTML_LANG, NOT_FOUND_TITLE, clamp, pageTitle } from './meta';
import { useInternalLinks, usePath, useScrollOnNavigate } from './router';

/**
 * Which page an address is, what that page calls itself, and whether the
 * newsletter form is on it: the nav's one button has to reach a form that is
 * actually there, wherever the visitor is standing.
 */
function resolve(path: string) {
  if (path === '/') {
    return {
      page: <Home />,
      title: HOME_TITLE[lang],
      description: HOME_DESCRIPTION[lang],
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

  const article = /^\/blog\/([^/]+)$/.exec(path);
  if (article) {
    const post = findPost(decodeURIComponent(article[1]));
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
    title: pageTitle(NOT_FOUND_TITLE[lang]),
    description: HOME_DESCRIPTION[lang],
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
      {isPreview && <PreviewBar />}
    </>
  );
}
