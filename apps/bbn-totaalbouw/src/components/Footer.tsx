import { Phone, Mail, MapPin } from 'lucide-react';
import { site } from '../data/site';

export default function Footer() {
  return (
    <footer className="border-t border-bbn-line bg-bbn-ink py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <img src="/logo.png" alt="BBN Totaalbouw" className="h-14 w-auto" />
            <p className="mt-4 max-w-sm text-sm text-zinc-400">
              Stucwerk, schilderwerk en renovaties uit Rotterdam. Strak werk. Snelle service.
              Geen gedoe.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {site.certifications.map(c => (
                <span
                  key={c}
                  className="rounded-md border border-bbn-line bg-bbn-ash px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-300"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <p className="text-xs font-bold uppercase tracking-wider text-bbn-red">Contact</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={`tel:${site.phoneRaw}`} className="flex items-center gap-2 text-zinc-200 hover:text-bbn-red">
                  <Phone className="h-4 w-4" /> {site.phone}
                </a>
              </li>
              <li>
                <a href={`tel:${site.phoneOfficeRaw}`} className="flex items-center gap-2 text-zinc-200 hover:text-bbn-red">
                  <Phone className="h-4 w-4" /> {site.phoneOffice} (kantoor)
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-2 text-zinc-200 hover:text-bbn-red">
                  <Mail className="h-4 w-4" /> {site.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-zinc-200">
                <MapPin className="h-4 w-4" /> {site.address}
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs font-bold uppercase tracking-wider text-bbn-red">Openingstijden</p>
            <p className="mt-4 text-sm text-zinc-200">{site.hours}</p>
            <p className="mt-1 text-sm text-zinc-500">Zondag gesloten</p>

            <p className="mt-6 text-xs font-bold uppercase tracking-wider text-bbn-red">
              Werkgebied
            </p>
            <p className="mt-3 text-sm text-zinc-200">{site.area}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-bbn-line pt-6 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} BBN Totaalbouw. Alle rechten voorbehouden.</p>
          <a
            href="https://jouwidealewebsite.nl"
            target="_blank"
            rel="noreferrer"
            className="hover:text-bbn-red"
          >
            Website door Jouw Ideale Website
          </a>
        </div>
      </div>
    </footer>
  );
}
