# Prospecting Strategy — Reactivating Down Sites (g1ga / dreamhost.nl / udome cluster)

**Owner:** alfred@fraktionx.com
**Created:** 2026-06-07
**Status:** Phase 1 complete (discovery + viability). Phase 2 (enrichment) runs in a fresh `jiw-websites` session **with Apify MCP enabled**.

---

## 1. The opportunity

A Dutch hosting reseller cluster — **g1ga.net** ("G1GA Anonymous Reseller System"), fronted by the brands **dreamhost.nl / dreamhost.be / udome.nl / udome.be** — ran ~466 customer domains off three nameservers:

| Nameserver | IP | Network |
|---|---|---|
| ns1.g1ga.net | 85.159.237.77 | NForce (NL, AS43350) |
| ns2.g1ga.net | 85.159.237.78 | NForce (NL, AS43350) |
| ns3.g1ga.net | 116.203.226.57 | Hetzner (DE, AS24940) |

**All three nameservers are offline** (UDP/TCP 53 dead, no ICMP). The `g1ga.net` zone returns SERVFAIL globally. Result: **447 of 466 customer domains are DOWN right now** — their websites and email simply don't resolve.

**The pitch:** "Your website (and email) has been down because your host's infrastructure failed. We can get you back online on modern, reliable infrastructure — fast." This is a warm, time-sensitive, concrete reason to make contact. `jiw-websites` already builds exactly these small-business sites (Cloudflare-hosted Astro apps), so we can rebuild + re-point in days.

---

## 2. What we already determined (Phase 1)

Files in `prospecting/data/`:
- `all-domains.txt` — 466 unique domains (union of ns1/ns2/ns3 reverse-NS).
- `ns1.txt` / `ns2.txt` / `ns3.txt` — per-nameserver deduped lists.
- `status.psv` — per-domain liveness + delegation check (`domain|LIVE/DOWN|delegation|ip|ns`).

Top-level output:
- `prospects.csv` — **405 deduplicated owner clusters** (TLD variants of the same brand merged), classified and ranked, with empty enrichment columns ready to fill.

Phase-1 numbers:
- **466 domains → 405 owner clusters** (multi-TLD owners deduped).
- **447 DOWN / 19 LIVE** (the 19 already migrated to TransIP, one.com, mijn.host, esmero, etc. — *someone already rebuilt them → deprioritize*).
- Cluster types: **127 business**, 184 `review` (likely business, no keyword hit), 59 `personal_lowpri`, 9 `flagged` (gambling/adult), 26 `infra_exclude` (the reseller's own brands).
- **124 DOWN business clusters = the immediate hit-list.**

> ⚠️ Classification is keyword-heuristic. Expect false positives (e.g. `arabella-cartoons`→"car", `4x4software`→automotive) and the large `review` bucket hides real businesses. Phase 2 enrichment is what confirms business-vs-personal and viability — do not treat Phase-1 `type` as final.

---

## 3. Viability definition

A **viable customer** = all of:
1. **Commercial intent** — a business that plausibly pays for a website (salon, garage, caterer, contractor, shop, practice…). Personal/hobby/club sites are lower value.
2. **Still operating** — the business exists today (Google Maps says open, recent social activity, or a recent archived site). A dead business is not a customer.
3. **Reachable** — we can get a phone, email, social DM, or physical address.
4. **Site actually down** — DOWN status (447 of them). LIVE(migrated) means someone else already won them.

**Re-registration angle:** a domain whose registration *lapsed* but whose business is still alive on Google Maps is still a great prospect — we help them re-register + rebuild. WHOIS expiry date (Phase 2) tells us which.

---

## 4. Enrichment pipeline (Phase 2 — needs Apify MCP)

Run per **owner cluster** (use `primary_domain` + `all_domains`), not per raw domain, to avoid contacting the same owner 6× for their TLD variants.

### Step A — WHOIS / RDAP (no Apify; do first, cheap)
For each `primary_domain`:
- Registrar, creation date, **expiry date** (registered vs lapsed), status.
- `.com/.eu/.org` sometimes expose org/registrant; `.nl/.be` are usually GDPR-masked (registrant via SIDN/DNS Belgium is hidden) — but **registrar + expiry still tell you a lot**.
- Tool: `whois <domain>` or RDAP (`https://rdap.org/domain/<domain>`).

### Step B — Wayback Machine (no Apify; the single richest source)
Most of these sites are archived. The last good snapshot usually contains **business name, phone, email, address, KvK number, opening hours, and social links** on the contact/footer page.
- Latest snapshot via CDX:
  `https://web.archive.org/cdx/search/cdx?url=<domain>&output=json&limit=-5&filter=statuscode:200`
- Fetch the snapshot, scrape: `mailto:` / `tel:` / address blocks / `KvK`/`BTW`/`VAT` numbers / `facebook.com|instagram.com|linkedin.com` links / business name in `<title>`/logo alt.
- This alone will resolve a large fraction of contacts **without Apify**.

### Step C — Apify actors (the heavy lifting)
Use the same actors `jiw-websites/tools/prompt-builder.html` and the `apps/*/INFO.md` already rely on:

| Goal | Actor | Input | Yields |
|---|---|---|---|
| Find the live business | `compass/crawler-google-places` (Google Maps) | `"<biz name> <city>"` or the address from Wayback | phone, address, **open/closed status**, website (new?), hours, rating, review count, category |
| Pull contacts from any URL | `apify/contact-info-scraper` (or `vdrmota/contact-info-scraper`) | archived URL or new site | emails, phones, social profiles |
| Confirm operating + DM channel | `apify/instagram-scraper` | handle/profile URL from Wayback/Maps | recent posts (active?), bio email/phone, DM target |
| Confirm operating + Page contact | `apify/facebook-posts-scraper` / FB page scraper | FB page URL | page "About" phone/email/address, last post date |
| Fill name→site gaps | a SERP/Google-search actor | `"<biz name> <city> contact"` | finds current site, listings, directories |

**Always record** per social/Maps pull: requested limit, returned count, **actor run ID + dataset ID** (the prompt-builder convention) so results are auditable and re-pullable.

### Step D — Business registries (official, free, authoritative)
- **NL — KvK** (Kamer van Koophandel): search by trade name/city → official company name, KvK number, address, **active/dissolved status**. (KvK has an API + public "Handelsregister" search.)
- **BE — KBO/BCE** (Crossroads Bank for Enterprises): public search by name → enterprise number, status, address.
- Use these to (a) confirm the business is legally active and (b) get the registered address for the Maps lookup.

### Step E — Email discovery + verification
- Patterns: `info@`, `contact@`, `<firstname>@`, `<naam>@` on the **original domain** (if still registered) — but note **MX is down** while on g1ga, so live SMTP verification will fail; rely on archived `mailto:` + Maps/socials instead.
- If a Hunter-style Apify actor is available, run it on the domain for known addresses.

---

## 5. Cross-matching logic

Join everything on **(normalized business name + city)** — that's the stable key across WHOIS, Wayback, Maps, registry, and socials. The domain is often *not* the join key (Maps listings rarely store the old domain).

Resolution order when sources disagree:
1. **Google Maps / registry** for address + phone + operating status (most current).
2. **Wayback** for the historical email + contact name + the social handles to seed Maps/IG/FB.
3. **WHOIS** for registered-vs-lapsed only (contact data usually masked).

Flag conflicts in `notes`. Mark `source` for every filled field.

---

## 6. Output schema (`prospects.csv`)

Already created with these columns — Phase 2 fills the empty ones:

`primary_domain, all_domains, variants, sector, type, status, current_host, family_hint,` **`biz_name, phone, email, address, contact_name, kvk_or_kbo, socials, wayback_url, source, notes`**

Add at the end of Phase 2:
- `operating` (yes/no/unknown — from Maps/socials)
- `viability` (high/medium/low — per §3)
- `outreach_channel` (phone / email / IG DM / FB / postal)

---

## 7. Prioritization for outreach

1. **DOWN + business + operating + multi-TLD** (owner invested in their brand → most likely to pay). `variants >= 2` is a strong buying signal.
2. DOWN + business + operating + single TLD.
3. DOWN + `review` bucket that enrichment reclassifies as an operating business.
4. Personal/club/`review` low-priority.
5. Skip: `infra_exclude`, `flagged`, and the 19 `LIVE(migrated)` (already rebuilt).

Sector clusters worth batching (similar pitch + reusable `jiw-websites` template): **beauty/nails/pedicure, automotive, construction, catering/food, photography, real-estate, health/therapy, jewelry (esp. the large Kasius family).**

---

## 8. Compliance & ethics (do not skip)

- **B2B cold outreach** to a business about *their own broken website* is legitimate-interest and defensible under GDPR + Dutch/EU rules — but **honor opt-out immediately**, identify yourself (Fraktionx), and keep the message relevant and factual.
- **Only collect business contact data** for the purpose of this outreach. Do **not** retain personal data of `personal_lowpri` individuals beyond what's needed; consider excluding pure-personal sites entirely.
- Don't misrepresent affiliation with g1ga/dreamhost/udome. The honest line: "we noticed your site is offline" — which is publicly verifiable.
- Respect each source's ToS (Wayback fine; scrape Maps/IG/FB via Apify actors which handle this; registries are public).
- Keep `prospecting/` out of any public repo (see README — it's gitignored).

---

## 9. Phase-2 runbook (copy-paste starting point for the Apify session)

```
cd jiw-websites          # start session HERE so Apify MCP + repo context load
# 1. WHOIS + Wayback pass (no Apify) over prospects.csv, businesses + review first:
#    for each primary_domain: rdap.org lookup + Wayback CDX latest snapshot + scrape contact page
# 2. For each cluster with a biz_name+city: run compass/crawler-google-places -> phone/address/operating
# 3. contact-info-scraper on archived URL (and any new site Maps reveals)
# 4. instagram-scraper / facebook scraper on handles found -> confirm operating + DM channel
# 5. KvK (NL) / KBO (BE) lookup by biz_name -> official name, number, active status
# 6. write back into prospects.csv: biz_name, phone, email, address, contact_name,
#    kvk_or_kbo, socials, wayback_url, source, notes, operating, viability, outreach_channel
# 7. produce prospecting/outreach-shortlist.csv = viability=high, sorted by sector
```

Start with the **124 DOWN business clusters**, then sweep the `review` bucket. Batch by sector so one rebuilt `jiw-websites` template + one pitch serves many.
