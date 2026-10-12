import {useEffect} from 'react';
import {ArrowLeft, Download, FileText, ShieldCheck} from 'lucide-react';
import {Bloem} from './bloem';
import {ga} from './specialisaties';
import {
  GEGEVENS,
  HOOFDSTUKKEN,
  INLEIDING,
  PRAKTIJK,
  SLOT,
  TABEL,
  VERSIE,
  VINKJES,
  VINKJES_SLOT,
} from './verklaring-tekst';

/* De privacyverklaring voor patienten. Dit is iets anders dan /privacy: die
   gaat over de website (geen cookies, geen derden, het contactformulier) en
   deze over het patientendossier. Ze vervangen elkaar niet, en daarom staat op
   allebei de paginas een verwijzing naar de ander.

   Opzet zoals Marjon vroeg, en zoals Praktijk de Brink het heeft: een korte
   pagina met waar het over gaat, en daaronder de volledige verklaring, met het
   document als download. De tekst staat in verklaring-tekst.js zodat de pagina
   en het pdf-bestand hetzelfde document zijn. */

export const VERKLARING_PAD = '/privacyverklaring';
export const VERKLARING_PDF = '/privacyverklaring-bewust-gezond-in-je-mond.pdf';
export const VINKJES_PDF = '/intakeformulier-vinkjes-bewust-gezond-in-je-mond.pdf';

function Lijst({items}: {items: string[]}) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((r) => (
        <li key={r} className="flex gap-3 leading-relaxed text-inkt/75">
          <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-olijf" />
          <span>{r}</span>
        </li>
      ))}
    </ul>
  );
}

function Gegevens() {
  return (
    <dl className="mt-5 overflow-hidden rounded-2xl ring-1 ring-zand-diep">
      {GEGEVENS.map(([k, v], i) => (
        <div
          key={k}
          className={`flex flex-col gap-0.5 px-5 py-3 sm:flex-row sm:gap-4 ${i % 2 ? 'bg-white' : 'bg-zand/40'}`}
        >
          <dt className="shrink-0 text-sm font-semibold text-inkt/60 sm:w-56">{k}</dt>
          <dd className="text-inkt/85">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Tabel() {
  return (
    <div className="mt-5 grid gap-px overflow-hidden rounded-2xl bg-zand-diep sm:grid-cols-2">
      {[TABEL.links, TABEL.rechts].map((kol) => (
        <div key={kol.kop} className="bg-white p-5">
          <p className="titel text-xl text-inkt">{kol.kop}</p>
          <ul className="mt-3 space-y-2">
            {kol.rijen.map((r) => (
              <li key={r} className="flex gap-3 leading-relaxed text-inkt/75">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-olijf" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function VerklaringPagina() {
  useEffect(() => {
    const titel = document.title;
    const canoniek = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const vorige = canoniek?.href;
    const omschrijving = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const vorigeOmschrijving = omschrijving?.content;

    document.title = `Privacyverklaring | ${PRAKTIJK}`;
    if (canoniek) canoniek.href = `https://marjon.jouwidealewebsite.nl${VERKLARING_PAD}`;
    if (omschrijving) {
      omschrijving.content =
        'Wat ik als mondhygienist van je vastleg, waarom, wie er verder bij kan en hoe lang ik het bewaar. De volledige privacyverklaring, ook als document om te downloaden.';
    }

    return () => {
      document.title = titel;
      if (canoniek && vorige) canoniek.href = vorige;
      if (omschrijving && vorigeOmschrijving) omschrijving.content = vorigeOmschrijving;
    };
  }, []);

  return (
    <main>
      <section className="relative overflow-hidden bg-zand pt-28 pb-14 sm:pt-32">
        <Bloem className="bloem-draait pointer-events-none absolute -right-24 top-8 h-[22rem] w-[22rem] text-olijf opacity-[0.13]" />
        <div className="relative mx-auto max-w-3xl px-5">
          <a
            href="/"
            onClick={(e) => ga(e, '/')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-inkt/70 transition hover:text-petrol"
          >
            <ArrowLeft className="h-4 w-4" /> Terug naar de voorpagina
          </a>
          <p className="kicker mt-6 text-olijf">Voor patienten</p>
          <h1 className="titel mt-2 text-4xl leading-tight text-inkt sm:text-5xl">Privacyverklaring</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-inkt/80">{INLEIDING}</p>
        </div>
      </section>

      <article id="inhoud" tabIndex={-1} className="mx-auto max-w-3xl px-5 py-16 outline-none">
        {/* het korte stuk bovenaan, zoals bij Praktijk de Brink: eerst in drie
            regels waar het op neerkomt, dan pas de volledige tekst */}
        <div className="flex items-start gap-4 rounded-2xl bg-olijf/10 p-6">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-olijf-diep" />
          <div className="leading-relaxed text-inkt/80">
            <p>
              Kort gezegd: ik leg alleen vast wat ik nodig heb om je te kunnen behandelen. Ik ben de enige die bij je
              dossier kan. Ik declareer niet bij je verzekeraar, verstuur geen nieuwsbrieven en verkoop niets door. Met
              je tandarts wissel ik alleen iets uit als jij daar toestemming voor geeft.
            </p>
            <p className="mt-3">
              Ik behandel je in een ruimte die ik huur bij Mondzorg Schagen. Je bent patient van mij en niet van die
              praktijk, en zij kunnen niet bij je dossier.
            </p>
            <p className="mt-3">Hieronder staat het volledig. Versie van {VERSIE}.</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={VERKLARING_PDF}
            download
            className="inline-flex items-center gap-2 rounded-full bg-petrol px-6 py-3 font-semibold text-white transition hover:bg-petrol-diep"
          >
            <Download className="h-5 w-5" /> Download de verklaring
          </a>
          <a
            href="/privacy"
            onClick={(e) => ga(e, '/privacy')}
            className="inline-flex items-center gap-2 rounded-full border border-inkt/25 px-6 py-3 font-semibold text-inkt transition hover:border-petrol hover:text-petrol"
          >
            <FileText className="h-5 w-5" /> Over deze website
          </a>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-inkt/60">
          De pagina over deze website gaat over iets anders: dat de site geen cookies zet en geen profiel van bezoekers
          maakt. Deze verklaring gaat over je dossier als patient.
        </p>

        {HOOFDSTUKKEN.map((h) => (
          <section key={h.nr} className="mt-12">
            <h2 className="titel text-2xl text-inkt sm:text-3xl">
              {h.nr}. {h.kop}
            </h2>
            {h.blokken.map((b, i) => {
              if (b.t === 'gegevens') return <Gegevens key={i} />;
              if (b.t === 'tabel') return <Tabel key={i} />;
              if (b.t === 'lijst') return <Lijst key={i} items={b.v as string[]} />;
              if (b.t === 'kopje')
                return (
                  <h3 key={i} className="mt-7 text-lg font-semibold text-inkt">
                    {b.v as string}
                  </h3>
                );
              return (
                <p key={i} className="mt-3 leading-relaxed text-inkt/75">
                  {b.v as string}
                </p>
              );
            })}
          </section>
        ))}

        <p className="mt-12 border-t border-zand-diep pt-6 text-sm leading-relaxed text-inkt/60">{SLOT}</p>

        {/* De vinkjes staan hier ook op de pagina en niet alleen in het losse
            document. Een patient die wil weten waar hij ja tegen zei op het
            intakeformulier, kan dat hier teruglezen zonder iets te downloaden. */}
        <section className="mt-12 rounded-2xl bg-zand/50 p-6 sm:p-8">
          <h2 className="titel text-2xl text-inkt sm:text-3xl">Wat je op het intakeformulier tekent</h2>
          <p className="mt-3 leading-relaxed text-inkt/75">
            Bij je eerste afspraak krijg je deze verklaring en een intakeformulier. Daarop staan drie vinkjes. Het
            eerste is een bevestiging dat je deze verklaring gehad hebt. De andere twee zijn toestemming, en die zijn
            vrij: je wordt ook zonder gewoon behandeld.
          </p>
          <ol className="mt-5 space-y-4">
            {VINKJES.map((v, i) => (
              <li key={i} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-olijf/60"
                />
                <div>
                  <p className="leading-relaxed text-inkt/85">
                    {v.tekst}
                    {v.regel ? <span className="ml-2 text-inkt/35">............................</span> : null}
                  </p>
                  {v.onder ? <p className="mt-1 text-sm leading-relaxed text-inkt/55">{v.onder}</p> : null}
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm leading-relaxed text-inkt/55">{VINKJES_SLOT}</p>
          <a
            href={VINKJES_PDF}
            download
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-inkt/25 px-6 py-3 font-semibold text-inkt transition hover:border-petrol hover:text-petrol"
          >
            <Download className="h-5 w-5" /> Download deze vinkjes los
          </a>
        </section>
      </article>
    </main>
  );
}
