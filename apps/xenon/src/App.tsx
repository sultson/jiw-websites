import { useState } from 'react';
import { useLang } from './hooks/useLang';
import Nav from './components/Nav';
import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import Cameras from './components/Cameras';
import Services from './components/Services';
import Werkwijze from './components/Werkwijze';
import Dekking from './components/Dekking';
import Spoedhulp from './components/Spoedhulp';
import Faq from './components/Faq';
import Footer from './components/Footer';
import SpoedFab from './components/SpoedFab';
import SpoedModal from './components/SpoedModal';
import IntakeModal from './components/IntakeModal';

export default function App() {
  const { lang, setLang, t } = useLang();
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [spoedOpen, setSpoedOpen] = useState(false);

  const openIntake = () => setIntakeOpen(true);
  const closeIntake = () => setIntakeOpen(false);
  const openSpoed  = () => setSpoedOpen(true);
  const closeSpoed = () => setSpoedOpen(false);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-night text-steel">
      <Nav lang={lang} setLang={setLang} t={t} onIntake={openIntake} onSpoed={openSpoed} />

      <main className="flex-1">
        <Hero t={t} onIntake={openIntake} onSpoed={openSpoed} />
        <TrustStrip t={t} />
        <Cameras t={t} onIntake={openIntake} />
        <Services t={t} onIntake={openIntake} />
        <Werkwijze t={t} />
        <Dekking t={t} />
        <Spoedhulp t={t} onSpoed={openSpoed} />
        <Faq t={t} />
      </main>

      <Footer t={t} onIntake={openIntake} />

      <SpoedFab t={t} onClick={openSpoed} hidden={spoedOpen || intakeOpen} />
      <SpoedModal open={spoedOpen} onClose={closeSpoed} onIntake={openIntake} t={t} />
      <IntakeModal open={intakeOpen} onClose={closeIntake} t={t} />
    </div>
  );
}
