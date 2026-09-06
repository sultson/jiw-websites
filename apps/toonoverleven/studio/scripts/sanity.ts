/**
 * Wat de schrijvende scripts delen: de verbinding met de dataset en het
 * uploaden van een foto uit public/img.
 *
 * Schrijven vraagt een token, en dat staat nergens in de code. Na `sanity
 * login` staat er een in ~/.config/sanity/config.json, of je maakt er een op
 * sanity.io/manage. Geef hem mee als SANITY_AUTH_TOKEN.
 */
import { createReadStream, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

export const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? 'z4gex0g7';
export const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';
const token = process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_WRITE_TOKEN ?? '';

if (!token) {
  console.error(
    'SANITY_AUTH_TOKEN ontbreekt. Een token met schrijfrechten staat in ~/.config/sanity/config.json of maak er een op sanity.io/manage.',
  );
  process.exit(1);
}

export const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2025-02-19',
  useCdn: false,
});

const publicDir = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '../../public');

const geupload = new Map<string, string>();

/**
 * Uploadt een bestand uit public/ en geeft de asset-id terug. Sanity ontdubbelt
 * op de inhoud, dus hetzelfde bestand twee keer uploaden levert dezelfde id op.
 */
export async function upload(bestand: string): Promise<string | null> {
  const bekend = geupload.get(bestand);
  if (bekend) return bekend;

  const absoluut = path.join(publicDir, bestand.replace(/^\//, ''));
  if (!existsSync(absoluut)) {
    console.warn(`  overgeslagen, bestaat niet: ${bestand}`);
    return null;
  }
  const asset = await client.assets.upload('image', createReadStream(absoluut), {
    filename: path.basename(absoluut),
  });
  geupload.set(bestand, asset._id);
  console.log(`  ${bestand} -> ${asset._id}`);
  return asset._id;
}

export const beeldVeld = (assetId: string) => ({
  _type: 'image',
  asset: { _type: 'reference', _ref: assetId },
});

/** Een foto die als adres in public/ staat, als beeldveld voor Sanity. */
export async function beeld(foto: unknown) {
  if (typeof foto !== 'string') return undefined;
  const assetId = await upload(foto);
  return assetId ? beeldVeld(assetId) : undefined;
}
