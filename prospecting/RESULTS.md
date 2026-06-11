# Phase 2 Results — Enrichment of DOWN g1ga/dreamhost/udome clusters

**Run:** 2026-06-07 · Apify MCP (`compass/crawler-google-places`) + RDAP. Owner: alfred@fraktionx.com

## Outputs
- `outreach-shortlist.csv` — **85 actionable clusters** (the deliverable), sorted confirmed → uncertain → low-value, then sector.
- `prospects.csv` — master; enrichment columns + `verdict/viability/confidence/maps_*/registrar/expiry` merged back for all matched clusters.
- `prospects-businesses-enriched.csv` / `prospects-review-enriched.csv` — per-batch enriched detail.
- `data/maps_*.json` — raw Google Maps pulls. `data/rdap*.tsv` — registrar/expiry. `data/apify-runs.md` — run/dataset IDs (provenance).

## Headline numbers
Processed **298 DOWN clusters** (124 business + 174 review).

| verdict | count | meaning |
|---|---|---|
| **confirmed** | **58** | operating business, identity matched (name + website host or exact brand). Real prospects. |
| confirmed_lowvalue | 13 | operating but institutional (school, church, club, public body, GP) — weak rebuild fit. |
| uncertain | 14 | a real business in the niche, but owner identity not confirmed — verify before outreach. |
| competitor | 11 | Maps returned a different business at the same trade/place (useful market context, not the owner). |
| wrong | 16 | word/place-name collision (e.g. arabella-cartoons→restaurant, meeustherapie→sawmill). |
| no Maps match | ~130 | mostly personal/hobby/abbreviation sites with no public business listing. |

**Contact coverage on the 58 confirmed:** 56 phone · 32 email · 22 socials. Channel is phone-first.

## Standout
- **Kasius jewelry family** — 5 clusters / **23 domains** (`.nl/.de/.be/.eu/.com`, incl. the 10-TLD `kasiussieraden.nl`) all resolve to **L-Kasius bv**, Rietdekkerstraat 10, Ridderkerk · +31 180 462 700 · verkoop@kasius.com. Highest multi-TLD investment in the whole set → top priority (§7 buying signal: `variants ≥ 2`).
- Other multi-TLD confirmed: berentschot.eu (Hoveniersbedrijf Berentschot), inkoopkracht.nl (Inkoop Kracht Centrale BV), bearoptimawood.eu, barlhezeconsort.nl.
- The **review bucket delivered ~30 businesses the keyword pass missed** (Accuweb, Quintruss BV, Jenniskens Kraanverhuur, HSO Hertzinger, Bear Optima Wood, Expo Beursstand, Gubbels grondverzet, Bruch Trading, DS Hortitrade, Static Motion, Stylinde, ZIEN24, JBM Buggenhout-BE, …) — confirming the caveat that `type=review` hid real prospects.

## Method
1. **RDAP per-TLD** (SIDN/Verisign/EURid/…): registrar + expiry. **0 of ~150 resolved domains are lapsed** → every owner still pays for their brand. The pitch is purely *"your host went dark, site is down"*, not re-registration.
2. **Google Maps** one place per decoded `"<name> <city>"` query, `countryCode` per TLD, contact enrichment on. Caribbean (Aruba/Curaçao/Bonaire) false matches flagged — `countryCode:nl` includes the Dutch Caribbean.
3. **Confidence scoring** on (distinctive domain token ∈ Maps title) + (domain prefix ∈ website host = "WEBMATCH", the strongest signal), then **manual verdict curation** (`data/verdicts-*.tsv`) to separate true owners from competitors/collisions — Phase-1 `type` was not treated as final.

## Known gap
- **Wayback (STRATEGY §B) was skipped:** `web.archive.org` is firewalled from this host (curl HTTP 000 + WebFetch blocked); only `archive.org/wayback/available` resolves. Google Maps covered contacts well enough (56/58 confirmed have a phone) that it wasn't blocking. To recover contacts for the ~14 uncertain + selected no-match clusters, route archived contact pages through the Apify `apify/rag-web-browser` actor (no local network dependency).
- KvK/KBO (§D) not run — Maps `B.V./bv` legal-name + active listing already evidences operating status; add KvK numbers at outreach time if needed.

## Next
1. Outreach to the 58 confirmed, batching by sector (one rebuilt `jiw-websites` template per cluster). Lead with **Kasius**.
2. Verify the 14 `uncertain` (quick manual Maps/site check) — promote real ones.
3. Optional: Apify-routed Wayback pass for `uncertain` + high-value no-match clusters.
