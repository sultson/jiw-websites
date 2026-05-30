type Props = { t: (k: string) => string };

export default function TopBar({ t }: Props) {
  return (
    <div className="bg-sumi text-shoji/85 text-[10.5px] uppercase tracking-[0.32em]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-2.5 flex items-center justify-center gap-3 text-center">
        <span className="block w-3 h-px bg-shoji/40" />
        <span>{t('topbar.line')}</span>
        <span className="block w-3 h-px bg-shoji/40" />
      </div>
    </div>
  );
}
