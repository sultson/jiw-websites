import { useState } from 'react';
import { useLang } from './hooks/useLang';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Services from './components/Services';
import Werkwijze from './components/Werkwijze';
import Werk from './components/Werk';
import Behang from './components/Behang';
import Historie from './components/Historie';
import Reviews from './components/Reviews';
import Faq from './components/Faq';
import Footer from './components/Footer';
import StickyCta from './components/StickyCta';
import IntakeModal from './components/IntakeModal';

export default function App() {
  const { lang, setLang, t } = useLang();
  const [intakeOpen, setIntakeOpen] = useState(false);
  const openIntake = () => setIntakeOpen(true);
  const closeIntake = () => setIntakeOpen(false);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-paper">
      <Nav lang={lang} setLang={setLang} t={t} onIntake={openIntake} />

      <main className="flex-1">
        <Hero t={t} onIntake={openIntake} />
        <Services t={t} onIntake={openIntake} />
        <Werkwijze t={t} />
        <Werk t={t} />
        <Behang t={t} />
        <Historie t={t} />
        <Reviews t={t} />
        <Faq t={t} />
      </main>

      <Footer t={t} onIntake={openIntake} />

      <StickyCta t={t} onIntake={openIntake} hidden={intakeOpen} />
      <IntakeModal open={intakeOpen} onClose={closeIntake} t={t} />
    </div>
  );
}
