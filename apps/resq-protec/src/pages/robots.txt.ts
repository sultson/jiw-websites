import type { APIRoute } from 'astro';
import { SITE } from '../data/content';

// The concept hosts answer with X-Robots-Tag: noindex from the Worker, so one robots.txt
// serves both and nothing has to change at go-live.
export const GET: APIRoute = () => new Response(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
