/**
 * De site is statisch: alle acht de paginas staan als html in dist/ en Workers
 * assets levert ze uit. Deze worker staat er voor de hosts - welke van de drie
 * de echte is, en wat de andere twee doen.
 *
 * Drie hosts komen hier binnen (zie wrangler.jsonc):
 *   dagmarvoss.nl                              de site zelf
 *   www.dagmarvoss.nl                          301 hierheen
 *   dagmarvoss-concept.jouwidealewebsite.nl    de site, maar noindex
 *
 * Waarom www een 301 krijgt en niet gewoon dezelfde site uitlevert: twee
 * adressen met status 200 op dezelfde inhoud is voor een zoekmachine twee
 * sites. De canonical in de html wijst al naar het kale adres, maar dat is een
 * advies; dit is een feit.
 *
 * Pad en zoekreeks gaan mee. Een omleiding die alles op de voorpagina laat
 * uitkomen gooit de bezoeker van een gedeelde link naar /coaching/ terug naar
 * het begin, en dat is net zo stuk als een dode link.
 *
 * http gaat hier ook naar https. Dat is normaal een schakelaar in de zone
 * (Always Use HTTPS), maar die staat niet vanzelf aan op een nieuwe zone en
 * het token hier mag zone-instellingen alleen lezen - zie de root CLAUDE.md,
 * cdlf liep er op 10-10-2026 tegenaan met een gewone 200 op http.
 *
 * LET OP: dit werkt alleen met `run_worker_first: true` in wrangler.jsonc.
 * Workers assets levert een bestand dat in dist/ staat zelf uit en draait de
 * worker dan NIET - die is standaard alleen de terugval voor wat er niet ligt.
 * Zonder die vlag wordt deze omleiding dus nooit uitgevoerd en geven www en
 * het conceptadres allebei een gewone 200 met de hele site erop: precies de
 * twee kopieen die dit moet voorkomen.
 */

const DOEL = 'dagmarvoss.nl'
const CONCEPT = 'dagmarvoss-concept.jouwidealewebsite.nl'

/**
 * Het conceptadres is met de klant gedeeld en moet blijven antwoorden, dus het
 * levert de site uit - maar met noindex, want anders staan er twee
 * indexeerbare kopieen van dezelfde acht paginas en is die van ons de kopie
 * zonder autoriteit.
 *
 * Een 301 naar het kale adres zou netter zijn, maar kan nu niet: de
 * nameservers van dagmarvoss.nl staan nog bij Antagonist en daar staat
 * Dagmars eigen site. Een 301 maakt onze site dan onbereikbaar, ook voor
 * Armando die hem komt nakijken. Zet dit op true zodra die knip gemaakt is en
 * dagmarvoss.nl echt deze site uitlevert - dan is de 301 het betere antwoord
 * en wordt de kracht van rondgestuurde conceptlinks doorgegeven.
 */
const CONCEPT_OMLEIDEN = false

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.hostname === CONCEPT && !CONCEPT_OMLEIDEN) {
      if (url.protocol !== 'https:') {
        url.protocol = 'https:'
        url.port = ''
        return Response.redirect(url.toString(), 301)
      }
      const res = await env.ASSETS.fetch(request)
      /* Een Response uit de assets-binding heeft onveranderlijke headers; een
         nieuwe eromheen maakt ze schrijfbaar. 204 en 304 mogen geen body
         dragen. */
      const out = new Response(res.status === 204 || res.status === 304 ? null : res.body, res)
      out.headers.set('X-Robots-Tag', 'noindex, nofollow')
      return out
    }

    if (url.hostname !== DOEL || url.protocol !== 'https:') {
      url.protocol = 'https:'
      url.hostname = DOEL
      url.port = ''
      return Response.redirect(url.toString(), 301)
    }

    return env.ASSETS.fetch(request)
  },
}
