import { ArrowRight } from 'lucide-react';
import { Knop, Sectie } from '../ui';

export default function NietGevonden() {
  return (
    <Sectie>
      <div className="max-w-xl">
        <h1 className="text-3xl md:text-4xl">Deze pagina bestaat niet</h1>
        <p className="mt-4 text-lg leading-relaxed text-groen/75">
          Misschien is de link verouderd. De agenda, de berichten en de contactgegevens staan er
          gewoon nog.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Knop href="/">
            Naar de voorpagina <ArrowRight className="h-4 w-4" />
          </Knop>
          <Knop href="/agenda" soort="rand">
            Bekijk de agenda
          </Knop>
        </div>
      </div>
    </Sectie>
  );
}
