import { ArrowRight } from "lucide-react";
import type { Content } from "../content";
import { useAanvraag } from "./AanvraagModal";

type Props = { c: Content };

export default function ContactCta({ c }: Props) {
  const { open } = useAanvraag();
  return (
    <section id="contact" className="scroll-mt-20 border-b border-line-dark bg-ink text-bone on-dark">
      <div className="shell py-20 sm:py-28">
        <span className="label text-fog">{c.contact.label}</span>
        <h2 className="mt-5 max-w-3xl text-[clamp(2.3rem,7vw,5.5rem)] leading-[0.98]">{c.contact.title}</h2>
        <p className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-fog sm:text-lg">{c.contact.text}</p>

        <div className="mt-12 grid border border-bone sm:grid-cols-2">
          <button
            type="button"
            onClick={() => open("werknemer")}
            className="group flex items-center justify-between gap-4 px-7 py-8 text-left transition-colors hover:bg-bone hover:text-ink"
          >
            <span className="font-display text-2xl font-medium uppercase tracking-[-0.01em] sm:text-3xl">
              {c.hero.werknemerBtn}
            </span>
            <ArrowRight size={26} strokeWidth={2} className="shrink-0 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            type="button"
            onClick={() => open("werkgever")}
            className="group flex items-center justify-between gap-4 border-t border-bone px-7 py-8 text-left transition-colors hover:bg-bone hover:text-ink sm:border-l sm:border-t-0"
          >
            <span className="font-display text-2xl font-medium uppercase tracking-[-0.01em] sm:text-3xl">
              {c.hero.werkgeverBtn}
            </span>
            <ArrowRight size={26} strokeWidth={2} className="shrink-0 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
