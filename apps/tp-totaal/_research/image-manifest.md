# TP Totaal — Image Manifest

Source: Trustoo pro #66269 (`static.trustoo.nl/pros/66269/...`). All 14 originals downloaded and re-encoded to WebP q=82, longest edge capped at 1800 px. Hero and og generated from the same source set. Total output: ~2.55 MB across 15 files.

## Hero

| File | Source URL hash | Dimensions | Size | Purpose |
| --- | --- | --- | --- | --- |
| `public/hero.webp` | `7945b8f0f3.jpg` | 1200x1600 | 277.7 KB | Bedrijfslogo / hoofdfoto — primary hero / branding shot |

## Social

| File | Source | Dimensions | Size | Purpose |
| --- | --- | --- | --- | --- |
| `public/og.webp` | `82e5c8f8eb.jpg` (project-schilderwerk; largest original at 3024x4032) | 1200x630 | 101.9 KB | Open Graph / Twitter card image, cover-cropped with attention focal point |

## Gallery (Trustoo "Foto's")

| File | Source URL hash | Dimensions | Size | Trustoo label |
| --- | --- | --- | --- | --- |
| `public/portfolio/gallery-1.webp` | `0708ba4007.jpg` | 1200x1600 | 164.7 KB | schilder_rotterdam_TP_Totaal_Project_Onderhoud_2 |
| `public/portfolio/gallery-2.webp` | `8387d9d8c1.webp` | 1012x1800 | 160.5 KB | schilder_rotterdam_TP_Totaal_Project_Onderhoud_3 |
| `public/portfolio/gallery-3.webp` | `bf070d14d4.webp` | 1200x1600 | 93.7 KB | schilder_rotterdam_TP_Totaal_Project_Onderhoud_4 |
| `public/portfolio/gallery-4.webp` | `1f7a87b235.webp` | 1600x1200 | 157.1 KB | schilder_rotterdam_TP_Totaal_Project_Onderhoud_5 |
| `public/portfolio/gallery-5.webp` | `d862004c7a.webp` | 1012x1800 | 270.3 KB | schilder_rotterdam_TP_Totaal_Project_Onderhoud_6 |
| `public/portfolio/gallery-6.webp` | `e2d62cb88b.jpg` | 1200x1600 | 249.2 KB | schilder_rotterdam_TP_Totaal_Project_Onderhoud_7 |

## Uitgevoerde opdrachten (project ensembles)

| File | Source URL hash | Dimensions | Size | Project label |
| --- | --- | --- | --- | --- |
| `public/portfolio/project-schilderwerk.webp` | `82e5c8f8eb.jpg` | 1350x1800 | 214.3 KB | Schilderwerk (algemeen) |
| `public/portfolio/project-binnen.webp` | `c1c2c17024.jpg` | 1200x1600 | 46.5 KB | Schilderwerk binnen |
| `public/portfolio/project-buiten-a.webp` | `404cd1206e.jpg` | 1200x1600 | 230.4 KB | Schilderwerk buiten (project A) |
| `public/portfolio/project-buiten-b.webp` | `3161c49def.jpg` | 1200x1600 | 164.7 KB | Schilderwerk buiten (project B) |
| `public/portfolio/project-badkamer-a.webp` | `dcf527fe9a.webp` | 1012x1800 | 270.3 KB | Badkamer renovatie + schilderwerk |
| `public/portfolio/project-badkamer-b.webp` | `69bbbc4c3f.webp` | 1600x1200 | 157.1 KB | Badkamer renovatie |
| `public/portfolio/project-keuken.webp` | `ae13b9aa98.webp` | 1200x1600 | 57.4 KB | Keuken renovatie |

## Notes

- Trustoo serves originals at the unprefixed path; all 14 URLs returned full-quality bytes on first try (220-2400 KB originals). No 404s, no fallback transforms needed.
- Trustoo's "Uitgevoerde opdrachten" section reuses three of the gallery images: `0708ba4007` = `3161c49def` content match (gallery-1 / project-buiten-b), `1f7a87b235` = `69bbbc4c3f` (gallery-4 / project-badkamer-b), `d862004c7a` = `dcf527fe9a` (gallery-5 / project-badkamer-a). Files are duplicated under both names so the UI can address them by their intended role; consider deduping at the component layer.
- 17 of the 23 photos Trustoo claims are behind a JS modal and would require Playwright/Puppeteer to enumerate — not pulled here.
- og.webp uses `project-schilderwerk` (3024x4032 source, the largest original) cover-cropped to 1200x630 using sharp's `attention` strategy for focal selection.
- All re-encoded at WebP q=82, longest edge 1800 px, aspect preserved.
