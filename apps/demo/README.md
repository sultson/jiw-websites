# demo

A test site for playing with Sanity, on **demo.jouwconcept.app**, Studio at **/beheer**.
A stripped-down copy of the `apps/klashorst` pattern: one page, one Worker, one Studio.

- Sanity project `kkxa1yec`, dataset `production` (public). CORS: the live host plus
  localhost 3076 / 3376 / 8787, all with credentials.
- `worker/index.ts` serves `/beheer/*` the Studio page and inlines the content into
  every HTML response as `<script id="demo-content">`. 5s edge cache, `?fresh=1` skips it,
  `?preview=<PREVIEW_KEY>` reads drafts with the `SANITY_READ_TOKEN` secret.
- `src/content.ts` holds the bundled copy (shown only when no CMS answer arrived) and
  is what `pnpm seed` writes.
- Studio: `studio/` — two types, `siteTeksten` (singleton) and `bericht`. Dutch UI,
  Start screen, Voorbeeld tab, pinned to drafts (see `tools/AlleenConcepten.tsx`).

```
pnpm --filter @jiw/demo dev              # site on :3076 (bundled copy, no Worker)
pnpm -C apps/demo/studio dev             # Studio on :3376
pnpm --filter @jiw/demo seed
set -a && source .env && set +a && pnpm --filter @jiw/demo ship
```

Adding a field: schema in `studio/schemas`, the projection in `QUERY` in
`worker/index.ts`, the type + `leeg` + defaults in `src/content.ts`, then render it.
All four, or the field is dead.
