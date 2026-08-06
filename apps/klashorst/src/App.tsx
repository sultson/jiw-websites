import { useEffect } from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import PreviewBar from './components/PreviewBar';
import Home from './pages/Home';
import BlogIndex from './pages/BlogIndex';
import BlogPostPage from './pages/BlogPost';
import NotFound from './pages/NotFound';
import { content, findPost, isPreview } from './content';
import { HOME_DESCRIPTION, HOME_TITLE, clamp, pageTitle } from './meta';
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
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
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
        title: pageTitle(post.titel),
        description: clamp(post.samenvatting),
        newsletter: true,
      };
    }
  }

  return {
    page: <NotFound />,
    title: pageTitle('Pagina niet gevonden'),
    description: HOME_DESCRIPTION,
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

  return (
    <>
      <Nav path={path} newsletterOpDezePagina={newsletter} />
      {page}
      <Footer path={path} newsletterOpDezePagina={newsletter} />
      {isPreview && <PreviewBar />}
    </>
  );
}
