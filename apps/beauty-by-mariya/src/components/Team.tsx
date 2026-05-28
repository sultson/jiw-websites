import { Instagram } from 'lucide-react';
import { team } from '../data/team';

type Props = { t: (k: string) => string };

export default function Team({ t }: Props) {
  return (
    <section id="team" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">{t('team.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('team.title')}</h2>
          <p className="mt-4 text-ink/60 text-sm max-w-md mx-auto">{t('team.sub')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {team.map(m => (
            <article key={m.id} className="group">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-blush mb-4 shadow-[0_8px_30px_-15px_rgba(45,26,34,0.3)]">
                <img
                  src={m.photo}
                  alt={`${m.name}, ${t(`${m.tKey}.role`)}`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <a
                  href={m.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Instagram van ${m.name}`}
                  className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-pearl/90 backdrop-blur-sm flex items-center justify-center text-ink hover:bg-pearl"
                >
                  <Instagram size={16} />
                </a>
              </div>
              <h3 className="font-serif text-xl md:text-2xl text-ink">{m.name}</h3>
              <p className={`text-[11px] uppercase tracking-[0.18em] mt-1 ${m.accent === 'rose' ? 'text-rose' : 'text-champagne'}`}>
                {t(`${m.tKey}.role`)}
              </p>
              <p className="mt-3 text-sm text-ink/65 leading-relaxed">{t(`${m.tKey}.bio`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
