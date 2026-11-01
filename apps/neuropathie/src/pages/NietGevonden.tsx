import { ArrowLeft } from 'lucide-react';
import { SITE } from '../lib/site';

export default function NietGevonden() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-canvas px-5 text-center">
      <span className="kicker">Pagina niet gevonden</span>
      <h1 className="mt-5 display-lg text-ink">Deze pagina bestaat niet</h1>
      <p className="mt-5 text-[17px] leading-relaxed text-ink-soft max-w-md">
        Misschien is de link verouderd. Op de voorpagina staat alles over voetreflexologie bij
        neuropathie, voor cliënten en voor therapeuten.
      </p>
      <a href="/" className="btn-terra mt-8">
        <ArrowLeft size={16} strokeWidth={2.5} />
        Naar de voorpagina
      </a>
      <a
        href={SITE.phoneHref}
        className="mt-5 text-[15px] font-bold text-terra hover:text-terra-deep transition-colors tnum"
      >
        {SITE.phoneDisplay}
      </a>
    </div>
  );
}
