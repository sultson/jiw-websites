import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  HeartHandshake,
  Menu,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  X,
} from 'lucide-react';

type SubmitState = 'idle' | 'sending' | 'success' | 'error';

const values = [
  {
    icon: HeartHandshake,
    title: 'Respect',
    text: 'De keuzes, gewoonten en grenzen van cliënten vormen altijd het vertrekpunt.',
  },
  {
    icon: Sparkles,
    title: 'Zorg met aandacht',
    text: 'Rustig luisteren, kijken naar de wensen van de cliënt en de zorg daarop afstemmen.',
  },
  {
    icon: ShieldCheck,
    title: 'Secuur werken',
    text: 'Zorgvuldig in handelen en rapporteren. Gemaakte afspraken worden nagekomen.',
  },
  {
    icon: Users,
    title: 'Zelfstandig en flexibel',
    text: 'Zelfstandig inzetbaar, een betrokken teamspeler en flexibel waar de planning daarom vraagt.',
  },
];

export default function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  return path === '/klachten-en-geschillen' ? <ComplaintsPage /> : <HomePage />;
}

function ComplaintsPage() {
  useEffect(() => {
    document.title = 'Klachten en geschillen | D.E Zorg';
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = 'Lees hoe D.E Zorg omgaat met klachten en bekijk de klachtenregelingen van SoloPartners en het geschillenreglement van GIDZ.';
  }, []);

  const documents = [
    {
      title: 'Klachtenregeling Wkkgz',
      description: 'De algemene klachtenregeling van SoloPartners voor zorg die onder de Wkkgz valt.',
      href: '/documenten/klachtenregeling-wkkgz-solopartners-januari-2024.pdf',
    },
    {
      title: 'Klachtenregeling Wzd',
      description: 'De regeling van SoloPartners voor klachten die vallen onder de Wet zorg en dwang.',
      href: '/documenten/klachtenregeling-wzd-solopartners-juli-2023.pdf',
    },
    {
      title: 'Geschillenreglement GIDZ',
      description: 'Het reglement voor de behandeling van geschillen door Stichting Geschillen In De Zorg.',
      href: '/documenten/geschillenreglement-gidz-maart-2022.pdf',
    },
  ];

  return (
    <>
      <header className="site-header complaints-header">
        <a className="brand" href="/" aria-label="D.E Zorg, naar de homepage"><span>D.E</span> <strong>Zorg</strong></a>
        <a className="text-link" href="/"><ArrowLeft size={16} aria-hidden="true" /> Terug naar home</a>
      </header>

      <main className="complaints-page">
        <section className="complaints-hero section">
          <p className="eyebrow">Duidelijk en zorgvuldig geregeld</p>
          <h1>Klachten en <em>geschillen.</em></h1>
          <p>Uw ervaring met onze zorg doet ertoe. Daarom maken we graag duidelijk waar u terechtkunt met een klacht en welke stappen u kunt nemen.</p>
        </section>

        <section className="complaints-content section" aria-labelledby="complaints-title">
          <div className="complaints-copy">
            <h2 id="complaints-title">Eerst samen in gesprek.</h2>
            <p>Wij vinden het belangrijk dat u tevreden bent over onze zorg. Bent u ergens niet tevreden over? Bespreek dit dan bij voorkeur eerst met D.E Zorg. Wij luisteren naar uw ervaring en zoeken graag samen naar een passende oplossing.</p>
            <p>Komt u er samen met ons niet uit, of bespreekt u uw klacht liever met een onafhankelijke partij? Dan kunt u kosteloos gebruikmaken van de onafhankelijke klachtenfunctionaris van SoloPartners.</p>
          </div>

          <aside className="complaints-affiliations" aria-label="Aansluitingen voor klachten en geschillen">
            <p className="eyebrow">D.E Zorg is aangesloten bij</p>
            <ul>
              <li><Check aria-hidden="true" /> de klachtenregeling van SoloPartners;</li>
              <li><Check aria-hidden="true" /> een onafhankelijke klachtenfunctionaris;</li>
              <li><Check aria-hidden="true" /> de erkende geschilleninstantie Stichting Geschillen in de Zorg, afgekort GIDZ.</li>
            </ul>
          </aside>

          <div className="complaints-support">
            <h2>Onafhankelijke ondersteuning.</h2>
            <p>De klachtenfunctionaris kan u adviseren, helpen bij het formuleren van uw klacht en bemiddelen tussen u en D.E Zorg. De klachtenregeling bepaalt ook dat D.E Zorg de regeling op een geschikte wijze onder de aandacht van cliënten moet brengen.</p>
            <div className="complaints-actions">
              <a className="button button-primary" href="/documenten/klachtenregeling-wkkgz-solopartners-januari-2024.pdf" target="_blank" rel="noreferrer">Klachtenregeling bekijken <ArrowRight size={17} aria-hidden="true" /></a>
              <a className="button button-secondary" href="https://www.solopartners.nl/klachtenregeling" target="_blank" rel="noreferrer">Meer informatie bij SoloPartners <ArrowRight size={17} aria-hidden="true" /></a>
              <a className="button button-secondary" href="https://geschillenindezorg.nl/geschil-melden/" target="_blank" rel="noreferrer">Geschil melden bij GIDZ <ArrowRight size={17} aria-hidden="true" /></a>
            </div>
          </div>
        </section>

        <section className="complaints-documents section" aria-labelledby="documents-title">
          <div className="complaints-documents-heading">
            <p className="eyebrow">Documenten</p>
            <h2 id="documents-title">De regelingen nalezen.</h2>
            <p>Hier vindt u de volledige documenten die van toepassing kunnen zijn op klachten en geschillen rond de zorg van D.E Zorg.</p>
          </div>
          <div className="document-grid">
            {documents.map((document) => (
              <a className="document-card" href={document.href} target="_blank" rel="noreferrer" key={document.href}>
                <span className="document-icon"><FileText aria-hidden="true" /></span>
                <h3>{document.title}</h3>
                <p>{document.description}</p>
                <span className="document-link">PDF bekijken <ArrowRight size={16} aria-hidden="true" /></span>
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="complaints-footer">
        <div className="footer-top">
          <a className="brand" href="/"><span>D.E</span> <strong>Zorg</strong></a>
          <div className="footer-contact">
            <p>Persoonlijke zorg aan huis en professionele inzet binnen de ouderenzorg.</p>
            <a href="mailto:lenie.eranio@hotmail.com">lenie.eranio@hotmail.com</a>
          </div>
          <a className="button button-primary" href="/#contact">Contact met D.E Zorg</a>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} D.E Zorg · KvK 82894248</p>
          <a href="/">Terug naar de homepage</a>
        </div>
      </footer>
    </>
  );
}

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [showMobileContact, setShowMobileContact] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!privacyOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPrivacyOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [privacyOpen]);

  useEffect(() => {
    const contactActions = Array.from(document.querySelectorAll<HTMLElement>('[data-contact-cta]'));
    const visibleActions = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleActions.add(entry.target);
        else visibleActions.delete(entry.target);
      });
      setShowMobileContact(visibleActions.size === 0);
    }, { threshold: 0.15 });

    contactActions.forEach((action) => observer.observe(action));
    return () => observer.disconnect();
  }, []);

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitState('sending');
    setFormError('');

    try {
      const response = await fetch('/api/forms/contact', {
        method: 'POST',
        body: new FormData(form),
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message || 'Het bericht kon niet worden verstuurd.');
      form.reset();
      setSubmitState('success');
    } catch (error) {
      setSubmitState('error');
      setFormError(error instanceof Error ? error.message : 'Het bericht kon niet worden verstuurd. Probeer het later opnieuw.');
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="D.E Zorg, naar boven">
          <span>D.E</span> <strong>Zorg</strong>
        </a>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Hoofdnavigatie">
          <a href="#over" onClick={closeMenu}>Over D.E Zorg</a>
          <a href="#zorg-thuis" onClick={closeMenu}>Zorg aan huis</a>
          <a href="#werkwijze" onClick={closeMenu}>Werkwijze</a>
          <a href="#kernwaarden" onClick={closeMenu}>Kernwaarden</a>
          <a className="nav-cta" href="#contact" onClick={closeMenu}>Contact</a>
        </nav>
        <button
          type="button"
          className="menu-button"
          aria-label={menuOpen ? 'Menu sluiten' : 'Menu openen'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Zelfstandig zorgprofessional</p>
            <h1>Persoonlijke zorg, <em>waar u die nodig heeft.</em></h1>
            <p className="hero-intro">
              D.E Zorg biedt betrouwbare ouderenzorg aan huis en ondersteunt zorginstellingen en bemiddelingsbureaus. Altijd met aandacht voor de cliënt, heldere communicatie en respect voor vertrouwde gewoonten.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#contact" data-contact-cta>Contact <ArrowRight size={17} aria-hidden="true" /></a>
              <a className="text-link" href="#over">Maak kennis met D.E Zorg</a>
            </div>
          </div>
          <div className="hero-image-wrap">
            <img src="/images/hero-walk.webp" alt="Een zorgprofessional loopt arm in arm met een oudere cliënt door een lichte woonkamer" fetchPriority="high" />
          </div>
        </section>

        <section className="about section" id="over">
          <div>
            <p className="eyebrow">Over D.E Zorg</p>
            <h2>Een ervaren professional, met aandacht voor de mens.</h2>
          </div>
          <div className="about-copy">
            <p className="lead">
              D.E Zorg is de zelfstandige zorgonderneming van Lenie. In 2014 behaalde zij haar diploma Helpende. Sindsdien zet zij haar kennis en ervaring in voor ouderen die ondersteuning nodig hebben.
            </p>
            <p>
              Lenie werkt secuur, handelt zelfstandig en sluit zorgvuldig aan op de wensen en het vertrouwde ritme van cliënten. Zij biedt één-op-één ondersteuning bij mensen thuis en is daarnaast inzetbaar binnen ouderenzorginstellingen, in samenwerking met zorgorganisaties en bemiddelingsbureaus. De afstemming met naasten, collega’s en andere betrokken zorgprofessionals is altijd professioneel en helder.
            </p>
          </div>
        </section>

        <section className="home-care section" id="zorg-thuis">
          <div className="home-care-heading">
            <p className="eyebrow">Zorg aan huis</p>
            <h2>Vertrouwde ondersteuning in uw eigen omgeving.</h2>
            <p>Ook wanneer iemand zelfstandig thuis woont, kan extra ondersteuning veel rust geven. D.E Zorg biedt persoonlijke één-op-één zorg, afgestemd op wat de cliënt en diens naasten nodig hebben.</p>
          </div>
          <div className="home-care-options">
            <article>
              <span className="home-care-icon"><UserRound aria-hidden="true" /></span>
              <h3>Voor uzelf</h3>
              <p>Heeft u thuis ondersteuning nodig? Samen bespreken we uw wensen, dagelijkse ritme en welke hulp passend is.</p>
            </article>
            <article>
              <span className="home-care-icon"><HeartHandshake aria-hidden="true" /></span>
              <h3>Voor een naaste</h3>
              <p>Kinderen en kleinkinderen kunnen contact opnemen om passende ondersteuning voor hun (groot)ouder te bespreken.</p>
            </article>
            <article>
              <span className="home-care-icon"><ShieldCheck aria-hidden="true" /></span>
              <h3>Mogelijk via een PGB</h3>
              <p>Met een persoonsgebonden budget kunt u, als u daarvoor in aanmerking komt, zelf zorg inkopen en een zorgverlener kiezen.</p>
              <a className="text-link" href="https://www.svb.nl/nl/pgb/starten-met-een-pgb/wat-is-een-pgb" target="_blank" rel="noreferrer">Lees de uitleg van de SVB <ArrowRight size={16} aria-hidden="true" /></a>
            </article>
          </div>
          <a className="button button-primary" href="#contact" data-contact-cta>Bespreek uw zorgvraag <ArrowRight size={17} aria-hidden="true" /></a>
        </section>

        <section className="approach section" id="werkwijze">
          <div className="approach-panel">
            <div className="approach-copy">
              <p className="eyebrow">De werkwijze</p>
              <h2>Goede zorg begint bij een goed gesprek.</h2>
              <ol>
                <li><span>01</span><div><strong>Kennismaken</strong><p>De cliënt, een naaste of organisatie deelt de zorgvraag en gewenste ondersteuning.</p></div></li>
                <li><span>02</span><div><strong>Afstemmen</strong><p>Wensen, taken, verantwoordelijkheden, planning en afspraken worden helder afgestemd.</p></div></li>
                <li><span>03</span><div><strong>Zorg met aandacht</strong><p>De zorg wordt zorgvuldig uitgevoerd, met aandacht voor cliënten en hun vertrouwde ritme.</p></div></li>
              </ol>
            </div>
            <img className="approach-image" src="/images/werkwijze-zorg.webp" alt="Een zorgverlener legt zorgvuldig een deken om de schouders van een oudere cliënt" loading="lazy" />
          </div>
        </section>

        <section className="values section" id="kernwaarden">
          <div className="values-media">
            <img src="/images/zorg-met-aandacht.webp" alt="Een zorgverlener serveert thee aan een oudere cliënt aan tafel" loading="lazy" />
            <p className="values-caption">Zorg met aandacht, <span>elke dienst opnieuw.</span></p>
          </div>
          <div className="values-content">
            <p className="eyebrow">Waar D.E Zorg voor staat</p>
            <h2>Professioneel in het werk, betrokken bij de cliënt.</h2>
            <p className="values-intro">De kernwaarden van D.E Zorg vormen de basis voor iedere opdracht en samenwerking.</p>
            <div className="value-grid">
              {values.map(({ icon: Icon, title, text }) => (
                <article className="value-card" key={title}>
                  <span className="value-icon"><Icon aria-hidden="true" /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="membership section" aria-label="Lidmaatschap SoloPartners">
          <div className="membership-band">
            <a className="partner-logo" href="https://www.solopartners.nl/" target="_blank" rel="noreferrer" aria-label="Bezoek SoloPartners">
              <img src="/images/solopartners.svg" alt="SoloPartners" loading="lazy" />
            </a>
            <p>Niet tevreden over onze zorg? D.E Zorg biedt een duidelijke klachtenroute, met onafhankelijke ondersteuning via <strong>SoloPartners</strong> en geschilleninstantie GIDZ.</p>
            <a className="text-link" href="/klachten-en-geschillen">Klachten en geschillen <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </section>

        <section className="contact section" id="contact" data-contact-cta>
          <div className="contact-copy">
            <p className="eyebrow">Contact</p>
            <h2>Uw zorgvraag of een samenwerking bespreken?</h2>
            <p>Zoekt u ondersteuning voor uzelf of een naaste, eventueel via een PGB? Ook zorginstellingen en bemiddelingsbureaus kunnen via het formulier contact opnemen. Lenie reageert zo spoedig mogelijk per e-mail.</p>
            <div className="contact-note">
              <ShieldCheck aria-hidden="true" />
              <p><strong>Uw privacy telt.</strong> Deel in dit formulier geen medische gegevens of andere gevoelige informatie.</p>
            </div>
          </div>

          {submitState === 'success' ? (
            <div className="success-panel" role="status">
              <Check aria-hidden="true" />
              <h3>Bedankt voor uw bericht</h3>
              <p>Uw bericht is veilig verzonden. Lenie neemt zo spoedig mogelijk per e-mail contact met u op.</p>
              <button className="text-link" type="button" onClick={() => setSubmitState('idle')}>Nog een bericht sturen</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={submitForm}>
              <input type="hidden" name="cf-turnstile-response" value="dev" />
              <div className="form-row">
                <label>Voornaam<input name="firstName" autoComplete="given-name" required /></label>
                <label>Achternaam<input name="lastName" autoComplete="family-name" required /></label>
              </div>
              <label>E-mailadres<input type="email" name="email" autoComplete="email" required /></label>
              <label>Organisatie <small>optioneel</small><input name="organisation" autoComplete="organization" /></label>
              <label>Waar gaat uw bericht over?
                <select name="subject" defaultValue="" required>
                  <option value="" disabled>Maak een keuze</option>
                  <option value="inzet">Beschikbaarheid of inzet</option>
                  <option value="zorg-thuis-pgb">Zorg aan huis of PGB</option>
                  <option value="samenwerking">Een samenwerking</option>
                  <option value="anders">Iets anders</option>
                </select>
              </label>
              <label>Uw bericht
                <textarea name="message" rows={5} required placeholder="Vertel kort welke ondersteuning, inzet of samenwerking u wilt bespreken. Deel geen medische gegevens." />
              </label>
              <label className="consent">
                <input type="checkbox" required />
                <span>Ik ga ermee akkoord dat D.E Zorg mijn gegevens gebruikt om op dit bericht te reageren.</span>
              </label>
              {submitState === 'error' && <p className="form-error" role="alert">{formError}</p>}
              <button className="button button-primary" type="submit" disabled={submitState === 'sending'}>
                {submitState === 'sending' ? 'Bezig met versturen…' : 'Verstuur bericht'}
                {submitState !== 'sending' && <ArrowRight size={17} aria-hidden="true" />}
              </button>
            </form>
          )}
        </section>
      </main>

      <footer>
        <div className="footer-top">
          <a className="brand" href="#top"><span>D.E</span> <strong>Zorg</strong></a>
          <div className="footer-contact">
            <p>Persoonlijke zorg aan huis en professionele inzet binnen de ouderenzorg.</p>
            <a href="mailto:lenie.eranio@hotmail.com">lenie.eranio@hotmail.com</a>
          </div>
          <a className="button button-primary" href="mailto:lenie.eranio@hotmail.com" data-contact-cta>E-mail D.E Zorg</a>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} D.E Zorg · KvK 82894248</p>
          <div>
            <a href="/klachten-en-geschillen">Klachten en geschillen</a>
            <button type="button" onClick={() => setPrivacyOpen(true)}>Privacyverklaring</button>
          </div>
        </div>
      </footer>

      <a className={showMobileContact ? 'mobile-contact is-visible' : 'mobile-contact'} href="#contact">Contact <ArrowRight size={17} aria-hidden="true" /></a>

      {privacyOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setPrivacyOpen(false)}>
          <section className="privacy-modal" role="dialog" aria-modal="true" aria-labelledby="privacy-title" onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setPrivacyOpen(false)} aria-label="Privacyverklaring sluiten"><X aria-hidden="true" /></button>
            <p className="eyebrow">Privacy</p>
            <h2 id="privacy-title">Privacyverklaring D.E Zorg</h2>
            <p>D.E Zorg verwerkt alleen de persoonsgegevens die u zelf via het contactformulier verstrekt: uw naam, e-mailadres, eventuele organisatie, onderwerp en bericht.</p>
            <h3>Waarom worden deze gegevens gebruikt?</h3>
            <p>Om uw vraag te beantwoorden, contact met u op te nemen en, als dat van toepassing is, een mogelijke zorg- of samenwerkingsvraag te bespreken.</p>
            <h3>Bewaren en delen</h3>
            <p>Uw gegevens worden niet verkocht en alleen gedeeld met dienstverleners die nodig zijn voor hosting en e-mailbezorging. Gegevens worden niet langer bewaard dan nodig is voor de afhandeling van uw bericht en wettelijke verplichtingen.</p>
            <h3>Uw rechten</h3>
            <p>U kunt vragen om inzage, correctie of verwijdering van uw gegevens. Gebruik daarvoor het contactformulier en kies “Iets anders”. Deel geen medische gegevens via het formulier.</p>
            <button type="button" className="button button-primary" onClick={() => setPrivacyOpen(false)}>Sluiten</button>
          </section>
        </div>
      )}
    </>
  );
}
