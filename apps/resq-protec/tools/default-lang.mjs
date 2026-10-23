// The language that sits on `/` (the others live under /<lang>). One source of truth:
// the DEFAULT_LANG var in wrangler.jsonc, which the Worker reads at runtime. The build
// reads the same var here, so pages and Worker cannot disagree. A DEFAULT_LANG env var
// overrides it for a one-off build (see README, "Trying another default language").
import { readFileSync } from 'node:fs';

export function defaultLang() {
  const fromEnv = process.env.DEFAULT_LANG;
  const config = readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8').replace(/^\s*\/\/.*$/gm, '');
  const fromConfig = config.match(/"DEFAULT_LANG"\s*:\s*"([a-z]+)"/)?.[1];
  const lang = fromEnv || fromConfig;
  if (!['nl', 'en', 'de'].includes(lang)) throw new Error(`DEFAULT_LANG must be nl, en or de (got ${lang})`);
  return lang;
}
