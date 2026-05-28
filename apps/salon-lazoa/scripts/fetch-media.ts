/**
 * Download remote IG media into ./scraped-media/ with semantic file names.
 * Pass an array of { name, url } below.
 */
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve(process.cwd(), 'scraped-media');

type Item = { name: string; url: string };

const items: Item[] = JSON.parse(process.argv[2] ?? '[]');

async function one(item: Item) {
  const res = await fetch(item.url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0 Safari/537.36',
      Accept: 'image/webp,image/avif,image/*,*/*;q=0.8',
      Referer: 'https://www.instagram.com/',
    },
  });
  if (!res.ok) {
    console.error(`  ! ${item.name}: HTTP ${res.status}`);
    return;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const ext = '.jpg';
  await writeFile(path.join(OUT, item.name + ext), buf);
  console.log(`  ✓ ${item.name}${ext}  (${(buf.length / 1024).toFixed(0)} KB)`);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  console.log(`Downloading ${items.length} files to ${OUT}\n`);
  for (const item of items) {
    try {
      await one(item);
    } catch (err) {
      console.error(`  ! ${item.name}: ${(err as Error).message}`);
    }
  }
  console.log('\nDone.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
