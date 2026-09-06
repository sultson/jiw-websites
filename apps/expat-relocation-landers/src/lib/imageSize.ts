import { readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Intrinsic pixel size of a JPEG in public/, read straight from its header.
 *
 * Every <Photo> needs the real ratio in its width/height attributes or the
 * browser reserves the wrong box and the page jumps while the image loads.
 * This runs at build time only, so a 20-line SOF walk is cheaper than pulling
 * sharp into the component graph, and the results are memoised because the
 * same handful of files are asked for on every page.
 */
const cache = new Map<string, { width: number; height: number }>();

const FALLBACK = { width: 1264, height: 848 };

/** Markers that carry no frame dimensions and are skipped while scanning. */
const STANDALONE = new Set([0xd8, 0xd9, 0x01, 0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7]);

function readJpegSize(file: string): { width: number; height: number } {
  const buf = readFileSync(file);
  if (buf.readUInt16BE(0) !== 0xffd8) return FALLBACK;

  let offset = 2;
  while (offset < buf.length - 9) {
    if (buf[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buf[offset + 1];
    if (marker === 0xff) {
      offset += 1;
      continue;
    }
    if (STANDALONE.has(marker)) {
      offset += 2;
      continue;
    }
    // SOF0..SOF15, minus the four that are not frame headers (DHT, JPG, DAC).
    const isFrame = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isFrame) return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
    offset += 2 + buf.readUInt16BE(offset + 2);
  }
  return FALLBACK;
}

/** `src` is a public-root path such as `/images/ph-hero.jpg`. */
export function intrinsicSize(src: string): { width: number; height: number } {
  const clean = src.split('?')[0];
  const hit = cache.get(clean);
  if (hit) return hit;

  let size = FALLBACK;
  try {
    size = readJpegSize(path.join(process.cwd(), 'public', clean));
  } catch {
    // A missing file is a content bug, not a build-stopper: the fallback ratio
    // keeps the page rendering and the broken image is obvious in review.
  }
  cache.set(clean, size);
  return size;
}
