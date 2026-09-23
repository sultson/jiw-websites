# Smooth By Lau brand assets

The Seasons Regular, Regular Italic and Bold are self-hosted as WOFF2. These three styles were extracted from the supplied `fontsamazings.har` (The Seasons 2.0.0); the archive itself is not part of the site. Regular is preloaded; italic and bold load only when used. Inter remains the body/UI font for legibility. The logo tagline is original outlined artwork, so it does not require a Montserrat download.

`public/brand/logo.svg` and `logo-reversed.svg` preserve the original supplied RGB logo paths and colours. `wordmark.svg` contains the original name lettering for the horizontal navigation lockup. `BrandMark.tsx` contains the original cropped SL symbol and separate champagne sparkle. The favicon reuses the same symbol on an ivory tile.

## Colours

- Ivory: `#F0ECEA` (original reversed logo)
- Monogram brown: `#654638`; original wordmark brown: `#654537`
- Champagne: `#B59D7E` (original sparkle and tagline)
- Deep brown: `#35251F` (readable body text and dark surfaces)
- Warm orange: `#B87135` (primary buttons and accents)
- Soft amber: `#CF9B6A` (accents on dark surfaces)
- Dark amber: `#945626` (small accent text on pale backgrounds)
- Button ink: `#25160E` (readable text on orange)
- Pale surfaces: `#E7DFD8`, `#F7F3F0`

Orange buttons use dark cocoa text for contrast. Dark surfaces use soft amber labels. The logo's two original brown values are intentionally preserved in the artwork.

The navbar entrance is CSS-only: a 5px settle and a small rotation/scale of the monogram sparkle. Content remains fully opaque throughout. It runs once per mount, has no delay or scroll observer, and is disabled when reduced motion is requested.

The full reversed logo appears in a 1.9-second translucent deep-brown opening splash with a fine champagne arch, then gently dissolves. The page remains visible beneath the overlay. The hero has no side logo. The splash is decorative, never captures input, clears on keyboard focus, and is omitted for reduced motion. Its dismissal is entirely CSS-driven; there is no loading gate.
