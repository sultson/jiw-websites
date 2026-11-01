import { Brain, Heart, Activity } from 'lucide-react';
import SectionHeader from './SectionHeader';

const gevolgen = [
  { icon: Activity, title: 'Lichamelijk', body: 'Tintelingen, pijn, een branderig gevoel of juist gevoelloosheid.' },
  { icon: Heart, title: 'Emotioneel', body: 'Klachten die dag in dag uit meespelen raken ook aan hoe u zich voelt.' },
  { icon: Brain, title: 'Mentaal', body: 'De impact op het dagelijks leven vraagt voortdurend aandacht en energie.' },
];

export default function WatIsNeuropathie() {
  return (
    <section id="neuropathie" className="section bg-canvas">
      <div className="shell-wide">
        <SectionHeader
          eyebrow="Wat is neuropathie"
          title="Zenuwen die informatie niet meer goed doorgeven"
          intro="Neuropathie is een aandoening waarbij zenuwen beschadigd zijn. Hierdoor kunnen zenuwen informatie niet meer goed doorgeven aan de hersenen en andersom. Dit kan lichamelijke, emotionele en mentale gevolgen hebben en een grote impact hebben op het welzijn en dagelijks leven van mensen met neuropathie."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {gevolgen.map((g) => (
            <div key={g.title} className="card p-6">
              <span className="w-11 h-11 rounded-full bg-sage-wash text-sage-deep flex items-center justify-center">
                <g.icon size={20} strokeWidth={2} />
              </span>
              <h3 className="mt-4 font-display text-[20px] text-ink">{g.title}</h3>
              <p className="mt-2 text-[15.5px] leading-relaxed text-ink-soft">{g.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
