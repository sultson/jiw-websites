import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Phone, MessageCircle, Instagram } from 'lucide-react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import { useLang } from '../hooks/useLang';
import { legal } from '../data/legal';

const PHONE = '+31633890157';
const PHONE_DISPLAY = '06 338 90 157';

export default function AlgemeneVoorwaarden() {
  const { lang, setLang, t } = useLang();
  const [bookingOpen, setBookingOpen] = useState(false);
  const doc = legal[lang];

  useEffect(() => {
    document.title = doc.docTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', doc.metaDescription);
  }, [doc]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-cream">
      <Nav lang={lang} setLang={setLang} t={t} onBook={() => setBookingOpen(true)} />

      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-5 sm:px-8 py-12 md:py-20">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-espresso/60 hover:text-gold mb-8"
          >
            <ArrowLeft size={14} /> {doc.back}
          </a>

          <header className="border-b border-espresso/10 pb-8 mb-10">
            <span className="kicker">{doc.kicker}</span>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl leading-tight">{doc.title}</h1>
            <p className="mt-3 text-base text-espresso/70">{doc.subtitle}</p>
            <p className="mt-1 text-sm text-espresso/50">{doc.version}</p>
            <p className="mt-6 text-[15px] md:text-base leading-relaxed text-espresso/85">
              {doc.intro}
            </p>
          </header>

          <div className="space-y-10 md:space-y-12">
            {doc.articles.map(article => (
              <section key={article.n}>
                <h2 className="font-serif text-xl md:text-2xl text-espresso mb-4 md:mb-5">
                  <span className="text-gold tabular-nums mr-3">
                    {doc.articleLabel} {article.n}
                  </span>
                  <span className="text-espresso/25 mr-3">/</span>
                  {article.title}
                </h2>

                <div className="space-y-3 md:space-y-4 text-[15px] md:text-base leading-relaxed text-espresso/85">
                  {article.blocks.map((block, i) =>
                    block.kind === 'p' ? (
                      <p key={i} className="flex gap-3">
                        {block.num && (
                          <span className="text-gold font-medium tabular-nums shrink-0 min-w-[2.5rem]">
                            {block.num}
                          </span>
                        )}
                        <span>{block.text}</span>
                      </p>
                    ) : (
                      <ul
                        key={i}
                        className="pl-[2.5rem] md:pl-[3.25rem] space-y-2 list-disc marker:text-gold"
                      >
                        {block.items.map((item, j) => (
                          <li key={j} className="pl-1">
                            {item}
                          </li>
                        ))}
                      </ul>
                    ),
                  )}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-12 rounded-2xl bg-blush-soft/70 px-6 py-5 text-[15px] md:text-base leading-relaxed text-espresso/85">
            {doc.closing}
          </p>

          <footer className="mt-12 pt-8 border-t border-espresso/10">
            <p className="kicker">{doc.contactTitle}</p>
            <div className="mt-4 space-y-2 text-[15px] md:text-base text-espresso/85 leading-relaxed">
              <p className="font-medium text-espresso">AnArt Studio</p>
              <p className="flex items-center gap-2">
                <MapPin size={15} className="shrink-0 text-gold" />
                Peperstraat 14d, 5171 EC Kaatsheuvel
              </p>
              <p className="flex items-center gap-2">
                <Phone size={15} className="shrink-0 text-gold" />
                {doc.phoneLabel}:{' '}
                <a href={`tel:${PHONE}`} className="text-gold hover:underline">
                  {PHONE_DISPLAY}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MessageCircle size={15} className="shrink-0 text-gold" />
                {doc.whatsappLabel}:{' '}
                <a
                  href={`https://wa.me/${PHONE.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:underline"
                >
                  {PHONE_DISPLAY}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Instagram size={15} className="shrink-0 text-gold" />
                <a
                  href="https://www.instagram.com/annart.nl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:underline"
                >
                  @annart.nl
                </a>
              </p>
            </div>
          </footer>
        </article>
      </main>

      <Footer t={t} />

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} t={t} />
    </div>
  );
}
