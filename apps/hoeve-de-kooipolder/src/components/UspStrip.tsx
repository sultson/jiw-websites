import { CreditCard, HeartHandshake, Home, Trees } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function UspStrip({ t }: Props) {
  const items = [
    { icon: Trees, title: t('usp.1t'), sub: t('usp.1s') },
    { icon: HeartHandshake, title: t('usp.2t'), sub: t('usp.2s') },
    { icon: Home, title: t('usp.3t'), sub: t('usp.3s') },
    { icon: CreditCard, title: t('usp.4t'), sub: t('usp.4s') },
  ];

  return (
    <section className="border-b border-ink/5 bg-cream">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 md:gap-8">
          {items.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex flex-col items-start gap-3">
              <span className="w-10 h-10 rounded-full bg-lilac-wash flex items-center justify-center text-lilac-deep">
                <Icon size={18} />
              </span>
              <div>
                <p className="text-sm font-medium text-ink leading-snug">{title}</p>
                <p className="mt-1 text-sm text-ink-soft/80 leading-snug">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
