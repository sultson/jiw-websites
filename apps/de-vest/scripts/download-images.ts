/**
 * Download curated Instagram images to data/raw-images/.
 * Source: data/instagram.json
 * Output: data/raw-images/<shortCode>-<index>.jpg
 *
 * The curated list reflects portfolio-quality posts only:
 * - skips hiring / Christmas / personal posts
 * - favors behang, 3D acoustic, lacquered doors, apartment finishings
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'data');
const RAW = path.join(ROOT, 'raw-images');

type Picks = Record<string, number[]>;

const PICKS: Picks = {
  // Behang band (single distinctive close-up each)
  DVA2ahXCAyG: [0, 2],
  DVwGJUYiOLx: [0, 2],
  Cl8kRGPLpl7: [0],
  C7KRRbirmvw: [0, 2],
  // Werk / portfolio
  DXLpyTHCPLt: [0, 3],
  C42F3scixWN: [0, 2],
  Ctjt2fTL4vR: [0, 2],
  Cn1fQYDLZwk: [0],
  CmFH5qAL5vq: [0],
  C_ScNRuiTpg: [0, 3],
  C4QCETbr3Ua: [0],
  CKrmssFHNlN: [0, 4],
  CKoyL1NntgE: [0, 6],
  CKouPSmnj3V: [0, 5],
  Cl6Jncooc_w: [0, 2],
  'DM-W5g8CU42': [0],
  C2AZBAGCFaW: [0],
  DWCPSEkiCvx: [0],
  CUcdKg8oVE2: [0],
  CMcnZGhrK2E: [0],
  // Hero candidates
  DV_qLEtCL0x: [0],
};

const RECONCILE_KEYS: Record<string, string> = {
  Cl6Jncooc_w: 'Cl6Jncooc-w',
};

type IGPost = {
  id: string;
  shortCode: string;
  type: string;
  caption: string;
  hashtags: string[];
  timestamp: string;
  displayUrl: string;
  images?: string[];
  dimensionsHeight?: number;
  dimensionsWidth?: number;
};

async function main() {
  await mkdir(RAW, { recursive: true });
  const raw = await readFile(path.join(ROOT, 'instagram.json'), 'utf-8');
  const posts: IGPost[] = JSON.parse(raw);
  const bySc = new Map(posts.map(p => [p.shortCode, p]));

  let okCount = 0;
  let skipCount = 0;

  for (const [pickKey, indexes] of Object.entries(PICKS)) {
    const sc = RECONCILE_KEYS[pickKey] ?? pickKey;
    const post = bySc.get(sc);
    if (!post) {
      console.warn(`! ${pickKey}: not in dataset`);
      skipCount += indexes.length;
      continue;
    }
    const urls = (post.images && post.images.length > 0) ? post.images : [post.displayUrl];
    for (const idx of indexes) {
      const url = urls[idx];
      if (!url) {
        console.warn(`! ${sc}#${idx}: out of range (have ${urls.length})`);
        skipCount += 1;
        continue;
      }
      const out = path.join(RAW, `${sc}-${idx}.jpg`);
      try {
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        await writeFile(out, buf);
        const kb = (buf.length / 1024).toFixed(0);
        console.log(`  ${sc}-${idx}.jpg  ${kb} KB`);
        okCount += 1;
      } catch (err) {
        console.warn(`! ${sc}#${idx}: ${(err as Error).message}`);
        skipCount += 1;
      }
    }
  }

  console.log(`\nDownloaded ${okCount}, failed ${skipCount}`);

  // Also write a curated metadata file used by the build.
  const meta = Object.entries(PICKS).map(([pickKey, indexes]) => {
    const sc = RECONCILE_KEYS[pickKey] ?? pickKey;
    const post = bySc.get(sc);
    return {
      shortCode: sc,
      indexes,
      caption: post?.caption ?? '',
      hashtags: post?.hashtags ?? [],
      timestamp: post?.timestamp ?? '',
      width: post?.dimensionsWidth,
      height: post?.dimensionsHeight,
    };
  });
  await writeFile(path.join(ROOT, 'curated.json'), JSON.stringify(meta, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
