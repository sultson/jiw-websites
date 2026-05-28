import { mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve(process.cwd(), 'scraped-media/raw');
await mkdir(OUT, { recursive: true });

// Curated photo URLs from the Facebook scrape (excluding the profile pic logo).
const urls: string[] = process.argv.slice(2);

async function download(url: string, file: string) {
  const target = path.join(OUT, file);
  try {
    await stat(target);
    console.log(`skip ${file}`);
    return;
  } catch {}
  const res = await fetch(url);
  if (!res.ok) {
    console.log(`fail ${file} ${res.status}`);
    return;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(target, buf);
  console.log(`ok   ${file} (${(buf.length / 1024).toFixed(0)}KB)`);
}

async function main() {
  let i = 1;
  const limit = 8;
  let inFlight = 0;
  const queue = [...urls];
  await new Promise<void>((resolve) => {
    const next = () => {
      while (inFlight < limit && queue.length > 0) {
        const url = queue.shift()!;
        const file = `nail-${String(i++).padStart(3, '0')}.jpg`;
        inFlight++;
        download(url, file).finally(() => {
          inFlight--;
          if (queue.length === 0 && inFlight === 0) resolve();
          else next();
        });
      }
    };
    next();
  });
  console.log('All downloads finished.');
}

main();
