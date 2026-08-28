import type { CloudflareFormsEnv } from '@jiw/cloudflare-forms';
import { inburgeringsplichtigForms } from './sites/inburgeringsplichtig';
import { partnerherenigingForms } from './sites/partnerhereniging';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

/**
 * One Worker per lander domain, all built from this file. SITE_ID (set in the
 * per-site wrangler config) decides which form handlers are mounted, so a
 * deploy can never serve one domain's static pages with another's forms.
 */
const FORMS = {
  inburgeringsplichtig: inburgeringsplichtigForms,
  partnerhereniging: partnerherenigingForms,
} as const;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/forms/')) {
      const handlers = FORMS[env.SITE_ID as keyof typeof FORMS] ?? [];
      // Longest path first: /partner-qualify must win over /partner.
      for (const handler of handlers) {
        if (url.pathname === handler.path || url.pathname.startsWith(`${handler.path}/`)) {
          return handler.worker.fetch!(request, env, ctx);
        }
      }
      return new Response(JSON.stringify({ ok: false, error: 'unknown_form' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    // run_worker_first scopes this Worker to /api/*, but keep the fallthrough
    // correct in case it is ever invoked for a page request.
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
