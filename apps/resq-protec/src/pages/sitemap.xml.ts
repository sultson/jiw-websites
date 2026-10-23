import type { APIRoute } from 'astro';
import { routes, langs, defaultLang, alternates, url, type PageKey } from '../data/content';
import { getProducts } from '../data/products';

// Written by hand rather than by @astrojs/sitemap: the German and English pages have
// their own slugs, so the integration's prefix-based i18n could not pair them up.
// Every URL carries its full hreflang set, the same one the page's <head> declares.
export const GET: APIRoute = () => {
  const pages = (Object.keys(routes.nl) as PageKey[]).flatMap(key => langs.map(lang => routes[lang][key]));
  const products = langs.flatMap(lang => getProducts(lang).map(product => product.url));
  const entries = [...pages, ...products].map(path => {
    const alt = alternates(path);
    const links = [...langs.map(lang => `<xhtml:link rel="alternate" hreflang="${lang}" href="${url(alt[lang])}"/>`), `<xhtml:link rel="alternate" hreflang="x-default" href="${url(alt[defaultLang])}"/>`].join('');
    return `<url><loc>${url(path)}</loc>${links}</url>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
