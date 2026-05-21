import { useEffect, useRef } from 'react';

type Props = {
  src: string;
  poster: string;
  className?: string;
};

export default function LazyVideo({ src, poster, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            if (!v.src) v.src = src;
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { rootMargin: '200px', threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      playsInline
      loop
      preload="none"
      className={className}
    />
  );
}
