# Learnings from making the SQM Bouwmanagement concept

A scrapbook of the genuinely useful things, the dead ends, and what (or who) was the MVP at each rough point. Written in the order they actually happened, not the order that would have looked clever in hindsight.

---

## 1. INFO.md is the brief. Read it like a contract.

The only docs the user gave were two werkspot URLs, a brand sheet PNG, and one paragraph noting an identity-fraud incident. That paragraph quietly imposed two hard constraints I had to bake into every later decision:

- **No personal name surfaces in rendered HTML.** Not in the About section. Not in reviews. Not even in alt text. Owner's name appeared in nearly every werkspot review response ("Groeten Peter van Dijk"); the only safe path was to substitute with brand voice ("het team", "de vakman") on the way in.
- **The site exists because the previous one was taken down.** Trust signals had to do the work that an owner photo / "About me" page would normally do. So: KvK number, "sinds 2000", Werkspot 4,8 / 267 reviews, and "geverifieerd" badges got promoted into the credentials sheet treatment in the hero.

**MVP here:** the user's INFO.md note. Six lines, two constraints, zero ambiguity. If they had buried this in a verbal aside or a Slack message, I'd have shipped a generic "About the founder" block.

---

## 2. WebFetch died on werkspot. Apify saved the run.

```
> WebFetch werkspot.nl/profiel/sqm-bouwmanagement
HTTP 403 Forbidden
```

Werkspot blocks server-side fetchers. Pivoted to the `apify/rag-web-browser` actor (browser-playwright mode), which renders the page and returns clean markdown:

```json
{ "query": "https://www.werkspot.nl/profiel/sqm-bouwmanagement",
  "scrapingTool": "browser-playwright", "outputFormats": ["markdown"] }
```

Two follow-up calls (page=1, page=2) gave me 18+ usable reviews and the complete service list. **The whole information architecture pivoted off the scraped content** — see point 3.

**MVP:** `apify/rag-web-browser`. It's the difference between "site has invented copy" and "site has copy with the cadence of real client language" (e.g. "Hoewel er tegenslag was met zieke collega en slecht weer..."). That cadence is unfakeable.

---

## 3. The brand sheet lied about the business. Cross-check with reality.

The brand sheet's tagline ("Bouwen aan kwaliteit, beheren met visie") and pillar words (Structuur · Inzicht · Kwaliteit · Resultaat) read like a **construction management consultancy**. That's what I planned for in the first cut.

The scrape revealed: this is a hands-on **roofing / painting / inspections** specialist. Bitumen roofs, PVC dakbedekking, NEN 2767 condition surveys, drone inspections, lead work, exterior painting. The brand voice was abstract; the business is concrete.

The fix: keep the brand pillars (they still describe how the work is done), but make the *Diensten* section unambiguously trade-specific (4 clusters: Dak, Lood, Schilder, Inspecties). The two layers reconcile because "bouwmanagement" in the company name is doing the lifting, the brand sheet is decoration on top of execution.

**Lesson:** brand language and operational reality can drift. Always validate IA against the actual deliverables, not the deck.

---

## 4. The image URL pattern was undocumented. Probe it.

Werkspot serves portfolio images under `/images/sp/{size}/{uuid}.jpg`. I had `thumbnail_small` from the scrape (3KB, useless). I tried `large`, `full`, `extra_large`, `original`, `thumbnail_large`, `medium`, `gallery` — only **`original`** and `thumbnail_large` returned 200, and `original` was the 2048×1536 source.

```bash
for size in original full large thumbnail_large medium gallery; do
  curl -sS -o /dev/null -w "$size %{http_code} %{size_download}\n" \
    "https://www.werkspot.nl/images/sp/${size}/57021466-...jpg"
done
```

Five seconds of probing turned a 3KB asset into 300KB. Sharp then took it the rest of the way (4MB → 1.5MB after WebP).

**Lesson:** when an API has size variants, brute-force the namespace before settling for what's documented.

---

## 5. Build problem: Tailwind v4 cannot @apply custom utilities.

```css
.field-area { @apply field; min-height: 120px; }   /* fails */
```

Error: *"Cannot apply unknown utility class `field`"*. Tailwind v4 only resolves builtin utilities through `@apply`; custom component classes are opaque. The fix is to expand inline:

```css
.field-area {
  @apply w-full px-4 py-3 rounded-sm border border-charcoal/15 ...;
  min-height: 120px;
}
```

Same problem hit `.pill-orange { @apply pill ... }`. **Lesson:** in Tailwind v4, treat `@layer components` rules as terminal — don't compose them.

---

## 6. tsconfig `"types": ["node"]` is a leaky cargo-cult.

Copied `"types": ["node"]` from smooth-by-lau because it was the closest analog. `tsc --noEmit` immediately:

```
error TS2688: Cannot find type definition file for 'node'.
```

smooth-by-lau has `@types/node` in devDeps; rn-schilders doesn't list `"types"` at all. The vite config doesn't actually need node types in this app, so the right move was to drop the line entirely rather than add the dep.

**Lesson:** when copying config from a sibling app, copy *only* the bits whose dependency you understand. The other bits are noise.

---

## 7. The shared `@jiw/cloudflare-forms` package is the real engine.

`apps/rn-schilders/worker/index.ts` is 250 lines but the form intake is only ~15 of those (a `createFormWorker({ formPath, requiredFields, emailFields, ... })` call). The package handles:

- multipart parsing
- field validation (with conditional `when` predicates)
- R2 uploads under per-site prefixes
- HTML + plain-text email rendering for both the lead and the confirmation
- signed attachment URLs in the lead email

I configured it for SQM in 50 lines including the React form component. **No bespoke form code** in `worker/index.ts` for the new site; just `formPath`, `siteName`, `requiredFields`, `emailFields`. The lead lands at `hallo@jouwidealewebsite.nl` with attachments linkable from R2.

**MVP:** whoever extracted `@jiw/cloudflare-forms` into a package. The cost of building this from scratch per site would have eaten half the budget. Lesson for future client sites: spend the first hour reading what's already in `packages/`, not coding.

---

## 8. The translation layer is also the copy-edit layer.

When the user said "remove every em dash", the change was 30 `Edit` calls all hitting `src/translations.ts`. Components never see raw copy — they only ever call `t('hero.sub')`. So global tone changes ("more human", "less formal", "no em dashes") become a one-file refactor instead of a hunt across 12 components.

The single trap: numbered labels like `'01 · Opname'` were being parsed in `Werkwijze.tsx` via `split('—')`. When the separator changed, the split logic had to change too. **Code that interprets translation strings is a hidden coupling.** I'd avoid that pattern next time and put the visual separator in the markup, not the string.

---

## 9. Lazy-loaded images blank out screenshots — and that lied to me about the design.

The first design pass screenshot showed an **empty gray Showcase grid**. I almost re-styled around what I thought was a layout bug. The actual cause: `loading="lazy"` images below the fold don't fire on a `screenshot --full` because the viewport never visits them.

Fix combined two things:
1. Mark the first 8 tiles `loading="eager"` so they're never lazy.
2. Run a scroll dance before the screenshot so all lazy tiles trigger:
   ```bash
   agent-browser scroll down 1000 && wait 500 \
     && scroll down 3000 && wait 800 \
     && scroll down 6000 && wait 1500 \
     && eval 'window.scrollTo(0,0)' && wait 500 \
     && screenshot --full
   ```

**Lesson:** before "improving" a design from a screenshot, prove the screenshot is faithful.

---

## 10. The design-iterator subagent + agent-browser CDP loop is the highest-leverage tool I touched.

I made the rough draft. The `compound-engineering:design:design-iterator` subagent then ran 3 screenshot → analyze → improve → screenshot cycles in a single delegation, touching 8 components. What it produced (numbered FAQ counters, the asymmetric bento Showcase, the "Credentials 01" hero card, the diagonal-stripe footer ribbon) would have taken me 4–5 manual prompts and probably half the polish quality. The agent saw things I'd already stopped seeing.

What made it work:
- **Hand it the constraints, not the solutions.** I told it the brand palette, the do-not-touch list, the file paths, and the screenshot procedure. I did NOT tell it which CSS to write.
- **Hand it the screenshot procedure.** Without the scroll-trigger dance from point 9, it would have been improving a phantom layout.
- **Tell it what to keep.** Worker code, wrangler config, translation keys, intake form fields, package.json — all explicitly off-limits. That's how you avoid downstream cleanup.

**MVP:** `agent-browser` (CDP-driven Chrome via the `compound-engineering:agent-browser` skill). It's what closes the visual feedback loop in seconds instead of "open localhost in your head".

---

## 11. Default language: respect the audience, not the browser.

First pass: `useLang` defaulted to NL only if `navigator.language !== 'en'`. Worked fine for me locally, but the user is showing this to a Dutch contractor and the headless review browser was reporting `en-US`, so the live preview kept booting English. The audience is Dutch. The default is Dutch. Browser language is interesting only after the user has expressed a preference.

```ts
function initialLang(): Lang {
  if (typeof window === 'undefined') return 'nl';
  const stored = window.localStorage.getItem(KEY);
  if (stored === 'nl' || stored === 'en') return stored;
  return 'nl';   // <-- default, period
}
```

**Lesson:** "smart" defaults are dumb when the audience is monolingual.

---

## 12. The whole-codebase grep is the cheapest review tool.

After the em-dash removal looked done, one grep:

```bash
grep -rn "—" src/ index.html worker/ scripts/
```

surfaced a stray `console.log` in `optimize-images.ts` that I never would have spotted by reading. Same trick verified the identity-scrub: a final `grep -ri "peter\|van dijk" src/` should always come back empty before this site goes live. (It does.)

---

## 13. Things I'd do differently next time

1. **Scrape first, plan second.** I committed to the IA before the scrape and had to revise. Twenty minutes of Apify upfront saves an hour of repositioning later.
2. **Probe image-CDN size variants on day one.** Knowing `original/` works changes how you stage the asset pipeline.
3. **Make em-dash policy explicit at the start.** I wrote ~40 of them into translations and removed them after. A "no em dash" rule in the system prompt or a CI check would catch this.
4. **Inline the visual separator, not the copy separator.** `'01 · Opname'` couples markup to translation. `<span>{number}</span> · <span>{label}</span>` doesn't.
5. **Default new sites' tsconfig to no `"types"` array.** Add `["node"]` only when something explicitly needs it.

---

## MVP roll call

| Where I got stuck | What got me unstuck |
|---|---|
| Werkspot 403 | `apify/rag-web-browser` actor |
| 3KB thumbnail images | Probing `/images/sp/{variant}/` — `original` won |
| Tailwind `@apply field` build error | Inlining the rule, abandoning composition |
| `tsc` "Cannot find type definition file for 'node'" | Removing the `"types": ["node"]` line |
| Empty Showcase grid in screenshots | Scroll-trigger dance + eager-load first 8 tiles |
| Building intake form from scratch | `@jiw/cloudflare-forms` shared package, ~50 lines of config |
| Visual polish ceiling | `compound-engineering:design:design-iterator` agent over `agent-browser` CDP |
| Owner identity leaking from source | Translation layer + final `grep` audit |

The single highest-leverage move: **delegating the design polish to the design-iterator subagent with a strict constraint list.** Everything else was setup so that delegation could land cleanly.
