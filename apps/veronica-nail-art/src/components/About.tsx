const tags = ['Met de hand geschilderd', 'Rustig de tijd', 'Eerlijk advies', 'Netjes afgewerkt'];

export default function About() {
  return (
    <section id="over" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="order-2 md:order-1">
          <span className="kicker">Over Veronica</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.1]">
            Een vast adres voor mooie nagels.
          </h2>
          <p className="mt-6 text-ink/75 leading-relaxed max-w-prose">
            Veronica Nail Art is de nagelstudio van Veronica in Emmeloord. Wat ooit begon als
            een passie voor het vak is uitgegroeid tot een plek waar klanten al jaren terugkomen.
            Niet zomaar: Veronica neemt rustig de tijd, denkt met je mee en stuurt je de deur uit
            met nagels waar je blij van wordt.
          </p>
          <p className="mt-4 text-ink/75 leading-relaxed max-w-prose">
            Verzorgd, hygiënisch en met oog voor detail. En heb je een idee in je hoofd? Veronica
            schildert je design met de hand, van subtiel tot helemaal jouw stijl.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blush text-ink/80 border border-ink/8"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4 text-sm text-ink/70">
            <div className="h-px flex-1 bg-ink/15 max-w-16" />
            <span className="font-serif italic text-lg">Veronica · Nail Art</span>
            <div className="h-px flex-1 bg-ink/15 max-w-16" />
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative">
            <div className="rounded-2xl w-full aspect-[4/5] bg-blush overflow-hidden shadow-[0_20px_60px_-30px_rgba(32,33,42,0.4)]">
              <img
                src="/veronica.webp"
                alt="De studio van Veronica Nail Art in Emmeloord"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:block absolute -bottom-8 -left-8 w-40 h-48 rounded-2xl overflow-hidden shadow-[0_20px_60px_-30px_rgba(32,33,42,0.45)] ring-4 ring-cream">
              <img
                src="/gallery-1.webp"
                alt="Verzorgde nagels door Veronica Nail Art"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
