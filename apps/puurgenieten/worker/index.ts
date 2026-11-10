import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';
import { PG_FORM } from './form.ts';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

/* De enige host die pagina's uitlevert. */
const APEX = 'puurgenieten.tv';

/* Hosts die met een 301 naar de apex gaan, pad en query intact.
   - www: hangt eraan zodat wie het intypt niet op een foutmelding uitkomt.
   - het conceptadres: daar stond tot 10-11-2026 de voorbeeldversie, en die link
     is gedeeld. Hij is van de playground-worker hierheen verhuisd; zonder deze
     regel stond daar een tweede complete kopie van de site. */
const ANDERE_HOSTS = new Set(['www.puurgenieten.tv', 'puurgenieten-concept.jouwconcept.app']);

const aanmelding = createFormWorker(PG_FORM);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Andere host of http: in een stap naar https://puurgenieten.tv, met pad en
    // query. Always Use HTTPS staat niet vanzelf aan op een nieuwe zone, en zonder
    // deze regel gaf http://puurgenieten.tv/ een gewone 200.
    // localhost en *.workers.dev blijven werken voor wrangler dev en een proef.
    const lokaal = url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname.endsWith('.workers.dev');
    if (!lokaal && (ANDERE_HOSTS.has(url.hostname) || url.protocol !== 'https:')) {
      const doel = new URL(url.pathname + url.search, `https://${APEX}`);
      return Response.redirect(doel.toString(), 301);
    }

    if (url.pathname === PG_FORM.formPath) return aanmelding.fetch!(request, env, ctx);

    // Een onbekend /api/-pad is geen pagina en hoort geen html terug te krijgen.
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ ok: false, error: 'unknown_form' }), {
        status: 404,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
