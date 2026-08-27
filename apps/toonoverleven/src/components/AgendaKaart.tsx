import type { ReactNode } from 'react';
import { CalendarPlus } from 'lucide-react';
import type { Activiteit } from '../content/types';
import { bron } from '../content';
import {
  CATEGORIE_FOTO,
  DOELGROEP_LABEL,
  THEMA_LABEL,
  ics,
  icsBestandsnaam,
  ritme,
  tijdvak,
  volledigeDatum,
} from '../agenda/model';
import { PLAATS, STRAAT, Tekstlink, schrijfNaam } from '../ui';
import { SITE_URL } from '../meta';

/**
 * Eén kaart uit de agenda, in de vorm van het vastgestelde voorstel: een strook
 * beeld, een labeltje, de naam, een paar zinnen, en daaronder de praktische
 * gegevens onder elkaar.
 *
 * Die gegevens zijn de kern en niet de opsmuk. Hun eigen overdracht vraagt
 * erom dat bij ieder moment de volle datum met jaar, de tijd, de plek, voor
 * wie het is, wat het kost en hoe je je aanmeldt zichtbaar zijn. Wat niet in
 * het beheer staat, zegt hier dat het niet bekend is; een leeg vakje bij
 * "kosten" mag nooit als "gratis" gelezen worden.
 *
 * De foto blijft stilstaan als de muis eroverheen gaat. Het voorstel laat hem
 * inzoomen, maar bewegend beeld is het laatste wat iemand hier nodig heeft.
 */
export default function AgendaKaart({
  activiteit,
  reeks = false,
}: {
  activiteit: Activiteit;
  /** De kaart van het aanbod: hoe vaak het terugkomt in plaats van één datum. */
  reeks?: boolean;
}) {
  const foto = activiteit.img ? bron(activiteit.img, 'klein') : CATEGORIE_FOTO[activiteit.categorie];
  const label = activiteit.themas.length
    ? THEMA_LABEL[activiteit.themas[0]]
    : activiteit.categorie;
  const elke = ritme(activiteit);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-lijn bg-white shadow-[var(--shadow-kaart)]">
      <div className="h-36 overflow-hidden bg-blos">
        <img
          src={foto}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p>
          <span className="inline-block rounded-full bg-blos px-2.5 py-1 text-[0.7rem] font-extrabold uppercase tracking-[0.06em] text-wijn">
            {label}
          </span>
        </p>
        <h3 className="mb-1.5 mt-2.5 text-[1.15rem]">{schrijfNaam(activiteit.titel)}</h3>
        {activiteit.omschrijving && (
          <p className="text-[0.95rem] leading-relaxed text-inkt-doffer">
            {schrijfNaam(activiteit.omschrijving)}
          </p>
        )}

        <dl className="mt-4 text-[0.85rem] leading-relaxed">
          {reeks ? (
            <>
              <Feit label="Hoe vaak">{elke ?? 'Eén keer'}</Feit>
              <Feit label="Eerstvolgend">
                {volledigeDatum(activiteit.start)}, {tijdvak(activiteit)}
              </Feit>
            </>
          ) : (
            <>
              <Feit label="Wanneer">{volledigeDatum(activiteit.start)}</Feit>
              <Feit label="Hoe laat">{tijdvak(activiteit)}</Feit>
              {elke && <Feit label="Hoe vaak">{elke}</Feit>}
            </>
          )}
          <Feit label="Waar">{activiteit.locatie || `${STRAAT}, ${PLAATS}`}</Feit>
          <Feit label="Voor wie">
            {activiteit.doelgroepen.map((groep) => DOELGROEP_LABEL[groep]).join(', ')}
          </Feit>
          <Feit label="Kosten">
            {activiteit.bijdrage ? (
              schrijfNaam(activiteit.bijdrage)
            ) : (
              <span className="text-grijs">Nog niet bekend, vraag het na voordat je komt</span>
            )}
          </Feit>
          <Feit label="Aanmelden">
            {activiteit.aanmelden ? (
              <>
                Graag even aanmelden.{' '}
                <Tekstlink href="/praktisch/contact">Neem contact op</Tekstlink>
              </>
            ) : (
              'Niet nodig, je loopt zo binnen'
            )}
          </Feit>
        </dl>

        <div className="mt-auto pt-4">
          {reeks ? (
            <Tekstlink href="/activiteiten/agenda">
              Bekijk wanneer dit is <span aria-hidden="true">→</span>
            </Tekstlink>
          ) : (
            <InAgenda activiteit={activiteit} />
          )}
        </div>
      </div>
    </article>
  );
}

/** Eén regel uit de praktische gegevens: label links, antwoord ernaast. */
function Feit({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-x-3 border-t border-lijn py-1.5 min-[22rem]:grid-cols-[6.5rem_minmax(0,1fr)]">
      <dt className="font-extrabold text-inkt">{label}</dt>
      <dd className="m-0 text-inkt-doffer">{children}</dd>
    </div>
  );
}

/**
 * De activiteit in de eigen agenda van de bezoeker zetten.
 *
 * Hiervoor zat dit achter een menuutje met drie puntjes. Dat is precies het
 * soort knop dat iemand van tachtig niet vindt en niet durft aan te klikken,
 * dus staat hij er nu gewoon.
 */
function InAgenda({ activiteit }: { activiteit: Activiteit }) {
  const bewaar = () => {
    const plaats = activiteit.locatie || `${STRAAT}, ${PLAATS}`;
    const bestand = ics(activiteit, { url: `${SITE_URL}/activiteiten/agenda`, plaats });
    const blob = new Blob([bestand], { type: 'text/calendar;charset=utf-8' });
    const adres = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = adres;
    link.download = icsBestandsnaam(activiteit);
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Pas vrijgeven als de browser de download heeft opgepakt.
    setTimeout(() => URL.revokeObjectURL(adres), 1000);
  };

  return (
    <button
      type="button"
      onClick={bewaar}
      className="inline-flex min-h-[2.6rem] items-center gap-2 rounded-full border border-lijn bg-white px-4 py-2 text-[0.85rem] font-bold text-wijn transition hover:border-wijn hover:bg-blos"
    >
      <CalendarPlus className="h-4 w-4 flex-none" aria-hidden="true" />
      Zet in mijn agenda
    </button>
  );
}
