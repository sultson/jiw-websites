import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Path prefixes that mark a non-default locale; everything else is English at the root. */
const PREFIXED_LANGS = new Set(['nl', 'de', 'fr', 'es', 'it', 'pt', 'zh', 'ru']);

/** Route prefix -> the content module that supplies the copy on those pages. */
const SECTION_MODULES = [
  ['/immigration', 'immigration'],
  ['/housing', 'housing'],
  ['/relocation', 'relocation'],
  ['/industrial-expat-services', 'industrial'],
  ['/starting-a-business', 'business'],
  ['/vip-services', 'vip'],
  ['/guides', 'guides'],
];

const dates = new Map();

function lastEditedAt(file) {
  if (dates.has(file)) return dates.get(file);

  let iso;
  const absolute = join(appDir, file);
  if (existsSync(absolute)) {
    try {
      iso =
        execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
          cwd: appDir,
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore'],
        }).trim() || undefined;
    } catch {
      // Not a git checkout, or git is unavailable in this environment.
    }
    iso ??= statSync(absolute).mtime.toISOString();
  }

  dates.set(file, iso);
  return iso;
}

/**
 * lastmod for a sitemap entry, taken from the last commit that touched the
 * content module behind that route. Deriving it from copy rather than from
 * build time keeps the signal honest: a redeploy that changes nothing must not
 * claim every one of the 500-plus URLs changed, or Google stops trusting it.
 */
export function lastmodFor(url) {
  let path;
  try {
    path = new URL(url).pathname;
  } catch {
    path = url;
  }
  path = path.replace(/\/+$/, '');

  const first = path.split('/')[1];
  const lang = PREFIXED_LANGS.has(first) ? first : 'en';
  const route = lang === 'en' ? path : path.slice(lang.length + 1);
  const section =
    SECTION_MODULES.find(([prefix]) => route === prefix || route.startsWith(`${prefix}/`))?.[1] ?? 'core';

  return lastEditedAt(`src/content/${lang}/${section}.ts`);
}
