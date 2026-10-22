import type { APIRoute } from 'astro';
import { routes, seo, url, copy } from '../data/content';
import { getCourses } from '../data/courses';
import { getProducts } from '../data/products';

// A plain-text map of the site for AI assistants and answer engines (llmstxt.org).
export const GET: APIRoute = () => {
  const en = routes.en;
  const lines = [
    '# Rescue Watercraft',
    '',
    `> ${seo.en.home.description}`,
    '',
    'Rescue Watercraft B.V. (Nijmegen, the Netherlands) supplies rescue watercraft (a jet ski with the Rescue Raft sled), professional water rescue equipment, and RWC operator and instructor training together with Reddingsbrigade Nederland. Clients are fire services, safety regions, police, defence, municipalities and Rijkswaterstaat. The site is in Dutch (primary), English and German. Contact: info@rescuewatercraft.nl, +31 6 133 658 40.',
    '',
    '## Pages',
    `- [Home](${url(en.home)}): ${copy.en.heroText}`,
    `- [Courses and training](${url(en.courses)}): ${seo.en.courses.description}`,
    `- [Water rescue equipment](${url(en.equipment)}): ${seo.en.equipment.description}`,
    `- [Contact](${url(en.contact)}): ${seo.en.contact.description}`,
    '',
    '## Courses',
    ...getCourses('en').map(course => `- [${course.title}](${url(en.courses)}): ${course.summary} Duration: ${course.duration}.`),
    '',
    '## Equipment',
    ...getProducts('en').map(product => `- [${product.name}](${url(product.url)}): ${product.summary}`),
    '',
    '## Other languages',
    `- Nederlands: ${url(routes.nl.home)}`,
    `- Deutsch: ${url(routes.de.home)}`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
