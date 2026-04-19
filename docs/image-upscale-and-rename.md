# Image upscale + rename flow

Workflow used to replace low-res / off-theme photos in an app with descriptive,
higher-res assets — applied to `apps/claires-skincare` on 2026-04-19.

## 1. Inspect what's there

- List files in `public/` with dimensions: `sips -g pixelWidth -g pixelHeight public/*.webp`.
- Use the `Read` tool on each image to visually identify subject matter.
- Flag: (a) duplicates, (b) off-theme shots, (c) anything below ~1500px on the long edge.

## 2. Source missing photos (Treatwell "Our Work")

Treatwell lazy-loads its gallery, so WebFetch won't see it. Use agent-browser:

1. `agent-browser open <venue-url> && agent-browser wait --load networkidle`
2. Accept cookies (`agent-browser click @eN` after `snapshot -i`).
3. `scrollIntoView` the "Our Work" heading via `eval` to trigger lazy-load.
4. Collect `img.src` via `eval`. The Treatwell CDN URL encodes dimensions + a
   signed hash, e.g. `v2.iID.w800.h1066.xHASH/`. The hash is tied to those
   dimensions — you cannot request larger by editing `w`/`h`.
5. `curl` each URL into a scratch dir like `public/treatwell-downloads/`.

## 3. Upscale hero / portrait via Runware

Runware's `imageUpscale` task type only accepts `upscaleFactor: 2` or `4`.

```bash
base64 -i photo.webp > /tmp/b64
# POST JSON array to https://api.runware.ai/v1 with
#   taskType: imageUpscale, inputImage: "data:image/webp;base64,<b64>",
#   upscaleFactor: 4, outputFormat: WEBP
curl -s -o out.webp "$(jq -r .data[0].imageURL response.json)"
```

Then downsize to sane web dimensions with `sharp` (hero ~2400w, portrait
~1600w, quality 82). 4× raw output is ~4000px / 600KB — too heavy to ship.

Runware API key lives in the `imagegen` skill (`~/.claude/skills/imagegen`).

## 4. Rename + convert to webp

Pattern: **kebab-case, 2–4 words, describes subject**. Examples:
`studio-wide.webp`, `claire-portrait.webp`, `before-after-forehead.webp`.

Use `sharp` to resize + re-encode Treatwell JPGs to webp at 1200w / q85.
Delete duplicates and off-theme shots.

## 5. Update code references

```bash
grep -rn "photo-[0-9]\+\.webp" apps/<app>/src
```

Edit `Hero.tsx`, `About.tsx`, `Gallery.tsx`. Keep alt text in the site's
primary language. Verify with `pnpm --filter @jiw/<app> lint` and by
screenshotting `http://localhost:<port>` with agent-browser.
