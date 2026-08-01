# Adding a language

Every language on this site is a strict 1:1 structural mirror of English. That was
a hard client requirement (the previous site changed its structure on language
switch, which broke both navigation and SEO). It also means a language is fully
described by English plus a flat map of translated leaf strings, so adding one is
a translation job, not a development job.

## Files

- `en.source.json` — every translatable string in the site, as `"json.path": "text"`.
  Regenerate with `node scripts/i18n-strings.mjs extract en`.
- `it.partial.json` — Italian, partially translated (see status below).

Slugs, image paths, form kinds and route paths are deliberately **absent** from
these maps. They are identity, shared byte-for-byte across languages, and changing
one breaks routing.

## Workflow

```bash
# 1. Export the strings a translator needs
node scripts/i18n-strings.mjs extract en > translations/en.source.json

# 2. Translator returns the same JSON with translated values, same keys.

# 3. Generate the language tree
node scripts/i18n-strings.mjs build it translations/it.json

# 4. Register it in src/lib/i18n.ts (LANGS, LANG_LABELS, OG_LOCALES,
#    BANNER_STRINGS) and src/lib/content.ts, then build.
```

`build` reports coverage and falls back to English for any key the map omits, so a
partial map always produces a site that compiles and renders. That is a safety net
for development, **not** a shipping state: do not register a language in `LANGS`
until its coverage is 100%, or visitors get an English page under a translated nav.

## Size

The site is **3,198 strings / ~45,000 words** per language. For reference, the
existing six languages were written by hand.

## Status

| Language | Coverage | Notes |
|----------|----------|-------|
| it | 517 / 3198 (16%) | Complete: all UI/nav, homepage, about, contact, privacy, 404 and every VIP page. Remaining: the 35 service pages and the guides. |
| pt | 0 | Not started. |
| zh | 0 | Not started. |
