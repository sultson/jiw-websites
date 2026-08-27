import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Mail, Menu, Phone, X } from 'lucide-react';
import { usePad } from '../router';
import { CONTACT, MENU } from '../navigatie';
import { MAIL, Schil, TEL, TEL_LINK } from '../ui';

/**
 * De balk bovenaan: het logo links, de zes rubrieken ernaast en rechts de enige
 * knop die op elke pagina evenveel waard is.
 *
 * De mock-up zet de zes rubrieken naast elkaar en houdt het daarbij. Wij hangen
 * er per rubriek een uitklapper onder, want achter die zes staan ruim zeventig
 * pagina's en een bezoeker hoort niet eerst op een tussenpagina te belanden om
 * te zien wat er verder is. Die uitklappers staan gewoon in het document en
 * worden met stijl verborgen: zonder javascript blijft elke link bereikbaar.
 */
export default function Nav() {
  const pad = usePad();
  const balk = useRef<HTMLElement>(null);

  /** Het schermvullende menu op een telefoon. */
  const [open, setOpen] = useState(false);
  /** De rubriek die op een aanraakscherm is aangetikt; daar bestaat zweven niet. */
  const [uitgeklapt, setUitgeklapt] = useState<string | null>(null);
  /** De rubriek die met Escape is weggeklapt, zolang de muis er nog boven hangt. */
  const [weggeklapt, setWeggeklapt] = useState<string | null>(null);

  const isHier = (rubriek: string) => pad === rubriek || pad.startsWith(`${rubriek}/`);

  // Van pagina wisselen sluit alles wat openstond; anders blijft het over de
  // nieuwe pagina heen liggen.
  useEffect(() => {
    setOpen(false);
    setUitgeklapt(null);
    setWeggeklapt(null);
  }, [pad]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Wie ergens anders drukt, is klaar met de uitklapper die hij aantikte.
  useEffect(() => {
    if (!uitgeklapt) return;
    const bijDruk = (gebeurtenis: PointerEvent) => {
      if (!balk.current?.contains(gebeurtenis.target as Node)) setUitgeklapt(null);
    };
    document.addEventListener('pointerdown', bijDruk);
    return () => document.removeEventListener('pointerdown', bijDruk);
  }, [uitgeklapt]);

  return (
    <>
      <a
        href="#inhoud"
        className="fixed left-4 top-4 z-[100] -translate-y-[200%] bg-inkt px-4 py-[0.7rem] text-sm font-bold text-white no-underline focus:translate-y-0"
      >
        Ga naar de inhoud
      </a>

      <header
        ref={balk}
        className="sticky top-0 z-40 border-b border-lijn bg-room/94 backdrop-blur-[14px]"
      >
        <Schil className="flex min-h-[4.5rem] items-center justify-between gap-4 lg:min-h-[5.2rem] lg:gap-8">
          <a href="/" className="flex-none" aria-label="Toon over Leven, naar de voorpagina">
            <img
              src="/img/logo.png"
              alt="Toon over Leven"
              width={1369}
              height={606}
              className="h-[2.3rem] w-auto lg:h-[2.7rem]"
            />
          </a>

          <nav aria-label="Hoofdnavigatie" className="hidden lg:block">
            <ul className="flex items-center gap-x-3 xl:gap-x-[1.05rem]">
              {MENU.map((punt) => {
                const hier = isHier(punt.pad);
                const aan = uitgeklapt === punt.pad;
                const deelmenu = `deelmenu-${punt.pad.slice(1)}`;
                const zichtbaarheid = aan
                  ? 'visible opacity-100'
                  : weggeklapt === punt.pad
                    ? 'invisible opacity-0'
                    : 'invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100';

                return (
                  <li
                    key={punt.pad}
                    className="group relative"
                    onPointerLeave={() => setWeggeklapt(null)}
                    onBlur={(gebeurtenis) => {
                      if (!gebeurtenis.currentTarget.contains(gebeurtenis.relatedTarget)) {
                        setWeggeklapt(null);
                      }
                    }}
                    onKeyDown={(gebeurtenis) => {
                      if (gebeurtenis.key !== 'Escape') return;
                      setUitgeklapt(null);
                      setWeggeklapt(punt.pad);
                      gebeurtenis.currentTarget.querySelector<HTMLAnchorElement>('a')?.focus();
                    }}
                  >
                    <div className="flex items-center gap-0.5">
                      <a
                        href={punt.pad}
                        aria-current={hier ? 'page' : undefined}
                        className={`relative text-[0.87rem] font-[650] no-underline transition-colors ${
                          hier ? 'text-wijn' : 'text-inkt hover:text-wijn'
                        }`}
                      >
                        {punt.label}
                        {/* De streep groeit van links naar rechts, zoals in het
                            vastgestelde voorstel. */}
                        <span
                          aria-hidden="true"
                          className={`absolute -bottom-[0.45rem] left-0 h-0.5 w-full origin-left bg-wijn transition-transform duration-200 ${
                            hier ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          }`}
                        />
                      </a>
                      {punt.kinderen && (
                        <button
                          type="button"
                          aria-expanded={aan}
                          aria-controls={deelmenu}
                          onClick={() => {
                            setWeggeklapt(null);
                            setUitgeklapt(aan ? null : punt.pad);
                          }}
                          className="grid h-6 w-6 place-items-center rounded-full text-inkt-doffer transition-colors hover:text-wijn"
                        >
                          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                          <span className="sr-only">Onderdelen van {punt.label}</span>
                        </button>
                      )}
                    </div>

                    {punt.kinderen && (
                      <div
                        className={`absolute left-0 top-full z-10 pt-3 transition-opacity duration-150 ${zichtbaarheid}`}
                      >
                        <ul
                          id={deelmenu}
                          className="min-w-[16rem] rounded-[0.9rem] border border-lijn bg-white p-2 shadow-zacht"
                        >
                          {punt.kinderen.map((kind) => (
                            <li key={kind.pad}>
                              <a
                                href={kind.pad}
                                aria-current={pad === kind.pad ? 'page' : undefined}
                                className={`block rounded-[0.6rem] px-3 py-2 text-[0.87rem] font-semibold no-underline transition-colors hover:bg-blos hover:text-wijn ${
                                  pad === kind.pad ? 'bg-blos text-wijn' : 'text-inkt-zacht'
                                }`}
                              >
                                {kind.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex flex-none items-center gap-2">
            <a
              href={CONTACT.pad}
              className="hidden rounded-full bg-wijn px-[1.15rem] py-[0.72rem] text-[0.87rem] font-[650] text-white no-underline shadow-[0_8px_20px_rgba(128,22,63,0.17)] transition-colors hover:bg-wijn-diep sm:inline-flex"
            >
              {CONTACT.label}
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              className="grid h-[2.8rem] w-[2.8rem] place-items-center rounded-[0.7rem] border border-lijn bg-white text-inkt transition-colors hover:text-wijn lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Menu</span>
            </button>
          </div>
        </Schil>
      </header>

      {/* Als broer van de balk en niet erin: een vast menu binnen een element
          met backdrop-filter wordt door die laag afgeknipt en komt dan niet over
          de pagina heen. */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-room lg:hidden">
          <div className="flex-none border-b border-lijn">
            <Schil className="flex min-h-[4.5rem] items-center justify-between gap-4">
              <img
                src="/img/logo.png"
                alt="Toon over Leven"
                width={1369}
                height={606}
                className="h-[2.3rem] w-auto"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-[2.8rem] w-[2.8rem] place-items-center rounded-[0.7rem] border border-lijn bg-white text-inkt transition-colors hover:text-wijn"
              >
                <X className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Menu sluiten</span>
              </button>
            </Schil>
          </div>

          <nav aria-label="Hoofdnavigatie" className="flex-1 overflow-y-auto overscroll-contain">
            <Schil>
              {MENU.map((punt) => (
                // De rubriek waar je staat begint opengeklapt: dat scheelt een
                // tik en laat zien waar je bent.
                <details key={punt.pad} open={isHier(punt.pad) || undefined} className="group border-b border-lijn">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 font-display text-[1.2rem] text-wijn-diep [&::-webkit-details-marker]:hidden">
                    {punt.label}
                    <ChevronDown
                      className="h-4 w-4 flex-none text-wijn transition-transform duration-200 group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <ul className="grid pb-3">
                    <li>
                      <a
                        href={punt.pad}
                        aria-current={pad === punt.pad ? 'page' : undefined}
                        className="block py-2.5 text-[0.95rem] font-bold text-wijn no-underline"
                      >
                        Overzicht
                      </a>
                    </li>
                    {punt.kinderen?.map((kind) => (
                      <li key={kind.pad}>
                        <a
                          href={kind.pad}
                          aria-current={pad === kind.pad ? 'page' : undefined}
                          className={`block py-2.5 text-[0.95rem] no-underline ${
                            pad === kind.pad ? 'font-bold text-wijn' : 'text-inkt-zacht'
                          }`}
                        >
                          {kind.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}

              <div className="grid gap-3 py-7">
                <a
                  href={CONTACT.pad}
                  className="inline-flex min-h-[2.9rem] items-center justify-center gap-2 rounded-full bg-wijn px-5 py-3 text-[0.9rem] font-extrabold text-white no-underline"
                >
                  {CONTACT.label}
                </a>
                <a
                  href={TEL_LINK}
                  className="inline-flex min-h-[2.9rem] items-center justify-center gap-2 rounded-full border border-wijn/30 px-5 py-3 text-[0.9rem] font-extrabold text-wijn no-underline"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" /> {TEL}
                </a>
                <a
                  href={`mailto:${MAIL}`}
                  className="inline-flex min-h-[2.9rem] items-center justify-center gap-2 rounded-full border border-wijn/30 px-5 py-3 text-[0.9rem] font-extrabold text-wijn no-underline"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" /> {MAIL}
                </a>
              </div>
            </Schil>
          </nav>
        </div>
      )}
    </>
  );
}
