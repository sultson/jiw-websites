import { useLang } from './hooks/useLang';
import { useReveal } from './hooks/useReveal';
import Aurora from './components/Aurora';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Capabilities from './components/Capabilities';
import Approach from './components/Approach';
import Team from './components/Team';
import CtaBand from './components/CtaBand';
import Footer from './components/Footer';
import StickyCta from './components/StickyCta';

export default function App() {
  const { lang, setLang, c } = useLang();
  useReveal();

  return (
    <div className="relative min-h-[100dvh] overflow-x-clip">
      <Aurora />

      <Nav lang={lang} setLang={setLang} c={c} />

      <main>
        <Hero c={c} />
        <Capabilities c={c} />
        <Approach c={c} />
        <Team c={c} />
        <CtaBand c={c} />
      </main>

      <Footer c={c} />
      <StickyCta c={c} />
    </div>
  );
}
