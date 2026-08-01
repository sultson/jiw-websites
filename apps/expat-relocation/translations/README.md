# Adding a language

Every language on this site is a strict 1:1 structural mirror of English. That was
a hard client requirement (the previous site changed its structure on language
switch, which broke both navigation and SEO). It also means a language is fully
described by English plus a flat map of translated leaf strings, so adding one is
a translation job, not a development job.

## Files

- `en.source.json` — every translatable string in the site, as `"json.path": "text"`.
  Regenerate with `node scripts/i18n-strings.mjs extract en`.
- `it.json`, `pt.json` — complete maps. Either is a good reference for what a
  finished one looks like.

Slugs, image paths, form kinds, route paths and `fees.kind` are deliberately
**absent** from these maps. They are identity rather than prose: shared
byte-for-byte across languages, and translating one breaks routing or the build.

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

The site is **3,163 strings / ~45,000 words** per language, which is what a
translator needs to quote against. Every language currently live was written by
hand rather than machine-translated.

## Status

| Language | Coverage | Live |
|----------|----------|------|
| en, nl, de, fr, es, ru | 100% | yes |
| it | 100% | yes |
| pt | 100% | yes |
| zh | in progress | no |

Portuguese and Chinese are the outstanding two of the client's requested eight.
Both are a straight translation of `en.source.json`; nothing in the codebase has
to change to add them beyond the registration step above.
