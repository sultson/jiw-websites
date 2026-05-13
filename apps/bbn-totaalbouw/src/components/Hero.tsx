import { Phone, ArrowRight, Star } from 'lucide-react';
import { site } from '../data/site';

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-bbn-ink pt-28 pb-20 sm:pt-32 sm:pb-28 grain"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 80% 20%, rgba(220,31,38,0.35), transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(220,31,38,0.18), transparent 50%)',
        }}
      />
      <div className="absolute -left-20 top-1/3 -z-10 h-72 w-72 rotate-12 diag-stripe opacity-10" />
      <div className="absolute -right-20 bottom-0 -z-10 h-56 w-56 -rotate-12 diag-stripe opacity-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-bbn-red/40 bg-bbn-red/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-bbn-red">
              <span className="h-2 w-2 rounded-full bg-bbn-red animate-pulse" />
              Direct beschikbaar · Rotterdam +100 km
            </div>

            <h1 className="headline text-5xl text-white sm:text-7xl lg:text-8xl">
              Strak werk.
              <br />
              <span className="text-bbn-red">Snelle service.</span>
              <br />
              Geen gedoe.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-zinc-300 sm:text-xl">
              Stucwerk, schilderwerk en renovaties in Rotterdam en omgeving. Van kleine klus tot
              complete nieuwbouw.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#offerte"
                className="inline-flex items-center gap-2 rounded-md bg-bbn-red px-6 py-3.5 text-base font-bold uppercase tracking-wide text-white shadow-lg shadow-bbn-red/30 hover:bg-bbn-red-dark transition"
              >
                Offerte aanvragen
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={`tel:${site.phoneRaw}`}
                className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-6 py-3.5 text-base font-bold uppercase tracking-wide text-white hover:bg-white/10 transition"
              >
                <Phone className="h-4 w-4" />
                {site.phone}
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-bbn-red text-bbn-red" />
                  ))}
                </div>
                <span className="font-semibold text-white">{site.trustooRating} / 10</span>
                <span>· {site.trustooReviewCount} reviews op Trustoo</span>
              </div>
              <span className="hidden h-4 w-px bg-white/20 sm:block" />
              <span>VCA · NOA · Vlok Erkend</span>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="relative mx-auto aspect-square max-w-md">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-bbn-red/40 via-bbn-red/10 to-transparent blur-2xl" />
              <div className="relative flex h-full w-full items-center justify-center rounded-2xl border border-bbn-line bg-bbn-ash p-8 shadow-2xl">
                <img src="/logo.png" alt="BBN Totaalbouw logo" className="w-full max-w-sm" />
              </div>
              <div className="absolute -bottom-5 -left-5 rounded-xl border border-bbn-line bg-bbn-ink px-4 py-3 shadow-xl">
                <p className="text-2xl font-black text-bbn-red">{site.yearsExperience} jaar</p>
                <p className="text-xs uppercase tracking-wider text-zinc-400">ervaring</p>
              </div>
              <div className="absolute -top-5 -right-5 rounded-xl border border-bbn-line bg-bbn-ink px-4 py-3 shadow-xl">
                <p className="text-2xl font-black text-white">{site.teamSize}</p>
                <p className="text-xs uppercase tracking-wider text-zinc-400">vakmensen</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
