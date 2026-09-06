import type { ReactNode } from 'react';
import { lang } from '../content';
import { privacyPerTaal, type PrivacyBlok } from '../content/privacy';

/**
 * The privacy statement, as a page of its own, linked from the foot of every
 * page. One column at reading width: this is a document, not a section of the
 * museum, and it is set as one.
 */

/** `**vet**` and `[woord](adres)`, which is everything this document needs. */
const OPMAAK = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;

function opmaak(regel: string, sleutel: string): ReactNode[] {
  const uit: ReactNode[] = [];
  let laatste = 0;

  for (const match of regel.matchAll(OPMAAK)) {
    const index = match.index ?? 0;
    if (index > laatste) uit.push(regel.slice(laatste, index));

    const [heel, vet, label, href] = match;
    uit.push(
      vet ? (
        <strong key={`${sleutel}-${index}`} className="font-medium text-bone">
          {vet}
        </strong>
      ) : (
        <a
          key={`${sleutel}-${index}`}
          href={href}
          // Everything linked from here leaves the museum: an inbox, or the
          // supervisory authority. Both open beside the page, not over it.
          {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
          className="border-b border-red text-bone transition-colors hover:text-red-soft"
        >
          {label}
        </a>
      ),
    );
    laatste = index + heel.length;
  }

  if (laatste < regel.length) uit.push(regel.slice(laatste));
  return uit;
}

/** A paragraph, keeping the single line breaks it was written with. */
function Tekst({ tekst, sleutel }: { tekst: string; sleutel: string }) {
  const regels = tekst.split('\n');
  return (
    <p className="mt-5 first:mt-0">
      {regels.map((regel, i) => (
        <span key={`${sleutel}-${i}`}>
          {opmaak(regel, `${sleutel}-${i}`)}
          {i < regels.length - 1 && <br />}
        </span>
      ))}
    </p>
  );
}

function Blok({ blok, sleutel }: { blok: PrivacyBlok; sleutel: string }) {
  if (blok.soort === 'lijst') {
    return (
      <ul className="mt-5 list-disc space-y-2 pl-5 marker:text-red-soft">
        {blok.items.map((item, i) => (
          <li key={`${sleutel}-${i}`} className="pl-1">
            {opmaak(item, `${sleutel}-${i}`)}
          </li>
        ))}
      </ul>
    );
  }
  return <Tekst tekst={blok.tekst} sleutel={sleutel} />;
}

export default function Privacy() {
  const t = privacyPerTaal[lang];

  return (
    <main className="pt-[4.5rem] md:pt-20">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <article className="max-w-[46rem] py-14 md:py-20">
          <h1 className="display text-4xl md:text-6xl">{t.titel}</h1>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted">{t.bijgewerkt}</p>

          <div className="mt-8 text-[1.02rem] leading-[1.8] text-bone">
            <p>{t.intro}</p>

            {t.secties.map((sectie) => (
              <section key={sectie.kop} className="mt-12">
                <h2 className="display text-2xl md:text-3xl">{sectie.kop}</h2>
                <div className="mt-5">
                  {sectie.blokken.map((blok, i) => (
                    <Blok key={`${sectie.kop}-${i}`} blok={blok} sleutel={`${sectie.kop}-${i}`} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* The English page says which version counts. The Dutch one is that
              version, so it says nothing. */}
          {t.noot && (
            <p className="mt-14 border-t border-hair pt-6 text-sm text-muted">{t.noot}</p>
          )}
        </article>
      </div>
    </main>
  );
}
