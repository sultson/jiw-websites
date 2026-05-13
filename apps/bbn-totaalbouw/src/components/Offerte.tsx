import { useState, type FormEvent } from 'react';
import { Send, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { site } from '../data/site';

type Status = 'idle' | 'sent';

export default function Offerte() {
  const [status, setStatus] = useState<Status>('idle');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') ?? '').trim();
    const phone = String(fd.get('phone') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();
    const postcode = String(fd.get('postcode') ?? '').trim();
    const service = String(fd.get('service') ?? '').trim();
    const message = String(fd.get('message') ?? '').trim();

    const subject = `Offerteaanvraag ${service || 'BBN Totaalbouw'}`;
    const body = [
      `Naam: ${name}`,
      `Telefoon: ${phone}`,
      `E-mail: ${email}`,
      `Postcode: ${postcode}`,
      `Dienst: ${service}`,
      '',
      'Bericht:',
      message,
    ].join('\n');

    const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setStatus('sent');
  };

  return (
    <section id="offerte" className="relative overflow-hidden bg-bbn-ink py-20 sm:py-28">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 20% 30%, rgba(220,31,38,0.12), transparent 55%), radial-gradient(ellipse at 90% 80%, rgba(220,31,38,0.07), transparent 55%)',
        }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-bbn-red">
              Offerte aanvragen
            </p>
            <h2 className="headline text-4xl text-zinc-900 sm:text-5xl lg:text-6xl">
              Klus in gedachten?
              <br />
              <span className="text-bbn-red">Stuur 'm door.</span>
            </h2>
            <p className="mt-5 text-lg text-zinc-600">
              Vul het formulier in of bel direct. {site.ownerName} reageert binnen 24 uur.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href={`tel:${site.phoneRaw}`}
                className="flex items-center gap-3 rounded-lg border border-bbn-line bg-bbn-ash p-4 shadow-sm shadow-zinc-900/5 hover:border-bbn-red/60 transition"
              >
                <Phone className="h-5 w-5 text-bbn-red" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500">Bel ons</p>
                  <p className="text-lg font-bold text-zinc-900">{site.phone}</p>
                </div>
              </a>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-3 rounded-lg border border-bbn-line bg-bbn-ash p-4 shadow-sm shadow-zinc-900/5 hover:border-bbn-red/60 transition"
              >
                <Mail className="h-5 w-5 text-bbn-red" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500">E-mail</p>
                  <p className="text-base font-bold text-zinc-900">{site.email}</p>
                </div>
              </a>
              <div className="flex items-center gap-3 rounded-lg border border-bbn-line bg-bbn-ash p-4 shadow-sm shadow-zinc-900/5">
                <MapPin className="h-5 w-5 text-bbn-red" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500">Werkgebied</p>
                  <p className="text-base font-bold text-zinc-900">{site.area}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {status === 'sent' ? (
              <div className="flex h-full flex-col items-start justify-center rounded-2xl border border-bbn-red/40 bg-bbn-ash p-10 shadow-sm shadow-zinc-900/5">
                <CheckCircle2 className="h-12 w-12 text-bbn-red" />
                <h3 className="mt-4 text-3xl font-bold uppercase tracking-wide text-zinc-900">
                  Bedankt.
                </h3>
                <p className="mt-3 text-base text-zinc-600">
                  Je mailprogramma is geopend met je aanvraag. Verstuur de mail en {site.ownerName}{' '}
                  neemt binnen 24 uur contact op.
                </p>
                <p className="mt-6 text-sm text-zinc-500">
                  Werkt het niet? Bel direct:{' '}
                  <a href={`tel:${site.phoneRaw}`} className="font-bold text-bbn-red">
                    {site.phone}
                  </a>
                </p>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="rounded-2xl border border-bbn-line bg-bbn-ash p-6 shadow-sm shadow-zinc-900/5 sm:p-8"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field name="name" label="Naam" required />
                  <Field name="phone" label="Telefoon" type="tel" required />
                  <Field name="email" label="E-mail" type="email" required />
                  <Field name="postcode" label="Postcode" required />
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Dienst
                  </label>
                  <select
                    name="service"
                    required
                    defaultValue=""
                    className="mt-2 w-full rounded-md border border-bbn-line bg-bbn-ink px-4 py-3 text-zinc-900 focus:border-bbn-red focus:outline-none"
                  >
                    <option value="" disabled>
                      Kies een dienst
                    </option>
                    <option>Stucwerk</option>
                    <option>Schilderwerk</option>
                    <option>Renovatie</option>
                    <option>Badkamerrenovatie</option>
                    <option>Behangen</option>
                    <option>Spuitwerk / Spachtelputz</option>
                    <option>Vloer egaliseren</option>
                    <option>Nieuwbouw</option>
                    <option>Anders</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Wat moet er gebeuren?
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Bijv. 80m² stuken in nieuwbouwhuis, oplevering eind van de maand."
                    className="mt-2 w-full rounded-md border border-bbn-line bg-bbn-ink px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-bbn-red focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-bbn-red px-6 py-4 text-base font-bold uppercase tracking-wide text-white shadow-lg shadow-bbn-red/30 hover:bg-bbn-red-dark transition sm:w-auto"
                >
                  Verstuur aanvraag
                  <Send className="h-4 w-4" />
                </button>
                <p className="mt-3 text-xs text-zinc-500">
                  Je mailprogramma opent met de aanvraag. Voorkeur voor bellen?{' '}
                  <a href={`tel:${site.phoneRaw}`} className="font-semibold text-bbn-red">
                    {site.phone}
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type = 'text',
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600">
        {label}
        {required && <span className="text-bbn-red"> *</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-md border border-bbn-line bg-bbn-ink px-4 py-3 text-zinc-900 focus:border-bbn-red focus:outline-none"
      />
    </div>
  );
}
