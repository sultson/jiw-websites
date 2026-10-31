/**
 * Writes the bundled copy (src/content.ts) into the dataset. createIfNotExists,
 * so a re-run never overwrites what was edited in the Studio.
 *
 *   pnpm --filter @jiw/demo seed
 *
 * Token: SANITY_AUTH_TOKEN, or the CLI login in ~/.config/sanity/config.json.
 */
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { defaults } from '../../src/content';

const cliToken = () => {
  try {
    return JSON.parse(readFileSync(path.join(homedir(), '.config/sanity/config.json'), 'utf8')).authToken as string;
  } catch {
    return '';
  }
};

const token = process.env.SANITY_AUTH_TOKEN || cliToken();
if (!token) throw new Error('No token: run `npx sanity login` or set SANITY_AUTH_TOKEN');

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'kkxa1yec',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  token,
  apiVersion: '2025-02-19',
  useCdn: false,
});

const tx = client.transaction();
tx.createIfNotExists({ _id: 'siteTeksten', _type: 'siteTeksten', ...defaults.site });
for (const { _id, ...rest } of defaults.berichten) tx.createIfNotExists({ _id, _type: 'bericht', ...rest });
await tx.commit();
console.log(`Seeded siteTeksten + ${defaults.berichten.length} bericht(en)`);
