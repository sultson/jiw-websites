import { clamp } from '../meta';
import type { RichBlock } from './types';

/**
 * Reading rich text rather than rendering it: the words inside an article, for
 * a card, a search result or a link preview.
 *
 * Its own module because both the normaliser and the bundled defaults need it,
 * and they cannot import each other.
 */

/** The words in one block, marks and all, as a single line. */
function blockText(block: RichBlock): string {
  if (block._type !== 'block') return '';
  const children = (block as { children?: unknown }).children;
  if (!Array.isArray(children)) return '';
  return children
    .map((child) =>
      typeof (child as { text?: unknown })?.text === 'string' ? (child as { text: string }).text : '',
    )
    .join('')
    .trim();
}

/** Everything a post says, as plain text. */
export const plainText = (blocks: RichBlock[]): string =>
  blocks.map(blockText).filter(Boolean).join(' ');

/**
 * What a post says in one paragraph. The lead the client wrote, or the opening
 * of the article when they wrote none, so a card always says something and
 * never says it twice on the page it leads to.
 */
export const samenvatten = (intro: string, body: RichBlock[]): string =>
  intro || clamp(plainText(body), 180);

/**
 * A plain-text post as rich text. Posts written before the editor existed hold
 * one text field with blank lines between paragraphs; this is what makes them
 * render through the same path as everything written since.
 */
export function blocksFromText(tekst: string): RichBlock[] {
  return tekst
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => ({
      _type: 'block',
      _key: `tekst-${index}`,
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: `tekst-${index}-0`, text: paragraph, marks: [] }],
    }));
}
