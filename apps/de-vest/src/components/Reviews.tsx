import { ArrowUpRight } from 'lucide-react';

type Props = { t: (key: string) => string };

const MATERIALS = ['Sigma', 'Sikkens', 'Trimetal', 'Caparol', 'Veveo'];

export default function Reviews({ t }: Props) {
  return (
    <section className="py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-y-14 gap-x-12">
        {/* Reviews */}
        <div className="lg:col-span-7">
          <span className="kicker">{t('reviews.kicker')}</span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.75rem] font-display leading-[1.08] mb-10 max-w-[18ch]">
            {t('reviews.title')}
          </h2>
          <div className="space-y-10">
            <Quote
              text={t('reviews.q1.text')}
              author={t('reviews.q1.author')}
              context={t('reviews.q1.context')}
              n="01"
            />
            <Quote
              text={t('reviews.q2.text')}
              author={t('reviews.q2.author')}
              context={t('reviews.q2.context')}
              n="02"
            />
          </div>
          <a
            href="https://www.google.com/maps/place/De+Vest+Schilderwerken/@51.4168643,5.4344771,17z/data=!4m6!3m5!1s0x47c6d98ef5047719:0xfd1501173e92bf99!8m2!3d51.4168643!4d5.437052!16s%2Fg%2F1tzgnfl1"
            target="_blank"
            rel="noreferrer noopener"
            className="btn-ghost mt-10"
          >
            {t('reviews.gmaps')}
            <ArrowUpRight size={14} aria-hidden />
          </a>
        </div>

        {/* Materialen */}
        <aside className="lg:col-span-5 lg:pl-8 lg:border-l border-ink/10 lg:pt-2">
          <span className="kicker">{t('materials.kicker')}</span>
          <h3 className="mt-4 text-2xl sm:text-3xl font-display leading-[1.1] mb-5">
            {t('materials.title')}
          </h3>
          <p className="text-base text-ink-soft leading-relaxed mb-7 max-w-[42ch]">
            {t('materials.body')}
          </p>
          <div className="hairline mb-5" />
          <ul className="grid grid-cols-3 gap-y-2 gap-x-4">
            {MATERIALS.map((m) => (
              <li
                key={m}
                className="font-display text-base text-ink tracking-tight"
                style={{ fontVariationSettings: '"opsz" 96, "SOFT" 0' }}
              >
                {m}
              </li>
            ))}
          </ul>
          <div className="hairline mt-5" />
        </aside>
      </div>
    </section>
  );
}

function Quote({ text, author, context, n }: { text: string; author: string; context: string; n: string }) {
  return (
    <blockquote className="grid grid-cols-[auto_1fr] gap-x-5">
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-orange-deep pt-2">№ {n}</span>
      <div>
        <p
          className="font-display text-2xl sm:text-3xl leading-[1.18] text-ink"
          style={{ fontVariationSettings: '"opsz" 96, "SOFT" 50' }}
        >
          “{text}”
        </p>
        <footer className="mt-3 flex items-center gap-3 text-sm">
          <span className="text-ink font-medium">{author}</span>
          <span className="text-ink-mute">{context}</span>
        </footer>
      </div>
    </blockquote>
  );
}
