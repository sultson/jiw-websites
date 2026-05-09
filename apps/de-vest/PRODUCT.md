# De Vest Schilderwerken

Marketing site for a third-generation Dutch painting firm in Eindhoven. The business has been continuously operating since around 1930 under three names and three Hoevenaars (Antoon → Pierre → Toon), and that lineage is the single most distinctive thing about it. Every competitor can claim quality. Almost nobody can claim 80+ years.

The current site (devestschilderwerken.nl) is a generic contractor template with stock-feeling copy and no portfolio depth. It under-sells the firm. The new site has to do two jobs at once: (1) communicate the heritage and craft credibility a 95-year-old practice has earned, (2) showcase the real, distinctive project work — restoration, decorative finishing, vliesbehang, latex- en lakspuitwerk — in a way that reads as a portfolio, not a service brochure.

## Register

**brand** — this is a marketing site. Design IS the product.

## Users

Two audiences, in priority order:

1. **Homeowners** in Eindhoven, Valkenswaard, Waalre, Veldhoven, Geldrop, and the wider Kempen corridor planning a paint or wallpaper job. They are typically renovating a kitchen, refreshing a living room, choosing a statement vliesbehang, or restoring an older home. They want craftsmanship, tidiness, and a person they can trust in their house. Decision triggers: a tired front door, a cracked plaster wall, a kitchen they want sprayed back to factory finish, a feature wall they want done properly with the right behang.
2. **Light commercial / property owners** with offices, shopfronts, restaurants, and historic buildings (per their portfolio: casino's, bankgebouwen, oude boerderijen). Lower volume, higher-margin, and the heritage credibility plays especially well here.

Both audiences are Dutch-first. The English layer exists for expats in the Eindhoven tech corridor (ASML, High Tech Campus) and stays secondary.

## Product purpose

Convert "we should get a serious painter in for this" into a submitted intake with photos, postcode, and a service category, OR into a phone call. The site exists to make Toon's first vrijblijvend bezoek feel inevitable.

Heritage and portfolio together do the trust-building. The intake form removes the friction. The phone number sits prominently for the homeowner who wants to talk to a person.

## Brand voice

- **Warm vakman.** Per the owner's note: "warm, excited about projects, positive". Where Kok is calm-and-dry, De Vest is calm-and-warm. The firm is proud of its work and its history. Lean into that without going salesy.
- **Concrete, not marketing.** Names tools, brands, techniques: Sigma, Sikkens, Trimetal, Caparol, Veveo. Imitatiemarmer, glas in lood, vliesbehang. Specifics build trust.
- **Three generations, lightly.** The lineage gets one full Historie spread and a small recurring `№ III` mark. Don't repeat "since 1930" in every paragraph. Heritage shown, not shouted.
- **No exclamation marks. No superlatives. No "trots".** Sentences short, declarative, occasionally warm.
- **Dutch first, written like a Dutch craftsman, not translated marketing English.** EN copy stays terse and factual.

## Anti-references

What this site must not look like:

- The cluttered WordPress contractor template (their current site): hero photo + 6-pack icon grid + cookie banner + stock-photo painter in white overalls.
- "Schilders Eindhoven" SEO landing pages with stock paint cans.
- Heritage-kitsch: parchment textures, sepia photos, fake apothecary stamps, vintage labels. We earn heritage through type and editorial restraint, not skeuomorphism.
- Aggressive primary-colour CTAs ("BEL NU!") and orange exclamation badges. The brand orange is real and bright; that means deploying it sparingly, never as a panic button.
- SaaS-cream / pastel-gradient lifestyle aesthetic.
- Identical card grids of icon + heading + text.

Closer to: an architect's portfolio, an editorial magazine spread on a craftsman, a B-Corp manufacturing brand's about page, a high-end interiors atelier. Not a trade-services lead-gen template.

## Strategic principles

1. **The lineage is the differentiator.** Antoon (1930s, ambachtelijk werk, glas in lood, imitatiemarmer) → Pierre (industrieterrein De Vest, casino's, bankgebouwen, sierpleisters) → Toon (third generation, present day). The Historie spread is the proof. Every other section quietly reinforces it.
2. **Photos are proof.** The Insta and FB archives have unusually good interior, restoration, and vliesbehang photography. The portfolio reads as portfolio first, decoration second. No duplicates with other JIW sites.
3. **Vliesbehang earns its own surface.** Wallpaper close-ups are where their work is genuinely distinctive. Don't bury them in a generic gallery thumbnail row.
4. **Materialen are credentials.** Sigma, Sikkens, Trimetal, Caparol, Veveo as a small wordmarked trust strip — concrete proof of professional supply chain.
5. **Werkwijze is honest and detailed.** Six steps, including the yearly maintenance check. Most contractor sites stop at three. The fact that they keep coming back to inspect outdoor paintwork annually is a real differentiator — surface it.
6. **Intake form > phone, but phone stays visible.** The form (with photos, postcode, service category) routes to toon@devestschilderwerken.nl via the shared Worker + R2 setup. The phone number 06 53 86 00 31 is always one tap away on mobile.

## Constraints to respect

- Lead routing goes to `toon@devestschilderwerken.nl` and uploads to the shared R2 bucket `jiw-form-uploads-prod` under prefix `de-vest/`.
- KvK number is known: 17176973. BTW: NL001698069B93. IBAN: NL84 RBRB 8841 7363 13. These belong in the Footer legal line, nowhere else.
- Owner identity (Toon Hoevenaars) is fine to surface in Historie. Don't fabricate quotes from him.
- No invented project descriptions. If a portfolio image lacks a real caption, leave it visual-only.
- Address: Enzerink 38, 5655 EH Eindhoven. Phone: 06 53 86 00 31.
- Logo SVG is `de-vest-schilderwerken.svg` at the app root. The orange `#fd7f2c` and the verfroller graphic are brand-true; treat them as locked, not redesignable.
