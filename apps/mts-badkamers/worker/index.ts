/**
 * MTS Badkamers draait op Workers Static Assets: build.mjs bakt de hele site als
 * HTML naar site/ en die bestanden gaan er ongewijzigd uit. Deze Worker doet
 * maar een ding, en dat ding kan een statisch bestand niet zelf: zorgen dat de
 * site op precies een adres staat.
 */

export type Env = {
  ASSETS: Fetcher;
};

/**
 * Vier hostnamen wijzen naar deze Worker: het eigen domein, de www-variant, en
 * de twee adressen op jouwidealewebsite.nl waar de site eerder stond. Zonder
 * omleiding staat dezelfde site op vier adressen in de index en verdeelt hij
 * zijn eigen positie over vier kopieen. Dus: een host wint, de rest stuurt zijn
 * bezoekers en zijn links daarheen door met een 301.
 *
 * CANONIEKE_HOST hoort gelijk te blijven aan ORIGIN in build.mjs; die zet de
 * canonical, de og:url en de sitemap.
 */
const CANONIEKE_HOST = 'mts-badkamers.nl';

const ANDERE_HOSTS = [
  'www.mts-badkamers.nl',
  'm-techno-service.jouwidealewebsite.nl',
  'm-techno-service-concept.jouwidealewebsite.nl',
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /**
     * `wrangler dev` geeft de Worker niet het adres uit de adresbalk mee maar de
     * host uit `routes` hierboven, over gewoon http. Lokaal komt hier dus
     * letterlijk `http://mts-badkamers.nl/` binnen, en zonder de grendel op
     * https stuurt elke lokale aanroep je naar de live site.
     *
     * Op een custom domain serveert Cloudflare alleen https (http wordt aan de
     * rand al omgezet), dus in productie is die voorwaarde altijd waar en
     * lokaal altijd onwaar.
     *
     * Alleen leesverzoeken: een 301 gooit de body van een POST weg. De site
     * heeft geen POST (het formulier opent WhatsApp), maar dan klopt de volgorde
     * ook nog als er ooit een endpoint bij komt.
     */
    const leesverzoek = request.method === 'GET' || request.method === 'HEAD';
    if (leesverzoek && url.protocol === 'https:' && ANDERE_HOSTS.includes(url.hostname)) {
      url.hostname = CANONIEKE_HOST;
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
