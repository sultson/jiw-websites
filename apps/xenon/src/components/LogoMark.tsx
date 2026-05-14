type LogoMarkProps = {
  variant?: 'compact' | 'full';
  className?: string;
  withScan?: boolean;
};

export default function LogoMark({
  variant = 'compact',
  className = '',
  withScan = false,
}: LogoMarkProps) {
  const src = variant === 'compact'
    ? '/logo/xenon-mark-white.png'
    : '/logo/xenon-full-white.png';
  const alt = variant === 'compact' ? 'Xenon Security' : 'Xenon Security · Advanced Dutch Protection';

  if (variant === 'full') {
    return (
      <img
        src={src}
        alt={alt}
        draggable={false}
        className={`block w-auto select-none ${className}`}
      />
    );
  }

  return (
    <span className={`relative inline-block overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="block w-full h-auto select-none"
      />
      {withScan && <span className="logo-scan-line" aria-hidden="true" />}
    </span>
  );
}
