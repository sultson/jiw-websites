import { Fragment, type ReactNode } from 'react';
import { berichten, imageRatio, imageUrl, isPreview, site } from './content';

/** *schuin* and **vet**, the only markup a textarea offers. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
      <em key={i}>{part.slice(1, -1)}</em>
    ) : (
      part
    ),
  );
}

/** A blank line is a new paragraph, a single Enter a line break. */
function Tekst({ children, className }: { children: string; className?: string }) {
  const alineas = children.split(/\n\s*\n/).map((a) => a.trim()).filter(Boolean);
  return (
    <>
      {alineas.map((alinea, i) => (
        <p key={i} className={className}>
          {alinea.split('\n').map((regel, j) => (
            <Fragment key={j}>
              {j > 0 && <br />}
              {inline(regel)}
            </Fragment>
          ))}
        </p>
      ))}
    </>
  );
}

const datum = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

export default function App() {
  const hero = imageUrl(site.heroFoto, 1600);

  return (
    <>
      {isPreview && (
        <div className="sticky top-0 z-10 bg-amber-300 px-4 py-2 text-center text-sm">
          Voorbeeld met niet-gepubliceerde wijzigingen
        </div>
      )}

      <header className="mx-auto max-w-4xl px-6 pt-20 pb-12">
        {site.titel && (
          <h1 className="text-5xl font-light tracking-tight sm:text-6xl">{site.titel}</h1>
        )}
        {site.intro && (
          <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-ink/75">
            <Tekst>{site.intro}</Tekst>
          </div>
        )}
      </header>

      {hero && (
        <div className="mx-auto max-w-5xl px-6">
          <img
            src={hero}
            alt=""
            className="h-auto w-full rounded-lg object-cover"
            style={{ aspectRatio: imageRatio(site.heroFoto) }}
          />
        </div>
      )}

      {(site.overTitel || site.overTekst) && (
        <section className="mx-auto max-w-4xl px-6 py-20">
          {site.overTitel && <h2 className="text-3xl font-light">{site.overTitel}</h2>}
          {site.overTekst && (
            <div className="mt-5 max-w-2xl space-y-4 leading-relaxed text-ink/80">
              <Tekst>{site.overTekst}</Tekst>
            </div>
          )}
        </section>
      )}

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <h2 className="text-3xl font-light">Berichten</h2>
        {berichten.length === 0 ? (
          <p className="mt-5 text-ink/60">Nog geen berichten.</p>
        ) : (
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {berichten.map((b) => {
              const foto = imageUrl(b.foto, 800);
              return (
                <article key={b._id} className="space-y-3">
                  {foto && (
                    <img
                      src={foto}
                      alt=""
                      loading="lazy"
                      className="h-auto w-full rounded-md object-cover"
                      style={{ aspectRatio: imageRatio(b.foto) }}
                    />
                  )}
                  {b.datum && <p className="text-sm text-ink/50">{datum(b.datum)}</p>}
                  {b.titel && <h3 className="text-xl">{b.titel}</h3>}
                  {b.tekst && (
                    <div className="space-y-3 text-ink/75">
                      <Tekst>{b.tekst}</Tekst>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {(site.contactEmail || site.contactTelefoon) && (
        <footer className="border-t border-ink/10">
          <div className="mx-auto flex max-w-4xl flex-wrap gap-x-8 gap-y-2 px-6 py-10 text-ink/70">
            {site.contactEmail && (
              <a className="text-accent underline" href={`mailto:${site.contactEmail}`}>
                {site.contactEmail}
              </a>
            )}
            {site.contactTelefoon && (
              <a className="text-accent underline" href={`tel:${site.contactTelefoon.replace(/\s/g, '')}`}>
                {site.contactTelefoon}
              </a>
            )}
          </div>
        </footer>
      )}
    </>
  );
}
