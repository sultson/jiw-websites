/* De stand van Trustoo, vers in elke pagina.

   Tot 10-11-2026 kwamen het cijfer en het aantal alleen bij de build uit Trustoo
   (bouw.mjs). De widget eronder haalt zijn stand zelf live op, dus zodra er een
   beoordeling bijkwam liep de site uit elkaar: de widget zei 7, de pil in de kop en
   de kop boven de widget nog 6, tot iemand toevallig opnieuw uitrolde.

   Nu zet de worker de stand er bij elk verzoek om een pagina zelf in, aan de rand,
   dus nog vóór de browser of Google iets ziet. Het staat dus gewoon in de HTML, niet
   pas na javascript. De build zet nog steeds een stand in de pagina: dat is de
   terugval als Trustoo niet antwoordt, dan blijft die staan en valt er niets om.

   Wat er vervangen wordt:
   - elk element met data-trustoo="aantal" of "cijfer" (de tekst erin)
   - data-trustoo="vol" (de sterretjes, --vol in het style-attribuut)
   - ratingValue en reviewCount in het schema-blok, op alle 30 pagina's

   Trustoo wordt hooguit eens per uur gevraagd: de stand ligt in de cache van de rand. */

const TRUSTOO_ID = '705268';
const BRON = `https://trustoo.nl/api/providers/widget/${TRUSTOO_ID}/0/1`;
const CACHE_SLEUTEL = `https://trustoo-stand.noverabouw.nl/${TRUSTOO_ID}`;
const BEWAAR_SEC = 3600;

type Stand = { cijfer: number; aantal: number };

async function haalStand(ctx: ExecutionContext): Promise<Stand | null> {
  const cache = (caches as unknown as { default: Cache }).default;
  const sleutel = new Request(CACHE_SLEUTEL);
  try {
    const bewaard = await cache.match(sleutel);
    if (bewaard) return (await bewaard.json()) as Stand;

    const r = await fetch(BRON, { signal: AbortSignal.timeout(2500) });
    if (!r.ok) return null;
    const d = (await r.json()) as { status?: string; rating?: string | number; nrReviews?: number };
    const cijfer = Number(d.rating);
    const aantal = Number(d.nrReviews);
    if (d.status !== 'success' || !(cijfer > 0 && cijfer <= 5) || !(aantal > 0)) return null;

    const stand: Stand = { cijfer, aantal };
    ctx.waitUntil(
      cache.put(
        sleutel,
        new Response(JSON.stringify(stand), {
          headers: { 'content-type': 'application/json', 'cache-control': `max-age=${BEWAAR_SEC}` },
        })
      )
    );
    return stand;
  } catch {
    return null;
  }
}

// Zelfde rekensom als bouw.mjs: komma in het Nederlands, punt in het Engels, en de
// sterretjes afgerond op een halve ster.
const cijferTekst = (c: number, en: boolean) => c.toFixed(1).replace('.', en ? '.' : ',');
const vol = (c: number) => `${Math.round((c / 5) * 10) * 10}%`;

export async function metTrustoo(request: Request, assets: Fetcher, ctx: ExecutionContext): Promise<Response> {
  // Geen If-None-Match doorgeven: anders antwoordt de rand met een 304 op de oude
  // ETag en houdt de browser een pagina met de oude stand vast.
  const schoon = new Request(request, { headers: new Headers(request.headers) });
  schoon.headers.delete('if-none-match');
  schoon.headers.delete('if-modified-since');

  const [antwoord, stand] = await Promise.all([assets.fetch(schoon), haalStand(ctx)]);
  const soort = antwoord.headers.get('content-type') || '';
  if (!stand || !soort.includes('text/html')) return antwoord;

  const en = new URL(request.url).pathname.startsWith('/en');
  const c = cijferTekst(stand.cijfer, en);
  let schema = '';

  const uit = new HTMLRewriter()
    .on('[data-trustoo="aantal"]', { element: (el) => void el.setInnerContent(String(stand.aantal)) })
    .on('[data-trustoo="cijfer"]', { element: (el) => void el.setInnerContent(c) })
    .on('[data-trustoo="vol"]', { element: (el) => void el.setAttribute('style', `--vol: ${vol(stand.cijfer)}`) })
    .on('script[type="application/ld+json"]', {
      text(t) {
        schema += t.text;
        if (!t.lastInTextNode) return void t.remove();
        const nieuw = schema
          .replace(/("ratingValue":\s*")[^"]*(")/, `$1${stand.cijfer.toFixed(1)}$2`)
          .replace(/("reviewCount":\s*")[^"]*(")/, `$1${stand.aantal}$2`);
        schema = '';
        t.replace(nieuw, { html: true });
      },
    })
    .transform(antwoord);

  const h = new Headers(uit.headers);
  h.delete('etag');
  h.delete('content-length');
  return new Response(uit.body, { status: antwoord.status, statusText: antwoord.statusText, headers: h });
}
