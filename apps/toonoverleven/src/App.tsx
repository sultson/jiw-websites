import { useEffect, useMemo } from "react";
import { findEvent } from "./next/events";
import { activityTypes } from "./next/model";
import Site from "./next/Site";
import Melding from "./components/Melding";
import { useAgenda } from "./agenda/useAgenda";
import { lopendeMelding } from "./agenda/model";
import { content, isVoorbeeld } from "./content";
import { usePad, useInterneLinks, useScrollBijNavigatie } from "./router";
import { titelVan, VERHUISD } from "./meta";
import { NU } from "./nu";
import type { Content } from "./content/types";
export type Start = {
  pad: string;
  inhoud: Content;
  voorbeeld: boolean;
  nu: number;
};
export default function App({ start }: { start?: Start } = {}) {
  const current = usePad();
  const pad = VERHUISD[start?.pad ?? current] ?? start?.pad ?? current;
  const inhoud = start?.inhoud ?? content;
  const voorbeeld = start?.voorbeeld ?? isVoorbeeld;
  const nu = useMemo(
    () =>
      new Date(
        new Date(start?.nu ?? NU).toLocaleString("en-US", {
          timeZone: "Europe/Amsterdam",
        }),
      ),
    [start?.nu],
  );
  const agenda = useAgenda(inhoud.agenda, nu);
  const melding = lopendeMelding(agenda);
  useInterneLinks();
  useScrollBijNavigatie(pad);
  useEffect(() => {
    const page = inhoud.pages?.find((p) => p.path === pad);
    const news = pad.startsWith("/nieuws/")
      ? inhoud.nieuws.find((n) => n.slug === decodeURIComponent(pad.slice(8)))
      : null;
    const event = /^\/(activiteit|aanmelden)\//.test(pad) ? findEvent(agenda, pad) : undefined;
    const signupTitle = pad.startsWith('/aanmelden/') ? 'Aanmelden: ' + (event?.titel || activityTypes[pad.split('/')[2]]?.title || 'Activiteit') : null;
    document.title = signupTitle ? signupTitle + ' · Toon over Leven' : event ? event.titel + ' · Toon over Leven' : page?.title
      ? `${page.title} · Toon over Leven`
      : news
        ? `${news.titel} · Toon over Leven`
        : titelVan(pad);
  }, [pad, inhoud, agenda]);
  return (
    <>
      {voorbeeld && (
        <p className="bg-wijn px-5 py-2 text-center text-sm font-semibold text-white">
          Voorbeeld: inclusief wijzigingen die nog niet gepubliceerd zijn.
        </p>
      )}
      {melding && <Melding melding={melding} />}
      <Site ctx={{ content: inhoud, agenda, path: pad }} />
    </>
  );
}
