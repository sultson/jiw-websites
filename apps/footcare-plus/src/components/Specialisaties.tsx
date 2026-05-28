import { Activity, Bone, HeartPulse, Waves } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function Specialisaties({ t }: Props) {
  const items = [
    {
      icon: Activity,
      title: t('specs.item1.title'),
      body:  t('specs.item1.body'),
    },
    {
      icon: Bone,
      title: t('specs.item2.title'),
      body:  t('specs.item2.body'),
    },
    {
      icon: HeartPulse,
      title: t('specs.item3.title'),
      body:  t('specs.item3.body'),
    },
    {
      icon: Waves,
      title: t('specs.item4.title'),
      body:  t('specs.item4.body'),
    },
  ];

  return (
    <section id="specialisaties" className="py-20 md:py-28 bg-sand-soft/60">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl">
          <span className="kicker">{t('specs.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.08]">
            {t('specs.title')}
          </h2>
          <p className="mt-5 text-ink/75 leading-relaxed">{t('specs.intro')}</p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {items.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="card p-6 md:p-7 flex flex-col h-full"
            >
              <div className="w-11 h-11 rounded-full bg-sand flex items-center justify-center text-teal mb-5">
                <Icon size={20} />
              </div>
              <h3 className="font-serif text-xl text-ink leading-snug">{title}</h3>
              <p className="mt-3 text-sm text-ink/70 leading-relaxed">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
