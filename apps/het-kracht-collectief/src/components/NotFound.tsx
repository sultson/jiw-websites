import { ArrowLeft } from "lucide-react";
import type { Content } from "../content";
import { Link } from "../router";

type Props = { c: Content };

export default function NotFound({ c }: Props) {
  return (
    <section className="border-b border-line-dark bg-ink text-bone on-dark">
      <div className="shell py-24 sm:py-32">
        <span className="label text-fog">{c.notFound.label}</span>
        <h1 className="mt-5 max-w-3xl text-[clamp(2.3rem,7vw,5.5rem)] font-light uppercase leading-[0.98]">
          {c.notFound.title}
        </h1>
        <p className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-fog sm:text-lg">{c.notFound.text}</p>
        <Link to="/" className="btn btn-solid-inv mt-10 inline-flex">
          <ArrowLeft size={16} strokeWidth={2.5} />
          {c.notFound.cta}
        </Link>
      </div>
    </section>
  );
}
