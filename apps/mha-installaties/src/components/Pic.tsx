import { imageWidths } from '../image-manifest';

type Props = {
  /** Base path without extension, e.g. "/werk/cv-ketel". Must exist in image-manifest.ts. */
  src: string;
  alt: string;
  /** Intrinsic dimensions used to reserve layout space and prevent CLS. */
  width: number;
  height: number;
  /** Responsive sizes attribute. */
  sizes: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'sync' | 'async';
  draggable?: boolean;
};

export default function Pic({
  src,
  alt,
  width,
  height,
  sizes,
  className,
  loading,
  fetchPriority,
  decoding,
  draggable,
}: Props) {
  const widths = imageWidths[src];
  if (!widths) {
    throw new Error(
      `Pic: no manifest entry for "${src}". Run "pnpm optimize-images" or check the path.`,
    );
  }
  const avif = widths.map((w) => `${src}-${w}.avif ${w}w`).join(', ');
  const webp = widths.map((w) => `${src}-${w}.webp ${w}w`).join(', ');
  const fallback = `${src}-${widths[widths.length - 1]}.webp`;

  return (
    <picture>
      <source type="image/avif" srcSet={avif} sizes={sizes} />
      <source type="image/webp" srcSet={webp} sizes={sizes} />
      <img
        src={fallback}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={decoding ?? 'async'}
        draggable={draggable}
      />
    </picture>
  );
}
