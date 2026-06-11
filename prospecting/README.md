# prospecting/

Lead-generation pipeline for **down sites on the g1ga.net / dreamhost.nl / udome nameserver cluster** —
~466 small-business domains whose host went dark, now prospects for a `jiw-websites` rebuild.

Read **`STRATEGY.md`** first — it's the full playbook and Phase-2 runbook.

## Files

| File | Tracked? | What |
|---|---|---|
| `STRATEGY.md` | yes | The plan: opportunity, viability rules, enrichment pipeline, compliance, runbook |
| `README.md` | yes | This file |
| `prospects.csv` | **gitignored** | 405 owner clusters, classified + ranked, empty enrichment columns to fill |
| `prospects-businesses-down.csv` | **gitignored** | Phase-2 hit-list: DOWN + business clusters only |
| `data/all-domains.txt` | gitignored | 466 unique domains (union of ns1/ns2/ns3 reverse-NS) |
| `data/ns{1,2,3}.txt` | gitignored | per-nameserver deduped domain lists |
| `data/status.psv` | gitignored | `domain\|LIVE/DOWN\|delegation\|ip\|ns` liveness check |

`prospects.csv` / `data/` are gitignored because they hold (or will hold) business contact data. Methodology docs stay tracked.

## State

- **Phase 1 (done):** discovery (reverse-NS), dedup (466→405 clusters), liveness (447 DOWN / 19 migrated), heuristic classification. No Apify needed.
- **Phase 2 (done 2026-06-07):** enriched 298 DOWN clusters (124 business + 174 review) via Google Maps + RDAP → **58 confirmed prospects, 13 institutional, 14 to verify**. See **`RESULTS.md`** and **`outreach-shortlist.csv`**. Run IDs in `data/apify-runs.md`. Wayback step skipped (host firewalled — see RESULTS gap).
- **Phase 3 (next):** outreach to the 58 confirmed (lead with the Kasius family, 23 domains → L-Kasius bv); verify the 14 uncertain.

## Why these are down

`ns1/ns2/ns3.g1ga.net` (NForce NL + Hetzner DE) are all offline → port 53 dead → the whole zone SERVFAILs → every customer domain delegated to them is unreachable. That outage is the outreach hook.

## Quick start (Phase 2)

```
cd jiw-websites                      # load Apify MCP + repo context
open prospecting/prospects-businesses-down.csv   # the 124-cluster hit-list
# Then per STRATEGY.md: WHOIS/RDAP -> Wayback contact scrape -> Apify Google Maps
# -> contact-info/IG/FB actors -> KvK/KBO -> write back enrichment columns.
```
