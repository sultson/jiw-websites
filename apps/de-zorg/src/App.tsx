import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  Check,
  HeartHandshake,
  Menu,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
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
    text: 'Rustig luisteren, aanwezig zijn en oog houden voor wat een cliënt nodig heeft.',
  },
  {
    icon: ShieldCheck,
    title: 'Secuur',
    text: 'Zorgvuldig werken, professioneel rapporteren en gemaakte afspraken nakomen.',
  },
  {
    icon: UserRoundCheck,
    title: 'Zelfstandig én samen',
    text: 'Zelfstandig inzetbaar en een betrokken teamspeler binnen de organisatie.',
  },
];

export default function App() {
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
    setSubmitState('sending');
    setFormError('');

    try {
      const response = await fetch('/api/forms/contact', {
        method: 'POST',
        body: new FormData(event.currentTarget),
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message || 'Het bericht kon niet worden verstuurd.');
      event.currentTarget.reset();
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
            <h1>Professionele inzet in de <em>ouderenzorg.</em></h1>
            <p className="hero-intro">
              D.E Zorg ondersteunt zorginstellingen en bemiddelingsbureaus met betrouwbare, zelfstandige inzet binnen de ouderenzorg. Met aandacht voor cliënten, heldere communicatie en respect voor de werkwijze van de organisatie.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#contact" data-contact-cta>Contact <ArrowRight size={17} aria-hidden="true" /></a>
              <a className="text-link" href="#over">Maak kennis met D.E Zorg</a>
            </div>
          </div>
          <div className="hero-image-wrap">
            <img src="/images/hero-care.webp" alt="Een zorgprofessional geeft persoonlijke aandacht aan een oudere cliënt" />
            <p className="image-note"><span>Professioneel.</span> Betrokken. Betrouwbaar.</p>
          </div>
        </section>

        <section className="trust-strip" aria-label="Uitgangspunten">
          <p><Check aria-hidden="true" /> Inzet binnen de ouderenzorg</p>
          <p><Check aria-hidden="true" /> Professioneel en zelfstandig</p>
          <p><Check aria-hidden="true" /> Betrouwbare samenwerking</p>
        </section>

        <section className="about section" id="over">
          <div>
            <p className="eyebrow">Over D.E Zorg</p>
            <h2>Een ervaren professional, met aandacht voor de mens.</h2>
          </div>
          <div className="about-copy">
            <p className="lead">
              D.E Zorg is de zelfstandige zorgonderneming van Lenie. Zij is inzetbaar binnen ouderenzorginstellingen en werkt samen met zorgorganisaties en bemiddelingsbureaus.
            </p>
            <p>
              Lenie werkt secuur, handelt zelfstandig en sluit zorgvuldig aan op bestaande werkafspraken en zorgprocessen. Daarbij houdt ze oog voor de wensen en het vertrouwde ritme van cliënten en stemt ze professioneel af met collega’s, naasten en andere betrokken zorgprofessionals.
            </p>
          </div>
        </section>

        <section className="approach section" id="werkwijze">
          <div className="approach-panel">
            <p className="eyebrow">De werkwijze</p>
            <h2>Goede zorg begint bij een goed gesprek.</h2>
            <p>Elke opdracht is anders. Daarom begint D.E Zorg met luisteren, afstemmen en heldere afspraken.</p>
            <ol>
              <li><span>01</span><div><strong>Kennismaken</strong><p>De organisatie deelt de zorgvraag, werkomgeving en gewenste inzet.</p></div></li>
              <li><span>02</span><div><strong>Afstemmen</strong><p>Taken, verantwoordelijkheden, planning en werkafspraken worden helder afgestemd.</p></div></li>
              <li><span>03</span><div><strong>Zorg met aandacht</strong><p>De zorg wordt zorgvuldig uitgevoerd, met aandacht voor cliënten en hun vertrouwde ritme.</p></div></li>
            </ol>
          </div>
        </section>

        <section className="values section" id="kernwaarden">
          <div className="section-heading">
            <p className="eyebrow">Waar D.E Zorg voor staat</p>
            <h2>Professioneel in het werk, betrokken bij de cliënt.</h2>
            <p>De kernwaarden van D.E Zorg vormen de basis voor iedere opdracht en samenwerking.</p>
          </div>
          <div className="value-grid">
            {values.map(({ icon: Icon, title, text }) => (
              <article className="value-card" key={title}>
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="membership section">
          <div>
            <p className="eyebrow">Professioneel aangesloten</p>
            <h2>Lid van SoloPartners</h2>
            <p>D.E Zorg is aangesloten bij SoloPartners, de brancheorganisatie voor zelfstandig zorgprofessionals.</p>
            <a className="text-link" href="https://www.solopartners.nl/" target="_blank" rel="noreferrer">Meer over SoloPartners <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
          <a className="partner-logo" href="https://www.solopartners.nl/" target="_blank" rel="noreferrer" aria-label="Bezoek SoloPartners">
            <img src="/images/solopartners.svg" alt="SoloPartners" />
          </a>
        </section>

        <section className="contact section" id="contact" data-contact-cta>
          <div className="contact-copy">
            <p className="eyebrow">Contact</p>
            <h2>Een inzet of samenwerking bespreken?</h2>
            <p>Zorginstellingen en bemiddelingsbureaus kunnen via het formulier contact opnemen. Lenie reageert zo spoedig mogelijk per e-mail.</p>
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
                  <option value="samenwerking">Een samenwerking</option>
                  <option value="klacht">Een klacht of onvrede</option>
                  <option value="anders">Iets anders</option>
                </select>
              </label>
              <label>Uw bericht
                <textarea name="message" rows={5} required placeholder="Omschrijf kort de organisatie, werkomgeving en gewenste inzet. Deel geen medische gegevens." />
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
            <p>Professionele en betrokken inzet binnen de ouderenzorg.</p>
            <a href="mailto:lenie.eranio@hotmail.com">lenie.eranio@hotmail.com</a>
          </div>
          <a className="button button-primary" href="mailto:lenie.eranio@hotmail.com" data-contact-cta>E-mail D.E Zorg</a>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} D.E Zorg · KvK 82894248</p>
          <div>
            <a href="https://www.solopartners.nl/klachtenregeling" target="_blank" rel="noreferrer">Klachtenregeling</a>
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
            <p>Om uw vraag te beantwoorden, contact met u op te nemen en — als dat van toepassing is — een mogelijke zorg- of samenwerkingsvraag te bespreken.</p>
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
